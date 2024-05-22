import { Injectable } from "@angular/core";
import { BASE_URL } from "../../config/index";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ComponentAccessService {
  private getComponentVisibilities: string =
    BASE_URL + "api/visibility/getComponentVisibilities";

  constructor(private http: HttpClient) {}

  public getComponentVisibility(): Observable<any> {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http.get(this.getComponentVisibilities, { headers: headers });
  }
}
