import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { MomentsService } from "src/app/core/services/moments.service";
import { TranslateService } from "@ngx-translate/core";

import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
declare var $;

@Component({
  selector: "app-new-default-moments",
  templateUrl: "./new-default-moments.component.html",
  styleUrls: ["./new-default-moments.component.css"],
})
export class NewDefaultMomentsComponent implements OnInit {
  public createForm: FormGroup;
  public project: any;
  public sortNumber: number = 0;
  public childNumber: number = 0;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<NewDefaultMomentsComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private momentsService: MomentsService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.sortNumber = this.modal_data["number_of_parent"];
    console.log(this.modal_data.parent_moment_number);

    if (this.modal_data.childrens_lenght !== null) {
      this.childNumber = this.modal_data.childrens_lenght;
    }

    this.createForm = this.fb.group({
      Name: ["", [Validators.required, Validators.maxLength(30)]],
      type: ["1", [Validators.required]],
      sort: [this.sortNumber],
      parent: [this.childNumber],
      moment_number: [""],
    });
  }

  create() {
    if (this.createForm.valid) {
      const data = this.createForm.value;

      if (this.modal_data.parent !== null) {
        this.childNumber += 1;
        this.createForm.value.moment_number =
          this.modal_data.parent_moment_number + "." + this.childNumber;
        this.createForm.value.parent = this.modal_data.parent;
        this.createForm.value.sort =
          parseInt(this.modal_data["child_sort"]) + 1;
      } else {
        this.sortNumber += 1;
        this.createForm.value.sort = this.sortNumber;
        this.createForm.value.moment_number = this.sortNumber;
      }

      this.momentsService.createDefaultMoment(data).subscribe((response) => {
        if (response["status"]) {
          data.id = response["id"];
          this.dialogRef.close(data);
          this.toastr.success(
            this.translate.instant("You have successfully created moment."),
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
