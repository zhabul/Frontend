import { Component, Inject, OnInit } from "@angular/core";
import {  MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { CartService } from "src/app/core/services/cart.service";

declare var $: any;

@Component({
  selector: "app-change-order-date",
  templateUrl: "./change-order-date.component.html",
  styleUrls: ["./change-order-date.component.css"],
})
export class ChangeOrderDateComponent implements OnInit {
  public messageStatus = -1;
  public dateSelected = false;
  orderDate: [];
  projectID: [];
  public language = "en";
  public week = "Week";
  public project: any;
  public order;
  public spinner: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    public dialogRef: MatDialogRef<ChangeOrderDateComponent>,
  ) {
    this.language = sessionStorage.getItem("lang");
    this.translate.use(this.language);
    this.orderDate = this.modal_data.data.date;
    this.projectID = this.modal_data.data.id;
  }

  ngOnInit() {
    this.order = this.route.snapshot.data["getOrder"];
    //  this.orderDate = this.order.date;

    setTimeout(() => {
      $("#dateSelect")
        .datepicker({
          format: "yyyy-mm-dd",
          calendarWeeks: true,
          autoclose: true,
          language: this.language,
          currentWeek: false,
          todayHighlight: false,
          currentWeekTransl: this.week,
          currentWeekSplitChar: "-",
          weekStart: 1,
        })
        .on("changeDate", (ev) => {
          this.onDateChange(ev);
        });
    }, 50);
  }

  numOfWeeks(t) {
    t.setHours(0, 0, 0, 0), t.setDate(t.getDate() + 3 - ((t.getDay() + 7) % 7));
    var e = new Date(t.getFullYear(), 0, 4);
    return (
      1 +
      Math.round(
        ((t.getTime() - e.getTime()) / 864e5 - 3 + ((e.getDay() + 6) % 7)) / 7
      )
    );
  }

  onDateChange(e) {
    if (e.target.value.length > 0) {
      this.orderDate = e.target.value;
      this.dateSelected = true;
    }
  }
  next(e) {
    this.spinner = true;
    this.cartService
      .updateOrder(this.projectID, this.orderDate)
      .subscribe((res) => {

        if(res){
          this.spinner = false;
          this.dialogRef.close(`${this.orderDate}`);
        }
      });

    /* potrebno zavrsiti unutar updateOrder if res true, i ubaciti spinner. Cekamo da se provjeri šta nije uredu na backendu. */
  }


  goBack(parameter = false) {
        this.dialogRef.close(parameter);
    }
}
