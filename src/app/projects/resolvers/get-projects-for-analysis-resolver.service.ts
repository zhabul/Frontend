import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { ProjectsService } from "../../core/services/projects.service";
@Injectable()
export class getProjectsForAnalysisResolverService
  implements Resolve<any>
{
  constructor(private projectsService: ProjectsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    return this.projectsService
      .getProjectsForAnalysis(route.params.id)
      .then((projectWeekyReports) => projectWeekyReports);
  }
}
