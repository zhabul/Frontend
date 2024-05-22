import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { createTranslateLoader } from "../../createTranslateLoader";
import { StatusDropdownComponent } from "./status-dropdown.component";

@NgModule({
  declarations: [StatusDropdownComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    })
  ],
  exports: [StatusDropdownComponent],
  entryComponents: [],
  providers: [],
  bootstrap: [],
})
export class StatusDropdownModule {}
