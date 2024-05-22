import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { ScheduleService } from "src/app/core/services/schedule.service";

@Injectable()
export class getAllScheduleRevisionByProjectsService implements Resolve<any> {
  constructor(private scheduleService: ScheduleService) {}


  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    return this.scheduleService
      .getAllScheduleRevisionByProject(route.params.id || route.parent.params.id)
      .then((revision) => {
        if (revision) {
          return revision;
        } 
        return false;
      });
  }
}
