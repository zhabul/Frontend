import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BASE_URL } from "../../config";
import { map, of, catchError, Observable } from "rxjs";
import 'src/app/core/extensions/rxjs-observable-promise';

@Injectable({
  providedIn: "root",
})
export class MaterialsService {
  private getAllUrl: string = BASE_URL + "api/materials/list";
  private getSubMaterialsUrl: string = BASE_URL + "api/materials/sublist";
  private newCategoryUrl: string = BASE_URL + "api/materials/new";
  private newSubCategoryUrl: string = BASE_URL + "api/materials/subnew";
  private newSubMaterialUrl: string = BASE_URL + "api/materials/itemnew";
  private getCategoryItemsUrl: string = BASE_URL + "api/materials/list";
  private getSubCategoryItemsUrl: string = BASE_URL + "api/materials/sublist";
  private removeSubCategoryUrl: string = BASE_URL + "api/materials/remove";
  private removeCategoryUrl: string = BASE_URL + "api/materials/subremove";
  private removeSubMaterialUrl: string = BASE_URL + "api/materials/itemremove";
  private addMaterialToCategoryUrl: string = BASE_URL + "api/materials/add";
  private getMaterialUrl: string = BASE_URL + "api/materials/single";
  private updateMaterialUrl: string = BASE_URL + "api/materials/update";
  private updateCategoryQuickUrl: string =
    BASE_URL + "api/materials/updatequick";
  private updateSubcategoryQuickUrl: string =
    BASE_URL + "api/materials/updatesubcategoryquick";
  private updateMaterialQuickUrl: string =
    BASE_URL + "api/materials/updatematerialquick";
  private removeMaterialUrl: string = BASE_URL + "api/materials/remove/single";
  private getAllUnitsUrl: string = BASE_URL + "api/materials/get/units";
  private getUnitsSortedByArticleTypeUrl: string =
    BASE_URL + "api/materials/get/getUnitsSortedByArticleType";
  private getMaterialUnitsUrl: string =
    BASE_URL + "api/materials/get/materialunits";
  private updateMaterialUnitsUrl: string =
    BASE_URL + "api/materials/updatematerialunits";
  private updateAdditionalWorkUnitsUrl: string =
    BASE_URL + "api/materials/updateadditionalworkunits";
  private updateOtherUEUnitsUrl: string =
    BASE_URL + "api/materials/updateotherueunits";
    private updateMileageUnitsUrl: string =
    BASE_URL + "api/materials/updatemileageunits";
  private createNewUnitUrl: string = BASE_URL + "api/materials/createnewunit";
  private deleteUnitUrl: string = BASE_URL + "api/materials/deleteunit";
  private getOtherUEUnitsUrl: string =
    BASE_URL + "api/materials/get/otherunits";
  private getSelectedUnitsUrl: string =
    BASE_URL + "api/materials/get/additionalworkunits";
  private getMileageUnitsUrl: string =
    BASE_URL + "api/materials/get/mileageunits";
  private saveCategorySortUrl: string =
    BASE_URL + "api/materials/savecategorysort";
  private saveSubmaterialSortUrl: string =
    BASE_URL + "api/materials/savesubmaterialsort";
  private saveMaterialSortUrl: string =
    BASE_URL + "api/materials/savematerialsort";
  private getAllMaterialPropertiesUrl: string =
    BASE_URL + "api/materials/getAllMaterialProperties";
  private getMaterialInOrderUrl: string = BASE_URL + "api/materials/single";

  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest",
    });
  }

  public getMaterials() {
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

  public getSubMaterials() {
    return this.http
      .get(this.getSubMaterialsUrl, { headers: this.headers })
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

  public createMaterialCategory(category) {
    return this.http
      .post(this.newCategoryUrl, category, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public createMaterialSubCategory(subcategory) {
    return this.http
      .post(this.newSubCategoryUrl, subcategory, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public createSubMaterial(submaterial) {
    return this.http
      .post(this.newSubMaterialUrl, submaterial, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public getMaterialCategory(id) {
    return this.http
      .get(`${this.getCategoryItemsUrl}/${id}`, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return null;
        })
      );
  }

  public getSubCategory(id) {
    return this.http
      .get(`${this.getSubCategoryItemsUrl}/${id}`, {
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

  public removeMaterialCategory(id) {
    return this.http
      .post(`${this.removeCategoryUrl}/${id}`, "", { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public removeMaterialSubCategory(id) {
    return this.http
      .post(`${this.removeSubCategoryUrl}/${id}`, "", { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public removeSubMaterial(id) {
    return this.http
      .post(`${this.removeSubMaterialUrl}/${id}`, "", { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public addMaterialToCategory(data) {
    return this.http
      .post(this.addMaterialToCategoryUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public getMaterial(id) {
    return this.http
      .get(`${this.getMaterialUrl}/${id}`, { headers: this.headers })
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

  public updateMaterial(data) {
    return this.http
      .post(this.updateMaterialUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public updateCategoryQuick(data) {
    return this.http
      .post(this.updateCategoryQuickUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public updateSubcategoryQuick(data) {
    return this.http
      .post(this.updateSubcategoryQuickUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public updateMaterialQuick(data) {
    return this.http
      .post(this.updateMaterialQuickUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public removeMaterial(id: number): Observable<any> {
    return this.http
      .get(`${this.removeMaterialUrl}/${id}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public getAllUnits(): Observable<any> {
    return this.http
      .get(`${this.getAllUnitsUrl}`, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return null;
        })
      );
  }

  public getUnitsSortedByArticleType(): Observable<any> {
    return this.http
      .get(`${this.getUnitsSortedByArticleTypeUrl}`, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return null;
        })
      );
  }

  public getMaterialUnits(): Observable<any> {
    return this.http
      .get(`${this.getMaterialUnitsUrl}`, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return null;
        })
      );
  }

  public updateMaterialUnits(data): Promise<any> {
    return this.http
      .post(this.updateMaterialUnitsUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  public updateAdditionalWorkUnits(data): Promise<any> {
    return this.http
      .post(this.updateAdditionalWorkUnitsUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  public updateOtherUEUnits(data): Promise<any> {
    return this.http
      .post(this.updateOtherUEUnitsUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  public updateMileageUnits(data): Promise<any> {
    return this.http
      .post(this.updateMileageUnitsUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  createNewUnit(data) {
    return this.http
      .post(this.createNewUnitUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  deleteUnit(unit_id: number) {
    return this.http
      .get(`${this.deleteUnitUrl}/${unit_id}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public getOtherUEUnits(): Observable<any> {
    return this.http
      .get(`${this.getOtherUEUnitsUrl}`, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return null;
        })
      );
  }

  public getSelectedUnits(): Observable<any> {
    return this.http
      .get(`${this.getSelectedUnitsUrl}`, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return null;
        })
      );
  }

  
  public getMileageUnits(): Promise<any> {
    return this.http
      .get(`${this.getMileageUnitsUrl}`, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return null;
        })
      ).toPromise2();
  }

  public getUnits() {
    return this.http
      .get(this.getAllUnitsUrl, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public saveCategorySort(data): Promise<any> {
    return this.http
    .post(this.saveCategorySortUrl, data, { headers: this.headers })
    .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  public saveSubmaterialSort(data): Promise<any> {
    return this.http
    .post(this.saveSubmaterialSortUrl, data, { headers: this.headers })
    .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  public saveMaterialSort(data): Promise<any> {
    return this.http
    .post(this.saveMaterialSortUrl, data, { headers: this.headers })
    .pipe(
      map((response) => {
        if (response["status"]) {
          return response["data"];
        }
        return null;
      })
    ).toPromise2();
  }

  public getAllMaterialProperties() {
    return this.http
      .get(this.getAllMaterialPropertiesUrl, { headers: this.headers })
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

  public getMaterialInOrder(id, projectId) {
    return this.http
      .post(
        this.getMaterialInOrderUrl,
        { id, projectId },
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

  public getCategoriesInOrder(projectId) {
    return this.http
      .get(`${BASE_URL}api/materials/categories/project/${projectId}`, {
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

  public getSubCategoriesInOrder(id, projectId) {
    return this.http
      .post(
        `${BASE_URL}api/materials/subcategories/project`,
        { id, projectId },
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

  public getMaterialsInOrder(id, projectId) {
    return this.http
      .post(
        `${BASE_URL}api/materials/list/project`,
        { id, projectId },
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
}
