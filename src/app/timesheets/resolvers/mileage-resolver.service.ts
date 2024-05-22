import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { TimeRegistrationService } from "../../core/services/time-registration.service";

@Injectable()
export class MileagesResolver implements Resolve<any> {
  constructor(private timeRegistrationService: TimeRegistrationService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    return this.timeRegistrationService
      .getMileages(userDetails.user_id);
  }
}
