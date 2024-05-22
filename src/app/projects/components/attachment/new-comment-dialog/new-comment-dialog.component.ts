import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-comment-dialog',
  templateUrl: './new-comment-dialog.component.html',
  styleUrls: ['./new-comment-dialog.component.css']
})
export class NewCommentDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<NewCommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {}

  ngOnInit(): void {
  }

  onCloseModal() {
    this.dialogRef.close();
  }

}
