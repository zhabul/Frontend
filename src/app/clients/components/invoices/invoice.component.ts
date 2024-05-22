import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { InvoicesService } from "src/app/core/services/invoices.service";

declare var $;

@Component({
  selector: "app-invoice",
  templateUrl: "./invoice.component.html",
  styleUrls: ["./invoice.component.css"],
})
export class InvoiceComponent implements OnInit {
  public invoices;
  private selectedDate: any = 0;
  private selectedStatus: any = 0;
  private searchText: any = 0;
  public language = "en";
  public week = "Week";
  public client;
  public theClient;

  @ViewChild("selectedDate") selectedDateInput: ElementRef;
  @ViewChild("selectStatus") selectStatusInput: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoicesService
  ) {}

  ngOnInit() {
    this.invoices = this.route.snapshot.data["invoices"];
    this.client = this.route.snapshot.data["client"];
    this.theClient = this.route.snapshot.data["theClient"];
    this.theClient = this.route.snapshot.data["theClient"];

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
        weekStart: 1
      })
      .on("changeDate", (ev) => {
        this.onSelected(ev.target, this.selectStatusInput.nativeElement);
      });

    this.filterInvoices(this.invoices);
  }

  onSelected(selectedDate, selectedStatus) {
    this.selectedStatus = selectedStatus.value;

    if (selectedDate.value == "") {
      this.selectedDate = 0;
    } else {
      this.selectedDate = selectedDate.value;
    }

    this.invoiceService
      .searchByStatus(this.selectedDate, this.selectedStatus, this.searchText)
      .subscribe((response) => {
        if (response["data"]) {
          response["data"].map((p) => {
            p["expanded"] = false;
            p["visible"] = true;
            p["l_status"] = 0;
            p["branch"] = 0;
            p["noExpand"] = p["childs"] == 0;
          });
          this.invoices = response["data"];
        } else {
          this.invoices = [];
        }
      });
  }

  viewEditInvoice(id, client) {
    this.router.navigate(["clients", "invoice", id, client]);
  }

  filterInvoices(invoices) {
    this.invoices = invoices.filter((invoice) => {
      return invoice.ClientId == this.client.id;
    });
  }
}
