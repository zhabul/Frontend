import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

declare var $;

@Component({
  selector: "app-invoice",
  templateUrl: "./invoice.component.html",
  styleUrls: [
    "./invoice.component.css",
    "../../../../../../utility/radio-button.css",
  ],
})
export class InvoiceComponent implements OnInit {
  public invoices: any[] = [];
  public allInvoices: any[] = [];
  public project;
  private selectedDate: any = 0;
  public language = "en";
  public week = "Week";
  public statusObject: any = {
    "0": true,
    "1": true,
    "2": true,
    "3": true,
    "4": true,
    "5": true,
    "6": true,
  };
  public userDetails;

  @ViewChild("selectedDate") selectedDateInput: ElementRef;
  @ViewChild("selectStatus") selectStatusInput: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userDetails = JSON.parse(sessionStorage.getItem('userDetails'));
    this.language = sessionStorage.getItem("lang");
    this.translate.use(this.language);

    this.project = this.route.snapshot.data["project"];
    this.allInvoices = this.route.snapshot.data["invoices"] || [];
    this.invoices = this.route.snapshot.data["invoices"] || [];

    $("#dateSelect")
      .datepicker({
        format: "yyyy-mm-dd",
        calendarWeeks: true,
        autoclose: true,
        language: this.language,
        currentWeek: true,
        currentWeekTransl: this.week,
        todayHighlight: true,
        currentWeekSplitChar: "-",
        weekStart: 1
      })
      .on("changeDate", (ev) => {
        this.onSelected(ev.target, this.selectStatusInput.nativeElement);
      });

    this.filterInvoices();
  }

  onSelected(selectedDate, selectedStatus) {
    this.selectedDate = selectedDate.value.split(" ")[0];
    this.filterInvoices();
  }

  filterInvoices() {
    const statusList = this.getActiveStatusList();
    const date = this.selectedDate ? new Date(this.selectedDate) : false;

    this.invoices = this.allInvoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.InvoiceDate);
      const dateCondition = date ? invoiceDate === date : true;
      return statusList.includes(invoice.Status) && dateCondition;
    });
  }

  getActiveStatusList() {
    const keys = Object.keys(this.statusObject);
    const list = [];
    keys.forEach((key) => {
      if (this.statusObject[key]) {
        list.push(key);
      }
    });
    return list;
  }
/*
  viewEditInvoice(id, status) {
    this.router.navigate(["/invoices/details", id], {
      queryParams: { p: this.project.id },
    });
  }*/

  getTotal() {
    let total = 0;
    this.invoices.forEach((invoice) => {
      total += Number(invoice.Total);
    });
    return total;
  }

  onStatusChange(date, value) {
    const status = !this.statusObject[value];
    if (value == "0") {
      this.checkAll(status);
    } else {
      if (!status) {
        this.statusObject["0"] = false;
      }
      this.statusObject[value] = status;
    }
    this.filterInvoices();
  }

  checkAll(status) {
    const keys = Object.keys(this.statusObject);

    keys.forEach((key) => {
      this.statusObject[key] = status;
    });
  }

  viewEditInvoice(id, status, url, index, parent) {

    const parent_invoice = this.invoices.find((x) => x.Id == parent);

    if(parent_invoice) {
      if (status == 1) {
        this.router.navigate(["invoices", "edit", id], { queryParams: { order_number: index, parent_invoice: parent_invoice.index, from_summary: true } });
      } else {
        this.router.navigate(["invoices", "edit", id], { queryParams: { order_number: index, parent_invoice: parent_invoice.index, from_summary: true } });
      }
    }else {
      if (status == 1) {
        this.router.navigate(["invoices", "edit", id], { queryParams: { order_number: index, from_summary: true } });
      } else {
        this.router.navigate(["invoices", "edit", id], { queryParams: { order_number: index, from_summary: true } });
      }
    }
  }
}
