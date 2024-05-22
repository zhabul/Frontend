import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { MomentsService } from "src/app/core/services/moments.service";
import { TranslateService } from "@ngx-translate/core";

import * as moment from "moment";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
declare var $;

@Component({
  selector: "app-project-schedule-new",
  templateUrl: "./project-schedule-new.component.html",
  styleUrls: ["./project-schedule-new.component.css"],
})
export class ProjectScheduleNewComponent implements OnInit {
  public createForm: FormGroup;
  private startDate: any;
  private endDate: any;
  private language = "en";
  private week = "Week";
  public project: any;
  private ProjectPlanID: number;
  public defaultMoments: any[] = [];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ProjectScheduleNewComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private momentsService: MomentsService,
    private translate: TranslateService
  ) {
    if (this.language == "en") this.week = "Week";
    else this.week = "Vecka";
  }

  ngOnInit() {
    var date = new Date();
    let momentDate = moment(date, "YYYY-MM-DD");
    let momentDateFormated = momentDate.format("YYYY-MM-DD");
    this.startDate = momentDateFormated;
    this.project = this.modal_data["project"];
    this.ProjectPlanID = this.modal_data["ProjectPlanID"];
    this.defaultMoments = this.modal_data["defaultMoments"];

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
        weekStart: 1,
      })
      .on("changeDate", (ev) => {
        if (
          Date.parse(ev.target.value.split(" ")[0]) >
          Date.parse(this.createForm.value.EndDate.split(" ")[0])
        ) {
          setTimeout(() => {
            this.toastr.info(
              this.translate.instant("Start date cannot be after end date."),
              this.translate.instant("Info")
            );
            ev.target.value = this.createForm.value.StartDate;
          }, 0);
        } else {
          this.startDate = ev.target.value;
          this.createForm.get("StartDate").patchValue(ev.target.value);
        }
      });

    $("#dateSelectEndDate")
      .datepicker({
        format: "yyyy-mm-dd",
        calendarWeeks: true,
        autoclose: true,
        language: this.language,
        currentWeek: true,
        todayHighlight: true,
        currentWeekTransl: this.week,
        currentWeekSplitChar: "-",
        weekStart: 1,
      })
      .on("changeDate", (ev) => {
        if (
          Date.parse(ev.target.value.split(" ")[0]) <
          Date.parse(this.createForm.value.StartDate.split(" ")[0])
        ) {
          setTimeout(() => {
            this.toastr.info(
              this.translate.instant("Due date cannot be before start date."),
              this.translate.instant("Info")
            );
            ev.target.value = this.createForm.value.EndDate;
          }, 0);
        } else {
          this.createForm.get("EndDate").patchValue(ev.target.value);
          this.endDate = ev.target.value;
        }
      });

    this.createForm = this.fb.group({
      StartDate: [this.startDate, [Validators.required]],
      EndDate: [this.endDate, []],
      ProjectId: [this.project["id"], []],
      MomentId: ["", [Validators.required]],
      Description: ["", []],
      Color: ["", []],
      Parent: [this.ProjectPlanID, [Validators.required]],
    });
  }

  createProjectMoments() {
    if (this.createForm.valid) {
      const data = this.createForm.value;
      let startDate = data["StartDate"].split(" ")[0];
      let className = "table-calendar-day-" + startDate;
      var left;
      if (
        document.getElementsByClassName(className) &&
        document.getElementsByClassName(className)[0]
      ) {
        let element: any = document.getElementsByClassName(className)[0];
        left = element.offsetLeft;
      }

      var color;
      var width = 20;

      if (data["Color"]) color = data["Color"];
      else color = "#000000";

      data.left = left + 1;
      data["Color"] = color;

      if (data["EndDate"]) {
        let endDate = data["EndDate"].split(" ")[0];
        let numberOfDays = this.numberOfDays(startDate, endDate);
        width = numberOfDays * 20;
      }

      data.Width = width;

      this.momentsService.createProjectPlan(data).subscribe((response) => {
        if (response["status"]) {
          let object = {
            id: response["data"]["id"],
            Description: data["Description"],
            ProjectID: data["ProjectId"],
            Color: data["Color"],
            width: width,
            oldWidth: width,
            top: 5,
            bottom: 5,
            left: data["left"],
            oldLeft: data["left"],
            Days: 1,
            oldDays: 0,
            StartDate: data["StartDate"].split(" ")[0],
            EndDate: data["StartDate"].split(" ")[0],
            Sort: response["data"]["Sort"],
            Group: "0",
            btnText: "",
            childCount: "0",
            children: [],
            visible: true,
            percentage: "0",
            childrenArray: [],
            parent: response["data"]["parent"],
          };

          this.toastr.info(
            this.translate.instant(
              "You have successfully created schedule date."
            ),
            this.translate.instant("Info")
          );
          this.dialogRef.close(object);
        }
      });
    }
  }

  numberOfDays(firstDate, secondDate) {
    var startDay = new Date(firstDate);
    var endDay = new Date(secondDate);
    var millisecondsPerDay = 1000 * 60 * 60 * 24;
    var millisBetween = startDay.getTime() - endDay.getTime();
    var days = Math.abs(millisBetween / millisecondsPerDay) + 1;
    return days;
  }

  onChangeSetMoment(moment_id) {
    let moment = this.defaultMoments.filter(
      (value) => value.id == moment_id
    )[0];
    this.createForm.get("Description").patchValue(moment.Name);
    this.createForm.get("MomentId").patchValue(moment.id);
  }
}
