import { Component, OnInit, Inject } from "@angular/core";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-new-absence-type",
  templateUrl: "./new-absence-type.component.html",
  styleUrls: ["./new-absence-type.component.css"],
})
export class NewAbsenceTypeComponent implements OnInit {
  public Name = "";
  public ShortName = "";
  public timeCode = "";
  public sortingScheme = "";
  public Active: any = true;
  public paid: any = false;
  public flex: any = false;
  public number_of_flex:number = 0;

  constructor(
      @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private timeRegistrationService: TimeRegistrationService,
    private toastr: ToastrService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<NewAbsenceTypeComponent>,
  ) {}

    ngOnInit() {
        this.number_of_flex = this.modal_data.number_of_flex;
    }

    create() {
        if (!this.Name) {
          this.toastr.error(
            this.translate.instant("Please input the name") + ".",
            this.translate.instant("Error")
          );
        } else {
          const data = {
            AbsenceTypeID: null,
            Name: this.Name,
            ShortName: this.ShortName,
            timeCode: this.timeCode,
            sortingScheme: this.sortingScheme,
            color: "",
            active: this.Active ? 1 : 0,
            paid: this.paid ? 1 : 0,
            flex: this.flex ? 1 : 0,
          };
          this.timeRegistrationService.createNewAbsenceType(data).subscribe((res) => {
            if (res["status"]) {
              data.AbsenceTypeID = res["AbsenceTypeID"];
              this.dialogRef.close(data);
            }
          });
        }
    }
}
