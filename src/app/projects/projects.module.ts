import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProjectsRoutingModule } from "./projects-routing.module";
import { HttpClient } from "@angular/common/http";
import { createTranslateLoader } from "../createTranslateLoader";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { ProjectsComponent } from "./components/projects/projects.component";
import { NewProjectComponent } from "./components/new-project/new-project.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ProjectComponent } from "./components/project/project.component";

import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { OverviewComponent } from "./components/overview/overview.component";
import { PermitComponent } from "./components/permit/permit.component";
import { AttachmentComponent } from "./components/attachment/attachment.component";
import { DirectoryDetailComponent } from "./components/directory-detail/directory-detail.component";
import { AtaComponent } from "./components/ata/ata.component";
import { NewAtaComponent } from "./components/ata/new-ata/new-ata.component";
import { EditAtaComponent } from "./components/ata/edit-ata/edit-ata.component";
import { DeviationComponent } from "./components/deviation/deviation.component";
import { NewDeviationComponent } from "./components/deviation/new-deviation/new-deviation.component";
import { EditDeviationComponent } from "./components/deviation/edit-deviation/edit-deviation.component";
import { PipesModule } from "../core/pipes/pipes.module";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";

import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { NewSubProjectComponent } from "./components/new-sub-project/new-sub-project.component";

import { MenuBarComponent } from "./components/project/components/menu-bar/menu-bar.component";
import { ProjectInformationRouteComponent } from "./components/project/components/project-information-route/project-information-route.component";
import { AgreementComponent } from "./components/project/components/project-information-route/components/agreement/agreement.component";
import { InformationComponent } from "./components/project/components/project-information-route/components/information/information.component";
import { ProjectInformationComponent } from "./components/project/components/project-information-route/components/project-information/project-information.component";
import { ProjectOrganisationRouteComponent } from "./components/project/components/project-organisation-route/project-organisation-route.component";
import { ProjectOrganisationComponent } from "./components/project/components/project-organisation-route/components/project-organisation/project-organisation.component";
import { SecurityComponent } from "./components/project/components/project-information-route/components/security/security.component";
import { OrderListComponent } from "./components/project/components/order-list/order-list.component";
import { NewClientProjectComponent } from "./components/new-project-client/new-project-client.component";
import { ClientProjectDetailsComponent } from "./components/client-project-details/client-project-details.component";
import { NewCategoryComponent } from "./components/project/components/project-organisation-route/components/new-category/new-category.component";
import { ProjOrganisationNewSupplierComponent } from "./components/project/components/project-organisation-route/components/proj-organisation-new-supplier/proj-organisation-new-supplier.component";
import { AddProjClientWorkerComponent } from "./components/project/components/project-organisation-route/components/add-proj-client-worker/add-proj-client-worker.component";
import { AddProjectCompanyComponent } from "./components/project/components/project-organisation-route/components/add-proj-company/add-proj-company.component";
import { AddCompanyEmployeeComponent } from "./components/project/components/project-organisation-route/components/add-company-employee/add-company-employee.component";
import { NewProjSubcategoryComponent } from "./components/project/components/project-organisation-route/components/new-proj-subcategory/new-proj-subcategory.component";
import { ProjOrganisationPreviewComponent } from "./components/project/components/project-organisation-route/components/proj-organisation-preview/proj-organisation-preview.component";

import { MatTreeModule } from "@angular/material/tree";
import { DirectoryFileDetailComponent } from "./components/deviation/directory-file-detail/directory-file-detail.component";
import { ProjectMomentsComponent } from "./components/project/components/project-moments/project-moments.component";
import { InvoiceComponent } from "./components/project/components/project-overview/invoices/invoice.component";
import { InvoiceOverviewComponent } from "./components/project/components/project-overview/invoices/invoice-overview/invoice-overview.component";
import { SupplierInvoicesComponent } from "./components/project/components/project-overview/supplier-invoices/supplier-invoices.component";

import { SupplierInvoiceRowsComponent } from "./components/project/components/project-overview/supplier-invoices/supplier-invoice-rows/supplier-invoice-rows.component";
import { AtaPdfComponent } from "./components/ata/ata-pdf/ata-pdf.component";

import { DeviationPdfComponent } from "./components/deviation/deviation-pdf/deviation-pdf.component";
import { ProjectPurchasesRootComponent } from "./components/project/components/project-purchases-root/project-purchases-root.component";
import { SelectSupplierComponent } from "./components/project/components/project-purchases-root/components/select-supplier/select-supplier.component";
import { AtestComponent } from "./components/overview/components/atest/atest.component";
import { WeeklyReportPdfComponent } from "./components/ata/weekly-report-pdf/weekly-report-pdf.component";
import { MaterialsComponent } from "./components/project/components/project-overview/materials/materials.component";
import { WorksComponent } from "./components/project/components/project-overview/works/works.component";
import { ProjectSummaryComponent } from "./components/project/components/project-overview/project-summary/project-summary.component";
import { AtestHistoryComponent } from "./components/overview/components/atest-history/atest-history.component";
import { WeeklyReportComponent } from "./components/weekly-report/weekly-report.component";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { WeeklyReportsComponent } from "./components/project/components/project-overview/weekly-reports/weekly-report/weekly-reports.component";
import { PermitChildrenComponent } from "./components/permit-children/permit-children.component";
import { AdditionalWorkPdfComponent } from "./components/ata/additional-work-pdf/additional-work-pdf.component";
import { MaterialPdfComponent } from "./components/ata/material-pdf/material-pdf.component";
import { AtaWeeklyReportPdfComponent } from "./components/ata/ata-weekly-report-pdf/ata-weekly-report-pdf.component";
// import { EmailLogComponent } from "./components/email-log/email-log.component";
import { ClientAttestHistoryComponent } from "./components/client-attest-history/client-attest-history.component";
import { EditSupplierInvoiceComponent } from "./components/project/components/project-overview/supplier-invoices/edit-supplier-invoice/edit-supplier-invoice.component";
import { EmailLogAttachmentsModalComponent } from "./components/email-log/email-log-attachments-modal/email-log-attachments-modal.component";
import { AtaOverviewComponent } from "./components/ata/ata-overview/ata-overview.component";
import { ProjectListComponent } from "./components/projects/project-list/project-list.component";
import { FilterUsersPipe } from "./components/permit/filter.pipe";
import { ProjectOverviewComponent } from "./components/project-overview/project-overview.component";
import { EditorModule } from "@tinymce/tinymce-angular";
import { InputAutocompleteModule } from "src/app/utility/input-autocomplete/input-autocomplete.module";
import { ImpComponent } from "./components/overview/components/atest/imp/imp.component";
import { MomentEditorComponent } from "./components/overview/components/atest/imp/moment-editor/moment-editor.component";
import { AttestAbsenceComponent } from "./components/overview/components/atest/attest-absence/attest-absence.component";
import { NumberFormatModule } from "../utility/number-format/number-format.module";
import { NumberFormatDuModule } from "../utility/number-format-du/number-format-du.module";
import { NumberFormatPrognosisModule } from "../utility/number-format-prognosis/number-format-prognosis.module";
import { GalleryModule } from "../utility/gallery/gallery.module";
import { ImageModalModule } from "./components/image-modal/image-modal.module";
import { PdfPreviewComponent } from "src/app/invoice/components/pdf-preview/pdf-preview.component";

import { FilePreviewModule } from "./components/image-modal/file-preview/file-preview.module";
import { ArticlesFormComponent } from "./components/deviation/edit-deviation/articles-form/articles-form.component";
import { ConfirmationModalModule } from "../shared/modals/confirmation-modal/confirmation-modal.module";
import { AttestSelectComponent } from "./components/overview/components/attest-select/attest-select.component";
import { AtaPrognosisComponent } from "./components/ata/ata-prognosis/ata-prognosis.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { TruncatePipe } from "./components/project/components/payment-plan/cut-text.pipe";
import { DotsPopupComponent } from "./components/project/components/payment-plan/dots-popup/dots-popup.component";
import { EmailLogsAttachmentsModalComponent } from "./components/project/components/payment-plan/email-logs/email-logs-attachments-modal/email-logs-attachments-modal.component";
import { EmailLogsComponent } from "./components/project/components/payment-plan/email-logs/email-logs.component";
import { PaymentPlanPdfComponent } from "./components/project/components/payment-plan/payment-plan-pdf/payment-plan-pdf.component";
import { PaymentPlanComponent } from "./components/project/components/payment-plan/payment-plan.component";
import { EditoreModule } from 'src/app/utility/text-comment/editore.module';
import { AnswerToClientComponent } from './components/deviation/edit-deviation/answer-to-client/answer-to-client.component';
import { ClientResponsesModule } from './components/deviation/edit-deviation/client-responses/client-responses.module';
import { WorkerListComponent } from './components/deviation/edit-deviation/worker-list/worker-list.component';
import { AtaLinkComponent } from '../utility/ata-link/ata-link.component';
import { AtaLinkOldComponent } from '../utility/ata-link-old/ata-link-old.component';
import { DeviationChatComponent } from './components/deviation/edit-deviation/deviation-chat/deviation-chat.component';
import { ImageModalSmallModule } from './components/image-modal-small/image-modal-small.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ArrowUpSvgComponent } from './components/deviation/edit-deviation/deviation-chat/arrow-up-svg/arrow-up-svg.component';
import { ArrowDownSvgComponent } from './components/deviation/edit-deviation/deviation-chat/arrow-down-svg/arrow-down-svg.component';
import { SendIconSvgComponent } from './components/deviation/edit-deviation/deviation-chat/send-icon-svg/send-icon-svg.component';
import { SelectedIconSvgComponent } from './components/deviation/selected-icon-svg/selected-icon-svg.component';
import { NotSelectedIconSvgComponent } from './components/deviation/not-selected-icon-svg/not-selected-icon-svg.component';
import { PdfIconSvgComponent } from './components/deviation/pdf-icon-svg/pdf-icon-svg.component';
import { SummaryIconSvgComponent } from './components/deviation/summary-icon-svg/summary-icon-svg.component';
import { NewDeviationIconSvgComponent } from './components/deviation/new-deviation-icon-svg/new-deviation-icon-svg.component';
import { PdfModalPreviewComponent } from './components/pdf-modal-preview/pdf-modal-preview.component';
import { DeviationCommentComponent } from './components/project/components/deviation-comment/deviation-comment.component';
import {  CommentSectionModule } from 'src/app/utility/comment-section/comment-section.module';
import { SendSvgIconComponent } from './components/deviation/edit-deviation/worker-list/send-svg-icon/send-svg-icon.component';
import { CircleIconSvgComponent } from './components/deviation/edit-deviation/worker-list/circle-icon-svg/circle-icon-svg.component';
import { CheckedCircleIconSvgComponent } from './components/deviation/edit-deviation/worker-list/checked-circle-icon-svg/checked-circle-icon-svg.component';
import { DenySvgComponent } from './components/deviation/edit-deviation/client-responses/deny-svg/deny-svg.component';
import { ThreeDotsSvgComponent } from './components/deviation/edit-deviation/three-dots-svg/three-dots-svg.component';
import { HexStatusIconComponent } from './components/deviation/edit-deviation/hex-status-icon/hex-status-icon.component';
import { ArrowToggleSvgComponent } from './components/deviation/arrow-toggle-svg/arrow-toggle-svg.component';
import { DownloadSvgIconComponent } from './components/deviation/download-svg-icon/download-svg-icon.component';
import { PrintSvgIconComponent } from './components/deviation/print-svg-icon/print-svg-icon.component';
import { AmountInputComponent } from './components/project/components/payment-plan/amount-input/amount-input.component';
import { CommentExistSvgComponent } from './components/overview/components/svgs/comment-exist-svg/comment-exist-svg.component';
import { CommentNotExistSvgComponent } from './components/overview/components/svgs/comment-not-exist-svg/comment-not-exist-svg.component';
import { RevertAllSvgComponent } from './components/overview/components/svgs/revert-all-svg/revert-all-svg.component';
import { CheckInSvgComponent } from './components/overview/components/svgs/check-in-svg/check-in-svg.component';
import { CheckOutSvgComponent } from './components/overview/components/svgs/check-out-svg/check-out-svg.component';
import { CheckOutAllSvgComponent } from './components/overview/components/svgs/check-out-all-svg/check-out-all-svg.component';
import { CalendarSvgComponent } from './components/overview/components/svgs/calendar-svg/calendar-svg.component';
import { DelleteSvgComponent } from './components/overview/components/svgs/dellete-svg/dellete-svg.component';
import { DelleteIconSvgComponent } from './components/overview/components/svgs/dellete-icon-svg/dellete-icon-svg.component';
import { AttestSelectDropdownComponent } from './components/overview/components/attest-select-dropdown/attest-select-dropdown.component';
import { CloseSvgComponent } from './components/overview/components/svgs/close-svg/close-svg.component';
import { ToggleOnSvgComponent } from './components/overview/components/svgs/toggle-on-svg/toggle-on-svg.component';
import { ToggleOffSvgComponent } from './components/overview/components/svgs/toggle-off-svg/toggle-off-svg.component';
import { ImageExistSvgComponent } from './components/overview/components/svgs/image-exist-svg/image-exist-svg.component';
import { ImageNotExistSvgComponent } from './components/overview/components/svgs/image-not-exist-svg/image-not-exist-svg.component';
import { NoteSvgComponent } from './components/overview/components/svgs/note-svg/note-svg.component';
import { ZoomInSvgComponent } from './components/overview/components/zoom-in-svg/zoom-in-svg.component';
import { ZoomOutSvgComponent } from './components/overview/components/zoom-out-svg/zoom-out-svg.component';
import { MomentEditor1Component } from './components/overview/components/atest/imp/moment-editor1/moment-editor1.component';
import { AddIconSvgComponent } from './components/overview/components/atest/imp/add-icon-svg/add-icon-svg.component';
import { ExistMarkSvgComponent } from './components/overview/components/atest/exist-mark-svg/exist-mark-svg.component';
import { NotExistMarkSvgComponent } from './components/overview/components/atest/not-exist-mark-svg/not-exist-mark-svg.component';
import { DelleteIcon2SvgComponent } from './components/overview/components/atest/imp/dellete-icon2-svg/dellete-icon2-svg.component';
import { LockIconSvgComponent } from './components/overview/components/atest/imp/lock-icon-svg/lock-icon-svg.component';
import { NewAtaIconSvgComponent } from './components/ata/new-ata/new-ata-icon-svg/new-ata-icon-svg.component';
import { SvgIconModule } from "../core/svg-icons/svg-icon.module";
import { ImageModalCommentModule } from "./components/image-modal-comment/image-modal-comment.module";
import { CustomSelectModule } from "../shared/components/custom-select/custom-select.model";
import { ModifyAtaComponent } from './components/ata/modify-ata/modify-ata.component';
import { AtaModifyHeaderComponent } from './components/ata/modify-ata/ata-modify-header/ata-modify-header.component';
import { AtaInfoComponent } from './components/ata/modify-ata/ata-info/ata-info.component';
import { AtaInfoNavComponent } from './components/ata/modify-ata/ata-info/ata-info-nav/ata-info-nav.component';
import { AtaInfoTabsComponent } from './components/ata/modify-ata/ata-info/ata-info-tabs/ata-info-tabs.component';
import { SvgStatusesComponent } from './components/ata/modify-ata/ata-info/ata-info-nav/svg-statuses/svg-statuses.component';
import { SvgSentOnlyComponent } from './components/ata/modify-ata/ata-info/ata-info-nav/svg-sent-only/svg-sent-only.component';
import { DataOfAtaComponent } from './components/ata/modify-ata/ata-info/data-of-ata/data-of-ata.component';
import { DataOfKsComponent } from './components/ata/modify-ata/ata-info/data-of-ks/data-of-ks.component';
import { PermitAtaComponent } from './components/ata/modify-ata/permit-ata/permit-ata.component';
import { CustomSimpleSelectModule } from "../shared/components/custom-simple-select/custom-simple-select.model";
// import { TabDirective } from "../shared/directives/tab/tab.directive";
import { SupplierInvoiceModalComponent } from './components/ata/modify-ata/supplier-invoice-modal/supplier-invoice-modal.component';
import { TreeItemComponent } from './components/attachment/tree-item/tree-item.component';
import { TreeListComponent } from './components/attachment/tree-list/tree-list.component';
import { NewFileDialogComponent } from './components/attachment/new-file-dialog/new-file-dialog.component';
import { NewFolderDialogComponent } from './components/attachment/new-folder-dialog/new-folder-dialog.component';
import { CompetenceDialogComponent } from './components/attachment/competence-dialog/competence-dialog.component';
import { NewCommentDialogComponent } from './components/attachment/new-comment-dialog/new-comment-dialog.component';
import { ImageModalWithFilenameModule } from './components/image-modal-with-filename/image-modal-with-filename.module';
import { EmailLogModule } from "./components/email-log/email-log.module";
import { DropdownsModule } from "../utility/dropdowns/dropdowns.module";
import { CloseSvgClientComponent } from './components/new-project-client/close-svg-client/close-svg-client.component';
import { CheckinCheckoutModule } from "../utility/svgs/checkin-checkout/checkin-checkout.module";
import { ChildComponentTabDirective } from "../shared/directives/tab/child-component-tab.directive";
import { PlusSvgComponent } from './components/attachment/svgs/plus-svg/plus-svg.component';
import { WordSvgComponent } from './components/attachment/svgs/word-svg/word-svg.component';
import { PermissionDropdownComponent } from './components/attachment/permission-dropdown/permission-dropdown.component';
import { DownArrowComponent } from './components/attachment/permission-dropdown/svgs/down-arrow/down-arrow.component';
import { CheckboxUncheckComponent } from './components/attachment/permission-dropdown/svgs/checkbox-uncheck/checkbox-uncheck.component';
import { CheckboxCheckComponent } from './components/attachment/permission-dropdown/svgs/checkbox-check/checkbox-check.component';
import { EyeGreyComponent } from './components/attachment/permission-dropdown/svgs/eye-grey/eye-grey.component';
import { EyeGreenComponent } from './components/attachment/permission-dropdown/svgs/eye-green/eye-green.component';
import { PencilGreenComponent } from './components/attachment/permission-dropdown/svgs/pencil-green/pencil-green.component';
import { PencilGreyComponent } from './components/attachment/permission-dropdown/svgs/pencil-grey/pencil-grey.component';
import { UpArrowComponent } from './components/attachment/permission-dropdown/svgs/up-arrow/up-arrow.component';
import { CompetenceSimpleDropdownComponent } from './components/attachment/competence-simple-dropdown/competence-simple-dropdown.component';
import { CommentCounterComponent } from './components/attachment/comment-counter/comment-counter.component';
import { NewSupplierInvoiceComponent } from './components/project/components/project-overview/supplier-invoices/new-supplier-invoice/new-supplier-invoice.component';
//  import { CheckinCheckoutModule } from '../checkin-checkout/checkin-checkout.module';
import { WeeklyReportModifyComponent } from './components/weekly-report-modify/weekly-report-modify.component';
import { WeeklyInfoNavComponent } from "./components/weekly-report-modify/weekly-modify/weekly-info/weekly-info-nav/weekly-info-nav.component";
import { WeeklyInfoTabsComponent } from "./components/weekly-report-modify/weekly-modify/weekly-info/weekly-info-tabs/weekly-info-tabs.component";
import { DataOfKsWeeklyComponent } from './components/weekly-report-modify/weekly-modify/weekly-info/data-of-ks-weekly/data-of-ks-weekly.component';
import { WeeklyOverviewComponent } from './components/weekly-report-modify/weekly-modify/weekly-overview/weekly-overview.component';
import { SupplierInvoicesPreviewComponent } from './components/weekly-report-modify/weekly-modify/weekly-info/supplier-invoices-preview/supplier-invoices-preview.component';
import { DropdownSelectPrintForDuComponent } from './components/weekly-report-modify/weekly-modify/weekly-info/dropdown-select-print-for-du/dropdown-select-print-for-du.component';
/* import { ArrowDropdownComponent } from './components/weekly-report-modify/weekly-modify/weekly-info/arrow-dropdown/arrow-dropdown.component';
 */import { PrintImageForDropdownComponent } from './components/weekly-report-modify/weekly-modify/weekly-info/print-image-for-dropdown/print-image-for-dropdown.component';
import { SendImageForDropdownComponent } from './components/weekly-report-modify/weekly-modify/weekly-info/send-image-for-dropdown/send-image-for-dropdown.component';
import { ArrowForFirstDropdownComponent } from './components/weekly-report-modify/weekly-modify/weekly-info/arrow-for-first-dropdown/arrow-for-first-dropdown.component';
import { CheckinSvgForFirstDropdownComponent } from './components/weekly-report-modify/weekly-modify/weekly-info/checkin-svg-for-first-dropdown/checkin-svg-for-first-dropdown.component';
//import { CheckoutSvgForFirstDropdownComponent } from './components/weekly-report-modify/weekly-modify/weekly-info/checkout-svg-for-first-dropdown/checkout-svg-for-first-dropdown.component';
import { DropdownForDuComponent } from './components/weekly-report-modify/weekly-modify/weekly-info/dropdown-for-du/dropdown-for-du.component';
import { DropdownForStatusComponent } from './components/weekly-report-modify/weekly-modify/weekly-info/dropdown-for-status/dropdown-for-status.component';
import { SvgForAccepteradComponent } from './components/weekly-report-modify/weekly-modify/weekly-info/svg-for-accepterad/svg-for-accepterad.component';
import { EmaildebiteringComponent } from './components/weekly-report-modify/emaildebitering/emaildebitering.component';
import { UsersModule } from "../users/users.module";
import { PermitEducationDialogComponent } from './components/permit-education-dialog/permit-education-dialog.component';
import { PdfjsviewerModule } from "../utility/pdfjs-viewer/pdfjsviewer.module";
import { SvgGlobalModule } from "../utility/svgs/svg-global/svg-global.module";
import { FilterDropdownArrowComponent } from "./components/ata/ata-prognosis/filter-dropdown/filter-dropdown-arrow/filter-dropdown-arrow.component";
import { FilterDropdownComponent } from "./components/ata/ata-prognosis/filter-dropdown/filter-dropdown.component";
import { NewBrowserTabPrognosisComponent } from "./components/ata/ata-prognosis/new-browser-tab-prognosis/new-browser-tab-prognosis.component";
import { PrognosisLayoutComponent } from "./components/ata/ata-prognosis/prognosis-layout/prognosis-layout.component";
import { DirectoryWrapperComponent } from "./components/ata/ata-prognosis/prognosis-layout/directory-wrapper/directory-wrapper.component";
import { PrognosisLayoutBlueTableOneRowComponent } from "./components/ata/ata-prognosis/prognosis-layout/prognosis-layout-blue-table-one/prognosis-layout-blue-table-one-row/prognosis-layout-blue-table-one-row.component";
import { PrognosisLayoutBlueTableOneComponent } from "./components/ata/ata-prognosis/prognosis-layout/prognosis-layout-blue-table-one/prognosis-layout-blue-table-one.component";
import { PrognosisLayoutBlueTableTwoComponent } from "./components/ata/ata-prognosis/prognosis-layout/prognosis-layout-blue-table-two/prognosis-layout-blue-table-two.component";
import { PrognosisLayoutYellowTableComponent } from "./components/ata/ata-prognosis/prognosis-layout/prognosis-layout-yellow-table/prognosis-layout-yellow-table.component";
import { CancelSvgComponent } from "./components/ata/ata-prognosis/prognosis-layout/search-bar/cancel-svg/cancel-svg.component";
import { SearchSvgComponent } from "./components/ata/ata-prognosis/prognosis-layout/search-bar/search-svg/search-svg.component";
import { SearchBarComponent } from "./components/ata/ata-prognosis/prognosis-layout/search-bar/search-bar.component";
import { WrapperTabComponent } from "./components/ata/ata-prognosis/prognosis-layout/wrapper-with-tabs/wrapper-tab/wrapper-tab.component";
import { WrapperWithTabsComponent } from "./components/ata/ata-prognosis/prognosis-layout/wrapper-with-tabs/wrapper-with-tabs.component";
import { PrognosisPropertyDownArrowComponent } from "./components/ata/ata-prognosis/prognosis-table/prognosis-property/prognosis-property-down-arrow/prognosis-property-down-arrow.component";
import { PrognosisPropertyUpArrowComponent } from "./components/ata/ata-prognosis/prognosis-table/prognosis-property/prognosis-property-up-arrow/prognosis-property-up-arrow.component";
import { PrognosisTotalsByTypeComponent } from "./components/ata/ata-prognosis/prognosis-table/prognosis-property/prognosis-totals-by-type/prognosis-totals-by-type.component";
import { PrognosisPropertyComponent } from "./components/ata/ata-prognosis/prognosis-table/prognosis-property/prognosis-property.component";
import { PrognosisPropertyAtaRowComponent } from "./components/ata/ata-prognosis/prognosis-table/prognosis-property-ata/prognosis-property-ata-row/prognosis-property-ata-row.component";
import { PrognosisPropertyAtaComponent } from "./components/ata/ata-prognosis/prognosis-table/prognosis-property-ata/prognosis-property-ata.component";
import { PrognosisTableComponent } from "./components/ata/ata-prognosis/prognosis-table/prognosis-table.component";
import { SafeHtmlPipe } from "./components/ata/ata-prognosis/prognosis-layout/wrapper-with-tabs/safe-html.pipe";
import { FileSizePipe } from './components/attachment/tree-item/file-size.pipe';
import { InputsModule } from "../utility/inputs/inputs.module";
import { ImagesListComponent } from './components/documents/images-list/images-list.component';
import { IntersectionObserverDirective } from 'src/app/core/directive/intersection-observer.directive';
import { SelectedSuppliersComponent } from './components/project/components/selected-suppliers/selected-suppliers.component';

@NgModule({
  declarations: [

    // TabDirective,
    TruncatePipe,
    ProjectsComponent,
    ProjectListComponent,
    NewProjectComponent,
    ProjectComponent,
    OverviewComponent,
    PermitComponent,
    AttachmentComponent,
    DirectoryDetailComponent,
    DirectoryFileDetailComponent,
    AtaComponent,
    NewAtaComponent,
    EditAtaComponent,
    DeviationComponent,
    NewDeviationComponent,
    EditDeviationComponent,
    NewSubProjectComponent,
    ProjectInformationRouteComponent,
    AgreementComponent,
    InformationComponent,
    InvoiceComponent,
    SupplierInvoicesComponent,
    SupplierInvoiceRowsComponent,
    MenuBarComponent,
    ProjectInformationComponent,
    ProjectOrganisationRouteComponent,
    ProjectOrganisationComponent,
    SecurityComponent,
    OrderListComponent,
    NewClientProjectComponent,
    ClientProjectDetailsComponent,
    NewCategoryComponent,
    ProjOrganisationNewSupplierComponent,
    AddProjClientWorkerComponent,
    AddProjectCompanyComponent,
    AddCompanyEmployeeComponent,
    NewProjSubcategoryComponent,
    ProjOrganisationPreviewComponent,
    ProjectMomentsComponent,
    AtaPdfComponent,
    WeeklyReportPdfComponent,
    AtaWeeklyReportPdfComponent,
    AdditionalWorkPdfComponent,
    MaterialPdfComponent,
    DeviationPdfComponent,
    ProjectPurchasesRootComponent,
    SelectSupplierComponent,
    AtestComponent,
    WeeklyReportComponent,
    InvoiceOverviewComponent,
    MaterialsComponent,
    WorksComponent,
    ProjectSummaryComponent,
    AtestHistoryComponent,
    WeeklyReportsComponent,
    PermitChildrenComponent,
    EmailLogAttachmentsModalComponent,
    ClientAttestHistoryComponent,
    EditSupplierInvoiceComponent,
    AtaOverviewComponent,
    FilterUsersPipe,
    ProjectOverviewComponent,
    ImpComponent,
    MomentEditorComponent,
    AttestAbsenceComponent,
    ArticlesFormComponent,
    AttestSelectComponent,
    AtaPrognosisComponent,
    SafeHtmlPipe,
    WrapperWithTabsComponent,
    SearchSvgComponent,
    SearchBarComponent,
    WrapperTabComponent,
    PrognosisLayoutBlueTableOneRowComponent,
    PrognosisLayoutBlueTableOneComponent,
    PrognosisLayoutBlueTableTwoComponent,
    PrognosisLayoutYellowTableComponent,
    CancelSvgComponent,
    PrognosisLayoutComponent,
    PrognosisPropertyDownArrowComponent,
    PrognosisPropertyUpArrowComponent,
    PrognosisTotalsByTypeComponent,
    DirectoryWrapperComponent,
    FilterDropdownArrowComponent,
    PrognosisPropertyComponent,
    PrognosisPropertyAtaComponent,
    PrognosisTableComponent,
    PrognosisPropertyAtaRowComponent,
    NewBrowserTabPrognosisComponent,
    FilterDropdownComponent,
    PdfPreviewComponent,
    PaymentPlanComponent,
    DotsPopupComponent,
    PaymentPlanPdfComponent,
    EmailLogsComponent,
    EmailLogsAttachmentsModalComponent,
    DeviationChatComponent,
    AnswerToClientComponent,
    WorkerListComponent,
    EmailLogsAttachmentsModalComponent,
    AtaLinkComponent,
    ArrowUpSvgComponent,
    ArrowDownSvgComponent,
    SendIconSvgComponent,
    SelectedIconSvgComponent,
    NotSelectedIconSvgComponent,
    PdfIconSvgComponent,
    SummaryIconSvgComponent,
    PdfModalPreviewComponent,
    NewDeviationIconSvgComponent,
    DeviationCommentComponent,
    SendSvgIconComponent,
    CircleIconSvgComponent,
    CheckedCircleIconSvgComponent,
    DenySvgComponent,
    ThreeDotsSvgComponent,
    HexStatusIconComponent,
    ArrowToggleSvgComponent,
    DownloadSvgIconComponent,
    PrintSvgIconComponent,
    AmountInputComponent,
    CommentExistSvgComponent,
    CommentNotExistSvgComponent,
    RevertAllSvgComponent,
    CheckInSvgComponent,
    CheckOutSvgComponent,
    CheckOutAllSvgComponent,
    CalendarSvgComponent,
    DelleteSvgComponent,
    DelleteIconSvgComponent,
    AttestSelectDropdownComponent,
    CloseSvgComponent,
    ToggleOnSvgComponent,
    ToggleOffSvgComponent,
    ImageExistSvgComponent,
    ImageNotExistSvgComponent,
    NoteSvgComponent,
    ZoomInSvgComponent,
    ZoomOutSvgComponent,
    MomentEditor1Component,
    AddIconSvgComponent,
    ExistMarkSvgComponent,
    NotExistMarkSvgComponent,
    DelleteIcon2SvgComponent,
    LockIconSvgComponent,
    NewAtaIconSvgComponent,
    ModifyAtaComponent,
    AtaModifyHeaderComponent,
    AtaInfoComponent,
    AtaInfoNavComponent,
    AtaInfoTabsComponent,
    SvgStatusesComponent,
    SvgSentOnlyComponent,
    DataOfAtaComponent,
    DataOfKsComponent,
    PermitAtaComponent,
    SupplierInvoiceModalComponent,
    AtaLinkOldComponent,
    WeeklyReportModifyComponent,
    WeeklyInfoNavComponent,
    WeeklyInfoTabsComponent,
    DataOfKsWeeklyComponent,
    WeeklyOverviewComponent,
    SupplierInvoicesPreviewComponent,
    DropdownSelectPrintForDuComponent,
/*     ArrowDropdownComponent,
 */    PrintImageForDropdownComponent,
    SendImageForDropdownComponent,
    ArrowForFirstDropdownComponent,
    CheckinSvgForFirstDropdownComponent,
    //CheckoutSvgForFirstDropdownComponent,
    DropdownForDuComponent,
    DropdownForStatusComponent,
    SvgForAccepteradComponent,
    EmaildebiteringComponent,
    //CheckinSvgGreenComponent,
    //CheckingSvgRedComponent,
    //ChehkinSvgSupplierComponent,
    TreeItemComponent,
    TreeListComponent,
    NewFileDialogComponent,
    NewFolderDialogComponent,
    CompetenceDialogComponent,
    NewCommentDialogComponent,
    ChildComponentTabDirective,
    PlusSvgComponent,
    WordSvgComponent,
    PermissionDropdownComponent,
    DownArrowComponent,
    CheckboxUncheckComponent,
    CheckboxCheckComponent,
    EyeGreyComponent,
    EyeGreenComponent,
    PencilGreenComponent,
    PencilGreyComponent,
    UpArrowComponent,
    CompetenceSimpleDropdownComponent,
    CommentCounterComponent,
  	CloseSvgClientComponent,
    NewSupplierInvoiceComponent,
    PermitEducationDialogComponent,
    FileSizePipe,
    ImagesListComponent,
    IntersectionObserverDirective,
    SelectedSuppliersComponent,
  ],

  exports: [
    NotSelectedIconSvgComponent,
    SelectedIconSvgComponent,
    ClientProjectDetailsComponent,
  ],
  entryComponents: [
    ProjectOrganisationComponent,
    EmailLogAttachmentsModalComponent,
    ImpComponent,
    ArticlesFormComponent,
    ThreeDotsSvgComponent,
  ],
  bootstrap: [ProjectOrganisationComponent],
  imports: [
    MatDialogModule,
    CommonModule,
    FormsModule,
    MatTreeModule,
    ReactiveFormsModule,
    ProjectsRoutingModule,
    MatAutocompleteModule,
    CustomSelectModule,
    CustomSimpleSelectModule,
    ConfirmationModalModule,
    NgMultiSelectDropDownModule.forRoot(),
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
    PipesModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    NgxMaterialTimepickerModule,
    EditorModule,
    InputAutocompleteModule,
    NumberFormatModule,
    NumberFormatDuModule,
    ImageModalModule,
    FilePreviewModule,
    GalleryModule,
    NumberFormatPrognosisModule,
    EditoreModule,
    ClientResponsesModule,
    ImageModalSmallModule,
    DragDropModule,
    CommentSectionModule,
    SvgIconModule,
    ImageModalCommentModule,
    ImageModalWithFilenameModule,
    EmailLogModule,
    DropdownsModule,
    CheckinCheckoutModule,
    UsersModule,
    PdfjsviewerModule,
    SvgGlobalModule,
    InputsModule
  ],
})
export class ProjectsModule {}
