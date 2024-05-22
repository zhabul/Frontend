import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { createTranslateLoader } from "../../../../createTranslateLoader";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { LineArticleComponent } from './line-article.component';
import { NumberFormatModule } from "src/app/utility/number-format/number-format.module";
import { DeleteIconSvgModule } from "src/app/utility/svgs/delete-icon-svg/delete-icon-svg.module";
import { MoreDotsSvgModule } from "src/app/utility/svgs/more-dots-svg/more-dots-svg.module";
import { InsertRowModalModule } from "src/app/utility/insert-row-modal/insert-row-modal.module";
import { AddIconSvgModule } from 'src/app/utility/svgs/add-icon-svg/add-icon-svg.module';
import { TabModule } from "src/app/shared/directives/tab/tab.module";

@NgModule({
  declarations: [LineArticleComponent],
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
    MatProgressSpinnerModule,
    NumberFormatModule,
    DeleteIconSvgModule,
    MoreDotsSvgModule,
    InsertRowModalModule,
    AddIconSvgModule,
    TabModule
  ],
  exports: [LineArticleComponent],
  entryComponents: [],
  providers: [],
  bootstrap: [],
})
export class LineArticleModule {}
