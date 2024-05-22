import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  DoCheck,
} from "@angular/core";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { ProjectsService } from "../../../core/services/projects.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { User } from "src/app/core/models/user";
import { UsersService } from "src/app/core/services/users.service";
import { Client } from "src/app/core/models/client.model";
import { ClientsService } from "src/app/core/services/clients.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { SelectValidator } from "src/app/core/validator/select.validator";
import { AppService } from "src/app/core/services/app.service";
import { NoWhitespaceValidator } from "src/app/core/validator/no-whitespace.validator";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "../../../core/services/auth.service";
import { TabService } from "src/app/shared/directives/tab/tab.service";
import { NewClientProjectComponent } from "../new-project-client/new-project-client.component";
import { ClientProjectDetailsComponent } from "../client-project-details/client-project-details.component";
import { AESEncryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';
declare var $;

@Component({
  selector: "app-new-project",
  templateUrl: "./new-project.component.html",
  providers: [TabService],
  styleUrls: ["./new-project.component.css"],
})
export class NewProjectComponent implements OnInit, DoCheck {
  @ViewChild("myform", { static: true }) myform!: NgForm;
  public actionStatus = -1;
  public createForm: FormGroup;
  public userDetails: any;
  public responsiblePersons: User[] = [];
  public clients: Client[] = [];
  public client_workers: any = [];
  public showSelectClientWorker = false;
  public StartDate: any;
  public EndDate: any;
  public TehnicReview: any;
  public language = "en";
  public week = "Week";
  public offers: any[];
  public constructionForms: any[];
  public getDebitForms: any[];
  public componentVisibility: number = 0;
  public message: any;
  public messageErr: any;
  public messageCont: any;
  public clientCategories;
  public dropdownSettings;
  public dropdownSettingsSingleOption;
  public selectedClientWorkers = [];
  public generatedProjectNumber;
  public selectedAttestClientWorkers = [];
  public attest_workers = new Array(4).fill("");
  public company_workers: any[] = [];
  public selectedCoworkers: any[] = [];
  public spinner = false;
  public paymentTypeForVisible:any='Riktkostnad';
  public isShownProject: boolean = true;
  public isShownClient: boolean = true;
  public isShownAddress: boolean = true;
  public isShownEconomy: boolean = true;
  public someArrayForMainPerson = [];
  public project_relation:any = [];
  public contactPeopleSelected: any[] = [];
  public projectStatusOptions: {id: string, status: string}[] = [
    {id: "1", status: this.translate.instant("On Hold")},
    {id: "2", status: this.translate.instant("In Progress")},
    {id: "3", status: this.translate.instant("Completed")},
    {id: "4", status: this.translate.instant("Awaiting inspection")},
    {id: "5", status: this.translate.instant("Aborted")},
  ];
  public offerList: {id: string, status: string}[] = [
    // {id: "1", status: this.translate.instant("On Hold")},
    // {id: "2", status: this.translate.instant("In Progress")},
    // {id: "3", status: this.translate.instant("Completed")},
    // {id: "4", status: this.translate.instant("Awaiting inspection")},
    // {id: "5", status: this.translate.instant("Aborted")},
  ];
  public defaultConstructionForm: any[];
  public needToHaveOrangeBorder1: boolean = false;
  public needToHaveOrangeBorder2: boolean = false;
  public needToHaveOrangeBorder3: boolean = false;
  public needToHaveOrangeBorder4: boolean = false;
  public visible_payment_type:boolean = true;
  public payment_type:any;
  public generals;
  private isDatePickerInitialized = false;
  filteredOptions: Observable<Client[]>;
  @ViewChild("responsiblePerson") responsiblePersonRef: ElementRef;
  @ViewChild('dateSelectEndDate', { static: false }) dateSelectEndDate: ElementRef;
  @ViewChild('dateSelectStartDate', { static: false }) dateSelectStartDate: ElementRef;
  @ViewChild('dateSelectTehnicReview', { static: false }) dateSelectTehnicReview: ElementRef;

  constructor(
    private appService: AppService,
    private fb: FormBuilder,
    private projectsService: ProjectsService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UsersService,
    private clientsService: ClientsService,
    private translate: TranslateService,
    private authService: AuthService,
    private dialog: MatDialog,
    private AESEncryptDecryptService: AESEncryptDecryptService
  ) {
    this.language = sessionStorage.getItem("lang");
    if (this.language == "en") this.week = "Week";
    else this.week = "Vecka";
  }

  ngOnInit() {
    this.getProjectRelation();
    this.dropdownSettings = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      selectAllText: this.translate.instant("Select All"),
      unSelectAllText: this.translate.instant("Unselect All"),
      itemsShowLimit: 0,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText:
        this.translate.instant("No data available"),
      searchPlaceholderText: this.translate.instant("Search"),
    };
    this.generals = this.route.snapshot.data["generals"];
    this.clientCategories =
      this.route.snapshot.data["clientCategories"]["data"] || [];
    this.generatedProjectNumber = this.route.snapshot.data["getNextNumber"];

    this.getProjectManagers();
    this.getConstructionForm();
    this.getDebitForm();
    this.offers = this.route.snapshot.data["offers"].data;
    console.log(this.offers);

    this.offers.forEach(offer => {
      this.offerList.push({
        id: offer.id,
        status: `${offer.offerNum} ${offer.name}`
      });
    });

    this.createForm = this.fb.group(
      {
        name: [
          "",
          [Validators.required, NoWhitespaceValidator.noWhitespaceValidator],
        ],
        responsiblePerson: ["", []],
        responsiblePersonId: ["", []],
        deliveryContact: ["", [Validators.required]],
        deliveryContact_name: ["", [Validators.required]],
        street: ["", []],
        zip: ["", []],
        city: ["", []],
        parent: ["0", []],
        status: ["1", [Validators.required]],
        client_id: ["", [Validators.required]],
        client_id_name: ["", [Validators.required]],
        mainContactPerson: ["", []],
        payment_type: ["WEEKLY_REPORT", []],
        attestWorker2: ["", []],
        attestWorker3: ["", []],
        attestWorker4: ["", []],
        selectedMainContact: ["", [Validators.required]],
        StartDate: ["", [Validators.required]],
        EndDate: ["", [Validators.required]],
        TehnicReview: ["", []],
        CustomName: [
          this.generatedProjectNumber,
          [Validators.required, NoWhitespaceValidator.noWhitespaceValidator],
        ],
        ConstructionManagerID: ["", []],
        PlaceManagerID: ["", []],
        ClientConstructionManagerID: ["", []],
        ClientPlaceManagerID: ["", []],
        offer: ["", []],
        offerId: ["", []],
        construction_Id: ["1", []],
        debit_Id: ["1", []],
        ProjectSkilledHourlyRate: ["0"],
        ProjectWorkerHourlyRate: ["0"],
        AtaSkilledHourlyRate: ["0"],
        AtaWorkerHourlyRate: ["0"],
        chargeMaterial: ["0", []],
        ataChargeMaterial: ["0", []],
        ataChargeUE: ["0", []],
        chargeEquipment: ["0", []],
        chargeUE: ["0", []],
        skvId: ["0", []],
        invoice_reference_name: ["", []],
        clientsProjectName: ["", []],
        clientProjectNumber: ["", []],
        tenderSum: ["0", []],
        contractAmount: ["0", []],
        resursKonto1: ["0", []],
        resursKonto2: ["0", []],
        estimatedRunTime: ["0", []],
        estimatedFixTime: ["0", []],
        clientCity: ["", []],
        clientStreet: ["", []],
        clientZip: ["", []],
        internalProject: [false, []],
        connect_with_moments: [false, []],
        nameAndNumber1Check: [false, []],
        nameAndNumber2Check: [false, []],
        invoice_reference: ["", []],
        project_relation: [0, []],
        project_relation_name: ["", []],
      },
      {
        validator: [
          SelectValidator.selectStatusValidator,
          SelectValidator.selectResposibleValidator,
        ],
      }
    );

    this.getClient();

    this.initDatePickers();

    this.clientsService.showNewClientForm.subscribe((val) => {
      this.componentVisibility = val;
    });

    this.clientsService.client.subscribe((data) => {

        if (data != null && data["Name"]) {
            if (typeof data === "object") {
                data["finalName"] = data["Name"];
            }
            data.name = data.Name;
            this.clients.push(data);
        }
    });

    this.clientsService.clientWorker.subscribe((data) => {
      if (data != null) {
        this.client_workers.push(data);
        this.client_workers = this.client_workers.slice(0);
      }
    });
    this.appService.setBackRoute("projects");
    this.appService.setShowAddButton = false;
    document.addEventListener("keydown", this.getSelected.bind(this));
  }

    getSelected(event) {


        if(event.srcElement.localName == 'textarea') {
        return;
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

            event.preventDefault()
        }
    }

    private initDatePickers() {
      const endDatePicker = this.dateSelectEndDate?.nativeElement;
      const startDatePicker = this.dateSelectStartDate?.nativeElement;
      const dateSelectTehnicReview = this.dateSelectTehnicReview?.nativeElement;

      if (this.isDatePickerInitialized) {
        $(endDatePicker).datepicker('destroy');
        $(startDatePicker).datepicker('destroy');
        $(dateSelectTehnicReview).datepicker('destroy');
      }

      $(startDatePicker)
      .datepicker({
        format: "yyyy-mm-dd",
        calendarWeeks: true,
        autoclose: true,
        language: this.language,
        currentWeek: true,
        currentWeekTransl: this.week,
        todayHighlight: true,
        currentWeekSplitChar: "-",
        weekStart: 1,
      })
      .on("changeDate", (ev) => {
        if (
          Date.parse(ev.target.value.split(" ")[0]) >
          Date.parse(this.createForm.value.EndDate.split(" ")[0])
        ) {
          setTimeout(() => {
            this.toastr.info(
              this.translate.instant("Start date cannot be after end date."),
              this.translate.instant("Info")
            );
            ev.target.value = this.createForm.value.StartDate;
          }, 0);
        } else {
          this.createForm.get("StartDate").patchValue(ev.target.value);
          this.StartDate = ev.target.value;
        }
      });

    $(endDatePicker)
      .datepicker({
        format: "yyyy-mm-dd",
        calendarWeeks: true,
        autoclose: true,
        language: this.language,
        currentWeek: true,
        currentWeekTransl: this.week,
        todayHighlight: true,
        currentWeekSplitChar: "-",
        weekStart: 1,
      })
      .on("changeDate", (ev) => {
        if (
          Date.parse(ev.target.value.split(" ")[0]) <
          Date.parse(this.createForm.value.StartDate.split(" ")[0])
        ) {
          setTimeout(() => {
            this.toastr.info(
              this.translate.instant("End date cannot be before start date."),
              this.translate.instant("Info")
            );
            ev.target.value = this.createForm.value.EndDate;
          }, 0);
        } else {
          this.createForm.get("EndDate").patchValue(ev.target.value);
          this.EndDate = ev.target.value;
        }
      });

    $(dateSelectTehnicReview)
      .datepicker({
        format: "yyyy-mm-dd",
        calendarWeeks: true,
        autoclose: true,
        language: this.language,
        currentWeek: true,
        currentWeekTransl: this.week,
        todayHighlight: true,
        currentWeekSplitChar: "-",
        weekStart: 1,
      })
      .on("changeDate", (ev) => {
        this.createForm.get("TehnicReview").patchValue(ev.target.value);
        this.TehnicReview = ev.target.value;
      });

      this.isDatePickerInitialized = true;
    }

  ngOnDestroy() {
    this.hideBodyScroll("auto");
  }

  hideBodyScroll(overflow) {
    document.body.style.overflow = overflow;
  }

  ngDoCheck(): void {
    /**
     *     Ispod je code za checkboxove koji ce biti unutar resource accoutn
     *     (name and number 1   &   name and numbrer 2)
     */

    if (
      this.createForm.get("resursKonto1").value &&
      this.createForm.get("resursKonto1").value != 0
    ) {
      if (
        !this.createForm.get("resursKonto2").value ||
        this.createForm.get("resursKonto2").value == 0
      ) {
        this.createForm.get("nameAndNumber1Check").patchValue(true);
      }
    }

    if (
      this.createForm.get("resursKonto2").value &&
      this.createForm.get("resursKonto2").value != 0
    ) {
      if (
        !this.createForm.get("resursKonto1").value ||
        this.createForm.get("resursKonto1").value == 0
      ) {
        this.createForm.get("nameAndNumber2Check").patchValue(true);
      }
    }

    if (
      (!this.createForm.get("resursKonto1").value ||
        this.createForm.get("resursKonto1").value == 0) &&
      this.createForm.get("resursKonto2").value &&
      this.createForm.get("resursKonto2").value != 0
    ) {
      this.createForm.get("nameAndNumber1Check").patchValue(false);
      this.createForm.get("nameAndNumber2Check").patchValue(true);
    }

    if (
      (!this.createForm.get("resursKonto2").value ||
        this.createForm.get("resursKonto2").value == 0) &&
      this.createForm.get("resursKonto1").value &&
      this.createForm.get("resursKonto1").value != 0
    ) {
      this.createForm.get("nameAndNumber1Check").patchValue(true);
      this.createForm.get("nameAndNumber2Check").patchValue(false);
    }

    if (
      !this.createForm.get("resursKonto1").value ||
      this.createForm.get("resursKonto1").value == 0
    ) {
      this.createForm.get("nameAndNumber1Check").patchValue(false);
    }

    if (
      !this.createForm.get("resursKonto2").value ||
      this.createForm.get("resursKonto2").value == 0
    ) {
      this.createForm.get("nameAndNumber2Check").patchValue(false);
    }
  }

    public onCloseClick() {
        this.clientsService.setComponentVisibility(0);
    }

    ngAfterViewInit() {
        this.initDatePickers();
    }

    getClient() {
        this.clientsService.getClients().subscribe((response) => {

            this.clients = response["data"].map((client) => {
                client["finalName"] = client["Name"];
                return client;
            });
        });
    }

  selectedClient: any;
  disabled = false;
  //client_id

  offerClientWorker;
  setContactPersons(Client) {
    // const client = client_id.value;

    this.selectedClient = Client;
    this.createForm.get("client_id").setValue(Client.Id);
    this.createForm.get("client_id_name").setValue(Client.name);
    

    const client = Client.Id;
    if (client !== "-1") {
      this.clientsService.getClientWorkers(client).subscribe((response) => {
        if (!response["data"]) return;
        this.client_workers = response["data"].map((worker) => {
          const name =
            worker.FirstName +
            " " +
            worker.LastName +
            (worker.Title ? " - " + worker.Title : "");
          return {
            Id: worker.Id,
            id: worker.Id,
            Name: name,
            finalName: name,
          };
        });

        this.contactPeopleSelected = [...this.client_workers];
        this.selectedClientWorkers = [];
        this.offerClientWorker = this.contactPeopleSelected.find(x => x.Id === Client.client_worker_id);
        this.selectedClientWorkers = [...this.selectedClientWorkers, {...this.offerClientWorker, checked: true}];
        this.showSelectClientWorker = true;
      });
    } else {
      this.client_workers = [];
      this.showSelectClientWorker = true;
      this.selectedClientWorkers = [];
    }
  }

  getProjectManagers() {
    this.userService.getProjectManagers().subscribe((response) => {
      this.responsiblePersons = response["data"].map((person) => {
        person["finalName"] = person["username"];
        return person;
      });

      this.company_workers = this.responsiblePersons.map((user) => {
        return {
          Id: user.id,
          Name: user.username + " " + user.role,
        };
      });
    });
  }

  setSelectedMainContact() {
    for (let i = this.attest_workers.length - 1; i >= 0; i--) {
      if (this.attest_workers[i] !== "" && this.attest_workers[i] !== "0") {
        this.createForm.controls.selectedMainContact.setValue(
          this.attest_workers[i]
        );
        return;
      }
    }

    this.createForm.controls.selectedMainContact.setValue("");
  }

  selectAttestWorker1(client_id) {
    if (
      client_id == "" &&
      this.attest_workers[0] ==
        this.createForm.controls.selectedMainContact.value
    ) {
      this.attest_workers[0] = client_id;
      this.setSelectedMainContact();
    } else {
      const oldClientId = this.attest_workers[0];
      setTimeout(() => {
        if (
          this.createForm.controls.selectedMainContact.value == "" ||
          this.createForm.controls.selectedMainContact.value == oldClientId
        )
          this.createForm.controls.selectedMainContact.setValue(client_id);
      }, 0);
      this.attest_workers[0] = client_id;
    }
  }

  selectAttestWorker2(client_id) {
    if (
      client_id == "" &&
      this.attest_workers[1] ==
        this.createForm.controls.selectedMainContact.value
    ) {
      this.attest_workers[1] = client_id;
      this.setSelectedMainContact();
    } else {
      const oldClientId = this.attest_workers[1];
      setTimeout(() => {
        if (
          this.createForm.controls.selectedMainContact.value == "" ||
          this.createForm.controls.selectedMainContact.value == oldClientId
        )
          this.createForm.controls.selectedMainContact.setValue(client_id);
      }, 0);
      this.attest_workers[1] = client_id;
    }
  }

  selectAttestWorker3(client_id) {
    if (
      client_id == "" &&
      this.attest_workers[2] ==
        this.createForm.controls.selectedMainContact.value
    ) {
      this.attest_workers[2] = client_id;
      this.setSelectedMainContact();
    } else {
      const oldClientId = this.attest_workers[2];
      setTimeout(() => {
        if (
          this.createForm.controls.selectedMainContact.value == "" ||
          this.createForm.controls.selectedMainContact.value == oldClientId
        )
          this.createForm.controls.selectedMainContact.setValue(client_id);
      }, 0);
      this.attest_workers[2] = client_id;
    }
  }

  selectAttestWorker4(client_id) {
    if (
      client_id == "" &&
      this.attest_workers[3] ==
        this.createForm.controls.selectedMainContact.value
    ) {
      this.attest_workers[3] = client_id;
      this.setSelectedMainContact();
    } else {
      const oldClientId = this.attest_workers[3];
      setTimeout(() => {
        if (
          this.createForm.controls.selectedMainContact.value == "" ||
          this.createForm.controls.selectedMainContact.value == oldClientId
        )
          this.createForm.controls.selectedMainContact.setValue(client_id);
      }, 0);
      this.attest_workers[3] = client_id;
    }
  }

  toggleAttestWorkerHidden(event, formControlName) {
    if (event.status === true) {
      this.createForm.get(formControlName).patchValue(event.Id);
      if (!this.createForm.get("selectedMainContact").value) {
        if (formControlName === "mainContactPerson") {
          this.needToHaveOrangeBorder1 = true;
        } else if (formControlName === "attestWorker2") {
          this.needToHaveOrangeBorder2 = true;
        } else if (formControlName === "attestWorker3") {
          this.needToHaveOrangeBorder3 = true;
        } else {
          this.needToHaveOrangeBorder4 = true;
        }
        this.createForm.get("selectedMainContact").patchValue(event.Id);
      }
    } else {
      this.createForm.get(formControlName).patchValue("");
    }

    this.contactPeopleSelected = this.contactPeopleSelected.map((worker) => {
      if (worker.Id == event.Id) {
        return { ...worker, hidden: event.status };
      }
      return worker;
    });

    this.someArrayForMainPerson.push(event);
    if (
      this.someArrayForMainPerson[this.someArrayForMainPerson.length - 2]
        ?.status == false &&
      this.someArrayForMainPerson[this.someArrayForMainPerson.length - 2].Id ==
        this.createForm.get("selectedMainContact").value
    ) {
      this.createForm
        .get("selectedMainContact")
        .patchValue(
          this.someArrayForMainPerson[this.someArrayForMainPerson.length - 1].Id
        );
    }
  }

  toggleEmptyWorkerParent(num) {
    if (
      num === 0 &&
      this.createForm.get("mainContactPerson").value ===
        this.createForm.get("selectedMainContact").value
    ) {
      this.needToHaveOrangeBorder1 = false;
      if (this.createForm.get("attestWorker2").value) {
        this.needToHaveOrangeBorder2 = true;
        this.createForm
          .get("selectedMainContact")
          .patchValue(this.createForm.get("attestWorker2").value);
      } else if (this.createForm.get("attestWorker3").value) {
        this.needToHaveOrangeBorder3 = true;
        this.createForm
          .get("selectedMainContact")
          .patchValue(this.createForm.get("attestWorker3").value);
      } else if (this.createForm.get("attestWorker4").value) {
        this.needToHaveOrangeBorder4 = true;
        this.createForm
          .get("selectedMainContact")
          .patchValue(this.createForm.get("attestWorker4").value);
      } else {
        this.needToHaveOrangeBorder1 = false;
        this.needToHaveOrangeBorder2 = false;
        this.needToHaveOrangeBorder3 = false;
        this.needToHaveOrangeBorder4 = false;
        this.createForm.get("selectedMainContact").patchValue("");
      }
    }

    if (
      num === 1 &&
      this.createForm.get("attestWorker2").value ===
        this.createForm.get("selectedMainContact").value
    ) {
      this.needToHaveOrangeBorder2 = false;
      if (this.createForm.get("attestWorker3").value) {
        this.needToHaveOrangeBorder3 = true;
        this.createForm
          .get("selectedMainContact")
          .patchValue(this.createForm.get("attestWorker3").value);
      } else if (this.createForm.get("attestWorker4").value) {
        this.needToHaveOrangeBorder4 = true;
        this.createForm
          .get("selectedMainContact")
          .patchValue(this.createForm.get("attestWorker4").value);
      } else if (this.createForm.get("mainContactPerson").value) {
        this.needToHaveOrangeBorder1 = true;
        this.createForm
          .get("selectedMainContact")
          .patchValue(this.createForm.get("mainContactPerson").value);
      } else {
        this.needToHaveOrangeBorder1 = false;
        this.needToHaveOrangeBorder2 = false;
        this.needToHaveOrangeBorder3 = false;
        this.needToHaveOrangeBorder4 = false;
        this.createForm.get("selectedMainContact").patchValue("");
      }
    }

    if (
      num === 2 &&
      this.createForm.get("attestWorker3").value ===
        this.createForm.get("selectedMainContact").value
    ) {
      this.needToHaveOrangeBorder3 = false;
      if (this.createForm.get("attestWorker4").value) {
        this.needToHaveOrangeBorder4 = true;
        this.createForm
          .get("selectedMainContact")
          .patchValue(this.createForm.get("attestWorker4").value);
      } else if (this.createForm.get("mainContactPerson").value) {
        this.needToHaveOrangeBorder1 = true;
        this.createForm
          .get("selectedMainContact")
          .patchValue(this.createForm.get("mainContactPerson").value);
      } else if (this.createForm.get("attestWorker2").value) {
        this.needToHaveOrangeBorder2 = true;
        this.createForm
          .get("selectedMainContact")
          .patchValue(this.createForm.get("attestWorker2").value);
      } else {
        this.needToHaveOrangeBorder1 = false;
        this.needToHaveOrangeBorder2 = false;
        this.needToHaveOrangeBorder3 = false;
        this.needToHaveOrangeBorder4 = false;
        this.createForm.get("selectedMainContact").patchValue("");
      }
    }

    if (
      num === 3 &&
      this.createForm.get("attestWorker4").value ===
        this.createForm.get("selectedMainContact").value
    ) {
      this.needToHaveOrangeBorder4 = false;
      if (this.createForm.get("attestWorker3").value) {
        this.needToHaveOrangeBorder3 = true;
        this.createForm
          .get("selectedMainContact")
          .patchValue(this.createForm.get("attestWorker3").value);
      } else if (this.createForm.get("attestWorker2").value) {
        this.needToHaveOrangeBorder2 = true;
        this.createForm
          .get("selectedMainContact")
          .patchValue(this.createForm.get("attestWorker2").value);
      } else if (this.createForm.get("mainContactPerson").value) {
        this.needToHaveOrangeBorder1 = true;
        this.createForm
          .get("selectedMainContact")
          .patchValue(this.createForm.get("mainContactPerson").value);
      } else {
        this.needToHaveOrangeBorder1 = false;
        this.needToHaveOrangeBorder2 = false;
        this.needToHaveOrangeBorder3 = false;
        this.needToHaveOrangeBorder4 = false;
        this.createForm.get("selectedMainContact").patchValue("");
      }
    }

    switch (num) {
      case 0:
        this.createForm.get("mainContactPerson").patchValue("");
        break;
      case 1:
        this.createForm.get("attestWorker2").patchValue("");
        break;
      case 2:
        this.createForm.get("attestWorker3").patchValue("");
        break;
      default:
        this.createForm.get("attestWorker4").patchValue("");
    }
  }

  toggleDeletedFromArrayParent(num: number) {
    if (num === 0) {
      if (
        this.createForm.get("mainContactPerson").value ===
        this.createForm.get("selectedMainContact").value
      ) {
        this.createForm.get("mainContactPerson").patchValue("");
        this.createForm.get("selectedMainContact").patchValue("");
        this.toggleEmptyWorkerParent(0);
      } else {
        this.createForm.get("mainContactPerson").patchValue("");
      }
    }

    if (num === 1) {
      if (
        this.createForm.get("attestWorker2").value ===
        this.createForm.get("selectedMainContact").value
      ) {
        this.createForm.get("attestWorker2").patchValue("");
        this.createForm.get("selectedMainContact").patchValue("");
        this.toggleEmptyWorkerParent(1);
      } else {
        this.createForm.get("attestWorker2").patchValue("");
      }
    }

    if (num === 2) {
      if (
        this.createForm.get("attestWorker3").value ===
        this.createForm.get("selectedMainContact").value
      ) {
        this.createForm.get("attestWorker3").patchValue("");
        this.createForm.get("selectedMainContact").patchValue("");
        this.toggleEmptyWorkerParent(2);
      } else {
        this.createForm.get("attestWorker3").patchValue("");
      }
    }

    if (num === 3) {
      if (
        this.createForm.get("attestWorker4").value ===
        this.createForm.get("selectedMainContact").value
      ) {
        this.createForm.get("attestWorker4").patchValue("");
        this.createForm.get("selectedMainContact").patchValue("");
        this.toggleEmptyWorkerParent(3);
      } else {
        this.createForm.get("attestWorker4").patchValue("");
      }
    }
  }

    filterAttesWorker1() {
        return this.selectedClientWorkers.filter((worker) => {
            return (
                this.attest_workers[1] != worker.Id &&
                this.attest_workers[2] != worker.Id &&
                this.attest_workers[3] != worker.Id
            );
        });
    }

    filterAttesWorker2() {
        return this.selectedClientWorkers.filter((worker) => {
            return (
                this.attest_workers[0] != worker.Id &&
                this.attest_workers[2] != worker.Id &&
                this.attest_workers[3] != worker.Id
            );
        });
    }

    filterAttesWorker3() {
        return this.selectedClientWorkers.filter((worker) => {
            return (
                this.attest_workers[1] != worker.Id &&
                this.attest_workers[0] != worker.Id &&
                this.attest_workers[3] != worker.Id
            );
        });
    }

    filterAttesWorker4() {
        return this.selectedClientWorkers.filter((worker) => {
            return (
                this.attest_workers[1] != worker.Id &&
                this.attest_workers[0] != worker.Id &&
                this.attest_workers[2] != worker.Id
            );
        });
    }

    setValidation() {
        let internal_project = this.createForm.get("internalProject").value;

        if(internal_project) {
            this.createForm.controls['client_id'].clearValidators();
            this.createForm.get('client_id').updateValueAndValidity();
            this.createForm.controls['client_id_name'].clearValidators();
            this.createForm.get('client_id_name').updateValueAndValidity();
            this.createForm.controls['selectedMainContact'].clearValidators();
            this.createForm.get('selectedMainContact').updateValueAndValidity();
        }else {
            this.createForm.get('client_id').setValidators([Validators.required]);
            this.createForm.get('client_id').updateValueAndValidity();
            this.createForm.get('client_id_name').setValidators([Validators.required]);
            this.createForm.get('client_id_name').updateValueAndValidity();
            this.createForm.get('selectedMainContact').setValidators([Validators.required]);
            this.createForm.get('selectedMainContact').updateValueAndValidity();
        }
    }

    async createProject() {

        if (this.createForm.invalid || this.selectedCoworkers.length < 1) {
        setTimeout(() => {
            const isInvalid = document.querySelector(".is-invalid");
            isInvalid
            ? isInvalid.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest",
                })
            : "";
        }, 100);
        return;
        }

        this.createForm.value.StartDate = this.StartDate || "";
        this.createForm.value.EndDate = this.EndDate || "";
        this.createForm.value.TehnicReview = this.TehnicReview || "";
        this.showSelectClientWorker = true;

        if (this.selectedCoworkers.length > 0) {
        let res_person = this.selectedCoworkers[0];
        let user_name =
            res_person["Name"].split(" ")[0] +
            " " +
            res_person["Name"].split(" ")[1];
        this.createForm.get("responsiblePerson").patchValue(user_name);
        this.createForm.get("responsiblePersonId").patchValue(res_person["Id"]);
        }

        const data = this.createForm.value;

        const isTaken = (
        (await this.projectsService.checkIfProjectNumberIsTaken(
            data.CustomName
        )) as any
        ).isTaken;

        if (isTaken) {
        this.toastr.error("Project number in use, choose another one.", "Error");
        return;
        }

        if (!data.CustomName.startsWith("P")) {
        this.toastr.error(
            "Project numbers must start with the letter 'P'.",
            "Error"
        );
        return;
        }

        if (this.selectedClientWorkers.length < 1 && this.createForm.invalid) {
        this.toastr.error(
            "You must select at least one client contact person.",
            "Error"
        );
        return;
        }

        if (data.responsiblePersonId) {
        data.clientWorkers = this.selectedClientWorkers;
        data.companyWorkers = this.selectedCoworkers;

        (data.tenderSum =
            data.tenderSum === ""
            ? 0
            : data.tenderSum.toString().replace(/\s/g, "").replace(",", ".")),
            (data.contractAmount =
            data.contractAmount === ""
                ? 0
                : data.contractAmount
                    .toString()
                    .replace(/\s/g, "")
                    .replace(",", ".")),
            (data.ProjectSkilledHourlyRate =
            data.ProjectSkilledHourlyRate === ""
                ? 0
                : data.ProjectSkilledHourlyRate.toString()
                    .replace(/\s/g, "")
                    .replace(",", ".")),
            (data.ProjectWorkerHourlyRate =
            data.ProjectWorkerHourlyRate === ""
                ? 0
                : data.ProjectWorkerHourlyRate.toString()
                    .replace(/\s/g, "")
                    .replace(",", ".")),
            (data.AtaSkilledHourlyRate =
            data.AtaSkilledHourlyRate === ""
                ? 0
                : data.AtaSkilledHourlyRate.toString()
                    .replace(/\s/g, "")
                    .replace(",", ".")),
            (data.AtaWorkerHourlyRate =
            data.AtaWorkerHourlyRate === ""
                ? 0
                : data.AtaWorkerHourlyRate.toString()
                    .replace(/\s/g, "")
                    .replace(",", ".")),
            (data.chargeMaterial =
            data.chargeMaterial === ""
                ? 0
                : data.chargeMaterial
                    .toString()
                    .replace(/\s/g, "")
                    .replace(",", ".")),
            (data.ataChargeMaterial =
            data.ataChargeMaterial === ""
                ? 0
                : data.ataChargeMaterial
                    .toString()
                    .replace(/\s/g, "")
                    .replace(",", ".")),
            (data.ataChargeUE =
            data.ataChargeUE === ""
                ? 0
                : data.ataChargeUE.toString().replace(/\s/g, "").replace(",", ".")),
            (data.chargeEquipment =
            data.chargeEquipment === ""
                ? 0
                : data.chargeEquipment
                    .toString()
                    .replace(/\s/g, "")
                    .replace(",", ".")),
            (data.chargeUE =
            data.chargeUE === ""
                ? 0
                : data.chargeUE.toString().replace(/\s/g, "").replace(",", ".")),
            (data.estimatedRunTime =
            data.estimatedRunTime === ""
                ? 0
                : data.estimatedRunTime
                    .toString()
                    .replace(/\s/g, "")
                    .replace(",", ".")),
            (data.estimatedFixTime =
            data.estimatedFixTime === ""
                ? 0
                : data.estimatedFixTime
                    .toString()
                    .replace(/\s/g, "")
                    .replace(",", ".")),
            (this.spinner = true);

        this.projectsService.createProject(data).then(async (res) => {

            this.actionStatus = res["status"] ? 1 : 0;
            sessionStorage.setItem("currentTab", "0");

            if (this.actionStatus) {
            await this.userCheck(res["ProjectID"]);
            this.toastr.success(
                this.translate.instant("You have successfully created a project!"),
                "Projekt"
            );

            this.router.navigate(["/projects/view/", res["ProjectID"]]);
            } else {
            this.toastr.error(
                this.translate.instant("There was an error with creating project."),
                this.translate.instant("Error")
            );
            }

            this.spinner = false;
        });
        } else {
        this.toastr.error(
            this.translate.instant("You must select a contact person!"),
            this.translate.instant("Error")
        );
        }
    }

  openComponentDetail(e) {
    e.preventDefault();
    scroll(0, 0);
    this.clientsService.setComponentVisibility(1);
  }

  openWorkerDetail(e) {
    e.preventDefault();
    scroll(0, 0);
    this.clientsService.client.next(this.createForm.value.client_id);
    this.clientsService.setComponentVisibility(2);
  }

  getConstructionForm() {
    this.projectsService.getConstructionForm().then((response) => {
      this.constructionForms = response["data"];
    });
  }
  getDebitForm() {
    this.projectsService.getDebitForm().then((response) => {
      this.getDebitForms = response["data"].filter((item) => {
        return item.Id != 6;
      });
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
    const control = this.createForm.get(input);
    return (
      (this.myform.submitted && control.invalid) ||
      (control.dirty && control.invalid)
    );
  }

  toggleProject() {
    this.isShownProject = !this.isShownProject;
    if (this.isDatePickerInitialized) {
      setTimeout(() => {
        this.initDatePickers();
      }, 0);
    }
  }

  toggleClient() {
    this.isShownClient = !this.isShownClient;
  }

  toggleAddress() {
    this.isShownAddress = !this.isShownAddress;
  }

  toggleEconomy() {
    this.isShownEconomy = !this.isShownEconomy;
  }

  prepareForSelect(array) {
    return array.map((item) => ({ key: item.Name, value: item.Id }));
  }

  onItemDeSelect(item) {
    this.contactPeopleSelected = this.contactPeopleSelected.filter((worker) => {
      return worker.Id !== item.Id;
    });
  }

  parentArray: string[];
  onItemSelect(item: string[]) {
    this.parentArray = item;
    this.contactPeopleSelected = this.parentArray;
    this.selectedClientWorkers = this.contactPeopleSelected;
    //this.contactPeopleSelected.push(item);
  }

  onSelectAll(items) {
    this.contactPeopleSelected = items;
    this.selectedClientWorkers = items;

    this.contactPeopleSelected.forEach((contactPeople) => {
      if (this.createForm.get("mainContactPerson").value) {
        if (
          this.createForm.get("mainContactPerson").value == contactPeople.Id
        ) {
          contactPeople.hidden = true;
        }
      }

      if (this.createForm.get("attestWorker2").value) {
        if (this.createForm.get("attestWorker2").value == contactPeople.Id) {
          contactPeople.hidden = true;
        }
      }

      if (this.createForm.get("attestWorker3").value) {
        if (this.createForm.get("attestWorker3").value == contactPeople.Id) {
          contactPeople.hidden = true;
        }
      }

      if (this.createForm.get("attestWorker4").value) {
        if (this.createForm.get("attestWorker4").value == contactPeople.Id) {
          contactPeople.hidden = true;
        }
      }
    });
  }

  onDeSelectAll(items) {
    this.contactPeopleSelected = items;
    this.selectedClientWorkers = items;
  }

  onItemDeSelectContactPersone(item) {
    this.selectedCoworkers = this.selectedCoworkers.filter((worker) => {
      return worker.Id !== item.Id;
    });
  }

  selectedCoworkersArray: string[];
  onItemSelectContactPersone(item) {
    this.selectedCoworkersArray = item;
    this.selectedCoworkers = this.selectedCoworkersArray;

    // this.selectedCoworkers.push(item);
  }

  onSelectAllContactPersone(items) {
    this.selectedCoworkers = items;

    this.selectedCoworkers.forEach((contactPeople) => {
      if (this.createForm.get("mainContactPerson").value) {
        if (
          this.createForm.get("mainContactPerson").value == contactPeople.Id
        ) {
          contactPeople.hidden = true;
        }
      }

      if (this.createForm.get("attestWorker2").value) {
        if (this.createForm.get("attestWorker2").value == contactPeople.Id) {
          contactPeople.hidden = true;
        }
      }

      if (this.createForm.get("attestWorker3").value) {
        if (this.createForm.get("attestWorker3").value == contactPeople.Id) {
          contactPeople.hidden = true;
        }
      }

      if (this.createForm.get("attestWorker4").value) {
        if (this.createForm.get("attestWorker4").value == contactPeople.Id) {
          contactPeople.hidden = true;
        }
      }
    });
  }

  onDeSelectAllContactPersone(items) {
    this.selectedCoworkers = items;
  }

  projectStatusSelected(selectedStatus, formControlName) {
    this.createForm.get(formControlName).patchValue(selectedStatus.id);
  }

  contactPersonFromOffer;
  offerSelected(selected, formControlName) {
    const offerSelected = this.offers.find((offer) => offer.id == selected.id);
    this.setContactPersons({
      Id: offerSelected.client_id,
      name: offerSelected.cl_name,
      client_worker_id: offerSelected.client_worker_id
    });
    this.createForm.get("clientsProjectName").patchValue(offerSelected.clientsProjectName);
    this.createForm.get("clientProjectNumber").patchValue(offerSelected.clientProjectNumber);
    this.createForm.get("resursKonto1").patchValue(offerSelected.ResourceAccount);

    this.createForm.get("street").patchValue(offerSelected.street);
    this.createForm.get("zip").patchValue(offerSelected.zip);
    this.createForm.get("city").patchValue(offerSelected.city);

    this.createForm.get("clientStreet").patchValue(offerSelected.street2);
    this.createForm.get("clientZip").patchValue(offerSelected.zip2);
    this.createForm.get("clientCity").patchValue(offerSelected.city2);

    this.createForm.get("estimatedRunTime").patchValue(offerSelected.estimatedRunTime);
    this.createForm.get("estimatedFixTime").patchValue(offerSelected.estimatedFixTime);

    this.createForm.get("ProjectSkilledHourlyRate").patchValue(offerSelected.SkilledHourlyRate);
    this.createForm.get("ProjectWorkerHourlyRate").patchValue(offerSelected.WorkerHourlyRate);
    this.createForm.get("chargeMaterial").patchValue(offerSelected.chargeMaterial);
    this.createForm.get("chargeUE").patchValue(offerSelected.chargeUE);

    this.createForm.get("AtaSkilledHourlyRate").patchValue(offerSelected.AtaSkilledHourlyRate);
    this.createForm.get("AtaWorkerHourlyRate").patchValue(offerSelected.AtaWorkerHourlyRate);
    this.createForm.get("ataChargeMaterial").patchValue(offerSelected.ATAchargeMaterial);
    this.createForm.get("ataChargeUE").patchValue(offerSelected.ATAchargeUE);
    this.createForm.get('tenderSum').patchValue(offerSelected.article_total);

    this.createForm.get("offer").patchValue(selected.status);
    this.createForm.get("offerId").patchValue(selected.id);
    this.contactPersonFromOffer = offerSelected.userWithPermission;
  }

  constructionFormSelected(selectedConsForm, formControlName) {
    this.createForm.get(formControlName).patchValue(selectedConsForm.Id);
  }

  setVisiblePaymentType() {
    if(this.paymentTypeForVisible == 'Riktkostnad') {
      this.visible_payment_type = true;
    }else {
      this.visible_payment_type = false;
    }
    this.payment_type = null;
  }

  selectDebitForm(selectedDebit, formControlName) {
    this.createForm.get(formControlName).patchValue(selectedDebit.Id);
    this.visible_payment_type = true;
    this.payment_type = selectedDebit.Name;
    this.paymentTypeForVisible= selectedDebit.Name;
  }

  selectDeliveryContact(
    selectedDelivery,
    formControlNameId,
    formControlNameName
  ) {
    this.createForm.get(formControlNameId).patchValue(selectedDelivery.id);
    this.createForm
      .get(formControlNameName)
      .patchValue(selectedDelivery.username);
  }

  hasResourceAccount() {
    if (
      this.createForm.get("resursKonto1").value &&
      this.createForm.get("resursKonto1").value != 0 &&
      this.createForm.get("resursKonto2").value &&
      this.createForm.get("resursKonto2").value != 0
    ) {
      return true;
    }
    return false;
  }

  onNameAndNumber1() {
    if (this.createForm.get("nameAndNumber2Check").value) {
      this.createForm.get("nameAndNumber2Check").patchValue(false);
    }
  }

  onNameAndNumber2() {
    if (this.createForm.get("nameAndNumber1Check").value) {
      this.createForm.get("nameAndNumber1Check").patchValue(false);
    }
  }

  getDefaultDebitForm() {
    const defaultDebForm =
      this.getDebitForms != null
        ? this.getDebitForms[0]
        : { Id: "1", Name: "Löpande räkning" };
    return defaultDebForm;
  }

  onChangesStartDate(): void {
    const val = this.createForm.get("StartDate").value;
    if (val) {
      const EndDate = new Date(val.split(" ")[0]);
      $("#dateSelectEndDate").datepicker("setDate", new Date(EndDate));
    }
  }

  svgBorderChange(num: number) {
    switch (num) {
      case 1:
        this.needToHaveOrangeBorder1 = true;
        this.needToHaveOrangeBorder2 = false;
        this.needToHaveOrangeBorder3 = false;
        this.needToHaveOrangeBorder4 = false;
        break;
      case 2:
        this.needToHaveOrangeBorder1 = false;
        this.needToHaveOrangeBorder2 = true;
        this.needToHaveOrangeBorder3 = false;
        this.needToHaveOrangeBorder4 = false;
        break;
      case 3:
        this.needToHaveOrangeBorder1 = false;
        this.needToHaveOrangeBorder2 = false;
        this.needToHaveOrangeBorder3 = true;
        this.needToHaveOrangeBorder4 = false;
        break;
      default:
        this.needToHaveOrangeBorder1 = false;
        this.needToHaveOrangeBorder2 = false;
        this.needToHaveOrangeBorder3 = false;
        this.needToHaveOrangeBorder4 = true;
    }
  }

  selectClientContact(e, formControlId, formControlName) {
    this.createForm.get(formControlId).patchValue(e.Id);
    this.createForm.get(formControlName).patchValue(e.Company);
  }

  focusSearch() {
    const li = document.getElementsByClassName("filter-textbox")[0];
    const search: any = li.firstChild;
    search.focus();
  }

  GetDeliveryContact(selectedClient) {
    this.createForm.get("deliveryContact").setValue(selectedClient.value);
    this.createForm.get("deliveryContact_name").setValue(selectedClient.name);
  }

  GetFakturaRef(selectedFakturaRef) {
    this.createForm.get("invoice_reference").setValue(selectedFakturaRef.Id);
    this.createForm
      .get("invoice_reference_name")
      .setValue(selectedFakturaRef.name);
  }

  openProjectClientDetailsModal($event) {
    $event.preventDefault();
    this.clientsService.client.next(this.createForm.value.client_id);
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.panelClass = "custom-modalbox-client-detail";
    diaolgConfig.autoFocus = false;
    diaolgConfig.width = "";
    diaolgConfig.height = "auto";
    diaolgConfig.disableClose = false;
    diaolgConfig.data = {
      clientCategories: this.clientCategories,
    };
    this.dialog.open(ClientProjectDetailsComponent, diaolgConfig);
  }

  openNewClientModal($event) {
    $event.preventDefault();
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.panelClass = "custom-modalbox-new-client";
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.height = "700px";
    diaolgConfig.data = {
      clientCategories: this.clientCategories,
    };
    this.dialog.open(NewClientProjectComponent, diaolgConfig);
  }

  setPaymentType(payment_type) {
    this.createForm.get("payment_type").setValue(payment_type);
    this.createForm.markAsDirty();
  }
  /*
  getProjectSelectedRelation() {
    const defaultConstructionForm: { Id: string; Name: string } = {
      Id: this.createForm.get("project_relation").value,
      Name: this.project.project_relation_name,
    };
    return defaultConstructionForm;
  }
*/
  getProjectRelation() {
    this.projectsService.getProjectRelation().subscribe(
      (result:any) => {

        if(result.status) {
          this.project_relation = result['data'];
        }
      }
    );
  }
  setSelectedField(selectedConsForm, formControlName) {

    this.createForm.markAsDirty();
    this.createForm.get(formControlName).patchValue(selectedConsForm.Id);
  }

  checkids(selected,initFormselected){
    if((selected?.length != initFormselected?.length)) return true;
    for(let i = 0; i<selected.length;i++){
      const element = selected.at(i)
      if(!initFormselected.some((el) => el.Id == element.Id))return true
    }
    return false;
  }

}
