import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-template',
  templateUrl: './add-template.component.html',
  styleUrls: ['./add-template.component.css']
})
export class AddTemplateComponent implements OnInit {
  opacity = 0;
  display = 'none';
  translateY = '150px';
  addedRows: any;
  background = 'rgb(128 128 128 / 50%)';

  public offerName = '';

  constructor(public dialogRef: MatDialogRef<AddTemplateComponent>) { }

  ngOnInit(): void {
  }

  close(){
    this.dialogRef.close();
  }

  save(){
    this.dialogRef.close(this.offerName);
  }

}
