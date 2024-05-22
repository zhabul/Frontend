import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SupportModalComponent } from "./support-modal/support-modal.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { EditorModule } from "@tinymce/tinymce-angular";
import { DNDModule } from "../../../projects/components/image-modal/dnd.module";
import { FilePreviewModule } from "../../../projects/components/image-modal/file-preview/file-preview.module";
import { GalleryModule } from "../../../utility/gallery/gallery.module";
import { MatDialogModule } from "@angular/material/dialog";
import { SvgGlobalModule } from "src/app/utility/svgs/svg-global/svg-global.module";

@NgModule({
  declarations: [SupportModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DragDropModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    EditorModule,
    DNDModule,
    FilePreviewModule,
    GalleryModule,
    SvgGlobalModule
  ],
  exports: [SupportModalComponent],
})
export class SupportModalModule {}
