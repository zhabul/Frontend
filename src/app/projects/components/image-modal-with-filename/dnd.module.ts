import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DndDirective } from "./dnd.directive";


@NgModule({
  declarations: [DndDirective],
  imports: [
    CommonModule
  ],
  exports: [DndDirective],
  providers: [],
})
export class DndModule { }
