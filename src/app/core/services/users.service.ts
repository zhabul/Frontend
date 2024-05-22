import { Injectable } from "@angular/core";
import { BASE_URL } from "../../config/index";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { User } from "../models/user";
import { catchError, map, Observable, of, Subject } from "rxjs";
import 'src/app/core/extensions/rxjs-observable-promise';

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private getAllUrl: string = BASE_URL + "api/user/list";
  private getUserPermissionsUrl: string = BASE_URL + "api/user/getUserPermissions";
  private getAllOrderedUrl: string = BASE_URL + "api/user/list_ordered";
  private getUsersTimesheetsUrl: string = BASE_URL + "api/user/timesheets/list";
  private getUserUrl: string = BASE_URL + "api/user/get";
  private editUserUrl: string = BASE_URL + "api/user/edit";
  private deleteUserUrl: string = BASE_URL + "api/user/delete";
  private checkIfUserIsResponsibleForAnyProjectUrl: string =
    BASE_URL + "api/user/checkIfUserIsResponsibleForAnyProject";
  private newUserUrl: string = BASE_URL + "api/user/new";
  private getAllResponsibleUsersUrl: string =
    BASE_URL + "api/user/responsibleusers";
  private getUsersWithPermissionToCreateAndUpdateProjects: string =
    BASE_URL + "api/user/projectUsers";
  private addUserOnProjectUrlStartDate: string =
    BASE_URL + "api/user/addUserOnProjectStartDate";
  private addUserOnProjectUrlStopDate: string =
    BASE_URL + "api/user/addUserOnProjectStopDate";
  private allowUserOnProjectUrlStartDateCheck: string =
    BASE_URL + "api/user/allowUserOnProjectStartDateCheck";
  private removeUserFromProjectUrl: string =
    BASE_URL + "api/user/remove/removeUserFromProject";
  private getPlaceManagersUrl: string = BASE_URL + "api/user/getPlaceManagers";
  private getConstructionManagersUrl: string =
    BASE_URL + "api/user/getConstructionManagers";
  private getProjectManagersUrl: string =
    BASE_URL + "api/user/getProjectManagers";
  private getAtaCoworkersUrl: string = BASE_URL + "api/user/getAtaCoworkers";
  private updateAtaSubcontractorUrl: string =
    BASE_URL + "api/user/updateAtaSubcontractor";
  private removeUserFromAtaUrl: string =
    BASE_URL + "api/user/remove/removeUserFromAta";
  private getRolesUrl: string = BASE_URL + "api/user/getRoles";
  private deleteRoleUrl: string = BASE_URL + "api/user/deleteRole";
  private updateRoleUrl: string = BASE_URL + "api/user/updateRole";
  private createNewRoleUrl: string = BASE_URL + "api/user/createNewRole";
  private getRolesMomentsUrl: string = BASE_URL + "api/user/getRolesMoments";
  private getMomentsForRoleUrl: string =
    BASE_URL + "api/user/getMomentsForRole";
  private getMomentsForUserUrl: string =
    BASE_URL + "api/user/getMomentsForUser";
  private getMomentsForTidrapportUrl: string =
    BASE_URL + "api/user/getMomentsForTidrapport";
  private getPredefinedRolesUrl: string =
    BASE_URL + "api/user/getPredefinedRoles";
  private setPredefinedRolesUrl: string =
    BASE_URL + "api/user/setPredefinedRoles";
  private patchPredefinedRoleUrl: string =
    BASE_URL + "api/user/patchPredefinedRole";
  private newPredefinedRoleUrl: string =
    BASE_URL + "api/user/newPredefinedRole";
  private deletePredefinedRoleUrl: string =
    BASE_URL + "api/user/deletePredefinedRole";
  private setUserNewOptionsUrl: string =
    BASE_URL + "api/user/setUserNewOptions";
  private setUserEditOptionsUrl: string =
    BASE_URL + "api/user/setUserEditOptions";
  private patchUserEditOptionsUrl: string =
    BASE_URL + "api/user/patchUserEditOptions";
  private patchPermitUserEditOptionsUrl: string =
    BASE_URL + "api/user/patchPermitUserEditOptions";
  private getAllNotificationsUrl: string =
    BASE_URL + "api/user/getAllNotifications";
  private sendNotificationUrl: string = BASE_URL + "api/user/sendNotification";
  private markAllNotificationsAsSeenUrl: string =
    BASE_URL + "api/user/markAllNotificationsAsSeen";
  private markAllNotificationsAsOpenedUrl: string =
    BASE_URL + "api/user/markAllNotificationsAsOpened";
  private markNotificationWithOpenedUrl: string =
    BASE_URL + "api/user/markNotificationWithOpened";
  private markNotificationCheckedUrl: string =
    BASE_URL + "api/user/markNotificationChecked";
  private setNewPasswordUrl: string = BASE_URL + "api/user/setNewPassword";
  private updateAccountUrl: string = BASE_URL + "api/user/update";
  private getUserBankAccountsUrl: string =
    BASE_URL + "api/user/getUserBankAccounts";
  private addNewBankAccountUrl: string =
    BASE_URL + "api/user/addNewBankAccount";
  private updateUserLanguageUrl: string =
    BASE_URL + "api/user/updateUserLanguage";
  private setUserNotificationsUrl: string =
    BASE_URL + "api/user/setUserNotifications";
  private setPermissionUserNotificationsUrl: string =
    BASE_URL + "api/user/setPermissionUserNotifications";
  private getProjectUsersUrl: string =
    BASE_URL + "api/user/getMomentProjectUsers";
  private sortProjectPlanUsersUrl: string =
    BASE_URL + "api/user/sortProjectPlanUsers";
  private getCurrentUserProjectUrl: string =
    BASE_URL + "api/user/getCurrentUserProject";
  private getProjectUsersWithActiveScheduleDatesUrl: string =
    BASE_URL + "api/user/getProjectUsersWithActiveScheduleDates";
  private getUserDefaultMomentsUrl: string =
    BASE_URL + "api/user/getUserDefaultMoments";
  private getUserOptionsUrl: string = BASE_URL + "api/user/getUserOptions";
  private addNewProfessionUrl: string = BASE_URL + "api/user/addNewProfession";
  private getProfessionUrl: string = BASE_URL + "api/user/getProfessions";
  private generateNewPasswordUrl: string =
    BASE_URL + "api/user/generateNewPassword";
  private updateProjectUserTimestampUrl: string =
    BASE_URL + "api/user/updateProjectUserTimestamp";
  private getUserPermissionUrl: string =
    BASE_URL + "api/user/getUserPermission";
  private enableUpdateUrl: string = BASE_URL + "api/user/enableUpdate";
  private getLogoUrl: string = BASE_URL + "api/user/getLogo";
  private checkIfSiteIsDownUrl: string =
    BASE_URL + "api/user/checkIfSiteIsDown";
  private updateHourlyRatesUrl: string =
    BASE_URL + "api/user/updateHourlyRates";
  private getUsersWantToBeAddedOnProjectUrl: string =
    BASE_URL + "api/user/getUsersWantToBeAddedOnProject";
  private removeUserFromProjectByTypeUrl: string =
    BASE_URL + "api/user/removeUserFromProjectByType";
  private setRoleMomentsUrl: string = BASE_URL + "api/user/setRoleMoments";
  private updateRoleColorUrl: string = BASE_URL + "api/user/updateRoleColor";
  private removeHourlyRateUrl: string = BASE_URL + "api/user/removeHourlyRate";
  private setUserCountAsResourcesUrl: string =
    BASE_URL + "api/user/setUserCountAsResources";

  private addEducationUrl: string = BASE_URL + "api/user/addEducation";
  private removeEducationUrl: string = BASE_URL + "api/user/removeEducation";
  private toggleEducationUrl: string = BASE_URL + "api/user/toggleEducation";
  private getEducationsUrl: string = BASE_URL + "api/user/getEducations";
  private getEducationsForEditUserUrl: string =
    BASE_URL + "api/user/getEducationsForEditUser";
  private uploadEducationDocumentsUrl: string =
    BASE_URL + "api/user/uploadEducationDocuments";
  private removeEducationDocumentsUrl: string =
    BASE_URL + "api/user/removeEducationDocuments";

  private editUserPermitUrl: string = BASE_URL + "api/user/editPermit";

  private createUserPermissionTabsUrl: string =
    BASE_URL + "api/user/createUserPermissionTabs";
  private deleteUserPermissionTabsUrl: string =
    BASE_URL + "api/user/deleteUserPermissionTabs";
  private getUserPermissionTabsUrl: string =
    BASE_URL + "api/user/getUserPermissionTabs";
  private deleteSelectedNotificationUrl: string =
    BASE_URL + "api/user/deleteSelectedNotification";
  private deleteAllNotificationsUrl: string =
    BASE_URL + "api/user/deleteAllNotifications";

  private addNewHourlyRate: string =
    BASE_URL + "api/user/addNewHourlyRate";

  public status: any;
  public showNewProfesionForm = new Subject<number>();

  private headers: HttpHeaders;
  private updateUserPermissionsByUserIdUrl: string = BASE_URL + "api/user/updateUserPermissionsByUser";
  private updateUserPermissionsUrl: string = BASE_URL + "api/settings/updateUserPermissions";
  private getRolePermissionsWithPredefinedSelectedUrl: string = BASE_URL + "api/user/getRolePermissionsWithPredefinedSelected";
  private deleteEducationUrl: string = BASE_URL + "api/user/deleteEducation";
  private getAllClientsWhereWorkingThisUserUrl: string = BASE_URL + "api/user/getAllClientsWhereWorkingThisUser";
  private sendDataToClientsUrl: string = BASE_URL + "api/user/sendDataToClients";
  private getUserTypesUrl: string = BASE_URL + "api/user/getUserTypes";
  private getUserUEUrl: string = BASE_URL + "api/user/getUserUE";
  private getAllUsersWIthoutLimitUrl: string = BASE_URL + "api/user/getAllUsersWIthoutLimit";
  private getUserLangugeForXlsExportUrl: string = BASE_URL + "api/user/getUserLangugeForXlsExport";

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest",
    });
  }

  setComponentVisibility(show: number) {
    this.showNewProfesionForm.next(show);
  }

  public addEducation(data) {
    return this.http
      .post(this.addEducationUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public getEducationsForEditUser(id) {
    return this.http
      .get(`${this.getEducationsForEditUserUrl}/${id}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public getEducations() {
    return this.http
      .get(`${this.getEducationsUrl}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public removeEducation(data) {
    return this.http
      .post(this.removeEducationUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public toggleEducation(data) {
    return this.http
      .post(this.toggleEducationUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public uploadEducationDocuments(data) {
    return this.http
      .post(this.uploadEducationDocumentsUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public removeEducationDocuments(data) {
    return this.http
      .post(this.removeEducationDocumentsUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public getUsers(page = 0): Observable<any> {
    return this.http
      .get(`${this.getAllUrl}/${page}`, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return [];
        }),
        catchError(() => [])
      );
  }

  public getUserPermissions(user_id): Observable<any> {
    return this.http
      .get(`${this.getUserPermissionsUrl}/${user_id}`, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return [];
        }),
        catchError(() => [])
      );
  }

  public getUsersOrdered(project_id) {
    return this.http
      .get(`${this.getAllOrderedUrl}/${project_id}`, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return [];
        }),
        catchError(() => [])
      );
  }

  public getUsersTimesheets() {
    return this.http
      .get(this.getUsersTimesheetsUrl, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return [];
        }),
        catchError(() => [])
      );
  }

  public getUser(userid: number): Observable<User> {
    return this.http
      .get(`${this.getUserUrl}/${userid}`, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return null;
        })
      );
  }

  public saveUser(user: User): Promise<any> {
    return this.http
    .post(this.editUserUrl, user, { headers: this.headers })
    .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  public deleteUser(id: Number) {
    return this.http
      .get(`${this.deleteUserUrl}/${id}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public checkIfUserIsResponsibleForAnyProject(userId) {
    return this.http
      .post(this.checkIfUserIsResponsibleForAnyProjectUrl, userId, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  public createUser(user: User): Promise<any> {
    return this.http
    .post(this.newUserUrl, user, { headers: this.headers })
    .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  public getResposnibleUsers() {
    return this.http
      .get(this.getAllResponsibleUsersUrl, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public getPlaceManagers() {
    return this.http
      .get(this.getPlaceManagersUrl, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public getConstructionManagers() {
    return this.http
      .get(this.getConstructionManagersUrl, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public getProjectManagers(): Observable<any> {
    return this.http
      .get(this.getProjectManagersUrl, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public getUsersProjects(project_id) {
    return this.http
      .get(
        `${this.getUsersWithPermissionToCreateAndUpdateProjects}/${project_id}`,
        { headers: this.headers }
      )
      .pipe(catchError(() => of({ status: false })));
  }

  public getProjectUsersWithActiveScheduleDates(project_id) {
    return this.http
      .get(`${this.getProjectUsersWithActiveScheduleDatesUrl}/${project_id}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  public addUserOnProjecStartDate(date, user_id, project_id) {
    const user = {
      date: date,
      user_id: user_id,
      project_id: project_id,
    };

    return this.http
      .post(this.addUserOnProjectUrlStartDate, user, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public addUserOnProjecStopDate(date, user_id, project_id) {
    const user = {
      date: date,
      user_id: user_id,
      project_id: project_id,
    };

    return this.http
      .post(this.addUserOnProjectUrlStopDate, user, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public allowUserOnProject(allow, user_id, project_id) {
    allow = allow ? 1 : 0;

    const user = {
      allow: allow,
      user_id: user_id,
      project_id: project_id,
    };

    return this.http
      .post(this.allowUserOnProjectUrlStartDateCheck, user, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  public removeUserFromProject(user_id, project_id) {
    return this.http
      .get(`${this.removeUserFromProjectUrl}/${user_id}/${project_id}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  public removeUserFromAta(user_id, ata_id) {
    return this.http
      .get(`${this.removeUserFromAtaUrl}/${user_id}/${ata_id}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  public getAtaCoworkers(ata) {
    return this.http
      .get(`${this.getAtaCoworkersUrl}/${ata.id}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  updateAtaSubcontractor(user, ataVar, subcontractor) {
    const ata = {
      user: user,
      ata: ataVar,
      subcontractor: subcontractor,
    };

    return this.http
      .post(this.updateAtaSubcontractorUrl, ata, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public getRoles(): Observable<any> {
    return this.http
      .get(this.getRolesUrl, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return [];
        }),
        catchError(() => [])
      );
  }

  deleteRole(unit_id: number): Observable<any> {
    return this.http
      .get(`${this.deleteRoleUrl}/${unit_id}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public updateRole(data): Observable<any> {
    return this.http
      .post(this.updateRoleUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  createNewRole(data): Observable<any> {
    return this.http
      .post(this.createNewRoleUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public getRolesMoments(): Observable<any> {
    return this.http
      .get(this.getRolesMomentsUrl, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return [];
        }),
        catchError(() => [])
      );
  }

  public getMomentsForRole(data): Observable<any> {
    return this.http
      .post(this.getMomentsForRoleUrl, data, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return [];
        }),
        catchError(() => [])
      );
  }

  public getMomentsForUser(data): Observable<any> {
    return this.http
      .post(this.getMomentsForUserUrl, data, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return [];
        }),
        catchError(() => [])
      );
  }

  public getMomentsForTidrapport(data): Observable<any> {
    return this.http
      .post(this.getMomentsForTidrapportUrl, data, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return [];
        }),
        catchError(() => [])
      );
  }

  public getPredefinedRoles($role_id): Promise<any> {
    return this.http
    .get(`${this.getPredefinedRolesUrl}/${$role_id}`, { headers: this.headers })
    .pipe(
      map((response) => {
        if (response["status"]) {
          return response["data"];
        }
        return [];
      }),
      catchError(() => [])
    ).toPromise2();
  }

  public setPredefinedRoles(data): Observable<any> {
    return this.http
      .post(this.setPredefinedRolesUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public patchPredefinedRole(data): Promise<any> {
    return this.http
      .post(this.patchPredefinedRoleUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  public newPredefinedRole(data): Promise<any> {
    return this.http
    .post(this.newPredefinedRoleUrl, data, { headers: this.headers })
    .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  public deletePredefinedRole(role_id): Promise<any> {
    return this.http
      .get(`${this.deletePredefinedRoleUrl}/${role_id}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false }))).toPromise2().then(response => response);
  }

  public setUserEditOptions($data): Promise<any> {
    return this.http
      .post(this.setUserEditOptionsUrl, $data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  public patchUserEditOptions($data): Promise<any> {
    return this.http
      .post(this.patchUserEditOptionsUrl, $data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  public patchPermitUserEditOptions($data): Promise<any> {
    return this.http
      .post(this.patchPermitUserEditOptionsUrl, $data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  public setUserNewOptions($data): Promise<any> {
    return this.http
      .post(this.setUserNewOptionsUrl, $data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  public getAllNotifications($userId): Observable<any[]> {
    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest"
    });

    return this.http
      .get(`${this.getAllNotificationsUrl}/${$userId}`, { headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return [];
        }),
        catchError(() => [])
      );
  }

  sendNotification(data): Promise<any> {
    return this.http
      .post(this.sendNotificationUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  public markAllNotificationsAsSeen(userId): Promise<any> {
    return this.http
      .get(`${this.markAllNotificationsAsSeenUrl}/${userId}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  public markNotificationWithOpened(notificationId): Promise<any> {
    return this.http
      .get(`${this.markNotificationWithOpenedUrl}/${notificationId}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  public markNotificationChecked(notificationId, value): Promise<any> {
    return this.http
      .post(`${this.markNotificationCheckedUrl}`, { notificationId, value }, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  public markAllNotificationsAsOpened(userId): Observable<any> {
    return this.http
      .get(`${this.markAllNotificationsAsOpenedUrl}/${userId}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  public setNewPassword($data): Observable<any> {
    return this.http
      .post(this.setNewPasswordUrl, $data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public updateAccount(user: User): Observable<any> {
    return this.http
      .post(this.updateAccountUrl, user, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public addNewBankAccount(data): Observable<any> {
    return this.http
      .post(this.addNewBankAccountUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public getUserBankAccounts(userId): Observable<any> {
    return this.http
      .get(`${this.getUserBankAccountsUrl}/${userId}`, { headers: this.headers })
      .pipe(
        map((response: any) => response.bankAccounts),
        catchError(() => of({ status: false }))
        );
  }
  public updateUserLanguage(userId, newLanguage): Promise<any> {
    return this.http
      .post(
        this.updateUserLanguageUrl,
        { userId, newLanguage },
        { headers: this.headers }
      )
      .pipe(
        map((response: any) => response.bankAccounts),
        catchError(() => of({ status: false }))
        ).toPromise2();
  }

  public setUserNotifications(userId, Notifications): Promise<any> {
    return this.http
      .post(
        this.setUserNotificationsUrl,
        { userId, Notifications },
        { headers: this.headers }
      )
      .pipe(
        map((response: any) => response.bankAccounts),
        catchError(() => of({ status: false }))
        ).toPromise2();
  }

  public setPermissionUserNotifications(data): Observable<any> {
    return this.http
      .post(this.setPermissionUserNotificationsUrl, data, { headers: this.headers })
      .pipe(
        map((response: any) => response.bankAccounts),
        catchError(() => of({ status: false }))
        );
  }

  public getProjectUsers(): Observable<any> {
    return this.http
      .get(this.getProjectUsersUrl, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return [];
        }),
        catchError(() => [])
      );
  }

  public sortProjectPlanUsers(users): Observable<any> {
    return this.http
      .post(this.sortProjectPlanUsersUrl, users, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return [];
        }),
        catchError(() => [])
      );
  }

  public getCurrentUserProject(user_id): Observable<any> {
    return this.http
      .get(`${this.getCurrentUserProjectUrl}/${user_id}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public getUserDefaultMoments(user_id): Observable<any> {
    return this.http
      .get(`${this.getUserDefaultMomentsUrl}/${user_id}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  setRoleMoments(roleId, data): Promise<any> {
    return this.http
      .post(
        `${this.setRoleMomentsUrl}/${roleId}`,
        { data },
        { headers: this.headers }
      )
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  public getUserOptions(user_id): Observable<any> {
    return this.http
      .get(`${this.getUserOptionsUrl}/${user_id}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public addNewProfession(data): Promise<any> {
    return this.http
    .post(`${this.addNewProfessionUrl}`, data, { headers: this.headers })
    .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  public getProfessions(): Observable<any> {
    return this.http.get(`${this.getProfessionUrl}`, { headers: this.headers }).pipe(
      map((response) => {
        if (response["status"]) {
          return response["data"];
        }
        return [];
      }),
      catchError(() => [])
    );
  }

  public generateNewPassword(data): Observable<any> {
    return this.http
      .get(`${this.generateNewPasswordUrl}/${data}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public updateProjectUserTimestamp(arg, content_id): Promise<any> {
    const data = {
      type: arg,
      content_id: content_id,
    };

    return this.http
      .post(this.updateProjectUserTimestampUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  getUserPermission(content_type, ata_id) {
    return this.http
      .get(`${this.getUserPermissionUrl}/${content_type}/${ata_id}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  enableUpdate(content_type, id, counter): Promise<any> {
    const object = {
      content_type: content_type,
      id: id,
      counter: counter,
    };

    return this.http
      .post(this.enableUpdateUrl, object, { headers: this.headers })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  getLogo() {
    return this.http
      .get(this.getLogoUrl, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  checkIfSiteIsDown() {
    return this.http
      .get(this.checkIfSiteIsDownUrl, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  updateHourlyRates(data) {
    return this.http
      .post(this.updateHourlyRatesUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getUsersWantToBeAddedOnProject(projectId) {
    return this.http
      .get(`${this.getUsersWantToBeAddedOnProjectUrl}/${projectId}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  public removeUserFromProjectByType(object) {
    return this.http
      .post(this.removeUserFromProjectByTypeUrl, object, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public updateRoleColor(roleId: number, color: string) {
    return this.http
      .post(
        `${this.updateRoleColorUrl}/${roleId}`,
        { color },
        { headers: this.headers }
      )
      .pipe(catchError(() => of({ status: false })));
  }

  public removeHourlyRate(rateId: number) {
    return this.http
      .get(`${this.removeHourlyRateUrl}/${rateId}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  setUserCountAsResources(
    userId: number,
    projectId: number,
    isResponsiblePerson: boolean,
    countAsResources: boolean
  ) {
    return this.http
      .post(
        `${this.setUserCountAsResourcesUrl}`,
        {
          userId,
          projectId,
          countAsResources,
          isResponsiblePerson,
        },
        { headers: this.headers }
      )
      .pipe(catchError(() => of({ status: false })));
  }

  getUserPermissionTabs() {
    return this.http
      .get(`${this.getUserPermissionTabsUrl}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  createUserPermissionTabs(objData) {
    return this.http
      .post(`${this.createUserPermissionTabsUrl}`, objData, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  public deleteUserPermissionTabs(objData) {
    return this.http
      .post(`${this.deleteUserPermissionTabsUrl}`, objData, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  public deleteSelectedNotification(notificationId) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.deleteSelectedNotificationUrl}/${notificationId}`, {
        headers: headers,
      })
      .toPromise()
      .then((response) => response);
  }

  public deleteAllNotifications(userId) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.deleteAllNotificationsUrl}/${userId}`, { headers: headers })
      .toPromise()
      .then((response) => response);
  }

  public addHourlyRate(user: User): Promise<any> {
    return this.http
      .post(this.addNewHourlyRate, user, { headers: this.headers })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  public saveUserPermit(user: User): Promise<any> {
    return this.http
      .post(this.editUserPermitUrl, user, { headers: this.headers })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  public updateUserPermissionsByUserId(data) {
    return this.http
      .post(this.updateUserPermissionsByUserIdUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  public updateUserPermissions(data) {
    return this.http
      .post(this.updateUserPermissionsUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  } 

  public getRolePermissionsWithPredefinedSelected(role_id, user_id) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getRolePermissionsWithPredefinedSelectedUrl}/${role_id}/${user_id}`, { headers: headers })
      .toPromise()
      .then((response) => response);
  }

  public deleteEducation(education_id) {
    return this.http
      .post(this.deleteEducationUrl, education_id, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));    
  }

  public getAllClientsWhereWorkingThisUser(user_id) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getAllClientsWhereWorkingThisUserUrl}/${user_id}`, { headers: headers })
      .toPromise()
      .then((response) => response);
  }

  public sendDataToClients(data) {
    return this.http
      .post(this.sendDataToClientsUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));        
  }

  public getUserTypes() {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getUserTypesUrl}`, {
        headers: headers,
      })
      .toPromise2()
      .then((response) => response);    
  }

  public getUserUE() {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getUserUEUrl}`, {
        headers: headers,
      })
      .toPromise2()
      .then((response) => response);     
  }

  public  getAllUsersWIthoutLimit(first_date, last_date) {
        return this.http
        .get(
            `${this.getAllUsersWIthoutLimitUrl}/${first_date}/${last_date}`,
            { headers: this.headers }
        )
        .pipe(catchError(() => of({ status: false })));
    }

  public  getUserLangugeForXlsExport() {
        return this.http
        .get(
            `${this.getUserLangugeForXlsExportUrl}`,
            { headers: this.headers }
        )
        .pipe(catchError(() => of({ status: false })));        
    }
}
