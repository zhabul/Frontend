import { Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnInit, Output,ViewChild } from '@angular/core';
import { FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Client } from "src/app/core/models/client.model";

const CUSTOM_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SimpleSelectComponent),
  multi: true
};

@Component({
  selector: 'app-simple-select',
  templateUrl: './simple-select.component.html',
  styleUrls: ['./simple-select.component.css'],
  providers:[CUSTOM_VALUE_ACCESSOR]
})
export class SimpleSelectComponent implements OnInit {

  @Output() PayTypeChange = new EventEmitter<number>();
  @Output() Attest = new EventEmitter<object>();
  @Output() ProjectAttest = new EventEmitter<object>();
  @Output() MomentAttest = new EventEmitter<object>();
  @Output() HoursAttest = new EventEmitter<object>();
  @Output() MinutesAttest = new EventEmitter<object>();
  @Output() SelctedData = new EventEmitter<object>();

  @Input() disableSelect:boolean = false;
  @Input() width: number;
  @Input() fontSize: number;
  @Input() type1: string;
  @Input("errorText") errorText: string;

  @Input() defaultValue: any;
  @Input() EnableSearch: boolean;
  @Input() AttestActive:boolean;
  @Input() AttestMoment:boolean;
  @Input() AttestHours:boolean;
  @Input() AttestMillage:boolean;
  @Input() ataStatus:any;
  @Input("control") control: any;
  @Input("myform") myform: any;
  @Input() placeholder: string;
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
  public status:any;

  public toggle: boolean = false;
  public havedata: boolean = true;

  showError= false;
  createForm: FormGroup;
  show: boolean = false;
  selectedValue: number;

  /**Filter Data */
  clients: Client[];
  filteredClient: Client[];
  _filterText: string = '';

  @ViewChild('dropdown') dropdownRef : ElementRef;
  @ViewChild('search') searchElement: ElementRef;

  @HostListener('document: click' , ['$event'])
  OndocumentClick(event: MouseEvent){
    if(!this.dropdownRef.nativeElement.contains(event.target)){
      this.changeDropdownColor();
      }
  }

  changeDropdownColor(){
    if(this.activeClientId == 0){
      this.toggle = false;
      this.fill = '#495057';
      this.rotate = 'rotate(0)';
      this.border = '1px solid var(--border-color)';
      this.color = '#495057';
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
    if(value[0]!=undefined){
    if(value[0].finalName=='Users')   {
      value.forEach(user=>{
           let word = user.finalName.split(' ');
           word[0] = word[0].charAt(0).toUpperCase() + word[0].substring(1);
        if(word[1]){
            word[1] = word[1].charAt(0).toUpperCase() + word[1].substring(1);
            user.finalName = word[0]+ ' ' + word[1];
        }
         else user.finalName = word[0]; })
      }
    }
      if(value?.length > 0){
        this.clients = value;
        this.filteredClient = this.clients;
        this.border4 = '0px';
      }else{
        this.clients = [];
        this.filteredClient = [];
      }
  };

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
      this.padding = '4px 5px 0px 10px';
      this.ref = this.placeholder;
      this.setColorTitle();
      if(this.type1 == "AtAType" || this.type1 == "PayType" || this.type1 == "DevType" ){
        this.ref = Object.values(this.defaultValue)[1];
      }
  }

  onToggleMenu(){
    if((this.ataStatus==undefined||this.ataStatus=='0') && !this.disableSelect){
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
      this.fill = '#495057';
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
      this.color = '#495057';
    }
  }

  /** Search Field*/
  showSearch(){

    if(this.toggle){
      this.show = true;
      this.color = 'var(--orange-dark)';

    }else{
      this.color = 'var(--border-color)';
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

  ngOnChanges() {
    this.writeValue(this.selectedValue);
  }

  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.selectedValue = value;

    if(this.type1 == "AtAType" || this.type1 == "DevType"){
      const foundObj = this.clients.find(obj => obj.id === value);
      if(foundObj){
        this.ref = foundObj.Name;
      }
    }else if(this.type1 == "PayType"){
      const foundObj = this.clients.find(obj => obj.Id === value);
      if(foundObj){
        this.ref = foundObj.Name;
      }
    }else if(this.type1 == "AttestAll"){
      const foundObj = this.clients.find(obj => obj.id === value);
      if(foundObj){
        this.ref = foundObj.finalName;
      }
    }else if(this.type1 == "ata invoice_editor"){
      const foundObj = this.clients.find(obj => obj.ProjectID === value);
      if(foundObj){
        this.ref = foundObj.finalName;
      }
    }else if(this.type1 == "ata-users-reg"){
      const foundObj = this.clients.find(obj => obj.ataId === value);
      if(foundObj){
        this.ref = foundObj.finalName;
      }
    }else if(this.type1 == " AttestMoment"){
      const foundObj = this.clients.find(obj => obj.Id === value);
      if(foundObj){
        this.ref = foundObj.Description;
      }
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

  onChangeSelect(value: any, index: string, event: any) {
    this.ref = value.Name;
     if(this.type1 == "PayType"){
       this.onChange(value.Id);
       this.SelctedData.emit(value.Id);
     }else if(this.type1 == "AtAType" || this.type1 == "DevType"){
       this.onChange(value.id);
       this.SelctedData.emit(value.id);
     }else if(this.type1 == "Unit"){
       this.ref = value;
       this.SelctedData.emit(value);
     }else if(this.type1 == "AttestAll"){

       const selected = {
         value: value.id,
         name: value.finalName,
         impName: null,
         ataType: null,
         index: index.toString(),
       };
       this.ref = value.finalName;
       this.onChange(value.id);
       this.Attest.emit(selected);
     }else if(this.type1 == "ata invoice_editor"){

       const selected = {
         value: value.ProjectID,
         name: value.finalName,
         impName: null,
         ataType: null,
         index: index.toString(),
       };
       this.ref = value.finalName;
       this.onChange(value.ProjectID);
       this.ProjectAttest.emit(selected);
     }else if(this.type1 == "ata-users-reg"){

       const selected = {
         value: value.ataId,
         name: value.finalName,
         impName: null,
         ataType: null,
         index: index.toString(),
       };
       this.ref = value.finalName;
       this.onChange(value.ataId);
       this.ProjectAttest.emit(selected);
     }else if(this.type1 == "AttestMoment"){

       const selected = {
         value: value.Id,
         name: value.Description,
         data_moment_id: value.Id,
         default_moment_id: value.default_moment_id,
         dataset_type: value.type,
         index: index.toString(),
       };
       this.ref = value.Description;
       this.onChange(value.Id);
       this.MomentAttest.emit(selected);

     }else if(this.type1 == "AttestHours"){

       const selected = {
         value: value.id,
         name: value.value,
         index: index.toString(),
       };
       this.ref = value.value;
       this.onChange(value.value);
       this.HoursAttest.emit(selected);

     }else if(this.type1 == "MinutesAtt"){

       const selected = {
         value: value.id,
         name: value.value,
         index: index.toString(),
       };
       this.ref = value.value;
       this.onChange(value.value);
       this.MinutesAttest.emit(selected);

     }else if(this.type1 == "AttestMilla"){

       const selected = {
         value: value.id,
         name: value.type,
         index: index.toString(),
       };
       this.ref = value.type;
       this.onChange(value.id);
       this.MinutesAttest.emit(selected);
     }
     this.PayTypeChange.emit(value.Id)
     this.onTouched();
     this.onToggleMenu();
     this._filterText='';
     this.filteredClient = this.filterDataByName('');

  }
  displayError() {
    const control = this.control;
    let submitted = false;
    let errorStatus = false;

    if (this.myform) {
      submitted = this.myform.submitted;
    }

    if (this.type !== "ata-users-reg") {
      errorStatus =
        (submitted && control.invalid) || (control.dirty && control.invalid);
    }

    return errorStatus;
  }

}
