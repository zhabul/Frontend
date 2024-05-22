import { Component, OnInit, AfterViewInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { ProjectsService } from "src/app/core/services/projects.service";
import { AtaService } from "src/app/core/services/ata.service";
import { InvoicesService } from "src/app/core/services/invoices.service";
import { DomSanitizer } from "@angular/platform-browser";
import { BASE_URL } from "src/app/config";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
declare var $;

@Component({
  selector: "app-edit-supplier-invoice",
  templateUrl: "./edit-supplier-invoice.component.html",
  styleUrls: ["./edit-supplier-invoice.component.css"],
})
export class EditSupplierInvoiceComponent implements OnInit, AfterViewInit {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private toastr: ToastrService,
    private projectsService: ProjectsService,
    private dialog: MatDialog,
    private ataService: AtaService,
    private invoicesService: InvoicesService,
    public sanitizer: DomSanitizer
  ) {}

  public createForm: FormGroup;
  public project: any;
  public supplierInvoice: any;
  public statuses: any[] = [];
  public projectId: any;
  public language = "en";
  public week = "Week";
  public documents: any[] = [];
  public showPdfPreview = false;
  public whichPdfPreview;
  public invoiceId;
  public documentToShow = 0;
  public sumTotal = 0;
  public selectionOptions = [];
  public selectedOptions = [];
  public invoiceRows = [];
  public userDetails: any = JSON.parse(sessionStorage.getItem("userDetails"));;
  public mainRow;
  public ata;
  public newRow = {
    id: "",
    Account: "",
    AccountDescription: "",
    TransactionInformation: "",
    Debit: "",
    Credit: "",
    Project: "",
    SupplierInvoiceId: "",
    Price: "",
    Price2: "",
    Deduct: 0,
    Total: "",
    CanEdit: "",
  };
  public selectedTab: any = 0;
  public accounting_plans: any[] = [];
  public supplier_row_id: number = 0;
  public projects: any[] = [];
  public project_keys: any[] = [];
  public activeKey;
  public project_ids: any[] = [];
  public allowUpdateInvoice: boolean = false;
  public masterPDV: any = 0;
  public type: any = "0";
  public openedFrom: any = "Project";
  public enabled_account_numbers: any[] = [];
  public pdf_image: any = "";
  swiper = {
    images: [],
    active: -1,
    album: -2,
    directory: null,
  };
  characterCount: number = 0;

  ngOnInit() {
    if (!this.userDetails.show_project_SupplierInvoices) {
      this.router.navigate(["home"]);
    }
    this.projectId = this.route.snapshot.params["id"];
    this.selectedTab = this.route.snapshot.params["selected_tab"];
    this.invoiceId = this.route.snapshot.params["invoice_id"];
    this.supplierInvoice =  this.route.snapshot.data["supplierInvoice"]["invoice"];
    this.supplier_row_id = this.route.snapshot.params["sir_id"];
    this.projects = this.route.snapshot.data["projects"];
    this.route.queryParams.subscribe((params) => {
      if (params["type"]) {
        this.type = params["type"];
      }
      if (params["openedFrom"]) {
        this.openedFrom = params["openedFrom"];
      }
    });

    this.getProject(this.projectId);
    this.getSupplierInvoiceStatuses();
    this.accountingPlans();
    this.getEnabledAccounts();

    this.createForm = this.fb.group({
      OrderNR: [this.supplierInvoice.OrderNR, []],
      SupplierName: [this.supplierInvoice.SupplierName, []],
      AtaID: [this.supplierInvoice.AtaID, []],
      InvoiceDate: [this.supplierInvoice.InvoiceDate, []],
      DueDate: [this.supplierInvoice.DueDate, [Validators.required]],
      Status: [this.supplierInvoice.Status, [Validators.required]],
      ProjectID: [this.supplierInvoice.ProjectID, []],
      Ocr: [this.supplierInvoice.Ocr, []],
      InvoiceNumber: [this.supplierInvoice.InvoiceNumber, []],
      Account: [this.supplierInvoice.Account, []],
      interComment: [this.supplierInvoice.comment, []],
    });

    $("#dateSelectStartDate")
      .datepicker({
        format: "yyyy-mm-dd",
        calendarWeeks: true,
        autoclose: true,
        language: this.language,
        currentWeek: true,
        todayHighlight: true,
        currentWeekTransl: this.week,
        currentWeekSplitChar: "-",
        enableOnReadonly: true,
        weekStart: 1
      })
      .on("changeDate", (ev) => {
        this.createForm.get("InvoiceDate").patchValue(ev.target.value);
      });

    $("#dateSelectEndDate")
      .datepicker({
        format: "yyyy-mm-dd",
        calendarWeeks: true,
        autoclose: true,
        language: this.language,
        currentWeek: true,
        todayHighlight: true,
        currentWeekTransl: this.week,
        currentWeekSplitChar: "-",
        enableOnReadonly: true,
        weekStart: 1
      })
      .on("changeDate", (ev) => {
        this.createForm.get("DueDate").patchValue(ev.target.value);
      });

    if (this.createForm.value.InvoiceDate) {
      $("#dateSelectStartDate").datepicker(
        "setDate",
        this.createForm.value.InvoiceDate.split(" ")[0]
      );
    }
    if (this.createForm.value.DueDate) {
      $("#dateSelectEndDate").datepicker(
        "setDate",
        this.createForm.value.DueDate.split(" ")[0]
      );
    }
    this.allowEditSupplierInvoice();
  }

  ngAfterViewInit() {
    this.allowEditSupplierInvoice();
  }

  getEnabledAccounts() {
    this.projectsService.getEnabledAccounts().then((res) => {
      this.enabled_account_numbers = res;
    });
  }

  getProject(project_id) {
    this.projectsService.getProject(project_id).then((res) => {
      this.project = res;
      if (this.supplierInvoice.credit > 0) {
        this.masterPDV = 0;
      } else if (this.supplierInvoice.Deduct != 0) {
        this.masterPDV = this.supplierInvoice.Deduct;
      } else {
        this.masterPDV = this.project.chargeMaterial;
      }
      this.getAllActiveProjects();
      this.getInvoiceDocuments();
      this.getInvoiceRows();
    });
  }

  getInvoiceDocuments() {
    this.projectsService
      .getSupplierInvoicesPdfDocuments(this.invoiceId)
      .then((invoices) => {
        this.documents = invoices["invoiceRows"];
        if (this.documents.length > 0) {
          this.pdf_image = this.documents[0]["Image_path"];
          let pat = BASE_URL + this.documents[0]["Path"];
          this.whichPdfPreview =
            this.sanitizer.bypassSecurityTrustResourceUrl(pat);
        }
      });
  }

  getAllActiveProjects() {
    this.projectsService
      .getAllActiveProjectsAndSubProjects(this.invoiceId)
      .then((res) => {
        this.projects = res;
      });
  }

  getInvoiceRows() {
    this.projectsService
      .getSupplierInvoiceRows(
        this.invoiceId,
        this.projectId,
        this.selectedTab,
        this.supplier_row_id
      )
      .then((rows) => {
        if (rows["status"]) {
          Object.keys(rows["data"]["rows"]).forEach((key) => {
            this.project_keys.push(key);
            rows["data"]["rows"][key].forEach((row) => {
              this.invoiceRows.push(row);
              this.selectionOptions.push({
                id: row["Project"],
                name: row["Project"],
                ata_id: row["Project"],
                Status: "5",
                ata_payment_type: row["ata_payment_type"],
                project_debit_id: row["project_debit_id"],
              });
            });

            let p = this.projects.find((proj) => proj.CustomName == key);
            this.getAtas(p.id, key);
          });
          if (this.selectedTab == 6) {
            this.invoiceRows.forEach((row) => {
              row.Parent = "0";
            });
          }
        }
        this.addRow();
        this.updateTotal();
        this.filterSelectionOptions();
      });
  }

  getSupplierInvoiceStatuses() {
    this.projectsService.getSupplierInvoiceStatuses().then((res) => {
      if (res["status"]) {
        this.statuses = res["statuses"];
      }
    });
  }
  public account_number: any[] = [];
  accountingPlans() {
    this.projectsService.accountingPlans().then((result) => {
      if (result["status"]) {
        this.accounting_plans = result["data"];
      }
    });
  }

  private getAtas(projectID, key) {
    this.ataService
      .getAtasForProjectSupplierInvoice(projectID)
      .subscribe((response) => {
        let atas = response["data"][projectID];
        atas.forEach((ata) => {
          this.selectionOptions.push({
            ata_id: ata["ataId"],
            id: key + "-" + ata["AtaType"].replace("-", "") + ata["AtaNumber"],
            name: ata["AtaType"] + ata["AtaNumber"] + " " + ata["Name"],
            Status: ata["Status"],
            Project: projectID,
            ata_payment_type: ata["payment_type"],
          });
        });
        this.selectionOptions = this.uniqueObjects(this.selectionOptions);
      });
  }

  uniqueObjects(array) {
    var resArr = [];
    array.forEach(function (item) {
      var i = resArr.findIndex((x) => x.id == item.id);
      if (i <= -1) {
        resArr.push(item);
      }
    });
    return resArr;
  }

  filterSelectionOptions() {
    this.invoiceRows.forEach((row) => {
      let index = this.selectionOptions.findIndex(
        (option) => option["id"] == row["Project"]
      );
      this.updateSelectOptions(row["Project"], index, this.projectId);
    });
  }

  addRow() {
    if (this.supplierInvoice.Invoiced != "1") {
      let parent = this.supplier_row_id;

      if (
        this.invoiceRows.length > 0 &&
        this.invoiceRows[this.invoiceRows.length - 1].Price != "0"
      ) {
        this.invoiceRows.push({
          Account: this.supplierInvoice.Account,
          AccountDescription: "",
          CanEdit: "1",
          Credit: "0",
          Debit: "0",
          Deduct:
            this.supplierInvoice.credit > 0 ? 0 : this.project.chargeMaterial,
          oldDeduct:
            this.supplierInvoice.credit > 0 ? 0 : this.project.chargeMaterial,
          Invoiced: "0",
          OriginProject:
            this.supplierInvoice.InvoiceName.toString().split("-")[0],
          Price: "0",
          Price2: "0",
          Project: this.supplierInvoice.InvoiceName.toString().split("-")[0],
          SupplierInvoiceId: this.supplierInvoice.id,
          Total: "0",
          TransactionInformation: "",
          Type: "Child",
          id: "",
          Parent: parent,
          master: 0,
          baseProjectName: this.project.CustomName,
          baseProjectId: this.project.id,
          project_debit_id: this.project.debit_Id,
          ata_id: this.supplierInvoice.ata_id,
          ata_charge_material: this.project.ata_charge_material,
          ata_payment_type: null,
        });
      } else if (this.invoiceRows.length == 0) {
        this.invoiceRows.push({
          Account: this.supplierInvoice.Account,
          AccountDescription: "",
          CanEdit: "1",
          Credit: "0",
          Debit: "0",
          Deduct:
            this.supplierInvoice.credit > 0 ? 0 : this.project.chargeMaterial,
          oldDeduct:
            this.supplierInvoice.credit > 0 ? 0 : this.project.chargeMaterial,
          Invoiced: "0",
          OriginProject: this.project.CustomName,
          Price: "0",
          Price2: "0",
          Project: this.project.CustomName,
          SupplierInvoiceId: this.supplierInvoice.id,
          Total: "0",
          TransactionInformation: "",
          Type: "Child",
          id: "",
          Parent: parent,
          ata_id: this.supplierInvoice.ata_id,
          master: 0,
          baseProjectName: this.project.CustomName,
          baseProjectId: this.project.id,
          project_debit_id: this.project.debit_Id,
          ata_charge_material: this.project.ata_charge_material,
          ata_payment_type: null,
        });
        this.project_keys.push(this.project.CustomName);
        this.activeKey = this.project.CustomName;
      }
      this.getAtas(this.projectId, this.project.CustomName);
      this.updateTotal();
    }
  }

  updateRow(i, row) {
    row.Deduct = Number(row.Deduct);
    if (row["Total"] <= 0) {
      row.Deduct = 0;
    }

    let price = Number(
      row.Price.toString().replace(/\s/g, "").replace(",", ".")
    );
    this.invoiceRows[i].Price2 = price;
    row.Total = price * (row.Deduct / 100 + 1);
    this.updateTotal();
  }

  removeRow(row, index) {
    if (row.id) {
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
              .removeSupplierInvoiceRows(row.id, this.project.id)
              .then((res) => {
                this.invoiceRows.splice(index, 1);
                this.updateTotal();
              });
          }
        });
    } else {
      this.invoiceRows.splice(index, 1);
      this.addRow();
    }
    this.updateTotal();
  }

  toggleDocument(num) {
    switch (num) {
      case "+1":
        this.documentToShow = this.documentToShow + 1;
        let p = BASE_URL + this.documents[this.documentToShow]["Path"];
        this.whichPdfPreview = this.sanitizer.bypassSecurityTrustResourceUrl(p);
        break;
      case "-1":
        this.documentToShow = this.documentToShow - 1;
        let u = BASE_URL + this.documents[this.documentToShow]["Path"];
        this.whichPdfPreview = this.sanitizer.bypassSecurityTrustResourceUrl(u);
        break;
    }
  }

  updateSelectOptions(selectedOption, index, sir) {
    let object = this.selectionOptions.find((res) => res.id == selectedOption);

    if (object) {
      this.invoiceRows[index].ata_payment_type = object.ata_payment_type;

      if (
        (object && object.ata_payment_type == 2) ||
        (object && object.ata_payment_type == 3)
      ) {
        this.invoiceRows[index].Deduct = 0;
      } else {
        this.invoiceRows[index].Deduct = this.invoiceRows[index].oldDeduct;
      }

      if (this.invoiceRows[index] && this.invoiceRows[index]["Total"] <= 0) {
        this.invoiceRows[index].Deduct = 0;
      }
    }

    this.selectedOptions = this.selectedOptions.filter(
      (option) => option.index != index
    );
    this.selectedOptions.push({ selectedOption, index });
  }

  /*   updateSelectProjectOptions(row, i) {
    let project = this.projects.find(
      (project) => project.CustomName == row.OriginProject
    );
    this.selectionOptions.push({
      id: row.OriginProject,
      name: row.OriginProject,
    });
    row.Project = row.OriginProject;

    if (project.id != this.project.id) {
      row.master = 1;
    }
    this.getAtas(project.id, row.OriginProject);
  } */

  updateSelectProjectOptions(row, i) {

    let project = this.projects.find(
      (project) => project.CustomName == row.OriginProject
    );

    this.selectionOptions.push({
      id: row.OriginProject,
      name: row.OriginProject,
    });
    row.Project = row.Project;

    if (project.id != this.project.id) {
      row.master = 1;
    }

    this.getAtas(project.id, row.OriginProject);
  }

  updateSelectProjectOptionsfirtstDropdDown(row, i) {

    this.invoiceRows[i].OriginProject = row.item.CustomName;
    this.invoiceRows[i].Project = row.item.CustomName;
/*    this.invoiceRows[i].OriginProject = row.item.CustomName;
    this.invoiceRows[i].OriginProject = row.item.CustomName;

    this.invoiceRows.find((inv) => inv.id == row.moment.id).Project =
      row.item.CustomName;
    this.invoiceRows.find((inv) => inv.id == row.moment.id).OriginProject =
      row.item.CustomName;
    this.invoiceRows.find((inv) => inv.id == row.moment.id).name =
      row.item.name;
*/
    this.updateSelectProjectOptions(row.moment, i);
  }
  updateSelectProjectOptionssecondDropdDown(row, i) {

    this.invoiceRows[i].OriginProject = row.item.id;
    this.invoiceRows[i].Project = row.item.id;
    this.invoiceRows[i].name = row.item.name;
    this.invoiceRows[i].ata_id = row.item.ata_id;

/*
    this.invoiceRows.find((inv) => inv.id == row.moment.id).Project =
      row.item.id;
    this.invoiceRows.find((inv) => inv.id == row.moment.id).name =
      row.item.name;
*/
    let projectid = this.invoiceRows[i].OriginProject.toString().split(5);
    let projectglobalid = this.invoiceRows[i].OriginProject;
    this.updateSelectOptions(projectid, i, projectglobalid);
  }

  getFilteredOptions(selectedOption) {
    let filterProjects;
    filterProjects = this.selectionOptions.filter(
      (option) =>
        option["id"].split("-ÄTA")[0] ==
        selectedOption.OriginProject.split("-ÄTA")[0]
    );

    return filterProjects;
  }

  setMainRowAccount(selectedOption) {
    this.allowUpdateInvoice = true;
    this.supplierInvoice.Account = selectedOption;
    this.createForm.get("Account").patchValue(selectedOption);
    this.supplierInvoice.supplier_row_id = this.supplier_row_id;
  }

  updateTotal() {

    this.invoiceRows.forEach((row) => {
      this.sumTotal = this.invoiceRows.reduce((prev, row) => {
        return (
          prev +
          Number(row.Price.toString().replace(/\s/g, "").replace(",", "."))
        );
      }, 0);
    });
  }

  returnBack() {
    if (this.openedFrom == "AllInvoices") {
      this.router.navigate(["/suppliers/supplier-invoices/"], {
        queryParams: { type: this.type, loc: "supplier_invoices" },
      });
    } else {
      this.router.navigate(
        ["/projects/view/", this.projectId, "supplier-invoices"],
        { queryParams: { type: this.type, loc: "supplier_invoices" } }
      );
    }
  }

  update() {

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
          const data = this.createForm.value;
          if (this.supplierInvoice.sirId)
            data.sirId = this.supplierInvoice.sirId;
          if (
            (this.createForm.valid && this.createForm.touched) ||
            this.allowUpdateInvoice
          ) {
            this.invoicesService
              .updateSupplierInvoice(data)
              .subscribe((res) => {
                if (res["status"]) {
                  this.toastr.success(
                    this.translate.instant(
                      "You have successfully edited invoice!"
                    ),
                    this.translate.instant("Success")
                  );
                  this.router.navigate([url], {
                    queryParams: { type: this.type },
                  });
                  this.allowUpdateInvoice = false;
                }
              });
          }
          this.invoiceRows.forEach((row) => {
            row.order_nr = this.supplierInvoice.OrderNR;
            if (row.Price == "" || row.Price == null || row.Price == 0) {
              row.Price = 0;
              this.updateRow(this.invoiceRows.indexOf(row), row);
            }
          });
          let url = "/projects/view/" + this.projectId + "/supplier-invoices";
          if (this.openedFrom == "AllInvoices") {
            url = "/suppliers/supplier-invoices/";
          }
          this.projectsService
            .updateSupplierInvoiceRows(
              this.invoiceRows,
              this.invoiceId,
              this.supplier_row_id
            )
            .then((res) => {
              if (res["status"]) {
                this.toastr.success(
                  this.translate.instant(
                    "You have successfully edited invoice!"
                  ),
                  this.translate.instant("Success")
                );
              }
              this.router.navigate([url], { queryParams: { type: this.type } });
            });
        }
      });
  }

  converNumberToNegativeIfTypeIsCredit(number) {
    if (this.supplierInvoice.credit > 0)
      number > 0 ? (number = -number) : number;
    else number = Math.abs(number);
    return number;
  }

  selectedAccount(row, index) {

    this.invoiceRows[index].Account = row.item.Number;
    let status = this.enabled_account_numbers.lastIndexOf(row["Account"]);

    if (row["Deduct"] != 0) {
      row["oldDeduct"] = row["Deduct"];
    }

    if (
      (row.ata_id != "0" && row.ata_payment_type == 2) ||
      (row.ata_id != "0" && row.ata_payment_type == 3)
    ) {
      row["Deduct"] = 0;
    }

    if (
      (row.ata_id == "0" && row.project_debit_id == 2) ||
      (row.ata_id == "0" && row.project_debit_id == 3)
    ) {
      row["Deduct"] = 0;
    }

    if (status == -1) {
      row["Deduct"] = 0;
    } else {
      row["Deduct"] = row["oldDeduct"];
    }

    if (row["Total"] <= 0) {
      row.Deduct = 0;
    }
  }

  isPDFViewer: boolean = false;
  openSwiper() {
    const fileArray = this.createFileArray(this.documents[0]);
    this.swiper = {
      active: 0,
      images: fileArray,
      album: this.documents[0].Id,
      directory: null,
    };


    if (this.swiper.images[0].name.endsWith("pdf")) {
      this.isPDFViewer = true;
    } else {
      this.isPDFViewer = false;
    }
  }

  createFileArray(file) {
    const id = file.Id;
    const comment = "";
    const name = file.Name;
    // const image_path = file.Image_path;
    const file_path = file.Path;

    const fileArray = file_path.split(",").map((fileArray) => {
      return {
        image_path: fileArray,
        id: id,
        Description: comment,
        name: name,
        file_path: file_path,
      };
    });
    return fileArray;
  }

  closeSwiper() {
    this.swiper = {
      active: -1,
      images: [],
      album: -2,
      directory: null,
    };
  }

  allowEditSupplierInvoice() {
    let status = false;
    if (this.userDetails.create_project_SupplierInvoices) {
      status = true;
    }
    if (!status) {
      this.createForm.disable();
    } else {
      this.createForm.enable();
    }
    return status;
  }

  updateCharacterCount() {
    const maxCharacters = 150;
    const interCommentValue = this.createForm.get("interComment").value;
    this.characterCount = interCommentValue.length;
    if (this.characterCount > maxCharacters) {
      this.createForm
        .get("interComment")
        .setValue(interCommentValue.slice(0, maxCharacters));
      this.characterCount = maxCharacters;
    }
  }

  autoGrowTextZone(e) {
    e.target.style.height = e.target.scrollHeight + "px";
  }
}
