import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Order } from "src/app/core/models/order";
import { CartService } from "src/app/core/services/cart.service";
import { Location } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
})
export class CartComponent implements OnInit {
  public disabled = false;
  public id: any;
  public orders: any[];
  public cust_trans: any[];
  public filterMenu: boolean = false;
  public getCartItems: number;
  public project: any;
  public generalImage: any;
  public language;
  public sendEmail: boolean = true;
  public spinner = false;

  @Input() orderData: Order;
  @Input() delivery: any;

  @Output() data: EventEmitter<any> = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private location: Location,
    private translate: TranslateService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.language = sessionStorage.getItem("lang") || "en";

    const orderData = JSON.parse(sessionStorage.getItem("orderData"));
    this.translate.use(this.language);

    if (!orderData) {
      this.router.navigate(["/projects"]);
      return;
    }

    this.cartService.orderData.subscribe((orderData: Order) => {
      if (orderData === null) {
        return;
      }
      this.orderData = orderData;
    });

    this.orders = this.route.snapshot.data["orders"];
  }

  quantityChange(e, i) {
    if (e.target.className === "plus") {
      this.orderData.items[i].quantity += 1;
    } else {
      if (this.orderData.items[i].quantity > 1) {
        this.orderData.items[i].quantity -= 1;
      }
    }
    sessionStorage.setItem("orderData", JSON.stringify(this.orderData));
  }

  removeItem(i) {
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

          this.cartService
            .removeOrderItem(this.orderData.items[i].itemId)
            .subscribe((res: any) => {
              if (res.status) {
                const id = this.orderData.items[i].materialId;
                this.orderData.items.splice(i, 1);
                sessionStorage.setItem(
                  "orderData",
                  JSON.stringify(this.orderData)
                );
                this.cartService.updateCartItems(this.orderData.items.length);
                this.data.emit(id);
                this.cartService.orderData.next(this.orderData);
                this.toastr.success(
                  this.translate.instant("Item successfully removed.") + ".",
                  this.translate.instant("Success")
                );
              }

              this.spinner = false;
            });
        }
      });
  }

  removeData(e) {
    e.preventDefault();
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
          this.cartService
            .removeOrder({ orderId: this.orderData.orderID })
            .subscribe((res) => {
              this.disabled = false;
              sessionStorage.removeItem("orderData");
              this.cartService.orderData.next(null);
              this.router.navigate([
                "/projects/view/",
                this.orderData.projectId,
              ]);
            });
        }
      });
  }

  makeOrder() {
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
          this.sendEmail = false;
          const data = JSON.parse(sessionStorage.getItem("orderData"));
          data.ordererId = JSON.parse(
            sessionStorage.getItem("userDetails")
          ).user_id;
          this.cartService.updateCartItems(0);
          this.disabled = true;

          this.spinner = true;

          this.cartService.sendOrder(data).subscribe((res) => {
            this.disabled = false;
            this.spinner = false;
            this.toastr.success(
              this.translate.instant("Order email sent to") +
                ": " +
                data.deliverEmail,
              this.translate.instant("Success")
            );
            this.router.navigate(["/projects/view/", this.orderData.projectId]);
            sessionStorage.removeItem("orderData");
            this.cartService.updateCartItems(0);
          });
        }
      });
  }

  goBack() {
    this.location.back();
  }

  currentDate(type) {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();

    let dateFormat = yyyy + "-" + mm + "-" + dd;

    if (type === "time") {
      const hours = today.getHours();
      const minutes = today.getMinutes();
      dateFormat =
        hours.toString() +
        ":" +
        (minutes > 9 ? minutes : "0" + minutes.toString());
    }
    return dateFormat;
  }
}
