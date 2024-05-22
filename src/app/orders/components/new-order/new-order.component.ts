import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  AfterViewInit,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Order } from "../../../core/models/order";
import { FormGroup, FormBuilder } from "@angular/forms";
import { CartService } from "src/app/core/services/cart.service";
import { AtaService } from "src/app/core/services/ata.service";
import { TranslateService } from "@ngx-translate/core";
import { AppService } from "src/app/core/services/app.service";
import { GeneralsService } from "src/app/core/services/generals.service";
import { ToastrService } from "ngx-toastr";
import { InitProvider } from "src/app/initProvider";

declare var $: any;

@Component({
  selector: "app-new-order",
  templateUrl: "./new-order.component.html",
  styleUrls: ["./new-order.component.css"],
})
export class NewOrderComponent
  implements OnInit, AfterViewChecked, AfterViewInit
{
  public order: any;
  public emails: any[];
  public deliveries: any[];
  public createForm: FormGroup;
  public orderData: Order = {
    projectId: -1,
    projectNumber: "",
    date: "",
    time: "",
    workplace: "",
    zip: "",
    street: "",
    city: "",
    items: [],
    deliverEmail: "",
    other: "",
    ataId: -1,
    currentDate: "",
    currentTime: "",
    deliveryId: -1,
    deliveryName: "",
    ataNumber: -1,
    orderID: -1,
  };
  public messageStatus = -1;
  public projectSelectDisable = false;
  public dateSelected = false;
  public timeSelected = false;
  public delivererSelect = false;
  public canInputTime = false;
  public canInputDelivery = false;
  public canInputDate = false;
  public language = "en";
  public week = "Week";
  public client_workers: any;
  public atas: any;
  public project: any;
  public message: any;
  public projectName: string;
  public users: any[] = [];
  public projectUsers: any[] = [];
  public projectID: any;
  public currentAddRoute: string;
  public previousRoute: string;
  public spinner = false;
  public orderAccess = false;
  public userDetails = { show_project_Order: 0 };

  @ViewChild("dateSelect") dateSelectInput: ElementRef;

  public orderForm = this.fb.group({
    project: ["", []],
    project_name: ["", []],
  });

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private ataService: AtaService,
    private translate: TranslateService,
    private appService: AppService,
    private generalsService: GeneralsService,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public initProvider: InitProvider
  ) {
    this.language = sessionStorage.getItem("lang");
    this.translate.use(this.language);
  }

  ngAfterViewInit() {}

  ngAfterViewChecked() {
    $("#timeSelect")
      .timepicker({
        showMeridian: false,
        defaultTime: "00:00",
      })
      .on("changeTime.timepicker", (e) => {
        if (e.target.value.length > 0) {
          this.orderData.time = e.target.value;
          this.timeSelected = true;
        }
      });

    $("#dateSelect")
      .datepicker({
        format: "yyyy-mm-dd",
        calendarWeeks: true,
        autoclose: true,
        language: this.language,
        todayHighlight: true,
        startDate: new Date(),
        weekStart: 1
      })
      .on("changeDate", (ev) => {
        this.onDateChange(ev);
      });
  }
  ngOnInit() {

    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    this.projectID = this.route.snapshot.paramMap.get("id");
    this.message = this.translate.instant(
      "You are not able to go to Orders, because you don`t have any Project created!"
    );
    this.emails = this.route.snapshot.data["emails"];
    this.project = this.route.snapshot.data["project"];
    this.projectName = this.project.name;
    this.deliveries = this.route.snapshot.data["deliveries"];
    const usersResolve = this.route.snapshot.data["users"];

    this.users = usersResolve[1].concat(usersResolve[0].data);
    this.users.unshift({
      finalName: this.translate.instant("Select Contact Person"),
      value: "",
    });
    this.projectUsers = [
      {
        finalName: this.project.deliveryFullName,
        id: this.project.deliveryContact,
        value: this.project.deliveryContact,
        mobile: this.project.deliveryMobileNumber,
      },
    ];
    this.appService.setShowAddButton = false;
    this.previousRoute = "/projects/view/" + this.project.id;
    this.appService.setBackRoute(this.previousRoute);
    this.orderForm
      .get("project_name")
      .setValue(this.translate.instant("Select Contact Person"));
    let deliveriesForTrans = [];
    this.deliveries.forEach((x) => {
      deliveriesForTrans.push(x["deliveryName"]);
    });
    this.translate.get(deliveriesForTrans).subscribe((tran: any[]) => {
      this.deliveries.forEach((x) => {
        if (tran[x["deliveryName"]] != undefined) {
          x["deliveryName"] = tran[x["deliveryName"]];
        }
      });
    });

    this.renderAta(this.project.id);

    $("#dateSelect")
      .datepicker({
        format: "yyyy-mm-dd",
        calendarWeeks: true,
        autoclose: true,
        language: this.language,
        todayHighlight: true,
        weekStart: 1
      })
      .on("changeDate", (ev) => {
        this.onDateChange(ev);
      });

    this.orderData.projectId = this.project.id;
    this.orderData.projectName = this.projectName;
    this.orderData.email = this.project["email"];
    this.orderData.workplace = this.project["workplace"];
    this.orderData.street = this.project["street"];
    this.orderData.zip = this.project["zip"];
    this.orderData.date = this.project["date"];
    this.orderData.time = this.project["time"];
    this.orderData.other = this.project["other"];
    this.orderData.currentDate = this.project["currentDate"];
    this.orderData.currentTime = this.project["currentTime"];
    this.orderData.projectNumber = this.project["CustomName"];
    this.orderData.city = this.project["city"];

    if (this.projectUsers.length > 0) {
      this.orderData.contactName1 = this.projectUsers[0]["finalName"];
      this.orderData.contactPhone1 = this.projectUsers[0]["mobile"];
    }

    sessionStorage.setItem("orderData", JSON.stringify(this.orderData));

    this.orderAccess = this.userDetails.show_project_Order && this.initProvider.hasComponentAccess('orders');
    this.redirectIfHasNoAccess();

  }

  redirectIfHasNoAccess() {
    if (!this.orderAccess) {
      this.router.navigate(["/"]);
    }
  }

  renderAta(projectID) {
    this.ataService.getAtas(projectID).subscribe((response) => {
      if (response["status"]) {
        this.atas = response["data"];
      } else {
        this.atas = [];
        if (this.orderData.ataId == -1 || this.orderData.ataId == 0) {
          this.orderData.ataId = null;
        }
      }
    });
  }

  onAtaChange(e) {
    if (e.target.selectedOptions[0].value) {
      this.orderData.ataId = e.target.selectedOptions[0].value;
      let ataNameIndex = this.atas.findIndex(
        (i) => i.id == e.target.selectedOptions[0].value
      );
      this.orderData.ataNumber = this.atas[ataNameIndex]
        ? this.atas[ataNameIndex].AtaNumber
        : null;
    }
  }

  onDateChange(e) {
    if (e.target.value.length > 0) {
      this.orderData.date = e.target.value;
      this.dateSelected = true;
    }
  }

  onDelivererChange(e) {
    if (e.target.value.length > 0) {
      this.orderData.deliverEmail = e.target.value;

      this.delivererSelect = true;
    }
  }

  next(e) {
    e.preventDefault();
    if (this.orderData.deliveryName == "" && this.orderData.deliveryId == -1) {
      this.toastr.error(
        this.translate.instant("Way of delivery is required") + ".",
        this.translate.instant("Error")
      );
      return;
    }

    if (this.spinner === true) {
      return;
    }

    this.spinner = true;
    const data = this.orderData;

    data.ordererId = JSON.parse(sessionStorage.getItem("userDetails")).user_id;
    this.cartService.updateCartItems(0);

    let key = {
        key: "Logo",
    };

    this.generalsService.getSingleGeneralByKey(key).subscribe((res2) => {
      this.orderData.generalImage = res2["data"][0]["value"];

      this.cartService.newOrder(data).subscribe((res: any) => {
        if (res.status) {
          this.orderData.orderID = res.orderId;
          this.orderData.token = res.token;
          this.cartService.orderData.next(this.orderData);
          sessionStorage.setItem("orderData", JSON.stringify(this.orderData));

          this.cartService.updateCartItems(0);
          this.spinner = false;
          this.router.navigate(["orders", "categories"]);
        }
      });
    });
  }

  setContact(e, index) {
    if (index == 0) {
      const contact = this.projectUsers[e.target.selectedOptions[0].value];
      this.orderData.contactName1 = contact["finalName"];
      this.orderData.contactPhone1 = contact["mobile"];
    } else if (e.index > -1) {
      const contact = this.users[e.index];
      const name = e.finalName;

      if (name != "-") {
        this.orderData.contactName2 = contact["finalName"];
        this.orderData.contactPhone2 = contact["Mobile"];
      } else {
        this.orderData.contactName2 = null;
        this.orderData.contactPhone2 = null;
      }
    }
  }

  setDelivery(index) {
    if (index == -1) {
      this.orderData.deliveryName = "";
      this.orderData.deliveryId = -1;
    } else if (index == "") {
      this.orderData.deliveryName = "";
      this.orderData.deliveryId = 0;
    } else {
      const delivery = this.deliveries[index];

      this.orderData.deliveryName = delivery["deliveryName"];
      this.orderData.deliveryId = delivery["deliveryId"];
    }
  }
}
