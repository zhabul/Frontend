import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckinSvgComponent } from './checkin-svg/checkin-svg.component';
import { CheckoutSvgComponent } from './checkout-svg/checkout-svg.component';


@NgModule({
  declarations: [
    CheckinSvgComponent,
    CheckoutSvgComponent

  ],
  imports: [
    CommonModule
  ],
  exports: [CheckinSvgComponent,CheckoutSvgComponent],
})
export class CheckinCheckoutModule { }
