import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-edit-mileage-type",
  templateUrl: "./edit-mileage-type.component.html",
  styleUrls: ["./edit-mileage-type.component.css"],
})
export class EditMileageTypeComponent implements OnInit {
  public createForm: FormGroup;
  public mileage: any;
  public Name: any;
  public timeCode: any;
  public sortingScheme: any;
  public active: any = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private timeRegistrationService: TimeRegistrationService,
    private toastr: ToastrService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<EditMileageTypeComponent>
  ) {}

  ngOnInit() {
    this.mileage = this.modal_data.mileage;
    this.Name = this.mileage.Name;
    this.timeCode = this.mileage.timeCode;
    this.sortingScheme = this.mileage.sortingScheme;
    this.active = this.mileage.active == 1;
  }

  update() {
    if (!this.Name) {
      this.toastr.error(
        this.translate.instant("Please input the name") + ".",
        this.translate.instant("Error")
      );
    } else {
      let ID = this.mileage.ID;
      const data = {
        ID: ID,
        Name: this.Name,
        TimeCode: this.timeCode,
        SortingScheme: this.sortingScheme,
        Active: this.active ? 1 : 0,
      };

      this.timeRegistrationService.updateMileageType(data).subscribe((res) => {
        if (res["status"]) {
          this.mileage.Name = this.Name;
          this.mileage.timeCode = this.timeCode;
          this.mileage.sortingScheme = this.sortingScheme;
          this.mileage.active = this.active;
          this.dialogRef.close(this.mileage);
        }
      });
    }
  }
}
