import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpsColorPickerSvgComponent } from './sps-color-picker-svg.component';


@NgModule({
  declarations: [
    SpsColorPickerSvgComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [SpsColorPickerSvgComponent],
})
export class SpsColorPickerSvgModule { }
