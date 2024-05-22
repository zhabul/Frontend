import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserOptionsService {
  public userDetailsConfig: BehaviorSubject<any> = new BehaviorSubject<any>(0);

  constructor() {}
}
