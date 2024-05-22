import { Component, OnInit, AfterViewInit } from "@angular/core";
import * as moment from "moment";
import { ActivatedRoute, Router } from "@angular/router";
import { ProjectsService } from "src/app/core/services/projects.service";

declare var $: any;

@Component({
  selector: "app-planer",
  templateUrl: "./planer.component.html",
  styleUrls: ["./planer.component.css"],
})
export class PlanerComponent implements OnInit, AfterViewInit {
  public currentDate: any;
  public fullMonths: any;
  public months: any;
  public weekDays: any;
  public daysInMonth: any;
  public daysInMonthArray: any;
  public currentMonthIndex: any;
  public currentMonth: any;
  public fullMonth: any;
  public currentYear: any;
  public currentDay: any;
  public day: any;
  public currentDayNumber: any;
  public calendar: any[] = [];
  public Date: any;
  public projects: any[] = [];
  public heightRow: number = 45;
  public paddingTdField: number = 0;
  public drawSize = false;
  public hoverDate: any;
  public hoverIndex: string = null;
  public hoverMomentId: any;
  public hoveredRow: any[] = [];
  public startedDay: any;
  public activeDate: any;
  public calendarFieldWidth: any;
  public tableWrapper: any;
  public tableFixWrapper: any;
  public lastMonths: any[] = [];
  public lastyears: any[] = [];
  public yearsValueWidth: number = 0;
  public monthsValueWidth: number = 0;
  public activeMonthPosition: number = 0;
  public newWeekNUmberBorder: number = 0;
  public ensureMarkFields = false;
  public endDate: any;
  public projecttIdDoomElement: any;
  public momentIdDoomElement: any;
  public markedWidth: number = 19;
  public sortedFirst: any;
  public sortedLast: any;
  public widthTimeline: number = 200;
  public activeMomentIndex: any;
  public activeMoment: any;
  public WeekNUmber: any;
  public zoomPage: number = 100;
  public fontSize: number = 24;
  public canOpenChildren = true;
  public projectOfssetLeft: any;
  public groupOfMoments: any[] = [];
  public projectDays: any;
  public projectWidth: any;
  public allowGroup: boolean = false;
  public arbitraryDates: any[] = [];
  public projectModal: boolean = false;
  public projectModalMomentIndex: any;
  public timlineBodyWrapperWidth: number = 10340;
  public allowScroll: boolean = true;
  public allowRender: boolean = true;
  public allowChangeSizeOfMomentLine: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService
  ) {}

  ngOnInit() {
    this.projects = this.route.snapshot.data["projects"]["data"] || [];

    let today = new Date();
    this.currentDate = moment(today, "YYYY-MM-DD");
    this.Date = this.currentDate.format("YYYY-MM-DD");
    this.fullMonths = this.currentDate["_locale"]["_months"];
    this.months = this.currentDate["_locale"]["_months"];
    this.weekDays = this.currentDate["_locale"]["_weekdaysShort"];

    this.daysInMonth = this.currentDate.daysInMonth();
    let days = this.daysInMonth + 1;
    this.daysInMonthArray = Array.from(Array(days).keys());
    this.daysInMonthArray.splice(0, 1);

    this.currentMonthIndex = this.currentDate.month();
    this.currentMonth = this.months[this.currentMonthIndex];
    this.fullMonth = this.fullMonths[this.currentMonthIndex];
    this.currentYear = today.getFullYear();
    this.currentDay = this.currentDate.day();
    this.day = this.weekDays[this.currentDay];
    this.currentDayNumber = this.currentDate.date();

    let storage = localStorage.getItem("calendar") || [];
    let calendarParse = null;

    if (storage.length > 0) {
      calendarParse = JSON.parse(storage.toString());
    }

    let version = localStorage.getItem("calendarVersion") || -1;

    if (version && version != 4) {
      this.getDaysInMonts();
    } else if (
      calendarParse.length > 0 &&
      calendarParse[2]["year"] == this.currentYear
    ) {
      this.getDaysInMonts();
    } else {
      this.calendar = calendarParse;
    }
  }

  ngAfterViewInit() {
    if (this.calendar && this.calendar.length > 0) {
      localStorage.setItem("calendar", JSON.stringify(this.calendar));
      localStorage.setItem("calendarVersion", "4");
    }

    this.caliculateOffsetWidth();
    this.findActiveMonth();
    this.initializeStartWidth();
  }

  getDaysInMonts() {
    let startYear = this.currentYear - 1;
    let endYear = this.currentYear + 1;
    let years = this.years(startYear, endYear);

    years.forEach((year) => {
      let months = this.getMonts(year);
      let object = { year, months };
      this.calendar.push(object);
    });

    this.calendar[0]["months"].splice(0, 11);
    this.calendar[2]["months"].splice(2, 10);
  }

  printWeek(week, index) {
    if (this.WeekNUmber && this.WeekNUmber == week) {
      return " ";
    } else {
      this.WeekNUmber = week;
      return week;
    }
    this.WeekNUmber = week;
  }

  setBorder(week, index) {
    if (this.newWeekNUmberBorder == week) {
      return false;
    } else {
      let style = {
        "border-left": "1px solid #cccccc",
        "margin-left": "-1px",
      };

      this.newWeekNUmberBorder = week;
      return style;
    }
  }

  showChildren(moment, project, index, childIndex = null) {
    if (!this.canOpenChildren) return;

    this.canOpenChildren = false;

    if (moment.btnText == "-") {
      this.closeChildren(project, moment);

      moment.btnText = "+";
      this.canOpenChildren = true;
    } else {
      this.projectsService
        .getChildrenProjectPlans(project.id, moment.id)
        .then((response) => {
          let data = response["data"];
          project.moments.splice(index + 1, 0, ...data);

          if (moment.btnText == "+") moment.btnText = "-";
          else moment.btnText = "+";

          this.canOpenChildren = true;
        });
    }
  }

  closeChildren(project, moment) {
    project.moments
      .filter((m) => m["parent"] == moment.id)
      .forEach((m) => {
        m["visible"] = false;

        let childCount = +m["childCount"];

        if (childCount > 0) {
          this.closeChildren(project, m);
        }
      });
  }

  setChildClass(moment) {
    var className;

    if (moment["parent"] != "0") className = "children-li";
    else className = "parent-li";

    return className;
  }

  momentHaveChildren(moment) {
    let child = +moment["childCount"];

    if (child && child > 0) return true;
    else return false;
  }

  setDayClass(index, day) {
    let activeClass;
    let calendarTableClassName = "table-calendar-day-" + day.date;

    if (day.date == this.Date) activeClass = "active";
    else activeClass = "";

    return calendarTableClassName + " " + activeClass;
  }

  private getMonts(year) {
    const objArray = [];
    this.months.forEach((month) => {
      let numberOfMonth = moment().month(month).format("M");
      let date = year + "-" + numberOfMonth + "-" + 1;
      let momentDate = moment(date, "YYYY-MM-DD");
      let days = momentDate.daysInMonth();
      let daysInMonthArray = Array.from(Array(days + 1).keys());
      daysInMonthArray.splice(0, 1);
      let daysObject = this.getDays(daysInMonthArray, year, numberOfMonth);
      let monthIndex = momentDate.month();

      let obj = {
        year: year,
        name: month,
        daysNumber: days,
        daysInMonthArray: daysInMonthArray,
        days: daysObject,
        monthIndex: monthIndex,
      };
      objArray.push(obj);
    });

    return objArray;
  }

  private years(start, end) {
    let years = [];
    for (var i = start; i <= end; i++) {
      years.push(i);
    }
    return years;
  }

  private getDays(daysInMonthArray, year, numberOfMonth) {
    const objArray = [];
    daysInMonthArray.forEach((day) => {
      let arrayOfSingleDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      var dayOfDate;
      var monthOfDate;

      if (arrayOfSingleDigits.includes(day)) dayOfDate = "0" + day;
      else dayOfDate = day;

      if (arrayOfSingleDigits.includes(+numberOfMonth))
        monthOfDate = "0" + numberOfMonth;
      else monthOfDate = numberOfMonth;

      let datum = year + "-" + monthOfDate + "-" + dayOfDate;
      let momentDatum = moment(datum, "YYYY-MM-DD");
      let week = momentDatum.week();
      let isoWeek = momentDatum.isoWeek();
      let dayIndex = momentDatum.day();
      let dayName = this.weekDays[dayIndex];

      let obj = {
        date: datum,
        dateDay: day,
        week: week,
        isoWeek: isoWeek,
        dayIndex: dayIndex,
        dayName: dayName,
      };
      objArray.push(obj);
    });

    return objArray;
  }

  caliculateOffsetWidth() {
    this.calendarFieldWidth = $(".calendar-content-row-day").outerWidth();
    this.tableFixWrapper = $(".planner-content-wrapper").outerWidth();
    this.tableWrapper = $(".calendar-content-row").outerWidth();
  }

  findActiveMonth() {
    this.yearArray();
    this.yearsValueWidth = 0;
    this.monthsValueWidth = 0;

    this.lastyears.forEach((year) => {
      let className = ".table-calendar-" + year;
      let value = $(className).outerWidth();
      this.yearsValueWidth += value;
    });

    this.lastMonths.forEach((month) => {
      let className = ".table-calendar-month-" + month;
      let value = $(className).outerWidth();
      this.monthsValueWidth += value;
    });

    this.activeMonthPosition = this.yearsValueWidth + this.monthsValueWidth;
    $(".planner-content-wrapper").scrollLeft(this.activeMonthPosition);
  }

  yearArray() {
    let array = [];
    var currentYear = +this.currentYear;

    this.calendar.forEach((object) => {
      let objectYear = +object.year;

      if (objectYear < currentYear) {
        array.push(object.year);
        this.lastyears = array;
      } else if (objectYear == currentYear) {
        this.monthArray(object);
      }
    });
  }

  monthArray(object) {
    var currentMonthNumber = this.currentMonthIndex + 1;
    this.lastMonths = [];

    object.months.forEach((month) => {
      let monthNumber = month.monthIndex + 1;
      if (monthNumber < currentMonthNumber) {
        this.lastMonths.push(month.name);
        return true;
      }
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

  setWeekClass(index, day) {
    let calendarTableClassName =
      "table-calendar-week-" + day.isoWeek + "-" + index;
    return calendarTableClassName;
  }

  setMomentData(momentVar, index) {
    if (!this.allowRender) return false;

    let classNameStart = "table-calendar-day-" + momentVar["StartDate"];
    let classNameEnd = "table-calendar-day-" + momentVar["EndDate"];
    let start = document.getElementsByClassName(classNameStart);
    let end = document.getElementsByClassName(classNameEnd);
    var background;
    var left;

    let calendarStartedYearlastMonthIndex =
      this.calendar[0]["months"].length - 1;
    let calendarStartedYearlastMonth =
      this.calendar[0]["months"][calendarStartedYearlastMonthIndex];

    let momentCalendarStartedYearlastMonthDay = moment(
      calendarStartedYearlastMonth["days"][0]["date"]
    );
    let momentStartDate = moment(momentVar["StartDate"]);
    let momentEndDate = moment(momentVar["EndDate"]);
    let momentClassName = ".moment-timeline-" + momentVar["id"];

    if (momentVar["Group"] == "1") {
      background = momentVar.Color + "B3";
    } else {
      background = momentVar.Color;
    }

    if (start && start.length > 0) {
      let element: any = start[0];
      left = element.offsetLeft;
      if (!this.allowChangeSizeOfMomentLine)
        momentVar.width = momentVar.oldWidth;
      $(".moment-timeline").removeClass("border-radius-left-none");
      $(momentClassName).removeClass("displayNone");
    } else if (end.length > 0) {
      let start = this.calendar[0]["months"][0]["days"][0]["date"];
      let className = "table-calendar-day-" + start;
      let retrievedObject = document.getElementsByClassName(className);

      if (retrievedObject && retrievedObject.length > 0) {
        $(".moment-timeline").addClass("border-radius-left-none");
        $(momentClassName).removeClass("displayNone");

        let element: any = retrievedObject[0];
        let days = this.numberOfDays(start, momentVar["EndDate"]);
        left = element.offsetLeft;
        momentVar.width = days * 20;
      }
    } else if (
      (momentCalendarStartedYearlastMonthDay > momentStartDate &&
        momentCalendarStartedYearlastMonthDay > momentEndDate) ||
      (momentCalendarStartedYearlastMonthDay < momentStartDate &&
        momentCalendarStartedYearlastMonthDay < momentEndDate)
    ) {
      /* kalendar izvan start i end date */

      momentVar.width = 0;
      $(momentClassName).addClass("displayNone");
    }

    let style = {
      left: left + "px",
      top: momentVar.top + "px",
      bottom: momentVar.bottom + "px",
      width: momentVar.width + "px",
      background: background,
      "border-radius": "5px",
    };
    return style;
  }

  setPositionAndWIdthProjectPlanCoworker(object, project) {
    let className = "table-calendar-day-" + object["StartDate"];
    let left;
    let style;
    let visibilityOfDates: any = document.getElementsByClassName(className);
    let startedProjectDate =
      "table-calendar-day-" + project["StartDate"].split(" ")[0];
    let visibilityOfStartedProjectDate =
      document.getElementsByClassName(startedProjectDate);

    if (
      visibilityOfStartedProjectDate &&
      visibilityOfStartedProjectDate.length > 0
    ) {
      style = {
        left: object.Left + "px",
        top: object.Top + "px",
        bottom: object.Bottom + "px",
        width: object.Width + "px",
        background: object.Color,
      };
    } else if (visibilityOfDates.length > 0) {
      let element: any = document.getElementsByClassName(className)[0];
      left = element.offsetLeft;

      style = {
        left: left + "px",
        top: object.Top + "px",
        bottom: object.Bottom + "px",
        width: object.Width + "px",
        background: object.Color,
      };
    } else {
      style = {
        display: "none",
      };
    }

    return style;
  }

  whatClassIsIt(moment) {
    let className = "moment-timeline-" + moment["id"];
    let width = +moment["width"];

    if (width > 35) return "space-between" + " " + className;
    else return "flex-end" + " " + className;
  }

  setMoment(moment, index) {
    this.activeMoment = moment;
    this.activeMomentIndex = index;
  }

  resizeElement(event, moment) {
    moment.width = event.layerX;
    this.widthTimeline = event.layerX;
  }

  calculateStyles() {
    let style = {
      zoom: this.zoomPage + "%",
    };
    return style;
  }

  allowZoomIn() {
    if (this.zoomPage >= 180) {
      this.zoomPage = 180;
      return false;
    } else {
      return true;
    }
  }

  allowZoomOut() {
    if (this.zoomPage <= 40) {
      this.zoomPage = 40;
      return false;
    } else {
      return true;
    }
  }

  zoomIn() {
    this.zoomPage = this.zoomPage + 10;
    this.activeMoment = false;

    if (this.fontSize > 24) this.fontSize = this.fontSize - 2;
  }

  zoomOut() {
    this.zoomPage = this.zoomPage - 10;
    this.activeMoment = false;

    if (this.zoomPage <= 90) this.fontSize = this.fontSize + 2;
  }

  goBack() {
    this.router.navigate(["/planning"]);
  }

  setProjectLineDuration(project) {
    this.ensureProjectLineDuration(project);

    let style = {
      left: project.projectOfssetLeft + "px",
      width: project.projectWidth + "px",
      background: project.Color,
    };
    return style;
  }

  private ensureProjectLineDuration(project) {
    let startDate = project["StartDate"].split(" ")[0];
    let endDate = project["EndDate"].split(" ")[0];

    let classStartDateName = "table-calendar-day-" + startDate;
    let classEndDateName = "table-calendar-day-" + endDate;

    let calendarStartedYearlastMonthIndex =
      this.calendar[0]["months"].length - 1;
    let calendarStartedYearlastMonth =
      this.calendar[0]["months"][calendarStartedYearlastMonthIndex];

    let startDateName = document.getElementsByClassName(classStartDateName);
    let endDateName = document.getElementsByClassName(classEndDateName);

    let momentCalendarStartedYearlastMonthDay = moment(
      calendarStartedYearlastMonth["days"][0]["date"]
    );
    let momentStartDate = moment(startDate);
    let momentEndDate = moment(endDate);

    if (startDateName.length > 0) {
      /* vidljiv startDate */

      let element: any = document.getElementsByClassName(classStartDateName)[0];
      project.projectDays = this.numberOfDays(startDate, endDate);
      project.projectOfssetLeft = element.offsetLeft;
      project["projectWidth"] = project.projectDays * 20;
      this.allowRender = true;
      $(".project-timeline").removeClass("border-radius-left-none");
      $(".project-timeline").removeClass("displayNone");
    } else if (endDateName.length > 0) {
      /* vidljiv EndDate */

      let start = this.calendar[0]["months"][0]["days"][0]["date"];
      let className = "table-calendar-day-" + start;

      if (
        document.getElementsByClassName(className) &&
        document.getElementsByClassName(className)[0]
      ) {
        let element: any = document.getElementsByClassName(className)[0];
        project.projectDays = this.numberOfDays(start, endDate);
        project.projectOfssetLeft = element.offsetLeft;
        project["projectWidth"] = project.projectDays * 20;
        this.allowRender = true;
        $(".project-timeline").addClass("border-radius-left-none");
        $(".project-timeline").removeClass("displayNone");
      }
    } else if (
      (momentCalendarStartedYearlastMonthDay > momentStartDate &&
        momentCalendarStartedYearlastMonthDay > momentEndDate) ||
      (momentCalendarStartedYearlastMonthDay < momentStartDate &&
        momentCalendarStartedYearlastMonthDay < momentEndDate)
    ) {
      project["projectWidth"] = 0;
      $(".project-timeline").addClass("displayNone");
      this.allowRender = false;
    }
  }

  private numberOfDays(firstDate, secondDate) {
    var startDay = new Date(firstDate);
    var endDay = new Date(secondDate);
    var millisecondsPerDay = 1000 * 60 * 60 * 24;
    var millisBetween = startDay.getTime() - endDay.getTime();
    var days = Math.abs(millisBetween / millisecondsPerDay) + 1;
    return days;
  }

  selectText(numberOfCoworkers) {
    numberOfCoworkers.select();
  }

  loadMore() {
    let lastIndex = this.calendar.length - 1;
    let lastMonthIndex = this.calendar[lastIndex].months.length - 1;
    let month = this.calendar[lastIndex].months[lastMonthIndex];

    let lastYear;

    if (month["monthIndex"] < 11) {
      lastYear = this.calendar[lastIndex].year;
      this.calendar.splice(2, 1);
    } else {
      lastYear = this.calendar[lastIndex].year + 1;
    }

    this.getNextYear(lastYear);
  }

  getNextYear(year) {
    let months = this.getMonts(year);
    let object = { year, months };
    this.calendar.push(object);
    this.calendar.splice(0, 1);
  }

  loadPreviousYear() {
    let previousYear;
    let monthsLength = this.calendar[0].months.length - 1;

    if (monthsLength < 11) {
      previousYear = this.calendar[0].year;
      this.calendar.splice(0, 1);
    } else {
      previousYear = this.calendar[0].year - 1;
    }

    this.getPreviousYear(previousYear);
    this.timlineBodyWrapperWidth += 365 * 20;
  }

  getPreviousYear(year) {
    let months = this.getMonts(year);
    let object = { year, months };
    this.calendar.unshift(object);
    this.initializeStartWidth();
    let calLength = this.calendar.length - 1;
    this.calendar.splice(calLength, 1);
  }

  setWrapperWidth() {
    this.initializeStartWidth();

    return {
      width: this.timlineBodyWrapperWidth + "px",
    };
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

  onScroll(event) {
    let scrollLeft = event["target"]["scrollLeft"];
    let scrollWidth = event["target"]["scrollWidth"];

    if (scrollLeft == 0) {
      this.loadPreviousYear();
      this.caliculateOffsetWidth();
      this.findActiveMonth();
    } else if (scrollLeft > scrollWidth - 1800) {
      this.loadMore();
    }
  }
}
