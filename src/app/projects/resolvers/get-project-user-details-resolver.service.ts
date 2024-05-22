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
export class getProjectUserDetailsResolverService implements Resolve<any> {
  constructor(private projectService: ProjectsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const projectId = route.queryParams.projectId || route.params.id || route.parent.params.id;

    return this.projectService
      .getProjectUserDetails(projectId)
      .then((projectUserDetails) => projectUserDetails);
  }
}
