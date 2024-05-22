import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { createTranslateLoader } from "../createTranslateLoader";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { UsersRoutingModule } from "./users-routing.module";
import { UsersComponent } from "./components/users/users.component";
import { NewUserComponent } from "./components/new-user/new-user.component";
import { EditUserComponent } from "./components/edit-user/edit-user.component";
import { EditRolesComponent } from "./components/edit-roles/edit-roles.component";
import { UserEducation } from "./components/edit-user/user-education/user-education.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { GalleryModule } from "../utility/gallery/gallery.module";
import { FilePreviewModule } from "../projects/components/image-modal/file-preview/file-preview.module";
import { MatDialogModule } from "@angular/material/dialog";
import { PaginationModule } from "../utility/pagination/pagination.module";
import { CustomSimpleSelectModule } from "../shared/components/custom-simple-select/custom-simple-select.model";
import { SendDropdownComponent } from './components/edit-user/user-education/send-dropdown/send-dropdown.component';
import { ThreeDotsComponent } from './components/edit-user/user-education/three-dots/three-dots.component';
import { ThreeDotsHourlyComponent } from './components/edit-user/user-education/three-dots-hourly/three-dots-hourly.component';
import { CommentSectionModule } from "../utility/comment-section/comment-section.module";
import { RoleDropdownComponent } from './components/edit-user/role-dropdown/role-dropdown.component';
import { DropdownFilterComponent } from './components/users/dropdown-filter/dropdown-filter.component';
import { EducationDialogComponent } from './components/edit-user/user-education/education-dialog/education-dialog.component';
import { FormUserComponent } from './components/shared/form-user/form-user.component';
import { FormRoleDropdownComponent } from './components/edit-user/form-role-dropdown/form-role-dropdown.component';
import { ConfirmModalModule } from "../shared/modals/confirm-modal/confirm-modal.module";
import { PdfjsviewerModule } from "../utility/pdfjs-viewer/pdfjsviewer.module";
import { InputsModule } from "../utility/inputs/inputs.module";

@NgModule({
  declarations: [
    UsersComponent,
    NewUserComponent,
    EditUserComponent,
    EditRolesComponent,
    UserEducation,
    SendDropdownComponent,
    ThreeDotsComponent,
    ThreeDotsHourlyComponent,
    RoleDropdownComponent,
    DropdownFilterComponent,
    EducationDialogComponent,
    FormUserComponent,
    FormRoleDropdownComponent,
 
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule,
    CustomSimpleSelectModule,
    CommentSectionModule,
    MatProgressSpinnerModule,
    GalleryModule,
    FilePreviewModule,
    MatDialogModule,
    ConfirmModalModule,
    NgMultiSelectDropDownModule.forRoot(),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    PdfjsviewerModule,
    InputsModule
  ],
  exports: [ TranslateModule,
             FormUserComponent,
             UserEducation,
             ThreeDotsComponent,
             SendDropdownComponent
            ],
})
export class UsersModule {}
