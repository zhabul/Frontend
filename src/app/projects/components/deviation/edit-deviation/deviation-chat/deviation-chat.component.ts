import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { TimeRegistrationService } from 'src/app/core/services/time-registration.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationModalComponent } from 'src/app/shared/modals/confirmation-modal/confirmation-modal.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import * as moment from 'moment';
import { HttpEventType } from '@angular/common/http';
import { InternalChatStore } from '../internal-chat.service';
import { FileStorageService } from "src/app/core/services/file-storage.service";

@Component({
  selector: 'app-deviation-chat',
  templateUrl: './deviation-chat.component.html',
  styleUrls: ['./deviation-chat.component.css', '../edit-deviation.component.css']
})
export class DeviationChatComponent implements OnInit {

  @Input('activeCompanyWorkers')  set setActiveComapnyWorkers(value) {
    if (this.activeCompanyWorkers !== value) {
      this.activeCompanyWorkers = value;
    }
  };
  @Input('user_id') user_id;
  @Input('Author') Author;
  @Input() nextDeviationExists;
  @Input('scrollContainer') scrollContainer;
  @Input('user_email') user_email;
  @Input('deviationId') set setDeviationId(value) {
    if (this.deviationId !== value) {
      this.deviationId = value;
      this.internalChatStore.getChatMessages(this.deviationId);
    }
  };
  @Input('projectId') projectId;
  @Input('ataId') ataId;
  @Input('projectCustomName') projectCustomName;
  @Input('deviationNumber') deviationNumber;
  @Input('deviationStatus')  set setdeviationStatus(value) {
    if (this.deviationStatus !== value) {
      this.deviationStatus = value;
      this.setAnswerCondition();
    }
  };
  @ViewChild("fileDropRef") fileDropRef: ElementRef;
  @ViewChild('bottomOfPage') bottomOfPage;

  @Output() runParentFunction: EventEmitter<string> = new EventEmitter();
  @Output() disableForm: EventEmitter<boolean> = new EventEmitter();
  @Output() internalDevSent: EventEmitter<boolean> = new EventEmitter();

  public contact:any = {};
  public contacts = [];
  public activeCompanyWorkers = [];
  public deviationMessages = [];
  public canAnswer = false;
  public deviationStatus = -1;
  public deviationId = - 1;
  public files = {
    images: [],
    pdfs: []
  };
  public buttonToggle = false;
  public buttonName = "";
  public swiper = {
    images: [],
    active: -1,
    album: -2,
    index: -1,
    parent: null
  };
  public spinner = false;
  public progress = 0;
  public newMessageSub;
  public messageSub;
  public disabledCondition;

  constructor(
    private timeRegistrationService: TimeRegistrationService,
    private toastr: ToastrService,
    public translate: TranslateService,
    private dialog: MatDialog,
    public internalChatStore: InternalChatStore,
    private fsService: FileStorageService

    ) { }

  ngOnInit() {
    this.subToChatMessages();
    this.subToNewMessage();
    if(this.deviationMessages.length>0){
      setTimeout(()=>{
        this.autogrow();
      }, 1000);
    }

  }

  Newstatus;

  changeStatus(newStatus) {
    this.Newstatus = newStatus;
  }

  autogrow(){
    let  textArea = document.getElementById("clientMessage")
    textArea.style.overflow = 'hidden';
    textArea.style.minHeight  = '55px';
    textArea.style.height = '0px';
    textArea.style.height = textArea.scrollHeight + 'px';
  }

  ngOnDestroy() {
    this.unsubFromChat();
    this.unsubFromMessages();
    this.internalChatStore.clearMessages();
  }

  subToNewMessage() {
    this.newMessageSub = this.internalChatStore.newMessageEvent$.subscribe((contact)=>{
      this.contact = contact;
      this.sendMessage('setDeviationStatus');
    });
  }

  subToChatMessages() {
    this.messageSub = this.internalChatStore.messageStore$.subscribe((messages)=>{
      this.deviationMessages = messages.data.filter((msg)=>{
          return (this.deviationStatus != 3 &&  this.deviationStatus != 2) || ((this.deviationStatus == 3 || this.deviationStatus == 2) && msg.message !== '')
      });
      this.setAnswerCondition()
    });
  }

  unsubFromChat() {
    if (this.newMessageSub) {
      this.newMessageSub.unsubscribe();
    }
  }

  unsubFromMessages() {
    if (this.messageSub) {
      this.messageSub.unsubscribe();
    }
  }

  subscribeToMessageStore() {}

  setWorkersVisibility(value) {
      this.buttonToggle = value;
  }

  setButtonRadius() {
    if (this.buttonToggle) {
      return {
        borderBottomRightRadius: '0px',
        borderBottomLeftRadius: '0px',
      };
    }
    return {};
  }

  setAnswerCondition() {

    if (this.deviationMessages.length === 0) {
      return;
    }

    const lastDevMessage = this.deviationMessages[this.deviationMessages.length - 1];

    if (lastDevMessage.user_id == this.user_id) {
      this.canAnswer = true;
    }

    if (lastDevMessage.user_id != this.user_id) {
      this.canAnswer = false;
    }

    if (lastDevMessage.replay == 1) {
      this.canAnswer = false;
    }

    this.answerDeviationStatus();
  }

  answerDeviationStatus() {
    if (this.deviationStatus != -1 && this.deviationStatus != 4) {
      this.canAnswer = false;
    }
  }

  returnDisabledCondition(msg, index) {
    return (this.user_id != msg.user_id || index == msg.length - 1 || msg.replay == 1 ||
    (this.deviationStatus != -1 && this.deviationStatus != 4)) && !this.nextDeviationExists;
  }

  setFiles($event) {
    this.files = $event;
  }

  generateMessageObject({deviationId, user_id, user_email, status}) {
    return {
      'id': null,
      'week_id': deviationId,
      'user_id': user_id,
      'user_email': user_email,
      'message': '',
      'replay': 0,
      'created_at': new Date(),
      'opened': 1,
      'statusDevInternalChat': status
    };
  }

  generateNotificationObject() {

    const devLength = this.deviationMessages.length;

    let data = {};

    const status = this.Newstatus; // Postavite status na odgovarajuću vrijednost
    if (this.deviationMessages[devLength - 1]) {
      data = {
          ...this.deviationMessages[devLength - 1],
          statusDevInternalChat: status
      };
  }

    return {
      'user_id':  this.user_id,
      'type': 'deviation',
      'webLink': `/projects/view/deviation/edit/${this.projectId}/${this.ataId}?projectId=${this.projectId}`,
      '$mobileLink': `/projects/view/${this.projectId}/deviations/edit-deviation/${this.ataId}`,
      'deviationId': this.deviationId,
      'data': data,
      'contact': this.contact,
      'ataId': this.ataId,
      'deviationName': `${this.projectCustomName}- Intern Underrättelse: U-${this.deviationNumber}`,
      'date': moment(new Date()).format('YYYY-MM-DD'),
      'firstUserId':  this.deviationMessages[0] ? this.Author : -1,
      'files': this.files,
      'projectId': this.projectId
    };
  }

  sendMessage(parentFunction = null) {

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.data = { questionText: this.translate.instant('Are you sure?')};
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().toPromise().then((response)=>{

      if (response.result) {

        const object = this.generateNotificationObject();

        this.fsService.mergeFilesAndAlbums(this.files).then((response: any) => {

            if(response != null) {
                object.files.images = response.images;
                object.files.pdfs = response.pdfs;
            }

            this.disableForm.emit(true);
            this.internalDevSent.emit(true);
            this.createNotificationDevInternalCall(object, parentFunction);
        });
      }
    });
  }

  createNotificationDevInternalCall(object, parentFunction) {
    this.spinner = true;
    this.progress = 0;
    this.timeRegistrationService.createNotificationDevInternal(object).subscribe(
      (response:any) => {

        if (response.type === HttpEventType.Response) {

          this.progress = 100;
          const body = response.body;
          if (body && body["status"]) {

              if (this.deviationMessages[this.deviationMessages.length - 1]) {
                this.deviationMessages[this.deviationMessages.length - 1].replay = 1;
                this.deviationMessages[this.deviationMessages.length - 1].files = body['files'];
              }
              if (object.contact) {
                this.updateStore(object);
              }
              this.setAnswerCondition();
              this.toastr.success(this.translate.instant('Notification sent.'), this.translate.instant('Success'));
              this.spinner = false;
              if (parentFunction !== null) {
                this.runParentFunction.emit(parentFunction);
              }
              setTimeout(()=>{
                this.bottomOfPage.nativeElement.scrollIntoView();
              }, 10);
          }
        }

        if (response.type === HttpEventType.UploadProgress) {
          let percentDone = Math.round(100 * response.loaded / response.total);
          if (percentDone === 100) {
            percentDone = percentDone - 50;
          }
          this.progress = percentDone;
        }
      }
   );
  }

  updateStore(object) {
    const newMsges = this.deviationMessages.slice(0);
    newMsges.push(this.generateMessageObject({
      deviationId: this.deviationId,
      user_id: object.contact.Id,
      user_email: object.contact.user_email,
      status: status
    }));
    this.internalChatStore.addMessageToStore(newMsges);
  }

  forwardMessage() {
    const devLen = this.deviationMessages.length;
    if (!this.checkForMessageErrors(devLen)) {
      return;
    }

    this.changeStatus(1); //Forward Status
    this.sendMessage();
  }

  respondToInternalDeviation() {

    const devLen = this.deviationMessages.length;
    this.contact = undefined;

    if (!this.checkForMessageErrors(devLen)) {
      return;
    }

    this.changeStatus(2); //Svar Status
    this.sendMessage('manuallyAcceptDeviationCall');
  }

  endCorrespondence() {

    this.changeStatus(3); //Inte Aktuell Status
    this.contact = undefined;
    this.sendMessage('manuallyRejectDeviationCall');
  }

  checkForMessageErrors(devLen) {
    const message = this.deviationMessages[devLen - 1].message;
    if (message === '') {
      this.toastr.error(this.translate.instant('Please enter a message.'), this.translate.instant('Info'));
      return false;
    }
    return true;
  }

  setButtonNameStatus() {
    if (this.buttonToggle == true) {
      this.buttonName = "Hide";
    } else {
      this.buttonName = "";
    }
  }

  generateAttachmentImageArray(file) {
    return {
      Url: file.Url,
      file: file.file,
      file_path: file.file,
      image_path: file.image_path,
      previewUrl: file.previewUrl,
      document_type: file.document_type,
      name: file.name
    };
  }

  getFilePreviewType(file: any): string {
    if (file.document_type === 'pdf' || file.document_type === 'Pdf' || file.document_type === 'PDF' || file.name.endsWith('pdf') || file.name.endsWith('Pdf') || file.name.endsWith('PDF')) {
      return 'pdf';
    } else {
      return 'image';
    }
  }

  openAttachmentSwiper(file, files, index) {

    if (file.document_type == 'Pdf' || file.document_type == 'pdf' || file.document_type == 'PDF') {
      this.openSwiper(index, files, 0);
      return;
    };
    let images = files.filter((file_)=>{
      return file_.document_type != 'Pdf'
    });

    images = images.map((image, i)=>{
      if (image.url == file.url) {
        index = i;
      }
      return this.generateAttachmentImageArray(image);
    });
    this.openSwiper(index, images, 0);
  }

  isPDFViewer: boolean = false;
  openSwiper(index, images, album) {

    if (images[index].document_type === 'Image') {
      this.isPDFViewer = false;
      this.swiper = {
        active: index,
        images: images,
        album: album,
        index: -1,
        parent: null
      }

    } else {
      const imageArray = this.createImageArray(images[index]);
      this.isPDFViewer = true;
      this.swiper = {
        active: 0,
        images: imageArray,
        album: album,
        index: index,
        parent: images[index]
      }
    }
  }

  createImageArray(image) {
    const id = image.id;
    const comment = image.Description;
    const name = image.Name ? image.Name : image.name;
    //const image_path = image.image_path;
    const file_path = image.file_path;

    const imageArray = file_path.split(",").map((imageString)=>{
      return {
        image_path: imageString,
        id: id,
        Description: comment,
        name: name,
        file_path: file_path
      };
    });
    return imageArray;
  }

  closeSwiper() {
    this.swiper = {
      active: -1,
      images: [],
      album: -2,
      index: -1,
      parent: null
    }
  }

  setClientMessageBackground(msg, index) {

    if (this.user_id != msg.user_id || index == msg.length - 1 || msg.replay == 1) {
      return 'lightgrey';
    }
    return 'white';
  }

  buttonNameSummary(worker) {

    if (worker) {

      this.contacts = [];
      this.buttonToggle = true;
      if (
        this.contacts.some((selectedWorker) => selectedWorker.Id == worker.Id)
      ) {
        this.contacts.splice(this.contacts.indexOf(worker), 1);
      } else {
        this.contacts.push(worker);
      }

      this.contact = this.contacts[0];
    } else {
      this.buttonToggle = !this.buttonToggle;
      if (this.buttonToggle == true) {
        this.buttonName = "Hide";
      } else {
        this.buttonName = "";
      }
    }
  }

  runParentFunction_($event) {
    this.runParentFunction.emit($event);
  }
}
