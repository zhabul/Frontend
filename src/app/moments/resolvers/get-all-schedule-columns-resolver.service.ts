import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { ScheduleService } from "src/app/core/services/schedule.service";

@Injectable()
export class getAllScheduleColumnsService implements Resolve<any> {
  constructor(private scheduleService: ScheduleService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    return this.scheduleService
      .getAllScheduleColumns(route.params.id || route.parent.params.id)
      .then((columns) => {
        if (columns) {
          return columns;
        }
        return false;
      });;
  }
}
