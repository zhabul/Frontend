import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";
import { ClientsComponent } from "./components/clients/clients.component";
import { ClientsResolver } from "./resolvers/clients-resolver.service";
import { ClientDetailsComponent } from "./components/client-details/client-details.component";
import { InvoiceComponent } from "./components/invoices/invoice.component";
import { InvoiceOverviewComponent } from "./components/invoice-overview/invoice-overview.component";
import { AttachmentComponent } from "./components/attachment/attachment.component";
import { ClientDetailsResolverService } from "./resolvers/client-details-resolver.service";
import { OneClientResolverService } from "./resolvers/one-client-resolver.service";
import { NewClientComponent } from "./components/new-client/new-client.component";
import { ClientInvoiceResolverService } from "./resolvers/client-invoice-resolver.service";
import { ClientCategoriesResolverService } from "./resolvers/client-categories-resolver.service";
import { AttachemntResolver } from "./resolvers/attachments-resolver.service";
import { DirectoryFileDetailComponent } from "./components/directory-file-detail/directory-file-detail.component";
import { GetAttachmentResolverService } from "./resolvers/get-directory-resolver.service";
import { InvoicesResolver } from "src/app/invoice/resolvers/invoices-resolver.service";
import { InvoiceResolver } from "./resolvers/invoice-resolver.service";
import { AuthGuard } from "../guards/auth.guard";
import { CanDeactivateGuard } from "../shared/guards/can-deactivate.guard";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path: "",
        component: ClientsComponent,
        resolve: { clients: ClientsResolver },
        pathMatch: "full",
        canActivate: [AuthGuard],
      },
      {
        path: "details/:id",
        component: ClientDetailsComponent,
        resolve: {
          client: ClientDetailsResolverService,
          oneClient: OneClientResolverService,
          theClientInvoice: ClientInvoiceResolverService,
          clientCategories: ClientCategoriesResolverService,
          invoices: InvoicesResolver,
          // documents: AttachemntResolver,
        },
        canActivate: [AuthGuard],
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "invoices/:id",
        component: InvoiceComponent,
        resolve: {
          invoices: InvoicesResolver,
          client: ClientInvoiceResolverService,
          theClient: OneClientResolverService,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "invoice/:invoice/:id",
        component: InvoiceOverviewComponent,
        resolve: {
          invoice: InvoiceResolver,
          client: ClientInvoiceResolverService,
          theClientInvoice: ClientInvoiceResolverService,
          theClient: OneClientResolverService,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "attachments/:id",
        component: AttachmentComponent,
        resolve: {
          attachments: AttachemntResolver,
          client: ClientInvoiceResolverService,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "directory/file/:directory_id/:id",
        component: DirectoryFileDetailComponent,
        resolve: {
          directory: GetAttachmentResolverService,
        },
        data: {
          preload: false,
          roles: ["show_project_Global", "show_project_Attachment"],
        },
        canActivate: [AuthGuard],
      },
      {
        path: "new",
        component: NewClientComponent,
        resolve: { clientCategories: ClientCategoriesResolverService },
        canActivate: [AuthGuard],
      },
    ]),
  ],
  exports: [RouterModule, TranslateModule],
  providers: [
    ClientsResolver,
    ClientDetailsResolverService,
    OneClientResolverService,
    ClientInvoiceResolverService,
    ClientCategoriesResolverService,
    InvoicesResolver,
    InvoiceResolver,
    AttachemntResolver,
    GetAttachmentResolverService,
  ],
})
export class ClientsRoutingModule {}
