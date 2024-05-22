import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-dropdown-multiselect',
  templateUrl: './user-dropdown-multiselect.component.html',
  styleUrls: ['./user-dropdown-multiselect.component.css']
})
export class UserDropdownMultiselectComponent implements OnInit {

  public ref = 'User';
  public localSelectedItem: any;
  public border = '1px solid var(--border-color)';
  public fill: any;
  public rotate: any;
  public color: any;
  public color1: any;

  public toggle: boolean = false;
  public allselected: boolean = false;
  public checkedList:{};
  public oneSelected: boolean = false;
  public selectedAll: any;
  public checkedValue :any;
  public checkedstatus : any;

  @Input('User') set selectedItem(value) {
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
    this.ChangeTitleWhenOpenCloseToggle();
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

    this.GetNameSurnameOfFirstActiveUserInDropdown();

  }
  /** */

  /** DropDown Title Change */
  counter4: number = 0;
  ChangeTitleWhenOpenCloseToggle(){

  this.counter4 = 0;
    for(let i = 0; i < this.localSelectedItem.length ; i++){
      if(this.localSelectedItem[i].checked == true){
        this.counter4++;
      }
    }

    if(this.toggle){
      if(this.counter4 == this.localSelectedItem.length){
        return this.ref = 'Användare';
      }else{
        this.GetNameSurnameOfFirstActiveUserInDropdown();
      }
    }else{
      this.ref = 'User';
    }

  }
  /** */

    /**Get First Active Clicked User */
    GetNameSurnameOfFirstActiveUserInDropdown(){
      for(let i = 0; i < this.localSelectedItem.length ; i++){
        if(this.localSelectedItem[i].checked == true){
          return this.ref = this.localSelectedItem[i].Name;
        }
      }
      return this.ref = 'Användare';
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

    /**Ako su svi true ili ako su svi false */
    allIsChecked(){
      this.localSelectedItem.forEach((el)=>{
       el.checked = true;
      });
      this.ref = 'Användare';

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

    /**Postavke Hover-a Dropdown liste ako su true min 2 checkbox promjeni boju u naranđastu, ali ako su svi true/false ostavi default sivu boju */
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
        return 'var(--border-color)';
      }

    }
    /** */

}
