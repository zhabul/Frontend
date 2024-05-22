import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { UsersComponent } from "./components/users/users.component";
import { UsersResolver } from "./resolvers/users-resolver.service";
import { NewUserComponent } from "./components/new-user/new-user.component";
import { EditUserComponent } from "./components/edit-user/edit-user.component";
import { EditRolesComponent } from "./components/edit-roles/edit-roles.component";
import { EditUserResolver } from "./resolvers/edit-user-resolver.service";
import { GetRolesResolver } from "./resolvers/get-roles-resolver.service";
import { GetPredefinedRolesResolver } from "./resolvers/get-predefined-roles-resolver.service";
import { getDefaultMomentsForUserResolverService } from "../moments/resolvers/getDefaultMomentsForUser-resolver.service";
import { getUserPermissionsResolver } from "src/app/users/resolvers/get-user-permissions-resolver.service";
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "",
        component: UsersComponent,
      },
      {
        path: "new",
        component: NewUserComponent,
        resolve: {
          roles: GetRolesResolver,
          default_moments: getDefaultMomentsForUserResolverService,
        },
      },
      {
        path: "edit/:id",
        component: EditUserComponent,
        resolve: {
          user: EditUserResolver,
          default_moments: getDefaultMomentsForUserResolverService,
          user_roles: getUserPermissionsResolver
        },
      },
      {
        path: "edit/roles/:id",
        component: EditRolesComponent,
        resolve: {
          predefinedRoles: GetPredefinedRolesResolver,
          roles: GetRolesResolver,
        },
      },
    ]),
  ],
  exports: [RouterModule],
  providers: [
    UsersResolver,
    EditUserResolver,
    GetRolesResolver,
    GetPredefinedRolesResolver,
    getDefaultMomentsForUserResolverService,
    getUserPermissionsResolver
  ],
})
export class UsersRoutingModule {}
