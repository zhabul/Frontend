import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { UsersService } from "src/app/core/services/users.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { GeneralsService } from "src/app/core/services/generals.service";
import { ProjectsService } from "src/app/core/services/projects.service";
import { AttachmentService } from "src/app/core/services/attachment.service";
import { FortnoxApiService } from "src/app/core/services/fortnoxApi.service";
import * as printJS from "print-js";
import { interval, Subscription } from "rxjs";
import { environment } from "src/environments/environment";
import { DomSanitizer } from "@angular/platform-browser";
import { CronService } from "src/app/core/services/cron.service";
import { AtaService } from "src/app/core/services/ata.service";
import * as moment from "moment";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ImageModalComponent } from "src/app/projects/components/image-modal/image-modal.component";
import { ImageModalUtility } from "src/app/projects/components/image-modal/image-modal-utility.service";
import { Subject } from "rxjs";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
//import { BASE_URL } from "src/app/config";
import { FileStorageService } from "src/app/core/services/file-storage.service";
import { PdfModalPreviewComponent } from "src/app/projects/components/pdf-modal-preview/pdf-modal-preview.component";

declare var $;

@Component({
  selector: "app-edit-ata",
  templateUrl: "./edit-ata.component.html",
  styleUrls: [
    "./edit-ata.component.css",
    "../../../../utility/image-preview.css",
    "../../image-modal/image-modal.component.css",
  ],
  providers: [ImageModalUtility],
})
export class EditAtaComponent implements OnInit, OnDestroy {
  public createForm: FormGroup;
  public atas: any = [];
  public userDetails;
  public language = "en";
  public selectedAta = 0;
  public project;
  public showPdfPreview = false;
  public showPdfInvoice = false;
  public generalImage;
  public units = [];
  public enabledAccounts = [];
  public deletedArticlesAditionalWork = [];
  public deletedArticlesMaterials = [];
  public deletedArticlesOther = [];
  public materialProperties = [];
  public client_workers = [];
  public dropdownSettings;
  public contacts = [];
  public AtaTypes = [];
  public AtaTypesServer = [];
  public ata_workers = [];
  public selectedAtaWorkers = [];
  public getDebitForms = [];
  public additionalWorkMoments = [];
  public get_last_email_log_but_first_client = [];
  public get_last_email_log_but_first_client_wr = [];
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
  };
  public selectedTab = 0;
  public attachments = [];
  public showAdditionalWorkTable = false;
  public showMaterialTable = false;
  public showOtherTable = false;
  public showDocuments = false;
  public showSupplierInvoiceModal = false;
  public supplierInvoices: any[] = [];
  public addedInvoices = [];
  public weeklyReports = [];
  public selectedReport = 0;
  public showingAtaOrDU = "ata";
  public showAttachmentImage = false;
  public currentAttachmentImage = null;
  public deviationNumber = 0;
  private subscription: Subscription;
  public ataId: any;
  public chooseFile = false;
  public uploadMessage: any;
  public showPdf: boolean = false;
  public currentAttachmentPdf = null;
  public spinner = false;
  public disabledButton = true;
  public state: string = "default";
  public whichPdfPreview = "ata";
  public rotateValue: number = 0;
  public editAta: boolean;
  public disabledInput: boolean;
  public counter = 0;
  public logs = [];
  public fullName: any;
  public clientAttestHistory = [];
  public totalSum = "0.00";
  public type: any;
  public weeklyReportPdfPreview;
  public weeks: any[] = [];
  public selectOpen: boolean = false;
  public selectOpenInvoiced: boolean = false;
  public selectStartedValue = "Not Invoiced";
  public selectStartedValueInvoiced = "Invoiced";
  public selectStartedImage: any = "";
  public weeklyReportsNotInvoiced: any[] = [];
  public weeklyReportsInvoiced: any[] = [];
  public default_weekly_reports: any[] = [];
  public weeksNotInvoiced: any[] = [];
  public weeksInvoiced: any[] = [];
  public atasNumbers: any;
  public newSupplierInvoices: any[] = [];
  public currentWeek = moment().isoWeek();
  public newWRDisabled = false;
  public articlesMaterialProjectDeduct = 0;
  public articlesOtherProjectDeduct = 0;
  // public showAtaOverview = false;
  public wrapper: any;
  public viewer: any;
  public initiallySelectedWeeklyReport: any = -1;
  public openPdf;
  public projectUserDetails: any;
  public selectedWeeklyReportById: any = null;
  public allowUpdateAtaStatus: boolean = false;
  public showDu: boolean = true;
  public allowDeleteDuRow: boolean = true;
  public allowManualAcepted: boolean = true;
  public sendCopy: boolean = false;
  public reminderCheckbox = false;
  public reminderCheckboxDU = false;
  public existing_empty_weekly_report: boolean = false;
  public avvikelseDeviation: any = false;
  public showWrImages: boolean = false;
  public sendBtnDisabled: boolean = false;
  public allowGetAtas: boolean = true;
  public sendingMail: boolean = false;
  public images: any[] = [];
  public pdf_documents: any[] = [];
  public files: any[] = [];
  public galleryImages: any[] = [];
  public ata_statuses: any[] = [];
  public show_elements: boolean = true;
  public selectedFirstClientWorker: any = null;
  public current_user: any = JSON.parse(sessionStorage.getItem("userDetails"));
  public current_user_full_name;
  public manual_rejected_ata_from_select: boolean = false;
  public pdfs_preview: any = [];
  public buttonToggle = false;
  public buttonToggleKS = false;
  public buttonToggleDots = false;
  public buttonToggleDotsKs = false;
  public buttonName = "Project Management";
  public iconColor = "";
  public statusColor: any;
  public buttonToggleProject = false;
  public currentClass = "title-new-project";
  public showSubProject = false;


  deletedDocumentsAta = [];

  swiper = {
    images: [],
    active: -1,
    album: -2,
    index: -1,
    parent: null,
  };

  swiperKS = {
    images: [],
    active: -1,
    album: -2,
    index: -1,
    parent: null,
  };

  public swiperAtt = {
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

  infoObjectAta = {
    content_type: "KS",
    content_id: null,
    type: "Ata",
    images: this.images,
    documents: this.pdf_documents,
    type_id: null,
  };
  ataAlbums: any[] = [];

  $_clearFiles: Subject<void> = new Subject<void>();

  updateAlbumsAta(event) {
    this.ataAlbums = event;
  }

  getAlbumKeys() {
    let keys = [];

    if (this.atas[this.selectedAta]) {
      const files = this.atas[this.selectedAta]["files"];
      keys = Object.keys(files).sort(function (a, b) {
        return Number(b) - Number(a);
      });
    }

    return keys;
  }

  getAlbumFiles(albumKey, type) {
    const files = this.atas[this.selectedAta]["files"][albumKey][type];

    return files;
  }

  getAlbumFilesUrls(albumKey, type) {
    const files = this.atas[this.selectedAta]["files"][albumKey][type].map(
      (file) => {
        return file["Url"];
      }
    );

    return files;
  }

  getAlbumDescription(albumKey) {
    const description =
      this.atas[this.selectedAta]["files"][albumKey]["description"];
    return description ? description : "";
  }

  infoObjectKS = {
    content_type: "KS",
    content_id: "",
    type: "Ata",
    type_id: "",
  };
  albums: any[] = [];
  $_clearFilesKS: Subject<void> = new Subject<void>();

  updateAlbumsAtaKS(event) {
    this.albums = event;
  }

  getAlbumKeysKS() {
    let keys = [];
    const activeDU = this.getActiveKS();
    if (activeDU) {
      const files = activeDU["files"];
      keys = Object.keys(files).sort(function (a, b) {
        return Number(b) - Number(a);
      });
    }
    return keys;
  }

  getAlbumFilesKS(albumKey, type) {
    const activeDU = this.getActiveKS();
    const files = activeDU["files"][albumKey][type];
    return files;
  }

  getAlbumDescriptionKS(albumKey) {
    const activeDU = this.getActiveKS();
    let description = "";
    if (activeDU) {
      description = activeDU["files"][albumKey]["description"];
    }
    return description;
  }

  getActiveKS() {
    return this.weeklyReports[this.selectedReport];
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

  public allArticlesAdditionalWork = [];
  public allArticlesMaterial = [];
  public allArticlesOther = [];
  public len: any;
  public activeAtaID: any;
  public fromDeviation: any;
  public fromDeviationLen:any
  public showKS:any;
  public showKSTabs:any=[];
  public selectIndex:any = 0;
  public errmsg:boolean = false
  public showParentKS:any= [];
  public showChildKS:any = [];
  public activeKSTab: any= '';

  public ActiveStatusAtaName: any;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private ataService: AtaService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private generalsService: GeneralsService,
    private fortnoxApi: FortnoxApiService,
    private projectsService: ProjectsService,
    private attachmentService: AttachmentService,
    public sanitizer: DomSanitizer,
    private usersService: UsersService,
    private router: Router,
    private cronService: CronService,
    private dialog: MatDialog,
    private imageModalUtility: ImageModalUtility,
    private fsService: FileStorageService
  ) {
    this.activeAtaID = route.snapshot.data.atas.data[0].ATAID;
  }

  ngOnInit() {
   this.ataService.getWeeklyReportsByAtaId(this.activeAtaID, this.project.id).then((res)=>{
      if(res["status"]){
        this.len = res["data"].length
      }
   });

   this.ataService
   .getAtaAndSubatas(this.activeAtaID)
   .then((res) => {
    this.fromDeviationLen = res.data[0].ata_relations.length
    this.fromDeviation = res.data[0].ata_relations[0]?.number.substring(9)
    });

    document.body.style.overflow = "auto";
    this.cronService.setObject(null);
    this.route.queryParamMap.subscribe((params) => {
      this.type = params.get("type") || null;
      this.openPdf = params.get("openPdf") || null;
      this.initiallySelectedWeeklyReport = params.get("weeklyreport") || -1;
    });

    this.language = sessionStorage.getItem("lang");
    this.translate.use(this.language);
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    this.project = this.route.snapshot.data["project"]["data"];
    this.articlesMaterialProjectDeduct = this.project["ataChargeMaterial"];
    this.articlesOtherProjectDeduct = this.project["ataChargeUE"];
    this.showSubProject = this.userDetails.create_project_Global == 0 ? false : true;

    this.dropdownSettings = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      selectAllText: this.translate.instant("Select All"),
      unSelectAllText: this.translate.instant("Unselect All"),
      itemsShowLimit: 0,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText:
        this.translate.instant("No data available"),
      searchPlaceholderText: this.translate.instant("Search"),
    };

    this.weeklyReports = this.route.snapshot.data["weekly_reports"];

    this.default_weekly_reports =
      this.route.snapshot.data["all_weekly_reports"];

    const ata_ = this.refreshAtas();

    if (ata_) {
      this.deviationNumber = this.atas[0].DeviationNumber;
      this.default_weekly_reports =
        this.route.snapshot.data["all_weekly_reports"];
      let logs = this.route.snapshot.data["email_logs"];

      this.logs = logs["data"];
      this.get_last_email_log_but_first_client =
        logs["get_last_email_log_but_first_client"];

      if (this.default_weekly_reports.length > 0 || this.atas.length > 1) {
        this.spinner = true;
      }

      if (this.default_weekly_reports) {
        this.weeklyReportsInvoiced = this.default_weekly_reports.filter(
          (res) => res["status"] == 5 || res["status"] == 3
        );
        this.weeklyReportsNotInvoiced = this.default_weekly_reports.filter(
          (res) => res["status"] != 5 && res["status"] != 3
        );
        if (this.atas.length == 1) this.spinner = false;
      }

      this.attachmentService
        .getAttachmentsByAtaId(this.atas[0].ProjectID, this.atas[0].ATAID)
        .subscribe((res) => {
          if (res["status"]) {
            this.attachments = res["data"];
          }
        });

      this.ataId = this.route.params["value"]["id"];
      const source = interval(5000);
      if (environment.production) {
        this.subscription = source.subscribe((val) => {
          this.getUserPermission();
        });
      }
      this.AtaTypesServer = this.route.snapshot.data["type_atas"];

      this.generateForm().then((res) => {
        this.getAllAtaArticles();
      });

      //  this.units = this.route.snapshot.data['units'].map(unit => this.translate.instant(unit));

      this.units = this.route.snapshot.data["units"];
      this.enabledAccounts = this.route.snapshot.data["enabledAccounts"];
      this.materialProperties = this.route.snapshot.data["materialProperties"];

      this.projectsService
        .getAttestClientWorkers(this.project.id)
        .then((res) => {
          this.client_workers = res;
        });

      let key = {
        key: "Logo",
      };

      this.generalsService.getSingleGeneralByKey(key).subscribe((res: any) => {
        this.generalImage = res["data"][0]["value"];
      });

      this.getUserPermission();
      this.getSupplierInoviceForAta();

      $(
        ".form-inputs input:not(#send-ks-copy-checkbox, #document, #send-copy-checkbox, #reminder-checkbox, #deviation, .toggle-delete-input), .toogle-enable, .form-inputs textarea"
      ).prop(
        "disabled",
        (this.atas[this.selectedAta].Status != "0" &&
          this.atas[this.selectedAta].EmailSent == "1") ||
          (this.atas[this.selectedAta].Status != "1" &&
            this.atas[this.selectedAta].EmailSent == "1")
      );

      this.projectsService
        .getClientAttestHistory(this.project.id, this.ataId)
        .then((res) => {
          if (res["status"]) {
            this.clientAttestHistory = res["data"];
          }
        });

      this.getWeeksThatHaveWeeklyReport();
      this.atasNumbers = this.atas.length;
      this.checkIfAtaCreatedFromDeviation();

      // Use Enter key as Tab //
      document.addEventListener("keydown", function (event) {
        if (event.keyCode === 13 && event.target["form"]) {
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
        }
      });

      this.avvikelseDeviation =
        this.atas[this.selectedAta].AvvikelseDeviation == 1;

      if (this.atas.length > 1) {
        this.spinner = true;
        this.changeSelectedAta(this.atas.length - 1, null, true);
      }

      this.current_user_full_name =
        this.current_user.firstname + " " + this.current_user.lastname;
      this.getDebitForm();
    }
    this.setColorBasedOnStatus();
  }

  redirectTo(){
    this.route.queryParams
    .subscribe(params => {
  if(params.from == 'forecast'){
    this.router.navigate(['/projects/view/',this.project.id],  {queryParams: {from: 'forecast'}})

  }else{
    this.router.navigate(['/projects/view/',this.project.id])
  }

    })
  }
  updateAtaComment() {
    let object = {
      id: this.atas[this.selectedAta].ATAID,
      comment: this.createForm.get("ataComment").value,
    };

    this.ataService.updateAtaComment(object).subscribe((res) => {
      if (res["status"])
        this.toastr.success(
          this.translate.instant("TSC_You_have_successfully_updated_comment"),
          this.translate.instant("Success")
        );
      else this.toastr.error(this.translate.instant("Error"));
    });
  }

  setAtaTypes(payment_type) {
    if (payment_type == 1) {
      this.AtaTypes = this.AtaTypesServer.filter((type) => {
        return type.id != "3";
      });
    } else {
      this.AtaTypes = this.AtaTypesServer;
    }
  }

  getSupplierInoviceForAta() {
    this.ataService
      .getSupplierInoviceForAta(
        this.project.id,
        this.atas[this.selectedAta].ATAID,
        this.atas[0].AtaNumber,
        this.atas[0].ATAID
      )
      .subscribe((res) => {
        this.supplierInvoices = res["invoices"];

        if (this.supplierInvoices.length > 0) this.showMaterialTable = true;

        this.newSupplierInvoices = this.supplierInvoices.filter(
          (invoice) => invoice.IsNew == "1"
        );
      });
  }

  pluckObjects(arr, key) {
    var newArr = [];
    for (var i = 0, x = arr.length; i < x; i++) {
      if (arr[i].hasOwnProperty(key)) {
        newArr.push(arr[i].key);
      }
    }
    return newArr;
  }

  clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  getAllAtaArticles() {
    this.allArticlesAdditionalWork = [];
    this.allArticlesMaterial = [];
    this.allArticlesOther = [];

    this.clearFormArray(this.articlesAdditionalWork);
    this.clearFormArray(this.articlesMaterial);
    this.clearFormArray(this.articlesOther);

    this.atas[this.selectedAta].articlesAdditionalWork.forEach((article) => {
      if (
        (this.atas[this.selectedAta].PaymentType != 4 &&
          this.atas[this.selectedAta].PaymentType != 1) ||
        (this.atas[this.selectedAta].PaymentType == 4 &&
          this.showingAtaOrDU == "ata" &&
          article.wrId == "0") ||
        (this.atas[this.selectedAta].PaymentType == 1 &&
          this.showingAtaOrDU == "ata" &&
          article.wrId == "0")
      ) {
        this.articlesAdditionalWork.push(this.fb.group(article));
      }

      this.allArticlesAdditionalWork.push(article);
    });

    this.atas[this.selectedAta].articlesMaterial.forEach((article) => {
      article.displayName = article.Name;

      if (
        (this.atas[this.selectedAta].PaymentType != 4 &&
          this.atas[this.selectedAta].PaymentType != 1) ||
        (this.atas[this.selectedAta].PaymentType == 4 &&
          this.showingAtaOrDU == "ata" &&
          article.wrId == "0") ||
        (this.atas[this.selectedAta].PaymentType == 1 &&
          this.showingAtaOrDU == "ata" &&
          article.wrId == "0")
      ) {
        this.articlesMaterial.push(this.fb.group(article));
      }

      this.allArticlesMaterial.push(article);
    });

    this.atas[this.selectedAta].articlesOther.forEach((article) => {
      article.displayName = article.Name;

      if (
        (this.atas[this.selectedAta].PaymentType != 4 &&
          this.atas[this.selectedAta].PaymentType != 1) ||
        (this.atas[this.selectedAta].PaymentType == 4 &&
          this.showingAtaOrDU == "ata" &&
          article.wrId == "0") ||
        (this.atas[this.selectedAta].PaymentType == 1 &&
          this.showingAtaOrDU == "ata" &&
          article.wrId == "0")
      ) {
        this.articlesOther.push(this.fb.group(article));
      }

      this.allArticlesOther.push(article);
    });

    this.showAdditionalWorkTable =
      this.atas[this.selectedAta].articlesAdditionalWork.length > 0;
    this.showMaterialTable =
      this.atas[this.selectedAta].articlesMaterial.length > 0 ||
      this.newSupplierInvoices.length > 0;
    this.showOtherTable = this.atas[this.selectedAta].articlesOther.length > 0;
    this.showDocuments = this.weeklyReports.length > 0;
    this.articlesAdditionalWork.push(
      this.fb.group(this.addEmptyArticle("articlesAdditionalWork"))
    );
    this.articlesMaterial.push(
      this.fb.group(this.addEmptyArticle("articlesMaterial"))
    );
    this.articlesOther.push(
      this.fb.group(this.addEmptyArticle("articlesOther"))
    );
    this.openPdf == "true" ? (this.showPdfPreview = true) : null;
  }

  capitalizeFirstLetter(string) {
    return string ? string[0].toUpperCase() + string.slice(1) : "";
  }

  getAllDUArticles() {

    const report = this.weeklyReports[this.selectedReport];

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
        })
      );
    });

    this.showAdditionalWorkTable = report.tables.aaw.length > 0;
    this.showMaterialTable =
      report.tables.am.length > 0 || this.newSupplierInvoices.length > 0;
    this.showOtherTable = report.tables.ao.length > 0;
    this.showDocuments = this.weeklyReports.length > 0;

    this.articlesAdditionalWork.push(
      this.fb.group(this.addEmptyArticle("articlesAdditionalWork"))
    );
    this.articlesMaterial.push(
      this.fb.group(this.addEmptyArticle("articlesMaterial"))
    );
    this.articlesOther.push(
      this.fb.group(this.addEmptyArticle("articlesOther"))
    );


  }

  getWeeksThatHaveWeeklyReport() {
    this.spinner = true;
    this.projectsService
      .getWeeksThatHaveWeekyReportForAta(this.atas[this.selectedAta].ATAID)
      .then((res) => {
        this.spinner = false;

        if (this.type == "external") this.weeks = res["data"];
        else this.weeks = res["data"].filter((res) => res["external"] == "0");

        this.weeksInvoiced = this.weeks.filter((res) => res["status"] == 5);
        this.weeksNotInvoiced = this.weeks.filter(
          (res) => res["status"] != 5 && res["status"] != 3
        );

        this.selectedReport = this.weeksNotInvoiced.findIndex(
          (week) => week.week == this.initiallySelectedWeeklyReport
        );
        if (this.selectedReport != -1) {
          this.changeSelectedReport(
            this.selectedReport,
            this.weeksNotInvoiced[this.selectedReport],
            "notInvoiced"
          );
        } else {
          this.selectedReport = this.weeksInvoiced.findIndex(
            (week) => week.week == this.initiallySelectedWeeklyReport
          );
          if (this.selectedReport != -1) {
            this.changeSelectedReport(
              this.selectedReport,
              this.weeksInvoiced[this.selectedReport],
              "Invoiced"
            );
          }
        }

        if (this.initiallySelectedWeeklyReport != -1) {
          this.showPdfPreview = true;
          this.showingAtaOrDU = "du";
        }

        this.checkWr();
        this.showDu = true;
      });


  }

  checkWr() {
    if (this.weeks.some((obj) => obj.week == this.currentWeek)) {
      this.newWRDisabled = true;
    }

    if (
      (this.weeks.length > 0 &&
        this.weeks[this.weeks.length - 1].week == this.currentWeek) ||
      (this.weeks.length > 0 && this.weeks[this.weeks.length - 1].status == 2)
    ) {
      this.newWRDisabled = false;
    }
  }

  async generateForm() {
    const paymentType = this.atas[this.selectedAta].PaymentType;

    this.setAtaTypes(paymentType);

    this.createForm = this.fb.group({
      id: [this.atas[0].ATAID, []],
      Deviation: [this.atas[this.selectedAta].Deviation, []],
      Name: [
        this.atas[this.selectedAta].Name,
        [Validators.required, Validators.maxLength(50)],
      ],
      AtaType: [
        { value: this.atas[this.selectedAta].AtaType, disabled: false },
        [Validators.required],
      ],
      AtaNumber: [this.atas[this.selectedAta].AtaNumber],
      DeviationNumber: [this.atas[this.selectedAta].DeviationNumber],
      StartDate: [this.atas[this.selectedAta].StartDate, [Validators.required]],
      DueDate: [this.atas[this.selectedAta].DueDate, [Validators.required]],
      RevisionDate: [this.atas[this.selectedAta].RevisionDate, []],
      Status: [this.atas[this.selectedAta].Status, [Validators.required]],
      street: [this.project.street, []],
      city: [this.project.city, []],
      zip: [this.project.zip, []],
      clientName: [this.project.clientName, []],
      briefDescription: [
        this.atas[this.selectedAta].briefDescription || "",
        Validators.maxLength(500),
      ],
      ataComment: [
        this.atas[this.selectedAta].ataComment || "",
        Validators.maxLength(4000),
      ],
      articlesAdditionalWork: this.fb.array([]),
      articlesMaterial: this.fb.array([]),
      articlesOther: this.fb.array([]),
      paymentType: [paymentType, [Validators.required]],
      paymentTypeName: [
        this.atas[this.selectedAta].paymentTypeName,
        [Validators.required],
      ],
      ClientComment: this.atas[this.selectedAta].ClientComment,
      AnswerEmail: this.atas[this.selectedAta].AnswerEmail,
      AnswerTime: this.atas[this.selectedAta].AnswerTime,
      AuthorName: [this.atas[0].AuthorName],
      invoicedTotal: this.atas[this.selectedAta].invoicedTotal,
      Type: this.type,
      clientResponses: this.fb.array(
        this.atas[this.selectedAta].clientResponses
      ),
      parent: [this.atas[this.selectedAta].ParentAta],
      timesEmailSent: [this.atas[this.selectedAta].timesEmailSent],
      timesReminderSent: [this.atas[this.selectedAta].timesReminderSent],
      timesReminderSentDU: this.atas[this.selectedAta].timesReminderSentDU,
      totallyWorkedUp: [this.atas[this.selectedAta].totallyWorkedUp],
      additionalWorkStatus: [null, []],
      labeling_requirements: [
        this.atas[this.selectedAta].labeling_requirements,
      ],
      email_log_date: [this.atas[this.selectedAta].email_log_date],
    });

    this.generateStartAndEndDateDatePicker();
  }


  generateStartAndEndDateDatePicker() {

    setTimeout(()=>{
      const datepickerOptions = {
        format: "yyyy-mm-dd",
        calendarWeeks: true,
        autoclose: true,
        language: this.language,
        currentWeek: true,
        todayHighlight: true,
        currentWeekTransl: this.language === "en" ? "Week" : "Vecka",
        currentWeekSplitChar: "-",
      };

      $("#startDate")
        .datepicker(datepickerOptions)
        .on("changeDate", (ev) => {
          if (
            Date.parse(ev.target.value.split(" ")[0]) >
            Date.parse(this.createForm.value.DueDate.split(" ")[0])
          ) {
            setTimeout(() => {
              this.toastr.info(
                this.translate.instant("Start date cannot be after end date."),
                this.translate.instant("Info")
              );
              ev.target.value = this.createForm.value.StartDate;
            }, 0);
          } else {
            this.createForm.get("StartDate").patchValue(ev.target.value);
          }
        })
        .on("blur", (e) => {
          e.target.value = this.createForm.value.StartDate;
        });

      $("#dueDate")
        .datepicker(datepickerOptions)
        .on("changeDate", (ev) => {
          if (
            Date.parse(ev.target.value.split(" ")[0]) <
            Date.parse(this.createForm.value.StartDate.split(" ")[0])
          ) {
            setTimeout(() => {
              this.toastr.info(
                this.translate.instant("Due date cannot be before start date."),
                this.translate.instant("Info")
              );
              ev.target.value = this.createForm.value.DueDate;
            }, 0);
          } else {
            this.createForm.get("DueDate").patchValue(ev.target.value);
          }
        })
        .on("blur", (e) => {
          e.target.value = this.createForm.value.DueDate;
        });

      if (this.createForm.value.StartDate) {
        $("#startDate").datepicker(
          "setDate",
          this.createForm.value.StartDate.split(" ")[0]
        );
      }
      if (this.createForm.value.DueDate) {
        $("#dueDate").datepicker(
          "setDate",
          this.createForm.value.DueDate.split(" ")[0]
        );
      }

    }, 250);
  }

  setPriceControlError(formGroup, i, Price) {
    const priceControl = formGroup.controls[i].controls.Price;
    const err = Price == 0 ? true : false;
    priceControl.setErrors({ incorrect: err });
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

    total = (
      Quantity *
      Price *
      (formGroup.controls[i].value.Deduct / 100 + 1)
    ).toFixed(2);

    const ataType = this.createForm.get("AtaType").value;

    if (ataType == "3") {
      const totalNum = Number(total);
      if (totalNum > 0) {
        total = totalNum * -1;
      }
    }

    (<FormGroup>formGroup.controls[i]).controls["Total"].patchValue(total);

    return total;
  }

  changeSelectedTab(index) {
    if (index == 1) {
      this.ataService
        .getAtaWorkersAndResponsiblePersons(this.project.id, this.atas[0].ATAID)
        .subscribe((res) => {
          this.selectedTab = index;
          this.ata_workers = res["data"];
        });
    } else {
      this.selectedTab = index;
    }
    setTimeout(() => {
      $(
        ".form-inputs input:not(#send-ks-copy-checkbox, #document, #send-copy-checkbox, #reminder-checkbox, .toggle-delete-input), .form-inputs select:not(#ata-status), .form-inputs textarea"
      ).prop(
        "disabled",
        this.atas[this.selectedAta].Status != "0" ||
          this.atas[this.selectedAta].EmailSent == "1"
      );
      $("#ataComment").removeAttr("disabled");
    }, 0);
  }

  updateAtaWorkers(index, isChecked) {
    this.ataService
      .updateAtaWorkers(
        this.ata_workers[index].UserID,
        this.atas[0].ATAID,
        isChecked ? 1 : 0,
        this.project.id
      )
      .subscribe((res) => {
        if (res["status"]) {
        }
      });
  }

  addRow(formGroup, table) {
    if (formGroup.controls[formGroup.controls.length - 2]) {
      if (formGroup.controls[formGroup.controls.length - 2].value.Name !== "") {
        formGroup.push(this.fb.group(this.addEmptyArticle(table)));
      }
    } else if (formGroup.controls[formGroup.controls.length - 1]) {
      formGroup.push(this.fb.group(this.addEmptyArticle(table)));
    }
  }

  removeRow(index, formGroup, type) {
    if (
      formGroup.controls[index].value.Name == "" &&
      formGroup.value.filter((article) => article.Name == "").length == 1
    ) {
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
          const momentDocuments = this.weeklyReports[this.selectedReport]
            ? this.weeklyReports[this.selectedReport].files["694201337"]
            : false;
          if (momentDocuments && momentDocuments.images) {
            momentDocuments.images = momentDocuments.images.filter(
              (article) => {
                return article.article_id != formGroup.controls[index].value.id;
              }
            );

            if (momentDocuments.images.length === 0) {
              delete this.weeklyReports[this.selectedReport].files["694201337"];
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
              this.deletedArticlesAditionalWork.push(
                formGroup.controls[index].value.id
              );
            } else if (type == 2) {
              this.deletedArticlesMaterials.push(
                formGroup.controls[index].value.id
              );
            } else if (type == 3) {
              this.deletedArticlesOther.push(
                formGroup.controls[index].value.id
              );
            }

            if (this.weeklyReports[this.selectedReport]) {
              this.weeklyReports[this.selectedReport].rowDeleted = true;
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
        }
      });
  }

  async updateAta(
    addReminder = true,
    showToastr = true,
    changeAtas = true,
    createAtaFromDeviation = 0,
    notSendWeekly = true,
    clickFromSaveBtn = false,
    spinner = false,
    update_email_log = false,
    print = false,
    atastatus = null,
    generate_ata_pdf = true
  ) {
    const data = this.createForm.value;
    const valid = this.validateForm();
    let response = null;
    $(".documents-wrapper").removeClass("documents-warrning");

    if (valid) {
      if (!spinner) this.spinner = true;
      this.disabledButton = false;
      data.articlesAdditionalWork = data.articlesAdditionalWork.filter(
        function (row) {
          return row.Name != "";
        }
      );

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
      data.articlesMaterial = data.articlesMaterial.filter((row) => {
        return row.Name != "";
      });
      data.articlesMaterial = data.articlesMaterial.map((article) => {
        article.Quantity = Number(
          article.Quantity.toString().replace(/\s/g, "").replace(",", ".")
        );
        article.Price = Number(
          article.Price.toString().replace(/\s/g, "").replace(",", ".")
        );
        return article;
      });

      data.articlesOther = data.articlesOther.filter((row) => {
        return row.Name != "";
      });
      data.articlesOther = data.articlesOther.map((article) => {
        article.Quantity = Number(
          article.Quantity.toString().replace(/\s/g, "").replace(",", ".")
        );
        article.Price = Number(
          article.Price.toString().replace(/\s/g, "").replace(",", ".")
        );
        return article;
      });

      let wr_documents = null;

      if (this.showingAtaOrDU === "du") {
        const content = this.getContentIdForInfoObject();
        const content_id = content.content_id;
        const type_id = content.type_id;
        const files = this.getActiveKS().files;

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
          wr_id: this.weeklyReports[this.selectedReport].id,
          images: images,
          pdf_documents: pdf_documents,
          removed_documents:
            this.weeklyReports[this.selectedReport].removed_documents,
        };
      }

      const albumFiles = this.imageModalUtility.getAlbumFiles(this.ataAlbums);
      const _newAlbumFiles = await this.fsService.mergeFilesAndAlbums(albumFiles);

      if(_newAlbumFiles != null) {
        albumFiles.images = _newAlbumFiles.images;
        albumFiles.pdfs = _newAlbumFiles.pdfs;
      }

      const files = this.atas[this.selectedAta]["files"];
      const ataServerFiles = this.imageModalUtility.getAlbumFiles(files);
      const newFiles = albumFiles.images.concat(albumFiles.pdfs);
      const serverFiles = ataServerFiles.images.concat(ataServerFiles.pdfs);
      const attachments = serverFiles.concat(newFiles);

      let client_worker = null;
      let contact_pom = [];

      if (update_email_log) {
        this.client_workers.forEach((client_worker, i) => {
          let cont = this.contacts.find(
            (contact) => contact.Id == client_worker.Id
          );

          if (!cont) {
            this.client_workers[i].selected = false;
          } else {
            this.client_workers[i].selected = true;
            let obj = {
              Id: client_worker.Id,
              Name: client_worker.Name,
            };

            contact_pom.push(obj);
          }
        });

        if (contact_pom.length > 0) this.contacts = contact_pom;

        this.selectedFirstClientWorker = this.client_workers.find(
          (client) => client.selected == true
        );

        if (this.selectedFirstClientWorker) {
          client_worker = this.selectedFirstClientWorker["Name"];
        }
      }

      const fullname = this.sendCopy
        ? data.AuthorName
        : this.userDetails.firstname + " " + this.userDetails.lastname;

      const ata = {
        id: this.atas[this.selectedAta].ATAID,
        AtaNumber: this.atas[this.selectedAta].AtaNumber,
        DeviationNumber: this.atas[this.selectedAta].DeviationNumber,
        Deviation: this.atas[this.selectedAta].Deviation,
        pdf_link: this.atas[this.selectedAta].PDFUrl,
        Name: data.Name,
        AtaType: data.AtaType,
        StartDate: data.StartDate,
        DueDate: data.DueDate,
        Status: atastatus ? atastatus : data.Status,
        ProjectID: this.project.id,
        articlesAdditionalWork: data.articlesAdditionalWork,
        articlesMaterial: data.articlesMaterial,
        articlesOther: data.articlesOther,
        deletedArticlesAditionalWork: this.deletedArticlesAditionalWork,
        deletedArticlesMaterials: this.deletedArticlesMaterials,
        deletedArticlesOther: this.deletedArticlesOther,
        street: data.street,
        city: data.city,
        zip: data.zip,
        clientName: data.clientName,
        briefDescription: data.briefDescription,
        ataComment: data.ataComment,
        paymentType: data.paymentType,
        invoicedTotal: data.invoicedTotal,
        totallyWorkedUp: data.totallyWorkedUp,
        wrId:
          this.showingAtaOrDU === "du"
            ? this.weeklyReports[this.selectedReport].id
            : 0,
        wr_documents: wr_documents,
        fullname: fullname,
        WeeklyReportDueDate:
          this.showingAtaOrDU === "du"
            ? this.weeklyReports[this.selectedReport].WeeklyReportDueDate
            : "",
        documents: this.atas[this.selectedAta]["Documents"],
        attachments: attachments,
        pdf_images_link: this.atas[this.selectedAta]["pdf_images_link"],
        external: this.atas[this.selectedAta].external,
        Type: this.atas[this.selectedAta].Type,
        changeAtas: changeAtas,
        oldPaymentType: this.atas[0].PaymentType,
        parent: this.atas[this.selectedAta].ParentAta,
        BecameAtaFromDeviation: createAtaFromDeviation,
        timesEmailSent: this.atas[this.selectedAta].timesEmailSent,
        timesReminderSent:
          this.reminderCheckbox && addReminder
            ? Number(this.atas[this.selectedAta].timesReminderSent) + 1
            : this.atas[this.selectedAta].timesReminderSent,
        timesReminderSentDU: data.timesReminderSentDU,
        sendReminder: this.reminderCheckbox ? true : false,
        sendReminderDU: this.reminderCheckboxDU ? true : false,
        BecomeExternalAtaFromInternal:
          this.atas[0].BecomeExternalAtaFromInternal,
        client_worker: client_worker,
        sendCopy: this.sendCopy,
        print: print,
        manual_rejected_ata_from_select: this.manual_rejected_ata_from_select,
        type_name: this.type,
        generate_ata_pdf: generate_ata_pdf
      };

      ata.deletedArticlesAditionalWork =
        ata.deletedArticlesAditionalWork.filter(function (row) {
          return row != "";
        });
      ata.deletedArticlesMaterials = ata.deletedArticlesMaterials.filter(
        function (row) {
          return row != "";
        }
      );
      ata.deletedArticlesOther = ata.deletedArticlesOther.filter(function (
        row
      ) {
        return row != "";
      });

      if (
        this.showingAtaOrDU == "du" &&
        clickFromSaveBtn &&
        ata.articlesAdditionalWork.length < 1 &&
        ata.articlesMaterial.length < 1 &&
        ata.articlesOther.length < 1 &&
        ata.deletedArticlesAditionalWork.length < 1 &&
        ata.deletedArticlesMaterials.length < 1 &&
        ata.deletedArticlesOther.length < 1
      ) {
        if (!spinner) this.spinner = false;
        this.disabledButton = true;
        this.toastr.info(
          this.translate.instant("There are no changes to be saved!"),
          this.translate.instant("Info")
        );
        return;
      }

      if (!ata.timesReminderSent) ata.timesReminderSent = 0;
      if (!spinner) {
        this.spinner = true;
        this.show_elements = false;
      }

      response = await this.ataService.updateAta(ata);

      if (response["status"]) {
        this.disabledButton = true;
        if (changeAtas) {
            if(this.type == "internal") {
                const res = await this.ataService.getInternalAtaAndSubatas2(
                    this.atas[0].ATAID
                );
                this.atas = res["data"];
            }else {
                const res = await this.ataService.getAtaAndSubatas(
                    this.atas[0].ATAID
                );
                this.atas = res["data"];
            }

        }

        this.deletedArticlesAditionalWork = [];
        this.deletedArticlesMaterials = [];
        this.deletedArticlesOther = [];
        this.deletedDocumentsAta = [];

        if (this.atas[this.atas.length - 1].Status == 3) {
          this.allowUpdateAtaStatus = false;
        }

        if (this.supplierInvoices.length > 0) {
          this.supplierInvoices.forEach((invoice) => {
            if (invoice.isChecked) {
              this.fortnoxApi.getSupplierInvoiceAttachments(invoice.OrderNR);
            }
          });
        }

        const res2 = await this.ataService.getWeeklyReportsByAtaId(
          this.atas[this.selectedAta].ATAID,
          this.project.id
        );



        if (res2["status"]) this.default_weekly_reports = res2["data"];

        this.ataAlbums = [];
        this.$_clearFiles.next();
        this.albums = [];
        this.$_clearFilesKS.next();

        let oldWeeklyReportID = null;
        let oldSelectedWeeklyReportID = null;
        if (
          this.weeklyReports.length > 0 &&
          this.selectedReport != -1 &&
          this.selectedReport != null &&
          this.weeklyReports[this.selectedReport] &&
          this.weeklyReports[this.selectedReport].id
        ) {
          if (this.weeklyReports[this.selectedReport].parent != 0)
            oldWeeklyReportID = this.weeklyReports[this.selectedReport].parent;
          else oldWeeklyReportID = this.weeklyReports[this.selectedReport].id;

          oldSelectedWeeklyReportID =
            this.weeklyReports[this.selectedReport].id;
        }

        if (notSendWeekly) {
          const res3 = await this.ataService.getNotSendWeeklyReportsByAtaId(
            this.atas[this.selectedAta].ATAID,
            oldWeeklyReportID,
            this.project.id
          );

          if (res3["status"]) {
            this.weeklyReports = res3["data"];
          }

          if (oldSelectedWeeklyReportID)
            this.selectedReport = this.weeklyReports.findIndex(
              (value) => value.id == oldSelectedWeeklyReportID
            );
        }

        while (this.articlesAdditionalWork.length !== 0) {
          this.articlesAdditionalWork.removeAt(0);
        }
        while (this.articlesMaterial.length !== 0) {
          this.articlesMaterial.removeAt(0);
        }
        while (this.articlesOther.length !== 0) {
          this.articlesOther.removeAt(0);
        }

        if (this.showingAtaOrDU === "du") {
          this.getAllDUArticles();
        } else {
          this.getAllAtaArticles();
        }

        if (showToastr) {
          this.toastr.success(
            this.translate.instant("You successfully updated Ata."),
            this.translate.instant("Success")
          );
        }
        this.allowManualAcepted = true;
        if (this.selectedWeeklyReportById) {
          let index1 = this.weeklyReports.findIndex(
            (value) => value.id == this.selectedWeeklyReportById
          );

          if (index1 != -1) this.selectedReport = index1;
          else this.selectedReport = 0;

          this.selectedWeeklyReportById = null;
        }

        if (
          (this.weeklyReports.length > 0 &&
            this.selectedReport != null &&
            this.selectedReport != -1 &&
            this.weeklyReports[this.selectedReport].Status == 0 &&
            print) ||
          (this.weeklyReports.length > 0 &&
            this.selectedReport != null &&
            this.selectedReport != -1 &&
            this.weeklyReports[this.selectedReport].Status == 1 &&
            print)
        ) {
          if (!update_email_log)
            this.ataService.updateWeeklyReportPdf(
              this.weeklyReports[this.selectedReport].id,
              null,
              this.sendCopy
            );
          else if (update_email_log)
            this.ataService.updateWeeklyReportPdf(
              this.weeklyReports[this.selectedReport].id,
              client_worker,
              this.sendCopy
            );
        }

        this.getSupplierInoviceForAta();
        if (!spinner) {
          this.spinner = false;
          this.show_elements = true;
        }
      } else {
        if (!spinner) {
          this.spinner = false;
          this.show_elements = true;
        }
        this.toastr.error(this.translate.instant("Error"));
      }
        if(this.selectedReport == -1) {
            this.generateForm().then((res) => {
                this.getAllAtaArticles();
            });
        }
    }

    this.checkIfAtaCreatedFromDeviation();

    let status = {
      status: false,
    };

    if (response && response["status"]) {
      status = response;
    }

    return status;
  }

  getNotSendWeeklyReport(
    selected_next_index = null,
    spinner = false,
    changeSelectedReport = false
  ) {
    if (spinner) {
      this.spinner = true;
      this.show_elements = false;
    }
    this.ataService
      .getNotSendWeeklyReportsByAtaId(this.atas[this.selectedAta].ATAID, null, this.project.id)
      .then((result) => {
        if (result["status"]) {
          const data = result["data"];
          this.weeklyReports = result["data"];





        var i = 0;
        this.weeklyReports.forEach(element => {
          element.index =  i++;
          if(element.id != this.showKS.id && this.showKS.id == element.parent &&  element.index == this.weeklyReports[this.selectedReport+1].index ){
            this.showKSTabs.push(element)
          }
        });


          if (data.length > 0) {
            const reportsFix = this.default_weekly_reports.slice(0);
            const number = reportsFix.length - 1 < 0 ? 0 : reportsFix.length;
            reportsFix[number] = data[data.length - 1];
            this.default_weekly_reports = reportsFix;
            if (selected_next_index) {
              this.selectedReport = this.selectedReport + 1;

              if (changeSelectedReport) {
                let week = {
                  week: this.weeklyReports[this.selectedReport].week,
                };
                this.changeSelectedReport(this.selectedReport, week, null);
              }
            }
            if (spinner) {
              this.spinner = false;
              this.show_elements = true;
            }
          }
          this.refreshAtas();
        }
      });
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

  togglePdfPreview(whichPdf) {
    if (this.showPdfPreview) {
      if (this.whichPdfPreview === whichPdf) {
        this.showPdfPreview = !this.showPdfPreview;
      }
    } else {
      this.showPdfPreview = !this.showPdfPreview;
    }

    this.whichPdfPreview = whichPdf;
  }

  backButtonFunction(index, event) {
    this.initiallySelectedWeeklyReport = -1;

    if (this.selectedTab !== 0) {
      this.changeSelectedTab(0);
    } else {
      this.changeSelectedAta(index, event);
    }
  }

  changeSelectedAta(index, event, from_init = false) {

    this.showKSTabs = [];
    this.showChildKS = [];
    this.showKS=[];
    this.showParentKS = [];

  if (this.spinner) return;
    if (this.sendingMail) {
      return false;
    }

    event ? event.stopPropagation() : "";
    // this.spinner = true;
    this.showDu = false;
    this.selectedAta = index;
    this.showingAtaOrDU = "ata";
    this.files = [];
    this.images = [];
    this.pdf_documents = [];
    this.getUserPermission();
    this.generateForm().then((res) => {
      this.getAllAtaArticles();
    });

    const clientResponses = this.createForm.get("clientResponses") as FormArray;

    while (clientResponses.length !== 0) {
      clientResponses.removeAt(0);
    }


    this.atas[this.selectedAta]?.ata_statuses.forEach((statusActive) =>{
      if(this.atas[this.selectedAta].Status == statusActive.Status){
        this.ActiveStatusAtaName = statusActive.Name;
      }
    })
    this.atas[this.selectedAta].clientResponses.forEach((cr) => {
      clientResponses.push(this.fb.group(cr));
    });

    $(
      ".form-inputs input:not(#send-ks-copy-checkbox, #document, #send-copy-checkbox, #reminder-checkbox, .toggle-delete-input), .form-inputs select:not(#ata-status), .form-inputs textarea"
    ).prop(
      "disabled",
      this.atas[this.selectedAta].Status != "0" ||
        this.atas[this.selectedAta].EmailSent == "1"
    );
    while (this.articlesAdditionalWork.length !== 0) {
      this.articlesAdditionalWork.removeAt(0);
    }
    while (this.articlesMaterial.length !== 0) {
      this.articlesMaterial.removeAt(0);
    }
    while (this.articlesOther.length !== 0) {
      this.articlesOther.removeAt(0);
    }

    if (!from_init) {
      this.getAllAtaArticles();
    }

    this.ataService
      .getWeeklyReportsByAtaId(this.atas[this.selectedAta].ATAID, this.project.id)
      .then((res2) => {

        if (res2["status"]) {
          this.default_weekly_reports = res2["data"];
          this.weeklyReportsInvoiced = this.default_weekly_reports.filter(
            (res) => res["status"] == 5 || res["status"] == 3
          );
          this.weeklyReportsNotInvoiced = this.default_weekly_reports.filter(
            (res) => res["status"] != 5 && res["status"] != 3
          );
          this.spinner = false;
        }
        this.getWeeksThatHaveWeeklyReport();
      });

    this.ataService
      .getNotSendWeeklyReportsByAtaId(this.atas[this.selectedAta].ATAID, null, this.project.id)
      .then((res3) => {
        if (res3["status"]) {

          this.weeklyReports = res3["data"];

           var i = 0;
          this.weeklyReports.forEach(el => {
              el.index =  i++;
            if(el.parent == 0){
              this.showParentKS.push(el);
            }else{
              this.showChildKS.push(el);
            }

          });
          this.showKS = this.showParentKS[this.selectIndex]

        }
      });

    this.getEmailLogsForAta();
    this.getSupplierInoviceForAta();
    this.avvikelseDeviation =
      this.atas[this.selectedAta].AvvikelseDeviation == 1;
    this.setColorBasedOnStatus();
  }

setNext(){
    if(this.selectIndex >= 0 && this.selectIndex < (this.showParentKS.length-1)){
      this.showKSTabs=[];
      this.showKS=[];
      this.selectIndex= this.selectIndex + 1;
      this.showKS = this.showParentKS[this.selectIndex]
      this.showChildKS.forEach(element => {
        if(element.parent == this.showKS.id){
          this.showKSTabs.push(element)
        }
      });

      this.changeSelectedReport(this.showKS.index,this.showKS, null )
    }
  }

openKS(index, week, type = null){
    if(this.showingAtaOrDU=='ata'){
    this.showKSTabs=[];
    this.showChildKS.forEach(element => {
      if(element.parent == this.showKS.id){
        this.showKSTabs.push(element)
      }
    });
      this.showDu = true;
      this.changeSelectedReport(index, week, null )
    }
  }

setPrevious(){
    if(this.selectIndex> 0 && this.selectIndex < (this.showParentKS.length)){
      this.showKSTabs=[];
    this.showKS=[];
      this.selectIndex= this.selectIndex - 1;
      this.showKS = this.showParentKS[this.selectIndex]
      this.showChildKS.forEach(element => {
        if(element.parent == this.showKS.id){
          this.showKSTabs.push(element)
        }
      });
      this.changeSelectedReport(this.showKS.index,this.showKS, null )
  }
 }

getEmailLogsForAta() {
    this.ataService
      .getEmailLogsForAta(this.atas[this.selectedAta].ATAID, this.project.id)
      .subscribe((res) => {
        if (res["status"]) {
          this.logs = res["data"];
          this.get_last_email_log_but_first_client =
            res["get_last_email_log_but_first_client"];
        }
      });
  }

  changeSelectedReportFromOverview(event) {
    const info = event.info;
    const invoiced = event.invoiced;
    this.changeSelectedReport(-1, info, invoiced);
    // this.toggleAtaOverview();
  }

  setActiveTab(index, week, type= null){ //ks-revisions ex: KS-V44-1 ..
    this.changeSelectedReport(index, week, null)
    this.activeKSTab = index;
  }
  changeSelectedReport(index, week, type = null) {
    if (this.spinner) return;
    this.showingAtaOrDU = "du";
    this.showPdfInvoice = false;
    this.pdfs_preview = [];
    if (
      this.atas[this.selectedAta].BecomeExternalAtaFromInternal == "1" &&
      this.type == "internal"
    ) {
      this.additionalWorkMoments =
        this.atas[this.selectedAta]["WeeklyReportsMomentsPerWeek"][week.week];
    } else if (type) {
      this.weeklyReports = this.default_weekly_reports.filter(
        (x) => x["year"] == week.year && x["week"] == week.week
      );
      week = this.weeklyReports.find((res) => res.id == week.id);

      this.selectedReport = this.weeklyReports.findIndex(
        (x) => x.id == week.id
      );

      this.projectsService
        .getAllMomentsForWeeklyReportWithoutManual(week.id, this.project.id)
        .then((res) => {
          if (res["status"]) {
            this.additionalWorkMoments = res["data"];
          }
        });
    } else {
      this.selectedReport = index;
      this.projectsService
        .getAllMomentsForWeeklyReportWithoutManual(this.weeklyReports[index].id, this.project.id)
        .then((res) => {
          if (res["status"]) {
            this.additionalWorkMoments = res["data"];
          }
        });
    }

    this.selectedWeeklyReportById = this.weeklyReports[this.selectedReport].id;
    this.createForm
      .get("email_log_date")
      .patchValue(this.weeklyReports[this.selectedReport]["email_log_date"]);
    this.getSupplierInoviceForAta();

    if (type == "notInvoiced") {
      this.selectStartedValue = "V" + week.week + " " + week.year;
      this.selectStartedImage = this.setIcon(week);
      this.selectStartedValueInvoiced = "Invoiced";
    } else if (type == "Invoiced") {
      this.selectStartedValueInvoiced = "V" + week.week + " " + week.year;
      this.selectStartedValue = "Choose";
    }

    this.selectOpenInvoiced = false;
    this.selectOpen = false;
    this.allowManualAcepted = true;

    while (this.articlesAdditionalWork.length !== 0) {
      this.articlesAdditionalWork.removeAt(0);
    }
    while (this.articlesMaterial.length !== 0) {
      this.articlesMaterial.removeAt(0);
    }
    while (this.articlesOther.length !== 0) {
      this.articlesOther.removeAt(0);
    }

    this.getAllDUArticles();

    if (
      (this.weeklyReports.length > 0 &&
        this.selectedReport != null &&
        this.selectedReport != -1 &&
        this.weeklyReports[this.selectedReport].Status == 0) ||
      (this.weeklyReports.length > 0 &&
        this.selectedReport != null &&
        this.selectedReport != -1 &&
        this.weeklyReports[this.selectedReport].Status == 1)
    ) {
    /*  this.ataService.updateWeeklyReportPdf(
        this.weeklyReports[this.selectedReport].id,
        null,
        this.sendCopy
      );*/
    }

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
    };

    if (
      this.weeklyReports &&
      this.weeklyReports[this.selectedReport].WeeklyReportDueDate
    ) {
      datepickerOptions.defaultDate = new Date(
        this.weeklyReports[this.selectedReport].WeeklyReportDueDate.split(
          " "
        )[0]
      );
    }

    $("#weeklyReportDueDate").datepicker("destroy");
    $("#weeklyReportDueDate")
      .datepicker(datepickerOptions)
      .on("changeDate", (ev) => {
        this.weeklyReports[this.selectedReport].WeeklyReportDueDate =
          ev.target.value;
      })
      .on("blur", (e) => {
        e.target.value =
          this.weeklyReports[this.selectedReport].WeeklyReportDueDate;
      });

    this.projectsService
      .get_last_email_log_but_first_client(
        "weekly_report",
        this.weeklyReports[this.selectedReport].id
      )
      .then((res) => {
        if (res["status"]) {
          this.get_last_email_log_but_first_client_wr = res["data"];
          this.weeklyReports[this.selectedReport].from_user =
            res["data"]["from_user"];
        }
      });

    this.projectsService
      .getSupplierInovicesForWeeklyReport(
        this.weeklyReports[this.selectedReport].id
      )
      .then((res) => {
        if (res) {
          this.whichPdfPreview = "invoice";
          this.showPdfInvoice = true;
          this.pdfs_preview = res['data'];
        }
      });


  }

  getDebitForm() {

    this.projectsService
      .getDebitFormForAta(this.atas[this.selectedAta].PaymentType, false, this.project.debit_Id)
      .then((res) => {
        this.getDebitForms = res["data"];
      });
  }

  additionalWorkValidation() {
    let invalid = [];

    this.articlesAdditionalWork.controls.forEach((article: any, index) => {
      if (
        article.controls.Name.value !== "" &&
        Number(
          article.controls.Price.value
            .toString()
            .replace(/\s/g, "")
            .replace(",", ".")
        ) === 0
      ) {
        invalid.push(index);
      }
    });
    return invalid;
  }

  articleMaterialValidation() {
    let invalid = [];
    this.articlesMaterial.controls.forEach((article: any, index) => {
      if (
        article.controls.Name.value !== "" &&
        Number(
          article.controls.Price.value
            .toString()
            .replace(/\s/g, "")
            .replace(",", ".")
        ) === 0
      ) {
        invalid.push(index);
      }
    });
    return invalid;
  }

  articleOtherValidation() {
    let invalid = [];
    this.articlesOther.controls.forEach((article: any, index) => {
      if (
        article.controls.Name.value !== "" &&
        Number(
          article.controls.Price.value
            .toString()
            .replace(/\s/g, "")
            .replace(",", ".")
        ) === 0
      ) {
        invalid.push(index);
      }
    });
    return invalid;
  }

  handlePriceZero(handleFunction, data) {


    let valid = true;
    const articleAdditionalWork = this.additionalWorkValidation();
    const articleMaterial = this.articleMaterialValidation();
    const articleOther = this.articleOtherValidation();

    if (
      articleAdditionalWork.concat(articleMaterial).concat(articleOther)
        .length === 0
    ) {
      this[handleFunction](data);
      return;
    }

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.data = {
      questionText: this.translate.instant("Some prices are zero, proceed?"),
    };
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          this[handleFunction](data);
        } else {
          this.showWorkControlError(articleAdditionalWork);
          this.showMaterialControlError(articleMaterial);
          this.showOtherControlError(articleOther);
        }
      });

    return valid;
  }

  showWorkControlError(articles) {
    articles.forEach((articleIndex) => {
      const formGroup: any = this.articlesAdditionalWork.controls[articleIndex];
      formGroup.controls.Price.setErrors({ incorrect: true });
    });
  }

  showMaterialControlError(articles) {
    articles.forEach((articleIndex) => {
      const formGroup: any = this.articlesMaterial.controls[articleIndex];
      formGroup.controls.Price.setErrors({ incorrect: true });
    });
  }

  showOtherControlError(articles) {
    articles.forEach((articleIndex) => {
      const formGroup: any = this.articlesOther.controls[articleIndex];
      formGroup.controls.Price.setErrors({ incorrect: true });
    });
  }

  sendMail(ata) {

    this.sendCopy =
      this.atas[this.selectedAta].Status == 2 ||
      this.atas[this.selectedAta].Status == 3
        ? true
        : false;

    if (this.contacts.length < 1) {
      return this.toastr.info(
        this.translate.instant(
          "You first need to select an email where to send ata"
        ) + ".",
        this.translate.instant("Info")
      );
    }

    if (
      !this.sendCopy &&
      this.contacts.length >= 1 &&
      !this.contacts.some(
        (contact) => contact.Id == this.project["selectedMainContact"]
      )
    ) {
      return this.toastr.info(
        this.translate.instant("TSC_main_contact_email_has_to_be_selected"),
        this.translate.instant("Info")
      );
    }

    let emails = "";

    this.client_workers.forEach((cw, index) => {
      let seperator = false;

      for (let i = 0; i < this.contacts.length; i++) {
        const contact = this.contacts[i];
        if (contact.Id == cw.Id) {
          emails = emails + (cw.email ? cw.email : cw.Name);
          seperator = true;
          break;
        }
      }

      if (seperator) {
        emails =
          emails + (index === this.client_workers.length - 1 ? "" : ", ");
      }
    });

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.data = {
      questionText:
        this.translate.instant("Are you sure you want to send email to: ") +
        emails +
        " ?",
    };
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          ata.Status = this.createForm.get("Status").value;
          ata.ProjectCustomName = this.project.CustomName;

          this.updateAta(true, false, true, 0, true, false, false, true).then(
            (res) => {
              if (res["status"]) {
                (ata.timesReminderSent = this.reminderCheckbox
                  ? +ata.timesReminderSent++
                  : ata.timesReminderSent),
                  this.reminderCheckbox
                    ? (ata.sendReminder = true)
                    : (ata.sendReminder = false);
                ata.PDFUrl = res["data"].pdf_link;
                ata.pdf_images_link = res["data"].pdf_images_link;
                ata.sendCopy = this.sendCopy;
                ata.projectName = this.project.name;
                this.sendingMail = true;
                ata.type_name = this.type;

                this.ataService
                  .sendAtaToClient(ata, { contacts: this.contacts })
                  .subscribe((res) => {
                    if (res["status"]) {


                    this.ataService
                          .getAtaAndSubatas(this.ataId)
                          .then((res) => {

                        if (res["status"]) {
                          this.atas = res["data"];
                          this.getProjectUserDetails();
                          this.sendingMail = false;
                          if (this.showingAtaOrDU === "du") {
                            this.weeklyReports[this.selectedReport].status = "1";
                          }
                          this.atas[this.selectedAta].EmailSent = "1";
                          this.atas[this.selectedAta].timesEmailSent++;
                          if (
                            this.atas[this.selectedAta].Status != 2 &&
                            this.atas[this.selectedAta].Status != 3
                          ) {
                            this.atas[this.selectedAta].Status = 4;
                          }

                          if (this.createForm.get("Status").value == 0) {
                            this.createForm.get("Status").patchValue(4);
                          }

                          this.getEmailLogsForAta();

                          $(
                            ".form-inputs input:not(#send-ks-copy-checkbox, #document, #send-copy-checkbox, #reminder-checkbox, #image, .toggle-delete-input), .form-inputs select:not(#ata-status), .form-inputs textarea"
                          ).prop("disabled", true);
                        }
                    });
                    }


                    this.toastr.success(
                      this.translate.instant(
                        "You have successfully sent email!"
                      ),
                      this.translate.instant("Success")
                    );

                  });
              }
            }
          );
        }
      });
  }

  previewWeeklyReportPdf(pdfPath) {
    this.weeklyReportPdfPreview =
      this.sanitizer.bypassSecurityTrustResourceUrl(pdfPath);
  }

  toggleTable(table) {
    this[table] = !this[table];
  }

  toggleSupplierInvoiceModal(openFacture = null) {
    this.showSupplierInvoiceModal = !this.showSupplierInvoiceModal;

    if (openFacture) {
      if (this.newSupplierInvoices.length > 0) {
        this.ataService
          .updateSupplierInvoicesIsNewField(this.newSupplierInvoices)
          .subscribe((res) => {
            if (res["status"]) this.newSupplierInvoices = [];
          });
      }
    }
  }

  supplierInvoiceChecked(value, index) {

    this.supplierInvoices[index].isChecked = value;
    const invoice = this.supplierInvoices[index];

    if (value) {
      this.articlesMaterial.insert(
        0,
        this.fb.group({
          id: "",
          Name: invoice.SupplierName,
          Quantity: 1,
          Unit: "pieces",
          Price: invoice.Price,
          Deduct:
            invoice.Deduct == 0
              ? this.project["ataChargeMaterial"]
              : invoice.Deduct,
          Total:
            invoice.Deduct == 0
              ? (this.project["ataChargeMaterial"] / 100 + 1) * invoice.Total
              : invoice.Total,
          Account:
            invoice.Type == "SupplierInvoice" ||
            invoice.Type == "SupplierInvoiceRow"
              ? invoice.Account
              : "",
          OrderNR: invoice.OrderNR,
          importedFromFortnox: true,
          Type: invoice.Type,
          SupplierInvoiceId: invoice.id,
          Number:
            invoice.Type == "SupplierInvoice" ||
            invoice.Type == "SupplierInvoiceRow"
              ? invoice.Account
              : "",
            pdf_images: invoice.image_path,
            pdf_doc: invoice.pdf_link
        })
      );


    } else {
      const i = this.articlesMaterial.controls.findIndex(
        (invo) => invoice.OrderNR == invo.get("OrderNR").value
      );
      this.articlesMaterial.controls.splice(i, 1);
      this.articlesMaterial.value.splice(i, 1);
    }
  }

  filterSupplierInvoiceNumber() {
    return this.supplierInvoices.filter((invoice) =>
      this.articlesMaterial.controls.every(
        (article) => article.value.OrderNR != invoice.OrderNR
      )
    );
  }

  checkAll($event) {
    let checkboxes = document.getElementsByClassName(
      `supplier-invoice-checkbox`
    );
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

    sendWeeklyReport(data) {

        this.sendCopy =
            this.weeklyReports[this.selectedReport].status != 0 &&
            this.weeklyReports[this.selectedReport].status != 1
            ? true
            : false;

        if (this.contacts.length < 1) {
          return this.toastr.info(
            this.translate.instant(
              "You first need to select an email where to send weekly report" + "."
            ),
            this.translate.instant("Info")
          );
        }

        if (
          !this.weeklyReports[this.selectedReport].WeeklyReportDueDate &&
          this.weeklyReports[this.selectedReport].status != 2
        ) {
          return this.toastr.info(
            this.translate.instant("Due date is required to send weekly report."),
            this.translate.instant("Info")
          );
        }

        if (
          !this.sendCopy &&
          this.contacts.length >= 1 &&
          !this.contacts.some(
            (contact) => contact.Id == this.project["selectedMainContact"]
          )
        ) {
          return this.toastr.info(
            this.translate.instant("TSC_main_contact_email_has_to_be_selected"),
            this.translate.instant("Info")
          );
        }

        let emails = "";

        this.client_workers.forEach((cw, index) => {
            let seperator = false;

            for (let i = 0; i < this.contacts.length; i++) {
                const contact = this.contacts[i];
                if (contact.Id == cw.Id) {
                    emails = emails + (cw.email ? cw.email : cw.Name);
                    seperator = true;
                    break;
                }
            }

            if (seperator) {
                emails = emails + (index === this.client_workers.length - 1 ? "" : ", ");
            }
        });

        let dataWeeklyReportId = this.weeklyReports[this.selectedReport].id;
        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = false;
        diaolgConfig.disableClose = true;
        diaolgConfig.width = "";
        diaolgConfig.data = {
          questionText:
            this.translate.instant("Are you sure you want to send email to:") +
            " " +
            emails +
            " ?",
        };
        diaolgConfig.panelClass = "mat-dialog-confirmation";
        this.dialog
          .open(ConfirmationModalComponent, diaolgConfig)
          .afterClosed()
          .subscribe((response) => {
            if (response.result) {
              if (
                this.weeklyReports[this.selectedReport].status == 0 ||
                this.weeklyReports[this.selectedReport].status == 1
              ) {
                this.createForm.value.timesReminderSentDU = 1;

                this.updateAta(true, false, true, 0, true, false, false, true, false, false).then(
                  (res) => {
                    this.spinner = true;

                    if (res["status"]) {
                      this.send_wr(dataWeeklyReportId);
                    }
                  }
                );
              } else {
                this.updateAta(true, false, true, 0, true, false, false, true, false, false).then(
                  (res) => {
                    this.spinner = true;

                    if (res["status"]) {
                      this.send_wr(dataWeeklyReportId, false);
                    }
                  }
                );
              }
            }
        });
    }

  send_wr(dataWeeklyReportId, not_accepted = true) {
    let dataWeeklyReport = this.default_weekly_reports.find(
      (wr) => wr.id === dataWeeklyReportId
    );

    let dataObj = {
      ...dataWeeklyReport,
      clientName: this.project.clientName,
      street: this.atas[this.selectedAta].street,
      city: this.atas[this.selectedAta].city,
      zip: this.atas[this.selectedAta].zip,
      ProjectName: this.project.name,
      sendReminderDU: this.reminderCheckboxDU ? true : false,
      sendCopy: this.sendCopy,
      pdf_url: this.weeklyReports[this.selectedReport].pdf_url,
    };

    if (not_accepted) {
      dataObj.tables.aaw.forEach((table, i) => {
        table.Total = this.updateTotal(i, this.articlesAdditionalWork, true);
      });
    }


    this.ataService
      .sendWeeklyReport(this.contacts, dataObj)
      .subscribe((res2) => {
        if (res2["status"]) {
          if (dataWeeklyReport.status == 0) {
            dataWeeklyReport.status = 1;
            this.weeklyReports[this.selectedReport].status = 1;
          }
          this.spinner = false;
          this.allowDeleteDuRow = false;
          $(
            ".form-inputs input:not(#send-ks-copy-checkbox, #document, #send-copy-checkbox, #reminder-checkbox, .toggle-delete-input), .form-inputs select:not(#ata-status), .form-inputs textarea"
          ).prop("disabled", true);
          this.toastr.success(
            this.translate.instant("Successfully sent weekly report."),
            this.translate.instant("Success")
          );
          dataWeeklyReport.timesEmailSent++;
          this.getEmailLogsForAta();
        } else if (!res2["status"] && res2["message"]) {
          this.toastr.error(
            this.translate.instant(res2["message"]),
            this.translate.instant("Error")
          );
          this.spinner = false;
          this.showWrImages = true;
          $(".documents-wrapper").addClass("documents-warrning");
        }
      });
  }

  printAta() {
    this.updateAta(false, false, true, 0, true, false, false, false, true).then(
      (res) => {
        printJS(this.atas[this.selectedAta].PDFUrl);
      }
    );
  }

  printWeeklyReport() {
    let selectedReport = this.selectedReport;
    this.updateAta(false, false, true, 0, true, false, false, false, true).then((res) => {
      printJS(this.weeklyReports[selectedReport].pdf_url);
    });
  }

  toggleAttachmentImage(e = null) {
    if (e) {
      if (e.target.id !== "looksLikeModal") {
        return;
      }
    }
    this.showAttachmentImage = !this.showAttachmentImage;
  }

  weeklyReportHasAnyTotals() {
    if (this.weeklyReports[this.selectedReport]) {
      return (
        this.articlesAdditionalWork.controls.length > 0 ||
        this.articlesMaterial.controls.length > 0 ||
        this.articlesOther.controls.length > 0
      );
    } else {
      return false;
    }
  }

  allowRemoveEmptyWeeklyReport() {
    if (
      this.weeklyReports[this.selectedReport] &&
      this.weeklyReports[this.selectedReport].tables &&
      this.weeklyReports[this.selectedReport].tables.aaw.length == 0 &&
      this.weeklyReports[this.selectedReport].tables.am.length == 0 &&
      this.weeklyReports[this.selectedReport].tables.ao.length == 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  get getPreviousAta() {
    if (this.atas.length > 0) {
      return this.atas[this.selectedAta - 1];
    }
  }

  getAtas() {
    this.ataService.getAtaAndSubatas(this.ataId).then((res) => {

      if (res["status"]) {
        this.atas = res["data"];
        this.getProjectUserDetails();
        if (this.atasNumbers !== this.atas.length) {
          window.location.reload();
        }
      }
    });
  }

  getAtasAfterRevision() {
    this.spinner = true;
    this.ataService.getAtaAndSubatas(this.ataId).then((res) => {

      if (res["status"]) {
        this.atas = res["data"];
        this.changeSelectedAta(this.atas.length - 1, null);

        this.getProjectUserDetails();
      }
      this.spinner = false;
    });
  }

  localUrl: any[];

  onFileChange(event) {
    this.chooseFile = true;
    this.uploadMessage = "";
    if (event.target.files && event.target.files.length) {
      Array.from(event.target.files).forEach((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file as Blob);
        this.uploadMessage += (file as any).name + ", ";
        reader.onload = () => {
          this.files.push({
            Url: reader.result,
            file: reader.result,
            Name: (file as any).name,
            created: true,
          });

          if (this.files.length > 0) {
            this.allowUpdateAtaStatus = true;
          }
        };
      });
    } else {
      this.chooseFile = false;
    }
    this.uploadMessage = this.uploadMessage.slice(0, -2);
  }

  removeNewAttachment(index, type) {
    this[type].splice(index, 1);
  }

  rotateRight() {
    this.rotateValue = this.rotateValue + 90;
    let d = document.getElementsByClassName(
      "iv-large-image"
    )[0] as unknown as HTMLElement;
    d.style.transform = "rotate(" + this.rotateValue + "deg)";
    let x = document.getElementsByClassName(
      "iv-snap-image"
    )[0] as unknown as HTMLElement;
    x.style.transform = "rotate(" + this.rotateValue + "deg)";
    let c = document.getElementsByClassName(
      "iv-snap-handle"
    )[0] as unknown as HTMLElement;
    c.style.transform = "rotate(" + this.rotateValue + "deg)";
  }

  rotateLeft() {
    this.rotateValue = this.rotateValue - 90;
    let d = document.getElementsByClassName(
      "iv-large-image"
    )[0] as unknown as HTMLElement;
    d.style.transform = "rotate(" + this.rotateValue + "deg)";
    let x = document.getElementsByClassName(
      "iv-snap-image"
    )[0] as unknown as HTMLElement;
    x.style.transform = "rotate(" + this.rotateValue + "deg)";
    let c = document.getElementsByClassName(
      "iv-snap-handle"
    )[0] as unknown as HTMLElement;
    c.style.transform = "rotate(" + this.rotateValue + "deg)";
  }

  filterArticles(articles) {
    return articles.filter((article) => article.Name !== "");
  }

  getUserPermission() {
    this.usersService.getUserPermission("Ata", this.ataId).subscribe((res) => {
      if (res["status"]) {
        if (
          this.atas[this.selectedAta].BecomeExternalAtaFromInternal == "1" &&
          this.type == "internal"
        )
          this.editAta = false;
        else if (
          this.atas[this.selectedAta].Status == "0" ||
          this.atas[this.selectedAta].Status == "1" ||
          this.atas[this.selectedAta].Status == "2" ||
          this.atas[this.selectedAta].Status == "7" ||
          this.atas[this.selectedAta].Status == "5"
        )
          this.editAta = res["data"]["edit"];

        if (
          this.atas.length > 1 &&
          this.atas[this.selectedAta].ATAID == this.atas[0].ATAID
        ) {
          this.editAta = false;
        }

        this.disabledInput = !this.editAta;
        this.fullName = res["data"]["fullName"];

        if (this.editAta) {
          this.counter = 0;
          if (
            this.atas[this.selectedAta].Status == "0" ||
            this.atas[this.selectedAta].Status == "1"
          ) {
            $(".select-property").removeAttr("disabled");
            $(
              ".form-inputs input, .toogle-enable, .form-inputs textarea"
            ).removeAttr("disabled");
          }
        } else if (this.atas[this.selectedAta].Status == "5") {
          $(".select-property").prop("disabled", true);
          $(
            ".form-inputs input:not(#send-ks-copy-checkbox, #document, #send-copy-checkbox, #reminder-checkbox, .toggle-delete-input), .toogle-enable, .form-inputs textarea"
          ).prop("disabled", true);
          this.editAta = false;
          this.fullName = "";
        } else if (this.atas[this.selectedAta].Status == "2") {
          $(".toogle-enable").prop("disabled", true);
          $(
            ".form-inputs input:not(#send-ks-copy-checkbox, #document, #send-copy-checkbox, #reminder-checkbox, .toggle-delete-input), .toogle-enable, .form-inputs textarea"
          ).prop("disabled", true);
        } else if (this.atas[this.selectedAta].Status == "4") {
          $(".toogle-enable").prop("disabled", true);
          $(
            ".form-inputs input:not(#send-ks-copy-checkbox, #document, #send-copy-checkbox, #reminder-checkbox, #image, .toggle-delete-input), .toogle-enable, .form-inputs textarea"
          ).prop("disabled", true);
          this.fullName = "";
        }
      }
    });
  }

  enableUpdate() {
    if (this.atas[this.selectedAta].AtaTable != "ata_become_external") {
      this.counter++;
      this.usersService.enableUpdate("Ata", this.ataId, this.counter);

      let obj = {
        ataId: this.ataId,
        url: this.router.url,
        type: "Ata",
      };

      this.cronService.setObject(obj);
      const type = this.createForm.get("paymentType").value;
      this.setAtaTypes(type);
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
          this.projectsService
            .deleteWeeklyReport(this.weeklyReports[this.selectedReport].id, this.project.id)
            .then((res) => {
              if (res["status"]) {
                this.changeSelectedAta(this.atas.length - 1, null);
                this.newWRDisabled = false;
              }
            });
        }
      });
  }

  get getArticleAdditionalWork() {
    return this.articlesAdditionalWork.value.filter(
      (article) => article.Name != ""
    );
  }

  get getArticleMaterial() {
    return this.articlesMaterial.value.filter((article) => article.Name != "");
  }

  get getArticleOther() {
    return this.articlesOther.value.filter((article) => article.Name != "");
  }

  calcAllTotal(data) {
    let total = 0;
    data.forEach((data2) => {
      if (data2.length > 0) {
        data2.forEach((data3) => {
          let amount = data3.Total != "" ? data3.Total : 0;

          total += parseFloat(amount);
        });
      }
    });
    this.totalSum = total.toFixed(2);

    return this.totalSum;
  }

  makeExternalAta() {

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
          this.atas[this.selectedAta]["WeeklyReports"] = this.weeklyReports;
          this.atas[this.selectedAta]["enabledAccounts"] = this.enabledAccounts;
          this.atas[this.selectedAta]["DefaultWeeklyReports"] =
            this.default_weekly_reports;

          this.ataService
            .makeAtaExternal(this.atas[this.selectedAta])
            .subscribe((res) => {
              if (res["status"]) {
                this.atas[this.selectedAta].external = 1;
                this.atas[this.selectedAta].EmailSent = 1;

                this.ataService.refreshAdministrationUserAndAta(
                  this.atas[this.selectedAta]["ATAID"],
                  this.project.id
                );
                this.toastr.success(
                  this.translate.instant(
                    "Successfully transferred to External ATA."
                  ),
                  this.translate.instant("Success")
                );
                this.router.navigate(['/projects/view/ata/edit/', this.atas[this.selectedAta].ATAID], { queryParams: { type: 'external', projectId: this.atas[this.selectedAta].ProjectID } }).then(() => {
                    window.location.reload();
                });
            } else {
                this.toastr.warning(
                  this.translate.instant(
                    "Not able to transfer ATA to External."
                  ),
                  this.translate.instant("Error")
                );
              }
            });
        }
      });
  }

  toggleselectOpen() {
    this.selectOpen = !this.selectOpen;
    if (this.selectOpen) this.selectOpenInvoiced = false;
  }

  toggleselectOpenInvoiced() {
    this.selectOpenInvoiced = !this.selectOpenInvoiced;
    if (this.selectOpenInvoiced) this.selectOpen = false;
  }

  setIcon(week) {
    let icon = "";
    if (week.status == 1) icon = "assets/img/send.png";
    else if (week.status == 2 || week.status == 4)
      icon = "assets/img/approve.png";
    else if (week.status == 5) icon = "assets/img/invoced.png";

    return icon;
  }

  getWeeklyReportsByAtaId(reloadAta = null) {

    if (reloadAta) {
      this.spinner = true;
      this.ataService.getAtaAndSubatas(this.ataId).then((res) => {

        if (res["status"]) {
          this.ataService
            .getNotSendWeeklyReportsByAtaId(this.atas[this.selectedAta].ATAID, null, this.project.id)
            .then((res) => {
              this.weeklyReports = res["data"];
              this.selectedReport = this.weeklyReports.length - 1;
              this.selectOpenInvoiced = false;
              this.selectOpen = false;

              if (
                this.weeklyReports.length > 0 &&
                this.selectedReport != -1 &&
                this.selectedReport != null
              ) {
                let week = {
                  week: this.weeklyReports[this.selectedReport].week,
                };
                this.changeSelectedReport(this.selectedReport, week);
              } else {
                this.allowManualAcepted = false;
              }
              this.spinner = false;
            });
        }
      });
    } else {
      this.ataService
        .getNotSendWeeklyReportsByAtaId(this.atas[this.selectedAta].ATAID, null, this.project.id)
        .then((res) => {
          this.weeklyReports = res["data"];
          this.selectedReport = this.weeklyReports.length - 1;
          this.selectOpenInvoiced = false;
          this.selectOpen = false;

          if (
            this.weeklyReports.length > 0 &&
            this.selectedReport != -1 &&
            this.selectedReport != null
          ) {
            let week = {
              week: this.weeklyReports[this.selectedReport].week,
            };
            this.changeSelectedReport(this.selectedReport, week);
          }
          this.spinner = false;
        });
    }
  }

  setButtonIcon(report) {
    let icon = "";
    if (report.status == 1) icon = "assets/img/whitesend.png";
    else if (report.status == 2) icon = "assets/img/whotetick.png";
    else if (report.status == 5) icon = "assets/img/$.png";
    else if (report.status == 3 || report.status == 4)
      icon = "assets/img/alert.png";

    return icon;
  }

  isInputDisabled(isDuShowing = false, is_manual_added = false) {
    if (this.weeklyReports[this.selectedReport]) {
      if (!(this.weeklyReports[this.selectedReport].status != 0)) {
        if (is_manual_added) {
          return null;
        }

        return isDuShowing ? true : null;
      }
      return true;
    } else {
      return this.atas[this.selectedAta].Status != 0 ? true : null;
    }
  }

  checkIfAccepted(status) {
    if (status && status === "accepted") return true;
    else return null;
  }

  ensureDisabeIfNorRegularStatus(article) {
    if (
      article &&
      article.value &&
      article.value.id != "" &&
      article.value.ClientStatus == 1
    )
      return true;
    else return null;
  }

  isRemoveDisabled() {
    let status = true;
    if (this.weeklyReports[this.selectedReport]) {
      if (
        this.weeklyReports[this.selectedReport].status == 0 ||
        this.weeklyReports[this.selectedReport].status == 3 ||
        this.weeklyReports[this.selectedReport].status == 1
      )
        status = true;
      else status = false;
    }
    return status;
  }

  allowSendWeeklyReport() {
    let status = true;
    if (this.weeklyReports[this.selectedReport]) {
      if (this.weeklyReports[this.selectedReport].status != 4)
        status =
          this.weeklyReports[this.selectedReport].tables.aaw.length > 0 ||
          this.weeklyReports[this.selectedReport].tables.am.length > 0 ||
          this.weeklyReports[this.selectedReport].tables.ao.length > 0
            ? true
            : false;
      else status = false;
    }
    return status;
  }

  jQueryDisableInput(bool) {
    $(`input`).prop("disabled", bool);
  }

  acceptWeeklyReport() {
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
          const weeklyReport = this.weeklyReports[this.selectedReport];
          this.spinner = true;
          this.show_elements = false;
          this.jQueryDisableInput(true);

          this.updateAta(true, false, true, 0, true, false)
            .then((res) => {
              this.spinner = true;
              this.projectsService
                .approveWeeklyReportAsAdmin(weeklyReport.id)
                .then((response) => {
                  if (response["status"]) {
                    this.toastr.success(
                      this.translate.instant(
                        "You successfully accepted Weekly Report."
                      ),
                      this.translate.instant("Success")
                    );

                    if (this.weeklyReports.length > 0) {
                      this.weeklyReports[this.selectedReport].status = 2;
                    }
                    if (this.default_weekly_reports.length > 0) {
                      this.default_weekly_reports[
                        this.selectedReport
                      ].status = 2;
                    }

                    this.weeklyReports[this.selectedReport].Status = 2;
                    this.spinner = false;
                    this.show_elements = true;
                    this.allowManualAcepted = false;
                    this.getWeeks();
                  } else {
                    this.spinner = false;
                    this.show_elements = true;
                    this.toastr.warning(
                      this.translate.instant(
                        "Not able to accept Weekly Report."
                      ),
                      this.translate.instant("Error")
                    );
                    this.jQueryDisableInput(false);
                  }
                });
            })
            .catch((err) => {
              this.spinner = false;
              this.show_elements = true;
              this.toastr.warning(
                this.translate.instant("Not able to accept Weekly Report."),
                this.translate.instant("Error")
              );
              this.jQueryDisableInput(false);
            });
        }
      });
  }

  getWeeks() {
    this.projectsService
      .getWeeksThatHaveWeekyReportForAta(this.atas[this.selectedAta].ATAID)
      .then((result) => {

        if (this.type == "external") {
          this.weeks = result["data"];
        } else {
          this.weeks = result["data"].filter((res) => res["external"] == "0");
        }
        this.checkWr();
      });
  }

  declineWeeklyReport() {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.data = {
      questionText:
        this.translate.instant(
          "Are you sure you want to decline weekly report: "
        ) + ` ${this.weeklyReports[this.selectedReport].name}`,
    };
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {

        if (response.result) {
          this.show_elements = false;
          const weeklyReport = this.weeklyReports[this.selectedReport];
          this.spinner = true;

          this.jQueryDisableInput(true);

          this.updateAta(true, false, true, 0, true, false, true)
            .then((res) => {
              this.spinner = true;
              this.projectsService
                .declineWeeklyReportAsAdmin(weeklyReport.id)
                .then((response) => {

                  if (response["status"]) {
                    this.toastr.success(
                      this.translate.instant(
                        "You successfully declined Weekly Report."
                      ),
                      this.translate.instant("Success")
                    );

                    if (this.weeklyReports.length > 0) {
                      this.weeklyReports[this.selectedReport].status = 3;
                    }
                    if (this.default_weekly_reports.length > 0) {
                      this.default_weekly_reports[
                        this.selectedReport
                      ].status = 3;
                    }
                    this.getNotSendWeeklyReport(true, true, true);
                    this.allowManualAcepted = false;
                  } else {
                    this.spinner = false;
                    this.show_elements = true;
                    this.toastr.warning(
                      this.translate.instant(
                        "Not able to decline Weekly Report."
                      ),
                      this.translate.instant("Error")
                    );
                    this.jQueryDisableInput(false);
                  }
                });
            })
            .catch((err) => {
              this.spinner = false;
              this.toastr.warning(
                this.translate.instant("Not able to decline Weekly Report."),
                this.translate.instant("Error")
              );
              this.jQueryDisableInput(false);
            });
        }
      });
  }

  refreshAtas() {
    if (this.type && this.type == "external") {
      const atas = this.route.snapshot.data["atas"]["data"];
      if (atas.length === 0) {
        this.router.navigate(["/"]);
        return false;
      }

      this.atas = atas;
    } else {
      const atas = this.route.snapshot.data["internalAtas"]["data"];

      if (atas.length === 0) {
        this.router.navigate(["/"]);
        return false;
      }

      this.atas = atas;
      if (this.atas[this.selectedAta].external == "1") this.atas.splice(1);

      if (this.atas[this.selectedAta].WeeklyReports)
        this.weeklyReports = this.atas[this.selectedAta].WeeklyReports;

      if (this.atas[this.selectedAta].Attachment)
        this.atas[this.selectedAta]["Documents"] =
          this.atas[this.selectedAta].Attachment;

      if (this.atas[this.selectedAta].DefaultWeeklyReports)
        this.default_weekly_reports =
          this.atas[this.selectedAta].DefaultWeeklyReports;

      if (this.atas[this.selectedAta].articlesAdditionalWorkFromABE)
        this.atas[this.selectedAta].articlesAdditionalWork =
          this.atas[this.selectedAta].articlesAdditionalWorkFromABE;

      if (this.atas[this.selectedAta].articlesMaterialFromABE)
        this.atas[this.selectedAta].articlesMaterial =
          this.atas[this.selectedAta].articlesMaterialFromABE;

      if (this.atas[this.selectedAta].articlesOtherFromABE)
        this.atas[this.selectedAta].articlesOther =
          this.atas[this.selectedAta].articlesOtherFromABE;
    }

    this.getProjectUserDetails();
    if (this.default_weekly_reports) {
      this.weeklyReportsInvoiced = this.default_weekly_reports.filter(
        (res) => res["status"] == 5 || res["status"] == 3
      );
      this.weeklyReportsNotInvoiced = this.default_weekly_reports.filter(
        (res) => res["status"] != 5 && res["status"] != 3
      );
    }
    this.setColorBasedOnStatus();
    setTimeout(()=>{
      if (!this.type) {
        this.type = this.atas[this.selectedAta].Type == 1 ? 'external' : 'internal';
      }
    }, 100);

    return true;
  }

  manuallyAcceptAta() {
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
          this.spinner = true;
          this.ataService
            .manuallyAcceptAta(this.atas[this.selectedAta].ATAID)
            .subscribe((res) => {
              if (res["status"]) {
                this.toastr.success(
                  this.translate.instant("Successfully accepted ata!"),
                  this.translate.instant("Success")
                );
                this.ataService
                  .getAtaAndSubatas(this.ataId)
                  .then((res) => {

                    if (res["status"]) {
                      this.atas = res["data"];
                      this.getProjectUserDetails();
                      if (this.atasNumbers !== this.atas.length) {
                        window.location.reload();
                      }
                      this.changeSelectedAta(this.selectedAta, null, true);
                    }
                  });
              } else {
                this.toastr.error(
                  this.translate.instant(
                    "There was an error while accepting ata!"
                  ),
                  this.translate.instant("Error")
                );
              }

              this.spinner = false;
            });
        }
      });
  }

  manuallyRejectAta() {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    const data = {
      CwId: null,
      ataID: this.atas[this.selectedAta].ATAID,
      description: "Manual revision.",
      email: this.userDetails.email,
      file: {},
      group: "",
      question: "Manual revision.",
      status: 0,
      token: "",
      reminder: 0,
      isMainContact: false,
    };
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          this.spinner = true;
          this.ataService
            .manuallyRejectAta(this.atas[this.selectedAta].ATAID, this.project.id)
            .subscribe((res) => {
              if (res["status"]) {
                this.toastr.success(
                  this.translate.instant("Successfully rejected ata!"),
                  this.translate.instant("Success")
                );
                this.ataService.manuallyCreateRevision(data).subscribe((res) => {
                  if (res["status"]) {
                    this.atas[this.selectedAta].Status = 0;
                    this.createForm.get("Status").patchValue(0);
                    this.getAtasAfterRevision();
                    this.setColorBasedOnStatus();
                    this.spinner = false;
                  }
                });
                this.atas[this.selectedAta].Status = 3;
                this.atas[this.selectedAta].Type = 1;
                this.setColorBasedOnStatus();
                this.createForm.get("Status").patchValue(3);
                this.allowUpdateAtaStatus = false;
              } else {
                this.toastr.error(
                  this.translate.instant(
                    "There was an error while rejecting ata!"
                  ),
                  this.translate.instant("Error")
                );
              }

              this.spinner = false;
            });
        }
      });
  }

  manuallyCreateRevision(event) {
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
            CwId: null,
            ataID: this.atas[this.selectedAta].ATAID,
            description: "Manual revision.",
            email: this.userDetails.email,
            file: {},
            group: "",
            question: "Manual revision.",
            status: 0,
            token: "",
            reminder: 0,
            isMainContact: false,
          };

          this.spinner = true;
          this.show_elements = false;

          this.ataService.manuallyCreateRevision(data).subscribe((res) => {
            if (res["status"]) {
              this.toastr.success(
                this.translate.instant("Successfully created ata revision!"),
                this.translate.instant("Success")
              );
              this.atas[this.selectedAta].Status = 0;
              this.createForm.get("Status").patchValue(0);
              this.getAtasAfterRevision();
              this.setColorBasedOnStatus();
            } else {
              this.toastr.error(
                this.translate.instant(
                  "There was an error while creating revision!"
                ),
                this.translate.instant("Error")
              );
            }
            this.show_elements = true;
            this.spinner = false;
          });
        }
      });
  }

  removeATA() {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.data = {
      questionText: this.translate.instant(
        "Are you sure you want to delete ata?"
      ),
    };
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          let ata = this.atas[0];
          let object = {
            id: ata.ATAID,
            Type: this.type == "external" ? 1 : 0,
            BecomeExternalAtaFromInternal: ata.BecomeExternalAtaFromInternal,
            oldAtaNumber: ata.AtaNumber,
            projectId: this.project.id,
            ParentAta: ata.ParentAta,
          };

          this.ataService.removeAtaUpdateIsDeleted(object).subscribe((res) => {
            if ((res["status"] = true))
              this.toastr.success(
                this.translate.instant("Successfully removed ATA!"),
                this.translate.instant("Success")
              );
            this.router.navigate(["projects", "view", this.project.id]);
          });
        }
      });
  }

  manuallyCreateWeeklyReport() {
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
          this.spinner = true;
          this.ataService
            .manuallyCreateWeeklyReport(
              this.project.id,
              this.atas[this.selectedAta].ATAID
            )
            .subscribe((res) => {
              if (res["status"]) {
                this.toastr.success(
                  this.translate.instant(
                    "Successfully created weekly report for current week."
                  ),
                  this.translate.instant("Success")
                );
                const wr = res["createdWeeklyReport"];
                wr.Status = "0";
                this.weeklyReports.push(wr);
                this.default_weekly_reports.push(wr);
                this.weeklyReportsInvoiced = this.default_weekly_reports.filter(
                  (res) => res["status"] == 5 || res["status"] == 3
                );
                this.weeklyReportsNotInvoiced =
                  this.default_weekly_reports.filter(
                    (res) => res["status"] != 5 && res["status"] != 3
                  );
                this.weeksNotInvoiced.push({
                  week: wr.week,
                  year: wr.year,
                  external: wr.External,
                  status: wr.status,
                  id: wr.id,
                });
                this.newWRDisabled = true;
              } else {
                this.toastr.error(
                  this.translate.instant(res["message"]),
                  this.translate.instant("Error")
                );
              }

              this.spinner = false;
            });
        }
      });
  }

  checkIfAtaCreatedFromDeviation() {
    if (this.atas[this.selectedAta].BecomeAtaFromDeviation == 1) {
      setTimeout(() => {
        $(
          ".form-inputs input, .toogle-enable, .form-inputs textarea"
        ).removeAttr("disabled");
      }, 100);
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
  // toggleAtaOverview() {
  //   this.showAtaOverview = !this.showAtaOverview;
  // }

  filterClientResponses(responses) {
    if (responses) {
      return responses.filter(
        (response) => response.client_message || response.attachment
      );
    } else {
      return [];
    }
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

  getProjectUserDetails() {
    this.projectsService
      .getProjectUserDetails(this.atas[0].ProjectID)
      .then((res) => {
        this.projectUserDetails = res;
      });
  }

  ensureAtaCreateOrEdit() {
    let status = this.userDetails.create_project_Ata;

    if (this.projectUserDetails) status = this.projectUserDetails.Ata;

    if (status == 0) {
      this.toastr.error(
        this.translate.instant("You don't have permission to view") +
          ": " +
          this.translate.instant("Ata"),
        this.translate.instant("Error")
      );
      this.router.navigate(["/projects"]);
    }
  }

  filterRichCostArticles(articles) {
    if (
      this.atas[this.selectedAta].PaymentType == 4 &&
      this.showingAtaOrDU == "ata"
    ) {
      return articles.filter(
        (article) => article.value.wrId == "0" || article.value.id == ""
      );
    } else {
      return articles;
    }
  }

  allowUpdateAta() {
    if (this.createForm.get("Status").value == "3") {
      this.manual_rejected_ata_from_select = true;
    } else {
      this.manual_rejected_ata_from_select = false;
    }

    if (
      (this.atas[this.selectedAta].Status !== "3" && this.disabledButton) ||
      (this.atas[this.selectedAta].Status !== "5" && this.disabledButton) ||
      (this.atas[this.selectedAta].Status !== "6" && this.disabledButton)
    )
      this.allowUpdateAtaStatus = true;
    else this.allowUpdateAtaStatus = false;
  }

  allowAddInvoiceOnWeeklyReportIfNotRevision() {
    let status = false;
    if (
      this.weeklyReports[this.selectedReport] &&
      this.weeklyReports[this.selectedReport].parent != null &&
      this.weeklyReports[this.selectedReport].parent == 0
    ) {
      status = true;
    }
    return status;
  }

  disabledIfRevisionDU(article) {
    let disabled = false;
    if (
      this.showingAtaOrDU == "du" &&
      !article.get("id").value &&
      this.weeklyReports.length > 0 &&
      this.selectedReport &&
      this.weeklyReports[this.selectedReport] &&
      this.weeklyReports[this.selectedReport].parent != 0
    ) {
      disabled = !article.get("is_manual_added").value;
    }
    return disabled;
  }

  getContentIdForInfoObject() {
    const content_id = this.weeklyReports[this.selectedReport].id;
    const type_id = this.atas[this.selectedAta].ATAID;
    return { content_id: content_id, type_id: type_id };
  }

  openModal() {
    let object = {
      content_type: "KS",
      content_id: this.weeklyReports[this.selectedReport].id,
      type: "Ata",
      images: this.weeklyReports[this.selectedReport].images,
      documents: this.weeklyReports[this.selectedReport].pdf_documents,
      type_id: this.atas[this.selectedAta].ATAID,
    };

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.data = { data: object };
    this.dialog
      .open(ImageModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.weeklyReports[this.selectedReport].images = res.files;
          this.weeklyReports[this.selectedReport].pdf_documents =
            res.pdf_documents;
          this.weeklyReports[this.selectedReport].removed_documents =
            res.removed_files;
        }
      });
  }

  removeImages(index, type = "Images") {
    if (!this.weeklyReports[this.selectedReport].removed_documents) {
      this.weeklyReports[this.selectedReport].removed_documents = [];
    }

    if (!this.weeklyReports[this.selectedReport].pdf_documents) {
      this.weeklyReports[this.selectedReport].pdf_documents = [];
    }

    if (type == "Images") {
      this.weeklyReports[this.selectedReport].removed_documents.push(
        this.weeklyReports[this.selectedReport].images[index].id
      );
      this.weeklyReports[this.selectedReport].images.splice(index, 1);
    } else {
      this.weeklyReports[this.selectedReport].removed_documents.push(
        this.weeklyReports[this.selectedReport].pdf_documents[index].id
      );
      this.weeklyReports[this.selectedReport].pdf_documents.splice(index, 1);
    }
  }

  toggleAttachmentKS(albumKey, index, type) {
    if (!this.weeklyReports[this.selectedReport].removed_documents) {
      this.weeklyReports[this.selectedReport].removed_documents = [];
    }

    const files =
      this.weeklyReports[this.selectedReport]["files"][albumKey][type];
    const file = files[index];
    const id = file.id;

    if (file.deleted) {
      this.weeklyReports[this.selectedReport].removed_documents =
        this.weeklyReports[this.selectedReport].removed_documents.filter(
          (_file) => {
            return id != _file.id;
          }
        );
    } else {
      this.weeklyReports[this.selectedReport].removed_documents.push(file);
    }

    file.deleted = !file.deleted;
  }

  onCheckboxChangeAvvikelseDeviation() {
    this.avvikelseDeviation = !this.avvikelseDeviation;
    this.atas[this.selectedAta].AvvikelseDeviation = this.avvikelseDeviation
      ? 1
      : 0;
    this.ataService.updateAtaAvvikelseDeviation({
      ATAID: this.atas[this.selectedAta].ATAID,
      AvvikelseDeviation: this.avvikelseDeviation ? 1 : 0,
    });
  }

  toggleReminderAndCopyCheckbox(toggle) {
    this.sendBtnDisabled = false;
    if (this.showingAtaOrDU == "du") {
      this.reminderCheckboxDU = !this.reminderCheckboxDU;
    }
    if (this.showingAtaOrDU == "ata") {
      this.reminderCheckbox = !this.reminderCheckbox;
    }
  }

  onItemSelect(selectedClient, type) {
    if (
      (this.weeklyReports[this.selectedReport] &&
        this.weeklyReports[this.selectedReport].status == 1) ||
      this.atas[this.selectedAta].Status == 4
    ) {
      let selectedClientEmail = this.client_workers.find(
        (client) => client.Id == selectedClient.Id
      );
      let index = this.client_workers.findIndex(
        (client) => client.Id == selectedClient.Id
      );

      if (index != -1) {
        this.client_workers[index].selected = true;
      }

      let client_responses = [];

      if (type == "ata")
        client_responses = this.atas[this.selectedAta].clientResponses.filter(
          (res) => res["Status"] == 2
        );
      else
        client_responses =
          this.weeklyReports[this.selectedReport].clientResponses;

      if (
        selectedClientEmail &&
        client_responses.length > 0 &&
        client_responses.some(
          (response) => response.answerEmail == selectedClientEmail.email
        )
      ) {
        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = false;
        diaolgConfig.disableClose = true;
        diaolgConfig.width = "";
        diaolgConfig.data = {
          questionText: this.translate.instant("TSC_ALREADY_RESPONDED_ON_ATA"),
        };
        diaolgConfig.panelClass = "mat-dialog-confirmation";
        this.dialog
          .open(ConfirmationModalComponent, diaolgConfig)
          .afterClosed()
          .subscribe((response) => {
            if (!response.result) {
              var elements = document.getElementsByClassName(
                "multiselect-item-checkbox"
              );
              var finalEl;
              for (let i = 0; i < elements.length; i++) {
                if (
                  elements[i]["innerText"].trim() == selectedClient.Name.trim()
                ) {
                  finalEl = elements[i];
                  finalEl.click();
                }
              }
            }
          });
      }
    }
  }

  openModal_ATA() {
    let object = {
      content_type: "KS",
      content_id: null,
      type: "Ata",
      images: this.images,
      documents: this.pdf_documents,
      type_id: null,
    };

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.maxHeight = "550px";
    diaolgConfig.data = {
      data: object,
      images: this.images,
      documents: this.pdf_documents,
    };
    this.dialog
      .open(ImageModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((res) => {});
  }

  removeDocument(index, type) {
    this[type].splice(index, 1);
  }

  toggleAttachment(albumKey, index, type) {
    const deleteStatus =
      !this.atas[this.selectedAta]["files"][albumKey][type][index].deleted;
    const file = this.atas[this.selectedAta]["files"][albumKey][type][index];
    file.deleted = deleteStatus;

    this.addOrRemoveFilesFromDeleteArray(file, deleteStatus, type);
  }

  addOrRemoveFilesFromDeleteArray(file, status, type) {
    if (status) {
      file.deleteType = type;
      this.deletedDocumentsAta.push(file);
    } else {
      this.deletedDocumentsAta = this.deletedDocumentsAta.filter((file_) => {
        return file.id != file_.id;
      });
    }
  }

  generateAttachmentImageArray(answer) {
    return {
      file_path: answer.attachment,
      image_path: answer.image_path,
      document_type: answer.image_path ? "Pdf" : "Image",
      Url: answer.attachment,
    };
  }

  openSwiper(index, images, album) {
    if (images[index].document_type === "Image") {
      this.swiper = {
        active: index,
        images: images,
        album: album,
        index: -1,
        parent: null,
      };
    } else {
      const imageArray = this.createImageArray(images[index]);
      this.swiper = {
        active: 0,
        images: imageArray,
        album: album,
        index: index,
        parent: images[index],
      };
    }
  }


    openSwiperSupplierInvoice(invoice = null, article = null) {
        let imageArray = [];
       // let images = [];
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
                    'image_path': article.pdf_images,
                    'file_path': article.pdf_doc
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
    const id = invoice.id;
    const comment = '';
    const name = invoice.SupplierName;
    const image_path = invoice.image_path;
    const file_path = invoice.pdf_link;

    const imageArray = image_path.split(",").map((imageString) => {
      return {
        image_path: imageString,
        id: id,
        Description: comment,
        name: name,
        file_path: file_path,
      };
    });
    return imageArray;
  }

  closeSwiper() {
    this.swiper = {
      active: -1,
      images: [],
      album: -2,
      index: -1,
      parent: null,
    };
  }

  removeSwiperImage(event) {
    const index = event.index;
    const album = event.album;
    const type = event.type;
    this.toggleAttachment(album, index, type);
  }

  openSwiperKS(index, images, album) {
    if (images[index].document_type === "Image") {
      this.swiperKS = {
        active: index,
        images: images,
        album: album,
        index: -1,
        parent: null,
      };
    } else {
      const imageArray = this.createImageArray(images[index]);
      this.swiperKS = {
        active: 0,
        images: imageArray,
        album: album,
        index: index,
        parent: images[index],
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

  removeSwiperImageKS(event) {
    const index = event.index;
    const album = event.album;
    const type = event.type;
    this.toggleAttachmentKS(album, index, type);
  }

  createImageArray(image) {
    const id = image.id;
    const comment = image.Description;
    const name = image.Name ? image.Name : image.name;
    const image_path = image.image_path;
    const file_path = image.file_path;

    const imageArray = image_path.split(",").map((imageString) => {
      return {
        image_path: imageString,
        id: id,
        Description: comment,
        name: name,
        file_path: file_path,
      };
    });
    return imageArray;
  }

  openSwiperAtt(index, images, album) {
    if (images[index].document_type === "Image") {
      this.swiperAtt = {
        active: index,
        images: images,
        album: album,
        index: -1,
        parent: null,
      };
    } else {
      const imageArray = this.createImageArray(images[index]);
      this.swiperAtt = {
        active: 0,
        images: imageArray,
        album: album,
        index: index,
        parent: images[index],
      };
    }
  }

  closeSwiperAtt() {
    this.swiperAtt = {
      active: -1,
      images: [],
      album: -2,
      index: -1,
      parent: null,
    };
  }

  openAttachmentSwiper(answer) {
    const image = {
      file_path: answer.attachment,
      image_path: answer.image_path,
      document_type: answer.image_path ? "Pdf" : "Image",
      Url: answer.attachment,
    };
    const images = [image];
    this.openSwiperAtt(0, images, 0);
  }

  removeSelectedDocumentsAta(event) {
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
            documents: this.deletedDocumentsAta,
          };
          this.spinner = true;
          this.ataService
            .removeSelectedDocumentsAta(data)
            .subscribe((res: any) => {
              if (res.status) {
                this.removeSelectedDocumentsOnClientSide();
              } else {
                this.toastr.error(this.translate.instant("Error"));
              }
              this.spinner = false;
            });
        }
      });
  }

  removeSelectedDocumentsOnClientSide() {
    this.deletedDocumentsAta.forEach((doc) => {
      const albumKey = doc.album;
      const type = doc.deleteType;
      this.atas[this.selectedAta]["files"][albumKey][type] = this.atas[
        this.selectedAta
      ]["files"][albumKey][type].filter((file: any) => {
        return file.id != doc.id;
      });
      this.clearAlbum(albumKey);
    });
    this.deletedDocumentsAta = [];
  }

  clearAlbum(albumKey) {
    const album = this.atas[this.selectedAta]["files"][albumKey];
    const imagesLength = album.images ? album.images.length : 0;
    const pdfsLength = album.pdfs ? album.pdfs.length : 0;
    if (imagesLength === 0 && pdfsLength === 0) {
      delete this.atas[this.selectedAta]["files"][albumKey];
    }
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
            documents:
              this.weeklyReports[this.selectedReport].removed_documents,
          };
          this.spinner = true;
          this.ataService
            .removeSelectedDocumentsKS(data)
            .subscribe((res: any) => {
              if (res.status) {
                this.removeSelectedDocumentsOnClientSideKS();
              } else {
                this.toastr.error(this.translate.instant("Error"));
              }
              this.spinner = false;
            });
        }
      });
  }

  removeSelectedDocumentsOnClientSideKS() {
    this.weeklyReports[this.selectedReport].removed_documents.forEach((doc) => {
      const albumKey = doc.album;
      this.weeklyReports[this.selectedReport]["files"][albumKey]["images"] =
        this.weeklyReports[this.selectedReport]["files"][albumKey][
          "images"
        ].filter((file: any) => {
          return file.id != doc.id;
        });
      this.weeklyReports[this.selectedReport]["files"][albumKey]["pdfs"] =
        this.weeklyReports[this.selectedReport]["files"][albumKey][
          "pdfs"
        ].filter((file: any) => {
          return file.id != doc.id;
        });
      this.clearAlbumKS(albumKey);
    });
    this.weeklyReports[this.selectedReport].removed_documents = [];
  }

  clearAlbumKS(albumKey) {
    const album = this.weeklyReports[this.selectedReport]["files"][albumKey];
    const imagesLength = album.images ? album.images.length : 0;
    const pdfsLength = album.pdfs ? album.pdfs.length : 0;
    if (imagesLength === 0 && pdfsLength === 0) {
      delete this.weeklyReports[this.selectedReport]["files"][albumKey];
    }
  }

  textEditorKeyDown(editor) {
    const event = editor.event;
    const ataComment = this.createForm.get("ataComment");
    const value = ataComment.value;
    const wordcount = value.length;
    if (wordcount >= 500 && event.keyCode != 8 && event.keyCode != 46) {
      event.preventDefault();
    }
  }

  textEditorOnPaste(editor) {
    editor.event.preventDefault();
  }

  generatePdf(event) {
    let sent_by = this.current_user_full_name;
    if (this.get_last_email_log_but_first_client_wr["from_user"] !== "") {
      sent_by = this.get_last_email_log_but_first_client_wr["from_user"];
    }

    this.spinner = true;

    this.projectsService
      .printPdf({
        reportId: this.weeklyReports[this.selectedReport].id,
        sent_by: sent_by,
        projectId: this.project.id,
        pdf_type: event.type,
      })
      .then((response) => {
        if (response["status"]) {
          if (event.from == "Save") {
            this.dowload_pdf(response["data"].pdfPath);
            this.spinner = false;
          } else {
            printJS(response["data"].pdf_path_without_host);
            this.spinner = false;
          }
        }
      });
  }

  dowload_pdf(pdfPath) {
    const name =
      this.project.CustomName +
      "-" +
      this.weeklyReports[this.selectedReport].name +
      ".pdf";
    const link = document.createElement("a");
    link.href = pdfPath;
    link.setAttribute("download", name);
    document.body.appendChild(link);
    link.click();
  }


  openAttachmentSwiper2(file, files, index) {

    if (file.document_type == 'Pdf') {
      this.openSwiper(index, files, 0);
      return;
    };
    let images = files.filter((file_)=>{
      return file_.document_type != 'Pdf'
    });

    images = images.map((image, i)=>{
      if (image.url == file.url) {
        index = i;
      }
      return this.generateAttachmentImageArray(image);
    });
    this.openSwiper(index, images, 0);
  }

    previewPdf(pdf_link) {

        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = false;
        diaolgConfig.disableClose = true;
        diaolgConfig.width = "1000px";
        diaolgConfig.data = {
            pdf_link: pdf_link,
        };
        this.dialog.open(PdfModalPreviewComponent, diaolgConfig);
    }

  // private get_project_and_sub_project_name_id_and_custom_name_by_project_id() {
  //   let project_id =
  //     this.project.parent > 0 ? this.project.parent : this.project.id;

  //   this.projectsService
  //     .get_project_and_sub_project_name_id_and_custom_name_by_project_id(
  //       project_id
  //     )
  //     .then((res) => {
  //       if (res["status"]) this.projects_for_select = res["data"];
  //     });
  // }

  dropSend() {
    this.buttonToggle = !this.buttonToggle;
  }

  dropSendKS() {
    this.buttonToggleKS = !this.buttonToggleKS;
  }

  shutDown() {
    this.buttonToggle = false;
    this.spinner = false;
  }

  shutDownKS() {
    this.buttonToggleKS = false;
    this.spinner = false;
  }

  decideIfShouldEnableWorker(worker) {

    const selectedAta = this.atas[this.selectedAta];
    const clientResponses = selectedAta.clientResponses.filter(
      (res) => res["Status"] == 2
    );
    const workerEmail = worker.email.trim();
    const response = this.findMailInClientResponses(workerEmail, clientResponses);

    if (!response) {
      this.addWorker(worker);
      return;
    }

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.data = {
      questionText: this.translate.instant("TSC_ALREADY_RESPONDED"),
    };
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          this.addWorker(worker);
        }
      });
  }

  addWorker(worker) {
    this.contacts.push(worker);
  }

  findMailInClientResponses(email, clientResponses) {

    return clientResponses.find(response => email === response.answerEmail.trim());
  }


  buttonNameSummary(event, worker) {

    event.stopPropagation();

    if (worker) {
      this.buttonToggle = true;
      if (
        this.contacts.some((selectedWorker) => selectedWorker.Id == worker.Id)
      ) {
        this.contacts.splice(this.contacts.indexOf(worker), 1);
      } else {
        this.decideIfShouldEnableWorker(worker);
      }
    } else {
      this.buttonToggle = !this.buttonToggle;
      if (this.buttonToggle == true) {
        this.buttonName = "Hide";
      } else {
        this.buttonName = "";
      }
    }
  }

  checkIfContactSelected(contact) {

    if (
      this.contacts.some((selectedWorker) => selectedWorker.Id == contact.Id)
    ) {
      return true;
    } else return false;
  }

  renderText() {
    if (this.type === null || this.type === 'internal')
      return 'Internal ata';
    else
      return 'External ata';
  }

  optionsDownDiv(){
    this.buttonToggleDots = !this.buttonToggleDots;
  }

  optionsDownDivKS(){
    this.buttonToggleDotsKs = !this.buttonToggleDotsKs;
  }

  setColorBasedOnStatus() {

    if (!this.atas[this.selectedAta]) {return};
    this.statusColor = this.atas[this.selectedAta].Status;
    this.iconColor = this.setStatusInternal(this.statusColor);
  }

  setStatusInternal(status) {
    let color = '';

    if (status == 0) {
      // Utkast
      color = '#f0e264';
    }

    if (status == 2) {
      color = '#BFE29C';
    }

    if (status == 3) {
      color = '#FD4444';
    }

    if (status == 4) {
      // skickad
      color = '#FF7000';
    }

    if (status == 5) {
      color = '#fff';
    }

    if (status == 6) {
      color = '#b8b8b8';
    }

    if (status == 7) {
      color = '#fd4444';
    }

      return color;
  }

    threeDotsStatusesChange(value){
      this.runStatusFunction(value);
    }


    runStatusFunction(status) {

      if (status == 0) {
        this.manuallyAcceptAta();
        return;
      }

      if (status == 1) {
        this.manuallyCreateRevision(event);
      }

      if (status == 2) {
        this.manuallyRejectAta();
      }
    }

    buttonNameToggle() {
      this.buttonToggleProject = !this.buttonToggleProject;
    }

    enter() {
      this.currentClass = "title-new-project-hover";
    }

    leave() {
      this.currentClass = "title-new-project";
    }

    changeAtaStatus(atastatus){

      this.atas[this.selectedAta].Status = atastatus;

      this.updateAta(true, true, true, 0, true, false, false, false, false, atastatus).then(
        (res) => {
          if (res["status"]) {

          }
        }
      );
    }
}
