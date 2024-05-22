import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { UsersService } from "../../core/services/users.service";

@Injectable()
export class CurrentUserProjectTimesheetsResolver implements Resolve<any> {
  constructor(private usersService: UsersService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    return this.usersService
      .getCurrentUserProject(userDetails.user_id);
  }
}
