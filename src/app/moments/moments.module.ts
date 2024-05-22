import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DragDropModule } from "@angular/cdk/drag-drop";

import { MomentsRoutingModule } from "./moments-routing.module";
import { ProjectMomentsComponent } from "./project-moments/project-moments.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { PlanerComponent } from "./moments-planer/components/planer/planer.component";
import { CanvasComponent } from "./moments-planer/components/canvas/canvas.component";
import { NewSchedulePlanComponent } from "./moments-planer/components/new-schedule-plan/new-schedule-plan.component";
import { ProjectSchedulePlanerComponent } from "./moments-planer/components/project-schedule-planer/project-schedule-planer.component";
import { UserProjectSchedulePlannerComponent } from "./moments-planer/components/planer/user-project-schedule-planner/user-project-schedule-planner.component";
import { AddUserToProjectComponent } from "./components/add-user-to-project/add-user-to-project.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AddUserToChildrenProjectComponent } from "./components/add-user-to-children-project/add-user-to-children-project.component";
import { MomentSchedulePreviewComponent } from "src/app/moments/components/moment-schedule-preview/moment-schedule-preview.component";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { FilterPipe } from "./components/moment-schedule-preview/filter.pipe";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { ColorPickerModule } from "ngx-color-picker";
import { ConfirmationModalModule } from "../shared";
import { UserRowComponent } from "./components/moment-schedule-preview/user-row/user-row.component";

import { ScrollingModule } from "@angular/cdk/scrolling";
import { CalendarHeaderComponent } from "./components/time-registration-admin/calendar-header/calendar-header.component";
import { UserDayMomentsComponent } from "./components/time-registration-admin/calendar-user-row/user-day-moments/user-day-moments.component";
import { UserDayAbsencesComponent } from "./components/time-registration-admin/calendar-user-row/user-day-absences/user-day-absences.component";
import { InputAutocompleteModule } from "src/app/utility/input-autocomplete/input-autocomplete.module";
import { CheckedIconComponent } from "./components/time-registration-admin/calendar-header/checked-icon/checked-icon.component";

import { WeekColumnComponent } from "./components/time-registration-admin/sticky-weeks/week-column/week-column.component";
import { ColumnStateStore } from "./components/time-registration-admin/column-state-store.service";
import { GetUsersStore } from "./components/time-registration-admin/calendar-header/get-users-store.service";
import { ChatStore } from "./components/time-registration-admin/calendar-user-row/week-modal/chat-store.service";
import { ChatService } from "./components/time-registration-admin/calendar-user-row/week-modal/chat.service";
import { RowDayComponent } from "./components/time-registration-admin/calendar-user-row/row-day/row-day.component";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { ChatBubbleArrowComponent } from "./components/time-registration-admin/calendar-user-row/week-modal/svgs/chat-bubble-arrow/chat-bubble-arrow.component";
import { TimeRegistrationAdminComponent } from "./components/time-registration-admin/time-registration-admin.component";
import { CalendarUserRowComponent } from "./components/time-registration-admin/calendar-user-row/calendar-user-row.component";
import { UserNameComponent } from "./components/time-registration-admin/user-name/user-name.component";
import { LockIconsComponent } from "./components/time-registration-admin/calendar-user-row/lock-icons/lock-icons.component";
import { StickyWeeksComponent } from "./components/time-registration-admin/sticky-weeks/sticky-weeks.component";
import { WeekModalComponent } from "./components/time-registration-admin/calendar-user-row/week-modal/week-modal.component";
import { ModalPlaceholderComponent } from "./components/time-registration-admin/calendar-user-row/modal-placeholder/modal-placeholder.component";
import { RowWrapperComponent } from "./components/time-registration-admin/row-wrapper/row-wrapper.component";
import { ContenteditableModel } from "./components/time-registration-admin/calendar-user-row/week-modal/contenteditable-model";
import { CalConfirmationModalComponent } from "./components/time-registration-admin/calendar-user-row/week-modal/cal-confirmation-modal/cal-confirmation-modal.component";
import { WeekPipe } from "./pipes/week.pipe";
import { MsgSvgComponent } from './components/time-registration-admin/user-name/msg-svg/msg-svg.component';
import { QuestionSvgComponent } from './components/time-registration-admin/calendar-user-row/week-modal/svgs/question-svg/question-svg.component';
import { DotSvgComponent } from './components/time-registration-admin/calendar-user-row/week-modal/svgs/dot-svg/dot-svg.component';
import { Lock2SvgComponent } from './components/time-registration-admin/calendar-user-row/week-modal/svgs/lock2-svg/lock2-svg.component';
import { Lock3SvgComponent } from './components/time-registration-admin/calendar-user-row/week-modal/svgs/lock3-svg/lock3-svg.component';
import { DeleteSvgComponent } from './components/time-registration-admin/calendar-user-row/week-modal/svgs/delete-svg/delete-svg.component';
import { CloseXSvgComponent } from './components/time-registration-admin/calendar-user-row/week-modal/svgs/close-x-svg/close-x-svg.component';
import { ArrowSvgComponent } from './components/time-registration-admin/calendar-user-row/week-modal/arrow-svg/arrow-svg.component';
import { SendSvgComponent } from './components/time-registration-admin/calendar-user-row/week-modal/svgs/send-svg/send-svg.component';
import { BackButtonSvgComponent } from './components/time-registration-admin/calendar-header/back-button-svg/back-button-svg.component';
import { SearchIconSvgComponent } from './components/time-registration-admin/calendar-header/search-icon-svg/search-icon-svg.component';
import { CalendarIconSvgComponent } from './components/time-registration-admin/calendar-header/calendar-icon-svg/calendar-icon-svg.component';
import { ArrowLeftSvgComponent } from './components/time-registration-admin/calendar-header/arrow-left-svg/arrow-left-svg.component';
import { ArrowRightSvgComponent } from './components/time-registration-admin/calendar-header/arrow-right-svg/arrow-right-svg.component';
import { ChatMessageComponent } from './components/time-registration-admin/calendar-user-row/week-modal/chat-message/chat-message.component';
import { Dot2SvgComponent } from './components/time-registration-admin/calendar-user-row/week-modal/svgs/dot2-svg/dot2-svg.component';
import { ProjectSchedulePlanerCanvasComponent } from './project-moments-schedule-planer/project-schedule-planer-canvas/project-schedule-planer-canvas.component';
import { UserModalsComponent } from './components/time-registration-admin/user-modals/user-modals.component';
import { FilePreviewModule } from "../projects/components/image-modal/file-preview/file-preview.module";
import { GalleryModule } from "../utility/gallery/gallery.module";
import { MatIconModule } from '@angular/material/icon';
import { DropdownsModule } from "../utility/dropdowns/dropdowns.module";

import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { OptionsMenuModule } from "../timesheets/components/time-registration-admin/user-details-admin/options-menu/options-menu.module";

@NgModule({
  declarations: [
    ProjectMomentsComponent,
    PlanerComponent,
    CanvasComponent,
    NewSchedulePlanComponent,
    ProjectSchedulePlanerComponent,
    UserProjectSchedulePlannerComponent,
    AddUserToProjectComponent,
    AddUserToChildrenProjectComponent,
    MomentSchedulePreviewComponent,
    FilterPipe,
    TimeRegistrationAdminComponent,
    CalendarUserRowComponent,
    UserNameComponent,
    LockIconsComponent,
    StickyWeeksComponent,
    WeekModalComponent,
    ModalPlaceholderComponent,
    CalendarHeaderComponent,
    UserDayMomentsComponent,
    UserDayAbsencesComponent,
    CheckedIconComponent,
    WeekColumnComponent,
    RowDayComponent,
    ChatBubbleArrowComponent,
    RowWrapperComponent,
    ContenteditableModel,
    UserRowComponent,
    CalConfirmationModalComponent,
    WeekPipe,
    MsgSvgComponent,
    QuestionSvgComponent,
    DotSvgComponent,
    Lock2SvgComponent,
    Lock3SvgComponent,
    DeleteSvgComponent,
    CloseXSvgComponent,
    ArrowSvgComponent,
    SendSvgComponent,
    BackButtonSvgComponent,
    SearchIconSvgComponent,
    CalendarIconSvgComponent,
    ArrowLeftSvgComponent,
    ArrowRightSvgComponent,
    ChatMessageComponent,
    Dot2SvgComponent,
    ProjectSchedulePlanerCanvasComponent,
    UserModalsComponent
  ],
  imports: [
    CommonModule,
    MomentsRoutingModule,
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
    DropdownsModule,
    MatMenuModule,
    MatButtonModule,
    OptionsMenuModule
  ],
  providers: [
    ColumnStateStore,
    ChatStore,
    ChatService,
    GetUsersStore
  ],
})
export class MomentsModule {}
