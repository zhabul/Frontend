import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { BASE_URL } from "src/app/config";

@Injectable({providedIn: 'root'})
export class AtestInfoService {

    public hasChangesOnForm$ = new BehaviorSubject(false);
    private getMomentsDocumentsUrl: string = BASE_URL + "api/documents/getMomentsDocuments";
    constructor(private http: HttpClient) {}

  /* GETTERS AND SETTERS */

    setIfHasChangesOnForm(status) {
        this.hasChangesOnForm$.next(status);
    }

    getIfHasChangesOnForm() {
        return this.hasChangesOnForm$.asObservable();
    }

    getMomentsDocuments(project_id) {
        const headers = new HttpHeaders();
        headers.append("X-Requested-With", "XMLHttpRequest");
        headers.append("Content-Type", "application/x-www-form-urlencoded");

        return this.http.get(
        `${this.getMomentsDocumentsUrl}/${project_id}`,
        { headers: headers }
        );
    }
}
