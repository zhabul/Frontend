import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SelectiveStrategy } from "./selective-strategy.service";
import { LoginComponent } from "./login/login.component";
import { AuthGuard } from "./guards/auth.guard";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { RestartPasswordComponent } from "./restart-password/restart-password.component";
import { MyAccountComponent } from "./my-account/my-account.component";
import { MyAccountUserResolver } from "./my-account/resolver/my-account-resolver.service";
import { TimesheetsComponent } from "./timesheets/timesheets.component";
import { TimeRegistrationAdminComponent } from "./timesheets/components/time-registration-admin/time-registration-admin.component";
import { TimeRegistrationUsersRegistrationComponent } from "./timesheets/components/time-registration-users/time-registration-users-registration/time-registration-users-registration.component";
import { MileageRegistrationUsersRegistrationComponent } from "./timesheets/components/other-registration-users/mileage-registration-users-registration/mileage-registration-users-registration.component";
import { MileageReviewComponent } from "./timesheets/components/other-registration-users/mileage-review/mileage-review.component";
import { TimeRegistrationUsersAbsenceComponent } from "./timesheets/components/time-registration-users/time-registration-users-absence/time-registration-users-absence.component";
import { AbsenceTypeResolverService } from "src/app/timesheets/resolvers/absence-type-resolver.service";
import { TimesheetResolverService } from "src/app/timesheets/resolvers/timesheet-resolver.service";
import { MileagesResolver } from "./timesheets/resolvers/mileage-resolver.service";
import { UsersResolver } from "./users/resolvers/users-resolver.service";
import { ScheduleReviewComponent } from "./timesheets/components/schedule-review/schedule-review.component";
import { TimeSheetOverviewComponent } from "./timesheets/components/time-sheet-overview/time-sheet-overview.component";
import { ScheduleCalendarComponent } from "src/app/timesheets/components/time-registration-users/schedule-calendar/schedule-calendar.component";
import { ScheduleDetailComponent } from "./timesheets/components/schedule-detail/schedule-detail.component";
import { TimesheetMomentsResolverService } from "src/app/timesheets/resolvers/timesheet-moments-resolver.service";
import { TimesheetAbsenceResolverService } from "src/app/timesheets/resolvers/timesheet-absence-resolver.service";
import { TimesheetUserRolesResolverService } from "src/app/timesheets/resolvers/timesheet-user-roles-resolver.service";
import { TimeRegistrationUserDetailsComponent } from "./timesheets/components/time-registration-admin/time-registration-user-details/time-registration-user-details.component";
import { UserCalendarRoleResolverService } from "./timesheets/resolvers/user-calendar-role-resolver.service";
import { UserTimesheetIdResolverService } from "./timesheets/resolvers/user-timesheet-id-resolver.service";
import { AbsenceTimesheetIdResolverService } from "./timesheets/resolvers/absence-timesheet-id-resolver.service";
import { ScheduleDetailAdminComponent } from "./timesheets/components/time-registration-admin/schedule-detail-admin/schedule-detail-admin.component";
import { GetAllTimesheetsResolverService } from "./timesheets/resolvers/get-all-timesheets-resolver.service";
import { PlanningComponent } from "./planning/planning.component";
import { ProjectsResolver } from "./projects/resolvers/projects-resolver.service";
import { GetMaterialPropertiesResolverService } from "./projects/resolvers/get-material-properties-resolver.service";
import { ClientsResolver } from "./clients/resolvers/clients-resolver.service";
import { UnitsResolverService } from "./materials/resolvers/units-resolver.service";
import { AtasResolverService } from "./projects/resolvers/atas-resolver.service";
import { ProjectMomentsResolverService } from "./moments/resolvers/project-moments-resolver.service";
import { ProjectResolverService } from "./projects/resolvers/project-resolver.service";
import { GetAllAbsenceTimesheetsResolverService } from "./timesheets/resolvers/get-all-timesheets-absence-resolver.service";
import { CurrentUserProjectTimesheetsResolver } from "./timesheets/resolvers/current-user-project-resolver.service";
import { GetGeneralHoursResolverService } from "./timesheets/resolvers/get-general-hours-resolver.service";
import { ProjectManagerProjectsResolver } from "./timesheets/resolvers/project-manager-projects-resolver.service";
import { UserDetailsAdminComponent } from "./timesheets/components/time-registration-admin/user-details-admin/user-details-admin.component";
import { UserDetailsTimesheetResolverService } from "./timesheets/resolvers/user-details-timesheet-resolver.service";
import { getAllProjectWhereUserWasAddedResolver } from "./timesheets/resolvers/get-all-project-where-user-was-added-resolver.service";
import { PdfGeneratorComponent } from "./timesheets/components/time-registration-admin/pdf-generator/pdf-generator.component";
import { getUsersWithMomentsService } from "src/app/moments/resolvers/get-users-with-moments.service";
import { getUsersWithMomentsFullMonthService } from "src/app/moments/resolvers/get-users-with-moments-full-month.service";
import { getDisabledDatesForRaportTimeResolver } from "src/app/timesheets/resolvers/get-disabled-dates-for-raport-time-resolver.service";
import { GetPublicHolidayDatesResolverService } from "src/app/timesheets/resolvers/get-public-holiday-dates-resolver.service";
import { SchemaProjectsResolver } from "./timesheets/resolvers/schema-projects-resolver.service";
import { RoleGuard } from "./guards/role.guard";
import { ContactsComponent } from "./contacts/contacts.component";
import { NotSeenMessagesService } from './not-seen-messages.service';
import { Schedule2Component } from "./timesheets/components/schedule2/schedule2.component";
import { PersonalStatisticsComponent } from "./timesheets/components/personal-statistics/personal-statistics.component";
import { ErsattningsvarotyperComponent } from './timesheets/components/ersattningsvarotyper/ersattningsvarotyper.component';
import { AbsenceTypesComponent } from './timesheets/components/absence-types/absence-types.component';
import { TimsheetSettingsLonetyperComponent } from './timesheets/components/timsheet-settings-lonetyper/timsheet-settings-lonetyper.component';
import { RegistrationComponent } from './fortnox/registration/registration.component';
import { FortnoxReadmeComponent } from 'src/app/fortnox/fortnox-readme/fortnox-readme.component';
import { DropdownsComponent } from "./utility/dropdowns/dropdowns.component";
import { TranslateModule } from "@ngx-translate/core";
import { TimesheetMileagesResolverService } from "./timesheets/resolvers/timesheet-mileages-resolver.service";
import { PayrollComponent } from "./timesheets/components/time-registration-admin/payroll/payroll.component";
import { ScheduleCalendarNavigationComponent } from "./timesheets/components/time-registration-users/schedule-calendar-navigation/schedule-calendar-navigation.component";


const desktopRoutes: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
  },
  {
    path: "restart-password/:token",
    component: RestartPasswordComponent,
  },
  {
    path: "planning",
    component: PlanningComponent,
    data: { preload: false, roles: [] },
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: "external",
    loadChildren: () =>
      import("./external/external.module").then((m) => m.ExternalModule),
  },
  {
    path: "timesheets",
    component: TimesheetsComponent,
    data: { preload: false, roles: ["show_timesheets_recordtime"] },
    canActivate: [AuthGuard],
    children: [
      {
        path: "time-registration-admin/edit/:id",
        component: TimeRegistrationUserDetailsComponent,
        resolve: {
          timesheets: UserTimesheetIdResolverService,
          absences: AbsenceTimesheetIdResolverService,
        },
      },

      {
        path: "time-overview",
        component: TimeSheetOverviewComponent,
      },

      {
        path: "time-overview",
        component: TimeSheetOverviewComponent,
      },
      {
        path: "schedule-review",
        component: ScheduleReviewComponent,
        resolve: {
          projects: SchemaProjectsResolver,
        },
      },
      {
        path: "schedule2",
        component: Schedule2Component,

      },
    ],
  },
  {
    path: "timesheets/schedule-calendar",
    component: ScheduleCalendarNavigationComponent,
    resolve: {
      roles: TimesheetUserRolesResolverService,
      project: ProjectManagerProjectsResolver,
      hours: GetGeneralHoursResolverService,
      disabledDateForRaportTime: getDisabledDatesForRaportTimeResolver,
      publicHolidays: GetPublicHolidayDatesResolverService,
    },
    canActivate: [AuthGuard],
  },
  {
    path: "timesheets/time-registration-admin",
    component: TimeRegistrationAdminComponent,
    resolve: {
      timesheets: GetAllTimesheetsResolverService,
      absences: GetAllAbsenceTimesheetsResolverService,
      roles: TimesheetUserRolesResolverService,
      hours: GetGeneralHoursResolverService,
    },
    data: { type: "1" },
    canActivate: [AuthGuard],
  },
  {
    path: "timesheets/time-registration-admin/schedule-detail/:id/:timesheet_id",
    component: ScheduleDetailAdminComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "timesheets/time-registration-admin/user-detail/:id/:date",
    component: UserDetailsAdminComponent,
    resolve: {
      summary: UserDetailsTimesheetResolverService,
      mileages: TimesheetMileagesResolverService
    },
    canActivate: [AuthGuard],
  },
  {
    path: "timesheets/time-registration-admin/user-detail/payroll",
    component: PayrollComponent,
    resolve: {

    },
    canActivate: [AuthGuard],
  },
  {
    path: "timesheets/personal-statistics",
    component: PersonalStatisticsComponent,
    resolve: {},
    canActivate: [AuthGuard],
  },
  {
    path: "timesheets/settings/lone",
    component: TimsheetSettingsLonetyperComponent,
    resolve: {},
    canActivate: [AuthGuard],
  },
  {
    path: "timesheets/settings/ersattningsvarotyper",
    component: ErsattningsvarotyperComponent,
    resolve: {},
    canActivate: [AuthGuard],
  },
  {
    path: "timesheets/settings/absence-types",
    component: AbsenceTypesComponent,
    resolve: {},
    canActivate: [AuthGuard],
  },
  {
    path: "timesheets/time-registration-admin/pdf/:startDate/:endDate",
    component: PdfGeneratorComponent,
    resolve: { users: getUsersWithMomentsFullMonthService },
    canActivate: [AuthGuard],
  },
  {
    path: "schedule-detail/:timesheet_id",
    component: ScheduleDetailComponent,
    resolve: {
      moments: TimesheetMomentsResolverService,
      absences: AbsenceTimesheetIdResolverService,
    },
    canActivate: [AuthGuard],
  },
  {
    path: "timesheets/time-registration-users-registration",
    component: TimeRegistrationUsersRegistrationComponent,
    resolve: {
      roles: TimesheetUserRolesResolverService,
      project_manager_projects: ProjectManagerProjectsResolver,
      mileages: TimesheetMileagesResolverService
    },
    canActivate: [AuthGuard],
  },
  {
    path: "timesheets/mileage-registration-users-registration",
    component: MileageRegistrationUsersRegistrationComponent,
    resolve: {
      roles: TimesheetUserRolesResolverService,
      project: CurrentUserProjectTimesheetsResolver,
      projects: ProjectsResolver,
    },
    canActivate: [AuthGuard],
  },
  {
    path: "timesheets/mileage-review",
    component: MileageReviewComponent,
    resolve: {
      mileages: MileagesResolver,
    },
    canActivate: [AuthGuard],
  },
  {
    path: "timesheets/time-registration-users-absence",
    component: TimeRegistrationUsersAbsenceComponent,
    resolve: { absences: AbsenceTypeResolverService },
    canActivate: [AuthGuard],
  },
  {
    path: "projects",
    loadChildren: () =>
      import("./projects/projects.module").then((m) => m.ProjectsModule),
    data: { preload: false, roles: ["show_project_Global"] },
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: "moments",
    loadChildren: () =>
      import("./moments/moments.module").then((m) => m.MomentsModule),
    data: { preload: false, roles: [] },
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: "users",
    loadChildren: () =>
      import("./users/users.module").then((m) => m.UsersModule),
    data: { preload: false, roles: ["show_users_Global"] },
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: "project_overview",
    loadChildren: () =>
      import("./project-overview/project-overview.module").then((m) => m.ProjectOverviewModule),
    data: { preload: false, roles: ["show_project_analyzing"] },
    canActivate: [AuthGuard, RoleGuard],

  },
  {
    path: "contacts",
    component: ContactsComponent,
    resolve: {
      users: UsersResolver,
    },
    data: { preload: false, roles: ["show_users_Contactdetails"] },
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: "my-account",
    component: MyAccountComponent,
    resolve: { myAccount: MyAccountUserResolver },
    canActivate: [AuthGuard],
  },
  {
    path: "activation",
    component: RegistrationComponent,
   // canActivate: [AuthGuard],
  },
  {
    path: "fortnox-readme",
    component: FortnoxReadmeComponent,
    data: { preload: false, roles: [] },
    canActivate: [AuthGuard],
  },
  {
    path: "generals",
    loadChildren: () =>
      import("./generals/generals.module").then((m) => m.GeneralsModule),
    data: { preload: false, roles: ["show_settings_Global"] },
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: "orders",
    loadChildren: () =>
      import("./orders/orders.module").then((m) => m.OrdersModule),
    data: { preload: false, roles: ["show_project_Order"] },
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: "materials",
    loadChildren: () =>
      import("./materials/materials.module").then((m) => m.MaterialsModule),
    data: { preload: false, roles: ["show_register_products"] },
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: "register",
    loadChildren: () =>
      import("./register/register.module").then((m) => m.RegisterModule),
    data: { preload: false, roles: ["show_register_Global"] },
    canActivate: [AuthGuard],
  },
  {
    path: "clients",
    loadChildren: () =>
      import("./clients/clients.module").then((m) => m.ClientsModule),
    data: { preload: false, roles: ["show_register_customers"] },
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: "suppliers",
    loadChildren: () =>
      import("./suppliers/suppliers.module").then((m) => m.SuppliersModule),
    data: { preload: false, roles: ["show_register_suppliers"] },
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: "",
    loadChildren: () => import("./main/main.module").then((m) => m.MainModule),
    data: { preload: false },
    canActivate: [AuthGuard],
  },
  {
    path: "home",
    loadChildren: () => import("./main/main.module").then((m) => m.MainModule),
    data: { preload: false },
    canActivate: [AuthGuard],
  },
  {
    path: "offer",
    loadChildren: () =>
      import("./offer/offer.module").then((m) => m.OfferModule),
    data: { preload: false, roles: ["show_offer_Global"] },
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: "invoices",
    loadChildren: () =>
      import("./invoice/invoices.module").then((m) => m.InvoicesModule),
    data: { preload: false, roles: ["show_invoices_Global"] },
    canActivate: [AuthGuard, RoleGuard],
  },
  {
      path: "dropdowns",
      component: DropdownsComponent,
  },
  {
    path: "**",
    redirectTo: "home",
    pathMatch: "full",
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(desktopRoutes, {
      useHash: true,
      preloadingStrategy: SelectiveStrategy,
    }),
    TranslateModule,
  ],
  exports: [RouterModule, TranslateModule],
  providers: [
    AuthGuard,
    RoleGuard,
    SelectiveStrategy,
    MyAccountUserResolver,
    AbsenceTypeResolverService,
    TimesheetResolverService,
    UsersResolver,
    ScheduleCalendarComponent,
    TimesheetMomentsResolverService,
    TimesheetAbsenceResolverService,
    TimesheetUserRolesResolverService,
    UserCalendarRoleResolverService,
    UserTimesheetIdResolverService,
    AbsenceTimesheetIdResolverService,
    ProjectsResolver,
    ClientsResolver,
    GetMaterialPropertiesResolverService,
    UnitsResolverService,
    AtasResolverService,
    GetAllTimesheetsResolverService,
    ProjectMomentsResolverService,
    ProjectResolverService,
    GetAllAbsenceTimesheetsResolverService,
    CurrentUserProjectTimesheetsResolver,
    MileagesResolver,
    GetGeneralHoursResolverService,
    ProjectManagerProjectsResolver,
    SchemaProjectsResolver,
    UserDetailsTimesheetResolverService,
    getAllProjectWhereUserWasAddedResolver,
    getUsersWithMomentsService,
    getDisabledDatesForRaportTimeResolver,
    getUsersWithMomentsFullMonthService,
    GetPublicHolidayDatesResolverService,
    TimesheetMileagesResolverService,
    NotSeenMessagesService
  ],
})
export class AppRoutingModule {}
