import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-arrow-icon-svg',
  templateUrl: './arrow-icon-svg.component.html',
  styleUrls: ['./arrow-icon-svg.component.css']
})
export class ArrowIconSvgComponent implements OnInit {

  public style = {};
  @Input('show') set setRotation(value) {
    if (value) { 
      this.style = { transform: 'rotate(0deg)' };
    } else {
      this.style = { transform: 'rotate(180deg)' };
    }
  };
  
  

  constructor() { }

  ngOnInit(): void {
  }

}
