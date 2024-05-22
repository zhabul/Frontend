import { Component, OnInit, Inject } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { ToastrService } from "ngx-toastr";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig,
} from "@angular/material/dialog";
import { Router } from "@angular/router";
import 'src/app/core/extensions/rxjs-observable-promise';

@Component({
  selector: "app-user-moments-detail",
  templateUrl: "./user-moments-detail.component.html",
  styleUrls: ["./user-moments-detail.component.css"],
})
export class UserMomentsDetailComponent implements OnInit {
  public summary: any[] = [];
  public userName: any;
  public user: any;
  public absences: any = [];
  public project_id: any;
  public lockedDay = false;
  public date: any;
  public user_id: any;
  public message: string = "";

  constructor(
    private router: Router,
    private translate: TranslateService,
    private timeRegistrationService: TimeRegistrationService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<UserMomentsDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any
  ) {}

  ngOnInit() {
    this.user = this.modal_data.user;
    this.user_id = this.modal_data.user.id;
    this.date = this.modal_data.date;

    if (this.user.absences.hasOwnProperty(this.date)) {
      this.absences = this.user.absences[this.date];

      this.absences = this.absences.filter(
        (ab) =>
          !((ab.isAnswered == 1 || ab.isRejected == 1) && ab.Approved == 0)
      );
    }

    this.getUserSummary(this.user_id, this.date);
    if (this.user.moments && this.user.moments[this.date])
      this.lockedDay =
        this.user.moments[this.date].raportedDayHaveMomentsAndLocked ||
        this.user.moments[this.date].Type == "userRaportStatus";
  }

  getUserSummary(user_id, date) {
    this.timeRegistrationService
      .getUserSummary(user_id, date)
      .subscribe((response) => {
        if (response["status"]) {
          this.summary = response["moments"];
          if (this.summary.length > 0) this.userName = this.summary[0].UserName;
          else this.userName = null;
        }
      });
  }

  redirectToProject(project_id) {
    this.dialogRef.close();
    this.router.navigate(["/projects/view", project_id]);
  }

  setStyle(moment) {
    let color = "#000000";
    if (moment.AtestStatus == "1") color = "#000000";
    else color = "#ce5a13";
    return {
      color: color,
    };
  }

  unLockDay() {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .toPromise2()
      .then(async (response) => {
        if (response.result) {
          let object = {
            date: this.date,
            user_id: this.user_id,
          };
          this.timeRegistrationService
            .allowUserToRaportTime(object)
            .subscribe((response) => {
              if (response && response["status"]) {
                this.translate.instant(
                  "You have successfully allowed raport time"
                );
                this.dialogRef.close({ status: true });
                this.user.moments[this.date].raportedDayHaveMomentsAndLocked =
                  false;
              }
            });
        }
      });
  }

  sendNotification() {
    let object = {
      message: "Tidrapport " + this.date,
      user_id: this.user_id,
      type: "Tidrapport",
      webLink:
        "/timesheets/time-registration-users-registration?date=" + this.date,
      $mobileLink: "/timesheets/working-hour?date=" + this.date,
      date: this.date,
      messageText: this.message,
    };

    this.timeRegistrationService.createNotification(object).then((response) => {
      if (response && response["status"]) {
        if (response["status"] == true) {
          this.dialogRef.close();
        }
      }
    });
  }

  allowUserToRaportTime() {
    const payload = {
      date: this.date,
      user_id: this.user_id,
    };

    this.timeRegistrationService
      .allowUserToRaportTime(payload)
      .subscribe((response) => {
        if (response && response["status"]) {
          if (this.user.moments.hasOwnProperty(this.date)) {
            this.user.moments[this.date].raportedDayHaveMomentsAndLocked =
              false;
            this.user.moments[this.date].Type = undefined;
          }
          this.sendNotificationForAbsenceRejection();
        }
      });
  }

  sendNotificationForAbsenceRejection() {
    const payload = {
      message: "Tidrapport " + this.date,
      user_id: this.user_id,
      type: "Tidrapport",
      webLink: "timesheets/time-registration-users-absence",
      $mobileLink: "/timesheets/absence",
      date: this.date,
      messageText: "Your absence request was rejected.",
    };

    this.timeRegistrationService
      .createNotification(payload)
      .then((response) => {
        if (response && response["status"]) {
          if (response["status"] == true) {
            this.dialogRef.close();
          }
        }
      });
  }

  removeAbsence(absence) {
    this.timeRegistrationService
      .removeAbsenceDate({
        UserAbsenceID: absence.AbsenceTypeId,
        absence_type: absence.AbsenceType,
        date: this.date,
        id: absence.absenceDateId,
        user_id: this.user_id,
        value: 0,
      })
      .subscribe((response) => {
        if (response["status"]) {
          this.toastr.success(
            this.translate.instant("You have successfully removed Absence."),
            this.translate.instant("Success")
          );

          this.user.absences[this.date] = this.user.absences[this.date].filter(
            (ab) => ab.absenceDateId != absence.absenceDateId
          );

          this.absences = this.absences.filter(
            (ab) => ab.absenceDateId != absence.absenceDateId
          );

          if (this.absences.length == 0 && this.summary.length == 0) {
            this.allowUserToRaportTime();
            return;
          }

          this.sendNotificationForAbsenceRejection();
        }
      });
  }
}
