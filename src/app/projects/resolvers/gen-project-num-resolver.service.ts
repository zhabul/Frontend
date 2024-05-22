import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { ProjectsService } from "src/app/core/services/projects.service";

@Injectable()
export class GenerateProjectNumberResolverService implements Resolve<any> {
  constructor(private projectsService: ProjectsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    return this.projectsService
      .getNextProjectNumber()
      .then((res: any) => res.number);
  }
}
