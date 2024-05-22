import { Injectable } from '@angular/core';
import { BASE_URL } from "../../config/index";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class WeeklyReportsService {

    private updateWeeklyReportUrl: string = BASE_URL + "api/weeklyreport/updateWeeklyReport";
    private updateWeeklyReportStatusAndDueDateUrl: string = BASE_URL + "api/weeklyreport/updateWeeklyReportStatusAndDueDate";
    private getWeeklyReportByWrIdUrl: string = BASE_URL + "api/weeklyreport/getWeeklyReportByWrId"; 
    private deleteWeeklyReportUrl: string = BASE_URL + "api/weeklyreport/deleteWeeklyReport";
    private approveWeeklyReportAsAdminUrl: string = BASE_URL + "api/weeklyreport/approveAsAdmin";
    private declineWeeklyReportAsAdminUrl: string = BASE_URL + "api/weeklyreport/declineAsAdmin";
    private createWeeklyReportRevisionUrl: string = BASE_URL + 'api/weeklyreport/createWeeklyReportRevision';
    private getWeeklyReportNamesUrl: string = BASE_URL + 'api/weeklyreport/getWeeklyReportNames';
    private setOrUpdateCommentUrl: string = BASE_URL + 'api/weeklyreport/setOrUpdateComment';

    constructor(private http: HttpClient) { }

    public updateWeeklyReportStatusAndDueDate(data) {
        const headers = new HttpHeaders();
        headers.append("X-Requested-With", "XMLHttpRequest");
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        return this.http.post(this.updateWeeklyReportStatusAndDueDateUrl, data, { headers: headers }).toPromise2();
    }

    public updateWeeklyReport(data) {
        const headers = new HttpHeaders();
        headers.append("X-Requested-With", "XMLHttpRequest");
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        return this.http.post(this.updateWeeklyReportUrl, data, { headers: headers }).toPromise2();
    }

    public getWeeklyReportByWrId(wr_id, type = 'KS') {
        const headers = new HttpHeaders();
        headers.append("X-Requested-With", "XMLHttpRequest");
        headers.append("Content-Type", "application/x-www-form-urlencoded");

        return this.http.get(`${this.getWeeklyReportByWrIdUrl}/${wr_id}/${type}`, {
            headers: headers,
        }).toPromise2().then((response) => {
            if (response["status"]) {
              return response["data"];
            }
            return [];
        })
        .catch((err) => {
            return [];
        });
    }

    public deleteWeeklyReport(weeklyReportId) {
        const headers = new HttpHeaders();
        headers.append("X-Requested-With", "XMLHttpRequest");
        headers.append("Content-Type", "application/x-www-form-urlencoded");

        return this.http.get(`${this.deleteWeeklyReportUrl}/${weeklyReportId}`, {
            headers: headers,
        }).toPromise2();
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

    createWeeklyReportRevision(data) {
        const headers = new HttpHeaders();
        headers.append("X-Requested-With", "XMLHttpRequest");
        headers.append("Content-Type", "application/x-www-form-urlencoded");

        return this.http
          .post(this.createWeeklyReportRevisionUrl, data, {headers: headers,}).toPromise2();
    }

    getWeeklyReportNames(ata_id = 0, project_id, active_report = 0): Promise<any> {
        
        const headers = new HttpHeaders();
        headers.append("X-Requested-With", "XMLHttpRequest");
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        return this.http.get(
            `${this.getWeeklyReportNamesUrl}/${ata_id}/${project_id}/${active_report}`,
            { headers: headers }
        ).toPromise2();
    }

    setOrUpdateComment(data) {
        const headers = new HttpHeaders();
        headers.append("X-Requested-With", "XMLHttpRequest");
        headers.append("Content-Type", "application/x-www-form-urlencoded");

        return this.http
          .post(this.setOrUpdateCommentUrl, data, {headers: headers,}).toPromise2();        
    }
}
