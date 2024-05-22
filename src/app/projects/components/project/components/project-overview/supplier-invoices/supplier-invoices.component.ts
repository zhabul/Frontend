import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Renderer2,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ProjectsService } from "src/app/core/services/projects.service";
import { SuppliersService } from "src/app/core/services/suppliers.service";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { UsersService } from "src/app/core/services/users.service";
//import * as printJS from "print-js";
declare var $;

@Component({
  selector: "app-supplier-invoices",
  templateUrl: "./supplier-invoices.component.html",
  styleUrls: ["./supplier-invoices.component.css"],
})
export class SupplierInvoicesComponent implements OnInit {
  @ViewChild("colPersentElement") colPersentElement: ElementRef;
  @ViewChild("orderNumberTd", { static: false }) orderNumberTd: ElementRef;
  @ViewChild("accountTd", { static: false }) accountTd: ElementRef;

  public project;
  public supplierInvoices: any[] = [];
  public supplierInvoicesDuplicate: any[];
  public paginate: number = 0;
  public offset: number = 0;
  public searchText: any = "";
  public showPagination: boolean = true;
  public spinner = false;
  public selectedTab: number = 0;
  public originSupplierInvoices: any[];
  public numberOfRowsArray: any[] = [];
  public pageIndex: number = 0;
  public accounts: any[] = [];
  public sumTotal = 0;
  public selectedType: number = 0;
  public notRegulatedTotal: number = 0;
  public filterArg: any = [];
  public approvedTotal: number = 0;
  public amountTotal: number = 0;
  public totalWithoutVat: number = 0;
  public userDetails;
  public showMenu = true;
  public showMasterMenu: boolean = false;
  public currentClass = "title-new-project";
  public inputValue: string = ""; // Initialize the input value
  public toHandleshow: boolean = true;
  public workedButNotApprovedShow: boolean = true;
  public approvdShow: boolean = true;
  public notReInvoicing: boolean = true;
  public selectAll: boolean = true;
  public widthpersent: boolean = false;
  public widthpersentSec: boolean = false;
  public fileter_ids: any = {
    all: false,
    to_handle: false,
    worked_but_not_approved: false,
    approved: false,
    not_re_invoiced: false,
    cancel: false,
  };
  public fileter_arguments: any = {
    all: 1,
    to_handle: 2,
    worked_but_not_approved: 3,
    approved: 4,
    not_re_invoiced: 5,
    cancel: 6,
  };
  public fileter_arguments_value: any = {
    "1": "all",
    "2": "to_handle",
    "3": "worked_but_not_approved",
    "4": "approved",
    "5": "not_re_invoiced",
    "6": "cancel",
  };
  isSaveInProgress = false; // Dodajte ovo kao svojevrsnu zastavicu
  public fillColor = "82A7E2";
  public objData: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private suppliersService: SuppliersService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private renderer: Renderer2,
    private dialog: MatDialog,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    this.project = this.route.snapshot.data["project"];
    this.originSupplierInvoices =
      this.route.snapshot.data["supplierInvoices"].invoices;
    this.sumTotal = this.originSupplierInvoices.reduce((prev, invoice) => {
      return prev + Number(invoice.TotalForInvoice);
    }, 0);
    this.supplierInvoices = JSON.parse(
     JSON.stringify(this.route.snapshot.data["supplierInvoices"].invoices)
     );
    this.numberOfRowsArray = new Array(
      Math.ceil(this.originSupplierInvoices.length / 20)
    );
    this.accounts = this.route.snapshot.data["accounts"];
    this.translate.use(sessionStorage.getItem("lang"));

    this.route.queryParams.subscribe((params) => {
      if (params["type"]) {
        //  this.filterDataPerStatus(params["type"], 'all');
      }

      if (params["loc"]) {
        this.showMenu = false;
      }
    });

    this.sumOfTotals();
    this.redirectIfHasNoPermission();
  }
  ngAfterViewInit() {
    const colPersentWidth = this.colPersentElement.nativeElement.offsetWidth;
    this.widthColPersentFirst(colPersentWidth);
    this.widthColPersentSecond(colPersentWidth);
    this.getUserPermissionTabs();
    /* this.measureColumnWidth(); */
  }
  widthColPersentFirst(colPersentWidth) {
    if (colPersentWidth > 20 && colPersentWidth < 26) {
      this.widthpersent = true;
    }

    if (this.widthpersent === true) {
      this.renderer.addClass(
        document.querySelector(".blu-scroll-wrapp"),
        "wider-persent"
      );
      this.renderer.addClass(
        document.querySelector(".blu-scroll"),
        "wider-persent"
      );
    } else {
      this.widthpersent = false;

      // Uklonite stilsku klasu sa .blu-scroll-wrapp i .blu-scroll
      this.renderer.removeClass(
        document.querySelector(".blu-scroll-wrapp"),
        "wider-persent"
      );
      this.renderer.removeClass(
        document.querySelector(".blu-scroll"),
        "wider-persent"
      );
    }
  }
  widthColPersentSecond(colPersentWidth) {
    if (colPersentWidth >= 27) {
      this.widthpersentSec = true;
    }

    if (this.widthpersentSec === true) {
      this.renderer.addClass(
        document.querySelector(".blu-scroll-wrapp"),
        "wider-persent-sec"
      );
      this.renderer.addClass(
        document.querySelector(".blu-scroll"),
        "wider-persent-sec"
      );
    } else {
      this.widthpersentSec = false;

      // Uklonite stilsku klasu sa .blu-scroll-wrapp i .blu-scroll
      this.renderer.removeClass(
        document.querySelector(".blu-scroll-wrapp"),
        "wider-persent-sec"
      );
      this.renderer.removeClass(
        document.querySelector(".blu-scroll"),
        "wider-persent-sec"
      );
    }
  }
  redirectIfHasNoPermission() {
    const status = this.userDetails.show_project_SupplierInvoices;

    if (!status || status == 0) {
      this.toastr.error(
        this.translate.instant("You don't have permission to view") +
          ": " +
          this.translate.instant("Supplier Invoice"),
        this.translate.instant("Error")
      );
      this.router.navigate(["/"]);
    }
  }

  checkDueDate(date) {
    let today = new Date();
    let duedate = new Date(date);
    return duedate.getTime() > today.getTime() ? false : true;
  }

  getTotal() {
    return this.supplierInvoices.reduce((prev, invoice) => {
      return prev + Number(invoice.TotalForInvoice);
    }, 0);
  }

  NewSupplierInvoice() {
    this.router.navigate([
      "/projects/view/supplier-invoices/new/",
      this.project.id,
    ]);
  }

  Edit(invoice, type) {
    let tab = 5;
    let invoiceId = invoice["sirID"];

    if (type == "All" && invoice.Master == 1) {
      tab = 6;
      if (invoice["Parent"] != 0) invoiceId = invoice["Parent"];
    } else if (invoice.Master == 0) {
      invoiceId = invoice["sirID"];
    }

    this.router.navigate([
      "/projects/view/supplier-invoices/edit/",
      invoice["SupplierInvoicesID"],
      this.project.id,
      tab,
      invoiceId,
    ]);
  }

  nextOrPreviousContent(arg) {
    let allowGetFromServer = false;

    if (arg == "Previous" && this.paginate > 19) {
      this.paginate = this.paginate - 20;
      this.pageIndex = this.pageIndex - 1;
      allowGetFromServer = true;
    } else if (arg == "Next") {
      this.paginate = this.paginate + 20;
      this.pageIndex = this.pageIndex + 1;

      if (this.originSupplierInvoices.length <= this.paginate) {
        this.pageIndex = this.pageIndex - 1;
        allowGetFromServer = false;
        this.paginate = this.paginate - 20;
      } else {
        allowGetFromServer = true;
      }
    }

    if (allowGetFromServer) {
      this.supplierInvoices = JSON.parse(
        JSON.stringify(this.originSupplierInvoices)
      ).splice(this.paginate, 20);
    }
  }

  onSearch(e = null, value = null) {
    if (value) {
      this.searchText = value;
    } else if (e && e.target) {
      this.searchText = e.target.value;
    }

    if (this.searchText) {
      this.showPagination = false;
      this.supplierInvoices = this.supplierInvoicesDuplicate.filter((sup) =>
        [
          "SupplierName",
          "OrderNR",
          "Ocr",
          "AtaNumber",
          "AtaNumber2",
          "Account",
          "DueDate",
          "InvoiceDate",
          "TotalExl",
          "TotalForInvoice",
        ].some((property) => {
          if (sup[property]) {
            return sup[property]
              .toLowerCase()
              .includes(this.searchText.toLowerCase());
          } else {
            return false;
          }
        })
      );
    } /*else if (this.selectedTab == 0) {
      this.showPagination = true;
      this.supplierInvoices = JSON.parse(
        JSON.stringify(this.route.snapshot.data["supplierInvoices"].invoices)
      );
    } else {
      this.showPagination = true;
      this.supplierInvoices = JSON.parse(
        JSON.stringify(this.originSupplierInvoices)
      );
    }*/
    this.sumOfTotals();
  }

  searchByArgumentOnSubmit() {
    if (this.searchText) {
      this.showPagination = false;
      this.spinner = true;
      this.suppliersService
        .searchByArgument(this.searchText, this.project.id)
        .subscribe((res) => {
          if (res["status"]) this.supplierInvoices = res["data"];
          else this.supplierInvoices = [];

          this.spinner = false;
        });
    } else {
      this.showPagination = true;
      this.paginate = 20;
      this.projectsService
        .getSupplierInoviceFromDatabaseResolverService(
          this.project.id,
          20,
          0,
          this.selectedTab
        )
        .then((res) => {
          if (res["status"])
            this.supplierInvoices = res["invoices"].splice(0, 20);
        });
    }
  }

  setData(arg) {
    this.selectedType = arg;
    $(".project-nav-select")[0].selectedIndex = arg;

    if (arg == 1 || arg == 2 || arg == 3) {
      this.selectedTab = arg;
      this.projectsService
        .getSupplierInoviceFromDatabaseResolverService(
          this.project.id,
          20,
          0,
          arg
        )
        .then((ress) => {
          if (ress["status"]) {
            let invoicesToCalculateTotal = ress["invoices"];
            this.sumTotal = invoicesToCalculateTotal.reduce((prev, invoice) => {
              return prev + Number(invoice.TotalForInvoice);
            }, 0);
            this.originSupplierInvoices = JSON.parse(
              JSON.stringify(ress["invoices"])
            );
            this.supplierInvoices = JSON.parse(
              JSON.stringify(ress["invoices"].splice(0, 20))
            );
            this.numberOfRowsArray = new Array(
              Math.ceil(this.originSupplierInvoices.length / 20)
            );
            if (this.searchText) {
              this.showPagination = false;
              this.supplierInvoices = this.originSupplierInvoices.filter(
                (sup) =>
                  [
                    "SupplierName",
                    "OrderNR",
                    "Ocr",
                    "AtaNumber",
                    "AtaNumber2",
                    "Account",
                    "DueDate",
                    "InvoiceDate",
                    "TotalExl",
                    "TotalForInvoice",
                  ].some((property) => {
                    if (sup[property]) {
                      return sup[property]
                        .toLowerCase()
                        .includes(this.searchText.toLowerCase());
                    } else {
                      return false;
                    }
                  })
              );
            }
          }
        });
    } else if (arg == 0) {
      this.selectedTab = 0;
      this.supplierInvoices = JSON.parse(
        JSON.stringify(this.route.snapshot.data["supplierInvoices"].invoices)
      ).splice(0, 20);
      this.originSupplierInvoices =
        this.route.snapshot.data["supplierInvoices"].invoices;
      this.numberOfRowsArray = new Array(
        Math.ceil(this.originSupplierInvoices.length / 20)
      );
      this.sumTotal = this.originSupplierInvoices.reduce((prev, invoice) => {
        return prev + Number(invoice.TotalForInvoice);
      }, 0);
    }
    this.paginate = 0;
    this.pageIndex = 0;
  }

  filterDataPerStatusAll() {
    let data = [
      {
        number: 2,
        name: "to_handle",
      },
      {
        number: 3,
        name: "worked_but_not_approved",
      },
      {
        number: 4,
        name: "approved",
      },
      {
        number: 5,
        name: "not_re_invoiced",
      },
    ];

    this.fileter_ids["all"] = !this.fileter_ids["all"];

    data.forEach((result) => {
      this.filterDataPerStatus(
        result.number,
        result.name,
        false,
        this.fileter_ids["all"]
      );
    });
  }

  filterDataPerStatus(arg, type, from_init = false, from_filter_all = null) {
    /* this.fileter_ids.push(arg);
    const array = this.fileter_ids;
    const uniqueSet = new Set(array);
    this.fileter_ids = [...uniqueSet];
*/
    this.supplierInvoices = [];

    if (from_filter_all != null) {
      this.fileter_ids[type] = from_filter_all;
    } else {
      this.fileter_ids[type] = !this.fileter_ids[type];
    }

    if (!from_init) {
      this.createUserPermissionTabs(
        arg,
        "project_supplier_invoices",
        this.fileter_ids[type]
      );
    }

    this.filterArg = [];
    if (this.fileter_ids["all"]) {
      this.filterArg.push(this.fileter_arguments["all"]);
    }
    if (this.fileter_ids["to_handle"]) {
      this.filterArg.push(this.fileter_arguments["to_handle"]);
    }
    if (this.fileter_ids["worked_but_not_approved"]) {
      this.filterArg.push(this.fileter_arguments["worked_but_not_approved"]);
    }
    if (this.fileter_ids["approved"]) {
      this.filterArg.push(this.fileter_arguments["approved"]);
    }
    if (this.fileter_ids["not_re_invoiced"]) {
      this.filterArg.push(this.fileter_arguments["not_re_invoiced"]);
    }
    //  if(this.fileter_ids['all']) {
    //    this.filterArg.push(this.fileter_arguments['all']);
    //  }

    let origin = JSON.parse(JSON.stringify(this.originSupplierInvoices));
    this.supplierInvoices = origin.filter((value) =>
      this.filterArg.includes(value.InvoiceStatus)
    );

    let ids = [];
    for (var i = this.supplierInvoices.length - 1; i >= 0; i--) {
      ids.push(this.supplierInvoices[i].sirID);
    }
    let children_origin = JSON.parse(
      JSON.stringify(this.originSupplierInvoices)
    );
    children_origin = children_origin.filter((value) =>
      this.notIncludes(ids, value.sirID)
    );
    let children = children_origin.filter((value) =>
      value.childrenInvoices.some((s) =>
        this.filterArg.includes(s.InvoiceStatus)
      )
    );
    this.supplierInvoices = [...this.supplierInvoices, ...children];
    this.supplierInvoicesDuplicate = JSON.parse(
      JSON.stringify(this.supplierInvoices)
    );

    //  this.numberOfRowsArray = new Array(
    //    Math.ceil(this.supplierInvoices.length / 20)
    //  );
    let search = document.getElementById("filterInput") as HTMLInputElement;
    this.onSearch(null, search?.value);
    //this.sumOfTotals();
  }

  allFilterChecked() {
    if (
      this.fileter_ids["to_handle"] &&
      this.fileter_ids["worked_but_not_approved"] &&
      this.fileter_ids["approved"] &&
      this.fileter_ids["not_re_invoiced"]
    ) {
      return true;
    } else {
      return false;
    }
  }

  createUserPermissionTabs(value, type, status) {
    this.objData = {
      user_id: this.userDetails.user_id,
      tab_name: value,
      type: type,
    };

    if (status) {
      this.usersService.createUserPermissionTabs(this.objData);
    } else {
      this.usersService.deleteUserPermissionTabs(this.objData);
    }
  }

  getUserPermissionTabs() {
    this.usersService.getUserPermissionTabs().subscribe((res) => {
      this.spinner = false;
      const project_supplier_invoices =
        res["data"]["project_supplier_invoices"];
      if (project_supplier_invoices) {
        const keys_project = Object.keys(project_supplier_invoices);
        keys_project.forEach((value) => {
          if (this.fileter_arguments_value[value]) {
            this.filterDataPerStatus(
              value,
              this.fileter_arguments_value[value],
              true
            );
          }
        });
        /*
          if (keys_project.length == 2) {
            this.statusClient["all"] = true;
          }
        */
      }
    });
  }

  notIncludes(ids, id) {
    if (ids.includes(id)) return false;
    else return true;
  }

  setPage(start) {
    let supp = JSON.parse(JSON.stringify(this.supplierInvoices));
    this.paginate = start * 20;
    this.pageIndex = start;
    this.supplierInvoices = supp.splice(this.paginate, 20);
  }

  supplierInvoicesChildrens(sirID) {
    if (sirID)
      return this.supplierInvoices.filter((value) => value.Parent == sirID);
    else return [];
  }

  setColor(index: number) {
    return {
      "background-color": index % 2 === 0 ? "white" : "#F1F1F1",
    };
  }

  setStatusColor(invoice) {
    let color;

    if (invoice.amount == "0") color = "#ffffff";
    else if (invoice.InvoiceStatus == 2) color = "rgb(239, 155, 78)";
    else if (invoice.InvoiceStatus == 3) color = "rgb(228, 228, 44)";
    else if (invoice.InvoiceStatus == 4) color = "rgb(141,242,198)";
    else if (invoice.InvoiceStatus == 5) color = "#ffffff";
    else color = "#ffffff";

    let style = {
      color: color,
    };

    return style;
  }
  setColor2(invoice: any) {

    const amount = invoice.amount;
    const invoiceStatus = invoice.InvoiceStatus;

    if (amount === "0") {
      return { "background-color": "#ffffff" };
    } else if (invoiceStatus === 2) {
      return { "background-color": "#F7F3D1" };
    } else if (invoiceStatus === 3) {
      return { "background-color": "#DEFBFF" };
    } else if (invoiceStatus === 4) {
      return { "background-color": "rgb(227, 233, 221)" };
    } else {
      // Za sve ostale slučajeve postavljamo belu pozadinu
      return { "background-color": "#ffffff" };
    }
  }
  sumOfTotals() {
    if (this.supplierInvoices.length < 1) {
      return;
    }
    let supplierInvoices = JSON.parse(JSON.stringify(this.supplierInvoices));

    /*  if (this.filterArg == 1) {
      this.notRegulatedTotal = supplierInvoices.reduce((prev, invoice) => {
        let children_number = 0;
        let total = invoice["on_same_project"]
          ? Number(invoice.notRegulated)
          : 0;

        if (invoice.childrenInvoices && invoice.childrenInvoices.length > 0) {
          total = 0;
          children_number = invoice.childrenInvoices.reduce(
            (childrenPreview, children_invoice) => {
              let total = children_invoice["on_same_project"]
                ? Number(children_invoice.notRegulated)
                : 0;

              return childrenPreview + total;
            },
            0
          );
        }
        return prev + total + Number(children_number);
      }, 0);

      this.approvedTotal = supplierInvoices.reduce((prev, invoice) => {
        let children_number = 0;
        let total = invoice["on_same_project"]
          ? Number(invoice.approvedForInvoice)
          : 0;

        if (invoice.childrenInvoices && invoice.childrenInvoices.length > 0) {
          total = 0;
          children_number = invoice.childrenInvoices.reduce(
            (childrenPreview, children_invoice) => {
              let total = children_invoice["on_same_project"]
                ? Number(children_invoice.approvedForInvoice)
                : 0;

              return childrenPreview + total;
            },
            0
          );
        }
        return prev + total + Number(children_number);
      }, 0);

      this.amountTotal = supplierInvoices.reduce((prev, invoice) => {
        let children_number = 0;
        let total = invoice["on_same_project"] ? Number(invoice.amount) : 0;

        if (invoice.childrenInvoices && invoice.childrenInvoices.length > 0) {
          total = 0;
          children_number = invoice.childrenInvoices.reduce(
            (childrenPreview, children_invoice) => {
              let total = children_invoice["on_same_project"]
                ? Number(children_invoice.amount)
                : 0;

              return childrenPreview + total;
            },
            0
          );
        }
        return prev + total + Number(children_number);
      }, 0);

      this.totalWithoutVat = supplierInvoices.reduce((prev, invoice) => {
        let children_number = 0;
        let total = invoice["on_same_project"] ? Number(invoice.TotalExl) : 0;

        if (invoice.childrenInvoices && invoice.childrenInvoices.length > 0) {
          total = 0;
          children_number = invoice.childrenInvoices.reduce(
            (childrenPreview, children_invoice) => {
              let total = children_invoice["on_same_project"]
                ? Number(children_invoice.TotalExl)
                : 0;
              return childrenPreview + total;
            },
            0
          );
        }
        return prev + total + Number(children_number);
      }, 0);
    } else {*/

    this.notRegulatedTotal = supplierInvoices.reduce((prev, invoice) => {
      let children_number = 0;
      let total = invoice["on_same_project"] ? Number(invoice.notRegulated) : 0;

      if (invoice.childrenInvoices && invoice.childrenInvoices.length > 0) {
        total = 0;
        children_number = invoice.childrenInvoices.reduce(
          (childrenPreview, children_invoice) => {
            let chNumber = 0;
            let total = children_invoice["on_same_project"]
              ? Number(children_invoice.notRegulated)
              : 0;

            if (this.filterArg.includes(children_invoice.InvoiceStatus)) {
              chNumber = total;
            }
            return childrenPreview + chNumber;
          },
          0
        );
      }

      let parentNuber = 0;
      if (
        /*invoice.InvoiceStatus == this.filterArg */ this.filterArg.includes(
          invoice.InvoiceStatus
        )
      ) {
        parentNuber = total;
      }
      return prev + Number(parentNuber) + Number(children_number);
    }, 0);

    this.approvedTotal = supplierInvoices.reduce((prev, invoice) => {
      let children_number = 0;
      let total = invoice["on_same_project"]
        ? Number(invoice.approvedForInvoice)
        : 0;

      if (invoice.childrenInvoices && invoice.childrenInvoices.length > 0) {
        total = 0;
        children_number = invoice.childrenInvoices.reduce(
          (childrenPreview, children_invoice) => {
            let chNumber = 0;
            let total = children_invoice["on_same_project"]
              ? Number(children_invoice.approvedForInvoice)
              : 0;

            if (
              /*children_invoice.InvoiceStatus == this.filterArg*/ this.filterArg.includes(
                children_invoice.InvoiceStatus
              )
            ) {
              chNumber = total;
            }
            return childrenPreview + chNumber;
          },
          0
        );
      }

      let parentNuber = 0;
      if (
        /*invoice.InvoiceStatus == this.filterArg*/ this.filterArg.includes(
          invoice.InvoiceStatus
        )
      ) {
        parentNuber = total;
      }
      return prev + Number(parentNuber) + Number(children_number);
    }, 0);

    this.amountTotal = supplierInvoices.reduce((prev, invoice) => {
      let children_number = 0;
      let total = invoice["on_same_project"] ? Number(invoice.amount) : 0;

      if (invoice.childrenInvoices && invoice.childrenInvoices.length > 0) {
        total = 0;
        children_number = invoice.childrenInvoices.reduce(
          (childrenPreview, children_invoice) => {
            let chNumber = 0;
            let total = children_invoice["on_same_project"]
              ? Number(children_invoice.amount)
              : 0;

            if (
              /*children_invoice.InvoiceStatus == this.filterArg*/ this.filterArg.includes(
                children_invoice.InvoiceStatus
              )
            ) {
              chNumber = total;
            }
            return childrenPreview + chNumber;
          },
          0
        );
      }

      let parentNuber = 0;
      if (
        /*invoice.InvoiceStatus == this.filterArg*/ this.filterArg.includes(
          invoice.InvoiceStatus
        )
      ) {
        parentNuber = total;
      }
      return prev + Number(parentNuber) + Number(children_number);
    }, 0);

    this.totalWithoutVat = supplierInvoices.reduce((prev, invoice) => {
      let children_number = 0;
      let total = invoice["on_same_project"] ? Number(invoice.TotalExl) : 0;

      if (invoice.childrenInvoices && invoice.childrenInvoices.length > 0) {
        total = 0;
        children_number = invoice.childrenInvoices.reduce(
          (childrenPreview, children_invoice) => {
            let chNumber = 0;
            let total = children_invoice["on_same_project"]
              ? Number(children_invoice.TotalExl)
              : 0;

            if (
              /*children_invoice.InvoiceStatus == this.filterArg*/ this.filterArg.includes(
                children_invoice.InvoiceStatus
              )
            ) {
              chNumber = total;
            }
            return childrenPreview + chNumber;
          },
          0
        );
      }

      let parentNuber = 0;
      if (
        /*invoice.InvoiceStatus == this.filterArg*/ this.filterArg.includes(
          invoice.InvoiceStatus
        )
      ) {
        parentNuber = total;
      }

      return prev + Number(parentNuber) + Number(children_number);
    }, 0);
    //}

    this.totalWithoutVat = this.roundToXDigits(this.totalWithoutVat, 2);
    this.amountTotal = this.roundToXDigits(this.amountTotal, 2);
    this.approvedTotal = this.roundToXDigits(this.approvedTotal, 2);
    this.notRegulatedTotal = this.roundToXDigits(this.notRegulatedTotal, 2);
  }

  roundToXDigits(value: number, digits: number) {
    value = value * Math.pow(10, digits);
    value = Math.round(value);
    value = value / Math.pow(10, digits);
    return value;
  }
  Prikazi() {
    this.showMasterMenu = !this.showMasterMenu;
  }
  enter() {
    this.currentClass = "title-new-project-hover";
    this.fillColor = "FF7000";
  }

  leave() {
    this.currentClass = "title-new-project";
    this.fillColor = "82A7E2";
  }

  clearInput() {
    this.searchText = ""; // Postavi searchText na prazan string
    this.inputValue = ""; // Očisti vrednost u input polju
    this.showPagination = true;
    this.supplierInvoices = JSON.parse(
      JSON.stringify(this.originSupplierInvoices)
    ); // Vrati na originalne podatke
    this.sumOfTotals();
  }
  toHandle() {
    this.toHandleshow = !this.toHandleshow;
  }
  workedButNotAprovenShow() {
    this.workedButNotApprovedShow = !this.workedButNotApprovedShow;
  }
  approvedShow() {
    this.approvdShow = !this.approvdShow;
  }
  notReInvoic() {
    this.notReInvoicing = !this.notReInvoicing;
  }
  viewAll() {
    this.selectAll = !this.selectAll;
  }
  shouldAddHasChildrenClass(invoice: any): boolean {
    return invoice.childrenInvoices && invoice.childrenInvoices.length > 0;
  }
  saveCustomComment(event) {
    if (!this.isSaveInProgress) {
      // Provjerite je li već u tijeku spremanje
      this.isSaveInProgress = true; // Postavite zastavicu kako biste označili da je spremanje u tijeku

      const diaolgConfig = new MatDialogConfig();
      diaolgConfig.autoFocus = false;
      diaolgConfig.disableClose = true;
      diaolgConfig.width = "";
      diaolgConfig.data = {
        questionText: this.translate.instant("Do you want to save?"),
      };
      diaolgConfig.panelClass = "mat-dialog-confirmation";
      this.dialog
        .open(ConfirmationModalComponent, diaolgConfig)
        .afterClosed()
        .subscribe((response) => {
          // Ovdje dodajte logiku koja se treba izvršiti nakon zatvaranja dijaloga
          this.isSaveInProgress = false; // Postavite zastavicu natrag na false kada je operacija završena kako se ne bi 2x otvaralo ModalDialog
        });
    }
  }

  onBlur(event: Event) {
    const tdElement = event.target as HTMLElement;
    const textContent = tdElement.textContent.trim(); // Dobijemo sadržaj i uklonimo praznine na početku i kraju

    if (textContent) {
      // Ako ima sadržaja, pozovi saveCustomComment
      this.saveCustomComment(textContent);
    }
  }
/*
  downloadDOcument(file) {

    printJS({
        printable: file['PATH'],
        type: "image",
        documentTitle: file['NAME'],
    });
  }
*/
  measureColumnWidth() {
    const accountTdElement: HTMLElement = this.accountTd.nativeElement;
    const accountTdWidth = accountTdElement.offsetWidth;

    if (this.orderNumberTd && this.orderNumberTd.nativeElement) {
      const orderNumberTdElement: HTMLElement =
        this.orderNumberTd.nativeElement;
      const orderNumberWidth = orderNumberTdElement.offsetWidth;

      // Proveri da li je "Order Number" širi od 70 piksela
      if (orderNumberWidth > 70) {
        // Oduzmi 70 od širine Order Number stupca
        const adjustedWidth = orderNumberWidth - 70;

        // Smanji širinu Account stupca za preostalu vrednost
        const newAccountWidth = Math.max(accountTdWidth - adjustedWidth, 0);

        // Postavi novu širinu za Account stupac
        accountTdElement.style.width = `${newAccountWidth}px`;

        // Postavi min-width i max-width za Account stupac
        accountTdElement.style.minWidth = `${newAccountWidth}px`;
        accountTdElement.style.maxWidth = `${newAccountWidth}px`;
      }
    }
  }

  deleteSupplier(supplier, index) {

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.data = {
      questionText: this.translate.instant("Do you want to save?"),
    };
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
    .open(ConfirmationModalComponent, diaolgConfig)
    .afterClosed()
    .subscribe((response) => {

      if(response.result) {
        this.suppliersService.removeSupplierInvoice(supplier['SupplierInvoicesID']).subscribe(
          (result:any) => {
            if(result.status) {
                this.supplierInvoices.splice(index, 1);
            }
          }
        );
      }
    });
  }
}
