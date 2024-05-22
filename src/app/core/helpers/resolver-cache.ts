import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { ReplaySubject, first } from "rxjs";

export class ResolverCache<T1> implements Resolve<T1> {
  timestamp = -1;
  onlyOne = false;
  hasValue = false;

  subject = new ReplaySubject<T1>();

  constructor(
    private calable: (
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ) => Promise<T1>,
    private time: number = 0
  ) {
    this.onlyOne = this.time == 0;
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): T1 | import("rxjs").Observable<T1> | Promise<T1> {
    const td = new Date().getTime() - this.timestamp;

    if ((this.onlyOne && !this.hasValue) || (!this.onlyOne && td > this.time)) {
      this.timestamp = new Date().getTime();
      this.hasValue = true;
      this.calable(route, state)
        .then((nr) => this.subject.next(nr))
        .catch(() => this.subject.next(null));
    }

    return this.subject.pipe(first());
  }
}
