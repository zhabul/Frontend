import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { generateEmailInfoObject } from 'src/app/offer/components/new-offer/utils';
import { ConfirmationModalComponent } from 'src/app/shared/modals/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-reply-to-question',
  templateUrl: './reply-to-question.component.html',
  styleUrls: ['./reply-to-question.component.css']
})
export class ReplyToQuestionComponent implements OnInit {

  @Input('item') item;
  @Input('service') service;
  @Output('emailLogListener') emailLogListener: EventEmitter<string> = new EventEmitter();

  public replyObject;
  //  = {
  //   Status: "6",
  //   active: "0",
  //   answerDate: "2023-05-29 09:01:07",
  //   answerEmail: "abd@abd.com",
  //   attachment: "",
  //   client_message: "=",
  //   comment: "",
  //   date: "2023-05-29 09:00:36",
  //   disabled: false,
  //   file_path: "",
  //   files: [],
  //   group: "958fdcc02a3c1d9b5076",
  //   id: "45418",
  //   image_path: null,
  //   images: [],
  //   index: 0,
  //   manualReply: "0",
  //   name: "Answer",
  //   pdfs: []
  // };
  public infoStatus = true;
  public visibility = true;
  public content_type = 'offer';
  public userDetails;
  public spinner = false;
  public hasAnswer;

  public emailLogs = [];

  public color = 'var(--orange)';

  constructor(
              private dialog: MatDialog,
              private toastr: ToastrService,
              private translate: TranslateService
              ) { }


  ngOnInit(): void {
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    // this.emailLogs = this.item.emailLogs.filter((log) => log.answerDate != "" && log.answerDate != null).reverse()
    // this.emailLogs = this.item.emailLogs.filter((log) => log.Status == "4" || log.Status == "6").reverse()

    this.filterEmailLogs();

    // this.hasAnswer = this.emailLogs.at(-1).Status == 6;
    this.hasAnswer = this.item.emailLogs.at(0).Status == 6;
    this.replyObject = {
      Status: "1",
      active: "0",
      answerDate: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      answerEmail: this.item.emailLogs[0].answerEmail,
      attachment: "",
      client_message: "=",
      comment: "",
      date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      disabled: false,
      file_path: "",
      files: [],
      id: "45418",
      image_path: null,
      images: [],
      index: 0,
      manualReply: "1",
      name: this.translate.instant('Answer'),
      pdfs: []
    };
  }

  filterEmailLogs(){
    this.emailLogs = [];
    this.emailLogs = this.item.emailLogs.filter((log) => {
      if((log.Status == 6 && log.comment != "") || (log.Status == 1 && log.manualReply == 1 && log.comment != ""))
        return true;
      return false;
    }).reverse();
    this.emailLogs.forEach(log => {

      if(log.name === "")
        log.name = this.translate.instant('Answer') + " " + log.answerDate
      else{
        log.name = this.translate.instant(log.name.split(" ")[0]) + " " + log.answerDate;
      }
    });
  }

  takeAction(event) {
    this.replyObject = event;
  }

  async sendAnswer() {
    if (!this.replyObject.comment) return;
    const res = await this.onConfirmationModal();
    if (!res) return;
    const emailInfo = {
      to: this.item.emailLogs[0].answerEmail,
      from: this.userDetails.email,
      name: '',
      header: '',
      footer: '',
      comment: this.replyObject.comment,
      manualReply: 0,
      reminder: 0,
      status: this.replyObject.Status
    };
    const info = {
      id: this.item.id,
      emailInfo: generateEmailInfoObject(emailInfo, this.item.id)
    };

    try {
      this.spinner = true;
      await this.service.answer(info);
      this.replyObject.disabled = true;
      this.emailLogListener.emit(this.replyObject);
      this.toastr.success(this.translate.instant('Offer successfully answered.'), this.translate.instant('Success'));
    } catch(e) {
      this.spinner = false;
    }

  }

  onConfirmationModal(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.disableClose = true;
      dialogConfig.width = "185px";
      dialogConfig.panelClass = "mat-dialog-confirmation";
      this.dialog.open(ConfirmationModalComponent, dialogConfig).afterClosed()
        .subscribe((response) => {
          if(response.result) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
    });
  }

}
