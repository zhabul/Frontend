import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterDropdownMultiselectComponent } from './counter-dropdown-multiselect/counter-dropdown-multiselect.component';
import { DropdownsComponent } from './dropdowns.component';
import { ArrowForDropdownComponent } from './arrow-for-dropdown/arrow-for-dropdown.component';
import { CheckinCheckoutModule } from '../checkin-checkout/checkin-checkout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryDropdownComponent } from './category-dropdown/category-dropdown.component';
import { SelectDropdownWithPlusComponent } from './select-dropdown-with-plus/select-dropdown-with-plus.component';
import { SelectDropdownSingleCheckboxComponent } from './select-dropdown-single-checkbox/select-dropdown-single-checkbox.component';
import { MultiselectDropdownProjectComponent } from './multiselect-dropdown-project/multiselect-dropdown-project.component';
import { SendPrintDropdownUTComponent } from './send-print-dropdown-ut/send-print-dropdown-ut.component';
import { SendImageForDropdownComponent } from './send-image-for-dropdown/send-image-for-dropdown.component';
import { PrintImageForDropdownComponent } from './print-image-for-dropdown/print-image-for-dropdown.component';
import { SendPrintDropdownATAComponent } from './send-print-dropdown-ata/send-print-dropdown-ata.component';
import { SammDropdownComponent } from './samm-dropdown/samm-dropdown.component';
import { AtaStatusDropdownComponent } from './ata-status-dropdown/ata-status-dropdown.component';
import { GrantAuthorityDropdownComponent } from './grant-authority-dropdown/grant-authority-dropdown.component';
import { DaysDropdownComponent } from './days-dropdown/days-dropdown.component';
import { UserDropdownMultiselectComponent } from './user-dropdown-multiselect/user-dropdown-multiselect.component';
import { SearchDropdownComponent } from './search-dropdown/search-dropdown.component';
import { AtaStatusInNewAtaComponent } from './ata-status-in-new-ata/ata-status-in-new-ata.component';
import { DeviationStatusComponent } from './deviation-status/deviation-status.component';
import { SimpleSelectComponent } from './simple-select/simple-select.component';
import { SimpleSelectInTableComponent } from './simple-select-in-table/simple-select-in-table.component';
import { SimpleSelectAttestTableDropdownComponent } from './simple-select-attest-table-dropdown/simple-select-attest-table-dropdown.component';
import { DropdownThreedotPayplanComponent } from './dropdown-threedot-payplan/dropdown-threedot-payplan.component';
import { SendPrintDropdownPayplanComponent } from './send-print-dropdown-payplan/send-print-dropdown-payplan.component';
import { CompanyHomeDropdownComponent } from './company-home-dropdown/company-home-dropdown.component';
import { SimpleSelectWithCheckDropdownComponent } from './simple-select-with-check-dropdown/simple-select-with-check-dropdown.component';
import { HttpClient } from "@angular/common/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { createTranslateLoader } from "../../createTranslateLoader";
import { SingleSelectDropdownComponent } from './single-select-dropdown/single-select-dropdown.component';

@NgModule({
  declarations: [
    CounterDropdownMultiselectComponent,
    DropdownsComponent,
    ArrowForDropdownComponent,
    SendImageForDropdownComponent,
    PrintImageForDropdownComponent,
    CategoryDropdownComponent,
    SelectDropdownWithPlusComponent,
    SelectDropdownSingleCheckboxComponent,
    MultiselectDropdownProjectComponent,
    SendPrintDropdownUTComponent,
    SendPrintDropdownATAComponent,
    SammDropdownComponent,
    AtaStatusDropdownComponent,
    GrantAuthorityDropdownComponent,
    DaysDropdownComponent,
    UserDropdownMultiselectComponent,
    SearchDropdownComponent,
    AtaStatusInNewAtaComponent,
    DeviationStatusComponent,
    SimpleSelectComponent,
    SimpleSelectInTableComponent,
    SimpleSelectAttestTableDropdownComponent,
    DropdownThreedotPayplanComponent,
    SendPrintDropdownPayplanComponent,
    CompanyHomeDropdownComponent,
    SimpleSelectWithCheckDropdownComponent,
    SingleSelectDropdownComponent,
  ],
  imports: [
    CommonModule,
    CheckinCheckoutModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [
    CounterDropdownMultiselectComponent,
    CategoryDropdownComponent,
    SelectDropdownWithPlusComponent,
    SelectDropdownSingleCheckboxComponent,
    MultiselectDropdownProjectComponent,
    SendPrintDropdownUTComponent,
    SendPrintDropdownATAComponent,
    SammDropdownComponent,
    AtaStatusDropdownComponent,
    GrantAuthorityDropdownComponent,
    DaysDropdownComponent,
    UserDropdownMultiselectComponent,
    SearchDropdownComponent,
    AtaStatusInNewAtaComponent,
    DeviationStatusComponent,
    SimpleSelectComponent,
    SimpleSelectInTableComponent,
    SimpleSelectAttestTableDropdownComponent,
    DropdownThreedotPayplanComponent,
    SendPrintDropdownPayplanComponent,
    CompanyHomeDropdownComponent,
    SimpleSelectWithCheckDropdownComponent,
    SingleSelectDropdownComponent
  ],
})
export class DropdownsModule { }
