import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { ProjectsService } from "src/app/core/services/projects.service";
import { MomentsService } from "src/app/core/services/moments.service";

declare var $;

@Component({
  selector: "app-add-user-to-children-project",
  templateUrl: "./add-user-to-children-project.component.html",
  styleUrls: ["./add-user-to-children-project.component.css"],
})
export class AddUserToChildrenProjectComponent implements OnInit {
  public createForm: FormGroup;
  public users: any[] = [];
  public project: any;
  public user: any;
  public disableSubmit: boolean = true;
  public usersArray: any[] = [];
  public userIndex: number;
  private language = "en";
  private week = "Week";
  public endDate: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private toastr: ToastrService,
    private projectsService: ProjectsService,
    private momentsService: MomentsService
  ) {
    if (this.language == "en") this.week = "Week";
    else this.week = "Vecka";
  }

  ngOnInit() {
    var date = new Date();
    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    this.project = this.route.snapshot.data["project"] || [];

    this.projectsService.getProjectUsers(this.project.parent).then((res) => {
      if (res["status"]) {
        this.users = res["data"];
        this.user = this.users[0];
      }
    });

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
        startDate: today,
        endDate: 0,
        weekStart: 1,
      })
      .on("changeDate", (ev) => {
        this.createForm.get("EndDate").patchValue(ev.target.value);
        this.endDate = ev.target.value;
      });

    this.createForm = this.fb.group({
      id: ["", []],
      User: [this.user, []],
      UserObj: [this.user, []],
      ProjectID: [this.project.id, []],
      StartDate: ["", [Validators.required]],
      EndDate: ["", [Validators.required]],
      Color: [this.project.Color, []],
    });
  }

  removeFromArray(index) {
    this.project.users.splice(index, 1);
    let user = this.usersArray.splice(index, 1)[0];

    this.projectsService
      .removeUserFromProject(user, this.project)
      .then((response) => {
        if (response["status"]) {
          this.users.push(user);
        }
      });

    if (this.project.users.length == 0) this.disableSubmit = true;
  }

  onChangeSetUser(user_id) {
    this.user = this.users.filter((value) => value.id == user_id)[0];
    this.userIndex = this.users.findIndex((value) => value.id == user_id);
    this.createForm.get("UserObj").patchValue(this.user);
  }

  create() {
    if (this.createForm.valid) {
      const data = this.createForm.value;
      this.projectsService.addUserToProjectFromPermit(data).then((response) => {
        if (response["status"]) {
          this.excuteCronTask();
          this.toastr.success(
            this.translate.instant(
              "You have successfully added User on Project!"
            ),
            this.translate.instant("Success")
          );
          this.router.navigate(["/projects/view/", this.project.id]);
        }
      });
    }
  }

  excuteCronTask() {
    this.momentsService.excuteCronTask();
  }
}
