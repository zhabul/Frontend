import { Injectable } from "@angular/core";
import { BehaviorSubject, debounceTime } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class OfferDataService {

  private offer_i$: BehaviorSubject<any[]> = new BehaviorSubject([]);
  private lines$: BehaviorSubject<any[]> = new BehaviorSubject([]);
  private offer_t$: BehaviorSubject<any[]> = new BehaviorSubject([]);  
  public offer_i = this.offer_i$.pipe(debounceTime(2000));
  public lines = this.lines$.pipe(debounceTime(2000));
  public offer_t = this.offer_t$.pipe(debounceTime(2000));

  constructor() {}

  nextIntroData(data) {
    this.offer_i$.next(data);
  }
  nextLinesData(data) {
    this.lines$.next(data);
  }
  nextTerminationData(data) {
    this.offer_t$.next(data);
  }

}
