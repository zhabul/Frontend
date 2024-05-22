import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { EditAbsenceModalComponent } from '../edit-absence-modal/edit-absence-modal.component';
import { TimeRegistrationService } from 'src/app/core/services/time-registration.service';
import { ConfirmationModalComponent } from 'src/app/shared/modals/confirmation-modal/confirmation-modal.component';
import { take } from 'rxjs';
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-absence-type',
  templateUrl: './absence-type.component.html',
  styleUrls: [
    './absence-type.component.css',
    '../absence-type-editor.component.css',
  ]
})
export class AbsenceTypeComponent implements OnInit, OnChanges {

  @Input('absence') absence;
  @Input('nr') nr;
  @Input('disabled') disabled = false;
  @Input('numberOfStats') numberOfStats = 0;
  @Input('numberOfFlex') numberOfFlex = 0;
  @Input('statsSending') statsSending = false;
  @Output('toggleStatsSending') toggleStatsSending:EventEmitter<any> = new EventEmitter();
  @Output('removeListener') removeListener:EventEmitter<any> = new EventEmitter();
  @Output('refreshStatsCounter') refreshStatsCounter:EventEmitter<any> = new EventEmitter();
  @Output('updateParentAbsence') updateParentAbsence:EventEmitter<any> = new EventEmitter();

  constructor(
    private dialog: MatDialog,
    private timeRegistrationService: TimeRegistrationService,
    public translate: TranslateService,
    private toastr: ToastrService
    ) { }

  public statsControl = { value: 0 };

  ngOnInit(): void {
    this.setStatsControlValue();
  }

  ngOnChanges() {
    this.refreshShowStats();
  }

  refreshShowStats() {

    if (this.statsSending) {
      this.showStats = false;
      return;
    }

    if (this.absence.stats == 0) {
      if (this.numberOfStats === 3) {
        this.showStats = false;
      } else {
        this.showStats = true;
      }
    } else {
      this.showStats = true;
    }
  }

  setStatsControlValue() {
    this.statsControl = { value: this.absence.stats };
  }

  toggleStats(value) {
    this.toggleStatsCall(value);
  }

  public showStats = true;
  async toggleStatsCall(value) {
    if (this.statsSending) return;
    if (!this.showStats) return;
    this.toggleStatsSending.emit();
    this.statsSending = true;
    const data = {
      id: this.absence.AbsenceTypeID,
      stats: value
    };
    const res: any = await this.timeRegistrationService.updateAbsenceTypeStat(data);
      this.toggleStatsSending.emit();
      if (res.status) {
        let inc = 1;
        if (value == 0) {
          inc = -1;
        }
        this.absence = { ...this.absence, stats: value };
        this.setStatsControlValue();
        this.refreshStatsCounter.emit(inc);
      } else {
        this.refreshShowStats();
      }

  }

  openEditAbsenceModal(absence = false) {
    if (this.disabled) return;
    const diaolgConfig = this.generateDialogConfig(absence);
    this.dialog
      .open(EditAbsenceModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe(this.dialogAfterClose.bind(this));
  }

  dialogAfterClose(absence) {
    if (absence) {
      this.toastr.success(this.translate.instant('CUD_absence_updated'), this.translate.instant('Success'));
      this.absence = absence;
      this.updateParentAbsence.emit(this.absence);
    }
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

  async removeAbsence(absence) {
    if (this.disabled) return;
    const confirm = await this.onConfirmationModal();
    if (!confirm) return;
    await this.timeRegistrationService.deleteAbsenceType(absence.AbsenceTypeID).toPromise2();
    this.toastr.success(this.translate.instant('CUD_absence_removed'), this.translate.instant('Success'));
    this.removeListener.emit(absence);
  }

  onConfirmationModal(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.disableClose = true;
      dialogConfig.width = "185px";
      dialogConfig.panelClass = "mat-dialog-confirmation";
      this.dialog
        .open(ConfirmationModalComponent, dialogConfig)
        .afterClosed()
        .pipe(take(1))
        .subscribe((response:any) => {
          if (response.result) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
    });
  }
}
