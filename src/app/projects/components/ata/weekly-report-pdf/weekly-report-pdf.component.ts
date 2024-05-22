import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "weekly-report-pdf",
  templateUrl: "./weekly-report-pdf.component.html",
  styleUrls: ["./weekly-report-pdf.component.css"],
})
export class WeeklyReportPdfComponent implements OnInit {
  @Input() formValues;
  @Input() currentWeeklyReport;
  @Input() project;
  @Input() generalImage;
  @Input() get_last_email_log_but_first_client_wr;
  @Output() emitNewAtaChanged = new EventEmitter<any>();

  public generals = [];
  public AtaTypes = [];
  public current_user: any = JSON.parse(sessionStorage.getItem("userDetails"));
  public current_user_full_name;
  Number = Number;
  totalSum: string;
  public zoomButton: any = 0;
  currency = JSON.parse(sessionStorage.getItem("currency"));

  zoom = {
    scale: 1,
    panning: false,
    pointX: 0,
    pointY: 0, 
    start: { x: 0, y: 0 },
  };

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {}

  ngOnInit() {

    if(!this.currency) {
        this.currency = 'SEK';
    }
    this.AtaTypes = this.route.snapshot.data["type_atas"] || [];
    this.generals = this.route.snapshot.data["generals"] || [];
    this.current_user_full_name =
    this.current_user.firstname + " " + this.current_user.lastname;
  }

  getAtaType(id) {
    const type = this.AtaTypes.find((type) => type.id == id);
    if (type) {
      return type.Name;
    }
  }

  get getArticlesAdditionalWork() {
    if (
      this.currentWeeklyReport &&
      this.currentWeeklyReport.articles &&
      this.currentWeeklyReport.articles.AdditionalWork.length > 0
    )
      return this.currentWeeklyReport.articles.AdditionalWork.filter(
        (article) =>
          article.Name != "" && article.additionalWorkStatus != "declined"
      );
    else return [];
  }

  get getArticlesMaterial() {
    if (
      this.currentWeeklyReport &&
      this.currentWeeklyReport.articles &&
      this.currentWeeklyReport.articles.Material.length > 0
    ) {
      return this.currentWeeklyReport.articles.Material.filter(
        (article) =>
          article.Name != "" && article.additionalWorkStatus != "declined"
      );
    } else {
      return [];
    }
  }

  get getDeclinedArticlesMaterial() {
    if (
      this.currentWeeklyReport &&
      this.currentWeeklyReport.articles &&
      this.currentWeeklyReport.articles.Material.length > 0
    )
      return this.currentWeeklyReport.articles.Material.filter(
        (article) =>
          article.Name != "" && article.additionalWorkStatus == "declined"
      );
    else return [];
  }

  get getDeclinedArticleOther() {
    if (
      this.currentWeeklyReport &&
      this.currentWeeklyReport.articles &&
      this.currentWeeklyReport.articles.Material.length > 0
    )
      return this.currentWeeklyReport.articles.Other.filter(
        (article) =>
          article.Name != "" && article.additionalWorkStatus == "declined"
      );
    else return [];
  }

  get getArticleOther() {
    if (
      this.currentWeeklyReport &&
      this.currentWeeklyReport.articles &&
      this.currentWeeklyReport.articles.Material.length > 0
    )
      return this.currentWeeklyReport.articles.Other.filter(
        (article) =>
          article.Name != "" && article.additionalWorkStatus != "declined"
      );
    else return [];
  }

  formatWRNumber(number) {
    if (number) {
      return "DU-" + number.split("-")[1];
    } else {
      return "";
    }
  }

  setReminderText() {
    const reminder = this.translate.instant("Reminder");
    let text = "";

    if (this.currentWeeklyReport.status == 1) {
      if (this.currentWeeklyReport.timesReminderSentDU > 0) {
        text = reminder;
        if (this.currentWeeklyReport.timesReminderSentDU > 1) {
          text = reminder + " " + this.currentWeeklyReport.timesReminderSentDU;
        }
      }
    }
    return text;
  }

  calcAllTotal(data) {
    let total = 0;
    data.forEach((data2) => {
      if (data2.length > 0) {
        data2.forEach((data3) => {
          if (data3.Total != "NaN") {
            let amount = data3.Total != "" ? data3.Total : 0;
            total += parseFloat(amount);
          }
        });
      }
    });

    this.totalSum = total.toFixed(2);
    return this.totalSum;
  }

  calcApprovedTotal(data) {
    let total = 0;
    data.forEach((data2) => {
      if (data2.length > 0) {
        data2.forEach((data3) => {
          if (data3.Total != "NaN") {
            if (
              data3.additionalWorkStatus == "accepted" ||
              data3.additionalWorkStatus == "" ||
              !data3.additionalWorkStatus
            ) {
              let amount = data3.Total != "" ? data3.Total : 0;
              total += parseFloat(amount);
            }
          }
        });
      }
    });

    this.totalSum = total.toFixed(2);
    return this.totalSum;
  }
  calcRemainingToBill(workedUp) {
    if (this.currentWeeklyReport) {
      return (
        parseFloat(this.currentWeeklyReport[workedUp]) -
        parseFloat(this.currentWeeklyReport.invoicedTotal)
      ).toFixed(2);
    } else {
      return 0;
    }
  }

  generatePdf(from) {
    this.emitNewAtaChanged.emit({
      type: "ProjectPDFWR",
      from: from,
    });
  }

  zoomBy(scale){
    console.log(scale);
    this.zoomButton = this.zoomButton + scale
  }

}
