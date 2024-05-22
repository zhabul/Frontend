import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { createTranslateLoader } from "../../createTranslateLoader";
import { ComponentEmailStatusComponent } from "./component-email-status.component";
import { SpsHexSvgModule } from "../svgs/sps-hex-svg/sps-hex-svg.module";

@NgModule({
  declarations: [ComponentEmailStatusComponent,],
  imports: [
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    SpsHexSvgModule
  ],
  exports: [ComponentEmailStatusComponent],
  entryComponents: [],
  providers: [],
  bootstrap: [],
})
export class ComponentEmailStatusModule {}
