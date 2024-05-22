import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NumberFormatPrognosisDirective } from "./number-format-prognosis.directive";
import { DecimalPipe } from "@angular/common";

@NgModule({
  declarations: [NumberFormatPrognosisDirective],
  imports: [CommonModule],
  exports: [NumberFormatPrognosisDirective],
  providers: [DecimalPipe],
})
export class NumberFormatPrognosisModule {}
