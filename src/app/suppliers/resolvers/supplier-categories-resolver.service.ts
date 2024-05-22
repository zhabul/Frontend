import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { SuppliersService } from "src/app/core/services/suppliers.service";

@Injectable()
export class SupplierCategoriesResolverService implements Resolve<any> {
  constructor(private suppliersService: SuppliersService) {}

  resolve(): Observable<any> {
    return this.suppliersService
      .getSupplierCategories();
  }
}
