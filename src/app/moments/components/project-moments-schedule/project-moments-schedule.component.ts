import { Component, OnInit, Inject, AfterViewInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ProjectsService } from "src/app/core/services/projects.service";
import * as moment from "moment";
import { TranslateService } from "@ngx-translate/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
declare var $;

@Component({
  selector: "app-project-moments-schedule",
  templateUrl: "./project-moments-schedule.component.html",
  styleUrls: ["./project-moments-schedule.component.css"],
})
export class ProjectMomentsScheduleComponent implements OnInit, AfterViewInit {
  public createForm: FormGroup;
  public startDate: any;
  public endDate: any;
  private nextDate: any;
  private language = "en";
  private week = "Week";
  public projects: any[] = [];
  public projectUserScheduleDates: any[] = [];
  public hasArrayOfObject = false;
  public errorMessage = false;
  public project: any;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ProjectMomentsScheduleComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private projectsService: ProjectsService,
    private translate: TranslateService
  ) {
    if (this.language == "en") this.week = "Week";
    else this.week = "Vecka";
  }

  ngOnInit() {
    var date = new Date();
    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let momentDate = moment(date, "YYYY-MM-DD");
    let momentDateFormated = momentDate.format("YYYY-MM-DD");
    this.startDate = momentDateFormated;
    this.projects = this.modal_data["projects"];
    this.project = this.modal_data["project"];
    this.nextDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1
    );

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
      EndDate: ["", []],
      projectId: [this.modal_data["project"]["id"], [Validators.required]],
      userId: [this.modal_data["user"]["id"], [Validators.required]],
      ProjectUserId: [
        this.modal_data["user"]["ProjectUserId"],
        [Validators.required],
      ],
      ScheduleDates: [null, []],
      projectName: ["", []],
      Color: [this.project.Color, []],
    });
  }

  ngAfterViewInit() {
    this.createForm.get("projectName").patchValue(this.project.Name);
  }

  createScheduleDate() {
    const data = this.createForm.value;
    data.left =
      Math.round(
        (
          document.querySelector(
            ".table-calendar-day-" + data.StartDate.split(" ")[0]
          ) as any
        ).offsetLeft / 20
      ) * 20;

    if (this.createForm.valid) {
      this.errorMessage = false;
      this.projectsService
        .createScheduleDate(data)
        .then((response) => {
          if (response["status"]) {
            this.dialogRef.close(response);
          }
        })
        .catch((err) => {
          return { status: false };
        });
    } else {
      this.errorMessage = true;
    }
  }

  onChangeSetProjectID(event, project_id) {
    let index = event.target.options.selectedIndex;
    let name = event.target[index].innerText;
    this.project = this.projects[index];
    this.createForm.get("projectId").patchValue(project_id);
    this.createForm.get("projectName").patchValue(name);
    this.project = this.projects.find((x) => x.id === project_id);
    this.createForm.get("Color").patchValue(this.project.Color);
  }

  addToArray() {
    let data = this.createForm.value;
    this.errorMessage = false;

    if (data["StartDate"] != "") {
      if (data["EndDate"] == "") data["EndDate"] = data["StartDate"];

      let object = {
        userId: data["userId"],
        ProjectUserId: data["ProjectUserId"],
        projectName: data["projectName"],
        StartDate: data["StartDate"],
        EndDate: data["EndDate"],
        projectId: data["projectId"],
        left:
          Math.round(
            (
              document.querySelector(
                ".table-calendar-day-" + data.StartDate.split(" ")[0]
              ) as any
            ).offsetLeft / 10
          ) * 10,
        Color: data["Color"],
      };

      this.hasArrayOfObject = true;
      this.projectUserScheduleDates.push(object);
      this.createForm
        .get("ScheduleDates")
        .patchValue(this.projectUserScheduleDates);

      $("#dateSelectStartDate").val("");
      $("#dateSelectEndDate").val("");
    } else {
      this.errorMessage = true;
    }
  }

  removeFromArray(index) {
    this.projectUserScheduleDates.splice(index, 1);
    this.createForm
      .get("ScheduleDates")
      .patchValue(this.projectUserScheduleDates);
  }
}
