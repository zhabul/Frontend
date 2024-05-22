import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LockIconSvgComponent } from './lock-icon-svg.component';


@NgModule({
  declarations: [
    LockIconSvgComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [LockIconSvgComponent],
})
export class LockIconSvgModule {}
