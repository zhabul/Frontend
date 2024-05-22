import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Renderer2,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProjectsService } from "src/app/core/services/projects.service";
import { SuppliersService } from "src/app/core/services/suppliers.service";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { Subject, debounceTime } from 'rxjs';
import { UsersService } from "src/app/core/services/users.service";
declare var $;

@Component({
  selector: "app-all-supplier-invoices",
  templateUrl: "./all-supplier-invoices.component.html",
  styleUrls: [
    "./all-supplier-invoices.component.css",
    "../../../utility/radio-button.css",
  ],
})
export class AllSupplierInvoicesComponent implements OnInit {
  @ViewChild("colPersentElement") colPersentElement: ElementRef;
  public supplierInvoices = [];
  public originalSupplierInvoices = [];
  public projects = [];
  public oldSelectedIndex = 0;
  public accounts: any[] = [];
  public originAccounts: any[] = [];
  public spinner = false;
  public invocesByStatus: any = 0;
  public invocesByProject: any = 0;
  public invocedAccounts: any[] = [];
  public notInvocedAccounts: any[] = [];
  public originForSearchSupplierInvoices: any[] = [];
  public searchText: any = null;
  public selectedType: any = "0";
  public statusObject: any = {
    "0": true,
    "1": true,
    "2": true,
    "3": true,
  };
  isSaveInProgress = false; // Dodajte ovo kao svojevrsnu zastavicu
  public widthpersent: boolean = false;
  public inputValue: string = ""; // Initialize the input value
  private currentSetProjectArgument: any = null; // Dodajte ovu promenljivu
  public toHandleshow: boolean = true;
  public workedButNotApprovedShow: boolean = true;
  public approvdShow: boolean=false;
  public notReInvoicing:boolean=false;
  public selectAll:boolean=true;
  public completed:boolean=false;
  public persentNumber=100; //mijenja širinu kolone Worked up spremi stvarnu vrijednost "+%" u nju
  private searchInput = new Subject<string>();
  public statusSupplier: any = {
    "0": false,
    "1": false,
    "all": false
  };
  public objData: any = {};
  public userDetails: any = JSON.parse(sessionStorage.getItem("userDetails"));

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectsService,
    private supplierService: SuppliersService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private renderer: Renderer2,
    private usersService: UsersService,
  ) {}

  ngOnInit() {
    this.supplierInvoices = this.route.snapshot.data.supplierInvoices;
    this.accounts = this.route.snapshot.data.accounts;

    this.route.queryParams.subscribe((params) => {
      if (params["type"]) {
        this.setData(params["type"]);
      }
    });

    this.supplierService.getAllSupplierInvoices(0).subscribe((res) => {
      if (res["status"]) {
        this.supplierInvoices = this.supplierInvoices.concat(res["data"]);
        this.originalSupplierInvoices = JSON.parse(
          JSON.stringify(this.supplierInvoices)
        );
        this.originForSearchSupplierInvoices = JSON.parse(
          JSON.stringify(this.supplierInvoices)
        );
      }
    });

    this.originAccounts = JSON.parse(
      JSON.stringify(this.route.snapshot.data.accounts)
    );
    this.projectService
      .getProjectsForAllSupplierInvoicesDropdown()
      .then((res) => {
        if (res["status"]) {
          this.projects = res["data"];
        }
      });
      this.searchInput.pipe(debounceTime(1500)).subscribe((text) => {
        this.searchSupplierInvoices(text);
      });
  }
  ngAfterViewInit() {
    const colPersentWidth = this.colPersentElement.nativeElement.offsetWidth;
    if (colPersentWidth > 20) {
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

  checkDueDate(date) {
    let today = new Date();
    let duedate = new Date(date);
    return duedate.getTime() > today.getTime() ? false : true;
  }

  getTotal() {
    let total = 0;
    this.supplierInvoices.forEach((invoice) => {
      total += Number(invoice.Total);
    });
    return total;
  }

  changeSupplierInvoiceProject(invoice, projectId, e) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe(async (response) => {
        if (!response.result) {
          e.target.selectedIndex = this.oldSelectedIndex;
        } else {
          if (invoice.numberOfRows > 1) {
            this.toastr.error(
              this.translate.instant(
                "Invoice project cannot be changed because invoice belogs to multiple projects"
              ) + ".",
              this.translate.instant("Error")
            );
            e.target.selectedIndex = this.oldSelectedIndex;
            return;
          }
          invoice.ProjectId = projectId;
          this.supplierService
            .changeSupplierInvoiceProject(invoice.SupplierInvoicesID, projectId)
            .subscribe((res) => {
              if (res["status"]) {
                this.toastr.success(
                  this.translate.instant(
                    "Successfully changed project for invoice"
                  ) + ".",
                  this.translate.instant("Success")
                );
              } else {
                this.toastr.error(
                  this.translate.instant(
                    "There was an error while trying to change project for invoice"
                  ) + ".",
                  this.translate.instant("Error")
                );
              }
            });
        }
      });
  }

  saveOldSelectedIndex(e) {
    this.oldSelectedIndex = e.target.selectedIndex;
  }

  searchSupplierInvoices(searchQuery) {

    this.searchText = searchQuery;
    this.spinner = true;


    setTimeout(() => {
      this.supplierInvoices = this.originForSearchSupplierInvoices.filter((sup) =>
        [
          "Ocr",
          "OrderNR",
          "SupplierName",
          "InvoiceDate",
          "DueDate",
          "Account",
        ].some((property) => {
          if (sup[property]) {
            return sup[property]
              .toLowerCase()
              .includes(searchQuery.toLowerCase());
          } else {
            return false;
          }
        })
      );

      this.spinner = false; // Sakrij "spinner" nakon završetka pretrage
    }, 1500);
  }


  setData(argument) {
    $(".select-filter")[0].selectedIndex = argument;

    this.selectedType = argument;
    this.invocesByStatus = argument;
    this.spinner = true;
    const status = !this.statusObject[argument];
    if (argument == "0") {
      this.checkAll(status);
    } else {
      this.uncheckExcept(argument);
    }
    setTimeout(() => {
      this.filterInvoiced(argument);
      this.originForSearchSupplierInvoices = this.supplierInvoices;
      if (this.searchText) this.searchSupplierInvoices(this.searchText);
      this.spinner = false;
    }, 500);
  }

  checkAll(status) {
    const keys = Object.keys(this.statusObject);

    keys.forEach((key) => {
      this.statusObject[key] = status;
    });
  }

  uncheckExcept(key2) {
    const keys = Object.keys(this.statusObject);

    keys.forEach((key) => {
      if (key2 == key) {
        this.statusObject[key] = true;
      } else {
        this.statusObject[key] = false;
      }
    });
  }

  filterInvoiced(argument) {
    if (argument == 0) {
      if (this.invocesByProject) this.filterByProject(this.invocesByProject);
      else this.supplierInvoices = this.originalSupplierInvoices;
    } else if (argument == 1) {
      this.supplierInvoices = this.originalSupplierInvoices.filter(
        (invoice) => {
          if (this.invocesByProject && this.invocesByProject != 0)
            return (
              this.accounts[invoice.Account] == 0 &&
              invoice.Completed == 0 &&
              invoice.Project.split("-")[0] == this.invocesByProject
            );
          else
            return (
              this.accounts[invoice.Account] == 0 && invoice.Completed == 0
            );
        }
      );
    } else if (argument == 2) {
      this.supplierInvoices = this.originalSupplierInvoices.filter(
        (invoice) => {
          if (this.invocesByProject && this.invocesByProject != 0)
            return (
              this.accounts[invoice.Account] == 1 &&
              invoice.Completed == 0 &&
              invoice.Project.split("-")[0] == this.invocesByProject
            );
          else
            return (
              this.accounts[invoice.Account] == 1 && invoice.Completed == 0
            );
        }
      );
    } else if (argument == 3) {
      this.supplierInvoices = this.originalSupplierInvoices.filter(
        (invoice) => {
          if (this.invocesByProject && this.invocesByProject != 0)
            return (
              invoice.Completed == 1 &&
              invoice.Project.split("-")[0] == this.invocesByProject
            );
          else return invoice.Completed == 1;
        }
      );
    }
  }

  mapAsync(array, callbackfn) {
    return Promise.all(array.map(callbackfn));
  }

  filterByProject(arg) {
    if (arg.length === 0) {
      this.supplierInvoices = this.originalSupplierInvoices;
    } else {
      this.supplierInvoices = this.originalSupplierInvoices.filter(
        (invoice) => {
          return arg.some((project) =>
            invoice.Project.includes(project.CustomName)
          );
        }
      );
    }
  }

  setProject(argument: any) {


    if (argument === "1") {
      // Ako argument '1', to znači da se aktivirao SelectedUserAll, pa želimo prikazati sve supplierInvoice
      this.invocesByProject = "All"; // Postavite neku vrednost koja označava "sve"

      // Očistite filter po projektima i prikažite sve supplierInvoice
      this.supplierInvoices = this.originalSupplierInvoices;
      this.originForSearchSupplierInvoices = this.supplierInvoices;

      this.spinner = false;
      return; // Odmah završite funkciju kako biste izbegli dalje izvršavanje
    }

    if (Array.isArray(argument) && argument.length > 0) {
      // Pravimo niz imena projekata
      const projectNames = argument.map((item) => item.CustomName);

      this.invocesByProject = projectNames.join(", ");
/*       console.log(this.invocesByProject);
 */      this.currentSetProjectArgument = argument; // Postavi trenutni argument
      this.spinner = true;

      setTimeout(() => {
        if (this.invocesByStatus) {
          this.filterInvoiced(this.invocesByStatus);
        } else {
          // Pozivamo funkciju filterByProject sa nizom projekata
          this.filterByProject(argument);
        }

        this.originForSearchSupplierInvoices = this.supplierInvoices;
        if (this.searchText) {
          this.searchSupplierInvoices(this.searchText);
        }

        this.spinner = false;
      }, 500);
    }
  }

  Edit(invoice) {
    this.router.navigate(
      [
        "/projects/view/supplier-invoices/edit/",
        invoice["OrderNR"],
        invoice["ProjectID"],
        5,
        invoice["sirID"],
      ],
      { queryParams: { type: this.selectedType, openedFrom: "AllInvoices" } }
    );
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

          this.isSaveInProgress = false; // Postavite zastavicu natrag na false kada je operacija završena kako se ne bi 2x otvaralo ModalDialog
        });

    }
  }
  onSearchInputChange(text: string) {
    this.searchInput.next(text);
  }
  onBlur(event: Event) {
    const tdElement = event.target as HTMLElement;
    const textContent = tdElement.textContent.trim(); // Dobijemo sadržaj i uklonimo praznine na početku i kraju

    if (textContent) {
      // Ako ima sadržaja, pozovi saveCustomComment
      this.saveCustomComment(textContent);
    }
  }
  clearInput() {
    const currentArgument = this.selectedType; // Sačuvaj trenutni argument
    this.searchText = ""; // Postavi searchText na prazan string
    this.inputValue = ""; // Očisti vrednost u input polju
    this.setData(currentArgument);
    if (this.currentSetProjectArgument !== null) {



      this.setProject(this.currentSetProjectArgument);
    }
  }
  toHandle() {
    this.toHandleshow = !this.toHandleshow;
  }
  workedButNotAprovenShow() {
    this.workedButNotApprovedShow = !this.workedButNotApprovedShow;
  }
  approvedShow()
  {
    this.approvdShow=!this.approvdShow;
  }
  notReInvoic()
  {
      this.notReInvoicing=!this.notReInvoicing;

  }
  viewAll()
  {
    this.selectAll=!this.selectAll;
  }
  completedStatus()
  {
    this.completed=!this.completed;
  }

  onStatusChangeExternal(value) {

    const type = "all_supplier_invoices";
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

    //let search = document.getElementById('filterInput') as HTMLInputElement;
    //this.onSearch(search.value);
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
}
