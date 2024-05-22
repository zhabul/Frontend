import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";

import { InvoiceComponent } from "./components/invoices/invoice.component";
// import { NewInvoiceComponent } from "./components/new-invoice/new-invoice.component";
// import { EditInvoiceComponent } from "./components/edit-invoice/edit-invoice.component";

//import { ProjectsResolver } from "../projects/resolvers/projects-resolver.service";
import { getAllProjectsAndSubProjectsReslover } from "../projects/resolvers/get-all-projects-and-subprojects-reslover.service";
import { GetMaterialPropertiesResolverService } from "../projects/resolvers/get-material-properties-resolver.service";
import { ClientsResolver } from "../clients/resolvers/clients-resolver.service";
import { UnitsResolverService } from "../materials/resolvers/units-resolver.service";
import { AtasResolverService } from "../projects/resolvers/atas-resolver.service";
import { InvoicesResolver } from "./resolvers/invoices-resolver.service";
import { InvoiceResolver } from "./resolvers/invoice-resolver.service";
import { GetSupplierInvoicesResolverService } from "../projects/resolvers/get-supplier-invoices-resolver.service";
import { AuthGuard } from "../guards/auth.guard";
import { ProjectsForInvoiceResolver } from "../projects/resolvers/projects-for-invoice-resolver.service";
import { AllUsersResolver } from "../users/resolvers/all-users-resolver.service";
import { AllClientsResolver } from "../clients/resolvers/all-clients-resolver.service";
import { CanDeactivateGuard } from "../shared/guards/can-deactivate.guard";
import { EditBillComponent } from "./components/edit-bill/edit-bill.component";
import { NewBillComponent } from "./components/new-bill/new-bill.component";
import { GetAllEnabledAccountsResolverService } from "src/app/projects/resolvers/get-all-enabled-accounts-resolver.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path: "",
        component: InvoiceComponent,
        resolve: {
          invoices: InvoicesResolver,
        },
        canActivate: [AuthGuard],
        data: {
          preload: false,
          roles: ["show_invoices_Global"],
        },
      },
      // {
      //   path: "new",
      //   component: NewInvoiceComponent,
      //   resolve: {
      //     projects: ProjectsForInvoiceResolver,
      //     clients: AllClientsResolver,
      //     materialProperties: GetMaterialPropertiesResolverService,
      //     units: UnitsResolverService,
      //     users: AllUsersResolver,
      //   },
      //   canActivate: [AuthGuard],
      // },
      {
        path: "new",
        component: NewBillComponent,
        resolve: {
          enabledAccounts: GetAllEnabledAccountsResolverService,
          projects: ProjectsForInvoiceResolver,
          clients: AllClientsResolver,
          materialProperties: GetMaterialPropertiesResolverService,
          units: UnitsResolverService,
          users: AllUsersResolver,
        },
        data: {
          preload: false,
          roles: ["show_invoices_Global", "create_invoices_Global"],
        },
        canActivate: [AuthGuard],
      },
      /* {
        path: "details/:id",
        component: EditInvoiceComponent,
        resolve: {
        projects: ProjectsResolver,
        clients: AllClientsResolver,
        materialProperties: GetMaterialPropertiesResolverService,
        units: UnitsResolverService,
        atas: AtasResolverService,
        users: AllUsersResolver,
        invoice: InvoiceResolver,
       },
       canActivate: [AuthGuard],
       canDeactivate: [CanDeactivateGuard]
      }, */
      {
        path: "edit/:id",
        component: EditBillComponent,
        resolve: {
          enabledAccounts: GetAllEnabledAccountsResolverService,
          projects:  ProjectsForInvoiceResolver,
         // projects: ProjectsResolver,
          clients: AllClientsResolver,
          materialProperties: GetMaterialPropertiesResolverService,
          units: UnitsResolverService,
          atas: AtasResolverService,
          users: AllUsersResolver,
          invoice: InvoiceResolver,
        },
        canActivate: [AuthGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
          preload: false,
          roles: ["show_invoices_Global"],
        },
      },
    ]),
  ],
  exports: [RouterModule, TranslateModule],
  providers: [
    AllUsersResolver,
  //  ProjectsResolver,
    getAllProjectsAndSubProjectsReslover,
    ClientsResolver,
    AllClientsResolver,
    GetMaterialPropertiesResolverService,
    UnitsResolverService,
    AtasResolverService,
    InvoicesResolver,
    InvoiceResolver,
    GetSupplierInvoicesResolverService,
    ProjectsForInvoiceResolver,
    GetAllEnabledAccountsResolverService,
  ],
})
export class InvoicesRoutingModule {}
