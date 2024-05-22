import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { UsersService } from "../../core/services/users.service";
import { User } from "../../core/models/user";

@Injectable()
export class UserBankAccountsResolver implements Resolve<User> {
  constructor(private usersService: UsersService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.usersService
      .getUserBankAccounts(route.params.id);
  }
}
