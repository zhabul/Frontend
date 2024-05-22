import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { interval, Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { ProjectsService } from "src/app/core/services/projects.service";
import { AtaService } from "src/app/core/services/ata.service";
import { WeekCounterService } from "src/app/core/services/week-counter.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { SetTimeComponent } from "src/app/timesheets/components/set-time/set-time.component";
import { TranslateService } from "@ngx-translate/core";
import { GeneralsService } from "src/app/core/services/generals.service";
import { environment } from "src/environments/environment";
import * as moment from "moment";
import { UsersService } from "src/app/core/services/users.service";
import { ImageModalOldComponent } from "src/app/projects/components/image-modal-old/image-modal-old.component";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { FileStorageService } from "src/app/core/services/file-storage.service";

declare var $;

@Component({
  selector: "app-time-registration-users-registration",
  templateUrl: "./time-registration-users-registration.component.html",
  styleUrls: ["./time-registration-users-registration.component.css"],
  providers: [],
})
export class TimeRegistrationUsersRegistrationComponent
  implements OnInit, OnDestroy
{
  public date: any;
  public createForm: FormGroup;
  public projects: any[];
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
  public userDetails: any = JSON.parse(sessionStorage.getItem("userDetails"));
  public dateWeek: any;
  public messageDelete: any;
  public week = "Week";
  public timesheets: any[];
  public modalHour: any;
  public workValidator = true;
  public timeValidator = true;
  public projectMoments: any[] = [];
  public roleMoments: any[] = [];
  public popularMomentsForProjects: any[] = [];
  public spinner = true;
  public deadLineDate = false;
  public allowSet = true;
  public roles: any[];
  public project;
  public projectManagerProjects = [];
  public workerAtas = [];
  public types: any[] = [];
  public isMoment = false;
  C;
  public validation = true;
  public projectId: any;
  public choosenProject: boolean = true;
  public childrenProjects: any[] = [];
  public settedProject: boolean = false;
  public hours: any[];
  subscription: Subscription;
  public projectsArray: any[] = [];
  public projectChild: any = null;
  public allowChildrenProjects: boolean = false;
  public masterProject: any;
  public messages: any;
  public selectedMoment: any;
  public allowSend: boolean = false;
  public files: any[] = [];
  public showAttachmentImage = false;
  public wrapper: any;
  public viewer: any;
  public rotateValue: number = 0;

  swiper = {
    images: [],
    active: -1,
    album: -2,
  };

  constructor(
    private timeRegistrationService: TimeRegistrationService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private projectsService: ProjectsService,
    private fb: FormBuilder,
    private ataService: AtaService,
    private weekCounter: WeekCounterService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private generalsService: GeneralsService,
    private userService: UsersService,
    private fsService: FileStorageService
  ) {}
/* [
      { id: 1, type: this.translate.instant("Mileage private car") },
      { id: 2, type: this.translate.instant("Mileage company car") },
    ];  */
  ngOnInit() {
    this.types = this.route.snapshot.data['mileages'].data;
    this.projectManagerProjects =
      this.route.snapshot.data["project_manager_projects"]["data"];

    if (this.projectManagerProjects.length > 0) {
      this.projectManagerProjects.map((project) => {
        project["finalName"] = `${project["CustomName"]} ${project["Name"]}`;
        return project;
      });
      this.projectManagerProjects.unshift({
        finalName: "-",
        CustomName: "-",
        ProjectID: "-1",
        Name: "",
      });
      this.project = this.projectManagerProjects[0];

      this.projectId = this.project["ProjectID"];
    } else {
      this.projectId = "";
      this.router.navigate(["/timesheets/schedule-calendar"]);
    }
    this.route.queryParams.subscribe((params) => {
      if (params && params["date"]) this.date = params["date"];
    });

    if (!this.date) this.date = localStorage.getItem("timeRegistrationData");

    this.dateWeek = this.weekCounter.countWeek(this.date, this.week);
    this.roles = this.route.snapshot.data["roles"]["data"];

    this.deadLineDate = this.roles["dates"].slice(-1);

    this.setValidation();

    let today = moment().format("YYYY-MM-DD");
    let status = this.existDate(today);

    if (status) {
      this.deadLineDate = false;
      this.allowSet = true;
    } else {
      this.allowSet = false;
      this.deadLineDate = true;
    }

    this.getProjects(this.date);
    this.getTimesheets();

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

    this.getHoursFromServer();

    const source = interval(5000);
    this.subscription = source.subscribe((val) => {
      if (environment.production) {
        this.getHoursFromServer();
        this.getAdministratorRoles();
        this.getUserRaportStatus();
      }
    });

    this.timeRegistrationService
      .getUserMessages(this.date, "Timesheet")
      .subscribe((res) => {
        this.messages = res["data"];
      });

    this.getUserRaportStatus();
  }

  getUserRaportStatus() {
    this.projectsService.getUserRaportStatus(this.date).then((res) => {
      if (res["status"]) {
        let user_raport_status = res["data"][0];
        if (user_raport_status) {
          this.router.navigate(["/timesheets/schedule-calendar"]);
        }
      }
    });
  }

  setAta(project) {
    let projectID = project.value;
    this.spinner = true;
    this.getProjectMomentsTidrapport();
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

  async uploadMomentFiles(moments) {

    const momentPromises = [];

    moments.forEach((moment, index)=>{
      if (!moment.id && moment.images.length) {
        const files = {
          images: moment.images.map((image)=>{
            const type =  moment["AtaID"] || moment["AtaID"] != '' ? 'KS' : 'DU';;
            image.Name = `${type}_${image.name}`;
            image.name = `${type}_${image.Name}`;
            return image;
          }),
          pdfs: [],
          index: index
        };
        momentPromises.push(this.fsService.mergeFilesAndAlbums(files));
      }
    });

    const promises = await (Promise.all([momentPromises]));
    const momentFiles = await this.processPromises(promises);
    moments = this.mapMomentImages(moments, momentFiles);

    return moments;
  }

  mapMomentImages(moments, momentFiles) {
    momentFiles.map((files)=>{
      moments[files.index].images = files.images;
      moments[files.index].images = files.images;
    });
    return moments;
  }

  async processPromises(res) {
    let momentFileInfo;
    for (const promiseArray of res) {
      momentFileInfo = await this.loopThroughPromiseArray(promiseArray);
    }
    return momentFileInfo;
  }

  async loopThroughPromiseArray(promiseArray) {
    const momentFileInfo = [];
    for (const image of promiseArray) {
      const resImage = await image;
      resImage.album = 694201337;
      momentFileInfo.push(resImage);
    }
    return momentFileInfo;
  }

  createScheduleDate() {
      this.setMoments();
      const data = this.createForm.value;

      if (this.createForm.valid || data.Moments.length > 0) {
        data.ProjectID = this.project.ProjectID;
        if (data.Mileage) {
          data.Mileage = parseFloat(data.Mileage.replace(",", "."));
        }

        if (data.Moments.length > 0) {
          this.uploadMomentFiles(data.Moments).then((moments)=>{

            data.Moments = moments;
            this.spinner = true;
            this.timeRegistrationService.createTimesheet(data).subscribe((status) => {

                if (status) {
                    this.toastr.success(
                      this.translate.instant("You have successfully scheduled date!"),
                      this.translate.instant("Info")
                    );
                    this.router.navigate(["/timesheets/schedule-calendar"]);
                }
                this.spinner = true;
            });
          });

        } else {
              this.toastr.info(
              this.translate.instant("Please input a moment!"),
              this.translate.instant("Info")
          );
        }
      }
  }

  public selectedDefaultMoment = "";

  chooseMoment(work) {
    this.selectedMoment = work.options[work.selectedIndex].dataset.momentid;
    this.selectedDefaultMoment =
      work.options[work.selectedIndex].dataset.default_moment_id;

    this.createForm.get("Work").patchValue(work.value);
    this.createForm
      .get("type")
      .patchValue(work.options[work.selectedIndex].dataset.type);
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

    data.ProjectID = this.project["ProjectID"];
    data.ProjectName = this.project["CustomName"];

    if (this.createForm.valid && hour >= 0 && hour < 13 && hours !== "00:00") {
      let work = {
        work: data.Work,
        time: hours,
        state: data.State,
        projectName: data.ProjectName,
        AtaID: data.AtaID,
        AtaNumber: ataName,
        ProjectID: data.ProjectID,
        Comment: data.Comment,
        type: data.type,
        AtestStatus: "0",
        MomentBelongsTo: data.MomentBelongsTo,
        momentID: this.selectedMoment,
        default_moment_id: this.selectedDefaultMoment,
        UserID: this.userDetails["user_id"],
        images: this.files,
      };

      this.selectedMoment = "";
      this.selectedDefaultMoment = "";
      this.moments.push(work);
      this.createForm.get("Hours").patchValue("00");
      this.createForm.get("Minutes").patchValue("00");
      this.createForm.get("State").patchValue("");
      this.createForm.get("Comment").patchValue("");
      this.createForm.get("Work").patchValue("");

      this.createForm.get("MomentBelongsTo").patchValue("Project");
      hours = "";
      this.files = [];
    } else {
      if (this.moments.length < 1) {
        this.toastr.info(
          this.translate.instant("Please input a moment!"),
          this.translate.instant("Info")
        );
      }
    }

    this.allowSendData();
    $(".clear-text").val("");
    data.Work = null;
  }

  getAtaName(ata_id) {
    return this.workerAtas.filter((value) => value.ataId == ata_id)[0];
  }

  setAtaVal(ata_id) {
    let ata = this.workerAtas.filter((value) => value.ataId == ata_id)[0];
    this.createForm.get("AtaID").patchValue(ata.ataId);

    if (ata.AtaType == "�TA-")
      this.createForm.get("MomentBelongsTo").patchValue("External");
    else this.createForm.get("MomentBelongsTo").patchValue("Internal");
  }

  removeProperty(index) {
    if (this.moments.length < 1) this.validation = false;
    else this.validation = true;

    this.timeRegistrationService
      .removeAbsenceFromTimesheet(this.moments[index])
      .subscribe((response) => {
        if (response["status"]) {
          this.moments.splice(index, 1);
          this.toastr.success(
            this.translate.instant("You have successfully deleted moment!"),
            this.translate.instant("Success")
          );
          this.allowSendData();
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
          this.spinner = false;
          this.validation = false;
          this.setValidation();
          this.allowSendData();
        }
      });
  }

  allowSendData() {
    if (this.moments.length > 0) this.allowSend = true;
    else this.allowSend = false;
  }

  openModal() {
    const data = this.createForm.value;
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.data = { data: data };
    this.dialog
      .open(SetTimeComponent, diaolgConfig)
      .afterClosed()
      .subscribe((res) => {
        this.modalHour = diaolgConfig["data"]["Hours"];
        this.createForm.value["Hours"] = this.modalHour;
      });
  }

  private getAtas(projectID) {
    this.ataService.getAtas(projectID).subscribe((response) => {
      this.atas = response["data"];
      this.showAtaSelect = true;
      this.spinner = false;
    });
  }

  private getProjectMomentsTidrapport() {

    const data = {
      user_id: this.userDetails.user_id,
      role_id: this.roles["UserRoleID"],
      deleted: this.roles["UserRoleID"] == 0 ? true : false,
      project_id: this.createForm.get("ProjectID").value
    };

    this.userService.getMomentsForTidrapport(data).subscribe((res: any) => {
      this.projectMoments = res.moments.map((moment) => {
        const newMoment = {
          Description: moment["name"],
          Id: moment["id"],
          type: moment["type"],
          parent: moment["parent"],
          sort: moment["sort"],
          moment_number: moment["moment_number"],
          hasMomentsInUser: true,
          default_moment_id: moment["default_moment_id"],
        };
        return newMoment;
      });

      this.spinner = false;
    });
  }

  getMomentsOfProject(project) {
    const project_id = project.value;

    if (project_id !== "-1") {
      this.choosenProject = false;
      this.createForm.get("ProjectID").patchValue(project_id);
      this.getProjectMomentsTidrapport();

      var project = this.projectManagerProjects.filter(
        (value) => value.ProjectID == project_id
      )[0];
      this.project = project;
      this.masterProject = project;

      this.projectUsersChildren(
        this.project.ProjectID
      ).then(projectChildren => {
        if (projectChildren.length > 0) {
          this.allowChildrenProjects = true;
        } else {
          this.allowChildrenProjects = false;
        }
        this.setAtas();
      });
    } else {
      this.workerAtas = [];
      this.projectMoments = [];
      this.clearAtaInput();
    }
  }

  setProject(project_id) {
    this.settedProject = true;
    this.createForm.get("ChildProjectID").patchValue(project_id);

    if (project_id != 0)
      this.project = this.childrenProjects.filter(
        (value) => value.ProjectID == project_id
      )[0];
    else this.project = this.masterProject;
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
          ProjectID: ["", []],
          ProjectID_name: ["", []],
          AtaID: ["", []],
          AtaID_name: ["", []],
          State: ["", [Validators.required]],
          Comment: ["", []],
          Work: ["", [Validators.required]],
          type: ["", [Validators.required]],
          Hours: ["00", []],
          Minutes: ["00", []],
          Moments: [this.moments, []],
          MileageType: ["", []],
          Mileage: ["", []],
          ProjectName: ["", []],
          validation: [this.validation, []],
          UserID: [this.userDetails.user_id],
          ChildProjectID: ["", []],
          ChildProjectName: ["", []],
          MomentBelongsTo: ["Project", []],
        },
        {}
      );
    } else {
      this.createForm = this.fb.group({
        timesheetId: [this.timesheets["id"], []],
        Date: [this.timesheets["Date"], [Validators.required]],
        ProjectID: ["", []],
        ProjectID_name: ["", []],
        AtaID: ["", []],
        AtaID_name: ["", []],
        Comment: ["", []],
        State: ["", [Validators.required]],
        Work: ["", [Validators.required]],
        type: ["", [Validators.required]],
        Hours: ["00", []],
        Minutes: ["00", []],
        Moments: [this.moments, []],
        MileageType: [this.timesheets["MileageType"], []],
        Mileage: [this.timesheets["Mileage"], []],
        ProjectName: ["", []],
        validation: [this.validation, []],
        UserID: [this.userDetails.user_id],
        ChildProjectID: ["", []],
        ChildProjectName: ["", []],
        MomentBelongsTo: ["Project", []],
      });
    }
  }

  clearAtaInput() {
    this.createForm.get("AtaID").patchValue("");
    this.createForm.get("AtaID_name").patchValue("");
  }

  private setAtas() {
    if (!this.project && this.projectManagerProjects.length > 0) {
      this.project = this.projectManagerProjects[0];
      this.ataService.getAtasForTid(this.project["ProjectID"]).subscribe({
        next: (res) => {
          if (res["status"]) {
            const data = res["data"].map((ata) => {
              ata[
                "finalName"
              ] = `${ata["AtaType"]}${ata["AtaNumber"]} ${ata["Name"]}`;
              return ata;
            });
            data.unshift({
              finalName: "-",
              AtaType: "",
              AtaNumber: "",
              Name: "",
              ataId: "",
            });
            this.workerAtas = data;
          }
        },
        complete: () => {
          this.clearAtaInput();
        },
      });
    } else if (this.projectManagerProjects.length > 0) {
      this.ataService.getAtasForTid(this.project["ProjectID"]).subscribe({
        next: (res) => {
          if (res["status"]) {
            const data = res["data"].map((ata) => {
              ata[
                "finalName"
              ] = `${ata["AtaType"]}${ata["AtaNumber"]} ${ata["Name"]}`;
              return ata;
            });
            data.unshift({
              finalName: "-",
              AtaType: "",
              AtaNumber: "",
              Name: "",
              ataId: "",
            });
            this.workerAtas = data;
          }
        },
        complete: () => {
          this.clearAtaInput();
        },
      });
    } else {
      this.ataService
        .getAtasForWorker(this.project.ProjectID, this.userDetails.user_id)
        .subscribe({
          next: (res) => {
            const data = res["data"].map((ata) => {
              ata[
                "finalName"
              ] = `${ata["AtaType"]}${ata["AtaNumber"]} ${ata["Name"]}`;
              return ata;
            });
            data.unshift({
              finalName: "-",
              AtaType: "",
              AtaNumber: "",
              Name: "",
              ataId: "",
            });
            this.workerAtas = data;
          },
          complete: () => {
            this.clearAtaInput();
          },
        });
    }
  }

  async projectUsersChildren(project_id) {
    const response = await this.projectsService.getWorkerAllActivities(
      project_id
    );
    this.createForm.get("ChildProjectID").patchValue("0");
    this.createForm.get("ChildProjectName").patchValue("");
    this.childrenProjects = [];

    if (response["status"] && response["data"].length > 0)
      this.childrenProjects = response["data"];

    return this.childrenProjects;
  }

  private getHoursFromServer() {
    this.generalsService
      .getGeneralHours(this.userDetails.create_timesheets_recordtime)
      .subscribe((response: any) => {
        this.hours = response;

        if (this.hours.length > 1) {
          const currentTime = moment(this.hours[1], "h:mma");
          const generalTime = moment(this.hours[0], "h:mma");
          let date = this.dateWeek.split(" ")[0];
          let currentDate: any = moment().format("YYYY-MM-DD");

          if (
            (generalTime.isBefore(currentTime) && currentDate != date) ||
            (!this.existDate(date) && currentDate != date)
          ) {
            this.toastr.success(
              this.translate.instant("You do not have permission to access!"),
              this.translate.instant("Info")
            );

            this.router.navigate(["/timesheets/schedule-calendar"]);
          }
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private existDate(date) {
    let dates = this.roles["dates"];

    if (dates.length > 0 && dates.includes(date)) return true;
    else return false;
  }

  getAdministratorRoles() {
    this.timeRegistrationService.getUserRoles().subscribe((response) => {
      if (response["status"]) this.roles["dates"] = response["data"]["dates"];
    });
  }

  removeUnit(index) {
    this.openDialog(index);
  }

  openDialog(index) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          const a = document.createElement("a");
          a.click();
          a.remove();
          this.timeRegistrationService
            .deleteUserMessage(this.messages[index].ID)
            .subscribe((response) => {
              if (response["status"]) {
                this.messages.splice(index, 1);
                this.toastr.success(
                  this.translate.instant("Message removed."),
                  this.translate.instant("Success")
                );
              }
            });
        }
      });
  }

  openImageModal() {
    let object = {
      content_type: "moment",
      content_id: null,
      type: "time-registration",
      images: this.files,
      type_id: null,
    };

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.maxHeight = "550px";
    diaolgConfig.data = { data: object, limit: 2, type: "image/*" };
    this.dialog
      .open(ImageModalOldComponent, diaolgConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.files = res.files.map((file)=>{
            return { ...file, album: 694201337 };
          });
        }
      });
  }

  toggleAttachmentImage() {
    this.showAttachmentImage = !this.showAttachmentImage;
  }

  rotateRight() {
    this.rotateValue = this.rotateValue + 90;
    let d = document.getElementsByClassName(
      "iv-large-image"
    )[0] as unknown as HTMLElement;
    d.style.transform = "rotate(" + this.rotateValue + "deg)";
    let x = document.getElementsByClassName(
      "iv-snap-image"
    )[0] as unknown as HTMLElement;
    x.style.transform = "rotate(" + this.rotateValue + "deg)";
    let c = document.getElementsByClassName(
      "iv-snap-handle"
    )[0] as unknown as HTMLElement;
    c.style.transform = "rotate(" + this.rotateValue + "deg)";
  }

  rotateLeft() {
    this.rotateValue = this.rotateValue - 90;
    let d = document.getElementsByClassName(
      "iv-large-image"
    )[0] as unknown as HTMLElement;
    d.style.transform = "rotate(" + this.rotateValue + "deg)";
    let x = document.getElementsByClassName(
      "iv-snap-image"
    )[0] as unknown as HTMLElement;
    x.style.transform = "rotate(" + this.rotateValue + "deg)";
    let c = document.getElementsByClassName(
      "iv-snap-handle"
    )[0] as unknown as HTMLElement;
    c.style.transform = "rotate(" + this.rotateValue + "deg)";
  }

  openSwiper(index, images) {
    this.swiper = {
      active: index,
      images: images,
      album: 0,
    };
  }

  closeSwiper() {
    this.swiper = {
      active: -1,
      images: [],
      album: -2,
    };
  }

  removeSwiperImage(event) {}

  removeFile($event) {
    this.files = this.files.filter((file, index)=>{
      return index != $event;
    });
  }

  public selectedUnitName = '';
  milegeTypeOnChange($event) {
    const id = $event.target.value;
    const type = this.findTypeById(id);
    if (!type) return;
    this.selectedUnitName = type.unit_name;
  }

  findTypeById(id) {
    return this.types.find((type)=>{
      return type.id == id;
    });
  }
}
