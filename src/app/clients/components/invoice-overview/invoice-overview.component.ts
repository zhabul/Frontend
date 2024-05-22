import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ProjectsService } from "src/app/core/services/projects.service";
import { ClientsService } from "src/app/core/services/clients.service";

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
  public theClient;

  get articleForm() {
    return this.createForm.get("articleForm") as FormArray;
  }

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private translate: TranslateService,
    private toastr: ToastrService,
    private projectsService: ProjectsService,
    private clientsService: ClientsService
  ) {}

  ngOnInit() {
    this.client = this.route.snapshot.data["client"];
    this.invoice = this.route.snapshot.data["invoice"] || [];
    this.theClient = this.route.snapshot.data["theClient"];
    this.status = this.invoice.Status;

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

    this.locked = true;
    this.createForm.disable();

    this.getProject(this.invoice.ProjectId, true);
  }

  getProject(projectId, start = null) {
    this.projectsService.getProject(projectId).then((project) => {
      this.createForm.get("client").patchValue(project.clientName);
      this.project = project;
      this.getClient();
    });
  }

  getClient() {
    if (this.project.client_id != null) {
      this.clientsService
        .getOneClient(this.project.client_id)
        .subscribe((client) => {
          this.client = client;
          this.fillData();
        });
    }
  }

  updateTotal(i, formGroup) {
    let total = (
      formGroup.controls[i].value.DeliveredQuantity *
      (formGroup.controls[i].value.Price *
        (formGroup.controls[i].value.Deduct / 100 + 1))
    ).toFixed(2);
    (<FormGroup>formGroup.controls[i]).controls["Total"].patchValue(total);
  }

  invoiceTotalAmount() {
    let total = 0;
    this.articleForm.controls.forEach((row) => {
      let amount = row.value.Total != "" ? row.value.Total : 0;
      total += parseFloat(amount);
    });

    return total.toFixed(2);
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
          Total: (row.DeliveredQuantity * row.Price).toFixed(),
        })
      );
    });
  }
}
