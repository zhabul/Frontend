import { Component, forwardRef, Input, OnInit, Output, EventEmitter, DoCheck, HostListener, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ReturnedValue } from './custom-select.interface';

/* interface IUser {
  Id: number | string;
  Name: string;
}; */

/* interface IToggleEmitter extends IUser {
  status: boolean;
}; */

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true
    }
  ]
})

export class CustomSelectComponent implements OnInit, ControlValueAccessor, DoCheck {

  @Input() disableSelect:boolean = false;
  @Input() items: any = [];
  @Input() value: any;
  @Input() disabled: boolean = false;
  @Input() placeholder: string;
  @Input() id: string;
  @Input() formControl: FormControl;
  @Input() hasFirstMinusLine: boolean = true;
  @Input() label: any;
  @Input() hasDefault: boolean = false;
  @Input() defaultValue: any;
  @Input() hasOrangeBorder: boolean = false;
  @Input() set setContactPersonFromOffer(value) {
    if (!value) return;
    this.onSelect(value);
  }
  public fill: any;
  public rotate: any;

  @Output() toggleAttestWorker: EventEmitter<ReturnedValue> = new EventEmitter<ReturnedValue>;
  @Output() toggleEmptyWorker: EventEmitter<string> = new EventEmitter<string>;
  @Output() toggleDeletedFromArray: EventEmitter<string> = new EventEmitter<string>;

  @HostListener('mouseover') onMouseOver() {
    this.isHovered = true;
    this.borderHoverColor = '2px solid var(--orange-dark)';
  }

  @HostListener('mouseout') onMouseOut() {
    this.isHovered = false;
    this.borderHoverColor = '';
  }

  borderHoverColor: string = '';
  isHovered: boolean = false;

  public showItems: boolean = false;
  public isSelectedFont: boolean = false;
  public selectedUser: ReturnedValue = {
    Id: "-1",
    Name: 'Select Contact Person'
  };
  public needBigger: boolean = false;

  constructor(private _elementRef: ElementRef) { }

  ngOnInit(): void {
    if(this.hasDefault && this.defaultValue !== undefined) {
      this.selectedUser = this.defaultValue;
      this.onSelect(this.defaultValue);
      this.setFillColor();
    }else{
      this.isSelectedFont = false;
      this.setFillColor();
    }
  }

  ngDoCheck(): void {
    let hasUserInArray: boolean = false;
    this.items.forEach(element => {
      if(this.selectedUser?.Id === element.Id) {
        hasUserInArray = true;
      }
    });

    if(!hasUserInArray) {
      this.selectedUser = {
        Id: "-1",
        Name: "Select Contact Person"
      };
      this.toggleDeletedFromArray.emit('deleted');
    }

    const hiddenUsers = this.items.filter((element) => {
      return element.hidden === true;
    });

    const actuallyUsersInDropdown = this.items.length - hiddenUsers.length;
    if(actuallyUsersInDropdown > 6) {
      this.needBigger = true;
    } else {
      this.needBigger = false;
    }

  }

  onSelectContactPerson() {
    if(!this.disableSelect){
    this.showItems = !this.showItems;
    this.setFillColor();
    this.setRotate();
    }
  }

  onSelect(value) {
    if(value && value.Id){
      this.isSelectedFont = true;
    }else{
      this.isSelectedFont = false;
    }
    this.onChange(value);
    this.onTouched(value);
    this.value = value;
    this.toggleEmitSelectedUser(false);
    this.selectedUser = value;
    this.toggleEmitSelectedUser(true);
    this.showItems = false;
    this.isHovered = false;
    this.setFillColor();
  }

  setFillColor(){
    if(this.showItems && this.selectedUser.Id !== '-1' && !this.defaultValue){
      this.fill = 'var(--orange-dark)';
    }else if (this.selectedUser.Id === '-1'){
      this.fill = 'var(--border-color)';
    }else{
      this.fill = '#1A1A1A';
    }
  }

  setRotate(){
    if(this.showItems){
      this.rotate = 'rotate(180)';
    }else{
      this.rotate = 'rotate(0)';
    }
  }

  onSelectEmpty() {
    if (this.selectedUser.Id == "-1") {
      this.showItems = false;
      this.value = this.selectedUser;
      this.setFillColor();
      this.toggleEmptyWorker.emit('empty');
    } else {
      let hasUserInArray: boolean = false;
      this.items.forEach(element => {
        if (element.Id === this.selectedUser.Id) {
          hasUserInArray = true;
        }
      });

      if (hasUserInArray) {
        this.items.push(this.selectedUser);
        this.selectedUser = {
          Id: "-1",
          Name: "Select Contact Person"
        };
        this.selectedUser = {
          Id: "-1",
          Name: "Selected Contact Person"
        };
      } else {
        this.selectedUser = {
          Id: "-1",
          Name: "Selected Contact Person"
        };
      }

      this.setFillColor();
      this.toggleEmptyWorker.emit('empty');
      this.value = this.selectedUser;
      this.showItems = false;
    }

    this.hasOrangeBorder = false;
    this.isHovered = false;
    this.isSelectedFont = false;
  }

  toggleEmitSelectedUser(status) {
    if (this.selectedUser?.Id != "-1") {
      this.toggleAttestWorker.emit({ ...this.selectedUser, status: status });
    }
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChange = (value: any) => {
    this.value = value;
  }

  onTouched = (value: any) => {
    this.value = value;
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
      const clickedInside = this._elementRef.nativeElement.contains(targetElement);
      if(!clickedInside) {
        this.showItems = false;
      }
  }

}
