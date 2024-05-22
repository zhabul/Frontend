import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ElementRef } from "@angular/core";
import { SelectedDropdown } from "./interfaces/selected-dropdown";
import { Option } from "./interfaces/option";
@Component({
  selector: "app-select-dropdown",
  templateUrl: "./select-dropdown.component.html",
  styleUrls: ["./select-dropdown.component.css"],
  host: {
    "(document:click)": "onClick($event)",
  },
})
export class SelectDropdownComponent implements OnInit {
  dropdownToggled = false;

  @Input() disableSelect:boolean = false;
  @Input() dropdownValues: SelectedDropdown;
  @Output() selectedOption = new EventEmitter<Option>();

  dropdown = {
    labelText: "Labeltext",
    selectedOptions: [],
    options: [],
  };

  constructor(private elRef: ElementRef) {}

  ngOnInit(): void {
    this.dropdown = this.dropdownValues ? this.dropdownValues : this.dropdown;
  }

  toggleDropdown() {
    if(!this.disableSelect){
    this.dropdownToggled = !this.dropdownToggled;
  }
}

  filter(event) {}

  selectOption(option) {
    option.selected = !option.selected;
    this.selectedOption.emit(option);
    const optionIndex = this.dropdown.selectedOptions.findIndex(
      (selectedOption) => selectedOption.id == option.id
    );

    if (optionIndex == -1) {
      this.dropdown.selectedOptions.push(option); //ako nije do sada selektovan
    } else {
      this.dropdown.selectedOptions.splice(optionIndex, 1); //ako već postoji u selektu
    }
  }

  onClick(event) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.dropdownToggled = false;
    }
  }

    get numberOfSelectedMoments() {
        let moments = this.dropdown.options.filter((res) => {
            return res.selected == true && res.parent != 0
        });
        return moments.length;
    }
}
