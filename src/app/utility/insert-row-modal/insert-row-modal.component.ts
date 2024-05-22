import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-insert-row-modal',
  templateUrl: './insert-row-modal.component.html',
  styleUrls: ['./insert-row-modal.component.css']
})
export class InsertRowModalComponent implements OnInit {

  @Input('index') index;
  @Output('addRow') addRow:EventEmitter<number> = new EventEmitter();
  @Output('fontWeight') fontWeight:EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  addRowByIndex(coef) {
    this.addRow.emit(this.index + coef);
  }

  changeFontWeight(fontWeight) {
    this.fontWeight.emit(fontWeight);
  }

}
