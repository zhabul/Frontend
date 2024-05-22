import { Observable } from "rxjs";

export interface CanDeactivateComp {
  canDeactivate: () => boolean | Observable<boolean>;
}
