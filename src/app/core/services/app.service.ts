import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AppService {
  private showAddButton: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private currentAddButtonRoute: BehaviorSubject<string> =
    new BehaviorSubject<string>("/");
  private backButtonRoute: BehaviorSubject<string> =
    new BehaviorSubject<string>("/");

  constructor() {}

  get getShowAddButton() {
    return this.showAddButton.asObservable();
  }

  set setShowAddButton(newShowCartIconValue) {
    this.showAddButton.next(newShowCartIconValue);
  }

  get getAddRoute() {
    return this.currentAddButtonRoute.asObservable();
  }

  setAddRoute(route) {
    this.currentAddButtonRoute.next(route);
  }

  get getBackRoute() {
    return this.backButtonRoute.asObservable();
  }

  setBackRoute(route) {
    this.backButtonRoute.next(route);
  }
}
