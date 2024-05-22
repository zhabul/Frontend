import { Component, OnInit, Input } from "@angular/core";
import { SuppliersService } from "src/app/core/services/suppliers.service";
import { ClientsService } from "src/app/core/services/clients.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ProjectsService } from "src/app/core/services/projects.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "new-category",
  templateUrl: "./new-category.component.html",
  styleUrls: ["./new-category.component.css"],
})
export class NewCategoryComponent implements OnInit {
  public createForm: FormGroup;
  public suppliers: any;
  public clients: any[];
  public InputSupplierClient = true;
  public InputClient = false;
  @Input() projectId: number;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private projectsService: ProjectsService,
    private suppliersService: SuppliersService,
    private clientsService: ClientsService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
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
    const parentId = this.projectsService.currentParentId;
    if (this.createForm.valid) {
      this.projectsService
        .createRegisterCategory(
          this.projectId,
          this.createForm.value.Name,
          this.createForm.value.supplier,
          this.createForm.value.client,
          parentId
        )
        .then((response) => {
          if (response["status"]) {
            const sup = this.suppliers.find(
              (x) => x["Id"] == this.createForm.value.supplier
            );
            const cli = this.clients.find(
              (x) => x["Id"] == this.createForm.value.client
            );
            const data = {
              Id: response["data"]["categoryId"],
              Name: this.createForm.value.Name,
              CompanyName: sup ? sup.Name : cli.Name,
              Type: sup ? "2" : "1",
              childs: [],
              company: [],
              parent: "0",
              workers: [],
            };
            this.clientsService.onNewCategory.next(data);
            this.clientsService.setComponentVisibility(0);

            this.toastr.success(
              this.translate.instant("You have successfully created Register!"),
              this.translate.instant("Success")
            );
          } else {
            this.toastr.error(
              this.translate.instant(
                "There was an error with your submission!"
              ),
              this.translate.instant("Error")
            );
          }
        })
        .catch((err) => {
          this.toastr.error(
            this.translate.instant("There was an error with your submission!"),
            this.translate.instant("Error")
          );
          return { status: false };
        });
    } else {
      this.toastr.error(
        this.translate.instant("There was an error with your submission!"),
        this.translate.instant("Error")
      );
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
