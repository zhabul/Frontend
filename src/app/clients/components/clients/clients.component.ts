import { Component, OnInit, AfterViewInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ClientsService } from "../../../core/services/clients.service";
import { SorterService } from "src/app/core/services/sorter.service";
import { Location } from "@angular/common";
import { AppService } from "src/app/core/services/app.service";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
//import { FortnoxApiService } from "src/app/core/services/fortnoxApi.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { UsersService } from "../../../core/services/users.service";

@Component({
  selector: "app-clients",
  templateUrl: "./clients.component.html",
  styleUrls: ["./clients.component.css"],
})
export class ClientsComponent implements OnInit, AfterViewInit {
  public clients: any[];
  public statusText: string;
  public searchText: string;
  public currentAddRoute: string;
  public previousRoute: string;
  public cust_trans: any[];
  public language;
  public page = 1;
  public numberOfRowsArray = [];

  public userDetails: any;
  originalClients: any;
  public allClients = [];
  lang = sessionStorage.getItem("lang");
  public showPaginate: boolean = true;

  public currentClass = "new-client";
  public currentClassDiv = "new-client-div";
  public enableActive = true;
  public notActive = true;
  fillColor: string = '82A7E2'; // Početna boja
  textColor: string = ''; // Početna boja teksta
  public statusClient: any = {
    "0": false,
    "1": false,
    "all": false
  };
  public objData: any = {};
  public spinner = true;
  public from_edit:boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientsService: ClientsService,
    private sorterService: SorterService,
    private location: Location,
    private appService: AppService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private dialog: MatDialog,
   // private fortnoxApi: FortnoxApiService,
    private usersService: UsersService,
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
        this.from_edit = params.get("from_edit") ? JSON.parse(params.get("from_edit")) : false;
    });

    if(!this.from_edit) {
        sessionStorage.removeItem("filterClientsBySearch");
    }
    this.language = sessionStorage.getItem("lang");
    this.translate.use(this.language);

    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

    this.currentAddRoute = "/clients/new";
    this.previousRoute = "/home";
    this.appService.setBackRoute(this.previousRoute);
    this.appService.setAddRoute(this.currentAddRoute);
    this.appService.setShowAddButton =
      true && this.userDetails.create_register_customers;

    this.clients = this.route.snapshot.data["clients"]["data"];
    // if (this.clients[0]) {
    //   this.numberOfRowsArray = new Array(
    //     Math.ceil(this.clients[0].numberOfRows / 20)
    //   );
    // } else {
    //   this.numberOfRowsArray = [];
    // }
    this.originalClients = JSON.parse(JSON.stringify(this.clients));

    this.clientsService.getClients(0).subscribe((res) => {
      this.allClients = res["data"];
    });
  }

  ngAfterViewInit() {
    this.getUserPermissionTabs();
    this.refreshSearch();
  }

  async removeClient(i, e) {

    if(!this.userDetails.create_register_customers) {
      return;
    }

    const clientId = this.clients[i]["Id"];

    e.stopPropagation();

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.data = {
      questionText: "Do you really want to remove the client?",
    };
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          this.clientsService.removeOneClient(clientId).subscribe((res) => {
            if (res["status"]) {
              this.toastr.success(
                this.translate.instant(
                  "You have successfully deleted the client."
                ),
                this.translate.instant("Success")
              );
              /*
                            this.fortnoxApi
                              .removeClient(this.clients[i].Number)
                              .then((res1) => {
                                if (res1) {
                                  this.toastr.success(
                                    this.translate.instant(
                                      "You have successfully deleted a client from Fortnox."
                                    ),
                                    this.translate.instant("Success")
                                  );
                                }
                              });
              */
              this.allClients.splice(i, 1);
              let search = document.getElementById('filterInput') as HTMLInputElement;
              this.onSearch(search.value);
            } else {
              this.toastr.error(
                this.translate.instant(
                  "There was an error with your submission."
                ),
                this.translate.instant("Error")
              );
            }
          });
        }
      });
  }

  viewDetailsClick(e, id) {
    e.preventDefault();
    if (true) {
      this.router.navigate(["clients/details", id]);
    }
  }

  sort(prop: string) {
    this.sorterService.sort(this.clients, prop);
  }

  goBack() {
    this.location.back();
  }

  paginate(newPage) {
    if (newPage > this.numberOfRowsArray.length || newPage < 1) {
      return;
    }

    this.clientsService.getClients(newPage).subscribe((res) => {
      this.clients = res["data"];
      this.page = newPage;
    });
  }

  get nextPage() {
    return this.page + 1;
  }

  get previousPage() {
    return this.page - 1;
  }

  enableActiveStatus() {
    this.enableActive = !this.enableActive;
    let search = document.getElementById('filterInput') as HTMLInputElement;
    this.onSearch(search.value);
  }

  enableNotActiveStatus() {
    this.notActive = !this.notActive;
    let search = document.getElementById('filterInput') as HTMLInputElement;
    this.onSearch(search.value);
  }

  showAllStatus() {
    if (!this.enableActive || !this.notActive) {
      this.enableActive = true;
      this.notActive = true;
    } else {
      this.enableActive = false;
      this.notActive = false;
    }
    let search = document.getElementById('filterInput') as HTMLInputElement;
    this.onSearch(search.value);
  }

  clearInput() {
    sessionStorage.removeItem("filterClientsBySearch");
    this.from_edit = false;
    let search = document.getElementById('filterInput') as HTMLInputElement;
    search.value = "";
    this.onSearch(search.value);
  }

    refreshSearch() {
        let filterUsersBySearch = JSON.parse(sessionStorage.getItem("filterClientsBySearch"));
        if(filterUsersBySearch && filterUsersBySearch.length > 0) {
            let search = document.getElementById('filterInput') as HTMLInputElement;
            search.value = filterUsersBySearch;
            this.onSearch(search.value);
        }
    }

  enter() {
    this.currentClass = "new-client-hover";
    this.currentClassDiv = "new-client-div-hover";
  }

  leave() {
    this.currentClass = "new-client";
    this.currentClassDiv = "new-client-div";
  }
  onMouseEnter() {
    // Promjena boje unutar djeteta na hover
    this.fillColor = 'FF7000'; // Novi parametar boje
  }

  changeTextColor(color: string) {
    this.textColor = color;
  }
  onMouseLeave() {
    // Resetiranje boje unutar djeteta nakon hovera
    this.fillColor = '82A7E2'; // Vraćanje na prethodnu boju
  }
  navigateToNewCustomer() {
    this.router.navigate(['/clients/new']);
  }

  onStatusChangeExternal(value) {

    const type = "client";
    var status = !this.statusClient[value];
    if (value == "all") {
      this.checkAllExternal(status, type);
    } else {
      if (!status) {
        this.statusClient["all"] = false;
      }
      this.statusClient[value] = status;
      this.createUserPermissionTabs(value, type, status);
      this.handleAllStatus();
    }

    let search = document.getElementById('filterInput') as HTMLInputElement;
    this.onSearch(search.value);
  }

  checkAllExternal(status, type) {
    const keys = Object.keys(this.statusClient);

    keys.forEach((key) => {
      this.statusClient[key] = status;
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
    const statusObject = this.statusClient;
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

  getUserPermissionTabs() {
    this.usersService.getUserPermissionTabs().subscribe((res) => {
      this.spinner = false;
      const client = res["data"]["client"];
      if (client) {
        const keys_project = Object.keys(client);
        keys_project.forEach((status) => {
          this.statusClient[status] = true;
        });

        if (keys_project.length == 2) {
          this.statusClient["all"] = true;
        }
      }

      let search = document.getElementById('filterInput') as HTMLInputElement;
      this.onSearch(search?.value);
    });
  }


    onSearch(value) {

        sessionStorage.setItem("filterClientsBySearch", JSON.stringify(value));
        if(value == undefined) {
            value = '';
        }

        if (value != "") {
            this.showPaginate = false;
            this.page = 1;
        } else {
            this.showPaginate = true;
        }

        let statuses = [];
        if(this.statusClient[0]) {
            statuses.push('1');
        }

        if(this.statusClient[1]) {
            statuses.push('0');
        }

        this.clients = this.allClients.filter((client) =>{
            return statuses.includes(client.Active);
        }).filter((client) =>
                ["Number", "Name", "CompanyId", "InvoiceAddressStreetAndNo"].some(
                (property) => {
                    if (client[property]) {
                    return client[property]
                        .toLowerCase()
                        .includes(value?.toLowerCase());
                    } else {
                        return false;
                    }
                }
            )
        )
    }
}
