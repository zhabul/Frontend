import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { FilePreviewComponent } from './file-preview.component';
import { SafePipe } from './safe-pipe';
import { FileLoadDirective } from './file-load.directive';
import {createTranslateLoader} from 'src/app/createTranslateLoader';
import {HttpClient} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { FolderSvgComponent } from './folder-svg/folder-svg.component';
import { PdfViewerModule } from "ng2-pdf-viewer";
import { SvgCloseComponent } from './svg-close/svg-close.component';
import { PdfjsviewerModule } from "src/app/utility/pdfjs-viewer/pdfjsviewer.module";

@NgModule({
    declarations: [
        FilePreviewComponent,
        SafePipe,
        FileLoadDirective,
        FolderSvgComponent,
        SvgCloseComponent
    ],
    imports: [
        CommonModule,
        TranslateModule.forChild({
            loader: {
              provide: TranslateLoader,
              useFactory: createTranslateLoader ,
              deps: [HttpClient]
            }
        }),
        PdfViewerModule,
        PdfjsviewerModule
    ],
    exports: [
        FilePreviewComponent,
        FileLoadDirective,
        SafePipe
    ],
    entryComponents: [

    ],
    providers: [

    ],
    bootstrap: []
  })
  export class FilePreviewModule {
  }
