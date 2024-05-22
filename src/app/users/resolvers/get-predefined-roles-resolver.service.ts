import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { UsersService } from "../../core/services/users.service";
import { User } from "../../core/models/user";

@Injectable()
export class GetPredefinedRolesResolver implements Resolve<User> {
  constructor(private usersService: UsersService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<User> {
    return this.usersService.getPredefinedRoles(route.params.id);
  }
}
