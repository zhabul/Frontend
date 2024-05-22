import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { GalleryComponent } from "./gallery.component";
import { MatIconModule } from "@angular/material/icon";
import { GalleryImageComponent } from "./gallery-image/gallery-image.component";
import { HttpClient } from "@angular/common/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { createTranslateLoader } from "../../createTranslateLoader";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PrintSvgComponent } from './print-svg/print-svg.component';
import { DownloadPdfSvgComponent } from './download-pdf-svg/download-pdf-svg.component';
import { RotateRightSvgComponent } from './rotate-right-svg/rotate-right-svg.component';
import { RotateLeftSvgComponent } from './rotate-left-svg/rotate-left-svg.component';
import { CursorMoveSvgComponent } from './cursor-move-svg/cursor-move-svg.component';
import { ZoomInSvgComponent } from './zoom-in-svg/zoom-in-svg.component';
import { ZoomOutSvgComponent } from './zoom-out-svg/zoom-out-svg.component';
import { PrintHoverSvgComponent } from './print-hover-svg/print-hover-svg.component';
import { DownloadPdfHoverAppComponent } from './download-pdf-hover-app/download-pdf-hover-app.component';
import { ArrowLeftComponent } from './arrow-left/arrow-left.component';
import { CloseSvgComponent } from './close-svg/close-svg.component';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@NgModule({
  declarations: [
    GalleryComponent,
    GalleryImageComponent,
    PrintSvgComponent,
    DownloadPdfSvgComponent,
    RotateRightSvgComponent,
    RotateLeftSvgComponent,
    CursorMoveSvgComponent,
    ZoomInSvgComponent,
    ZoomOutSvgComponent,
    PrintHoverSvgComponent,
    DownloadPdfHoverAppComponent,
    ArrowLeftComponent,
    CloseSvgComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    GalleryComponent,
    PrintSvgComponent,
    DownloadPdfSvgComponent,
    RotateRightSvgComponent,
    RotateLeftSvgComponent,
    CursorMoveSvgComponent,
    ZoomInSvgComponent,
    ZoomOutSvgComponent,
    PrintHoverSvgComponent,
    DownloadPdfHoverAppComponent,
    ArrowLeftComponent,
    CloseSvgComponent
  ],
  entryComponents: [],
  providers: [],
  bootstrap: [],
})
export class GalleryModule {}
