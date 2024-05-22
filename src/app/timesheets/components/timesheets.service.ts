import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BASE_URL } from "../../config";
import { catchError, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TimesheetsService {

  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest",
    });
  }

  private addValueToUserYearAbsenceLimitUrl: string = BASE_URL + "api/timesheet/addValueToUserYearAbsenceLimit";
  addValueToUserYearAbsenceLimit({ user, absence, year, date, value }) {
    return this.http
    .post(this.addValueToUserYearAbsenceLimitUrl, { user, absence, year, date, value }, { headers: this.headers })
    .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  private removeYearFromAbsenceStatsUrl: string = BASE_URL + "api/timesheet/removeYearFromAbsenceStats";
  removeYearFromAbsenceStats(year: number) {
    return this.http
    .post(this.removeYearFromAbsenceStatsUrl, { year: year }, { headers: this.headers })
    .pipe(catchError(() => of({ status: false })));
  }

  private addYearForAbsenceStatsUrl: string = BASE_URL + "api/timesheet/addYearForAbsenceStats";
    addYearForAbsenceStats(year: number) {
      return this.http
      .post(this.addYearForAbsenceStatsUrl, { year: year }, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  private getPersonalStatisticsTotalsUrl: string = BASE_URL + "api/timesheet/getPersonalStatisticsTotals";
  getPersonalStatisticsTotals(params) {
    const {
        searchValue,
        startDate,
        endDate,
        selectedTypes,
        activeStatus
      } = params;

    return this.http
      .get(`${this.getPersonalStatisticsTotalsUrl}/${startDate}/${endDate}?s=${searchValue}&type=${selectedTypes}&status=${activeStatus}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  private getPersonalStatisticsForUsersUrl: string = BASE_URL + "api/timesheet/getPersonalStatisticsForUsers";
  getPersonalStatisticsForUsers(params) {
    const {
        searchValue,
        startDate,
        endDate,
        selectedTypes,
        activeStatus,
        offset,
        limit
     } = params;
    return this.http
      .get(`${this.getPersonalStatisticsForUsersUrl}/${startDate}/${endDate}/${offset}/${limit}?s=${searchValue}&type=${selectedTypes}&status=${activeStatus}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  private getPersonalAbsenceStatisticsForUsersByYearsUrl: string = BASE_URL + "api/timesheet/getPersonalAbsenceStatisticsForUsersByYears";
  getPersonalAbsenceStatisticsForUsersByYears(params) {
    const {
        searchValue,
        startDate,
        endDate,
        selectedTypes,
        activeStatus,
        offset,
        limit
     } = params;
    return this.http
      .get(`${this.getPersonalAbsenceStatisticsForUsersByYearsUrl}/${startDate}/${endDate}/${offset}/${limit}?s=${searchValue}&type=${selectedTypes}&status=${activeStatus}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }
}
