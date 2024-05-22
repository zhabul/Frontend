import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';

@Component({
  selector: 'app-pdfjs-preview',
  templateUrl: './pdfjs-preview.component.html',
  styleUrls: ['./pdfjs-preview.component.css']
})
export class PdfjsPreviewComponent implements OnInit {

  @Input() pdfUrls: string[];
  @Input() deleted: boolean;
  @Input() width: any;
  @Input() height: any;
  @Input() canvas_width: any;
  @Input() canvas_height: any;
  @Input() canvas_left: any;
  @Input() canvas_top: any;
  @Input() svg_width: any;
  @Input() svg_height: any;
  @Input() borderRadius: string;
  @Input() folder: boolean;
  @Input("index") index;
  canRemove;
  @Input('canRemove') set setCanRemove(value: boolean) {
    this.canRemove = value;
  };
  showcheckbox;
  @Input('showcheckbox') set setShowCheckBox(value: boolean) {
    this.showcheckbox = value;
  };

  clicked: boolean = false;
  PDFNotAvaliable: string; //Poruka koja se prikazuje kada PDF nije dostupan.

  @Output() removeFile = new EventEmitter<number>();

  @ViewChildren('pdfCanvas') pdfCanvases: QueryList<ElementRef>;

  constructor(private translate: TranslateService) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.6.172/build/pdf.worker.js';
  }

  ngOnInit(): void {
    this.PDFNotAvaliable = this.translate.instant('PDF file not available.');

    if(!this.width && !this.svg_width) {
      this.svg_width = this.width;
    }
    if(!this.height && !this.svg_height) {
      this.svg_height = this.height;
    }

    if(!this.svg_width) {
      this.svg_width = 67.478;
    }
    if(!this.svg_height) {
      this.svg_height = 58.682;
    }

    if(!this.canvas_width) {
      this.canvas_width = 66;
    }
    if(!this.canvas_height) {
      this.canvas_height = 41.7;
    }

    if(!this.canvas_left) {
      this.canvas_left = 0;
    }

    if(!this.canvas_top) {
      this.canvas_top = 11;
    }
  }

  ngAfterViewInit() {
    this.loadPdf();
  }

// Inicijalizirajte Map objekt za povezivanje URL-a PDF-a s informacijom je li prazan
pdfEmptyMap: Map<string, boolean> = new Map();
async loadPdf() {
  const promises = this.pdfUrls.map(async (pdfUrl, i) => {
    try {
      const pdfDoc: pdfjsLib.PDFDocumentProxy = await pdfjsLib.getDocument(pdfUrl).promise;

      if (pdfDoc.numPages === 0) {
        return { url: pdfUrl, isEmpty: true };
      }

      const pageNum = 1;
      const page = await pdfDoc.getPage(pageNum);

      return { url: pdfUrl, isEmpty: false, page };
    } catch (error) {
      return { url: pdfUrl, isEmpty: true };
    }
  });

    const results = await Promise.all(promises);

    results.forEach(({ url, isEmpty, page }, i) => {
      if (!isEmpty) {
        const viewport = page.getViewport({ scale: 0.5 }); // Prilagodite skaliranje prema potrebi
        const canvas = this.pdfCanvases.toArray()[i].nativeElement as HTMLCanvasElement;
        const context = canvas.getContext('2d', { alpha: false });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const canvasContextParams = {
          canvasContext: context,
          viewport: page.getViewport({ scale: 0.5 }), // Smanjeno skaliranje na 0.5
          renderInteractiveForms: false,
          enableWebGL: false,
          textLayer: false,
          imageLayer: false,
        };

        page.render(canvasContextParams);
      } else {
        this.pdfEmptyMap.set(url, true);
      }
    });
  }

  onDeleteEmit(event) {
    event.stopPropagation();
    this.removeFile.emit(this.index);
  }

  onInputClick() {
    this.clicked = !this.clicked;
  }

}


