import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-worker-list',
  templateUrl: './worker-list.component.html',
  styleUrls: ['./worker-list.component.css']
})
export class WorkerListComponent implements OnInit {

  @Input('contacts') set setContacts(value) {
    if (value !== this.contacts) {
      this.contacts = value;
      this.setSendButtonStyle();
    }
  };
  @Input('type') type;
  @Input('accepted') accepted;
  @Input('activeCompanyWorkers') set setActiveCompanyWorkers(value) {
    if (this.activeCompanyWorkers !== value) {
      const userDetails = JSON.parse(sessionStorage.getItem('userDetails'));;
      this.activeCompanyWorkers = value.filter((user)=>{
        return userDetails.user_id != user.Id;
      });
    }
  };
  @Input('location') location;
  @Input('EmailSent') EmailSent;
  @Output() buttonNameSummaryEvent: EventEmitter<any> = new EventEmitter();
  @Output() sendDeviationMessageEvent: EventEmitter<any> = new EventEmitter();
  @Output() runParentFunction = new EventEmitter<any>();

  public contacts = [];
  public activeCompanyWorkers = [];
  public containerStyle = {};
  public sendButtonStyle = {};
  public sendTextStyle = {};
  public userDetails = {};
  public sendText = [];
  public color = 'black';
  constructor(
            private toastr: ToastrService,
            private translate: TranslateService

          ) { }

  ngOnInit() {
    this.setContainerStyle();
    this.setSendButtonStyle();
  }

  onMouseEnter(){
    this.color = 'var(--orange-dark)';
  }
  OnMouseLeave(){
    this.color = 'black';
  }
  setContainerStyle() {

    if (this.location == 'top-send') {
      this.containerStyle = {
        width: '180px',
        border: '2px solid var(--orange-dark)',
        borderTopStyle: 'none',
        top: '0px',
        left: '0px'
      };
      return;
    }

    if (this.location == 'bottom-send') {
      this.containerStyle = {
        width: '140px',
        border: '1px solid var(--brand-color)',
        borderTopStyle: 'none',
        backgroundColor: '#1A1A1A',
        top: '26px',
        left: '1px'
      };
      return;
    }
  }

  setSendButtonStyle() {

    const len = this.contacts.length;

    this.sendButtonStyle = {
      justifyContent: 'space-between',
      paddingTop: '2px',
      paddingBottom: '2px'
    };
    this.sendTextStyle = {
      color: len ? 'var(--brand-color)' : 'black',
      fontWeight: len ? 'bold' : 'normal'
    };
  }

  checkIfContactSelected(contact) {

    if (this.contacts.some((selectedWorker) => selectedWorker.Id == contact.Id)) {
      return true;
    } else {
      return false
    };
  }

  buttonNameSummary(worker) {
    this.buttonNameSummaryEvent.emit(worker)
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
