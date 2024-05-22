import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AddNameModalComponent } from "./add-name-modal.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CloseIconSvgModule } from "../svgs/close-icon-svg/close-icon-svg.module";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { createTranslateLoader } from "../../createTranslateLoader";

@NgModule({
  declarations: [AddNameModalComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild({
        loader: {
          provide: TranslateLoader, 
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      }),
    FormsModule,
    ReactiveFormsModule,
    CloseIconSvgModule
  ],
  exports: [AddNameModalComponent],
  entryComponents: [],
  providers: [],
  bootstrap: [],  
})
export class AddNameModalModule {}
