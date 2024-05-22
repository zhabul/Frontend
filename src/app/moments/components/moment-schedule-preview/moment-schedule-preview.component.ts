import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import * as moment from "moment";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { UsersService } from "src/app/core/services/users.service";
import { ApproveAbsenceModalComponent } from "src/app/timesheets/components/time-registration-admin/approve-absence-modal/approve-absence-modal.component";
import { UserMomentsDetailComponent } from "src/app/moments/component/user-moments-detail/user-moments-detail.component";
import { LockedDaysComponent } from "src/app/moments/components/locked-days/locked-days.component";
import { SendNotificationToUserForTimesheetComponent } from "src/app/moments/components/send-notification-to-user-for-timesheet/send-notification-to-user-for-timesheet.component";

declare var $: any;

@Component({
  selector: "app-moment-schedule-preview",
  templateUrl: "./moment-schedule-preview.component.html",
  styleUrls: ["./moment-schedule-preview.component.css"],
})
export class MomentSchedulePreviewComponent implements OnInit, AfterViewInit {
  mouseUpUserIndex: any;
  userObjectIndex: any;
  userObject: any;
  newWidthPosition: any;
  clientHeight = 0;
  @ViewChild("scrollwindow") scrollwindow;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private userService: UsersService,
    private timeRegService: TimeRegistrationService
  ) {}

  public currentDate: any;
  public fullMonths: any;
  public months: any;
  public weekDays: any;
  public daysInMonth: any;
  public daysInMonthArray: any;
  public currentMonthIndex: any;
  public currentMonth: any;
  public fullMonth: any;
  public currentYear: any;
  public currentDay: any;
  public day: any;
  public currentDayNumber: any;
  public calendar: any[] = [];
  public Date: any;
  public users = [];
  public heightRow: number = 45;
  public paddingTdField: number = 0;
  public drawSize = false;
  public hoverDate: any;
  public hoverIndex: string = null;
  public hoverMomentId: any;
  public hoveredRow: any[] = [];
  public startedDay: any;
  public activeDate: any;
  public calendarFieldWidth: any;
  public tableWrapper: any;
  public tableFixWrapper: any;
  public lastMonths: any[] = [];
  public lastyears: any[] = [];
  public yearsValueWidth: number = 0;
  public monthsValueWidth: number = 0;
  public activeMonthPosition: number = 0;
  public ensureMarkFields = false;
  public EndDate: any;
  public projecttIdDoomElement: any;
  public momentIdDoomElement: any;
  public markedWidth: number = 19;
  public sortedFirst: any;
  public sortedLast: any;
  public widthTimeline: number = 200;
  public activeTimelineIndex: any;
  public activeTimeline: any;
  public activeUserIndex: any;
  public activeUser: any;
  public resize: any;
  public oldX: number = 0;
  public grabber: boolean = false;
  public daysNumber: number;
  public showModalInformation: boolean = false;
  public showSaveIcon: boolean = false;
  public WeekNUmber: any;
  public newWeekNUmberBorder: number = 0;
  public newWeekNUmberBorderIndex: number = 0;
  public clickedMomentIndex: number;
  public btnChildrenBollean: boolean = true;
  public moments: any[] = [];
  public startedMovePosition: boolean = false;
  public startedDateAfterMove: any;
  public startedClassDateAfterMove: string;
  public startedPositionAfterMove: any;
  public zoomPage: number = 100;
  public fontSize: number = 24;
  public allowMoveEl: boolean = false;
  public canvasHeight: number = 20;
  public canvasWidth: number = 20;
  public canvasX: number = 0;
  public canvasY: number = 0;
  public allowChangeCavasSize: boolean = false;
  public startCanvasWidth: number = 0;
  public startCanvasHeight: number = 0;
  public showCanvas: boolean = false;
  public allowConnectEl: boolean = false;
  public canvasBorderRight: boolean = false;
  public canvasBorderLeft: boolean = false;
  public canvasBorderTop: boolean = false;
  public canvasBorderBottom: boolean = false;
  public startedCanvasMoment: any;
  public startedCanvasMomentPosition: string;
  public lines: any[] = [];
  public showLines: boolean = true;
  public canOpenChildren = true;
  public projects;
  public mouseUpProject: any;
  public mouseUpProjectIndex: number;
  public mouseHoverProject: any;
  public mouseHoverProjectIndex: any;
  public setUserId = "";
  public projectDays;
  public disableHideInfo = true;
  public showMoreInfo = false;
  public projectModal: boolean = false;
  public sumOfUsers = "0";
  public showFooterAnalitic: boolean = false;
  public showUsers: boolean = false;
  public projectModalMomentID: any;
  public numberOfCoworkers: any[] = [];
  public numberOfCoworkersArray: any;
  public numberOfCoworkersSortArray: any[] = [];
  public sumOfCoworekrPerDay: any[] = [];
  public timlineBodyWrapperWidth: number = 10340;
  public coworkerArray: any[] = [];
  public allowScroll: boolean = true;
  public allowRender: boolean = true;
  public allowChangeSizeOfMomentLine: boolean = false;
  public projectId: number = 0;
  public positionTopOfHeaderCalendar: number = 0;
  public positionHeaderBackground = "transparent";
  public positionBottomAnalics: number = 36;
  public positionBottomWrapperAnalics: number = 130;
  public positionBottomAnalicsColor = "transparent";
  private language = "sw";
  public spinner = false;
  public monthName: any;
  public offsetNumber: number = 0;
  public start_date: any;
  public last_date: any;
  public userId: any = null;
  public selectedUser: any;
  public searchText: string;
  public userShouldReceiveNotification = true;
  public loggedUser: any;
  public userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  public absence_types: any[] = [];

  ngOnInit() {
    this.users = this.route.snapshot.data["users"]["users"] || [];

    this.loggedUser = JSON.parse(sessionStorage.getItem("userDetails"));

    let today = new Date();
    let year = today.getFullYear();
    this.currentDate = moment(today, "YYYY-MM-DD");
    this.weekDays = this.currentDate["_locale"]["_weekdaysShort"];
    let date = this.currentDate.format("YYYY-MM-DD");
    this.fullMonths = this.currentDate["_locale"]["_months"];
    let monthNumber = <any>moment(date).month(date).format("M") - 1;
    this.monthName = this.fullMonths[monthNumber];

    this.start_date = date.split("-")[0] + "-" + date.split("-")[1] + "-01";
    this.last_date =
      date.split("-")[0] +
      "-" +
      date.split("-")[1] +
      "-" +
      moment(date).daysInMonth();
    this.language = sessionStorage.getItem("lang") || "sw";
    this.translate.use(this.language);
    $("#dateSelectStartDate")
      .datepicker({
        format: "mm-yyyy",
        viewMode: "months",
        minViewMode: "months",
        autoclose: true,
        language: this.language,
        todayHighlight: true,
        currentWeekSplitChar: "-",
        weekStart: 1,
      })
      .on("changeDate", (ev) => {
        const monthYear = ev.target.value;

        const year = monthYear.split("-")[1];
        const month = monthYear.split("-")[0];
        this.start_date = year + "-" + month + "-01";

        this.currentDate = moment(this.start_date, "YYYY-MM-DD");
        this.calendar = [];
        this.getDaysInMonts(year, this.start_date, this.fullMonths);
        this.last_date =
          year + "-" + month + "-" + moment(this.start_date).daysInMonth();
        this.spinner = true;
        this.getUsersWithMoments(this.start_date, this.last_date);
      });

    const storage = localStorage.getItem("users-detail-calendar") || [];
    let calendarParse = null;

    if (storage.length > 0) {
      calendarParse = JSON.parse(storage.toString());
      this.calendar = calendarParse;
    }

    if (
      !calendarParse ||
      (calendarParse.length > 0 &&
        calendarParse[0]["months"][0]["name"] != this.monthName)
    ) {
      this.getDaysInMonts(year, date, this.fullMonths);
    }

    this.returnChoosenMonthWithData();
    this.getAbsenceTypes();
  }

  debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
        args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  ngAfterViewInit() {
    this.caliculateOffsetWidth();
  }

  getDaysInMonts(year, date, fullMonths) {
    this.calendar = [];
    const monthNumber = <any>moment(date).month(date).format("M") - 1;
    const numberOfMonth = <any>moment(date).month(date).format("M");

    const monthName = fullMonths[monthNumber];
    const momentDate = moment(date, "YYYY-MM-DD");
    const days = momentDate.daysInMonth();

    const daysInMonthArray = Array.from(Array(days + 1).keys());
    daysInMonthArray.splice(0, 1);

    const daysObject = this.getDays(daysInMonthArray, year, numberOfMonth);
    const months = [];

    const obj = {
      year: year,
      name: monthName,
      daysNumber: days,
      daysInMonthArray: daysInMonthArray,
      days: daysObject,
      monthIndex: monthNumber,
    };

    months.push(obj);
    let object = { year, months };
    this.calendar.push(object);
    localStorage.setItem(
      "users-detail-calendar",
      JSON.stringify(this.calendar)
    );
  }

  private returnChoosenMonthWithData() {
    this.route.queryParamMap.subscribe((params) => {
      let date = params.get("date") || null;

      if (date) {
        this.start_date = date;
        const year = this.start_date.split("-")[0];
        const month = this.start_date.split("-")[1];
        this.currentDate = moment(this.start_date, "YYYY-MM-DD");
        this.calendar = [];
        this.getDaysInMonts(year, this.start_date, this.fullMonths);
        this.last_date =
          year + "-" + month + "-" + moment(this.start_date).daysInMonth();
        this.getUsersWithMoments(this.start_date, this.last_date);
      }
    });
  }

  private getDays(daysInMonthArray, year, numberOfMonth) {
    const objArray = [];
    daysInMonthArray.forEach((day) => {
      const arrayOfSingleDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      let dayOfDate;
      let monthOfDate;

      if (arrayOfSingleDigits.includes(day)) dayOfDate = "0" + day;
      else dayOfDate = day;

      if (arrayOfSingleDigits.includes(+numberOfMonth))
        monthOfDate = "0" + numberOfMonth;
      else monthOfDate = numberOfMonth;

      const datum = year + "-" + monthOfDate + "-" + dayOfDate;
      const momentDatum = moment(datum, "YYYY-MM-DD");

      const week = momentDatum.week();
      const isoWeek = momentDatum.isoWeek();
      const dayIndex = momentDatum.day();
      const dayName = this.weekDays[dayIndex];

      let obj = {
        date: datum,
        dateDay: day,
        week: week,
        isoWeek: isoWeek,
        dayIndex: dayIndex,
        dayName: dayName,
      };
      objArray.push(obj);
    });

    return objArray;
  }

  caliculateOffsetWidth() {
    this.calendarFieldWidth = $(".calendar-content-row-day").outerWidth();
    this.tableFixWrapper = $(".planner-content-wrapper").outerWidth();
    this.tableWrapper = $(".calendar-content-row").outerWidth();
  }

  setYearClass(index, object) {
    const calendarTableClassName = "table-calendar-" + object.year;
    return calendarTableClassName;
  }

  setMonthClass(index, month) {
    const calendarTableClassName = "table-calendar-month-" + month.name;
    return calendarTableClassName;
  }

  setDayClass(index, day) {
    let activeClass = "";

    if (day.date == this.Date) activeClass = "active";

    const calendarTableClassName = "table-calendar-day-" + day.date;
    return calendarTableClassName + " " + activeClass;
  }

  setUser(event, user, userIndex) {
    this.activeUser = user;
    this.activeUserIndex = userIndex;
  }

  setBorder(week, index) {
    if (this.newWeekNUmberBorder == week) {
      return false;
    } else {
      let style = {
        "border-left": "1px solid #cccccc",
        "margin-left": "-1px",
      };

      this.newWeekNUmberBorder = week;
      return style;
    }
  }

  allowZoomIn() {
    if (this.zoomPage >= 180) {
      this.zoomPage = 180;
      return false;
    }

    return true;
  }

  allowZoomOut() {
    if (this.zoomPage <= 40) {
      this.zoomPage = 40;
      return false;
    }
    return true;
  }

  zoomIn() {
    this.zoomPage = this.zoomPage + 10;
    this.activeTimeline = false;

    if (this.fontSize > 24) this.fontSize = this.fontSize - 2;
  }

  zoomOut() {
    this.zoomPage = this.zoomPage - 10;
    this.activeTimeline = false;

    if (this.zoomPage <= 90) this.fontSize = this.fontSize + 2;
  }

  calculateStyles() {
    const style = {
      zoom: this.zoomPage + "%",
    };
    return style;
  }

  printWeek(week, index) {
    if (this.WeekNUmber && this.WeekNUmber == week) {
      return " ";
    }

    this.WeekNUmber = week;
    return week;
  }

  goBack() {
    this.router.navigate(["/timesheets/schedule-review"]);
  }

  setWrapperWidth() {
    this.initializeStartWidth();
    let style;

    if (this.showFooterAnalitic) {
      style = {
        "padding-bottom": "150px",
      };
      return style;
    }

    style = {
      "padding-bottom": "40px",
    };
    return style;
  }

  initializeStartWidth() {
    const arrayOfYears = $(".calendar-content-row-year");
    const offsetWidth = [];

    for (let i = arrayOfYears.length - 1; i >= 0; i--) {
      offsetWidth.push(arrayOfYears[i].offsetWidth);
    }

    this.timlineBodyWrapperWidth = offsetWidth.reduce((sum, x) => sum + x);
  }

  setHeaderPosition() {
    const style = {
      top: this.positionTopOfHeaderCalendar + "px",
    };
    return style;
  }

  setValue(user, day) {
    if (user.moments[day.date]) {
      return user.moments[day.date];
    }
    return "";
  }

  setAbsenceValue(user, day) {
    if (user.absences[day.date]) {
      if (user.absences[day.date].length == 1)
        return user.absences[day.date][0]["absenceHours"];
      const timeDecimal = user.absences[day.date]
        .filter((x) => x.isRejected != 1)
        .reduce((a, b) => a + this.timeStringToFloat(b["absenceHours"]), 0);

      return this.timeFloatToString(timeDecimal);
    }
    return "";
  }

  private timeStringToFloat(time) {
    const hoursMinutes = time.split(/[.:]/);
    const hours = parseInt(hoursMinutes[0], 10);
    const minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    return hours + minutes / 60;
  }

  private timeFloatToString(num) {
    const hours = parseInt(num).toString().padStart(2, "0");
    const minutes = Math.round((num % 1) * 60)
      .toString()
      .padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  setTimeValue(user, day) {
    if (!user.moments[day.date]) {
      return "";
    }

    if (
      user.moments[day.date]["time"] != "00:00" &&
      user.moments[day.date]["Type"] == "Moments"
    ) {
      return user.moments[day.date]["time"];
    }

    if (user.moments[day.date]["Type"] == "Moments") {
      return "Need attest";
    }
  }

  getUsersWithMoments(first_date, last_date) {
    this.users = [];
  }

  goToUserDetails(id) {
    this.router.navigate([
      "timesheets/time-registration-admin/user-detail",
      id,
      this.start_date,
    ]);
  }

  goToUserMomentDetail(user, date) {
    if (
      user.notApprovedAbsences[date] &&
      user.notApprovedAbsences[date].length > 0
    ) {
      return false;
    }

    user.show_callendar_Unlockdays = this.userDetails.show_callendar_Unlockdays;

    if (user.absences[date]) {
      if (user.absences[date][0].Approved == 1) {
        this.createModal(
          UserMomentsDetailComponent,
          { user, date: date },
          (_) => {}
        );
        return;
      }

      if (user.absences[date][0].isRejected == 1) {
        if (
          user.moments[date] &&
          user.moments[date].Type != "userRaportStatus"
        ) {
          this.createModal(
            UserMomentsDetailComponent,
            { user, date: date },
            (_) => {}
          );
          return;
        } else if (
          user.moments[date] &&
          user.moments[date].Type == "userRaportStatus" &&
          user.show_callendar_Unlockdays
        ) {
          if (this.loggedUser.show_callendar_Unlockdays) {
            this.createModal(
              LockedDaysComponent,
              { user, date: date },
              (res) => {
                if (res && res.status) user.moments[date] = null;
              }
            );
          }
          return;
        }

        this.createModal(
          SendNotificationToUserForTimesheetComponent,
          { user, date: date },
          (res) => {
            if (res && res.status) user.moments[date] = null;
          }
        );
      }
    } else {
      if (user.moments[date] && user.moments[date].Type != "userRaportStatus") {
        this.createModal(
          UserMomentsDetailComponent,
          { user, date: date },
          (_) => {}
        );
        return;
      } else if (
        user.moments[date] &&
        user.moments[date].Type == "userRaportStatus"
      ) {
        if (this.loggedUser.show_callendar_Unlockdays) {
          this.createModal(LockedDaysComponent, { user, date: date }, (res) => {
            if (res && res.status) user.moments[date] = null;
          });
        }
        return;
      }

      this.createModal(
        SendNotificationToUserForTimesheetComponent,
        { user, date: date },
        (res) => {
          if (res && res.status) user.moments[date] = null;
          this.toastr.success(
            this.translate.instant("Action successful."),
            this.translate.instant("Success")
          );
        }
      );
    }
  }

  previous() {
    if (this.offsetNumber > 0) {
      this.offsetNumber = Math.abs(this.offsetNumber - 100);
      this.timeRegService
        .getPaginateUsersWithMoments(
          this.start_date,
          this.last_date,
          this.offsetNumber
        )
        .subscribe((response) => {
          if (response["status"]) this.users = response["users"];
        });
    }
  }

  next() {
    this.offsetNumber += 100;
    this.timeRegService
      .getPaginateUsersWithMoments(
        this.start_date,
        this.last_date,
        this.offsetNumber
      )
      .subscribe((response) => {
        if (response["status"]) this.users = response["users"];
      });
  }

  private createModal(component, data, callback) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.data = data;

    this.dialog
      .open(component, diaolgConfig)
      .afterClosed()
      .subscribe((res) => {
        if (callback) {
          callback(res);
        }
      });
  }

  checkIfNonApprovedAbsenceExists(absences) {
    if (!absences) {
      return false;
    }

    let flag = absences.length > 0;

    return flag;
  }

  openApproveAbsenceModal(date, user) {
    this.userService.getUser(user.id).subscribe((res) => {
      if (res["user"].Notification == 1)
        this.userShouldReceiveNotification = true;
      else this.userShouldReceiveNotification = false;
    });

    const absence = user.notApprovedAbsences[date][0];

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "40%";
    diaolgConfig.data = {
      absence: {
        id: absence.UserAbsenceID,
        Comment: absence.Comment,
        EndDateChngRqst: absence.EndDateChngRqst,
        StartDateChngRqst: absence.StartDateChngRqst,
        AbsenceTypeChngRqst: absence.AbsenceTypeChngRqst,
        CommentChngRqst: absence.CommentChngRqst,
        startDateAbsence: absence.StartDate,
        endDateAbsence: absence.EndDate,
        AbsenceType: absence.AbsenceType,
        user_id: user.id,
        HoursAbsence: absence.HoursAbsence,
        MinutesAbsence: absence.MinutesAbsence,
        attested_by_full_name: absence.attested_by_full_name,
        OriginalHoursAbsence: absence.OriginalHoursAbsence,
        OriginalMinutesAbsence: absence.OriginalMinutesAbsence,
      },
    };
    return this.dialog
      .open(ApproveAbsenceModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res && res["status"] && res["state"] == "approved") {
          if (this.userShouldReceiveNotification) {
            this.sendAbsenceNotificationToUser(
              user.id,
              "Tidrapport",
              "Your absence request was accepted.",
              "timesheets/time-registration-users-absence",
              "/timesheets/absence"
            );
          }
          this.toastr.success(
            this.translate.instant("Successfully approved absence!"),
            this.translate.instant("Success")
          );

          Object.keys(user.absences).forEach((key) => {
            user.absences[key].forEach((a) => {
              if (a.index == absence.index) {
                a.Approved = 1;
                a.isAnswered = 1;

                if (absence.HoursAbsence && absence.MinutesAbsence) {
                  a.absenceHours =
                    absence.HoursAbsence + ":" + absence.MinutesAbsence;
                }

                if (!user.moments.hasOwnProperty(key)) {
                  user.moments[key] = {};
                }

                user.moments[key].raportedDayHaveMomentsAndLocked = true;
              }
            });
          });

          user.notApprovedAbsences[date] = user.notApprovedAbsences[
            date
          ].filter((abs, index) => {
            return abs.index != absence.index;
          });

          if (user.notApprovedAbsences[date].length > 0) {
            this.openApproveAbsenceModal(date, user);
          }
        } else if (res && res["status"] && res["state"] == "removed") {
          if (this.userShouldReceiveNotification) {
            this.sendAbsenceNotificationToUser(
              user.id,
              "Tidrapport",
              "Your absence request was rejected.",
              "timesheets/time-registration-users-absence",
              "/timesheets/absence"
            );
          }
          this.toastr.success(
            this.translate.instant("Successfully rejected absence!"),
            this.translate.instant("Success")
          );

          Object.keys(user.absences).forEach((key) => {
            user.absences[key] = user.absences[key].filter(
              (abs) => abs.index != absence.index
            );
          });

          user.notApprovedAbsences[date] = user.notApprovedAbsences[
            date
          ].filter((abs) => abs.index != absence.index);

          if (user.notApprovedAbsences[date].length > 0) {
            this.openApproveAbsenceModal(date, user);
          }
        } else if (res && res["status"] && res["state"] == "rejectedUpdate") {
          this.getUsersWithMoments(this.start_date, this.last_date);
          if (this.userShouldReceiveNotification) {
            this.sendAbsenceNotificationToUser(
              user.id,
              "Tidrapport",
              "Your absence edit request was rejected.",
              "timesheets/time-registration-users-absence",
              "/timesheets/absence"
            );
          }
        }
      });
  }

  sendAbsenceNotificationToUser(user_id, type, message, link, mobile_link) {
    this.userService.sendNotification({
      user_id: user_id,
      type: type,
      message: message,
      link: link,
      mobile_link: mobile_link,
    });
  }

  lockDaysModal(day) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.data = {
      user: this.users[0],
      date: day.date,
      users: this.users,
    };

    this.dialog
      .open(SendNotificationToUserForTimesheetComponent, diaolgConfig)
      .afterClosed()
      .subscribe((result) => {
        // zaključati dan na front endu ili refrešati kalendar
      });
  }

  setStyle(user, day) {
    let style = {
      display: "flex",
      background: "transparent",
      opacity: 1,
    };

    if (
      user.moments &&
      user.moments[day.date] &&
      user.moments[day.date].AtestStatus == "1"
    ) {
      style = {
        display: "flex",
        background: "#98FB98",
        opacity: 1,
      };
      return style;
    }

    if (
      user.absences &&
      user.absences[day.date] &&
      user.absences[day.date].length > 0 &&
      user.absences[day.date][0].isAnswered &&
      user.absences[day.date][0].isRejected != 1
    ) {
      if (user.absences[day.date][0].Approved == 0) {
        const className = "." + day.date;
        $(className).find(".approve-absence-area").addClass("border-red");
        style = {
          display: "block",
          background: user.absences[day.date][0].Color,
          opacity: 0.5,
        };
        return style;
      }

      style = {
        display: "block",
        background: user.absences[day.date][0].Color,
        opacity: 1,
      };
      return style;
    }

    return style;
  }

  getAbsenceTypes() {
    this.timeRegService.getAbsenceTypes().subscribe((res) => {
      if (res["status"]) this.absence_types = res["data"];
    });
  }
}
