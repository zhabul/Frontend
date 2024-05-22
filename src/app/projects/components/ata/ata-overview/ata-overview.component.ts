import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { AtaService } from "src/app/core/services/ata.service";
import { DomSanitizer } from "@angular/platform-browser";
import { ProjectsService } from "src/app/core/services/projects.service";
import { AtaInfoService } from 'src/app/projects/components/ata/modify-ata/ata-info/ata-info.service';
import { TranslateService } from "@ngx-translate/core";
import { UsersService } from "src/app/core/services/users.service";
import { MomentsService } from "src/app/core/services/moments.service";
declare var $;

@Component({
  selector: "app-ata-overview",
  templateUrl: "./ata-overview.component.html",
  styleUrls: ["./ata-overview.component.css"],
})

export class AtaOverviewComponent implements OnInit {
  @Input() ata: any;
  @Input("ataDocuments") set setAtaDocuments(items) {
    const images = [];
    const pdfs = [];
    items.forEach((item) => {
      if (item.document_type === "Image") {
        images.push(item);
      } else {
        pdfs.push(item);
      }
    });

    this.ataImages = images;
    this.ataPdfs = pdfs;


  }
  @Output() onWeekChange: EventEmitter<any> = new EventEmitter();

  ataImages: any[] = [];
  ataPdfs: any[] = [];

    public weekly_report_images:any[] = [];
    public weekly_report_name:any[] = [];
    public searchQuery = "";
    public userDetails: any;
    public objData: any = {};
    public setedIndex = "";
    public active_tab:number = 1;
    public spinner:boolean = false;
    public statusObjectExternal: any = {
        all: false,
        "2": false,
        "1": false,
        "0": false,
        "7": false,
        "5": false,
        "3": false,
        "6": false,
    };
    public group_of_moments:any;
    swiperSupplierInvoice = {
        images: [],
        active: -1,
        album: -2,
        index: -1,
        parent: null,
    };
/*
  @Input("weeklyReports") set setWeeklyReports(wr) {
    this.sumAllTotallyWorkedUp = 0;
    this.sumAllWorkedButNotApproved = 0;
    this.sumAllApprovedForInvoice = 0;
    this.sumAllInvoicedTotal = 0;
    this.sumAllWrSent = 0;

    const report = wr.filter((report) => {
      return (
        report.status == "5" ||
        report.status == "2" ||
        report.status == "0" ||
        report.status == "1"
      );
    });

    report.map((report) => {
      const status = report.status;
      const tables = report.tables;
      let workTotal = 0;
      let materialTotal = 0;
      let otherTotal = 0;

      tables["aaw"].forEach((aaw) => {
        if (
          aaw["additionalWorkStatus"] == "accepted" ||
          aaw["additionalWorkStatus"] == "" ||
          aaw["additionalWorkStatus"] == null
        )
          workTotal = workTotal + Number(aaw["Total"]);
      });
      const workTotalFixed = Number(workTotal.toFixed(2));
      tables["am"].forEach((am) => {
        if (
          am["additionalWorkStatus"] == "accepted" ||
          am["additionalWorkStatus"] == "" ||
          am["additionalWorkStatus"] == null
        )
          materialTotal = materialTotal + Number(am["Total"]);
      });
      const materialTotalFixed = Number(materialTotal.toFixed(2));
      tables["ao"].forEach((ao) => {
        if (
          ao["additionalWorkStatus"] == "accepted" ||
          ao["additionalWorkStatus"] == "" ||
          ao["additionalWorkStatus"] == null
        )
          otherTotal = otherTotal + Number(ao["Total"]);
      });
      const otherTotalFixed = Number(otherTotal.toFixed(2));
      const totalWorkedUp2 =
        workTotalFixed + materialTotalFixed + otherTotalFixed;
      const totalWorkedUp = Number(totalWorkedUp2.toFixed(2));

      report.TOTALWORKEDUP_WR = totalWorkedUp;
      report.INVOICED_WR = 0;
      report.LASTREGULATE_WR = 0;
      report.SENT_WR = 0;
      report.APPROVEDTOINVOICE_WR = 0;
      this.sumAllTotallyWorkedUp += totalWorkedUp;

      if (status == "5") {
        report.INVOICED_WR = totalWorkedUp;
        this.sumAllInvoicedTotal += totalWorkedUp;
      } else if (status == "2") {
        report.APPROVEDTOINVOICE_WR = totalWorkedUp;
        this.sumAllApprovedForInvoice += totalWorkedUp;
      } else if (status == "0") {
        report.LASTREGULATE_WR = totalWorkedUp;
        this.sumAllWorkedButNotApproved += totalWorkedUp;
      } else if (status == "1") {
        report.SENT_WR = totalWorkedUp;
        this.sumAllWrSent += totalWorkedUp;
      }

      return report;
    });
    this.weeklyReports = report.reverse();
  }*/

  @Input("getArticlesAdditionalWork") set setArticlesAdditionalWork(
    article: any
  ) {
    if (this.getArticlesAdditionalWork !== article) {
      this.getArticlesAdditionalWork = article;
    }
  }
  @Input("getArticlesMaterial") set setArticlesMaterial(article: any) {
    if (this.getArticlesMaterial !== article) {
      this.getArticlesMaterial = article;
    }
  }
  @Input("getArticleOther") set setArticleOther(article: any) {
    if (this.getArticleOther !== article) {
      this.getArticleOther = article;
    }
  }

  getArticlesAdditionalWork: any;
  getArticlesMaterial: any;
  getArticleOther: any;

  public invoices;
  public totalSum;
  public percentage;
  public atestedAtaMoments;
  public showMaterialTable = false;
  public showAdditionalWorkTable = false;
  public sumTime: any;
  public sumHourlyRate: any;
  public totalTime: any;
  public showSummary = true;
  public showImages = false;
  public showAttachmentImage = false;
  public showPdf = false;
  public currentAttachmentPdf = null;
  public currentAttachmentImage = null;
  public wrapper: any;
  public viewer: any;
  public rotateValue: number = 0;
  public documentsImagesKeyList: any[] = [];
  public documentsImagesList: any = [];
  public sumAllTotallyWorkedUp: number = 0;
  public sumAllWorkedButNotApproved: number = 0;
  public sumAllApprovedForInvoice: number = 0;
  public sumAllInvoicedTotal: number = 0;
  public sumAllWrSent: number = 0;

  weeklyReports: any = [];

  swiper = {
    images: [],
    active: -1,
    album: -2,
    index: -1,
    parent: null,
  };

  constructor(private ataService: AtaService,
              public sanitizer: DomSanitizer,
              private projectsService: ProjectsService,
              private ataInfoService:AtaInfoService,
              private translate: TranslateService,
              private usersService: UsersService,
              private momentsService: MomentsService) {}

    ngOnInit() {
        this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
        this.getAllWeeklyReports();
        this.getWeeklyReportDocuments();
        if (this.ata["PaymentType"] == 2 || this.ata["PaymentType"] == 3) {
          this.getSupplierInoviceForAta();

            this.momentsService.getSumOfAllAttestedMomentsByProjectOrAtaWithStarANdEndDate
            (
                this.ata.ProjectID,
                this.ata.ATAID
            ).subscribe((res) => {
                if(res['status']) {
                        this.group_of_moments = res['data'];
                    if(this.group_of_moments['total'] > 0) {
                        this.showAdditionalWorkTable = true
                    }
                }
            });
            /*
              this.ataService
                .getAtestedAtaMoments(
                  this.ata.ProjectID,
                  this.ata.ATAID,
                  this.ata.AtaNumber,
                  this.ata.ParentAta
                )
                .subscribe((res) => {

                  if (res["status"]) {
                    this.atestedAtaMoments = res["moments"];
                    this.atestedAtaMoments.forEach((moment) => {

                      if (moment["Time"].toString().includes(":")) {
                        const hours = parseInt(moment["Time"].toString().split(":")[0]);
                        const minutes = parseInt(
                          moment["Time"].toString().split(":")[1]
                        );
                        const momentFormated = hours + minutes / 60;
                        moment["Time"] = momentFormated;
                        moment["Total"] = momentFormated * moment["hourlyRate"];
                      }
                    });
                    this.calculateTotalTime();
                  }
                });
            */
        }
    }

    clearSearchText(){
        return this.searchQuery = "";
    }

    getAllWeeklyReports() {
        this.ataInfoService.setSpinner(true);
        this.spinner = true;
        this.ataService.getWeeklyReportsByAtaId(this.ata.ATAID, this.ata.ProjectID).then((res) => {
           let wr = res['data'];

            this.sumAllTotallyWorkedUp = 0;
            this.sumAllWorkedButNotApproved = 0;
            this.sumAllApprovedForInvoice = 0;
            this.sumAllInvoicedTotal = 0;
            this.sumAllWrSent = 0;

            const report = wr.filter((report) => {
              return (
                report.status == "5" ||
                report.status == "2" ||
                report.status == "0" ||
                report.status == "1"
              );
            });

            report.map((report) => {
            //  const status = report.status;
              const tables = report.tables;
              let workTotal = 0;
              let materialTotal = 0;
              let otherTotal = 0;

              tables["aaw"].forEach((aaw) => {
                if (
                  aaw["additionalWorkStatus"] == "accepted" ||
                  aaw["additionalWorkStatus"] == "" ||
                  aaw["additionalWorkStatus"] == null
                )
                  workTotal = workTotal + Number(aaw["Total"]);
              });
              const workTotalFixed = Number(workTotal.toFixed(2));
              tables["am"].forEach((am) => {
                if (
                  am["additionalWorkStatus"] == "accepted" ||
                  am["additionalWorkStatus"] == "" ||
                  am["additionalWorkStatus"] == null
                )
                  materialTotal = materialTotal + Number(am["Total"]);
              });
              const materialTotalFixed = Number(materialTotal.toFixed(2));
              tables["ao"].forEach((ao) => {
                if (
                  ao["additionalWorkStatus"] == "accepted" ||
                  ao["additionalWorkStatus"] == "" ||
                  ao["additionalWorkStatus"] == null
                )
                  otherTotal = otherTotal + Number(ao["Total"]);
              });
              const otherTotalFixed = Number(otherTotal.toFixed(2));
              const totalWorkedUp2 =
                workTotalFixed + materialTotalFixed + otherTotalFixed;
              const totalWorkedUp = Number(totalWorkedUp2.toFixed(2));

              report.TOTALWORKEDUP_WR = totalWorkedUp;
              report.INVOICED_WR = 0;
              report.LASTREGULATE_WR = 0;
              report.SENT_WR = 0;
              report.APPROVEDTOINVOICE_WR = 0;
/*              this.sumAllTotallyWorkedUp += totalWorkedUp;

              if (status == "5") {
                report.INVOICED_WR = totalWorkedUp;
                this.sumAllInvoicedTotal += totalWorkedUp;
              } else if (status == "2") {
                report.APPROVEDTOINVOICE_WR = totalWorkedUp;
                this.sumAllApprovedForInvoice += totalWorkedUp;
              } else if (status == "0") {
                report.LASTREGULATE_WR = totalWorkedUp;
                this.sumAllWorkedButNotApproved += totalWorkedUp;
              } else if (status == "1") {
                report.SENT_WR = totalWorkedUp;
                this.sumAllWrSent += totalWorkedUp;
              }
*/
              return report;
        });
        this.ataInfoService.setSpinner(false);
        this.spinner = false;
        this.weeklyReports = report.reverse();
        this.getUserPermissionTabs();
    });
  }

    getSupplierInoviceForAta() {
        this.ataService.getSupplierInoviceForAta(
            this.ata.ProjectID,
            this.ata.ATAID,
            this.ata.AtaNumber,
            this.ata.ParentAta
        ).subscribe((res) => {
            this.invoices = res["invoices"];
            this.invoices.forEach((invoice) => {
                if (invoice.Type == "SupplierInvoice") {
                    invoice.Price = invoice.Total;
                }
                if (this.invoices.length > 0) {
                    this.showMaterialTable = true;
                }
            });
        });
    }

  calculateTotalTime() {
    this.sumTime = this.atestedAtaMoments.reduce((prev, mom) => {
      return prev + parseFloat(mom["Time"]);
    }, 0);

    this.sumHourlyRate = this.atestedAtaMoments.reduce((prev, mom) => {
      return prev + parseFloat(mom["hourlyRate"]);
    }, 0);

    this.totalTime = this.atestedAtaMoments.reduce((prev, mom) => {
      return prev + parseFloat(mom["UserTotalCost"]);
    }, 0);
  }

  calculateTotal(prop) {
    let total = 0;
    if (this.invoices) {
      total = this.invoices.reduce((prev, invoice) => {
        return prev + parseFloat(invoice[prop]);
      }, 0);
      return total;
    }
  }

  calculateNetProfit(totalSum, totalTime, price) {
    let type_total_sum = typeof totalSum;
    if (totalSum && type_total_sum && type_total_sum != "number") {
      totalSum = Number(totalSum);
    }

    let type_totalTime = typeof totalTime;
    if (totalTime && type_totalTime && type_totalTime != "number") {
      totalTime = Number(totalTime);
    }

    let type_price = typeof price;
    if (price && type_price && type_price != "number") {
      price = Number(price);
    }

    if(!totalSum) {
        totalSum = 0;
    }

    if(!totalTime) {
        totalTime = 0;
    }

    if(!price) {
        price = 0;
    }

    let total = 0;

    if (totalSum < 0) {
      total = totalSum + totalTime + price;
    } else {
      total = totalSum - totalTime - price;
    }

    return total;
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

    getPercentage() {
        let type_total_sum = typeof this.totalSum;

        if (this.totalSum && type_total_sum && type_total_sum != "number") {
            this.totalSum = Number(this.totalSum);
        }

        let type_totalTime = typeof this.totalTime;
        if (this.totalTime && type_totalTime && type_totalTime != "number") {
            if(!this.totalTime) {
                this.totalTime = 0;
            }
            this.totalTime = Number(this.totalTime);
        }

        if(!this.totalTime) {
            this.totalTime = 0;
        }

        if(!this.totalSum) {
            this.totalSum = 0;
        }

        if (this.totalSum < 0) {
            this.percentage =
            ((this.totalSum + this.totalTime + this.calculateTotal("Price")) /
              Math.abs(this.totalSum)) *
            100;
        } else {
          this.percentage =
            ((this.totalSum - this.totalTime - this.calculateTotal("Price")) /
              this.totalSum) *
            100;
        }

        return this.percentage;
    }

  toggleTable(table) {
    this[table] = !this[table];
  }

  setContent(arg) {
    if (arg == "summary") {
      this.showSummary = true;
      this.showImages = false;
      $(".btn-all").addClass("active");
      $(".btn-approved").removeClass("active");
    } else {
      this.showSummary = false;
      this.showImages = true;
      $(".btn-approved").addClass("active");
      $(".btn-all").removeClass("active");
      this.ataService.getAtaKSImages(this.ata.ATAID, this.ata.ProjectID).subscribe((response) => {
        this.documentsImagesList = response["documentImages"];
        let documentImagesKeys = response["documentImagesKeys"];
        this.documentsImagesKeyList = Object.values(documentImagesKeys);
      });
    }
  }

  toggleAttachmentImage(e = null) {
    if (e) {
      if (e.target.id !== "looksLikeModal") {
        return;
      }
    }
    this.showAttachmentImage = !this.showAttachmentImage;
  }

  openDocumentModal(doc) {
    let formatPath = doc.slice(-3);

    if (formatPath == "pdf") {
      this.showPdf = true;
      this.currentAttachmentPdf =
        this.sanitizer.bypassSecurityTrustResourceUrl(doc);
    } else {
      this.currentAttachmentImage = doc;
      this.showPdf = false;
    }
    this.toggleAttachmentImage();
  }

    rotateRight() {
        this.rotateValue = this.rotateValue + 90;
        let d = document.getElementsByClassName(
          "iv-large-image"
        )[0] as unknown as HTMLElement;
        d.style.transform = "rotate(" + this.rotateValue + "deg)";
        let x = document.getElementsByClassName(
          "iv-snap-image"
        )[0] as unknown as HTMLElement;
        x.style.transform = "rotate(" + this.rotateValue + "deg)";
        let c = document.getElementsByClassName(
          "iv-snap-handle"
        )[0] as unknown as HTMLElement;
        c.style.transform = "rotate(" + this.rotateValue + "deg)";
    }

    rotateLeft() {
        this.rotateValue = this.rotateValue - 90;
        let d = document.getElementsByClassName(
          "iv-large-image"
        )[0] as unknown as HTMLElement;
        d.style.transform = "rotate(" + this.rotateValue + "deg)";
        let x = document.getElementsByClassName(
          "iv-snap-image"
        )[0] as unknown as HTMLElement;
        x.style.transform = "rotate(" + this.rotateValue + "deg)";
        let c = document.getElementsByClassName(
          "iv-snap-handle"
        )[0] as unknown as HTMLElement;
        c.style.transform = "rotate(" + this.rotateValue + "deg)";
    }

    changeWeek(report) {
        const obj = {
          info: {
            week: report.week,
            year: report.year,
            id: report.id,
            parent: report.parent,
            name: report.name
          },
          invoiced: report.INVOICED_WR > 0 ? "Invoiced" : "notInvoiced",
        };
        this.ataInfoService.setSelectedTab(0);
        this.onWeekChange.emit(obj);
    }

    isPDFViewer: boolean = false;
    openSwiper(index, files, album) {

      const type = files[index].row_type
        ? files[index].row_type
        : files[index].document_type;

      if (type != "pdf" && type != "Pdf") {
        this.isPDFViewer = false;
        this.swiper = {
          active: index,
          images: files,
          album: album,
          index: -1,
          parent: null,
        };
      } else {
        const fileArray = this.createFileArray(files[index]);
        this.isPDFViewer = true;
        this.swiper = {
          active: 0,
          images: fileArray,
          album: album,
          index: index,
          parent: files[index],
        };
      }
  }

  openSwiperSupplierInvoice(invoice = null, article = null) {
    let fileArray = this.createFileArraySupplierInvoice(invoice);
    this.swiperSupplierInvoice = {
        active: 0,
        images: fileArray,
        album: invoice.id,
        index: -1,
        parent: null
    };
  }

    closeSwiperSupplierInvoice() {
        this.swiperSupplierInvoice = {
            images: [],
            active: -1,
            album: -2,
            index: -1,
            parent: null,
        };
    }

    createFileArraySupplierInvoice(invoice) {

      const id = invoice.id;
      const comment = '';
      const name = invoice.SupplierName;
      //const image_path = invoice.image_path;
      const file_path = invoice.pdf_link;
      const type = invoice.type;

      const fileArray = file_path.split(",").map((fileString) => {
        return {
          image_path: fileString,
          id: id,
          Description: comment,
          name: name,
          file_path: file_path,
          type: type,
        };
      });
      return fileArray;
  }

    closeSwiper() {
        this.swiper = {
          images: [],
          active: -1,
          album: -2,
          index: -1,
          parent: null,
        };
    }

    createFileArray(file) {
      const id = file.id;
      const comment = file.Description;
      const name = file.Name ? file.Name : file.name;
      //const image_path = image.image_path;
      const file_path = file.file_path;
      const type = file.type;

      const fileArray = file_path.split(",").map((fileString) => {
        return {
          image_path: fileString,
          id: id,
          Description: comment,
          name: name,
          file_path: file_path,
          type: type,
        };
      });
      return fileArray;
  }
    removeSwiperImage(event) {}

    getWeeklyReportDocuments() {

        this.projectsService.getWeeklyReportDocuments(this.ata.ProjectID, this.ata.ATAID).then(
            (res) => {
                this.weekly_report_images = res['data'];
                this.weekly_report_name = Object.keys(this.weekly_report_images);
            }
        )
    }

    downloadActive(data, type) {

        if(data.file_path) {
            return data.file_path;
        }else {
            return data.image_path;
        }
    }

    onStatusChangeExternal(value) {

        const type = "weekly_report_overview";
        var status = !this.statusObjectExternal[value];

        if (value == "all") {
          this.checkAllExternal(status);
        } else {
          if (!status) {
            this.statusObjectExternal["all"] = false;
          }
          this.statusObjectExternal[value] = status;
          this.createUserPermissionTabs(value, type, status);
          this.handleAllStatus("External");
        }

        this.getTotals();
    }


    handleAllStatus(type) {
        const statusObject = this[`statusObject${type}`];
        const keys = Object.keys(statusObject);
        let flag = true;
        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          if (!statusObject[key]) {
            flag = false;
            break;
          }
        }
        statusObject["all"] = flag;
    }

    checkAllExternal(status) {
        const keys = Object.keys(this.statusObjectExternal);
        keys.forEach((key) => {
          this.statusObjectExternal[key] = status;
          if (key !== "all") {
            this.createUserPermissionTabs(key, "weekly_report_overview", status);
          }
        });

        this.sortAWeeklyReportByWeekNumber();
    }

    sortAWeeklyReportByWeekNumber() {
        this.weeklyReports = this.weeklyReports.sort((wr1, wr2) => {
            return Number(wr2.week) - Number(wr1.week);
        });
    }

    createUserPermissionTabs(value, type, status) {
        this.objData = {
            user_id: this.userDetails.user_id,
            tab_name: value,
            type: type,
        };

        if (status) {
            this.usersService.createUserPermissionTabs(this.objData);
        } else {
            this.usersService.deleteUserPermissionTabs(this.objData);
        }
    }

    get getFilteredWeeklyReports() {
        return this.weeklyReports.filter((wr) => {
            return ["name", "year"].some((property) => {
                return (
                  (property == "name"
                    ? this.translate.instant(wr[property])
                    : wr[property]
                  )
                    .toLowerCase()
                    .includes(this.searchQuery.toLowerCase()) &&
                  this.statusObjectExternal[wr["status"]]
                );
            });
        });
    }

    getAtaStatusClass(status, index) {
        let rowClass = "";

        switch (status.toString()) {
          case "0":
            rowClass = "wemax-yellow1";
            break;
          case "2":
            rowClass = "wemax-green1";
            break;
          case "3":
            rowClass = "wemax-red1";
            break;
          case "1":
            rowClass = "wemax-purple1";
            break;
          case "5":
            rowClass = "wemax-white1";
            break;
          case "6":
            rowClass = "wemax-aborted1";
            break;
          case "7":
            rowClass = "wemax-clear1";
            break;
          default:
            console.error("Your status (" + status + ") is NOT good, fix it.");
        }
        if (index === this.setedIndex) {
          rowClass = rowClass + " " + "active";
        }

        return rowClass;
    }

    openComponentDetail(ata, index) {
        this.setedIndex = index;
    }

    getTotals() {
        if(this.getFilteredWeeklyReports.length > 0 ) {
            this.ataInfoService.setSpinner(true);
            this.spinner = true;
        }

        this.sumAllTotallyWorkedUp = 0;
        this.sumAllWorkedButNotApproved = 0;
        this.sumAllApprovedForInvoice = 0;
        this.sumAllInvoicedTotal = 0;
        this.sumAllWrSent = 0;

        this.getFilteredWeeklyReports.forEach((report) => {

            const status = report.status;
            const tables = report.tables;
            let workTotal = 0;
            let materialTotal = 0;
            let otherTotal = 0;

            tables["aaw"].forEach((aaw) => {
                if (
                  aaw["additionalWorkStatus"] == "accepted" ||
                  aaw["additionalWorkStatus"] == "" ||
                  aaw["additionalWorkStatus"] == null
                )
                  workTotal = workTotal + Number(aaw["Total"]);
            });
            const workTotalFixed = Number(workTotal.toFixed(2));
            tables["am"].forEach((am) => {
                if (
                  am["additionalWorkStatus"] == "accepted" ||
                  am["additionalWorkStatus"] == "" ||
                  am["additionalWorkStatus"] == null
                )
                  materialTotal = materialTotal + Number(am["Total"]);
            });
            const materialTotalFixed = Number(materialTotal.toFixed(2));
            tables["ao"].forEach((ao) => {
                if (
                  ao["additionalWorkStatus"] == "accepted" ||
                  ao["additionalWorkStatus"] == "" ||
                  ao["additionalWorkStatus"] == null
                )
                  otherTotal = otherTotal + Number(ao["Total"]);
            });
            const otherTotalFixed = Number(otherTotal.toFixed(2));
            const totalWorkedUp = Number(workTotalFixed + materialTotalFixed + otherTotalFixed).toFixed(2);

            report.TOTALWORKEDUP_WR = Number(totalWorkedUp);
            report.INVOICED_WR = 0;
            report.LASTREGULATE_WR = 0;
            report.SENT_WR = 0;
            report.APPROVEDTOINVOICE_WR = 0;

            this.sumAllTotallyWorkedUp += Number(totalWorkedUp);

            if (status == "5") {
                report.INVOICED_WR = Number(totalWorkedUp);
                this.sumAllInvoicedTotal += Number(totalWorkedUp);
            } else if (status == "2") {
                report.APPROVEDTOINVOICE_WR = Number(totalWorkedUp);
                this.sumAllApprovedForInvoice += Number(totalWorkedUp);
            } else if (status == "0") {
                report.LASTREGULATE_WR = Number(totalWorkedUp);
                this.sumAllWorkedButNotApproved += Number(totalWorkedUp);
            } else if (status == "1") {
                report.SENT_WR = Number(totalWorkedUp);
                this.sumAllWrSent += Number(totalWorkedUp);
            }
            this.ataInfoService.setSpinner(false);
            this.spinner = false;
        });
    }


    getUserPermissionTabs() {
        this.usersService.getUserPermissionTabs().subscribe((res) => {

            const weekly_report_overview = res["data"]["weekly_report_overview"];
            if(weekly_report_overview) {
                const keys_weekly_report_overview = Object.keys(weekly_report_overview);
                keys_weekly_report_overview.forEach((status) => {
                  this.statusObjectExternal[status] = true;
                });

                if (keys_weekly_report_overview.length === 7) {
                  this.statusObjectExternal["all"] = true;
                }
                this.getTotals();
            }
        });
    }

    setActiveAta(arg) {
        this.active_tab = arg;
    }
}
