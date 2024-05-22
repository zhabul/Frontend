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
export class getSupplierInvoiceResolverService implements Resolve<any> {
  constructor(private projectsService: ProjectsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.projectsService
      .getSupplierInvoice(
        route.params.invoice_id,
        route.params.selected_tab,
        route.params.sir_id
      )
      .then((invoice) => invoice);
  }
}
