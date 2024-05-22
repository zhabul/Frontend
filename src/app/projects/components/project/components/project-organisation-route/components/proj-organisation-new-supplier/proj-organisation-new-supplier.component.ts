import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { SuppliersService } from "src/app/core/services/suppliers.service";
import { NewContactOrganisationModalComponent } from "../new-contact-organisation-modal/new-contact-organisation-modal.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";

@Component({
  selector: "proj-organisation-new-supplier",
  templateUrl: "./proj-organisation-new-supplier.component.html",
  styleUrls: ["./proj-organisation-new-supplier.component.css"],
})
export class ProjOrganisationNewSupplierComponent implements OnInit {
  public createForm: FormGroup;
  boldOrNot: any;
  supplierFormOrderEmail: string = "";
  validatorCSS = false;
  categories: any;
  contacts = [];
  public language;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private suppliersService: SuppliersService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.language = sessionStorage.getItem("lang");
    this.translate.use(this.language);

    this.createForm = this.fb.group({
      Orgnr: [""],
      Name: [""],
      Lastname: [""],
      Number: [""],
      Email: ["", [Validators.required, Validators.email]],
      VisitingAddress: [""],
      VisitingAddressPostnr: [""],
      VisitingAddressCity: [""],
      VisitingAddressLand: [""],
      InvoiceAddressStreetAndNo: [""],
      InvoiceAddressPostnr: [""],
      InvoiceAddressCity: [""],
      InvoiceAddressLand: [""],
      Number2: [""],
      WebAddress: [""],
      BankGiro: [""],
      PlusGiro: [""],
      Active: ["1"],
      CompanyEmail: ["", []],
      Category: [1],
    });

    this.categories = this.route.snapshot.data["categories"];
    console.log(this.categories);
  }

  createSupplier() {
    if (
      this.createForm
        .get("Email")
        .value.toString()
        .match(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      const data = this.createForm.value;

      this.suppliersService.addNewSupplier(data).subscribe(async (res) => {
        const createdSupplierId = res["data"]["supplier_id"];
        this.contacts.forEach((s) => {
          s.SuplierID = createdSupplierId;
          s.TitleID = 2;
          s.Address = "placeholder address <FIX>";
          this.suppliersService.addOneWorker(s);
        });
      });

      this.router.navigate(["/suppliers"]);
    } else {
      window.scroll(0, 0);
    }
  }

  deleteWorker(index) {
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
          this.contacts.splice(index, 1);
        }
      });
  }

  openModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    dialogConfig.data = { contacts: this.contacts };
    this.dialog
      .open(NewContactOrganisationModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => {});
  }
}
