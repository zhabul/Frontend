import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { CartService } from "src/app/core/services/cart.service";

@Injectable()
export class OrdersResolverService implements Resolve<any> {
  constructor(private cartService: CartService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.cartService.getOrders();
  }
}
