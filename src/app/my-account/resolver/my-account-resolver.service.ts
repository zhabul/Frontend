import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { UsersService } from "../../core/services/users.service";
import { User } from "../../core/models/user";
import { Observable } from "rxjs";

@Injectable()
export class MyAccountUserResolver implements Resolve<User> {
  constructor(private usersService: UsersService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<User> {
    const id = JSON.parse(sessionStorage.getItem("userDetails")).user_id;
    return this.usersService.getUser(id);
  }
}
