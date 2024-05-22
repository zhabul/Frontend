import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from "./confirm-modal.component";
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";



@NgModule({
  declarations: [ConfirmModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    TranslateModule
  ],
  exports: [ConfirmModalComponent],
  entryComponents: [ConfirmModalComponent],
})
export class ConfirmModalModule { }
