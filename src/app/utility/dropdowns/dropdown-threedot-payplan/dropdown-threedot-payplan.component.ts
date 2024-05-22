import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-dropdown-threedot-payplan',
  templateUrl: './dropdown-threedot-payplan.component.html',
  styleUrls: ['./dropdown-threedot-payplan.component.css']
})
export class DropdownThreedotPayplanComponent implements OnInit {

  public ref;
  public localSelectedItem: any;
  public toggle: boolean = false;
  public border = '1px solid var(--project-color)';
  public color = 'var(--project-color)';
  public color1: any;
  public color2: any;

  //Boje za Dropdown item
  public color4: any;
  public color5: any;
  public color6: any;
  //end

  public fill = 'var(--project-color)';
  public fill1: any;
  public fill2: any;
  public rotate: any;
  public selectedOption: any;

  public decline;
  public cancel;
  public accept;
  public HoverText;

  @Input() AtaStatus: string;
  @Input() Disabled: string;
  @Input() SelectedAta: string;

  @Input() DeclineCondition:string;
  @Input() CancelCondition:string;
  @Input() AcceptCondition:string;
  @Input() Option:string;

  @Input() DisabledWhenLock:string;
  @Input() EnableWhenUnlock:string;

  @Input('DeviationStatus') set selectedItem(value) {
    if(value.length >0){
      this.localSelectedItem = value;
    }else{
      this.localSelectedItem = [];
    }
  };

  @Output() Selected: EventEmitter<string> = new EventEmitter();
  @Output('Decline') Decline = new EventEmitter();
  @Output('Accepted') Accepted = new EventEmitter();
  @Output('Cancel') Cancel = new EventEmitter();


  @ViewChild('dropdown') dropdownRef : ElementRef;
  @HostListener('document:click' , ['$event'])
  ondocumentClick(event: MouseEvent){
    if(!this.dropdownRef.nativeElement.contains(event.target)){
      this.toggle = false;
      this.border = '1px solid var(--project-color)';
      this.color = 'var(--project-color)';
      this.fill = 'var(--project-color)';
      this.rotate = 'rotate(0)';
      this.isChecked1 = false;
      this.isChecked2 = false;
      this.isChecked3 = false;
      this.color4 = '#212529';
      this.color5 = '#212529';
      this.color6 = '#212529';

    }
  }

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    //this.ref = this.AtaStatus;
    this.decline = this.translate.instant('TSC_NOT_ACCEPTED');
    this.cancel = this.translate.instant('TSC_CANCEL_FLOW');
    this.accept = this.translate.instant('TSC_ACCEPT_MANUALLY');
    this.HoverText = this.translate.instant('You have to lock paymantplan');
  }

  showMessage(): void {
    this.HoverText = true;
  }

  hideMessage(){
    this.HoverText = false;
  }

  toogleMultiselect(){
    this.toggle = !this.toggle
    this.setBorderColor();
    this.setColorTitle();
    this.setFillColor();
    this.setRotate();

  }

  setBorderColor(){
    if(this.toggle){
      this.border = '2px solid var(--orange-dark)';
    }else{
      this.border = '1px solid var(--project-color)';
    }
  }

  setColorTitle(){
    if(this.toggle){
      this.color = 'var(--orange-dark)';
    }else{
      this.color = 'var(--project-color)';
    }
  }

  setFillColor(){
    if(this.toggle){
      this.fill = 'var(--orange-dark)';
    }else{
      this.fill = 'var(--project-color)';
    }
  }

  setRotate(){
    if(this.toggle){
      this.rotate = 'rotate(180)';
    }else{
      this.rotate = 'rotate(0)';
    }
  }

  getSelectedItem(status){
    status.checked = !status.checked;
    this.Selected.emit(status);
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
      if(item.checked){
        return 'var(--orange-dark)';
      }
      this.color2 = 'var(--orange-dark)';
      this.fill2 = 'var(--orange-dark)';
      return 'var(--border-color)';
    }
    this.color2 = 'var(--border-color)';
    this.fill2 = 'var(--main-bg)';
  }
  /** */

  manuallyAccept(){
    // if(this.isChecked3){

    // }
    // else{
    //   this.Accepted.emit(true);
    //   this.color4 = 'var(--orange-dark)';
    //   this.color5 = 'var(--border-color)';
    //   this.color6 = 'var(--border-color)';
    //   this.color7 = 'var(--border-color)';
    //   this.color8 = 'var(--border-color)';
    //   this.color9 = 'var(--border-color)';
    // }

    if (!this.isChecked3) {
      this.isChecked3 = true;
      this.Accepted.emit(true);
      this.color = 'var(--orange-dark)';
      this.color6 = 'var(--orange-dark)';
      this.color4 = '#212529';
      this.color5 = '#212529';

      }
  }

  manuallyDecline(){

    if (!this.isChecked1) {
      this.isChecked1 = true;
      this.Decline.emit(true);
      this.color = 'var(--orange-dark)';
      this.color5 = 'var(--orange-dark)';
      this.color4 = '#212529';
      this.color6 = '#212529';

      }
  }

  changeColor(event: MouseEvent) {
    const element = event.currentTarget as HTMLElement;
    element.style.color = "var(--orange-dark)";
  }
  changeColorLeave(event: MouseEvent) {
    const element = event.currentTarget as HTMLElement;
    element.style.color = "#212529";
    }

  createCancel(){
    if (!this.isChecked2) {
      this.isChecked2 = true;
      this.Cancel.emit(true);
      this.color = 'var(--orange-dark)';
      this.color4 = 'var(--orange-dark)';
      this.color5 = '#212529';
      this.color6 = '#212529';

      }
  }

  isChecked1;
  isChecked2;
  isChecked3;
  selectedCheckbox = null;

  onCheckboxChange(checkboxNumber: number){
    if(this.selectedCheckbox !== null && this.selectedCheckbox !== checkboxNumber){
      this['isChecked' + this.selectedCheckbox] = false;
    }
    this.selectedCheckbox = checkboxNumber;
    this.color2 = 'var(--orange-dark)';
  }

  showHidden = false;

  showHiddenStatus() {
    if (this.DisabledWhenLock) {
      this.showHidden = true;
    }
  }

  hideHiddenDiv() {
    this.showHidden = false;
  }

}
