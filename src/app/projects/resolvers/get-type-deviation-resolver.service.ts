import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { map, Observable } from "rxjs";
import { AtaService } from "../../core/services/ata.service";

@Injectable()
export class GetTypeDevaitionResolverService implements Resolve<any> {
  constructor(private ataService: AtaService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.ataService
      .getTypeDeviations()
      .pipe(map((types) => types["data"]));
  }
}
