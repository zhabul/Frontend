import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { EditFlexComponent } from "src/app/timesheets/components/edit-flex/edit-flex.component";
import * as moment from "moment";
import {Location} from '@angular/common';
declare var $;

@Component({
  selector: "app-user-details-admin",
  templateUrl: "./user-details-admin.component.html",
  styleUrls: ["./user-details-admin.component.css", "./user-details-header.css"],
})
export class UserDetailsAdminComponent implements OnInit, AfterViewInit {

  @ViewChild('wrapper') wrapper;
  public summary;
  public language = "en";
  public userId;
  public choosenDate: any;
  public absenceDetails: any[] = [];
  public momentDetails: any[] = [];
  public mileage_totals:any = { };
  public weekDays: any;
  public currentDate: any;
  public fullMonths: any;
  public calendar: any[] = [];
  public calendarFieldWidth: any;
  public tableFixWrapper: any;
  public tableWrapper: any;
  public Date: any;
  public showFooterAnalitic: boolean = false;
  public timlineBodyWrapperWidth: number = 10340;
  public monthName: any;
  public total: any[] = [];
  public start_date: any;
  public last_date: any;
  public userIndex: number;
  public choosenUserId: any;
  public users: any[] = [];
  public overTime: number = 0;
  public spinner = false;
  public totalAbsenceDays = 0;
  public total_work: number = 0;
  public user_flex: number = 0;
  public total_flex: number = 0;
  public working_hours: number = 0;
  public year = "";
  public fetchingMomentDetails: boolean = false;
  public absence_type_ids: any = [];
  public allowInputValue: boolean = false;
  public allowToSave: boolean = false;
  public total_per_type: any;
  public total_of_all_absences: any;
  public total_per_date: any;
  public work_time = {
    set: false,
    total: 0,
  };
  public flex_time = {
    set: false,
    total: 0,
  };
  public lone_time = {
    set: false,
    total: 0,
  };

  public mileageTotal = {
    private: 0,
    privateLast: false,
    company: 0,
    companyLast: false,
  };

  public absenceTotalPerName = [];

  public absenceTotals = {
    totalDate: 0,
    totalName: 0,
  };
  public mileagesObj = {};
  public rightLineStyles:any = { display: 'none' };
  public userDetails:any = {language: 'en'};
  public paramsSub;

  public mileages = [];
  public company_wage_type:any;
  public allow_flex:boolean = false;
  public wage_type:any;
  public work_hours:number = 0;
  public total_off_all_finaly_total:any;
  public milagesZero:boolean=false;


  constructor(
    private route: ActivatedRoute,
    private timeRegistrationService: TimeRegistrationService,
    private router: Router,
    private dialog: MatDialog,
    private location: Location
  ) {}

  ngOnInit() {
    this.getCompanyWageType();
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    this.language = this.userDetails.language;

    this.summary = this.route.snapshot.data["summary"]["data"];
    this.mileages = this.route.snapshot.data['mileages']['data'];
    if(this.mileages.length == 0)
    {
       this.milagesZero=true;
    }


    const today = new Date();
    this.currentDate = moment(today, "YYYY-MM-DD");
    this.weekDays = this.currentDate["_locale"]["_weekdaysShort"];
    const date = this.currentDate.format("YYYY-MM-DD");
    this.fullMonths = this.currentDate["_locale"]["_months"];

    this.start_date = moment(date).startOf('month').format('YYYY-MM-DD');
    this.last_date = moment(date).endOf('month').format('YYYY-MM-DD');

    this.paramsSub = this.route.params.subscribe((params) => {
      this.userId = params.id;
      this.choosenDate = params.date ? params.date : moment().format('YYYY-MM-DD');

      this.calendar = [];
      this.initializeDatePicker();

    });

    this.absence_type_ids = {
      create: {},
      update: {},
      removed: [],
    };

    this.toggleBodyScroll("hidden");
    this.startCalendar();
  }

  ngAfterViewInit(){
    this.setResize();
    setTimeout(()=>{
      this.setRightLineHeight();
    }, 3000);
    setTimeout( () => {
      this.checkPermssion();
    }, 2000 );
  }

  checkPermssion() {
      if (this.userDetails.create_timesheets_time_report_management) {
         $("input").removeAttr('disabled');
      }else {
        $("input").not('.sps-autocomplete-select').attr('disabled','disabled');
      }
  }

  ngOnDestroy() {
    this.toggleBodyScroll("auto");
    this.removeResizeEvent();
    this.paramsSub.unsubscribe();
  }

  public resizeEvent;

  setRightLineHeight() {
    const height = this.wrapper.nativeElement.getBoundingClientRect().height;
    this.rightLineStyles = { height: `${height - 15}px`, display: 'block' };
  }

  setResize() {
    this.resizeEvent = this.setRightLineHeight.bind(this);
    window.addEventListener('resize', this.resizeEvent);
  }

  removeResizeEvent() {
    window.removeEventListener('resize', this.resizeEvent);
  }

  toggleBodyScroll(scroll) {
    document.getElementsByTagName("body")[0].style.overflow = scroll;
  }

  initializeDatePicker() {
    setTimeout(()=>{
      $("#dateSelectStartDate")
      .datepicker({
        autoclose: true,
        language: this.language,
        todayHighlight: true,
        format: "M-yyyy",
        startView: "months",
        minViewMode: "months",
        weekStart: 1,
      })
      .on("changeDate", (ev) => {
        this.choosenDate = moment(new Date(ev.date)).format('YYYY-MM-DD');
        this.startCalendar();
      });
    }, 3000);
  }

  startCalendar() {
    this.resetAbsenceDetails();
    this.resetTotals();
    const first_date = moment(new Date(this.choosenDate));
    const last_date = moment(first_date).endOf('month').format('YYYY-MM-DD');
    /* const firstDate_ = this.firstDayOfCalendar(moment(first_date));
     const secondDate_ = this.lastDayOfCalendar(moment(last_date)); */
    this.getDaysInMonths(first_date, last_date);
    this.getAbsenceUserDetails();
    this.getWorkUserDetails();
    this.getTotalUserDetailsPerDate();
    this.setActiveRoute();
  }

  setActiveRoute() {
    const href = window.location.href.split('?');
    const qParams = href[1] ? `?${href[1]}` : '';
    const url = `timesheets/time-registration-admin/user-detail/${this.userId}/${this.choosenDate}`;
    this.location.go(`${url}${qParams}`);
  }

  resetTotals() {
    this.absenceDetails = [];
    this.momentDetails = [];
    this.mileage_totals = { };
    this.work_time = {
      set: false,
      total: 0,
    };
    this.flex_time = {
      set: false,
      total: 0,
    };
    this.lone_time = {
      set: false,
      total: 0,
    };
    this.mileageTotal = {
      private: 0,
      privateLast: false,
      company: 0,
      companyLast: false,
    };
    this.absenceTotals = {
      totalDate: 0,
      totalName: 0,
    };
  }

  getDaysInMonths(firstDate, endDate) {

    this.calendar = [];
    const firstDayObject = moment(firstDate);
    const endDateFormat = moment(endDate).format("YYYY-MM-DD");
    const dateArray = [];
    let index = 0;
    let visible = true;
    let displacementIndex = 0;
    let currentIsoWeek = -1;

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
      const weekText = dayIndex === 0 || date === endDate ? `V.${isoWeek}` : '';

      if (currentIsoWeek !== isoWeek) {
        currentIsoWeek = isoWeek;
        displacementIndex = 0;
      }

      const obj = {
        date: date,
        week: week,
        isoWeek: isoWeek,
        day: dayIndex,
        dayName: dayName,
        dateDay: dateDay,
        year: year,
        weekText: weekText,
        borderRight: dayIndex === 0 ? '1px solid var(--border-color)' : '',
        backgroundColor: backgroundColor,
        specialHoursBackgroundColor: backgroundColor,
        specialAbsenceBackgroundColor: backgroundColor,
        boundary_condition: visible,
        translate: `translateX(-${(displacementIndex / 2) * 45}px)`,
        today:
          new Date(date).toLocaleDateString("en-US") ===
          new Date().toLocaleDateString("en-US"),
        index: index,
      };

      displacementIndex = displacementIndex + 1;

      dateArray.push(obj);
      if (endDateFormat === date) {
        break;
      }

      firstDayObject.add(1, "days");
      index = index + 1;

    }
    this.calendar = this.calendar.concat(dateArray);
  }

  resetAbsenceDetails() {
    this.detailsKeys = [];
    this.mileagesObj = {};
    this.absenceDetails = [];
  }

  public detailsKeys = [];

  calculateAbsenceAndAbsenceTotalsForCalendar() {

    this.detailsKeys = Object.keys(this.absenceDetails);

    let absenceIndex = 0;

    for (let key of this.detailsKeys) {
      this.absenceDetails[key]['total'] = 0;

      let index = 0;
      for (let day of this.calendar) {

            if (this.absenceDetails[key][day.date]) {
              day[key] = this.absenceDetails[key][day.date];
              this.absenceDetails[key]['total'] = this.absenceDetails[key]['total'] + Number(this.absenceDetails[key][day.date].hours);
              this.absenceDetails[key]['total'] = Number(this.absenceDetails[key]['total'].toFixed(2));
            } else {
              day[key] = { ...this.absenceDetails[key], hours: '', Color: '' };
            }

            const date = day.date;
            const daysLength = this.calendar.length;
            const dayName = day.dayName;
            const lastAbsence = absenceIndex == this.detailsKeys.length - 1;
            this.printAbsences(date, index, day[key], daysLength, lastAbsence, dayName);
            index = index + 1;
      }
      absenceIndex = absenceIndex + 1;
    }

    this.spinner = false;
  }

  caliculateOffsetWidth() {
    this.calendarFieldWidth = $(".calendar-content-row-day").outerWidth();
    this.tableFixWrapper = $(".planner-content-wrapper").outerWidth();
    this.tableWrapper = $(".calendar-content-row").outerWidth();
  }

  openEditModal(overTime) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.data = { overTime, user_id: this.userId };
    this.dialog
      .open(EditFlexComponent, diaolgConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res && res["total"]) this.overTime = res["total"];
      });
  }

  setYearClass(index, object) {
    let calendarTableClassName = "table-calendar-" + object.year;
    return calendarTableClassName;
  }

  setMonthClass(index, month) {
    let calendarTableClassName = "table-calendar-month-" + month.name;
    return calendarTableClassName;
  }

  setDayClass(index, day) {
    let activeClass;
    let calendarTableClassName = "table-calendar-day-" + day.date;

    if (day.date == this.Date) activeClass = "active";
    else activeClass = "";

    return calendarTableClassName + " " + activeClass;
  }

  setWrapperWidth() {
    this.initializeStartWidth();
    let style;
    return style;
  }

  initializeStartWidth() {
    let arrayOfYears = $(".calendar-content-row-year");
    let offsetWidth = [];

    for (var i = arrayOfYears.length - 1; i >= 0; i--) {
      offsetWidth.push(arrayOfYears[i].offsetWidth);
    }

    let sum = offsetWidth.reduce((sum, x) => sum + x);
    this.timlineBodyWrapperWidth = sum;
  }

  onSelected(value) {
    let date = value.split("-");
    let month = date[0];
    let year = date[1];
    this.getData(month, year);
  }

  getData(month, year) {
    this.spinner = true;
    this.timeRegistrationService
      .getHoursByUserForCurrentMonth(this.userId, month, year)
      .subscribe((res) => {
        this.summary = res["data"];
      });
  }

  public test = false;

  getAbsenceUserDetails(from_save = false) {
    this.spinner = true;
    this.timeRegistrationService
      .getAbsenceUserDetails(this.userId, this.choosenDate)
      .subscribe((res) => {
        if (res["status"]) {
          if (from_save) {
            this.resetTotals();
          }

          this.absenceDetails = res["data"];
          this.calculateAbsenceAndAbsenceTotalsForCalendar();

          let totalAbsenceDaysWithoutWeekends = 0;
          Object.values(this.absenceDetails).forEach((absenceType) => {
            if (absenceType.length < 1) {
              return;
            }

            if (Object.keys(absenceType).length > 1) {
              Object.keys(absenceType).forEach((arg) => {
                if (arg != "UserAbsenceID") {
                  const weekNumber = moment(new Date(arg)).isoWeekday();
                  if (weekNumber !== 6 && weekNumber !== 7) {
                    totalAbsenceDaysWithoutWeekends++;
                  }
                }
              });
            }
          });
          this.totalAbsenceDays = totalAbsenceDaysWithoutWeekends;

          this.absence_type_ids = {
            create: {},
            update: {},
            removed: [],
          };
          if (from_save) {
            this.allowToSave = true;
            this.allowInputValue = false;
          }
        }
      });
  }

  public momentDetailsKeys = [];
  public measure_units:any[] = [];

  getWorkUserDetails() {

    this.fetchingMomentDetails = true;
    this.timeRegistrationService
      .getWorkUserDetails(this.userId, this.choosenDate)
      .subscribe((res) => {
        if (res["status"]) {

          this.work_hours = res["data"]['work_hours'];
          this.wage_type = res["data"]['wage_type'];
          this.momentDetails = res["data"];
          this.mileage_totals = res["mileage_totals"];
          this.total_off_all_finaly_total = res["data"]["total_off_all_finaly_total"];
          this.sumMileageTotals();
          this.initMomentDetails();
          this.fetchingMomentDetails = false;
          this.measure_units =  res["measure_units"];
        }
      });
  }

  public mileageTotalsSum = 0;
  sumMileageTotals() {
    this.mileageTotalsSum = 0;
    const keys = Object.keys(this.mileage_totals);
    keys.forEach((key)=>{
      this.mileageTotalsSum = this.mileageTotalsSum + Number(this.mileage_totals[key]);
    });
  }

  initMomentDetails() {
    this.setMomentDetailsKeys();
    this.addMomentTotalsToDay();
    this.setMomentTotals();
  }

  addMomentTotalsToDay() {

    for (let key of this.momentDetailsKeys) {
      for (let day of this.calendar) {
        if (day.date === key) {
          day['hours'] = this.printHours(day.date, "Total", day.dayName);
          day['hours_overtime'] = this.printHours(day.date, "Overtime", day.dayName);
          day['hours_lone'] = this.printHours(day.date, "LONEUNDERLAG", day.dayName);
          day['finally_total'] = this.momentDetails[day.date].finally_total + "h";
          if (day.hours_lone) {
            day.specialHoursBackgroundColor = '#FCDEBE';
          }
        }
        if (this.absenceTotals[day.date]) {
          day.specialAbsenceBackgroundColor = '#FCDEBE';
        }
      }
    }
  }

  printHours(date, type, dayName) {

    if (this.momentDetails[date] && type == "WorkingHours") {

      return this.momentDetails[date].work_hours_converted_to_decimal + "h";
    } else if (this.momentDetails[date] && type == "Overtime") {

      let total = this.momentDetails[date].bank_hours_converted_to_decimal;

      if (dayName === "Sat" || dayName === "Sun") {
        total = this.momentDetails[date].total_converted_to_decimal;
      }

      if (this.flex_time.set === false) {
        this.flex_time.total = this.flex_time.total + total;
      }

      return total + "h";

    } else if (this.momentDetails[date] && type == "Total") {

      const total = this.momentDetails[date].total_converted_to_decimal;

      if (this.work_time.set === false) {
        this.work_time.total = this.work_time.total + total;
      }

      if (dayName !== "Sat" && dayName !== "Sun") {
        this.fillAbsenceTotalByDateWork(date, total);
      }

      return total ? total + "h" : "";

    } else if (this.momentDetails[date] && type == "LONEUNDERLAG") {
      let total = 0;
      let bankHours = 0;

      if (dayName !== "Sat" && dayName !== "Sun") {
        bankHours = this.momentDetails[date].bank_hours_converted_to_decimal;
        total = this.momentDetails[date].total_converted_to_decimal;
      }

      let loneAbsence = this.absenceTotals[date]
        ? this.absenceTotals[date].loneAbsence
        : null;
      loneAbsence = loneAbsence ? loneAbsence : 0;

      if(loneAbsence > this.work_hours) {
        loneAbsence = this.work_hours;
      }


      let lone = 0;
      if(this.wage_type == 'Pays 8 hours of worked time, other time to Flexbanken') {
        lone = total - bankHours;
      }else {
        lone = total;
      }
      const loneWithAbsence = lone + loneAbsence;

      if (this.lone_time.set === false) {
        this.lone_time.total = this.lone_time.total + lone;
      }

      return loneWithAbsence ? loneWithAbsence + "h" : "";

    } else if (
      !this.momentDetails[date] &&
      this.absenceTotals[date] &&
      type == "LONEUNDERLAG"
    ) {

      let loneAbsence = this.absenceTotals[date]
        ? this.absenceTotals[date].loneAbsence
        : null;
      loneAbsence = loneAbsence ? loneAbsence : 0;

      return loneAbsence + "h";

    }
  }


  setMomentDetailsKeys() {
    this.momentDetailsKeys = Object.keys(this.momentDetails);
  }

  setMomentTotals() {
    let arr = this.momentDetailsKeys.map(
      (k) => this.momentDetails[k]
    );
    if (arr.length > 0) {
      this.total_work = arr[0].total_work_with_flex_converted_to_decimal;
      this.total_flex = arr[0].total_flex_converted_to_decimal;
      this.working_hours = arr[0].total_work_converted_to_decimal;
    } else {
      this.total_work = 0;
      this.total_flex = 0;
      this.working_hours = 0;
    }
  }

  setStyle(day, detail) {

    let color = "white";

    if (day.dayName === "Sat" || day.dayName === "Sun") color = "#efefef";
    else if (day[detail]) {
      color = day[detail]["Color"];
    }

    return {
      "background-color": color,
    };
  }

  getTotalUserDetailsPerDate() {
  //  this.timeRegistrationService
  //    .getTotalUserDetailsPerDate(this.userId, this.choosenDate)
  //    .subscribe((res) => {
  //      if (res["status"]) this.total = res["data"];
  //    });
  }

  fillAbsenceTotalByName(name, total) {
    if (
      this.absenceTotalPerName[name] &&
      this.absenceTotalPerName[name].hasData
    ) {

      setTimeout(()=>{

        let total = 0;
        this.absenceTotalPerName[name].total = 0;
        Object.values(this.absenceTotalPerName[name]).forEach(
          (obj: any, index) => {
            if (index == this.absenceTotalPerName[name].length - 1) {
              this.absenceTotalPerName[name].hasData = false;
            }

            if (obj && obj.hours) {
              total = total + Number(obj.hours);
            }
          }
        );
        this.absenceTotalPerName[name]["total"] = Number(total.toFixed(2));

      }, 1);

    }
  }

  setAbsenceTotalName(key, date, total) {
    if (!this.absenceTotalPerName[key]) {
      this.absenceTotalPerName[key] = { hasData: false, total: 0 };
    } else {
      this.absenceTotalPerName[key][date] = {
        hours: Number(total.toFixed(2)),
        last: false,
        total: 0,
      };
      this.absenceTotalPerName[key].hasData = true;
    }
  }

  fillAbsenceTotalByDate(date, total, key, paid) {

    if (paid == 0) return;

    total = total || total == 0 ? Number(total) : 0;
    this.setAbsenceTotalName(key, date, total);

    if (!this.absenceTotals[date]) {

      this.absenceTotals[date] = {
        total: total,
        last: false,
        work: false,
        absence: total,
        loneAbsence: 0,
      };
      if (!this.absenceTotalPerName[key]) {
        this.absenceTotalPerName[key] = [];
      }

    } else if (!this.absenceTotals[date].last) {

      this.absenceTotals[date].total =
        Number(this.absenceTotals[date].total) + total;
        this.absenceTotals[date].total = Number(this.absenceTotals[date].total.toFixed(2));
      this.absenceTotals[date].absence =
        Number(this.absenceTotals[date].absence) + total;
      this.absenceTotals[date].absence = Number(this.absenceTotals[date].absence.toFixed(2));
    }
  }


  addToLoneAbsence(date, total, type) {

      if (type === "set") {
        this.lone_time.total = total + this.lone_time.total;
        this.absenceTotals[date].loneAbsence =
          total + Number(this.absenceTotals[date].loneAbsence);
      } else {
        this.lone_time.total = total + this.lone_time.total;
        this.absenceTotals[date].loneAbsence = total;
      }

  }

    fillAbsenceTotalByDateWork(date, total) {
        total = Number(total);

        if (!this.absenceTotals[date]) {
        this.absenceTotals[date] = {
            total: total,
            last: false,
            work: true,
            absence: 0,
            loneAbsence: 0,
        };
        } else if (!this.absenceTotals[date].work) {
            total += this.absenceTotals[date].absence;
            this.absenceTotals[date].total = total;
        }
        this.dateTotal();
    }

  dateTotal() {
    let total = 0;
    Object.values(this.absenceTotals).forEach((obj:any) => {
        if(obj.total != undefined) {
            total += obj.total;
        }
    });
    return total;
  }

  keepOrder = (a, b) => {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  };

  printAbsences(date, index, detail, daysLength, lastAbsence, dayName) {

    let absenceTime = "";
    const absenceName = detail.absence_type;

    if (detail.hours !== '') {

      absenceTime = detail.hours;
      const paid = detail.paid;

      if (absenceTime) {
        this.fillAbsenceTotalByName(absenceName, absenceTime);
        this.fillAbsenceTotalByDate(
          date,
          absenceTime,
          absenceName,
          paid
        );
      }

    } else {

      if (!this.absenceTotalPerName[absenceName]) {
        this.absenceTotalPerName[absenceName] = [];
        this.absenceTotalPerName[absenceName].hasData = false;
        this.absenceTotalPerName[absenceName].total = 0;
      }

    }

    if (
      index === daysLength &&
      this.absenceTotals[absenceName] &&
      !this.absenceTotals[absenceName].last
    ) {
      this.absenceTotals[absenceName].last = true;
      this.absenceTotals.totalName =
        Number(this.absenceTotals.totalName) +
        Number(this.absenceTotals[absenceName].total);
      this.absenceTotals.totalName = Number(this.absenceTotals.totalName.toFixed(2));
    }

    if (
      lastAbsence &&
      this.absenceTotals[date] &&
      !this.absenceTotals[date].last
    ) {
        this.absenceTotals[date].last = true;
       /*
        Math.round(Number(this.absenceTotals.totalDate) +
        Number(this.absenceTotals[date].absence));
        this.absenceTotals.totalDate = Number(this.absenceTotals.totalDate.toFixed(2));*/
        this.dateTotal();
    }

    return absenceTime;
  }

  checkIfLastDayOfMonth(dayIndex, daysLength, type) {
    if (Object.keys(this.momentDetails).length > 0) {
      if (dayIndex === daysLength) {
        if (
          this.work_time.set === false &&
          type === "Total" &&
          !this.fetchingMomentDetails
        ) {
          this.work_time.set = true;
        }

        if (this.flex_time.set === false && type === "Overtime") {
          this.flex_time.set = true;
        }

        if (
          this.lone_time.set === false &&
          type === "LONEUNDERLAG" &&
          !this.fetchingMomentDetails
        ) {
          this.lone_time.set = true;
        }
      }
    }
  }

  printMileage(date, type) {
    let mileage = false;

    if (this.momentDetails[date]) {
      const date_type = this.setMileageType(this.momentDetails[date].mileageType);

      if (date_type === type) {
        mileage = this.momentDetails[date].mileage;
      }
    }

    return mileage;
  }

  setMileageType(type) {
    return type == 1 ? 'private' : 'company';
  }

  printMileageQuantity(date, type) {

    if (Array.isArray(this.momentDetails[date].mileages) || !this.momentDetails[date].mileages[type]) {
      return '';
    }

    return this.momentDetails[date].mileages[type].mileage;
  }

  setClassToAbsenceButFlex(key, date) {
    if (key !== "Helgdagsersattning/Crveni dani") {
      return date;
    }
  }

  printTotal(date) {
    let className = "." + date;
    let array_of_object = $(className);
    let total = 0;

    for (var i = array_of_object.length - 1; i >= 0; i--) {
      if (array_of_object[i].value != "") {
        total += parseFloat(array_of_object[i].value);
      }
    }

    if (this.momentDetails[date]) {
      total += parseFloat(this.momentDetails[date].total_converted_to_decimal);
    }

    return total;
  }

  rederName(name) {
    if (name == "1 Total arbeit") return name.split("1 ")[1];
    else return name;
  }

  removeDatepicker() {
    $('#dateSelectStartDate').datepicker();
    $('#dateSelectStartDate').removeClass('calendarclass');
    $('#dateSelectStartDate').removeClass('hasDatepicker');
    $('#dateSelectStartDate').unbind();
  }

  public userName = '';

  changeSelectedUser(user) {
    const { value, name  } = user;

    if (value != this.userId) {
      this.userId = Number(value);
      this.startCalendar();
    }

    this.userName = name;

  }

  redirectToPdfGenerathorView() {
    this.router.navigate([
      "/timesheets/time-registration-admin/pdf/",
      this.start_date,
      this.last_date,
      this.userId,
    ],
    {
      queryParamsHandling: "merge"
    });
  }

  redirectToAdmin() {

    this.router.navigate([
      `/moments/time-registration-admin`
    ],
    {
      queryParamsHandling: "merge"
    });

  }

  getNumberOfWorkingDaysInMonth(month, year) {
    const mDate = moment(`${year}-${month}-01`).startOf("month");
    const daysCount = mDate.daysInMonth();
    return Array(daysCount)
      .fill(null)
      .map((v, index) => {
        const addDays = index === 0 ? 0 : 1;
        mDate.add(addDays, "days");
        if (mDate.isoWeekday() != 6 && mDate.isoWeekday() != 7) {
          return mDate.format("YYYY-MM-DD");
        }
      })
      .filter((date) => date).length;
  }

  transformTimeToDecimal(value: string | number): any {
    if (value && value.toString().includes(":")) {
      const hours = parseInt(value.toString().split(":")[0]);
      const minutes = parseInt(value.toString().split(":")[1]);
      value = hours + minutes / 60;
    } else if (value) {
      value = value;
    }

    return value === "NaN" ? "0" : value;
  }

  public changedValue = false;

  async update() {

    this.spinner = true;
    this.allowToSave = false;
    this.allowInputValue = true;

    const mileagesArray = [];
    const mileagesKeys = Object.keys(this.mileagesObj);
    for (let key of mileagesKeys) {
      mileagesArray.push(this.mileagesObj[key]);
    }

    const create = Object.keys(this.absence_type_ids.create);
    const removed = this.absence_type_ids.removed;
    const update = Object.keys(this.absence_type_ids.update);

    if (create.length || removed.length || update.length) {
      const res = await this.timeRegistrationService.createOrUpdateAbsencesPerDate(this.absence_type_ids).toPromise2();
      if (res['status']) {

        this.getAbsenceUserDetails(false);
        this.allowInputValue = false;
        this.changedValue = !this.changedValue;
      }
    }

    if (mileagesArray.length) {
      this.spinner = true;
      const res2 = await this.timeRegistrationService.updateUserMileages({ mileages: mileagesArray }).toPromise2();
      this.spinner = false;

      this.getWorkUserDetails();
      this.allowInputValue = false;
      return res2;
    }

  }

  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  alloWSaveData() {
    this.allowToSave = true;
  }

    disableMileage(day) {

        let status = false;
        let date = day.date;

        const momentDetails = this.momentDetails[date];
        if(momentDetails.total_converted_to_decimal == 0 || this.allowInputValue || day.dayName == 'Sat' || day.dayName == 'Sun') {
            status = true;
        }
        return status;
    }

    updateMileagePerDate($event, date, type, day = null) {

        const momentDetails = this.momentDetails[date];
        const mileageType = momentDetails.mileages[type];
        const mileage = mileageType ? mileageType.mileage : 0;
        const value = Number(Number($event.target.value.replace("h", "").replace(",", ".")).toFixed(2));
        const subtract = Number(value) - mileage;
        this.allowToSave = true;

        momentDetails.mileage = value;
        const mileageInfo = {
            timesheetsId: momentDetails.timesheetsId,
            mileage: momentDetails.mileage,
            type: type,
            userId: this.userId
        };
        this.mileagesObj[`${date}-${type}`] = mileageInfo;
        this.setTotalToZeroIfUndefined(type);
        this.mileage_totals[type] = Math.abs(Number(this.mileage_totals[type]) + subtract).toFixed(2);
        this.sumMileageTotals();

    }

  setTotalToZeroIfUndefined(type) {
    if (this.mileage_totals[type] === undefined) {
      this.mileage_totals[type] = 0
    }
  }

  updateAbsencePerDate(event, day, detail, key) {
    this.allowToSave = true;
    const value = Number(event.target.value.replace("h", "").replace(",", ".")).toFixed(2);

    if (!value && Number(value) != 0) {
      event.target.value = null;
      return false;
    }

    const object_id = detail.id;

    const object = {
      date: day.date,
      absence_type: key,
      value: value,
      user_id: this.userId,
      id: object_id,
      UserAbsenceID: detail.UserAbsenceID,
      absence_type_id: detail.absence_type_id,
      group: detail.group,
    };

    if (
      (!this.absenceDetails[object.absence_type][object.date] ||
        this.absenceDetails[object.absence_type][object.date].ajaxValue !==
          value) &&
      Number(value) !== 0
    ) {
      if (value) {
        let type_of_request = "create";
        if (object_id) {
          type_of_request = "update";
        }

        if (
          !(object.absence_type_id in this.absence_type_ids[type_of_request])
        ) {
          this.absence_type_ids[type_of_request][object.absence_type_id] = [];
        }

        let index = this.absence_type_ids[type_of_request][
          object.absence_type_id
        ].findIndex(
          (obj) =>
            obj.date === object.date &&
            obj.absence_type_id == object.absence_type_id
        );

        if (index == -1) {
          this.absence_type_ids[type_of_request][object.absence_type_id].push(
            object
          );
        } else {
          this.absence_type_ids[type_of_request][object.absence_type_id][
            index
          ] = object;
        }
      } else {
        let index = this.absence_type_ids.create[
          object.absence_type_id
        ].findIndex((obj) => obj.date === object.date);
        if (index != -1) {
          this.absence_type_ids.create[object.absence_type_id].splice(index, 1);
        }
      }

      let index = this.absence_type_ids.removed.findIndex(
        (obj) =>
          obj.date === object.date &&
          obj.absence_type_id == object.absence_type_id
      );
      if (index != -1) {
        this.absence_type_ids.removed.splice(index, 1);
      }
    } else {
      if (object.id) {
        this.absence_type_ids["removed"].push(object);
      } else {
        let index = this.absence_type_ids.create[
          object.absence_type_id
        ].findIndex((obj) => obj.date === object.date);
        if (index != -1) {
          this.absence_type_ids.create[object.absence_type_id].splice(index, 1);
        }
      }
    }
  }

  refreshAbsence(object) {
    let new_record = {
      id: object["id"],
      UserAbsenceID: object.UserAbsenceID,
      user_id: object.user_id,
      date: object.date,
      hours: object.value,
      absence_type: object.absence_type,
    };
    this.absenceDetails[object.absence_type][object.date] = new_record;
    console.log(this.absenceDetails);
  }

  time_convert(time) {
    const hours = parseInt(time.toString().split(/[,\.]/)[0]);
    let minutes = parseInt(time.toString().split(/[,\.]/)[1]);
    minutes = minutes < 10 ? minutes * 10 : minutes;
    return hours + ":" + (isNaN(minutes) ? "00" : (minutes / 100) * 60);
  }

  printAbsenceTotal(value, absence) {
    return value;
  }

  nextDate() {
    const d = new Date(moment(this.choosenDate).format());
    d.setMonth(d.getMonth() + 1, 1);
    const dt = d;

    $("#dateSelectStartDate").datepicker("setDate", dt);
    this.choosenDate = moment(dt).format('YYYY-MM-DD');
  }

  previousDate() {
    const d = new Date(moment(this.choosenDate).format());
    d.setMonth(d.getMonth() - 1, 1);
    const dt = d;

    $("#dateSelectStartDate").datepicker("setDate", dt);
    this.choosenDate = moment(dt).format('YYYY-MM-DD');
  }


  firstDayOfCalendar(firstDay) {
    const lastWeek = firstDay.isoWeek();
    const firstDay2 = moment(firstDay.format("YYYY-MM-DD"));
    let numberOfDayToSubtract = -1;
    while (true) {
      if (firstDay2.isoWeek() === lastWeek) {
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

  lastDayOfCalendar(lastDay) {
    const lastWeek = lastDay.isoWeek();
    const lastDay2 = moment(lastDay.format("YYYY-MM-DD"));
    let numberOfDayToAdd = -1;
    while (true) {
      if (lastDay2.isoWeek() === lastWeek) {
        numberOfDayToAdd = numberOfDayToAdd + 1;
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

  public headerGrid = {};
  setTranslateXForHeader(scrollLeft) {
    this.headerGrid = { transform: `translate3d(-${scrollLeft}px, 0px, 0px)`};
  }

  getCompanyWageType() {
    this.timeRegistrationService
      .getCompanyWageType()
      .subscribe((res) => {
        this.company_wage_type = res["data"];
        if(this.company_wage_type.name == 'Pays 8 hours of worked time, other time to Flexbanken') {
          this.allow_flex = true;
        }else {
          this.allow_flex = false;
        }
      });
  }
}
