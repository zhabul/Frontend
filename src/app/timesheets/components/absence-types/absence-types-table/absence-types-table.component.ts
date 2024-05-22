import {
  Component,
  OnInit,
  ViewChild,
  Input
} from '@angular/core';
import { TimesheetsService } from '../../timesheets.service';
import { AddYearModalComponent } from './add-year-modal/add-year-modal.component';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-absence-types-table',
  templateUrl: './absence-types-table.component.html',
  styleUrls: [
    './absence-types-table.component.css',
    '../../time-registration-admin/user-details-admin/user-details-admin.component.css'
  ]
})
export class AbsenceTypesTableComponent implements OnInit {

  @Input('startDate') startDate;
  @Input('endDate') endDate;
  @ViewChild('wrapper') wrapper;

  constructor(
    private timsehets: TimesheetsService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.toggleBodyScroll("hidden");
    this.setResize();
    this.getUserDetails();
    this.setDisabledInputAttribute();

  }

  toggleBodyScroll(scroll) {
    document.getElementsByTagName("body")[0].style.overflow = scroll;
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

  ngOnChanges() {
    this.refreshPersonalStats();
  }

  ngAfterViewInit() {
    this.setRightLineHeight();
  }

  ngOnDestroy() {
    this.toggleBodyScroll("auto");
    this.unsubFromPersonalStats();
    this.removeResizeEvent();
  }

  refreshPersonalStats() {
    this.resetUsers();
    this.getPersonalAbsenceStatisticsForUsersByYears();

  }

  /* users */

  public allFetched = false;
  public users = [];
  public allAbsences = [];
  public allYears = [];
  public spinner = false;
  public offset = 0;
  public limit = 30;

  resetUsers() {
    this.offset = 0;
    this.allFetched = false;
    this.allAbsences = [];
    this.allYears = [];
    this.users = [];
  }

  generateParams() {
    return {
      searchValue: this.searchValue,
      selectedType: '',
      offset: this.offset,
      limit: this.limit
    };
  }

  getUserData() {

    if (this.allFetched) return;
    this.offset = this.offset + 30;
    this.getPersonalAbsenceStatisticsForUsersByYears();
  }

  public personalStatsSub;

  getPersonalAbsenceStatisticsForUsersByYears() {
    const params = this.generateParams();
    this.spinner = true;
    this.unsubFromPersonalStats();
    this.personalStatsSub = this.timsehets.getPersonalAbsenceStatisticsForUsersByYears(params).subscribe(this.handlePersonalStatsCall.bind(this));
  }

  unsubFromPersonalStats() {
    if (this.personalStatsSub) {
      this.personalStatsSub.unsubscribe();
    }
  }

  public statsCount = null;
  handlePersonalStatsCall(res) {
    if (res.status === false) return;
    this.users = this.users.concat(res.data.users);
    this.setStatsCount(res.data);
    this.setAllAbsencesForHeader(this.users[0]);
    this.spinner = false;
    if (res.data.users.length === 0) {
      this.allFetched = true;
    }
    setTimeout(()=>{
      this.setNumberWithLine();
    }, 500);
  }

  setStatsCount(data) {
    if (this.statsCount === null) {
      this.statsCount = data.number_of_stats;
    }
  }

  setAllAbsencesForHeader(user) {

    if (this.allAbsences.length) return;
    if (!user) return;
    this.allAbsences = user.years.absences;
    this.allYears = user.years.allYears;
    this.setTableGridStyles();
    this.setRightLineHeight();
  }

  public headerGrid = {};

  setTranslateXForHeader(scrollLeft) {
    this.headerGrid = {
      ...this.headerGrid,
      transform: `translate3d(-${scrollLeft}px, 0px, 0px)`,
      position: 'relative'
    };
  }

  /* users */

  /* styling */

  public absenceTypeTableGrid = {};
  public absencesGrid = {};
  setTableGridStyles() {
    this.absenceTypeTableGrid = {
      gridTemplateColumns: `480px repeat(${this.allYears.length + 1}, ${(this.allAbsences.length)* 100}px)`
    };
    this.absencesGrid = {
      gridTemplateColumns: `repeat(${this.allAbsences.length}, 100px)`
    };
  }

  /* styling */

  /* searchValue */

  public searchValue = '';
  setSearchValue(value) {
    this.searchValue = value;
    this.refreshPersonalStats();
  }

  /* searchValue */

    /* right line styling */

  public rightLineStyles:any = {  height: '0px'}
  setRightLineHeight() {
    const el = this.wrapper.nativeElement;
    const rect = el.getBoundingClientRect();
    const height = `${rect.height - 5}px`;
    this.rightLineStyles = { height: height, bottom: '7px' };
  }

  /* right line styling */
  public resizeEvent;

  setResize() {
    this.resizeEvent = this.setRightLineHeight.bind(this);
    window.addEventListener('resize', this.resizeEvent);
  }

  removeResizeEvent() {
    window.removeEventListener('resize', this.resizeEvent);
  }

  /* ADD YEAR MODAL */

  openAddYearModal() {
    if (this.inputDisabled) return;
    if (this.statsCount === 0) {
      this.toastr.info(this.translate.instant('No absences selected.'), this.translate.instant('Info'));
      return;
    };
    if (this.allYears.length === 5) {
      this.toastr.info(this.translate.instant('Limit for years reached.'), this.translate.instant('Info'));
      return;
    }

    const diaolgConfig = this.generateDialogConfig();
    this.dialog
      .open(AddYearModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe(this.dialogAfterClose.bind(this));
  }

  dialogAfterClose(res) {
    if (res && res.refresh) {
      this.refreshPersonalStats();
    }
  }

  generateDialogConfig() {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.width = '300px';
    diaolgConfig.height = 'auto';
    diaolgConfig.panelClass = "confirm-modal";
    diaolgConfig.data = {
      allYears: this.allYears
    };
    return diaolgConfig;
  }

  /* ADD YEAR MODAL */

  public userDetails;
  getUserDetails() {
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  }

  public inputDisabled = false;
  setDisabledInputAttribute() {
    const reportManagement = this.userDetails.create_timesheets_time_report_management;
    this.inputDisabled = reportManagement === undefined;
  }
}