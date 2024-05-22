import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EmailLogsAttachmentsModalComponent } from './email-logs-attachments-modal/email-logs-attachments-modal.component';

@Component({
  selector: 'app-email-logs',
  templateUrl: './email-logs.component.html',
  styleUrls: ['./email-logs.component.css']
})
export class EmailLogsComponent implements OnInit {
  @Input() logs: any;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  viewAttachmentsSent(attachments) {
    if(attachments) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.width = '50%';
        dialogConfig.data = { attachments };
        this.dialog.open(EmailLogsAttachmentsModalComponent, dialogConfig);
    }
}

}
