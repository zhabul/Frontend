import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-exclamation-mark-svg',
  templateUrl: './exclamation-mark-svg.component.html',
})
export class ExclamationMarkSvgComponent implements OnInit {

  public widthParams = 49.611;
  public heightParams = 49.611;
  public colorParams = "#b63418"
  public colorParams1 = "#fff"
  public colorParams2 = "#fff"


  @Input() set width(value) {
    this.widthParams = value;
  }
  @Input() set height(value) {
    this.heightParams = value;
  }

  @Input() set color(value) {
    this.colorParams = '#' + value;
  }

  @Input() set colorExclamation(value) {
    this.colorParams1 = '#' + value;
  }
  @Input() set colorFullStop(value) {
    this.colorParams2 = '#' + value;
  }
  constructor() { }

  ngOnInit(): void {
  }
}
