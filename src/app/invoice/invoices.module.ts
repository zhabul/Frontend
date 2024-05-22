import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InvoicesRoutingModule } from "./invoices-routing.module";
import { HttpClient } from "@angular/common/http";
import { createTranslateLoader } from "../createTranslateLoader";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTreeModule } from "@angular/material/tree";
import { PipesModule } from "../core/pipes/pipes.module";

import { InvoiceComponent } from "./components/invoices/invoice.component";
import { NewInvoiceComponent } from "./components/new-invoice/new-invoice.component";
import { EditInvoiceComponent } from "./components/edit-invoice/edit-invoice.component";
import { InputAutocompleteModule } from "src/app/utility/input-autocomplete/input-autocomplete.module";
import { NumberFormatModule } from "../utility/number-format/number-format.module";
import { ConfirmationModalModule } from "../shared";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";

import { NewBillComponent } from './components/new-bill/new-bill.component';
import { CheckoutSvgComponent } from './components/checkout-svg/checkout-svg.component';
import { CheckinSvgComponent } from './components/checkin-svg/checkin-svg.component';
import { AddForBtnComponent } from './components/add-for-btn/add-for-btn.component';
import { NotSelectedIconSvgComponent } from "./components/not-selected-icon-svg/not-selected-icon-svg.component";
import { SelectedIconSvgComponent } from "./components/selected-icon-svg/selected-icon-svg.component";
import { InvoicesModalComponent } from './components/invoices-modal/invoices-modal.component';
import { CloseSvgComponent } from "./components/close-svg/close-svg.component";
import { SelectDropdownInvoiceComponent } from './components/select-dropdown-invoice/select-dropdown-invoice.component';
import { ToggleOffSvgComponent } from "./components/svgs/toggle-off-svg/toggle-off-svg.component";
import { ToggleOnSvgComponent } from "./components/svgs/toggle-on-svg/toggle-on-svg.component";
import { SelectDropdownReferenceComponent } from './components/select-dropdown-reference/select-dropdown-reference.component';
import { EditBillComponent } from './components/edit-bill/edit-bill.component';
import { PaymentTermsDropdownComponent } from './components/new-bill/payment-terms-dropdown/payment-terms-dropdown.component';
import { NewBillCategoryDropdownComponent } from './components/new-bill/new-bill-category-dropdown/new-bill-category-dropdown.component';
import { NewBillAtaModalComponent } from './components/new-bill/new-bill-ata-modal/new-bill-ata-modal.component';
import { NewBillWeeklyModalComponent } from './components/new-bill/new-bill-weekly-modal/new-bill-weekly-modal.component';
import { AtaModalDropdownComponent } from './components/new-bill/new-bill-ata-modal/ata-modal-dropdown/ata-modal-dropdown.component';
import { NewBillPaymentModalComponent } from './components/new-bill/new-bill-payment-modal/new-bill-payment-modal.component';
import { DropdownsModule } from "../utility/dropdowns/dropdowns.module";
import { DragDropModule } from "@angular/cdk/drag-drop";

@NgModule({
  declarations: [
    InvoiceComponent,
    NewInvoiceComponent,
    EditInvoiceComponent,
    SelectedIconSvgComponent,
    NotSelectedIconSvgComponent,
    NewBillComponent,
    CheckoutSvgComponent,
    CheckinSvgComponent,
    AddForBtnComponent,
    InvoicesModalComponent,
    CloseSvgComponent,
    SelectDropdownInvoiceComponent,
    ToggleOffSvgComponent,
    ToggleOnSvgComponent,
    SelectDropdownReferenceComponent,
    EditBillComponent,
    PaymentTermsDropdownComponent,
    NewBillCategoryDropdownComponent,
    NewBillAtaModalComponent,
    NewBillWeeklyModalComponent,
    AtaModalDropdownComponent,
    NewBillPaymentModalComponent
  ],
  entryComponents: [],
  bootstrap: [],
  imports: [
    CommonModule,
    FormsModule,
    MatTreeModule,
    ReactiveFormsModule,
    InvoicesRoutingModule,
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
    ConfirmationModalModule,
    InputAutocompleteModule,
    NumberFormatModule,
    DropdownsModule,
    DragDropModule
  ],
})
export class InvoicesModule {}
