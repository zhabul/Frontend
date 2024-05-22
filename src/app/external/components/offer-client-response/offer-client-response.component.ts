import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { setEmailStatus } from 'src/app/utility/component-email-status/utils';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import { PdfjsViewerComponent } from 'src/app/utility/pdfjs-viewer/pdfjs-viewer.component';
@Component({
  selector: 'app-offer-client-response',
  templateUrl: './offer-client-response.component.html',
  styleUrls: ['./offer-client-response.component.css']
})
export class OfferClientResponseComponent implements OnInit, AfterViewInit {

  public pageTotal1;
  public loaded = false;
  public totalPages;
  public ctx: CanvasRenderingContext2D;

  constructor(
        private route: ActivatedRoute,
        private router: Router,
        public sanitizer: DomSanitizer
  ) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.6.172/build/pdf.worker.js';
  }

  ngOnInit(): void {
    this.setOfferData();
    this.emailLogStatus();
  }

  ngAfterViewInit(){
    this.organizeFiles();
  }

  @ViewChild(PdfjsViewerComponent) pdfjsViewerComponent: PdfjsViewerComponent;

  public offer;
  public error = false;
  public params = {};
  setOfferData() {
    this.offer = this.route.snapshot.data.offer.data;
    if (!this.offer) {
      this.router.navigate(['/external/response/fail']);
      return;
    };
    //this.organizeFiles();
    this.loaded = true;
  }

  public canAnswer = false;
  emailLogStatus() {
    const { status } = setEmailStatus(this.offer.emailLogs);
    if (status == 1) {
      this.canAnswer = true;
    }
  }

  public images = []
  public pdfs = [];
  public mainPdf = [];
  public width = 1011.5;
  public height = 1431.4;

  closeAndOpen(index, pdfs, album) {

    if (this.pdfjsViewerComponent) {
      this.pdfjsViewerComponent.closeSwiper();
    }

    setTimeout(() => {
      this.openSwiper(index, pdfs, album);
    }, 100);
  }


  organizeFiles() {
    // this.mainPdf = this.offer.files[0].file_path
    // this.createImageArray(this.offer.files[0]);
    this.createImageArray()
    // this.offer.files.splice(0,1);
    // this.offer.files.forEach((file)=>{
    //   if (file.document_type === "Image") {
    //     this.images.push(file);
    //   } else {
    //     this.pdfs.push(file);
    //   }
    // });
    this.images = this.offer.docs.allImages;
    // this.pdfs = this.offer.docs.allPdfs;
    this.pdfs.push(this.offer.files[0]);
    this.pdfs = this.pdfs.concat(this.offer.docs.allPdfs)

  }

  public activePdf = -1;
  public swiper = {
    images: [],
    active: -1,
    album: -2,
    index: -1,
    parent: null,
    margin: '270px'
  };

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
        margin: '270px'
      };
      this.activePdf = -1;
      this.activeImage = index;
    } else {
      const imageArray = this.createFileArray(images[index]);
      this.isPDFViewer = true;
      this.swiper = {
        active: 0,
        images: imageArray,
        album: album,
        index: index,
        parent: images[index],
        margin: '270px'
      };
      this.activePdf = index;
      this.activeImage = -1;
    }
  }

  createFileArray(file) {

    const id = file.id;
    const comment = file.Description;
    const name = file.Name ? file.Name : file.name;
    //const image_path = file.image_path;
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

  closeSwiper() {
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

  createImageArray(): void {
    const pdfUrl = this.offer.files[0].file_path;
    pdfjsLib.getDocument({ url: pdfUrl, disableAutoFetch:true, disableStream:true}).promise.then(async (pdf) => {

      this.totalPages = pdf.numPages;
      for(let i = 0; i < this.totalPages; i++){
        this.mainPdf.push(i)
      }
      for(let i = 1; i <= this.totalPages;i++){
        await pdf.getPage(i).then((page) => {
          let scale = 1.7;
          let viewport = page.getViewport({scale :scale,rotation: 0});
          //
          // Prepare canvas using PDF page dimensions
          //
          let canvas = document.getElementById('the-canvas-'+i) as HTMLCanvasElement;
          setTimeout(() => {
            this.clearCanvas(canvas);
            page.render({canvasContext: this.ctx, viewport: viewport})
          }, 1000);
        });
      }

      }, function(greska) {
         console.log('Error: ' + greska.message);
      }.bind(this));
  }

  clearCanvas(canvas) {
    this.ctx = canvas.getContext('2d');
    this.ctx.save();
    this.ctx.globalCompositeOperation = 'copy';
    this.ctx.strokeStyle = 'transparent';
    this.ctx.beginPath();
    this.ctx.lineTo(0, 0);
    this.ctx.closePath(); // close
    this.ctx.stroke();
    this.ctx.restore();
    //return this.ctx;
  }

  public activeImage = -1;
  setActive($event) {
    this.activeImage = $event;
  }

  @ViewChild('fixedBlueScroll') fixedBlueScroll;
  calcLineHeight() {

    if (!this.fixedBlueScroll) return {};
    return {
      height: this.fixedBlueScroll.nativeElement.scrollHeight  + 'px'
    }
  }

  pageTotal(page){
    this.pageTotal1 = page;
  }

  moveToForm(){
    window.scrollTo(0,document.body.scrollHeight);
  }
}
