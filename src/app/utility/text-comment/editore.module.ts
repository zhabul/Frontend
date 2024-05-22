import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { createTranslateLoader } from "../../createTranslateLoader";
import { TextCommentComponent } from "./text-comment.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { QuillModule } from 'ngx-quill';
import { ImageModalCommentModule } from "src/app/projects/components/image-modal-comment/image-modal-comment.module";
//import { FilePreviewModule } from "src/app/projects/components/image-modal/file-preview/file-preview.module";
import { GalleryModule } from "../gallery/gallery.module";
import { FilePreviewModule } from "src/app/projects/components/image-modal/file-preview/file-preview.module";
import { PdfjsviewerModule } from "../pdfjs-viewer/pdfjsviewer.module";

@NgModule({
  declarations: [TextCommentComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
    ImageModalCommentModule,
    FilePreviewModule,
    GalleryModule,
    PdfjsviewerModule
  ],
  exports: [TextCommentComponent],
  entryComponents: [],
  providers: [],
  bootstrap: [],
})
export class EditoreModule {}
