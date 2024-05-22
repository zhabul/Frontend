import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import * as moment from "moment";

@Component({
  selector: 'app-absence-types',
  templateUrl: './absence-types.component.html',
  styleUrls: [
    './absence-types.component.css',
    '../personal-statistics/personal-statistics.component.css',
    '../time-registration-admin/user-details-admin/user-details-header.css']
})
export class AbsenceTypesComponent implements OnInit {

  public puserid;
  public pdate;
  public startDate;
  public endDate;
  public language = "en";
  public isEnglish:boolean=false;



  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private translate: TranslateService,


  ) {
    this.language = sessionStorage.getItem("lang");
      this.translate.use(this.language);
  }

  ngOnInit(): void {

    this.getQueryParams();
    if(this.language == "en")
    {
      this.isEnglish=true;
    }

  }

  ngOnDestroy() {
    this.unsubFromQueryParams();
  }

  /*  tabs */

  public tabs = [
    { name: 'AVAILABLE TYPES' },
   /* { name: 'Types of absence' },
    { name: 'Salary System' }*/
  ];
  public selectedTab = 0;
  setSelectedTab(index) {
    this.selectedTab = index;
  }

  /* tabs */

  /* searchValue */

  public searchValue;
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
  queryParamsHandler(params) {
    this.puserid = params.puserid;
    const currentDate = new Date();
    const pDate = this.setDate(params.pdate, currentDate);
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

  /* user types */

  /* navigation */

  redirectToUserDetails_(route) {
    this.router.navigate([route],{ queryParamsHandling: "merge"});
  }

  redirectToUserDetails() {
    this.router.navigate([`timesheets/personal-statistics`],{ queryParamsHandling: "merge"});
  }

  navigateToLoneTyper() {
    this.redirectToUserDetails_('/timesheets/settings/lone');
  }

  navigateToErsattningsvarotyper() {
    this.redirectToUserDetails_('/timesheets/settings/ersattningsvarotyper');
  }

  /* navigation */
}
