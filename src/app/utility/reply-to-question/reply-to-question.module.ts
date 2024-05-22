import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { createTranslateLoader } from "../../createTranslateLoader";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EditoreModule } from '../text-comment/editore.module';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ReplyToQuestionComponent } from "./reply-to-question.component";
import { CommentSectionModule } from "../comment-section/comment-section.module";
import { SendIconSvgModule } from "../svgs/send-icon-svg/send-icon-svg.module";

@NgModule({
  declarations: [ReplyToQuestionComponent,],
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
    CommentSectionModule,
    SendIconSvgModule,
    MatProgressSpinnerModule
  ],
  exports: [ReplyToQuestionComponent],
  entryComponents: [],
  providers: [],
  bootstrap: [],
})
export class ReplyToQuestionModule {}
