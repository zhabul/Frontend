import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  AfterViewInit
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ClientsService } from "src/app/core/services/clients.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
//import { Location } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { AppService } from "src/app/core/services/app.service";
import { BASE_URL } from "../../.././config/index";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { ConfirmModalComponent } from "src/app/shared/modals/confirm-modal/confirm-modal.component";
import { AppComponent } from "src/app/app.component";
import { Subscription } from "rxjs";
import { AddingContactClientComponent } from "../adding-contact-client/adding-contact-client.component";
import { UsersService } from "../../../core/services/users.service";
import { PaymentPlanService } from "src/app/core/services/payment-plan.service";


@Component({
  selector: "app-client-details",
  templateUrl: "./client-details.component.html",
  styleUrls: ["./client-details.component.css"],
})
export class ClientDetailsComponent implements OnInit, AfterViewInit {
  clientCategories: any;
  public buttonToggle: boolean = true;
  public buttonName: string = "More details";
  public client: any;
  public theClient: any;
  public theClientInvoice: any;
  public boldOrNot: boolean = !true;

  public newWorker: any;

  public createForm: FormGroup;
  public createFormNewEmployee: FormGroup;
  public documentForm: FormGroup;

  public userDetails: any;

  public previousRoute: string;
  public cust_trans: any[];

  public showClientCategoryInput = false;
  editOrCreate: string;
  selectedCategoryId: any;

  public clientsUsingCategory = null;
  public showModal = false;
  public showAddContactForm = false;
  @ViewChild("newCategory") newCategory: ElementRef;
  @ViewChild("documentUpload") documentUpload: ElementRef;

  public invoices;
  selectedFiles: FileList;
  currentFile: File;
  errorUpload: String = "";
  public documents;
  public base = BASE_URL;
  public language;

  public isClickedOnSave: boolean = false;
  public projectSaveSubscription: Subscription;

  public selectedTab = 0;
  public showCommentsNumber = false;
  public selectedClientCategories: any[] = [];
  public spinner = false;

  public currentClass = "new-client";
  public currentClassDiv = "new-client-div";
  public enableActive = true;
  public notActive = true;
  public allPersons = [];
  fillColor: string = '82A7E2'; // Početna boja
  textColor: string = ''; // Početna boja teksta
  public commentsNumber = 0;
  public noviNiz=[];
  public statusClientWorker: any = {
    "0": false,
    "1": false,
    "all": false
  };
  public objData: any = {};
  public client_categories = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientsService: ClientsService,
    //private location: Location,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private appService: AppService,
    private translate: TranslateService,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog,
    private appComponent: AppComponent,
    private usersService: UsersService,
    private http: PaymentPlanService,


  ) {}

  ngOnInit() {

    this.language = sessionStorage.getItem("lang");
    this.translate.use(this.language);
    this.previousRoute = "/clients";
    this.appService.setBackRoute(this.previousRoute);
    this.appService.setShowAddButton = false;
    this.client = this.route.snapshot.data["client"];
    this.allPersons = this.route.snapshot.data["client"];
    this.allPersons = this.allPersons ? this.allPersons : [];
    this.clientCategories = this.route.snapshot.data["clientCategories"]["data"] || [];
    this.theClient = this.route.snapshot.data["oneClient"];
    this.selectedCategoryId = this.theClient.clientCategoryId ;
    this.theClientInvoice = this.route.snapshot.data["theClientInvoice"];
    this.invoices = this.route.snapshot.data["invoices"];
    this.documents = [] //this.route.snapshot.data["documents"]["data"] || [];
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

    this.createForm = this.fb.group({
      id: [this.theClient.Id, []],
      name: [this.theClient.Company],
      number: [this.theClient.Number, [Validators.required]],
      company: [this.theClient.Company, [Validators.required]],
      web_address: [this.theClient.WebAddress],
      company_id: [this.theClient.CompanyId, [Validators.required]],
      status: [this.theClient.Status],
      type: [this.theClient.Type],
      reversePaymentObligation: [this.theClient.ReversePaymentObligation],
      visiting_address_street_and_no: [
        this.theClient.VisitingAddressStreetAndNo,
      ],
      visiting_address_postnr: [this.theClient.VisitingAddressPostnr],
      visiting_address_city: [this.theClient.VisitingAddressCity],
      visiting_address_land: [this.theClient.VisitingAddressLand],
      invoice_address_street_and_no: [this.theClient.InvoiceAddressStreetAndNo],
      invoice_address_postnr: [this.theClient.InvoiceAddressPostnr],
      invoice_address_city: [this.theClient.InvoiceAddressCity],
      invoice_address_land: [this.theClient.InvoiceAddressLand],
      reference_ours: [this.theClient.ReferenceOurs],
      reference_theirs: [this.theClient.ReferenceTheirs],
      mobile_number: [this.theClient.MobileNumber],
      telephone_number: [this.theClient.TelephoneNumber],
      email: [this.theClient.Email, [Validators.email/*, Validators.required*/]],
      companyEmail: [this.theClient.companyEmail, [Validators.email]],
      clientEmail: [this.theClient.clientEmail, [Validators.email]],
      old_company_id: [this.theClient.CompanyId, [Validators.required]],
      vatNumber: [this.theClient.VatNumber, Validators.required],
      bedomning: [this.theClient.Bedomning],
      clientCategoryId: [this.theClient.clientCategoryId, [Validators.required]]
    });

    if(this.theClient.category_ids.length > 0){
      let checked_client = this.clientCategories.filter((category => { return this.theClient.category_ids.includes(category.Id) }));
      this.onSelect(checked_client)
    }

    this.newWorker = {
      clientID: this.theClient.Id,
      FirstName: "",
      LastName: "",
      Mobile: "",
      email: "",
      status: "Active",
      Title: "",
    };

    this.createFormNewEmployee = this.fb.group({
      id: [this.theClient.Id, []],
      addNewEmployeeFirstName: ["", [Validators.required]],
      addNewEmployeeLastName: ["", [Validators.required]],
      addNewEmployeePersonalNumber: ["", [Validators.required]],
      addNewEmployeeMobile: ["", [Validators.required]],
      addNewEmployeeEmail: ["", [Validators.required]],
      addNewEmployeeStatus: ["", [Validators.required]],
      addNewEmployeeTitle: ["", [Validators.required]],
    });

    this.documentForm = this.fb.group({
      clientDocument: [null, Validators.required],
    });

    if(this.userDetails.create_register_customers) {
      this.createForm.enable();
    }else {
      this.createForm.disable();
    }
    this.findSelectedCategory();
    this.getComments();
  }

  ngAfterViewInit() {
    this.getUserPermissionTabs();
  }

  toggleAddContact() {
    this.showAddContactForm = !this.showAddContactForm;
  }

  buttonNameToggle() {
    this.buttonToggle = !this.buttonToggle;

    if (this.buttonToggle == false) {
      this.buttonName = "Hide";
    } else {
      this.buttonName = "More details";
    }
  }

  onChangeClientType(argument) {
    let cli = this.theClient;

    if (cli.Type != argument) {
      if (this.theClient.Type == "0") this.theClient.Type = "1";
      else this.theClient.Type = "0";
    }
  }

  onChangeClientReversePaymentObligation(argument) {
    let cli = this.theClient;

    if (cli.status != argument) {
      if ((this.theClient.ReversePaymentObligation = "0"))
        this.theClient.ReversePaymentObligation == "1";
      else this.theClient.ReversePaymentObligation = "0";
    }
  }

  createOrUpdateClient() {
    const data = this.createForm.value;
    data.clientCategoryId = this.selectedCategoryId;
    data.categories = this.client_categories;

    this.clientsService.updateOneClient(data).subscribe((res) => {
      if (res["status"]) {
        this.toastr.success(
          this.translate.instant("You have successfully updated the client."),
          this.translate.instant("Success")
        );
        this.router.navigate(["clients"]);
      }
    });
  }

  toggleWorkerStatus(index) {
    if (this.showAddContactForm) return;
    let worker = this.client[index];
    if (!this.client["req"]) {
      if (worker.status == "Active") worker.status = "Inactive";
      else worker.status = "Active";
      this.client["req"] = true;
      this.clientsService
        .updateOneClientStatus(worker.Id, worker.status)
        .subscribe((res) => {
          this.client["req"] = false;
        });
    }
  }

  toggleNewWorkerStatus() {
    if (this.newWorker.status == "Active") this.newWorker.status = "Inactive";
    else this.newWorker.status = "Active";
  }

  deleteWorker(index) {
    if (this.showAddContactForm) return;
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
          this.clientsService
            .removeOneWorker(this.client[index]["Id"])
            .subscribe((response) => {
              if (response["status"]) {
                this.client.splice(index, 1);
                this.toastr.success(
                  this.translate.instant(
                    "You have successfully deleted the client."
                  ),
                  this.translate.instant("Success")
                );
              } else {

                this.toastr.error(
                  this.translate.instant(
                    response.msg
                  ),
                  this.translate.instant("Error")
                );
              }
            });
        } else {
          this.toastr.info(
            this.translate.instant("You have canceled the delete operation."),
            this.translate.instant("Info")
          );
        }
      });
  }

    validateEmail = (email) => {
      let res = email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );

      return (res && res.length > 0)
    };

  addOneWorker() {

    if (this.newWorker.firstName != "" && this.newWorker.lastName != "" && this.validateEmail(this.newWorker.email) &&
    (this.client === null || this.client.find(x => x.email == this.newWorker.email) == null)
    ) {
      this.clientsService.addOneWorker(this.newWorker).subscribe((res) => {
        if (res.status) {
          this.newWorker["Id"] = res.data.worker_id;

          this.client = this.client || [];

          this.client.push(this.newWorker);

          this.newWorker = {
            clientID: this.theClient.Id,
            FirstName: "",
            LastName: "",
            Mobile: "",
            email: "",
            status: "Active",
            Title: "",
          };

          if (window.sessionStorage.getItem("lang").toLowerCase() === "en") {
            this.toastr.success(
              "You have successfully added a new contact person.",
              "New contact added to client!"
            );
          } else if (
            window.sessionStorage.getItem("lang").toLowerCase() === "sw"
          ) {
            this.toastr.success(
              "Du har lagt till ny kontakperson.",
              "Arbetare lagt till klienten!"
            );
          }

          this.showAddContactForm = false;
        }
      });
    }
  }

  onTypeChange(type) {
    this.createForm.value.type = type;
  }

  toggleClientCategoryInput() {
    this.showClientCategoryInput = !this.showClientCategoryInput;
  }

  openAddClientCategory(newCategory) {
    this.editOrCreate = "add";
    this.toggleClientCategoryInput();
    newCategory.value = "";
    this.cd.detectChanges();
    this.newCategory.nativeElement.focus();
  }

  openEditClientCategory(categorySelected, newCategory) {
    if (categorySelected.value === "0") {
      return;
    }
    this.editOrCreate = "edit";
    this.toggleClientCategoryInput();
    this.cd.detectChanges();
    this.newCategory.nativeElement.focus();
    newCategory.value =
      this.clientCategories[
        this.clientCategories.findIndex(
          (cat) => cat.Id == categorySelected.value
        )
      ].name;
  }

  addOrEditClientCategory(categorySelected, newCategoryValue) {

    if (newCategoryValue.trim() === "") {
      if (sessionStorage.getItem("lang") === "sw") {
        this.toastr.error(`Kategorinamn kan inte vara tomt.`, "Fel");
      } else {
        this.toastr.error("Category name can't be empty.", "Error");
      }

      return;
    }


    if (this.editOrCreate === "add") {
      this.clientsService
        .addClientCategory(newCategoryValue.trim())
        .subscribe((res) => {
          if (res["status"] == -1) {
            if (sessionStorage.getItem("lang") === "sw") {
              this.toastr.error("Kategori finns redan.", "Fel");
            } else {
              this.toastr.error(
                this.translate.instant("TSC_CATEGORY_ALREADY_EXISTS"),
                this.translate.instant("Error")
              );
            }
            return;
          }

          if (res["status"]) {
            this.clientCategories.push({
              Id: res.id,
              name: newCategoryValue.trim(),
            });
            setTimeout(() => {
              categorySelected.selectedIndex =
                categorySelected.options.length - 1;
            }, 10);
            this.categoryChange(res.id);
            this.toggleClientCategoryInput();
            this.toastr.success(
              this.translate.instant(
                "TSC_SUCCESSFULLY_CREATED_NEW_CLIENT_CATEGORY"
              ),
              this.translate.instant("Success")
            );
          } else {
            this.toastr.error(
              this.translate.instant("TSC_ERROR_CREATING_CLIENT_CATEGORY"),
              this.translate.instant("Error")
            );
          }
        });
    } else if (this.editOrCreate === "edit") {
      if (
        categorySelected.options[
          categorySelected.selectedIndex
        ].innerText.trim() === newCategoryValue.trim()
      ) {
        return;
      }

      this.clientsService
        .editClientCategory(categorySelected.value, newCategoryValue.trim())
        .subscribe((res) => {
          if (res["status"] == -1) {
            if (sessionStorage.getItem("lang") === "sw") {
              this.toastr.error("Kategori finns redan.", "Fel");
            } else {
              this.toastr.error(
                this.translate.instant("TSC_CATEGORY_ALREADY_EXISTS"),
                this.translate.instant("Error")
              );
            }
            return;
          }

          if (res["status"]) {
            this.clientCategories[
              this.clientCategories.findIndex(
                (cat) => cat.Id == categorySelected.value
              )
            ].name = newCategoryValue.trim();
            this.toggleClientCategoryInput();

            this.toastr.success(
              this.translate.instant("TSC_SUCCESSFULLY_EDITED_CLIENT_CATEGORY"),
              this.translate.instant("Success")
            );
          } else {
            this.toastr.error(
              this.translate.instant("TSC_ERROR_EDITING_CLIENT_CATEGORY"),
              this.translate.instant("Error")
            );
          }
        });
    }
  }

  categoryChange(clientCategoryId) {
    this.selectedCategoryId = clientCategoryId;
  }

  deleteClientCategory(clientCategory) {
    if (clientCategory.value === "0") {
      this.toastr.info(
        this.translate.instant("Select category to delete."),
        this.translate.instant("Info")
      );
      return;
    }
    const selectedIndex = clientCategory.selectedIndex;
    this.clientsService
      .deleteClientCategory(parseInt(clientCategory.value, 10))
      .subscribe((res) => {
        if (res["status"]) {
          this.clientCategories.splice(
            this.clientCategories.findIndex(
              (cat) => cat.Id == clientCategory.value
            ),
            1
          );
          setTimeout(() => {
            if (selectedIndex === clientCategory.options.length) {
              clientCategory.selectedIndex = clientCategory.options.length - 1;
            } else {
              clientCategory.selectedIndex = selectedIndex;
            }
          }, 10);
          this.categoryChange(clientCategory.value);

          this.toastr.success(
            this.translate.instant("TSC_SUCCESSFULLY_DELETED_CLIENT_CATEGORY"),
            this.translate.instant("Success")
          );
        } else {
          this.toastr.error(
            this.translate.instant("TSC_ERROR_DELETING_CLIENT_CATEGORY"),
            this.translate.instant("Error")
          );

          if (res["clientsUsingCategory"]) {
            this.clientsUsingCategory = res["clientsUsingCategory"];
          }

          this.showModal = true;
        }
      });
  }

  viewInvoices(id) {
    this.router.navigate(["clients", "invoices", id]);
  }

  viewAttachments(id) {
    this.router.navigate(["clients", "attachments", id]);
  }

  closeModal(e) {
    if (e) {
      if (e.target.id !== "looksLikeModal") {
        return;
      }
    }
    this.showModal = false;
    this.clientsUsingCategory = null;
  }

  handleFileInput(event) {
    this.errorUpload = "";
    this.selectedFiles = event.target.files;
  }

  uploadDocument() {
    if (this.documentForm.dirty && this.documentForm.valid) {
      this.currentFile = this.selectedFiles.item(0);

      this.clientsService
        .uploadDocument(this.theClient.Id, this.currentFile)
        .subscribe((res) => {
          if (res.error) {
            switch (res.error) {
              case "to big": {
                this.errorUpload =
                  "The File is too big, please reduce the size and try again";
                break;
              }
              case "wrong type": {
                this.errorUpload =
                  "This type of the file is not allowed. Following types are allowed: jpeg, jpg, png and pdf";
                break;
              }
              case "fake image": {
                this.errorUpload = "The File is not an image or pdf document";
                break;
              }
              case "file exists": {
                this.errorUpload = "File with same name already exists";
                break;
              }
            }
            this.documentForm.reset();
          } else if (res.status) {
            this.errorUpload = "";
            this.documentForm.reset();
            this.toastr.success(
              this.translate.instant("Document successfully added") + ".",
              this.translate.instant("Success")
            );
            this.getDocuments();
          }
        });
    } else if (!this.documentForm.dirty) {
      this.documentForm.reset();
    }
  }

  getDocuments() {
    this.projectSaveSubscription = this.clientsService.getDocuments(this.theClient.Id).subscribe((res) => {
      this.documents = res.data;
    });
  }

  removeDocument(id, event, i) {
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
          this.clientsService.removeDocument(id).subscribe((res) => {
            if (res) {
              this.documents.splice(i, 1);
              this.toastr.success(
                this.translate.instant("Document successfully removed") + ".",
                this.translate.instant("Success")
              );
            }
          });
        }
      });
  }




  /**
   *   Code za confirm modal
   */


  onSaveClient() {
    this.isClickedOnSave = true;
  }

  onConfirmationModal(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.disableClose = true;
      dialogConfig.width = "185px";
      dialogConfig.panelClass = "confirm-modal";
      this.dialog.open(ConfirmModalComponent, dialogConfig).afterClosed()
        .subscribe((response) => {
          if(response.result) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
    });
  }

    canDeactivate(): Promise<boolean> | boolean {
        if(this.isClickedOnSave){
            return true;
        } else {
            if(this.createForm.dirty && this.createForm.valid) {
                this.appComponent.loading = false;
                return this.onConfirmationModal();
            } else {
                return true;
            }
        }
    }

    formtMobileNumber(mobile_number) {
        this.clientsService.formatMobileNumber({'mobile_number': mobile_number}).subscribe((res:any) => {
            if(res.status) {
                this.newWorker.Mobile = res['result'];
            }
        });
    }

    goBack() {
        this.router.navigate(['clients'],  {queryParams: {from_edit: true}});
    // this.location.back();
    }

  setSelectedTab(tab) {
    this.selectedTab = tab;
  }

  onSelect(categories) {

    this.client_categories = [];
    categories.forEach((category)=> {
        this.client_categories.push(category.Id);
    });

    this.clientCategories.forEach((client) => {
      if(this.client_categories.includes(client.Id)) {
        client.checked = true;
      }else {
        client.checked = false;
      }
    });
    this.selectedCategoryId = categories[0]?.Id;
  }

  onSelectAll(categories) {

    this.client_categories = [];
    categories.forEach((category)=> {
        this.client_categories.push(category.Id);
    });

    this.clientCategories.forEach((client) => {
      if(this.client_categories.includes(client.Id)) {
        client.checked = true;
      }else {
        client.checked = false;
      }
    });
    this.selectedCategoryId = categories[0]?.Id;
  }

  onDeSelectAll(items) {
    this.selectedClientCategories = [];
  }

  onSearch(value) {

    if(value == undefined) {
      value = '';
    }

    let statuses = [];
    if(this.statusClientWorker[0]) {
      statuses.push('Active');
    }

    if(this.statusClientWorker[1]) {
      statuses.push('Inactive');
    }

    this.client = this.allPersons
      .filter((person) =>{
        return statuses.includes(person.status);
      })
      .filter((person) =>
        ["Title", "FirstName", "LastName", "Mobile","email"].some(
          (property) => {
            if (person[property]) {
              return person[property]
                .toLowerCase()
                .includes(value?.toLowerCase());
            } else {
              return false;
            }
          }
        )
      )
  }

  onStatusChangeExternal(value) {

    const type = "client_worker";
    var status = !this.statusClientWorker[value];
    if (value == "all") {
      this.checkAllExternal(status, type);
    } else {
      if (!status) {
        this.statusClientWorker["all"] = false;
      }
      this.statusClientWorker[value] = status;
      this.createUserPermissionTabs(value, type, status);
      this.handleAllStatus();
    }

    let search = document.getElementById('filterInput') as HTMLInputElement;
    this.onSearch(search.value);
  }

  getUserPermissionTabs() {
    this.usersService.getUserPermissionTabs().subscribe((res) => {
      this.spinner = false;
      const client_worker = res["data"]["client_worker"];
      if (client_worker) {
        const keys_project = Object.keys(client_worker);
        keys_project.forEach((status) => {
          this.statusClientWorker[status] = true;
        });

        if (keys_project.length == 2) {
          this.statusClientWorker["all"] = true;
        }
      }

      let search = document.getElementById('filterInput') as HTMLInputElement;
      this.onSearch(search?.value);
    });
  }

  checkAllExternal(status, type) {
    const keys = Object.keys(this.statusClientWorker);

    keys.forEach((key) => {
      this.statusClientWorker[key] = status;
      if (key !== "all") {
        this.createUserPermissionTabs(key, type, status);
      }
    });

  }

  handleAllStatus() {
    const statusObject = this.statusClientWorker;
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
    let search = document.getElementById('filterInput') as HTMLInputElement;
    search.value = "";
    this.onSearch(search.value);
  }

  enter() {
    this.currentClass = "new-client-hover";
    this.currentClassDiv = "new-client-div-hover";
  }

  leave() {
    this.currentClass = "new-client";
    this.currentClassDiv = "new-client-div";
  }

  allowEditSupplierInvoice() {

    let status = false;
    if (this.userDetails.create_register_customers) {
      status = true;
    }
    return status;
  }

  openAddingContactSupplierModal(worker) {
    /* $event.preventDefault(); */
    /* this.clientsService.client.next(this.createForm.value.client_id); */

    if(!this.allowEditSupplierInvoice()) {
      return;
    }

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.panelClass = "custom-modalbox-client-detail";
    diaolgConfig.panelClass = "custom-dialog-panel";
    diaolgConfig.panelClass = "custom-modalbox-client-detail";
    diaolgConfig.autoFocus = false;
    diaolgConfig.width = "";
    diaolgConfig.height = "auto";
    diaolgConfig.disableClose = false;
    diaolgConfig.data = {
      contactClient: worker,
      client_id: this.theClient.Id
    };

    this.dialog.open(AddingContactClientComponent, diaolgConfig)
    .afterClosed()
    .subscribe((res) => {

      if(res && res.type && res.type == 'delete') {
        let result = res.contactPerson;
        let index = this.client.findIndex((cl)=> {
          return cl.id == result.id
        });

        if(index > -1) {
          this.deleteWorker(index);
        }
      }

      if(res.result) {
        let result = res.contactPerson;
        if(result.id) {
          let index = this.client.findIndex((cl)=> {
            return cl.id == result.id
          });

          this.client[index].FirstName = result.Name;
          this.client[index].LastName = result.LastName;
          this.client[index].Mobile = result.Mobile;
          this.client[index].Mobile2 = result.Mobile2;
          this.client[index].PersonalNumber = result.PersonalNumber;
          this.client[index].Title = result.Title;
          this.client[index].email = result.email;
          this.client[index].status = result.status;
          this.client[index].comment = result.comment;
        }else {
          this.getClients();
        }
      }
    })
  }
  async removeClient(event: Event) {
    const clientId = this.theClient.Id
    event.preventDefault()
    event.stopPropagation(); // Ovo će spriječiti propagaciju događaja
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
          this.clientsService
            .removeOneClient(clientId)
            .subscribe((res) => {
              if (res["status"]) {
                if (this.language === "sw") {
                  this.toastr.success(
                    "Du har raderat leverantören.",
                    "Framgång"
                  );
                } else if (this.language === "en") {
                  this.toastr.success(
                    "You have successfully deleted the client.",
                    "Success"
                  );
                } else if (this.language === "hr") {
                  this.toastr.success(
                    "Uspješno ste izbrisali clienta",
                    "Success"
                  );
                }
                this.router.navigate([this.previousRoute]);

              } else {
                if (this.language === "sw") {
                  this.toastr.error(
                    "Det var ett fel med din inlämning.",
                    "Fel"
                  );
                } else if (this.language === "en") {
                  this.toastr.error(
                    "There was an error with your submission.",
                    "Error"
                  );
                } else if (this.language === "hr") {
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

    onMouseEnter() {
        this.fillColor = 'FF7000'; // Novi parametar boje
    }
    onMouseLeave() {
        this.fillColor = '82A7E2'; // Vraćanje na prethodnu boju
    }
    changeTextColor(color: string) {
        this.textColor = color;
    }

    selectedCatElement: any = [];

    findSelectedCategory() {
        for (let i = 0; i < this.clientCategories.length; i++) {
            let coworker = this.clientCategories[i];
            if (this.theClient.category_ids.includes(coworker.Id)) {
                this.selectedCatElement.push(coworker);
                break;
            }
        }
    }
    getComments() {
        const contentType = "client";
        this.http.getTheComments(this.theClient.Id, contentType).subscribe((res) => {
            if (res["data"].length > 0) {
                this.commentsNumber = res["data"].length;
                this.showCommentsNumber = true;
            }
        });
    }

    replacePhoneNumber(event, type) {

        if(type == 'mobile_number1') {
            this.createForm.get("mobile_number").patchValue(event);
        }

        if(type == 'telephone_number') {
            this.createForm.get("telephone_number").patchValue(event);
        }
    }

    getClients() {
      this.clientsService.getClient(this.theClient.Id).subscribe((res) => {
        this.client = res;
        this.allPersons = res;
      });
    }
}
