import { Component, OnInit, Inject } from "@angular/core";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
declare var $;

@Component({
  selector: "app-approve-absence-modal",
  templateUrl: "./approve-absence-modal.component.html",
  styleUrls: ["./approve-absence-modal.component.css"],
})
export class ApproveAbsenceModalComponent implements OnInit {
  public project: any;
  public absence: any;
  public createForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ApproveAbsenceModalComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private timesheetService: TimeRegistrationService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.absence = this.modal_data.absence;
    this.createForm = this.fb.group({
      id: [this.absence.id, []],
      Description: ["", []],
      StartDate: [this.absence.startDateAbsence, []],
      EndDate: [this.absence.endDateAbsence, []],
      StartDateChngRqst: [this.absence.StartDateChngRqst, []],
      EndDateChngRqst: [this.absence.EndDateChngRqst, []],
      AbsenceType: [this.absence.AbsenceType, []],
      user_id: [this.absence.user_id, []],
      HoursAbsence: [this.absence.HoursAbsence, []],
      MinutesAbsence: [this.absence.MinutesAbsence, []],
      OriginalHoursAbsence: [this.absence.OriginalHoursAbsence, []],
      OriginalMinutesAbsence: [this.absence.OriginalMinutesAbsence, []],
    });
  }

  approveAbsence() {
    if (this.createForm.valid) {
      const data = this.createForm.value;
      if (data.Description == "") data.Description = "OK";
      this.timesheetService.approveAbsence(data).subscribe((res) => {
        if (res["status"]) this.dialogRef.close(res);
      });
    }
  }

  rejectAbsence() {
    if (this.createForm.valid) {
      const data = this.createForm.value;

      if (this.absence.StartDateChngRqst && this.absence.EndDateChngRqst) {
        if (data.Description == "") {
          data.Description = "Change rejected";
        }
        data.StartDate = this.absence.StartDateChngRqst.substring(0, 10);
        data.EndDate = this.absence.EndDateChngRqst.substring(0, 10);
        if (this.absence.CommentChngRqst) {
          data.Comment = this.absence.CommentChngRqst;
        }
        if (this.absence.AbsenceTypeChngRqst) {
          data.AbsenceType = this.absence.AbsenceTypeChngRqst;
        }
        this.timesheetService.disapproveEditingAbsence(data).subscribe((res) => {
          if (res["status"]) this.dialogRef.close(res);
        });
      } else {
        if (data.Description == "") data.Description = "Nej";
        this.timesheetService.rejectAbsence(data).subscribe((res) => {
          if (res["status"]) this.dialogRef.close(res);
        });
      }
    }
  }
}
