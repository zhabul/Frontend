import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ProjectsService } from "src/app/core/services/projects.service";
import { FormGroup, FormControl, NgForm } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";

declare var $;

@Component({
  selector: "app-works",
  templateUrl: "./works.component.html",
  styleUrls: ["./works.component.css"],
})
export class WorksComponent implements OnInit {
  @ViewChild("myform", { static: true }) myform!: NgForm;
  public works: any[] = [];
  public filteringAtas: any[] = [];
  public filteringMoments: any[] = [];
  public filteringUsers: any[] = [];
  public filteringWeeks: any[] = [];
  public filteringMonths: any[] = [];
  public filteringWrState: any[] = [];
  public project;
  public showAdditionalWorkTable = false;
  public overview: boolean = true;
  public timeAttests: boolean = false;
  public details: boolean = false;
  public projectUsers: any[];
  public attestSaved = false;
  public projectUserDetails: any;
  public userDetails: any;
  public totalAdditionalWork: number = 0;
  public totalCostAdditionlWork: number = 0;
  public totalUserCostAdditionlWork: number = 0;
  public totalDiferenceAdditionalWork: number = 0;
  public totalCostAdditionlWork_without_manual: number = 0;
  public totalUserCostAdditionlWork_without_manual: number = 0;
  public totalDiferenceAdditionalWork_without_manual: number = 0;
  public totalAdditionalWorkResult: number = 0;
  public totalCostAdditionlWork_manual: number = 0;
  public totalDiferenceAdditionalWork_manual: number = 0;
  public totalUserCostAdditionlWork_manual: number = 0;
  public additionalWork: any;
  public additionalWorkFiltered: any;
  public spinner = false;
  public totalManualAdditionalWork: number = 0;
  public items: any;
  public state: any;
  public stateValue: any;
  public selectedAta = null;
  public selectedMoment = null;
  public selectedUser = null;
  public selectedWeek = null;
  public selectedMonth = null;
  public selectedInvoicedApproved = null;
  maxPage: any = 0;
  selectedPage = 1;
  pages = [];

  createForm = new FormGroup({
    ata: new FormControl(""),
    ata_name: new FormControl(this.translate.instant("Atas")),
    moment: new FormControl(""),
    moment_name: new FormControl(this.translate.instant("Moments")),
    users: new FormControl(""),
    users_name: new FormControl(this.translate.instant("Users")),
    week: new FormControl(""),
    week_name: new FormControl(this.translate.instant("Weeks")),
    month: new FormControl(""),
    month_name: new FormControl(this.translate.instant("Months")),
    wr_st: new FormControl(""),
    wr_state: new FormControl(this.translate.instant("State")),
  });

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.project = this.route.snapshot.data["project"];
    this.works = this.route.snapshot.data["works"] || [];
    this.projectUsers = this.route.snapshot.data["users"]["data"];
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    this.projectUserDetails = this.route.snapshot.data["projectUserDetails"];
    this.getProjectAdditionalWork(
      true,
      this.project.id,
      null,
      null,
      null,
      null,
      null,
      null,
      20,
      0
    );
  }

  onGetInformation(info, object, text) {
    if (text === "Atas") {
    }

    info.unshift("");
    this[object] = info.map((item) => {
      const newObj = {};

      if (item === "") {
        newObj["finalName"] = this.translate.instant(text);
        newObj["id"] = "";
      } else {
        newObj["finalName"] = item;
        newObj["id"] = item;
      }
      return newObj;
    });
  }

  getProjectAdditionalWork(
    set_data = false,
    project_id,
    ata,
    moment,
    user,
    week,
    month,
    type,
    size = 0,
    from = 20
  ) {
    this.spinner = true;

    this.projectsService
      .getProjectAdditionalWork(
        project_id,
        ata,
        moment,
        user,
        week,
        month,
        type,
        size,
        from
      )
      .then((res) => {
        if (res["status"]) {
          this.additionalWork = res["data"]["moments"];
          this.items = res["data"]["items"];

          if (this.state != "selectedAta" || !this.stateValue) {
            this.filteringAtas = this.items["ata_names"];
          }
          if (this.state != "selectedMoment" || !this.stateValue) {
            this.filteringMoments = this.items["moment_names"];
          }
          if (this.state != "selectedWeek" || !this.stateValue) {
            this.filteringWeeks = this.items["weekly_report_names"];
          }
          if (this.state != "selectedUser" || !this.stateValue) {
            this.filteringUsers = this.items["user_names"];
          }
          if (this.state != "selectedMonth" || !this.stateValue) {
            this.filteringMonths = this.items["month_number"];
          }
          if (this.state != "selectedInvoicedApproved" || !this.stateValue) {
            this.filteringWrState = this.items["weekly_report_states"];
          }
        }

        this.additionalWorkFiltered = JSON.parse(
          JSON.stringify(this.additionalWork)
        );
        if (this.state != "selectedWeek" || !this.stateValue) {
          this.onGetInformation(this.filteringWeeks, "filteringWeeks", "Weeks");
        }
        if (this.state != "selectedAta" || !this.stateValue) {
          this.onGetInformation(this.filteringAtas, "filteringAtas", "Atas");
        }
        if (this.state != "selectedMoment" || !this.stateValue) {
          this.onGetInformation(
            this.filteringMoments,
            "filteringMoments",
            "Moments"
          );
        }
        if (this.state != "selectedMonth" || !this.stateValue) {
          this.onGetInformation(
            this.filteringMonths,
            "filteringMonths",
            "Months"
          );
        }
        if (this.state != "selectedUser" || !this.stateValue) {
          this.onGetInformation(this.filteringUsers, "filteringUsers", "Users");
        }
        if (this.state != "selectedInvoicedApproved" || !this.stateValue) {
          this.onGetInformation(
            this.filteringWrState,
            "filteringWrState",
            "State"
          );
        }

        if (set_data) {
          this.generatePageArray(1);
        }

        this.spinner = false;
      });
  }

  toggleTable(table) {
    this[table] = !this[table];
  }

  setContent(arg) {
    if (arg == "overview") {
      this.overview = true;
      this.timeAttests = false;
      this.details = false;
      $(".btn-details").removeClass("active");
      $(".btn-timeAttests").removeClass("active");
      $(".btn-overview").addClass("active");
    } else if (arg == "timeAttests") {
      this.overview = false;
      this.timeAttests = true;
      this.details = false;
      $(".btn-details").removeClass("active");
      $(".btn-timeAttests").addClass("active");
      $(".btn-overview").removeClass("active");
    } else {
      this.overview = false;
      this.timeAttests = false;
      this.details = true;
      $(".btn-details").addClass("active");
      $(".btn-timeAttests").removeClass("active");
      $(".btn-overview").removeClass("active");
    }
  }

  onAttestSave(e) {
    this.attestSaved = !this.attestSaved;
  }

  setState(info, state) {
    this.state = state;
    this.stateValue = info.value;
    this[state] = info.value;
    this.filterTheList(
      this.project.id,
      this.selectedAta,
      this.selectedMoment,
      this.selectedUser,
      this.selectedWeek,
      this.selectedMonth,
      this.selectedInvoicedApproved,
      20,
      0
    );
  }

  ensureAtest() {
    let status = this.userDetails.show_project_timeattest;
    if (status != 0) return true;
    else return false;
  }

  filterTheList(project_id, ata, moment, user, week, month, type, size, from) {
    if (ata == "") {
      ata = null;
    }

    if (moment == "") {
      moment = null;
    }

    if (user == "") {
      user = null;
    }

    if (week == "") {
      week = null;
    }

    if (month == "") {
      month = null;
    }

    if (type == "") {
      type = null;
    }

    this.getProjectAdditionalWork(
      true,
      project_id,
      ata,
      moment,
      user,
      week,
      month,
      type,
      size,
      from
    );
  }

  generatePageArray(selectedPage, clicked = null) {
    this.maxPage = this.items.number_of_pages;

    this.selectedPage =
      selectedPage > this.maxPage
        ? this.maxPage
        : selectedPage < 1
        ? 1
        : selectedPage;
    const selPageMinus = this.selectedPage - 4;
    const selPagePlus = this.selectedPage + 4;
    const limit =
      selPagePlus > this.maxPage
        ? this.maxPage
        : this.maxPage >= 10
        ? selPagePlus > 10
          ? selPagePlus
          : 10
        : selPagePlus;
    const start =
      selPageMinus < 1
        ? 1
        : selPageMinus > this.maxPage - 9
        ? this.maxPage - 9
        : selPageMinus;

    const newPages = [];

    for (let i = start; i <= limit; i++) {
      newPages.push(i);
    }

    this.pages = newPages;
    let offset = 0;
    if (Number(selectedPage) > 1) {
      offset = (Number(selectedPage) - 1) * 20;
    }

    if (!this.selectedAta) {
      this.selectedAta = null;
    }

    if (clicked)
      this.getProjectAdditionalWork(
        false,
        this.project.id,
        this.selectedAta,
        this.selectedMoment,
        this.selectedUser,
        this.selectedWeek,
        this.selectedMonth,
        this.selectedInvoicedApproved,
        20,
        offset
      );
  }
}
