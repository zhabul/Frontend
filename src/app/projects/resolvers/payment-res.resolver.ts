import { Injectable } from "@angular/core";
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { PaymentPlanService } from "../../core/services/payment-plan.service";

@Injectable({
  providedIn: "root",
})
export class PaymentRes implements Resolve<any> {
  constructor(private http: PaymentPlanService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.http.getProjectData(+route.params["id"]);
  }
}
