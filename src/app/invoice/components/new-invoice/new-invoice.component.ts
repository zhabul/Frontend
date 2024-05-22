import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormArray, NgForm, FormControl } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { AtaService } from "src/app/core/services/ata.service";
import { InvoicesService } from "src/app/core/services/invoices.service";
import { ProjectsService } from "../../../core/services/projects.service";
import { ClientsService } from "../../../core/services/clients.service";
import { PaymentPlanService } from "src/app/core/services/payment-plan.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { CommentsModalComponent } from "src/app/shared/modals/comments-modal/comments-modal.component";

declare var $;

@Component({
  selector: "app-new-invoice",
  templateUrl: "./new-invoice.component.html",
  styleUrls: ["./new-invoice.component.css"],
})
export class NewInvoiceComponent implements OnInit {
  @ViewChild("myform", { static: true }) myform!: NgForm;
  public project;
  public clients;
  public client;
  public materialProperties;
  public units;
  public atas = [];
  public createForm: FormGroup;
  public articleFormCopy: any[];
  public atasForm: FormGroup;
  public materialsForm: FormGroup;
  public weeklyReportsForm: FormGroup;
  public paymentPlanForm: FormGroup;
  public process = false;
  public projects = [];
  public references = [];
  public types = ["Invoice", "Credit Invoice"];
  public tabActive = false;
  public supplierInvoices;
  public supplierInvoicesByProject = [];
  public hours = [];
  public att;
  public paymentPlans = [];
  public paymentplanid;
  public paymentPlansRows: any[] = [];
  public weeklyReports = [];
  public selectedTab: any = 0;
  public weeklyReportsInvoiced: any[] = [];
  public weeklyReportsNotInvoiced: any[] = [];
  public paymentPlansInvoiced: any[] = [];
  public paymentPlansNotInvoiced: any[] = [];
  public atasInvoiced: any[] = [];
  public atasNotInvoiced: any[] = [];
  public activityProjects: any[] = [];
  public existActivityProjects: boolean = false;
  public spinner: boolean = false;
  public disabledButton: boolean = false;
  public userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  public disableOngoing = false;
  public disablePaymentPlan = false;
  public disableAta = false;
  isReadOnly: boolean = false;
  public count;

  get articleForm() {
    return this.createForm.get("articleForm") as FormArray;
  }

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private translate: TranslateService,
    private toastr: ToastrService,
    private router: Router,
    private ataService: AtaService,
    private projectsService: ProjectsService,
    private invoiceService: InvoicesService,
    private clientsService: ClientsService,
    private paymentplanService: PaymentPlanService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.projects = this.route.snapshot.data["projects"].data.map((project) => {
      project["finalName"] = `${project["CustomName"]} - ${project["name"]}`;
      return project;
    });
    this.initializeUser();
    this.clients = this.route.snapshot.data["clients"].data;
    this.materialProperties = this.route.snapshot.data["materialProperties"];
    this.units = this.route.snapshot.data["units"];

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




    this.createForms();

    $("#invoiceDate")
      .datepicker({
        format: "yyyy-mm-dd",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true,
        currentWeek: true,
        currentWeekTransl: this.translate.instant("Week"),
        currentWeekSplitChar: "-",
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
        autoclose: true,
        currentWeek: true,
        todayHighlight: true,
        currentWeekTransl: this.translate.instant("Week"),
        currentWeekSplitChar: "-",
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

  createForms() {
    this.createForm = this.fb.group({
      project: ["", Validators.required],
      project_name: ["", Validators.required],
      activity: [""],
      client: [{ value: "", disabled: true }, Validators.required],
      invoiceDate: ["", Validators.required],
      dueDate: [""],
      reference: [this.userDetails.user_id, Validators.required],
      reference_name: [
        this.userDetails.firstname + " " + this.userDetails.lastname,
        Validators.required,
      ],
      type: [this.types[0], Validators.required],
      note1: [""],
      note2: [""],
      articleForm: this.fb.array([
        this.fb.group({
          ataId: "",
          MaterialId: "",
          ReportIds: "",
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
        }),
        this.fb.group({
          ataId: "",
          MaterialId: "",
          ReportIds: "",
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
        }),
      ]),
    });
  }

  getProject(project, activity = null) {
    const projectId = project.value;
    if (projectId !== "-1") {
      this.initializeUser();
      this.projectsService.getProject(projectId).then((project) => {
        this.project = project;
        this.createForm.get("client").patchValue(project.clientName);
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
      });
      this.getAtas(projectId);
      this.getWeeklyReports(projectId);
      this.getPaymentPlan(projectId);
      this.clearRows();
      this.pushRow();
      this.pushRow();
    } else {
      this.createForm.get("client").patchValue("");
      this.disabledButton = true;
      this.activityProjects = [];
      this.atasForm.controls["ataSelected"].patchValue(false);
      this.atas = [];
      this.weeklyReports = [];
    }
  }

  getFinalResultForAtaBtn(): boolean {
    if((this.atasNotInvoiced.length == 0 && this.atasInvoiced.length == 0) ||
      this.disabledButton || this.disableAta) return true;
    return false;
  }

  getFinalResultForWeeklyBtn(): boolean {
    if((this.weeklyReportsNotInvoiced.length == 0 && this.weeklyReportsInvoiced.length == 0)
      || this.disabledButton || this.disableOngoing) return true;
    return false;
  }

  getFinalResultForPaymentBtn(): boolean {
    if(this.paymentPlans.length == 0 || this.disabledButton
      || this.disablePaymentPlan) return true;
    return false;
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

  getAtas(projectId) {
    this.atasForm.controls["ataSelected"].patchValue(false);
    this.atas = [];

    this.ataService.getAllAtasForInvoice(projectId, true).subscribe((res: any) => {
      if (res.status) {
        const resDataCopy = JSON.parse(JSON.stringify(res.data));
        const resDataCopy2 = JSON.parse(JSON.stringify(res.data));

        this.atasNotInvoiced = resDataCopy2
          .map((ata) => {
            if (ata.PaymentType != 2 && ata.PaymentType != 3) {
              ata.weeklyReports = ata.weeklyReports.filter(
                (wr) => wr.financeId == 0
              );
              return ata.weeklyReports.length > 0 ? ata : null;
            } else if (ata.PaymentType == 2 || ata.PaymentType == 3) {
              return ata.financeId == 0 ? ata : null;
            } else {
              //return ata;
            }
          })
          .filter((ata) => ata != null);

        this.atasInvoiced = resDataCopy
          .map((ata) => {
            if (ata.PaymentType != 2 && ata.PaymentType != 3) {
              ata.weeklyReports = ata.weeklyReports.filter(
                (wr) => wr.financeId != 0
              );

              return ata.weeklyReports.length > 0 ? ata : null;
            } else if (ata.PaymentType == 2 || ata.PaymentType == 3) {
              return ata.financeId != 0 ? ata : null;
            } else {
              //return ata;
            }
          })
          .filter((ata) => ata != null);
      }
    });
  }

  get paymentPlanForm_() {
    return this.paymentPlanForm.get("paymentPlans") as FormArray;
  }

  getPaymentPlan(projectId) {
    this.paymentPlans = [];
    this.paymentplanService
      .getAcceptedPaymentPlan(projectId)
      .subscribe((reports) => {
        this.paymentplanid =
          reports["data"].length != 0 ? reports["data"][0].ID : "";

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

        let disabled = false;
        this.paymentPlansNotInvoiced.forEach((plan, index)=>{

          const total = plan.total ? plan.total : 0;

          this.paymentPlanForm_.push(this.fb.group({

            date: new FormControl({ value: plan.date, disabled: disabled }),
            checkbox: new FormControl({ value: false, disabled: disabled }),
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

      });

  }

  getWeeklyReports(projectId) {
    this.weeklyReports = [];
    this.invoiceService.getWeeklyReports(projectId).subscribe((reports) => {
      this.weeklyReports = reports["data"] || [];
      this.weeklyReportsNotInvoiced = this.weeklyReports
        .filter(
          (report) =>
            report.status != 5 && report.previously_added_but_not_invoiced == 0
        )
        .map((report) => {
          report["selected"] = false;
          return report;
        });
      this.weeklyReportsInvoiced = this.weeklyReports.filter(
        (report) => report.status == 5
      );
    });
  }

  displayWeeklyReportName(weeklyReports, ata_id = 0) {
    let inOrder = true;

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

  onBackFromListInovice() {
    this.clearRows();

    this.articleFormCopy.forEach((x, index) => {
      if( x.PaymentPlanId != ""){
        for (let i = this.articleFormCopy.length-2; i < this.paymentPlanForm_.controls.length+1; i++) {
          if(i < this.paymentPlanForm_.controls.length){
            this.paymentPlanForm_.controls[i].disable();
            this.paymentPlanForm_.controls[i].patchValue({
              checkbox: false
            })
           }

        }
        this.paymentPlanForm_.controls[this.articleFormCopy.length-2].enable();
      }

      this.articleForm.push(this.fb.group(x));
    });

    this.isTab();
  }

  allowAddData() {
    let count = 0;
    this.articleForm.value.forEach((row, i) => {
      if (row.Description != "") {
        count += 1;
        if (row.ataId) {
          this.disableOngoing = true;
          this.disablePaymentPlan = true;
          this.disableAta = false;
        } else if (row.ReportIds) {
          this.disableOngoing = false;
          this.disablePaymentPlan = true;
          this.disableAta = true;
        }else {
          this.disableOngoing = true;
          this.disablePaymentPlan = true;
          this.disableAta = true;
        }
      }
    });

    if(this.paymentPlanForm_){

      if(this.articleForm.value[0].PaymentPlanId != ''){
        this.count = this.articleForm.value.filter(item => item.Description !== '').length;
      }

      this.paymentPlanForm_.value.forEach((row, i) => {
        if (row.Description != "") {
          count += 1;
          if (row.paymentPlanId) {
            this.disableOngoing = true;
            this.disablePaymentPlan = false;
            this.disableAta = true;
          }
        }
      });
    }

    if (!count) {
      this.disableOngoing = false;
      this.disablePaymentPlan = false;
      this.disableAta = false;
    }
  }

  isTab() {
    this.copyArticleForm();
    this.tabActive = !this.tabActive;
    this.selectedTab = 0;
    this.hideAllWRDropdowns();
    this.allowAddData();
  }

  copyArticleForm() {
    let articleFormValue = (this.createForm.get("articleForm") as FormArray)
      .value;

    this.articleForm.controls = this.articleForm.controls.sort(function (
      a_,
      b_
    ) {
      const a = a_.value;
      const b = b_.value;

      if (a && a.AtaNumber && b && b.AtaNumber) {
        const ataNumber = a.AtaNumber.split(" ")[0];
        const bataNumber = b.AtaNumber.split(" ")[0];

        const aNumber = Number(ataNumber.split("-")[1]);
        const bNumber = Number(bataNumber.split("-")[1]);

        return aNumber - bNumber;
      }
    });

    this.articleFormCopy = JSON.parse(JSON.stringify(articleFormValue));

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

  getAtaRows(value, ata) {
    this.clearEmptyRows();
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
          (wr) => (total += parseFloat(wr.total ? wr.total : 0))
        );
        weeklyReportsString = filteredWeeklyReports
          .map((wr) => wr.wrId)
          .join(",");
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
        if (this.articleForm.controls[i].value.ataId == ata.ataId) {
          this.articleForm.controls[i].patchValue({
            Total: total,
            Price: total,
            Description: articleName,
            ReportIds: weeklyReportsString,
            AtaNumber: articleName,
          });
          exists = true;
        }
      }

      if (!exists) {
        this.addAta(ata.ataId, articleName, total, weeklyReportsString);
      }
    } else {
      this.articleForm.controls.forEach((row, i) => {
        if (row.value.ataId == ata.ataId) {
          this.articleForm.controls.splice(i, 1);
        }
      });
    }

    this.clearEmptyRows();
    this.pushRow();
    this.pushRow();
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
    this.clearEmptyRows();

    if (value == true) {
      let exists = false;
      for (let i = 0; i < this.articleForm.controls.length; i++) {
        if (this.articleForm.controls[i].value.ataId == reportId) {
          exists = true;
        }
      }
      if (!exists) {
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
      }
    } else {
      this.articleForm.controls.forEach((row, i) => {
        if (row.value.ReportIds == reportId) {
          this.articleForm.controls.splice(i, 1);
          this.weeklyReportsNotInvoiced[index].selected = false;
        }
        /*
        else if(row.value.ReportIds.split(',').includes(reportId)){
          this.articleForm.controls.splice(i, 1);
          this.weeklyReportsNotInvoiced[index].selected = false;
          this.generateDURow(reportId, reportName, total, ataNumber, ataId, index);
        }
        */
      });
      this.clearEmptyRows();
      this.pushRow();
      this.pushRow();
      this.process = false;
    }
  }

  public monthLoaded = {

  }


  getPaymentPlanRows(value, month,index, key) {
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

      for (let i = index; i < this.paymentPlanForm_.controls.length+1; i++) {
        if(i < this.paymentPlanForm_.controls.length-1){
          this.paymentPlanForm_.controls[i+1].disable();
          this.paymentPlanForm_.controls[i+1].patchValue({
            checkbox: false
          })
          if(this.paymentPlanForm_.controls[i].value.checkbox == false){
            this.articleForm.controls.splice((index), 1);
            this.articleForm.controls.splice((index+1), 1);
          }
        }
      }
    }
    this.clearEmptyRows();
    this.pushRow();
    this.pushRow();
  }

  addAta(id, name, total, weeklyReports) {
    this.pushAta(id, name, total, weeklyReports);
    this.process = false;
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

  addMonth(id, name, total, paymentPlanId) {
    this.pushMonth(id, name, total, paymentPlanId);
    this.process = false;
    // this.clearEmptyRows();
    // this.pushRow();
    // this.pushRow();
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
      return { revision: x.name.substring(x.name.indexOf("-V") + 2) };
    });
    articleName =
      name.split(" ")[0] + " DU" + "-" + this.displayWeeklyReportName(weeks);

    this.articleForm.push(
      this.fb.group({
        AtaId: ataId,
        MaterialId: "",
        ReportIds: weeklyReportsString,
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

  pushAta(id, name, total, weeklyReports) {

    let t = Number(total).toFixed(2);
    this.articleForm.push(
      this.fb.group({
        ataId: id,
        MaterialId: "",
        ReportIds: weeklyReports,
        AtaNumber: name,
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

  pushReprot(id, name, total, ataNumber, ataId, week) {
    let t = Number(total).toFixed(2);
    this.articleForm.push(
      this.fb.group({
        ataId: ataId,
        MaterialId: "",
        ReportIds: id,
        AtaNumber: ataNumber,
        Description: name,
        DeliveredQuantity: 1,
        Unit: "pieces",
        Price: t,
        Deduct: "",
        Total: t,
        week: week,
        MonthId: "",
        PaymentPlanId: "",
      })
    );
  }

  pushMonth(id, name, total, paymentPlanId) {
    let t = Number(total).toFixed(2);
    this.articleForm.push(
      this.fb.group({
        ataId: "",
        MaterialId: "",
        ReportIds: "",
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

  isChecked(id, type) {
    if (type == 3) {
      return this.weeklyReportsNotInvoiced.find((x) => x.id == id).selected;
    }

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
      if (type == 4) {
        if (row.value.MonthId == id) {
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

  pushRow() {
    this.articleForm.push(
      this.fb.group({
        ataId: "",
        MaterialId: "",
        ReportIds: "",
        AtaNumber: "",
        Description: "",
        DeliveredQuantity: "",
        Unit: "",
        Price: "",
        Deduct: "",
        Total: "",
        MonthId: "",
        PaymentPlanId: "",
      })
    );
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
  }

  invoiceTotalAmount() {
    let total = 0;

    this.articleForm.controls.forEach((row, i) => {
      let amount = row.value.Total != "" ? row.value.Total : 0;
      total += parseFloat(amount);
    });
    return total.toFixed(2);
  }

  removeRow(index, formGroup) {
    const control = formGroup.controls[index];
    const reportId = control.value.ReportIds;
    const wr = this.weeklyReportsNotInvoiced.find((x) => x.id == reportId);
    wr ? (wr.selected = false) : "";

    if (formGroup.controls.length > 1) {
      formGroup.controls.splice(index, 1);
      formGroup.value.splice(index, 1);
      this.paymentPlanForm_.controls[index+1].disable();
    } else {
      formGroup.controls[0].setValue({
        AtaId: "",
        MaterialId: "",
        ReportIds: "",
        AtaNumber: "",
        Description: "",
        DeliveredQuantity: "",
        Unit: "",
        Price: "",
        Deduct: "",
        Total: "",
        MonthId: "",
        PaymentPlanId: "",
      });
    }
    this.allowAddData();
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

  createInvoice() {
    const data = this.createForm.getRawValue();

    if (this.createForm.invalid) {
      setTimeout(() => {
        document.querySelector(".is-invalid").scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }, 1);
      return;
    }

    let total = 0;
    data.projectName = this.project.name;
    data.clientId = this.project.client_id;
    data.paymentplanid = this.articleForm.controls[0].value.PaymentPlanId;

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

    if (valid) {
      this.invoiceService.addNewInvoice(data).subscribe((res) => {
        if (res.status) {
          this.toastr.success(
            this.translate.instant("Successfully created invoice."),
            this.translate.instant("Success")
          );
          this.router.navigate(["/invoices"]);
        }
      });
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

  toggleWeeklyReport(ata, wr) {
    wr.includeInInvoice = !wr.includeInInvoice;
    this.getAtaRows(this.atasForm.get("ataSelected").value, ata);
  }

  hideAllWRDropdowns() {
    this.atasNotInvoiced.forEach((ata) => {
      ata.wrOpened = false;
    });
  }

  getActivityProjects(projectId) {
    this.spinner = true;
    this.disabledButton = true;
    this.activityProjects = [];
    this.projectsService.getActivityProjects(projectId, "New").then((res) => {
      if (res && res["status"]) {
        this.activityProjects = res["projects"];

        if (this.activityProjects.length > 0) this.existActivityProjects = true;
        else this.existActivityProjects = false;
      } else {
        this.existActivityProjects = false;
      }
      this.spinner = false;
      this.disabledButton = false;
    });
  }

  displayError(input: string) {
    const control = this.createForm.get(input);

    return (
      (this.myform.submitted && control.invalid) ||
      (control.dirty && control.invalid)
    );
  }

  displayErrorObj(input: string, type: string) {
    const control = this.createForm.get(input);
    let err = false;

    if (control.errors) {
      if (type === "required") {
        err = control.errors.required;
      }

      if (type === "pattern") {
        err = control.errors.pattern;
      }

      if (type === "email") {
        err = control.errors.email;
      }
    }

    return err;
  }

   openModal(ata) {

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "100%";
    diaolgConfig.data = {comments: ata.ata_comments };
    this.dialog.open(CommentsModalComponent, diaolgConfig);
   }

}
