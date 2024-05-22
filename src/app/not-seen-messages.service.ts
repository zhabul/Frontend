import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BASE_URL } from "./config";
import { catchError, of } from "rxjs";

@Injectable()
export class NotSeenMessagesService {

private headers: HttpHeaders;
  private countAllNotSeenMessagesUrl: string =
    BASE_URL + "api/timesheet/countAllNotSeenMessages";
  private _messageCount$: BehaviorSubject<Number> = new BehaviorSubject(0);
  public readonly messageCount$: Observable<any> = this._messageCount$.asObservable();

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
      });
  }

  setNumberCount(count): void {
    this._messageCount$.next(count);
  }

  getNotSeenMessages() {

    this.http
      .get(`${this.countAllNotSeenMessagesUrl}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })))
      .toPromise2().then((res: { count: Number })=>{
          this.setNumberCount(res.count);
      });
  }
}
