import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProjectsService } from "src/app/core/services/projects.service";
import { AppService } from "src/app/core/services/app.service";
import { CartService } from "src/app/core/services/cart.service";
import { ToastrService } from "ngx-toastr";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";

declare var $: any;

@Component({
  selector: "delivery-order",
  templateUrl: "./delivery-order.component.html",
  styleUrls: ["./delivery-order.component.css"],
})
export class DeliveryOrderComponent implements OnInit {
  name: string;
  email: string;
  message: string;
  public orders: any;
  public language = "en";
  public week = "Week";
  orderDate: any;
  orderTime: any;
  public messageStatus = -1;
  public order;
  public suppliers: any;
  public supplierId: any = -1;
  public comment: any;
  public ordererId: any;
  public status: any = -1;
  public orderForm: FormGroup;
  public spinner = false;
  public userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

  constructor(
    private appService: AppService,
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private cartService: CartService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {
    this.language = sessionStorage.getItem("lang");
    this.translate.use(this.language);
  }

  ngOnInit() {
    this.suppliers = this.route.snapshot.data["suppliers"];
    this.orders = this.route.snapshot.data["orders"];
    this.orderDate = this.route.snapshot.data["order"]["data"];
    this.orderTime = this.route.snapshot.data["order"]["time"];
    this.order = this.route.snapshot.data["getOrder"];

    this.orderForm = this.fb.group({
      date: [this.orderDate, [Validators.required]],
      time: [this.orderTime, [Validators.required]],
      supplier: ["", [Validators.required]],
      message: [""],
    });

    $("#timeSelect")
      .timepicker({
        showMeridian: false,
        defaultTime: this.orderTime,
      })
      .on("changeTime.timepicker", (e) => {
        if (e.target.value.length > 0) {
          this.orderForm.patchValue({
            time: e.target.value,
          });
        }
      });

    this.appService.setBackRoute("/projects/view/" + this.order.pid);
    this.appService.setShowAddButton = false;

    $("#dateSelect")
      .datepicker({
        format: "yyyy-mm-dd",
        calendarWeeks: true,
        autoclose: true,
        language: this.language,
        currentWeek: true,
        todayHighlight: true,
        currentWeekTransl: this.week,
        currentWeekSplitChar: "-",
        startDate: new Date(),
        weekStart: 1,
      })
      .on("changeDate", (e) => {
        this.orderForm.patchValue({
          date: e.target.value,
        });
      })
      .on("blur", (e) => {
        e.target.value = this.orderForm.value.date;
      });
  }

  processForm() {
    const data = this.orderForm.value;
    if (this.orderForm.invalid) {
      this.toastr.error(
        this.translate.instant("You didn't fill the requierd fields!"),
        this.translate.instant("Error")
      );
      return;
    }

    this.spinner = true;

    this.cartService
      .orderUnload(
        data.date,
        data.time,
        data.supplier,
        data.message,
        this.route.snapshot.params.id,
        this.status
      )
      .subscribe((res) => {
        this.spinner = false;
        this.router.navigate(["/projects/view/" + this.order.pid]);
        this.toastr.success(
          this.translate.instant(
            "You have successfully submitted your unloading request!"
          ),
          this.translate.instant("Success")
        );
      });
  }

  goBack() {
    this.router.navigate(["/projects/view/" + this.order.pid]);
    this.projectsService.setCurrentTab(0);
  }
}
