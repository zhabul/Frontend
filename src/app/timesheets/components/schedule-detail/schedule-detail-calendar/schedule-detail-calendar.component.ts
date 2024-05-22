import {
  Component,
  ViewChild,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { extend } from "@syncfusion/ej2-base";
import {
  ScheduleComponent,
  EventSettingsModel,
  View,
  MonthService,
  Timezone,
} from "@syncfusion/ej2-angular-schedule";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";

declare var require: any;

interface DateInterval {
  first_date: Object;
  last_date: Object;
}

@Component({
  selector: "app-schedule-detail-calendar",
  templateUrl: "./schedule-detail-calendar.component.html",
  styleUrls: ["./schedule-detail-calendar.component.css"],
  providers: [MonthService],
})
export class ScheduleDetailCalendarComponent implements OnInit {
  @Input() currentDate: any;
  @Output() dateEmitter = new EventEmitter<DateInterval>();
  @Input("dataBase") set setDataBase(newArray: any[]) {
    if (this.dataBase !== newArray) {
      this.dataBase = newArray;

      if (this.loaded) {
        this.scheduleObj.refresh();
      }
    }
  }
  @ViewChild("scheduleObj")
  public scheduleObj: ScheduleComponent;
  public readonly: boolean = true;
  public date = Date.now();
  public newViewMode: View = "Day";
  public scheduleViews: View[] = ["Day"];
  public showWeekNumber: boolean = true;
  public showWeekend: Boolean = true;
  dataBase: any = [];
  public eventSettings: EventSettingsModel = {
    dataSource: <Object[]>extend([], this.dataBase, null, true),
  };
  public btnName = "add_circle_outline";
  public projectLegendShow = false;
  public projectsproperty: any[] = [];
  public userId: any;
  public userDetails: any;

  loaded: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

    this.projectsproperty = this.uniqueObjects(this.dataBase);
    this.userId = this.route.snapshot.params["id"];

    let timezone: Timezone = new Timezone();
    for (let fifaEvent of this.dataBase) {
      let event: { [key: string]: Object } = fifaEvent as {
        [key: string]: Object;
      };
      event.StartTime = timezone.removeLocalOffset(<Date>event.StartTime);
      event.EndTime = timezone.removeLocalOffset(<Date>event.EndTime);
    }

    this.scheduleObj.eventSettings.dataSource = this.dataBase;
    this.loaded = true;
  }

  onActionBegin(e: any) {
    this.scheduleObj.eventSettings.dataSource = this.dataBase;

    if (
      e.name === "actionBegin" &&
      e.requestType === "toolbarItemRendering" &&
      this.dataBase.length === 0
    ) {
      this.generateDataRange();
    }
  }

  onDataBound() {
    this.scheduleObj.eventSettings.dataSource = this.dataBase;
  }

  showProjectLegend() {
    this.projectLegendShow = !this.projectLegendShow;

    if (this.projectLegendShow) this.btnName = "remove_circle_outline";
    else this.btnName = "add_circle_outline";
  }

  uniqueObjects(array) {
    var resArr = [];
    array.forEach(function (item) {
      var i = resArr.findIndex((x) => x.ProjectName == item.ProjectName);
      if (i <= -1) {
        resArr.push({ ProjectName: item.ProjectName, Color: item.Color });
      }
    });

    return resArr;
  }

  goBack() {
    this.router.navigate(["timesheets/schedule-review"]);
  }

  onActionComplete(e: any) {
    if (e.requestType === "viewNavigate" || e.requestType === "dateNavigate") {
      this.generateDataRange();
    }
  }

  generateDataRange() {
    setTimeout(() => {
      const currentViewDates = this.scheduleObj.getCurrentViewDates();
      const date = currentViewDates[0];

      let monthYear = moment(date).format("MM-YYYY");
      let first_date =
        monthYear.split("-")[1] + "-" + monthYear.split("-")[0] + "-01";
      let last_date =
        monthYear.split("-")[1] +
        "-" +
        monthYear.split("-")[0] +
        "-" +
        moment(first_date).daysInMonth();

      this.dateEmitter.emit({ first_date: first_date, last_date: last_date });
    }, 1);
  }
}
