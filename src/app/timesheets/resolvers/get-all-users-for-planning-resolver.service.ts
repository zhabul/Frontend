import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { ProjectsService } from "src/app/core/services/projects.service";

@Injectable()
export class GetAllUsersForPlanningResolverService implements Resolve<any> {
  constructor(private projectService: ProjectsService) {}

  resolve(): Promise<any> {
    return this.projectService.getAllUsersForPlanning();
  }
}
