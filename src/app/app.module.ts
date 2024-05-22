import { BrowserModule } from "@angular/platform-browser";
import {
  APP_INITIALIZER,
  ErrorHandler,
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
} from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { createTranslateLoader } from "./createTranslateLoader";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InitProvider } from "./initProvider";
import { LayoutModule } from "./layout/layout.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { RestartPasswordComponent } from "./restart-password/restart-password.component";
import { DirectoryComponent } from "src/app/projects/components/directory/directory.component";
import { DeleteErrorModalComponent } from "src/app/users/components/edit-user/delete-error-modal/delete-error-modal.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { NewContactOrganisationModalComponent } from "./projects/components/project/components/project-organisation-route/components/new-contact-organisation-modal/new-contact-organisation-modal.component";
import { MyAccountComponent } from "./my-account/my-account.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ProjectMomentsScheduleComponent } from "src/app/moments/components/project-moments-schedule/project-moments-schedule.component";
import { ProjectMomentsScheduleEditComponent } from "src/app/moments/components/project-moments-schedule-edit/project-moments-schedule-edit.component";
import { PlanningComponent } from "./planning/planning.component";
import { ProjectScheduleNewComponent } from "./moments/moments-planer/components/project-schedule-new/project-schedule-new.component";
import { ProjectScheduleChangeCompletedComponent } from "./moments/moments-planer/components/project-schedule-change-completed/project-schedule-change-completed.component";
import { ModalGroupComponent } from "./moments/moments-planer/components/modal-group/modal-group.component";
import { ScheduleCoworkersComponent } from "./moments/moments-planer/components/schedule-coworkers/schedule-coworkers.component";
import { EditScheduleCoworkersComponent } from "./moments/moments-planer/components/edit-schedule-coworkers/edit-schedule-coworkers.component";
import { AddUsersToProjectComponent } from "src/app/moments/components/add-users-to-project/add-users-to-project.component";
import { EditPlannerComponent } from "src/app/moments/moments-planer/components/edit-planner/edit-planner.component";
import { NewDefaultMomentsComponent } from "src/app/moments/components/new-default-moments/new-default-moments.component";
import { AbsenceMessagesComponent } from "./timesheets/components/absence-messages/absence-messages.component";
import { NotificationTaskModalComponent } from "src/app/moments/components/notification-task-modal/notification-task-modal.component";
import { UserMomentsDetailComponent } from "src/app/moments/component/user-moments-detail/user-moments-detail.component";
import { EditDefaultMomentsComponent } from "./moments/components/edit-default-moments/edit-default-moments.component";
import { SupportModalModule } from "./shared/modals/support-modal/support-modal.module";
import { ConfirmationModalModule } from "./shared/modals/confirmation-modal/confirmation-modal.module";
import { SupportModalComponent } from "./shared/modals/support-modal/support-modal/support-modal.component";
import { LockedDaysComponent } from "src/app/moments/components/locked-days/locked-days.component";
import { NewUnitComponent } from "./generals/components/units/new-unit/new-unit.component";
import { ConfirmationDialog } from "./generals/components/units/confirmation-dialog/confirmation-dialog";
import { SendNotificationToUserForTimesheetComponent } from "src/app/moments/components/send-notification-to-user-for-timesheet/send-notification-to-user-for-timesheet.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { JpDatepickerSwitchDirective } from "src/app/moments/components/send-notification-to-user-for-timesheet/jp-datepicker-switch.directive";
import { registerLocaleData } from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import { EditActivityComponent } from "./generals/components/activity-plan/modals/edit-activity/edit-activity.component";
import { NewActivityComponent } from "./generals/components/activity-plan/modals/new-activity/new-activity.component";
import { NewPublicHolidaysComponent } from "./generals/components/public-holidays/modals/new-public-holidays/new-public-holidays.component";
import { EditPublicHolidaysComponent } from "./generals/components/public-holidays/modals/edit-public-holidays/edit-public-holidays.component";
import { EditAbsenceComponent } from "./generals/components/absence-types/edit-absence/edit-absence.component";
import { NewAbsenceTypeComponent } from "./generals/components/absence-types/new-absence-type/new-absence-type.component";
import { EditMileageTypeComponent } from "./generals/components/milleage-types/edit-mileage-type/edit-mileage-type.component";
import { CreateMileageTypeComponent } from "./generals/components/milleage-types/create-mileage-type/create-mileage-type.component";
import { EditRoleComponent } from "./generals/components/role-colors/edit-role/edit-role.component";
import { NewRoleComponent } from "./generals/components/role-colors/new-role/new-role.component";
import { InputAutocompleteModule } from "src/app/utility/input-autocomplete/input-autocomplete.module";
import { ContactsComponent } from "./contacts/contacts.component";
import { DNDModule } from "./projects/components/image-modal/dnd.module";
import { ImageModalOldComponent } from "./projects/components/image-modal-old/image-modal-old.component";
import { FilePreviewModule } from "./projects/components/image-modal/file-preview/file-preview.module";
import { ErrorHandlerService } from "./core/services/error-handler.service";
import { ChatBubleArrowForAppModuleComponent } from "src/app/moments/components/time-registration-admin/calendar-user-row/week-modal/svgs/chat-buble-arrow-for-app-module/chat-buble-arrow-for-app-module.component";
import { MatButtonModule } from "@angular/material/button";
import { NgIdleKeepaliveModule } from "@ng-idle/keepalive";
import { RouterModule } from "@angular/router";
import { PaginationModule } from "./utility/pagination/pagination.module";
import { ConfirmModalModule } from './shared/modals/confirm-modal/confirm-modal.module';
import { MatNativeDateModule } from '@angular/material/core';
import { SpecialCharactherMustBeValidators } from "src/app/core/validator/special-characther-must-be.validator";
import { CommentsModalComponent } from './shared/modals/comments-modal/comments-modal.component';
import { TimesheetsModule } from './timesheets/timesheets.module';
import { DropdownsModule } from "./utility/dropdowns/dropdowns.module";
import { MyAccountEducationsComponent } from './my-account/my-account-educations/my-account-educations.component';
import { GalleryModule } from "./utility/gallery/gallery.module";
import { RegistrationComponent } from './fortnox/registration/registration.component';
import { FortnoxReadmeComponent } from './fortnox/fortnox-readme/fortnox-readme.component';
//import { CheckoutSvgForFirstDropdownComponent } from 'src/app/projects/components/weekly-report-modify/weekly-modify/weekly-info/checkout-svg-for-first-dropdown/checkout-svg-for-first-dropdown.component';
import { UsersModule } from "./users/users.module";
import { PdfjsviewerModule } from "./utility/pdfjs-viewer/pdfjsviewer.module";
import { InputsModule } from "./utility/inputs/inputs.module";

registerLocaleData(localeFr, "fr");


export function initProviderFactory(provider: InitProvider) {
  return () => provider.load();
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    RestartPasswordComponent,
    DirectoryComponent,
    DeleteErrorModalComponent,
    NewContactOrganisationModalComponent,
    MyAccountComponent,
    ContactsComponent,
    ProjectMomentsScheduleComponent,
    ProjectMomentsScheduleEditComponent,
    PlanningComponent,
    ProjectScheduleNewComponent,
    ProjectScheduleChangeCompletedComponent,
    ModalGroupComponent,
    ScheduleCoworkersComponent,
    EditScheduleCoworkersComponent,
    AddUsersToProjectComponent,
    EditPlannerComponent,
    NewDefaultMomentsComponent,
    EditDefaultMomentsComponent,
    NewActivityComponent,
    EditActivityComponent,
    NotificationTaskModalComponent,
    UserMomentsDetailComponent,
    LockedDaysComponent,
    NewUnitComponent,
    ConfirmationDialog,
    SendNotificationToUserForTimesheetComponent,
    NewPublicHolidaysComponent,
    EditPublicHolidaysComponent,
    EditAbsenceComponent,
    NewAbsenceTypeComponent,
    EditMileageTypeComponent,
    CreateMileageTypeComponent,
    EditRoleComponent,
    NewRoleComponent,
    EditPublicHolidaysComponent,
    JpDatepickerSwitchDirective,
    ImageModalOldComponent,
    ChatBubleArrowForAppModuleComponent,
    CommentsModalComponent,
    MyAccountEducationsComponent,
    RegistrationComponent,
    FortnoxReadmeComponent,

    //CheckoutSvgForFirstDropdownComponent
  ],
  exports: [TranslateModule],
  imports: [
    PaginationModule,
    BrowserModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    DragDropModule,
    SupportModalModule,
    GalleryModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSelectModule,
    MatInputModule,
    MatAutocompleteModule,
    NgxMaterialTimepickerModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    ConfirmationModalModule,
    NgMultiSelectDropDownModule.forRoot(),
    InputAutocompleteModule,
    DNDModule,
    FilePreviewModule,
    NgIdleKeepaliveModule.forRoot(),
    RouterModule,
    ConfirmModalModule,
    MatNativeDateModule,
    TimesheetsModule,
    DropdownsModule,
    UsersModule,
    PdfjsviewerModule,
    InputsModule
  ],
  entryComponents: [
    DirectoryComponent,
    DeleteErrorModalComponent,
    NewContactOrganisationModalComponent,
    ProjectMomentsScheduleComponent,
    ProjectMomentsScheduleEditComponent,
    ProjectScheduleNewComponent,
    ProjectScheduleChangeCompletedComponent,
    ModalGroupComponent,
    ScheduleCoworkersComponent,
    EditScheduleCoworkersComponent,
    AddUsersToProjectComponent,
    EditPlannerComponent,
    NewDefaultMomentsComponent,
    AbsenceMessagesComponent,
    NotificationTaskModalComponent,
    UserMomentsDetailComponent,
    SupportModalComponent,
    EditDefaultMomentsComponent,
    LockedDaysComponent,
    NewActivityComponent,
    NewUnitComponent,
    ConfirmationDialog,
    EditActivityComponent,
    SendNotificationToUserForTimesheetComponent,
    NewPublicHolidaysComponent,
    EditPublicHolidaysComponent,
    EditAbsenceComponent,
    EditMileageTypeComponent,
    NewAbsenceTypeComponent,
    CreateMileageTypeComponent,
    EditRoleComponent,
    NewRoleComponent,
    EditPublicHolidaysComponent,
    ImageModalOldComponent,
    ],
  providers: [
    InitProvider,
    {
      provide: APP_INITIALIZER,
      useFactory: initProviderFactory,
      deps: [InitProvider],
      multi: true,
    },
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    SpecialCharactherMustBeValidators
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
