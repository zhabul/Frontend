import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AtaService } from 'src/app/core/services/ata.service';
import { UsersService } from 'src/app/core/services/users.service';
import { TranslateService } from '@ngx-translate/core';
import { ProjectsService } from 'src/app/core/services/projects.service';
import { GeneralsService } from 'src/app/core/services/generals.service';
import { DomSanitizer } from '@angular/platform-browser';
import { interval, Subscription } from 'rxjs';
import * as printJS from 'print-js';
import { environment } from 'src/environments/environment';
import { CronService } from 'src/app/core/services/cron.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { HttpEventType } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ImageModalComponent } from 'src/app/projects/components/image-modal/image-modal.component';
import { ImageModalUtility } from 'src/app/projects/components/image-modal/image-modal-utility.service';
import { Subject } from 'rxjs';
import { ConfirmationModalComponent } from 'src/app/shared/modals/confirmation-modal/confirmation-modal.component';
import { RikiService } from './riki.service';
import { InternalChatStore } from './internal-chat.service';
import { FileStorageService } from 'src/app/core/services/file-storage.service';
import { ConfirmModalComponent } from 'src/app/shared/modals/confirm-modal/confirm-modal.component';
import { AppComponent } from 'src/app/app.component';
import { take } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-edit-deviation',
  templateUrl: './edit-deviation.component.html',
  styleUrls: ['./edit-deviation.component.css', '../../../../utility/image-preview.css', '../../image-modal/image-modal.component.css'],
  providers: [ ImageModalUtility ]
})
export class EditDeviationComponent implements OnInit, OnDestroy {

  @ViewChild('blueTopNavText') blueTopNavText;
  @ViewChild('scrollContainer') scrollContainer;
  @ViewChild('articleCancelButton') articleCancelButton;
  public bluTopNavTextHeight:number = 15;
  public statusColor: any;
  public createForm: FormGroup;
  public ata: any;
  public client_workers: Promise<[]>;
  public project: any;
  public ata_messages: any;
  public selectedDeviation = 0;
  public disableEdit = false;
  public DeviationTypes: any[];
  public dropdownSettings: any;
  public userDetails: any = JSON.parse(sessionStorage.getItem("userDetails"));
  public contacts = [];
  public language = 'en';
  public files: any[] = [];
  public Urls: any[] = [];
  public images: any[] = [];
  public uploadMessage: any = "";
  public chooseFile = false;
  public showAttachmentImage = false;
  public currentAttachmentImage = null;
  public showPdfPreview = false;
  public AtaTypes = [];
  public getDebitForms = [];
  public ataType;
  public paymentType;
  public generalImage;
  public spinner = false;
  public disabledButton = true;
  public allowDelete = false;
  public showPdf: boolean = false;
  public currentAttachmentPdf = null;
  private subscription: Subscription;
  public ataId: any;
  public state: string = 'default';
  public rotateValue: number = 0;
  public selectedTab = 0;
  // public logs = []
  public logs: Record<string, any[]> = {};
  public editAta: boolean;
  public disabledInput: boolean;
  public counter = 0;
  public fullName: any;
  public type: any;
  public documents_server: any[] = [];
  public images_server: any[] = [];
  public pdf_documents: any[] = [];
  public wrapper: any;
  public viewer: any;
  public openPdf;
  public projectUserDetails: any;
  public sendDeviation: boolean = true;
  public allContacts = [];
  public mainContact;
  public allowChangeStatusAndUpdate: boolean = false;
  public reminderCheckbox = false;
  public avvikelseDeviation: any = false;
  public sendCopy:boolean = false;
  public ata_statuses:any[] = [];
  public buttonToggle = false;
  public buttonToggleDots = false;
  public buttonName = "";
  iconColor = "";
  iconName = "";
  updateDeviationSub: any;
  progress: number = 0;
  deletedDocumentsDeviation = [];
  public optionsDown;
  worker;
  public contentEditable = false;
  public activeCompanyWorkers: any[] = [];
  public file = null;
  public createDeviationSub;
  public ataTypeName ="";
  public threeDotsStatuses: any = {};
  public clientResponses = [];
  public internalDeviationChat = [];
  public previousDeviationClientResponses = [];
  public mainContactPerson = [];
  public nextDeviationExists = false;
  public statusChangable = false;
  public deviationTransformable = false;
  public sendDev = false;
  public printDev = false;
  public saveDev = false;
  public roleName = '';
  public createAtaType = 0;
  public desMenuToggle = true;
  public statusAndColor: any={
    color:'',
    StatusName:''
  };
  public projectSaveSubscription: Subscription;
  public setHeight = {
    'height' : 'calc(100vh - 132px - 0px)'
  };

  public sentBy = '';
  public lastVersion = false;
  generateSentBy() {
    const userDetails = JSON.parse(sessionStorage.getItem('userDetails'));
    const sentBy = `${userDetails.firstname} ${userDetails.lastname}`;
    this.sentBy = sentBy;
  }


  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private ataService: AtaService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private projectsService: ProjectsService,
    private generalsService: GeneralsService,
    private router: Router,
    public sanitizer: DomSanitizer,
    private usersService: UsersService,
    private cronService: CronService,
    private authService: AuthService,
    private dialog: MatDialog,
    private imageModalUtility: ImageModalUtility,
    private RikiService: RikiService,
    private internalChatStore: InternalChatStore,
    private fsService: FileStorageService,
    private appComponent: AppComponent,

    ) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

    currentPage: number = 1;
    totalPage: number = 1;

      /* IMAGE MODAL */

    infoObject = {};
    infoObjectAta = {
      content_type: "KS",
      content_id: null,
      type: "Ata",
      images: this.images,
      documents: this.pdf_documents,
      type_id: null
    };
    albums: any[] = [];

    $_clearFiles: Subject<void> = new Subject<void>();

    public swiper = {
      images: [],
      active: -1,
      album: -2,
      index: -1,
      parent: null
    };


    updateAlbumsAta(event) {
      this.albums = event;
    }

    getAlbumKeys() {

      let keys = [];

      if (this.ata_messages[this.selectedDeviation]) {
        const files = this.ata_messages[this.selectedDeviation]['files'];
        keys = Object.keys(files).sort(function(a, b) {
          return Number(b) - Number(a);
        });
      }

      return keys;
    }

    getAlbumFiles(albumKey, type) {
      const files = this.ata_messages[this.selectedDeviation]['files'][albumKey][type];
      return files;
    }

    getAlbumDescription(albumKey) {
      const description = this.ata_messages[this.selectedDeviation]['files'][albumKey]['description'];
      return description ? description : '';
    }

  /* IMAGE MODAL */

  rikiStateSub: any;
  rikiArticlesSub: any;

  rikiModalState = false;
  rikiArticles: any = {
    articlesAdditionalWork: [],
    articlesMaterial: [],
    articlesOther: []
  };


  ngOnDestroy() {
    this.unsubFromSubscription();
    this.unsubFromUpdateDeviation();
    this.unsubFromRikiState();
    this.unsubFromRikiArticles();
    this.unsubFromCreateDeviation();
    this.unsubFromChat();
    this.toggleBodyOverflow('auto');
  }

  unsubFromCreateDeviation() {
    if (this.createDeviationSub) {
      this.createDeviationSub.unsubscribe();
    }
  }

  unsubFromRikiArticles() {
    if (this.rikiArticlesSub) {
      this.rikiArticlesSub.unsubscribe();
    }
  }

  unsubFromRikiState() {

    if (this.rikiStateSub) {
      this.rikiStateSub.unsubscribe();
    }
  }

  unsubFromSubscription() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  unsubFromUpdateDeviation() {

    if (this.updateDeviationSub) {
      this.updateDeviationSub.unsubscribe();
    }
  }

  public messageSub;
  public showSend = false;

  toggleBodyOverflow(value) {
    document.body.style.overflow = value;
  }

  subToChatMessages() {

    this.messageSub = this.internalChatStore.messageStore$.subscribe((messages)=>{

      if (!messages.fetched) {
        return;
      }
      const data = messages.data;
      this.setShowSendBasedOnDeviationStatus();
      this.disableInputBasedOnClientResponses(data);
      this.setStatusToChangableBasedOnResponses(data);

    });

  }

  setShowSendBasedOnDeviationStatus() {
    const devAccepted = this.ata_messages[this.selectedDeviation].accepted;
    const accepted = devAccepted != -1;

    if (accepted) {
      this.showSend = false;
    }
  }

  disableInputBasedOnClientResponses(data) {
    const devAccepted = this.ata_messages[this.selectedDeviation].accepted;

    if (data.length && this.type === 'internal') {
      this.showSend = false;
      this.buttonToggle = false;
      this.jQueryDisableForm();
    } else if (!data.length && this.type === 'internal' && devAccepted === 3) {
      this.showSend = false;
    } else if (!data.length && this.type === 'external') {
      this.showSend = true;
    }
  }

  setStatusToChangableBasedOnResponses(data) {
    const lastMessage = data[data.length - 1];
    if (lastMessage
      && lastMessage.user_id == this.userDetails.user_id
      && this.ata_messages[this.selectedDeviation].accepted != 3
      && this.ata_messages[this.selectedDeviation].accepted != 2
      ) {
      this.statusChangable = true;
    }
  }

  unsubFromChat() {
    if (this.messageSub) {
      this.messageSub.unsubscribe();
    }
  }

  toggleRikiModal() {
    this.RikiService.toggleRikiModal(true);
  }

  ngOnInit() {

    this.toggleBodyOverflow('hidden');
    this.resetStatuses();
    this.rikiStateSub = this.RikiService.getModalState().subscribe((state)=>{
      this.rikiModalState = state;
    });
    this.rikiArticlesSub = this.RikiService.getArticlesSubject().subscribe((data)=>{
      this.rikiArticles = data;
    });
    this.language = sessionStorage.getItem('lang');
    this.translate.use(this.language);
    this.userDetails = JSON.parse(sessionStorage.getItem('userDetails'));
    this.roleName = sessionStorage.getItem('roleName');
    this.projectUserDetails = this.route.snapshot.data['projectUserDetails'];


    if (this.language == 'sw') {
      this.bluTopNavTextHeight = 40;
    }


    this.dropdownSettings = {
      singleSelection: false,
      idField: 'Id',
      textField: 'Name',
      selectAllText: this.translate.instant('Select All'),
      unSelectAllText: this.translate.instant('Unselect All'),
      itemsShowLimit: 0,
      allowSearchFilter: true,
      enableCheckAll: false,
      noDataAvailablePlaceholderText: this.translate.instant('No data available'),
      searchPlaceholderText: this.translate.instant('Search')
    };


    let access = this.route.snapshot.data["access"]["data"];
    if (access && access.edit)
      this.editAta = access.edit;

    let key = {
        key: "Logo",
    };

    this.generalsService.getSingleGeneralByKey(key).subscribe((res: any) => {
        this.generalImage = res["data"][0]["value"];
    });

    this.ata_messages = this.route.snapshot.data['ata_messages']['data'];
    this.project = this.route.snapshot.data['project'];

    this.route.queryParamMap.subscribe(params => {
      this.type = params.get('type') || null;
      this.openPdf = params.get('openPdf') || null;
      this.subToChatMessages();
      this.ensureRedirectIfHasNotPermissions();

      if(!this.userDetails.show_project_Deviation && !this.projectUserDetails) {
        this.router.navigate(["projects", "view", this.project.id]);
      }

      if(this.type == 'internal') {
          if(!this.userDetails.show_project_Internaldeviation && this.projectUserDetails.Deviation_Internal == 0) {
              this.router.navigate(["projects", "view", this.project.id]);
          }
      }

      if(this.type == 'external') {
          if(!this.userDetails.show_project_Externaldeviation && this.projectUserDetails.Deviation_External == 0) {
              this.router.navigate(["projects", "view", this.project.id]);
          }
      }
    });

    this.activeCompanyWorkers = this.route.snapshot.data['active_company_workers'];
    this.resolveMyseteriousIfCondition();
    this.getFilteredAtaStatuses();
    if (this.ata.AtaTable == "ata_become_external")
      this.editAta = false;

    if (this.editAta)
      this.disabledInput = !this.editAta;

    this.client_workers = this.projectsService.getAttestClientWorkers(this.project.id);
    this.client_workers.then((res) => {
      this.mainContact = res[res.length - 1]
      res.forEach((con) => {
        this.allContacts.push(con);
      });
    });
    this.ataId = this.route.params["value"]["ata_id"];

    this.selectDeviation(this.ata_messages.length - 1);

    // this.ataService.getEmailLogsForDeviation(this.ata_messages[this.selectedDeviation].id. this.project.id).subscribe(res => {
    //   if (res['status']) {
    //     this.logs = res['data'];
    //   }
    // });

    this.EmailLogFunction();

    const source = interval(5000);
    if (environment.production) {
      this.subscription = source.subscribe(
        (val) => {
          this.getUserPermission();
        }
      );
    }

    this.ataService.getTypeAtas().subscribe(types => {
      this.AtaTypes = types['data'];
      this.projectsService.getDebitFormForAta(this.project.debit_Id, true).then(res => {
        this.getDebitForms = res['data'];
      });
    });

    this.DeviationTypes = this.route.snapshot.data['type_deviations'];

    this.createForm = this.fb.group({
      Title: [this.ata_messages[this.selectedDeviation].Title, [Validators.required, Validators.maxLength(50)]],
      DeviationType: [this.ata_messages[this.selectedDeviation].Type, [Validators.required]],
      StartDate: [this.ata_messages[this.selectedDeviation].StartDate, [Validators.required]],
      DueDate: [this.ata_messages[this.selectedDeviation].DueDate, [Validators.required]],
      Description: this.ata_messages[this.selectedDeviation].Description,
      Reason: this.ata_messages[this.selectedDeviation].Reason,
      Suggestion: this.ata_messages[this.selectedDeviation].Suggestion,
      street: this.project.clientStreet,
      zip: this.project.clientZip,
      city: this.project.clientCity,
      AuthorName: this.ata_messages[this.selectedDeviation].AuthorName,
      clientName: this.project.clientName,
      Url: this.ata_messages[this.selectedDeviation].Url,
      State: [this.ata_messages[this.selectedDeviation].State, [Validators.required]],
      ClientAnswer: [this.ata_messages[this.selectedDeviation].ClientAnswer],
      Answer: [this.ata_messages[this.selectedDeviation].Answer],
      sentBy: [this.ata_messages[this.selectedDeviation].sentBy],
      Question: [this.ata_messages[this.selectedDeviation].Question],
      Sender: [this.ata_messages[this.selectedDeviation].Sender],
      Time: [this.ata_messages[this.selectedDeviation].Time],
      accepted: [this.ata_messages[this.selectedDeviation].accepted],
      DeviationPaymentType: [this.ata.PaymentType],
      clientResponses: this.fb.array(this.ata_messages[this.selectedDeviation].clientResponses),
      timesEmailSent: [this.ata_messages[this.selectedDeviation].timesEmailSent],
      timesReminderSent: this.ata_messages[this.selectedDeviation].timesReminderSent,
      external: [this.ata.external],
      type: [this.ata.Type],
      Status: [this.ata.Status],
      email_log_date: [this.ata_messages[this.selectedDeviation].email_log_date],
      client_worker: [this.ata_messages[this.selectedDeviation].client_worker]
    });

    this.checkIfImageBelongsToDeviation();
    this.openPdf == 'true' ? this.showPdfPreview = true : null;
    this.avvikelseDeviation = this.ata.AvvikelseDeviation == 1;
    this.setColorBasedOnStatus();

    this.checkStatus();

    document.querySelector(".container-pdf-preview").addEventListener("scroll", () => {
      this.updateCurrentPageDeviationPdfPreview();
    });
  }

  afterViewCalendarInit() {

    const datepickerOptions = {
      format: 'yyyy-mm-dd',
      calendarWeeks: true,
      autoclose: true,
      language: this.language,
      todayHighlight: true,
      currentWeek: true,
      currentWeekTransl: this.language === 'en' ? 'Week' : 'Vecka',
      currentWeekSplitChar: '-',
      weekStart: 1
    };

    $('#startDate').datepicker(datepickerOptions)
      .on('changeDate', (ev) => {
        if (Date.parse(ev.target.value.split(' ')[0]) > Date.parse(this.createForm.value.DueDate.split(' ')[0])) {
          setTimeout(() => {
            this.toastr.info(this.translate.instant('Start date cannot be after end date.'), this.translate.instant('Info'));
            ev.target.value = this.createForm.value.StartDate;
          }, 0);
        } else {
          this.createForm.get('StartDate').patchValue(ev.target.value);
        }
      }).on('blur', (e) => {
        e.target.value = this.createForm.value.StartDate;
      });

    $('#dueDate').datepicker(datepickerOptions)
      .on('changeDate', (ev) => {
        if (Date.parse(ev.target.value.split(' ')[0]) < Date.parse(this.createForm.value.StartDate.split(' ')[0])) {
          setTimeout(() => {
            this.toastr.info(this.translate.instant('Due date cannot be before start date.'), this.translate.instant('Info'));
            ev.target.value = this.createForm.value.DueDate;
          }, 0);
        } else {
          this.createForm.get('DueDate').patchValue(ev.target.value);
        }
      }).on('blur', (e) => {
        e.target.value = this.createForm.value.DueDate;
      });

    if (this.createForm.value.StartDate) {
      $('#startDate').datepicker('setDate', this.createForm.value.StartDate.split(' ')[0]);
    }
    if (this.createForm.value.DueDate) {
      $('#dueDate').datepicker('setDate', this.createForm.value.DueDate.split(' ')[0]);
    }
  }

  getPaymentType() {
    return this.createForm.controls['DeviationPaymentType'].value;
  }

  selectDeviation(index) {
    this.selectedDeviation = index;
    if (this.createForm) {
      this.changeSelectedDeviation(index);
    }
    setTimeout(()=>{
      this.jQueryDisableInputs();
    }, 100);
    this.filterClientResponses2();
    this.setPreviousDeviationClientResponses();
    this.checkIfNextDeviationExists();
    this.canChangeDeviationStatus();
    this.setColorBasedOnStatus();
    this.disableOlderVersion(index);
  }

  filterClientResponses2() {
    this.clientResponses = this.ata_messages[this.selectedDeviation].clientResponses.filter((cliRes)=>{
      return cliRes.active != '1';
    });

    this.clientResponses = this.clientResponses.filter((cliRes)=>{
      return (cliRes.Status == 1 && cliRes.client_message != null) || cliRes.Status != 1;
    });

    this.mainContactPerson = this.ata_messages[this.selectedDeviation].clientResponses.filter((cliRes)=>{
      return cliRes.Status == 1;
    });
  }

  canChangeDeviationStatus() {

    const selectedDeviation = this.ata_messages[this.selectedDeviation];
    const accepted = selectedDeviation.accepted;
    const hasStatus9 = this.clientResponses.some(response => response.Status === "9");
    const deviationStatusCondition = accepted != 3 && accepted != 2 && accepted != 9 && !hasStatus9;
    const BecomeAtaFromDeviation = Number(this.ata.AtaNumber);
    const userId = this.userDetails.user_id;
    const createDeviation = this.userDetails.create_project_Deviation;
    const externalCondition = createDeviation == 1;

    this.statusChangable = (externalCondition || selectedDeviation.Author == userId || this.roleName == 'Administrator') &&
    ((deviationStatusCondition) && !this.nextDeviationExists);


    this.deviationTransformable = (BecomeAtaFromDeviation == 0 || BecomeAtaFromDeviation == undefined || BecomeAtaFromDeviation == null) && (accepted == 2 || accepted == 9 || hasStatus9) && !this.nextDeviationExists;

    this.isAtaTransformableBasedOnRelations();
    this.ataTypeforView(this.ata);

  }

  isAtaTransformableBasedOnRelations() {
    if (this.ata.ata_relations && !this.ata.ata_relations.length) return;
    const lastRelation = this.ata.ata_relations[this.ata.ata_relations.length - 1];
    if (this.type === 'internal' && lastRelation.link.includes('ata')) {
      this.deviationTransformable = false;
    }
    if (this.type === 'internal' && !lastRelation.link.includes('deviation')) return;
    if (this.type === 'external' && !lastRelation.link.includes('ata')) return;
    this.deviationTransformable = false;
  }

  ataTypeforView(ata){
    if(ata.Type == "1"){
      this.ataTypeName = "External Deviation";
    }
    else {
     this.ataTypeName = "Internal Deviation";
    }
    return this.ataTypeName;
  }

  checkIfNextDeviationExists() {
    if (this.ata_messages[this.selectedDeviation + 1]) {
      this.nextDeviationExists = true;
      return;
    }
    this.nextDeviationExists = false;
  }

  setPreviousDeviationClientResponses() {
    if (this.ata_messages[this.selectedDeviation - 1]) {
      this.previousDeviationClientResponses = this.ata_messages[this.selectedDeviation - 1].clientResponses.filter((cliRes)=>{
        return cliRes.Status != 1;
      });
      return;
    }
    this.previousDeviationClientResponses = [];
  }

  selectedDeviationStyle(index) {

    if (index == this.selectedDeviation) {
      return { color: "var(--brand-color)", zIndex: 2000 };
    }

    return {};
  }

  resolveMyseteriousIfCondition() {

    if (!this.type) {
      this.type = this.route.snapshot.data['ata']['data'].Type == 1 ? 'external' : 'internal';
      this.ensureRedirectIfHasNotPermissions();
    }
    //sta se ovdje dogodilo?
    this.ata = this.route.snapshot.data['ata']['data'];

    this.checkIfDeviationIsRemovable(this.ata);
    //if (this.type && this.type == "external") {

      //this.ata = this.route.snapshot.data['ata']['data'];
      // this.ataService.getAta(route.params.ata_id).subscribe(ata => ata);

    //} else if (this.type && this.type === 'internal') {

      //this.ata = this.route.snapshot.data['internalAtas']['data'][0];
      // this.ataService.getInternalAtaAndSubatas(route.params.ata_id, this.project.id).subscribe(atas => atas);
    //}
  }

  setColorBasedOnStatus() {

    if (!this.ata_messages[this.selectedDeviation]) {return};
    this.statusColor = this.ata_messages[this.selectedDeviation].accepted;
    this.setStatusInternal();
  }

  AnswerToClient  = [

    {Status: "0",
    answerDate: "2021-07-06  08:59:15",
    answerEmail: "goran@cmax.se",
    attachment: "https://wemax.se/file/8B4741FA02F36F648F2D6E49A13E1E9489796D15",
    client_message: "Kao neki odgovor kljentu",
    file_path: "https://wemax.se/file/8B4741FA02F36F648F2D6E49A13E1E9489796D15",
    image_path: null,
    manualReply: "0" }

      ];


  ngAfterViewInit() {

    this.jQueryDisableInputs();
    setTimeout(()=>{
      this.afterViewCalendarInit();
    }, 500);
  }

  jQueryDisableForm() {
    $(`input:not(#send-copy-checkbox, #reminder-checkbox, #deviation, #image, #document, .article_modal, .toggle-delete-input), select, option, textarea:not(#clientMessage)`,
    '#createForm').prop('disabled', true);
    $(`select:not(#typedev),
    option:not(#optiondev0, #optiondev1, #optiondev2, #optiondev3, #option_dev4)`, '#createForm').prop('disabled', true);
  }

  jQueryDisableInputs() {
    const status = this.ata_messages[this.selectedDeviation].accepted;

    const accepted = status != -1 && status != 4;

    $(`input:not(#send-copy-checkbox, #reminder-checkbox, #deviation, #image, #document, .article_modal, .toggle-delete-input), select, option, textarea:not(#clientMessage)`,
    '#createForm').prop('disabled',
    this.ata_messages[this.selectedDeviation].EmailSent == '1' ||
    accepted

    );

    $(`select:not(#typedev),
    option:not(#optiondev0, #optiondev1, #optiondev2, #optiondev3, #option_dev4)`, '#createForm').prop('disabled',
    (
      accepted
      ));

      this.shouldShowSendButton(accepted);

    if (this.clientResponses.length) {
      const lastCliRes = this.clientResponses[this.clientResponses.length - 1];
      const lastCliStatus = lastCliRes.Status == 1;
      const internalCondition = this.type === 'internal' ? lastCliRes.Status == 2 || lastCliRes.Status == 3 : false;
      const accepted = lastCliStatus || internalCondition;
      this.shouldShowSendButton(accepted);

    }
  }

  shouldShowSendButton(accepted) {
    if (accepted) {
      this.showSend = false;
      return;
    }
    this.showSend = true;
  }

  getFilteredAtaStatuses() {
    this.ataService.getFilteredAtaStatuses(this.ata.Status, 'deviation',0,this.project.id).subscribe((res)=> {
      if(res['status']) {
        this.ata_statuses = res['data'];
        if (this.ata.Status == 0) {

          this.ata_statuses = this.ata_statuses.filter((ata_)=>{
            return ata_.Status == '0'
          });
        }
      }
    });
  }



  checkIfArticlesIncludeItems() {

    const articlesKeys = Object.keys(this.rikiArticles);
    let flag = false;

    for (let i = 0; i < articlesKeys.length; i++) {

      const key = articlesKeys[i];
      const length = this.rikiArticles[key].length;

      if (length > 0) {
        flag = true;
        break;
      }
    }
    return flag;
  }

  shouldAcceptStatus() {
    const keys = Object.keys(this.threeDotsStatuses);
    let flag = false;
    for (let key of keys) {
      if (this.threeDotsStatuses[key]) {
        this.runStatusFunction(key);
        flag = true;
      }
    }
    return flag;
  }

  manuallyAbortDeviation() {
		const diaolgConfig = new MatDialogConfig();
		diaolgConfig.autoFocus = false;
		diaolgConfig.disableClose = true;
		diaolgConfig.width = "";
        diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().subscribe((response)=>{
      if (response.result) {
          this.manuallyAbortDeviationCall();
          this.disableEdit = true;
      }
    });
  }

  manuallyRejectDeviation() {
		const diaolgConfig = new MatDialogConfig();
		diaolgConfig.autoFocus = false;
		diaolgConfig.disableClose = true;
		diaolgConfig.width = "";
        diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().subscribe((response)=>{
      if (response.result) {
          this.manuallyRejectDeviationCall();
          this.disableEdit = true;
      }
    });
  }

  manuallyAbortDeviationCall() {

    const messageId = this.ata_messages[this.selectedDeviation].id;
    const ataId = this.ata_messages[this.selectedDeviation].AtaID;

    this.ataService.manuallyAbortDeviation(messageId, ataId, this.project.id).subscribe(res => {
      if (res['status']) {

        this.toastr.success(this.translate.instant('Successfully declined deviation!'), this.translate.instant('Success'));
        this.answerToClient = {};
        this.addAnswerToClient({ files: [], status: 3 });
        this.answerToClient = null;
        this.ata_messages[this.selectedDeviation].accepted = 3;
        this.createForm.get('Status').patchValue(3);
        this.createForm.get('accepted').patchValue(3);
        this.ata.Status = 3;
        this.createForm.get('Status').patchValue(3);
        this.getFilteredAtaStatuses();
        this.updateDeviation(false, false, false);
        this.resetStatuses();
        this.optionsDownDiv();
        this.canChangeDeviationStatus();
        this.setColorBasedOnStatus();
        this.jQueryDisableInputs();
        this.setShowSendOnDeviationReject();
        this.buttonToggleDots = false;
        this.threeDotsLeave();

      } else {
        this.toastr.error(this.translate.instant('There was an error while declining deviation!'), this.translate.instant('Error'));
      }
    });
  }

  manuallyRejectDeviationCall() {

    const messageId = this.ata_messages[this.selectedDeviation].id;
    const ataId = this.ata_messages[this.selectedDeviation].AtaID;

    this.ataService.manuallyRejectDeviation(messageId, ataId, this.project.id).subscribe(res => {
      if (res['status']) {

        this.toastr.success(this.translate.instant('Successfully declined deviation!'), this.translate.instant('Success'));
        this.answerToClient = {};
        this.addAnswerToClient({ files: [], status: 3 });
        this.answerToClient = null;
        this.ata_messages[this.selectedDeviation].accepted = 3;
        this.createForm.get('Status').patchValue(3);
        this.createForm.get('accepted').patchValue(3);
        this.ata.Status = 3;
        this.createForm.get('Status').patchValue(3);
        this.getFilteredAtaStatuses();
        this.updateDeviation(false, false, false);
        this.resetStatuses();
        this.optionsDownDiv();
        this.canChangeDeviationStatus();
        this.setColorBasedOnStatus();
        this.jQueryDisableInputs();
        this.setShowSendOnDeviationReject();
        this.buttonToggleDots = false;
        this.threeDotsLeave();

      } else {
        this.toastr.error(this.translate.instant('There was an error while declining deviation!'), this.translate.instant('Error'));
      }
    });
  }

  setShowSendOnDeviationReject() {
    if (this.type === 'internal') {
      this.showSend = false;
    }
  }

  resolveMysteriousIfConditionAfterRevision() {

    this.spinner = true;
    this.progress = 50;
    if (this.type && this.type == "external") {

      this.ataService.getAta(this.ataId).subscribe((res: { status: boolean; data: any; }) => {
        this.ata = res.data;
        this.spinner = false;
        this.progress = 100;
        this.getFilteredAtaStatuses();
        this.setColorBasedOnStatus();
      });
    } else if (this.type && this.type === 'internal') {

      this.ataService.getInternalAtaAndSubatas(this.ataId, this.project.id, "deviation").subscribe((res: { status: boolean; data: any; }) => {

        this.ata = res['data'][0];
        this.selectDeviation(this.ata_messages.length - 1);
        this.spinner = false;
        this.getFilteredAtaStatuses();
        this.setColorBasedOnStatus();
      });
    }
  }

  getInputLength(type) {

    if (this.createForm.get(type) && this.createForm.get(type).value) {
      return this.createForm.get(type).value.length
    }
    return 0;
  }

  getMessagesAfterRevision() {
    this.spinner = true;
    this.progress = 50;
    this.ataService.getMessages(this.ata.ATAID).subscribe((res: { status: boolean; data: any; }) =>
    {
      this.ata_messages = [];
      this.ata_messages = res.data;
      this.selectDeviation(this.ata_messages.length - 1);
      this.progress = 100;
      this.spinner = false;
      this.resolveMysteriousIfConditionAfterRevision();
      this.resetStatuses();
      this.optionsDownDiv();
      this.canChangeDeviationStatus();
      this.ata_messages[this.selectedDeviation].accepted = -1;
      this.ata.Status = 0;
      this.setColorBasedOnStatus();
    });
  }

  manuallyRevisionDeviation() {
		const diaolgConfig = new MatDialogConfig();
		diaolgConfig.autoFocus = false;
		diaolgConfig.disableClose = true;
		diaolgConfig.width = "";
        diaolgConfig.panelClass = "mat-dialog-confirmation";
        const messageId = Number(this.ata_messages[this.selectedDeviation].id);
        const ataId = Number(this.ata_messages[this.selectedDeviation].AtaID);

        const data = {
        CwId: null,
        ataID: ataId,
        description: 'Manual revision.',
        email: this.userDetails.email,
        mainContactEmail:this.userDetails.email,
        file: {},
        group: '',
        question: 'Manual revision.',
        status: 'question',
        token: '',
        reminder: 0,
        isMainContact: false,
        messageID: messageId
        };

    this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().subscribe((response)=>{
      if (response.result) {
        this.spinner = true;
        this.progress = 50;
        this.ataService.manuallyCreateRevisionDeviation(data).subscribe(res => {
          if (res['status']) {

            this.toastr.success(this.translate.instant('Successfully created deviation revision!'), this.translate.instant('Success'));
            this.progress = 100;
            this.spinner = false;
            this.getAta();
            this.getMessagesAfterRevision();
            this.buttonToggleDots = false;
            this.threeDotsLeave();
            this.disableEdit = false;
          } else {
            this.toastr.error(this.translate.instant('There was an error while revisioning deviation!'), this.translate.instant('Error'));
          }
        });

      }
    });
  }

  manuallyAcceptDeviation() {
		const diaolgConfig = new MatDialogConfig();
		diaolgConfig.autoFocus = false;
		diaolgConfig.disableClose = true;
		diaolgConfig.width = "";
        diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().subscribe((response)=>{
      if (response.result) {
        this.manuallyAcceptDeviationCall();
        this.disableEdit = true;
      }
    });
  }

  manuallyAcceptDeviationCall() {

    const messageId = this.ata_messages[this.selectedDeviation].id;
    const ataId = this.ata_messages[this.selectedDeviation].AtaID;

    this.ataService.manuallyAcceptDeviation(messageId, ataId, this.project.id).subscribe(res => {
      if (res['status']) {

        this.toastr.success(this.translate.instant('Successfully accepted deviation!'), this.translate.instant('Success'));
        this.answerToClient = {};
        this.addAnswerToClient({ files: [], status: 2 });
        this.answerToClient = null;
        this.ata_messages[this.selectedDeviation].accepted = 2;
        this.createForm.get('Status').patchValue(2);
        this.createForm.get('accepted').patchValue(2);
        this.ata.Status = 2;
        this.jQueryDisableInputs();
        this.getFilteredAtaStatuses();
        this.updateDeviation(false, false, false);
        this.setColorBasedOnStatus();
        this.resetStatuses();
        this.optionsDownDiv();
        this.canChangeDeviationStatus();
        this.buttonToggleDots = false;
        this.threeDotsLeave();

      } else {
        this.toastr.error(this.translate.instant('There was an error while accepting deviation!'), this.translate.instant('Error'));
      }
    });
  }

  async updateDeviation(toastrMessage, update_pdf_client, checkStatus) {

    this.createForm.markAsPristine();

    if(this.selectedDeviation !== this.ata_messages.length-1 && this.printDev == false){
      return;
    }

    if (checkStatus === true && this.shouldAcceptStatus() ) {
      return;
    }

    if (this.createForm.invalid) {
      return
    };

    this.disabledButton = false;
    this.spinner = true;
    this.progress = 50;
    this.sendDeviation = false;
    const data = this.createForm.value;
    let external = 0;

    if (this.type == "external")
      external = 1;

    let first_worker = null

    if(update_pdf_client) {
      first_worker = this.contacts[0].Name;
    }


    const albumFiles = this.imageModalUtility.getAlbumFiles(this.albums);

    const _newAlbumFiles = await this.fsService.mergeFilesAndAlbums(albumFiles);

    if(_newAlbumFiles != null) {
        albumFiles.images = _newAlbumFiles.images;
        albumFiles.pdfs = _newAlbumFiles.pdfs;
    }

    const clientFiles = this.answerToClient && this.answerToClient.files ? this.answerToClient.files : [];

    const answerToClient_ = await this.fsService.mergeFilesAndAlbums(clientFiles);

    if(answerToClient_ != null) {
       this.answerToClient.files = answerToClient_;
    }

    const files = this.ata_messages[this.selectedDeviation]['files'];
    const ataServerFiles = this.imageModalUtility.getAlbumFiles(files);

    const newFiles = albumFiles.images.concat(albumFiles.pdfs);
    const serverFiles = ataServerFiles.images.concat(ataServerFiles.pdfs);

    const attachments = serverFiles.concat(newFiles);

    const fullname = this.sendCopy === true ? data.AuthorName : this.userDetails.firstname + ' ' + this.userDetails.lastname;

    const deviation:any = {

      id: this.ata_messages[this.selectedDeviation].id,
      pdf_image_url: this.ata_messages[this.selectedDeviation].PDFImageUrl,
      AtaNumber: this.ata_messages[this.selectedDeviation].AtaNumber,
      AtaId: this.ata.ATAID,
      Title: data.Title,
      DeviationType: data.DeviationType,
      StartDate: data.StartDate,
      DueDate: data.DueDate,
      Description: data.Description,
      Reason: data.Reason,
      Suggestion: data.Suggestion,
      zip: data.zip,
      street: data.street,
      city: data.city,
      clientName: data.clientName,
      Url: data.Url,
      Client: data.Client,
      State: data.State,
      ProjectID: this.project.id,
      attachments: attachments,
      external: external,
      ataStatus: data.Status,
      timesReminderSent: this.reminderCheckbox ? Number(this.ata_messages[this.selectedDeviation].timesReminderSent) + 1 : this.ata_messages[this.selectedDeviation].timesReminderSent,
      sendReminder: this.reminderCheckbox ? true : false,
      email_log_date: this.ata_messages[this.selectedDeviation]['email_log_date'],
      first_worker: first_worker,
      sendCopy: this.sendCopy,
      fullname: fullname,
      answerToClient: this.answerToClient,
      sendDev: this.sendDev,
      saveDev: this.saveDev,
      printDev: this.printDev,
      sentBy: this.sentBy,
      mainContactEmail: this.mainContact.email
    };

    if (this.ata_messages[this.selectedDeviation].sendingMail) {
      deviation.sendingMail = true;
    };

    this.ata_messages[this.selectedDeviation].sendingMail = true;

    this.updateDeviationSub = this.ataService.updateDeviation(deviation).subscribe(

      (res:any)=>{
        this.sentBy = '';
        if (res.type === HttpEventType.Response) {

          this.progress = 100;
          this.ataService.getMessages(this.ata.ATAID).subscribe(res2 => {
            this.ata_messages = res2['data'];
            this.checkIfImageBelongsToDeviation();
            this.spinner = false;
            this.ata.Status = data.Status
            this.sendDeviation = true;
            this.allowChangeStatusAndUpdate = false;
            if (toastrMessage) {
              this.toastr.success(this.translate.instant('You have successfully updated deviation!'), this.translate.instant('Success'));
              this.disabledButton = true;
            }
            this.$_clearFiles.next();
            this.albums = [];
            this.files = [];
            this.uploadMessage = '';
            this.images = [];
            this.pdf_documents = [];
            this.deletedDocumentsDeviation = [];
            this.progress = 0;
            this.getFilteredAtaStatuses();
            this.setColorBasedOnStatus();

            if (this.sendDev === true) {
              res.body.status = 6;
              this.addAnswerToClient(res.body);
              this.sendDeviationFunc();
            }

            this.jQueryDisableInputs();
            this.printUpdatedDeviation();
            this.saveUpdatedDeviation();

          });
        }

        if (res.type === HttpEventType.UploadProgress) {
          let percentDone = Math.round(100 * res.loaded / res.total);
          if (percentDone === 100) {
            percentDone = percentDone - 50;
          }

          this.progress = percentDone;
        }
      }
    );
  }

  saveUpdatedDeviation() {
    if (this.saveDev === true) {
      this.download_pdf();
     }
  }

  printUpdatedDeviation() {
    if (this.printDev === true) {
      printJS(this.ata_messages[this.selectedDeviation].PDFUrl);
      this.printDev = false;
    }
  }

  async EmailLogFunction() {
    function formatDateTime(dateTimeStr) {
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

    try {
      // const globalProjectFiles = this.ata_messages[0].attachments || []; // Koristimo prvi ataMessage za globalne fajlove projekta
      this.logs = {};
      const responses = await Promise.all(
        this.ata_messages.map(async (ataMessage) => {
          const res = await this.ataService.getEmailLogsForDeviation(ataMessage.id, this.project.id).toPromise();
          return { ataMessage, res };
        })
      );

      responses.reverse().forEach(({ ataMessage, res }) => {
        if (res.status) {
          const items = res.data;

          items.forEach((item) => {
            const logName = item.logName;

            if (!this.logs[logName]) {
              this.logs[logName] = [];
            }

            this.logs[logName].push({
              Status: item.Status,
              StatusName: item.StatusName,
              active: item.active,
              Date: item.Date ? formatDateTime(item.Date) : null,
              answerEmail: item.To,
              answerDate: item.Responded ? formatDateTime(item.Responded) : null,
              openDate: item.Opened ? formatDateTime(item.Opened) : null,
              group: item.Group,
              sentFrom: item.From,
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
        }
      });
    } catch (error) {
      console.error('Greška prilikom dohvaćanja podataka:', error);
    }
  }


  changeSelectedDeviation(index) {
    this.selectedDeviation = index;
    this.checkIfImageBelongsToDeviation();
    this.createForm.patchValue({
      id: this.ata_messages[this.selectedDeviation].id,
      Title: this.ata_messages[this.selectedDeviation].Title,
      DeviationType: this.ata_messages[this.selectedDeviation].Type,
      StartDate: this.ata_messages[this.selectedDeviation].StartDate,
      DoneDate: this.ata_messages[this.selectedDeviation].Date,
      Description: this.ata_messages[this.selectedDeviation].Description,
      Reason: this.ata_messages[this.selectedDeviation].Reason,
      Suggestion: this.ata_messages[this.selectedDeviation].Suggestion,
      Url: this.ata_messages[this.selectedDeviation].Url,
      Client: this.ata_messages[this.selectedDeviation].Client,
      State: this.ata_messages[this.selectedDeviation].State,
      sentBy: this.ata_messages[this.selectedDeviation].sentBy,
      ClientAnswer: this.ata_messages[this.selectedDeviation].ClientAnswer,
      Answer: this.ata_messages[this.selectedDeviation].Answer,
      Question: this.ata_messages[this.selectedDeviation].Question,
      Sender: this.ata_messages[this.selectedDeviation].Sender,
      Time: this.ata_messages[this.selectedDeviation].Time,
      accepted: this.ata_messages[this.selectedDeviation].accepted,
      timesEmailSent: this.ata_messages[this.selectedDeviation].timesEmailSent,
      timesReminderSent: this.ata_messages[this.selectedDeviation].timesReminderSent,
      email_log_date: this.ata_messages[this.selectedDeviation].email_log_date,
      client_worker: this.ata_messages[this.selectedDeviation].client_worker
    });

    this.images = [];
    this.pdf_documents = [];
    this.files = [];

    const clientResponses = this.createForm.get('clientResponses') as FormArray;

    while (clientResponses.length !== 0) {
      clientResponses.removeAt(0)
    }

    this.ata_messages[this.selectedDeviation].clientResponses.forEach(cr => {
      clientResponses.push(this.fb.group(cr));
    });

    // this.ataService.getEmailLogsForDeviation(this.ata_messages[this.selectedDeviation].id, this.project.id).subscribe(res => {
    //   if (res['status']) {
    //     this.logs = res['data'];
    //   }
    // })


    this.EmailLogFunction();

    this.jQueryDisableInputs();
    this.getFilteredAtaStatuses();
    this.setColorBasedOnStatus();
  }

  sortContacts() {
      let contact_pom = [];
      this.allContacts.forEach((client_worker, i)=>{

        let cont = this.contacts.find((contact) => contact.Id == client_worker.Id);
        if(cont) {
          let obj = {
            'Id': client_worker.Id,
            'Name': client_worker.Name,
          }
          contact_pom.push(obj);
        }
      });

      if(contact_pom.length > 0)
          this.contacts = contact_pom;
  }

  setSendButtonStyle() {

    return {
      justifyContent: 'center',
      backgroundColor: this.contacts.length ? 'var(--brand-color)' : 'white',
      padding: '0px'
    }
  }


  sendDeviationByType() {

    if (this.type === 'internal') {
      this.internalChatStore.nextMessage(this.contacts[0]);
      return;
    }

    if (this.selectedDeviation !== this.ata_messages.length - 1) {
      this.agreeToSendDeviation();
      return;
    }

    this.sendDeviationEmail();
  }

  agreeToSendDeviation() {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().subscribe(async(response)=>{
      if (response.result) {
        await this.updateDeviation(false, true, false);
        this.sendDeviationFunc();
        this.resetSendDropdown();
      }
    });
  }

  public answerToClient = null;

  respondToDeviation(event) {
    this.createContactList();
    this.setAnswerToClient(event);
    this.sendDeviationEmail();
  }

  setAnswerToClient(event) {
    event.clientEmail = this.contacts[0].email;
    event.projectId = this.project.id;
    this.answerToClient = event;
  }

  createContactList() {
    this.contacts = [];
    const firstContact = this.searchForContactData(this.clientResponses[this.clientResponses.length -1]);
    const secondContact = this.searchForContactData(this.mainContactPerson[this.mainContactPerson.length - 1]);
    this.contacts.push(firstContact);
    this.checkIfContacsAreEqual(firstContact, secondContact);
  }

  checkIfContacsAreEqual(firstContact, secondContact) {
    if (firstContact && secondContact && firstContact.email !== secondContact.email) {
      this.contacts.push(secondContact);
    }
  }

  searchForContactData(person) {
    const answerEmail = person ? person.answerEmail.trim() : '';
    return this.allContacts.find((contact)=>{
      return contact.email.trim() == answerEmail;
    });
  }

  setSendCopy() {
    const hasStatus9 = this.clientResponses.some(response => response.Status === "9");

    if (hasStatus9 || this.ata_messages[this.selectedDeviation].accepted == 3 || this.ata_messages[this.selectedDeviation].accepted == 2 || this.ata_messages[this.selectedDeviation].accepted == 1) {
      this.sendCopy = true;
    }else {
      this.sendCopy = false;
    }
  }

  sendDeviationEmail() {
    this.sortContacts();
    this.setSendCopy();

    this.sendDeviation = false;

    if (this.contacts.length < 1) {
      return this.toastr.info(this.translate.instant('You first need to select an email where to send deviation') + '.', this.translate.instant('Info'));
    }

    if (!this.sendCopy && this.contacts.length > 2) {
      return this.toastr.info(this.translate.instant('Select maximum of 2 contacts to send deviation.'), this.translate.instant('Info'));
    }

    if (!this.sendCopy && (this.contacts.length >= 1) && !(this.contacts.some((contact) => (contact.Id == this.mainContact.Id) && (contact.Name == this.mainContact.Name)))) {
      return this.toastr.info(this.translate.instant('TSC_main_contact_email_has_to_be_selected'), this.translate.instant('Info'));
    }

    let emails = '';

    this.contacts.forEach((rp, index)=>{

      this.allContacts.forEach((cw) => {
          if (rp.Id == cw.Id) {
            emails = emails + (cw.email ? cw.email : cw.Name) + (index === this.contacts.length - 1 ? '' : ', ');
          }
      });
    });

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.data = { questionText: this.translate.instant('Are you sure you want to send email to: ') + emails + '?' };
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().subscribe((response)=>{
      if (response.result) {

        let status = this.createForm.get('Status').value;//.patchValue(status);

        if(status == 0 || status == 1 || status == "" || !status || status == 9) {
          this.createForm.get('Status').patchValue(4);
          this.createForm.get('accepted').patchValue(4);
          status = 4;
        }

        this.ata_messages[this.selectedDeviation].sendingMail = true;
        this.sendDev = true;
        this.generateSentBy();

        this.updateDeviation(false, true, false);
        this.allContacts.forEach(item => {
          item.checked = false;
        });

          this.disableEdit = true;
      } else {
          this.sendDeviation = true;
      }
    });

  }

  sendDeviationFunc() {
    this.setSendCopy();
    this.spinner = true;
    this.progress = 50;
    this.ataService.sendDeviationEmail(this.ata_messages[this.selectedDeviation].id,
      {
        contacts: this.contacts,
        ...this.createForm.value,
        Url: this.Urls,
        ProjectCustomName: this.project.CustomName,
        ParentAta: this.ata.ATAID,
        DeviationNumber: this.ata_messages[this.selectedDeviation].AtaNumber,
        AtaNumber: this.ata_messages[this.selectedDeviation].AtaNumber,
        id: this.ata_messages[this.selectedDeviation].id,
        sendReminder: this.reminderCheckbox ? true : false,
        sendCopy: this.sendCopy,
        ProjectName: this.project.name,
        ProjectID: this.project.id,
        rpid: this.project.rpid,
      }
    ).subscribe((res:any) => {

      if(res['status']) {

        this.sendDev = false;
        this.spinner = false;
        this.progress = 100;
        this.ata_messages[this.selectedDeviation].EmailSent = 1;

        $('input:not(#reminder-checkbox, #image, #document, .toggle-delete-input), select, option, textarea', '#createForm').prop('disabled', true);
        this.toastr.success(this.translate.instant('You have successfully sent email!'), this.translate.instant('Success'));
        this.spinner = false;
        this.sendDeviation = true;
        this.contacts = [];
        this.setDeviationStatus();

      } else if ( !res['status'] && res['message'] ) {

        this.toastr.error(this.translate.instant(res['message']), this.translate.instant('Error'));
        this.spinner = false;
        this.sleep(500).then(() => {
            $(".documents-wrapper").addClass("documents-warrning");
        });
        this.contacts = [];

      }

        res.status = 6;
        res.manualReply = 1;
        this.answerToClient = null;
        this.buttonToggle = false;
        this.reminderCheckbox = false;
      });
  }

  setDeviationStatus() {
    const accepted = this.ata_messages[this.selectedDeviation].accepted;

    if (accepted == -1) {
      this.ata_messages[this.selectedDeviation].accepted = 4;
      this.ata.Status = 4;
      this.createForm.get('Status').patchValue(4);
      this.createForm.get('accepted').patchValue(4);
      this.setColorBasedOnStatus();
    }
  }


  addAnswerToClient(res) {
    if (this.answerToClient) {
      this.clientResponses.push({
        id: "99999",
        answerEmail: this.userDetails.email,
        answerDate: null,
        Status: res.status,
        manualReply: 1,
        client_message: this.answerToClient.clientMessage,
        attachment: null,
        image_path: null,
        file_path: null,
        active: "1",
        files: res.data,
        group: "b95adbbb82aab4ecb1de"
      });
    }
  }

  sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  onFileChange(event) {
    this.chooseFile = true;
    this.uploadMessage = '';
    if (event.target.files && event.target.files.length) {
      Array.from(event.target.files).forEach(file => {
        const reader = new FileReader();
        reader.readAsDataURL(file as Blob);
        this.uploadMessage += (file as any).name + ', ';

        reader.onload = () => {
          this.files.push({
            Url: reader.result,
            Name: (file as any).name,
            created: true
          });
        };
      });
    } else {
      this.chooseFile = false;
    }
    this.uploadMessage = this.uploadMessage.slice(0, -2);
  }

  toggleAttachment(albumKey, index, type) {

    const deleteStatus = !this.ata_messages[this.selectedDeviation]['files'][albumKey][type][index].deleted
    const file = this.ata_messages[this.selectedDeviation]['files'][albumKey][type][index];
    file.deleted = deleteStatus;

    this.addOrRemoveFilesFromDeleteArray(file, deleteStatus, type);
  }

  addOrRemoveFilesFromDeleteArray(file, status, type) {

    if (status) {
      file.deleteType = type;
      this.deletedDocumentsDeviation.push(file);
    } else {
      this.deletedDocumentsDeviation = this.deletedDocumentsDeviation.filter((file_)=>{
          return file.id != file_.id;
      });
    }
  }

  removeDocument(index, type) {

    this[type].splice(index, 1);

  }

  toggleAttachmentImage(e = null) {
    if (e) {
      if (e.target.id !== 'looksLikeModal') {
        return;
      }
    }
    this.showAttachmentImage = !this.showAttachmentImage;
  }

  togglePdfPreview() {
    this.showPdfPreview = !this.showPdfPreview;

    if (this.showPdfPreview)
      this.showPdf = false;
  }

  get getPreviousMessage() {
    if (this.selectedDeviation > 0) {
      return this.ata_messages[this.selectedDeviation - 1];
    }
  }

  getAtaMessages() {


    this.ataService.getMessages(this.ataId).subscribe(
      (response) => {
        if (response["status"]) {
          this.ata_messages = response["data"];
          this.setColorBasedOnStatus();
        }
      });
  }

  rotateRight() {
    this.rotateValue = this.rotateValue + 90;
    let d = document.getElementsByClassName("iv-large-image")[0] as unknown as HTMLElement;
    d.style.transform = "rotate(" + this.rotateValue + "deg)";
    let x = document.getElementsByClassName("iv-snap-image")[0] as unknown as HTMLElement;
    x.style.transform = "rotate(" + this.rotateValue + "deg)";
    let c = document.getElementsByClassName("iv-snap-handle")[0] as unknown as HTMLElement;
    c.style.transform = "rotate(" + this.rotateValue + "deg)";
  }

  rotateLeft() {
    this.rotateValue = this.rotateValue - 90;
    let d = document.getElementsByClassName("iv-large-image")[0] as unknown as HTMLElement;
    d.style.transform = "rotate(" + this.rotateValue + "deg)";
    let x = document.getElementsByClassName("iv-snap-image")[0] as unknown as HTMLElement;
    x.style.transform = "rotate(" + this.rotateValue + "deg)";
    let c = document.getElementsByClassName("iv-snap-handle")[0] as unknown as HTMLElement;
    c.style.transform = "rotate(" + this.rotateValue + "deg)";
  }

  changeSelectedTab(index) {
    this.selectedTab = index;
  }

  getUserPermission() {

    this.usersService.getUserPermission("Ata", this.ataId).subscribe(
      (res) => {
        if (res["status"] && this.ata_messages[this.selectedDeviation].accepted == -1) {
          if (this.ata.AtaTable == "ata_become_external")
            this.editAta = false;
          else
            this.editAta = res["data"]["edit"];


          if(!this.allowEditDeviation()) {
            this.disabledInput = true;
          }else {
            this.disabledInput = !this.editAta;
          }


          this.fullName = res["data"]["fullName"];

          if (this.editAta) {
            this.counter = 0;
            $('.select-property').removeAttr("disabled");
            this.jQueryDisableInputs();
          } else {
            $(".select-property").prop("disabled", this.disabledInput);
          }
        }
      }
    )
  }


  enableUpdate() {
    let status = false;

    const permissions = {
        deviationExternal: Number(this.userDetails.create_project_Externaldeviation),
        deviationInternal: Number(this.userDetails.create_project_Internaldeviation),
        deviationExternal2: Number(this.projectUserDetails.Deviation_External),
        deviationInternal2: Number(this.projectUserDetails.Deviation_Internal)
    }

    if ((permissions.deviationInternal2 == 1 || (permissions.deviationInternal && this.userDetails.role_name == 'Administrator')) && this.type === 'internal') {
        status = true;
    }

    if ((permissions.deviationExternal2 == 1 || (permissions.deviationExternal && this.userDetails.role_name == 'Administrator')) && this.type === 'external') {
        status = true
    }

    if (this.ata.AtaTable != "ata_become_external" && status) {
      this.counter++;
      this.usersService.enableUpdate("Ata", this.ataId, this.counter);

      let obj = {
        'ataId': this.ataId,
        'url': this.router.url,
        'type': "Ata"
      };

      this.cronService.setObject(obj);
    }
  }


  makeExternalAta() {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().subscribe((response)=>{
      if (response.result) {
        const data = this.createForm.value;
        let ata = this.ata;
        ata.Description = data.Description;
        ata.Reason = data.Reason;
        ata.Suggestion = data.Suggestion;
        ata.State = data.State;

        this.ataService.makeAtaExternal(ata).subscribe(res => {
          if (res['status']) {

            this.ata.external = 1;
            this.ata.EmailSent = 0;
            this.ata.AtaNumber = null;
            //this.getAta();
            this.toastr.success(this.translate.instant('Successfully transferred to External Deviation.'), this.translate.instant('Success'));

            this.router.navigate([`/projects/view/deviation/edit/${this.project.id}/${ata.ATAID}`], { queryParams: { projectId: this.project.id, type: 'external' } }).then(()=>{
              window.location.reload();
            });

          } else {
            this.toastr.warning(this.translate.instant('Not able to transfer ATA to External Deviation.'), this.translate.instant('Error'));
          }
        });
      }
    });
  }

  getAta() {
    this.ataService.getAta(this.ata.ATAID).subscribe(
      (res: { status: boolean; data: any; }) => {
        if(res.status) {
          this.ata = res.data;
          this.getAtaMessages();
        }
      }
    );
  }

  checkIfImageBelongsToDeviation() {
    const msg = this.ata_messages[this.selectedDeviation];
    const docs = msg.attachments;
    const internDocuments = docs.filter(document => document.External == '0');

    if (!this.type && internDocuments.length > 0) {
      this.documents_server = msg.pdfs;
      this.images_server = msg.images;
    } else if (this.type == "external") {
      this.documents_server = msg.pdfs;
      this.images_server = msg.images;
    } else {
      this.documents_server = [];
      this.images_server = [];
    }
  }

  renderText() {


    if (this.type === null || this.type === 'internal')
      return 'Internal deviation';
    else
      return 'External deviation';
  }

  ensureRedirectIfHasNotPermissions() {

    if (this.userDetails.show_project_Deviation || this.projectUserDetails) {
      const deviationExternal = Number(this.userDetails.show_project_Externaldeviation);
      const deviationInternal = Number(this.userDetails.show_project_Internaldeviation);
      const deviationExternal2 = Number(this.projectUserDetails.Deviation_External);
      const deviationInternal2 = Number(this.projectUserDetails.Deviation_Internal);

      if (deviationInternal == 0 && this.type === 'internal' && deviationInternal2) {
        this.redirect();
      }

      if (deviationExternal == 0 && this.type === 'external' && deviationExternal2) {
        this.redirect();
      }
    } else {
      if (this.userDetails.show_project_Deviation == 0) {
        this.redirect();
      }
    }
  }

  redirect() {
    this.toastr.error(
      this.translate.instant("You don't have permission to view") +
        ": " +
        this.translate.instant("Deviation"),
      this.translate.instant("Error")
    );
    this.router.navigate([`/projects/view/${this.project.id}`]);
  }

  ensureDeviation() {
    let status = 0;

    if(this.userDetails.show_project_Deviation || this.projectUserDetails) {

        const permissions = {
            deviationExternal: Number(this.userDetails.show_project_Externaldeviation),
            deviationInternal: Number(this.userDetails.show_project_Internaldeviation),
            deviationExternal2: Number(this.projectUserDetails.Deviation_External),
            deviationInternal2: Number(this.projectUserDetails.Deviation_Internal)
        };

        if(this.type == 'external') {
            if (permissions.deviationExternal == 1 || permissions.deviationExternal2 == 1) {
                status = 1;
            }
        }else {
            if (permissions.deviationInternal == 1 || permissions.deviationInternal2 == 1) {
                status = 1;
            }
        }
    }

    if (status != 0) {
      return true;
    }else {
      return false;
    }
  }

  async userCheck(ProjectID) {
    const res = await this.authService.getAuthUser();
    if (res['status']) {
      this.userDetails = res['opts'];
      sessionStorage.setItem('userDetails', JSON.stringify(this.userDetails));
    }
  }

  onItemSelect($event) {
    this.sendDeviation = true;

    let index = this.contacts.findIndex((contact) => ($event.Id == contact.Id) && ($event.Name == contact.Name));
    const selectedContactMail = this.allContacts.find(contact => $event.Id == contact.Id).email;
    const clientResponses = this.clientResponses.filter((res)=>{
      return res.Status != 6 && res.Status != 1;
    });

    let flag = false;

    for (let i = 0; i < clientResponses.length; i++) {
      const response = clientResponses[i];

      if (response.answerEmail.trim() === selectedContactMail.trim()) {
        flag = true;
      }
    }

    if (flag && index === -1) {

      const diaolgConfig = new MatDialogConfig();
      diaolgConfig.autoFocus = false;
      diaolgConfig.disableClose = true;
      diaolgConfig.width = "";
      diaolgConfig.panelClass = "mat-dialog-confirmation";
      diaolgConfig.data = { questionText: this.translate.instant('TSC_ALREADY_RESPONDED_ON_DEVIATION') };
      this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().subscribe((response) => {

        if (!response.result) {
          var elements = document.getElementsByClassName('multiselect-item-checkbox');
          var finalEl;
          for (let i = 0; i < elements.length; i++) {
            if (elements[i]['innerText'] == $event.Name.trim()) {
              finalEl = elements[i];
              finalEl.click();
            }
          }
        } else {
          this.contacts.push($event);
          this.contacts = this.contacts.slice(0);
        }

      });

    } else if (index === -1) {
      this.contacts.push($event);
      this.contacts = this.contacts.slice(0);
    }
  }

  onItemDeSelect($event) {
    this.sendDeviation = true;
    let index = this.allContacts.findIndex((contact) => ($event.Id == contact.Id) && ($event.Name == contact.Name))
    if (index == (this.allContacts.length - 1)) {
      let dr = document.getElementsByTagName('ng-multiselect-dropdown')[0].lastChild.lastChild.lastChild['lastElementChild'] as unknown as HTMLElement;
      dr.click();
      this.contacts.push($event);
    }
    if (index != -1) {
      this.contacts.splice(this.contacts.findIndex((i) => ($event.Id == i.Id) && ($event.Name == i.Name)), 1);
    }
  }

  updateDeviationStatus(status) {
    this.createForm.get('Status').patchValue(status);
    this.allowChangeStatusAndUpdate = true;
  }

  doNothing() {
    return;
  }

  onCheckboxChangeAvvikelseDeviation() {
    this.avvikelseDeviation = !this.avvikelseDeviation;
    this.ataService.updateAtaAvvikelseDeviation({
      ATAID: this.ata.ATAID,
      AvvikelseDeviation: this.avvikelseDeviation ? 1 : 0
    });
  }

  openModal() {
      let object = {
          content_type: "KS",
          content_id: null,
          type: "Ata",
          images: this.images,
          documents: this.pdf_documents,
          type_id: null
      }

      const diaolgConfig = new MatDialogConfig();
      diaolgConfig.autoFocus = true;
      diaolgConfig.disableClose = true;
      diaolgConfig.width = "50%";
      diaolgConfig.maxHeight = "550px";
      diaolgConfig.data = { data: object, images: this.images, pdf_documents: this.pdf_documents };
      this.dialog.open(ImageModalComponent, diaolgConfig).afterClosed().subscribe((res) => {
          if(res) {
              //this.images = res.files;
              //this.pdf_documents = res.pdf_documents;
              this.files = [...this.images, ...this.pdf_documents];

          }
      });
  }

  removeNewAttachment(index, type) {

    this[type].splice(index, 1);

  }

  toggleReminderAndCopyCheckbox(toggle) {
    this.sendDeviation = true;
    switch (toggle) {
      case 'sendCopy':
        this.sendCopy = !this.sendCopy;
        if (this.sendCopy && this.reminderCheckbox) {
          this.toastr.warning(this.translate.instant('Please select only Reminder or Copy.'), this.translate.instant('Info'));
          this.sendDeviation = false;
        }
        break;
      case 'sendReminder':
          this.reminderCheckbox = !this.reminderCheckbox;
        if (this.sendCopy && this.reminderCheckbox) {
          this.toastr.warning(this.translate.instant('Please select only Reminder or Copy.'), this.translate.instant('Info'));
          this.sendDeviation = false;
        }
        break;
    }
  }

  isPDFViewer: boolean = false;
  openSwiper(index, files, album) {

	  const firstElement = files[0];
    const name = firstElement.name; // Vrijednost svojstva "name"

    if (name.endsWith('pdf')) {
      this.isPDFViewer = true;
    }else{
      this.isPDFViewer = false;
    }

    if (files[index].document_type === 'Image') {
      this.swiper = {
        active: index,
        images: files,
        album: album,
        index: -1,
        parent: null
      }

    } else {

      const fileArray = this.createFileArray(files[index]);
      this.swiper = {
        active: 0,
        images: fileArray,
        album: album,
        index: index,
        parent: files[index]
      };
    }
  }

  closeSwiper() {
    this.swiper = {
      active: -1,
      images: [],
      album: -2,
      index: -1,
      parent: null
    }
  }


  removeSwiperImage(event) {

    const index = event.index;
    const album = event.album;
    const type = event.type;
    this.toggleAttachment(album, index, type)
  }

  createFileArray(file) {

    const id = file.id;
    const comment = file.Description;
    const name = file.Name ? file.Name : file.name;
    //const image_path = image.image_path;
    const file_path = file.file_path;

    const fileArray = file_path.split(",").map((fileArray)=>{
      return {
        image_path: fileArray,
        id: id,
        Description: comment,
        name: name,
        file_path: file_path
      };
    });
    return fileArray;
  }



  removeSelectedDocumentsDeviation(event) {
    event.stopPropagation();

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().subscribe((response) => {
      if (response.result) {
        const data = {
          documents: this.deletedDocumentsDeviation
        };
        this.spinner = true;
        this.progress = 50;
        this.ataService.removeSelectedDocumentsDeviation(data).subscribe((res:any)=>{
          if (res.status) {
            this.removeSelectedDocumentsOnClientSide();
          } else {
            this.toastr.error(this.translate.instant('Error'));
          }
          this.progress = 100;
          this.spinner = false;
        });
      }
    });
  }

  removeSelectedDocumentsOnClientSide() {

    this.deletedDocumentsDeviation.forEach((doc)=>{
      const albumKey = doc.album;
      const type = doc.deleteType;
      this.ata_messages[this.selectedDeviation]['files'][albumKey][type] = this.ata_messages[this.selectedDeviation]['files'][albumKey][type].filter((file:any)=>{
        return file.id != doc.id;
      });
      this.clearAlbum(albumKey);
    });
    this.deletedDocumentsDeviation = [];
  }

  clearAlbum(albumKey) {

    const album = this.ata_messages[this.selectedDeviation]['files'][albumKey];
    const imagesLength = album.images ? album.images.length : 0;
    const pdfsLength = album.pdfs ? album.pdfs.length : 0;
    if (imagesLength === 0 && pdfsLength === 0) {
      delete this.ata_messages[this.selectedDeviation]['files'][albumKey];
    }
  }

  buttonNameToggle() {
    this.buttonToggle = !this.buttonToggle;
  }

  buttonNameSummary(worker) {

    if (worker) {

      this.buttonToggle = true;
      const workerExists = this.contacts.some((selectedWorker) => selectedWorker.Id == worker.Id);

      if (workerExists) {

        this.contacts = this.contacts.filter((worker_)=>{
          return worker.Id != worker_.Id;
        })

      } else {

        if (this.type == 'internal') {
          this.contacts = [];
        }

        if (this.type == 'external' && this.ata_messages[this.selectedDeviation].accepted != 2) {
          this.onItemSelect(worker);
        } else {
          this.contacts.push(worker);
        }
      }

    } else {

      this.buttonToggle = !this.buttonToggle;
      if (this.buttonToggle == true) {
        this.buttonName = "Hide";
      } else {
        this.buttonName = "";
      }

    }

    this.contacts = this.contacts.slice(0);
  }

  setStatusInternal() {

     const hasStatus9 = this.clientResponses.some(response => response.Status === "9");

     if (hasStatus9) {
         this.ata_messages[this.selectedDeviation].accepted = 9;
         this.statusAndColor.StatusName = 'Client Answer';
         this.statusAndColor.color = '#bfe29c';
         return this.statusAndColor;
     }

    const status = this.ata_messages[this.selectedDeviation].accepted;

    if (status == -1) {
      // Under pricing
      this.statusAndColor.StatusName = 'Under pricing'
      this.statusAndColor.color  = 'rgb(240, 226, 100)';
      return;
    }

    if (status == 2) {
      // In Progress --external //Svarade--internal
      if(this.type == "external"){
        this.statusAndColor.StatusName = 'In Progress'
        this.statusAndColor.color  = 'rgb(3, 209, 86)';
        return;
      }else if(this.type == "internal"){
        this.statusAndColor.StatusName = 'Answered'
        this.statusAndColor.color  = 'rgb(3, 209, 86)';
        return;
      }
    }

    if (status == 1) {
      // Qestion
      this.statusAndColor.StatusName = 'Question';
      this.statusAndColor.color  = 'rgb(253, 235, 68)';
    }

    if (status == 1 && this.ata_messages[this.selectedDeviation + 1]) {
        // Cancel flow
        this.statusAndColor.StatusName = 'Canceled'
        this.statusAndColor.color  = 'rgb(184, 184, 184)';
        return;
      }

    if (status == 3 /*|| this.ata_messages[this.selectedDeviation + 1]*/) {
      // Declined //Inte aktuell
      if(this.type == "external"){
        this.statusAndColor.StatusName = 'Declined'
        this.statusAndColor.color  = 'rgb(253, 68, 68)';
        return;
      }else if(this.type == "internal"){
        this.statusAndColor.StatusName = 'Not Current'
        this.statusAndColor.color  = 'rgb(253, 68, 68)';
        return;
      }
    }

    if (status == 4) {
      // Sent
      this.statusAndColor.StatusName = 'Sent'
      this.statusAndColor.color  = '#82A7E2';
      return;
    }

    if (status == 5) {
      // Completed
      this.statusAndColor.StatusName = 'Completed'
      this.statusAndColor.color  = '#fff';
      return;
    }

    if (status == 6) {
      // Aborted
      this.statusAndColor.StatusName = 'Aborted'
      this.statusAndColor.color  = 'rgb(184, 184, 184)';
      return;
    }

    if (status == 7) {
      // Clear
      this.statusAndColor.StatusName = 'Clear'
      this.statusAndColor.color  = 'rgb(231, 160, 252)';
    }
    if (status == 9) {
      // Svar
      this.statusAndColor.StatusName = 'Client Answer'
      this.statusAndColor.color  = '#bfe29c';
      return;
    }
      return this.statusAndColor;
  }

 threeDotsStatusesChange(value){
    this.runStatusFunction(value);
 }


  runStatusFunction(status) {

    if (status == 0 || status == 9) {
      this.manuallyAcceptDeviation();
      return;
    }

    if (status == 1) {
      this.manuallyRevisionDeviation();
    }

    if (status == 2) {
      this.manuallyRejectDeviation();
    }

    if (status == 3) {
      this.manuallyAbortDeviation();
    }
  }



 resetStatuses() {
   this.threeDotsStatuses = {
    '0': false,
    '1': false,
    '2': false,
    '3': false
  };
 }

 filterClientResponses(responses) {

    if (responses) {
      return responses.filter(response => response.client_message || response.attachment);
    } else {
      return [];
    }
  }

  runParentFunction(name: any) {
    this[name]();
  }

  //poziva se

  createNewAta(type) {
    this.createAtaType = type;
    if (type == 0) {
      this.createNewAtaDialog();
      return;
    }

    $('#confirmAtaCreationModal').modal({backdrop:'static', show: true});
    $("#paymentType").prop("disabled", false);
    $("#paymentType > option").prop("disabled", false);
  }

  createAtaFromDeviation() {
    if (this.spinner) {return;}
    this.createNewAtaDialog();
  }

  createNewAtaDialog() {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().subscribe((response)=>{
      if (response.result) {

        const data = this.generateNewAtaData();
        this.spinner = true;
        this.progress = 50;
        this.ataService.createAta(data).subscribe((res: any)=>{
          if (res.body) {
            this.articleCancelButton.nativeElement.click();
            const type = this.createAtaType == 1 ? 'external' : 'internal';
            this.spinner = false;
            this.progress = 100;
            this.router.navigate([`projects/view/ata/modify-ata/${res.body.id}`], { queryParams: { projectId: this.project.id, type: type } }).then(()=>{
              window.location.reload();
            });
          }
        });
      }
    });
  }

  setPaymentType() {
    return this.getPaymentType();
  }

  generateNewAtaData() {
    const value = this.createForm.value;
    const parentTypeName = this.type === 'external' ? 'External' : 'Internal';
    return {
      Name: value.Title,
      project: this.project,
      StartDate: value.StartDate,
      DueDate: value.DueDate,
      street: this.project.street,
      AtaType:  1,
      city: this.project.city,
      zip: this.project.zip,
      clientName: this.project.clientName,
      briefDescription: value.Description,
      fullname: this.userDetails.firstname + ' ' + this.userDetails.lastname,
      Deviation: 0,
      Ata: 1,
      paymentType: this.createAtaType == 0 ? '6' : this.setPaymentType(),
      invoicedTotal: 0.00,
      totallyWorkedUp: 0.00,
      Status: 0,
      Type: this.createAtaType,
      parentAtaId: this.ata.ATAID,
      imagesId: this.ata_messages[this.selectedDeviation].id,
      parentNumber: `${parentTypeName}-U-${this.ata.DeviationNumber}`,
      parentType: 'Deviation',
      childType: `ATA`,
      articlesAdditionalWork: this.rikiArticles.articlesAdditionalWork,
      articlesMaterial: this.rikiArticles.articlesMaterial,
      articlesOther: this.rikiArticles.articlesOther
    };
  }

  createNewDeviation() {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().subscribe((response)=>{
      if (response.result) {

        const data = this.generateNewDeviationData();
        this.spinner = true;
        this.progress = 50;

        this.createDeviationSub = this.ataService.createDeviation(data).subscribe(
          (res) => {
            if (res.type === HttpEventType.Response) {
              const response = res["body"];
              if (response['status']) {
                this.spinner = false;
                this.progress = 100;

                this.router.navigate([`/projects/view//deviation/edit/${this.project.id}/${response['createdDeviationId']}`]).then(()=>{
                  window.location.reload();
                });


              }
            }
          }
        );
      }
    });
  }

  generateNewDeviationData() {
    const value = this.createForm.value;
    const parentTypeName = 'Internal';
    return {
      Client: "0",
      Description: value.Description,
      DeviationType: value.DeviationType,
      DueDate: value.DueDate,
      ProjectID: this.project.id,
      Reason: value.Reason,
      StartDate: value.StartDate,
      State: value.State,
      Status: 0,
      Suggestion: value.Suggestion,
      Title: value.Title,
      Type: 1,
      city: this.project.city,
      clientName: this.project.clientName,
      contacts: [],
      documents: [],
      generalImage: this.generalImage,
      images: [],
      nextDeviationNumber: '',
      street: this.project.street,
      zip: this.project.zip,
      parentAtaId: this.ata.ATAID,
      parentNumber: `${parentTypeName}-U-${this.ata.DeviationNumber}`,
      parentType: 'Deviation',
      childType: 'Deviation',
      imagesId: this.ata_messages[this.selectedDeviation].id
    };
  }


  canAddArticlesToAta() {
    const deviationPaymentType = this.getPaymentType();
    if (this.createAtaType == 0 && deviationPaymentType == 1) {
      return false;
    }
    return true;
  }

  savePdf() {

    this.saveDev = true;
    this.updateDeviation(false, false, false);
  }

  download_pdf() {
    const name =
      this.project.CustomName +
      "-" +
      this.ata_messages[this.selectedDeviation].PDFUrl +
      ".pdf";
    const link = document.createElement("a");
    link.href = this.ata_messages[this.selectedDeviation].PDFUrl;
    link.setAttribute("download", name);
    document.body.appendChild(link);
    link.click();
    this.saveDev = false;
  }

  printDeviation() {

    this.printDev = true;
    this.updateDeviation(false, false, false);
  }


  /**
   *    Code za confirm modal
   */

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
    if(this.createForm.dirty) {
      this.appComponent.loading = false;
      return this.onConfirmationModal();
    } else {
      return true;
    }
  }

  async canYouChangeSelectedTab(index: number) {
    if(this.createForm.dirty) {
      if(await this.onConfirmationModal()) {
        this.changeSelectedTab(index);
        this.createForm.markAsPristine();
      }
    } else {
      this.changeSelectedTab(index);
    }
  }

  /**--------------------------------------- */


  toggleDesMenu() {
    this.desMenuToggle = !this.desMenuToggle;
    this.disableInputIfDesOpen();
  }

  disableInputIfDesOpen() {
    if (this.desMenuToggle) {
      setTimeout(()=>{
        this.jQueryDisableForm();
      }, 50);
    }
  }

  pominalseCheck(){
    this.reminderCheckbox = !this.reminderCheckbox
    if(this.reminderCheckbox) {
        $('#dueDate').removeAttr("disabled");
    } else {
      $('#dueDate').attr("disabled", true);
    }
  }

  optionsDownDiv(){
    this.buttonToggleDots = !this.buttonToggleDots;
  }

  public arrowUpColor = 'var(--project-color)';

  threeDotsEnter() {
    if (this.buttonToggleDots) return;
    this.arrowUpColor = 'var(--orange-dark)';
  }

  threeDotsLeave() {
    if (this.buttonToggleDots) return;
    this.arrowUpColor = 'var(--project-color)';
  }

  slicedTitle() {
    const title = this.createForm.get('Title').value;

    if (title.length > 25) {
      return `${title.slice(0,16).trim()}...`;
    }

    return title;
  }

  containerHeightToggle(event){
    if(event){
        this.setHeight.height = 'calc(100vh - 462px - 0px)'
    }else{
        this.setHeight.height = 'calc(100vh - 132px - 0px)'
    }
  }

  checkIfDeviationIsRemovable(deviation) {
    const deviationInfo = {
      id: deviation.ATAID,
      type: deviation.Type,
      projectId:deviation.ProjectID
    }

    this.ataService.getAllowRemoveDeviation(deviationInfo).pipe(take(1)).subscribe(
      (res) => {
        if (res['status']&&res['data'] == 0) this.allowDelete = true;
      }
    )
  }

  deleteDeviationModalOpen() {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    diaolgConfig.data = { questionText: this.translate.instant('Are you sure you want to delete this deviation')};
    this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().subscribe((response) => {
      if (response.result) {

          let object = {
            id: this.ata.ATAID,
            Type: this.type == "external" ? 1 : 0,
            BecomeExternalAtaFromInternal:
              this.ata.BecomeExternalAtaFromInternal,
            oldAtaNumber: this.ata.DeviationNumber,
            projectId: this.project.id,
            ParentAta: this.ata.ParentAta,
          };
          this.ataService.removeDeviationUpdateIsDeleted(object).subscribe((res) => {
            if ((res["status"] = true))
              this.toastr.success(
                this.translate.instant("Successfully removed Deviation!"),
                this.translate.instant("Success")
              );
            this.router.navigate(["projects", "view", this.project.id]);
          });
      }
    });

  }


  deleteDeviation() {

  }




    allowEditDeviation() {
        let status = false;
        if(this.userDetails.create_project_Deviation || this.projectUserDetails) {

            const permissions = {
                deviationExternal: Number(this.userDetails.create_project_Externaldeviation),
                deviationInternal: Number(this.userDetails.create_project_Internaldeviation),
                deviationExternal2: Number(this.projectUserDetails.Deviation_External),
                deviationInternal2: Number(this.projectUserDetails.Deviation_Internal)
            }

            if(this.type == 'external') {
                if ((permissions.deviationExternal == 1 && this.userDetails.role_name == 'Administrator') || permissions.deviationExternal2 == 1) {
                    status = true;
                }
            }

            if(this.type == 'internal') {
                if ((permissions.deviationInternal == 1 && this.userDetails.role_name == 'Administrator') || permissions.deviationInternal2 == 1) {
                    status = true;
                }
            }
        }

        if(!status) {
          this.disabledInput = true;
          $('#dueDate').attr("disabled","disabled");
          $('#startDate').attr("disabled","disabled");
          $('.form-control').attr("disabled","disabled");
        }else {
          $('#dueDate').removeAttr("disabled");
          $('#startDate').removeAttr("disabled");
          $('.form-control').removeAttr("disabled");
        }

        return status;
    }

    checkStatus(){
      if(this.ata.Status != -1 && this.ata.Status != 0){
        this.disableEdit = true;
     }
    }

    disableOlderVersion(index){
      if(index == (this.ata_messages.length-1)) this.lastVersion = false;
      else this.lastVersion = true;
    }

    disabledByStatus(){
      if(this.disableEdit || this.lastVersion){
        return true;
      }
        return false;
    }

    internalDevSent(){
      this.disableEdit = true;
    }

    resetSendDropdown(){
      this.allContacts.forEach(value=>{
        value.checked = false;
      })
    }

    updateTotalPageDeviationPdfPreview(TotalPageNumber: number) {
      this.totalPage = TotalPageNumber;
    }

    updateCurrentPageDeviationPdfPreview() {
      const dokument = document.querySelector(".container-pdf-preview");
      const currentPositionPX = dokument.scrollTop;
      const heightWindowPX = window.innerHeight;
      const totalPage =  this.totalPage;

      const calculatedPage = Math.floor(currentPositionPX / heightWindowPX) + 1;

      this.currentPage = Math.min(calculatedPage, totalPage);
    }
}
