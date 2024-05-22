import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";

import { createTranslateLoader } from "../createTranslateLoader";
import { HttpClient } from "@angular/common/http";
import { GeneralsComponent } from "./components/generals.component";
import { GeneralsRoutingModule } from "./generals-routing.module";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { ReverseStr } from "../reverse-str.pipe";
import { TrimStr } from "../trim-str.pipe";
import { UnderscoreToSpace } from "../underscoreToSpace.pipe";
import { EditComponent } from "./components/edit/edit.component";
import { RemovewhitespacesPipe } from "../removewhitespaces.pipe";
import { UserCalendarRoleComponent } from "../timesheets/components/time-registration-admin/user-calendar-role/user-calendar-role.component";
import { SwiperComponent } from "./components/swiper/swiper.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { CurrentSwiperComponent } from "./components/current-swiper/current-swiper.component";
import { DefaultMomentsComponent } from "src/app/moments/components/default-moments/default-moments.component";
import { NotificationTasksComponent } from "src/app/moments/components/notification-tasks/notification-tasks.component";
import { SupportTasksComponent } from "./components/support-tasks/support-tasks.component";
import { PipesModule } from "../core/pipes/pipes.module";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ActivityPlanComponent } from "./components/activity-plan/activity-plan.component";
import { UnitsComponent } from "./components/units/units.component";
import { FilterPipe } from "./components/units/filter.pipe";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { RoleColorsComponent } from "./components/role-colors/role-colors.component";
import { ColorPickerModule } from "ngx-color-picker";
import { PublicHolidaysComponent } from "./components/public-holidays/public-holidays.component";
import { AbsenceTypesComponent } from "./components/absence-types/absence-types.component";
import { MilleageTypesComponent } from "./components/milleage-types/milleage-types.component";
import { WorkWeekComponent } from "./components/work-week/work-week.component";
import { ConfirmationModalModule } from "../shared/modals/confirmation-modal/confirmation-modal.module";
import { GalleryModule } from "../utility/gallery/gallery.module";
import { AddEducation } from "./components/add-education/add-education.component";
import { AddEducationModal } from "./components/add-education/add-education-modal/add-education-modal.component";
import { MatDialogModule } from "@angular/material/dialog";
import { SettingsComponent } from "./components/settings/settings.component";
import { RoleElligibilityComponent } from "./components/settings/components/role-elligibility/role-elligibility.component";
import { RoleEligibilityListComponent } from "./components/settings/components/role-elligibility/role-eligibility-list/role-eligibility-list.component";
import { RoleComponent } from "./components/settings/components/role/role.component";
import { RoleListComponent } from "./components/settings/components/role/role-list/role-list.component";
import { EditRoleModalComponent } from "./components/settings/components/role/edit-role-modal/edit-role-modal.component";
import { CompanyDetailsComponent } from "./components/settings/components/company-details/company-details.component";
import { CompetenceComponent } from "./components/settings/components/competence/competence.component";
import { NotesComponent } from "./components/settings/components//notes/notes.component";
import { CommentSectionModule } from "../utility/comment-section/comment-section.module";
import { AccountingPlanComponent } from "./components/settings/components/accounting-plan/accounting-plan.component";
import { ActivityPlanSettingsComponent } from "./components/settings/components/activity-plan/settings-activity-plan.component";
import { EditActivityComponent } from "./components/settings/components//activity-plan/edit-activity/edit-activity.component";
import { MomentsComponent } from "./components/settings/components//moments/moments.component";
import { UnitsOfMeasureComponent } from "./components/settings/components/units-of-measure/units-of-measure.component";
import { AbsenceComponent } from "./components/settings/components/absence/absence.component";
import { EditAbsenceComponent } from "./components/settings/components/absence/components/edit-absence/edit-absence.component";
import { WorkingHoursComponent } from "./components/settings/components/working-hours/working-hours.component";
import { SettingsPublicHolidaysComponent } from "./components/settings/components/settings-public-holidays/settings-public-holidays.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatCardModule } from "@angular/material/card";
import { DatePipePipe } from "./components/settings/components/settings-public-holidays/pipes/date-pipe.pipe";
import { NotificationsComponent } from "./components/settings/components/notifications/notifications.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { SettingsActivityPlanListComponent } from './components/settings/components/activity-plan/components/settings-activity-plan-list/settings-activity-plan-list.component';
import { DropdownComponent } from './components/settings/components/dropdown/dropdown.component';
import { SelectDropdownComponent } from './components/settings/components/select-dropdown/select-dropdown.component';
import { FortnoxPropertiesComponent } from 'src/app/fortnox/fortnox-properties/fortnox-properties.component';
import { SvgGlobalModule } from "../utility/svgs/svg-global/svg-global.module";


@NgModule({
  declarations: [
    GeneralsComponent,
    UserCalendarRoleComponent,
    UnderscoreToSpace,
    ReverseStr,
    TrimStr,
    RemovewhitespacesPipe,
    EditComponent,
    SwiperComponent,
    CurrentSwiperComponent,
    DefaultMomentsComponent,
    NotificationTasksComponent,
    SupportTasksComponent,
    ActivityPlanComponent,
    ActivityPlanSettingsComponent,
    UnitsComponent,
    RoleColorsComponent,
    FilterPipe,
    PublicHolidaysComponent,
    AbsenceTypesComponent,
    MilleageTypesComponent,
    WorkWeekComponent,
    AddEducation,
    AddEducationModal,
    SettingsComponent,
    RoleElligibilityComponent,
    RoleEligibilityListComponent,
    RoleComponent,
    RoleListComponent,
    EditRoleModalComponent,
    CompanyDetailsComponent,
    CompetenceComponent,
    NotesComponent,
    AccountingPlanComponent,
    ActivityPlanComponent,
    EditActivityComponent,
    MomentsComponent,
    UnitsOfMeasureComponent,
    AbsenceComponent,
    EditAbsenceComponent,
    WorkingHoursComponent,
    SettingsPublicHolidaysComponent,
    DatePipePipe,
    NotificationsComponent,
    SettingsActivityPlanListComponent,
    DropdownComponent,
    SelectDropdownComponent,
    FortnoxPropertiesComponent
  ],
  entryComponents: [AddEducationModal],
  imports: [
    CommonModule,
    GeneralsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    DragDropModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    ConfirmationModalModule,
    MatTooltipModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    NgxMaterialTimepickerModule.setLocale("fr-FR"),
    NgxMaterialTimepickerModule,
    ColorPickerModule,
    GalleryModule,
    CommentSectionModule,
    SvgGlobalModule
  ],
})
export class GeneralsModule {}
