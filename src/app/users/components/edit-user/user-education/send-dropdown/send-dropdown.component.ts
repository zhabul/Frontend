import { Component,  ElementRef,  EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item } from './send-dropdown.interface';

@Component({
  selector: 'app-send-dropdown',
  templateUrl: './send-dropdown.component.html',
  styleUrls: ['./send-dropdown.component.css'],
  host: {'(document:click)': 'onClick($event)'},
})
export class SendDropdownComponent implements OnInit {

  @Output() listOfCheck:EventEmitter<any> = new EventEmitter<any>;
  @Output() isEmailSent:EventEmitter<any> = new EventEmitter<any>;
  @Input() emailsRemovedByX:any;
  @Input() isPermitDialog:any = false;
  @Input() isOpen:boolean = true;
  @Input() disableSelect:boolean = false;


   @Input() items: Item[];
  //      | undefined = [
  //   {id: 0, contact: 'someone@gmail.com'},
  //   {id: 1, contact: 'someoneelse@gmail.com'},
  //   {id: 3, contact: 'thirdtperson@gmail.com'},
  // ];

  public listOfChecked: any[] = [];
  public emailSent:boolean = false;

  constructor(private _eref: ElementRef) { }

  ngOnInit(): void {}

  onClick(event) {
     // this.isOpen = false;
    if (!this._eref.nativeElement.contains(event.target)){
     this.updateCheckedEmails();
    }
  }
  
  toggleSendButton(): void {
    if(!this.disableSelect){
    this.isOpen = !this.isOpen;
  }
}

  toggleItem(item: number): void {
    this.listOfCheck.emit(item);
    if(this.listOfChecked.includes(item)) this.listOfChecked = this.listOfChecked.filter(x => x != item);
    else this.listOfChecked.push(item);
  }

  sendEmail(){
   this.emailSent = true;
   this.isEmailSent.emit(this.emailSent);
   this.emailSent = !this.emailSent;
  }

  updateCheckedEmails(){
    let checkedArr:any[] = [];
    this.items?.forEach((contact,index)=>{
        this.emailsRemovedByX.forEach((checked,index2)=>{
            if(contact == checked){
              checkedArr.push(contact);
            }
        })
    })
    this.listOfChecked = checkedArr;
  }

  
}
