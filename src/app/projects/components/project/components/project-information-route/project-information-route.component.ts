import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { ClientsService } from "src/app/core/services/clients.service";
import { ProjectsService } from "src/app/core/services/projects.service";
@Component({
  selector: "app-project-information",
  templateUrl: "./project-information-route.component.html",
  styleUrls: ["./project-information-route.component.css"],
})
export class ProjectInformationRouteComponent implements OnInit {
  @Input("canRemove") set setCanRemove(value: boolean) {
    this.canRemove = value;
  }
  canRemove = true;
  @Output() removeAttachmentAndDocument = new EventEmitter<any>();

  public directories: any[] = [];
  public projects: any;
  public project: any;
  private projectId: number;
  public showClientComponent = false;
  public client: any;
  public componentVisibility: number = 0;
  public showNotification: boolean;
  public currentAddRoute: string;
  public previousRoute: string;
  clientCategories: any;
  public attachments;
  public userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  public selectOpen: boolean = false;
  public selectStartedValue: any;
  public projects_for_select: any = [];
  public buttonToggle = true;
  public currentClass = "title-new-project";
  public buttonName = "Project Management";
  public subsClass = "sub-project-button";
  public folder;
  public selectedTab = Number(sessionStorage.getItem("selectedTab")) || 0;

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private router: Router,
    private clientsService: ClientsService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = params.id;
    });
    this.route.queryParamMap.subscribe(params => {
        this.folder = params.get('folder') || null;
    });
    this.projects = this.route.snapshot.data["projects"];
    this.project = this.route.snapshot.data["project"];
    this.clientCategories =
      this.route.snapshot.data["clientCategories"]["data"] || [];

    this.clientsService.client.subscribe((response) => {
      if (response) {
        this.showClientComponent = true;
        this.client = response;
      }
    });

    this.clientsService.showNewClientForm.subscribe((val) => {
      this.componentVisibility = val;
    });

    this.selectStartedValue = this.project.CustomName + " " + this.project.name;
    this.get_project_and_sub_project_name_id_and_custom_name_by_project_id();

    if(!this.folder) {
        const currentUrlEnd = this.router.routerState.snapshot.url.split("/").slice(-1)[0];
        switch(currentUrlEnd) {
          case 'project-information':
            this.selectedTab = 0;
            break;
          case 'agreement':
            this.selectedTab = 1;
            break;
          case 'security':
            this.selectedTab = 2;
            break;
          case 'information':
            this.selectedTab = 3;
            break;
          default:
            this.selectedTab = 0;
        }
    }
  }

  goBack() {
    this.router.navigate(["projects/view", this.projectId]);
  }


  public onCloseClick() {
    this.clientsService.setComponentVisibility(0);
  }

  handleRemoveFile(deletedFiles) {
    this.attachments = this.attachments.filter((item: any) => {
      let found = true;
      for (let i = 0; i < deletedFiles.length; i++) {
        const del_item = deletedFiles[i];
        if (del_item.Id == item.Id) {
          found = false;
          break;
        }
      }
      return found;
    });
  }

  private get_project_and_sub_project_name_id_and_custom_name_by_project_id() {
    let project_id =
      this.project.parent > 0 ? this.project.parent : this.project.id;

    this.projectsService
      .get_project_and_sub_project_name_id_and_custom_name_by_project_id(
        project_id
      )
      .then((res) => {
        if (res["status"]) this.projects_for_select = res["data"];
      });
  }

  buttonNameToggle() {
    this.buttonToggle = !this.buttonToggle;
  }

  enter() {
    this.currentClass = "title-new-project-hover";
  }

  leave() {
    this.currentClass = "title-new-project";
  }


  enterSub() {
    this.subsClass = "sub-project-button-hover";
  }

  leaveSub() {
    this.subsClass = "sub-project-button";
  }

  setSelectedTab (tab) {
    /* this.selectedTab = tab; */
    this.buttonToggle = false;
    sessionStorage.setItem("selectedTab", tab.toString());

    this.router.events.subscribe((element) => {
      if (element instanceof NavigationEnd) {
        this.selectedTab = tab;
      }
    });
  }


}
