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
export class OfferResolverService implements Resolve<any> {
  constructor(private offersService: OffersService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.offersService
      .getOffer(route.params.id);
  }
}
