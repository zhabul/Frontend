import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfjsViewerComponent } from './pdfjs-viewer.component';
import { PdfjsViewerPdfComponent } from './pdfjs-viewer-pdf/pdfjs-viewer-pdf.component';
import { GalleryModule } from '../gallery/gallery.module';
import { FormsModule } from '@angular/forms';
import { PdfjsPreviewComponent } from './pdfjs-preview/pdfjs-preview.component';

@NgModule({
  declarations: [
    PdfjsViewerComponent,
    PdfjsViewerPdfComponent,
    PdfjsPreviewComponent
  ],
  imports: [
    CommonModule,
    GalleryModule,
    FormsModule,

  ],
  exports: [
    PdfjsViewerComponent,
    PdfjsPreviewComponent
  ],
  entryComponents: [],
  providers: [],
  bootstrap: [],
})
export class PdfjsviewerModule { }
