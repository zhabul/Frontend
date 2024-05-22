import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { Subject } from 'rxjs';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent {
  public questionText = "";
  public commentTitle;
  public commentMessage = "";
  public subject: Subject<boolean>;

  constructor(
    private translate: TranslateService,
    public dialogRef: MatDialogRef<ConfirmModalComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any
  ) {
      if (this.modal_data) {
        this.questionText = modal_data.questionText;
      } else {
        this.questionText = this.translate.instant("If you leave before saving, your changes will be lost");
        this.questionText += " ?";
      }
   }

  accept() {
    if(this.subject) {
      this.subject.next(true);
      this.subject.complete();
    }
    this.dialogRef.close({
      result: true,
      reason: this.commentMessage
    });
  }

  reject() {
    if(this.subject) {
      this.subject.next(false);
      this.subject.complete();
    }
    this.dialogRef.close({
      result: false,
      reason: this.commentMessage,
    });
  }

  onXClick(): void {
    this.dialogRef.close();
  }

}
