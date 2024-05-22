import { Component, OnInit, ViewChild } from '@angular/core';
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { emptyHoliday } from './utils';
import { HolidayEditorComponent } from './holiday-editor/holiday-editor.component';
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-sps-holidays',
  templateUrl: './sps-holidays.component.html',
  styleUrls: [
    './sps-holidays.component.css',
    '../../time-registration-admin/user-details-admin/user-details-admin.component.css'
  ]
})
export class SpsHolidaysComponent implements OnInit {

  @ViewChild('wrapper') wrapper; 

  public holidays = [];
  public allHolidays = [];
  public spinner = false;

  constructor(
    private timeRegistrationService: TimeRegistrationService,
    private dialog: MatDialog,
    public translate: TranslateService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getHolidays();
    this.toggleBodyScroll("hidden");
    this.getUserDetails();
    this.setDisabledInputAttribute();
  }

  toggleBodyScroll(scroll) {
    document.getElementsByTagName("body")[0].style.overflow = scroll;
  }

  ngOnDestroy() {
    this.toggleBodyScroll("auto");
  }

  public headerGrid = {};
  setTranslateXForHeader(scrollLeft) {
    this.headerGrid = {
      ...this.headerGrid,
      transform: `translate3d(-${scrollLeft}px, 0px, 0px)`,
      position: 'relative'
    };
  }

  sanitizeDate(date) {
    date = date.replace('Week', this.translate.instant('Week'));
    date = date.replace('Vecka', this.translate.instant('Week'));
    date = date.replace('Sedmica', this.translate.instant('Week'));
    return date;
  }

  getHolidays() {
    this.spinner = true;
    this.timeRegistrationService
      .getDefaultHolidays()
      .subscribe((response) => {
        this.holidays = response["data"].map((holiday)=>{
          let start_date = this.sanitizeDate(holiday.start_date);
          let end_date = this.sanitizeDate(holiday.end_date);
          return { 
            ...holiday, 
            start_date: start_date,
            end_date: end_date
          };
        });
        this.allHolidays = this.holidays;
        this.filterHolidaysBySearchValue();
        this.spinner = false;
      });
  }

  /* searchValue */

  public searchValue = '';
  setSearchValue(value) {
    this.searchValue = value;
    this.filterHolidaysBySearchValue();
  }

  filterHolidaysBySearchValue() {
    const lowerSearch = this.searchValue.toLowerCase();
    this.holidays = this.allHolidays.filter((hol)=>{
      return hol.name.toLowerCase().includes(lowerSearch);
    });
    //this.setRightLineHeight();
  }

  /* searchValue */

  /* styling */

  public holidayTypeTableGrid = {};
  public holidaysGrid = {};
  setTableGridStyles() {

  }
    /* right line styling */

      public rightLineStyles = {}
      setRightLineHeight() {
        setTimeout(()=>{
          const el = this.wrapper.nativeElement;
          const rect = el.getBoundingClientRect();
          const height = `${rect.height}px`;
          this.rightLineStyles = { height: height, bottom: '7px' };
        }, 200);

      }
    
    /* right line styling */

  /* styling */

  /* ADD MODAL */

    openNewHolidayModal() {
      if (this.inputDisabled) return;
      this.openEditHolidayModal({ ...emptyHoliday });
    }

    openEditHolidayModal(absence) {
      const diaolgConfig = this.generateDialogConfig(absence);
      this.dialog
        .open(HolidayEditorComponent, diaolgConfig)
        .afterClosed()
        .subscribe(this.dialogAfterClose.bind(this));
    }

    dialogAfterClose(holiday) {
      if (holiday) {
        this.holidays.push(holiday); 
        this.toastr.success(this.translate.instant('CUD_holiday_added'), this.translate.instant('Success'));
      }
    }

    generateDialogConfig(holiday) {
      const diaolgConfig = new MatDialogConfig();
      diaolgConfig.autoFocus = true;
      diaolgConfig.width = '677px';
      diaolgConfig.height = 'auto';
      diaolgConfig.data = {
        holiday: holiday,
        number_of_flex: this.holidays[0].number_of_flex
      };
      return diaolgConfig;
    }
    
  /* ADD ABSENCE MODAL */

  removeHoliday(holiday) {
    this.holidays = this.holidays.filter((abs_)=>{
      return holiday.id != abs_.id
    })
  }

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
