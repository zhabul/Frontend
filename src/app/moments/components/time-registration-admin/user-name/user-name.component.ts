import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { GetUsersStore } from "../calendar-header/get-users-store.service";
import * as moment from "moment";
import { NextModalService } from "../next-modal.service";
import { Subscription } from "rxjs";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { UserNameService } from "./user-name.service";

@Component({
  selector: "app-user-name",
  templateUrl: "./user-name.component.html",
  styleUrls: ["./user-name.component.css"],
})
export class UserNameComponent implements OnInit {
  @Input("queryParams") queryParams;

  public calendar = [];
  @Input("calendar") set setCalendar(value) {
    if (value !== this.calendar) {
      this.calendar = value;
    }
  }

  @Input("user") set setUser(value) {
    if (this.user !== value) {
      this.user = value;
      this.user_number = this.user.RowNumber;
    }
  }

  public user;
  public userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  @Input("users") users;
  @Input("index") index;
  _calendarStyle: any;
  get calendarStyle(): any {
    return this._calendarStyle;
  }
  @Input("calendarStyle") set calendarStyle(value: any) {
    if (value !== this.calendarStyle) {
      this._calendarStyle = value;
      this.setComputedStyles();
    }
  }
  @Input("userBoundaries") set setUserBoundaries(newBoundaries) {
    if (newBoundaries !== this.userBoundaries) {
      this.userBoundaries = newBoundaries;
    }
  }

  public calendarBoundaries = {
    nrOfWeeks: 34,
    start: 0,
    end: 20,
  };

  @Input("calendarBoundaries") set setCalendarBoundaries(value) {
    if (value !== this.calendarBoundaries) {
      this.calendarBoundaries = value;
    }
  }

  public currentDate;

  @Input("currentDate") set setCurrentDate(value) {
    this.currentDate = value;
  }

  @Input("openModalHook") openModalHook;

  public userBoundaries = {
    start: 0,
    end: 0,
  };

  public computedStyle = {
    calendarWrapperStyle: {},
    userNameStyle: {},
    generateStyle: {},
  };

  public monthly_time = "0h";
  public monthy_mileage = "";
  public user_number = 0;
  public paramsSub;
  public fullName = "";
  public seenAllMessagesSub: Subscription | undefined;

  public overlayUser = false;
  @Input("RowNumber") set setActive(value) {
    if (value !== -1 && value !== this.user_number - 1) {
      this.overlayUser = true;
    } else {
      this.overlayUser = false;
    }
  }
  @Output() activeUserEmitter = new EventEmitter<any>();

  @Output() setActiveHook = new EventEmitter<any>();
  @Output() detectChanges = new EventEmitter<any>();

  constructor(
    private router: Router,
    private getUsersStore: GetUsersStore,
    private nextModalService: NextModalService,
    private dialog: MatDialog,
    private userNameService: UserNameService
  ) {}

  ngOnInit() {
    this.setComputedStyles();
    this.setUserTotals();
    this.user_number = this.user.RowNumber;
    this.fullName = `${this.user.firstName} ${this.user.lastName}`.trim();
    this.openUnseenMessage();
    this.nextButtonInModal();
    this.getFirstDateOfMonth();
    this.generateLink();
  }

  openUnseenMessage() {
    const { s, date } = this.queryParams;
    if (s !== this.fullName) return;
    if (
      !this.user.notSeenWeeks[this.nextModalService.nextModalIndex.getValue()]
    )
      return;
    const firstNotSeenWeek =
      this.user.notSeenWeeks[this.nextModalService.nextModalIndex.getValue()];
    const week = firstNotSeenWeek.week;
    const year = firstNotSeenWeek.year;
    const date_ = this.constructDateFromWeek(week, year);

    if (date_ === date && this.openModalHook === true) {
      this.emitOpenWeekModal(null, 0);
    }
  }

  setUserTotals() {
    this.monthly_time = this.user.monthly_time
      ? this.user.monthly_time + "h"
      : "0h";
    this.monthy_mileage = this.user.monthly_mileage;
  }

  generateStyle() {
    this.computedStyle.generateStyle = {
      height: this.calendarStyle.rowHeight + "px",
      fontSize: this.calendarStyle.fontSizeMedium,
      gridTemplateColumns: this.calendarStyle.userColumnGrid,
      borderBottom: "1px solid #707070",
    };
  }

  setUserNameStyle() {
    this.computedStyle.userNameStyle = {
      height: this.calendarStyle.rowHeight + "px",
      width: this.calendarStyle.userWidth + "px",
      fontSize: this.calendarStyle.fontSizeMedium,
    };
  }

  userBoundaryCondition(index) {
    return (
      index >= this.userBoundaries.start && index <= this.userBoundaries.end
    );
  }

  setComputedStyles() {
    this.setUserNameStyle();
    this.generateStyle();
  }

  public firstDateOfMonth = '';
  getFirstDateOfMonth() {
    const firstDateOfCalendar = moment(new Date(this.currentDate));
    let flag = true;
    while (flag) {
      const day = Number(firstDateOfCalendar.format("DD"));
      if (day === 1) {
        flag = false;
        break;
      }
      firstDateOfCalendar.subtract(1, "days");
    }
    this.firstDateOfMonth = firstDateOfCalendar.format("YYYY-MM-DD");
  }

  public link = '';
  generateLink() {
    this.link = `/timesheets/time-registration-admin/user-detail/${this.user.id}/${this.firstDateOfMonth}`
  }

    goToUserDetails() {

        let date:any;
        if((typeof this.currentDate) == 'object') {
            date = this.currentDate.format("YYYY-MM-01");
        }else {
            date = moment(new Date(this.currentDate));
            date = date.format("YYYY-MM-01");
        }

        this.router.navigate(
        [
            "timesheets/time-registration-admin/user-detail",
            this.user.id,
            // this.getFirstDateOfMonth(),
            date
        ],
        {
            queryParams: this.queryParams,
        }
        );
    }

  constructDateFromWeek(week, year) {
    return moment().day("Monday").week(week).year(year).format("YYYY-MM-DD");
  }

  navigateToMessageDate(firstNotSeenWeek) {
    const week = firstNotSeenWeek.week;
    const year = firstNotSeenWeek.year;
    const date = this.constructDateFromWeek(week, year);

    this.queryParams = {
      ...this.queryParams,
      s: this.fullName,
      date: date,
    };

    this.getUsersStore.setParams(this.queryParams);
  }

  isWeekInRange(weekDate) {
    const calLen = this.calendar.length - 1;
    const firstDate = moment(this.calendar[0].date, "YYYY-MM-DD");
    const lastDate = moment(this.calendar[calLen].date, "YYYY-MM-DD");

    return weekDate.isBetween(firstDate, lastDate);
  }

  emitOpenWeekModal(event = null, index) {
    event?.stopPropagation();
    const firstNotSeenWeek =
      this.user.notSeenWeeks[this.nextModalService.nextModalIndex.getValue()];
    const week = firstNotSeenWeek.week;
    const weekDate = moment().year(firstNotSeenWeek.year).week(week);
    const messageType = firstNotSeenWeek.type;
    const isWeekInRange = this.isWeekInRange(weekDate);

    if (!isWeekInRange) {
      this.navigateToMessageDate(firstNotSeenWeek);
      return;
    }

    let openDay: any = "";
    for (let i = 0; i < this.calendar.length; i++) {
      const day = this.calendar[i];
      const date = day.date;
      if (day.isoWeek == week) {
        if (!this.user.absences[date] && messageType == "absence") {
          continue;
        }
        openDay = day;
        break;
      }
    }

    if (openDay !== "") {
      this.setActiveHook.emit(false);
      this.activeUserEmitter.emit({
        index: this.index,
        day: openDay,
        currentIndex: index,
      });
    }
  }

  nextModalSub: Subscription | undefined;
  nextButtonInModal() {
    this.nextModalSub = this.nextModalService.clickedOnNextButton$.subscribe({
      next: (userId) => {
        if (userId == this.user.id) {
          this.emitOpenWeekModal(null, 0);
        }
      },
    });
  }

  onMarkAllAsRead() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = "mat-dialog-confirmation";
    this.seenAllMessagesSub = this.dialog
      .open(ConfirmationModalComponent, dialogConfig)
      .afterClosed()
      .subscribe({
        next: (response) => {
          if (!response.result) return;
          this.seenAllUserMessages(this.user.id)
        },
      });
  }

  seenAllUserMessagesSub: Subscription | undefined;
  seenAllUserMessages(userId: number) {
    this.seenAllUserMessagesSub = this.userNameService.seenAllUserMessages(userId).subscribe({
      next: _ => {
        this.user.notSeenWeeks = [];
        this.user.messageCount = 0;
        this.detectChanges.emit(null);  // pogledati hoce li ovo raditi
      }
    });
  }

  ngOnDestroy() {
    this.paramsSub?.unsubscribe();
    this.nextModalSub?.unsubscribe();
    this.seenAllMessagesSub?.unsubscribe();
    this.seenAllUserMessagesSub?.unsubscribe();
  }
}
