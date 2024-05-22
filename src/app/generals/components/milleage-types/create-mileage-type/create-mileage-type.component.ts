import { Component, OnInit } from "@angular/core";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-create-mileage-type",
  templateUrl: "./create-mileage-type.component.html",
  styleUrls: ["./create-mileage-type.component.css"],
})
export class CreateMileageTypeComponent implements OnInit {
  public Name = "";
  public timeCode = "";
  public sortingScheme = "";
  public Active: any = true;

  constructor(
    private timeRegistrationService: TimeRegistrationService,
    private toastr: ToastrService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<CreateMileageTypeComponent>
  ) {}

  ngOnInit() {}

  create() {
    if (!this.Name) {
      this.toastr.error(
        this.translate.instant("Please input the name") + ".",
        this.translate.instant("Error")
      );
    } else {
      const data = {
        ID: null,
        Name: this.Name,
        timeCode: this.timeCode,
        sortingScheme: this.sortingScheme,
        active: this.Active ? 1 : 0,
      };
      this.timeRegistrationService.createNewMileageType(data).subscribe((res) => {
        if (res["status"]) {
          data.ID = res["ID"];
          this.dialogRef.close(data);
        }
      });
    }
  }
}
