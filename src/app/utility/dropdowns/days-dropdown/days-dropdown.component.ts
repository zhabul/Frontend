import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-days-dropdown',
  templateUrl: './days-dropdown.component.html',
  styleUrls: ['./days-dropdown.component.css']
})
export class DaysDropdownComponent implements OnInit {

  public ref = 'Days';
  public localSelectedItem: any;
  public border = '1px solid var(--border-color)';
  public fill: any;
  public rotate: any;
  public color: any;
  public color1: any;

  public toggle: boolean = false;

  @Input('Days') set selectedItem(value) {
    if(value.length >0){
      this.localSelectedItem = value;
    }else{
      this.localSelectedItem = [];
    }
  };
  constructor() { }

  ngOnInit(): void {

  }

  toogleMultiselect(){
    this.toggle = !this.toggle
    this.setBorderColor();
    this.setFillColor();
    this.setRotate();
    this.setColorTitle();
  }

  setColorTitle(){
    if(this.toggle){
      this.color = 'var(--orange-dark)';
    }else{
      this.color = 'var(--border-color)';
    }
  }

  setFillColor(){
    if(this.toggle){
      this.fill = 'var(--orange-dark)';
    }else{
      this.fill = 'var(--border-color)';
    }
  }

  setRotate(){
    if(this.toggle){
      this.rotate = 'rotate(180)';
    }else{
      this.rotate = 'rotate(0)';
    }
  }

  setBorderColor(){
    if(this.toggle){
      this.border = '2px solid var(--orange-dark)';
    }else{
      this.border = '1px solid var(--border-color)';
    }
  }

  Select(value){

    if(value){
      this.ref = value;
    }else{
      this.ref = 'Days';
    }
    /*this.selectedISO = val;
    this.containerDisplay = false;*/

  }

}
