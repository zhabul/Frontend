import { Component, OnInit } from "@angular/core";
import { SuppliersService } from "src/app/core/services/suppliers.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-select-supplier",
  templateUrl: "./select-supplier.component.html",
  styleUrls: ["./select-supplier.component.css"],
})
export class SelectSupplierComponent implements OnInit {
  private project: any;
  public suppliersCategores: any[];
  public selectedCategory;
  public selectdSupplier;
  public suppliers = [];
  public materialSuppliers = [];
  public spinner = false;
  public userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  public showAddForm = false;

  constructor(
    private suppliersService: SuppliersService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.project = this.route.parent.snapshot.data["project"];
    this.suppliersCategores =
      this.route.snapshot.data["supplierCategores"]["data"];
    this.materialSuppliers = this.route.snapshot.data["materialSuppliers"];
    this.selectedCategory = this.suppliersCategores[0].Id;

    this.onCateogryChange();
  }

  onCateogryChange() {
    this.suppliersService
      .getSuppliersByCateogryId(this.selectedCategory)
      .subscribe((suppliers: any) => {
        this.suppliers = suppliers;
        if(this.suppliers && this.suppliers.length > 0) {
          this.selectdSupplier = this.suppliers[0].Id;
        }
      });
  }

  onAddClick() {
    this.spinner = true;
    const alreadyAdded = this.materialSuppliers.some(
      (matSup) =>
        matSup.categoryId == this.selectedCategory &&
        matSup.supplierId == this.selectdSupplier
    );

    if (alreadyAdded) {
      this.toastr.info(
        this.translate.instant(
          "You already added that material category and supplier."
        ),
        this.translate.instant("Info")
      );
      this.spinner = false;
      return;
    }

    this.suppliersService
      .addProjectMaterialSupplier(
        this.project.id,
        this.selectedCategory,
        this.selectdSupplier
      )
      .subscribe((response) => {
        if (response["status"]) {
          const categoryName = this.suppliersCategores.find(
            (x) => x.Id == this.selectedCategory
          ).name;
          const supplierName = this.suppliers.find(
            (x) => x.Id == this.selectdSupplier
          ).Name;

          this.materialSuppliers.push({
            Id: response["data"]["Id"],
            categoryId: this.selectedCategory,
            supplierId: this.selectdSupplier,
            categoryName,
            supplierName,
          });

          this.showAddForm = false;
          this.spinner = false;
        } else {
          this.spinner = false;
        }
      });
  }

  onRemoveClick(id, i) {
    if (this.showAddForm) return;

    this.spinner = true;

    this.suppliersService.deleteProjectMaterialSupplier(id).subscribe((response) => {
      if (response["status"]) {
        this.materialSuppliers.splice(i, 1);
      }
      this.spinner = false;
    });
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }
}
