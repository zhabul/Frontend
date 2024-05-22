import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from "moment";

@Component({
  selector: 'app-options-menu',
  templateUrl: './options-menu.component.html',
  styleUrls: ['./options-menu.component.css', '../user-details-admin.component.css']
})
export class OptionsMenuComponent implements OnInit {

  @Input('calendar') calendar;
  @Input('stats') stats;
  @Input('settings') settings;
  @Input('userId') userId; 
  public date;
  @Input('date') set setDate(value) {
    const date = moment(value).format('YYYY-MM-DD');
    this.date = date;
  }; 
  @Input('name') name; 
  public fromTimeRegistration = 0;
  @Input('fromTimeRegistration') set setFromTimeRegistration(value) {
    if (value !== this.fromTimeRegistration) {
      this.fromTimeRegistration = value;
    }
  };

  public from;
  public userDetails;
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getUserDetails();
    this.setPayrollPermission();
    this.subToQueryParams();
  }

  ngOnDestroy() {
    this.unsubFromQueryParams();
  }

  public paramsSub;
  subToQueryParams() {
    this.paramsSub = this.route.queryParams.subscribe((params) => {
      if (params.fromTimeRegistration) {
        this.fromTimeRegistration = params.fromTimeRegistration
      }
    });
  }

  unsubFromQueryParams() {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }
  }

  getUserDetails() {
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  }
  public payrollVisibility;
  setPayrollPermission() {
    this.payrollVisibility = this.userDetails.create_timesheets_payroll;
  }

  public buttonToggleDots = false;
  public arrowUpColor = '#BFE29C';
  public btnOptionsBorderRadius = {};

  setFromQueryParam() {
    let from = 'personal_stats';
 
    if (this.calendar) {
      from = 'single_calendar';
    }

    this.from = from;
  }

  threeDotsEnter() {
    if (this.buttonToggleDots) return;
    this.setBtnOptionsBorderRadius();
  }

  threeDotsLeave() {
    if (this.buttonToggleDots) return;
    this.setBtnOptionsBorderRadius();
  }

  optionsDownDiv(){
    this.buttonToggleDots = !this.buttonToggleDots;
    this.setBtnOptionsBorderRadius();
  }

  setBtnOptionsBorderRadius() { 
    if (this.buttonToggleDots) {
      this.btnOptionsBorderRadius = {
        borderBottomRightRadius: '0px',
        borderBottomLeftRadius: '0px'
      };
      return;
    }
    this.btnOptionsBorderRadius = {
      borderRadius: '0.4rem'
    };
  }

  public settingsColor = '#44484c';
  settingsMouseEnter() {
    this.settingsColor = 'var(--brand-color)';
  }
  settingsMouseLeave() {
    this.settingsColor = '#44484c';
  }


}
