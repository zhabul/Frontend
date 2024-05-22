import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { AtaService } from "../../core/services/ata.service";

@Injectable()
export class AtaMessagesResolverService implements Resolve<any> {
  constructor(private ataService: AtaService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.ataService.getMessages(route.params.ata_id);
  }
}
