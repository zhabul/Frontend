import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BASE_URL } from "../../config";
import { catchError, map, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TimeRegistrationService {

  private createTimesheetUrl: string = BASE_URL + "api/timesheet/new";
  private createMileageUrl: string = BASE_URL + "api/mileage/new";
  private getMileagesUrl: string = BASE_URL + "api/mileage/get";
  private removeMileageUrl: string = BASE_URL + "api/mileage/remove";
  private createAbsenceUrl: string = BASE_URL + "api/timesheet/newAbsence";

  private updateUserMileagesUrl:string =
    BASE_URL + "api/timesheet/updateUserMileages";
  private requestChangeAbsenceUrl: string =
    BASE_URL + "api/timesheet/changeRequestAbsence";
  private getAbsenceTypesUrl: string =
    BASE_URL + "api/timesheet/getAbsenceTypes";
  private getMileageTypesUrl: string =
    BASE_URL + "api/timesheet/getMileageTypes";
  private updateAbsenceTypeUrl: string =
    BASE_URL + "api/timesheet/updateAbsenceType";
  private updateAbsenceTypeColorUrl: string =
    BASE_URL + "api/timesheet/updateAbsenceTypeColor";
  private updateMileageTypeUrl: string =
    BASE_URL + "api/timesheet/updateMileageType";
  private createNewAbsenceTypeUrl: string =
    BASE_URL + "api/timesheet/createNewAbsenceType";
  private createNewMileageTypeUrl: string =
    BASE_URL + "api/timesheet/createNewMileageType";
  private deleteAbsenceTypeUrl: string =
    BASE_URL + "api/timesheet/deleteAbsenceType";
  private deleteMileageTypeUrl: string =
    BASE_URL + "api/timesheet/deleteMileageType";
  private getTimesheetsUrl: string = BASE_URL + "api/timesheet/getTimesheets";
  private getTimesheetsImpUrl: string =
    BASE_URL + "api/timesheet/getTimesheetsImp";
  private removeAbsenceFromTimesheetUrl: string =
    BASE_URL + "api/timesheet/removeAbsenceFromTimesheet";
  private removeMomentUrl: string = BASE_URL + "api/timesheet/removeMoment";
  private updatePopularMomentForProjectUrl: string =
    BASE_URL + "api/timesheet/updatePopularMomentForProject";
  private setTimesheetsToCalendarUrl: string =
    BASE_URL + "api/timesheet/setTimesheetsToCalendar";
  private getProjectMomentsUrl: string =
    BASE_URL + "api/timesheet/getProjectMoments";
  private getProjectMomentsImpUrl: string =
    BASE_URL + "api/timesheet/getProjectMomentsImp";
  private getTimesheetMomentsUrl: string =
    BASE_URL + "api/timesheet/getTimesheetMoments";
  private createNewTimesheetUrl: string =
    BASE_URL + "api/timesheet/createNewTimesheet";
  private getTimesheetsAbsenceUrl: string =
    BASE_URL + "api/timesheet/getTimesheetsAbsence";
  private getUserRolesUrl: string = BASE_URL + "api/timesheet/getUserRoles";
  private getUserRolesImpUrl: string =
    BASE_URL + "api/timesheet/getUserRolesImp";
  private getUserMessagesUrl: string =
    BASE_URL + "api/timesheet/getUserMessages";
  private createUserMessageUrl: string =
    BASE_URL + "api/timesheet/createUserMessage";
  private disapproveRaportingTimeForDayUrl: string =
    BASE_URL + "api/timesheet/disapproveRaportingTimeForDay";
  private deleteUserMessageUrl: string =
    BASE_URL + "api/timesheet/deleteUserMessage";
  private removeAbsenceUrl: string = BASE_URL + "api/timesheet/removeAbsence";
  private userScheduleRoleUrl: string =
    BASE_URL + "api/timesheet/userScheduleRole";
  private getUserScheduleRolesUrl: string =
    BASE_URL + "api/timesheet/getUserScheduleRoles";
  private updateUserScheduleRoleUrl: string =
    BASE_URL + "api/timesheet/updateUserScheduleRoles";
  private getUserTimesheetsUrl: string =
    BASE_URL + "api/timesheet/getUserTimesheets";
  private getUserAbsencesUrl: string =
    BASE_URL + "api/timesheet/getUserAbsences";
  private getTimesheetMomentsPerUserUrl: string =
    BASE_URL + "api/timesheet/getTimesheetMomentsPerUser";
  private getAllTimesheetsUrl: string =
    BASE_URL + "api/timesheet/getAllTimesheets";
  private getAllAbsenceTimesheetsUrl: string =
    BASE_URL + "api/timesheet/getAllAbsenceTimesheets";
  private approveAbsenceUrl: string = BASE_URL + "api/timesheet/approveAbsence";
  private setAbsenceForUserUrl: string =
    BASE_URL + "api/timesheet/setAbsenceForUser";
  private disapproveEditingAbsenceUrl: string =
    BASE_URL + "api/timesheet/disapproveEditingAbsence";
  private getProjectManagerProjectsUrl: string =
    BASE_URL + "api/timesheet/getProjectManagerProjects";
  private getSchemaProjectsUrl: string =
    BASE_URL + "api/timesheet/getSchemaProjects";
  private getHoursByUserForCurrentMonthUrl: string =
    BASE_URL + "api/timesheet/getHoursByUserForCurrentMonth";
  private rejectAbsenceUrl: string = BASE_URL + "api/timesheet/rejectAbsence";
  private updateAbsenceStatusFromClientUrl: string =
    BASE_URL + "api/timesheet/updateAbsenceStatusFromClient";
  private getUserNotificationTasksUrl: string =
    BASE_URL + "api/timesheet/getUserNotificationTasks";
  private addRoleToNotificationTaskUrl: string =
    BASE_URL + "api/timesheet/addRoleToNotificationTask";
  private getFreeRolesUrl: string = BASE_URL + "api/timesheet/getFreeRoles";
  private deleteNotificationTaskRoleUrl: string =
    BASE_URL + "api/timesheet/deleteNotificationTaskRole";
  private createTimeForNotificationUrl: string =
    BASE_URL + "api/timesheet/createTimeForNotification";
  private removeTimeFromNotificationUrl: string =
    BASE_URL + "api/timesheet/removeTimeFromNotification";
  private getUsersWithMomentsUrl: string =
    BASE_URL + "api/timesheet/getUsersWithMoments";
  private getUsersIdsUrl: string = BASE_URL + "api/timesheet/getUsersIds";
  private getPaginateUsersWithMomentsUrl: string =
    BASE_URL + "api/timesheet/getPaginateUsersWithMoments";
  private getUserSummaryUrl: string = BASE_URL + "api/timesheet/getUserSummary";
  private getAbsenceUserDetailsUrl: string =
    BASE_URL + "api/timesheet/getAbsenceUserDetails";
  private updateMomentsUrl: string = BASE_URL + "api/timesheet/updateMoments";
  private getWorkUserDetailsUrl: string =
    BASE_URL + "api/timesheet/getWorkUserDetails";
  private getAllProjectWhereUserWasAddedUrl: string =
    BASE_URL + "api/timesheet/getAllProjectWhereUserWasAdded";
  private getTotalUserDetailsPerDateUrl: string =
    BASE_URL + "api/timesheet/getTotalUserDetailsPerDate";
  private getDisabledDatesForRaportTimeUrl: string =
    BASE_URL + "api/timesheet/getDisabledDatesForRaportTime";
  private allowUserToRaportTimeUrl: string =
    BASE_URL + "api/timesheet/allowUserToRaportTime";
  private createNotificationUrl: string =
    BASE_URL + "api/timesheet/createNotification";
  private createPubilcHolidayUrl: string =
    BASE_URL + "api/timesheet/createPubilcHoliday";
  private getDefaultHolidaysUrl: string =
    BASE_URL + "api/timesheet/getDefaultHolidays";
  private removeDefaultHolidaysUrl: string =
    BASE_URL + "api/timesheet/removeDefaultHolidays";
  private updatePublicHolidayUrl: string =
    BASE_URL + "api/timesheet/updatePublicHoliday";
  private getUserFlexUrl: string = BASE_URL + "api/timesheet/getUserFlex";
  private updateFlexUrl: string = BASE_URL + "api/timesheet/updateFlex";
  private createOrUpdateAbsencePerDateUrl: string =
    BASE_URL + "api/timesheet/createOrUpdateAbsencePerDate";
  private removeAbsenceDateUrl: string =
    BASE_URL + "api/timesheet/removeAbsenceDate";
  private updateClientHasSeenUrl: string =
    BASE_URL + "api/timesheet/updateClientHasSeen";
  private getAllNonApprovedAbsencesUrl: string =
    BASE_URL + "api/timesheet/getAllNonApprovedAbsences";
  private rejectAbsenceWithAttestStatusUrl: string =
    BASE_URL + "api/timesheet/rejectAbsenceWithAttestStatus";
  private createOrUpdateAbsencesPerDateUrl: string =
    BASE_URL + "api/timesheet/createOrUpdateAbsencesPerDate";
  private getUserMileageUrl: string = `${BASE_URL}api/mileage/get`;
  private getUsersWithMomentsPerMonthUrl: string =
    BASE_URL + "api/timesheet/getUsersWithMomentsPerMonth";
  private createAbsenceCommentUrl: string =
    BASE_URL + "api/timesheet/createAbsenceComment";
  private updateOpenedStatusUrl: string =
    BASE_URL + "api/timesheet/updateOpenedStatus";
	private createNotificationDevInternalUrl:string =
  BASE_URL + 'api/timesheet/createNotificationDevInternal';
  private handleAbsenceStatusUrl: string = `${BASE_URL}api/timesheet/handleAbsenceStatus`;
  private getTimesheetsAbsenceLimitedUrl: string =`${BASE_URL}api/timesheet/getTimesheetsAbsenceLimited`;
  private getUserDetailsPaidAbsenceStatsUrl: string = `${BASE_URL}api/timesheet/getUserDetailsPaidAbsenceStats`;
  private getSalarySystemUrl: string = `${BASE_URL}api/timesheet/getSalarySystem`;
  private updateSalaryCodeUrl: string = `${BASE_URL}api/timesheet/updateSalaryCode`;
  private getCompanyWageTypeUrl: string = `${BASE_URL}api/timesheet/getCompanyWageType`;
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest",
    });
  }

  private updateAbsenceTypeStatUrl: string = `${BASE_URL}api/timesheet/updateAbsenceTypeStat`;
  updateAbsenceTypeStat(data) {
    return this.http
    .post(this.updateAbsenceTypeStatUrl, data, { headers: this.headers })
    .pipe(
      map((response) => {
        if (response["status"]) {
          return { status: true };
        }
        return of({ status: false });
      }),
      catchError(() => of({ status: false }))
    ).toPromise2();
  }

  private getWageTypesUrl: string = `${BASE_URL}api/timesheet/getWageTypes`;
  getWageTypes() {
    return this.http
    .get(`${this.getWageTypesUrl}`, { headers: this.headers })
    .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  private getEmailLogsForPayrollUrl: string = `${BASE_URL}api/timesheet/getEmailLogsForPayroll`;
  getEmailLogsForPayroll() {
    return this.http
    .get(`${this.getEmailLogsForPayrollUrl}`, { headers: this.headers })
    .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  handleAbsenceStatus(data) {
    return this.http
      .post(this.handleAbsenceStatusUrl, data, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return of({ status: false });
        }),
        catchError(() => of({ status: false }))
      );
  }

  private sendPayrollUrl: string =
  BASE_URL + "api/timesheet/sendPayroll";

  sendPayroll(data) {
    return this.http
      .post(this.sendPayrollUrl, data, { headers: this.headers })
      .pipe(
        map((response) => response["status"]),
        catchError(() => of(false))
      );
  }

  createTimesheet(data) {
    return this.http
      .post(this.createTimesheetUrl, data, { headers: this.headers })
      .pipe(
        map((response) => response["status"]),
        catchError(() => of(false))
      );
  }

  createMileage(data) {
    return this.http
      .post(this.createMileageUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getMileages(id) {
    return this.http
      .get(`${this.getMileagesUrl}/${id}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  removeMileage(id) {
    return this.http
      .post(`${this.removeMileageUrl}/${id}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  createAbsence(obj) {
    return this.http
      .post(this.createAbsenceUrl, obj, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  changeRequestAbsence(obj) {
    return this.http
      .post(this.requestChangeAbsenceUrl, obj, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getAbsenceTypes() {
    return this.http
      .get(this.getAbsenceTypesUrl, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public updateAbsenceTypeColor(absenceID: number, color: string) {
    return this.http
      .post(
        `${this.updateAbsenceTypeColorUrl}/${absenceID}`,
        { color },
        { headers: this.headers }
      )
      .pipe(catchError(() => of({ status: false })));
  }

  getMileageTypes() {
    return this.http
      .get(this.getMileageTypesUrl, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  private getActiveMileageTypesUrl: string =
  BASE_URL + "api/timesheet/getActiveMileageTypes";

  getActiveMileageTypes() {
    return this.http
      .get(this.getActiveMileageTypesUrl, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public updateAbsenceType(data) {
    return this.http
      .post(this.updateAbsenceTypeUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public updateMileageType(data) {
    return this.http
      .post(this.updateMileageTypeUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  createNewAbsenceType(data) {
    return this.http
      .post(this.createNewAbsenceTypeUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  createNewMileageType(data) {
    return this.http
      .post(this.createNewMileageTypeUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  deleteAbsenceType(unit_id: number) {
    return this.http
      .get(`${this.deleteAbsenceTypeUrl}/${unit_id}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  deleteMileageType(unit_id: number) {
    return this.http
      .get(`${this.deleteMileageTypeUrl}/${unit_id}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getTimesheets(date): Promise<any> {
    return this.http
      .get(`${this.getTimesheetsUrl}/${date}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  getTimesheetsImp(data) {
    return this.http
      .post(this.getTimesheetsImpUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  removeAbsenceFromTimesheet(moment) {
    return this.http
      .post(this.removeAbsenceFromTimesheetUrl, moment, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }
  removeMoment(moment) {
    return this.http
      .post(this.removeMomentUrl, moment, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  updatePopularMomentForProject(data) {
    return this.http
      .post(this.updatePopularMomentForProjectUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  setTimesheetsToCalendar(first_date, last_date) {
    return this.http
      .get(`${this.setTimesheetsToCalendarUrl}/${first_date}/${last_date}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })))
      .toPromise2();
  }

  getProjectMoments(project_id) {
    return this.http
      .get(`${this.getProjectMomentsUrl}/${project_id}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getProjectMomentsImp(data) {
    return this.http
      .post(`${this.getProjectMomentsImpUrl}`, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getTimesheetMoments() {
    return this.http
      .get(this.getTimesheetMomentsUrl, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getTimesheetsAbsences() {
    return this.http
      .get(this.getTimesheetsAbsenceUrl, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getUserRoles() {
    return this.http
      .get(this.getUserRolesUrl, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getUserRolesImp(data) {
    return this.http
      .post(this.getUserRolesImpUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getUserMessages(date, content_type) {
    return this.http
      .get(`${this.getUserMessagesUrl}/${date}/${content_type}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  createUserMessage(object) {
    return this.http
      .post(this.createUserMessageUrl, object, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  disapproveRaportingTimeForDay(object) {
    return this.http
      .post(this.disapproveRaportingTimeForDayUrl, object, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  createNewTimesheet(object) {
    return this.http
      .post(this.createNewTimesheetUrl, object, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  deleteUserMessage(ID: number) {
    return this.http
      .get(`${this.deleteUserMessageUrl}/${ID}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public userScheduleRole(
    orderTime,
    roleId,
    deleteItem,
    DaysBeforeToday,
    DaysAfterToday,
    cronTimes
  ) {
    const data = {
      orderTime,
      cronTimes,
      roleId,
      deleteItem,
      DaysBeforeToday,
      DaysAfterToday,
    };
    return this.http
      .post(this.userScheduleRoleUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getUserScheduleRole() {
    return this.http
      .get(this.getUserScheduleRolesUrl, { headers: this.headers })
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

  public updateUserScheduleRole(data) {
    return this.http
      .post(this.updateUserScheduleRoleUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  removeOldAbsence(absence) {
    return this.http
      .post(this.removeAbsenceUrl, absence, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  updateUserMileages(data) {
    return this.http
      .post(this.updateUserMileagesUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getUserTimesheets(id) {
    return this.http
      .get(`${this.getUserTimesheetsUrl}/${id}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getUserAbsences(id) {
    return this.http
      .get(`${this.getUserAbsencesUrl}/${id}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getTimesheetMomentsPerUser(user_id) {
    return this.http
      .get(`${this.getTimesheetMomentsPerUserUrl}/${user_id}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  getAllTimesheets() {
    return this.http
      .get(this.getAllTimesheetsUrl, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }
  getAllAbsenceTimesheets() {
    return this.http
      .get(this.getAllAbsenceTimesheetsUrl, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  approveAbsence(absence) {
    return this.http
      .post(this.approveAbsenceUrl, absence, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  setAbsenceForUser(absence) {
    return this.http
      .post(this.setAbsenceForUserUrl, absence, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  disapproveEditingAbsence(absence) {
    return this.http
      .post(this.disapproveEditingAbsenceUrl, absence, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getProjectManagerProjects(userId) {
    return this.http
      .get(`${this.getProjectManagerProjectsUrl}/${userId}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  getSchemaProjects(userId, first_date, last_date) {
    return this.http
      .get(
        `${this.getSchemaProjectsUrl}/${userId}/${first_date}/${last_date}`,
        { headers: this.headers }
      )
      .pipe(catchError(() => of({ status: false })))
      .toPromise2();
  }

  getHoursByUserForCurrentMonth(userId, month, year) {
    return this.http
      .get(
        `${this.getHoursByUserForCurrentMonthUrl}/${userId}/${month}/${year}`,
        { headers: this.headers }
      )
      .pipe(catchError(() => of({ status: false })));
  }

  rejectAbsence(data) {
    return this.http
      .post(this.rejectAbsenceUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  updateAbsenceStatusFromClient(data) {
    return this.http
      .post(this.updateAbsenceStatusFromClientUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getUserNotificationTasks() {
    return this.http
      .get(this.getUserNotificationTasksUrl, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  addRoleToNotificationTask(data) {
    return this.http
      .post(this.addRoleToNotificationTaskUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getFreeRoles() {
    return this.http
      .get(this.getFreeRolesUrl, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  deleteNotificationTaskRole(id) {
    return this.http
      .post(this.deleteNotificationTaskRoleUrl, id, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  createTimeForNotification(obj) {
    return this.http
      .post(this.createTimeForNotificationUrl, obj, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  removeTimeFromNotification(id) {
    return this.http
      .get(`${this.removeTimeFromNotificationUrl}/${id}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getUsersWithMoments({ first_date, last_date, offset, searchValue, projectId, limit, type_id, ue_id }) {

    return this.http
      .get(
        `${this.getUsersWithMomentsUrl}/${first_date}/${last_date}/${offset}/${projectId}/${limit}/${type_id}/${ue_id}?searchValue=${searchValue}`,
        { headers: this.headers }
      )
      .pipe(catchError(() => of({ status: false })));
  }

  getUsersIds(user_id) {
    return this.http
      .get(`${this.getUsersIdsUrl}/${user_id}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getPaginateUsersWithMoments(start_date, last_date, offsetNumber) {
    return this.http
      .get(
        `${this.getPaginateUsersWithMomentsUrl}/${start_date}/${last_date}/${offsetNumber}`,
        { headers: this.headers }
      )
      .pipe(catchError(() => of({ status: false })));
  }

  getUserSummary(id, date) {
    return this.http
      .get(`${this.getUserSummaryUrl}/${id}/${date}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getAbsenceUserDetails(user_id, date) {
    return this.http
      .get(`${this.getAbsenceUserDetailsUrl}/${user_id}/${date}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  getWorkUserDetails(user_id, date) {
    return this.http
      .get(`${this.getWorkUserDetailsUrl}/${user_id}/${date}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  getTotalUserDetailsPerDate(user_id, date) {
    return this.http
      .get(`${this.getTotalUserDetailsPerDateUrl}/${user_id}/${date}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  updateMoments(project_id) {
    return this.http
      .post(this.updateMomentsUrl, project_id, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getAllProjectWhereUserWasAdded(user_id) {
    return this.http
      .get(`${this.getAllProjectWhereUserWasAddedUrl}/${user_id}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  getDisabledDatesForRaportTime(user_id) {
    return this.http
      .get(`${this.getDisabledDatesForRaportTimeUrl}/${user_id}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  allowUserToRaportTime(user) {
    return this.http
      .post(this.allowUserToRaportTimeUrl, user, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  createNotification(object): Promise<any> {
    return this.http
      .post(this.createNotificationUrl, object, { headers: this.headers })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  createPubilcHoliday(data) {
    return this.http
      .post(this.createPubilcHolidayUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getDefaultHolidays() {
    return this.http
      .get(`${this.getDefaultHolidaysUrl}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  removeDefaultHolidays(id) {
    return this.http
      .post(this.removeDefaultHolidaysUrl, id, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  updatePublicHoliday(data) {
    return this.http
      .post(this.updatePublicHolidayUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getUserFlex(userId) {
    return this.http
      .get(`${this.getUserFlexUrl}/${userId}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  updateFlex(data) {
    return this.http
      .post(this.updateFlexUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  updateUserHasSeen(info: { UserAbsenceId: number }) {
    return this.http
      .post(this.updateClientHasSeenUrl, info, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  createOrUpdateAbsencePerDate(object) {
    return this.http
      .post(this.createOrUpdateAbsencePerDateUrl, object, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  createOrUpdateAbsencesPerDate(data) {
    return this.http
      .post(this.createOrUpdateAbsencesPerDateUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  removeAbsenceDate(id) {
    return this.http
      .post(this.removeAbsenceDateUrl, id, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getAllNonApprovedAbsences(userId, projectId) {
    return this.http
      .get(`${this.getAllNonApprovedAbsencesUrl}/${projectId}/${userId}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  rejectAbsenceWithAttestStatus(UserAbsenceID) {
    return this.http
      .post(`${this.rejectAbsenceWithAttestStatusUrl}`, UserAbsenceID, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }
  getUserMileage(id, month, year) {
    return this.http
      .get(`${this.getUserMileageUrl}/${id}/${month}/${year}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }
  getUsersWithMomentsPerMonth(first_date, last_date) {
    return this.http
      .get(
        `${this.getUsersWithMomentsPerMonthUrl}/${first_date}/${last_date}`,
        { headers: this.headers }
      )
      .pipe(catchError(() => of({ status: false })));
  }

  createAbsenceComment(data) {
    return this.http
      .post(`${this.createAbsenceCommentUrl}`, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  updateOpenedStatus(obj): Promise<any> {
    return this.http
      .post(`${this.updateOpenedStatusUrl}`, obj, { headers: this.headers })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  createNotificationDevInternal(object) {

    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.createNotificationDevInternalUrl, object, {headers: headers, reportProgress: true, observe: 'events'});
  }
  getTimesheetsAbsencesLimited(first_date, last_date) {


    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.get(`${this.getTimesheetsAbsenceLimitedUrl}/${first_date}/${last_date}`, {headers: headers})
      .toPromise2()
  }

  getUserDetailsPaidAbsenceStats(formData) {
    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.get(`${this.getUserDetailsPaidAbsenceStatsUrl}/${formData.date}/${formData.userId}`, {headers: headers})
      .toPromise2();
  }

  getSalarySystem() {
    return this.http
      .get(this.getSalarySystemUrl, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  updateSalaryCode(obj) {

    return this.http
      .post(
        `${this.updateSalaryCodeUrl}`, obj, { headers: this.headers }
      )
      .pipe(catchError(() => of({ status: false })));
  }

  getCompanyWageType() {
    return this.http
      .get(
        `${this.getCompanyWageTypeUrl}`,
        { headers: this.headers }
      )
      .pipe(catchError(() => of({ status: false })));
  }
}
