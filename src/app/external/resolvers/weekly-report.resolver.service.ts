import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { ProjectsService } from "../../core/services/projects.service";

@Injectable()
export class WeeklyReportResolver implements Resolve<any> {
  constructor(private projectsService: ProjectsService) {}

  resolve(route: ActivatedRouteSnapshot): Promise<any> {
    return this.projectsService.getWeeklyReportForApproval(
      route.params.reportId,
      route.params.answerEmail,
      route.params.cwId,
      route.params.group
    );
  }
}
