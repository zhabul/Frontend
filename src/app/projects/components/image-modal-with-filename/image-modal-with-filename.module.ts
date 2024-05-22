import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageModalWithFilenameComponent } from './image-modal-with-filename.component';
import { createTranslateLoader } from "src/app/createTranslateLoader";
import { HttpClient } from "@angular/common/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DndModule } from "./dnd.module";
import { FilePreviewModule } from "../image-modal/file-preview/file-preview.module";
import { GalleryModule } from "../../../utility/gallery/gallery.module";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";
import { PdfjsviewerModule } from 'src/app/utility/pdfjs-viewer/pdfjsviewer.module';

@NgModule({
  declarations: [ImageModalWithFilenameComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    MatSelectModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    DndModule,
    FilePreviewModule,
    GalleryModule,
    PdfjsviewerModule
  ],
  exports: [ImageModalWithFilenameComponent],
  entryComponents: [],
  providers: [],
  bootstrap: [],
})
export class ImageModalWithFilenameModule { }
