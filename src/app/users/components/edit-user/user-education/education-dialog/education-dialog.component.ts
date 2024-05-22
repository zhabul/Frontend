import { Component, EventEmitter, Input, OnInit,ViewChild, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SendDropdownComponent } from '../send-dropdown/send-dropdown.component';
//import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationModalComponent } from 'src/app/shared/modals/confirmation-modal/confirmation-modal.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-education-dialog',
  templateUrl: './education-dialog.component.html',
  styleUrls: ['./education-dialog.component.css']
})
export class EducationDialogComponent implements OnInit {

  @ViewChild(SendDropdownComponent) dropdownComponent : SendDropdownComponent;
  @Output() closeDialog:EventEmitter<any> = new EventEmitter<any>;
  @Output() sendData:EventEmitter<any> = new EventEmitter<any>;
  @Input() selectedDocument:any;
  @Input() username = "";
  @Input() client_workers;
  public formCreate: FormGroup;
  public selectedEmail:any[] = [];

  public _filterText:any;
  public dialogIsClosed:boolean = false;
  public emailInput:any;
  public inputEmail:any;
  public emailValidator:any = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  public today:any;
  public CurrentDate:any;
  public backspace = 0;

  public inputContainer:any;
  public input:any;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private translate: TranslateService,
   // private dialogRef: MatDialogRef<EducationDialogComponent>,
   // @Inject(MAT_DIALOG_DATA) public data: any
    ) {

    }

    get inputText(){
      return this._filterText;
    }

    set inputText(value: string){

      this.inputEmail = value;
      let lastCaracter:any
      if(value != undefined){
        lastCaracter = this.inputEmail.charAt(this.inputEmail.length-1);
      }

      if(lastCaracter == ',' || lastCaracter == ';'){
        if(this.emailValidator.test(this.inputEmail.slice(0,-1))){
        this.selectedEmail.push({contact:this.inputEmail.slice(0,-1), email:this.inputEmail.slice(0,-1)});
        this._filterText = '';
        this.formCreate.get('to').reset();
        }
      }
    }

    addEmailByEnter(){

        if(this.emailValidator.test(this.inputEmail)){
            let index =  this.selectedEmail.findIndex((res) => { return res.email == this.inputEmail});
            if(index < 0) {
                this.selectedEmail.push({contact:this.inputEmail, email:this.inputEmail});
            }
            this._filterText = '';
            this.formCreate.get('to').reset();
        }
    }

    removeEmailByBackSpace(){
        if(this.inputEmail == undefined){
            this.removeEmail(this.selectedEmail.length-1);
            this.dropdownComponent.updateCheckedEmails();
        }

        if(this.inputEmail == ''){
            if(this.backspace>0){
                this.removeEmail(this.selectedEmail.length-1);
                this.dropdownComponent.updateCheckedEmails();
                this.formCreate.get('to').reset();
                this.backspace = 0;
            } else {
                this.backspace++;
            }
        }
    }

    ngOnInit(): void {

        this.today = new Date();
        this.CurrentDate =
        this.today.getFullYear() +
        "-" +
        (this.today.getMonth() + 1) +
        "-" +
        this.today.getDate();

        this.formCreate = this.fb.group({
        to: new FormControl(),
        subject: [`${this.username} ${this.CurrentDate}`, new FormControl()],
        message: new FormControl(),
        });
    }

    disableIfDataRequiredEmpty() {
        let status = true;
        let message = this.formCreate.get('message').value;
        let subject = this.formCreate.get('subject').value;

        if((message && message.length > 0) && this.selectedEmail.length > 0 && (subject && subject.length > 0)) {
            status = false;
        }
        return status;
    }

    send(event) {

        if(this.disableIfDataRequiredEmpty()) {
            this.toastr.info(this.translate.instant('Please fill the form'));
            return false;
        }

        let data = {
            'selected_documents': this.selectedDocument,
            'to': this.selectedEmail,
            'message': this.formCreate.get('message').value,
            'subject': this.formCreate.get('subject').value
        }

        if(this.selectedEmail.length == 0){
        this.toastr.info(this.translate.instant('Please select some of the options'));
        } else {
        let emails = '';
        this.selectedEmail.forEach(email =>{
            emails += email.contact + ' ';
        })
        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.position = {left:'500px', top:'400px'}
        diaolgConfig.disableClose = true;
        diaolgConfig.panelClass = "mat-dialog-confirmation";
        diaolgConfig.data = { questionText: this.translate.instant('Are you sure you want to send email to: ') + emails + '?' };
                    this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().subscribe(response =>{
                    if(response.result){
                    this.sendData.emit(data);
                    }
                });
        }
    }

    close() {
        this.dialogIsClosed = true;
        this.closeDialog.emit(this.dialogIsClosed);
    }

  checkedEmail(event){
    let alreadyExist=false;
    this.selectedEmail.forEach((item,index)=>{
          if(item.id == event.id) {
          this.selectedEmail.splice(index,1);
          alreadyExist = true;
        }
     })
    if(!alreadyExist){
      this.selectedEmail.push(event);
    }
  }

  removeEmail(index){
    this.selectedEmail.forEach((item,i)=>{
      if(i==index) {
        this.selectedEmail.splice(i,1);
      }
    })
  }

}
