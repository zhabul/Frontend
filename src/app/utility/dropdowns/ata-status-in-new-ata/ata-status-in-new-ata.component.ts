import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-ata-status-in-new-ata',
  templateUrl: './ata-status-in-new-ata.component.html',
  styleUrls: ['./ata-status-in-new-ata.component.css']
})
export class AtaStatusInNewAtaComponent implements OnInit {

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
  //end

  public fill = 'var(--project-color)';
  public fill1: any;
  public fill2: any;
  public rotate: any;
  public selectedOption: any;
  public decline;
  public accept;


  @Input() disableSelect:boolean = false;
  @Input() AtaStatus: string;

  @Input('ATAStatus') set selectedItem(value) {
    if(value.length >0){
      this.localSelectedItem = value;
    }else{
      this.localSelectedItem = [];
    }
  };

  @Output() Selected: EventEmitter<string> = new EventEmitter();
  @Output('Decline') Decline = new EventEmitter();
  @Output('Accepted') Accepted = new EventEmitter();


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

      this.color4 = 'var(--border-color)';
      this.color5 = 'var(--border-color)';

    }
  }

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    this.ref = this.AtaStatus;
    this.decline = this.translate.instant('Decline');
    this.accept = this.translate.instant('Accept');
  }

  toogleMultiselect(){
    if(!this.disableSelect){
    this.toggle = !this.toggle
    this.setBorderColor();
    this.setColorTitle();
    this.setFillColor();
    this.setRotate();
    }
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

  onMouseEnter(){
    this.fill1 = 'var(--orange-dark)';
    this.color1 = 'var(--orange-dark)';
  }

  onMouseOut(){
    this.fill1 = 'var(--main-bg)';
    this.color1 = 'var(--border-color)';
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
    if (!this.isChecked2) {
      this.isChecked2= true;
      this.Accepted.emit();
      this.color4 = 'var(--orange-dark)';
      this.color5 = 'var(--border-color)';

      }
    // if(this.isChecked2){
    //   this.color4 = 'var(--border-color)';
    // }
    // else{
    //   this.Accepted.emit();
    //   this.color4 = 'var(--orange-dark)';
    //   this.color5 = 'var(--border-color)';
    // }
  }

  manuallyDecline(){

    if (!this.isChecked1) {
      this.isChecked1 = true;
      this.Accepted.emit();
      this.color5 = 'var(--orange-dark)';
      this.color4 = 'var(--border-color)';

      }

    // if(this.isChecked1){
    //   this.color5 = 'var(--border-color)';

    // }else{
    //   this.Decline.emit();
    //   this.color5 = 'var(--orange-dark)';
    //   this.color4 = 'var(--border-color)';
    // }
  }

  isChecked1;
  isChecked2;
  selectedCheckbox = null;

  onCheckboxChange(checkboxNumber: number){
    if(this.selectedCheckbox !== null && this.selectedCheckbox !== checkboxNumber){
      this['isChecked' + this.selectedCheckbox] = false;
    }
    this.selectedCheckbox = checkboxNumber;
    this.color2 = 'var(--orange-dark)';
  }

  changeColor(event: MouseEvent) {
    const element = event.currentTarget as HTMLElement;
    element.style.color = "var(--orange-dark)";
  }
  changeColorLeave(event: MouseEvent) {
    const element = event.currentTarget as HTMLElement;
    element.style.color = "var(--border-color)";
    }

}
