import { NgModule } from "@angular/core";
import { CommonModule,DatePipe } from "@angular/common";
import { OfferComponent } from "./components/offer.component";
import { OfferRoutingModule } from "./offer-routing.module";
import { NewOfferComponent } from "./components/new-offer/new-offer.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PipesModule } from "../core/pipes/pipes.module";
import { RowsModule } from "../utility/rows/rows.module";
import { AttachmentComponent } from "./components/attachment/attachment.component";
import { OfferListComponent } from './components/offer-list/offer-list.component';
import { InputAutocompleteModule } from "../utility/input-autocomplete/input-autocomplete.module";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { CommentSectionModule } from 'src/app/utility/comment-section/comment-section.module';
import { ImageModalModule } from "../projects/components/image-modal/image-modal.module";
import { CustomSimpleSelectModule } from "../shared/components/custom-simple-select/custom-simple-select.model";
import { NumberFormatModule } from "../utility/number-format/number-format.module";
import { RowsTableComponent } from './components/rows-table/rows-table.component';
import { ImageModalWithFilenameModule } from "../projects/components/image-modal-with-filename/image-modal-with-filename.module";
import { AddCustomerContactComponent } from './components/modals/add-customer-contact/add-customer-contact.component';
import { CheckinCheckoutModule } from "../utility/checkin-checkout/checkin-checkout.module";
import { AddTemplateComponent } from './components/modals/add-template/add-template.component';
import { AddNewCustomerComponent } from './components/modals/add-new-customer/add-new-customer.component';
import { EmailLogModule } from './../projects/components/email-log/email-log.module';
import { OfferPdfComponent } from './components/offer-pdf/offer-pdf.component';
import { FileOfferPdfComponent } from './components/file-offer-pdf/file-offer-pdf.component';
import { BinIconSvgComponent } from './components/svgs/bin-icon-svg/bin-icon-svg.component';
import { CloseIconSvgModule } from '../utility/svgs/close-icon-svg/close-icon-svg.module';
import { OfferEditorComponent } from './components/offer-editor/offer-editor.component';
import { OfferStore } from "./components/offer-editor/service/offer.service";
import { SpsLoaderModule } from "../utility/sps-loader/sps-loader.module";
import { FolderIconSvgModule } from "../utility/svgs/folder-icon-svg/folder-icon-svg.module";
import { FilePreviewModule } from "../projects/components/image-modal/file-preview/file-preview.module";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { GalleryModule } from "../utility/gallery/gallery.module";
import { DynamicChildLoaderDirective } from './components/new-offer/dynamic-child-loader.directive';
import { SendIconSvgModule } from "../utility/svgs/send-icon-svg/send-icon-svg.module";
import { ComponentEmailStatusModule } from "../utility/component-email-status/component-email-status.module";
import { StatusDropdownModule } from "../utility/status-dropdown/status-dropdown.module";
import { OfferRowComponent } from './components/offer-list/offer-row/offer-row.component';
import { NewOfferModalComponent } from './components/new-offer-modal/new-offer-modal.component';
import { ReplyToQuestionModule } from "../utility/reply-to-question/reply-to-question.module";
import { OfferListSumComponent } from "./components/offer-list/offer-list-sum/offer-list-sum.component";
import { OfferFiltersComponent } from './components/offer-filters/offer-filters.component';
import { DropdownsModule } from "../utility/dropdowns/dropdowns.module";
import { TabModule } from "../shared/directives/tab/tab.module";
import { PdfjsviewerModule } from "../utility/pdfjs-viewer/pdfjsviewer.module";
// import { ClientProjectDetailsComponent } from "../projects/components/client-project-details/client-project-details.component";
import { ProjectsModule } from "../projects/projects.module";
import { MatDialogModule } from "@angular/material/dialog";
// import { TabDirective } from "../shared/directives/tab/tab.directive";

@NgModule({
  declarations: [
    OfferComponent,
    NewOfferComponent,
    AttachmentComponent,
    OfferListComponent,
    RowsTableComponent,
    AddCustomerContactComponent,
    AddTemplateComponent,
    AddNewCustomerComponent,
    OfferPdfComponent,
    FileOfferPdfComponent,
    BinIconSvgComponent,
    OfferEditorComponent,
    DynamicChildLoaderDirective,
    OfferRowComponent,
    NewOfferModalComponent,
    OfferListSumComponent,
    OfferFiltersComponent,
    // TabDirective,
  ],
  imports: [
    CommonModule,
    OfferRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    InputAutocompleteModule,
    ScrollingModule,
    CommentSectionModule,
    ImageModalModule,
    CustomSimpleSelectModule,
    NumberFormatModule,
    ImageModalWithFilenameModule,
    CheckinCheckoutModule,
    EmailLogModule,
    RowsModule,
    CloseIconSvgModule,
    SpsLoaderModule,
    FolderIconSvgModule,
    FilePreviewModule,
    MatProgressSpinnerModule,
    GalleryModule,
    SendIconSvgModule,
    ComponentEmailStatusModule,
    StatusDropdownModule,
    ReplyToQuestionModule,
    DropdownsModule,
    TabModule,
    PdfjsviewerModule,
    ProjectsModule,
    MatDialogModule,
    // ClientProjectDetailsComponent,
  ],
  providers: [
    DatePipe,
    OfferStore
  ]
})
export class OfferModule {}
