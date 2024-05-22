import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { InvoicesModalComponent } from "../invoices-modal/invoices-modal.component";
import { NewBillService } from "./new-bill.service";
import { Subscription } from "rxjs";
import * as moment from "moment";
import { ActivatedRoute, Router } from "@angular/router";
import { AtaService } from "src/app/core/services/ata.service";
import { ProjectsService } from "src/app/core/services/projects.service";
import { InvoicesService } from "src/app/core/services/invoices.service";
import { ClientsService } from "src/app/core/services/clients.service";
import { PaymentPlanService } from "src/app/core/services/payment-plan.service";
import { NewBillWeeklyModalComponent } from "./new-bill-weekly-modal/new-bill-weekly-modal.component";
import { NewBillAtaModalComponent } from "./new-bill-ata-modal/new-bill-ata-modal.component";
import { NewBillPaymentModalComponent } from "./new-bill-payment-modal/new-bill-payment-modal.component";
declare var $;

@Component({
  selector: "app-new-bill",
  templateUrl: "./new-bill.component.html",
  styleUrls: ["./new-bill.component.css"],
})
export class NewBillComponent implements OnInit, OnDestroy, AfterViewInit {
  public addAtaColor = "#858585";
  public addwrColor = "#858585";
  public addPaymentColor = "#858585";
  public sendEconomy = "#858585";
  public dellete = "#858585";
  public projects;
  public referencesOfProject = [];
  public weeklyReports: any = [];
  public selectedWeeklyReports: any = [];
  public language = "en";
  public week = "Week";

  public name = "";
  public resursKonto1 = "";
  public clientProjectNumber = "";
  public markningskrav = "";
  public project;
  public invoiceDate;
  public maturityDate;
  public needToWriteOnPaymentTerms: string = "Betalningsvillkor";
  public loadingSpinner: boolean = false;

  public checkedArr = [];
  public checkedProjecName: boolean = false;
  public checkedProjectNumber: boolean = false;
  public checkedProjectKonto: boolean = false;
  public checkedMarkningskrav: boolean = false;
  public projectClientNames = [];
  public projectClientName: string = "";
  public isInvoiceDateSelected: boolean = false;

  public selectedProject; /*Selektovani projekat*/
  public selectedReference; /*Selektovane reference - odgovorni na projektu */
  public weeklyReportForInvoice: any = [];
  public weeklyReport: any = [];
  public renderDataInTable: any = [];

  public allProjectsSubscriber: Subscription = new Subscription();
  public allReferencesSubscriber: Subscription = new Subscription();
  public allProjectClientNamesSubscription: Subscription = new Subscription();
  public allweeklyReports: Subscription = new Subscription();
  public weeklyReportSub: Subscription = new Subscription();
  public createForm: FormGroup;
  public removedArticles:any[] = [];
  public visible_markningskrav_check:boolean = true;
  public sumOfArrearsChecked;number = 0;
  public total_of_final_invoices:number = 0;
  public all_invoiced_total_of_final_invoices:boolean = false;
  public paylment_is_checked :boolean = false;
  public final_invoice;
  public enabledAccounts;
  currency = JSON.parse(sessionStorage.getItem("currency"));
  public ataSpinner:boolean = false;
  public weeklyReportSpinner:boolean = false;
  public paymentPlanSpinner:boolean = false;


  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private newBillService: NewBillService,
    private router: Router,
    private route: ActivatedRoute,
    private ataService: AtaService,
    private projectsService: ProjectsService,
    private invoiceService: InvoicesService,
    private clientsService: ClientsService,
    private paymentplanService: PaymentPlanService
  ) {
    this.language = sessionStorage.getItem("lang");
    if (this.language == "en") this.week = "Week";
    else this.week = "Vecka";
  }

  ngOnInit(): void {

    const allow_invoice = Number(this.userDetails.create_invoices_Global);
    if(!allow_invoice) {
        this.router.navigate(["home"]);
    }
    if(!this.currency) {
        this.currency = 'SEK';
    }
    this.createForms();
    /* this.getAllProjects(); */
    this.projects = this.route.snapshot.data["projects"].data.map((project) => {
      project["finalName"] = `${project["CustomName"]} - ${project["name"]}`;
      project["clientsProjectName"] = "some clientProjectName";
      return project;
    });

    this.clients = this.route.snapshot.data["clients"].data;
    this.materialProperties = this.route.snapshot.data["materialProperties"];
    this.units = this.route.snapshot.data["units"];
    this.enabledAccounts = this.route.snapshot.data["enabledAccounts"];

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

      const weekNumber = moment().isoWeek() + 1;
      this.invoiceDate = moment().format("YYYY-MM-DD") + " Week " + weekNumber;

    $("#dateSelectInvoiceDate")
      .datepicker({
        format: "yyyy-mm-dd",
        calendarWeeks: true,
        autoclose: true,
        language: this.language,
        todayHighlight: true,
        currentWeek: true,
        currentWeekTransl: this.week,
        currentWeekSplitChar: "-",
        weekStart: 1
      })
      .on("changeDate", (ev) => {
        this.createForm.get("invoiceDate").patchValue(ev.target.value);
        this.invoiceDate = ev.target.value;
      });

    $("#dateSelectMaturityDate")
      .datepicker({
        format: "yyyy-mm-dd",
        calendarWeeks: true,
        autoclose: true,
        language: this.language,
        todayHighlight: true,
        currentWeek: true,
        currentWeekTransl: this.week,
        currentWeekSplitChar: "-",
        enableOnReadonly: false,
        weekStart: 1
      })
      .on("changeDate", (ev) => {
        this.createForm.get("maturityDate").patchValue(ev.target.value);
        this.maturityDate = ev.target.value;
      });
  }

  ngAfterViewInit(): void {
    $("#dateSelectInvoiceDate")
      .datepicker({
        format: "yyyy-mm-dd",
        weekStart: 1,
        calendarWeeks: true,
        autoclose: true,
        language: this.language,
        currentWeek: true,
        todayHighlight: true,
        currentWeekTransl: this.week,
        currentWeekSplitChar: "-",
      })
      .on("changeDate", (ev) => {
        this.createForm.get("invoiceDate").patchValue(ev.target.value);
        this.invoiceDate = ev.target.value;
        this.isInvoiceDateSelected = true;

        if (
          this.createForm.get("invoiceDate").value &&
          this.createForm.get("maturityDate").value
        ) {
          const diffDays = this.getDateDifference(
            this.createForm.get("invoiceDate").value,
            this.createForm.get("maturityDate").value
          );
          if (this.whatNeedToBePaymentTerms(diffDays))
            this.needToWriteOnPaymentTerms =
              this.whatNeedToBePaymentTerms(diffDays);
        }
      })
      .on("blur", (e) => {
        e.target.value = this.createForm.value.invoiceDate;
      });

    $("#dateSelectInvoiceDate").datepicker("setDate", new Date());

    $("#dateSelectMaturityDate")
      .datepicker({
        format: "yyyy-mm-dd",
        weekStart: 1,
        calendarWeeks: true,
        autoclose: true,
        language: this.language,
        currentWeek: true,
        todayHighlight: true,
        currentWeekTransl: this.week,
        currentWeekSplitChar: "-",
      })
      .on("changeDate", (ev) => {
        if (!this.createForm.get("invoiceDate").value) {
          this.toastr.info(this.translate.instant("Please select Invoice Date first"));
          this.createForm.get("maturityDate").patchValue("");
          return;
        }
        if (
          this.compareDates(
            this.createForm.get("invoiceDate").value,
            ev.target.value
          )
        ) {
          this.toastr.info("Maturity Date cannot be after Invoice Date");
          this.createForm.get("maturityDate").patchValue("");
          return;
        }

        this.createForm.get("maturityDate").patchValue(ev.target.value);
        this.maturityDate = ev.target.value;

        if (
          this.createForm.get("invoiceDate").value &&
          this.createForm.get("maturityDate").value
        ) {
          const diffDays = this.getDateDifference(
            this.createForm.get("invoiceDate").value,
            this.createForm.get("maturityDate").value
          );
          if (this.whatNeedToBePaymentTerms(diffDays))
            this.needToWriteOnPaymentTerms =
              this.whatNeedToBePaymentTerms(diffDays);
        }
      })
      .on("blur", (e) => {
        e.target.value = this.createForm.value.maturityDate;
      });

    $("#dateSelectMaturityDate").datepicker();
  }

  getAllProjects() {
    this.allProjectsSubscriber = this.newBillService
      .getAllProjects()
      .subscribe({
        next: (projects) => (this.projects = projects),
      });
  }

  emitedSelectedProject(project) {
    if (project.length == 0) return;
    this.paymentPlanArray = [];
    this.weeklyReportsNotInvoiced = [];
    this.atasNotInvoiced = [];
    this.paymentPlans = [];

    if (project.id !== "-1") {

      this.loadingSpinner = true;
      this.projectsService.getProject(project.id).then((project) => {
        this.setInitialValueForFields(project);
        this.selectedProject = project;
        //this.loadingSpinner = false;
      });

      this.renderDataInTable = [];
      this.whichBtnIsSelected.ata = false;
      this.whichBtnIsSelected.payment = false;
      this.whichBtnIsSelected.weekly = false;
      this.totalSum = 0;
      this.markningskrav = '';
      this.getAtas(project.id);
      this.getWeeklyReports(project.id);
      this.getPaymentPlan(project.id);
      this.clearRows();
      this.pushRow();
      this.emptyCheckedArr();
    }
  }

  emitSelectedClientName(projectId) {
    if (!projectId) {
      this.newBillService.setSelectedProjectClientName(null);
      return;
    }
    const clientName = this.projectClientNames.find((clientName) => {
      return clientName.projectId == projectId;
    });

    this.newBillService.setSelectedProjectClientName(clientName);
  }

  /* emitExistATA_WR_PP(projectId){
      if(!projectId) {

        this.newBillService.setSelectedProjectWeeklyReportForInvoices(null)
        return;
      }
      const projectIds = this.selectedWeeklyReports.find(weeklyReports => {
        return weeklyReports.project_id == projectId
      })

       projectIds.wr_for_invoice.forEach(element => {
        if(element.financeId == '0' && element.previously_added_but_not_invoiced == '0'){
           this.weeklyReportForInvoice.push(element);
        }
      });

      if( this.weeklyReportForInvoice.length > 0){
        this.addwrColor = 'var(--project-color)';
      }
      else{
        this.addwrColor = '#858585';
      }


      this.invoicesModalService.setWeeklyReportChecked(this.weeklyReportForInvoice);
    } */

  emptyCheckedArr() {
    this.checkedArr = [];
    this.checkedProjectNumber = false;
    this.checkedProjecName = false;
    this.checkedProjectKonto = false;
    this.checkedMarkningskrav = false;
    this.weeklyReportForInvoice = [];
    this.addwrColor = "#858585";
  }

  changeEmitedDate() {
    this.createForm
      .get("clientsProjectName")
      .setValue(this.selectedProject.finalName);
    this.createForm
      .get("clientProjectNumber")
      .setValue(this.selectedProject.clientProjectNumber);
    this.createForm
      .get("resursKonto1")
      .setValue(this.selectedProject.resursKonto1);
    this.createForm
      .get("markningskrav")
      .setValue(this.selectedProject.markningskrav);
  }

  showDataInTable(isChecked, type) {
    isChecked = !isChecked;
    if (isChecked && type == "clientsProjectName") {
      this.checkedArr.push({
        id: 1,
        ProjectNumber:
          this.translate.instant("Projektnamn") +
          ": " +
          this.createForm.get('clientsProjectName').value,
        type: 'projectName'
      });
      this.checkedProjecName = true;
    }
    if (!isChecked && type == "clientsProjectName") {
      this.checkedArr = this.checkedArr.filter((item) => item.id != 1);
      this.checkedProjecName = false;
    }
    if (isChecked && type == "checkProjectNumber") {
      this.checkedArr.push({
        id: 2,
        ProjectNumber:
          this.translate.instant("Projektnummer") +
          ": " +
          this.selectedProject.clientProjectNumber,
        type: 'projectNumber'
      });
      this.checkedProjectNumber = true;
    }
    if (!isChecked && type == "checkProjectNumber") {
      this.checkedArr = this.checkedArr.filter((item) => item.id != 2);
      this.checkedProjectNumber = false;
    }

    if (isChecked && type == "resursKonto1") {
      this.checkedArr.push({
        id: 3,
        ProjectNumber:
          this.translate.instant("Resurskonto") +
          ": " +
          this.selectedProject.resursKonto1,
        type: 'resursKonto1'
      });
      this.checkedProjectKonto = true;
    }
    if (!isChecked && type == "resursKonto1") {
      this.checkedArr = this.checkedArr.filter((item) => item.id != 3);
      this.checkedProjectKonto = false;
    }

    if (isChecked && type == 'markningskrav') {

      this.checkedArr.push({
        id: 4,
        ProjectNumber:
          this.translate.instant('Märkningskrav') +
          ': ' +
          this.markningskrav,
        type: 'marking'
      });
      this.createForm.get('markningskrav').patchValue(this.markningskrav);
      this.checkedMarkningskrav = true;
    }
    if (!isChecked && type == "markningskrav") {

      this.checkedArr = this.checkedArr.filter((item) => item.id != 4);
      this.checkedMarkningskrav = false;
      this.createForm.get('markningskrav').patchValue('');
    }
    this.checkedArr = this.checkedArr.sort((a, b) => a.id - b.id);
  }

  emitedSelectedReference(reference) {
    this.selectedReference = reference;
    this.newBillService.setSelectedReference(reference);
    this.createForm.get("reference").patchValue(reference.Id);
    this.createForm.get("reference_name").patchValue(reference.finalName);
  }

  get articleForm() {
    return this.createForm.get("articleForm") as FormArray;
  }

  openInvoicesModal(type) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.data = {
      data: { type: type },
    };
    diaolgConfig.panelClass = "invoiceModal";
    this.dialog
      .open(InvoicesModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.renderDataInTable = response;
          this.toastr.success(
            this.translate.instant("Successfully sent weekly report"),
            this.translate.instant("Success")
          );
        }
      });
  }

  autogrow(type) {
    if (type == "comment1") {
      let textArea = document.getElementById("comment1");
      textArea.style.overflow = "hidden";
      textArea.style.minHeight = "58px";
      textArea.style.height = "0px";
      textArea.style.height = textArea.scrollHeight + "px";
    }
    if (type == "comment2") {
      let textArea = document.getElementById("comment2");
      textArea.style.overflow = "hidden";
      textArea.style.minHeight = "58px";
      textArea.style.height = "0px";
      textArea.style.height = textArea.scrollHeight + "px";
    }
  }

  selectedMaturityDays(e: { value: number; name: string }) {
    const inputDate = this.createForm.get("invoiceDate").value;
    const dateParts = inputDate.split(" ");
    const originalDate = moment(dateParts[0], "YYYY-MM-DD");
    const newDate = originalDate.clone().add(e.value, "days");
    const weekNumber = newDate.isoWeek();
    const outputDate = newDate.format("YYYY-MM-DD") + " Week " + weekNumber;
    this.createForm.get("maturityDate").patchValue(outputDate);
  }

  compareDates(date1, date2) {
    const date1Parts = date1.split(" ");
    const date2Parts = date2.split(" ");

    const moment1 = moment(date1Parts[0], "YYYY-MM-DD");
    const moment2 = moment(date2Parts[0], "YYYY-MM-DD");

    if (moment1.isAfter(moment2)) return true;
    return false;
  }

  getDateDifference(date1, date2): number {
    const dateParts1 = date1.split(" ");
    const dateParts2 = date2.split(" ");
    date1 = moment(dateParts1[0], "YYYY-MM-DD");
    date2 = moment(dateParts2[0], "YYYY-MM-DD");

    return date2.diff(date1, "days");
  }

  whatNeedToBePaymentTerms(howMuchDays) {
    switch (howMuchDays) {
      case 10:
        return "10 days";
      case 15:
        return "15 days";
      case 20:
        return "20 days";
      case 30:
        return "30 days";
      case 60:
        return "60 days";
      case 90:
        return "90 days";
      default:
        return "Betalningsvillkor";
    }
  }

  public category;
  selectedCategory(e: string) {
    this.createForm.get('category').patchValue(e);
    this.category = e;
  }

  /* createInvoice() {} */
  isSequential(arrayOfNumbers) {
    if (arrayOfNumbers.length == 1) return false;
    let isSeq: boolean = true;
    for (let i = 0; i < arrayOfNumbers.length - 1; i++) {
      if (parseInt(arrayOfNumbers[i]) + 1 !== parseInt(arrayOfNumbers[i + 1])) {
        isSeq = false;
        break;
      }
    }

    return isSeq;
  }

  public listOfSelectedWeeks = [];
  formatingWeeklyReportsForTable(arrayOfWeeklyObject) {
    this.listOfSelectedWeeks = [];
    let atLeastOneIsChecked: boolean = false;
    for (let objectWeek of arrayOfWeeklyObject) {
      if (objectWeek.checked) {
        this.listOfSelectedWeeks.push(objectWeek.revision);
        atLeastOneIsChecked = true;
      }
    }

    if (!atLeastOneIsChecked) {
      for (let objectWeek of arrayOfWeeklyObject)
        this.listOfSelectedWeeks.push(objectWeek.week);
    }
    return this.listOfSelectedWeeks;
  }

  addAditionalRowToObjectATA(item) {

    if(item.PaymentType != 2 && item.PaymentType != 3) {

        item.selectedWeeks = this.formatingWeeklyReportsForTable(
          item.weeklyReports
        );
        item.isSequential = this.isSequential(item.selectedWeeks);
        if (!item.isSequential) {
          const arrayToString = item.selectedWeeks.toString();
          item.formatedSelectedWeeks = arrayToString;
        }

        if (item.isSequential)
          item.description = `ÄTA-${item.ataNumber} KS V${
            item.selectedWeeks[0]
          } - V${item.selectedWeeks[item.selectedWeeks.length - 1]}`;
        else
          item.description = `ÄTA-${item.ataNumber} KS V${item.formatedSelectedWeeks}`;

        let sumOfWeeklyReports: number = 0;
        for (let weekli of item.weeklyReports) {
          if (weekli.checked) sumOfWeeklyReports += weekli.total;
        }
        item.pricePerUnit = sumOfWeeklyReports;
        item.quantity = 1;
        item.deduct = 0;
        item.total = this.calculateTotalOfRow(
          item.quantity,
          item.pricePerUnit,
          item.deduct
        );
    }else {
        item.description = "ÄTA-" + item.ataNumber;
          item.quantity = 1;
          item.pricePerUnit = item.total;
          item.deduct = 0;
    }
    item.Unit = item.Unit && item.Unit.length > 0 ? item.Unit : '';
    item.total = this.calculateTotalOfRow(
      item.quantity,
      item.pricePerUnit,
      item.deduct
    );

    if(item.checked2) {
        item.checked = true;
    }else {
        item.checked = false;
    }

    const index = this.renderDataInTable.findIndex(
        (article) => article.ataId == item.ataId
    );

    if(index == - 1) {
        this.renderDataInTable.push(item);
        this.pushRow();
    }else {
        this.renderDataInTable[index]= item;
    }
  }

  public totalSum: number = 0;

  async sendTheNewValue(e, job, type) {

    const value = e.target.value;
    job[type] = value;
    job.total = this.calculateTotalOfRow(
      job.quantity,
      job.pricePerUnit,
      job.deduct
    );

    const index = this.articleForm.value.findIndex(
        (article) => article.makeid === job.makeid
    );
    if(index > - 1) {

        if(type == 'pricePerUnit') {
            type = 'Price';
        }


        if(type == 'deduct') {
            this.articleForm.value[index].Deduct = value;
        }

        if(type == 'quantity') {
            this.articleForm.value[index].DeliveredQuantity = value;
        }

        this.articleForm.value[index][type] = value;
        this.articleForm.value[index].Total = job.total;
        this.pushRow();
      //  if(this.articleForm.value[index].Total > 0) {
     //       this.pushRow();
     //   }
    }

    this.calculateTotalSum();
  }

    setValue(e, job, type) {
        const value = e.target.value;
        job[type] = value;
        const index = this.articleForm.value.findIndex(
            (article) => article.makeid === job.makeid
        );

        if(index > - 1) {
            this.articleForm.value[index][type] = value;
            if(type == 'Description') {
                this.articleForm.value[index].description = value;
                job.description = value;
            }
            this.pushRow();
        }
    }

  calculateTotalOfRow(quantity, pricePerUnit, deduct) {

    if(quantity == '') {
      quantity = 0;
    }

    if(pricePerUnit == '') {
      pricePerUnit = 0;
    }

    if(deduct == '') {
      deduct = 0;
    }


    const quantity_ = Number(
      quantity.toString().replace(/\s/g, "").replace(",", ".")
    );
    const pricePerUnit_ = Number(
      pricePerUnit.toString().replace(/\s/g, "").replace(",", ".")
    );
    const deduct_ = Number(
      deduct.toString().replace(/\s/g, "").replace(",", ".")
    );
    return quantity_ * pricePerUnit_ * (deduct_ / 100 + 1);
  }

    onRemoveRow(job, i) {

        if(job.makeid && job.makeid != '') {

            let article_index = this.articleForm.value.findIndex(
              (obj) => obj.makeid === job.makeid
            );

            if(article_index > -1) {
                this.articleForm.value.splice(article_index, 1);
                this.articleForm.controls.splice(article_index, 1);
            }
        }

        this.removedArticles.push(job);

        if(this.getFinalResultForPaymentBtn()) {
            const selectedObject = JSON.stringify(job);
            for (let item of this.renderDataInTable) {
              if (JSON.stringify(item) === selectedObject) {
                if (item.checked2) item.checked2 = false;
                else item.checked = false;
                const index = this.renderDataInTable.indexOf(item);
                this.renderDataInTable.splice(index, 1);
              }
            }
        }else {
            this.renderDataInTable.splice(i, 1);
        }

        this.calculateTotalSum();
        this.getMarkningskrav();

        if (this.renderDataInTable.length == 0) {
          this.whichBtnIsSelected.ata = false;
          this.whichBtnIsSelected.payment = false;
          this.whichBtnIsSelected.weekly = false;
          this.markningskrav = '';
        }

        if(this.getFinalResultForAtaBtn() && job.ataId != '') {

            let ata_index = this.atasNotInvoiced.findIndex(
              (obj) => obj.ataId === job.ataId
            );

            if(ata_index > -1) {
                this.atasNotInvoiced[ata_index].checked = false;
                this.atasNotInvoiced[ata_index].checked2 = false;
            }

            let ata_article_index = this.articleForm.value.findIndex(
              (obj) => obj.ataId === job.ataId
            );

            if(ata_article_index > -1) {
                this.articleForm.value.splice(ata_article_index, 1);
                this.articleForm.controls.splice(ata_article_index, 1);
            }
        }


        if(this.getFinalResultForWeeklyBtn() && job.ReportIds != '') {
            let wr_index = this.weeklyReportsNotInvoiced.findIndex(
              (obj) => obj.name === job.name
            );

            if(wr_index > -1) {
                this.weeklyReportsNotInvoiced[wr_index].checked = false;
                this.weeklyReportsNotInvoiced[wr_index].checked2 = false;
            }

            let wr_ata_article_index = this.articleForm.value.findIndex(
              (obj) => obj.Description === job.name
            );

            if(wr_ata_article_index > -1) {
                this.articleForm.value.splice(wr_ata_article_index, 1);
                this.articleForm.controls.splice(wr_ata_article_index, 1);
            }
        }
    }

  addAditionalRowToObjectWeekly(item) {
    item.description = item.name;
    item.pricePerUnit = item.total;
    item.deduct = 0;
    item.quantity = 1;
    item.total = this.calculateTotalOfRow(
      item.quantity,
      item.pricePerUnit,
      item.deduct
    );
    item.Unit = item.Unit && item.Unit.length > 0 ? item.Unit : '';

    const index = this.renderDataInTable.findIndex(
        (article) => article.description == item.description
    );

    if(index == - 1) {
        this.renderDataInTable.push(item);
        this.pushRow();
    }else {
        this.renderDataInTable[index]= item;
    }
  }

    async calculateTotalSum() {
      this.totalSum = 0;
      for (let item of this.renderDataInTable) {
        if(item.total != '') {
            this.totalSum += item.total;
        }
      }
    }

  openAtaModal() {
    this.paymentPlanArray = [];
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.maxHeight = "500px";
    const neededObjectData = {
      neededArray: this.atasNotInvoiced,
      isEdit: false
    }
    dialogConfig.data = neededObjectData;
    dialogConfig.panelClass = 'app-ata-invoice';
    const dialogRef = this.dialog.open(NewBillAtaModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe({
      next: async (data) => {

        if (data) {
          this.atasNotInvoiced = data;
         // this.renderDataInTable = [];
          this.whichBtnIsSelected.ata = true;
          for (let item of this.atasNotInvoiced) {

            if (item.checked) {

                item.ReportId = [];
                if (item.PaymentType != 2 && item.PaymentType != 3) {
                    for (let childItem of item.weeklyReports) {
                        item.ReportId.push(childItem.wrId);
                    }
                }

                let deleted_index = this.removedArticles.findIndex(
                    (obj) => obj.ataId == item.ataId
                );

                if(deleted_index > -1){
                    this.removedArticles.splice(deleted_index, 1);
                }

                this.addAditionalRowToObjectATA(item);
            }else {
                if(item.is_deleted) {

                    let renderDataInTable_index = this.renderDataInTable.findIndex(
                      (obj) => obj.ataId === item.ataId
                    );

                    if(renderDataInTable_index > -1) {
                        this.renderDataInTable.splice(renderDataInTable_index, 1);
                    }

                    let index = this.articleForm.value.findIndex(
                      (obj) => obj.ataId === item.ataId
                    );

                    if(index > -1) {
                        this.removedArticles.push(item);
                        this.articleForm.value.splice(index, 1);
                        this.articleForm.controls.splice(index, 1);
                    }
                }
            }
          }
          await this.fillArrayForm();
          await this.calculateTotalSum();
          this.getMarkningskrav();
        }
      },
    });
  }

  openWeeklyReportModal() {
    this.paymentPlanArray = [];
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = this.weeklyReportsNotInvoiced;
    dialogConfig.panelClass = 'app-weekly-invoice';
    dialogConfig.maxHeight = "500px";
    const dialogRef = this.dialog.open(
      NewBillWeeklyModalComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe({
      next: (data) => {

        if (data) {
          this.weeklyReportsNotInvoiced = data;
        //  this.renderDataInTable = [];
          this.whichBtnIsSelected.weekly = true;
          for (let item of this.weeklyReportsNotInvoiced) {

            if(!item.makeid) {
                item.makeid = '';
            }

            if (item.checked) {
              this.addAditionalRowToObjectWeekly(item);
            }else {
                  if(item.is_deleted) {
                    let index = this.articleForm.value.findIndex(
                        (obj) => obj.ReportIds == item.id
                    );

                        let renderDataInTable_index = this.renderDataInTable.findIndex(
                          (obj) => obj.description === item.name
                        );

                        if(renderDataInTable_index > -1) {
                            this.renderDataInTable.splice(renderDataInTable_index, 1);
                        }

                    if(index > -1) {
                        this.removedArticles.push(item);
                        this.articleForm.value.splice(index, 1);
                        this.articleForm.controls.splice(index, 1);
                    }

                }

            }
          }
          this.calculateTotalSum();
          this.fillArrayForm();
        }
      },
    });
  }

  public paymentPlanArray = [];
  public paymentPlanChildArray = [];
  public sumOfInvoiced = 0;
  public sumOfArrearsInvoiced = 0;
  addAditionalRowToObjectPayment(item) {
    // Ove 4 linije ispod vjerovatno ne trebaju
    // ali nek stoje za svaki slucaj

    item.pricePerUnit = "";
    item.deduct = "";
    item.quantity = "";
    item.total = "";
    item.sumOfArrears = 0;
    this.paymentPlanChildArray = [];

    for (let articleKey of item.articleKeys) {

        item.articles[articleKey][0].deduct = 0;
        item.articles[articleKey][0].quantity = 1;
        item.articles[articleKey][0].total = this.calculateTotalOfRow(
            item.articles[articleKey][0].quantity,
            item.articles[articleKey][0].Amount,
            item.articles[articleKey][0].deduct,
        );

        item.articles[articleKey][0].ataId = 0;
        item.articles[articleKey][0].MaterialId = 0;
        item.articles[articleKey][0].ReportIds = 0;
        item.articles[articleKey][0].AtaNumber  = '';
        item.articles[articleKey][0].Description = item.articles[articleKey][0].Name;
        item.articles[articleKey][0].DeliveredQuantity = item.articles[articleKey][0].quantity;
        item.articles[articleKey][0].Price = item.articles[articleKey][0].Amount;
        item.articles[articleKey][0].Deduct = item.articles[articleKey][0].deduct;
        item.articles[articleKey][0].PaymentPlanId = item.paymentPlanId;
        item.articles[articleKey][0].MonthId = item.id;
        item.articles[articleKey][0].Unit = '';

        this.totalSum += parseInt(item.articles[articleKey][0].total);
        item.sumOfArrears -= Number(
            item.articles[articleKey][0].Arrears.toString().replace(/\s/g, "").replace(",", ".")
        );
        this.paymentPlanChildArray.push(item.articles[articleKey][0]);

    }

    this.sumOfInvoiced += item.sumOfArrears;
    item.Unit = '';
    item.loopThroughArticles = this.paymentPlanChildArray;
    this.totalSum += item.sumOfArrears;
 //   this.paymentPlanChildArray = [];
    this.renderDataInTable.push(item);
  }

  updatePaymentRowForFinalResult(e, articleItem, type) {
    const value = e.target.value;
    articleItem[type] = value;

    if(type == 'Description') {
      articleItem['description'] = value;
    }

    articleItem.total = this.calculateTotalOfRow(
      articleItem.quantity,
      articleItem.Price,
      articleItem.Deduct
    );
    this.pushRowForPaymentPlan();
    this.calculateTotalSumWhenPayment();
  }

  updatePaymentRow(e, articleItem, type) {
    const value = e.target.value;
    articleItem[type] = value;
    articleItem.total = this.calculateTotalOfRow(
      articleItem.quantity,
      articleItem.Amount,
      articleItem.deduct
    );
    this.calculateTotalSumWhenPayment();
  }

  calculateTotalSumWhenPayment() {

    this.totalSum = 0;
    for (let item of this.renderDataInTable) {

      if(this.all_invoiced_total_of_final_invoices) {
          this.totalSum += item.total;
      }else {
        for (let throughArticle of item.loopThroughArticles) {
          this.totalSum += throughArticle.total;
          this.totalSum -= Number(
            throughArticle.Arrears.toString().replace(/\s/g, "").replace(",", ".")
          );
        }
      }
    }
    this.totalSum = Math.round(this.totalSum * 100) / 100;
  }


    delete_arrticle(index) {

        if( this.renderDataInTable[index + 1] && this.renderDataInTable[index + 1].checked) {
            return false;
        }else {
            return true;
        }
    }

    onRemoveRowPayment(job, i) {

        if(this.delete_arrticle(i)) {
           // const selectedObject = JSON.stringify(job);
            this.sumOfInvoiced = 0;
            job.MonthId = job.id;

            job.loopThroughArticles.forEach((article, index) => {
              this.removedArticles.push(article);
            });
            this.removedArticles.push(job);

            this.paymentPlanArray.forEach((article, index) => {
                if(article.id == job.id) {
                    this.paymentPlanArray[index].checked = false;
                    this.paymentPlanArray[index].checked2 = false;
                    this.paymentPlanArray[index].check = false;
                }
            });

            this.articleForm.value.forEach((article, index) => {
                if(article.MonthId == job.id) {
                    this.articleForm.value.splice(index, 1);
                    this.articleForm.controls.splice(index, 1);
                }
            });

            this.renderDataInTable.forEach((item, index) => {
                if(item.id == job.id) {
                    this.renderDataInTable.splice(index, 1);
                }else {
                    item.sumOfArrears = 0;
                    item.loopThroughArticles.forEach((article, index) => {
                        item.sumOfArrears -= Number(
                            article.Arrears.toString().replace(/\s/g, "").replace(",", ".")
                        );
                    });
                    this.sumOfInvoiced += item.sumOfArrears;
                }
            });

            this.refreshIfNotAllArticlesDeleted(job);
            this.calculateTotalSumWhenPayment();
            if (this.renderDataInTable.length == 0) {
              this.whichBtnIsSelected.ata = false;
              this.whichBtnIsSelected.payment = false;
              this.whichBtnIsSelected.weekly = false;
              this.paymentPlanArray = [];
            }
        }else {
            return this.toastr.info(
                this.translate.instant("Unable to delete"),
                this.translate.instant("Info")
            );
        }
    }

  refreshIfNotAllArticlesDeleted(job) {

    let index3 = this.articleForm.value.findIndex(
      (obj) => obj.MonthId == job.id
    );
    if( index3 > -1 ) {
        this.articleForm.value.splice(index3, 1);
        this.articleForm.controls.splice(index3, 1);
    }

    let index4 = this.articleForm.value.findIndex(
      (obj) => obj.MonthId == job.id
    );

    if( index4 > -1 ) {
        this.refreshIfNotAllArticlesDeleted(job);
    }
  }

  openPaymentPlanModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.maxHeight = "500px";
    if (this.paymentPlanArray.length <= 0) {
      for (let item of this.paymentPlanForm_.controls)
        this.paymentPlanArray.push(item.value);
    }

    /*
        let status = false;
        let teh_review = '';
        if(this.project && this.project?.TehnicReview && this.project?.TehnicReview != '') {
            teh_review = this.project?.TehnicReview.split(' ')[0];
            teh_review = moment(teh_review).format("YYYY-MM-DD");
            let today = moment().format("YYYY-MM-DD");
            if(today < teh_review) {
              status = true;
            }
        }

        rekli su da treba, pa kazu da ne treba. neka stoji za sad :) !

        if(this.all_invoiced_total_of_final_invoices && !this.project.TehnicReview || status) {

          let msg = 'You have to set technic review date on project!';
          if(status) {
            msg = 'Final inspection date is ' + teh_review;

            this.toastr.info(
                this.translate.instant(msg),
                this.translate.instant("Info")
            );
          }

          this.router.navigate(["/projects/view/project/", this.project.id, 'project-information'], { queryParams: { invoice: true } });
          return;
        }
    */

        const paymentPlansNotInvoiced = this.paymentPlanArray.filter((x) => x.invoice_id == 0);

        paymentPlansNotInvoiced.forEach((plan, index) => {
            plan.sumOfArrears = 0;
            let total = 0;
            for (let articleKey of plan.articleKeys) {
                plan.articles[articleKey][0].deduct = 0;
                plan.articles[articleKey][0].quantity = 1;
                plan.articles[articleKey][0].total = this.calculateTotalOfRow(
                  plan.articles[articleKey][0].quantity,
                  plan.articles[articleKey][0].Amount,
                  plan.articles[articleKey][0].deduct
                );
                plan.sumOfArrears -= Number(
                    plan.articles[articleKey][0].Arrears.toString().replace(/\s/g, "").replace(",", ".")
                );
                total += Number(plan.articles[articleKey][0].total);
            }
            paymentPlansNotInvoiced[index].total = total;
            paymentPlansNotInvoiced[index].sumOfArrears = plan.sumOfArrears;
        });

        dialogConfig.data = {'paymentPlansNotInvoiced': paymentPlansNotInvoiced, 'total_of_final_invoices': this.total_of_final_invoices, 'due_date': this.project.TehnicReview, 'all_invoiced_total_of_final_invoices': this.all_invoiced_total_of_final_invoices, 'from_component': 'new', 'isChecked': this.paylment_is_checked, 'final_invoice': this.final_invoice };
        dialogConfig.panelClass = 'app-payment-invoice';
        const dialogRef = this.dialog.open(
          NewBillPaymentModalComponent,
          dialogConfig
        );

    dialogRef.afterClosed().subscribe({
        next: (data) => {
            if (data) {
                this.paylment_is_checked = false;
                if(data.length > 0) {
                  if(data[0].description == 'Final invoice') {
                    this.paylment_is_checked = true;
                  }else {
                    this.paylment_is_checked = false;
                  }
                }
                this.paymentPlanArray = data;
                this.totalSum = 0;
                this.renderDataInTable = [];
                this.whichBtnIsSelected.payment = true;
                this.sumOfInvoiced = 0;
                if(this.all_invoiced_total_of_final_invoices) {
                  this.renderDataInTable = data;
                  this.pushRowForPaymentPlan();
                }else {
                  for (let item of this.paymentPlanArray) {
                      if (item.checked) {
                          this.addAditionalRowToObjectPayment(item);
                      }else {
                        if(item.is_deleted) {
                          item.MonthId = item.id;
                          if(item.loopThroughArticles) {
                            item.loopThroughArticles.forEach((article, index) => {
                              this.removedArticles.push(article);
                            });
                          }
                          this.removedArticles.push(item);
                        }
                      }
                  }
                  this.fillArrayFormForPaymentPlan();
                }
                this.calculateTotalSumWhenPayment();
                this.getMarkningskrav();
            }
        },
    });
  }

  getFinalResultForAtaBtn(): boolean {
    if (
      this.disabledButton ||
      this.disableAta || this.atasNotInvoiced.length == 0
    )
      return false;

    if (
      (!this.whichBtnIsSelected.ata &&
        !this.whichBtnIsSelected.payment &&
        !this.whichBtnIsSelected.weekly) ||
      (this.whichBtnIsSelected.ata &&
        !this.whichBtnIsSelected.payment &&
        !this.whichBtnIsSelected.weekly)
    )
      return true;

    return false;
  }

  getFinalResultForWeeklyBtn(): boolean {

    if (
      this.weeklyReportsNotInvoiced.length == 0  ||
      this.disabledButton ||
      this.disableOngoing ||
      this.project?.payment_type == 'PAYMENT'
    )
      return false;

    if (
      (!this.whichBtnIsSelected.ata &&
        !this.whichBtnIsSelected.payment &&
        !this.whichBtnIsSelected.weekly) ||
      (!this.whichBtnIsSelected.ata &&
        !this.whichBtnIsSelected.payment &&
        this.whichBtnIsSelected.weekly)
    )
      return true;

    return false;
  }

  getFinalResultForPaymentBtn(): boolean {

    const paymentPlansNotInvoiced = this.paymentPlansNotInvoiced.filter((x) => x.checked == false);

    if
    (
      (
        (paymentPlansNotInvoiced.length == 0 && !this.all_invoiced_total_of_final_invoices ) ||
        this.final_invoice != 0 ||
        this.disabledButton ||
        this.disablePaymentPlan ||
        (!this.allow_payment_plan_invoice && !this.all_invoiced_total_of_final_invoices)
      ) ||
        (this.project && this.project.payment_type == 'WEEKLY_REPORT' && this.project.debit_Id == 4)
    ){
      return false;
    }


    if (
      (!this.whichBtnIsSelected.ata &&
        !this.whichBtnIsSelected.payment &&
        !this.whichBtnIsSelected.weekly) ||
      (!this.whichBtnIsSelected.ata &&
        this.whichBtnIsSelected.payment &&
        !this.whichBtnIsSelected.weekly)
    )
      return true;

    return false;
  }

  ngOnDestroy(): void {
    this.allProjectsSubscriber.unsubscribe();
    this.allReferencesSubscriber.unsubscribe();
    this.allProjectClientNamesSubscription.unsubscribe();
    this.allweeklyReports.unsubscribe();
    this.weeklyReportSub.unsubscribe();
  }

  public whichBtnIsSelected = {
    ata: false,
    weekly: false,
    payment: false,
  };

  onRemoveCheckedArr(job) {
    const index = this.checkedArr.indexOf(job);
    this.checkedArr.splice(index, 1);
    if (job.id == 1) this.checkedProjecName = false;
    else if (job.id == 2) this.checkedProjectNumber = false;
    else if (job.id == 3) this.checkedProjectKonto = false;
    else if (job.id == 4) this.checkedMarkningskrav = false;

  }



    getMarkningskrav() {

        if(!this.checkedMarkningskrav) {
            const arrayOfCheckedAtas = [];
            for (let item of this.atasNotInvoiced)
              if (item.checked) arrayOfCheckedAtas.push(item.labeling_requirements);

            if(arrayOfCheckedAtas && arrayOfCheckedAtas.length > 0) {
                const allEqual = arrayOfCheckedAtas.every((val) => val == arrayOfCheckedAtas[0]);
                if (allEqual) {
                  this.visible_markningskrav_check = true;
                    this.markningskrav = arrayOfCheckedAtas[0];
                    return;
                }else {
                  this.visible_markningskrav_check = false;
                }
            }

            this.markningskrav = "-";

            if(this.markningskrav.length > 0 && this.markningskrav != '-') {
                this.visible_markningskrav_check = true;
            }
            return;
        }
    }


    createForms() {
        this.createForm = this.fb.group({
          project: ["", Validators.required],
          project_name: ["", Validators.required],
          activity: ["", Validators.required],
          client: ["", Validators.required],
          category: ["", Validators.required],
          clientsProjectName: ["", Validators.required],
          resursKonto1: "",
          clientProjectNumber: "",
          markningskrav: "",
          comment1: "",
          comment2: "",
          invoiceDate: "",
          invoice_reference: "",
          maturityDate: "",
          reference: [this.userDetails.user_id, Validators.required],
          type: [this.types[0], Validators.required],
            note1: [""],
            note2: [""],
          reference_name: [
            this.userDetails.firstname + " " + this.userDetails.lastname,
            Validators.required,
          ],
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
              PaymentPlanArticleId: "",
              Arrears: '',
              makeid: ''
            }),
          ]),
        });
    }

    setAccount(account_data, job) {

      job.Account = account_data;
      let index = -1;

      if(this.getFinalResultForAtaBtn() && job.ataId != '') {

          index = this.articleForm.value.findIndex(
            (obj) => obj.ataId === job.ataId
          );
      }else if(this.getFinalResultForWeeklyBtn() && job.ReportIds != '') {
          index = this.articleForm.value.findIndex(
            (obj) => obj.Description === job.name
          );
      }else {
          index = this.articleForm.value.findIndex(
            (obj) => obj.makeid === job.makeid
          );
      }

      if(index > - 1) {
        this.articleForm.value[index].Account = account_data;
      }
    }

    fillArrayFormForPaymentPlan() {

        this.articleForm.clear();

        this.renderDataInTable.forEach((item, index) => {

            let index2 = this.articleForm.value.findIndex(
              (obj) => obj.Description == item.description
            );

            if(index2 == -1) {

                if(this.all_invoiced_total_of_final_invoices) {
                      const newFormControl = this.fb.group({
                          ataId: 0,
                          MaterialId: "",
                          ReportIds: '',
                          AtaNumber: '',
                          Description: item.Description,
                          DeliveredQuantity: item.quantity,
                          Unit: item.Unit,
                          Price: Number(item.Price),
                          Deduct: Number(item.Deduct),
                          Total: Number(item.total),
                          total: Number(item.total),
                          week: "",
                          MonthId: item.id,
                          PaymentPlanId: item.PaymentPlanId,
                          PaymentPlanArticleId: item.PaymentPlanArticleId,
                          Arrears: item?.Arrears,
                          Account: item?.Account
                      });
                      this.articleForm.push(newFormControl);
                }else {

                  const newFormControl = this.fb.group({
                      ataId: 0,
                      MaterialId: "",
                      ReportIds: '',
                      AtaNumber: '',
                      Description: item.description,
                      description: item.description,
                      DeliveredQuantity: '',
                      Unit: '',
                      Price: 0,
                      Deduct: 0,
                      Total: 0,
                      week: "",
                      MonthId: item.id,
                      PaymentPlanId: "",
                      PaymentPlanArticleId: "",
                      type : 'payment_plan',
                      Arrears: '',
                      makeid: '',
                      Account: item?.Account
                  });
                  this.articleForm.push(newFormControl);

                  let total = 0;
                  item.loopThroughArticles.forEach((article) => {

                      let price = parseFloat(article.Price.replace(/\s/g, ""));
                      const newFormControl = this.fb.group({
                          ataId: 0,
                          MaterialId: "",
                          ReportIds: '',
                          AtaNumber: '',
                          Description: article.Name,
                          DeliveredQuantity: article.quantity,
                          Unit: "",
                          Price: Number(price),
                          Deduct: Number(article.deduct),
                          Total: Number(article.total),
                          week: "",
                          MonthId: item.id,
                          PaymentPlanId: item.paymentPlanId,
                          PaymentPlanArticleId: article.id,
                          Arrears: article?.Arrears,
                          Account: article?.Account
                      });
                      total += Number(article.total);
                      this.articleForm.push(newFormControl);
                  });
                  this.renderDataInTable[index].total = total;
                }
            }
        });
    }

    async fillArrayForm() {
        this.articleForm.clear();

        for(let item of this.renderDataInTable) {

            let weeklyReportsString = "";
            if (item.ataId && item.PaymentType != 2 && item.PaymentType != 3) {
                const filteredWeeklyReports = item.weeklyReports.filter(
                    (wr) => wr.checked
                );

                weeklyReportsString = filteredWeeklyReports
                    .map((wr) => wr.wrId)
                    .join(",");
            }

            if(!item.ataId) {
                weeklyReportsString = item.id;
            }

            const newFormControl = this.fb.group({
                ataId: item.ataId,
                MaterialId: "",
                ReportIds: weeklyReportsString,
                AtaNumber: item.ataNumber,
                Description: item.description,
                DeliveredQuantity: item.quantity,
                Unit: item.Unit,
                Price: item.pricePerUnit,
                Deduct: item.deduct,
                Total: item.total,
                week: "",
                MonthId: "",
                PaymentPlanId: "",
                makeid: item.makeid ? item.makeid : '',
                Account: item.Account
            });
            this.articleForm.push(newFormControl);
        }
    }

    setInitialValueForFields(project) {

        this.project = project;
        this.referencesOfProject = project.responsiblePeople;
        this.projectClientName = project.clientName;
        this.createForm.get('project').patchValue(project);
        this.createForm.get('project_name').patchValue(project.name);
        this.createForm.get('activity').patchValue(project.activity);
        this.createForm.get('client').patchValue(project.clientName);
        this.createForm.get('category').patchValue('Invoice');
        this.category = 'Invoice';
        this.createForm
          .get("clientsProjectName")
          .patchValue(project.clientsProjectName);
        this.createForm
          .get("invoice_reference")
          .patchValue(project.invoice_reference_name);
        this.createForm
          .get("clientProjectNumber")
          .patchValue(project.clientProjectNumber);
        this.createForm.get("resursKonto1").patchValue(project.resursKonto1);
       /* this.createForm
          .get("markningskrav")
          .patchValue(project.markningskrav);*/
        //this.loadingSpinner = false;
    }

  whenSaveBtnIsActive() {
    if (
      this.project &&
      this.invoiceDate &&
      this.createForm.get('maturityDate').value &&
      this.selectedReference &&
      this.category &&
      this.renderDataInTable.length > 0 &&
      this.allowSave()
    )
      return true;
    return false;

  }

  /**
   *    Ispod je logika za ata, weekly report i payment plan
   *    iz new-invoice komponente
   */
  @ViewChild("myform", { static: true }) myform!: NgForm;
  public clients;
  public client;
  public materialProperties;
  public units;
  public atas = [];
  public articleFormCopy: any[];
  public atasForm: FormGroup;
  public materialsForm: FormGroup;
  public weeklyReportsForm: FormGroup;
  public paymentPlanForm: FormGroup;
  public process = false;
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
  public allow_payment_plan_invoice:boolean = false;
  public payment_plan_all_data: any;

  initializeUser() {
    this.references = [];
    let current_user = {
      finalName: this.userDetails.firstname + " " + this.userDetails.lastname,
      id: this.userDetails.user_id,
    };
    this.references.push(current_user);
  }

  //    Imamo vec createForms koji smo napravili

  /* createForms() {
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
  } */

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
      //this.pushRow();
     // this.pushRow();
    } else {
      this.createForm.get("client").patchValue("");
      this.disabledButton = true;
      this.activityProjects = [];
      this.atasForm.controls["ataSelected"].patchValue(false);
      this.atas = [];
      this.weeklyReports = [];
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

    initSpinner()   {

      if(!this.ataSpinner && !this.weeklyReportSpinner && !this.paymentPlanSpinner) {
        this.loadingSpinner = false;
      }else {
        this.loadingSpinner = true;
      }
    }

  getAtas(projectId) {
    this.atasForm.controls["ataSelected"].patchValue(false);
    this.atas = [];
    this.ataSpinner = true;
    this.ataService
      .getAllAtasForInvoice(projectId, 'new')
      .subscribe((res: any) => {
        this.ataSpinner = false;
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
        this.initSpinner();
      });
  }

  get paymentPlanForm_() {
    return this.paymentPlanForm.get("paymentPlans") as FormArray;
  }

  getPaymentPlan(projectId) {

    this.paymentPlans = [];
    this.paymentPlansNotInvoiced = [];
    this.paymentPlanArray = [];
    this.paymentPlanForm_.clear();
    this.paymentPlanSpinner = true;
    this.paymentplanService
      .getAcceptedPaymentPlan(projectId)
      .subscribe((reports) => {
        this.paymentPlanSpinner = false;
        this.payment_plan_all_data = reports["data"];
        this.total_of_final_invoices = reports["data"].length > 0 ? reports["data"][0].total_of_final_invoices : 0;
        this.final_invoice = reports["data"].length > 0 ? reports["data"][0].final_invoice : 0;
        this.paymentplanid = reports["data"].length != 0 ? reports["data"][0].ID : "";
        this.allow_payment_plan_invoice = reports["data"].length != 0 ? reports["data"][0].allow_new_invoice : false;
        this.all_invoiced_total_of_final_invoices = reports["data"].length > 0 ? reports["data"][0].all_invoiced_total_of_final_invoices : 0;
        this.paymentPlans = reports["data"].length != 0 ? reports["data"][0].month_span : [];
        this.paymentPlansRows = [];
        this.sumOfArrearsInvoiced = 0;
        this.sumOfArrearsChecked = 0;

        this.paymentPlans.forEach((row, i) => {

          row["paymentPlanNumber"] = reports["data"][0].paymentPlanNumber;
          row["paymentPlanId"] = reports["data"][0].ID;
          this.paymentPlansRows = row;
          row.sumOfArrears = 0;
          row.sumOfChecked = 0;

          if (row.articles) {
            if(row.checked) {
              for (let articleKey of row['articleKeys']) {
                row.sumOfChecked -= Number(
                    row['articles'][articleKey][0].Arrears.toString().replace(/\s/g, "").replace(",", ".")
                );
              }
              this.sumOfArrearsChecked += row.sumOfChecked;
            }

            if (row.articles[row.articleKeys[0]][0].Invoice_date !== "") {
              for (let articleKey of row['articleKeys']) {
                row.sumOfArrears -= Number(
                    row['articles'][articleKey][0].Arrears.toString().replace(/\s/g, "").replace(",", ".")
                );
              }
              this.sumOfArrearsInvoiced += row.sumOfArrears;
              this.paymentPlansInvoiced = this.paymentPlansInvoiced.concat(row);
            } else {
              this.paymentPlansNotInvoiced =
                this.paymentPlansNotInvoiced.concat(row);
            }
          }
        });

        let disabled = false;
        this.paymentPlansNotInvoiced.forEach((plan, index) => {
          const total = plan.total ? plan.total : 0;

          this.paymentPlanForm_.push(
            this.fb.group({
              date: new FormControl({ value: plan.date, disabled: disabled }),
              checkbox: new FormControl({ value: false, disabled: disabled }),
              total: new FormControl({ value: total, disabled: disabled }),
              id: new FormControl({ value: plan.id, disabled: disabled }),
              paymentPlanId: new FormControl({
                value: plan.paymentPlanId,
                disabled: disabled,
              }),
              month: new FormControl({ value: plan.month, disabled: disabled }),
              year: new FormControl({ value: plan.year, disabled: disabled }),
              avst: new FormControl({ value: plan.avst, disabled: disabled }),
              datenumber: new FormControl({
                value: plan.datenumber,
                disabled: disabled,
              }),
              paymentPlanNumber: new FormControl({
                value: plan.paymentPlanNumber,
                disabled: disabled,
              }),
              articles: new FormControl({
                value: plan.articles,
                disabled: disabled,
              }),
              articleKeys: new FormControl({
                value: plan.articleKeys,
                disabled: disabled,
              }),
              invoice_id: new FormControl({
                value: plan.invoice_id,
                disabled: disabled,
              }),
              makeid: new FormControl({
                value: plan.invoice_id,
                disabled: disabled,
              }),
            })
          );

          if (index === 0) {
            disabled = true;
          }
        });
        this.initSpinner();
      });
  }

  getWeeklyReports(projectId) {
    this.weeklyReports = [];
    this.weeklyReportSpinner = true;
    this.invoiceService.getWeeklyReports(projectId).subscribe((reports) => {
      this.weeklyReportSpinner = false;
      this.weeklyReports = reports["data"] || [];
      this.weeklyReportsNotInvoiced = this.weeklyReports
        .filter(
          (report) =>
            report.status != 5 && report.financeId == 0
        )
        .map((report) => {
          report["selected"] = false;
          return report;
        });
      this.weeklyReportsInvoiced = this.weeklyReports.filter(
        (report) => report.status == 5
      );
      this.initSpinner();
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
      if (x.PaymentPlanId != "") {
        for (
          let i = this.articleFormCopy.length - 2;
          i < this.paymentPlanForm_.controls.length + 1;
          i++
        ) {
          if (i < this.paymentPlanForm_.controls.length) {
            this.paymentPlanForm_.controls[i].disable();
            this.paymentPlanForm_.controls[i].patchValue({
              checkbox: false,
            });
          }
        }
        this.paymentPlanForm_.controls[
          this.articleFormCopy.length - 2
        ].enable();
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
        } else {
          this.disableOngoing = true;
          this.disablePaymentPlan = true;
          this.disableAta = true;
        }
      }
    });

    if (this.paymentPlanForm_) {
      if (this.articleForm.value[0].PaymentPlanId != "") {
        this.count = this.articleForm.value.filter(
          (item) => item.Description !== ""
        ).length;
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

        this.renderDataInTable.forEach((row, i) => {
          if (row.description == "") {
            this.renderDataInTable.splice(i, 1);
          }
        });

        this.articleForm.value.forEach((row, i) => {
          if (row.Description == "") {
            this.articleForm.controls.splice(i, 1);
            this.articleForm.value.splice(i, 1);
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
   // this.pushRow();
   // this.pushRow();
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
     // this.pushRow();
     // this.pushRow();
      this.process = false;
    }
  }

  public monthLoaded = {};

  getPaymentPlanRows(value, month, index, key) {
    this.clearEmptyRows();

    if (value == true) {
      let exists = false;

      let articleName = "";
      let elementName = [];
      if (month.controls.articleKeys) {
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
            Unit: "",
            Deduct: 0,
          });
          this.isReadOnly = true;
          exists = true;
        }

        if (index < this.paymentPlanForm_.controls.length - 1) {
          this.paymentPlanForm_.controls[index + 1].enable();
        }
      }

      if (!exists) {
        this.addMonth(month.id, articleName, month.total, month.paymentPlanId);
      }
    } else {
      for (let i = index; i < this.paymentPlanForm_.controls.length + 1; i++) {
        if (i < this.paymentPlanForm_.controls.length - 1) {
          this.paymentPlanForm_.controls[i + 1].disable();
          this.paymentPlanForm_.controls[i + 1].patchValue({
            checkbox: false,
          });
          if (this.paymentPlanForm_.controls[i].value.checkbox == false) {
            this.articleForm.controls.splice(index, 1);
            this.articleForm.controls.splice(index + 1, 1);
          }
        }
      }
    }
    this.clearEmptyRows();
  //  this.pushRow();
   // this.pushRow();
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
 //   this.pushRow();
  //  this.pushRow();
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
        Unit: "",
        Price: Number(totalwr).toFixed(2),
        Deduct: "",
        Total: Number(totalwr).toFixed(2),
        makeid: ''
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
        Unit: "",
        Price: t,
        Deduct: "",
        Total: t,
        MonthId: "",
        PaymentPlanId: "",
        makeid: ''
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
        Unit: "",
        Price: t,
        Deduct: "",
        Total: t,
        week: week,
        MonthId: "",
        PaymentPlanId: "",
        makeid: ''
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
        Unit: "",
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

  makeid(length) {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      return result;
  }

  pushRow() {

    this.clearEmptyRows();

    let row =
    {
        ataId: "",
        MaterialId: "",
        ReportIds: "",
        AtaNumber: "",
        ataNumber: '',
        description: "",
        Description: "",
        DeliveredQuantity: "",
        Unit: "",
        pricePerUnit: '',
        Price: "",
        Deduct: "",
        deduct: '',
        Total: "",
        total: '',
        MonthId: "",
        PaymentPlanId: "",
        quantity: '',
        emptyRow: true,
        weeklyReportsString: '',
        week: '',
        makeid: this.makeid(20)
    };

    this.renderDataInTable.push(row);
    this.fillArrayForm();
  }


  pushRowForPaymentPlan() {

    this.clearEmptyRows();

    let row =
    {
        ataId: "",
        MaterialId: "",
        ReportIds: "",
        AtaNumber: "",
        ataNumber: '',
        description: "",
        Description: "",
        DeliveredQuantity: "",
        Unit: "",
        pricePerUnit: '',
        Price: "",
        Deduct: "",
        deduct: '',
        Total: "",
        total: '',
        MonthId: "",
        PaymentPlanId: "",
        quantity: '',
        emptyRow: true,
        weeklyReportsString: '',
        week: '',
        makeid: this.makeid(20)
    };

    this.renderDataInTable.push(row);
    this.fillArrayFormForPaymentPlan();
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
      this.paymentPlanForm_.controls[index + 1].disable();
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

    async refresArticles(articles) {
        articles.forEach((article) => {
            let index = -1;
            if(this.getFinalResultForAtaBtn()) {
                index = this.articleForm.value.findIndex(
                  (obj) => obj.ataId == article.ataId
                );
            }else if(this.getFinalResultForWeeklyBtn()) {
                index = this.articleForm.value.findIndex(
                  (obj) => obj.Description == article.name
                );
            }else {
                index = this.articleForm.value.findIndex(
                  (obj) => obj.MonthId == article.MonthId
                );
            }

            if(index > -1 && !article.emptyRow){
                this.articleForm.value.splice(index, 1);
                this.articleForm.controls.splice(index, 1);
            }

        });
        //this.removedArticles = [];
    }

unique(array, propertyName) {
   return array.filter((e, i) => array.findIndex(a => a[propertyName] === e[propertyName]) === i);
}

  async createInvoice() {
    const data = this.createForm.value;//this.createForm.getRawValue();
   // await this.refresArticles(this.removedArticles);
 //   data.articleForm = this.unique(this.articleForm.value, 'Description');
 //   data.articleForm = this.articleForm.value;
    data.checkedArr = this.checkedArr;
    this.loadingSpinner = true;
    if(!this.getFinalResultForPaymentBtn()) {
        data.articleForm.forEach((row, index) => {
            let index2 = this.renderDataInTable.findIndex(
                (obj) => obj.description === row.Description
            );
            if(index2 < 0 && row.makeid == '') {

                data.articleForm.splice(index, 1);
            }
        });
    }


    let total = 0;
    data.projectName = this.project?.name;
    data.clientId = this.project?.client_id;
    data.paymentplanid = this.paymentPlanArray.length > 0 ? this.paymentPlanArray[0].paymentPlanId : this.articleForm.controls[0].value.PaymentPlanId;
    data.articleForm = data.articleForm.filter((row) => {
        return row.Description != "";
    });
    data.all_invoiced_total_of_final_invoices = this.all_invoiced_total_of_final_invoices;
    if(!this.getFinalResultForPaymentBtn()) {
      data.articleForm.forEach((row, index) => {
          data.articleForm[index].index = index;
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
    }else {
      data.total = this.totalSum.toFixed(2);
    }

    data.note1 = data.comment1;
    data.note2 = data.comment2;
    data.labeling_requirements = this.markningskrav;
   /* if(this.getFinalResultForAtaBtn()) {
      data.labeling_requirements = this.markningskrav;
    }else {
      data.labeling_requirements = "";
    }*/
    const valid = this.validateForm();

    if (valid /*&& false*/) {
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

  setUnit(job, value, render_index) {

    this.renderDataInTable[render_index].Unit = value;
    if(!this.getFinalResultForPaymentBtn()) {
      this.fillArrayForm();
    }else {
      this.fillArrayFormForPaymentPlan();
    }
  }

  setLabelingRequirement($event) {

    let val = $event.target.value;
    this.markningskrav = val;
    this.visible_markningskrav_check = true;
    const index = this.checkedArr.findIndex((inv) => inv.type == 'marking');

    if(index > -1) {
      this.checkedArr[index].ProjectNumber = 'Märkningskrav: ' + val;
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

    ConvertToAbsoluteVal(sumOfInvoiced) {
      sumOfInvoiced = Number(sumOfInvoiced);
      let invoiced_total = Math.abs(this.sumOfArrearsInvoiced);
      sumOfInvoiced = Math.abs(sumOfInvoiced);


      return (sumOfInvoiced + invoiced_total).toFixed(2);
    }

  disableMarkningskrav() {
      const data = this.createForm.getRawValue();

      const added_ata = data.articleForm.find((article) => {
        return article.ataId != '';
      });

      if( !added_ata || !this.getFinalResultForAtaBtn() && (!this.markningskrav || this.markningskrav && this.markningskrav.length == 0) || this.checkedMarkningskrav) {
          return true;
      }else {
          return null;
      }
  }

  disableMarkningskravChecked() {
      const data = this.createForm.getRawValue();

      const added_ata = data.articleForm.find((article) => {
        return article.ataId != '';
      });

      if( !added_ata || !this.getFinalResultForAtaBtn() || (this.markningskrav && this.markningskrav == '-') || (!this.markningskrav || this.markningskrav && this.markningskrav.length == 0) || this.checkedMarkningskrav) {
          return true;
      }else {
          return null;
      }
  }

  allowSave() {
    let number_of_added_data = this.renderDataInTable.find((arg) => {return arg.total != ''});
    if(number_of_added_data != undefined) {
      return true;
    }else {
      return false;
    }
  }
}
