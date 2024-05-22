import { Component, OnInit, Inject, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { interval, Subscription, tap } from "rxjs";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { ProjectsService } from "src/app/core/services/projects.service";
import { AtaService } from "src/app/core/services/ata.service";
import { WeekCounterService } from "src/app/core/services/week-counter.service";
import { TranslateService } from "@ngx-translate/core";
import { GeneralsService } from "src/app/core/services/generals.service";
import { environment } from "src/environments/environment";
import * as moment from "moment";
import { UsersService } from "src/app/core/services/users.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

declare var $;

@Component({
  selector: "app-imp",
  templateUrl: "./imp.component.html",
  styleUrls: ["./imp.component.css"],
})
export class ImpComponent implements OnInit {
  editingMoment = false;
  public date: any = "";
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
  public spinner = false;
  public deadLineDate = false;
  public allowSet = true;
  public roles: any[];
  public project;
  public projectManagerProjects = [];
  public workerAtas = [
    { finalName: "-", AtaType: "", AtaNumber: "", Name: "", ataId: "" },
  ];
  public types: any[] = [];
  public isMoment = false;
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
  public masterProject: any = { ProjectID: "" };
  public selectedMoment: any;
  public disable_select_edit:boolean = true;
  projectName: string = "";
  activitySelected: boolean = false;
  childProjectID = "-1";
  momentProjectName = "";
  editMomentName = false;
  public editable: boolean = false;
  public availableAtasOrDu:any[] = [];

  createForm2: any;
  public toggle = false;
  public openSelect: boolean = false;
  public typeString: string ;
  public deleted_moments:any[] = [];

  user: any;
  @Output() dispatchRemoveMoment = new EventEmitter<any>();
  public colors = {
    //backgroundColor: '#C7C6C4',
    backgroundColor: '#FFFFFF',
    color: '#44484C',
    border: '1px solid var(--border-color)',
  };

  constructor(
    public dialogRef: MatDialogRef<ImpComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private timeRegistrationService: TimeRegistrationService,
    private router: Router,
    private toastr: ToastrService,
    private projectsService: ProjectsService,
    private fb: FormBuilder,
    private ataService: AtaService,
    private weekCounter: WeekCounterService,
    private translate: TranslateService,
    private generalsService: GeneralsService,
    private userService: UsersService
  ) {}

  ngOnInit() {
    this.getActiveMileageTypes();
    this.user = this.modal_data["user"];
    this.date = this.user.moments[0]["Date"];
    this.projectId = this.modal_data["ProjectID"];
    const userId = this.user["id"];
    const User_roleID = this.user["User_roleID"];
    this.availableAtasOrDu = this.modal_data["availableAtasOrDu"];
    this.setValidation();
    this.spinner = true;
    this.timeRegistrationService
      .getProjectManagerProjects(userId)
      .subscribe((res) => {
        this.projectManagerProjects = res["data"];
        this.availableAtasOrDu = res['getAvailableKSorDU'];

        if (this.projectManagerProjects.length > 0) {
          this.projectManagerProjects.map((project) => {
            project[
              "finalName"
            ] = `${project["CustomName"]} ${project["Name"]}`;
            return project;
          });

          const filteredProjects = this.projectManagerProjects.filter((p) => {
            return p["ProjectID"] === this.projectId;
          });

          if (filteredProjects.length > 0) {
            this.project = filteredProjects[0];
            this.masterProject = filteredProjects[0];
          }
        } else {
          this.projectId = "";
          this.dialogRef.close();
        }

        this.dateWeek = this.weekCounter.countWeek(this.date, this.week);

        this.timeRegistrationService
          .getUserRolesImp({ User_roleID: User_roleID })
          .subscribe((roles) => {
            this.roles = roles["data"];
            this.deadLineDate = this.roles["dates"].slice(-1);
            this.createForm.get("ProjectID").setValue(this.projectId);
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
            const timeSheetsSub = this.getTimesheets();
            timeSheetsSub.subscribe((res) => {
              if (!this.project) {
                let project = this.projectManagerProjects.filter((p) => {
                  return p["CustomName"] == this.projectName;
                })[0];
                if (!project) {
                  project = this.projectManagerProjects[0];
                  this.project = this.projectManagerProjects[0];
                }
                this.masterProject = project;
                const PID = project["ProjectID"];
                this.getMomentsOfProject_Activity({ value: PID });
              } else {
                this.projectId = this.project.ProjectID;
                this.getMomentsOfProject({ value: this.projectId });
              }
            });

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
              }
            });
          });
        this.spinner = false;
      });
    }

    editAll(){
        if(!this.editable) {
            this.disable_select_edit = false;
            this.editable = !this.editable;
            this.setMoments();

        }else{
            this.editable = !this.editable;
        }

      if(this.editable) {
            $(".text-area-comment").addClass("read-only");
            $(".text-area-comment > label").addClass("read-only");
            $(".text-area-comment > textarea").addClass("read-only");
        }else {
            $(".text-area-comment").removeClass("read-only");
            $(".text-area-comment > label").removeClass("read-only");
            $(".text-area-comment > textarea").removeClass("read-only");
        }
        this.enableOrdisableEdit();
    }

    enableOrdisableEdit() {
        if(this.editable) {
            this.colors['backgroundColor'] = '#C7C6C4';
        }else {
            this.colors['backgroundColor'] = '#FFFFFF';
        }
    }

    checkIfActivity(name) {
        const nameCheck = name.split("-");
        let projName = "";
        nameCheck.forEach((nam) => {
            if (nam.length === 4) {
                this.activitySelected = true;
            } else {
                projName === ""
                ? (projName = `${nam}`)
                : (projName = projName + `-${nam}`);
            }
        });
        this.projectName = projName;
        return name;
    }

  setAta(project) {
    let projectID = project.value;

    this.spinner = true;
    this.getProjectMoments();
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
    this.setMoments();
    const data = this.createForm.value;
    data.deleted_moments = this.deleted_moments;

    if (this.createForm.valid || this.moments.length > 0) {
      data.ProjectID = this.project.ProjectID;
      data.edited_user_id = this.user.id;
      if (data.Mileage) {
        data.Mileage = parseFloat(data.Mileage.replace(",", "."));
      }

      if (data.Moments.length > 0) {
        this.spinner = true;
        data["impostorId"] = this.user["id"];

        this.timeRegistrationService.createTimesheet(data).subscribe((status) => {
          this.spinner = false;
          this.dialogRef.close(true);
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

    this.selectedMoment = work.data_moment_id;
    this.selectedDefaultMoment = work.default_moment_id;
    let name = work.Description ? work.Description : work.name;
    this.createForm.get("Work").patchValue(name);
    this.createForm.get("type").patchValue(work.dataset_type);

    // this.selectedMoment = work.options[work.selectedIndex].dataset.momentid;

    // this.selectedDefaultMoment =
    //   work.options[work.selectedIndex].dataset.default_moment_id;

    // this.createForm.get("Work").patchValue(work.value);
    // this.createForm
    //   .get("type")
    //   .patchValue(work.options[work.selectedIndex].dataset.type);
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

    const CFATATYPE = this.createForm.get("AtaID_type");
    const ataType = CFATATYPE.value;

    if (this.createForm.valid && hour >= 0 && hour < 13 && hours !== "00:00") {
        let work = {
            work: data.Work,
            time: hours,
            state: data.State,
            projectName: data.ProjectName,
            project_name: data.ProjectName,
            AtaID: data.AtaID,
            ataID: data.AtaID,
            Date: this.date,
            StartEditDate: this.date,
            AtaNumber: ataName,
            ProjectID: data.ProjectID,
            Comment: data.Comment,
            type: data.type,
            AtestStatus: "0",
            MomentBelongsTo: data.MomentBelongsTo,
            momentID: this.selectedMoment,
            UserID: this.user.id,
            IMP_NEWLY_ADDED: true,
            UserTimeSheetsID: data.timesheetId,
            ataType: ataType,
            default_moment_id: this.selectedDefaultMoment,
            ata_article_id: null,
            atestwr: null,
            debit_id: this.project.debit_id,
            images: [],
            id: null,
        };

        this.selectedMoment = "";
        this.selectedDefaultMoment = "";
        this.moments.push(work);
        this.createForm.get("Moments").patchValue(this.moments);
        this.createForm.get("Hours").patchValue("00");
        this.createForm.get("Minutes").patchValue("00");
        this.createForm.get("State").patchValue("");
        this.createForm.get("Comment").patchValue("");
        this.createForm.get("Work").patchValue("");
        this.createForm.get("MomentBelongsTo").patchValue("Project");
        this.toastr.success(
            this.translate.instant("You have successfully added Moment!"),
            this.translate.instant("Success")
        );
    } else {
        if (this.moments.length < 1) {
            this.toastr.info(
                this.translate.instant("Please input a moment!"),
                this.translate.instant("Info")
            );
        }
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
        this.createForm.get("ataId").patchValue(ata.ataId);

        if (ata.AtaType == "�TA-")
          this.createForm.get("MomentBelongsTo").patchValue("External");
        else this.createForm.get("MomentBelongsTo").patchValue("Internal");
    }

    removeProperty(event) {

        if (event["validation"]) {
          if (this.moments.length < 1) this.validation = false;
          else this.validation = true;
        } else {
          this.dispatchRemoveMoment.emit({
            id: event["id"],
            time: event["time"],
            ProjectID: this.project["ProjectID"],
          });
          this.deleted_moments.push({'id': event["id"]});
          this.moments.splice(event["index"], 1);
          this.createForm.get("Moments").value.splice(event["index"], 1);
          this.toastr.success(
            this.translate.instant("You have successfully deleted this moment!"),
            this.translate.instant("Success")
          );
        }
    }

    getProjects(date) {
        this.projectsService.getCurrentUserProjects(date).then((response) => {
          this.projects = response;
          this.spinner = false;
        });
    }

    getTimesheets() {
        const data = {
          date: this.date,
          user_id: this.user["id"],
        };

        return this.timeRegistrationService
          .getTimesheetsImp(data)
          .pipe(tap((response) => {
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
            }
        }));
    }

    private getAtas(projectID) {
        this.ataService.getAtas(projectID).subscribe((response) => {
          this.atas = response["data"];
          this.showAtaSelect = true;
          this.spinner = false;
        });
    }

    private getProjectMoments() {
        this.spinner = true;
        const data = {
            user_id: this.user.id,
            role_id: this.user.User_roleID,
            deleted: this.roles["UserRoleID"] == 0 ? true : false,
            project_id: this.modal_data["ProjectID"]
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

    async getMomentsOfProject_Activity(project) {
        const project_id = project.value;

        if (project_id !== "-1") {
          this.choosenProject = false;
          this.getProjectMoments();

          this.createForm.get("ProjectID").patchValue(project_id);

          const projectChildren = await this.projectUsersChildren(project_id);
          if (projectChildren.length > 0) {
            const childProject = projectChildren.filter((m) => {
              return m["ProjectID"] == this.projectId;
            })[0];

            if (childProject) {
              this.project = childProject;
              this.createForm
                .get("ChildProjectID")
                .patchValue(this.project.ProjectID);
              this.createForm
                .get("ChildProjectName")
                .patchValue(this.project.projectName);
            }
          } else {
            this.allowChildrenProjects = false;
          }

          return this.setAtas_Activity();
        }
    }

    async getMomentsOfProject(project) {

        if (!project) {
          project = {
            value: this.project.ProjectID
          };
        }

        const project_id = project.value;

        if (project_id !== "-1") {
          this.choosenProject = false;
          this.getProjectMoments();

          this.createForm.get("ProjectID").patchValue(project_id);

          const project = this.projectManagerProjects.filter(
            (value) => value.ProjectID == project_id
          )[0];
          this.project = project;
          this.masterProject = project;
          const projectChildren = await this.projectUsersChildren(project_id);
          if (projectChildren.length > 0) {
            this.allowChildrenProjects = true;
          } else {
            this.allowChildrenProjects = false;
          }

          return this.setAtas();
        } else {
          this.workerAtas = [
            { finalName: "-", AtaType: "", AtaNumber: "", Name: "", ataId: "" },
          ];
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
              ProjectID: [this.projectId, []],
              ProjectID_name: ["", []],
              ProjectID_impName: [this.momentProjectName, []],
              AtaID: ["", []],
              AtaID_name: ["", []],
              AtaID_type: ["", []],
              State: ["", [Validators.required]],
              Comment: ["", []],
              Work: ["", []],
              type: ["", [Validators.required]],
              Hours: ["00", []],
              Minutes: ["00", []],
              Moments: [this.moments, []],
              MileageType: ["", []],
              Mileage: ["", []],
              ProjectName: ["", []],
              validation: [this.validation, []],
              UserID: [this.user.id],
              ChildProjectID: [this.childProjectID, []],
              ChildProjectName: ["", []],
              MomentBelongsTo: ["Project", []],
            },
            {}
          );
        } else {

          this.createForm = this.fb.group({
            timesheetId: [this.timesheets["id"], []],
            Date: [this.timesheets["Date"], [Validators.required]],
            ProjectID: [this.projectId, []],
            ProjectID_name: ["", []],
            ProjectID_impName: [this.momentProjectName, []],
            AtaID: ["", []],
            AtaID_name: ["", []],
            AtaID_type: ["", []],
            Comment: ["", []],
            State: ["", [Validators.required]],
            Work: ["", []],
            type: ["", [Validators.required]],
            Hours: ["00", []],
            Minutes: ["00", []],
            Moments: [this.moments, []],
            MileageType: ["Select type", []],
            Mileage: [this.timesheets["Mileage"], []],
            ProjectName: ["", []],
            validation: [this.validation, []],
            UserID: [this.user.id],
            ChildProjectID: ["", []],
            ChildProjectName: ["", []],
            MomentBelongsTo: ["Project", []],
          });
        }
    }

    clearAtaInput() {
        if(this.createForm.get("AtaID")) {
            this.createForm.get("AtaID").patchValue("");
        }
        if(this.createForm.get("ataId")) {
            this.createForm.get("ataId").patchValue("");
        }
        if(this.createForm.get("AtaID_name")) {
            this.createForm.get("AtaID_name").patchValue("");
        }
    }

    setAtas_Activity() {
        return this.ataService
          .getAtasForWorker(this.project.ProjectID, this.user.id)
          .subscribe({
            next: (res) => {
              const data = res["data"].map((ata) => {
                ata[
                  "finalName"
                ] = `${ata["ataType"]}-${ata["AtaNumber"]} ${ata["Name"]}`;
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

    private setAtas() {
        if (!this.project && this.projectManagerProjects.length > 0) {
          this.project = this.projectManagerProjects[0];
          return this.ataService
            .getAtasForTidImp(this.project["ProjectID"], this.user["id"])
            .subscribe({
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
          return this.ataService
            .getAtasForTidImp(this.project["ProjectID"], this.user["id"])
            .subscribe({
              next: (res) => {
                if (res["status"]) {
                  const data = (this.workerAtas = res["data"].map((ata) => {
                    ata[
                      "finalName"
                    ] = `${ata["AtaType"]}${ata["AtaNumber"]} ${ata["Name"]}`;
                    return ata;
                  }));
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
          return this.ataService
            .getAtasForWorker(this.project.ProjectID, this.user.id)
            .subscribe({
              next: (res) => {
                const data = res["data"].map((ata) => {
                  ata[
                    "finalName"
                  ] = `${ata["ataType"]}-${ata["AtaNumber"]} ${ata["Name"]}`;
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

        this.projectManagerProjects = this.projectManagerProjects.slice(0);
        return this.childrenProjects;
    }

    private getHoursFromServer() {

        this.generalsService
          .getGeneralHours(1)
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
                this.router.navigate(["/projects"]);
              }
            }
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
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

    editProject(moment) {
        this.editingMoment = true;
    }

    updateMoment(event) {

        const eventId = event.id;
        const moments = this.moments.map((mom: any) => {
          if (eventId && mom.id === eventId) {
            return event;
          }
          return mom;
        });
        this.moments = moments;
    }

    closeModal() {
        this.dialogRef.close(true);
    }

    getAtaType(event) {
        this.createForm.get("AtaID_type").setValue(event.ataType);
    }

    editmoment(){
        this.editMomentName = !this.editMomentName;
    }

    toggleON(){
        this.toggle = !this.toggle
    }

    selectopen(type){
      this.typeString = type
      this.openSelect = !this.openSelect
    }

    public HoursArray = [
      {id: 0, value: '00' },
      {id: 1, value: '01' },
      {id: 2, value: '02' },
      {id: 3, value: '03' },
      {id: 4, value: '04' },
      {id: 5, value: '05' },
      {id: 6, value: '06' },
      {id: 7, value: '07' },
      {id: 8, value: '08' },
      {id: 9, value: '09' },
      {id: 10,value: '10' },
    ];

    public MinutesArray = [
      {id: 0, value: '00' },
      {id: 1, value: '15' },
      {id: 2, value: '30' },
      {id: 3, value: '45' },
    ];

    getActiveMileageTypes() {
        this.timeRegistrationService.getActiveMileageTypes().subscribe((result:any) => {
            if(result.status) {
                this.types = result.data;
            }
        });
    }
}
