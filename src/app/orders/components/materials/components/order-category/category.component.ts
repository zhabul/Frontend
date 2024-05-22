import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Order } from "src/app/core/models/order";
import { CartService } from "src/app/core/services/cart.service";
import { AppService } from "src/app/core/services/app.service";
import { TranslateService } from "@ngx-translate/core";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.css"],
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
export class OrderCategoryComponent implements OnInit {
  public userDetails: any;
  public materials: any[];
  public categoryID: number;
  public categoryName: string;
  public canRemove: boolean;
  public orderData: Order;
  state: string = "Close";
  public language: any;
  public delivery: any;
  public currentAddRoute: string;
  public previousRoute: string;
  public cust_trans: any;

  total;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private appService: AppService,
    private translate: TranslateService,
    private dialog: MatDialog
  ) {
    this.language = sessionStorage.getItem("lang");
  }

  ngOnInit() {
    this.categoryID = this.route.snapshot.params.category_id;
    this.materials = this.route.snapshot.data["materials"]["items"];
    this.categoryName = this.route.snapshot.data["materials"]["name"];
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    this.canRemove = this.materials.length === 0;
    this.orderData = JSON.parse(sessionStorage.getItem("orderData"));

    this.language = sessionStorage.getItem("lang");
    this.translate.use(this.language);

    this.previousRoute =
      "/orders/materials/" + this.route.snapshot.data.materials.parentID;
    this.appService.setBackRoute(this.previousRoute);
    this.appService.setShowAddButton = false;

    this.cartService.getCartItems().subscribe((value) => {
      this.total = value;
    });

    this.cartService.getShowCartIcon().subscribe((value) => {
      this.animateMe();
    });
  }

  goBack() {
    this.router.navigate([
      "/orders/materials/" + this.route.snapshot.data.materials.parentID,
    ]);
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
