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
export class GetProjectInformationActiveCompanyWorkersResolverService
  implements Resolve<any>
{
  constructor(private projectService: ProjectsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.projectService
      .getProjectInformationActiveCompanyWorkers(
        route.params.id || route.parent.params.id
      )
      .then((workers) => workers);
  }
}
