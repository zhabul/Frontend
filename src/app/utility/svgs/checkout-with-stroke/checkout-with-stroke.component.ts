import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout-with-stroke',
  templateUrl: './checkout-with-stroke.component.html',
})
export class CheckoutWithStrokeComponent implements OnInit {
  public widthParams = 26;
  public heightParams = 26;
  public colorParams = "#707070"
  public strokeWidthParams = 1;
  public fillColor = 'none';


  @Input() set width(value) {
    this.widthParams = value;
  }
  @Input() set height(value) {
    this.heightParams = value;
  }
  @Input() set color(value) {
    this.colorParams = '#' + value;
  }
  @Input() set strokeWidth(value) {
    this.strokeWidthParams = value;
  }
  @Input() set fill(value: string) {
    this.fillColor = value === 'transparent' ? 'none' : value;
  }



  constructor() { }

  ngOnInit(): void {
  }

}
