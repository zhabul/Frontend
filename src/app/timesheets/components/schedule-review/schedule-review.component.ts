import { Component, OnInit } from "@angular/core";
import * as moment from "moment";
import { CalendarStore } from "./calendar-store";

@Component({
  selector: "app-schedule-review",
  templateUrl: "./schedule-review.component.html",
  styleUrls: ["./schedule-review.component.css"],
})
export class ScheduleReviewComponent implements OnInit {
  public currentDate: any = new Date();
  public currentYear: any = new Date().getFullYear();
  public currentMonth: any = new Date().getMonth();
  public currentDay: any = new Date().getDay();
  public testVar: any[] = [];
  public dataBase: any[] = [];
  public timesheets: any[] = [];
  public componentName = "ScheduleReviewComponent";
  public userId = null;
  public first_date = null;
  public last_date = null;

  loaded: boolean = false;

  scheduleData: any = {};

  calendarSub: any;

  constructor(private CalendarStore: CalendarStore) {}

  ngOnInit() {
    this.subscribeToDateChanges();
  }

  ngOnDestroy() {
    if (this.calendarSub) {
      this.calendarSub.unsubscribe();
    }
  }

  setTimesheetsToCalendar(serverArray) {
    const newDatabase = [];
    serverArray.forEach((value) => {
      if (value.Type == "Moments") {
        let obj = {
          Id: value.Id,
          StartTime: new Date(value.formatDateT00),
          EndTime: new Date(value.formatDateT00),
          dateRegularFormat: value.dateRegularFormat,
          formatDateT00: value.formatDateT00,
          projects: [
            {
              Subject: value.Subject,
              ProjectId: value.ProjectID,
              Color: value.Color,
              ProjectName: value.ProjectName,
              AtestStatus: value.AtestStatus,
              isAbsence: false,
              parentProject: true,
            },
          ],
        };

        const sameDayIndex = newDatabase.findIndex((x) => x.Id == value.Id);

        if (sameDayIndex != -1) {
          newDatabase[sameDayIndex].projects.push({
            Subject: value.Subject,
            ProjectId: value.ProjectID,
            Color: value.Color,
            ProjectName: value.ProjectName,
            AtestStatus: value.AtestStatus,
            isAbsence: false,
            parentProject: true,
          });
        } else {
          newDatabase.push(obj);
        }
      } else {
        let day = moment(value.dateRegularFormat).format("dddd");

        if (day != "Saturday" && day != "Sunday") {
          let obj = {
            Id: value.Id,
            StartTime: new Date(value.EndTime),
            EndTime: new Date(value.EndTime),
            dateRegularFormat: value.dateRegularFormat,
            projects: [
              {
                Subject: value.Subject,
                ProjectId: value.ProjectID,
                Color: value.Color,
                ProjectName: value.ProjectName,
                isAbsence: true,
                parentProject: true,
              },
            ],
          };

          const sameDayIndex = newDatabase.findIndex(
            (x) => x.dateRegularFormat == value.dateRegularFormat
          );

          if (sameDayIndex != -1) {
            newDatabase[sameDayIndex].projects.push({
              Subject: value.Subject,
              ProjectId: value.ProjectID,
              Color: value.Color,
              ProjectName: value.ProjectName,
              isAbsence: true,
              parentProject: true,
            });
          } else {
            newDatabase.push(obj);
          }
        }
      }
    });
    this.dataBase = newDatabase;
  }

  getTimesheet(dateRange) {
    const monthYear = moment(dateRange.first_date)
      .add(7, "days")
      .format("MM-YYYY");
    const first_date =
      monthYear.split("-")[1] + "-" + monthYear.split("-")[0] + "-01";
    const last_date =
      monthYear.split("-")[1] +
      "-" +
      monthYear.split("-")[0] +
      "-" +
      moment(first_date).daysInMonth();
    this.CalendarStore.loadDataForDateSpan(first_date, last_date, "cal");
  }

  subscribeToDateChanges() {
    this.calendarSub = this.CalendarStore.dates.subscribe((data) => {
      this.dataBase = data;
    });
  }
}
