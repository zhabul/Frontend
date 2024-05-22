import { firstValueFrom } from "rxjs";
import { Observable } from "rxjs/internal/Observable";

declare module "rxjs/internal/Observable" {
  interface Observable<T> {
    toPromise2(this: Observable<T>): Promise<T>;
  }
}

function toPromise2<T>(this: Observable<T>) {
  return firstValueFrom(this);
}

Observable.prototype.toPromise2 = toPromise2;