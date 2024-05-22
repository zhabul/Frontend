import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { ClientsService } from "../../core/services/clients.service";

@Injectable()
export class ClientsResolver implements Resolve<any> {
  constructor(private clientsService: ClientsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.clientsService.getClients(1);
  }
}
