import { Component, OnInit } from "@angular/core";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { EditMileageTypeComponent } from "./edit-mileage-type/edit-mileage-type.component";
import { CreateMileageTypeComponent } from "./create-mileage-type/create-mileage-type.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

@Component({
  selector: "app-milleage-types",
  templateUrl: "./milleage-types.component.html",
  styleUrls: ["./milleage-types.component.css"],
})
export class MilleageTypesComponent implements OnInit {
  public mileages: any = [];

  constructor(
    private timeRegistrationService: TimeRegistrationService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getMileageTypes();
  }

  getMileageTypes() {
    this.timeRegistrationService
      .getMileageTypes()
      .subscribe((response) => {
        if (response["data"]) this.mileages = response["data"];
      });
  }

  openEditModal(mileage, i) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.data = { mileage: mileage };

    this.dialog
      .open(EditMileageTypeComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.mileages[i] = response;
          this.toastr.success(
            this.translate.instant("You successfully updated mileage type."),
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
    diaolgConfig.data = {};

    this.dialog
      .open(CreateMileageTypeComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.mileages.push(response);
          this.toastr.success(
            this.translate.instant("You successfully created mileage type."),
            this.translate.instant("Success")
          );
        }
      });
  }

  removeMileage(mileage, i) {
    this.timeRegistrationService.deleteMileageType(mileage.ID).subscribe((res) => {
      if (res["status"]) {
        this.mileages.splice(i, 1);
        this.toastr.success(
          this.translate.instant("You successfully deleted mileage type."),
          this.translate.instant("Success")
        );
      }
    });
  }
}
