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
export class EditUserResolver implements Resolve<User> {
  constructor(private usersService: UsersService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<User> {
    return this.usersService.getUser(route.params.id);
  }
}
