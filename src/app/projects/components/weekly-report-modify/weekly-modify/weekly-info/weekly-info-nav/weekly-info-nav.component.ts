import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationModalComponent } from 'src/app/shared/modals/confirmation-modal/confirmation-modal.component';
import { ProjectsService } from "src/app/core/services/projects.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { WeeklyReportInfoService } from 'src/app/projects/components/weekly-report-modify/weekly-report-info.service';
import * as printJS from "print-js";
import { AtaService } from "src/app/core/services/ata.service";
import * as moment from "moment";
import { WeeklyReportsForSelectComponent } from 'src/app/external/components/weekly-reports-for-select/weekly-reports-for-select.component';

@Component({
  selector: 'app-weekly-info-nav',
  templateUrl: './weekly-info-nav.component.html',
  styleUrls: ['./weekly-info-nav.component.css']
})
export class WeeklyInfoNavComponent  implements OnInit, OnDestroy {
    public iconColor = "";
    public iconStatusName = "";
    /* public selectedAta:any = {
    ATAID: -1,
    Status: -1,
    AtaNumber: -1,
    Name: '',
    PDFUrl: '',
    status
    }; */
    public activeComponent:any = 'ata';
    public weekly_report:any;
    public statusAndColor: any={
    color:'',
    StatusName:''
    };
    /**PRVI DROPDOWN*/
    public buttonToggle = false;
    public color:any = "#82a7e2";
    public color1: any = "#82a7e2";
    //public client_workers:any= [];
    public contacts:any= [];
    public hasChangesOnForm:boolean = false;
    public reminder:number = 0;
    public editAta:boolean = true;
    public statusfornavinfo;
    public sendCopy:boolean = false;
    public getAllowSendOrPrintWeeklyReportSub:any;
    public getPdfUrlSub;
    public getReminderSub;
    public currentWeek = moment().isoWeek();
    public weeks: any[] = [];
    public newWRDisabled = false;
    public userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    public getWeeklyReportSub;
    public number_of_invoices:number = 0;
    public getInvoiceSub;
    public allow_supplier:boolean = false;
    @Input() status;
    @Input() weekly_report_names;
    @Input() client_workers;
    @Input() supplierInvoices;
    @Input() selectedTab;
    /*DRUGI DROPDOWN* */
    public selectedAta:any= [
    {
    id:'1',
    name:'Utkast'
    },
    {
    id:'2',
    name:'Skickad'
    },
    {
    id:'3',
    name:'Accepterad'
    },

    ];

    public weekly_report_status:any=[

    {
        id:'1',
        name:'Accepted'
        //name: this.translate.instant("Accepted")
    },
    {
        id:'2',
        name:'Decline'
        //name: this.translate.instant("Decline")
    },
    /*  {
     id:'3',
     name:'Accepterad'
    }, */
    ]

    @Input() disable;
    @Input() project;

    public buttonToggleDots = false
    public allowSendGroupOfWeeklyReport:boolean = false;
    public getSelectedTabSub;
   // public selectedTab;

    optionsDownDiv(){
        this.buttonToggleDots = !this.buttonToggleDots;
    }

    constructor
    (
        private dialog: MatDialog,
        private toastr: ToastrService,
        private translate: TranslateService,
        private weeklyReportInfoService: WeeklyReportInfoService,
        private projectService: ProjectsService,
        private ataService: AtaService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit(): void {
       // this.weeklyReportInfoService.setSpinner(true);
        this.project =  this.route.snapshot.data["project"];
        this.initAllowSendWr();
        this.statusLogo();
        this.getPdfUrl();
        this.getAllowSendOrPrintWeeklyReport();
        this.getReminder();
        this.getWeeks();
        this.getWeeklyReport();
        this.getInvoice();
        this.getSelectedTab();
    }

    ngOnDestroy() {
        this.unSubgetAllowSendOrPrintWeeklyReport();
        this.unSubGetPdfUrl();
        this.unSubGetReminder();
        this.unSubGetWeeklyReport();
        this.unSubgetInvoice();
        this.unSubGetSelectedTab();
    }

    unSubGetSelectedTab() {
        if(this.getSelectedTabSub) {
            this.getSelectedTabSub.unsubscribe();
        }
    }

    unSubgetInvoice() {
        if(this.getInvoiceSub) {
            this.getInvoiceSub.unsubscribe();
        }
    }

    unSubGetWeeklyReport() {
        if(this.getWeeklyReportSub) {
            this.getWeeklyReportSub.unsubscribe();
        }
    }

    unSubGetPdfUrl() {
        if(this.getPdfUrlSub) {
            this.weeklyReportInfoService.setPdfUrl(null);
            this.getPdfUrlSub.unsubscribe();
        }
    }

    unSubGetReminder() {
        if(this.getReminderSub) {
            this.weeklyReportInfoService.setReminder(false);
            this.getReminderSub.unsubscribe();
        }
    }

    unSubgetAllowSendOrPrintWeeklyReport() {
        if(this.getAllowSendOrPrintWeeklyReportSub) {
            this.weeklyReportInfoService.setAllowSendOrPrintWeeklyReport(null);
            this.getAllowSendOrPrintWeeklyReportSub.unsubscribe();
        }
    }

  dropSend() {
    this.buttonToggle = !this.buttonToggle;
    if(this.buttonToggle == false){
      this.buttonNameSummary(event,null, 'dropSend');
      this.contacts = [];
    }

  }

    statusLogo() {

        if (this.statusfornavinfo == 0) {
          this.iconStatusName = 'Declined';
          this.iconColor  = 'rgb(253, 68, 68)';
        }else if(this.statusfornavinfo==1){
          this.iconStatusName = 'In Progress';
          this.iconColor  = 'rgb(3, 209, 86)';
        }else if(this.statusfornavinfo==2){
          this.iconStatusName = 'Sent';
          this.iconColor  = 'rgb(130, 167, 226)';
        }else if(this.statusfornavinfo==3){
          this.iconStatusName = 'Accepterad';
         /*  this.iconColor  = 'rgb(130, 167, 226)'; */
        }else if(this.statusfornavinfo==4){
          this.iconStatusName = 'Under pricing';
          this.iconColor  = '#F0E264';
        }else if(this.statusfornavinfo==5){
          this.iconStatusName = 'Invoiced';
          this.iconColor  = '#FFFFFF';
        }
    }

    GetStatus(status)
    {
        this.statusfornavinfo=status;
        this.statusLogo();
    }

    buttonNameSummary(event, worker, type){

        if(worker) {
            let allowAddEmail:boolean = false;


            let client_responses = [];


            if (client_responses.length > 0) {


            }else {
                allowAddEmail = true;
            }

            if(allowAddEmail) {
                this.addClient(worker, type);
            }


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
    closeToggle(num){
        if(num == 1){
            this.buttonToggle = !this.buttonToggle;
        }else if(num == 2){
            this.buttonToggleDots = !this.buttonToggleDots;
        }
    }

    buttonStatus() {
        if(this.editAta && !this.hasChangesOnForm) {
            return null;
        }else {
            return true;
        }
    }

    public fill = '#82A7E2';

    mouseOver()
    {
        this.fill = 'var(--orange-dark)';
    }
    mouseleave()
    {
        this.fill = '#82A7E2';
    }

    initializePrintWeeklyReport(event) {

        if(this.selectedTab == 1) {
            this.printOrSendKS(null);
        }else {
            if(!this.sendCopy && this.weekly_report.Status == 0) {
                this.weeklyReportInfoService.setAllowUpdateWeeklyReport('print');
            }else {
                this.printWeeklyReport();
            }
        }
    }

    initializeSendWeeklyReport($event) {
        this.contacts = $event;
        /*let send = true;
        if (this.contacts.length < 1) {
            send = false;
            return this.toastr.info(
                this.translate.instant(
                  "You first need to select an email where to send ata"
                ) + ".",
                this.translate.instant("Info")
            );
        } */

        if(this.selectedTab == 1) {
            let emails = '';
            const additionalEmailList = this.contacts.map((contact) => {
                contact.email = this.client_workers.find((x) => x.Id == contact.Id).email;
                return contact;
            });
            additionalEmailList.forEach((rp, index) => {
                emails =
                    emails +
                    (rp.email ? rp.email : rp.Name) +
                    (index === additionalEmailList.length - 1 ? "" : ", ");
            });

            this.printOrSendKS(emails);
        }else {
            if(!this.sendCopy && this.weekly_report.Status == 0 || this.reminder) {
                this.weeklyReportInfoService.setAllowUpdateWeeklyReport('send');
            }else {
                this.sendWeeklyReport();
            }
        }
    }

    getActiveWeeklyReport(data) {
        this.weekly_report = data;
        this.sendCopy = false;
        if(data.Status > 1) {
            this.sendCopy = true;
        }
        this.setColorBasedOnStatus();
    }

    getAllowSendOrPrintWeeklyReport() {
        this.getAllowSendOrPrintWeeklyReportSub = this.weeklyReportInfoService.getAllowSendOrPrintWeeklyReport().subscribe((res:any)=>{

            if(res && res == 'send') {
                this.sendWeeklyReport();
            }
            if(res && res == 'print') {
                this.printWeeklyReport();
            }
        });
    }

    getReminder() {
        this.getReminderSub = this.weeklyReportInfoService.getReminder().subscribe((res:any)=>{
            if(res) {
                this.reminder = 1;
            }else {
                this.reminder = 0;
            }
        });
    }

    getPdfUrl() {
        this.getPdfUrlSub = this.weeklyReportInfoService.getPdfUrl().subscribe((res:any)=>{

            if(res) {
                this.weekly_report.pdf_url = res;
            }
        });
    }

    sendWeeklyReport() {
        this.weeklyReportInfoService.setSpinner(true);
        let emails = "";
        const additionalEmailList = this.contacts.map((contact) => {
            contact.email = this.client_workers.find((x) => x.Id == contact.Id).email;
            return contact;
        });
        additionalEmailList.forEach((rp, index) => {
            emails =
                emails +
                (rp.email ? rp.email : rp.Name) +
                (index === additionalEmailList.length - 1 ? "" : ", ");
        });

        let object = {
            emails: additionalEmailList,
            reportId: this.weekly_report.id,
            projectId: this.project.id,
            pdf_url: this.weekly_report.pdf_url,
            timesReminderSentDU: this.reminder,
            sendReminderDU: this.reminder,
            sendCopy: this.sendCopy,
        }

        this.projectService.sendWeeklyReport(object).then((response) => {
            if (response["status"]) {

                if (this.weekly_report.Status == 0 || this.weekly_report.status == 0) {
                    this.weekly_report.Status = 1;
                    this.weekly_report.status = 1;
                    this.setColorBasedOnStatus();
                    this.weeklyReportInfoService.setWeeklyReport(this.weekly_report);
                    this.getWeeks();
                    this.initAllowSendWr();
                    this.toastr.success(
                      this.translate.instant(
                        "You have successfully sent email!"
                      ),
                      this.translate.instant("Success")
                    );
                }
                this.weeklyReportInfoService.setSpinner(false);
            }
        });

    }

    setColorBasedOnStatus() {

        let status:any = this.weekly_report?.Status;

        if(status) {
            this.setStatusInternal(status);
            this.iconColor = this.statusAndColor.color;
            this.iconStatusName = this.statusAndColor.StatusName
        }
    }

   setStatusInternal(status) {

        this.statusAndColor.color = '';
        this.statusAndColor.StatusName = '';

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

    printWeeklyReport() {
        printJS(this.weekly_report.pdf_url);
        this.weeklyReportInfoService.setSpinner(false);
    }

    manuallyCreateWeeklyReport() {
        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = false;
        diaolgConfig.disableClose = true;
        diaolgConfig.width = "";
        diaolgConfig.panelClass = "mat-dialog-confirmation";
        this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().subscribe((response) => {

            if (response.result) {
                this.weeklyReportInfoService.setSpinner(true);
                this.number_of_invoices = 0;
                this.allow_supplier = false;
                this.ataService.manuallyCreateWeeklyReport(
                    this.project.id,
                    0
                ).subscribe((res) => {
                    if (res["status"]) {
                        this.weeklyReportInfoService.setReloadWeeklyReportByNames(true);
                        this.weeklyReportInfoService.setSpinner(false);
                        this.setColorBasedOnStatus();
                        this.getWeeks();
                        this.initAllowSendWr();
                    }
                });
            }
        });
    }

    setSelectedStatus(event) {
        if(event) {
            this.weeklyReportInfoService.setSelectedStatus(event.name);
        }
    }

    allowCreateNrwWeeklyReport() {
        let status = false;
        if ((this.selectedTab == 0 && this.project.status == "2" && !this.newWRDisabled && this.userDetails.create_project_WeeklyReport) || (this.selectedTab == 0 && this.project.status == "2" && this.allow_supplier && this.userDetails.create_project_WeeklyReport && !this.allowSendGroupOfWeeklyReport) ) {
            status = true;
        }
        return status;
    }

    getWeeks() {

        this.projectService.getWeeksThatHaveWeekyReportForAta(0, this.project.id).then((result) => {
            this.weeks = result["data"];
            this.checkWr();
        });
    }

    checkWr() {

        if (this.weeks.some((obj) => obj.week == this.currentWeek)) {
            this.newWRDisabled = true;
        }

        if ((this.weeks.length > 0 && this.weeks[this.weeks.length - 1].status == 2 ) /*|| (this.number_of_supp_inv > 0)*/) {
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

    getWeeklyReport() {
        this.getWeeklyReportSub = this.weeklyReportInfoService.getWeeklyReport().subscribe((report)=>{
            if(report) {
                this.weekly_report = report;
                this.getWeeks();
                this.initAllowSendWr();
            }
        });
    }

    getSelectedTab() {
        this.getSelectedTabSub = this.weeklyReportInfoService.getSelectedTab().subscribe((data)=>{
            this.selectedTab = data;
        });
    }

    initAllowSendWr() {
        if(this.weekly_report_names && this.weekly_report_names.length > 0) {
            let filtered_data = this.weekly_report_names.find((x) => { return x.status == 0 || x.status == 1 });
            if(filtered_data) {
                this.allowSendGroupOfWeeklyReport = true;
            }
        }
    }

    sendWeeklyReports(status) {

        if(this.selectedTab == 1) {

        }else {
            if(status && this.allowSendGroupOfWeeklyReport) {
                this.openWeeklyReportsModal();
            }
        }
    }

    openWeeklyReportsModal() {
        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = true;
        diaolgConfig.disableClose = true;
        //diaolgConfig.width = "100%";
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

    getInvoice() {

        this.getInvoiceSub = this.weeklyReportInfoService.getNumberOfInvoice().subscribe((report)=>{
            if(report) {

                this.number_of_invoices = report;
                if(this.number_of_invoices > 0) {

                    if(this.weekly_report_names) {

                        let filtered_data = this.weekly_report_names.find((x) => (x.status == 0) && x.parent == 0);
                        if(filtered_data || (this.weekly_report_names && this.weekly_report_names.length == 0)) {
                            this.allow_supplier = false;
                        }else {
                            this.allow_supplier = true;
                        }
                    }else {
                        this.allow_supplier = true;
                    }
                }
            }
        });
    }

    async printOrSendKS(emails){

        let weeklyReports = [];
        this.weeklyReportInfoService.setSpinner(true);
        let res = await this.ataService.getWeeklyReportsByAtaId(0, this.project.id)

        console.log(res)
        console.log(this.project)
        console.log(this.userDetails)

        this.weeklyReportInfoService.setSpinner(true);
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
              "AuthorName": this.userDetails.firstname + ' ' + this.userDetails.lastname,
              "ata": null

            }

        this.ataService.sendAtasWeeklyReportsToClient(emails,wrData,this.project, 'du').subscribe({next: (response) =>
            {
                this.weeklyReportInfoService.setSpinner(false);
                if(!emails){
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
