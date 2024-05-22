import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { ScheduleService } from "src/app/core/services/schedule.service";

@Injectable({
  providedIn: 'root'
})
export class ScheduleGetPlanState implements Resolve<any> {
  constructor(private scheduleService: ScheduleService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    var some = this.scheduleService.getSchedulePlanState(route.params.id).then(plans => plans);
    return some;
  }
}
