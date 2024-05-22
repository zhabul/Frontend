import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ImageModalSmallComponent } from './image-modal-small.component';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {createTranslateLoader} from '../../../createTranslateLoader';
import {HttpClient} from '@angular/common/http';
import { FilePreviewModule } from '../image-modal/file-preview/file-preview.module';
import { GalleryModule } from '../../../utility/gallery/gallery.module';
import { PdfjsviewerModule } from "src/app/utility/pdfjs-viewer/pdfjsviewer.module";

@NgModule({
    declarations: [
        ImageModalSmallComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatSelectModule,
        TranslateModule.forChild({
            loader: {
              provide: TranslateLoader,
              useFactory: createTranslateLoader ,
              deps: [HttpClient]
            }
          }),
        FilePreviewModule,
        GalleryModule,
        PdfjsviewerModule
    ],
    exports: [
        ImageModalSmallComponent
    ],
    entryComponents: [

    ],
    providers: [

    ],
    bootstrap: []
  })
  export class ImageModalSmallModule {
  }
