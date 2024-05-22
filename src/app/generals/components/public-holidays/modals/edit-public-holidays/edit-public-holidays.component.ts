import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
declare var $;

@Component({
  selector: "app-edit-public-holidays",
  templateUrl: "./edit-public-holidays.component.html",
  styleUrls: ["./edit-public-holidays.component.css"],
})
export class EditPublicHolidaysComponent implements OnInit {
  public createForm: FormGroup;
  public language = "en";
  public week = "Week";
  public holiday;
  public spinner: boolean = false;

  constructor(
    private fb: FormBuilder,
    private timeRegistrationService: TimeRegistrationService,
    public dialogRef: MatDialogRef<EditPublicHolidaysComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any
  ) {
    this.language = sessionStorage.getItem("lang");
    if (this.language == "en") this.week = "Week";
    else this.week = "Vecka";
  }

  ngOnInit() {
    this.holiday = this.modal_data.holiday;
    this.createForm = this.fb.group({
      id: [this.holiday.id, [Validators.required]],
      name: [this.holiday.name, [Validators.required]],
      hours: [this.holiday.hours, [Validators.required]],
      start_date: [this.holiday.start_date, [Validators.required]],
      end_date: [this.holiday.end_date, [Validators.required]],
      old_start_date: [this.holiday.start_date, []],
      old_end_date: [this.holiday.end_date, []],
    });
  }

  update() {
    if (this.createForm.valid) {
      this.spinner = true;
      const data = this.createForm.value;
      this.timeRegistrationService.updatePublicHoliday(data).subscribe((res) => {
        this.spinner = false;
        if (res["status"]) this.dialogRef.close(data);
      });
    }
  }
}
