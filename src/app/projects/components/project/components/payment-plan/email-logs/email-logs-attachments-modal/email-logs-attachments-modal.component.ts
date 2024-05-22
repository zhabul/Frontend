import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-email-logs-attachments-modal',
  templateUrl: './email-logs-attachments-modal.component.html',
  styleUrls: ['./email-logs-attachments-modal.component.css']
})
export class EmailLogsAttachmentsModalComponent implements OnInit {
  public attachments = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.attachments = this.data.attachments;

  }

}
