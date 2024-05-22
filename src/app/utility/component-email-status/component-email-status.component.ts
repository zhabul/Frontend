import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { setEmailStatus } from './utils';

@Component({
  selector: 'app-component-email-status',
  templateUrl: './component-email-status.component.html',
  styleUrls: ['./component-email-status.component.css']
})
export class ComponentEmailStatusComponent implements OnInit, OnChanges {

  @Input('emailLogs') emailLogs = [];

  public color = '#fff335';
  public status = 'Draft';

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    const { color, statusText } = setEmailStatus(this.emailLogs);
    this.color = color;
    this.status = statusText;
  }




}
