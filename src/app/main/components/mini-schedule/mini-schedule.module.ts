import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiniScheduleComponent } from './mini-schedule.component';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { createTranslateLoader } from "../../../createTranslateLoader";
import { HttpClient } from "@angular/common/http";

@NgModule({
  declarations: [
    MiniScheduleComponent
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
  ],
  exports: [MiniScheduleComponent],
})
export class MiniScheduleModule {}
