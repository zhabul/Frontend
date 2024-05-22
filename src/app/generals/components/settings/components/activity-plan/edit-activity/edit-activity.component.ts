import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NgForm } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-edit-activity",
  templateUrl: "./edit-activity.component.html",
  styleUrls: ["./edit-activity.component.css"],
})
export class EditActivityComponent implements OnInit {
  receivedData: any;
  modal: HTMLElement;
  disableInput: boolean;

  constructor(
    private dialogRef: MatDialogRef<EditActivityComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.receivedData = data;
    this.disableInput =
      this.receivedData.action == "Edit activity" ? true : false;
  }

  ngOnInit(): void {
    this.modal = document.querySelector("mat-dialog-container") as HTMLElement;
    this.modal.style.padding = "25px";
  }

  close() {
    this.dialogRef.close(false);
  }

  onSubmit(form: NgForm) {
    if (form.value.description.length == 0 || form.value.number == 0) {
      this.toastr.info(this.translate.instant("Enter description and number."));
      return;
    }
    this.receivedData.activityToEdit.description = form.value.description;
    this.receivedData.activityToEdit.status = form.value.status;
    this.receivedData.activityToEdit.number = form.value.number;
    this.dialogRef.close(this.receivedData.activityToEdit);
  }
}
