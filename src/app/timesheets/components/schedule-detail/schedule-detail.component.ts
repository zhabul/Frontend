import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CalendarStore } from "../schedule-review/calendar-store";
import * as moment from "moment";

@Component({
  selector: "app-schedule-detail",
  templateUrl: "./schedule-detail.component.html",
  styleUrls: ["./schedule-detail.component.css"],
})
export class ScheduleDetailComponent implements OnInit {
  public showCalendar = false;
  public testVar: any[] = [];
  public dataBase: any[] = [];
  public moments: any[] = [];
  public currentDate: any;
  public dateNow: any;

  calendarSub: any;

  constructor(
    private route: ActivatedRoute,
    private CalendarStore: CalendarStore
  ) {}

  ngOnInit() {
    this.dateNow = this.route.snapshot.params["timesheet_id"];
    this.currentDate = new Date(this.dateNow);
    this.subscribeToDateChanges();
  }

  ngOnDestroy() {
    if (this.calendarSub) {
      this.calendarSub.unsubscribe();
    }
  }

  setTimesheetsToCalendar(serverArray) {
    const newDatabase = this.dataBase.slice(0);

    serverArray.forEach((value) => {
      if (value.Type == "Moments") {
        let obj = {
          Id: value.Id,
          Subject: value.Subject,
          StartTime: new Date(value.formatDateT00),
          EndTime: new Date(value.formatDateT00),
          Color: value.Color,
          ProjectName: value.ProjectName,
          SameTimeSubjects: value.SameTimeSubjects,
        };

        newDatabase.push(obj);
      }
    });

    this.dataBase = newDatabase;
  }

  getTimesheet(dateRange) {
    const monthYear = moment(dateRange.first_date)
      .add(10, "days")
      .format("MM-YYYY");
    const first_date =
      monthYear.split("-")[1] + "-" + monthYear.split("-")[0] + "-01";
    const last_date =
      monthYear.split("-")[1] +
      "-" +
      monthYear.split("-")[0] +
      "-" +
      moment(first_date).daysInMonth();

    this.CalendarStore.loadDataForDateSpan(first_date, last_date, "detail");
  }

  subscribeToDateChanges() {
    this.calendarSub = this.CalendarStore.dates.subscribe((res) => {
      this.setTimesheetsToCalendar(res);
    });
  }
}
