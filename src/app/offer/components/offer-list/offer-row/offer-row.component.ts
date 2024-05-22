import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { setEmailStatus } from 'src/app/utility/component-email-status/utils';
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: 'app-offer-row',
  templateUrl: './offer-row.component.html',
  styleUrls: ['./offer-row.component.css']
})
export class OfferRowComponent implements OnInit {

  @Input('offer') offer;

  public color = '#f7f3cf';
  public status = this.translate.instant('Draft');
  public date = '';
  public link = '';
  public expiredDate;

  constructor(
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.setColorAndText();
    this.setLink();
  }

  setLink() {
    this.link = `/#/offer/${this.offer.id}`;
  }

  setColorAndText() {
    const status = this.offer.status;
    const sent = this.offer.sent;
    const logs = status === null ? [] : [{ Status: status, date: sent}];
    const { color, statusText, date } = setEmailStatus(logs, true);
    this.color = color;
    this.status = statusText;
    this.date = date;
    this.expiredDate = moment(this.offer.StartDate).add(this.offer.ValidityPeriod, "days").format("YYYY-MM-DD");
  }

}
