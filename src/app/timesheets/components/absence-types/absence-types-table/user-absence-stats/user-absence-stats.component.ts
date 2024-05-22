import { Component, OnInit, Input } from '@angular/core';
import * as moment from "moment";
import { TimesheetsService } from '../../../timesheets.service';

@Component({
  selector: 'app-user-absence-stats',
  templateUrl: './user-absence-stats.component.html',
  styleUrls: [
    './user-absence-stats.component.css',
    '../absence-types-table.component.css',
    '../../../time-registration-admin/user-details-admin/user-details-admin.component.css'
  ]
})
export class UserAbsenceStatsComponent implements OnInit {

  @Input('user') user;
  @Input('allYears') allYears = [];
  @Input('allAbsences') allAbsences = [];
  @Input('absencesGrid') absencesGrid;

  public currentYear = moment().format('YYYY');

  constructor(private timsehets: TimesheetsService) { }

  ngOnInit(): void {

  }

  valueUpdateHandler(data) {
    this.loopThroughUserYears(data);
  }

  loopThroughUserYears({ year, absence, value }) {
    // console.log(year,absence)
    // console.log(this.user.years.list[year][absence])
    // let residual = 0;
    // let total = 0;
    // this.allYears.forEach((year_, yearIndex)=>{
    //   const yearId = year_.id;
    //   const year2 = year_.year;
    //   const yearList = this.user.years.list[yearId];
    //   this.allAbsences.forEach((absence_, absenceIndex)=>{
    //     if (year2 > this.currentYear) {
    //       return;
    //     }
    //     const absenceId = absence_.id;
    //     let yearAbsence = yearList[absenceId];
    //     if (absence == absenceId) {
    //       const yearMax = Number(year == yearId ? value : yearAbsence.year_max);
    //       const subtracted_ = (yearMax - Number(yearAbsence.value)) + Number(yearAbsence.flex_total) + residual;
    //       let sub = 0;
    //       if (year2 < this.currentYear) {
    //         sub = subtracted_ <= 0 ? 0 : subtracted_;
    //       } else if (year2 == this.currentYear) {
    //         console.log(subtracted_);
    //         sub = subtracted_ == 0 ? 0 : subtracted_;
    //       }
    //       yearAbsence = {
    //         ...yearAbsence,
    //         year_max: yearMax,
    //         subtracted: sub,
    //         residual: subtracted_
    //       };
    //       total = total + sub;
    //       residual = subtracted_ >= 0 ? 0 : subtracted_;
    //     }
    //     yearList[absenceId] = yearAbsence;
    //   });
    // });

    // this.allYears.forEach((year_, yearIndex)=>{
    //   console.log(year_,this.allAbsences)
    //   const yearId = year_.id;
    //   const year2 = year_.year;
    //   const yearList = this.user.years.list[yearId];
    //   this.allAbsences.forEach((absence_, absenceIndex)=>{
    //     if (year2 > this.currentYear) {
    //       return;
    //     }
    //     const absenceId = absence_.id;
    //     let yearAbsence = yearList[absenceId];
    //     if (absence == absenceId) {
    //       const yearMax = Number(year == yearId ? value : yearAbsence.year_max);
    //       const subtracted_ = (yearMax - Number(yearAbsence.value)) + Number(yearAbsence.flex_total) + residual;
    //       // let sub = 0;
    //       // if (year2 < this.currentYear) {
    //       //   sub = subtracted_ <= 0 ? 0 : subtracted_;
    //       // } else if (year2 == this.currentYear) {
    //       //   sub = subtracted_ == 0 ? 0 : subtracted_;
    //       // }
    //       yearAbsence = {
    //         ...yearAbsence,
    //         year_max: yearMax,
    //         subtracted: year == yearId ? value : yearMax,
    //         residual: year == yearId ? value : subtracted_
    //       };
    //       total = year == yearId ? total + value : total + yearMax;
    //       residual = subtracted_ >= 0 ? 0 : subtracted_;
    //     }
    //     yearList[absenceId] = yearAbsence;
    //   });
    // });
    // this.user.years.totals[absence] = total;

    this.user.years.list[year][absence].residual = value;
    this.user.years.list[year][absence].subtracted = value;

    // this.user.years.totals[absence] = this.user.years.totals[absence] == "" ? value : this.user.years.totals[absence] + value;
    let newTotal = 0;

    this.allYears.forEach((year_, yearIndex)=>{

      if(this.user.years.list[year_.id][absence].subtracted != ""){
        newTotal += this.user.years.list[year_.id][absence].subtracted;
        const data = {
          user: this.user.id,
          absence: absence,
          year: year_.id,
          date: year_.year + "-01-01",
          value: this.user.years.list[year_.id][absence].subtracted - this.user.years.list[year_.id][absence].flex_total
        }
          if(data['year'] != year)
          this.timsehets.addValueToUserYearAbsenceLimit(data);
        };

    });

    this.user.years.totals[absence] = newTotal;
  }

}
