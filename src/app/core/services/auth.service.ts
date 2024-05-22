import { EventEmitter, Injectable, Output } from "@angular/core";
import { catchError, Observable, of, Subject } from "rxjs";
import { BASE_URL } from "../../config/index";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UsersService } from "./users.service";
import 'src/app/core/extensions/rxjs-observable-promise';

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private loginUrl: string = BASE_URL + "api/auth/login";
  private checkUrl: string = BASE_URL + "api/auth/check";
  private logoutUrl: string = BASE_URL + "api/auth/logout";
  private forgotPasswordUrl: string = BASE_URL + "api/user/forgot_password";
  private restartPasswordUrl: string = BASE_URL + "api/user/restart_password";
  private reset_timer = new Subject<any>();
  private resetPasswordUrl: string = BASE_URL + "api/user/reset_password";
  private getOldPasswordsUrl: string = BASE_URL + "api/user/getOldPasswords";
  private changePasswordUrl: string = BASE_URL + "api/user/changePassword";
  private checkPermissionForUpdatePasswordUrl: string =
    BASE_URL + "api/user/checkPermissionForUpdatePassword";
  private getUserForSetupDetailsUrl: string =
    BASE_URL + "api/user/getUserForSetupDetails";

  private headers: HttpHeaders;

  public projectsRoute = "projects";
  public setUserLoginTimeUrl: string = BASE_URL + "api/user/setUserLoginTime";
  private getUserCompaniesUrl: string = BASE_URL + "api/user/getUserCompanies";
  private updateUserCompanyUrl: string = BASE_URL + "api/user/updateUserCompany";
  
  @Output() userStatus: EventEmitter<boolean> = new EventEmitter();

  constructor(private http: HttpClient, private userService: UsersService) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest",
    });
  }

  public getAuthUser(): Promise<any> {
    return this.http
    .get(this.checkUrl, { headers: this.headers })
    .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  public loginUser(email: string, password: string, lang: string) {
    return this.http
      .post(
        this.loginUrl,
        "email=" + email + "&password=" + password + "&lang=" + lang,
        { headers: this.headers }
      )
      .pipe(catchError(() => of({ status: false })));
  }

  public logoutUser(): Promise<any> {
    return this.http
      .post(this.logoutUrl, "", { headers: this.headers })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  public forgotPassword(data) {
    return this.http
      .post(this.forgotPasswordUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public restartPassword(data) {
    return this.http
      .post(this.restartPasswordUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public triggerLogout(val: boolean) {
    this.userStatus.emit(val);
  }

  public setProjectRoute() {
    this.projectsRoute = "projects";
    const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

    if (userDetails.type != "1" && userDetails.type != "2") {
      this.userService
        .getCurrentUserProject(userDetails.user_id)
        .subscribe((res) => {
          if (res["status"] && res["data"]) {
            this.projectsRoute = "projects/view/" + res["data"]["ProjectID"];
          } else {
            this.projectsRoute = null;
          }
        });
    }
  }

  public setResetTimer(status = false) {
    this.reset_timer.next(status);
  }

  public getTimerStatus(): Observable<any> {
    return this.reset_timer.asObservable();
  }

  public resetPassword(data) {
    return this.http
      .post(this.resetPasswordUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public getOldPasswords(user_id) {
    return this.http
      .get(`${this.getOldPasswordsUrl}/${user_id}`, { headers: this.headers })
      .pipe(catchError(() => []));
  }

  public changePassword(data) {
    return this.http
      .post(this.changePasswordUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public checkPermissionForUpdatePassword(user_id, token) {
    return this.http
      .get(`${this.checkPermissionForUpdatePasswordUrl}/${user_id}/${token}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => []));
  }

  public getUserForSetupDetails(email, token) {
    return this.http
      .get(`${this.getUserForSetupDetailsUrl}/${email}/${token}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => []));
  }

  public setUserLoginTime() {
    return this.http
      .post(this.setUserLoginTimeUrl, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));    
  }

  public getUserCompanies() {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getUserCompaniesUrl}`, {
        headers: headers,
      })
      .toPromise2()
      .then((response) => response)
      .catch((err) => {
        return [];
      });    
  }

  public updateUserCompany(data) {

    return this.http
      .post(this.updateUserCompanyUrl, data, { headers: this.headers })
      .toPromise2();
  }
}
