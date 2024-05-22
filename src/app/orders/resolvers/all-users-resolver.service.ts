import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { UsersService } from "../../core/services/users.service";
import { ProjectsService } from "../../core/services/projects.service";

@Injectable()
export class AllUsersResolver implements Resolve<any> {
  constructor(
    private usersService: UsersService,
    private projectsService: ProjectsService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    const id = route.params.project_id;
    const promise1 = this.usersService.getUsersProjects(id).toPromise2();
    const promise2 =
      this.projectsService.getProjectInformationActiveCompanyWorkers(id);

    return Promise.all([promise1, promise2]);
  }
}
