import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { MomentsService } from "src/app/core/services/moments.service";

@Injectable()
export class excuteMomentCronResolverService implements Resolve<any> {
  constructor(private momentService: MomentsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return this.momentService.excuteCronTask();
  }
}
