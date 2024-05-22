import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { ProjectsService } from "src/app/core/services/projects.service";
import { PlannedAbsence } from "../project-moments/resource-planning-app/models/PlannedAbsence";

@Injectable()
export class GetAllPlanedAbsencesResolverService
  implements Resolve<PlannedAbsence[]>
{
  constructor(private projectsService: ProjectsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    return this.projectsService
      .getAllPlanedAbsences()
      .then((projects) => projects);
  }
}
