import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { PaymentPlanService } from "../../../../../core/services/payment-plan.service";
import { ProjectDetails } from "../payment-plan/project-details";
import { PostRequest } from "./post.interface";
import { DecimalPipe, formatNumber } from "@angular/common";
import { CanDeactivateComp } from "./can-deactivate";
import { ProjectsService } from "src/app/core/services/projects.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import * as moment from "moment";
import * as printJS from "print-js";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { ConfirmModalComponent } from "src/app/shared/modals/confirm-modal/confirm-modal.component";
import { PaymentPlanStore } from './payment-plan.service';
import 'src/app/core/extensions/rxjs-observable-promise';

declare var $: any;

@Component({
    selector: "app-payment-plan",
    templateUrl: "./payment-plan.component.html",
    styleUrls: ["./payment-plan.component.css"],
})
export class PaymentPlanComponent implements OnInit, CanDeactivateComp {
    canDeactivate(): boolean {
        return !this.isDirty;
    }
    isDirty: boolean = false;
    @ViewChild("input")
    inputElement: ElementRef;
    public language = "en";
    public project: any;
    @ViewChild("perc_ca")
    perc_calc: ElementRef;
    spinner: boolean = false;
    dotsPopUp: boolean = false;
    paymentForm: FormGroup;
    backgroundName: boolean = false;
    editTextArea: boolean = false;
    txtAr: string = "";
    dropdownTop: boolean = false;
    optionsDown: boolean = false;
    statusMess: string = "";
    dotsDiv: boolean = false;
    dotsDiv2: boolean = true;
    dotsDivAny: any;
    selectedArticle: any;
    maxChars = 230;
    description: string = "";
    chars = 0;
    textAreaRemaining: any;
    projectDetails: any;
    showFiller: boolean = false;
    editColor: string = "#FD4444";
    defaultIconColor: string = "#F0E264";
    greyTrash: string = "#a7a7a7";
    deleteTrashIcon: any;
    greyTrashBool: boolean = false;
    defaultTrashColor: string = "#fd4444";
    editTrigger: boolean = false;
    iconColor: any;
    dotsColor: any;
    isChanged: boolean = false;
    userData: any = [];
    matClick: boolean = false;
    //Total table amount
    totalAmount: number | string = 0;
    totalArr: number | string = 0;
    totalInvoice: number | string = 0;
    //Percentage
    perc: any = [];
    public sameBelop?: any;
    projectModel: ProjectDetails = new ProjectDetails();
    //Border Pop up
    public showPdfPreview = false;
    public showingPaymentPlan = "pp";
    public whichPdfPreview = "pp";
    public modalPosition = {
        top: 0,
        left: 0,
    };
    public modalInfo = null;
    public selectedPaymentPlan = 0;
    public client_workers = [];
    public contacts = [];
    public buttonName = "";
    public emailSending = false;
    buttonToggle = false;
    public statuses: any[] = [];
    public activities: any[] = [];
    postData = new PostRequest();
    public saved_payments: any[] = [];
    modalOpen: boolean = false;
    pasteCount: any;
    pastedText: string;
    public logs: Record<string, any[]> = {};
    public get_last_email_log_but_first_client = [];
    public sendCopy: boolean = false;
    public selectedFirstClientWorker: any = null;
    show: boolean = false;
    public selectedTab = 0;
    public isDisabled = false;
    public comments = [];
    lockPlan: boolean = false;
    randomGroup: any;
    public clickedArticle = -1;
    public commentStatus: boolean;
    public saveComment = 0;
    public timeout;
    public sumBalanceInvoiced;
    public sumArrearsInvoiced;
    public sumAcceptedInvoiced;
    public paymentPostSub;
    public arrearsAmount;
    public percentage_ca_invoiced;
    public percentage_invoiced;
    public setActivePaymentPlanValue;
    public changeDueDate = true;

    public f: any = { valid: true};
    private formElements = [];
    public isUpdate: boolean = false;
    public userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private translate: TranslateService,
        private toastr: ToastrService,
        private projectsService: ProjectsService,
        private http: PaymentPlanService,
        private numberPipe: DecimalPipe,
        private renderer: Renderer2,
        private dialog: MatDialog,
        private paymentPlanStore: PaymentPlanStore

    ) { }


    initialArrearsCalc(userData) {
        userData.forEach((data) => {
            if (data.isLocked == 0) {
                this.recalculateArreasTotals(data);
            }
        });
        return userData.slice(0);
    }

    ngOnInit() {
        if (this.userDetails.create_project_Paymentplan) {
            $("input").removeAttr('disabled');
        }else {
            $("input").attr('disabled','disabled');
        }

        this.userData = this.route.snapshot.data['userData'].data;
        this.project = this.route.snapshot.data["project"];

        this.dotsColor = "#82a7e2";
        this.language = sessionStorage.getItem("lang");

        this.greyTextDelete();
        this.getDetails(true);
    }

    initializeData() {
        this.getName();
        this.getTotal();
        this.getTotalArr();
        this.getTotalInvoiced();
        this.getAll();
        this.getTotalBalance();
        this.getStatuses();
        this.getPaymentPlanActivities();
        this.getEmailLogsForPP();
        this.getTotalBalanceInvoiced();
        this.getTotalArrInvoiced();
        this.getTotalAcceptedInvoiced();
        this.subToPaymentPostEvent();

        this.projectsService
            .getAttestClientWorkers(this.project.data.id)
            .then((res) => {
                this.client_workers = res;
            });

        this.http
            .getTheComments(this.project.data.id, 'BP')
            .subscribe((res) => {
                this.comments = res['data'].slice(0);
            });
    }

    resetPaymentPlan() {
        this.getUserData();
    }

    getUserData() {
        this.userData = this.route.snapshot.data['userData'].data;
    }

    subToPaymentPostEvent() {

        this.paymentPostSub = this.paymentPlanStore.postPlanEvent$.subscribe(() => {
            this.postPlan();
        });
    }

    unSubFromPaymentPost() {
        if (this.paymentPostSub) {
            this.paymentPostSub.unsubscribe();
        }
    }

    ngOnDestroy() {
        this.unSubFromPaymentPost();
    }

    onPaste(event: ClipboardEvent) {
        this.pasteCount++;
        this.pastedText = event.clipboardData.getData("text").trim().replace(/\s/g, "").replace(",", ".");
    }

    onPaste_(event: ClipboardEvent, article, index, keyIndex, date) {
        this.pasteCount++;
        this.pastedText = event.clipboardData.getData("text").trim().replace(/\s/g, "").replace(",", ".");
        this.getSame(this.pastedText, article, index, keyIndex, date);
    }

    onPasteEvent($event) {
        this.onPaste_($event.event, $event.article, $event.index, $event.keyIndex, $event.date)
    }

    ngAfterViewInit() {

        if (this.inputElement != null) {
            this.renderer.listen(
                this.inputElement.nativeElement,
                "paste",
                (event) => {
                    this.onPaste(event);
                }
            );
        }

        this.setDatePicker();
    }

    setDatePicker() {
        const datepickerOptions2 = {
            format: "yyyy-mm-dd",
            calendarWeeks: true,
            autoclose: true,
            language: this.language,
            todayHighlight: true,
            currentWeek: true,
            currentWeekTransl: this.translate.instant("Week"),
            currentWeekSplitChar: "-",
            startDate: new Date(this.userData[this.selectedPaymentPlan].date.split(" ")[0]),
        };

        setTimeout(() => {

            $("#inpt8")
                .datepicker(datepickerOptions2)

                .on("changeDate", (ev) => {
                    this.userData[this.selectedPaymentPlan].dueDate = ev.target.value;
                    this.changeDueDate = false;
                })
                .on("blur", (e) => {
                    this.userData[this.selectedPaymentPlan].isSaved = 0;
                });
            this.generateDatePickerForArticles();

        }, 100);
    }


    generateDatePickerForArticles() {
        this.userData[this.selectedPaymentPlan].month_span.forEach((month) => {
            const date = month.date;
            month.articleKeys.forEach((articlegroup, keyindex) => {

              const articleGroup = month.articles[articlegroup];
                articleGroup.forEach((article, index) => {
                  article
                    const datepickerOptions = {
                        format: "yyyy-mm-dd",
                        calendarWeeks: true,
                        autoclose: true,
                        language: this.language,
                        todayHighlight: true,
                        startDate: new Date(`${month.year}-${month.datenumber}-01`)
                    };

                    $(`#invoice_day${index}${keyindex}${date}`).datepicker(datepickerOptions);
                    if (article.Invoice_day == `${month.year}-${month.datenumber}-25`) {
                        $(`#invoice_day${index}${keyindex}${date}`).datepicker('setDate', new Date(`${month.year}-${month.datenumber}-25`));
                    }

                    $(`#invoice_day${index}${keyindex}${date}`).click(function () {
                        $(`#invoice_day${index}${keyindex}${date}`).datepicker('show');
                    });

                    if (keyindex == 0) {
                        $(`#invoice_day${index}${keyindex}${date}`)
                            .datepicker(datepickerOptions)
                            .on("changeDate", (ev) => {
                                const fulldate = moment(ev.date).format("YYYY-MM-DD");
                                article.Invoice_day = fulldate;
                                  this.addDatesToRestOfArticles(month, articlegroup, fulldate);
                            });
                    }

                    if (keyindex != 0) {
                       $(`#invoice_day${index}${keyindex}${date}`).prop("disabled", true);
                       $(`#invoice_day${index}${keyindex}${date}`).css('cursor', 'not-allowed');
                    }

                    if (article.id != -1) {
                        $(`#invoice_day${index}${keyindex}${date}`).datepicker(
                            "setDate",
                            new Date(article.Invoice_day)
                        );
                    }
                    else {
                        const jQueryObj = $(`#invoice_day${index}${keyindex}${date}`);

                        const date_ = this.getFirstArticleInGroup(keyindex, month);

                        if (!article.invoiceDaySet && jQueryObj.length) {
                            jQueryObj.datepicker(
                                'setDate',
                                date_
                            );
                            article.invoiceDaySet = true;
                        }
                    }
                });
            });

        });
    }

    getFirstArticleInGroup(keyindex, month) {

      let date = new Date(`${month.year}-${month.datenumber}-25`);

      if (keyindex !== 0) {
        const articlegroup =  month.articleKeys[0];
        const article = month.articles[articlegroup][0];
        date = new Date(article.Invoice_day);
      }

      return date;
    }

    addDatesToRestOfArticles(month, articlegroup, date) {
      month.articleKeys.forEach((articlegroup_)=>{
        if (articlegroup_ !== articlegroup) {
          month.articles[articlegroup_].forEach((article_)=>{
            article_.Invoice_day = date;
          });
        }
      });
    }

    //Back button
    goBack() {
        const projectID = this.project.data.id;

        this.router.navigate(["/projects/view/" + projectID]);
    }

    //Drag and drop
    drop(event: CdkDragDrop<string[]>, month, monthIndex) {
        moveItemInArray(month.articleKeys, event.previousIndex, event.currentIndex);
        month.articleKeys = month.articleKeys.slice(0);
        this.refreshMonthArticles(month, month.articleKeys);
        this.updtSaveStatus();
        this.userData[this.selectedPaymentPlan].month_span[monthIndex] = month;
        this.recalculateArreasTotals(this.userData[this.selectedPaymentPlan]);
        setTimeout(() => {
            this.generateDatePickerForArticles();
        }, 500);
    }

    refreshMonthArticles(month, articleKeys) {
        articleKeys.forEach((key) => {
            month.articles[key] = month.articles[key].map((item) => {

                return { ...item };
            });
        });
    }

    //Close popup
    closeP() {
        this.dotsDiv = false;
    }


    //Get by Y
    popUp(index, keyIndex, month, monthIndex, selectedArticle, event) {

        event.stopPropagation();
        this.dotsDiv = !this.dotsDiv;

        this.selectedArticle = selectedArticle;

        const elem = document.getElementById(
            "calendar-table-" + index + keyIndex + month.date
        );
        const position = elem.getBoundingClientRect();

        this.modalPosition.top = position.top - 100;
        this.modalPosition.left = position.left + position.width;

        this.modalInfo = {
            monthIndex: monthIndex,
            index: index,
            keyIndex: keyIndex,
            articleKeys: this.userData[this.selectedPaymentPlan].month_span[monthIndex].articleKeys,
            articles:
                this.userData[this.selectedPaymentPlan].month_span[monthIndex].articles,
        };
    }

    addEmptyGroupSplice(event: any) {
        const randomString = Math.random().toString(36).slice(3) + Math.random().toString(36).slice(3);
        const month = this.userData[this.selectedPaymentPlan].month_span[event.monthIndex];
        month.articleKeys.splice(event.keyIndex, 0, randomString);
        month.articleKeys = month.articleKeys.splice(0);
        month.articles[randomString] = [this.generateNewEmptyArticle(randomString)];
        this.refreshMonthArticles(month, month.articleKeys);
        setTimeout(() => {
            this.generateDatePickerForArticles();
        }, 500);
    }

    displayPop() {
        this.show = !this.show;
    }

    dropSend() {
        this.buttonToggle = !this.buttonToggle;
    }

    shutDown() {
        this.buttonToggle = false;
        this.spinner = false;
    }

    generateNewEmptyArticle(randomGroup = '') {
        const randomString = Math.random().toString(36).slice(3) + Math.random().toString(36).slice(3);
        return {
            Activity: "",
            Amount: "",
            Arrears: "",
            Balance: "",
            Invoice_date: "",
            Invoice_day: "",
            Invoiced: "",
            Name: "",
            Sort: "",
            id: -1,
            modalOpen: false,
            randomGroup: randomGroup,
            clientId: randomString
        };
    }

    //Dropdown buttons
    dropTop() {
        this.dropdownTop = !this.dropdownTop;
    }

    optionsDownDiv() {

        this.optionsDown = !this.optionsDown;
        if (this.optionsDown == true) {
            this.dotsColor = "#FFFFFF";
        } else {
            this.dotsColor = "#82a7e2";
        }
    }

    //Modal open
    trueOpacity() {
        this.modalOpen = !this.modalOpen;
    }

    //HTTP
    deleteThisRow(article: any, monthIndex, index, keyIndex) {

        const randomGroup = article.randomGroup;

        if (article.id == -1 && article.Name == "" && article.Amount == "") {
            this.toastr.info(
                this.translate.instant("Can't delete the only row in a month"),
                this.translate.instant("Info")
            );
            return;
        } else if (article.id == -1 && article.Name !== "") {
            delete this.userData[this.selectedPaymentPlan].month_span[monthIndex].articles[randomGroup];
            this.userData[this.selectedPaymentPlan].month_span[monthIndex].articleKeys =
                this.userData[this.selectedPaymentPlan].month_span[monthIndex].articleKeys.filter((key) => {
                    return randomGroup != key;
                });

            this.recalculateArreasTotals(this.userData[this.selectedPaymentPlan]);

            this.toastr.success(
                this.translate.instant("You have successfully deleted article."),
                this.translate.instant("Success")
            );
        } else {
            if (index == 0) {
                this.http.deleteRow(randomGroup, 0, this.userData[this.selectedPaymentPlan].ID).subscribe((res) => {
                    delete this.userData[this.selectedPaymentPlan].month_span[monthIndex].articles[randomGroup];
                    this.userData[this.selectedPaymentPlan].month_span[monthIndex].articleKeys =
                        this.userData[this.selectedPaymentPlan].month_span[monthIndex].articleKeys.filter((key) => {
                            return randomGroup != key;
                        });

                    this.recalculateArreasTotals(this.userData[this.selectedPaymentPlan]);

                    this.toastr.success(
                        this.translate.instant("You have successfully deleted article."),
                        this.translate.instant("Success")
                    );
                });
            } else {
                this.http.deleteRow(0, article.id, this.userData[this.selectedPaymentPlan].ID).subscribe((res) => {
                    delete this.userData[this.selectedPaymentPlan].month_span[monthIndex].articles[randomGroup][index];
                    this.userData[this.selectedPaymentPlan].month_span[monthIndex].articles[randomGroup] =
                        this.userData[this.selectedPaymentPlan].month_span[monthIndex].articles[randomGroup].filter((key) => {
                            return index != key;
                        });

                    this.recalculateArreasTotals(this.userData[this.selectedPaymentPlan]);

                    this.toastr.success(
                        this.translate.instant("You have successfully deleted article."),
                        this.translate.instant("Success")
                    );
                });
            }
        }

    }

    detectKeydown($event) {
      this.isChanged = true;
    }

    //Delete month in table
    deleteTheMonth(month: any, monthIndex) {
        this.http.deleteTheMonth(month.id, this.userData[this.selectedPaymentPlan].ID).subscribe((res) => {
            delete this.userData[this.selectedPaymentPlan].month_span[monthIndex];
            this.userData[this.selectedPaymentPlan].month_span =
                this.userData[this.selectedPaymentPlan].month_span.filter((key) => {
                    return month.id != key;
                });

            this.toastr.success(
                this.translate.instant("You have successfully deleted month."),
                this.translate.instant("Success")
            );
        });
    }

    //Refresh
    refresh(): void {
        window.location.reload();
    }

    //Get details
    getDetails(init = false) {
        this.spinner = true;
        this.http
            .getProjectData(this.route.snapshot.params["id"])
            .subscribe((res: any) => {
                if (res.status) {
                    this.userData = this.initialArrearsCalc(res.data);
                    this.getStatusDetail(this.userData[this.selectedPaymentPlan].status);
                    this.getTotal();
                    this.getTotalArr();
                    this.getTotalInvoiced();
                    this.spinner = false;
                    this.isDisabled = false;
                    this.setActivePayments(this.userData.length - 1);
                    if(init) {
                        this.initializeData();
                    }
                }
            });

    }

    //Side PDF
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

    //Change icon color
    triggerOfEdit() {
        const data = this.userData[this.selectedPaymentPlan];

        data["projectID"] = this.project.data.id;
        data["amount_by_percentage"] = Number(
            data["amount_by_percentage"]
                .toString()
                .replace(/\s/g, "")
                .replace(",", ".")
        );
        data["sumAmount"] = Number(
            data["sumAmount"].toString().replace(/\s/g, "").replace(",", ".")
        );
        data["sumBalance"] = Number(
            data["sumBalance"].toString().replace(/\s/g, "").replace(",", ".")
        );
        data["sumArrears"] = Number(
            data["sumArrears"].toString().replace(/\s/g, "").replace(",", ".")
        );
        data["sumInvoiced"] = Number(
            data["sumInvoiced"].toString().replace(/\s/g, "").replace(",", ".")
        );
        data["editContractAmount"] = Number(
            data["editContractAmount"].toString().replace(/\s/g, "").replace(",", ".")
        );

        data.month_span = data.month_span.map((month_span) => {

            month_span.articleKeys.forEach((key) => {

                month_span.articles[key] = month_span.articles[key].map((article) => {
                    this.spinner = false;
                    return {
                        ...article,
                        Amount: Number(
                            article.Amount.toString().replace(/\s/g, "").replace(",", ".")
                        ),
                        Arrears: Number(
                            article.Arrears.toString().replace(/\s/g, "").replace(",", ".")
                        ),
                        Balance: Number(
                            article.Balance.toString().replace(/\s/g, "").replace(",", ".")
                        ),
                        Invoiced: Number(
                            article.Invoiced.toString().replace(/\s/g, "").replace(",", ".")
                        ),
                    };
                });
            });
            return month_span;
        });

        data.editstatus = 5;
        this.spinner = true;

        this.http
            .manuallyRejectPaymentPlan(this.userData[this.selectedPaymentPlan].ID, true)
            .subscribe((res) => {
                if (res["status"]) {
                    this.toastr.success(
                        this.translate.instant("Successfully rejected payment plan!"),
                        this.translate.instant("Success")
                    );
                    this.http.newRevision(data).subscribe((res: any) => {
                        if (res.status) {
                            this.getDetails();
                            this.spinner = false;
                        }
                    });
                    this.spinner = false;
                    this.optionsDown = false;
                } else {
                    this.toastr.error(
                        this.translate.instant(
                            "There was an error while rejecting payment plan!"
                        ),
                        this.translate.instant("Error")
                    );
                    this.spinner = false;
                }
            });
    }

    //Change delete month icon color
    greyTextDelete() {
        this.spinner = true;
        if (this.userData) {
            this.userData = this.userData.map((data) => {
                data.month_span.map((month_span) => {
                    const arr = month_span.articles;
                    if (arr > 1) {
                        return (this.deleteTrashIcon = this.greyTrash);
                        this.spinner = false;
                    } else {
                        this.deleteTrashIcon = this.defaultTrashColor;
                        this.spinner = false;
                    }
                    return month_span;
                });
                return data;
            });
        }
    }

    //Project name
    getName() {
        this.spinner = true;
        this.http
            .getNameOfProject(this.route.snapshot.params["id"])
            .subscribe((res: any) => {
                this.spinner = false;
                return (this.project = res);
            });
    }

    getAll() {
        this.totalArr;
        this.totalInvoice;
    }

    resetArticleArrears(selectedPlan) {
        selectedPlan.month_span.forEach((month) => {

            month.articleKeys.forEach((key) => {

                month.articles[key].forEach((article) => {
                    if (article.Invoice_date === "") {
                        article.Arrears = formatNumber(0, "fr", "1.2-2");
                        this.getTotal();
                        this.getTotalArr();
                        this.getTotalInvoiced();
                        this.getTotalBalance();
                    }

                })
            });
        });
    }

    extractSortedArticles(selectedPlan) {
        const sortedArticles = [];
        selectedPlan.month_span.forEach((month, monthIndex) => {
            month.articleKeys.forEach((key, articleKeyIndex) => {
                month.articles[key].forEach((article, articleIndex) => {
                    if (article.Amount !== "") {
                        const arrearsValue = Number(article.Arrears.toString().replace(/\s/g, "").replace(",", "."));
                        sortedArticles.push({
                            value: arrearsValue,
                            monthIndex: monthIndex,
                            articleKey: key,
                            articleIndex: articleIndex,
                            articleKeyIndex: articleKeyIndex
                        });
                    }
                });
            });
        });
        return sortedArticles.sort((a, b) => b.value - a.value);
    }


    recalculateArreasTotals(selectedPlan) {

        const per = selectedPlan.percentage;
        this.resetArticleArrears(selectedPlan);
        selectedPlan.month_span.forEach((month) => {

            month.articleKeys.forEach((key) => {

                month.articles[key].forEach((article) => {

                    if (article.Amount !== "" && article.Invoice_date == "") {

                        const amount_by_percentage = this.getArticleAmountByPercentage(
                            article.clientId,
                            month.date,
                            selectedPlan
                        );

                        const amount = article.Amount.toString().replace(/\s/g, "").replace(",", ".");
                        let arr = (amount / 100) * per;
                        arr = arr > amount_by_percentage ? amount_by_percentage : arr;

                        const invoiced = amount - arr;

                        article.Amount = formatNumber(amount, "fr", "1.2-2");
                        article.Balance = formatNumber(amount, "fr", "1.2-2");
                        article.Arrears = formatNumber(arr, "fr", "1.2-2");
                        article.Invoiced = formatNumber(invoiced, "fr", "1.2-2");

                    }

                    this.getTotal();
                    this.getTotalArr();
                    this.getTotalInvoiced();
                    this.getTotalBalance();
                });
            });
        });
    }

    getSameEvent($event) {
        this.getSame($event.value, $event.article, $event.index, $event.keyIndex, $event.date);
    }

    getArticleAmountByPercentage(clientId, month_date, selectedPlan) {

        let amount_by_percentage = Number(
            selectedPlan.amount_by_percentage
                .toString()
                .replace(/\s/g, "")
                .replace(",", ".")
        );

        if (this.sumArrearsInvoiced && parseFloat(this.sumArrearsInvoiced.toString().replace(/\s/g, "").replace(",", ".")) > 0) {
            amount_by_percentage = amount_by_percentage - parseFloat(this.sumArrearsInvoiced.toString().replace(/\s/g, "").replace(",", "."))
        }


        selectedPlan.month_span.forEach((month) => {
            month.articleKeys.forEach((key) => {

                month.articles[key].forEach((article, a_index) => {


                    if (article.clientId == clientId && month_date == month.date) {
                        return;
                    }

                    if (article.Invoice_date == "") {

                        amount_by_percentage =
                            amount_by_percentage -
                            Number(
                                article.Arrears.toString().replace(/\s/g, "").replace(",", ".")
                            );
                        article.amount_by_percentage = formatNumber(
                            amount_by_percentage,
                            "fr",
                            "1.2-2"
                        );
                    }
                });
            });
        });
        return amount_by_percentage < 0 ? 0 : amount_by_percentage;
    }

    public setAmount = false;
    getSame(value, article, index, keyIndex, month_date) {

        const selectedPlan = this.userData[this.selectedPaymentPlan];
        const per = selectedPlan.percentage;
        const sumArrears = Number(selectedPlan.sumArrears.toString().replace(/\s/g, "").replace(",", "."));

        const amount_by_percentage = this.getArticleAmountByPercentage(
            article.clientId,
            month_date,
            selectedPlan
        );

        let amount = Number(value.toString().replace(/\s/g, "").replace(",", "."))
        let arr = (amount / 100) * per;
        arr = arr > amount_by_percentage ? amount_by_percentage : arr;
        const invoiced = amount - arr;

        article.Amount = formatNumber(amount, "fr", "1.2-2");
        article.Balance = formatNumber(amount, "fr", "1.2-2");
        article.Invoiced = formatNumber(invoiced, "fr", "1.2-2");
        this.getTotal();
        this.getTotalArr();
        this.getTotalInvoiced();
        this.getTotalBalance();
        this.getAll();

        const contractAmount = this.userData[this.selectedPaymentPlan].editContractAmount != 0 ?
            Number(this.userData[this.selectedPaymentPlan].editContractAmount.toString().replace(/\s/g, "").replace(",", ".")) :
            this.project.data.contractAmount;

        const diff = contractAmount - Number(
            this.userData[this.selectedPaymentPlan].sumAmount.toString().replace(/\s/g, "").replace(",", ".")
        );

        article.Amount = diff < 0 ? (Number(amount) + diff) : amount;
        article.Balance = diff < 0 ? formatNumber((Number(amount) + diff), "fr", "1.2-2") : formatNumber(amount, "fr", "1.2-2");
        article.Invoiced = diff < 0 ? formatNumber(((Number(amount) + diff)) - ((Number(amount) + diff) / 100) * per, "fr", "1.2-2") : formatNumber(invoiced, "fr", "1.2-2");

        if (sumArrears <= contractAmount) {
            article.Arrears = diff < 0 ? formatNumber(((Number(amount) + diff) / 100) * per, "fr", "1.2-2") : formatNumber(arr, "fr", "1.2-2");

        } else {
            article.Arrears = formatNumber(0, "fr", "1.2-2");
        }

        this.recalculateArreasTotals(selectedPlan);

        this.getTotal();
        this.getTotalArr();
        this.getTotalInvoiced();
        this.getTotalBalance();
        this.getAll();

        if (diff < 0) {
            this.setAmount = !this.setAmount;
        }
    }

    conditionallyCalculateRemainder(articleId) {
        if (articleId === this.clickedArticle) {
            const contractAmount = this.userData[this.selectedPaymentPlan].editContractAmount != 0 ?
                Number(this.userData[this.selectedPaymentPlan].editContractAmount.toString().replace(/\s/g, "").replace(",", ".")) :
                this.project.data.contractAmount;
            const sumAmount = Number(
                this.userData[this.selectedPaymentPlan].sumAmount.toString().replace(/\s/g, "").replace(",", ".")
            );
            return contractAmount - sumAmount > 0 ? formatNumber(contractAmount - sumAmount, "fr", "1.2-2") : 0;
        }

        return '';
    }

    validateName(value, article) {
        article.nameError = value === "" ? true : false;
    }

    // skipToNextArticle(value, month, key, info) {
    //   if (value.length < 50) return;

    //   const index = info.index;
    //   const keyIndex = info.keyIndex;
    //   const monthDate = info.monthDate;

    //   const nextArticle = this.getNextArticle(index, keyIndex, monthDate);
    //   if (!nextArticle) {

    //     this.addEmptyArticleInsideGroup(month, key);

    //     setTimeout(() => {
    //       const nextArticle2 = this.getNextArticle(index, keyIndex, monthDate);
    //       nextArticle2.focus();
    //     }, 100);
    //     return;
    //   }
    //   nextArticle.focus();
    // }

    addEmptyArticleInsideGroup(month, key) {
        const randomGroup = month.articles[key][0].randomGroup;
        month.articles[key].push(this.generateNewEmptyArticle(randomGroup));
        month.articles[key] = month.articles[key].slice(0);
    }

    getNextArticle(index, keyIndex, monthDate) {
        return document.getElementById(`name${index + 1}${keyIndex}${monthDate}`);
    }

    getPerc(value) {
        value = value ? value.toString().replace(/\s/g, "").replace(",", ".") : 0;
        const selectedPlan = this.userData[this.selectedPaymentPlan];
        const per_ca = selectedPlan.percentage_ca;
        selectedPlan.change_percentage = true;
        const contractAmount = this.userData[this.selectedPaymentPlan].editContractAmount != 0 ?
            Number(this.userData[this.selectedPaymentPlan].editContractAmount.toString().replace(/\s/g, "").replace(",", ".")) :
            this.project.data.contractAmount;

        let amount_by_percentage = (contractAmount / 100) * per_ca;
        this.percentage_invoiced = value < per_ca ? per_ca : 0;

        if (value < per_ca) {
            value = per_ca;
        } else {
            this.userData = this.userData.map((data) => {
                let totalAmount = 0;
                let totalBelop = 0;

                data.month_span = data.month_span.map((month_span) => {

                    month_span.articleKeys.forEach((key) => {

                        month_span.articles[key] = month_span.articles[key].map((article: any) => {
                            const amount = Number(
                                article.Amount.toString().replace(/\s/g, "").replace(",", ".")
                            );
                            let sameBelop = (amount / 100) * value;

                            let invoiced = Number(
                                article.Invoiced.toString().replace(/\s/g, "").replace(",", ".")
                            );
                            totalAmount = totalAmount + amount;

                            if (amount_by_percentage > (totalBelop + parseFloat(this.sumArrearsInvoiced.toString().replace(/\s/g, "").replace(",", "."))) && article.Invoice_date == "") {
                                if (sameBelop > amount_by_percentage - (totalBelop + parseFloat(this.sumArrearsInvoiced.toString().replace(/\s/g, "").replace(",", ".")))) {
                                    sameBelop = amount_by_percentage - (totalBelop + parseFloat(this.sumArrearsInvoiced.toString().replace(/\s/g, "").replace(",", ".")));
                                }
                                totalBelop = totalBelop + sameBelop;

                                if (article.Invoice_date == "") {
                                    article.Arrears = formatNumber(sameBelop, "fr", "1.2-2");
                                    invoiced = amount - sameBelop;
                                }

                            } else {
                                if (article.Invoice_date == "") {
                                    article.Arrears = formatNumber(0, "fr", "1.2-2");
                                    invoiced = amount;
                                }
                            }

                            article.Balance = formatNumber(amount, "fr", "1.2-2");
                            article.Invoiced = formatNumber(invoiced, "fr", "1.2-2");

                            return article;
                        });

                    });

                    return month_span;
                });


                data.sumAmount = formatNumber(totalAmount, "fr", "1.2-2");
                return data;

            });
        }

        this.getTotalArr();
        this.getTotalInvoiced();
        this.getTotal();
        this.getTotalBalance();
    }

    getPercCa(value) {
        const selectedPlan = this.userData[this.selectedPaymentPlan];
        const contractAmount = this.userData[this.selectedPaymentPlan].editContractAmount != 0 ?
            Number(this.userData[this.selectedPaymentPlan].editContractAmount.toString().replace(/\s/g, "").replace(",", ".")) :
            this.project.data.contractAmount;

        const per1 = selectedPlan.percentage;
        selectedPlan.percentage_ca = value;
        let per2 = value;

        if (per2 > per1) {
            const amount_by_percentage = this.numberPipe.transform(
                (contractAmount / 100) * per1,
                "1.2-2",
                "fr"
            );
            this.userData[this.selectedPaymentPlan] = {
                ...selectedPlan,
                percentage_ca: per1,
                amount_by_percentage: amount_by_percentage,
            };
        } else {
            let diff = 0;
            let amount_by_percentage = this.numberPipe.transform(
                (contractAmount / 100) * per2,
                "1.2-2",
                "fr"
            );
            if (this.sumArrearsInvoiced) {
                diff = Number(amount_by_percentage.toString().replace(/\s/g, "").replace(",", ".")) <
                    parseFloat(this.sumArrearsInvoiced.toString().replace(/\s/g, "").replace(",", ".")) ?
                    parseFloat(this.sumArrearsInvoiced.toString().replace(/\s/g, "").replace(",", ".")) :
                    Number(amount_by_percentage.toString().replace(/\s/g, "").replace(",", "."))

            }
            amount_by_percentage = diff > 0 ? this.numberPipe.transform(diff, "1.2-2", "fr") : amount_by_percentage;

            this.percentage_ca_invoiced = this.sumArrearsInvoiced ? (parseFloat(this.sumArrearsInvoiced.toString().replace(/\s/g, "").replace(",", ".")) * 100 / contractAmount).toFixed(2) : 0;
            selectedPlan.change_percentage_ca = true;

            this.userData[this.selectedPaymentPlan] = {
                ...selectedPlan,
                amount_by_percentage: amount_by_percentage,
            };

        }

        this.percentage_ca_invoiced = (parseFloat(value) <= parseFloat(this.percentage_ca_invoiced)) ? this.percentage_ca_invoiced : 0

        this.recalculateArreasTotals(this.userData[this.selectedPaymentPlan]);

        this.getTotal();
        this.getTotalArr();
        this.getTotalInvoiced();
        this.getTotalBalance();
    }

    getTotal() {
        this.userData.map((data) => {
            let totalAmount = 0;
            data.month_span = data.month_span.map((month_span) => {

                month_span.articleKeys.forEach((key) => {

                    month_span.articles[key] = month_span.articles[key].map((article: any) => {
                        const sanitizedAmount = Number(
                            article.Amount.toString().replace(/\s/g, "").replace(",", ".")
                        );
                        totalAmount = totalAmount + sanitizedAmount;
                        return article;
                    });

                });

                return month_span;
            });

            data.sumAmount = formatNumber(totalAmount, "fr", "1.2-2");

            return data;

        });
    }

    getTotalSumAmount() {
        this.userData.map((data) => {
            let totalAmount = 0;
            data.month_span = data.month_span.map((month_span) => {

                month_span.articleKeys.forEach((key) => {

                    month_span.articles[key] = month_span.articles[key].map((article: any) => {
                        const sanitizedAmount = Number(
                            article.Amount.toString().replace(/\s/g, "").replace(",", ".")
                        );
                        totalAmount = totalAmount + sanitizedAmount;
                        return article;
                    });

                });

                return month_span;
            });

            data.sumAmount = formatNumber(totalAmount, "fr", "1.2-2");

            return data.sumAmount;

        });
    }

    getTotalBalance() {
        this.userData.map((data) => {
            let totalAmount = 0;
            data.month_span = data.month_span.map((month_span) => {


                month_span.articleKeys.forEach((key) => {

                    month_span.articles[key] = month_span.articles[key].map((article: any) => {
                        const sanitizedAmount = Number(
                            article.Balance.toString().replace(/\s/g, "").replace(",", ".")
                        );
                        totalAmount = totalAmount + sanitizedAmount;
                        return article;
                    });
                });


                return month_span;
            });

            data.sumBalance = formatNumber(totalAmount, "fr", "1.2-2");
            return data;
        });
    }

    getTotalBalanceInvoiced() {
        this.userData.map((data) => {
            let totalAmount = 0;
            data.month_span = data.month_span.map((month_span) => {

                month_span.articleKeys.forEach((key) => {

                    month_span.articles[key] = month_span.articles[key].map((article: any) => {

                        if (article.Invoice_date != "") {
                            const sanitizedAmount = Number(
                                article.Balance.toString().replace(/\s/g, "").replace(",", ".")
                            );
                            totalAmount = totalAmount + sanitizedAmount;
                        }
                        return article;
                    });
                });


                return month_span;
            });

            this.sumBalanceInvoiced = formatNumber(totalAmount, "fr", "1.2-2");
            return data;
        });
    }

    getTotalArr() {
        this.userData.map((data) => {
            let totalAmount = 0;
            data.month_span = data.month_span.map((month_span) => {

                month_span.articleKeys.forEach((key) => {

                    month_span.articles[key] = month_span.articles[key].map((article: any) => {
                        const sanitizedArr = Number(
                            article.Arrears.toString().replace(/\s/g, "").replace(",", ".")
                        );
                        totalAmount = totalAmount + sanitizedArr;
                        return article;
                    });
                });

                return month_span;
            });
            data.sumArrears = formatNumber(totalAmount, "fr", "1.2-2");
            return data;
        });
    }

    getTotalArrInvoiced() {
        this.userData.map((data) => {
            let totalAmount = 0;
            data.month_span = data.month_span.map((month_span) => {

                month_span.articleKeys.forEach((key) => {

                    month_span.articles[key] = month_span.articles[key].map((article: any) => {
                        if (article.Invoice_date != "") {
                            const sanitizedArr = Number(
                                article.Arrears.toString().replace(/\s/g, "").replace(",", ".")
                            );
                            totalAmount = totalAmount + sanitizedArr;
                        }
                        return article;
                    });
                });

                return month_span;
            });

            this.sumArrearsInvoiced = formatNumber(totalAmount, "fr", "1.2-2");
            return data;
        });
    }

    getTotalInvoiced() {
        this.userData.map((data) => {
            let totalAmount = 0;
            data.month_span = data.month_span.map((month_span) => {

                month_span.articleKeys.forEach((key) => {

                    month_span.articles[key] = month_span.articles[key].map((article: any) => {
                        const sanitizedInvoiced = Number(
                            article.Invoiced.toString().replace(/\s/g, "").replace(",", ".")
                        );
                        totalAmount = totalAmount + sanitizedInvoiced;
                        return article;
                    });
                });
                return month_span;
            });
            let final_total = 0;
            if((this.userData[this.selectedPaymentPlan].status == 6 || this.userData[this.selectedPaymentPlan].status == 2 ) &&  this.userData[this.selectedPaymentPlan].final_invoice_status > 0) {
                final_total = Number(this.userData[this.selectedPaymentPlan].total_of_final_invoices);
            }

            totalAmount = totalAmount  + final_total;
            data.sumInvoiced = formatNumber(totalAmount, "fr", "1.2-2");
            return data;
        });
    }

    getTotalAcceptedInvoiced() {
        this.userData.map((data) => {
            let totalAmount = 0;
            data.month_span = data.month_span.map((month_span) => {

                month_span.articleKeys.forEach((key) => {

                    month_span.articles[key] = month_span.articles[key].map((article: any) => {
                        if (article.Invoice_date != "") {
                            const sanitizedInvoiced = Number(
                                article.Invoiced.toString().replace(/\s/g, "").replace(",", ".")
                            );
                            totalAmount = totalAmount + sanitizedInvoiced;
                        }
                        return article;
                    });
                });
                return month_span;
            });

            let final_total = 0;

            if(this.userData[this.selectedPaymentPlan].status == 2 &&  this.userData[this.selectedPaymentPlan].final_invoice_status > 0) {
                final_total = Number(this.userData[this.selectedPaymentPlan].total_of_final_invoices);
            }

            totalAmount = totalAmount  + final_total;
            this.sumAcceptedInvoiced = formatNumber(totalAmount, "fr", "1.2-2");
            return data;
        });
    }

    clientWorkerName(workerName: any) {
        this.http.getClientWorkers(workerName.id).subscribe((res) => {
            return res;
        });
    }

    percentageCheck() {
        this.userData.map((data) => {
            data.month_span = data.month_span.map((month_span) => {

                return month_span;
            });
            return data;
        });
    }

    Contact;

    checkIfContactSelected(contact) {
        // if (
        //     this.contacts.some((selectedWorker) => selectedWorker.Id == contact.Id)
        // ) {
        //     return true;
        // } else return false;

        this.contacts = contact;
        this.Contact = this.contacts;
    }

    buttonNameSummary(worker) {
      this.checkIfContactSelected(worker);
        // event.stopPropagation();
        if (worker) {
            this.buttonToggle = true;
            if (this.contacts.some((selectedWorker) => selectedWorker.Id == worker.Id)) {
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

    findMailInClientResponses(email, clientResponses) {
        return clientResponses.find(response => email === response.answerEmail.trim());
    }

    decideIfShouldEnableWorker(worker) {
        const selectedPlan = this.userData[this.selectedPaymentPlan];
        const clientResponses = selectedPlan.clientResponses.filter(
            (res) => res["Status"] == 2
        );

        const workerEmail = worker.email.trim();
        let response = this.findMailInClientResponses(workerEmail, clientResponses);
        response = selectedPlan.status == 0 || selectedPlan.status == 1 ? response : null;
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

    printPaymentPlan() {
        this.updatePaymentplan(false, false, false, false, true).then((res) => {
            if (res["status"]) {
                this.userData[this.selectedPaymentPlan]['pdfURL'] = res["paymentplan"]["data"]["pdfURL"];
                printJS(this.userData[this.selectedPaymentPlan]['pdfURL']);
            }
        })
    }

    async updatePaymentplan(
        addReminder = true,
        showToastr = true,
        update_email_log = false,
        reminder,
        print = false
    ) {
        this.spinner = true;
        let response = null;

        const data = this.userData[this.selectedPaymentPlan];

        data["projectID"] = this.project.data.id;
        data["amount_by_percentage"] = Number(
            data["amount_by_percentage"]
                .toString()
                .replace(/\s/g, "")
                .replace(",", ".")
        );
        data["sumAmount"] = Number(
            data["sumAmount"].toString().replace(/\s/g, "").replace(",", ".")
        );

        data["sumBalance"] = Number(
            data["sumBalance"].toString().replace(/\s/g, "").replace(",", ".")
        );
        data["sumArrears"] = Number(
            data["sumArrears"].toString().replace(/\s/g, "").replace(",", ".")
        );
        data["sumInvoiced"] = Number(
            data["sumInvoiced"].toString().replace(/\s/g, "").replace(",", ".")
        );
        data["editContractAmount"] = Number(
            data["editContractAmount"].toString().replace(/\s/g, "").replace(",", ".")
        );

        data.month_span = data.month_span.map((month_span) => {

            month_span.articleKeys.forEach((key) => {

                month_span.articles[key] = month_span.articles[key].map((article) => {
                    return {
                        ...article,
                        Amount: Number(
                            article.Amount.toString().replace(/\s/g, "").replace(",", ".")
                        ),
                        Arrears: Number(
                            article.Arrears.toString().replace(/\s/g, "").replace(",", ".")
                        ),
                        Balance: Number(
                            article.Balance.toString().replace(/\s/g, "").replace(",", ".")
                        ),
                        Invoiced: Number(
                            article.Invoiced.toString().replace(/\s/g, "").replace(",", ".")
                        ),
                    };
                });
            });
            this.spinner = false;
            return month_span;
        });

        /**************************************selected first client*************************************************************************/
        let client_worker = null;
        let contact_pom = [];

        if (update_email_log) {
            this.client_workers.forEach((client_worker, i) => {
                let cont = this.contacts.find(
                    (contact) => contact.Id == client_worker.Id
                );
                this.spinner = false;
                if (!cont) {
                    this.client_workers[i].selected = false;
                    this.spinner = false;
                } else {
                    this.client_workers[i].selected = true;
                    this.spinner = false;
                    let obj = {
                        Id: client_worker.Id,
                        Name: client_worker.Name,
                    };

                    contact_pom.push(obj);
                }
            });

            if (contact_pom.length > 0) this.spinner = false;
            this.contacts = contact_pom;

            this.selectedFirstClientWorker = this.client_workers.find(
                (client) => client.selected == true
            );

            if (this.selectedFirstClientWorker) {
                this.spinner = false;
                client_worker = this.selectedFirstClientWorker["Name"];
            }
        }

        /***************************************************************************************************************/

        data.timesReminderSent =
            reminder && addReminder
                ? this.userData[this.selectedPaymentPlan].timesReminderSent + 1
                : this.userData[this.selectedPaymentPlan].timesReminderSent;
        data.sendReminder = reminder;
        data.sendCopy = this.sendCopy;
        data.print = print;
        data.client_worker = client_worker;

        if (!data.timesReminderSent) data.timesReminderSent = 0;

        response = await this.http.updatePaymentData(data);

        if (response["status"]) {
            if (showToastr) {
                this.spinner = false;
                this.toastr.success(
                    this.translate.instant("You successfully updated Paymentplan."),
                    this.translate.instant("Success")
                );
            }
        } else {
            this.spinner = false;
            this.toastr.error(this.translate.instant("Error"));
        }

        let status = {
            status: false,
        };

        if (response && response["status"]) {
            status = response;
        }
        data["sumAmount"] = formatNumber(data["sumAmount"], "fr", "1.2-2");
        data["sumBalance"] = formatNumber(data["sumBalance"], "fr", "1.2-2");
        data["sumArrears"] = formatNumber(data["sumArrears"], "fr", "1.2-2");
        data["sumInvoiced"] = formatNumber(data["sumInvoiced"], "fr", "1.2-2");
        data["editContractAmount"] = formatNumber(data["editContractAmount"], "fr", "1.2-2");
        data["amount_by_percentage"] = formatNumber(data["amount_by_percentage"], "fr", "1.2-2");

        return status;
    }

    sendPaymenPlan(paymentplan, param) {
        this.sendCopy =
            this.userData[this.selectedPaymentPlan].status == 3 ||
                this.userData[this.selectedPaymentPlan].status == 2 ||
                this.userData[this.selectedPaymentPlan].status == 4 ||
                this.userData[this.selectedPaymentPlan].status == 6
                ? true
                : false;

        if (this.contacts.length < 1) {
            this.buttonToggle = false;
            return this.toastr.info(
                this.translate.instant(
                    "You first need to select an email where to send payment plan"
                ) + ".",
                this.translate.instant("Info")
            );
        }
        if (!this.sendCopy && this.changeDueDate
            && paymentplan.revisionDate == ""
            && (this.userData[this.selectedPaymentPlan].status == 0 ||
                this.userData[this.selectedPaymentPlan].status == 1 ||
                this.userData[this.selectedPaymentPlan].status == 5)
        ) {
            this.changeDueDate = false;
            return this.toastr.info(
                this.translate.instant("TSC_Do_you_want_to_change_due_date"),
                this.translate.instant("Info")
            );
        }

        this.buttonToggle = false;
        if (
            !this.sendCopy &&
            this.contacts.length >= 1 &&
            !this.contacts.some(
                (contact) => contact.Id == this.project.data.selectedMainContact
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

        // const additionalEmailList = this.contacts.map((contact) => {
        //   contact.email = this.client_workers.find((x) => x.Id == contact.Id).email;
        //   return contact;
        // });

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
                    this.spinner = true;
                    paymentplan.projectCustomName =
                        this.project.data.CustomName + "-" + this.project.data.name;

                    this.updatePaymentplan(true, false, false, param).then((res) => {
                        if (res["status"]) {
                            paymentplan.timesReminderSent = param
                                ? +paymentplan.timesReminderSent++
                                : paymentplan.timesReminderSent
                            paymentplan.sendReminder = param ? true : false;
                            paymentplan.pdfURL = res["paymentplan"]["data"]["pdfURL"];
                            paymentplan.pdfImagesLink =
                                res["paymentplan"]["data"]["pdfImagesLink"];
                            paymentplan.sendCopy = this.sendCopy;
                            this.emailSending = true;
                            this.spinner = true;
                            this.http
                                .sendPaymentPlanToClient(
                                    this.contacts,
                                    paymentplan,
                                    this.project.data
                                )
                                .subscribe(
                                    (response) => {
                                        if (response["status"]) {
                                            this.spinner = false;
                                            this.toastr.success(
                                                this.translate.instant(
                                                    "You have successfully sent email!"
                                                ),
                                                this.translate.instant("Success")

                                            );
                                            this.emailSending = false;
                                            paymentplan.emailsent = "1";
                                            paymentplan.timesEmailSent++;
                                            this.getEmailLogsForPP();
                                            this.getDetails();
                                            this.Contact = [];
                                        } else {
                                            this.spinner = false;
                                            this.toastr.error(
                                                this.translate.instant(
                                                    "Couldn`t send the email, please try again."
                                                ),
                                                this.translate.instant("Error")
                                            );
                                            this.emailSending = false;
                                            this.Contact = [];
                                        }
                                    }
                                );
                        }
                    });
                }
            });

    }

    getStatuses() {
        this.spinner = true;
        this.http.getPaymentPlanStatuses().subscribe((res) => {
            if (res["status"]) {
                this.statuses = res["data"];
                this.spinner = false;
            }
        });
    }

    getStatusDetail(statusid: number) {
        this.http.getPaymentPlanStatuses().subscribe((res) => {
            if (res["status"]) {
                for (let status of res["data"]) {
                    if (statusid == status.Status) {
                        this.iconColor = status.Color;
                    }
                }
            }
        });
    }

    //POST REQUEST
    postPlan() {
        this.isDirty = false;
        this.spinner = true;
        this.isDisabled = true;

        const data = this.userData[this.selectedPaymentPlan];

        data["projectID"] = this.project.data.id;
        data["amount_by_percentage"] = Number(
            data["amount_by_percentage"]
                .toString()
                .replace(/\s/g, "")
                .replace(",", ".")
        );
        data["sumAmount"] = Number(
            data["sumAmount"].toString().replace(/\s/g, "").replace(",", ".")
        );
        data["sumBalance"] = Number(
            data["sumBalance"].toString().replace(/\s/g, "").replace(",", ".")
        );
        data["sumArrears"] = Number(
            data["sumArrears"].toString().replace(/\s/g, "").replace(",", ".")
        );
        data["sumInvoiced"] = Number(
            data["sumInvoiced"].toString().replace(/\s/g, "").replace(",", ".")
        );
        data["editContractAmount"] = Number(
            data["editContractAmount"].toString().replace(/\s/g, "").replace(",", ".")
        );

        data.month_span = data.month_span.map((month_span) => {

            month_span.articleKeys.forEach((key, keyid) => {
                // month_span.articles[key].Sort = keyid;

                month_span.articles[key].forEach((el, id) => {
                    el.Sort = keyid;
                });

                month_span.articles[key] = month_span.articles[key].map((article) => {
                    return {
                        ...article,
                        Amount: Number(
                            article.Amount.toString().replace(/\s/g, "").replace(",", ".")
                        ),
                        Arrears: Number(
                            article.Arrears.toString().replace(/\s/g, "").replace(",", ".")
                        ),
                        Balance: Number(
                            article.Balance.toString().replace(/\s/g, "").replace(",", ".")
                        ),
                        Invoiced: Number(
                            article.Invoiced.toString().replace(/\s/g, "").replace(",", ".")
                        ),
                    };
                });
            });
            return month_span;
        });

        this.http.savePaymentData(data).subscribe((res) => {
            this.getDetails();
            this.spinner = false;
        });
    }

    getPaymentPlanActivities() {
        this.http
            .getPaymentPlanActivities(this.project.data.id)
            .subscribe((res: any) => {
                if (res.status) {
                    this.activities = res.data;
                }
            });
    }

    setActivePayments(index) {

        this.selectedPaymentPlan = index;
        this.buttonToggle = false;
        this.optionsDown = false;
        this.dotsColor = "#82a7e2";
        this.contacts = [];
        this.setActivePaymentPlan(index);
        this.getStatusDetail(this.userData[this.selectedPaymentPlan].status);
        setTimeout(() => {
            this.generateDatePickerForArticles();
            this.setDatePicker();
        }, 500);
    }

    changePropertyTopBtn(index) {
        let z_index = 1;
        let temp_z_index = 2 * index;
        z_index += temp_z_index;
        if (index == this.selectedPaymentPlan) {
            z_index = 500;
        }
        const style = {
            "z-index": z_index,
            "margin-left": -2 + "px",
            "box-shadow": "2px 0 13px 0px #44484c",
        };
        return style;
    }

    formatDateTime(dateTimeStr: string | null) {
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

    getEmailLogsForPP() {
        this.spinner = true;
        this.http.getEmailLogsForPP(this.project.data.id).subscribe((res) => {
            this.spinner = false;
            if (res["status"]) {

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

                            this.logs[logName].push({
                                Status: item.Status,
                                active: item.active,
                                Date: item.Date ? this.formatDateTime(item.Date) : null,
                                answerEmail: item.To,
                                sentFrom: item.From,
                                answerDate: item.Responded ? this.formatDateTime(item.Responded) : null,
                                openDate: item.Opened ? this.formatDateTime(item.Opened) : null,
                                group: item.Group,
                                show: true,
                                name: item.Name,
                                id: item.Id,
                                itemId: item.ItemID,
                                ItemType: item.ItemType,
                                manualReplay: item.manualReply,
                                files: item.sentFiles,
                                pdfs: [],
                                images: [],
                                reminder: item.reminder,
                            });
                        });

                    } catch (error) {
                      console.error('Greška prilikom dohvaćanja podataka:', error);
                    }

                this.get_last_email_log_but_first_client =
                    res["get_last_email_log_but_first_client"];
                this.spinner = false;
            }
        });
    }

    manuallyAcceptPaymentPlan() {
        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = false;
        diaolgConfig.disableClose = true;
        diaolgConfig.width = "";
        diaolgConfig.panelClass = "mat-dialog-confirmation";
        this.dialog
            .open(ConfirmationModalComponent, diaolgConfig)
            .afterClosed()
            .toPromise2()
            .then((response) => {
                if (response.result) {

                    this.spinner = true;

                    this.updatePaymentplan(false, false, false, false).then((res) => {
                        this.spinner = false;
                        if (res["status"]) {
                            this.http
                                .manuallyAcceptPaymentPlan(
                                    this.userData[this.selectedPaymentPlan].ID
                                )
                                .subscribe((res) => {
                                    this.spinner = false;
                                    if (res["status"]) {
                                        this.toastr.success(
                                            this.translate.instant(
                                                "Successfully accepted payment plan!"
                                            ),
                                            this.translate.instant("Success")
                                        );
                                        this.getDetails();
                                        this.spinner = false;
                                        this.optionsDown = false;
                                    } else {
                                        this.spinner = false;
                                        this.toastr.error(
                                            this.translate.instant(
                                                "There was an error while accepting payment plan!"
                                            ),
                                            this.translate.instant("Error")
                                        );
                                    }
                                });
                        }
                    });
                }
                this.spinner = false;
            });
    }

    manuallyRejectPaymentPlan() {

        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = false;
        diaolgConfig.disableClose = true;
        diaolgConfig.width = "";
        diaolgConfig.panelClass = "mat-dialog-confirmation";
        const data = this.userData[this.selectedPaymentPlan];

        data["projectID"] = this.project.data.id;
        data["amount_by_percentage"] = Number(
            data["amount_by_percentage"]
                .toString()
                .replace(/\s/g, "")
                .replace(",", ".")
        );
        data["sumAmount"] = Number(
            data["sumAmount"].toString().replace(/\s/g, "").replace(",", ".")
        );
        data["sumBalance"] = Number(
            data["sumBalance"].toString().replace(/\s/g, "").replace(",", ".")
        );
        data["sumArrears"] = Number(
            data["sumArrears"].toString().replace(/\s/g, "").replace(",", ".")
        );
        data["sumInvoiced"] = Number(
            data["sumInvoiced"].toString().replace(/\s/g, "").replace(",", ".")
        );
        data["editContractAmount"] = Number(
            data["editContractAmount"].toString().replace(/\s/g, "").replace(",", ".")
        );

        data.month_span = data.month_span.map((month_span) => {

            month_span.articleKeys.forEach((key) => {
                month_span.articles[key] = month_span.articles[key].map((article) => {

                    return {
                        ...article,
                        Amount: Number(
                            article.Amount.toString().replace(/\s/g, "").replace(",", ".")
                        ),
                        Arrears: Number(
                            article.Arrears.toString().replace(/\s/g, "").replace(",", ".")
                        ),
                        Balance: Number(
                            article.Balance.toString().replace(/\s/g, "").replace(",", ".")
                        ),
                        Invoiced: Number(
                            article.Invoiced.toString().replace(/\s/g, "").replace(",", ".")
                        ),
                    };
                });
            });

            return month_span;
        });
        this.dialog
            .open(ConfirmationModalComponent, diaolgConfig)
            .afterClosed()
            .subscribe((response) => {
                if (response.result) {
                    this.spinner = true;
                    this.http
                        .manuallyRejectPaymentPlan(
                            this.userData[this.selectedPaymentPlan].ID, false
                        )
                        .subscribe((res) => {

                            if (res["status"]) {
                                this.toastr.success(
                                    this.translate.instant("Successfully rejected payment plan!"),
                                    this.translate.instant("Success")
                                );
                                this.http.newRevision(data).subscribe((res: any) => {
                                    if (res.status) {
                                        this.getDetails();
                                        this.spinner = false;
                                    }
                                });
                                this.optionsDown = false;
                            } else {
                                this.toastr.error(
                                    this.translate.instant(
                                        "There was an error while rejecting payment plan!"
                                    ),
                                    this.translate.instant("Error")
                                );
                            }
                        });
                }
            });
    }

    manuallyCancelPaymentPlan() {
        this.spinner = true;
        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = false;
        diaolgConfig.disableClose = true;
        diaolgConfig.width = "";
        diaolgConfig.panelClass = "mat-dialog-confirmation";
        const data = this.userData[this.selectedPaymentPlan];

        data["projectID"] = this.project.data.id;
        data["amount_by_percentage"] = Number(
            data["amount_by_percentage"]
                .toString()
                .replace(/\s/g, "")
                .replace(",", ".")
        );
        data["sumAmount"] = Number(
            data["sumAmount"].toString().replace(/\s/g, "").replace(",", ".")
        );
        data["sumBalance"] = Number(
            data["sumBalance"].toString().replace(/\s/g, "").replace(",", ".")
        );
        data["sumArrears"] = Number(
            data["sumArrears"].toString().replace(/\s/g, "").replace(",", ".")
        );
        data["sumInvoiced"] = Number(
            data["sumInvoiced"].toString().replace(/\s/g, "").replace(",", ".")
        );
        data["editContractAmount"] = Number(
            data["editContractAmount"].toString().replace(/\s/g, "").replace(",", ".")
        );

        data.month_span = data.month_span.map((month_span) => {

            month_span.articleKeys.forEach((key) => {

                month_span.articles[key] = month_span.articles[key].map((article) => {
                    this.spinner = false;
                    return {
                        ...article,
                        Amount: Number(
                            article.Amount.toString().replace(/\s/g, "").replace(",", ".")
                        ),
                        Arrears: Number(
                            article.Arrears.toString().replace(/\s/g, "").replace(",", ".")
                        ),
                        Balance: Number(
                            article.Balance.toString().replace(/\s/g, "").replace(",", ".")
                        ),
                        Invoiced: Number(
                            article.Invoiced.toString().replace(/\s/g, "").replace(",", ".")
                        ),
                    };
                });

            });
            this.spinner = false;
            return month_span;
        });
        this.dialog
            .open(ConfirmationModalComponent, diaolgConfig)
            .afterClosed()
            .subscribe((response) => {
                if (response.result) {
                    this.http
                        .manuallyCancelPaymentPlan(
                            this.userData[this.selectedPaymentPlan].ID
                        )
                        .subscribe((res) => {
                            this.spinner = false;
                            if (res["status"]) {
                                this.toastr.success(
                                    this.translate.instant("Successfully canceled payment plan!"),
                                    this.translate.instant("Success")
                                );
                                this.http.newRevision(data).subscribe((res: any) => {
                                    this.spinner = false;
                                    if (res.status) {
                                        this.getDetails();
                                        this.spinner = false;

                                    }
                                });
                                this.optionsDown = false;
                            } else {
                                this.toastr.error(
                                    this.translate.instant(
                                        "There was an error while canceling payment plan!"
                                    ),
                                    this.translate.instant("Error")
                                );
                                this.spinner = false;
                            }
                        });
                }
            });
    }

/*     setSelectedTab(tab) {
        if ((this.userData[this.selectedPaymentPlan].isLocked == 0 && this.userData[this.selectedPaymentPlan].isSaved == 0) || this.commentStatus == false) {
            if (this.selectedTab != 1 && this.isUpdate == true ) {
                const dialogConfig = new MatDialogConfig();
                dialogConfig.autoFocus = true;
                dialogConfig.disableClose = true;
                dialogConfig.width = "185px";
                dialogConfig.data = {
                    questionText: this.translate.instant("If you leave before saving, your changes will be lost") + "?",
                };

                this.dialog
                    .open(ConfirmModalComponent, dialogConfig)
                    .afterClosed()
                    .subscribe((response) => {
                        if (response.result) {
                            if (this.selectedTab == 0) {
                                this.isUpdate = false;
                            } else if (this.selectedTab == 2) {
                                this.saveComment = this.saveComment + 1;
                                this.commentStatus = true;
                                this.isUpdate = false;
                            }
                        }else{
                          this.isUpdate = false;
                          console.log(this.selectedTab);
                        }

                        setTimeout(() => {
                            this.spinner = true;
                            this.isUpdate = false;
                            this.selectedTab = tab;
                            this.buttonToggle = false;
                            this.spinner = false;
                        }, 100);
                    });
            } else {
                this.spinner = true;
                this.isUpdate = false;
                this.selectedTab = tab;
                this.buttonToggle = false;
                this.spinner = false;
            }
        } else {
            this.spinner = true;
            this.isUpdate = false;
            this.selectedTab = tab;
            this.buttonToggle = false;
            this.spinner = false;
        }

        if (this.selectedTab == 0) {
            this.setDatePicker();
        }

    } */



    onConfirmationModal(): Promise<boolean> {
      return new Promise((resolve, reject) => {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = false;
        dialogConfig.disableClose = true;
        dialogConfig.width = "";
        dialogConfig.panelClass = "confirm-modal";
        this.dialog.open(ConfirmModalComponent, dialogConfig).afterClosed().subscribe((response) => {
          if(response.result) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    }

    async canYouChangeSelectedTab(index: number) {
      if(this.isChanged) {
        if(await this.onConfirmationModal()) {
          this.selectedTab = index;
          this.isChanged = false;
        }
        return;
      }


      this.selectedTab = index;

    }


    updatePaymentPlanComment() {
        let object = {
            id: this.userData[this.selectedPaymentPlan].ID,
        };

        this.http.updatePaymentPlanComment(object).subscribe((res) => {
            if (res["status"])
                this.toastr.success(
                    this.translate.instant("TSC_You_have_successfully_updated_comment"),
                    this.translate.instant("Success")
                );
            else this.toastr.error(this.translate.instant("Error"));
        });
    }

    lockPaymentPlan() {

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

                    const projectD = this.userData[this.selectedPaymentPlan];
                    const contractAmount = projectD.editContractAmount != 0 ? projectD.editContractAmount : this.project.data.contractAmount;

                    this.spinner = true;
                    this.http
                        .lockPaymentPlan(
                            this.project.data.id,
                            this.userData[this.selectedPaymentPlan].ID,
                            contractAmount.replace(/\s/g, "").replace(",", ".")
                        )
                        .subscribe((res: any) => {
                            if (res["status"]) {
                                this.getDetails();
                                this.spinner = false;
                            }
                        });
                }
            });
    }


    updateSaveStatus(article, event) {
      article.Activity = event;
      this.updtSaveStatus();
    }

    updtSaveStatus() {
        this.isUpdate = true;
        this.isDirty = true;
        this.spinner = true;
        this.userData[this.selectedPaymentPlan].isSaved = 0;
        this.spinner = false;
    }

    updateSaveStatusEvent($event) {
        this.isUpdate = true;
        this.isDirty = true;
        this.spinner = true;
        this.userData[this.selectedPaymentPlan].isSaved = 0;
        this.spinner = false;
    }

    public emptyArticleIndex = -1;

    addNewArticleClick(month, articleId) {
        const selectedPlan = this.userData[this.selectedPaymentPlan];
        if (selectedPlan.isLocked == 1) { return; }

        if (selectedPlan.isLocked == 0 && month.articles[month.articleKeys[0]][0].Invoice_date != '') { return; }

        const articleKeys = month.articleKeys;
        const articles = month.articles;
        this.clickedArticle = articleId;
        if (!this.emptyArticleExists(articleKeys, articles)) {
            this.addNewArticleGroup(month);
        }
    }

    addNewArticleGroup(month) {
        const randomString = this.generateRandomString();
        month.articleKeys.push(randomString);
        month.articleKeys = month.articleKeys.slice(0);
        month.articles = {
            ...month.articles,
            [randomString]: [this.generateNewEmptyArticle(randomString)]
        };
        setTimeout(() => {
            this.generateDatePickerForArticles();
        }, 500);
    }

    generateRandomString() {
        return Math.random().toString(36).slice(3) + Math.random().toString(36).slice(3);
    }

    emptyArticleExists(articleKeys, articles) {
        let flag = false;
        this.emptyArticleIndex = -1;
        for (let i = 0; i < articleKeys.length; i++) {
            for (let j = 0; j < articles[articleKeys[i]].length; j++) {
                const valid = this.checkObjValidity(articles[articleKeys[i]][0]);
                const validAmount = this.checkObjValidityAmount(articles[articleKeys[i]][0]);
                if (valid && validAmount) {
                    this.emptyArticleIndex = i;
                    flag = valid;
                    break;
                }
            }
        }
        return flag;
    }

    checkObjValidity(elem) {
        return elem["Name"] === "";
    }

    checkObjValidityAmount(elem) {
        return (elem["Amount"] === "0,00" || elem["Amount"] === "");
    }

    changeStatus(info) {
        this.commentStatus = info;
        this.isChanged = !info;
    }

    getContractAmount(value) {

        value = value ? value.replace(/\s/g, "").replace(",", ".") : 0;
        const selectedPlan = this.userData[this.selectedPaymentPlan];

        selectedPlan.editContractAmount = value;
        const per2 = selectedPlan.percentage_ca;

        const amount_by_percentage = this.numberPipe.transform(
            (value / 100) * per2,
            "1.2-2",
            "fr"
        );
        this.userData[this.selectedPaymentPlan] = {
            ...selectedPlan,
            amount_by_percentage: amount_by_percentage,
        };

        this.recalculateArreasTotals(this.userData[this.selectedPaymentPlan]);

        this.getTotal();
        this.getTotalArr();
        this.getTotalInvoiced();
        this.getTotalBalance();
    }

    getInvoicedArrears(selectedPlan) {
        this.http
            .getPaymentPlanArticlesIfInvoice(selectedPlan.ID)
            .subscribe((res: any) => {
                if (res["status"]) {
                    res["data"].forEach(element => {
                        element.Arrears = formatNumber(element.Arrears, "fr", "1.2-2");
                    });
                }
            });
    }

    setActivePaymentPlan(index) {
        this.selectedPaymentPlan = index;
    }

    fKeyDown(event, fc) {

        this.formElements = fc.querySelectorAll("input, select");

        const index = Array.prototype.indexOf.call(this.formElements, event.target);
        const nextEl = this.formElements[index + 1];

        if (nextEl) {
            if (nextEl.id == "balance") {

                const el = this.formElements[index + 4];

                if(el.tagName.toUpperCase() == 'SELECT') {
                    (el as HTMLElement).setAttribute('state', 'open');
                }

                setTimeout(() => {
                    el.focus();
                    el.click();
                }, 50);

                if (el.children[0]) {
                    el.children[0].focus();
                }
            }
            else {
                if(document.activeElement.tagName.toUpperCase() == 'SELECT') {
                    if(document.activeElement.getAttribute('state') == 'open') {
                        document.activeElement.removeAttribute('state');
                    }
                    else {
                        (document.activeElement as HTMLElement).blur();

                        if((nextEl as HTMLElement).hasAttribute('disabled')) {
                            this.formElements[index + 2].focus();
                        }
                    }
                }

                nextEl.focus();
            }
        }
    }

    disabledEdit() {

        if(
            (
                this.project?.data.debit_Id != 1 &&
                this.userData[this.selectedPaymentPlan].isLocked == 1 &&
                this.userData[this.selectedPaymentPlan].status == 2 &&
                this.userData[this.selectedPaymentPlan].allow_create_revision &&
                this.userData[this.selectedPaymentPlan].final_invoice_status == 0
            ) ||
            (this.userData[this.selectedPaymentPlan].status == 2 && this.userData[this.selectedPaymentPlan].markulerad)
        ) {
            return null;
        }else {
            return true;
        }
    }
}
