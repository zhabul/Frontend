import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { createTranslateLoader } from "../../createTranslateLoader";
import { CommentSectionComponent } from "./comment-section.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EditoreModule } from '../text-comment/editore.module';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { DragDropModule } from "@angular/cdk/drag-drop";

@NgModule({
  declarations: [CommentSectionComponent,],
  imports: [
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    FormsModule,
    ReactiveFormsModule,
    EditoreModule,
    MatProgressSpinnerModule,
    DragDropModule
  ],
  exports: [CommentSectionComponent],
  entryComponents: [],
  providers: [],
  bootstrap: [],
})
export class CommentSectionModule {}
