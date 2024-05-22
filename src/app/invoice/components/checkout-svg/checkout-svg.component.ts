import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout-svg',
  templateUrl: './checkout-svg.component.html'

})

export class CheckoutSvgComponent  implements OnInit {
  public widthParams = 26;
  public heightParams = 26;
  @Input() set width(value) {
    this.widthParams = value;
  }
  @Input() set height(value) {
    this.heightParams = value;
  }
  constructor() { }

  ngOnInit(): void {
  }



}
