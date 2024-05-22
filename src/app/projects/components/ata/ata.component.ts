import {
  Component,
  OnInit,
  Input,
  SimpleChange,
  OnChanges,
  AfterViewInit,
} from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AtaService } from "src/app/core/services/ata.service";
import { UsersService } from "../../../core/services/users.service";
import { TranslateService } from "@ngx-translate/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, Subscription } from "rxjs";
import * as printJS from "print-js";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { WeeklyReportsForSelectComponent } from 'src/app/external/components/weekly-reports-for-select/weekly-reports-for-select.component';
import { AESEncryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';

@Component({
  selector: "app-ata",
  templateUrl: "./ata.component.html",
  styleUrls: ["./ata.component.css", "../../../utility/radio-button.css"],
})
export class AtaComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() project: any;
  @Input() projectUserDetails: any;
  @Input() attestSaved: any;
  @Input() project_id: any;
  @Input("top_menu_status") set containerHeight(status) {
    if (status == true) {
      this.container_height = "calc(100vh - 511px - 0px)";
    } else {
      this.container_height = "calc(100vh - 131px - 0px)";
    }
  }
  public color = 'black';
  public prognosis: any = [];
  public activePrognosis: number = 0;
  public container_height = "calc(100vh - 131px - 0px)";
  public saved_prognosis: any[] = [];
  public index: any;
  public statuses: any[];
  public setedIndex = "";
  public userDetails: any;
  public language = "en";
  public messageErr: any;
  public messageCont: any;
  public atas = [];
  public client_workers = [];
  public contacts = [];
  public dropdownSettings;
  public totalInternalAtasCosts;
  public totalExternalAtasCosts;
  public totalExternalAtasAccruedCosts;
  public totalExternalAtasRichCosts;
  public totalInternalAtasRichCosts;
  public totalExternalAtasInvoicedCosts;
  public totalRiktExternalAtasInvoicedCosts;
  public totalExternalAtasATotalSentWr;
  public totalExternalAtasApprovedToInvoiceCosts;
  public totalExternalAtasNotApprovedToInvoiceCosts;
  public totalInternalAtasAccruedCosts;
  public totalInternalAtasInvoicedCosts;
  public totalInternalAtasApprovedToInvoiceCosts;
  public totalInternalAtasNotApprovedToInvoiceCosts;
  public totalInternalAtasWorkedNotApprovedCosts;
  public totalExternalAtasWorkedNotApprovedCosts;
  public totalRiktInternalAtasInvoicedCosts;
  public subscription: Subscription;
  public emailSending = false;
  public internalAtas = [];
  public externalAtas = [];
  public searchQuery = "";
  buttonToggle = false;
  public buttonName = "";
  public onScrollEvent: Subject<any> = new Subject<any>();
  onScrollObservable$ = this.onScrollEvent.asObservable();
  public spinner: boolean = false;
  public objData: any = {};
  public filters: any;
  public statusObjectExternal: any = {
    all: false,
    "2": false,
    "4": false,
    "0": false,
    "7": false,
    "5": false,
    "3": false,
    "6": false,
  };
  public statusObjectInternal: any = {
    all: false,
    "2": false,
    "4": false,
    "0": false,
    "7": false,
    "5": false,
    "3": false,
    "6": false,
  };
  public forecastPermission = false;
  public selectedTab = Number(sessionStorage.getItem("selectedTab")) || 0;
  public create_project_Ata = 0;
  public querySub;
  public newAtaIcon = '#82a7e2';
  public fromquery: boolean= false;
  public firstTab = 0;
  public edited_ata: any = null;
  public allowNewAta = true;
  public type:string = 'external';
  public adminRole;
  public from_edit:boolean = false;

  constructor(
    private ataService: AtaService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private usersService: UsersService,
    private router: Router,
    private dialog: MatDialog,
    private AESEncryptDecryptService: AESEncryptDecryptService
  ) {
    this.adminRole = this.AESEncryptDecryptService.sha256('Administrator');
  }

    refreshSearch() {
        let filterUsersBySearch = JSON.parse(sessionStorage.getItem("filterProjectAtasBySearch"));
        if(filterUsersBySearch && filterUsersBySearch.length > 0) {
            this.searchQuery = filterUsersBySearch;
        }
    }


  async ngOnInit() {

    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    this.route.queryParamMap.subscribe((params) => {
        this.from_edit = params.get("from_edit") ? JSON.parse(params.get("from_edit")) : false;
    });

    if(!this.from_edit) {
        sessionStorage.removeItem("filterProjectAtasBySearch");
    }
    await this.initializeActiveTab();
    this.getUserPermissionTabs();
    this.querySub = this.route.queryParamMap.subscribe(params => {

      const atatype = params.get('atatype');
      const from = params.get('from')

          if(from == 'internal' || atatype == 'internal'){
            this.selectedTab == 1;
            this.type = 'internal';
          }
          if(from == 'external' || atatype == 'external'){
            this.selectedTab == 0;
            this.type = 'external';
          }
          if(from == 'forecast' ){
            this.selectedTab == 2;
            this.type = 'forecast';
          }
          if (from == null && atatype == null) {
            this.type = 'external';
            this.setActiveTab();

            //this.selectedTab == 0;
            //this.type = 'external';
          }

          this.checkIfDataExist(this.selectedTab);
          this.ensureRedirectIfHasNotPermissions();
          sessionStorage.setItem('selectedTab', this.selectedTab.toString());
    });


    this.externalAtas = this.route.snapshot.data["externalAtas"]["data"];
    this.internalAtas = this.route.snapshot.data["internalAtas"]["data"];
    this.sortAtasByNumber("all");

    this.client_workers = this.route.snapshot.data["attest_client_workers"];

    this.create_project_Ata = this.userDetails.create_project_Ata;
    this.forecastPermission =
      this.userDetails.show_project_Forecast == 0 ? false : true;
    this.language = sessionStorage.getItem("lang");
    this.messageErr = this.translate.instant(
      "There was an error with your submission !"
    );

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

    this.ataService.getAtaStatuses().subscribe({
      next: (response) => {
        this.statuses = response["data"];
      },
      error: (err) => {
        return { status: false };
      },
    });
    this.setSelectedTab(this.selectedTab);
    this.checkStatus();
  }

  ngAfterViewInit() {

    this.setSelectedTab(this.selectedTab);
    this.refreshSearch();
  }



  // ngOnDestroy() {
  //   if (this.querySub) {
  //     this.querySub.unsubscribe();
  //   }
  // }

  onMouseEnter(){
    this.color = 'var(--orange-dark)';
  }
  OnMouseLeave(){
    this.color = 'black';
  }

  openModal() {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    // diaolgConfig.width = "932px";
    diaolgConfig.data = {
      data: {'type': 'ata', 'project_id': this.project.id, 'client_workers': this.client_workers, 'contacts': this.contacts.slice(3), 'project': this.project, 'from': 'ks'},
    };
    diaolgConfig.panelClass = "bdrop";


    this.dialog
      .open(WeeklyReportsForSelectComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
            this.toastr.success(
              this.translate.instant("Successfully sent weekly report"),
              this.translate.instant("Success")
            );
        }

      });
  }


  ensureRedirectIfHasNotPermissions() {

    if (this.userDetails.show_project_Deviation || this.projectUserDetails) {

      const permissions = {
          ataExternal: Number(this.userDetails.show_project_Externalata),
          ataInternal: Number(this.userDetails.show_project_Internalata),
          ataExternal2: Number(this.projectUserDetails.Ata_External),
          ataInternal2: Number(this.projectUserDetails.Ata_Internal),
          foreCast: this.userDetails.show_project_Forecast
      }

      this.setSelectedTabBasedOnPermission(permissions);

      if (permissions.ataInternal == 0 && permissions.ataInternal2 == 0 && this.type === 'internal') {
        this.redirect();
      }

      if (permissions.ataExternal == 0 && permissions.ataExternal2 == 0 && this.type === 'external') {
        this.redirect();
      }
    } else {
      if (this.userDetails.show_project_Ata == 0 || this.userDetails.show_project_Ata == undefined) {
        this.redirect();
      }
    }
  }

  redirect() {
      this.toastr.error(
        this.translate.instant("You don't have permission to view") +
          ": " +
          this.translate.instant("Ata"),
        this.translate.instant("Error")
      );
      this.router.navigate(["/"]);
  }

  setSelectedTabBasedOnPermission(permissions) {

    if (permissions.foreCast == 0 && this.selectedTab === 2) {
      this.selectedTab = 0;
    }

    if (permissions.ataInternal == 0 && this.selectedTab === 1) {
      this.selectedTab = 0;
    }

    if (permissions.ataExternal == 0 && this.selectedTab === 0) {
      this.selectedTab = 1;
    }

  }

    ensureAtaExternalShow() {
        let status = this.userDetails.show_project_Externalata;

        if (this.projectUserDetails) {
            const ataExternal = Number(this.projectUserDetails.Ata_External);
            if(ataExternal == 1) {
                status = ataExternal;
            }
        }

        if (status !== undefined && status != 0) {
            return true;
        } else {
            return false;
        }
    }

    ensureAtaInternalShow() {
        let status = this.userDetails.show_project_Internalata;

        if (this.projectUserDetails) {
            const ataInternal = Number(this.projectUserDetails.Ata_Internal);
            if(ataInternal == 1) {
                status = ataInternal;
            }
        }

        if (status !== undefined && status != 0) {
            return true;
        } else {
            return false;
        }
    }


    ensureAtaForecast() {
        let status = this.userDetails.show_project_Forecast;

       /* if (this.projectUserDetails) {
            const ataExternal = Number(this.projectUserDetails.Ata_External);
            if(ataExternal == 1) {
                status = ataExternal;
            }
        }*/

        if (status !== undefined && status != 0) {
            return true;
        } else {
            return false;
        }
    }

  onScroll(event) {
    this.onScrollEvent.next(event);
  }
  getTotals() {
    this.totalExternalAtasRichCosts = this.getFilteredExternalAtas.reduce(
      (prev, ata) => {
        return prev + Number(ata.Status == 3 ? 0 : ata.richCostTotal);
      },
      0
    );

    this.totalInternalAtasRichCosts = this.internalAtas.reduce((prev, ata) => {
      return prev + Number(ata.Status == 3 ? 0 : ata.richCostTotal);
    }, 0);

    //Calculate External Atas Accured Costs
    this.totalExternalAtasAccruedCosts = this.getFilteredExternalAtas.reduce(
      (prev, ata) => {
        return (
          prev +
          Number(
            ata.Status == 3 && ata.PaymentType != 5 ? 0 : ata.totallyWorkedUp
          )
        );
      },
      0
    );

    //Calculate External Atas Invoiced Costs
    this.totalExternalAtasInvoicedCosts = this.getFilteredExternalAtas.reduce(
      (prev, ata) => {
        return prev + Number(ata.Status == 3 ? 0 : ata.invoicedTotal);
      },
      0
    );

    this.totalRiktExternalAtasInvoicedCosts =
      this.getFilteredExternalAtas.reduce((prev, ata) => {
        return (
          prev + Number(ata.Status != 3 && ata.ata_total ? ata.ata_total : 0)
        );
      }, 0);

    //Calculate External Atas Invoiced Costs
    this.totalExternalAtasWorkedNotApprovedCosts =
      this.getFilteredExternalAtas.reduce((prev, ata) => {
        return prev + Number(ata.Status == 3 ? 0 : ata.workedButNotApproved);
      }, 0);

    //Calculate External Atas total sent weeklyReports
    this.totalExternalAtasATotalSentWr = this.getFilteredExternalAtas.reduce(
      (prev, ata) => {
        return prev + Number(ata.Status == 3 ? 0 : ata.total_sent_wr);
      },
      0
    );

    //Calculate External Atas Approved to Invoice Costs
    this.totalExternalAtasApprovedToInvoiceCosts =
      this.getFilteredExternalAtas.reduce((prev, ata) => {
        return prev + Number(ata.Status == 3 ? 0 : ata.approvedForInvoice);
      }, 0);

    //Calculate Internal Atas Accured Costs
    this.totalInternalAtasAccruedCosts = this.getFilteredInternalAtas.reduce(
      (prev, ata) => {
        return (
          prev +
          Number(
            ata.BecomeExternalAtaFromInternal == "0" && ata.PaymentType != 5
              ? ata.totallyWorkedUp
              : 0
          )
        );
      },
      0
    );

    //Calculate Internal Atas Invoiced Costs
    this.totalInternalAtasInvoicedCosts = this.getFilteredInternalAtas.reduce(
      (prev, ata) => {
        return (
          prev +
          Number(
            ata.BecomeExternalAtaFromInternal == "0" ? ata.invoicedTotal : 0
          )
        );
      },
      0
    );

    //Calculate Internal Atas Worked But Not Approved Costs
    this.totalInternalAtasWorkedNotApprovedCosts =
      this.getFilteredInternalAtas.reduce((prev, ata) => {
        return (
          prev +
          Number(
            ata.BecomeExternalAtaFromInternal == "0"
              ? ata.workedButNotApproved
              : 0
          )
        );
      }, 0);

    //Calculate Internal Atas Approved to Invoice Costs
    this.totalInternalAtasApprovedToInvoiceCosts =
      this.getFilteredInternalAtas.reduce((prev, ata) => {
        return (
          prev +
          Number(
            ata.BecomeExternalAtaFromInternal == "0"
              ? ata.approvedForInvoice
              : 0
          )
        );
      }, 0);

    this.totalRiktInternalAtasInvoicedCosts =
      this.getFilteredInternalAtas.reduce((prev, ata) => {
        return (
          prev +
          Number(
            ata.ata_total && ata.BecomeExternalAtaFromInternal == "0"
              ? ata.ata_total
              : 0
          )
        );
      }, 0);

  }

    ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        if (
        changes.hasOwnProperty("attestSaved") &&
        changes.attestSaved.currentValue
        ) {

        this.ataService
            .getProjectExternalAtas(this.project.id)
            .subscribe((res) => {

            if (res["status"]) {
                this.externalAtas = res["data"];
            }
            });
        }
    }

  openComponentDetail(ata, index) {
    this.ataService.setAta(ata);
    this.setedIndex = index;
  }

  getAtaStatusClass(status, index) {
    let rowClass = "";

    switch (status.toString()) {
      case "0":
        rowClass = "wemax-yellow1";
        break;
      case "2":
        rowClass = "wemax-green1";
        break;
      case "3":
        rowClass = "wemax-red1";
        break;
      case "4":
        rowClass = "wemax-purple1";
        break;
      case "5":
        rowClass = "wemax-white1";
        break;
      case "6":
        rowClass = "wemax-aborted1";
        break;
      case "7":
        rowClass = "wemax-clear1";
        break;
      default:
        console.error("Your status (" + status + ") is NOT good, fix it.");
    }
    if (index === this.setedIndex) {
      rowClass = rowClass + " " + "active";
    }

    return rowClass;
  }

  getAtas() {
    this.ataService.getAtas(this.project.id).subscribe((res) => {
      if (res["status"]) this.atas = res["data"];
    });
  }

    allowEditAta(ata_id) {
        if(!this.edited_ata || this.edited_ata == ata_id) {
            return true;
        }else {
            return false;
        }
    }

    setUserTimestamp(arg, ata_id) {
        this.usersService.updateProjectUserTimestamp(arg, ata_id);
    }

  sendAtaSummary(contacts, type) {

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
          if (type == "internalAta") {
            summary = this.getFilteredInternalAtas;
          }
          if (type == "externalAta") {
            summary = this.getFilteredExternalAtas;
          }
          this.ataService
            .sendAtasSummaryToClient(additionalEmailList, summary, this.project)
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

  numberFormatSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
/*
  redirectTo(event, AtaInternalNumber, ExternalAtaNumber, relations, ata) {

    event.stopPropagation();

    if (ata.DeviationNumber) {
      this.router.navigate(
        ["/projects/view/deviation/edit/", ata.ProjectID, ata.id],
        { queryParams: { type: "external", projectId: ata.ProjectID } }
      );
    } else if (AtaInternalNumber) {
      this.router.navigate(["/projects/view/ata/modify-ata", ata.id], {
        queryParams: { type: "internal", projectId: ata.ProjectID },
      });
    } else if (relations.length > 0) {
      this.router.navigate([ relations[0].link.replace('#', '') ]);
    } else {
      this.router.navigate(["/projects/view/ata/modify-ata/", ata.id], {
        queryParams: { type: "external", projectId: ata.ProjectID },
      });
    }
  }
*/
  redirectTo($event, AtaInternalNumber, ExternalAtaNumber, relations, ata) {

    $event.stopPropagation();

    const noRelations = relations.length === 0;

    if (ata.DeviationNumber && ata.Deviation == 1 && noRelations) {
      this.router.navigate(['/projects/view/deviation/edit/', ata.ProjectID, ata.id], { queryParams: { type: 'external'} });
    } else if (relations.length > 0) {

      const type = relations[0].child_number.includes('Internal') ? 'internal' : 'external';

      this.router.navigate([relations[0].link.replace('#', '').split('?')[0] ], { queryParams: { projectId: ata.ProjectID, type: type } });
    } else if (ExternalAtaNumber && ata.Ata == 1 && noRelations) {
      this.router.navigate(['/projects/view/ata/modify-ata/', ata.id], { queryParams: { type: 'external', projectId: ata.ProjectID } });
    } else if (AtaInternalNumber && ata.Ata == 1 && noRelations) {
      this.router.navigate(['/projects/view/ata/modify-ata/', ata.id], { queryParams: { type: 'internal',  projectId: ata.ProjectID} });
    }
  }

  redirectToFromInternalAta(ata, $event) {
    $event.stopPropagation();

    if (ata.ExternalAtaNumber) {

      this.router.navigate(["/projects/view/ata/modify-ata", ata.id], {
        queryParams: { type: "external", projectId: ata.ProjectID },
      });
    } else if (ata.DeviationNumber) {
      this.router.navigate(
        ["/projects/view/deviation/edit/", ata.ProjectID, ata.id],
        { queryParams: { type: "external", projectId: ata.ProjectID } }
      );
    }

    else {
      this.router.navigate(["/projects/view/ata/modify-ata/", ata.id], {
        queryParams: { type: "internal", projectId: ata.ProjectID },
      });
    }

  }

  getRelationKey(ata, key, type, parentType = '') {
    const relations = ata[`${type}Relation`];
    if (relations.length === 0) {
      return type == 'ata' ? this.renderNameAta(ata) : this.renderNameDeviation(ata);
    }
    const firstRelation = relations[0];
    const relation = firstRelation[key].split('-');
    const relation0 = relation[0] ? relation[0] : '';
    const typeText = `${this.translate.instant(relation0)}-`;
    const relation1 = relation[1] ? relation[1] : '';
    const relation2 = relation[2] ? `-${relation[2]}` : '';

    if (parentType == '') {
      return `${typeText}${relation1}${relation2}`;
    }

    if (parentType == 'external' && firstRelation.parent_number.includes('External')) {
      return `${typeText}${relation1}${relation2}`;
    }

    if (parentType == 'internal' && firstRelation.parent_number.includes('Internal')) {
      return `${typeText}${relation1}${relation2}`;
    }

    return '';

  }

  renderNameAta(ata) {
    if (ata.ExternalAtaNumber && ata.Ata == 1) return "ÄTA-" + ata.ExternalAtaNumber;
    if (ata.AtaInternalNumber && ata.Ata == 1) return "ÄTA-" + ata.AtaInternalNumber;
    //if (ata.AtaNumber && ata.Ata == 1) return "ÄTA-" + ata.AtaNumber;
  }
  renderNameDeviation(ata) {
    let name = "";
    if (ata.DeviationNumber) name = "U-" + ata.DeviationNumber;
    return name;
  }

  get getFilteredExternalAtas() {
    return this.externalAtas.filter((ata) => {
      return ["AtaNumber", "Name", "PaymentTypeName"].some((property) => {
        return (
          (property == "PaymentTypeName"
            ? this.translate.instant(ata[property])
            : ata[property]
          )
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) &&
          this.statusObjectExternal[ata["Status"]]
        );
      });
    });
  }

  get getFilteredInternalAtas() {
    return this.internalAtas.filter((ata) => {
      return ["AtaNumber", "Name", "PaymentTypeName"].some((property) => {
        return (
          (property == "PaymentTypeName"
            ? this.translate.instant(ata[property])
            : ata[property]
          )
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) &&
          this.statusObjectInternal[ata["Status"]]
        );
      });
    });
  }
  edit(ata, type) {
    if (type == "external")
      this.router.navigate(["/projects/view/ata/modify-ata/", ata.id], {
        queryParams: { type: "external", projectId: ata.ProjectID , from: 'external' },
      });
    else
      this.router.navigate(["/projects/view/ata/modify-ata/", ata.id], {
        queryParams: { type: "internal", projectId: ata.ProjectID  , from: 'internal'},
      });
  }



  checkIfDataExist(selectedTab) {

    if (selectedTab == "1") {
      if (this.getFilteredInternalAtas.length > 0) return true;
    } else {
      if (this.getFilteredExternalAtas.length > 0) return true;
    }
    return false;
  }

  printSummary(summaryType) {
    this.emailSending = true;
    let summary = [];
    if (summaryType == "internalAta") {
      summary = this.getFilteredInternalAtas;
    }
    if (summaryType == "externalAta") {
      summary = this.getFilteredExternalAtas;
    }
    this.ataService
      .sendAtasSummaryToClient([], summary, this.project, summaryType)
      .subscribe({
        next: (response) => {
          this.emailSending = false;
          printJS(response["summaryUrl"]);
        },
        error: (_) => {
          this.emailSending = false;
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

  onStatusChangeExternal(value) {
    const type = "Exsternal ATA";

    var status = !this.statusObjectExternal[value];
    if (value == "all") {
      this.checkAllExternal(status);
    } else {
      if (!status) {
        this.statusObjectExternal["all"] = false;
      }
      this.statusObjectExternal[value] = status;
      this.createUserPermissionTabs(value, type, status);
      this.handleAllStatus("External");
    }

    this.getTotals();
  }

  handleAllStatus(type) {
    const statusObject = this[`statusObject${type}`];
    const keys = Object.keys(statusObject);
    let flag = true;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!statusObject[key]) {
        flag = false;
        break;
      }
    }

    console.log(flag)
    statusObject["all"] = flag;
  }

  checkAllExternal(status) {
    const keys = Object.keys(this.statusObjectExternal);

    keys.forEach((key) => {
      this.statusObjectExternal[key] = status;
      if (key !== "all") {
        this.createUserPermissionTabs(key, "Exsternal ATA", status);
      }
    });

    this.sortAtasByNumber("external");
  }

  onStatusChangeInternal(value) {
    const type = "Internal ATA";
    const status = !this.statusObjectInternal[value];
    if (value == "all") {
      this.checkAllInternal(status);
    } else {
      if (!status) {
        this.statusObjectInternal["all"] = false;
      }
      this.statusObjectInternal[value] = status;
      this.createUserPermissionTabs(value, type, status);
      this.handleAllStatus("Internal");
    }
    this.getTotals();
  }


  checkAllInternal(status) {
    const keys = Object.keys(this.statusObjectInternal);

    keys.forEach((key) => {
      this.statusObjectInternal[key] = status;
      if (key !== "all") {
        this.createUserPermissionTabs(key, "Internal ATA", status);
      }
    });

    this.sortAtasByNumber("internal");
  }

  sortAtasByNumber(type) {
    if (type === "external" || type === "all") {
      this.externalAtas = this.externalAtas.sort((ata1, ata2) => {
        return Number(ata2.AtaNumber) - Number(ata1.AtaNumber);
      });
    }
    if (type === "internal" || type === "all") {
      this.internalAtas = this.internalAtas.sort((ata1, ata2) => {
        return Number(ata2.AtaNumber) - Number(ata1.AtaNumber);
      });
    }
  }

  sortAtasByStatus(type) {
    const sortBy = [0, 4, 2, 7, 5, 3, 6];
    const sortByObject = sortBy.reduce((a, c, i) => {
      a[c] = i;
      return a;
    }, {});

    if (type === "external" || type === "all") {
      this.externalAtas = this.externalAtas.sort((ata1, ata2) => {
        return (
          Number(sortByObject[ata1.Status]) - Number(sortByObject[ata2.Status])
        );
      });
    }

    if (type === "internal" || type === "all") {
      this.internalAtas = this.internalAtas.sort((ata1, ata2) => {
        return (
          Number(sortByObject[ata1.Status]) - Number(sortByObject[ata2.Status])
        );
      });
    }
  }

  selectTab(number) {
    this.selectedTab = number;
    this.getTotals();
  }
  checkIfContactSelected(contact) {
    if (
      this.contacts.some((selectedWorker) => selectedWorker.Id == contact.Id)
    ) {
      return true;
    } else return false;
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

  deleteUserPermissionTabs(value, type) {
    this.usersService.deleteUserPermissionTabs(this.objData);
  }

  get_prognosis(event = null) {
    this.spinner = true;
    this.ataService.getPrognosis(this.project.id).subscribe((res) => {
      if (res["status"]) {
        this.prognosis = res["data"];
        if (event && event == "new prognosis emitted") {
          this.activePrognosis = this.prognosis.length - 2;
        } else {
          this.activePrognosis = this.prognosis.length - 1;
        }
        this.spinner = false;

        if (this.activePrognosis < 0) {
          this.activePrognosis = 0;
        }
      }
    });
  }

  getUserPermissionTabs() {
    this.usersService.getUserPermissionTabs().subscribe((res) => {
      const external = res["data"]["Exsternal ATA"];
      const internal = res["data"]["Internal ATA"];

      if (external) {
        const keys_external = Object.keys(external);
        keys_external.forEach((status) => {
          this.statusObjectExternal[status] = true;
        });

        if (keys_external.length === 7) {
          this.statusObjectExternal["all"] = true;
        }
      }

      if (internal) {
        const keys_internal = Object.keys(internal);
        keys_internal.forEach((status) => {
          this.statusObjectInternal[status] = true;
        });
        if (keys_internal.length === 7) {
          this.statusObjectInternal["all"] = true;
        }
      }

      this.getTotals();
    });
  }
  setSelectedTab(tab) {
    if(this.selectedTab != tab){
      this.contacts = [];
    }

    this.selectedTab = tab;
    this.buttonToggle = false;
    // sessionStorage.setItem("selectedTab", tab.toString());
    if(this.selectedTab == 0){
      this.router.navigate([], {queryParams: {from: 'external', from_edit: this.from_edit}})
    }
    else if(this.selectedTab == 1){
      this.router.navigate([], {queryParams: {from: 'internal', from_edit: this.from_edit}})
    }

    if(this.selectedTab == 2) {
      this.router.navigate([], {queryParams: {from: 'forecast', from_edit: this.from_edit}})
         this.get_prognosis();
    }

    sessionStorage.setItem("selectedTab", tab.toString());

  }


  setActivePrognosis(index) {

    this.activePrognosis = index;
  }

  changePropertyTopBtn(index) {
    let z_index = 1;
    let temp_z_index = 2 * index;
    z_index += temp_z_index;
    if (index == this.activePrognosis) {
      z_index = 500;
    }
    const style = {
      "z-index": z_index,
      "margin-left": -2 + "px",
      "box-shadow": "2px 0 13px 0px #44484c",
    };
    return style;
  }

  sendExportedDocuments(contacts) {

    if(this.project.status == 1 || this.project.status == 2 || this.project.status == 0) return;

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
            .downloadDocumentsZip(this.project.id, 'ata', additionalEmailList)
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
  enter(){
    this.newAtaIcon = "#ff7000"
  }
  leave(){
    this.newAtaIcon = "#82a7e2"
  }

  checkedLengthRequirements($event, ata_id){

    if(!this.edited_ata) {
        this.edited_ata = ata_id;
    }
    const target = $event.target;
    const maxLn = target.innerText.length
    if(maxLn >= 500)
    {
      target.innerText = target.innerText.slice(0, 500);
      $event.target.blur();

     }
  }

  saveRequirements(id, event){

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.data = {
      questionText: this.translate.instant("Do you want to save?"),
    };
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          let object = {
            id: id,
            labeling_requirements: event.target.innerText,
          };

          this.ataService.updateAtaLabelingRequirements(object).subscribe((res) => {
            if (res["status"])
              this.toastr.success(
                this.translate.instant("TSC_You_have_successfully_updated_labeling_requirements"),
                this.translate.instant("Success")
              );
            else this.toastr.error(this.translate.instant("Error"));
          });
        }
      });
  }

   saveCustomComment(id, event) {

    const target = event.target;
    const custom_comment = target.innerText.trim();

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.data = {
        questionText: this.translate.instant("Do you want to save?"),
    };
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    if (this.edited_ata === id && custom_comment === '') {
      this.dialog.open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
          if (response.result) {
              this.updateComment(id, custom_comment);
          } else {
              this.edited_ata = null;
          }
      });
      return;
    }

    if (this.edited_ata === id) {
      this.dialog.open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
          if (response.result) {
              this.updateComment(id, custom_comment);
          } else {
              this.edited_ata = null;
          }
      });
        return;
    }

    if (custom_comment === '') {
        this.edited_ata = null;
        return;
    }

}

updateComment(id, custom_comment) {
  const object = {
    id: id,
    custom_comment: custom_comment
  };

  this.ataService.updateAtaCustomComment(object).subscribe((res) => {
      if (res["status"]) {
          this.toastr.success(
              this.translate.instant("TSC_You_have_successfully_updated_comment"),
              this.translate.instant("Success")
          );
      } else {
          this.toastr.error(this.translate.instant("Error"));
      }
      this.edited_ata = null;
  });
}
    onSearch(searchText) {
        sessionStorage.setItem("filterProjectAtasBySearch", JSON.stringify(searchText));
    }

  clearSearchText(){
    sessionStorage.removeItem("filterProjectAtasBySearch");
    this.from_edit = false;
    return this.searchQuery = "";
  }

  checkStatus() {
    if(this.project.status != "2"){
      this.allowNewAta=false;
    }
  }

    checkAtaPermission(type = 'read') {
        let status = false;
        if(type == 'read') {
             status = this.initializeShow();
        }else {
            status = this.initializeWrite();
        }
        return status;
    }

    initialzePermissions() {
        const permissions = {
            ataExternalWrite: Number(this.userDetails.create_project_Externalata),
            ataInternalWrite: Number(this.userDetails.create_project_Internalata),
            ataExternal2Write: Number(this.projectUserDetails.Ata_External),
            ataInternal2Write: Number(this.projectUserDetails.Ata_Internal),
            ataExternalShow: Number(this.userDetails.show_project_Externalata),
            ataInternalShow: Number(this.userDetails.show_project_Internalata),
            ataExternal2Show: Number(this.projectUserDetails.Ata_External),
            ataInternal2Show: Number(this.projectUserDetails.Ata_Internal),
            foreCastShow: Number(this.userDetails.show_project_Forecast),
            foreCastWrite: Number(this.userDetails.create_project_Forecast),
        }
        return permissions;
    }


    initializeWrite() {
        let status = false;
        if(this.userDetails.create_project_Ata || this.projectUserDetails) {

            const permissions = this.initialzePermissions();
            if(this.type == 'external') {
                if ((permissions.ataExternalWrite && this.userDetails.role_name == this.adminRole /*'Administrator'*/) || permissions.ataExternal2Write) {
                    status = true;
                }
            }

            if(this.type == 'internal') {
                if ((permissions.ataInternalWrite && this.userDetails.role_name == this.adminRole /*'Administrator'*/) || permissions.ataInternal2Write) {
                    status = true;
                }
            }
        }

        return status;
    }



    initializeShow() {
        let status = false;
        if(this.userDetails.show_project_Ata || this.projectUserDetails) {

            const permissions = this.initialzePermissions();
            if(this.type == 'external') {
                if (permissions.ataExternalShow || permissions.ataExternal2Show) {
                    status = true;
                }
            }

            if(this.type == 'internal') {
                if (permissions.ataInternalShow || permissions.ataInternal2Show) {
                    status = true;
                }
            }
        }
        return status;
    }

    setActiveTab() {
        const permissions = this.initialzePermissions();
        if(this.type == 'external') {
            if (permissions.ataExternalShow || permissions.ataExternal2Show) {
                this.selectedTab = 0;
                this.type = 'external';
            }
        }

        if(this.type == 'internal') {
            if (permissions.ataInternalShow || permissions.ataInternal2Show) {
                this.selectedTab = 1;
                this.type = 'internal';
            }
        }
    }

    async initializeActiveTab() {

        const permissions = this.initialzePermissions();
        let existing_type = {
            'external': 0,
            'internal': 0,
            'forecast': 0,
        };

        if(this.type == 'external') {
            if (!permissions.ataExternalShow && !permissions.ataExternal2Show) {
                existing_type.external = 0;
                existing_type.internal = 1;
                existing_type.forecast = 1;
                //this.router.navigate([], {queryParams: {from: 'external'}})
            }
        }

        if(this.type == 'internal') {
            if (!permissions.ataInternalShow && !permissions.ataInternal2Show) {
                existing_type.external = 1;
                existing_type.internal = 0;
                existing_type.forecast = 1;
                //this.router.navigate([], {queryParams: {from: 'internal'}})
            }
        }

        if(this.type == 'forecast') {
            existing_type.external = 0;
            existing_type.internal = 0;
            existing_type.forecast = 1;
        }

        if(existing_type.external == 1) {
            this.setSelectedTab(0);
        }else if(existing_type.internal == 1) {
            this.setSelectedTab(1);
        }else if(existing_type.forecast == 1) {
            this.setSelectedTab(2);
        }
    }

    get existString() {
        if (((document.getElementById('searchAtaInput') as HTMLInputElement).value).length > 0)
            return true;
        else
            return false;
    }
}
