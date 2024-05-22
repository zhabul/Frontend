import { Component, OnInit } from "@angular/core";
import * as moment from "moment";
import { extendMoment } from "moment-range";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";

@Component({
  selector: "app-mini-schedule",
  templateUrl: "./mini-schedule.component.html",
  styleUrls: ["./mini-schedule.component.css"],
})
export class MiniScheduleComponent implements OnInit {
  public currentDate = moment(new Date());

  public date = moment();
  public daysarr = [];
  public user = {};

  public summary: any;
  public selectedDate;
  public dayFormat;
  public startOfTheWeek;
  private momentRange = extendMoment(moment);
  public timesheets: any[] = [];
  public absences: any[] = [];
  public moments = [];

  public user_id = -1;
  public userDetails: any;
  public mileage: any;

  public selectedDay: any;
  public weeks = [];
  public spinner = false;
  public hours_for_calendar: any = [];
  public schemaProjects: any;
  public loading = false;
  public start_date: any;
  public last_date: any;
  public calendar: any[] = [];
  public fullMonths: any;
  public weekDays: any;
  public date_now: any;
  storage: any;
  constructor(private timeRegService: TimeRegistrationService) {}

  ngOnInit() {
    this.user_id = JSON.parse(sessionStorage.getItem("userDetails"))["user_id"];
    this.getMonthDays();

    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

    this.user_id = JSON.parse(sessionStorage.getItem("userDetails"))["user_id"];
    this.getsetTimesheetsValues();

     this.timeRegService
      .getHoursByUserForCurrentMonth(
        this.userDetails.user_id,
        this.currentDate.format("MM"),
        this.currentDate.format("YYYY")
      )
      .subscribe((response) => {
        this.summary = response["data"];
      });



    this.timeRegService
      .getUserMileage(
        this.userDetails.user_id,
        this.currentDate.format("MM"),
        this.currentDate.format("YYYY")
      )
      .subscribe((response) => {
        this.mileage = response["data"];
      });

  

    this.storage = JSON.parse(sessionStorage.getItem("userDetails")).user_id;
    this.date_now = moment().format("YYYY-MM-DD");
  }

  getDaysInMonts(year, date, fullMonths) {
    this.calendar = [];
    const monthNumber = <any>moment(date).month(date).format("M") - 1;
    const numberOfMonth = <any>moment(date).month(date).format("M");

    const monthName = fullMonths[monthNumber];
    const momentDate = moment(date, "YYYY-MM-DD");
    const days = momentDate.daysInMonth();

    const daysInMonthArray = Array.from(Array(days + 1).keys());
    daysInMonthArray.splice(0, 1);

    const daysObject = this.getDays(daysInMonthArray, year, numberOfMonth);
    const months = [];

    const obj = {
      year: year,
      name: monthName,
      daysNumber: days,
      daysInMonthArray: daysInMonthArray,
      days: daysObject,
      monthIndex: monthNumber,
    };

    months.push(obj);
    const object = { year, months };
    this.calendar.push(object);
    localStorage.setItem(
      "users-detail-calendar",
      JSON.stringify(this.calendar)
    );
  }

  private getDays(daysInMonthArray, year, numberOfMonth) {
    const objArray = [];
    daysInMonthArray.forEach((day) => {
      const arrayOfSingleDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      let dayOfDate;
      let monthOfDate;

      if (arrayOfSingleDigits.includes(day)) {
        dayOfDate = "0" + day;
      } else {
        dayOfDate = day;
      }

      if (arrayOfSingleDigits.includes(+numberOfMonth)) {
        monthOfDate = "0" + numberOfMonth;
      } else {
        monthOfDate = numberOfMonth;
      }

      const datum = year + "-" + monthOfDate + "-" + dayOfDate;
      const momentDatum = moment(datum, "YYYY-MM-DD");

      const week = momentDatum.week();
      const isoWeek = momentDatum.isoWeek();
      const dayIndex = momentDatum.day();
      const dayName = this.weekDays[dayIndex];

      const obj = {
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

  createCalendar(month) {
    const firstDay = moment(month).startOf("M");
    const days = Array.apply(null, { length: month.daysInMonth() + 1 })
      .map(Number.call, Number)
      .slice(1);
    for (let n = 0; n < firstDay.weekday(); n++) {
      days.unshift(null);
    }
    return days;
  }

  getsetTimesheetsValues() {
    const firstDay = moment(this.currentDate)
      .startOf("month")
      .format("YYYY-MM-DD");
    const endDay = moment(this.currentDate).endOf("month").format("YYYY-MM-DD");
    this.getUsersWithMomentsPerMonth(firstDay, endDay);
    this.loading = true;
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
      42 - Math.round(monthRange.duration() / (60 * 60 * 24 * 1000)),
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

      this.timesheets.forEach((value) => {
        if (moment().isSame()) {
          _day.projects.push({
            Id: value.Id,
            projectId: value.ProjectID,
            projectName: value.ProjectName,
            color: value.Color,
            time: value.Subject,
            type: 0,
          });
        }
      });

      this.absences.forEach((value) => {
        const startDate = new Date(value.StartTime.split("T")[0]);
        const endDate = new Date(value.EndTime.split("T")[0]);
        const weekDay = startDate.getDay();

        if (
          weekDay != 6 &&
          weekDay != 0 &&
          moment(startDate).format("YYYY-MM-DD") === day.format("YYYY-MM-DD")
        ) {
          _day.absences = {
            Id: value.Id,
            Subject: value.Subject,
            color: value.Color,
            type: 1,
            StartTime: startDate,
            EndTime: endDate,
            days: "",
            isAnswered: value.isAnswered,
            isRejected: value.isRejected,
            Answer: value.Answer,
            originStartTime: startDate,
            originEndTime: endDate,
            short_name: value.short_name,
          };
        }
      });

      this.daysarr.push(_day);
    }
  }

  getAbsenceDays(id) {
    return this.absences.find((absence) => absence.Id == id);
  }

  get getAbsenceForSelectedDay() {
    const result = [];
    this.absences.filter((absence) => {
      if (
        absence.dates.includes(this.selectedDay.dayInFormat) &&
        result.find((x) => x.Id == absence.Id) == undefined
      ) {
        result.push(absence);
      }
    });
    return result;
  }

  public nextmonth() {
    this.currentDate.add(1, "M");
    this.getMonthDays();
    this.timeRegService
      .getUserMileage(
        this.userDetails.user_id,
        this.currentDate.format("MM"),
        this.currentDate.format("YYYY")
      )
      .subscribe((response) => {
        this.mileage = response["data"];
        this.getsetTimesheetsValues();
      });
  }

  public previousmonth() {
    this.currentDate = this.currentDate.subtract(1, "M");
    this.getMonthDays();
    this.getsetTimesheetsValues();
    const firstDay = moment(this.currentDate)
      .startOf("month")
      .format("YYYY-MM-DD");
    const endDay = moment(this.currentDate).endOf("month").format("YYYY-MM-DD");
    this.getUsersWithMomentsPerMonth(firstDay, endDay);
  }

  generateDateProjects() {
    if (this.schemaProjects.length < 1) {
      return [];
    }
    const firstDay = moment(this.currentDate)
      .startOf("month")
      .format("YYYY-MM-DD");
    const endDay = moment(this.currentDate).endOf("month").format("YYYY-MM-DD");

    const dateProjects = {};
    const currentDate = moment(firstDay);
    let maxEndDate = this.schemaProjects[0].EndDate;
    this.schemaProjects.forEach((project) => {
      if (project.EndDate > maxEndDate) {
        maxEndDate = project.EndDate;
      }
    });

    const endDate = moment(endDay);

    while (currentDate.format("YYYY-MM-DD") <= endDate.format("YYYY-MM-DD")) {
      const currentDateString = currentDate.format("YYYY-MM-DD");

      dateProjects[currentDateString] = {
        Id: currentDateString,
        StartTime: new Date(currentDateString),
        EndTime: new Date(currentDateString),
        isOnlyPreview: true,
        projects: [],
      };

     
      for (let i = 0, n = this.schemaProjects.length; i < n; i++) {
        if (currentDateString > this.schemaProjects[i].EndDate) {
          continue;
        }

        if (currentDateString < this.schemaProjects[i].StartDate) {
          break;
        }

        if (
          currentDateString >= this.schemaProjects[i].StartDate &&
          currentDateString <= this.schemaProjects[i].EndDate
        ) {
          dateProjects[currentDateString].projects.push(this.schemaProjects[i]);
        }
      }

      currentDate.add(1, "days");
    }

    return dateProjects;
  }

  getUsersWithMomentsPerMonth(first_date, last_date) {
    this.timeRegService
      .getUsersWithMomentsPerMonth(first_date, last_date)
      .subscribe((response) => {
        this.spinner = false;
        this.hours_for_calendar = response["data"];
        
      });

  }

  renderData(day) {
    let data = null;
    if (this.hours_for_calendar[day.dayInFormat]) {
      data = this.hours_for_calendar[day.dayInFormat];
    }

    return data;
  }
}
