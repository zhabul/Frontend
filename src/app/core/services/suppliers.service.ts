import { Injectable } from "@angular/core";
import { BASE_URL } from "../../config/index";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, Observable, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SuppliersService {
  private getAllSuppliersUrl: string = BASE_URL + "api/suppliers/list";
  private addNewSupplierUrl: string = BASE_URL + "api/suppliers/new";
  private removeOneSupplierUrl: string = BASE_URL + "api/suppliers/remove";
  private updateOneSupplierUrl: string = BASE_URL + "api/suppliers/update";
  private getSupplierUrl: string = BASE_URL + "api/suppliers/get";
  private searchSuppliersUrl: string = BASE_URL + "api/suppliers/search";
  private getSupplierWorkersUrl: string =
    BASE_URL + "api/suppliers/getSupplierWorkers";
  private getSupplierWorkersFromProjectsSupliersTableUrl: string =
    BASE_URL + "api/suppliers/getSupplierWorkersFromProject";
  private addNewWorkerUrl: string =
    BASE_URL + "api/suppliers/addSupplierWorker";
  private getSupplierProfessionsUrl: string =
    BASE_URL + "api/suppliers/getSupplierProfessions";
  private removeOneSupplierWorkerUrl: string =
    BASE_URL + "api/suppliers/removeOneSupplierWorker";
  private getSupp_categoryUrl: string =
    BASE_URL + "api/suppliers/getSupp_category";
  private addSupp_categoryUrl: string =
    BASE_URL + "api/suppliers/addSupp_category";
  private addSupplierTitleUrl: string =
    BASE_URL + "api/suppliers/addSupplierTitle";
  private editSupplierTitleUrl: string =
    BASE_URL + "api/suppliers/editSupplierTitle";
  private deleteSupplierTitleUrl: string =
    BASE_URL + "api/suppliers/deleteSupplierTitle";
  private getSupplierCategoriesUrl: string =
    BASE_URL + "api/suppliers/getSupplierCategories";
  private addSupplierCategoryUrl: string =
    BASE_URL + "api/suppliers/addSupplierCategory";
  private editSupplierCategoryUrl: string =
    BASE_URL + "api/suppliers/editSupplierCategory";
  private deletevCategoryUrl: string =
    BASE_URL + "api/suppliers/deleteSupplierCategory";
  private getSuppliersByCateogryIdUrl: string =
    BASE_URL + "api/suppliers/getSuppliersByCateogryId";
  private addProjectMaterialSupplierUrl: string =
    BASE_URL + "api/projects/addProjectMaterialSupplier";
  private getProjectMaterialSupplierUrl: string =
    BASE_URL + "api/projects/getProjectMaterialSupplier";
  private deleteProjectMaterialSupplierUrl: string =
    BASE_URL + "api/projects/deleteProjectMaterialSupplier";
  private addToCompletedSupplierInvoicesUrl: string =
    BASE_URL + "api/suppliers/addToCompletedSupplierInvoices";
  private getCompletedSupplierInvoicesUrl: string =
    BASE_URL + "api/suppliers/getCompletedSupplierInvoices";
  private getSupplierInvoiceAttachmentsUrl: string =
    BASE_URL + "api/suppliers/getSupplierInvoiceAttachments";
  private getProjectCategorySuppliersUrl: string =
    BASE_URL + "api/suppliers/getProjectCategorySuppliers";
  private getAllSupplierInvoicesUrl: string =
    BASE_URL + "api/suppliers/getAllSupplierInvoices";
  private changeSupplierInvoiceProjectUrl: string =
    BASE_URL + "api/suppliers/changeSupplierInvoiceProject";
  private getCompletedSupplierInvoicesForAtaUrl: string =
    BASE_URL + "api/suppliers/getCompletedSupplierInvoicesForAta";
  private getCompletedSupplierInvoicesForDUUrl: string =
    BASE_URL + "api/suppliers/getCompletedSupplierInvoicesForDU";
  private searchUrl: string = BASE_URL + "api/suppliers/search";
  private createOrUpdateWorkerUrl: string = BASE_URL + "api/suppliers/createOrUpdateWorker";
  private removeSupplierInvoiceUrl: string = BASE_URL + "api/suppliers/removeSupplierInvoice";
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest",
    });
  }

  public getSuppliers(page = 0) {
    return this.http
      .get(`${this.getAllSuppliersUrl}/${page}`, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return [];
        }),
        catchError(() => [])
      );
  }

  public addNewSupplier(data): Observable<any> {
    return this.http
      .post(`${this.addNewSupplierUrl}`, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public removeOneSupplier(supplierid: number): Observable<any> {
    return this.http
      .get(`${this.removeOneSupplierUrl}/${supplierid}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public removeOneSupplierWorker(workerid: number): Observable<any> {
    return this.http
      .get(`${this.removeOneSupplierWorkerUrl}/${workerid}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  public updateOneSupplier(supplier) {
    return this.http
      .post(this.updateOneSupplierUrl, supplier, { headers: this.headers })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  public getOneSupplier(supplier_id) {
    return this.http
      .get(`${this.getSupplierUrl}/${supplier_id}`, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return null;
        })
      );
  }

  searchByName(name) {
    name = encodeURI(name);
    return this.http.get(`${this.searchSuppliersUrl}/${name}`, {
      headers: this.headers,
    });
  }

  getSupplierWorkers(supplier_id) {
    return this.http
      .get(`${this.getSupplierWorkersUrl}/${supplier_id}`, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return [];
        }),
        catchError(() => [])
      );
  }

  getSupplierWorkersFromProjectsSupliersTable(TitleID, ProjectID) {
    return this.http
      .get(
        `${this.getSupplierWorkersFromProjectsSupliersTableUrl}/${TitleID}/${ProjectID}`,
        { headers: this.headers }
      )
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return [];
        }),
        catchError(() => [])
      );
  }

  public addOneWorker(data): Promise<any> {
    return this.http
      .post(`${this.addNewWorkerUrl}`, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  getSupplierProfessions() {
    return this.http
      .get(`${this.getSupplierProfessionsUrl}`, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return [];
        }),
        catchError(() => [])
      );
  }

  public addSupp_category(date, user_id, project_id) {
    const user = {
      date: date,
      user_id: user_id,
      project_id: project_id,
    };

    return this.http
      .post(this.addSupp_categoryUrl, user, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public getSupp_category() {
    return this.http
      .get(this.getSupp_categoryUrl, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return [];
        }),
        catchError(() => [])
      );
  }

  public addSupplierTitle(supplierName): any {
    return this.http
      .post(this.addSupplierTitleUrl, { supplierName }, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public editSupplierTitle(id, supplierName): any {
    return this.http
      .post(
        this.editSupplierTitleUrl,
        { id, supplierName },
        { headers: this.headers }
      )
      .pipe(catchError(() => of({ status: false })));
  }

  public deleteSupplierTitle(id): any {
    return this.http
      .get(`${this.deleteSupplierTitleUrl}/${id}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public getSupplierCategories(): Observable<any> {
    return this.http
      .get(this.getSupplierCategoriesUrl, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public addSupplierCategory(name): Observable<any> {
    return this.http
      .post(this.addSupplierCategoryUrl, { name }, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public editSupplierCategory(id, name): Observable<any> {
    return this.http
      .post(this.editSupplierCategoryUrl, { id, name }, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public deleteSupplierCategory(supplierCategories): Observable<any> {
    return this.http
      .post(
        this.deletevCategoryUrl,
        { categories: supplierCategories },
        { headers: this.headers }
      )
      .pipe(catchError(() => of({ status: false })));
  }

  public getSuppliersByCateogryId(cateogryId) {
    return this.http
      .get(`${this.getSuppliersByCateogryIdUrl}/${cateogryId}`, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return [];
        }),
        catchError(() => [])
      );
  }

  public addProjectMaterialSupplier(projectId, cateogryId, supplierId) {
    return this.http
      .post(
        this.addProjectMaterialSupplierUrl,
        { projectId, cateogryId, supplierId },
        { headers: this.headers }
      )
      .pipe(catchError(() => of({ status: false })));
  }

  public getProjectMaterialSupplier(projectId) {
    return this.http
      .get(`${this.getProjectMaterialSupplierUrl}/${projectId}`, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return [];
        }),
        catchError(() => [])
      );
  }

  public deleteProjectMaterialSupplier(id) {
    return this.http
      .get(`${this.deleteProjectMaterialSupplierUrl}/${id}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public addToCompletedSupplierInvoices(invoices) {
    return this.http
      .post(this.addToCompletedSupplierInvoicesUrl, invoices, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public getCompletedSupplierInvoices() {
    return this.http
      .get(this.getCompletedSupplierInvoicesUrl, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public getSupplierInvoiceAttachments(invoiceId) {
    return this.http
      .get(`${this.getSupplierInvoiceAttachmentsUrl}${invoiceId}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public getProjectCategorySuppliers(orderId) {
    return this.http
      .get(`${this.getProjectCategorySuppliersUrl}/${orderId}`, {
        headers: this.headers,
      })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return [];
        }),
        catchError(() => [])
      );
  }

  public getAllSupplierInvoices(onlyFirst50) {
    return this.http
      .get(`${this.getAllSupplierInvoicesUrl}/${onlyFirst50}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  public changeSupplierInvoiceProject(invoiceId, newProjectId) {
    return this.http
      .get(
        `${this.changeSupplierInvoiceProjectUrl}/${invoiceId}/${newProjectId}`,
        { headers: this.headers }
      )
      .pipe(catchError(() => of({ status: false })));
  }

  public getCompletedSupplierInvoicesForAta(ataId, parentAtaId, wrId) {
    return this.http
      .get(
        `${this.getCompletedSupplierInvoicesForAtaUrl}/${ataId}/${parentAtaId}/${wrId}`,
        { headers: this.headers }
      )
      .pipe(catchError(() => of({ status: false })));
  }

  public getCompletedSupplierInvoicesForDU(projectId) {
    return this.http
      .get(`${this.getCompletedSupplierInvoicesForDUUrl}/${projectId}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  public searchByArgument(argument, projectId) {
    return this.http
      .get(`${this.searchUrl}/${argument}/${projectId}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public createOrUpdateWorker(data) {
    return this.http
      .post(this.createOrUpdateWorkerUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));    
  }

  public removeSupplierInvoice(supplier_id) {
    return this.http
      .post(this.removeSupplierInvoiceUrl, supplier_id, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));    
  }
}
