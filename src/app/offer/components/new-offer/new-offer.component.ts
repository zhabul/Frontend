import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  OnDestroy,
  ViewChild,
  Input,
  HostListener,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, Validators, FormGroup, NgForm } from "@angular/forms";
import { OffersService } from "src/app/core/services/offers.service";
import { ToastrService } from "ngx-toastr";
import { ClientsService } from "src/app/core/services/clients.service";
import { UsersService } from "src/app/core/services/users.service";
import { Subscription, take } from "rxjs";
import { AuthService } from "src/app/core/services/auth.service";
import { TranslateService } from "@ngx-translate/core";
import { NoWhitespaceValidator } from "src/app/core/validator/no-whitespace.validator";
import { DatePipe } from "@angular/common";
// import { AddCustomerContactComponent } from "../modals/add-customer-contact/add-customer-contact.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { AddTemplateComponent } from "../modals/add-template/add-template.component";
import { AddNewCustomerComponent } from "../modals/add-new-customer/add-new-customer.component";
import { OfferStore } from "../offer-editor/service/offer.service";
import { Subject } from "rxjs";
import { ImageModalUtility } from "src/app/projects/components/image-modal/image-modal-utility.service";
import { FileStorageService } from "src/app/core/services/file-storage.service";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
// import { OfferDataService } from "../services/offerDataService/offer-data.service";
import { emptyEmailLogObject } from "../offer-editor/service/utils";
import {
  setEmailStatus,
  resolveEmailLogStatus,
} from "src/app/utility/component-email-status/utils";
import { generateEmailInfoObject } from "./utils";
import * as moment from "moment";
import * as printJS from "print-js";
import { TabService } from "src/app/shared/directives/tab/tab.service";
import { Location } from '@angular/common';
import { AESEncryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';
import { ClientProjectDetailsComponent } from "src/app/projects/components/client-project-details/client-project-details.component";

declare let $: any;
@Component({
  selector: "app-new-offer",
  templateUrl: "./new-offer.component.html",
  providers: [ImageModalUtility,TabService],
  styleUrls: ["./new-offer.component.css"],
})
export class NewOfferComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input("offers") offers = [];
  @Input("id") id;
  @ViewChild("myform", { static: true }) myform!: NgForm;
  @ViewChild("laxContainer") laxContainer;
  @ViewChild("blueScroll") blueScroll;

  public createForm: FormGroup;
  public StartDate: any;
  public EndDate: any;
  public ValidityPeriod: number = 30;
  public PaymentTerms: number = 30;
  public TehnicReview: any;
  public company_workers: any[] = [];
  public selectedCoworkers: any[] = [];
  public selectedClientWorkers = [];
  public userDetails: any;
  public message: any;
  public messageErr: any;
  public messageCont: any;
  public dropdownSettings;
  public clientCategories;
  public componentVisibility: number = 0;
  public togglePdf: boolean = false;
  public language = "en";
  public week = "Week";
  public clients: any[];
  public users: any[] = [];
  public constructionForms: any[] = [];
  public getDebitForms: any[] = [];
  public userWithPermissionStatus = false;
  public usersWithPermission: any[] = [];
  public showSelectClientWorker = false;
  public disabled = false;
  public actionStatus = -1;
  public client_workers: any = [];
  public ResponsiblePersonStatus = false;
  public responsiblePersons: any[];
  public SelectStatus = false;
  public buttonName = "Show";
  public buttonToggle = false;
  public articles: any[];
  public showPdfPreview = false;
  public showAppendicesPreview = false;
  public whichPdfPreview = "offer";
  public whichAppendicesPreview = "offer"
  public currentTab = Number(sessionStorage.getItem("currentTab")) || 0;
  public selectedTab = 0;
  public selectedTitle = 0;
  public allEmailLogs = {};
  isShownDefaultValue: boolean = true;
  isShownEstimatedTime: boolean = true;
  isShownClient: boolean = true;
  isShownAddress: boolean = true;
  isShownEconomy: boolean = true;
  templateOptionsOpened: boolean = false;
  public generatedOfferNumber: any;
  subscription1: Subscription;
  subscription2: Subscription;
  // saveCheckSubscription: BehaviorSubject<boolean>;
  offerSaved = true; //used for check the whole offer save state
  public hasQuestion = false;
  hasAppendices = false;

  public projectStatusOptions: { id: string; status: string }[] = [
    { id: "1", status: this.translate.instant("On Hold") },
    { id: "2", status: this.translate.instant("In Progress") },
    { id: "3", status: this.translate.instant("Completed") },
    { id: "4", status: this.translate.instant("Awaiting inspection") },
    { id: "5", status: this.translate.instant("Aborted") },
  ];

  public color = 'var(--orange)';

  public utkastId;
  public statusText = "Draft";
  public fillSent;

  @ViewChild("responsiblePerson") responsiblePersonRef: ElementRef;
  @ViewChild('dropdown') dropdownRef : ElementRef;
  @ViewChild('dropdown1') dropdownRef1 : ElementRef;
  public buttonToggleSend = false;
  public buttonText = "Create";
  opacity = 0;
  display = "none";
  translateY = "150px";
  addedRows: any;
  background = "rgb(128 128 128 / 50%)";

  private fromTemplate;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public offersService: OffersService,
    private offerStore: OfferStore,
    private clientsService: ClientsService,
    private toastr: ToastrService,
    private router: Router,
    private userService: UsersService,
    private authService: AuthService,
    private translate: TranslateService,
    private datepipe: DatePipe,
    private dialog: MatDialog,
    private imageModalUtility: ImageModalUtility,
    private fsService: FileStorageService,
    private location: Location,
    private AESEncryptDecryptService: AESEncryptDecryptService
    // private offerDataService: OfferDataService,
  ) {
    this.fromTemplate = this.location.getState();
    this.language = sessionStorage.getItem("lang");
    if (this.language == "en") this.week = "Week";
    else this.week = "Vecka";
  }

  public generals;
  ngOnInit() {
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    this.setButtonText();
    this.generatedOfferNumber = this.route.snapshot.data["getNextOfferNum"]["number"];
    this.clientCategories =
      this.route.snapshot.data["clientCategories"]["data"] || [];
    this.clients = this.route.snapshot.data["clients"];
    this.generals = this.route.snapshot.data["generals"];
    this.setUsersWithPermission();
    this.initMessages();
    this.getClient();
    this.createSendOfferForm();
    this.setActiveOffer(0);
    this.initClient();
    // this.setSaveCheck();
    // this.onAddNewClient();

    // this.subscription1 = this.clientsService.client.subscribe((data) => {
    //   console.log(data)
    //   if (data != null) {
    //     data["finalName"] = data["Name"];
    //     this.clients.push(data);
    //   }
    // });

    this.subscription1 = this.clientsService.client.subscribe((client) => {
      if (client != null && typeof client === "object") {
        client["finalName"] = client["Name"];
        this.clients.push(client);
        // this.createForm.controls.client_id.patchValue(client.Id);
      }
    });

    this.subscription2 = this.clientsService.clientWorker.subscribe((data) => {
      if (data != null) {
        this.client_workers.push(data);
        this.client_workers = JSON.parse(JSON.stringify(this.client_workers));
      }
    });

    this.fillSent = 'var(--project-color)';
  }

  ngOnChanges() {}

  public sendOfferForm: FormGroup;

  createSendOfferForm() {
    const lastUser = JSON.parse(localStorage.getItem('lastUser'));
    this.sendOfferForm = this.fb.group({
      to: [
        "",
        // this.client_workers.find(cl => cl.Name == this.offer.clwork_name).email,
        [
          Validators.required,
          Validators.email,
          Validators.minLength(1),
          Validators.maxLength(255),
        ],
      ],
      from: [
        lastUser.email,
        [
          Validators.required,
          Validators.email,
          Validators.minLength(1),
          Validators.maxLength(255),
        ],
      ],
      name: [
        "",
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(255),
        ],
      ],
      header: [
        this.translate.instant("Hello!") +"\n"+
        this.translate.instant("Thank you for your inquiry, below you will find the quotation according to agreement."),
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2450),
        ],
      ],
      footer: [
        this.generals ?
          this.translate.instant("Sincerely") + ",\n" +
          lastUser.firstname + " " + lastUser.lastname +"\n" +
          this.generals.Company_Name.value + "\n" +
          this.generals.Company_Mobile.value :
          "",
        [Validators.maxLength(1450)]
      ],
    });
  }

  async sendOffer(status = 1) {

    if(status != 1){
      const lastUser = JSON.parse(localStorage.getItem('lastUser'));
      this.sendOfferForm.get("to").patchValue(lastUser.email)
    }

    if (this.sendOfferForm.invalid && status == 1) {
      this.sendOfferForm.markAllAsTouched();
      return;
    }

    const res = await this.onConfirmationModal();
    if (!res) return;
    const data = {
      ...this.sendOfferForm.value,
      manualReply: 0,
      reminder: 0,
      status: status,
    };
    this.spinner = true;
    if(status == 1)
      this.setOpacity();

    if (this.activeOffer === 0) {
      const emailInfo = generateEmailInfoObject(data, this.offer.id);
      const res2 = await this.offersService.sendOfferDraft({
        id: this.id,
        emailInfo: emailInfo,
        offersLength: this.offers.length,
      });
      if (this.activeOffer > 0) {
        this.unshiftEmailLogToOffer(data.status);
      }
      res2.data.emailLogs = [this.generateEmailLogObject(data.status)];
      this.addNewOffer(res2);
      // this.setOpacity();
      if(status == 1)
        this.dropSend();
    } else {
      const { status } = setEmailStatus(this.offer.emailLogs);
      data.status = status// == 1 ? status : 7;
      const emailInfo = generateEmailInfoObject(data, this.offer.id);
      await this.offersService.sendOffer({
        id: this.id,
        emailInfo: emailInfo,
        offersLength: this.offers.length,
      });
    }
    this.spinner = false;
    this.buttonToggleSend = false;
  }

  setEmailStatus(logs) {
    return setEmailStatus(logs);
  }

  setOfferData(event) {
    const { data, content_type } = event;
    if (content_type === "offer_i") {
      this.offer.offer_i = data;
      // this.offerDataService.nextIntroData(data);
    } else if (content_type === "offer_t") {
      this.offer.offer_t = data;
      // this.offerDataService.nextTerminationData(data);
    } else if (content_type === "lines") {
      // this.offerDataService.nextLinesData(data);
      this.offer.lines = data;
    }
  }

  initClient() {
    if (this.id !== -1) {
      this.setClient({
        value: this.offers[this.activeOffer].client_id,
      });
    }
  }

  setButtonText() {
    if (this.id !== -1) {
      this.buttonText = "Save";
    }
  }

  initMessages() {
    this.message = "You have successfully created an offer!";
    this.messageErr = "You did not create a new offer";
    this.messageCont = "You must select a contact person!";
  }

  // setSaveCheck() {
  //   this.saveCheckSubscription = this.offersService.saveDisabled;
  //   this.saveCheckSubscription.subscribe((res) => {
  //     this.offerSaved = res;
  //   });
  // }

  changeOfferSaveStatus(event) {
    this.offerSaved = event;
  }

  public activeOffer = 0;
  public offer: any = {};
  public hasAnswer = false;
  setActiveOffer(index) {
    this.selectedTab = 0;
    this.activeOffer = index;
    this.offer = this.offers[this.activeOffer];
    this.setOfferName();
    this.id = this.offer.id;

    this.hasAnswer = index > 0 ? this.offer.emailLogs?.at(-1).Status == 6 : false;


    if(index === 0 && this.id !== -1){
      this.utkastId = this.id;
      this.offer.emailLogs = [];
    } else if(this.id === -1){
      this.offer.offerNum = this.generatedOfferNumber;
    }
    this.createActiveOfferForm();
    this.offerSaved = true;
    this.disableSave();
    let nameOnSendForm = this.generals ?
      this.generals.Company_Name.value + " | " + this.translate.instant("Offer") + " " + this.offer.offerNum + " - " + this.offer.name :
      "";
    this.sendOfferForm.get('name').setValue(nameOnSendForm);
    this.statusText = setEmailStatus(this.offer.emailLogs)?.statusText;
    this.hasAppendices = this.offer.appendices && this.offer.appendices.length > 0 ? true : false;
    this.hasQuestion = this.offer.emailLogs.some((log) => log.Status === "6")
  }

  getActiveOffer() {
    return this.offers[this.activeOffer];
  }

  disableInputBasedOnId() {
    return this.id !== -1;
  }

  disableInputBasedOnEmailLog() {
    const log = this.offer.emailLogs[0];
    if (!log) return false;
    if (log.Status != 1) return true;
    return true;
  }

  offerNumberStartsWithA(control) {
    const val = control.getRawValue();
    const status = val.startsWith("A") ? false : true;
    control.startsWithA = status;
    return status;
  }

  public replyToQuestion = false;

  setSelectedTitleBasedOnOfferStatus() {
    // const status = setEmailStatus(this.offer.emailLogs);
    // if (status.statusText === "Question") {
    //   this.selectedTitle = 5;
    // } else {
    //   this.selectedTitle = 0;
    // }
    this.selectedTitle = 0;
  }

  showQuestion(){
    this.selectedTitle = 5;
  }

  setEmailLogsName() {
    this.offer.emailLogs.forEach((log) => {
      const status = resolveEmailLogStatus(log);
      log.name = status.statusText;
      log.color = status.color;
    });
  }

  createActiveOfferForm() {
    const readonly = this.disableInputBasedOnEmailLog();
    const disabled = this.disableInputBasedOnId();
    this.setEmailLogsName();
    this.selectedTitle = 6;
    //create new offer set created to date is today
    if(this.offer.StartDate === undefined){
      this.offer.StartDate = moment().format("YYYY-MM-DD");
    }

    this.createForm = this.fb.group({
      id: [this.offer.id],
      offerNum: [
        { value: this.offer.offerNum, disabled: disabled },
        [Validators.required, this.offerNumberStartsWithA],
      ],
      name: [
        this.offer.name,
        [Validators.required, NoWhitespaceValidator.noWhitespaceValidator],
      ],
      userWithPermission: [
        this.offer.userWithPermission,
        [Validators.required],
      ],
      userWithPermission_name: [this.offer.userWithPermission_name, []],
      userWithPermission_mobile: [this.offer.userWithPermission_mobile],
      skv_id: [this.offer.skv_id],
      status: [this.offer.status, [Validators.required]],
      StartDate: [moment(this.offer.StartDate).format("YYYY-MM-DD") ,[Validators.required]],
      ValidityPeriod: [this.offer.ValidityPeriod, [Validators.required]],

      client_id: [this.offer.client_id, [Validators.required]],
      client_id_name: [this.offer.client_id_name, []],
      client_worker_id: [this.offer.client_worker_id, [Validators.required]],
      clientsProjectName: [this.offer.clientsProjectName],
      clientProjectNumber: [
        this.offer.clientProjectNumber
      ],
      ResourceAccount: [this.offer.ResourceAccount],

      street: [this.offer.street, []],
      zip: [this.offer.zip],
      city: [this.offer.city, []],

      street2: [this.offer.street2, []],
      zip2: [this.offer.zip2, []],
      city2: [this.offer.city2, []],

      SkilledHourlyRate: [this.offer.SkilledHourlyRate],
      WorkerHourlyRate: [this.offer.WorkerHourlyRate],
      chargeMaterial: [this.offer.chargeMaterial, []],
      chargeUE: [this.offer.chargeUE, []],
      AtaSkilledHourlyRate: [this.offer.AtaSkilledHourlyRate],
      AtaWorkerHourlyRate: [this.offer.AtaWorkerHourlyRate],
      ATAchargeMaterial: [this.offer.ATAchargeMaterial, []],
      ATAchargeUE: [this.offer.ATAchargeUE, []],
      estimatedRunTime: [this.offer.estimatedRunTime, []],
      estimatedFixTime: [this.offer.estimatedFixTime, []],
      PaymentTerms: [this.offer.PaymentTerms, [Validators.required]],

      offer_id_name: [this.offer.offer_id_name],
      offerNum_preview: [this.offer.offerNum, []],

      LastUpdated: [this.offer.LastUpdated],
      SentDate: [this.offer.SentDate],
      articleName: [this.offer.articleName, []],
      description: [this.offer.description, []],
      unit: [this.offer.unit, []],
      quantity: [this.offer.quantity, []],
      /*EndDate: [this.offer.EndDate, [Validators.required]],*/
      //construction_Id: [{ value: this.offer.construction_Id, disabled: false }],
      debit_Id: [this.offer.debit_Id],
      tenderSum: [this.offer.tenderSum],
      contractAmount: [this.offer.contractAmount],
      cl_name: [this.offer.cl_name],
      clwork_name: [this.offer.clwork_name],
      clwork_mobile: [this.offer.clwork_mobile],
      cl_invoice_address_and_no: [this.offer.cl_invoice_address_and_no],
      cl_invoice_address_post_nr: [this.offer.cl_invoice_address_post_nr],
      cl_invoice_address_city: [this.offer.cl_invoice_address_city],
      client_worker_name: [this.offer.client_worker_name],
      debit_form_name: [this.offer.debit_form_name],
      construction_form_name: [this.offer.construction_form_name],
      draftGroup: [this.offer.draftGroup],
      template: [this.offer.template],
    });
    this.initDatepicker();
    this.disableForm(readonly);
    this.toggleForm();
  }

  toggleForm() {
    setTimeout(() => {
      this.setSelectedTitleBasedOnOfferStatus();
    }, 0);
  }

  disableForm(readonly) {
    if (readonly) {
      this.createForm.disable();
    } else {
      this.createForm.enable();
    }
  }

  async manuallyResolveOffer(status) {
    const res = await this.onConfirmationModal();
    if (!res) return;

    try {
      this.spinner = true;
      const data = {
        to: this.userDetails.email,
        from: this.userDetails.email,
        name: "",
        header: "",
        footer: "",
        manualReply: 1,
        reminder: 0,
        status: status == 4 ? 7 : status,
      };

      const emailInfo = generateEmailInfoObject(data, this.offer.id);

      if (status == 2) {
        await this.offersService.manuallyAcceptOffer(emailInfo);
        this.unshiftEmailLogToOffer(status);
      } else if (status == 3) {
        await this.offersService.manuallyRejectOffer(emailInfo);
        this.unshiftEmailLogToOffer(status);
      } else if (status == 4) {
        await this.offersService.manuallyRevisionOffer(emailInfo);
        this.unshiftEmailLogToOffer(7);
      } else if (status == 5) {
        await this.offersService.manuallyAbortOffer(emailInfo);
        this.unshiftEmailLogToOffer(status);
      }
      this.toggleTamplateOptions();
      this.spinner = false;
    } catch (e) {}
  }

  async manuallyDraftResolveOffer(status) {
    // // Cancell flow because status is not same on all places
    // if(status == 3) status = 7;
    await this.sendOffer(status);
  }

  addNewOffer(res) {
    const { data } = res;
    if (res.status) {
      const lastIndex = this.offers.length - 1;
      const lastOffer = this.offers[lastIndex];
      data.right = this.calculateRightPosition(lastOffer);
      this.offerStore.addNewOffer(data);
      this.offers = this.offerStore.state;
      this.setActiveOffer(this.offers.length - 1)
    }
  }

  calculateRightPosition(lastOffer) {
    const right = Number(lastOffer.right) + 1;
    if (right == 6) {
      return 0;
    }
    return right;
  }

  unshiftEmailLogToOffer(status,answer = false) {
    const emaiLogs = this.offer.emailLogs.slice(0);
    let newEmailLog = this.generateEmailLogObject(status);
    emaiLogs.unshift(answer ? status : newEmailLog);
    this.offer.emailLogs = emaiLogs;
    this.setSelectedTitleBasedOnOfferStatus();
    this.scrollToTop();
  }

  generateEmailLogObject(status) {
    return {
      ...emptyEmailLogObject,
      answerEmail: this.userDetails.email,
      answerDate: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      Status: status,
    };
  }

  setUsersWithPermission() {
    this.users = this.route.snapshot.data["users"];
    for (let i = 0; i < this.users.length; i++) {
      if (
        this.users[i].status == "Active" &&
        this.users[i].role == "Administrator" ||
        this.users[i].role == "Project manager"
      ) {
        this.users[i].finalName = this.users[i].fullname;
        this.usersWithPermission.push(this.users[i]);
      }
    }
  }

  ngAfterViewInit(): void {
    this.initDatepicker();
  }

  scrollToTop() {
    const blueScrollEl = this.blueScroll.nativeElement;
    blueScrollEl.scrollTo({ top: 0, behavior: "smooth" });
  }

  initDatepicker() {
    setTimeout(() => {
      $("#startDate")
        .datepicker({
          format: "yyyy-mm-dd",
          autoclose: true,
          language: this.language,
          todayHighlight: true,
          currentWeekSplitChar: "-",
          weekStart: 1
        })
        .on("changeDate", (ev) => {
          this.createForm.get("StartDate").patchValue(ev.target.value);
          this.StartDate = ev.target.value;
        });

      $("#startDate").datepicker("setDate", new Date(this.offer.StartDate));
    }, 1000);
  }

  getArticle() {
    return new Promise((res, rej) => {
      this.offersService.articles.subscribe((articles) => {
        res(articles);
      });
      this.offersService.makeOffer.emit();
    });
  }

  getClient() {
    this.clientsService
      .getClients()
      .pipe(take(1))
      .subscribe((response) => {
        this.clients = response["data"].map((client) => {
          client["finalName"] = client["Name"];
          return client;
        });
      });
  }

  public offerName = "New Offer";
  setOfferName() {
    if (this.offer.id == -1) {
      this.offerName = "New Offer";
    } else {
      this.offerName = `${this.offer.offerNum} ${this.offer.name} `;
    }
  }

  selectedClient: any;

  setClient(client_id) {
    let client;
    if(client_id.value)
    client = client_id.value;
    else
    client = client_id.Id
    if(this.createForm.get('client_id').value != client)
      this.setSaveEnabled();
    this.createForm.get('client_id').setValue(client);
    if(!client_id.value)
      this.createForm.get('client_id_name').setValue(client_id.name);
    if (client !== "-1") {
      this.clientsService.getClientWorkers(client).subscribe((response) => {
        if(response["status"]){
          this.client_workers = response["data"] || [];
          this.client_workers = this.client_workers.map((worker) => {
            return {
              Id: worker.Id,
              Name: worker.FirstName + " " + worker.LastName,
              finalName: worker.FirstName + " " + worker.LastName,
              email: worker.email
            };
          });
          this.showSelectClientWorker = true;
          this.selectedClientWorkers = this.client_workers;
        } else {
          this.client_workers = [];
          this.showSelectClientWorker = true;
          this.selectedClientWorkers = [];
        }

      });
    } else {
      this.client_workers = [];
      this.showSelectClientWorker = true;
      this.selectedClientWorkers = [];
    }
  }

  setContactPerson(event) {
    event = this.client_workers.find(cl => cl.Id == event.Id)
    if(this.createForm.get('client_worker_id').value != event.Id)
      this.setSaveEnabled();
    this.createForm.get('client_worker_id').setValue(event.Id);
    this.createForm.get('client_worker_name').setValue(event.Name);
  }


  setContactPersons(Client) {
    // const client = client_id.value;
    this.selectedClient = Client;
    this.createForm.get('client_id').setValue(Client.Id);
    this.createForm.get('client_id_name').setValue(Client.name);

    const client = Client.Id;
    if (client !== "-1") {
      this.clientsService.getClientWorkers(client).subscribe((response) => {
        if (!response["data"]) return;
        this.client_workers = response["data"].map(
          (worker) => {
            const name = worker.FirstName + " " + worker.LastName + (worker.Title ? " - " + worker.Title : "");
            return {
              Id: worker.Id,
              id: worker.Id,
              Name: name,
              finalName: name
            };
          }
        );

        this.showSelectClientWorker = true;
        this.selectedClientWorkers = [];
      });
    } else {
      this.client_workers = [];
      this.showSelectClientWorker = true;
      this.selectedClientWorkers = [];
    }
  }

  GetDeliveryContact(selectedClient){
    if(this.createForm.get('userWithPermission').value !== selectedClient.value)
      this.setSaveEnabled();
    this.createForm.get('userWithPermission').setValue(selectedClient.value);
    this.createForm.get('userWithPermission_name').setValue(selectedClient.name);
  }

  GetCustromerContact(Customer){
    this.createForm.get('client_worker_id').setValue(Customer.value);
    this.createForm.get('client_worker_name').setValue(Customer.name);
  }

  changeUserWithPermissionStatus(status) {
    if (status == 0) this.userWithPermissionStatus = true;
    else {
      this.userWithPermissionStatus = false;
      this.usersWithPermission.forEach((user) => {
        if (user["Id"] == status) {
          this.createForm
            .get("userWithPermission_name")
            .setValue(user["fullname"]);
        }
      });
    }
  }

  changeProjectStatus(status) {
    if (status == 0) this.SelectStatus = true;
    else this.SelectStatus = false;
  }

  buttonNameToggle() {
    this.buttonToggle = !this.buttonToggle;

    if (this.buttonToggle == true) {
      this.buttonName = "Hide";
    } else {
      this.buttonName = "Show";
    }
  }

  async goBack() {
    if (this.currentTab === 0) {
      if(this.fromTemplate.delete){
        await this.offersService.deleteOfferById(this.offer.id)
      }
      this.router.navigate(["/offer"]);
      return;
    }
    this.currentTab = 0;
  }

  selectTab(number) {
    this.selectedTab = number;
    // this.getTotals();
  }

  scrollIntoViewInvalidInput() {
    setTimeout(() => {
      const isInvalid = document.querySelector(".is-invalid");
      if (isInvalid) {
        isInvalid.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      } else {
        document.querySelector("#offerNum").scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    }, 100);
  }

  async validateOffer(data) {
    let status = true;

    const now = new Date();
    this.createForm.value.LastUpdated = this.datepipe.transform(
      now,
      "yyyy-MM-dd"
    );
    if (this.createForm.value.SentDate == "") {
      this.createForm.value.SentDate = this.datepipe.transform(
        now,
        "yyyy-MM-dd"
      );
    }

    if (
      !data.template &&
      data.offerNum !== this.getActiveOffer().offerNum &&
      this.id === null
    ) {
      const res: any = await this.offersService.checkIfOfferNumberIsTaken(
        data.offerNum
      );
      const isTaken = res.isTaken;
      if (isTaken) {
        this.toastr.error(
          this.translate.instant("Offer number in use, choose another one"),
          this.translate.instant("Error")
        );
        this.scrollIntoViewInvalidInput();
        status = false;
      }

      if (!data.offerNum.startsWith("A")) {
        this.toastr.error(
          this.translate.instant(
            "Offer numbers must start with the letter 'A'"
          ),
          this.translate.instant("Error")
        );
        this.scrollIntoViewInvalidInput();
        status = false;
      }
    }

    if (this.selectedClientWorkers.length < 1) {
      this.toastr.error(
        this.translate.instant(
          "You must select at least one client contact person."
        ),
        this.translate.instant("Error")
      );
      this.scrollIntoViewInvalidInput();
      status = false;
    }

    return status;
  }

  async submitOffer($event) {
    // $event.preventDefault();
    if (this.saveDisabled) return;
    // const res = await this.onConfirmationModal();
    // if (!res) return;

    if (this.createForm.invalid) {
      this.scrollIntoViewInvalidInput();
      return;
    }

    this.showSelectClientWorker = true;
    const data = this.createForm.getRawValue();
    const status = await this.validateOffer(data);
    if (!status) return;

    if (data.userWithPermission) {
      data.clientWorkers = this.selectedClientWorkers;
      this.spinner = true;
      this.fromTemplate.delete = false;
      if (this.id === null || this.id === -1) {
        data.template = 0;
        this.createOfferCall(data);
      } else {
        if (!data.offerNum) {
          data.offerNum = this.getActiveOffer().offerNum;
        }
        this.updateOfferCall(data);
      }
    } else {
      this.toastr.info(
        this.translate.instant(this.messageCont),
        this.translate.instant("Info")
      );
    }
  }

  async createTemplate(name) {
    const data = this.createForm.getRawValue();
    data.name = name;
    data.offerNum = "";
    data.template = 1;
    const status = await this.validateOffer(data);
    if (!status) return;

    if (data.userWithPermission) {
      data.clientWorkers = this.selectedClientWorkers;
      this.createOfferCall(data, false);
    }
  }

  modalAddTemplate() {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.data = {
      data: { type: "string" },
    };
    diaolgConfig.panelClass = "templateModal";

    this.dialog
      .open(AddTemplateComponent, diaolgConfig)
      .afterClosed()
      .pipe(take(1))
      .subscribe((name) => {
        if (name) {
          this.createTemplate(name);
        }
      });
  }

  createOfferCall(data, redirect = true) {
    this.spinner = true;
    this.offersService.createOffer(data).then(async (res) => {
      this.actionStatus = res["status"] ? 1 : 0;
      if (this.actionStatus) {
        if (redirect) {
          await this.userCheck(res["status"]);
          this.toastr.success(
            this.translate.instant(this.message),
            this.translate.instant("Success")
          );
          const offerId = res["OfferNum"];
          data.offerId = offerId;
          this.offerStore.setOfferState([data]);
          this.router.navigate(["/offer", offerId]);
          this.offerSaved = true;
          this.disableSave();
        } else {
          this.toastr.success(
            this.translate.instant("Successfully created Offer Template."),
            this.translate.instant("Success")
          );
        }
      } else {
        this.toastr.error(
          this.translate.instant("There was an error with creating offer"),
          this.translate.instant("Error")
        );
      }
      this.spinner = false;
    });
  }

  updateOfferCall(data) {
    this.spinner = true;
    this.offersService.updateOffer(data).then(async (res) => {
      this.actionStatus = res["status"] ? 1 : 0;
      if (this.actionStatus) {
        this.toastr.success(
          this.translate.instant("Offer successfully updated."),
          this.translate.instant("Success")
        );
        this.offerSaved = true;
        this.disableSave();
      } else {
        this.toastr.error(
          this.translate.instant("There was an error with updating offer."),
          this.translate.instant("Error")
        );
      }
      this.spinner = false;
    });
  }

  async userCheck(ProjectID) {
    const res = await this.authService.getAuthUser();

    if (res["status"]) {
        res['opts'].role_name = this.AESEncryptDecryptService.sha256(res['opts'].role_name);
        this.userDetails = res["opts"];
        sessionStorage.setItem("userDetails", JSON.stringify(this.userDetails));
    }
  }

  displayError(input: string) {
    if (!this.myform) return;
    const control = this.createForm.get(input);
    return (
      (this.myform.submitted && control.invalid) ||
      (control.dirty && control.invalid)
    );
    // const submitted = this.myform.submitted;
    // let required = false;

    // if (control.errors) {
    //   required = control.errors.required;
    // }
    // return (
    //   submitted &&
    //   (control.invalid || (control.dirty && control.invalid) || required)
    // );
  }

  async deleteOffer(offer_id: number) {
    var data = this.createForm.value;
    const isTaken = (
      (await this.offersService.checkIfOfferNumberIsTaken(data.offerNum)) as any
    ).isTaken;
    if (isTaken) {
      this.offersService.deleteOfferById(offer_id).then((res) => {
        if (res["status"]) {
          this.toastr.success(
            this.translate.instant(this.message),
            this.translate.instant("Successfully deleted offer: ") +
              data.name +
              "."
          );
          this.router.navigate(["/offer"]);
        } else {
          this.toastr.error(
            this.translate.instant("There was an error while deleting offer"),
            this.translate.instant("Error")
          );
        }
      });
    } else {
      this.toastr.error(
        this.translate.instant("Offer does not exist!"),
        this.translate.instant("Error")
      );
    }
  }

  toggleShowDefaultValue() {
    this.isShownDefaultValue = !this.isShownDefaultValue;
  }
  toggleShowEstimatedTime() {
    this.isShownEstimatedTime = !this.isShownEstimatedTime;
  }

  toggleShowClient() {
    this.isShownClient = !this.isShownClient;
  }
  toggleShowAdress() {
    this.isShownAddress = !this.isShownAddress;
  }
  toggleShowEconomy() {
    this.isShownEconomy = !this.isShownEconomy;
  }

  ngOnDestroy() {
    if(this.fromTemplate.delete){
      this.offersService.deleteOfferById(this.offer.id)
    }
    // this.subscription1.unsubscribe();
    // this.subscription2.unsubscribe();
    // this.saveCheckSubscription.unsubscribe();
  }

  getResponsibleUser() {
    this.userService.getResposnibleUsers().subscribe((response) => {
      this.responsiblePersons = response["data"];
    });
  }

  changeresponsiblePersonStatus(status) {
    if (status == 0) this.ResponsiblePersonStatus = true;
    else this.ResponsiblePersonStatus = false;
  }

  printOffer() {
    if (!this.id || this.id == -1) return;
    this.buttonToggleSend = !this.buttonToggleSend;
    if (this.offerSaved) {
      this.showPrintWindow();
      return;
    }
    this.notSavedOnPrintModal();
  }

  showPrintWindow() {
    this.spinner = true;
    this.offersService
      .getOfferPdf(this.id)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          printJS(res["data"][0].Url);
          this.spinner = false;
        },
        error: (err) => {
          this.toastr.error(this.translate.instant("Error"));
          this.spinner = false;
        },
      });
  }

  dropSend() {
    if (!this.id || this.id == -1) return;
    this.buttonToggleSend = !this.buttonToggleSend;
  }

  textAreaAdjust(event) {
    const element = event.target;
    const lax = this.laxContainer.nativeElement;
    const scrollHeight = lax.scrollTop;
    element.style.height = "1px";
    element.style.height = 25 + element.scrollHeight + "px";
    lax.scrollTo(0, scrollHeight);
  }

  setOpacity() {
    this.display = this.opacity == 0 ? "block" : "none";
    if(this.opacity == 0){
      this.sendOfferForm
            .get("to")
            .setValue(this.client_workers.find(cl => cl.Name == this.offer.clwork_name).email)
    }
    setTimeout(() => {
      this.opacity = this.opacity == 1 ? 0 : 1;
      this.translateY = this.opacity == 1 ? "0px" : "150px";
      this.background = this.opacity == 1 ? "rgb(128 128 128 / 50%)" : "none";
    }, 0);
  }

  modalAddCustomerContact() {
      // $event.preventDefault();
      this.clientsService.client.next(this.offer.client_id);
      const diaolgConfig = new MatDialogConfig();
      diaolgConfig.panelClass = "custom-modalbox-client-detail";
      diaolgConfig.autoFocus = false;
      diaolgConfig.width = "";
      diaolgConfig.height = "auto";
      diaolgConfig.disableClose = false;
      diaolgConfig.data = {
        clientCategories: [],
      };
      this.dialog.open(ClientProjectDetailsComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.selectedClientWorkers = this.client_workers;
          // this.client_workers.push(response);
          // this.client_workers = JSON.parse(JSON.stringify(this.client_workers));
          // this.createForm.get("client_worker_id").setValue(response.Id);
          // this.createForm.get("client_worker_name").setValue(response.Name);
          this.setContactPerson({Id:response.Id, Name: response.Name});
          this.toastr.success(
            this.translate.instant("New contact added to client!")
          );
        }
      });

    // const diaolgConfig = new MatDialogConfig();
    // diaolgConfig.autoFocus = true;
    // diaolgConfig.disableClose = true;
    // diaolgConfig.data = {
    //   data: {
    //     type: "string",
    //     clientId: this.createForm.get("client_id").value,
    //   },
    // };
    // diaolgConfig.panelClass = "customerModal";
    // this.dialog
    //   .open(AddCustomerContactComponent, diaolgConfig)
    //   .afterClosed()
    //   .subscribe((response) => {
    //     if (response) {
    //       this.client_workers.push(response);
    //       this.client_workers = JSON.parse(JSON.stringify(this.client_workers));
    //       this.createForm.get("client_worker_id").setValue(response.Id);
    //       this.createForm.get("client_worker_name").setValue(response.Name);
    //       this.toastr.success(
    //         this.translate.instant("New contact added to client!")
    //       );
    //     }
    //   });
  }

  modalAddCustomer() {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.data = {
      data: { type: "string" },
    };
    diaolgConfig.panelClass = "customerModal";
    this.dialog
      .open(AddNewCustomerComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.clients.push({ finalName: response.name, Name: response.name, Id: response.id });
          // this.createForm.get("client_id_name").setValue(response.name);
          // this.createForm.get("client_id").setValue(response.id);
          this.client_workers = [];
          // this.createForm.get("client_worker_id").setValue("");
          // this.createForm.get("client_worker_name").setValue("");
          this.setClient({ value: response.id });
          this.toastr.success(this.translate.instant("Success"));
        }
      });
  }

  closeAllPdfPrew() {
    if (this.showPdfPreview) {
      this.showPdfPreview = !this.showPdfPreview;
    }
  }

  togglePdfPreview(whichPdf) {
    if (!this.id || this.id == -1) return;

    if (this.showPdfPreview) {
      if (this.whichPdfPreview === whichPdf) {
        this.showPdfPreview = !this.showPdfPreview;
      }
    } else {
      this.showPdfPreview = !this.showPdfPreview;
    }

    if(this.showAppendicesPreview) this.showAppendicesPreview = !this.showAppendicesPreview;

    this.whichPdfPreview = whichPdf;
  }

  toggleAppendicesPreview(whichAppendices) {
    if (!this.id || this.id == -1) return;

    if (this.showAppendicesPreview) {
      if (this.whichAppendicesPreview === whichAppendices) {
        this.showAppendicesPreview = !this.showAppendicesPreview;
      }
    } else {
      this.showAppendicesPreview = !this.showAppendicesPreview;
      this.getFiles();
    }

    if(this.showPdfPreview) this.showPdfPreview = !this.showPdfPreview;

    this.whichAppendicesPreview = whichAppendices;
  }

  projectStatusSelected($event, type) {
    const control = this.createForm.get(type);
    if(control.value != $event.id)
      this.setSaveEnabled();
    control.patchValue($event.id);
  }

  setSelectedTab(tab) {
    if (tab == 2) this.getEmailLogs();
    if (!this.id || this.id == -1) return;
    this.selectedTab = tab;
  }

  toggleTamplateOptions() {
    if (!this.id || this.id == -1) return;
    this.templateOptionsOpened = !this.templateOptionsOpened;
  }

  changeSelectedTabTitle(index) {
    if (!this.id || this.id == -1) return;
    if (!this.offerSaved) {
      this.notSavedModal(index);
      return;
    }
    this.selectedTitle = index;
    if(this.selectedTitle === 4)
      this.getFiles();
  }

  notSavedModal(index = -1) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    diaolgConfig.data = {
      questionText: this.translate.instant(
        "You haven't saved your changes. Do you want to continue?"
      ),
    };
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          if (index != -1) this.selectedTitle = index;
          this.offerSaved = true;
          this.disableSave()
        }
      });
  }

  notSavedOnPrintModal() {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    diaolgConfig.data = {
      questionText: this.translate.instant(
        "You haven't saved your changes. Do you want to continue?"
      ),
    };
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          this.showPrintWindow();
          this.offerSaved = true;
          this.disableSave();
        }
      });
  }

  public images: any[] = [];
  public pdf_documents: any[] = [];
  public infoObject = {
    content_type: "offer",
    content_id: null,
    type: "offer",
    images: this.images,
    documents: this.pdf_documents,
    type_id: null,
  };
  public albums: any[] = [];
  public $_clearFiles: Subject<void> = new Subject<void>();

  getContentIdForInfoObject() {
    const content_id = this.id;
    const type_id = this.id;
    return { content_id: content_id, type_id: type_id };
  }

  updateAlbumsAta(event) {
    this.albums = event;
    this.disabledSaveCondition();
  }

  async getFiles() {
    this.toggleSpinner();
    const res = await this.offersService.getOfferFiles(this.id);
    this.toggleSpinner();
    const { data } = res;
    const { allImages, allPdfs } = data;
    this.images = allImages;
    this.pdf_documents = allPdfs;
  }

  async removeFile(file, type) {
    this.onConfirmationModal().then(async (res) => {
      if (res) {
        this.toggleSpinner();
        this.offer.appendices = this.offer.appendices.filter((appendice) => appendice.url != file.url);
        this.hasAppendices = this.offer.appendices.length > 0;
        await this.offersService.removeFile(file);
        this.toggleSpinner();
        this[type] = this[type].filter((file_) => {
          return file_.id != file.id;
        });
      }
    });
  }

  getEmailLogs() {
    const idForResponseGet =
      this.offer.draftGroup == "0" ? this.offer.id : this.offer.draftGroup;
    this.spinner = true;
    this.offersService
      .getAllClientResponses(idForResponseGet)
      .then((res) => {
        this.allEmailLogs = res["data"];
        this.spinner = false;
      })
      .catch((err) => this.toastr.error(this.translate.instant("Error")));
  }

  onConfirmationModal(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.disableClose = true;
      dialogConfig.width = "185px";
      dialogConfig.panelClass = "mat-dialog-confirmation";
      this.dialog
        .open(ConfirmationModalComponent, dialogConfig)
        .afterClosed()
        .pipe(take(1))
        .subscribe((response) => {
          if (response.result) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
    });
  }

  public spinner = false;
  toggleSpinner() {
    this.spinner = !this.spinner;
  }
  async uploadFiles() {

    //if more times click on save
    if(this.saveDisabled) return;
    this.disableSave();

    const content = this.getContentIdForInfoObject();
    const content_id = content.content_id;
    const type_id = content.type_id;
    const albumFiles = this.imageModalUtility.getAlbumFiles(
      this.albums,
      content_id,
      type_id
    );
    const _newAlbumFiles = await this.fsService.mergeFilesAndAlbums(albumFiles);
    if (!_newAlbumFiles) return;
    _newAlbumFiles.id = this.id;
    this.toggleSpinner();
    const res = await this.offersService.uploadOfferFiles(_newAlbumFiles);
    this.toggleSpinner();
    this.$_clearFiles.next();
    this.imageModalUtility.clearFiles(
      this.albums,
      content_id,
      type_id);
    const { data } = res;
    const { images, pdfs } = data;
    this.images = this.images.concat(images);
    this.pdf_documents = this.pdf_documents.concat(pdfs);
    this.offer.appendices = this.offer.appendices.concat(images);
    this.offer.appendices = this.offer.appendices.concat(pdfs);
    this.hasAppendices = this.offer.appendices.length > 0;
    this.offerSaved = true;
  }

  public saveDisabled = true; //used only for main offer form
  public saveStyle: any = {
    borderColor: "grey",
    color: "grey",
    stroke: "grey",
    opacity: 0.5,
  };
  setSaveEnabled() {
    this.saveDisabled = false;
    this.offersService.saveDisabled.next(false);
    this.saveStyle = {};
  }
  disableSave() {
    this.saveDisabled = true;
    this.offersService.saveDisabled.next(true);
    this.saveStyle = {
      borderColor: "grey",
      color: "grey",
      stroke: "grey",
      opacity: 0.5,
    };
  }
  disabledSaveCondition() {
    if (Object.keys(this.albums).length) {
      this.setSaveEnabled();
    } else {
      this.disableSave();
    }
  }

  changeDetected() {
    this.setSaveEnabled();
  }

  public swiper = {
    images: [],
    active: -1,
    album: -2,
    index: -1,
    parent: null,
  };

  isPDFViewer: boolean = false;
  openSwiper(index, files, album) {
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
  }

  closeSwiper() {
    this.swiper = {
      active: -1,
      images: [],
      album: -2,
      index: -1,
      parent: null,
    };
  }

  createFileArray(file) {
    const id = file.id;
    const comment = file.Description;
    const name = file.Name ? file.Name : file.name;
    // const image_path = file.image_path;
    const file_path = file.file_path ? file.file_path : file.file;

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

  findOfferStatus(){
    return this.projectStatusOptions.find((status) => status.id == this.offer.status);
  }

  @HostListener('document: click' , ['$event'])
  OndocumentClick(event: MouseEvent){

    if(!this.dropdownRef.nativeElement.contains(event.target)){
      this.templateOptionsOpened = false;
    }
    // else {
    //   this.templateOptionsOpened = true;
    // }

    if(!this.dropdownRef1.nativeElement.contains(event.target)){
      this.buttonToggleSend = false;
    }
  }
}
