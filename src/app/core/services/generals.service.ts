import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BASE_URL } from "src/app/config";
import { map, of, catchError, Observable } from "rxjs";
import 'src/app/core/extensions/rxjs-observable-promise';

@Injectable({
  providedIn: "root",
})
export class GeneralsService {
  private getAllUrl: string = BASE_URL + "api/generals/list";
  private getGeneralUrl: string = BASE_URL + "api/generals/get";
  private updateGeneralUrl: string = BASE_URL + "api/generals/update";
  private addNewFileUrl: string = BASE_URL + "api/generals/addNewFile";
  private getGeneralHoursUrl: string =
    BASE_URL + "api/generals/getGeneralHours";
  private getAccountsUrl: string = BASE_URL + "api/generals/getAccounts";
  private getWorkWeekUrl: string = BASE_URL + "api/generals/getWorkWeek";
  private updateWorkWeekUrl: string = BASE_URL + "api/generals/updateWorkWeek";
  private getSingleGeneralByKeyUrl: string =
    BASE_URL + "api/generals/getSingleGeneralByKey";
  private updateMometStatusUrl: string = BASE_URL + "api/generals/updateMometStatus";
  private getAllGeneralsSortedByKeyUrl: string = BASE_URL + "api/generals/getAllGeneralsSortedByKey";
  private getSPSEmailsUrl: string = BASE_URL + "api/companies/getSpsEmails";
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest",
    });
  }

  public getGenerals() {
    return this.http.get(this.getAllUrl, { headers: this.headers }).pipe(
      map((response) => {
        if (response["status"]) {
          return response["data"];
        }
        return [];
      }),
      catchError(() => [])
    );
  }

  public getGeneral(generalid: number): Observable<any> {
    return this.http
      .get(`${this.getGeneralUrl}/${generalid}`, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return null;
        })
      );
  }

  public updateItem(item) {
    return this.http 
      .post(this.updateGeneralUrl, item, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  addNewFile(data): Promise<any> {
    return this.http
    .post(this.addNewFileUrl, data, { headers: this.headers })
    .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  getGeneralHours(id) {
    return this.http
      .get(`${this.getGeneralHoursUrl}/${id}`, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return null;
        })
      );
  }

  getAccounts() {
    return this.http
      .get(`${this.getAccountsUrl}`, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return null;
        })
      );
  }

  getWorkWeek(): Promise<any> {
    return this.http
    .get(`${this.getWorkWeekUrl}`, { headers: this.headers })
    .pipe(
      map((response) => {
        if (response["status"]) {
          return response["data"];
        }
        return null;
      })
    ).toPromise2();
  }

  public updateWorkWeek(data) {
    return this.http
      .post(this.updateWorkWeekUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public getSingleGeneralByKey(key) {
    return this.http
      .post(this.getSingleGeneralByKeyUrl, key, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

    public updateMometStatus(value) {

        return this.http
        .post(this.updateMometStatusUrl, value, { headers: this.headers })
        .pipe(catchError(() => of({ status: false }))).toPromise2();        
    }

    public getAllGeneralsSortedByKey() {
        return this.http.get(this.getAllGeneralsSortedByKeyUrl, { headers: this.headers }).pipe(
            map((response) => {
                if (response["status"]) {
                    return response["data"];
                }
                    return [];
                }
            ),
            catchError(() => [])
        );
    }

    public getSPSEmails() {
      return this.http.get(this.getSPSEmailsUrl, { headers: this.headers }).pipe(
        map((response) => {
            if (response["status"]) {
                return response["data"];
            }
                return [];
            }
        ),
        catchError(() => [])
    );      
    }
}
