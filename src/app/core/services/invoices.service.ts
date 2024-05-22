import { Injectable } from "@angular/core";
import { BASE_URL } from "../../config/index";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, Observable, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class InvoicesService {
  private addNewInvoicetUrl: string = BASE_URL + "api/invoices/new";
  private getInvoiceDetails: string = BASE_URL + "api/invoices/getInvoices";
  private getProjectInvoiceDetails: string =
    BASE_URL + "api/invoices/getProjectInvoices";
  private searchInvoiceUrl: string = BASE_URL + "api/invoices/status";
  private getInvoiceDetailsFromInvoiceId: string =
    BASE_URL + "api/invoice/details";
  private getFromFortnox: string = BASE_URL + "api/fortnoxApi/invoice";
  private getInvoicesByClient: string =
    BASE_URL + "api/fortnoxApi/getInvoicesByClient";
  private updateInvoiceUrl: string = BASE_URL + "api/invoice/update";
  private removeInvoiceUrl: string = BASE_URL + "api/invoice/remove";
  private attachemntUrl: string =
    BASE_URL + "api/fortnoxApi/getSupplierInvoiceAttachments";
  private getWeeklyReportsUrl: string =
    BASE_URL + "api/invoice/getWeeklyReports";
  private updateSupplierInvoiceUrl: string =
    BASE_URL + "api/invoice/updateSupplierInvoice";
  private finishInvoiceUrl: string = BASE_URL + "api/invoice/finishInvoice";
  private getAllNotCompletedInvoicesForProjectUrl: string =
    BASE_URL + "api/invoice/getAllNotCompletedInvoicesForProject";
  private createCreditInvoiceUrl: string = BASE_URL + "api/invoice/createCreditInvoice";
  private headers: HttpHeaders;
  private createSupplierInvoiceUrl: string =
    BASE_URL + "api/invoice/createSupplierInvoice";

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest",
    });
  }

  public addNewInvoice(data): Observable<any> {
    return this.http
      .post(`${this.addNewInvoicetUrl}`, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getInvoices(page = 0) {
    return this.http
      .get(`${this.getInvoiceDetails}/${page}`, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return null;
        })
      );
  }

  getProjectInvoices(project_id) {
    return this.http
      .get(`${this.getProjectInvoiceDetails}/${project_id}`, {
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

  searchByStatus(date, status, searchText) {
    return this.http
      .post(
        this.searchInvoiceUrl,
        { date, status, searchText },
        { headers: this.headers }
      )
      .pipe(catchError(() => of({ status: false })));
  }

  getInvoice(invoice_id) {
    return this.http
      .get(`${this.getInvoiceDetailsFromInvoiceId}/${invoice_id}`, {
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

  getInvoicesForClientFromFortnox(client_id) {
    return this.http
      .get(`${this.getInvoicesByClient}/${client_id}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  getInvoiceFromFortnox(invoice_id) {
    return this.http
      .get(`${this.getFromFortnox}/${invoice_id}`, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return null;
        })
      );
  }

  updateInvoice(invoice) {
    return this.http
      .post(this.updateInvoiceUrl, invoice, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  createCreditInvoice(invoice_id) {
    return this.http
      .post(this.createCreditInvoiceUrl, invoice_id, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  removeInvoice(invoiceId) {
    return this.http
      .post(`${this.removeInvoiceUrl}/${invoiceId}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getAttachment(invoiceId) {
    return this.http
      .post(`${this.attachemntUrl}/${invoiceId}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getWeeklyReports(project_id) {
    return this.http
      .get(`${this.getWeeklyReportsUrl}/${project_id}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  updateSupplierInvoice(data) {
    return this.http
      .post(this.updateSupplierInvoiceUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  createSupplierInvoice(data) {
    return this.http
      .post(this.createSupplierInvoiceUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  finishInvoice(data) {
    return this.http
      .post(this.finishInvoiceUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getAllNotCompletedInvoicesForProject(projectId, debit_id) {
    return this.http
      .get(
        `${this.getAllNotCompletedInvoicesForProjectUrl}/${projectId}/${debit_id}`,
        { headers: this.headers }
      )
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return null;
        })
      );
  }
}
