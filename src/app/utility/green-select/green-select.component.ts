import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-green-select',
  templateUrl: './green-select.component.html',
  styleUrls: ['./green-select.component.css']
})
export class GreenSelectComponent implements OnInit {

  @Input('text') text;
  @Input('value') value;
  @Input('all') all = false;
  @Output('changeEvent') changeEvent: EventEmitter<boolean> = new EventEmitter();

  constructor() { } 

  ngOnInit(): void {

  }

  toggleSelect() {
    this.value = !this.value;
    this.changeEvent.emit(this.value);
  }
}

