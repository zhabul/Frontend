import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BASE_URL } from "../../config";
import { catchError, map, Observable, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MomentsService {
  private createProjectMomentUrl: string =
    BASE_URL + "api/moments/createMoment";
  private getMomentsUrl: string = BASE_URL + "api/moments/getMoments";
  private deleteMomentUrl: string = BASE_URL + "api/moments/deleteMoment";
  private createProjectPlanUrl: string =
    BASE_URL + "api/moments/createProjectPlan";
  private updateMomentPositionUrl: string =
    BASE_URL + "api/moments/updateMomentPosition";
  private updateMovePositionUrl: string =
    BASE_URL + "api/moments/updateMovePosition";
  private updateMomentMovePositionUrl: string =
    BASE_URL + "api/moments/updateMomentMovePosition";
  private createMomentPlanConnectionLineUrl: string =
    BASE_URL + "api/moments/createMomentPlanConnectionLine";
  private getProjectPlanConnectionsUrl: string =
    BASE_URL + "api/moments/getProjectPlanConnections";
  private changePercentageUrl: string =
    BASE_URL + "api/moments/changePercentage";
  private removeLineUrl: string = BASE_URL + "api/moments/removeLine";
  private updateMomentTimelinePositionUrl: string =
    BASE_URL + "api/moments/updateMomentTimelinePosition";
  private groupScheduleMomentsUrl: string =
    BASE_URL + "api/moments/groupScheduleMoments";
  private createProjectPlanCoworkerUrl: string =
    BASE_URL + "api/moments/createProjectPlanCoworker";
  private updateProjectPlanCoworkerUrl: string =
    BASE_URL + "api/moments/updateProjectPlanCoworker";
  private updateProjectPlanNameUrl: string =
    BASE_URL + "api/moments/editProjectPlanName";
  private deleteProjectPlanUrl: string =
    BASE_URL + "api/moments/deleteProjectPlan";
  private getDefaultMomentsUrl: string =
    BASE_URL + "api/moments/getDefaultMoments";
  private createDefaultMomentUrl: string =
    BASE_URL + "api/moments/createDefaultMoment";
  private updateDefaultMomentUrl: string =
    BASE_URL + "api/moments/updateDefaultMoment";
  private deleteDelfaultMomentUrl: string =
    BASE_URL + "api/moments/deleteDelfaultMoment";
  private excuteCronTaskUrl: string = BASE_URL + "api/cron/project-plannering";
  private generatePdfUrl: string = BASE_URL + "api/moments/generatePdf";
  private sortDefaultMomentsUrl: string =
    BASE_URL + "api/moments/sortDefaultMoments";
  private getDefaultMomentsForUserUrl: string =
    BASE_URL + "api/moments/getDefaultMomentsForUser";
    private getSumOfAllAttestedMomentsByProjectOrAtaWithStarANdEndDateUrl: string = BASE_URL + "api/moments/getSumOfAllAttestedMomentsByProjectOrAtaWithStarANdEndDate";

    private headers: HttpHeaders;

    constructor(private http: HttpClient) {
      this.headers = new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
      });
    }

  createProjectMoment(data) {
    return this.http
      .post(this.createProjectMomentUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getMoments(id) {
    return this.http
      .get(`${this.getMomentsUrl}/${id}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  deleteMoment(moment_id) {
    return this.http
      .get(`${this.deleteMomentUrl}/${moment_id}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  createProjectPlan(data) {
    return this.http
      .post(this.createProjectPlanUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  updateMomentPosition(moment) {
    return this.http
      .post(this.updateMomentPositionUrl, moment, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  updateMomentTimelinePosition(timeline) {
    return this.http
      .post(this.updateMomentTimelinePositionUrl, timeline, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  updateMovePosition(moment) {
    return this.http
      .post(this.updateMovePositionUrl, moment, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  updateMomentMovePosition(moment) {
    return this.http
      .post(this.updateMomentMovePositionUrl, moment, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  createMomentPlanConnectionLine(object) {
    return this.http
      .post(this.createMomentPlanConnectionLineUrl, object, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  public getProjectPlanConnections(projectid: number): Observable<any> {
    return this.http
      .get(`${this.getProjectPlanConnectionsUrl}/${projectid}`, {
        headers: this.headers,
      })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return null;
        })
      );
  }

  public changePercentage(planId, percentage): Observable<any> {
    return this.http
      .post(
        this.changePercentageUrl,
        { planId, percentage },
        { headers: this.headers }
      )
      .pipe(catchError(() => of({ status: false })));
  }

  public removeLine(momentId): Promise<any> {
    return this.http
      .post(this.removeLineUrl, momentId, { headers: this.headers })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  public groupScheduleMoments(object) {
    return this.http
      .post(this.groupScheduleMomentsUrl, object, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public createProjectPlanCoworker(data) {
    return this.http
      .post(this.createProjectPlanCoworkerUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public updateProjectPlanCoworker(data) {
    return this.http
      .post(this.updateProjectPlanCoworkerUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public updateProjectPlanName(data) {
    return this.http
      .post(this.updateProjectPlanNameUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public deleteProjectPlan(moment) {
    let id = moment.id;

    return this.http
      .post(this.deleteProjectPlanUrl, id, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getDefaultMoments() {
    return this.http
      .get(this.getDefaultMomentsUrl, { headers: this.headers })
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

  getDefaultMomentsForUser() {
    return this.http
      .get(this.getDefaultMomentsForUserUrl, { headers: this.headers })
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

  createDefaultMoment(data) {
    return this.http
      .post(this.createDefaultMomentUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  updateDefaultMoment(data) {
    return this.http
      .post(this.updateDefaultMomentUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  deleteDelfaultMoment(moment) {
    return this.http
      .post(this.deleteDelfaultMomentUrl, moment, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  excuteCronTask(): Promise<any> {
    return this.http
      .get(this.excuteCronTaskUrl, { headers: this.headers })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  sortDefaultMoments(moments): Promise<any> {
    return this.http
      .post(this.sortDefaultMomentsUrl, moments, { headers: this.headers })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  generatePdf(startDate, endDate, users, user_ids = [], type = 'PDF') {
    let obj = {
      startDate: startDate,
      endDate: endDate,
      users: users,
      user_ids: user_ids,
      type: type
    };
    return this.http
      .post(this.generatePdfUrl, obj, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

    getSumOfAllAttestedMomentsByProjectOrAtaWithStarANdEndDate(project_id, ata_id) {
        return this.http
          .get(`${this.getSumOfAllAttestedMomentsByProjectOrAtaWithStarANdEndDateUrl}/${project_id}/${ata_id}`, { headers: this.headers })
          .pipe(catchError(() => of({ status: false })));
    }  
}
