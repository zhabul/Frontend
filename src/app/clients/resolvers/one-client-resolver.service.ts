import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { ClientsService } from "../../core/services/clients.service";

@Injectable()
export class OneClientResolverService implements Resolve<any> {
  constructor(private clientsService: ClientsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.clientsService.getOneClient(route.params.id);
  }
}
