import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainComponent } from "./components/main/main.component";
import { MainRoutingModule } from "./main-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { createTranslateLoader } from "../createTranslateLoader";
import { HttpClient } from "@angular/common/http";
import { MiniScheduleModule } from "./components/mini-schedule/mini-schedule.module";
import { DropdownsModule } from "../utility/dropdowns/dropdowns.module";
import { MainLoginComponent } from './components/main/main-login/main-login.component';
import { MainCompanyComponent } from './components/main/main-company/main-company.component';

@NgModule({
  declarations: [MainComponent, MainLoginComponent, MainCompanyComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MiniScheduleModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    DropdownsModule
  ],
})
export class MainModule {}