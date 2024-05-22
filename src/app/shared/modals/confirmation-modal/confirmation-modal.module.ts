import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ConfirmationModalComponent } from "./confirmation-modal.component";
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { DragDropModule } from "@angular/cdk/drag-drop";

@NgModule({
  imports: [CommonModule, MatDialogModule, FormsModule, TranslateModule],
  exports: [ConfirmationModalComponent],
  entryComponents: [ConfirmationModalComponent],
  declarations: [ConfirmationModalComponent],
})

export class ConfirmationModalModule {
    imports: [
        DragDropModule
    ]
}
