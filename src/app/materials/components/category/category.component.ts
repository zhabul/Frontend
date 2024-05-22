import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MaterialsService } from "../../../core/services/materials.service";
// import { Location } from "@angular/common";
import { Sortable } from "@shopify/draggable";
import { ToastrService } from "ngx-toastr";
import { AppService } from "src/app/core/services/app.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.css"],
})
export class CategoryComponent implements OnInit {
  public userDetails: any;
  public materials: any[];
  public hasSorted = false;
  public subCategoryId: number;
  public categoryName: string;
  public canRemove: boolean;
  public categoryID: number;

  public currentAddRoute: string;
  public previousRoute: string;

  constructor(
    private route: ActivatedRoute,
    private materialService: MaterialsService,
    private router: Router,
    // private location: Location,
    private materialsService: MaterialsService,
    private toastr: ToastrService,
    private appService: AppService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.subCategoryId = this.route.snapshot.params.category_id;

    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

    this.materials = this.route.snapshot.data["materials"]["items"];
    this.materials.forEach((mat) => {
      mat.show = false;
    });

    this.currentAddRoute = "/materials/new/" + this.subCategoryId;
    this.appService.setAddRoute(this.currentAddRoute);
    this.appService.setShowAddButton =
      true && this.userDetails.create_register_products;

    this.previousRoute =
      "/materials/subcategory/" + this.route.snapshot.data.materials.parentID;

    this.appService.setBackRoute(this.previousRoute);

    this.categoryName = this.route.snapshot.data["materials"]["name"];
    this.canRemove = this.materials.length === 0;

    const sortable = new Sortable(document.querySelectorAll(".js-grid"), {
      draggable: ".js-item",
      delay: 180,
      mirror: {
        constrainDimensions: true,
      },
    });

    sortable.on("sortable:stop", (e) => {
      this.hasSorted = true;

      const temp = this.materials[e.oldIndex];
      this.materials[e.oldIndex] = this.materials[e.newIndex];
      this.materials[e.newIndex] = temp;
    });
    if (!this.userDetails.show_register_products ) {
      this.router.navigate(["/"]);
    }
  }

  async saveSort() {
    const res: any = await this.materialsService.saveMaterialSort(
      this.materials
    );

    if (res["status"]) {
      if (window.sessionStorage.getItem("lang").toLowerCase() === "en") {
        this.toastr.success("Successfully sorted.", "Success");
      } else if (window.sessionStorage.getItem("lang").toLowerCase() === "sw") {
        this.toastr.success("Framgångsrikt sorterat.", "Framgång");
      }
    } else {
      if (window.sessionStorage.getItem("lang").toLowerCase() === "en") {
        this.toastr.error("There was an error while trying to sort.", "Error");
      } else if (window.sessionStorage.getItem("lang").toLowerCase() === "sw") {
        this.toastr.error(
          "Det uppstod ett fel när du försökte sortera.",
          "Fel"
        );
      }
    }
  }

  removeSubCategory(e) {
    this.materialService
      .removeMaterialCategory(this.subCategoryId)
      .subscribe((res) => {
        this.toastr.success(
          this.translate.instant("Successfully deleted subcategory") + ".",
          this.translate.instant("Success")
        );
        this.router.navigate([
          "materials/subcategory",
          this.route.snapshot.data.materials.parentID,
        ]);
      });
    e.stopPropagation();
  }

  goBack() {
    this.router.navigate([
      "materials/subcategory",
      this.route.snapshot.data.materials.parentID,
    ]);
  }

  showEdit(i) {
    this.materials[i].show = true;
  }

  hideEdit(i) {
    this.materials[i].show = false;
  }

  async editMaterial(i, name, picture) {
    if (name && name.trim().length !== 0) {
      const reader = new FileReader();
      const [file] = picture.files;

      let result: any = "";

      if (file) {
        result = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      }

      this.materialsService
        .updateMaterialQuick({
          id: this.materials[i].id,
          name,
          image: result,
          oldImage: this.materials[i].image,
        })
        .subscribe((res) => {
          this.toastr.success(
            this.translate.instant("Successfully edited material") + ".",
            this.translate.instant("Success")
          );
          this.materials[i].show = false;
          this.materials[i].name = res["name"];
          if (res["image"]) {
            this.materials[i].image = res["image"];
          }
        });
    } else {
      this.toastr.error(
        this.translate.instant("Material name is required") + ".",
        this.translate.instant("Error")
      );
    }
  }

  goTo(id, e) {
    if (e) {
      if (e.target.dataset.id === "noNavigate") {
        return;
      }
    }

    this.router.navigate(["materials/edit", id]);
  }
}
