import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";
import { MaterialsComponent } from "./components/materials/materials.component";
import { MaterialsResolverService } from "./resolvers/materials-resolver.service";
import { NewCategoryComponent } from "./components/new-category/new-category.component";
import { CategoryComponent } from "./components/category/category.component";
import { CategoryResolverService } from "./resolvers/category-resolver.service";
import { NewMaterialComponent } from "./components/new-material/new-material.component";
import { EditMaterialComponent } from "./components/edit-material/edit-material.component";
import { MaterialResolverService } from "./resolvers/material-resolver.service";
import { UnitsResolverService } from "./resolvers/units-resolver.service";
import { SubCategoryComponent } from "./components/sub-category/sub-category.component";
import { SubcategoryResolverService } from "./resolvers/subcategory-resolver.service";
import { NewSubcategoryComponent } from "./components/new-subcategory/new-subcategory.component";
import { SuppliersResolverService } from "./resolvers/suppliers-resolver.service";
import { SupplierCategoriesResolverService } from "../suppliers/resolvers/supplier-categories-resolver.service";
import { RoleGuard } from "../guards/role.guard";
import { CanDeactivateGuard } from "../shared/guards/can-deactivate.guard";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path: "",
        component: MaterialsComponent,
        resolve: { materials: MaterialsResolverService },
        data: {
          preload: false,
          roles: ["show_register_products"],
        },
        canActivate: [ RoleGuard ]
      },
      {
        path: "new",
        component: NewCategoryComponent,
        data: {
          preload: false,
          roles: ["show_register_products"],
        },
        canActivate: [ RoleGuard ]
      },
      {
        path: "new/:id",
        component: NewMaterialComponent,
        resolve: {
          material: MaterialResolverService,
          units: UnitsResolverService,
          supplierCategores: SupplierCategoriesResolverService,
        },
        data: {
          preload: false,
          roles: ["show_register_products"],
        },
        canActivate: [ RoleGuard ]
      },
      {
        path: "submaterial/:category_id",
        component: CategoryComponent,
        resolve: { materials: CategoryResolverService },
        data: {
          preload: false,
          roles: ["show_register_products"],
        },
        canActivate: [ RoleGuard ]
      },

      {
        path: "subcategory/:category_id",
        component: SubCategoryComponent,
        resolve: {
          materials: SubcategoryResolverService,
          MaterialsResolverService,
        },
        data: {
          preload: false,
          roles: ["show_register_products"],
        },
        canActivate: [ RoleGuard ]
      },
      {
        path: "subcategory/new/:id",
        component: NewSubcategoryComponent,
        data: {
          preload: false,
          roles: ["show_register_products"],
        },
        canActivate: [ RoleGuard ]
      },
      {
        path: "edit/:id",
        component: EditMaterialComponent,
        resolve: {
          material: MaterialResolverService,
          units: UnitsResolverService,
          supplierCategores: SupplierCategoriesResolverService,
        },
        data: {
          preload: false,
          roles: ["show_register_products"],
        },
        canActivate: [ RoleGuard ],
        canDeactivate: [CanDeactivateGuard]
      },
    ]),
  ],
  exports: [RouterModule, TranslateModule],
  providers: [
    MaterialsResolverService,
    CategoryResolverService,
    MaterialResolverService,
    UnitsResolverService,
    SuppliersResolverService,
    SupplierCategoriesResolverService,
  ],
})
export class MaterialsRoutingModule {}
