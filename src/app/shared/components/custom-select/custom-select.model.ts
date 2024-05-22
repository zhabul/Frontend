import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CustomSelectComponent } from "./custom-select/custom-select.component";

import { ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { DropdownsModule } from "src/app/utility/dropdowns/dropdowns.module";

@NgModule({
  declarations: [CustomSelectComponent],
  imports: [CommonModule, TranslateModule.forChild(), ReactiveFormsModule, DropdownsModule],
  exports: [CustomSelectComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CustomSelectModule {}
