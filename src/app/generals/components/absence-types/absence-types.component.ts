import { Component, OnInit } from "@angular/core";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { EditAbsenceComponent } from "./edit-absence/edit-absence.component";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { NewAbsenceTypeComponent } from "./new-absence-type/new-absence-type.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

@Component({
  selector: "app-absence-types",
  templateUrl: "./absence-types.component.html",
  styleUrls: ["./absence-types.component.css"],
})
export class AbsenceTypesComponent implements OnInit {
  public absences: any = [];

  constructor(
    private timeRegistrationService: TimeRegistrationService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getAbsenceType();
  }

  getAbsenceType() {
    this.timeRegistrationService
      .getAbsenceTypes()
      .subscribe((response) => {
        this.absences = response["data"];
      });
  }

  openEditModal(absence, i) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.data = { absence: absence };

    this.dialog
      .open(EditAbsenceComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response) {
        //  this.absences[i] = response;
          this.toastr.success(
            this.translate.instant("You successfully updated absence type."),
            this.translate.instant("Success")
          );
          this.getAbsenceType();
        }
      });
  }

  removeAbsence(absence, i) {
    this.timeRegistrationService
      .deleteAbsenceType(absence.AbsenceTypeID)
      .subscribe((res) => {
        if (res["status"]) {
          this.absences.splice(i, 1);
          this.toastr.success(
            this.translate.instant("You successfully deleted absence type."),
            this.translate.instant("Success")
          );
        }
      });
  }

  openModal() {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.data = { number_of_flex: this.absences[0].number_of_flex };

    this.dialog
      .open(NewAbsenceTypeComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response) {
         // this.absences.push(response);
          this.toastr.success(
            this.translate.instant("You successfully created absence type."),
            this.translate.instant("Success")
          );
          this.getAbsenceType();
        }
      });
  }

  colorChanged(color, absenceID) {
    this.timeRegistrationService
      .updateAbsenceTypeColor(absenceID, color)
      .subscribe((res) => {
        if (res["status"]) {
          this.toastr.success(
            this.translate.instant("Successfully updated absence color!"),
            this.translate.instant("Success")
          );
        }
      });
  }
}
