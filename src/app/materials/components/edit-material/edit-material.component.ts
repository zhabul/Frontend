import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MaterialsService } from "../../../core/services/materials.service";
import { TranslateService } from "@ngx-translate/core";
import { Location } from "@angular/common";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { AppService } from "src/app/core/services/app.service";
import { ToastrService } from "ngx-toastr";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmModalComponent } from "src/app/shared/modals/confirm-modal/confirm-modal.component";
import { AppComponent } from "src/app/app.component";
import { Subscription } from "rxjs";

@Component({
  selector: "app-edit-material",
  templateUrl: "./edit-material.component.html",
  styleUrls: ["./edit-material.component.css"],
})
export class EditMaterialComponent implements OnInit {
  public units: any[];
  public material: any;
  public createForm: FormGroup;
  public disabled = false;
  public materialProperties: any[] = [];
  public suppliers: any;

  public selectedUnits: any[] = [];
  public dropdownSettings: any = {};
  public _placeholder: any;
  public ShowFilter = false;
  public limitSelection = false;
  public chooseFile = false;
  public uploadMessage = "";

  public cust_trans: any[];
  public previousRoute: string;
  public currentAddRoute: string;
  public userDetails: any;

  public suppliersCategores: any[];
  public language;

  public projectSaveSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private materialsService: MaterialsService,
    private router: Router,
    public translate: TranslateService,
    private location: Location,
    private appService: AppService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private appComponent: AppComponent
  ) {}

  ngOnInit() {
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

    this.language = sessionStorage.getItem("lang");
    this.translate.use(this.language);
    this.suppliersCategores =
      this.route.snapshot.data["supplierCategores"]["data"];

    this.dropdownSettings = {
      singleSelection: false,
      idField: "item_id",
      textField: "item_text",
      selectAllText: this.translate.instant("Select All"),
      unSelectAllText: this.translate.instant("unselect All"),
      itemsShowLimit: 0,
      allowSearchFilter: this.ShowFilter,
      noDataAvailablePlaceholderText:
        this.translate.instant("No data available"),
      searchPlaceholderText: this.translate.instant("Search"),
    };

    this.material = this.route.snapshot.data["material"];
    this.material["items"] = this.material["items"].map((x) => {
      x.canRemove = true;
      return x;
    });
    this.material["items"].forEach((x) => {
      this.materialProperties.push({
        canRemove: true,
        id: x.id,
        property: x.property,
        unit: x.unit,
        orderIndex: x.orderIndex,
      });
    });

    this.previousRoute =
      "/materials/submaterial/" + this.route.snapshot.data.material.parent_id;
    this.appService.setBackRoute(this.previousRoute);
    this.appService.setShowAddButton = false;

    this.createForm = this.fb.group({
      name: [
        this.material["name"],
        [Validators.required, Validators.maxLength(40)],
      ],
      image: [null],
      details: [this.material["details"], Validators.maxLength(250)],
      allow_custom: [this.material["custom"] === "1"],
      units: [this.material["units"]],
      category: [this.material["MaterialCategoryId"], [Validators.required]],
    });

    this.units = this.route.snapshot.data["units"];
    this.units = this.units.map((x) => this.translate.instant(x));

    if (!this.userDetails.show_register_products ) {
      this.router.navigate(["/"]);
    }

    if (this.userDetails.show_register_products ) {
      this.createForm.enable();
    }else {
      this.createForm.disable();
    }
  }

  toogleShowFilter() {
    this.ShowFilter = !this.ShowFilter;
    this.dropdownSettings = Object.assign({}, this.dropdownSettings, {
      allowSearchFilter: this.ShowFilter,
    });
  }

  handleLimitSelection() {
    if (this.limitSelection) {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, {
        limitSelection: 2,
      });
    } else {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, {
        limitSelection: null,
      });
    }
  }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      this.uploadMessage = event.target.files[0].name;
      reader.onload = () => {
        this.chooseFile = true;
        this.createForm.patchValue({
          image: reader.result,
        });
      };
    }
  }


  addMaterial() {
    if (this.createForm.valid) {
      const data = this.createForm.value;
      this.disabled = true;
      const props = this.material["items"].filter(
        (x) => (x.id === -1 || x.remove) && x.canRemove
      );
      const allProps = this.materialProperties.filter((prop) => {
        if (prop.hasOwnProperty("id")) {
          return prop;
        }
      });
      console.log(this.material["items"]);
      this.materialsService
        .updateMaterial({
          ...data,
          props,
          allProps,
          materialID: this.material["id"],
          oldImage: this.material["image"],
        })
        .subscribe((res) => {
          this.disabled = false;
          if (res["status"]) {
            this.material["items"] = this.material["items"].map((m) => {
              if (m.id === -1) {
                const newM = { ...m };
                newM.canRemove = false;
                return newM;
              }
              return m;
            });
            this.materialProperties = this.materialProperties.map((m) => {
              if (m.id === -1) {
                const newM = { ...m };
                newM.canRemove = false;
                return newM;
              }
              return m;
            });

            this.toastr.success(
              this.translate.instant("Successfully edited material") + ".",
              this.translate.instant("Success")
            );
          } else {
            this.toastr.error(
              this.translate.instant(
                "There was an error while editing material"
              ) + ".",
              this.translate.instant("Error")
            );
          }
        });
    }

    this.createForm.markAsPristine();
  }

  addProperty(properties) {
    const value = properties.value;
    const unit = this.selectedUnits.join(",");

    if (unit.trim() !== "") {
      this.materialProperties.push({
        id: -1,
        property: value,
        unit: unit,
        canRemove: true,
      });
      this.material["items"].push({
        id: -1,
        property: value,
        unit: unit,
        canRemove: true,
      });
      properties.value = "";
      this.toastr.success(
        this.translate.instant("Successfully added property to material") + ".",
        this.translate.instant("Success")
      );
    } else {
      this.toastr.info(
        this.translate.instant("No unit is selected") + ".",
        this.translate.instant("Info")
      );
    }
  }

  removeProperty(i) {
    const index = this.material["items"].findIndex(
      (x) => x.property == this.materialProperties[i].property
    );

    if (this.material["items"][index].id === -1) {
      this.material["items"].splice(index, 1);
    } else {
      this.material["items"][index].remove = 1;
    }
    this.materialProperties.splice(i, 1);
    this.toastr.success(
      this.translate.instant("Successfully removed property") + ".",
      this.translate.instant("Success")
    );
  }

  removeMaterial(e) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          this.materialsService
            .removeMaterial(this.material["id"])
            .subscribe((res) => {
              if (res.status) {
                this.toastr.success(
                  this.translate.instant("Successfully deleted material") + ".",
                  this.translate.instant("Success")
                );
                this.router.navigate([
                  "materials/submaterial",
                  this.route.snapshot.data.material.parent_id,
                ]);
              } else {
                this.toastr.error(
                  this.translate.instant(
                    "There was an error while deleting material"
                  ) + ".",
                  this.translate.instant("Error")
                );
              }
            });
        }
      });
    e.preventDefault();
  }

  goBack() {
    this.location.back();
  }

  drop(event: CdkDragDrop<object[]>) {
    moveItemInArray(
      this.materialProperties,
      event.previousIndex,
      event.currentIndex
    );
  }

  formatUnits(units) {
    let formatedUnits = "";
    if (units) {
      const unitArray = units.split(",");
      unitArray.forEach((unit) => {
        formatedUnits += unit.trim() + ", ";
      });
    }
    return formatedUnits.slice(0, -2);
  }




  /**
   *    Code za confirm modal
   */

  onConfirmationModal(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.disableClose = true;
      dialogConfig.width = "185px";
      dialogConfig.panelClass = "confirm-modal";
      this.dialog.open(ConfirmModalComponent, dialogConfig).afterClosed()
        .subscribe((response) => {
          if(response.result) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
    });
  }


  canDeactivate(): Promise<boolean> | boolean {
    if(this.createForm.dirty && this.createForm.valid) {
      this.appComponent.loading = false;
      return this.onConfirmationModal();
    } else {
      return true;
    }
  }

  /**----------------------------------------------- */

}
