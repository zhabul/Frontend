import { Injectable } from "@angular/core";
import { BASE_URL } from "src/app/config";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class FortnoxApiService {
  private createClientUrl: string = BASE_URL + "api/fortnoxApi/createClient";
  private updateClientUrl: string = BASE_URL + "api/fortnoxApi/updateClient";
  private removeClientUrl: string = BASE_URL + "api/fortnoxApi/removeClient";

  private getAllAccountsUrl: string =
    BASE_URL + "api/fortnoxApi/getAllAccounts";
  private getAllEnabledAccountsUrl: string =
    BASE_URL + "api/fortnoxApi/getAllEnabledAccounts";
  private createAccountUrl: string = BASE_URL + "api/fortnoxApi/createAccount";
  private updateAccountUrl: string = BASE_URL + "api/fortnoxApi/updateAccount";
  private removeAccountUrl: string = BASE_URL + "api/fortnoxApi/removeAccount";
  private toggleAccountEnabledUrl: string =
    BASE_URL + "api/fortnoxApi/toggleAccountEnabled";
  private refreshAccountingPlanUrl: string =
    BASE_URL + "api/fortnoxApi/refreshAccountingPlan";

  private createProjectUrl: string = BASE_URL + "api/fortnoxApi/createProject";
  private updateProjectUrl: string = BASE_URL + "api/fortnoxApi/updateProject";
  private removeProjectUrl: string = BASE_URL + "api/fortnoxApi/removeProject";

  private getAllSupplierInvoicesUrl: string =
    BASE_URL + "api/fortnoxApi/getAllSupplierInvoices";
  private getSupplierInvoiceRowsUrl: string =
    BASE_URL + "api/fortnoxApi/getSupplierInvoiceRows";
  private getAllInvoicesUrl: string =
    BASE_URL + "api/fortnoxApi/getAllInvoices";

  private createInvoiceUrl: string = BASE_URL + "api/fortnoxApi/createInvoice";
  private getSupplierInvoiceAttachmentsUrl: string =
    BASE_URL + "api/fortnoxApi/getSupplierInvoiceAttachments";
  private toggleAccountFixedCostUrl: string =
    BASE_URL + "api/fortnoxApi/toggleAccountFixedCost";

  private storeFortnoxKeyUrl: string = BASE_URL + "api/fortnoxApi/storeFortnoxKey"; 
  private createOrUpdateFortnoxPropertiesUrl: string = BASE_URL + "api/fortnoxApi/createOrUpdateFortnoxProperties";
  private getFortnoxPropertiesUrl: string = BASE_URL + "api/fortnoxApi/getFortnoxProperties";

  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest",
    });
  }

  createClient(data): any {
    return this.http.post(this.createClientUrl, data, {
      headers: this.headers,
    });
  }

  updateClient(clientNumber, data): any {
    return this.http.post(`${this.updateClientUrl}/${clientNumber}`, data, {
      headers: this.headers,
    });
  }

  removeClient(clientNumber): any {
    return this.http.get(`${this.removeClientUrl}/${clientNumber}`, {
      headers: this.headers,
    });
  }

  getAllAccounts(): any {
    return this.http.get(this.getAllAccountsUrl, { headers: this.headers });
  }

  getAllEnabledAccounts(): any {
    return this.http.get(this.getAllEnabledAccountsUrl, {
      headers: this.headers,
    });
  }

  createAccount(data): any {
    return this.http.post(this.createAccountUrl, data, {
      headers: this.headers,
    });
  }

  updateAccount(accountNumber, data): any {
    return this.http.post(`${this.updateAccountUrl}/${accountNumber}`, data, {
      headers: this.headers,
    });
  }

  removeAccount(accountNumber): any {
    return this.http.get(`${this.removeAccountUrl}/${accountNumber}`, {
      headers: this.headers,
    });
  }

  toggleAccountEnabled(accountNumber, value): any {
    return this.http.get(
      `${this.toggleAccountEnabledUrl}/${accountNumber}/${value}`,
      {
        headers: this.headers,
      }
    );
  }

  toggleAccountFixedCost(accountNumber, value): any {
    return this.http.get(
      `${this.toggleAccountFixedCostUrl}/${accountNumber}/${value}`,
      {
        headers: this.headers,
      }
    );
  }

  refreshAccountingPlan(): any {
    return this.http.get(this.refreshAccountingPlanUrl, {
      headers: this.headers,
    });
  }

  createProject(data): any {
    return this.http.post(this.createProjectUrl, data, {
      headers: this.headers,
    });
  }

  updateProject(projectNumber, data): any {
    return this.http.post(`${this.updateProjectUrl}/${projectNumber}`, data, {
      headers: this.headers,
    });
  }

  removeProject(projectNumber): any {
    return this.http.get(`${this.removeProjectUrl}/${projectNumber}`, {
      headers: this.headers,
    });
  }

  getAllSupplierInvoices(): any {
    return this.http.get(this.getAllSupplierInvoicesUrl, {
      headers: this.headers,
    });
  }

  getAllInvoices(): any {
    return this.http.get(this.getAllInvoicesUrl, { headers: this.headers });
  }

  getSupplierInvoiceRows(invoice_id): any {
    return this.http.get(`${this.getSupplierInvoiceRowsUrl}/${invoice_id}`, {
      headers: this.headers,
    });
  }

  getSupplierInvoiceAttachments(invoice_id): any {
    return this.http.get(
      `${this.getSupplierInvoiceAttachmentsUrl}/${invoice_id}`,
      {
        headers: this.headers,
      }
    );
  }

  createInvoice(data): any {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(this.createInvoiceUrl, data, { headers: headers })
      .toPromise2();
  }

  storeFortnoxKey(data) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(this.storeFortnoxKeyUrl, data, { headers: headers })
      .toPromise2();    
  }

  createOrUpdateFortnoxProperties(data) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(this.createOrUpdateFortnoxPropertiesUrl, data, { headers: headers })
      .toPromise2();    
  }

  getFortnoxProperties(): any {
    return this.http.get(
      `${this.getFortnoxPropertiesUrl}`,
      {
        headers: this.headers,
      }
    ).toPromise2();
  }
}
