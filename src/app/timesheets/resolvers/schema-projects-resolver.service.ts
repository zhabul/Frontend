import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import * as moment from "moment";

@Injectable()
export class SchemaProjectsResolver implements Resolve<any> {
  constructor(private timesheetService: TimeRegistrationService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    const userId = JSON.parse(sessionStorage.getItem("userDetails"))["user_id"];
    let monthYear = moment().format("MM-YYYY");
    let first_date =
      monthYear.split("-")[1] + "-" + monthYear.split("-")[0] + "-01";
    let last_date =
      monthYear.split("-")[1] +
      "-" +
      monthYear.split("-")[0] +
      "-" +
      moment(first_date).daysInMonth();
    return this.timesheetService.getSchemaProjects(
      userId,
      first_date,
      last_date
    );
  }
}
