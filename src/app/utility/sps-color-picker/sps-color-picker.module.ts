import { NgModule, } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CommonModule } from '@angular/common';
import { SpsColorPickerComponent } from './sps-color-picker.component';
import { GreenCheckSvgModule } from '../svgs/green-check-svg/green-check-svg.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from 'src/app/createTranslateLoader';
import { SpsColorPickerSvgModule } from '../svgs/sps-color-picker-svg/sps-color-picker-svg.module';


@NgModule({
  declarations: [
    SpsColorPickerComponent
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
    SpsColorPickerSvgModule
  ],
  exports: [SpsColorPickerComponent],
})
export class SpsColorPickerModule { }
