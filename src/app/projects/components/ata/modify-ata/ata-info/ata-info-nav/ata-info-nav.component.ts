import { Component, OnInit,Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AtaInfoService } from '../ata-info.service';
import { ProjectsService } from "src/app/core/services/projects.service";
import { AtaService } from "src/app/core/services/ata.service";
import * as printJS from "print-js";
import * as moment from "moment";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { WeeklyReportsService } from "src/app/core/services/weekly-reports.service";
import { AESEncryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';

@Component({
  selector: 'app-ata-info-nav',
  templateUrl: './ata-info-nav.component.html',
  styleUrls: ['./ata-info-nav.component.css']
})


export class AtaInfoNavComponent implements OnInit, OnDestroy {
@Input() overview:any;

public type: any;
public atas: any = [];
public selectedAta:any = {
    ATAID: -1,
    Status: -1,
    AtaNumber: -1,
    Name: '',
    PDFUrl: '',
    status
};
public iconColor = "";
public iconStatusName = "";
public statusColor: any;
public buttonToggle = false;
public buttonToggleDots = false
public statusAndColor: any={
  color:'',
  StatusName:''
};
public color:any = "#82a7e2";
public color1: any = "#82a7e2";
public atasSub;
public selectedAtaSub;
public client_workers:any= [];
public project_id:any = 0;
public contacts:any= [];
public ataKsSub;
public getWeeklyReportSub;
public weekly_report:any = [];
public project:any = [];
public getAllowSendOrPrintWeeklyReportSub:any;
public sendCopy: boolean = false;
public hasChangesOnForm:boolean = false;
public getIfHasChangesOnFormSub;
public currentWeek = moment().isoWeek();
public newWRDisabled = false;
public weeks: any[] = [];
public buttonName = "Project Management";
public activeTab:any = 'ata';
private getActiveTabSub;
private getActiveChildrenKSIndexSub;
private getActiveKSIndexSub;
public active_children_weekly_report_index:number = 0;
public active_weekly_report_index:number = 0;
public getAllowPrintAtaSub;
public getAllowPrintAtaSub2;
public getAllowdownloadAtaPdfSub;
public ActiveComponentSub;
public activeComponent:any = 'ata';
public getAllowSendtAtaSub;
public getReminderStatusSub;
public getAtaReminderStatusSub;
public reminder:number = 0;
public ata_reminder:number = 0;
public getAvailableeSupplierInvoiceNumberSub;
public number_of_supp_inv:any = 0;
public getAllowEditAtaSub;
public editAta:boolean = true;
public userDetails: any;
public allowNewKS = true;
public projectUserDetails;
public ataId;
public getSelectedTabSub;
public selectedTab;
public adminRole;

    constructor(
        private ataInfoService:AtaInfoService,
        private route: ActivatedRoute,
        private projectsService: ProjectsService,
        private ataService: AtaService,
        private dialog: MatDialog,
        private translate: TranslateService,
        private toastr: ToastrService,
        private router: Router,
        private weeklyReportService: WeeklyReportsService,
        private AESEncryptDecryptService: AESEncryptDecryptService
    )
    {
        this.adminRole = this.AESEncryptDecryptService.sha256('Administrator');
    }

    ngOnInit(): void {

        if(this.overview == undefined) this.overview = false;
        this.route.queryParamMap.subscribe((params) => {
            this.type = params.get("type") || null;
            this.project_id = params.get("projectId") || 0;
        });

        this.projectUserDetails = this.route.snapshot.data["projectUserDetails"];
        this.ataId = this.route.params["value"]["id"];
        this.project = this.route.snapshot.data["project"]['data'];
        this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
        this.getAttestClientWorkers();
        this.getReminderStatus();
        this.getAtaReminderStatus();
        this.subToAtaSubject();
        this.subToSelectedAta();
        this.getWeeklyReport();
        this.getAllowSendOrPrintWeeklyReport();
        this.getIfHasChangesOnForm();
        this.getWeeks();
        this.getActiveTab();
        this.getActiveKSIndex();
        this.getActiveChildrenKSIndex();
        this.getAllowPrintAta();
        this.getAllowdownloadAtaPdf();
        this.getActiveComponents();
        this.getAllowSendtAta();
        this.getAvailableeSupplierInvoiceNumber();
        this.getAllowEditAta();
        this.getSelectedTab();
    }

    ngOnDestroy() {
        this.unsubFromAtaSubject();
        this.unsubFromSelectedAta();
        this.unSubgetAllowSendOrPrintWeeklyReport();
       // this.unSubGetWeeklyReport();
        this.unSubGetIfHasChangesOnForm();
        this.unSubGetActiveTab();
        this.unSubgetActiveChildrenKSIndex();
        this.unSubgetActiveKSIndex();
        this.unSubgetAllowPrintAta();
        this.unSubgetAllowdownloadAtaPdf();
        this.unSubActiveComponent();
        this.unSubGetAllowSendtAtaSub();
        this.unSubGetAvailableeSupplierInvoiceNumber();
        this.unSubGetReminderStatusSub();
        this.unSubGetAtaReminderStatus();
        this.unSubGetAllowEditAta();
    }

    ngOnChange(){
      this.allowOrDisable();
    }

    allowEditAta() {

        let status = false;
        const permissions = {
            ataExternal: Number(this.userDetails.create_project_Externalata),
            ataInternal: Number(this.userDetails.create_project_Internalata),
            ataExternal2: Number(this.projectUserDetails.Ata_External),
            ataInternal2: Number(this.projectUserDetails.Ata_Internal)
        }

        if(this.type == 'external') {
            if ((permissions.ataExternal && this.userDetails.role_name == this.adminRole /*'Administrator'*/) || permissions.ataExternal2) {
                status = true;
            }
        }else {
            if ((permissions.ataInternal && this.userDetails.role_name == this.adminRole /*'Administrator'*/) || permissions.ataInternal2) {
                status = true;
            }
        }

        return status;
    }

    setAtaType() {
        if (this.type === null) {
            this.type = this.selectedAta.Type == 1 ? 'external' : 'internal';
        }
    }

    unSubGetSelectedTab() {
        if(this.getSelectedTabSub) {
            this.getSelectedTabSub.unsubscribe();
        }
    }

    unSubGetAllowEditAta() {
        if(this.getAllowEditAtaSub) {
            this.getAllowEditAtaSub.unsubscribe();
        }
    }

    unSubGetAvailableeSupplierInvoiceNumber() {
        if(this.getAvailableeSupplierInvoiceNumberSub) {
            this.getAvailableeSupplierInvoiceNumberSub.unsubscribe();
        }
    }

    unSubGetReminderStatusSub() {
        if(this.getReminderStatusSub) {
            this.ataInfoService.setReminderStatus(0);
            this.getReminderStatusSub.unsubscribe();
        }
    }

    unSubGetAllowSendtAtaSub() {
        if(this.getAllowSendtAtaSub) {
            this.ataInfoService.setAllowSendtAta(false);
            this.getAllowSendtAtaSub.unsubscribe();
        }
    }

    unSubGetAtaReminderStatus() {
        if(this.getAtaReminderStatusSub) {
            this.ataInfoService.setAtaReminderStatus(0);
            this.getAtaReminderStatusSub.unsubscribe();
        }
    }

    getWeeks() {

        this.projectsService.getWeeksThatHaveWeekyReportForAta(this.selectedAta.ATAID).then((result) => {
            if (this.type == "external") {
                this.weeks = result["data"];
            } else {
                this.weeks = result["data"].filter((res) => res["external"] == "0");
            }
            this.checkWr();
        });
    }

    checkWr() {

        if (this.weeks.some((obj) => obj.week == this.currentWeek)) {
            this.newWRDisabled = true;
        }

        if ((this.weeks.length > 0 && this.weeks[this.weeks.length - 1].status == 2 ) || (this.number_of_supp_inv > 0)) {
            this.newWRDisabled = false;
        }

        if(this.weeks.length > 0 && this.weeks[this.weeks.length - 1].week == this.currentWeek && this.weeks[this.weeks.length - 1].status == 2) {
            this.newWRDisabled = false;
        }

        let exist_initialize_weeks = this.weeks.filter(
            (res) => res["status"] == 0
        );

        if(exist_initialize_weeks.length == 0 && this.weeks.length > 0 && this.weeks[this.weeks.length - 1].week == this.currentWeek && this.weeks[this.weeks.length - 1].status == 5) {
            this.newWRDisabled = false;
        }
    }

    getIfHasChangesOnForm() {
        this.getIfHasChangesOnFormSub = this.ataInfoService.getIfHasChangesOnForm().subscribe((status)=>{
            this.hasChangesOnForm = status;
            if(status){
                this.buttonToggle = false;
                this.buttonToggleDots = false;
            }
        });
    }

    getAttestClientWorkers() {
        this.projectsService.getAttestClientWorkers(this.project.id).then((res) => {
            this.client_workers = res;
        });
    }

    unSubGetReminderStatus() {
        if (this.ActiveComponentSub) {
          this.ActiveComponentSub.unsubscribe();
        }
    }

    unSubActiveComponent() {
        if (this.ActiveComponentSub) {
          this.ActiveComponentSub.unsubscribe();
        }
    }

    unSubgetAllowPrintAta() {
        if(this.getAllowPrintAtaSub) {
            this.getAllowPrintAtaSub.unsubscribe();
            this.ataInfoService.setAllowPrintAta(false);
        }

        if(this.getAllowPrintAtaSub2) {
            this.getAllowPrintAtaSub2.unsubscribe();
            this.ataInfoService.setAllowPrintAta(false);
        }
    }

    unSubgetAllowdownloadAtaPdf() {
        if(this.getAllowdownloadAtaPdfSub) {
            this.getAllowdownloadAtaPdfSub.unsubscribe();
            this.ataInfoService.setAllowDownloadAtaPdf(false);
        }
    }

    unSubgetActiveChildrenKSIndex() {
        if(this.getActiveChildrenKSIndexSub) {
            this.getActiveChildrenKSIndexSub.unsubscribe();
            this.ataInfoService.setActiveChildrenKSIndex(null);
        }
    }


    unSubgetActiveKSIndex() {
        if(this.getActiveKSIndexSub) {
            this.getActiveKSIndexSub.unsubscribe();
            this.ataInfoService.setActiveKSIndex(null);
        }
    }

    unSubGetActiveTab() {
        if(this.getActiveTabSub) {
            this.getActiveTabSub.unsubscribe();
            this.ataInfoService.setActiveTab('ata');
        }
    }

    unSubGetIfHasChangesOnForm() {
        if(this.getIfHasChangesOnFormSub) {
            this.getIfHasChangesOnFormSub.unsubscribe();
           // this.ataInfoService.setIfHasChangesOnForm(false);
        }
    }

    unSubGetWeeklyReport() {
        if(this.getWeeklyReportSub) {
            this.getWeeklyReportSub.unsubscribe();
            this.ataInfoService.setWeeklyReport(null);
        }
    }

    subToAtaSubject() {
        this.atasSub = this.ataInfoService.getAtas().subscribe((atas)=>{
            this.atas = atas;
        });
    }

    unSubgetAllowSendOrPrintWeeklyReport() {
        if(this.getAllowSendOrPrintWeeklyReportSub) {
            this.ataInfoService.setAllowSendOrPrintWeeklyReport(null);
            this.getAllowSendOrPrintWeeklyReportSub.unsubscribe();
        }
    }

    unsubFromAtaSubject() {
        if (this.atasSub) {
          this.atasSub.unsubscribe();
        }
    }

    updateAndPrint() {

        if(this.selectedTab == 6) {
            this.printOrSendKS([]);
        }else {
            if(this.activeTab == 'ata') {
                this.ataInfoService.setAllowUpdateAta('print');
            }else {
                if((this.hasChangesOnForm && this.weekly_report.Status == 0) || (this.hasChangesOnForm && this.weekly_report.Status == 1)) {
                    this.ataInfoService.setAllowUpdateWeeklyReport('print_wr');
                }else {
                    this.printWeeklyReport();
                }
            }
        }
    }

    printWeeklyReport() {
        if( this.activeTab == 'ks' && !this.weekly_report.pdf_url) {
            this.ataInfoService.setAllowUpdateWeeklyReport('print_wr');
        }else if(this.activeTab == 'ks') {
            printJS(this.weekly_report.pdf_url);
        }
    }

    printAta() {

        if(this.activeTab == 'ata' && !this.selectedAta.PDFUrl) {
            this.ataInfoService.setAllowUpdateAta('print');
        }else if(this.activeTab == 'ata' /*&& this.ataId == this.selectedAta.ATAID*/) {
            printJS(this.selectedAta.PDFUrl);
        }
    }

    downloadAtaPdf() {

        if(this.activeTab == 'ata' && !this.selectedAta.PDFUrl) {
            this.ataInfoService.setAllowUpdateAta('downloadAtaPdf');
        }else if(this.activeTab == 'ata') {
            const name = "ATA-" + this.selectedAta.AtaNumber + ".pdf";
            const link = document.createElement("a");
            link.href = this.selectedAta.PDFUrl;
            link.setAttribute("download", name);
            document.body.appendChild(link);
            link.click();
        }
       /* this.ataInfoService.setActiveTab('ata');
        this.ataInfoService.setActiveComponents('ata');

        let index_ata = this.atas.findIndex((x) => x.ATAID == this.selectedAta.ATAID);
        this.ataInfoService.setSelectedAta(index_ata);*/
    }

    setColorBasedOnStatus() {

        if (this.selectedAta.ATAID === -1) {return};
        let status:any = '';
        if(this.activeComponent == 'ata') {
            status = this.selectedAta?.Status;
        }else {
            status = this.weekly_report?.Status;
        }

        if(status) {
            this.setStatusInternal(status);
            this.iconColor = this.statusAndColor.color;
            this.iconStatusName = this.statusAndColor.StatusName
        }
    }

    subToSelectedAta() {
        this.selectedAtaSub = this.ataInfoService.getSelectedAta().subscribe((selectedAta)=>{
            this.selectedAta = selectedAta;
            this.setColorBasedOnStatus();
            this.setAtaType();
        });
    }

    unsubFromSelectedAta() {
        if (this.selectedAtaSub) {
          this.selectedAtaSub.unsubscribe();
        }
    }

    setStatusInternal(status) {

        this.statusAndColor.color = '';
        this.statusAndColor.StatusName = ''

        if(this.activeComponent == 'ata') {
            if (status == 0) {
              // Under pricing
              this.statusAndColor.StatusName = 'Under pricing'
              this.statusAndColor.color  = 'rgb(240, 226, 100)';
              return;
            }

            if (status == 2) {
              // In Progress
              this.statusAndColor.StatusName = 'In Progress'
              this.statusAndColor.color  = 'rgb(3, 209, 86)';
              return this.statusAndColor;
            }

            if (status == 3) {
              // Declined
              this.statusAndColor.StatusName = 'Declined'
              this.statusAndColor.color  = 'rgb(253, 68, 68)';
              return this.statusAndColor;
            }

            if (status == 4) {
              // Sent
              this.statusAndColor.StatusName = 'Sent'
              this.statusAndColor.color  = '#82A7E2';
              return this.statusAndColor;
            }

            if (status == 5) {
              // Completed
              this.statusAndColor.StatusName = 'Completed'
              this.statusAndColor.color  = '#fff';
              return this.statusAndColor;
            }

            if (status == 6) {
              // Aborted
              this.statusAndColor.StatusName = 'Aborted'
              this.statusAndColor.color  = 'rgb(184, 184, 184)';
              return this.statusAndColor;
            }

            if (status == 7) {
              // Clear
              this.statusAndColor.StatusName = 'Clear'
              this.statusAndColor.color  = 'rgb(231, 160, 252)';
            }

            if (status == 8) {
              // Question
              this.statusAndColor.StatusName = 'Question'
              this.statusAndColor.color  = 'rgb(240, 226, 100)';
            }
        }else {
            if (status == 0) {
              // Under pricing
              this.statusAndColor.StatusName = 'Under pricing'
              this.statusAndColor.color  = 'rgb(240, 226, 100)';
              return this.statusAndColor;
            }

            if (status == 1) {
              // Sent
              this.statusAndColor.StatusName = 'Sent'
              this.statusAndColor.color  = '#82A7E2';
              return this.statusAndColor;
            }


            if (status == 2) {
              // In Progress
              this.statusAndColor.StatusName = 'In Progress'
              this.statusAndColor.color  = 'rgb(3, 209, 86)';
              return this.statusAndColor;
            }

            if (status == 3) {
              // Declined
              this.statusAndColor.StatusName = 'Declined'
              this.statusAndColor.color  = 'rgb(253, 68, 68)';
              return this.statusAndColor;
            }

            if (status == 5) {
              // Completed
              this.statusAndColor.StatusName = 'Invoiced'
              this.statusAndColor.color  = '#fff';
              return this.statusAndColor;
            }
        }
    }

  dropSend() {
    this.buttonToggle = !this.buttonToggle;
    if(this.buttonToggle == false){
      this.buttonNameSummary(event,null, 'dropSend');
      this.contacts = [];
    }

  }
  closeToggle(num){
    if(num == 1){
        this.buttonToggle = !this.buttonToggle;
    }
    else if(num == 2)
    {
        this.buttonToggleDots = !this.buttonToggleDots;
    }
  }
    optionsDownDiv(){
        this.buttonToggleDots = !this.buttonToggleDots;
    }

    buttonNameSummary(event, worker, type){

        event.stopPropagation();

        if(worker) {
            let allowAddEmail:boolean = false;
            let selectedClientEmail = this.client_workers.find(
                (client) => client.Id == worker.Id
            );

            let client_responses = [];
            if(this.activeTab == 'ks') {
                client_responses = this.weekly_report.clientResponses;
            }else {
                client_responses = this.selectedAta.clientResponses.filter(
                  (res) => res["Status"] == 2
                );
            }

            if (
                selectedClientEmail &&
                client_responses.length > 0 &&
                client_responses.some(
                  (response) => response.answerEmail == selectedClientEmail.email
                ) &&
                (( this.activeTab == 'ks' && this.weekly_report.Status == 1) || (this.activeTab == 'ata' && this.selectedAta.Status == 4)) &&
                !worker.selected

            ) {

            const diaolgConfig = new MatDialogConfig();
            diaolgConfig.autoFocus = false;
            diaolgConfig.disableClose = true;
            diaolgConfig.panelClass = "mat-dialog-confirmation";
            diaolgConfig.data = {
              questionText: this.translate.instant("TSC_ALREADY_RESPONDED_ON_ATA"),
            };
            this.dialog
                .open(ConfirmationModalComponent, diaolgConfig)
                .afterClosed().subscribe((response) => {
                    if (!response.result) {
                        worker.selected = false;
                        allowAddEmail = false;
                    }else {
                        allowAddEmail = true;
                        this.addClient(worker, type);
                    }
                });
            }else {
                allowAddEmail = true;
            }

            if(allowAddEmail) {
                this.addClient(worker, type);
            }

            let obj = {
                'client_workers': this.client_workers,
                'contacts': this.contacts
            }

            this.ataInfoService.setClientWorkers(obj);
        }
    }

    addClient(worker, type) {

        if(worker && type == 'sent'){
            if(worker.selected){
                worker.selected = false;
                if(this.contacts.some((selectedWorker) => selectedWorker.Id == worker.Id)) {
                    this.contacts.splice(this.contacts.indexOf(worker), 1);
                }
            }else{
                worker.selected = true;
                this.contacts.push(worker)
            }
        }else if(type == 'dropSend'){ ///empty users from arr
            this.contacts.forEach(element => {
                element.selected = false;
            });
            this.contacts = [];
        }
    }

    allowSendWeeklyReport() {
        let status = true;
        if (this.weekly_report) {
          if (this.weekly_report.status != 4)
            status =
              this.weekly_report.tables.aaw.length > 0 ||
              this.weekly_report.tables.am.length > 0 ||
              this.weekly_report.tables.ao.length > 0
                ? true
                : false;
          else status = false;
        }
        return status;
    }

    checkIfContactSelected(contact) {
        if (
          this.contacts.some((selectedWorker) => selectedWorker.Id == contact.Id)
        ) {
            return true;
        } else return false;
    }

    getWeeklyReport() {
        this.getWeeklyReportSub = this.ataInfoService.getWeeklyReport().subscribe((report)=>{
            //this.ataInfoService.setSelectedTab(0);
            this.weekly_report = report;
            if(report) {
                this.setColorBasedOnStatus();
              //  this.ataInfoService.setActiveTab('ks');
              //  this.ataInfoService.setActiveComponents('weekly_report');
            }
        });
    }

    addWorker(worker) {
        this.contacts.push(worker);
    }

    async updateAndSend() {

        let send = true;
        if (this.contacts.length < 1 && this.selectedTab != 6) {
            send = false;
            return this.toastr.info(
                this.translate.instant(
                  "You first need to select an email where to send ata"
                ) + ".",
                this.translate.instant("Info")
            );
        }

        if(this.activeTab == 'ks') {
            if(this.weekly_report.Status != 0 && this.weekly_report.Status != 1) {
                this.sendCopy = true;
            }else {
                this.sendCopy = false;
            }
        }else {
            if(this.selectedAta.Status != 0 && this.selectedAta.Status != 4) {
                this.sendCopy = true;
            }else {
                this.sendCopy = false;
            }
        }

        if (

            !this.sendCopy &&
            this.contacts.length >= 1 &&
            !this.contacts.some((contact) => contact.Id == this.project["selectedMainContact"]) &&
            this.selectedTab != 6
        ) {
            send = false;
            return this.toastr.info(
                this.translate.instant("TSC_main_contact_email_has_to_be_selected"),
                this.translate.instant("Info")
            );
        }

        if(this.activeTab == 'ks' && this.selectedTab != 6) {
            if((!this.weekly_report.WeeklyReportDueDate && this.weekly_report.Status == 1) || (!this.weekly_report.WeeklyReportDueDate && this.weekly_report.Status == 0)) {
                send = false;
                return this.toastr.info(
                    this.translate.instant("Due date is required to send weekly report."),
                    this.translate.instant("Info")
                );
            }
        }

        if(send) {

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

            const diaolgConfig = new MatDialogConfig();
            diaolgConfig.autoFocus = false;
            diaolgConfig.disableClose = true;
            diaolgConfig.panelClass = "mat-dialog-confirmation";
            diaolgConfig.width = "";
            diaolgConfig.data = {
                questionText:
                    this.translate.instant("Are you sure you want to send email to: ") +
                    emails +
                    " ?",
            };

            console.log(this.selectedTab)

            this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().subscribe(async(response) => {
                if (response.result) {

                    if(this.selectedTab == 6) {
                        this.printOrSendKS(emails);
                    }else {
                        this.ataInfoService.setSpinner(true);
                        if(this.activeTab == 'ata') {
                            if((this.hasChangesOnForm && this.selectedAta.Status == 0) || (this.hasChangesOnForm && this.selectedAta.Status == 4)) {
                                this.ataInfoService.setAllowUpdateAta('send');
                            }else {
                                this.ataInfoService.setAllowUpdateAta('send2');
                            /*    if(this.selectedAta.Status == 4 || this.selectedAta.Status == 0) {
                                    this.ataInfoService.setAllowUpdateAta('send2');
                                }else {
                                    this.sendMail();
                                }
                            */
                            }
                        }else if(this.activeTab == 'ks') {
                            if((this.hasChangesOnForm && this.weekly_report.Status == 0) || (this.hasChangesOnForm && this.weekly_report.Status == 1)) {
                               this.ataInfoService.setAllowUpdateWeeklyReport('send_wr');
                            }else {
                                if(this.weekly_report.Status == 1) {
                                    this.ataInfoService.setAllowUpdateWeeklyReport('send_wr2');
                                }else {
                                    this.sendWeeklyReport();
                                }
                           }
                        }
                        //this.getAttestClientWorkers();
                    }
                }
            });
        }

    }

    getAllowSendOrPrintWeeklyReport() {
        this.getAllowSendOrPrintWeeklyReportSub = this.ataInfoService.getAllowSendOrPrintWeeklyReport().subscribe((res:any)=>{

            if(res && res == 'send_wr') {
                this.sendWeeklyReport();
            }
            if(res && res == 'print_wr') {
                this.printWeeklyReport();
            }
        });
    }

    getAllowPrintAta() {
        this.getAllowPrintAtaSub2 = this.ataInfoService.getAllowPrintAta().subscribe((status) => {
           if(status) {
               this.printAta();
           }
        });
    }

    getAllowdownloadAtaPdf() {
       this.getAllowPrintAtaSub = this.ataInfoService.getAllowdownloadAtaPdf().subscribe((status) => {
           if(status) {
               this.downloadAtaPdf();
           }
       });
    }


    refreshSendSelect() {
        this.client_workers = this.client_workers.map((item, index) => {
           item.selected = false;
           return item;
        });
        this.contacts = [];
    }

    sendWeeklyReport() {

        if(this.contacts.length > 0){

            const responsablePersonIndex = this.client_workers.length - 1
            const responsablePersonIsCheck = this.client_workers[responsablePersonIndex].selected;
            const emails = [];
            this.contacts.forEach((email) =>{
                emails.push(' ' + email.email)
            })

            const diaolgConfig = new MatDialogConfig();
            diaolgConfig.autoFocus = false;
            diaolgConfig.disableClose = true;
            diaolgConfig.width = "";
            diaolgConfig.panelClass = "mat-dialog-confirmation";
            diaolgConfig.data = {
            questionText: this.translate.instant("Are you sure you want to send email to: ") +
            emails +
            " ?",
            };

        //    this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().subscribe((response) => {
        //        if (response.result) {
                    if(responsablePersonIsCheck || (this.weekly_report.Status != 0 && this.weekly_report.Status != 1)) {

                      this.ataInfoService.setSpinner(true);
                      this.weekly_report.timesReminderSentDU = this.reminder;

                      this.contacts /// = this.client_workers; /// ovo srediti AMer
                      let dataObj = {
                        ...this.weekly_report,
                        clientName: this.project.clientName,
                        street: this.project.street,
                        city: this.project.city,
                        zip: this.project.zip,
                        ProjectName: this.project.name,
                        sendReminderDU: this.weekly_report.timesReminderSentDU,//this.reminderCheckboxDU ? true : false,
                        sendCopy: this.sendCopy,
                        pdf_url: this.weekly_report.pdf_url,
                      };

                      this.ataService
                        .sendWeeklyReport(this.contacts, dataObj)
                        .subscribe((res2:any) => {
                            console.log(res2);
                            if (res2["status"]) {
                                this.refreshSubscription();
                                if (this.weekly_report.Status == 0) {
                                  this.weekly_report.Status = 1;
                                  this.weekly_report.status = 1;
                                  this.ataInfoService.setWeeklyReport(this.weekly_report);
                                }
                                this.toastr.success(
                                  this.translate.instant(
                                    "You have successfully sent email!"
                                  ),
                                  this.translate.instant("Success")
                                );
                                this.ataInfoService.setSpinner(false);
                                this.setColorBasedOnStatus();
                                this.getWeeks();
                                this.getAttestClientWorkers();
                                this.refreshSendSelect();
                            }
                      });

                    }else{
                        this.toastr.info(
                          this.translate.instant("TSC_main_contact_email_has_to_be_selected"),
                          this.translate.instant("Info")
                        );
                    }
        //        }
        //    });
        }else{

          this.toastr.info(
            this.translate.instant("Please select user"),
            this.translate.instant("Info")
          );
        }
    }

    refreshSubscription() {
        this.ataInfoService.setSpinner(false);
        this.ataInfoService.setReminderStatus(0);
        this.ataInfoService.setAtaReminderStatus(0);
        this.ataInfoService.setAllowSendtAta(false);
        this.ataInfoService.setAllowSendOrPrintWeeklyReport(null);
    }

    getAllowSendtAta() {
        this.getAllowSendtAtaSub = this.ataInfoService.getAllowSendtAta().subscribe((status) => {
            if(status) {
                this.sendMail();
            }
        });
    }

    sendMail() {
        if(this.selectedAta.Status != 0 && this.selectedAta.Status != 4) {
            this.sendCopy = true;
        }else {
            this.sendCopy = false;
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

        this.selectedAta.sendReminder = this.selectedAta.timesReminderSent;
        this.selectedAta.projectCustomName = this.project.CustomName;
        this.selectedAta.sendCopy = this.sendCopy;
        this.selectedAta.ProjectCustomName = this.project.CustomName;
        this.selectedAta.type_name = this.type;
        this.selectedAta.sendReminder = this.ata_reminder;


        this.ataService.sendAtaToClient(this.selectedAta, { contacts: this.contacts }).subscribe((res) => {

            if(res['status']) {

                this.refreshSubscription();
                if(this.selectedAta.Status == 0 ){
                    this.ataInfoService.setAtaStatus(4);
                    this.selectedAta.Status = 4;
                }
                this.toastr.success(
                    this.translate.instant(
                        "You have successfully sent email!"
                    ),
                    this.translate.instant("Success")
                );
                this.selectedAta.status = 4;
                this.setColorBasedOnStatus();
                this.ataInfoService.setAllowSendtAta(false);
                this.refreshSendSelect();
            }
        });
    }


    manuallyCreateWeeklyReport() {
        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = false;
        diaolgConfig.disableClose = true;
        diaolgConfig.width = "";
        diaolgConfig.panelClass = "mat-dialog-confirmation";
        this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().subscribe((response) => {
            if (response.result) {
                this.ataInfoService.setSpinner(true);
                if(false && this.weeks.length > 0 && this.weeks[this.weeks.length - 1].week == this.currentWeek && this.weeks[this.weeks.length - 1].status == 2) {
                    this.ataInfoService.setSpinner(true);
                    this.weeklyReportService.createWeeklyReportRevision(this.weekly_report).then((res)=> {
                        if(res) {
                            this.ataInfoService.setSpinner(false);
                            this.ataInfoService.setReloadWeeklyReportByNames(true);
                            this.setColorBasedOnStatus();
                            this.getWeeks();
                        }
                    });
                }else {
                    this.ataInfoService.setSpinner(true);
                    this.ataService.manuallyCreateWeeklyReport(
                      this.project.id,
                      this.selectedAta.ATAID
                    ).subscribe((res) => {
                        if (res["status"]) {
                            this.ataInfoService.setSpinner(false);
                            this.ataInfoService.setReloadWeeklyReportByNames(true);
                            this.setColorBasedOnStatus();
                            this.getWeeks();
                        }
                    });
                }

                this.ataInfoService.setSelectedTab(0);
            }
        });
    }

    setAtaStatus(statusObj) {

        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = false;
        diaolgConfig.disableClose = true;
        diaolgConfig.width = "";
        diaolgConfig.panelClass = "mat-dialog-confirmation";
        this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().subscribe((response)=>{
            if(response.result) {
                this.ataInfoService.setSpinner(true);
                this.ataInfoService.setAllowUpdateAtaStatus(statusObj);
                this.selectedAta.Status = statusObj.Status;
                this.activeComponent = 'ata';
                this.setColorBasedOnStatus();
                this.selectedAta.ata_statuses.forEach((status) => {
                    status.checked = false;
                });
            }else {
                this.selectedAta.ata_statuses.forEach((status) => {
                    status.checked = false;
                });
            }
        });
    }

    manuallyAccept() {
        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = false;
        diaolgConfig.disableClose = true;
        diaolgConfig.width = "";
        diaolgConfig.panelClass = "mat-dialog-confirmation";
        this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().subscribe((response)=>{
            if (response.result) {
                this.ataInfoService.setSpinner(true);
                if(this.activeTab == 'ks') {
                    this.ataInfoService.setAllowManualAcceptWeeklyReport(true);
                    this.getWeeks();
                    this.ataInfoService.setReloadAtaFromTab(true);
                }else {
                    this.ataInfoService.setAllowManualAcceptAta(true);
                }
            }

        });
    }

    manuallyDecline() {
        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = false;
        diaolgConfig.disableClose = true;
        diaolgConfig.width = "";
        diaolgConfig.panelClass = "mat-dialog-confirmation";
        this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().subscribe((response)=>{
            if (response.result) {
                this.ataInfoService.setSpinner(true);
                if(this.activeTab == 'ks') {
                    this.ataInfoService.setAllowManualDeclineWeeklyReport(true);
                    this.getWeeks();
                }else {
                    this.ataInfoService.setAllowManualDeclineAta(true);
                }
            }
        });
    }

    createRevision() {
        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = false;
        diaolgConfig.disableClose = true;
        diaolgConfig.width = "";
        diaolgConfig.panelClass = "mat-dialog-confirmation";
        this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().subscribe((response)=>{
            if (response.result) {

                this.ataInfoService.setSpinner(true);
                if(this.activeTab == 'ks') {
                    //
                    this.getWeeks();
                }else {
                    this.ataInfoService.setAllowCreateRevisionAta(true);
                }
            }
            this.setColorBasedOnStatus();
        });
    }

    getActiveTab() {
        this.getActiveTabSub = this.ataInfoService.getActiveTab().subscribe((result) => {
            if(result) {
                this.activeTab = result;
                this.setColorBasedOnStatus();
            }
        });
    }

    getActiveKSIndex() {
        this.getActiveKSIndexSub = this.ataInfoService.getActiveKSIndex().subscribe((index) => {
            if(index) {
                this.active_weekly_report_index = index;
            }
        });
    }

    getActiveChildrenKSIndex() {
        this.getActiveChildrenKSIndexSub = this.ataInfoService.getActiveChildrenKSIndex().subscribe((index) => {
            if(index) {
                this.active_children_weekly_report_index = index;
            }
        });
    }

  getActiveComponents() {
    this.activeComponent = 'ata';
    this.ActiveComponentSub = this.ataInfoService.getActiveComponents().subscribe((component)=>{
        if(component) {
            this.activeComponent = component;
            this.setColorBasedOnStatus();
        }
    });
  }

    allowOrDisable() {
        let status = null;
        if(this.editAta) {
            if(this.activeComponent == 'ata') {
                 if( this.hasChangesOnForm ) {
                     status = true;
                 }
            }else {
                if( this.hasChangesOnForm || (this.weekly_report.Status != 0 && this.weekly_report.Status != 1)) {
                    status = true;
                }

                if( this.hasChangesOnForm) {

                }
            }
        }else {
            status = true;
        }
        return status;

    }

    getReminderStatus() {
        this.getReminderStatusSub = this.ataInfoService.getReminderStatus().subscribe((status)=> {
            this.reminder = status;
        });
    }

    getAtaReminderStatus() {
        this.getAtaReminderStatusSub = this.ataInfoService.getAtaReminderStatus().subscribe((status)=> {
            this.ata_reminder = status;
        });
    }

    getAvailableeSupplierInvoiceNumber() {
        this.getAvailableeSupplierInvoiceNumberSub = this.ataInfoService.getNumberOfInvoices().subscribe((number) => {
            this.number_of_supp_inv = number;
        });
    }

    getSelectedTab() {
        this.getSelectedTabSub = this.ataInfoService.getSelectedTab().subscribe((data)=> {
            this.selectedTab = data;
        });
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

            this.ataService
                .makeAtaExternal(this.selectedAta)
                .subscribe((res) => {
                if (res["status"]) {
                    this.selectedAta.external = 1;
                    this.selectedAta.EmailSent = 1;

                    this.ataService.refreshAdministrationUserAndAta(
                    this.selectedAta["ATAID"],
                    this.project.id
                    );
                    this.toastr.success(
                    this.translate.instant(
                        "Successfully transferred to External ATA."
                    ),
                    this.translate.instant("Success")
                    );
                    this.router.navigate(['/projects/view/ata/modify-ata/', this.selectedAta.ATAID], { queryParams: { type: 'external', projectId: this.selectedAta.ProjectID } }).then(() => {
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


    onEnter(type){
        if(type == 'send'){
            this.color = "var(--orange-dark)"
        }else{
            this.color1 = "var(--orange-dark)"
        }

    }
    onLeave(type){
        if(type == 'send'){
            this.color = "#82a7e2"
        }else{
            this.color1 = "#82a7e2"
        }

    }

    externalDevToInternalAta() {

        const ata_relations = this.selectedAta.ata_relations;
        const findExternalU = relation => relation.parent_number.includes('External-U');

        if (ata_relations.find(findExternalU)) {
            return false;
        }

        return true;
    }


    //Dodano za DropDown Send/Print
    public user:string;
    public SelectedUser($event: any):void{

        this.contacts = $event;
        this.contacts.forEach(contact => {
            contact.selected = true;
        });

        let obj = {
            'client_workers': this.client_workers,
            'contacts': this.contacts
        }

        this.ataInfoService.setClientWorkers(obj);
    }

    ManuallyAccept(){
      this.manuallyAccept();
    }

    ManuallyDecline(){
      this.manuallyDecline();
    }

    ManuallyRevision(){
      this.createRevision();
    }

    ManuallyTransfer(){
      this.makeExternalAta();
    }

    ManuallyAborted(){
      this.setAtaStatus({'Status': 6, 'ata_id': this.selectedAta.ATAID, 'Name': 'Aborted'});
    }


    getAllowEditAta() {
        this.getAllowEditAtaSub = this.ataInfoService.getAllowEditAta().subscribe((status)=> {
            this.editAta = status;
        });
    }

    buttonStatus() {
        if(this.editAta && !this.hasChangesOnForm) {
            return null;
        }else {
            return true;
        }
    }

    checkStatus() {
        if (this.project.status != "2") this.allowNewKS = false;
    }

    async printOrSendKS(emails){

        let weeklyReports = [];
        this.ataInfoService.setSpinner(true);
        let res = await this.ataService.getWeeklyReportsByAtaId(this.ataId, this.project.id)
        this.ataInfoService.setSpinner(false);
        weeklyReports = res["data"];
        let printedDataWeeklyReports = [];

        let sumAllTotallyWorkedUp = 0;
        let sumAllWorkedButNotApproved = 0;
        let sumAllApprovedForInvoice = 0;
        let sumAllInvoicedTotal = 0;
        let sumAllWrSent = 0;

        weeklyReports.forEach(weeklyReport => {

            const status = weeklyReport.status;
            const tables = weeklyReport.tables;
            let workTotal = 0;
            let materialTotal = 0;
            let otherTotal = 0;

            tables["aaw"].forEach((aaw) => {
                if (
                  aaw["additionalWorkStatus"] == "accepted" ||
                  aaw["additionalWorkStatus"] == "" ||
                  aaw["additionalWorkStatus"] == null
                )
                  workTotal = workTotal + Number(aaw["Total"]);
            });
            const workTotalFixed = Number(workTotal.toFixed(2));
            tables["am"].forEach((am) => {
                if (
                  am["additionalWorkStatus"] == "accepted" ||
                  am["additionalWorkStatus"] == "" ||
                  am["additionalWorkStatus"] == null
                )
                  materialTotal = materialTotal + Number(am["Total"]);
            });
            const materialTotalFixed = Number(materialTotal.toFixed(2));
            tables["ao"].forEach((ao) => {
                if (
                  ao["additionalWorkStatus"] == "accepted" ||
                  ao["additionalWorkStatus"] == "" ||
                  ao["additionalWorkStatus"] == null
                )
                  otherTotal = otherTotal + Number(ao["Total"]);
            });
            const otherTotalFixed = Number(otherTotal.toFixed(2));
            const totalWorkedUp = Number(workTotalFixed + materialTotalFixed + otherTotalFixed).toFixed(2);

            weeklyReport.TOTALWORKEDUP_WR = Number(totalWorkedUp);
            weeklyReport.INVOICED_WR = 0;
            weeklyReport.LASTREGULATE_WR = 0;
            weeklyReport.SENT_WR = 0;
            weeklyReport.APPROVEDTOINVOICE_WR = 0;

            sumAllTotallyWorkedUp += Number(totalWorkedUp);

            if (status == "5") {
                weeklyReport.INVOICED_WR = Number(totalWorkedUp);
                sumAllInvoicedTotal += Number(totalWorkedUp);
            } else if (status == "2") {
                weeklyReport.APPROVEDTOINVOICE_WR = Number(totalWorkedUp);
                sumAllApprovedForInvoice += Number(totalWorkedUp);
            } else if (status == "0") {
                weeklyReport.LASTREGULATE_WR = Number(totalWorkedUp);
                sumAllWorkedButNotApproved += Number(totalWorkedUp);
            } else if (status == "1") {
                weeklyReport.SENT_WR = Number(totalWorkedUp);
                sumAllWrSent += Number(totalWorkedUp);
            }

            printedDataWeeklyReports.push({
                "year":           weeklyReport.year,
                "name":           weeklyReport.name,
                "totalWorkedUp":  weeklyReport.TOTALWORKEDUP_WR.toFixed(2),
                "lastRegulate":   weeklyReport.LASTREGULATE_WR.toFixed(2),
                "sent":           weeklyReport.SENT_WR.toFixed(2),
                "approwedInvoice":weeklyReport.APPROVEDTOINVOICE_WR.toFixed(2),
                "invoiced":       weeklyReport.INVOICED_WR.toFixed(2)
              })
            });

            let wrData = {
              "wrData":printedDataWeeklyReports.reverse(),
              "sumTotalWorkedUp":sumAllTotallyWorkedUp.toFixed(2),
              "sumLastRegulate":sumAllWorkedButNotApproved.toFixed(2),
              "sumSent":sumAllWrSent.toFixed(2),
              "sumApprowedInvoice":sumAllApprovedForInvoice.toFixed(2),
              "sumInvoiced":sumAllInvoicedTotal.toFixed(2),
              "AuthorName":this.selectedAta.AuthorName,
              "ata": this.translate.instant('ÄTA - ')+this.selectedAta.AtaNumber + ": "+ this.selectedAta.Name

            }

        this.ataService.sendAtasWeeklyReportsToClient(emails,wrData,this.project).subscribe({next: (response) =>
            {
                if(emails.length == 0){
                    printJS(response["summaryUrl"]);
                }else{
                    this.toastr.success(
                      this.translate.instant(
                        "You have successfully sent email!"
                      ),
                      this.translate.instant("Success")
                    );
                }
            },error: (_) => {
                this.toastr.error(
                this.translate.instant(
                    "Couldn`t send the email, please try again."
                ),
                    this.translate.instant("Error")
                );
            },
        });
    }
}