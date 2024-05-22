import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout-svg-for-first-dropdown',
  templateUrl: './checkout-svg-for-first-dropdown.component.html',
  styleUrls: ['./checkout-svg-for-first-dropdown.component.css']
})
export class CheckoutSvgForFirstDropdownComponent implements OnInit {

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
/*     console.log("tu sam u out");
 */  }



}
