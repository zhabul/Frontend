import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-role-dropdown',
  templateUrl: './role-dropdown.component.html',
  styleUrls: ['./role-dropdown.component.css'],
  host: {'(document:click)': 'onClick($event)'},
})
export class RoleDropdownComponent implements OnInit {

    @Input() disableSelect:boolean = false;
    @Input() items = [];
    @Input() selected_role_id;
    @Output() toggleItemSelected = new EventEmitter<any>();
    public isOpen: boolean = false;
    public selectedDropDownOption: string | null = null;

    constructor(private _eref: ElementRef, public translate: TranslateService) { }

    ngOnInit(): void {
        if(this.items.length > 0) {
            let role = this.items.find(x => x.id == this.selected_role_id);
            this.toggleItem(role, true);
        }
    }

    onClick(event) {
        if(!this._eref.nativeElement.contains(event.target))
            this.isOpen = false;
    }

    toggleDropdown() {
        if(!this.disableSelect){
            this.isOpen = !this.isOpen;
        }
    }

    toggleItem(role, from_inint = false) {
        if(role != undefined){
            this.selectedDropDownOption = role.roles.slice(0, 5) + '...';
            if(!from_inint) {
                this.toggleItemSelected.emit(role);
            }
        }
    }
}
