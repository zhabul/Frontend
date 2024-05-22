import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { ClientsService } from "src/app/core/services/clients.service";

@Injectable({
  providedIn: "root",
})
export class ClientsResolverService implements Resolve<any> {
  resolve(
    route: import("@angular/router").ActivatedRouteSnapshot,
    state: import("@angular/router").RouterStateSnapshot
  ) {
    return this.clientServices.getClients().subscribe((response) => {
      if (response["status"]) {
        return response["data"] as any;
      }
      return [];
    });
  }

  constructor(private clientServices: ClientsService) {}
}
