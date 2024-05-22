import { Injectable } from "@angular/core";
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from "@angular/router";
import { SuppliersService } from "src/app/core/services/suppliers.service";

@Injectable({
  providedIn: "root",
})
export class SupplierCategoryResolverService implements Resolve<any> {
  constructor(private suppliersService: SuppliersService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.suppliersService
      .getProjectCategorySuppliers(route.params.id);
  }
}
