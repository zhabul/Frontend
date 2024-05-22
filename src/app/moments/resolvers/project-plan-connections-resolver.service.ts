import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { MomentsService } from "src/app/core/services/moments.service";

@Injectable()
export class ProjectPlanConnectionsResolverService implements Resolve<any> {
  constructor(private momentService: MomentsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.momentService
      .getProjectPlanConnections(route.params.id || route.parent.params.id);
  }
}
