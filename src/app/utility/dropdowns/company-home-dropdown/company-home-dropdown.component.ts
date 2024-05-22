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
  selector: "app-company-home-dropdown",
  templateUrl: "./company-home-dropdown.component.html",
  styleUrls: ["./company-home-dropdown.component.css"],
})

export class CompanyHomeDropdownComponent implements OnInit {
  public ref;
  public localSelectedItem: any;
  public toggle: boolean = false;
  public border = "1px solid var(--active-color)";
  public color = "#EBEBEB";
  public color2: any;
  selectedCheckbox = null;
  public fill = "#EBEBEB";
  public rotate: any;
  @Input() CompanyName: string;
  @Input() SlectedID;
  @Input("CompanyName") set selectedItem(value) {
    if (value.length > 0) {
      this.localSelectedItem = value;
    } else {
      this.localSelectedItem = [];
    }
  }

  @Output() Selected: EventEmitter<string> = new EventEmitter();
  @ViewChild("dropdown") dropdownRef: ElementRef;
  @HostListener("document:click", ["$event"])
  ondocumentClick(event: MouseEvent) {
    if (!this.dropdownRef.nativeElement.contains(event.target)) {
      this.toggle = false;
      this.border = "1px solid var(--active-color)";
      this.color = "#EBEBEB";
      this.fill = "#EBEBEB";
      this.rotate = "rotate(0)";
    }
  }
  constructor() {}

  ngOnInit(): void {
    this.writeValue(this.SlectedID);
  }

  writeValue(value: any): void {
      const index = this.localSelectedItem.findIndex(obj => obj.id == value);
      if(index > -1){
        this.localSelectedItem[index].checked = true;
        this.ref = this.localSelectedItem[index].name;
      }

  }

  toogleMultiselect() {
    if(this.localSelectedItem.length == 1) {
      return;
    }
    this.toggle = !this.toggle;
    this.setBorderColor();
    this.setColorTitle();
    this.setFillColor();
    this.setRotate();
  }

  setBorderColor() {
    if (this.toggle) {
      this.border = "2px solid var(--orange-dark)";
    } else {
      this.border = "1px solid var(--active-color)";
    }
  }

  setColorTitle() {
    if (this.toggle) {
      this.color = "var(--orange-dark)";
    } else {
      this.color = "#EBEBEB";
    }
  }

  setFillColor() {
    if (this.toggle) {
      this.fill = "var(--orange-dark)";
    } else {
      this.fill = "#EBEBEB";
    }
  }

  setRotate() {
    if (this.toggle) {
      this.rotate = "rotate(180)";
    } else {
      this.rotate = "rotate(0)";
    }
  }

  getSelectedItem(status) {
    for (let i = 0; i < this.localSelectedItem.length; i++) {
      if (this.localSelectedItem[i] === status) {
        this.localSelectedItem[i].checked = !this.localSelectedItem[i].checked; // Toggle the checked status
        if (this.localSelectedItem[i].checked) {
          this.ref = this.localSelectedItem[i].name;
        } else {
          this.ref = ""; // Clear the reference if item is unchecked
        }
      } else {
        this.localSelectedItem[i].checked = false;
      }
    }
    this.Selected.emit(status);
    //kako bira samo jedan nakon klika na div radi zatvaranje dropdowna
    this.toggle = false;
  }

  mouseOver() {
    if (this.toggle === false) {
      this.fill = "var(--orange-dark)";
      this.color = "var(--orange-dark)";
      this.border = " 1px solid var(--orange-dark)";
    }
  }

  mouseleave() {
    if (this.toggle === false) {
      this.fill = "#EBEBEB";
      this.color = "#EBEBEB";
      this.border = " 1px solid var(--active-color)";
    }
  }

  changeColor(event: MouseEvent) {
    const element = event.currentTarget as HTMLElement;
    element.style.color = "var(--orange-dark)";
  }

  changeColorLeave(event: MouseEvent) {
    const element = event.currentTarget as HTMLElement;
    element.style.color = "#000000";
  }
}
