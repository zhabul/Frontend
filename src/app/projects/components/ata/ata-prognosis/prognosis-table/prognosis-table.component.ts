import { Component, Input, OnInit } from "@angular/core";
import { PrognosisTableService } from "./prognosis-table.service";
import { PrognosisTabEnterService } from "./prognosis-tab-enter.service";

@Component({
  selector: "app-prognosis-table",
  templateUrl: "./prognosis-table.component.html",
  styleUrls: ["./prognosis-table.component.css"],
})
export class PrognosisTableComponent implements OnInit {
  @Input("_prognosis") set _prognosis(value) {
    if (value != this.prognosis) {
      this.prognosis = value;
      this.calculateFinalSumsWithTimeout();
    }
  }

  prognosis;
  finalSums = {
    totallyWorkedUp: 0,
    workedButNotApproved: 0,
    total_sent: 0,
    approvedForInvoice: 0,
    invoicedTotal: 0,
    richCostTotal_without_status: 0,
  };

  constructor(
    public prognosisTableService: PrognosisTableService,
    private prognosisTabEnterService: PrognosisTabEnterService
  ) {}

  ngOnInit(): void {}

  setGridLayoutHeader(): string {
    return `70px ${
      this.prognosisTableService.hasRiktpris ? "auto" : "auto"
    } 120px 110px 110px 110px 110px 110px 130px ${
      this.prognosisTableService.hasRiktpris ? "140px" : ""
    } ${this.prognosisTableService.hasRiktpris ? "84px" : "67px"}`;
  }

  setGridLayoutFooter(): string {
    return `${
      this.prognosisTableService.hasRiktpris ? "auto" : "auto"
    } 110px 110px 110px 110px 110px ${
      this.prognosisTableService.hasRiktpris ? "130px" : ""
    } ${this.prognosisTableService.hasRiktpris ? "140px" : "130px"} ${
      this.prognosisTableService.hasRiktpris ? "84px" : "67px"
    }`;
  }

  calculateFinalSumsWithTimeout() {
    setTimeout(() => {
      this.retInitFinalSum();
      this.calculateFinalSums();
    }, 300);
  }

  calculateFinalSums() {
    for (let property of this.prognosis.properties) {
      if (
        property.ata_totals.length <= 0 ||
        property.project_du_totals.length <= 0
      )
        continue;
      this.finalSums.totallyWorkedUp +=
        property.project_du_totals.totallyWorkedUp +
        property.ata_totals.totallyWorkedUp_without_status;

      this.finalSums.workedButNotApproved +=
        property.project_du_totals.workedButNotApproved +
        property.ata_totals.workedButNotApproved_without_status;

      this.finalSums.total_sent +=
        property.project_du_totals.total_sent +
        property.ata_totals.total_sent_wr_without_status;

      this.finalSums.approvedForInvoice +=
        property.project_du_totals.approvedForInvoice +
        property.ata_totals.approvedForInvoice_without_status;

      this.finalSums.invoicedTotal +=
        property.project_du_totals.invoicedTotal +
        property.ata_totals.invoicedTotal_without_status;

      if (this.prognosisTableService.hasRiktpris) {
        this.finalSums.richCostTotal_without_status +=
          property.ata_totals.richCostTotal_without_status;
      }
    }
  }

  retInitFinalSum() {
    this.finalSums.totallyWorkedUp = 0;
    this.finalSums.workedButNotApproved = 0;
    this.finalSums.total_sent = 0;
    this.finalSums.approvedForInvoice = 0;
    this.finalSums.invoicedTotal = 0;
    this.finalSums.richCostTotal_without_status = 0;
  }

  // Ova funkcija bi trebala da racuna zbir
  // prognoza svih Du i Ata
  calculateTotalOfAllPrognosis() {
    let finalSum = 0;
    for (let property of this.prognosis.properties) {
      const atas = property.atas;
      finalSum += atas.reduce((prev, ata) => {
        return (
          prev +
          Number(ata.prognosis && ata.PaymentType != 5 ? ata.prognosis : 0)
        );
      }, 0);
      finalSum += property.project_du_totals.prognosis;
    }
    return finalSum;
  }

  public activeDuIndex: number = -1;
  resetActiveDu() {
    this.activeDuIndex = -1;
  }

  findActiveDu(activeDuIndex) {
    return this.prognosis.properties.findIndex((du, index) => {
      if (index <= activeDuIndex) return false;
      return (
        du.project_debit !== 2 ||
        du.project_status === 2 ||
        !this.prognosis.isLocked
      );
    });
  }

  findNextDu(activeDuIndex) {
    this.setActiveDuIndex(activeDuIndex);
  }

  setActiveDuIndex(activeDuIndex = this.activeDuIndex) {
    this.activeDuIndex = this.findActiveDu(activeDuIndex);
    if (this.activeDuIndex === -1 && this.prognosis.properties.length >= 0)
      this.activeDuIndex = 0;
    this.prognosisTabEnterService.setActiveDuIndex(this.activeDuIndex);
  }
}
