import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkin-svg-for-first-dropdown',
  templateUrl: './checkin-svg-for-first-dropdown.component.html',
  styleUrls: ['./checkin-svg-for-first-dropdown.component.css']
})
export class CheckinSvgForFirstDropdownComponent implements OnInit {

  public widthParams = 26;
  public heightParams = 26;
  public colorParams = "#03D156"
  public hatchedParams = "#373B40"
  @Input() set width(value) {
    this.widthParams = value;
  }
  @Input() set height(value) {
    this.heightParams = value;
  }

  @Input() set color(value) {
    this.colorParams = '#' + value;
  }
  @Input() set hatched(value) {
    this.hatchedParams = value;
  }
  constructor() { }

  ngOnInit(): void {
/*     console.log("Tu sam IN  ")
 */  }

}
