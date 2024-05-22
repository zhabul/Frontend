import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, OnDestroy, ViewChild } from '@angular/core';
import { WeeklyReportInfoService } from 'src/app/projects/components/weekly-report-modify/weekly-report-info.service';

@Component({
  selector: 'app-dropdown-for-du',
  templateUrl: './dropdown-for-du.component.html',
  styleUrls: ['./dropdown-for-du.component.css']
})
export class DropdownForDuComponent implements OnInit, OnDestroy {

  public ref;
  public PRINT;
  public SEND;
  public localSelectedItem: any;
  public toggle: boolean = false;
  public border = '2px solid #858585';
  public color = 'var(--orange-dark)';
  public color1: any;
  public color2: any;

  public fill = 'var(--orange-dark)';
  public fill1: any;
  public fill2= 'var(--project-color)';
  public fill3= 'var(--project-color)';
  public spinnerSub;
  public rotate: any;
  public spinner:boolean = false;
  public active:any = 'parent';
  public activeTabSub;

  @Output() selected = new EventEmitter();
  @Output() PrintButton = new EventEmitter();
  @Output() SendButton = new EventEmitter();
  @Input() placeholder: string;
  @Input() Print: string;
  @Input() Send: string;
  @Input() HaveSend: boolean;
  @Input() type: string;
  @Input() active_weekly_report: any;
  @Input() active_children_weekly_report: any;
  @Input() selected_weekly_report;
  @Input() selected_children_weekly_report;
  @Input() active_tab;
  @Input('SendPrintUT1') set selectedItem(value) {
    if(value.length > 0){
      if(this.type == 'parent') {
        this.localSelectedItem = value;
      }else {
        this.localSelectedItem = Object.values(value[this.active_weekly_report].childrens);
      }
    }else{
      this.localSelectedItem = [];
    }
  };

  @ViewChild('dropdown') dropdownRef : ElementRef;
  @HostListener('document:click' , ['$event'])
  ondocumentClick(event: MouseEvent){
    if(!this.dropdownRef.nativeElement.contains(event.target)){
      this.toggle = false;
      this.border = '2px solid #858585';
      this.color = 'var(--orange-dark)';
      this.fill = 'var(--orange-dark)';
      this.rotate = 'rotate(0)';
    }
  }
  constructor(private weeklyReportInfoService: WeeklyReportInfoService,) { }

  ngOnInit(): void {

    this.PRINT = this.Print;
    this.SEND = this.Send;
    this.getSpinner();
    this.getActiveTab();
  }

    ngOnDestroy() {
        this.unSubSpinner();
    }

    unSubSpinner() {
        if (this.spinnerSub) {
            this.spinnerSub.unsubscribe();
        }
    }

  toogleMultiselect(){
    
    if(this.localSelectedItem.length < 2) {
      return;
    }

    this.toggle = !this.toggle
    this.setBorderColor();
    this.setColorTitle();
    this.setFillColor();
    this.setRotate();
    this.selectedUsers = [];
  }

  setBorderColor(){
    if(this.toggle){
      this.border = '2px solid var(--orange-dark)';
    }else{
      this.border = '1px solid var(--orange-dark)';
      this.border="2px solid rgb(133, 133, 133)";
    }
  }

  mouseOver()
  {
    if(this.toggle===false)
    {
    this.border=' 1px solid var(--orange-dark)';
    }
  }
  mouseleave()
  {
    if(this.toggle===false)
    {
    this.border = '2px solid #858585';
    }
  }

  setColorTitle(){
    if(this.toggle){
      this.color = 'var(--orange-dark)';
    }else{
      this.color = 'var(--orange-dark)';
    }
  }

  setFillColor(){
    if(this.toggle){
      this.fill = 'var(--orange-dark)';
    }else{
      this.fill = 'var(--orange-dark)';
    }
  }

  setRotate(){
    if(this.toggle){
      this.rotate = 'rotate(180)';
    }else{
      this.rotate = 'rotate(0)';
    }
  }

  setActiveWeeklyReport(item) {
    this.weeklyReportInfoService.setSpinner(true);
    this.selected.emit(item);
  }

  setActiveTab() {

    let index = -1;
    if(this.type == 'parent') {
        index = this.localSelectedItem.findIndex(
            (article) => { return article.nameFromWr == this.selected_weekly_report}
        ); 
    }else {
        index = this.localSelectedItem.findIndex(
            (article) => { return article.nameFromWr == this.selected_children_weekly_report}
        );      
    }

    this.weeklyReportInfoService.setSpinner(true);
    this.selected.emit(this.localSelectedItem[index]);
  }

  selectedUsers: string[] = [];

  getSelectedItem(user){

    user.checked = !user.checked;
    if(user.checked==true)
    {
      this.fill2='var(--orange-dark)';

    }
    this.ref=user.name;
    this.toggle=false;
    if(this.toggle){

    }else{
      this.localSelectedItem.forEach(item => {
        item.checked = false;
      });
    }

    if (!this.selectedUsers.includes(user)) {
      this.selectedUsers.push(user);
    } else {
      this.selectedUsers.splice(this.selectedUsers.indexOf(user), 1);
    }
    this.selected.emit(this.selectedUsers);
  }

    UpdateContactPeople(){
        for (let i = 0; i < this.localSelectedItem.length; i++) {
            if (this.localSelectedItem[i].checked === true) {
                this.selectedUsers.push(this.localSelectedItem[i]);
            }
        }
    }

    ngOnChanges() {
        this.UpdateContactPeople();
    }


  /**Postavke Hover-a Dropdown liste ako su true min 1 checkbox promjeni boju u naranđastu, ali ako su svi true/false ostavi default sivu boju */
    counter3: number = 0;
    setColorDropDownSelect(item) {

        this.counter3 = 0

        for(let i = 0; i < this.localSelectedItem.length ; i++){
            if(this.localSelectedItem[i].checked == true){
                this.counter3 ++;
            }
        }

        if(this.counter3 > 0 ){
            if(item.checked == true){
                this.color2 = 'var(--orange-dark)';
                this.fill2 = 'var(--project-color)';
                return 'var(--orange-dark)';
            }else if(item.checked == false){
                this.color2 = 'var(--orange-dark)';
                this.fill2 = 'var(--project-color)';
            }
        }else if(this.counter3 == 0){
            this.color2 = 'var(--border-color)';
            this.fill2 = 'var(--project-color)';
        }
    }
  /** */

    PrintData(){
        this.PrintButton.emit();
    }

    SendData(){
        this.SendButton.emit(this.selectedUsers);
        this.selectedUsers = [];
        this.UpdateContactPeople();
    }

    onMouseEnter(){
        this.fill2 = 'var(--orange-dark)!important';
        this.color1 = 'var(--orange-dark)!important';
    }

    onMouseOut(){
        this.fill2 = 'var(--project-color)!important';
        this.color1 = 'var(--border-color)!important';
    }

    getSpinner() {
        this.spinnerSub = this.weeklyReportInfoService.getSpinner().subscribe((res)=>{
            this.spinner = res;
        });
    }

    getActiveTab() {
        this.activeTabSub = this.weeklyReportInfoService.getActiveTab().subscribe((res)=>{
            if(res) {
                this.active = res;
            }
        });      
    }
}
