import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { InvoicesService } from "src/app/core/services/invoices.service";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";

declare var $;

@Component({
  selector: "app-invoice",
  templateUrl: "./invoice.component.html",
  styleUrls: ["./invoice.component.css", "../../../utility/radio-button.css"],
})
export class InvoiceComponent implements OnInit {
  public invoices;
  public language = "en";
  public week = "Week";
  public page = 1;
  public numberOfRowsArray = [];
  public allInvoices = [];
  public originalInvoices = [];
  public showPaginate: boolean = true;
  public statusObject: any = {
    "0": true,
    "1": true,
    "4": true,
    "6": true,
    "3": true,
    "5": true,
    "2": true,
  };

  @ViewChild("selectedDate") selectedDateInput: ElementRef;
  @ViewChild("selectStatus") selectStatusInput: ElementRef;
  @ViewChild("searchInput") searchInput: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private toastr: ToastrService,
    private router: Router,
    private dialog: MatDialog,
    private invoiceService: InvoicesService
  ) {}

  ngOnInit() {
    this.language = sessionStorage.getItem("lang");
    this.translate.use(this.language);
    this.invoices = this.route.snapshot.data["invoices"];
    this.originalInvoices = JSON.parse(JSON.stringify(this.invoices));

    if(this.invoices && this.invoices.length > 0) {
        this.numberOfRowsArray = new Array(
          Math.ceil(this.invoices[0].numberOfRows / 20)
        );
    }

    this.invoiceService.getInvoices(0).subscribe((invoices: any) => {
      this.allInvoices = invoices;
    });

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
      .on("changeDate", (e) => {
        this.onChange(
          e.target,
          this.selectStatusInput.nativeElement,
          this.searchInput.nativeElement
        );
      });
  }

  onChange(selectedDate, selectedStatus, searchInput) {
    if (
      searchInput.value != "" ||
      selectedStatus.value != "0" ||
      selectedDate.value != ""
    )
      this.showPaginate = false;
    else this.showPaginate = true;

    if (
      searchInput.value.trim() === "" &&
      selectedDate.value.trim() === "" &&
      selectedStatus.value == 0
    ) {
      if (this.statusObject[selectedStatus.value]) {
        this.invoices = this.originalInvoices;
        this.showPaginate = true;
      } else {
        this.invoices = [];
        this.showPaginate = false;
      }

      return;
    }

    this.invoices = this.allInvoices.filter((invoice) => {
      var searchQuery = [
        "Id",
        "Project",
        "Client",
        "InvoiceDate",
        "Total",
      ].some((property) => {
        if (invoice[property]) {
          return invoice[property]
            .toLowerCase()
            .includes(searchInput.value.toLowerCase());
        } else {
          return false;
        }
      });

      return (
        searchQuery &&
        (selectedStatus.value == 0 || this.statusObject[invoice["Status"]]) &&
        (selectedDate.value == "" ||
          invoice.InvoiceDate == selectedDate.value.split(" ")[0])
      );
    });
  }

  viewEditInvoice(id, status, url) {
    if (status == 1) {
      this.router.navigate(["invoices", "details", id]);
    } else {
      this.router.navigate(["invoices", "details", id]);
    }
  }

  removeInvoice(invoice, event, i) {
    event.stopPropagation();
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
          this.invoiceService.removeInvoice(invoice).subscribe((res) => {
            if (res) {
              this.invoices.splice(i, 1);
              this.toastr.success(
                this.translate.instant("Successfully removed invoice."),
                this.translate.instant("Success")
              );
            }
          });
        }
      });
  }

  paginate(newPage) {
    if (newPage > this.numberOfRowsArray.length || newPage < 1) {
      return;
    }

    this.invoiceService.getInvoices(newPage).subscribe((invoices) => {
      this.invoices = invoices;
      this.originalInvoices = JSON.parse(JSON.stringify(invoices));
      this.page = newPage;
    });
  }

  get nextPage() {
    return this.page + 1;
  }

  get previousPage() {
    return this.page - 1;
  }

  onStatusChange(value) {
    const status = !this.statusObject[value];

    if (value == "0") {
      this.checkAll(status);
    } else {
      if (!status) {
        this.statusObject["0"] = false;
      }
      this.statusObject[value] = status;
    }

    this.onChange(
      this.selectedDateInput.nativeElement,
      { value: value },
      this.searchInput.nativeElement
    );
  }

  checkAll(status) {
    const keys = Object.keys(this.statusObject);

    keys.forEach((key) => {
      this.statusObject[key] = status;
    });
  }
}
