import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { MaterialsService } from "src/app/core/services/materials.service";

@Injectable({
  providedIn: "root",
})
export class GetMaterialPropertiesResolverService implements Resolve<any> {
  constructor(private materialsService: MaterialsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.materialsService
      .getAllMaterialProperties();
  }
}
