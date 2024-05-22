import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-three-dots-svg',
  templateUrl: './three-dots-svg.component.html',
  styleUrls: ['./three-dots-svg.component.css']
})
export class ThreeDotsSvgComponent implements OnInit {
  // @Input() color;

  public color1:any;
  @Input('color') set color(value) {
   this.color1 = value;
   
  };
  constructor() { }

  ngOnInit(): void {
  }

}
