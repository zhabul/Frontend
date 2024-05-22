import { Component, OnInit, HostListener } from "@angular/core";
import * as moment from "moment";
import { MomentsService } from "src/app/core/services/moments.service";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { ProjectsService } from "src/app/core/services/projects.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ProjectScheduleNewComponent } from "src/app/moments/moments-planer/components/project-schedule-new/project-schedule-new.component";
import { ModalGroupComponent } from "src/app/moments/moments-planer/components/modal-group/modal-group.component";
import { ScheduleCoworkersComponent } from "src/app/moments/moments-planer/components/schedule-coworkers/schedule-coworkers.component";
import { EditScheduleCoworkersComponent } from "src/app/moments/moments-planer/components/edit-schedule-coworkers/edit-schedule-coworkers.component";
import { cloneDeep } from "lodash";
import { EditPlannerComponent } from "src/app/moments/moments-planer/components/edit-planner/edit-planner.component";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";

declare var $: any;

@Component({
  selector: "app-project-schedule-planer",
  templateUrl: "./project-schedule-planer.component.html",
  styleUrls: ["./project-schedule-planer.component.css"],
})
export class ProjectSchedulePlanerComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private projectsService: ProjectsService,
    private momentService: MomentsService,
    private toastr: ToastrService,
    private dialog: MatDialog
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
  public project: any;
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
  public activeMomentIndex: any;
  public activeMoment: any;
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
  public zoomCalendarContent: number = 100;
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
  public allowResizeEl: boolean = false;
  public canvasBorderRight: boolean = false;
  public canvasBorderLeft: boolean = false;
  public canvasBorderTop: boolean = false;
  public canvasBorderBottom: boolean = false;
  public startedCanvasMoment: any;
  public startedCanvasMomentPosition: string;
  public lines: any[] = [];
  public showLines: boolean = true;
  public canOpenChildren = true;
  public projectOfssetLeft: any;
  public projectWidth: any;
  public allowSelect: boolean = false;
  public groupOfMoments: any[] = [];
  public projectDays: any;
  public allowGroup: boolean = false;
  public arbitraryDates: any[] = [];
  public projectModal: boolean = false;
  public projectModalMomentIndex: any;
  public timlineBodyWrapperWidth: number = 10340;
  public allowScroll: boolean = true;
  public allowRender: boolean = true;
  public allowChangeSizeOfMomentLine: boolean = false;
  public defaultMoments: any[] = [];

  ngOnInit() {
    this.project = this.route.snapshot.data["project"] || [];
    this.moments = this.route.snapshot.data["moments"] || [];
    this.lines = this.route.snapshot.data["lines"] || [];
    this.arbitraryDates = this.route.snapshot.data["arbitraryDates"] || [];
    this.defaultMoments = this.route.snapshot.data["defaultMoments"] || [];

    let today = new Date();
    this.currentDate = moment(today, "YYYY-MM-DD");
    this.Date = this.currentDate.format("YYYY-MM-DD");
    this.fullMonths = this.currentDate["_locale"]["_months"];
    this.months = this.currentDate["_locale"]["_months"];
    this.weekDays = this.currentDate["_locale"]["_weekdaysShort"];

    this.daysInMonth = this.currentDate.daysInMonth();
    let days = this.daysInMonth + 1;
    this.daysInMonthArray = Array.from(Array(days).keys());
    this.daysInMonthArray.splice(0, 1);

    this.currentMonthIndex = this.currentDate.month();
    this.currentMonth = this.months[this.currentMonthIndex];
    this.fullMonth = this.fullMonths[this.currentMonthIndex];
    this.currentYear = today.getFullYear();
    this.currentDay = this.currentDate.day();
    this.day = this.weekDays[this.currentDay];
    this.currentDayNumber = this.currentDate.date();

    let storage = localStorage.getItem("calendar") || [];
    let calendarParse = null;

    if (storage.length > 0) {
      calendarParse = JSON.parse(storage.toString());
    }

    let version = localStorage.getItem("calendarVersion") || -1;

    if (version && version != 4) {
      this.getDaysInMonts();
    } else if (
      calendarParse.length > 0 &&
      calendarParse[2]["year"] == this.currentYear
    ) {
      this.getDaysInMonts();
    } else {
      this.calendar = calendarParse;
    }
  }

  ngAfterViewInit() {
    if (this.calendar && this.calendar.length > 0) {
      localStorage.setItem("calendar", JSON.stringify(this.calendar));
      localStorage.setItem("calendarVersion", "4");
    }

    this.caliculateOffsetWidth();
    this.findActiveMonth();
    this.ensureHiddenChildrenLines();
    this.ensureProjectLineDuration();
    this.initializeStartWidth();
  }

  getDaysInMonts() {
    let startYear = this.currentYear - 1;
    let endYear = this.currentYear + 1;
    let years = this.years(startYear, endYear);

    years.forEach((year) => {
      let months = this.getMonts(year);
      let object = { year, months };
      this.calendar.push(object);
    });

    this.calendar[0]["months"].splice(0, 11);
    this.calendar[2]["months"].splice(2, 10);
  }

  private getMonts(year) {
    const objArray = [];
    this.months.forEach((month) => {
      let numberOfMonth = moment().month(month).format("M");
      let date = year + "-" + numberOfMonth + "-" + 1;
      let momentDate = moment(date, "YYYY-MM-DD");
      let days = momentDate.daysInMonth();
      let daysInMonthArray = Array.from(Array(days + 1).keys());
      daysInMonthArray.splice(0, 1);
      let daysObject = this.getDays(daysInMonthArray, year, numberOfMonth);
      let monthIndex = momentDate.month();

      let obj = {
        year: year,
        name: month,
        daysNumber: days,
        daysInMonthArray: daysInMonthArray,
        days: daysObject,
        monthIndex: monthIndex,
      };
      objArray.push(obj);
    });

    return objArray;
  }

  private years(start, end) {
    let years = [];
    for (var i = start; i <= end; i++) {
      years.push(i);
    }
    return years;
  }

  private getDays(daysInMonthArray, year, numberOfMonth) {
    const objArray = [];
    daysInMonthArray.forEach((day) => {
      let arrayOfSingleDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      var dayOfDate;
      var monthOfDate;

      if (arrayOfSingleDigits.includes(day)) dayOfDate = "0" + day;
      else dayOfDate = day;

      if (arrayOfSingleDigits.includes(+numberOfMonth))
        monthOfDate = "0" + numberOfMonth;
      else monthOfDate = numberOfMonth;

      let datum = year + "-" + monthOfDate + "-" + dayOfDate;
      let momentDatum = moment(datum, "YYYY-MM-DD");
      let week = momentDatum.week();
      let isoWeek = momentDatum.isoWeek();
      let dayIndex = momentDatum.day();
      let dayName = this.weekDays[dayIndex];

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

  findActiveMonth() {
    this.yearArray();
    this.yearsValueWidth = 0;
    this.monthsValueWidth = 0;

    this.lastyears.forEach((year) => {
      let className = ".table-calendar-" + year;
      let value = $(className).outerWidth();
      this.yearsValueWidth += value;
    });

    this.lastMonths.forEach((month) => {
      let className = ".table-calendar-month-" + month;
      let value = $(className).outerWidth();
      this.monthsValueWidth += value;
    });

    this.activeMonthPosition = this.yearsValueWidth + this.monthsValueWidth;
    $(".planner-content-wrapper").scrollLeft(this.activeMonthPosition);
  }

  yearArray() {
    let array = [];
    var currentYear = +this.currentYear;

    this.calendar.forEach((object) => {
      let objectYear = +object.year;

      if (objectYear < currentYear) {
        array.push(object.year);
        this.lastyears = array;
      } else if (objectYear == currentYear) {
        this.monthArray(object);
      }
    });
  }

  monthArray(object) {
    var currentMonthNumber = this.currentMonthIndex + 1;
    this.lastMonths = [];

    object.months.forEach((month) => {
      let monthNumber = month.monthIndex + 1;
      if (monthNumber < currentMonthNumber) {
        this.lastMonths.push(month.name);
        return true;
      }
    });
  }

  setYearClass(index, object) {
    let calendarTableClassName = "table-calendar-" + object.year;
    return calendarTableClassName;
  }

  setMonthClass(index, month) {
    let calendarTableClassName = "table-calendar-month-" + month.name;
    return calendarTableClassName;
  }

  setDayClass(index, day) {
    let activeClass;
    let calendarTableClassName = "table-calendar-day-" + day.date;

    if (day.date == this.Date) activeClass = "active";
    else activeClass = "";

    return calendarTableClassName + " " + activeClass;
  }

  setWeekClass(index, day) {
    let calendarTableClassName =
      "table-calendar-week-" + day.isoWeek + "-" + index;
    return calendarTableClassName;
  }

  setMomentData(momentVar, index) {
    if (!this.allowRender) return false;

    let classNameStart = "table-calendar-day-" + momentVar["StartDate"];
    let classNameEnd = "table-calendar-day-" + momentVar["EndDate"];
    let start = document.getElementsByClassName(classNameStart);
    let end = document.getElementsByClassName(classNameEnd);
    var background;
    var left;

    let calendarStartedYearlastMonthIndex =
      this.calendar[0]["months"].length - 1;
    let calendarStartedYearlastMonth =
      this.calendar[0]["months"][calendarStartedYearlastMonthIndex];

    let momentCalendarStartedYearlastMonthDay = moment(
      calendarStartedYearlastMonth["days"][0]["date"]
    );
    let momentStartDate = moment(momentVar["StartDate"]);
    let momentEndDate = moment(momentVar["EndDate"]);
    let momentClassName = ".moment-timeline-" + momentVar["id"];

    if (momentVar["Group"] == "1") {
      background = momentVar.Color + "B3";
    } else {
      background = momentVar.Color;
    }

    if (start && start.length > 0) {
      let element: any = start[0];

      if (this.startedMovePosition) {
        left = momentVar.left;
      } else {
        left = element.offsetLeft;
      }

      if (!this.allowChangeSizeOfMomentLine) {
        momentVar.width = momentVar.oldWidth;
      }

      $(".moment-timeline").removeClass("border-radius-left-none");
      $(momentClassName).removeClass("displayNone");
    } else if (end.length > 0) {
      let start = this.calendar[0]["months"][0]["days"][0]["date"];
      let className = "table-calendar-day-" + start;
      let retrievedObject = document.getElementsByClassName(className);

      if (retrievedObject && retrievedObject.length > 0) {
        $(".moment-timeline").addClass("border-radius-left-none");
        $(momentClassName).removeClass("displayNone");

        let element: any = retrievedObject[0];
        let days = this.numberOfDays(start, momentVar["EndDate"]);
        left = element.offsetLeft;
        momentVar.width = days * 20;
      }
    } else if (
      (momentCalendarStartedYearlastMonthDay > momentStartDate &&
        momentCalendarStartedYearlastMonthDay > momentEndDate) ||
      (momentCalendarStartedYearlastMonthDay < momentStartDate &&
        momentCalendarStartedYearlastMonthDay < momentEndDate)
    ) {
      /* kalendar izvan start i end date */

      $(momentClassName).addClass("displayNone");
    }

    let style = {
      left: left + "px",
      top: momentVar.top + "px",
      bottom: momentVar.bottom + "px",
      width: momentVar.width + "px",
      background: background,
      "border-radius": "5px",
    };
    return style;
  }

  setPositionAndWIdthProjectPlanCoworker(object) {
    let className = "table-calendar-day-" + object["StartDate"];
    let left;
    let style;
    let visibilityOfDates: any = document.getElementsByClassName(className);
    let startedProjectDate =
      "table-calendar-day-" + this.project["StartDate"].split(" ")[0];
    let visibilityOfStartedProjectDate =
      document.getElementsByClassName(startedProjectDate);

    if (
      visibilityOfStartedProjectDate &&
      visibilityOfStartedProjectDate.length > 0
    ) {
      style = {
        left: object.Left + "px",
        top: object.Top + "px",
        bottom: object.Bottom + "px",
        width: object.Width + "px",
        background: object.Color,
      };
    } else if (visibilityOfDates.length > 0) {
      let element: any = document.getElementsByClassName(className)[0];
      left = element.offsetLeft;

      style = {
        left: left + "px",
        top: object.Top + "px",
        bottom: object.Bottom + "px",
        width: object.Width + "px",
        background: object.Color,
      };
    } else {
      style = {
        display: "none",
      };
    }

    return style;
  }

  setMoment(event, moment, momentIndex) {
    this.activeMoment = moment;
    this.activeMomentIndex = momentIndex;
  }

  allowMove() {
    this.startedMovePosition = true;
    this.showLines = false;
  }

  resizeElement(event, moment) {
    moment.width = event.layerX;
    this.widthTimeline = event.layerX;
  }

  openModal(ProjectPlanID, index) {
    this.allowConnectEl = false;
    this.allowMoveEl = false;
    this.showCanvas = false;

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.data = {
      project: this.project,
      ProjectPlanID: ProjectPlanID,
      defaultMoments: this.defaultMoments,
    };
    this.daysNumber = null;
    this.startedDay = null;
    this.startedPositionAfterMove = null;
    this.projectModal = false;

    this.dialog
      .open(ProjectScheduleNewComponent, diaolgConfig)
      .afterClosed()
      .subscribe((object) => {
        if (ProjectPlanID == "0") {
          object.visible = true;
          object.childCount = "0";

          if (object) this.moments.push(object);
        } else {
          let childCount = +this.moments[index]["childCount"];

          childCount = childCount + 1;

          object.visible = true;
          this.closeChildren(this.moments[index]);
          this.moments[index]["childCount"] = childCount;
          this.moments[index]["btnText"] = "+";
          this.showChildren(this.moments[index], index, null);
        }
      });
  }

  @HostListener("document:mousemove", ["$event"])
  onMouseMove(event: MouseEvent) {
    if (this.allowChangeCavasSize) {
      this.canvasWidth = event.pageX - 35 - this.startCanvasWidth;
      this.canvasHeight = event.pageY - this.startCanvasHeight - 11;

      var height = event.pageY - this.startCanvasHeight - 11;
      var width = event.pageX - 35 - this.startCanvasWidth;

      this.canvasBorderRight = false;
      this.canvasBorderBottom = true;
      this.canvasBorderLeft = true;
      this.canvasBorderTop = false;

      if (height > 0 && this.canvasX < event.pageX) {
        $(".canvas").removeClass("transform-vertical");
        $(".canvas").removeClass("transform-horizontal-left");
      } else if (this.canvasX < event.pageX) {
        $(".canvas").addClass("transform-vertical");
        $(".canvas").removeClass("transform-horizontal-left");
        this.canvasHeight = Math.abs(this.canvasHeight);
      } else if (height < 0 && width < 0) {
        $(".canvas").removeClass("transform-vertical");
        $(".canvas").removeClass("transform-horizontal");
        $(".canvas").addClass("transform-horizontal-left");
        this.canvasWidth = Math.abs(this.canvasWidth - 40);
        this.canvasHeight = Math.abs(this.canvasHeight);
      }

      if (width > 0 && this.canvasY < event.pageY) {
        $(".canvas").removeClass("transform-horizontal");
        $(".canvas").removeClass("transform-horizontal-left");
      } else if (this.canvasY < event.pageY) {
        $(".canvas").addClass("transform-horizontal");
        $(".canvas").removeClass("transform-horizontal-left");
        this.canvasWidth = Math.abs(this.canvasWidth - 40);
      }
    }

    if (!this.grabber) {
      return;
    }
    this.resizer(event.clientX - this.oldX);
    this.oldX = event.clientX;
  }

  @HostListener("document:mouseup", ["$event"])
  onMouseUp(event: MouseEvent) {}

  resizer(offsetX: number) {
    let width = parseInt(this.activeMoment["width"]);
    width += offsetX;

    this.activeMoment["width"] = width;
    this.showSaveIcon = true;
  }

  @HostListener("document:mousedown", ["$event"])
  onMouseDown(event: MouseEvent) {
    this.oldX = event.clientX;
  }

  allowResize() {
    this.grabber = true;
    this.startedMovePosition = false;
    this.showModalInformation = true;
    this.showLines = false;
  }

  allowChangeSizeOfLine() {
    this.allowResizeEl = true;
    this.allowRender = false;
    this.startedMovePosition = false;
    this.allowChangeSizeOfMomentLine = !this.allowChangeSizeOfMomentLine;
  }

  addClassForGroup(moment) {
    if (moment["Group"] == "1") return "btn-group";
  }

  disableResize(moment) {
    this.grabber = false;
    this.allowResizeEl = false;
    this.startedMovePosition = false;
    this.showModalInformation = false;
    this.allowChangeSizeOfMomentLine = false;

    if (this.daysNumber) moment.width = this.daysNumber * 20;

    this.updateMomentPosition(moment);

    setTimeout(() => {
      this.ensureHiddenChildrenLines();
      if (moment.moments && moment.moments.length > 0)
        this.ensureHiddenChildrenAfterClick(moment.moments);
    }, 500);

    setTimeout(() => {
      this.ensureHiddenChildrenLines();
      if (moment.moments && moment.moments.length > 0)
        this.ensureHiddenChildrenAfterClick(moment.moments);
    }, 1000);

    setTimeout(() => {
      this.ensureHiddenChildrenLines();
      if (moment.moments && moment.moments.length > 0)
        this.ensureHiddenChildrenAfterClick(moment.moments);
    }, 2000);
  }

  updateMovePosition(momentVar) {
    if (!this.startedMovePosition) return false;

    this.startedMovePosition = false;
    if (this.startedPositionAfterMove)
      momentVar.left = this.startedPositionAfterMove;

    if (this.startedDateAfterMove)
      momentVar.StartDate = this.startedDateAfterMove;

    let momentDate = cloneDeep(moment(this.startedDateAfterMove));
    let days = +momentVar["Days"];
    let EndDate = momentDate.add(days - 1, "days").format("YYYY-MM-DD");
    momentVar["EndDate"] = EndDate;

    this.momentService.updateMovePosition(momentVar).subscribe((response) => {
      if (response["status"])
        this.toastr.info(
          this.translate.instant(
            "You have successfully moved schedule object."
          ),
          this.translate.instant("Info")
        );

      this.allowMoveEl = false;
      this.getLines();

      setTimeout(() => {
        this.ensureHiddenChildrenLines();
        if (momentVar.moments && momentVar.moments.length > 0)
          this.ensureHiddenChildrenAfterClick(momentVar.moments);
      }, 1000);
    });
  }

  setMomentsLength(event) {
    if (!this.grabber) return;

    let newWidth = this.activeMoment["width"];

    this.daysNumber = Math.ceil(newWidth / 20);
    this.startedDay = this.activeMoment["StartDate"];

    let momentDate = moment(this.startedDay);
    this.EndDate = momentDate
      .add(this.daysNumber - 1, "days")
      .format("YYYY-MM-DD");
  }

  updateMomentPosition(moment) {
    moment.Days = this.daysNumber;
    moment.EndDate = this.EndDate;
    moment.Width = this.activeMoment["width"];
    moment.oldWidth = this.activeMoment["width"];

    this.momentService.updateMomentPosition(moment).subscribe((response) => {
      if (response["status"]) {
        this.toastr.info(
          this.translate.instant(
            "You have successfully setted schedule dates."
          ),
          this.translate.instant("Info")
        );
        this.activeMoment["oldWidth"] = this.activeMoment["width"];
        this.showSaveIcon = false;
        this.daysNumber = null;
        this.startedDay = null;
        this.EndDate = null;
        this.allowMoveEl = false;
        this.getLines();
      }
    });
  }

  printWeek(week, index) {
    if (this.WeekNUmber && this.WeekNUmber == week) {
      return " ";
    } else {
      this.WeekNUmber = week;
      return week;
    }
    this.WeekNUmber = week;
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

  showChildren(moment, index, childIndex = null) {
    if (!this.canOpenChildren) return;

    let showChildren = ".show-child-" + moment.id;
    let first = ".first-" + moment.id;
    let second = ".second-" + moment.id;

    $(showChildren).removeClass("hide");
    $(first).removeClass("hide");
    $(second).removeClass("hide");

    this.canOpenChildren = false;

    if (moment.btnText == "-") {
      this.closeChildren(moment);
      moment.btnText = "+";
      this.canOpenChildren = true;
      this.ensureHiddenChildrenAfterClick(moment.moments);

      setTimeout(() => {
        this.ensureHiddenChildrenLines();
      }, 1000);
    } else {
      this.projectsService
        .getChildrenProjectPlans(this.project.id, moment.id)
        .then((response) => {
          $(showChildren).removeClass("hide");
          $(first).removeClass("hide");
          $(second).removeClass("hide");
          this.showChildrenLines(response["data"]);

          let data = response["data"];
          this.moments.splice(index + 1, 0, ...data);
          moment.moments = data;

          if (moment.btnText == "+") moment.btnText = "-";
          else moment.btnText = "+";

          this.canOpenChildren = true;
        });
    }
  }

  closeChildren(moment) {
    this.moments
      .filter((m) => m["parent"] == moment.id)
      .forEach((m) => {
        m["visible"] = false;

        let childCount = +m["childCount"];

        if (childCount > 0) {
          this.closeChildren(m);
        }
      });
  }

  setChildClass(moment) {
    let classPointer = "";

    if (this.allowSelect) classPointer = "cursor-pointer";

    var className;

    if (moment["parent"] != "0") className = "children-li";
    else className = "parent-li";

    let classIdentification = "moment-" + moment.id;

    return className + " " + classIdentification + " " + classPointer;
  }

  checkIfMomentHvasChildren(moment) {
    if (moment.children && moment.children.length > 0) return true;
    else return false;
  }

  momentHaveChildren(moment) {
    let child = +moment["childCount"];

    if (child && child > 0) return true;
    else return false;
  }

  moveElement(event, moment) {
    if (!this.startedMovePosition) return;

    let number = this.splitToDigit(event.layerX);
    if (number.length > 1) moment.left = event.layerX;
  }

  largeWidth(moment) {
    let width = +moment["width"];

    if (width > 35) return true;
    else return false;
  }

  splitToDigit(n) {
    return (n + "").split("").map((i) => {
      return Number(i);
    });
  }

  setStartedPoint(event, day) {
    if (!this.startedMovePosition) return;

    this.startedDateAfterMove = day.date;
    this.startedClassDateAfterMove = "table-calendar-day-" + day.date;

    if (
      document.getElementsByClassName(this.startedClassDateAfterMove) &&
      document.getElementsByClassName(this.startedClassDateAfterMove)[0]
    ) {
      let element: any = document.getElementsByClassName(
        this.startedClassDateAfterMove
      )[0];
      this.startedPositionAfterMove = element.offsetLeft;
    }
  }

  allowCalendarZoomIn() {
    if (this.zoomCalendarContent >= 180) {
      this.zoomCalendarContent = 180;
      return false;
    } else {
      return true;
    }
  }

  allowCalendarZoomOut() {
    if (this.zoomCalendarContent <= 40) {
      this.zoomCalendarContent = 40;
      return false;
    } else {
      return true;
    }
  }

  allowZoomIn() {
    if (this.zoomPage >= 180) {
      this.zoomPage = 180;
      return false;
    } else {
      return true;
    }
  }

  allowZoomOut() {
    if (this.zoomPage <= 40) {
      this.zoomPage = 40;
      return false;
    } else {
      return true;
    }
  }

  zoomInCalendar() {
    this.zoomCalendarContent = this.zoomCalendarContent + 10;
    this.activeMoment = false;

    if (this.fontSize > 24) this.fontSize = this.fontSize - 2;
  }

  zoomOutCalendar() {
    this.zoomCalendarContent = this.zoomCalendarContent - 10;
    this.activeMoment = false;

    if (this.zoomCalendarContent <= 90) this.fontSize = this.fontSize + 2;
  }

  zoomIn() {
    this.zoomPage = this.zoomPage + 10;
    this.activeMoment = false;

    if (this.fontSize > 24) this.fontSize = this.fontSize - 5;
  }

  zoomOut() {
    this.zoomPage = this.zoomPage - 10;
    this.activeMoment = false;

    if (this.zoomPage <= 90) this.fontSize = this.fontSize + 5;
  }

  calculateStylesCalendar() {
    let style = {
      zoom: this.zoomCalendarContent + "%",
    };
    return style;
  }

  calculateStylesSideMenu() {
    let style = {
      zoom: this.zoomPage + "%",
    };
    return style;
  }

  whatClassIsIt(moment) {
    let className = "moment-timeline-" + moment["id"];
    let width = +moment["width"];

    if (width > 35) return "space-between" + " " + className;
    else return "flex-end" + " " + className;
  }

  disableMove() {
    if (!this.startedMovePosition) {
      return false;
    } else {
      this.updateMovePosition(this.activeMoment);
    }
  }

  allowMoveElement() {
    this.allowMoveEl = !this.allowMoveEl;
  }

  setCanvasStyle() {
    let border = "1px dashed #000000";

    let style = {
      height: this.canvasHeight + "px",
      width: this.canvasWidth + "px",
      left: this.canvasX + "px",
      top: this.canvasY + "px",
      "border-left": "1px dashed #000000",
      "border-bottom": "1px dashed #000000",
    };

    if (this.canvasBorderRight) style["border-right"] = border;

    if (this.canvasBorderLeft) style["border-left"] = border;

    if (this.canvasBorderTop) style["border-top"] = border;

    if (this.canvasBorderBottom) style["border-bottom"] = border;

    return style;
  }

  allowConnectElement() {
    this.allowConnectEl = !this.allowConnectEl;
  }

  setStartCanvasPosition(event, moment, position) {
    this.canvasY = event.pageY;
    this.canvasX = event.pageX - 80;

    this.allowChangeCavasSize = true;
    this.showCanvas = true;

    this.startCanvasWidth = event.pageX - 80;
    this.startCanvasHeight = event.pageY;

    this.startedCanvasMoment = moment;
    this.startedCanvasMomentPosition = position;
  }

  setEndCanvasPosition(event, moment, position) {
    let object = {
      ProjectPlanIdFirst: this.startedCanvasMoment.id,
      ProjectPlanIdSecond: moment.id,
      PositionFirst: this.startedCanvasMomentPosition,
      PositionSecond: position,
      ProjectID: this.project.id,
      ProjectPlanFirstStartDate: this.startedCanvasMoment.StartDate,
      ProjectPlanFirstEndDate: this.startedCanvasMoment.EndDate,
      ProjectPlanSecondStartDate: moment.StartDate,
      ProjectPlanSecondEndDate: moment.EndDate,
    };

    if (object["ProjectPlanIdFirst"] != object["ProjectPlanIdSecond"]) {
      this.momentService
        .createMomentPlanConnectionLine(object)
        .subscribe((response) => {
          this.lines.push(response["data"]);
          this.allowConnectEl = false;
          this.showCanvas = false;
        });
    } else {
      this.toastr.info(
        this.translate.instant("You should connect with another moment."),
        this.translate.instant("Info")
      );
    }
  }

  resetCanvasPosition() {
    this.allowChangeCavasSize = false;
    this.canvasHeight = 20;
    this.canvasWidth = 20;
    this.canvasX = 0;
    this.canvasY = 0;
  }

  startPosition(line) {
    let startedleft = +line.startedleft;
    let endedleft = +line.endedleft;
    let startedWidth = +line.startedWidth;
    let endedWidth = +line.endedWidth;

    var left;

    let start = startedleft + startedWidth;
    let end = endedleft + endedWidth;

    let classNamePlanFirstStartDate =
      "table-calendar-day-" + line.ProjectPlanFirstStartDate;
    let classNameProjectPlanFirstEndDate =
      "table-calendar-day-" + line.ProjectPlanFirstEndDate;
    let classNamePlanSecondStartDate =
      "table-calendar-day-" + line.ProjectPlanSecondStartDate;
    let classNameProjectPlanSecondEndDate =
      "table-calendar-day-" + line.ProjectPlanSecondEndDate;

    let PlanFirstStartDate = document.getElementsByClassName(
      classNamePlanFirstStartDate
    );
    let ProjectPlanFirstEndDate = document.getElementsByClassName(
      classNameProjectPlanFirstEndDate
    );
    let PlanSecondStartDate = document.getElementsByClassName(
      classNamePlanSecondStartDate
    );
    let ProjectPlanSecondEndDate = document.getElementsByClassName(
      classNameProjectPlanSecondEndDate
    );

    if (line.PositionFirst == "left" && line.PositionSecond == "left") {
      if (startedleft > endedleft) {
        if (PlanFirstStartDate.length > 0 && PlanSecondStartDate.length > 0) {
          let elementStart: any = PlanSecondStartDate[0];
          left = elementStart.offsetLeft - 20;
        }
      } else if (startedleft <= endedleft) {
        if (PlanFirstStartDate.length > 0 && PlanSecondStartDate.length > 0) {
          let elementStart: any = PlanFirstStartDate[0];
          left = elementStart.offsetLeft - 20;
        }
      }
    } else if (line.PositionFirst == "left" && line.PositionSecond == "right") {
      if (line.ProjectPlanIdFirst > line.ProjectPlanIdSecond) {
        if (
          this.array_range(startedleft, 5).includes(end) ||
          this.array_range(end, 5).includes(startedleft)
        ) {
          if (ProjectPlanFirstEndDate.length > 0) {
            let elementStart: any = ProjectPlanFirstEndDate[0];
            left = elementStart.offsetLeft + 20;
          }
        } else if (startedleft < end) {
          if (ProjectPlanFirstEndDate.length > 0) {
            let elementStart: any = ProjectPlanFirstEndDate[0];
            left = elementStart.offsetLeft + 20;
          }
        } else {
          if (PlanFirstStartDate.length > 0) {
            let elementStart: any = PlanFirstStartDate[0];
            left = elementStart.offsetLeft - 20;
          }
        }
      } else if (line.ProjectPlanIdFirst < line.ProjectPlanIdSecond) {
        if (
          this.array_range(startedleft, 5).includes(end) ||
          this.array_range(end, 5).includes(startedleft)
        ) {
          left = start;
        } else if (startedleft <= end) {
          left = start;
        } else {
          left = startedleft - 20;
        }
      } else if (startedleft <= end) {
        left = start;
      } else {
        left = startedleft - 20;
      }
    } else if (line.PositionFirst == "right" && line.PositionSecond == "left") {
      if (line.ProjectPlanIdFirst > line.ProjectPlanIdSecond) {
        if (
          ProjectPlanFirstEndDate.length > 0 &&
          PlanSecondStartDate.length > 0
        ) {
          let elementStart: any = ProjectPlanFirstEndDate[0];
          left = elementStart.offsetLeft + 20;
        }
      } else {
        if (
          ProjectPlanFirstEndDate.length > 0 &&
          PlanSecondStartDate.length > 0
        ) {
          let elementStart: any = ProjectPlanFirstEndDate[0];
          left = elementStart.offsetLeft + 20;
        }
      }
    } else if (
      line.PositionFirst == "right" &&
      line.PositionSecond == "right"
    ) {
      if (start >= end) {
        if (
          ProjectPlanFirstEndDate.length > 0 &&
          ProjectPlanSecondEndDate.length > 0
        ) {
          let elementStart: any = ProjectPlanFirstEndDate[0];
          left = elementStart.offsetLeft + 20;
        }
      } else {
        if (
          ProjectPlanFirstEndDate.length > 0 &&
          ProjectPlanSecondEndDate.length > 0
        ) {
          let elementStart: any = ProjectPlanFirstEndDate[0];
          left = elementStart.offsetLeft + 20;
        }
      }
    } else {
      if (start >= end) {
        left = startedleft + startedWidth;
      } else {
        left = startedleft + startedWidth;
      }
    }

    return left;
  }

  startedWidth(line) {
    let startedleft = +line.startedleft;
    let endedleft = +line.endedleft;
    let startedWidth = +line.startedWidth;
    let endedWidth = +line.endedWidth;

    let start = startedleft + startedWidth;
    let end = endedleft + endedWidth;

    var width;

    let MomentProjectPlanFirstEndDate = moment(line.ProjectPlanFirstEndDate);

    let MomentProjectPlanSecondStartDate = moment(
      line.ProjectPlanSecondStartDate
    );
    let MomentProjectPlanSecondEndDate = moment(line.ProjectPlanSecondEndDate);

    let classNameProjectPlanFirstEndDate =
      "table-calendar-day-" + line.ProjectPlanFirstEndDate;
    let classNameProjectPlanSecondEndDate =
      "table-calendar-day-" + line.ProjectPlanSecondEndDate;

    let ProjectPlanFirstEndDate = document.getElementsByClassName(
      classNameProjectPlanFirstEndDate
    );
    let ProjectPlanSecondEndDate = document.getElementsByClassName(
      classNameProjectPlanSecondEndDate
    );

    let MomentDatePlusOneDayVar = cloneDeep(MomentProjectPlanFirstEndDate);
    let MomentDatePlusOneDay = MomentDatePlusOneDayVar.add(1, "days").format(
      "YYYY-MM-DD"
    );

    if (line.PositionFirst == "left" && line.PositionSecond == "left") {
      if (startedleft > endedleft) {
        width = startedleft - endedleft + 20;
      } else if (startedleft <= endedleft) {
        width = 20;
      }
    } else if (line.PositionFirst == "right" && line.PositionSecond == "left") {
      if (line.ProjectPlanIdFirst > line.ProjectPlanIdSecond) {
        if (
          MomentDatePlusOneDay ==
          MomentProjectPlanSecondStartDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            ProjectPlanSecondEndDate.length > 0
          ) {
            let elementStart: any = ProjectPlanFirstEndDate[0];
            let elementEnd: any = ProjectPlanSecondEndDate[0];
            width =
              Math.abs(elementStart.offsetLeft - elementEnd.offsetLeft) + 20;
          }
        } else if (
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") ==
          MomentProjectPlanSecondStartDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            ProjectPlanSecondEndDate.length > 0
          ) {
            let elementStart: any = ProjectPlanFirstEndDate[0];
            let elementEnd: any = ProjectPlanSecondEndDate[0];
            width =
              Math.abs(elementStart.offsetLeft - elementEnd.offsetLeft) + 20;
          }
        } else if (
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") >
            MomentProjectPlanSecondStartDate.format("YYYY-MM-DD") &&
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") >=
            MomentProjectPlanSecondEndDate.format("YYYY-MM-DD")
        ) {
          width = 20;
        } else if (
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") >
            MomentProjectPlanSecondStartDate.format("YYYY-MM-DD") &&
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") <
            MomentProjectPlanSecondEndDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            ProjectPlanSecondEndDate.length > 0
          ) {
            let elementStart: any = ProjectPlanFirstEndDate[0];
            let elementEnd: any = ProjectPlanSecondEndDate[0];
            width =
              Math.abs(elementStart.offsetLeft - elementEnd.offsetLeft) + 20;
          }
        } else if (
          this.array_range(start, 5).includes(endedleft) ||
          this.array_range(endedleft, 5).includes(start)
        ) {
          width = Math.abs(start - end) + 20;
        } else if (start > endedleft && end > start) {
          width = Math.abs(start - end) + 20;
        } else {
          width = 20;
        }
      } else {
        if (
          MomentDatePlusOneDay ==
          MomentProjectPlanSecondStartDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            ProjectPlanSecondEndDate.length > 0
          ) {
            let elementStart: any = ProjectPlanFirstEndDate[0];
            let elementEnd: any = ProjectPlanSecondEndDate[0];
            width =
              Math.abs(elementStart.offsetLeft - elementEnd.offsetLeft) + 20;
          }
        } else if (
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") ==
          MomentProjectPlanSecondStartDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            ProjectPlanSecondEndDate.length > 0
          ) {
            let elementStart: any = ProjectPlanFirstEndDate[0];
            let elementEnd: any = ProjectPlanSecondEndDate[0];
            width =
              Math.abs(elementStart.offsetLeft - elementEnd.offsetLeft) + 20;
          }
        } else if (
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") <
          MomentProjectPlanSecondStartDate.format("YYYY-MM-DD")
        ) {
          width = 20;
        } else if (
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") >
            MomentProjectPlanSecondStartDate.format("YYYY-MM-DD") &&
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") >
            MomentProjectPlanSecondEndDate.format("YYYY-MM-DD")
        ) {
          width = 20;
        } else if (
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") >
            MomentProjectPlanSecondStartDate.format("YYYY-MM-DD") ||
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") <
            MomentProjectPlanSecondEndDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            ProjectPlanSecondEndDate.length > 0
          ) {
            let elementStart: any = ProjectPlanFirstEndDate[0];
            let elementEnd: any = ProjectPlanSecondEndDate[0];
            width =
              Math.abs(elementStart.offsetLeft - elementEnd.offsetLeft) + 20;
          }
        } else if (start < endedleft && end > start) {
          width = 20;
        } else if (start >= endedleft && end > start) {
          width = Math.abs(end - start) + 20;
        } else {
          width = 20;
        }
      }
    } else if (line.PositionFirst == "left" && line.PositionSecond == "right") {
      if (line.ProjectPlanIdFirst < line.ProjectPlanIdSecond) {
        if (startedleft < end && end < start) {
          width = 20;
        } else if (startedleft < end) {
          width = Math.abs(end - start) + 20;
        } else {
          width = 20;
        }
      } else {
        if (
          this.array_range(startedleft, 5).includes(end) ||
          this.array_range(end, 5).includes(startedleft)
        ) {
          width = 20;
        } else if (startedleft < end && start > end) {
          width = 20;
        } else if (end > startedleft) {
          width = Math.abs(start - end) + 20;
        } else if (startedleft > end) {
          width = 20;
        }
      }
    } else if (
      line.PositionFirst == "right" &&
      line.PositionSecond == "right"
    ) {
      if (
        MomentProjectPlanSecondEndDate.format("YYYY-MM-DD") >=
        MomentProjectPlanFirstEndDate.format("YYYY-MM-DD")
      ) {
        if (
          ProjectPlanFirstEndDate.length > 0 &&
          ProjectPlanSecondEndDate.length > 0
        ) {
          let elementStart: any = ProjectPlanFirstEndDate[0];
          let elementEnd: any = ProjectPlanSecondEndDate[0];
          width =
            Math.abs(elementStart.offsetLeft - elementEnd.offsetLeft) + 20;
        }
      } else {
        width = 20;
      }
    } else {
      if (start >= end) {
        width = 20;
      } else {
        width = Math.abs(start - end) + 20;
      }
    }

    return width;
  }

  setVerticalLine(line, start, end, momentVar) {
    let classNameStarted = ".lineid-" + line.id;
    let elementStarted: any = $(classNameStarted).offset();

    let classNameEnded = ".hiddenlineid-" + line.id;
    let elementEnded: any = $(classNameEnded).offset();

    let classMiddleRight = ".middle-right-hiddenlineid-" + line.id;
    let elementMiddle: any = $(classMiddleRight).offset();

    var topFirst = null;
    var topSecond = null;
    var height = 10;
    var left = start;

    let startedleft = +line.startedleft;
    let endedleft = +line.endedleft;
    let startedWidth = +line.startedWidth;
    let endedWidth = +line.endedWidth;

    let startVar = startedleft + startedWidth;
    let endVar = endedleft + endedWidth;

    if (elementStarted && elementEnded) {
      topFirst = elementStarted["top"];
      topSecond = elementEnded["top"];
      height = Math.abs(topFirst - topSecond);
    }

    if (elementStarted && elementMiddle) {
      topFirst = elementStarted["top"];
    }

    let firstPlanClassName = ".moment-timeline-" + line.ProjectPlanIdFirst;
    let secondPlanClassName = ".moment-timeline-" + line.ProjectPlanIdSecond;

    let elementfirstPlan: any = $(firstPlanClassName).offset();
    let elementsecondPlan: any = $(secondPlanClassName).offset();

    let MomentProjectPlanFirstEndDate = moment(line.ProjectPlanFirstEndDate);

    let MomentProjectPlanSecondStartDate = moment(
      line.ProjectPlanSecondStartDate
    );
    let MomentProjectPlanSecondEndDate = moment(line.ProjectPlanSecondEndDate);

    let classNameProjectPlanFirstEndDate =
      "table-calendar-day-" + line.ProjectPlanFirstEndDate;
    let classNamePlanSecondStartDate =
      "table-calendar-day-" + line.ProjectPlanSecondStartDate;
    let classNameProjectPlanSecondEndDate =
      "table-calendar-day-" + line.ProjectPlanSecondEndDate;

    let ProjectPlanFirstEndDate = document.getElementsByClassName(
      classNameProjectPlanFirstEndDate
    );
    let PlanSecondStartDate = document.getElementsByClassName(
      classNamePlanSecondStartDate
    );
    let ProjectPlanSecondEndDate = document.getElementsByClassName(
      classNameProjectPlanSecondEndDate
    );

    let MomentDatePlusTwoDaysVar = cloneDeep(MomentProjectPlanFirstEndDate);
    let MomentDatePlusTwoDays = MomentDatePlusTwoDaysVar.add(1, "days").format(
      "YYYY-MM-DD"
    );

    var top;

    if (line.PositionFirst == "right" && line.PositionSecond == "left") {
      if (elementfirstPlan && elementsecondPlan) {
        height = Math.abs(elementsecondPlan["top"] - elementfirstPlan["top"]);
      }

      if (line.ProjectPlanIdFirst < line.ProjectPlanIdSecond) {
        top = 11;

        if (
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") >
            MomentProjectPlanSecondStartDate.format("YYYY-MM-DD") &&
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") <=
            MomentProjectPlanSecondEndDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            PlanSecondStartDate.length > 0
          ) {
            let elementStart: any = ProjectPlanSecondEndDate[0];
            left = elementStart.offsetLeft + 40;
          }
        } else if (
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") >
          MomentProjectPlanSecondStartDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            PlanSecondStartDate.length > 0
          ) {
            let elementStart: any = ProjectPlanFirstEndDate[0];
            left = elementStart.offsetLeft + 40;
          }
        } else if (
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") ==
          MomentProjectPlanSecondStartDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            PlanSecondStartDate.length > 0
          ) {
            let elementStart: any = ProjectPlanSecondEndDate[0];
            left = elementStart.offsetLeft + 40;
          }
        } else if (
          MomentDatePlusTwoDays ==
          MomentProjectPlanSecondStartDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            PlanSecondStartDate.length > 0
          ) {
            let elementStart: any = ProjectPlanSecondEndDate[0];
            left = elementStart.offsetLeft + 40;
          }
        } else {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            PlanSecondStartDate.length > 0
          ) {
            let elementStart: any = ProjectPlanFirstEndDate[0];
            left = elementStart.offsetLeft + 40;
          }
        }
      } else {
        top = -height + 11;

        if (
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") >
            MomentProjectPlanSecondStartDate.format("YYYY-MM-DD") &&
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") <=
            MomentProjectPlanSecondEndDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            PlanSecondStartDate.length > 0
          ) {
            let elementStart: any = ProjectPlanSecondEndDate[0];
            left = elementStart.offsetLeft + 40;
          }
        } else if (
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") >
          MomentProjectPlanSecondStartDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            PlanSecondStartDate.length > 0
          ) {
            let elementStart: any = ProjectPlanFirstEndDate[0];
            left = elementStart.offsetLeft + 40;
          }
        } else if (
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") ==
          MomentProjectPlanSecondStartDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            PlanSecondStartDate.length > 0
          ) {
            let elementStart: any = ProjectPlanSecondEndDate[0];
            left = elementStart.offsetLeft + 40;
          }
        } else if (
          MomentDatePlusTwoDays ==
          MomentProjectPlanSecondStartDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            PlanSecondStartDate.length > 0
          ) {
            let elementStart: any = ProjectPlanSecondEndDate[0];
            left = elementStart.offsetLeft + 40;
          }
        } else {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            PlanSecondStartDate.length > 0
          ) {
            let elementStart: any = ProjectPlanFirstEndDate[0];
            left = elementStart.offsetLeft + 40;
          }
        }
      }
    } else if (line.PositionFirst == "left" && line.PositionSecond == "right") {
      if (elementfirstPlan && elementsecondPlan) {
        height = Math.abs(elementsecondPlan["top"] - elementfirstPlan["top"]);
      }

      if (line.ProjectPlanIdFirst < line.ProjectPlanIdSecond) {
        if (
          this.array_range(startedleft, 5).includes(end) ||
          this.array_range(end, 5).includes(startedleft)
        ) {
          left = startVar + 20;
        } else if (endVar >= startedleft && startVar > endVar) {
          left = startVar + 20;
        } else if (endVar >= startedleft) {
          left = end + 20;
        } else if (
          this.array_range(startedleft - 20, 5).includes(end) ||
          this.array_range(end, 5).includes(startedleft - 20)
        ) {
          line.arrowTop = -18;
          line.arrowTransform = -90;
        } else {
          left = startedleft - 20;
        }
      } else {
        top = -height + 11;

        if (
          this.array_range(startedleft, 5).includes(end) ||
          this.array_range(end, 5).includes(startedleft)
        ) {
          left = startVar + 20;
        } else if (endVar >= startedleft && startVar > endVar) {
          left = startVar + 20;
        } else if (endVar >= startedleft) {
          left = end + 20;
        } else if (
          this.array_range(startedleft - 20, 5).includes(end) ||
          this.array_range(end, 5).includes(startedleft - 20)
        ) {
          line.arrowTop = -3;
          line.arrowTransform = -90;
          line.arrowPosition = -11;
        } else {
          left = startedleft - 20;
        }
      }
    } else if (line.PositionFirst == "left" && line.PositionSecond == "left") {
      if (elementfirstPlan && elementsecondPlan) {
        height = Math.abs(elementsecondPlan["top"] - elementfirstPlan["top"]);
      }

      if (line.ProjectPlanIdFirst < line.ProjectPlanIdSecond) {
        top = 11;
      } else {
        top = -height + 11;
      }
    } else if (
      line.PositionFirst == "right" &&
      line.PositionSecond == "right"
    ) {
      if (elementfirstPlan && elementsecondPlan) {
        height = Math.abs(elementsecondPlan["top"] - elementfirstPlan["top"]);
      }

      if (line.ProjectPlanIdFirst < line.ProjectPlanIdSecond) {
        top = 11;

        if (ProjectPlanFirstEndDate.length > 0) {
          let classNameHorisontalLine =
            ".start-horizontal-line.first-" +
            line.ProjectPlanIdFirst +
            "-second-" +
            line.ProjectPlanIdSecond;
          let verticalHorisontalWidth = $(classNameHorisontalLine).width();

          let elementStart: any = ProjectPlanFirstEndDate[0];
          left = elementStart.offsetLeft + verticalHorisontalWidth + 20;
        }
      } else {
        if (ProjectPlanFirstEndDate.length > 0) {
          let classNameHorisontalLine =
            ".start-horizontal-line.first-" +
            line.ProjectPlanIdFirst +
            "-second-" +
            line.ProjectPlanIdSecond;
          let verticalHorisontalWidth = $(classNameHorisontalLine).width();

          let elementStart: any = ProjectPlanFirstEndDate[0];
          left = elementStart.offsetLeft + verticalHorisontalWidth + 20;
        }

        top = -height + 11;
      }
    } else {
      top = 11;
    }

    let style = {
      width: "1px",
      height: height + "px",
      background: "#000000",
      position: "absolute",
      top: top + "px",
      left: left + "px",
      "z-index": 500,
    };

    return style;
  }

  endPosition(line) {
    let startedleft = +line.startedleft;
    let endedleft = +line.endedleft;
    let startedWidth = +line.startedWidth;
    let endedWidth = +line.endedWidth;

    var left;
    let start = startedleft + startedWidth;
    let end = endedleft + endedWidth;

    let MomentProjectPlanFirstEndDate = moment(line.ProjectPlanFirstEndDate);
    let MomentProjectPlanFirstStartDate = moment(
      line.ProjectPlanFirstStartDate
    );

    let MomentProjectPlanSecondStartDate = moment(
      line.ProjectPlanSecondStartDate
    );
    let MomentProjectPlanSecondEndDate = moment(line.ProjectPlanSecondEndDate);

    let classNamePlanFirstStartDate =
      "table-calendar-day-" + line.ProjectPlanFirstStartDate;
    let classNameProjectPlanFirstEndDate =
      "table-calendar-day-" + line.ProjectPlanFirstEndDate;
    let classNamePlanSecondStartDate =
      "table-calendar-day-" + line.ProjectPlanSecondStartDate;
    let classNameProjectPlanSecondEndDate =
      "table-calendar-day-" + line.ProjectPlanSecondEndDate;

    let PlanFirstStartDate = document.getElementsByClassName(
      classNamePlanFirstStartDate
    );
    let ProjectPlanFirstEndDate = document.getElementsByClassName(
      classNameProjectPlanFirstEndDate
    );
    let PlanSecondStartDate = document.getElementsByClassName(
      classNamePlanSecondStartDate
    );
    let ProjectPlanSecondEndDate = document.getElementsByClassName(
      classNameProjectPlanSecondEndDate
    );

    let MomentDateProjectPlanFirstEndDate = cloneDeep(
      MomentProjectPlanFirstEndDate
    );
    let MomentDateProjectPlanSecondEndDate = cloneDeep(
      MomentProjectPlanSecondEndDate
    );

    let MomentDatePlusOneDays = MomentDateProjectPlanFirstEndDate.add(
      1,
      "days"
    ).format("YYYY-MM-DD");
    let MomentDatePlusTwoDays = MomentDateProjectPlanFirstEndDate.add(
      1,
      "days"
    ).format("YYYY-MM-DD");

    let MomentDatePlusTwoDaySecond = MomentDateProjectPlanSecondEndDate.add(
      2,
      "days"
    ).format("YYYY-MM-DD");
    let lineClass =
      "first-" +
      line.ProjectPlanIdFirst +
      "-" +
      "second-" +
      line.ProjectPlanIdSecond;

    if (line.PositionFirst == "left" && line.PositionSecond == "left") {
      if (startedleft >= endedleft) {
        if (PlanFirstStartDate.length > 0 && PlanSecondStartDate.length > 0) {
          let elementStart: any = PlanSecondStartDate[0];
          left = elementStart.offsetLeft - 20;
        }
      } else {
        if (PlanFirstStartDate.length > 0 && PlanSecondStartDate.length > 0) {
          let elementStart: any = PlanFirstStartDate[0];
          let elementEnd: any = PlanSecondStartDate[0];
          let width = Math.abs(elementStart.offsetLeft - elementEnd.offsetLeft);

          left = elementEnd.offsetLeft - width - 20;
        }
      }
      line.arrowTransform = 180;
    } else if (line.PositionFirst == "right" && line.PositionSecond == "left") {
      if (line.ProjectPlanIdFirst > line.ProjectPlanIdSecond) {
        if (
          MomentDatePlusTwoDays ==
          MomentProjectPlanSecondStartDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            PlanSecondStartDate.length > 0
          ) {
            let elementStart: any = ProjectPlanFirstEndDate[0];
            left = elementStart.offsetLeft + 40;
            line.arrowTransform = 90;
            line.arrowPosition = -11;
          }
        } else if (
          MomentDatePlusOneDays ==
            MomentProjectPlanSecondStartDate.format("YYYY-MM-DD") ||
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") ==
            MomentProjectPlanSecondStartDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            ProjectPlanSecondEndDate.length > 0
          ) {
            let elementStart: any = ProjectPlanSecondEndDate[0];
            left = elementStart.offsetLeft + 20;
            line.arrowTransform = 0;
            line.arrowPosition = -9;
          }
        } else if (
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") >
          MomentProjectPlanSecondStartDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            ProjectPlanSecondEndDate.length > 0
          ) {
            let elementStart: any = ProjectPlanSecondEndDate[0];
            left = elementStart.offsetLeft + 20;
            line.arrowPosition = -8;
          }
        } else {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            PlanSecondStartDate.length > 0
          ) {
            let className = ".end-horizonal-line." + lineClass;
            let arrowPosition = $(className).width() - 18;
            let elementStart: any = ProjectPlanFirstEndDate[0];
            left = elementStart.offsetLeft + 40;
            line.arrowTransform = 180;
            line.arrowPosition = arrowPosition;
          }
        }
      } else {
        if (
          MomentDatePlusTwoDays ==
          MomentProjectPlanSecondStartDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            PlanSecondStartDate.length > 0
          ) {
            let elementStart: any = PlanSecondStartDate[0];
            left = elementStart.offsetLeft;
            line.arrowPosition = -12;
            line.arrowTransform = -90;
          }
        } else if (
          MomentDatePlusOneDays ==
          MomentProjectPlanSecondStartDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            ProjectPlanSecondEndDate.length > 0
          ) {
            let elementStart: any = ProjectPlanSecondEndDate[0];
            left = elementStart.offsetLeft + 20;
            line.arrowTransform = 0;
            line.arrowPosition = -10;
          }
        } else if (
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") >=
          MomentProjectPlanSecondStartDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            PlanSecondStartDate.length > 0
          ) {
            let elementStart: any = ProjectPlanSecondEndDate[0];
            left = elementStart.offsetLeft + 20;
            line.arrowPosition = -8;
          }
        } else if (
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") <
          MomentProjectPlanSecondStartDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            PlanSecondStartDate.length > 0
          ) {
            let elementStart: any = ProjectPlanFirstEndDate[0];
            left = elementStart.offsetLeft + 40;

            let classNameVerticalLine =
              ".end-horizonal-line.first-" +
              line.ProjectPlanIdFirst +
              "-second-" +
              line.ProjectPlanIdSecond;
            let verticalLine = $(classNameVerticalLine);

            if (verticalLine.length > 0) {
              let verticalLineHeight = verticalLine.width() - 15;
              line.arrowPosition = verticalLineHeight;
            }
            line.arrowTransform = 180;
          }
        } else {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            PlanSecondStartDate.length > 0
          ) {
            let elementStart: any = ProjectPlanFirstEndDate[0];
            left = elementStart.offsetLeft + 40;
            line.arrowTransform = 180;
          }
        }
      }
    } else if (line.PositionFirst == "left" && line.PositionSecond == "right") {
      if (line.ProjectPlanIdFirst > line.ProjectPlanIdSecond) {
        if (
          MomentDatePlusTwoDaySecond ==
          MomentProjectPlanFirstStartDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            PlanSecondStartDate.length > 0
          ) {
            let elementStart: any = ProjectPlanSecondEndDate[0];
            left = elementStart.offsetLeft + 20;
            line.arrowTop = -3;
            line.arrowTransform = -90;
            line.arrowPosition = -11;
          }
        } else if (
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") >
          MomentProjectPlanSecondStartDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            PlanSecondStartDate.length > 0
          ) {
            let elementStart: any = ProjectPlanSecondEndDate[0];
            left = elementStart.offsetLeft + 20;
            line.arrowPosition = -8;
          }
        } else if (
          MomentDatePlusOneDays ==
          MomentProjectPlanSecondStartDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            PlanSecondStartDate.length > 0
          ) {
            let elementStart: any = ProjectPlanFirstEndDate[0];
            left = elementStart.offsetLeft + 40;
            line.arrowTransform = 90;
            line.arrowPosition = -12;
          }
        } else if (
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") <
          MomentProjectPlanSecondStartDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            PlanSecondStartDate.length > 0
          ) {
            let elementStart: any = ProjectPlanSecondEndDate[0];
            left = elementStart.offsetLeft + 20;
            line.arrowPosition = -8;
          }
        } else {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            PlanSecondStartDate.length > 0
          ) {
            let className = ".end-horizonal-line." + lineClass;
            let arrowPosition = $(className).width() - 12;
            let elementStart: any = ProjectPlanFirstEndDate[0];
            left = elementStart.offsetLeft + 40;
            line.arrowTransform = 180;
            line.arrowPosition = arrowPosition;
          }
        }
      } else {
        if (
          MomentDatePlusTwoDaySecond ==
          MomentProjectPlanFirstStartDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            PlanSecondStartDate.length > 0
          ) {
            let elementStart: any = ProjectPlanSecondEndDate[0];
            left = elementStart.offsetLeft + 20;
            line.arrowPosition = -11;
          }
        } else if (
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") >
          MomentProjectPlanSecondStartDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            PlanSecondStartDate.length > 0
          ) {
            let elementStart: any = ProjectPlanSecondEndDate[0];
            left = elementStart.offsetLeft + 20;
            line.arrowPosition = -8;
          }
        } else if (
          MomentDatePlusOneDays ==
          MomentProjectPlanSecondStartDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            PlanSecondStartDate.length > 0
          ) {
            let elementStart: any = ProjectPlanFirstEndDate[0];
            left = elementStart.offsetLeft + 40;
            line.arrowTransform = -90;
            line.arrowPosition = -12;
          }
        } else if (
          MomentProjectPlanSecondStartDate.format("YYYY-MM-DD") >
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            ProjectPlanSecondEndDate.length > 0
          ) {
            let elementStart: any = ProjectPlanSecondEndDate[0];
            left = elementStart.offsetLeft + 20;
            line.arrowTransform = 180;
          }
        } else {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            PlanSecondStartDate.length > 0
          ) {
            let elementStart: any = ProjectPlanFirstEndDate[0];
            left = elementStart.offsetLeft + 40;
            line.arrowTransform = 180;
          }
        }
      }
    } else if (
      line.PositionFirst == "right" &&
      line.PositionSecond == "right"
    ) {
      if (ProjectPlanSecondEndDate.length > 0) {
        let elementStart: any = ProjectPlanSecondEndDate[0];
        left = elementStart.offsetLeft + 20;
      }
    } else {
      if (end >= start) {
        left = end;
      } else {
        left = end;
      }
    }

    return left;
  }

  endLineTopPosition(line) {
    let classNameVerticalLine =
      ".vertical-line.first-" +
      line.ProjectPlanIdFirst +
      "-second-" +
      line.ProjectPlanIdSecond;
    let verticalLine = $(classNameVerticalLine);

    if (line.ProjectPlanIdFirst > line.ProjectPlanIdSecond) {
      if (verticalLine.length > 0) {
        let verticalLineHeight = verticalLine.height();
        return -verticalLineHeight + 11;
      }
    } else {
      if (verticalLine.length > 0) {
        let verticalLineHeight = verticalLine.height();
        return verticalLineHeight + 11;
      }
    }
  }

  endPositionWidth(line) {
    let startedleft = +line.startedleft;
    let endedleft = +line.endedleft;
    let startedWidth = +line.startedWidth;
    let endedWidth = +line.endedWidth;

    var width;

    let start = startedleft + startedWidth;
    let end = endedleft + endedWidth;

    let MomentProjectPlanFirstEndDate = moment(line.ProjectPlanFirstEndDate);

    let MomentProjectPlanSecondStartDate = moment(
      line.ProjectPlanSecondStartDate
    );
    let MomentProjectPlanSecondEndDate = moment(line.ProjectPlanSecondEndDate);

    let classNameProjectPlanFirstEndDate =
      "table-calendar-day-" + line.ProjectPlanFirstEndDate;
    let classNamePlanSecondStartDate =
      "table-calendar-day-" + line.ProjectPlanSecondStartDate;
    let classNameProjectPlanSecondEndDate =
      "table-calendar-day-" + line.ProjectPlanSecondEndDate;

    let ProjectPlanFirstEndDate = document.getElementsByClassName(
      classNameProjectPlanFirstEndDate
    );
    let PlanSecondStartDate = document.getElementsByClassName(
      classNamePlanSecondStartDate
    );
    let ProjectPlanSecondEndDate = document.getElementsByClassName(
      classNameProjectPlanSecondEndDate
    );

    let MomentDateProjectPlanFirstEndDate = cloneDeep(
      MomentProjectPlanFirstEndDate
    );

    let MomentDatePlusOneDays = MomentDateProjectPlanFirstEndDate.add(
      1,
      "days"
    ).format("YYYY-MM-DD");

    if (line.PositionFirst == "left" && line.PositionSecond == "left") {
      if (startedleft >= endedleft) {
        width = 20;
      } else {
        width = Math.abs(startedleft - endedleft) + 20;
      }

      line.arrowPosition = width - 15;
    } else if (
      line.PositionFirst == "right" &&
      line.PositionSecond == "right"
    ) {
      line.arrowPosition = -8;

      if (
        MomentProjectPlanSecondEndDate.format("YYYY-MM-DD") >=
        MomentProjectPlanFirstEndDate.format("YYYY-MM-DD")
      ) {
        width = 20;
      } else {
        if (
          ProjectPlanFirstEndDate.length > 0 &&
          ProjectPlanSecondEndDate.length > 0
        ) {
          let elementStart: any = ProjectPlanFirstEndDate[0];
          let elementEnd: any = ProjectPlanSecondEndDate[0];
          width =
            Math.abs(elementStart.offsetLeft - elementEnd.offsetLeft) + 20;
        }
      }
    } else if (line.PositionFirst == "right" && line.PositionSecond == "left") {
      if (line.ProjectPlanIdFirst > line.ProjectPlanIdSecond) {
        if (
          MomentDatePlusOneDays ==
          MomentProjectPlanSecondStartDate.format("YYYY-MM-DD")
        ) {
          width = 20;
        } else if (
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") ==
          MomentProjectPlanSecondStartDate.format("YYYY-MM-DD")
        ) {
          width = 20;
        } else if (
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") <
          MomentProjectPlanSecondStartDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            PlanSecondStartDate.length > 0
          ) {
            let elementStart: any = ProjectPlanFirstEndDate[0];
            let elementEnd: any = PlanSecondStartDate[0];
            width =
              Math.abs(elementStart.offsetLeft - elementEnd.offsetLeft) - 40;
          }
        } else if (
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") >
          MomentProjectPlanSecondEndDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            ProjectPlanSecondEndDate.length > 0
          ) {
            let elementStart: any = ProjectPlanFirstEndDate[0];
            let elementEnd: any = ProjectPlanSecondEndDate[0];
            width =
              Math.abs(elementStart.offsetLeft - elementEnd.offsetLeft) + 20;
          }
        } else if (
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") >
            MomentProjectPlanSecondStartDate.format("YYYY-MM-DD") &&
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") <
            MomentProjectPlanSecondEndDate.format("YYYY-MM-DD")
        ) {
          width = 20;
        } else if (
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") >
          MomentProjectPlanSecondStartDate.format("YYYY-MM-DD")
        ) {
          width = 20;
        } else if (
          this.array_range(start, 5).includes(endedleft) ||
          this.array_range(endedleft, 5).includes(start)
        ) {
          width = 20;
          line.arrowPosition = -8;
        } else if (
          this.array_range(start + 20, 5).includes(endedleft) ||
          this.array_range(endedleft, 5).includes(start + 20)
        ) {
          line.arrowTop = 0;
          width = 20;
        } else if (start > endedleft && end > start) {
          width = 20;
        } else if (end < start) {
          line.arrowPosition = -8;
          width = Math.abs(start - end + 20);
        } else if (
          this.array_range(start, 5).includes(end) ||
          this.array_range(end, 5).includes(start)
        ) {
          width = 20;
        } else {
          width = Math.abs(endedleft - start) - 20;
        }
      } else {
        if (
          MomentDatePlusOneDays ==
          MomentProjectPlanSecondStartDate.format("YYYY-MM-DD")
        ) {
          width = 20;
        } else if (
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") <
          MomentProjectPlanSecondStartDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            PlanSecondStartDate.length > 0
          ) {
            let elementStart: any = ProjectPlanFirstEndDate[0];
            let elementEnd: any = PlanSecondStartDate[0];
            width =
              Math.abs(elementStart.offsetLeft - elementEnd.offsetLeft) - 40;
          }
        } else if (
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") ==
          MomentProjectPlanSecondStartDate.format("YYYY-MM-DD")
        ) {
          width = 20;
        } else if (
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") >
            MomentProjectPlanSecondStartDate.format("YYYY-MM-DD") &&
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") >
            MomentProjectPlanSecondEndDate.format("YYYY-MM-DD")
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            ProjectPlanSecondEndDate.length > 0
          ) {
            let elementStart: any = ProjectPlanFirstEndDate[0];
            let elementEnd: any = ProjectPlanSecondEndDate[0];
            width =
              Math.abs(elementStart.offsetLeft - elementEnd.offsetLeft) + 20;
          }
        } else if (
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") >
            MomentProjectPlanSecondStartDate.format("YYYY-MM-DD") ||
          MomentProjectPlanFirstEndDate.format("YYYY-MM-DD") <
            MomentProjectPlanSecondEndDate.format("YYYY-MM-DD")
        ) {
          width = 20;
        } else if (
          this.array_range(start, 5).includes(end) ||
          this.array_range(end, 5).includes(start)
        ) {
          width = 20;
          line.arrowPosition = -8;
        } else if (
          this.array_range(start + 20, 5).includes(endedleft) ||
          this.array_range(endedleft, 5).includes(start + 20)
        ) {
          line.arrowTop = -18;
          width = 0;
        } else if (start < end && start < endedleft) {
          width = Math.abs(start - endedleft) - 20;
          line.arrowPosition = width - 15;
          line.arrowPosition = width - 15;
        } else if (start >= endedleft && start < end) {
          width = 20;
        } else if (
          MomentProjectPlanFirstEndDate > MomentProjectPlanSecondEndDate
        ) {
          if (
            ProjectPlanFirstEndDate.length > 0 &&
            ProjectPlanSecondEndDate.length > 0
          ) {
            let elementStart: any = ProjectPlanFirstEndDate[0];
            let elementEnd: any = ProjectPlanSecondEndDate[0];
            width =
              Math.abs(elementStart.offsetLeft - elementEnd.offsetLeft) + 20;
          }
        } else {
          width = Math.abs(start - end) + 20;
        }
      }
    } else if (line.PositionFirst == "left" && line.PositionSecond == "right") {
      if (line.ProjectPlanIdFirst < line.ProjectPlanIdSecond) {
        if (
          this.array_range(startedleft, 5).includes(end) ||
          this.array_range(end, 5).includes(startedleft)
        ) {
          width = Math.abs(start - end) + 20;
        } else if (startedleft < end && end < start) {
          width = Math.abs(start - end) + 20;
        } else if (start <= end) {
          width = 20;
        } else if (startedleft > end + 20) {
          width = Math.abs(end - startedleft) - 20;
        } else if (start >= end && startedleft > end) {
          line.arrowTransform = -90;
          line.arrowTop = -19;
          width = 0;
        } else {
          width = Math.abs(end - startedleft) - 20;
        }
      } else {
        if (
          this.array_range(startedleft, 5).includes(end) ||
          this.array_range(end, 5).includes(startedleft)
        ) {
          width = startedWidth + 20;
          line.arrowPosition = -8;
        } else if (
          this.array_range(end + 20, 5).includes(startedleft) ||
          this.array_range(startedleft, 5).includes(end + 20)
        ) {
          width = 0;
          line.arrowPosition = -12;
          line.arrowTransform = 90;
          line.arrowTop = 0;
        } else if (end > startedleft && end > start) {
          width = 20;
          line.arrowPosition = -8;
        } else if (end >= startedleft) {
          line.arrowPosition = -9;
          width = Math.abs(end - start) + 20;
        } else if (startedleft > end) {
          line.arrowPosition = -9;
          width = Math.abs(end - startedleft) - 20;
        }
      }
    } else {
      if (end >= start) {
        width = 20;
      } else {
        width = Math.abs(start - end) + 20;
      }
    }

    return width;
  }

  setVerticalClass(moment, line, index) {
    let calendarTableClassName = "lineid-" + line.id;
    let className = "moment-line-" + line.id;
    let lineFirst =
      "first-" +
      line.ProjectPlanIdFirst +
      "-" +
      "second-" +
      line.ProjectPlanIdSecond;
    let showChildren = "show-child-" + moment.id;
    let first = "first-" + line.ProjectPlanIdFirst;
    let second = "second-" + line.ProjectPlanIdSecond;
    return (
      calendarTableClassName +
      " " +
      className +
      " " +
      lineFirst +
      " " +
      showChildren +
      " " +
      first +
      " " +
      second
    );
  }

  setVerticalRightClass(moment, line) {
    let calendarTableClassName = "right-lineid-" + line.id;
    let className = "moment-line-" + line.id;
    let lineFirst =
      "first-" +
      line.ProjectPlanIdFirst +
      "-" +
      "second-" +
      line.ProjectPlanIdSecond;
    let showChildren = "show-child-" + moment.id;
    let first = "first-" + line.ProjectPlanIdFirst;
    let second = "second-" + line.ProjectPlanIdSecond;
    return (
      calendarTableClassName +
      " " +
      className +
      " " +
      lineFirst +
      " " +
      showChildren +
      " " +
      first +
      " " +
      second
    );
  }

  setVerticalRightClassEnd(moment, line) {
    let calendarTableClassName = "right-hiddenlineid-" + line.id;
    let className = "moment-line-" + line.id;
    let lineFirst =
      "first-" +
      line.ProjectPlanIdFirst +
      "-" +
      "second-" +
      line.ProjectPlanIdSecond;
    let showChildren = "show-child-" + moment.id;
    let first = "first-" + line.ProjectPlanIdFirst;
    let second = "second-" + line.ProjectPlanIdSecond;
    return (
      calendarTableClassName +
      " " +
      className +
      " " +
      lineFirst +
      " " +
      showChildren +
      " " +
      first +
      " " +
      second
    );
  }

  setLineClass(line, moment) {
    let calendarTableClassName = "line-wrapp-" + line.id;
    let className = "moment-line-" + line.id;
    let parentClass = "parent-" + moment.parent;
    let lineFirst =
      "first-" +
      line.ProjectPlanIdFirst +
      "-" +
      "second-" +
      line.ProjectPlanIdSecond;
    let showChildren = "show-child-" + moment.id;
    let first = "first-" + line.ProjectPlanIdFirst;
    let second = "second-" + line.ProjectPlanIdSecond;
    return (
      calendarTableClassName +
      " " +
      className +
      " " +
      parentClass +
      " " +
      lineFirst +
      " " +
      showChildren +
      " " +
      first +
      " " +
      second
    );
  }

  setClassOnClear(id) {
    let className = "clear-" + id;
    return className;
  }

  setVerticalMiddleRightLeft(line, startVar, endVar, moment) {
    let startedleft = +line.startedleft;
    let endedleft = +line.endedleft;
    let startedWidth = +line.startedWidth;
    let endedWidth = +line.endedWidth;

    let start = startedleft + startedWidth;
    let end = endedleft + endedWidth;

    var left;

    let classNameStarted = ".middle-right-hiddenlineid-" + line.id;
    let elementStarted: any = $(classNameStarted).offset();

    var classNameEnded;
    var elementEnded: any;

    if (line.PositionFirst == "right" && line.PositionSecond == "left") {
      if (line.ProjectPlanIdFirst > line.ProjectPlanIdSecond) {
        if (
          this.array_range(start, 5).includes(endedleft) ||
          this.array_range(endedleft, 5).includes(start)
        ) {
          classNameEnded = ".right-lineid-" + line.id;
          elementEnded = $(classNameEnded).offset();
          left = end + 20;
        } else if (start < endedleft && end >= start) {
          classNameEnded = ".right-lineid-" + line.id;
          elementEnded = $(classNameEnded).offset();
          left = start + 20;
        } else if (end < start) {
          classNameEnded = ".right-lineid-" + line.id;
          elementEnded = $(classNameEnded).offset();
          left = start + 20;
        } else {
          classNameEnded = ".right-lineid-" + line.id;
          elementEnded = $(classNameEnded).offset();
          let width = Math.abs(end - start);
          left = start + width + 20;
        }
      } else {
        if (startedleft < endedleft) {
          left = startedleft + startedWidth + 20;
        } else {
          let width = Math.abs(endedleft + endedWidth - startedleft);
          left = endedleft + endedWidth + width - 20;
        }
      }
    } else if (line.PositionFirst == "left" && line.PositionSecond == "right") {
      if (line.ProjectPlanIdFirst > line.ProjectPlanIdSecond) {
        if (
          this.array_range(startedleft, 5).includes(end) ||
          this.array_range(end, 5).includes(startedleft)
        ) {
          left = start + 20;
          classNameEnded = ".middle-right-startlineid-" + line.id;
          elementEnded = $(classNameEnded).offset();
        } else if (end > startedleft && end > start) {
          left = end + 20;
          classNameEnded = ".middle-right-startlineid-" + line.id;
          elementEnded = $(classNameEnded).offset();
        } else if (end > startedleft) {
          left = start + 20;
          classNameEnded = ".middle-right-startlineid-" + line.id;
          elementEnded = $(classNameEnded).offset();
        } else if (startedleft > end) {
          classNameEnded = ".lineid-" + line.id;
          elementEnded = $(classNameEnded).offset();
          left = startedleft - 20;
        } else {
          classNameEnded = ".right-lineid-" + line.id;
          elementEnded = $(classNameEnded).offset();
        }
      } else {
        if (
          this.array_range(startedleft, 5).includes(end) ||
          this.array_range(end, 5).includes(startedleft)
        ) {
          left = start + 20;
        }
      }
    }

    var topFirst = null;
    var topSecond = null;
    var height = 10;

    if (elementStarted && elementEnded) {
      topFirst = elementStarted["top"];
      topSecond = elementEnded["top"];
    }

    if (line.ProjectPlanIdFirst > line.ProjectPlanIdSecond) {
      height = Math.abs(topFirst - topSecond);
    } else {
      height = 0;
    }

    let style = {
      width: "1px",
      height: height + "px",
      background: "#000000",
      position: "absolute",
      top: "12px",
      left: left + "px",
      "z-index": 500,
    };

    return style;
  }

  getLines() {
    this.momentService
      .getProjectPlanConnections(this.route["params"]["value"]["id"])
      .subscribe((response) => {
        this.lines = [];
        this.lines = response;
        this.showLines = true;
      });
  }

  setRightPositionOfArrow(line) {
    var transform;
    var top;

    if (line.arrowTop == 0 || line.arrowTop) top = line.arrowTop;
    else top = -11;

    if (line.arrowTransform) transform = line.arrowTransform;
    else transform = 0;

    let style = {
      position: "absolute",
      top: top + "px",
      left: line.arrowPosition + "px",
      transform: "rotate(" + transform + "deg)",
    };

    return style;
  }

  setLeftPositionOfArrow(line) {
    var transform;
    var top;
    var left;

    if (line.arrowTop == 0 || line.arrowTop) top = line.arrowTop;
    else top = -11;

    if (line.arrowTransform) transform = line.arrowTransform;
    else transform = 0;

    if (line.arrowPosition) left = line.arrowPosition;
    else left = -8;

    let style = {
      position: "absolute",
      top: top + "px",
      left: left + "px",
      transform: "rotate(" + transform + "deg)",
    };

    return style;
  }

  removeLine(line, index) {
    this.lines.splice(index, 1);
    this.momentService.removeLine(line.id);
  }

  showDeleteButton(line, index, moment) {
    $(".line").removeClass("hover-red");
    $(".clear-icon ").addClass("hide");

    let className = ".moment-line-" + line.id;
    let clearClassName = ".clear-" + line.id;

    $(className).addClass("hover-red");
    $(clearClassName).removeClass("hide");
  }

  private array_range(start, len) {
    var arr = new Array(len);
    for (var i = 0; i < len; i++, start++) {
      arr[i] = start;
    }
    return arr;
  }

  private ensureHiddenChildrenLines() {
    this.moments.forEach((moment) => {
      if (this.lines && this.lines.length > 0) {
        this.lines.forEach((line) => {
          if (
            moment["childrenArray"].length > 0 &&
            moment["childrenArray"].includes(line.ProjectPlanIdFirst) &&
            moment["childrenArray"].length > 0 &&
            moment["childrenArray"].includes(line.ProjectPlanIdSecond)
          ) {
            let className =
              ".first-" +
              line.ProjectPlanIdFirst +
              "-" +
              "second-" +
              line.ProjectPlanIdSecond;
            $(className).addClass("hide");
          }
        });
      }
    });
  }

  private ensureHiddenChildrenAfterClick(moments) {
    moments.forEach((moment) => {
      this.lines.forEach((line) => {
        if (
          moment["childrenArray"].length > 0 &&
          moment["childrenArray"].includes(line.ProjectPlanIdFirst) &&
          moment["childrenArray"].length > 0 &&
          moment["childrenArray"].includes(line.ProjectPlanIdSecond)
        ) {
          let className =
            ".first-" +
            line.ProjectPlanIdFirst +
            "-" +
            "second-" +
            line.ProjectPlanIdSecond;
          $(className).addClass("hide");
        }
      });
    });
  }

  private showChildrenLines(moments) {
    moments.forEach((moment) => {
      this.lines.forEach((line) => {
        if (
          moment["childrenArray"].length > 0 &&
          moment["childrenArray"].includes(line.ProjectPlanIdFirst) &&
          moment["childrenArray"].length > 0 &&
          moment["childrenArray"].includes(line.ProjectPlanIdSecond)
        ) {
          let className =
            ".first-" +
            line.ProjectPlanIdFirst +
            "-" +
            "second-" +
            line.ProjectPlanIdSecond;
          $(className).removeClass("hide");
        }
      });
    });
  }

  private ensureProjectLineDuration() {
    let startDate = this.project["StartDate"].split(" ")[0];
    let endDate = this.project["EndDate"].split(" ")[0];
    let classStartDateName = "table-calendar-day-" + startDate;
    let classEndDateName = "table-calendar-day-" + endDate;

    let calendarStartedYearlastMonthIndex =
      this.calendar[0]["months"].length - 1;
    let calendarStartedYearlastMonth =
      this.calendar[0]["months"][calendarStartedYearlastMonthIndex];

    let startDateName = document.getElementsByClassName(classStartDateName);
    let endDateName = document.getElementsByClassName(classEndDateName);

    let momentCalendarStartedYearlastMonthDay = moment(
      calendarStartedYearlastMonth["days"][0]["date"]
    );
    let momentStartDate = moment(startDate);
    let momentEndDate = moment(endDate);

    if (startDateName.length > 0) {
      let element: any = document.getElementsByClassName(classStartDateName)[0];
      this.projectDays = this.numberOfDays(startDate, endDate);
      this.projectOfssetLeft = element.offsetLeft;
      this.projectWidth = this.projectDays * 20;
      this.allowRender = true;
      $(".project-timeline").removeClass("border-radius-left-none");
      $(".project-timeline").removeClass("displayNone");
    } else if (endDateName.length > 0) {
      let start = this.calendar[0]["months"][0]["days"][0]["date"];
      let className = "table-calendar-day-" + start;

      if (
        document.getElementsByClassName(className) &&
        document.getElementsByClassName(className)[0]
      ) {
        let element: any = document.getElementsByClassName(className)[0];
        this.projectDays = this.numberOfDays(start, endDate);
        this.projectOfssetLeft = element.offsetLeft;
        this.projectWidth = this.projectDays * 20;
        this.allowRender = true;
        $(".project-timeline").addClass("border-radius-left-none");
        $(".project-timeline").removeClass("displayNone");
      }
    } else if (
      (momentCalendarStartedYearlastMonthDay > momentStartDate &&
        momentCalendarStartedYearlastMonthDay > momentEndDate) ||
      (momentCalendarStartedYearlastMonthDay < momentStartDate &&
        momentCalendarStartedYearlastMonthDay < momentEndDate)
    ) {
      /* kalendar izvan start i end date */

      $(".project-timeline").addClass("displayNone");
      this.allowRender = false;
      return false;
    }
  }

  private numberOfDays(firstDate, secondDate) {
    var startDay = new Date(firstDate);
    var endDay = new Date(secondDate);
    var millisecondsPerDay = 1000 * 60 * 60 * 24;
    var millisBetween = startDay.getTime() - endDay.getTime();
    var days = Math.abs(millisBetween / millisecondsPerDay) + 1;
    return days;
  }

  setProjectLineDuration() {
    this.ensureProjectLineDuration();

    let style = {
      left: this.projectOfssetLeft + "px",
      width: this.projectWidth + "px",
      background: this.project.Color,
    };
    return style;
  }

  allowSelectElements() {
    this.allowSelect = !this.allowSelect;
    this.groupOfMoments = [];
  }

  setMomentToArray(moment) {
    if (!this.allowSelect) {
      return;
    }

    let classIdentification = ".moment-" + moment.id;

    if ($(classIdentification).hasClass("moment-selected"))
      $(classIdentification).removeClass("moment-selected");
    else $(classIdentification).addClass("moment-selected");

    let allowPushInToGroup: boolean = true;

    if (this.groupOfMoments.length > 0) {
      this.groupOfMoments.forEach((object, index) => {
        if (object.id == moment.id) {
          this.groupOfMoments.splice(index, 1);
          allowPushInToGroup = false;
        } else {
          allowPushInToGroup = true;
        }
      });
    }

    if (allowPushInToGroup) this.groupOfMoments.push(moment);
  }

  openModalGroup() {
    if (!this.allowSelect) {
      return;
    }

    this.allowGroup = !this.allowGroup;
    this.projectModal = false;

    let object = {
      Description: "Group",
      ProjectId: this.project.id,
      Color: this.project["Color"],
      width: this.projectWidth,
      oldWidth: this.projectWidth,
      top: 5,
      bottom: 5,
      left: this.projectOfssetLeft,
      oldLeft: this.projectOfssetLeft,
      Days: this.projectDays,
      oldDays: this.projectDays,
      StartDate: this.project["StartDate"].split(" ")[0],
      EndDate: this.project["EndDate"].split(" ")[0],
      momentsArr: this.groupOfMoments,
    };

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.data = { object: object };

    this.dialog
      .open(ModalGroupComponent, diaolgConfig)
      .afterClosed()
      .subscribe((object) => {
        this.getProjectMoments();
      });
  }

  goBack() {
    this.router.navigate(["/projects/view/" + this.project.id]);
    this.projectsService.setCurrentTab(7);
  }

  getProjectMoments() {
    this.projectsService
      .getProjectWithMoments(this.route.snapshot.params["id"])
      .then((response) => {
        this.moments = response;
      });
  }

  setActiveSelectClass() {
    var className;
    if (this.allowSelect) className = "icon-active";
    return className;
  }

  setActiveClassToConnectEelemnt() {
    var className;
    if (this.allowConnectEl) className = "icon-active";
    return className;
  }

  setActiveClassToResizeEelemnt() {
    var className;
    if (this.allowResizeEl) className = "icon-active";
    return className;
  }

  setActiveClassToMoveEelemnt() {
    var className;
    if (this.allowMoveEl) className = "icon-active";
    return className;
  }

  setActiveClassToGroupButton() {
    var className;
    if (this.allowGroup) className = "icon-active";
    return className;
  }

  openModalScheduleCoworkers(event) {
    let target = event["target"]["className"];
    let className = "project-timeline";
    let classNameFromBigin = "project-timeline border-radius-left-none";

    this.allowConnectEl = false;
    this.allowMoveEl = false;
    this.showCanvas = false;
    this.allowResizeEl = false;

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";

    if (target == className || target == classNameFromBigin) {
      diaolgConfig.data = {
        project: this.project,
        index: null,
        arbitraryDates: this.arbitraryDates,
      };
      this.daysNumber = null;
      this.startedDay = null;
      this.startedPositionAfterMove = null;
      this.projectModal = false;
      this.dialog
        .open(ScheduleCoworkersComponent, diaolgConfig)
        .afterClosed()
        .subscribe((status) => {
          this.projectModal = false;

          if (status) this.getProject();
        });
    }
  }

  openProjectModal(projectMomentIndex) {
    this.projectModalMomentIndex = projectMomentIndex;
    this.projectModal = true;
  }

  openEditModalScheduleCoworkers(projectMomentIndex, object) {
    this.allowConnectEl = false;
    this.allowMoveEl = false;
    this.showCanvas = false;
    this.allowResizeEl = false;
    this.projectModalMomentIndex = null;

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";

    diaolgConfig.data = {
      project: this.project,
      index: projectMomentIndex,
      arbitraryDates: this.arbitraryDates,
      coworker: object,
    };
    this.daysNumber = null;
    this.startedDay = null;
    this.startedPositionAfterMove = null;
    this.dialog
      .open(EditScheduleCoworkersComponent, diaolgConfig)
      .afterClosed()
      .subscribe((status) => {
        this.projectModal = false;

        if (status) this.getProject();
      });
  }

  private getProject() {
    this.projectsService
      .getProject(this.route.snapshot.params["id"])
      .then((response) => {
        this.project = response;
      });
  }

  setBackgroundOnProjectModal(object) {
    let style = {
      "background-color": object["Color"],
    };
    return style;
  }

  updateData(object, numberOfCoworkers) {
    numberOfCoworkers.blur();
    object["NumberOfCoworkers"] = numberOfCoworkers.value;

    this.projectsService.updateNumberOfCoworkers(object).then((response) => {
      if (response["status"]) {
        this.projectModal = false;
        this.toastr.info(
          this.translate.instant(
            "You have successfully updated number of coworkers."
          ),
          this.translate.instant("Info")
        );
      }
    });
  }

  selectText(numberOfCoworkers) {
    numberOfCoworkers.select();
  }

  loadMore() {
    let lastIndex = this.calendar.length - 1;
    let lastMonthIndex = this.calendar[lastIndex].months.length - 1;
    let month = this.calendar[lastIndex].months[lastMonthIndex];

    let lastYear;

    if (month["monthIndex"] < 11) {
      lastYear = this.calendar[lastIndex].year;
      this.calendar.splice(2, 1);
    } else {
      lastYear = this.calendar[lastIndex].year + 1;
    }

    this.getNextYear(lastYear);
  }

  getNextYear(year) {
    let months = this.getMonts(year);
    let object = { year, months };
    this.calendar.push(object);
    this.calendar.splice(0, 1);
  }

  loadPreviousYear() {
    let previousYear;
    let monthsLength = this.calendar[0].months.length - 1;

    if (monthsLength < 11) {
      previousYear = this.calendar[0].year;
      this.calendar.splice(0, 1);
    } else {
      previousYear = this.calendar[0].year - 1;
    }

    this.getPreviousYear(previousYear);
    this.timlineBodyWrapperWidth += 365 * 20;
  }

  getPreviousYear(year) {
    let months = this.getMonts(year);
    let object = { year, months };
    this.calendar.unshift(object);
    this.initializeStartWidth();
    let calLength = this.calendar.length - 1;
    this.calendar.splice(calLength, 1);
  }

  setWrapperWidth() {
    this.initializeStartWidth();

    return {
      width: this.timlineBodyWrapperWidth + "px",
    };
  }

  initializeStartWidth() {
    let arrayOfYears = $(".calendar-content-row-year");
    let offsetWidth = [];

    for (var i = arrayOfYears.length - 1; i >= 0; i--) {
      offsetWidth.push(arrayOfYears[i].offsetWidth);
    }

    let sum = offsetWidth.reduce((sum, x) => sum + x);
    this.timlineBodyWrapperWidth = sum;
  }

  onScroll(event) {
    let scrollLeft = event["target"]["scrollLeft"];
    let scrollWidth = event["target"]["scrollWidth"];

    if (scrollLeft == 0) {
      this.loadPreviousYear();
      this.caliculateOffsetWidth();
      this.findActiveMonth();
    } else if (scrollLeft > scrollWidth - 1800) {
      this.loadMore();
    }
  }

  editMomentModal(moment, index) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.data = { project: this.project, moment: moment };
    this.daysNumber = null;
    this.startedDay = null;
    this.startedPositionAfterMove = null;
    this.projectModal = false;

    this.dialog
      .open(EditPlannerComponent, diaolgConfig)
      .afterClosed()
      .subscribe((object) => {});
  }

  deleteProjectPlan(moment, index) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe(async (response) => {
        if (response.result) {
          this.momentService.deleteProjectPlan(moment).subscribe((response) => {
            if (response["status"]) this.moments.splice(index, 1);
            this.toastr.success(
              this.translate.instant("Plan deleted."),
              this.translate.instant("Success")
            );
          });
        }
      });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.moments, event.previousIndex, event.currentIndex);
    this.projectsService.sortProjectWithMoments(this.moments);
  }
}
