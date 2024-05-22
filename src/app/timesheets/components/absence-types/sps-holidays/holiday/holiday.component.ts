import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { TimeRegistrationService } from 'src/app/core/services/time-registration.service';
import { ConfirmationModalComponent } from 'src/app/shared/modals/confirmation-modal/confirmation-modal.component';
import { take } from 'rxjs';
import { HolidayEditorComponent } from '../holiday-editor/holiday-editor.component';
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrls: [
    './holiday.component.css',
    '../sps-holidays.component.css'
  ]
})
export class HolidayComponent implements OnInit {

  @Input('holiday') holiday;
  @Input('nr') nr;
  @Input('disabled') disabled = false;

  @Output('removeListener') removeListener:EventEmitter<any> = new EventEmitter();

  constructor(
    private dialog: MatDialog,
    private timeRegistrationService: TimeRegistrationService,
    public translate: TranslateService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {

  }

  openEditHolidayModal(absence = false) {
    if (this.disabled) return;
    const diaolgConfig = this.generateDialogConfig(absence);
    this.dialog
      .open(HolidayEditorComponent, diaolgConfig)
      .afterClosed()
      .subscribe(this.dialogAfterClose.bind(this));
  }


  dialogAfterClose(holiday) {
    if (holiday) {
      this.holiday = holiday;
      this.toastr.success(this.translate.instant('CUD_holiday_updated'), this.translate.instant('Success'));
    }
  }

  generateDialogConfig(holiday) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.width = '677px';
    diaolgConfig.height = 'auto';
    diaolgConfig.data = {
      holiday: holiday
    };
    return diaolgConfig;
  }

  async removeHoliday(holiday) {
    if (this.disabled) return;
    const confirm = await this.onConfirmationModal();
    if (!confirm) return;
    await this.timeRegistrationService.removeDefaultHolidays(holiday).toPromise2();
    this.toastr.success(this.translate.instant('CUD_holiday_removed'), this.translate.instant('Success'));
    this.removeListener.emit(holiday);
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
