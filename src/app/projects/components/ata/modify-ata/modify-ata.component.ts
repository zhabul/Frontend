
import { Component, OnInit, OnDestroy } from '@angular/core';
//import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AtaService } from 'src/app/core/services/ata.service';
import { ProjectsService } from 'src/app/core/services/projects.service';
import { AtaInfoService } from 'src/app/projects/components/ata/modify-ata/ata-info/ata-info.service';
//import * as printJS from "print-js";
//import { BASE_URL } from "src/app/config/index";
import * as printJS from "print-js";
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AppComponent } from 'src/app/app.component';
import { ConfirmModalComponent } from 'src/app/shared/modals/confirm-modal/confirm-modal.component';
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { AESEncryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';

@Component({
  selector: 'app-modify-ata',
  templateUrl: './modify-ata.component.html',
  styleUrls: ['./modify-ata.component.css']
})
export class ModifyAtaComponent implements OnInit, OnDestroy {
    public project;
    public selectedTab = 0;
    public ataId: any;
    public atas: any = [];
    public setHeight = {
        'height' : 'calc(100vh - 132px - 0px)'
    };
    public buttonToggleProject: any;
    public emitValueToggleProject:any;
    public dataForNavTab: any= []
    public spinner:boolean = false;
    public spinnerSub:any;
    public getSelectedTabSub;
    public selected_weekly_report_info:any;
    public selectedAtaSub;
    public atasSub;
    public selectedAta:any = {
        ATAID: -1,
        Status: -1,
        AtaNumber: -1,
        Name: '',
        PDFUrl: '',
        status
    };

    public logs: [];
    public logs1: Record<string, any[]> = {};
    public get_last_email_log_but_first_client = [];
    public showPdfPreview = false;
    public whichPdfPreview = "ata";
    public weekly_report :any= [];
    public getWeeklyReportSub;
    public selectedKsSub;
    public selectedKs ;
    public current_user: any = JSON.parse(sessionStorage.getItem("userDetails"));
    public current_user_full_name;
    public articlesAdditionalWork :any = [];
    public additionalWorkMoments = [];
    public articlesMaterial :any= [];
    public articlesOther :any= [];
    public get_last_email_log_but_first_client_wr = [];
    public generalImage;
    public ActiveComponentSub;
    public activeComponent:any = 'ata';
    public generals;
    public client_workers = [];
    public email_logs:any = [];
    public clientAttestHistory:any = [];
    public supplierInvoices: any[] = [];
    public visible:boolean = false;
    public type;
    public from;
    public project_id;
    public projectUserDetails;
    public userDetails;
    public adminRole;

    constructor(
        private route: ActivatedRoute,
        private ataInfoService:AtaInfoService,
        private ataService: AtaService,
        private projectsService: ProjectsService,
        private appComponent: AppComponent,
        private dialog: MatDialog,
        private toastr: ToastrService,
        private translate: TranslateService,
        private router: Router,
        private AESEncryptDecryptService: AESEncryptDecryptService
    ) {
        this.adminRole = this.AESEncryptDecryptService.sha256('Administrator');
    }

    ngOnInit(): void {

        this.projectUserDetails = this.route.snapshot.data["projectUserDetails"];
        this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

        this.getActiveComponents();
        this.project = this.route.snapshot.data["project"]["data"];

        this.route.queryParamMap.subscribe((params) => {
          this.type = params.get("type") || null;
          this.from = params.get("from") || null;
          this.project_id = params.get("projectId") || 0;
          this.checkAtaPermissionForRedirect();
        });

        this.ataId = this.route.params["value"]["id"];
        this.getSpinner();
        if(this.type == 'external') {
          this.atas = this.route.snapshot.data.atas["data"];
        }else {
          this.atas = this.route.snapshot.data.internalAtas["data"];
        }
        this.getSelectedTab();
        this.subToSelectedAta();
        this.getWeeklyReport();
        this.current_user_full_name = this.current_user.firstname + " " + this.current_user.lastname;
        this.email_logs = this.route.snapshot.data["email_logs"]["data"];

        this.generals = this.route.snapshot.data["generals"];

        this.generalImage = this.generals.Logo.value;
        this.projectsService.getAttestClientWorkers(this.project.id).then((res) => {
            this.client_workers = res;
        });
        this.projectsService.getClientAttestHistory(this.project.id, this.ataId).then((res) => {
            if (res["status"]) {
                this.clientAttestHistory = res["data"];
            }
        });
        this.getSupplierInoviceForAta();
        setTimeout( () => {
          this.visible = true;
        }, 1000 );


        this.EmailLogsForAta();

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

    EmailLogsForAta(){

      this.logs1 = {};
      try {
        const emailLogsData = this.email_logs;

        emailLogsData.forEach((item) => {
          const logName = item.logName;

          if (!this.logs1[logName]) {
            this.logs1[logName] = [];
          }

          this.logs1[logName].push({
              Status: item.Status,
              StatusName : item.StatusName,
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
    }

    checkAtaPermissionForRedirect() {

        if(this.userDetails.show_project_Ata || this.projectUserDetails) {

            const permissions = {
                ataExternal: Number(this.userDetails.show_project_Externalata),
                ataInternal: Number(this.userDetails.show_project_Internalata),
                ataExternal2: Number(this.projectUserDetails.Ata_External),
                ataInternal2: Number(this.projectUserDetails.Ata_Internal)
            }

            if(this.type == 'external') {
                if (!permissions.ataExternal && !permissions.ataExternal2) {
                    this.redirect();
                }
            }

            if(this.type == 'internal') {
                if (!permissions.ataInternal && !permissions.ataInternal2) {
                    this.redirect();
                }
            }
        }else {
          this.redirect();
        }
    }

    checkAtaPermission(type = 'read') {

        let status = false;
        if(type == 'read') {
            if(this.userDetails.show_project_Ata || this.projectUserDetails) {

                const permissions = {
                    ataExternal: Number(this.userDetails.show_project_Externalata),
                    ataInternal: Number(this.userDetails.show_project_Internalata),
                    ataExternal2: Number(this.projectUserDetails.Ata_External),
                    ataInternal2: Number(this.projectUserDetails.Ata_Internal)
                }

                if(this.type == 'external') {
                    if (permissions.ataExternal || permissions.ataExternal2) {
                        status = true;
                    }
                }

                if(this.type == 'internal') {
                    if (permissions.ataInternal || permissions.ataInternal2) {
                        status = true;
                    }
                }

            }
        }else {
            if(this.userDetails.create_project_Ata || this.projectUserDetails) {

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
                }

                if(this.type == 'internal') {
                    if ((permissions.ataInternal && this.userDetails.role_name ==  this.adminRole /*'Administrator'*/) || permissions.ataInternal2) {
                        status = true;
                    }
                }
            }
        }

        return status;
    }

    redirect() {

      this.router.navigate([`/projects/view/${this.project.id}`]);
      setTimeout(()=>{
        this.toastr.error(
          this.translate.instant("You don't have permission to view") +
            ": " +
            this.translate.instant("Ata"),
          this.translate.instant("Error")
        );
      }, 5000);
    }

    ngOnDestroy() {

        this.unSubSpinner();
        this.unSelectedTab();
        this.unsubFromSelectedAta();
        this.unSubGetWeeklyReport();
        this.unSubActiveComponent();
    }

    getSupplierInoviceForAta() {

        this.ataService
          .getSupplierInoviceForAta(
            this.project.id,
            this.atas[0].ATAID,
            this.atas[0].AtaNumber,
            this.atas[0].ATAID
          )
          .subscribe((res) => {
            this.supplierInvoices = res["invoices"];
            this.ataInfoService.setSupplierInvoices(res["invoices"]);
            this.ataInfoService.setNumberOfInvoices(this.filterSupplierInvoiceNumber().length);
        });
    }

    filterSupplierInvoiceNumber() {
        return this.supplierInvoices.filter((invoice) =>
            invoice.isChecked == false
        );
    }

    subToSelectedAta() {
      this.selectedAtaSub = this.ataInfoService.getSelectedAta().subscribe((selectedAta)=>{
        this.selectedAta = selectedAta;
        this.selectedAta.clientName = this.project.clientName;
        this.selectedAta.street = this.project.street;
        this.selectedAta.city = this.project.city;
        this.selectedAta.zip = this.project.zip;
        this.getEmailLogsForAta();
      });

    }

    unSubActiveComponent() {
        if (this.ActiveComponentSub) {
          this.ActiveComponentSub.unsubscribe();
        }
    }

    unSubGetWeeklyReport() {
        if(this.getWeeklyReportSub) {
            this.getWeeklyReportSub.unsubscribe();
        }

    }

    unsubFromSelectedAta() {
      if (this.selectedAtaSub) {
        this.selectedAtaSub.unsubscribe();
      }
    }

    changeSelectedTab(index) {
        this.selectedTab = index;
        if(this.selectedTab == 0) {
            this.ataInfoService.setReloadWeeklyReportByNames("unselcted_ata");
        }
        if(this.selectedTab == 2) {
          this.ataInfoService.setSpinner(false);
        }
        this.ataInfoService.setSelectedTab(index);
    }

    unSelectedTab() {
        if(this.getSelectedTabSub) {
            this.getSelectedTabSub.unsubscribe();
        }
    }

    unSubSpinner() {
        if (this.spinnerSub) {
            this.spinnerSub.unsubscribe();
        }
    }

    getLastAtaIndex() {
        return this.route.snapshot.data.atas.data.length - 1;
    }

  getSpinner() {
    this.spinnerSub = this.ataInfoService.getSpinner().subscribe((res)=>{
      this.spinner = res;
    });
  }


  buttonNameToggle(event){
    if(event){
        this.setHeight.height = 'calc(100vh - 462px - 0px)'
    }else{
        this.setHeight.height = 'calc(100vh - 132px - 0px)'
    }
  }


  changeSelectedReportFromOverview(event) {

        let object = {
          'id': event.info.id,
          'parent': event.info.parent,
          'wr_name': event.info.name,
          'from_overview': true
        };
        this.selectedTab = 0;
        if(object) {
            this.ataInfoService.setWeeklyReportId(object);
        }
  }

    getSelectedTab() {
        this.getSelectedTabSub = this.ataInfoService.getSelectedTab().subscribe((result) => {
            this.selectedTab = result;
        });
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

    getEmailLogsForAta() {

      this.ataService
        .getEmailLogsForAta(this.selectedAta.ATAID, this.project.id)
        .subscribe((res) => {
            if (res["status"]) {
                this.logs = res["data"];
                this.get_last_email_log_but_first_client = res["get_last_email_log_but_first_client"];
            }
            this.ataInfoService.setSpinner(false);
        });
  }

    getWeeklyReport() {
        this.getWeeklyReportSub = this.ataInfoService.getWeeklyReport().subscribe((result)=> {

            if(result) {
                this.weekly_report = result;
                this.weekly_report.clientName = this.project.clientName;
                this.weekly_report.street = this.project.street;
                this.weekly_report.city = this.project.city;
                this.weekly_report.zip = this.project.zip;
                const table = this.weekly_report?.tables;
                this.getAllMoments(this.weekly_report?.id)
                this.articlesAdditionalWork = {
                  value : table?.aaw,
                };
                this.articlesMaterial = {
                  value :table?.am,
                };
                this.articlesOther = {
                  value : table?.ao,
                };

                this.projectsService
                  .get_last_email_log_but_first_client(
                    "weekly_report",
                    this.weekly_report.id
                  )
                  .then((res) => {
                    if (res["status"]) {
                      this.get_last_email_log_but_first_client_wr = res["data"];
                      this.weekly_report.from_user = res["data"]["from_user"];
                    }
                });
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


    generatePdf(event) {

        this.spinner = true;
        let sent_by = this.current_user_full_name;
        if (this.get_last_email_log_but_first_client_wr["from_user"] !== "") {
            sent_by = this.get_last_email_log_but_first_client_wr["from_user"];
        }

        if(!this.weekly_report.pdf_url && event.type == 'AtaPDFWR' || event.type != 'AtaPDFWR') {
            this.projectsService.printPdf({
                reportId: this.weekly_report.id,
                sent_by: sent_by,
                projectId: this.project.id,
                pdf_type: event.type,
            }).then((response) => {
                if (response["status"]) {
                    if (event.from == "Save" || event.from == "savePdf") {
                        this.dowload_pdf(response["data"].pdfPath);
                        this.spinner = false;
                    } else {
                        printJS(response["data"].pdf_path_without_host);
                        this.spinner = false;
                    }
                }
            });
        }else {
            if (event.from == "Save") {
                this.dowload_pdf(this.weekly_report.pdf_url);
                this.spinner = false;
            } else {
                printJS(this.weekly_report.pdf_url);
                this.spinner = false;
            }
        }
    }

    dowload_pdf(pdfPath) {
      const name =
        this.project.CustomName +
        "-" +
        this.weekly_report.name +
        ".pdf";
      const link = document.createElement("a");
      link.href = pdfPath;
      link.setAttribute("download", name);
      document.body.appendChild(link);
      link.click();
    }

    filterArticles(articles) {
      return articles.filter((article) => article.Name !== "");
    }

    getActiveComponents() {
        this.activeComponent = 'ata';
        this.ActiveComponentSub = this.ataInfoService.getActiveComponents().subscribe((component)=>{
            this.activeComponent = component;

        });
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
          });
      });
    }

    canDeactivate(): Promise<boolean> | boolean {
      let theFormHasBeenChanged: boolean;
      this.ataInfoService.getIfHasChangesOnForm().subscribe((response) => {
        theFormHasBeenChanged = response;
      });
      if(theFormHasBeenChanged) {
        this.appComponent.loading = false;
        return this.onConfirmationModal();
      } else {
        return true;
      }
    }

}
