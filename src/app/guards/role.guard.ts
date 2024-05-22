import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: "root",
})
export class RoleGuard implements CanActivate {
  constructor(
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    let dontHaveRole = "Project";
    const userPermissions = JSON.parse(sessionStorage.getItem("userDetails"));
    let hasPermission = false;

    if (next.data.projectRoles) {
      let params = null;
      if (next.params.hasOwnProperty("id")) {
        params = next.params;
      } else if (next.parent.params.hasOwnProperty("id")) {
        params = next.parent.params;
      }

      let projectId = params.id;

      if (next.queryParams && next.queryParams.projectId) {
        projectId = next.queryParams.projectId;
      }

      if (userPermissions.ProjectsRoles.data[projectId]) {
        hasPermission = next.data.projectRoles.every((role) => {

          if (userPermissions.ProjectsRoles.data[projectId][role] == 1) {
            return true;
          } else {
            dontHaveRole = role;
            return false;
          }
        });
      }
    } else {
      hasPermission = next.data.roles.every((role) => {
        
        if (userPermissions[role]) {
          return true;
        } else {
          dontHaveRole =
            this.translate.instant(
              role.split("_")[1][0].toUpperCase() +
                role.split("_")[1].substring(1)
            ) +
            " " +
            this.translate.instant(role.split("_")[2]);
          return false;
        }
      });
    }

    if (hasPermission) {
      return true;
    } else {
      this.toastr.error(
        this.translate.instant("You don't have permission to view") +
          ": " +
          dontHaveRole,
        this.translate.instant("Error")
      );
      return false;
    }
  }
}
