import { Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Client } from "src/app/core/models/client.model";

const CUSTOM_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SimpleSelectInTableComponent),
  multi: true
};

@Component({
  selector: 'app-simple-select-in-table',
  templateUrl: './simple-select-in-table.component.html',
  styleUrls: ['./simple-select-in-table.component.css'],
  providers:[CUSTOM_VALUE_ACCESSOR]
})
export class SimpleSelectInTableComponent implements OnInit {

  @Output() PayTypeChange = new EventEmitter<number>();
  @Output() emitSelectChanged = new EventEmitter();
  @Output() HoursParent = new EventEmitter();
  @Output() MinutesParent = new EventEmitter();
  @Output() ActivityPayPlan = new EventEmitter();
  @Output() Account = new EventEmitter();

  @Input() width: number;
  @Input() fontSize: number;
  @Input() type1: string;
  @Input() data: string;

  @Input() defaultValue: any;
  @Input() EnableSearch: boolean;

  @Input() AccountActive: boolean;
  @Input() Hours: boolean;
  @Input() Minutes: boolean;
  @Input() AttestActive:boolean;
  @Input() PayPlanActivity:boolean;
  @Input() userData: any;
  @Input() selectedPaymentPlan: number;

  @Input() ClassObj: any;

  public localClientItem:any;
  public ref;
  public border = '0px solid var(--border-color)';
  public border1 = '';
  public border2 = '';
  public border4 = '0px';
  //public radius = '4px 4px 0px 0px';
  public padding = '4px 5px 0px 10px';
  public fill: any;
  public rotate: any;
  public color: any;
  public activeClientId = 0;
  public activeClientName: any;
  public type: string;

  toggle: boolean = false;
  havedata: boolean = true;
  showborder = false;

  showError= false;

  /**Filter Data */
  clients: Client[];
  filteredClient: Client[];
  _filterText: string = '';


  @ViewChild('dropdown') dropdownRef : ElementRef;
  @HostListener('document: click' , ['$event'])
  OndocumentClick(event: MouseEvent){

    if(!this.dropdownRef.nativeElement.contains(event.target)){
      if(this.activeClientId == 0){
        this.toggle = false;
        this.fill = 'var(--table-text)'; //var(--border-color)
        this.rotate = 'rotate(0)';
        this.border = '0px solid var(--border-color)';
        this.color = 'var(--table-text)'; //var(--border-color)
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
      }

  };

  @Input() placeholder: any;

  createForm: FormGroup;

  constructor(private translate: TranslateService) {}



  ngOnInit(): void {

    this.padding = '6px 5px 0px 10px';
    this.ref = this.placeholder;
    if(this.type1 == "AtAType" || this.type1 == "PayType" || this.type1 == "DevType"){
      this.ref = Object.values(this.defaultValue)[1];
    }

    if(this.data && this.data.length > 0) {
      this.writeValue(this.data);
    } 

    //Ako želimo populate dropdown sa podacima iz servisa
    /*this.clientService.getClients().subscribe((response) => {
      this.clients = response["data"].map((client) => {
        if(client['Name']=== null){
          client['Name'] = '';
        }
        client["finalName"] = client["Name"];
        return client;
      });
      this.filteredClient = this.clients;
    });*/

  }


  onToggleMenu(){
    this.toggle = !this.toggle;
    this.setFillColor();
    this.setRotate();
    this.setBorderColor();
    this.setColorTitle();
    this.showSearch();
    this.setBorderColor1();
    this.noData();
  }

  noData(){
    if(this.toggle){
      if(this.clients.length === 0){
        this.fill = 'red';
        this.color = 'red';
        this.ref = this.translate.instant('No data');
        this.border1 = '0px';
        this.border2 = '0px'; //dodan za skloniti sivi border top
        this.border = '2px solid red';
        this.border4 = '2px solid red';
       // this.radius = '4px 4px 4px 4px';
        this.havedata = false;
        this.showborder = false;
      }
    }else{
      this.border4 = '0px';
      // this.ref = "";
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
      this.fill = 'var(--table-text)'; //var(--border-color)
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
      this.border = '0px solid var(--border-color)';
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
      this.showborder = true;
    }else{
      this.color = 'var(--table-text)'; // var(--border-color)
    }
  }

  /** Search Field*/
  @ViewChild('search') searchElement: ElementRef;
  show: boolean = false;

  showSearch(){

    if(this.toggle){
      this.show = !this.show;
      this.color = 'var(--orange-dark)';

    }else{
      this.color = 'var(--table-text)'; //var(--border-color)
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

  @Input() disabled: boolean;
  selectedValue: number;

  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: any): void {

    this.selectedValue = value;

    switch (this.type1) {
      case "Account":
      case "Unit":
      case "hours":
      case "minutes":
      case "ActivityPayPlan":
      this.ref = value;
      break;
      default:
      // u slučaju nepoznate vrijednosti type1
      break;
      }
    // if(this.type1 == "Account"){
    //   this.ref = value;
    // }

    // if(this.type1 == "Unit"){
    //   this.ref = value;
    // }

    // if(this.type1 === "hours"){
    //   this.ref = value;
    // }

    // if(this.type1 === "minutes"){
    //   this.ref = value;
    // }
    // if(this.type1 ===  "ActivityPayPlan"){
    //   this.ref = value;
    // }
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

  onChangeSelect(value: any) {

    if(this.type1 == "Unit"){
      this.ref = value;
      this.onChange(value);
      this.onTouched();
    }else if(this.type1 == "Account"){
      this.ref = value.Number + ' ' + value.Description;
      this.onChange(value.Number);
      this.Account.emit(value.Number);
     }else if(this.type1 == "hours"){
      this.ref = value.hours;
      this.onChange(value.hours);
      this.HoursParent.emit(value.hours);
     }else if(this.type1 == "minutes"){
      this.ref = value.minutes;
      this.onChange(value.minutes);
      this.MinutesParent.emit(value.minutes);
     }else if(this.type1 == "ActivityPayPlan"){
      this.ref = value.CustomName + ' ' + value.name;
      this.onChange(value.CustomName);
      const selectedActivity = value.CustomName + ' ' + value.name;
      this.userData[this.selectedPaymentPlan].Activity = selectedActivity;
      this.ActivityPayPlan.emit(selectedActivity);
     }

  }

}
