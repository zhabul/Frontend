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

@NgModule({
  declarations: [InvoiceComponent, NewInvoiceComponent, EditInvoiceComponent],
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
  ],
})
export class InvoicesModule {}
