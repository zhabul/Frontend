import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-select-dropdown-reference',
  templateUrl: './select-dropdown-reference.component.html',
  styleUrls: ['./select-dropdown-reference.component.css']
})
export class SelectDropdownReferenceComponent implements OnInit {

  @Input('references') set setReferences(value: any[]) {
    this.references = value;
   // this.selected = this.selectedReference;
  }

  @Input() selectedReference;// = 'Select Reference';
  @Input() disableInput = false;
  @Output() emitedSelectedReference = new EventEmitter<any>();

  public copyProject= [] ;
  public copyProjectExpended = [];
  public filteredClient:any;
  public isSelectedReference:boolean=false;
  
  public references = [];
//  public disableInput: boolean = false;
  public toggle: boolean = false;

  public selected: string =  'Select Reference';//this.selectedReference;

  constructor(private toastr: ToastrService, private translate: TranslateService) { }

  public _filterText:any;

  get filterText(){
    return this._filterText;
  }

  set filterText(value: string){
    this._filterText = value;
    this.filteredClient = this.filterDataByName(value);
  }

  filterDataByName(filterTerm: string){
    if(this.references.length === 0 ||  this.filterText === ''){
      return this.references;
    }else{
      return this.references.filter((client)=>{
        if(client.finalName != null){
          return client.finalName.toLowerCase().includes(filterTerm.toLowerCase());
        }
      })
    }
  }
 
  ngOnInit(): void {
    if(this.selectedReference) {
      this.selected = this.selectedReference;
    }
  }

  selectOurReference(reference, index){
    this.emitSelectedProject(reference);
    this.selected = reference.finalName;
    this.toggleOff();
  }

  emitSelectedProject(reference){
      this.isSelectedReference=true;
      this.emitedSelectedReference.emit(reference);
  }

  toggleProjectExpanded(reference) {
      this.copyProjectExpended.push(reference);
  }

  toggleOn() {
    this.isSelectedReference=false;
    this.filteredClient=this.references;
    if(!this.disableInput) {
      if(this.references.length > 0) {
        this.toggle = !this.toggle;
        return;
      }
      this.toastr.info(this.translate.instant("Please select a project"));
    }
  }

  toggleOff(){/* auto close select */
    this.toggle = false;
    this._filterText='';
    this.filteredClient = this.filterDataByName('');
  }

  setClass() {
    let className = '';
    if(!this.disableInput) {
      if(this.toggle) {
        className = 'select-wrapper-bordered';
      }else {
        className = 'select-wrapper';
      }
    }else {
      className = 'readonly-inputs';
    }
    return className;
  }
}
