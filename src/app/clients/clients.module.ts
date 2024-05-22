import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { createTranslateLoader } from "../createTranslateLoader";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { ClientsComponent } from "./components/clients/clients.component";
import { ClientsRoutingModule } from "./clients-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { ClientDetailsComponent } from "./components/client-details/client-details.component";
import { SorterService } from "../core/services/sorter.service";
import { NewClientComponent } from "./components/new-client/new-client.component";
import { InvoiceComponent } from "./components/invoices/invoice.component";
import { InvoiceOverviewComponent } from "./components/invoice-overview/invoice-overview.component";
import { AttachmentComponent } from "./components/attachment/attachment.component";
import { DirectoryDetailComponent } from "./components/directory-detail/directory-detail.component";
import { DirectoryFileDetailComponent } from "./components/directory-file-detail/directory-file-detail.component";
import { EditorModule } from "@tinymce/tinymce-angular";
import { ConfirmationModalModule } from "../shared";
import { GalleryModule } from "../utility/gallery/gallery.module";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { PdfjsviewerModule } from "../utility/pdfjs-viewer/pdfjsviewer.module";
import { ProjectsModule } from "../projects/projects.module";
import { DropdownsModule } from "../utility/dropdowns/dropdowns.module";
import { AddingContactClientComponent } from "./components/adding-contact-client/adding-contact-client.component";
import { SvgGlobalModule } from "../utility/svgs/svg-global/svg-global.module";
import { CommentSectionModule } from "../utility/comment-section/comment-section.module";
import { InputsModule } from "../utility/inputs/inputs.module";
import { DragDropModule } from "@angular/cdk/drag-drop";

@NgModule({
  declarations: [
    ClientsComponent,
    ClientDetailsComponent,
    NewClientComponent,
    InvoiceComponent,
    InvoiceOverviewComponent,
    AttachmentComponent,
    DirectoryDetailComponent,
    DirectoryFileDetailComponent,
    AddingContactClientComponent
  ],
  imports: [
    CommonModule,
    ClientsRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    MatSelectModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    ConfirmationModalModule,
    EditorModule,
    MatProgressSpinnerModule,
    GalleryModule,
    PdfjsviewerModule,
    DropdownsModule,
    ProjectsModule,
    SvgGlobalModule,
    CommentSectionModule,
    InputsModule,
    DragDropModule
  ],
  providers: [SorterService],
})
export class ClientsModule {}
