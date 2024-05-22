import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";
import { GeneralsComponent } from "./components/generals.component";
import { GeneralsResolver } from "./resolvers/generals-resolver.service";
import { EditComponent } from "./components/edit/edit.component";
import { GeneralResolverService } from "./resolvers/general-resolver.service";
import { UserCalendarRoleComponent } from "../timesheets/components/time-registration-admin/user-calendar-role/user-calendar-role.component";
import { UserCalendarRoleResolverService } from "../timesheets/resolvers/user-calendar-role-resolver.service";
import { SettingsComponent } from "./components/settings/settings.component";
import { getDefaultMomentsResolverService } from "src/app/moments/resolvers/getDefaultMoments-resolver.service";
import { AuthGuard } from "../guards/auth.guard";
import { SettingsResolverResolver } from "./components/settings/resolvers/settings-resolver.resolver";
import { CanDeactivateGuard } from "./components/settings/guards/can-deactivate.guard";
import { getDefaultMomentsForUserResolverService } from "../moments/resolvers/getDefaultMomentsForUser-resolver.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path: "oldgenerals",
        component: GeneralsComponent,
        resolve: {
          generals: GeneralsResolver,
          scheduleRoles: UserCalendarRoleResolverService,
          moments: getDefaultMomentsResolverService,
        },
        canActivate: [AuthGuard],
      },
      {
        path: "edit/:id",
        component: EditComponent,
        resolve: { general: GeneralResolverService },
        canActivate: [AuthGuard],
      },
      {
        path: "user-role",
        component: UserCalendarRoleComponent,
        resolve: { scheduleRoles: UserCalendarRoleResolverService },
        canActivate: [AuthGuard],
      },
      {
        path: "user-role",
        component: UserCalendarRoleComponent,
        resolve: { scheduleRoles: UserCalendarRoleResolverService },
        canActivate: [AuthGuard],
      },
      {
        path: "",
        component: SettingsComponent,
        resolve: {
            generals: SettingsResolverResolver,
            default_moments: getDefaultMomentsForUserResolverService
        },
        canActivate: [AuthGuard],
        canDeactivate: [CanDeactivateGuard],
      },
    ]),
  ],
  exports: [RouterModule, TranslateModule],
  providers: [
    GeneralsResolver,
    GeneralResolverService,
    getDefaultMomentsResolverService,
  ],
})
export class GeneralsRoutingModule {}
