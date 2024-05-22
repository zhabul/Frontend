import { Component, ElementRef, EventEmitter, Input, OnInit, Output, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-dropdown-filter',
  templateUrl: './dropdown-filter.component.html',
  styleUrls: ['./dropdown-filter.component.css'],
  host: {'(document:click)': 'onClick($event)'},
})
export class DropdownFilterComponent implements OnInit, AfterViewInit {

    @Input() disableSelect:boolean = false;
    @Input() items = [];
    @Input() placeholder = "";
    @Input() isStatus: boolean = false;
    @Output() sendToParentComponent = new EventEmitter<string[]>();
    @Output() triggerParentFunction = new EventEmitter<null>();
    public isOpen: boolean = false;
    public heightOfContainer: number = 29;
    public checkedItems: number[] = [];
    public selectedOptions: string[] = [];
    public from_edit:boolean = false;
    public containerStyle = {
        height: '0px',
        marginBottom: '0px'
    };

    constructor(private _eref: ElementRef, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.queryParamMap.subscribe((params) => {
        this.from_edit = params.get("from_edit") ? JSON.parse(params.get("from_edit")) : false;
    });
  }

    ngAfterViewInit() {

        if(this.from_edit) {
            if( this.placeholder == 'ARBETESROLL' ) {
                let filterUsersByRoles = JSON.parse(sessionStorage.getItem("filterUsersByRoles"));
                if(!filterUsersByRoles) return;
                filterUsersByRoles.forEach((data) => {
                    let index = this.items.findIndex((arg) => arg == data);
                    if(index > -1) {
                        this.toggleItem(index);
                    }
                })
            }

            if( this.placeholder == 'ANSTALLNINGTYP' ) {
                let filterUsersByTypes = JSON.parse(sessionStorage.getItem("filterUsersByTypes"));
                if(!filterUsersByTypes) return;
                filterUsersByTypes.forEach((data) => {
                    let index = this.items.findIndex((arg) => arg == data);

                    if(index > -1) {
                        this.toggleItem(index);
                    }
                })
            }

            if( this.placeholder == 'ARBETESTATUS' ) {
                let filterUsersByStatus = JSON.parse(sessionStorage.getItem("filterUsersByStatus"));
                if(!filterUsersByStatus) return;
                filterUsersByStatus.forEach((data) => {
                    let index = this.items.findIndex((arg) => arg == data);
                    if(index > -1) {
                        if (data == 'Active') {
                            this.toggleActive();
                        }else if (data == 'Inactive') {
                            this.toggleInactive();
                        }else if (data == 'Locked') {
                            this.toggleLocked();
                        }else {
                            this.toggleIncoming();
                        }
                    }
                })
            }
        }
    }

  onClick(event) {
    if(!this._eref.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.containerStyle = {
        height: '0px',
        marginBottom: '0px'
      };
    }
  }

  toggleIsOpen() {
    this.isOpen = !this.isOpen;
  }

  toggleDropdown() {
    if(!this.disableSelect){
    this.heightOfContainer = this.items.length * 29;
    if (this.containerStyle.height === '0px') {
      this.containerStyle = {
        height: `${this.heightOfContainer}px`,
        marginBottom: '4px'
      }
      this.toggleIsOpen();
      return;
    }
    this.toggleIsOpen();
    this.containerStyle = {
      height: '0px',
      marginBottom: '0px'
    }
  }
}


  toggleItem(index: number) {

    if(this.checkedItems.includes(index)) {
      this.checkedItems = this.checkedItems.filter(x => x != index);
    } else {
      this.checkedItems.push(index);
    }

    this.selectedOptions = [];
    for (let checked of this.checkedItems) {
      this.selectedOptions.push(this.items[checked]);
    }

    this.sendToParentComponent.emit(this.selectedOptions);
    this.triggerParentFunction.emit(null);
  }


  public statusSelected = {
    active: false,
    inactive: false,
    incoming: false,
    locked: false
  }

  toggleActive(): void {
    this.statusSelected.active = !this.statusSelected.active;

    if(this.checkedItems.includes(0)) {
      this.checkedItems = this.checkedItems.filter(x => x != 0);
    } else {
      this.checkedItems.push(0);
    }

    this.selectedOptions = [];
    for (let checked of this.checkedItems) {
      this.selectedOptions.push(this.items[checked]);
    }

    this.sendToParentComponent.emit(this.selectedOptions);
    this.triggerParentFunction.emit(null);
  }


  toggleInactive(): void {
    this.statusSelected.inactive = !this.statusSelected.inactive;

    if(this.checkedItems.includes(1)) {
      this.checkedItems = this.checkedItems.filter(x => x != 1);
    } else {
      this.checkedItems.push(1);
    }

    this.selectedOptions = [];
    for (let checked of this.checkedItems) {
      this.selectedOptions.push(this.items[checked]);
    }

    this.sendToParentComponent.emit(this.selectedOptions);
    this.triggerParentFunction.emit(null);
  }

  toggleIncoming(): void {
    this.statusSelected.incoming = !this.statusSelected.incoming;

    if(this.checkedItems.includes(3)) {
      this.checkedItems = this.checkedItems.filter(x => x != 3);
    } else {
      this.checkedItems.push(3);
    }

    this.selectedOptions = [];
    for (let checked of this.checkedItems) {
      this.selectedOptions.push(this.items[checked]);
    }

    this.sendToParentComponent.emit(this.selectedOptions);
    this.triggerParentFunction.emit(null);
  }

  toggleLocked(): void {
    this.statusSelected.locked = !this.statusSelected.locked;

    if(this.checkedItems.includes(2)) {
      this.checkedItems = this.checkedItems.filter(x => x != 2);
    } else {
      this.checkedItems.push(2);
    }

    this.selectedOptions = [];
    for (let checked of this.checkedItems) {
      this.selectedOptions.push(this.items[checked]);
    }

    this.sendToParentComponent.emit(this.selectedOptions);
    this.triggerParentFunction.emit(null);
  }

}
