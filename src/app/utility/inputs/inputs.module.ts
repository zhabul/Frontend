import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileFormatComponent } from './mobile-format/mobile-format.component';


@NgModule({
  declarations: [
	MobileFormatComponent
  ],
  imports: [
    CommonModule
  ],
  exports:  [
	MobileFormatComponent
  ]
})
export class InputsModule { }
