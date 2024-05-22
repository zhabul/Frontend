import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from 'src/app/core/services/projects.service';


@Component({
  selector: 'app-ata-modify-header',
  templateUrl: './ata-modify-header.component.html',
  styleUrls: ['./ata-modify-header.component.css']
})
export class AtaModifyHeaderComponent implements OnInit {
  public buttonToggleProject = false;

  public buttonName = "Project Management";
  public currentClass = "title-new-project";
  public showSubProject = false;
  public userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  public selectOpen: boolean = false;
  public projects_for_select: any = [];
  public projects = [];
  public from;
  project_id;
  @Input() project: any;
  @Output() emitValueToggleProject = new EventEmitter<any>();
  @Output() EmitFromValue = new EventEmitter<any>();
  constructor(
      private projectsService: ProjectsService,
      private router: Router,
      private activateroute: ActivatedRoute,
      ) { }

  async ngOnInit() {

    // this.project_id = this.activateroute.snapshot.params.projectId;
    this.activateroute.queryParams
    .subscribe(params => {
      this.project_id = params.projectId
      this.from = params.from || null;
      if (!this.project_id) {
        this.project_id = this.project.id;
      }

    }
  );
    if (this.project.parent == 0) {
    this.projects.push(this.project);
  } else {
    const project = await this.projectsService.getProject(
      this.project.parent
    );
    this.projects.push(project);
   }

    this.projects = JSON.parse(JSON.stringify(this.projects));

        this.projects.map((p) => {
          p["expanded"] = false;
          p["visible"] = true;
          p["l_status"] = 0;
          p["branch"] = 0;
          p["noExpand"] = p["childs"] == 0;
        });

    this.get_project_and_sub_project_name_id_and_custom_name_by_project_id();
  }


    redirectTo(){

        this.activateroute.queryParams
        .subscribe(params => {
            if(params.from  && params.from == 'forecast'){
                this.router.navigate(['/projects/view/',this.project.id],  {queryParams: {from: 'forecast', from_edit: true}})
            } else if(params.type == '0'){
                this.router.navigate(['/projects/view/',this.project.id],  {queryParams: {from: 'external', from_edit: true}})
            } else if(params.type == '1'){
                this.router.navigate(['/projects/view/',this.project.id],  {queryParams: {from: 'internal', from_edit: true}})
            } else if(params.from == 'external'){
                this.router.navigate(['/projects/view/',this.project.id],  {queryParams: {from: 'external', from_edit: true}})
            } else if(params.from == 'internal'){
                this.router.navigate(['/projects/view/',this.project.id],  {queryParams: {from: 'internal', from_edit: true}})
            } else if(params.type == 'external'){
                this.router.navigate(['/projects/view/',this.project.id],  {queryParams: {from: 'external', from_edit: true}})
            } else if(params.type == 'internal'){
                this.router.navigate(['/projects/view/',this.project.id],  {queryParams: {from: 'internal', from_edit: true}})
            }else if(params.type == '2'){
                this.router.navigate(['/projects/view/',this.project.id],  {queryParams: {from: 'forecast', from_edit: true}})
            }else {
                this.router.navigate(['/projects/view/',this.project.id],  {queryParams: {from: 'external', from_edit: true}})
            }
        })
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

  toggleselectOpen(e) {
    this.selectOpen = !this.selectOpen;
    e.stopPropagation();
  }

  closeSelect() {
    this.selectOpen = false;
  }

  buttonNameToggle(event) {
    this.buttonToggleProject = !this.buttonToggleProject;
    this.emitValueToggleProject.emit(this.buttonToggleProject)
  }

  enter() {
    this.currentClass = "title-new-project-hover";
  }

  leave() {
    this.currentClass = "title-new-project";
  }

  selectProject(project_id) {
    this.router.navigate(["projects", "view", project_id]);
  }

}
