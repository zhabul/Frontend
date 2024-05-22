import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "time-registration-user-details",
  templateUrl: "./time-registration-user-details.component.html",
  styleUrls: ["./time-registration-user-details.component.css"],
})
export class TimeRegistrationUserDetailsComponent implements OnInit {
  public timesheets: any[];
  public absences: any[];
  public dataBase: any[] = [];
  public absencesFilter: any[] = [];
  public dataArray: any[] = [];
  public showCalendar = false;
  public componentName = "TimeRegistrationUserDetailsComponent";
  public id: any;
  public userId: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.timesheets = this.route.snapshot.data["timesheets"]["data"] || [];
    this.absences = this.route.snapshot.data["absences"]["data"] || [];
    this.userId = this.route.snapshot["params"]["id"];
    this.setTimesheetsToCalendar();
  }

  setTimesheetsToCalendar() {
    this.timesheets.forEach((value) => {
      let obj = {
        Id: value.Id,
        Subject: value.Subject,
        StartTime: new Date(value.formatDateT00),
        EndTime: new Date(value.formatDateT00),
        ProjectId: value.ProjectID,
        Color: value.Color,
        ProjectName: value.ProjectName,
      };

      this.dataBase.push(obj);
    });

    this.absences.forEach((value) => {
      let obj = {
        Id: value.Id,
        Subject: value.Subject,
        StartTime: new Date(value.StartTime),
        EndTime: new Date(value.EndTime),
        ProjectId: value.ProjectID,
        Color: value.Color,
        ProjectName: value.ProjectName,
      };
      this.absencesFilter.push(obj);
    });

    if (this.dataBase.length > 0 || this.absencesFilter.length > 0) {
      this.dataArray = [...this.dataBase, ...this.absencesFilter];
      this.showCalendar = true;
    }
  }
}
