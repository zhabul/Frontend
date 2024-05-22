import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { TimeRegistrationService } from "../../core/services/time-registration.service";

@Injectable()
export class getUserSummaryResolverService implements Resolve<any> {
  constructor(private timeRegService: TimeRegistrationService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    let id = route.params.id;
    let date = route.params.date;
    return this.timeRegService
      .getUserSummary(id, date);
  }
}
