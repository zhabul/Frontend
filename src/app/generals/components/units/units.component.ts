import { Component, OnInit } from "@angular/core";
import { MaterialsService } from "src/app/core/services/materials.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { NewUnitComponent } from "./new-unit/new-unit.component";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";

@Component({
  selector: "app-units",
  templateUrl: "./units.component.html",
  styleUrls: ["./units.component.css"],
})
export class UnitsComponent implements OnInit {
  public units = [];
  public data = [];
  searchText: string;

  form: FormGroup;

  constructor(
    private materialsService: MaterialsService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.form = this.fb.group({
      checkArray: this.fb.array([], [Validators.required]),
    });
  }

  ngOnInit() {
    this.getSelectedUnits();
  }

  getSelectedUnits() {
    this.materialsService.getSelectedUnits().subscribe((data) => {
      if (data) {
        data.forEach((item) => {
          this.units.push(item.Unit);
        });
        this.data = data.reverse();
        this.units = this.units.reverse();
      }
    });
  }

  onCheckboxChangeAdditional(index) {
    if (this.data[index].additionalWorkUnits == this.units[index]) {
      this.data[index].additionalWorkUnits = "";
    } else {
      this.data[index].additionalWorkUnits = this.units[index];
    }
    this.materialsService.updateAdditionalWorkUnits({
      ID: this.data[index].ID,
      additionalWorkUnits: this.data[index].additionalWorkUnits,
    });
  }

  onCheckboxChangeOther(index) {
    if (this.data[index].otherUEUnits == this.units[index]) {
      this.data[index].otherUEUnits = "";
    } else {
      this.data[index].otherUEUnits = this.units[index];
    }
    this.materialsService.updateOtherUEUnits({
      ID: this.data[index].ID,
      otherUEUnits: this.data[index].otherUEUnits,
    });
  }

  onCheckboxChangeMileage(index) {
    if (this.data[index].mileageUnits == this.units[index]) {
      this.data[index].mileageUnits = "";
    } else {
      this.data[index].mileageUnits = this.units[index];
    }
    this.materialsService.updateMileageUnits({
      ID: this.data[index].ID,
      mileageUnits: this.data[index].mileageUnits,
    });
  }

  onCheckboxChangeMaterial(index) {
    if (this.data[index].materialUnits == this.units[index]) {
      this.data[index].materialUnits = "";
    } else {
      this.data[index].materialUnits = this.units[index];
    }
    this.materialsService.updateMaterialUnits({
      ID: this.data[index].ID,
      materialUnits: this.data[index].materialUnits,
    });
  }

  openModal() {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.data = {
      units: this.units,
    };
    console.log(this.units);

    this.dialog
      .open(NewUnitComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.units.unshift(response.Unit);
          this.data.unshift(response);
        }
      });
  }

  removeUnit(index) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe(async (response) => {
        if (response.result) {
          this.materialsService
            .deleteUnit(this.data[index].ID)
            .subscribe((response) => {
              if (response["status"]) {
                this.units.splice(index, 1);
                this.data.splice(index, 1);
                console.log(this.translate);
                this.toastr.success(
                  this.translate.instant("You have successfully deleted Unit."),
                  this.translate.instant("Success")
                );
              }
            });
        }
      });
  }
}
