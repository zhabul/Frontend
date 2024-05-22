import { Component, OnInit, Inject, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { NewDefaultMomentsComponent } from "../new-default-moments/new-default-moments.component";
import { MomentsService } from "src/app/core/services/moments.service";
import { TranslateService } from "@ngx-translate/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-edit-default-moments",
  templateUrl: "./edit-default-moments.component.html",
  styleUrls: ["./edit-default-moments.component.css"],
})
export class EditDefaultMomentsComponent implements OnInit {
  public editForm: FormGroup;
  public project: any;
  public offset: any;

  @Input() moments: any[];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<NewDefaultMomentsComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private momentsService: MomentsService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.editForm = this.fb.group({
      Name: [this.modal_data.moment.Name, [Validators.required]],
      type: [this.modal_data.moment.type, [Validators.required]],
      sort: [this.modal_data.moment.sort],
      parent: [this.modal_data.moment.parent],
      moment_number: [this.modal_data.moment.moment_number],
    });
    console.log(this.editForm);
  }

  update() {
    if (this.editForm.valid) {
      const data = this.editForm.value;
      console.log(data);
      console.log(this.modal_data.moment.moment_number);
      data.id = this.modal_data.moment.id;

      this.momentsService.updateDefaultMoment(data).subscribe((response) => {
        if (response["status"]) {
          this.dialogRef.close(data);
          this.toastr.success(
            this.translate.instant("You have successfully updated flex."),
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
