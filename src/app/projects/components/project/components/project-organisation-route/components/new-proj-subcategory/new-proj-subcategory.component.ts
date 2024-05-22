import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ProjectsService } from "src/app/core/services/projects.service";
import { SuppliersService } from "src/app/core/services/suppliers.service";
import { ClientsService } from "src/app/core/services/clients.service";

@Component({
  selector: "new-proj-subcategory",
  templateUrl: "./new-proj-subcategory.component.html",
  styleUrls: ["./new-proj-subcategory.component.css"],
})
export class NewProjSubcategoryComponent implements OnInit {
  public createForm: FormGroup;
  public suppliers: any;
  public categoryId;
  public clients: any[];
  @Input() parent_id: number;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private projectsService: ProjectsService,
    private suppliersService: SuppliersService,
    private clientsService: ClientsService
  ) {}

  ngOnInit() {
    this.clientsService.currentCategoryId.subscribe((categoryId) => {
      this.categoryId = categoryId;
    });

    this.suppliersService.getSuppliers().subscribe((response) => {
      this.suppliers = response["data"];
    });

    this.clientsService.getClients().subscribe((response) => {
      this.clients = response["data"];
    });

    this.createForm = this.fb.group({
      Name: [""],
      supplier: ["0"],
      client: ["0"],
    });
  }

  createDirectory() {
    console.log(this.createForm.value);
    if (this.createForm.valid) {
      console.log("this.parent_id");
      console.log(this.parent_id);
      this.projectsService
        .createSubRegisterCategory(
          this.categoryId,
          this.parent_id,
          this.createForm.value.Name,
          this.createForm.value.supplier,
          this.createForm.value.client
        )
        .then((response) => {
          if (response["status"]) {
            const sup = this.suppliers.find(
              (x) => x["Id"] == this.createForm.value.supplier
            );
            const data = {
              Id: response["data"]["categoryId"],
              Name: this.createForm.value.Name,
              CompanyName: sup.Name,
            };
            this.clientsService.getCategory.next(data);
            this.clientsService.setComponentVisibility(0);

            this.toastr.success(
              "You have successfully created Register!",
              "Register !"
            );
          } else {
            this.toastr.error(
              "There was an error with your submission!",
              "Error1"
            );
          }
        })
        .catch((err) => {
          this.toastr.error(
            "There was an error with your submission!",
            "Error2"
          );
          return { status: false };
        });
    } else {
      this.toastr.error("There was an error with your submission!", "Error3");
    }
  }

  setContactPersons(e) {}

  openComponentDetail(e) {
    e.preventDefault();
    scroll(0, 0);
    this.clientsService.setComponentVisibility(2);
  }
  openSupplier(e) {
    e.preventDefault();
    scroll(0, 0);
    this.clientsService.setComponentVisibility(3);
  }
}
