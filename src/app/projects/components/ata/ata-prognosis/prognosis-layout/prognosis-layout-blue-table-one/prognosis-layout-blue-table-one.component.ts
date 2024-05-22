import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-prognosis-layout-blue-table-one',
  templateUrl: './prognosis-layout-blue-table-one.component.html',
  styleUrls: ['./prognosis-layout-blue-table-one.component.css']
})
export class PrognosisLayoutBlueTableOneComponent implements OnInit {
  /* @Input('_prognosis') set _prognosis(value) {
    if (value != this.prognosis) this.prognosis = value;
  } */

  @Input('_prognosis') _prognosis;

  prognosis;

  constructor() { }

  ngOnInit(): void {
    this.prognosis = structuredClone(this._prognosis);
  }

}
