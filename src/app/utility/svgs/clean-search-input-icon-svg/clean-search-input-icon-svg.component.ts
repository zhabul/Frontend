import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-clean-search-input-icon-svg',
  templateUrl: './clean-search-input-icon-svg.component.html'
})
export class CleanSearchInputIconSvgComponent implements OnInit {

  public widthParams = 10;
  public heightParams = 10;
  public colorParams = "#fcf4ec"
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
