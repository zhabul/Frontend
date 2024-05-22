import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AtaService } from 'src/app/core/services/ata.service';
import { ClientsService } from 'src/app/core/services/clients.service';
import { InvoicesService } from 'src/app/core/services/invoices.service';
import { PaymentPlanService } from 'src/app/core/services/payment-plan.service';
import { ProjectsService } from 'src/app/core/services/projects.service';
import { InvoicesModalComponent } from '../invoices-modal/invoices-modal.component';
import { NewBillAtaModalComponent } from '../new-bill/new-bill-ata-modal/new-bill-ata-modal.component';
import { NewBillPaymentModalComponent } from '../new-bill/new-bill-payment-modal/new-bill-payment-modal.component';
import { NewBillWeeklyModalComponent } from '../new-bill/new-bill-weekly-modal/new-bill-weekly-modal.component';
import { NewBillService } from '../new-bill/new-bill.service';
import { FortnoxApiService } from "src/app/core/services/fortnoxApi.service";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
declare var $;

@Component({
  selector: 'app-edit-bill',
  templateUrl: './edit-bill.component.html',
  styleUrls: ['./edit-bill.component.css']
})
export class EditBillComponent implements OnInit {

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
    public checkedProjecName: boolean = true;
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
    public removedPaymantArticles: any = [];
    public allProjectsSubscriber: Subscription = new Subscription();
    public allReferencesSubscriber: Subscription = new Subscription();
    public allProjectClientNamesSubscription: Subscription = new Subscription();
    public allweeklyReports: Subscription = new Subscription();
    public weeklyReportSub: Subscription = new Subscription();
    public createForm: FormGroup;
    public back = "/invoices";
    public invoice;
    public status;
    public activeProjectId: any;
    public selectedActivity: any = "";
    private queryParSub: Subscription;
    public order_number:any;
    public parent_invoice:any;
    public contentHasChanged = false;
    public locked: Boolean = false;
    public rows = [];
    public removedArticles:any[] = [];
    public visible_markningskrav_check:boolean = true;
    public sumOfArrearsInvoiced = 0;
    public invoices:any[] = [];
    public sumOfArrearsChecked;number = 0;
    public get_of_sum_of_arrears_invoiced = 0;
    public get_total_sum = 0;
    currency = JSON.parse(sessionStorage.getItem("currency"));
    public disableInput:any = null;
    public from_summary:boolean = false;
    public total_of_final_invoices:number = 0;
    public allow_payment_plan_invoice:boolean = false;
    public payment_plan_all_data: any;
    public all_invoiced_total_of_final_invoices:boolean = false;
    public final_invoice;
    public enabledAccounts;
    public ataSpinner:boolean = false;
    public weeklyReportSpinner:boolean = false;
    public paymentPlanSpinner:boolean = false;
    public from_edit:boolean = false;

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
      private paymentplanService: PaymentPlanService,
      private fortnoxApi: FortnoxApiService,
    ) {
      this.language = sessionStorage.getItem("lang");
      if (this.language == "en") this.week = "Week";
      else this.week = "Vecka";
    }

    ngOnInit(): void {

      if(!this.userDetails.show_invoices_Global) {
           this.router.navigate(["/home"]);
      }

      if(!this.currency) {
          this.currency = 'SEK';
      }
    /* this.getAllProjects(); */
    this.route.queryParamMap.subscribe((params) => {
      this.order_number = params.get("order_number") || null;
      this.parent_invoice = params.get("parent_invoice") || null;
      this.from_summary = params.get("from_summary") ? true : false;
    });
/*
    this.projects = this.route.snapshot.data["projects"].map((project) => {
      project["finalName"] = `${project["CustomName"]} - ${project["name"]}`;
      return project;
    });
*/
    this.projects = this.route.snapshot.data["projects"].data.map((project) => {
      project["finalName"] = `${project["CustomName"]} - ${project["name"]}`;
      project["clientsProjectName"] = "some clientProjectName";
      return project;
    });

    this.clients = this.route.snapshot.data["clients"].data;
    this.materialProperties = this.route.snapshot.data["materialProperties"];
    this.units = this.route.snapshot.data["units"];
    this.invoice = this.route.snapshot.data["invoice"];
    this.markningskrav = this.invoice.labeling_requirements;
    this.enabledAccounts = this.route.snapshot.data["enabledAccounts"];

    if(this.invoice.credit == 1 || this.invoice.Status == 6 || !this.userDetails.create_invoices_Global) {
      this.disableInput = true;
    }

    if(!this.invoice.sent_to_fortnox && !this.invoice.manually_accepted) {
      this.sendEconomy = '#82A7E2';
    }

    if(this.invoice.Status == 1) {
      this.dellete = '#82A7E2';
    }

    this.createForms();

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

    this.setInitialValueForEditFields();

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
        weekStart: 1,
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

      $("#dateSelectInvoiceDate").datepicker();

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
        this.fillData();
        if(this.invoice.type != 'PAYMENTPLAN') {
            this.calculateTotalSum();
            this.pushRow();
        }
    }


    getAllProjects() {
      this.allProjectsSubscriber = this.newBillService
        .getAllProjects()
        .subscribe({
          next: (projects) => (this.projects = projects),
        });
    }

    emitedSelectedProject(project) {

      if (!project) return;
      if (project.id !== "-1") {
        this.loadingSpinner = true;

        this.projectsService.getProject(project.id).then((project) => {

          this.setInitialValueForFields(project);
          this.selectedProject = project;
          this.loadingSpinner = false;
        });

        this.renderDataInTable = [];
        this.whichBtnIsSelected.ata = false;
        this.whichBtnIsSelected.payment = false;
        this.whichBtnIsSelected.weekly = false;
        this.totalSum = 0;
        this.markningskrav = this.invoice.labeling_requirements;
        this.getAtas(project.id);
        this.getWeeklyReports(project.id);
        this.getPaymentPlan(project.id);
        this.clearRows();
        //this.pushRow();
        //this.pushRow();
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
      this.createForm.get('reference').patchValue(reference.finalName);
      this.createForm.get('reference_id').patchValue(reference.Id);
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

    selectedCategory(e: string) {
      this.createForm.get('category').patchValue(e);
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
        if (objectWeek.includeInInvoice) {
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
                if (weekli.includeInInvoice) sumOfWeeklyReports += weekli.total;
            }
            item.pricePerUnit = sumOfWeeklyReports;
            item.quantity = 1;
            item.deduct = 0;
            item.Account = item.Account;
        }else {
        item.description = "ÄTA-" + item.ataNumber;
            item.quantity = 1;
            item.pricePerUnit = item.total;
            item.deduct = 0;
        }

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

        let invoice_index = this.invoice.Articles.findIndex(
          (obj) => obj.AtaId === item.ataId
        );

        if(invoice_index > -1){
            item.Id = this.invoice.Articles[invoice_index].Id;
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

      //this.renderDataInTable.push(item);
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
        makeid: this.makeid(20),
        Account: ''
    };

    this.renderDataInTable.push(row);
    this.fillArrayFormForPaymentPlan();
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

          //  if(this.articleForm.value[index].Total > 0) {
                this.pushRow();
          //  }
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
        }
        this.pushRow();
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

        if(this.invoice.credit == '1' || !this.userDetails.create_invoices_Global) {
          return;
        }

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

        if(this.invoice.type == "PAYMENTPLAN") {
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
          this.markningskrav = this.invoice.labeling_requirements;
        }

        if(this.invoice.type == "ATA" && job.ataId != '') {

            let ata_index = this.atasNotInvoiced.findIndex(
              (obj) => obj.ataId === job.ataId
            );

            if(ata_index > -1) {
                this.atasNotInvoiced[ata_index].checked = false;
                this.atasNotInvoiced[ata_index].checked2 = false;
            }

            let ata_article_index = this.articleForm.value.findIndex(
              (obj) => obj.AtaId === job.ataId
            );

            if(ata_article_index > -1) {
                this.articleForm.value.splice(ata_article_index, 1);
                this.articleForm.controls.splice(ata_article_index, 1);
            }
        }

        if(this.invoice.type == "WEEKLY_REPORT" && job.makeid == '') {


            let wr_index = this.weeklyReportsNotInvoiced.findIndex(
              (obj) => obj.name === job.description
            );

            if(wr_index > -1) {
                this.weeklyReportsNotInvoiced[wr_index].checked = false;
                this.weeklyReportsNotInvoiced[wr_index].checked2 = false;
            }

            let wr_ata_article_index = this.articleForm.value.findIndex(
              (obj) => obj.Description === job.description
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
            (article) => article.description == item.name
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

    async initializeAtaAndFIlter(labeling = true) {
      //this.renderDataInTable = [];
      this.whichBtnIsSelected.ata = true;
      console.log(this.atasNotInvoiced) ///ostaviti

      if(this.invoice.Status == 1 || this.invoice.Status ==  0) {

          for (let item of this.atasNotInvoiced) {

              if (item.checked || item.checked2) {

                  this.addAditionalRowToObjectATA(item);

                  let deleted_index = this.removedArticles.findIndex(
                      (obj) => obj.ataId == item.ataId
                  );

                  if(deleted_index > -1){
                      this.removedArticles.splice(deleted_index, 1);
                  }
              }
            //  item.Unit = item.Unit && item.Unit.length > 0 ? item.Unit : '';
              if(item.is_deleted) {

                  let renderDataInTable_index = this.renderDataInTable.findIndex(
                    (obj) => obj.ataId === item.ataId
                  );

                  if(renderDataInTable_index > -1) {
                      this.renderDataInTable.splice(renderDataInTable_index, 1);
                  }

                  let index = this.articleForm.value.findIndex(
                      (obj) => obj.AtaId === item.ataId
                  );

                  if(index > -1) {
                      this.removedArticles.push(item);
                      this.articleForm.value.splice(index, 1);
                      this.articleForm.controls.splice(index, 1);
                  }
              }
          }
        this.fillArrayForm();
        this.calculateTotalSum();
        if(labeling) {
          this.getMarkningskrav();
        }
      }

    //  if(this.invoice.type == 'ATA') {
       // this.sortAta();
    //  }
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

    openAtaModal() {


        if(this.parent_invoice) {
            this.atasNotInvoiced = this.atasNotInvoiced.filter((item) => item.WR_INVOICE_IDS);
        }

      this.paymentPlanArray = [];
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.maxHeight = "500px";
      const neededObjectData = {
        neededArray: this.atasNotInvoiced,
        isEdit: true
      }
      dialogConfig.data = neededObjectData;
      dialogConfig.panelClass = 'app-full-bleed-dialog';
      const dialogRef = this.dialog.open(NewBillAtaModalComponent, dialogConfig);

      dialogRef.afterClosed().subscribe({
        next: (data) => {

          if (data) {
            this.atasNotInvoiced = data;
            this.initializeAtaAndFIlter();
          }
        },
      });
    }

    openWeeklyReportModal() {
      if(this.parent_invoice) {
         this.weeklyReportsNotInvoiced = this.weeklyReportsNotInvoiced.filter((item) => item.checked);
      }
      this.paymentPlanArray = [];
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.maxHeight = "500px";
      dialogConfig.data = this.weeklyReportsNotInvoiced;
      dialogConfig.panelClass = 'app-full-bleed-dialog';
      const dialogRef = this.dialog.open(
        NewBillWeeklyModalComponent,
        dialogConfig
      );

      dialogRef.afterClosed().subscribe({
        next: (data) => {
            //this.removedArticles = [];

            if (data) {

                this.weeklyReportsNotInvoiced = data;
                //this.renderDataInTable = [];
                this.whichBtnIsSelected.weekly = true;
                for (let item of this.weeklyReportsNotInvoiced) {

                    if(!item.makeid) {
                        item.makeid = '';
                    }


                    if (item.checked) {
                      this.addAditionalRowToObjectWeekly(item);

                      let deleted_index = this.removedArticles.findIndex(
                          (obj) => obj.description == item.name
                      );
                      if(deleted_index > -1){
                          this.removedArticles.splice(deleted_index, 1);
                      }
                    }

                    if(item.is_deleted) {

                        let index = this.articleForm.value.findIndex(
                          (obj) => obj.Description === item.name
                        );

                        let renderDataInTable_index = this.renderDataInTable.findIndex(
                          (obj) => obj.description === item.name
                        );

                        if(renderDataInTable_index > -1) {
                            this.renderDataInTable.splice(renderDataInTable_index, 1);
                        }

                        if(item.id) {
                            item.ReportId = item.id;
                        }

                        if(item.invoice_article_id) {
                            item.Id = item.invoice_article_id;
                        }

                        item.ReportId = item.id;
                        item.Id = item.invoice_article_id;

                        if(index > -1) {
                            this.removedArticles.push(item);
                            this.articleForm.value.splice(index, 1);
                            this.articleForm.controls.splice(index, 1);
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
    addAditionalRowToObjectPayment(item, allow_push = true) {

        // Ove 4 linije ispod vjerovatno ne trebaju
        // ali nek stoje za svaki slucaj
        this.paymentPlanChildArray = [];
        item.pricePerUnit = "";
        item.deduct = "";
        item.quantity = "";
        item.DeliveredQuantity = null;
        item.total = "";
        item.sumOfArrears = 0;
        item.Account = '';
        this.paymentPlanChildArray = [];

        for (let articleKey of item.articleKeys) {
            item.articles[articleKey][0].deduct = 0;
            item.articles[articleKey][0].quantity = 1;
            item.articles[articleKey][0].total = this.calculateTotalOfRow(
              item.articles[articleKey][0].quantity,
              item.articles[articleKey][0].Amount,
              item.articles[articleKey][0].deduct
            );

            item.articles[articleKey][0].ataId = 0;
            item.articles[articleKey][0].MaterialId = 0;
            item.articles[articleKey][0].ReportIds = 0;
            item.articles[articleKey][0].ReportId = 0;
            item.articles[articleKey][0].AtaNumber  = '';
            item.articles[articleKey][0].Description = item.articles[articleKey][0].Name;
            item.articles[articleKey][0].DeliveredQuantity = item.articles[articleKey][0].quantity;
            item.articles[articleKey][0].Unit = 'pieces';
            item.articles[articleKey][0].Price = item.articles[articleKey][0].Amount;
            item.articles[articleKey][0].Deduct = item.articles[articleKey][0].deduct;
            item.articles[articleKey][0].PaymentPlanId = item.paymentPlanId;
            item.articles[articleKey][0].MonthId = item.id;
            item.articles[articleKey][0].project_plan_article_id = item.articles[articleKey][0].id;
            item.articles[articleKey][0].Account = item.articles[articleKey][0].Account;

            this.totalSum += parseInt(item.articles[articleKey][0].total);
            item.sumOfArrears -= Number(
                item.articles[articleKey][0].Arrears.toString().replace(/\s/g, "").replace(",", ".")
            );
            this.totalSum -= Number(
                item.articles[articleKey][0].Arrears.toString().replace(/\s/g, "").replace(",", ".")
            );

           // this.sumOfInvoiced = item.sumOfArrears;
            this.paymentPlanChildArray.push(item.articles[articleKey][0]);
        }

        this.sumOfInvoiced += item.sumOfArrears;
        item.loopThroughArticles = this.paymentPlanChildArray;
        if(allow_push) {
            this.renderDataInTable.push(item);
        }
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

        if(!this.userDetails.create_invoices_Global) {
          return;
        }

        if(this.delete_arrticle(i)) {
            this.sumOfInvoiced = 0;
            if(!job.MonthId) {
              job.MonthId = job.loopThroughArticles.length > 0 ? job.loopThroughArticles[0].MonthId : job.id;
            }
            job.loopThroughArticles.forEach((article, index) => {
              this.removedArticles.push(article);
            });
            this.removedArticles.push(job);


            this.paymentPlansNotInvoiced.forEach((article, index) => {
                if(article.id == job.MonthId) {
                    this.paymentPlansNotInvoiced[index].checked = false;
                    this.paymentPlansNotInvoiced[index].checked2 = false;
                    this.paymentPlansNotInvoiced[index].check = false;
                }
            });

            this.articleForm.value.forEach((article, index) => {
                if(article.MonthId == job.MonthId) {
                    this.articleForm.value.splice(index, 1);
                    this.articleForm.controls.splice(index, 1);
                }
            });

            this.renderDataInTable.forEach((item, index) => {
                if(item.MonthId == job.MonthId) {
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

            this.removedPaymantArticles.push(job.MonthId);

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
      (obj) => obj.MonthId == job.MonthId
    );

    if( index3 > -1 ) {
        this.articleForm.value.splice(index3, 1);
        this.articleForm.controls.splice(index3, 1);
    }

    let index4 = this.articleForm.value.findIndex(
      (obj) => obj.MonthId == job.MonthId
    );

    if( index4 > -1 ) {
        this.refreshIfNotAllArticlesDeleted(job);
    }
  }

    openPaymentPlanModal() {

        const paymentPlansNotInvoiced = this.paymentPlansNotInvoiced.filter((x) => x.invoice_id == 0 || x.invoice_id == this.invoice.Id );

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
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.maxHeight = "500px";
        //dialogConfig.data = paymentPlansNotInvoiced;
        dialogConfig.data = {'paymentPlansNotInvoiced': paymentPlansNotInvoiced, 'total_of_final_invoices': this.total_of_final_invoices, 'due_date': this.project.TehnicReview, 'all_invoiced_total_of_final_invoices': this.all_invoiced_total_of_final_invoices, 'from_component': 'edit', 'final_invoice': this.final_invoice};
        dialogConfig.panelClass = 'app-full-bleed-dialog';
        const dialogRef = this.dialog.open(
            NewBillPaymentModalComponent,
            dialogConfig
        );

        dialogRef.afterClosed().subscribe({
            next: (data) => {

            if (data) {

                this.paymentPlanArray = data;
                this.totalSum = 0;
                this.renderDataInTable = [];
                this.whichBtnIsSelected.payment = true;
                this.sumOfInvoiced = 0;
                this.articleForm.controls = [];
               // this.sortingPaymentArticlesForTable();
                for (let item of this.paymentPlanArray) {
                    let index2 = this.articleForm.value.findIndex(
                      (obj) => obj.Description == item.description
                    );

                    if (item.checked) {
                        this.addAditionalRowToObjectPayment(item);
                    }

                    let paymentPlansNotInvoiced_index3 = this.paymentPlansNotInvoiced.findIndex(
                        (obj) => obj.id == item.id
                    );

                    if(item.is_deleted && index2 > -1) {

                        this.removedPaymantArticles.push(this.articleForm.value[index2].MonthId);

                        if(paymentPlansNotInvoiced_index3 > -1) {
                            this.paymentPlansNotInvoiced[paymentPlansNotInvoiced_index3].check = false;
                            this.paymentPlansNotInvoiced[paymentPlansNotInvoiced_index3].checked = false;

                            if(index2 > -1 && this.removedPaymantArticles.includes(this.articleForm.value[index2].MonthId)){
                                this.articleForm.value.forEach((article_for_delete, article_for_delete_index) => {
                                    if(article_for_delete.MonthId == this.articleForm.value[index2].MonthId) {
                                        this.articleForm.value.splice(article_for_delete_index, 1);
                                        this.articleForm.controls.splice(article_for_delete_index, 1);
                                    }
                                });
                                this.articleForm.value.splice(index2, 1);
                                this.articleForm.controls.splice(index2, 1);
                            }
                        }
                    }else if(index2 > -1 && this.removedPaymantArticles.includes(this.articleForm.value[index2].MonthId)){

                        let previously_removed_index = this.removedPaymantArticles.findIndex(
                          (id) => id == this.articleForm.value[index2].MonthId
                        );
                        this.removedPaymantArticles.splice(previously_removed_index, 1);
                    }else  if(paymentPlansNotInvoiced_index3 > -1) {
                        this.paymentPlansNotInvoiced[paymentPlansNotInvoiced_index3].check = item.check;
                        this.paymentPlansNotInvoiced[paymentPlansNotInvoiced_index3].checked = item.checked;
                    }

                      if(item.is_deleted) {
                     //   item.MonthId = item.id;
                        /*if(item.loopThroughArticles && item.loopThroughArticles.length > 0) {
                          item.loopThroughArticles.forEach((article, index) => {
                            this.removedArticles.push(article);
                          });
                        }*/

                        for (let articleKey of item.articleKeys) {
                          item.articles[articleKey].forEach((article, index) => {
                            this.removedArticles.push(article);
                          });
                        }
                        this.removedArticles.push(item);
                      }

                }
                this.fillArrayFormForPaymentPlan();
                this.calculateTotalSumWhenPayment();
                this.getMarkningskrav();
              }
            },
        });
    }

    getFinalResultForAtaBtn(): boolean {

      if (
        (this.atasNotInvoiced.length == 0 && this.atasInvoiced.length == 0) ||
        this.disabledButton ||
        this.disableAta || this.atasNotInvoiced.length == 0
        || this.invoice.Status != 1 || this.invoice.credit == 1
        || !this.userDetails.create_invoices_Global
        || this.invoice.type != 'ATA'
      ) {

        return false;
      }

      if (
        (!this.whichBtnIsSelected.ata &&
          !this.whichBtnIsSelected.payment &&
          !this.whichBtnIsSelected.weekly) ||
        (this.whichBtnIsSelected.ata &&
          !this.whichBtnIsSelected.payment &&
          !this.whichBtnIsSelected.weekly) ||
          !this.invoice.article_type_selected
      ) {
        return true;
      }

      return false;
    }

    getFinalResultForWeeklyBtn(): boolean {

      if (
        (this.weeklyReportsNotInvoiced.length == 0 &&
          this.weeklyReportsInvoiced.length == 0) ||
        this.disabledButton ||
        this.disableOngoing || this.invoice.Status != 1 ||
        this.project?.payment_type == 'PAYMENT' ||
        !this.userDetails.create_invoices_Global ||
        this.invoice.type != 'WEEKLY_REPORT'
      )
        return false;

      if (
        (!this.whichBtnIsSelected.ata &&
          !this.whichBtnIsSelected.payment &&
          !this.whichBtnIsSelected.weekly) ||
        (!this.whichBtnIsSelected.ata &&
          !this.whichBtnIsSelected.payment &&
          this.whichBtnIsSelected.weekly) ||
        !this.invoice.article_type_selected
      )
        return true;

      return false;
    }

    getFinalResultForPaymentBtn(): boolean {

      if (
        (this.paymentPlans.length == 0 && this.invoice.final_invoices == 0) ||
        this.final_invoice != 0 ||
        this.disabledButton ||
        this.disablePaymentPlan ||
        this.invoice.manually_accepted ||
        this.invoice.sent_to_fortnox || this.invoice.Status != 1 ||
        (this.project && this.project.payment_type == 'WEEKLY_REPORT' && this.project.debit_Id == 4)
        || !this.userDetails.create_invoices_Global ||
          this.invoice.type != 'PAYMENTPLAN'
      ) {
        return false;
      }

      if (
        (!this.whichBtnIsSelected.ata &&
          !this.whichBtnIsSelected.payment &&
          !this.whichBtnIsSelected.weekly) ||
        (!this.whichBtnIsSelected.ata &&
          this.whichBtnIsSelected.payment &&
          !this.whichBtnIsSelected.weekly)
      ) {
        return true;
      }

      return false;
    }

    ngOnDestroy(): void {
      this.allProjectsSubscriber.unsubscribe();
      this.allReferencesSubscriber.unsubscribe();
      this.allProjectClientNamesSubscription.unsubscribe();
      this.allweeklyReports.unsubscribe();
      this.weeklyReportSub.unsubscribe();
      if (this.queryParSub) this.queryParSub.unsubscribe();
    }

    public whichBtnIsSelected = {
      ata: false,
      weekly: false,
      payment: false,
    };

    onRemoveCheckedArr(job) {
      if(this.invoice.credit == '1' || !this.userDetails.create_invoices_Global) {
        return;
      }
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
        reference: [this.invoice.Reference, Validators.required],
        reference_id: [this.invoice.ReferenceId, Validators.required],
        type: [this.types[0], Validators.required],
        note1: [""],
        note2: [""],
        comment1: "",
        comment2: "",
        invoiceDate: "",
        invoice_reference: "",
        maturityDate: "",
        parentInvoice: this.invoice.parent,
        articleForm: this.fb.array([
          this.fb.group({
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
            project_plan_article_id: '',
            Arrears: '',
            makeid: '',
            Account: ''
          }),
        ]),
      });
    }

    fillArrayFormForPaymentPlan() {

        this.articleForm.clear();
        this.renderDataInTable.forEach((item, index) => {

        //    let index2 = this.articleForm.value.findIndex(
        //      (obj) => obj.Description == item.description
         //   );

         //   if(index2 == -1) {

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
                    ReportId: '',
                    AtaNumber: '',
                    Description: item.description,
                    DeliveredQuantity: null,
                    Unit: "",
                    Price: 0,
                    Deduct: 0,
                    Total: 0,
                    week: "",
                    MonthId: item.id,
                    PaymentPlanId: "",
                    project_plan_article_id: "",
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
                        ReportId: '',
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
                        project_plan_article_id: Number(article.project_plan_article_id),
                        Arrears: article?.Arrears,
                        Account: article?.Account
                    });
                    total += Number(article.total);
                    this.articleForm.push(newFormControl);
                });
                this.renderDataInTable[index].total = total;
            }
        });
    }

    fillArrayForm() {

        this.articleForm.clear();

        for(let item of this.renderDataInTable) {

          if(item.ataId || item.revision) {
            this.invoice.article_type_selected = true;
            if(item.ataId) {
              this.invoice.type = 'ATA';
            }else if(item.revision) {
              this.invoice.type = 'WEEKLY_REPORT';
            }
            this.initializeBtnSelected();
          }

            if(item.id) {
              item.Id = item.id
            }

            item.checked = true;
//            let index = -1;
            let weeklyReportsString = "";
            if (item.ataId && item.PaymentType != 2 && item.PaymentType != 3 && item.weeklyReports) {

                const selectedWr = item.weeklyReports.filter((x) => x.includeInInvoice);
                weeklyReportsString = selectedWr.map((wr) => wr.wrId).join(",");
            }
/*
            if(!item.ataId) {
                weeklyReportsString = item.id;
            }
*/
            if(this.invoice.type == 'WEEKLY_REPORT') {
              if(item.ReportId) {
                weeklyReportsString = item.Id;
              }else {
                weeklyReportsString = item.Id;
              }
            }

/*
            if(item.ataId ) {
                index = this.articleForm.value.findIndex(
                  (obj) => obj.AtaId === item.ataId
                );
            }else {
                index = this.articleForm.value.findIndex(
                  (obj) => obj.ReportId === item.id
                );
            }
*/
                const newFormControl = this.fb.group({
                  AtaId: item.ataId,
                  MaterialId: "",
                  ReportId: weeklyReportsString,
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
                  project_plan_article_id: '',
                  Arrears: item?.Arrears,
                  Id: item?.Id,
                  makeid: item.makeid ? item.makeid : '',
                  Account: item?.Account
                });

/*
                index = this.articleForm.value.findIndex(
                  (obj) => obj.AtaId === item.ataId
                );
*/
                this.articleForm.push(newFormControl);

          /*  if(index == -1) {

                const newFormControl = this.fb.group({
                  AtaId: item.ataId,
                  MaterialId: "",
                  ReportId: weeklyReportsString,
                  AtaNumber: item.ataNumber,
                  Description: item.description,
                  DeliveredQuantity: item.quantity,
                  Unit: "",
                  Price: item.pricePerUnit,
                  Deduct: item.deduct,
                  Total: item.total,
                  week: "",
                  MonthId: "",
                  PaymentPlanId: "",
                  project_plan_article_id: '',
                  Arrears: item?.Arrears
                });


                index = this.articleForm.value.findIndex(
                  (obj) => obj.AtaId === item.ataId
                );

                this.articleForm.push(newFormControl);
            }else {

                this.articleForm.controls[index].patchValue({
                    AtaId: item.ataId,
                    MaterialId: "",
                    ReportId: weeklyReportsString,
                    AtaNumber: item.ataNumber,
                    Description: item.description,
                    DeliveredQuantity: item.quantity,
                    Unit: "",
                    Price: item.pricePerUnit,
                    Deduct: item.deduct,
                    Total: item.total,
                    week: "",
                    MonthId: "",
                    PaymentPlanId: "",
                    project_plan_article_id: '',
                    Arrears: item?.Arrears,
                    Id: item?.Id
                }, {onlySelf: true});
            }*/
        }
    }



    setAccount(account_data, job) {

      job.Account = account_data;
      const index = this.articleForm.value.findIndex(
          (article) => article.makeid === job.makeid
      );

      if(index > - 1) {

        this.articleForm.value[index].Account = account_data;
      }
    }

    setInitialValueForFields(project) {
      this.project = project;
      this.referencesOfProject = project.responsiblePeople;

      this.initializeUser();
      this.projectClientName = project.clientName;
      this.createForm.get('project').patchValue(project);
      this.createForm.get('project_name').patchValue(project.name);
      this.createForm.get('activity').patchValue(project.activity);
      this.createForm.get('client').patchValue(project.clientName);
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
      this.createForm
        .get("markningskrav")
        .patchValue(project.markningskrav);
      this.loadingSpinner = false;
      this.getClient();
      this.createForm.get('reference').patchValue(this.invoice.Reference);
      this.createForm.get('reference_id').patchValue(this.invoice.ReferenceId);
      let selected_reference = {
        'Id': this.invoice.ReferenceId,
        'finalName': this.invoice.Reference
      }

      this.emitedSelectedReference(selected_reference);

    }


    public category = '';
    public BetaIningWriting = '';
    public editableProject: {CustomName: string} = {
      CustomName: this.translate.instant('Please select Project')
    };

    setInitializeProjectActivity(project_id, projects) {
      projects.forEach((project) => {
        if(project.id == project_id) {
          this.project = project;
          return;
        }
      });
    }

    findRecursiveById(projects, project_id) {
        for (let project of projects) {
          if (project.id === project_id) return project

          if (project.activities) {
            let desiredProject = this.findRecursiveById(project.activities, project_id)
            if (desiredProject) return desiredProject
          }
        }
        return false
    }

    setInitializeProject(project_id) {
        this.project = this.findRecursiveById(this.projects, project_id);
    /*  this.projects.forEach((project) => {
        if(project.id == project_id) {
          this.project = project;
          return;
        }

        if(project.activities.length > 0) {
          this.setInitializeProjectActivity(project_id, project.activities);
        }
      });*/
    }
    setInitialValueForEditFields() {

      this.setInitializeProject(this.invoice.ProjectId);
      if(this.invoice.type =='PAYMENTPLAN') {
        this.getSumOfArrerars(this.project.id, this.invoice.Id);
      }

      this.emitedSelectedProject(this.project);
      this.createForm.get('invoiceDate').patchValue(this.invoice.InvoiceDate);
      this.createForm.get('maturityDate').patchValue(this.invoice.DueDate);
      this.createForm.get('comment1').patchValue(this.invoice.Note1);
      this.createForm.get('comment2').patchValue(this.invoice.Note2);
      this.selectedCategory(this.invoice.Type);
      this.category = this.invoice.Type;
      const dayDifference = this.getDateDifference(
        this.createForm.get('invoiceDate').value,
        this.createForm.get('maturityDate').value
      );
      this.BetaIningWriting = this.whatNeedToBePaymentTerms(dayDifference);
      this.editableProject.CustomName = this.invoice.Project;
      this.initializeCheckedArray();
    }



    initializeBtnSelected() {

      switch (this.invoice.type) {
        case 'ATA':
          this.whichBtnIsSelected.ata = true;
          this.whichBtnIsSelected.weekly = false;
          this.whichBtnIsSelected.payment = false;
          break;
        case 'WEEKLY_REPORT':
          this.whichBtnIsSelected.ata = false;
          this.whichBtnIsSelected.weekly = true;
          this.whichBtnIsSelected.payment = false;
          break;
        case 'PAYMENTPLAN':
          this.whichBtnIsSelected.ata = false;
          this.whichBtnIsSelected.weekly = false;
          this.whichBtnIsSelected.payment = true;
          this.sortingPaymentArticlesForTable();
        break;
        default:
          this.whichBtnIsSelected.ata = true;
          this.whichBtnIsSelected.weekly = false;
          this.whichBtnIsSelected.payment = false;
         // this.sortingPaymentArticlesForTable();
      }
    }

    initializeCheckedArray() {

      this.initializeBtnSelected();

      for (let item of this.invoice.Articles) {
        if (item.project_property_type) {
          switch(item.project_property_type) {
            case 'projectName':
              this.checkedArr.push({
                id: 1,
                ProjectNumber: item.Description,
                type: 'projectName'
              });
              this.checkedProjecName = true;
              break;
            case 'projectNumber':
              this.checkedArr.push({
                id: 2,
                ProjectNumber: item.Description,
                type: 'projectNumber'
              });
              this.checkedProjectNumber = true;
              break;
            case 'resursKonto1':
              this.checkedArr.push({
                id: 3,
                ProjectNumber: item.Description,
                type: 'resursKonto1'
              });
              this.checkedProjectKonto = true;
              break;
            default:
              this.checkedArr.push({
                id: 4,
                ProjectNumber: item.Description,
                type: 'marking'
              });
              this.checkedMarkningskrav = true;
          }
        } else {
          if (!item.Name) continue;

          item.deduct = item.Deduct;
          item.pricePerUnit = item.Price;
          item.quantity = item.Quantity;
          item.description = item.Description;
          item.Amount = item.Price;
          item.Account = item.Account;
          item.total = this.calculateTotalOfRow(item.quantity, item.pricePerUnit, item.deduct);
          item.checked = true;

          if (this.invoice.type != "PAYMENTPLAN") this.renderDataInTable.push(item);
        }

      }
    }

    sortingPaymentArticlesForTable() {

      const forRenderData = [];
      for (let item of this.invoice.Articles) {
        if (!item.project_property_type) forRenderData.push(item);
      }

      for (let item of forRenderData) {
        if(item.parent === "0") item.loopThroughArticles = [];
        else {
          for (let item2 of forRenderData) {
               // if (item.checked) {
                //    this.addAditionalRowToObjectPayment(item2);
              //  }
            if (item2.Id === item.parent) item2.loopThroughArticles.push(item);
          }
        }
      }

      for (let item of forRenderData) {
        if (item.parent === "0") {
          this.renderDataInTable.push(item);
        }
      }
      this.paymentPlanArray = this.renderDataInTable;
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

    initializeUser() {
      this.references = [];
      let current_user = {
        finalName: this.userDetails.firstname + " " + this.userDetails.lastname,
        id: this.userDetails.user_id,
        Id: this.userDetails.user_id,
      };
      this.referencesOfProject.push(current_user);
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
       // this.pushRow();
       // this.pushRow();
      } else {
        this.createForm.get("client").patchValue("");
        this.disabledButton = true;
        this.activityProjects = [];
        this.atasForm.controls["ataSelected"].patchValue(false);
        this.atas = [];
        this.weeklyReports = [];

      }

      this.createForm.get('reference').patchValue(this.invoice.Reference);
      this.createForm.get('reference_id').patchValue(this.invoice.ReferenceId);
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
        this.ataSpinner = true;
        this.ataService.getAllAtasForInvoice(projectId, this.invoice.Id).subscribe((res: any) => {
          if (res.status) {
            this.ataSpinner = false;
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
                  return (ata.financeId == 0 || ata.financeId == this.invoice.Id) ? ata : null;
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
              let name = article.Name ? article.Name.split(" ") : '';
              if (name.length > 1) {
                articleArray.push(article);
              }
            });
            this.atasInvoiced = this.atasInvoiced.concat(articleArray);

          }
            if(this.invoice.type == 'ATA') {
              this.initializeAtaAndFIlter(false);
            }

          this.initSpinner();
        });
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

    get paymentPlanForm_() {
      return this.paymentPlanForm.get("paymentPlans") as FormArray;
    }

    getSumOfArrerars(projectId, invoice_id) {
      this.paymentplanService.getSumOfArrerars(projectId, invoice_id).subscribe((result) => {
        if(result['status']) {
          this.get_of_sum_of_arrears_invoiced = result['data'];
          this.get_total_sum = result['paymentplan_total'];
        }
      });
    }

    totalSumResult() {

      if(this.invoice.type == "PAYMENTPLAN") {
          return this.get_total_sum;
      }else {
          return this.totalSum;
      }
    }

    initSpinner()   {

      if(!this.ataSpinner && !this.weeklyReportSpinner && !this.paymentPlanSpinner) {
        this.loadingSpinner = false;
      }else {
        this.loadingSpinner = true;
      }
    }

    getPaymentPlan(projectId) {

        this.totalSum = 0;
        if(this.invoice.type == 'PAYMENTPLAN') {

            this.paymentPlans = [];
            this.paymentPlansNotInvoiced = [];
            //this.paymentPlanForm_.clear();
            this.paymentPlanSpinner = true;
            this.paymentplanService.getAcceptedPaymentPlan(projectId).subscribe((reports) => {
                this.paymentPlanSpinner = false;
                this.paymentplanid = reports["data"].length != 0 ? reports["data"][0].ID : "";
                this.paymentPlans = reports["data"].length != 0 ? reports["data"][0].month_span : [];
                this.paymentPlansRows = [];
                this.sumOfArrearsInvoiced = 0;
                this.sumOfArrearsChecked = 0;
                this.allow_payment_plan_invoice = reports["data"].length != 0 ? reports["data"][0].allow_new_invoice : false;
                this.total_of_final_invoices = reports["data"].length != 0 ? reports["data"][0].total_of_final_invoices : 0;
                this.final_invoice = reports["data"].length != 0 ? reports["data"][0].final_invoice : 0;
                this.payment_plan_all_data = reports["data"];
                this.all_invoiced_total_of_final_invoices = reports["data"].length != 0 ?reports["data"][0].all_invoiced_total_of_final_invoices : false;

                this.paymentPlans.forEach((row, i) => {
                  row["paymentPlanNumber"] = reports["data"][0].paymentPlanNumber;
                  row["paymentPlanId"] = reports["data"][0].ID;
                  this.paymentPlansRows = row;
                  row.sumOfArrears = 0;
                  row.sumOfChecked = 0;
                  if (row.articles) {
                    if(row.checked) {
                      if(row.invoice_id != this.invoice.Id) {
                        for (let articleKey of row['articleKeys']) {
                          row.sumOfChecked -= Number(
                              row['articles'][articleKey][0].Arrears.toString().replace(/\s/g, "").replace(",", ".")
                          );
                        }

                        this.sumOfArrearsChecked += row.sumOfChecked;
                      }
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
                  if(this.all_invoiced_total_of_final_invoices) {
                    this.pushRowForPaymentPlan();
                  }
                });

                let disabled = false;
                this.paymentPlansNotInvoiced.forEach((plan, index) => {

                    let total = 0;
                    if(plan.checked) {

                        this.paymentPlanChildArray = [];
                        plan.pricePerUnit = "";
                        plan.Account = "";
                        plan.deduct = "";
                        plan.quantity = "";
                        plan.total = "";
                        plan.sumOfArrears = 0;

                        for (let articleKey of plan.articleKeys) {

                            this.paymentPlansNotInvoiced[index].articles[articleKey][0].deduct = 0;
                            this.paymentPlansNotInvoiced[index].articles[articleKey][0].quantity = 1;
                            this.paymentPlansNotInvoiced[index].articles[articleKey][0].total = this.calculateTotalOfRow(
                              this.paymentPlansNotInvoiced[index].articles[articleKey][0].quantity,
                              this.paymentPlansNotInvoiced[index].articles[articleKey][0].Amount,
                              this.paymentPlansNotInvoiced[index].articles[articleKey][0].deduct
                            );
                            this.paymentPlansNotInvoiced[index].articles[articleKey][0].ataId = 0;
                            this.paymentPlansNotInvoiced[index].articles[articleKey][0].MaterialId = 0;
                            this.paymentPlansNotInvoiced[index].articles[articleKey][0].ReportIds = 0;
                            this.paymentPlansNotInvoiced[index].articles[articleKey][0].ReportId = 0;
                            this.paymentPlansNotInvoiced[index].articles[articleKey][0].AtaNumber  = '';
                            this.paymentPlansNotInvoiced[index].articles[articleKey][0].Description = plan.articles[articleKey][0].Name;
                            this.paymentPlansNotInvoiced[index].articles[articleKey][0].DeliveredQuantity = plan.articles[articleKey][0].quantity;
                            this.paymentPlansNotInvoiced[index].articles[articleKey][0].Unit = 'pieces';
                            this.paymentPlansNotInvoiced[index].articles[articleKey][0].Price = plan.articles[articleKey][0].Amount;
                            this.paymentPlansNotInvoiced[index].articles[articleKey][0].Deduct = plan.articles[articleKey][0].deduct;
                            this.paymentPlansNotInvoiced[index].articles[articleKey][0].PaymentPlanId = plan.paymentPlanId;
                            this.paymentPlansNotInvoiced[index].articles[articleKey][0].MonthId = plan.id;
                            this.paymentPlansNotInvoiced[index].articles[articleKey][0].project_plan_article_id = plan.articles[articleKey][0].id;
                            this.paymentPlansNotInvoiced[index].articles[articleKey][0].Account = plan.articles[articleKey][0].Account;

                            this.paymentPlansNotInvoiced[index].sumOfArrears -= Number(
                                plan.articles[articleKey][0].Arrears.toString().replace(/\s/g, "").replace(",", ".")
                            );

                            if(plan.invoice_id == this.invoice.Id) {
                              this.totalSum += Number(plan.articles[articleKey][0].total);
                              this.totalSum -= Number(
                                  this.paymentPlansNotInvoiced[index].articles[articleKey][0].Arrears.toString().replace(/\s/g, "").replace(",", ".")
                              );
                            }

                            this.paymentPlanChildArray.push(this.paymentPlansNotInvoiced[index].articles[articleKey][0]);
                            total += Number(this.paymentPlansNotInvoiced[index].articles[articleKey][0].total);
                        }
                        //this.sumOfInvoiced += plan.sumOfArrears;
                        this.paymentPlansNotInvoiced[index].loopThroughArticles = this.paymentPlanChildArray;
                        this.paymentPlansNotInvoiced[index].total = total;
                        //this.totalSum += plan.sumOfArrears;
                    }

                    this.paymentPlanForm_.push(
                        this.fb.group({
                            date: new FormControl({ value: this.paymentPlansNotInvoiced[index].date, disabled: disabled }),
                            checkbox: new FormControl({ value: false, disabled: disabled }),
                            total: new FormControl({ value: total, disabled: disabled }),
                            id: new FormControl({ value: this.paymentPlansNotInvoiced[index].id, disabled: disabled }),
                            paymentPlanId: new FormControl({
                              value: this.paymentPlansNotInvoiced[index].paymentPlanId,
                              disabled: disabled,
                            }),
                            month: new FormControl({ value: this.paymentPlansNotInvoiced[index].month, disabled: disabled }),
                            year: new FormControl({ value: this.paymentPlansNotInvoiced[index].year, disabled: disabled }),
                            avst: new FormControl({ value: this.paymentPlansNotInvoiced[index].avst, disabled: disabled }),
                            datenumber: new FormControl({
                              value: this.paymentPlansNotInvoiced[index].datenumber,
                              disabled: disabled,
                            }),
                            paymentPlanNumber: new FormControl({
                              value: this.paymentPlansNotInvoiced[index].paymentPlanNumber,
                              disabled: disabled,
                            }),
                            articles: new FormControl({
                              value: this.paymentPlansNotInvoiced[index].articles,
                              disabled: disabled,
                            }),
                            articleKeys: new FormControl({
                              value: this.paymentPlansNotInvoiced[index].articleKeys,
                              disabled: disabled,
                            }),
                            sumOfArrears: new FormControl({
                              value: this.paymentPlansNotInvoiced[index].sumOfArrears,
                              disabled: disabled,
                            }),

                        })
                    );

                    if (index === 0) {
                      disabled = true;
                    }
                });

                this.sumOfInvoiced = 0;
                this.renderDataInTable.forEach((plan, index) => {
                    plan.sumOfArrears = 0;
                    if(plan.loopThroughArticles) {
                      plan.loopThroughArticles.forEach((article, index) => {
                          plan.sumOfArrears -= Number(
                              article.Arrears.toString().replace(/\s/g, "").replace(",", ".")
                          );
                      });
                    }
                    this.sumOfInvoiced += plan.sumOfArrears;
                });

                this.get_total_sum = 0;
                if(this.invoice.final_invoices == 0) {
                  this.invoice.Articles.forEach((plan, index) => {
                    if(plan.total) {
                     this.get_total_sum += plan.total;
                    }
                  });
                }

                if(this.invoice.final_invoices  ) {

                  this.renderDataInTable.forEach((plan, index) => {
                    if(plan.total) {
                     this.get_total_sum += plan.total;
                    }
                  });
                }

                this.get_total_sum += this.sumOfInvoiced;
                this.initSpinner();
            });
        }
    }

    getWeeklyReports(projectId) {
      this.weeklyReports = [];
      this.weeklyReportSpinner = true;
      this.invoiceService.getWeeklyReports(projectId).subscribe((reports) => {
        this.weeklyReports = reports["data"] || [];
        this.weeklyReportSpinner = false;
        this.weeklyReportsNotInvoiced = this.weeklyReports
          .filter(
            (report) =>
                (report.status != 5 && report.previously_added_but_not_invoiced == 0 && report.financeId == 0) ||
                (report.status != 5 && report.previously_added_but_not_invoiced == 1 && report.financeId == this.invoice.Id)
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
              ReportId: weeklyReportsString,
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
    //  this.pushRow();
    //  this.pushRow();
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
      //  this.pushRow();
      //  this.pushRow();
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
              Unit: "pieces",
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
     // this.pushRow();
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
     // this.pushRow();
      //this.pushRow();
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
          ReportId: weeklyReportsString,
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
          ReportId: weeklyReports,
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
          AtaId: ataId,
          MaterialId: "",
          ReportId: id,
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
        })
      );
    }

    pushMonth(id, name, total, paymentPlanId) {
      let t = Number(total).toFixed(2);
      this.articleForm.push(
        this.fb.group({
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
            makeid: this.makeid(20),
            Account: ''
        };

        this.renderDataInTable.push(row);
        this.fillArrayForm();
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
          ReportId: "",
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
                  (obj) => obj.ataId == article.AtaId
                );
            }else if(this.getFinalResultForWeeklyBtn()) {
                index = this.articleForm.value.findIndex(
                  (obj) => obj.Description == article.description
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
       // this.removedArticles = [];
    }

    unique(array, propertyName) {
       return array.filter((e, i) => array.findIndex(a => a[propertyName] === e[propertyName]) === i);
    }

    async updateInvoice(allow_reload = false) {
      this.loadingSpinner = true;
        const data = this.createForm.value;
        data.checkedArr = this.checkedArr;
        //if(this.invoice.type != 'PAYMENTPLAN') {
          data.articleForm = this.articleForm.value;
        //}

        let total = 0;
        data.paymentplanid = this.invoice.type == 'PAYMENTPLAN' && this.paymentPlans.length > 0  ? this.paymentPlans[0].paymentPlanId : 0;
        data.id = this.invoice.Id;
        data.projectName = this.project.name;
        data.clientId = this.project.client_id;
        data.deletedArticles = this.rows;
        data.articleForm = data.articleForm.filter((row) => {
            return row.Description != "";
        });
        data.payment_plan = true;
        if(!this.getFinalResultForPaymentBtn()) {
            data.payment_plan = false;
        }

        if(this.invoice.type != 'PAYMENTPLAN') {
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
        }else {
            total = Number(this.totalSum);
        }
        data.total = total.toFixed(2);
        const valid = this.validateForm();
        data.removedArticles = this.removedArticles;
        data.removedPaymantArticles = this.removedPaymantArticles;
        data.isInvoiced = 0;
        data.sumOfInvoiced = this.sumOfInvoiced;
        data.note1 = data.comment1;
        data.note2 = data.comment2;
        data.labeling_requirements = this.markningskrav;
        /*if(this.invoice.type == 'ATA') {
          data.labeling_requirements = this.markningskrav;
        }else {
          data.labeling_requirements = "";
        }*/
        data.table_type = this.invoice.type;
        data.all_invoiced_total_of_final_invoices = this.all_invoiced_total_of_final_invoices;

        if (valid /*&& false*/) {
            this.invoiceService.updateInvoice(data).subscribe((res:any) => {
                if (res.status) {
                    this.loadingSpinner = false;
                    this.removedPaymantArticles = [];
                    this.toastr.success(
                      this.translate.instant("Successfully updated invoice."),
                      this.translate.instant("Success")
                    );
                    /*if(this.invoice.type == 'WEEKLY_REPORT') {
                      this.getWeeklyReports(this.project.id);
                    }
                    if(this.invoice.type =='PAYMENTPLAN') {
                      this.getPaymentPlan(this.project.id);
                    }

                    this.invoiceService.getInvoices(0).subscribe((invoices) => {
                        this.invoices = invoices;
                        this.setInitialValueForFields(this.project);
                        this.initializeAtaAndFIlter();
                    });*/

                    if(allow_reload) {
                      window.location.reload();
                    }

                    //this.router.navigate(["/invoices"]);
                }
            });
          }
      }

    ConvertToAbsoluteVal(sumOfInvoiced) {
      sumOfInvoiced = Number(sumOfInvoiced);
    //  let invoiced_total = Math.abs(this.sumOfArrearsChecked);
      sumOfInvoiced = Math.abs(sumOfInvoiced);
      let result = 0;
      if(this.invoice.Status != 1) {
          result =  this.get_of_sum_of_arrears_invoiced
      }else {
          result = (sumOfInvoiced + this.get_of_sum_of_arrears_invoiced).toFixed(2);
      }

      return result;
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
              project_plan_article_id: row.project_plan_article_id,
              Arrears: row?.Arrears,
              Account: row?.Account
            })
          );
        });

     //   this.pushRow();
     //   this.pushRow();
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
            Account: row.value.Account
          });
        }
      }
    });
  }



  whenSaveBtnIsActive() {

    if (
      this.project &&
      this.createForm.get('invoiceDate').value &&
      this.createForm.get('maturityDate').value &&
      this.category &&
      this.renderDataInTable.length > 0 &&
      this.allowSave()
    ) return true;
    return false;
  }

    sendTOFOrtnox(form) {

      //const form = this.createForm.getRawValue();
      let invoice_rows = [];
      if(this.checkedArr && this.checkedArr.length > 0) {
        this.checkedArr.forEach((row) => {
          let object = {
            'Arrears': null,
            'AtaId': null,
            'AtaNumber': null,
            'Deduct': null,
            'DeliveredQuantity': null,
            'Description': row.ProjectNumber,
            'MonthId': '',
            'PaymentPlanId': '',
            'Price': null,
            'Total': null,
            'Unit': null,
            'VAT': 0
          }

          let invoice_index = form.articleForm.findIndex(
            (obj) => obj.Description === row.Description
          );

          if(invoice_index < 0) {
            invoice_rows.push(object);
          }
        });

          let object2 = {
            'Arrears': null,
            'AtaId': null,
            'AtaNumber': null,
            'Deduct': null,
            'DeliveredQuantity': null,
            'Description': null,
            'MonthId': '',
            'PaymentPlanId': '',
            'Price': null,
            'Total': null,
            'Unit': null,
            'VAT': 0
          }
          invoice_rows.push(object2);
      }

    if(this.invoice.type != 'PAYMENTPLAN') {
      form.articleForm.forEach((row) => {
          let object3 = {
            'Arrears': row.Arrears,
            'AtaId': row.AtaId,
            'AtaNumber': row.AtaNumber,
            'Deduct': row.Deduct,
            'DeliveredQuantity': row.DeliveredQuantity,
            'Description': row.Description,
            'Id': row.Id,
            'MaterialId': row.MaterialId,
            'MonthId': row.MonthId,
            'PaymentPlanId': row.PaymentPlanId,
            'ReportId': row.ReportId,
            'Price': row.Total,
            'Total': row.Total,
            'Unit': row.Unit,
            'VAT': 0
          }
          invoice_rows.push(object3);
      });
    }else {

      this.renderDataInTable.forEach((row) => {
          let object3 = {
            'Arrears': row.Arrears,
            'AtaId': row.AtaId,
            'AtaNumber': row.AtaNumber,
            'Deduct': row.Deduct,
            'DeliveredQuantity': row.DeliveredQuantity,
            'Description': row.description,
            'Id': row.Id,
            'MaterialId': 0,
            'MonthId': row.MonthId,
            'PaymentPlanId': row.PaymentPlanId,
            'ReportId': row.ReportId,
            'Price': row.total,
            'Total': row.total,
            'Unit': row.Unit,
            'VAT': 0
          }
          invoice_rows.push(object3);

        if(!this.all_invoiced_total_of_final_invoices) {
            let object4 = null;

            row.loopThroughArticles.forEach((row2) => {
              object4 = {
                'Arrears': row2.Arrears,
                'AtaId': row2.AtaId,
                'AtaNumber': row2.AtaNumber,
                'Deduct': row2.Deduct,
                'DeliveredQuantity': row2.DeliveredQuantity,
                'Description': row2.description,
                'Id': row2.Id,
                'MaterialId': 0,
                'MonthId': row2.MonthId,
                'PaymentPlanId': row2.PaymentPlanId,
                'ReportId': row2.ReportId,
                'Price': row2.total,
                'Total': row2.total,
                'Unit': row2.Unit,
                'VAT': 0
              }
              invoice_rows.push(object4)

            });

            if(object4 && row.sumOfArrears != 0) {
              let object5 = {
                'Arrears': null,
                'AtaId': null,
                'AtaNumber': null,
                'Deduct': null,
                'DeliveredQuantity': 1,
                'Description': 'Innestående medel som debiteras efter besiktning',
                'MonthId': '',
                'PaymentPlanId': '',
                'Price': row.sumOfArrears,
                'Total': null,
                'Unit': null,
                'VAT': 0
              }
              invoice_rows.push(object5);
          }
        }
      });
      if(!this.all_invoiced_total_of_final_invoices) {
        let object6 = {
          'Arrears': null,
          'AtaId': null,
          'AtaNumber': null,
          'Deduct': null,
          'DeliveredQuantity': null,
          'Description': null,
          'MonthId': '',
          'PaymentPlanId': '',
          'Price': null,
          'Total': null,
          'Unit': null,
          'VAT': 0
        }
        invoice_rows.push(object6);

        let object7 = {
          'Arrears': null,
          'AtaId': null,
          'AtaNumber': null,
          'Deduct': null,
          'DeliveredQuantity': 1,
          'Description': "Totalt innehållna medel i projektet: " + this.ConvertToAbsoluteVal(this.sumOfInvoiced),
          'MonthId': '',
          'PaymentPlanId': '',
          'Price': null,
          'Total': null,
          'Unit': null,
          'VAT': 0
        }
        invoice_rows.push(object7);
      }
    }

      const data = {
        DocumentNumber: parseInt(this.invoice.Id),
        Project: this.project.CustomName,
        CustomerNumber: this.client.Number,
        InvoiceDate: form.invoiceDate.split(" ")[0],
        DueDate: form.maturityDate.split(" ")[0],
        Remarks: form.comment2,
        OurReference: form.reference,
        InvoiceID: this.invoice.Id,
        contentHasChanged: this.contentHasChanged,
        YourReference: this.project.invoice_reference_name,
        InvoiceRows: JSON.parse(JSON.stringify(invoice_rows)).map(
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

      data.InvoiceRows = data.InvoiceRows.filter(function (row) {
        return row.Description != "";
      });

      this.fortnoxApi.createInvoice(data).then((res) => {
        this.spinner = false;
        if (res.status) {
          this.toastr.success(
            this.translate.instant("Successfully send invoice to Fortnox."),
            this.translate.instant("Success")
          );
          this.router.navigate(["/invoices"]);
        }else {
            this.toastr.error(
              this.translate.instant(res.msg),
              this.translate.instant("Success")
            );
          }
        });
      }

  sendInvoice() {
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
          data.checkedArr = this.checkedArr;

          let total = 0;
          data.paymentplanid = this.invoice.type == 'PAYMENTPLAN' && this.paymentPlans.length > 0  ? this.paymentPlans[0].paymentPlanId : 0;
          data.id = this.invoice.Id;
          data.projectName = this.project.name;
          data.clientId = this.project.client_id;
          data.deletedArticles = this.rows;
          data.articleForm = data.articleForm.filter((row) => {
              return row.Description != "";
          });
          data.payment_plan = true;
          if(!this.getFinalResultForPaymentBtn()) {
              data.payment_plan = false;
          }

          if(this.invoice.type != 'PAYMENTPLAN') {
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
          }else {
              total = Number(this.totalSum);
          }
          data.total = total.toFixed(2);
          const valid = this.validateForm();
          data.removedArticles = this.removedArticles;
          data.removedPaymantArticles = this.removedPaymantArticles;
          data.isInvoiced = 0;
          if(this.invoice.type == 'PAYMENTPLAN') {
            data.isInvoiced = 1;
          }
          data.note1 = data.comment1;
          data.note2 = data.comment2;
          if(this.invoice.type == 'ATA') {
            data.labeling_requirements = this.markningskrav;
          }else {
            data.labeling_requirements = "";
          }
          data.table_type = this.invoice.type;
          data.credit = this.invoice.credit;
          data.sumOfInvoiced = this.sumOfInvoiced;
          this.spinner = true;
          if (valid) {
            this.invoiceService.updateInvoice(data).subscribe((res: any) => {
              if (res.status) {
                this.sendTOFOrtnox(data);
              }
            });
          }
        }
      });
  }

  finishInvoice(event) {

    if(event.target.checked) {
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
            const data = this.createForm.value;
            data.checkedArr = this.checkedArr;

            let total = 0;
            data.paymentplanid = this.invoice.type == 'PAYMENTPLAN' && this.paymentPlans.length > 0  ? this.paymentPlans[0].paymentPlanId : 0;
            data.id = this.invoice.Id;
            data.projectName = this.project.name;
            data.clientId = this.project.client_id;
            data.deletedArticles = this.rows;
            data.articleForm = data.articleForm.filter((row) => {
                return row.Description != "";
            });
            data.payment_plan = true;
            if(!this.getFinalResultForPaymentBtn()) {
                data.payment_plan = false;
            }

            if(this.invoice.type != 'PAYMENTPLAN') {
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
            }else {
                total = Number(this.totalSum);
            }
            data.total = total.toFixed(2);
            const valid = this.validateForm();
            data.removedArticles = this.removedArticles;
            data.removedPaymantArticles = this.removedPaymantArticles;
            data.isInvoiced = 0;
            if(this.invoice.type == 'PAYMENTPLAN') {
              data.isInvoiced = 1;
            }
            data.note1 = data.comment1;
            data.note2 = data.comment2;
            if(this.invoice.type == 'ATA') {
              data.labeling_requirements = this.markningskrav;
            }else {
              data.labeling_requirements = "";
            }
            data.table_type = this.invoice.type;
            data.credit = this.invoice.credit;
            data.sumOfInvoiced = this.sumOfInvoiced;
            if (valid) {
              this.invoiceService.updateInvoice(data).subscribe((res: any) => {
                if (res.status /*&& false*/ ) {
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

    disabledEntity() {

        if (this.invoice.sent_to_fortnox || this.invoice.manually_accepted || (this.invoice.Status != 1 && this.invoice.Status != 0) || !this.userDetails.create_invoices_Global || !this.allowSave()) {
            return true
        }
        else {
            return null;
        }
    }

    disableMarkningskrav() {
        const data = this.createForm.getRawValue();

        const added_ata = data.articleForm.find((article) => {
          return article.ataId != '';
        });

        if( !added_ata || this.invoice.type != 'ATA' && (!this.markningskrav || this.markningskrav && this.markningskrav.length == 0) || this.checkedMarkningskrav) {
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

    createCreditInvoice() {

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
            this.loadingSpinner = true;
            this.invoiceService.createCreditInvoice(this.invoice.Id).subscribe((res:any) => {

                if (res.status) {
                    this.toastr.success(
                      this.translate.instant("Successfully created credit invoice."),
                      this.translate.instant("Success")
                    );

                    this.invoiceService.getInvoices(0).subscribe((invoices) => {
                        this.invoices = invoices;

                        let previous_invoice = this.invoices.find(
                            (obj) => obj.Id === this.invoice.Id
                        );

                        let next_invoice = this.invoices.find(
                            (obj) => obj.Id === res.invoice_id
                        );

                        this.router.navigate(["invoices", "edit", res.invoice_id], { queryParams: { order_number: next_invoice.index, parent_invoice: previous_invoice.index } });
                    });
                }
            });
          }
      });
    }

    disabledInput(job) {

      if((job.emptyRow && this.invoice.Status != 6 && this.invoice.credit == '0' && this.userDetails.create_invoices_Global) || (!job.AtaId && !job.ReportId && job.PaymentPlanId == 0 && this.invoice.Status != 6 && this.invoice.credit == '0' && this.userDetails.create_invoices_Global)) {
        return null;
      }else {
        return true
      }
    }

  setUnit(job, value, render_index) {

    this.renderDataInTable[render_index].Unit = value;
    if(this.invoice.type != 'PAYMENTPLAN') {
      this.fillArrayForm();
    }else {
      this.fillArrayFormForPaymentPlan();
    }
  }


    redirectToPreviousPage() {
        if(!this.from_summary) {
            this.router.navigate(["/invoices"], { queryParams: {from_edit: true}});
        }else {
            this.router.navigate(["/projects/view/" + this.project.id + "/invoices"]);
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
