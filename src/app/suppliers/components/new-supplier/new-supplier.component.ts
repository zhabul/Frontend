import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  AfterViewInit
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SuppliersService } from "src/app/core/services/suppliers.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AppService } from "src/app/core/services/app.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-new-supplier",
  templateUrl: "./new-supplier.component.html",
  styleUrls: ["./new-supplier.component.css"],
})
export class NewSupplierComponent implements OnInit, AfterViewInit {
  public createForm: FormGroup;
  boldOrNot: any;
  supplierFormOrderEmail: string = "";
  validatorCSS = false;
  categories: any;
  public previousRoute: string;
  supplierCategories: any;
  public showSupplierCategoryInput = false;
  editOrCreate: string;
  selectedCategoryId: any;
  public spinner = false;

  public suppliersUsingCategory = null;
  public showModal = false;
  userDetails: any;

  public dropdownSettings: any = {};
  public selectedMaterialCategories: any[] = [];

  public selectedTab = 0;

  public commentid = 17992;
  public commentsNumber = 1;
  public showCommentsNumber = true;

  @ViewChild("newCategory") newCategory: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private suppliersService: SuppliersService,
    private appService: AppService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
    public translate: TranslateService
  ) {}

  ngAfterViewInit() {
    this.allowEditSupplierInvoice();
  }

  ngOnInit() {
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    this.supplierCategories = (
      this.route.snapshot.data["supplierCategories"]["data"] || []
    ).map((t) => {
      return {
        Id: t["Id"],
        Name: t["name"],
      };
    });
    this.selectedCategoryId = "1";

    this.previousRoute = "/suppliers";
    this.appService.setBackRoute(this.previousRoute);
    this.appService.setShowAddButton = false;

    this.dropdownSettings = {
      singleSelection: false,
      idField: "item_id",
      textField: "item_text",
      selectAllText: this.translate.instant("Select All"),
      unSelectAllText: this.translate.instant("Unselect All"),
      itemsShowLimit: 0,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText:
        this.translate.instant("No data available"),
      searchPlaceholderText: this.translate.instant("Search"),
    };

    this.createForm = this.fb.group({
      /*  Orgnr: ["", [ Validators.required ]], */
      Name: ["", [Validators.required]],
      customer_number: ["", [Validators.required]],
      company_phone_1: ["", []],
      company_phone_2: ["", []],
      Email: ["", [Validators.required, Validators.email]],
      VisitingAddress: [""],
      VisitingAddressPostnr: [""],
      VisitingAddressCity: [""],
      VisitingAddressLand: [""],
      InvoiceAddressStreetAndNo: [""],
      InvoiceAddressPostnr: [""],
      InvoiceAddressCity: [""],
      InvoiceAddressLand: [""],
      WebAddress: [""],
      BankGiro: [""],
      PlusGiro: [""],
      Active: ["0"],
      CompanyEmail: ["", []],
      Category: [1],
      //ovo dodajem
      reverse_charge: ["0"],
      Orgnr: ["", [Validators.required]],
      comapny_order_email: ["", [Validators.email]],
      reference: [""],
      our_reference: [""],
      vat_registration_number: [""],
    });
  }

  createSupplier() {
    if (this.createForm.invalid) {
      console.log(document.querySelector(".is-invalid"));
      setTimeout(() => {
        if (document.querySelector(".is-invalid")) {
          document.querySelector(".is-invalid").scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }
      }, 100);
      return;
    }
    const data = this.createForm.value;
    data.supplierCategoryId = this.selectedCategoryId;
    data["material_categories"] = this.selectedMaterialCategories;
    this.spinner = true;

    this.suppliersService.addNewSupplier(data).subscribe({
      next: (res) => {
        if (!res["status"]) {
          if (res["data"]["code"] === -1) {
            this.createForm.controls["Email"].markAsDirty();
            this.createForm.controls["Email"].setErrors({
              exists: true,
            });
          }
        } else {
          this.toastr.success(
            this.translate.instant("Successfully created supplier."),
            this.translate.instant("Success")
          );
          this.router.navigate(["/suppliers"]);
        }

        this.spinner = false;
      },
      error: (e) => {
        this.spinner = false;
        this.toastr.error(
          this.translate.instant("Email already in use."),
          this.translate.instant("Error")
        );
      },
    });
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
      this.toastr.error(
        this.translate.instant("Category name can't be empty."),
        this.translate.instant("Error")
      );
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

          this.toastr.success(
            this.translate.instant(
              "Successfully created new supplier category."
            ),
            this.translate.instant("Success")
          );
        } else {
          this.toastr.error(
            this.translate.instant(
              "Error while creating new supplier category."
            ),
            this.translate.instant("Error")
          );
        }
      });
  }

  categoryChange(supplierCategoryId) {
    this.selectedCategoryId = supplierCategoryId;
  }

  deleteSupplierCategory() {
    if (this.selectedMaterialCategories.length == 0) {
      this.toastr.info(
        this.translate.instant("Select category to delete."),
        this.translate.instant("Info")
      );
      return;
    }
    this.cd.detectChanges(); // Osvježava prikaz nakon brisanja

    this.suppliersService
      .deleteSupplierCategory(this.selectedMaterialCategories.map((x) => x.Id))

      .subscribe((res) => {
        if (res["status"]) {
          this.selectedMaterialCategories.forEach((x) => {
            this.supplierCategories.splice(
              this.supplierCategories.findIndex((cat) => cat.Id == x.Id),
              1
            );
          });
          this.selectedMaterialCategories = [];
          this.supplierCategories = Object.assign([], this.supplierCategories);
          this.cd.detectChanges(); // Osvježava prikaz nakon brisanja
          this.toastr.success(
            this.translate.instant("Successfully deleted supplier category."),
            this.translate.instant("Success")
          );
          this.cd.detectChanges(); // Osvježava prikaz nakon brisanja
        } else {
          this.toastr.error(
            this.translate.instant("Error while deleting supplier category."),
            this.translate.instant("Error")
          );

          if (res["suppliersUsingCategory"]) {
            this.suppliersUsingCategory = res["suppliersUsingCategory"];
          }
          this.showModal = true;
          console.log("ShowModal je sada true brisem kategoriju");
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
  }
  setSelectedTab(tab) {
    this.selectedTab = tab;
  }
  onSelect(categories) {
    this.selectedMaterialCategories = categories;
  }
  onSelectAll(categories) {
    this.selectedMaterialCategories = categories;
  }

  onDeSelectAll(items) {
    this.selectedMaterialCategories = [];
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
