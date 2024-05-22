import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { UsersService } from "../../core/services/users.service";

@Injectable({
  providedIn: "root",
})
export class UsersResolver implements Resolve<any> {
  constructor(private usersService: UsersService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    return this.usersService.getUsers(0).toPromise2().then((users) => {
      users;
    });
  }
}
