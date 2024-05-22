import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from "@angular/material/dialog";
import { TimeRegistrationService } from 'src/app/core/services/time-registration.service';
import { EmpityErstTypeInterface, emptyErstType } from '../utils';
import { ConfirmationModalComponent } from 'src/app/shared/modals/confirmation-modal/confirmation-modal.component';
import { take } from 'rxjs';
import { MaterialsService } from 'src/app/core/services/materials.service';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-ersattningsvarotyper-editor',
  templateUrl: './ersattningsvarotyper-editor.component.html',
  styleUrls: ['./ersattningsvarotyper-editor.component.css']
})
export class ErsattningsvarotyperEditorComponent implements OnInit {

    public disable_units:boolean = false;

    constructor(
        private fb: FormBuilder,
        private timeRegistrationService: TimeRegistrationService,
        private materialsService: MaterialsService,
        public dialogRef: MatDialogRef<ErsattningsvarotyperEditorComponent>,
        @Inject(MAT_DIALOG_DATA) public modal_data: any,
        private dialog: MatDialog,
        public translate: TranslateService
    ) { }

    ngOnInit(): void {
        this.getUnits();
        if(this.modal_data['measure_unit'] && this.modal_data['measure_unit'].length > 0) {
            this.disable_units = true;
        }
    }

  public units = [];
  async getUnits() {

    this.units = await this.materialsService.getMileageUnits();
    this.initType();
    this.initForm();
  }

  public erstType:EmpityErstTypeInterface = { ...emptyErstType };
  public showFlex = false;
  initType() {
    const data = this.modal_data;
    this.erstType = { ...data.erstType };
    this.showFlex = data.number_of_flex > 0 ? false : true;
  }

  public editErstTypeForm;
  initForm() {
    const disabled = this.erstType.id === null ? false : true;
    this.editErstTypeForm = this.fb.group({
      id: [this.erstType.id, []],
      name: [ { value: this.erstType.name, disabled: disabled }, [ Validators.required ]],
      quantity: [ { value: this.erstType.quantity, disabled: disabled }, [ Validators.required ]],
      timecode_visma: [ this.erstType.timecode_visma, []],
      timecode: [ this.erstType.timecode, [ Validators.required ]],
      unit: [ { value: this.erstType.unit , disabled: disabled }, [ Validators.required ]],
      active: [ this.erstType.active, []]
    });
    this.initFormControlls();
    if(this.disable_units) {
        let unit = this.units.find((un)=> { return un.mileageUnits == this.modal_data['measure_unit']});
        this.editErstTypeForm.get("unit").patchValue(unit.ID);
        this.editErstTypeForm.get('unit').disable();

    }
  }

  public activeControl;
  initFormControlls() {
    this.activeControl = this.editErstTypeForm.get('active');
  }

  public spinner = false;
  async submit() {
    this.editErstTypeForm.markAllAsTouched();
    if (this.editErstTypeForm.invalid) return;
    const confirm = await this.onConfirmationModal();
    if (!confirm) return;
    const data = this.editErstTypeForm.getRawValue();
    data.quantity = data.quantity.toString().replace(/\s/g, "").replace(",", ".");
    let res;
    this.spinner = true;
    if (data.id) {
      res = await this.timeRegistrationService.updateMileageType(data).toPromise2();
    } else {
      res = await this.timeRegistrationService.createNewMileageType(data).toPromise2();
    }
    if (res.status) {
      this.responseSuccess(data, res);
    } else {

    }
    this.spinner = false;
  }

  responseSuccess(data, res) {
    const { id } = res;
    if (id) {
      data.id = id;
    }
    const unit = this.units.find((unit)=>unit.ID == data.unit);
    data.unit_name = unit.Unit;
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
