import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { ProjectsService } from "../../../core/services/projects.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

import { User } from "src/app/core/models/user";
import { UsersService } from "src/app/core/services/users.service";
import { Client } from "src/app/core/models/client.model";
import { ClientsService } from "src/app/core/services/clients.service";
import { SelectValidator } from "src/app/core/validator/select.validator";
import { AppService } from "src/app/core/services/app.service";
import { NoWhitespaceValidator } from "src/app/core/validator/no-whitespace.validator";
import { TranslateService } from "@ngx-translate/core";
import { NewActivityComponent } from "src/app/generals/components/activity-plan/modals/new-activity/new-activity.component";
import { AuthService } from "../../../core/services/auth.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { TabService } from "src/app/shared/directives/tab/tab.service";
// import { NewClientProjectComponent } from '../new-project-client/new-project-client.component';
import { ClientProjectDetailsComponent } from '../client-project-details/client-project-details.component';
import { AESEncryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';
declare var $;

@Component({
  selector: "app-new-sub-project",
  templateUrl: "./new-sub-project.component.html",
  providers: [TabService],
  styleUrls: ["./new-sub-project.component.css"],
})
export class NewSubProjectComponent implements OnInit {
  @ViewChild("myform", { static: true }) myform!: NgForm;
  public actionStatus = -1;
  public createForm: FormGroup;
  public userDetails: any;
  public responsiblePersons: User[] = [];
  public clients: Client[] = [];
  public client_workers: any;
  public showSelectClientWorker = false;
  public StartDate: any;
  public EndDate: any;
  public TehnicReview: any;
  public language = "en";
  public week = "Week";
  public projectID: any;
  public offers: any[];
  public constructionForms: any[];
  public getDebitForms: any[];
  public componentVisibility: number = 0;
  public parent_project: any;
  public disabled = false;
  public previousRoute: string;
  public message: any;
  public messageErr: any;
  public messageCont: any;
  public selectedClientWorkers = [];
  public selectedAttestClientWorkers = [];
  public dropdownSettings;
  public attest_workers = new Array(4).fill("");
  public company_workers: any[] = [];
  public selectedCoworkers: any[] = [];
  public activities = [];
  public categories = [];
  public spinner = false;
  public isShownProject: boolean = true;
  public isShownClient: boolean = true;
  public isShownAddress: boolean = true;
  public isShownEconomy: boolean = true;
  public visible_payment_type:boolean = true;
  public paymentTypeForVisible:any='Riktkostnad';
  public someArrayForMainPerson = [];
  public projectStatusOptions: {id: string, status: string}[] = [
    {id: "1", status: this.translate.instant("On Hold")},
    {id: "2", status: this.translate.instant("In Progress")},
    {id: "3", status: this.translate.instant("Completed")},
    {id: "4", status: this.translate.instant("Awaiting inspection")},
    {id: "5", status: this.translate.instant("Aborted")},
  ];
  public offerList: {id: string, status: string}[] = [];
  public contactPeopleSelected: any[] = [];
  public isLopande: boolean = false;
  public needToHaveOrangeBorder1: boolean = false;
  public needToHaveOrangeBorder2: boolean = false;
  public needToHaveOrangeBorder3: boolean = false;
  public needToHaveOrangeBorder4: boolean = false;
  public selected_debit:any;
  public payment_type:any;
  public project_relation:any = [];
  public generals:any;
  public initForm;
  private isDatePickerInitialized = false;

  @ViewChild("responsiblePerson") responsiblePersonRef: ElementRef;
  @ViewChild('dateSelectEndDate', { static: false }) dateSelectEndDate: ElementRef;
  @ViewChild('dateSelectStartDate', { static: false }) dateSelectStartDate: ElementRef;
  @ViewChild('dateSelectTehnicReview', { static: false }) dateSelectTehnicReview: ElementRef;
  clientCategories: any;

  constructor(
    private fb: FormBuilder,
    private projectsService: ProjectsService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UsersService,
    private clientsService: ClientsService,
    private appService: AppService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private authService: AuthService,
    private AESEncryptDecryptService: AESEncryptDecryptService
  ) {
    this.language = sessionStorage.getItem("lang");
    if (this.language == "en") this.week = "Week";
    else this.week = "Vecka";
  }

  async ngOnInit() {

    this.getProjectRelation();
    this.hideBodyScroll('hidden');
    this.projectID = this.route.snapshot.paramMap.get("id");
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

    const permission = this.userDetails.create_project_Information == 0 ? false : true;
    this.generals = this.route.snapshot.data["generals"];

    if (permission === false) {
      this.router.navigate(["/projects/view/", this.projectID]);
    }

    this.clientCategories = this.route.snapshot.data["clientCategories"]["data"] || [];
    this.selectedClientWorkers = this.route.snapshot.data["active_client_workers"];
    this.contactPeopleSelected = this.selectedClientWorkers;
    this.selectedAttestClientWorkers = this.route.snapshot.data["attest_client_workers"];

    if (this.language == "en") {
      this.message = "You have successfully created Subproject!";
      this.messageErr = "You did not create Subproject";
      this.messageCont = "You must select a contact person!";
    } else {
      this.message = "Du har framgångsrikt skapat delprojekt!";
      (this.messageErr = "Du skapade inte delprojekt"), "Delprojekt!";
      this.messageCont = "Du måste välja en kontaktperson!";
    }

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

    this.previousRoute = "/projects/view/" + this.projectID;
    this.appService.setBackRoute(this.previousRoute);
    this.appService.setShowAddButton = false;

    this.getProjectManagers();
    this.getConstructionForm();
    this.getDebitForm();
    this.offers = this.route.snapshot.data["offers"].data;
    console.log(this.offers)

    this.offers.forEach(offer => {
      this.offerList.push({
        id: offer.id,
        status: offer.name + " " + offer.offerNum
      });
    });

    this.parent_project = this.route.snapshot.data["parent_project"];

    this.initForm = this.route.snapshot.data["parent_project"];

    this.selectedClientWorkers = this.parent_project.selectedClientWorkers;
    // this.route.snapshot.data["active_client_workers"];
    this.contactPeopleSelected = this.selectedClientWorkers;

    this.initForm["client_workers"] = this.parent_project.selectedClientWorkers;
    // this.route.snapshot.data["active_client_workers"];

    this.selected_debit = {
      'Id': this.parent_project.debit_Id,
      'Name': this.parent_project.debit_name
    }

    if (this.parent_project.mainContactPerson == 0) {
      this.parent_project.mainContactPerson = "";
    }

    if (this.parent_project.attestWorker2 == 0) {
      this.parent_project.attestWorker2 = "";
    }

    if (this.parent_project.attestWorker3 == 0) {
      this.parent_project.attestWorker3 = "";
    }

    if (this.parent_project.attestWorker4 == 0) {
      this.parent_project.attestWorker4 = "";
    }

    this.attest_workers[0] = this.parent_project.mainContactPerson;
    this.attest_workers[1] = this.parent_project.attestWorker2;
    this.attest_workers[2] = this.parent_project.attestWorker3;
    this.attest_workers[3] = this.parent_project.attestWorker4;

    this.createForm = this.fb.group(
      {
        name: [
          this.parent_project.name,
          [Validators.required, NoWhitespaceValidator.noWhitespaceValidator],
        ],
        responsiblePerson: ["", []],
        responsiblePersonId: ["", []],
        deliveryContact: [
          this.parent_project.deliveryContact,
          [Validators.required],
        ],
        deliveryContact_name: [this.parent_project.deliveryFullName, [Validators.required]], //""
        street: [this.parent_project.street, []],
        zip: [this.parent_project.zip, []],
        city: [this.parent_project.city, []],
        parent: [this.projectID, []],
        status: ["1", []],
        activity: [this.parent_project.activity],
        activity_name: [""],
        client_id: [{value: this.parent_project.client_id, disabled: true}, [Validators.required]],
        client_id_name: [{value: this.parent_project.client_id_name, disabled: true}, [Validators.required]],
        mainContactPerson: [this.parent_project.mainContactPerson, []],
        payment_type: ["WEEKLY_REPORT", []],
        attestWorker2: [this.parent_project.attestWorker2, []],
        attestWorker3: [this.parent_project.attestWorker3, []],
        attestWorker4: [this.parent_project.attestWorker4, []],
        selectedMainContact: [
          this.parent_project?.selectedMainContact,
          [Validators.required],
        ],
        StartDate: ["", [Validators.required]],
        EndDate: ["", [Validators.required]],
        TehnicReview: ["", []],
        CustomName: [{value: this.parent_project.activity != 0 ? this.parent_project.CustomName : `${this.parent_project.CustomName}-${this.parent_project.sub_count}`, disabled: true},
          [Validators.required, NoWhitespaceValidator.noWhitespaceValidator],
        ],
        ConstructionManagerID: ["", []],
        PlaceManagerID: ["", []],
        ClientConstructionManagerID: ["", []],
        ClientPlaceManagerID: ["", []],
        offerId: ["", []],
        construction_Id: [this.parent_project.construction_Id, []],
        debit_Id: [this.parent_project.debit_Id, []],
        ProjectSkilledHourlyRate: [
          this.parent_project.ProjectSkilledHourlyRate,
        ],
        ProjectWorkerHourlyRate: [this.parent_project.ProjectWorkerHourlyRate],
        AtaSkilledHourlyRate: [this.parent_project.AtaSkilledHourlyRate],
        AtaWorkerHourlyRate: [this.parent_project.AtaWorkerHourlyRate],
        chargeMaterial: [this.parent_project.chargeMaterial, []],
        ataChargeMaterial: [this.parent_project.ata_charge_material, []],
        chargeEquipment: [this.parent_project.chargeEquipment, []],
        chargeUE: [this.parent_project.chargeUE, []],
        ataChargeUE: [this.parent_project.ata_charge_ue, []],
        estimatedRunTime: [this.parent_project.estimatedRunTime, []],
        estimatedFixTime: [this.parent_project.estimatedFixTime, []],
        skvId: [this.parent_project.skvId, []],
        clientsProjectName: [this.parent_project.clientsProjectName, []],
        clientProjectNumber: [this.parent_project.clientProjectNumber, []],
        tenderSum: ["0", []],
        contractAmount: ["0", []],
        resursKonto1: ["0", []],
        resursKonto2: ["0", []],
        invoice_reference_name: ["", []],
        invoice_reference: ["", []],
        clientCity: [this.parent_project.clientCity, []],
        clientStreet: [this.parent_project.clientStreet, []],
        clientZip: [this.parent_project.clientZip, []],
        clientName: [this.parent_project.clientName, []],
        clientWorker_name: [this.parent_project.clientWorker_name, []],
        construction_name: [this.parent_project.construction_name, []],
        debit_name: [this.parent_project.debit_name, []],
        internalProject: [
          Boolean(parseInt(this.parent_project.internalProject, 10)),
          [],
        ],
        connect_with_moments: [this.parent_project.connect_with_moments, [Validators.required]],
        project_relation: [0, []],
        project_relation_name: ['', []],
      },
      {
        validator: [
          SelectValidator.selectStatusValidator,
          SelectValidator.selectResposibleValidator,
        ],
      }
    );

    const activity_id = this.parent_project.activity;

    const res = await this.projectsService.getActiveActivities(
      this.parent_project.activity,
      this.parent_project.id
    );

    if (res["status"]) {
      this.categories = res["data"];

      if (activity_id != 0) {
        this.searchForActivity(res["data"], activity_id);
      } else {
        res["data"].forEach((category) => {
          const activities = category["activities"];
          category["activities"] = this.returnMappedActivities(activities);
          this.activities = this.activities.concat(activities);
        });
      }
    }

    this.getClient();

    this.initDatePickers();

    this.clientsService.showNewClientForm.subscribe((val) => {
      this.componentVisibility = val;
    });

    this.clientsService.client.subscribe((data) => {
      if (data != null) {
        if (typeof data === "object") {
          data["finalName"] = data["Name"];
        }
        this.clients.push(data);
      }
    });


    this.clientsService.clientWorker.subscribe((data) => {
      if (data != null) {
        this.client_workers.push(data);
        this.client_workers = this.client_workers.slice(0);
      }
    });

    this.company_workers = this.route.snapshot.data["company_workers"]["data"];
    /* this.selectedCoworkers = this.route.snapshot.data["active_company_workers"]; */
    /* this.onChangesStartDate(); */
  }

  ngOnDestroy() {
    this.hideBodyScroll('auto');
  }

  hideBodyScroll(overflow) {

    document.body.style.overflow = overflow;
    this.selectedCoworkers = this.route.snapshot.data["parent_project"]["responsiblePeople"];
  }

  ngAfterViewInit() {
    this.initDatePickers();
    this.setValidation();
  }

  public onCloseClick() {
    this.clientsService.setComponentVisibility(0);
  }

  getProjectManagers() {
    this.userService.getProjectManagers().subscribe((response) => {
      this.responsiblePersons = response["data"].map((person) => {
        person["finalName"] = person["username"];
        return person;
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

  async createSubProject() {

    const invalid = [];
    const controls = this.createForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }

    if (this.createForm.invalid || this.selectedCoworkers.length < 1) {
      setTimeout(() => {
        document.querySelector(".is-invalid").scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }, 100);
      return;
    }

    this.createForm.value.StartDate = this.StartDate || "";
    this.createForm.value.EndDate = this.EndDate || "";
    this.createForm.value.TehnicReview = this.TehnicReview || "";
    this.showSelectClientWorker = true;
    this.createForm.value.CustomName = this.createForm.get('CustomName').value;

    const data = this.createForm.value;


    if (this.selectedCoworkers.length > 0) {


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

      let res_person = this.selectedCoworkers[0];
      let user_name =
        res_person["Name"].split(" ")[0] +
        " " +
        res_person["Name"].split(" ")[1];
      data.responsiblePersonId = res_person["Id"];
      data.responsiblePerson = user_name;
    }

    if (data.responsiblePersonId) {
      data.clientWorkers = this.selectedClientWorkers;
      data.companyWorkers = this.selectedCoworkers;
      data.client_id = this.parent_project.client_id;
      data.client_id_name = this.parent_project.client_id_name;
      data.construction_name = this.parent_project.construction_name;
      this.projectsService.createProject(data).then(async (res) => {
        this.actionStatus = res["status"] ? 1 : 0;

        if (this.actionStatus) {
          switch (data.status) {
            case "1":
              data.status = "NOTSTARTED";
              break;
            case "2":
              data.status = "ONGOING";
              break;
            case "3":
              data.status = "COMPLETED";
              break;
          }

          if (this.actionStatus) {
            await this.userCheck(res["ProjectID"]);

            this.toastr.success(this.message, "Delproject!");
            this.router.navigate(["/projects/view/", res["ProjectID"]]);
          } else {
            this.toastr.error(this.messageErr, "Delprojekt!");
          }

          this.spinner = false;
        }
      });
    } else {
      this.toastr.error(this.messageCont, "Fel");
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
      this.getDebitForms = response["data"].filter((item)=>{
        return item.Id != 6;
      });
    });
  }

  getClient() {
    this.clientsService.getClients().subscribe((response) => {
      this.clients = response["data"].map((client) => {
        client["finalName"] = client["Name"];
        return client;
      });

      const value = {
        value: this.clients.find(
          (client) => client.Id == this.parent_project.client_id
        ).Id,
      };

      this.setContactPersons(value, false);
    });
  }

  setContactPersons(client_id, resetSelectedClientWorkers = true) {
    let client = client_id.value;
    this.client_workers = [];

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
        if (resetSelectedClientWorkers) {
          this.selectedClientWorkers = [];
        }
      });
    } else {
      this.client_workers = [];
      this.showSelectClientWorker = true;
      if (resetSelectedClientWorkers) {
        this.selectedClientWorkers = [];
      }
    }
  }

  openActivityModal() {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.data = { activities: this.categories };

    this.dialog
      .open(NewActivityComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response && response.status) {
          response[
            "finalName"
          ] = `${response["number"]} ${response["description"]}`;
          this.activities.push(response);
        }
      });
  }

  async userCheck(ProjectID) {
    const res = await this.authService.getAuthUser();
    if (res["status"]) {
        res['opts'].role_name = this.AESEncryptDecryptService.sha256(res['opts'].role_name);
        sessionStorage.setItem("userDetails", JSON.stringify(res["opts"]));
    }
  }

  displayError(input: string) {
    const control = this.createForm.get(input);
    return (
      (this.myform.submitted && control.invalid) ||
      (control.dirty && control.invalid)
    );
  }

  searchForActivity(data, activity_id) {
    activity_id = Number(activity_id);

    for (let i = 0; i < data.length; i++) {
      const category = data[i];
      const start_id = Number(category.start_id);
      const end_id = Number(category.end_id);
      const category_id = Number(category.id);
      const activities = category["activities"];

      if (category_id === activity_id) {
        category["activities"] = this.returnMappedActivities(activities);
        this.activities = activities;
        break;
      }

      if (activity_id >= start_id && activity_id <= end_id) {
        this.searchForActivity(activities, activity_id);
      }
    }
  }

  returnMappedActivities(activities) {
    return activities.map((activity) => {
      activity[
        "finalName"
      ] = `${activity["number"]} ${activity["description"]}`;
      return activity;
    });
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


  projectStatusSelected(selectedStatus, formControlName) {
    this.createForm.get(formControlName).patchValue(selectedStatus.id);
  }

  projectActivitySelected(selectedStatus, formControlName) {
    this.createForm.get(formControlName).patchValue(selectedStatus.id);
  }

  toggleAttestWorkerHidden(event, formControlName) {
    if (event.status === true) {
      this.createForm.get(formControlName).patchValue(event.Id);
      if (!this.createForm.get('selectedMainContact').value) {
        if(formControlName === "mainContactPerson") {
          this.needToHaveOrangeBorder1 = true;
        } else if (formControlName === "attestWorker2") {
          this.needToHaveOrangeBorder2 = true;
        } else if (formControlName === "attestWorker3") {
          this.needToHaveOrangeBorder3 = true;
        } else {
          this.needToHaveOrangeBorder4 = true;
        }
        this.createForm.get('selectedMainContact').patchValue(event.Id);
      }
    } else {
      this.createForm.get(formControlName).patchValue("");
    }

    this.contactPeopleSelected = this.contactPeopleSelected.map((worker)=>{
      if (worker.Id == event.Id) {
        return { ...worker, hidden: event.status };
      }
      return worker;
    });

    this.someArrayForMainPerson.push(event);
    if(this.someArrayForMainPerson[this.someArrayForMainPerson.length - 2]?.status == false && this.someArrayForMainPerson[this.someArrayForMainPerson.length - 2].Id == this.createForm.get('selectedMainContact').value) {
      this.createForm.get('selectedMainContact').patchValue(this.someArrayForMainPerson[this.someArrayForMainPerson.length - 1].Id)
    }
  }

  onItemDeSelect(item) {
    this.contactPeopleSelected = this.contactPeopleSelected.filter((worker) => {
      return worker.Id !== item.Id;
    });
  }

  onItemSelect(item){
   //this.contactPeopleSelected.push(item);
   this.contactPeopleSelected = item;
  }

  onSelectAll(items) {
    this.contactPeopleSelected = items;

    this.contactPeopleSelected.forEach((contactPeople) => {
      if(this.createForm.get('mainContactPerson').value) {
        if(this.createForm.get('mainContactPerson').value == contactPeople.Id) {
          contactPeople.hidden = true;
        }
      }

      if(this.createForm.get('attestWorker2').value) {
        if(this.createForm.get('attestWorker2').value == contactPeople.Id) {
          contactPeople.hidden = true;
        }
      }

      if(this.createForm.get('attestWorker3').value) {
        if(this.createForm.get('attestWorker3').value == contactPeople.Id) {
          contactPeople.hidden = true;
        }
      }

      if(this.createForm.get('attestWorker4').value) {
        if(this.createForm.get('attestWorker4').value == contactPeople.Id) {
          contactPeople.hidden = true;
        }
      }
    });
  }

  onDeSelectAll(items){
    this.contactPeopleSelected = items;
  }

  getDefaultMainContactPerson() {
    const defaultId = this.createForm.get('mainContactPerson').value;
    if(defaultId === this.createForm.get("selectedMainContact").value){
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

  toggleEmptyWorkerParent(num) {

    if((num === 0) && (this.createForm.get('mainContactPerson').value === this.createForm.get('selectedMainContact').value)) {
      this.needToHaveOrangeBorder1 = false;
      if(this.createForm.get('attestWorker2').value) {
        this.needToHaveOrangeBorder2 = true;
        this.createForm.get('selectedMainContact').patchValue(this.createForm.get('attestWorker2').value);
      } else if(this.createForm.get('attestWorker3').value) {
        this.needToHaveOrangeBorder3 = true;
        this.createForm.get('selectedMainContact').patchValue(this.createForm.get('attestWorker3').value);
      } else if(this.createForm.get('attestWorker4').value) {
        this.needToHaveOrangeBorder4 = true;
        this.createForm.get('selectedMainContact').patchValue(this.createForm.get('attestWorker4').value);
      } else {
        this.needToHaveOrangeBorder1 = false;
        this.needToHaveOrangeBorder2 = false;
        this.needToHaveOrangeBorder3 = false;
        this.needToHaveOrangeBorder4 = false;
        this.createForm.get('selectedMainContact').patchValue("");
      }
    }

    if((num === 1) && (this.createForm.get('attestWorker2').value === this.createForm.get('selectedMainContact').value)) {
      this.needToHaveOrangeBorder2 = false;
      if(this.createForm.get('attestWorker3').value) {
        this.needToHaveOrangeBorder3 = true;
        this.createForm.get('selectedMainContact').patchValue(this.createForm.get('attestWorker3').value);
      } else if(this.createForm.get('attestWorker4').value) {
        this.needToHaveOrangeBorder4 = true;
        this.createForm.get('selectedMainContact').patchValue(this.createForm.get('attestWorker4').value);
      } else if(this.createForm.get('mainContactPerson').value) {
        this.needToHaveOrangeBorder1 = true;
        this.createForm.get('selectedMainContact').patchValue(this.createForm.get('mainContactPerson').value);
      } else {
        this.needToHaveOrangeBorder1 = false;
        this.needToHaveOrangeBorder2 = false;
        this.needToHaveOrangeBorder3 = false;
        this.needToHaveOrangeBorder4 = false;
        this.createForm.get('selectedMainContact').patchValue("");
      }
    }

    if((num === 2) && (this.createForm.get('attestWorker3').value === this.createForm.get('selectedMainContact').value)) {
      this.needToHaveOrangeBorder3 = false;
      if(this.createForm.get('attestWorker4').value) {
        this.needToHaveOrangeBorder4 = true;
        this.createForm.get('selectedMainContact').patchValue(this.createForm.get('attestWorker4').value);
      } else if (this.createForm.get('mainContactPerson').value) {
        this.needToHaveOrangeBorder1 = true;
        this.createForm.get('selectedMainContact').patchValue(this.createForm.get('mainContactPerson').value);
      } else if (this.createForm.get('attestWorker2').value) {
        this.needToHaveOrangeBorder2 = true;
        this.createForm.get('selectedMainContact').patchValue(this.createForm.get('attestWorker2').value);
      } else {
        this.needToHaveOrangeBorder1 = false;
        this.needToHaveOrangeBorder2 = false;
        this.needToHaveOrangeBorder3 = false;
        this.needToHaveOrangeBorder4 = false;
        this.createForm.get('selectedMainContact').patchValue("");
      }
    }

    if((num === 3) && (this.createForm.get('attestWorker4').value === this.createForm.get('selectedMainContact').value)) {
      this.needToHaveOrangeBorder4 = false;
      if(this.createForm.get('attestWorker3').value) {
        this.needToHaveOrangeBorder3 = true;
        this.createForm.get('selectedMainContact').patchValue(this.createForm.get('attestWorker3').value);
      } else if (this.createForm.get('attestWorker2').value) {
        this.needToHaveOrangeBorder2 = true;
        this.createForm.get('selectedMainContact').patchValue(this.createForm.get('attestWorker2').value);
      } else if (this.createForm.get('mainContactPerson').value) {
        this.needToHaveOrangeBorder1 = true;
        this.createForm.get('selectedMainContact').patchValue(this.createForm.get('mainContactPerson').value);
      } else {
        this.needToHaveOrangeBorder1 = false;
        this.needToHaveOrangeBorder2 = false;
        this.needToHaveOrangeBorder3 = false;
        this.needToHaveOrangeBorder4 = false;
        this.createForm.get('selectedMainContact').patchValue("");
      }
    }

    switch(num) {
      case 0:
        this.createForm.get('mainContactPerson').patchValue("");
        break;
      case 1:
        this.createForm.get('attestWorker2').patchValue("");
        break;
      case 2:
        this.createForm.get('attestWorker3').patchValue("");
        break;
      default:
        this.createForm.get('attestWorker4').patchValue("");
    }
  }

  toggleDeletedFromArrayParent(num: number) {
    if(num === 0) {
      if(this.createForm.get('mainContactPerson').value === this.createForm.get('selectedMainContact').value) {
        this.createForm.get('mainContactPerson').patchValue("");
        this.createForm.get('selectedMainContact').patchValue("");
        this.toggleEmptyWorkerParent(0);
      } else {
        this.createForm.get('mainContactPerson').patchValue("");
      }
    }

    if(num === 1) {
      if(this.createForm.get('attestWorker2').value === this.createForm.get('selectedMainContact').value) {
        this.createForm.get('attestWorker2').patchValue("");
        this.createForm.get('selectedMainContact').patchValue("");
        this.toggleEmptyWorkerParent(1);
      } else {
        this.createForm.get('attestWorker2').patchValue("");
      }
    }

    if(num === 2) {
      if(this.createForm.get('attestWorker3').value === this.createForm.get('selectedMainContact').value) {
        this.createForm.get('attestWorker3').patchValue("");
        this.createForm.get('selectedMainContact').patchValue("");
        this.toggleEmptyWorkerParent(2);
      } else {
        this.createForm.get('attestWorker3').patchValue("");
      }
    }

    if(num === 3) {
      if(this.createForm.get('attestWorker4').value === this.createForm.get('selectedMainContact').value) {
        this.createForm.get('attestWorker4').patchValue("");
        this.createForm.get('selectedMainContact').patchValue("");
        this.toggleEmptyWorkerParent(3);
      } else {
        this.createForm.get('attestWorker4').patchValue("");
      }
    }
  }

  getDefaultAttestWorker2() {
    const defaultId = this.createForm.get('attestWorker2').value;
    if(defaultId === this.createForm.get("selectedMainContact").value){
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
    const defaultId = this.createForm.get('attestWorker3').value;
    if(defaultId === this.createForm.get("selectedMainContact").value){
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
    const defaultId = this.createForm.get('attestWorker4').value;
    if(defaultId === this.createForm.get("selectedMainContact").value){
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

/*   onChangesStartDate(): void {
    this.startDateSubscription = this.createForm.get('StartDate').valueChanges.subscribe(val => {
      const EndDate = new Date(val.split(" ")[0]);
      $("#dateSelectEndDate").datepicker("setDate", new Date(EndDate));
    });
  } */


  onChangesStartDate(): void {
    const val = this.createForm.get('StartDate').value;
    if(val) {
      const EndDate = new Date(val.split(" ")[0]);
      $("#dateSelectEndDate").datepicker("setDate", new Date(EndDate));
    }
  }

  constructionFormSelected(selectedConsForm, formControlName) {
    this.createForm.get(formControlName).patchValue(selectedConsForm.Id);
  }

  isProjectLopande() {
    let newGetDebitForms: any;
    if(this.createForm.get('debit_Id').value == '1') {
      this.isLopande = true;
    }

    if(this.isLopande) {
      newGetDebitForms = this.getDebitForms?.filter((element) => {
        return element.Id != '2';
      });
    } else {
      newGetDebitForms = this.getDebitForms;
    }

    return newGetDebitForms;
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

  selectProjectActivity(e, formControlName) {
    this.createForm.get(formControlName).patchValue(e.Id);
    this.createForm.get('CustomName').patchValue(this.parent_project.CustomName + '-' + e.number);
  }

  selectedCoworkersArray: string[];
  onItemSelectContactPersone(item){
    this.selectedCoworkers = [];
    this.selectedCoworkersArray = item;
    this.selectedCoworkers = this.selectedCoworkersArray;
  }

  openProjectClientDetailsModal($event) {
    $event.preventDefault();
    this.clientsService.client.next(this.parent_project.client_id,);
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.panelClass = 'custom-modalbox-client-detail';
    diaolgConfig.autoFocus = false;
    diaolgConfig.width = "";
    diaolgConfig.height = 'auto';
    diaolgConfig.disableClose = false;
    diaolgConfig.data = {
      clientCategories: this.clientCategories
    };
    this.dialog
        .open(ClientProjectDetailsComponent, diaolgConfig);
    }

  onSelectAllContactPersone(items){

    this.selectedCoworkersArray = [];
    this.selectedCoworkersArray = items;
    this.selectedCoworkers = this.selectedCoworkersArray;

  }

  onDeSelectAllContactPersone(){
    this.selectedCoworkers = [];
  }

  GetDeliveryContact(selectedClient){
    this.createForm.get('deliveryContact').setValue(selectedClient.value);
    this.createForm.get('deliveryContact_name').setValue(selectedClient.name);
  }

  GetFakturaRef(selectedFakturaRef){
    this.createForm.get('invoice_reference').setValue(selectedFakturaRef.Id);
    this.createForm.get('invoice_reference_name').setValue(selectedFakturaRef.name);
  }

  setPaymentType(payment_type) {
    this.createForm.get("payment_type").setValue(payment_type);
    this.createForm.markAsDirty();
  }

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

    setValidation() {
        let internal_project = this.createForm.get("internalProject").value;

        console.log(internal_project)

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
    

  offerSelected(selected, formControlName) {
    // console.log(selected)
    // const offerSelected = this.offers.find((offer) => offer.id == selected.id);
    // console.log(offerSelected)
    // this.setContactPersons({
    //   Id: offerSelected.client_id,
    //   name: offerSelected.cl_name
    // });
    // this.createForm.get("clientsProjectName").patchValue(offerSelected.clientsProjectName);
    // this.createForm.get("clientProjectNumber").patchValue(offerSelected.clientProjectNumber);
    // this.createForm.get("resursKonto1").patchValue(offerSelected.ResourceAccount);

    // this.createForm.get("street").patchValue(offerSelected.street);
    // this.createForm.get("zip").patchValue(offerSelected.zip);
    // this.createForm.get("city").patchValue(offerSelected.city);

    // this.createForm.get("clientStreet").patchValue(offerSelected.street2);
    // this.createForm.get("clientZip").patchValue(offerSelected.zip2);
    // this.createForm.get("clientCity").patchValue(offerSelected.city2);

    // this.createForm.get("estimatedRunTime").patchValue(offerSelected.estimatedRunTime);
    // this.createForm.get("estimatedFixTime").patchValue(offerSelected.estimatedFixTime);

    // this.createForm.get("ProjectSkilledHourlyRate").patchValue(offerSelected.SkilledHourlyRate);
    // this.createForm.get("ProjectWorkerHourlyRate").patchValue(offerSelected.WorkerHourlyRate);
    // this.createForm.get("chargeMaterial").patchValue(offerSelected.chargeMaterial);
    // this.createForm.get("chargeUE").patchValue(offerSelected.chargeUE);

    // this.createForm.get("AtaSkilledHourlyRate").patchValue(offerSelected.AtaSkilledHourlyRate);
    // this.createForm.get("AtaWorkerHourlyRate").patchValue(offerSelected.AtaWorkerHourlyRate);
    // this.createForm.get("ataChargeMaterial").patchValue(offerSelected.ATAchargeMaterial);
    // this.createForm.get("ataChargeUE").patchValue(offerSelected.ATAchargeUE);

    // this.createForm.get("offer").patchValue(selected.status);
    // this.createForm.get("offerId").patchValue(selected.id);
    // console.log(this.createForm.value)
    //this.createForm.get(formControlName).patchValue(selected.id);
  }
}

