import { Injectable } from "@angular/core";
import { Subject, BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class ColumnStateStore {
  private _state$: BehaviorSubject<any> = new BehaviorSubject({
    boundaries: {},
    scrollLeft: 0,
    calendar: [],
    calendarSpan: {},
  });
  public readonly state$: Observable<any> = this._state$.asObservable();
  private _userState$: BehaviorSubject<any> = new BehaviorSubject({});
  public readonly userState$: Observable<any> = this._userState$.asObservable();
  private _closeModals$: Subject<Number> = new Subject();
  public readonly closeModals$: Observable<any> =
    this._closeModals$.asObservable();
  private _openModalFromChat$: Subject<any> = new Subject();
  public readonly openModalFromChat$: Observable<any> =
    this._openModalFromChat$.asObservable();
  public readonly openGalleryt$: Observable<any> =
    this._openModalFromChat$.asObservable();

    
  constructor() {}

  setState(state): void {
    this._state$.next(state);
  }

  get state() {
    return this._state$.getValue();
  }

  setUserState(state): void {
    this._userState$.next(state);
  }

  closeModals(userId): void {
    this._closeModals$.next(userId);
  }

  openModalFromChat(info: { userId: any; day: any, index: number }): void {
    this._openModalFromChat$.next(info);
  }

  get userState() {
    return this._userState$.getValue();
  }
}
