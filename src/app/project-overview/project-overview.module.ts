import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProjectOverviewComponent } from "./components/project-overview.component";
import { ProjectOverviewRoutingModule } from "./project-overview-routing.module";
import { TreeItemComponent } from "./tree-item/tree-item.component";
import { TreeListComponent } from "./tree-list/tree-list.component";
import { TreeItemForResultsComponent } from "./tree-item-for-results/tree-item-for-results.component";
import { TreeListForResultsComponent } from "./tree-list-for-results/tree-list-for-results.component";
import { QuillModule } from "ngx-quill";
import { CommentSectionModule } from "../utility/comment-section/comment-section.module";
import { DropdownProjectoverviewComponent } from "./dropdown-projectoverview/dropdown-projectoverview.component";
import { ArrowDropdownComponent } from "./arrow-dropdown/arrow-dropdown.component";
import { CheckinCheckoutModule } from "../utility/checkin-checkout/checkin-checkout.module";
import { DropdownForSelectAllComponent } from "./dropdown-for-select-all/dropdown-for-select-all.component";
import { DebitPipe } from "./pipes/debit.pipe";
import { FormsModule } from "@angular/forms";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
/* import { EditoreModule } from '../utility/text-comment/editore.module';
import { GalleryModule } from '../utility/gallery/gallery.module';
import { FilePreviewModule } from '../projects/components/image-modal/file-preview/file-preview.module'; */

@NgModule({
  declarations: [
    ProjectOverviewComponent,
    TreeItemComponent,
    TreeListComponent,
    TreeItemForResultsComponent,
    TreeListForResultsComponent,
    DropdownProjectoverviewComponent,
    ArrowDropdownComponent,
    DropdownForSelectAllComponent,
    DebitPipe,
  ],
  imports: [
    CommonModule,
    ProjectOverviewRoutingModule,
    QuillModule.forRoot(),
    CommentSectionModule,
    CheckinCheckoutModule,
    FormsModule,
    MatProgressSpinnerModule,
  ],
})
export class ProjectOverviewModule {}
