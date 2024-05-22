import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../core/services/auth.service";
import { InitProvider } from "../initProvider";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private initProvider: InitProvider
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.initProvider.isLoggedIn) {
      return true;
    } else {
      this.authService.userStatus.emit(false);
      sessionStorage.clear();
      if (localStorage.getItem("isApp") != undefined) {
        window.location.href = "http://app.action.logout/";
      } else {
        this.router.navigate(["/login"]);
      }
      return false;
    }
  }
}
