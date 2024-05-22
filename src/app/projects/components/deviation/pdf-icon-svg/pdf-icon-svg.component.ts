import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pdf-icon-svg',
  templateUrl: './pdf-icon-svg.component.html',
  styleUrls: ['./pdf-icon-svg.component.css']
})
export class PdfIconSvgComponent implements OnInit {
  public pathStyle = { fill: 'black' };
  @Input('color') set setColor(value) {
    setTimeout(() => {
       this.pathStyle = { fill: value };
      }, 150)
  };
  constructor() { }

  ngOnInit(): void {
  }

}
