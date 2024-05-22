import { Component, OnInit, AfterViewInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SuppliersService } from "src/app/core/services/suppliers.service";
import { Location } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { InitProvider } from "src/app/initProvider";
import { AppService } from "src/app/core/services/app.service";
import { TranslateService } from "@ngx-translate/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { UsersService } from "../../../core/services/users.service";

@Component({
  selector: "app-suppliers",
  templateUrl: "./suppliers.component.html",
  styleUrls: ["./suppliers.component.css"],
})
export class SuppliersComponent implements OnInit, AfterViewInit {
    public suppliers: any[];
    public originalSuppliers: any[];
    public columnsToShow = {
        category: true,
        companyname: true,
        orgnr: true,
        email: true,
        telefon: true,
        status: true,
        remove: true,
    };
    public userDetails: any;
    public previousRoute: string;
    public currentAddRoute: string;
    public newSupplier: any;
    public supplier: any;
    public filterMenu = false;
    public allSuppliers = [];
    public buttonColumnToggle = true;
    public language;
    public page = 1;
    public numberOfRowsArray = [];
    public showPaginate: boolean = true;
    public orderAccess = false;
    public currentClass = "title-new-project";
    lang = sessionStorage.getItem("lang");
    public enableActive: boolean = true;
    public notActive: boolean = true;
    public showAll: boolean = true;
    iconHeight: number = 15; // Set the desired height in pixels
    iconWidth: number = 15; // Set the desired width in pixels
    public inputValue: string = ""; // Initialize the input value
    public tempClass = "title-see-all";
    filterInput: string = ""; // Varijabla za unos teksta za pretragu
    filteredSuppliers = [];
    originSuppliers = [];
    fillColor: string = '82A7E2'; // Početna boja
    public statusSupplier: any = {
        "0": false,
        "1": false,
        "all": false
    };
    public objData: any = {};
    public spinner = true;
    public from_edit:boolean = false;

    constructor(
        private route: ActivatedRoute,
        private translate: TranslateService,
        private suppliersService: SuppliersService,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private location: Location,
        private appService: AppService,
        public initProvider: InitProvider,
        private router: Router,
        private usersService: UsersService,
    ) {}

    ngOnInit() {
        this.route.queryParamMap.subscribe((params) => {
            this.from_edit = params.get("from_edit") ? JSON.parse(params.get("from_edit")) : false;
        });
        console.log( this.from_edit)
        if(!this.from_edit) {
            sessionStorage.removeItem("filterSupplierBySearch");
        }
        this.language = sessionStorage.getItem("lang");
        this.translate.use(this.language);
        this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
        this.currentAddRoute = "/suppliers/new";
        this.appService.setAddRoute(this.currentAddRoute);
        this.appService.setShowAddButton = true && this.userDetails.create_register_suppliers;
        this.previousRoute = "/home";
        this.appService.setBackRoute(this.previousRoute);
        this.suppliers = this.route.snapshot.data["suppliers"];
        this.filteredSuppliers = this.suppliers.slice();
        this.originSuppliers = this.suppliers.slice();
        this.numberOfRowsArray = new Array(Math.ceil(this.suppliers.length / 20));
        this.originalSuppliers = JSON.parse(JSON.stringify(this.suppliers));
        this.suppliersService.getSuppliers(0).subscribe((res) => {
        this.allSuppliers = res["data"];
        });
        if (this.suppliers.length <= 20) this.showPaginate = false;
        this.newSupplier = {
            Id: -1,
            Name: "",
            Lastname: "",
            Number: "",
            Email: "",
            VisitingAddress: "",
        };
        this.orderAccess = this.userDetails.show_project_Order && this.initProvider.hasComponentAccess("orders");
        this.redirectIfHasNoAccess();
    }

    ngAfterViewInit() {
        this.getUserPermissionTabs();
        this.refreshSearch();
    }

    redirectIfHasNoAccess() {
        if (/*!this.orderAccess*/ !this.userDetails.show_register_suppliers) {
        this.router.navigate(["/"]);
        }
    }

    refreshSearch() {
        let filterUsersBySearch = JSON.parse(sessionStorage.getItem("filterSupplierBySearch"));
        if(filterUsersBySearch && filterUsersBySearch.length > 0) {
            this.filterInput = filterUsersBySearch;
        }
    }

  async removeSupplier(i, e) {

    const supplierId = this.suppliers[i]["Id"];
    e.stopPropagation();
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
          this.suppliersService
            .removeOneSupplier(supplierId)
            .subscribe((res) => {
              if (res["status"]) {
                if (this.lang === "sw") {
                  this.toastr.success(
                    "Du har raderat leverantören.",
                    "Framgång"
                  );
                } else if (this.lang === "en") {
                  this.toastr.success(
                    "You have successfully deleted the supplier.",
                    "Success"
                  );
                } else if (this.lang === "hr") {
                  this.toastr.success(
                    "Uspješno ste izbrisali dobavljača.",
                    "Success"
                  );
                }
                this.suppliers.splice(i, 1);
                this.filteredSuppliers = this.suppliers;
              } else {
                if (this.lang === "sw") {
                  this.toastr.error(
                    "Det var ett fel med din inlämning.",
                    "Fel"
                  );
                } else if (this.lang === "en") {
                  this.toastr.error(
                    "There was an error with your submission.",
                    "Error"
                  );
                } else if (this.lang === "hr") {
                  this.toastr.success(
                    "Dogodila se greška tokom obrade.",
                    "Success"
                  );
                }
              }
            });
        }
      });
  }

  // the original createSupplier comes from new-supplier.component.ts
  createSupplier() {
    if (this.newSupplier.Name != "" && this.newSupplier.Number != "") {
      this.suppliersService
        .addNewSupplier(this.newSupplier)
        .subscribe((res) => {
          if (res.status) {
            this.newSupplier["Id"] = res.data.supplier_id;
            this.supplier = this.supplier || [];

            this.suppliers.push(this.newSupplier);

            this.newSupplier = {
              Id: -1,
              Name: "",
              Lastname: "",
              Number: "",
              Email: "",
              VisitingAddress: "",
            };
          }
        });
    }
  }

  goBack(): void {
    this.location.back();
  }

  toggleFilterMenu(e = null): void {
    if (e) {
      if (e.target.id !== "looksLikeModal") {
        return;
      }
    }
    this.filterMenu = !this.filterMenu;
  }

  showCol(col) {
    return this.columnsToShow[col];
  }

  toggleCol(col) {
    this.columnsToShow[col] = !this.columnsToShow[col];
  }

  paginate(newPage) {
    if (newPage > this.numberOfRowsArray.length || newPage < 1) {
      return;
    }

    this.suppliersService.getSuppliers(newPage).subscribe((res) => {
      this.suppliers = res["data"];
      this.page = newPage;
    });
  }

  get nextPage() {
    return this.page + 1;
  }

  get previousPage() {
    return this.page - 1;
  }
  enter() {
    this.currentClass = "title-new-project-hover";
    this.fillColor='FF7000';
  }

  leave() {
    this.currentClass = "title-new-project";
    this.fillColor='82A7E2';
  }
  enterSeeAllBtn() {
    this.tempClass = "title-see-all-hover";

  }

  leaveSeeAllBtn() {
    this.tempClass = "title-see-all";

  }

  clearInput() {
    sessionStorage.removeItem("filterSupplierBySearch");
    this.from_edit = false;
    this.filterInput = ""; // Očisti unos
    this.onSearch();
  }
  enableActiveStatus() {
    this.enableActive = !this.enableActive;
    this.updateFilteredSuppliers();
  }

  enableNotActiveStatus() {
    this.notActive = !this.notActive;
    this.updateFilteredSuppliers();
  }

  showAllStatus() {
    this.showAll = !this.showAll;
    // Odmah upali i aktivne i neaktivne
    if (this.showAll) {
      this.enableActive = true;
      this.notActive = true;
    } else {
      this.enableActive = false;
      this.notActive = false;
    }
    this.updateFilteredSuppliers();
  }

  onInputChange(): void {
    this.onSearch();
  }

  updateFilteredSuppliers(): any[] {
    this.filteredSuppliers = []; // Inicijalizujte filteredSuppliers kao prazan niz

    if (this.enableActive && this.notActive) {
      this.showAll = true;
    } else if (!this.enableActive || !this.notActive) {
      this.showAll = false;
    }

    if (this.showAll) {
      this.filteredSuppliers = this.suppliers;
    } else {
      this.filteredSuppliers = this.suppliers.filter((supplier) => {
        if (this.enableActive && supplier.Active === "1") {
          return true;
        }
        if (this.notActive && supplier.Active !== "1") {
          return true;
        }
        return false;
      });
    }

    this.onSearch();
    return this.filteredSuppliers;
  }

    onStatusChangeExternal(value) {

        const type = "suppliers";
        var status = !this.statusSupplier[value];
        if (value == "all") {
            this.checkAllExternal(status, type);
        } else {
            if (!status) {
                this.statusSupplier["all"] = false;
            }
            this.statusSupplier[value] = status;
            this.createUserPermissionTabs(value, type, status);
            this.handleAllStatus();
        }
        this.onSearch();
    }

    handleAllStatus() {

        const statusObject = this.statusSupplier;
        const keys = Object.keys(statusObject);
        let flag = true;
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!statusObject[key]) {
                flag = false;
                break;
            }
        }
        statusObject["all"] = flag;
    }

    checkAllExternal(status, type) {

        const keys = Object.keys(this.statusSupplier);
        keys.forEach((key) => {
            this.statusSupplier[key] = status;
            if (key !== "all") {
                this.createUserPermissionTabs(key, type, status);
            }
        });
    }

    onSearch(): void {

        let statuses = [];
        if(this.statusSupplier[0]) {
          statuses.push('1');
        }

        if(this.statusSupplier[1]) {
          statuses.push('0');
        }

        this.originSuppliers;
        this.filterInput = this.filterInput.toLowerCase();
        sessionStorage.setItem("filterSupplierBySearch", JSON.stringify(this.filterInput));

        this.filteredSuppliers = this.originalSuppliers.filter(
        (supplier) => {
            return statuses.includes(supplier.Active);
        })
        .filter((supplier) => {
            return (
              supplier.Category?.toLowerCase().includes(this.filterInput) ||
              supplier.Name.toLowerCase().includes(this.filterInput) ||
              supplier.Orgnr.toLowerCase().includes(this.filterInput) ||
              supplier.Email.toLowerCase().includes(this.filterInput) ||
              supplier.Number.toLowerCase().includes(this.filterInput)
            );
        });
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
            const suppliers = res["data"]["suppliers"];
            if (suppliers) {
                const keys_project = Object.keys(suppliers);
                keys_project.forEach((status) => {
                    this.statusSupplier[status] = true;
                });

                if (keys_project.length == 2) {
                    this.statusSupplier["all"] = true;
                }
            }
            this.onSearch();
        });
    }

    allowEditSupplierInvoice() {

      let status = false;
      if (this.userDetails.create_register_suppliers) {
        status = true;
      }
      return status;
  }
}