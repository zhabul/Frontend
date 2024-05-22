import { Component, OnInit, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-sps-color-picker',
  templateUrl: './sps-color-picker.component.html',
  styleUrls: ['./sps-color-picker.component.css']
})
export class SpsColorPickerComponent implements OnInit {

  @Input('text') text;
  @Input('control') control;

  @ViewChild('colorPickerInput') colorPickerInput;

  constructor() { }

  ngOnInit(): void {
  }

  open() {
    this.colorPickerInput.nativeElement.click();
  }

  setColor($event) {
    this.control.setValue($event.target.value);
  }

}
