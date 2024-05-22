import { Injectable } from "@angular/core";
import { AuthService } from "./core/services/auth.service";
import { ComponentAccessService } from "./core/services/component-access.service";
import {Router} from "@angular/router";
import { AESEncryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';

@Injectable()
export class InitProvider {
  private _isLoggedIn = false;
  private _componentAccess = {};

  constructor(
    private authService: AuthService,
    private componentAccessService: ComponentAccessService,
    private router: Router,
    private AESEncryptDecryptService: AESEncryptDecryptService
  ) {}

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  set setLoggedIn(val) {
    this._isLoggedIn = val;
  }

  hasComponentAccess(key): boolean {
    return this._componentAccess[key];
  }

  logout() {

    this.clearStatusObjects();
    this.authService.logoutUser().then((res) => {
      sessionStorage.removeItem("userDetails");
      sessionStorage.removeItem("selectedTabDeviation");
      this._isLoggedIn = false;
      if (localStorage.getItem("isApp") != undefined) {
        window.location.href = "http://app.action.logout/";
      } else {
        this.router.navigate(["/login"]);
      }
    });
  }

  clearStatusObjects() {
    localStorage.removeItem("statusObjectPrognosis");
    localStorage.removeItem("statusObjectExternal");
    localStorage.removeItem("statusObjectInternal");
  }

  load() {
    return new Promise((resolve, reject) => {
      Promise.all([
        new Promise<void>((_resolve, _reject) => {
          this.authService.getAuthUser().then((res) => {

          if(res["opts"] && res["opts"]['logout_immediately']) {
            this.logout();
          }

            this._isLoggedIn = res["status"];
            if (res["status"]) {

                res['opts'].role_name = this.AESEncryptDecryptService.sha256(res['opts'].role_name);
                sessionStorage.setItem(
                    "userDetails",
                    JSON.stringify(res["opts"])
                );
                sessionStorage.setItem("lang", res["opts"].language);
                sessionStorage.setItem("roleName", JSON.stringify(res['opts'].role_name));
                sessionStorage.setItem("currency", JSON.stringify(res['currency']));
            }
            _resolve();
          });
        }),
        new Promise<void>((_resolve, _reject) => {
          this.componentAccessService.getComponentVisibility().subscribe((res) => {
            _resolve();
            if (res["data"]) {
              this._componentAccess = res["data"];
            }
          });
        }),
      ]).then((res) => {
        resolve(true);
      });
    });
  }
}
