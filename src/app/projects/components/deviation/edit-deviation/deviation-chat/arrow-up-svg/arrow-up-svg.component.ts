import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-arrow-up-svg',
  templateUrl: './arrow-up-svg.component.html',
  styleUrls: ['./arrow-up-svg.component.css']
})
export class ArrowUpSvgComponent implements OnInit {

  public color1:any;
  @Input('color') set color(value) {
   this.color1 = value;
   
  };

  constructor() { }

  ngOnInit(): void {
  }

}
