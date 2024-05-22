import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-print-svg-icon',
  templateUrl: './print-svg-icon.component.html',
  styleUrls: ['./print-svg-icon.component.css']
})
export class PrintSvgIconComponent implements OnInit {

  public iconStyle = { fill: '#444' };

  @Input('color') set setColor(value) {
    this.iconStyle = { fill: value };
  };
  @Input() size = 'large';

  constructor() { }
 
  ngOnInit(): void {
  }
}