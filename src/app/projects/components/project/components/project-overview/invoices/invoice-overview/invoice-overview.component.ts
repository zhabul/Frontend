import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { FortnoxApiService } from "src/app/core/services/fortnoxApi.service";
import { AtaService } from "src/app/core/services/ata.service";
import { InvoicesService } from "src/app/core/services/invoices.service";
import { ProjectsService } from "../../../../../../../core/services/projects.service";
import { ClientsService } from "../../../../../../../core/services/clients.service";
import { SuppliersService } from "src/app/core/services/suppliers.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";

declare var $;

@Component({
  selector: "app-invoice-overview",
  templateUrl: "./invoice-overview.component.html",
  styleUrls: ["./invoice-overview.component.css"],
})
export class InvoiceOverviewComponent implements OnInit {
  public project;
  public clients;
  public client;
  public materialProperties;
  public units;
  public atas = [];
  public createForm: FormGroup;
  public showAddArticleForm = false;
  public atasForm: FormGroup;
  public materialsForm: FormGroup;
  public weeklyReportsForm: FormGroup;
  public Number = Number;
  public process = false;
  public projects;
  public references = [];
  public types = ["Invoice", "Credit Invoice"];
  public invoice;
  public locked: Boolean = false;
  public deletedArticles = [];
  public rows = [];
  public ataRows = [];
  public tabActive = false;
  public status;
  public supplierInvoices;
  public supplierInvoicesByProject = [];
  public hours = [];
  public materials = [];
  public paymentPlans = [];
  public weeklyReports = [];
  public language;

  get articleForm() {
    return this.createForm.get("articleForm") as FormArray;
  }

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private translate: TranslateService,
    private toastr: ToastrService,
    private fortnoxApi: FortnoxApiService,
    private router: Router,
    private ataService: AtaService,
    private projectsService: ProjectsService,
    private invoiceService: InvoicesService,
    private dialog: MatDialog,
    private clientsService: ClientsService,
    private supplierService: SuppliersService
  ) {}

  ngOnInit() {
    this.language = sessionStorage.getItem("lang");
    this.translate.use(this.language);

    this.project = this.route.snapshot.data["project"];
    this.clients = this.route.snapshot.data["clients"].data;
    this.materialProperties = this.route.snapshot.data["materialProperties"];
    this.units = this.route.snapshot.data["units"];
    this.references = this.route.snapshot.data["users"]["data"] || [];
    this.invoice = this.route.snapshot.data["invoice"];
    this.status = this.invoice.Status;
    this.supplierInvoices =
      this.route.snapshot.data["supplierInvoices"].SupplierInvoices;

    this.getAtas(this.invoice.ProjectId, true);
    this.getMaterials(this.invoice.ProjectId, true);
    this.getWeeklyReports(this.invoice.ProjectId, true);

    this.createForm = this.fb.group({
      project: ["", Validators.required],
      client: [{ value: "", disabled: true }, Validators.required],
      invoiceDate: ["", Validators.required],
      dueDate: [""],
      reference: ["", Validators.required],
      type: [this.types[0], Validators.required],
      note1: [""],
      note2: [""],
      articleForm: this.fb.array([]),
    });

    this.atasForm = this.fb.group({
      ataSelected: [""],
    });

    this.materialsForm = this.fb.group({
      materialSelected: [""],
    });

    this.weeklyReportsForm = this.fb.group({
      reportSelected: [""],
    });

    $("#invoiceDate")
      .datepicker({
        format: "yyyy-mm-dd",
        calendarWeeks: true,
        todayHighlight: true,
        autoclose: true,
        weekStart: 1,
      })
      .on("changeDate", (ev) => {
        if (
          Date.parse(ev.target.value.split(" ")[0]) >
          Date.parse(this.createForm.value.dueDate.split(" ")[0])
        ) {
          setTimeout(() => {
            this.toastr.info(
              this.translate.instant("Invoice date cannot be after due date."),
              this.translate.instant("Info")
            );
            ev.target.value = this.createForm.value.invoiceDate;
          }, 0);
        } else {
          this.createForm.get("invoiceDate").patchValue(ev.target.value);
        }
      });

    $("#dueDate")
      .datepicker({
        format: "yyyy-mm-dd",
        calendarWeeks: true,
        todayHighlight: true,
        autoclose: true,
        weekStart: 1,
      })
      .on("changeDate", (ev) => {
        if (
          Date.parse(ev.target.value.split(" ")[0]) <
          Date.parse(this.createForm.value.invoiceDate.split(" ")[0])
        ) {
          setTimeout(() => {
            this.toastr.info(
              this.translate.instant("Due date cannot be before invoice date."),
              this.translate.instant("Info")
            );
            ev.target.value = this.createForm.value.dueDate;
          }, 0);
        } else {
          this.createForm.get("dueDate").patchValue(ev.target.value);
        }
      });

    this.fillData();

    this.locked = true;
    this.createForm.disable();

    this.getProject(this.invoice.ProjectId, true);
    this.getAllRows();
  }

  getProject(projectId, start = null) {
    this.projectsService.getProject(projectId).then((project) => {
      this.createForm.get("client").patchValue(project.clientName);
      this.project = project;
      this.getMaterials(this.project.CustomName);
      this.getClient();
    });

    if (start == null) {
      this.deletedArticles = this.rows;
      this.getAtas(projectId);
      this.getWeeklyReports(projectId);
      this.clearRows();
      this.pushRow();
      this.pushRow();
    }
  }

  getClient() {
    if (this.project.client_id != null) {
      this.clientsService
        .getOneClient(this.project.client_id)
        .subscribe((client) => {
          this.client = client;
        });
    }
  }

  getAtas(projectId, firstCall = null) {
    if (firstCall == null) {
      this.atasForm.controls["ataSelected"].patchValue(false);
      this.atas = [];
    }

    this.ataService.getAtas(projectId).subscribe((atas) => {
      this.atas = atas["data"];
      if (this.atas) {
        this.atas = this.atas.filter((ata) => {
          return ata.Status == 2 && ata.PaymentType != "1";
        });
      }
    });
  }

  getMaterials(customName, firstCall = null) {
    this.supplierInvoicesByProject = [];
    this.supplierInvoicesByProject = this.supplierInvoices.filter((row) => {
      return row.Project == customName;
    });
    this.supplierService.getCompletedSupplierInvoices().subscribe((res) => {
      this.supplierInvoicesByProject = this.supplierInvoicesByProject.filter(
        (invoice) =>
          res["data"].every((completed) => completed != invoice.GivenNumber)
      );
    });
  }

  getWeeklyReports(projectId, firstCall = null) {
    this.weeklyReports = [];
    this.invoiceService.getWeeklyReports(projectId).subscribe((reports) => {
      this.weeklyReports = reports["data"] || [];
    });
  }

  isTab() {
    this.tabActive = !this.tabActive;
  }

  getAllRows() {
    this.articleForm.controls.forEach((row) => {
      if (row.value.Id != "") {
        if (this.rows.indexOf(row.value.Id) == -1) {
          this.rows.push({
            id: row.value.Id,
            AtaId: row.value.AtaId,
            MaterialId: row.value.MaterialId,
            ReportId: row.value.ReportId,
            Description: row.value.Description,
            DeliveredQuantity: row.value.DeliveredQuantity,
            Unit: row.value.Unit,
            Price: row.value.Price,
            Deduct: row.value.Deduct,
            Total: row.value.Total,
          });
        }
      }
    });
  }

  clearRows() {
    while (this.articleForm.length !== 0) {
      this.articleForm.removeAt(0);
    }
  }

  clearEmptyRows() {
    this.articleForm.controls.forEach((row, i) => {
      if (row.value.Description == "") {
        this.articleForm.controls.splice(i, 1);
      }
    });
  }

  isChecked(id, type) {
    let checked = false;
    this.articleForm.controls.forEach((row) => {
      if (type == 1) {
        if (row.value.ataId == id) {
          checked = true;
        }
      }
      if (type == 2) {
        if (row.value.MaterialId == id) {
          checked = true;
        }
      }
      if (type == 3) {
        if (row.value.ReportId == id) {
          checked = true;
        }
      }
    });

    return checked;
  }

  getAtaRows(value, ataId, ataName) {
    this.clearEmptyRows();
    if (value == true) {
      let exists = false;
      for (let i = 0; i < this.articleForm.controls.length; i++) {
        if (this.articleForm.controls[i].value.AtaId == ataId) {
          exists = true;
        }
      }
      if (!exists) {
        this.process = true;
        this.addAta(ataId, ataName);
      }
    } else {
      this.articleForm.controls.forEach((row, i) => {
        if (row.value.AtaId == ataId) {
          this.articleForm.controls.splice(i, 1);
        }
      });
      this.clearEmptyRows();
      this.pushRow();
      this.pushRow();
      this.process = false;
    }
  }

  getMaterialRows(value, materialId, meterialName, total) {
    this.clearEmptyRows();
    if (value == true) {
      let exists = false;
      for (let i = 0; i < this.articleForm.controls.length; i++) {
        if (this.articleForm.controls[i].value.MaterialId == materialId) {
          exists = true;
        }
      }
      if (!exists) {
        this.process = true;
        this.addMaterial(materialId, meterialName, total);
      }
    } else {
      this.articleForm.controls.forEach((row, i) => {
        if (row.value.MaterialId == materialId) {
          this.articleForm.controls.splice(i, 1);
        }
      });
      this.clearEmptyRows();
      this.pushRow();
      this.pushRow();
      this.process = false;
    }
  }

  getWeeklyReportsRows(value, reportId, reportName, total) {
    this.clearEmptyRows();
    if (value == true) {
      let exists = false;
      for (let i = 0; i < this.articleForm.controls.length; i++) {
        if (this.articleForm.controls[i].value.ReportId == reportId) {
          exists = true;
        }
      }
      if (!exists) {
        this.process = true;
        this.addWeeklyReport(reportId, reportName, total);
      }
    } else {
      this.articleForm.controls.forEach((row, i) => {
        if (row.value.ReportId == reportId) {
          this.articleForm.controls.splice(i, 1);
        }
      });
      this.clearEmptyRows();
      this.pushRow();
      this.pushRow();
      this.process = false;
    }
  }

  addAta(id, name) {
    let total = 0;
    this.ataService.getArticlesAdditionalWork(id, this.project.id).subscribe((response) => {
      if (response["status"]) {
        let articlesAdditionalWork = response["data"];
        articlesAdditionalWork.forEach((group1) => {
          let amount = group1.Total != "" ? group1.Total : 0;
          total += parseFloat(amount);
        });
      }
      this.ataService.getArticlesmaterial(id,this.project.id).subscribe((response) => {
        if (response["status"]) {
          let articlesMaterial = response["data"];
          articlesMaterial.forEach((group2) => {
            let amount = group2.Total != "" ? group2.Total : 0;
            total += parseFloat(amount);
          });
        }
        this.ataService.getArticlesOther(id, this.project.id).subscribe((response) => {
          if (response["status"]) {
            let articlesOther = response["data"];
            articlesOther.forEach((group3) => {
              let amount = group3.Total != "" ? group3.Total : 0;
              total += parseFloat(amount);
            });
          }
          this.pushAta(id, name, total);
          this.process = false;
          this.atasForm.controls["ataSelected"].enable();
          this.clearEmptyRows();
          this.pushRow();
          this.pushRow();
        });
      });
    });
  }

  addMaterial(id, name, total) {
    this.pushMaterial(id, name, total);
    this.process = false;
    this.materialsForm.controls["materialSelected"].enable();
    this.clearEmptyRows();
    this.pushRow();
    this.pushRow();
  }

  addWeeklyReport(id, name, total) {
    this.pushReprot(id, name, total);
    this.process = false;
    this.weeklyReportsForm.controls["reportSelected"].enable();
    this.clearEmptyRows();
    this.pushRow();
    this.pushRow();
  }

  pushAta(id, name, total) {
    let t = Number(total).toFixed(2);
    this.articleForm.push(
      this.fb.group({
        Id: "",
        AtaId: id,
        MaterialId: "",
        ReportId: "",
        Description: "ATA-" + id + " " + name,
        DeliveredQuantity: 1,
        Unit: "pieces",
        Price: t,
        Deduct: "",
        Total: t,
      })
    );
  }

  pushMaterial(id, name, total) {
    let t = Number(total).toFixed(2);
    this.articleForm.push(
      this.fb.group({
        Id: "",
        AtaId: "",
        MaterialId: id,
        ReportId: "",
        Description: id + "-" + name,
        DeliveredQuantity: 1,
        Unit: "pieces",
        Price: t,
        Deduct: "",
        Total: t,
      })
    );
  }

  pushReprot(id, name, total) {
    let t = Number(total).toFixed(2);
    this.articleForm.push(
      this.fb.group({
        Id: "",
        AtaId: "",
        MaterialId: "",
        ReportId: id,
        Description: name,
        DeliveredQuantity: 1,
        Unit: "pieces",
        Price: t,
        Deduct: "",
        Total: t,
      })
    );
  }

  pushRow(group = null) {
    if (group == null) {
      this.articleForm.push(
        this.fb.group({
          Id: "",
          AtaId: "",
          MaterialId: "",
          ReportId: "",
          Description: "",
          DeliveredQuantity: "",
          Unit: "",
          Price: "",
          Deduct: "",
          Total: "",
        })
      );
    } else {
      this.articleForm.push(
        this.fb.group({
          Id: "",
          AtaId: group.id,
          MaterialId: group.MaterialId,
          ReportId: group.ReportId,
          Description: group.Name,
          DeliveredQuantity: group.Quantity,
          Unit: group.Unit,
          Price: group.Price,
          Deduct: group.Deduct,
          Total: group.Total,
        })
      );
    }
  }

  addRow(formGroup) {
    if (formGroup.controls[formGroup.controls.length - 2]) {
      if (
        formGroup.controls[formGroup.controls.length - 2].value.Description !==
        ""
      ) {
        this.pushRow();
      }
    } else if (formGroup.controls[formGroup.controls.length - 1]) {
      this.pushRow();
    }
  }

  updateTotal(i, formGroup) {
    formGroup.controls[i].value.Price = formGroup.controls[
      i
    ].value.Price.replace(/\s/g, "").replace(",", ".");

    let total = (
      formGroup.controls[i].value.DeliveredQuantity *
      (formGroup.controls[i].value.Price *
        (formGroup.controls[i].value.Deduct / 100 + 1))
    ).toFixed(2);
    (<FormGroup>formGroup.controls[i]).controls["Total"].patchValue(total);
  }

  invoiceTotalAmount() {
    let total = 0;
    this.articleForm.controls.forEach((row, i) => {
      let amount = row.value.Total != "" ? row.value.Total : 0;
      total += parseFloat(amount);
    });

    return total.toFixed(2);
  }

  removeRow(index, formGroup, id) {
    if (formGroup.controls.length > 1) {
      formGroup.controls.splice(index, 1);
      formGroup.value.splice(index, 1);
    } else {
      formGroup.controls[0].setValue({
        Id: "",
        AtaId: "",
        MaterialId: "",
        ReportId: "",
        Description: "",
        DeliveredQuantity: "",
        Unit: "",
        Price: "",
        Deduct: "",
        Total: "",
      });
    }
  }

  validateForm() {
    let valid = true;
    this.articleForm.controls.forEach((row) => {
      if (
        (row.get("DeliveredQuantity").value != "" ||
          row.get("Price").value != "") &&
        row.get("Description").value == ""
      ) {
        row.get("Description").setValidators([Validators.required]);
        row.get("Description").updateValueAndValidity();
        valid = false;
      }
    });

    return valid;
  }

  updateInvoice() {
    const data = this.createForm.getRawValue();

    let total = 0;
    data.id = this.invoice.Id;
    data.projectName = this.project.name;
    data.clientId = this.project.client_id;
    data.deletedArticles = this.rows;

    data.articleForm = data.articleForm.filter((row) => {
      return row.Description != "";
    });

    data.articleForm.forEach((row) => {
      let amount = row.Total != "" ? row.Total : 0;
      total += parseFloat(amount);
    });

    data.total = total.toFixed(2);
    const valid = this.validateForm();

    if (valid) {
      this.invoiceService.updateInvoice(data).subscribe((res: any) => {
        if (res.status) {
          this.toastr.success(
            this.translate.instant("Successfully updated invoice."),
            this.translate.instant("Success")
          );
          this.router.navigate(["/invoices"]);
        }
      });
    }
  }

  sendInvoice() {
    const form = this.createForm.getRawValue();
    const data = {
      DocumentNumber: parseInt(this.invoice.Id),
      Project: this.project.CustomName,
      CustomerNumber: this.client.Number,
      InvoiceDate: form.invoiceDate.split(" ")[0],
      DueDate: form.dueDate.split(" ")[0],
      Remarks: form.note1,
      OurReference: form.reference,
      InvoiceRows: JSON.parse(JSON.stringify(this.articleForm.value)).map(
        (a) => {
          a.Price = a.Total;
          delete a.AtaId;
          delete a.MaterialId;
          delete a.ReportId;
          delete a.Id;
          delete a.Deduct;
          delete a.Total;
          return a;
        }
      ),
    };

    data.InvoiceRows.forEach((row) => {
      row.VAT = 0;
    });

    data.InvoiceRows = data.InvoiceRows.filter(function (row) {
      return row.Description != "";
    });

    this.fortnoxApi.createInvoice(data).then((res) => {
      if (res) {
        this.toastr.success(
          this.translate.instant("Successfully created invoice for Fortnox."),
          this.translate.instant("Success")
        );
        this.addToCompleted();
        this.updateInvoice();
        this.router.navigate(["/invoices"]);
      }
    });
  }

  addToCompleted() {
    const invoices = this.articleForm.value.map(
      (invoice) => invoice.MaterialId
    );
    let data = {
      invoices: invoices,
      materialArticleId: 0,
    };
    this.supplierService.addToCompletedSupplierInvoices(data).subscribe((res) => {
      if (res["status"]) {
        console.log("worked successfully");
      }
    });
  }

  cancelInvoice() {
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
          this.invoiceService.removeInvoice(this.invoice.Id).subscribe((res) => {
            if (res) {
              this.toastr.success(
                this.translate.instant("Successfully removed invoice."),
                this.translate.instant("Success")
              );
              this.router.navigate(["/invoices"]);
            }
          });
        }
      });
  }

  fillData() {
    this.createForm.patchValue({
      project: this.project.CustomName + "-" + this.project.name,
      client: this.invoice.Client,
      invoiceDate: this.invoice.InvoiceDate,
      dueDate: this.invoice.DueDate,
      reference: this.invoice.Reference,
      type: this.invoice.Type,
      note1: this.invoice.Note1,
      note2: this.invoice.Note2,
    });

    this.invoice.Articles.forEach((row) => {
      this.articleForm.push(
        this.fb.group({
          Id: row.Id,
          AtaId: row.AtaId,
          MaterialId: row.MaterialId,
          ReportId: row.ReportId,
          Description: row.Name,
          DeliveredQuantity: row.DeliveredQuantity,
          Unit: row.Unit,
          Price: row.Price,
          Deduct: row.Deduct,
          Total: (row.Price * row.DeliveredQuantity).toFixed(2),
        })
      );
    });

    this.pushRow();
    this.pushRow();
  }
}
