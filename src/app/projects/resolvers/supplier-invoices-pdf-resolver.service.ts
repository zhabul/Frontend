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
export class supplierInvoicesPdfResolverService implements Resolve<any> {
  constructor(private projectsService: ProjectsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.projectsService
      .getSupplierInvoicesPdfDocuments(route.params.invoice_id)
      .then((invoices) => invoices);
  }
}
