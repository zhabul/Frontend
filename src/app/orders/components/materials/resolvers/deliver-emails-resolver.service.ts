import { CartService } from "src/app/core/services/cart.service";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve,
} from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class DeliverEmailResolverService implements Resolve<any> {
  constructor(private cartService: CartService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.cartService.getEmails();
  }
}
