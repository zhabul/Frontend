import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { TimesheetsService } from '../../../timesheets.service';
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

const TEXT_STATUS = {
  add: 'Add Year',
  adding: 'Adding Year...'
};

@Component({
  selector: 'app-add-year-modal',
  templateUrl: './add-year-modal.component.html',
  styleUrls: ['./add-year-modal.component.css']
})
export class AddYearModalComponent implements OnInit {

  public year = "2023";
  public addYearSub;
  public buttonText = 'Add Year';

  constructor(
    public dialogRef: MatDialogRef<AddYearModalComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private toastr: ToastrService,
    private translate: TranslateService,
    private timsehets: TimesheetsService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.addLatestYear();
  }
  ngOnDestroy(): void {
    this.removeAddYearSub();
  }

  addLatestYear() {
    const lastIndex = this.modal_data.allYears.length - 1;
    if (this.modal_data.allYears[lastIndex]) {
      this.year = this.modal_data.allYears[lastIndex].year;
    }
  }

  addYear() {
    const valid = this.validateYear();
    if (valid === false) return;
    if (this.buttonText === TEXT_STATUS.adding) return;
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
          this.buttonText === TEXT_STATUS.adding;
          this.addYearSub = this.timsehets.addYearForAbsenceStats(Number(this.year)).subscribe(this.addYearResponse.bind(this));
        }
      });
  }

  addYearResponse(res) {
    this.buttonText = TEXT_STATUS.add;
    if (res.status) {
      this.toastr.success(this.translate.instant('Year successfully added.'), this.translate.instant('Success.'));
      this.dialogRef.close({ refresh: true });
    } else {
      this.toastr.error(this.translate.instant('Error while adding year.'), this.translate.instant('Error.'));
    }
  }

  removeAddYearSub() {
    if (this.addYearSub) {
      this.addYearSub.unsubscribe();
    }
  }

  validateYear() {
    const allYears = this.modal_data.allYears;
    const stringYear = this.year.toString().trim();
    if (this.findYear(allYears, stringYear)) {
      this.toastr.info(this.translate.instant('Year exists.'), this.translate.instant('Info.'));
      return false;
    }
    if (stringYear.length != 4) {
      this.toastr.error(this.translate.instant('Not a valid year.'), this.translate.instant('Error.'));
      return false;
    }
    return true;
  }

  findYear(allYears, year) {
    return allYears.find((year)=>{
      return year.year == this.year;
    });
  }

}
