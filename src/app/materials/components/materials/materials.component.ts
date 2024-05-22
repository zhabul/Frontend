import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Sortable } from "@shopify/draggable";
import { MaterialsService } from "src/app/core/services/materials.service";
import { ToastrService } from "ngx-toastr";
import { AppService } from "src/app/core/services/app.service";
import { TranslateService } from "@ngx-translate/core";
import { InitProvider } from "src/app/initProvider";

@Component({
  selector: "app-materials",
  templateUrl: "./materials.component.html",
  styleUrls: ["./materials.component.css"],
})
export class MaterialsComponent implements OnInit {
  public userDetails: any;
  public materials: any[];
  public hasSorted = false;

  public currentAddRoute: string = "/materials/new";
  public previousRoute: string = "/home";
  public orderAccess = true;

  constructor(
    private route: ActivatedRoute,
    private materialsService: MaterialsService,
    private toastr: ToastrService,
    private appService: AppService,
    private router: Router,
    private translate: TranslateService,
    public initProvider: InitProvider
  ) {}

  ngOnInit() {

    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

    this.appService.setAddRoute(this.currentAddRoute);
    this.appService.setShowAddButton =
      true && this.userDetails.create_register_products;
    this.appService.setBackRoute(this.previousRoute);

    this.materials = this.route.snapshot.data["materials"];
    this.materials.forEach((mat) => {
      mat.show = false;
    });

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

    //this.orderAccess = this.userDetails.show_project_Order && this.initProvider.hasComponentAccess('orders');
    this.redirectIfHasNoAccess();
    
  }

  redirectIfHasNoAccess() {
    if (/*!this.orderAccess*/ !this.userDetails.show_register_products ) {
      this.router.navigate(["/"]);
    }
  }

  async saveSort() {
    const res: any = await this.materialsService.saveCategorySort(
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
        .updateCategoryQuick({
          id: this.materials[i].id,
          name,
          image: result,
          oldImage: this.materials[i].image,
        })
        .subscribe((res) => {
          this.toastr.success(
            this.translate.instant("Successfully edited category") + ".",
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
        this.translate.instant("Category name is required") + ".",
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

    this.router.navigate(["materials/subcategory", id]);
  }
}
