import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { ProjectsService } from "../../core/services/projects.service";

@Injectable()
export class ProjectResolverService implements Resolve<any> {
  constructor(
    private projectsService: ProjectsService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    return this.projectsService
      .getProject(route.params.id || route.parent.params.id)
      .then((project) => {
        if (project) {
          return project;
        } else {
          this.router.navigateByUrl("/");
        }
      });
  }
}
