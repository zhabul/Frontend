import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Order } from "src/app/core/models/order";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.css"],
})
export class OrdersComponent implements OnInit {
  public orders: any[];
  public orderData: Order;
  public projects: any[];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.orders = this.route.snapshot.data["orders"];
    this.orderData = JSON.parse(sessionStorage.getItem("orderData"));
    this.projects = this.route.snapshot.data["projects"];
  }
}
