import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-confirmation-modal",
  templateUrl: "./confirmation-modal.component.html",
  styleUrls: ["./confirmation-modal.component.css"],
})
export class ConfirmationModalComponent {
  public project: any;
  public absence: any;
  public user_id: number;
  public questionText = "";
  public commentTitle;
  public commentMessage = "";

  constructor(
    private translate: TranslateService,
    public dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any
  ) {


    if (this.modal_data) {
      this.questionText = modal_data.questionText;
      this.commentTitle = modal_data.commentTitle;
    } else {
      this.questionText = this.translate.instant("Are you sure?");
    }
  }

  accept() {
    this.dialogRef.close({
      result: true,
      reason: this.commentMessage,
    });
  }

  reject(type) {
    this.dialogRef.close({
      result: false,
      reason: this.commentMessage,
      type: type
    });
  }
}
