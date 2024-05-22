import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { ProjectsService } from "src/app/core/services/projects.service";

@Injectable()
export class GetProjectsForPlanningResolverService implements Resolve<any> {
  constructor(private projectService: ProjectsService) {}

  resolve(): Promise<any> {
    return this.projectService.getProjectsForPlanning();
  }
}
