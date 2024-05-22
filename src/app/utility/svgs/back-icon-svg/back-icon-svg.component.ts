import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-back-icon-svg',
  templateUrl: './back-icon-svg.component.html',
})
export class BackIconSvgComponent implements OnInit {

  public widthParams = 34;
  public heightParams = 29;
  public colorParams = "#82a7e2"
  @Input() set width(value) {
    this.widthParams = value;
  }
  @Input() set height(value) {
    this.heightParams = value;
  }

  @Input() set color(value) {
    this.colorParams = '#' + value;
  }
  constructor() { }

  ngOnInit(): void {
  }

}
