import { Component, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-category-dropdown',
  templateUrl: './category-dropdown.component.html',
  styleUrls: ['./category-dropdown.component.css']
})
export class CategoryDropdownComponent implements OnInit {

  public toggle: boolean = false;
  public ref = 'Valj kategori';
  public localCategoryItem: any;

  public border = '1px solid var(--border-color)';
  public fill: any;
  public rotate: any;
  public color: any;

  @Output() emitSelectedUser;

  @Input('CategoryItem') set CategoryItem(value) {
    if(value.length >0){
      this.localCategoryItem= value;
    }else{
      this.localCategoryItem = [];
    }
  };

  constructor() { }

  ngOnInit(): void {
    //console.log(this.localCategoryItem);
  }

  onToggleMenu(){
    this.toggle = !this.toggle;
    this.setFillColor();
    this.setRotate();
    this.setBorderColor();
    this.setColorTitle();
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

  setColorTitle(){
    if(this.toggle){
      this.color = 'var(--orange-dark)';
    }else{
      this.color = 'var(--border-color)';
    }
  }

  Select(value){
    // console.log(value);
    /*this.selectedISO = val;
    this.containerDisplay = false;*/

    //console.log("Hello there !!");
  }

}
