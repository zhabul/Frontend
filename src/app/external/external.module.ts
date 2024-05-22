import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { ExternalRoutingModule } from "./external-routing.module";
import { EmailWeeklyReportComponent } from "./components/email-weekly-report/email-weekly-report.component";
import { WeeklyReportResolver } from "./resolvers/weekly-report.resolver.service";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { createTranslateLoader } from "../createTranslateLoader";
import { HttpClient } from "@angular/common/http";
import { ToastrModule } from "ngx-toastr";
import { ResponseMessageComponent } from "./components/response-message/response-message.component";
import { DeviationReplyMessageComponent } from "./components/deviation-reply-message/deviation-reply-message.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { PipesModule } from "src/app/core/pipes/pipes.module";
import { AtaReplyMessageComponent } from "./components/ata-reply-message/ata-reply-message.component";
import { DNDModule } from "../projects/components/image-modal/dnd.module";
import { ConfirmationModalModule } from "../shared";
import { GalleryModule } from "../utility/gallery/gallery.module";
import { FilePreviewModule } from "src/app/projects/components/image-modal/file-preview/file-preview.module";
import { AtaPrognosisShowTableComponent } from "./components/ata-prognosis-show-table/ata-prognosis-show-table.component";
import { NumberFormatPrognosisModule } from "../utility/number-format-prognosis/number-format-prognosis.module";
import { ResetPasswordComponent } from "./components/reset-password/reset-password.component";
import { SpecialCharactherMustBeValidators } from "src/app/core/validator/special-characther-must-be.validator";
import { ClientAttachmentsComponent } from "./components/client-attachments/client-attachments.component";
import { MatIconModule } from "@angular/material/icon";
import { SetupBasicDataComponent } from "./components/setup-basic-data/setup-basic-data.component";
import { PaymentPlanEmailComponent } from "./components/payment-plan-email/payment-plan-email.component";
import { ImageModalSmallModule } from "../projects/components/image-modal-small/image-modal-small.module";
import { ClientAttachmentsDetailsComponent } from './components/client-attachments-details/client-attachments-details.component';
import { ClientResponsesModule } from 'src/app/projects//components/deviation/edit-deviation/client-responses/client-responses.module';
import { WeeklyReportsForClientsComponent } from './components/weekly-reports-for-clients/weekly-reports-for-clients.component';
import { LogoSvgComponent } from './components/weekly-reports-for-clients/logo-svg/logo-svg.component';
import { DocumentColletionDownloadComponent } from './components/document-colletion-download/document-colletion-download.component';
import { WeeklyReportsForSelectComponent } from './components/weekly-reports-for-select/weekly-reports-for-select.component';
import { CloseSvgComponent } from './components/weekly-reports-for-select/close-svg/close-svg.component';
import { CheckoutSvgForFirstDropdownComponent } from 'src/app/projects/components/weekly-report-modify/weekly-modify/weekly-info/checkout-svg-for-first-dropdown/checkout-svg-for-first-dropdown.component';
import { CheckinSvgGreenComponent } from 'src/app/projects/components/weekly-report-modify/checkin-svg-green/checkin-svg-green.component';
import { CheckingSvgRedComponent } from 'src/app/projects/components/weekly-report-modify/checking-svg-red/checking-svg-red.component';
import { ChehkinSvgSupplierComponent } from 'src/app/projects/components/weekly-report-modify/weekly-modify/weekly-info/chehkin-svg-supplier/chehkin-svg-supplier.component';
import { CounterDirective } from 'src/app/core/directive/counter.directive';
import { PdfjsviewerModule } from "../utility/pdfjs-viewer/pdfjsviewer.module";
import { OfferClientResponseComponent } from './components/offer-client-response/offer-client-response.component';
import { OfferResponseResolverService } from "./resolvers/offer-response-resolver.service";
import { MainPdfPreviewModule } from "../utility/main-pdf-preview/main-pdf-preview.module";
import { ClientResponseFormModule } from "../utility/client-response-form/client-response-form.module";
import { GeneralsResolver } from "../generals/resolvers/generals-resolver.service";
import { GetTypeDevaitionResolverService } from "../projects/resolvers/get-type-deviation-resolver.service";
import { ProjectsResolver } from "../projects/resolvers/projects-resolver.service";
import { AtaReplyResolverService } from "./resolvers/ata-reply-resolver.service";
import { DragDropModule } from "@angular/cdk/drag-drop";

@NgModule({
  declarations: [
    EmailWeeklyReportComponent,
    ResponseMessageComponent,
    DeviationReplyMessageComponent,
    AtaReplyMessageComponent,
    AtaPrognosisShowTableComponent,
    ResetPasswordComponent,
    ClientAttachmentsComponent,
    SetupBasicDataComponent,
    PaymentPlanEmailComponent,
    ClientAttachmentsDetailsComponent,
    WeeklyReportsForClientsComponent,
    LogoSvgComponent,
    DocumentColletionDownloadComponent,
    WeeklyReportsForSelectComponent,
    OfferClientResponseComponent,
    CloseSvgComponent,
    CheckoutSvgForFirstDropdownComponent,
    CheckinSvgGreenComponent,
    CheckingSvgRedComponent,
    ChehkinSvgSupplierComponent,
    CounterDirective
  ],
  imports: [
    CommonModule,
    ExternalRoutingModule,
    FormsModule,
    ToastrModule.forRoot(),
    MatProgressSpinnerModule,
    ConfirmationModalModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    MatTooltipModule,
    ReactiveFormsModule,
    PipesModule,
    DNDModule,
    GalleryModule,
    FilePreviewModule,
    MatIconModule,
    NumberFormatPrognosisModule,
    ImageModalSmallModule,
    ClientResponsesModule,
    MainPdfPreviewModule,
    ClientResponseFormModule,
    PdfjsviewerModule,
    DragDropModule
  ],
  providers: [
    WeeklyReportResolver,
    SpecialCharactherMustBeValidators,
    OfferResponseResolverService,
    GeneralsResolver,
    GetTypeDevaitionResolverService,
    ProjectsResolver,
    AtaReplyResolverService
],
})
export class ExternalModule {}