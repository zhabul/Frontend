import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
  forwardRef,
} from "@angular/core";
import { FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { Client } from "src/app/core/models/client.model";

const CUSTOM_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CounterDropdownMultiselectComponent),
  multi: true,
};

@Component({
  selector: "app-counter-dropdown-multiselect",
  templateUrl: "./counter-dropdown-multiselect.component.html",
  styleUrls: ["./counter-dropdown-multiselect.component.css"],
  providers: [CUSTOM_VALUE_ACCESSOR],
})
export class CounterDropdownMultiselectComponent implements OnInit {
  public ref;
  public ref1 = this.translate.instant("Choose All");
  public localSelectedItem: any;
  public border = "1px solid var(--border-color)";
  public border1 = "";
  public border2 = "";
  public border4 = "0px";
  public radius = "4px 4px 0px 0px";
  public fill: any;
  public rotate: any;
  public color: any;
  public color1: any;
  public ckcPerson: any = [];
  public unckcPerson: any = [];
  public toggle2: boolean = false;
  public fontsize = "";
  public toggle: boolean = false;
  public allselected: boolean = false;
  public checkedList: {};
  public oneSelected: boolean = false;
  public selectedAll: any;
  public checkedValue: any;
  public checkedstatus: any;
  public userFromOffer: any;

  clients: Client[];
  _filterText: string = "";
  filteredClient: any[];
  showborder = false;
  show: boolean = false;
  showDiv = false;
  selectedUsers: any = [];
  unselectedUsers: any = [];
  createForm: FormGroup;
  borderHoverColor: string = "";
  isHovered: boolean = false;

  @Output() SelectedUserAll = new EventEmitter();
  @Output() OnDeSelectAll = new EventEmitter();
  @Output() SelectedUser = new EventEmitter();
  @Output() DeSelectUser = new EventEmitter();

  @Input() disableSelect: boolean = false;
  @Input() placeholder;
  @Input() width: number;
  @Input() PermitActive: boolean = false;
  @Input() type: string;
  @Input() selectedCoworkers: any;
  @Input() chooseAll = true;
  @Input() from_component?: any;
  @Input() EnableSearch: boolean;
  @Input() selected_from?: any;
  @Input() changed: boolean = false;
  @Input() name: string;

  @Input("selectedItem") set selectedItem(value) {
    if (value?.length > 0) {
      this.localSelectedItem = [];
      this.localSelectedItem = value;
      this.filteredClient = this.localSelectedItem;

      this.sortingCheckedAndUncheckedUsers(this.filteredClient);

      this.showDiv = true;
      this.showborder = true;
      this.border4 = "0px";
      this.border1 = "1px solid var(--border-color)";
      this.border2 = "1px solid var(--border-color)";
      this.border = "1px solid var(--border-color)";
    } else {
      this.localSelectedItem = [];
      this.filteredClient = [];
      this.showDiv = false;
      this.showborder = false;
      this.border1 = "1px solid var(--border-color)";
      this.border2 = "";
      this.ref = this.translate.instant("No data available");
    }
  }

  @Input('userFromOffer') set setUserFromOffer(value) {
    if (!value) return;
    this.setUserFromOfferFun(value);
  }

  @ViewChild("dropdown") dropdownRef: ElementRef;
  @ViewChild("search") searchElement: ElementRef;

  @HostListener("document:click", ["$event"])
  OndocumentClick(event: MouseEvent) {
    this.GetElementWhenClickOutsideDropdown();
  }

  @HostListener("mouseover") onMouseOver() {
    this.isHovered = true;
    this.borderHoverColor = "2px solid var(--orange-dark)";
  }

  @HostListener("mouseout") onMouseOut() {
    this.isHovered = false;
    this.borderHoverColor = "";
  }

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.ref = this.placeholder;

    this.changeDropdownColor();
    this.ChangeTitleWhenOpenCloseToggle();
    this.clearPlacehoder();
    if (this.selected_from && this.selected_from == "user_personal_data") {
      this.getSelectedItem(this.localSelectedItem[0]);
    }
  }

  ngOnChanges() {
    if (this.selectedCoworkers?.length > 0) {
      this.UpdateContactPeople();
      this.changeDropdownColor();
      this.ChangeTitleWhenOpenCloseToggle();
      this.sortingCheckedAndUncheckedUsers(this.filteredClient);
    }
  }

  get filterText() {
    return this._filterText;
  }

  set filterText(value: string) {
    this._filterText = value;
    this.filteredClient = this.filterDataByName(value);
    this.sortingCheckedAndUncheckedUsers(this.filteredClient);
    this.usersFilter();
  }

  filterDataByName(filterTerm: string) {
    if (this.localSelectedItem.length === 0 || this.filterText === "") {
      return this.localSelectedItem;
    } else {
      return this.localSelectedItem.filter((client) => {
        if (client.Name != null || client.fullname != null) {
          return this.filterName(client, filterTerm);
        }
      });
    }
  }

  filterName(client, filterTerm) {
    if (client.Name !== undefined)
      return client.Name.toLowerCase().includes(filterTerm.toLowerCase());
    if (client.fullname !== undefined)
      return client.fullname.toLowerCase().includes(filterTerm.toLowerCase());
  }

  showSearch() {
    if (this.toggle) {
      this.show = true;
      this.color = "var(--orange-dark)";
    } else {
      this.color = "#1A1A1A";
      this.show = false;
    }

    setTimeout(() => {
      // this will make the execution after the above boolean has changed
      if (this.searchElement == undefined) {
      } else {
        this.searchElement.nativeElement.focus();
      }
    }, 0);
  }

  GetElementWhenClickOutsideDropdown() {
    if (!this.dropdownRef.nativeElement.contains(event.target)) {
      this.toggle = false;
      this.changeDropdownColor();
      // this.GetNameSurnameOfFirstActiveUserInDropdown();
    }
  }
  UpdateContactPeople() {
    for (let i = 0; i < this.localSelectedItem.length; i++) {
      let coworker = this.localSelectedItem[i];
      if (this.type === "newProject") {
        let index = this.selectedCoworkers.findIndex(
          (item) => item.Id === coworker.Id
        );
        if (index > -1) {
          coworker.checked = true;
          if (!this.selectedUsers.includes(coworker)) {
            this.selectedUsers.push(coworker);
          }
        }
      } else if (this.type === "Permit") {
        let index = this.selectedCoworkers.findIndex(
          (item) => item.id === coworker.id
        );
        if (index > -1) {
          coworker.checked = true;
          if (!this.selectedUsers.includes(coworker)) {
            this.selectedUsers.push(coworker);
          }
        }
      }
    }
  }
  toogleMultiselect() {
    if (!this.disableSelect) {
      this.toggle = !this.toggle;
      this.changeDropdownColor();
    }
  }

  changeDropdownColor() {
    if (!this.toggle && !this.changed) {
      // Zatvoren dropdown i nije bilo izmjena arraya
      if (this.selectedCoworkers?.length === 0) {
        this.color = "var(--border-color)";
        this.border = "1px solid var(--border-color)";
        this.fill = "var(--border-color)";
        this.fontsize = "14";
        this.ref = this.placeholder;
        this.setRotate();
      } else {
        this.resetToDefaultColors();
        this.setRotate();
      }
    } else if (!this.toggle && this.changed) {
      // Zatvoren dropdown i izmjenjen array
      if (this.selectedCoworkers?.length === 0) {
        this.color = "var(--border-color)";
        this.border = "1px solid var(--border-color)";
        this.fill = "var(--border-color)";
        this.border1 = "1px solid var(--border-color)";
        this.fontsize = "14";
        this.ref = this.placeholder;
        this.setRotate();
      } else {
        this.color = "var(--orange-dark)";
        this.border = "2px solid var(--orange-dark)";
        this.fill = "var(--orange-dark)";
        this.border1 = "1px solid var(--border-color)";
        this.fontsize = "18";
        this.setRotate();
      }
    } else {
      //Otvoren dropdown i prikazasn search primjeni ovu paletu boja
      this.color = "var(--border-color)";
      this.border = "2px solid var(--orange-dark)";
      this.fill = "var(--border-color)";
      this.fontsize = "18";
      this.ref = this.placeholder;
      this.setBorderColor();
      this.setBorderColor1();
      this.setFillColor();
      this.setRotate();
      this.setColorTitle();
      this.setCounterValueToogle();
      this.ChangeTitleWhenOpenCloseToggle();
      this.noData();
    }
  }

  private resetToDefaultColors() {
    this.color = "#1A1A1A";
    this.border = "1px solid var(--border-color)";
    this.fill = "#1A1A1A";
    this.fontsize = "18";
  }

  clearPlacehoder() {
    this._filterText = "";
    this.filteredClient = this.filterDataByName(this._filterText);
    this.sortingCheckedAndUncheckedUsers(this.filteredClient);
    this.usersFilter();
  }

  setColorTitle() {
    if (this.toggle) {
      this.color = "var(--orange-dark)";
    } else {
      this.color = "#1A1A1A";
    }
  }

  /**Postavke Hover-a Dropdown liste ako su true min 2 checkbox promjeni boju u naranđastu, ali ako su svi true/false ostavi default sivu boju */
  HoverCounterChange: number = 0;
  setColorDropDownSelect(item) {
    this.HoverCounterChange = 0;

    for (let i = 0; i < this.localSelectedItem.length; i++) {
      if (this.localSelectedItem[i].checked == true) {
        this.HoverCounterChange++;
      }
    }

    if (
      this.HoverCounterChange > 1 &&
      this.HoverCounterChange < this.localSelectedItem.length
    ) {
      if (item.checked == true) {
        return "var(--orange-dark)";
      } else if (item.checked == false) {
        return "#1A1A1A";
      }
    }
  }
  /** */

  setFillColor() {
    if (this.toggle) {
      this.fill = "var(--orange-dark)";
    } else {
      this.fill = "#1A1A1A";
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
      this.border = "1px solid var(--border-color)";
    }
  }

  setBorderColor1() {
    if (this.toggle) {
      this.border1 = "2px solid var(--orange-dark)";
      this.border2 = "1px solid var(--border-color)";
    } else {
      this.border1 = "1px solid var(--border-color)";
      this.border2 = "";
    }
  }

  setCounterValueToogle() {
    if (!this.toggle) {
      this.SelectedValueInDropdown = "";
    } else {
      if (this.CheckedValueInDropdown == 0) {
        this.SelectedValueInDropdown = "";
      } else {
        this.SelectedValueInDropdown = "+" + "" + this.CheckedValueInDropdown;
      }
    }
  }

  /** DropDown Title Change */
  checkedSelectedItem: number = 0;

  ChangeTitleWhenOpenCloseToggle() {
    this.checkedSelectedItem = 0;
    for (let i = 0; i < this.localSelectedItem.length; i++) {
      if (this.localSelectedItem[i].checked == true) {
        this.checkedSelectedItem++;
      }
    }
    if (this.toggle) {
      if (this.localSelectedItem.length == 0) {
        this.UpdateCheckedStatus();
        return (this.ref = this.translate.instant("No data available"));
      } else if (this.checkedSelectedItem == this.localSelectedItem.length) {
        return (this.ref = this.translate.instant("Select Reference"));
      } else {
        this.GetNameSurnameOfFirstActiveUserInDropdown();
      }
    } else {
      if (this.checkedSelectedItem > 0) {
        this.GetNameSurnameOfFirstActiveUserInDropdown();
        this.UpdateCheckedStatus();
        // this.color = 'var(--orange-dark)';
        // this.border = '2px solid var(--orange-dark)';
        // this.fill = 'var(--orange-dark)';
        //this.ref = this.placeholder;
      } else {
        this.ref = this.placeholder;
        this.color = "var(--border-color)";
        this.border = "2px solid var(--border-color)";
        this.fill = "var(--border-color)";
      }
    }
  }
  /** */

  /**Selektrianje svih vrijednosti na true ili false */
  selectAll() {
    this.allselected = !this.allselected;
    if (this.allselected) {
      this.allIsChecked();

      this.CheckedValueInDropdown = this.localSelectedItem.length;
      this.SelectedValueInDropdown = "+" + "" + this.CheckedValueInDropdown;
      this.SelectedUserAll.emit(this.localSelectedItem);
      this.clearPlacehoder();
      this.unckcPerson = [];
    } else {
      this.localSelectedItem.forEach((el) => {
        el.checked = false;
      });

      this.CheckedValueInDropdown = 0;
      if (this.CheckedValueInDropdown == 0) {
        this.SelectedValueInDropdown = "";
      } else {
        this.SelectedValueInDropdown = "+" + "" + this.CheckedValueInDropdown;
      }

      this.OnDeSelectAll.emit(this.localSelectedItem);
      this.clearPlacehoder();
      this.ckcPerson = [];
    }
  }
  /** */

  initCheckedPersons(arr) {
    this.ckcPerson = arr.filter((person) => {
      return person.checked === true;
    });
    this.unckcPerson = arr.filter((person) => {
      return (
        (person.checked !== undefined && person.checked === false) ||
        person.checked === undefined
      );
    });
  }

  sortingCheckedAndUncheckedUsers(arr: any) {
    this.initCheckedPersons(arr);
    this.usersFilter();

    if (
      !this.from_component ||
      this.from_component == "undefined" ||
      this.from_component != "all-supplier-invoices"
    ) {
      if (
        this.type == "newProject" ||
        this.type == "SupplierInvoice" ||
        this.type == "AddSupplier"
      ) {
        this.sortByName(this.ckcPerson);
        this.sortByName(this.unckcPerson);
      } else if (this.type == "Permit") {
        this.sortByFullName(this.ckcPerson);
        this.sortByFullName(this.unckcPerson);
      }
    }
  }

  getSelectedItem(user: any) {
    user.checked = !user.checked;
    this.UpdateCheckedStatus();
    this.allselected = this.CheckedItemStatus();
    this.GetNameSurnameOfFirstActiveUserInDropdown();
    //const newObjectUser = {id: user.id, fullname: user.fullname};

    /**Send data */
    // if (!this.selectedUsers.includes(user)) {
    //   this.selectedUsers.push(user);
    // } else {
    //   this.selectedUsers.splice(this.selectedUsers.indexOf(user), 1);
    // }
    /** */
    // this.SelectedUser.emit(this.selectedUsers);
    // this.DeSelectUser.emit(this.selectedUsers);
    this.clearPlacehoder();
    this.selectedUsers = this.filteredClient.filter((x) => x.checked == true);
    this.SelectedUser.emit(this.selectedUsers);
  }

  usersFilter() {
    const checkedArray = this.ckcPerson.filter((client) => {
      return this.filterName(client, this.filterText);
    });
    const unCheckedArray = this.unckcPerson.filter((client) => {
      return this.filterName(client, this.filterText);
    });
    this.filteredClient = checkedArray.concat(unCheckedArray);
  }
  /** */

  /**Ako su svi true ili ako su svi false */
  allIsChecked() {
    this.localSelectedItem.forEach((el) => {
      el.checked = true;
    });
    this.ref = this.translate.instant("Select Reference");
  }
  /** */

  /**Funkcija za provjeru all select user prilikom odabira jednog po jednog user-a */
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
  /** */

  /**Counter za prikaz selektrianih vrijednosti */
  CheckedValueInDropdown = 0;
  SelectedValueInDropdown;

  UpdateCheckedStatus() {
    this.CheckedValueInDropdown = 0;
    for (let i = 0; i < this.localSelectedItem.length; i++) {
      if (this.localSelectedItem[i].checked == true) {
        this.CheckedValueInDropdown++;
      }
    }

    if (this.CheckedValueInDropdown == 0) {
      this.SelectedValueInDropdown = "";
    } else {
      this.SelectedValueInDropdown = "+" + "" + this.CheckedValueInDropdown;
    }

    return this.SelectedValueInDropdown;
  }
  /** */

  /**Get First Active Clicked User */
  GetNameSurnameOfFirstActiveUserInDropdown() {
    if (this.type == "newProject") {
      for (let i = 0; i < this.localSelectedItem.length; i++) {
        if (this.localSelectedItem[i].checked == true) {
          return (this.ref = this.localSelectedItem[i].Name);
        }
      }
      return (this.ref = this.translate.instant("Select Reference"));
    } else if (this.type == "Permit") {
      for (let i = 0; i < this.localSelectedItem.length; i++) {
        if (this.localSelectedItem[i].checked == true) {
          return (this.ref = this.localSelectedItem[i].fullname);
        }
      }
      return (this.ref = this.translate.instant("Select Reference"));
    } else if (this.type == "SupplierInvoice") {
      for (let i = 0; i < this.localSelectedItem.length; i++) {
        if (this.localSelectedItem[i].checked == true) {
          return (this.ref =
            this.localSelectedItem[i].CustomName +
            this.localSelectedItem[i].Name);
        }
      }
      return (this.ref = this.translate.instant("Select Reference"));
    } else if (this.type == "AddSupplier") {
      for (let i = 0; i < this.localSelectedItem.length; i++) {
        if (this.localSelectedItem[i].checked == true) {
          return (this.ref = this.localSelectedItem[i].Name);
        }
      }
      return (this.ref = this.translate.instant("Select Reference"));
    }
  }
  /** */

  noData() {
    if (this.toggle) {
      if (this.localSelectedItem.length === 0) {
        this.fill = "red";
        this.color = "red";
        this.ref = this.translate.instant("No data available");
        this.border1 = "0px";
        this.border = "2px solid red";
        this.border4 = "2px solid red";
        this.radius = "4px 4px 4px 4px";
        this.showborder = false;
        this.UpdateCheckedStatus();
      }
    } else {
      //this.ref = this.placeholder
    }
  }

  trackByFn(index, item) {
    return item.Id;
  }

  sortByName(arr: any) {
    arr.sort((a, b) => {
      if (a.Name.toUpperCase() < b.Name.toUpperCase()) {
        return -1;
      }
      if (a.Name.toUpperCase() > b.Name.toUpperCase()) {
        return 1;
      }
      return 0;
    });
  }

  sortByFullName(arr: any) {
    arr.sort((a, b) => {
      if (a.fullname.toUpperCase() < b.fullname.toUpperCase()) {
        return -1;
      }
      if (a.fullname.toUpperCase() > b.fullname.toUpperCase()) {
        return 1;
      }
      return 0;
    });
  }


  setUserFromOfferFun(userId) {
    const userFromOffer = this.filteredClient.find(x => x.Id === userId);
    this.getSelectedItem(userFromOffer);
  }

}
