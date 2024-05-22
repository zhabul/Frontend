import { Injectable } from "@angular/core";

import { BASE_URL } from "../../config/index";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject } from "rxjs";
import { SendData } from "src/app/canvas-ui/models/SendData";
import { PlannedAbsence } from "src/app/moments/project-moments/resource-planning-app/models/PlannedAbsence";
import "src/app/core/extensions/rxjs-observable-promise";

@Injectable({
  providedIn: "root",
})
export class ProjectsService {
  private getAllUrl: string = BASE_URL + "api/projects/list";
  private getProjectUrl: string = BASE_URL + "api/projects/get";
  private getParentProjectUrl: string = BASE_URL + "api/projects/getParentProject";
  private getEnabledAccountsUrl: string =
    BASE_URL + "api/projects/getEnabledAccounts";
  private getAllActiveProjectsAndSubProjectsUrl: string =
    BASE_URL + "api/projects/getAllActiveProjectsAndSubProjects";
  private newProjectUrl: string = BASE_URL + "api/projects/new";
  private updateProjectUrl: string = BASE_URL + "api/projects/update";
  private removeProjectUrl: string = BASE_URL + "api/projects/remove";
  private statusProjectUrl: string = BASE_URL + "api/projects/status";
  private getMajorProjectsUrl: string = BASE_URL + "api/projects/majorprojects";
  private updateProjectPaymenttUrl: string =
    BASE_URL + "api/projects/updatePayment";
  private updateProjectUserPermissiontUrl: string =
    BASE_URL + "api/projects/updateProjecUserPermission";
  private getConstructionFormUrl: string =
    BASE_URL + "api/projects/constructionForm";
  private getDebitFormUrl: string = BASE_URL + "api/projects/getDebitForm";
  private getDebitFormForAtaUrl: string =
    BASE_URL + "api/projects/getDebitFormForAta";
  private getProjectRegisterUrl: string =
    BASE_URL + "api/projects/getProjectRegister";
  private newProjectRegisterCategoryUrl: string =
    BASE_URL + "api/projects/NewProjectRegisterCategory";
  private getRegisterCategoryItemsUrl: string =
    BASE_URL + "api/projects/getRegisterCategoryItems";
  private removeRegisterCategoryUrl: string =
    BASE_URL + "api/projects/removeRegisterCategory";
  private removeRegisterCategoryItemsUrl: string =
    BASE_URL + "api/projects/removeRegisterCategoryItems";
  private addCategoryWorkersUrl: string =
    BASE_URL + "api/projects/addCategoryWorkers";
  private getCategoryWorkersUrl: string =
    BASE_URL + "api/projects/getCategoryWorkers";
  private removeClientWorkerFromCategoryUrl: string =
    BASE_URL + "api/projects/workers/removeClientWorkerFromCategory";
  private createCompanyUrl: string = BASE_URL + "api/projects/createCompany";
  private createCompanyEmployeeUrl: string =
    BASE_URL + "api/projects/createCompanyEmployee";
  private removeCompanyUrl: string = BASE_URL + "api/projects/removeCompany";
  private newSubProjectRegisterCategoryUrl: string =
    BASE_URL + "api/projects/newSubProjectRegisterCategory";
  private getNextProjectNumberUrl: string =
    BASE_URL + "api/projects/getNextProjectNumber";
  private checkIfProjectNumberIsTakenUrl: string =
    BASE_URL + "api/projects/checkIfProjectNumberIsTaken";
  private getCurrentUserProjectsUrl: string =
    BASE_URL + "api/projects/getCurrentUserProjects";
  private getAllActiveDateProjectsUrl: string =
    BASE_URL + "api/projects/getAllActiveDateProjects";
  private addUserOnProjectUrl: string =
    BASE_URL + "api/projects/addUserOnProject";
  private switchUserToOtherProjectUrl: string =
    BASE_URL + "api/projects/switchUserToOtherProject";
  private removeUserFromProjectUrl: string =
    BASE_URL + "api/projects/removeUserFromProject";
  private createScheduleDateUrl: string =
    BASE_URL + "api/projects/createScheduleDate";
  private updateScheduleDateUrl: string =
    BASE_URL + "api/projects/updateScheduleDate";
  private getAllActiveDateProjectsWithMomentsUrl: string =
    BASE_URL + "api/projects/getAllActiveDateProjectsWithMoments";
  private getProjectWithMomentsUrl: string =
    BASE_URL + "api/projects/getProjectWithMoments";
  private getChildrenProjectPlansUrl: string =
    BASE_URL + "api/projects/getChildrenProjectPlans";
  private getProjectArbitraryDatesUrl: string =
    BASE_URL + "api/projects/getProjectArbitraryDates";
  private getAllProjectPlanNumberOfCoworkersUrl: string =
    BASE_URL + "api/projects/getAllProjectPlanNumberOfCoworkers";
  private getProjectActiveClientWorkersUrl: string =
    BASE_URL + "api/projects/getProjectActiveClientWorkers";
  private getAttestClientWorkersUrl: string =
    BASE_URL + "api/projects/getAttestClientWorkers";
  private updateNumberOfCoworkersUrl: string =
    BASE_URL + "api/projects/updateNumberOfCoworkers";
  private getHoursForAtestUrl: string =
    BASE_URL + "api/projects/getHoursForAtest";
  private getHoursForAtestHistoryUrl: string =
    BASE_URL + "api/projects/getHoursForAtestHistory";
  private updateHoursForAtestUrl: string =
    BASE_URL + "api/projects/updateHoursForAtest";
  private getAcceptedWeeklyReportsUrl: string =
    BASE_URL + "api/projects/getAcceptedWeeklyReports";
  private getAcceptedWeeklyReportUrl: string =
    BASE_URL + "api/projects/getAcceptedWeeklyReport";
  private addUsersOnProjectUrl: string =
    BASE_URL + "api/projects/addUsersOnProject";
  private getMaterialsUrl: string = BASE_URL + "api/projects/getMaterials";
  private getWorksUrl: string = BASE_URL + "api/projects/getWork";
  private addUserToProjectFromPermitUrl: string =
    BASE_URL + "api/projects/addUserToProjectFromPermit";
  private sortProjectWithMomentsUrl: string =
    BASE_URL + "api/projects/sortProjectWithMoments";
  private getWeeklyReportsUrl: string =
    BASE_URL + "api/projects/getWeeklyReports";
  private updateWeeklyReportUrl: string =
    BASE_URL + "api/projects/updateWeeklyReport";
  private sendWeeklyReportUrl: string =
    BASE_URL + "api/projects/sendWeeklyReport";
  private printPdfUrl: string = BASE_URL + "api/projects/printPdf";
  private getProjectUsersUrl: string =
    BASE_URL + "api/projects/getProjectUsers";
  private addUserToChildProjectUrl: string =
    BASE_URL + "api/projects/addUserToChildProject";
  private getChildrenProjectUsersUrl: string =
    BASE_URL + "api/projects/getChildrenProjectUsers";
  private getUnderProjectsUrl: string =
    BASE_URL + "api/projects/getUnderProjects";
  private getAssingedProjectUrl: string =
    BASE_URL + "api/projects/getAssingedProjects";
  private getSubProjectsUrl: string = BASE_URL + "api/projects/getSubProjects";
  private getWeeksThatHaveWeeklyReportUrl: string =
    BASE_URL + "api/projects/getWeeksThatHaveWeeklyReport";
  private updateAtestMomentUrl: string =
    BASE_URL + "api/projects/updateAtestMoment";
  private revertAtestUrl: string = BASE_URL + "api/projects/revertAtest";
  private getAllMomentsForWeeklyReportWithoutManualUrl: string =
    BASE_URL + "api/projects/getAllMomentsForWeeklyReportWithoutManual";
  private updateAtestCommentUrl: string =
    BASE_URL + "api/projects/updateAtestComment";
  private updateMomentCommentUrl: string =
    BASE_URL + "api/projects/updateMomentComment";
  private getWeekReportForApproval: string =
    BASE_URL + "api/weeklyreport/approval";
  private getProjectActiveCompanyWorkersUrl: string =
    BASE_URL + "api/projects/getProjectActiveCompanyWorkers";
  private getProjectActiveCompanyWorkersForSubProjectUrl: string =
    BASE_URL + "api/projects/getProjectActiveCompanyWorkersForSubProject";
  private getProjectInformationActiveCompanyWorkersUrl: string =
    BASE_URL + "api/projects/getProjectInformationActiveCompanyWorkers";
  private getAllProjectCoworkersUrl: string =
    BASE_URL + "api/projects/getAllProjectCoworkers";
  private getProjectMomentsForAtestUrl: string =
    BASE_URL + "api/projects/getProjectMomentsForAtest";
  private getClientAttestHistoryUrl: string =
    BASE_URL + "api/projects/getClientAttestHistory";
  private deleteWeeklyReportUrl: string =
    BASE_URL + "api/projects/deleteWeeklyReport";
  private getSupplierInvoiceRowsUrl: string =
    BASE_URL + "api/projects/getSupplierInvoiceRows";
  private updateSupplierInvoiceRowsUrl: string =
    BASE_URL + "api/projects/updateSupplierInvoiceRows";
  private removeSupplierInvoiceRowsUrl: string =
    BASE_URL + "api/projects/removeSupplierInvoiceRows";
  private getSupplierInvoiceUrl: string =
    BASE_URL + "api/projects/getSupplierInvoice";
  private getSupplierInvoiceStatusesUrl: string =
    BASE_URL + "api/projects/getSupplierInvoiceStatuses";
  private getNotSendWeeklyReportsUrl: string =
    BASE_URL + "api/projects/getNotSendWeeklyReports";
  private getWeeklyReportByWrIdUrl: string =
    BASE_URL + "api/weeklyreport/getWeeklyReportByWrId";
  private approveWeeklyReportAsAdminUrl: string =
    BASE_URL + "api/weeklyreport/approveAsAdmin";
  private declineWeeklyReportAsAdminUrl: string =
    BASE_URL + "api/weeklyreport/declineAsAdmin";

  public getEmailLogsForWeeklyReportUrl: string =
    BASE_URL + "api/projects/getEmailLogsForWeeklyReport";
  public getWeeklyReportsWithLogsUrl: string =
    BASE_URL + "api/projects/getWeeklyReportsWithLogs";
  private getProjectsForInvoiceUrl: string =
    BASE_URL + "api/projects/getProjectsForInvoice";
  private getSupplierInoviceFromDatabaseResolverServiceUrl: string =
    BASE_URL + "api/projects/getSupplierInovice";
  private enableEditAtestUrl: string =
    BASE_URL + "api/projects/enableEditAtest";
  private getSupplierInvoicesPdfDocumentsUrl: string =
    BASE_URL + "api/projects/getSupplierInvoicesPdfDocuments";
  private getWeeksThatHaveWeekyReportForAtaUrl: string =
    BASE_URL + "api/projects/getWeeksThatHaveWeekyReportForAta";
  private getProjectsForAllSupplierInvoicesDropdownUrl: string =
    BASE_URL + "api/projects/getProjectsForAllSupplierInvoicesDropdown";
  private getSupplierInvoiceForDUUrl: string =
    BASE_URL + "api/projects/getSupplierInvoiceForDU";
  private accountingPlansUrl: string =
    BASE_URL + "api/projects/accountingPlans";
  private getAllProjectsAndSubProjectsUrl: string =
    BASE_URL + "api/projects/getAllProjectsAndSubProjects";
  private updateDateForPermitUrl: string =
    BASE_URL + "api/projects/updateDateForPermit";
  private getProjectUserDetailsUrl: string =
    BASE_URL + "api/projects/getProjectUserDetails";
  private getAllAvailableProjectWorkersUrl: string =
    BASE_URL + "api/projects/getAllAvailableProjectWorkers";
  private getAllActivitiesUrl: string =
    BASE_URL + "api/projects/getAllActivities";
  private getActiveActivitiesUrl: string =
    BASE_URL + "api/projects/getActiveActivities";
  private createActivityUrl: string = BASE_URL + "api/projects/createActivity";
  private updateActivityUrl: string = BASE_URL + "api/projects/updateActivity";
  private deleteActivityUrl: string = BASE_URL + "api/projects/deleteActivity";
  private getActivityProjectsUrl: string =
    BASE_URL + "api/projects/getActivityProjects";
  private getWorkerAllActivitiesUrl: string =
    BASE_URL + "api/projects/getWorkerAllActivities";
  public getProjectAdditionalWorkUrl: string =
    BASE_URL + "api/projects/getProjectAdditionalWork";
  public getAllProjectArticleMaterialsUrl: string =
    BASE_URL + "api/projects/getAllProjectArticleMaterials";
  public getAllProjectWeekyReportsUrl: string =
    BASE_URL + "api/projects/getAllProjectWeekyReports";
  public getUserRaportStatusUrl: string =
    BASE_URL + "api/projects/getUserRaportStatus";
  private getStatisticWeeklyReportsUrl: string =
    BASE_URL + "api/projects/getStatisticWeeklyReports";
  public getProjectsAndSubProjectsAndAtasUrl: string =
    BASE_URL + "api/projects/getProjectsAndSubProjectsAndAtas";
  public getProjectsForPlanningUrl: string =
    BASE_URL + "api/projects/getProjectsForPlanning";
  public getAllUsersForPlanningUrl: string =
    BASE_URL + "api/projects/getAllUsersForPlanning";
  public getAllUnassignedUsersForPlanningUrl: string =
    BASE_URL + "api/projects/getAllUnassignedUsersForPlanning";
  public updateProjectSegmentUrl: string =
    BASE_URL + "api/projects/updateProjectSegment";
  public updateDateSegmentUrl: string =
    BASE_URL + "api/projects/updateDateSegment";
  public updateAbsenceSegmentUrl: string =
    BASE_URL + "api/projects/updateAbsenceSegment";
  public createAbsenceSegmentUrl: string =
    BASE_URL + "api/projects/createAbsenceSegment";
  public addUserToProjectFromPlanningUrl: string =
    BASE_URL + "api/projects/addUserToProjectFromPlanning";
  public addDateSegmentToUserFromPlanningUrl: string =
    BASE_URL + "api/projects/addDateSegmentToUserFromPlanning";
  public addPlanningResourceWeeksToProjectUrl: string =
    BASE_URL + "api/projects/addPlanningResourceWeeksToProject";
  public removePlanningResourceWeeksToProjectUrl: string =
    BASE_URL + "api/projects/removePlanningResourceWeeksToProject";
  public updatePlanningResourceWeekUrl: string =
    BASE_URL + "api/projects/updatePlanningResourceWeek";
  public updateResourcePlanningUserSortIndexAndProjectIdUrl: string =
    BASE_URL + "api/projects/updateResourcePlanningUserSortIndexAndProjectId";
  public getPublicHolidayDatesUrl: string =
    BASE_URL + "api/projects/getPublicHolidayDates";
  public getAllResourcePlanningColumnsUrl: string =
    BASE_URL + "api/projects/getAllResourcePlanningColumns";
  public addResourcePlanningColumnUrl: string =
    BASE_URL + "api/projects/addResourcePlanningColumn";
  public updateResourcePlanningColumnValueColumnIdsWithNewColumnIdUrl: string =
    BASE_URL +
    "api/projects/updateResourcePlanningColumnValueColumnIdsWithNewColumnId";
  public hideResourcePlanningColumnUrl: string =
    BASE_URL + "api/projects/hideResourcePlanningColumn";
  public showResourcePlanningColumnUrl: string =
    BASE_URL + "api/projects/showResourcePlanningColumn";
  public removeResourcePlanningColumnUrl: string =
    BASE_URL + "api/projects/removeResourcePlanningColumn";
  public updateColumnFromPlanningUrl: string =
    BASE_URL + "api/projects/updateColumnFromPlanning";
  public updateResourcePlanningColumnWidthUrl: string =
    BASE_URL + "api/projects/updateResourcePlanningColumnWidth";
  public updateResourcePlanningColumnSortIndexUrl: string =
    BASE_URL + "api/projects/updateResourcePlanningColumnSortIndex";
  public updateColumnValueFromResourcePlanningUrl: string =
    BASE_URL + "api/projects/updateColumnValueFromResourcePlanning";
  private getProjectDUImagesUrl: string =
    BASE_URL + "api/projects/getProjectDUImages";
  private getProjectDocumentsUrl: string =
    BASE_URL + "api/projects/getProjectDocuments";
  private addResourcePlanningSendMessageUrl: string =
    BASE_URL + "api/projects/addResourcePlanningSendMessage";
  private sendResourcePlanningChangeMessagesToUsersUrl: string =
    BASE_URL + "api/projects/sendResourcePlanningChangeMessagesToUsers";
  private getResourcePlanningSaveAndSendDatetimeUrl: string =
    BASE_URL + "api/projects/getResourcePlanningSaveAndSendDatetime";
  private removeDateSegmentFromResourcePlanningUrl: string =
    BASE_URL + "api/projects/removeDateSegmentFromResourcePlanning";
  private setProjectCountAsResourcesUrl: string =
    BASE_URL + "api/projects/setProjectCountAsResources";
  private changeUserStylePropertyUrl: string =
    BASE_URL + "api/projects/changeUserStyleProperty";
  private getAvailableKSorDUUrl: string =
    BASE_URL + "api/projects/getAvailableKSorDU";
  private removeSelectedDocumentsDUUrl: string =
    BASE_URL + "api/projects/removeSelectedDocumentsDU";
  private get_last_email_log_but_first_clientUrl: string =
    BASE_URL + "api/user/get_last_email_log_but_first_client";
  private createDataAsJsonUrl: string =
    BASE_URL + "api/projects/createDataAsJson";
  private getDataAsJsonUrl: string = BASE_URL + "api/projects/getDataAsJson";
  private updateDataAsJsonUrl: string =
    BASE_URL + "api/projects/updateDataAsJson";
  private getAllPlanedAbsencesUrl: string =
    BASE_URL + "api/projects/absence/resource/get";
  private addPlanedAbsencesUrl: string =
    BASE_URL + "api/projects/absence/resource/add";
  private deletePlanedAbsencesUrl: string =
    BASE_URL + "api/projects/absence/resource/delete";
  private getSupplierInovicesForWeeklyReportUrl: string =
    BASE_URL + "api/weeklyreport/getSupplierInovicesForWeeklyReport";
  private get_project_and_sub_project_name_id_and_custom_name_by_project_idUrl: string =
    BASE_URL +
    "api/projects/get_project_and_sub_project_name_id_and_custom_name_by_project_id";
  private getDocumentsUrl: string = BASE_URL + "api/projects/getDocuments";
  private getAllDocumentsUrl: string =
    BASE_URL + "api/projects/getAllDocuments";
  private getWeeklyReportDocumentsUrl: string =
    BASE_URL + "api/projects/getWeeklyReportDocuments";
  public register = new Subject<any>();
  public currentTabRememberer: number = 1;
  public currentParentId: number = 0;
  public updateProjectPrognosisUrl: string = BASE_URL + "api/projects/updateProjectPrognosis";
  private revertAtestByIDSUrl: string = BASE_URL + "api/projects/revertAtestByIDS";
  private updateMomentSeenUrl: string = BASE_URL + "api/projects/updateMomentSeen";
  private get_weekly_reports_url: string = BASE_URL + "api/weeklyreport/get_all_weekly_reports";
  private sendWeeklyReportsUrl: string = BASE_URL + "api/weeklyreport/sendWeeklyReports";
  private getWeeklyReportsForSelectUrl: string = BASE_URL + "api/weeklyreport/getWeeklyReportsForSelect";
  private updateOrCreateCustomCommentUrl: string = BASE_URL + "api/projects/updateOrCreateCustomComment";
  public getProjectsForAnalysisUrl: string = BASE_URL + "api/projects/getProjectsForAnalysis";
  private getAllProjectsForAnalysisUrl: string = BASE_URL + "api/projects/getAllProjectsForAnalysis";
  private getProjectsAndActivitiesForCalendarUrl: string = BASE_URL + "api/projects/getProjectsAndActivitiesForCalendar";
  private getAllProjectsForAnalysis2Url: string = BASE_URL + "api/projects/getAllProjectsForAnalysis2";
  private getProjectRelationUrl: string = BASE_URL + "api/projects/getProjectRelation";

  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest",
    });
  }

  public getAllPlanedAbsences() {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getAllPlanedAbsencesUrl}`, { headers: headers })
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["data"];
        }
        return [];
      })
      .catch((err) => {
        return [];
      });
  }

  public addPlanedAbsences(object: PlannedAbsence) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(this.addPlanedAbsencesUrl, object, { headers: headers })
      .toPromise2()
      .then((response) => response)
      .catch((err) => {
        return { status: false };
      });
  }

  public deletePlanedAbsences(id: number) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.deletePlanedAbsencesUrl}/${id}`, { headers: headers })
      .toPromise2()
      .then((response) => response)
      .catch((err) => {
        return { status: false };
      });
  }

  public getProjects(page = 0) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getAllUrl}/${page}`, { headers: headers })
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["data"];
        }
        return [];
      })
      .catch((err) => {
        return [];
      });
  }

  public getAllProjectsAndSubProjects() {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getAllProjectsAndSubProjectsUrl}`, { headers: headers })
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["data"];
        }
        return [];
      })
      .catch((err) => {
        return [];
      });
  }

  public getProject(projectid: number): Promise<any> {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getProjectUrl}/${projectid}`, { headers: headers })
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["data"] as any;
        }
        return null;
      });
  }

  public getParentProject(projectid: number): Promise<any> {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getParentProjectUrl}/${projectid}`, { headers: headers })
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["data"] as any;
        }
        return null;
      });
  }

  public getEnabledAccounts(): Promise<any> {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getEnabledAccountsUrl}`, { headers: headers })
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["data"] as any;
        }
        return null;
      });
  }

  public getProjectWithMoments(projectid: number): Promise<any> {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getProjectWithMomentsUrl}/${projectid}`, {
        headers: headers,
      })
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["data"] as any;
        }
        return null;
      });
  }

  public createProject(project) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(this.newProjectUrl, project, { headers: headers })
      .toPromise2()
      .then((response) => response)
      .catch((err) => {
        return { status: false };
      });
  }

  public updateProject(project) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(this.updateProjectUrl, project, { headers: headers })
      .toPromise2()
      .then((response) => response)
      .catch((err) => {
        return { status: false };
      });
  }

  public removeProject(projectid: number): Promise<any> {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.removeProjectUrl}/${projectid}`, { headers: headers })
      .toPromise2()
      .then((response) => response);
  }

  searchByStatus(parent_id, date, status, person, search_text) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http.post(
      this.statusProjectUrl,
      { parent_id, date, status, person, search_text },
      { headers: headers }
    );
  }

  public getMajorProjects() {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(this.getMajorProjectsUrl, { headers: headers })
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["data"];
        }
        return [];
      })
      .catch((err) => {
        return [];
      });
  }

  updatePaymentTypeToProject(payment, project) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    let project_var = {
      project_id: project.id,
      payment: payment,
    };

    if (project.Payment != payment) {
      return this.http
        .post(this.updateProjectPaymenttUrl, project_var, { headers: headers })
        .toPromise2()
        .then((response) => {
          if (project.Payment == "0") project.Payment = "1";
          else project.Payment = "0";
        })
        .catch((err) => {
          return { status: false };
        });
    }
  }

  updateUserPermissionToProject(user_permission, project) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    let project_var = {
      project_id: project.id,
      UserPermission: user_permission,
    };
    return this.http
      .post(this.updateProjectUserPermissiontUrl, project_var, {
        headers: headers,
      })
      .toPromise2();
  }

  public getConstructionForm() {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(this.getConstructionFormUrl, { headers: headers })
      .toPromise2();
  }

  public getDebitForm() {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(this.getDebitFormUrl, { headers: headers })
      .toPromise2();
  }

  public getDebitFormForAta(debit_id, from_new_ata = false, project_debit = 0) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(
        `${this.getDebitFormForAtaUrl}/${debit_id}/${from_new_ata}/${project_debit}`,
        {
          headers: headers,
        }
      )
      .toPromise2();
  }

  public getProjectRegister(projectId) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getProjectRegisterUrl}/${projectId}`, { headers: headers })
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["data"];
        }
        return [];
      })
      .catch((err) => {
        return [];
      });
  }

  createRegisterCategory(projectId, name, supplierId, clientId, parent) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    let project_var = {
      projectId,
      name,
      supplierId,
      clientId,
      parent,
    };
    console.log(project_var);
    return this.http
      .post(this.newProjectRegisterCategoryUrl, project_var, {
        headers: headers,
      })
      .toPromise2();
  }

  getRegisterCategoryItems(categoryId) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getRegisterCategoryItemsUrl}/${categoryId}`, {
        headers: headers,
      })
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["data"];
        }
        return [];
      })
      .catch((err) => {
        return [];
      });
  }
  createRegisterCategoryItems(
    categoryId,
    company,
    firstName,
    lastName,
    roleId
  ) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    let register_var = {
      roleId,
      categoryId,
      company,
      firstName,
      lastName,
    };
    return this.http
      .post(this.newSubProjectRegisterCategoryUrl, register_var, {
        headers: headers,
      })
      .toPromise2();
  }

  public removeRegisterCategory(registerid): Promise<any> {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.removeRegisterCategoryUrl}/${registerid}`, {
        headers: headers,
      })
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["id"];
        }
        return [];
      })
      .catch((err) => {
        return [];
      });
  }

  public removeRegisterCategoryItems(registerid): Promise<any> {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.removeRegisterCategoryItemsUrl}/${registerid}`, {
        headers: headers,
      })
      .toPromise2()
      .then((response) => response)
      .catch((err) => {
        return [];
      });
  }
  public removeClientWorkerFromCategory(workerid: number): Promise<any> {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.removeClientWorkerFromCategoryUrl}/${workerid}`, {
        headers: headers,
      })
      .toPromise2()
      .then((response) => response)
      .catch((err) => {
        return { status: false };
      });
  }

  addCategoryWorkers(categoryId, client_worker, roleInput) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    let register_var = {
      categoryId,
      client_worker,
      roleInput,
    };
    console.log(register_var);
    return this.http
      .post(this.addCategoryWorkersUrl, register_var, { headers: headers })
      .toPromise2()
      .catch((err) => {
        return { status: false };
      });
  }
  getCategoryWorkers(categoryId) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getCategoryWorkersUrl}/${categoryId}`, { headers: headers })
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["data"];
        }
        return [];
      })
      .catch((err) => {
        return [];
      });
  }

  removeCompany(companyId) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.removeCompanyUrl}/${companyId}`, { headers: headers })
      .toPromise2()
      .then((response) => response)
      .catch((err) => {
        return [];
      });
  }

  createCompany(company) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(this.createCompanyUrl, company, { headers: headers })
      .toPromise2();
  }

  createCompanyEmployee(employee) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(this.createCompanyEmployeeUrl, employee, { headers: headers })
      .toPromise2();
  }

  getNextProjectNumber() {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(this.getNextProjectNumberUrl, { headers: headers })
      .toPromise2();
  }

  checkIfProjectNumberIsTaken(number): Promise<any> {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.checkIfProjectNumberIsTakenUrl}/${number}`, {
        headers: headers,
      })
      .toPromise2();
  }

  createSubRegisterCategory(categoryId, parent_id, name, supplierId, clientId) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    let project_var = {
      categoryId,
      parent_id,
      name,
      supplierId,
      clientId,
    };
    return this.http
      .post(this.newSubProjectRegisterCategoryUrl, project_var, {
        headers: headers,
      })
      .toPromise2();
  }

  get getCurrentTab() {
    return this.currentTabRememberer;
  }

  setCurrentTab(where) {
    this.currentTabRememberer = where;
  }

  public getCurrentUserProjects(date) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getCurrentUserProjectsUrl}/${date}`, { headers: headers })
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["data"];
        }
        return [];
      })
      .catch((err) => {
        return [];
      });
  }

  public getAllActiveDateProjects(date) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getAllActiveDateProjectsUrl}/${date}`, { headers: headers })
      .toPromise2();
  }

  addUserOnProject(user, project) {
    let data = {
      userId: user.id,
      projectId: project.id,
    };

    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.http
      .post(this.addUserOnProjectUrl, data, { headers: headers })
      .toPromise2();
  }

  switchUserToOtherProject(project, user, oldProject) {
    let data = {
      projectId: project.id,
      userId: user.id,
      oldProject: oldProject.id,
    };
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.http
      .post(this.switchUserToOtherProjectUrl, data, { headers: headers })
      .toPromise2();
  }

  removeUserFromProject(user, project) {
    let data = {
      projectId: project.id,
      userId: user.id,
    };

    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.http
      .post(this.removeUserFromProjectUrl, data, { headers: headers })
      .toPromise2();
  }

  createScheduleDate(data) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.http
      .post(this.createScheduleDateUrl, data, { headers: headers })
      .toPromise2();
  }

  updateScheduleDate(data) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.http
      .post(this.updateScheduleDateUrl, data, { headers: headers })
      .toPromise2();
  }

  public getAllActiveDateProjectsWithMoments() {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getAllActiveDateProjectsWithMomentsUrl}`, {
        headers: headers,
      })
      .toPromise2();
  }

  getChildrenProjectPlans(projectId, momentId) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getChildrenProjectPlansUrl}/${projectId}/${momentId}`, {
        headers: headers,
      })
      .toPromise2();
  }

  getProjectArbitraryDates() {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(this.getProjectArbitraryDatesUrl, { headers: headers })
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["data"];
        }
        return [];
      })
      .catch((err) => {
        return [];
      });
  }

  getAllActiveProjectsAndSubProjects(id) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getAllActiveProjectsAndSubProjectsUrl}/${id}`, {
        headers: headers,
      })
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["data"];
        }
        return [];
      })
      .catch((err) => {
        return [];
      });
  }

  getAllProjectPlanNumberOfCoworkers() {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getAllProjectPlanNumberOfCoworkersUrl}`, {
        headers: headers,
      })
      .toPromise2();
  }

  getProjectActiveClientWorkers(projectId) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getProjectActiveClientWorkersUrl}/${projectId}`, {
        headers: headers,
      })
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["data"];
        }
        return [];
      });
  }

  getProjectActiveCompanyWorkers(projectId) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getProjectActiveCompanyWorkersUrl}/${projectId}`, {
        headers: headers,
      })
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["data"];
        }
        return [];
      });
  }

  getProjectActiveCompanyWorkersForSubProject(projectId) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(
        `${this.getProjectActiveCompanyWorkersForSubProjectUrl}/${projectId}`,
        {
          headers: headers,
        }
      )
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["data"];
        }
        return [];
      });
  }

  getProjectInformationActiveCompanyWorkers(projectId) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(
        `${this.getProjectInformationActiveCompanyWorkersUrl}/${projectId}`,
        { headers: headers }
      )
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["data"];
        }
        return [];
      });
  }

  getAttestClientWorkers(projectId) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getAttestClientWorkersUrl}/${projectId}`, {
        headers: headers,
      })
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["data"];
        }
        return [];
      });
  }

  updateNumberOfCoworkers(object) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(this.updateNumberOfCoworkersUrl, object, { headers: headers })
      .toPromise2();
  }

  public getHoursForAtest(projectId) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getHoursForAtestUrl}/${projectId}`, { headers: headers })
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["data"];
        }
        return [];
      })
      .catch((err) => {
        return [];
      });
  }

  public updateMomentSeen(projectId) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(this.updateMomentSeenUrl, projectId, { headers: headers })
      .toPromise2();
  }

  public updateHoursForAtest(data) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(this.updateHoursForAtestUrl, data, { headers: headers })
      .toPromise2();
  }

  public getHoursForAtestHistory(object) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(`${this.getHoursForAtestHistoryUrl}`, object, { headers: headers })
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["data"];
        }
        return [];
      })
      .catch((err) => {
        return [];
      });
  }

  public getAcceptedWeeklyReports(projectId) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getAcceptedWeeklyReportsUrl}/${projectId}`, {
        headers: headers,
      })
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["data"];
        }
        return [];
      })
      .catch((err) => {
        return [];
      });
  }

  public getAcceptedWeeklyReport(reportId) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getAcceptedWeeklyReportUrl}/${reportId}`, {
        headers: headers,
      })
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["data"][0];
        }
        return {};
      })
      .catch((err) => {
        return {};
      });
  }

  public getMaterials(projectid: number): Promise<any> {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getMaterialsUrl}/${projectid}`, { headers: headers })
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["data"] as any;
        }
        return null;
      });
  }

  public getWorks(projectid: number): Promise<any> {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getWorksUrl}/${projectid}`, { headers: headers })
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["data"] as any;
        }
        return null;
      });
  }

  public addUsersOnProject(data) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(this.addUsersOnProjectUrl, data, { headers: headers })
      .toPromise2();
  }

  public addUserToProjectFromPermit(data) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(this.addUserToProjectFromPermitUrl, data, { headers: headers })
      .toPromise2();
  }

  public sortProjectWithMoments(moments) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(this.sortProjectWithMomentsUrl, moments, { headers: headers })
      .toPromise2();
  }

  public getWeeklyReports(projectId, year, week) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getWeeklyReportsUrl}/${projectId}/${year}/${week}`, {
        headers: headers,
      })
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["data"];
        }
        return [];
      })
      .catch((err) => {
        return [];
      });
  }

  public sendWeeklyReport(data) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(this.sendWeeklyReportUrl, data, { headers: headers })
      .toPromise2();
  }

  public printPdf(data) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(this.printPdfUrl, data, { headers: headers })
      .toPromise2();
  }

  public updateWeeklyReport(data) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.http
      .post(this.updateWeeklyReportUrl, data, { headers: headers })
      .toPromise2();
  }

  public getWeeklyReportForApproval(reportId, email, cwId, group) {
    const answerEmail = encodeURIComponent(email);
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(
        `${this.getWeekReportForApproval}/${reportId}/${answerEmail}/${cwId}/${group}`,
        { headers: headers }
      )
      .toPromise2();
  }

  public approveWeeklyReport(data, reportId, answerEmail, cwId, group) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(
        `${this.getWeekReportForApproval}/${reportId}/${answerEmail}/${cwId}/${group}`,
        data,
        { headers: headers }
      )
      .toPromise2();
  }
  public approveWeeklyReportAsAdmin(reportId) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.approveWeeklyReportAsAdminUrl}/${reportId}`, {
        headers: headers,
      })
      .toPromise2();
  }

  public declineWeeklyReportAsAdmin(reportId) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.declineWeeklyReportAsAdminUrl}/${reportId}`, {
        headers: headers,
      })
      .toPromise2();
  }

  public getProjectUsers(projectId) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getProjectUsersUrl}/${projectId}`, { headers: headers })
      .toPromise2();
  }

  public addUserToChildProject(data) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(this.addUserToChildProjectUrl, data, { headers: headers })
      .toPromise2();
  }

  public getChildrenProjectUsers(projectParentId, projectId) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(
        `${this.getChildrenProjectUsersUrl}/${projectParentId}/${projectId}`,
        { headers: headers }
      )
      .toPromise2();
  }

  public getUnderProjects(projectId, projectChef) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getUnderProjectsUrl}/${projectId}/${projectChef}`, {
        headers: headers,
      })
      .toPromise2();
  }

  public getAssingedProjects() {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getAssingedProjectUrl}`, { headers: headers })
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["data"];
        }
        return [];
      })
      .catch((err) => {
        return [];
      });
  }

  getSubProjects(projectId, project_chef) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getSubProjectsUrl}/${projectId}/${project_chef}`, {
        headers: headers,
      })
      .toPromise2();
  }

  getWeeksThatHaveWeeklyReport(projectId) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getWeeksThatHaveWeeklyReportUrl}/${projectId}`, {
        headers: headers,
      })
      .toPromise2();
  }

  getWeeksThatHaveWeekyReportForAta(ata_id, projectId = 0) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getWeeksThatHaveWeekyReportForAtaUrl}/${ata_id}/${projectId}`, {
        headers: headers,
      })
      .toPromise2();
  }

  updateAtestMoment(data) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(this.updateAtestMomentUrl, data, { headers: headers })
      .toPromise2();
  }

  revertAtest(momentId) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.revertAtestUrl}/${momentId}`, { headers: headers })
      .toPromise2();
  }

  revertAtestByIDS(momentIds) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(this.revertAtestByIDSUrl, momentIds, { headers: headers })
      .toPromise2();
  }

  getAllMomentsForWeeklyReportWithoutManual(wrId, project_id) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getAllMomentsForWeeklyReportWithoutManualUrl}/${wrId}/${project_id}`, {
        headers: headers,
      })
      .toPromise2();
  }

  updateAtestComment(moment) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(this.updateAtestCommentUrl, moment, { headers: headers })
      .toPromise2();
  }

  updateMomentComment(moment) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(this.updateMomentCommentUrl, moment, { headers: headers })
      .toPromise2();
  }

  getAllProjectCoworkers(project_id) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getAllProjectCoworkersUrl}/${project_id}`, {
        headers: headers,
      })
      .toPromise2();
  }

  getProjectsForInvoice() {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(this.getProjectsForInvoiceUrl, { headers: headers })
      .toPromise2();
  }

  getActivityProjects(projectId, type = "Edit") {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getActivityProjectsUrl}/${projectId}/${type}`, {
        headers: headers,
      })
      .toPromise2();
  }

  getEmailLogsForWeeklyReport(projectId, ataId = 0) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getEmailLogsForWeeklyReportUrl}/${projectId}/${ataId}`, {
        headers: headers,
      })
      .toPromise2();
  }

  getWeeklyReportsWithLogs(Id) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getWeeklyReportsWithLogsUrl}/${Id}`, { headers: headers })
      .toPromise2();
  }

  getProjectMomentsForAtest(project_id) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getProjectMomentsForAtestUrl}/${project_id}`, {
        headers: headers,
      })
      .toPromise2();
  }

  getClientAttestHistory(projectId, ataId) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getClientAttestHistoryUrl}/${projectId}/${ataId}`, {
        headers: headers,
      })
      .toPromise2();
  }

  deleteWeeklyReport(weeklyReportId, project_id) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.deleteWeeklyReportUrl}/${weeklyReportId}/${project_id}`, {
        headers: headers,
      })
      .toPromise2();
  }

  getSupplierInoviceFromDatabaseResolverService(
    project_id,
    limit = 0,
    offset = 0,
    suppTab = 0
  ) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(
        `${this.getSupplierInoviceFromDatabaseResolverServiceUrl}/${project_id}/${limit}/${offset}/${suppTab}`,
        { headers: headers }
      )
      .toPromise2();
  }

  getSupplierInvoiceForDU(project_id) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getSupplierInvoiceForDUUrl}/${project_id}`, {
        headers: headers,
      })
      .toPromise2();
  }

  getSupplierInvoiceRows(
    SupplierInvoiceId,
    projectId,
    selectedTab,
    sup_row_id = 0
  ) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(
        `${this.getSupplierInvoiceRowsUrl}/${SupplierInvoiceId}/${projectId}/${selectedTab}/${sup_row_id}`,
        { headers: headers }
      )
      .toPromise2();
  }

  updateSupplierInvoiceRows(data, supplierInvoiceId, sir_id) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(
        `${this.updateSupplierInvoiceRowsUrl}/${supplierInvoiceId}/${sir_id}`,
        data,
        { headers: headers }
      )
      .toPromise2();
  }

  removeSupplierInvoiceRows(id, project_id) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(`${this.removeSupplierInvoiceRowsUrl}/${id}/${project_id}`, "", {
        headers: headers,
      })
      .toPromise2();
  }

  getSupplierInvoice(id, selectedTab, sir_id) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getSupplierInvoiceUrl}/${id}/${selectedTab}/${sir_id}`, {
        headers: headers,
      })
      .toPromise2();
  }

  getSupplierInvoiceStatuses() {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(this.getSupplierInvoiceStatusesUrl, { headers: headers })
      .toPromise2();
  }

  enableEditAtest(projectId) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(this.enableEditAtestUrl, projectId, { headers: headers })
      .toPromise2();
  }

  getSupplierInvoicesPdfDocuments(SupplierInvoiceId) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getSupplierInvoicesPdfDocumentsUrl}/${SupplierInvoiceId}`, {
        headers: headers,
      })
      .toPromise2();
  }

  public getNotSendWeeklyReports(projectId, active_wr = 0) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getNotSendWeeklyReportsUrl}/${projectId}/${active_wr}`, {
        headers: headers,
      })
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["data"];
        }
        return [];
      })
      .catch((err) => {
        return [];
      });
  }

  public getWeeklyReportByWrId(wr_id, type = 'KS') {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getWeeklyReportByWrIdUrl}/${wr_id}/${type}`, {
        headers: headers,
      })
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["data"];
        }
        return [];
      })
      .catch((err) => {
        return [];
      });
  }
  getProjectsForAllSupplierInvoicesDropdown() {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(this.getProjectsForAllSupplierInvoicesDropdownUrl, {
        headers: headers,
      })
      .toPromise2();
  }

  accountingPlans() {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(this.accountingPlansUrl, { headers: headers })
      .toPromise2();
  }

  updateDateForPermit(object) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(this.updateDateForPermitUrl, object, { headers: headers })
      .toPromise2();
  }

  getProjectUserDetails(projectId) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getProjectUserDetailsUrl}/${projectId}`, {
        headers: headers,
      })
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["data"];
        }
        return [];
      })
      .catch((err) => {
        return [];
      });
  }

  getAllAvailableProjectWorkers(projectId) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getAllAvailableProjectWorkersUrl}/${projectId}`, {
        headers: headers,
      })
      .toPromise2();
  }

  getAllActivities() {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(this.getAllActivitiesUrl, { headers: headers })
      .toPromise2();
  }

  getActiveActivities(parentId, projectParentId): Promise<any> {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getActiveActivitiesUrl}/${parentId}/${projectParentId}`, {
        headers: headers,
      })
      .toPromise2();
  }

  createActivity(data): Promise<any> {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(this.createActivityUrl, data, { headers: headers })
      .toPromise2();
  }

  updateActivity(id, data) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(`${this.updateActivityUrl}/${id}`, data, { headers: headers })
      .toPromise2();
  }

  deleteActivity(id): Promise<any> {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.deleteActivityUrl}/${id}`, { headers: headers })
      .toPromise2();
  }

  getWorkerAllActivities(projectId): Promise<any> {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getWorkerAllActivitiesUrl}/${projectId}`, {
        headers: headers,
      })
      .toPromise2();
  }

  getProjectAdditionalWork(
    project_id,
    ata,
    moment,
    user,
    week,
    month,
    type,
    size,
    from
  ) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(
        `${this.getProjectAdditionalWorkUrl}/${project_id}/${ata}/${moment}/${user}/${week}/${month}/${type}/${size}/${from}`,
        { headers: headers }
      )
      .toPromise2();
  }
  getAllProjectArticleMaterials(project_id) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getAllProjectArticleMaterialsUrl}/${project_id}`, {
        headers: headers,
      })
      .toPromise2();
  }

  getAllProjectWeekyReports(project_id) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getAllProjectWeekyReportsUrl}/${project_id}`, {
        headers: headers,
      })
      .toPromise2();
  }

  getProjectsAndSubProjectsAndAtas(project_id) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getProjectsAndSubProjectsAndAtasUrl}/${project_id}`, {
        headers: headers,
      })
      .toPromise2();
  }


  getProjectsForAnalysis(project_id) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getProjectsForAnalysisUrl}/${project_id}`, {
        headers: headers,
      })
      .toPromise2();
  }


  getUserRaportStatus(date) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getUserRaportStatusUrl}/${date}`, { headers: headers })
      .toPromise2();
  }

  getStatisticWeeklyReports(project_id) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getStatisticWeeklyReportsUrl}/${project_id}`, {
        headers: headers,
      })
      .toPromise2();
  }

  getProjectsForPlanning() {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(this.getProjectsForPlanningUrl, { headers: headers })
      .toPromise2();
  }

  getAllUsersForPlanning() {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(this.getAllUsersForPlanningUrl, { headers: headers })
      .toPromise2();
  }

  getAllUnassignedUsersForPlanning() {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(this.getAllUnassignedUsersForPlanningUrl, { headers: headers })
      .toPromise2();
  }

  updateProjectSegment(
    projectId: number,
    startDate: string,
    endDate: string
  ): Promise<any> {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(
        `${this.updateProjectSegmentUrl}/${projectId}`,
        { startDate, endDate },
        { headers: headers }
      )
      .toPromise2();
  }

  updateDateSegment(
    dateSegmentId: number,
    startDate: string,
    endDate: string,
    hasMultiple: boolean = false
  ) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(
        `${this.updateDateSegmentUrl}/${dateSegmentId}`,
        { startDate, endDate, hasMultiple },
        { headers: headers }
      )
      .toPromise2();
  }

  createAbsenceSegment(
    parentAbsenceSegmentId: number,
    startDate: string,
    endDate: string
  ): Promise<any> {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(
        `${this.createAbsenceSegmentUrl}/${parentAbsenceSegmentId}`,
        { startDate, endDate },
        { headers: headers }
      )
      .toPromise2();
  }

  updateAbsenceSegment(
    absenceSegmentId: number,
    startDate: string,
    endDate: string
  ): Promise<any> {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(
        `${this.updateAbsenceSegmentUrl}/${absenceSegmentId}`,
        { startDate, endDate },
        { headers: headers }
      )
      .toPromise2();
  }

  addUserToProjectFromPlanning(
    projectId: number,
    userId: number,
    sortIndex: number,
    isResponsiblePerson: boolean
  ): Promise<any> {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(
        `${
          this.addUserToProjectFromPlanningUrl
        }/${projectId}/${userId}/${sortIndex}/${isResponsiblePerson ? 1 : 0}`,
        { headers: headers }
      )
      .toPromise2();
  }

  addDateSegmentToUserFromPlanning(
    projectId: number,
    userId: number,
    startDate: string,
    endDate: string
  ): Promise<any> {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(
        `${this.addDateSegmentToUserFromPlanningUrl}/${projectId}/${userId}`,
        { startDate, endDate },
        { headers: headers }
      )
      .toPromise2();
  }

  addPlanningResourceWeeksToProject(
    projectId: number,
    resourceWeeks: any
  ): Promise<any> {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(
        `${this.addPlanningResourceWeeksToProjectUrl}/${projectId}`,
        resourceWeeks,
        { headers: headers }
      )
      .toPromise2();
  }

  removePlanningResourceWeeksToProject(projectId: number): Promise<any> {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.removePlanningResourceWeeksToProjectUrl}/${projectId}`, {
        headers: headers,
      })
      .toPromise2();
  }

  updatePlanningResourceWeek(
    projectId: number,
    resourceWeek: string,
    numberOfWorkersNeeded: number
  ): Promise<any> {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(
        `${this.updatePlanningResourceWeekUrl}/${projectId}`,
        { resourceWeek, numberOfWorkersNeeded },
        { headers: headers }
      )
      .toPromise2();
  }

  updateResourcePlanningUserSortIndexAndProjectId(user): Promise<any> {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(this.updateResourcePlanningUserSortIndexAndProjectIdUrl, user, {
        headers: headers,
      })
      .toPromise2();
  }

  getPublicHolidayDates() {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(this.getPublicHolidayDatesUrl, { headers: headers })
      .toPromise2();
  }

  getAllResourcePlanningColumns() {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(this.getAllResourcePlanningColumnsUrl, { headers: headers })
      .toPromise2();
  }

  addResourcePlanningColumn() {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(this.addResourcePlanningColumnUrl, { headers: headers })
      .toPromise2();
  }

  updateResourcePlanningColumnValueColumnIdsWithNewColumnId(
    oldColumnId: number,
    newColumnId: number
  ) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(
        `${this.updateResourcePlanningColumnValueColumnIdsWithNewColumnIdUrl}/${oldColumnId}/${newColumnId}`,
        { headers: headers }
      )
      .toPromise2();
  }

  hideResourcePlanningColumn(columnId: number) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.hideResourcePlanningColumnUrl}/${columnId}`, {
        headers: headers,
      })
      .toPromise2();
  }

  showResourcePlanningColumn(columnId: number) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.showResourcePlanningColumnUrl}/${columnId}`, {
        headers: headers,
      })
      .toPromise2();
  }

  removeResourcePlanningColumn(columnId: number) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.removeResourcePlanningColumnUrl}/${columnId}`, {
        headers: headers,
      })
      .toPromise2();
  }

  updateColumnFromPlanning(
    columnId: number,
    newTextContent: string
  ): Promise<any> {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(
        this.updateColumnFromPlanningUrl,
        { columnId, newTextContent },
        { headers: headers }
      )
      .toPromise2();
  }

  updateResourcePlanningColumnWidth(columnId: number, width: number) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(
        this.updateResourcePlanningColumnWidthUrl,
        { columnId, width },
        { headers: headers }
      )
      .toPromise2();
  }

  updateResourcePlanningColumnSortIndex(
    columnId: number,
    newSortIndex: number
  ) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(
        this.updateResourcePlanningColumnSortIndexUrl,
        { columnId, newSortIndex },
        { headers: headers }
      )
      .toPromise2();
  }

  updateColumnValueFromResourcePlanning(
    columnId: number,
    projectId: number,
    userId: number,
    newTextContent: string
  ): Promise<any> {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(
        this.updateColumnValueFromResourcePlanningUrl,
        { columnId, projectId, userId, newTextContent },
        { headers: headers }
      )
      .toPromise2();
  }

  getProjectDUImages(project_id) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.http
      .get(`${this.getProjectDUImagesUrl}/${project_id}`, { headers: headers })
      .toPromise2();
  }

  getProjectDocuments(project_id) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.http
      .get(`${this.getProjectDocumentsUrl}/${project_id}`, { headers: headers })
      .toPromise2();
  }

  addResourcePlanningSendMessage(sendMessage: SendData) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.http
      .post(this.addResourcePlanningSendMessageUrl, sendMessage, {
        headers: headers,
      })
      .toPromise2();
  }

  sendResourcePlanningChangeMessagesToUsers() {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.http
      .get(this.sendResourcePlanningChangeMessagesToUsersUrl, {
        headers: headers,
      })
      .toPromise2();
  }

  getResourcePlanningSaveAndSendDatetime() {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.http
      .get(this.getResourcePlanningSaveAndSendDatetimeUrl, { headers: headers })
      .toPromise2();
  }

  removeDateSegmentFromResourcePlanning(dateSegmentId: number) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.http
      .post(
        `${this.removeDateSegmentFromResourcePlanningUrl}/${dateSegmentId}`,
        {},
        { headers: headers }
      )
      .toPromise2();
  }

  setProjectCountAsResources(projectId: number, countAsResources: boolean) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    const countAsResourcesNumber = countAsResources ? 1 : 0;
    return this.http
      .post(
        `${this.setProjectCountAsResourcesUrl}/${projectId}/${countAsResourcesNumber}`,
        {},
        { headers: headers }
      )
      .toPromise2();
  }

  changeUserStyleProperty(property: string, changedUsers: any[]) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.http
      .post(
        this.changeUserStylePropertyUrl,
        { property, changedUsers },
        { headers: headers }
      )
      .toPromise2();
  }

  getAvailableKSorDU(project_id) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(`${this.getAvailableKSorDUUrl}/${project_id}`, { headers: headers })
      .toPromise2();
  }

  removeSelectedDocumentsDU(data) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(this.removeSelectedDocumentsDUUrl, data, { headers: headers })
      .toPromise2();
  }

  get_last_email_log_but_first_client(type, wr_id) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(`${this.get_last_email_log_but_first_clientUrl}/${type}/${wr_id}`, {
        headers: headers,
      })
      .toPromise2();
  }

  createDataAsJson(content_type, content_id, data) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    let object = {
      content_type: content_type,
      content_id: content_id,
      data: data,
    };

    return this.http
      .post(this.createDataAsJsonUrl, object, { headers: headers })
      .toPromise2();
  }

  getDataAsJson(content_type, content_id) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.http
      .get(`${this.getDataAsJsonUrl}/${content_type}/${content_id}`, {
        headers: headers,
      })
      .toPromise2();
  }

  updateDataAsJson(content_type, content_id, data) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    let object = {
      content_type: content_type,
      content_id: content_id,
      data: data,
    };

    return this.http
      .post(this.updateDataAsJsonUrl, object, { headers: headers })
      .toPromise2();
  }

  getSupplierInovicesForWeeklyReport(wr_id) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.http
      .get(`${this.getSupplierInovicesForWeeklyReportUrl}/${wr_id}`, {
        headers: headers,
      })
      .toPromise2();
  }

  get_project_and_sub_project_name_id_and_custom_name_by_project_id(
    project_id
  ) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.http
      .get(
        `${this.get_project_and_sub_project_name_id_and_custom_name_by_project_idUrl}/${project_id}`,
        { headers: headers }
      )
      .toPromise2();
  }

  getDocuments(email, token) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.http
      .get(`${this.getDocumentsUrl}/${email}/${token}`, { headers: headers })
      .toPromise2();
  }

  getAllDocuments(email, token, table_type = null, content_type = null, argument = null) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.http
      .get(
        `${this.getAllDocumentsUrl}/${email}/${token}/${table_type}/${content_type}/${argument}`,
        { headers: headers }
      )
      .toPromise2();
  }

  get_weekly_reports(project_id, token, worker_email, worker_id, from) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.http
      .get(
        `${this.get_weekly_reports_url}/${project_id}/${token}/${worker_email}/${worker_id}/${from}`,
        { headers: headers }
      )
      .toPromise2();
  }

  updateProjectPrognosis(
    type = "complete_prognosis",
    project_id,
    value,
    total = 0
  ) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    let object = {
      project_id: project_id,
      value: value,
      type: type,
      total: total,
    };

    return this.http
      .post(this.updateProjectPrognosisUrl, object, { headers: headers })
      .toPromise2();
  }

  getWeeklyReportDocuments(project_id, ata_id = 0) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.http
      .get(`${this.getWeeklyReportDocumentsUrl}/${project_id}/${ata_id}`, {
        headers: headers,
      })
      .toPromise2();
  }

  sendWeeklyReports(object) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(this.sendWeeklyReportsUrl, object, { headers: headers })
      .toPromise2();
  }

  getWeeklyReportsForSelect(project_id, type) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

        return this.http
          .get(`${this.getWeeklyReportsForSelectUrl}/${project_id}/${type}`, { headers: headers })
          .toPromise2();
    }

  updateOrCreateCustomComment(data) {
      return this.http.post(this.updateOrCreateCustomCommentUrl, data, {
          headers: this.headers,
      });
  }

  getAllProjectsForAnalysis(year = null) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.http.get(`${this.getAllProjectsForAnalysisUrl}/${year}`, {
      headers: headers,
    });
  }

  public getProjectsAndActivitiesForCalendar(start_date, end_date, searchValue = '') {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getProjectsAndActivitiesForCalendarUrl}/${start_date}/${end_date}`, { headers: headers })
      .toPromise2()
      .then((response) => {
        if (response["status"]) {
          return response["data"];
        }
        return [];
      }).catch((err) => {
        return [];
    });
  }

  getAllProjectsForAnalysis2(on_hold = false, on_going = false, awaiting_inspection = false, completed = false) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.http.get(`${this.getAllProjectsForAnalysis2Url}/${on_hold}/${on_going}/${awaiting_inspection}/${completed}`, {
      headers: headers,
    });
  }

  getProjectRelation() {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.http.get(`${this.getProjectRelationUrl}`, {
      headers: headers,
    });
  }

    async getFile(url: string) {
        const httpOptions = {
            responseType: 'blob' as 'json'
        };
        const res = await this.http.get(url, httpOptions).toPromise2().then((response) => {

        if (response) {
            return response;
        }
            return [];
        }).catch((err) => {
            return [];
        });
        return res;
    }
}
