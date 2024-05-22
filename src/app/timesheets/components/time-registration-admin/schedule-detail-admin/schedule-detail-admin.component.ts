import { Component, OnInit } from "@angular/core";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-schedule-detail-admin",
  templateUrl: "./schedule-detail-admin.component.html",
  styleUrls: ["./schedule-detail-admin.component.css"],
})
export class ScheduleDetailAdminComponent implements OnInit {
  public showCalendar = false;
  public testVar: any[] = [];
  public dataBase: any[] = [];
  public moments: any[] = [];
  public currentDate: any;
  public dateNow: any;
  public userId: any;

  constructor(
    private timeRegistrationService: TimeRegistrationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.params["id"];
    this.dateNow = this.route.snapshot.params["timesheet_id"];
    this.currentDate = new Date(this.dateNow);
    this.getTimesheetMomentsPerUser();
  }

  getTimesheetMomentsPerUser() {
    this.timeRegistrationService
      .getTimesheetMomentsPerUser(this.userId)
      .subscribe((response) => {
        this.moments = response["data"];
        this.setTimesheetsToCalendar();
      });
  }

  setTimesheetsToCalendar() {
    this.moments.forEach((value) => {
      let obj = {
        Id: 1,
        Subject: value.Subject,
        StartTime: new Date(value.formatDateT00),
        EndTime: new Date(value.formatDateT00),
        Color: value.Color,
        ProjectName: value.ProjectName,
        SameTimeSubjects: value.SameTimeSubjects,
      };

      this.dataBase.push(obj);
    });

    if (this.dataBase.length > 0) {
      this.showCalendar = true;
    }
  }
}
