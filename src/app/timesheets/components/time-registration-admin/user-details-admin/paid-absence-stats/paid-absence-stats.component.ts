import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-paid-absence-stats',
  templateUrl: './paid-absence-stats.component.html',
  styleUrls: ['./paid-absence-stats.component.css']
})
export class PaidAbsenceStatsComponent implements OnInit, OnChanges {

  @Input('userId') userId;
  @Input('date') date;
  @Input('changedValue') changedValue;

  public spinner = false;

  public years = [];
  public stats = [];
  public size_of_shown_text = 25;

  constructor(private timeRegistrationService: TimeRegistrationService,  private translate: TranslateService,
  ) { }

  ngOnInit(): void {}

  ngOnChanges() {
    this.getUserDetailsPaidAbsenceStats();
  }

  getUserDetailsPaidAbsenceStats() {
    this.resetPaidAbsenceData();
    const formData = {
      userId: this.userId,
      date: this.date
    };
    this.spinner = true;
    this.timeRegistrationService.getUserDetailsPaidAbsenceStats(formData).then(this.statsResponse.bind(this));
  }

  statsResponse(res: { data:any, status: boolean }) {
      if (res.status) {
        this.stats = res.data;
        this.statsVisibilityFilter();
      }
      this.spinner = false;
  }

  statsVisibilityFilter() {

    const sumTotals = this.sumTotals();
    this.hideTotals(sumTotals);
    this.generateYearsArray(sumTotals);
  }

  hideTotals(sumTotals) {
    this.stats = this.stats.map((stat)=>{
      if (sumTotals.total_1_sum === 0) {
        stat.total_1_sum_display = false;
      }
      if (sumTotals.total_2_sum === 0) {
        stat.total_2_sum_display = false;
      }
      if (sumTotals.total_3_sum === 0) {
        stat.total_3_sum_display = false;
      }
      return stat;
    });
  }

  hideYears(sumTotals) {

  }

  sumTotals() {
    const sum = {
      total_1_sum: 0,
      total_2_sum: 0,
      total_3_sum: 0
    };
    this.stats.forEach((stat)=>{
      const total_1 = stat.total_1;
      const total_2 = stat.total_2;
      const total_3 = stat.total_3;
      stat.total_1_sum_display = true;
      stat.total_2_sum_display = true;
      stat.total_3_sum_display = true;
      if (total_1 !== 0) {
        sum.total_1_sum = sum.total_1_sum + total_1;
      }
      if (total_2 !== 0) {
        sum.total_2_sum = sum.total_2_sum + total_2;
      }
      if (total_3 !== 0) {
        sum.total_3_sum = sum.total_3_sum + total_3;
      }
    });
    return sum;
  }


  resetPaidAbsenceData() {
    this.years = [];
    this.stats = [];
  }

  generateYearsArray(sumTotals) {
    const currentYear = new Date().getFullYear(); // 2020
    const previousYear =  currentYear - 1;
    const pPreviousYear = previousYear - 1;
    this.years = [ sumTotals.total_1_sum == 0 ? '' : pPreviousYear, sumTotals.total_2_sum == 0 ? '' : previousYear, sumTotals.total_3_sum == 0 ? '' : currentYear];
  }

  translate_and_truncate_txt(source, size) {
    let translated_text = this.translate.instant(source);
    return translated_text.length > size ? translated_text.slice(0, size - 1) + "…" : translated_text;
  }

  showFullName(type) {
    if(type == 'enter') {
      this.size_of_shown_text = 500;
    }else {
      this.size_of_shown_text = 25;
    }
  }
}
