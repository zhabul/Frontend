import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NgForm } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-edit-role-modal",
  templateUrl: "./edit-role-modal.component.html",
  styleUrls: ["./edit-role-modal.component.css"],
})
export class EditRoleModalComponent implements OnInit {
  receivedData: any;
  modal: HTMLElement;
  constructor(
    private dialogRef: MatDialogRef<EditRoleModalComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.receivedData = data;
  }

  ngOnInit(): void {
    this.modal = document.querySelector("mat-dialog-container") as HTMLElement;
    this.modal.style.padding = "25px"; //only way to change modal property without changing other modals on application
  }

  save() {
    this.dialogRef.close(this.receivedData.role);
  }

  close() {
    this.dialogRef.close(true);
  }

  onSubmit(form: NgForm) {
    if (form.value.name.length == 0) {
      this.toastr.info(this.translate.instant("Enter name"));
      return;
    }
    this.receivedData.role.roles = form.value.name;
    this.receivedData.role.reduction = form.value.shortening;
    this.receivedData.role.number = form.value.number;
    this.receivedData.role.sortingScheme = form.value.sortOrder;
    this.receivedData.role.price = form.value.award;
    this.receivedData.role.active = 1;//form.value.status == true ? "1" : "0";
    this.receivedData.role.changed = true;
    this.save();
  }
}
