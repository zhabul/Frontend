import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { AtaService } from "src/app/core/services/ata.service";

@Injectable({
  providedIn: "root",
})
export class AtaReplyResolverService implements Resolve<any> {
  constructor(private ataService: AtaService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const email = route.params.email;
    const ataID = route.params.ataId;
    const messageID = route.params.id;
    const token = route.params.token;
    const CwId = route.params.cwId;
    const group = route.params.group;

    return this.ataService.answerOnAtaEmail(
      encodeURIComponent(email),
      ataID,
      messageID,
      token,
      CwId,
      group
    );
  }
}
