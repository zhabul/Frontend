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
export class CreateRegistersResolverService implements Resolve<any> {
  constructor(private projectsService: ProjectsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.projectsService
      .getProjectRegister(route.params.id || route.parent.params.id)
      .then((register) => register);
  }
}
