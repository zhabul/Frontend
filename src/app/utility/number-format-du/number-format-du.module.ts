import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NumberFormatDuDirective } from "./number-format-du.directive";
import { DecimalPipe } from "@angular/common";

@NgModule({
  declarations: [NumberFormatDuDirective],
  imports: [CommonModule],
  exports: [NumberFormatDuDirective],
  providers: [DecimalPipe],
})
export class NumberFormatDuModule {}