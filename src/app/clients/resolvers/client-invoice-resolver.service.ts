import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { ClientsService } from "../../core/services/clients.service";

@Injectable()
export class ClientInvoiceResolverService implements Resolve<any> {
  constructor(private clientsService: ClientsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.clientsService.getOneClientInvoice(route.params.id).toPromise2();
  } 
}
