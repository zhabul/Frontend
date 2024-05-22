import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { SuppliersService } from "src/app/core/services/suppliers.service";

@Injectable()
export class ProjectMaterialSuppliersResolverService implements Resolve<any> {
  constructor(private suppliersService: SuppliersService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.suppliersService.getProjectMaterialSupplier(
      route.parent.params.id
    );
  }
}
