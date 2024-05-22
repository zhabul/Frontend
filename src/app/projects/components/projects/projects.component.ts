import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
//import { ConsoleReporter } from "jasmine";
import { AppService } from "src/app/core/services/app.service";
import { UsersService } from "src/app/core/services/users.service";
import { __values } from "tslib";

declare var $: any;

@Component({
  selector: "app-projects",
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.css", "../../../utility/radio-button.css"],
})
export class ProjectsComponent implements OnInit {
  public objData: any = {};
  public userDetails: any;
  public projects: any[];
  public originProjectList: any[];
  public date: any;
  public currentClass = "title-new-project";
  public selectedDate: any = 0;
  public selectedStatus: any = 0;
  public selectResponsiblePerson: any = 0;
  public isHidden: boolean = true;
  public week = "Week";
  public cust_trans: any[];
  public statusText: any[];
  public currentAddRoute: string;
  public previousRoute: string;
  public project_ids: any[] = [];
  public page = 0;
  public numberOfRowsArray = [];
  public showPagination = true;
  public buttonToggle = false;
  public from_edit:boolean = false;
  public statusObjectProjects: any = {
    all: false,
    "1": false,
    "2": false,
    "3": false,
    "4": false,
    "5": false
  };

  @ViewChild("searchInput") searchInput: ElementRef;
  @ViewChild("selectedDate") selectedDateInput: ElementRef;
  @ViewChild("selectStatus") selectStatusInput: ElementRef;
  public searchText = "all";

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private appService: AppService,
    private usersService: UsersService
  ) {}

  async ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
        this.from_edit = params.get("from_edit") ? JSON.parse(params.get("from_edit")) : false;
    });

    if(!this.from_edit) {
        sessionStorage.removeItem("filterProjectsBySearch");
    }

    this.getUserPermissionTabs();
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    this.project_ids = this.route.snapshot.data["project_ids"];
    this.week = this.translate.instant("Week");

    this.translate.use(sessionStorage.getItem("lang"));
    this.previousRoute = "/home";
    this.appService.setBackRoute(this.previousRoute);
    this.currentAddRoute = "/projects/new";
    this.appService.setAddRoute(this.currentAddRoute);
    this.appService.setShowAddButton =
      true && this.userDetails.create_project_Global;

    this.statusText = [
      0,
      this.translate.instant("On Hold"),
      this.translate.instant("In Progress"),
      this.translate.instant("Completed"),
    ];

    $("#dateSelect")
      .datepicker({
        format: "yyyy-mm-dd",
        viewMode: "years",
        minViewMode: "years",
        calendarWeeks: true,
        autoclose: true,
        language: this.userDetails.language,
        currentWeek: true,
        currentWeekTransl: this.week,
        todayHighlight: true,
        currentWeekSplitChar: "-",
        weekStart: 1,
      })
      .on("changeDate", (ev) => {
        this.onSearch(
          ev.target.value,
          this.selectStatusInput.nativeElement.value,
          this.searchInput.nativeElement.value
        );
      });

    this.originProjectList = this.route.snapshot.data["projects"];
    this.projects = JSON.parse(JSON.stringify(this.originProjectList));
    this.numberOfRowsArray = new Array(
      Math.ceil(this.originProjectList.length / 20)
    );
    this.selectResponsiblePerson = this.userDetails.user_id;
    this.refreshSearch();
  }

  refreshSearch() {

    let filterUsersBySearch = JSON.parse(sessionStorage.getItem("filterProjectsBySearch"));
    if(filterUsersBySearch && filterUsersBySearch.length > 0) {
        let search = document.getElementById('searchInput') as HTMLInputElement;
        search.value = filterUsersBySearch;
        this.onSearch('', 0, search.value);
    }else {
        this.onSearch("", 2, "");
    }
}

    checkAll(status) {
        const keys = Object.keys(this.statusObjectProjects);
        keys.forEach((key) => {
        this.statusObjectProjects[key] = status;
        if (key !== "all") {
            this.createUserPermissionTabs(key, "Projects", status);
        }
        });
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

  onSearch(date, status, search) {

    sessionStorage.setItem("filterProjectsBySearch", JSON.stringify(search));
    if (search == "" && status == 0 && date == "") {
      if (this.statusObjectProjects[status]) {
        this.projects = JSON.parse(JSON.stringify(this.originProjectList));
      } else {
        this.projects = [];
      }

      if (this.originProjectList.length > 20) {
        this.showPagination = true;
      }
    } else {
      this.showPagination = false;
    }

    this.projects = this.originProjectList.filter((project) =>
      this.checkIfProjectOrSubprojectsShouldShow(project, status, date, search)
    );

    this.sortProjectsBasedOnStatus();
  }

  checkIfProjectOrSubprojectsShouldShow(project, status, date, searchQuery) {
    const doesIncludeInName = [
      "name",
      "CustomName",
      "activityNumber",
      "activityDescription",
      "StartDate",
      "EndDate",
      "TehnicReview",
    ].some((property) => {
      if (project[property]) {
        return project[property]
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      } else {
        return false;
      }
    });

    if (
      doesIncludeInName &&
      (status == 0 || this.statusObjectProjects[project.status]) &&
      (date == "" ||
        new Date(project.StartDate.split(" ")[0]).getFullYear() ==
          new Date(date.split(" ")[0]).getFullYear())
    ) {
      return true;
    }

    return project.activities.some((a) =>
      this.checkIfProjectOrSubprojectsShouldShow(a, status, date, searchQuery)
    );
  }

    getAll() {

        this.searchInput.nativeElement.value = "";
        this.selectedDateInput.nativeElement.value = "";
        this.selectStatusInput.nativeElement.selectedIndex = 0;
        this.selectedDate = 0;
        this.searchText = "all";
        this.selectedStatus = 0;
        this.showPagination = true;
        this.projects = JSON.parse(JSON.stringify(this.originProjectList));
    }

    onStatusChange(value) {
        const type = "Projects";
        const searchInput = this.searchInput.nativeElement;
        const status = !this.statusObjectProjects[value];

        if (value == "all") {
            this.checkAll(status);
        } else {
            if (!status) {
                this.statusObjectProjects["all"] = false;
            }
            this.statusObjectProjects[value] = status;
            this.createUserPermissionTabs(value, type, status);
            this.handleAllStatus("Projects");
        }

        this.onSearch(this.selectedDate, value, searchInput.value);
        this.sortProjectsBasedOnStatus();
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
    statusObject["all"] = flag;
  }

  getUserPermissionTabs() {

    this.usersService.getUserPermissionTabs().subscribe((res) => {
      const projects = res["data"]["Projects"];

      if (projects) {
        const searchInput = this.searchInput.nativeElement;
        const keys_projects = Object.keys(projects);
        keys_projects.forEach((status) => {
          this.statusObjectProjects[status] = true;
          this.onSearch(this.selectedDate, status, searchInput.value);
        });

        if (keys_projects.length == 5) {
          this.statusObjectProjects["all"] = true;
          this.onSearch(this.selectedDate, "all", searchInput.value);
        }
      }
    });
  }

  sortProjectsBasedOnStatus() {
    if (this.statusObjectProjects["3"]) {
      this.sortProjectsByNumber("first_gear");
      return;
    }

    this.sortProjectsByNumber("reverse");
  }

  sortProjectsByNumber(type) {
    const sortBy = [2, 4, 1, 3, 5];
    const sortByObject = sortBy.reduce((a, c, i) => {
      a[c] = i;
      return a;
    }, {});

    this.projects = this.projects.sort((project1, project2) => {
      const a_nr = project1.CustomName.replace(/\D/g, "");
      const b_nr = project2.CustomName.replace(/\D/g, "");
      const a_s = project1.status;
      const b_s = project2.status;
      const status_compare =
        Number(sortByObject[a_s]) - Number(sortByObject[b_s]);

      if (a_s == 3 && b_s == 3) {
        if (type === "reverse") {
          return status_compare || Number(a_nr) - Number(b_nr);
        }

        return status_compare || Number(b_nr) - Number(a_nr);
      }

      return status_compare || Number(a_nr) - Number(b_nr);
    });
  }
  enter() {
    this.currentClass = "title-new-project-hover";
  }

  leave() {
    this.currentClass = "title-new-project";
  }
}
