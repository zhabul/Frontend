import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { OffersService } from 'src/app/core/services/offers.service';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmationModalComponent } from 'src/app/shared/modals/confirmation-modal/confirmation-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-offer-modal',
  templateUrl: './new-offer-modal.component.html',
  styleUrls: ['./new-offer-modal.component.css', '../offer.component.css']
})
export class NewOfferModalComponent implements OnInit {

  @Output('close') close:EventEmitter<any> = new EventEmitter();

  public templates = [];

  public spinner = false;

  constructor(
              private offersService:OffersService,
              private dialog: MatDialog,
              private router: Router
            ) { }

  ngOnInit(): void {
    this.getOffers();
  }

  public offers = [];
  async getOffers() {

    const res:any = await this.offersService.getOfferTemplates();
    this.offers = res.data;
  }

  async createOfferFromTemplate(id) {
    const confirm = await this.onConfirmationModal();
    if (!confirm) return;
    this.spinner = true;
    const res = await this.offersService.createOfferFromTemplate(id);
    const { OfferNum } = res;
    this.spinner = false;
    this.router.navigate(["/offer", OfferNum], { state: { delete: true }});
  }


  onConfirmationModal(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.disableClose = true;
      dialogConfig.width = "185px";
      dialogConfig.panelClass = "mat-dialog-confirmation";
      this.dialog.open(ConfirmationModalComponent, dialogConfig).afterClosed()
        .subscribe((response) => {
          if(response.result) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
    });
  }

  async deleteOffer(id) {
    const confirm = await this.onConfirmationModal();
    if (!confirm) return;
    await this.offersService.deleteOffer(id);
    this.offers = this.offers.filter(offer => offer.id != id);
  }

  closeModal() {
    this.close.emit();
  }
}
