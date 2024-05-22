import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { AtaInfoService } from "src/app/projects/components/ata/modify-ata/ata-info/ata-info.service";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { AtaService } from "src/app/core/services/ata.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { ProjectsService } from "src/app/core/services/projects.service";
import { ImageModalUtility } from "src/app/projects/components/image-modal/image-modal-utility.service";
import { FileStorageService } from "src/app/core/services/file-storage.service";
import { interval, Subject, Subscription } from "rxjs";
import { environment } from "src/environments/environment";
import { UsersService } from "src/app/core/services/users.service";
import { CronService } from "src/app/core/services/cron.service";
import { AESEncryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';

declare var $;

@Component({
  selector: "app-data-of-ata",
  templateUrl: "./data-of-ata.component.html",
  styleUrls: ["./data-of-ata.component.css"],
  providers: [ImageModalUtility],
})
export class DataOfAtaComponent implements OnInit, OnDestroy, AfterViewInit {
  public atasSub;
  public ata: any = [];
  public pominalse: boolean = false;
  public ataKsSub;
  public createForm: FormGroup;
  public toggle: any = {
    aditionalWork: false,
    material: false,
    ui: false,
  };
  public project: any = [];
  public type: any;
  public openPdf;
  public language = "en";
  public AtaTypes = [];
  public AtaTypesServer = [];
  public getDebitForms = [];
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
  public articlesMaterialProjectDeduct = 0;
  public articlesOtherProjectDeduct = 0;
  public allArticlesAdditionalWork = [];
  public allArticlesMaterial = [];
  public allArticlesOther = [];
  public deletedArticlesAditionalWork = [];
  public deletedArticlesMaterials = [];
  public deletedArticlesOther = [];
  public supplierInvoices: any[] = [];
  public units: any = [];
  public enabledAccounts = [];
  public totalSum = "0.00";
  public materialProperties = [];
  public client_workers = [];
  public contacts = [];
  public selectedFirstClientWorker: any = null;
  public sendCopy: boolean = false;
  public userDetails: any = JSON.parse(sessionStorage.getItem("userDetails"));
  public ataAlbums: any[] = [];
  public manual_rejected_ata_from_select: boolean = false;
  public allowUpdateAtaSub;
  public allowManualAcceptAtaSub;
  public allowManualDeclineAtaSub;
  public allowUpdateAtaStatusSub;
  public allowCreateRevisionAtaSub;
  public images: any[] = [];
  public pdf_documents: any[] = [];
  public load_data:boolean = true;
  infoObjectAta = {
    content_type: "KS",
    content_id: null,
    type: "Ata",
    images: this.images,
    documents: this.pdf_documents,
    type_id: null,
  };
  $_clearFiles: Subject<void> = new Subject<void>();
  deletedDocumentsAta = [];
  swiper = {
    images: [],
    active: -1,
    album: -2,
    index: -1,
    parent: null,
  };
  swiperAtt = {
    images: [],
    active: -1,
    album: -2,
    index: -1,
    parent: null,
  };
  public getAtaStatusSub;
  public overedData: any;
  public indexHovered: any;
  public overedType: any;
  public atas: any[] = [];
  public labeling_disabled: any = null;
  public getClientWorkersSub;
  public project_id;
  public allow_save: boolean = false;
  public imagesShow: boolean = true;
  public projectSaveSubscription: Subscription;
  private subscription: Subscription;
  public fullName: any;
  public editAta: boolean = false;
  public counter = 0;
  public selected_article;
  public selected_ata_id:any = 0;
  public sendAta:boolean = false;
  public ataStatus:any;
  public projectUserDetails;
  public getReloadAtaPDFSub;
  public adminRole;

  constructor(
    private ataInfoService: AtaInfoService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private ataService: AtaService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private projectsService: ProjectsService,
    private imageModalUtility: ImageModalUtility,
    private fsService: FileStorageService,
    private router: Router,
    private usersService: UsersService,
    private cronService: CronService,
    private AESEncryptDecryptService: AESEncryptDecryptService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.adminRole = this.AESEncryptDecryptService.sha256('Administrator');
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
        this.type = params.get("type") || null;
        this.project_id = params.get("projectId") || 0;
        this.selected_ata_id = params.get("selected_ata") || 0;
       /* if(this.type == 'internal') {
            const ataInternal = Number(this.userDetails.show_project_Internalata);
            if(!ataInternal) {
                this.router.navigate(["projects", "view", this.project_id]);
            }
        }

        if(this.type == 'external') {
            const ataExternal = Number(this.userDetails.show_project_Externalata);
            if(!ataExternal) {
                this.router.navigate(["projects", "view", this.project_id]);
            }
        }*/
    });
    this.ataInfoService.setAllowUpdateAta(false);
    this.projectUserDetails = this.route.snapshot.data["projectUserDetails"];
    this.language = sessionStorage.getItem("lang");
    if (this.type == "external") {
      this.atas = this.route.snapshot.data.atas["data"];
    } else {
      this.atas = this.route.snapshot.data.internalAtas["data"];
    }
    this.ataStatus=this.atas[0].Status;

    this.units = this.route.snapshot.data["units"];
    this.project = this.route.snapshot.data["project"]["data"];
    this.AtaTypesServer = this.route.snapshot.data["type_atas"];
    if(this.project.debit_Id != 2) {
        this.AtaTypesServer = this.AtaTypesServer.filter((type) => {
            return type.id != "4";
        });
    }
    this.enabledAccounts = this.route.snapshot.data["enabledAccounts"];
    this.materialProperties = this.route.snapshot.data["materialProperties"];
    this.projectsService.getAttestClientWorkers(this.project.id).then((res) => {
      this.client_workers = res;
    });
    this.route.queryParamMap.subscribe((params) => {
      this.type = params.get("type") || null;
      this.openPdf = params.get("openPdf") || null;
    });
    this.articlesMaterialProjectDeduct = this.project["ataChargeMaterial"];
    this.articlesOtherProjectDeduct = this.project["ataChargeUE"];
    this.getSelectedAta();
    this.getDebitForm();
    this.getAllowUpdateAta();
    this.getAllowManualAcceptAta();
    this.getAllowManualDeclineAta();
    this.getAllowUpdateAtaStatus();
    this.getAllowCreateRevisionAta();
    this.getAtaStatus();
    this.getClientWorkers();
    this.getReloadAtaPDF();
/*
    setTimeout(() => {
      this.autogrow();
    }, 1000);
*/
    // Use Enter key as Tab //
    document.addEventListener("keydown", this.getSelected.bind(this));
    const source = interval(5000);
    if (environment.production) {
      this.subscription = source.subscribe((val) => {
        this.getUserPermission();
      });
    }
    this.getUserPermission();
  }

  ngAfterViewInit() {
    this.autogrow();
  }

  ngOnDestroy() {
    this.unsubFromAtaKs();
    this.unSubAllowUpdateAta();
    this.unSubAllowManualAcceptAtaSub();
    this.unSubAllowManualDeclineAtaSub();
    this.unSubAllowManualDeclineAtaSub();
    this.unSubAllowUpdateAtaStatus();
    this.unSubAllowCreateRevisionAta();
    this.unSubgetClientWorkers();
    this.unSubGetAtaStatus();
    this.ataInfoService.setAllowSendtAta(false);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


    getSelected(event) {
        if (event.target["dataset"] && event.target["dataset"].selected_article) {
          this.selected_article = event.target["dataset"].selected_article;
        }

        if(event.srcElement.localName == 'textarea') {
          return;
        }

        if (
          (event.keyCode === 13 && event.target["form"]) ||
          (event.keyCode === 9 && event.target["form"])
        ) {
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
          if (this.selected_article == "additional-work") {
            this.addRow(this.articlesAdditionalWork, "articlesAdditionalWork");
          }
          if (this.selected_article == "article-material") {
            this.addRow(this.articlesMaterial, "articlesMaterial");
          }
          if (this.selected_article == "article-other") {
            this.addRow(this.articlesOther, "articlesOther");
          }
        }
    }

    unSubGetReloadAtaPDF() {

      if(this.getReloadAtaPDFSub) {
        this.ataInfoService.setReloadAtaFromTab(false);
        this.ataInfoService.setReloadAtaPDF(false);
        this.getReloadAtaPDFSub.unsubscribe();
      }
    }


    unSubAllowCreateRevisionAta() {
        if(this.allowCreateRevisionAtaSub) {
            this.ataInfoService.setAllowCreateRevisionAta(null);
            this.allowCreateRevisionAtaSub.unsubscribe();
        }
    }



    unSubAllowManualDeclineAtaSub() {
        if(this.allowManualDeclineAtaSub) {
            this.ataInfoService.setAllowManualDeclineAta(null);
            this.allowManualDeclineAtaSub.unsubscribe();
        }
    }


    unSubAllowUpdateAta() {
        if(this.allowUpdateAtaSub) {
            this.ataInfoService.setAllowUpdateAta(false);
            this.allowUpdateAtaSub.unsubscribe();
        }
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

        this.ata.articlesAdditionalWork.forEach((article) => {
          if (
            (this.ata.PaymentType != 4 &&
              this.ata.PaymentType != 1) ||
            (this.ata.PaymentType == 4 &&
              article.wrId == "0") ||
            (this.ata.PaymentType == 1 &&
              article.wrId == "0")
          ) {
            this.articlesAdditionalWork.push(this.fb.group(article));
          }

          this.allArticlesAdditionalWork.push(article);
        });

        this.ata.articlesMaterial.forEach((article) => {
          article.displayName = article.Name;

          if (
            (this.ata.PaymentType != 4 &&
              this.ata.PaymentType != 1) ||
            (this.ata.PaymentType == 4 &&
              article.wrId == "0") ||
            (this.ata.PaymentType == 1  &&
              article.wrId == "0")
          ) {
            this.articlesMaterial.push(this.fb.group(article));
          }

          this.allArticlesMaterial.push(article);
        });

        this.ata.articlesOther.forEach((article) => {
          article.displayName = article.Name;

          if (
            (this.ata.PaymentType != 4 &&
              this.ata.PaymentType != 1) ||
            (this.ata.PaymentType == 4 &&
              article.wrId == "0") ||
            (this.ata.PaymentType == 1 &&
              article.wrId == "0")
          ) {
            this.articlesOther.push(this.fb.group(article));
          }

          this.allArticlesOther.push(article);
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


       // if(this.ata.Status != 0) {
            this.disable_buttons();
       // }

        this.articlesAdditionalWork.value.forEach((row) => {
          if(row['id'] != '') {
            this.toggle["ui"] = true;
          }
        });

        this.articlesMaterial.value.forEach((row) => {
          if(row['id'] != '') {
            this.toggle["aditionalWork"] = true;
          }
        });

        this.articlesOther.value.forEach((row) => {
          if(row['id'] != '') {
            this.toggle["material"] = true;
          }
        });
    }

    disable_buttons(disable_edit_ata = false) {

        if(this.ata.Status != 0 || disable_edit_ata || !this.allowEditAta()) {
            this.createForm.disable();
            $('#dueDate').attr("disabled","disabled");
            $('#startDate').attr("disabled","disabled");
            $('.form-control').attr("disabled","disabled");
        }else {
            this.createForm.enable();
            $('#dueDate').removeAttr("disabled");
            $('#startDate').removeAttr("disabled");
            $('.form-control').removeAttr("disabled");
        }
        if(this.ata.Status != 0 && this.ata.Status != 4 && this.ata.Status != 3) {
            this.createForm.get('labeling_requirements').enable();
        }
        //this.createForm.get("labeling_disabled").disable();
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

  setAtaTypes(payment_type, payment_tab_change = false) {

    if (payment_tab_change) {
      this.createForm.get('AtaType').patchValue('1');
    }

    if (payment_type == 1) {
      this.AtaTypes = this.AtaTypesServer.filter((type) => {
        return type.id != "3";
      });
    }else if (payment_type == 2) {
      this.AtaTypes = this.AtaTypesServer.filter((type) => {
          return type.id != "4";
      });
    }else {
      this.AtaTypes = this.AtaTypesServer;
    }
  }

  autogrow() {
    let textArea = document.getElementById("briefDescription");
    textArea.style.overflow = "hidden";
    textArea.style.minHeight = "55px";
    textArea.style.height = "0px";
    textArea.style.height = textArea.scrollHeight + "px";
  }

  unSubgetClientWorkers() {
    if (this.getClientWorkersSub) {
      //  this.ataInfoService.setClientWorkers(null);
      this.getClientWorkersSub.unsubscribe();
    }
  }

  unSubGetAtaStatus() {
    if (this.getAtaStatusSub) {
      this.ataInfoService.setAtaStatus(null);
      this.getAtaStatusSub.unsubscribe();
    }
  }


  unSubAllowUpdateAtaStatus() {
    if (this.allowUpdateAtaStatusSub) {
      this.ataInfoService.setAllowUpdateAtaStatus(null);
      this.allowUpdateAtaStatusSub.unsubscribe();
    }
  }


  unSubAllowManualAcceptAtaSub() {
    if (this.allowManualAcceptAtaSub) {
      this.ataInfoService.setAllowManualAcceptAta(null);
      this.allowManualAcceptAtaSub.unsubscribe();
      setTimeout(() => this.allowManualAcceptAtaSub.unsubscribe());
    }
  }

  getDebitForm() {
    this.projectsService
      .getDebitFormForAta(this.ata.PaymentType, false, this.project.debit_Id)
      .then((res) => {
        this.getDebitForms = res["data"];
      });
  }

  async generateForm() {
    this.setAtaTypes(this.ata.PaymentType);

    this.createForm = this.fb.group({
      id: [this.ata.ATAID, []],
      Deviation: [this.ata.Deviation, []],
      Name: [this.ata.Name, [Validators.required, Validators.maxLength(55)]],
      AtaType: [
        { value: this.ata.AtaType, disabled: false },
        [Validators.required],
      ],
      AtaNumber: [this.ata.AtaNumber],
      DeviationNumber: [this.ata.DeviationNumber],
      StartDate: [this.ata.StartDate, [Validators.required]],
      DueDate: [this.ata.DueDate, [Validators.required]],
      RevisionDate: [this.ata.RevisionDate, []],
      Status: [this.ata.Status, [Validators.required]],
      street: [this.project.street, []],
      city: [this.project.city, []],
      zip: [this.project.zip, []],
      clientName: [this.project.clientName, []],
      briefDescription: [
        this.ata.briefDescription || "",
        Validators.maxLength(500),
      ],
      ataComment: [this.ata.ataComment || "", Validators.maxLength(4000)],
      articlesAdditionalWork: this.fb.array([]),
      articlesMaterial: this.fb.array([]),
      articlesOther: this.fb.array([]),
      paymentType: [this.ata.PaymentType, [Validators.required]],
      paymentTypeName: [this.ata.paymentTypeName, [Validators.required]],
      ClientComment: this.ata.ClientComment,
      AnswerEmail: this.ata.AnswerEmail,
      AnswerTime: this.ata.AnswerTime,
      AuthorName: [this.ata.AuthorName],
      invoicedTotal: this.ata.invoicedTotal,
      Type: this.type,
      clientResponses: this.fb.array(this.ata.clientResponses),
      parent: [this.ata.ParentAta],
      timesEmailSent: [this.ata.timesEmailSent],
      timesReminderSent: [this.ata.timesReminderSent],
      timesReminderSentDU: this.ata.timesReminderSentDU,
      totallyWorkedUp: [this.ata.totallyWorkedUp],
      additionalWorkStatus: [null, []],
      labeling_requirements: [
        { value: this.ata.labeling_requirements, disabled: null },
        [/*Validators.required*/],
      ],
      email_log_date: [this.ata.email_log_date],
    });

    this.generateStartAndEndDateDatePicker();
    this.ataInfoService.setIfHasChangesOnForm(this.createForm.dirty);
  }

  detectChanges() {
    this.ataInfoService.setIfHasChangesOnForm(this.createForm.dirty);
  }

  generateStartAndEndDateDatePicker() {
    setTimeout(() => {
      const datepickerOptions = {
        format: "yyyy-mm-dd",
        calendarWeeks: true,
        autoclose: true,
        language: this.language,
        currentWeek: true,
        todayHighlight: true,
        currentWeekTransl: this.language === "en" ? "Week" : "Vecka",
        currentWeekSplitChar: "-",
        weekStart: 1
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
          this.createForm.markAsDirty();
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
          if (!this.pominalse) {
            this.createForm.markAsDirty();
            this.allow_save = true;
          }
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

  setAtaType() {
    if (this.type === null) {
      this.type = this.ata.Type == 1 ? "external" : "internal";
    }
  }

  getSelectedAta() {
    this.ataKsSub = this.ataInfoService.getSelectedAta().subscribe((ata) => {

      this.ata = ata;
      this.getUserPermission();
      this.generateForm().then((res) => {
        this.getAllAtaArticles();
      });
      this.setAtaType();
    });
  }

  unsubFromAtaKs() {
    if (this.ataKsSub) {
      this.ataKsSub.unsubscribe();
    }
  }

  toggleMenu(type) {
    if (type == "aditionalWork") {
      this.toggle["aditionalWork"] = !this.toggle["aditionalWork"];
    } else if (type == "material") {
      this.toggle["material"] = !this.toggle["material"];
    } else if (type == "ui") {
      this.toggle["ui"] = !this.toggle["ui"];
    }
  }

  pominalseCheck() {
    this.pominalse = !this.pominalse;
    this.ataInfoService.setAtaReminderStatus(this.pominalse);
    if (this.pominalse) {
      $("#dueDate").removeAttr("disabled");
    } else {
      $("#dueDate").attr("disabled", true);
    }
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

    const clientResponses = this.createForm.get("clientResponses") as FormArray;

    this.ata.clientResponses.forEach((cr) => {
      clientResponses.push(this.fb.group(cr));
    });
    return valid;
  }

  addRow(formGroup, table, index = -1) {


    let status = false;

    if(formGroup.value.length -1 == index) {
        status = true;
    }
/*
    const i = formGroup.controls.findIndex((article) => {
      return article.value.Name == "";
    });
*/
    if (status) {
      formGroup.push(this.fb.group(this.addEmptyArticle(table)));
    }
  }

   removeRow(index, formGroup, type) {
    if (
      formGroup.controls[index].value.Name == "" &&
      formGroup.value.filter((article) => article.Name == "").length == 1 ||
      !this.allowEditAta()
    ) {
      return;
    }
    this.createForm.markAsDirty();
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          const momentDocuments = this.ata
            ? this.ata.files["694201337"]
            : false;
          if (momentDocuments && momentDocuments.images) {
            momentDocuments.images = momentDocuments.images.filter(
              (article) => {
                return article.article_id != formGroup.controls[index].value.id;
              }
            );

            if (momentDocuments.images.length === 0) {
              delete this.ata.files["694201337"];
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
                formGroup.controls[index].value.id
              );
            } else if (type == 3) {
              this.deletedArticlesOther.push(
                formGroup.controls[index].value.id
              );
            }

            if (this.ata) {
              this.ata.rowDeleted = true;
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

  round_number(value, precision) {
    if (Number.isInteger(precision)) {
      var shift = Math.pow(10, precision);
      // Limited preventing decimal issue
      return Math.round(value * shift + 0.00000000000001) / shift;
    } else {
      return Math.round(value);
    }
  }

  updateTotal(i, formGroup, calcTime = false) {

      let total: any = "0";
      const ataType = this.createForm.get("AtaType").value;

      const Price = Number(
        formGroup.controls[i].value.Price.toString()
          .replace(/\s/g, "")
          .replace(",", ".")
      );
      let Quantity = Number(
        formGroup.controls[i].value.Quantity.toString()
          .replace(/\s/g, "")
          .replace(",", ".")
      );

      let Deduct = this.round_number(
        Number(
          formGroup.controls[i].value.Deduct.toString()
            .replace(/\s/g, "")
            .replace(",", ".")
        ),
        2
      );

      if (ataType == "3" && Quantity > 0) {
        Quantity = -1 * Quantity;
        (<FormGroup>formGroup.controls[i]).controls["Quantity"].patchValue(Quantity);
      }

      if(Quantity < 0) {
        Deduct = 0;
      }

      total = (
        Quantity *
        Price *
        (Deduct / 100 + 1)
      ).toFixed(2);

      if (ataType == "3") {
        const totalNum = Number(total);
        if (totalNum > 0) {
          total = totalNum * -1;
        }
      }
      (<FormGroup>formGroup.controls[i]).controls["Deduct"].patchValue(Deduct);
      (<FormGroup>formGroup.controls[i]).controls["Total"].patchValue(total);

      return total;
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

  calcAllTotal(data) {
    let total = 0;

    data.forEach((data2) => {
      if (data2 && data2.length > 0) {
        data2.forEach((data3) => {
          let amount = data3.Total != "" ? data3.Total : 0;

          total += parseFloat(amount);
        });
      }
    });
    this.totalSum = total.toFixed(2);
    return this.totalSum;
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

  updateAlbumsAta(event) {
    this.ataAlbums = event;
    this.createForm.markAsDirty();
    this.ataInfoService.setIfHasChangesOnForm(true);
  }

  async updateAtaStatusAndReminder(generate_ata_pdf = false) {
    const data = this.createForm.value;

    let ata = {
      id: data.id,
      reminder: this.pominalse,
      DueDate: data.DueDate,
    };

    if (this.createForm.dirty) {
      generate_ata_pdf = true;
    }

    let response = await this.ataService.updateAtaStatusAndReminder(ata);
    if (response["status"]) {
      this.reloadAta();
      this.toastr.success(
        this.translate.instant("You successfully updated Ata."),
        this.translate.instant("Success")
      );
    }
    this.$_clearFiles.next();
  }

  getClientWorkers() {
    this.getClientWorkersSub = this.ataInfoService
      .getClientWorkers()
      .subscribe((result) => {
        if (result) {
          this.client_workers = result.client_workers;
          this.contacts = result.contacts;
        }
      });
  }

  async ensureRemoveLastEmptyRow(articles) {
      let index = articles && articles.length > 1 ? articles.length -1 : -1;
      if(index > -1 && articles[index].Name == '') {
          articles.splice(index, 1);
          this.ensureRemoveLastEmptyRow(articles);
      }else {
          return true;
      }
  }

  async save(generate_ata_pdf = false, notis = true) {
    //const data = this.createForm.value;
    const data = this.createForm.getRawValue(); // useing disabled value
    //let valid = false;
    await this.ensureRemoveLastEmptyRow(data['articlesAdditionalWork']);
    await this.ensureRemoveLastEmptyRow(data['articlesMaterial']);
    await this.ensureRemoveLastEmptyRow(data['articlesOther']);

    if (this.ata.Status == 8) {///question copy of documents
        return;
    }

   // if (this.ata.Status == 0 || generate_ata_pdf) {
   //   valid = this.validateForm();
   // }

  //  if (this.ata.Status == 0 || generate_ata_pdf) {
  //    valid = this.validateForm();
  //  }


  //  if (valid) {
      this.ataInfoService.setSpinner(true);
      /*data.articlesAdditionalWork = data.articlesAdditionalWork.filter(
        function (row) {
          return row.Name != "";
        }
      );*/

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
      /*data.articlesMaterial = data.articlesMaterial.filter((row) => {
        return row.Name != "";
      });*/
      data.articlesMaterial = data.articlesMaterial.map((article) => {
        article.Quantity = Number(
          article.Quantity.toString().replace(/\s/g, "").replace(",", ".")
        );
        article.Price = Number(
          article.Price.toString().replace(/\s/g, "").replace(",", ".")
        );
        return article;
      });

      /*data.articlesOther = data.articlesOther.filter((row) => {
        return row.Name != "";
      });*/
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

      const albumFiles = this.imageModalUtility.getAlbumFiles(this.ataAlbums);
      const _newAlbumFiles = await this.fsService.mergeFilesAndAlbums(
        albumFiles
      );

      if (_newAlbumFiles != null) {
        albumFiles.images = _newAlbumFiles.images;
        albumFiles.pdfs = _newAlbumFiles.pdfs;
      }

      const files = this.ata["files"];
      const ataServerFiles = this.imageModalUtility.getAlbumFiles(files);
      const newFiles = albumFiles.images.concat(albumFiles.pdfs);
      const serverFiles = ataServerFiles.images.concat(ataServerFiles.pdfs);
      const attachments = serverFiles.concat(newFiles);

      attachments.forEach((attachment, i) => {
        if(!attachment.id) {
          this.load_data = true;
        }
      });

      let client_worker = null;
      let contact_pom = [];

      //  if (update_email_log) {
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
      //  }

      const fullname = this.sendCopy
        ? data.AuthorName
        : this.userDetails.firstname + " " + this.userDetails.lastname;

      if (this.createForm.dirty) {
        generate_ata_pdf = true;
      }

      const ata = {
        id: this.ata.ATAID,
        AtaNumber: this.ata.AtaNumber,
        DeviationNumber: this.ata.DeviationNumber,
        Deviation: this.ata.Deviation,
        pdf_link: this.ata.PDFUrl,
        Name: data.Name,
        AtaType: data.AtaType,
        StartDate: data.StartDate,
        DueDate: data.DueDate,
        Status: data.Status,
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
        wrId: 0,
        wr_documents: wr_documents,
        fullname: fullname,
        WeeklyReportDueDate: "",
        documents: this.ata["Documents"],
        attachments: attachments,
        pdf_images_link: this.ata["pdf_images_link"],
        external: this.ata.external,
        Type: this.ata.Type,
        oldPaymentType: this.ata.PaymentType,
        parent: this.ata.ParentAta,
        BecameAtaFromDeviation: this.ata.BecameAtaFromDeviation
          ? this.ata.BecameAtaFromDeviation
          : 0,
        timesEmailSent: this.ata.timesEmailSent,
        timesReminderSent: this.pominalse
          ? Number(this.ata.timesReminderSent) + 1
          : this.ata.timesReminderSent,
        timesReminderSentDU: data.timesReminderSentDU,
        sendReminder: this.pominalse ? true : false,
        sendReminderDU: this.pominalse ? true : false,
        BecomeExternalAtaFromInternal: this.ata.BecomeExternalAtaFromInternal,
        client_worker: client_worker,
        sendCopy: this.sendCopy,
        print: print,
        manual_rejected_ata_from_select: this.manual_rejected_ata_from_select,
        type_name: this.type,
        generate_ata_pdf: generate_ata_pdf,
        labeling_requirements: data.labeling_requirements,
        sentBy: this.sentBy,
        sendAta: this.sendAta
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

      if (!ata.timesReminderSent) ata.timesReminderSent = 0;
      let response = await this.ataService.updateAta(ata);
      this.createForm.markAsPristine();

      if (response["status"]) {
        this.load_data = true;
        this.reloadAta();
        if (notis) {
          this.toastr.success(
            this.translate.instant("You successfully updated Ata."),
            this.translate.instant("Success")
          );
        }
      }
      this.$_clearFiles.next();
    /*} else {
      let object = {
        id: this.ata.ATAID,
        labeling_requirements: data.labeling_requirements,
      };

      this.ataService.updateAtaLabelingRequirements(object).subscribe((res) => {
        this.toastr.success(
          this.translate.instant("You successfully updated Ata."),
          this.translate.instant("Success")
        );
        this.reloadAta();
      });
    }*/
    this.sendAta = false;
    this.allow_save = false;
    return true;
  }

  public sentBy = "";
  generateSentBy() {
    const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    const sentBy = `${userDetails.firstname} ${userDetails.lastname}`;
    this.sentBy = sentBy;
  }

  getAllowUpdateAta() {
    this.allowUpdateAtaSub = this.ataInfoService
      .getAllowUpdateAta()
      .subscribe(async (result) => {

        if (result == "send" || result == "send2") {
          this.sendAta = true;
          this.generateSentBy();
          await this.save(true, false);
          this.sentBy = "";
          this.ataInfoService.setAllowSendtAta(true);
        }

        this.load_data = false;
        if(!this.ata.PDFUrl) {
          this.load_data = true;
        }

        if (result == "print") {
          this.sendAta = false;
          await this.save(true, false);
          this.ataInfoService.setAllowPrintAta(true);
        }

        if (result == "downloadAtaPdf") {
          this.sendAta = false;
          await this.save(true, false);
          this.ataInfoService.setAllowDownloadAtaPdf(true);
          //this.ataInfoService.setAllowPrintAta(true);
        }
      });
  }

  getAllowManualAcceptAta() {
    this.allowManualAcceptAtaSub = this.ataInfoService
      .getAllowManualAcceptAta()
      .subscribe(async (status) => {
        if (status) {
          this.manuallyAcceptAta();
        }
      });
  }

  getAllowManualDeclineAta() {
    this.allowManualDeclineAtaSub = this.ataInfoService
      .getAllowManualDeclineAta()
      .subscribe(async (status) => {
        if (status) {
          this.manuallyRejectAta();
        }
      });
  }

  getAllowUpdateAtaStatus() {
    this.allowUpdateAtaStatusSub = this.ataInfoService
      .getAllowUpdateAtaStatus()
      .subscribe(async (data) => {
        if (data) {
          this.ataService
            .updateStatus(this.ata.ATAID, data.Status)
            .then((res) => {
              if (res["status"]) {
                this.reloadAta();
                this.toastr.success(
                  this.translate.instant("You successfully updated Ata."),
                  this.translate.instant("Success")
                );
              }
            });
        }
      });
  }

  async reloadAta() {

    if(!this.load_data) {
      this.load_data = true;
      this.ataInfoService.setAllowUpdateAta(false);
      this.ataInfoService.setSpinner(false);
      return;
    }

    let ata_id = this.ata.ATAID;

    if (this.ata.ParentAta != 0) {
      ata_id = this.ata.ParentAta;
    }

    let atas = [];
    if (this.type == "internal") {
      const res = await this.ataService.getInternalAtaAndSubatas2(ata_id);
      atas = res["data"];
    } else {

      const res = await this.ataService.getAtaAndSubatas(ata_id);
      atas = res["data"];
    }

    this.ataInfoService.setAllowUpdateAta(false);
    this.ataInfoService.setAtas(atas);
    this.ataInfoService.setSelectedAta(atas.length - 1);
    this.ataInfoService.setSpinner(false);
  }

  async manuallyAcceptAta() {
    this.ataService.manuallyAcceptAta(this.ata.ATAID).subscribe(async (res) => {
      if (res["status"]) {
        this.toastr.success(
          this.translate.instant("Successfully accepted ata!"),
          this.translate.instant("Success")
        );
        this.load_data = true;
        this.reloadAta();
      } else {
        this.toastr.error(
          this.translate.instant("There was an error while accepting ata!"),
          this.translate.instant("Error")
        );
      }
    });
  }

  manuallyRejectAta() {
    this.ataService.manuallyRejectAta(this.ata.ATAID, this.project.id).subscribe(async (res) => {
      if (res["status"]) {
        this.toastr.success(
          this.translate.instant("Successfully rejected ata!"),
          this.translate.instant("Success")
        );
        this.load_data = true;
        this.reloadAta();
      } else {
        this.toastr.error(
          this.translate.instant("There was an error while rejecting ata!"),
          this.translate.instant("Error")
        );
      }
      this.ataInfoService.setSpinner(false);
    });
  }

    manuallyCreateRevision() {

        const data = {
            CwId: null,
            ataID: this.ata.ATAID,
            description: "Manual revision.",
            email: this.userDetails.email,
            file: {},
            group: "",
            question: "Manual revision.",
            status: 0,
            token: "",
            reminder: 0,
            isMainContact: false,
            send_email: false
        };

    this.ataService.manuallyCreateRevision(data).subscribe((res) => {
      if (res["status"]) {
        this.toastr.success(
          this.translate.instant("Successfully created ata revision!"),
          this.translate.instant("Success")
        );
        this.load_data = true;
        this.reloadAta();
        this.createForm.enable();
      } else {
        this.toastr.error(
          this.translate.instant("There was an error while creating revision!"),
          this.translate.instant("Error")
        );
      }
      this.ataInfoService.setSpinner(false);
    });
  }

  getAllowCreateRevisionAta() {
    this.allowCreateRevisionAtaSub = this.ataInfoService
      .getAllowCreateRevisionAta()
      .subscribe((status) => {
        if (status) {
          this.manuallyCreateRevision();
        }
      });
  }

  getAlbumKeys() {
    let keys = [];
    if (this.ata) {
      const files = this.ata["files"];
      keys = Object.keys(files).sort(function (a, b) {
        return Number(b) - Number(a);
      });
    }

    return keys;
  }

  getAlbumFiles(albumKey, type) {
    const files = this.ata["files"][albumKey][type];
    return files;
  }

  toggleAttachment(albumKey, index, type) {
    const deleteStatus = !this.ata["files"][albumKey][type][index].deleted;
    const file = this.ata["files"][albumKey][type][index];
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

  isPDFViewer: boolean = false;
  openSwiper(index, files, album) {
    if (files[index].document_type === "Image") {
      this.isPDFViewer = false;
      this.swiper = {
        active: index,
        images: files,
        album: album,
        index: -1,
        parent: null,
      };
    } else {
      const fileArray = this.createImageArray(files[index]);
      this.isPDFViewer = true;
      this.swiper = {
        active: 0,
        images: fileArray,
        album: album,
        index: index,
        parent: files[index],
      };
    }
  }

  createImageArray(file) {
    const id = file.id;
    const comment = file.Description;
    const name = file.Name ? file.Name : file.name;
    //const image_path = image.image_path;
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

    getAlbumDescription(albumKey) {
        const description = this.ata["files"][albumKey]["description"];
        return description ? description : "";
    }

    filterClientResponses(responses) {
        if (responses) {
        return responses.filter(
            (response) => response.client_message || response.attachment
        );
        } else {
        return [];
        }
    }

    generateAttachmentFileArray(answer) {
        if (answer.document_type === "Pdf") {
        return {
            file_path: answer.file_path,
            document_type: "Pdf",
            Url: answer.Url,
        };
        } else if (answer.document_type === "Image") {
        return {
            file_path: answer.file_path,
            document_type: "Image",
            Url: answer.Url,
        };
        }
    }

  openAttachmentSwiper2(file, files, index) {

    if (file.document_type == "Pdf") {
      this.openSwiper(index, files, 0);
      return;
    }
    let images = files.filter((file_) => {
      return file_.document_type != "Pdf";
    });

    images = images.map((image, i) => {
      if (image.url == file.url) {
        index = i;
      }
      return this.generateAttachmentFileArray(image);
    });
    this.openSwiper(index, images, 0);
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

  getAtaStatus() {
    this.getAtaStatusSub = this.ataInfoService
      .getAtaStatus()
      .subscribe((status) => {
        if (status != null) {
          this.ata.Status = status;
          if (status != 0) {
            this.disable_buttons();
          }
        }
      });
  }

  showDataOnHover(overed, i, type) {
    this.overedType = type;
    this.indexHovered = i;
    this.overedData = overed;
  }

  notShowDataOnHover(unOvered, i) {
    this.overedType = [];
    this.indexHovered = [];
    this.overedData = [];
  }

  setEmailLogData(status) {
    let object = {
      name: "",
      background: "",
    };

    if (status == 0) {
      object.name = "Question";
      object.background = "#F0E264";
    }

    if (status == 2) {
      object.name = "Accepted";
      object.background = "#02B94C";
    }

    if (status == 3) {
      object.name = "Declined";
      object.background = "#FF5454";
    }

    return object;
  }

  removeATA() {

        if (
          !this.allowEditAta()
        ) {
          return;
        }

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.data = {
      questionText: this.translate.instant(
        "Are you sure you want to delete ata?"
      ),
    };
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          let object = {
            id: this.ata.ATAID,
            Type: this.type == "external" ? 1 : 0,
            BecomeExternalAtaFromInternal:
              this.ata.BecomeExternalAtaFromInternal,
            oldAtaNumber: this.ata.AtaNumber,
            projectId: this.project.id,
            ParentAta: this.ata.ParentAta,
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

  allowUpdateAta() {
    this.allow_save = true;
  }



    removeSelectedDocumentsOnClientSide() {
        this.deletedDocumentsAta.forEach((doc) => {
          const albumKey = doc.album;
          const type = doc.deleteType;
          this.ata["files"][albumKey][type] = this.ata["files"][albumKey][type].filter((file: any) => {
            return file.id != doc.id;
          });
          this.clearAlbum(albumKey);
        });
        this.deletedDocumentsAta = [];
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

        if(this.ata.Status != "0") {
            this.editAta = false;
        }else {
            this.usersService.getUserPermission("Ata", this.ata.ATAID).subscribe((res) => {

                if (res["status"]) {

                    this.fullName = res["data"]["fullName"];
                    this.editAta = res["data"]["edit"];
                    this.ataInfoService.setAllowEditAta(this.editAta);

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
                        this.disable_buttons(true);
                    }
                    this.ataInfoService.setSpinner(false);
                }
            });
        }
    }

  removeSelectedDocumentsAta(event) {
    event.stopPropagation();
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          const data = {
            documents: this.deletedDocumentsAta,
          };
          this.ataInfoService.setSpinner(true);
          this.ataService
            .removeSelectedDocumentsAta(data)
            .subscribe((res: any) => {
              if (res.status) {
                this.removeSelectedDocumentsOnClientSide();
              } else {
                this.toastr.error(this.translate.instant("Error"));
              }
              this.ataInfoService.setSpinner(false);
            });
        }
      });
  }


    clearAlbum(albumKey) {
        const album = this.ata["files"][albumKey];
        const imagesLength = album.images ? album.images.length : 0;
        const pdfsLength = album.pdfs ? album.pdfs.length : 0;
        if (imagesLength === 0 && pdfsLength === 0) {
            delete this.ata["files"][albumKey];
        }
    }

    openImgData() {
        this.imagesShow = !this.imagesShow;
    }

    enableUpdate() {

        let status = 0;
        const permissions = {
            ataExternal: Number(this.userDetails.create_project_Externalata),
            ataInternal: Number(this.userDetails.create_project_Internalata),
            ataExternal2: Number(this.projectUserDetails.Ata_External),
            ataInternal2: Number(this.projectUserDetails.Ata_Internal)
        }

        if(this.type == 'external') {
            if ((permissions.ataExternal && this.userDetails.role_name == this.adminRole /*'Administrator'*/) || permissions.ataExternal2) {
                status = 1;
            }
        }else {
            if ((permissions.ataInternal && this.userDetails.role_name == this.adminRole /*'Administrator'*/) || permissions.ataInternal2) {
                status = 1;
            }
        }

        if (this.ata.AtaTable != "ata_become_external" && this.editAta && status) {
          this.counter++;
          this.usersService.enableUpdate("Ata", this.ata.ATAID, this.counter);

          let obj = {
            ataId: this.ata.ATAID,
            url: this.router.url,
            type: "Ata",
          };

          this.cronService.setObject(obj);
          const type = this.createForm.get("paymentType").value;
          this.setAtaTypes(type);
        }
    }

    allowEditAta() {
        let status = false;
        if(this.userDetails.create_project_Ata || this.userDetails) {

        const permissions = {
            ataExternal: Number(this.userDetails.create_project_Externalata),
            ataInternal: Number(this.userDetails.create_project_Internalata),
            ataExternal2: Number(this.projectUserDetails.Ata_External),
            ataInternal2: Number(this.projectUserDetails.Ata_Internal)
        }

            if(this.type == 'external') {
              if ((permissions.ataExternal && this.userDetails.role_name == this.adminRole /* 'Administrator'*/) || permissions.ataExternal2) {
                  status = true;
              }
            }

            if(this.type == 'internal') {
              if ((permissions.ataInternal && this.userDetails.role_name == this.adminRole /* 'Administrator'*/) || permissions.ataInternal2) {
                  status = true;
              }
            }
        }
        return status;
    }

    paymentTypeChanged() {
        const type = this.createForm.get("paymentType").value;
        this.setAtaTypes(type, true);

        if (type == 1) {
            this.createForm.get("paymentTypeName").patchValue("Löpande räkning");
        } else if (type == 2) {
            this.createForm.get("paymentTypeName").patchValue("Fast pris");
        } else if (type == 3) {
            this.createForm.get("paymentTypeName").patchValue("Enl. á-prislista");
        } else if (type == 4) {
            this.createForm.get("paymentTypeName").patchValue("Riktkostnad");
        } else {
            this.createForm.get("paymentTypeName").patchValue("UNKNOWN");
        }
    }

    getReloadAtaPDF() {
      this.getReloadAtaPDFSub = this.ataInfoService
        .getReloadAtaPDF()
        .subscribe((status) => {
          if (status) {
            this.load_data = true;
            this.reloadAta();
          }
      });
  }

  setSelectedAtaType(event) {
    this.createForm.get("AtaType").setValue(event);
  }
}
