import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-offer-list-sum",
  templateUrl: "./offer-list-sum.component.html",
  styleUrls: ["./offer-list-sum.component.css"],
})
export class OfferListSumComponent implements OnInit {
  constructor() {}
  @Input() totalSum = 0;
  ngOnInit(): void {
  }
}
