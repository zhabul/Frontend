import { Component, Inject, OnInit } from "@angular/core";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { TranslateService } from "@ngx-translate/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "confirmation-dialog",
  templateUrl: "./confirmation-dialog.html",
})
export class ConfirmationDialog implements OnInit {
  public user: any;
  public lockedDay: boolean = false;
  public date: any;
  public user_id: any;
  public userName: any;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private timeRegistrationService: TimeRegistrationService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.user = this.modal_data.user;
    this.user_id = this.user.id;
    this.userName = this.user.firstName + " " + this.user.lastName;
    this.date = this.modal_data.date;
    if (this.user.absences && this.user.absences[this.date])
      this.lockedDay =
        this.user.absences[this.date].raportedDayHaveMomentsAndLocked;
  }

  onConfirmClick(): void {
    this.dialogRef.close({ status: true, removeAbsence: true });
  }

  unLockDay() {
    if (confirm(this.translate.instant("Are you sure!"))) {
      let object = {
        date: this.date,
        user_id: this.user_id,
      };

      this.timeRegistrationService
        .allowUserToRaportTime(object)
        .subscribe((response) => {
          if (response && response["status"]) {
            this.translate.instant("You have successfully allowed raport time");
            this.user.absences[this.date].raportedDayHaveMomentsAndLocked =
              false;
            this.dialogRef.close({ status: true, unlockDay: true });
          }
        });
    }
  }
}
