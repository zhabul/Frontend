import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-single-select-dropdown',
  templateUrl: './single-select-dropdown.component.html',
  styleUrls: ['./single-select-dropdown.component.css']
})
export class SingleSelectDropdownComponent implements OnInit {

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
  public uncheckedAll:any;
  public ref;

  @Output() selected = new EventEmitter();
  @Output() PrintButton = new EventEmitter();
  @Input() disableSelect:boolean = false;
  @Input() placeholder: string;
  @Input() Print: string;
  @Input() Send: string;
  @Input() HaveSend: boolean;
  @Input() stylePosition;
  @Input('SendPrintUT1') set selectedItem(value) {
    if(value && value != undefined && value.length >0){
      this.localSelectedItem = value;
    }else{
      this.localSelectedItem = [];
    }
  };
  @ViewChild('dropdown') dropdownRef : ElementRef;
  @HostListener('document:click' , ['$event'])
  ondocumentClick(event: MouseEvent){
    if(!this.dropdownRef.nativeElement.contains(event.target)){
      this.toggle = false;
      this.border = '1px solid var(--project-color)';
      this.color = 'var(--project-color)';
      this.fill = 'var(--project-color)';
      this.rotate = 'rotate(0)';
      //this.EmptyDropdownWhenClose();
    }
  }

  constructor() { }

  ngOnInit(): void {
    
    this.ref = this.placeholder;
    if(!this.stylePosition || this.stylePosition ==  undefined) {
      this.stylePosition = {
        'left': '0px',
        'right': '0px',
        'top': '31px',
        'bottom': '0px'
      };
    }
  }

  toogleMultiselect(){
    if(!this.disableSelect){
    this.toggle = !this.toggle
    this.setBorderColor();
    this.setColorTitle();
    this.setFillColor();
    this.setRotate();
    //this.EmptyDropdownWhenClose();
  }
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

  selectedUsers: string[] = [];
  getSelectedItem(user){

      this.localSelectedItem.forEach(item => {
          item.checked = false;
      });
      user.checked = !user.checked;
      this.selectedUsers = [];
      if (!this.selectedUsers.includes(user)) {
          this.selectedUsers.push(user);
      } else {
          this.selectedUsers.splice(this.selectedUsers.indexOf(user), 1);
      }

      this.selected.emit(user);
      this.ref = user.Name;
      this.toggle = false;
  }

  UpdateContactPeople(){
    for (let i = 0; i < this.localSelectedItem.length; i++) {
      if (this.localSelectedItem[i].checked === true) {
        // Dodaj označeni element u selectedUser listu
        this.selectedUsers.push(this.localSelectedItem[i]);
      }
    }
  }

  ngOnChanges() {
    this.UpdateContactPeople();
  }

  onMouseEnter(){
    this.fill1 = 'var(--orange-dark)';
    this.color1 = 'var(--orange-dark)';
  }

  onMouseOut(){
    this.fill1 = 'var(--main-bg)';
    this.color1 = 'var(--border-color)';
  }

  EmptyDropdownWhenClose() {  
    if(this.toggle){
    }else{
      this.localSelectedItem.forEach(item => {
        item.checked = false;
      });
      this.selectedUsers=[];
    }
    
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
      if(item.checked == true){
        this.color2 = 'var(--orange-dark)';
        this.fill2 = 'var(--orange-dark)';
        return 'var(--orange-dark)';
       }else if(item.checked == false){
        this.color2 = 'var(--orange-dark)';
        this.fill2 = 'var(--orange-dark)';

       }
  }else if(this.counter3 == 0){
    this.color2 = 'var(--border-color)';
    this.fill2 = 'var(--main-bg)';
  }
  }
  /** */

  PrintData(){
    this.PrintButton.emit();
  }
}
