import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-multiselect-dropdown-project',
  templateUrl: './multiselect-dropdown-project.component.html',
  styleUrls: ['./multiselect-dropdown-project.component.css']
})
export class MultiselectDropdownProjectComponent implements OnInit {

  public ref = 'Projektnamn';
  public localSelectedItem: any;
  public border = '1px solid var(--border-color)';
  public fill: any;
  public rotate: any;
  public color: any;
  public color1: any;

  public toggle: boolean = false;
  public allselected: boolean = false;

  @Input('ProjectData') set selectedItem(value) {
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

    /**Selektiranje nasumicnih user-a  */
    getSelectedItem(user){
      user.checked = !user.checked;

      this.allselected = this.CheckedItemStatus();
    }
    /** */

      /**Selektrianje svih vrijednosti na true ili false */
  selectAll(){
    this.allselected = !this.allselected;
    if(this.allselected){
      this.allIsChecked();

    }
    else{
      this.localSelectedItem.forEach((el)=>{
        el.checked = false;
        });

    }

  }
  /** */

  /**Ako su svi true ili ako su svi false */
  allIsChecked(){
    this.localSelectedItem.forEach((el)=>{
     el.checked = true;
    });

  }
  /** */

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
