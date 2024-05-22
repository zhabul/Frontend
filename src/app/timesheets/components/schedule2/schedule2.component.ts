import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import * as moment from "moment";
import { extendMoment } from "moment-range";
import { TimeRegistrationService } from 'src/app/core/services/time-registration.service';


@Component({
  selector: 'app-schedule2',
  templateUrl: './schedule2.component.html',
  styleUrls: ['./schedule2.component.css']
})
export class Schedule2Component implements OnInit {

  @ViewChild(".projectShow") nameField: ElementRef;
  @Input() schemaProjects: any;
  public weeks = [];
  public currentDate = moment(new Date());
  public date = moment();
  public daysarr = [];
  private momentRange = extendMoment(moment);
  public timesheets: any[] = [];
  public absences: any = {};
  public timeproject: any[] = [];
  public user_id:number = 1;
  public loading = false;
  public userDetails: any = JSON.parse(sessionStorage.getItem('userDetails'));
  public projectsData: any;
  public mileage: any;
  public notification_week:any;
  public selectedDay: any;
  public isShown: boolean = false;
  public selectedProjects: any;
  public isShownInner: boolean = false;
  public moment: any;
  public selectedDateProjectPreview = 1;
  public currentSelectedDay = 1;
  public showProjects = false;
  public dataArray: any[] = [];
  public hours_for_calendar: any = [];
  public firstCalDate;
  public date_now: any;
  public day_now: any;
  public currentDayOfWeek = new Date();
  public selectedTab = 0;
  onFocusStyle:string;
  public projectWhitDate: any[];
  public selectedIndex: any = null;
  spinner: boolean = true;
  public language = "sw";
  objectKeys = Object.keys;
  days_in_week = {
    "1": "Monday",
    "2": "Tuesday",
    "3": "Wednesday",
    "4": "Thursday",
    "5" : "Friday",
    "6" : "Saturday",
    "7" : "Sunday"
  };
  route: any;
  public paramsSub;
  public formatOptions = {
    month: 'long'
};

  constructor(private timeRegService: TimeRegistrationService) { }

  ngOnInit(): void {
    this.weeks;
    this.user_id = JSON.parse(sessionStorage.getItem("userDetails"))["user_id"];
    this.getMonthDays();
    this.getsetTimesheetsValues();
    this.day_now = moment().format("dddd");
    this.date_now = moment().format("YYYY-MM-DD");
    this.timeRegService
      .getUserMileage(
        this.userDetails.user_id,
        this.currentDate.format("MM"),
        this.currentDate.format("YYYY")
      )
      .subscribe((response) => {
        this.mileage = response["data"];
      });
  }

  setSelectedTab(tab) {
    this.selectedTab = tab;
  }

  showAllProjects(day, index, event){
    if(this.selectedIndex == day) {
      this.selectedIndex = null;
      return;
    }
    this.selectedIndex = day;
  }

  getMonthDays() {
    const firstDay = moment(this.currentDate).startOf("M");
    const endDay = moment(this.currentDate).endOf("M");
    this.weeks = [];
    this.daysarr = [];
    let numberOfDayToPrepend = 0;
    const firstDay2 = moment(firstDay.format("YYYY-MM-DD"));
    let index = 0;
    while (true) {
      if (firstDay2.isoWeekday() == 6) {
        numberOfDayToPrepend = 5 - index;
        break;
      }
      firstDay2.add(1, "days");
      index++;
    }

    if (numberOfDayToPrepend >= 0) {
      firstDay.subtract(numberOfDayToPrepend, "days");
    } else {
      firstDay.subtract(6, "days");
    }

    let monthRange = this.momentRange.range(firstDay, endDay);
    endDay.add(
      35 - Math.round(monthRange.duration() / (60 * 60 * 24 * 1000)),
      "days"
    );
    monthRange = this.momentRange.range(firstDay, endDay);

    for (const day of monthRange.by("days")) {
      const weekNumber = moment(new Date(day.format("YYYY-MM-DD"))).isoWeek();
      const _day = {
        number: day.format("DD"),
        day,
        weekNumber: weekNumber,
        shortName: day.format("ddd"),
        longName: day.format("dddd"),
        dayInFormat: day.format("YYYY-MM-DD"),
        isCurrent: moment().format("YYYY-MM-DD") == day.format("YYYY-MM-DD"),
        absences: undefined,
        projects: [],
        user: [],
        moments: [],
      };

      if (!this.weeks.includes(weekNumber)) {
        this.weeks.push(weekNumber);
      }

      this.timesheets.forEach(value => {
        if(moment().isSame(day.format('YYYY-MM-DD'))) {

          _day.projects.push({
            Id: value.Id,
            projectId: value.ProjectID,
            projectName: value.ProjectName,
            color: value.Color,
            time: value.Subject,
            type: 0,
            hours: value.Hours,
            Type:value.Type
          });
        }
      });


    this.daysarr.push(_day);
    }

  }

  getsetTimesheetsValues(){
    const firstDay = moment(this.currentDate).startOf('month').format('YYYY-MM-DD');
    const endDay = moment(this.currentDate).endOf('month').format('YYYY-MM-DD');
    this.spinner = true;
    this.absences = {};

    Promise.all([
        this.timeRegService.setTimesheetsToCalendar(firstDay, endDay),
        this.timeRegService.getTimesheetsAbsencesLimited(firstDay, endDay),
        this.timeRegService.getSchemaProjects(this.user_id, firstDay, endDay),
        this.timeRegService.getUsersWithMomentsPerMonth(firstDay, endDay)
    ]).then(value => {
      this.spinner = false;
      if(value[0]['status']) {
        this.spinner = false;
        this.timesheets = value[0]['data'];
      }
      if(value[1]['status']) {
        this.spinner = false;
        value[1]['data'].forEach(absence => {
          if(this.absences[absence.dateRegularFormat] == undefined) {
            this.absences[absence.dateRegularFormat] = [];
          }
          this.absences[absence.dateRegularFormat].push(absence);
        });
      }

      if(value[2]['status']) {
        this.spinner = false;
        const schemas = value[2]['data'];
        this.schemaProjects = schemas;
        this.schemaProjects = this.generateDateProjects();
      }
      if(value[3]['status']) {
        this.spinner = false;
        this.timeproject = value[3]['data'];

      }
      this.getMonthDays();
      this.loading = true;
    })
  }

public nextmonth() {

  this.currentDate.add(1, "M");
  this.getsetTimesheetsValues();

  this.getMonthDays();
  this.timeRegService
    .getUserMileage(
      this.userDetails.user_id,
      this.currentDate.format("MM"),
      this.currentDate.format("YYYY")
    )
    .subscribe((response) => {
      this.mileage = response["data"];
    });

}

public CurrentDay() {

  this.currentDate = moment(this.date_now);
  this.getsetTimesheetsValues();

  this.getMonthDays();
  this.timeRegService
    .getUserMileage(
      this.userDetails.user_id,
      this.currentDate.format("MM"),
      this.currentDate.format("YYYY")
    )
    .subscribe((response) => {
      this.mileage = response["data"];
    });
}

public previousmonth() {
    this.currentDate = this.currentDate.subtract(1, "M");
    this.getMonthDays();
    this.getsetTimesheetsValues();

    const firstDay = moment(this.currentDate).startOf("month").format("YYYY-MM-DD");
    const endDay = moment(this.currentDate).endOf("month").format("YYYY-MM-DD");
    this.getUsersWithMomentsPerMonth(firstDay, endDay);
}

  getUsersWithMomentsPerMonth(first_date, last_date) {

    this.timeRegService
      .getUsersWithMomentsPerMonth(first_date, last_date)
      .subscribe((response) => {
        this.spinner = false;
        this.hours_for_calendar = response["data"];
      });

  }

  getThreeFirstProjects(day){
    if (this.schemaProjects) {
      return this.schemaProjects[day] ? this.schemaProjects[day].projects.slice(0,3) : [];
    }
    return '';
  }

  getHoursAndProjectName(day){

    if (this.schemaProjects ) {
      return this.schemaProjects[day] ? this.schemaProjects[day].hours : this.absences[day];
    }
    return '';
  }

  generateDateProjects() {

    if (this.schemaProjects.length < 1) {
        return [];
    }

    const firstDay = moment(this.currentDate).startOf('month').format('YYYY-MM-DD');
    const endDay = moment(this.currentDate).endOf('month').format('YYYY-MM-DD');
    const dateProjects = {};
    const currentDate = moment(firstDay);4
    let maxEndDate = this.schemaProjects[0].EndDate;
    this.schemaProjects.forEach((project, index) => {
        if(project.EndDate > maxEndDate){
            maxEndDate = project.EndDate;
        }
    });
    const endDate = moment(endDay);

    while (currentDate.format('YYYY-MM-DD') <= endDate.format('YYYY-MM-DD')) {

        const currentDateString = currentDate.format('YYYY-MM-DD');
        dateProjects[currentDateString] = {
            Id: currentDateString,
            StartTime: new Date(currentDateString),
            EndTime: new Date(currentDateString),
            isOnlyPreview: true,
            projects: [],
            hours:[],
            AtestStatus:[]
        };

        for (let i = 0, n = this.schemaProjects.length; i < n; i++) {

            if (currentDateString > this.schemaProjects[i].EndDate) {
                continue;
            }

            if (currentDateString < this.schemaProjects[i].StartDate) {
                break;
            }

            if (currentDateString >= this.schemaProjects[i].StartDate && currentDateString <= this.schemaProjects[i].EndDate) {
                dateProjects[currentDateString].projects.push(this.schemaProjects[i]);
            }
        }

        for (let i = 0, n = this.timesheets.length; i < n; i++) {
            if (currentDateString == this.timesheets[i].dateRegularFormat) {
                dateProjects[currentDateString].hours.push(this.timesheets[i]);
            }
        }
        currentDate.add(1, 'days');
    }
    return dateProjects;
  }
}







