import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { ClientsService } from "../../core/services/clients.service";

@Injectable()
export class ClientDetailsResolverService implements Resolve<any> {
  constructor(private clientsService: ClientsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    return this.clientsService.getClient(route.params.id).toPromise2();
  }
}
