import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { BASE_URL } from "src/app/config";

@Injectable({
  providedIn: "root",
})
export class ErrorHandlerService {
  public errorEvent: Subject<Error> = new Subject<any>();

  constructor(private http: HttpClient) {}

  handleError(err: Error) {
    if (!localStorage.getItem("logFrontend")) {
      const userDetails = sessionStorage.getItem("userDetails");

      let userInfo = null;

      if (userDetails) {
        userInfo = {
          user_id: userDetails["user_id"],
          email: userDetails["email"],
        };
      }

      const errorObject = {
        name: err.name,
        message: err.message,
        stack: err.stack,
        url: window.location.href,
        user: userInfo,
      };

      const headers = new HttpHeaders();
      headers.append("X-Requested-With", "XMLHttpRequest");
      headers.append("Content-Type", "application/x-www-form-urlencoded");

      this.http
        .post(BASE_URL + "api/logError", errorObject, { headers: headers })
        .subscribe((_) => {});
    }

    console.error(err);
  }
}
