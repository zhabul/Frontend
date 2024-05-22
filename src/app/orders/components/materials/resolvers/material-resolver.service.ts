import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve,
} from "@angular/router";
import { Observable } from "rxjs";
import { MaterialsService } from "src/app/core/services/materials.service";

@Injectable({
  providedIn: "root",
})
export class MaterialResolverService implements Resolve<any> {
  constructor(private materialsService: MaterialsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.materialsService
      .getMaterial(route.params.id);
  }
}
