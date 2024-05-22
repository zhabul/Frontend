import { Injectable } from "@angular/core";
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from "@angular/router";
import { MaterialsService } from "src/app/core/services/materials.service";
import { Observable } from "rxjs";

@Injectable()
export class SubcategoryResolverService implements Resolve<any> {
  constructor(private materialsService: MaterialsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    const projectId = JSON.parse(sessionStorage.getItem("orderData"))[
      "projectId"
    ];

    return this.materialsService.getSubCategoriesInOrder(
      route.params.category_id,
      projectId
    );
  }
}
