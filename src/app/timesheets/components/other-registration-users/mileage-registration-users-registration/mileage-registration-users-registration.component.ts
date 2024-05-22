import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { ProjectsService } from "src/app/core/services/projects.service";
import { AtaService } from "src/app/core/services/ata.service";
import { WeekCounterService } from "src/app/core/services/week-counter.service";
import { TranslateService } from "@ngx-translate/core";

declare var $;

@Component({
  selector: "app-mileage-registration-users-registration",
  templateUrl: "./mileage-registration-users-registration.component.html",
  styleUrls: ["./mileage-registration-users-registration.component.css"],
})
export class MileageRegistrationUsersRegistrationComponent implements OnInit {
  public date: any;
  public mileageForm: FormGroup;
  public projects: any[];
  public types: any[] = [
    { id: 1, type: "Mileage private car" },
    { id: 2, type: "Mileage company car" },
  ];
  public language = "en";
  public userDetails: any = JSON.parse(sessionStorage.getItem("userDetails"));
  public dateWeek: any;
  public validation = true;
  public week = "Week";
  public roles: any[];
  public project;
  public atas: any[] = [];

  constructor(
    private timeRegistrationService: TimeRegistrationService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private weekCounter: WeekCounterService,
    private translate: TranslateService,
    private projectsService: ProjectsService,
    private ataService: AtaService
  ) {}

  ngOnInit() {
    this.date = localStorage.getItem("timeRegistrationData");
    this.projects = this.route.snapshot.data["projects"];

    this.dateWeek = this.weekCounter.countWeek(this.date, this.week);
    this.roles = this.route.snapshot.data["roles"]["data"];

    $("#date")
      .datepicker({
        format: "yyyy-mm-dd",
        calendarWeeks: true,
        autoclose: true,
        currentWeek: true,
        todayHighlight: true,
        currentWeekTransl: this.translate.instant("Week"),
        currentWeekSplitChar: "-",
        weekStart: 1,
      })
      .on("changeDate", (ev) => {
        this.mileageForm.get("Date").patchValue(ev.target.value);
        this.date = ev.target.value;
      });

    this.setForm();
  }

  createMileage() {
    let data = this.mileageForm.getRawValue();
    this.timeRegistrationService.createMileage(data).subscribe((res) => {
      if (res["status"]) {
        this.toastr.success(
          this.translate.instant("Mileage added successfully") + "."
        );
        this.router.navigate(["timesheets/schedule-calendar"]);
      }
    });
  }

  setForm() {
    this.mileageForm = this.fb.group({
      Date: [{ value: this.dateWeek, disabled: true }, [Validators.required]],
      Project: ["", []],
      Ata: [{ value: "", disabled: true }, []],
      Comment: ["", []],
      Type: [this.types, [Validators.required]],
      Mileage: ["", [Validators.required]],
    });
  }

  getProject(projectId) {
    this.projectsService.getProject(projectId).then((project) => {
      this.project = project;
      this.getAtas(project.id);
    });
  }

  getAtas(projectId) {
    this.atas = [];
    this.ataService.getAtas(projectId).subscribe((atas) => {
      this.atas = atas["data"];
      if (this.atas.length > 0) {
        this.mileageForm.get("Ata").enable();
      } else {
        this.mileageForm.get("Ata").disable();
      }
    });
  }
}
