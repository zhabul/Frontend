import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MaterialsService } from "src/app/core/services/materials.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AppService } from "src/app/core/services/app.service";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-new-subcategory",
  templateUrl: "./new-subcategory.component.html",
  styleUrls: ["./new-subcategory.component.css"],
})
export class NewSubcategoryComponent implements OnInit {
  public createForm: FormGroup;
  public disabled: boolean;
  public uploadMessage = "";
  public chooseFile = false;
  public userDetails: any;

  public categoryID: number;
  public previousRoute: string;
  public currentAddRoute: string;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private materialService: MaterialsService,
    private router: Router,
    private appService: AppService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

    this.categoryID = this.route.snapshot.params.id;

    this.appService.setShowAddButton = false;
    console.log(this.currentAddRoute);
    this.previousRoute = "/materials/subcategory/" + this.categoryID;
    this.appService.setBackRoute(this.previousRoute);
    this.createForm = this.fb.group({
      name: ["", [Validators.required, Validators.maxLength(40)]],
      ParentID: [this.categoryID, []],
      image: [null, []],
    });
    if (!this.userDetails.create_register_products ) {
      this.router.navigate(["/"]);
    }
  }

  createCategory() {
    if (this.createForm.valid) {
      const data = this.createForm.value;
      this.disabled = true;

      this.materialService.createMaterialSubCategory(data).subscribe((res) => {
        this.disabled = false;

        this.toastr.success(
          this.translate.instant("Successfully created subcategory") + ".",
          this.translate.instant("Success")
        );
        this.router.navigate(["materials/subcategory", this.categoryID]);
      });
    }
  }
  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      this.uploadMessage = event.target.files[0].name;

      reader.onload = () => {
        this.chooseFile = true;
        this.createForm.patchValue({
          image: reader.result,
        });
      };
    }
  }
  goBack() {
    this.router.navigate(["materials/subcategory", this.categoryID]);
  }
}
