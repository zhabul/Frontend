import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { TimeRegistrationService } from "../../core/services/time-registration.service";

@Injectable()
export class UserDetailsTimesheetResolverService implements Resolve<any> {
  constructor(private timeRegService: TimeRegistrationService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.timeRegService
      .getHoursByUserForCurrentMonth(route.params.id, 0, 0);
  }
}
