import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { AtaService } from "src/app/core/services/ata.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { DomSanitizer } from "@angular/platform-browser";
import { FileStorageService } from 'src/app/core/services/file-storage.service';
import { ConfirmationModalComponent } from 'src/app/shared/modals/confirmation-modal/confirmation-modal.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PdfjsViewerComponent } from "src/app/utility/pdfjs-viewer/pdfjs-viewer.component";
import { ProjectsService } from "src/app/core/services/projects.service";
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';
//import * as printJS from "print-js";
import * as moment from "moment";
import * as printJS from "print-js";

@Component({
  selector: "app-ata-reply-message",
  templateUrl: "./ata-reply-message.component.html",
  styleUrls: ["./ata-reply-message.component.css"],
})

export class AtaReplyMessageComponent implements OnInit {

    @ViewChild('fixedBlueScroll') fixedBlueScroll;
    @ViewChild('containerBlueScroll') containerBlueScroll;
    @ViewChild("fileDropRef") fileDropEl: ElementRef;
    @ViewChild(PdfjsViewerComponent) pdfjsViewerComponent: PdfjsViewerComponent;
    public generalImage:any;
    public companyName:any;
    public today: any;
    public CurrentDate: any;
    public ata: any;
    public ataType:any;
    public articlesAdditionalWork:any;
    public articlesMaterial:any;
    public articlesOther:any;
    public existAdditionalWork:boolean=true;
    public existMaterial:boolean=true;
    public existOther:boolean=true;
    public general:any;
    public totalSum:any;
    public answer:any;
    public clientResponses:any;
    public createForm: FormGroup;
    public showPdfPreview = false;
    public whichPdfPreview;
    public chooseFile = false;
    public uploadMessage: any;
    public file: any = {};
    public description = "";
    public question = "";
    public spinner = false;
    public rotateValue: number = 0;
    public fileIsPdf = false;
    public showSendButton = false;
    public toolTip1 = this.translate.instant('TSC_TOOL_TIP_ATA_ACCEPTED');
    public toolTip2 = this.translate.instant('TSC_TOOL_TIP_ATA_QUESTION');
    public toolTip3 = this.translate.instant('TSC_TOOL_TIP_ATA_DECLINED');
    public acceptError = false;
    public questionError = false;
    public declineError = false;
    public mainPdfLink;
    public status: any;
    public emailLogId = -1;
    images: any[] = [];
        pdfs: any = [];
        activeImage = -1;
        activePdf = -1;
        files = {
        pdfs: [],
        images: []
    };
    swiper = {
        images: [],
        active: -1,
        album: -2,
        index: -1,
        parent: null,
        margin: '270px'
    };
    public styleMargin = {
        'margin-left' : '270px'
    }
    public showGallery:any = 'hidden';
    public filesArray:any[] = [];
    public offDiv = false;

    constructor(
        private ataService: AtaService,
        private projectsService: ProjectsService,
        private route: ActivatedRoute,
        private router: Router,
        private toastr: ToastrService,
        private translate: TranslateService,
        public sanitizer: DomSanitizer,
        private dialog: MatDialog,
        private fsService: FileStorageService,
    ) {
        translate.setDefaultLang("sw");
    }

  ngOnInit() {

    this.ata = this.route.snapshot.data["replyMessages"]["data"];
    if (!this.ata || this.ata == undefined) {
      this.router.navigate(["/external/response/fail"]);
      this.spinner = false;
    }

    this.translate.setDefaultLang(this.ata['company_language']);
    this.general = this.route.snapshot.data["generals"];

    this.general.forEach(val=>{
      if(val['key'] == "Logo"){
        this.generalImage = val.value
      }
      if(val['key'] == "Company_Name"){
        this.companyName = val.value;
      }
    })

    this.clientResponses=this.ata.clientResponses;

    if((this.ata.ata.articlesAdditionalWork.length == 1 && this.ata.ata.articlesAdditionalWork[0]['Name'] == ' ') ||
        this.ata.ata.articlesAdditionalWork.length==0){

        this.existAdditionalWork=false;
    }
    if((this.ata.ata.articlesMaterial.length == 1 && this.ata.ata.articlesMaterial[0]['Name'] == ' ') ||
       this.ata.ata.articlesMaterial.length==0){

       this.existMaterial=false;
    }
    if((this.ata.ata.articlesOther.length == 1 && this.ata.ata.articlesOther[0]['Name'] == ' ') ||
       this.ata.ata.articlesOther.length==0){

       this.existOther=false;
    }


    this.emailLogId = Number(this.ata.emailLogId);

    if (this.ata) {
      const images: any[] = [];
      const pdfs: any[] = [];

      this.ata.documents.forEach((file: any) => {
        if (file.document_type === "Image") {
          images.push(file);
        } else {
          pdfs.push(file);
        }
      });

      this.images = images;
      this.pdfs = pdfs;
      this.filesArray = [...this.images, ...this.pdfs];

      this.today = new Date();
      this.CurrentDate =
        this.today.getFullYear() +
        "-" + ((this.today.getMonth()<9) ? '0': '') +
        (this.today.getMonth() + 1) +
        "-" + ((this.today.getDate()<10) ? '0': '') +
        this.today.getDate();
      this.mainPdfLink = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.ata.ata.PDFUrl
      );
    }

    if(this.ata.ata.AtaType==1){
      this.ataType='Tilläggsarbeten';
    }else if(this.ata.ata.AtaType==2){
      this.ataType='Ändringsarbeten';
    }else if(this.ata.ata.AtaType==3){
      this.ataType='Avgående arbete';
    }

    this.articlesAdditionalWork=this.ata.ata.articlesAdditionalWork;
    this.articlesMaterial=this.ata.ata.articlesMaterial;
    this.articlesOther=this.ata.ata.articlesOther;

    if(this.ata){
      let sum=0;
       if(this.existAdditionalWork){
       for(let i=0;i<this.articlesAdditionalWork.length;i++){
          sum+=parseFloat(this.articlesAdditionalWork[i].Total);
        } }
      if(this.existMaterial){
        for(let i=0;i<this.articlesMaterial.length;i++){
           sum+=parseFloat(this.articlesMaterial[i].Total);
        } }
       if(this.existOther){
        for(let i=0;i<this.articlesOther.length;i++){
           sum+=parseFloat(this.articlesOther[i].Total);
        } }
       this.totalSum=sum.toFixed(2);
       return this.totalSum;
    }
    this.toolTip1 = this.translate.instant('TSC_TOOL_TIP_ATA_ACCEPTED');
    this.toolTip2 = this.translate.instant('TSC_TOOL_TIP_ATA_QUESTION');
    this.toolTip3 = this.translate.instant('TSC_TOOL_TIP_ATA_DECLINED');
  }

  submit(status) {
    this.showSendButton = false;
    this.spinner = true;
    this.status = status;
    this.acceptError = false;
    this.questionError = false;
    this.declineError = false;

    if (this.status === "question" && this.description.length < 1) {
      this.spinner = false;
      this.questionError = true;
      this.toastr.error(
        this.translate.instant(
          "Fill in the Description / Question field to select this option."
        ),
        this.translate.instant("Error")
      );
    } else if (this.status === "decline" && this.description.length < 1) {
      this.spinner = false;
      this.declineError = true;
      this.toastr.error(
        this.translate.instant(
          "Fill in the Description / Question field to select this option."
        ),
        this.translate.instant("Error")
      );
    } else {
      this.showSendButton = true;
      this.spinner = false;
    }
  }

  send() {

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().toPromise().then((response)=>{
      if (response.result) {

        this.spinner = true;

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
            ataID: this.ata.ataID,
            token: this.ata.token,
            email: decodeURIComponent(this.ata.email),
            messageID: this.ata.messageID,
            CwId: this.ata.CwId,
            group: this.ata.group,
            status: this.status == "accept" ? 2 : this.status == "decline" ? 3 : 0,
            description: this.description,
            question: this.question,
            files: this.files,
            labeling_requirements: this.ata.ata.labeling_requirements,
            mainContact: this.ata.client_workerEmail,
            isMainContact: this.ata.CwId == this.ata.client_workerEmail.Id,
            reminder: this.ata.reminder,
            emailLogId: this.emailLogId,
            projectId: -1
          };

          this.ataService.confirmAtaStatus(data).subscribe({
            next: (res) => {
              if (res["status"]) {
                this.router.navigate(["/external/response/success"]);
                this.spinner = false;
              } else {
                this.router.navigate(["/external/response/fail"]);
                this.spinner = false;
              }
            },
            error: () => {
              this.router.navigate(["/external/response/fail"]);
              this.spinner = false;
            },
          });

        });
      }
    });
  }

  checkInput() {
    this.showSendButton = false;
    if (this.description.length) {
      this.declineError = false;
      this.questionError = false;
    } else {
      this.acceptError = false;
    }
  }

  previewPdf(pdfPath, type) {
    if (type == "Pdf") {
      this.fileIsPdf = true;
    } else {
      this.fileIsPdf = false;
    }

    if (pdfPath == undefined) {
      this.showPdfPreview = false;
    } else {
      this.showPdfPreview = !this.showPdfPreview;
      this.whichPdfPreview =
        this.sanitizer.bypassSecurityTrustResourceUrl(pdfPath);
    }
  }

  toggleAttachmentImage(e = null) {
    if (e) {
      if (e.target.id !== "looksLikeModal") {
        return;
      }
    }
    this.showPdfPreview = !this.showPdfPreview;
  }

  setFiles($event) {
    this.files = $event;
  }

  checkDocumentExtension(document) {
    if (document.document_type == "Image") {
      return true;
    } else {
      return false;
    }
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
        this.showGallery = 'hidden'
        this.swiper = {
            images: [],
            active: -1,
            album: -2,
            index: -1,
            parent: null,
            margin: '270px'
        };
        this.activePdf = -1;
        this.activeImage = -1;
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

    removeSwiperImage(event) {}

    createFileArray(file) {
        const id = file.id;
        const comment = file.Description;
        const name = file.Name ? file.Name : file.name;
        const file_path = file.file_path;
        const fileArray =  file_path.split(",").map((fileArray) => {
            return {
                image_path: fileArray,
                id: id,
                Description: comment,
                name: name,
                file_path: file_path,
            };
        });
        return fileArray;
    }

    calcLineHeight() {

        if (!this.fixedBlueScroll) return {};
        return {
            height: this.fixedBlueScroll.nativeElement.scrollHeight  + 'px'
        }
        return;
    }

    calcContainerLineHeight() {
        if (!this.containerBlueScroll) return {};
        return {
            height: this.containerBlueScroll.nativeElement.scrollHeight  + 'px'
        }
        return;
    }

    setActive($event) {
        this.activeImage = $event;
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
}