import { AfterViewChecked, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ReturnedValue } from '../custom-simple-select.interface';



/**
 *    -"items"                  -> lista objekata koje ce biti opcije
 *    -"label"                  -> vrijednost koja ce biti ispisana u opcijama (najcesce je name)
 *    -"placeholder"            -> pocetna vrijednost (npr. "Select Contact People") / ne treba ako
 *                                 ima default
 *    -"toggleSelectedOption"   -> prosljedjuje parent komponenti vrijednost za FormControlName
 *    -"hasDefaultValue"        -> Po defaultu je "false", ali ukoliko ima staviti na "true"
 *    -"defaultValue"           -> Objekat koje je default
 *    -"hasFirstMinusLine"      -> Ukoliko je potrebna opcija koja nema vrijednost
 *
 *    Dodati u custom-simple-select.interface.ts keys koje sadrzi vas objekat
 *
 *    [!!] U parent komponenti .ts file-u napraviti funkciju "toggleAttestWorkerHidden(option)" koja
 *         ce dobiti objekat odabrane opcije.
 */



@Component({
  selector: 'app-custom-simple-select',
  templateUrl: './custom-simple-select.component.html',
  styleUrls: ['./custom-simple-select.component.css']
})
export class CustomSimpleSelectComponent implements OnInit, AfterViewChecked {

  public showItems: boolean = false;
  public value: any;
  public takePlaceholder: string = "";
  public needBigger: boolean = false;

  @Input() disableSelect:boolean = false;
  @Input('makeBorderOrange') makeBorderOrange: boolean = false;
  @Input('isSelectedFont') isSelectedFont: boolean = false;
  @Input('items') items: any[] = [];
  @Input('label') label: any;
  @Input('hasSecondLabel') hasSecondLabel: boolean = false;
  @Input('secondLabel') secondLabel: string = "";
  @Input('placeholder') placeholder: string;
  @Input('hasDefaultValue') hasDefaultValue: boolean = false;
  @Input('defaultValue') defaultValue: any;
  @Input('hasFirstMinusLine') hasFirstMinusLine: boolean = true;
  @Input('hasSmallerContainer') hasSmallerContainer: boolean = false;
  @Input() isMyAccount = false;
  @Input() isForm = false;

  @Output('toggleSelectedOption') toggleSelectedOption: EventEmitter<ReturnedValue> = new EventEmitter<ReturnedValue>;

  constructor(private _elementRef: ElementRef) { }

  ngOnInit(): void {

    this.takePlaceholder = this.placeholder;

    if(this.hasDefaultValue) {
      this.value = this.defaultValue;
      this.placeholder = this.value[this.label];
    }

  }

  ngAfterViewChecked(): void {
    if(this.items) {
      if(this.items.length > 6) {
        this.needBigger = true;
      }
    }
  }

  onShowItems() {
    if(!this.isMyAccount && !this.disableSelect){
      this.showItems = !this.showItems;
    }
  }


  onSelect(item) {
    this.value = item;
    this.defaultValue = this.value;
    if(this.hasSecondLabel) {
      this.placeholder = this.value[this.label] + " " + this.value[this.secondLabel];
    } else {
      this.placeholder = this.value[this.label];
    }
    this.toggleSelectedOption.emit(this.value);
    this.showItems = false;
    this.makeBorderOrange = true;
    this.isSelectedFont = true;
  }


  onSelectEmpty() {
    this.value = "";
    this.placeholder = this.takePlaceholder;
    this.toggleSelectedOption.emit(this.value);
    this.showItems = false;
    this.makeBorderOrange = false;
    this.isSelectedFont = false;
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
      const clickedInside = this._elementRef.nativeElement.contains(targetElement);
      if(!clickedInside) {
        this.showItems = false;
      }
  }


}
