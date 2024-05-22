import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-arrow-dropdown',
  templateUrl: './arrow-dropdown.component.html',
  styleUrls: ['./arrow-dropdown.component.css']
})
export class ArrowDropdownComponent implements OnInit {

  public setFill = 'var(--border-color)';
  public setRotate ='rotate(0)';
  @Input('fill') set fill(value) {
    /*console.log(value)*/
    if(value?.length >0){
      this.setFill = value;
    }else{
      this.setFill = 'var(--border-color)';
    }
  };
  @Input('rotate') set rotate(value) {

    this.setRotate = value;
  };
  constructor() { }

  ngOnInit(): void {
  }

}
