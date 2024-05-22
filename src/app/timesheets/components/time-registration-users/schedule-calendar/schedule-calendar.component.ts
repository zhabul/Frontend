import {
  Component,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { interval, Subscription } from "rxjs";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { GeneralsService } from "src/app/core/services/generals.service";
import { ActivatedRoute } from "@angular/router";
import { environment } from "src/environments/environment";
///import { ToastrService } from "ngx-toastr";
import { SettingsService } from "src/app/core/services/settings.service";
import { TranslateService } from "@ngx-translate/core";
import * as moment from "moment";
declare var $: any;

@Component({
  selector: "app-schedule-calendar",
  templateUrl: "./schedule-calendar.component.html",
  styleUrls: [
    "./schedule-calendar.component.css"
  ],
})
export class ScheduleCalendarComponent
  implements OnInit, OnDestroy
{
  public roles: any[];
  public enableTimeButton = false;
  public showAbsenceButton = false;
  public project = null;
  public userDetails: any;
  public hours: any[];
  public subscription: Subscription;
  public disabledDateForRaportTime: any[] = [];
  public calendarIsVisible = false;
  public publicHolidays = {};
  public activeDateIndex = 0;
  notSeenMessageSub;
  messageCount = 0;
  public count = 0;

  constructor(
    private timeRegistrationService: TimeRegistrationService,
    private route: ActivatedRoute,
    private generalsService: GeneralsService,
    public translate: TranslateService,
    private settingsService: SettingsService,
    //private toastr: ToastrService
  ) {

  }

  ngOnInit() {
    this.setPublicHolidaysObject();
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    this.roles = this.route.snapshot.data["roles"]["data"];
    this.disabledDateForRaportTime =
      this.route.snapshot.data["disabledDateForRaportTime"]["users"];

    this.getWorkdays();
    this.setProjects();
    this.generateDateRange(this.currentDate);
    const source = interval(5000);
    this.subscription = source.subscribe((val) => {
      if (environment.production) {
        this.getHoursFromServer();
        this.getAdministratorRoles();
      }
    });
    this.getAdministratorRoles();
    this.clearStorage();
  }
  public days = [];
  getWorkdays() {
    this.settingsService.getWorkWeek2().subscribe({
      next: (response) => {
        if (response.status) {
          this.days = response.data;
        }
      }
    });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.notSeenMessageSub) {
      this.notSeenMessageSub.unsubscribe();
    }
  }

  setProjects() {
    const projects = this.route.snapshot.data["project"]["data"];
    if (projects && projects.length > 0) {
      this.project = projects[0];
    };
  }

  public currentDate = new Date();
  public selectedDate = null;
  public selectedIndex = null;
  public scheduleCalendar = [];
  public visibleCalendar = [];
  generateDateRange(date) {
    const currentDate = moment(date).format('YYYY-MM-DD');
    const startDate = moment(date).subtract(2, 'months').format('YYYY-MM-DD');
    const endDate = moment(date).add(2, 'months').format('YYYY-MM-DD');
    this.scheduleCalendar = this.getRange(startDate, endDate, 'days');
    this.currentDateSetter(currentDate);
  }

  resetSelectedDate() {
    this.selectedDate = null;
    this.selectedIndex = null;
    this.setButtonVisbility();
  }

  setActiveDate($event) {
    this.selectedDate = $event.date;
    this.currentDateSetter(this.selectedDate);
    this.prependMonth();
    this.appendMonth();
    localStorage.setItem("timeRegistrationData", this.selectedDate);
  }

  appendMonth() {
    if ((this.visibleCalendar.length) === 11) return;
    this.runAppendMonth();
  }

  runAppendMonth() {
    const schedLen = this.scheduleCalendar.length - 1;
    const date = this.scheduleCalendar[schedLen].date;
    const startDate = moment(date).add(1, 'days').format('YYYY-MM-DD');
    const endDate = moment(startDate).add(1, 'months').format('YYYY-MM-DD');
    const nextDaysChunk = this.getRange(startDate, endDate, 'days');
    this.scheduleCalendar = [ ...this.scheduleCalendar, ...nextDaysChunk ];
  }

  prependMonth() {
    if ((this.visibleCalendar.length) === 11) return;
    this.runPrependMonth();
  }

  runPrependMonth() {

    const date = this.scheduleCalendar[0].date;
    const startDate = moment(date).subtract(1, 'months').format('YYYY-MM-DD');
    const endDate = moment(date).subtract(1, 'days').format('YYYY-MM-DD');
    const prevDaysChunk = this.getRange(startDate, endDate, 'days');
    this.scheduleCalendar = [ ...prevDaysChunk, ...this.scheduleCalendar ];
    this.setSelectedIndex(this.selectedIndex + (prevDaysChunk.length));
  }

  private startIndexValue = 4;
  private endIndexValue = 7;

  currentDateSetter(currentDate) {
    const currentDateIndex = this.findCurrentDateIndex(currentDate);
    this.setSelectedIndex(currentDateIndex);
    let start = currentDateIndex - this.startIndexValue;
    start = this.groundValue(start);
    const end = currentDateIndex + this.endIndexValue;
    this.sliceVisibleCalendar(start, end);
  }

  public groundValue(value) {
    return value < 0 ? 0 : value
  }

  sliceBySelectedIndex() {
    let start = this.selectedIndex - this.startIndexValue;
      start = this.groundValue(start);
    const end = this.selectedIndex + this.endIndexValue;
    this.sliceVisibleCalendar(start, end);
  }

  public translateValue = 0;
  public calendarBodyStyle = { transform: 'translateX(0)', transition: '' };
  public displacing = false;
  async nextDate() {
    if (this.displacing) return;
    this.displacing = true;
    await this.displaceCalendar(-150);
    this.setSelectedIndex(this.selectedIndex + 1);
    this.appendMonth();
    this.sliceBySelectedIndex();
    this.displacing = false;
  }

  async displaceCalendar(by) {
    this.initTranslate(by);
    this.initTransform();
    await this.sleep(250);
    this.resetCalendarBodyStyle();
  }

  initTranslate(by) {
    this.translateValue = this.translateValue + by;
  }

  initTransform() {
    this.calendarBodyStyle = { ...this.calendarBodyStyle, transition: 'transform 250ms ease-in-out', transform: `translateX(${this.translateValue}px)` };
  }

  resetCalendarBodyStyle() {
    this.translateValue = 0;
    this.calendarBodyStyle = { ...this.calendarBodyStyle, transition: '', transform: `translateX(${this.translateValue}px)` };
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async previousDate() {

    if (this.displacing) return;
    this.displacing = true;
    await this.displaceCalendar(150);
    this.setSelectedIndex(this.selectedIndex - 1);
    this.prependMonth();
    this.sliceBySelectedIndex();
    this.displacing = false;
  }

  getCurrentSelectedDay() {
    return this.visibleCalendar[4];
  }

  doubleAppendMonth() {
    this.runAppendMonth();
    this.runAppendMonth();
  }

  nextMonth() {
    const currentDay = this.getCurrentSelectedDay();
    const date = currentDay.date;
    const calLength = this.scheduleCalendar.length - 9;
    const nextMonthDate = moment(date).add(1, 'months').format('YYYY-MM-DD');
    let nextMonthIndex = this.findMonthIndex(nextMonthDate);
    if (nextMonthIndex === -1 || nextMonthIndex > calLength) {
      this.doubleAppendMonth();
      nextMonthIndex = this.findMonthIndex(nextMonthDate);
    }
    this.resetSelectedDate();
    this.setSelectedIndex(nextMonthIndex);
    this.sliceBySelectedIndex();
  }

  findMonthIndex(date) {
    return this.scheduleCalendar.findIndex((day)=>{
      return day.date === date;
    });
  }

  doublePrependMonth() {
    this.runPrependMonth();
    this.runPrependMonth();
  }

  previousMonth() {
    const currentDay = this.getCurrentSelectedDay();
    const date = currentDay.date;
    const nextMonthDate = moment(date).subtract(1, 'months').format('YYYY-MM-DD');
    let previousMonthIndex = this.findMonthIndex(nextMonthDate);
    if (previousMonthIndex === -1 || previousMonthIndex === 0) {
      this.doublePrependMonth();
      previousMonthIndex = this.findMonthIndex(nextMonthDate);
    }
    this.resetSelectedDate();
    this.setSelectedIndex(previousMonthIndex);
    this.sliceBySelectedIndex();
  }

  sliceVisibleCalendar(start, end) {
    this.visibleCalendar = this.scheduleCalendar.slice(start, end);
  }

  findCurrentDateIndex(date) {
    return this.scheduleCalendar.findIndex((cal)=>{
      return date === cal.date;
    })
  }

  getRange(startDate, endDate, type) {
    const today = moment();
    const fromDate = moment(startDate);
    const toDate = moment(endDate);
    const diff = toDate.diff(fromDate, type);
    const range = [];
    for (let i = 0; i <= diff; i++) {
      const day = moment(startDate).add(i, type);
      const dayName = day.format('dddd').substring(0,3);
      const future = today.diff(day) < 0;
      const date = day.format('YYYY-MM-DD');
      const dayObject = {
        date: date,
        year: day.format('YYYY'),
        month: day.format('MM'),
        monthName: day.format('MMMM'),
        day: day.format('DD'),
        dayName: dayName,
        week: day.isoWeek(),
        isoWeekday: day.isoWeekday(),
        index: i,
        color: this.setDayColor(dayName, future),
        future: future,
        publicHoliday: this.publicHolidays[date]
      };
      range.push(dayObject);
    }

    return range;
  }

  setDayColor(dayName, future) {
    return dayName === 'Sat' || dayName === 'Sun' ? '#DD89A7' : (future ? 'var(--border-color)' : '#BFE29C');
  }

  clearStorage() {
    localStorage.removeItem("calendarSlider");
    localStorage.removeItem("calendarSliderVersion");
    localStorage.removeItem("calendar");
    localStorage.removeItem("calendarVersion");
    localStorage.removeItem("users-detail-calendar");
  }

  setPublicHolidaysObject() {
    const holidays = this.route.snapshot.data["publicHolidays"]["data"];
    holidays.forEach((day) => {
      this.publicHolidays[day] = true;
    });
  }

  setSelectedIndex(index) {
    this.selectedIndex = index;
    this.setButtonVisbility();
  }

  setButtonVisbility() {
    this.setTimeButtonVisibility();
    this.setAbsenceButtonVisibility();
  }

  public today = moment().format("YYYY-MM-DD");

  findDayByCurrentDate() {
    return this.scheduleCalendar.find((day)=>{
      return day.date === this.selectedDate;
    });
  }

  setTimeButton(value) {
    this.enableTimeButton = value;
  }

  setTimeButtonVisibility() {
    const weekDay = this.findDayByCurrentDate();
    if (!weekDay) {
      this.setTimeButton(false);
      return;
    };
    this.setTimeButton(true);
    const { date, dayName, future } = weekDay;
    const isNotWorkday = this.dayIsNotWorkday(dayName);

    if (this.hours && this.hours[0] == "allow-all-time") {
      return;
    }

    const dateExists = this.dateExists(date);
    if (this.hours && this.hours[0] == "allow-for-responsible-persons" && dateExists) {
      return;
    }

    if (isNotWorkday) {
      this.setTimeButton(false);
      return;
    }

    const dateLocked = this.dateLocked(date);

    if (dateLocked) {
      this.setTimeButton(false);
      return;
    }

    if (future) {
      this.setTimeButton(false);
      return;
    }

    if (!dateExists) {
      this.setTimeButton(false);
      return;
    }
  }

  dayIsNotWorkday(dayName) {
    return !this.days.filter((day)=>{
      return day.short_name == dayName && day.type == 1;
    }).length;
  }

  dateExists(date) {
    const dates = this.roles["dates"];
    if (dates.length > 0 && dates.includes(date)) return true;
    else return false;
  }

  dateLocked(date) {
    return this.disabledDateForRaportTime.includes(date);
  }

  setAbsenceButton(value) {
    this.showAbsenceButton = value;
  }

  setAbsenceButtonVisibility() {
    const weekDay = this.findDayByCurrentDate();
    if (!weekDay) {
      this.setAbsenceButton(false);
      return;
    };
    const { isoWeekday, date } = weekDay;
    this.setAbsenceButton(true);

    if (this.hours && this.hours[0] == "allow-all-time") {
      return;
    }

    if (isoWeekday == 6 || isoWeekday == 7) {
      this.setAbsenceButton(false);
      return;
    }

    const dateExists = this.dateExists(date);
    if (dateExists) {
      return;
    }
  }

  getHoursFromServer() {
    this.generalsService
      .getGeneralHours(1)
      .subscribe((response: any) => {
        this.hours = response;
      });
  }
  getAdministratorRoles() {
    this.timeRegistrationService.getUserRoles().subscribe((response) => {
      if (response["status"]) this.roles["dates"] = response["data"]["dates"];
    });
  }

}
