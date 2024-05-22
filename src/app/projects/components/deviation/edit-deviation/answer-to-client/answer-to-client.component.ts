import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-answer-to-client',
  templateUrl: './answer-to-client.component.html',
  styleUrls: ['./answer-to-client.component.css', '../edit-deviation.component.css']
})
export class AnswerToClientComponent implements OnInit {

  @Input('user_email') user_email;
  @Input('deviationId') deviationId;
  @Input('projectId') projectId;
  @Output() runParentFunction: EventEmitter<string> = new EventEmitter();
  @Output() onRespondToDeviation: EventEmitter<any> = new EventEmitter();

  public files;
  public clientMessage = '';

  constructor(private toastr: ToastrService,
    public translate: TranslateService) { }

  ngOnInit() {
  }

  setFiles($event) {
    this.files = $event;
  }
  
  rejectDeviation() {
    this.runParentFunction.emit('manuallyRejectDeviation');
  }

  respondToDeviation($event) {
    $event.preventDefault();
    if (this.clientMessage === '') {
      this.toastr.error(this.translate.instant('Please enter a message.'), this.translate.instant('Info'));
      return false;
    } 

    if (!this.files) {
      this.files = {
        images: [],
        pdfs: []
      };
    }

    this.onRespondToDeviation.emit({
      clientMessage: this.clientMessage,
      files: this.files,
    });
  }
}
