import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { MaterialsService } from "../../core/services/materials.service";

@Injectable()
export class CategoriesResolverService implements Resolve<any> {
  constructor(
    private materialsService: MaterialsService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    const orderData = JSON.parse(sessionStorage.getItem("orderData"));
    const projectId = orderData ? orderData["projectId"] : false;

    return projectId
      ? this.materialsService.getCategoriesInOrder(projectId)
      : this.router.navigate(["/projects"]);
  }
}
