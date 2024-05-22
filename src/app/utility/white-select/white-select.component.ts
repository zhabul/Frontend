import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';

@Component({
  selector: 'app-white-select',
  templateUrl: './white-select.component.html',
  styleUrls: ['./white-select.component.css']
})
export class WhiteSelectComponent implements OnInit, OnChanges {

  @Input('text') text;
  @Input('control') control;
  @Input('disabled') disabled = false;
  @Output('changeEvent') changeEvent: EventEmitter<number> = new EventEmitter();

  public value = 0;
 
  constructor() { } 

  ngOnInit(): void {
    this.setControlValue();
  }

  ngOnChanges(): void {
    this.setControlValue();
  }

  setControlValue() {
    this.value = Number(this.control.value);
  }

  toggleSelect() {
    if (this.disabled) return;
    this.value = this.value === 1 ? 0 : 1;
    this.control.setValue ? this.control.setValue(this.value) : '';
    this.changeEvent.emit(this.value);
  }
}

