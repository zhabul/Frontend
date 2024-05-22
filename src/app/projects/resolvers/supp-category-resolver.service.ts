import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { SuppliersService } from "src/app/core/services/suppliers.service";

@Injectable({
  providedIn: "root",
})
export class SuppCategoryResolverService implements Resolve<any> {
  constructor(private suppliersService: SuppliersService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.suppliersService
      .getSupp_category();
  }
}
