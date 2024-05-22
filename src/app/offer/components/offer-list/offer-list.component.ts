import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.css', './offer-row/offer-row.component.css']
})
export class OfferListComponent implements OnInit {

  @Input() offers = false;
  @Input() totalSum = 0;
  constructor() { }

  ngOnInit(): void {
    

  }

}
