import { NgModule, } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CommonModule } from '@angular/common';
import { GreenSelectComponent } from './green-select.component';
import { GreenCheckSvgModule } from '../svgs/green-check-svg/green-check-svg.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from 'src/app/createTranslateLoader';
import { GreenCheckedCircleSvgModule } from '../svgs/green-checked-circle-svg/green-checked-circle-svg.module';
import { GreenUnheckedCircleSvgModule } from '../svgs/green-unchecked-circle-svg/green-unchecked-circle-svg.module';
import { GreenCheckedAllSvgModule } from '../svgs/green-checked-all-svg/green-checked-all-svg.module';


@NgModule({
  declarations: [
    GreenSelectComponent
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
    }), 
    GreenCheckedCircleSvgModule,
    GreenUnheckedCircleSvgModule,
    GreenCheckedAllSvgModule
  ],
  exports: [GreenSelectComponent],
})
export class GreenSelectModule { }
