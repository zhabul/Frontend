import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ElementRef,
} from "@angular/core";
import { ProjectsService } from "src/app/core/services/projects.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import {
  NgxMaterialTimepickerComponent,
  NgxMaterialTimepickerTheme,
} from "ngx-material-timepicker";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
//import { AtaService } from "src/app/core/services/ata.service";
import { environment } from "src/environments/environment";
import { interval, Subscription, Subject, Observable } from "rxjs";
import { UsersService } from "src/app/core/services/users.service";
import { CronService } from "src/app/core/services/cron.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ImpComponent } from "./imp/imp.component";
import { IAttestedAbsence } from "./attest-absence/attest-absence.component";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import * as moment from "moment";
import { AtestInfoService } from "./atest-info.service";

@Component({
  selector: "app-atest",
  templateUrl: "./atest.component.html",
  styleUrls: ["./atest.component.css"],
})
export class AtestComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() project: any;
  @Input() selectedWeek;
  @Input() selectedUser;
  @Input() selectedMoment;
  @Input() selectedState;
  @Input() selectedAta;
  @Input() searchText;
  @Input() availableAtasOrDu;
  @Input() momentsForUser;
  @Input() momentChanged;
  @Input() onScrollEvent: Observable<any>;
  private onScrollEventSubscription: Subscription;
  public dataStyle: any = {
    'background-color': 'transparent',
    'border': 'none',
    'outline': 'none',
    'margin':' 0px',
    'min-width': '100%',
    'min-height': '40px'
  };

  public shown: boolean ;

  public language = "en";
  public bluredByEnter = false;
  public checkBoxpdf = false;
  public hoursForAtest: any[] = [];
  public hoursForAtestFiltered: any[] = [];
  public projectAtas = [];
  public userDetails: any;
  public spinner = false;
  public isCopied = false;
  public pageOfItems: Array<any>;
  public matImage = "truerThanfalse";
  public selected_moment:any = null;
  public projectUserDetails;

  @ViewChild("viewerJsImage") viewerJsImage: ElementRef;
  @ViewChild("timePickeView") timePickeView: NgxMaterialTimepickerComponent;

  public currentUser: any;
  public currentMomentIndex = -1;
  public projectMoments = [];

  public darkTheme: NgxMaterialTimepickerTheme = {
    container: {
      bodyBackgroundColor: "#424242",
      buttonColor: "#fff",
    },
    dial: {
      dialBackgroundColor: "#555",
    },
    clockFace: {
      clockFaceBackgroundColor: "#555",
      clockHandColor: "#9fbd90",
      clockFaceTimeInactiveColor: "#fff",
    },
  };
  public subscription: Subscription;
  public notEdited = true;
  public commentValue: any;
  public counter = 0;
  public projectId: any;
  public editAtest: boolean;
  public disabledInput: boolean;
  public fullName: string;
  public notificationText = "";
  public editingComment = false;
  public commentText = "";
  public showAttachmentImage = false;
  public wrapper: any;
  public viewer: any;
  public rotateValue: number = 0;
  public urlSelected = "";
  public editing_moments:any[] = [];
  onRemoveModalSub: any;
  userProjects: any = {};
  selectedImageInfo = {
    date: "",
    name: "",
    description: "",
    momentName: "",
  };
  public maxCharacters = 255;
  public characters = this.maxCharacters ;
  public activeStickyThead :boolean = true;
  public form_dirty:boolean = false;

  @Output() uniqueWeeks: EventEmitter<any> = new EventEmitter();
  @Output() filteringUsers: EventEmitter<any> = new EventEmitter();
  @Output() filteringMoments: EventEmitter<any> = new EventEmitter();
  @Output() filteringStates: EventEmitter<any> = new EventEmitter();
  @Output() filteringAtas: EventEmitter<any> = new EventEmitter();
  @Output() searchingText: EventEmitter<any> = new EventEmitter();
  @Output() attestSave: EventEmitter<any> = new EventEmitter();
  @Output() emitTablesticky: EventEmitter<boolean> = new EventEmitter();

  attestedAbsences: IAttestedAbsence[] = [];
  attestedAbsencesSubject: Subject<IAttestedAbsence[]> = new Subject<
    IAttestedAbsence[]
  >();

  momentsCheckedForAttest = {};

  selectOpen = true;

  swiper = {
    images: [],
    active: -1,
    album: -2,
  };

  rpids = [];


  constructor(
    private projectService: ProjectsService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private translate: TranslateService,
    private timeRegistrationService: TimeRegistrationService,
  //  private ataService: AtaService,
    private usersService: UsersService,
    private cronService: CronService,
    private router: Router,
    private dialog: MatDialog,
    private atestInfoService: AtestInfoService
  ) {
    this.language = sessionStorage.getItem("lang");
  }

    ngOnInit() {
        this.projectUserDetails = this.route.snapshot.data["projectUserDetails"];
        this.onScrollEventSubscription = this.onScrollEvent.subscribe((e) => {
            const mainContainer1 = e.target
            .querySelector("#tablescroll")
            .getBoundingClientRect();

          if(mainContainer1.top < 136.5625){
            this.activeStickyThead = false
          }
          else{
            this.activeStickyThead = true;
          }
        });

        this.projectId = this.route.snapshot.params.id;
        this.getAvailableKSorDU();
        this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
        this.getHoursForAtest();
        this.getUserPermission();

        const source = interval(5000);
        this.subscription = source.subscribe((val) => {
          if (environment.production) {
            this.getUserPermission();
          }
        });

        this.rpids = this.project.responsiblePeople.map((ppl) => {
          return ppl.Id;
        });
    }

    ngAfterViewInit() {

        this.shown;
        this.timePickeView.minutesGap = 5;
        this.timePickeView.format = 24;

        this.timePickeView.timeSet.subscribe((time: String) => {
          this.currentUser.moments[this.currentMomentIndex].time = time;
          this.currentUser.total = 0;
          this.currentUser.moments.forEach((x) => {
            this.currentUser.total = this.sumHours(this.currentUser.total, x.time);
          });
        });
        this.updateMomentSeen();
    }

  ngOnChanges() {
    this.filterHoursForAttest();
    this.emitHoursForAtestUniqueValues();
  }



  toggleselectOpen() {
    this.selectOpen = !this.selectOpen;
  }

  allCheckChange(e, i, i2) {


    const date = this.hoursForAtest[i]["date"];
    const user = this.hoursForAtest[i]["users"][i2];

    user["moments"] = this.hoursForAtest[i]["users"][i2]["moments"].map((x) => {
      x["status"] = e.target.checked;
      this.momentsCheckedForAttest[date][user.id][x.momentId] = x["status"];
      this.momentsCheckedForAttest[date][user.id]["allStatus"] =
        e.target.checked;
      return x;
    });
    user["allStatus"] = true;
    this.form_dirty = true;
  }

  allCommCheckChange(e, i, i2, a) {
    this.hoursForAtest[i]["users"][i2]["moments"] = this.hoursForAtest[i][
      "users"
    ][i2]["moments"].map((x) => {
      x["commentActive"] = e.target.checked;
      return x;
    });
  }

  impChange(e, i, i2, a) {
    if((this.project.status == 2 /*&& this.userDetails.type == 1*/ && !this.disabledInput && this.allowEdit()) || (this.project.status == 2 && this.rpids.includes(this.userDetails.user_id) && !this.disabledInput && this.allowEdit())){
      const hours = this.hoursForAtest[i];
      const user = hours["users"][i2];
      const bgColor = '#C7C6C4';
      this.openImpModal(user, i, i2, bgColor);
    }
  }

  checkAttest( e, i, i2, i3) {

    this.form_dirty = true;
    const date = this.hoursForAtest[i]["date"];
    const user = this.hoursForAtest[i]["users"][i2];
    const moment = user["moments"][i3];
    moment["status"] = e.target.checked;
    this.momentsCheckedForAttest[date][user.id][moment.momentId] =
      moment["status"];

      if(user["moments"].every(element => element.status == true)){
        this.allCheckChange(e, i, i2)
      }else{
        user["allStatus"] = false;
      }
  }

  commentActiveCheck(e, i, i2, i3, moment) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.data = {
      questionText: this.translate.instant("Show to the customer" + "?"),
    };
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {

        if(response.result){

            moment["commentActive"] = true;
            this.toastr.success(
              this.translate.instant("Successfully updated."),
              this.translate.instant("Success")
            );

        }
        if(!response.result){

            if(response.type == 'button'){
              moment["commentActive"] = false;
              this.toastr.success(
                this.translate.instant("Successfully updated."),
                this.translate.instant("Success")
              );
            }

        }

        this.editing_moments.push(moment);
      });

  }

  commentCheck(e, i, i2, i3) {
    this.hoursForAtest[i]["users"][i2]["moments"][i3]["status"] =
      e.target.checked;
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  save() {

    this.atestInfoService.setIfHasChangesOnForm(false);
    this.spinner = true;
    const data:any = {
      projectId: this.route.snapshot.params.id,
      moments: [],
      users: [],
      user_raport_status: [],
      attestedAbsences: this.attestedAbsences.map((abs) => {
        return abs.UserAbsenceID;
      }),
    };


    const project = this.project;
    const AtaSkilledHourlyRate = project.AtaSkilledHourlyRate;
    const AtaWorkerHourlyRate = project.AtaWorkerHourlyRate;
    const ProjectSkilledHourlyRate = project.ProjectSkilledHourlyRate;
    const ProjectWorkerHourlyRate = project.ProjectWorkerHourlyRate;

    this.hoursForAtest = this.hoursForAtest.filter((x) => {
      x["users"] = x["users"].filter((y) => {
        y["moments"] = y["moments"].filter((m) => {
          if (m["status"]) {
            if (!m["time"].toString().includes(":")) {
              const hours = parseInt(m["time"].toString().split(/[,\.]/)[0]);
              let minutes = parseInt(m["time"].toString().split(/[,\.]/)[1]);
              minutes = minutes < 10 ? minutes * 10 : minutes;
              m["time"] =
                hours + ":" + (isNaN(minutes) ? "00" : (minutes / 100) * 60);
            }

            if (!data.user_raport_status[m.Date]) {
              data.user_raport_status[m.Date] = [];
            }

            data.user_raport_status[m.Date].push(y.id);

            const ataHourlyRate =
              m.type == 1 ? AtaWorkerHourlyRate : AtaSkilledHourlyRate;
            const projectHourlyRate =
              m.type == 1 ? ProjectWorkerHourlyRate : ProjectSkilledHourlyRate;

            data.moments.push({
              id: m["momentId"],
              time: m["time"],
              atestComment: m["atestComment"],
              ataId: m["ataId"],
              user_id: y["id"],
              date: m["Date"],
              commentActive: m["commentActive"],
              multiplication_constant: m["multiplication_constant"],
              ata_hourly_rate: m["ataId"] != "0" ? ataHourlyRate : 0,
              project_hourly_rate: m["ataId"] == "0" ? projectHourlyRate : 0,
              project_charge: m["project_charge"],
              user_hourly_rate: m["user_hourly_rate"],
              atestwr: m["atestwr"],
              type: m.type,
              comment: m.comment,
              moment: m.moment
            });
            return false;
          } else {
            return true;
          }
        });

        return y["moments"].length > 0;
      });

      return x["users"].length > 0;
    });

    Object.keys(data.user_raport_status).forEach((key) => {
      const unique = data.user_raport_status[key].filter(
        (v, i, a) => a.indexOf(v) === i
      );
      const object = {
        date: key,
        user_ids: unique,
      };
      data.users.push(object);
    });

    data['editing_moments'] = this.editing_moments;

    if (data.moments.length > 0 || data.attestedAbsences.length > 0 || this.editing_moments.length > 0) {

      this.projectService.updateHoursForAtest(data).then((response) => {
        if (response["status"]) {

          this.toastr.success(
            this.translate.instant("Successfully updated."),
            this.translate.instant("Success")
          );
          this.attestSave.emit(true);
          this.attestedAbsencesSubject.next(data.attestedAbsences);
          this.spinner = false;

          this.attestedAbsences = [];
        } else {
          this.toastr.error(
            this.translate.instant("Something went wrong."),
            this.translate.instant("Error")
          );
          this.spinner = false;
        }
        this.getAvailableKSorDU();
        this.getHoursForAtest();
        this.form_dirty = false;
      });
    } else {
      this.toastr.warning(
        this.translate.instant("Nothing selected."),
        this.translate.instant("Error")
      );
      this.spinner = false;
    }
  }

  private sumHours(time: String, add: String) {
    let minutes = 0;

    const addList = add.split(":");
    const timeList = time.split(":");

    minutes +=
      parseInt(addList[0]) * 60 +
      parseInt(addList[1]) +
      parseInt(timeList[0]) * 60 +
      parseInt(timeList[1]);

    const hours = Math.floor(minutes / 60);

    minutes -= hours * 60;

    return ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2);
  }

  public onTimeClick(e, week_index, user_index, moment_index) {
    this.currentUser = this.hoursForAtest[week_index].users[user_index];
    this.currentMomentIndex = moment_index;

    this.timePickeView.open();
  }

  public createRange(start, end, step) {
    const list = [];
    for (let i = start; i <= end; i += step) {
      list.push(i);
    }
    return list;
  }

  public toggleShowComment(moment) {
    moment.show = !moment.show;
    this.editAtest = true;
    this.editingComment = false;
    if (moment.show) {
      this.commentValue = moment.atestComment;
      this.notEdited = false;
    }
  }

  public closeModal(moment) {
    this.editingComment = false;
    moment.show = !moment.show;
  }

  public closeModalAndSave(moment) {
    if (this.commentValue == null) {
      this.commentValue = "-1";
    }

    if (this.commentValue && moment.atestComment != this.commentValue) {
      this.projectService.updateAtestComment(moment).then((res) => {
        if (res["status"]) {
          moment.attestedBy =
            this.userDetails.firstname + " " + this.userDetails.lastname;
        }
      });
    }
    this.notEdited = true;
    moment.show = !moment.show;
    this.editingComment = false;
  }

  public closeModalAndEditComment(moment) {

    moment.comment = this.commentText;
    this.projectService.updateMomentComment(moment).then((res) => {
      if (res["status"]) {
        moment.comment = moment.comment;
      }
    });
    this.notEdited = true;
    moment.show = !moment.show;
    this.editingComment = false;
  }


    roundTimeToClosetQuaterMinutes(time, minutesToRound) {

        let myarr = time.split(".");
        time = Number(time);
        let hours = Number(myarr[0]);
        let allowed_minutes = [ hours + 0.0, hours + 0.25, hours + 0.5, hours + 0.75];
        return allowed_minutes.reduce(function(prev, curr) {
          return (Math.abs(curr - time) < Math.abs(prev - time) ? curr : prev);
        });
    }

  public onContentEditableBlur(property, element, moment, week_index, user_index, moment_index) {

    this.form_dirty = true;
    this.atestInfoService.setIfHasChangesOnForm(true);

    if (!this.bluredByEnter) {
    }

    if (moment[property] == element.innerText) {
      return;
    }

    const project = this.project;
    const AtaSkilledHourlyRate = project.AtaSkilledHourlyRate;
    const AtaWorkerHourlyRate = project.AtaWorkerHourlyRate;
    const ProjectSkilledHourlyRate = project.ProjectSkilledHourlyRate;
    const ProjectWorkerHourlyRate = project.ProjectWorkerHourlyRate;

    moment[property] = element.innerText;
    moment[property] = moment[property].replace(/&nbsp;/g, "").trim();


    if (property === "time") {
      moment[property] = moment[property].toString().replace(/\s/g, "").replace(",", ".");
    }

    if (property === "time" && moment[property] == 0) {
      return;
    }

    if (property === "state") {
      moment[property] = moment[property]
        .slice(0, 255)
        .trim()
        .replace(/&nbsp;/g, "");
    }
    if (property === "comment") {
      moment[property] = moment[property]
        .slice(0, 500)
        .trim()
        .replace(/&nbsp;/g, "");
    }

    if (property === "time") {
        moment[property] = this.roundTimeToClosetQuaterMinutes(moment[property], 15);
    }


    const ataHourlyRate =
      moment.type == 1 ? AtaWorkerHourlyRate : AtaSkilledHourlyRate;
    const projectHourlyRate =
      moment.type == 1 ? ProjectWorkerHourlyRate : ProjectSkilledHourlyRate;

    moment["ata_hourly_rate"] = moment["ataId"] != "0" ? ataHourlyRate : 0;
    moment["project_hourly_rate"] =
    moment["ataId"] == "0" ? projectHourlyRate : 0;

    const index = this.editing_moments.findIndex((mom) => mom.momentId === moment.momentId);
    if (index < 0) {
        this.editing_moments.push(moment);
    }else {
        this.editing_moments[index] = moment;
    }

    this.bluredByEnter = false;
    return false;
  }

  public preventEnter(element) {
    element.blur();
  }

  public onContentEditableEnter(property, element, moment) {

    this.bluredByEnter = true;
    this.form_dirty = true;
    element.blur();

    if (moment[property] === element.innerText) {
      return;
    }

    moment[property] = element.innerText;
    moment[property] = moment[property];

    if (property === "time") {
      moment[property] = moment[property].toString().replace(",", ".");
    }

    if (property === "time" && moment[property] == 0) {
      return;
    }

    if (property === "state") {
      moment[property] = moment[property]
        .slice(0, 255)
        .trim()
        .replace(/&nbsp;/g, "");
    }
    if (property === "comment") {
      moment[property] = moment[property]
        .slice(0, 255)
        .trim()
        .replace(/&nbsp;/g, "");
    }

    if (property === "time") {
        moment[property] = this.roundTimeToClosetQuaterMinutes(moment[property], 15);
    }

    const index = this.editing_moments.findIndex((mom) => mom.momentId === moment.momentId);
    if (index < 0) {
        this.editing_moments.push(moment);
    }else {
        this.editing_moments[index] = moment;
    }
    //this.updateMoment(moment);
  }

  public setNewMoment(moment, e, i, i2) {
    if (e.target.id === "newMomentSelect") {
      return;
    }
    moment.showCaret = !moment.showCaret;
    const user = this.hoursForAtest[i]["users"][i2];
    if (!moment.isEditingMoments) {
      const data = {
        user_id: user.id,
        role_id: user.User_roleID,
        deleted: true,
      };

      this.usersService.getMomentsForUser(data).subscribe((res: any) => {

        this.momentsForUser = res.moments;
        moment.isEditingMoments = !moment.isEditingMoments;
        user["projectMoments"] = res.moments.map((moment) => {
          const newMoment = {
            Description: moment["name"],
            Id: moment["id"],
            type: "1",
            parent: moment["parent"],
            sort: moment["sort"],
            moment_number: moment["moment_number"],
            hasMomentsInUser: true,
          };

          return newMoment;
        });
      });
    } else {
      moment.isEditingMoments = !moment.isEditingMoments;
    }
    this.form_dirty = true;
  }

  public newMomentChanged(moment) {
    this.updateMoment(moment);
    moment.isEditingMoments = !moment.isEditingMoments;
  }

  public setNewAta(userId, moment, e) {
    if (e.target.id === "newAtaSelect") {
      return;
    }

    const dataset = e.target.dataset;

    if (!dataset.noclick) {
        this.resolveNewAta(userId, moment, e);
        this.form_dirty = true;
    }
  }

  private resolveNewAta(userId, moment, e) {
    moment.showAtaCaret = false;
  }

  private getAvailableKSorDU() {
    this.projectService.getAvailableKSorDU(this.projectId).then((res) => {
      this.availableAtasOrDu = res["data"];
    });
  }

  setActiveDUorWr(atest_wr_id, moment_atestwr) {
    return (atest_wr_id = moment_atestwr);
  }

  public newAtaChanged(item, moment, new_ata_i) {

    moment.ataId = item.ataId;
    moment.AtaNumber = item.AtaNumber;
    moment.ataType = item.ataType;
    moment.atestwr = item.wr_id;
    moment.external = item.external;
    moment.type = item.type ? item.type : moment.type;
    moment.content_name = item.name;
    moment.name = item.name;
    moment.name2 = item.name2;
    const index = this.editing_moments.findIndex((mom) => mom.momentId === moment.momentId);
    if (index < 0) {
        this.editing_moments.push(moment);
    }else {
        this.editing_moments[index] = moment;
    }
    moment.isEditingAta = !moment.isEditingAta;
    return true;
  }

  public newAtaChangedFromChild(event) {
    this.atestInfoService.setIfHasChangesOnForm(true);
    const item = event.item;
    const moment = event.moment;
    const new_ata_i = event.i3;

    this.newAtaChanged(item, moment, new_ata_i);
  }

  public newMomentChangedFromChild(event) {
    this.atestInfoService.setIfHasChangesOnForm(true);
    const moment = event.moment;
          moment.moment = event.item.name;
          moment.work_id = event.item.default_moment_id;
          moment.type = event.item.type;

    const index = this.editing_moments.findIndex((mom) => mom.momentId === moment.momentId);
    if (index < 0) {
        this.editing_moments.push(moment);
    }else {
        this.editing_moments[index] = moment;
    }

    this.selected_moment = moment;
    this.form_dirty = true;
   //this.newMomentChanged(moment);
  }
  preventNumber(event) {
    const x = event.charCode || event.keyCode;
    const y: any = String.fromCharCode(event.which);

    const isNumber = this.validateNumber(y);

    if (isNumber === false && x !== 46 && x !== 44) {
      event.preventDefault();
    } else if (
      (x === 46 || x === 44) &&
      (event.currentTarget.innerText.includes(".") ||
        event.currentTarget.innerText.includes(","))
    ) {
      event.preventDefault();
    }
  }

  validateNumber(strNumber) {
    let regExp = new RegExp("^\\d+$");
    let isValid = regExp.test(strNumber);
    return isValid;
  }

  updateMoment(moment) {



    const project = this.project;
    const AtaSkilledHourlyRate = project.AtaSkilledHourlyRate;
    const AtaWorkerHourlyRate = project.AtaWorkerHourlyRate;
    const ProjectSkilledHourlyRate = project.ProjectSkilledHourlyRate;
    const ProjectWorkerHourlyRate = project.ProjectWorkerHourlyRate;

    const ataHourlyRate =
      moment.type == 1 ? AtaWorkerHourlyRate : AtaSkilledHourlyRate;
    const projectHourlyRate =
      moment.type == 1 ? ProjectWorkerHourlyRate : ProjectSkilledHourlyRate;

    moment["ata_hourly_rate"] = moment["ataId"] != "0" ? ataHourlyRate : 0;
    moment["project_hourly_rate"] =
      moment["ataId"] == "0" ? projectHourlyRate : 0;
    moment["time"] = moment["time"].toString().replace(",", ".");

    this.projectService.updateAtestMoment(moment).then((res) => {
      if (res["status"]) {
        this.toastr.success(
          this.translate.instant("TSC_SUCESSFULLY_UPDATED_MOMENT"),
          this.translate.instant("Success"),

        );
        this.getAvailableKSorDU();
        this.getHoursForAtest();

      } else {
        this.toastr.error(
          this.translate.instant("TSC_ERROR_UPDATING_MOMENT"),
          this.translate.instant("Error")
        );
        this.getAvailableKSorDU();
        this.getHoursForAtest();

      }
    });


  }

  setMaterialIcon(atestComment) {
    if (atestComment != null && atestComment != "") {
      return "chat";
    } else {
      return "chat_bubble";
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.onRemoveModalSub) {
      this.onRemoveModalSub.unsubscribe;
    }
    if (this.onScrollEventSubscription) {
      this.onScrollEventSubscription.unsubscribe();
    }
  }

  updateMomentSeen() {
    this.projectService.updateMomentSeen(this.route.snapshot.params.id);
  }


  getHoursForAtest() {
    this.spinner = true;
    this.projectService
      .getHoursForAtest(this.route.snapshot.params.id)
      .then((data) => {
        this.hoursForAtest = data;

        this.hoursForAtest.forEach((x) => {
          const date = x.date;
          if (!this.momentsCheckedForAttest[date]) {
            this.momentsCheckedForAttest[date] = {};
          }

          x["users"].forEach((y) => {
            let allMomentsChecked = true;

            if (!this.momentsCheckedForAttest[date][y.id]) {
              this.momentsCheckedForAttest[date][y.id] = {};
              y["allStatus"] = false;
              this.momentsCheckedForAttest[date][y.id] = {};
              this.momentsCheckedForAttest[date][y.id]["allStatus"] =
                y["allStatus"];
            } else {
              if (this.momentsCheckedForAttest[date][y.id]) {
                y["allStatus"] =
                  this.momentsCheckedForAttest[date][y.id]["allStatus"];
              }
            }

            y["moments"].forEach((m) => {
              if (m.commentActive === 0) {
                allMomentsChecked = false;
              }

              if (!this.momentsCheckedForAttest[date][y.id][m.momentId]) {
                this.momentsCheckedForAttest[date][y.id][m.momentId] = m.status;
              } else {
                m.status = this.momentsCheckedForAttest[date][y.id][m.momentId];
              }
            });
            y["_allMomentsChecked"] = allMomentsChecked;
            y["imp"] = false;
          });
        });

        this.spinner = false;
        this.hoursForAtestFiltered = JSON.parse(
          JSON.stringify(this.hoursForAtest)
        );
        this.emitHoursForAtestUniqueValues();
        this.filterHoursForAttest();
      });
  }

  emitHoursForAtestUniqueValues() {
    const data: any = {
      uniqueWeeks: new Set(),
      filteringUsers: new Set(),
      filteringMoments: new Set(),
      filteringStates: new Set(),
      filteringAtas: new Set(),
      searchingText: new Set(),
    };

    this.hoursForAtest.forEach((x) => {
      data.uniqueWeeks.add(x.date.split("-")[0]);
      x["users"].forEach((y) => {
        data.filteringUsers.add(y["name"]);
        y["moments"].forEach((m) => {
          data.filteringMoments.add(m["moment"]);
          data.filteringStates.add(m["state"]);
          if (m["AtaNumber"]) {
            data.filteringAtas.add("ÄTA-" + m["AtaNumber"]);
          } else {
            data.filteringAtas.add(null);
          }
        });
      });
    });

    data.filteringAtas = Array.from(data.filteringAtas).sort(
      (a: any, b: any) => {
        const ataNumberA = a ? a.split("-")[1] : 0;
        const ataNumberB = b ? b.split("-")[1] : 0;
        return Number(ataNumberA) - Number(ataNumberB);
      }
    );

    if (this.selectedWeek == "") {
      this.uniqueWeeks.emit(Array.from(data.uniqueWeeks));
    }
    if (this.selectedUser == "") {
      this.filteringUsers.emit(Array.from(data.filteringUsers));
    }
    if (this.selectedMoment == "") {
      this.filteringMoments.emit(Array.from(data.filteringMoments));
    }
    if (this.selectedState == "") {
      this.filteringStates.emit(Array.from(data.filteringStates));
    }
    if (this.selectedAta == "") {
      this.filteringAtas.emit(data.filteringAtas);
    }
  }

    disableLoadData() {
        this.notEdited = false;
    }

    enableUpdate(event) {

        if(!this.allowEdit()) {
            return;
        }

        if(!this.disabledInput) {
            this.counter++;
            this.usersService.enableUpdate(
              "Atest",
              this.route.snapshot.params.id,
              this.counter
            );

            const obj = {
                projectId: this.route.snapshot.params.id,
                url: this.router.url,
                type: "Atest",
            };

            this.cronService.setAtest(obj);
        }
    }

    getUserPermission() {
        this.usersService
          .getUserPermission("Atest", this.route.snapshot.params.id)
          .subscribe((res) => {
            if (res["status"]) {
              if(this.allowEdit()) {
                this.editAtest = res["data"]["edit"];
                this.disabledInput = !this.editAtest;
                this.fullName = res["data"]["fullName"];
              }else {
                this.editAtest = false;
              }
            }
        });
    }

  timeStringToFloat(time) {
    let hoursMinutes = time.split(/[.:]/);
    let hours = parseInt(hoursMinutes[0], 10);
    let minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    return hours + minutes / 60;
  }

  filterHoursForAttest() {
    this.hoursForAtest = JSON.parse(
      JSON.stringify(this.hoursForAtestFiltered)
    ).filter((timesheet) => {
      const week = timesheet.date.split("-")[0];

      if (this.selectedWeek != "" && week != this.selectedWeek) {
        return false;
      }

      timesheet.users = timesheet.users.filter((user) => {
        if (this.selectedUser != "" && user.name != this.selectedUser) {
          return false;
        }

        user.moments = user.moments.filter((moment) => {
          const ata = this.selectedAta
            ? this.selectedAta.split("-")[1]
            : this.selectedAta;
          const ataNumber = moment.AtaNumber;

          if (this.selectedAta === "Project" && ataNumber === null) {
            return true;
          }
          if (this.selectedAta === "Atas" && ataNumber) {
            return true;
          }
          if (this.selectedAta === "Atas" && ataNumber === null) {
            return false;
          }
          if (ata != "" && moment.AtaNumber != ata) {
            return false;
          }
          return true;
        });

        user.moments = user.moments.filter((moment) => {
          if (this.selectedState != "" && moment.state != this.selectedState) {
            return false;
          }
          return true;
        });

        user.moments = user.moments.filter((moment) => {
          if (
            this.selectedMoment != "" &&
            moment.moment != this.selectedMoment
          ) {
            return false;
          }
          return true;
        });

        user.moments = user.moments.filter((moment) => {
          const searchText = this.searchText.toLowerCase().trim();

          if (searchText !== "") {
            const commentIncludes =
              moment["comment"] &&
              moment["comment"].toString().toLowerCase().includes(searchText);
            const stateIncludes =
              moment["state"] &&
              moment["state"].toString().toLowerCase().includes(searchText);

            if (!commentIncludes && !stateIncludes) {
              return false;
            }
          }

          return true;
        });

        if (user.moments.length < 1) {
          return false;
        }

        return true;
      });

      if (timesheet.users.length < 1) {
        return false;
      }

      return true;
    });
  }

  removeMoment(itemIndex, userIndex, momentIndex, user) {
    if(this.editAtest){
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
      .subscribe((response) => {

        if (response.result) {
          const mom =
            this.hoursForAtest[itemIndex].users[userIndex].moments[momentIndex];

          const moment = {
            AtaID: mom.ataId,
            AtaNumber: mom.AtaNumber,
            AtestStatus: mom.status,
            id: mom.momentId,
            state: mom.state,
            comment: mom.comment,
            time: mom.time,
            work: mom.moment,
            images: mom.images,
            UserTimesheetsID: mom.UserTimesheetsID,
            user_id : user.id,
            date: mom.Date
          };

          this.hoursForAtest[itemIndex].users[userIndex].moments.splice(
            momentIndex,
            1
          );

          if (
            this.hoursForAtest[itemIndex].users[userIndex].moments.length < 1
          ) {
            this.hoursForAtest[itemIndex].users.splice(userIndex, 1);

            if (this.hoursForAtest[itemIndex].users.length < 1) {
              this.hoursForAtest.splice(itemIndex, 1);
            }
          }

          this.hoursForAtestFiltered.forEach((timesheet) => {
            timesheet.users.forEach((user) => {
              user.moments.forEach((m, i) => {
                if (m.momentId === moment.id) {
                  user.moments.splice(i, 1);
                }
              });
            });
          });

          this.timeRegistrationService.removeMoment(moment).subscribe((response) => {
            if (response["status"]) {
              this.toastr.success(
                this.translate.instant("You have successfully deleted moment!"),
                this.translate.instant("Success")
              );
            }
          });
        }
      });
    }
  }

  openNotifyUserModal(moment) {
    if(this.editAtest){
      this.selectedMoment = moment;
      this.notificationText = "";
      document.getElementById("modfade").style.display = "block";
    }

  }
  closeNotifyUserModal() {
    this.notificationText = "";
    this.selectedMoment = null;
    document.getElementById("modfade").style.display = "none";
  }
  submitNotification() {
    const notification = {
      user_id: this.selectedMoment["user_id"],
      momentId: this.selectedMoment["momentId"],
      projectId: this.projectId,
      type: "Tidrapport",
      message: `Timesheets Comment: ${this.selectedMoment.Date}`,
      messageText: this.notificationText,
      webLink: `/timesheets/time-registration-users-registration?date=${this.selectedMoment.Date}`,
      $mobileLink: `/timesheets/working-hour?date=${this.selectedMoment.Date}`,
      date: this.selectedMoment.Date,
    };

    this.timeRegistrationService.createNotification(notification);

    const recentMsg = this.selectedMoment.user_messages[0];

    const newId = recentMsg ? recentMsg.ID + 1 : 1;
    const content_id = recentMsg ? recentMsg.content_id : 69420;
    const type_id = recentMsg ? recentMsg.type_id : 69420;

    recentMsg ? "" : (this.selectedMoment.icon = "not_read");

    this.selectedMoment.user_messages.unshift({
      ID: newId,
      active: 1,
      content_id: content_id,
      content_type: "Timesheet",
      created_at: new Date(),
      fullname: `${this.userDetails.firstname} ${this.userDetails.lastname}`,
      message: this.notificationText,
      type_id: type_id,
      user_id: this.userDetails.user_id,
    });

    this.closeNotifyUserModal();
  }

  public toggleEditComment(moment) {
    this.commentText = moment["comment"];
    this.editingComment = !this.editingComment;

    moment.show = !moment.show;

    if (moment.show) {
      this.notEdited = false;
    } else {
      this.notEdited = true;
    }
  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
  }

    modifyTime(momTime) {
        if (typeof momTime === "string") {
          const time = momTime.split(":");
          const minutes = time[1];
          let decimal = 0.0;

          if (minutes == "15") {
            decimal = 0.25;
          }

          if (minutes == "30") {
            decimal = 0.5;
          }

          if (minutes == "45") {
            decimal = 0.75;
          }

          return Number(time[0]) + decimal;
        } else {
          return momTime;
        }
    }

  openImpModal(user, index, userIndex, bgColor) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "100%";
    dialogConfig.height = "797";
    dialogConfig.data = { user: user, ProjectID: this.projectId};
    dialogConfig.maxHeight = "650px";
    dialogConfig.panelClass =['custom-scroll','gray-background'];
    const dialogRef = this.dialog.open(ImpComponent, dialogConfig);
    this.onRemoveModalSub =
      dialogRef.componentInstance.dispatchRemoveMoment.subscribe((res) => {

        const HFT = this.hoursForAtest[index];
        const USER = HFT["users"][userIndex];
        const HFTF = this.hoursForAtestFiltered[index];
        const USER_F = HFTF["users"][userIndex];
        USER["moments"] = USER["moments"].filter((moment) => {
          const check = moment.momentId != res.id;
          if (check === false) {
            const modTime = this.modifyTime(moment.time);
            const modTimeTotal = this.modifyTime(USER["total"]);
            USER["total"] = modTimeTotal - modTime;
          }
          return moment.momentId != res.id;
        });
        USER_F["moments"] = USER_F["moments"].filter((moment) => {
          return moment.momentId != res.id;
        });
      });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getAvailableKSorDU();
        this.getHoursForAtest();
      }
    });
  }

  addAbsences(absences: IAttestedAbsence[]) {
    const newAbsences = this.attestedAbsences.slice(0);
    absences.forEach((UserAbsenceID: IAttestedAbsence) => {
      newAbsences.push(UserAbsenceID);
    });
    this.attestedAbsences = newAbsences;
  }

  removeAbsences(absences: IAttestedAbsence[]) {
    this.attestedAbsences = this.attestedAbsences.filter(
      (userAbsence: IAttestedAbsence) => {
        return !this.findAbsence(absences, userAbsence.UserAbsenceID);
      }
    );
  }

  findAbsence(absences: IAttestedAbsence[], value: string | number) {
    let found = false;
    for (let i = 0; i < absences.length; i++) {
      if (absences[i].UserAbsenceID == value) {
        found = true;
        break;
      }
    }
    return found;
  }

  toggleAttachmentImage() {
    this.showAttachmentImage = !this.showAttachmentImage;
  }

  closeAttachment() {
    this.showAttachmentImage = !this.showAttachmentImage;
    this.urlSelected = "";
  }

  rotateRight() {
    this.rotateValue = this.rotateValue + 90;
    const d = document.getElementsByClassName(
      "iv-large-image"
    )[0] as unknown as HTMLElement;
    d.style.transform = "rotate(" + this.rotateValue + "deg)";
    const x = document.getElementsByClassName(
      "iv-snap-image"
    )[0] as unknown as HTMLElement;
    x.style.transform = "rotate(" + this.rotateValue + "deg)";
    const c = document.getElementsByClassName(
      "iv-snap-handle"
    )[0] as unknown as HTMLElement;
    c.style.transform = "rotate(" + this.rotateValue + "deg)";
  }

  rotateLeft() {
    this.rotateValue = this.rotateValue - 90;
    const d = document.getElementsByClassName(
      "iv-large-image"
    )[0] as unknown as HTMLElement;
    d.style.transform = "rotate(" + this.rotateValue + "deg)";
    const x = document.getElementsByClassName(
      "iv-snap-image"
    )[0] as unknown as HTMLElement;
    x.style.transform = "rotate(" + this.rotateValue + "deg)";
    const c = document.getElementsByClassName(
      "iv-snap-handle"
    )[0] as unknown as HTMLElement;
    c.style.transform = "rotate(" + this.rotateValue + "deg)";
  }

  openViewerJs(e) {
    e.stopPropagation();
    this.viewerJsImage.nativeElement.click();
  }

  isPDFViewer: boolean = false;
  openSwiper(images) {
    this.isPDFViewer = false;
    this.swiper = {
      active: 0,
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

  printDate(date) {
    return moment(date).format("YYYY-MM-DD, h:mm:ss");
  }

  handleAllStatus(type) {}


  checkedLength($event){

    const target = $event.target;
    const maxLn = target.innerText.length
    if(maxLn >= this.maxCharacters)
    {
      target.innerText = target.innerText.slice(0, 255);
      $event.target.blur();
     }
  }


  checkedLengthComment($event){

    const target = $event.target;
    const maxLn = target.innerText.length
    if(maxLn >= 500)
    {
      target.innerText = target.innerText.slice(0, 500);
      $event.target.blur();

     }
  }

  allowEdit() {
    let status = this.userDetails.create_project_timeattest;

    if (this.projectUserDetails) {
        const allow_attest2 = Number(this.projectUserDetails.Atest);
        if(allow_attest2 == 1) {
            status = 1;
        }else {
          status = 0;
        }
    }

    if (status !== undefined && status != 0) {
        return true;
    } else {
        return false;
    }
  }
}
