import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BASE_URL } from "../../../config";
import { Order } from "src/app/core/models/order";
import { ProjectsService } from "src/app/core/services/projects.service";
import { AppService } from "src/app/core/services/app.service";
import { CartService } from "src/app/core/services/cart.service";
import { ToastrService } from "ngx-toastr";
import { OrdersService } from "src/app/core/services/orders.service";
import { TranslateService } from "@ngx-translate/core";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.css"],
})
export class OrderComponent implements OnInit {

  @ViewChild('containerBlueScroll') containerBlueScroll;
  public pdfSrc: string;
  public projectID: any;
  public orderData: Order;
  public project: any;
  public projects: any[];
  public order: any;
  public sendOrder = true;
  public spinner = false;
  public userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  public userScalableToggle;

  constructor(
    private appService: AppService,
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private dialog: MatDialog,
    private cartService: CartService,
    private toastr: ToastrService,
    private orderService: OrdersService,
    private translate: TranslateService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.order = this.route.snapshot.data.order;

    this.appService.setBackRoute("/projects/view/" + this.order.pid);
    this.appService.setShowAddButton = false;

    this.pdfSrc = `${BASE_URL}${this.order.pdfPath}`;

    this.orderData = JSON.parse(sessionStorage.getItem("orderData"));

    this.userScalableToggle = document.querySelector("meta[name='viewport']");
    this.userScalableToggle.content =
      "width=device-width, initial-scale=1.0, user-scalable=yes";
  }

  sendEmail() {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          this.sendOrder = false;
          this.spinner = true;
          this.cartService
            .sendOrderEmail(this.route.snapshot.params.id)
            .subscribe((res: any) => {

              this.spinner = false;
              this.userScalableToggle.content =
                "width=device-width, initial-scale=1.0, user-scalable=no";
              this.router.navigate(["/projects/view/" + this.order.pid]);

              if (res.status) {
                this.toastr.success(
                  this.translate.instant("You have successfully resent email!"),
                  this.translate.instant("Success")
                );
              } else {
                this.toastr.error(
                  this.translate.instant(
                    "There was a problem while resending email!"
                  ),
                  this.translate.instant("Error")
                );
              }

            });
        }
      });
  }

  changeOrderStatus(status) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          this.spinner = true;
          this.orderService
            .changeOrderStatus(this.order.id, status)
            .subscribe((res) => {
              this.spinner = false;
              if (res["status"]) {
                if (status == 1) {
                  this.toastr.success(
                    this.translate.instant("Successfully accepted order."),
                    this.translate.instant("Success")
                  );
                } else if (status == 3) {
                  this.toastr.success(
                    this.translate.instant("Successfully aborted order."),
                    this.translate.instant("Success")
                  );
                }
                this.goBack();
              } else {
                if (status == 1) {
                  this.toastr.error(
                    this.translate.instant(
                      "There was an error while trying to accept order."
                    ),
                    this.translate.instant("Error")
                  );
                } else if (status == 3) {
                  this.toastr.error(
                    this.translate.instant(
                      "There was an error while trying to abort order."
                    ),
                    this.translate.instant("Error")
                  );
                }
              }
            });
        }
      });
  }

  goBack() {
    this.userScalableToggle.content =
      "width=device-width, initial-scale=1.0, user-scalable=no";
    this.router.navigate(["/projects/view/" + this.order.pid]);
    this.projectsService.setCurrentTab(0);
  }

  calcContainerLineHeight() {
    if (!this.containerBlueScroll) return {};
    return {
      height: this.containerBlueScroll.nativeElement.scrollHeight  + 'px'
    }
  }
}
