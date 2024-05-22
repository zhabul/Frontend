import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { OffersService } from "src/app/core/services/offers.service";

@Injectable({
  providedIn: "root",
})
export class OffersResolverService implements Resolve<any> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.offersService
      .getOffers();
  }

  constructor(private offersService: OffersService) {}
}
