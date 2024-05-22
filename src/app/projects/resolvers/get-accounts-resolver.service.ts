import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { GeneralsService } from "src/app/core/services/generals.service";

@Injectable({
  providedIn: "root",
})
export class getAccountsResolverService implements Resolve<any> {
  constructor(private generalsService: GeneralsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.generalsService.getAccounts();
  }
}
