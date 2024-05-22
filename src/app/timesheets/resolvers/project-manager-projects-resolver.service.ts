import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";

@Injectable()
export class ProjectManagerProjectsResolver implements Resolve<any> {
  constructor(private timesheetService: TimeRegistrationService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const userId = JSON.parse(sessionStorage.getItem("userDetails"))["user_id"];
    return this.timesheetService.getProjectManagerProjects(userId);
  }
}
