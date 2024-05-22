import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-prognosis-layout-blue-table-two',
  templateUrl: './prognosis-layout-blue-table-two.component.html',
  styleUrls: ['./prognosis-layout-blue-table-two.component.css']
})
export class PrognosisLayoutBlueTableTwoComponent implements OnInit {
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
