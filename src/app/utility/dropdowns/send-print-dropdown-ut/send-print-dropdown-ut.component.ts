import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-send-print-dropdown-ut',
  templateUrl: './send-print-dropdown-ut.component.html',
  styleUrls: ['./send-print-dropdown-ut.component.css']
})
export class SendPrintDropdownUTComponent implements OnInit {

  public ref;
  public PRINT;
  public SEND;
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

  public userDetails = {};
  public contacts = [];

  private toogleFirstTime: boolean = false;

  public activeCompanyWorkers: any;

  @Output() buttonNameSummaryEvent: EventEmitter<any> = new EventEmitter();
  @Output() sendDeviationMessageEvent: EventEmitter<any> = new EventEmitter();
  @Output() runParentFunction = new EventEmitter<any>();

  @Input() disableSelect:boolean = false;
  @Input() Print: string;
  @Input() Send: string;

  @Input('type') type;
  @Input('accepted') accepted;
  @Input('EmailSent') EmailSent;

  @Input('contacts') set setContacts(value) {
    if (value !== this.contacts) {
      this.contacts = value;
    }
  };

  @Input('activeCompanyWorkers') set setActiveCompanyWorkers(value) {
    this.activeCompanyWorkers = value;
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
      // this.EmptyDropdownWhenClose();
    }
  }

  constructor(private translate: TranslateService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.ref =  this.Send + ' ' + "/" + ' ' + this.Print;
    this.PRINT = this.Print;
    this.SEND = this.Send;

  }

  toogleMultiselect(){
    if(!this.disableSelect){
    this.toggle = !this.toggle
    this.setBorderColor();
    this.setColorTitle();
    this.setFillColor();
    this.setRotate();
    }
    if(!this.toogleFirstTime){
      const userDetails = JSON.parse(sessionStorage.getItem('userDetails'));
      this.activeCompanyWorkers = this.activeCompanyWorkers.filter((user)=>{
        return userDetails.user_id != user.Id;
      });
      this.toogleFirstTime = true;
    }

    // this.EmptyDropdownWhenClose();
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

  // EmptyDropdownWhenClose() {
  //   if(this.toggle){

  //   }else{
  //     this.activeCompanyWorkers.forEach(item => {
  //       item.checked = false;
  //     });
  //   }
  // }


  /**Postavke Hover-a Dropdown liste ako su true min 1 checkbox promjeni boju u naranđastu, ali ako su svi true/false ostavi default sivu boju */
   counter3: number = 0;
  setColorDropDownSelect(item) {

    this.counter3 = 0

    for(let i = 0; i < this.activeCompanyWorkers.length ; i++){
      if(this.activeCompanyWorkers[i].checked == true){
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

  buttonNameSummary(worker) {
    worker.checked = !worker.checked;

    this.buttonNameSummaryEvent.emit(worker);
  }

  checkIfContactSelected(contact) {
    if (this.contacts.some((selectedWorker) => selectedWorker.Id == contact.Id)) {
      contact.checked = true;
      return true;
    } else {
      return false
    };
  }

  sendDeviationMessage(reminder) {
    if (this.contacts.length === 0) {
      this.toastr.info(this.translate.instant('Please select a contact.'), this.translate.instant('Info'));
      return;
    };
    this.sendDeviationMessageEvent.emit(reminder);
  }

  generatePdf() {
    this.runParentFunction.emit('printDeviation');
  }
}
