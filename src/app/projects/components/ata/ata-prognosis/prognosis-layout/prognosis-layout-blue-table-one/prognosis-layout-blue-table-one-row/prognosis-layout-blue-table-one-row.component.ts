import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-prognosis-layout-blue-table-one-row',
  templateUrl: './prognosis-layout-blue-table-one-row.component.html',
  styleUrls: ['./prognosis-layout-blue-table-one-row.component.css']
})
export class PrognosisLayoutBlueTableOneRowComponent implements OnInit {
  @Input('_property') set _property(value) {
    if (value != this.property) this.property = value;
  }

  property;

  constructor() { }

  ngOnInit(): void {
  }

}
