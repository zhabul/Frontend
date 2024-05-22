import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  HostBinding,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import Quill from "quill";
import { Subject } from "rxjs";
import { PaymentPlanService } from "src/app/core/services/payment-plan.service";
import { UsersService } from "src/app/core/services/users.service";
import { ProjectsService } from "src/app/core/services/projects.service";
const Embed = Quill.import("blots/embed");

export class SmartBreakBlot extends Embed {
  static create() {
    const node: HTMLElement = super.create();
    return node;
  }
}

SmartBreakBlot.blotName = "smartbreak";
SmartBreakBlot.tagName = "br";
Quill.register(SmartBreakBlot);

@Component({
  selector: "app-project-overview",
  templateUrl: "./project-overview.component.html",
  styleUrls: ["./project-overview.component.css"],
  host: { class: "quill-editor" },
})
export class ProjectOverviewComponent implements OnInit {
  projectsData: any;
  sortedProjectsData: any;
  filteredProjectsData: any;
  initialProjectsYears: Set<string>;
  projectsYearsArray = [];
  ongoingProjects = [];
  selectedYears = [];
  filteredProjectsById = [];
  userDetails: any;

  totalSumsOverview = {
    totalAccumulated: 0,
    totalNotSend: 0,
    totalSent: 0,
    totalApproved: 0,
    totalInvoiced: 0,
  };

  totalSumsResults = {
    totalChargeable: 0,
    totalPersonal: 0,
    totalMaterial: 0,
    totalFixedMaterial: 0,
    totalOther: 0,
    totalSum: 0,
    totalInvoiced: 0,
    totalTb: 0,
    totalTg: 0,
    totalTg2: 0,
  };

  companyId = 0;
  public toggle: boolean;
  public toggle2: boolean;
  public opacity = 0;
  public display = "none";
  public translateY = "150px";
  public background = "rgb(128 128 128 / 50%)";
  public currentClass = "title-new";
  public buttonToggle = false;
  public selectedTab = 0;
  public statusObject: any = {
    comming: false,
    ongoing: false,
    completed: false,
    awaitingInspection: false,
  };
  public searchQuery = "";
  public commentsNumber = 0;
  public showCommentsNumber = false;
  public checked_tab:boolean = false;
  public spinner = false;

  @HostBinding("class") class = "quill-editor";
  @ViewChild("quillEditorElement") quillEditorElement;
  @ViewChild("searchInput") searchInput: ElementRef;
  @ViewChild("selectedDate") selectedDateInput: ElementRef;
  resetProjectsDropdown: Subject<void> = new Subject<void>();
  constructor(
    private route: ActivatedRoute,
    private http: PaymentPlanService,
    private usersService: UsersService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private projectsService: ProjectsService
  ) {}

  ngOnInit(): void {
    this.getRouterSnapshots();
    this.initData();
  }

  initData() {

    this.sortActivitiesByProject();
    if(!this.checked_tab) {
        this.setStartingDateYears();
    }
    this.setOngoingProjects();
    this.getAndUpdateTabFilters();
    this.calculateTotalSums();
    this.getComments();
  }

  getAndUpdateTabFilters() {
    this.usersService.getUserPermissionTabs().subscribe({
      next: (res) => {
        if (res["status"]) {
          const permissionData = res["data"]["ProjectOverview"];
          const statusArray = Object.keys(this.statusObject);
          for (const key in permissionData) {
            this.statusObject[statusArray[+key - 1]] = true;
          }
          this.filterProjects();
        }
      },
      error: (err) => {
        this.toastr.error(this.translate.instant("Error"));
      },
    });
  }

  getRouterSnapshots() {
    let projectsData = this.route.snapshot.data["projects"];
    this.projectsData = projectsData.data;
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    this.projectsYearsArray = projectsData.project_years;

    if(this.projectsYearsArray && this.projectsYearsArray.length> 0) {
        this.selectedYears.push(this.projectsYearsArray[this.projectsYearsArray.length - 1]['name']);
    }else {
      //  this.selectedYears.push(new Date().getFullYear());
    }
  }

  getAllProjectsForAnalysis(year = null) {
    this.projectsService.getAllProjectsForAnalysis(year).subscribe((result:any) => {
        if(result.status) {
            this.projectsData = result.data;
            this.initData();
        }
    });
  }

  //start sorting projects and initializing filters initial state

  sortActivitiesByProject() {

    if(this.projectsData == undefined || !this.projectsData) {
        return;
    }

    this.sortedProjectsData = this.projectsData.map((project) => {
      return {
        ...project,
        activities: [],
        background_color: this.getBackgroundColor(project),
      };
    });
    for (let i = this.projectsData.length - 1; i >= 0; i--) {
      if (this.projectsData[i].parent == 0) {
        continue;
      } else {
        const indexOfParent = this.sortedProjectsData.findIndex(
          (project) => project.project_id == this.projectsData[i].parent
        );

        this.sortedProjectsData[indexOfParent].activities.unshift(
          JSON.parse(JSON.stringify(this.sortedProjectsData[i]))
        );
        this.sortedProjectsData.splice(i, 1);
      }
    }

    this.filteredProjectsData = JSON.parse(
      JSON.stringify(this.sortedProjectsData)
    );
  }

  setOngoingProjects() {

    if(this.sortedProjectsData == undefined || !this.sortedProjectsData) {
        return;
    }

    this.ongoingProjects = this.sortedProjectsData.filter(
      (project) => project.project_status == "2"
    );
  }

  setStartingDateYears() {

    if(this.filteredProjectsData == undefined || !this.filteredProjectsData) return;

    this.initialProjectsYears = new Set();
    this.filteredProjectsData.forEach((project) => {
      this.initialProjectsYears.add(project.year);
    });
    //this.createAllYearsDrodownArray();
  }

  createAllYearsDrodownArray() {

    const d = new Date();
    const year = d.getFullYear().toString();
    this.projectsYearsArray = [];
    this.selectedYears = [];

    //converting set to array to sort it by year and pushing it with additional keys for the dropdown
    const initialProjectesYearsArray = Array.from(this.initialProjectsYears);
    initialProjectesYearsArray.sort();
    for (let i = 0; i < initialProjectesYearsArray.length; i++) {
      this.projectsYearsArray.push({
        name: initialProjectesYearsArray[i],
        id: i + 1,
        checked: initialProjectesYearsArray[i] == year ? true : false,
      });
    }
    this.selectedYears.push(year);
  }

  //end sorting projects and initializing filters initial state

  //start filter methods
  filterProjects() {

    if(this.sortedProjectsData == undefined || !this.sortedProjectsData) {
        return;
    }

    if (this.filteredProjectsById.length > 0) this.resetProjectsByIdFilter();

    this.filteredProjectsData = this.sortedProjectsData.filter((project) => {
      if (this.getStatusAndYearFilters(project)) {
        return true;
      } else {
        return false;
      }
    });

    this.calculateTotalSums();
  }

  getStatusAndYearFilters(project) {
    return (
      (this.statusObject.comming &&
        (project.project_status == 1 ||
          this.activityFilter(project.activities, 1))) ||
      (this.statusObject.ongoing &&
        (project.project_status == 2 ||
          this.activityFilter(project.activities, 2))) ||
      (this.statusObject.completed &&
        (project.project_status == 3 ||
          this.activityFilter(project.activities, 3)) &&
        this.selectedYears.includes(project.year)) ||
      (this.statusObject.awaitingInspection &&
        (project.project_status == 4 ||
          this.activityFilter(project.activities, 4)))
    );
  }

  //Activity filter checks if is there an activity in the hierarchy with entered status
  activityFilter(activities, status) {
    for (let i = 0; i < activities.length; i++) {
      if (activities[i].project_status == status) return true;
      if (activities[i].activities.length > 0) {
        if (this.activityFilter(activities[i].activities, status)) {
          return true;
        }
      }
    }
    return false;
  }

  filterProjectsById() {
    this.resetStatusFilters();
    this.resetYearsFilter();
    this.filteredProjectsData = this.sortedProjectsData.filter((project) =>
      this.filteredProjectsById.includes(project.project_id)
    );

    this.statusObject.ongoing = true;
    this.calculateTotalSums();
  }

  selectProjects(newId) {
    const index = this.filteredProjectsById.findIndex((id) => id == newId);
    if (index == -1) {
      this.filteredProjectsById.push(newId);
    } else {
      this.filteredProjectsById.splice(index, 1);
    }
    this.filterProjectsById();
    this.clearSearchText();
  }

  dateFilter(selected) {

    let selectedYear = selected.name;
    let checked = selected.checked;

    this.checked_tab = true;
    this.spinner = true;
    const index = this.selectedYears.findIndex((year) => year == selectedYear);
    if(checked) {
        if (index == -1) {
          this.selectedYears.push(selectedYear);
        }
    }else {
        this.selectedYears.splice(index, 1);
    }

    this.selectedYears = this.selectedYears.filter((value, index, array) => array.indexOf(value) === index);
    let years = this.selectedYears.length > 0 ?  this.selectedYears : null;

    this.projectsService.getAllProjectsForAnalysis(years).subscribe((result:any) => {
        if(result.status) {
            this.filteredProjectsData = [];
            this.projectsData = result.data;
            this.initData();
            this.statusObject.completed = true;
            this.clearSearchText();
            this.filterProjects();
            this.clearSearchText();
            this.calculateTotalSums();
        }
        this.spinner = false;
    });
  }

  selectAllProjects(selectAll) {
    if (selectAll) {
      this.filteredProjectsById = this.ongoingProjects.map(
        (project) => project.project_id
      );
      this.filterProjectsById();
    } else {
      this.filteredProjectsById = [];
      this.resetStatusFilters();
      this.statusObject.ongoing = false;
      this.filterProjects();
    }
    this.clearSearchText();
    this.calculateTotalSums();
  }

  searchQueryFilter() {
    this.filterProjects();
    this.filteredProjectsData = this.filteredProjectsData.filter((project) =>
      project.project_name
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase())
    );
    this.calculateTotalSums();
  }

  //start reset filter methods

  resetProjectByIdFilter() {
    if (this.filteredProjectsById.length > 0) {
      this.filteredProjectsById = [];
    }
  }

  resetStatusFilters() {
    for (const key in this.statusObject) {
      this.statusObject[key] = false;
    }
  }

  resetYearsFilter() {

    this.selectedYears = [];
    const d = new Date();
    const year = d.getFullYear().toString();
    this.selectedYears.push(year);
  }

  resetProjectsByIdFilter() {
    this.filteredProjectsById = [];
    this.resetProjectsDropdown.next();
  }

  //end reset filter methods

  enter() {
    this.currentClass = "title-new-project-hover";
  }

  leave() {
    this.currentClass = "title-new-project";
  }
  buttonNameToggle() {
    this.buttonToggle = !this.buttonToggle;
  }

  setSelectedTab(tab) {
    this.selectedTab = tab;
    this.buttonToggle = false;
    this.calculateTotalSums();
  }

  clearSearchText() {
    this.searchQuery = "";
  }

    onStatusChange(value) {

        this.spinner = true;
        this.checked_tab = true;
        this.statusObject[value] = !this.statusObject[value];
        this.postFilterUpdate(value);
        let years = this.selectedYears.length > 0 ?  this.selectedYears : null;

        this.projectsService.getAllProjectsForAnalysis(years).subscribe((result:any) => {

            if(result.status) {
                this.projectsData = result.data;
            //    this.projectsYearsArray = result.project_years;
                this.initData();
                this.clearSearchText();
                this.filterProjects();
            }
            this.spinner = false;
        });
    }

    async onStatusChange2(value) {
        this.checked_tab = true;
        this.statusObject.completed = true;
        this.clearSearchText();
        this.filterProjects();
    }

  onStatusChange1(value) {
    this.statusObject[value] = true;
    this.clearSearchText();
  }

  postFilterUpdate(value) {
    const tabNumber =
      Object.keys(this.statusObject).findIndex((status) => status == value) + 1;
    const updateObject = {
      user_id: this.userDetails.user_id,
      tab_name: tabNumber.toString(),
      type: "ProjectOverview",
    };
    if (this.statusObject[value]) {
      this.usersService.createUserPermissionTabs(updateObject);
      return;
    }
    this.usersService.deleteUserPermissionTabs(updateObject);
  }

  resetTotalSumsCountersOverview() {
    for (const key in this.totalSumsOverview) {
      this.totalSumsOverview[key] = 0;
    }
  }

  resetTotalSumsCountersResults() {
    for (const key in this.totalSumsResults) {
      this.totalSumsResults[key] = 0;
    }
  }

  calculateTotalSums() {
    if (this.selectedTab == 0) {
      this.calculateTotalsOverview();
    } else if (this.selectedTab == 1) {
      this.calculateTotalsResults();
    }
  }

  calculateTotalsOverview() {

    if(this.filteredProjectsData == undefined || !this.filteredProjectsData) {
        return;
    }

    this.resetTotalSumsCountersOverview();
    this.filteredProjectsData.forEach((project) => {
      this.addToTotalForProjectOverview(project);
    });
  }

  calculateTotalsResults() {

    if(this.filteredProjectsData == undefined || !this.filteredProjectsData) {
        return;
    }

    this.resetTotalSumsCountersResults();
    this.filteredProjectsData.forEach((project) => {
      this.addToTotalForProjectResults(project);
    });
  }

  addToTotalForProjectOverview(p) {
    this.totalSumsOverview.totalAccumulated += this.getSum(
      p.project_total_with_deduct,
      p.ata_total_with_deduct
    );
    this.totalSumsOverview.totalNotSend += this.getSum(
      p.project_total_not_send,
      p.ata_total_not_send
    );
    this.totalSumsOverview.totalSent += this.getSum(
      p.project_total_sent,
      p.ata_total_sent
    );
    this.totalSumsOverview.totalApproved += this.getSum(
      p.project_total_approved,
      p.ata_total_approved
    );
    this.totalSumsOverview.totalInvoiced += this.getSum(
      p.project_total_invoiced,
      p.ata_total_invoiced
    );
    if (p.activities.length > 0) {
      p.activities.forEach((activity) => {
        this.addToTotalForProjectOverview(activity);
      });
    }
  }

  addToTotalForProjectResults(p) {

    this.totalSumsResults.totalChargeable += this.getSum(
      p.project_chargeable,
      p.ata_chargeable
    );
    this.totalSumsResults.totalPersonal += this.getSum(
      p.project_user_total_cost,
      p.ata_user_total
    );
    this.totalSumsResults.totalMaterial += this.getSum(
      p.project_material,
      p.ata_material
    );

    this.totalSumsResults.totalFixedMaterial += this.getSum(
      p.project_fixed_material,
      p.ata_fixed_material
    );

    this.totalSumsResults.totalOther += this.getSum(
      p.project_other,
      p.ata_other
    );
    this.totalSumsResults.totalSum += this.getSum(p.project_total, p.ata_total);
    this.totalSumsResults.totalInvoiced += this.getSum(
      p.project_invoiced,
      p.ata_invoiced
    );
    this.totalSumsResults.totalTb += this.getSum(
      p.project_result,
      p.ata_result
    );
    this.totalSumsResults.totalTg =
      (this.totalSumsResults.totalTb / this.totalSumsResults.totalInvoiced) *
      100;
    if (p.activities.length > 0) {
      p.activities.forEach((activity) => {
        this.addToTotalForProjectResults(activity);
      });
    }

    if(!isFinite(this.totalSumsResults.totalTg)) {
      this.totalSumsResults.totalTg = 0;
    }
    const strResult = this.totalSumsResults.totalTg.toFixed(2);
    this.totalSumsResults.totalTg = Number(strResult);

    this.totalSumsResults.totalTg2 = Number(strResult) - Number(p.internal_cost_percentage);
  }

  getSum(a, b) {
    return Number(a ?? 0) + Number(b ?? 0);
  }

  getBackgroundColor(project) {
    let backgroundColor = "";
    const darkerColorCoeff = 13;
    if (project.project_status == 2) {
      backgroundColor = "#DAEACA";
    } else if (project.project_status == 1) {
      backgroundColor = "#F7F3D5";
    } else if (project.project_status == 3) {
      backgroundColor = "#FFFFFF";
    } else if (project.project_status == 4) {
      backgroundColor = "#FAE3CF";
    } else {
      backgroundColor = "#C9C6C6";
    }

    if (project.parent != 0) {
      backgroundColor = this.lightenDarkenColor(
        backgroundColor,
        -darkerColorCoeff
      );
    }
    return backgroundColor;
  }

  lightenDarkenColor(col, amt) {
    var usePound = false;
    if (col[0] == "#") {
      col = col.slice(1);
      usePound = true;
    }

    var num = parseInt(col, 16);

    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    var b = ((num >> 8) & 0x00ff) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    var g = (num & 0x0000ff) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
  }

  setToggle(value) {
    this.toggle = value;
  }

  setToggle2(value) {
    this.toggle2 = value;
  }

  setOpacity() {
    this.display = this.opacity == 0 ? "block" : "none";
    setTimeout(() => {
      this.opacity = this.opacity == 1 ? 0 : 1;
      this.translateY = this.opacity == 1 ? "0px" : "150px";
      this.background = this.opacity == 1 ? "rgb(128 128 128 / 50%)" : "none";
    }, 0);
  }

  getComments() {
    const contentType = "project-overview";
    this.http.getTheComments(this.companyId, contentType).subscribe((res) => {
      if (res["data"].length > 0) {
        this.commentsNumber = res["data"].length;
        this.showCommentsNumber = true;
      }
    });
  }

  get existString() {
    if (((document.getElementById('searchInput') as HTMLInputElement).value).length > 0)
        return true;
    else
        return false;
}
}
