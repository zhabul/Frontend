import { Component, ViewEncapsulation, OnInit } from "@angular/core";
import {
  DragAndDropService,
  TimelineViewsService,
  ResizeService,
} from "@syncfusion/ej2-angular-schedule";
import { ActivatedRoute } from "@angular/router";


@Component({
  selector: "time-registration-admin",
  templateUrl: "./time-registration-admin.component.html",
  styleUrls: ["./time-registration-admin.component.css"],
  encapsulation: ViewEncapsulation.None,
  providers: [TimelineViewsService, ResizeService, DragAndDropService],
})
export class TimeRegistrationAdminComponent implements OnInit {
  
  public users: any[] = [];
  public resourceDataSource: Object[] = [];
  public timesheets: any[] = [];
  public absences: any[] = [];
  public absencesFilter: any[] = [];
  public projects: any[] = [];
  public showCalendar = false;
  public dataBase: any[] = [];
  public usersArray: any[] = [];
  public projectsArray: any[] = [];
  public btnName = "add_circle_outline";
  public btnShow = "chevron_left";
  public projectLegendShow = false;
  public expandSchedule = true;
  public dataArray: any[] = [];
  public userDetails: any;

  public calendarContentField: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    this.timesheets = this.route.snapshot.data["timesheets"]["data"] || [];
    this.absences = this.route.snapshot.data["absences"]["data"] || [];

    this.setTimesheetsToCalendar();
  }

  setTimesheetsToCalendar() {
    this.timesheets.forEach((value) => {
      let obj = {
        id: +value.Id,
        Subject: value.Subject,
        StartTime: new Date(value.formatDateT00),
        EndTime: new Date(value.formatDateT00),
        ProjectId: +value.ProjectID,
        Mileage: +value.Mileage,
        Color: value.Color,
        ProjectName: value.ProjectName,
        TaskId: +value.User.id,
        IsAllDay: true,
        type: "0",
        Approved: "1",
      };

      this.dataBase.push(obj);

      let user = {
        id: +value.User.id,
        text: value.User.firstName + " " + value.User.lastName,
        color: "#ffffff",
      };

      this.users.push(user);

      let project = {
        id: +value.ProjectID,
        text: value.Project.Name,
        color: value.Color,
      };
      this.projects.push(project);
    });

    this.absences.forEach((value) => {
      let obj = {
        AbsenceId: value.id,
        Subject: value.Subject,
        StartTime: new Date(value.StartDate),
        EndTime: new Date(value.EndDate),
        ProjectId: "",
        Color: value.Color,
        TaskId: +value.User.id,
        ProjectName: "",
        IsAllDay: true,
        Approved: value.Approved,
        type: "1",
      };

      this.absencesFilter.push(obj);
    });

    this.users = this.uniqueUserObjects(this.users);
    this.projects = this.uniqueProjectObjects(this.projects);
    if (
      (this.dataBase.length > 0 || this.absencesFilter.length > 0) &&
      this.projects.length > 0 &&
      this.users.length > 0
    ) {
      this.dataArray = [...this.dataBase, ...this.absencesFilter];

      this.showCalendar = true;
    }
  }

  uniqueUserObjects(array) {
    var resArr = [];
    array.forEach(function (item) {
      var i = resArr.findIndex(
        (x) => x.groupId == item.groupId && x.id == item.id
      );

      if (i <= -1) {
        resArr.push({
          color: item.color,
          groupId: item.groupId,
          text: item.text,
          id: item.id,
        });
      }
    });

    return resArr;
  }

  uniqueProjectObjects(array) {
    var resArr = [];
    array.forEach(function (item) {
      var i = resArr.findIndex((x) => x.id == item.id);
      if (i <= -1) {
        resArr.push({ color: item.color, text: item.text, id: item.id });
      }
    });

    return resArr;
  }

  showProjectLegend() {
    this.projectLegendShow = !this.projectLegendShow;

    if (this.projectLegendShow) this.btnName = "remove_circle_outline";
    else this.btnName = "add_circle_outline";
  }
}
