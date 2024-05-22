import { NgModule } from "@angular/core";
import { TimeRegistrationUsersAbsenceComponent } from "./time-registration-users-absence.component";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { AppRoutingModule } from "../../../../app-routing.module";
import { createTranslateLoader } from "../../../../createTranslateLoader";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputAutocompleteModule } from "src/app/utility/input-autocomplete/input-autocomplete.module";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { GalleryModule } from "../../../../utility/gallery/gallery.module";

import { FilePreviewModule } from "../../../../projects/components/image-modal/file-preview/file-preview.module";

@NgModule({
  declarations: [TimeRegistrationUsersAbsenceComponent],
  exports: [],
  entryComponents: [],
  bootstrap: [],
  imports: [
    AppRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    BrowserModule,
    FilePreviewModule,
    FormsModule,
    ReactiveFormsModule,
    InputAutocompleteModule,
    NgxMaterialTimepickerModule,
    MatProgressSpinnerModule,
    GalleryModule,
  ],
})
export class TimeRegistrationUsersAbsenceModule {}
