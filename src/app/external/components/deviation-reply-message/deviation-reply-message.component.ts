import { Component, OnInit, ViewChild } from '@angular/core';
import { AtaService } from 'src/app/core/services/ata.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationModalComponent } from 'src/app/shared/modals/confirmation-modal/confirmation-modal.component';
import { FileStorageService } from 'src/app/core/services/file-storage.service';
import { PdfjsViewerComponent } from 'src/app/utility/pdfjs-viewer/pdfjs-viewer.component';
import { ProjectsService } from "src/app/core/services/projects.service";
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import * as moment from "moment";
import * as printJS from "print-js";

@Component({
  selector: 'deviation-reply-message',
  templateUrl: './deviation-reply-message.component.html',
  styleUrls: ['./deviation-reply-message.component.css']
})
export class DeviationReplyMessageComponent implements OnInit {

    @ViewChild('fixedBlueScroll') fixedBlueScroll;
    @ViewChild('containerBlueScroll') containerBlueScroll;
    @ViewChild(PdfjsViewerComponent) pdfjsViewerComponent: PdfjsViewerComponent;

    public today: any;
    public CurrentDate: any;
    public project:any;
    public general:any;
    public logoImage:any;
    public companyName:any;
    public replyMessages: any;
    public typeDeviation:any;
    public NameTypeDeviation:any;
    public isMainClient:boolean;
    public createForm: FormGroup;
    public showPdfPreview = false;
    public whichPdfPreview;
    public chooseFile = false;
    public uploadMessage: any;
    public file: any = {};
    public description = '';
    public question = '';
    public spinner = false;
    public rotateValue: number = 0;
    public fileIsPdf = false;
    public showSendButton = false;
    public toolTip1 = this.translate.instant('TSC_toolTip1');
    public toolTip2 = this.translate.instant('TSC_toolTip2');
    public toolTip3 = this.translate.instant('TSC_toolTip3');
    public toolTip4 = this.translate.instant('TSC_toolTip4');
    public toolTip5 = this.translate.instant('TSC_toolTip5');
    public deviationNames = {
        Name1: 'Projektering',
        Name2: 'Kvalitetsändring',
        Name3: 'Arbetsmiljö',
        Name4: 'Fråga/svar',
        Name5: 'Avvikelse',
        Name6: 'Tilläggs/ändringsarbete',
        Name7: 'Garantiarbete',
        Name8: 'Störning',
        Name9: 'Hinder',
        Name10: 'Rubbning'
    }
    public firstButtonError = false;
    public desriptionError = false;
    public questionError = false;
    public declineError = false;
    public mainPdfLink;
    public wrapper: any;
    public viewer: any;
    public status: any;
    public mainClientDescription: any = "";
    public clientResponses = [];
    public files = {
        pdfs: [],
        images: []
    };
    public emailLogId = -1;
        images: any[] = [];
        pdfs: any = [];
        activeImage = -1;
        activePdf = -1;
        swiper = {
        images: [],
        active: -1,
        album: -2,
        index: -1,
        parent: null,
        margin: '270px'
    };
    public showGallery:any = 'hidden';
    public filesArray:any[] = [];

  constructor(
    private ataService: AtaService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    public sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private fsService: FileStorageService,
    private projectsService: ProjectsService,
  ) {
    translate.setDefaultLang('sw');
  }

  filterClientResponses() {

    const group = this.replyMessages?.group;
    const mainClient = this.replyMessages?.mainClient;


    this.clientResponses = this.replyMessages.clientResponses.filter((cliRes)=>{
      return cliRes.active != 1;
    });
    this.clientResponses = this.clientResponses.filter((cliRes)=>{
      return (cliRes.Status == 1 && cliRes.client_message != null) || cliRes.Status != 1;
    });

    const clientResponses = this.replyMessages.clientResponses.filter((res)=>{
      return res.group == group;
    });
    this.findEmailLogId();

    if (
      mainClient.email.trim() == this.replyMessages.email.trim() && clientResponses.length > 0 &&
      clientResponses[0].Status != 1

      ) {
      this.loadMainClientView();
    }
  }

  calcLineHeight() {

    if (!this.fixedBlueScroll) return {};
    return {
      height: this.fixedBlueScroll.nativeElement.scrollHeight  + 'px'
    }
  }

  findEmailLogId() {
    const queryParms = this.route.snapshot.params;
    const email = queryParms.email.trim();
    const group = queryParms.group.trim();
    for (let i = 0; i < this.replyMessages.clientResponses.length; i++) {
      const response = this.replyMessages.clientResponses[i];
      if (response.group.trim() == group && response.answerEmail.trim() == email && response.active == 1) {
        this.emailLogId = response.id;
      }
    }
  }

  setFiles($event) {
    this.files = $event;
  }

  ngOnInit() {

    this.replyMessages = this.route.snapshot.data['replyMessages']['data'];
    this.general = this.route.snapshot.data["generals"];
    this.typeDeviation = this.route.snapshot.data["getTypeDeviation"];
    //const isManuallyResponse = this.replyMessages ? this.replyMessages.clientResponses.find((response) => response.manualReply == 1) : false;
    let client_status_svar = (this.replyMessages != null && this.replyMessages != undefined) ? this.replyMessages.clientResponses.find((res) => res.Status == 9) : null;

    if (!this.replyMessages || this.replyMessages == undefined || client_status_svar != undefined || (this.replyMessages && this.replyMessages.ata_message.ataStatus != 4 )
      /*|| isManuallyResponse*/) {
      this.router.navigate(['/external/response/fail']);
    }
    this.getDeviationType(this.replyMessages.ata_message.Type);
    this.filterClientResponses();

    this.general?.forEach(value=>{
      if(value?.key == 'Logo'){
        this.logoImage = value.value;
      }
      if(value?.key == 'Company_Name'){
        this.companyName = value.value;
      }
    })

    if(this.replyMessages){
    const images: any[] = [];
    const pdfs: any[] = [];

    this.replyMessages.documents.forEach((file:any)=>{
      if (file.document_type === "Image") {
        images.push(file);
      } else {
        pdfs.push(file);
      }
    });

    this.images = images;
    this.pdfs = pdfs;
    this.filesArray = [...this.images, ...this.pdfs];
    this.sortPdfs();

    this.today = new Date();
     this.CurrentDate =
        this.today.getFullYear() +
        "-" + ((this.today.getMonth()<9) ? '0': '') +
        (this.today.getMonth() + 1) +
        "-" + ((this.today.getDate()<10) ? '0': '') +
        this.today.getDate();

    this.mainPdfLink = this.sanitizer.bypassSecurityTrustResourceUrl(this.replyMessages.ata_message.pdf_link);
  }

  this.toolTip1 = this.translate.instant('TSC_toolTip1');
  this.toolTip2 = this.translate.instant('TSC_toolTip2');
  this.toolTip3 = this.translate.instant('TSC_toolTip3');
  this.toolTip4 = this.translate.instant('TSC_toolTip4');
  this.toolTip5 = this.translate.instant('TSC_toolTip5');

}

  loadMainClientView() {
    this.isMainClient = true;
    this.description = this.replyMessages.clientResponses[0].client_message ? this.replyMessages.clientResponses[0].client_message : '';

    switch (this.replyMessages.clientResponses[0].Status) {
      case '2':
        this.status = 'success';
        break;
      case '4':
        this.status = 'success-fast';
        break;
      case '0':
        this.status = 'question';
        break;
      case '3':
        this.status = 'decline';
        break;
      default:
        return false;
    }
  }

  setDefaultFiles() {
    if (!this.files) {
      this.files = {
        images: [],
        pdfs: []
      };
   }
  }

  submit(status) {
    this.showSendButton = false;
    this.spinner = true;
    this.status = status;
    this.firstButtonError = false;
    this.desriptionError = false;
    this.questionError = false;
    this.declineError = false;
    if ((this.status === 'question' || this.status === 'success-question') && this.description.length < 1) {
      this.spinner = false;
      this.questionError = true;
      this.toastr.error(this.translate.instant('Please fill out Question field to choose this option.'), this.translate.instant('Error'));
    }
    else if (this.status === 'decline' && this.description.length == 0) {
      this.spinner = false;
      this.status === 'decline' ? this.declineError = true : this.firstButtonError = true;
      this.toastr.error(this.translate.instant('Please provide a comment.'), this.translate.instant('Error'));
    } else {
      this.showSendButton = true;
      this.spinner = false;
    }
  }

  mainClientAnswer(status) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().toPromise2().then((response)=>{
      if (response.result) {

        this.spinner = true;

        this.setDefaultFiles();

        this.fsService.mergeFilesAndAlbums(this.files).then((response: any) => {
            const files = {
                images: [],
                pdfs: []
            };

            if(response != null) {
                files.images = response.images;
                files.pdfs = response.pdfs;
            }

            const data = {
              ataID: this.replyMessages.ataID,
              token: this.replyMessages.token,
              email: this.replyMessages.email,
              messageID: this.replyMessages.messageID,
              CwId: this.replyMessages.CwId,
              group: this.replyMessages.group,
              clientResponses: this.replyMessages.clientResponses,
              status: status == 'success' ? (this.status === "success-fast" ? this.status : status) : (status),
              description: this.mainClientDescription || '',
              question: this.question,
              files: files,
              pdf_images_link: this.replyMessages.ata_message.pdf_images_link,
              reminder: this.replyMessages.reminder,
              mainContact:  this.replyMessages.client_workerEmail,
              mainContactEmail:this.replyMessages.email,
              isMainContact: this.replyMessages.CwId == this.replyMessages.client_workerEmail.Id,
              emailLogId: this.emailLogId,
              projectId: -1
            }
            this.ataService.createMessageFromClient(data).subscribe(res => {
              if (res['status']) {
                this.router.navigate(['/external/response/success']);
                this.spinner = false;
              } else {
                this.router.navigate(['/external/response/fail']);
                this.spinner = false;
              }
            });
        });
      }
    });
  }

  send() {

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().toPromise2().then((response)=>{
      if (response.result) {

         this.spinner = true;
          this.setDefaultFiles();

          this.fsService.mergeFilesAndAlbums(this.files).then((response: any) => {
              const files = {
                  images: [],
                  pdfs: []
              };

              if(response != null) {
                  files.images = response.images;
                  files.pdfs = response.pdfs;
              }

              const data = {
                ataID: this.replyMessages.ataID,
                token: this.replyMessages.token,
                email: this.replyMessages.email,
                messageID: this.replyMessages.messageID,
                CwId: this.replyMessages.CwId,
                group: this.replyMessages.group,
                status: this.status,
                description: this.description,
                question: this.question,
                files: files,
                pdf_images_link: this.replyMessages.ata_message.pdf_images_link,
                reminder: this.replyMessages.reminder,
                mainContact:  this.replyMessages.client_workerEmail,
                mainContactEmail:this.replyMessages.email,
                isMainContact: this.replyMessages.CwId == this.replyMessages.client_workerEmail.Id,
                emailLogId: this.emailLogId,
                projectId: -1
              }

              this.ataService.createMessageFromClient(data).subscribe(res => {
                if (res['status']) {
                  this.router.navigate(['/external/response/success']);
                  this.spinner = false;
                } else {
                  this.router.navigate(['/external/response/fail']);
                  this.spinner = false;
                }
              });
          });
        }});
  }

  checkInput() {
    this.showSendButton = false;
    if (this.description.length) {
      this.questionError = false;
      this.desriptionError = false;
      this.declineError = false;
    } else {
      this.firstButtonError = false;
    }
  }

    toggleAttachmentImage(e = null) {
        if (e) {
            if (e.target.id !== 'looksLikeModal') {
                return;
            }
        }
        this.showPdfPreview = !this.showPdfPreview;
    }

    closeAndOpen(index, pdfs) {

        if (this.pdfjsViewerComponent) {
            this.pdfjsViewerComponent.closeSwiper();
        }

        setTimeout(() => {
            this.openSwiper(index, pdfs, -1);
        }, 100);
    }

    isPDFViewer: boolean = false;

    openSwiper(index, files, album) {

        this.showGallery = 'visible';
        if (files[index].document_type === "Image") {
            this.isPDFViewer = false;
            this.swiper = {
                active: index,
                images: files,
                album: album,
                index: -1,
                parent: null,
                margin: '270px'
            };
            this.activePdf = -1;
            this.activeImage = index;
        } else {
            this.isPDFViewer = true;
            const fileArray = this.createFileArray(files[index]);
            this.swiper = {
                active: 0,
                images: fileArray,
                album: album,
                index: index,
                parent: files[index],
                margin: '270px'
            };
            this.activePdf = index;
            this.activeImage = -1;
        }
    }

  closeSwiper() {
    this.showGallery = 'hidden';
    this.swiper = {
      images: [],
      active: -1,
      album: -2,
      index: -1,
      parent: null,
      margin: '270px'
    }
    this.activePdf = -1;
    this.activeImage = -1;
  }

  removeSwiperImage(event) {}

  createFileArray(file) {

    const id = file.id;
    const comment = file.Description;
    const name = file.Name ? file.Name : file.name;
    const file_path = file.file_path;
    const fileArray = file_path.split(",").map((fileArray)=>{
        return {
            image_path: fileArray,
            id: id,
            Description: comment,
            name: name,
            file_path: file_path
        };
    });
    return fileArray;
  }

  calcContainerLineHeight() {
    if (!this.containerBlueScroll) return {};
    return {
      height: this.containerBlueScroll.nativeElement.scrollHeight  + 'px'
    }
  }

  setActive($event) {
    this.activeImage = $event;
  }

  getDeviationType(id) {
    let type = this.typeDeviation?.find(type => type.id == id)
    if (type) {
      this.NameTypeDeviation = type.Name;
    }
  }

    setDeviationName(){
        switch(this.replyMessages?.ata_message?.Type){
            case '3' : this.NameTypeDeviation = this.deviationNames.Name1;
            break;
            case '4' : this.NameTypeDeviation = this.deviationNames.Name2;
            break;
            case '5' : this.NameTypeDeviation = this.deviationNames.Name3;
            break;
            case '6' : this.NameTypeDeviation = this.deviationNames.Name4;
            break;
            case '7' : this.NameTypeDeviation = this.deviationNames.Name5;
            break;
            case '1' : this.NameTypeDeviation = this.deviationNames.Name6;
            break;
            case '2' : this.NameTypeDeviation = this.deviationNames.Name7;
            break;
            case '8' : this.NameTypeDeviation = this.deviationNames.Name8;
            break;
            case '9' : this.NameTypeDeviation = this.deviationNames.Name9;
            break;
            case '10' : this.NameTypeDeviation = this.deviationNames.Name10;
            break;
            default:
                this.NameTypeDeviation = '';
        }
    }

    sortPdfs(){
        let count = 0;
        let len = this.replyMessages.ProjectCustomName?.length;
        let mainPdf:any = null;
        this.pdfs.forEach((pdf,i)=>{
        if((pdf.name?.slice(0,len) == this.replyMessages.ProjectCustomName?.slice(0,len)) && count==0){
            mainPdf = pdf;
            this.pdfs?.splice(i,1);
            count++;
        }
    })
        if(mainPdf!=null) this.pdfs.unshift(mainPdf);
    }

    async downloadAllDocuments() {
        this.spinner = true;
        let document_name = 'documents-' + moment().format("YYYY-MM-DD");
        let mapped_data = this.filesArray.map((c:any) => c.Url);
        this.createZip(mapped_data, document_name);
    }

    async createZip(files: any[], zipName: string) {

        const zip = new JSZip();
        const name = zipName + '.zip';

        for (let counter = 0; counter < files.length; counter++) {
            const element = files[counter];
            await this.projectsService.getFile(element).then((fileData:any)=> {
                let index = this.filesArray.findIndex((res)=> { return res.Url == element});
                const b: any = new Blob([fileData], { type: '' + fileData.type + '' });
                zip.file(this.filesArray[index].name, b);
            });
        }

        zip.generateAsync({ type: 'blob' }).then((content) => {
            if (content) {
                FileSaver.saveAs(content, name);
                this.spinner = false;
            }
        });
    }

    async getFile(url: string) {
        this.projectsService.getFile(url).then((result)=> {
            return result;
        });
    }

    downloadURI(uri, name) {
        this.spinner = true;
        const link = document.createElement("a");
        link.setAttribute("download", name);
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout( () => { this.spinner = false;}, 2000 );
    }

    printDocument(ext, file_path, name) {
        this.spinner = true;
        if (ext === "pdf") {
            printJS({ printable: `${file_path}`, type: "pdf", documentTitle: name });
        } else {
            printJS({
                printable: `${file_path}`,
                type: "image",
                documentTitle: name,
            });
        }
        setTimeout( () => { this.spinner = false;}, 2000 );
    }
}
