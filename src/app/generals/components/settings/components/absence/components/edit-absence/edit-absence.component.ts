import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NgForm } from "@angular/forms";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-edit-absence",
  templateUrl: "./edit-absence.component.html",
  styleUrls: ["./edit-absence.component.css"],
})
export class EditAbsenceComponent implements OnInit {
  receivedData: any;
  modal: HTMLElement;
  public numberOfFlex = 0;

  constructor(
    private dialogRef: MatDialogRef<EditAbsenceComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private toastr: ToastrService
  ) {
    this.receivedData = data;
    this.numberOfFlex = this.receivedData.numberOfFlex;
  }

  ngOnInit(): void {
    this.modal = document.querySelector("mat-dialog-container") as HTMLElement;
    this.modal.style.padding = "25px"; //only way to change modal property without changing other modals on application
    if(this.receivedData.name == 'Pays 8 hours of worked time, other time to Flexbanken') {
      this.setShowFlex();
    }
  }

  public showFlex = false;
  setShowFlex() {
    if (this.receivedData.absenceToEdit.flex == 1) {
      this.showFlex = true;
      return;
    }
    if (this.numberOfFlex > 0) {
      this.showFlex = false;
    }
  }

  onSubmit(form: NgForm) {
    if (form.value.name.length == 0 || form.value.shortname.length == 0) {
      this.toastr.info("Enter a name and an abbreviation");
      return;
    }
    if(!this.showFlex) {
      form.value.flex = '0';
    }

    this.receivedData.absenceToEdit.Name = form.value.name;
    this.receivedData.absenceToEdit.ShortName = form.value.shortname;
    this.receivedData.absenceToEdit.paid = form.value.paid == 1 ? "1" : "0";
    this.receivedData.absenceToEdit.flex = form.value.flex == 1 ? "1" : "0";
    this.receivedData.absenceToEdit.color =
      this.receivedData.absenceToEdit.color.length > 0
        ? this.receivedData.absenceToEdit.color
        : "#" + Math.floor(Math.random() * 16777215).toString(16);

    this.dialogRef.close(this.receivedData.absenceToEdit);
  }

  close() {
    this.dialogRef.close(false);
  }
}
