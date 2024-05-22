import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ElementRef,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Observable, Subscription } from "rxjs";

@Component({
  selector: "app-dropdown-for-select-all",
  templateUrl: "./dropdown-for-select-all.component.html",
  styleUrls: ["./dropdown-for-select-all.component.css"],
  host: {
    "(document:click)": "onClick($event)",
  },
})
export class DropdownForSelectAllComponent implements OnInit {
  public ref;
  public localSelectedItem: any;
  public border = "1px solid #82A7E2";
  public fill: any;
  public rotate: any;
  public color: any;
  public color1: any;
  public toggle: boolean = false;
  public allselected: boolean = false;
  public checkedList: {};
  public oneSelected: boolean = false;
  public selectedAll: any;
  public checkedValue: any;
  public checkedstatus: any;

  @Input("User") set selectedItem(value) {
    if (value.length > 0) {
      this.localSelectedItem = value;
    } else {
      this.localSelectedItem = [];
    }
  }
  @Input() disableSelect:boolean = false;
  @Input() events: Observable<void>;
  @Output() Selected = new EventEmitter();
  @Output() allSelected = new EventEmitter<boolean>();
  eventsSubscription: Subscription;
  constructor(private translate: TranslateService, private elRef: ElementRef) {}

  ngOnInit(): void {
    this.ref =
      this.translate.instant("Ongoing").toUpperCase() +
      " " +
      this.translate.instant("Project").toUpperCase();
    this.eventsSubscription = this.events.subscribe(() => {
      this.localSelectedItem.forEach((item) => (item.checked = false));
    });
  }

  toogleMultiselect() {
    if(!this.disableSelect){
    this.toggle = !this.toggle;
    this.setStyles();
    }
  }

  onClick(event) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.toggle = false;
      this.setStyles();
    }
  }

  setStyles() {
    this.setBorderColor();
    this.setFillColor();
    this.setRotate();
    this.setColorTitle();
    this.ChangeTitleWhenOpenCloseToggle();
    this.mouseOver();
    this.mouseleave();
  }

  setColorTitle() {
    if (this.toggle) {
      this.color = "var(--orange-dark)";
    } else {
      this.color = "#82A7E2";
    }
  }

  setFillColor() {
    if (this.toggle) {
      this.fill = "var(--orange-dark)";
    } else {
      this.fill = "#82A7E2";
    }
  }
  mouseOver() {
    if (this.toggle) {
    } else {
      this.color = "var(--orange-dark)";
      this.fill = "var(--orange-dark)";
      this.border = "1px solid #FF7000";
    }
  }
  mouseleave() {
    if (this.toggle) {
    } else {
      this.fill = "#82A7E2";
      this.color = "#82A7E2";
      this.border = "1px solid #82A7E2";
    }
  }

  setRotate() {
    if (this.toggle) {
      this.rotate = "rotate(180)";
    } else {
      this.rotate = "rotate(0)";
    }
  }

  setBorderColor() {
    if (this.toggle) {
      this.border = "2px solid var(--orange-dark)";
    } else {
      this.border = "1px solid #82A7E2";
    }
  }

  /**Selektiranje nasumicnih user-a  */
  getSelectedItem(user) {
    user.checked = !user.checked;
    this.allselected = this.CheckedItemStatus();
    this.GetNameSurnameOfFirstActiveUserInDropdown();
    this.Selected.emit(user.project_id);
  }

  counter4: number = 0;
  ChangeTitleWhenOpenCloseToggle() {
    this.counter4 = 0;
    for (let i = 0; i < this.localSelectedItem.length; i++) {
      if (this.localSelectedItem[i].checked == true) {
        this.counter4++;
      }
    }

    if (this.toggle) {
      if (this.counter4 == this.localSelectedItem.length) {
        return (this.ref =
          this.translate.instant("Ongoing").toUpperCase() +
          " " +
          this.translate.instant("Project").toUpperCase());
      } else {
        this.GetNameSurnameOfFirstActiveUserInDropdown();
      }
    } else {
      return (this.ref =
        this.translate.instant("Ongoing").toUpperCase() +
        " " +
        this.translate.instant("Project").toUpperCase());
    }
  }

  GetNameSurnameOfFirstActiveUserInDropdown() {
    for (let i = 0; i < this.localSelectedItem.length; i++) {
      if (this.localSelectedItem[i].checked == true) {
        return (this.ref = this.localSelectedItem[i].Name);
      }
    }
    this.ref =
      this.translate.instant("Ongoing").toUpperCase() +
      " " +
      this.translate.instant("Project").toUpperCase();
  }

  CheckedItemStatus() {
    for (let i = 0; i < this.localSelectedItem.length; i++) {
      if (
        this.localSelectedItem[i].checked == false ||
        this.localSelectedItem[i].checked == undefined
      ) {
        return false;
      }
    }
    return true;
  }

  allIsChecked() {
    this.localSelectedItem.forEach((el) => {
      el.checked = true;
    });

    this.ref =
      this.translate.instant("Ongoing").toUpperCase() +
      " " +
      this.translate.instant("Project").toUpperCase();
  }

  selectAll() {
    this.allselected = !this.allselected;
    this.localSelectedItem.forEach((item) => (item.checked = false));
    this.allSelected.emit(this.allselected);
    if (this.allselected) {
      this.allIsChecked();
    } else {
      this.localSelectedItem.forEach((el) => {
        el.checked = false;
      });
    }
  }

  counter3: number = 0;
  setColorDropDownSelect(item) {
    this.counter3 = 0;

    for (let i = 0; i < this.localSelectedItem.length; i++) {
      if (this.localSelectedItem[i].checked == true) {
        this.counter3++;
      }
    }

    if (this.counter3 > 0) {
      if (item.checked) {
      }
      return "#1A1A1A";
    }
  }
}
