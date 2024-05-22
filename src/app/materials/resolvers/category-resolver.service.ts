import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { MaterialsService } from "../../core/services/materials.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CategoryResolverService implements Resolve<any> {
  constructor(private materialsService: MaterialsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.materialsService
      .getMaterialCategory(route.params.category_id);
  }
}
