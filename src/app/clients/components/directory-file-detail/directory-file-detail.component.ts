import { Component, OnInit } from "@angular/core";
import { AttachmentService } from "src/app/core/services/attachment.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { BASE_URL } from "src/app/config";
import { AppService } from "src/app/core/services/app.service";
import { TranslateService } from "@ngx-translate/core";
import { BreakpointObserver } from "@angular/cdk/layout";

declare var $;

@Component({
  selector: "app-directory-file-detail",
  templateUrl: "./directory-file-detail.component.html",
  styleUrls: ["./directory-file-detail.component.css"],
})
export class DirectoryFileDetailComponent implements OnInit {
  public directory: any;
  public userDetails: any;
  public filePath: any;
  public imagePath: any;
  public imagePath2: any;
  public previousRoute: string;
  public lang: string;
  public messages: object;
  public userScalableToggle;
  public windowWidth = window.innerWidth;
  public rotateValue: number = 0;

  eventText = "";
  where = "";
  public zoomAmount = 0;
  treshold = 0.1;

  public elementHeight = 556;
  public viewType = true;

  constructor(
    private route: ActivatedRoute,
    private attachmentService: AttachmentService,
    private toastr: ToastrService,
    private appService: AppService,
    private router: Router,
    public breakpointObserver: BreakpointObserver,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

    this.directory = this.route.snapshot.data["directory"]["data"];
    console.log(this.directory);
    if (this.directory.image_path) {
      this.imagePath = BASE_URL + this.directory.image_path;
    } else {
      this.imagePath = BASE_URL + this.directory.file_path;
    }

    console.log(this.imagePath);

    this.appService.setShowAddButton = false;
    this.previousRoute =
      this.directory.belongs_to == "0"
        ? "/clients/attachments/" + this.directory.ClientId
        : "/clients/attachments/" +
          this.directory.belongs_to +
          "/" +
          this.directory.ClientId;
    this.appService.setBackRoute(this.previousRoute);

    this.lang = sessionStorage.getItem("lang");
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

    this.viewType = this.breakpointObserver.isMatched("(max-width: 767.98px)");
  }

  zoom(percentage) {
    const img_ele = document.getElementById("desktop-img");
    var pre_width = img_ele.getBoundingClientRect().width,
      pre_height = img_ele.getBoundingClientRect().height;
    img_ele.style.width = pre_width * percentage + "px";
    img_ele.style.height = pre_height * percentage + "px";
  }

  zoomIn() {
    this.zoomAmount += 10;
    if (this.zoomAmount < 70) {
    }
  }

  zoomOut() {
    if (this.zoomAmount > 0) {
      this.zoomAmount -= 10;
    }
  }

  onPinch(evt) {
    if (this.where === "+") {
      if (this.zoomAmount < 8) {
        this.zoomAmount += 0.1 * evt.scale;
      }
    } else {
      if (this.zoomAmount > 1) {
        this.zoomAmount -= 0.3 * evt.scale;
      }
    }
  }

  onDoubleTap(evt) {
    this.zoomAmount = 1;
    alert(this.zoomAmount);
  }

  onPinchStart(evt) {
    this.eventText = "Pinch Started <br />";
  }

  onPinchEnd(evt) {
    this.eventText += "Pinch End <br />";
  }

  onPinchIn(evt) {
    this.where = "-";
  }
  onPinchOut(evt) {
    this.where = "+";
  }

  getFileExtension(filename) {
    return /[^.]+$/.exec(filename)[0].toLowerCase();
  }

  async deleteFile() {
    const res = await this.attachmentService.deleteAttachment(
      this.directory.Id
    );

    if (res["status"]) {
      this.toastr.success(
        this.translate.instant("Successfully deleted file."),
        this.translate.instant("Success")
      );
      this.router.navigate([this.previousRoute]);
    } else {
      this.toastr.error(
        this.translate.instant(
          "There was an error while trying to delete file."
        ),
        this.translate.instant("Error")
      );
    }
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
  }
}
