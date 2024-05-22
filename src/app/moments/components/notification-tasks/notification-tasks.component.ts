import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { UsersService } from "src/app/core/services/users.service";
import { NotificationTaskModalComponent } from "src/app/moments/components/notification-task-modal/notification-task-modal.component";
import { TimeComponent } from "src/app/timesheets/components/time/time.component";
import { take } from "rxjs";
import { NgxMaterialTimepickerComponent } from "ngx-material-timepicker";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

@Component({
  selector: "app-notification-tasks",
  templateUrl: "./notification-tasks.component.html",
  styleUrls: ["./notification-tasks.component.css"],
})
export class NotificationTasksComponent implements OnInit, AfterViewInit {
  public notification_property: any[] = [];
  public roles: any[] = [];
  public originRoles: any[] = [];

  @ViewChild("timePickeView") timePickeView: NgxMaterialTimepickerComponent;

  constructor(
    private timeRegistrationService: TimeRegistrationService,
    private dialog: MatDialog,
    private usersService: UsersService
  ) {}

    ngOnInit() {
        this.getUserNotificationTasts();
        this.getRoles();
        this.getOriginRoles();
    }

    ngAfterViewInit() {
        this.timePickeView.minutesGap = 15;
        this.timePickeView.format = 24;
    }

  async addTime(time, note, type) {
        let hours = time;
        let obj = {
          id: "",
          Time: hours,
          UserNotificationTasksID: note.id,
          Type: type,
        };
        let index = -1;

        if(type == 'Today') {
            index = note.TodayTimes.findIndex((x) => x.Time == hours);
        }else {
            index = note.TomorowTimes.findIndex((x) => x.Time == hours);
        }

        if(index < 0) {

          if (type == "Today") {
            note.TodayTimes.push(obj)
          }else {
            note.TomorowTimes.push(obj);
          };

          this.timeRegistrationService.createTimeForNotification(obj).subscribe((res) => {
              if (res["status"]) {
                obj.id = res["id"];
               // if (res && type == "Today") note.TodayTimes.push(obj);
               // else if (res) note.TomorowTimes.push(obj);
              }
          });
        }
    }

  openTimeSelect(note, type) {

    this.timePickeView.open();
    this.timePickeView.timeSet.pipe(take(1)).subscribe((time: String) => {

      if (time) {
        this.addTime(time, note, type);
      }
    });
  }

  getUserNotificationTasts() {
    this.timeRegistrationService.getUserNotificationTasks().subscribe((response) => {
      if (response["status"]) {
        this.notification_property = response["data"];
      }
    });
  }

  getRoles() {
    this.timeRegistrationService.getFreeRoles().subscribe((res) => {
      if (res["status"]) {
        this.roles = res["data"];
      }
    });
  }

  getOriginRoles() {
    this.usersService.getRoles().subscribe((res: any) => {
      this.originRoles = res;
    });
  }

  openModal(note) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.data = { note: note, roles: this.roles };
    this.dialog
      .open(NotificationTaskModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          note.roles.push(res);
          let roleIndex = this.roles.findIndex(
            (value) => value.id == res["RoleID"]
          );
          this.roles.splice(roleIndex, 1);
        }
      });
  }

  removeRole(role, roleIndex, noteIndex) {
    let origin_role = this.originRoles.find(
      (value) => value.id == role["RoleID"]
    );
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          this.timeRegistrationService
            .deleteNotificationTaskRole(role.id)
            .subscribe((response) => {
              if (
                this.notification_property[noteIndex] &&
                this.notification_property[noteIndex].roles.length > 0 &&
                this.notification_property[noteIndex].roles[roleIndex]
              ) {
                this.notification_property[noteIndex].roles.splice(
                  roleIndex,
                  1
                );
                this.roles.push(origin_role);
              }
            });
        }
      });
  }

  openTimeModal(note, type) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.data = { note: note, type: type };
    this.dialog
      .open(TimeComponent, diaolgConfig)
      .afterClosed()
      .subscribe((res) => {
        console.log("after dialog closed res", res);

        if (res && type == "Today") note.TodayTimes.push(res);
        else if (res) note.TomorowTimes.push(res);
      });
  }

  removeTime(note, type, index, time) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          this.timeRegistrationService
            .removeTimeFromNotification(time.id)
            .subscribe((res) => {
              if (res["status"] && type == "Today") {
                note.TodayTimes.splice(index, 1);
              } else if (res["status"]) {
                note.TomorowTimes.splice(index, 1);
              }
            });
        }
      });
  }
}
