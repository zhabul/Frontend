import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { GeneralsService } from "src/app/core/services/generals.service";
import { AtaInfoService } from 'src/app/projects/components/ata/modify-ata/ata-info/ata-info.service';
@Component({
  selector: "ata-pdf",
  templateUrl: "./ata-pdf.component.html",
  styleUrls: ["./ata-pdf.component.css"],
})
export class AtaPdfComponent implements OnInit {
  @Input() formValues;
  @Input() articlesAdditionalWork;
  @Input() articlesMaterial;
  @Input() articlesOther;
  @Input() project;
  @Input() nextAtaNumber;
  @Input() selectedAta;
  @Input() deviationNumber;
  @Input() generalImage;
  @Input() sendReminder;
  @Input() richCostTotal;
  @Input() get_last_email_log_but_first_client;

  public userDetails;
  public totalSum = "0.00";
  public AtaTypes = [];
  public language = "en";
  public week = "Week";
  public generals;
  public clientMessageExists = false;
  public type: any;
  currency = JSON.parse(sessionStorage.getItem("currency"));

  constructor(private route: ActivatedRoute, private generalsService: GeneralsService, private ataInfoService: AtaInfoService,) {}

  ngOnInit() {

    if(!this.currency) {
        this.currency = 'SEK';
    }
    this.language = sessionStorage.getItem("lang");
    this.week = this.language === "en" ? "Week" : "Vecka";
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    this.AtaTypes = this.route.snapshot.data["type_atas"];
    //this.generals = this.route.snapshot.data["generals"];
    this.getAllGeneralsSortedByKey();

    this.route.queryParamMap.subscribe((params) => {
      this.type = params.get("type") || null;
    });

    if (this.formValues && this.formValues.clientResponses) {
        if (this.formValues.clientResponses.length > 0) {
            this.formValues.clientResponses.forEach((resp) => {
                if (resp.client_message) {
                    this.clientMessageExists = true;
                }
            });
        }
    }
  }

    ngOnDestroy() {
        this.ataInfoService.setAllowUpdateAta(false);
    }

    getAllGeneralsSortedByKey() {

        this.generalsService.getAllGeneralsSortedByKey().subscribe(
            (res) => {
                this.generals = res;
            }
        );
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

  get getArticlesAdditionalWork() {
    
    if (
      (this.formValues.paymentType == 1 &&
        this.formValues.Status != 0 &&
        this.formValues.Status != 4 &&
        this.formValues.Status != 3 && 
        this.formValues.Status != 8) ||
      (this.formValues.paymentType == 4 &&
        this.formValues.Status != 0 &&
        this.formValues.Status != 4 &&
        this.formValues.Status != 3 && 
        this.formValues.Status != 8)
    ) {
      return this.articlesAdditionalWork.filter(
        (article) =>
         // article.Name != "" &&
          article.wrId != 0 &&
          article.Status.length > 0 &&
          article.Status.toLowerCase() != "declined"
      );
    } else {
      return this.articlesAdditionalWork;/*.filter(
        (article) => article.Name != ""
      );*/
    }
  }

  get getArticlesMaterial() {

    if (
      (this.formValues.paymentType == 1 &&
        this.formValues.Status != 0 &&
        this.formValues.Status != 4 &&
        this.formValues.Status != 3 && 
        this.formValues.Status != 8) ||
      (this.formValues.paymentType == 4&&
        this.formValues.Status != 0 &&
        this.formValues.Status != 4 &&
        this.formValues.Status != 3 && 
        this.formValues.Status != 8)
    ) {
      const articlesObj = {};
      this.articlesMaterial
        .filter(
          (article) =>
           // article.Name != "" &&
            article.wrId != 0 &&
            article.Status.length > 0 &&
            article.Status.toLowerCase() != "declined"
        )
        .forEach((article) => {
          if (!articlesObj[article.wrId]) {
            articlesObj[article.wrId] = [];
          }

          articlesObj[article.wrId].push(article);
        });

      let articles = Object.values(articlesObj) as any;

      articles = articles.map((articleGroup) => {
        return {
          Name: articleGroup[0].date,
          Total: articleGroup.reduce(
            (total, article) => (total += Number(article.Total)),
            0
          ),
        };
      });

      return articles;
    } else {
      return this.articlesMaterial;//.filter((article) => article.Name != "");
    }
  }


  get getArticleOther() {
    if (
      (this.formValues.paymentType == 1 &&
        this.formValues.Status != 0 &&
        this.formValues.Status != 4 &&
        this.formValues.Status != 3 && 
        this.formValues.Status != 8) ||
      (this.formValues.paymentType == 4 &&
        this.formValues.Status != 0 &&
        this.formValues.Status != 4 &&
        this.formValues.Status != 3 && 
        this.formValues.Status != 8)
    ) {
      const articlesObj = {};

      this.articlesOther
        .filter(
          (article) =>
          //  article.Name != "" &&
            article.wrId != 0 &&
            article.Status.length > 0 &&
            article.Status.toLowerCase() != "declined"
        )
        .forEach((article) => {
          if (!articlesObj[article.wrId]) {
            articlesObj[article.wrId] = [];
          }

          articlesObj[article.wrId].push(article);
        });

      let articles = Object.values(articlesObj) as any;

      articles = articles.map((articleGroup) => {
        return {
          Name: articleGroup[0].date,
          Total: articleGroup.reduce(
            (total, article) => (total += Number(article.Total)),
            0
          ),
        };
      });

      return articles;
    } else {
      return this.articlesOther;//.filter((article) => article.Name != "");
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

  calcTotal(data) {
    let total = 0;
    data.forEach((data2) => {
      let amount = data2.Total != "" ? data2.Total : 0;
      total += parseFloat(amount);
    });

    return total.toFixed(2);
  }

  calcRemainingToBill() {
    let typeofinvoicedTotal = null;
    let typeoftotallyWorkedUp = null;

    if (
      this.formValues.invoicedTotal !== null &&
      this.formValues.invoicedTotal !== ""
    ) {
      typeofinvoicedTotal = typeof this.formValues.invoicedTotal;
      typeoftotallyWorkedUp = typeof this.formValues.totallyWorkedUp;
    }

    // if (typeoftotallyWorkedUp == "number" && typeofinvoicedTotal == "number") {
    //  /* return (
    //     parseFloat(this.formValues.totallyWorkedUp) -
    //     parseFloat(this.formValues.invoicedTotal)
    //   ).toFixed(2);*/
    //   return (
    //     parseFloat(this.formValues.total_approved)
    //   ).toFixed(2);
    // } else return 0;
    if (typeofinvoicedTotal === "number" && typeoftotallyWorkedUp === "number" && !isNaN(this.formValues.total_approved)) {
      return parseFloat(this.formValues.total_approved).toFixed(2);
    } else {
      return 0;
    }
  }

  hasDeduct() {
    return (
      this.getArticlesAdditionalWork.some((article) => article.Deduct != "") ||
      this.getArticlesMaterial.some((article) => article.Deduct != "") ||
      this.getArticleOther.some((article) => article.Deduct != "")
    );
  }

  generatePdf(type) {
    if(type == 'Save') {
      this.ataInfoService.setAllowUpdateAta('downloadAtaPdf');
    }else {
      this.ataInfoService.setAllowUpdateAta('print');
    }
  }
}
