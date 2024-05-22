import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ClientsService } from "src/app/core/services/clients.service";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { Location } from "@angular/common";
import { AppService } from "src/app/core/services/app.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { TabService } from "src/app/shared/directives/tab/tab.service";

@Component({
  selector: "app-new-client",
  templateUrl: "./new-client.component.html",
  providers: [TabService],
  styleUrls: ["./new-client.component.css"],
})
export class NewClientComponent implements OnInit {
  @ViewChild("myform", { static: true }) myform!: NgForm;
  public createForm: FormGroup;
  public userDetails: any;

  public client: any;
  public chosenType: any = 1;
  public chosenStatus: any = 1;
  public boldOrNot: any;
  public actionStatus: number = 0;
  public previousRoute: string;
  public clientCategories: any;
  public selectedCategoryId: any;
  public editOrCreate: string;
  public showClientCategoryInput = false;
  public clientsUsingCategory = null;
  public showModal = false;
  public spinner = false;
  @ViewChild("newCategory") newCategory: ElementRef;

  public selectedTab = 0;
  public showCommentsNumber = true;
  public selectedClientCategories: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private clientsService: ClientsService,
    private location: Location,
    private appService: AppService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.clientCategories =
      this.route.snapshot.data["clientCategories"]["data"] || [];
    this.selectedCategoryId = "0";
    this.previousRoute = "/clients";
    this.appService.setBackRoute(this.previousRoute);
    this.appService.setShowAddButton = false;



    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

    this.createForm = this.fb.group({
      name: [""],
      number: ["", [Validators.required]],
      company: [
        "",
        [Validators.required, /*Validators.pattern("^[-a-zA-Z0-9& ]*$")*/],
      ],
      web_address: [""],
      company_id: ["", [Validators.required]],
      status: ["1"],
      type: ["1"],
      reversePaymentObligation: ["1"],
      visiting_address_street_and_no: [""],
      visiting_address_postnr: [""],
      visiting_address_city: [""],
      visiting_address_land: [""],
      invoice_address_street_and_no: [""],
      invoice_address_postnr: [""],
      invoice_address_city: [""],
      invoice_address_land: [""],
      reference_ours: [""],
      reference_theirs: [""],
      mobile_number: [""],
      telephone_number: [""],
      email: ["", [Validators.email/*, Validators.required*/]],
      companyEmail: ["", [Validators.email,]],
      clientEmail: ["", [Validators.email]],
      vatNumber: ["", [Validators.required]],
      bedomning: [""],
      /*  clientCategoryId: ["", [Validators.required]] */
       clientCategoryId:  [""],

    });
  }

  createClient() {
    const data = this.createForm.value;
    data.clientCategoryId = this.selectedCategoryId;

    if (this.createForm.invalid) {
      setTimeout(() => {
        document.querySelector(".is-invalid").scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }, 1);
      return;
    }

    this.spinner = true;

    this.clientsService.addNewClient(data).subscribe((res) => {
      if (res["status"]) {
        this.toastr.success(
          this.translate.instant("Successfully created client."),
          this.translate.instant("Success")
        );
        this.router.navigate(["/clients"]);
      }

      this.spinner = false;
    });
  }

  onStatusChange(status) {
    this.createForm.value.status = status;
  }

  onTypeChange(type) {
    this.createForm.value.type = type;
  }

  goBack() {
    this.location.back();
  }

  copyVisitingAddress() {
    this.actionStatus = 1;

    this.createForm.patchValue({
      invoice_address_street_and_no: this.createForm.get(
        "visiting_address_street_and_no"
      ).value,
      invoice_address_postnr: this.createForm.get("visiting_address_postnr")
        .value,
      invoice_address_city: this.createForm.get("visiting_address_city").value,
      invoice_address_land: this.createForm.get("visiting_address_land").value,
    });

    setTimeout(() => {
      this.actionStatus = 0;
    }, 3000);
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
    newCategory.value =
      this.clientCategories[
        this.clientCategories.findIndex(
          (cat) => cat.Id == categorySelected.value
        )
      ].name;
    this.cd.detectChanges();
    this.newCategory.nativeElement.focus();
  }

  addOrEditClientCategory(categorySelected, newCategoryValue) {
    if (newCategoryValue.trim() === "") {
      this.toastr.error(
        this.translate.instant(`TSC_CATEGORY_NAME_CANT_BE_EMPTY`),
        this.translate.instant("Error")
      );
      return;
    }

    if (this.editOrCreate === "add") {
      this.clientsService
        .addClientCategory(newCategoryValue.trim())
        .subscribe((res) => {
          if (res["status"] == -1) {
            this.toastr.error(
              this.translate.instant("TSC_CATEGORY_ALREADY_EXISTS"),
              this.translate.instant("Error")
            );
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
            this.toastr.error(
              this.translate.instant("TSC_CATEGORY_ALREADY_EXISTS"),
              this.translate.instant("Error")
            );
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
    } else {
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

  closeModal(e) {
    if (e) {
      if (e.target.id !== "looksLikeModal") {
        return;
      }
    }
    this.showModal = false;
    this.clientsUsingCategory = null;
  }

  displayError(input: string) {
    // const control = this.createForm.get(input);

    // return (
    //   (this.myform.submitted && control.invalid) ||
    //   (control.dirty && control.invalid)
    // );
  }

  displayErrorObj(input: string, type: string) {
    const control = this.createForm.get(input);
    let err = false;

    if (control.errors) {
      if (type === "required") {
        err = control.errors.required;
      }

      if (type === "pattern") {
        err = control.errors.pattern;
      }

      if (type === "email") {
        err = control.errors.email;
      }
    }

    return err;
  }

  formtMobileNumber(mobile_number, name) {
    this.clientsService.formatMobileNumber({'mobile_number': mobile_number}).subscribe((res:any) => {
      if(res.status) {
       if(name == 'mobile') this.createForm.get('mobile_number').patchValue(res['result']);
       if(name == 'telephone') this.createForm.get('telephone_number').patchValue(res['result']);
      }
    });
  }

  setSelectedTab(tab) {
    this.selectedTab = tab;
  }

  onSelect(categories) {
    this.selectedCategoryId = categories[0].Id;
  }
  onSelectAll(categories) {
    this.selectedClientCategories = categories;
  }

  onDeSelectAll(items) {
    this.selectedClientCategories = [];
  }
}
