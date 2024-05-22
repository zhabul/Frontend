import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BASE_URL } from "src/app/config";
import { BaseResponse } from "src/app/generals/components/settings/interfaces/base-response";
import { BehaviorSubject, Observable } from "rxjs";
import { Role } from "src/app/generals/components/settings/interfaces/role";
import { Subject } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class SettingsService {
  saveSubject = new Subject<number>();
  isSavedSubject = new BehaviorSubject<boolean>(true);
  companyId = new BehaviorSubject<string>("");

  constructor(private http: HttpClient) {}

  public getCompanyId(): string {
    let currentId: string;
    this.companyId.subscribe((res) => {
      currentId = res;
    });
    return currentId;
  }

  public getGeneralsForCompany(): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(
      BASE_URL + "api/settings/getGeneralsForCompany"
    );
  }

  public getAllGenerals(): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(
      BASE_URL + "api/settings/getAllGenerals"
    );
  }

  public updateAllGenerals(updateDetails: any[]): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(
      BASE_URL + "api/settings/updateAllGenerals",
      updateDetails
    );
  }

  public getDefaultRoles(): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(
      BASE_URL + "api/settings/getDefaultRoles"
    );
  }

  public getUserPermission(role_id): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(
      BASE_URL + `api/settings/getUserPermission/${role_id}`
    );
  }

  public updateDefaultRoles(role: Role): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(
      BASE_URL + "api/settings/updateDefaultRole",
      role
    );
  }

  public createDefaultRole(role: Role): Observable<BaseResponse> {
    const companyId = this.getCompanyId();
    return this.http.post<BaseResponse>(
      BASE_URL + `api/settings/createDefaultRole/${companyId}`,
      role
    );
  }

  public deleteDefaultRole(roleId: string): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(
      BASE_URL + `api/settings/deleteDefaultRole/${roleId}`
    );
  }

  public getEducations(): Observable<BaseResponse> {
    const companyId = this.getCompanyId();
    return this.http.get<BaseResponse>(
      BASE_URL + `api/settings/getEducations/${companyId}`
    );
  }

  public addEducation(education: string): Observable<BaseResponse> {
    let data = { name: education, companyId: this.getCompanyId() };
    return this.http.post<BaseResponse>(
      BASE_URL + "api/settings/addEducation",
      data
    );
  }

  public deleteEducation(id: string): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(
      BASE_URL + `api/settings/deleteEducation/${id}`
    );
  }

  public getAllAccounts(): Observable<BaseResponse> {
    const companyId = this.getCompanyId();
    return this.http.get<BaseResponse>(
      BASE_URL + `api/settings/getAllAccounts/${companyId}`
    );
  }

  public toggleAccountEnabled(
    accountNumber: string,
    value: string
  ): Observable<BaseResponse> {
    const companyId = this.getCompanyId();
    return this.http.get<BaseResponse>(
      BASE_URL +
        `api/settings/toggleAccountEnabled/${accountNumber}/${value}/${companyId}`
    );
  }

  public toggleAccountFixedCost(
    accountNumber: string,
    value: string
  ): Observable<BaseResponse> {
    const companyId = this.getCompanyId();
    return this.http.get<BaseResponse>(
      BASE_URL +
        `api/settings/toggleAccountFixedCost/${accountNumber}/${value}/${companyId}`
    );
  }

  public getActivities() {
    const companyId = this.getCompanyId();
    return this.http.get<BaseResponse>(
      BASE_URL + `api/settings/getActivities/${companyId}`
    );
  }

  public createActivity(data): Observable<BaseResponse> {
    const companyId = this.getCompanyId();
    return this.http.post<BaseResponse>(
      BASE_URL + `api/settings/createActivity/${companyId}`,
      data
    );
  }

  public updateActivity(data, id): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(
      BASE_URL + `api/settings/updateActivity/${id}`,
      data
    );
  }

  public deleteActivity(activityId): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(
      BASE_URL + `api/settings/deleteActivity/${activityId}`
    );
  }

  public getDefaultMoments(): Observable<BaseResponse> {
    const companyId = this.getCompanyId();
    return this.http.get<BaseResponse>(
      BASE_URL + `api/settings/getDefaultMoments/${companyId}`
    );
  }

  public createDefaultMoment(data) {
    const companyId = this.getCompanyId();
    return this.http.post<BaseResponse>(
      BASE_URL + `api/settings/createDefaultMoment/${companyId}`,
      data
    );
  }

  public updateDefaultMoments(data): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(
      BASE_URL + "api/settings/updateDefaultMoment",
      data
    );
  }

  public deleteDefaultMoment(data): Observable<BaseResponse> {
    const companyId = this.getCompanyId();
    return this.http.post<BaseResponse>(
      BASE_URL + `api/settings/deleteDelfaultMoment/${companyId}`,
      data
    );
  }

  public getDefaultAbsenceTypes(): Observable<BaseResponse> {
    const companyId = this.getCompanyId();
    return this.http.get<BaseResponse>(
      BASE_URL + `api/settings/getDefaultAbsenceTypes/${companyId}`
    );
  }

  public createNewDefaultAbsenceType(data): Observable<BaseResponse> {
    const companyId = this.getCompanyId();
    return this.http.post<BaseResponse>(
      BASE_URL + `api/settings/createNewDefaultAbsenceType/${companyId}`,
      data
    );
  }

  public deleteDefaultAbsenceType(data): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(
      BASE_URL + `api/settings/deleteDefaultAbsenceType`,
      data
    );
  }

  public updateDefaultAbsenceType(data): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(
      BASE_URL + "api/settings/updateDefaultAbsenceType",
      data
    );
  }

  public getDefaultWorkUnits(): Observable<BaseResponse> {
    const companyId = this.getCompanyId();
    return this.http.get<BaseResponse>(
      BASE_URL + `api/settings/getDefaultWorkUnits/${companyId}`
    );
  }

  public createNewDefaultWorkUnit(data) {
    const companyId = this.getCompanyId();
    return this.http.post<BaseResponse>(
      BASE_URL + `api/settings/createNewDefaultWorkUnit/${companyId}`,
      data
    );
  }

  public updateDefaultWorkUnits(data): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(
      BASE_URL + "api/settings/updateDefaultWorkUnits",
      data
    );
  }

  public deleteDefaultWorkUnit(data): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(
      BASE_URL + "api/settings/deleteDefaultWorkUnits",
      data
    );
  }

  public getWorkWeek(): Observable<BaseResponse> {
    const companyId = this.getCompanyId();
    return this.http.get<BaseResponse>(
      BASE_URL + `api/settings/getWorkWeek/${companyId}`
    );
  }

  public getWorkWeek2(): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(
      BASE_URL + `api/settings/getWorkWeek2`
    );
  }

  public updateWorkWeek(data): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(
      BASE_URL + "api/settings/updateWorkWeek",
      data
    );
  }

  public getDefaultHolidays(): Observable<BaseResponse> {
    const companyId = this.getCompanyId();
    return this.http.get<BaseResponse>(
      BASE_URL + `api/settings/getDefaultHolidays/${companyId}`
    );
  }

  public deletePublicHolidays(data): Observable<BaseResponse> {
    const companyId = this.getCompanyId();
    return this.http.post<BaseResponse>(
      BASE_URL + `api/settings/deletePublicHolidays/${companyId}`,
      data
    );
  }

  public updatePublicHoliday(data): Observable<BaseResponse> {
    const companyId = this.getCompanyId();
    return this.http.post<BaseResponse>(
      BASE_URL + `api/settings/updatePublicHoliday/${companyId}`,
      data
    );
  }

  public addDefaultHolidays(data): Observable<BaseResponse> {
    const companyId = this.getCompanyId();
    return this.http.post<BaseResponse>(
      BASE_URL + `api/settings/addDefaultHolidays/${companyId}`,
      data
    );
  }

  public getUserNotificationTasks(): Observable<BaseResponse> {
    const companyId = this.getCompanyId();
    return this.http.get<BaseResponse>(
      BASE_URL + `api/settings/getUserNotificationTasks/${companyId}`
    );
  }

  public createTimeForNotification(data): Observable<BaseResponse> {
    const companyId = this.getCompanyId();
    return this.http.post<BaseResponse>(
      BASE_URL + `api/settings/createTimeForNotification/${companyId}`,
      data
    );
  }

  public deleteTimeForNotification(data): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(
      BASE_URL + "api/settings/deleteTimeForNotification",
      data
    );
  }
  getActiveTab() {
      return this.saveSubject.asObservable();
  }

  public getSalarySystems(): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(
      BASE_URL + `api/settings/getSalarySystems`
    );
  }

  public getChoosenSalarySystem(): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(
      BASE_URL + `api/settings/getChoosenSalarySystem`
    );
  }

  public getEconomySystems(): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(
      BASE_URL + `api/settings/getEconomySystems`
    );
  }

  public getSpsLanguages(): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(
      BASE_URL + `api/companies/getSpsLanguages`
    );
  }

  public getSpsCurrencies(): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(
      BASE_URL + `api/companies/getSpsCurrencies`
    );
  }

    public getCompanyMoments(): Observable<BaseResponse> {
        return this.http.get<BaseResponse>(
          BASE_URL + `api/moments/getCompanyMoments`
        );
    }

    public updateSortOfDefaultMoments(data): Observable<BaseResponse> {
        return this.http.post<BaseResponse>(
            BASE_URL + "api/settings/updateSortOfDefaultMoments",
            data
        );
      }

      public changePublicAbsenceTypeColor(color: any): Observable<BaseResponse> {

        return this.http.post<BaseResponse>(
          BASE_URL + "api/settings/changePublicAbsenceTypeColor",
          color
        );
      }
}
