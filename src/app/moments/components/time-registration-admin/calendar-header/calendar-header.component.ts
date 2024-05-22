import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { UsersService } from "src/app/core/services/users.service";
import { ProjectsService } from "src/app/core/services/projects.service";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { GetUsersStore } from "../calendar-header/get-users-store.service";
import * as moment from "moment";
import { TranslateService } from "@ngx-translate/core";

declare var $: any;
const USER_GET_LIMIT = 50;

@Component({
  selector: "app-calendar-header",
  templateUrl: "./calendar-header.component.html",
  styleUrls: [
    "./calendar-header.component.css",
    "../time-registration-admin.component.css",
  ]
})
export class CalendarHeaderComponent implements OnInit {

  @Output() initiallyGenerateCalendar = new EventEmitter<any>();
  @Output() detectChanges = new EventEmitter<any>();
  @Output() filterAbsences = new EventEmitter<any>();
  @Output() filterProjects = new EventEmitter<any>();
  @Output() emitUserSearch = new EventEmitter<any>();
  @Output() addAdditionalUsers = new EventEmitter<any>();
  @Output() setSpinner = new EventEmitter<any>();
  @Output() resetUsers = new EventEmitter<any>();
  @Input("selectedTabs") selectedTabs;
  @Input("absenceTypes") absenceTypes;
  @Input('spinner') spinner;

  public currentDate: any;
  public fullMonths: any;
  public monthName: any;
  public weekDays: any;
  public months: any;
  public start_date: any;
  public last_date: any;
  public firstDate: any;
  public secondDate: any;
  public months_ = [];
  public calendar: any[] = [];
  public firstCalDate;
  public fetched = 35;
  public lastFetched = 35;
  public projects: any = [];
  public headerForm = this.fb.group({
    project: ['', []],
    project_name: [this.translate.instant("Project"), []],
  });
  public TypeForm = this.fb.group({
    type_id: ['0', []],
    type_name: [this.translate.instant("User types"), []],
  });
  public UEForm = this.fb.group({
    ue_id: ['0', []],
    ue_name: ['UE', []],
  });
  public absenceTypesFilter = {
    all: false,
  };
  public searchValue = "";
  public statusObject: any = {};
  public userDetails: any;
  public language = "sw";
  public start = -1;
  public paramsSub;
  public monthCount = 35;
  public offset = 0;
  public gettingAdditionalUsers = false;
  public projectId = '';
  public firstDayIndex = -1;
  public user_types = [];
  public type_id = '';
  public ue_id = '';
  public searchValueUpdate = new Subject<string>();
  public getUsersWithMomentsSub;

  @Input('fetchUsers') set setFetchUsers(value) {

    if (value.position > 0 && value.allFetched === false) {
      this.getAdditionalUsers();
      return;
    }
    this.offset = value.offset;
  };

  public overlayUser = false
  @Input("RowNumber") set setActive(value) {
    if (value !== -1) {
      this.overlayUser = true;
    } else {
      this.overlayUser = false;
    }
  };

  public getUserSub;
  public user_ue;

  constructor(
    private timeRegService: TimeRegistrationService,
    private projectsService: ProjectsService,
    private usersService: UsersService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private getUsersStore: GetUsersStore,
    private router: Router,
    public translate: TranslateService,
  ) {
    this.searchValueUpdate.pipe(
      debounceTime(500),
      distinctUntilChanged())
      .subscribe(value => {
        this.searchValue = value;
        this.getData();
      });
  }

  ngOnInit() {

      this.paramsSub = this.route.queryParams.subscribe((params) => {

        const currentDate = params.date ? this.selectDate(params.date) : this.selectDate(new Date());
        this.currentDate = moment(currentDate, "YYYY-MM-DD");
        this.monthCount = moment(this.currentDate).daysInMonth();
        this.searchValue = params.s ? params.s : '';
        const projectId = params.projectId;
        this.projectId = projectId < 1 || !projectId  ? '' : projectId;
        const fetched_ = Number(params.fetched);
        this.fetched = isNaN(fetched_) ? moment(this.currentDate).daysInMonth() : fetched_;
        this.headerForm.get('project').patchValue(this.projectId.toString());
        this.generateDateSpanForLink();
        this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
        this.language = this.userDetails.language;
        this.getProjects();
        this.getUserTypes();
        this.getUserUE();
        this.weekDays = this.currentDate["_locale"]["_weekdaysShort"];
        const date = this.currentDate.format("YYYY-MM-DD");
        this.fullMonths = this.currentDate["_locale"]["_months"];
        const monthNumber = <any>moment(date).month(date).format("M") - 1;
        this.monthName = this.fullMonths[monthNumber];
        setTimeout(()=>{
          this.getAbsenceTypes();
        }, 1000);

        $("#dateSelectStartDate")
          .datepicker({
            format: "mm-yyyy",
            viewMode: "months",
            minViewMode: "months",
            autoclose: true,
            language: this.language,
            todayHighlight: true,
            currentWeekSplitChar: "-",
            weekStart: 1,
          })
          .on("changeDate", (ev) => {

            const date = this.selectDate(ev.date);
            this.currentDate = moment(date);
            this.firstCalDate = moment(date);
            this.getData();

          });
      });
      this.unsubFromParams();
      this.subToGetUsers();
  }

  subToGetUsers() {

    this.getUserSub = this.getUsersStore.params$.subscribe((params)=>{

      const { s, projectId, fetched, date } = params;

      this.searchValue = s;
      this.projectId = projectId;
      this.fetched = fetched;
      this.currentDate = date;
      this.firstCalDate = moment(date);
      this.offset = 0;
      this.monthCount = moment(this.currentDate).daysInMonth();
      this.generateDateSpanForLink();
      this.getData();
    });
  }

  selectDate(date) {
    const eventDate = moment(date).format('YYYY-MM');
    const currentDate = moment(new Date()).format('YYYY-MM');
    if (eventDate === currentDate && this.fetched === this.monthCount) {
      date = moment(new Date());
    }
    return date;
  }

  unsubFromGetUser() {
    if (this.getUserSub) {
      this.getUserSub.unsubscribe();
    }
  }

  unsubFromParams() {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.unsubFromParams();
    this.unsubFromGetUser();
  }

  generateDateSpanForLink() {
    const { firstDate, secondDate } = this.resolveCurrentDayProblem();
    this.start_date = firstDate;
    this.last_date = secondDate;
  }

  filterUserList() {
    this.projectId = this.headerForm.get("project").value;
    this.getData();
  }

  filterUserTypeList(event) {

    let selected = this.user_types[event.index];
    this.TypeForm.get("type_id").patchValue(selected.id.toString());
    this.TypeForm.get("type_name").patchValue(selected.finalName.toString());
    this.type_id = selected.id;
    this.getData();
  }

  filterUserUE(event) {

    let selected = this.user_ue[event.index];
    this.UEForm.get("ue_id").patchValue(selected.id.toString());
    this.UEForm.get("ue_name").patchValue(selected.finalName.toString());
    this.ue_id = selected.id;
    this.getData();
  }

  getProjects() {
    this.projectsService.getProjectsAndActivitiesForCalendar(this.start_date, this.last_date, this.searchValue).then((projects:any) => {

      this.projects = projects.map((proj) => {
        proj.finalName = `${proj.CustomName} - ${proj.Name}`;
        return proj;
      });
      this.projects.unshift({
        id: '',
        finalName: "Project",
        Name: '',
        CustomName: '',
      });
      this.detectChanges.emit("refresh");
      this.sortProjectsByNumber('first_gear');
    });
  }

  getUserTypes() {
    this.usersService.getUserTypes().then((res:any) => {

      if(res.status) {
        this.user_types = res['data'];
        this.user_types.unshift({
          id: '0',
          finalName: "User types",
          Name: '',
          CustomName: '',
        });
      }
    });
  }

  getUserUE() {
    this.usersService.getUserUE().then((res:any) => {

      if(res.status) {
        this.user_ue = res['data'];
        this.user_ue.unshift({
          id: '0',
          finalName: "UE",
          Name: '',
          CustomName: '',
        });
      }
    });
  }

  sortByStatus() {
    const projectStatus = [2,4,1,3];
    let currentStatus = 0;
    let sortedProjects = [];
    while(currentStatus < projectStatus.length) {
      for (let selectedProject of this.projects) {
        if (selectedProject.Status == projectStatus[currentStatus]) sortedProjects.push(selectedProject);
      }
      currentStatus++;
    }

    return sortedProjects;
  }

  reverseCompletedProjects() {
    let completedProjects = this.projects.filter(x => x.Status == 3);
    completedProjects = completedProjects.reverse();
    this.projects = this.projects.filter(x => x.Status != 3);
    this.projects = [...this.projects, ...completedProjects];
  }


  sortProjectsByNumber(type) {
    const sortBy = [2, 4, 1, 3, 5];
    const sortByObject = sortBy.reduce((a, c, i) => {
      a[c] = i;
      return a;
    }, {});

    this.projects = this.projects.sort((project1, project2) => {
      const a_nr = project1.CustomName.replace(/\D/g, "");
      const b_nr = project2.CustomName.replace(/\D/g, "");
      const a_s = project1.status;
      const b_s = project2.status;
      const status_compare =
        Number(sortByObject[a_s]) - Number(sortByObject[b_s]);

      if (a_s == 3 && b_s == 3) {
        if (type === "reverse") {
          return status_compare || Number(a_nr) - Number(b_nr);
        }

        return status_compare || Number(b_nr) - Number(a_nr);
      }

      return status_compare || Number(a_nr) - Number(b_nr);
    });


    // Da poreda podprojekte ispod projekata
    this.reverseCompletedProjects();
    this.projects = this.sortByStatus();
    const onlyProjects = this.projects.filter(x => !x.CustomName.includes('-'));
    const coProjects = this.projects.filter(x => x.CustomName.includes('-'));

    let sortedProjects = [];
    for (let i = 0; i < onlyProjects.length; i++) {
      sortedProjects.push(onlyProjects[i]);
      for (let j = 0; j < coProjects.length; j++) {
        if (coProjects[j].CustomName.includes(onlyProjects[i].CustomName) && onlyProjects[i].CustomName !== '') {
          sortedProjects.push(coProjects[j]);
        }
      }
    }

    this.projects = sortedProjects;
    this.projects = [
      {
        id: '',
        finalName: 'Project',
        Name: '',
        CustomName: ''
      },
      ...this.projects
    ];
  }


  ngAfterViewInit() {
    this.generateFirstAndLastDate();
  }

  setMonth(days) {
    this.offset = 0;
    const firstDayObject = moment(new Date(this.currentDate), "YYYY-MM-DD");
    if (days > 0) {
      if (this.fetchedMonth()) {
        firstDayObject.add(1, "months");
        this.currentDate = firstDayObject;
        const daysInMonth = firstDayObject.daysInMonth();
        this.fetched = daysInMonth;
        this.monthCount = daysInMonth;
      } else {
        firstDayObject.add(Number(this.fetched), "days");
        this.currentDate = firstDayObject;
      }
    } else {

      if (this.fetchedMonth()) {
        firstDayObject.subtract(Math.abs(1), "months");
        this.currentDate = firstDayObject;
        const daysInMonth = firstDayObject.daysInMonth();
        this.fetched = daysInMonth;
        this.monthCount = daysInMonth;
      } else {
        firstDayObject.subtract(Number(this.fetched), "days");
        this.currentDate = firstDayObject;
      }
    }
    this.currentDate = this.selectDate(this.currentDate);
    this.getData();
  }

  getData() {
    this.setSpinner.emit(true);
    this.resetUsers.emit();
    this.detectChanges.emit("refresh");
    this.setCalendarStyle(this.fetched);
  }

  public first_Date = '';
  public second_Date = '';

  generateFirstAndLastDate() {
    this.start = -1;
    const daysInMonth = moment(this.currentDate).daysInMonth();
    this.monthCount = daysInMonth;
    const { firstDate, secondDate } = this.resolveCurrentDayProblem();
    this.first_Date = firstDate;
    this.second_Date = secondDate;
    const firstDate_ = this.firstDayOfCalendar(moment(this.first_Date));
    const secondDate_ = this.lastDayOfCalendar(moment(this.second_Date));
    const project_value = this.headerForm.get("project").value;
    const type_id = this.TypeForm.get("type_id").value;
    const ue_id = this.UEForm.get("ue_id").value;
    this.getDaysInMonths(firstDate_, secondDate_);

    this.initiallyGenerateCalendar.emit({
      calendar: this.calendar,
      nrOfWeeks: this.start + daysInMonth - 1,
      projectId: project_value,
      start: this.start,
      absenceTypesFilter: this.absenceTypesFilter,
      firstDayIndex: this.firstDayIndex,
      fetched: this.fetched,
      offset: this.offset,
      currentDate: this.currentDate,
      type_id: type_id,
      ue_id: ue_id,
      s: this.searchValue
    });
    this.firstCalDate = this.first_Date;
    this.calendar = [];

  }

  getDaysInMonths(firstDate, endDate) {
    const firstDayObject = moment(firstDate);
    const endDateFormat = moment(endDate).format("YYYY-MM-DD");
    const dateArray = [];
    let index = 0;
    let visible = true;
    while (true) {

      const date = firstDayObject.format("YYYY-MM-DD");
      const dateDay = firstDayObject.format("DD");
      const week = firstDayObject.week();
      const isoWeek = firstDayObject.isoWeek();
      const dayIndex = firstDayObject.day();
      const year = firstDayObject.year();
      const dayName = this.weekDays[dayIndex];
      const isNotWeekend = dayName !== "Sat" && dayName !== "Sun";
      const backgroundColor = isNotWeekend ? "white" : "#F0EFED";

      if (date == this.first_Date) {
        visible = false;
        this.firstDayIndex = index;
      }

      const obj = {
        date: date,
        week: week,
        isoWeek: isoWeek,
        day: dayIndex,
        dayName: dayName,
        dateDay: dateDay,
        year: year,
        backgroundColor: backgroundColor,
        boundary_condition: visible,
        today:
          new Date(date).toLocaleDateString("en-US") ===
          new Date().toLocaleDateString("en-US"),
        index: index,
      };

      if (date == this.second_Date) {
        visible = true;
      }

      dateArray.push(obj);
      if (endDateFormat === date) {
        break;
      }

      firstDayObject.add(1, "days");
      index = index + 1;

    }

    this.calendar = this.calendar.concat(dateArray);
  }

  firstDayOfCalendar(firstDay) {
    const lastWeek = firstDay.isoWeek();
    const firstDay2 = moment(firstDay.format("YYYY-MM-DD"));
    let numberOfDayToSubtract = -1;
    let index = -1;
    while (true) {
      if (firstDay2.isoWeek() === lastWeek) {
        firstDay2.subtract(1, "days");
        numberOfDayToSubtract = numberOfDayToSubtract + 1;
        index++;
        continue;
      }

      if (numberOfDayToSubtract === -1) {
        numberOfDayToSubtract = 0;
      }
      break;
    }

    firstDay.subtract(numberOfDayToSubtract, "days");
    this.start = index;
    return firstDay.format("YYYY-MM-DD");
  }

  lastDayOfCalendar(lastDay) {
    const lastWeek = lastDay.isoWeek();
    const lastDay2 = moment(lastDay.format("YYYY-MM-DD"));
    let numberOfDayToAdd = -1;
    let index = 0;

    while (true) {
      if (lastDay2.isoWeek() === lastWeek) {
        numberOfDayToAdd = numberOfDayToAdd + 1;
        index = index + 1;
        lastDay2.add(1, "days");
        continue;
      }
      if (numberOfDayToAdd === -1) {
        numberOfDayToAdd = 0;
      }
      break;
    }

    lastDay.add(numberOfDayToAdd, "days");
    return lastDay.format("YYYY-MM-DD");
  }

  getAdditionalUsers() {
    if (this.gettingAdditionalUsers) return;
      this.setSpinner.emit(true);
      this.gettingAdditionalUsers = true;
      if (this.offset === USER_GET_LIMIT) {
        this.unsubFromGetUsersWithMoments();
      }
      this.getUsersWithMomentsSub = this.getUsersWithMoments().subscribe((res:any)=>{
        const users = res.users;
        this.increaseOffset();
        this.addAdditionalUsers.emit(users);
        this.setSpinner.emit(false);
        this.gettingAdditionalUsers = false;
      });
  }

  unsubFromGetUsersWithMoments() {
    if (this.getUsersWithMomentsSub) {
      this.getUsersWithMomentsSub.unsubscribe();
    }
  }

  getUsersWithMoments() {

    const object = {
      first_date: this.start_date,
      last_date: this.last_date,
      offset: this.offset,
      searchValue: this.searchValue,
      projectId: this.projectId == '' || isNaN(Number(this.projectId)) ? 0 : this.projectId,
      fetched: this.fetched,
      limit: USER_GET_LIMIT,
      type_id: this.type_id == '' || isNaN(Number(this.type_id)) ? 0 : this.type_id,
      ue_id: this.ue_id == '' || isNaN(Number(this.ue_id)) ? 0 : this.ue_id,
    };

    this.resetQueryParams(object);
    return this.timeRegService
      .getUsersWithMoments(object);
  }

  resetQueryParams(object) {
    const currDate = moment(this.currentDate);
    window.history.replaceState({}, '',`/#/moments/time-registration-admin?s=${object.searchValue}&date=${currDate.format('YYYY-MM-DD')}&projectId=${object.projectId}&fetched=${object.fetched}&type_id=${object.type_id}&ue_id=${object.ue_id}`);
  }

  setMonthCount(value, f_date) {
    const month = moment(f_date);
    if (value == this.monthCount) {
      value = moment(month).daysInMonth();
      this.monthCount = value;
    }
    return value;
  }

  setCalendarStyle(value) {

    this.resetUsers.emit();
    this.detectChanges.emit("refresh");
    this.offset = 0;
    this.start = 0;
    const project_value = this.headerForm.get("project").value;
    const f_date = new Date(this.currentDate);
    value = this.setMonthCount(value, f_date);
    const e_date = new Date(this.currentDate);
    e_date.setDate(e_date.getDate() + value);
    const { firstDate, secondDate } = this.resolveCurrentDayProblem();
    this.first_Date = firstDate;
    this.second_Date = secondDate;
    this.lastFetched = value;
    this.setSpinner.emit(true);
    this.detectChanges.emit("refresh");
    this.start_date = moment(this.first_Date).format("YYYY-MM-DD");
    this.last_date = moment(this.second_Date).format("YYYY-MM-DD");
    this.unsubFromGetUsersWithMoments();
    const type_id = this.TypeForm.get("type_id").value;
    const ue_id = this.UEForm.get("ue_id").value;

    this.getUsersWithMomentsSub = this.getUsersWithMoments()
    .subscribe((response: any) => {
      this.fetched = value;
      this.getDaysInMonths(
        this.firstDayOfCalendar(moment(this.first_Date)),
        this.lastDayOfCalendar(moment(this.second_Date))
      );
      this.increaseOffset();

      this.initiallyGenerateCalendar.emit({
        calendar: this.calendar,
        users: response["users"],
        nrOfWeeks: this.start + value - 1,
        projectId: project_value,
        start: this.start,
        absenceTypesFilter: this.absenceTypesFilter,
        firstDayIndex: this.firstDayIndex,
        fetched: this.fetched,
        offset: this.offset,
        currentDate: this.currentDate,
        type_id: type_id,
        ue_id: ue_id,
        s: this.searchValue
      });
      this.calendar = [];
      this.detectChanges.emit("refresh");
    });
  }


  increaseOffset() {
    this.offset = this.offset + USER_GET_LIMIT;
  }

  getAbsenceTypes() {
    this.absenceTypes = this.absenceTypes.map((type) => {
      const status = this.selectedTabs[type.AbsenceTypeID] ? true : false;
      this.absenceTypesFilter[type.AbsenceTypeID] = status;
      return type;
    });
    const keys = Object.keys(this.selectedTabs);
    if (keys.length === this.absenceTypes.length) {
      this.absenceTypesFilter["all"] = true;
    }

    this.filterAbsences.emit(this.absenceTypesFilter);
    this.detectChanges.emit("refresh");
  }

  toggleFilter(type) {
    this.resetUsers.emit(true);
    this.setSpinner.emit(true);
    this.detectChanges.emit(true);
    const keys = Object.keys(this.absenceTypesFilter);
    const status = !this.absenceTypesFilter[type];
    if (type === "all") {
      this.checkAllAbsenceTypes(status, keys);
      this.filterAbsences.emit(this.absenceTypesFilter);
      return;
    }
    this.absenceTypesFilter[type] = !this.absenceTypesFilter[type];
    this.handleAllCondition(keys);
    this.filterAbsences.emit(this.absenceTypesFilter);
    this.createUserPermissionTabs(type, status);
    this.getData();
  }

  checkAllAbsenceTypes(value, keys) {
    const allPromises = [];
    for (let key of keys) {
      this.absenceTypesFilter[key] = value;
      if (key !== "all") {
        allPromises.push(this.createUserPermissionTabs(key, value));
      }
    }
    Promise.all(allPromises).then((res)=>{
      this.getData();
    });
  }

  handleAllCondition(keys) {
    let value = true;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key !== "all" && this.absenceTypesFilter[key] === false) {
        value = false;
        break;
      }
    }
    console.log(value)
    this.absenceTypesFilter["all"] = value;
  }

  createUserPermissionTabs(value, status) {
    const objData = {
      user_id: this.userDetails.user_id,
      tab_name: value,
      type: "TimeRegAdminCalendar",
    };
    if (status) {
      return this.usersService.createUserPermissionTabs(objData);
    } else {
      return this.usersService.deleteUserPermissionTabs(objData);
    }
  }

  fetchedMonth() {
    return (
      this.fetched != 14 &&
      this.fetched != 28.1 &&
      this.fetched != 42 &&
      this.fetched != 56
    );
  }

  resolveCurrentDayProblem() {
    const momentDate = moment(this.currentDate);
    let firstDate;
    let secondDate;
    if (this.fetchedMonth()) {
      const monthYear = moment(this.currentDate).format("MM-YYYY");
      firstDate =
        monthYear.split("-")[1] + "-" + monthYear.split("-")[0] + "-01";
      secondDate =
        monthYear.split("-")[1] +
        "-" +
        monthYear.split("-")[0] +
        "-" +
        momentDate.daysInMonth();
      return { firstDate, secondDate };
    }
    firstDate = this.firstDayOfCalendarWeeks(momentDate);
    secondDate = this.lastDayOfCalendarWeeks(
      moment(firstDate).add(this.fetched, "days")
    );
    this.start = 0;
    return { firstDate, secondDate };
  }

  lastDayOfCalendarWeeks(lastDay) {
    const lastWeek = lastDay.isoWeek();
    const lastDay2 = moment(lastDay.format("YYYY-MM-DD"));
    let numberOfDayToAdd = -1;
    let index = 0;
    while (true) {
      if (lastDay2.isoWeek() === lastWeek) {
        numberOfDayToAdd = numberOfDayToAdd + 1;
        index = index + 1;
        lastDay2.add(1, "days");
        continue;
      }
      if (numberOfDayToAdd === -1) {
        numberOfDayToAdd = 0;
      }
      break;
    }
    lastDay.add(numberOfDayToAdd, "days");
    return lastDay.format("YYYY-MM-DD");
  }

  calculateLastWeek(firstDay) {
    let lastWeek = firstDay.isoWeek() - 2;

    if (lastWeek < 1) {
      const firstDay_ = moment(firstDay).subtract(60, "days");
      lastWeek = firstDay_.isoWeeksInYear();
    }
    return lastWeek;
  }

  firstDayOfCalendarWeeks(firstDay) {
    const lastWeek = this.calculateLastWeek(firstDay);
    const firstDay2 = moment(firstDay.format("YYYY-MM-DD"));
    let numberOfDayToSubtract = -1;
    while (true) {
      if (firstDay2.isoWeek() !== lastWeek) {
        firstDay2.subtract(1, "days");
        numberOfDayToSubtract = numberOfDayToSubtract + 1;
        continue;
      }

      if (numberOfDayToSubtract === -1) {
        numberOfDayToSubtract = 0;
      }
      break;
    }
    firstDay.subtract(numberOfDayToSubtract, "days");
    return firstDay.format("YYYY-MM-DD");
  }

  back() {

    const date = moment(new Date());
    const selectedDate = moment(this.currentDate).format('YYYY-MM');

    if (date.format('YYYY-MM') === selectedDate) {
      this.router.navigate([
        '/timesheets/schedule-calendar'],
      );
    } else {
      this.searchValue = '';
      this.getUsersStore.setParams({
        s: '',
        projectId: 0,
        fetched: date.daysInMonth(),
        date: date.format('YYYY-MM-DD')

      });
    }
  }

  redirectToPayroll() {
    this.router.navigate(
      ['/timesheets/time-registration-admin/user-detail/payroll'],
      {
        queryParams: {
          pdate: this.currentDate.format('YYYY-MM-DD'),
          fromTimeRegistration: 1
        },
        queryParamsHandling: 'merge'
      });
  }
}
