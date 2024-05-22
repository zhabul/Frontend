import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, OnChanges } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { TimesheetsService } from '../../../../timesheets.service';
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { firstValueFrom, Observable } from 'rxjs';

@Component({
  selector: 'app-absence-name',
  templateUrl: './absence-name.component.html',
  styleUrls: ['./absence-name.component.css']
})
export class AbsenceNameComponent implements OnInit, OnChanges {

  @ViewChild('inputEl') inputEl:ElementRef;
  @Input('user') user;
  @Input('year') year;
  @Input('absence') absence;

  @Output('valueUpdateListener') valueUpdateListener: EventEmitter<any> = new EventEmitter();


  public showEditor = false;
  public showValue = true;

  constructor(
    private toastr: ToastrService,
    private translate: TranslateService,
    private timsehets: TimesheetsService,
    private dialog: MatDialog
    ) {
      this.toastr;
      this.translate;
      this.timsehets;
    }

  ngOnInit(): void {
    this.initDialogConfig();
  }

  ngOnChanges() {
    this.initYearMax();
  }

  public yearMax: string | number = '';
  initYearMax() {
    this.yearMax = Number(this.user.years.list[this.year.id][this.absence.id].subtracted);
  }

  diaolgConfig;
  initDialogConfig() {
    this.diaolgConfig = new MatDialogConfig();
    this.diaolgConfig.autoFocus = false;
    this.diaolgConfig.disableClose = true;
    this.diaolgConfig.width = "";
  }

  toggleEditor() {
    this.showEditor = !this.showEditor;
    this.showValue = !this.showValue;
    this.focusInput();
  }

  async focusInput() {
    await this.sleep(50);
    if (this.showEditor) {
      this.inputEl.nativeElement.focus();
    }
  }

  async save($event) {
    let value = $event.target.value.toString()
                  .replace(/\s/g, "")
                  .replace(",", ".");
    if (value === '') {
      this.toggleEditor();
      return;
    };

    value = Number(value);
    if (value == Number(this.user.years.list[this.year.id][this.absence.id].subtracted)) {
      this.toggleEditor();
      return;
    };

    const confirmSave = await this.confirmSave();
    if (!confirmSave) {
      this.toggleEditor();
      return;
    };

    // const oldValue = this.user.years.list[this.year.id][this.absence.id].subtracted == "" ? 0 :this.user.years.list[this.year.id][this.absence.id].subtracted;
    const subtractedValue = value;// - this.user.years.list[this.year.id][this.absence.id].flex_total;

    const data = {
      user: this.user.id,
      absence: this.absence.id,
      year: this.year.id,
      date: this.year.year + "-01-01",
      value: subtractedValue
    };

    await this.timsehets.addValueToUserYearAbsenceLimit(data);
    data.value = value;
    this.valueUpdateListener.emit(data);
    this.toggleEditor();
  }

  async confirmSave() {
    this.diaolgConfig.panelClass = "mat-dialog-confirmation";
    const res = firstValueFrom(
      new Observable((sub)=>{
        this.dialog.open(ConfirmationModalComponent, this.diaolgConfig).afterClosed().subscribe((response) => {
        sub.next(response.result); sub.complete();
        });
      })
      );
    return res;
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(()=> resolve(ms), ms));
  }


}
