import {
  Component,
  ViewChild,
  ViewEncapsulation,
  OnInit,
  Input,
  AfterViewInit,
  HostListener,
} from "@angular/core";
import { extend } from "@syncfusion/ej2-base";
import {
  ScheduleComponent,
  PopupOpenEventArgs,
  GroupModel,
  EventSettingsModel,
  MonthService,
  Timezone,
} from "@syncfusion/ej2-angular-schedule";
import * as moment from "moment";

import { ApproveAbsenceModalComponent } from "../approve-absence-modal/approve-absence-modal.component";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { AdminRegisterTimeComponent } from "./admin-register-time-modal/admin-register-time-modal.component";
import { UsersService } from "src/app/core/services/users.service";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { ProjectsService } from "src/app/core/services/projects.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { tap } from "rxjs";

@Component({
  selector: "app-synfusion-admin-calendar",
  templateUrl: "./synfusion-admin-calendar.component.html",
  styleUrls: ["./synfusion-admin-calendar.component.css"],
  providers: [MonthService],
  encapsulation: ViewEncapsulation.None,
})
export class SynfusionAdminCalendarComponent implements OnInit, AfterViewInit {
  @Input() users: any[];
  @Input() timesheets: any[];
  @Input() dataArray: any[] = [];
  @Input() projects: any[];
  @ViewChild("scheduleObj")
  public scheduleObj: ScheduleComponent;
  public readonly: boolean = true;
  public currentDate: Date = new Date();
  public showWeekNumber: boolean = true;
  public showWeekend: Boolean = true;
  public eventSettings: EventSettingsModel = {
    dataSource: <Object[]>extend([], this.dataArray, null, true),
  };

  public allowMultipleOwner: Boolean = true;
  public cellStyle: any;
  public btnName = "Show";
  public projectLegendShow = false;
  public projectsproperty: any[] = [];

  public group: GroupModel = {
    resources: ["Projects", "Categories"],
  };
  public projectDataSource: Object[] = [];
  public allowMultiple: Boolean = true;
  public categoryDataSource: any[] = [];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private translate: TranslateService,
    private timesheetService: TimeRegistrationService,
    private projectsService: ProjectsService,
    private userService: UsersService
  ) {}

  ngOnInit() {
    this.scheduleObj.eventSettings.dataSource = this.dataArray;
    this.eventSettings.dataSource = this.dataArray;
    this.projectsproperty = this.uniqueObjects(this.dataArray);

    let timezone: Timezone = new Timezone();

    for (let fifaEvent of this.dataArray) {
      let event: { [key: string]: Object } = fifaEvent as {
        [key: string]: Object;
      };
      event.StartTime = timezone.removeLocalOffset(<Date>event.StartTime);
      event.EndTime = timezone.removeLocalOffset(<Date>event.EndTime);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      document.querySelectorAll(".e-work-cells").forEach((cell) => {
        cell.addEventListener("click", (e) => {
          const day: any = e.target;
          const formattedDate = moment(Number(day.dataset.date)).format(
            "YYYY-MM-DD"
          );
          const user = this.users[day.dataset.groupIndex];
          console.log("works");
          this.openAdminRegisterTimeModal(formattedDate, user);
        });
      });

      let resourcesWrapper = <HTMLElement>(
        document.querySelector(".e-resource-column-wrap")
      );

      let layer = `
            <div class="resource-custom">
            </div>`;

      resourcesWrapper.innerHTML = layer + resourcesWrapper.innerHTML;

      let rcustom = <HTMLElement>document.querySelector(".resource-custom");

      this.users.forEach((user) => {
        rcustom.innerHTML += `<div class="resource-custom-item" id="${user.id}"></div>`;
      });

      let links = <HTMLElement>(
        document.querySelector(".e-resource-column-wrap")
      );

      links.addEventListener("click", (ev) => {
        let target = <HTMLTextAreaElement>ev.target;
        this.goToUserDetails(target.id);
      });

      this.setWidthForResources();
    }, 1000);
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.setWidthForResources();
  }

  async openAdminRegisterTimeModal(date, user) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.data = {};
    let projectId = 0;

    let res = await this.userService.getCurrentUserProject(user.id);
    console.log(res);
    if (res["status"]) {
      diaolgConfig.data.project = res["data"];
      projectId = diaolgConfig.data.project.ProjectID;
    }

    let res4 = await this.timesheetService.getProjectManagerProjects(user.id);

    if (res4["status"]) {
      diaolgConfig.data.projectManagerProjects = res4["data"];
      projectId = diaolgConfig.data.projectManagerProjects[0].ProjectID;
    }

    let res2 = await this.userService.getUser(user.id);
    const userData: any = res2;
    diaolgConfig.data.user = userData.user;

    let res3 = await this.userService.getUserOptions(user.id);
    if (res3["status"]) {
      diaolgConfig.data.userOpts = res3["data"];
      diaolgConfig.data.date = date;
    }

    let projectChef =
      diaolgConfig.data.userOpts.create_timesheets_recordtime;
    let res5 = await this.projectsService.getUnderProjects(
      projectId,
      projectChef
    );

    if (res5["status"]) {
      diaolgConfig.data.childrenProjects = res5["data"];
    }

    this.dialog
      .open(AdminRegisterTimeComponent, diaolgConfig)
      .afterClosed()
      .subscribe((res) => {
        console.log(res);
      });
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

  setWidthForResources() {
    let resources = document.querySelectorAll(".resource-custom-item");
    resources.forEach((el, i) => {
      let element = <HTMLElement>el;
      if (document.querySelectorAll(".e-resource-cells")[i]) {
        let elm = <HTMLElement>(
          document.querySelectorAll(".e-resource-cells")[i]
        );
        element.setAttribute(
          "style",
          "height:" + elm.offsetHeight + "px;width:" + elm.offsetWidth + "px"
        );
      }
    });
  }

  onActionBegin(args: any) {
    this.projectDataSource = this.projects;
    this.categoryDataSource = this.users;
    this.scheduleObj.eventSettings.dataSource = this.dataArray;
    this.eventSettings.dataSource = this.dataArray;
  }

  onDataBound() {
    setTimeout(() => {
      this.projectDataSource = this.projects;
      this.categoryDataSource = this.users;
      this.scheduleObj.eventSettings.dataSource = this.dataArray;
      this.eventSettings.dataSource = this.dataArray;
    }, 5000);
  }

  onPopupOpen(args: PopupOpenEventArgs) {
    if (args.data["ProjectId"] != "0") {
      let time = args.data["StartTime"];
      const date = new Date(time);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      var formatted = year + "-" + month + "-" + day;
      let userId = args.data["TaskId"];

      if (args.data["type"] == "0") {
        this.router.navigate([
          "/timesheets/time-registration-admin/schedule-detail",
          userId,
          formatted,
        ]);
      } else {
        if ((args.data as any).Approved == 0) {
          this.openModal(args.data).subscribe((_) => {
            document
              .querySelectorAll(".absence-" + (args.data as any).AbsenceId)
              .forEach((absence) => {
                (absence as any).style.filter = "opacity(1)";
              });
          });
        } else {
          this.toastr.info(
            this.translate.instant("Absence already approved") + ".",
            this.translate.instant("Info")
          );
        }
      }
    }
  }

  openModal(data) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "40%";
    diaolgConfig.data = data;
    return this.dialog
      .open(ApproveAbsenceModalComponent, diaolgConfig)
      .afterClosed()
      .pipe(
        tap((status) => {
          if (status) {
            if (status.state == "approved") {
              this.toastr.success(
                this.translate.instant("Successfully approved absence!"),
                this.translate.instant("Success")
              );
            } else {
              this.toastr.success(
                this.translate.instant("Successfully rejected absence!"),
                this.translate.instant("Success")
              );
            }
          } else {
            this.toastr.error(
              this.translate.instant(
                "There was an error while approving absence"
              ) + ".",
              this.translate.instant("Error")
            );
          }
        })
      );
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

    if (this.projectLegendShow) this.btnName = "Hide";
    else this.btnName = "Show";
  }

  goToUserDetails(id) {
    this.router.navigate([
      "timesheets/time-registration-admin/user-detail",
      id,
    ]);
  }
}
