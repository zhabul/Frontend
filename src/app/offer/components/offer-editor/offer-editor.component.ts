import { Component, OnDestroy, OnInit } from '@angular/core';
import { OfferStore } from './service/offer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OffersService } from "src/app/core/services/offers.service";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-offer-editor',
  templateUrl: './offer-editor.component.html',
  styleUrls: ['./offer-editor.component.css']
})
export class OfferEditorComponent implements OnInit, OnDestroy {

  public offers = [];
  public activeOffer = -1;
  public showOffers = false;
  public id;

  constructor(
      private offerStore:OfferStore,
      private route:ActivatedRoute,
      private offersService: OffersService,
      private router: Router,
      private toastr: ToastrService,
      private translate: TranslateService,
    ) { }

  ngOnInit(): void {
    this.initOffer();
  }

  ngOnDestroy() {
    this.unsubFromOfferState();
  }

  async initOffer() {
    await this.resolveOfferEditor();
    this.subToOffersState();
  }

  async resolveOfferEditor() {
    const snapshot = this.route.snapshot;
    this.id = snapshot.paramMap.get('id');
    let active = snapshot.queryParamMap.get('active');
        active = active ? active : '0';
    if (this.id === null) {
      this.activeOffer = 0;
      await this.offerStore.setNewOffer();
    } else {
      if (!this.offers.length) {
       const data = await this.offersService.getOffer(this.id);
        if (data.length) {
          this.offerStore.setOfferState(data);
        } else {
          this.toastr.error(
            this.translate.instant(`Offer doesn't exist.`),
            this.translate.instant("Error")
          );
          this.router.navigate(["/offer"]);
        }

      } else {
        this.activeOffer = 0;
      }
    }
    return true;
  }

  public offersSub;
  subToOffersState() {
    this.offersSub = this.offerStore.offers$.subscribe((offers)=>{
      this.offers = offers.slice(0);
      this.showOffers = true;
    });
  }

  unsubFromOfferState() {
    if (this.offersSub) {
      this.offersSub.unsubscribe();
    }
  }
}
