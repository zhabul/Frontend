import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-send-print-dropdown-payplan',
  templateUrl: './send-print-dropdown-payplan.component.html',
  styleUrls: ['./send-print-dropdown-payplan.component.css']
})
export class SendPrintDropdownPayplanComponent implements OnInit {

  public ref;
  public PRINT;
  public SEND;
  public SENDREMINDER;
  public HOVERTEXT;
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


  @Output() selected = new EventEmitter();
  @Output() PrintButton = new EventEmitter();
  @Output() SendButton = new EventEmitter();
  @Output() SendButtonReminder = new EventEmitter();

  @Input() placeholder: string;
  @Input() Print: string;
  @Input() Send: string;
  @Input() HaveSend: boolean;

  @Input() HoverText: boolean;
  @Input() SendReminder: boolean;
  @Input() ReminderCondition: boolean;
  @Input() DisabledWhenLock:string;
  @Input() EnableWhenUnlock:string;
  @Input() selectedWorkers:any;

  @Input('SendPrintUT1') set selectedItem(value) {
    if(value.length >0){
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
    }
  }
  constructor() { }

  ngOnInit(): void {
    // this.ref =  this.Send + ' ' + "/" + ' ' + this.Print;
    this.ref = this.placeholder;
    this.PRINT = this.Print;
    this.SEND = this.Send;
    this.SENDREMINDER = this.SendReminder;
    this.HOVERTEXT = this.HoverText;

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

  selectedUsers = [];
  getSelectedItem(user){
    user.checked = !user.checked;

  /**Send data */
  if (!this.selectedUsers.includes(user)) {
    this.selectedUsers.push(user);
  } else {
    this.selectedUsers.splice(this.selectedUsers.indexOf(user), 1);
  }
  /** */

  this.selected.emit(this.selectedUsers);

  }


  UpdateContactPeople(){
    // for (let i = 0; i < this.localSelectedItem.length; i++) {
    //   if (this.localSelectedItem[i].checked === true) {
    //     // Dodaj označeni element u selectedUser listu
    //     this.selectedUsers.push(this.localSelectedItem[i]);
    //   }
    // }

    for (let i = 0; i < this.localSelectedItem.length; i++) {
      let coworker = this.localSelectedItem[i];
        let index = this.selectedWorkers.findIndex(item => item.Id === coworker.Id);
        if (index > -1) {
          coworker.checked = true;
          if(!this.selectedUsers.includes(coworker)){
            this.selectedUsers.push(coworker)
          }
        }
      }

  }

  ngOnChanges() {
    if(this.selectedWorkers?.length > 0){
      this.UpdateContactPeople();
    }

    if (this.selectedWorkers?.length === 0) {
      this.selectedUsers.forEach((user) => {
        user.checked = false;
      });
      this.selectedUsers = [];
    }
  }

  onMouseEnter(){
    this.fill1 = 'var(--orange-dark)';
    this.color1 = 'var(--orange-dark)';
  }

  onMouseOut(){
    this.fill1 = 'var(--main-bg)';
    this.color1 = '#1A1A1A';
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
    this.color2 = '#1A1A1A';
    this.fill2 = 'var(--main-bg)';
  }
  }
  /** */

  PrintData(){
    this.PrintButton.emit();
  }

  SendData(){
    this.SendButton.emit();
    // this.selectedUsers = [];
    // this.UpdateContactPeople();
  }

  SendDataReminder(){
    this.SendButtonReminder.emit();
    // this.selectedUsers = [];
    // this.UpdateContactPeople();
  }

  showHidden = false;

  showHiddenStatus() {
    if (this.DisabledWhenLock) {
      this.showHidden = true;
    }
  }

  hideHiddenDiv() {
    this.showHidden = false;
  }

  changeColor(event: MouseEvent) {
    const element = event.currentTarget as HTMLElement;
    element.style.color = "var(--orange-dark)";
  }
  changeColorLeave(event: MouseEvent) {
    const element = event.currentTarget as HTMLElement;
    element.style.color = "#1a1a1a";
  }


}
