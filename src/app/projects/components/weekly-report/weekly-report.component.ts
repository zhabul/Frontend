import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import * as moment from "moment";
import { ProjectsService } from "src/app/core/services/projects.service";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { MaterialsService } from "src/app/core/services/materials.service";
import { FortnoxApiService } from "src/app/core/services/fortnoxApi.service";
import { ToastrService } from "ngx-toastr";
import * as printJS from "print-js";
import { GeneralsService } from "src/app/core/services/generals.service";
import { Subscription } from "rxjs";
import { AtaService } from "src/app/core/services/ata.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ImageModalComponent } from "src/app/projects/components/image-modal/image-modal.component";
import { DomSanitizer } from "@angular/platform-browser";
import { ImageModalUtility } from "src/app/projects/components/image-modal/image-modal-utility.service";
import { Subject } from "rxjs";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { BASE_URL } from "src/app/config";
import { PdfModalPreviewComponent } from "src/app/projects/components/pdf-modal-preview/pdf-modal-preview.component";
import { FileStorageService } from "src/app/core/services/file-storage.service";
import { WeeklyReportsForSelectComponent } from 'src/app/external/components/weekly-reports-for-select/weekly-reports-for-select.component';

declare var $;

@Component({
    selector: "app-weekly-report",
    templateUrl: "./weekly-report.component.html",
    styleUrls: [
        "./weekly-report.component.css",
        "../../../utility/image-preview.css",
        "../image-modal/image-modal.component.css",
    ],
    providers: [ImageModalUtility],
})
export class WeeklyReportComponent implements OnInit, OnDestroy {
    @Input() currentTab = null;

    public articles: string[] = ["AdditionalWork", "Material", "Other"];
    public articleNames: string[] = ["Additional work", "Material", "UE/Other"];

    public units = [];
    public enabledAccounts = [];

    public reports: any[] = [];

    public showAdditionalWorkTable = false;
    public showMaterialTable = false;
    public showOtherTable = false;
    public showSupplierInvoiceModal = false;
    public allowNewWR = true;
    public supplierInvoices;

    public activeReportIndex: number = 0;
    public activeReportRevisionIndex: number = -1;

    public changed = false;
    public spinner = false;
    public whichPdfPreview = "weeklyreport";

    public showPdfPreview = false;
    public get_last_email_log_but_first_client_wr = [];
    public generalImage = "";
    public dropdownSettings;
    public additionalWorkMoments = [];
    public client_workers = [];
    public contacts = [];
    // public logs = [];
    public clientAttestHistory = [];
    public selectedTab = 0;
    public projectId = this.route.snapshot.params.id;
    public showWrImages: boolean = false;
    public save_in_progress: boolean = false;
    public materialProperties = [];

    public contacts_documents = [];

    public weeks: any[] = [];

    public formValues: any = {
        StartDate: "",
        street: "",
        zip: "",
        city: "",
        DueDate: "",
    };

    public userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

    public project: any = {
        CustomName: "",
        name: "",
    };
    public language;
    public subscription: Subscription;
    public weeksInvoiced: any[] = [];
    public selectOpen: boolean = false;
    public selectOpenInvoiced: boolean = false;
    public selectStartedValue = "Not Invoiced";
    public selectStartedValueInvoiced = "Invoiced";
    public selectStartedImage: any = "";
    public newWRDisabled = false;
    public currentWeek = moment().isoWeek();
    public articlesMaterialProjectDeduct = 0;
    public articlesOtherProjectDeduct = 0;
    public isEnable: boolean = true;
    public numberOfInvoices: number = 0;
    public initiallySelectedWeeklyReport: any = -1;
    public selectedWeeklyReport: any = null;
    public reminderCheckboxDU = false;
    public current_week_number: any;
    public existing_empty_weekly_report: boolean = false;
    public showPdf: boolean = false;
    public rotateValue: number = 0;
    public currentAttachmentImage = null;
    public showAttachmentImage = false;
    public currentAttachmentPdf = null;
    public wrapper: any;
    public viewer: any;
    public sendCopy: boolean = false;
    public sendBtnDisabled: boolean = false;
    public rowDeleted = false;
    public current_user: any = JSON.parse(sessionStorage.getItem("userDetails"));
    public pdfs_preview: any = [];
    public pdfs_preview_pom: any = [];
    public spinner_from_print:boolean = false;
    public logs: Record<string, any[]> = {};

    swiperSupplierInvoice = {
        images: [],
        active: -1,
        album: -2,
        index: -1,
        parent: null,
    };

    swiper = {
        images: [],
        active: -1,
        album: -2,
        index: -1,
        parent: null,
    };

    infoObjectDU = {
        content_type: "DU",
        content_id: "",
        type: "Project",
        type_id: "",
    };
    albums: any[] = [];

    $_clearFiles: Subject<void> = new Subject<void>();

    updateAlbumsAta(event) {
        this.albums = event;
    }

    getAlbumKeys() {
        let keys = [];
        const activeDU = this.getActiveDU();
        if (activeDU) {
            const files = activeDU["files"];
            keys = Object.keys(files).sort(function (a, b) {
                return Number(b) - Number(a);
            });
        }
        return keys;
    }

    getAlbumFiles(albumKey, type) {
        const activeDU = this.getActiveDU();
        const files = activeDU["files"][albumKey][type];
        return files;
    }

    getAlbumDescription(albumKey) {
        const activeDU = this.getActiveDU();
        let description = "";
        if (activeDU) {
            description = activeDU["files"][albumKey]["description"];
        }
        return description;
    }

    /* IMAGE MODAL */

    constructor(
        private projectService: ProjectsService,
        private ataService: AtaService,
        private route: ActivatedRoute,
        private translate: TranslateService,
        private materialsService: MaterialsService,
        private fortnoxApi: FortnoxApiService,
        private toastr: ToastrService,
        private generalsService: GeneralsService,
        private dialog: MatDialog,
        public sanitizer: DomSanitizer,
        private imageModalUtility: ImageModalUtility,
        private fsService: FileStorageService,
    ) {
        this.route.queryParamMap.subscribe((params) => {
            this.initiallySelectedWeeklyReport = params.get("weeklyreport") || -1;
        });
    }

    ngOnInit() {
        this.current_week_number = moment().week();
        this.language = sessionStorage.getItem("lang");
        // eslint-disable-next-line rxjs/no-ignored-observable
        this.translate.use(this.language);

        this.project = this.route.snapshot.data.project;

        this.infoObjectDU.type_id = this.project.id;

        this.articlesMaterialProjectDeduct = this.project["chargeMaterial"];
        this.articlesOtherProjectDeduct = this.project["chargeUE"];

        this.projectService
            .getAttestClientWorkers(this.route.snapshot.params.id)
            .then((res) => {
                this.client_workers = res;
            });

        this.projectService
            .getEmailLogsForWeeklyReport(this.route.snapshot.params.id)
            .then((res) => {
                if (res["status"]) {
                    // this.logs = res["data"];

                    function formatDateTime(dateTimeStr: string | null) {
                      if (!dateTimeStr) {
                        return null;
                      }

                      const date = new Date(dateTimeStr);
                      const year = date.getFullYear();
                      const month = (date.getMonth() + 1).toString().padStart(2, '0');
                      const day = date.getDate().toString().padStart(2, '0');
                      const hours = date.getHours().toString().padStart(2, '0');
                      const minutes = date.getMinutes().toString().padStart(2, '0');

                      return `${year}-${month}-${day} ${hours}:${minutes}`;
                    }

                    this.logs = {};

                    try {
                      const emailLogsData = res["data"];

                      emailLogsData.sort((a, b) => {
                        return b.logName.localeCompare(a.logName, undefined, { numeric: true });
                      });

                      emailLogsData.forEach((item) => {
                        const logName = item.logName;

                        if (!this.logs[logName]) {
                          this.logs[logName] = [];
                        }

                        const combinedArray =  [];

                        const projectPdfURLs = item.ProjectPdfURL || [];
                        const workPdfURLs = item.WorkPdfURL || [];
                        const materialPdfURLs = item.MaterialPdfURL || [];
                        const otherPdfURLs = item.OtherPdfURL || [];
                        const attachmentPDFURLs = item.AttachmentPDFURL || [];

                        combinedArray.push(...projectPdfURLs);

                        if (workPdfURLs.length > 0) {
                          combinedArray.push(...workPdfURLs);
                        }

                        if (materialPdfURLs.length > 0) {
                          combinedArray.push(...materialPdfURLs);
                        }

                        if (otherPdfURLs.length > 0) {
                          combinedArray.push(...otherPdfURLs);
                        }

                        combinedArray.push(...attachmentPDFURLs);

                        this.logs[logName].push({
                            Status: item.Status,
                            StatusName: item.StatusName,
                            active: item.active,
                            Date: item.Date ? formatDateTime(item.Date) : null,
                            answerEmail: item.To,
                            sentFrom: item.From,
                            answerDate: item.Responded ? formatDateTime(item.Responded) : null,
                            group: item.Group,
                            show: true,
                            name: item.Name,
                            id: item.Id,
                            itemId: item.ItemID,
                            ItemType: item.ItemType,
                            manualReplay: item.manualReply,
                            files: combinedArray,
                            pdfs: [],
                            images: [],
                            reminder: item.reminder,
                          });
                        });

                    } catch (error) {
                      console.error('Greška prilikom dohvaćanja podataka:', error);
                    }
                }
            });

        this.projectService
            .getClientAttestHistory(this.route.snapshot.params.id, 0)
            .then((res) => {
                if (res["status"]) {
                    this.clientAttestHistory = res["data"];
                }
            });

        this.formValues = {
            Name: this.route.snapshot.data.project.name,
            StartDate: this.route.snapshot.data.project.StartDate,
            street: this.route.snapshot.data.project.clientStreet,
            zip: this.route.snapshot.data.project.clientZip,
            city: this.route.snapshot.data.project.clientCity,
            clientName: this.route.snapshot.data.project.clientName,
            DueDate: this.route.snapshot.data.project.EndDate,
            paymentTypeName: this.route.snapshot.data.project.debit_name,
            AuthorName: this.route.snapshot.data.project.AuthorName,
        };

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

        this.materialsService.getUnitsSortedByArticleType().subscribe((data) => {
            if (data) {
                this.units = data;
            }
        });

        let data = {
            key: "Logo",
        };

        this.generalsService.getSingleGeneralByKey(data).subscribe((res) => {
            if (res['status']) {
                this.generalImage = res['data'][0]['value'];
            }
        });

        const datepickerOptions = {
            format: "yyyy-mm-dd",
            calendarWeeks: true,
            autoclose: true,
            language: this.language,
            currentWeek: true,
            todayHighlight: true,
            currentWeekTransl: this.language === "en" ? "Week" : "Vecka",
            currentWeekSplitChar: "-",
            startDate: new Date(),
        };

        this.getSupplierInvoices();

        this.materialsService.getAllMaterialProperties().subscribe((data: any) => {
            if (data) {
                this.materialProperties = data;
            }
        });

        this.fortnoxApi.getAllEnabledAccounts().subscribe((enabledAccounts) => {
            if (enabledAccounts) {
                this.enabledAccounts = enabledAccounts;
            }
        });

        this.getWeeksThatHaveWeeklyReport();

        $("#weeklyReportDueDate")
            .datepicker(datepickerOptions)
            .on("changeDate", (ev) => {
                if (this.getActiveDU()) {
                    this.getActiveDU().WeeklyReportDueDate = ev.target.value;
                }
            })
            .on("blur", (e) => {
                e.target.value = this.getActiveDU().WeeklyReportDueDate;
            });

        if (this.getActiveDU() && this.getActiveDU().WeeklyReportDueDate) {
            $("#weeklyReportDueDate").datepicker(
                "setDate",
                this.getActiveDU().WeeklyReportDueDate.split(" ")[0]
            );
        }

        $(function () {
            $(document).on('click', 'input[type=text]', function () { this.select(); });
            $(document).on('click', 'input[type=checkbox]', function () { this.select(); });
            $(document).on('click', 'input[type=number]', function () { this.select(); });
        });

        this.checkStatus();
    }

    getUnitsByType(articleType) {
        return this.units[articleType];
    }

    onEnterPress($event, field?, firstField?, articleType?) {
        if ((firstField == "" || firstField == undefined) && field == "account") {
            let tables = document.querySelectorAll("fieldset");
            if (articleType == "AdditionalWork" && tables.length > 1) {
                let els = tables[1].getElementsByTagName("input")[0];
                els.select();
            } else if (tables.length > 1 && articleType == "Material") {
                tables[tables.length - 1];
                let els = tables[tables.length - 1].getElementsByTagName("input")[0];
                els.select();
            }
        } else {
            if (field == "account") {
                let parentElement = $event.target.parentElement.parentElement;
                let nextParentEl = this.getNextParentElement(parentElement);
                let nextEL;
                for (let i = 0; i < nextParentEl.childNodes.length; i++) {
                    if (nextParentEl.childNodes[i].nodeName == "TD") {
                        nextEL = nextParentEl.childNodes[i];
                        nextEL.childNodes.forEach((node) => {
                            if (node.nodeName == "INPUT" || node.nodeName == "SELECT") {
                                let foc = node as HTMLInputElement;
                                node.nodeName == "INPUT" ? foc.select() : foc.focus();
                            }
                        });
                        break;
                    }
                }
            } else {
                let parentElement = $event.target.parentElement;
                let nextEl = this.getNextParentElement(parentElement);
                let elToFocus;
                nextEl.childNodes.forEach((node) => {
                    if (node.nodeName == "INPUT" || node.nodeName == "SELECT") {
                        elToFocus = node;
                        let foc = elToFocus as HTMLInputElement;
                        node.nodeName == "INPUT" ? foc.select() : foc.focus();
                    } else {
                        nextEl =
                            field == "deduct"
                                ? parentElement.nextSibling.nextSibling
                                : parentElement.nextSibling;
                        nextEl.childNodes.forEach((node) => {
                            if (node.nodeName == "INPUT" || node.nodeName == "SELECT") {
                                elToFocus = node;
                                let foc = elToFocus as HTMLInputElement;
                                node.nodeName == "INPUT" ? foc.select() : foc.focus();
                            }
                        });
                    }
                });
            }
        }
    }

    getNextParentElement(parentElement) {
        return parentElement.nextSibling.hasChildNodes()
            ? parentElement.nextSibling
            : parentElement.nextSibling.nextSibling;
    }

    getComment() {
        if (this.reports.length > 0) {
            return this.activeReportRevisionIndex != -1
                ? this.reports[this.activeReportIndex].revisions[
                    this.activeReportRevisionIndex
                ].comment
                : this.reports[this.activeReportIndex].comment;
        }
    }

    setActiveDu(index) {
        this.selectedTab = 0;
        this.pdfs_preview = [];
        this.pdfs_preview_pom = [];
        if (this.reports.length > 0) {
            this.selectedWeeklyReport = {
                week: this.reports[index].name.split("DU-V")[1],
            };

            this.showAdditionalWorkTable =
                this.reports[index].articles.AdditionalWork.filter((a) => a.Name != "")
                    .length > 0;
            this.showMaterialTable =
                this.reports[index].articles.Material.filter((a) => a.Name != "")
                    .length > 0 || this.supplierInvoices.length > 0;
            this.showOtherTable =
                this.reports[index].articles.Other.filter((a) => a.Name != "").length >
                0;
        }

        this.activeReportIndex = index;
        this.activeReportRevisionIndex = -1;
        this.getAllMomentsForWeeklyReport();

        const datepickerOptions = {
            format: "yyyy-mm-dd",
            calendarWeeks: true,
            autoclose: true,
            language: this.language,
            currentWeek: true,
            todayHighlight: true,
            currentWeekTransl: this.language === "en" ? "Week" : "Vecka",
            currentWeekSplitChar: "-",
            startDate: new Date(),
        };

        if (this.getActiveDU() && this.getActiveDU().WeeklyReportDueDate) {
         /*   if (this.getActiveDU().status == 0 || this.getActiveDU().status == 1) {
                this.ataService.updateWeeklyReportPdf(
                    this.getActiveDU().id,
                    null,
                    this.sendCopy
                );
            }
*/
            $("#weeklyReportDueDate").datepicker(datepickerOptions);
            $("#weeklyReportDueDate").datepicker(
                "setDate",
                this.getActiveDU().WeeklyReportDueDate.split(" ")[0]
            );
        } else {
            $("#weeklyReportDueDate").datepicker("update");
        }

        this.get_last_email_log_but_first_client();

        this.projectService
            .getSupplierInovicesForWeeklyReport(this.getActiveDU().id)
            .then((res) => {
                if (res["status"]) {

                    this.pdfs_preview_pom = res['data'];
                    res["data"].forEach((pdfObj, index) => {
                        let path = BASE_URL + pdfObj["path"];
                        this.pdfs_preview.push(
                            this.sanitizer.bypassSecurityTrustResourceUrl(path)
                        );
                    });
                }
            });
    }

    get_last_email_log_but_first_client() {
        this.projectService
            .get_last_email_log_but_first_client(
                "weekly_report",
                this.getActiveDU().id
            )
            .then((res) => {
                if (res["status"]) {
                    this.get_last_email_log_but_first_client_wr = res["data"];
                }
            });
    }

    setActiveDuRevision(index) {
        this.selectedTab = 0;
        this.activeReportRevisionIndex = index;
        this.getAllMomentsForWeeklyReport();
        if (this.getActiveDU() && this.getActiveDU().WeeklyReportDueDate) {
            const datepickerOptions = {
                format: "yyyy-mm-dd",
                calendarWeeks: true,
                autoclose: true,
                language: this.language,
                currentWeek: true,
                todayHighlight: true,
                currentWeekTransl: this.language === "en" ? "Week" : "Vecka",
                currentWeekSplitChar: "-",
                startDate: new Date(),
            };
            $("#weeklyReportDueDate").datepicker(datepickerOptions);
            $("#weeklyReportDueDate").datepicker(
                "setDate",
                this.getActiveDU().WeeklyReportDueDate.split(" ")[0]
            );
        } else {
            $("#weeklyReportDueDate").datepicker("update");
        }
        this.get_last_email_log_but_first_client();
    }

    getAllMomentsForWeeklyReport() {
        if (this.getActiveDU()) {
            this.projectService
                .getAllMomentsForWeeklyReportWithoutManual(this.getActiveDU().id, this.project.id)
                .then((res) => {
                    if (res["status"]) {
                        this.additionalWorkMoments = res["data"];
                        this.getTableItems("AdditionalWork", "init");
                        this.getTableItems("Material", "init");
                        this.getTableItems("Other", "init");
                    }
                });
        }
        this.spinner = false;
    }

    toggleTable(table) {
        this[table] = !this[table];
    }

    getTable(table) {
        return this[table];
    }

    tableHasRows(table) {
        if (this.reports.length > 0) {
            if (this.reports[this.activeReportIndex].articles[table] > 0) {
                return true;
            } else {
                return false;
            }
        }
    }

    priceChange(article, event) {
        article["Price"] = event.toString().replace(/\s/g, "").replace(",", ".");

        if (article["Price"] != 0 && article["PriceError"]) {
            article["PriceError"] = false;
        }
    }

    getTableItems(key, iteration = null, onlyReturn = null) {
        let articles = [];

        if (this.reports.length > 0) {

            articles =
                this.activeReportRevisionIndex != -1
                    ? this.reports[this.activeReportIndex].revisions[
                        this.activeReportRevisionIndex
                    ].articles[key]
                    : this.reports[this.activeReportIndex].articles[key];
            articles = articles.filter((x) => !x["deleted"]);

            if (onlyReturn) return articles;

            articles.forEach((article) => {
                const Quantity = Number(
                    article.Quantity.toString().replace(/\s/g, "").replace(",", ".")
                );
                const Price = Number(
                    article.Price.toString().replace(/\s/g, "").replace(",", ".")
                );
                article.Total = (
                    Quantity *
                    Price *
                    (Number(article.Deduct.toString().replace(/\s/g, "").replace(",", ".")) / 100 + 1)
                ).toFixed(2);
            });
        }

        if (iteration == "init") {
            this.addRow(key);
            if (key != "Material") {
                this["show" + key + "Table"] =
                    articles.filter((a) => a.Name != "").length > 0;
            } else {
                this.showMaterialTable =
                    articles.filter((a) => a.Name != "").length > 0 ||
                    this.numberOfInvoices > 0;
            }
        }

        return articles;
    }

    addRow(key) {
        const array =
            this.activeReportRevisionIndex != -1
                ? this.reports[this.activeReportIndex].revisions[
                    this.activeReportRevisionIndex
                ].articles[key]
                : this.reports[this.activeReportIndex].articles[key];
        if (array.length == 0) {
            array.push({
                id: -1,
                Name: "",
                Quantity: 0,
                Unit: key == "AdditionalWork" ? "hour work" : "",
                Price: "0",
                Deduct:
                    key == "Material"
                        ? this.articlesMaterialProjectDeduct
                        : key == "Other"
                            ? this.articlesOtherProjectDeduct
                            : 0,
                Total: 0,
                Account: "",
                Date: "",
                ClientComment: "",
                ClientStatus: null,
                is_manual_added: key == "AdditionalWork",
                rnd_string: null
            });
        } else if (array && array[array.length - 1].Name != "") {
            array.push({
                id: -1,
                Name: "",
                Quantity: 0,
                Unit: key == "AdditionalWork" ? "hour work" : "",
                Price: "0",
                Deduct:
                    key == "Material"
                        ? this.articlesMaterialProjectDeduct
                        : key == "Other"
                            ? this.articlesOtherProjectDeduct
                            : 0,
                Total: 0,
                Account: "",
                Date: "",
                ClientComment: "",
                ClientStatus: null,
                is_manual_added: key == "AdditionalWork",
                rnd_string: null
            });
        }
    }

    updateTotal(index, key, calcTime = false) {
        const array =
            this.activeReportRevisionIndex != -1
                ? this.reports[this.activeReportIndex].revisions[
                    this.activeReportRevisionIndex
                ].articles[key][index]
                : this.reports[this.activeReportIndex].articles[key][index];
        if (key == "AdditionalWork") {
            calcTime = true;
        }
        if (array) {
            const Quantity = Number(
                array.Quantity.toString().replace(/\s/g, "").replace(",", ".")
            );
            const Price = Number(
                array.Price.toString().replace(/\s/g, "").replace(",", ".")
            );

            array.Total = (
                Quantity *
                Price *
                (Number(array.Deduct) / 100 + 1)
            ).toFixed(2);
            this.changed = true;
        }
        this.addRow(key);
    }

    calculateTotal(article) {
        let total = 0;

        if (article) {
            total = article.reduce((prev, report) => {
                return prev + parseFloat(report.Total);
            }, 0);
        }
        return total;
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

    removeRow(index, key) {

        const articles = (
            this.activeReportRevisionIndex != -1
                ? this.reports[this.activeReportIndex].revisions[
                    this.activeReportRevisionIndex
                ].articles[key]
                : this.reports[this.activeReportIndex].articles[key]
        ).filter((x) => !x["deleted"]);

        if (
            articles[index].Name == "" &&
            articles.filter((article) => article.Name == "").length == 1
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
                    if (articles[index].id == -1) {

                        if (articles.length > 1) {
                            if (
                                articles[index].TableType == "SupplierInvoiceRow" ||
                                articles[index].TableType == "SupplierInvoice"
                            ) {
                                let i = this.supplierInvoices.findIndex(
                                    (invoice) =>
                                        invoice.GivenNumber == articles[index].GivenNumber
                                );
                                this.supplierInvoiceChecked(false, i);
                                let doc_index = this.pdfs_preview_pom.findIndex((doc) => doc.rnd_string == articles[index].rnd_string);
                                if (doc_index != -1) {
                                    this.pdfs_preview_pom.splice(doc_index, 1);
                                    this.pdfs_preview.splice(doc_index, 1);
                                }

                            }
                            this.reports[this.activeReportIndex]['articles'][key].splice(index, 1);
                         //   articles.splice(index, 1);
                        }
                    } else if (articles[index].id != -1) {

                        if (articles.length > 1) {
                            articles[index]["deleted"] = true;
                            articles.push({
                                id: -1,
                                Name: "",
                                Quantity: "",
                                Unit: key == "AdditionalWork" ? "hour work" : "",
                                Price: "",
                                Deduct:
                                    key == "Material"
                                        ? this.articlesMaterialProjectDeduct.toString()
                                        : key == "Other"
                                            ? this.articlesOtherProjectDeduct.toString()
                                            : 0,
                                Total: "",
                                Account: "",
                                Date: "",
                                ClientComment: "",
                                ClientStatus: null,
                                wrStatus: null,
                                is_manual_added: key == "AdditionalWork",
                                rnd_string: null
                            });
                            this.changed = true;
                        }
                    }

                    const momentDocuments =
                        this.reports[this.activeReportIndex].files["694201337"];

                    if (momentDocuments) {
                        momentDocuments.images = momentDocuments.images.filter(
                            (article) => {
                                return article.article_id != articles[index].id;
                            }
                        );

                        if (momentDocuments.images.length === 0) {
                            delete this.reports[this.activeReportIndex].files["694201337"];
                        }
                    }

                    const report = this.getActiveDU();

                    if (report) {
                        report.rowDeleted = true;
                    }

                    if (articles[index] && articles[index].SupplierInvoiceId && articles[index].TableType && articles[index].TableType == "SupplierInvoiceRow") {
                        let doc_index = this.pdfs_preview_pom.findIndex((doc) => doc.ata_article_id == articles[index].id);
                        if (doc_index != -1) {
                            this.pdfs_preview_pom.splice(doc_index, 1);
                            this.pdfs_preview.splice(doc_index, 1);
                        }
                    }
                }
            });
    }

    isReadonly() {
        return (
            (this.activeReportRevisionIndex != -1
                ? this.reports[this.activeReportIndex].revisions[
                    this.activeReportRevisionIndex
                ].status
                : this.reports[this.activeReportIndex].status) >= 1
        );
    }

    async save(showToastrMessage = true, from = null) {
        if (this.isInvalid()) {
            alert("Invalid text");
            return;
        }

        let active_report = this.getActiveDU();

        $(".documents-wrapper").removeClass("documents-warrning");
        const articles =
            this.activeReportRevisionIndex != -1
                ? this.reports[this.activeReportIndex].revisions[
                    this.activeReportRevisionIndex
                ].articles
                : this.reports[this.activeReportIndex].articles;

        const wrID =
            this.activeReportRevisionIndex != -1
                ? this.reports[this.activeReportIndex].revisions[
                    this.activeReportRevisionIndex
                ].id
                : this.reports[this.activeReportIndex].id;
        const data = [];
        this.spinner = true;
        this.save_in_progress = true;

        this.articles.forEach((key) => {
            if (articles.hasOwnProperty(key)) {
                articles[key].forEach((article) => {
                    let invoice_type = null;
                    if (article.TableType) invoice_type = article.TableType;

                    if (article.Name != "") {
                        data.push({
                            id: article.id,
                            Name: article.Name,
                            Quantity: Number(
                                article.Quantity.toString().replace(/\s/g, "").replace(",", ".")
                            ),
                            Unit: article.Unit,
                            Price: Number(
                                article.Price.toString().replace(/\s/g, "").replace(",", ".")
                            ),
                            Deduct: Number(
                                article.Deduct.toString().replace(/\s/g, "").replace(",", ".")
                            ),
                            Total: article.Total,
                            Account: article.Account,
                            deleted: article.hasOwnProperty("deleted"),
                            type: key,
                            wrID: wrID,
                            GivenNumber: article.GivenNumber,
                            importedFromFortnox: article.hasOwnProperty(
                                "importedFromFortnox"
                            ),
                            TableType: invoice_type,
                            SupplierInvoiceId: article.SupplierInvoiceId,
                            wrStatus: article.wrStatus,
                            is_manual_added: article.is_manual_added,
                            rnd_string: null
                        });
                    }
                });
            }
        });

        this.isEnable = false;
        if (data.length > 0) {
            let files = this.getActiveDU() ? this.getActiveDU().files : [];
            let removed_documents = this.getActiveDU()
                ? this.getActiveDU().removed_documents
                : [];
            const content_id = this.getContentIdForInfoObject();
            const type_id = this.infoObjectDU.type_id;

            const albumFiles = this.imageModalUtility.getAlbumFiles(
                this.albums,
                content_id,
                type_id
            );

            const _newAlbumFiles = await this.fsService.mergeFilesAndAlbums(albumFiles);

            if (_newAlbumFiles != null) {
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

            let object = {
                fullname: this.userDetails.firstname + " " + this.userDetails.lastname,
                articles: data,
                reportId: wrID,
                WeeklyReportDueDate: this.getActiveDU().WeeklyReportDueDate,
                projectId: this.route.snapshot.params.id,
                timesReminderSentDU:
                    this.reminderCheckboxDU && from == null
                        ? Number(this.getActiveDU().timesReminderSentDU) + 1
                        : this.getActiveDU().timesReminderSentDU,
                sendReminderDU: this.reminderCheckboxDU ? true : false,
                images: images,
                pdf_documents: pdf_documents,
                removed_documents: removed_documents,
                sendCopy: this.sendCopy,
            };

            await this.projectService.updateWeeklyReport(object).then(async (res) => {
              //  if (from == null) {
                //    this.activeReportRevisionIndex = -1;
                 //   this.activeReportIndex = 0;
                    await this.getWeeksThatHaveWeeklyReport(null, null);
                    this.getSupplierInvoices();

                    if (res["status"]) {
                        if (showToastrMessage) {
                            this.toastr.success(
                                this.translate.instant("You have successfully saved!"),
                                this.translate.instant("Success")
                            );
                        }
                    }
             //   } else {

                   // if (this.getActiveDU() && this.getActiveDU().status == 0) {
                   //     this.getWeeksThatHaveWeeklyReport(null, null);
                   //     this.getSupplierInvoices();
                   // }
             //   }
                this.save_in_progress = false;
                this.$_clearFiles.next();
                this.albums = [];
                this.rowDeleted = false;
            });
        } else {
            this.toastr.info(
                this.translate.instant("There are no changes to be saved!"),
                this.translate.instant("Info")
            );
        }

        this.ensureSelectedReport(active_report);

        this.spinner = false;
    }

    getActiveDU() {
        const report =
            this.activeReportRevisionIndex != -1 &&
                this.reports[this.activeReportIndex]
                ? this.reports[this.activeReportIndex].revisions[
                this.activeReportRevisionIndex
                ]
                : this.reports[this.activeReportIndex];

        return report;
    }

    getWeek() {
        if (this.reports.length > 0) {
            const report =
                this.activeReportRevisionIndex != -1 &&
                    this.reports[this.activeReportIndex]
                    ? this.reports[this.activeReportIndex].revisions[
                    this.activeReportRevisionIndex
                    ]
                    : this.reports[this.activeReportIndex];
            return report.name.substring(3, 6);
        }
    }

    additionalWorkValidation() {
        let invalid = [];
        this.getTableItems("AdditionalWork", null, true).forEach(
            (article: any, index) => {
                if (
                    article.Name !== "" &&
                    Number(
                        article.Price.toString().replace(/\s/g, "").replace(",", ".")
                    ) === 0
                ) {
                    invalid.push(index);
                }
            }
        );
        return invalid;
    }

    articleMaterialValidation() {
        let invalid = [];
        this.getTableItems("Material", null, true).forEach(
            (article: any, index) => {
                if (
                    article.Name !== "" &&
                    Number(
                        article.Price.toString().replace(/\s/g, "").replace(",", ".")
                    ) === 0
                ) {
                    invalid.push(index);
                }
            }
        );
        return invalid;
    }

    articleOtherValidation() {
        let invalid = [];
        this.getTableItems("Other", null, true).forEach((article: any, index) => {
            if (
                article.Name !== "" &&
                Number(
                    article.Price.toString().replace(/\s/g, "").replace(",", ".")
                ) === 0
            ) {
                invalid.push(index);
            }
        });
        return invalid;
    }

    handlePriceZero(handleFunction, data = null) {
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
        diaolgConfig.panelClass = "mat-dialog-confirmation";
        diaolgConfig.data = {
            questionText: this.translate.instant("Some prices are zero, proceed?"),
        };
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
        const items = this.getTableItems("AdditionalWork", null, true);
        articles.forEach((articleIndex) => {
            items[articleIndex].PriceError = true;
        });
    }

    showMaterialControlError(articles) {

        const items = this.getTableItems("Material", null, true);
        articles.forEach((articleIndex) => {
            items[articleIndex].PriceError = true;
        });
    }

    showOtherControlError(articles) {
        const items = this.getTableItems("Other", null, true);
        articles.forEach((articleIndex) => {
            items[articleIndex].PriceError = true;
        });
    }

    sendValidatedWeeklyReport() {
        this.sendCopy =
            this.getActiveDU().status == 2 || this.getActiveDU().status == 3
                ? true
                : false;

        /**************************************selected first client*************************************************************************/
        let contact_pom = [];
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

        /***************************************************************************************************************/

        if (this.contacts.length < 1) {
            return this.toastr.info(
                this.translate.instant(
                    "You first need to select an email where to send weekly report"
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

        if (this.getActiveDU().status == 5 || this.getActiveDU().status == 2) {
            let date = new Date();
            let momentDate = moment(date).format("YYYY-MM-DD");
            this.getActiveDU().WeeklyReportDueDate = momentDate;
        }

        if (!this.getActiveDU().WeeklyReportDueDate) {
            return this.toastr.info(
                this.translate.instant("Due date is required to send weekly report."),
                this.translate.instant("Info")
            );
        }

        const additionalEmailList = this.contacts.map((contact) => {
            contact.email = this.client_workers.find((x) => x.Id == contact.Id).email;
            return contact;
        });

        const report = this.getActiveDU();

        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = false;
        diaolgConfig.disableClose = true;
        diaolgConfig.width = "";
        diaolgConfig.panelClass = "mat-dialog-confirmation";
        let emails = "";

        additionalEmailList.forEach((rp, index) => {
            emails =
                emails +
                (rp.email ? rp.email : rp.Name) +
                (index === additionalEmailList.length - 1 ? "" : ", ");
        });

        diaolgConfig.data = {
            questionText:
                this.translate.instant("Are you sure you want to send email to: ") +
                emails +
                " ?",
        };
        this.dialog
            .open(ConfirmationModalComponent, diaolgConfig)
            .afterClosed()
            .subscribe((response) => {
                if (response.result) {
                    this.save(false).then((res) => {
                        this.spinner = true;
                        this.projectService
                            .sendWeeklyReport({
                                emails: additionalEmailList,
                                reportId: report.id,
                                projectId: this.route.snapshot.params.id,
                                pdf_url: report.pdf_url,
                                timesReminderSentDU: this.reminderCheckboxDU
                                    ? Number(report["timesReminderSentDU"]) + 1
                                    : Number(report["timesReminderSentDU"]),
                                sendReminderDU: this.reminderCheckboxDU ? true : false,
                                sendCopy: this.sendCopy,
                            })
                            .then((response) => {
                                if (response["status"]) {
                                    if (response["data"].hasOwnProperty("reportStatus")) {
                                        report["timesEmailSent"]++;
                                        this.toastr.success(
                                            this.translate.instant(
                                                "You have successfully sent email!"
                                            ),
                                            this.translate.instant("Success")
                                        );
                                    }

                                    if (!this.sendCopy) {
                                        let activeReportIndex = this.reports.findIndex(
                                            (r) => r.id == report.id
                                        );
                                        if (activeReportIndex != -1) {
                                            this.reports[activeReportIndex].status = 1;
                                        }
                                        let i = this.weeks.findIndex(
                                            (obj) => obj.week == report.name.split("DU-V")[1]
                                        );
                                        if (i != -1) {
                                            this.weeks[i].status = 1;
                                            this.selectStartedImage = this.setIcon(this.weeks[i]);
                                        }
                                    }

                                    this.spinner = false;
                                } else if (!response["status"] && response["message"]) {
                                    this.toastr.error(
                                        this.translate.instant(response["message"]),
                                        this.translate.instant("Error")
                                    );
                                    this.spinner = false;
                                    this.showWrImages = true;
                                    this.sleep(500).then(() => {
                                        $(".documents-wrapper").addClass("documents-warrning");
                                    });
                                }
                            });
                    });
                }
            });
    }

    sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    async ensureSelectedReport(report) {
        let week = parseInt(report.name.split("-V")[1].split("-")[0]);
        const documents = this.weeks.filter((res) => res["week"] == week);

        if (documents && documents.length > 0) {
            report.pdf_documents = documents[0]["pdf_documents"];
            report.images = documents[0]["images"];
        }

        const check_if_report_exist = this.reports.find(
            (r) => r.name == report.name
        );
        if (!check_if_report_exist) {
            let name_before_selected_report = week;
            let index_before_selected_report = 0;

            for (var i = this.reports.length - 1; i >= 0; i--) {
                if (
                    parseInt(this.reports[i].name.split("-V")[1].split("-")[0]) <
                    name_before_selected_report
                ) {
                    index_before_selected_report = i;
                    break;
                }
            }

            this.reports.splice(index_before_selected_report + 1, 0, report);
            this.activeReportIndex = this.reports.findIndex(
                (r) => r.name == report.name
            );
            this.getActiveDU();
        }
    }

    toggleSupplierInvoiceModal(back?) {
        this.showSupplierInvoiceModal = !this.showSupplierInvoiceModal;
        if (back) {
            this.addRow("Material");
        }
    }

    supplierInvoiceChecked(value, index) {
        this.supplierInvoices[index].isChecked = value;
        const invoice = this.supplierInvoices[index];
        const key = "Material";
        const array =
            this.activeReportRevisionIndex != -1 &&
                this.reports[this.activeReportIndex]
                ? this.reports[this.activeReportIndex].revisions[
                    this.activeReportRevisionIndex
                ].articles[key]
                : this.reports[this.activeReportIndex].articles[key];

        let invoice_type = null;

        if (invoice.Type) invoice_type = invoice.Type;


        if (value) {

            let rnd_string = (Math.random() + 1).toString(36).substring(7);
            invoice.rnd_string = rnd_string;
            let obj = {
                'path': invoice.pdf_link,
                'Supplier_invoice_row_id': invoice.sirID,
                'ata_article_id': null,
                'rnd_string': rnd_string
            };

            this.pdfs_preview_pom.push(obj);
            this.pdfs_preview.push(
                this.sanitizer.bypassSecurityTrustResourceUrl(invoice.pdf_link)
            );

            if (array) {

                array.unshift({
                    id: -1,
                    Name: invoice.SupplierName,
                    Quantity: 1,
                    Unit: "pieces",
                    Price:
                        invoice.Type == "SupplierInvoiceRow"
                            ? invoice.Price
                            : invoice.Total,

                    Deduct:
                        invoice.Type == "SupplierInvoiceRow"
                            ? invoice.Deduct
                            : this.articlesMaterialProjectDeduct,
                    Total:
                        invoice.Type == "SupplierInvoiceRow"
                            ? invoice.Total
                            : invoice.Total * (this.articlesMaterialProjectDeduct / 100 + 1),
                    Account: invoice.Account,
                    GivenNumber: invoice.GivenNumber,
                    ClientComment: "",
                    ClientStatus: null,
                    importedFromFortnox: true,
                    TableType: invoice_type,
                    SupplierInvoiceId: invoice.id,
                    wrStatus: null,
                    rnd_string: rnd_string,
                    pdf_images: invoice.image_path,
                    pdf_doc: invoice.pdf_link,
                    file_path: invoice.pdf_link
                });
            }
            this.numberOfInvoices--;
        } else {
            /*  array.splice(
                array.findIndex((invo) => invoice.GivenNumber == invo.GivenNumber),
                1
              );*/
            this.numberOfInvoices++;
        }

        this.changed = true;
    }

    onWeekChangeInit(event) {
        const obj = event.info;
        const invoiced = event.invoiced;

        this.onWeekChange(obj, invoiced);
    }

    async onWeekChange(week, type) {
        if (!week) {
            return;
        }

        if (type == "notInvoiced") {
            this.selectStartedValue = "V" + week.week + " " + week.year;
            this.selectStartedImage = this.setIcon(week);
            this.selectStartedValueInvoiced = "Invoiced";
        } else {
            this.selectStartedValueInvoiced = "V" + week.week + " " + week.year;
            this.selectStartedValue = "Choose";
        }

        this.selectOpen = false;
        this.selectOpenInvoiced = false;
        this.selectedTab = 0;

        const reports = await this.projectService.getWeeklyReports(
            this.route.snapshot.params.id,
            week.year,
            week.week.padStart(2, 0)
        );

        if (reports.length) {
            this.activeReportIndex = 0;

            if (reports[0].revisions.length > 0) {
                this.activeReportRevisionIndex = reports[0].revisions.length - 1;
            } else {
                this.activeReportRevisionIndex = -1;
            }
        }

        this.reports = reports.map((report) => {
            this.articles.forEach((x) => {
                if (!report.articles.hasOwnProperty(x)) {
                    report.articles[x] = [
                        {
                            id: -1,
                            Name: "",
                            Quantity: 0,
                            Unit: x == "AdditionalWork" ? "hour work" : "",
                            Price: "0",
                            Deduct:
                                x == "Material"
                                    ? this.articlesMaterialProjectDeduct
                                    : x == "Other"
                                        ? this.articlesOtherProjectDeduct
                                        : 0,
                            Total: 0,
                            Account: "",
                            Date: "",
                            ClientComment: "",
                            ClientStatus: null,
                            is_manual_added: x == "AdditionalWork",
                            rnd_string: null
                        },
                    ];
                    this["show" + x + "Table"] =
                        x === "Material" && this.supplierInvoices.length > 0;
                } else {
                    this["show" + x + "Table"] = true;
                }
            });

            report.revisions = report.revisions.map((revision) => {
                this.articles.forEach((x) => {
                    if (!revision.articles.hasOwnProperty(x)) {
                        revision.articles[x] = [
                            {
                                id: -1,
                                Name: "",
                                Quantity: 0,
                                Unit: x == "AdditionalWork" ? "hour work" : "",
                                Price: "0",
                                Deduct:
                                    x == "Material"
                                        ? this.articlesMaterialProjectDeduct
                                        : x == "Other"
                                            ? this.articlesOtherProjectDeduct
                                            : 0,
                                Total: 0,
                                Account: "",
                                Date: "",
                                ClientComment: "",
                                ClientStatus: null,
                                is_manual_added: x == "AdditionalWork",
                                rnd_string: null
                            },
                        ];
                        this["show" + x + "Table"] =
                            x === "Material" && this.supplierInvoices.length > 0;
                    } else {
                        this["show" + x + "Table"] = true;
                    }
                });
                return revision;
            });
            return report;
        });
        const datepickerOptions: any = {
            calendarWeeks: true,
            dateFormat: "yy-mm-dd",
            autoclose: true,
            language: this.language,
            todayHighlight: true,
            currentWeekSplitChar: "-",
            startDate: new Date(),
        };

        this.selectedWeeklyReport = week;

        if (this.getActiveDU() && this.getActiveDU().WeeklyReportDueDate) {
            datepickerOptions.defaultDate = new Date(
                this.getActiveDU().WeeklyReportDueDate.split(" ")[0]
            );
        }
        $("#weeklyReportDueDate").datepicker("destroy");
        $("#weeklyReportDueDate")
            .datepicker(datepickerOptions)
            .on("changeDate", (ev) => {
                if (this.getActiveDU()) {
                    this.getActiveDU().WeeklyReportDueDate = ev.target.value;
                }
            })
            .on("blur", (e) => {
                e.target.value = this.getActiveDU().WeeklyReportDueDate;
            });

        this.getAllMomentsForWeeklyReport();
        /*
            if (
                (this.getActiveDU().status == 0 && this.contacts.length > 0) ||
                (this.getActiveDU().status == 1 && this.contacts.length > 0)
            ) {
                this.ataService.updateWeeklyReportPdf(
                    this.getActiveDU().id,
                    this.contacts[0].Name,
                    this.sendCopy
                );
            } else {
                this.ataService.updateWeeklyReportPdf(
                    this.getActiveDU().id,
                    null,
                    this.sendCopy
                );
            }
        */
        this.get_last_email_log_but_first_client();
    }

    printWeeklyReport() {
        this.spinner_from_print = true;
        this.save(false, "Print").then(async(res) => {
            if( this.getActiveDU().pdf_url != '' && this.getActiveDU().pdf_url != null ) {
                await this.getWeeksThatHaveWeeklyReport(null, null);
                printJS(this.getActiveDU().pdf_url);
                this.spinner_from_print = false;
            }else {
                this.ataService.updateWeeklyReportPdf(
                    this.getActiveDU().id,
                    null,
                    this.sendCopy
                ).then(async(res) => {
                    await this.getWeeksThatHaveWeeklyReport(null, null);
                    printJS(this.getActiveDU().pdf_url);
                    this.spinner_from_print = false;
                });
            }
        });
    }

    weeklyReportHasAnyTotals() {
        const activeDU = this.getActiveDU();

        if (activeDU) {
            if (
                activeDU.articles.AdditionalWork.some((article) => article.id != -1)
            ) {
                return true;
            }

            if (activeDU.articles.Material.some((article) => article.id != -1)) {
                return true;
            }

            if (activeDU.articles.Other.some((article) => article.id != -1)) {
                return true;
            }
        }

        return false;
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

    filterArticles(articles) {
        if (articles) {
            return articles.filter((article) => article.Name !== "");
        } else {
            return [];
        }
    }

    async getWeeksThatHaveWeeklyReport(
        fromHtml = null,
        oldActiveReportIndex = null,
    ) {
        this.spinner = true;

        this.selectOpen = false;
        this.selectOpenInvoiced = false;
        this.selectStartedValue = "Not Invoiced";
        this.selectStartedValueInvoiced = "Invoiced";

        if (fromHtml == 1) {
            this.activeReportRevisionIndex = -1;
            this.activeReportIndex = 0;
        }

        const res = await this.projectService.getWeeksThatHaveWeeklyReport(
            this.route.snapshot.params.id
        );

        if (res["status"]) {
            this.weeks = res["data"];
            this.weeksInvoiced = this.weeks.filter(
                (res) =>
                    (res["status"] == 5 && res["financeId"] != 0) ||
                    (res["status"] == 3 && res["financeId"] != 0)
            );

            this.weeks = this.weeks.filter(
                (res) => res["status"] != 5 && res["status"] != 3
            );

            if (this.weeks.some((report) => report.week == this.currentWeek)) {
                this.newWRDisabled = true;
            }
            if (this.weeks.length < 1) {
                this.spinner = false;
                return;
            }

            let active_wr = null;

            if (this.getActiveDU()) {
                active_wr = this.getActiveDU().id;
            }

            const reports = await this.projectService.getNotSendWeeklyReports(
                this.route.snapshot.params.id,
                active_wr
            );

            // checks if weeklyreport query param is set and opens correct weekly report
            if (this.initiallySelectedWeeklyReport != -1) {
                this.activeReportIndex = this.reports.findIndex(
                    (report) =>
                        parseInt(report.name.split("-V")[1].split("-")[0]) ==
                        this.initiallySelectedWeeklyReport
                );

                if (this.activeReportIndex == -1) {
                    const week = this.weeks.find(
                        (w) => w.week == this.initiallySelectedWeeklyReport
                    );
                    const weekInvoiced = this.weeksInvoiced.find(
                        (w) => w.week == this.initiallySelectedWeeklyReport
                    );
                    let isInvoiced = "notInvoiced";
                    if (week || weekInvoiced) {
                        if (weekInvoiced) {
                            isInvoiced = "Invoiced";
                        }

                        await this.onWeekChange(week || weekInvoiced, isInvoiced);
                    } else {
                        this.activeReportIndex = this.reports.length - 1;
                    }
                }

                this.showPdfPreview = true;
            } else {
                this.reports = reports.map((report) => {
                    this.articles.forEach((x) => {
                        if (!report.articles.hasOwnProperty(x)) {
                            report.articles[x] = [
                                {
                                    id: -1,
                                    Name: "",
                                    Quantity: 0,
                                    Unit: x == "AdditionalWork" ? "hour work" : "",
                                    Price: "0",
                                    Deduct:
                                        x == "Material"
                                            ? this.articlesMaterialProjectDeduct
                                            : x == "Other"
                                                ? this.articlesOtherProjectDeduct
                                                : 0,
                                    Total: 0,
                                    Account: "",
                                    Date: "",
                                    ClientComment: "",
                                    ClientStatus: null,
                                    rnd_string: null
                                },
                            ];
                            this["show" + x + "Table"] = false;
                        } else {
                            this["show" + x + "Table"] = true;
                        }
                    });


                    report.revisions = report.revisions.map((revision) => {
                        this.articles.forEach((x) => {
                            if (!revision.articles.hasOwnProperty(x)) {
                                revision.articles[x] = [
                                    {
                                        id: -1,
                                        Name: "",
                                        Quantity: 0,
                                        Unit: x == "AdditionalWork" ? "hour work" : "",
                                        Price: "0",
                                        Deduct:
                                            x == "Material"
                                                ? this.articlesMaterialProjectDeduct
                                                : x == "Other"
                                                    ? this.articlesOtherProjectDeduct
                                                    : 0,
                                        Total: 0,
                                        Account: "",
                                        Date: "",
                                        ClientComment: "",
                                        ClientStatus: null,
                                        rnd_string: null
                                    },
                                ];
                                this["show" + x + "Table"] = false;
                            } else {
                                this["show" + x + "Table"] = true;
                            }
                        });

                        return revision;
                    });
                    return report;
                });

                if (this.selectedWeeklyReport) {
                    let du = "DU-V" + this.selectedWeeklyReport.week;
                    let index1 = this.reports.findIndex((value) => value.name == du);

                    if (index1 != -1) this.activeReportIndex = index1;
                    this.selectedWeeklyReport = null;
                } else if (this.reports.length && !this.selectedWeeklyReport) {
                    this.activeReportIndex = this.reports.length - 1;
                }
                if (this.reports.length > 0) {
                    if (this.reports[this.activeReportIndex].revisions.length > 0) {
                        this.activeReportRevisionIndex =
                            this.reports[this.activeReportIndex].revisions.length - 1;
                    } else {
                        this.activeReportRevisionIndex = -1;
                    }
                }
            }

            if (oldActiveReportIndex) this.activeReportIndex = oldActiveReportIndex;

            if (this.getActiveDU()) {
                this.setActiveDu(this.activeReportIndex);
            }
            this.isEnable = true;
            this.getAllMomentsForWeeklyReport();
        }

        this.existing_empty_weekly_report =
            this.weeks.filter((week) => week.status == "0").length > 0;
        if (
            this.supplierInvoices &&
            this.supplierInvoices.length > 0 &&
            !this.existing_empty_weekly_report
        )
            this.newWRDisabled = false;
        this.spinner = false;
    }

    ngOnDestroy() { }

    changeSelectedTab(index) {
        if (index == 3) {
            if (this.reports.length > 0) {
                this.save(false).then((res) => {
                    this.selectedTab = index;
                });
            } else {
                this.selectedTab = index;
            }
        } else {
            this.selectedTab = index;
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
                    const report = this.getActiveDU();
                    const id = report.id;

                    this.projectService.deleteWeeklyReport(id, this.project.id).then((res) => {
                        if (res["status"]) {
                            const week = report.date.slice(0, 5).replace(/^\D+/g, "");
                            this.removeWRAfterDelete(id, week);
                        }
                    });
                }
            });
    }

    removeWRAfterDelete(id, week) {
        this.reports = this.reports.filter((report) => {
            return id !== report.id;
        });

        if (this.reports.length === 0) {
            this.weeks = this.weeks.filter((week_) => {
                return Number(week) !== Number(week_.week);
            });
            this.onWeekChange(this.weeks[this.weeks.length - 1], "notInvoiced");
        } else {
            this.setActiveDu(this.reports.length - 1);
        }
    }

    acceptWeeklyReport() {
        let report = this.getActiveDU();
        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = false;
        diaolgConfig.disableClose = true;
        diaolgConfig.width = "";
        diaolgConfig.panelClass = "mat-dialog-confirmation";
        diaolgConfig.data = {
            questionText:
                this.translate.instant(
                    "Are you sure you want to accept weekly report: "
                ) + report.name,
        };
        this.dialog
            .open(ConfirmationModalComponent, diaolgConfig)
            .afterClosed()
            .subscribe((response) => {
                if (response.result) {
                    this.spinner = true;
                    this.save(false).then((res) => {
                        this.spinner = true;
                        this.projectService
                            .approveWeeklyReportAsAdmin(report["id"])
                            .then((response) => {
                                if (response["status"]) {
                                    this.spinner = false;
                                    this.toastr.success(
                                        this.translate.instant(
                                            "You successfully accepted Weekly Report."
                                        ),
                                        this.translate.instant("Success")
                                    );
                                    this.getActiveDU().status = 2;
                                    let i = this.weeks.findIndex(
                                        (obj) =>
                                            obj.week == this.getActiveDU().name.split("DU-V")[1]
                                    );
                                    if (i != -1) {
                                        this.weeks[i].status = 2;
                                        this.selectStartedImage = this.setIcon(this.weeks[i]);
                                    }
                                } else {
                                    this.spinner = false;
                                    this.toastr.warning(
                                        this.translate.instant("Not able to accept Weekly Report."),
                                        this.translate.instant("Error")
                                    );
                                }
                            });
                    });
                } else {
                    this.spinner = false;
                }
            });
    }

    declineWeeklyReport() {
        let report = this.getActiveDU();
        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = false;
        diaolgConfig.disableClose = true;
        diaolgConfig.width = "";
        diaolgConfig.panelClass = "mat-dialog-confirmation";
        diaolgConfig.data = {
            questionText:
                this.translate.instant(
                    "Are you sure you want to decline weekly report: "
                ) + report.name,
        };
        this.dialog
            .open(ConfirmationModalComponent, diaolgConfig)
            .afterClosed()
            .subscribe((response) => {
                if (response.result) {
                    this.spinner = true;
                    this.save(false).then((res) => {
                        this.spinner = true;
                        this.projectService
                            .declineWeeklyReportAsAdmin(report["id"])
                            .then((response) => {
                                if (response["status"]) {
                                    this.spinner = false;
                                    this.toastr.success(
                                        this.translate.instant(
                                            "You successfully declined Weekly Report."
                                        ),
                                        this.translate.instant("Success")
                                    );
                                    this.activeReportRevisionIndex = -1;
                                    this.activeReportIndex = 0;
                                    this.getWeeksThatHaveWeeklyReport(null, null);
                                    this.getSupplierInvoices();
                                    this.getActiveDU() ? (this.getActiveDU().status = 3) : "";
                                    let i = this.weeks.findIndex(
                                        (obj) =>
                                            obj.week == this.getActiveDU().name.split("DU-V")[1]
                                    );
                                    if (i != -1) {
                                        this.weeks[i].status = 3;
                                        this.selectStartedImage = this.setIcon(this.weeks[i]);
                                    }
                                } else {
                                    this.spinner = false;
                                    this.toastr.warning(
                                        this.translate.instant(
                                            "Not able to decline Weekly Report."
                                        ),
                                        this.translate.instant("Error")
                                    );
                                }
                            });
                    });
                } else {
                    this.spinner = false;
                }
            });
    }

    setIcon(week) {
        let icon = "";
        if (week.status == 1) icon = "assets/img/send.png";
        else if (week.status == 2 || week.status == 4)
            icon = "assets/img/approve.png";
        else if (week.status == 5) icon = "assets/img/invoced.png";

        return icon;
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

    toggleselectOpen() {
        this.selectOpen = !this.selectOpen;
        this.showAttachmentImage = false;
        this.showPdf = false;

        if (this.selectOpen) this.selectOpenInvoiced = false;
    }

    toggleselectOpenInvoiced() {
        this.selectOpenInvoiced = !this.selectOpenInvoiced;
        this.showAttachmentImage = false;
        this.showPdf = false;

        if (this.selectOpenInvoiced) this.selectOpen = false;
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
                    this.showAttachmentImage = false;
                    this.showPdf = false;

                    this.ataService
                        .manuallyCreateWeeklyReport(this.route.snapshot.data.project.id, 0)
                        .subscribe((res) => {
                            if (res["status"]) {
                                this.toastr.success(
                                    this.translate.instant(
                                        "Successfully created weekly report for current week."
                                    ),
                                    this.translate.instant("Success")
                                );
                                const wr = res["createdWeeklyReport"];

                                wr.articles = {};
                                wr.articles.AdditionalWork = [
                                    {
                                        id: -1,
                                        Name: "",
                                        Quantity: 0,
                                        Unit: "hour work",
                                        Price: "0",
                                        Deduct: 0,
                                        Total: 0,
                                        Account: "",
                                        Date: "",
                                        ClientComment: "",
                                        ClientStatus: null,
                                        wrStatus: null,
                                        is_manual_added: true,
                                        rnd_string: null
                                    },
                                ];
                                wr.articles.Material = [
                                    {
                                        id: -1,
                                        Name: "",
                                        Quantity: 0,
                                        Unit: "",
                                        Price: "0",
                                        Deduct: this.articlesMaterialProjectDeduct,
                                        Total: 0,
                                        Account: "",
                                        Date: "",
                                        ClientComment: "",
                                        ClientStatus: null,
                                        TableType: null,
                                        wrStatus: null,
                                        rnd_string: null
                                    },
                                ];
                                wr.articles.Other = [
                                    {
                                        id: -1,
                                        Name: "",
                                        Quantity: 0,
                                        Unit: "",
                                        Price: "0",
                                        Deduct: this.articlesOtherProjectDeduct,
                                        Total: 0,
                                        Account: "",
                                        Date: "",
                                        ClientComment: "",
                                        ClientStatus: null,
                                        wrStatus: null,
                                        rnd_string: null
                                    },
                                ];
                                this.reports.push(wr);
                                this.weeks.push({
                                    week: wr.week,
                                    year: wr.year,
                                    external: wr.External,
                                    status: wr.status,
                                    id: wr.id,
                                });
                                this.newWRDisabled = true;
                                this.activeReportIndex = this.reports.length - 1;
                                this.setActiveDu(this.activeReportIndex);
                            } else {
                                this.toastr.error(
                                    this.translate.instant(res["message"]),
                                    this.translate.instant("Error")
                                );
                            }
                        });
                }
            });
    }

    private getSupplierInvoices() {
        this.projectService
            .getSupplierInvoiceForDU(this.route.snapshot.data.project.id)
            .then((res) => {
                this.supplierInvoices = res["invoices"];
                this.numberOfInvoices = this.supplierInvoices.length;
                this.showMaterialTable =
                    this.numberOfInvoices > 0 ||
                    this.getTableItems("Material", null, true).filter((a) => a.Name != "")
                        .length > 0;
            });
    }

    isInvalid() {
        return document.querySelector(".is-invalid");
    }

    isValidQuantityFormat(quantity) {
        return /([0-9]+)([:][0-9]+)?/.test(quantity);
    }

    additionalWorkCheck(articleType, article) {
        if (
            (articleType == "AdditionalWork" &&
                article.wrStatus == 0 &&
                article.additionalWorkStatus == "accepted") ||
            (articleType != "AdditionalWork" && article.ClientStatus == 1)
        )
            return true;
        else return false;
    }

    isArticleAccepted(key, article) {
        if (key == "AdditionalWork") {
            return article.additionalWorkStatus == "accepted";
        } else {
            return article.ClientStatus == "1";
        }
    }

    allowAddInvoiceOnWeeklyReportIfNotRevision() {
        let status = false;
        if (
            this.getActiveDU() &&
            this.getActiveDU().parent != null &&
            this.getActiveDU().parent == 0
        ) {
            status = true;
        }
        return status;
    }

    disabledIfRevisionDU(article) {
        let disabled = false;
        if (
            (!article.id || article.id == -1) &&
            this.reports[this.activeReportIndex].parent != 0
        ) {
            disabled = true;
        }
        return disabled;
    }

    getContentIdForInfoObject() {
        const activeDU = this.getActiveDU();
        let content_id = this.reports[this.activeReportIndex].id;

        if (
            this.reports &&
            this.reports.length > 0 &&
            this.reports[0].revisions &&
            this.reports[0].revisions.length > 0
        ) {
            let i = this.reports[0].revisions.findIndex(
                (report) => report.id == activeDU.id
            );
            if (i != -1) {
                content_id = this.reports[0].revisions[i].id;
            }
        }

        return content_id;
    }

    openModal() {
        let activeDU = this.getActiveDU();
        let content_id = this.reports[this.activeReportIndex].id;
        let images = this.reports[this.activeReportIndex].images;
        let documents = this.reports[this.activeReportIndex].pdf_documents;

        if (
            this.reports &&
            this.reports.length > 0 &&
            this.reports[0].revisions &&
            this.reports[0].revisions.length > 0
        ) {
            let i = this.reports[0].revisions.findIndex(
                (report) => report.id == activeDU.id
            );
            content_id = this.reports[0].revisions[i].id;
            images = this.reports[0].revisions[i].images;
            documents = this.reports[0].revisions[i].pdf_documents;
        }

        let object = {
            content_type: "DU",
            content_id: content_id,
            type: "Project",
            type_id: this.project.id,
            images: images,
            documents: documents,
        };

        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = true;
        diaolgConfig.disableClose = true;
        diaolgConfig.width = "50%";
        diaolgConfig.maxHeight = "550px";
        diaolgConfig.data = { data: object, images: images, documents: documents };
        this.dialog
            .open(ImageModalComponent, diaolgConfig)
            .afterClosed()
            .subscribe((res) => {
                if (res) {
                    if (
                        this.reports &&
                        this.reports.length > 0 &&
                        this.reports[0].revisions &&
                        this.reports[0].revisions.length > 0
                    ) {
                        let i = this.reports[0].revisions.findIndex(
                            (report) => report.id == activeDU.id
                        );
                        this.reports[0].revisions[i].images = res.files;
                        this.reports[0].revisions[i].pdf_documents = res.pdf_documents;
                        this.reports[0].revisions[i].removed_documents = res.removed_files;
                    } else {
                        this.reports[this.activeReportIndex].images = res.files;
                        this.reports[this.activeReportIndex].pdf_documents =
                            res.pdf_documents;
                        this.reports[this.activeReportIndex].removed_documents =
                            res.removed_files;
                    }
                }
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

    removeImages(index, type = "Images") {
        if (!this.reports[this.activeReportIndex].removed_documents) {
            this.reports[this.activeReportIndex].removed_documents = [];
        }

        if (!this.reports[this.activeReportIndex].pdf_documents) {
            this.reports[this.activeReportIndex].pdf_documents = [];
        }

        if (type == "Images") {
            this.reports[this.activeReportIndex].removed_documents.push(
                this.reports[this.activeReportIndex].images[index].id
            );
            this.reports[this.activeReportIndex].images.splice(index, 1);
        } else {
            this.reports[this.activeReportIndex].removed_documents.push(
                this.reports[this.activeReportIndex].pdf_documents[index].id
            );
            this.reports[this.activeReportIndex].pdf_documents.splice(index, 1);
        }
    }

    toggleAttachment(albumKey, index, type) {
        if (!this.reports[this.activeReportIndex].removed_documents) {
            this.reports[this.activeReportIndex].removed_documents = [];
        }

        const files = this.reports[this.activeReportIndex]["files"][albumKey][type];
        const file = files[index];
        const id = file.id;

        if (file.deleted) {
            this.reports[this.activeReportIndex].removed_documents = this.reports[
                this.activeReportIndex
            ].removed_documents.filter((_file) => {
                return id != _file.id;
            });
        } else {
            this.reports[this.activeReportIndex].removed_documents.push(file);
        }

        file.deleted = !file.deleted;
    }

    onItemSelect(selectedClient) {
        if (
            this.getActiveDU() &&
            this.getActiveDU().status == 1 &&
            !this.sendCopy
        ) {
            let selectedClientEmail = this.client_workers.find(
                (client) => client.Id == selectedClient.Id
            );
            if (
                selectedClientEmail &&
                this.getActiveDU().clientResponses.some(
                    (response) => response.answerEmail == selectedClientEmail.email
                )
            ) {
                const diaolgConfig = new MatDialogConfig();
                diaolgConfig.autoFocus = false;
                diaolgConfig.disableClose = true;
                diaolgConfig.width = "";
                diaolgConfig.panelClass = "mat-dialog-confirmation";
                diaolgConfig.data = {
                    questionText: this.translate.instant("TSC_ALREADY_RESPONDED_ON_ATA"),
                };
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

    toggleReminderAndCopyCheckbox(event, toggle) {
        this.sendBtnDisabled = false;
        switch (toggle) {
            case "sendCopy":
                this.sendCopy = !this.sendCopy;
                if (this.sendCopy && this.reminderCheckboxDU) {
                    this.toastr.warning(
                        this.translate.instant("Please select only Reminder or Copy."),
                        this.translate.instant("Info")
                    );
                    this.sendBtnDisabled = true;
                }
                break;
            case "sendReminder":
                this.reminderCheckboxDU = event.target.checked;
                if (this.sendCopy && this.reminderCheckboxDU) {
                    this.toastr.warning(
                        this.translate.instant("Please select only Reminder or Copy."),
                        this.translate.instant("Info")
                    );
                    this.sendBtnDisabled = true;
                }
                break;
        }
    }

    isPDFViewer: boolean = false;
    openSwiper(index, files, album) {

      const firstElement = files[0];
      const name = firstElement.name; // Vrijednost svojstva "name"

      if (name.endsWith('pdf')) {
        this.isPDFViewer = true;
      }else{
        this.isPDFViewer = false;
      }

        if (files[index].document_type === "Image") {
            this.swiper = {
                active: index,
                images: files,
                album: album,
                index: -1,
                parent: null,
            };
        } else {
            const fileArray = this.createFileArray(files[index]);
            this.swiper = {
                active: 0,
                images: fileArray,
                album: album,
                index: index,
                parent: files[index],
            };
        }
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

    createFileArray(file) {
      const id = file.id;
      const comment = file.Description;
      const name = file.Name ? file.Name : file.name;
     // const image_path = file.image_path;
      const file_path = file.file_path;

      const fileArray = file_path.split(",").map((fileArray) => {
          return {
              image_path: fileArray,
              id: id,
              Description: comment,
              name: name,
              file_path: file_path,
          };
      });
      return fileArray;
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

    capitalizeFirstLetter(string) {
        return string ? string[0].toUpperCase() + string.slice(1) : "";
    }

    removeSelectedDocumentsDU(event) {
        event.stopPropagation();

        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = false;
        diaolgConfig.disableClose = true;
        diaolgConfig.panelClass = "mat-dialog-confirmation";
        diaolgConfig.width = "";
        this.dialog
            .open(ConfirmationModalComponent, diaolgConfig)
            .afterClosed()
            .subscribe((response) => {
                if (response.result) {
                    const data = {
                        documents: this.reports[this.activeReportIndex].removed_documents,
                    };
                    this.spinner = true;
                    this.projectService
                        .removeSelectedDocumentsDU(data)
                        .then((res: any) => {
                            if (res.status) {
                                this.removeSelectedDocumentsOnClientSideDU();
                            } else {
                                this.toastr.error(this.translate.instant("Error"));
                            }
                            this.spinner = false;
                        });
                }
            });
    }

    removeSelectedDocumentsOnClientSideDU() {
        this.reports[this.activeReportIndex].removed_documents.forEach((doc) => {
            const albumKey = doc.album;
            this.reports[this.activeReportIndex]["files"][albumKey]["images"] =
                this.reports[this.activeReportIndex]["files"][albumKey][
                    "images"
                ].filter((file: any) => {
                    return file.id != doc.id;
                });
            this.reports[this.activeReportIndex]["files"][albumKey]["pdfs"] =
                this.reports[this.activeReportIndex]["files"][albumKey]["pdfs"].filter(
                    (file: any) => {
                        return file.id != doc.id;
                    }
                );
            this.clearAlbumDU(albumKey);
        });
        this.reports[this.activeReportIndex].removed_documents = [];
    }

    clearAlbumDU(albumKey) {
        const album = this.reports[this.activeReportIndex]["files"][albumKey];
        const imagesLength = album.images ? album.images.length : 0;
        const pdfsLength = album.pdfs ? album.pdfs.length : 0;
        if (imagesLength === 0 && pdfsLength === 0) {
            delete this.reports[this.activeReportIndex]["files"][albumKey];
        }
    }

    generatePdf(event) {

        if(event && event.type == 'ProjectPDFWR') {
            this.spinner_from_print = true;
            this.save(false, "Print").then(async(res) => {
               /* if( this.getActiveDU().pdf_url != '' && this.getActiveDU().pdf_url != null ) {
                    await this.getWeeksThatHaveWeeklyReport(null, null);
                    printJS(this.getActiveDU().pdf_url);
                    this.spinner_from_print = false;
                }else { */
                    this.ataService.updateWeeklyReportPdf(
                        this.getActiveDU().id,
                        null,
                        this.sendCopy
                    ).then(async(res) => {
                        await this.getWeeksThatHaveWeeklyReport(null, null);
                        if (event.from == "savePdf" || event.from == "Save") {
                            this.dowload_pdf(this.getActiveDU().pdf_url);
                        } else {
                            printJS(this.getActiveDU().pdf_url);
                        }
                        this.spinner_from_print = false;
                    });
               // }
            });
        }else {
            const additionalEmailList = this.contacts.map((contact) => {
                contact.email = this.client_workers.find((x) => x.Id == contact.Id).email;
                return contact;
            });

            const report = this.getActiveDU();
            let emails = "";

            let sent_by =
                this.current_user.firstname + " " + this.current_user.lastname;

            if (this.get_last_email_log_but_first_client_wr["from_user"] !== "") {
                sent_by = this.get_last_email_log_but_first_client_wr["from_user"];
            }

            additionalEmailList.forEach((rp, index) => {
                emails =
                    emails +
                    (rp.email ? rp.email : rp.Name) +
                    (index === additionalEmailList.length - 1 ? "" : ", ");
            });

            this.spinner = true;
            this.projectService .printPdf({
                reportId: report.id,
                sent_by: sent_by,
                projectId: this.route.snapshot.params.id,
                pdf_type: event.type,
            }).then((response) => {
                if (response["status"]) {
                    if (event.from == "savePdf" || event.from == "Save") {
                        this.dowload_pdf(response["data"].pdfPath);
                        this.spinner = false;
                    } else {
                        printJS(response["data"].pdf_path_without_host);
                        this.spinner = false;
                    }
                }
            });
        }
    }

    dowload_pdf(pdfPath) {
        const name =
            this.project.CustomName + "-" + this.getActiveDU().name + ".pdf";
        const link = document.createElement("a");
        link.href = pdfPath;
        link.setAttribute("download", name);
        document.body.appendChild(link);
        link.click();
    }


    openSwiperSupplierInvoice(invoice = null, article = null) {
      let fileArray = [];

      if(invoice){
        if (invoice.pdf_link !== "") {
          this.isPDFViewer = true;
          fileArray = this.createImageArraySupplierInvoice(invoice);
          this.swiperSupplierInvoice = {
              active: 0,
              images: fileArray,
              album: invoice.id,
              index: -1,
              parent: null
          };
        }
      }else if(article){
        if (article.pdf_doc !== "") {
          this.isPDFViewer = true;
          let obj = {
            'id': 5555555555,
            'comment': '',
            'name': article.Name,
            'image_path': article.pdf_images,
            'file_path': article.pdf_doc
        }

        fileArray = this.createImageArraySupplierInvoice(obj);

        this.swiperSupplierInvoice = {
            active: 0,
            images: fileArray,
            album: 5555555555,
            index: -1,
            parent: null
        };
        }
      } else {
        this.isPDFViewer = false;
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

      const segments = (invoice.pdf_link !== null && invoice.pdf_link !== undefined) ? invoice.pdf_link.split('/') : invoice.file_path.split('/');

      const id = invoice.id;
      const comment = '';
      const name = invoice.SupplierName;
      //const image_path = invoice.image_path;
      // const file_path = invoice.file_path ? invoice.file_path : invoice.pdf_doc;
      const file_path = segments.slice(4).join('/');
      const type = this.isPDFViewer ? 'pdf' : 'image';

      const fileArray = file_path.split(",").map((fileArray) => {
          return {
              image_path: fileArray,
              id: id,
              Description: comment,
              name: name,
              file_path: file_path,
              type: type,
          };
      });
      return fileArray;
  }

    sendExportedDocuments() {
        if (this.project.status != 3 && this.project.status != 4) return;

        if (this.contacts.length < 1) {
            return this.toastr.info(
                this.translate.instant(
                    "You first need to select an email where to send documents"
                ) + ".",
                this.translate.instant("Info")
            );
        }

        let emails = "";
        const additionalEmailList = [];
        this.contacts.forEach((contact, index) => {
            contact.email = this.client_workers.find((x) => x.Id == contact.Id).email;
            additionalEmailList.push(contact.email);
            if (emails.length > 0)
                emails = emails + ", " + (contact.email ? contact.email : contact.Name);
            else emails = emails + (contact.email ? contact.email : contact.Name);
        });

        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = false;
        diaolgConfig.disableClose = true;
        diaolgConfig.width = "";
        diaolgConfig.panelClass = "mat-dialog-confirmation";
        diaolgConfig.data = {
            questionText:
                this.translate.instant("Are you sure you want to send email to:") +
                " " +
                emails +
                " ?",
        };

        this.dialog
            .open(ConfirmationModalComponent, diaolgConfig)
            .afterClosed()
            .subscribe((response) => {
                if (response.result) {
                    this.spinner = true;

                    this.ataService
                        .downloadDocumentsZip(this.project.id, 'du', additionalEmailList)
                        .subscribe({
                            next: (response) => {
                                this.spinner = false;
                                if (response["status"]) {
                                    this.toastr.success(
                                        this.translate.instant("You have successfully sent email!"),
                                        this.translate.instant("Success")
                                    );
                                    this.spinner = false;
                                } else {
                                    this.toastr.error(
                                        this.translate.instant(
                                            "There are not documents that can be sent."
                                        ),
                                        this.translate.instant("Error")
                                    );
                                    this.spinner = false;
                                }
                            },
                            error: (_) => {
                                this.toastr.error(
                                    this.translate.instant(
                                        "There are not documents that can be sent."
                                    ),
                                    this.translate.instant("Error")
                                );
                                this.spinner = false;
                            },
                        });
                }
            });
    }


    openWeeklyReportsModal() {
        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = true;
        diaolgConfig.disableClose = true;
        // diaolgConfig.width = "100%";
        diaolgConfig.data = {
        data: {'type': 'weekly_report', 'project_id': this.project.id, 'client_workers': this.client_workers, 'contacts': this.contacts, 'project': this.project, 'from': 'du'},
        };
        diaolgConfig.panelClass = "bdrop";

        this.dialog.open(WeeklyReportsForSelectComponent, diaolgConfig)
            .afterClosed()
            .subscribe((response) => {
            if (response) {
                this.toastr.success(
                    this.translate.instant(
                        "You have successfully sent email!"
                    ),
                    this.translate.instant("Success")
                );
                window.location.reload();
            }
        });
    }

    checkStatus() {
        if (this.project.status != "2") this.allowNewWR = false;
    }


    allowEditWeeklyReport() {

        let status = false;
        if(this.userDetails.create_project_WeeklyReport) {
            status = true;
        }
        if(!status) {
           $("input").attr('disabled','disabled');
        }
        return status;
    }
}
