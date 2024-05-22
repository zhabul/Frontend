import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { OrdersService } from "src/app/core/services/orders.service";

@Injectable()
export class GetOrderResolverService implements Resolve<any> {
  constructor(private ordersService: OrdersService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.ordersService.getOrder(route.params.id);
  }
}