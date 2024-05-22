import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-user-type-select',
  templateUrl: './user-type-select.component.html',
  styleUrls: ['./user-type-select.component.css', '../user-select.component.css']
})
export class UserTypeSelectComponent implements OnInit {

  @Output('emitActiveType') emitActiveType:EventEmitter<any[]> = new EventEmitter();
  public userTypes = [
    {
      Name: this.translate.instant("Own Personal"),
      value: 'Own Personal',
      id: "1"
    },
    {
      Name: this.translate.instant("Subcontractor"),
      value: 'Subcontractor',
      id: "3"
    },
    {
      Name: this.translate.instant("Hired"),
      value: 'Hired',
      id: "2"
    },
    {
      Name: this.translate.instant("Others"),
      value: 'Others',
      id: "4"
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
    // if (this.selectedTypes[0]) {
    //   const userType = this.findUserTypeById(this.selectedTypes[0].id);
    //   this.selectedTypes[0].Name = userType.value;
    // }
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
