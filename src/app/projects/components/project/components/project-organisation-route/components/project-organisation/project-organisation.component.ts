import { Component, OnInit, Input } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import { ActivatedRoute } from "@angular/router";
import { ProjectsService } from "src/app/core/services/projects.service";
import {
  transition,
  trigger,
  style,
  state,
  animate,
} from "@angular/animations";
import { ClientsService } from "src/app/core/services/clients.service";
import { FormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { SuppliersService } from "src/app/core/services/suppliers.service";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { AppService } from "src/app/core/services/app.service";
import { TranslateService } from "@ngx-translate/core";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";

@Component({
  selector: "project-organisation",
  templateUrl: "./project-organisation.component.html",
  styleUrls: ["./project-organisation.component.css"],
  animations: [
    trigger("rowExpandAnim", [
      state("hide", style({ height: "0px" })),
      state("show", style({ height: "*" })),

      transition("hide <=> show", animate(500)),
    ]),
    trigger("myfirstanimation", [
      state("small", style({ transform: "translateY(-39px)" })),
      state("large", style({ transform: "translateY(0px)" })),

      transition("small <=> large", animate("200ms ease-in")),
    ]),

    trigger("mysecondanimation", [
      state("small", style({ opacity: "0" })),
      state("large", style({ opacity: "1" })),

      transition("small <=> large", animate("200ms ease-in")),
    ]),
  ],
})
export class ProjectOrganisationComponent implements OnInit {
  @Input() project: any;

  public statuses: any[];
  public registers: any = [];
  public setedIndex = "";
  public suppliers: any;
  public clients: any[];
  public createForm: FormGroup;
  public users: any[] = [];
  public selectedContact: any;
  public chosenRole = 2;
  public roleSet = [];
  public roles: any[] = [];
  public supplierWorkers: any[];
  public loadComponent: boolean;
  public previousRoute: string;
  public currentAddRoute: string;
  userDetails: any;
  public language;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private clientsService: ClientsService,
    private toastr: ToastrService,
    private suppliersService: SuppliersService,
    private appService: AppService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.language = sessionStorage.getItem("lang");
    this.translate.use(this.language);

    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

    this.project = this.route.snapshot.data["project"];

    this.currentAddRoute =
      "/projects/view/project-org/" + this.project.id + "/project-organisation";
    this.appService.setAddRoute(this.currentAddRoute);
    this.appService.setShowAddButton =
      true && this.userDetails.create_project_Global;

    this.previousRoute =
      "/projects/view/project-org/" + this.project.id + "/preview";
    this.appService.setBackRoute(this.previousRoute);

    this.roles = this.route.snapshot.data["roles"];
    this.supplierWorkers = this.route.snapshot.data["supplierWorkers"];
    this.clients = this.route.snapshot.data["clients"]["data"];
    this.suppliers = this.route.snapshot.data["suppliers"];
    this.registers = this.route.snapshot.data["registers"];
    console.log(this.registers);
    this.registers.forEach((item) => {
      item["showAddCompany"] = false;
      item["anim_state"] = "hide";
      item["new_anim_state"] = "small";

      item["company"].map((x) => {
        x["anim_state"] = "hide";
        x["new_anim_state"] = "small";
      });
    });
  }

  animateMe(customer) {
    customer["new_anim_state"] =
      customer["new_anim_state"] === "small" ? "large" : "small";
  }

  openComponentDetail1(register, index) {
    if (register["anim_state"] == "show") {
      register["anim_state"] = "hide";
    } else {
      this.projectsService.getRegisterCategoryItems(register.Id).then((res) => {
        register["items"] = res;
        register["anim_state"] = "show";
      });
    }
  }

  addOneWorker(index, cusIndex, firstName, lastName, role) {
    const employee = {
      categoryId: this.registers[index].Id,
      companyId: this.registers[index].company[cusIndex].Id,
      firstName,
      lastName,
      role,
    };

    this.projectsService.createCompanyEmployee(employee).then((res) => {
      if (res["status"]) {
        this.registers[index].company[cusIndex]["new_anim_state"] = "small";
        this.registers[index].company[cusIndex].Employes.push({
          Id: res["data"]["companyId"],
          LastName: lastName,
          FirstName: firstName,
          Role: this.roles.find((x) => x.id == role).roles,
        });
      }
    });
  }

  removeReg(registerId, index) {
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
          this.projectsService
            .removeRegisterCategory(registerId)
            .then((response) => {
              this.registers.splice(index, 1);
            });
        }
      });
  }

  deleteWorker(index, customerIndex, index3) {
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
          this.projectsService
            .removeRegisterCategoryItems(
              this.registers[index].company[customerIndex].Employes[index3][
                "Id"
              ]
            )
            .then((response) => {
              if (response["status"]) {
                this.registers[index].company[customerIndex].Employes.splice(
                  index3,
                  1
                );
                this.toastr.success(
                  "You have successfully deleted the worker.",
                  "Worker deleted!"
                );
              }
            });
        } else {
          this.toastr.warning(
            this.translate.instant("You have canceled the delete operation."),
            this.translate.instant("Worker not deleted!")
          );
        }
      });
  }

  deleteCompany(categoryIndex, companyIndex) {
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
          this.projectsService
            .removeCompany(
              this.registers[categoryIndex].company[companyIndex].Id
            )
            .then((res) => {
              if (res["status"]) {
                this.registers[categoryIndex].company.splice(companyIndex, 1);
                this.toastr.success(
                  "You have successfully deleted the company.",
                  "Company deleted!"
                );
              }
            });
        } else {
          this.toastr.warning(
            "You have canceled the delete operation.",
            "Company not deleted!"
          );
        }
      });
  }

  deleteClientWorker(index, index2) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe(async (response) => {
        if (response.result) {
          this.projectsService
            .removeClientWorkerFromCategory(
              this.registers[index]["workers"][index2]["Id"]
            )
            .then((response) => {
              if (response["status"]) {
                this.registers[index]["workers"].splice(index2, 1);
                this.toastr.success(
                  "You have successfully deleted the worker.",
                  "Worker deleted!"
                );
              }
            });
        } else {
          this.toastr.warning(
            "You have canceled the delete operation.",
            "Worker not deleted!"
          );
        }
      });
  }

  onContactChange(e, i) {
    this.roles = e.target.options[e.target.selectedIndex].value;
  }

  setContactPersons(supplier_id) {
    let supplier = supplier_id.value;
    this.suppliersService.getSupplierWorkers(supplier).subscribe((response) => {
      if (response["status"]) {
        this.supplierWorkers = response["data"] || [];
      } else {
        this.supplierWorkers = [];
      }
    });
  }

  loadMyChildComponent(e) {
    scroll(0, 0);
    this.clientsService.setComponentVisibility(1);
  }

  openComponentDetail(e) {
    e.preventDefault();
    scroll(0, 0);
    this.clientsService.setComponentVisibility(1);
  }

  openWorkerDetail(e) {
    e.preventDefault();
    scroll(0, 0);
    this.clientsService.client.next(this.createForm.value.client_id);
    this.clientsService.setComponentVisibility(2);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.suppliers, event.previousIndex, event.currentIndex);
  }

  openComponent(e, categoryId) {
    console.log("test");
    e.preventDefault();
    scroll(0, 0);
    this.clientsService.setComponentVisibility(4);
    this.clientsService.currentCategoryId.next(categoryId);
  }

  toggleAddCompany(i) {
    this.registers[i].showAddCompany = !this.registers[i].showAddCompany;
  }

  createCompany(i, companyName) {
    this.projectsService
      .createCompany({ id: this.registers[i].Id, name: companyName })
      .then((res) => {
        this.registers[i]["company"].push({
          Name: companyName,
          Id: res["data"]["companyId"],
          anim_state: "hide",
          new_anim_state: "small",
          Employes: [],
        });
      });

    this.registers[i].showAddCompany = false;
  }

  loadSubCategoryComponent() {
    scroll(0, 0);
    this.clientsService.setComponentVisibility(5);
  }

  openSubComponentDetail(register, index) {
    if (register["anim_state"] == "show") {
      register["anim_state"] = "hide";
    } else {
      this.projectsService.getRegisterCategoryItems(register.Id).then((res) => {
        register["items"] = res;
        register["anim_state"] = "show";
      });
    }
  }

  openSubComponent(e, categoryId) {
    console.log("test subcategory");
    e.preventDefault();
    scroll(0, 0);
    this.clientsService.setComponentVisibility(4);
    this.clientsService.currentCategoryId.next(categoryId);
  }
}
