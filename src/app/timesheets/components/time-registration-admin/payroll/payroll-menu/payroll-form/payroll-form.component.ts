import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from "@angular/material/dialog";
import { TimeRegistrationService } from 'src/app/core/services/time-registration.service';
import { ConfirmationModalComponent } from 'src/app/shared/modals/confirmation-modal/confirmation-modal.component';
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { take } from 'rxjs';
import { GeneralsService } from "src/app/core/services/generals.service";
import * as moment from "moment";

@Component({
  selector: 'app-payroll-form',
  templateUrl: './payroll-form.component.html',
  styleUrls: ['./payroll-form.component.css']
})
export class PayrollFormComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private timeRegistrationService: TimeRegistrationService,
    public dialogRef: MatDialogRef<PayrollFormComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private dialog: MatDialog,
    public translate: TranslateService,
    private toastr: ToastrService,
    private general: GeneralsService
  ) { }

  ngOnInit(): void {

    this.getSPSEmails();
    this.initFormInfo();
    this.initForm();
  }

  public formInfo = {
    from: 'noreply@sps360.com',
    to: '',
    subject: '',
    notification: ''
  };
  public payrollType = '';
  public url = '';
  public filename = '';
  public date = '';
  public sps_emails;
  initFormInfo() {
    this.payrollType = this.modal_data.type;
    if(this.payrollType == 'XLS' || this.payrollType == 'TLU') {
      this.url = this.modal_data.data.xls;
    }else {
      this.url = this.modal_data.data.url;
    }
    this.filename = this.modal_data.data.filename;
    this.date = this.modal_data.data.date;
  }

  public editAbsenceForm;
  initForm() {
    this.editAbsenceForm = this.fb.group({
      from: [this.formInfo.from, [ Validators.required, Validators.maxLength(255), Validators.email ]],
      to: [ this.formInfo.to, [ Validators.required, Validators.maxLength(255), Validators.email ]],
      subject: [ this.formInfo.subject, [ Validators.required, Validators.maxLength(255) ]],
      notification: [ this.formInfo.notification, [ Validators.required, Validators.maxLength(3500) ]],
      url: [ this.url, [ /*Validators.required, Validators.maxLength(3500)*/ ]],
      date: [ this.date, [ Validators.required, Validators.maxLength(3500) ]]
    });
    this.timeRegistrationService
  }

  generateEmailInfoObject(data) {
    return {
      to: data.to,
      from:  data.from,
      subject: data.subject,
      notification: data.notification,
      url: data.url,
      date: data.date,
      manualReply: 0,
      status: 1,
      reminder: 0,
    };
  }

  public spinner = false;
  async submit() {
    if (this.editAbsenceForm.invalid) return;
    const confirm = await this.onConfirmationModal();
    if (!confirm) return;
    if (this.spinner) return;
    const data = this.generateEmailInfoObject(this.editAbsenceForm.value);
    this.spinner = true;
    const status:any = await this.timeRegistrationService.sendPayroll(data).toPromise2();
    if (status) {
      this.responseSuccess();
    } else {

    }
    this.spinner = false;
  }

  responseSuccess() {
    this.toastr.success(this.translate.instant('CUD_Payroll_basis_sent'), this.translate.instant('Success'));
    this.dialogRef.close();
  }

  onConfirmationModal(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.disableClose = true;
      dialogConfig.width = "";
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

  getSPSEmails() {
    this.general.getSPSEmails().subscribe((result) => {

      this.sps_emails = result;
      this.formInfo.from = result['NOREPLAY'];
      this.editAbsenceForm.get('from').patchValue(result['NOREPLAY']);

      if(this.modal_data.type == 'order_model') {
        this.formInfo.from = result['SEND'];
        this.editAbsenceForm.get('to').patchValue(result['SEND']);
        this.editAbsenceForm.get('subject').patchValue(this.translate.instant('Order your own model at sps360@com'));
        this.editAbsenceForm.get('to').patchValue(result['SEND']);
        this.editAbsenceForm.get('date').patchValue( moment().format('YYYY-MM-DD') );
      }
    });
  }
}
