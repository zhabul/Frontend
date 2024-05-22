import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";
import { ProjectsComponent } from "./components/projects/projects.component";
import { ProjectsResolver } from "./resolvers/projects-resolver.service";
import { NewProjectComponent } from "./components/new-project/new-project.component";
import { ProjectResolverService } from "./resolvers/project-resolver.service";
import { getParentProjectResolverService } from "./resolvers/get-parent-project-resolver.service";
import { MajorProjectResolverService } from "./resolvers/major-project-resolver.service";
import { ClientsService } from "src/app/core/services/clients.service";
import { ClientWorkersResolverService } from "./resolvers/client-workers-resolver.service";
import { ProjectUserResolverService } from "./resolvers/project-user-resolver";
import { ProjectComponent } from "./components/project/project.component";
import { DirectoryDetailComponent } from "./components/directory-detail/directory-detail.component";
import { DirectoryDetailResolverService } from "./resolvers/directory-detail-resolver.service";
import { NewAtaComponent } from "./components/ata/new-ata/new-ata.component";
import { AtasResolverService } from "./resolvers/atas-resolver.service";
import { EditAtaComponent } from "./components/ata/edit-ata/edit-ata.component";
import { AtaResolverService } from "./resolvers/ata-resolver.service";
import { AtaDeviationResolverService } from "./resolvers/ata-deviation-resolver.service";
import { NewDeviationComponent } from "./components/deviation/new-deviation/new-deviation.component";
import { EditDeviationComponent } from "./components/deviation/edit-deviation/edit-deviation.component";
import { NewSubProjectComponent } from "./components/new-sub-project/new-sub-project.component";
import { ProjectInformationRouteComponent } from "./components/project/components/project-information-route/project-information-route.component";
import { ProjectInformationComponent } from "./components/project/components/project-information-route/components/project-information/project-information.component";
import { AgreementComponent } from "./components/project/components/project-information-route/components/agreement/agreement.component";
import { SecurityComponent } from "./components/project/components/project-information-route/components/security/security.component";
import { InformationComponent } from "./components/project/components/project-information-route/components/information/information.component";
import { ProjectOrganisationRouteComponent } from "./components/project/components/project-organisation-route/project-organisation-route.component";
import { ProjectOrganisationComponent } from "./components/project/components/project-organisation-route/components/project-organisation/project-organisation.component";
import { OrderByIdResolverService } from "./resolvers/order-byId-resolver.service";
import { CreateRegistersResolverService } from "./resolvers/create-registers-resolver.service";
// import { OfferResolverService } from "./resolvers/offer-resolver.service";
import { SuppliersResolverService } from "../materials/resolvers/suppliers-resolver.service";
import { ClientsResolver } from "../clients/resolvers/clients-resolver.service";
import { ProjectRoleResolverService } from "./resolvers/project-role-resolver.service";
import { SuppliersResolver } from "../suppliers/resolvers/suppliers-resolver.service";
import { SuppCategoryResolverService } from "./resolvers/supp-category-resolver.service";
import { ProjOrganisationPreviewComponent } from "./components/project/components/project-organisation-route/components/proj-organisation-preview/proj-organisation-preview.component";
import { GenerateProjectNumberResolverService } from "./resolvers/gen-project-num-resolver.service";
import { GetAttachmentsResolverService } from "./resolvers/get-directories-resolver.service";
import { DirectoryFileDetailComponent } from "./components/deviation/directory-file-detail/directory-file-detail.component";
import { GetAttachmentResolverService } from "./resolvers/get-directory-resolver.service";
import { ClientCategoriesResolverService } from "../clients/resolvers/client-categories-resolver.service";
import { RoleGuard } from "../guards/role.guard";
import { ProjectMomentsComponent } from "./components/project/components/project-moments/project-moments.component";
import { MomentsResolverService } from "./resolvers/moments-resolver.service";
import { GetTypeDevaitionResolverService } from "./resolvers/get-type-deviation-resolver.service";
import { InvoiceComponent } from "./components/project/components/project-overview/invoices/invoice.component";
import { InvoiceOverviewComponent } from "./components/project/components/project-overview/invoices/invoice-overview/invoice-overview.component";
import { MaterialsComponent } from "./components/project/components/project-overview/materials/materials.component";

import { SupplierInvoicesComponent } from "./components/project/components/project-overview/supplier-invoices/supplier-invoices.component";
import { getSupplierInoviceFromDatabaseResolverService } from "./resolvers/get-supplier-inovice-from-database-resolver.service";

import { InvoicesResolver } from "./resolvers/invoices-resolver.service";
import { InvoiceResolver } from "./resolvers/invoice-resolver.service";
import { GeneralsResolver } from "src/app/generals/resolvers/generals-resolver.service";
import { GeneralsSortedByKeyResolver } from "src/app/generals/resolvers/generals-sorted-by-key-resolver.service";

import { GetSupplierInvoiceRowsResolverService } from "./resolvers/get-supplier-invoice-rows-resolver.service";
import { GetMaterialPropertiesResolverService } from "./resolvers/get-material-properties-resolver.service";
import { UnitsResolverService } from "../materials/resolvers/units-resolver.service";
import { UnitsSortedByArticleTypeResolverService } from "../materials/resolvers/units-sorted-by-article-type-resolver.service";
import { GetTypeAtasResolverService } from "./resolvers/get-type-ata-resolver.service";
import { GetAllEnabledAccountsResolverService } from "./resolvers/get-all-enabled-accounts-resolver.service";
import { GetAtaAndSubatasResolverService } from "./resolvers/get-ata-and-subatas-resolver.service";
import { getEmailLogsForAtaResolverService } from "./resolvers/get-email-logs-forA-ata-resolver.service";
import { GetProjectFromAtaResolverService } from "./resolvers/get-project-from-ata-resolver.service";
import { AtaMessagesResolverService } from "./resolvers/ata-messages-resolver.service";
import { GetProjectActiveClientWorkersResolverService } from "./resolvers/get-project-active-client-workers-resolver.service";
import { ProjectPurchasesRootComponent } from "./components/project/components/project-purchases-root/project-purchases-root.component";
import { SelectSupplierComponent } from "./components/project/components/project-purchases-root/components/select-supplier/select-supplier.component";
import { SupplierCategoriesResolverService } from "../suppliers/resolvers/supplier-categories-resolver.service";
import { ProjectMaterialSuppliersResolverService } from "./components/project/components/project-purchases-root/resolvers/project-material-suppliers.resolver.service";
import { GetWeeklyReportsByAtaIdResolverService } from "./resolvers/get-weekly-reports-by-ata-id-resolver.service";
import { WeeklyReportPdfPreviewResolver } from "./resolvers/weekly-report-pdf-preview-resolver.service";
import { MaterialsResolverService } from "./resolvers/materials-resolver.service";
import { WorksResolverService } from "./resolvers/works-resolver.service";
import { WorksComponent } from "./components/project/components/project-overview/works/works.component";
import { ProjectSummaryComponent } from "./components/project/components/project-overview/project-summary/project-summary.component";
import { WeeklyReportsComponent } from "./components/project/components/project-overview/weekly-reports/weekly-report/weekly-reports.component";
import { getAssingedProjectsResolver } from "src/app/projects/resolvers/get-assinged-projects-resolver.service";
import { GetProjectAttestClientWorkersResolverService } from "./resolvers/get-project-attest-client-workers-resolver.service";
import { GetProjectActiveCompanyWorkersForSubProjectResolverService } from "./resolvers/get-project-active-company-workers-for-sub-project-resolver.service";
import { getAllProjectCoworkersResolverService } from "./resolvers/get-all-project-coworkers-resolver.service";
import { AuthGuard } from "../guards/auth.guard";
import { getUserPermissionAtaResolverService } from "./resolvers/get-user-permission-ata-resolver.service";
import { EditSupplierInvoiceComponent } from "./components/project/components/project-overview/supplier-invoices/edit-supplier-invoice/edit-supplier-invoice.component";
import { getSupplierInvoiceResolverService } from "./resolvers/get-supplier-invoice-resolver.service";
import { supplierInvoicesPdfResolverService } from "./resolvers/supplier-invoices-pdf-resolver.service";
import { GetProjectExternalAtasResolverService } from "./resolvers/get-project-external-atas-resolver.service";
import { GetProjectInternalAtasResolverService } from "./resolvers/get-project-internal-atas-resolver.service";
import { GetInternalAtaAndSubatasResolverService } from "./resolvers/get-internal-ata-and-subatas-resolver.service";
import { GetNotSendWeeklyReportsByAtaIdResolverService } from "./resolvers/get-not-send-weekly-reports-by-ata-id-resolver.service";
import { GetProjectExternalDeviationsResolverService } from "./resolvers/get-project-external-deviations-resolver.service";
import { GetProjectInternalDeviationsResolverService } from "./resolvers/get-project-internal-deviations-resolver.service";
import { GetInternalDeviationResolverService } from "./resolvers/get-internal-deviation-resolver.service";
import { AllSuppliersResolver } from "../suppliers/resolvers/all-suppliers-resolver.service";
import { AllClientsResolver } from "../clients/resolvers/all-clients-resolver.service";
import { getAccountsResolverService } from "./resolvers/get-accounts-resolver.service";
import { getAllProjectsAndSubProjectsReslover } from "./resolvers/get-all-projects-and-subprojects-reslover.service";
import { getProjectUserDetailsResolverService } from "./resolvers/get-project-user-details-resolver.service";
import { GetProjectInformationActiveCompanyWorkersResolverService } from "./resolvers/get-project-information-active-company-workers-resolver.service";
import { getAllAvailableProjectWorkersReslover } from "./resolvers/get-all-available-project-workers-reslover.service";
import { getAllProjectWeekyReportsResolverService } from "./resolvers/get-all-project-weeky-reports-resolver.service";
import { getProjectsAndSubProjectsAndAtasResolverService } from "./resolvers/get-projects-and-sub-projects-and-atas-resolver.service";
import { getProjectsForAnalysisResolverService } from "./resolvers/get-projects-for-analysis-resolver.service";
import { getAvaibleAtasOrDuReslover } from "./resolvers/get-avaible-atas-or-du-resolver.service";
import { PaymentPlanComponent } from "./components/project/components/payment-plan/payment-plan.component";
import { DirtyCheckGuard } from "./components/project/components/payment-plan/dirty-check.guard";
import { PaymentRes } from "./resolvers/payment-res.resolver";
import { ProjectName } from "./resolvers/project-name.resolver";
import { PaymentPlanPdfComponent } from "./components/project/components/payment-plan/payment-plan-pdf/payment-plan-pdf.component";
import { ModifyAtaComponent } from "./components/ata/modify-ata/modify-ata.component";
import { GetNotSendWeeklyReportsByAtaIdOnlyNamesResolverService } from "./resolvers/get-not-send-weekly-reports-by-ata-id-only-names-resolver.service";
import { CanDeactivateGuard } from "../shared/guards/can-deactivate.guard";
import { NewSupplierInvoiceComponent } from './components/project/components/project-overview/supplier-invoices/new-supplier-invoice/new-supplier-invoice.component';
import { getWeeklyReportNamesResolverService } from "./resolvers/get-weekly-report-names-resolver.service";
import { WeeklyReportModifyComponent } from "./components/weekly-report-modify/weekly-report-modify.component";
import { EmaildebiteringComponent } from "./components/weekly-report-modify/emaildebitering/emaildebitering.component";
import { NewBrowserTabPrognosisComponent } from "./components/ata/ata-prognosis/new-browser-tab-prognosis/new-browser-tab-prognosis.component";

import { OfferResolverService } from "./resolvers/offer-resolver.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path: "view/:id/payment-plan",
        component: PaymentPlanComponent,
        canDeactivate: [DirtyCheckGuard],
        resolve: {
          userData: PaymentRes,
          project: ProjectName,
          generals: GeneralsResolver
        },
      },
      {
        path: "view/:id/payment-plan/payment-plan-pdf",
        component: PaymentPlanPdfComponent,
        resolve: {
          userData: PaymentRes
        },
      },
      {
        path: "",
        component: ProjectsComponent,
        resolve: {
          projects: ProjectsResolver,
          project_ids: getAssingedProjectsResolver,
        },
        data: { preload: false, roles: ["show_project_Global"] },
        canActivate: [AuthGuard],
      },
      {
        path: "new",
        component: NewProjectComponent,
        resolve: {
          getNextNumber: GenerateProjectNumberResolverService,
          clientCategories: ClientCategoriesResolverService,
          generals: GeneralsSortedByKeyResolver,
          offers: OfferResolverService
        },
        data: {
          preload: false,
          roles: ["show_project_Global", "create_project_Global"],
        },
        canActivate: [AuthGuard, RoleGuard],
      },
      {
        path: "newSubProject/:id",
        component: NewSubProjectComponent,
        resolve: {
          parent_project: ProjectResolverService,
          projects: MajorProjectResolverService,
          client_workers: ClientWorkersResolverService,
          users: ProjectUserResolverService,
          offers: OfferResolverService,
          clientCategories: ClientCategoriesResolverService,
          active_client_workers: GetProjectActiveClientWorkersResolverService,
          attest_client_workers: GetProjectAttestClientWorkersResolverService,
          active_company_workers: GetProjectActiveCompanyWorkersForSubProjectResolverService,
          company_workers: getAllProjectCoworkersResolverService,
          generals: GeneralsSortedByKeyResolver,

        },
        data: {
          preload: false,
          roles: ["show_project_Global", "create_project_Global"],
          projectRoles: ["Active"],
        },
        canActivate: [RoleGuard, AuthGuard],
      },
      {
        path: "view/du/:id",
        component: WeeklyReportModifyComponent,
        resolve: {
          project: ProjectResolverService,
          weekly_report_names: getWeeklyReportNamesResolverService,
          units: UnitsSortedByArticleTypeResolverService,
          enabledAccounts: GetAllEnabledAccountsResolverService,
          materialProperties: GetMaterialPropertiesResolverService,
          type_atas: GetTypeAtasResolverService,
          generals: GeneralsSortedByKeyResolver,
        },
        canDeactivate: [CanDeactivateGuard]
      },
      { path: 'emaildu', component: EmaildebiteringComponent },
      {
        path: "view/:id",
        component: ProjectComponent,
        resolve: {
          type_atas: GetTypeAtasResolverService,
          project: ProjectResolverService,
          client_workers: ClientWorkersResolverService,
          users: ProjectUserResolverService,
          externalAtas: GetProjectExternalAtasResolverService,
          internalAtas: GetProjectInternalAtasResolverService,
          externalDeviations: GetProjectExternalDeviationsResolverService,
          internalDeviations: GetProjectInternalDeviationsResolverService,
          attest_client_workers: GetProjectAttestClientWorkersResolverService,
          orders: OrderByIdResolverService,
          attachments: GetAttachmentsResolverService,
          type_deviations: GetTypeDevaitionResolverService,
          generals: GeneralsSortedByKeyResolver,
          projectUserDetails: getProjectUserDetailsResolverService,
          avaible_atas_or_du: getAvaibleAtasOrDuReslover,
          projectUsers: ProjectUserResolverService,
        },
        data: {
          preload: false,
          roles: ["show_project_Global"],
          projectRoles: ["Active"],
        },
        canActivate: [RoleGuard, AuthGuard],
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "viewFullPrognosis/:id",
        component: NewBrowserTabPrognosisComponent,
        resolve: {
          project: ProjectResolverService,
          attest_client_workers: GetProjectAttestClientWorkersResolverService,
          client_workers: ClientWorkersResolverService,
        },
        data: {
          preload: false,
          roles: ["show_project_Global"],
          projectRoles: ["Active"],
        },
        canActivate: [RoleGuard, AuthGuard],
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "directory/:directory_id/:id",
        component: DirectoryDetailComponent,
        resolve: {
          directories: GetAttachmentsResolverService,
          directory: GetAttachmentResolverService,
        },
        data: {
          preload: false,
          roles: ["show_project_Global", "show_project_Attachment"],
          projectRoles: ["Active"],
        },
        // canActivate: [RoleGuard, AuthGuard],
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
          projectRoles: ["Active"],
        },
        canActivate: [RoleGuard, AuthGuard],
      },
      {
        path: "view/ata/new/:id",
        component: NewAtaComponent,
        resolve: {
          project: ProjectResolverService,
          parent_project: getParentProjectResolverService,
          type_atas: GetTypeAtasResolverService,
          units: UnitsSortedByArticleTypeResolverService,
          enabledAccounts: GetAllEnabledAccountsResolverService,
          materialProperties: GetMaterialPropertiesResolverService,
          client_workers: GetProjectActiveClientWorkersResolverService,
          generals: GeneralsSortedByKeyResolver,
          projectUserDetails: getProjectUserDetailsResolverService,
        },
        data: {
          preload: false,
          roles: ["show_project_Global", "show_project_Ata"],
          projectRoles: ["Ata"],
        },
        canActivate: [RoleGuard, AuthGuard],
      },
      {
        path: "view/ata/edit/:id",
        component: EditAtaComponent,
        resolve: {
          project: GetProjectFromAtaResolverService,
          atas: GetAtaAndSubatasResolverService,
          internalAtas: GetInternalAtaAndSubatasResolverService,
          type_atas: GetTypeAtasResolverService,
          units: UnitsSortedByArticleTypeResolverService,
          enabledAccounts: GetAllEnabledAccountsResolverService,
          materialProperties: GetMaterialPropertiesResolverService,
          weekly_reports: GetNotSendWeeklyReportsByAtaIdResolverService,
          all_weekly_reports: GetWeeklyReportsByAtaIdResolverService,
          generals: GeneralsSortedByKeyResolver,
          email_logs: getEmailLogsForAtaResolverService,
        },
        data: {
          preload: false,
          roles: ["show_project_Global", "show_project_Ata"],
          projectRoles: ["Ata"],
        },
        canActivate: [RoleGuard, AuthGuard],
      },
      {
        path: "view/deviation/new/:id",
        component: NewDeviationComponent,
        resolve: {
          type_deviations: GetTypeDevaitionResolverService,
          project: ProjectResolverService,
          generals: GeneralsResolver,
          projectUserDetails: getProjectUserDetailsResolverService,
        },
        data: {
          preload: false,
          roles: ["show_project_Global", "show_project_Deviation"],
          projectRoles: ["Deviation"],
        },
        canActivate: [RoleGuard, AuthGuard],
      },
      {
        path: "view/deviation/edit/:id/:ata_id",
        component: EditDeviationComponent,
        resolve: {
          project: ProjectResolverService,
          ata: AtaResolverService,
          internalAtas: GetInternalDeviationResolverService,
          ata_messages: AtaMessagesResolverService,
          type_deviations: GetTypeDevaitionResolverService,
          access: getUserPermissionAtaResolverService,
          client_workers: ClientWorkersResolverService,
          //client_workers: GetProjectActiveClientWorkersResolverService,
          generals: GeneralsResolver,
          projectUserDetails: getProjectUserDetailsResolverService,
          active_company_workers: GetProjectInformationActiveCompanyWorkersResolverService,
        },
        data: {
          preload: false,
          roles: ["show_project_Global", "show_project_Deviation"],
          projectRoles: ["Deviation"],
        },
        canActivate: [RoleGuard, AuthGuard],
        canDeactivate: [CanDeactivateGuard],
      },
      {
        path: "view/project/:id",
        component: ProjectInformationRouteComponent,
        resolve: {
          project: ProjectResolverService,
          projects: MajorProjectResolverService,
          // offers: OfferResolverService,
          clientCategories: ClientCategoriesResolverService,
        },
        data: { preload: false, roles: ["show_project_Global"] },
        children: [
          { path: "", redirectTo: "project-information", pathMatch: "full" },
          {
            path: "project-information",
            component: ProjectInformationComponent,
            resolve: {
              project: ProjectResolverService,
              projects: MajorProjectResolverService,
              client_workers: ClientWorkersResolverService,
              users: ProjectUserResolverService,
              offers: OfferResolverService,
              active_client_workers:
                GetProjectActiveClientWorkersResolverService,
              attest_client_workers:
                GetProjectAttestClientWorkersResolverService,
              active_company_workers:
                GetProjectInformationActiveCompanyWorkersResolverService,
              company_workers: getAllAvailableProjectWorkersReslover,
              clientCategories: ClientCategoriesResolverService,
              generals: GeneralsSortedByKeyResolver,
            },
            data: {
              preload: false,
              roles: ["show_project_Global", "show_project_Settings"],
              projectRoles: ["Active"],
            },
            canActivate: [RoleGuard, AuthGuard],
            canDeactivate: [CanDeactivateGuard]
          },
          {
            path: "agreement",
            component: AgreementComponent,
            data: {
              preload: false,
              roles: ["show_project_Global"],
              projectRoles: ["Active"],
              attachmentCategory: "agreement",
            },
            resolve: {
              project: ProjectResolverService,
              attachments: GetAttachmentsResolverService,
            },
            canActivate: [RoleGuard, AuthGuard],
          },
          {
            path: "security",
            component: SecurityComponent,
            data: {
              preload: false,
              roles: ["show_project_Global"],
              projectRoles: ["Active"],
              attachmentCategory: "security",
            },
            resolve: {
              project: ProjectResolverService,
              attachments: GetAttachmentsResolverService,
            },
            canActivate: [RoleGuard, AuthGuard],
          },
          {
            path: "information",
            component: InformationComponent,
            data: {
              preload: false,
              roles: ["show_project_Global"],
              projectRoles: ["Active"],
              attachmentCategory: "information",
            },
            resolve: {
              project: ProjectResolverService,
              attachments: GetAttachmentsResolverService,
            },
            canActivate: [RoleGuard, AuthGuard],
          },
          {
            path: "moments",
            component: ProjectMomentsComponent,
            resolve: {
              project: ProjectResolverService,
              moments: MomentsResolverService,
            },
            data: {
              preload: false,
              roles: ["show_project_Global", "show_project_Settings"],
              projectRoles: ["Active"],
            },
            canActivate: [RoleGuard, AuthGuard],
          },
        ],
      },
      {
        path: "view/project-org/:id",
        component: ProjectOrganisationRouteComponent,
        resolve: {
          project: ProjectResolverService,
          projects: MajorProjectResolverService,
          roles: ProjectRoleResolverService,
          client_workers: ClientWorkersResolverService,
          registers: CreateRegistersResolverService,
          clientCategories: ClientCategoriesResolverService,
        },
        data: {
          preload: false,
          roles: ["show_project_Global", "show_project_Organization"],
          projectRoles: ["Active"],
        },
        canActivate: [RoleGuard, AuthGuard],
        children: [
          { path: "", redirectTo: "project-organisation", pathMatch: "full" },
          {
            path: "project-organisation/test",
            component: ProjectOrganisationComponent,
            resolve: {
              project: ProjectResolverService,
              projects: MajorProjectResolverService,
              registers: CreateRegistersResolverService,
              suppliers: SuppliersResolverService,
              clients: AllClientsResolver,
              roles: ProjectRoleResolverService,
              suppliersX: AllSuppliersResolver,
              categories: SuppCategoryResolverService,
            },
          },
          {
            path: "project-organisation",
            pathMatch: "full",
            component: ProjOrganisationPreviewComponent,
            resolve: {
              project: ProjectResolverService,
              projects: MajorProjectResolverService,
              registers: CreateRegistersResolverService,
              suppliers: SuppliersResolverService,
              clients: AllClientsResolver,
              roles: ProjectRoleResolverService,
              suppliersX: AllSuppliersResolver,
              categories: SuppCategoryResolverService,
            },
          },
        ],
      },

      {
        path: "view/:id/invoices",
        component: InvoiceComponent,
        resolve: {
          project: ProjectResolverService,
          invoices: InvoicesResolver,
        },
        data: {
          preload: false,
          roles: ["show_project_Global", "show_invoices_Global"],
          projectRoles: ["Active"],
        },
        canActivate: [RoleGuard, AuthGuard],
      },
      {
        path: "view/:id/invoice-overview/:invoice_id",
        component: InvoiceOverviewComponent,
        resolve: {
          project: ProjectResolverService,
          invoice: InvoiceResolver,
          clients: AllClientsResolver,
          projects: MajorProjectResolverService,
          supplierInvoices: getSupplierInoviceFromDatabaseResolverService,
          units: UnitsResolverService,
          users: ProjectUserResolverService,
        },
        data: {
          preload: false,
          roles: ["show_project_Global", "show_invoices_Global"],
          projectRoles: ["Active"],
        },
        canActivate: [RoleGuard, AuthGuard],
      },
      {
        path: "view/:id/supplier-invoices",
        component: SupplierInvoicesComponent,
        resolve: {
          project: ProjectResolverService,
          supplierInvoices: getSupplierInoviceFromDatabaseResolverService,
          accounts: getAccountsResolverService,
        },
        data: {
          preload: false,
          roles: ["show_project_Global", "show_project_SupplierInvoices"],
          projectRoles: ["Active"],
        },
        canActivate: [RoleGuard, AuthGuard],
      },
      {
        path: "view/supplier-invoices/edit/:invoice_id/:id/:selected_tab/:sir_id",
        component: EditSupplierInvoiceComponent,
        resolve: {
          supplierInvoice: getSupplierInvoiceResolverService,
          projects: getAllProjectsAndSubProjectsReslover,
        },
        data: {
          preload: false,
          roles: ["show_project_Global", "show_project_SupplierInvoices"],
          projectRoles: ["Active"],
        },
        canActivate: [RoleGuard, AuthGuard],
      },
      {
        path: "view/supplier-invoices/new/:id",
        component: NewSupplierInvoiceComponent,
       /* resolve: {
          supplierInvoice: getSupplierInvoiceResolverService,
          projects: getAllProjectsAndSubProjectsReslover,
        },*/
        data: {
          preload: false,
          roles: ["show_project_Global", "create_project_SupplierInvoices"],
          projectRoles: ["Active"],
        },
        canActivate: [RoleGuard, AuthGuard],
      },
      {
        path: "view/:id/materials",
        component: MaterialsComponent,
        resolve: {
          project: ProjectResolverService,
          materials: MaterialsResolverService,
        },
        data: {
          preload: false,
          roles: ["show_project_Global", "show_project_Summary"],
          projectRoles: ["Active"],
        },
        canActivate: [RoleGuard, AuthGuard],
      },
      {
        path: "view/:id/works",
        component: WorksComponent,
        resolve: {
          project: ProjectResolverService,
          works: WorksResolverService,
          users: ProjectUserResolverService,
          projectUserDetails: getProjectUserDetailsResolverService,
        },
        data: {
          preload: false,
          roles: ["show_project_Global", "show_project_Summary"],
          projectRoles: ["Active"],
        },
        canActivate: [RoleGuard, AuthGuard],
      },
      {
        path: "view/:id/reports",
        component: WeeklyReportsComponent,
        resolve: {
          project: ProjectResolverService,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "view/ata/modify-ata/:id",
        component: ModifyAtaComponent,
        resolve: {

          project: GetProjectFromAtaResolverService,
          atas: GetAtaAndSubatasResolverService,
         // weekly_reports: GetNotSendWeeklyReportsByAtaIdOnlyNamesResolverService,
          units: UnitsSortedByArticleTypeResolverService,
          enabledAccounts: GetAllEnabledAccountsResolverService,
          materialProperties: GetMaterialPropertiesResolverService,
          client_workers: ClientWorkersResolverService,
          type_atas: GetTypeAtasResolverService,
          generals: GeneralsSortedByKeyResolver,
          email_logs: getEmailLogsForAtaResolverService,
          internalAtas: GetInternalAtaAndSubatasResolverService,
          projectUserDetails: getProjectUserDetailsResolverService,
        },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: "view/:id/project-summary",
        component: ProjectSummaryComponent,
        resolve: {
          project: ProjectResolverService,
          projectWeekyReports: getAllProjectWeekyReportsResolverService,
          //projectsAndSubProjectsAndAtas: getProjectsAndSubProjectsAndAtasResolverService,
          statistic_data: getProjectsForAnalysisResolverService
        },
        data: {
          preload: false,
          roles: ["show_project_Global", "show_project_Summary"],
          projectRoles: ["Active"],
        },
        canActivate: [RoleGuard, AuthGuard]
      },
      {
        path: "view/:id/purchases",
        component: ProjectPurchasesRootComponent,
        resolve: {
          project: ProjectResolverService,
        },
        data: {
          preload: false,
          roles: ["show_project_Global", "show_project_Purchases"],
          projectRoles: ["Active"],
        },
        canActivate: [RoleGuard, AuthGuard],
        children: [
          {
            path: "supplier",
            component: SelectSupplierComponent,
            resolve: {
              supplierCategores: SupplierCategoriesResolverService,
              materialSuppliers: ProjectMaterialSuppliersResolverService,
            },
          },
        ],
      },
    ]),
  ],
  exports: [RouterModule, TranslateModule],
  providers: [
    ProjectsResolver,
    ProjectResolverService,
    getParentProjectResolverService,
    getWeeklyReportNamesResolverService,
    MajorProjectResolverService,
    ClientsService,
    ClientWorkersResolverService,
    ProjectUserResolverService,
    DirectoryDetailResolverService,
    GetAttachmentsResolverService,
    GetAttachmentResolverService,
    AtasResolverService,
    AtaResolverService,
    AtaDeviationResolverService,
    OrderByIdResolverService,
    // OfferResolverService,
    SuppliersResolverService,
    ClientsResolver,
    AllClientsResolver,
    GetMaterialPropertiesResolverService,
    ProjectRoleResolverService,
    SuppliersResolver,
    AllSuppliersResolver,
    SuppCategoryResolverService,
    GenerateProjectNumberResolverService,
    ClientCategoriesResolverService,
    MomentsResolverService,
    GetTypeDevaitionResolverService,
    getSupplierInoviceFromDatabaseResolverService,
    GetSupplierInvoiceRowsResolverService,
    UnitsResolverService,
    UnitsSortedByArticleTypeResolverService,
    GetTypeAtasResolverService,
    GetAllEnabledAccountsResolverService,
    GetAtaAndSubatasResolverService,
    GetProjectFromAtaResolverService,
    AtaMessagesResolverService,
    GetProjectActiveClientWorkersResolverService,
    SupplierCategoriesResolverService,
    ProjectMaterialSuppliersResolverService,
    GetWeeklyReportsByAtaIdResolverService,
    InvoicesResolver,
    InvoiceResolver,
    WeeklyReportPdfPreviewResolver,
    MaterialsResolverService,
    WorksResolverService,
    GeneralsResolver,
    getAssingedProjectsResolver,
    getUserPermissionAtaResolverService,
    getSupplierInvoiceResolverService,
    supplierInvoicesPdfResolverService,
    GetProjectExternalAtasResolverService,
    GetProjectInternalAtasResolverService,
    GetInternalAtaAndSubatasResolverService,
    GetNotSendWeeklyReportsByAtaIdResolverService,
    GetProjectExternalDeviationsResolverService,
    GetProjectInternalDeviationsResolverService,
    GetInternalDeviationResolverService,
    getAccountsResolverService,
    getAllProjectsAndSubProjectsReslover,
    GetProjectInformationActiveCompanyWorkersResolverService,
    getProjectUserDetailsResolverService,
    getAllProjectWeekyReportsResolverService,
    getProjectsAndSubProjectsAndAtasResolverService,
    getAvaibleAtasOrDuReslover,
    getEmailLogsForAtaResolverService,
    GeneralsSortedByKeyResolver,
    GetNotSendWeeklyReportsByAtaIdOnlyNamesResolverService,
    getProjectsForAnalysisResolverService
  ],
})
export class ProjectsRoutingModule {}
