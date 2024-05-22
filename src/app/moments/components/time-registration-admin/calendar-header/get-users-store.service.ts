import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
 
@Injectable()
export class GetUsersStore {
  private _params$: Subject<any> = new Subject();
  public readonly params$: Observable<any> = this._params$.asObservable();
  constructor() {}
  setParams(state): void { 
    this._params$.next(state);
  }
}