import { Component, OnInit, OnDestroy } from '@angular/core';
import { AtaInfoService } from 'src/app/projects/components/ata/modify-ata/ata-info/ata-info.service';
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { WeeklyReportsService } from "src/app/core/services/weekly-reports.service";
import { AtaService } from "src/app/core/services/ata.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { SupplierInvoiceModalComponent } from 'src/app/projects/components/ata/modify-ata/supplier-invoice-modal/supplier-invoice-modal.component';
//import { ImageModalComponent } from "src/app/projects/components/image-modal/image-modal.component";
import { ImageModalUtility } from "src/app/projects/components/image-modal/image-modal-utility.service";
import { FileStorageService } from "src/app/core/services/file-storage.service";
import { UsersService } from "src/app/core/services/users.service";
import { CronService } from "src/app/core/services/cron.service";
import { interval, Subject, Subscription } from "rxjs";
import { environment } from "src/environments/environment";
import { AESEncryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';
declare var $;

@Component({
  selector: 'app-data-of-ks',
  templateUrl: './data-of-ks.component.html',
  styleUrls: ['./data-of-ks.component.css'],
  providers: [ImageModalUtility],
})

export class DataOfKsComponent implements OnInit, OnDestroy {

    public toggle:any = {
        'aditionalWork' : true,
        'material': true,
        'ui':true,
        'doc':true,
    };
    public pominalseMargin:any;
    public pominalse: boolean = false;
    public weekly_report:any = [];
    public ataKsSub;
    public createForm: FormGroup;
    public supplierInvoices: any[] = [];
    public emptyArticle = {
        id: "",
        Name: "",
        Quantity: "",
        Unit: "",
        Price: "",
        Deduct: "0",
        Total: "",
        Account: "",
        Created: "",
        is_manual_added: false,
        additionalWorkStatus: "",
        SupplierInvoiceId: ''
    };
    public articlesOtherProjectDeduct = 0;
    public articlesMaterialProjectDeduct = 0;
    public first_time:boolean = true;
    public units:any = [];
    public enabledAccounts = [];
    public deletedArticlesAditionalWork = [];
    public deletedArticlesMaterials = [];
    public deletedArticlesOther = [];
    public materialProperties = [];
    public ata:any = [];
    public project:any = [];
    public language = "en";
    public sendCopy: boolean = false;
    public initalValues:any;
    public allowResetForm:boolean = false;
    private allowManualAcceptWeeklyReportSub;
    private allowManualDeclineWeeklyReportSub;
    public userDetails: any = JSON.parse(sessionStorage.getItem("userDetails"));
    infoObjectKS = {
        content_type: "KS",
        content_id: "",
        type: "Ata",
        type_id: "",
    };
    albums: any[] = [];
    $_clearFilesKS: Subject<void> = new Subject<void>();
    swiperKS = {
        images: [],
        active: -1,
        album: -2,
        index: -1,
        parent: null,
    };
    swiperSupplierInvoice = {
        images: [],
        active: -1,
        album: -2,
        index: -1,
        parent: null,
    };
    public selected_article;
    public getWeeklyReportSub;
    public getSupplierInvoicesSub;
    public show : boolean = false;
    public fullName: any;
    public editAta: boolean = false;
    public counter = 0;
    public subscription: Subscription;
    public adminRole;

    constructor
    (
        private ataInfoService: AtaInfoService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private weeklyReportService: WeeklyReportsService,
        private ataService: AtaService,
        private toastr: ToastrService,
        private translate: TranslateService,
        private imageModalUtility: ImageModalUtility,
        private fsService: FileStorageService,
        private usersService: UsersService,
        private router: Router,
        private cronService: CronService,
        private AESEncryptDecryptService: AESEncryptDecryptService
    ) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.adminRole = this.AESEncryptDecryptService.sha256('Administrator');
    }

    ngOnInit(): void {

        this.units = this.route.snapshot.data["units"];
        this.ata = this.route.snapshot.data["atas"]['data'][this.route.snapshot.data["atas"]['data'].length - 1];
        this.project = this.route.snapshot.data["project"]['data'];
        this.articlesMaterialProjectDeduct = this.project["ataChargeMaterial"];
        this.articlesOtherProjectDeduct = this.project["ataChargeUE"];
        this.language = sessionStorage.getItem("lang");
        this.enabledAccounts = this.route.snapshot.data["enabledAccounts"];
        this.materialProperties = this.route.snapshot.data["materialProperties"];
        if(this.weekly_report.Status == 1) {
            this.pominalseMargin = document.getElementsByClassName('pominalse')[0].clientWidth;
        }
        this.getWeeklyReport();
        this.generateForm();
        this.getAllDUArticles();
        this.getAllowUpdateWeeklyReport();
        this.getAllowManualAcceptWeeklyReport();
        this.getAllowManualDeclineWeeklyReport();
        this.getSupplierInvoicesLoadedFromOutside();
        //this.getSupplierInoviceForAta();
        // Use Enter key as Tab //

        document.addEventListener("keydown", this.getSelected.bind(this));
        this.checkDoesComponentAvaiableForEditing();
        this.getUserPermission();
    }

    getSelected(event) {

        if(event.srcElement.localName == 'textarea') {
            return;
        }

        if(event.target['dataset'] && event.target['dataset'].selected_article) {
           this.selected_article = event.target['dataset'].selected_article;
        }

        if ((event.keyCode === 13 && event.target["form"]) || (event.keyCode === 9 && event.target["form"])) {
            const form = event.target["form"];
            const index = Array.prototype.indexOf.call(form, event.target);
            const nextEl = form.elements[index + 1];
            if (nextEl) {
                if (nextEl.type == "fieldset") {
                    form.elements[index + 3].focus();
                } else if (nextEl.type == "hidden") {
                    form.elements[index + 2].focus();
                } else {
                    nextEl.focus();
                }
            }

            event.preventDefault();
            if(this.selected_article == 'additional-work') {
                this.addRow(this.articlesAdditionalWork, 'articlesAdditionalWork');
            }
            if(this.selected_article == 'article-material') {
                this.addRow(this.articlesMaterial, 'articlesMaterial');
            }
            if(this.selected_article == 'article-other') {
                this.addRow(this.articlesOther, 'articlesOther');
            }
        }
    }

    setActiveArticle(article) {
        // console.log(article)
    }

    filterSupplierInvoiceNumber() {
        return this.supplierInvoices.filter((invoice) =>
            invoice.isChecked == false
        );
    }

    allowAddInvoiceOnWeeklyReportIfNotRevision() {
        let status = false;
        if (
          this.weekly_report &&
          this.weekly_report.parent != null &&
          this.weekly_report.parent == 0 &&
          this.weekly_report.Status == 0
        ) {
          status = true;
        }
        return status;
    }

    getSupplierInoviceForAta() {
        this.ataService
          .getSupplierInoviceForAta(
            this.project.id,
            this.ata.ATAID,
            this.ata.AtaNumber,
            this.ata.ATAID
          )
          .subscribe((res) => {
            this.supplierInvoices = res["invoices"];
            this.ataInfoService.setNumberOfInvoices(this.filterSupplierInvoiceNumber().length);
        });
    }

    toggleSupplierInvoiceModal() {

        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = false;
        diaolgConfig.disableClose = true;
        diaolgConfig.panelClass = "bdrop-supplier-invoice";
        diaolgConfig.data = { supplierInvoices: this.supplierInvoices, project: this.project,  };

        this.dialog.open(SupplierInvoiceModalComponent, diaolgConfig).afterClosed().subscribe((response) => {

            if(response) {

                response.supplier_checked.forEach((invoice) => {

                    const i = this.articlesMaterial.controls.findIndex(
                        (invo) => {

                            return (
                                Number(invoice.SupplierInvoiceId) == Number(invo.get("SupplierInvoiceId").value)
                                &&
                                Number(invoice.Price) == Number(invo.get("Price").value)
                                &&
                                Number(invoice.Total) == Number(invo.get("Total").value)
                            )
                        }
                    );

                    if(i > -1) {
                        this.articlesMaterial.controls.splice(i, 1);
                        this.articlesMaterial.value.splice(i, 1);
                    }

                    invoice.Total = (Number((Number(invoice.Deduct) / 100) + 1) * Number(invoice.Price)).toFixed(2);
                    let not_emtpy_object = this.articlesMaterial.value.filter((row) => {
                        return row.Name != "";
                    });

                    this.articlesMaterial.insert(
                        not_emtpy_object.length,
                        this.fb.group({
                            id: "",
                            Name: invoice.Name,
                            Quantity: 1,
                            Unit: invoice.Unit,
                            Price: invoice.Price,
                            Deduct: invoice.Deduct,
                            Total: invoice.Total,
                            Account: invoice.Account,
                            OrderNR: invoice.OrderNR,
                            importedFromFortnox:invoice.importedFromFortnox,
                            Type: invoice.Type,
                            SupplierInvoiceId: invoice.SupplierInvoiceId,
                            Number: invoice.Number,
                            pdf_images: invoice.pdf_images,
                            pdf_doc: invoice.pdf_link
                        })
                    );
                    this.createForm.markAsDirty();
                });

                response.supplier_unchecked.forEach((invoice_id) => {

                    const i = this.articlesMaterial.controls.findIndex(
                        (invo) => { return invoice_id == invo.get("SupplierInvoiceId")?.value}
                    );

                    if(i > -1) {
                        this.articlesMaterial.controls.splice(i, 1);
                        this.articlesMaterial.value.splice(i, 1);
                    }
                });
                this.ataInfoService.setNumberOfInvoices(this.filterSupplierInvoiceNumber().length);
            }
        });

    }


  protected init_calendar() {

    const dateToday = new Date();

    const datepickerOptions: any = {
      format: "yyyy-mm-dd",
      calendarWeeks: true,
      autoclose: true,
      language: this.language,
      currentWeek: true,
      todayHighlight: true,
      currentWeekTransl: this.language === "en" ? "Week" : "Vecka",
      currentWeekSplitChar: "-",
      startDate: dateToday,
      weekStart: 1
    };

    if (
      this.weekly_report &&
      this.weekly_report.WeeklyReportDueDate
    ) {
      datepickerOptions.defaultDate = new Date(
        this.weekly_report.WeeklyReportDueDate.split(
          " "
        )[0]
      );
    }

    $("#weeklyReportDueDate").datepicker("destroy");
    $("#weeklyReportDueDate").datepicker(datepickerOptions).on("changeDate", (ev) => {

        //await this.updateWeeklyReport();
        this.weekly_report.WeeklyReportDueDate = ev.target.value;
        //this.createForm.markAsDirty();
        //this.ataInfoService.setIfHasChangesOnForm(true);
        //  this.ataInfoService.setWeeklyReport(this.weekly_report);
    }).on("blur", (e) => {
        e.target.value = this.weekly_report.WeeklyReportDueDate;
    });
  }

  setPriceError(i, formGroup) {
    const priceControl = formGroup.controls[i].controls.Price;
    const errors = priceControl.errors;

    if (errors && errors.incorrect) {
      return {
        borderStyle: "solid",
        borderColor: "red",
        borderWidth: "2px",
      };
    }

    return {};
  }

  updateValue(arg, type, i) {
    if (type == "articlesMaterial" && arg == 0) {
      let className = ".articlesMaterial-" + i;
      $(className).val("");
    } else if (type == "articlesAdditionalWork" && arg == 0) {
      let className = ".articlesAdditionalWork-" + i;
      $(className).val("");
    } else if (type == "articlesOther" && arg == 0) {
      let className = ".articlesOther-" + i;
      $(className).val("");
    }
  }

  returnNullIFNotSetedSamoeValue(arg, type, i) {

    if (type == "articlesMaterial" && arg == 0) {
      let className = ".articlesMaterial-" + i;
      $(className).val("0");
    } else if (type == "articlesAdditionalWork" && arg == 0) {
      let className = ".articlesAdditionalWork-" + i;
      $(className).val("0");
    } else if (type == "articlesOther" && arg == 0) {
      let className = ".articlesOther-" + i;
      $(className).val("0");
    }
  }


  toggleMenu(type){
    if(type == 'aditionalWork'){
      this.toggle["aditionalWork"]=!this.toggle["aditionalWork"]
    }
    else if(type == 'material'){
      this.toggle["material"]=!this.toggle["material"]
    }
    else if(type == 'ui'){
      this.toggle["ui"]=!this.toggle["ui"]
    }
    else if(type == 'doc'){
      this.toggle["doc"]=!this.toggle["doc"]
    }

  }
    pominalseCheck(){
        this.pominalse = !this.pominalse;
     //   this.createForm.markAsDirty();
       //this.ataInfoService.setAllowUpdateWeeklyReport(null);
        this.ataInfoService.setReminderStatus(this.pominalse);
     //   this.ataInfoService.setIfHasChangesOnForm(true);
    }

    getWeeklyReport() {
        this.getWeeklyReportSub = this.ataInfoService.getWeeklyReport().subscribe((report)=>{

            this.weekly_report = report;
            if(this.weekly_report.Status != 0 && this.weekly_report.Status != 1) {
                this.sendCopy = true;
            }

            if(!this.first_time) {
                this.getAllDUArticles();
            }
            this.first_time = false;
            this.init_calendar();
            if(this.allowResetForm){
                this.createForm.markAsPristine(); /// reset form drty -- check changes in form
            }
        });
    }

    setEmailLogData(status) {

        let object = {
            'name': '',
            'background': ''
        }


        if (status == 2 || status == 4) {
          object.name = 'Accepted';
          object.background  = '#02B94C';
        }

        if (status == 3) {
          object.name = 'Declined';
          object.background  = '#FF5454';
        }

        return object;
    }

    ngOnDestroy() {
        this.unsubWeeklyReport();
        this.unSubAllowManualAcceptWeeklyReport();
        this.unSubAllowManualDeclineWeeklyReport();
        this.unSubGetWeeklyReport();
        this.unSubGetSupplierInvoices();
    }

    unSubGetSupplierInvoices() {
        if(this.getSupplierInvoicesSub) {
            this.getSupplierInvoicesSub.unsubscribe();
        }
    }

    unSubGetWeeklyReport() {
        if(this.getWeeklyReportSub) {
            this.ataInfoService.setWeeklyReports(null);
            this.getWeeklyReportSub.unsubscribe();
        }
    }

    unSubAllowManualDeclineWeeklyReport() {
        if(this.allowManualDeclineWeeklyReportSub) {
            this.ataInfoService.setAllowManualDeclineWeeklyReport(null);
            this.allowManualDeclineWeeklyReportSub.unsubscribe();
        }
    }

    unSubAllowManualAcceptWeeklyReport() {
        if(this.allowManualAcceptWeeklyReportSub) {
            this.ataInfoService.setAllowManualAcceptWeeklyReport(null);
            this.allowManualAcceptWeeklyReportSub.unsubscribe();
        }
    }

    unsubWeeklyReport() {
        if (this.ataKsSub) {
            this.ataInfoService.setAllowUpdateWeeklyReport(null);
            this.ataKsSub.unsubscribe();
        }
    }

    detectChanges() {
        this.ataInfoService.setIfHasChangesOnForm(this.createForm.dirty);
    }

    async generateForm() {

        this.createForm = this.fb.group({
          id: [this.weekly_report.id, []],
          Name: ['', []],
          Status: [this.weekly_report.Status, [Validators.required]],

          articlesAdditionalWork: this.fb.array([]),
          articlesMaterial: this.fb.array([]),
          articlesOther: this.fb.array([]),
          weeklyReportDueDate: [this.weekly_report.WeeklyReportDueDate, []],
        });
        this.allowResetForm = true;
        this.ataInfoService.setIfHasChangesOnForm(this.createForm.dirty);
    }

    disable_buttons() {

        this.createForm.get('articlesAdditionalWork').disable();
        this.createForm.get('articlesMaterial').disable();
        this.createForm.get('articlesOther').disable();
    }

    get articlesAdditionalWork() {
        return this.createForm.get("articlesAdditionalWork") as FormArray;
    }

    get articlesMaterial() {
        return this.createForm.get("articlesMaterial") as FormArray;
    }

    get articlesOther() {
        return this.createForm.get("articlesOther") as FormArray;
    }

    getAllowUpdateWeeklyReport() {
        this.ataKsSub = this.ataInfoService.getAllowUpdateWeeklyReport().subscribe((status)=>{
            if(status && !this.allowRemoveEmptyWeeklyReport()) {
                this.updateWeeklyReport(status);
            }
        });
    }

    getAllowManualAcceptWeeklyReport() {
        this.allowManualAcceptWeeklyReportSub = this.ataInfoService.getAllowManualAcceptWeeklyReport().subscribe((status) => {
            if(status) {
                this.ataInfoService.setSpinner(true);
                this.acceptWeeklyReport();
            }
        });
    }

    acceptWeeklyReport() {
        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = false;
        diaolgConfig.disableClose = true;
        diaolgConfig.width = "";
        diaolgConfig.panelClass = "mat-dialog-confirmation";
       /* this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().subscribe((response) => {
            if (response.result) {
*/
        this.weeklyReportService.approveWeeklyReportAsAdmin(this.weekly_report.id).then(async(response) => {
            if (response["status"]) {
                this.toastr.success(this.translate.instant("You successfully accepted Weekly Report."), this.translate.instant("Success"));
                // this.weekly_report.Status = 2;
                this.ataInfoService.setSpinner(false);
                await this.updateWeeklyReportPdf();
              //  this.ataInfoService.setWeeklyReport(this.weekly_report);
                this.getWeeklyReportByWrId(this.weekly_report.id);
            } else {
                this.ataInfoService.setSpinner(false);
                this.toastr.warning(this.translate.instant("Not able to accept Weekly Report."),this.translate.instant("Error"));
            }
        });

        //    }
       // });
    }

    getAllowManualDeclineWeeklyReport() {
        this.allowManualDeclineWeeklyReportSub = this.ataInfoService.getAllowManualDeclineWeeklyReport().subscribe((status) => {
            if(status) {
                this.ataInfoService.setSpinner(true);
                this.declineWeeklyReport();
            }
        });
    }

    declineWeeklyReport() {
      /*  const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = false;
        diaolgConfig.disableClose = true;
        diaolgConfig.width = "";
        diaolgConfig.data = {
          questionText:
            this.translate.instant(
              "Are you sure you want to decline weekly report: "
            ) + ` ${this.weekly_report.name}`,
        };
        this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().subscribe((response) => {

            if (response.result) {*/

                this.weeklyReportService.declineWeeklyReportAsAdmin(this.weekly_report.id).then((response) => {

                    if (response["status"]) {
                        this.toastr.success(
                          this.translate.instant(
                            "You successfully declined Weekly Report."
                          ),
                          this.translate.instant("Success")
                        );
                        this.weekly_report.Status = 3;
                        this.ataInfoService.setReloadWeeklyReportByNamesWithIndex(true);
                      } else {
                        this.toastr.warning(
                          this.translate.instant(
                            "Not able to decline Weekly Report."
                          ),
                          this.translate.instant("Error")
                        );
                    }
                    this.ataInfoService.setSpinner(false);
                });
        //    }
       // });
    }

    getAlbumFilesKS(albumKey, type) {
        const activeDU = this.weekly_report;
        const files = activeDU["files"][albumKey][type];
        return files;
    }

    getContentIdForInfoObject() {
        const content_id = this.weekly_report.id;
        const type_id = this.ata.ATAID;
        return { content_id: content_id, type_id: type_id };
    }

    async ensureRemoveLastEmptyRow(articles) {
        let index = articles.length -1;
        if(index > -1 && articles[index].Name == '') {
            articles.splice(index, 1);
            this.ensureRemoveLastEmptyRow(articles);
        }else {
            return true;
        }
    }

    async updateWeeklyReport(from_ata_inf_nav = null) {

        this.ataInfoService.setSpinner(true);
        const data = this.createForm.getRawValue();

        await this.ensureRemoveLastEmptyRow(data['articlesAdditionalWork']);
        await this.ensureRemoveLastEmptyRow(data['articlesMaterial']);
        await this.ensureRemoveLastEmptyRow(data['articlesOther']);

       // const valid = this.validateForm();
        let wr_documents = null;
        data.timesReminderSentDU = this.pominalse;
        data.ata_id = this.ata.ATAID;
        data.ProjectID = this.ata.ProjectID;
        data.project = this.project;
        data.weeklyReportDueDate = this.weekly_report.WeeklyReportDueDate;
        data.id = this.weekly_report.id;
        data.deletedArticlesAditionalWork = this.deletedArticlesAditionalWork;
        data.deletedArticlesMaterials = this.deletedArticlesMaterials;
        data.deletedArticlesOther = this.deletedArticlesOther;
        data.ata = this.ata;
        data.week = this.weekly_report.week;

        data.articlesAdditionalWork = data.articlesAdditionalWork.map(
            (article) => {
              article.Quantity = Number(
                article.Quantity.toString().replace(/\s/g, "").replace(",", ".")
              );
              article.Price = Number(
                article.Price.toString().replace(/\s/g, "").replace(",", ".")
              );
              return article;
            }
        );
        //    data.articlesMaterial = data.articlesMaterial.filter((row) => {
        //        return row.Name != "";
        //    });
        data.articlesMaterial = data.articlesMaterial.map((article) => {
            article.Quantity = Number(
              article.Quantity.toString().replace(/\s/g, "").replace(",", ".")
            );
            article.Price = Number(
              article.Price.toString().replace(/\s/g, "").replace(",", ".")
            );
            return article;
        });

        //data.articlesOther = data.articlesOther.filter((row) => {
        //    return row.Name != "";
        //});
        data.articlesOther = data.articlesOther.map((article) => {
            article.Quantity = Number(
              article.Quantity.toString().replace(/\s/g, "").replace(",", ".")
            );
            article.Price = Number(
              article.Price.toString().replace(/\s/g, "").replace(",", ".")
            );
            return article;
        });

        if(from_ata_inf_nav == 'send_wr2') {
            await this.updateWeeklyReportStatusAndDueDate(data);
            this.getWeeklyReportByWrId(data.id, from_ata_inf_nav);
        }else {

            const content = this.getContentIdForInfoObject();
            const content_id = content.content_id;
            const type_id = content.type_id;
            const files = this.weekly_report.files;

            const albumFiles = this.imageModalUtility.getAlbumFiles(
              this.albums,
              content_id,
              type_id
            );

            const _newAlbumFiles = await this.fsService.mergeFilesAndAlbums(albumFiles);

            if(_newAlbumFiles != null) {
                albumFiles.images = _newAlbumFiles.images;
                albumFiles.pdfs = _newAlbumFiles.pdfs;
            }

            const ataServerFiles = this.imageModalUtility.getAlbumFiles(
              files,
              content_id,
              type_id
            );
            const images = albumFiles.images.concat(ataServerFiles.images);
            const pdf_documents = albumFiles.pdfs.concat(ataServerFiles.pdfs);

            wr_documents = {
              wr_id: this.weekly_report.id,
              images: images,
              pdf_documents: pdf_documents,
              removed_documents:this.weekly_report.removed_documents,
            };

            data.wr_documents = wr_documents;

        //    if(valid) {
                if(this.weekly_report.Status == 1) {
                    await this.updateWeeklyReportStatusAndDueDate(data);
                    this.getWeeklyReportByWrId(data.id, from_ata_inf_nav);
                }else {

                    this.ataInfoService.setSpinner(true);
                    this.weeklyReportService.updateWeeklyReport(data).then(async (res) => {
                        //if(from_ata_inf_nav == 'print_wr') {
                            await this.updateWeeklyReportPdf();
                        //}
                        this.getWeeklyReportByWrId(data.id, from_ata_inf_nav);
                        this.toastr.success(
                            this.translate.instant("You have successfully saved!"),
                            this.translate.instant("Success")
                        );
                    });
                }
         //   }
        }
    }

    async updateWeeklyReportStatusAndDueDate(data) {
        let pom = {
            'due_date': this.weekly_report.WeeklyReportDueDate,
            'status': data.Status,
            'reminder': this.pominalse,
            'id': data.id
        }
        this.weeklyReportService.updateWeeklyReportStatusAndDueDate(pom);
    }

    getWeeklyReportByWrId(wr_id, from_ata_inf_nav = null) {

        this.weeklyReportService.getWeeklyReportByWrId(wr_id, 'KS').then((res)=>{

            this.ataInfoService.setActiveComponents('weekly_report');
            this.ataInfoService.setWeeklyReport(res);
            this.getAllDUArticles();
            this.ataInfoService.setSpinner(false);
            this.getSupplierInoviceForAta();
            this.updateWeeklyReportPdf();


            if(from_ata_inf_nav == 'send_wr' || from_ata_inf_nav == 'send_wr2') {
                this.ataInfoService.setAllowSendOrPrintWeeklyReport('send_wr');
            }

            if(from_ata_inf_nav == 'print_wr') {
                this.ataInfoService.setAllowSendOrPrintWeeklyReport('print_wr');
            }
            this.$_clearFilesKS.next();
        });
    }

  toggleAttachmentKS(albumKey, index, type) {
    if (!this.weekly_report.removed_documents) {
      this.weekly_report.removed_documents = [];
    }

    const files =
      this.weekly_report["files"][albumKey][type];
    const file = files[index];
    const id = file.id;

    if (file.deleted) {
      this.weekly_report.removed_documents =
        this.weekly_report.removed_documents.filter(
          (_file) => {
            return id != _file.id;
          }
        );
    } else {
      this.weekly_report.removed_documents.push(file);
    }

    file.deleted = !file.deleted;
  }


  validateForm() {
    let valid = true;
    this.articlesAdditionalWork.controls
      .filter((name) => name.value.Name)
      .forEach((row) => {
        if (
          row.get("Quantity").value == "" ||
          row.get("Quantity").value == null ||
          row.get("Quantity").value == 0
        ) {
          row
            .get("Quantity")
            .setValidators([Validators.required, Validators.min(1)]);
          row.get("Quantity").updateValueAndValidity();
          valid = false;
        }
      });

    this.articlesMaterial.controls
      .filter((name) => name.value.Name)
      .forEach((row) => {
        if (
          row.get("Quantity").value == "" ||
          row.get("Quantity").value == null ||
          row.get("Quantity").value == 0
        ) {
          row
            .get("Quantity")
            .setValidators([Validators.required, Validators.min(1)]);
          row.get("Quantity").updateValueAndValidity();
          valid = false;
        }
      });

    this.articlesOther.controls
      .filter((name) => name.value.Name)
      .forEach((row) => {
        if (
          row.get("Quantity").value == "" ||
          row.get("Quantity").value == null ||
          row.get("Quantity").value == 0
        ) {
          row
            .get("Quantity")
            .setValidators([Validators.required, Validators.min(1)]);
          row.get("Quantity").updateValueAndValidity();
          valid = false;
        }
      });
    return valid;
  }
  onFocus(){
    this.show = true;
  }
  onBlur(){
    this.show = false

  }
  getAllDUArticles() {

    const report = this.weekly_report;

    this.clearFormArray(this.articlesAdditionalWork);
    this.clearFormArray(this.articlesMaterial);
    this.clearFormArray(this.articlesOther);

    if (!report) return;
    report.tables.aaw.forEach((article) => {
      let status = "";
      this.articlesAdditionalWork.push(
        this.fb.group({
          id: article.Id,
          Name: article.Name + status,
          Quantity: article.Quantity,
          Unit: article.Unit,
          Price: article.Price,
          Deduct: article.Deduct,
          Total: parseFloat(article.Total).toFixed(2),
          Account: article.Account,
          ClientComment: article.ClientComment,
          ClientStatus: article.ClientStatus,
          status: article.additionalWorkStatus,
          wrStatus: report.status,
          is_manual_added: article.is_manual_added == "1",
          additionalWorkStatus: article.additionalWorkStatus,
          TableType: article.TableType,
          SupplierInvoiceId: article.SupplierInvoiceId,
          ArticlePaymentType: article.articlePaymentType
        })
      );
    });

    report.tables.am.forEach((article) => {
      if (!article.TableType) article.TableType = "Default";

      if (!article.SupplierInvoiceId) article.SupplierInvoiceId = "NULL";

      let status = "";

      this.articlesMaterial.push(
        this.fb.group({
          id: article.Id,
          Name: article.Name + status,
          Quantity: article.Quantity,
          Unit: article.Unit,
          Price: article.Price,
          Deduct: article.Deduct,
          Total: parseFloat(article.Total).toFixed(2),
          Account: article.Account,
          Date: article.Created.substring(0, 10),
          ClientComment: article.ClientComment,
          ClientStatus: article.ClientStatus,
          Type: article.TableType,
          SupplierInvoiceId: article.SupplierInvoiceId,
          status: null,
          wrStatus: report.status,
          additionalWorkStatus: article.additionalWorkStatus,
          pdf_doc: article.pdf_doc,
          pdf_images: article.pdf_images,
          TableType: article.TableType,
        })
      );
    });

    report.tables.ao.forEach((article) => {
      let status = "";

      this.articlesOther.push(
        this.fb.group({
          id: article.Id,
          Name: article.Name + status,
          Quantity: article.Quantity,
          Unit: article.Unit,
          Price: article.Price,
          Deduct: article.Deduct
            ? article.Deduct
            : this.articlesOtherProjectDeduct,
          Total: parseFloat(article.Total).toFixed(2),
          Account: article.Account,
          Date: article.Created.substring(0, 10),
          ClientComment: article.ClientComment,
          ClientStatus: article.ClientStatus,
          Type: "ArticlesOther",
          status: null,
          wrStatus: report.status,
          additionalWorkStatus: article.additionalWorkStatus,
          TableType: article.TableType,
          SupplierInvoiceId: article.SupplierInvoiceId
        })
      );
    });

    this.articlesAdditionalWork.push(
      this.fb.group(this.addEmptyArticle("articlesAdditionalWork"))
    );
    this.articlesMaterial.push(
      this.fb.group(this.addEmptyArticle("articlesMaterial"))
    );
    this.articlesOther.push(
      this.fb.group(this.addEmptyArticle("articlesOther"))
    );

    this.initalValues = this.createForm.value;

    if(report.status != 0) {
        this.disable_buttons();
    }
  }

  addEmptyArticle(table) {
    let article = this.emptyArticle;
    article.Deduct = "0";
    if (table == "articlesAdditionalWork") {
      article.Deduct = "0";
      article.is_manual_added = true;
    } else if (table == "articlesMaterial") {
      article.Deduct = this.articlesMaterialProjectDeduct.toString();
    } else if (table == "articlesOther") {
      article.Deduct = this.articlesOtherProjectDeduct.toString();
    }
    return article;
  }

  clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }


    round_number(value, precision) {
        if (Number.isInteger(precision)) {
            var shift = Math.pow(10, precision);
            // Limited preventing decimal issue
            return (Math.round( value * shift + 0.00000000000001 ) / shift);
        } else {
            return Math.round(value);
        }
    }


  updateTotal(i, formGroup, calcTime = false) {
    let total: any = "0";

    const Price = Number(
      formGroup.controls[i].value.Price.toString()
        .replace(/\s/g, "")
        .replace(",", ".")
    );
    const Quantity = Number(
      formGroup.controls[i].value.Quantity.toString()
        .replace(/\s/g, "")
        .replace(",", ".")
    );

    let Deduct = this.round_number(Number(
      formGroup.controls[i].value.Deduct.toString()
        .replace(/\s/g, "")
        .replace(",", ".")
    ), 2);

    if(Quantity < 0) {
        Deduct = 0;
    }

    total = (
      Quantity *
      Price *
      (Deduct / 100 + 1)
    ).toFixed(2);

    (<FormGroup>formGroup.controls[i]).controls["Deduct"].patchValue(Deduct);
    (<FormGroup>formGroup.controls[i]).controls["Total"].patchValue(total);

    return total;
  }


    removeRow(index, formGroup, type) {

        if (
          formGroup.controls[index].value.Name == "" &&
          formGroup.value.filter((article) => article.Name == "").length == 1
        ) {
          return;
        }
        this.createForm.markAsDirty();
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
          const momentDocuments = this.weekly_report
            ? this.weekly_report.files["694201337"]
            : false;
          if (momentDocuments && momentDocuments.images) {
            momentDocuments.images = momentDocuments.images.filter(
              (article) => {
                return article.article_id != formGroup.controls[index].value.id;
              }
            );

            if (momentDocuments.images.length === 0) {
              delete this.weekly_report.files["694201337"];
            }
          }

          if (
            formGroup.controls[index].value.id == "" &&
            (formGroup.controls[index].value.Type == "SupplierInvoiceRow" ||
              formGroup.controls[index].value.Type == "SupplierInvoice")
          ) {
            let i = this.supplierInvoices.findIndex(
              (invoice) =>
                invoice.OrderNR == formGroup.controls[index].value["OrderNR"]
            );
            this.supplierInvoices[i].isChecked = false;
          }

          if (formGroup.controls[index]) {
            if (type == 1) {
                formGroup.controls[index].deleted = true;
/*
              this.deletedArticlesAditionalWork.push(
                formGroup.controls[index].value.id
              );*/
              this.deletedArticlesAditionalWork.push(
                formGroup.controls[index].value
              );
            } else if (type == 2) {
              this.deletedArticlesMaterials.push(
                formGroup.controls[index].value
              );
            } else if (type == 3) {
              this.deletedArticlesOther.push(
                formGroup.controls[index].value.id
              );
            }

            if (this.weekly_report) {
              this.weekly_report.rowDeleted = true;
            }
          }

          if (formGroup.controls.length > 1) {
            formGroup.controls.splice(index, 1);
            formGroup.value.splice(index, 1);
          } else {
            formGroup.controls[0].setValue(
              this.addEmptyArticle(
                type == 2
                  ? "articlesMaterial"
                  : type == 3
                  ? "articlesOther"
                  : "articlesAdditionalWork"
              )
            );
          }
          this.ataInfoService.setNumberOfInvoices(this.filterSupplierInvoiceNumber().length);
        }
      });
    }

    addRow(formGroup, table, index = -1) {

        /*
            if (formGroup.controls[formGroup.controls.length - 2]) {
              if (formGroup.controls[formGroup.controls.length - 2].value.Name !== "") {
                formGroup.push(this.fb.group(this.addEmptyArticle(table)));
              }
            } else if (formGroup.controls[formGroup.controls.length - 1]) {
              formGroup.push(this.fb.group(this.addEmptyArticle(table)));
            }
        */

        let status = false;

        if(formGroup.value.length -1 == index) {
            status = true;
        }
    /*
        const i = formGroup.controls.findIndex(
            (article) => { return article.value.Name == ""}
        );
    */
        if(status) {
            formGroup.push(this.fb.group(this.addEmptyArticle(table)));
        }
    }

    async updateWeeklyReportPdf() {
        this.ataService.updateWeeklyReportPdf(
          this.weekly_report.id,
          null,
          this.sendCopy
        );
    }

    calcAllTotal(data) {

        let total = 0;

        data.forEach((data2) => {
          data2.value.forEach(data3 => {
            if (data3 && data3.Total) {
               let amount = data3.Total != "" ? data3.Total : 0;
               total += parseFloat(amount);
            }
          });

        });
        return total.toFixed(2);
    }

    deleteWeeklyReport() {

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
              this.weeklyReportService.deleteWeeklyReport(this.weekly_report.id)
                .then((res) => {
                  if (res["status"]) {
                      this.ataInfoService.setReloadWeeklyReportByNames(true);
                  }
                });
            }
          });
    }

  updateAlbumsAtaKS(event) {
    this.albums = event;
    this.createForm.markAsDirty();
  }

  getAlbumKeysKS() {
    let keys = [];
    const activeDU = this.weekly_report;
    if (activeDU) {
      const files = activeDU["files"];
      keys = Object.keys(files).sort(function (a, b) {
        return Number(b) - Number(a);
      });
    }
    return keys;
  }

    getAlbumDescriptionKS(albumKey) {
        const activeDU =  this.weekly_report;
        let description = "";
        if (activeDU) {
          description = activeDU["files"][albumKey]["description"];
        }
        return description;
    }

    getExtension(path) {
        let baseName = path.split(/[\\/]/).pop(),
          pos = baseName.lastIndexOf(".");
        if (baseName === "" || pos < 1)
          return "";
        return baseName.slice(pos + 1);
    }

    isPDFViewer: boolean = false;
    openSwiperKS(index, files, album) {

        if (files[index].document_type === "Image") {
            let name = this.getExtension(files[index]['name']);
            if(!name || name == undefined) {
                files[index]['name'] = files[index]['name'] + '.jpeg';
            }
            this.isPDFViewer = false;
            this.swiperKS = {
                active: index,
                images: files,
                album: album,
                index: -1,
                parent: null,
            };
        } else {
            let name = this.getExtension(files[index]['name']);
            if(!name || name == undefined) {
                files[index]['name'] = files[index]['name'] + '.pdf';
            }
            const fileArray = this.createFileArray(files[index]);
            this.isPDFViewer = true;
            this.swiperKS = {
                active: 0,
                images: fileArray,
                album: album,
                index: index,
                parent: files[index],
            };
        }
    }

    closeSwiperKS() {
        this.swiperKS = {
          active: -1,
          images: [],
          album: -2,
          index: -1,
          parent: null,
        };
    }

  createFileArray(file) {
    const id = file.id;
    const comment = file.Description;
    const name = file.Name ? file.Name : file.name;
    // const image_path = file.image_path;
    const file_path = file.file_path;

    const fileArray = file_path.split(",").map((fileString) => {
      return {
        image_path: fileString,
        id: id,
        Description: comment,
        name: name,
        file_path: file_path,
      };
    });
    return fileArray;
  }

  removeSelectedDocumentsKS(event) {
    event.stopPropagation();

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
            const data = {
                documents: this.weekly_report.removed_documents,
            };
            this.ataInfoService.setSpinner(true);
            this.ataService
                .removeSelectedDocumentsKS(data)
                .subscribe((res: any) => {
                  if (res.status) {
                    this.removeSelectedDocumentsOnClientSideKS();
                  } else {
                    this.toastr.error(this.translate.instant("Error"));
                  }
                  this.ataInfoService.setSpinner(false);
            });
        }
      });
  }

removeSelectedDocumentsOnClientSideKS() {
    this.weekly_report.removed_documents.forEach((doc) => {
        const albumKey = doc.album;
        this.weekly_report["files"][albumKey]["images"] =
        this.weekly_report["files"][albumKey]["images"].filter((file: any) => {
            return file.id != doc.id;
        });
        this.weekly_report["files"][albumKey]["pdfs"] =this.weekly_report["files"][albumKey]["pdfs"].filter((file: any) => {
            return file.id != doc.id;
        });
        this.clearAlbumKS(albumKey);
    });
    this.weekly_report.removed_documents = [];
}

    clearAlbumKS(albumKey) {
        const album = this.weekly_report["files"][albumKey];
        const imagesLength = album.images ? album.images.length : 0;
        const pdfsLength = album.pdfs ? album.pdfs.length : 0;
        if (imagesLength === 0 && pdfsLength === 0) {
            delete this.weekly_report["files"][albumKey];
        }
    }

    openSwiperSupplierInvoice(invoice = null, article = null) {

        if(article.pdf_doc && article.pdf_doc.length > 0){
            this.isPDFViewer = true;
            let imageArray = [];
            if(invoice) {
                 imageArray = this.createImageArraySupplierInvoice(invoice);
                this.swiperSupplierInvoice = {
                    active: 0,
                    images: imageArray,
                    album: invoice.id,
                    index: -1,
                    parent: null
                };
            }else {
                 let obj = {
                        'id': 5555555555,
                        'comment': '',
                        'name': article.Name,
                        'SupplierName': article.Name,
                        'image_path': article.pdf_images,
                        'file_path': article.pdf_doc ? article.pdf_doc : article.pdf_images,
                        'pdf_doc': article.pdf_doc,
                    }

                imageArray = this.createImageArraySupplierInvoice(obj);

                this.swiperSupplierInvoice = {
                    active: 0,
                    images: imageArray,
                    album: 5555555555,
                    index: -1,
                    parent: null
                };
            }
        }else{
            this.isPDFViewer = false;
            let imageArray = [];
            if(invoice) {
                 imageArray = this.createImageArraySupplierInvoice(invoice);
                this.swiperSupplierInvoice = {
                    active: 0,
                    images: imageArray,
                    album: invoice.id,
                    index: -1,
                    parent: null
                };
            }else {
                let obj = {
                    'id': 5555555555,
                    'comment': '',
                    'name': article.Name,
                    'SupplierName': article.Name,
                    'image_path': article.pdf_images,
                    'file_path': article.pdf_doc ? article.pdf_doc : article.pdf_images,
                    'pdf_doc': article.pdf_doc,
                }

                imageArray = this.createImageArraySupplierInvoice(obj);

                this.swiperSupplierInvoice = {
                    active: 0,
                    images: imageArray,
                    album: 5555555555,
                    index: -1,
                    parent: null
                };
            }
        }
    }

    closeSwiperSupplierInvoice() {
        this.swiperSupplierInvoice = {
            images: [],
            active: -1,
            album: -2,
            index: -1,
            parent: null,
        };
    }

    createImageArraySupplierInvoice(invoice) {

      const segments = invoice.file_path.split('/') !== null ? invoice.file_path.split('/') : invoice.pdf_doc.split('/') ;
      const id = invoice.id;
      const comment = '';
      const name = invoice.SupplierName || '';
      let file_path = segments.slice(4).join('/') ? segments.slice(4).join('/') : invoice.file_path.slice(invoice.file_path.indexOf('file/'));
      const type = this.isPDFViewer ? 'pdf' : 'image';

        let imageArray = file_path.split(",").map((imageString) => {
            return {
                image_path: imageString,
                id: id,
                Description: comment,
                name: name,
                file_path: file_path,
                type: type,
            };
        });

        return imageArray;
    }

    allowRemoveEmptyWeeklyReport() {

        if(!this.userDetails.create_project_Ata) {
            return false;
        }

        let status = false;

        if (this.weekly_report) {

            if(this.weekly_report.Status == 0) {
                status = true;
            }

            if (
                this.weekly_report.tables.aaw.some((article) => article.Total > 0)
            ) {
                status = false;
            }

            if (this.weekly_report.tables.am.some((article) => article.Total > 0)) {
                status = false;
            }

            if (this.weekly_report.tables.ao.some((article) => article.Total > 0)) {
                status = false;
            }
        }
        return status;
    }

    getSupplierInvoicesLoadedFromOutside() {
        this.getSupplierInvoicesSub = this.ataInfoService.getSupplierInvoices().subscribe((res) => {
            if(res && res.length > 0) {
                this.supplierInvoices = res;
            }
        });
    }

    setAccount(type, value, i) {

        if(type == 'additionalWork') {
            this.articlesAdditionalWork.controls[i].get("Account").patchValue(value);
        }
        if(type == 'material') {
            this.articlesMaterial.controls[i].get("Account").patchValue(value);
        }
        if(type == 'other') {
            this.articlesOther.controls[i].get("Account").patchValue(value);
        }
    }

    getUserPermission() {

        if(this.weekly_report.Status != "0") {
            this.editAta = false;
        }else {
            this.usersService.getUserPermission("Ata", this.ata.ATAID).subscribe((res) => {

                if (res["status"]) {

                    this.fullName = res["data"]["fullName"];
                    this.editAta = res["data"]["edit"];

                    if (this.editAta && this.allowEditAta()) {
                        this.counter = 0;
                        if (this.ata.Status == "0" || this.ata.Status == "1") {
                            this.createForm.enable();
                            $('#dueDate').removeAttr("disabled");
                            $('#startDate').removeAttr("disabled");
                            $('.form-control').removeAttr("disabled");
                            this.fullName = "";
                        }
                    } else {
                        this.disable_buttons();
                    }
                }
            });
        }
    }

    enableUpdate() {
        if (this.ata.AtaTable != "ata_become_external" && this.editAta) {
          this.counter++;
          this.usersService.enableUpdate("Ata", this.ata.ATAID, this.counter);

          let obj = {
            ataId: this.ata.ATAID,
            url: this.router.url,
            type: "Ata",
          };

          this.cronService.setObject(obj);
        }
    }

    checkDoesComponentAvaiableForEditing() {
        const source = interval(5000);
        if (environment.production) {
            this.subscription = source.subscribe((val) => {
              this.getUserPermission();
            });
        }
    }

    allowEditAta() {

        let status = false;
        if(this.userDetails.create_project_Ata) {
            if (this.userDetails.create_project_Externalata || this.userDetails.role_name == this.adminRole /* 'Administrator'*/) {
                status = true;
            }
        }
        return status;
    }
}
