import { Component, OnInit } from "@angular/core";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { MatDialogConfig, MatDialog } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { SettingsService } from "src/app/core/services/settings.service";
import { Unit } from "../../interfaces/unit";
declare var $;
@Component({
  selector: "app-units-of-measure",
  templateUrl: "./units-of-measure.component.html",
  styleUrls: ["./units-of-measure.component.css"],
})
export class UnitsOfMeasureComponent implements OnInit {
  newUnit = "";
  units: Unit[];
  loading = true;
  public userDetails: any = JSON.parse(sessionStorage.getItem("userDetails"));

  constructor(
    private settingsService: SettingsService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.userDetails.create_settings_Global) {
       $("input").removeAttr('disabled');
    }else {
      $("input").attr('disabled','disabled');
    }

    this.settingsService.getDefaultWorkUnits().subscribe({
      next: (response) => {
        if (response.status) {
          this.units = response.data;
          this.loading = false;
        }
      },

      error: (err) => {
        this.toastr.error(this.translate.instant("Server error"));
      },
    });
  }

  addUnit() {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    if (this.newUnit.length > 0) {
      const newMeasurementUnit = {
        id: "",
        unit: this.newUnit,
        additionalWorkUnits: null,
        materialUnits: null,
        otherUEUnits: null,
        mileageUnits: null
      };

      this.settingsService
        .createNewDefaultWorkUnit(newMeasurementUnit)
        .subscribe({
          next: (response) => {
            if (response.status) {
              newMeasurementUnit.id = response.data;
              this.units.unshift(newMeasurementUnit);
              this.toastr.success(
                this.translate.instant("Unit of measure created")
              );
              this.newUnit = "";
            }
          },
          error: (err) => {
            this.toastr.error(this.translate.instant("Server error"));
          },
        });
    } else {
      this.toastr.info(this.translate.instant("Enter name"));
    }
  }

  changeAdditionalWork(measureUnit) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    if (measureUnit.additionalWorkUnits) {
      measureUnit.additionalWorkUnits = null;
    } else {
      measureUnit.additionalWorkUnits = measureUnit.unit;
    }
    const payload = {
      unit: measureUnit.additionalWorkUnits,
      type: "additionalWorkUnits",
      id: measureUnit.id,
    };
    this.updateWorkUnit(payload);
  }

  changeMaterial(measureUnit) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    if (measureUnit.materialUnits) {
      measureUnit.materialUnits = null;
    } else {
      measureUnit.materialUnits = measureUnit.unit;
    }
    const payload = {
      unit: measureUnit.materialUnits,
      type: "materialUnits",
      id: measureUnit.id,
    };
    this.updateWorkUnit(payload);
  }

  changeUE(measureUnit) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    if (measureUnit.otherUEUnits) {
      measureUnit.otherUEUnits = null;
    } else {
      measureUnit.otherUEUnits = measureUnit.unit;
    }
    const payload = {
      unit: measureUnit.otherUEUnits,
      type: "otherUEUnits",
      id: measureUnit.id,
    };
    this.updateWorkUnit(payload);
  }

  changeMileage(measureUnit) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    if (measureUnit.mileageUnits) {
      measureUnit.mileageUnits = null;
    } else {
      measureUnit.mileageUnits = measureUnit.unit;
    }
    const payload = {
      unit: measureUnit.mileageUnits,
      type: "mileageUnits",
      id: measureUnit.id,
    };
    this.updateWorkUnit(payload);
  }

  deleteUnit(i) {
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
        "Do you really want to delete this unit of measurement?"
      ),
    };
    this.dialog
      .open(ConfirmationModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          this.deleteUnitRequest(i);
        }
      });
  }

  updateWorkUnit(payload) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    this.settingsService.updateDefaultWorkUnits(payload).subscribe({
      next: (response) => {
        if (response.status) {
          this.toastr.success(this.translate.instant("Unit updated"));
        }
      },

      error: () => {
        this.toastr.error(this.translate.instant("Server error"));
      },
    });
  }

  deleteUnitRequest(i: number) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    this.settingsService.deleteDefaultWorkUnit(this.units[i]).subscribe({
      next: (response) => {
        if (response.status) {
          this.units.splice(i, 1);
          this.toastr.success(
            this.translate.instant("You have successfully deleted Unit.")
          );
        }
      },
      error: (err) => {
        this.toastr.error(this.translate.instant("Server error"));
      },
    });
  }
}
