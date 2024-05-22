import { Component, ElementRef, EventEmitter,  forwardRef,  HostListener,  Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Client } from "src/app/core/models/client.model";

const CUSTOM_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectDropdownWithPlusComponent),
  multi: true
};

@Component({
  selector: 'app-select-dropdown-with-plus',
  templateUrl: './select-dropdown-with-plus.component.html',
  styleUrls: ['./select-dropdown-with-plus.component.css'],
  providers: [
    CUSTOM_VALUE_ACCESSOR
  ]
})
export class SelectDropdownWithPlusComponent implements OnInit {

  @Output() selected: EventEmitter<object> = new EventEmitter();
  @Output() DeliveryContact: EventEmitter<object> = new EventEmitter();
  @Output() Status: EventEmitter<string> = new EventEmitter();
  @Output() Construction: EventEmitter<string> = new EventEmitter();
  @Output() Debit: EventEmitter<string> = new EventEmitter();
  @Output() CFFANContact: EventEmitter<string> = new EventEmitter();
  @Output() toggleEmptyWorker: EventEmitter<string> = new EventEmitter();
  @Output() CounterActive1: EventEmitter<number> = new EventEmitter();
  @Output() SubProject: EventEmitter<object> = new EventEmitter();
  @Output() FakturaRef: EventEmitter<object> = new EventEmitter();
  @Output() project_relation: EventEmitter<object> = new EventEmitter();


  @Input() disableSelect:boolean = false;
  @Input() width: number;
  @Input() fontSize: number;
  @Input() type1: string;
  @Input() StatusActive: boolean;
  @Input() allPlaceholder: boolean = false;
  @Input() ConstructionDebitItem: boolean;
  @Input() AtaType: boolean;
  @Input("errorText") errorText: string;
  @Input() defaultValue: any;
  @Input() EnableSearch: boolean;
  @Input() parentForm: FormGroup;
  @Input() placeholder: any;
  @Input() disabled: boolean;

  public localClientItem:any;
  public ref;
  public border = '1px solid var(--border-color)';
  public border1 = '';
  public border2 = '';
  public border4 = '0px';
  public radius = '4px 4px 0px 0px';
  public padding = '4px 5px 0px 10px';
  public fill: any;
  public rotate: any;
  public color: any;
  public activeClientId = 0;
  public activeClientName: any;
  public type: string;

  public toggle: boolean = false;
  public havedata: boolean = true;

  showError= false;
  createForm: FormGroup;
  selectedValue: number;
  borderHoverColor: string = '';
  isHovered: boolean = false;

  /**Filter Data */
  clients: Client[];
  filteredClient: Client[];
  _filterText: string = '';

  @ViewChild('dropdown') dropdownRef : ElementRef;
  @HostListener('document: click' , ['$event'])
  OndocumentClick(event: MouseEvent){

    if(!this.dropdownRef.nativeElement.contains(event.target)){
      this.changeDropdownColor();
    }
  }

  @HostListener('mouseover') onMouseOver() {
    this.isHovered = true;
    this.borderHoverColor = '2px solid var(--orange-dark)';
  }

  @HostListener('mouseout') onMouseOut() {
    this.isHovered = false;
    this.borderHoverColor = '';
  }

  changeDropdownColor(){
    if(this.activeClientId == 0){
      this.toggle = false;
      this.fill = '#1A1A1A';
      this.rotate = 'rotate(0)';
      this.border = '1px solid var(--border-color)';
      this.color = '#1A1A1A';
      this.show = false;
      this.border1 = '1px solid var(--border-color)';
      this.border2 = '';
    }else{
      this.toggle = false;
      this.fill = 'var(--orange-dark)';
      this.rotate = 'rotate(0)';
      this.border = '2px solid var(--orange-dark)';
      this.color = 'var(--orange-dark)';
      this.show = false;
      this.border1 = '2px solid var(--orange-dark)';
      this.border2 = '';
    }
    //this.ref != this.placeholder;
  }

  get filterText(){
    return this._filterText;
  }

  set filterText(value: string){
    this._filterText = value;
    this.filteredClient = this.filterDataByName(value);
  }

  filterDataByName(filterTerm: string){
    if(this.clients.length === 0 ||  this.filterText === ''){
      return this.clients;
    }else{
      return this.clients.filter((client)=>{
        if(client.finalName != null){
          return client.finalName.toLowerCase().includes(filterTerm.toLowerCase());
        }
      })

      /*.clients.forEach((client) => {
      });*/
    }
  }


  /** End Filter Data*/

  @Input('ClientItem') set ClientItem(value) {
      if(value?.length > 0){
        this.clients = value;
        this.filteredClient = this.clients;
        this.border4 = '0px';
      }else{
        this.clients = [];
        this.filteredClient = [];
        this.ref = this.placeholder;
      }
  };

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
      this.changeDropdownColor();
      this.padding = '5px 5px 0px 10px';
      // this.color = '#1A1A1A';
      // this.fill = '#1A1A1A';
      // this.ref = this.placeholder;
      if (this.type1 === "construction" || this.type1 === "debit" || this.type1 === "AtAType") {
        this.ref = Object.values(this.defaultValue)[1];
      }else if (this.type1 === "status") {
        // dropdown for choose offer
        if(this.allPlaceholder){
          this.ref = this.defaultValue == "" || this.defaultValue == null ? this.placeholder : this.defaultValue
        }
        // dropdown for choose status
        else {
          this.ref = Object.values(this.placeholder)[1];

        }
      }else if (this.type1 === "subproject" || this.type1 === "delivery" || this.type1 === "client" || this.type1 === "invoiceref") {
        this.ref = this.placeholder;
      }
  }

  ngOnChanges() {
    this.writeValue(this.selectedValue);
  }

  onToggleMenu(){
    if(!this.disableSelect){
    this.toggle = !this.toggle;
    this.setFillColor();
    this.setRotate();
    this.setBorderColor();
    this.setColorTitle();
    this.showSearch();
    this.setBorderColor1();
    this.noData();
    }
  }

  noData(){
    if(this.toggle){
      if(this.clients.length === 0){
        this.fill = 'red';
        this.color = 'red';
        this.ref = this.translate.instant('No data available');
        this.border1 = '0px';
        this.border = '2px solid red';
        this.border4 = '2px solid red';
        this.radius = '4px 4px 4px 4px';
        this.havedata = false;
      }
    }else{
      this.border4 = '0px';
      /*if(this.type1 == "constructor" || this.type1 == "debit"){
        this.ref = Object.values(this.defaultValue)[1];
      }else{
        this.ref = this.placeholder
      }*/
    }
  }

  setFillColor(){
    if(this.toggle){
      this.fill = 'var(--orange-dark)';
    }else{
      this.fill = '#1A1A1A';
    }
  }

  setRotate(){
    if(this.toggle){
      this.rotate = 'rotate(180)';
    }else{
      this.rotate = 'rotate(0)';
    }
  }

  setBorderColor(){
    if(this.toggle){
      this.border = '2px solid var(--orange-dark)';
    }else{
      this.border = '1px solid var(--border-color)';
    }
  }

  setBorderColor1(){
    if(this.toggle){
      this.border1 = '2px solid var(--orange-dark)';
      this.border2 = '1px solid var(--border-color)';
    }else{
      this.border1 = '1px solid var(--border-color)';
      this.border2 = '';
    }
  }

  setColorTitle(){
    if(this.toggle){
      this.color = 'var(--orange-dark)';
    }else{
      this.color = '#1A1A1A';
    }
  }

  /** Search Field*/
  @ViewChild('search') searchElement: ElementRef;
  show: boolean = false;

  showSearch(){

    if(this.toggle){
      this.show = true;
      this.color = 'var(--orange-dark)';

    }else{
      this.color = '#1A1A1A';
      this.show = false;
    }

    setTimeout(()=>{ // this will make the execution after the above boolean has changed
      if(this.searchElement == undefined){

      }else{
        this.searchElement.nativeElement.focus();
      }

    },0);
  }
  /** End Search Field*/

  getSelected(client: any, index){

    if(this.type1 == "delivery"){
      this.GetItemForDelivery(client, index);
    }else if(this.type1 == "client"){
      this.ClientFun(client, index);
    }else if(this.type1 == "status"){
     this.GetStatus(client);
    }else if(this.type1 == "construction"){
      this.GetConstruction(client, index);
    }else if(this.type1 == "debit"){
      this.DebitForm(client);
    }else if(this.type1 == "contact"){
      this.ContactCFFAN(client);
    }else if(this.type1 == "subproject"){
      this.GetItemForSubProject(client, index);
    }else if(this.type1 =="invoiceref"){
      this.GetFakturaRefer(client, index);
    }else if(this.type1 =="project_relation"){
        this.GetProjectRelation(client, index);
      }
  }

  /**Funkcija za Client Dropdown */
  ClientFun(client: any, index){
    this.ref = client.finalName;
    this.toggle = false;
    this.show = false;
    this.activeClientId = client.Id;

    const selected = {
      Id: client.Id,
      name: client.Company ? client.Company : client.finalName,
      impName: null,
      ataType: null,
      index: index.toString(),
    };

    this.selected.emit(selected);

  }

  GetFakturaRefer(client, index){
    this.ref = client.finalName;
    this.toggle = false;
    this.show = false;
    this.activeClientId = client.Id;

    const selected = {
      Id: client.Id,
      name: client.finalName,
      impName: null,
      ataType: null,
      index: index.toString(),
    };

    this.FakturaRef.emit(selected);
  }

  /**Funkcija za Delivery Contact Dropdown*/
  GetItemForDelivery(deliveryC: any, index){
    this.toggle = false;
    this.show = false;
    const selected = {
      value: deliveryC.id,
      name: deliveryC.finalName,
      impName: null,
      ataType: null,
      index: index.toString(),
    };

    this.activeClientId = deliveryC.Id;
    this.ref = deliveryC.finalName;
    this.DeliveryContact.emit(selected);

  }

  GetProjectRelation(projectRelation: any, index) {
    this.ref = projectRelation.CustomName;
    this.project_relation.emit(projectRelation);
  }

  /**Funkcija za Project Status */
  GetStatus(status: any){
    this.toggle = false;
    this.show = false;
    this.activeClientId = status.id;
    this.ref = status.status;
    this.Status.emit(status);
  }

  /**Funkcija za Construction formt */
  GetConstruction(construction: any, index){
    this.toggle = false;
    this.show = false;
    this.activeClientId = construction.id;
    this.ref = construction.Name;
    this.Construction.emit(construction);
  }

  /**Funkcija za Debit Form */
  DebitForm(debit: any){
    this.toggle = false;
    this.show = false;
    this.activeClientId = debit.Id;
    this.ref = debit.Name;
    this.Debit.emit(debit);
  }

  /**Funkcija za CERTIFICATE FLOW FOR ATA AND NOTIFICATION */
  ContactCFFAN(contact: any){
    this.toggle = false;
    this.show = false;
    this.toggleEmptyWorker.emit('empty');
    this.activeClientId = contact.id;
    this.ref = contact.Name;

    this.CFFANContact.emit({ ...contact, status: true });
  }

  /**Funkcija za SubProject Dropdown */
  GetItemForSubProject(client: any, index){
    this.ref = client.finalName;
    this.toggle = false;
    this.show = false;
    this.activeClientId = client.id;

    const selected = {
      Id: client.id,
      name: client.finalName,
      number: client.number,
      impName: null,
      ataType: null,
      index: index.toString(),
    };

    this.SubProject.emit(selected);
  }

  trackByFn(index, client){
    return client.Id;
  }

  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.selectedValue = value;
    if(this.type1 == "delivery" ){
      const foundObj = this.clients.find(obj => obj.id === value);
      if(foundObj){
        this.ref = foundObj.finalName;
      }
    }else if(this.type1 === "invoiceref"){
      const foundObj = this.clients.find(obj => obj.Id === value);
      if(foundObj){
        this.ref = foundObj.finalName;
      }
    } else if(this.type1 === "client"){
      const foundObj = this.clients.find(obj => obj.Id === value);
      if(foundObj){
        this.ref = foundObj.Name;
      }
    } else if(this.type1 === "status" && this.allPlaceholder){

        // this.ref = value == "" ? this.placeholder : value;

      // console.log(this.ref)
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

}
