import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageModalCommentComponent } from './image-modal-comment.component';
import { createTranslateLoader } from "src/app/createTranslateLoader";
import { HttpClient } from "@angular/common/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GalleryModule } from "../../../utility/gallery/gallery.module";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";
import { DNDModule } from './dnd.module';
import { FilePreviewModule } from '../image-modal/file-preview/file-preview.module';

@NgModule({
  declarations: [ImageModalCommentComponent],
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
    DNDModule,
    FilePreviewModule,
    GalleryModule,
  ],
  exports: [ImageModalCommentComponent],
  entryComponents: [],
  providers: [],
  bootstrap: [],
})
export class ImageModalCommentModule { }
