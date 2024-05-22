import { Component, OnInit/*, ElementRef*/, ViewChild } from "@angular/core";
import { ProjectsService } from "src/app/core/services/projects.service";
import { ActivatedRoute, Router } from "@angular/router";
import { BASE_URL } from "src/app/config";
import { TranslateService } from "@ngx-translate/core";
import { DomSanitizer } from "@angular/platform-browser";
import { PdfjsViewerComponent } from "src/app/utility/pdfjs-viewer/pdfjs-viewer.component";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { UAParser } from 'ua-parser-js';
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import * as printJS from "print-js";
import * as moment from "moment";
declare var $;

@Component({
    selector: "app-email-weekly-report",
    templateUrl: "./email-weekly-report.component.html",
    styleUrls: [
        "./email-weekly-report.component.css",
        "../../../utility/image-preview.css",
    ],
})
export class EmailWeeklyReportComponent implements OnInit {
    @ViewChild(PdfjsViewerComponent) pdfjsViewerComponent: PdfjsViewerComponent;
    numberOfSteps = [];
    currentStep;
    reportId: string;
    answerEmail: string;
    momentsTable: any;
    materialsTable: any;
    othersTable: any;
    showSubmitButton = false;
    checkMaterials = false;
    checkOthers = false;
    errorMessage = false;
    spinner = false;
    report;
    lang;
    checkPersons = false;
    hasErrors = {};
    whichPdfPreview;
    showPdfPreview = false;
    pdfFileName;
    swiper = {
        images: [],
        active: -1,
        album: -2,
        index: -1,
        parent: null,
    };

    allMaterialsOK = false;
    allMaterialsEJOK = false;

    allOthersOK = false;
    allOthersEJOK = false;

    allMomentsOK = false;
    allMomentsEJOK = false;
    totalForMoments = 0;
    content_type:any = 'du';

    oneMomentPreviouslyAccepted = false;
    oneMaterialPreviouslyAccepted = false;
    oneOtherPreviouslyAccepted = false;
    send_token: any;
    client_id:number = 0;
    currency = JSON.parse(sessionStorage.getItem("currency"));
    exist_additional_work:boolean = false;
    exist_material_work:boolean = false;
    exist_other_work:boolean = false;
    pdfSortArray = [
        'other.pdf',
        'material.pdf',
        'work.pdf',
        'ata.pdf',
        'project.pdf',
    ];
    public offDiv = false;
    public moment_price_array:any = [];
    public color_row:boolean = true;
    public total_of_manual_moments:any = 0;
    public moment_declined:any = [];
    public material_declined:any = [];
    public other_declined:any = [];
    public active_index:number = -1;
    public active_index_document_card:number = -1;
    public active_index_image_card:number = -1;
    public active_album_key:number = -1;
    filesArray:any =  [];

    setColorRow() {
        this.color_row = !this.color_row;
        return this.color_row;
    }

    constructor(
        private projectsService: ProjectsService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public translate: TranslateService,
        private sanitizer: DomSanitizer,
        private dialog: MatDialog,
       // private elementRef: ElementRef
    ) {
        //translate.setDefaultLang("sw");
    }

    ngAfterViewInit() {
        this.initZoom();
        this.getWrDocuments();
    }

    fnBrowserDetect(){
        const parser = new UAParser();
        const result = parser.getResult();
        return result.browser.name;
   }

    initZoom() {
        let browserZoomLevel = Math.round(window.devicePixelRatio * 100);
        this.calculatePosition(browserZoomLevel);
        $(window).resize(() => {
            browserZoomLevel = Math.round(window.devicePixelRatio * 100);
            this.calculatePosition(browserZoomLevel);
        });

        let browser = this.fnBrowserDetect();
        if(browser != 'Chrome')
        {
           $(".icon-sps").addClass("icon-sps-opera");
           $(".container-documents").addClass("icon-sps-opera");
           $(".document-wrapper").addClass(" document-wrapper-opera");
        }
    }

    calculatePosition(browserZoomLevel) {
        if(browserZoomLevel < 100) {
            $(".pdf-wraper").addClass("pdf-wraper-position");
        }else {
            $(".pdf-wraper").removeClass("pdf-wraper-position");
        }

        // if(browserZoomLevel == 100) {
        //     $("body").addClass("pdf-wraper-overflow");
        // }else {
        //     $("body").removeClass("pdf-wraper-overflow");
        // }
    }

    checkIfOdd(i2) {
        let status = false;
        let result = i2/2;
        if( Number.isInteger(result)) {
            status = true;
        }
        return status;
    }

    ngOnInit() {

        if(!this.currency) {
            this.currency = 'SEK';
        }
        this.report = this.activatedRoute.snapshot.data["report"]["data"];
        this.answerEmail = this.activatedRoute.snapshot.params.answerEmail;
        this.reportId = this.activatedRoute.snapshot.params.reportId;
        this.send_token = this.activatedRoute.snapshot.params.token;
        this.materialsTable = this.report.tables.am;
        this.othersTable = this.report.tables.ao;
        this.client_id = Number(this.activatedRoute.snapshot.params.cwId);
        this.momentsTable = this.report.tables.aaw.length >= 1 ? this.report.moments : [];
        this.total_of_manual_moments = this.report['total_of_manual_moments'];
        this.totalForMoments = this.report['totalForMoments'];

        if(this.momentsTable.length > 0) {
            this.exist_additional_work = true;
            this.moment_price_array = this.momentsTable[0].moment_price_array;
        }

        if(this.report.tables.am.length >= 1) {
            this.exist_material_work = true;
        }

        if(this.report.tables.ao.length >= 1) {
            this.exist_other_work = true;
        }

        this.currency = this.report.report.company_details['Currency'];
        let short_language = this.report.report.company_details['Language'];
        this.translate.setDefaultLang(short_language);

        if(this.report.report.ataId != 0) {
            this.content_type = 'ks';
        }

        if (this.report.report.alreadyAnswered) {
            this.currentStep = "alreadyAnswered";
        } else {
            this.checkInitialStep();
        }

        this.lang = short_language || "sw";
        this.translate.use(this.lang);
        this.isOneMomentPreviouslyAccepted();
        this.isOneMaterialPreviouslyAccepted();
        this.isOneOtherPreviouslyAccepted();

        let checked_materiaL_table = this.materialsTable.filter(element => element.ClientStatus == 1);
        if(checked_materiaL_table.length == this.materialsTable.length) {
            this.allMaterialsOK = true;
            this.materialsTable.forEach((element) => {
                if(element.ClientStatus == 0) {
                    this.allMaterialsOK = false;
                }
            });
        }

        let checked_other_table = this.othersTable.filter(element => element.ClientStatus == 1);
        if(checked_other_table.length == this.materialsTable.length) {
            this.allOthersOK = true;
            this.othersTable.forEach((element) => {
                if(element.ClientStatus == 0) {
                    this.allOthersOK = false;
                }
            });
        }
        this.checkIfAllMaterialChecked();
        this.checkIfAllOthersChecked();
    }

    checkInitialStep() {
        if (this.momentsTable.length >= 1) {
            this.numberOfSteps.push("step1");
        }
        if (this.materialsTable.length >= 1) {
            this.numberOfSteps.push("step2");
            this.materialsTable.forEach((materials) => {
                if (!materials.Total) {
                    materials.Total =
                        (+materials["Price"] +
                            materials["Price"] * (materials["Deduct"] / 100)) *
                        materials["Quantity"];
                }
            });
        }
        if (this.othersTable.length >= 1) {
            this.numberOfSteps.push("step3");
            this.othersTable.forEach((others) => {
                if (!others.Total) {
                    others.Total =
                        (+others["Price"] + others["Price"] * (others["Deduct"] / 100)) *
                        others["Quantity"];
                }
            });
        }

        if (this.numberOfSteps.includes("step1")) {
            this.currentStep = "step1";
        } else if (this.numberOfSteps.includes("step2")) {
            this.currentStep = "step2";
        } else if (this.numberOfSteps.includes("step3")) {
            this.currentStep = "step3";
        } else {
            this.currentStep = "step4";
            this.showSubmitButton = true;
        }
    }

    switchStep() {
        switch (this.currentStep) {
            case "step1":
                if (this.numberOfSteps.includes("step2")) {
                    if (this.validateMomentsTable()) {
                        this.currentStep = "step2";
                        this.errorMessage = false;
                        this.refreshInput('moments', true);
                    } else {
                        this.errorMessage = true;
                        this.refreshInput('moments', false);
                    }
                } else if (this.numberOfSteps.includes("step3")) {
                    if (this.validateMomentsTable()) {
                        this.currentStep = "step3";
                        this.errorMessage = false;
                        this.refreshInput('moments', true);
                    } else {
                        this.errorMessage = true;
                        this.refreshInput('moments', false);
                    }
                } else {
                    if (this.validateMomentsTable()) {
                        this.currentStep = "step4";
                        this.showSubmitButton = true;
                        this.errorMessage = false;
                        this.refreshInput('moments', true);
                    } else {
                        this.errorMessage = true;
                        this.refreshInput('moments', false);
                    }
                }
                break;
            case "step2":
                if (this.numberOfSteps.includes("step3")) {
                    if (this.validateMaterialsTable()) {
                        this.currentStep = "step3";
                        this.errorMessage = false;
                        this.refreshInput('materials', true);
                    } else {
                        this.errorMessage = true;
                        this.refreshInput('materials', false);
                    }
                } else {
                    if (this.validateMaterialsTable()) {
                        this.currentStep = "step4";
                        this.showSubmitButton = true;
                        this.errorMessage = false;
                        this.refreshInput('materials', true);
                    } else {
                        this.errorMessage = true;
                        this.refreshInput('materials', false);
                    }
                }
                break;
            case "step3":
                if (this.validateOthersTable()) {
                    this.currentStep = "step4";
                    this.showSubmitButton = true;
                    this.errorMessage = false;
                    this.refreshInput('others', true);
                } else {
                    this.errorMessage = true;
                    this.refreshInput('others', false);
                }
                break;
            case "step4":
                this.active_index = -1;
            break;
        }
    }

    shouldShowBackButton() {
        return (
            this.currentStep != "alreadyAnswered" &&
            this.currentStep != "step1" &&
            this.currentStep != "step4" &&
            this.numberOfSteps[0] != this.currentStep
        );
    }

    goToPreviousStep() {
        if (this.currentStep == "step4") {
            this.currentStep = this.numberOfSteps[this.numberOfSteps.length - 1];
            this.showSubmitButton = false;
        } else {
            const stepIndex = this.numberOfSteps.findIndex(
                (step) => step === this.currentStep
            );
            this.currentStep = this.numberOfSteps[stepIndex - 1];
        }
    }

    removeItemAll(arr, value) {
        var i = 0;
        while (i < arr.length) {
            if (arr[i] === value) {
              arr.splice(i, 1);
            } else {
            ++i;
            }
        }
        return arr;
    }

    acceptMoment(moment) {
        if (moment.ClientStatus == 1) {
            moment.ClientStatus = null;
        } else {
            moment.ClientStatus = 1;
        }
        if (moment.ClientStatus) {
            this.removeItemAll(this.moment_declined, moment.momentId);
        }
    }

    declineMoment(moment) {
        if (moment.ClientStatus == 0) {
            moment.ClientStatus = null;
        } else {
            moment.ClientStatus = 0;
        }

        if(moment.ClientStatus == 0) {
            this.moment_declined.push(moment.momentId)
        }else {
            this.removeItemAll(this.moment_declined, moment.momentId);
        }
    }

    refreshInput(type, status) {

        if(type == 'moments') {
            this.momentsTable.forEach((data) => {
                data['users'].forEach((user) => {
                    user.moments.forEach((moment) => {
                        if(status) {
                            this.removeItemAll(this.moment_declined, moment.momentId);
                        }else if(!moment.ClientStatus){
                            this.moment_declined.push(moment.momentId)
                        }
                    });
                });
            });
        }

        if(type == 'materials') {

            this.materialsTable.forEach((element) => {
                if(status) {
                    this.removeItemAll(this.material_declined, element.Id);
                }else if(!element.ClientStatus){
                    this.material_declined.push(element.Id);
                }
            });
        }

        if(type == 'others') {

            this.othersTable.forEach((element) => {
                if(status) {
                    this.removeItemAll(this.other_declined, element.Id);
                }else if(!element.ClientStatus){
                    this.other_declined.push(element.Id);
                }
            });
        }
    }

    acceptUserMoments(moments) {
        let allUserMomentsChecked = this.checkIfAllUserMomentsChecked(moments);
        moments.forEach((moment) => {
            if (allUserMomentsChecked) {
                moment.ClientStatus = null;
            } else {
                moment.ClientStatus = 1;
            }
            if (moment.ClientStatus) {
                this.removeItemAll(this.moment_declined, moment.momentId);
            }
        });
    }

    declineUserMoments(moments) {
        let allUserMomentsUnChecked = this.checkIfAllUserMomentsUnChecked(moments);
        moments.forEach((moment) => {
            if (allUserMomentsUnChecked) {
                this.removeItemAll(this.moment_declined, moment.momentId);
            } else {
                moment.ClientStatus = 0;
                this.moment_declined.push(moment.momentId)
            }
        });
    }

    checkIfAllUserMomentsChecked(userMoments) {
        let allUserMomentsChecked = userMoments.every(
            (moment) => moment.ClientStatus == 1
        );
        return allUserMomentsChecked;
    }

    checkIfAllUserMomentsUnChecked(userMoments) {
        let allUserMomentsUnChecked = userMoments.every(
            (moment) => moment.ClientStatus == 0
        );
        return allUserMomentsUnChecked;
    }

    checkAllMoments(ev) {
        let allChecked = this.checkIfAllMomentsOK();
        this.momentsTable.forEach((date) => {
            date.users.forEach((user) => {
                if(user.name  != 'Arbetade timmar') {
                    user.moments.forEach((moment) => {
                        if (allChecked) {
                            moment.ClientStatus = null;
                        } else {
                            moment.ClientStatus = 1;
                        }
                        if (moment.ClientStatus) {
                            this.removeItemAll(this.moment_declined, moment.momentId);
                        }
                    });
                }
            });
        });
    }

    unCheckAllMoments(ev) {
        let allUnchecked = this.checkIfAllMomentsEJOK();
        this.momentsTable.forEach((date) => {
            date.users.forEach((user) => {
                if(user.name  != 'Arbetade timmar') {
                    user.moments.forEach((moment) => {
                        if (allUnchecked) {
                            moment.ClientStatus = null;
                            this.removeItemAll(this.moment_declined, moment.momentId);
                        } else {
                            moment.ClientStatus = 0;
                            this.moment_declined.push(moment.momentId)
                        }
                    });
                }
            });
        });
    }

    checkIfAllMomentsOK() {
        let moments = [];
        this.momentsTable.forEach((date) => {
            date.users.forEach((user) => {
                if(user.name  != 'Arbetade timmar') {
                    user.moments.forEach((moment) => {
                        moments.push(moment.ClientStatus);
                    });
                }
            });
        });
        if (moments.every((mom) => mom == 1)) {
            return true;
        } else {
            return false;
        }
    }

    checkIfAllMomentsEJOK() {
        let moments = [];
        this.momentsTable.forEach((date) => {
            date.users.forEach((user) => {
                if(user.name  != 'Arbetade timmar') {
                    user.moments.forEach((moment) => {
                        moments.push(moment.ClientStatus);
                    });
                }
            });
        });
        if (moments.every((mom) => mom == 0)) {
            return true;
        } else {
            return false;
        }
    }


    checkAllManualMoments(ev) {
        let allChecked = this.checkIfAllManualMomentsOK();
        this.momentsTable.forEach((date) => {
            date.users.forEach((user) => {
                if(user.name == 'Arbetade timmar') {
                    user.moments.forEach((moment) => {
                        if (allChecked) {
                            moment.ClientStatus = null;
                        } else {
                            moment.ClientStatus = 1;
                        }
                        if(moment.ClientStatus) {
                            this.removeItemAll(this.moment_declined, moment.momentId);
                        }
                    });
                }
            });
        });
    }

    unCheckAllManualMoments(ev) {
        let allUnchecked = this.checkIfAllManualMomentsEJOK();
        this.momentsTable.forEach((date) => {
            date.users.forEach((user) => {
                if(user.name == 'Arbetade timmar') {
                    user.moments.forEach((moment) => {
                        if (allUnchecked) {
                            moment.ClientStatus = null;
                            this.removeItemAll(this.moment_declined, moment.momentId);
                        } else {
                            moment.ClientStatus = 0;
                            this.moment_declined.push(moment.momentId)
                        }
                    });
                }
            });
        });
    }

    checkIfAllManualMomentsOK() {
        let moments = [];
        this.momentsTable.forEach((date) => {
            date.users.forEach((user) => {
                if(user.name == 'Arbetade timmar') {
                    user.moments.forEach((moment) => {
                        moments.push(moment.ClientStatus);
                    });
                }
            });
        });
        if (moments.every((mom) => mom == 1)) {
            return true;
        } else {
            return false;
        }
    }

    checkIfAllManualMomentsEJOK() {
        let moments = [];
        this.momentsTable.forEach((date) => {
            date.users.forEach((user) => {
                if(user.name == 'Arbetade timmar') {
                    user.moments.forEach((moment) => {
                        moments.push(moment.ClientStatus);
                    });
                }
            });
        });
        if (moments.every((mom) => mom == 0)) {
            return true;
        } else {
            return false;
        }
    }

    checkAllMaterials(ev) {

        if (ev.target.checked) {
            this.allMaterialsOK = true;
            this.allMaterialsEJOK = false;
            this.materialsTable.forEach((element) => {
                element.ClientStatus = 1;
                if(element.ClientStatus) {
                    this.removeItemAll(this.material_declined, element.Id);
                }
            });
        } else if (ev.target.checked == false) {
            this.allMaterialsOK = false;
            this.allMaterialsEJOK = false;
            this.materialsTable.forEach((element) => {
                element.ClientStatus = null;
            });
        }
    }

    unCheckAllMaterials(ev) {
        if (ev.target.checked) {
            this.allMaterialsOK = false;
            this.allMaterialsEJOK = true;
            this.materialsTable.forEach((element) => {
                element.ClientStatus = 0;
                this.material_declined.push(element.Id)
            });
        } else if (ev.target.checked == false) {
            this.allMaterialsOK = false;
            this.allMaterialsEJOK = false;
            this.materialsTable.forEach((element) => {
                element.ClientStatus = null;
                this.removeItemAll(this.material_declined, element.Id);
            });
        }
    }

    acceptMaterialItem(index) {
        if (this.materialsTable[index].ClientStatus == 1) {
            this.materialsTable[index].ClientStatus = null;
        } else {
            this.materialsTable[index].ClientStatus = 1;
        }
        if(this.materialsTable[index].ClientStatus) {
            this.removeItemAll(this.material_declined, this.materialsTable[index].Id);
        }
        this.checkIfAllMaterialChecked();
    }

    declineMaterialItem(index) {
        if (this.materialsTable[index].ClientStatus == 0) {
            this.materialsTable[index].ClientStatus = null;
        } else {
            this.materialsTable[index].ClientStatus = 0;
        }

        if(this.materialsTable[index].ClientStatus == 0) {
            this.material_declined.push(this.materialsTable[index].Id)
        }else {
            this.removeItemAll(this.material_declined, this.materialsTable[index].Id);
        }

        this.checkIfAllMaterialChecked();
    }

    checkIfAllMaterialChecked() {
        if (this.materialsTable.every((element) => element.ClientStatus == 1)) {
            this.allMaterialsOK = true;
            this.allMaterialsEJOK = false;
        } else if (
            this.materialsTable.every((element) => element.ClientStatus == 0)
        ) {
            this.allMaterialsOK = false;
            this.allMaterialsEJOK = true;
        } else {
            this.allMaterialsOK = false;
            this.allMaterialsEJOK = false;
        }
    }

    checkAllOthers(ev) {
        if (ev.target.checked) {
            this.allOthersOK = true;
            this.allOthersEJOK = false;
            this.othersTable.forEach((element) => {
                element.ClientStatus = 1;
                if(element.ClientStatus) {
                    this.removeItemAll(this.other_declined, element.Id);
                }
            });
        } else if (ev.target.checked == false) {
            this.allOthersOK = false;
            this.allOthersEJOK = false;
            this.othersTable.forEach((element) => {
                element.ClientStatus = null;
            });
        }
    }

    unCheckAllOthers(ev) {
        if (ev.target.checked) {
            this.allOthersOK = false;
            this.allOthersEJOK = true;
            this.othersTable.forEach((element) => {
                element.ClientStatus = 0;
                this.other_declined.push(element.Id)
            });
        } else if (ev.target.checked == false) {
            this.allOthersOK = false;
            this.allOthersEJOK = false;
            this.othersTable.forEach((element) => {
                element.ClientStatus = null;
                this.removeItemAll(this.other_declined, element.Id);
            });
        }
    }

    checkIfAllOthersChecked() {
        if (this.othersTable.every((element) => element.ClientStatus == 1)) {
            this.allOthersOK = true;
            this.allOthersEJOK = false;
        } else if (this.othersTable.every((element) => element.ClientStatus == 0)) {
            this.allOthersOK = false;
            this.allOthersEJOK = true;
        } else {
            this.allOthersOK = false;
            this.allOthersEJOK = false;
        }
    }

    acceptOtherItem(index) {
        if (this.othersTable[index].ClientStatus == 1) {
            this.othersTable[index].ClientStatus = null;
        } else {
            this.othersTable[index].ClientStatus = 1;
        }

        if(this.othersTable[index].ClientStatus) {
            this.removeItemAll(this.other_declined, this.othersTable[index].Id);
        }
        this.checkIfAllOthersChecked();
    }

    declineOtherItem(index) {

        if (this.othersTable[index].ClientStatus == 0) {
            this.othersTable[index].ClientStatus = null;
        } else {
            this.othersTable[index].ClientStatus = 0;
        }

        if(this.othersTable[index].ClientStatus == 0) {
            this.other_declined.push(this.othersTable[index].Id)
        }else {
            this.removeItemAll(this.other_declined, this.othersTable[index].Id);
        }
        this.checkIfAllOthersChecked();
    }

    validateMomentsTable(): boolean {
        const moments = [];
        let valid = false;
        this.momentsTable.forEach((date) => {
            date.users.forEach((user) => {
                user.moments.forEach((moment) => {
                    if (
                        (moment.ClientComment != null &&
                            moment.ClientComment != "" &&
                            moment.ClientStatus == 0) ||
                        moment.ClientStatus == 1
                    ) {
                        moments.push(true);
                    } else {
                        moments.push(false);
                    }
                });
            });
        });
        if (moments.every((moment) => moment == true)) {
            valid = true;
        } else {
            valid = false;
        }
        return valid;
    }

    validateMaterialsTable(): boolean {
        let valid = false;
        const materials = [];
        this.materialsTable.forEach((element) => {
            if (
                (element.ClientComment != null &&
                    element.ClientComment != "" &&
                    element.ClientStatus == 0) ||
                element.ClientStatus == 1
            ) {
                materials.push(true);
            } else {
                materials.push(false);
            }
        });
        if (materials.every((moment) => moment == true)) {
            valid = true;
        } else {
            valid = false;
        }
        return valid;
    }

    validateOthersTable(): boolean {
        let valid = false;
        const others = [];
        this.othersTable.forEach((element) => {
            if (
                (element.ClientComment != null &&
                    element.ClientComment != "" &&
                    element.ClientStatus == 0) ||
                element.ClientStatus == 1
            ) {
                others.push(true);
            } else {
                others.push(false);
            }
        });
        if (others.every((moment) => moment == true)) {
            valid = true;
        } else {
            valid = false;
        }
        return valid;
    }

    validate(): boolean {
        let valid = false;
        if (
            this.validateMomentsTable() &&
            this.validateMaterialsTable() &&
            this.validateOthersTable()
        ) {
            valid = true;
            this.errorMessage = false;
        }
        return valid;
    }

    openFile(pdfPath) {
        if (pdfPath == undefined) {
            this.showPdfPreview = false;
        } else {
            if (this.pdfFileName == "/" + pdfPath) {
                this.showPdfPreview = !this.showPdfPreview;
            } else {
                this.showPdfPreview = true;
            }
            this.whichPdfPreview = this.sanitizer.bypassSecurityTrustResourceUrl(
                BASE_URL + pdfPath
            );
            this.pdfFileName = BASE_URL + pdfPath;
        }
    }

    getFileExtension(fileName) {
        if (fileName) {
            return fileName.substr(fileName.lastIndexOf(".") + 1);
        } else {
            return "";
        }
    }

    submit(report) {

        if (this.validate()) {

            this.errorMessage = false;
            const diaolgConfig = new MatDialogConfig();
            diaolgConfig.autoFocus = false;
            diaolgConfig.disableClose = true;
            diaolgConfig.width = "";
            diaolgConfig.panelClass = "mat-dialog-confirmation";
            this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().subscribe((response) => {
                if (response.result) {
                    this.spinner = true;
                    this.projectsService
                        .approveWeeklyReport(
                            report,
                            this.reportId,
                            this.report["answerEmail"],
                            this.activatedRoute.snapshot.paramMap.get("cwId"),
                            this.activatedRoute.snapshot.paramMap.get("group"),
                        )
                        .then(
                            (response) => {

                                if (response["status"]) {
                                    if (response["data"] && response["data"].exist_not_approved_wr) {
                                        this.router.navigate(["external/weekly_reports/", this.answerEmail, this.client_id, this.send_token, this.report.report.ProjectID, this.content_type]);
                                    }else {
                                        this.spinner = false;
                                        this.router.navigate(["/external/response/success"]);
                                    }
                                } else {
                                    this.spinner = false;
                                    this.router.navigate(["/external/response/fail"]);
                                }
                            },
                            (reason) => {
                                this.spinner = false;
                                this.router.navigate(["/external/response/fail"]);
                            }
                        );
                }
            });

        } else if (this.validate() == false) {
            this.spinner = false;
            this.errorMessage = true;
        }
    }

    filterSupplierName(name) {
        return name.toString().split("-")[1];
    }

    calculateSumTotal() {
        return (
            this.getAcceptedMomentsTotal(0, true) +
            this.getAcceptedMomentsManualTotal +
            this.getAcceptedMaterialsTotal +
            this.getAcceptedOthersTotal
        );
    }

    getAcceptedQuantityTotal(moment_price) {
        let total = 0;
        if (!this.report.tables.aaw[0]) {
            return total;
        }
        this.momentsTable.forEach((moment) => {
            moment.users.forEach((user) => {
                if(user.name != 'Arbetade timmar') {
                    user.moments.forEach((m) => {
                        if (m.ClientStatus == 1 && m.Price == moment_price) {
                            let t = Number(
                                Number(m.time_qty)
                            ).toFixed(2);
                            total = Number(total) + Number(t);
                        }
                    });
                }
            });
        });

        return total;
    }

    getDeclinedQuantityTotal(moment_price = 0, summ_all = false) {
        let total = 0;
        if (!this.report.tables.aaw[0]) {
            return total;
        }
        this.momentsTable.forEach((moment) => {
            moment.users.forEach((user) => {
                if(user.name != 'Arbetade timmar') {
                    user.moments.forEach((m) => {
                        if (m.ClientStatus != 1 && (m.Price == moment_price || summ_all)) {
                            let t = Number(
                                Number(m.time_qty)
                            ).toFixed(2);
                            total = Number(total) + Number(t);
                        }
                    });
                }
            });
        });

        return total;
    }

    getAcceptedPriceTotal(moment_price = 0, summ_all = false) {
        let total = 0;
        if (!this.report.tables.aaw[0]) {
            return total;
        }
        this.momentsTable.forEach((moment) => {
            moment.users.forEach((user) => {
                if(user.name != 'Arbetade timmar') {
                    user.moments.forEach((m) => {
                        if (m.ClientStatus == 1 && (m.Price == moment_price || summ_all)) {
                            let t = Number(
                                Number(m.Price)
                            ).toFixed(2);
                            total = Number(total) + Number(t);
                        }
                    });
                }
            });
        });

        return total;
    }

    get getDeclinedPriceTotal() {
        let total = 0;
        if (!this.report.tables.aaw[0]) {
            return total;
        }
        this.momentsTable.forEach((moment) => {
            moment.users.forEach((user) => {
                if(user.name != 'Arbetade timmar') {
                    user.moments.forEach((m) => {
                        if (m.ClientStatus != 1) {
                            let t = Number(
                                Number(m.Price)
                            ).toFixed(2);
                            total = Number(total) + Number(t);
                        }
                    });
                }
            });
        });

        return total;
    }

    getAcceptedMomentsTotal(moment_price = 0, summ_all = false) {
        let total = 0;
        if (!this.report.tables.aaw[0]) {
            return total;
        }
        this.momentsTable.forEach((moment) => {
            moment.users.forEach((user) => {

                if(user.name != 'Arbetade timmar') {
                    user.moments.forEach((m) => {
                        if ( m.ClientStatus == 1 && (m.Price == moment_price || summ_all)) {
                            let t = Number(
                                Number(m.time_qty) *
                                Number(m.Price) *
                                (Number(m.Deduct) / 100 + 1)
                            ).toFixed(2);
                            total = Number(total) + Number(t);
                        }
                    });
                }
            });
        });

        return total;
    }

    getDeclinedMomentsTotal(moment_price = 0, summ_all = false) {
        let total = 0;
        if (!this.report.tables.aaw[0]) {
            return total;
        }
        this.momentsTable.forEach((moment) => {
            moment.users.forEach((user) => {
                if(user.name != 'Arbetade timmar') {
                    user.moments.forEach((m) => {
                        if (m.ClientStatus != 1 && (m.Price == moment_price || summ_all)) {
                            let t = Number(
                                Number(m.time_qty) *
                                Number(m.Price) *
                                (Number(m.Deduct) / 100 + 1)
                            ).toFixed(2);
                            total = Number(total) + Number(t);
                        }
                    });
                }
            });
        });

        return total;
    }

    get getAcceptedQuantityManualTotal() {
        let total = 0;
        if (!this.report.tables.aaw[0]) {
            return total;
        }
        this.momentsTable.forEach((moment) => {
            moment.users.forEach((user) => {
                if(user.name == 'Arbetade timmar') {
                    user.moments.forEach((m) => {
                        if (m.ClientStatus == 1) {
                            let t = Number(
                                Number(m.time_qty)
                            ).toFixed(2);
                            total = Number(total) + Number(t);
                        }
                    });
                }
            });
        });

        return total;
    }

    get getDeclinedQuantityManualTotal() {
        let total = 0;
        if (!this.report.tables.aaw[0]) {
            return total;
        }
        this.momentsTable.forEach((moment) => {
            moment.users.forEach((user) => {
                if(user.name == 'Arbetade timmar') {
                    user.moments.forEach((m) => {
                        if (m.ClientStatus != 1) {
                            let t = Number(
                                Number(m.time_qty)
                            ).toFixed(2);
                            total = Number(total) + Number(t);
                        }
                    });
                }
            });
        });

        return total;
    }

    get getAcceptedPriceManualTotal() {
        let total = 0;
        if (!this.report.tables.aaw[0]) {
            return total;
        }
        this.momentsTable.forEach((moment) => {
            moment.users.forEach((user) => {
                if(user.name == 'Arbetade timmar') {
                    user.moments.forEach((m) => {
                        if (m.ClientStatus == 1) {
                            let t = Number(
                                Number(m.Price)
                            ).toFixed(2);
                            total = Number(total) + Number(t);
                        }
                    });
                }
            });
        });

        return total;
    }

    get getDeclinedPriceManualTotal() {
        let total = 0;
        if (!this.report.tables.aaw[0]) {
            return total;
        }
        this.momentsTable.forEach((moment) => {
            moment.users.forEach((user) => {
                if(user.name == 'Arbetade timmar') {
                    user.moments.forEach((m) => {
                        if (m.ClientStatus != 1) {
                            let t = Number(
                                Number(m.Price)
                            ).toFixed(2);
                            total = Number(total) + Number(t);
                        }
                    });
                }
            });
        });

        return total;
    }

    get getAcceptedMomentsManualTotal() {
        let total = 0;
        if (!this.report.tables.aaw[0]) {
            return total;
        }
        this.momentsTable.forEach((moment) => {
            moment.users.forEach((user) => {
                if(user.name == 'Arbetade timmar') {
                    user.moments.forEach((m) => {
                        if (m.ClientStatus == 1) {
                            let t = Number(
                                Number(m.time_qty) *
                                Number(m.Price) *
                                (Number(m.Deduct) / 100 + 1)
                            ).toFixed(2);
                            total = Number(total) + Number(t);
                        }
                    });
                }
            });
        });

        return total;
    }

    get getDeclinedMomentsManualTotal() {
        let total = 0;
        if (!this.report.tables.aaw[0]) {
            return total;
        }
        this.momentsTable.forEach((moment) => {
            moment.users.forEach((user) => {
                if(user.name == 'Arbetade timmar') {
                    user.moments.forEach((m) => {
                        if (m.ClientStatus != 1) {
                            let t = Number(
                                Number(m.time_qty) *
                                Number(m.Price) *
                                (Number(m.Deduct) / 100 + 1)
                            ).toFixed(2);
                            total = Number(total) + Number(t);
                        }
                    });
                }
            });
        });

        return total;
    }








    get getAcceptedMaterialsTotal() {
        let total = 0;
        this.materialsTable.forEach((material) => {
            if (material.ClientStatus == 1) {
                total += parseFloat(material.Total);
            }
        });

        return total;
    }

    get getDeclinedMaterialsTotal() {
        let total = 0;
        this.materialsTable.forEach((material) => {
            if (material.ClientStatus != 1) {
                total += parseFloat(material.Total);
            }
        });

        return total;
    }

    get getAcceptedMaterialsPriceTotal() {
        let total = 0;
        this.materialsTable.forEach((material) => {
            if (material.ClientStatus == 1) {
                total += parseFloat(material.Price);
            }
        });

        return total;
    }

    get getDeclinedMaterialsPriceTotal() {
        let total = 0;
        this.materialsTable.forEach((material) => {
            if (material.ClientStatus != 1) {
                total += parseFloat(material.Price);
            }
        });

        return total;
    }

    get getAcceptedMaterialsQuantityTotal() {
        let total = 0;
        this.materialsTable.forEach((material) => {
            if (material.ClientStatus == 1) {
                total += parseFloat(material.Quantity);
            }
        });

        return total;
    }

    get getDeclinedMaterialsQuantityTotal() {
        let total = 0;
        this.materialsTable.forEach((material) => {
            if (material.ClientStatus != 1) {
                total += parseFloat(material.Quantity);
            }
        });

        return total;
    }


    get getAcceptedOthersTotal() {
        let total = 0;
        this.othersTable.forEach((other) => {
            if (other.ClientStatus == 1) {
                total += parseFloat(other.Total);
            }
        });

        return total;
    }

    get getDeclinedOthersTotal() {
        let total = 0;
        this.othersTable.forEach((other) => {
            if (other.ClientStatus != 1) {
                total += parseFloat(other.Total);
            }
        });

        return total;
    }

    get getAcceptedOthersPriceTotal() {
        let total = 0;
        this.othersTable.forEach((other) => {
            if (other.ClientStatus == 1) {
                total += parseFloat(other.Price);
            }
        });

        return total;
    }

    get getDeclinedOthersPriceTotal() {
        let total = 0;
        this.othersTable.forEach((other) => {
            if (other.ClientStatus != 1) {
                total += parseFloat(other.Price);
            }
        });

        return total;
    }


    get getAcceptedOthersQuantityTotal() {
        let total = 0;
        this.othersTable.forEach((other) => {
            if (other.ClientStatus == 1) {
                total += parseFloat(other.Quantity);
            }
        });

        return total;
    }

    get getDeclinedOthersQuantityTotal() {
        let total = 0;
        this.othersTable.forEach((other) => {
            if (other.ClientStatus != 1) {
                total += parseFloat(other.Quantity);
            }
        });

        return total;
    }

    validateMomentTime(momt) {
        if (momt == null) {
            return "00:00";
        }
        let hours = momt.toString().split(":")[0];
        if (hours.length == 1 && hours < 10) {
            momt = "0" + momt;
            return momt;
        }
        return momt;
    }

    isOneUserMomentPreviouslyAccepted(moments) {
        return moments.some(
            (moment) => moment.ClientStatusCopy == 1 && !this.report.isMainContact
        );
    }

    isOneMomentPreviouslyAccepted() {
        this.oneMomentPreviouslyAccepted = this.momentsTable.some((mmt) =>
            mmt.users.some((user) =>
                user.moments.some(
                    (moment) => moment.ClientStatusCopy == 1 && !this.report.isMainContact
                )
            )
        );
    }

    isOneMaterialPreviouslyAccepted() {
        this.oneMaterialPreviouslyAccepted = this.materialsTable.some(
            (material) => material.ClientStatusCopy == 1 && !this.report.isMainContact
        );
    }

    isOneOtherPreviouslyAccepted() {
        this.oneOtherPreviouslyAccepted = this.othersTable.some(
            (other) => other.ClientStatusCopy == 1 && !this.report.isMainContact
        );
    }

    closeAndOpen(index, albumKey, type = null) {
//777777777777
      if (this.pdfjsViewerComponent) {
        this.pdfjsViewerComponent.closeSwiper();
      }

      if(type == 'image-card') {
        this.active_index_document_card = index;
      }else {
        this.active_index = index;
      }

      setTimeout(() => {
        this.openSwiper(index, this.getAlbumFiles(albumKey, 'pdfs'), albumKey, type)
      }, 20);
    }

    isPDFViewer: boolean = false;
    openSwiper(index, files, album, type = null, initialize_index = true) {

        if(initialize_index) {
            this.active_album_key = album;
            this.active_index_image_card = -1;
            this.active_index_document_card = -1;
            this.active_index = -1;
        }

        if(type == 'image-card') {
            this.active_index_image_card = index;
        }else if(type == 'document-card') {
            this.active_index_document_card = index;
        }else if(type == 'card-wrapper') {
            this.active_index = index;
        }

        this.calculatePosition(90);

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
            const fileArray = this.createFileArray(files[index]);
            this.isPDFViewer = true;
            this.swiper = {
                active: 0,
                images: fileArray,
                album: album,
                index: index,
                parent: files[index],
            };
        }
        this.offDiv = true;
    }

    closeSwiper() {
        this.active_index = -1;
        this.active_index_document_card = -1;
        this.active_index_image_card = -1;
        this.active_album_key = -1;
        this.calculatePosition(100);
        this.swiper = {
            active: -1,
            images: [],
            album: -2,
            index: -1,
            parent: null,
        };
        this.offDiv = false;
    }

    removeSwiperImage(event) { }

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

    createFileArray(file) {
        const id = file.id;
        const comment = file.Description;
        const name = file.Name ? file.Name : file.name;
        //const image_path = file.image_path;
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

    getActiveDU() {
        return this.report.report;
    }

    getAlbumKeys() {
        return this.getActiveDU()["keys"].filter(key => key != 50000);
    }

    getAlbumFiles(albumKey, type) {
        const activeDU = this.getActiveDU();
        const files = activeDU["files"][albumKey][type];

        if(albumKey == '50000') {
            return files.sort((a, b) => {
                return this.pdfSortArray.indexOf(b.name.substring(b.name.lastIndexOf('-')+1)) - this.pdfSortArray.indexOf(a.name.substring(a.name.lastIndexOf('-')+1));
            });
        }
        return files;
    }

    bordeByPdfType(file) {
        if(this.currentStep == "step1" && file.name.endsWith('work.pdf')) {
            return true;
        }

        if(this.currentStep == "step2" && file.name.endsWith('material.pdf')) {
            return true;
        }

        if(this.currentStep == "step3" && file.name.endsWith('other.pdf')) {
            return true;
        }

        if(this.currentStep == "step4" && file.name.endsWith('ata.pdf')) {
            return true;
        }

        return false;
    }

    getAlbumDescription(albumKey) {
        const activeDU = this.getActiveDU();
        let description = "";
        if (activeDU) {
            description = activeDU["files"][albumKey]["description"];
        }
        return description;
    }

    getAlbumName(albumKey) {
        const activeDU = this.getActiveDU();
        let name = "";
        if (activeDU) {
            name = activeDU["files"][albumKey]["name"];
        }
        return name;
    }

    setActiveDocument(index, files, album, type = null) {

        if(type == 'image-card') {
            this.getAlbumKeys().forEach((albumKey) => {
                this.getAlbumFiles(albumKey, 'images').forEach((doc, index_) => {
                    if(doc.Url ==  files[0].url) {
                        this.active_index_image_card = index_;
                        this.active_album_key = albumKey;
                    }
                });
            });
        }

        this.openSwiper(0, files, this.active_album_key, null, false);
    }

    openDocument(material, albumKey) {

        let obj = {
            'Url': material.pdf_doc ? material.pdf_doc : material.pdf_images,
            'file_path': material.pdf_doc ? material.pdf_doc : material.pdf_images,
            'image_path': material.pdf_images,
            'name': material.supplier_ocr + '.pdf',
            'album': "50000",
            'document_type': material.pdf_doc ? "Pdf" : "Image",
            'id': null
        }

        this.getAlbumFiles(albumKey, 'pdfs').forEach((doc, index_) => {

            if(doc.Url ==  obj.Url) {
                this.active_index = index_;
                this.active_album_key = albumKey;
            }
        });

        setTimeout(() => {
            this.openSwiper(0, [obj], albumKey, null, false)
        }, 20);
    }

    downloadURI(uri, name) {
        this.spinner = true;
        const link = document.createElement("a");
        link.setAttribute("download", name);
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout( () => { this.spinner = false;}, 2000 );
    }

    printDocument(ext, file_path, name) {
        this.spinner = true;
        if (ext === "pdf") {
            printJS({ printable: `${file_path}`, type: "pdf", documentTitle: name });
        } else {
            printJS({
                printable: `${file_path}`,
                type: "image",
                documentTitle: name,
            });
        }
        setTimeout( () => { this.spinner = false;}, 2000 );
    }

    async downloadAllDocuments() {
        this.spinner = true;
        let document_name = 'documents-' + moment().format("YYYY-MM-DD");
        let mapped_data = this.filesArray.map((c:any) => c.Url);
        this.createZip(mapped_data, document_name);
    }

    async createZip(files: any[], zipName: string) {

        const zip = new JSZip();
        const name = zipName + '.zip';

        for (let counter = 0; counter < files.length; counter++) {
            const element = files[counter];
            await this.projectsService.getFile(element).then((fileData:any)=> {
                let index = this.filesArray.findIndex((res)=> { return res.Url == element});
                const b: any = new Blob([fileData], { type: '' + fileData.type + '' });
                zip.file(this.filesArray[index].name, b);
            });
        }

        zip.generateAsync({ type: 'blob' }).then((content) => {
            if (content) {
                FileSaver.saveAs(content, name);
                this.spinner = false;
            }
        });
    }

    async getFile(url: string) {
        this.projectsService.getFile(url).then((result)=> {
            return result;
        });
    }

    getWrDocuments() {
        Object.keys(this.getActiveDU().files).forEach((key) => {
            this.filesArray = [...this.filesArray, ...this.getActiveDU().files[key].images, ...this.getActiveDU().files[key].pdfs];
        });
        this.filesArray = [...this.getActiveDU().images, ...this.filesArray];
    }
}
