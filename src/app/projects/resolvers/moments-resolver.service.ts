import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { MomentsService } from "../../core/services/moments.service";

@Injectable()
export class MomentsResolverService implements Resolve<any> {
  constructor(private momentsService: MomentsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.momentsService
      .getMoments(route.params.id || route.parent.params.id);
  }
}
