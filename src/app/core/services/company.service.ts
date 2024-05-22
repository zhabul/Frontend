import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BASE_URL } from "src/app/config";
import { map } from "rxjs";
import 'src/app/core/extensions/rxjs-observable-promise';
@Injectable({
  providedIn: 'root'
})
export class CompanyService {

    private getPhoneCodesUrl: string = BASE_URL + "api/companies/getPhoneCodes";
    private headers: HttpHeaders;

    constructor(private http: HttpClient) {
      this.headers = new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
      });
    }


    getPhoneCodes(): Promise<any> {
        return this.http
        .get(`${this.getPhoneCodesUrl}`, { headers: this.headers })
        .pipe(
        map((response) => {
            if (response["status"]) {
            return response["data"];
            }
            return null;
        })
        ).toPromise2();
    }
}
