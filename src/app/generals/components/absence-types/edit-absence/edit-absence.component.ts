import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { TranslateService } from "@ngx-translate/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-edit-absence",
  templateUrl: "./edit-absence.component.html",
  styleUrls: ["./edit-absence.component.css"],
})
export class EditAbsenceComponent implements OnInit {
  public createForm: FormGroup;
  public absence: any;
  public Name: any;
  public ShortName: any;
  public timeCode: any;
  public sortingScheme: any;
  public active: any = true;
  public paid:any = false;
  public flex:any = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private timeRegistrationService: TimeRegistrationService,
    private toastr: ToastrService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<EditAbsenceComponent>
  ) {}

  ngOnInit() {
    this.absence = this.modal_data.absence;
    this.Name = this.absence.Name;
    this.ShortName = this.absence.ShortName;
    this.timeCode = this.absence.timeCode;
    this.sortingScheme = this.absence.sortingScheme;
    this.active = this.absence.active == 1;
    this.paid = this.absence.paid == 1;
    this.flex = this.absence.flex == 1;
  }

  update() {
    if (!this.Name) {
      this.toastr.error(
        this.translate.instant("Please input the name") + ".",
        this.translate.instant("Error")
      );
    } else {
      const data = {
        ID: this.absence.AbsenceTypeID,
        Name: this.Name,
        ShortName: this.ShortName,
        TimeCode: this.timeCode,
        SortingScheme: this.sortingScheme,
        Color: this.absence.color,
        Active: this.active ? 1 : 0,
        paid: this.paid,
        flex: this.flex,
      };

      this.timeRegistrationService.updateAbsenceType(data).subscribe((res) => {
        if (res["status"]) {
          this.absence.Name = this.Name;
          this.absence.ShortName = this.ShortName;
          this.absence.timeCode = this.timeCode;
          this.absence.sortingScheme = this.sortingScheme;
          this.absence.active = this.active;
          this.dialogRef.close(this.absence);
        }
      });
    }
  }
}
