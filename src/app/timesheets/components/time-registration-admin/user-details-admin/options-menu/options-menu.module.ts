import { NgModule, } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from 'src/app/createTranslateLoader';
import { OptionsMenuComponent } from './options-menu.component';
import { ThreeDotsSvg2Module } from 'src/app/utility/svgs/three-dots-svg2/three-dots-svg2.module';
import { ArrowUpSvg2Module } from 'src/app/utility/svgs/arrow-up-svg2/arrow-up-svg2.module';
import { ArrowDownSvg2Module } from 'src/app/utility/svgs/arrow-down-svg2/arrow-down-svg2.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    OptionsMenuComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    ThreeDotsSvg2Module,
    ArrowUpSvg2Module,
    ArrowDownSvg2Module,
    RouterModule
  ],
  exports: [OptionsMenuComponent],
})
export class OptionsMenuModule { }
