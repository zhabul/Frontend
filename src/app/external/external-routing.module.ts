import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EmailWeeklyReportComponent } from "./components/email-weekly-report/email-weekly-report.component";
import { WeeklyReportResolver } from "./resolvers/weekly-report.resolver.service";
import { ResponseMessageComponent } from "./components/response-message/response-message.component";
import { DeviationReplyMessageComponent } from "./components/deviation-reply-message/deviation-reply-message.component";
import { DeviationReplyResolverService } from "./resolvers/deviation-reply-resolver.service";
import { AtaReplyMessageComponent } from "./components/ata-reply-message/ata-reply-message.component";
import { AtaReplyResolverService } from "./resolvers/ata-reply-resolver.service";
import { AtaPrognosisShowTableComponent } from "./components/ata-prognosis-show-table/ata-prognosis-show-table.component";
import { ResetPasswordComponent } from "./components/reset-password/reset-password.component";
import { ClientAttachmentsComponent } from "./components/client-attachments/client-attachments.component";
import { SetupBasicDataComponent } from "./components/setup-basic-data/setup-basic-data.component";
import { PaymentPlanEmailComponent } from './components/payment-plan-email/payment-plan-email.component';
import { PaymentPlanReplyResolverService } from './resolvers/payment-plan-email-resolver.service';
import { WeeklyReportsForClientsComponent } from "./components/weekly-reports-for-clients/weekly-reports-for-clients.component";
import { DocumentColletionDownloadComponent } from "./components/document-colletion-download/document-colletion-download.component";
import { OfferClientResponseComponent } from './components/offer-client-response/offer-client-response.component';
import { OfferResponseResolverService } from "./resolvers/offer-response-resolver.service";
import { GeneralsResolver } from "../generals/resolvers/generals-resolver.service";
import { GetTypeDevaitionResolverService } from "../projects/resolvers/get-type-deviation-resolver.service";

const routes: Routes = [
  {
    path: 'offer/:id/:email/:group',
    component: OfferClientResponseComponent,
    resolve: {
      offer: OfferResponseResolverService
    }
  },
  {
    path: 'weekly_report/:reportId/:answerEmail/:cwId/:group/:token',
    component: EmailWeeklyReportComponent,
    resolve: { report: WeeklyReportResolver }
  },
  {
    path: 'replyPaymentPlan/:email/:paymentplanID/:parentPaymentplanId/:token/:CwId/:group',
    component: PaymentPlanEmailComponent,
    resolve: {email: PaymentPlanReplyResolverService}
  },
  {
    path: 'response/:status',
    component: ResponseMessageComponent,
  },
  {
    path: 'replyDeviation/:email/:ataId/:id/:token/:cwId/:group',
    component: DeviationReplyMessageComponent,
    resolve: {
      replyMessages: DeviationReplyResolverService,
      generals: GeneralsResolver,
      getTypeDeviation:GetTypeDevaitionResolverService,
    }
  },
  {
    path: 'replyAta/:email/:ataId/:id/:token/:cwId/:group',
    component: AtaReplyMessageComponent,
    resolve: { replyMessages: AtaReplyResolverService,  generals: GeneralsResolver }
  },
  {
    path: 'ata-prognosis/tableFullScreen/:id',
    component: AtaPrognosisShowTableComponent,

  },
  {
    path: "resetPassword/:user_id/:token",
    component: ResetPasswordComponent,
  },
  {
    path: "client_attachment/:email/:token",
    component: ClientAttachmentsComponent,
  },
  {
    path: "setup_basic_data/:email/:token",
    component: SetupBasicDataComponent,
  },
  {
    path: "weekly_reports/:email/:client_id/:token/:project_id/:from",
    component: WeeklyReportsForClientsComponent,
  },
  {
    path: "document/collection/:project_id/:document_type",
    component: DocumentColletionDownloadComponent
  },
  {
    path: ':reportId/:answerEmail/:cwId/:group',
    component: EmailWeeklyReportComponent,
    resolve: { report: WeeklyReportResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExternalRoutingModule {}