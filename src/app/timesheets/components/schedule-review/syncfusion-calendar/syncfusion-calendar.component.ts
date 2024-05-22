import {
  Component,
  ViewChild,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { extend, setCulture } from "@syncfusion/ej2-base";
import {
  ScheduleComponent,
  EventSettingsModel,
  View,
  MonthService,
} from "@syncfusion/ej2-angular-schedule";
import * as moment from "moment";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";


interface DateInterval {
  first_date: Object;
  last_date: Object;
}

@Component({
  selector: "app-syncfusion-calendar",
  templateUrl: "./syncfusion-calendar.component.html",
  styleUrls: ["./syncfusion-calendar.component.css"],
  providers: [MonthService],
})
export class SyncfusionCalendarComponent implements OnInit {
  @Input("dataArray") set setDataArray(newArray: any[]) {
    if (this.dataArray !== newArray) {
      this.dataArray = newArray;
      if (this.loaded) {
        this.scheduleObj.eventSettings.dataSource = this.dataArray;
      }
    }
  }
  public dataArray: any[] = [];
  @Input() componentName: any;
  @Input() userId: any;
  @Output() dateEmitter = new EventEmitter<DateInterval>();
  @ViewChild("scheduleObj")
  public scheduleObj: ScheduleComponent;
  public readonly: boolean = true;
  public currentDate: Date = new Date();
  public newViewMode: View = "Month";
  public scheduleViews: View[] = ["Month"];
  public showWeekNumber: boolean = true;
  public wRule: string = "FirstFourDayWeek";
  public showWeekend: Boolean = true;
  public projects = [];
  public selectedDateProjectPreview = -1;
  public dateProjects: any = {};

  public first_date;
  public last_date;

  public eventSettings: EventSettingsModel = {
    dataSource: <Object[]>extend([], this.dataArray, null, true),
  };

  public allowMultipleOwner: Boolean = true;
  public ownerDataSource: Object[] = [
    { OwnerText: "Nancy", Id: 1, OwnerColor: "#ffaa00" },
    { OwnerText: "Steven", Id: 2, OwnerColor: "#f8a398" },
    { OwnerText: "Michael", Id: 3, OwnerColor: "#7499e1" },
  ];

  public cellStyle: any;
  public btnName = "add_circle_outline";
  public projectLegendShow = false;
  public projectsproperty: any[] = [];
  public userDetails: any;
  public currentDate_ = moment(new Date());
  loaded: boolean = false;

  public summary: any;
  constructor(private timeRegService: TimeRegistrationService) {}

  ngOnInit() {
    setCulture("en-US");
    this.loaded = true;

    this.timeRegService
      .getHoursByUserForCurrentMonth(
        this.userDetails.user_id,
        this.currentDate_.format("MM"),
        this.currentDate_.format("YYYY")
      )
      .subscribe((response) => {
        this.summary = response["data"];
      });

     
    }
  


  generateDateProjects() {
    const dateProjects = {};

    if (this.projects.length < 1) return {};
    const currentDate = moment(this.projects[0].StartDate);
    let maxEndDate = this.projects[0].EndDate;
    let maxEndDateIndex = 0;
    this.projects.forEach((project, index) => {
      if (project.EndDate > maxEndDate) {
        maxEndDate = project.EndDate;
        maxEndDateIndex = index;
      }
    });

    const endDate = moment(this.projects[maxEndDateIndex].EndDate);

    while (currentDate.format("YYYY-MM-DD") <= endDate.format("YYYY-MM-DD")) {
      const currentDateString = currentDate.format("YYYY-MM-DD");
      dateProjects[currentDateString] = {
        Id: currentDateString,
        StartTime: new Date(currentDateString),
        EndTime: new Date(currentDateString),
        isOnlyPreview: true,
        projects: [],
      };

      for (let i = 0, n = this.projects.length; i < n; i++) {
        if (currentDateString > this.projects[i].EndDate) {
          continue;
        }

        if (currentDateString < this.projects[i].StartDate) {
          break;
        }

        if (
          currentDateString >= this.projects[i].StartDate &&
          currentDateString <= this.projects[i].EndDate
        ) {
          dateProjects[currentDateString].projects.push({
            ProjectId: this.projects[i].ProjectID,
            ProjectName:
              this.projects[i].Name.length < 22
                ? this.projects[i].CustomName + "   " + this.projects[i].Name
                : this.projects[i].CustomName +
                  "   " +
                  this.projects[i].Name.substring(0, 22) +
                  "...",
            Color: "#fff",
            parentProject: this.projects[i].parentProject,
          });
        }
      }

      currentDate.add(1, "days");
    }
    return dateProjects;
  }

  uniqueObjects(array) {
    var resArr = [];
    array.forEach(function (item) {
      var i = resArr.findIndex((x) => x.ProjectName == item.ProjectName);
      if (i <= -1) {
        resArr.push({
          ProjectName: item.ProjectName,
          Color: item.Color,
          parentProject: item.parentProject,
        });
      }
    });

    return resArr;
  }

  onActionBegin(e: any) {
    this.scheduleObj.eventSettings.dataSource = this.dataArray;
    if (e.name === "actionBegin" && e.requestType === "toolbarItemRendering") {
      this.generateDataRange();
    }
  }

  onDataBound() {
    this.scheduleObj.eventSettings.dataSource = this.dataArray;
  }

  setClass(projectId) {
    if (projectId == "0") {
      return "calendar-content-field-absence";
    } else {
      return "calendar-content-field-time";
    }
  }

  showProjectLegend() {
    this.projectLegendShow = !this.projectLegendShow;

    if (this.projectLegendShow) this.btnName = "remove_circle_outline";
    else this.btnName = "add_circle_outline";
  }

  toggleAllProjects(e, data) {
   
    if (data.isOnlyPreview) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      return;
    }

    if (this.selectedDateProjectPreview == data.Id) {
      this.selectedDateProjectPreview = -1;
    } else {
      this.selectedDateProjectPreview = data.Id;
    }
  }

  filterProjects(data) {
    return this.selectedDateProjectPreview == data.Id
      ? data.projects
      : data.projects.slice(0, 3);
  }

  onActionComplete(e: any) {
    if (e.requestType === "viewNavigate" || e.requestType === "dateNavigate") {
      this.generateDataRange();
    }
  }

  generateDataRange() {
    setTimeout(() => {
      const currentViewDates = this.scheduleObj.getCurrentViewDates();
      const first_date = currentViewDates[0];
      const last_date = currentViewDates[currentViewDates.length - 1];

      this.first_date = first_date;
      this.last_date = last_date;

      this.dateEmitter.emit({ first_date: first_date, last_date: last_date });
    }, 1);
  }
}
