import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { AttachmentService } from "src/app/core/services/attachment.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { BASE_URL } from "src/app/config";
import { AppService } from "src/app/core/services/app.service";
import { interval, Subscription } from "rxjs";
import { environment } from "src/environments/environment";
import { BreakpointObserver } from "@angular/cdk/layout";
import { TranslateService } from "@ngx-translate/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
declare var $;

@Component({
  selector: "app-directory-file-detail",
  templateUrl: "./directory-file-detail.component.html",
  styleUrls: ["./directory-file-detail.component.css"],
})
export class DirectoryFileDetailComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  public directory: any;
  public userDetails: any;
  public filePath: any;
  public imagePath: any =
    "http://localhost:4201/uploads/pdfImages/1573649660.png";
  public imagePath2: any =
    "http://192.168.12.100:4201/uploads/pdfImages/1573649660.png";
  public previousRoute: string;
  public lang: string;
  public messages: object;
  public userScalableToggle;
  public windowWidth = window.innerWidth;
  public images = [];
  public currentImage = 0;
  public rotateValue: number = 0;
  public baseUrl = BASE_URL;
  public showCommentModal = false;
  public showUpdate = false;

  // indicators;
  eventText = "";
  where = "";
  public zoomAmount = 0;
  treshold = 0.1;

  public elementHeight = 556;
  public viewType = true;
  public spinner = false;
  public imgs = [];
  public wrapper: any;
  public viewer: any;
  private subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private attachmentService: AttachmentService,
    private toastr: ToastrService,
    private appService: AppService,
    private router: Router,
    private dialog: MatDialog,
    public breakpointObserver: BreakpointObserver,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

    this.directory = this.route.snapshot.data["directory"]["data"];

    this.images = this.directory.image_path
      .split(",")
      .map((image) => BASE_URL + image);

    this.appService.setShowAddButton = false;
    this.previousRoute =
      this.directory.belongs_to == "0"
        ? "/projects/view/" + this.directory.project_id
        : "/projects/directory/" +
          this.directory.belongs_to +
          "/" +
          this.directory.project_id;
    this.appService.setBackRoute(this.previousRoute);

    this.lang = sessionStorage.getItem("lang");
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

    this.viewType = this.breakpointObserver.isMatched("(max-width: 767.98px)");
    this.hideMessage();
  }

  ngAfterViewInit(): void {
    this.images.forEach((img) => {
      this.imgs.push({
        small: img,
        big: img,
      });
    });

    this.hideMessage();
    const source = interval(500);
    if (environment.production) {
      this.subscription = source.subscribe((val) => {
        this.hideMessage();
      });
    }
  }

  hideMessage() {
    if ($(".tox-notifications-container").length > 0)
      $(".tox-notifications-container").css("display", "none");

    if ($(".tox-statusbar").length > 0)
      $(".tox-statusbar").css("display", "none");
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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

  removeFile() {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe(async (response) => {
        if (response.result) {
          this.deleteFile();
        }
      });
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

  nextPage() {
    this.currentImage++;
    this.showImage(this.imgs, this.viewer);
  }

  previousPage() {
    this.currentImage--;
    this.showImage(this.imgs, this.viewer);
  }

  showImage(imgs, viewer) {
    const imgObj = imgs[this.currentImage];
    viewer.load(imgObj.small, imgObj.big);
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

  getFileName(file) {
    return file.split(".")[0];
  }

  openCommentModal() {
    this.showCommentModal = true;
  }

  closeCommentModal(e) {
    if (e) {
      if (e.target.id !== "looksLikeModal") {
        return;
      }
    }

    this.showCommentModal = false;
  }

  updateComment() {
    if (this.showUpdate) {
      this.attachmentService
        .updateComment(this.directory.Id, this.directory.comment)
        .subscribe((res) => {
          if (res["status"]) {
            this.toastr.success(
              this.translate.instant("Successfully updated comment."),
              this.translate.instant("Success")
            );
            this.showCommentModal = false;
            this.showUpdate = false;
          } else {
            this.toastr.error(
              this.translate.instant(
                "There was an error while updating the comment."
              ),
              this.translate.instant("Error")
            );
            this.showUpdate = false;
          }
        });
    } else {
      this.showUpdate = !this.showUpdate;
    }
  }

  textEditorKeyDown(editor) {
    const event = editor.event;
    const value = this.directory.comment.value;
    const wordcount = value.length;
    if (wordcount >= 500 && event.keyCode != 8 && event.keyCode != 46) {
      event.preventDefault();
    }
  }

  textEditorOnPaste(editor) {
    editor.event.preventDefault();
  }
}
