import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs'
import { AtaService } from 'src/app/core/services/ata.service';
import * as printJS from 'print-js';
import { ProjectsService } from 'src/app/core/services/projects.service';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from "../../../core/services/users.service";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { AESEncryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';

@Component({
  selector: 'app-deviation',
  templateUrl: './deviation.component.html',
  styleUrls: ['./deviation.component.css', '../../../utility/radio-button.css']
})
export class DeviationComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() project: any;
    @Input() projectUserDetails:any;
    @Input("top_menu_status") set containerHeight(status) {
      if (status == true) {
        this.container_height = "calc(100vh - 511px - 0px)";
      } else {
        this.container_height = "calc((100vh - 132px) - 0px)";
      }
    }
    public color = 'black';
    public container_height = "calc((100vh - 132px) - 0px)";
    public deviations: any[];
    public spinner:boolean = false;
    public showAtaMessages = false;
    public ataMessages: any[];
    public allowNewDeviation = true;
    public indexElement = "null";
    public subscription: Subscription;
    public userDetails: any;
    public language = "en";
    public message: any;
    public messageErr: any;
    public messageCont: any;
    public DeviationTypes;
    public ActiveExternalDeviationTypes;
    public ActiveInternalDeviationTypes;
    public dataSubscription: Subscription;
    // public selectedTab = 0;
    public selectedTab = sessionStorage.getItem("selectedTabDeviation") || 0;
    public externalDeviations:any[] = [];
    public externalDeviationsCopy:any[] = [];
    public internalDeviations:any[] = [];
    public internalDeviationsCopy:any[] = [];
    public searchQuery = '';
    public querySub;
    buttonToggle = false;
    public contacts = [];
    public buttonName = "";
    public worker: any;
    public objData: any = {};
    public DevExternal: any = {
      'all': false,
      '0': false,
      '4': false,
      '2': false,
      '1': false,
      '3': false,
      '9': false,


    };
    public DevInternal: any = {
      'all': false,
      '0': false,
      '4': false,
      '2': false,
      '1': false,
      '3': false,
      '9': false,

  };
  public nextDeviationNumber = 0;
  public client_workers = [];
  public emailSending = false;
  public create_project_Deviation = 1;
  public adminRole;
  public from_edit:boolean = false;

    constructor(
        private ataService: AtaService, private route: ActivatedRoute,
        private toastr: ToastrService, private router: Router,
        private usersService: UsersService, private translate: TranslateService,
        private projectsService: ProjectsService,
        private AESEncryptDecryptService: AESEncryptDecryptService,
        private dialog: MatDialog
    ) {
        this.adminRole = this.AESEncryptDecryptService.sha256('Administrator');
        this.language = sessionStorage.getItem('lang');
    }

  ngOnInit() {

    this.route.queryParamMap.subscribe((params) => {
        this.from_edit = params.get("from_edit") ? JSON.parse(params.get("from_edit")) : false;
    });

    if(!this.from_edit) {
        sessionStorage.removeItem("filterProjectDeviationBySearch");
    }

    this.getUserPermissionTabs();
    this.userDetails = JSON.parse(sessionStorage.getItem('userDetails'));
    this.querySub = this.route.queryParamMap.subscribe(params => {
        const selectedTabDeviation = sessionStorage.getItem('selectedTabDeviation');

      if (selectedTabDeviation == null) {
        this.selectedTab == 0;
        this.setSelectedTab(0);
      }

      if(this.selectedTab == 1){
        this.selectedTab == 1;
        this.setSelectedTab(1)
      }

       this.checkIfDataExist(this.selectedTab);
       this.ensureRedirectIfHasNotPermissions();
       sessionStorage.setItem('selectedTabDeviation', this.selectedTab.toString());
    });

    this.DeviationTypes = this.route.snapshot.data['type_deviations'];
    this.message =  this.translate.instant('You have successfully switched deviation to Ata!');
    this.messageCont = this.translate.instant('You have successfully deleted deviation from Ata!');

    this.create_project_Deviation = this.userDetails.create_project_Deviation;
/*
    if (this.type == 'internal') {
      status = this.userDetails.create_project_Internaldeviation;
    }else {
      status = this.userDetails.create_project_Externaldeviation;
    }*/

    this.externalDeviations = this.route.snapshot.data['externalDeviations']['data'];

    this.externalDeviationsCopy = JSON.parse(JSON.stringify(this.externalDeviations));
    this.internalDeviations = this.route.snapshot.data['internalDeviations']['data'];

    this.internalDeviationsCopy = JSON.parse(JSON.stringify(this.internalDeviations));
    this.sortDeviationsByNumber();
    this.ActiveExternalDeviationTypes = this.DeviationTypes;
    this.ActiveInternalDeviationTypes = this.DeviationTypes;
    if(this.externalDeviations.length > 0) {
        let externalDeviationsTypes = Object.keys(this.externalDeviations[0].dev_types).map((k) => this.externalDeviations[0].dev_types[k]);
        this.ActiveExternalDeviationTypes = this.DeviationTypes.filter((item:any)=>{
            return externalDeviationsTypes.includes(item.id);
        });
    }

    if(this.internalDeviations.length > 0) {
        let internalDeviationsTypes = Object.keys(this.internalDeviations[0].dev_types).map((k) => this.internalDeviations[0].dev_types[k]);
        this.ActiveInternalDeviationTypes = this.DeviationTypes.filter((item:any)=>{
            return internalDeviationsTypes.includes(item.id);
        });
    }

    this.subscription = this.ataService.messages.subscribe(
      (response) => {
        this.ataMessages = response;
      }
    );

    this.projectsService.getAttestClientWorkers(this.project.id).then((res) => {
      this.client_workers = res;
    });

    this.setLastDeviationNumber();
    this.checkStatus();
  }

  ngAfterViewInit() {
    this.refreshSearch();
  }

  onMouseEnter(){
    this.color = 'var(--orange-dark)';
  }

  OnMouseLeave(){
    this.color = 'black';
  }

  setSelectedTab(tab) {
    if(this.selectedTab != tab){
      this.contacts = [];
    }
    this.selectedTab = tab;

    if(tab == 1){
        sessionStorage.setItem('selectedTabDeviation', this.selectedTab.toString());
    }
    else{
        sessionStorage.setItem('selectedTabDeviation', "0");
    }
    this.checkIfDataExist(this.selectedTab);
  }

  checkIfDataExist(selectedTab) {
    if (selectedTab == "1") {
      if (this.getFilteredInternalDeviations.length > 0) return true;
    } else {
      if (this.getFilteredExternalDeviations.length > 0) return true;
    }
    return false;
  }

  checkIfContactSelected(worker) {
    return this.contacts.filter((contact)=>{ return worker.Id == contact.Id }).length;
  }

  getDeviationType(id) {
    let type = this.DeviationTypes.find(type => type.id == id)
    if (type) {
      return type.Name;
    }
  }

  openMessages(ata, index) {
    this.ataService.getMessages(ata.id).subscribe({
      next: (response) => {
        this.ataMessages = response["data"];
      },
      error: () => {},
    });

    if ( this.indexElement != index )
      this.showAtaMessages = true;
    else
      this.showAtaMessages = !this.showAtaMessages;

    if ( this.indexElement == index )
      this.indexElement = "null";
    else
      this.indexElement = index;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.querySub) {
      this.querySub.unsubscribe();
    }
  }

  openComponentDetail(deviation) {
    this.ataService.getMessages(deviation.id).subscribe({
      next: (response) => {
        this.ataMessages = response["data"];
        this.ataService.setDeviation(deviation, this.ataMessages);
      },
      error: () => {},
    });
  }

  getDeviationStatusClass(status) {
    let rowClass = '';

    switch (status.toString()) {
      case '0':
        rowClass = 'wemax-yellow';
        break;
      case '2':
        rowClass = 'wemax-new-green';
        break;
      case '1':
        rowClass = 'wemax-orange';
        break;
      case '5':
      case '6':
        rowClass = 'wemax-new-green';
        break;
      case '9':
          rowClass = 'success-question';
        break;
      case '3':
        rowClass = this.selectedTab == 0 ? 'wemax-white' : 'wemax-red';
        break;
      case '4':
        rowClass = 'wemax-blue';
        break;
      default:
        rowClass = '';
    }
    return rowClass;
  }

  getDeviations() {
    this.ataService.getAtaDeviation(this.project.id).subscribe(
      (res) => {
        if(res["status"])
          this.deviations = res["data"];
      }
    );
  }

  renderName(ata) {
    let name = '';
    if(ata.AtaInternalNumber)
      name = 'InternDeviation-' + ata.AtaInternalNumber;
    return name;
  }

  getRelationKey(relations, key, type, ata) {

    let key_ = '';
    if (relations.length === 0) {
      if (type === 'ATA') {
        key_ = this.renderNameAta(ata);
      } else if (type === 'Deviation') {
        key_ = this.renderNameDeviation(ata)
      }
    } else {
      const relation = relations[0][key].split('-');
      const relation0 = relation[0] ? relation[0] : '';
      const relation1 = relation[1] ? relation[1] : '';
      key_ = `${relation0}-${relation1}`;
    }

    ata[`${type}RelationKey`] = key_;

    return ata[`${type}RelationKey`];
  }

  renderNameAta(ata) {
    if (ata.ExternalAtaNumber && ata.Ata == 1) return "ÄTA-" + ata.ExternalAtaNumber;
    if (ata.AtaInternalNumber && ata.Ata == 1) return "ÄTA-" + ata.AtaInternalNumber;
    if (ata.AtaNumber && ata.Ata == 1) return "ÄTA-" + ata.AtaNumber;
    return '';
  }

  renderNameDeviation(ata) {
    if (ata.ExternalAtaNumber) return "U-" + ata.ExternalAtaNumber;
    if (ata.AtaInternalNumber) return "U-" + ata.AtaInternalNumber;
    return '';
  }

  getRelationLink() {


  }

  redirectTo(event, AtaInternalNumber, ExternalAtaNumber, relations, ata, type) {

    event.stopPropagation();

    const noRelations = relations.length == 0;

    if (ata.DeviationNumber && ata.Deviation == 1 && noRelations) {
      this.router.navigate(['/projects/view/deviation/edit/', ata.ProjectID, ata.id], { queryParams: { type: 'internal'} });
    } else if (ata.DeviationNumber && ata.Deviation == 1 && noRelations) {
      this.router.navigate(['/projects/view/deviation/edit/', ata.ProjectID, ata.id], { queryParams: { type: 'external' } });
    } else if (relations.length > 0) {

      const queryParams:any = { projectId: ata.ProjectID };

      if (type === 'ATA') {
        queryParams.type = relations[0].child_number.includes('Internal') ? 'internal' : 'external';
      }

      this.router.navigate([relations[0].link.replace('#', '')], { queryParams: queryParams } );
    } else if (ExternalAtaNumber && ata.Ata == 1 && noRelations) {
      this.router.navigate(['/projects/view/ata/modify-ata/', ata.id], { queryParams: { type: 'external', projectId: ata.ProjectID } });
    } else if (AtaInternalNumber && ata.Ata == 1 && noRelations) {
      this.router.navigate(['/projects/view/ata/modify-ata/', ata.id], { queryParams: { type: 'internal',  projectId: ata.ProjectID} });
    }
  }

  renderNameFromInternal(ata) {
    let name = '';
    if(ata.ExternalAtaNumber)
      name = 'U-' + ata.ExternalAtaNumber;
    return name;
  }

  get getFilteredExternalDeviations() {

    const statusObject = this.getStatusObjectType();

    return this.externalDeviations.filter((deviation)=>{

      return ['Name', 'DueDate'].some((property)=>{

        return (deviation[property].toLowerCase().includes(this.searchQuery.toLowerCase())  && this[statusObject][deviation['Status']])
      })
    });
  }

  getStatusObjectType() {
    this.setLastDeviationNumber();
    let type = 'DevInternal';
    if (this.selectedTab == 0) {
      type = 'DevExternal';
    }
    return type;
  }

  statusObjectCondition(status) {
    const statusObject = this.getStatusObjectType();
    return this[statusObject][status];
  }

  setLastDeviationNumber() {
    if (this.selectedTab == 0) {
      this.nextDeviationNumber = this.externalDeviations[0] ? (Number(this.externalDeviations[0].DeviationNumber) + 1) : 1;
      return;
    }
    this.nextDeviationNumber = this.internalDeviations[0] ? (Number(this.internalDeviations[0].DeviationNumber) + 1) : 1;
  }

  get getFilteredInternalDeviations() {

    const statusObject = this.getStatusObjectType();

    return this.internalDeviations.filter((deviation)=>{

      return ['Name', 'DueDate'].some((property)=>{

        return (deviation[property].toLowerCase().includes(this.searchQuery.toLowerCase())  && this[statusObject][deviation['Status']])
      })
    });
  }

  ensureRedirectIfHasNotPermissions() {

    const selectedTabDeviation = sessionStorage.getItem('selectedTabDeviation');
    let status = 0;
    if(this.userDetails.show_project_Deviation || this.projectUserDetails) {

        const permissions = {
            deviationExternal: Number(this.userDetails.show_project_Externaldeviation),
            deviationInternal: Number(this.userDetails.show_project_Internaldeviation),
            deviationExternal2: Number(this.projectUserDetails.Deviation_External),
            deviationInternal2: Number(this.projectUserDetails.Deviation_Internal)
        };
        if (permissions.deviationInternal == 1 ||  permissions.deviationInternal2 == 1) {
          status = 1;
          if (selectedTabDeviation && Number(selectedTabDeviation) == 1) {
            this.setSelectedTab(1);
          } else {
            this.setSelectedTab(1);
          }
        }

        if (permissions.deviationExternal == 1 || permissions.deviationExternal2 == 1) {
          status = 1;
          if (selectedTabDeviation && Number(selectedTabDeviation) == 0) {
            this.setSelectedTab(0);
          } else if (permissions.deviationInternal == 0) {
            this.setSelectedTab(0);
          }
        }
        this.setSelectedTabBasedOnPermission(permissions);
    }

    if (status == 0) {
      this.toastr.error(
        this.translate.instant("You don't have permission to view") +
          ": " +
          this.translate.instant("Deviation"),
        this.translate.instant("Error")
      );
      this.router.navigate(["/"]);
    }
  }

  setSelectedTabBasedOnPermission(permissions) {
      // 1 internal
      // external
    if (permissions.deviationInternal == 0 && this.selectedTab === 1) {
      this.selectedTab = 0;
    }

    if (permissions.deviationExternal == 0 && this.selectedTab === 0) {
      this.selectedTab = 1;
    }
  }


  ensureDeviationExternalShow() {
    let status = this.userDetails.show_project_Externaldeviation;

    if (this.projectUserDetails) {
      const deviationExternal = Number(this.projectUserDetails.Deviation_External);
      if(deviationExternal) {
        status = deviationExternal;
      }
    }

    if (status !== undefined && status != 0) {
      return true;
    } else {
      return false;
    }
  }

  ensureDeviationInternalShow() {
    let status = this.userDetails.show_project_Internaldeviation;

    if (this.projectUserDetails) {
      const deviationInternal = Number(this.projectUserDetails.Deviation_Internal);
      if(deviationInternal) {
        status = deviationInternal;
      }
    }

    if (status !== undefined && status != 0) {
      return true;
    } else {
      return false;
    }
  }

  edit(ata, type) {
    if (type == "external")
      this.router.navigate(['/projects/view/deviation/edit/', ata.ProjectID, ata.id], { queryParams: { type: 'external' } });
    else
      this.router.navigate(['/projects/view/deviation/edit/', ata.ProjectID, ata.id], { queryParams: { type: 'internal' } });
  }

  onStatusChange(value) {

    const statusObject = this.getStatusObjectType();
    const status = !this[statusObject][value];
    if (value == 'all') {
      this.checkAll(status, statusObject);
      this.sortDeviationsByNumber();
    } else {
      if (!status) {
        this[statusObject]['all'] = false;
      }
      this[statusObject][value] = status;
      this.createUserPermissionTabs(value, statusObject, status);
      this.handleAllStatus();
    }
  }

  handleAllStatus() {

    const statusObject1 = this.getStatusObjectType();
    const statusObject = this[statusObject1];
    const keys = Object.keys(statusObject);
    let flag = true;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
    //  this.createUserPermissionTabs(key, statusObject1, status);
      if (!statusObject[key]) {
        flag = false;
        break;
      }
    }
    console.log(flag)
    statusObject["all"] = flag;
  }

  checkAll(status, statusObject) {

    const keys = Object.keys(this[statusObject]);
    keys.forEach((key)=>{
      if (key !== 'all') {
        this.createUserPermissionTabs(key, statusObject, status);
      }
      this[statusObject][key] = status;
    });
  }

  sortDeviationsByNumber() {

    this.externalDeviations = this.externalDeviations.sort((ata1, ata2)=>{
      return Number(ata2.DeviationNumber) - Number(ata1.DeviationNumber);
    });

    this.internalDeviations = this.internalDeviations.sort((ata1, ata2)=>{
      return Number(ata2.DeviationNumber) - Number(ata1.DeviationNumber);
    });
  }

    sortDeviationsByStatus() {

        const sortBy = [0, 4, 2, 3];
        const sortByObject = sortBy.reduce((a,c,i) => {
            a[c] = i
            return a
        }, {});

        this.externalDeviations = this.externalDeviations.sort((ata1, ata2)=>{
            return Number(sortByObject[ata1.Status]) - Number(sortByObject[ata2.Status]);
        });

        this.internalDeviations = this.internalDeviations.sort((ata1, ata2)=>{
            return Number(sortByObject[ata1.Status]) - Number(sortByObject[ata2.Status]);
        });
    }

    printSummary(selectedTab) {

        let summary = [];
        let type_of_deviation = 'external';
        if (selectedTab == '1') {
            type_of_deviation = 'internal';
            summary = this.getFilteredInternalDeviations;
        }
        if (selectedTab == '0') {
            summary = this.getFilteredExternalDeviations;
        }

        this.spinner = true;
        this.ataService.sendDeviationSummaryToClient([], summary, this.project, type_of_deviation).subscribe(
        response => {
            this.spinner = false;
            printJS(response['summaryUrl']);
        },
        (reason) => {
            this.toastr.error(this.translate.instant('Couldn`t print, please try again.'), this.translate.instant('Error'));
            this.spinner = false;
        });
    }

    sendSummaryToClient(contacts, selectedTab) {
      if(this.project.status == 3 || this.project.status == 4) return;

      if (contacts.length < 1) {
        return this.toastr.info(
          this.translate.instant(
            "You first need to select an email where to send atas"
          ) + ".",
          this.translate.instant("Info")
        );
      }

      let emails = "";
      const additionalEmailList = [];
      contacts.forEach((contact, index) => {
        contact.email = this.client_workers.find((x) => x.Id == contact.Id).email;
        additionalEmailList.push(contact);
        if (emails.length > 0)
          emails = emails + ", " + (contact.email ? contact.email : contact.Name);
        else emails = emails + (contact.email ? contact.email : contact.Name);
      });

      const diaolgConfig = new MatDialogConfig();
      diaolgConfig.autoFocus = false;
      diaolgConfig.disableClose = true;
      diaolgConfig.width = "";
      diaolgConfig.data = {
        questionText:
          this.translate.instant("Are you sure you want to send email to:") +
          " " +
          emails +
          " ?",
      };
      diaolgConfig.panelClass = "mat-dialog-confirmation";
      this.dialog
        .open(ConfirmationModalComponent, diaolgConfig)
        .afterClosed()
        .subscribe((response) => {
          if (response.result) {
            this.emailSending = true;
            let summary = [];
            let type_of_deviation = 'external';
            if (selectedTab == '1') {
                type_of_deviation = 'internal';
                summary = this.getFilteredInternalDeviations;
            }
            if (selectedTab == '0') {
                summary = this.getFilteredExternalDeviations;
            }

            this.ataService
              .sendDeviationSummaryToClient(additionalEmailList, summary, this.project, type_of_deviation)
              .subscribe({
                next: (response) => {
                  this.emailSending = false;
                  if (response["status"]) {
                    this.toastr.success(
                      this.translate.instant("You have successfully sent email!"),
                      this.translate.instant("Success")
                    );
                    this.emailSending = false;
                  } else {
                    this.toastr.error(
                      this.translate.instant(
                        "Couldn`t send the email, please try again."
                      ),
                      this.translate.instant("Error")
                    );
                    this.emailSending = false;
                  }
                },
                error: (_) => {
                  this.toastr.error(
                    this.translate.instant(
                      "Couldn`t send the email, please try again."
                    ),
                    this.translate.instant("Error")
                  );
                  this.emailSending = false;
                },
              });
          }
        });

    }

    filterByTypes(val, type) {

        if(type == 'external') {
            this.externalDeviations = JSON.parse(JSON.stringify(this.externalDeviationsCopy));
            if(val != 0) {
                this.externalDeviations = this.externalDeviations.filter((item:any)=>{
                    return item.DeviationType == val;
                });
            }
            }else {
                this.internalDeviations = JSON.parse(JSON.stringify(this.internalDeviationsCopy));
                if(val != 0) {
                    this.internalDeviations = this.internalDeviations.filter((item:any)=>{
                    return item.DeviationType == val;
                });
            }
        }
    }

    buttonNameSummary(event, worker) {

      event.stopPropagation();

      if (worker) {
        this.buttonToggle = true;
        if (
          this.contacts.some((selectedWorker) => selectedWorker.Id == worker.Id)
        ) {
          this.contacts.splice(this.contacts.indexOf(worker), 1);
        } else {
          this.contacts.push(worker);
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

    printDeviationStatusText(status) {

      if (status == 1) {
        return this.translate.instant('Question');
      }

      if (status == 0) {
        return this.translate.instant('Under pricing');
      }

      if (status == 2) {
        return this.translate.instant('Answered');
      }

      if (status == 3) {
        return this.translate.instant('Aborted');
      }

      if (status == 4) {
        return this.translate.instant('Sent');
      }

      if (status == 9) {
        return this.translate.instant('Client Answer');
      }
    }

    printDeviationStatusTextInternal(ata) {

      if (ata.Status == 2 || ata.Status == 3) {
        return 'Answered';
      }

      if (ata.lastChat !== '') {
        return ata.lastChat.username;
      }
    }

    printLastEmailLogDate(ata, key) {

      let declined = false;
      let date = ''
      ata?.clientResponses.forEach(value =>{
        if(value?.Status == 3 && key == 'Responded'){
         declined = true;
         date = value?.answerDate;
        }
      })

      if(declined){
        return date.split(' ')[0];
      }

      let latestEmailLog = ata.lastEmailLog
      if (!latestEmailLog) {return;}
      if (!latestEmailLog[key]) {return;}
      return latestEmailLog[key].split(' ')[0];
    }

    printLastChatDate(lastChat, key) {
      if (!lastChat) {return;}
      if (!lastChat[key]) {return;}
      if (lastChat.message === '') {return;}
      return lastChat[key].split(' ')[0];
    }



    createUserPermissionTabs(value, type, status) {
      this.objData = {
        user_id: this.userDetails.user_id,
        tab_name: value,
        type: type,
      };

      if (status) {
        this.usersService.createUserPermissionTabs(this.objData);
      } else {
        this.usersService.deleteUserPermissionTabs(this.objData);
      }
    }


    getUserPermissionTabs() {

      this.usersService.getUserPermissionTabs().subscribe((res) => {



        const external = res["data"]["DevExternal"];
        const internal = res["data"]["DevInternal"];

        if (external) {
          const keys_external = Object.keys(external);
          keys_external.forEach((status) => {
            if(status != "all")
              this.DevExternal[status] = true;
          });

          const devExternalKeys = Object.keys(this.DevExternal);

          if (keys_external.length === devExternalKeys.length - 1) {
            this.DevExternal["all"] = true;
          }

          // this.checkAll(true, 'DevExternal');
        }

        if (!external) {
          this.checkAll(true, 'DevExternal');
        }

        if (internal) {
          const keys_internal = Object.keys(internal);

          keys_internal.forEach((status) => {
            this.DevInternal[status] = true;
          });

          const devInternalKeys = Object.keys(this.DevInternal);

          if (keys_internal.length === devInternalKeys.length - 1) {
            this.DevInternal["all"] = true;
          }
        }

        if (!internal) {
          this.checkAll(true, 'DevInternal');
        }

        this.handleAllStatus();
      });
    }

    sendExportedDocuments(contacts) {

      if(this.project.status != 3 && this.project.status != 4) return;

      if (contacts.length < 1) {
        return this.toastr.info(
          this.translate.instant(
            "You first need to select an email where to send documents"
          ) + ".",
          this.translate.instant("Info")
        );
      }

      let emails = "";
      const additionalEmailList = [];
      contacts.forEach((contact, index) => {
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
      diaolgConfig.data = {
        questionText:
          this.translate.instant("Are you sure you want to send email to:") +
          " " +
          emails +
          " ?",
      };
      diaolgConfig.panelClass = "mat-dialog-confirmation";
      this.dialog
        .open(ConfirmationModalComponent, diaolgConfig)
        .afterClosed()
        .subscribe((response) => {
          if (response.result) {
            this.emailSending = true;

            this.ataService
              .downloadDocumentsZip(this.project.id, 'deviation', additionalEmailList)
              .subscribe({
                next: (response) => {
                  this.emailSending = false;
                  if (response["status"]) {
                    this.toastr.success(
                      this.translate.instant("You have successfully sent email!"),
                      this.translate.instant("Success")
                    );
                    this.emailSending = false;
                  } else {
                    this.toastr.error(
                      this.translate.instant(
                        "Couldn`t send the email, please try again."
                      ),
                      this.translate.instant("Error")
                    );
                    this.emailSending = false;
                  }
                },
                error: (_) => {
                  this.toastr.error(
                    this.translate.instant(
                      "Couldn`t send the email, please try again."
                    ),
                    this.translate.instant("Error")
                  );
                  this.emailSending = false;
                },
              });
          }
        });
    }

    closeToggle(){
      this.buttonToggle = !this.buttonToggle
  }


  checkStatus() {
    if(this.project.status != "2"){
      this.allowNewDeviation=false;
    }
  }

    allowCreateDeviation() {

        let status = false;
        if(Number(this.userDetails.create_project_Deviation) || this.projectUserDetails) {
            if(this.selectedTab == 1) {
                const deviationInternal = Number(this.userDetails.create_project_Internaldeviation);
                const deviationInternal2 = Number(this.projectUserDetails.Deviation_Internal);
                if((deviationInternal && this.userDetails.role_name == this.adminRole /* 'Administrator'*/) || deviationInternal2) {
                    status = true;
                }
            }else {
                const deviationExternal = Number(this.userDetails.create_project_Externaldeviation);
                const deviationExternal2 = Number(this.projectUserDetails.Deviation_External);
                if((deviationExternal && this.userDetails.role_name == this.adminRole /* 'Administrator'*/) || deviationExternal2) {
                    status = true;
                }
            }
        }

        if(status) {
            return true;
        }else {
            return false;
        }
    }

    clearSearchText(event) {
        sessionStorage.removeItem("filterProjectAtasBySearch");
        this.from_edit = false;
        return this.searchQuery = "";
    }

    get existString() {
        if (((document.getElementById('searchInput') as HTMLInputElement).value).length > 0)
            return true;
        else
            return false;
    }

    onSearch(searchText) {
        sessionStorage.setItem("filterProjectDeviationBySearch", JSON.stringify(searchText));
    }

    refreshSearch() {
        let filterUsersBySearch = JSON.parse(sessionStorage.getItem("filterProjectDeviationBySearch"));
        if(filterUsersBySearch && filterUsersBySearch.length > 0) {
            this.searchQuery = filterUsersBySearch;
        }
    }
}
