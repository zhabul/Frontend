import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { TimesheetsService } from '../../../timesheets.service';
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

@Component({
  selector: 'app-stats-year',
  templateUrl: './stats-year.component.html',
  styleUrls: ['./stats-year.component.css']
})
export class StatsYearComponent implements OnInit {

  @Input('disabled') disabled = false;
  @Input('year') year;
  @Output('yearRemoved') yearRemoved:EventEmitter<any> = new EventEmitter();
  public sending = false;
  public removeYearSub;

  constructor(
    private toastr: ToastrService,
    private translate: TranslateService,
    private timsehets: TimesheetsService,
    private dialog: MatDialog) { }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.unsubFromRemoveYear();
  }

  removeYear() {
    if (this.disabled) return;
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          this.sending = true;
          this.removeYearSub = this.timsehets.removeYearFromAbsenceStats(Number(this.year.id)).subscribe(this.removeYearResponse.bind(this));
        }
      });
  }

  removeYearResponse(res) {
    if (res.status) {
      this.toastr.success(this.translate.instant('Year successfully removed.'), this.translate.instant('Success.'));
      this.yearRemoved.emit(true);
    } else {
      this.toastr.error(this.translate.instant('Error while removing year.'), this.translate.instant('Error.'));
    }
  }

  unsubFromRemoveYear() {
    if (this.removeYearSub) {
      this.removeYearSub.unsubscribe();
    }
  }
}