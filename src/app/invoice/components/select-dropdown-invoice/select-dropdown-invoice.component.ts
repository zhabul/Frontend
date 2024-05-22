import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-select-dropdown-invoice',
  templateUrl: './select-dropdown-invoice.component.html',
  styleUrls: ['./select-dropdown-invoice.component.css']
})


export class SelectDropdownInvoiceComponent implements OnInit {

    @Input() disableSelect:boolean = false;
    @Input() projects = []; 
    @Output() emitedSelectedProject = new EventEmitter<any>();

    public allProjects;
    public copyProject= [] ;
    public copyProjectExpended = [];
    public disableInput: boolean = false;
    public toggle: boolean = false;
   
    @Input() selected = {
        CustomName : this.translate.instant('Please select Project')
    }

    constructor(private translate: TranslateService,) {}

    ngOnInit(): void {
      this.allProjects=[...this.projects];
    }

  @HostListener('document:click', ['$event'])
  OndocumentClick(event: MouseEvent){
    this._filterText='';
  }

  _filterText: string = '';
  get filterText(){
    return this._filterText;
  }

  set filterText(value: string){
     this.projects=[...this.allProjects];
     this._filterText = value;
     this.projects = this.filterDataByName(value); 
  }

  filterDataByName(filterTerm: string){
    if(this.projects.length === 0 ||  this.filterText === ''){
       return this.projects;
    }else{
      return this.projects.filter((project)=>{
        if(project.name != null||project.fullname!= null){
          return this.filterName(project, filterTerm);
        }
      })
    }
  }

  filterName(project, filterTerm) {
    if(project.name!==undefined)
    return project.name.toLowerCase().includes(filterTerm.toLowerCase());
    if(project.fullname!==undefined) 
    return project.fullname.toLowerCase().includes(filterTerm.toLowerCase());
  }

  isChecked(project, i){
        project.checked = !project.checked;
        if(project.checked){
            this.copyProject.push(project);
            if(this.copyProject.length > 1){
                this.copyProject[0].checked = false;
                project.checked = !project.checked;
                this.copyProject.shift()
                this.copyProject[0].checked = true;
            }
            this.emitSelectedProject(this.copyProject[0])
            this.selected.CustomName = project.name;
        }else{
            this.emitSelectedProject([])
            this.selected.CustomName = this.translate.instant('Please select Project');
        }
    }

    emitSelectedProject(project){
        this.emitedSelectedProject.emit(project)
        this.toggle = false;
    }

    addLastToLastChild(project, projectList, index) {
        if (project.level == 1) {
        project.parent_last = true;
        }

        if (project?.activities?.length > 0) {
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
      this.copyProjectExpended.push(project)
    }

    toggleOn() {
      this.projects=[...this.allProjects];
      this.copyProjectExpended.forEach(exp =>{
        if(exp.expanded){
            exp.expanded = false;
        }
      })
      if(!this.disableSelect){
      this.toggle = !this.toggle;
      }
    }


    toggleOff(){/* auto close select */
      this.toggle = false;
    }
}
