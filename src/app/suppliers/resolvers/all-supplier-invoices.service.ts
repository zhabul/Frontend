import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { map, Observable } from "rxjs";
import { SuppliersService } from "src/app/core/services/suppliers.service";

@Injectable()
export class GetAllSupplierInvoicesService implements Resolve<any> {
  constructor(private suppliersService: SuppliersService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.suppliersService
      .getAllSupplierInvoices(1)
      .pipe(map(res => res["data"]));
  }
}
