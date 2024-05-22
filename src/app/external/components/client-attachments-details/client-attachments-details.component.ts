import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-client-attachments-details',
  templateUrl: './client-attachments-details.component.html',
  styleUrls: ['./client-attachments-details.component.css']
})
export class ClientAttachmentsDetailsComponent implements OnInit {

  @Input() selcted_data;
  @Input() type;

  constructor() { }

  ngOnInit(): void {
  }

}
