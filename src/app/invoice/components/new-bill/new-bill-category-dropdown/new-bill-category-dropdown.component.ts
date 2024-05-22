import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-new-bill-category-dropdown',
  templateUrl: './new-bill-category-dropdown.component.html',
  styleUrls: ['./new-bill-category-dropdown.component.css']
})
export class NewBillCategoryDropdownComponent implements OnInit {
  public copyProject= [] ;
  public copyProjectExpended = [];
  public items: string[] = ['Invoice', 'Credit invoice'];

  public toggle: boolean = false;


  @Output() emitSelectedCategory = new EventEmitter<any>();
  @Input() alreadySelected: string = '';
  @Input() disableInput = false;
  @Input('project') set setSelected(value: any[]) {
    if(this.alreadySelected != '') {
      this.selected = this.alreadySelected;
      return;
    }
    this.selected = "Choose category";
  }


  public selected = "Choose category";

  constructor() { }

  ngOnInit(): void {
    this.selectOurCategory('Invoice', 0);
  }

  selectOurCategory(category, index){
    this.emitSelectedCategories(category);
    this.selected = category;
    this.toggleOff();
  }

  emitSelectedCategories(category){
    this.emitSelectedCategory.emit(category);
  }

  toggleProjectExpanded(category) {
    this.copyProjectExpended.push(category);
  }

  toggleOn() {
    if(!this.disableInput) {
      this.toggle = !this.toggle;
    }
  }

  toggleOff(){/* auto close select */
    this.toggle = false;
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
