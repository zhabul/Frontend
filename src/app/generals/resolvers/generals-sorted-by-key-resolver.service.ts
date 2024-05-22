import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { GeneralsService } from "../../core/services/generals.service";

@Injectable()
export class GeneralsSortedByKeyResolver implements Resolve<any> {
  constructor(private generalsService: GeneralsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.generalsService.getAllGeneralsSortedByKey();
  }
}
