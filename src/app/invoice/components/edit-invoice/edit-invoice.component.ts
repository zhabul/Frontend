import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormArray, NgForm, FormControl } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { FortnoxApiService } from "src/app/core/services/fortnoxApi.service";
import { AtaService } from "src/app/core/services/ata.service";
import { InvoicesService } from "src/app/core/services/invoices.service";
import { ProjectsService } from "../../../core/services/projects.service";
import { ClientsService } from "../../../core/services/clients.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { PaymentPlanService } from "src/app/core/services/payment-plan.service";
import { CommentsModalComponent } from "src/app/shared/modals/comments-modal/comments-modal.component";
import { ConfirmModalComponent } from "src/app/shared/modals/confirm-modal/confirm-modal.component";
import { AppComponent } from "src/app/app.component";

declare var $;

@Component({
  selector: "app-edit-invoice",
  templateUrl: "./edit-invoice.component.html",
  styleUrls: ["./edit-invoice.component.css"],
})
export class EditInvoiceComponent implements OnInit, AfterViewInit {
  @ViewChild("myform", { static: true }) myform!: NgForm;
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
  public paymentPlanForm: FormGroup;
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
  public paymentPlansRows: any[] = [];
  public weeklyReports = [];
  public language;
  public contentHasChanged = false;
  public weeklyReportsNotInvoiced: any[] = [];
  public weeklyReportsInvoiced: any[] = [];
  public weeklyRaportsIndexs: any[] = [];
  public paymentPlansInvoiced: any[] = [];
  public paymentPlansNotInvoiced: any[] = [];
  public selectedTab = 0;
  public atasInvoiced: any[] = [];
  public atasNotInvoiced: any[] = [];
  public removedArticles = [];
  public removedWeeklyReports = [];
  public activityProjects: any[] = [];
  public existActivityProjects: boolean = false;
  public spinner: boolean = false;
  public activeProjectId: any;
  public selectedActivity: any = "";
  public allowChengaProject: boolean = false;
  public setType = "Edit";
  public back = "/invoices";
  public userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  public disableOngoing = false;
  public disablePaymentPlan = false;
  public disableAta = false;
  public allowInvoiced = true;
  public selectOpen: boolean = false;
  public disabledButton: boolean = false;
  public removedPaymantArticles: any[]= [];
  isReadOnly: boolean = false;
  public count;
  public generals;
  private queryParSub: Subscription;

  public isUpdateClicked: boolean = false;

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
    private dialog: MatDialog,
    private projectsService: ProjectsService,
    private invoiceService: InvoicesService,
    private clientsService: ClientsService,
    private paymentplanService: PaymentPlanService,
    private appComponent: AppComponent,
  ) {}

  public projects_invoice = [];

  ngOnInit() {
    this.initializeUser();
    this.language = sessionStorage.getItem("lang");
    this.translate.use(this.language);
    this.queryParSub = this.route.queryParams.subscribe((params) => {
      if (params["p"]) {
        this.back = `/projects/view/${params["p"]}/invoices`;
      }
    });
    this.generals = this.route.snapshot.data["generals"];
    this.projects = this.route.snapshot.data["projects"].map((project) => {
      project["finalName"] = `${project["CustomName"]} - ${project["name"]}`;
      return project;
    });

    this.projects_invoice = this.route.snapshot.data["projects_invoice"].data.map((project) => {
      project["finalName"] = `${project["CustomName"]} - ${project["name"]}`;
      return project;
    });

    this.clients = this.route.snapshot.data["clients"].data;
    this.materialProperties = this.route.snapshot.data["materialProperties"];
    this.units = this.route.snapshot.data["units"];

    this.invoice = this.route.snapshot.data["invoice"];
    this.status = this.invoice.Status;
    this.supplierInvoices = [];

    if (this.invoice.activity != null && this.invoice.activity != "") {
      this.activeProjectId = this.invoice.activity;
      this.selectedActivity = this.invoice.activity;
      this.getActivityProjects(this.invoice.ProjectId);
    } else {
      this.activeProjectId = this.invoice.ProjectId;
    }

    this.getAtas(this.activeProjectId, true);
    this.getWeeklyReports(this.activeProjectId, true);
    this.getPaymentPlan(this.activeProjectId, true);


    this.createForm = this.fb.group({
      project: [{ value: "", disabled: true }, Validators.required],
      project_name: [{ value: "", disabled: true }, , Validators.required],
      activity: [this.selectedActivity],
      client: [{ value: "", disabled: true }, Validators.required],
      invoiceDate: ["", Validators.required],
      dueDate: [""],
      reference: ["", Validators.required],
      reference_id: ["", Validators.required],
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

    this.paymentPlanForm = this.fb.group({
      paymentPlans: this.fb.array([]),

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
        this.contentHasChanged = true;
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
        this.contentHasChanged = true;
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


    if (this.invoice.Status > 1) {
      this.locked = true;
      this.createForm.disable();
    }

    this.getProject({ value: this.invoice.ProjectId }, true);
    this.fillData();
    this.getAllRows();
    this.allowAddData();


  }

  initializeUser() {
    this.references = [];
    let current_user = {
      finalName: this.userDetails.firstname + " " + this.userDetails.lastname,
      id: this.userDetails.user_id,
    };
    this.references.push(current_user);
  }

  ngAfterViewInit() {
    this.ensureSwithProjectIfNotExistData();
    setTimeout(() => {
      this.ensureSwithProjectIfNotExistData();
    }, 2000);
  }

  getProject(project, start = null, activity = null) {
    this.contentHasChanged = true;
    const projectId = project.value;
    if (projectId !== "-1") {
      this.projectsService.getProject(projectId).then((project) => {
        this.createForm.get("client").patchValue(project.clientName);
        this.project = project;
        this.getClient();

        if (activity) {
          this.createForm.get("activity").patchValue("");
          this.getActivityProjects(projectId);
        }

        this.project.responsiblePeople.forEach((user) => {
          if (this.references[0].id != user.Id) {
            let responisble_person = {
              finalName: user.Name,
              id: user.Id,
            };
            this.references.push(responisble_person);
          }
        });

        this.createForm.get('reference').patchValue(this.invoice.Reference);
        this.createForm.get('reference_id').patchValue(this.invoice.ReferenceId);

      });

      if (start == null) {
        this.deletedArticles = this.rows;
        this.getAtas(projectId);
        this.getWeeklyReports(projectId);
        this.getPaymentPlan(projectId);
        this.clearEmptyRows();
        this.pushRow();
        this.pushRow();
        this.allowAddData();
      }
    } else {
      this.createForm.get("client").patchValue("");
    }
  }

  changeOurReference() {
    this.contentHasChanged = true;
  }

  onKeyUp() {
    this.contentHasChanged = true;
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

    this.ataService.getAllAtasForInvoice(projectId).subscribe((res: any) => {
      if (res.status) {
        const resDataCopy = JSON.parse(JSON.stringify(res.data));

        this.atasNotInvoiced = res.data
          .map((ata) => {
            if (ata.PaymentType != 2 && ata.PaymentType != 3) {
              ata.weeklyReports = ata.weeklyReports
                .map((wr) => {
                  let exists = false;
                  for (let i = 0; i < this.articleForm.controls.length; i++) {
                    if (this.articleForm.controls[i].value.AtaId == ata.ataId) {
                      exists = true;
                    }
                  }
                  if (wr.financeId != this.invoice.Id && exists) {
                    wr.includeInInvoice = false;
                  }
                  return wr;
                })
                .filter(
                  (wr) => wr.financeId == this.invoice.Id || wr.financeId == 0
                );
              return ata.weeklyReports.length > 0 ? ata : null;
            } else if (ata.PaymentType == 2 || ata.PaymentType == 3) {
              return ata.financeId == 0 ? ata : null;
            }
          })
          .filter((ata) => ata != null);

        this.atasInvoiced = resDataCopy
          .map((ata) => {
            if (ata.PaymentType != 2 && ata.PaymentType != 3) {
              ata.weeklyReports = ata.weeklyReports.filter(
                (wr) => wr.financeId != this.invoice.Id && wr.financeId != 0
              );
              return ata.weeklyReports.length > 0 ? ata : null;
            } else if (ata.PaymentType == 2 || ata.PaymentType == 3) {
              return ata.financeId != 0 ? ata : null;
            } else {
              return ata;
            }
          })
          .filter((ata) => ata != null);

        let articleArray = [];

        this.invoice["Articles"].forEach(function (article) {
          let name = article.Name.split(" ");
          if (name.length > 1) {
            articleArray.push(article);
          }
        });
        this.atasInvoiced = this.atasInvoiced.concat(articleArray);
      }
    });
}

  get paymentPlanForm_() {
    return this.paymentPlanForm.get("paymentPlans") as FormArray;
  }

  getWeeklyReports(projectId, firstCall = null) {
    this.weeklyReports = [];
    this.invoiceService.getWeeklyReports(projectId).subscribe((reports) => {
      this.weeklyReports = reports["data"] || [];
      this.weeklyReportsNotInvoiced = this.weeklyReports
        .filter(
          (report) =>
            (report["financeId"] == this.invoice.Id &&
              report.previously_added_but_not_invoiced == 0) ||
            (report.status == 2 &&
              report.previously_added_but_not_invoiced == 0)
        )
        .map((report) => {
          report["selected"] =
            this.articleForm.controls.findIndex(
              (x_var) =>
                x_var.value.ReportId &&
                x_var.value.ReportId != "" &&
                x_var.value.ReportId &&
                x_var.value.ReportId.split(",").includes(report["id"])
            ) > -1;
          return report;
        });
      this.weeklyReportsInvoiced = this.weeklyReports.filter(
        (report) => report["financeId"] != this.invoice.Id && report.status == 5
      );
    });
  }

  getPaymentPlan(projectId, firstCall = null) {

    this.paymentPlans = [];
    this.paymentplanService
      .getAcceptedPaymentPlan(projectId)
      .subscribe((reports) => {

        this.paymentPlans =
          reports["data"].length != 0 ? reports["data"][0].month_span : [];
        this.paymentPlansRows = [];
        this.paymentPlans.forEach((row, i) => {
          row["paymentPlanNumber"] = reports["data"][0].paymentPlanNumber;
          row["paymentPlanId"] = reports["data"][0].ID;
          this.paymentPlansRows = row;

          if (row.articles) {
            if (row.articles[row.articleKeys[0]][0].Invoice_date !== "") {
              this.paymentPlansInvoiced = this.paymentPlansInvoiced.concat(row);
            } else {
              this.paymentPlansNotInvoiced =

                this.paymentPlansNotInvoiced.concat(row);

            }
          }
        });

        this.paymentPlansNotInvoiced.forEach((plan, index)=>{

          let disabled = false;

          if(plan.check == false) {
              disabled = true;
              let previous = this.paymentPlansNotInvoiced[index - 1];
              if(previous.check) {
                  disabled = false;
              }
          }

          const total = plan.total ? plan.total : 0;
          this.paymentPlanForm_.push(this.fb.group({
            date: new FormControl({ value: plan.date, disabled: disabled }),
            checkbox: new FormControl({ value: plan.check, disabled: disabled }),
            total: new FormControl({ value: total, disabled: disabled }),
            id: new FormControl({ value: plan.id, disabled: disabled }),
            paymentPlanId: new FormControl({ value: plan.paymentPlanId, disabled: disabled }),
            month: new FormControl({ value: plan.month, disabled: disabled }),
            year: new FormControl({ value: plan.year, disabled: disabled }),
            avst: new FormControl({ value: plan.avst, disabled: disabled }),
            datenumber: new FormControl({ value: plan.datenumber, disabled: disabled }),
            paymentPlanNumber: new FormControl({ value: plan.paymentPlanNumber, disabled: disabled }),
            articles: new FormControl({ value: plan.articles, disabled: disabled }),
            articleKeys: new FormControl({ value: plan.articleKeys, disabled: disabled })
          }))

          if (index === 0) {
            disabled = true;
          }

        });

        this.isReadOnly = true;
      });


  }

  displayWeeklyReportName(weeklyReports, ata_id = 0) {
    let inOrder = true;

    this.allowInvoiced = false;

    if (weeklyReports.length == 1) {
      return "V." + weeklyReports[0].revision;
    }

    if (ata_id > 0) {
      const index = this.atasNotInvoiced.findIndex(
        (ata) => ata.ataId === ata_id
      );
      this.atasNotInvoiced[index].weeklyReports.forEach((weekly_report) => {
        const index2 = weeklyReports.findIndex(
          (selected_weekly_report) =>
            selected_weekly_report.wrId === weekly_report.wrId
        );

        if (index2 == -1) {
          inOrder = false;
        }
      });

      for (let i = 1; i < weeklyReports.length; i++) {
        if (
          parseInt(weeklyReports[i].revision_or_week_converted_to_number) !=
          parseInt(weeklyReports[i - 1].revision_or_week_converted_to_number) +
            1
        ) {
          inOrder = false;
        }
      }
    } else {
      for (let i = 1; i < weeklyReports.length; i++) {
        if (
          parseInt(weeklyReports[i].revision_or_week_converted_to_number) !=
          parseInt(weeklyReports[i - 1].revision_or_week_converted_to_number) +
            1
        ) {
          inOrder = false;
        }
      }
    }

    if (inOrder) {
      return (
        "V" +
        weeklyReports[0].revision +
        "-V" +
        weeklyReports[weeklyReports.length - 1].revision
      );
    } else {
      return "V." + weeklyReports.map((wr) => wr.revision).join(",");
    }
  }

  isTab() {
    this.sortAta();
    this.tabActive = !this.tabActive;
    this.selectedTab = 0;
    this.hideAllWRDropdowns();
    this.allowAddData();
  }

  sortAta() {
    this.articleForm.controls = this.articleForm.controls.sort(function (
      a_,
      b_
    ) {
      const a = a_.value;
      const b = b_.value;
      if (a && a.AtaNumber && b && b.AtaNumber) {
        const ataNumberA = Number(a.AtaNumber.toString().split("-")[0]);
        const ataNumberB = Number(b.AtaNumber.toString().split("-")[0]);
        return ataNumberA - ataNumberB;
      }
    });
  }

  importWeeklyReport() {
    this.weeklyRaportsIndexs.forEach((index) => {
      this.weeklyReports[index].financeId = 5;
    });

    this.tabActive = !this.tabActive;
    this.hideAllWRDropdowns();
  }

  getAllRows() {
    this.articleForm.controls.forEach((row) => {
      if (row.value.Id != "") {
        if(row.value.PaymentPlanId != "0"){
          this.isReadOnly = true;
        }
        if (this.rows.indexOf(row.value.Id) == -1) {
          this.rows.push({
            id: row.value.Id,
            AtaId: row.value.AtaId,
            MaterialId: row.value.MaterialId,
            ReportId: row.value.ReportId,
            AtaNumber: row.value.AtaNumber,
            Description: row.value.Description,
            DeliveredQuantity: row.value.DeliveredQuantity,
            Unit: row.value.Unit,
            Price: row.value.Price,
            Deduct: row.value.Deduct,
            Total: row.value.Total,
            week: row.value.week,
            MonthId: row.value.MonthId,
            PaymentPlanId: row.value.PaymentPlanId,
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


  isChecked(id, type, index = null, check = null) {

    if (type == 3) {
      return this.weeklyReportsNotInvoiced.find((x) => x.id == id).selected;
    }

    let checked = false;

    this.articleForm.controls.forEach((row) => {
      if (type == 1) {
        if (row.value.AtaId == id) {
          checked = true;
        }
      }
      if (type == 2) {
        if (row.value.MaterialId == id) {
          checked = true;
        }
      }
    });

    return checked;
  }

  checkAll(type, $event) {
    let checkboxes = document.getElementsByClassName(`${type}-checkbox`);
    if ($event.target.checked) {
      for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i]["checked"] == false) {
          const element = checkboxes[i] as undefined as HTMLElement;
          element.click();
        }
      }
    } else {
      for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i]["checked"] == true) {
          const element = checkboxes[i] as undefined as HTMLElement;
          element.click();
        }
      }
    }
  }

  getAtaRows($event, ata, articleFormIndex, toggleWeeklyReport = false) {
    this.clearEmptyRows();
    let value = false;

    if(toggleWeeklyReport) {
        value = $event;
    }else {
         value = $event.target.checked;
    }
    if (value == true) {
      let exists = false;

      let total = 0;
      let articleName = "";
      let weeklyReportsString = "";

      if (ata.PaymentType != 2 && ata.PaymentType != 3) {
        const filteredWeeklyReports = ata.weeklyReports.filter(
          (wr) => wr.includeInInvoice
        );
        filteredWeeklyReports.forEach(
          (wr) => (total += parseInt(wr.total ? wr.total : 0, 10))
        );
        weeklyReportsString = filteredWeeklyReports
          .map((wr) => wr.wrId)
          .join(",");
        let a = JSON.parse(JSON.stringify(this.createForm.value.articleForm));

        if (a.length - 1 >= articleFormIndex) {
          a[articleFormIndex].ReportId = weeklyReportsString;
          this.createForm.patchValue({
            articleForm: a,
          });
        }

        articleName =
          "ÄTA-" +
          ata.ataNumber +
          " " +
          this.displayWeeklyReportName(filteredWeeklyReports, ata.ataId);
      } else {
        articleName = "ÄTA-" + ata.ataNumber;
        total = ata.total;
      }
      for (let i = 0; i < this.articleForm.controls.length; i++) {
        if (this.articleForm.controls[i].value.AtaId == ata.ataId) {
          this.articleForm.controls[i].patchValue({
            Total: total,
            Price: total,
            Description: articleName,
          });
          exists = true;
        }
      }

      let restored = false;
      this.removedArticles.forEach((article, i) => {
        if (article.AtaId == ata.ataId) {
          restored = true;
          const restoredArticle = this.removedArticles.splice(i, 1)[0];
          this.articleForm.push(this.fb.group(restoredArticle));
        }
      });

      if (!exists && !restored) {
        this.addAta(ata.ataId, articleName, total, weeklyReportsString);
      }
    } else {

      this.articleForm.controls.forEach((row, i) => {
        if (row.value.AtaId == ata.ataId) {
          this.removedArticles.push(row.value);
          this.articleForm.controls.splice(i, 1);
        }
      });
    }

    this.clearEmptyRows();
    this.pushRow();
    this.pushRow();
    this.ensureSwithProjectIfNotExistData();
    this.allowAddData();
  }

  getWeeklyReportsRows(
    value,
    reportId,
    reportName,
    total,
    ataNumber,
    ataId,
    index,
    week
  ) {
    this.contentHasChanged = true;
    this.allowInvoiced = false;
    this.clearEmptyRows();
    if (value == true) {
      let exists = false;
      for (let i = 0; i < this.articleForm.controls.length; i++) {
        if (
          this.articleForm.controls[i].value.ReportId == reportId &&
          !this.articleForm.controls[i].value.AtaId
        ) {
          exists = true;
        }
      }
      let restored = false;
      this.removedArticles.forEach((article, i) => {
        if (article.ReportId == reportId && !article.AtaId) {
          restored = true;
          const restoredArticle = this.removedArticles.splice(i, 1)[0];
          this.articleForm.push(this.fb.group(restoredArticle));
        }
      });

      if (!exists && !restored) {
        this.process = true;
        this.weeklyReportsNotInvoiced[index].selected = true;
        this.addWeeklyReport(
          reportId,
          reportName,
          total,
          ataNumber,
          ataId,
          week
        );
        this.weeklyRaportsIndexs.push(index);
      }
    } else {
      this.articleForm.controls.forEach((row, i) => {
        if (
          row.value.ReportId == reportId &&
          !row.value.AtaId &&
          row.value.Id != ""
        ) {
          this.removedArticles.push(row.value);
          this.weeklyReportsNotInvoiced[index].selected = false;
        } else if (row.value.ReportIds == reportId && !row.value.AtaId) {
          this.removedArticles.push(row.value);
          this.articleForm.controls.splice(i, 1);
          this.weeklyReportsNotInvoiced[index].selected = false;
        }
      });
      this.process = false;
    }
    this.clearEmptyRows();
    this.pushRow();
    this.pushRow();
    this.allowAddData();
  }

  getPaymentPlanRows($event, month, index, key) {

    let value = $event.target.checked;

    month.checked = value;

    this.clearEmptyRows();

    if (value == true) {

      let exists = false;

      let articleName = "";
      let elementName = [];

      if(month.controls.articleKeys){
        month.controls.articleKeys.value.forEach((groupKey, i) => {
          month.controls.articles.value[groupKey].forEach((element, i) => {
            elementName.push(element.Name);
          });
        });
      }

    /*  let removed_index = this.removedPaymantArticles.findIndex((x) => x.id == this.paymentPlanForm_.controls[index].value.id);

      if(removed_index > -1) {
          this.removedPaymantArticles.splice((removed_index), 1);

      }*/

      articleName = month.controls.date.value + " " + elementName.toString();

      for (let i = 0; i < this.paymentPlanForm_.controls.length; i++) {
        if (this.paymentPlanForm_.controls[i].value.id == month.value.id) {
          this.articleForm.controls[i].patchValue({
            Total: month.value.total,
            Price: month.value.total,
            Description: articleName,
            MonthId: month.value.id,
            PaymentPlanId: month.value.paymentPlanId,
            DeliveredQuantity: 1,
            Unit: 'pieces',
            Deduct: 0
          });
          this.isReadOnly = true;
          exists = true;
        }

        if(index < this.paymentPlanForm_.controls.length-1){
          this.paymentPlanForm_.controls[index+1].enable();
        };
      }

      if (!exists) {
        this.addMonth(month.id, articleName, month.total, month.paymentPlanId);
      }

    } else {

        this.removedPaymantArticles.push(this.paymentPlanForm_.controls[index].value);
        this.articleForm.controls.splice((index), 1);
        this.paymentPlanForm_.controls.forEach((element, ind) => {

            if(ind >= index) {
                this.paymentPlanForm_.controls[ind].value.check = false;
                this.removedPaymantArticles.push(this.paymentPlanForm_.controls[ind].value);
                if(ind == index) {
                    this.paymentPlanForm_.controls[ind].enable();
                }else {
                    this.paymentPlanForm_.controls[ind].disable();
                }

                this.paymentPlanForm_.controls[ind].patchValue({
                    checkbox: false
                });

                let articleFormIndex = this.articleForm.controls.findIndex((x) => x.value.MonthId == this.paymentPlanForm_.controls[ind].value.id);
                if(articleFormIndex > - 1) {
                   this.articleForm.controls.splice((articleFormIndex), 1);
                }
            }
        });
    }
    this.clearEmptyRows();
    this.pushRow();
    this.pushRow();
  }

  addAta(id, name, total, weeklyReports) {
    this.pushAta(id, name, total, weeklyReports);
    this.process = false;
    this.atasForm.controls["ataSelected"].enable();
    this.clearEmptyRows();
    this.pushRow();
    this.pushRow();
    this.allowAddData();
  }

  addMonth(id, name, total, paymentPlanId) {
    this.pushMonth(id, name, total, paymentPlanId);
    this.process = false;
    this.clearEmptyRows();
    this.pushRow();
    this.pushRow();
    this.allowAddData();
  }

  addWeeklyReport(id, name, total, ataNumber, ataId, week) {
    this.clearEmptyRows();
    this.pushReprot(id, name, total, ataNumber, ataId, week);
    let sorted_data = this.sortedObject(this.articleForm.value, "week");
    this.articleForm.setValue(sorted_data);
    this.process = false;
    this.pushRow();
    this.pushRow();
  }

  sortedObject(objects, type) {
    return objects.sort((t1, t2) => {
      return t1[type] - t2[type];
    });
  }

  pushAta(id, name, total, weeklyReports) {
    let t = Number(total).toFixed(2);
    let ataNumber = name.split(" ")[0];
    ataNumber = Number(ataNumber.split("-")[1]);

    this.articleForm.push(
      this.fb.group({
        Id: "",
        AtaId: id,
        MaterialId: "",
        ReportId: weeklyReports,
        AtaNumber: ataNumber,
        Description: name,
        DeliveredQuantity: 1,
        Unit: "pieces",
        Price: t,
        Deduct: "",
        Total: t,
        MonthId: "",
        PaymentPlanId: "",
      })
    );
  }

  generateDURow(id, name, total, ataNumber, ataId, index) {
    const selectedWr = this.weeklyReportsNotInvoiced.filter((x) => x.selected);
    let totalwr = 0;
    let articleName = "";
    let weeklyReportsString = "";
    selectedWr.forEach(
      (wr) => (totalwr += parseFloat(wr.total ? wr.total : 0))
    );
    weeklyReportsString = selectedWr.map((wr) => wr.id).join(",");
    const weeks = selectedWr.map((x) => {
      return { week: x.name.substring(x.name.indexOf("-V") + 2) };
    });
    articleName =
      name.split(" ")[0] + " DU" + "-" + this.displayWeeklyReportName(weeks);

    this.articleForm.push(
      this.fb.group({
        Id: "",
        AtaId: ataId,
        MaterialId: "",
        ReportId: weeklyReportsString,
        AtaNumber: ataNumber,
        Description: articleName,
        DeliveredQuantity: 1,
        Unit: "pieces",
        Price: Number(totalwr).toFixed(2),
        Deduct: "",
        Total: Number(totalwr).toFixed(2),
      })
    );
  }

  pushReprot(id, name, total, ataNumber, ataId, week) {
    let t = Number(total).toFixed(2);
    this.articleForm.push(
      this.fb.group({
        AtaId: ataId,
        MaterialId: "",
        ReportId: id,
        AtaNumber: ataNumber,
        Description: name,
        DeliveredQuantity: 1,
        Unit: "pieces",
        Price: t,
        Deduct: "",
        Total: t,
        week: week,
        Id: null,
        MonthId: "",
        PaymentPlanId: "",
      })
    );
  }

  pushMonth(id, name, total, paymentPlanId) {
    let t = Number(total).toFixed(2);
    this.articleForm.push(
      this.fb.group({
        Id: "",
        AtaId: "",
        MaterialId: "",
        ReportId: "",
        AtaNumber: "",
        Description: name,
        DeliveredQuantity: 1,
        Unit: "pieces",
        Price: t,
        Deduct: "",
        Total: t,
        MonthId: id,
        PaymentPlanId: paymentPlanId,
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
          AtaNumber: "",
          Description: "",
          DeliveredQuantity: "0",
          Unit: "",
          Price: "0",
          Deduct: "0",
          Total: "0",
          week: "",
          MonthId: "",
          PaymentPlanId: "",
        })
      );
    } else {
      this.articleForm.push(
        this.fb.group({
          Id: "",
          AtaId: group.id,
          MaterialId: group.MaterialId,
          ReportId: group.ReportId,
          AtaNumber: group.AtaNumber,
          Description: group.Name,
          DeliveredQuantity: group.Quantity,
          Unit: group.Unit,
          Price: group.Price,
          Deduct: group.Deduct,
          Total: group.Total,
          week: group.week,
          MonthId: group.MonthId,
          PaymentPlanId: group.PaymentPlanId,
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
    this.allowAddData();
  }

  updateTotal(i, formGroup) {
    const Price = Number(
      formGroup.controls[i].value.Price.toString()
        .replace(/\s/g, "")
        .replace(",", ".")
    );
    const Quantity = Number(
      formGroup.controls[i].value.DeliveredQuantity.toString()
        .replace(/\s/g, "")
        .replace(",", ".")
    );

    let total = (
      Quantity *
      (Price * (formGroup.controls[i].value.Deduct / 100 + 1))
    ).toFixed(2);
    (<FormGroup>formGroup.controls[i]).controls["Total"].patchValue(total);
    this.ensureSwithProjectIfNotExistData();
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
    const control = formGroup.controls[index];
    const reportId = control.value.ReportId;
    const wr = this.weeklyReportsNotInvoiced.find((x) => x.id == reportId);
    wr ? (wr.selected = false) : "";

    if (formGroup.controls.length > 1) {
      if (formGroup.value[index].AtaId != "") {
        this.removedArticles.push(formGroup.value[index]);
      }
      formGroup.controls.splice(index, 1);
      formGroup.value.splice(index, 1);
    } else {
      formGroup.controls[0].setValue({
        Id: "",
        AtaId: "",
        MaterialId: "",
        ReportId: "",
        AtaNumber: "",
        Description: "",
        DeliveredQuantity: "",
        Unit: "",
        Price: "",
        Deduct: "",
        Total: "",
        week: "",
        MonthId: "",
        PaymentPlanId: "",
      });
    }
    this.ensureSwithProjectIfNotExistData();
    this.allowAddData();
  }

  validateForm() {
    let valid = false;

    this.articleForm.controls.forEach((row) => {
        if (row.get("Description").value != ""){
            valid = true;
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
      row.Price = Number(
        row.Price.toString().replace(/\s/g, "").replace(",", ".")
      );
      row.DeliveredQuantity = Number(
        row.DeliveredQuantity.toString().replace(/\s/g, "").replace(",", ".")
      );

      let amount = row.Total != "" ? row.Total : 0;
      total += parseFloat(amount);
    });

    data.total = total.toFixed(2);
    const valid = this.validateForm();

    data.removedArticles = this.removedArticles;
    data.removedPaymantArticles = this.removedPaymantArticles;
    data.paymentplanid = this.articleForm.controls[0].value.PaymentPlanId;
    data.isInvoiced = 0;

    if (valid) {
      this.invoiceService.updateInvoice(data).subscribe((res: any) => {
        if (res.status) {
          this.allowInvoiced = true;
          this.toastr.success(
            this.translate.instant("Successfully updated invoice."),
            this.translate.instant("Success")
          );
          this.router.navigate(["/invoices"]);
        }
      });
    }
  }

  ensureSwithProjectIfNotExistData() {
    const data = this.createForm.getRawValue();
    let articles = data.articleForm.filter((val) => val["Total"] != "");
    articles && articles.length > 0
      ? $(".invoice-select").prop("disabled", "disabled")
      : $(".invoice-select").prop("disabled", false);
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
      InvoiceID: this.invoice.Id,
      contentHasChanged: this.contentHasChanged,
      InvoiceRows: JSON.parse(JSON.stringify(this.articleForm.value)).map(
        (a) => {
          delete a.AtaId;
          if (a.AtaNumber > 0) {
            a.Project = this.project.CustomName + "-ÄTA" + a.AtaNumber;
          }
          delete a.AtaNumber;
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
        this.updateInvoice();
        this.router.navigate(["/invoices"]);
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

  finishInvoice() {
    if (this.invoice.Status == 6) {
      return;
    }

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

          data.removedArticles = this.removedArticles;
          data.paymentplanid = this.articleForm.controls[0].value.PaymentPlanId;
          data.isInvoiced = 1;

          if (valid) {
            this.invoiceService.updateInvoice(data).subscribe((res: any) => {
              if (res.status) {
                this.invoiceService.finishInvoice(data).subscribe((res) => {
                  if (res["status"]) {
                    this.invoice.Status = 6;
                    this.toastr.success(
                      this.translate.instant("Successfully invoiced invoice."),
                      this.translate.instant("Success")
                    );
                    this.router.navigate(["/invoices"]);
                  } else {
                    this.toastr.error(
                      this.translate.instant(
                        "There was an error while invoicing invoice."
                      ),
                      this.translate.instant("Error")
                    );
                  }
                });
              }
            });
          }
        }
      });
  }

  fillData() {
    this.createForm.patchValue({
      project: this.invoice.ProjectId,
      client: this.invoice.Client,
      invoiceDate: this.invoice.InvoiceDate,
      dueDate: this.invoice.DueDate,
      reference: this.invoice.Reference,
      reference_id: this.invoice.ReferenceId,
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
          AtaNumber: row.AtaNumber,
          Description: row.Name,
          DeliveredQuantity: row.DeliveredQuantity,
          Unit: row.Unit,
          Price: row.Price,
          Deduct: row.Deduct,
          Total: (
            Number(row.Price) *
            Number(row.DeliveredQuantity) *
            (Number(row.Deduct) / 100 + 1)
          ).toFixed(2),
          week: row.week,
          MonthId: row.MonthId,
          PaymentPlanId: row.PaymentPlanId,
        })
      );
    });

    this.pushRow();
    this.pushRow();
    if (this.createForm.value.invoiceDate) {
      $("#invoiceDate").datepicker(
        "setDate",
        this.createForm.value.invoiceDate.split(" ")[0]
      );
    }
    if (this.createForm.value.dueDate) {
      $("#dueDate").datepicker(
        "setDate",
        this.createForm.value.dueDate.split(" ")[0]
      );
    }
  }

  toggleWRDropdown(ata) {
    this.atasNotInvoiced = this.atasNotInvoiced.map((a) => {
      if (ata.ataId !== a.ataId) {
        a.wrOpened = false;
      }
      return a;
    });
    ata.wrOpened = !ata.wrOpened;
  }

  toggleWeeklyReport(ata, wr, atas) {

    wr.includeInInvoice = !wr.includeInInvoice;
    this.getAtaRows(
      atas.checked,
      ata,
      this.createForm.value.articleForm.findIndex((x) => x.AtaId == ata.ataId),
      true
    );
  }

  hideAllWRDropdowns() {
    this.atasNotInvoiced.forEach((ata) => {
      ata.wrOpened = false;
    });
  }

  getActivityProjects(projectId) {
    this.spinner = true;
    this.activityProjects = [];
    this.projectsService
      .getActivityProjects(projectId, this.setType)
      .then((res) => {
        if (res && res["status"]) {
          this.activityProjects = res["projects"];
          if (this.activityProjects.length > 0)
            this.existActivityProjects = true;
          else this.existActivityProjects = false;
        } else {
          this.existActivityProjects = false;
        }
        this.spinner = false;
      });
  }

  ngOnDestroy(): void {
    if (this.queryParSub) {
      this.queryParSub.unsubscribe();
    }
  }

  allowAddData() {
    let count = 0;
    let atas = 0;
    let projects = 0;
    let paymentplan = 0;

    this.articleForm.value.forEach((row, i) => {
      if (row.Description != "") {
        count += 1;

        if (row.AtaId) {
          atas += 1;
        } else if (row.ReportId) {
          projects += 1;
        } else if (row.PaymentPlanId) {
          paymentplan += 1;
        } else {
          this.disableOngoing = true;
          this.disablePaymentPlan = true;
          this.disableAta = true;
        }
      }
    });

    if (atas > 0) {
      this.disableOngoing = true;
      this.disablePaymentPlan = true;
      this.disableAta = false;
    }

    if (projects > 0) {
      this.disableOngoing = false;
      this.disablePaymentPlan = true;
      this.disableAta = true;
    }

    if (paymentplan > 0) {
      if(this.articleForm.value[0].PaymentPlanId != ''){
        this.count = this.articleForm.value.filter(item => item.Description !== '').length;
      }

      this.disableOngoing = true;
      this.disablePaymentPlan = false;
      this.disableAta = true;
    }

    if (!count) {
      this.disableOngoing = false;
      this.disablePaymentPlan = false;
      this.disableAta = false;
    }
  }

  toggleselectOpen() {
    this.selectOpen = !this.selectOpen;
  }

   openModal(ata) {

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "100%";
    diaolgConfig.data = {comments: ata.ata_comments };
    this.dialog.open(CommentsModalComponent, diaolgConfig);
   }




   /**
    *     Code za confirm modal
    */

   onUpdateButtonClicked() {
    this.isUpdateClicked = true;
   }

  onConfirmationModal(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.disableClose = true;
      dialogConfig.width = "185px";
      dialogConfig.panelClass = "confirm-modal";
      this.dialog.open(ConfirmModalComponent, dialogConfig).afterClosed().subscribe((response) =>  {
        if(response.result) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }


  canDeactivate(): Promise<boolean> | boolean {
    if(!this.isUpdateClicked) {
      if(this.createForm.dirty && this.createForm.valid) {
        this.appComponent.loading = false;
        return this.onConfirmationModal();
      } else {
        return true;
      }
    } else {
      return true;
    }

  }

   /**--------------------------------- */
}
