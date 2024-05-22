import { Injectable } from "@angular/core";
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from "@angular/router";
import { MaterialsService } from "src/app/core/services/materials.service";

@Injectable({
  providedIn: "root",
})
export class SubcategoryResolverService implements Resolve<any> {
  constructor(private materialsService: MaterialsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.materialsService
      .getSubCategory(route.params.category_id);
  }
}
