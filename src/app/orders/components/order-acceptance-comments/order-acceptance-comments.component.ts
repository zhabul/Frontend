import { Component, OnInit } from "@angular/core";
import { OrdersService } from "src/app/core/services/orders.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ProjectsService } from "src/app/core/services/projects.service";
import { BASE_URL } from "src/app/config";
import { TranslateService } from "@ngx-translate/core";
import { AppService } from "src/app/core/services/app.service";

@Component({
  selector: "order-acceptance-comments",
  templateUrl: "./order-acceptance-comments.component.html",
  styleUrls: ["./order-acceptance-comments.component.css"],
})
export class OrderAcceptanceCommentsComponent implements OnInit {
  public order;
  public orderAcceptanceComments;

  public language = window.sessionStorage.getItem("lang").toLowerCase();
  public messageSuccess: any;
  public messageErr: any;
  public messageSuccessfullySavedResponse: any;
  public messageNotSuccessfullySavedResponse: any;
  public messageWrongImageFormat: any;
  public showEmailButton: boolean = false;
  public file;
  public fileName;
  public showErrorImage = false;
  public baseURL = BASE_URL;

  public validationTester: boolean = true;
  public saveDisabled: boolean = false;
  public orderResolved = false;
  messageResolveErrors: string;
  messageResolveErrorsSuccess: string;

  public swiperAtt = {
    images: [],
    active: -1,
    album: -2,
    index: -1,
    parent: null,
  };

  public attachment;

  public isEmailModalVisible: boolean = false;

  constructor(
    private ordersService: OrdersService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private projectsService: ProjectsService,
    private appService: AppService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.order = this.route.snapshot.data["orderAsdf"];

    if (this.order.errorAttachmentImage) {
      this.attachment = {
        file_path: this.order.errorAttachmentImage,
        image_path: this.order.errorAttachmentImage,
        document_type: "Image",
        Url: this.order.errorAttachmentImage,
      };
    }

    this.order.cc = "";

    this.file = null;
    this.fileName = null;

    this.messageSuccess = "Successfully sent the email to supplier";
    this.messageErr = "There was an error while trying to send the email";
    this.messageSuccessfullySavedResponse =
      "Saved the response. You can send the email when you like";
    this.messageNotSuccessfullySavedResponse =
      "The response was not successfully saved";
    this.messageWrongImageFormat = "You can only upload an image";
    this.messageResolveErrorsSuccess = "Successfully marked order as resolved";
    this.messageResolveErrors =
      "There was an error while trying to resolve errors in order";

    this.appService.setBackRoute("/projects/view/" + this.order.pid);
    this.appService.setShowAddButton = false;
  }

  public isChecked = true;

  toggleCheckbox(item) {
    item.comment = "";
    if (!item.isChecked) return (item.quantityReceived = item.quantity);
  }

  toggleShowErrorImage(e): void {
    if (e) {
      if (e.target.id !== "looksLikeModal") {
        return;
      }
    }
    this.showErrorImage = !this.showErrorImage;
  }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      const url = URL.createObjectURL(file);
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.file = reader.result;
        this.fileName = {
          file_path: url,
          image_path: url,
          document_type: "Image",
          Url: url,
          previewUrl: url,
        };
      };
    }
  }

  areAllChecked() {
    return this.order.items.every((x) => x.isChecked);
  }

  orderItemsValidator() {
    return this.order.items.some((x) => {
      const b =
        (x.quantityReceived != null &&
          x.comment.trim() != "" &&
          !x.isChecked) ||
        (x.quantityReceived != null && x.isChecked);

      return !b;
    });
  }

  goBack() {
    this.router.navigate(["/projects/view/" + this.order.pid]);
    this.projectsService.setCurrentTab(0);
  }

  public sendEmail() {
    this.order.attachmentImage = this.file;
    this.order.attachmentImageName = this.fileName;
    this.ordersService.sendEmail(this.order).subscribe((res) => {
      if (res["image"] === -1) {
        this.toastr.error(
          this.translate.instant(this.messageWrongImageFormat),
          this.translate.instant("Error")
        );
        return;
      }

      if (res["status"]) {
        this.toastr.success(
          this.translate.instant(this.messageSuccess),
          this.translate.instant("Success")
        );
      } else {
        this.toastr.error(
          this.translate.instant(this.messageErr),
          this.translate.instant("Error")
        );
      }
    });
    this.goBack();
  }

  public saveResponseBeforeSending() {
    if (this.order.items.some((x) => !x.isChecked && x.comment.trim() == "")) {
      this.saveDisabled = true;
    } else {
      this.order.hasErrors = this.order.items.some((x) => !x.isChecked);
      if (this.order.hasErrors) {
        this.order.attachmentImage = this.file;
        this.order.attachmentImageName = this.fileName;
      }
      this.ordersService
        .saveResponseBeforeSending(this.order)
        .subscribe((res) => {
          if (res["status"]) {
            if (res["image"] === -1) {
              this.toastr.error(
                this.translate.instant(this.messageWrongImageFormat),
                this.translate.instant("Error")
              );
              return;
            }
            if (res["image"] !== -2) {
              this.order.errorAttachmentImage = res["image"];
            }
            this.toastr.success(
              this.translate.instant(this.messageSuccessfullySavedResponse),
              this.translate.instant("Success")
            );
            this.order.saved = 1;
            this.order.sent = 0;
          } else {
            this.toastr.error(
              this.translate.instant(this.messageNotSuccessfullySavedResponse),
              this.translate.instant("Error")
            );
          }
        });
    }
  }

  resolveErrors() {
    this.ordersService.resolveErrorsInOrder(this.order.id).subscribe((res) => {
      if (res["status"]) {
        this.toastr.success(
          this.translate.instant(this.messageResolveErrorsSuccess),
          this.translate.instant("Success")
        );
        this.orderResolved = true;
      } else {
        this.toastr.error(
          this.translate.instant(this.messageResolveErrors),
          this.translate.instant("Error")
        );
      }
    });
  }

  openSwiperFile(attachment) {}

  openSwiperAtt(attachment) {
    this.swiperAtt = {
      active: 0,
      images: [attachment],
      album: 0,
      index: 0,
      parent: null,
    };
  }

  closeSwiperAtt() {
    this.swiperAtt = {
      active: -1,
      images: [],
      album: -2,
      index: -1,
      parent: null,
    };
  }

  modalVisibility(visibility: boolean): void {
    this.isEmailModalVisible = visibility;
  }


  autogrow(index){
    let  textArea = document.getElementById(index)       
    textArea.style.overflow = 'hidden';
    textArea.style.minHeight  = '39px';
    textArea.style.height = '0px';
    textArea.style.height = textArea.scrollHeight + 'px';
  }

}
