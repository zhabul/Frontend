import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { MomentsService } from "src/app/core/services/moments.service";
import { TranslateService } from "@ngx-translate/core";

import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
declare var $;

@Component({
  selector: "app-edit-planner",
  templateUrl: "./edit-planner.component.html",
  styleUrls: ["./edit-planner.component.css"],
})
export class EditPlannerComponent implements OnInit {
  public createForm: FormGroup;
  public project: any;
  public moment: any;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<EditPlannerComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private momentsService: MomentsService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.project = this.modal_data["project"];
    this.moment = this.modal_data["moment"];

    this.createForm = this.fb.group({
      Description: [this.moment["Description"], [Validators.required]],
    });
  }

  update() {
    if (this.createForm.valid) {
      const data = this.createForm.value;

      this.moment["Description"] = data["Description"];

      this.momentsService
        .updateProjectPlanName(this.moment)
        .subscribe((response) => {
          this.toastr.info(
            this.translate.instant(
              "You have successfully updated schedule date."
            ),
            this.translate.instant("Info")
          );
          this.dialogRef.close(response);
        });
    }
  }

  numberOfDays(firstDate, secondDate) {
    var startDay = new Date(firstDate);
    var endDay = new Date(secondDate);
    var millisecondsPerDay = 1000 * 60 * 60 * 24;
    var millisBetween = startDay.getTime() - endDay.getTime();
    var days = Math.abs(millisBetween / millisecondsPerDay) + 1;
    return days;
  }
}
