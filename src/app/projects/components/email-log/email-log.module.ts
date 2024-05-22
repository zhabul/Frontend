import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailLogComponent } from './email-log.component';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { createTranslateLoader } from 'src/app/createTranslateLoader';
import { HttpClient } from "@angular/common/http";
import { PdfIconComponent } from './svg-icons/pdf-icon/pdf-icon.component';
import { SendIconComponent } from './svg-icons/send-icon/send-icon.component';
import { AcceptedIconComponent } from './svg-icons/accepted-icon/accepted-icon.component';
import { DeclinedIconComponent } from './svg-icons/declined-icon/declined-icon.component';
import { RemindIconComponent } from './svg-icons/remind-icon/remind-icon.component';
import { FormsModule } from '@angular/forms';
import { FilePreviewModule } from '../image-modal/file-preview/file-preview.module';
import { StatusChangeIconComponent } from './svg-icons/status-change-icon/status-change-icon.component';
import { PdfjsviewerModule } from 'src/app/utility/pdfjs-viewer/pdfjsviewer.module';
import { CloseIconComponent } from './svg-icons/close-icon/close-icon.component';

@NgModule({
  declarations: [
    EmailLogComponent,
    PdfIconComponent,
    SendIconComponent,
    AcceptedIconComponent,
    DeclinedIconComponent,
    RemindIconComponent,
    StatusChangeIconComponent,
    CloseIconComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
    FilePreviewModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [
    EmailLogComponent,
    PdfjsviewerModule,
    CloseIconComponent
  ]
})
export class EmailLogModule { }
