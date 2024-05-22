import { Component, OnInit, Inject } from "@angular/core";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
@Component({
  selector: "app-has-seen-modal",
  templateUrl: "./has-seen-modal.component.html",
  styleUrls: ["./has-seen-modal.component.css"],
})
export class HasSeenModalComponent implements OnInit {
  public project: any;
  public absence: any;
  public createForm: FormGroup;
  public user_id: number;

  constructor(
    public dialogRef: MatDialogRef<HasSeenModalComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private timesheetService: TimeRegistrationService
  ) {
    this.absence = this.modal_data.absence;
  }

  ngOnInit() {}

  hasSeen() {
    const info = {
      UserAbsenceId: this.absence.Id,
    };

    this.timesheetService.updateUserHasSeen(info).subscribe((res) => {
      this.dialogRef.close(info);
    });
  }

  borderColor() {
    let color = "red";

    if (this.absence.Approved === "1") {
      color = "lightgreen";
    }

    return color;
  }
}
