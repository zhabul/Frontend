import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BASE_URL } from "src/app/config";

@Injectable({
  providedIn: "root",
})
export class UserNameService {
  private seenAllUserMessagesUrl: string =
    BASE_URL + "api/timesheet/seenAllUserMessages";

  private headers: HttpHeaders;
  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest",
    });
  }

  seenAllUserMessages(userId: number) {
    return this.http.get(
      `${this.seenAllUserMessagesUrl}/${userId}`,
      {headers: this.headers}
    );
  }
}
