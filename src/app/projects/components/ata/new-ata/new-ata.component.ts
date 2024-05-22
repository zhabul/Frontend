import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { DecimalPipe } from "@angular/common";
import { AtaService } from "src/app/core/services/ata.service";
import { AppService } from "src/app/core/services/app.service";
import { TranslateService } from "@ngx-translate/core";
import { GeneralsService } from "src/app/core/services/generals.service";
import { ProjectsService } from "src/app/core/services/projects.service";
import { SuppliersService } from "src/app/core/services/suppliers.service";
import * as moment from "moment";
import { DomSanitizer } from "@angular/platform-browser";
import { ImageModalUtility } from "src/app/projects/components/image-modal/image-modal-utility.service";
import { HttpEventType } from "@angular/common/http";
import { FileStorageService } from "src/app/core/services/file-storage.service";
import { SelectDropdownWithPlusComponent } from "src/app/utility/dropdowns/select-dropdown-with-plus/select-dropdown-with-plus.component";

declare var $: any;

@Component({
    selector: "app-new-ata",
    templateUrl: "./new-ata.component.html",
    styleUrls: [
        "./new-ata.component.css",
        "../../../../utility/image-preview.css",
    ],
    providers: [ImageModalUtility],
})
export class NewAtaComponent implements OnInit {

    @ViewChild(SelectDropdownWithPlusComponent) childComponent: SelectDropdownWithPlusComponent;

    public createForm: FormGroup;
    public project: any;
    public SelectStatus = false;
    public ataStatuses: any[];
    public documents = [];
    public language = "en";
    public message: any;
    public messageErr: any;
    public messageCont: any;
    public showPdfPreview = false;
    public AtaTypesServer: any[];
    public AtaTypes: any[];
    public showAddArticleAdditionalWorkForm = false;
    public showAddArticleMaterialForm = false;
    public showAddArticleOtherForm = false;
    public childAtas: any[] = [];
    public units: any;
    public enabledAccounts;
    public Number = Number;
    public userDetails: any;
    public generalImage;
    public nextAtaNumber;
    public materialProperties = [];
    public getDebitForms = [];
    public showAdditionalWorkTable = false;
    public showMaterialTable = false;
    public showOtherTable = false;
    public showSupplierInvoiceModal = false;
    public supplierInvoices = [];
    public client_workers = [];
    public clientContacts = [];
    public dropdownSettings;
    public emptyArticle = {
        id: "",
        Name: "",
        Quantity: "",
        Unit: "",
        Price: "",
        Deduct: "",
        Total: "",
        Account: "",
    };
    public chooseFile = false;
    public uploadMessage = "";
    public files = [];
    public spinner = false;
    public disabledButton = true;
    public totalSum = "0.00";
    public articlesMaterialProjectDeduct = 0;
    public articlesOtherProjectDeduct = 0;
    public type;
    public showPdf: boolean = false;
    public currentAttachmentPdf = null;
    public currentAttachmentImage = null;
    public showAttachmentImage = false;
    public wrapper: any;
    public viewer: any;
    public rotateValue: number = 0;
    public selectOpen: boolean = false;
    public projects_for_select: any = [];
    public nextNumber = 1;
    public buttonToggle = false;
    public buttonName = "Project Management";
    public currentClass = "title-new-project";
    public showSubProject = false;
    public contacts = [];
    public buttonToggleDots = false;
    public buttonToggleSend = false;
    project_id;
    public projects = [];
    public selectedTab = 0;
    public selectedTabFromAta = Number(sessionStorage.getItem("selectedTab")) || '0';
    public setHeight = {
        'height' : 'calc(100vh - 132px - 0px)'
    };
    newAtaSub: any;
    progress: number = 0;
    public typeFrom = '';
    public selected_article;
    public projectUserDetails;

    get get_last_email_log_but_first_client() {
        let today = new Date();
        let object = {
            EMAIL_LOG_DATE: today.toISOString().split("T")[0],
            email_log_client_worker: "",
        };
        return object;
    }

    infoObject = {
        content_type: "Ata",
        content_id: null,
        type: "Project",
        type_id: null,
    };
    key = ["-1"];
    albums: any = {};

    updateAlbums(event) {
        this.albums = event;
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

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private ataService: AtaService,
        private toastr: ToastrService,
        private appService: AppService,
        private translate: TranslateService,
        private generalsService: GeneralsService,
        private projectsService: ProjectsService,
        private supplierService: SuppliersService,
        public sanitizer: DomSanitizer,
        private decimal: DecimalPipe,
        private imageModalUtility: ImageModalUtility,
        private fsService: FileStorageService,
    ) { }

    async ngOnInit() {

        this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
        this.project_id = this.route.snapshot.params.id;
        this.projectUserDetails = this.route.snapshot.data["projectUserDetails"];
        this.route.queryParamMap.subscribe((params) => {
            this.type = params.get("type") || null;
            this.nextNumber = Number(params.get("nextNumber")) || null;

            const permissions = {
                ataExternal: Number(this.userDetails.show_project_Externalata),
                ataInternal: Number(this.userDetails.show_project_Internalata),
                ataExternal2: Number(this.projectUserDetails.Ata_External),
                ataInternal2: Number(this.projectUserDetails.Ata_Internal)
            }

            if(this.type == 0) {
                if (!permissions.ataExternal && !permissions.ataExternal2) {
                    this.router.navigate(["projects", "view", this.project_id]);
                }
            }

            if(this.type == 1) {
                if (!permissions.ataInternal && !permissions.ataInternal2) {
                    this.router.navigate(["projects", "view", this.project_id]);
                }
            }
        });

        this.language = sessionStorage.getItem("lang");
        this.dropdownSettings = {
            singleSelection: false,
            idField: "Id",
            textField: "Name",
            selectAllText: this.translate.instant("Select All"),
            unSelectAllText: this.translate.instant("Unselect All"),
            itemsShowLimit: 0,
            allowSearchFilter: false,
            noDataAvailablePlaceholderText:
                this.translate.instant("No data available"),
            searchPlaceholderText: this.translate.instant("Search"),
        };
        this.project = this.route.snapshot.data["project"];
        let parent_project = this.route.snapshot.data["parent_project"];
        if(parent_project) {
            this.projects.push(parent_project);
        }else {
            this.projects.push(this.project);
        }

        this.getDebitForm();
        let data_key = {
            key: "Logo",
        };
        this.generalsService.getSingleGeneralByKey(data_key).subscribe((res: any) => {
            this.generalImage = res["data"][0]["value"];
        });
        this.projects = JSON.parse(JSON.stringify(this.projects));
        this.projects.map((p) => {
          p["expanded"] = false;
          p["visible"] = true;
          p["l_status"] = 0;
          p["branch"] = 0;
          p["noExpand"] = p["childs"] == 0;
        });

        this.projectsService
        .getAttestClientWorkers(this.project.id)
        .then((res) => {
          this.client_workers = res;
        });

        this.showSubProject = this.userDetails.create_project_Global == 0 ? false : true;

        this.articlesMaterialProjectDeduct = this.project["ata_charge_material"];
        this.articlesOtherProjectDeduct = this.project["ata_charge_ue"];
        this.units = this.route.snapshot.data["units"];

        this.enabledAccounts = this.route.snapshot.data["enabledAccounts"];
        // this.client_workers = this.route.snapshot.data["client_workers"];
        this.materialProperties = this.route.snapshot.data["materialProperties"];

        this.ataService.getNextAtaNumber(this.project.id).subscribe((res) => {
            if (res["status"]) {
                this.nextAtaNumber = res["nextNumber"];
            }
        });

        this.appService.setBackRoute("/projects/view/" + this.project.id);
        this.appService.setShowAddButton = false;
        this.AtaTypesServer = this.route.snapshot.data["type_atas"];
        if(this.project.debit_Id != 2) {
            this.AtaTypesServer = this.AtaTypesServer.filter((type) => {
                return type.id != "4";
            });
        }

        this.getAtaStatuses();
        const startDateFormat =
            "YYYY-MM-DD " + (this.language === "en" ? "[Week]" : "[Vecka]") + " W";
        this.setAtaTypes(1);

        this.createForm = this.fb.group({
            Name: ["", [Validators.required, Validators.maxLength(55)]],
            AtaType: [this.AtaTypes[0].id, [Validators.required]],
            StartDate: [moment(new Date()).format(startDateFormat), [Validators.required]],
            DueDate: ["", [Validators.required]],
            ProjectID: ["", []],
            street: [this.project.clientStreet, []],
            city: [this.project.clientCity, []],
            zip: [this.project.clientZip, []],
            clientName: [this.project.clientName, []],
            briefDescription: ["", Validators.maxLength(500)],
            articlesAdditionalWork: this.fb.array([
                this.fb.group(this.addEmptyArticle("articlesAdditionalWork")),
                this.fb.group(this.addEmptyArticle("articlesAdditionalWork")),
            ]),
            articlesMaterial: this.fb.array([
                this.fb.group(this.addEmptyArticle("articlesMaterial")),
                this.fb.group(this.addEmptyArticle("articlesMaterial")),
            ]),
            articlesOther: this.fb.array([
                this.fb.group(this.addEmptyArticle("articlesOther")),
                this.fb.group(this.addEmptyArticle("articlesOther")),
            ]),
            paymentType: ["1", [Validators.required]],
            paymentTypeName: ["Löpande räkning", [Validators.required]],
            Type: [this.type == "1" ? "0" : "1"],
            invoicedTotal: "0.00",
            totallyWorkedUp: "0.00",
            Status: 0,
            labeling_requirements : ["", []]
        });

        const datepickerOptions = {
            format: "yyyy-mm-dd",
            calendarWeeks: true,
            autoclose: true,
            language: this.language,
            todayHighlight: true,
            currentWeek: true,
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

        this.projectsService
            .getSupplierInoviceFromDatabaseResolverService(this.project.id)
            .then((res) => {
                this.supplierService.getCompletedSupplierInvoices().subscribe((res2) => {
                    if (res["invoices"]) {
                        this.supplierInvoices = res["invoices"].filter((invoice) =>
                            res2["data"].every((completed) => completed != invoice.OrderNR)
                        );
                    }
                });
            });

      this.get_project_and_sub_project_name_id_and_custom_name_by_project_id();
      document.addEventListener("keydown", this.getSelected.bind(this));
    }

    ngOnDestroy() {
        if (this.newAtaSub) {
            this.newAtaSub.unsubscribe();
        }
    }

    getSelected(event) {

        if(event.target['dataset'] && event.target['dataset'].selected_article) {
           this.selected_article = event.target['dataset'].selected_article;
        }

        if(event.srcElement.localName == 'textarea') {
          return;
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

            event.preventDefault()
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

    private get_project_and_sub_project_name_id_and_custom_name_by_project_id() {
      let project_id =
        this.project.parent > 0 ? this.project.parent : this.project.id;

      this.projectsService
        .get_project_and_sub_project_name_id_and_custom_name_by_project_id(
          project_id
        )
        .then((res) => {

          if (res["status"]) this.projects_for_select = res["data"];
        });
    }

    setAtaTypes(payment_type, payment_tab_change = false) {

        if (payment_tab_change) {
            this.createForm.get('AtaType').patchValue('1');
        }

        if (payment_type == 1) {
            this.AtaTypes = this.AtaTypesServer.filter((type) => {
                return type.id != "3";
            });
        } else if (payment_type == 2) {
            this.AtaTypes = this.AtaTypesServer.filter((type) => {
                return type.id != "4";
            });
        }else {
            this.AtaTypes = this.AtaTypesServer;
        }
    }

    getAtaStatuses() {
        this.ataService.getAtaStatuses().subscribe((response) => {
            if (response["status"]) {
                this.ataStatuses = response["data"];
            }
            return null;
        });
    }

    addRow(formGroup, table, index = -1) {
/*
      const i = formGroup.controls.findIndex(
            (article) => { return article.value.Name == ""}
        );
*/


        let status = false;

        if(formGroup.value.length -1 == index) {
            status = true;
        }

        if(status) {
            formGroup.push(this.fb.group(this.addEmptyArticle(table)));
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
        let total: any = 0;
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

        const Deduct = this.round_number(Number(
          formGroup.controls[i].value.Deduct.toString()
            .replace(/\s/g, "")
            .replace(",", ".")
        ), 2);

        if (ataType == "3" && Quantity > 0) {
            Quantity = Number(-1 * Quantity);
        }

        (<FormGroup>formGroup.controls[i]).controls["Quantity"].patchValue(Quantity);

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
        (<FormGroup>formGroup.controls[i]).controls["Total"].patchValue(total);
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

    async createAta(param, action=null) {

        //const valid = this.validateForm();
        let emails_for_send = [];

        if (this.createForm.valid) {

            if(param){
              if (this.contacts.length < 1) {
                return this.toastr.info(
                  this.translate.instant(
                    "You first need to select an email where to send ata"
                  ) + ".",
                  this.translate.instant("Info")
                );
              }

              this.client_workers.forEach((cw, index) => {
                for (let i = 0; i < this.contacts.length; i++) {
                  const contact = this.contacts[i];
                  if (contact.Id == cw.Id) {
                    emails_for_send.push(cw);
                    break;
                  }
                }
              });
            }

            this.spinner = true;
            const data = this.createForm.value;
            await this.ensureRemoveLastEmptyRow(data['articlesAdditionalWork']);
            await this.ensureRemoveLastEmptyRow(data['articlesMaterial']);
            await this.ensureRemoveLastEmptyRow(data['articlesOther']);

            data.contacts = this.clientContacts;
            data.Ata = "1";
            data.project = this.project;
            data.generalImage = this.generalImage;
            data.Deviation = "0";
            data.nextAtaNumber = this.nextAtaNumber;
            data.fullname =
                this.userDetails.firstname + " " + this.userDetails.lastname;
            data.Status = 0;
            data.wrId = 0;
            data.Url = this.files;
            data.createWithSend = param;
            data.contacts = param ? emails_for_send : [];
            data.sendCopy = false;
            data.sendReminder = false;
            data.Documents = [];
            data.action = action ? action : '';
        /*
            data.articlesAdditionalWork = data.articlesAdditionalWork.filter(
                function (row) {
                    return row.Name != "";
                }
            );
        */
            data.articlesAdditionalWork = data.articlesAdditionalWork.map(function (
                article
            ) {
                article.Quantity = Number(
                    article.Quantity.toString().replace(/\s/g, "").replace(",", ".")
                );
                article.Price = Number(
                    article.Price.toString().replace(/\s/g, "").replace(",", ".")
                );
                return article;
            });
        /*
            data.articlesMaterial = data.articlesMaterial.filter(function (row) {
                return row.Name != "";
            });
        */
            data.articlesMaterial = data.articlesMaterial.map(function (article) {
                article.Quantity = Number(
                    article.Quantity.toString().replace(/\s/g, "").replace(",", ".")
                );
                article.Price = Number(
                    article.Price.toString().replace(/\s/g, "").replace(",", ".")
                );
                return article;
            });
        /*
            data.articlesOther = data.articlesOther.filter(function (row) {
                return row.Name != "";
            });
        */
            data.articlesOther = data.articlesOther.map(function (article) {
                article.Quantity = Number(
                    article.Quantity.toString().replace(/\s/g, "").replace(",", ".")
                );
                article.Price = Number(
                    article.Price.toString().replace(/\s/g, "").replace(",", ".")
                );
                return article;
            });

            this.progress = 0;
            const albumFiles = this.imageModalUtility.getAlbumFiles(this.albums);

            this.fsService.mergeFilesAndAlbums(albumFiles).then((response: any) => {
                data.images = [];
                data.documents = [];

                if(response != null) {
                    data.images = response.images;
                    data.documents = response.pdfs;
                }

                this.sendAtaReqeust(data);

            });
        }else{
          return this.toastr.info(
            this.translate.instant(
              "You first need to fill required fields!"
            ) ,
            this.translate.instant("Info")
          );
        }
    }

    private sendAtaReqeust(data: any) {

        this.ataService.createAta(data).subscribe({
            next: (res) => {

              this.spinner = true;
                if (res.type === HttpEventType.Response) {
                    const response = res["body"];
                    this.progress = 100;
                    if (response["status"]) {
                        this.toastr.success(
                            this.translate.instant("You have successfully created Äta!"),
                            this.translate.instant("Success")
                        );
                        this.progress = 0;
                        this.setComeFromandRedirect();

                        this.router.navigate(
                            ["/projects/view/ata/modify-ata/", response["id"]],
                            { queryParams: { projectId: this.project.id , type: this.typeFrom} }
                        );
                    } else {


                        this.toastr.error(
                            this.translate.instant("There was an error with creating Ata."),
                            this.translate.instant("Error")
                        );
                        this.spinner = false;
                        this.progress = 0;
                    }
                }

                if (res.type === HttpEventType.UploadProgress) {
                    let percentDone = Math.round((100 * res.loaded) / res.total);
                    if (percentDone === 100) {
                        percentDone = percentDone - 50;
                    }

                    this.progress = percentDone;
                }
            },
            error: (error) => {
                this.toastr.error(
                    this.translate.instant("There was an error with creating Ata."),
                    this.translate.instant("Error")
                );
                this.spinner = false;
            }
        });
    }

    setComeFromandRedirect(){

        if(this.selectedTabFromAta == '0')
        {
            this.typeFrom = 'external'
        }
        if(this.selectedTabFromAta == '1')
        {
            this.typeFrom = 'internal'
        }

    }
    validateForm() {
        let valid = true;
        this.articlesAdditionalWork.controls.forEach((row) => {
            if (
                (row.get("Quantity").value != "" || row.get("Price").value != "") &&
                row.get("Name").value == ""
            ) {
                row.get("Name").setValidators([Validators.required]);
                row.get("Name").updateValueAndValidity();
                valid = false;
            }
        });

        this.articlesMaterial.controls.forEach((row) => {
            if (
                (row.get("Quantity").value != "" || row.get("Price").value != "") &&
                row.get("Name").value == ""
            ) {
                row.get("Name").setValidators([Validators.required]);
                row.get("Name").updateValueAndValidity();
                valid = false;
            }
        });

        this.articlesOther.controls.forEach((row) => {
            if (
                (row.get("Quantity").value != "" || row.get("Price").value != "") &&
                row.get("Name").value == ""
            ) {
                row.get("Name").setValidators([Validators.required]);
                row.get("Name").updateValueAndValidity();
                valid = false;
            }
        });

        return valid;
    }

    togglePdfPreview() {
        this.showPdfPreview = !this.showPdfPreview;
    }

    toggleAddArticleAdditionalWorkForm() {
        this.showAddArticleAdditionalWorkForm =
            !this.showAddArticleAdditionalWorkForm;
    }

    removeRow(index, formGroup, table) {
        if (
            formGroup.controls[index].value.Name == "" &&
            formGroup.value.filter((article) => article.Name == "").length == 1
        ) {
            return;
        }

        if (formGroup.controls.length > 1) {
            formGroup.controls.splice(index, 1);
            formGroup.value.splice(index, 1);
        } else {
            formGroup.controls[0].setValue(this.addEmptyArticle(table));
        }
    }

    getDebitForm() {
        this.projectsService
            .getDebitFormForAta(this.project.debit_Id, true)
            .then((res) => {
                this.getDebitForms = res["data"].filter((form)=>{return form.Id != 6});
            });
    }

    getChildrenAta(ata) {
        this.ataService.getChildrenAta(ata.id).subscribe((response) => {
            if (response["status"] == true) this.childAtas = response["data"];
            else this.childAtas = null;
        });
    }

    toggleTable(table) {
        this[table] = !this[table];
    }

    openSupplierInvoiceModal() {
        this.showSupplierInvoiceModal = true;
    }

    closeSupplierInvoiceModal() {
        this.showSupplierInvoiceModal = false;
    }

    supplierInvoiceChecked(value, index) {
        this.supplierInvoices[index].isChecked = value;
        const invoice = this.supplierInvoices[index];

        if (value) {
            this.articlesMaterial.insert(
                0,
                this.fb.group({
                    id: "",
                    Name: invoice.OrderNR + "-" + invoice.SupplierName,
                    Quantity: 1,
                    Unit: "pieces",
                    Price: invoice.Total,
                    Deduct: "",
                    Total: parseInt(invoice.Total, 10).toFixed(2),
                    Account: "",
                    OrderNR: invoice.OrderNR,
                    importedFromFortnox: true,
                })
            );
        } else {
            const i = this.articlesMaterial.controls.findIndex(
                (invo) => invoice.OrderNR == invo.get("OrderNR").value
            );
            this.articlesMaterial.controls.splice(i, 1);
        }
    }

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
                        file: reader.result,
                        Name: (file as any).name,
                    });
                };
            });
        } else {
            this.chooseFile = false;
        }
        this.uploadMessage = this.uploadMessage.slice(0, -2);
    }

    removeDocument(index, type) {
        this[type].splice(index, 1);
    }

    onChildObjectEvent(receivedObject: any) {
      const { id, Name } = receivedObject;
      this.setAtaTypes(id);

      this.createForm.get('AtaType').setValue(Name);
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

    get getArticlesAdditionalWork() {
        return this.articlesAdditionalWork.value.filter(
            (article) => article.Name != ""
        );
    }

    get getArticlesMaterial() {
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

    addEmptyArticle(table) {

        let article = this.emptyArticle;
        if (table == "articlesAdditionalWork") {
            article.Deduct = '0';
        } else if (table == "articlesMaterial") {
            article.Deduct = this.articlesMaterialProjectDeduct.toString();
        } else if (table == "articlesOther") {
            article.Deduct = this.articlesOtherProjectDeduct.toString();
        }
        return article;
    }

    toggleAttachmentImage(e = null) {
        if (e) {
            if (e.target.id !== "looksLikeModal") {
                return;
            }
        }
        this.showAttachmentImage = !this.showAttachmentImage;
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
    matchInputNumber(e, b) {
        const key = e.key;
        const match = key.match("^[0-9]+$");
        if (!match) {
            e.preventDefault();
        }
    }

    changeFormat(i, name, field) {
        const form: any = this.createForm.get(name);
        const control = form.controls[i];
        const inputField = control;
        const inputValue = inputField.value;

        inputField.patchValue({
            ...inputValue,
            [field]: this.decimal.transform(inputValue[field], "1.2-2", "fr"),
        });
    }

    toggleselectOpen(e) {
      this.selectOpen = !this.selectOpen;
      e.stopPropagation();
    }

    closeSelect() {
      this.selectOpen = false;
    }

    renderText() {

      if (this.type == 1)
        return 'Internal ata';
      else
        return 'External ata';
    }

    buttonNameToggle(event) {
      this.buttonToggle = !this.buttonToggle;
      if(this.buttonToggle){
        this.setHeight.height = 'calc(100vh - 470px - 0px)'
    }else{
        this.setHeight.height = 'calc(100vh - 132px - 0px)'
    }
    }

    selectProject(project_id) {
      this.router.navigate(["projects", "view", project_id]);
    }


    enter() {
      this.currentClass = "title-new-project-hover";
    }

    leave() {
      this.currentClass = "title-new-project";
    }

    printAta() {
      // this.buttonToggleSend = !this.buttonToggleSend;
    }

    dropSend() {
      this.buttonToggleSend = !this.buttonToggleSend;
    }

    optionsDownDiv(){
      this.buttonToggleDots = !this.buttonToggleDots;
    }

    shutDown() {
    //   this.buttonToggleSend = false;
      this.spinner = false;
    }

    //event,
    buttonNameSummary(worker) {

      // this.contacts.push(worker);
      this.contacts = this.contacts.concat(worker);
      // event.stopPropagation();

      // if (worker) {
      //   // this.buttonToggleSend = true;
      //   if (
      //     this.contacts.some((selectedWorker) => selectedWorker.Id == worker.Id)
      //   ) {
      //     this.contacts.splice(this.contacts.indexOf(worker), 1);
      //   }else{
      //     this.contacts.push(worker);
      //   }
      // } //else {
      //   // this.buttonToggleSend = !this.buttonToggleSend;
      //   // if (this.buttonToggleSend == true) {
      //   //   this.buttonName = "Hide";
      //   // } else {
      //   //   this.buttonName = "";
      //   // }
      // //}
    }

    // checkIfContactSelected(contact) {
    //   if (
    //     this.contacts.some((selectedWorker) => selectedWorker.Id == contact.Id)
    //   ) {
    //     return true;
    //   } else return false;
    // }
    closeToggle(num){
        if(num == 1){
            this.buttonToggleSend = !this.buttonToggleSend;
        }else if(num == 2){
            this.buttonToggleDots = !this.buttonToggleDots;
        }
    }


    //Dodano za DropDown Send/Print
    public user:string;
    public SelectedUser($event: any):void{
      this.clientContacts = $event;
    }

    SendClick(){
      //this.createAta(true);
    }
    //End

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

    autoGrowTextZone(e) {
        e.target.style.height = (e.target.scrollHeight)+"px";
      }
}
