import { Injectable } from "@angular/core";
import { BASE_URL } from "../../config/index";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  Subject,
  BehaviorSubject,
  of,
  catchError,
  map,
  Observable,
} from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ClientsService {
  private getAllClientsUrl: string = BASE_URL + "api/clients/list";
  private searchClientsUrl: string = BASE_URL + "api/clients/search";
  private getAllClientWorkersUrl: string =
    BASE_URL + "api/clients/clientworkers";
  private getAllClientWorkersFromProjectUrl: string =
    BASE_URL + "api/clients/workers";
  private getClientDetailsFromClientId: string =
    BASE_URL + "api/clients/details/";
  private getClientUrl: string = BASE_URL + "api/clients/get";
  private updateOneClientUrl: string = BASE_URL + "api/clients/update";
  private removeClientUrl: string = BASE_URL + "api/clients/remove";
  private addNewClientUrl: string = BASE_URL + "api/clients/new";
  private updateOneClientStatusUrl: string =
    BASE_URL + "api/clients/update/status";
  private removeWorkerUrl: string = BASE_URL + "api/clients/workers/remove";
  private addNewWorkerUrl: string = BASE_URL + "api/clients/workers/add";
  private getOneClientInvoiceUrl: string =
    BASE_URL + "api/clients/invoices/get";
  private updateOneClientInvoiceUrl: string =
    BASE_URL + "api/clients/invoices/update";
  private addNewClientInvoiceUrl: string =
    BASE_URL + "api/clients/invoices/add";
  private getClientCategoriesUrl: string =
    BASE_URL + "api/clients/getClientCategories";
  private addClientCategoryUrl: string =
    BASE_URL + "api/clients/addClientCategory";
  private editClientCategoryUrl: string =
    BASE_URL + "api/clients/editClientCategory";
  private deleteClientCategoryUrl: string =
    BASE_URL + "api/clients/deleteClientCategory";
  private uploadUrl: string = BASE_URL + "api/clients/uploadDocument";
  private urlDocuments: string =
    BASE_URL + "api/clients/getAllDocumentsByClient";
  private removeDocumentUrl: string = BASE_URL + "api/clients/removeDocument";
  private removeSelectedDocumentsUrl: string =
    BASE_URL + "api/clients/removeSelectedDocuments";
  private updateClientWorkerUrl: string = BASE_URL + "api/clients/updateClientWorker";


  public client = new BehaviorSubject<any>(null);
  public clientWorker = new BehaviorSubject<any>(null);
  public showNewClientForm = new Subject<number>();
  public getCategory = new Subject<any>();
  public currentCategoryId = new BehaviorSubject<any>(null);
  public onNewCategory = new Subject<any>();
  public formatMobileNumberUrl = BASE_URL + "api/clients/formatMobileNumber";

  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest",
    });
  }

  public getOneClient(client_id) {
    return this.http
      .get(`${this.getClientUrl}/${client_id}`, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return null;
        })
      );
  }

  public getClients(page = 0) {
    // return this.http.get(`${this.getAllClientsUrl}/${page}`, {
    //   headers: this.headers,
    // });
    return this.http.get(`${this.getAllClientsUrl}`, {
      headers: this.headers,
    });
  }

  setClient(data) {
    this.client.next(data);
  }

  setComponentVisibility(show: number) {
    this.showNewClientForm.next(show);
  }

  public getClientWorkers(client_id) {
    return this.http.get(`${this.getAllClientWorkersUrl}/${client_id}`, {
      headers: this.headers,
    });
  }

  public getClientWorkersFromProject(project_id) {
    return this.http
      .get(`${this.getAllClientWorkersFromProjectUrl}/${project_id}`, {
        headers: this.headers,
      })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return [];
        }),
        catchError(() => of([]))
      );
  }

  searchByName(name) {
    name = encodeURI(name);
    return this.http.get(`${this.searchClientsUrl}/${name}`, {
      headers: this.headers,
    });
  }

  getClient(client_id) {
    return this.http
      .get(`${this.getClientDetailsFromClientId}/${client_id}`, {
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

  public updateOneClient(client) {
    return this.http
      .post(this.updateOneClientUrl, client, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  getOneClientInvoice(client_id) {
    return this.http
      .get(`${this.getOneClientInvoiceUrl}/${client_id}`, {
        headers: this.headers,
      })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return of(client_id);
        })
      );
  }

  public updateOneClientInvoice(client): Promise<any> {
    return this.http
      .post(this.updateOneClientInvoiceUrl, client, { headers: this.headers })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  public addNewClientInvoice() {
    return this.http
      .post(this.addNewClientInvoiceUrl, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public removeOneClient(clientid: number): Observable<any> {
    return this.http
      .get(`${this.removeClientUrl}/${clientid}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public addNewClient(data): Observable<any> {
    return this.http
      .post(`${this.addNewClientUrl}`, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public updateOneClientStatus(client_id, status) {
    return this.http
      .post(
        this.updateOneClientStatusUrl,
        { client_id, status },
        { headers: this.headers }
      )
      .pipe(catchError(() => of({ status: false })));
  }

  public removeOneWorker(workerid: number): Observable<any> {
    return this.http
      .get(`${this.removeWorkerUrl}/${workerid}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public addOneWorker(data): Observable<any> {
    return this.http
      .post(`${this.addNewWorkerUrl}`, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public getClientCategories(): Observable<any> {
    return this.http
      .get(this.getClientCategoriesUrl, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public addClientCategory(name): Observable<any> {
    return this.http
      .post(this.addClientCategoryUrl, { name }, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public editClientCategory(id, name): Observable<any> {
    return this.http
      .post(this.editClientCategoryUrl, { id, name }, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public deleteClientCategory(clientCategoryId): Observable<any> {
    return this.http
      .get(`${this.deleteClientCategoryUrl}/${clientCategoryId}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  uploadDocument(id, file: File): Observable<any> {
    const formdata: FormData = new FormData();
    formdata.append("file", file);
    const url = `${this.uploadUrl}/${id}`;
    return this.http
      .post(url, formdata)
      .pipe(catchError(() => of({ status: false })));
  }

  public getDocuments(client_id): Observable<any> {
    return this.http
      .get(`${this.urlDocuments}/${client_id}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  removeDocument(documentId) {
    return this.http
      .post(`${this.removeDocumentUrl}/${documentId}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  removeSelectedDocuments(data) {
    return this.http
      .post(this.removeSelectedDocumentsUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  formatMobileNumber(mobile_number) {
    return this.http
      .post(this.formatMobileNumberUrl, mobile_number, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  updateClientWorker(clientWorker) {
    return this.http
      .post(this.updateClientWorkerUrl, clientWorker, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));    
  }
}
