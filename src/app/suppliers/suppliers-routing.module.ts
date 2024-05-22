import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";
import { SuppliersComponent } from "./components/suppliers/suppliers.component";
import { SuppliersResolver } from "./resolvers/suppliers-resolver.service";
import { NewSupplierComponent } from "./components/new-supplier/new-supplier.component";
import { SupplierDetailsComponent } from "./components/supplier-details/supplier-details.component";
import { SupplierDetailsResolverService } from "./resolvers/supplier-details-resolver.service";
import { OneSupplierResolverService } from "./resolvers/one-supplier-resolver.service";
import { SupplierTitlesResolverService } from "./resolvers/supplier-titles-resolver.service";
import { SupplierCategoriesResolverService } from "./resolvers/supplier-categories-resolver.service";
import { AllSupplierInvoicesComponent } from "./components/all-supplier-invoices/all-supplier-invoices.component";
import { GetAllSupplierInvoicesService } from "./resolvers/all-supplier-invoices.service";
import { getAccountsResolverService } from "src/app/projects/resolvers/get-accounts-resolver.service";
import { RoleGuard } from "../guards/role.guard";
import { CanDeactivateGuard } from "../shared/guards/can-deactivate.guard";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path: "",
        component: SuppliersComponent,
        resolve: { suppliers: SuppliersResolver },
        pathMatch: "full",
        data: {
          preload: false,
          roles: ["show_register_suppliers"],
        },
        canActivate: [ RoleGuard ]
      },
      {
        path: "new",
        component: NewSupplierComponent,
        resolve: {
          supplierCategories: SupplierCategoriesResolverService,
        },
        data: {
          preload: false,
          roles: ["show_register_suppliers"],
        },
        canActivate: [ RoleGuard ]
      },
      {
        path: "details/:id",
        component: SupplierDetailsComponent,
        resolve: {
          supplierWorkers: SupplierDetailsResolverService,
          oneSupplier: OneSupplierResolverService,
          supplierTitles: SupplierTitlesResolverService,
          supplierCategories: SupplierCategoriesResolverService,
        },
        data: {
          preload: false,
          roles: ["show_register_suppliers"],
        },
        canActivate: [ RoleGuard ],
        canDeactivate: [CanDeactivateGuard],
      },
      {
        path: "supplier-invoices",
        component: AllSupplierInvoicesComponent,
        resolve: {
          supplierInvoices: GetAllSupplierInvoicesService,
          accounts: getAccountsResolverService,
        },
        data: {
          preload: false,
          roles: ["show_register_suppliers"],
        },
        canActivate: [ RoleGuard ]
      },
    ]),
  ],
  exports: [],
  providers: [
    SuppliersResolver,
    SupplierDetailsResolverService,
    OneSupplierResolverService,
    SupplierTitlesResolverService,
    SupplierCategoriesResolverService,
    GetAllSupplierInvoicesService,
    getAccountsResolverService,
  ],
})
export class SuppliersRoutingModule {}
