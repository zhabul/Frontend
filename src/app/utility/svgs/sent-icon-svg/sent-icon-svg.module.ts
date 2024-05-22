import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SentIconSvgComponent } from './sent-icon-svg.component';


@NgModule({
  declarations: [
    SentIconSvgComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [SentIconSvgComponent],
})
export class SentIconSvgModule { }
