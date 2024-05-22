import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BASE_URL } from "../../config";

@Injectable({
  providedIn: "root",
})
export class GeneralService {
  public updateGeneralInformationUrl: string =
    BASE_URL + "api/generals/updateGeneralInformation";

  constructor(private http: HttpClient) {}

  updateGeneralInformation(data) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http.post(this.updateGeneralInformationUrl, data, {
      headers: headers,
    });
  }
}
