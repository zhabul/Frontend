import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CronService {
  private ataUrl = new Subject<any>();
  private atestUrl = new Subject<any>();

  setObject(object) {
    this.ataUrl.next(object);
  }

  getObject() {
    return this.ataUrl.asObservable();
  }

  setAtest(object) {
    this.atestUrl.next(object);
  }

  getAtest() {
    return this.atestUrl.asObservable();
  }

  refreshSubscriber() {
    this.ataUrl.unsubscribe();
  }
}
