import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { ProjectMomentsComponent } from "./project-moments/project-moments.component";
import { ProjectsResolver } from "src/app/projects/resolvers/projects-resolver.service";
import { ProjectUsersResolverService } from "src/app/moments/resolvers/project-users-resolver.service";
import { PlanerComponent } from "./moments-planer/components/planer/planer.component";
import { ActiveDateProjectsResolverService } from "src/app/moments/resolvers/active-date-projects-resolver.service";
// import { ProjectSchedulePlanerComponent } from "./moments-planer/components/project-schedule-planer/project-schedule-planer.component";
import { ProjectMomentsResolverService } from "./resolvers/project-moments-resolver.service";
import { ProjectResolverService } from "src/app/projects/resolvers/project-resolver.service";
import { ProjectPlanConnectionsResolverService } from "./resolvers/project-plan-connections-resolver.service";
import { RoleGuard } from "../guards/role.guard";
import { UserProjectSchedulePlannerComponent } from "./moments-planer/components/planer/user-project-schedule-planner/user-project-schedule-planner.component";
import { ProjectArbitraryDatesResolverService } from "./resolvers/project-arbitrary-dates-resolver.service";
import { getAllProjectPlanCoworkersResolverService } from "./resolvers/get-all-project-plan-coworkers-resolver.service";
import { AddUserToProjectComponent } from "./components/add-user-to-project/add-user-to-project.component";
import { UsersResolver } from "src/app/users/resolvers/users-resolver.service";
import { getDefaultMomentsResolverService } from "src/app/moments/resolvers/getDefaultMoments-resolver.service";
import { excuteMomentCronResolverService } from "src/app/moments/resolvers/excute-moment-cron-resolver.service";
import { AddUserToChildrenProjectComponent } from "./components/add-user-to-children-project/add-user-to-children-project.component";
import { getUsersWithMomentsService } from "src/app/moments/resolvers/get-users-with-moments.service";
import { AuthGuard } from "../guards/auth.guard";
import { AllUsersResolver } from "../users/resolvers/all-users-resolver.service";
import { UsersWantToBeAddedOnProjectReslover } from "../users/resolvers/users-want-to-be-added-on-project-reslover.service";
import { ProjectUserResolverService } from "../projects/resolvers/project-user-resolver";
import { GetProjectsForPlanningResolverService } from "../timesheets/resolvers/get-projects-for-planning-resolver.service";
import { GetAllUsersForPlanningResolverService } from "../timesheets/resolvers/get-all-users-for-planning-resolver.service";
import { GetPublicHolidayDatesResolverService } from "../timesheets/resolvers/get-public-holiday-dates-resolver.service";
import { GetAllResourcePlanningColumnsResolverService } from "../timesheets/resolvers/get-all-resource-planning-columns-resolver.service";
import { GetAllUnassignedUsersForPlanningResolverService } from "../timesheets/resolvers/get-all-unassigned-users-for-planning-resolver.service";
import { TimeRegistrationAdminComponent } from "./components/time-registration-admin/time-registration-admin.component";
import { GetAllPlanedAbsencesResolverService } from "./resolvers/get-all-planed-absences-resolver.service";
import { ProjectSchedulePlanerCanvasComponent } from "./project-moments-schedule-planer/project-schedule-planer-canvas/project-schedule-planer-canvas.component";
import { ScheduleGetPlanState } from './resolvers/schedule-get-plan-state.service';
import { getAllScheduleColumnsService } from "./resolvers/get-all-schedule-columns-resolver.service";
import { getAllScheduleRevisionByProjectsService } from "./resolvers/get-all-schedule-revisions-by-project";
import { getAllScheduleRevisionImageService } from "./resolvers/get-all-schedule-revisions-image";
import { GetAllPlanedScheduleAbsencesResolverService } from "./resolvers/get-all-planed-schedule-absences-resolver.service";
import { GetScheduleProjectWorkingHoursPerDayResolver } from "./resolvers/get-schedule-project-working-hours-per-day.service";
import { UnsavedChangesGuard } from "./guards/can-deactivate.guard";
// import { CanvasComponent } from './moments-planer/components/canvas/canvas.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path: "",
        component: ProjectMomentsComponent,
        resolve: {
          projects: GetProjectsForPlanningResolverService,
          users: GetAllUsersForPlanningResolverService,
          unassignedUsers: GetAllUnassignedUsersForPlanningResolverService,
          publicHolidayDates: GetPublicHolidayDatesResolverService,
          columns: GetAllResourcePlanningColumnsResolverService,
          planedAbsences: GetAllPlanedAbsencesResolverService,
        },
        data: {
          type: "1",
          preload: false,
          roles: ["show_planning_Global"]
        },
        canActivate: [AuthGuard, RoleGuard],
      },
      {
        path: "time-registration-admin",
        component: TimeRegistrationAdminComponent,
        data: { type: "1" },
        resolve: {
          users: getUsersWithMomentsService,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "planner",
        component: PlanerComponent,
        resolve: {
          users: ProjectUsersResolverService,
          projects: ActiveDateProjectsResolverService,
          unassignedUsers: GetAllUnassignedUsersForPlanningResolverService,
          publicHolidayDates: GetPublicHolidayDatesResolverService,
          columns: GetAllResourcePlanningColumnsResolverService
        },
        data: {
          type: "1",
          preload: false,
          roles: ["show_project_Plan"]
        },
        canActivate: [ AuthGuard, RoleGuard ],
      },
      {
        path: "planner/:id",
        //component: ProjectSchedulePlanerComponent,
        component: ProjectSchedulePlanerCanvasComponent,
        resolve: {
          moments: ProjectMomentsResolverService,
          project: ProjectResolverService,
          lines: ProjectPlanConnectionsResolverService,
          arbitraryDates: ProjectArbitraryDatesResolverService,
          defaultMoments: getDefaultMomentsResolverService,
          publicHolidayDates: GetPublicHolidayDatesResolverService,
          columns: GetAllResourcePlanningColumnsResolverService,
          columnsScedule: getAllScheduleColumnsService,
          revisionSchedule: getAllScheduleRevisionByProjectsService,
          revisionScheduleImage: getAllScheduleRevisionImageService,
          planedAbsences: GetAllPlanedAbsencesResolverService,
          planedScheduleAbsences: GetAllPlanedScheduleAbsencesResolverService,
          planState: ScheduleGetPlanState,
          scheduleProjectHours: GetScheduleProjectWorkingHoursPerDayResolver
        },
        data: {
          preload: false,
          roles: ["show_project_Plan"]
        },
        canActivate: [ AuthGuard, RoleGuard ],
        canDeactivate:[UnsavedChangesGuard]
      },
      {
        path: "user-planner/:id",
        component: UserProjectSchedulePlannerComponent,
        resolve: {
          moments: ProjectMomentsResolverService,
          project: ProjectResolverService,
        },
        data: {
          preload: false,
          type: !1,
          roles: ["show_project_Global"]
        },
        canActivate: [ AuthGuard, RoleGuard ],
      },
      {
        path: "user-project/:id",
        component: AddUserToProjectComponent,
        resolve: {
          users: UsersWantToBeAddedOnProjectReslover,
          projectUsers: ProjectUserResolverService,
          project: ProjectResolverService,
        },
        data: {
          preload: false,
          roles: ["show_project_Global"],
          projectRoles: ["Active"],
        },
        canActivate: [AuthGuard, RoleGuard],
      },
      {
        path: "user-children-project/:id",
        component: AddUserToChildrenProjectComponent,
        resolve: {
          project: ProjectResolverService,
        },
        data: { type: "1" },
        canActivate: [AuthGuard],
      },
    ]),
  ],
  exports: [RouterModule, TranslateModule],
  providers: [
    ProjectsResolver,
    ProjectUsersResolverService,
    ActiveDateProjectsResolverService,
    ProjectMomentsResolverService,
    ProjectResolverService,
    ProjectPlanConnectionsResolverService,
    ProjectArbitraryDatesResolverService,
    getAllProjectPlanCoworkersResolverService,
    UsersResolver,
    AllUsersResolver,
    getDefaultMomentsResolverService,
    excuteMomentCronResolverService,
    getUsersWithMomentsService,
    UsersWantToBeAddedOnProjectReslover,
    ProjectUserResolverService,
    GetProjectsForPlanningResolverService,
    GetAllUsersForPlanningResolverService,
    GetAllUnassignedUsersForPlanningResolverService,
    GetPublicHolidayDatesResolverService,
    GetAllResourcePlanningColumnsResolverService,
    GetAllPlanedAbsencesResolverService,
    GetAllPlanedScheduleAbsencesResolverService,
    getAllScheduleColumnsService,
    getAllScheduleRevisionByProjectsService,
    getAllScheduleRevisionImageService
  ],
})
export class MomentsRoutingModule {}
