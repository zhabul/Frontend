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
  selector: "app-permission-dropdown",
  templateUrl: "./permission-dropdown.component.html",
  styleUrls: ["./permission-dropdown.component.css"],
})
export class PermissionDropdownComponent implements OnInit {
  @ViewChild("userInput") userInput: ElementRef;

  private _listOfItems = [];


  @Input() disable: boolean = false;
  @Input() loopThrough: string = "roles";
  @Input() title: string = '';
  @Input() set listOfItems(value: any[]) {
    this._listOfItems = value;
    this.copyOfAllItems = structuredClone(this._listOfItems);
    this.unchangeableCopyOfAllItems = this.copyOfAllItems;
    this.checkPrimaryCheckboxes();
    this.howManyItemsChecked();
  }

  @Output() selectedPermissionForAll = new EventEmitter();
  @Output('selectedPermissionsNumber') selectedPermissionsNumber = new EventEmitter();

  isAllChecked: boolean = false;
  isAllView: boolean = false;
  isAllEdit: boolean = false;
  isDropdownOpen: boolean = false;
  copyOfAllItems: any[] = [];
  unchangeableCopyOfAllItems: any[] = [];
  placeholder: string;
  

  constructor(
    private elementRef: ElementRef,
  ) {}

  ngOnInit(): void {
    this.placeholder = this.title;
  }


  @HostListener("document:mousedown", ["$event"])
  onGlobalClick(event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      // clicked outside => close dropdown list
      this.isDropdownOpen = false;
      this.howManyItemsChecked();
    }
  }

  howManyItemsChecked() {
    let checkedItems: number = 0;
    for (let item of this.copyOfAllItems) {
      if (item.canView || item.canEdit) checkedItems++;
    }

    if (checkedItems > 0) this.placeholder = `+${checkedItems}`;
    else this.placeholder = this.title;
  }

  onItemCheck(item) {
    item.checked = !item.checked;
    if (!item.checked) {
      item.canEdit = false;
      item.canView = false;
      this.isAllChecked = false;
    }

    this.checkPrimaryCheckboxes();
    this.selectedPermissionForAll.emit(this.unchangeableCopyOfAllItems);
  }

  onViewCheck(item) {
    item.canView = !item.canView;
    if (!item.canView) item.canEdit = false;

    this.checkPrimaryCheckboxes();
    this.selectedPermissionForAll.emit(this.unchangeableCopyOfAllItems);
  }

  onEditCheck(item) {
    item.canEdit = !item.canEdit;
    if (item.canEdit) item.canView = true;

    this.checkPrimaryCheckboxes();
    this.selectedPermissionForAll.emit(this.unchangeableCopyOfAllItems);
  }

  onAllChecked() {
    this.isAllChecked = !this.isAllChecked;
    if (this.isAllChecked) {
      for (let item of this.copyOfAllItems) item["checked"] = true;
    }
    if (!this.isAllChecked) {
      this.isAllEdit = false;
      this.isAllView = false;
      for (let item of this.copyOfAllItems) {
        item["checked"] = false;
        item["canEdit"] = false;
        item["canView"] = false;
      }
    }
    
    this.selectedPermissionForAll.emit(this.unchangeableCopyOfAllItems);
    this.checkPrimaryCheckboxes();
  }

  onAllView() {
    this.isAllView = !this.isAllView;
    if (this.isAllView) {
      for (let item of this.copyOfAllItems) {
        if (item["checked"]) item["canView"] = true;
      }
    }
    if (!this.isAllView) {
      for (let item of this.copyOfAllItems) {
        if (item["checked"]) item["canView"] = false;
      }
    }
    this.selectedPermissionForAll.emit(this.unchangeableCopyOfAllItems);
  }

  onAllEdit() {
    this.isAllEdit = !this.isAllEdit;
    if (this.isAllEdit) {
      this.isAllView = true;
      for (let item of this.copyOfAllItems) {
        if (item["checked"]) {
          item["canEdit"] = true;
          item["canView"] = true;
        }
      }
    }
    if (!this.isAllEdit) {
      for (let item of this.copyOfAllItems) {
        if (item["checked"]) item["canEdit"] = false;
      }
    }

    this.selectedPermissionForAll.emit(this.unchangeableCopyOfAllItems);
  }

  onOpenDropdown() {
    if (this.disable) return;
    this.isDropdownOpen = !this.isDropdownOpen;
    this.howManyItemsChecked();
    setTimeout(() => {
      this.userInput?.nativeElement.focus();
    }, 1000);
  }

  takeUserInput(e) {
    this.copyOfAllItems = this.unchangeableCopyOfAllItems;
    const value = e.target.value.toLowerCase();
    this.copyOfAllItems = this.copyOfAllItems.filter((x) => {
      return x[this.loopThrough].toLowerCase().includes(value);
    });

    this.checkPrimaryCheckboxes();
  }

  // Ovo je funckija za ona dva na vrhu
  // da se sve moze editovati ili gledati
  checkPrimaryCheckboxes() {
    this.isAllView = true;
    this.isAllEdit = true;
    this.isAllChecked = true;
    let noOneChecked: boolean = true;
    for (let item of this.copyOfAllItems) {
      if (item.checked) {
        noOneChecked = false;
        if (!item.canView) this.isAllView = false;
        if (!item.canEdit) this.isAllEdit = false;
      } else {
        this.isAllChecked = false;
      }
    }

    if (noOneChecked) {
      this.isAllEdit = false;
      this.isAllView = false;
    }
  }
}
