import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { GeneralsService } from "src/app/core/services/generals.service";
import { PayrollFormComponent } from 'src/app/timesheets/components/time-registration-admin/payroll/payroll-menu/payroll-form/payroll-form.component';

@Component({
  selector: 'app-lonetyper-editor',
  templateUrl: './lonetyper-editor.component.html',
  styleUrls: ['./lonetyper-editor.component.css']
})
export class LonetyperEditorComponent implements OnInit {

    constructor(private generalsService: GeneralsService, private dialog: MatDialog,) { }

    ngOnInit(): void {
        this.getGenerals();
        this.getUserDetails();
        this.setDisabledInputAttribute();
    }

    public generals = [];
    async getGenerals() {
        this.generals = await this.generalsService.getGenerals().toPromise2();
    }


    public userDetails;
    getUserDetails() {
        this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    }

    public inputDisabled = false;
    setDisabledInputAttribute() {
        const reportManagement = this.userDetails.create_timesheets_time_report_management;
        this.inputDisabled = reportManagement === undefined;
    }

    async sendEmail(type) {

        const data = '';
       // if (!data || !data.url) return;
        this.openFormModal(data, type);
      }

    openFormModal(data, type) {

        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = true;
        diaolgConfig.disableClose = true;
        diaolgConfig.width = "1180px";
      // diaolgConfig.padding = "0";
        diaolgConfig.panelClass = "confirm-modal";
        diaolgConfig.data = { data: data, type: type };
        this.dialog
            .open(PayrollFormComponent, diaolgConfig)
            .afterClosed()
            .subscribe((res) => {
                if (res) {

                }
        });
    }
}
