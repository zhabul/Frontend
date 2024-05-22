import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Order } from "src/app/core/models/order";
import { CartService } from "src/app/core/services/cart.service";
import { TranslateService } from "@ngx-translate/core";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";
import { AtaService } from "src/app/core/services/ata.service";
import { AppService } from "src/app/core/services/app.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-view-order-materials",
  templateUrl: "./view-order-materials.component.html",
  styleUrls: ["./view-order-materials.component.css"],
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
export class ViewOrderMaterialsComponent implements OnInit {
  state: string = "Close";

  public units: any[];
  public material: any;
  public materialProperties: string[] = [];
  public customPropError = false;
  public testPropError;

  public customMaterialQuantity = 0;

  public orderData: Order;
  public sidebar = false;
  public delivery: any;
  public ata: any;
  public language: any;

  public customProp: string = "";
  public testProp: string = "";
  public currentAddRoute: string;
  public previousRoute: string;
  flag: any = false;
  public oldFocusVal: number;

  public spinner = false;

  @ViewChild("properties") propertiesInput: ElementRef;
  @ViewChild("unitsSelect") unitsSelect: ElementRef;
  @ViewChild("unitsTest") unitsTest: ElementRef;

  public total;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private cartService: CartService,
    private translate: TranslateService,
    private ataService: AtaService,
    private appService: AppService
  ) {
    this.language = sessionStorage.getItem("lang");
  }

  increase() {
    this.cartService.updateCartItems(this.total + 1);
  }

  decrease() {
    this.cartService.updateCartItems(this.total - 1);
  }

  ngOnInit() {
    this.cartService.getCartItems().subscribe((value) => {
      this.total = value;
    });

    this.cartService.getShowCartIcon().subscribe((value) => {
      this.animateMe();
    });
    this.units = this.route.snapshot.data["units"];
    this.units = this.units.map((x) => this.translate.instant(x));

    this.orderData = JSON.parse(sessionStorage.getItem("orderData"));
    this.material = this.route.snapshot.data["material"];

    this.appService.setShowAddButton = false;

    this.previousRoute = "/orders/submaterials/" + this.material.parent_id;
    this.appService.setBackRoute(this.previousRoute);
    let default_unit = [];

    this.material["items"] = this.material["items"].map((m) => {
      m.highlighted =
        this.orderData.items.find((x) => x.materialId == m.id) != undefined;
      m.quantity = 0;
      if (m.unit) {
        m["units"] = m.unit.split(",");
        if (!default_unit.length) {
          default_unit = m["units"];
        }
      } else {
        m["units"] = [default_unit];
      }
      return m;
    });

    this.material["items"] = this.material["items"].map((m) => {
      if (!m.unit) {
        m["units"] = default_unit;
      }
      return m;
    });

    this.ataService.getAta(this.orderData.ataId).subscribe((reponse) => {
      this.ata = reponse["data"];
    });
  }

  addToCart(prop, unit, i, units) {
    units.children[i].style.background = "#d2eef4";
    this.material["items"][i].highlighted = true;
    if (!this.orderData.supplierId) {
      this.orderData.supplierId = this.material["supplierId"];
      this.orderData.deliverEmail = this.material["DelivererEmail"];
      this.flag = true;
    } else if (this.orderData.supplierId != this.material["supplierId"]) {
      this.toastr.info(
        this.translate.instant(`You are not able to make an order
      because you are already set another supplier`) + ".",
        this.translate.instant("Info")
      );
      return;
    }

    const item: any = {
      name: this.material["name"],
      prop: prop.property,
      quantity: prop.quantity,
      unit: unit,
      materialId: this.material["items"][i].id,
      orderId: this.orderData.orderID,

      supplierId: this.orderData.supplierId,
      supplierEmail: this.orderData.deliverEmail,
    };

    this.spinner = true;

    this.cartService.newOrderItem(item).subscribe((res: any) => {
      if (res.status) {
        item.itemId = res.itemId;
        item.article = res.itemId;
        this.orderData.items.push(item);
        this.cartService.orderData.next(this.orderData);
        sessionStorage.setItem("orderData", JSON.stringify(this.orderData));
        this.toastr.success(
          this.translate.instant("You have successfully added item."),
          this.translate.instant("Success")
        );
      }

      this.spinner = false;
    });
  }

  addToCartCustom() {
    if (!this.orderData.supplierId) {
      this.orderData.supplierId = this.material["supplierId"];
      this.orderData.deliverEmail = this.material["DelivererEmail"];
    } else if (this.orderData.supplierId != this.material["supplierId"]) {
      this.toastr.info(
        this.translate.instant(`You are not able to make an order
      because you are already set another supplier`) + ".",
        this.translate.instant("Info")
      );
      return;
    }

    if (this.customProp.length > 0) {
      const unit =
        this.unitsSelect.nativeElement.options[
          this.unitsSelect.nativeElement.selectedIndex
        ].value;

      const item: any = {
        name: this.material["name"],
        prop: this.customProp,
        quantity: this.customMaterialQuantity,
        unit: unit,
        materialId: this.material["items"][0].id,
        orderId: this.orderData.orderID,

        supplierId: this.orderData.supplierId,
        supplierEmail: this.orderData.deliverEmail,
      };

      this.spinner = true;

      this.cartService.newOrderItem(item).subscribe((res: any) => {
        if (res.status) {
          item.itemId = res.itemId;
          this.orderData.items.push(item);
          this.cartService.orderData.next(this.orderData);
          sessionStorage.setItem("orderData", JSON.stringify(this.orderData));
          this.cartService.orderData.next(this.orderData);
          this.customPropError = false;
          this.customMaterialQuantity = 0;
          this.state = "Close";
          this.toastr.success(
            this.translate.instant("You have successfully added item.") + ".",
            this.translate.instant("Success")
          );
        }

        this.spinner = false;
      });
    } else {
      this.customPropError = true;
    }
  }

  addToCartTest() {
    if (this.testProp.length > 0) {
      const unit =
        this.unitsTest.nativeElement.options[
          this.unitsTest.nativeElement.selectedIndex
        ].value;
      this.orderData.items.push({
        name: this.material["name"],
        prop: this.testProp,
        quantity: this.customMaterialQuantity,
        unit,
      });
      sessionStorage.setItem("orderData", JSON.stringify(this.orderData));
      this.cartService.updateCartItems(this.total + 1);
      this.testPropError = false;
    } else {
      this.testPropError = true;
    }
  }
  quantityChange(e, i) {
    if (e.target.className.includes("plus")) {
      this.material["items"][i].quantity += 1;
    } else if (e.target.className.includes("minus")) {
      if (this.material["items"][i].quantity >= 1) {
        this.material["items"][i].quantity -= 1;
      }
    } else {
      this.material["items"][i].quantity = parseInt(e.target.value);
    }
    sessionStorage.setItem("orderData", JSON.stringify(this.orderData));
  }

  focused(i) {
    this.oldFocusVal = this.material["items"][i].quantity;
    this.material["items"][i].quantity = "";
  }

  blurred(i) {
    if (this.material["items"][i].quantity == "") {
      this.material["items"][i].quantity = this.oldFocusVal;
    }
  }

  customQuantityChange(e) {
    if (e.target.classList.contains('plus')) {
      this.customMaterialQuantity += 1;
    } else if (e.target.classList.contains('minus')) {
      this.customMaterialQuantity -= 1;
    } else {
      this.customMaterialQuantity = parseInt(e.target.value);
    }

    sessionStorage.setItem("orderData", JSON.stringify(this.orderData));
  }

  animateMe() {
    this.state = this.state === "Cart" ? "Close" : "Cart";
  }

  goBack() {
    this.router.navigate(["/orders/submaterials/" + this.material.parent_id]);
  }

  removeItem(i) {
    this.orderData.items.splice(i, 1);
    sessionStorage.setItem("orderData", JSON.stringify(this.orderData));
    this.cartService.updateCartItems(this.orderData.items.length);
  }

  onData(e) {
    const index = this.material.items.findIndex((item) => item.id === e);
    if (index != -1) {
      this.material.items[index].highlighted = false;
    }
  }
}
