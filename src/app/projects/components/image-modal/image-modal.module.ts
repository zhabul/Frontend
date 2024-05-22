import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ImageModalComponent } from "./image-modal.component";
import { createTranslateLoader } from "src/app/createTranslateLoader";
import { HttpClient } from "@angular/common/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DNDModule } from "./dnd.module";
import { FilePreviewModule } from "./file-preview/file-preview.module";
import { GalleryModule } from "../../../utility/gallery/gallery.module";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";
import { PdfjsviewerModule } from "src/app/utility/pdfjs-viewer/pdfjsviewer.module";

@NgModule({
  declarations: [ImageModalComponent],
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
    PdfjsviewerModule
  ],
  exports: [ImageModalComponent],
  entryComponents: [],
  providers: [],
  bootstrap: [],
})
export class ImageModalModule {}
