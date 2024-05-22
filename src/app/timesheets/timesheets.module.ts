import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { ColorPickerModule } from "ngx-color-picker";
import { ConfirmationModalModule } from "../shared";
import { ScrollingModule } from "@angular/cdk/scrolling"; 
import { InputAutocompleteModule } from "src/app/utility/input-autocomplete/input-autocomplete.module";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { FilePreviewModule } from "../projects/components/image-modal/file-preview/file-preview.module";
import { GalleryModule } from "../utility/gallery/gallery.module";
import { MatIconModule } from '@angular/material/icon';
import { TimesheetsComponent } from './timesheets.component';
import { AbsenceMessagesComponent } from './components/absence-messages/absence-messages.component';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { createTranslateLoader } from "../createTranslateLoader";
import { EditFlexComponent } from "./components/edit-flex/edit-flex.component";
import { MileageRegistrationUsersRegistrationComponent } from "./components/other-registration-users/mileage-registration-users-registration/mileage-registration-users-registration.component";
import { MileageReviewComponent } from "./components/other-registration-users/mileage-review/mileage-review.component";
import { ScheduleComponent } from "./components/schedule/schedule.component";
import { ScheduleDetailAdminComponent } from "./components/time-registration-admin/schedule-detail-admin/schedule-detail-admin.component";
import { ScheduleDetailComponent } from "./components/schedule-detail/schedule-detail.component";
import { ScheduleDetailCalendarComponent } from "./components/schedule-detail/schedule-detail-calendar/schedule-detail-calendar.component";
import { ScheduleReviewComponent } from "./components/schedule-review/schedule-review.component";
import { SyncfusionCalendarComponent } from "./components/schedule-review/syncfusion-calendar/syncfusion-calendar.component";
import { Schedule2Component } from './components/schedule2/schedule2.component';
import { SetTimeComponent } from "./components/set-time/set-time.component";
import { TimeComponent } from "./components/time/time.component";
import { CreateAbsenceComponent } from "./components/time-registration-admin/user-details-admin/create-absence/create-absence.component";
import { TimeRegistrationAdminComponent } from "./components/time-registration-admin/time-registration-admin.component";
import { TimeRegistrationUserDetailsComponent } from "./components/time-registration-admin/time-registration-user-details/time-registration-user-details.component";
import { SynfusionAdminCalendarComponent } from "./components/time-registration-admin/synfusion-admin-calendar/synfusion-admin-calendar.component";
import { ApproveAbsenceModalComponent } from "./components/time-registration-admin/approve-absence-modal/approve-absence-modal.component";
import { UserDetailsAdminComponent } from "./components/time-registration-admin/user-details-admin/user-details-admin.component";
import { AdminRegisterTimeComponent } from ".//components/time-registration-admin/synfusion-admin-calendar/admin-register-time-modal/admin-register-time-modal.component";
import { PdfGeneratorComponent } from "./components/time-registration-admin/pdf-generator/pdf-generator.component";
import { HasSeenModalComponent } from "./components/time-registration-users/time-registration-users-absence/has-seen-modal/has-seen-modal.component";
import { TimeRegistrationUsersRegistrationModule } from "./components/time-registration-users/time-registration-users-registration/time-registration-users-registration.module";
import { TimeRegistrationUsersAbsenceModule } from "./components/time-registration-users/time-registration-users-absence/time-registration-users-absence.module";
import { ScheduleCalendarComponent } from "./components/time-registration-users/schedule-calendar/schedule-calendar.component";
import { TimeSheetOverviewComponent } from "./components/time-sheet-overview/time-sheet-overview.component";
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule } from "@angular/router";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTableModule } from "@angular/material/table";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import {
  ScheduleAllModule,
  RecurrenceEditorAllModule,
} from "@syncfusion/ej2-angular-schedule"; 
import { NumberFormatModule } from "../utility/number-format/number-format.module";
import { EmptyCalendarRowComponent } from './components/time-registration-admin/user-details-admin/empty-calendar-row/empty-calendar-row.component';
import { BackButtonSvgUdComponent } from './components/time-registration-admin/user-details-admin/svgs/back-button-svg-ud/back-button-svg-ud.component';
import { CalendarIconSvgComponent } from './components/time-registration-admin/user-details-admin/svgs/calendar-icon-svg/calendar-icon-svg.component';
import { ArrowLeftSvgComponent } from './components/time-registration-admin/user-details-admin/svgs/arrow-left-svg/arrow-left-svg.component';
import { ArrowRightSvgComponent } from './components/time-registration-admin/user-details-admin/svgs/arrow-right-svg/arrow-right-svg.component';
import { UserSelectComponent } from './components/time-registration-admin/user-details-admin/user-select/user-select.component';
import { PaidAbsenceStatsComponent } from './components/time-registration-admin/user-details-admin/paid-absence-stats/paid-absence-stats.component';
import { PulseSpinnerComponent } from './components/time-registration-admin/user-details-admin/pulse-spinner/pulse-spinner.component';
import { PersonalStatisticsComponent } from './components/personal-statistics/personal-statistics.component';
import { UserTypeSelectComponent } from './components/time-registration-admin/user-details-admin/user-select/user-type-select/user-type-select.component';
import { CompanySelectComponent } from './components/personal-statistics/company-select/company-select.component';
import { OptionsMenuModule } from './components/time-registration-admin/user-details-admin/options-menu/options-menu.module';
import { DateRangeSelectComponent } from './components/personal-statistics/date-range-select/date-range-select.component';
import { PersonalStatisticsTableComponent } from './components/personal-statistics/personal-statistics-table/personal-statistics-table.component';
import { InputTextFilterComponent } from './components/personal-statistics/input-text-filter/input-text-filter.component';
import { SearchIconSvgComponent } from './components/personal-statistics/input-text-filter/search-icon-svg/search-icon-svg.component';
import { NavTabsComponent } from './components/personal-statistics/nav-tabs/nav-tabs.component';
import { NavTabComponent } from './components/personal-statistics/nav-tabs/nav-tab/nav-tab.component';
import { ScrollDetectorDirective } from './components/personal-statistics/scroll-detector.directive';
import { TimsheetSettingsLonetyperComponent } from './components/timsheet-settings-lonetyper/timsheet-settings-lonetyper.component';
import { AbsenceTypesComponent } from './components/absence-types/absence-types.component';
import { ErsattningsvarotyperComponent } from './components/ersattningsvarotyper/ersattningsvarotyper.component';
import { AbsenceTypesTableComponent } from './components/absence-types/absence-types-table/absence-types-table.component';
import { PlusIconSvgComponent } from './components/absence-types/absence-types-table/plus-icon-svg/plus-icon-svg.component';
import { DragElementDirectiveModule } from "../utility/drag-element-directive/drag-element.directive.module";
import { TrashCanIconSvgComponent } from './components/absence-types/absence-types-table/trash-can-icon-svg/trash-can-icon-svg.component';
import { AddYearModalComponent } from './components/absence-types/absence-types-table/add-year-modal/add-year-modal.component';
import { StatsYearComponent } from './components/absence-types/absence-types-table/stats-year/stats-year.component';
import { AbsenceTypeEditorComponent } from './components/absence-types/absence-type-editor/absence-type-editor.component';
import { EditIconSvgComponent } from './components/absence-types/absence-type-editor/edit-icon-svg/edit-icon-svg.component';
import { CheckedIconSvgComponent } from './components/absence-types/absence-type-editor/checked-icon-svg/checked-icon-svg.component';
import { EditAbsenceModalComponent } from './components/absence-types/absence-type-editor/edit-absence-modal/edit-absence-modal.component';
import { AbsenceTypeComponent } from './components/absence-types/absence-type-editor/absence-type/absence-type.component';
import { WhiteSelectModule } from "../utility/white-select/white-select.module";
import { SpsColorPickerModule } from "../utility/sps-color-picker/sps-color-picker.module";
import { GreyCloseSvgModule } from "../utility/svgs/grey-close-svg/grey-close-svg.module";
import { SpsHolidaysComponent } from './components/absence-types/sps-holidays/sps-holidays.component';
import { HolidayComponent } from './components/absence-types/sps-holidays/holiday/holiday.component';
import { HolidayEditorComponent } from './components/absence-types/sps-holidays/holiday-editor/holiday-editor.component';
import { LonetyperEditorComponent } from './components/timsheet-settings-lonetyper/lonetyper-editor/lonetyper-editor.component';
import { WageTypeSelectComponent } from './components/timsheet-settings-lonetyper/lonetyper-editor/wage-type-select/wage-type-select.component';
import { ArrowDownSvgModule } from "../utility/svgs/arrow-down-svg/arrow-down-svg.module";
import { SentIconSvgModule } from "../utility/svgs/sent-icon-svg/sent-icon-svg.module";
import { WorkingHoursEditorComponent } from './components/timsheet-settings-lonetyper/lonetyper-editor/working-hours-editor/working-hours-editor.component';
import { RegularTimeComponent } from './components/timsheet-settings-lonetyper/lonetyper-editor/regular-time/regular-time.component';
import { TimeInputModule } from "../utility/time-input/time-input.module";
import { SpsWorkWeekComponent } from './components/timsheet-settings-lonetyper/lonetyper-editor/sps-work-week/sps-work-week.component';
import { ErsattningsvarotyperTableComponent } from './components/ersattningsvarotyper/ersattningsvarotyper-table/ersattningsvarotyper-table.component';
import { ErsattningsvarotyperRowComponent } from './components/ersattningsvarotyper/ersattningsvarotyper-table/ersattningsvarotyper-row/ersattningsvarotyper-row.component';
import { ErsattningsvarotyperEditorComponent } from './components/ersattningsvarotyper/ersattningsvarotyper-table/ersattningsvarotyper-editor/ersattningsvarotyper-editor.component';
import { PayrollComponent } from './components/time-registration-admin/payroll/payroll.component';
import { PayrollMenuComponent } from './components/time-registration-admin/payroll/payroll-menu/payroll-menu.component';
import { PayrollUserListComponent } from './components/time-registration-admin/payroll/payroll-user-list/payroll-user-list.component';
import { GreenSelectModule } from "../utility/green-select/green-select.module";
import { DownloadIconSvgModule } from "../utility/svgs/download-icon-svg/download-icon-svg.module";
import { PayrollMenuItemComponent } from './components/time-registration-admin/payroll/payroll-menu/payroll-menu-item/payroll-menu-item.component';
import { SendIconSvgModule } from "../utility/svgs/send-icon-svg/send-icon-svg.module";
import { PayrollFormComponent } from './components/time-registration-admin/payroll/payroll-menu/payroll-form/payroll-form.component';
import { PayrollEmailLogsComponent } from './components/time-registration-admin/payroll/payroll-menu/payroll-email-logs/payroll-email-logs.component';
import { ScheduleCalendarNavigationComponent } from './components/time-registration-users/schedule-calendar-navigation/schedule-calendar-navigation.component';
import { SdArrowLeftLgModule } from "../utility/svgs/sd-arrow-left-lg/sd-arrow-left-lg.module";
import { SdArrowRightLgModule } from "../utility/svgs/sd-arrow-right-lg/sd-arrow.right-lg.module";
import { SdArrowLeftSmModule } from "../utility/svgs/sd-arrow-left-sm/sd-arrow-left-sm.module";
import { SdArrowRightSmModule } from "../utility/svgs/sd-arrow-right-sm/sd-arrow-right-sm.module";
import { MiniScheduleModule } from "../main/components/mini-schedule/mini-schedule.module";
import { CalendarDayComponent } from './components/time-registration-users/schedule-calendar/calendar-day/calendar-day.component';
import { LockIconSvgModule } from "../utility/svgs/lock-icon-svg/lock-icon-svg.module";
import { AddIconSvgModule } from "../utility/svgs/add-icon-svg/add-icon-svg.module";
import { SettingsIconSvgModule } from "../utility/svgs/settings-icon-svg/settings-icon-svg.module";
import { DropdownsModule } from "../utility/dropdowns/dropdowns.module";
import { ActiveStatusSelectComponent } from './components/personal-statistics/active-status-select/active-status-select.component';
import { UserAbsenceStatsComponent } from './components/absence-types/absence-types-table/user-absence-stats/user-absence-stats.component';
import { AbsenceNameComponent } from './components/absence-types/absence-types-table/user-absence-stats/absence-name/absence-name.component';
import { ThreeDotsSvg2Module } from "../utility/svgs/three-dots-svg2/three-dots-svg2.module";
import { ArrowUpSvg2Module } from "../utility/svgs/arrow-up-svg2/arrow-up-svg2.module";
import { ArrowDownSvg2Module } from "../utility/svgs/arrow-down-svg2/arrow-down-svg2.module";
import { SalarySystemEditorComponent } from './components/absence-types/salary-system-editor/salary-system-editor.component';
 
@NgModule({
  declarations: [
    TimesheetsComponent,
    AbsenceMessagesComponent, 
    EditFlexComponent, 
    MileageRegistrationUsersRegistrationComponent,
    MileageReviewComponent,
    ScheduleComponent,
    ScheduleDetailAdminComponent,
    ScheduleDetailComponent,
    ScheduleDetailCalendarComponent,
    ScheduleReviewComponent,
    SyncfusionCalendarComponent,
    Schedule2Component,
    SetTimeComponent,
    TimeComponent,
    CreateAbsenceComponent,
    TimeRegistrationAdminComponent,
    TimeRegistrationUserDetailsComponent,
    SynfusionAdminCalendarComponent,
    ApproveAbsenceModalComponent,
    UserDetailsAdminComponent,
    AdminRegisterTimeComponent,
    PdfGeneratorComponent,
    HasSeenModalComponent,
    ScheduleCalendarComponent,
    TimeSheetOverviewComponent,
    EmptyCalendarRowComponent,
    BackButtonSvgUdComponent,
    CalendarIconSvgComponent,
    ArrowLeftSvgComponent,
    ArrowRightSvgComponent,
    UserSelectComponent,
    PaidAbsenceStatsComponent,
    PulseSpinnerComponent,
    PersonalStatisticsComponent,
    UserTypeSelectComponent,
    CompanySelectComponent,
    DateRangeSelectComponent,
    PersonalStatisticsTableComponent,
    InputTextFilterComponent,
    SearchIconSvgComponent,
    NavTabsComponent,
    NavTabComponent,
    ScrollDetectorDirective,
    TimsheetSettingsLonetyperComponent,
    AbsenceTypesComponent,
    ErsattningsvarotyperComponent,
    AbsenceTypesTableComponent,
    PlusIconSvgComponent,
    TrashCanIconSvgComponent,
    AddYearModalComponent,
    StatsYearComponent,
    AbsenceTypeEditorComponent,
    EditIconSvgComponent,
    CheckedIconSvgComponent,
    EditAbsenceModalComponent,
    AbsenceTypeComponent,
    SpsHolidaysComponent,
    HolidayComponent,
    HolidayEditorComponent,
    LonetyperEditorComponent,
    WageTypeSelectComponent,
    WorkingHoursEditorComponent,
    RegularTimeComponent,
    SpsWorkWeekComponent,
    ErsattningsvarotyperTableComponent,
    ErsattningsvarotyperRowComponent,
    ErsattningsvarotyperEditorComponent,
    PayrollComponent,
    PayrollMenuComponent,
    PayrollUserListComponent,
    PayrollMenuItemComponent,
    PayrollFormComponent,
    PayrollEmailLogsComponent,
    ScheduleCalendarNavigationComponent,
    CalendarDayComponent,
    ActiveStatusSelectComponent,
    UserAbsenceStatsComponent,
    AbsenceNameComponent,
    SalarySystemEditorComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatProgressSpinnerModule,
    FormsModule,
    ConfirmationModalModule, 
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    ColorPickerModule,
    ScrollingModule,
    InputAutocompleteModule,
    MatProgressBarModule,
    FilePreviewModule,
    GalleryModule,
    MatIconModule,
    RouterModule,
    MatDialogModule,
    TranslateModule.forChild({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
    }),
    TimeRegistrationUsersRegistrationModule,
    TimeRegistrationUsersAbsenceModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatTableModule,
    MatSelectModule,
    MatInputModule, 
    MatAutocompleteModule,
    ScheduleAllModule,
    RecurrenceEditorAllModule,
    NumberFormatModule,
    DragElementDirectiveModule,
    WhiteSelectModule,
    SpsColorPickerModule,
    GreyCloseSvgModule, 
    ArrowDownSvgModule,
    SentIconSvgModule,
    TimeInputModule,
    GreenSelectModule,
    DownloadIconSvgModule,
    SendIconSvgModule,
    SdArrowLeftLgModule,
    SdArrowRightLgModule,
    SdArrowLeftSmModule,
    SdArrowRightSmModule,
    MiniScheduleModule,
    LockIconSvgModule,
    AddIconSvgModule,
    SettingsIconSvgModule,
    DropdownsModule,
    NumberFormatModule,
    OptionsMenuModule,
    ThreeDotsSvg2Module,
    ArrowUpSvg2Module,
    ArrowDownSvg2Module
  ],
  providers: [],
})
export class TimesheetsModule {}
