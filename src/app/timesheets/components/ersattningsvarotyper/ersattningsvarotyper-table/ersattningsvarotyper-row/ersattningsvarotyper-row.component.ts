import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ErsattningsvarotyperEditorComponent } from '../ersattningsvarotyper-editor/ersattningsvarotyper-editor.component';
import { TimeRegistrationService } from 'src/app/core/services/time-registration.service';
import { ConfirmationModalComponent } from 'src/app/shared/modals/confirmation-modal/confirmation-modal.component';
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { take } from 'rxjs';

@Component({
  selector: 'app-ersattningsvarotyper-row',
  templateUrl: './ersattningsvarotyper-row.component.html',
  styleUrls: [
    './ersattningsvarotyper-row.component.css',
    '../ersattningsvarotyper-table.component.css',
  ]
})
export class ErsattningsvarotyperRowComponent implements OnInit {

  @Input('type') type;
  @Input('nr') nr;
  @Input('disabled') disabled;

  @Output('removeListener') removeListener:EventEmitter<any> = new EventEmitter();

  constructor(
    private dialog: MatDialog,
    private timeRegistrationService: TimeRegistrationService,
    public translate: TranslateService,
    private toastr: ToastrService,
    ) { }

  ngOnInit(): void {

  }

  public status = 'Active';
  ngOnChanges() {
    this.resolveActive();
  }

  resolveActive() {
    if (this.type.active == 1) {
      this.status = 'Active';
    } else {
      this.status = 'Inactive';
    }
  }

  openEditTypeModal(erstType = false) {
    if (this.disabled) return;
    const diaolgConfig = this.generateDialogConfig(erstType);
    this.dialog
      .open(ErsattningsvarotyperEditorComponent, diaolgConfig)
      .afterClosed()
      .subscribe(this.dialogAfterClose.bind(this));
  }

  dialogAfterClose(type) {
    if (type) {
      this.type = type;
      this.resolveActive();
      this.toastr.success(this.translate.instant('CUD_mileage_type_updated'), this.translate.instant('Success'));
    }
  }

  generateDialogConfig(erstType) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.width = '677px';
    diaolgConfig.height = 'auto';
    diaolgConfig.data = {
      erstType: erstType
    };
    return diaolgConfig;
  }

  async removeType(type) {
    if (this.disabled) return;
    const confirm = await this.onConfirmationModal();
    if (!confirm) return;
    await this.timeRegistrationService.deleteMileageType(type.id).toPromise2();
    this.toastr.success(this.translate.instant('CUD_mileage_type_removed'), this.translate.instant('Success'));
    this.removeListener.emit(type);
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
