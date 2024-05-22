import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MaterialsService } from "../../../core/services/materials.service";
import { AppService } from "src/app/core/services/app.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-new-category",
  templateUrl: "./new-category.component.html",
  styleUrls: ["./new-category.component.css"],
})
export class NewCategoryComponent implements OnInit {
  public userDetails: any;
  public createForm: FormGroup;
  public disabled = false;
  public chooseFile = false;
  public uploadMessage = "";
  public previousRoute: string = "/materials";
  public currentAddRoute: string;

  constructor(
    private fb: FormBuilder,
    private materialsService: MaterialsService,
    private appService: AppService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.appService.setBackRoute(this.previousRoute);
    this.appService.setShowAddButton = false;

    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

    this.createForm = this.fb.group({
      name: ["", [Validators.required, Validators.maxLength(40)]],
      image: [null, []],
    });
  }

  createCategory() {
    if (this.createForm.valid) {
      const data = this.createForm.value;
      this.disabled = true;

      this.materialsService.createMaterialCategory(data).subscribe((res) => {
        this.disabled = false;

        this.toastr.success(
          this.translate.instant("Successfully created category") + ".",
          this.translate.instant("Success")
        );
        this.router.navigate(["materials"]);
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
}
