import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { MatDialogRef } from "@angular/material/dialog";
declare var $;

@Component({
  selector: "app-new-public-holidays",
  templateUrl: "./new-public-holidays.component.html",
  styleUrls: ["./new-public-holidays.component.css"],
})
export class NewPublicHolidaysComponent implements OnInit {
  public createForm: FormGroup;
  public language = "en";
  public week = "Week";
  public spinner: boolean = false;

  constructor(
    private fb: FormBuilder,
    private timeRegistrationService: TimeRegistrationService,
    private toastr: ToastrService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<NewPublicHolidaysComponent>
  ) {
    this.language = sessionStorage.getItem("lang");
    if (this.language == "en") this.week = "Week";
    else this.week = "Vecka";
  }

  ngOnInit() {
    this.createForm = this.fb.group({
      name: ["", [Validators.required]],
      start_date: ["", [Validators.required]],
      end_date: ["", [Validators.required]],
      hours: ["", [Validators.required]],
    });
  }

  ngAfterViewInit() {
    $("#dateSelectStartDate")
      .datepicker({
        format: "yyyy-mm-dd",
        calendarWeeks: true,
        autoclose: true,
        language: this.language,
        todayHighlight: true,
        currentWeek: true,
        currentWeekTransl: this.week,
        currentWeekSplitChar: "-",
        weekStart: 1
      })
      .on("changeDate", (ev) => {
        if (
          Date.parse(ev.target.value.split(" ")[0]) >
          Date.parse(this.createForm.value.end_date.split(" ")[0])
        ) {
          setTimeout(() => {
            this.toastr.info(
              this.translate.instant("Start date cannot be after end date."),
              this.translate.instant("Info")
            );
            ev.target.value = this.createForm.value.start_date;
          }, 0);
        } else {
          this.createForm.get("start_date").patchValue(ev.target.value);
          this.createForm.get("end_date").patchValue(ev.target.value);
          let splited_date = ev.target.value.split(" ")[0];

          $("#dateSelectEndDate").datepicker({
            format: "yyyy-mm-dd",
            calendarWeeks: true,
            autoclose: true,
            language: this.language,
            todayHighlight: true,
            currentWeek: true,
            currentWeekTransl: this.week,
            currentWeekSplitChar: "-",
            weekStart: 1,
          }).datepicker("update", new Date(splited_date));
        }
      });

    $("#dateSelectEndDate")
      .datepicker({
        format: "yyyy-mm-dd",
        calendarWeeks: true,
        autoclose: true,
        language: this.language,
        todayHighlight: true,
        currentWeek: true,
        currentWeekTransl: this.week,
        currentWeekSplitChar: "-",
        weekStart: 1,
      })
      .on("changeDate", (ev) => {
        if (
          Date.parse(ev.target.value.split(" ")[0]) <
          Date.parse(this.createForm.value.start_date.split(" ")[0])
        ) {
          setTimeout(() => {
            this.toastr.info(
              this.translate.instant("End date cannot be before start date."),
              this.translate.instant("Info")
            );
            ev.target.value = this.createForm.value.end_date;
          }, 0);
        } else {
          this.createForm.get("end_date").patchValue(ev.target.value);
        }
      });
  }

  create() {

    if (this.createForm.valid) {
      this.spinner = true;
      const data = this.createForm.value;
      this.timeRegistrationService.createPubilcHoliday(data).subscribe((res) => {
        this.spinner = false;
        if (res["status"]) {
          data.id = res["id"];
          this.dialogRef.close(data);
        }
      });
    }
  }
}
