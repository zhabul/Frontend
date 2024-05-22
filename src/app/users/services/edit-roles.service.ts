import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of } from 'rxjs';
import { BaseResponse } from "src/app/generals/components/settings/interfaces/base-response";
import { BASE_URL } from "src/app/config";

@Injectable({
  providedIn: 'root'
})
export class EditRolesService {
  private updateRolePermissionsByRoleIdUrl: string = 'api/settings/updateUserPermissions';
 //private getRolesUrl: string = '';

  public selectedTab = '0'
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest"
    });
  }


  public updateRolePermissionsByRoleId(data) {
    return this.http
      .post(this.updateRolePermissionsByRoleIdUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  getRoles(role_id) {
    return this.http.get<BaseResponse>(
      BASE_URL + `api/settings/getUserPermission/${role_id}`
    );
  }

  setSelectedTab(value){
   this.selectedTab = value;
  }
  
  getSelectedTab(){
    return  this.selectedTab;
   }
 
}
