import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { AuthGuard } from "../guards/auth.guard";
import { RegisterComponent } from "./register.component";

@NgModule({
  imports: [
    TranslateModule,
    RouterModule.forChild([
      {
        path: "",
        component: RegisterComponent,
        canActivate: [AuthGuard],
        data: {
          preload: false,
          roles: ["show_register_Global"],
        },
      },
    ]),
  ],
  exports: [RouterModule, TranslateModule],
})
export class RegisterRoutingModule {}
