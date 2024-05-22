import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BASE_URL } from "../../config";
import { catchError, of } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class SupportService {
    private createSupportRequestUrl: string = BASE_URL + "api/support";
    private getSupportRequestsUrl: string = BASE_URL + "api/support/tasks";
    private setRequestDoneUrl: string = BASE_URL + "api/support/task";

    private headers: HttpHeaders;

    constructor(private http: HttpClient) {
        this.headers = new HttpHeaders({
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Requested-With": "XMLHttpRequest",
        });
    }

    createSupportRequest(data) {
        return this.http.post(this.createSupportRequestUrl, data, {
            headers: this.headers,
            reportProgress: true,
            observe: "events",
        });
    }

    getSupportRequests() {
        return this.http
            .get(this.getSupportRequestsUrl, { headers: this.headers })
            .pipe(catchError(() => of({ status: false })));
    }

    setRequestDone(id) {
        return this.http
            .post(this.setRequestDoneUrl, id, { headers: this.headers })
            .pipe(catchError(() => of({ status: false })));
    }

    deleteSupportRequest(requestId) {
        return this.http.delete(`${BASE_URL}api/support/task/${requestId}`, { headers: this.headers })
            .pipe(catchError(() => of({ status: false })));
    }
}
