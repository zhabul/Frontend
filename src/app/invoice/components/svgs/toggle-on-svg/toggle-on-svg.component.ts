import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-toggle-on-svg',
  templateUrl: './toggle-on-svg.component.html',
  styleUrls: ['./toggle-on-svg.component.css']
})
export class ToggleOnSvgComponent implements OnInit {

  public widthParams = 15;
  public heightParams = 8;
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
