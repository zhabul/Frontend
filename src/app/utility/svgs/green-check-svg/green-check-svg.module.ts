import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GreenCheckSvgComponent } from './green-check-svg.component';


@NgModule({
  declarations: [
    GreenCheckSvgComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [GreenCheckSvgComponent],
})
export class GreenCheckSvgModule { }
