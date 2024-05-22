import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { ProjectsService } from "src/app/core/services/projects.service";

@Injectable({
  providedIn: "root",
})
export class GetSupplierInvoiceRowsResolverService implements Resolve<any> {
  constructor(private projectsService: ProjectsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.projectsService
      .getSupplierInvoiceRows(route.params.invoice_id, route.params.id, 0)
      .then((invoices) => invoices);
  }
}
