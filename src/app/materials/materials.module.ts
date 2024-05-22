import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { createTranslateLoader } from "../createTranslateLoader";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { MaterialsRoutingModule } from "./materials-routing.module";
import { MaterialsComponent } from "./components/materials/materials.component";
import { NewCategoryComponent } from "./components/new-category/new-category.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CategoryComponent } from "./components/category/category.component";
import { NewMaterialComponent } from "./components/new-material/new-material.component";
import { EditMaterialComponent } from "./components/edit-material/edit-material.component";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { SubCategoryComponent } from "./components/sub-category/sub-category.component";
import { NewSubcategoryComponent } from "./components/new-subcategory/new-subcategory.component";

import { DragDropModule } from "@angular/cdk/drag-drop";
import { ConfirmationModalModule } from "../shared";

@NgModule({
  declarations: [
    MaterialsComponent,
    NewCategoryComponent,
    CategoryComponent,
    NewMaterialComponent,
    EditMaterialComponent,
    SubCategoryComponent,
    NewSubcategoryComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialsRoutingModule,
    DragDropModule,
    ConfirmationModalModule,
    NgMultiSelectDropDownModule.forRoot(),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
})
export class MaterialsModule {}
