import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmationModalComponent } from 'src/app/shared/modals/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-dropdown-select-print-for-du',
  templateUrl: './dropdown-select-print-for-du.component.html',
  styleUrls: ['./dropdown-select-print-for-du.component.css']
})
export class DropdownSelectPrintForDuComponent implements OnInit {
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
  public fill3 = 'var(--project-dark)';
  public rotate: any;
  public contacts = [];
  public checked_client:boolean = false;

  @Output() selected = new EventEmitter();
  @Output() PrintButton = new EventEmitter();
  @Output() SendButton = new EventEmitter();
  @Output() sendWeeklyReports = new EventEmitter();
  @Input() sendCopy;
  @Input() placeholder: string;
  @Input() Print: string;
  @Input() Send: string;
  @Input() HaveSend: boolean;
  @Input() project;
  @Input() allowSendGroupOfWeeklyReport;


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
      //this.EmptyDropdownWhenClose();
    }
  }
  constructor(private translate: TranslateService,
            private dialog: MatDialog,
            private toastr: ToastrService,
        ) { }

  ngOnInit(): void {
    // this.ref =  this.Send + ' ' + "/" + ' ' + this.Print;
    this.ref = this.placeholder;
    this.PRINT = this.Print;
    this.SEND = this.Send;
  }

  toogleMultiselect(){
    this.toggle = !this.toggle
    this.setBorderColor();
    this.setColorTitle();
    this.setFillColor();
    this.setRotate();
    this.EmptyDropdownWhenClose();
    this.selectedUsers = [];
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

        user.checked = !user.checked;
        if (!this.selectedUsers.includes(user)) {
            this.selectedUsers.push(user);
        } else {
            this.selectedUsers.splice(this.selectedUsers.indexOf(user), 1);
        }
        this.selected.emit(this.selectedUsers);
        this.checked_client = false;

        for(let i = 0; i < this.localSelectedItem.length ; i++){
          if(this.localSelectedItem[i].checked == true){
            this.checked_client = true;
          }
        }
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

  mouseOver()

  {
    if(this.toggle==false)
    {
      this.fill = 'var(--orange-dark)';
      this.color = 'var(--orange-dark)';
      this.border=' 1px solid var(--orange-dark)';
    }

  }





  mouseleave()
  {

    if(this.toggle==false)
    {
      this.fill = '#82A7E2';
      this.color = '#82A7E2';
      this.border = '1px solid #82A7E2';
    }

  }

  EmptyDropdownWhenClose() {
    if(this.toggle){

    }else{
      this.localSelectedItem.forEach(item => {
        item.checked = false;
      });
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
    this.PrintButton.emit('print');
    this.toggle = false;
  }

  SendData(){
    this.SendButton.emit(this.selectedUsers);
    this.selectedUsers = [];
    this.UpdateContactPeople();
  }

  sendWeeklyReportsClick() {
    if(!this.allowSendGroupOfWeeklyReport ||this.checked_client) {
      return;
    }
    this.sendWeeklyReports.emit(true);
    this.toggle = false;
  }

  openModalForConfirmation(){

    this.contacts = this.selectedUsers;
    let send = true;
    if (this.contacts.length < 1) {
        send = false;
        return this.toastr.info(
            this.translate.instant(
              "You first need to select an email where to send ata"
            ) + ".",
            this.translate.instant("Info")
        );
    }

    if (
        !this.sendCopy &&
        this.contacts.length >= 1 &&
        !this.contacts.some((contact) => contact.Id == this.project["selectedMainContact"])
    ) {
        send = false;
        return this.toastr.info(
            this.translate.instant("TSC_main_contact_email_has_to_be_selected"),
            this.translate.instant("Info")
        );
    }

    if(!send) {
        return;
    }

    const emails = [];
    let contancts_array = [];

    this.localSelectedItem.forEach((contact) => {
      if(contact.checked) {
        contancts_array.push(contact);
      }
    });

    this.contacts = contancts_array;

    this.contacts.forEach((email) =>{
        emails.push(' ' + email.email)
    })

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.data = {
    questionText: this.translate.instant("Are you sure you want to send email to: ") +
    emails +
    " ?",
    };
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().subscribe((response)=>{
        if(response.result) {
            this.SendData();
            this.selectedUsers=[];
        }
    });
  }

  setClolor() {
    if(this.allowSendGroupOfWeeklyReport && !this.checked_client) {
      return 'var(--orange-dark)';
    }else {
      return 'var(--project-dark)';
    }
  }

  allowSentWR() {
    if(this.allowSendGroupOfWeeklyReport) {
      return true;
    }else {
      return false;
    }
  }
}