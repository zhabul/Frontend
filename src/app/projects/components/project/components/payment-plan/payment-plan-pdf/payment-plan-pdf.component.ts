import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-payment-plan-pdf",
  templateUrl: "./payment-plan-pdf.component.html",
  styleUrls: ["./payment-plan-pdf.component.css"],
})
export class PaymentPlanPdfComponent implements OnInit {
  @Input() tot = "";
  @Input() arr = "";
  @Input() invoice = "";
  @Input() userData: any = [];
  @Input() project: any;
  @Input() selectedPaymentPlan;
  // @Input() set setSelectedPaymentPlan(value) {
  //   this.selectedPaymentPlan = value;
  // };
  @Input() statuses: any;
  email: any;
  @Input() generals = [];
  public commentSectionStyle = {};

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.generals = this.route.snapshot.data["generals"] || [];
    this.generateGeneralsKeys();
    // this.setCommentSectionStyle();
  }
  ngOnChanges(){
    this.setCommentSectionStyle();
  }

  public generalKeys = {};
  generateGeneralsKeys() {
    this.generals.forEach((general)=>{
      this.generalKeys[general.key] = general.value;
    })
  }

  returnColorBasedOnIndex(index) {
    let backgroundColor = "#F0F0F0";
    if (index % 2 === 0) {
      backgroundColor = "";
    }
    return { backgroundColor: backgroundColor };
  }

  searchForComment() {
    return this.userData[this.selectedPaymentPlan].clientResponses.find(response => response.client_message !== '');
  }

  setCommentSectionStyle() {
    const display = this.searchForComment() ? 'block' : 'none';
    this.commentSectionStyle = { display: display };
  }
}
