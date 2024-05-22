import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ElementRef } from "@angular/core";
import { DropdownValues } from "./interfaces/dropdown-values";

@Component({
  selector: "app-dropdown",
  templateUrl: "./dropdown.component.html",
  styleUrls: ["./dropdown.component.css"],
  host: {
    "(document:click)": "onClick($event)",
  },
})
export class DropdownComponent implements OnInit {
  dropdownToggle = false;

  dropdown = {
    selectedOption: "",
    labelText: "",
    options: [""],
  };

  @Input() disableSelect:boolean = false;
  @Input() dropdownValues: DropdownValues;
  @Output() selectedOption = new EventEmitter<string>();

  constructor(private elRef: ElementRef) {}

  ngOnInit(): void {
    this.dropdown = this.dropdownValues ? this.dropdownValues : this.dropdown;
  }

  openCloseDropdown() {
    if(!this.disableSelect){
    this.dropdownToggle = !this.dropdownToggle;
  }
}

  selectOption(option: string) {
    this.selectedOption.emit(option);
    this.dropdown.selectedOption = option;
    this.dropdownToggle = false;
  }

  onClick(event) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.dropdownToggle = false;
    }
  }
}
