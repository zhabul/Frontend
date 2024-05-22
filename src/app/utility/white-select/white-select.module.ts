import { NgModule, } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CommonModule } from '@angular/common';
import { WhiteSelectComponent } from './white-select.component';
import { GreenCheckSvgModule } from '../svgs/green-check-svg/green-check-svg.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from 'src/app/createTranslateLoader';


@NgModule({
  declarations: [
    WhiteSelectComponent
  ],
  imports: [
    CommonModule,
    GreenCheckSvgModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    })
  ],
  exports: [WhiteSelectComponent],
})
export class WhiteSelectModule { }
