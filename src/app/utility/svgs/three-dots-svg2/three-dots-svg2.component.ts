import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-three-dots-svg2',
  templateUrl: './three-dots-svg2.component.html',
  styleUrls: ['./three-dots-svg2.component.css']
})
export class ThreeDotsSvg2Component implements OnInit {

  public color1:any;
  @Input('color') set color(value) {
   this.color1 = value;
  };
  
  constructor() { }

  ngOnInit(): void {
  }

}
