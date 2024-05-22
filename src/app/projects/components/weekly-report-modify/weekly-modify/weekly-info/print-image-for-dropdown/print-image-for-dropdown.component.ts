import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-print-image-for-dropdown',
  templateUrl: './print-image-for-dropdown.component.html',
  styleUrls: ['./print-image-for-dropdown.component.css']
})
export class PrintImageForDropdownComponent implements OnInit {

  public setFill = 'var(--main-bg)';
  public setRotate ='rotate(0)';
  @Input('fill') set fill(value) {
    /*console.log(value)*/
    if(value?.length >0){
      this.setFill = value;
    }else{
      this.setFill = 'var(--main-bg)';
    }
  };

  constructor() { }

  ngOnInit(): void {
  }

}
