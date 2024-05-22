import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { ScheduleService } from "src/app/core/services/schedule.service";


@Injectable({
  providedIn: 'root'
})
export class GetScheduleProjectWorkingHoursPerDayResolver implements Resolve<any> {
  constructor(private scheduleService: ScheduleService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    var some = this.scheduleService.getScheduleProjectWorkingHoursPerDay(route.params.id);
    return some;
  }
}
