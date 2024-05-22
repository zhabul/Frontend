import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { GeneralsService } from "../../core/services/generals.service";

@Injectable()
export class GetGeneralHoursResolverService implements Resolve<any> {
  constructor(private generalsService: GeneralsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    //const user = JSON.parse(sessionStorage.getItem("userDetails"));
    return this.generalsService.getGeneralHours(
      1
    );
  }
}
