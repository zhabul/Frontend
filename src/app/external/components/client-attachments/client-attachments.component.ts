import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ProjectsService } from "src/app/core/services/projects.service";
import { DomSanitizer } from '@angular/platform-browser';
//import { ImageModalComponent } from "src/app/projects/components/image-modal/image-modal.component";
import { ImageModalUtility } from "src/app/projects/components/image-modal/image-modal-utility.service";
import { PdfjsViewerComponent } from "src/app/utility/pdfjs-viewer/pdfjs-viewer.component";

@Component({
  selector: "app-client-attachments",
  templateUrl: "./client-attachments.component.html",
  styleUrls: ["./client-attachments.component.css"],
  providers: [ImageModalUtility],
})
export class ClientAttachmentsComponent implements OnInit {

  @ViewChild('fixedBlueScroll') fixedBlueScroll;
  @ViewChild(PdfjsViewerComponent) pdfjsViewerComponent: PdfjsViewerComponent;

  public email: any;
  public token: any;
  public pdf_documents: any = [];
  public image_documents: any = [];
  public documents: any = [];
  public selcted_data:any = [];
  public keys:any = [];
  public property:any = [];
  public type:any = 'pdfs';
  public allowTemplate:boolean = false;
  public showAttachmentImage = false;

  public images: any[] = [];
  public pdfs:any[] = [];
  public activeImage = -1;
  public activePdf = -1;
  public content_type:any;
  public table_type:any;
  public deviation_message_id:any;
  public projectName:any;

  swiper = {
    images: [],
    active: -1,
    album: -2,
    index: -1,
    parent: null,
  };

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    public sanitizer: DomSanitizer,

  ) {}

  ngOnInit() {
    let values = this.route.snapshot.params;
    this.email = values.email;
    this.token = values.token;
    this.route.queryParamMap.subscribe((params) => {
      this.table_type = params.get("content_type") || null;
      this.content_type = params.get("type") || null;
      this.deviation_message_id = params.get("message_id") || null;
    });



    this.getDocuments();
  }

  getDocuments() {
    this.projectsService.getAllDocuments(this.email, this.token, this.table_type, this.content_type, this.deviation_message_id).then((res) => {
        this.images = res['data']['allImages'];
        this.pdfs = res['data']['allPdfs'];
        this.sortPdfs();
        this.property = res['data']['property'];
        this.allowTemplate = true;
        this.openSwiper(
          0,
          this.pdfs,
          -1
        );
    });
  }

  selectedData(type) {
      this.type = type;

      if(type == 'images') {
          this.selcted_data = this.image_documents;
      }else {
          this.selcted_data = this.pdf_documents;
      }
  }


  getAlbumFiles(albumKey, type) {

    const files = this.selcted_data[albumKey][type];
    return files;
  }

  getAlbumKeys() {
    let keys = [];

    if (this.selcted_data) {
      const files = this.selcted_data;
      keys = Object.keys(files).sort(function (a, b) {
        return Number(b) - Number(a);
      });
    }

    return keys;
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
  openSwiper(index, images, album) {

    if (images[index].document_type === "Image") {
      this.isPDFViewer = false;

      this.swiper = {
        active: index,
        images: images,
        album: album,
        index: -1,
        parent: null,
      };
      this.activePdf = -1;
      this.activeImage = index;
    } else {
      this.isPDFViewer = true;

      const imageArray = this.createImageArray(images[index]);
      this.swiper = {
        active: 0,
        images: imageArray,
        album: album,
        index: index,
        parent: images[index],
      };

      this.activePdf = index;
      this.activeImage = -1;
    }

  }

  createImageArray(image) {
    const id = image.id;
    const comment = image.Description;
    const name = image.Name ? image.Name : image.name;
    //const image_path = image.image_path;
    const file_path = image.file_path;

    const imageArray = file_path.split(",").map((imageString) => {
      return {
        image_path: imageString,
        id: id,
        Description: comment,
        name: name,
        file_path: file_path,
      };
    });
    return imageArray;
  }

  toggleAttachmentImage(e = null) {
    if (e) {
      if (e.target.id !== "looksLikeModal") {
        return;
      }
    }
    this.showAttachmentImage = !this.showAttachmentImage;
  }

  closeSwiper() {
    this.swiper = {
      active: -1,
      images: [],
      album: -2,
      index: -1,
      parent: null,
    };
    this.activePdf = -1;
    this.activeImage = -1;
  }


  getAlbumDescription(albumKey) {
    const description =
      this.selcted_data[albumKey]["description"];
    return description ? description : "";
  }

  calcLineHeight() {

    if (!this.fixedBlueScroll) return {};
    return {
      height: this.fixedBlueScroll.nativeElement.scrollHeight  + 'px'
    }
  }

  setActive($event) {
    this.activeImage = $event;
  }

  sortPdfs(){
   let count = 0;
   let mainPdf:any = null;
    this.pdfs?.forEach((pdf,i)=>{
      let check = false;
      if(pdf.content_type == "ATA"){
         let check1 = pdf?.name?.includes('-ÄTA-');
         let check2 = pdf?.name?.includes('Ata_');
         if(check1&&check2) check = true;
      } 
      
      else if(pdf.content_type == "Deviation"){
        check = pdf?.name?.includes('-Underrattelse-');
      }
  
       if(check&&count==0){
           mainPdf = pdf;
           this.pdfs?.splice(i,1);
           count++;
       } 
   })
    if(mainPdf!=null) this.pdfs.unshift(mainPdf);
  }
}
