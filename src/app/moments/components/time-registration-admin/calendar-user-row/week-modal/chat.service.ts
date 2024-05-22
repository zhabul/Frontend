import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject, catchError, Observable, of } from "rxjs";
import { BASE_URL } from "../../../../../config";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class ChatService {
  private getLast3Month_chat_by_date_Url: string =
    BASE_URL + "api/timesheet/getLast3Month_chat_by_date";
  private _state$: BehaviorSubject<any> = new BehaviorSubject({});
  public readonly state$: Observable<any> = this._state$.asObservable();
  private _userState$: BehaviorSubject<any> = new BehaviorSubject({});
  public readonly userState$: Observable<any> = this._state$.asObservable();

  
  private _openGallery$: Subject<any> = new Subject();
  public readonly openGallery$: Observable<any> =
      this._openGallery$.asObservable();
  private _filterChatMessages$: Subject<any> = new Subject();
  public readonly filterChatMessages$: Observable<any> =
      this._filterChatMessages$.asObservable();
   

  filterMessagesByWeekId(weekId) {
    this._filterChatMessages$.next(weekId);
  }
  
  setOpenGallery(info:any) {
    this._openGallery$.next(info);
  }

  constructor(private http: HttpClient) {}

  setState(state): void {
    this._state$.next(state);
  }

  get state() {
    return this._state$.getValue();
  }

  setUserState(state): void {
    this._userState$.next(state);
  }

  get userState() {
    return this._userState$.getValue();
  }

  getChat(date, id) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.http
      .get(`${this.getLast3Month_chat_by_date_Url}/${date}/${id}`, {
        headers: headers,
      }).pipe(catchError(() => of({ status: false })));
  }
}
