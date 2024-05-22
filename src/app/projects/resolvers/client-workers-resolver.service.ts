import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { ClientsService } from "../../core/services/clients.service";

@Injectable()
export class ClientWorkersResolverService implements Resolve<any> {
  constructor(private clientsService: ClientsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.clientsService.getClientWorkersFromProject(
      route.params.id || route.parent.params.id
    );
  }
}
