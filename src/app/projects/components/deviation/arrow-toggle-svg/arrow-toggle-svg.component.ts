import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-arrow-toggle-svg',
  templateUrl: './arrow-toggle-svg.component.html',
  styleUrls: ['./arrow-toggle-svg.component.css']
})
export class ArrowToggleSvgComponent implements OnInit {

  @Input('opened') set setOpened(value) {
    this.setSvgTransform(this.calculateDegrees(value));
  };

  public svgTransform = {};

  constructor() { }

  ngOnInit(): void {
  }

  calculateDegrees(value) {
    return value ? "0deg" : "180deg";
  }

  setSvgTransform(deg) {
    this.svgTransform = {
      transform: `rotate(${deg})`
    };
  }
}