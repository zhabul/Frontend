import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ProjectsService } from "src/app/core/services/projects.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

declare var $;

@Component({
  selector: "app-project-moments-schedule-edit",
  templateUrl: "./project-moments-schedule-edit.component.html",
  styleUrls: ["./project-moments-schedule-edit.component.css"],
})
export class ProjectMomentsScheduleEditComponent implements OnInit {
  public createForm: FormGroup;
  private startDate: any;
  private endDate: any;
  private nextDate: any;
  private language = "en";
  private week = "Week";
  public projects: any[] = [];
  public project: any;
  private ProjectUserScheduleDateId: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProjectMomentsScheduleEditComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private projectsService: ProjectsService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    if (this.language == "en") this.week = "Week";
    else this.week = "Vecka";
  }

  ngOnInit() {
    var date = new Date();
    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    this.projects = this.modal_data["projects"];
    this.nextDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1
    );
    this.startDate = this.modal_data["startDate"];
    this.endDate = this.modal_data["endDate"];
    this.ProjectUserScheduleDateId =
      this.modal_data["ProjectUserScheduleDateId"];

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
          this.createForm.get("StartDate").patchValue(ev.target.value);
          this.startDate = ev.target.value;
          let date1 = new Date(this.startDate.split(" ")[0]);
          this.nextDate = new Date(
            date1.getFullYear(),
            date1.getMonth(),
            date1.getDate() + 1
          );
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
        startDate: this.nextDate,
        endDate: 0,
        weekStart: 1
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
      ProjectUserScheduleDateId: [this.ProjectUserScheduleDateId, []],
      StartDate: [this.startDate, [Validators.required]],
      EndDate: [this.endDate, [Validators.required]],
      projectId: [this.modal_data["projectID"], [Validators.required]],
      userId: [this.modal_data["user"]["id"], [Validators.required]],
      ProjectUserId: [
        this.modal_data["user"]["ProjectUserId"],
        [Validators.required],
      ],
    });
  }

  updateScheduleDate() {
    if (this.createForm.valid) {
      const data = this.createForm.value;
      data.left =
        Math.round(
          (
            document.querySelector(
              ".table-calendar-day-" + data.StartDate.split(" ")[0]
            ) as any
          ).offsetLeft / 10
        ) * 10;
      this.projectsService
        .updateScheduleDate(data)
        .then((response) => {
          if (response["status"]) {
            this.dialogRef.close(response["projectUsers"]);
          }
        })
        .catch((err) => {
          return { status: false };
        });
    }
  }

  onChangeSetProjectID(project_id) {
    this.createForm.get("projectId").patchValue(project_id);
  }
}
