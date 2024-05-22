import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { FortnoxApiService } from "src/app/core/services/fortnoxApi.service";

@Injectable()
export class GetAllEnabledAccountsResolverService implements Resolve<any> {
  constructor(private fortnoxApi: FortnoxApiService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.fortnoxApi.getAllEnabledAccounts();
  }
}
