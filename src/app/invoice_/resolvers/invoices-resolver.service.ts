import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { InvoicesService } from "../../core/services/invoices.service";

@Injectable()
export class InvoicesResolver implements Resolve<any> {
  constructor(private invoicesService: InvoicesService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.invoicesService.getInvoices(1);
  }
}
