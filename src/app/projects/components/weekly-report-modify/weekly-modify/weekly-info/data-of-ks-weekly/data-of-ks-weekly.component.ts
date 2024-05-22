import { Component, EventEmitter, OnInit, Output, ViewChild, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import {  Subject, Subscription } from "rxjs";
import * as moment from 'moment';
import { SupplierInvoicesPreviewComponent } from '../supplier-invoices-preview/supplier-invoices-preview.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { WeeklyInfoNavComponent } from '../weekly-info-nav/weekly-info-nav.component';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationModalComponent } from 'src/app/shared/modals/confirmation-modal/confirmation-modal.component';
import { WeeklyReportsService } from "src/app/core/services/weekly-reports.service";
import { ActivatedRoute } from "@angular/router";
import { ImageModalUtility } from "src/app/projects/components/image-modal/image-modal-utility.service";
import { FileStorageService } from "src/app/core/services/file-storage.service";
import { ProjectsService } from "src/app/core/services/projects.service";
import { WeeklyReportInfoService } from 'src/app/projects/components/weekly-report-modify/weekly-report-info.service';
import { AtaService } from "src/app/core/services/ata.service";
import { ToastrService } from "ngx-toastr";
import * as printJS from "print-js";
import { PdfjsViewerComponent } from "src/app/utility/pdfjs-viewer/pdfjs-viewer.component";
declare const $;

@Component({
  selector: 'app-data-of-ks-weekly',
  templateUrl: './data-of-ks-weekly.component.html',
  styleUrls: ['./data-of-ks-weekly.component.css'],
  providers: [ImageModalUtility],
})

export class DataOfKsWeeklyComponent implements OnInit, OnDestroy {

    public toggle:any = {
        'aditionalWork' : true,
        'material': true,
        'ui':true,
        'doc':true,
        'datatime':true,
    };

    @Output() active_weekly_report_data = new EventEmitter();
    @ViewChild(PdfjsViewerComponent) pdfjsViewerComponent: PdfjsViewerComponent;
/* @Input("onCloseModal") close;
 */
    public pominalseMargin:any;
    public pominalse: boolean = false;
    public weekly_report:any = [];
    public ataKsSub;
    public createForm: FormGroup;
    public supplierInvoices: any[] = [];
    public fill = 'var(--orange-dark)';
    public rotate: 'rotate(0)';
    public day = this.translate.instant(moment().format(`dddd` ));
    public ata:any = [];
    public Date;
    //private weekTranslation="V.";
   // private weekTranslation2= sessionStorage.getItem('lang') == 'sw' ? 'Vecka' : 'Week';
    public currentDay=moment();
    public visible:boolean = false;
    public updateWeeklyReportSub;
    public deletedArticlesAditionalWork = [];
    public deletedArticlesMaterials = [];
    public deletedArticlesOther = [];
    infoObjectDU = {
        content_type: "DU",
        content_id: "",
        type: "Project",
        type_id: "",
    };
    albums: any[] = [];
    $_clearFiles: Subject<void> = new Subject<void>();
    swiper = {
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
    public language = "en";
    public statuss=4;
    public statusNamee="Test"
    public statusName:any;
    public statusNameBackground:any;
    public show : boolean = false;
    public selected_article;
    public getWeeklyReportSub;
    public getSupplierInvoicesSub;
    public fullName: any;
    public editAta: boolean = false;
    public counter = 0;
    public subscription: Subscription;
    public sendCopy: boolean = false;
    public klik=false
    public zatvorenoo=false;
    public articlesOtherProjectDeduct = 0;
    public articlesMaterialProjectDeduct = 0;
    public initalValues:any;
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
        SupplierInvoiceId: ''
    };
    public allowResetForm:boolean = false;
    public units:any = [];
    public enabledAccounts = [];
    public materialProperties = [];
    public active_weekly_report:number = 0;
    public max_weekly_report:number = 0;
    public max_children_weekly_report:number = 0;
    public active_children_weekly_report_index:number = 0;
    public active_children_weekly_report:any = null;
    public exist_visible_weekly_report:boolean = false;
    public userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    public project:any;
    public getReloadWeeklyReportByNamesSub;
    public selected_weekly_report:string = null;
    public active_tab:string = 'parent';
    public numberOfInvoices:number = 0;
    public weeklyreport_id:any = 0;
    public allowUpdateWrSubAndPDF;
    public getLastEmailLogButFirstClientSub;
    public get_last_email_log_but_first_client_wr;
    public getSelectedStatusSub;
    public getActiveDUSub;
    public isPDFViewer: boolean = false;
    public offDiv = false;
    pdfSortArray = [
        'other.pdf',
        'material.pdf',
        'work.pdf',
        'ata.pdf',
        'project.pdf',
    ];

   // private allowManualAcceptWeeklyReportSub;
  //  private allowManualDeclineWeeklyReportSub;
    @Input() weekly_report_names;
    @Input() selectedTab;

    constructor
        (
            private dialog: MatDialog,
            private translate: TranslateService,
            private toastr: ToastrService,
            private weeklyReportService: WeeklyReportsService,
            private fb: FormBuilder,
            private route: ActivatedRoute,
            private imageModalUtility: ImageModalUtility,
            private fsService: FileStorageService,
            private projectService: ProjectsService,
            private weeklyReportInfoService: WeeklyReportInfoService,
            private ataService: AtaService,
        )
    {}

    @Output() status = new EventEmitter <any>();

    ngOnInit(): void {
        this.language = sessionStorage.getItem("lang");
        this.weeklyReportInfoService.setSpinner(true);
        this.route.queryParamMap.subscribe((params) => {
            this.weeklyreport_id = params.get("weeklyreport_id") || 0;
        });
        this.units = this.route.snapshot.data["units"];
        this.enabledAccounts = this.route.snapshot.data["enabledAccounts"];
        this.materialProperties = this.route.snapshot.data["materialProperties"];
        this.project =  this.route.snapshot.data["project"];
        this.articlesMaterialProjectDeduct = this.project["chargeMaterial"];
        this.articlesOtherProjectDeduct = this.project["chargeUE"];

        this.status.emit(this.statuss);
        if(this.statuss == 2) {
            this.pominalseMargin = document.getElementsByClassName('pominalse')[0].clientWidth;
        }
        this.language = sessionStorage.getItem("lang");
        //if(this.weekly_report_names.length > 0) {

        //  this.getWeeklyReportByWrId(this.weekly_report_names[this.weekly_report_names.length - 1].id);
        //}
        this.getAllowUpdateWeeklyReport();
        this.getReloadWeeklyReportByNames();
        this.initWeeklyReport();
        this.infoObjectDU.type_id = this.project.id;
        this.getSupplierInvoices();
        this.getAllowUpdateWr();
        this.getLastEmailLogButFirstClient();
        this.getSelectedStatus();
        this.getActiveDUSeted();
        document.addEventListener("keydown", this.getSelected.bind(this));
        this.getWeeklyReport();
    }

    ngAfterViewInit() {
        setTimeout( () => { this.initDueDate() }, 2000 );
    }

    ngOnDestroy() {
        this.unSubUpdateWeeklyReport();
        this.unSubGetWeeklyReport();
        this.unSubGetReloadWeeklyReportByNames();
        this.unSubAllowUpdateWrSubAndPDF();
        this.UnSubGetLastEmailLogButFirstClient();
        this.unSubGetSelectedStatus();
        this.unSUbGetActiveDU();
    }

    getSelected(event) {

        if(event.srcElement.localName == 'textarea') {
            return;
        }

        if(event.target['dataset'] && event.target['dataset'].selected_article) {
           this.selected_article = event.target['dataset'].selected_article;
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

            event.preventDefault();

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

    @ViewChild(WeeklyInfoNavComponent)
    child!: WeeklyInfoNavComponent;
    numberOfStatus = this.statuss;

    unSUbGetActiveDU() {
        if(this.getActiveDUSub) {
            this.weeklyReportInfoService.setActiveDU(null);
            this.getActiveDUSub.unsubscribe();
        }
    }

    unSubGetSelectedStatus() {
        if(this.getSelectedStatusSub) {
            this.weeklyReportInfoService.setSelectedStatus(null);
            this.getSelectedStatusSub.unsubscribe();
        }
    }

    UnSubGetLastEmailLogButFirstClient() {
        if(this.getLastEmailLogButFirstClientSub) {
            this.weeklyReportInfoService.setLastEmailLogButFirstClient(null);
            this.getLastEmailLogButFirstClientSub.unsubscribe();
        }
    }

    unSubGetReloadWeeklyReportByNames() {
        if(this.getReloadWeeklyReportByNamesSub) {
            this.weeklyReportInfoService.setReloadWeeklyReportByNames(null);
            this.getReloadWeeklyReportByNamesSub.unsubscribe();
        }
    }

    unSubAllowUpdateWrSubAndPDF() {
        if(this.allowUpdateWrSubAndPDF) {
            this.weeklyReportInfoService.setAllowUpdateWrAndPDF(null);
            this.allowUpdateWrSubAndPDF.unsubscribe();
        }
    }

    unSubGetWeeklyReport() {
        if(this.getWeeklyReportSub) {
            this.weeklyReportInfoService.setWeeklyReport(null);
            this.getWeeklyReportSub.unsubscribe();
        }
    }

    unSubUpdateWeeklyReport() {
        if (this.updateWeeklyReportSub) {
            this.weeklyReportInfoService.setAllowUpdateWeeklyReport(null);
            this.updateWeeklyReportSub.unsubscribe();
        }
    }

    async generateForm() {

        this.createForm = this.fb.group({
            id: [this.weekly_report.id, []],
            Name: ['', []],
            Status: [this.weekly_report.Status, [Validators.required]],
            articlesAdditionalWork: this.fb.array([]),
            articlesMaterial: this.fb.array([]),
            articlesOther: this.fb.array([]),
            weeklyReportDueDate: [this.weekly_report.WeeklyReportDueDate, []],
        });
        this.allowResetForm = true;
    }

    disable_buttons() {

        this.createForm && this.createForm.get('articlesAdditionalWork') ? this.createForm.get('articlesAdditionalWork').disable() : null;
        this.createForm && this.createForm.get('articlesMaterial') ? this.createForm.get('articlesMaterial').disable() : null;
        this.createForm && this.createForm.get('articlesOther') ? this.createForm.get('articlesOther').disable() : null;
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

    trimWeek(date: string) {
        return date.split(" ")[0];
    }

    onFocus(){
        this.show = true;
    }

    onBlur(){
        this.show = false
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

    if (status == 2 || status == 4) {
      object.name = "Accepted";
      object.background = "#02B94C";
    }

    if (status == 3) {
      object.name = "Declined";
      object.background = "#FF5454";
    }

    return object;
  }


    toggleMenu(type){
        if(type == 'aditionalWork'){
            this.toggle["aditionalWork"]=!this.toggle["aditionalWork"]
        }else if(type == 'material'){
            this.toggle["material"]=!this.toggle["material"]
        }else if(type == 'ui'){
            this.toggle["ui"]=!this.toggle["ui"]
        }else if(type == 'datatime'){
            this.toggle["datatime"]=!this.toggle["datatime"]
        }else if(type == 'doc'){
            this.toggle["doc"]=!this.toggle["doc"]
        }
    }

    pominalseCheck(){

        this.pominalse = !this.pominalse;
        this.weeklyReportInfoService.setReminder(true);
        if(this.pominalse) {
            $('#weekkly_report_due_date').removeAttr("disabled");
        }else {
            $('#weekkly_report_due_date').attr("disabled");
        }
    }

    getAlbumFilesSupplier(albumKey, type) {
        const activeDU = this.weekly_report;
        const files = activeDU["articles"]['Material'];

        return files.sort((a, b) => {
            return this.pdfSortArray.indexOf(b.Name.substring(b.Name.lastIndexOf('-')+1)) - this.pdfSortArray.indexOf(a.Name.substring(a.Name.lastIndexOf('-')+1));
        });
    }

    getAlbumFilesKS(albumKey, type) {
        const activeDU = this.weekly_report;


        if(!activeDU["files"][albumKey]) {
            this.getAlbumFilesSupplier(albumKey, type);
            return;
        }
        const files = activeDU["files"][albumKey][type];
        return files.sort((a, b) => {
            return this.pdfSortArray.indexOf(b.name.substring(b.name.lastIndexOf('-')+1)) - this.pdfSortArray.indexOf(a.name.substring(a.name.lastIndexOf('-')+1));
        });
    }

    toggleAttachment(albumKey, index, type) {
      if (!this.weekly_report.removed_documents) {
        this.weekly_report.removed_documents = [];
      }

      const files =
        this.weekly_report["files"][albumKey][type];
      const file = files[index];
      const id = file.id;

      if (file.deleted) {
        this.weekly_report.removed_documents =
          this.weekly_report.removed_documents.filter(
            (_file) => {
              return id != _file.id;
            }
          );
      } else {
        this.weekly_report.removed_documents.push(file);
      }

      file.deleted = !file.deleted;
    }

    updateAlbumsAta(event) {
        this.albums = event;
        this.createForm.markAsDirty();
    }

    getAlbumKeys() {
        let keys = [];
        const activeDU = this.weekly_report;

        if (activeDU) {
            const files = activeDU["files"];
            keys = Object.keys(files).sort(function (a, b) {
                return Number(b) - Number(a);
            });
        }
        return keys;
    }

    getAlbumDescription(albumKey) {
        const activeDU =  this.weekly_report;
        let description = "";
        if (activeDU) {
            description = activeDU["files"][albumKey]["description"];
        }
        return description;
    }

    openSwiper(index, files, album) {

        if (files[index].document_type === "Image") {
            let name = this.getExtension(files[index]['name']);
            if(!name || name == undefined) {
                files[index]['name'] = files[index]['name'] + '.jpeg';
            }
            this.isPDFViewer = false;
            this.swiper = {
                active: index,
                images: files,
                album: album,
                index: -1,
                parent: null,
            };
        } else {

            let name = this.getExtension(files[index]['name']);
            if(!name || name == undefined) {
                files[index]['name'] = files[index]['name'] + '.pdf';
            }
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

    getExtension(path) {
        let baseName = path.split(/[\\/]/).pop(),
          pos = baseName.lastIndexOf(".");
        if (baseName === "" || pos < 1)
          return "";
        return baseName.slice(pos + 1);
      }

    closeSwiper() {
        this.swiper = {
            active: -1,
            images: [],
            album: -2,
            index: -1,
            parent: null,
        };
        this.offDiv = false;
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

    setAccount(data, index, type) {

        if(type == 'articlesAdditionalWork') {
            this.articlesAdditionalWork.controls[index].get("Account").patchValue(data);
        }
    }

    openModal() {

        this.klik=true;
        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = true;
        diaolgConfig.disableClose = true;
        diaolgConfig.data = { data: this.supplierInvoices };
        diaolgConfig.panelClass = "supp-inv-preview";
        const dialogRef = this.dialog.open(SupplierInvoicesPreviewComponent, diaolgConfig);

        dialogRef.afterClosed().subscribe(async (supplier_invoices)=>{
            this.numberOfInvoices = 0;
            let add_empty_row = false;

            supplier_invoices.forEach((invoice) => {
                if(invoice.isChecked) {
                    this.createForm.markAsDirty();
                    add_empty_row = true;
                    const i = this.articlesMaterial.controls.findIndex(
                        (invo) => {

                            return (
                                Number(invoice.sirID) == Number(invo.get("SupplierInvoiceId").value)
                                &&
                                Number(invoice.Price) == Number(invo.get("Price").value)
                            )
                        }
                    );

                    if(i > -1) {
                        this.articlesMaterial.controls.splice(i, 1);
                        this.articlesMaterial.value.splice(i, 1);
                    }

                    let index_of_existed_data = this.articlesMaterial.value.findIndex(
                        (article) => {
                            return (article.Name.length > 0)
                        }
                    );

                    if(index_of_existed_data < 0) {
                        this.articlesMaterial.controls.forEach((article, index_) => {
                            this.articlesMaterial.controls.splice(index_, 1);
                            this.articlesMaterial.controls.splice(index_, 1);
                        });
                    }

                    this.articlesMaterial.push(
                        this.fb.group({
                          id: -1,
                          Name: invoice.SupplierName,
                          Quantity: 1,
                          Unit: 'pieces',
                          Price: invoice.Type == "SupplierInvoiceRow" ? invoice.Price : invoice.Total,
                          Deduct: invoice.Type == "SupplierInvoiceRow" ? invoice.Deduct : this.articlesMaterialProjectDeduct,
                          Total: invoice.Type == "SupplierInvoiceRow" ? invoice.Total : invoice.Total * (this.articlesMaterialProjectDeduct / 100 + 1),
                          Account: invoice.Account,
                          Date: invoice.InvoiceDate,
                          ClientComment: '',
                          ClientStatus: null,
                          Type: invoice.Type,
                          SupplierInvoiceId: invoice.id,
                          status: null,
                          wrStatus: this.weekly_report.id,
                          additionalWorkStatus: null,
                          pdf_doc: invoice.pdf_link,
                          pdf_images: invoice.image_path,
                          TableType: invoice.Type,
                        })
                    );
                }else {

                    const i = this.articlesMaterial.controls.findIndex(
                        (invo) => {

                            return (
                                Number(invoice.sirID) == Number(invo.get("SupplierInvoiceId").value)
                                &&
                                Number(invoice.Price) == Number(invo.get("Price").value)
                            )
                        }
                    );

                    if(i > -1) {
                        this.articlesMaterial.controls.splice(i, 1);
                        this.articlesMaterial.value.splice(i, 1);
                    }
                    this.numberOfInvoices += 1;
                }
            });

            if(this.articlesMaterial.value[this.articlesMaterial.value.length - 1].Name == '' && this.articlesMaterial.value[this.articlesMaterial.value.length - 1].Name == '') {
                add_empty_row = false;
            }

            if(add_empty_row) {
                this.articlesMaterial.push(
                    this.fb.group(this.addEmptyArticle("articlesMaterial"))
                );
            }
            this.weeklyReportInfoService.setNumberOfInvoice(this.numberOfInvoices);
            this.klik=false;
        });
    }

    deleteWeeklyReport(){
      /*     status.checked = !status.checked;
       */    const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = false;
        diaolgConfig.disableClose = true;
        diaolgConfig.width = "";
        diaolgConfig.panelClass = "mat-dialog-confirmation";
        diaolgConfig.data = {
        questionText: this.translate.instant("Are you sure you want to delete DU?")};

        this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().subscribe((response)=>{
            if (response.result) {

                const id = this.weekly_report.id;
                const project_id = this.project.id;
                this.projectService.deleteWeeklyReport(id, project_id).then((res) => {
                    if (res["status"]) {
                        window.location.reload();
                    }
                });
            }
        });

    }

    initDueDate() {

        if(this.weekly_report.Status != 0) {
            $("#weekkly_report_due_date").attr("disabled","disabled");
        }else {
            $('#weekkly_report_due_date').removeAttr("disabled");
        }

        $("#weekkly_report_due_date")
            .datepicker({
              format: "yyyy-mm-dd",
              weekStart: 1,
              calendarWeeks: true,
              autoclose: true,
              language: this.language,
              currentWeek: true,
              todayHighlight: true,
              currentWeekTransl: this.language === "en" ? "Week" : "Vecka",
              currentWeekSplitChar: "-",
            })

            .on("changeDate", (ev) => {

                this.weekly_report.WeeklyReportDueDate = ev.target.value;
                this.createForm?.get("weeklyReportDueDate")?.patchValue(ev.target.value);
            }).on("blur", (ev) => {

                this.weekly_report.WeeklyReportDueDate = ev.target.value;
                this.createForm?.get("weeklyReportDueDate")?.patchValue(ev.target.value);
            }).on("hide", (ev) => {

                this.weekly_report.WeeklyReportDueDate = ev.target.value;
                this.createForm?.get("weeklyReportDueDate")?.patchValue(ev.target.value);
            });
        this.allowEditWeeklyReport();
    }

    deletedArticle(object) {
        let status = true;
        if(object && object.value == true) {
            status = false;
        }
        return status;
    }

    async getWeeklyReportByName(wr_data) {

        this.exist_visible_weekly_report = false;
        this.weeklyReportInfoService.setSpinner(true);
        if(!this.weekly_report_names) {
            this.weeklyReportService.getWeeklyReportNames(0, this.project.id, wr_data.id).then((result)=>{
                if(result.status && result.data.length > 0) {
                    this.weekly_report_names = result.data;
                    this.refreshTabs(wr_data);
                }
            });
        }else {
            if(wr_data && wr_data.parent == 0) {
                setTimeout(() => {
                    this.refreshTabs(wr_data);
                }, 1);
            }else {
                this.refreshTabs(wr_data);
            }
        }
    }

    refreshTabs(wr_data) {

        if(!wr_data) {
            return;
        }

        if(Number(wr_data.parent) > 0) {
            this.exist_visible_weekly_report = true;
            const parent_index = this.weekly_report_names.findIndex(
                (article) => { return article.id == wr_data.parent}
            );
            this.active_weekly_report = parent_index;
            let children_weekly_reports = Object.values(this.weekly_report_names[parent_index].childrens);
            const children_index = children_weekly_reports.findIndex(
                (article:any) => { return article.id == wr_data.id}
            );
            if(children_index > -1) {
                this.active_children_weekly_report_index = children_index;
                this.active_children_weekly_report = wr_data.nameFromWr;
            }

        }else {
            const parent_index = this.weekly_report_names.findIndex(
                (article) => { return article.id == wr_data.id}
            );
            this.active_weekly_report = parent_index;
            if(wr_data.childrens) {
                let children_weekly_reports:any[] = Object.values(this.weekly_report_names[parent_index].childrens);
                if(children_weekly_reports.length > 0) {
                    this.active_children_weekly_report_index = children_weekly_reports.length - 1;
                    this.active_children_weekly_report = children_weekly_reports[this.active_children_weekly_report_index].nameFromWr;
                    this.exist_visible_weekly_report = true;
                }else {
                    this.active_children_weekly_report_index = -1;
                    this.active_children_weekly_report = null;
                }
            }
        }
        this.getWeeklyReportByWrId(wr_data.id, true);
    }

    getLastEmailLogButFirstClient() {
        this.getLastEmailLogButFirstClientSub = this.weeklyReportInfoService.getLastEmailLogButFirstClient().subscribe(async(response)=>{
            if(response) {
                this.get_last_email_log_but_first_client_wr = response;
            }
        });
    }

    getSelectedStatus() {
        this.getSelectedStatusSub = this.weeklyReportInfoService.getSelectedStatus().subscribe(async(response)=>{

            if(response) {
                await this.updateWeeklyReport('approve_or_decline');

                if(response == 'Accepted') {
                    this.approveWeeklyReport();
                }

                if(response == 'Decline') {
                    this.declineWeeklyReport();
                }

            }
        });
    }

    approveWeeklyReport() {

        this.projectService.approveWeeklyReportAsAdmin(this.weekly_report.id).then((response) => {
            if (response["status"]) {
                this.weeklyReportInfoService.setSpinner(false);
                this.toastr.success(
                    this.translate.instant(
                        "You successfully accepted Weekly Report."
                    ),
                    this.translate.instant("Success")
                );
                this.getNotSendWeeklyReportsByAtaIdOnlyNames();
                this.getWeeklyReportByWrId(this.weekly_report.id);
            } else {
                this.weeklyReportInfoService.setSpinner(false);
                this.toastr.warning(
                    this.translate.instant("Not able to accept Weekly Report."),
                    this.translate.instant("Error")
                );
            }
        });
    }

    declineWeeklyReport() {
        this.projectService.declineWeeklyReportAsAdmin(this.weekly_report.id).then((response) => {
            if (response["status"]) {
                this.weeklyReportInfoService.setSpinner(false);
                this.toastr.success(
                    this.translate.instant(
                        "You successfully declined Weekly Report."
                    ),
                    this.translate.instant("Success")
                );
                this.getNotSendWeeklyReportsByAtaIdOnlyNames();
                this.getWeeklyReportByWrId(this.weekly_report.id);
            } else {
                this.weeklyReportInfoService.setSpinner(false);
                this.toastr.warning(
                    this.translate.instant(
                        "Not able to decline Weekly Report."
                    ),
                    this.translate.instant("Error")
                );
            }
        });
    }

    getAllowUpdateWr() {
        this.allowUpdateWrSubAndPDF = this.weeklyReportInfoService.getAllowUpdateWrAndPDF().subscribe(async(response)=>{

            if(response) {

                let update_pdf = false;

                if(response.type == 'ProjectPDFWR') {
                    update_pdf = true;
                }

                await this.updateWeeklyReport(update_pdf);
                let sent_by = this.userDetails.firstname + " " + this.userDetails.lastname;
                if (this.get_last_email_log_but_first_client_wr["from_user"] !== "") {
                    sent_by = this.get_last_email_log_but_first_client_wr["from_user"];
                }

                if(response.type == 'ProjectPDFWR') {
                    if (response.from == "savePdf" || response.from == "Save") {
                        this.dowload_pdf(this.weekly_report.pdf_url);
                    } else {
                        printJS(this.weekly_report.pdf_url);
                    }
                    this.weeklyReportInfoService.setSpinner(false);
                }else {
                    this.projectService .printPdf({
                        reportId: this.weekly_report.id,
                        sent_by: sent_by,
                        projectId: this.project.id,
                        pdf_type: response.type,
                    }).then((response2) => {
                        if (response2["status"]) {
                            if (response.from == "savePdf" || response.from == "Save") {
                                this.dowload_pdf(response2["data"].pdfPath);
                                this.weeklyReportInfoService.setSpinner(false);
                            } else {
                                printJS(response2["data"].pdf_path_without_host);
                                this.weeklyReportInfoService.setSpinner(false);
                            }
                        }
                    });
                }
            }
        });
    }

    dowload_pdf(pdfPath) {
        const name =
            this.project.CustomName + "-" + this.weekly_report.name + ".pdf";
        const link = document.createElement("a");
        link.href = pdfPath;
        link.setAttribute("download", name);
        document.body.appendChild(link);
        link.click();
    }

    async getWeeklyReportByWrId(wr_id, spinner = false, active_tab = null) {
        this.weeklyReportService.getWeeklyReportByWrId(wr_id, 'DU').then(async(res)=>{
            if(res) {
                this.weekly_report = res;
                this.generateForm();
                this.getAllDUArticles();
                this.active_weekly_report_data.emit(this.weekly_report);

                if(this.weekly_report.parent == 0) {
                    this.selected_weekly_report = this.weekly_report.nameFromWr;
                    if(!active_tab) {
                        active_tab = 'parent';
                    }

                }else {
                    this.active_children_weekly_report = this.weekly_report.nameFromWr;
                    let splitted_name = this.active_children_weekly_report.split("-");
                    this.selected_weekly_report = splitted_name[0] + "-" + splitted_name[1];
                    if(!active_tab) {
                        active_tab = 'children';
                    }
                }
                this.weeklyReportInfoService.setWeeklyReport(this.weekly_report);

                this.setActiveTab(active_tab);
                if(spinner) {
                    this.weeklyReportInfoService.setSpinner(false);
                }
            }
        });
    }

    getAllowUpdateWeeklyReport() {
        this.updateWeeklyReportSub = this.weeklyReportInfoService.getAllowUpdateWeeklyReport().subscribe((status)=>{
            if(status) {
                this.updateWeeklyReport(status);
            }
        });
    }

    async updateWeeklyReportStatusAndDueDate(data) {
        let pom = {
            'due_date': this.weekly_report.WeeklyReportDueDate,
            'status': data.Status,
            'reminder': this.pominalse,
            'id': data.id
        }
        this.weeklyReportService.updateWeeklyReportStatusAndDueDate(pom);
    }

    async ensureRemoveLastEmptyRow(articles) {

        let index = articles.length -1;
        if(index > 0 && articles[index].Name == '') {
            articles.splice(index, 1);
            this.ensureRemoveLastEmptyRow(articles);
        }else {
            return true;
        }
    }

    async updateWeeklyReport(next_action = null) {

        const data = this.createForm.getRawValue(); // useing disabled value
        const articles = [];
        const wrID = data['id'];
        const array_of_article_types = [
            'articlesAdditionalWork',
            'articlesMaterial',
            'articlesOther',
        ];

        await this.ensureRemoveLastEmptyRow(data['articlesAdditionalWork']);
        await this.ensureRemoveLastEmptyRow(data['articlesMaterial']);
        await this.ensureRemoveLastEmptyRow(data['articlesOther']);

        this.weeklyReportInfoService.setSpinner(true);
        array_of_article_types.forEach((key) => {

            data[key].forEach((article) => {
                //if (article.Name != "") {
                    let type_ = '';
                    if(key == 'articlesAdditionalWork') {
                        type_ = 'AdditionalWork';
                    }else if(key == 'articlesMaterial') {
                        type_ = 'Material';
                    }else {
                        type_ = 'Other';
                    }
                    articles.push({
                        id: article.id == '' ? -1 : article.id,
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
                        deleted: article.deleted,
                        type: type_,
                        wrID: wrID,
                        GivenNumber: article.GivenNumber,
                        importedFromFortnox: article.hasOwnProperty(
                            "importedFromFortnox"
                        ),
                        TableType: article.TableType,
                        SupplierInvoiceId: article.SupplierInvoiceId,
                        wrStatus: article.wrStatus,
                        is_manual_added: article.is_manual_added,
                        rnd_string: null
                    });
               // }
            });
        });

        let files = this.weekly_report.files;
        let removed_documents = this.weekly_report.removed_documents;
        const content_id = this.weekly_report.id;
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
            articles: articles,
            reportId: wrID,
            WeeklyReportDueDate: data.weeklyReportDueDate,
            projectId: this.route.snapshot.params.id,
            timesReminderSentDU: this.pominalse,
            sendReminderDU: this.pominalse,
            images: images,
            pdf_documents: pdf_documents,
            removed_documents: removed_documents,
            sendCopy: false,
            update_pdf: true
        };

        await this.projectService.updateWeeklyReport(object).then(async (result) => {
            this.getSupplierInvoices();
            this.$_clearFiles.next();
            if((next_action && next_action != 'next_actionapprove_or_decline') || this.weekly_report.pdf_url == '' || !this.weekly_report.pdf_url){
                await this.ataService.updateWeeklyReportPdf(
                    this.weekly_report.id,
                    null,
                    this.sendCopy
                ).then(async(res:any) => {
                    if(res.status) {
                        this.weekly_report.pdf_url = res['pdf'].pdf_path;
                        if(next_action == 'send') {
                            this.weeklyReportInfoService.setAllowSendOrPrintWeeklyReport('send');
                        }

                        if(next_action == 'print') {
                            this.weeklyReportInfoService.setPdfUrl(res['pdf'].pdf_path);
                            setTimeout( () => { this.weeklyReportInfoService.setAllowSendOrPrintWeeklyReport('print')}, 1000 );
                        }
                    }
                });
            }
        });

        if(!next_action) {
            await this.getWeeklyReportByWrId(wrID);
            this.weeklyReportInfoService.setSpinner(false);
        }
    }

    delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    getAllDUArticles() {

        if(!this.weekly_report_names) {
            this.weeklyReportInfoService.setSpinner(false);
            return;
        }

        const report = this.weekly_report;
        this.clearFormArray(this.articlesAdditionalWork);
        this.clearFormArray(this.articlesMaterial);
        this.clearFormArray(this.articlesOther);

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
              TableType: article.TableType,
              SupplierInvoiceId: article.SupplierInvoiceId,
              deleted: article.deleted
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
              TableType: article.TableType,
              deleted: article.deleted
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
              TableType: article.TableType,
              SupplierInvoiceId: article.SupplierInvoiceId,
              deleted: article.deleted
            })
          );
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

        this.initalValues = this.createForm.value;

        if(report.status != 0) {
            this.disable_buttons();
        }

        this.visible = true;
        this.weeklyReportInfoService.setSpinner(false);
        setTimeout( () => { this.initDueDate() }, 2000 );
    }

    addRow(formGroup, table, index = -1) {


        let status = false;

        if(formGroup.value.length -1 == index) {
            status = true;
        }

    //    const i = formGroup.controls.findIndex(
    //        (article) => { return article.value.Name == ""}
    //    );

        if(/*i == -1*/ status) {
            formGroup.push(this.fb.group(this.addEmptyArticle(table)));
        }
    }

    clearFormArray(formArray: FormArray) {
        while (formArray.length !== 0) {
            formArray.removeAt(0);
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

        const Deduct = this.round_number(Number(
          formGroup.controls[i].value.Deduct.toString()
            .replace(/\s/g, "")
            .replace(",", ".")
        ), 2);

        total = (
          Quantity *
          Price *
          (Deduct / 100 + 1)
        ).toFixed(2);

        (<FormGroup>formGroup.controls[i]).controls["Deduct"].patchValue(Deduct);
        (<FormGroup>formGroup.controls[i]).controls["Total"].patchValue(total);

        return total;
    }

    updateArticleManualFIeld(i, formGroup) {
        (<FormGroup>formGroup.controls[i]).controls["is_manual_added"].patchValue(true);
    }

    calcAllTotal(data) {

        let total = 0;
        data.forEach((data2) => {
          data2.value.forEach(data3 => {
            if (data3 && data3.Total) {
               let amount = data3.Total != "" ? data3.Total : 0;
               total += parseFloat(amount);
            }
          });
        });
        return total.toFixed(2);
    }

    initWeeklyReport(selected_weekly_report = false) {

        this.exist_visible_weekly_report = false;
        if( this.weekly_report_names && this.weekly_report_names.length > 0) {

            this.weekly_report_names.forEach((element, index) => {
                if(element.is_visible == 1) {
                    this.exist_visible_weekly_report = true;
                    if(this.weeklyreport_id > 0) {
                        this.active_weekly_report = this.weekly_report_names.findIndex((x:any) => x.active_notification == true);
                    }else {
                        if(!selected_weekly_report) {
                            this.active_weekly_report = index;
                            this.max_weekly_report = this.weekly_report_names.length - 1;
                        }else {
                            this.max_weekly_report = this.weekly_report_names.length - 1;
                        }
                    }
                }

            });


            if(this.exist_visible_weekly_report) {

                let children_wr = Object.values(this.weekly_report_names[this.active_weekly_report].childrens);
                this.max_children_weekly_report = children_wr.length - 1;

                if(this.weeklyreport_id > 0) {
                    let index = this.weekly_report_names.findIndex((x:any) => x.id == this.weeklyreport_id);
                    if(children_wr && children_wr.length > 0) {
                        this.active_children_weekly_report_index = children_wr.findIndex((x:any) => x.id == this.weeklyreport_id);
                        if(this.active_children_weekly_report_index < 0) {
                            this.active_children_weekly_report_index = this.max_children_weekly_report;
                        }
                        this.active_children_weekly_report = Object.keys(this.weekly_report_names[this.active_weekly_report].childrens)[this.active_children_weekly_report_index];

                        if(index > -1) {
                            this.getWeeklyReportByName(this.weekly_report_names[this.active_weekly_report]);
                        }else {
                            this.getWeeklyReportByName(this.weekly_report_names[this.active_weekly_report].childrens[this.active_children_weekly_report]);
                        }
                    }
                }else {
                    if(children_wr.length > 0) {
                        if(children_wr.length > 0) {
                                this.active_children_weekly_report_index = this.max_children_weekly_report;
                                this.active_children_weekly_report = Object.keys(this.weekly_report_names[this.active_weekly_report].childrens)[this.max_children_weekly_report];
                        }
                        this.getWeeklyReportByWrId(this.weekly_report_names[this.active_weekly_report].childrens[this.active_children_weekly_report].id);
                    }else {
                        this.getWeeklyReportByWrId(this.weekly_report_names[this.active_weekly_report].id);
                    }
                }
            }
        }
    }

    getActiveDU() {
        const report =
            this.active_children_weekly_report != -1 &&
                this.weekly_report_names[this.active_weekly_report]
                ? this.weekly_report_names[this.active_weekly_report].childrens[
                this.active_children_weekly_report
                ]
                : this.weekly_report_names[this.active_weekly_report];

        return report;
    }

    getWeeklyReport() {

        this.getWeeklyReportSub = this.weeklyReportInfoService.getWeeklyReport().subscribe(async(report)=>{

            if(report) {
                this.weekly_report = report;
                this.getAllDUArticles();
                if(this.weekly_report.Status != 0 && this.weekly_report.Status != 1) {
                    this.sendCopy = true;
                }
            }else {
                this.weeklyReportInfoService.setSpinner(false);
            }
        });
    }

    getReloadWeeklyReportByNames() {

        this.getReloadWeeklyReportByNamesSub = this.weeklyReportInfoService.getReloadWeeklyReportByNames().subscribe((status)=>{

            if(status) {
                this.getNotSendWeeklyReportsByAtaIdOnlyNames();
            }
        });
    }

    getActiveDUSeted() {

        this.getActiveDUSub = this.weeklyReportInfoService.getActiveDU().subscribe((data)=>{
            if(data) {
                this.getWeeklyReportByName(data);
            }
        });
    }

    async getNotSendWeeklyReportsByAtaIdOnlyNames() {
        this.weeklyReportService.getWeeklyReportNames(0, this.project.id, this.weeklyreport_id).then((result)=>{
            if(result.status && result.data.length > 0) {
                this.weekly_report_names = result.data;
                if(this.weekly_report_names.length > 0) {
                    this.initWeeklyReport();
                }
            }
        });
    }

    setActiveTab(type) {
        this.weeklyReportInfoService.setActiveTab(type);
    }

    private getSupplierInvoices() {
        this.projectService
            .getSupplierInvoiceForDU(this.project.id)
            .then((res) => {
                this.supplierInvoices = res["invoices"];
                this.numberOfInvoices = this.supplierInvoices.length;
                this.weeklyReportInfoService.setNumberOfInvoice(this.numberOfInvoices);
            });
    }

    removeRow(index, formGroup, type) {

        if (
          formGroup.controls[index].value.Name == "" &&
          formGroup.value.filter((article) => article.Name == "").length == 1
        ) {
          return;
        }
        this.createForm.markAsDirty();
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
            const momentDocuments = this.weekly_report ? this.weekly_report.files["694201337"] : false;
            if (momentDocuments && momentDocuments.images) {
                momentDocuments.images = momentDocuments.images.filter(
                    (article) => {
                        return article.article_id != formGroup.controls[index].value.id;
                    }
                );

                if (momentDocuments.images.length === 0) {
                    delete this.weekly_report.files["694201337"];
                }
            }

            if (
                formGroup.controls[index].value.id == "-1" &&
                (formGroup.controls[index].value.Type == "SupplierInvoiceRow" ||
                formGroup.controls[index].value.Type == "SupplierInvoice")
            ) {
                let i = this.supplierInvoices.findIndex(
                  (invoice) =>
                    invoice.sirID == formGroup.controls[index].value["SupplierInvoiceId"]
                );
                this.supplierInvoices[i].isChecked = false;
            }

                if (formGroup.controls[index]) {

                    if (this.weekly_report) {
                        this.weekly_report.rowDeleted = true;
                    }

                    if(formGroup.controls[index].value.id > 0)  {

                        if (type == 1) {
                            this.articlesAdditionalWork.at(index).get("deleted").patchValue(true);
                        } else if (type == 2) {
                            this.articlesMaterial.at(index).get("deleted").patchValue(true);
                        } else if (type == 3) {
                            this.articlesOther.at(index).get("deleted").patchValue(true);
                        }
                    }else {
                        formGroup.controls.splice(index, 1);
                        formGroup.value.splice(index, 1);
                    }
                }
            }
        });
    }

    filterSupplierInvoiceNumber() {
        return this.supplierInvoices.filter((invoice) =>
            invoice.isChecked == false
        );
    }

    removeSelectedDocumentsDU(event) {
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
                        documents: this.weekly_report.removed_documents,
                    };
                    this.weeklyReportInfoService.setSpinner(true);
                    this.projectService
                        .removeSelectedDocumentsDU(data)
                        .then((res: any) => {
                            if (res.status) {
                                this.removeSelectedDocumentsOnClientSideDU();
                            } else {
                                this.toastr.error(this.translate.instant("Error"));
                            }
                            this.weeklyReportInfoService.setSpinner(false);
                        });
                }
            });
    }

    removeSelectedDocumentsOnClientSideDU() {
        this.weekly_report.removed_documents.forEach((doc) => {
            const albumKey = doc.album;
            this.weekly_report["files"][albumKey]["images"] =
                this.weekly_report["files"][albumKey][
                    "images"
                ].filter((file: any) => {
                    return file.id != doc.id;
                });
            this.weekly_report["files"][albumKey]["pdfs"] =
                this.weekly_report["files"][albumKey]["pdfs"].filter(
                    (file: any) => {
                        return file.id != doc.id;
                    }
                );
            this.clearAlbumDU(albumKey);
        });
        this.weekly_report.removed_documents = [];
    }

    clearAlbumDU(albumKey) {
        const album = this.weekly_report["files"][albumKey];
        const imagesLength = album.images ? album.images.length : 0;
        const pdfsLength = album.pdfs ? album.pdfs.length : 0;
        if (imagesLength === 0 && pdfsLength === 0) {
            delete this.weekly_report["files"][albumKey];
        }
    }

    setClassForInput(type = null, article) {
        let class_name = '';
        if((type && type == 'qunatity') || (type && type == 'Price')) {
            if(article.get('is_manual_added').value == 0 && this.weekly_report == 0) {
                class_name += 'disabled-but-not-approved';
            }

            if(this.statuss==0 || this.statuss==1 || this.statuss==2 || this.statuss==3) {
                class_name += " pointerevAndOpacityright";
            }else {
                class_name += " no-outline dataright";
            }

        }

        return class_name;
    }

    openDocument(material, albumKey) {

        let obj = {
            'Url': material.pdf_doc ? material.pdf_doc : material.pdf_images,
            'file_path': material.pdf_doc ? material.pdf_doc : material.pdf_images,
            'image_path': null,
            'name': material.Name,
            'album': "50000",
            'document_type': material.pdf_doc ? "Pdf" : "Image",
            'id': null
        }

        setTimeout(() => {
            this.openSwiper(0, [obj], albumKey)
        }, 20);
    }

    closeAndOpen(index, albumKey) {

      if (this.pdfjsViewerComponent) {
        this.pdfjsViewerComponent.closeSwiper();
      }

      setTimeout(() => {
        this.openSwiper(index, this.getAlbumFilesKS(albumKey, 'pdfs'), albumKey)
      }, 20);
    }

    weeklyReportHasAnyTotals() {

        if(!this.userDetails.create_project_WeeklyReport) {
            return true;
        }

        let status = true;

        if (this.weekly_report) {

            if(this.weekly_report.Status == 0) {
                status = false;
            }

            if (
                this.weekly_report.articles.AdditionalWork.some((article) => article.Total > 0)
            ) {
                status = true;
            }

            if (this.weekly_report.articles.Material.some((article) => article.Total > 0)) {
                status = true;
            }

            if (this.weekly_report.articles.Other.some((article) => article.Total > 0)) {
                status = true;
            }
        }
        return status;
    }

    allowEditWeeklyReport() {



        let status = false;
        if(this.userDetails.create_project_WeeklyReport) {
            status = true;
        }
        if(!status) {
           $("input").attr('disabled','disabled');
           this.disable_buttons();
        }
        return status;
    }
}
