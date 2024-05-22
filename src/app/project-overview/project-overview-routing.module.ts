import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";
import { ProjectOverviewComponent } from "./components/project-overview.component";
import { ProjectsResolver } from "./resolvers/projects.resolver";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path: "",
        component: ProjectOverviewComponent,
        resolve: {
          projects: ProjectsResolver,
        },
      },
    ]),
  ],
  exports: [RouterModule, TranslateModule],
})
export class ProjectOverviewRoutingModule {}
