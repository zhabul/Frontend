import { Component, OnInit } from '@angular/core';
import { TimeRegistrationService } from 'src/app/core/services/time-registration.service';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-payroll-email-logs',
  templateUrl: './payroll-email-logs.component.html',
  styleUrls: ['./payroll-email-logs.component.css']
})
export class PayrollEmailLogsComponent implements OnInit {
  constructor(
    private timeRegistrationService: TimeRegistrationService,
    public translate: TranslateService
    ) { }
  ngOnInit(): void {
    this.getEmailLogs();
  }
  public sending = false;
  public emailLogs = [];
  async getEmailLogs() {
    this.sending = true;
    const res:any = await this.timeRegistrationService.getEmailLogsForPayroll();
    this.sending = false;
    this.emailLogs = this.translateMonth(res.data);
  }

  translateMonth(data) {
    return data.map((item)=>{
      const date = item.msg.split('-');
      return { ...item, msg: `${this.translate.instant(date[0])}-${date[1]}` }
    });
  }
}
