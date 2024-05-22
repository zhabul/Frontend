import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";

@Component({
  selector: "app-competence-simple-dropdown",
  templateUrl: "./competence-simple-dropdown.component.html",
  styleUrls: ["./competence-simple-dropdown.component.css"],
})
export class CompetenceSimpleDropdownComponent implements OnInit {
  @ViewChild("userInput") userInput: ElementRef;

  @Input() loopThrough: string = "roles";
  @Input() disable: boolean = false;

  @Output() selectedItem = new EventEmitter();

  isOpen: boolean = false;
  copyOfAllItems: any[] = [];
  unchangeableCopyOfAllItems: any[] = [];

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.initArray();
  }

  initArray() {
    this.copyOfAllItems = this.listOfItems.map((item) => {
      return { ...item };
    });
    this.unchangeableCopyOfAllItems = this.copyOfAllItems;
  }

  @HostListener("document:mousedown", ["$event"])
  onGlobalClick(event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      // clicked outside => close dropdown list
      this.isOpen = false;
    }
  }

  onOpenDropdown() {
    if (this.disable) return;
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      setTimeout(() => {
        this.userInput.nativeElement.focus();
      }, 1);
    }
  }

  // posto se samo moze jedan selektovati
  onItemCheck(item) {
    for (let value of this.copyOfAllItems) {
      if (value.checked && JSON.stringify(value) !== JSON.stringify(item)) {
        value.checked = false;
        break;
      }
    }
    item.checked = !item.checked;
    if (item.checked) this.selectedItem.emit(item);
  }

  filterList(e) {
    const value = e.target.value.toLowerCase();
    this.copyOfAllItems = this.unchangeableCopyOfAllItems;
    this.copyOfAllItems = this.copyOfAllItems.filter((item) => {
      return item[this.loopThrough].toLowerCase().includes(value);
    });
  }


  // Izbrisati ovo kad budu pravi podaci
  // i staviti @Input() listOfItems
  listOfItems = [
    {
      id: "58",
      roles: "Project manager",
      color: "rgba(254,55,251,0.51)",
      active: "1",
      reduction: null,
      number: null,
      sortingScheme: null,
      price: null,
    },
    {
      id: "59",
      roles: "Purchaser",
      color: "#000",
      active: "1",
      reduction: null,
      number: null,
      sortingScheme: null,
      price: null,
    },
    {
      id: "60",
      roles: "Arbetsledare",
      color: "rgba(48,80,250,0.56)",
      active: "1",
      reduction: null,
      number: null,
      sortingScheme: null,
      price: null,
    },
    {
      id: "61",
      roles: "Montör",
      color: "rgba(0,220,41,0.45)",
      active: "1",
      reduction: null,
      number: null,
      sortingScheme: null,
      price: null,
    },
    {
      id: "62",
      roles: "Kalkyl",
      color: "rgba(255,6,219,0.41)",
      active: "1",
      reduction: null,
      number: null,
      sortingScheme: null,
      price: null,
    },
    {
      id: "63",
      roles: "Övriga arbetstagare 1",
      color: "rgba(147,251,58,0.63)",
      active: "1",
      reduction: null,
      number: null,
      sortingScheme: null,
      price: null,
    },
    {
      id: "64",
      roles: "Övriga arbetstagare 2",
      color: "rgba(202,200,7,0.72)",
      active: "1",
      reduction: null,
      number: null,
      sortingScheme: null,
      price: null,
    },
    {
      id: "65",
      roles: "Övriga arbetstagare 3",
      color: "rgba(255,202,62,0.48)",
      active: "1",
      reduction: null,
      number: null,
      sortingScheme: null,
      price: null,
    },
    {
      id: "66",
      roles: "Produktionsledare",
      color: "rgba(33,16,248,0.6)",
      active: "1",
      reduction: null,
      number: null,
      sortingScheme: null,
      price: null,
    },
    {
      id: "67",
      roles: "Ledande montör",
      color: "rgba(53,242,250,0.46)",
      active: "1",
      reduction: null,
      number: null,
      sortingScheme: null,
      price: null,
    },
    {
      id: "68",
      roles: "Montör +",
      color: "rgba(0,144,82,0.53)",
      active: "1",
      reduction: null,
      number: null,
      sortingScheme: null,
      price: null,
    },
    {
      id: "69",
      roles: "User",
      color: "#000",
      active: "1",
      reduction: null,
      number: null,
      sortingScheme: null,
      price: null,
    },
    {
      id: "70",
      roles: "Administrator",
      color: "rgba(237,28,228,0.51)",
      active: "1",
      reduction: null,
      number: null,
      sortingScheme: null,
      price: null,
    },
    {
      id: "78",
      roles: "KOMMANDE",
      color: "#ff8b00",
      active: "1",
      reduction: null,
      number: null,
      sortingScheme: null,
      price: null,
    },
  ];
}
