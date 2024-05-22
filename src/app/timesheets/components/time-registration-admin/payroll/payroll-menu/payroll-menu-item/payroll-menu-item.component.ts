import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialogConfig, MatDialog } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ConfirmationModalComponent } from 'src/app/shared/modals/confirmation-modal/confirmation-modal.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-payroll-menu-item',
  templateUrl: './payroll-menu-item.component.html',
  styleUrls: ['./payroll-menu-item.component.css']
})
export class PayrollMenuItemComponent implements OnInit {

  @Input('title') title;
  @Input('confirm') confirm = true;
  @Input('hasUsers') hasUsers = true;
  @Input('type') type = '';
  @Input('users') users = [];
  @Output('itemEvent') itemEvent:EventEmitter<any> = new EventEmitter();

  constructor(
    private toastr: ToastrService,
    private dialog: MatDialog,
    public translate: TranslateService
    ) { }

  ngOnInit(): void {}

  public color = '';
  mouseEnter() {
    this.color = 'var(--brand-color)';
  }
  mouseLeave() {
    this.color = '';
  }

  async dispatchAction() {
    if (!this.users.length && this.hasUsers) {
      this.toastr.info(this.translate.instant('CUD_Please_select_at_least_one_user'), this.translate.instant('Info'));
      return;
    };
    let confirm = true;
    if (this.confirm) {
       confirm = await this.onConfirmationModal();
    }
    if (!confirm) return;
    this.itemEvent.emit();
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

}
