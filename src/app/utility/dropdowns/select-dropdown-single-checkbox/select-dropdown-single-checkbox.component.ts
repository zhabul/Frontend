import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-dropdown-single-checkbox',
  templateUrl: './select-dropdown-single-checkbox.component.html',
  styleUrls: ['./select-dropdown-single-checkbox.component.css']
})
export class SelectDropdownSingleCheckboxComponent implements OnInit {
  public ref = 'Valj KS';
  public localSelectedItem: any;
  public border = '1px solid var(--border-color)';
  public fill: any;
  public rotate: any;
  public color: any;
  public color1: any;

  public toggle: boolean = false;
  public allselected: boolean = false;


  @Input('MaterialData') set selectedItem(value) {
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

  /**Postavke Hover-a Dropdown liste ako su true min 2 checkbox promjeni boju u naranđastu, ali ako su svi true/false ostavi default sivu boju */
  counter3: number = 0;
  setColorDropDownSelect(item) {

    this.counter3 = 0

    for(let i = 0; i < this.localSelectedItem.length ; i++){
      if(this.localSelectedItem[i].checked == true){
        this.counter3 ++;
      }
    }

    if(this.counter3 > 0 && this.counter3 < this.localSelectedItem.length){
      if(item.checked){
        return 'var(--orange-dark)';
      }
      return 'var(--border-color)';
    }

  }
  /** */

  getSelectedItem(material){
    material.checked = !material.checked;


    this.allselected = this.CheckedItemStatus();
  }

  /**Funkcija za provjeru all select user prilikom odabira jednog po jednog user-a */
  CheckedItemStatus(){

    for(let i = 0; i < this.localSelectedItem.length ; i++){
      if(this.localSelectedItem[i].checked == false || this.localSelectedItem[i].checked == undefined ){
        return false;
      }
    }
    return true;

  }
  /** */
}
