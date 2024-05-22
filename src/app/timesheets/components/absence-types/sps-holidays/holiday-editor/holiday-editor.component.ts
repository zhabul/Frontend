import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { TimeRegistrationService } from 'src/app/core/services/time-registration.service';
import { EmptyHolidayInterface, emptyHoliday } from '../utils';
import { ConfirmationModalComponent } from 'src/app/shared/modals/confirmation-modal/confirmation-modal.component';
import { take } from 'rxjs';
declare var $;

@Component({
  selector: 'app-holiday-editor',
  templateUrl: './holiday-editor.component.html',
  styleUrls: [
    './holiday-editor.component.css',
    '../../absence-type-editor/edit-absence-modal/edit-absence-modal.component.css'
  ]
})
export class HolidayEditorComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private timeRegistrationService: TimeRegistrationService,
    public dialogRef: MatDialogRef<EmptyHolidayInterface>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private dialog: MatDialog,
    private translate: TranslateService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initHoliday();
    this.initForm();
  }

  public holiday:EmptyHolidayInterface = { ...emptyHoliday };
  public showFlex = false;
  initHoliday() {
    const data = this.modal_data;
    this.holiday = { ...data.holiday };
    this.showFlex = data.number_of_flex > 0 ? false : true;
  }

  public editHolidayForm;
  public old_start_date;
  public old_end_date;
  initForm() {
    this.old_start_date = this.holiday.start_date;
    this.old_end_date = this.holiday.end_date;
    this.editHolidayForm = this.fb.group({
      id: [ this.holiday.id, []],
      name: [ this.holiday.name, [ Validators.required ]],
      hours: [ this.holiday.hours, [ Validators.required ]],
      start_date: [ this.holiday.start_date, [  Validators.required ]],
      end_date: [ this.holiday.end_date, [ Validators.required ]]
    });
    this.initFormControlls();
  }

  public startDateControl;
  public endDateControl;
  initFormControlls() {
    this.startDateControl = this.editHolidayForm.get('start_date');
    this.endDateControl = this.editHolidayForm.get('end_date');
  }

  public spinner = false;
  async submit() {
    this.editHolidayForm.markAllAsTouched();
    if (this.editHolidayForm.invalid) return;
    const confirm = await this.onConfirmationModal();
    if (!confirm) return;
    const data = this.editHolidayForm.value;
    data.hours = data.hours.toString().replace(/\s/g, "").replace(",", ".");
    let res;

    if (data.id) {
      data.old_start_date = this.old_start_date;
      data.old_end_date = this.old_end_date;
      res = await this.timeRegistrationService.updatePublicHoliday(data).toPromise2();
    } else {
      res = await this.timeRegistrationService.createPubilcHoliday(data).toPromise2();
    }

    if (res.status) {
      this.responseSuccess(data, res);
    } else {

    }
    this.spinner = false;
  }

  sanitizeDate(date) {
    date = date.replace('Week', this.translate.instant('Week'));
    date = date.replace('Vecka', this.translate.instant('Week'));
    date = date.replace('Sedmica', this.translate.instant('Week'));
    return date;
  }

  responseSuccess(data, res) {
    const { id } = res;
    if (id) {
      data.ID = id;
      data.id = id;
    }
    data.start_date = this.sanitizeDate(data.start_date);
    data.end_date = this.sanitizeDate(data.end_date);
    this.dialogRef.close(data);
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

  /* START DATE - END DATE */
  public language = "en";
  public week = "Week";

  ngAfterViewInit() {
    $("#start_date")
      .datepicker({
        format: "yyyy-mm-dd",
        calendarWeeks: true,
        autoclose: true,
        language: this.language,
        todayHighlight: true,
        currentWeek: true,
        currentWeekTransl: this.week,
        currentWeekSplitChar: "-",
        weekStart: 1,
      })
      .on("changeDate", (ev) => {
        if (
          Date.parse(ev.target.value.split(" ")[0]) >
          Date.parse(this.editHolidayForm.value.end_date.split(" ")[0])
        ) {
          setTimeout(() => {
            this.toastr.info(
              this.translate.instant("Start date cannot be after end date."),
              this.translate.instant("Info")
            );
            ev.target.value = this.editHolidayForm.value.start_date;
          }, 0);
        } else {
          this.startDateControl.patchValue(ev.target.value);
        }
      });

    const start_date = this.startDateControl.value;
    if (start_date !== '') {
      $("#start_date").datepicker(
        "setDate",
        this.startDateControl.value.split(" ")[0]
      );
    }

    $("#end_date")
      .datepicker({
        format: "yyyy-mm-dd",
        calendarWeeks: true,
        autoclose: true,
        language: this.language,
        todayHighlight: true,
        currentWeek: true,
        currentWeekTransl: this.week,
        currentWeekSplitChar: "-",
        weekStart: 1,
      })
      .on("changeDate", (ev) => {
        if (
          Date.parse(ev.target.value.split(" ")[0]) <
          Date.parse(this.editHolidayForm.value.start_date.split(" ")[0])
        ) {
          setTimeout(() => {
            this.toastr.info(
              this.translate.instant("End date cannot be before start date."),
              this.translate.instant("Info")
            );
            ev.target.value = this.editHolidayForm.value.end_date;
          }, 0);
        } else {
          this.endDateControl.patchValue(ev.target.value);
        }
      });

    const end_date = this.endDateControl.value;
    if (end_date !== '') {
      $("#end_date").datepicker(
        "setDate",
        this.endDateControl.value.split(" ")[0]
      );
    }
  }

}
