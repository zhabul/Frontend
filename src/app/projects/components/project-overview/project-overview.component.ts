import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ProjectsService } from "src/app/core/services/projects.service";
import { DomSanitizer } from "@angular/platform-browser";
declare var $;

@Component({
  selector: "app-project-overview",
  templateUrl: "./project-overview.component.html",
  styleUrls: ["./project-overview.component.css"],
})
export class ProjectOverviewComponent implements OnInit {
  @Input() project;
  @Output() onWeekChange: EventEmitter<any> = new EventEmitter();
  public projectWeeklyReports: any[] = [];
  public sumAllTotallyWorkedUp: number = 0;
  public sumAllWorkedButNotApproved: number = 0;
  public sumAllApprovedForInvoice: number = 0;
  public sumAllSentWr: number = 0;
  public sumAllInvoicedTotal: number = 0;
  public showSummary = true;
  public showImages = false;
  public documentsImagesKeyList: any[] = [];
  public documentsImagesList: any = [];
  public showAttachmentImage = false;
  public showPdf = false;
  public currentAttachmentPdf = null;
  public currentAttachmentImage = null;
  public wrapper: any;
  public viewer: any;
  public rotateValue: number = 0;

  swiper = {
    images: [],
    active: -1,
    album: -2,
    index: -1,
    parent: null,
  };

  constructor(
    private projectService: ProjectsService,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.getAllProjectWeeklyReports();
  }

  changeWeek(report) {
    const obj = {
      info: {
        week: report.Week,
        year: report.Year,
      },
      invoiced: report.invoicedTotal > 0 ? "Invoiced" : "notInvoiced",
    };

    this.onWeekChange.emit(obj);
  }

  getAllProjectWeeklyReports() {
    this.projectService
      .getAllProjectWeekyReports(this.project.id)
      .then((res) => {
        if (res["status"]) {
          this.projectWeeklyReports = res["data"];
          this.projectWeeklyReports = Object.values(
            this.projectWeeklyReports
          ).map((report) => {
            this.sumAllTotallyWorkedUp += parseFloat(report["totallyWorkedUp"]);
            this.sumAllWorkedButNotApproved += parseFloat(
              report["workedButNotApproved"]
            );
            this.sumAllSentWr += parseFloat(report["total_sent"]);
            this.sumAllApprovedForInvoice += parseFloat(
              report["approvedForInvoice"]
            );
            this.sumAllInvoicedTotal += parseFloat(report["invoicedTotal"]);
            return report;
          });
        }
      });
  }

  calculateWeeklyReport() {
    if (this.projectWeeklyReports && this.projectWeeklyReports.length > 0) {
      this.sumAllTotallyWorkedUp = this.projectWeeklyReports.reduce(
        (prev, week) => {
          return prev + parseFloat(week["totallyWorkedUp"]);
        },
        0
      );
      this.sumAllWorkedButNotApproved = this.projectWeeklyReports.reduce(
        (prev, week) => {
          return prev + parseFloat(week["workedButNotApproved"]);
        },
        0
      );
      this.sumAllApprovedForInvoice = this.projectWeeklyReports.reduce(
        (prev, week) => {
          return prev + parseFloat(week["approvedForInvoice"]);
        },
        0
      );
      this.sumAllInvoicedTotal = this.projectWeeklyReports.reduce(
        (prev, week) => {
          return prev + parseFloat(week["invoicedTotal"]);
        },
        0
      );
    }
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

      this.projectService
        .getProjectDUImages(this.project.id)
        .then((response) => {
          this.documentsImagesList = response["documentImages"];
          this.documentsImagesKeyList = response["documentImagesKeys"];
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

  isPDFViewer: boolean = false;
  openSwiper(index, images, album) {
    if (images[index].row_type !== "pdf") {
      this.isPDFViewer = false;
      this.swiper = {
        active: index,
        images: images,
        album: album,
        index: -1,
        parent: null,
      };
    } else {
      const imageArray = this.createImageArray(images[index]);
      this.isPDFViewer = true;
      this.swiper = {
        active: 0,
        images: imageArray,
        album: album,
        index: index,
        parent: images[index],
      };
    }
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

  createImageArray(image) {
    const id = image.id;
    const comment = image.Description;
    const name = image.Name ? image.Name : image.name;
    //const image_path = image.image_path;
    const file_path = image.file_path;

    const imageArray = file_path.split(",").map((imageString) => {
      return {
        image_path: imageString,
        id: id,
        Description: comment,
        name: name,
        file_path: file_path,
      };
    });
    return imageArray;
  }

  removeSwiperImage(event) {}
}
