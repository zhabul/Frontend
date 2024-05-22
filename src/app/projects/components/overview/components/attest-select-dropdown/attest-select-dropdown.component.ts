import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-attest-select-dropdown',
  templateUrl: './attest-select-dropdown.component.html',
  styleUrls: ['./attest-select-dropdown.component.css']
})
export class AttestSelectDropdownComponent implements OnInit {
    @Input() items;
    @Input() selected;
    @Input() project;
    @Input() type;
    @Input() disabled;
    @Output() emitSelectChanged = new EventEmitter<any>();
    @Input() disabled_click;

    public selected_type = '';
    public elementFind: any = [];
    public toggle: boolean = false;;
    public spinner = false;
    public selectedNum:any = [];
    constructor() {}


    ngOnInit(): void {

        if (this.type === 'time_attest' ) {

            this.setSelectType();
            this.findSelectedName();
        }
        if (this.type === 'time_attest1' ) {
            this.setSelectType();
            this.findSelectedName();
        }
    }

    findSelectedName() {

        let index = this.items.findIndex((i) => i['wr_id'] == this.selected.atestwr && this.selected.atestwr != null);

        if( index == -1) {

            if( this.selected.ataId != 0 ) {
              //  let name = 'ÄTA-' + this.selected.AtaNumber;
              //  index = this.items.findIndex((i) => {i['AtaNumber'] == this.selected.AtaNumber });
                index = this.items.findIndex((i) => i['AtaNumber'] == this.selected.AtaNumber );
            }else if( this.selected.ataId == 0 && this.selected.debit_id == 2 ) {
                index = this.items.findIndex((i) => i['name'] == this.selected.project_name );
            }else if (this.selected.ataId == 0) {
                index = this.items.findIndex((i) => i['ataType'] == 'DU-' );
            }
        }

        if ( index >= 0 ) {
            this.selected.name = this.items[index].name;
            this.selected.name2 = this.items[index].name2;
        }
    };

    compareBasedOnType(item:any) {
        if (this.selected_type === 'ata') {
            return item.ataId == this.selected.ataId;
        } else if (this.selected_type === 'ata_project_wr') {
            return item.wr_id == this.selected.atestwr;
        } else if (this.selected_type === 'project_fixed') {
            return item.project_id == this.selected.project_id;
        }
    }

    toggleOn() {

        if(this.disabled_click || !this.disabled) {
            return false;
        }

        if(this.type === 'moment-editor' ||
            this.type === 'moment-editor-project'||
            this.type === 'moment-editor-ata/du'){
        if(this.selected.AtestStatus == '1'){
            this.toggle = false;
        }else{
            this.toggle = !this.toggle;
        }
        }else{
            this.toggle = !this.toggle;
        }
    }

    newAtaChanged(item, selected, i3) {


        this.spinner == true;
        if (this.type === 'moment' && item.parent != '0'){

            this.emitSelectChanged.emit({
            item: item,
            moment: selected,
            i3: i3,
            }) ;
            this.spinner == false;
        }
        if (this.type === 'time_attest' ) {
            this.emitSelectChanged.emit({
            item: item,
            moment: selected,
            i3: i3,
            });
            console.log(item);
            console.log(selected);
            console.log(i3);
            this.spinner == false;
        }
        if (this.type === 'time_attest1' ) {
            this.emitSelectChanged.emit({
            item: item,
            moment: selected,
            i3: i3,
            });
            this.spinner == false;
        }
        if (this.type === 'moment-editor' && item.parent != '0' ) {

          /*
            selected.ProjectID = item.ProjectID;
            selected.projectName = item.CustomName;
            selected.project_name = item.CustomName;
            this.selected.ProjectID = item.ProjectID;
            this.selected.projectName = item.CustomName;
            this.selected.project_name = item.CustomName;
         */

            this.emitSelectChanged.emit({
            item: item,
            moment: selected,
            i3: i3,
            });
            this.spinner == false;
        }
        if (this.type === 'moment-editor-project' ) {
            this.emitSelectChanged.emit({
            item: item,
            i3:i3
            });
            this.spinner == false;
        }
        if (this.type === 'moment-editor-ata/du' ) {
            this.emitSelectChanged.emit({
            item: item,
            moment: selected,
            i3:i3
            });
            this.spinner == false;
        }
        this.toggleOn();
    }

setSelectType() {
    if ((this.selected.ataId != 0 && this.selected.ata_payment_type == 2) ||
    (this.selected.ataId != 0 && this.selected.ata_payment_type == 3) ||
    (this.selected.ataId != 0 && !this.selected.atestwr)) {
        this.selected_type = 'ata';
    } else if ((this.selected.ataId != 0 && this.selected.ata_payment_type == 1 && this.selected.atestwr) || (this.selected.ataId != 0 && this.selected.ata_payment_type == 4 && this.selected.atestwr) || (!this.selected.ata_payment_type &&
        this.project.debit_Id != 2 &&
        this.project.debit_Id != 3 &&
        this.selected.atestwr)) {

        this.selected_type = 'ata_project_wr';
    } else if ((!this.selected.ata_payment_type && this.project.debit_Id != 1 && this.project.debit_Id != 4) || (this.selected.ataId == 0 && !this.selected.atestwr)) {
    this.selected_type = 'project_fixed';
    }}
}
