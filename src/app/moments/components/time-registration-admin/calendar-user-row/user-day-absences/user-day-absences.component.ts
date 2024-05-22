import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-user-day-absences",
  templateUrl: "./user-day-absences.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["./user-day-absences.component.css"],
})
export class UserDayAbsencesComponent implements OnInit {
  _calendarStyle: any;
  get calendarStyle(): any {
    return this._calendarStyle;
  }
  @Input("days") days;
  @Input("calendarStyle") set calendarStyle(value: any) {
    if (value !== this.calendarStyle) {
      this._calendarStyle = value;
      if (this.index !== undefined && this.absences && this.absences.length) {
        this.createAbsences();
      }
    }
  }
  @Input("day") day;

  public user;
  @Input("user") set setUser(value) {

    if (value !== this.user) {
      this.user = value;
    }
  }
  

  public index;  
  @Input("index") set setIndex(value) {

    if (this.index !== value) {
      this.index = value;
      if (this.user !== undefined) {
        this.absences = this.user.absences[this.day.date];
        if (this.absences.length) {
          this.initializeDay();
        }
      }
    }

  }
  @Input("absences") set setAbsences(value) {
    if (this.absences !== value) {
      this.absences = value;
      if (this.index && this.absences && this.absences.length) {
        this.createAbsences();
      }
    }
  }

  @Output() updateAbsenceInfo = new EventEmitter<any>();
  public absences = [];
  public absencesApproved;
  public absencesAttested;
  public showCircle;
  public displacement;
  public moments = {
    ProjectName: "",
  };
  public showLine;
  public absenceColor = "";
  public attested_text = "";
  public showAbsenceHourSum = false;
  public absenceText = "";
  public weekLocked = false;

  constructor(
    private ref: ChangeDetectorRef,
    private translate: TranslateService
  ) {}

  public computedStyles = {
    createAbsences: {
      borderColor: "",
      borderWidth: "",
    },
    circleStyle: {},
    namesDefined: "",
    lockIconSizeCondition: {},
    lockItemStyle: {},
    weekendLine: {},
  };
  public absenceHourSum = "0h";
  public showCircleCondition = false;
  public isAbsenceAttested = false;

  ngOnInit() {
    if (!this.user.absences[this.day.date + "-info"]) { return; }

    this.absencesApproved =
      this.user.absences[this.day.date + "-info"].approved;
    this.absencesAttested =
      this.user.absences[this.day.date + "-info"].attested;
    this.showCircle = this.user.absences[this.day.date + "-info"].show_circle;
    this.displacement = Number(
      this.user.absences[this.day.date + "-info"].displacement
    );
    this.setAttestedText();
    this.moments = this.user.moments[this.day.date]
      ? this.user.moments[this.day.date]
      : "";
    this.showLine = this.user.absences[this.day.date + "-info"].show_line;
    this.absenceColor =
      this.user.absences[this.day.date + "-info"].absence_color;
    this.weekLocked = this.user.absences[this.day.date + "-info"].week_locked;
    this.setAbsenceHourSum();

    if (this.absences && this.absences.length) {
      this.createAbsences();
    }
  }

  setAbsenceHourSum() {
    if (this.user.absences[this.day.date + "-info"].absence_hour_sum != 0) {
      this.absenceHourSum =
        this.user.absences[this.day.date + "-info"].absence_hour_sum + "h";
      return;
    }

    if (
      this.user.moments[this.day.date] &&
      this.user.moments[this.day.date].time_qty_hours
    ) {
      this.absenceHourSum = this.user.moments[this.day.date].time_qty_hours;
    }
  }

  setCircleStyle(columnWidth, columnWidth2x, rowHeight) {
    if (!this.attested_text) {
      this.computedStyles.circleStyle = {
        height: this.calendarStyle.circleHeight + "px",
        width: this.calendarStyle.circleWidth + "px",
        transform: `translateX(${-this.displacement * columnWidth}px)`,
        borderRadius: "50%",
      };
      return;
    }

    const width =
      this.displacement >= 1 || this.displacement <= -1
        ? columnWidth2x * 2 - 10
        : this.calendarStyle.circleWidth;

    this.computedStyles.circleStyle = {
      height: rowHeight - 10 + "px",
      width: width + "px",
      transform: `translateX(${-this.displacement * columnWidth}px)`,
      borderRadius: "12px",
    };
  }

  createAbsences() {
    this.absenceColor = this.getAbsenceColor();
    const calStyle = this.calendarStyle;
    const columnWidth = calStyle.calendarColumnWidthHalf;
    const columnWidth2x = calStyle.calendarColumnWidth;
    const borderColor = this.absenceColor;
    const rowHeightHalf = calStyle.rowHeightHalf;
    const rowHeight = calStyle.rowHeight;
    this.computedStyles.createAbsences = {
      borderWidth: `${rowHeightHalf}px ${columnWidth}px ${rowHeightHalf}px ${columnWidth}px`,
      borderColor: borderColor,
    };
    this.setCircleStyle(columnWidth, columnWidth2x, rowHeight);
    if (this.showLine) {
      this.computedStyles.weekendLine = {
        position: "absolute",
        height: "3px",
        backgroundColor: this.absences
          ? this.absences[0]["Color"]
          : "transparent",
        width: `${4 * columnWidth}px`,
        transform: `translateX(-${3 * columnWidth}px)`,
        zIndex: 100,
        opacity: 0.8,
      };
    }
    this.namesDefined();
    this.lockIconSizeCondition();
    this.lockItemStyle();
    this.absenceText = this.absences ? this.absences[0].absence_text : "";
    this.setAbsenceHourSum();
    this.ref.detectChanges();
  }

  firstAbsenceColor() {
    return this.absences[0].Color;
  }

  secondAbsenceColor() {
    const secondAbsence = this.absences[1];
    const absenceColor = secondAbsence
      ? secondAbsence.Color
      : this.firstAbsenceColor();
    return absenceColor;
  }

  thirdAbsenceColor() {
    const fourthAbsence = this.absences[3];
    const absenceColor = fourthAbsence
      ? fourthAbsence.Color
      : this.firstAbsenceColor();
    return absenceColor;
  }

  fourthAbsenceColor() {
    const thirdAbsence = this.absences[2];
    const secondAbsence = thirdAbsence ? thirdAbsence.Color : this.absences[1];
    const absenceColor =
      typeof secondAbsence !== "string"
        ? secondAbsence
          ? secondAbsence.Color
          : this.firstAbsenceColor()
        : secondAbsence;
    return absenceColor;
  }

  namesDefined() {
    if (!this.moments) {
      return false;
    }
    this.computedStyles.namesDefined = this.moments.ProjectName;
  }

  lockIconSizeCondition() {
    const zoom = this.calendarStyle.rowHeight === 60;
    this.computedStyles.lockIconSizeCondition =
      this.absences &&
      this.absences.length > 0 &&
      this.computedStyles.namesDefined
        ? zoom
          ? "medium"
          : "small"
        : zoom
        ? "large"
        : "medium";
  }

  lockItemStyle() {
    const zoom = this.calendarStyle.rowHeight === 60;
    this.computedStyles.lockItemStyle = {
      paddingTop:
        this.computedStyles.lockIconSizeCondition === "small"
          ? zoom
            ? "0.80rem"
            : "0.40rem"
          : zoom
          ? "1rem"
          : "0.50rem",
    };
  }

  getAbsenceColor() {
    return this.absences
      ? `${this.secondAbsenceColor()} ${this.thirdAbsenceColor()}  
		${this.fourthAbsenceColor()} ${this.firstAbsenceColor()}`
      : "transparent";
  }

  setAttestedText() {
    let att_text = this.user.absences[this.day.date + "-info"].attested_text;
    if (att_text === undefined) {
      att_text = '';
    }
    att_text = att_text !== "" ? this.translate.instant(att_text) : att_text;
    this.attested_text = this.displacement >= 1 || this.displacement <= -1 ? att_text : att_text.slice(0, 9);
    this.setAttestedTextVisibility();
  }

  setAttestedTextVisibility() {
    if (this.attested_text === '') {
      this.showAbsenceHourSum = true;
    } else {
      this.showAbsenceHourSum = false;
    }
  }

  calculateAbsenceSum() {
    if (this.absences.length > 1) {
      let sum = 0;

      for (let i = 0; i < this.absences.length; i++) {
        const absenceHours_decimal = Number(
          this.absences[i].absenceHours_decimal
        );
        sum = sum + absenceHours_decimal;
      }
      return sum;
    }

    return Number(this.absences[0].absenceHours_decimal);
  }

  initializeDay() {
    this.displacement = 0;
    this.showCircle = true;
    this.decideIfShouldCalculateCircleDisplacment();
    this.shouldShowLine();
    this.user.absences[this.day.date + "-info"].absence_color =
      this.getAbsenceColor();
    this.absenceColor =
      this.user.absences[this.day.date + "-info"].absence_color;
    this.setAttestedText();
    const newAbsenceInfo = {
      ...this.user.absences[this.day.date + "-info"],
      approved: this.absencesApproved,
      attested: this.absencesAttested,
      show_circle: this.showCircle,
      displacement: this.displacement,
      show_line: this.showLine,
      absence_color: this.absenceColor,
      week_locked: this.weekLocked,
      absence_hour_sum: this.calculateAbsenceSum(),
      attested_text: this.absencesApproved ? "" : this.attested_text,
    };
    this.updateAbsenceInfo.emit({
      newAbsenceInfo: newAbsenceInfo,
      key: this.day.date + "-info",
    });
    this.createAbsences();
    this.ref.detectChanges();
  }

  calculateCircleLeftDisplacement() {
    this.weekLocked = false;
    const todayAbsence = this.absences ? this.absences[0] : [];
    if (
      !Array.isArray(todayAbsence) &&
      todayAbsence.raportedDayHaveMomentsAndLocked
    ) {
      this.weekLocked = true;
    }
    let today = this.index;
    let flag = true;

    while (flag) {
      const tomorrow = this.days[today + 1];

      if (!tomorrow) {
        flag = false;
        break;
      }

      const dayName = tomorrow.dayName;

      if (dayName === "Sat") {
        flag = false;
        break;
      }

      const date = tomorrow.date;
      const tomAbsence = this.user.absences[date];

      // sabrati momente unutar grupisanih absenca

      if (!tomAbsence || (tomAbsence && tomAbsence.length > 1)) {
        flag = false;
        break;
      }

      if (tomAbsence.length === 0) {
        flag = false;
        break;
      }

      if (
        tomAbsence.length === 1 &&
        tomAbsence[0].AbsenceTypeId != todayAbsence.AbsenceTypeId
      ) {
        flag = false;
        break;
      }

      if (
        tomAbsence.length === 1 &&
        tomAbsence[0].status != todayAbsence.status
      ) {
        flag = false;
        break;
      }

      if (
        tomAbsence.length === 1 &&
        tomAbsence[0].AbsenceTypeId == todayAbsence.AbsenceTypeId &&
        tomAbsence[0].status == todayAbsence.status
      ) {
        if (tomAbsence[0].raportedDayHaveMomentsAndLocked) {
          this.weekLocked = true;
        }

        this.displacement = this.displacement + 1;
        today = today + 1;
        continue;
      }
    }

    this.displacement = -this.displacement;
    this.showCircle = true;
  }

  decideIfShouldCalculateCircleDisplacment() {
    const yesterday = this.days[this.index - 1];
    const yesterdayDef = yesterday && this.user.absences[yesterday.date];
    const yesterdayCondition =
      !yesterdayDef ||
      (yesterdayDef && yesterdayDef.length === 0) ||
      yesterday.dayName === "Sun" ||
      yesterdayDef.length > 1;
    const yesterdayAbsenceCondition =
      this.absences &&
      this.absences.length === 1 &&
      yesterdayDef &&
      yesterdayDef.length === 1 &&
      (yesterdayDef[0].AbsenceTypeId != this.absences[0].AbsenceTypeId ||
        (yesterdayDef[0].AbsenceTypeId == this.absences[0].AbsenceTypeId &&
          yesterdayDef[0].status != this.absences[0].status));
    const absenceMatch =
      this.absences &&
      this.absences.length === 1 &&
      (yesterdayCondition ||
        yesterdayAbsenceCondition ||
        this.absenceTypeMatch(yesterdayDef));
        
    if (absenceMatch) {
      this.calculateCircleLeftDisplacement();
      return true;
    }
    if (
      this.absences &&
      this.absences.length === 1 &&
      yesterdayDef &&
      yesterdayDef.length === 1
    ) {
      this.showCircle = false;
      return true;
    }
    this.showCircleBasedOnMoments();
  }

  showCircleBasedOnMoments() {
    if (this.absences && this.absences.length === 0) {
      this.showCircle = true;
    }
  }

  absenceTypeMatch(yesterdayAbsence) {
    return (
      yesterdayAbsence.length === 1 &&
      this.absences.length === 1 &&
      (yesterdayAbsence[0].AbsenceTypeId != this.absences[0].AbsenceTypeId ||
        yesterdayAbsence[0].status != this.absences[0].status)
    );
  }

  shouldShowLine() {
    this.showLine = false;

    if (this.absences && this.absences.length === 0) {
      return;
    }

    if (this.day.dayName !== "Mon") {
      return;
    }

    const friday = this.days[this.index - 3];

    if (!friday) {
      return;
    }

    const mondayAbsences = this.user.absences[friday.date];

    if (!mondayAbsences) {
      return;
    }

    if (mondayAbsences.length === 0) {
      return;
    }

    this.showLine = true;
  }
}
