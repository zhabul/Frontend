import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { EditAbsenceComponent } from "./components/edit-absence/edit-absence.component";
import { SettingsService } from "src/app/core/services/settings.service";
import { AbsenceType } from "../../interfaces/absence-type";
import { ToastrService } from "ngx-toastr";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";


@Component({
  selector: "app-absence",
  templateUrl: "./absence.component.html",
  styleUrls: ["./absence.component.css"],
})
export class AbsenceComponent implements OnInit {
  presetColors: string[] = [];
  absences: AbsenceType[];
  loading = true;
  secondLoading = false;
  public userDetails: any = JSON.parse(sessionStorage.getItem("userDetails"));
  public allow_flex:boolean = false;

  constructor(
    private dialog: MatDialog,
    private translate: TranslateService,
    private settingsService: SettingsService,
    private toastr: ToastrService,
    private timeRegistrationService: TimeRegistrationService,
  ) {}

  ngOnInit(): void {

    this.getCompanyWageType();
    this.settingsService.getDefaultAbsenceTypes().subscribe({
      next: (response) => {
        this.absences = response.data;
        this.absences.forEach((absence) => (absence.changed = false));
        this.setNumberOfFlex();
        this.loading = false;
        this.getPresetColors();
      },

      error: (err) => this.toastr.error(this.translate.instant("Server error")),
    });
  }


  openNewAbsenceModal() {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.width = "auto";
    dialogConfig.data = {
      absenceToEdit: {
        Name: "",
        ShortName: "",
        color: "",
        paid: "0",
        flex: "0",
      },
      numberOfFlex: this.numberOfFlex,
      allow_flex: this.allow_flex,
      action: this.translate.instant("Create new absence type"),
    };
    this.dialog
      .open(EditAbsenceComponent, dialogConfig)
      .afterClosed()
      .subscribe((absence) => {
        if (absence) {
          this.addNewAbsenceType(absence);
        }
      });
  }

  editAbsence(absence) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.width = "auto";
    dialogConfig.data = {
      absenceToEdit: absence,
      numberOfFlex: this.numberOfFlex,
      action: this.translate.instant("Edit absence"),
    };
    this.dialog
      .open(EditAbsenceComponent, dialogConfig)
      .afterClosed()
      .subscribe((absence) => {
        if (absence) {
          this.editAbsenceType(absence);
        }
      });
  }

  removeAbsence(i) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.width = "auto";
    dialogConfig.panelClass = "mat-dialog-confirmation";
    dialogConfig.data = {
      questionText: this.translate.instant(
        "Are you sure you want to delete this absence type?"
      ),
    };
    this.dialog
      .open(ConfirmationModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          this.deleteAbsenceType(i);
        }
      });
  }

  changeColor(color, absence) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    absence.changed = true;
    this.editAbsenceType(absence);
  }

  getPresetColors() {
    this.presetColors = [];
    this.absences.forEach((absence) => this.presetColors.push(absence.color));
  }

  public numberOfFlex = 0;
  setNumberOfFlex() {
    this.numberOfFlex = this.findFlexAbasence();
  }
  findFlexAbasence() {
    return this.absences.find((absence)=>{
      return absence.flex == 1;
    }) ? 1 : 0;
  }

  addNewAbsenceType(absence) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    this.secondLoading = true;
    this.settingsService.createNewDefaultAbsenceType(absence).subscribe({
      next: (response) => {
        if (response.status) {
          this.toastr.success(this.translate.instant("Absence type added"));
          absence.AbsenceTypeID = response.data;
          this.absences.push(absence);
          this.secondLoading = false;
        }
      },
      error: (err) => {
        this.toastr.error(this.translate.instant("Server error"));
      },
    });
  }

  deleteAbsenceType(i: number) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    this.secondLoading = true;
    this.settingsService.deleteDefaultAbsenceType(this.absences[i]).subscribe({
      next: (response) => {
        if (response.status) {
          this.toastr.success(
            this.translate.instant("You successfully deleted absence type.")
          );
          this.absences.splice(i, 1);
          this.secondLoading = false;
        }
      },
      error: (err) => {
        this.toastr.error(this.translate.instant("Server error"));
      },
    });
  }

  editAbsenceType(absence) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    this.secondLoading = true;
    this.settingsService.updateDefaultAbsenceType(absence).subscribe({
      next: (response) => {
        if (response.status) {
          this.toastr.success(
            this.translate.instant("You have successfully edited Absence!")
          );
          this.secondLoading = false;
          this.setNumberOfFlex();
        }
      },
      error: (err) => {
        this.toastr.error(this.translate.instant("Server error"));
        this.secondLoading = false;
      },
    });
  }
  getCompanyWageType() {
    this.timeRegistrationService
      .getCompanyWageType()
      .subscribe((res) => {
        if(res["data"].name == 'Pays 8 hours of worked time, other time to Flexbanken') {
          this.allow_flex = true;
        }else {
          this.allow_flex = false;
        }
      });
  }

}
