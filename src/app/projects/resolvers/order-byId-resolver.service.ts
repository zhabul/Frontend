import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { CartService } from "src/app/core/services/cart.service";

@Injectable({
  providedIn: "root",
})
export class OrderByIdResolverService implements Resolve<any> {
  constructor(private cartService: CartService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.cartService.getOrdersById(route.params.id);
  }
}
