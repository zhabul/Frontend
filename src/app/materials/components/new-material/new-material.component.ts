import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MaterialsService } from "../../../core/services/materials.service";
import { Location } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { AppService } from "src/app/core/services/app.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-new-material",
  templateUrl: "./new-material.component.html",
  styleUrls: ["./new-material.component.css"],
})
export class NewMaterialComponent implements OnInit {
  public units: any[];
  public material: any;
  public userDetails: any;
  public categoryID: number;
  public createForm: FormGroup;
  public disabled = false;
  public materialProperties: any[] = [];
  public chooseFile = false;
  public uploadMessage = "";
  public suppliers: any;
  public selectedUnits: any[] = [];
  public dropdownSettings: any = {};
  public limitSelection = false;
  public cust_trans: any[];

  public IResizeImageOptions: any;
  public previousRoute: string;
  public currentAddRoute: string;
  public suppliersCategores: any[];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private materialsService: MaterialsService,
    private location: Location,
    public translate: TranslateService,
    private appService: AppService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.suppliersCategores =
      this.route.snapshot.data["supplierCategores"]["data"];

    this.dropdownSettings = {
      singleSelection: false,
      idField: "item_id",
      textField: "item_text",
      selectAllText: this.translate.instant("Select All"),
      unSelectAllText: this.translate.instant("Unselect All"),
      itemsShowLimit: 0,
      allowSearchFilter: false,
      noDataAvailablePlaceholderText:
        this.translate.instant("No data available"),
      searchPlaceholderText: this.translate.instant("Search"),
    };

    this.categoryID = this.route.snapshot.params.id;

    this.appService.setShowAddButton = false;
    this.previousRoute = "/materials/submaterial/" + this.categoryID;
    this.appService.setBackRoute(this.previousRoute);
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    this.material = this.route.snapshot.data["material"];

    this.createForm = this.fb.group({
      name: ["", [Validators.required, Validators.maxLength(40)]],
      image: [null],
      details: ["", Validators.maxLength(150)],
      allow_custom: [false],
      units: [this.material["units"]],
      category: [this.suppliersCategores[0].Id, [Validators.required]],
    });

    this.units = this.route.snapshot.data["units"];

    this.units = this.units.map((x) => this.translate.instant(x));

    if (!this.userDetails.create_register_products ) {
      this.router.navigate(["/"]);
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
    if (this.materialProperties.length < 1) {
      return this.toastr.error(
        this.translate.instant("You need to add at least one property") + ".",
        this.translate.instant("Error")
      );
    }
    if (this.createForm.valid) {
      const data = this.createForm.value;
      this.disabled = true;

      this.materialsService
        .addMaterialToCategory({
          ...data,
          props: this.materialProperties,
          categoryID: this.categoryID,
        })
        .subscribe((res) => {
          this.disabled = false;

          if (res["status"]) {
            this.toastr.success(
              this.translate.instant("Successfully added material") + ".",
              this.translate.instant("Success")
            );
            this.router.navigate(["materials/submaterial", this.categoryID]);
          } else {
            this.toastr.error(
              this.translate.instant(
                "There was an error while adding material"
              ) + ".",
              this.translate.instant("Error")
            );
          }
        });
    }
  }

  addProperty(properties) {
    const value = properties.value;
    const unit = this.selectedUnits.join(",");

    if (unit.trim() !== "") {
      this.materialProperties.push({ id: -1, property: value, unit: unit });
      this.material["items"].push({ id: -1, property: value, unit: unit });
      this.toastr.success(
        this.translate.instant("Successfully added property to material") + ".",
        this.translate.instant("Success")
      );
      properties.value = "";
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
    const unitArray = units.split(",");

    unitArray.forEach((unit) => {
      formatedUnits += unit.trim() + ", ";
    });

    return formatedUnits.slice(0, -2);
  }
}
