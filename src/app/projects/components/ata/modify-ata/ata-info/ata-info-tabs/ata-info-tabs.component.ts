import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { AtaInfoService } from '../ata-info.service';
import { ProjectsService } from "src/app/core/services/projects.service";
import { AtaService } from "src/app/core/services/ata.service";
import { ActivatedRoute } from '@angular/router';
import { AESEncryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';

@Component({
  selector: 'app-ata-info-tabs',
  templateUrl: './ata-info-tabs.component.html',
  styleUrls: ['./ata-info-tabs.component.css']
})
export class AtaInfoTabsComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input('reportsData') reportsData;
  public atas: any = [];
  public madeOf: any;
  public madeOfExist: any = false;
  public selectedAta:any = {
    ATAID: -1,
    Status: -1,
    AtaNumber: -1,
    Name: '',
    PDFUrl: '',
    status
  };
  public selectedAtaIndex:any = 0;
/*  public reportsData: any = {
    activeReport: 0,
    activeReportIndex: -1,
    keys: [],
    data: {},
    loading: false
  };*/
  public ataKsSub;
  public showKS:any;
  public atasSub;
  public selectedAtaSub;
  public ksChild = {
    isMin: true,
    isMax: true,
    children: [],
    activeChildIndex: -1
  };
  public ksChildren = [];
  public activeKsChild = -1;
  public ksActive = false;
  public active_weekly_report:number = 0;
  public max_weekly_report:number = 0;
  public active_children_weekly_report:any = null;
  public max_children_weekly_report:number = 0;
  public active_children_weekly_report_index:number = 0;
  public active: any ={};
  public allow_get_data:boolean = true;
  public spinner:boolean = false;
  public getWeeklyReportsSub;
  public active_tab:any  = 1;
  public getReloadWeeklyReportByNamesSub;
  public getReloadWeeklyReportByNamesWitIndexSub;
  public getWeeklyReportIdSub;
  public selected_wr_name;
  public number_of_execution:number = 0;
  public active_component:any = 'ata';
  public type;
  public project_id;
  public toggleSelect:boolean = false;
  public toggleChildrenSelect:boolean = false;
  public from_overview:boolean = false;
  public exist_visible_weekly_report:boolean = false;
  public enable_select_ks:boolean = true;
  public userDetails: any = JSON.parse(sessionStorage.getItem("userDetails"));
  public selected_ata_id:any = 0;
  public weeklyreport_id:any = 0;
  public getReloadAtaFromTabSub;
  public allow_reload_ata:boolean = false;
  public adminRole;

    constructor(
        private ataInfoService:AtaInfoService,
        private projectsService: ProjectsService,
        private ataService: AtaService,
        private route: ActivatedRoute,
        private AESEncryptDecryptService: AESEncryptDecryptService
    )
    {
        this.adminRole = this.AESEncryptDecryptService.sha256('Administrator');
    }

    ngOnInit(): void {

        this.route.queryParamMap.subscribe((params) => {
            this.type = params.get("type") || null;
            this.project_id = params.get("projectId") || 0;
            this.selected_ata_id = params.get("selected_ata") || 0;
            this.weeklyreport_id = params.get("weeklyreport_id") || 0;
        });
        this.ataInfoService.setActiveComponents('ata');
        this.active_component = 'ata';
        this.subToAtaSubject();
        this.subToSelectedAta();
        this.madeOf = this.atas[0]?.ata_relations[0]?.number.split('-')[1] + '-' + this.atas[0]?.ata_relations[0]?.number.split('-')[2];
        this.atas.length > 1 ? this.active_tab = 2 : 0;

        if (this.atas[0].ata_relations.length  || this.atas[0].DeviationNumber) {
            this.madeOfExist = true;
        } else {
            this.madeOfExist = false;
        }

        if(this.selectedAta.PaymentType == 1) {
            this.getReloadWeeklyReportByNames();
        }
        this.getReloadAtaFromTab();
    }

    setAtaType() {
        if (this.type === null) {
            this.type = this.selectedAta.Type == 1 ? 'external' : 'internal';
        }
    }

    ngAfterViewInit() {
        if(this.selectedAta.PaymentType == 1) {
            this.getWeeklyReportId();
        }
        this.setActiveAtaFromNotification();
    }

    ngOnDestroy() {
        this.unsubFromAtaKs();
        this.unsubFromAtaSubject();
        this.unsubFromSelectedAta();
        this.unSubgetReloadWeeklyReportByNames();
        this.unSubgetWeeklyReportId();
        this.unSubReloadAtaFromTab();
    }

    subToAtaSubject() {
        this.atasSub = this.ataInfoService.getAtas().subscribe((atas)=>{
            this.atas = atas;
        });
    }

    unSubReloadAtaFromTab() {
        if (this.getReloadAtaFromTabSub) {
            this.getReloadAtaFromTabSub?.unsubscribe();
            this.ataInfoService.setReloadAtaFromTab(false);
            this.ataInfoService.setReloadAtaPDF(false);
        }
    }

    unSubgetWeeklyReportId() {
        if (this.getWeeklyReportIdSub) {
            this.getWeeklyReportIdSub?.unsubscribe();
            this.ataInfoService.setWeeklyReportId(null);
        }
    }

    unSubgetReloadWeeklyReportByNames() {
        if (this.getReloadWeeklyReportByNamesSub) {
            this.getReloadWeeklyReportByNamesSub?.unsubscribe();
        }
    }

    unsubFromAtaKs() {

        if (this.ataKsSub) {
            this.ataKsSub?.unsubscribe();
        }
    }

    unSubgetWeeklyReports() {
        if (this.getWeeklyReportsSub) {
            this.getWeeklyReportsSub.unsubscribe();
        }
    }

    unsubFromAtaSubject() {
        if (this.atasSub) {
            this.atasSub.unsubscribe();
        }
    }

    allowEditAta() {
        let status = false;
        if(this.userDetails.create_project_Ata) {

            const permissions = {
                ataExternal: Number(this.userDetails.create_project_Externalata),
                ataInternal: Number(this.userDetails.create_project_Internalata)
            }

            if(this.type == 'external') {
                if (permissions.ataExternal && this.userDetails.role_name == this.adminRole /*'Administrator'*/) {
                    status = true;
                }
            }

            if(this.type == 'internal') {
                if (permissions.ataInternal == 1 && this.userDetails.role_name == this.adminRole /*'Administrator'*/) {
                    status = true;
                }
            }
        }
        return status;
    }

    allowViewAta() {
        let status = false;
        if(this.userDetails.show_project_Ata) {

            const permissions = {
                ataExternal: Number(this.userDetails.show_project_Externalata),
                ataInternal: Number(this.userDetails.show_project_Internalata)
            }

            if(this.type == 'external') {
                if (permissions.ataExternal) {
                    status = true;
                }
            }

            if(this.type == 'internal') {
                if (permissions.ataInternal == 1) {
                    status = true;
                }
            }
        }
        return status;
    }

    initWeeklyReport(selected_weekly_report = false) {

        if(!this.allowViewAta()) {
            return;
        }

        this.exist_visible_weekly_report = false;
        if( this.reportsData.length > 0) {

            this.reportsData.forEach((element, index) => {
                if(element.is_visible == 1) {
                    this.exist_visible_weekly_report = true;
                    this.max_weekly_report = this.reportsData.length - 1;

                    if(this.weeklyreport_id > 0) {
                        this.active_weekly_report = this.reportsData.findIndex((x:any) => x.active_notification == true);
                    }else {
                        if(!selected_weekly_report) {
                            this.active_weekly_report = index;
                        }
                    }
                }

            });

            if(this.exist_visible_weekly_report) {
                let children_wr = Object.keys(this.reportsData[this.active_weekly_report].childrens);
                if(children_wr.length > 0) {

                    this.max_children_weekly_report = children_wr.length - 1;
                    this.active_children_weekly_report_index = this.max_children_weekly_report;

                    if(this.weeklyreport_id > 0)  {

                        let index = this.reportsData.findIndex((x:any) => x.id == this.weeklyreport_id);

                            let children_weekly_reports = Object.values(this.reportsData[this.active_weekly_report].childrens);
                            if(children_weekly_reports && children_weekly_reports.length > 0) {
                                this.active_children_weekly_report_index = children_weekly_reports.findIndex((x:any) => x.id == this.weeklyreport_id);
                                if(this.active_children_weekly_report_index < 0) {
                                    this.active_children_weekly_report_index = this.max_children_weekly_report;
                                }
                            }

                            this.active_children_weekly_report = Object.keys(this.reportsData[this.active_weekly_report].childrens)[this.active_children_weekly_report_index];

                            if(index > -1) {
                                this.active_tab = 3;
                                this.getWeeklyReportByWrId(this.reportsData[this.active_weekly_report].id, true, 3, this.enable_select_ks);
                            }else {
                                this.getWeeklyReportByWrId(this.reportsData[this.active_weekly_report].childrens[this.active_children_weekly_report].id, true, 4, this.enable_select_ks);
                                this.active_tab = 4;
                            }

                   }else {

                        this.active_children_weekly_report = this.max_children_weekly_report;
                        this.active_children_weekly_report = Object.keys(this.reportsData[this.active_weekly_report].childrens)[this.active_children_weekly_report_index];
                        this.active_tab = 4;
                        this.getWeeklyReportByWrId(this.reportsData[this.active_weekly_report].childrens[this.active_children_weekly_report].id, true, 4, this.enable_select_ks);
                   }
                }else {

                    this.getWeeklyReportByWrId(this.reportsData[this.active_weekly_report].id, true, 3, this.enable_select_ks);
                    if(this.enable_select_ks) {
                        this.ksActive = true;
                        this.active_tab = 3;
                    }else {
                        this.enable_select_ks = true;
                    }
                }
            }
        }
    }

    getReloadWeeklyReportByNames() {

        this.getReloadWeeklyReportByNamesSub = this.ataInfoService.getReloadWeeklyReportByNames().subscribe((status:any)=>{

            if(status == 'unselcted_ata') {
                this.selected_ata_id = 0;
                status = true;
            }

            if(status) {
                this.getNotSendWeeklyReportsByAtaIdOnlyNames(this.selectedAta.ATAID);
            }
        });

        this.getReloadWeeklyReportByNamesWitIndexSub = this.ataInfoService.getReloadWeeklyReportByNamesWithIndex().subscribe((status)=>{
            if(status) {
                this.getNotSendWeeklyReportsByAtaIdOnlyNames(this.selectedAta.ATAID, true);
            }
        });
    }

    getNotSendWeeklyReportsByAtaIdOnlyNames(ata_id, selected_weekly_report = false, wr_id = null) {

        if(this.selected_ata_id) {
            this.ataInfoService.setSpinner(false);
            return;
        }
        this.ataInfoService.setSpinner(true);
        if(this.selectedAta.PaymentType == 1 && (this.atas[this.atas.length - 1].ATAID == this.selectedAta.ATAID) && this.type == 'external') {
            this.ataService.getNotSendWeeklyReportsByAtaIdOnlyNames(ata_id, wr_id, this.weeklyreport_id).then((result)=>{

                if(result.status && result.data.length > 0) {
                    this.reportsData = result.data;
                    if(this.reportsData.length > 0) {
                        this.initWeeklyReport(selected_weekly_report);
                    }else {
                        this.reloadView();
                    }
                }else {
                    this.reportsData = [];
                    this.ataInfoService.setActiveTab('ata');
                    this.ataInfoService.setActiveComponents('ata');
                    this.ataInfoService.setSelectedTab(0);
                    this.reloadView();
                }
                this.ataInfoService.setSpinner(false);
            });
        }else {
            this.ataInfoService.setSpinner(false);
        }
    }

    subToSelectedAta() {
        this.selectedAtaSub = this.ataInfoService.getSelectedAta().subscribe((selectedAta:any)=>{

            this.selectedAta = selectedAta;
            this.selectedAtaIndex = selectedAta.ata_index;
            if( this.selectedAtaIndex > 0 && !this.ksActive) {
                this.active_tab = 2
            }
            if(this.selectedAta.PaymentType == 1) {
                this.getNotSendWeeklyReportsByAtaIdOnlyNames(this.selectedAta.ATAID);
            }
            this.setAtaType();
        });
    }

    unsubFromSelectedAta() {
        if (this.selectedAtaSub) {
            this.selectedAtaSub.unsubscribe();
        }
    }

    setIndex(index, from_notification = false) {

        if(!from_notification) {
            this.selected_ata_id = 0;
        }

        if(this.atas.length > 1 && this.selectedAta.ParentAta == 0 && !this.selected_ata_id) {
            index = Number(index) + 1;
        }
        return index;
    }

    changeSelectedAta(index:number, active_tab, from_click = false, from_notification = false) {

        if(!from_click || active_tab != this.active_tab) {

            this.ataInfoService.setSpinner(true);
            
            setTimeout( () => { 
                index = this.setIndex(index, from_notification);
                this.ataInfoService.setActiveComponents('ata');
                this.ataInfoService.setSpinner(true);
                this.active_component = 'ata';
    
                if(index > 0 || this.atas.length == 1) {
                    this.ataInfoService.setSelectedAta(index);
                    this.active_tab = active_tab
                }else {
                    this.active_tab = active_tab
                    this.selectedAtaIndex  = index;
                    this.selectedAta = this.atas[index];
                    this.ataInfoService.setSelectedAta(index);
                }
            }, 1000 );
        }
    }

    selectedAtaActiveTab() {
        if(this.selected_ata_id > 0) {
            this.setActiveAtaFromNotification();
        }else {
            if(this.atas.length == 1) {
                this.active_tab = 1;
            }else {
                this.active_tab = 2;
            }
        }
    }

    reloadView() {
        this.ksActive = false;

        // this.active_weekly_report = this.reportsData.length -1;
        // this.ataInfoService.setActiveKSIndex(this.active_weekly_report )
        // this.changeSelectedAta(this.atas.length - 1, 2)
            this.ataInfoService.setActiveTab('ata');
            this.ataInfoService.setActiveComponents('ata');
            if(this.allow_reload_ata) {
                this.ataInfoService.setSpinner(true);
                this.ataInfoService.setReloadAtaPDF(true);
                this.allow_reload_ata = false;
            }
            this.active_component = 'ata';
            this.selectedAtaActiveTab();
            this.toggleSelect = false;
            this.toggleChildrenSelect = false;
            this.selected_ata_id = 0;
    }

    chooseKS() {
        this.toggleSelect = !this.toggleSelect;
        this.toggleChildrenSelect = false;
        if(this.toggleSelect) this.active_tab = 3;
    }

    chooseChildrenKS() {
        this.toggleChildrenSelect = !this.toggleChildrenSelect;
        this.toggleSelect = false;
        if(this.toggleChildrenSelect) this.active_tab = 4;
    }

    async getWeeklyReportByWrId(wr_id, next_wr = false, active_tab = 1, active_ks = true) {

        this.spinner = true;
        this.ataInfoService.setSpinner(true);

        if(this.allow_get_data || next_wr){

            await this.projectsService.getWeeklyReportByWrId(wr_id).then(async(res)=>{
                await this.updateWeeklyReportPdf(res);

                if(active_ks) {
                    this.active_tab = active_tab
                    this.ataInfoService.setActiveComponents('weekly_report');
                    this.active_component = 'weekly_report';
                    this.ksActive = true;
                    this.ataInfoService.setActiveTab('ks');
                    //this.ataInfoService.setSelectedTab(0);
                }

                this.ataInfoService.setWeeklyReport(res);
                this.allow_get_data = true;
                this.ataInfoService.setSpinner(false);
                this.spinner = false;
                this.toggleSelect = false;
                this.toggleChildrenSelect = false;
            });
        }

        return true;
    }


    setActiveKs(value:number) {

        if(!this.spinner) {
            this.allow_get_data = false;
            this.active_weekly_report = value;//this.active_weekly_report + value;
            this.active_children_weekly_report_index = Object.keys(this.reportsData[this.active_weekly_report].childrens).length - 1;
            this.active_children_weekly_report = Object.keys(this.reportsData[this.active_weekly_report].childrens)[this.active_children_weekly_report_index];
            this.max_children_weekly_report = Object.keys(this.reportsData[this.active_weekly_report].childrens).length - 1;
            this.getWeeklyReportByWrId(this.reportsData[this.active_weekly_report].id, true, 3);

            this.ataInfoService.setActiveKSIndex(this.active_weekly_report);
            this.ataInfoService.setActiveChildrenKSIndex(this.active_children_weekly_report_index);
        }
    }

    setActiveChildrenKs2(value:number)  {

        if(!this.spinner) {
            this.allow_get_data = false;
            this.active_children_weekly_report_index = value;
            this.active_children_weekly_report = Object.keys(this.reportsData[this.active_weekly_report].childrens)[this.active_children_weekly_report_index];
            this.getWeeklyReportByWrId(this.reportsData[this.active_weekly_report].childrens[this.active_children_weekly_report].id, true, 4);
            this.ataInfoService.setActiveKSIndex(this.active_weekly_report);
            this.ataInfoService.setActiveChildrenKSIndex(this.active_children_weekly_report_index);
        }
    }

    setActiveChildrenKs(value:number) {

        if(!this.spinner) {
            this.allow_get_data = false;
            this.active_children_weekly_report_index = this.active_children_weekly_report_index + value;
            this.active_children_weekly_report = Object.keys(this.reportsData[this.active_weekly_report].childrens)[this.active_children_weekly_report_index];
            this.getWeeklyReportByWrId(this.reportsData[this.active_weekly_report].childrens[this.active_children_weekly_report].id, true, 4);
            this.ataInfoService.setActiveKSIndex(this.active_weekly_report);
            this.ataInfoService.setActiveChildrenKSIndex(this.active_children_weekly_report_index);
        }
    }

    setActiveAta(value:number) {

        value = this.setIndex(value);
        this.selectedAtaIndex  = this.selectedAtaIndex + value;
        this.selectedAta = this.atas[this.selectedAtaIndex];
        this.changeSelectedAta(this.selectedAtaIndex, 2);
        this.enable_select_ks = false;
    }

    setActiveAtaFromNotification() {

        if(this.selected_ata_id > 0) {
            this.selectedAtaIndex = this.atas.findIndex((x) => x.ATAID == this.selected_ata_id);
            this.selectedAta = this.atas[this.selectedAtaIndex];
            let active_tab = 1;
            if(this.selectedAta['ParentAta'] != 0) {
                active_tab = 2;
            }
            this.changeSelectedAta(this.selectedAtaIndex, active_tab, false, true);
            this.enable_select_ks = false;
        }
    }


    async updateWeeklyReportPdf(weekly_report) {

        let send_copy = false;
        this.ataInfoService.setSpinner(true);
        if(weekly_report.Status != 0 && weekly_report.Status != 1) {
            send_copy = true;
        }

        this.ataService.updateWeeklyReportPdf(
          weekly_report.id,
          null,
         send_copy
        ).then((res)=> {
            this.ataInfoService.setSpinner(false);
        });
    }

    checkIfExistNotApprovedChildrenKS() {

        let children_wr = Object.keys(this.reportsData[this.active_weekly_report].childrens);
        if(children_wr.length > 1) {
            return true;
        }else {
            return false;
        }
    }

    checkIfExistNotApprovedKS(arg, type= null) {

        let filteret_ks = this.reportsData.filter(
          (report) => report.is_visible == "1"
        );

        if(type == 'tab') {
            if(filteret_ks.length > arg || this.from_overview) {
                return true;
            }else {
                return false;
            }
        }else {
            if(filteret_ks.length < arg || (filteret_ks.length == 1 && filteret_ks[0].id == this.reportsData[this.active_weekly_report].id)) {
                return false;
            }else {
                return true;
            }
        }
    }

    getWeeklyReportId() {
        this.ataInfoService.setSpinner(true);
        this.getWeeklyReportIdSub = this.ataInfoService.getWeeklyReportId().subscribe(async(data: any) => {

            if(data && data.from_overview) {
                this.from_overview = true;
            }else {
                this.from_overview = false;
            }

            if(data) {
                if(data.wr_name /*&& this.selected_wr_name != data.wr_name*/) {

                    if(this.reportsData) {
                        this.initDataForGetWeeklyReport(data);
                    }else {
                        this.ataService.getNotSendWeeklyReportsByAtaIdOnlyNames(this.selectedAta.ATAID, data.id).then(async(result)=>{
                            if(result.status && result.data.length > 0) {
                                this.reportsData = result.data;
                                this.initDataForGetWeeklyReport(data);
                            }
                        });
                    }

                }else {
                    this.ataInfoService.setActiveKSIndex(this.active_weekly_report);
                    this.ataInfoService.setActiveChildrenKSIndex(this.active_children_weekly_report_index);
                }
            }
            this.ataInfoService.setSpinner(false);
        });
    }

    async initDataForGetWeeklyReport(data) {

        this.selected_wr_name = data.wr_name;
        let id = data.id;
        if(data.parent != 0) {
            id = data.parent;
        }

        if(id && id != 0 && (this.atas[this.atas.length - 1].ATAID == this.selectedAta.ATAID)) {

            this.active_weekly_report = this.reportsData.findIndex((x) => x.id == id);
            this.max_weekly_report = this.reportsData.length - 1;
            let children_wr = Object.keys(this.reportsData[this.active_weekly_report].childrens);
            if(children_wr.length > 0 && data.parent != 0) {
                this.active_tab = 4;
                this.max_children_weekly_report = children_wr.length - 1;
                this.active_children_weekly_report_index = children_wr.findIndex((wr_name) => wr_name == data.wr_name);
                this.active_children_weekly_report = Object.keys(this.reportsData[this.active_weekly_report].childrens)[this.active_children_weekly_report_index];
                await this.getWeeklyReportByWrId(this.reportsData[this.active_weekly_report].childrens[this.active_children_weekly_report].id, true, 4);

            }else {
                this.active_tab = 3;
                await this.getWeeklyReportByWrId(this.reportsData[this.active_weekly_report].id, true, 3);
            }
            this.ataInfoService.setActiveKSIndex(this.active_weekly_report);
            this.ataInfoService.setActiveChildrenKSIndex(this.active_children_weekly_report_index);
            this.number_of_execution++;
        }
        //this.ataInfoService.setSpinner(false);
    }

    printAtaNumber() {
        let ata_number = this.selectedAta.AtaNumber;
        if(this.selectedAta.ParentAta == 0) {
            ata_number = this.selectedAta.AtaNumber+'-1';
        }
        return ata_number;
    }

    setButtonIcon(report) {
        let icon = "";
        if (report?.status == 1) icon = "assets/img/send.png";
        else if (report?.status == 2) icon = "assets/img/whotetick.png";
        else if (report?.status == 5) icon = "assets/img/$.png";
        else if (report?.status == 3 || report?.status == 4)
            icon = "assets/img/alert.png";

        return icon;
    }

    getReloadAtaFromTab() {
        this.getReloadAtaFromTabSub = this.ataInfoService
          .getReloadAtaFromTab()
          .subscribe((status) => {
            if (status) {
              this.allow_reload_ata = true;
            }
        });
    }
}