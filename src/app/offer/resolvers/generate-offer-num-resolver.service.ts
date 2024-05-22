import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { OffersService } from "src/app/core/services/offers.service";

@Injectable({
  providedIn: "root",
})
export class GenerateOfferNumberResolverService implements Resolve<any> {
  constructor(private offersService: OffersService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.offersService.getNextOfferNumber();
  }
}
