import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  AfterViewInit
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SuppliersService } from "src/app/core/services/suppliers.service";
import { Location } from "@angular/common";
import { AppService } from "src/app/core/services/app.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { ConfirmModalComponent } from "src/app/shared/modals/confirm-modal/confirm-modal.component";
import { AppComponent } from "src/app/app.component";
import { Subscription } from "rxjs";
import { AddingContactSupplierComponent } from "../adding-contact-supplier/adding-contact-supplier.component";
import { PaymentPlanService } from "src/app/core/services/payment-plan.service";
import { UsersService } from "../../../core/services/users.service";

@Component({
  selector: "app-supplier-details",
  templateUrl: "./supplier-details.component.html",
  styleUrls: ["./supplier-details.component.css"],
})
export class SupplierDetailsComponent implements OnInit, AfterViewInit {
    public supplier: any;
    public theSupplier: any;
    public createForm: FormGroup;
    boldOrNot: any;
    buttonName: string = "More details";
    public buttonToggle: boolean = false;
    public userDetails: any;
    public createFormNewEmployee: FormGroup;
    public newWorker: any;
    public titles: any;
    public categories: any;
    public previousRoute: string;
    supplierCategories: any;
    public showSupplierCategoryInput = false;
    editOrCreate: string;
    selectedCategoryId = "0";
    public suppliersUsingCategory = null;
    public showModal = false;
    addingOrEditing = false;
    addOrEditAction: string;
    showAddContactForm = false;
    public dropdownSettings: any = {};
    public language;
    public isClickedOnSave: boolean = false;
    public projectSaveSubscription: Subscription;
    public selectedTab = 0;
    public showCommentsNumber = false;
    public commentsNumber = 0;
    public enableActive: boolean = true;
    public notActive: boolean = true;
    public showAll: boolean = true;
    public currentClass = "title-new-project";
    public klik = false;
    fillColor: string = '82A7E2';
    public statusSupplierWorkers: any = {
        "0": false,
        "1": false,
        "all": false
    };
    public objData: any = {};
    public spinner = true;
    public filteredSuppliers = [];
    public filterInput: string = "";
    public supplier_id:any

  @ViewChild("newTitleInput") newTitleInput: ElementRef;
  @ViewChild("newCategory") newCategory: ElementRef;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog,
        private suppliersService: SuppliersService,
        private fb: FormBuilder,
        private location: Location,
        private appService: AppService,
        private toastr: ToastrService,
        private cd: ChangeDetectorRef,
        public translate: TranslateService,
        private appComponent: AppComponent,
        private http: PaymentPlanService,
        private usersService: UsersService,
    ) {}

    ngOnInit() {

        this.supplier_id = this.route.snapshot.params['id'];
        this.language = sessionStorage.getItem("lang");
        this.translate.use(this.language);
        this.previousRoute = "/suppliers";
        this.appService.setBackRoute(this.previousRoute);
        this.supplier = this.route.snapshot.data["supplierWorkers"];
        this.theSupplier = this.route.snapshot.data["oneSupplier"];
        this.titles = this.route.snapshot.data["supplierTitles"];
        this.supplierCategories = (
            this.route.snapshot.data["supplierCategories"]["data"] || []
        ).map((t) => {
            return {
                Id: t["Id"],
                Name: t["name"],
            };
        });

        this.dropdownSettings = {
            singleSelection: false,
            idField: "item_id",
            textField: "item_text",
            selectAllText: this.translate.instant("Select All"),
            unSelectAllText: this.translate.instant("unselect All"),
            searchPlaceholderText: this.translate.instant("Search"),
            itemsShowLimit: 0,
            allowSearchFilter: true,
            noDataAvailablePlaceholderText:
            this.translate.instant("No data available"),
        };

        this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

        this.createForm = this.fb.group({
            Id: [this.theSupplier.Id],
            orgnr: [this.theSupplier.orgnr, [Validators.required]],
            Name: [this.theSupplier.Name, [Validators.required]],
            customer_number: [this.theSupplier.customer_number],
            company_phone_1: [this.theSupplier.company_phone_1],
            Email: [this.theSupplier.Email, [Validators.required, Validators.email]],
            VisitingAddress: [this.theSupplier.VisitingAddress],
            VisitingAddressPostnr: [this.theSupplier.VisitingAddressPostnr],
            VisitingAddressCity: [this.theSupplier.VisitingAddressCity],
            VisitingAddressLand: [this.theSupplier.VisitingAddressLand],
            InvoiceAddressStreetAndNo: [this.theSupplier.InvoiceAddressStreetAndNo],
            InvoiceAddressPostnr: [this.theSupplier.InvoiceAddressPostnr],
            InvoiceAddressCity: [this.theSupplier.InvoiceAddressCity],
            InvoiceAddressLand: [this.theSupplier.InvoiceAddressLand],
            company_phone_2: [this.theSupplier.company_phone_2],
            WebAddress: [this.theSupplier.WebAddress],
            BankGiro: [this.theSupplier.BankGiro],
            PlusGiro: [this.theSupplier.PlusGiro],
            Active: [this.theSupplier.Active],
            CompanyEmail: [this.theSupplier.CompanyEmail],
            reference: [this.theSupplier.reference],
            our_reference: [this.theSupplier.our_reference],
            vat_registration_number: [this.theSupplier.vat_registration_number],
            reverse_charge: [this.theSupplier.reverse_charge],
            comapny_order_email:[ this.theSupplier.comapny_order_email],
        });

        this.newWorker = {
            SuplierID: this.theSupplier.Id,
            Title: "0",
            FirstName: "",
            LastName: "",
            Address: "",
            Email: "",
        };

        this.appService.setShowAddButton = false;
        this.getComments();
        this.allowEditSupplierInvoice();
    }

    ngAfterViewInit() {
        this.getUserPermissionTabs();
        this.allowEditSupplierInvoice();
    }

    toggleAddContactForm() {
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

    async updateSupplier() {
        const suppliers: any = await this.suppliersService
        .getSuppliers()
        .toPromise2();

        const hasEmail = suppliers.some((sup) => {
        return sup.Email == this.createForm.get("Email").value;
        });

        if (
        hasEmail &&
        this.createForm.get("Email").value != this.theSupplier.Email
        ) {
        return this.toastr.error(
            this.translate.instant("Email already in use") + ".",
            this.translate.instant("Error")
        );
        }

        const data = this.createForm.value;
        data.supplierCategoryId = this.selectedCategoryId;
        data["material_categories"] = this.theSupplier.material_categories;
        await this.suppliersService.updateOneSupplier(data);

        this.router.navigate(["/suppliers"]);
        this.toastr.success(
        this.translate.instant("Successfully updated supplier."),
        this.translate.instant("Success")
        );
    }

    addOneWorker() {
        if (
            this.newWorker.FirstName != "" &&
            this.newWorker.LastName != "" &&
            this.newWorker.Title != "0"
        ) {
        const newWorker = JSON.parse(JSON.stringify(this.newWorker));
        const titleId = newWorker.Title;
        newWorker.Title = this.titles.find(
            (title) => title.TitleID === newWorker.Title
        ).Name;
        newWorker.Email = newWorker.Email.trim();
        this.suppliersService.addOneWorker(newWorker).then((res) => {
            if (res.status) {
                this.newWorker["Id"] = res.data.worker_id;
                this.supplier = this.supplier || [];
                this.newWorker["Title"] = newWorker.Title;
                this.supplier.push(this.newWorker);
                this.newWorker = {
                    SuplierID: this.theSupplier.Id,
                    Title: titleId,
                    FirstName: "",
                    LastName: "",
                    Address: "",
                    Email: "",
                };
                this.showAddContactForm = false;
                this.toastr.success(
                    this.translate.instant("Successfully added supplier worker."),
                    this.translate.instant("Success")
                );
            }
        });
        } else {
        this.toastr.error(
            this.translate.instant("You have to fill out all of the fields."),
            this.translate.instant("Error")
        );
        }
    }

    onTitleSelect(value) {
        this.newWorker.Title = value;
    }

    deleteWorker(index, without_confirmation_message = false) {

        if(!this.allowEditSupplierInvoice()) {
            return;
        }

        if (this.showAddContactForm) return;
        if(without_confirmation_message) {
            this.removeWorker(index);
            return true;
        }

        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = false;
        diaolgConfig.disableClose = true;
        diaolgConfig.width = "";
        diaolgConfig.panelClass = "mat-dialog-confirmation";
        this.dialog
            .open(ConfirmationModalComponent, diaolgConfig)
            .afterClosed()
            .subscribe(async (response) => {
            if (response.result ) {
                this.removeWorker(index);
            }else {
                this.toastr.info(
                    this.translate.instant("You have canceled the delete operation."),
                    this.translate.instant("Info")
                );
            }
        });
    }

    removeWorker(index) {

        if(this.supplier[index]["id"]) {
            this.supplier[index]["Id"] = this.supplier[index]["id"];
        }

        this.suppliersService
        .removeOneSupplierWorker(this.supplier[index]["Id"])
        .subscribe((response) => {
            if (response["status"]) {
                this.supplier.splice(index, 1);
                this.toastr.success(
                this.translate.instant(
                    "You have successfully deleted the worker."
                ),
                this.translate.instant("Success")
                );
                this.onSearch();
            }
        });
    }

    goBack() {
        this.location.back();
    }

    toggleSupplierCategoryInput() {
        this.showSupplierCategoryInput = !this.showSupplierCategoryInput;
    }

    openAddSupplierCategory(newCategory) {
        this.editOrCreate = "add";
        this.toggleSupplierCategoryInput();
        this.cd.detectChanges();
        this.newCategory.nativeElement.focus();
        newCategory.value = "";
    }

    addOrEditSupplierCategory(newCategoryValue) {
        if (newCategoryValue.trim() === "") {
            if (sessionStorage.getItem("lang") === "sw") {
                this.toastr.error(`Kategorinamn kan inte vara tomt.`, "Fel");
            } else {
                this.toastr.error("Category name can't be empty.", "Error");
            }
            return;
        }

        this.suppliersService
        .addSupplierCategory(newCategoryValue.trim())
        .subscribe((res) => {
            if (res["status"] == -1) {
            this.toastr.error(
                this.translate.instant("TSC_CATEGORY_ALREADY_EXISTS"),
                this.translate.instant("Error")
            );
            return;
            }

            if (res["status"]) {
            this.supplierCategories.push({
                Id: res.id,
                Name: newCategoryValue.trim(),
            });
            this.supplierCategories = Object.assign([], this.supplierCategories);
            this.toggleSupplierCategoryInput();

            if (sessionStorage.getItem("lang") === "sw") {
                this.toastr.success("Skapad ny klientkategori.", "Framgång");
            } else {
                this.toastr.success(
                "Successfully created new supplier category.",
                "Success"
                );
            }
            } else {
            if (sessionStorage.getItem("lang") === "sw") {
                this.toastr.error(
                "Det uppstod ett fel vid försök att skapa en ny klientkategori.",
                "Fel"
                );
            } else {
                this.toastr.error(
                "There was an error while trying to create new supplier category.",
                "Error"
                );
            }
            }
        });
    }

    categoryChange(supplierCategoryId) {
        this.selectedCategoryId = supplierCategoryId;
    }

    deleteSupplierCategory() {
        if (this.theSupplier.material_categories.length == 0) {
        this.toastr.info(
            this.translate.instant("Select category to delete."),
            this.translate.instant("Info")
        );
        return;
        }
        if (
        this.theSupplier.material_categories.some(
            (material) => material.item_id == 1
        )
        ) {
        return this.toastr.error(
            this.translate.instant("You can not delete this Category" + ".")
        );
        }

        this.suppliersService.deleteSupplierCategory(
            this.theSupplier.material_categories.map((x) => x.Id)
        )
        .subscribe((res) => {
            if (res["status"]) {
                this.theSupplier.material_categories.forEach((x) => {
                    this.supplierCategories.splice(
                        this.supplierCategories.findIndex((cat) => cat.Id == x.Id),
                        1
                    );
                });
                this.theSupplier.material_categories = [];
                this.supplierCategories = Object.assign([], this.supplierCategories);

                if (sessionStorage.getItem("lang") === "sw") {
                    this.toastr.success("Klientkategorin har raderats.", "Framgång");
                } else {
                    this.toastr.success(
                        "Successfully deleted supplier category.",
                        "Success"
                    );
                }
            } else {
                if (sessionStorage.getItem("lang") === "sw") {
                    this.toastr.error(
                        "Det uppstod ett fel vid försök att ta bort klientkategori.",
                        "Fel"
                    );
                } else {
                    this.toastr.error(
                        "There was an error while trying to delete supplier category.",
                        "Error"
                    );
                }

                if (res["suppliersUsingCategory"]) {
                    this.suppliersUsingCategory = res["suppliersUsingCategory"];
                }
                this.showModal = true;
            }
        });
    }

    closeModal(e) {
        if (e) {
            if (e.target.id !== "looksLikeModal") {
                return;
            }
        }
        this.showModal = false;
        this.suppliersUsingCategory = null;
        this.suppliersUsingCategory = null;
    }

    showAddTitle(input) {

        input.value = "";
        this.addingOrEditing = true;
        this.addOrEditAction = "add";
        this.cd.detectChanges();
        this.newTitleInput.nativeElement.focus();
    }

    showEditTitle(select, input) {

        if (select.selectedIndex === 0) {
            this.toastr.info(
                this.translate.instant("First select title."),
                this.translate.instant("Info")
            );
        return;
        }

        input.value = select.options[select.selectedIndex].innerText;
        this.addingOrEditing = true;
        this.addOrEditAction = "edit";
        this.cd.detectChanges();
        this.newTitleInput.nativeElement.focus();
    }

    saveTitle(selectInput, newTitleValue) {
        if (newTitleValue.trim() === "") {
            this.toastr.error(
                this.translate.instant("Title can't be empty."),
                this.translate.instant("Error")
            );
            return;
        }

        if (
            selectInput.options[selectInput.selectedIndex].innerText.trim() ===
            newTitleValue.trim()
        ) {
            return;
        }

        if (this.addOrEditAction === "add") {

            this.suppliersService
            .addSupplierTitle(newTitleValue.trim())
            .then((res) => {
                if (res["status"] == -1) {
                        this.toastr.error(
                        this.translate.instant(
                            "There is already a title with that name."
                        ),
                        this.translate.instant("Error")
                    );
                    return;
                }
                if (res["status"]) {
                    this.titles.push({
                        TitleID: res.id,
                        Name: newTitleValue.trim(),
                    });
                    setTimeout(() => {
                        selectInput.selectedIndex = selectInput.options.length - 1;
                    }, 10);
                    this.onTitleSelect(res.id);
                    this.toastr.success(
                        this.translate.instant("Successfully created title."),
                        this.translate.instant("Success")
                    );
                    this.addingOrEditing = false;
                } else {
                    this.toastr.error(
                        this.translate.instant(
                            "There was an error while trying to create title."
                        ),
                        this.translate.instant("Error")
                    );
                    return;
                }
            });
        } else if (this.addOrEditAction === "edit") {
            this.suppliersService
            .editSupplierTitle(selectInput.value, newTitleValue.trim())
            .then((res) => {
                if (res["status"] == -1) {
                    this.toastr.error(
                        this.translate.instant(
                            "There is already a title with that name."
                        ),
                        this.translate.instant("Error")
                    );
                    return;
                }

                if (res["status"]) {
                    this.titles[
                    this.titles.findIndex(
                        (title) => title.TitleID == selectInput.value
                    )
                    ].Name = newTitleValue.trim();
                    this.toastr.success(
                        this.translate.instant("Successfully edited title."),
                        this.translate.instant("Success")
                    );
                    this.addingOrEditing = false;
                } else {
                    this.toastr.error(
                        this.translate.instant(
                            "There was an error while trying to edit title."
                        ),
                        this.translate.instant("Error")
                    );
                    return;
                }
            });
        }
    }

    deleteTitle(selectInput) {
        if(!this.allowEditSupplierInvoice()) {
            return;
        }
        if (selectInput.selectedIndex === 0) {
            this.toastr.info(
                this.translate.instant("First select title."),
                this.translate.instant("Info")
            );
            return;
        }

        if (this.showAddContactForm) return;
        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = false;
        diaolgConfig.disableClose = true;
        diaolgConfig.width = "";
        diaolgConfig.panelClass = "mat-dialog-confirmation";
        this.dialog
        .open(ConfirmationModalComponent, diaolgConfig)
        .afterClosed()
        .subscribe(async (response) => {
            if (response.result) {
                const selectedIndex = selectInput.selectedIndex;
                this.suppliersService
                .deleteSupplierTitle(selectInput.value)
                .then((res) => {
                if (res["status"]) {
                    this.titles.splice(
                        this.titles.findIndex(
                            (title) => title.TitleID == selectInput.value
                        ),
                        1
                    );
                    setTimeout(() => {
                        if (selectedIndex === selectInput.options.length) {
                            selectInput.selectedIndex = selectedIndex - 1;
                        } else {
                            selectInput.selectedIndex = selectedIndex;
                        }
                    }, 10);
                    this.onTitleSelect(selectInput.value);
                    this.toastr.success(
                        this.translate.instant("Successfully deleted title."),
                        this.translate.instant("Success")
                    );
                } else {
                    this.toastr.error(
                        this.translate.instant(
                            "There was an error while trying to delete title."
                        ),
                        this.translate.instant("Error")
                    );
                }
                });
            } else {
                this.toastr.info(
                    this.translate.instant("Canceled deleting title."),
                    this.translate.instant("Info")
                );
            }
        });
    }

    closeAddEditMode() {
        this.addingOrEditing = false;
    }

  /**
   *  Code za confirmation modal
   */

    onClickSave() {
        this.isClickedOnSave = true;
    }

    onConfirmationModal(): Promise<boolean> {
        return new Promise((resolve, reject) => {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = false;
        dialogConfig.disableClose = true;
        dialogConfig.width = "185px";
        dialogConfig.panelClass = "confirm-modal";
        this.dialog
            .open(ConfirmModalComponent, dialogConfig)
            .afterClosed()
            .subscribe((response) => {
                if (response.result) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    canDeactivate(): Promise<boolean> | boolean {
        if (this.isClickedOnSave) {
            return true;
        } else {
            if (this.createForm.dirty && this.createForm.valid) {
                this.appComponent.loading = false;
                return this.onConfirmationModal();
            } else {
                return true;
            }
        }
    }

    setSelectedTab(tab) {
        this.selectedTab = tab;
    }

  /** ---------------------------------------------------------------------- */
    clearInput() {
        this.filterInput = ""; // Očisti unos
        this.onSearch();
    }

    enableActiveStatus() {
        this.enableActive = !this.enableActive;
        if (this.notActive == true && this.enableActive == true) {
            this.showAll = true;
        }
        if (this.notActive == false || this.enableActive == false) {
            this.showAll = false;
        }
    }

    enableNotActiveStatus() {
        this.notActive = !this.notActive;
        if (this.notActive == true && this.enableActive == true) {
            this.showAll = true;
        }
        if (this.notActive == false || this.enableActive == false) {
            this.showAll = false;
        }
    }

    showAllStatus() {
        this.showAll = !this.showAll;
        //odmah upali i aktivne i neaktivne
        if (this.showAll == true) {
            this.notActive = true;
            this.enableActive = true;
        } else {
            this.notActive = false;
            this.enableActive = false;
        }
    }


    enter() {
        this.currentClass = "title-new-project-hover";
        this.fillColor='FF7000';
    }

    leave() {
        this.currentClass = "title-new-project";
        this.fillColor='82A7E2';
    }

    openAddingContactSupplierModal(worker = null) {

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
        diaolgConfig.data = {'supplier_id': this.supplier_id, 'worker': worker};
        this.dialog.open(AddingContactSupplierComponent, diaolgConfig)
        .afterClosed()
        .subscribe((response) => {

            let index = this.supplier.findIndex((supp)=> {
                return supp.id == response.id
            });

            if(response && response.type == 'create_or_update') {

                if(index > -1 ){
                    this.supplier[index]= response;
                }else {
                    this.supplier.push(response);
                }
            }else {
                if(index > -1 ){
                    this.deleteWorker(index, true);
                }
            }
            this.onSearch();
        });
    }

    onSelect(selectedCategories) {
        // Filter out duplicates and concatenate the selected categories with the existing ones
        this.supplierCategories = this.supplierCategories
        .concat(selectedCategories)
        .filter(
            (item, index, self) => self.findIndex((i) => i.Id === item.Id) === index
        );
        this.theSupplier.material_categories = selectedCategories;
    }

    onSelectAll(selectedCategories) {
        this.theSupplier.material_categories = selectedCategories;
    }

    onDeSelectAll(items) {
        this.theSupplier.material_categories = [];
    }

    async removeSupplier(event: Event) {

        const supplierId = this.theSupplier.Id
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
            this.suppliersService
                .removeOneSupplier(supplierId)
                .subscribe((res) => {
                if (res["status"]) {
                    if (this.language === "sw") {
                        this.toastr.success(
                            "Du har raderat leverantören.",
                            "Framgång"
                        );
                    } else if (this.language === "en") {
                        this.toastr.success(
                            "You have successfully deleted the supplier.",
                            "Success"
                        );
                    } else if (this.language === "hr") {
                        this.toastr.success(
                            "Uspješno ste izbrisali dobavljača.",
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

    getComments() {
        const contentType = "supplier";
        this.http.getTheComments(this.theSupplier.Id, contentType).subscribe((res) => {
            if (res["data"].length > 0) {
                this.commentsNumber = res["data"].length;
                this.showCommentsNumber = true;
            }
        });
    }

    onStatusChangeExternal(value) {

        const type = "supplier_workers";
        var status = !this.statusSupplierWorkers[value];
        if (value == "all") {
            this.checkAllExternal(status, type);
        } else {
            if (!status) {
                this.statusSupplierWorkers["all"] = false;
            }
            this.statusSupplierWorkers[value] = status;
            this.createUserPermissionTabs(value, type, status);
            this.handleAllStatus();
        }
        this.onSearch();
    }

    handleAllStatus() {

        const statusObject = this.statusSupplierWorkers;
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

        const keys = Object.keys(this.statusSupplierWorkers);
        keys.forEach((key) => {
            this.statusSupplierWorkers[key] = status;
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

    getUserPermissionTabs() {

        this.usersService.getUserPermissionTabs().subscribe((res) => {
            this.spinner = false;
            const suppliers = res["data"]["supplier_workers"];
            if (suppliers) {
                const keys_project = Object.keys(suppliers);
                keys_project.forEach((status) => {
                    this.statusSupplierWorkers[status] = true;
                });

                if (keys_project.length == 2) {
                    this.statusSupplierWorkers["all"] = true;
                }
            }
            this.onSearch();
        });
    }

    onSearch(): void {

        let statuses = [];
        if(this.statusSupplierWorkers[0]) {
            statuses.push('1');
        }

        if(this.statusSupplierWorkers[1]) {
            statuses.push('0');
        }

        this.filterInput = this.filterInput.toLowerCase();
        this.filteredSuppliers = this.supplier.filter(
        (supplier) => {
            return statuses.includes(supplier.Active);
        })
        .filter((supplier) => {
            return (
            supplier.FirstName?.toLowerCase().includes(this.filterInput) ||
            supplier.LastName.toLowerCase().includes(this.filterInput) ||
            supplier.Email.toLowerCase().includes(this.filterInput) ||
            supplier.Title.toLowerCase().includes(this.filterInput) ||
            supplier.Address.toLowerCase().includes(this.filterInput)
            );
        });
    }

    onInputChange(): void {
        this.onSearch();
    }

    replacePhoneNumber(event, type) {

        if(type == 'company_phone_1') {
            this.createForm.get("company_phone_1").patchValue(event);
        }

        if(type == 'company_phone_2') {
            this.createForm.get("company_phone_2").patchValue(event);
        }
    }

    allowEditSupplierInvoice() {

        let status = false;
        if (this.userDetails.create_register_suppliers) {
          status = true;
        }

        if (!status) {
          this.createForm.disable();
        } else {
            this.createForm.enable();
        }
        return status;
    }
}
