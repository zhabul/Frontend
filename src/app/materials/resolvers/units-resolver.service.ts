import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve,
} from "@angular/router";
import { Injectable } from "@angular/core";
import { MaterialsService } from "src/app/core/services/materials.service";
import { Observable } from "rxjs";

@Injectable()
export class UnitsResolverService implements Resolve<any> {
  constructor(private materialsService: MaterialsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.materialsService.getAllUnits();
  }
}
