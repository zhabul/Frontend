import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";
import { OrdersComponent } from "./components/orders/orders.component";
import { NewOrderComponent } from "./components/new-order/new-order.component";
import { CartComponent } from "./components/cart/cart.component";
import { OrderCategoryComponent } from "./components/materials/components/order-category/category.component";
import { OrderMaterialsComponent } from "./components/materials/components/order-materials/materials.component";
import { CategoryResolverService } from "../materials/resolvers/category-resolver.service";
import { ViewOrderMaterialsComponent } from "./components/view-order-materials/view-order-materials.component";
import { OrdersResolverService } from "./components/materials/resolvers/orders-resolver.service";
import { OrderComponent } from "./components/order/order.component";
import { OrderResolverService } from "./components/materials/resolvers/order-resolver.service";
import { DeliverEmailResolverService } from "./components/materials/resolvers/deliver-emails-resolver.service";
import { UnitsResolverService } from "../materials/resolvers/units-resolver.service";
import { ChangeOrderDateComponent } from "./components/change-order-date/change-order-date.component";
import { OrderAcceptanceCommentsComponent } from "./components/order-acceptance-comments/order-acceptance-comments.component";
import { OrderAcceptanceCommentsResolverService } from "./resolvers/order-acceptance-comments-resolver.service";
import { SubCategoryComponent } from "./components/materials/components/sub-category/sub-category.component";
import { OrderDataResolverService } from "./resolvers/order-data-resolver.service";
import { GetOrderResolverService } from "./resolvers/get-order-resolver.service";
import { DeliveryOrderComponent } from "./components/delivery-order/delivery-order.component";
import { AcceptancePdfComponent } from "./components/acceptance-pdf/acceptance-pdf.component";
import { DeliveryResolverService } from "./resolvers/delivery-resolver.service";
import { ProjectResolverService } from "./resolvers/project-resolver.service";
import { MaterialResolverService } from "./resolvers/material.resolver.service";
import { CategoriesResolverService } from "./resolvers/categories.resolver.service";
import { SubcategoryResolverService } from "./resolvers/subcategory.resolver.service";
import { MaterialsResolverService } from "./resolvers/materials-resolver.service";
import { SupplierCategoryResolverService } from "../materials/resolvers/supplier-category-resolver.service";
import { AuthGuard } from "../guards/auth.guard";
import { AllUsersResolver } from "./resolvers/all-users-resolver.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path: "",
        component: OrdersComponent,
        resolve: { orders: OrdersResolverService },
        data: { roles: ["show_project_Global"] },
        canActivate: [AuthGuard],
      },
      {
        path: "new/:project_id",
        component: NewOrderComponent,
        resolve: {
          project: ProjectResolverService,
          emails: DeliverEmailResolverService,
          deliveries: DeliveryResolverService,
          users: AllUsersResolver,
        },
        data: { roles: ["show_project_Global"] },
        canActivate: [AuthGuard],
      },
      {
        path: "cart",
        component: CartComponent,
        resolve: { order: OrderResolverService },
        data: { roles: ["show_project_Global", "show_project_Order"] },
        canActivate: [AuthGuard],
      },

      {
        path: "categories",
        component: OrderMaterialsComponent,
        resolve: { materials: CategoriesResolverService },
        data: { roles: ["show_project_Global", "show_project_Order"] },
        canActivate: [AuthGuard],
      },
      {
        path: "materials/:category_id",
        component: SubCategoryComponent,
        resolve: { materials: SubcategoryResolverService },
        data: { roles: ["show_project_Global", "show_project_Order"] },
        canActivate: [AuthGuard],
      },

      {
        path: "submaterials/:category_id",
        component: OrderCategoryComponent,
        resolve: { materials: MaterialsResolverService },
        data: { roles: ["show_project_Global", "show_project_Order"] },
        canActivate: [AuthGuard],
      },
      {
        path: "view-order/:id",
        component: ViewOrderMaterialsComponent,
        resolve: {
          material: MaterialResolverService,
          units: UnitsResolverService,
        },
        data: { roles: ["show_project_Global", "show_project_Order"] },
        canActivate: [AuthGuard],
      },
      {
        path: "order/:id",
        component: OrderComponent,
        resolve: { order: OrderResolverService },
        data: { roles: ["show_project_Global", "show_project_Order"] },
        canActivate: [AuthGuard],
      },
      {
        path: "change-order-date/:id",
        component: ChangeOrderDateComponent,
        resolve: {
          order: OrderDataResolverService,
          getOrder: GetOrderResolverService,
        },
        data: { roles: ["show_project_Global", "show_project_Order"] },
        canActivate: [AuthGuard],
      },
      {
        path: "order-acceptance-comments/:id",
        component: OrderAcceptanceCommentsComponent,
        resolve: {
          order: OrderDataResolverService,
          getOrder: GetOrderResolverService,
          getOrderAcceptanceComments: OrderAcceptanceCommentsResolverService,
          orderAsdf: OrderResolverService,
        },
        data: { roles: ["show_project_Global", "show_project_Order"] },
        canActivate: [AuthGuard],
      },
      {
        path: "delivery-order/:id",
        component: DeliveryOrderComponent,
        resolve: {
          order: OrderDataResolverService,
          getOrder: GetOrderResolverService,
          suppliers: SupplierCategoryResolverService,
        },
        data: { roles: ["show_project_Global", "show_project_Order"] },
        canActivate: [AuthGuard],
      },
      {
        path: "acceptance-pdf/:id",
        component: AcceptancePdfComponent,
        resolve: { order: GetOrderResolverService },
        data: { roles: ["show_project_Global", "show_project_Order"] },
        canActivate: [AuthGuard],
      },
    ]),
  ],
  exports: [RouterModule, TranslateModule],
  providers: [
    MaterialsResolverService,
    CategoryResolverService,
    MaterialResolverService,
    OrdersResolverService,
    OrderDataResolverService,
    GetOrderResolverService,
    DeliverEmailResolverService,
    DeliveryOrderComponent,
    AcceptancePdfComponent,
    UnitsResolverService,
    OrderResolverService,
    DeliveryResolverService,
    ProjectResolverService,
    AllUsersResolver,
    OrderAcceptanceCommentsResolverService,
    CategoriesResolverService,
    SubcategoryResolverService,
  ],
})
export class OrdersRoutingModule {}
