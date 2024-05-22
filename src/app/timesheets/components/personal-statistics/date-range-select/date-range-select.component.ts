import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import * as moment from "moment";

declare var $;

@Component({
  selector: 'app-date-range-select',
  templateUrl: './date-range-select.component.html',
  styleUrls: ['./date-range-select.component.css', '../../time-registration-admin/user-details-admin/user-details-header.css']
})
export class DateRangeSelectComponent implements OnInit {

  @Output('emitRange') emitRange:EventEmitter<any> = new EventEmitter();

  constructor(
          private route: ActivatedRoute,
          private router: Router
    ) { }

  ngOnInit(): void {
    this.initComponentUserInfo();
    this.getQueryParams();
  }

  ngAfterViewInit() {
    this.initDatePickers();
  }

  ngOnDestroy() {
    this.unsubFromQueryParams();
  }

  emitDateRange() {
    this.emitRange.emit({
      startDate: this.startDate.date,
      endDate: this.endDate.date
    });
    this.setQueryParams();
  }

  /* user details  */
  public userDetails = { language: 'en' };
  setUserDetails() {
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  }
  /* user details  */

  /* component language */
  public language;
  setComponentLanguage() {
    this.language = this.userDetails.language;
  }

  initComponentUserInfo() {
    this.setUserDetails();
    this.setComponentLanguage();
  }
  /* component language */

  /* queryParams  */
  public queryParamsSub;
  public startDate;
  public endDate;
  getQueryParams() {
    this.queryParamsSub = this.route.queryParams.subscribe(this.queryParamsHandler.bind(this));
  }
  queryParamsHandler(params) {
    const currentDate = moment();
    const sDate = this.setDate(params.sdate, currentDate);
    const eDate = this.setDate(params.edate, currentDate);
    this.startDate =  this.formatDate(moment(sDate).startOf('month'));
    this.sanitizeEndDate(sDate, eDate);
    this.emitDateRange();
  }
  sanitizeEndDate(sDate, eDate) {
    if (sDate < eDate) {
      this.endDate = this.formatDate(moment(eDate).endOf('month'));
    } else {
      this.endDate = this.formatDate(moment(sDate).add(1, 'months'));
    }
  }
  setDate(date, currentDate) {
    return date ? new Date(moment(date).format()) : currentDate;
  }
  unsubFromQueryParams() {
    if (this.queryParamsSub) {
      this.queryParamsSub.unsubscribe();
    }
  }

  formatDate(date) {
    return {
      date: date.format('YYYY-MM-DD'),
      display: date.format('MMM-YYYY')
    };
  }
  /* queryParams  */

  /* datepickers  */

  initStartDatePicker() {
    $("#dateSelectStartDate")
      .datepicker({
        autoclose: true,
        language: this.language,
        todayHighlight: true,
        format: "YYYY-MM-DD",
        startView: "months",
        minViewMode: "months",
        weekStart: 1
      })
      .on("changeDate", this.startDateOnChange.bind(this));
  }

  startDateOnChange(ev) {
      const newStartDate = moment(new Date(ev.date));
      const endDate = moment(this.endDate.date);
      if (this.isDateLarger(newStartDate, endDate)) {
        return;
      }
      this.startDate = this.formatDate(newStartDate);
      this.emitDateRange();
  }

  setStartDatepicker() {
      $("#dateSelectStartDate").datepicker("setDate", new Date(moment(this.startDate.date).format()));
  }

  initEndDatePicker() {
    $("#dateSelectEndDate")
      .datepicker({
        autoclose: true,
        language: this.language,
        todayHighlight: true,
        format: "YYYY-MM-DD",
        startView: "months",
        minViewMode: "months",
        defaultDate: this.endDate.date,
        weekStart: 1,
      })
      .on("changeDate", this.endDateOnChange.bind(this));
  }

  endDateOnChange(ev) {
      const newEndDate = moment(new Date(ev.date));
      const startDate = moment(this.startDate.date);
      if (this.isDateSmaller(newEndDate, startDate)) {
       return;
      }
      this.endDate = this.formatDate(newEndDate);
      this.emitDateRange();
  }

  setEndDatepicker() {
    $("#dateSelectEndDate").datepicker("setDate", new Date(moment(this.endDate.date).format()));
  }

  nextStartDate() {
    const newStartDate = moment(this.startDate.date).add(1, 'months');
    const endDate = moment(this.endDate.date);
    if (this.isDateLarger(newStartDate, endDate)) {
      return;
    }
    this.startDate = this.formatDate(newStartDate);
    this.setStartDatepicker();
  }

  isDateLarger(date1, date2) {
    return date1 >= date2;
  }

  previousStartDate() {
    this.startDate = this.formatDate(moment(this.startDate.date).subtract(1, 'months'));
    this.setStartDatepicker();
  }

  nextEndDate() {
    this.endDate = this.formatDate(moment(this.endDate.date).add(1, 'months'));
    this.setEndDatepicker();
  }

  previousEndDate(endDate = this.endDate) {
    const newEndDate = moment(endDate.date).subtract(1, 'months');
    const startDate = moment(this.startDate.date);
    if (this.isDateSmaller(newEndDate, startDate)) {
     return;
    }
    this.endDate = this.formatDate(newEndDate);
    this.setEndDatepicker();
  }

  isDateSmaller(date1, date2) {
    return date1 <= date2;
  }

  initDatePickers() {
    setTimeout(this.initDatepickerCallback.bind(this), 1000);
  }

  initDatepickerCallback() {
    this.initStartDatePicker();
    this.initEndDatePicker();
  }

  /* datepickers */

  setQueryParams() {
    const queryParams = { sdate: this.startDate.date, edate: this.endDate.date };
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: queryParams,
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
  }

};
