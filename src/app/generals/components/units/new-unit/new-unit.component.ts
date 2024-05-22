import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { MaterialsService } from "src/app/core/services/materials.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-new-unit",
  templateUrl: "./new-unit.component.html",
  styleUrls: ["./new-unit.component.css"],
})
export class NewUnitComponent implements OnInit {
  public createForm: FormGroup;
  form: FormGroup;

  newUnit = {
    Unit: "",
    additionalWorkUnits: "",
    otherUEUnits: "",
    materialUnits: "",
    mileageUnits: ""
  };
  unitName: string;
  existingUnits: any;

  constructor(
    private materialsService: MaterialsService,
    public dialogRef: MatDialogRef<NewUnitComponent>,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      checkArray: this.fb.array([]),
      unitName: "",
    });
    if (data) {
      this.existingUnits = data.units;
    }
  }

  unitsChecked: Array<any> = [
    { name: "Additional Work Units", value: "additionalWorkUnits" },
    { name: "Material Units", value: "materialUnits" },
    { name: "Other UE Units", value: "otherUEUnits" },
    { name: "Milage Units", value: "mileageUnits" },
  ];

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCheckboxChange(e) {
    if (
      this.newUnit[e.target.value] == "" ||
      this.newUnit[e.target.value] == undefined
    ) {
      this.newUnit[e.target.value] = this.unitName;
    } else {
      this.newUnit[e.target.value] = "";
    }
  }

  submitForm() {
    if (this.form.valid) {
      this.newUnit.Unit = this.unitName;

      if (!this.existingUnits.includes(this.newUnit.Unit)) {
        this.materialsService.createNewUnit(this.newUnit).subscribe((response) => {
          if (response["status"]) {
            this.newUnit["ID"] = response["ID"];
            response = this.newUnit;
            this.dialogRef.close(response);
            this.toastr.success(
              this.translate.instant("You have successfully created moment."),
              this.translate.instant("Success")
            );
          } else {
            this.toastr.error(
              this.translate.instant("Please provide unit name!")
            );
          }
        });
      } else {
        this.toastr.error(this.translate.instant("Unit already exists!"));
      }
    }
  }
}
