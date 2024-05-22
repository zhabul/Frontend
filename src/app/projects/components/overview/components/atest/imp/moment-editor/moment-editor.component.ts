import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { AtaService } from "src/app/core/services/ata.service";
import { ProjectsService } from "src/app/core/services/projects.service";
//import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { UsersService } from "src/app/core/services/users.service";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
declare var $;

@Component({
    selector: "tr[app-moment-editor]",
    templateUrl: "./moment-editor.component.html",
    styleUrls: ["./moment-editor.component.css"],
})
export class MomentEditorComponent implements OnInit {
    myform;
    @ViewChild("projectChildren") projectChildren;
    @Input("moment") moment: any;
    projectMoments: any[] = [];
    @Input("projectMoments") set setProjectMoments(projectMoments: any[]) {this.projectMoments = projectMoments;}
    @Input("editable") editable: boolean;
    @Input("projectManagerProjects") projectManagerProjects: any[];
    @Input("index") index: number;
    @Input("indexArr") indexArr;
    @Input("UserRoleID") UserRoleID: number;
    @Input("UserID") UserID: number;
    @Input("data") data:any;
    @Input() availableAtasOrDu;
    @Input() project;
    @Input() disable_select_edit;
    @Input() selectedWeek;
    @Input() selectedUser;
    @Output() dispatchMoment = new EventEmitter<any>();
    @Output() dispatchRemoveMoment = new EventEmitter<any>();
    workerAtas: any[] = [];
    childrenProjects: any[] = [];
    roleMoments: any[] = [];
    projectName: string = "";
    createForm2: any;
    editMomentName = false;
    editTimeName = false;
    editStateName = false;
    editProjectName = false;
    editAtaName = false;
    activitySelected = false;
    editCommentName = false
    defaultValueForSelect = "-1";
    activityPending = true;
    ataPending = true;
    userServiceSub: any;
    timeRegistrationServiceSub: any;
    projectsServiceSub: any;
    ProjectID: string | undefined;
    childID: string | undefined;
    _isDisabled: boolean;

    constructor(
        private fb: FormBuilder,
        private ataService: AtaService,
        private projectsService: ProjectsService,
        //private timeRegistrationService: TimeRegistrationService,
        private dialog: MatDialog,
        private userService: UsersService
    ) {}

    ngOnInit() {
        this.projectName = this.moment["projectName"];
        this.ProjectID = this.moment["ProjectID"];
        this.childID = "-1";
        const momentProjectName = this.checkIfActivity(this.moment["projectName"]);
        const momentAtaID = this.moment["AtaID"];
        const momentState = this.moment["state"];
        const momentTime = this.moment["time"].split(":");
        const momentWork = this.moment["work"];
        const momentComment = this.moment["Comment"];

        if (this.activitySelected === true) {
          for (let i = 0; i < this.projectManagerProjects.length; i++) {
            const project = this.projectManagerProjects[i];
            if (project["CustomName"] === this.projectName) {
              this.ProjectID = project["ProjectID"];
              this.childID = this.moment["ProjectID"];
              break;
            }
          }
        }

        let hours = momentTime[0];
        const minutes = momentTime[1];
        if (hours[0] === "0") {
          hours = hours[1];
        }

        this.createForm2 = this.fb.group({
          ProjectID: [this.ProjectID, []],
          ProjectID_name: ["", []],
          ProjectID_impName: [momentProjectName, []],
          AtaID: [momentAtaID, []],
          AtaID_name: ["", []],
          ChildProjectID: [this.childID, []],
          ChildProjectName: ["", []],
          State: [momentState, []],
          Hours: [hours, []],
          Minutes: [minutes, []],
          Work: [momentWork, []],
          Comment: [momentComment, []]
        });

        if (this.activitySelected === false) {
          this.setAtas();
        }
        if (this.activitySelected === true) {
          this.setAtas_Activity(this.moment["ProjectID"]);
        }

        this.getWorkerAllActivities(this.ProjectID);
        this.getMomentsForRole(this.ProjectID);
        this.isDisabled();
        this.editAtaInputNew(null, this.project);
    }

    public newAtaChangedFromChild(event) {

        const value = event.item.Description;
        this.moment["work"] = value;
        this.moment["type"] = event.item.type;
        this.updateMomentOnParent();
    }

    isDisabled() {

        if(this.moment.AtestStatus == 1) {
            this.createForm2.disable();
        } else {
            this.createForm2.enable();
        }
    }

    checkIfActivity(name) {
        const nameCheck = name.split("-");
        let projName = "";
        nameCheck.forEach((nam) => {
            if (nam.length === 4) {
                this.activitySelected = true;
            } else {
                projName === "" ? (projName = `${nam}`) : (projName = projName + `-${nam}`);
            }
        });

        this.projectName = projName;
        return name;
    }

    editProject() {
        if (this.moment["AtestStatus"] == 0 && this.activityPending === false) {
            this.editProjectName = !this.editProjectName;
            this.selectOption();
        }
    }

    selectOption() {
        setTimeout(() => {
          if (this.projectChildren) {

            const nativeElement = this.projectChildren.nativeElement;
            const children = nativeElement.children;
            let flag = false;
            for (let i = 0; i < children.length; i++) {
              const child = children[i];
              const ProjectID = child.dataset.projectid;
              if (ProjectID == this.moment["ProjectID"]) {
                nativeElement.value = this.moment["ProjectID"];
                flag = true;
                break;
              }
            }
            if (flag === false) {
              nativeElement.value = `-1`;
            }
          }
        }, 1);
    }

    editAta() {

        if (
            this.moment["AtestStatus"] == 0 &&
            this.workerAtas.length > 0 &&
            this.activityPending === false
        ) {
            this.editAtaName = !this.editAtaName;
        }
    }

    editAtaInputNew(event = null, project = null){

        if(event) {

            this.moment["AtaNumber"] = event.item.AtaNumber;
            this.moment["AtaID"] = event.item.ataId;
            this.moment["ataType"] = event.item.AtaType;
            this.moment["atestwr"] = event.item.wr_id;
            this.moment["name"] = event.item.name;
            this.moment["name2"] = event.item.name;
            this.moment["week"] = event.item.week;
            this.moment["year"] = event.item.year;
        }else {
            this.findSelectedName();
        }

        this.updateMomentOnParent();
    }


    findSelectedName() {

        let index = this.availableAtasOrDu[this.moment.ProjectID].findIndex((i) => i['wr_id'] == this.moment.atestwr && this.moment.atestwr != null);
        if( index == -1) {
            if( this.moment.ataId != 0 ) {
                index = this.availableAtasOrDu[this.moment.ProjectID].findIndex((i) => i['AtaNumber'] == this.moment.AtaNumber );
            }else if( this.moment.ataId == 0 && this.moment.debit_id == 2 ) {
              index = this.availableAtasOrDu[this.moment.ProjectID].findIndex((i) => i['ataType'] == 'DU-' );
            }else if (this.moment.ataId == 0) {
                index = this.availableAtasOrDu[this.moment.ProjectID].findIndex((i) => i['ataType'] == 'DU-' );
            }
        }

        if ( index >= 0 ) {
            this.moment.name = this.availableAtasOrDu[this.moment.ProjectID][index].name;
            this.moment.name2 = this.availableAtasOrDu[this.moment.ProjectID][index].name2;
        }
    };


    editProjectChild(event = null, project = null){

        let id;
        let impName;
        if(event) {
            id = event.item.ProjectID;
            impName = event.item.CustomName;
        }else {
            id = project.ProjectID;
            impName = project.CustomName;
        }
        let index = this.availableAtasOrDu[id].findIndex((i) => i['ataId'] == 0 );

        if ( index >= 0 ) {
          this.moment["name"] = this.availableAtasOrDu[id][index].name;
          this.moment["name2"] = this.availableAtasOrDu[id][index].name;
          this.moment["atestwr"] = this.availableAtasOrDu[id][index].wr_id;
          this.moment["week"] = this.availableAtasOrDu[id][index].week;
          this.moment["year"] = this.availableAtasOrDu[id][index].year;
        }else {
            this.moment["name"] = '';
            this.moment["name2"] = '';
            this.moment["atestwr"] = null;
            this.moment["week"] = null;
            this.moment["year"] = null;
        }

        if (id != -1) {

          this.setAtas(id);
          this.createForm2.get("ProjectID_impName").setValue(impName);
          this.moment["projectName"] = impName;
          this.moment["IMP_NEWLY_ADDED"] = false;
          if (id === this.ProjectID) {
            this.moment["IMP_NEWLY_ADDED"] = true;
          }
          this.moment["ProjectID"] = id;
          this.moment['AtaID'] = 0;
          this.moment['ataId'] = 0;
        //  this.moment['atestwr'] = null;
          this.moment['ata_article_id'] = null;
          this.getWorkerAllActivities(id);
          this.updateMomentOnParent();
        }
    }
//OLD
  // editProjectInputEvent(event) {
  //   const id = event.value;
  //   const impName = event.impName;
  //   if (id != -1) {
  //     this.setAtas(id);
  //     this.createForm2.get("ProjectID_impName").setValue(impName);
  //     this.moment["projectName"] = impName;
  //     this.moment["IMP_NEWLY_ADDED"] = false;
  //     if (id === this.ProjectID) {
  //       this.moment["IMP_NEWLY_ADDED"] = true;
  //     }
  //     this.moment["ProjectID"] = id;
  //     this.getWorkerAllActivities(id);
  //     this.updateMomentOnParent();
  //   }
  // }

    editActivityInputEvent(select, index) {

        if (index == -1) {
            const id = this.createForm2.get("ProjectID").value;

            this.moment["projectName"] = this.projectName;
            this.moment["IMP_NEWLY_ADDED"] = false;
            if (id === this.ProjectID) {
                this.moment["IMP_NEWLY_ADDED"] = true;
            }
            this.moment["ProjectID"] = id;
            if (this.activitySelected) {
                this.setAtas_Activity(this.moment["ProjectID"]);
            } else {
                this.setAtas();
            }
            this.updateMomentOnParent();
        } else {
            const child: any = Array.from(select.children).filter((child: any) => {
                return child.value == index;
            })[0];
            const dataset = child.dataset;
            const activityNumber = dataset.activitynumber;
            const ProjectID = dataset.projectid;
            const id = ProjectID;
            const nameCheck = this.moment["projectName"].split("-");
            const nameCheckLength = nameCheck.length;
            this.moment["AtaID"] = "0";
            this.moment["AtaNumber"] = "";
            if (nameCheckLength === 2) {
                this.moment["projectName"] = `${nameCheck[0]}`;
            } else if (nameCheckLength === 3) {
                this.moment["projectName"] = `${nameCheck[0]}-${nameCheck[1]}`;
            }
            this.moment["projectName"] =
            this.moment["projectName"] + "-" + activityNumber;
            this.moment["ProjectID"] = id;
            this.clearAtaInput();
            this.updateMomentOnParent();
            if (this.activitySelected) {
                this.setAtas_Activity(id);
            } else {
                this.setAtas(id);
            }
        }
    }

    clearAtaInput() {
        this.createForm2.get("AtaID").patchValue("");
        this.createForm2.get("AtaID_name").patchValue("");
    }

    setAtas(id = null) {

        if (!id) {
          id = this.createForm2.get("ProjectID").value;
        }
        this.ataPending = true;

        return this.ataService.getAtasForTid(id).subscribe({
            next: (res: any) => {

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
                this.ataPending = false;
            },
            complete: () => this.clearAtaInput(),
        });
    }

    setAtas_Activity(id = null) {
        if (!id) {
          id = this.createForm2.get("ProjectID").value;
        }
        this.ataPending = true;

        return this.ataService.getAtasForWorker(id, this.UserID).subscribe({
            next: (res: any) => {
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
                this.ataPending = false;
            },complete: () => {
                this.clearAtaInput();
            },
        });
    }

    getWorkerAllActivities(id) {
        this.activityPending = true;

        this.projectsServiceSub = this.projectsService
          .getWorkerAllActivities(id)
          .then((response: any) => {
            this.childrenProjects = [];

            if (response["status"]) {
              this.childrenProjects = response["data"];
            }
            this.activityPending = false;
        });
    }

    getMomentsForRole(project_id) {
        this.userServiceSub = this.userService
          .getMomentsForRole({
            RoleID: this.UserRoleID,
            projectID: project_id,
            UserID: this.UserID,
          })
          .subscribe((response: any) => {
            this.roleMoments = response;
          //  const data = { project_id: project_id, user_id: this.UserID };
        });
    }

    public Hours;
    editHours(time){
        this.Hours = time;
        this.createForm2.get("Hours").patchValue(this.Hours);

        if (this.Minutes === "00" && this.Hours === "00") {
          this.Minutes = "15";
          this.createForm2.get("Minutes").setValue("15");
        }

        if(!this.Minutes) {
            this.Minutes = this.moment["time"].split(":")[1];
        }
          this.moment["time"] = `${this.Hours}:${this.Minutes}`;
          this.updateMomentOnParent();
    }

    public Minutes;
    editMinutes(time){

        this.Minutes = time;
        this.createForm2.get("Minutes").patchValue(this.Minutes);

        if (this.Minutes === "00" && this.Hours === "00") {
            this.Minutes = "15";
            this.createForm2.get("Minutes").setValue("15");
        }

        if(!this.Hours) {
            this.Hours = this.moment["time"].split(":")[0];
        }
        this.moment["time"] = `${this.Hours}:${this.Minutes}`;
        this.updateMomentOnParent();
    }

    editTime() {

      // const Hours = this.createForm2.get("Hours").value;

      // const obj1 = time;
      // let Minutes = obj1.item.minutes;
      // console.log(Minutes)
      //     this.createForm2.get("Minutes").patchValue(Minutes);

      // let Minutes = this.createForm2.get("Minutes").value;



   }

    editMoment(element, selected = false) {
        if (this.editMomentName && selected) {
          const value = element.value;
          this.moment["work"] = value;
          this.createForm2.get("Work").patchValue(value);
          this.updateMomentOnParent();
        }
    }

    editState(field, index) {
        const value = this.createForm2.get("State").value;
        this.moment[field] = value;
    }

    editComment(){
       const value = this.createForm2.get("Comment").value;
       this.moment["Comment"] = value;
    }

    updateMomentOnParent() {
        this.dispatchMoment.emit(this.moment);
    }

    removeProperty() {
        this.dispatchRemoveMoment.emit({ validation: true });
        if (this.moment["id"]) {
          const diaolgConfig = new MatDialogConfig();
          diaolgConfig.autoFocus = false;
          diaolgConfig.disableClose = true;
          diaolgConfig.width = "";
          diaolgConfig.data = {
            questionText: "Are you sure you want to delete this moment?",
          };
          diaolgConfig.panelClass = "mat-dialog-confirmation";
          this.dialog
            .open(ConfirmationModalComponent, diaolgConfig)
            .afterClosed()
            .subscribe(async (response) => {
                if (response.result) {
                    this.dispatchRemoveMoment.emit({
                        index: this.index,
                        id: this.moment["id"],
                        time: this.moment.time,
                      });
                }
             /*   if (response.result) {
                    this.timeRegistrationService
                      .removeAbsenceFromTimesheet(this.moment)
                      .subscribe((response: any) => {
                        if (response["status"]) {
                          this.dispatchRemoveMoment.emit({
                            index: this.index,
                            id: this.moment["id"],
                            time: this.moment.time,
                          });
                        }
                      });
                } else {
                    // this.dispatchRemoveMoment.emit({ index: this.index });
                }*/
            });
        }
    }

    handleStateKeyDown(event) {
        event.preventDefault();
    }

    openEditor() {
        this.editAtaName = !this.editAtaName;
        this.editProjectName = !this.editProjectName;
        this.editStateName = !this.editStateName;
        this.editTimeName = !this.editTimeName;
        this.editCommentName = !this.editCommentName;
        this.selectOption();
        this.editMomentName = !this.editMomentName;
        this.updateMomentOnParent();
    }

    public HoursArray = [
      {id: 0, hours: '00' },
      {id: 1, hours: '01' },
      {id: 2, hours: '02' },
      {id: 3, hours: '03' },
      {id: 4, hours: '04' },
      {id: 5, hours: '05' },
      {id: 6, hours: '06' },
      {id: 7, hours: '07' },
      {id: 8, hours: '08' },
      {id: 9, hours: '09' },
      {id: 10,hours: '10' },
    ];

    public MinutesArray = [
      {id: 0, minutes: '00' },
      {id: 1, minutes: '15' },
      {id: 2, minutes: '30' },
      {id: 3, minutes: '45' },
    ];
}
