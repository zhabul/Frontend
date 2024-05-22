import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";
import { MainComponent } from "./components/main/main.component";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path: "",
        component: MainComponent,
      },
    ]),
  ],
  exports: [RouterModule, TranslateModule],
  providers: [],
})
export class MainRoutingModule {}
