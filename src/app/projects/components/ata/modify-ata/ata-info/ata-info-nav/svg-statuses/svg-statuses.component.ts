import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-svg-statuses',
  templateUrl: './svg-statuses.component.html',
  styleUrls: ['./svg-statuses.component.css']
})
export class SvgStatusesComponent implements OnInit {
  @Input() iconColor;
  @Input() type;
  constructor() { }

  ngOnInit(): void {
  }

}
