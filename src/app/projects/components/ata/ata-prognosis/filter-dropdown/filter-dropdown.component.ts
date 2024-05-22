import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from "@angular/core";



@Component({
  selector: "app-filter-dropdown",
  templateUrl: "./filter-dropdown.component.html",
  styleUrls: ["./filter-dropdown.component.css"],
})
export class FilterDropdownComponent implements OnInit {
  @Input("placeholder") placeholder: string = "";
  @Input("listOfItems") listOfItems = [];

  @Output("allSelected") allSelected = new EventEmitter<boolean>();
  @Output("itemSelected") itemSelected = new EventEmitter<any>();

  isOpen: boolean = false;
  allChecked: boolean = true;

  ngOnInit(): void {
    this.allChecked = this.checkIfAllChecked();
  }

  constructor(
    private eRef: ElementRef
  ) {}

  @HostListener("document:click", ["$event"])
  clickout(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  onAllSelected() {
    this.allChecked = !this.allChecked;
    if (this.allChecked) this.makeAllChecked();
    else this.makeAllUnchecked();
    this.allSelected.emit(this.allChecked);
  }

  onSelectItem(item) {
    item.checked = !item.checked;
    this.allChecked = this.checkIfAllChecked();
    this.itemSelected.emit(item);
  }

  checkIfAllChecked() {
    for (let item of this.listOfItems) {
      if (!item.checked) return false;
    }
    return true;
  }

  makeAllChecked() {
    for (let item of this.listOfItems) {
      item.checked = true;
    }
  }

  makeAllUnchecked() {
    for (let item of this.listOfItems) {
      item.checked = false;
    }
  }
}
