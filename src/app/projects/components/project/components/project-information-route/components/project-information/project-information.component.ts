import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { ToastrService } from "ngx-toastr";
import { Client } from "src/app/core/models/client.model";
import { ClientsService } from "src/app/core/services/clients.service";
import { SelectValidator } from "src/app/core/validator/select.validator";
import { ProjectsService } from "src/app/core/services/projects.service";
import { UsersService } from "src/app/core/services/users.service";
import { User } from "src/app/core/models/user";
import { OffersService } from "src/app/core/services/offers.service";
import { AppService } from "src/app/core/services/app.service";
import { TranslateService } from "@ngx-translate/core";
import { NoWhitespaceValidator } from "src/app/core/validator/no-whitespace.validator";
import { FortnoxApiService } from "src/app/core/services/fortnoxApi.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { TabService } from "src/app/shared/directives/tab/tab.service";
import { ConfirmModalComponent } from "src/app/shared/modals/confirm-modal/confirm-modal.component";
import { AppComponent } from "src/app/app.component";
import { ClientProjectDetailsComponent } from "../../../../../client-project-details/client-project-details.component";

declare var $;

@Component({
  selector: "project-information",
  templateUrl: "./project-information.component.html",
  providers: [TabService],
  styleUrls: ["./project-information.component.css"],
})
export class ProjectInformationComponent implements OnInit {
  public userDetails: any;
  public project: any;
  public createForm: FormGroup;
  public actionStatus = -1;
  public disabled = false;
  public responsiblePersons: User[] = [];
  public clients: Client[] = [];
  public client_workers: any = [];
  public StartDate: any;
  public EndDate: any;
  public TehnicReview: any;
  public buttonName = "Projekhantering";
  public projectUsers: User[];
  public messages_id: any[] = [];
  public clientMessage: any;
  public ProjectManagers: any[];
  public language = "en";
  public week = "Week";
  public constructionForms: any[];
  public getDebitForms: any[];
  public index: any;
  public setedIndex = "";
  public offers: any[];
  public previousRoute: string;
  public currentAddRoute: string;
  public originalCustomName;
  public selectedClientWorkers = [];
  public selectedAttestClientWorkers = [];
  public filterSelectedClientWorkers = [];
  public attest_workers = new Array(4).fill("");
  public dropdownSettings;
  public showSelectClientWorker = false;
  public selectedCoworkers: any[] = [];
  public company_workers: any[] = [];
  public spinner = false;
  public paymentTypeForVisible: any = "Riktkostnad";

  public isShownClient: boolean = true;
  public isShownAddress: boolean = true;
  public isShownEconomy: boolean = true;
  public isLopande: boolean = false;

  public needToHaveOrangeBorder1: boolean = false;
  public needToHaveOrangeBorder2: boolean = false;
  public needToHaveOrangeBorder3: boolean = false;
  public needToHaveOrangeBorder4: boolean = false;

  public someArrayForMainPerson = [];
  public clientCategories: any;
  public project_relation: any = [];
  @ViewChild("Client")
  clientSelect: ElementRef;

  public contactPeopleSelected: any[] = [];
  public isClickedOnSave: boolean = false;
  public visible_payment_type: boolean = true;
  public payment_type: any;
  public generals;
  public invoice;
  public initForm;
  public offerPlaceholder = "Please select offer";

  @ViewChild("responsiblePerson") responsiblePersonRef: ElementRef;
  @ViewChild("tenderSumElement") tenderSumElement?: ElementRef;
  @ViewChild("projectNameElement") projectNameElement?: ElementRef;

  public projectStatusOptions: { id: string; status: string }[] = [
    { id: "1", status: this.translate.instant("On Hold") },
    { id: "2", status: this.translate.instant("In Progress") },
    { id: "3", status: this.translate.instant("Completed") },
    { id: "4", status: this.translate.instant("Awaiting inspection") },
    { id: "5", status: this.translate.instant("Aborted") },
  ];

  public offerList: { id: string; status: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private projectsService: ProjectsService,
    private router: Router,
    private usersService: UsersService,
    private toastr: ToastrService,
    private clientsService: ClientsService,
    private offersService: OffersService,
    private dialog: MatDialog,
    private appService: AppService,
    private translate: TranslateService,
    private fortnoxApi: FortnoxApiService,
    private appComponent: AppComponent
  ) {
    this.language = sessionStorage.getItem("lang");
    if (this.language == "en") this.week = "Week";
    else this.week = "Vecka";
  }

  ngOnInit() {
    this.getProjectRelation();
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    if (!this.userDetails.show_project_Settings) {
      this.router.navigate(["home"]);
    }
    this.route.queryParamMap.subscribe((params) => {
      this.invoice = params.get("invoice") || false;

      if (this.invoice) {
        this.toastr.info(
          this.translate.instant(
            "You have to set technic review date on project!"
          ),
          this.translate.instant("Info")
        );
      }
    });
    this.language = sessionStorage.getItem("lang");
    this.translate.use(this.language);
    this.getConstructionForm();
    this.getDebitForm();

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

    this.project = this.route.snapshot.data["project"];
    this.initForm = this.route.snapshot.data["project"];

    this.generals = this.route.snapshot.data["generals"];
    this.selectedClientWorkers = this.project.selectedClientWorkers;
    // this.route.snapshot.data["active_client_workers"];
    this.initForm["client_workers"] = this.project.selectedClientWorkers;
    this.clientCategories =
      this.route.snapshot.data["clientCategories"]["data"] || [];
    this.contactPeopleSelected = this.selectedClientWorkers;
    this.selectedAttestClientWorkers =
      this.route.snapshot.data["attest_client_workers"];
    this.originalCustomName = this.project.CustomName;
    this.client_workers = this.route.snapshot.data["client_workers"].map(
      (worker) => {
        return {
          Id: worker.Id,
          id: worker.Id,
          Name:
            worker.FirstName +
            " " +
            worker.LastName +
            (worker.Title ? " - " + worker.Title : ""),
          finalName:
            worker.FirstName +
            " " +
            worker.LastName +
            (worker.Title ? " - " + worker.Title : ""),
        };
      }
    );

    this.selectedCoworkers = this.route.snapshot.data["active_company_workers"];

    this.company_workers = this.route.snapshot.data["company_workers"]["data"];

    this.projectUsers = this.route.snapshot.data["users"]["data"];
    this.offers = this.route.snapshot.data["offers"].data;

    this.offers.forEach((offer) => {
      this.offerList.push({
        id: offer.id,
        status: `${offer.offerNum} ${offer.name}`
      });
    });

    this.getProjectManagers();

    this.attest_workers[0] = this.project.mainContactPerson;
    this.attest_workers[1] = this.project.attestWorker2;
    this.attest_workers[2] = this.project.attestWorker3;
    this.attest_workers[3] = this.project.attestWorker4;

    if (this.project.mainContactPerson == 0) {
      this.project.mainContactPerson = "";
    }

    if (this.project.attestWorker2 == 0) {
      this.project.attestWorker2 = "";
    }

    if (this.project.attestWorker3 == 0) {
      this.project.attestWorker3 = "";
    }

    if (this.project.attestWorker4 == 0) {
      this.project.attestWorker4 = "";
    }

    // if (this.project.offerId != "" ){
    //   this.offerPlaceholder = this.project.offerId
    // }

    this.createForm = this.fb.group(
      {
        id: [this.project.id, []],
        name: [
          this.project.name,
          [Validators.required, NoWhitespaceValidator.noWhitespaceValidator],
        ],
        responsiblePerson: [this.project.rp, [Validators.required]],
        responsiblePersonId: [this.project.rpid, []],
        deliveryContact: [this.project.dp, [Validators.required]],
        deliveryContact_name: [this.project.dp, [Validators.required]], //""
        street: [this.project.street, []],
        city: [this.project.city, []],
        old_status: [this.project.status, []],
        status: [this.project.status, []],
        activity: [this.project.activity, []],
        client_id: [
          { value: this.project.client_id, disabled: true },
          [Validators.required],
        ],
        client_id_name: [
          { value: this.project.client_id_name, disabled: true },
          [Validators.required],
        ],
        mainContactPerson: [this.project.mainContactPerson, []],
        payment_type: [this.project.payment_type, []],
        attestWorker2: [this.project.attestWorker2, []],
        attestWorker3: [this.project.attestWorker3, []],
        attestWorker4: [this.project.attestWorker4, []],
        StartDate: [this.project.StartDate, [Validators.required]],
        EndDate: [this.project.EndDate, [Validators.required]],
        TehnicReview: [this.project.TehnicReview, []],
        CustomName: [
          { value: this.project.CustomName, disabled: true },
          [Validators.required, NoWhitespaceValidator.noWhitespaceValidator],
        ],
        ProjectManagerID: [this.project.ProjectManagerID, []],
        ConstructionManagerID: [this.project.ConstructionManagerID, []],
        PlaceManagerID: [this.project.PlaceManagerID, []],
        ClientConstructionManagerID: [
          this.project.ClientConstructionManagerID,
          [],
        ],
        ClientPlaceManagerID: [this.project.ClientPlaceManagerID, []],
        zip: [this.project.zip, []],
        supplier_id: [this.project.SuplierID, []],
        construction_Id: [this.project.construction_Id, []],
        debit_Id: [this.project.debit_Id, []],
        tenderSum: [this.project.tenderSum, []],
        contractAmount: [this.project.contractAmount, []],
        ProjectSkilledHourlyRate: [this.project.ProjectSkilledHourlyRate],
        ProjectWorkerHourlyRate: [this.project.ProjectWorkerHourlyRate],
        AtaSkilledHourlyRate: [this.project.AtaSkilledHourlyRate],
        AtaWorkerHourlyRate: [this.project.AtaWorkerHourlyRate],
        chargeMaterial: [this.project.chargeMaterial, []],
        ataChargeMaterial: [this.project.ata_charge_material, []],
        ataChargeUE: [this.project.ata_charge_ue, []],
        chargeEquipment: [this.project.chargeEquipment, []],
        chargeUE: [this.project.chargeUE, []],
        estimatedRunTime: [this.project.estimatedRunTime, []],
        estimatedFixTime: [this.project.estimatedFixTime, []],
        skvId: [this.project.skvId, []],
        resursKonto1: [this.project.resursKonto1, []],
        resursKonto2: [this.project.resursKonto2, []],
        offer: ["", []],
        offerId: [this.project.offerId, []],
        clientsProjectName: [this.project.clientsProjectName, []],
        clientProjectNumber: [this.project.clientProjectNumber, []],
        clientCity: [this.project.clientCity, []],
        clientStreet: [this.project.clientStreet, []],
        clientZip: [this.project.clientZip, []],
        selectedMainContact: [
          this.project.selectedMainContact,
          [Validators.required],
        ],
        Color: [this.project.Color, []],
        internalProject: [
          Boolean(parseInt(this.project.internalProject, 10)),
          [],
        ],
        connect_with_moments: [
          this.project.connect_with_moments,
          [Validators.required],
        ],
        invoice_reference: [this.project.invoice_reference, []],
        invoice_reference_name: ["", []],
        project_relation: [this.project.project_relation, []],
        project_relation_name: [this.project.project_relation_name, []],
      },
      {
        validator: [
          SelectValidator.selectStatusValidator,
          SelectValidator.selectResposibleValidator,
        ],
      }
    );

    this.previousRoute = "/projects/view/" + this.project.id;
    this.appService.setBackRoute(this.previousRoute);
    this.appService.setShowAddButton = false;
    this.getClients();

    this.clientsService.client.subscribe((client) => {
      if (client != null && typeof client === "object") {
        client["finalName"] = client["Name"];
        this.clients.push(client);
        this.createForm.controls.client_id.patchValue(client.Id);
      }
    });

    this.clientsService.clientWorker.subscribe((data) => {
      if (data != null) {
        this.client_workers.push(data);
        this.client_workers = JSON.parse(JSON.stringify(this.client_workers));
        this.clientsService.clientWorker.next(null);
      }
    });

    this.hideBodyScroll("hidden");
  }

  ngOnDestroy() {
    this.hideBodyScroll("auto");
  }

  hideBodyScroll(overflow) {
    document.body.style.overflow = overflow;
  }


  ngAfterViewInit() {
    $("#dateSelectStartDate")
      .datepicker({
        format: "yyyy-mm-dd",
        weekStart: 1,
        calendarWeeks: true,
        autoclose: true,
        language: this.language,
        currentWeek: true,
        todayHighlight: true,
        currentWeekTransl: this.week,
        currentWeekSplitChar: "-",
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
        this.createForm.markAsDirty();
      })
      .on("blur", (e) => {
        e.target.value = this.createForm.value.StartDate;
        this.createForm.markAsDirty();
      });

    const startDate = new Date(this.project.StartDate.split(" ")[0]);
    $("#dateSelectStartDate").datepicker("setDate", startDate);

    const EndDate = new Date(this.project.EndDate.split(" ")[0]);

    $("#dateSelectEndDate")
      .datepicker({
        format: "yyyy-mm-dd",
        weekStart: 1,
        calendarWeeks: true,
        autoclose: true,
        language: this.language,
        currentWeek: true,
        todayHighlight: true,
        currentWeekTransl: this.week,
        currentWeekSplitChar: "-",
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
        this.createForm.markAsDirty();
      })
      .on("blur", (e) => {
        e.target.value = this.createForm.value.EndDate;
        this.createForm.markAsDirty();
      });

    $("#dateSelectEndDate").datepicker("setDate", new Date(EndDate));

    $("#dateSelectTehnicReview")
      .datepicker({
        format: "yyyy-mm-dd",
        weekStart: 1,
        calendarWeeks: true,
        autoclose: true,
        language: this.language,
        currentWeek: true,
        todayHighlight: true,
        currentWeekTransl: this.week,
        currentWeekSplitChar: "-",
      })
      .on("changeDate", (ev) => {
        this.createForm.get("TehnicReview").patchValue(ev.target.value);
        this.TehnicReview = ev.target.value;
      })
      .on("blur", (e) => {
        e.target.value = this.createForm.value.TehnicReview;
        this.createForm.markAsDirty();
      });

    if (this.project.TehnicReview) {
      const TehnicReview = this.project.TehnicReview.split(" ")[0];
      $("#dateSelectTehnicReview").datepicker(
        "setDate",
        new Date(TehnicReview)
      );
    }
    this.setValidation();
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

  toggleAttestWorkerHidden(event, formControlName) {
    if (event.status === true) {
      this.createForm.get(formControlName).patchValue(event.Id);
      if (!this.createForm.get("selectedMainContact").value) {
        if (formControlName === "mainContactPerson") {
          this.createForm.get("mainContactPerson").setValue(event.Id);
          this.needToHaveOrangeBorder1 = true;
        } else if (formControlName === "attestWorker2") {
          this.createForm.get("attestWorker2").setValue(event.Id);
          this.needToHaveOrangeBorder2 = true;
        } else if (formControlName === "attestWorker3") {
          this.createForm.get("attestWorker3").setValue(event.Id);
          this.needToHaveOrangeBorder3 = true;
        } else {
          this.createForm.get("attestWorker4").setValue(event.Id);
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

  async updateProject() {
    this.isClickedOnSave = true;
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

    this.StartDate = this.createForm.value.StartDate || "";
    this.EndDate = this.createForm.value.EndDate || "";
    this.TehnicReview = this.createForm.value.TehnicReview || "";

    if (this.invoice && !this.TehnicReview) {
      this.toastr.info(
        this.translate.instant(
          "You have to set technic review date on project!"
        ),
        this.translate.instant("Info")
      );
      return;
    }

    const data = this.createForm.value;

    const isTaken = (
      (await this.projectsService.checkIfProjectNumberIsTaken(
        data.CustomName
      )) as any
    ).isTaken;
    if (isTaken && this.originalCustomName !== data.CustomName) {
      this.toastr.error(
        this.translate.instant("Project number in use, choose another one."),
        this.translate.instant("Error")
      );
      return;
    }

    if (this.selectedCoworkers.length > 0) {
      let res_person = this.selectedCoworkers[0];
      let user_name =
        res_person["Name"].split(" ")[0] +
        " " +
        res_person["Name"].split(" ")[1];
      data.responsiblePerson = user_name;
      data.responsiblePersonId = res_person["Id"];
    }

    if (!this.project.CustomName.startsWith("P")) {
      this.toastr.error(
        this.translate.instant(
          "Project numbers must start with the letter 'P'."
        ),
        this.translate.instant("Error")
      );
      return;
    }

    const project = {
      id: this.project.id,
      name: data.name,
      email: data.email,
      rp: data.responsiblePerson,
      rpid: data.responsiblePersonId,
      dp: data.deliveryContact,
      address: data.address,
      workplace: data.workplace,
      street: data.street,
      city: data.city,
      phone: data.phone,
      status: data.status,
      old_status: data.old_status,
      parent: data.parent,
      StartDate: this.StartDate,
      EndDate: this.EndDate,
      TehnicReview: this.TehnicReview,
      client_id: this.project.client_id,
      mainContactPerson: data.mainContactPerson,
      attestWorker2: data.attestWorker2,
      attestWorker3: data.attestWorker3,
      attestWorker4: data.attestWorker4,
      selectedMainContact: data.selectedMainContact,
      construction_manager_id: data.ConstructionManagerID,
      project_manager_id: data.ProjectManagerID,
      place_manager_id: data.PlaceManagerID,
      client_construction_manager_id: data.ClientConstructionManagerID,
      client_place_manager_id: data.ClientPlaceManagerID,
      zip: data.zip,
      supplier_id: data.supplier_id,
      old_supplier_id: this.project.SuplierID,
      construction_Id: data.construction_Id || 0,
      debit_Id: data.debit_Id,
      tenderSum:
        data.tenderSum === ""
          ? 0
          : data.tenderSum.toString().replace(/\s/g, "").replace(",", "."),
      contractAmount:
        data.contractAmount === ""
          ? 0
          : data.contractAmount.toString().replace(/\s/g, "").replace(",", "."),
      ProjectSkilledHourlyRate:
        data.ProjectSkilledHourlyRate === ""
          ? 0
          : data.ProjectSkilledHourlyRate.toString()
              .replace(/\s/g, "")
              .replace(",", "."),
      ProjectWorkerHourlyRate:
        data.ProjectWorkerHourlyRate === ""
          ? 0
          : data.ProjectWorkerHourlyRate.toString()
              .replace(/\s/g, "")
              .replace(",", "."),
      AtaSkilledHourlyRate:
        data.AtaSkilledHourlyRate === ""
          ? 0
          : data.AtaSkilledHourlyRate.toString()
              .replace(/\s/g, "")
              .replace(",", "."),
      AtaWorkerHourlyRate:
        data.AtaWorkerHourlyRate === ""
          ? 0
          : data.AtaWorkerHourlyRate.toString()
              .replace(/\s/g, "")
              .replace(",", "."),
      chargeMaterial:
        data.chargeMaterial === ""
          ? 0
          : data.chargeMaterial.toString().replace(/\s/g, "").replace(",", "."),
      ataChargeMaterial:
        data.ataChargeMaterial === ""
          ? 0
          : data.ataChargeMaterial
              .toString()
              .replace(/\s/g, "")
              .replace(",", "."),
      ataChargeUE:
        data.ataChargeUE === ""
          ? 0
          : data.ataChargeUE.toString().replace(/\s/g, "").replace(",", "."),
      chargeEquipment:
        data.chargeEquipment === ""
          ? 0
          : data.chargeEquipment
              .toString()
              .replace(/\s/g, "")
              .replace(",", "."),
      chargeUE:
        data.chargeUE === ""
          ? 0
          : data.chargeUE.toString().replace(/\s/g, "").replace(",", "."),
      estimatedRunTime:
        data.estimatedRunTime === "" || !data.estimatedRunTime
          ? 0
          : data.estimatedRunTime
              .toString()
              .replace(/\s/g, "")
              .replace(",", "."),
      estimatedFixTime:
        data.estimatedFixTime === ""
          ? 0
          : data.estimatedFixTime
              .toString()
              .replace(/\s/g, "")
              .replace(",", "."),
      skvId: data.skvId,
      resursKonto1: data.resursKonto1,
      resursKonto2: data.resursKonto2,
      offerId: data.offerId,
      clientsProjectName: data.clientsProjectName,
      clientProjectNumber: data.clientProjectNumber,
      clientCity: data.clientCity,
      clientStreet: data.clientStreet,
      clientZip: data.clientZip,
      deliveryContact: data.deliveryContact,
      Color: data.Color,
      selectedClientWorkers: this.selectedClientWorkers,
      selectedCoworkers: this.selectedCoworkers,
      internalProject: data.internalProject,
      connect_with_moments: data.connect_with_moments,
      invoice_reference: data.invoice_reference,
      payment_type: data.payment_type,
      project_relation: data.project_relation,
    };
    [
      "mainContactPerson",
      "attestWorker2",
      "attestWorker3",
      "attestWorker4",
    ].forEach((property) => {
      // const isNotRemoved = project.selectedClientWorkers.some(
      //   (clientWorker) => {
      //     return clientWorker.Id == project[property] && project[property] != 0;
      //   }
      // );

      // if (!isNotRemoved) {
      //   project[property] = "0";
      // }

      if (project[property].length == 0) {
        project[property] = "0";
      }
    });

    this.spinner = true;
    this.createForm.disable();

    const response = await this.projectsService.updateProject(project);
    let status;
    if (response["status"]) {
      switch (data.status) {
        case "1":
          status = "NOTSTARTED";
          break;
        case "2":
          status = "ONGOING";
          break;
        case "3":
          status = "COMPLETED";
          break;
      }
      this.fortnoxApi
        .updateProject(data.CustomName, {
          Description: data.name,
          Status: status,
          StartDate: data.StartDate.substring(0, 10),
          EndDate: data.EndDate.substring(0, 10),
          ContactPerson: data.responsiblePerson,
          ProjectId: this.project.id,
        })
        .subscribe((res) => {
          if (res) {
            this.disabled = false;
            this.actionStatus = response["status"] ? 1 : 0;
            this.toastr.success(
              this.translate.instant("You have successfully updated project!"),
              this.translate.instant("Success")
            );
            if (this.invoice) {
              this.router.navigate(["invoices/new"]);
            } else {
              this.router.navigate(["projects/view", this.project.id]);
            }

            this.spinner = false;
            this.createForm.enable();
          }
        });
    }
  }

  removeProject() {
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
          this.projectsService.removeProject(this.project.id).then((res) => {
            if (res.status) {
              this.router.navigate(["/projects"]);
            }
          });
        }
      });
  }

  getProjectManagers() {
    this.usersService.getProjectManagers().subscribe((response) => {
      this.responsiblePersons = response["data"].map((person) => {
        person["finalName"] = person["username"];
        return person;
      });
    });
  }

  getClients() {
    this.clientsService.getClients().subscribe((response) => {
      this.clients = response["data"].map((client) => {
        client["finalName"] = client["Name"];
        return client;
      });
    });
  }

  getOffers(client_id) {
    this.offersService.getOfferByClient(client_id).subscribe((response) => {
      if (response["status"]) {
        this.offers = response["data"] || [];
      } else {
        this.offers = [];
      }
    });
  }

  setContactPersons(client_id) {
    const client = client_id.Id;
    if (client !== "-1") {
      this.clientsService.getClientWorkers(client).subscribe((response) => {
        this.client_workers = response["data"] || [];
        this.client_workers = this.client_workers.map((worker) => {
          return {
            Id: worker.Id,
            Name: worker.FirstName + " " + worker.LastName,
          };
        });
        this.showSelectClientWorker = true;
        this.selectedClientWorkers = [];
      });
    } else {
      this.client_workers = [];
      this.showSelectClientWorker = true;
      this.selectedClientWorkers = [];
    }
  }

  changeresponsiblePersonStatus(responsiblePerson) {
    const userId = $("#project-responsiblePerson")
      .find(":selected")
      .data("user-id");
    const username = responsiblePerson.value;
    this.createForm.get("responsiblePerson").patchValue(username);
    this.createForm.get("ProjectManagerID").patchValue(userId);
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

      if (this.project.number_of_wr != "0") this.filterDebitFormsByDebitId();
    });
  }

  filterDebitFormsByDebitId() {
    const projectDebitId = this.project.debit_Id;

    if (projectDebitId != 2) {
      this.getDebitForms = this.getDebitForms.filter((debit) => {
        return debit.Id != 2;
      });
    }
  }

  openComponentDetail(e) {}

  openWorkerDetail(e) {
    e.preventDefault();
    scroll(0, 0);
    this.clientsService.client.next(this.createForm.value.client_id);
    this.clientsService.setComponentVisibility(2);
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

  isProjectLopande() {
    let newGetDebitForms: any;
    if (this.createForm.get("debit_Id").value == "1") {
      this.isLopande = true;
    }

    if (this.isLopande) {
      newGetDebitForms = this.getDebitForms?.filter((element) => {
        return element.Id != "2";
      });
    } else {
      newGetDebitForms = this.getDebitForms;
    }
    return newGetDebitForms;
  }

  getDefaultMainContactPerson() {
    const defaultId = this.createForm.get("mainContactPerson").value;
    if (defaultId === this.createForm.get("selectedMainContact").value) {
      this.needToHaveOrangeBorder1 = true;
      this.needToHaveOrangeBorder2 = false;
      this.needToHaveOrangeBorder3 = false;
      this.needToHaveOrangeBorder4 = false;
    }
    const defaultPerson = this.selectedClientWorkers.find((element) => {
      return element.Id == defaultId;
    });

    return defaultPerson;
  }

  getDefaultAttestWorker2() {
    const defaultId = this.createForm.get("attestWorker2").value;
    if (defaultId === this.createForm.get("selectedMainContact").value) {
      this.needToHaveOrangeBorder2 = true;
      this.needToHaveOrangeBorder1 = false;
      this.needToHaveOrangeBorder3 = false;
      this.needToHaveOrangeBorder4 = false;
    }
    const defaultPerson = this.selectedClientWorkers.find((element) => {
      return element.Id == defaultId;
    });

    return defaultPerson;
  }

  getDefaultAttestWorker3() {
    const defaultId = this.createForm.get("attestWorker3").value;
    if (defaultId === this.createForm.get("selectedMainContact").value) {
      this.needToHaveOrangeBorder3 = true;
      this.needToHaveOrangeBorder1 = false;
      this.needToHaveOrangeBorder2 = false;
      this.needToHaveOrangeBorder4 = false;
    }
    const defaultPerson = this.selectedClientWorkers.find((element) => {
      return element.Id == defaultId;
    });

    return defaultPerson;
  }

  getDefaultAttestWorker4() {
    const defaultId = this.createForm.get("attestWorker4").value;
    if (defaultId === this.createForm.get("selectedMainContact").value) {
      this.needToHaveOrangeBorder4 = true;
      this.needToHaveOrangeBorder1 = false;
      this.needToHaveOrangeBorder2 = false;
      this.needToHaveOrangeBorder3 = false;
    }
    const defaultPerson = this.selectedClientWorkers.find((element) => {
      return element.Id == defaultId;
    });

    return defaultPerson;
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

  onItemDeSelect(item) {
    this.contactPeopleSelected = this.contactPeopleSelected.filter((worker) => {
      return worker.Id !== item.Id;
    });
  }

  onItemSelect(persons) {
    //Dropdown component returns an array of persons.
    //This function compares persons array and contatPeopleSelected ara
    this.selectedClientWorkers = persons;
    const contactPeople = this.contactPeopleSelected;
    //Find values that are in result1 but not in result2
    const uniqueResultOne = persons.filter(function (obj) {
      return !contactPeople.some(function (obj2) {
        return obj.Id == obj2.Id;
      });
    });
    //Find values that are in result2 but not in result1
    var uniqueResultTwo = contactPeople.filter(function (obj) {
      return !persons.some(function (obj2) {
        return obj.Id == obj2.Id;
      });
    });
    //Combine the two arrays of unique entries
    var result = uniqueResultOne.concat(uniqueResultTwo);
    let personIndex = this.contactPeopleSelected.findIndex((person) => {
      if (result.length == 0) return;
      return person.Id == result[0].Id;
    });

    if (personIndex == -1) {
      this.contactPeopleSelected.push(result[0]);
    } else {
      this.contactPeopleSelected.splice(personIndex, 1);
    }
  }

  onSelectAll(items) {
    this.contactPeopleSelected = items;
    this.contactPeopleSelected.forEach((contactPeople) => {
      if (this.createForm.get("mainContactPerson").value) {
        if (
          this.createForm.get("mainContactPerson").value == contactPeople.Id
        ) {
          contactPeople.hidden = true;
        }
      } else contactPeople.hidden = false;

      if (this.createForm.get("attestWorker2").value) {
        if (this.createForm.get("attestWorker2").value == contactPeople.Id) {
          contactPeople.hidden = true;
        }
      } else contactPeople.hidden = false;

      if (this.createForm.get("attestWorker3").value) {
        if (this.createForm.get("attestWorker3").value == contactPeople.Id) {
          contactPeople.hidden = true;
        }
      } else contactPeople.hidden = false;

      if (this.createForm.get("attestWorker4").value) {
        if (this.createForm.get("attestWorker4").value == contactPeople.Id) {
          contactPeople.hidden = true;
        }
      } else contactPeople.hidden = false;
    });
  }

  onDeSelectAll(items) {
    this.contactPeopleSelected = items;
  }

  async saveChanges() {
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
    this.StartDate = this.createForm.value.StartDate || "";
    this.EndDate = this.createForm.value.EndDate || "";
    this.TehnicReview = this.createForm.value.TehnicReview || "";

    const data = this.createForm.value;
    const isTaken = (
      (await this.projectsService.checkIfProjectNumberIsTaken(
        data.CustomName
      )) as any
    ).isTaken;
    if (isTaken && this.originalCustomName !== data.CustomName) {
      this.toastr.error(
        this.translate.instant("Project number in use, choose another one."),
        this.translate.instant("Error")
      );
      return;
    }

    if (this.selectedCoworkers.length > 0) {
      let res_person = this.selectedCoworkers[0];
      let user_name =
        res_person["Name"].split(" ")[0] +
        " " +
        res_person["Name"].split(" ")[1];
      data.responsiblePerson = user_name;
      data.responsiblePersonId = res_person["Id"];
    }

    if (!this.project.CustomName.startsWith("P")) {
      this.toastr.error(
        this.translate.instant(
          "Project numbers must start with the letter 'P'."
        ),
        this.translate.instant("Error")
      );
      return;
    }

    const project = {
      id: this.project.id,
      name: data.name,
      email: data.email,
      rp: data.responsiblePerson,
      rpid: data.responsiblePersonId,
      dp: data.deliveryContact,
      address: data.address,
      workplace: data.workplace,
      street: data.street,
      city: data.city,
      phone: data.phone,
      status: data.status,
      parent: data.parent,
      StartDate: this.StartDate,
      EndDate: this.EndDate,
      TehnicReview: this.TehnicReview,
      client_id: this.project.client_id,
      mainContactPerson: data.mainContactPerson,
      attestWorker2: data.attestWorker2,
      attestWorker3: data.attestWorker3,
      attestWorker4: data.attestWorker4,
      selectedMainContact: data.selectedMainContact,
      construction_manager_id: data.ConstructionManagerID,
      project_manager_id: data.ProjectManagerID,
      place_manager_id: data.PlaceManagerID,
      client_construction_manager_id: data.ClientConstructionManagerID,
      client_place_manager_id: data.ClientPlaceManagerID,
      zip: data.zip,
      supplier_id: data.supplier_id,
      old_supplier_id: this.project.SuplierID,
      construction_Id: data.construction_Id || 0,
      debit_Id: data.debit_Id,
      tenderSum:
        data.tenderSum === ""
          ? 0
          : data.tenderSum.toString().replace(/\s/g, "").replace(",", "."),
      contractAmount:
        data.contractAmount === ""
          ? 0
          : data.contractAmount.toString().replace(/\s/g, "").replace(",", "."),
      ProjectSkilledHourlyRate:
        data.ProjectSkilledHourlyRate === ""
          ? 0
          : data.ProjectSkilledHourlyRate.toString()
              .replace(/\s/g, "")
              .replace(",", "."),
      ProjectWorkerHourlyRate:
        data.ProjectWorkerHourlyRate === ""
          ? 0
          : data.ProjectWorkerHourlyRate.toString()
              .replace(/\s/g, "")
              .replace(",", "."),
      AtaSkilledHourlyRate:
        data.AtaSkilledHourlyRate === ""
          ? 0
          : data.AtaSkilledHourlyRate.toString()
              .replace(/\s/g, "")
              .replace(",", "."),
      AtaWorkerHourlyRate:
        data.AtaWorkerHourlyRate === ""
          ? 0
          : data.AtaWorkerHourlyRate.toString()
              .replace(/\s/g, "")
              .replace(",", "."),
      chargeMaterial:
        data.chargeMaterial === ""
          ? 0
          : data.chargeMaterial.toString().replace(/\s/g, "").replace(",", "."),
      ataChargeMaterial:
        data.ataChargeMaterial === ""
          ? 0
          : data.ataChargeMaterial
              .toString()
              .replace(/\s/g, "")
              .replace(",", "."),
      ataChargeUE:
        data.ataChargeUE === ""
          ? 0
          : data.ataChargeUE.toString().replace(/\s/g, "").replace(",", "."),
      chargeEquipment:
        data.chargeEquipment === ""
          ? 0
          : data.chargeEquipment
              .toString()
              .replace(/\s/g, "")
              .replace(",", "."),
      chargeUE:
        data.chargeUE === ""
          ? 0
          : data.chargeUE.toString().replace(/\s/g, "").replace(",", "."),
      estimatedRunTime:
        data.estimatedRunTime === "" || !data.estimatedRunTime
          ? 0
          : data.estimatedRunTime
              .toString()
              .replace(/\s/g, "")
              .replace(",", "."),
      estimatedFixTime:
        data.estimatedFixTime === ""
          ? 0
          : data.estimatedFixTime
              .toString()
              .replace(/\s/g, "")
              .replace(",", "."),
      skvId: data.skvId,
      resursKonto1: data.resursKonto1,
      resursKonto2: data.resursKonto2,
      offerId: data.offerId,
      clientsProjectName: data.clientsProjectName,
      clientProjectNumber: data.clientProjectNumber,
      clientCity: data.clientCity,
      clientStreet: data.clientStreet,
      clientZip: data.clientZip,
      deliveryContact: data.deliveryContact,
      Color: data.Color,
      selectedClientWorkers: this.selectedClientWorkers,
      selectedCoworkers: this.selectedCoworkers,
      internalProject: data.internalProject,
      connect_with_moments: data.connect_with_moments,
    };
    [
      "mainContactPerson",
      "attestWorker2",
      "attestWorker3",
      "attestWorker4",
    ].forEach((property) => {
      const isNotRemoved = project.selectedClientWorkers.some(
        (clientWorker) => {
          return clientWorker.Id == project[property] && project[property] != 0;
        }
      );

      if (!isNotRemoved) {
        project[property] = "0";
      }
    });

    this.spinner = true;
    this.createForm.disable();

    const response = await this.projectsService.updateProject(project);
    let status;
    if (response["status"]) {
      switch (data.status) {
        case "1":
          status = "NOTSTARTED";
          break;
        case "2":
          status = "ONGOING";
          break;
        case "3":
          status = "COMPLETED";
          break;
      }

      this.fortnoxApi
        .updateProject(data.CustomName, {
          Description: data.name,
          Status: status,
          StartDate: data.StartDate.substring(0, 10),
          EndDate: data.EndDate.substring(0, 10),
          ContactPerson: data.responsiblePerson,
          ProjectId: this.project.id,
        })
        .subscribe((res) => {
          if (res) {
            this.disabled = false;
            this.actionStatus = response["status"] ? 1 : 0;
            this.toastr.success(
              this.translate.instant("You have successfully updated project!"),
              this.translate.instant("Success")
            );
            this.spinner = false;
            this.createForm.enable();
          }
        });
    }
  }

  projectStatusSelected(selectedStatus, formControlName) {
    this.createForm.markAsDirty();
    this.createForm.get(formControlName).patchValue(selectedStatus.id);
  }

  offerSelected(selected, formControlName) {
    this.createForm.get("offerId").patchValue(selected.id);
    const offerSelected = this.offers.find((x) => x.id == selected.id);
    this.createForm.markAsDirty();
    if (!offerSelected || !this.tenderSumElement) return;
    this.createForm.get("tenderSum").patchValue(offerSelected.article_total);
    //  Fokus na elemente sam promjenio kako bi se number-format-directive aktivirala
    this.tenderSumElement.nativeElement.focus();
    this.projectNameElement.nativeElement.focus();
    return;

    // const offerSelected = this.offers.find((offer) => offer.id == selected.id);
    this.setContactPersons({
      Id: offerSelected.client_id,
      name: offerSelected.cl_name,
    });
    this.createForm
      .get("clientsProjectName")
      .patchValue(offerSelected.clientsProjectName);
    this.createForm
      .get("clientProjectNumber")
      .patchValue(offerSelected.clientProjectNumber);
    this.createForm
      .get("resursKonto1")
      .patchValue(offerSelected.ResourceAccount);

    this.createForm.get("street").patchValue(offerSelected.street);
    this.createForm.get("zip").patchValue(offerSelected.zip);
    this.createForm.get("city").patchValue(offerSelected.city);

    this.createForm.get("clientStreet").patchValue(offerSelected.street2);
    this.createForm.get("clientZip").patchValue(offerSelected.zip2);
    this.createForm.get("clientCity").patchValue(offerSelected.city2);

    this.createForm
      .get("estimatedRunTime")
      .patchValue(offerSelected.estimatedRunTime);
    this.createForm
      .get("estimatedFixTime")
      .patchValue(offerSelected.estimatedFixTime);

    this.createForm
      .get("ProjectSkilledHourlyRate")
      .patchValue(offerSelected.SkilledHourlyRate);
    this.createForm
      .get("ProjectWorkerHourlyRate")
      .patchValue(offerSelected.WorkerHourlyRate);
    this.createForm
      .get("chargeMaterial")
      .patchValue(offerSelected.chargeMaterial);
    this.createForm.get("chargeUE").patchValue(offerSelected.chargeUE);

    this.createForm
      .get("AtaSkilledHourlyRate")
      .patchValue(offerSelected.AtaSkilledHourlyRate);
    this.createForm
      .get("AtaWorkerHourlyRate")
      .patchValue(offerSelected.AtaWorkerHourlyRate);
    this.createForm
      .get("ataChargeMaterial")
      .patchValue(offerSelected.ATAchargeMaterial);
    this.createForm.get("ataChargeUE").patchValue(offerSelected.ATAchargeUE);

    this.createForm.get("offer").patchValue(selected.status);
    this.createForm.get("offerId").patchValue(selected.id);
    //this.createForm.get(formControlName).patchValue(selected.id);
  }

  makeFormDirty() {
    this.createForm.markAsDirty();
  }

  constructionFormSelected(selectedConsForm, formControlName) {
    this.createForm.markAsDirty();
    this.createForm.get(formControlName).patchValue(selectedConsForm.Id);
  }

  setSelectedField(selectedConsForm, formControlName) {
    this.createForm.markAsDirty();
    this.createForm.get(formControlName).patchValue(selectedConsForm.Id);
  }

  getDefaultContactPersone() {
    const projectContactPersone = this.selectedCoworkers.find((element) => {
      return element.id == this.createForm.get("contactpersone").value;
    });
    return projectContactPersone;
  }

  getDefaultProjectStatus() {
    const projectStatus = this.projectStatusOptions.find((element) => {
      return element.id == this.createForm.get("status").value;
    });
    return projectStatus;
  }

  setVisiblePaymentType() {
    if (this.paymentTypeForVisible == "Riktkostnad") {
      this.visible_payment_type = true;
    } else {
      this.visible_payment_type = false;
    }
    this.payment_type = null;
  }

  selectDebitForm(selectedDebit, formControlName) {
    this.createForm.markAsDirty();
    this.createForm.get(formControlName).patchValue(selectedDebit.Id);
    this.visible_payment_type = true;
    this.payment_type = selectedDebit.Name;
    this.paymentTypeForVisible = selectedDebit.Name;
  }

  getDefaultConstructionForm() {
    const defaultConstructionForm: { Id: string; Name: string } = {
      Id: this.createForm.get("construction_Id").value,
      Name: this.project.construction_name,
    };
    return defaultConstructionForm;
  }

  getProjectSelectedRelation() {
    const defaultConstructionForm: { Id: string; Name: string } = {
      Id: this.createForm.get("project_relation").value,
      Name: this.project.project_relation_name,
    };
    return defaultConstructionForm;
  }

  getDefaultDebitForm() {
    const defaultDebitform: { Id: string; Name: string } = {
      Id: this.createForm.get("debit_Id").value,
      Name: this.project.debit_name,
    };

    return defaultDebitform;
  }

  onConfirmationModal(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.disableClose = true;
      dialogConfig.width = "185px";
      dialogConfig.panelClass = "confirm-modal";
      this.dialog
        .open(ConfirmModalComponent, dialogConfig)
        .afterClosed()
        .subscribe((response) => {
          if (response.result) {
            this.appComponent.loading = true;
            resolve(true);
          } else {
            resolve(false);
          }
        });
    });
  }

  canDeactivate(): Promise<boolean> | boolean {
    if (this.isClickedOnSave) {
      return true;
    } else {
      if (this.createForm.dirty) {
        this.appComponent.loading = false;
        return this.onConfirmationModal();
      } else {
        return true;
      }
    }
  }

  GetDeliveryContact(selectedClient) {
    this.createForm.get("deliveryContact").setValue(selectedClient.value);
    this.createForm.get("deliveryContact_name").setValue(selectedClient.name);
  }

  selectedCoworkersArray: string[];
  onItemSelectContactPersone(item) {
    this.selectedCoworkersArray = item;
    this.selectedCoworkers = this.selectedCoworkersArray;
  }

  onSelectAllContactPersone(items) {
    this.selectedCoworkersArray = [];
    this.selectedCoworkersArray = items;
    this.selectedCoworkers = this.selectedCoworkersArray;
  }

  onDeSelectAllContactPersone() {
    this.selectedCoworkers = [];
  }

  GetFakturaRef(selectedFakturaRef) {
    this.createForm.get("invoice_reference").setValue(selectedFakturaRef.Id);
    this.createForm
      .get("invoice_reference_name")
      .setValue(selectedFakturaRef.name);
  }

  openProjectClientDetailsModal($event) {
    if (!this.userDetails.create_project_Settings) {
      return;
    }
    $event.preventDefault();
    this.clientsService.client.next(this.project.client_id);
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

  setPaymentType(payment_type) {
    if (!this.userDetails.create_project_Settings) {
      return;
    }
    this.createForm.get("payment_type").setValue(payment_type);
    this.createForm.markAsDirty();
  }

  getProjectRelation() {
    this.projectsService.getProjectRelation().subscribe((result: any) => {
      if (result.status) {
        this.project_relation = result["data"];
      }
    });
  }

  disableProjectRelation() {
    let status = false;
    if (
      this.project.exist_attested_moment > 0 ||
      !this.userDetails.create_project_Settings
    ) {
      status = true;
    }
    return status;
  }

  checkids(selected,initFormselected){
    if((selected.length != initFormselected.length)) return true;
    for(let i = 0; i < selected.length; i++){
      const element = selected.at(i)
      if(!initFormselected.some((el) => el.Id == element.Id))return true
    }
    return false;
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

            console.log(this.createForm)
        }else {
            this.createForm.get('client_id').setValidators([Validators.required]);
            this.createForm.get('client_id').updateValueAndValidity();
            this.createForm.get('client_id_name').setValidators([Validators.required]);
            this.createForm.get('client_id_name').updateValueAndValidity();
            this.createForm.get('selectedMainContact').setValidators([Validators.required]);
            this.createForm.get('selectedMainContact').updateValueAndValidity();
        }
    }
}