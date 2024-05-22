import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { UsersService } from "src/app/core/services/users.service";

@Injectable()
export class getUserPermissionAtaResolverService implements Resolve<any> {
  constructor(private usersService: UsersService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.usersService.getUserPermission(
      "Ata",
      route.params.ata_id || route.params.id
    );
  }
}
