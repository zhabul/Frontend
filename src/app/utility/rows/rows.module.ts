import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { createTranslateLoader } from "../../createTranslateLoader";
import { RowsComponent } from "./rows.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EditoreModule } from '../text-comment/editore.module';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { CloseIconSvgModule } from "../svgs/close-icon-svg/close-icon-svg.module";
import { RowLineComponent } from './row-line/row-line.component';
import { LineArticleModule } from './row-line/line-article/line-article.module';
import { DeleteIconSvgModule } from "src/app/utility/svgs/delete-icon-svg/delete-icon-svg.module";
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MoveIconSvgModule } from "src/app/utility/svgs/move-icon-svg/move-icon-svg.module";
import { ArrowIconSvgModule } from "../svgs/arrow-icon-svg/arrow-icon-svg.module";
import { FolderIconSvgModule } from "src/app/utility/svgs/folder-icon-svg/folder-icon-svg.module";
import { NewCardPlusSvgModule } from 'src/app/utility/svgs/new-card-plus-svg/new-card-plus-svg.module';
import { AddNameModalModule } from "../add-name-modal/add-name-modal.module";
import { SpsLoaderModule } from "../sps-loader/sps-loader.module";
 
@NgModule({ 
  declarations: [RowsComponent, RowLineComponent],
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
    CloseIconSvgModule,
    LineArticleModule,
    DeleteIconSvgModule,
    DragDropModule,
    MoveIconSvgModule,
    ArrowIconSvgModule,
    FolderIconSvgModule,
    NewCardPlusSvgModule,
    AddNameModalModule,
    SpsLoaderModule
  ],
  exports: [RowsComponent],
  entryComponents: [],
  providers: [],
  bootstrap: [],
})
export class RowsModule {}
