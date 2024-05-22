import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { CartService } from "src/app/core/services/cart.service";
import { Order } from "src/app/core/models/order";

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";
import { AppService } from "src/app/core/services/app.service";
import { TranslateService } from "@ngx-translate/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";

@Component({
  selector: "app-sub-category",
  templateUrl: "./sub-category.component.html",
  styleUrls: ["./sub-category.component.css"],
  animations: [
    // Define Animation

    trigger("myfirstanimation", [
      state("Cart", style({ right: "-95%" })),
      state("Close", style({ right: "0" })),

      transition("Cart <=> Close", animate("200ms ease-in")),
    ]),

    trigger("mysecondanimation", [
      state("Cart", style({ opacity: "0" })),
      state("Close", style({ opacity: "1" })),

      transition("Cart <=> Close", animate("200ms ease-out")),
    ]),
  ],
})
export class SubCategoryComponent implements OnInit {
  public userDetails: any;
  public materials: any[];
  public orderData: Order;
  public language: any;
  state: string = "Close";
  public delivery: any;
  public currentAddRoute: string;
  public previousRoute: string;
  public categoryID: number;

  total;
  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private dialog: MatDialog,
    private router: Router,
    private appService: AppService,
    private translate: TranslateService
  ) {
    this.language = sessionStorage.getItem("lang");
  }

  ngOnInit() {
    this.language = sessionStorage.getItem("lang");
    this.translate.use(this.language);

    this.categoryID = this.route.snapshot.params.category_id;
    this.materials = this.route.snapshot.data["materials"]["items"];
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    this.orderData = JSON.parse(sessionStorage.getItem("orderData"));

    this.appService.setShowAddButton = false;
    this.previousRoute = "orders/categories";
    this.appService.setBackRoute(this.previousRoute);

    this.cartService.getCartItems().subscribe((value) => {
      this.total = value;
    });

    this.cartService.getShowCartIcon().subscribe((value) => {
      this.animateMe();
    });
  }

  canActive() {
    return this.orderData.items.length > 0;
  }

  removeData(e) {
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
          sessionStorage.removeItem("orderData");
          this.cartService.updateCartItems(0);
          this.cartService.orderData.next(null);
          this.router.navigate(["/orders/new", this.orderData.projectId]);
        }
      });
    e.preventDefault();
  }

  animateMe() {
    this.state = this.state === "Cart" ? "Close" : "Cart";
  }

  removeItem(i) {
    this.orderData.items.splice(i, 1);
    sessionStorage.setItem("orderData", JSON.stringify(this.orderData));
    this.cartService.updateCartItems(this.orderData.items.length);
  }
}
