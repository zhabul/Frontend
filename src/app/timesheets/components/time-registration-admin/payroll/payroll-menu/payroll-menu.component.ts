import { Component, OnInit, Input, HostListener, ElementRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MomentsService } from 'src/app/core/services/moments.service';
import { TranslateService } from "@ngx-translate/core";
import { PayrollFormComponent } from './payroll-form/payroll-form.component';
import { PayrollEmailLogsComponent } from './payroll-email-logs/payroll-email-logs.component';
import * as moment from "moment";
import { SettingsService } from "src/app/core/services/settings.service";

@Component({
  selector: 'app-payroll-menu',
  templateUrl: './payroll-menu.component.html',
  styleUrls: ['./payroll-menu.component.css', '../../user-details-admin/user-details-admin.component.css']
})
export class PayrollMenuComponent implements OnInit {

  @Input('users') users = [];
  @Input('date') date = '';
  @Input('user_ids') user_ids = [];

  @HostListener('document:click', ['$event'])
  clickout(event) {
    const target = event.target;
    const innerHtml:string = event.target.innerHTML.trim();
    if(!this.eRef.nativeElement.contains(target) && innerHtml !== this.translate.instant('Yes')) {
      this.closeOptions();
    }
  }

  constructor(
    private momentsService: MomentsService,
    private dialog: MatDialog,
    private eRef: ElementRef,
    public translate: TranslateService,
    private settingsService: SettingsService,
    ) { }

  ngOnInit(): void {
    this.getChoosenSalarySystem();
  }

  public buttonToggleDots = false;
  public arrowUpColor = '#BFE29C';
  public btnOptionsBorderRadius = {};
  public type = 'PDF';
  public choosen_payment_system: any[] = [];

  threeDotsEnter() {
    if (this.buttonToggleDots) return;
    this.setBtnOptionsBorderRadius();
  }

  threeDotsLeave() {
    if (this.buttonToggleDots) return;
    this.setBtnOptionsBorderRadius();
  }

  closeOptions() {
    this.buttonToggleDots = false;
    this.setBtnOptionsBorderRadius();
  }

  optionsDownDiv(){
    this.buttonToggleDots = !this.buttonToggleDots;
    this.setBtnOptionsBorderRadius();
  }

  setBtnOptionsBorderRadius() {
    if (this.buttonToggleDots) {
      this.btnOptionsBorderRadius = {
        borderBottomRightRadius: '0px',
        borderBottomLeftRadius: '0px'
      };
      return;
    }
    this.btnOptionsBorderRadius = {
      borderRadius: '0.4rem'
    };
  }

  public sending = false;
  async generatePdf() {
    if (this.sending) return;
    this.sending = true;
    this.closeOptions();
    const startDate = moment(this.date).startOf('month').format('YYYY-MM-DD');
    const endDate = moment(startDate).endOf('month').format('YYYY-MM-DD');
    const response = await this.momentsService.generatePdf(startDate, endDate, this.users, this.user_ids, this.type).toPromise2();
    this.sending = false;

    if (response["status"]) {
      return { url: response["url"], filename: response["filename"], date: this.date, xls: response["xls"] };
    }
  }

  async downloadPdf() {
    const { url } = await this.generatePdf();
    if (!url) return;
    window.open(url, '_blank');
  }

  async sendPdf(type) {

    this.type = type;
    const data = await this.generatePdf();
    if (!data || !data.url) return;
    this.openFormModal(data, type);
  }

  openFormModal(data, type) {
      const diaolgConfig = new MatDialogConfig();
      diaolgConfig.autoFocus = true;
      diaolgConfig.disableClose = true;
      diaolgConfig.width = "1180px";
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

  openEmailLog() {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = false;
    diaolgConfig.width = "1180px";
    diaolgConfig.data = { };
    this.dialog
      .open(PayrollEmailLogsComponent, diaolgConfig)
      .afterClosed()
      .subscribe((res) => {});
  }

  goToLink(url: string) {
    window.location.href = url;
  }

  getChoosenSalarySystem() {
    this.settingsService.getChoosenSalarySystem().subscribe((response) => {

        if (response.status) {
            this.choosen_payment_system = response.data['VALUE'];
            console.log(this.choosen_payment_system)
        }
    });
  }
}
