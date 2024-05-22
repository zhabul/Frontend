import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ProjectsService } from "src/app/core/services/projects.service";
import { TranslateService } from "@ngx-translate/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-edit-activity",
  templateUrl: "./edit-activity.component.html",
  styleUrls: ["./edit-activity.component.css"],
})
export class EditActivityComponent implements OnInit {
  public createForm: FormGroup;
  public project: any;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<EditActivityComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private projectService: ProjectsService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.createForm = this.fb.group({
      number: [
        this.modal_data.activity.number,
        [Validators.required, Validators.pattern("(\\d{4}|\\d)")],
      ],
      description: [
        this.modal_data.activity.description,
        [Validators.required],
      ],
      status: [this.modal_data.activity.status == "1", [Validators.required]],
    });
  }

  create() {
    if (this.createForm.valid) {
      const data = this.createForm.value;

      this.projectService
        .updateActivity(this.modal_data.activity.id, data)
        .then((response) => {
          if (response["status"]) {
            data.id = this.modal_data.activity.id;
            this.dialogRef.close(data);
            this.toastr.success(
              this.translate.instant("You have successfully updated activity."),
              this.translate.instant("Success")
            );
          } else {
            this.toastr.error(this.translate.instant("Something wrong!"));
          }
        });
    }
  }
}
