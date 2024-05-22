import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { UsersService } from "src/app/core/services/users.service";

@Injectable({
  providedIn: "root",
})
export class ProjectRoleResolverService implements Resolve<any> {
  constructor(private usersService: UsersService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.usersService.getRoles();
  }
}
