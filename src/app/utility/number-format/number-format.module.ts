import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NumberFormatDirective } from "./number-format.directive";
import { DecimalPipe } from "@angular/common";

@NgModule({
  declarations: [NumberFormatDirective],
  imports: [CommonModule],
  exports: [NumberFormatDirective],
  providers: [DecimalPipe],
})
export class NumberFormatModule {}
