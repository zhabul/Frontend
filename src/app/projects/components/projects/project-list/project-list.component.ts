import {
  Component,
  OnInit,
  Input,
  SimpleChange,
  OnChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import {  Router } from "@angular/router";
import { ProjectsService } from "src/app/core/services/projects.service";

@Component({
  selector: "app-project-list",
  templateUrl: "./project-list.component.html",
  styleUrls: ["./project-list.component.css"],
})
export class ProjectListComponent implements OnInit, OnChanges {
  public originProjectList = [];
  public userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  someProjectIsExpanded = false;
  public page;
  public numberOfRowsArray = [];
  public selectedTab = 0;

  @Input("origin") origin = "";
  @Input() set projects(value: any[]) {
    this.projectlist = value;
  }
  @Input() showPagination = false;
  @Input("top_menu_status") set containerHeight(status) {
    if (status == true && this.origin === "project") {
      this.container_height = "calc(96vh - 500px - 0px)";
    } else if (status == false && this.origin === "project") {
      this.container_height = "calc(100vh - 157px - 0px)";
    }
  }
  public project_id:any;
  @Input("project_id") set projectid(id){
    this.project_id = id;
  };
  @Output() emitSelectChanged = new EventEmitter<any>();
  public container_height = "calc(100vh - 131px - 0px)";
  projectlist = [];

  constructor(
    private projectService: ProjectsService,
    private router: Router,
    // private activateroute: ActivatedRoute
  ) {}

  ngOnInit() {
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    // this.originProjectList = JSON.parse(JSON.stringify(this.projectlist));
    // this.numberOfRowsArray = new Array(
    //   Math.ceil(this.originProjectList.length / 20)
    // );
    // this.projectlist = JSON.parse(JSON.stringify(this.originProjectList));

    // this.showPagination = this.originProjectList.length > 20;
  }

  onProjectClick(id, e) {

    if(!this.userDetails.show_project_Information) {
      return;
    }

    if (e.target.dataset.id !== "showHideSubProjects") {
      this.projectService.setCurrentTab(0);
      this.project_id = id;
        this.emitSelectChanged.emit(this.project_id);
      sessionStorage.setItem("currentTab", "0");
      this.router.navigate(["projects", "view", id]);
    }
  }

  addLastToLastChild(project, projectList, index) {
    if (project.level == 1) {
      project.parent_last = true;
    }

    if (project.activities.length > 0) {
      if (projectList[index + 1] === undefined && project.parent_last) {
        project.activities[project.activities.length - 1].parent_last =
          project.last;
      }
      if (!project.parent_level) {
        project.activities[project.activities.length - 1].parent_level =
          project.level;
      } else {
        project.activities[project.activities.length - 1].parent_level =
          project.parent_level;
      }
    }

    return true;
  }

  toggleProjectExpanded(project) {
    project.expanded = !project.expanded;
  }

  get nextPage() {
    return this.page + 1;
  }

  get previousPage() {
    return this.page - 1;
  }

  loopThroughActivities(project, status) {
    project.activities.forEach((activity) => {
      activity.hover = status;

      if (activity.activities.length > 0) {
        this.loopThroughActivities(activity, status);
      }
    });
  }

  setBorderLeftColor(project) {
    const hover = project.hover;
    const level_zero_status = project.level_zero_status;

    return level_zero_status == 1
      ? hover
        ? "#F8F2B7"
        : "#F7F3D1"
      : level_zero_status == 2
      ? hover
        ? "#E8FDD3"
        : "#F3FCEA"
      : level_zero_status == 4
      ? hover
        ? "#F8D4B4"
        : "#FCE3CD"
      : hover
      ? "#F7F5F0"
      : "#FFFFFF";
  }

  hoverProjectsWhitLeftBorders(project, i) {
    this.loopThroughActivities(project, true);
  }

  hoverProjectsWhitLeftBordersOut(project, i) {
    this.loopThroughActivities(project, false);
  }
}
