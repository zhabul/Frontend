import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { newOffer } from "./utils";

@Injectable()
export class OfferStore {

  private _offers$: BehaviorSubject<any> = new BehaviorSubject([]);
  public readonly offers$: Observable<any> = this._offers$.asObservable();

  constructor() {}

  setOfferState(state): void {
    this._offers$.next(state);
  }

  get state() {
    return this._offers$.getValue();
  }

  setNewOffer() {
    this._offers$.next([newOffer]);
  }

  addNewOffer(offer) {
    const newOffersState = this.state.slice(0);
    newOffersState.push(offer);
    this._offers$.next(newOffersState);
  }


}
