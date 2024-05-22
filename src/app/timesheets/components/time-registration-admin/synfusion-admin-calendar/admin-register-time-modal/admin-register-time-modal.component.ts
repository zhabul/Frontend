import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ProjectsService } from "src/app/core/services/projects.service";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { WeekCounterService } from "src/app/core/services/week-counter.service";
import { AtaService } from "src/app/core/services/ata.service";
import { TranslateService } from "@ngx-translate/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

declare var $;

@Component({
  selector: "app-admin-register-time-modal",
  templateUrl: "./admin-register-time-modal.component.html",
  styleUrls: ["./admin-register-time-modal.component.css"],
})
export class AdminRegisterTimeComponent implements OnInit {
  public createForm: FormGroup;
  public startDate: any;
  public endDate: any;
  public projects: any[] = [];
  public projectUserScheduleDates: any[] = [];
  public hasArrayOfObject = false;
  public errorMessage = false;
  public project: any;
  public user;
  public userOpts;

  public date: any;
  public atas: any[];
  public hoursArray: any[];
  public minutesArray: any;
  public moments: any[] = [];
  public showAtaSelect = false;
  public momentMessage: any;
  public language = "en";
  public workMessage: any;
  public messageErr: any;
  public messageInputMoment: any;
  public dateWeek: any;
  public messageDelete: any;
  public week = "Week";
  public timesheets: any[];
  public modalHour: any;
  public timeValidator = true;
  public projectMoments: any[] = [];
  public spinner = true;
  public deadLineDate = false;
  public allowSet = true;
  public roles: any[];
  public projectManagerProjects;
  public workerAtas = [];
  public types: any[] = [
    { id: 1, type: "Mileage private car" },
    { id: 2, type: "Mileage company car" },
  ];
  public isMoment = false;
  public validation = true;
  public projectId: any;
  public choosenProject = true;
  public childrenProjects: any[] = [];
  public settedProject: boolean = false;

  constructor(
    private fb: FormBuilder,
    private timeRegistrationService: TimeRegistrationService,
    private toastr: ToastrService,
    private weekCounter: WeekCounterService,
    private translate: TranslateService,
    private ataService: AtaService,
    public dialogRef: MatDialogRef<AdminRegisterTimeComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private projectsService: ProjectsService
  ) {}

  ngOnInit() {
    this.user = this.modal_data.user;
    this.date = this.modal_data.date;
    this.project = this.modal_data.project;
    this.userOpts = this.modal_data.userOpts;
    this.projectManagerProjects = this.modal_data.projectManagerProjects;
    this.childrenProjects = this.modal_data.childrenProjects;

    if (!this.project && this.projectManagerProjects.length > 0) {
      this.project = this.projectManagerProjects[0];
    } else if (this.projectManagerProjects.length > 0) {
      this.projectManagerProjects.unshift(this.project);
      this.projectManagerProjects = this.uniqueObjects(
        this.projectManagerProjects
      );
      this.ataService.getAtasForProjectManagersAndAdministrator(
        this.project["ProjectID"]
      );
    } else if (this.project && this.userOpts.create_timesheets_recordtime) {
      this.projectManagerProjects.unshift(this.project);
      this.projectManagerProjects = this.uniqueObjects(
        this.projectManagerProjects
      );
    }

    this.dateWeek = this.weekCounter.countWeek(this.date, this.week);

    this.setValidation().then(async (res) => {
      const projectChildren = await this.projectUsersChildren(
        this.project["ProjectID"]
      );

      if (projectChildren.length > 0) {
        this.project = projectChildren[0];
      }

      if (this.projectManagerProjects.length > 0)
        this.projectId = this.projectManagerProjects[0]["ProjectID"];
      else this.projectId = "";
      this.setAtas();
    });

    this.getTimesheets();
    this.getProjectMoments(this.project.ProjectID);

    $("#dateSheduleDate")
      .datepicker({
        format: "yyyy-mm-dd",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true,
        currentWeekSplitChar: "-",
        weekStart: 1,
      })
      .on("changeDate", (ev) => {
        this.createForm.get("Date").patchValue(ev.target.value);
        this.date = ev.target.value;
        this.getProjects(this.date);
      });

    this.getProjects(this.date);
  }

  setAta(project) {
    let projectID = project.value;
    this.spinner = true;
    this.getProjectMoments(projectID);
    this.getAtas(projectID);
  }

  uniqueObjects(array) {
    var resArr = [];
    array.forEach(function (item) {
      var i = resArr.findIndex((x) => x.ProjectID == item.ProjectID);
      if (i <= -1) {
        resArr.push({
          ProjectID: item.ProjectID,
          CustomName: item.CustomName,
          Name: item.Name,
        });
      }
    });

    return resArr;
  }

  createScheduleDate() {
    const data = this.createForm.value;
    data.ProjectID = this.project.ProjectID;

    if (data.Moments.length > 0) {
      this.spinner = true;
      this.timeRegistrationService.createTimesheet(data).subscribe((status) => {
        if (status) {
          this.toastr.success(
            this.translate.instant("You have successfully scheduled date!"),
            this.translate.instant("Info")
          );
          this.dialogRef.close({ status: true });
        }
      });
    } else {
      this.toastr.error(
        this.translate.instant("Please input a moment!"),
        this.translate.instant("Info")
      );
    }
  }

  chooseMoment(work) {
    this.createForm.get("Work").patchValue(work);
  }

  chooseMinutes(minutes) {
    this.createForm.get("Minutes").patchValue(minutes);
  }

  setMoments() {
    const data = this.createForm.value;
    let ataName = "";

    if (data.AtaID != "" && data.AtaID != "0")
      ataName = this.getAtaName(data.AtaID).AtaNumber;

    let minutes: any = +this.createForm.get("Minutes").value;
    let hourVar = this.createForm.get("Hours").value;
    let hour = +this.createForm.get("Hours").value;

    if (minutes == 0) minutes = "00";

    if (hourVar.length == 1) hourVar = "0" + hourVar;

    let hours = hourVar + ":" + minutes;

    if (
      this.choosenProject &&
      this.user.type == 3 &&
      this.projectManagerProjects.length > 0
    ) {
      data.ProjectID = this.projectManagerProjects[0]["ProjectID"];
      data.ProjectName = this.projectManagerProjects[0]["CustomName"];
    } else {
      data.ProjectID = this.project["ProjectID"];
      data.ProjectName = this.project["CustomName"];
    }

    if (this.createForm.valid && hour >= 0 && hour < 13) {
      let project_id = data.ProjectID;
      let project_name = data.ProjectName;

      if (data["ChildProjectName"] != "0")
        project_name = data["ChildProjectName"];

      if (data["ChildProjectID"] != "0") project_id = data["ChildProjectID"];

      let work = {
        work: data.Work,
        time: hours,
        state: data.State,
        projectName: project_name,
        AtaID: data.AtaID,
        AtaNumber: ataName,
        ProjectID: project_id,
      };
      this.moments.push(work);

      this.createForm.get("Hours").patchValue("");
      this.createForm.get("Minutes").patchValue("00");
      this.createForm.get("State").patchValue("");
      hours = "";

      this.toastr.success(
        this.translate.instant("You have successfully added Moment!"),
        this.translate.instant("Info")
      );
    } else {
      if (hour >= 13)
        this.toastr.error(
          this.translate.instant("Please input hourse between 00 and 12!"),
          this.translate.instant("Info")
        );
      else
        this.toastr.error(
          this.translate.instant("Please input a moment!"),
          this.translate.instant("Info")
        );
    }

    $(".clear-text").val("");
    data.Work = null;
  }

  getAtaName(ata_id) {
    return this.workerAtas.filter((value) => value.ataId == ata_id)[0];
  }

  setAtaVal(ata_id) {
    let ata = this.workerAtas.filter((value) => value.ataId == ata_id)[0];
    this.createForm.get("AtaID").patchValue(ata.ataId);
  }

  removeProperty(index) {
    if (this.moments.length < 1) this.validation = false;
    else this.validation = true;

    this.timeRegistrationService
      .removeAbsenceFromTimesheet(this.moments[index])
      .subscribe((response) => {
        if (response["status"]) {
          this.moments.splice(index, 1);
          this.toastr.error(
            this.translate.instant("You have successfully deleted moment!"),
            this.translate.instant("Info")
          );
        }
      });
  }

  getProjects(date) {
    this.projectsService.getCurrentUserProjects(date).then((response) => {
      this.projects = response;
      this.spinner = false;
    });
  }

  getTimesheets() {
    this.timeRegistrationService
      .getTimesheets(this.date)
      .then((response) => {
        if (
          response["status"] &&
          response["data"] &&
          response["data"]["moments"] &&
          response["data"]["moments"].length > 0
        ) {
          this.timesheets = response["data"];
          this.moments = response["data"]["moments"];
          this.getAtas(response["data"]["ProjectID"]);
          this.getProjectMoments(response["data"]["ProjectID"]);
          this.spinner = false;
          this.validation = false;
          this.setValidation();
        }
      })
  }

  private getAtas(projectID) {
    this.ataService.getAtas(projectID).subscribe((response) => {
      this.atas = response["data"];
      this.showAtaSelect = true;
      this.spinner = false;
    });
  }

  private getProjectMoments(project_id) {
    this.timeRegistrationService
      .getProjectMoments(project_id)
      .subscribe((response) => {
        this.projectMoments = response["data"];
        this.spinner = false;
      });
  }

  async getMomentsOfProject(project_id) {
    this.choosenProject = false;
    this.getProjectMoments(project_id);
    this.createForm.get("ProjectID").patchValue(project_id);
    let project = this.projectManagerProjects.filter(
      (value) => value.ProjectID == project_id
    )[0];
    this.project = project;
    this.createForm.get("ProjectName").patchValue(this.project.CustomName);

    const projectChildren = await this.projectUsersChildren(
      this.project.ProjectID
    );

    if (projectChildren.length > 0) {
      this.project = projectChildren[0];
    }

    this.setAtas();
  }

  setProject(project_id) {
    this.settedProject = true;
    this.createForm.get("ChildProjectID").patchValue(project_id);
    let project = this.childrenProjects.filter(
      (value) => value.ProjectID == project_id
    )[0];
    this.project = project;
    this.createForm.get("ChildProjectName").patchValue(this.project.CustomName);
    this.setAtas();
  }

  timeSetData(event) {
    this.createForm.get("Hours").patchValue(event);
  }

  async setValidation() {
    if (this.validation) {
      this.createForm = this.fb.group(
        {
          timesheetId: ["", []],
          Date: [this.dateWeek, []],
          ProjectID: [this.project.ProjectID, []],
          AtaID: ["", []],
          State: ["", [Validators.required]],
          Comment: ["", []],
          Work: ["", [Validators.required]],
          Hours: ["", [Validators.required]],
          Minutes: ["00", [Validators.required]],
          Moments: [this.moments, []],
          MileageType: ["", []],
          Mileage: ["", []],
          ProjectName: [this.project.Name, []],
          validation: [this.validation, []],
          UserID: [this.user.id],
          ChildProjectID: ["", []],
          ChildProjectName: ["", []],
        },
        {}
      );
    } else {
      this.createForm = this.fb.group({
        timesheetId: [this.timesheets["id"], []],
        Date: [this.timesheets["Date"], [Validators.required]],
        ProjectID: [this.project.ProjectID, []],
        AtaID: ["", []],
        Comment: [this.timesheets["Comment"], []],
        State: ["", [Validators.required]],
        Work: ["", [Validators.required]],
        Hours: ["", [Validators.required]],
        Minutes: ["00", [Validators.required]],
        Moments: [this.moments, []],
        MileageType: [this.timesheets["MileageType"], []],
        Mileage: [this.timesheets["Mileage"], []],
        ProjectName: [this.project.Name, []],
        validation: [this.validation, []],
        UserID: [this.user.id],
        ChildProjectID: ["", []],
        ChildProjectName: ["", []],
      });
    }
  }

  private setAtas() {
    if (!this.project && this.projectManagerProjects.length > 0) {
      this.project = this.projectManagerProjects[0];
      this.ataService
        .getAtasForProjectManagersAndAdministrator(this.project["ProjectID"])
        .then((res) => {
          if (res["status"]) this.workerAtas = res["data"];
        });
    } else if (this.projectManagerProjects.length > 0) {
      this.ataService
        .getAtasForProjectManagersAndAdministrator(this.project["ProjectID"])
        .then((res) => {
          if (res["status"]) this.workerAtas = res["data"];
        });
    } else {
      this.ataService
        .getAtasForWorker(this.project.ProjectID, this.user.id)
        .subscribe((res) => {
          this.workerAtas = res["data"];
        });
    }
  }

  async projectUsersChildren(project_id) {
    let projectChef = this.userOpts.create_timesheets_recordtime;
    const response = await this.projectsService.getUnderProjects(
      project_id,
      projectChef
    );

    if (response["status"] && response["data"].length > 0) {
      this.childrenProjects = response["data"];
      let childProject = this.childrenProjects[0];
      this.createForm
        .get("ChildProjectID")
        .patchValue(childProject["ProjectID"]);
      this.createForm
        .get("ChildProjectName")
        .patchValue(childProject["CustomName"]);
    } else {
      this.childrenProjects = [];
    }

    return this.childrenProjects;
  }
}
