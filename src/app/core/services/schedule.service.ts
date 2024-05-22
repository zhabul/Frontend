import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PlannedAbsence } from "src/app/moments/project-moments-schedule-planer/project-schedule-planer-canvas/resource-project-schedule-planer/models/PlannedAbsence";
import { BASE_URL } from "../../config/index";

@Injectable({
  providedIn: 'root'
})

export class ScheduleService {

  private getDefaultMomentsUrl: string = BASE_URL + 'api/schedule/getDefaultMoments';
  private createScheduleActivitiesUrl: string = BASE_URL + 'api/schedule/createScheduleActivities';
  private changeScheduleActivitiesUrl: string = BASE_URL + 'api/schedule/changeScheduleActivities';
  private createSchedulePlanUrl: string = BASE_URL + 'api/schedule/createSchedulePlan';
  private changeSchedulePlanUrl: string = BASE_URL + 'api/schedule/changeSchedulePlan';
  private getSchedulePlanUrl: string = BASE_URL + 'api/schedule/getSchedulePlan';
  private deleteSchedulePlanUrl: string = BASE_URL + 'api/schedule/deleteSchedulePlan';
  private getSchedulePlanStateUrl: string = BASE_URL + 'api/schedule/getSchedulePlanState';
  private changeStatesStylePropertyUrl: string = BASE_URL + 'api/schedule/changeStatesStyleProperty';
  private changePlanPropertyUrl: string = BASE_URL + 'api/schedule/changePlanProperty';
  private changePlanPercentageUrl: string = BASE_URL + 'api/schedule/changePlanPercentage';
  private changeSchedulePlanWorksDateUrl: string = BASE_URL + 'api/schedule/changeSchedulePlanWorksDate';
  private changeSchedulePlanConnectedUrl: string = BASE_URL + 'api/schedule/changeSchedulePlanConnected';
  private changeSchedulePlanDateUrl: string = BASE_URL + 'api/schedule/changeSchedulePlanDate';
  private changePlanActivityDetailsUrl: string = BASE_URL + 'api/schedule/changePlanActivityDetails';
  private changeSchedulePlanDetailStateUrl: string = BASE_URL + 'api/schedule/changePlansDetailState';
  private changePlansDetailsUrl: string = BASE_URL + 'api/schedule/changePlansDetails';
  private getAllScheduleColumnsUrl: string = BASE_URL + 'api/schedule/getAllScheduleColumns';
  private addScheduleColumnUrl: string = BASE_URL + 'api/schedule/addScheduleColumn';
  private removeScheduleColumnUrl: string = BASE_URL + 'api/schedule/removeScheduleColumn';
  private updateScheduleColumnUrl: string = BASE_URL + 'api/schedule/updateScheduleColumn';
  private updateScheduleColumnWidthUrl: string = BASE_URL + 'api/schedule/updateScheduleColumnWidth';
  private updateScheduleColumnSortIndexUrl: string = BASE_URL + 'api/schedule/updateScheduleColumnSortIndex';
  private hideScheduleColumnUrl: string = BASE_URL + 'api/schedule/hideScheduleColumn';
  private updateScheduleColumnValueColumnIdsWithNewColumnIdUrl: string = BASE_URL + 'api/schedule/updateScheduleColumnValueColumnIdsWithNewColumnId';
  private updateColumnValueFromScheduleUrl: string = BASE_URL + 'api/schedule/updateColumnValueFromSchedule';
  private createScheduleGroupUrl: string = BASE_URL + 'api/schedule/createScheduleGroup';
  private deleteScheduleGroupUrl: string = BASE_URL + 'api/schedule/deleteScheduleGroup';
  private deleteSchedulePlanAndGroupUrl: string = BASE_URL + 'api/schedule/deleteSchedulePlanAndGroup';
  private getScheduleGroupUrl: string = BASE_URL + 'api/schedule/getScheduleGroup';
  private changeScheduleGroupUrl: string = BASE_URL + 'api/schedule/changeScheduleGroup';
  private getScheduleActivityUrl: string = BASE_URL + 'api/schedule/getScheduleActivity';
  private generatePdfUrl: string = BASE_URL + "api/schedule/generatePdf";
  private generateImageUrl: string = BASE_URL + "api/schedule/generateImage";
  private updateImageUrl: string = BASE_URL + "api/schedule/updateImage";
  private createNewStateUrl: string = BASE_URL + "api/schedule/createNewState";
  private getRevisionsUrl: string = BASE_URL + "api/schedule/getAllRevision";
  private getRevImagesUrl: string = BASE_URL + "api/schedule/getAllRevisionImage";
  private addPlanedAbsencesUrl: string = BASE_URL + "api/schedule/createAbsence";
  private deletePlanedAbsencesUrl: string = BASE_URL + "api/schedule/deleteAbsence";
  private getAllPlanedScheduleAbsencesUrl: string = BASE_URL + "api/schedule/getAllPlanedScheduleAbsences";
  private updateScheduleActivityIdInSchedulePlanUrl: string = BASE_URL + 'api/schedule/updateScheduleActivityIdInSchedulePlan';
  private updateStateNumberInSchedulePlanUrl: string = BASE_URL + 'api/schedule/updateStateNumberInSchedulePlan';
  private updateFinishedTimeUrl: string = BASE_URL + 'api/schedule/updateFinishedTimeInSchedulePlan';
  private updatePartUrl: string = BASE_URL + 'api/schedule/updatePartPlan';
  private getScheduleProjectWorkingHoursPerDayUrl: string = BASE_URL + 'api/schedule/getScheduleProjectWorkingHoursPerDay';
  public changeScheduleProjectWorkingHoursUrl: string = BASE_URL + 'api/schedule/changeScheduleProjectWorkingHours';
  public changeScheduleProjectShowNamesUrl: string = BASE_URL + 'api/schedule/changeScheduleProjectShowNames';
  private changeScheduleColumnValuesUrl: string = BASE_URL + 'api/schedule/changeNewColumnValues';
  private getUrlOfImageURL: string = BASE_URL + 'api/schedule/getUrlOfImage';
  private updateRevisionUrl: string = BASE_URL + "api/schedule/updateRevision";



  constructor(private http: HttpClient) { }

  public getDefaultMoments() {
    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.get(`${this.getDefaultMomentsUrl}`, { headers: headers })
      .toPromise()
      .then(response => {
        if (response['status']) {
          return response['data'];
        }
        return [];
      })
      .catch(err => {
        return [];
      });
  }

  public createScheduleActivities(projectId: number, activityId: number) {
    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http
      .post(
        `${this.createScheduleActivitiesUrl}`,
        { projectId, activityId },
        { headers: headers }
      ).toPromise()
      .then(response => {
        if (response['status']) {
          return response['data'];
        }
        return [];
      })
      .catch(err => {
        return [];
      });
  }

  public changeScheduleActivities(scheduleActivityId: number, activityId: number) {
    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http
      .post(
        this.changeScheduleActivitiesUrl,
        { scheduleActivityId, activityId },
        { headers: headers }
      ).toPromise();
  }

  public async createSchedulePlan(scheduleActivityId: number, schedulePlanActivityId: number, momentId: number, name: string, plan: string, startDate: string, endDate: string, time: number, numberOfWorkers: number, groupId: number, stateNumber: number, sortIndex: number, projectId: number, pattern: number) {
    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http
      .post(
        `${this.createSchedulePlanUrl}`,
        { scheduleActivityId, schedulePlanActivityId, momentId, name, plan, startDate, endDate, time, numberOfWorkers, groupId, stateNumber, sortIndex, projectId, pattern },
        { headers: headers })
      .toPromise()
      .then(response => {
        if (response['status']) {
          return response['data'];
        }
        return [];
      })
      .catch(err => {
        return [];
      });
  }

  public changeSchedulePlan(changedState: any[])
  {
    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http
      .post(
        this.changeSchedulePlanUrl,
        { changedState },
        { headers: headers }
      ).toPromise();
  }

  public getSchedulePlan(schedulePlanId) {
    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.get(`${this.getSchedulePlanUrl}/${schedulePlanId}`, { headers: headers })
      .toPromise()
      .then(response => {
        if (response['status']) {
          return response['data'];
        }
        return [];
      })
      .catch(err => {
        return [];
      });
  }

  public deleteSchedulePlan(idList: any[]) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(this.deleteSchedulePlanUrl, { idList }, { headers: headers })
      .toPromise();
  }

  public getSchedulePlanState(projectId) {
    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.get(`${this.getSchedulePlanStateUrl}/${projectId}`, { headers: headers })
      .toPromise()
      .then(response => {
        if (response['status']) {
          return response['data'];
        }
        return [];
      })
      .catch(err => {
        return [];
      });
  }

  public changeStatesStyleProperty(property: String, changedState: any[]) {
    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http
      .post(
        this.changeStatesStylePropertyUrl,
        { property, changedState },
        { headers: headers }
      ).toPromise();
  }

  public changePlanProperty(property: String, changedState: any[]) {
    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http
      .post(
        this.changePlanPropertyUrl,
        { property, changedState },
        { headers: headers }
      ).toPromise();
  }

  public changePlanPercentage(planId: Number, percentage: Number) {
    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http
      .post(
        this.changePlanPercentageUrl,
        { planId, percentage },
        { headers: headers }
      ).toPromise();
  }

  public changeSchedulePlanWorksDate(changedState: any[])
  {
    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http
      .post(
        this.changeSchedulePlanWorksDateUrl,
        { changedState },
        { headers: headers }
      ).toPromise();
  }

  public changeSchedulePlanConnected(changedState: any[])
  {
    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http
      .post(
        this.changeSchedulePlanConnectedUrl,
        { changedState },
        { headers: headers }
      ).toPromise();
  }

  public changeSchedulePlanDate(changedState: any[])
  {
    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http
      .post(
        this.changeSchedulePlanDateUrl,
        { changedState },
        { headers: headers }
      ).toPromise();
  }

  public changePlanActivityDetails(changedState: any[]) {
    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http
      .post(
        this.changePlanActivityDetailsUrl,
        { changedState },
        { headers: headers }
      ).toPromise();
  }

  public changeSchedulePlanDetailState(changedState: any[]) {
    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http
      .post(
        this.changeSchedulePlanDetailStateUrl,
        { changedState },
        { headers: headers }
      ).toPromise();
  }

  public changePlansDetails(planId, state, backgroundColor, textColor, fontSize, fontWeight, fontFamily, fontStyle, fontDecoration, tapeColor, percentageOfRealizedPlan, startWorkDateValue, endWorkDateValue, connectedValue, connectedToPlanValue, notedValue, noteTextValue) {
    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http
      .post(
        this.changePlansDetailsUrl,
        { planId, state,  backgroundColor, textColor, fontSize, fontWeight, fontFamily, fontStyle, fontDecoration, tapeColor, percentageOfRealizedPlan, startWorkDateValue, endWorkDateValue, connectedValue, connectedToPlanValue, notedValue, noteTextValue },
        { headers: headers }
      ).toPromise();
  }

  public getAllScheduleColumns(id){
    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.get(`${this.getAllScheduleColumnsUrl}/${id}`, { headers: headers })
      .toPromise()
      .then(response => {
        if (response['status']) {
          return response['data'];
        }
        return [];
      })
      .catch(err => {
        return [];
      });
  }

  public addScheduleColumn(projectId: number) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.addScheduleColumnUrl}/${projectId}`, { headers: headers })
      .toPromise();
  }

  public removeScheduleColumn(columnId: number) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.removeScheduleColumnUrl}/${columnId}`, {
        headers: headers,
      })
      .toPromise();
  }

  public updateScheduleColumn(columnId: number, newTextContent: string) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(
        this.updateScheduleColumnUrl,
        { columnId, newTextContent },
        { headers: headers }
      )
      .toPromise();
  }

  public updateScheduleColumnWidth(columnId: number, width: number) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(
        this.updateScheduleColumnWidthUrl,
        { columnId, width },
        { headers: headers }
      )
      .toPromise();
  }

  public updateScheduleColumnSortIndex(
    columnId: number,
    newSortIndex: number
  ) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(
        this.updateScheduleColumnSortIndexUrl,
        { columnId, newSortIndex },
        { headers: headers }
      )
      .toPromise();
  }

  public hideScheduleColumn(columnId: number) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.hideScheduleColumnUrl}/${columnId}`, {
        headers: headers,
      })
      .toPromise();
  }

  updateScheduleColumnValueColumnIdsWithNewColumnId(
    oldColumnId: number,
    newColumnId: number
  ) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(
        `${this.updateScheduleColumnValueColumnIdsWithNewColumnIdUrl}/${oldColumnId}/${newColumnId}`,
        { headers: headers }
      )
      .toPromise();
  }

  updateColumnValueFromSchedule(
    columnId: number,
    projectId: number,
    activityId: number,
    planId: number,
    newTextContent: string
  ) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(
        this.updateColumnValueFromScheduleUrl,
        { columnId, projectId, activityId, planId, newTextContent },
        { headers: headers }
      )
      .toPromise();
  }

  async createScheduleGroup(projectId, activityId, parent, parentType) {
    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http
      .post(
        `${this.createScheduleGroupUrl}`,
        { projectId, activityId ,parent,parentType},
        { headers: headers }
      ).toPromise2()
      .then(response => {
        if (response['status']) {
          return  response['data'];
        }
        return [];
      })
      .catch(err => {
        return [];
      });

  }

  deleteScheduleGroup(parentList: any[]){
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.http
      .post(this.deleteScheduleGroupUrl,
        parentList,
        { headers: headers })
      .toPromise();
  }


  deleteSchedulePlanAndGroup(idList: any[], parentList: any[]) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(this.deleteSchedulePlanAndGroupUrl,
        { idList, parentList },
        { headers: headers })
      .toPromise();
  }

  getScheduleGroup(parent){
    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.get(`${this.getScheduleGroupUrl}/${parent}`, { headers: headers })
      .toPromise()
      .then(response => {
        if (response['status']) {
          return response['data'];
        }
        return [];
      })
      .catch(err => {
        return [];
      });
  }

  public changeScheduleGroup(changedState: any[]) {
    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http
      .post(
        this.changeScheduleGroupUrl,
        { changedState },
        { headers: headers }
      ).toPromise();
  }

  public getScheduleActivity(projectId, activityId) {
    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.get(`${this.getScheduleActivityUrl}/${projectId}/${activityId}`, { headers: headers })
      .toPromise()
      .then(response => {
        if (response['status']) {
          return response['data'];
        }
        return [];
      })
      .catch(err => {
        return [];
      });
  }

  generatePdf(imageCanvas, email, projectName, sendBy, sendDate, revisionDate) {

    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http
      .post(
        this.generatePdfUrl,
        { imageCanvas , email, projectName, sendBy, sendDate, revisionDate},
        { headers: headers }
      ).toPromise();
  }

  generateImage(imageCanvas, projectId, date) {

    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http
      .post(
        this.generateImageUrl,
        { imageCanvas , projectId, date },
        { headers: headers }
      ).toPromise();
  }

  updateImage(imageCanvas, projectId, date) {

    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http
      .post(
        this.updateImageUrl,
        { imageCanvas , projectId, date },
        { headers: headers }
      ).toPromise();
  }

  createNewState(data,content_type,content_id){
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    let object = {
      content_type: content_type,
      content_id: content_id,
      data: data,
    };

    return this.http
      .post(this.createNewStateUrl, object, { headers: headers })
      .toPromise2();
  }

  getAllScheduleRevisionByProject(id) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http.get(`${this.getRevisionsUrl}/${id}`, {
      headers: headers,
    }).toPromise2()
    .then((response) => {
      if (response["status"]) {
        return response["data"] as any;
      }
      return null;
    });;
  }

  getAllScheduleRevisionImage(id) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http.get(`${this.getRevImagesUrl}/${id}`, {
      headers: headers,
    }).toPromise2()
    .then((response) => {
      if (response["status"]) {
        return response["data"] as any;
      }
      return null;
    });;
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

  public getAllPlanedScheduleAbsences(id) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .get(`${this.getAllPlanedScheduleAbsencesUrl}/${id}`, { headers: headers })
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

  public updateScheduleActivityIdInSchedulePlan(changedState: any[]) {
    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http
      .post(
        this.updateScheduleActivityIdInSchedulePlanUrl,
        { changedState },
        { headers: headers }
      ).toPromise();
  }

  public updateStateNumberInSchedulePlan(changedState: any[]) {
    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http
      .post(
        this.updateStateNumberInSchedulePlanUrl,
        { changedState },
        { headers: headers }
      ).toPromise();
  }

  public updateFinishedTime(
    planId: number,
    finishedTime: number
  ) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(
        this.updateFinishedTimeUrl,
        { planId, finishedTime },
        { headers: headers }
      )
      .toPromise();
  }

  public updatePart(
    planId: number,
    part: string
  ) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(
        this.updatePartUrl,
        { planId, part },
        { headers: headers }
      )
      .toPromise();
  }

  public getScheduleProjectWorkingHoursPerDay(projectId) {
    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.get(`${this.getScheduleProjectWorkingHoursPerDayUrl}/${projectId}`, { headers: headers })
      .toPromise()
      .then(response => {
        if (response['status']) {
          return response['data'];
        }
        return [];
      })
      .catch(err => {
        return [];
      });
  }

  public changeScheduleProjectWorkingHours(projectId, value) {
    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    console.log(projectId + " " + value);
    return this.http
      .post(
        this.changeScheduleProjectWorkingHoursUrl,
        { projectId, value },
        { headers: headers }
      ).toPromise();
  }

  public changeScheduleProjectShowNames(projectId, value) {
    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http
      .post(
        this.changeScheduleProjectShowNamesUrl,
        { projectId, value },
        { headers: headers }
      ).toPromise();
  }

  public changeScheduleColumnValues(changedState: any[])
  {
    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http
      .post(
        this.changeScheduleColumnValuesUrl,
        { changedState },
        { headers: headers }
      ).toPromise();
  }

  getImageUrl(image) {
    // const data = {
    //   emails: emails,
    //   atas: atas,
    //   project: project,
    //   type: type,
    // };

    const headers = new HttpHeaders();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.get(`${this.getUrlOfImageURL}/${image}`, { headers: headers })
    .toPromise()
      .then(response => {
        if (response['status']) {
          return response['summaryUrl'];
        }
        return [];
      })
      .catch(err => {
        return [];
      });
  }

  updateRevision(data,content_type,content_id){
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    let object = {
      content_type: content_type,
      content_id: content_id,
      data: data,
    };

    return this.http
      .post(this.updateRevisionUrl, object, { headers: headers })
      .toPromise2();
  }

}
