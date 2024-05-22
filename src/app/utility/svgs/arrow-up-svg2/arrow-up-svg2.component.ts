import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-arrow-up-svg2',
  templateUrl: './arrow-up-svg2.component.html',
  styleUrls: ['./arrow-up-svg2.component.css']
})
export class ArrowUpSvg2Component implements OnInit {

  public color1:any;
  @Input('color') set color(value) {
   this.color1 = value;
  };

  constructor() { }

  ngOnInit(): void {
  }

}
