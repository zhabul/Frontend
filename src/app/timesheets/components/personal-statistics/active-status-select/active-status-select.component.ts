import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-active-status-select',
  templateUrl: './active-status-select.component.html',
  styleUrls: ['./active-status-select.component.css']
})
export class ActiveStatusSelectComponent implements OnInit {

  @Output('emitActiveType') emitActiveType:EventEmitter<any[]> = new EventEmitter();
  public userTypes = [
    {
      Name: this.translate.instant("Active"),
      value: 'Active',
      id: "1"
    },    
    { 
      Name: this.translate.instant("Inactive"),
      value: 'Inactive',
      id: "2"
    }
  ];
  public selectedName = '';
  public selectedTypes: any[] = [];
  public dropdownSettings = {};

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    this.setDropdownSettings();
    this.selectType();
  }

  setDropdownSettings() {
    this.dropdownSettings = {
      singleSelection: true,
      idField: "id",
      textField: "Name",
      itemsShowLimit: 0,
      allowSearchFilter: false,
      noDataAvailablePlaceholderText:
        this.translate.instant("No data available"),
      searchPlaceholderText: this.translate.instant("Search"),
    };
  }

  findUserTypeById(id) {
    return this.userTypes.find((type)=>{
      return type.id === id;
    })
  }

  onItemSelect(selectedTypes) {
    this.selectedTypes = selectedTypes;
    if (this.selectedTypes[0]) {
      const userType = this.findUserTypeById(this.selectedTypes[0].id);
      this.selectedTypes[0].Name = userType.value;
    }
    this.emitActiveType.emit(this.selectedTypes);
    this.selectType();
  }

  selectType() {
    if (this.selectedTypes.length === 1) {
      this.selectedName = this.selectedTypes[0].Name;
    } else {
      this.selectedName = '';
    }
  }

}
