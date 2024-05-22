import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-folder-icon-with-params-svg',
  templateUrl: './folder-icon-with-params-svg.component.html',
})
export class FolderIconWithParamsSvgComponent implements OnInit {

  public widthParams = 23.5;
  public heightParams = 18.548;
  public colorParams = "#373b40"
  public strokeWidthParams = 1.5;
  public strokeColor= "#ff7000"
  public opacityVal=0.973;

  @Input() set width(value) {
    this.widthParams = value;
  }
  @Input() set height(value) {
    this.heightParams = value;
  }

  @Input() set color(value) {
    this.colorParams = '#' + value;
  }
  @Input() set colorStroke(value) {
    this.strokeColor = '#' + value;
  }
  @Input() set strokeWidth(value) {
    this.strokeWidthParams = value;
  }
  @Input() set opacityValue(value) {
    this.opacityVal = value;
  }
  constructor() { }

  ngOnInit(): void {
  }
}
