import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "ata-weekly-report-pdf",
  templateUrl: "./ata-weekly-report-pdf.component.html",
  styleUrls: ["./ata-weekly-report-pdf.component.css"],
})
export class AtaWeeklyReportPdfComponent implements OnInit {
  @Input() formValues;
  @Input() currentWeeklyReport;
  @Input() project;
  @Input() articlesAdditionalWork;
  @Input() articlesMaterial;
  @Input() articlesOther;
  @Input() generalImage;
  @Input() reminderCheckboxDU;
  @Input() get_last_email_log_but_first_client_wr;
  @Output() emitNewAtaChanged = new EventEmitter<any>();

  public generals = [];
  public AtaTypes = [];
  public totalSum = "0.00";
  public current_user: any = JSON.parse(sessionStorage.getItem("userDetails"));
  public current_user_full_name;
  Number = Number;
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
    this.AtaTypes = this.route.snapshot.data["type_atas"];
    this.generals = this.route.snapshot.data["generals"] || [];
    this.current_user_full_name =
      this.current_user.firstname + " " + this.current_user.lastname;
  }

  check_wr_status() {
    if (
      this.currentWeeklyReport.status == 0 ||
      this.currentWeeklyReport.status == 1
    )
      return "";
    else if (
      this.currentWeeklyReport.status == 3 ||
      this.currentWeeklyReport.status == 3
    )
      return "Declined";
    else return "Accepted";
  }

  capitalizeFirstLetter(string) {
    return string && string.length > 0
      ? string[0].toUpperCase() + string.slice(1)
      : "";
  }

    get getArticlesAdditionalWork() {
        if(this.articlesAdditionalWork && this.articlesAdditionalWork.value) {
            return this.articlesAdditionalWork.value.filter(
                (article) => article.Name != ""
            );
        }
    }

    get getArticlesMaterial() {
        if(this.articlesMaterial && this.articlesMaterial.value) {
            return this.articlesMaterial.value.filter(
              (article) =>
                article.Name != "" && article.additionalWorkStatus != "declined"
            );
        }
    }

    get getDeclinedArticlesMaterial() {
        if(this.articlesMaterial && this.articlesMaterial.value) {
            return this.articlesMaterial.value.filter(
              (article) =>
                article.Name != "" && article.additionalWorkStatus == "declined"
            );
        }
    }

    get getDeclinedArticleOther() {
        if(this.articlesOther && this.articlesOther.value) {
            return this.articlesOther.value.filter(
              (article) =>
                article.Name != "" && article.additionalWorkStatus == "declined"
            );
        }
    }

    get getArticleOther() {
        if(this.articlesOther && this.articlesOther.value) {
            return this.articlesOther.value.filter(
              (article) =>
                article.Name != "" && article.additionalWorkStatus != "declined"
            );
        }
    }

  formatTotal(total) {
    return Number(total).toFixed(2);
  }

  getAtaType(id) {
    const type = this.AtaTypes.find((type) => type.id == id);
    if (type) {
      return type.Name;
    }
  }

  calcAllTotal(data) {
    let total = 0;
    data.forEach((data2) => {
      if (data2.length > 0) {
        data2.forEach((data3) => {
          let amount = data3.Total != "" ? data3.Total : 0;
          total += parseFloat(amount);
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
          let amount =
            data3.Total != "" && data3.additionalWorkStatus != "declined"
              ? data3.Total
              : 0;
          total += parseFloat(amount);
        });
      }
    });

    this.totalSum = total.toFixed(2);
    return this.totalSum;
  }

  calcRemainingToBill(workedUp) {
    let num: any = 0;

    if (this.currentWeeklyReport) {
      num = (
        parseFloat(this.currentWeeklyReport[workedUp]) -
        parseFloat(this.currentWeeklyReport.invoicedTotal)
      ).toFixed(2);
    }

    return num;
  }

  hasDeduct() {
    return (
      this.getArticlesAdditionalWork.some((article) => article.Deduct != "") ||
      this.getArticlesMaterial.some((article) => article.Deduct != "") ||
      this.getArticleOther.some((article) => article.Deduct != "")
    );
  }

  formatWRNumber(number) {
    if (number) {
      return "KS-" + number.split("-")[1];
    } else {
      return "";
    }
  }
  formatWNumber2(number) {
    let name = "";
    if (this.currentWeeklyReport.name != "Regulation") {
      name = "KS.-";
    }

    if (number) {
      return name + number.substring(number.indexOf("-") + 1);
    } else {
      return "";
    }
  }

  checkDisplayText() {
    let text = "";
    const reminder = this.translate.instant("Reminder");

    if (this.currentWeeklyReport.timesReminderSentDU > 0) {
      text = reminder;
      if (this.currentWeeklyReport.timesReminderSentDU > 1) {
        text = reminder + " " + this.currentWeeklyReport.timesReminderSentDU;
      }
    } else {
      text =
        "- Kostnadssammanställning " +
        this.formatWNumber2(this.currentWeeklyReport.name);
    }

    return text;
  }

  generatePdf(from) {
    this.emitNewAtaChanged.emit({
      type: "AtaPDFWR",
      from: from,
    });
  }

  zoomBy(scale){
    this.zoomButton = this.zoomButton + scale
  }
}
