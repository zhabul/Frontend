import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppService } from "src/app/core/services/app.service";
import { ClientsService } from "src/app/core/services/clients.service";
import { ProjectsService } from "src/app/core/services/projects.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";

@Component({
  selector: "proj-organisation-preview",
  templateUrl: "proj-organisation-preview.component.html",
  styleUrls: ["proj-organisation-preview.component.css"],
})
export class ProjOrganisationPreviewComponent implements OnInit {
  public project;
  public registers;
  public clients: any[];
  public suppliers: any[];
  public previousRoute: string;
  public currentAddRoute: string;
  public language;
  public userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

  constructor(
    private route: ActivatedRoute,
    private appService: AppService,
    private dialog: MatDialog,
    private clientsService: ClientsService,
    private projectsService: ProjectsService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.language = sessionStorage.getItem("lang");
    this.translate.use(this.language);
    this.registers = this.route.snapshot.data["registers"];
    this.clients = this.registers.filter((reg) => reg.Type == "1");
    this.suppliers = this.registers.filter((reg) => reg.Type == "2");
    this.project = this.route.snapshot.data["project"];
    this.appService.setShowAddButton = false;
    this.previousRoute = "/projects/view/" + this.project.id;
    this.appService.setBackRoute(this.previousRoute);

    this.clientsService.onNewCategory.subscribe((category) => {
      if (category != undefined) {
        if (category.Type == "1") {
          this.clients.push(category);
        } else {
          this.suppliers.push(category);
        }
      }
    });

    this.clientsService.clientWorker.subscribe((newWorker) => {
      if (newWorker == undefined) return;
      if (newWorker.type == 1) {
        const clinet = this.clients.find((x) => x.Id == newWorker.categoryId);
        clinet.workers.push(newWorker.worker);
      } else {
        const supp = this.suppliers.find((x) => x.Id == newWorker.categoryId);
        supp.workers.push(newWorker.worker);
      }
    });
  }

  loadMyChildComponent(e, parentId) {
    scroll(0, 0);
    this.clientsService.setComponentVisibility(1);
    this.projectsService.currentParentId = parentId;
  }

  openComponent(e, categoryId, type) {
    e.preventDefault();
    scroll(0, 0);
    this.clientsService.setComponentVisibility(4);
    this.clientsService.currentCategoryId.next({ categoryId, type });
  }

  openCompanyComponent(e, categoryId) {
    e.preventDefault();
    scroll(0, 0);
    this.clientsService.setComponentVisibility(6);
    this.clientsService.currentCategoryId.next(categoryId);
  }

  openEmployeeComponent(e, categoryId) {
    e.preventDefault();
    scroll(0, 0);
    this.clientsService.setComponentVisibility(7);
    this.clientsService.currentCategoryId.next(categoryId);
  }

  deleteSupplierWorker(index, index2) {
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
              this.suppliers[index]["workers"][index2]["Id"]
            )
            .then((response) => {
              if (response["status"]) {
                this.suppliers[index]["workers"].splice(index2, 1);
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
              this.clients[index]["workers"][index2]["Id"]
            )
            .then((response) => {
              if (response["status"]) {
                this.clients[index]["workers"].splice(index2, 1);
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

  deleteWorker(index, customerIndex, index3) {
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
            "You have canceled the delete operation.",
            "Worker not deleted!"
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

  printPage() {
    const printContent = document.getElementById("print-section");
    const WindowPrt = window.open(
      "",
      "",
      "left=0,top=0,width=" +
        screen.width +
        ",height=" +
        screen.height +
        ",toolbar=0,scrollbars=0,status=0"
    );
    WindowPrt.document.write(
      `<style>*{font-family: Arial, sans-serif;}h4{color:#4472C4;}.tree{font-size:19px}.tree a,.tree span{color:#fff;text-decoration:none}.tree li{list-style-type:none;margin:0;padding:10px 5px 0 5px;position:relative}.tree li::after,.tree li::before{content:'';left:-20px;position:absolute;right:auto}.tree li::before{border-left:2px solid #ed7d31;bottom:50px;height:100%;top:0;width:1px}.tree li::after{border-top:2px solid #ed7d31;height:20px;top:25px;width:25px}.tree li span{background-color:#000;-moz-border-radius:5px;-webkit-border-radius:5px;border-radius:3px;display:inline-block;padding:3px 8px;text-decoration:none;cursor:pointer}.tree>ul>li::after,.tree>ul>li::before{border:0}.tree li:last-child::before{height:27px}[aria-expanded=false]>.expanded,[aria-expanded=true]>.collapsed{display:none}.add-worker-parent{position:relative}.add-worker{cursor:pointer;display:none;padding:3px 8px!important;border-radius:3px!important;color:#fff!important;background-color:#446077!important}.add-worker-parent:hover+.add-worker,.add-worker:hover{display:inline-block}.tree ul,.tree ul li:last-of-type{margin-bottom:0!important}.fa-trash{padding:9px 9px 6px 9px!important}</style>` +
        printContent.innerHTML
    );
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }

  removeReg(registerId) {
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
          this.projectsService.removeRegisterCategory(registerId).then((id) => {
            const index = this.registers.findIndex((reg) => reg.Id == id);
            this.registers.splice(index, 1);
            this.clients = this.registers.filter((reg) => reg.Type == "1");
            this.suppliers = this.registers.filter((reg) => reg.Type == "2");
          });
        }
      });
  }
}
