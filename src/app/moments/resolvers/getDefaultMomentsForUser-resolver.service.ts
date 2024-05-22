import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { MomentsService } from "src/app/core/services/moments.service";

@Injectable()
export class getDefaultMomentsForUserResolverService implements Resolve<any> {
  constructor(private momentsService: MomentsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.momentsService
      .getDefaultMomentsForUser();
  }
}
