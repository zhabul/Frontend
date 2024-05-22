import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { ScheduleService } from "src/app/core/services/schedule.service";
import { PlannedAbsence } from "../project-moments-schedule-planer/project-schedule-planer-canvas/resource-project-schedule-planer/models/PlannedAbsence";

@Injectable()
export class GetAllPlanedScheduleAbsencesResolverService
  implements Resolve<PlannedAbsence[]>
{
  constructor(private scheduleService: ScheduleService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    return this.scheduleService
      .getAllPlanedScheduleAbsences(route.params.id || route.parent.params.id)
      .then((absence) => {
        if (absence) {
          return absence;
        } 
        return false;
      });
  }

  
}
