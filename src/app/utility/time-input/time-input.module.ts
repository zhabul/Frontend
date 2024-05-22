import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeInputComponent } from './time-input.component';


@NgModule({
  declarations: [
    TimeInputComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [TimeInputComponent],
})
export class TimeInputModule { }
