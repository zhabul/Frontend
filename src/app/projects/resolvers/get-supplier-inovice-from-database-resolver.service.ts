import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { ProjectsService } from "src/app/core/services/projects.service";

@Injectable({
  providedIn: "root",
})
export class getSupplierInoviceFromDatabaseResolverService
  implements Resolve<any>
{
  constructor(private projectsService: ProjectsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.projectsService
      .getSupplierInoviceFromDatabaseResolverService(route.params.id, 20, 0, 0)
      .then((invoices) => invoices);
  }
}
