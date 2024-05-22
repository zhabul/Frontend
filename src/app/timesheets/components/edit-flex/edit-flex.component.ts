import { Component, OnInit, Inject, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-edit-flex",
  templateUrl: "./edit-flex.component.html",
  styleUrls: ["./edit-flex.component.css"],
})
export class EditFlexComponent implements OnInit {
  public editForm: FormGroup;
  public project: any;
  public spinner = false;

  @Input() overTime: any[];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<EditFlexComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private timeRegistrationService: TimeRegistrationService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.editForm = this.fb.group({
      total: [this.modal_data.overTime, [Validators.required]],
      user_id: [this.modal_data.user_id, [Validators.required]],
    });
  }

  update() {
    if (this.editForm.valid) {
      const data = this.editForm.value;
      this.spinner = true;

      this.timeRegistrationService.updateFlex(data).subscribe((response) => {
        if (response["status"]) {
          this.spinner = false;
          this.dialogRef.close(data);
          this.toastr.success(
            this.translate.instant("You have successfully created flex."),
            this.translate.instant("Success")
          );
        } else {
          this.toastr.error(this.translate.instant("Something wrong!"));
        }
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
