import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-checkin-svg',
  templateUrl: './checkin-svg.component.html'
})
export class CheckinSvgComponent implements OnInit {
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
  }
}
