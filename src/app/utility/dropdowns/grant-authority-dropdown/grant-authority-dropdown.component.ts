import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-grant-authority-dropdown',
  templateUrl: './grant-authority-dropdown.component.html',
  styleUrls: ['./grant-authority-dropdown.component.css']
})
export class GrantAuthorityDropdownComponent implements OnInit {
  public ref = 'TILLDELA BEHÖRIGHET';
  public localSelectedItem: any;
  public toggle: boolean = false;
  public border = '1px solid var(--project-color)';
  public color = 'var(--project-color)';
  public color1: any;
  public color2: any;

  public fill = 'var(--project-color)';
  public fill1: any;
  public fill2: any;
  public rotate: any;


  @Input('Authority') set selectedItem(value) {
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
    this.setColorTitle();
    this.setFillColor();
    this.setRotate();

  }

  setBorderColor(){
    if(this.toggle){
      this.border = '2px solid var(--orange-dark)';
    }else{
      this.border = '1px solid var(--project-color)';
    }
  }

  setColorTitle(){
    if(this.toggle){
      this.color = 'var(--orange-dark)';
    }else{
      this.color = 'var(--project-color)';
    }
  }

  setFillColor(){
    if(this.toggle){
      this.fill = 'var(--orange-dark)';
    }else{
      this.fill = 'var(--project-color)';
    }
  }

  setRotate(){
    if(this.toggle){
      this.rotate = 'rotate(180)';
    }else{
      this.rotate = 'rotate(0)';
    }
  }

  getSelectedItem(user){
    user.checked = !user.checked;
  }

  onMouseEnter(){
    this.fill1 = 'var(--orange-dark)';
    this.color1 = 'var(--orange-dark)';
  }

  onMouseOut(){
    this.fill1 = 'var(--main-bg)';
    this.color1 = 'var(--border-color)';
  }


  /**Postavke Hover-a Dropdown liste ako su true min 1 checkbox promjeni boju u naranđastu, ali ako su svi true/false ostavi default sivu boju */
  counter3: number = 0;
  setColorDropDownSelect(item) {

    this.counter3 = 0

    for(let i = 0; i < this.localSelectedItem.length ; i++){
      if(this.localSelectedItem[i].checked == true){
        this.counter3 ++;
      }
    }

    if(this.counter3 > 0 ){
      if(item.checked){
        return 'var(--orange-dark)';
      }
      this.color2 = 'var(--orange-dark)';
      this.fill2 = 'var(--orange-dark)';
      return 'var(--border-color)';
    }
    this.color2 = 'var(--border-color)';
    this.fill2 = 'var(--main-bg)';
  }
  /** */
}
