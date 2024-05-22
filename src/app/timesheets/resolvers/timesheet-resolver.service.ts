import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { TimeRegistrationService } from "../../core/services/time-registration.service";
import * as moment from "moment";

@Injectable()
export class TimesheetResolverService implements Resolve<any> {
  constructor(private timeRegService: TimeRegistrationService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    let monthYear = moment().format("MM-YYYY");
    let first_date =
      monthYear.split("-")[1] + "-" + monthYear.split("-")[0] + "-01";
    let last_date =
      monthYear.split("-")[1] +
      "-" +
      monthYear.split("-")[0] +
      "-" +
      moment(first_date).daysInMonth();

    return this.timeRegService
      .setTimesheetsToCalendar(first_date, last_date);
  }
}
