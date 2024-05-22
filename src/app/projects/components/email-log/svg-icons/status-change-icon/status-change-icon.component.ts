import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-status-change-icon',
  templateUrl: './status-change-icon.component.html',
  styleUrls: ['./status-change-icon.component.css']
})
export class StatusChangeIconComponent implements OnInit {

  @Input() status: string;
  @Input() color: string;

  constructor() { }

  ngOnInit(): void {
  }

}
