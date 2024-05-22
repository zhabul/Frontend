import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-icon-with-params-svg',
  templateUrl: './search-icon-with-params-svg.component.html',
  styleUrls: ['./search-icon-with-params-svg.component.css']
})
export class SearchIconWithParamsSvgComponent implements OnInit {
  public widthParams = 13;
  public heightParams = 13.06;
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
