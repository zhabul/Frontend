import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { MomentsService } from "src/app/core/services/moments.service";
import { TranslateService } from "@ngx-translate/core";

import { ProjectScheduleNewComponent } from "../project-schedule-new/project-schedule-new.component";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
declare var $;

@Component({
  selector: "app-modal-group",
  templateUrl: "./modal-group.component.html",
  styleUrls: ["./modal-group.component.css"],
})
export class ModalGroupComponent implements OnInit {
  public createForm: FormGroup;
  private moment: any;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ProjectScheduleNewComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private momentService: MomentsService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.moment = this.modal_data["object"];

    console.log(this.moment);

    this.createForm = this.fb.group({
      Description: ["", [Validators.required]],
    });
  }

  createGroup() {
    if (this.createForm.valid) {
      const data = this.createForm.value;
      this.moment["Description"] = data["Description"];
      this.momentService.groupScheduleMoments(this.moment).subscribe((response) => {
        this.toastr.info(
          this.translate.instant(
            "You have successfully grouped schedule dates."
          ),
          this.translate.instant("Info")
        );
        this.dialogRef.close(response);
      });
    }
  }
}
