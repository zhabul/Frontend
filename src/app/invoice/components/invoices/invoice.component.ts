import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { InvoicesService } from "src/app/core/services/invoices.service";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { ProjectsService } from "src/app/core/services/projects.service";

declare var $;

@Component({
  selector: "app-invoice",
  templateUrl: "./invoice.component.html",
  styleUrls: ["./invoice.component.css", "../../../utility/radio-button.css"],
})
export class InvoiceComponent implements OnInit, AfterViewInit {

    public invoices;
    public language = "en";
    public week = "Week";
    public page = 1;
    public numberOfRowsArray = [];
    public allInvoices = [];
    public originalInvoices = [];
    public showPaginate: boolean = true;
    public userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    public statusObject: any = {
        "0": true,
        "1": true,
        "4": true,
        "6": true,
        "3": true,
        "5": true,
        "2": true,
    };
    public hoverColor = 'var(--project-color)'
    public invoicesCopy;
    public spinner:boolean = false;
    public scrollHeight = { clientHeight: 0 };
    public onScrollEvent: Subject<any> = new Subject<any>();
    onScrollObservable$ = this.onScrollEvent.asObservable();
    public from_edit:boolean = false;

    @ViewChild("selectedDate") selectedDateInput: ElementRef;
    @ViewChild("selectStatus") selectStatusInput: ElementRef;
    @ViewChild("searchInput") searchInput: ElementRef;

    constructor(
        private route: ActivatedRoute,
        private translate: TranslateService,
        private toastr: ToastrService,
        private router: Router,
        private dialog: MatDialog,
        private invoiceService: InvoicesService,
        private projectService: ProjectsService,
    ) {}

    ngOnInit() {

        if(!this.userDetails.show_invoices_Global) {
            this.router.navigate(["/home"]);
        }

        this.route.queryParamMap.subscribe((params) => {
            this.from_edit = params.get("from_edit") ? JSON.parse(params.get("from_edit")) : false;
        });

        if(!this.from_edit) {
            sessionStorage.removeItem("filterInvoicesBySearch");
        }

        this.onScrollEvent.subscribe((e) => {

            if(/*mainContainer1.bottom < 936*/ (e.target.offsetHeight + e.target.scrollTop) > e.target.scrollHeight){
                this.paginate(this.nextPage)
            }else{
                return false;
            }
        });

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
            this.paginate(this.nextPage)
        });

        $("#dateSelect").datepicker({
            format: "yyyy-mm-dd",
            calendarWeeks: true,
            autoclose: true,
            language: this.language,
            currentWeek: true,
            currentWeekTransl: this.week,
            todayHighlight: true,
            currentWeekSplitChar: "-",
            weekStart: 1
        }).on("changeDate", (e) => {
            this.onChange(
                this.selectStatusInput.nativeElement,
                this.searchInput.nativeElement
            );
        });
    }

    ngAfterViewInit() {
        this.refreshSearch();
    }

    refreshSearch() {
        let filterUsersBySearch = JSON.parse(sessionStorage.getItem("filterInvoicesBySearch"));
        if(filterUsersBySearch && filterUsersBySearch.length > 0) {
            let search = document.getElementById('searchInput') as HTMLInputElement;
            search.value = filterUsersBySearch;
            this.onChange(null, search);
        }
    }

    onChange( selectedStatus, searchInput ) {

        if(searchInput.value != "") {
            sessionStorage.setItem("filterInvoicesBySearch", JSON.stringify(searchInput.value));
        }

        if (
            searchInput.value != "" ||
            selectedStatus.value != "0"
        ){
            this.showPaginate = false;
        }else{
            this.showPaginate = true;
        }

        if (
            searchInput.value.trim() === "" &&
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
                (selectedStatus.value == 0 || this.statusObject[invoice["Status"]])
            );
        });
    }

  viewEditInvoice(id, status, url, index, parent) {

    const parent_invoice = this.invoices.find((x) => x.Id == parent);

    if(parent_invoice) {
      if (status == 1) {
        this.router.navigate(["invoices", "edit", id], { queryParams: { order_number: index, parent_invoice: parent_invoice.index } });
      } else {
        this.router.navigate(["invoices", "edit", id], { queryParams: { order_number: index, parent_invoice: parent_invoice.index } });
      }
    }else {
      if (status == 1) {
        this.router.navigate(["invoices", "edit", id], { queryParams: { order_number: index } });
      } else {
        this.router.navigate(["invoices", "edit", id], { queryParams: { order_number: index } });
      }
    }
  }

  removeInvoice(invoice, event, i) {
    event.stopPropagation();
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
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

    this.spinner = true;
    if (newPage > this.numberOfRowsArray.length || newPage < 1) {
      this.spinner = false;
      return;
    }

    this.invoiceService.getInvoices(newPage).subscribe((invoices) => {
      this.invoicesCopy = invoices;
      this.invoices =[...this.invoices, ...this.invoicesCopy]
      this.invoices = this.removeDuplicates(this.invoices, 'Id')
      this.originalInvoices = JSON.parse(JSON.stringify(this.invoices));

      this.page = newPage;
      this.spinner = false;

      let selected = [];
      for (const key in this.statusObject) {
          if(this.statusObject[key]) {
            selected.push(key);
          }
      }

      this.onChange(
        { value: selected[selected.length - 1] },
        this.searchInput.nativeElement
      );
    });
  }

  removeDuplicates(myArray, Prop) {
    return myArray.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[Prop]).indexOf(obj[Prop]) === pos;
    });
  }

  onScroll(event) {
    this.onScrollEvent.next(event);
     if(event.target.clientHeight){
        const clientHeight = event.target.clientHeight;
        this.scrollHeight = { clientHeight } ;
      }else{
        return false;
      }
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

  onEnterMouse(){
    this.hoverColor = 'var(--orange-dark)'
  }
  onLeaveMouse(){
    this.hoverColor = 'var(--project-color)'
  }

  checkedLengthRequirements($event){

    const target = $event.target;
    const maxLn = target.innerText.length
    if(maxLn >= 500)
    {
      target.innerText = target.innerText.slice(0, 500);
      $event.target.blur();

     }
  }

    saveCustomComment(id, event, index){

        const target = event.target;
        const custom_comment = target.innerText;
        this.invoices[index].custom_comment = custom_comment;
        if(custom_comment) {
            const diaolgConfig = new MatDialogConfig();
            diaolgConfig.autoFocus = false;
            diaolgConfig.disableClose = true;
            diaolgConfig.width = "";
            diaolgConfig.data = {
                questionText: this.translate.instant("Do you want to save?"),
            };
            this.dialog
              .open(ConfirmationModalComponent, diaolgConfig)
              .afterClosed()
              .subscribe((response) => {

                if (response.result) {
                    const object = {
                        content_id: id,
                        content_type: 'invoice',
                        custom_comment: custom_comment
                    };

                    this.projectService.updateOrCreateCustomComment(object).subscribe((res) => {
                        if (res["status"]) {
                                this.toastr.success(
                                this.translate.instant("TSC_You_have_successfully_updated_comment"),
                                this.translate.instant("Success")
                            );
                        }else {
                            this.toastr.error(this.translate.instant("Error"));
                        }
                    });
                }
            });
        }
    }

    clearSearchText(event) {
        sessionStorage.removeItem("filterInvoicesBySearch");
        this.from_edit = false;
        event.preventDefault();
        (document.getElementById('searchInput') as HTMLInputElement).value = '';
        this.onChange(this.selectStatusInput.nativeElement, this.searchInput.nativeElement);
    }

    get existString() {
        if (((document.getElementById('searchInput') as HTMLInputElement).value).length > 0)
            return true;
        else
            return false;
    }
}
