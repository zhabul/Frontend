import { Component, OnInit, Inject } from "@angular/core";
//import { TranslateService } from "@ngx-translate/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-comments-modal',
  templateUrl: './comments-modal.component.html',
  styleUrls: ['./comments-modal.component.css']
})
export class CommentsModalComponent implements OnInit {

  constructor(
  //  private translate: TranslateService,
    public dialogRef: MatDialogRef<CommentsModalComponent>,
     @Inject(MAT_DIALOG_DATA) public modal_data: any,
  ) {}

    public comments:any[] = [];

    ngOnInit(): void {
        this.comments = this.modal_data.comments;
    }

    close(parameter = false) {
        this.dialogRef.close(parameter);
    }
}
