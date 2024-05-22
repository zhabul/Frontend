import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { createTranslateLoader } from "../../createTranslateLoader";
import { InsertRowModalComponent } from './insert-row-modal.component';


@NgModule({ 
  declarations: [InsertRowModalComponent],
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
  exports: [InsertRowModalComponent],
  entryComponents: [],
  providers: [],
  bootstrap: [],
})
export class InsertRowModalModule {}
