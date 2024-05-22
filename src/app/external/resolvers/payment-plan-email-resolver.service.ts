import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { PaymentPlanService } from "src/app/core/services/payment-plan.service";

@Injectable({
  providedIn: "root",
})
export class PaymentPlanReplyResolverService implements Resolve<any> {
  constructor(private paymentPlanService: PaymentPlanService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const email = route.params.email;
    const paymentplanID = route.params.paymentplanID;
    const parentPaymentplanId = route.params.parentPaymentplanId;
    const token = route.params.token;
    const CwId = route.params.CwId;
    const group = route.params.group;

    return this.paymentPlanService
      .answerOnPaymentPlanEmail(
        encodeURIComponent(email),
        paymentplanID,
        parentPaymentplanId,
        token,
        CwId,
        group
      );
  }
}
