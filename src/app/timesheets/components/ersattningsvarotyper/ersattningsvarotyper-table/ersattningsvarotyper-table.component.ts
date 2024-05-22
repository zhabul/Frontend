import { Component, OnInit, ViewChild } from '@angular/core';
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ErsattningsvarotyperEditorComponent } from './ersattningsvarotyper-editor/ersattningsvarotyper-editor.component';
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { emptyErstType } from './utils';

@Component({
  selector: 'app-ersattningsvarotyper-table',
  templateUrl: './ersattningsvarotyper-table.component.html',
  styleUrls: [
    './ersattningsvarotyper-table.component.css',
    '../../time-registration-admin/user-details-admin/user-details-admin.component.css'
  ]
})
export class ErsattningsvarotyperTableComponent implements OnInit {

  @ViewChild('wrapper') wrapper;

  public erstTypes = [];
  public allErstTypes = [];
  public spinner = false;
  public measure_unit:any;

  constructor(
    private timeRegistrationService: TimeRegistrationService,
    private dialog: MatDialog,
    public translate: TranslateService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getMileageTypes();
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

  ngAfterViewInit() {
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

  getMileageTypes() {
    this.spinner = true;
    this.timeRegistrationService
      .getMileageTypes()
      .subscribe((response) => {
        this.erstTypes = response["data"];
        this.allErstTypes = this.erstTypes;
        this.filterAbsencesBySearchValue();
        this.spinner = false;
        this.measure_unit = response["data"][0]['unit_name'];
      });
  }

  /* searchValue */

  public searchValue = '';
  setSearchValue(value) {
    this.searchValue = value;
    this.filterAbsencesBySearchValue();
  }

  filterAbsencesBySearchValue() {
    const lowerSearch = this.searchValue.toLowerCase();
    this.erstTypes = this.allErstTypes.filter((abs)=>{
      return abs.name.toLowerCase().includes(lowerSearch);
    });
    this.setRightLineHeight();
  }

  /* searchValue */

  /* styling */

  public erstTypeTableGrid = {};
  public erstGrid = {};
  setTableGridStyles() {

  }
    /* right line styling */

      public rightLineStyles:any = { height: '0px' }
      setRightLineHeight() {
        setTimeout(()=>{
          const el = this.wrapper.nativeElement;
          const rect = el.getBoundingClientRect();
          const height = `${rect.height - 6}px`;
          this.rightLineStyles = { height: height, bottom: '7px' };
        }, 50);

      }

    /* right line styling */

  /* styling */

  /* ADD ABSENCE MODAL */

    openNewErstModal() {
      if (this.inputDisabled) return;
      this.openEditErsteModal({ ...emptyErstType });
    }

    openEditErsteModal(erstType) {
      const diaolgConfig = this.generateDialogConfig(erstType);
      this.dialog
        .open(ErsattningsvarotyperEditorComponent, diaolgConfig)
        .afterClosed()
        .subscribe(this.dialogAfterClose.bind(this));
    }

    dialogAfterClose(erstType) {
      if (erstType) {
        this.toastr.success(this.translate.instant('CUD_mileage_type_added'), this.translate.instant('Success'));
        this.erstTypes.push(erstType);
      }
    }

    generateDialogConfig(erstType) {

        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = true;
        diaolgConfig.width = '677px';
        diaolgConfig.height = 'auto';
        diaolgConfig.panelClass = "ErsattningsvarotyperEditor-modal";
        diaolgConfig.data = {
        'erstType': erstType,
        'measure_unit': this.measure_unit
        };
        return diaolgConfig;
    }

  /* ADD ABSENCE MODAL */

  removeErstType(erstType) {
    this.erstTypes = this.erstTypes.filter((erst_)=>{
      return erstType.id != erst_.id
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
