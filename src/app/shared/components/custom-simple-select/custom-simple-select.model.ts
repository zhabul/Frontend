import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ReactiveFormsModule } from "@angular/forms";
import { CustomSimpleSelectComponent } from "./custom-simple-select/custom-simple-select.component";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [CustomSimpleSelectComponent],
  imports: [CommonModule, TranslateModule.forChild(), ReactiveFormsModule],
  exports: [CustomSimpleSelectComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CustomSimpleSelectModule {}
