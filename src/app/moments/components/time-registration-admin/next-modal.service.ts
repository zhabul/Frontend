import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class NextModalService {

  clickedOnNextButton$ = new Subject<number>();
  nextModalIndex = new BehaviorSubject<number>(0);

  constructor() {}

}
