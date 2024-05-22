import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import * as moment from "moment";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { trigger, transition, style, animate } from "@angular/animations";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { ChatStore } from "./chat-store.service";
import { ThemePalette } from "@angular/material/core";
import { tap } from "rxjs";
import { ChatService } from "./chat.service";
import { NextModalService } from "../../next-modal.service";

@Component({
  selector: "app-week-modal",
  templateUrl: "./week-modal.component.html",
  styleUrls: ["./week-modal.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("leaveFade", [
      transition(":leave", [animate(300, style({ opacity: 0 }))]),
    ]),
    trigger("leaveFadeLong", [
      transition(":leave", [animate(300, style({ opacity: 0 }))]),
    ]),
    trigger("enterFadeIn", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate(200, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class WeekModalComponent implements OnInit {
  @ViewChild("chatScroll") chatScroll;
  @ViewChild("modalContainer") modalContainer;
  @ViewChild("arrow") arrow;
  public user:any = {
    firstName: "",
    lastName: "",
    id: -1,
    absences: [],
    moments: [],
  };
  public userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  @Input("user") set setUser(value) {
    if (value !== this.user) {
      this.user = value;
      this.resetModal(); 
      this.initalizeModal("init");
    }
  };
  @Input("data") set setData(value) {
    if (value !== this.data) {
      this.data = value;
      if (this.user) {
        this.resetModal(); 
        this.initalizeModal("init");
      }
    }
  }
  @Input("week") week;
  _calendarStyle: any;
  get calendarStyle(): any {
    return this._calendarStyle;
  }
  @Input("calendarStyle") set calendarStyle(value: any) {
    if (value !== this.calendarStyle) {
      this._calendarStyle = value;
    }
  }
  @Input("modalPosition") set setModalPosition(value) {
    if (value !== this.modalPosition) {
      this.modalPosition = value;
    }
  }

  _desideNextBtn;
  get desideNextBtn() {
    return this._desideNextBtn;
  }

  @Input('desideNextBtn') set setDesideNextBtn(value) {
    if (value !== this.desideNextBtn) {
      this._desideNextBtn = value;
      this.modalHaveNextBtn(this.desideNextBtn);
    }
  }

  @Output() closeModal = new EventEmitter<Number>();
  @Output() updateAbsences = new EventEmitter<any>();
  @Output() updateDayStatus = new EventEmitter<any>();

  public data: any = {};
  public modalPosition = "top";
  public weekDays = [];
  public dayAbsences = {};
  public weekAbsencesKeys = [];
  public momentTotal = 0;
  public computedStyles = {
    modalGeometry: {},
    createAbsences: {},
    arrowGeometry: {},
  };
  public userAbsences = {};
  public userMoments = {};
  public currentDayAbsences;
  public currentDayMoment;
  public clickedDay;
  public weekApproved = 1;
  public raportedDayHasMomentsAndLocked = null;
  public modalComment = "";
  public summary = [];
  public summaryTotal: any = "00:00";
  public mileages = {};
  public mileageKeys = [];
  public mileageTypeKeys = [];
  public spinner = false;
  public attestedBy = "";
  public attestedByDate = "";
  public chatSub;
  public chat = {
    sending: false,
    date: "",
    data: {
      offset: 0,
      messages: {},
      opened_count: {},
    },
  };
  public color: ThemePalette = "warn";
  public mode: any = "query";
  public chatWeekKeys = [];
  public firstAbsenceColor_ = "var(--brand-color)";
  public lockIconStatus = false;
  public placeholder = "";
  public switchButtonCount = {
    0: 0,
    1: 0
  };
  public switchButtonText = '';
  public language;
  public innerMaxHeight;
  public modalInfo;
  

  constructor(
    private timeRegistrationService: TimeRegistrationService,
    private toastr: ToastrService,
    private chatStore: ChatStore,
    public translate: TranslateService,
    private ref: ChangeDetectorRef,
    private chatService: ChatService,
    private nextModalService: NextModalService
  ) {}

  ngOnInit() {
    this.language = this.userDetails.language;
    this.generatePlaceholder();
    this.modalComment = this.placeholder;
    this.initalizeModal("init");
    this.subToChat();
  }

  ngOnDestroy() {
    this.chatStore.removeUser(this.user.id);
    this.unsubFromChat();
  }

  ngAfterViewInit() {
    
    this.resetModalPosition();
  }

  getContainerRect() {
    return this.modalContainer.nativeElement.getBoundingClientRect();
  }

  resetModalPosition() {
    const containerRect = this.getContainerRect();
    const top = containerRect.top;

    if (top < 150) {

      this.modalPosition = this.modalPosition === 'top' ? 'bottom' : 'top';
      this.setModalGeometry();
      this.setArrowGeometry();  
      this.detectChanges();
      this.arrow.nativeElement.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }
    
  }

  public firstFetch = false;
  chatScrollToBottomStore() {
    if (this.chat.data.offset == 500 && this.firstFetch === false) {
      this.chatScrollToBottom(1500);
      this.firstFetch = true;
    }
  }

  chatScrollToBottom(timeout) {
    setTimeout(() => {
      if (!this.ref["destroyed"]) {
        const element = this.chatScroll.nativeElement;
        element.scrollTo({ top: element.scrollHeight });
      }
    }, timeout);
  }

  subToChat() {
    this.chatSub = this.chatStore.state$.subscribe((res) => {
      if (res[this.user.id]) {
        this.chat = res[this.user.id] ? res[this.user.id] : this.chat;
        this.extractDataFromChat(); 
        this.ref.detectChanges();
        this.chatScrollToBottomStore();
      }
    });
  }

  unsubFromChat() {
    if (this.chatSub) {
      this.chatSub.unsubscribe();
    }
  }

  public filteredMessages = {};

  filterChatMsges() {
    const keys = Object.keys(this.chat.data.messages);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      this.filteredMessages[key] = this.chat.data.messages[key].filter(
        (msg) => {
          return (
            (
              msg.content_type.toLowerCase() === "absence") ||
            (
              msg.content_type.toLowerCase() === "tidrapport")
          );
        }
      );

      if (this.filteredMessages[key].length === 0) {
        delete this.filteredMessages[key];
      }

      if (!this.currentDayAbsences || this.weekApproved == 1) {
         this.markWeekAsSeen(key);
      }
    }
  }

  markWeekAsSeen(key) {

    if (this.week != key) return;
    if (!this.filteredMessages[key]) return;
    const weekIdObj = {};

    this.filteredMessages[key].forEach((msg)=>{
      const weekId = msg.week_id;
      if (!weekIdObj[weekId]) {
        weekIdObj[weekId] = true;
        const obj = {
          week_id: weekId,
          opened: 1,
        };
        this.timeRegistrationService.updateOpenedStatus(obj).then(()=>{
          this.chatService.filterMessagesByWeekId(weekId);
        });
      }
    });
  }
 
  extractDataFromChat() {
    const isoWeek = this.clickedDay.isoWeek;
    this.filterChatMsges();
    const keys = Object.keys(this.filteredMessages);
    const filtered_keys = Object.keys(this.filteredMessages).filter((key) => {
      return key != this.clickedDay.isoWeek;
    });
    if (keys.length > 0) {
      filtered_keys.push(isoWeek);
    }
    this.chatWeekKeys = filtered_keys;
  }

  resetModalData() {
    this.weekAbsencesKeys = [];
    this.userAbsences = {};
    this.currentDayAbsences = {};
    this.userMoments = {};
    this.currentDayMoment = {};
    this.dayAbsences = {};
    this.mileageKeys = [];
    this.mileageTypeKeys = [];
    this.mileages = {};
  }

  initalizeModal(location) {

    this.resetModalData();
    this.week = Number(this.week);
    this.clickedDay = this.data.clickedDay;
    this.user.absences ? this.fillAbsences() : "";
    this.user.moments ? this.fillMoments() : "";
    this.setModalGeometry();
    this.setArrowGeometry(); 
    if (location === "init") {
      this.generateModalWeek();
    }
    this.createAbsences();
    this.getUserSummary();
    this.getAttestedBy();
    this.getAttestedByDate();
    this.setLockIconStatus();
  }

  public gettingSummary = false;
  getUserSummary() {
    const date = this.clickedDay.date;
    if (!this.userMoments[date]) {
      return false;
    }
    if (this.gettingSummary) {
      return;
    }
    const user_id = this.user.id;
    this.summary = []; 
    this.summaryTotal = "00:00";
    this.gettingSummary = true;
    this.timeRegistrationService
      .getUserSummary(user_id, date)
      .subscribe((response) => {
        if (response["status"]) {
          let sum_mary = 0; 
          this.mileages = {};
          this.mileageKeys = [];
          this.summary = response["moments"].map((mom) => {
            sum_mary = sum_mary + Number(mom.time_qty);
            this.setMileages(mom);
            return mom;
          });
          this.gettingSummary = false;
          this.summaryTotal = this.minTommss(sum_mary);
          this.detectChanges();
          this.resetModalPosition();
        }
      });
  }
  
  public mileageTypeUnits = {};

  setMileages(mom) {

    if (mom.mileageType === null) {
      return false;
    }

    if (!this.mileageTypeKeys.includes(mom.mileageTypeName)) {
      this.mileageTypeKeys.push(mom.mileageTypeName);
    }

    this.mileageTypeUnits[mom.mileageTypeName] = mom.mileageUnitName;

    if (!this.mileages[mom.projectName]) {
      this.mileages[mom.projectName] = {};
    }

    if (!this.mileages[mom.projectName][mom.mileageTypeName]) {
      this.mileages[mom.projectName][mom.mileageTypeName] = 0;
    }

    if (this.mileages[mom.projectName][mom.mileageTypeName] != 0) {
      return;
    }

    this.mileages[mom.projectName][mom.mileageTypeName] =
      Number(this.mileages[mom.projectName][mom.mileageTypeName]) +
      Number(mom.mileage);
    this.mileageKeys = Object.keys(this.mileages);
  }

  minTommss(minutes) {
    const sign = minutes < 0 ? "-" : "";
    const min = Math.floor(Math.abs(minutes));
    const sec = Math.floor((Math.abs(minutes) * 60) % 60);
    return (
      sign + (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec
    );
  }

  fillAbsences() {

    const date = this.clickedDay["date"];
    this.userAbsences = this.user.absences;
    this.currentDayAbsences = this.user.absences[date];
  }

  fillMoments() {
    const date = this.clickedDay["date"];
    this.userMoments = this.user.moments;
    this.currentDayMoment = this.user.moments[date];
  }

  findMondayFromClickedDay() {
    const date = this.clickedDay.date;
    const m_date = moment(date);
    while (m_date.day() > 1) {
      m_date.subtract(1, "day");
    }
    return m_date;
  }

  generateModalWeek() {

    this.weekDays = [];
    this.momentTotal = 0;
    const day = this.findMondayFromClickedDay();
    const firstDay = day.format("YYYY-MM-DD");
    this.calculateMomentsAndAbsence(firstDay);
    this.weekDays.push({ date: firstDay, d: day.format("DD") });
    let flag = true;

    while (flag) {
      const currentDay = moment(day);
      day.add(1, "day");
      if (currentDay.isoWeek() !== day.isoWeek()) {
        flag = false;
        break;
      }
      const day_ = day.format("YYYY-MM-DD");
      this.calculateMomentsAndAbsence(day_);
      this.weekDays.push({ date: day_, d: day.format("DD") });
    }
  }


  calculateMomentsAndAbsence(day) {
    this.extractAbsenceByType(day);
    this.calculateMomentsTotal(day);
  }

  calculateMomentsTotal(day_) {
    const moment = this.user.moments[day_];
    if (moment) {
      const time_qty = Number(moment["time_qty"]);
      this.momentTotal = this.momentTotal + time_qty;
      if (this.raportedDayHasMomentsAndLocked === null) {
        this.raportedDayHasMomentsAndLocked =
          moment.raportedDayHaveMomentsAndLocked;
      }
    }
  }

  extractAbsenceByType(day_) {
    const absences = this.user.absences[day_];
    if (absences) {
      for (let i = 0; i < absences.length; i++) {
        const absence = absences[i];
        if (absence.status == 0) {
          this.weekApproved = absence.status;
        }

        if (absence.status != 2) {
          absence.Approved = 1;
        }

        if (this.raportedDayHasMomentsAndLocked === null) {
          this.raportedDayHasMomentsAndLocked =
            absence.raportedDayHaveMomentsAndLocked;
        }

        if (!this.dayAbsences[absence.AbsenceTypeId]) {
          this.dayAbsences[absence.AbsenceTypeId] = {};
        }

        if (!this.dayAbsences[absence.AbsenceTypeId][day_]) {
          this.dayAbsences[absence.AbsenceTypeId][day_] = [absence];

          if (!this.dayAbsences[absence.AbsenceTypeId]["total"]) {
            this.dayAbsences[absence.AbsenceTypeId]["total"] = 0;
          }

          this.dayAbsences[absence.AbsenceTypeId]["total"] =
            this.dayAbsences[absence.AbsenceTypeId]["total"] +
            Number(absence.absenceHours_decimal);
          this.dayAbsences[absence.AbsenceTypeId]["color"] = absence.Color;
          this.dayAbsences[absence.AbsenceTypeId]["shortName"] =
            absence.ShortName;
          continue;
        }

        this.dayAbsences[absence.AbsenceTypeId][day_].push(absence);
        this.dayAbsences[absence.AbsenceTypeId].total =
          this.dayAbsences[absence.AbsenceTypeId].total +
          Number(absence.absenceHours_decimal);
      }
    }

    this.weekAbsencesKeys = Object.keys(this.dayAbsences).sort();
  }

  setModalLeftPosition(): string {
    return  `${this.data.position * this.calendarStyle.calendarColumnWidth * 7}px`
  }

  setModalPositionAtt(): string {
    const halfRow = (this.calendarStyle.rowHeight / 2);
    const modalPos = (this.modalPosition === 'bottom' ? -this.calendarStyle.rowHeight : 0);
    return `${this.calendarStyle.rowHeight + halfRow  + modalPos}px`
  }

  setModalWidth(): string {
    return  `${this.calendarStyle.calendarColumnWidth * 7}px`;
  }

  setModalGeometry(): void {
    if (!this.calendarStyle) return;
    this.computedStyles.modalGeometry = {
      width: this.setModalWidth(),
      [this.modalPosition]: this.setModalPositionAtt(),
      left: this.setModalLeftPosition(),
      overflow: "auto",
      cursor: "default",
    };
  }

  setArrowTransform(halfRow): string {
    const rotate = this.modalPosition === "top" ? "rotate(180deg)" : "rotate(0deg)";
    const scale = halfRow === 35 ? 'scale(2)' : 'scale(1)';
    return `${rotate} ${scale}`;
  }

  setArrowLeft(): string {
    const dayNumber = this.clickedDay.day == 0 ? 7 : this.clickedDay.day;
    const boxCenter = -34 + this.calendarStyle.calendarColumnWidth * dayNumber;
    return `${this.data.position * this.calendarStyle.calendarColumnWidth * 7 + boxCenter}px`
  }

  setArrowModalPosition(halfRow) {
    return `${halfRow + (this.modalPosition === 'bottom' ? -this.calendarStyle.rowHeight : 0)}px`;
  }

  setArrowGeometry(): void {
    if (!this.calendarStyle) return;
    const halfRow = this.calendarStyle.rowHeight / 2 + 5;
    this.computedStyles.arrowGeometry = {
      [this.modalPosition]: this.setArrowModalPosition(halfRow),
      left: this.setArrowLeft(),
      transform: this.setArrowTransform(halfRow)
    };
  }

  createAbsences(): void { 

    if (this.weekAbsencesKeys.length > 0 && this.user.absences[this.clickedDay.date]) {
      const borderColor = `${this.secondAbsenceColor()} ${this.thirdAbsenceColor()}
      ${this.fourthAbsenceColor()} ${this.firstAbsenceColor()}`;
      this.computedStyles.createAbsences = {
        borderWidth: `23.815px 23.815px 23.815px 23.815px`,
        borderColor: borderColor,
      };
    }
  }

  firstAbsenceColor(): string {
    const absenceKey = this.weekAbsencesKeys[0];
    this.firstAbsenceColor_ = this.dayAbsences[absenceKey].color;
    return this.firstAbsenceColor_;
  }

  secondAbsenceColor() {
    const absenceKey = this.weekAbsencesKeys[1];
    const secondAbsence = this.dayAbsences[absenceKey];
    const absenceColor = secondAbsence
      ? secondAbsence.color
      : this.firstAbsenceColor();
    return absenceColor;
  }

  thirdAbsenceColor() {
    const absenceKey = this.weekAbsencesKeys[3];
    const fourthAbsence = this.dayAbsences[absenceKey];
    const absenceColor = fourthAbsence
      ? fourthAbsence.color
      : this.firstAbsenceColor();
    return absenceColor;
  }

  fourthAbsenceColor() {
    const absenceKey = this.weekAbsencesKeys[2];
    const secondAbsenceKey = this.weekAbsencesKeys[1];
    const thirdAbsence = this.dayAbsences[absenceKey];
    const secondAbsence = thirdAbsence
      ? thirdAbsence.color
      : this.dayAbsences[secondAbsenceKey];
    const absenceColor =
      typeof secondAbsence !== "string"
        ? secondAbsence
          ? secondAbsence.color
          : this.firstAbsenceColor()
        : secondAbsence;
    return absenceColor;
  }

  closeModalFunc() {
    this.closeModal.emit(this.week);
  }

  getAttestedBy() {
    if (this.currentDayMoment) {
      this.attestedBy = this.currentDayMoment.attested_by_full_name;
    }

    if (this.currentDayAbsences && this.currentDayAbsences.length > 0) {
      this.attestedBy = this.currentDayAbsences[0].attested_by_full_name;
    }
  }

  getAttestedByDate() {
    if (this.currentDayMoment) {
      this.attestedByDate = this.currentDayMoment.attested_date;
    }

    if (this.currentDayAbsences && this.currentDayAbsences.length > 0) {
      this.attestedByDate = this.currentDayAbsences[0].attested_date;
    }
  }

  toggleAbsence(key, day, event) {

    if (!this.dayAbsences[key][day]) return; 
    this.dayAbsences[key][day] = this.dayAbsences[key][day].map((abs: any) => {

      const dayLocked = Number(abs.raportedDayHaveMomentsAndLocked);

      if (!this.allowAbsenceToggle(dayLocked, abs.status) || this.allowAbsenceToggleBasedOnStatus(abs.status)) {
        return abs;
      };

      return this.mapToggledAbsence(abs, dayLocked);

    });


    this.setSwitchButton();
  }

  mapToggledAbsence(abs, dayLocked) {
    const Approved = abs.Approved == 0 ? 1 : 0;
    Approved ? this.switchButtonCount[dayLocked]++ : this.switchButtonCount[dayLocked]--;

    return { ...abs, Approved: Approved };
  }

  allowAbsenceToggleBasedOnStatus(status) {
    if (this.weekApproved == 0 && status == 2) {
      return true;
    }
  }

  allowAbsenceToggle(dayLocked, status) { 

    if (this.weekApproved == 0 && dayLocked === 1 && status == 3) return false;
    if (this.weekApproved == 0) return true;
    if (this.switchButtonText === '') return true;
    if (this.switchButtonText === 'Lock' && dayLocked === 0) return true;
    if (this.switchButtonText === 'Unlock' && dayLocked === 1) return true;
  }

  setSwitchButton() {
    if (this.switchButtonCount[0] > 0) this.switchButtonText = 'Lock';
    if (this.switchButtonCount[1] > 0) this.switchButtonText = 'Unlock';
    if (!this.switchButtonCount[0] && !this.switchButtonCount[1]) this.switchButtonText = '';
  }

  calldeleteApprovedAbsence(date, key) {
    const object = {
      date: date,
      user_id: Number(this.user.id),
      key: key,
      function: "deleteApprovedAbsence",
      modalText: this.translate.instant("Delete"),
    };
    this.modalInfo = object;
  }

  getNotificationObject(server, day = this.clickedDay) {

    const date = day.date;
    const week = day.isoWeek; 
    const year = day.year;

    return {
      message: this.user.absences[date]
        ? "Absence Week:" + week + ", " + year
        : "Tidrapport " + date,  
      user_id: Number(this.user.id), 
      type: this.user.absences[date] ? "absence" : "tidrapport",
      webLink: this.user.absences[date]
        ? "/timesheets/time-registration-users-absence?week=" + week
        : "/timesheets/time-registration-users-registration?date=" + date,
      $mobileLink: this.user.absences[date]
        ? "/timesheets?week=" + week
        : "/timesheets/working-hour?date=" + date,
      date: date,
      messageText: this.getModalComment(),
      week: `${this.user.id}-${year}-${week}`,
      data: server,
    };
  }

  handleAbsenceStatus(status) {
    if (this.spinner === true) return;

    const { server, client } = this.getSelectedAbsences(status);
    const object = this.getNotificationObject(server);

    if (server.dates === "") return;
    this.callHandleAbsenceStatus(object, client, status).subscribe();
  }

  callHandleAbsenceStatus(object, client, status) {

    this.spinner = true;
    this.detectChanges();

    
    return this.timeRegistrationService
      .handleAbsenceStatus(object) 
      .pipe(tap(() => {

        this.processStatusResult(client[status], status);
        this.spinner = false;
        this.resetSwitchButtonCount();
        this.detectChanges();
    
      }));
  }

  processStatusResult(absences, status) {

    this.updateAbsences.emit({ absences: absences, status: status });
    this.checkWeekApprovedStatus();
    this.modalComment = this.placeholder; 
    if (this.getModalComment()) {
       this.addMessageToChat();
     }
    this.markWeekAsSeen(this.week);
    this.handleSelectedAbsences(absences, status);
  }

  checkWeekApprovedStatus() {
    let weekApproved = 1;
    for (let i = 0; i < this.weekAbsencesKeys.length; i++) {
      const key = this.weekAbsencesKeys[i];

      for (let j = 0; j < this.weekDays.length; j++) {
        const date = this.weekDays[j].date;  
        const dayAbsences = this.dayAbsences[key][date];

        if (dayAbsences) {
          for (let k = 0; k < dayAbsences.length; k++) {
            const absence = dayAbsences[k];
            if (absence.status == 0) {
              weekApproved = 0;
            }
          }
        }
      }
    }
    this.weekApproved = weekApproved;
    this.detectChanges();
  }

  getModalComment() {
    return this.modalComment !== this.placeholder ? this.modalComment : "";
  }

  getSelectedAbsences(status) {

    const week = this.clickedDay.isoWeek;
    const year = this.clickedDay.year;
    const client = { [status]: [] };
    const server = {
      [status]: "",
      dates: "",
      week: `${this.user.id}-${year}-${week}`,
      comment: this.getModalComment(),
      action: 'Rejected'
    };
    for (let key of this.weekAbsencesKeys) {
      const absence = this.dayAbsences[key];  
      const absDates = Object.keys(absence);

      for (let date_ of absDates) {
        const date_abs = absence[date_];

        if (Array.isArray(date_abs)) {
          for (let abs_ of date_abs) {
            if (abs_.Approved == 1 && abs_.status == 0) {
              abs_.status = status;
              client[status].push({
                uta_id: abs_.uta_id,
                date: date_,
                comment: this.getModalComment(),
                status: status,
              });
              server[status] = server[status] + `${abs_.uta_id}, `;
              server.dates = server.dates + `${date_}, `;
            }
          }
        }
      }
    }
    server[status] = server[status].slice(0, server[status].length - 2);
    return { client, server };
  }

  handleSelectedAbsences(absences, status) {

    for (let key of this.weekAbsencesKeys) {

      const absDates = Object.keys(this.dayAbsences[key]);

      for (let date_ of absDates) {
        let minusTotal = 0;

        if (Array.isArray(this.dayAbsences[key][date_])) {

          if (status === 3) {

            const { filteredAbsences, minusTotal_ } =
              this.filterRejectedAbsences(this.dayAbsences[key][date_], absences, minusTotal);
            minusTotal = minusTotal_;

            this.dayAbsences[key][date_] = filteredAbsences;
            
          } else if (status === 2) {
            const acceptedAbsences = this.mapAcceptedAbsences(
              this.dayAbsences[key][date_],
              status,
              date_
            );
            this.dayAbsences[key][date_] = acceptedAbsences;
           
          }
        }

        this.dayAbsences[key].total = this.dayAbsences[key].total - minusTotal;
        this.updateUserAbsences();

        if (this.dayAbsences[key][date_] && this.dayAbsences[key][date_].length === 0) {
          delete this.dayAbsences[key][date_];
        }

        if (this.dayAbsences[key].total === 0) {
          this.weekAbsencesKeys = this.weekAbsencesKeys.filter((abs_type) => {
            return abs_type != key;
          });
        }
      }
    }

    
  }

  updateUserAbsences() {

    const absenceDates = {};

    for (let key of this.weekAbsencesKeys) {
      const absDates = Object.keys(this.dayAbsences[key]);
      for (let date_ of absDates) {
        if (Array.isArray(this.dayAbsences[key][date_])) {
          if (!absenceDates[date_]) {
            absenceDates[date_] = this.dayAbsences[key][date_];
          } else {
            absenceDates[date_] = [ ...absenceDates[date_], ...this.dayAbsences[key][date_] ];
          }
        }
      }
    }

    const dateKeys = Object.keys(absenceDates);
    for (let date of dateKeys) {
      this.user.absences = { ...this.user.absences, [date]: absenceDates[date] }
    }
  }

  filterRejectedAbsences(absences, absences_, minusTotal_) {

    const filteredAbsences = absences.filter((abs_) => {

      const condition = !absences_.some(e => e.uta_id ===  abs_.uta_id);
      if (!condition) {
        minusTotal_ = Number(minusTotal_) + Number(abs_.absenceHours_decimal);
      }
      return condition;
    });

    return { filteredAbsences, minusTotal_ };
  }

  mapAcceptedAbsences(absences, status, date_) {
    return absences.map((abs_) => {
      if (abs_.Approved == 1 && abs_.status == 2) {
        this.changeDayLockStatus(true, date_);

        return { 
          ...abs_,
          status: status,
          Approved: 0,
          showMenu: false,
          raportedDayHaveMomentsAndLocked: true,
        };
      }
      return abs_;
    });
  }

  getMomentKey(moment, key) {
    let value = moment[key];
    if (value && key === "ProjectName") {
      value = value.slice(0, 5);
    }
    if (value && key === "time_qty") { 
      value = value == 0 ? "" : `${value}h`;
    }
    return value;
  }

  checkCommentValidity() {
    return (
      !this.modalComment ||
      this.modalComment === this.placeholder ||
      this.modalComment.trim() === ""
    );
  }

  sendNotification() {
    if (this.spinner === true) return;
    const { server } = this.getSelectedAbsences(0);

    if (this.checkCommentValidity()) {
      this.toastr.error(
        this.translate.instant("Message field required."),
        this.translate.instant("Error")
      );
      return false;
    }

    const object = this.getNotificationObject(server);

    this.spinner = true;
    this.ref.detectChanges();
    this.timeRegistrationService 
      .createNotification(object)
      .then((response: any) => {
        if (response && response["status"]) {
          if (response["status"] == true) {
            this.addMessageToChat();
            this.firstFetch = false;
            this.chatScrollToBottom(1500);
            this.toastr.success(
              this.translate.instant("Notofication sent."),
              this.translate.instant("Success")
            );
           this.markWeekAsSeen(this.week);
          } 
        }
        this.spinner = false;
        this.chatScrollToBottom(0);
        this.detectChanges();
      });
  }

  addMessageToChat() {
    const week = this.clickedDay.isoWeek;
    const date = this.clickedDay.date;
 
    this.chatStore.addMessage({
      userId: this.user.id,
      week: week,
      message: this.modalComment,
      content_type: this.user.absences[date] ? "Absence" : "Tidrapport"
    });
    this.modalComment = this.placeholder;
    this.detectChanges();
  }

  callUnlockUserDay(date, status) {
    const object = {
      date: date,
      user_id: Number(this.user.id),
      status: status,
      function: "unlockUserDay",
      modalText: this.translate.instant("Unlock"),
    };
    this.modalInfo = object;
  }

  unlockUserDay(object) {
    this.spinner = true;
    this.timeRegistrationService
      .allowUserToRaportTime(object)
      .subscribe((response) => {
        if (response && response["status"]) {
          this.changeDayLockStatus(object.status, object.date);
          this.resetDayAbsenceCheckbox();
        }
        this.spinner = false;
        this.reject();
        this.detectChanges();
        this.markWeekAsSeen(this.week);
        if (!this.checkCommentValidity()) {
          this.sendNotification();
        }
      });
  }
 

  callLockUserDay(date, status) {
    const object = {
      Dates: [date],
      Users: [Number(this.user.id)],
      status: status,
      function: "lockUserDay",
      modalText: this.translate.instant("Lock"),
    };
    this.modalInfo = object;
  }

  lockUserDay(object) {
    this.spinner = true;
    this.timeRegistrationService
      .disapproveRaportingTimeForDay(object)
      .subscribe((response) => {
        if (response && response["status"]) {
          this.changeDayLockStatus(object.status, object.Dates[0]);
          this.resetDayAbsenceCheckbox();
        }
        
        this.spinner = false;
        this.reject();
        this.markWeekAsSeen(this.week);
        this.detectChanges();
        if (!this.checkCommentValidity()) {
          this.sendNotification();
        }
      });
  }

  changeDayLockStatus(status: boolean, date = this.clickedDay.date) {
    if (this.user.absences[date]) {
      const absences = this.user.absences[date].map((abs_) => {
        return {
          ...abs_,
          raportedDayHaveMomentsAndLocked: status
        };
      });

      this.user = {
        ...this.user,
        absences: {
          ...this.user.absences,
          [date]: absences,
          [date + "-info"]: {
            ...this.user.absences[date + "-info"],
            week_locked: status,
            approved: true,
            attested: true
          },
        },
      };
      
      this.detectChanges();
    }

    if (this.user.moments[date]) {
      const moment = {
        ...this.user.moments[date],
        raportedDayHaveMomentsAndLocked: status,
      };

      this.user = {
        ...this.user,
        moments: {
          ...this.user.moments,
          [date]: moment,
        },
      };
      this.detectChanges();
    }
 
    this.updateDayStatus.emit({ status: status, date: date });
    this.setLockIconStatus();
    this.setModalWeekDayStatus(status, date);
    this.detectChanges();
  }

  resetDayAbsenceCheckbox() {
    const dayAbsenceKeys = Object.keys(this.dayAbsences);
    for (let key of dayAbsenceKeys) {
      const dayKeys = Object.keys(this.dayAbsences[key]);
      for (let dayKey of dayKeys) {
        if (dayKey === 'color' || dayKey === 'shortName' || dayKey === 'total') {
          continue;
        }
        this.dayAbsences[key][dayKey] = this.dayAbsences[key][dayKey].map((abs_:any)=>{
          return { ...abs_, Approved: 0 }
        });
      }
    }
    this.resetSwitchButtonCount();
    this.detectChanges();
  }

  resetSwitchButtonCount() {
    this.switchButtonCount = {
      0: 0,
      1: 0
    };
    this.switchButtonText = '';
  }

  resetModal() {
    this.unsubFromChat();
    this.initalizeModal("setter");
    this.subToChat();
    this.chatScrollToBottom(1500);
  }

  getMoreWeeks(event) {
    const element = event.target;
    const scrollTop = element.scrollTop; 
    if (
      scrollTop < 20 &&
      !this.chat.sending &&
      this.chat.data.offset !== null
    ) {
      this.chatStore.initializeChat(
        this.chat.date,
        this.user.id,
        500,
        this.chat.data.offset
      );
    }
  }

  setLockIconStatus() {
    const date = this.clickedDay.date;
    const absences = this.user.absences[date];
    if (absences && absences[0]) {
      this.lockIconStatus = absences[0].raportedDayHaveMomentsAndLocked
        ? false
        : true;
      return;
    }
    const moments = this.user.moments[date];

    if (moments) {
      this.lockIconStatus = moments.raportedDayHaveMomentsAndLocked
        ? false
        : true;
      return;
    }

    this.lockIconStatus = true;
  }

  clearPlaceholder() {
    if (this.modalComment === this.placeholder) {
      this.modalComment = "";
    }
  }

  setPlaceholder() {
    if (this.modalComment.trim() === "") {
      this.modalComment = this.placeholder;
    }
  }

  generatePlaceholder() {
    this.placeholder = this.translate.instant("Comment") + " ...";
  }

  detectChanges() {
    if (!this.ref["destroyed"]) {
      this.ref.detectChanges();
    }
  }

  confirm(object) {
    this[object.function](object);
  }

  reject() {
    this.modalInfo = undefined;
  }

  setModalWeekDayStatus(status, date) {
    for (let i = 0; i < this.weekAbsencesKeys.length; i++) {
      const key = this.weekAbsencesKeys[i];
      for (let j = 0; j < this.weekDays.length; j++) {
        if (this.dayAbsences[key][date]) {
          this.dayAbsences[key][date] = this.dayAbsences[key][date].map(
            (abs_) => {
              return { ...abs_, raportedDayHaveMomentsAndLocked: status };
            }
          );
        }
      }
    }
    this.detectChanges();
  }

  getSelectedApprovedAbsences() {

    const client = [];

    for (let key of this.weekAbsencesKeys) {
      const absence = this.dayAbsences[key];  
      const absDates = Object.keys(absence);
      for (let date_ of absDates) {
        const date_abs = absence[date_];

        if (Array.isArray(date_abs)) {
          for (let abs_ of date_abs) {
            if (abs_.Approved == 1 && abs_.status == 2) {
              client.push({
                uta_id: abs_.uta_id,
                date: date_,
                comment: this.getModalComment(),
                status: 2,
                locked: abs_.raportedDayHaveMomentsAndLocked,
                key: key
              });
            }
          }
        }
      }
    }
    return client;
  }

  callHandleApprovedAbsences(type) {
    const object = {
      user_id: Number(this.user.id),
      type: type,
      function: "handleApprovedAbsences",
      modalText: this.translate.instant('Are you sure'),
    };
    this.modalInfo = object;
  }

  handleApprovedAbsences(object) {
    const type = object.type;
    const absences = this.getSelectedApprovedAbsences();
    if (type === 'switch') {
      this.switchApprovedAbsences(absences);
      return;
    }
    this.deleteApprovedAbsences(absences);
  }

  switchApprovedAbsences(absences) {
    absences.forEach((abs)=>{
      const name = this.switchButtonText.toLocaleLowerCase();
      this.functionSwitch(name, { date: abs.date, status: abs.locked }, abs.key);
    });
  }
 
  deleteApprovedAbsences(absences) {
    absences.forEach((abs)=>{
      this.functionSwitch('delete', { date: abs.date }, abs.key);
    });
  }

  deleteApprovedAbsence(object: { key: string; date: string }) {
    const key = object.key;
    const date_ = object.date;
    const abs_ = this.dayAbsences[key][date_][0];
    const uta_id = abs_.uta_id;
    const status = 3;

    const momDate = moment(date_, "YYYY-MM-DD");
    const day = {
      date: date_,
      year: momDate.year(),
      isoWeek: momDate.isoWeek(),
    };

    const client = {
      [status]: [
        {
          uta_id: uta_id,
          date: date_,
          comment: this.getModalComment(),
          status: 3,
        },
      ],
    };
    const server = {
      [status]: uta_id,
      dates: date_,
      week: `${this.user.id}-${day.year}-${day.isoWeek}`,
      comment: this.getModalComment(),
      action: 'Deleted'
    };
    const notisObject = this.getNotificationObject(server, day);

    this.reject();
    this.detectChanges();
     
    this.callHandleAbsenceStatus(notisObject, client, 3).subscribe(() => {

      if (this.user.moments[date_]) {
        this.unlockUserDay({
          date: date_,
          user_id: Number(this.user.id),
          status: false,
        });
      }
      this.dayAbsences = {};
      this.generateModalWeek();
      this.createAbsences();
      this.resetSwitchButtonCount();
      this.detectChanges();
    });
  }

  functionSwitch(name, day, key) {

    const userId = Number(this.user.id);
    const date = day.date;

    const object = {
      date: day.date,
      user_id: userId,
      Users: [ userId ], 
      Dates: [ date ],
      status: !day.status,
      key: key,
    };

    if (name === "unlock") {
      this.unlockUserDay(object);
      return;
    }

    if (name === "lock") {
      this.lockUserDay(object);
      return;
    }

    if (name === "delete") {
      this.deleteApprovedAbsence(object);
      return;
    }
  }

  howManyWithStatusTrue() {
    let withStatusTrue = 0;
    for (let howMany in this.desideNextBtn.weeks) {
      if (this.desideNextBtn.weeks[howMany].status) withStatusTrue++;
    }
    return withStatusTrue;
  }

  handleNextAbsenc() {
    this.closeModalFunc();
    let weekIndex = this.nextModalService.nextModalIndex.getValue() + this.howManyWithStatusTrue();
    // if (weekIndex > this.user.notSeenWeeks.length - 1) this.desideNextBtn.hasNextBtn = false;
    this.nextModalService.nextModalIndex.next(weekIndex);
    this.nextModalService.clickedOnNextButton$.next(this.user.id);
  }

  modalHaveNextBtn(nextBtn) {
    let biggestNumber = 0;
    for (let oneWeek in nextBtn.weeks) {
      if (nextBtn.weeks[oneWeek].status && nextBtn.weeks[oneWeek].position >= biggestNumber) {
        biggestNumber = nextBtn.weeks[oneWeek].position;
      }
    }
    if (nextBtn.position === biggestNumber) {
      nextBtn.hasNextBtn = true;
    }

    if (this.user.notSeenWeeks.length === 1) nextBtn.hasNextBtn = false;
    let weekIndex = this.nextModalService.nextModalIndex.getValue() + this.howManyWithStatusTrue();
    if (weekIndex > this.user.notSeenWeeks.length - 1) this.desideNextBtn.hasNextBtn = false;
  }

  removeSwiperImage(event) {}
  
}