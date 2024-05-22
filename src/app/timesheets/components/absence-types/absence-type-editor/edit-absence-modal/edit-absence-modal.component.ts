import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from "@angular/material/dialog";
import { TimeRegistrationService } from 'src/app/core/services/time-registration.service';
import { EmpityAbsenceInterface, emptyAbsence } from '../utils';
import { ConfirmationModalComponent } from 'src/app/shared/modals/confirmation-modal/confirmation-modal.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-edit-absence-modal',
  templateUrl: './edit-absence-modal.component.html',
  styleUrls: ['./edit-absence-modal.component.css']
})
export class EditAbsenceModalComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private timeRegistrationService: TimeRegistrationService,
    public dialogRef: MatDialogRef<EditAbsenceModalComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initAbsence();
    this.initForm();
  }

  public absence:EmpityAbsenceInterface = { ...emptyAbsence };
  public showFlex = true;
  public showStats = false;
  public numberOfFlex = 0;
  initAbsence() {
    const data = this.modal_data;
    this.absence = { ...data.absence };
    this.numberOfFlex = data.numberOfFlex;
    this.setShowFlex();
  }

  setShowFlex() {
    if (this.absence.flex == 1) {
      this.showFlex = true;
      return;
    }
    if (this.numberOfFlex > 0) {
      this.showFlex = false;
    }
  }

  public editAbsenceForm;
  initForm() {

    this.editAbsenceForm = this.fb.group({
      AbsenceTypeID: [this.absence.AbsenceTypeID, []],
      ID: [ this.absence.AbsenceTypeID, []],
      Name: [ this.absence.Name, [ Validators.required ]],
      ShortName: [ this.absence.ShortName, [ Validators.required ]],
      timeCodeVisma: [ this.absence?.timeCodeVisma, []],
      timeCode: [ this.absence.timeCode, [ Validators.required ]],
      sortingScheme: [ this.absence.sortingScheme, []],
      color: [ this.absence.color, []],
      active: [ this.absence.active, []],
      paid: [ this.absence.paid, []],
      flex: [ this.absence.flex, [] ],
      stats: [ this.absence.stats, [] ]
    });
    this.initFormControlls();
  }

  public activeControl;
  public paidControl;
  public flexControl;
  public colorControl
  public statsControl;
  initFormControlls() {
    this.activeControl = this.editAbsenceForm.get('active');
    this.paidControl = this.editAbsenceForm.get('paid');
    this.flexControl = this.editAbsenceForm.get('flex');
    this.colorControl = this.editAbsenceForm.get('color');
    this.statsControl = this.editAbsenceForm.get('stats');
  }

  public spinner = false;
  async submit() {
    this.editAbsenceForm.markAllAsTouched();
    if (this.editAbsenceForm.invalid) return;
    const confirm = await this.onConfirmationModal();
    if (!confirm) return;
    const data = this.editAbsenceForm.value;
    let res;
    this.spinner = true;
    if (data.ID) {
      data.TimeCode = data.timeCode;
      data.SortingScheme = data.sortingScheme;
      data.Color = data.color;
      data.Active = data.active;
      res = await this.timeRegistrationService.updateAbsenceType(data).toPromise2();
    } else {
      res = await this.timeRegistrationService.createNewAbsenceType(data).toPromise2();
    }
    if (res.status) {
      this.responseSuccess(data, res);
    } else {

    }
    this.spinner = false;
  }

  responseSuccess(data, res) {
    const { AbsenceTypeID } = res;
    if (AbsenceTypeID) {
      data.ID = AbsenceTypeID;
      data.AbsenceTypeID = AbsenceTypeID;
    }
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
}


// deleteAbsenceType/89
