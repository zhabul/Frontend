import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-arrow-down-svg2',
  templateUrl: './arrow-down-svg2.component.html',
  styleUrls: ['./arrow-down-svg2.component.css']
})
export class ArrowDownSvg2Component implements OnInit {

  @Input('color') color;
  
  constructor() { }

  ngOnInit(): void {
  }

}
