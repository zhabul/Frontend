import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable, map } from "rxjs";
import { AtaService } from "../../core/services/ata.service";

@Injectable()
export class GetTypeAtasResolverService implements Resolve<any> {
  constructor(private ataService: AtaService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.ataService.getTypeAtas().pipe(map((types) => types["data"]));
  }
}
