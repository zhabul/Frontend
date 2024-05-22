import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { TimesheetsService } from '../../timesheets.service';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-personal-statistics-table',
  templateUrl: './personal-statistics-table.component.html',
  styleUrls: [
    './personal-statistics-table.component.css',
    "../../time-registration-admin/user-details-admin/user-details-admin.component.css",
  ]
})
export class PersonalStatisticsTableComponent implements OnInit {

  @ViewChild('wrapper') wrapper;

  @Input('searchValue') searchValue;
  @Input('startDate') startDate;
  @Input('endDate') endDate;
  @Input('selectedTypes') selectedTypes = [];
  @Input('activeStatus') activeStatus = [];

  constructor(
        private timsehets: TimesheetsService,
        private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.toggleBodyScroll("hidden");
  }

  ngOnChanges() {
    this.resetTotals();
    this.resetUsers();
    this.getPersonalStatisticsForUsers();
    this.getPersonalStatisticsTotals();
  }

  ngAfterViewInit() {
    this.setRightLineHeight();
  }

  public numberWithLine = '';
  setNumberWithLine() {
    let nr = this.translate.instant('CUD_Nr');
    nr = nr.length > 12 ? this.insertLine(nr) : nr;
    this.numberWithLine = nr;
  }

  insertLine(nr) {
    return [nr.slice(0, 12), '-', nr.slice(12)].join('')
  }

  toggleBodyScroll(scroll) {
    document.getElementsByTagName("body")[0].style.overflow = scroll;
  }

  ngOnDestroy() {
    this.unsubFromPersonalStats();
    this.toggleBodyScroll("auto");
  }

  /* users */

  public users = [];
  public allAbsences = [];

  resetUsers() {
    this.offset = 0;
    this.allFetched = false;
    this.users = [];
  }

  setAllAbsencesForHeader(user) {

    if (this.allAbsences.length) return;
    if (!user) return;
    this.allAbsences = user.absences;
    this.setTableGridStyles();
  }

  /* get users */

  public spinner = false;
  public allFetched = false;
  public offset = 0;
  public limit = 30;

  getUserData() {

    if (this.allFetched) return;
    this.offset = this.offset + 30;
    this.getPersonalStatisticsForUsers();
  }

  public personalStatsSub;

  mapTypeNames(item) {
    return item.value;
  }

  generateParams() {

    return {
      searchValue: this.searchValue,
      startDate: this.startDate,
      endDate: this.endDate,
      selectedTypes: this.selectedTypes.map(this.mapTypeNames).toString(),
      activeStatus: this.activeStatus.map(this.mapTypeNames).toString(),
      offset: this.offset,
      limit: this.limit
    };
  }

  getPersonalStatisticsForUsers() {
    const params = this.generateParams();
    this.spinner = true;
    this.unsubFromPersonalStats();
    this.personalStatsSub = this.timsehets.getPersonalStatisticsForUsers(params).subscribe(this.handlePersonalStatsCall.bind(this));
  }

  unsubFromPersonalStats() {
    if (this.personalStatsSub) {
      this.personalStatsSub.unsubscribe();
    }
  }

  handlePersonalStatsCall(res) {
    if (res.status === false) return;
    this.users = this.users.concat(res.data);
    this.setAllAbsencesForHeader(this.users[0]);
    this.spinner = false;
    if (res.data.length === 0) {
      this.allFetched = true;
    }
    setTimeout(()=>{
      this.setNumberWithLine();
    }, 500);
  }

  /* get users */

  public totals = { absences:
    {
      absences: [],
      totalAbsences: 0
    },
    moments: 0,
    total: 0
  };
  public personalStatsTotalSub;

  resetTotals() {
    this.totals = {
      absences: {
        absences: [],
        totalAbsences: 0
      },
      moments: 0,
      total: 0
    };
  }

  getPersonalStatisticsTotals() {
    const params = this.generateParams();
    this.unsubFromPersonalStatsTotals();
    this.personalStatsTotalSub = this.timsehets.getPersonalStatisticsTotals(params).subscribe(this.handlePersonalStatsTotalCall.bind(this));
  }

  handlePersonalStatsTotalCall(res) {

    if (res.status === false) return;
    this.totals = res.data;
  }

  unsubFromPersonalStatsTotals() {
    if (this.personalStatsTotalSub) {
      this.personalStatsTotalSub.unsubscribe();
    }
  }

  /* getTotals */

  /* header styling */

  public tableGrid = {};
  public headerGrid = {};
  setTableGridStyles() {

    this.tableGrid = {
      gridTemplateColumns: `160px 100px repeat(${this.allAbsences.length}, 100px) 190px 140px`
    };
    this.headerGrid = this.tableGrid;
  }

  setTranslateXForHeader(scrollLeft) {
    this.headerGrid = {
      ...this.headerGrid,
      transform: `translate3d(-${scrollLeft}px, 0px, 0px)`,
      position: 'relative'
    };
  }


  /* header styling */

  /* right line styling */

  public rightLineStyles:any = { height: '0px' }
  setRightLineHeight() {
    setTimeout(()=>{
      const el = this.wrapper.nativeElement;
      const rect = el.getBoundingClientRect();
      const height = `${rect.height}px`;
      this.rightLineStyles = { height: height, bottom: '42px' };
    }, 2000);
  }

  /* right line styling */

}
