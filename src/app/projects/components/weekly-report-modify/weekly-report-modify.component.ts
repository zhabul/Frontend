
import { Component, OnInit, OnDestroy} from '@angular/core';
///import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, } from '@angular/router';
//import * as printJS from "print-js";
//import { BASE_URL } from "src/app/config/index";
/* import * as printJS from "print-js";
 */import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmModalComponent } from 'src/app/shared/modals/confirm-modal/confirm-modal.component';
/* import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core"; */
import { WeeklyReportInfoService } from 'src/app/projects/components/weekly-report-modify/weekly-report-info.service';
import { WeeklyReportsService } from "src/app/core/services/weekly-reports.service";
import { GeneralsService } from "src/app/core/services/generals.service";
import { ProjectsService } from "src/app/core/services/projects.service";

@Component({
  selector: 'app-weekly-report-modify',
  templateUrl: './weekly-report-modify.component.html',
  styleUrls: ['./weekly-report-modify.component.css']
})

export class WeeklyReportModifyComponent  implements OnInit, OnDestroy {

    public project;
    public selectedTab = 0;
    public setHeight = {
      'height' : 'calc(100vh - 132px - 0px)'
    };
    public get_last_email_log_but_first_client_wr = [];
    public showPdfPreview = false;
    public whichPdfPreview = "du";
    public weekly_report :any= null;
    public current_user: any = JSON.parse(sessionStorage.getItem("userDetails"));
    public current_user_full_name;
    public articlesAdditionalWork :any = [];
    public additionalWorkMoments = [];
    public articlesMaterial :any= [];
    public articlesOther :any= [];
    public generalImage;
    public ActiveComponentSub;
    public activeComponent;
    public generals;
    public client_workers = [];
    public email_logs:any = [];
    public supplierInvoices: any[] = [];
    public visible:boolean = false;
    public weekly_report_names:any;
    public spinner:boolean= false;
    public spinnerSub;
    public getReloadWeeklyReportByNamesSub;
    public weeklyreport_id;
    public getWeeklyReportSub;
    public formValues;

    constructor(
        private route: ActivatedRoute,
        private projectsService: ProjectsService,
        private dialog: MatDialog,

        private weeklyReportInfoService: WeeklyReportInfoService,
        private weeklyReportsService: WeeklyReportsService,
        private generalsService: GeneralsService,
        private projectService: ProjectsService,
        // private toastr: ToastrService,
        // private translate: TranslateService,
        // private router: Router
    ) { }

    async ngOnInit(): Promise<void> {

        this.route.queryParamMap.subscribe((params) => {
            this.weeklyreport_id = params.get("weeklyreport_id") || 0;
        });
        this.project =  this.route.snapshot.data["project"];
        this.formValues = {
            Name: this.project.name,
            StartDate: this.project.StartDate,
            street: this.project.clientStreet,
            zip: this.project.clientZip,
            city: this.project.clientCity,
            clientName: this.project.clientName,
            DueDate: this.project.EndDate,
            paymentTypeName: this.project.debit_name,
            AuthorName: this.project.AuthorName,
        };

        if(this.weeklyreport_id) {
            await this.getNotSendWeeklyReportsByAtaIdOnlyNames();
        }
        this.weekly_report_names =  this.route.snapshot.data["weekly_report_names"];
        this.current_user_full_name = this.current_user.firstname + " " + this.current_user.lastname;
        this.projectsService.getAttestClientWorkers(this.project.id).then((res) => {
            this.client_workers = res;
        });
        this.getSpinner();
        this.getReloadWeeklyReportByNames();
        let data = {
            key: "Logo",
        };
        this.generalsService.getSingleGeneralByKey(data).subscribe((res) => {
            if (res['status']) {
                this.generalImage = res['data'][0]['value'];
            }
        });
        this.getWeeklyReport();
        this.getEmailLogs();
    }

    redirect() {
       /*  this.router.navigate([`/projects/view/${this.project.id}`]);
        setTimeout(()=>{
          this.toastr.error(
            this.translate.instant("You don't have permission to view") +
              ": " +
              this.translate.instant("Ata"),
            this.translate.instant("Error")
          );
        }, 5000); */
    }

    ngOnDestroy() {
        this.unSubSpinner();
        this.unSubGetReloadWeeklyReportByNames();
        this.unSubGetWeeklyReport();
    }

    unSubGetWeeklyReport() {
        if(this.getWeeklyReportSub) {
            this.weeklyReportInfoService.setWeeklyReport(null);
            this.getWeeklyReportSub.unsubscribe();
        }
    }

    unSubGetReloadWeeklyReportByNames() {
        if(this.getReloadWeeklyReportByNamesSub) {
            this.getReloadWeeklyReportByNamesSub.unsubscribe();
        }
    }

    unSubSpinner() {
        if (this.spinnerSub) {
            this.spinnerSub.unsubscribe();
        }
    }

    filterSupplierInvoiceNumber() {
        return this.supplierInvoices.filter((invoice) =>
            invoice.isChecked == false
        );
    }

    changeSelectedTab(index) {
        this.selectedTab = index;
        this.weeklyReportInfoService.setSelectedTab(index);
    }

    getLastAtaIndex() {
        return this.route.snapshot.data.atas.data.length - 1;
    }

    buttonNameToggle(event){
        if(event){
            this.setHeight.height = 'calc(100vh - 462px - 0px)'
        }else{
            this.setHeight.height = 'calc(100vh - 132px - 0px)'
        }
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

    closeAllPdfPrew(){
        if(this.showPdfPreview){
            this.showPdfPreview = !this.showPdfPreview;
        }
    }

    getWeeklyReport() {
        this.getWeeklyReportSub = this.weeklyReportInfoService.getWeeklyReport().subscribe((report)=>{
            if(report) {
                this.weekly_report = report;
                this.weekly_report.articles = [];
                this.weekly_report.articles['AdditionalWork'] = this.weekly_report.tables['aaw'];
                this.weekly_report.articles['Material'] = this.weekly_report.tables['am'];
                this.weekly_report.articles['Other'] = this.weekly_report.tables['ao'];
                this.get_last_email_log_but_first_client();
                this.getAllMoments(this.weekly_report.id);
            }
        });
    }

    get_last_email_log_but_first_client() {
        this.projectService
            .get_last_email_log_but_first_client(
                "weekly_report",
                this.weekly_report.id
            )
            .then((res) => {
                if (res["status"]) {
                    this.get_last_email_log_but_first_client_wr = res["data"];
                    this.weeklyReportInfoService.setLastEmailLogButFirstClient(this.get_last_email_log_but_first_client_wr);
                }
            });
    }

    getAllMoments(wr_id){
      if(!wr_id) return;

      this.projectsService
      .getAllMomentsForWeeklyReportWithoutManual(wr_id, this.project.id)
      .then((res) => {
        if (res["status"]) {
            this.additionalWorkMoments = res["data"];
        }
      });
    }

    sortArticlesMaterial(materialFromSelecedAta){
        materialFromSelecedAta.articlesMaterial.forEach((article) => {
            article.displayName = article.Name;
        });
    }


    filterArticles(articles) {
        return articles.filter((article) => article.Name !== "");
    }

    onConfirmationModal(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.autoFocus = false;
            dialogConfig.disableClose = true;
            dialogConfig.width = "185px";
            dialogConfig.panelClass = "confirm-modal";
            this.dialog.open(ConfirmModalComponent, dialogConfig).afterClosed()
                .subscribe((response) => {
                    if(response.result) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            );
        });
    }

    getReloadWeeklyReportByNames() {

        this.getReloadWeeklyReportByNamesSub = this.weeklyReportInfoService.getReloadWeeklyReportByNames().subscribe((status)=>{
            if(status) {
                this.getNotSendWeeklyReportsByAtaIdOnlyNames();
            }
        });
    }

    getSpinner() {
        this.spinnerSub = this.weeklyReportInfoService.getSpinner().subscribe((res)=>{
            this.spinner = res;
        });
    }

    getNotSendWeeklyReportsByAtaIdOnlyNames() {
        this.weeklyReportsService.getWeeklyReportNames(0, this.project.id, this.weeklyreport_id).then((result)=>{
            if(result.status && result.data.length > 0) {
                this.weekly_report_names = result.data;
            }
        });
    }

    generatePdf(event) {
        this.weeklyReportInfoService.setAllowUpdateWrAndPDF(event);
    }

    changeSelectedReportFromOverview(event) {

        let parent = 0;
        let wr_id = 0;
        let wr_name;
        let wr_status = 0;
        this.selectedTab = 0;
        const index = this.weekly_report_names.findIndex(
            (article) => { return article.week == event.week && article.year == event.year}
        );

        if(index > -1) {
            this.weekly_report_names[index].is_visible = 1;
            if(this.weekly_report_names[index].nameFromWr == event.name ) {
                wr_id = this.weekly_report_names[index].id;
                wr_name = this.weekly_report_names[index].nameFromWr;
                wr_status = this.weekly_report_names[index].status;
            }else {
                Object.entries(this.weekly_report_names[index].childrens).forEach(entry => {
                    const [key] = entry;
                    this.weekly_report_names[index].childrens[key].is_visible = 1;
                    if( this.weekly_report_names[index].childrens[key].nameFromWr ==  event.name) {
                        wr_id = this.weekly_report_names[index].childrens[key].id;
                        parent = this.weekly_report_names[index].id;
                        wr_name = this.weekly_report_names[index].childrens[key].nameFromWr;
                        wr_status = this.weekly_report_names[index].childrens[key].status;
                    }
                });
            }

            let object = {
                'active_notification': false,
                'data': [],
                'id': wr_id,
                'is_visible': 1,
                'nameFromWr': wr_name,
                'parent': parent,
                'status': wr_status
            }

            this.weeklyReportInfoService.setActiveDU(object);
        }
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


    getEmailLogs() {
        this.projectsService.getEmailLogsForWeeklyReport(this.project.id).then((res) => {
            if (res["status"]) {

                this.email_logs = {};
                try {
                  const emailLogsData = res["data"];
                  emailLogsData.forEach((item) => {
                    const logName = item.logName;

                    if (!this.email_logs[logName]) {
                      this.email_logs[logName] = [];
                    }

                    this.email_logs[logName].push({
                        Status: item.Status,
                        StatusName: item.StatusName,
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
                        files: item.sentFiles,//combinedArray,
                        pdfs: [],
                        images: [],
                        reminder: item.reminder,
                        sentFiles: item.sentFiles
                      });
                    });
                } catch (error) {
                  console.error('Greška prilikom dohvaćanja podataka:', error);
                }
            }
        });
    }

    filterWithoutEmptyRow(type) {

        let data = [];
        if(type == 'additional_work') {
            data = this.weekly_report.articles.AdditionalWork.filter((result) => {
                return (result.Quantity != '0' && result.Name.length > 0 && result.is_manual_added != '1') || (result.Quantity == '0' && result.Name.length == 0 && result.is_manual_added != '1')
            });
        }else if(type == 'material') {
            data = this.weekly_report.articles.Material.filter((result) => {
                return (result.Quantity != '0' && result.Name.length > 0) || (result.Quantity == '0' && result.Name.length == 0)
            });
        }else {
            data = this.weekly_report.articles.Other.filter((result) => {
                return (result.Quantity != '0' && result.Name.length > 0) || (result.Quantity == '0' && result.Name.length == 0)
            });
        }

        return data.length > 0 ? true : false;
    }
}
