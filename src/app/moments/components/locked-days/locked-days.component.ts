import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
declare var $: any;

@Component({
  selector: "app-locked-days",
  templateUrl: "./locked-days.component.html",
  styleUrls: ["./locked-days.component.css"],
})
export class LockedDaysComponent implements OnInit {
  public summary: any[] = [];
  public userName: any;
  public user: any;
  public absences: any;
  public project_id: any;
  public date: any;
  public user_id: any;

  constructor(
    private timeRegistrationService: TimeRegistrationService,
    public dialogRef: MatDialogRef<LockedDaysComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any
  ) {}

  ngOnInit() {
    this.user = this.modal_data.user;
    this.user_id = this.modal_data.user.id;
    this.date = this.modal_data.date;
    this.userName = this.user.firstName + " " + this.user.lastName;
  }

  approveRaportTime() {
    let object = {
      date: this.date,
      user_id: this.user_id,
    };

    this.timeRegistrationService
      .allowUserToRaportTime(object)
      .subscribe((response) => {
        if (response && response["status"])
          this.dialogRef.close({ status: true });
      });
  }
}
