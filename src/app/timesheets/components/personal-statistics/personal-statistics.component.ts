import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import * as moment from "moment"; 

@Component({
  selector: 'app-personal-statistics',
  templateUrl: './personal-statistics.component.html',
  styleUrls: [
    './personal-statistics.component.css', 
    '../time-registration-admin/user-details-admin/user-details-header.css'
  ] 
})
export class PersonalStatisticsComponent implements OnInit {

  public puserid;
  public pdate; 
  public startDate;
  public endDate;
  public searchValue;

  constructor(
      private router: Router,
      private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.getQueryParams();
  }

  ngOnDestroy() {
    this.unsubFromQueryParams();
  }

  /*  tabs */

  public tabs = [
    { name: 'Personalstatestik' }
  ];
  public selectedTab = 0;
  setSelectedTab(index) {
    this.selectedTab = index;
  }

  /* tabs */

  /* searchValue */

  setSearchValue(value) {
    this.searchValue = value;
  }

  /* searchValue */

  /* datepicker */

  setDateRange(range) {
    this.startDate = range.startDate;
    this.endDate = range.endDate;
  }

  /* datepicker */

  /* query params */

  public queryParamsSub;
  getQueryParams() {
    this.queryParamsSub = this.route.queryParams.subscribe(this.queryParamsHandler.bind(this));
  }
  public fromTimeRegistration = 0;
  queryParamsHandler(params) {
    this.puserid = params.puserid;
    const currentDate = new Date();
    const pDate = this.setDate(params.pdate, currentDate);
    this.fromTimeRegistration = params.fromTimeRegistration;
    this.pdate = moment(pDate).format('YYYY-MM-DD');
  }

  setDate(date, currentDate) {
    return date ? new Date(date) : currentDate;
  }

  unsubFromQueryParams() {
    if (this.queryParamsSub) {
      this.queryParamsSub.unsubscribe();
    }
  }

  /* query params */

  /* user types */

  public selectedTypes: any[] = [];
  onItemSelect($event) {
    this.selectedTypes = $event;
  }
  public activeStatus:any[] = [];
  onActiveStatusSelect($event) {
    this.activeStatus = $event;
  }

  /* user types */

  /* navigation */
  decideOnRoute() {
    const timeRegAdmin = `/moments/time-registration-admin`;
    if (this.fromTimeRegistration == 1) {
      return timeRegAdmin
    } else if (this.puserid && this.pdate && this.puserid > 0) {
      return `timesheets/time-registration-admin/user-detail/${this.puserid}/${this.pdate}`;
    }
    return timeRegAdmin;
  }

  redirectToUserDetails() {
      this.router.navigate([this.decideOnRoute()],{ queryParamsHandling: "merge"});
  } 
  /* navigation */
}
