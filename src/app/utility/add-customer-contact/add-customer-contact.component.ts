import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-add-customer-contact',
  templateUrl: './add-customer-contact.component.html',
  styleUrls: ['./add-customer-contact.component.css']
})
export class AddCustomerContactComponent implements OnInit {
public stringProba:any;
public activeCheck:boolean=false;
public inactiveCheck:boolean=false;
  constructor(
    public dialogRef: MatDialogRef<AddCustomerContactComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any) {
      this.stringProba = modal_data.questionText;
    }

  ngOnInit(): void {
  }
  checkActive(){
    this.activeCheck = !this.activeCheck
    if(this.inactiveCheck == true){
      this.inactiveCheck = false;
    }
  }

  checkInactive(){
    this.inactiveCheck = !this.inactiveCheck;
    if(this.activeCheck == true){
      this.activeCheck = false;
    }
  }
  close(parameter = false){
    this.dialogRef.close();
  }
}
