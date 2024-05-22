import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { MomentsService } from "src/app/core/services/moments.service";
import { TranslateService } from "@ngx-translate/core";

import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
declare var $;

@Component({
  selector: "app-project-schedule-change-completed",
  templateUrl: "./project-schedule-change-completed.component.html",
  styleUrls: ["./project-schedule-change-completed.component.css"],
})
export class ProjectScheduleChangeCompletedComponent implements OnInit {
  public createForm: FormGroup;
  private language = "en";
  private week = "Week";
  public project: any;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ProjectScheduleChangeCompletedComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private momentsService: MomentsService,
    private translate: TranslateService
  ) {
    if (this.language == "en") this.week = "Week";
    else this.week = "Vecka";
  }

  ngOnInit() {
    var date = new Date();
    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    this.project = this.modal_data["project"];

    $("#dateSelectStartDate")
      .datepicker({
        format: "yyyy-mm-dd",
        calendarWeeks: true,
        autoclose: true,
        language: this.language,
        currentWeek: true,
        todayHighlight: true,
        currentWeekTransl: this.week,
        currentWeekSplitChar: "-",
        startDate: today,
        endDate: 0,
        weekStart: 1,
      })
      .on("changeDate", (ev) => {
        this.createForm.get("StartDate").patchValue(ev.target.value);
      });

    this.createForm = this.fb.group({
      percentage: this.modal_data["percentage"],
    });
  }

  changePercent() {
    const newPercentage = this.createForm.value.percentage;
    this.momentsService
      .changePercentage(this.modal_data["planId"], newPercentage)
      .subscribe((res) => {
        if (res["status"]) {
          this.toastr.success(
            this.translate.instant("Successfully changed moment percentage") +
              ".",
            this.translate.instant("Success")
          );
          this.dialogRef.close(newPercentage);
        }
      });
  }
}
