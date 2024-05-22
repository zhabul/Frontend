import { Component, OnInit, ViewChild } from '@angular/core';
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { EditAbsenceModalComponent } from './edit-absence-modal/edit-absence-modal.component';
import { emptyAbsence } from './utils';
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-absence-type-editor',
  templateUrl: './absence-type-editor.component.html',
  styleUrls: [
    './absence-type-editor.component.css',
    '../../time-registration-admin/user-details-admin/user-details-admin.component.css'
  ]
})
export class AbsenceTypeEditorComponent implements OnInit {
 
  @ViewChild('wrapper') wrapper; 

  public absences = [];
  public allAbsences = [];
  public spinner = false;

  constructor(
    private timeRegistrationService: TimeRegistrationService,
    private dialog: MatDialog,
    public translate: TranslateService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getAbsenceType();
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
    setTimeout(()=>{
      this.setRightLineHeight();
    }, 3000);
  }

  public headerGrid = {};
  setTranslateXForHeader(scrollLeft) {
    this.headerGrid = {
      ...this.headerGrid,
      transform: `translate3d(-${scrollLeft}px, 0px, 0px)`,
      position: 'relative'
    };
  }

  public numberOfStats = 0;
  public numberOfFlex = 0;

  refreshStatsCounter(value) {
    this.numberOfStats = this.numberOfStats + value;
  }

  getAbsenceType() {
    this.spinner = true;
    this.timeRegistrationService
      .getAbsenceTypes()
      .subscribe((response) => {
        this.absences = response["data"];
        this.allAbsences = this.absences;
        this.numberOfStats = this.absences[0].number_of_stats;
        this.setNumberOfFlex();
        this.filterAbsencesBySearchValue();
        this.spinner = false;
      });
  }

  setNumberOfFlex() {
    this.numberOfFlex = this.findFlexAbasence();
  }

  findFlexAbasence() {
    return this.absences.find((absence)=>{
      return absence.flex == 1;
    }) ? 1 : 0;
  }

  public statsSending = false;
  toggleStatsSending() {
    this.statsSending = !this.statsSending;
  }

  /* searchValue */

  public searchValue = '';
  setSearchValue(value) {
    this.searchValue = value;
    this.filterAbsencesBySearchValue();
  }

  filterAbsencesBySearchValue() {
    const lowerSearch = this.searchValue.toLowerCase();
    this.absences = this.allAbsences.filter((abs)=>{
      return abs.Name.toLowerCase().includes(lowerSearch);
    });
    this.setRightLineHeight();
  }

  /* searchValue */

  /* styling */

  public absenceTypeTableGrid = {};
  public absencesGrid = {};
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

    openNewAbsenceModal() {
      if (this.inputDisabled) return;
      this.openEditAbsenceModal({ ...emptyAbsence });
    }

    openEditAbsenceModal(absence) {
      const diaolgConfig = this.generateDialogConfig(absence);
      this.dialog
        .open(EditAbsenceModalComponent, diaolgConfig)
        .afterClosed()
        .subscribe(this.dialogAfterClose.bind(this));
    }

    dialogAfterClose(absence) {
      if (absence) { 
        this.absences.push(absence);
        this.toastr.success(this.translate.instant('CUD_absence_added'), this.translate.instant('Success'));
      }
      this.setNumberOfFlex();
    }

    generateDialogConfig(absence) {
      const diaolgConfig = new MatDialogConfig();
      diaolgConfig.autoFocus = true;
      diaolgConfig.width = '677px';
      diaolgConfig.height = 'auto';
      diaolgConfig.data = {
        absence: absence,
        numberOfFlex: this.numberOfFlex
      };
      return diaolgConfig;
    }
    
  /* ADD ABSENCE MODAL */

  removeAbsence(absence) {
    this.absences = this.absences.filter((abs_)=>{
      return absence.AbsenceTypeID != abs_.AbsenceTypeID
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

  updateParentAbsence(absence) {
    this.absences = this.absences.map((abs)=>{
      if (abs.AbsenceTypeID == absence.AbsenceTypeID) {
        return { ...absence };
      }
      return abs;
    });
    this.setNumberOfFlex();
  }

}
