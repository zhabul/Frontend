import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MainPdfPreviewComponent } from "./main-pdf-preview.component";
import { PreviewImageComponent } from './preview-image/preview-image.component';

@NgModule({
  declarations: [ MainPdfPreviewComponent, PreviewImageComponent ],
  imports: [
    CommonModule 
  ],
  exports: [ MainPdfPreviewComponent ],
  entryComponents: [],
  providers: [],
  bootstrap: [],  
})
export class MainPdfPreviewModule {}
