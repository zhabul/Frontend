import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import * as moment from "moment";
import { Observable } from "rxjs";

@Injectable()
export class getUsersWithMomentsFullMonthService implements Resolve<any> {
  constructor(private timeRegService: TimeRegistrationService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {

    let first_date = '';
    let last_date = '';
    const offset = 0;

    if(route.params.startDate && route.params.endDate) {
      first_date = route.params.startDate;
      last_date = route.params.endDate;
    }else {
      let monthYear = moment(new Date()).format("MM-YYYY");
      first_date = monthYear.split("-")[1] + "-" + monthYear.split("-")[0] + "-01";
      last_date = monthYear.split("-")[1] + "-" + monthYear.split("-")[0] + "-" + moment(new Date()).daysInMonth();
    }

    return this.timeRegService.getUsersWithMoments({
      first_date,
      last_date,
      offset,
      searchValue: '',
      projectId: 0,
      limit: 99999,
      type_id: 0,
      ue_id: 0
    });
  }
}
