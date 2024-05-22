import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { OffersService } from "../../core/services/offers.service";

@Injectable()
export class OfferResponseResolverService implements Resolve<any> {
  constructor(private offersService: OffersService) {}

  resolve(route: ActivatedRouteSnapshot): Promise<any> {  
    const data = route.params;
    return this.offersService.getOfferForApproval(data);
  }
}
