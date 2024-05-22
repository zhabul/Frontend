import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { UsersService } from "../../core/services/users.service";

@Injectable()
export class getUserPermissionsResolver implements Resolve<any> {
  constructor(private usersService: UsersService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {

    const user_id = route.queryParams.userId|| route.params.id || route.parent.params.id;
    return this.usersService.getUserPermissions(user_id);
  }
}
