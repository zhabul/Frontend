import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-arrow-for-first-dropdown',
  templateUrl: './arrow-for-first-dropdown.component.html',
  styleUrls: ['./arrow-for-first-dropdown.component.css']
})
export class ArrowForFirstDropdownComponent implements OnInit {

  public setFill = 'var(--border-color)';
  public setRotate ='rotate(0)';
  @Input('fill') set fill(value) {
    /* console.log("Ovo je sad arrow novi");
    console.log(value) */
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
