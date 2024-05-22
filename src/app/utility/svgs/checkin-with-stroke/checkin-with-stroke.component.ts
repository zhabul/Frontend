import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkin-with-stroke',
  templateUrl: './checkin-with-stroke.component.html',
})
export class CheckinWithStrokeComponent implements OnInit {
  public widthParams = 26;
  public heightParams = 26;
  public strokeWidthParams = 1;
  public colorCheck = "#fff"
  public strokeColorCheck = "#fff"
  public backgroundCircle='#e67314';
  public backgroundAroundBorderCircle='#e67314';





  @Input() set width(value) {
    this.widthParams = value;
  }
  @Input() set height(value) {
    this.heightParams = value;
  }
  @Input() set strokeWidth(value) {
    this.strokeWidthParams = value;
  }
  @Input() set checkColor(value) {
    this.colorCheck = '#' + value;
  }
  @Input() set strokeCheckColor(value) {
    this.colorCheck = '#' + value;
  }
  @Input() set backgroundForCircle(value) {
    this.backgroundCircle = '#' + value;
  }
  @Input() set backgroundAroundCircle(value) {
    this.backgroundAroundBorderCircle = '#' + value;
  }
  constructor() { }

  ngOnInit(): void {
  }

}
