import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { InvoicesService } from "../../core/services/invoices.service";

@Injectable()
export class InvoiceResolver implements Resolve<any> {
  constructor(private invoicesService: InvoicesService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.invoicesService.getInvoice(route.params.invoice_id);
  }
}
