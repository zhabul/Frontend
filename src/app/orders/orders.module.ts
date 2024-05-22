import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OrdersRoutingModule } from "./orders-routing.module";
import { HttpClient } from "@angular/common/http";
import { createTranslateLoader } from "../createTranslateLoader";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { OrdersComponent } from "./components/orders/orders.component";
import { NewOrderComponent } from "./components/new-order/new-order.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CartComponent } from "./components/cart/cart.component";
import { OrderCategoryComponent } from "./components/materials/components/order-category/category.component";
import { OrderMaterialsComponent } from "./components/materials/components/order-materials/materials.component";
import { ViewOrderMaterialsComponent } from "./components/view-order-materials/view-order-materials.component";
import { OrderComponent } from "./components/order/order.component"; 
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ChangeOrderDateComponent } from "./components/change-order-date/change-order-date.component";
import { SubCategoryComponent } from "./components/materials/components/sub-category/sub-category.component";
import { DeliveryOrderComponent } from "./components/delivery-order/delivery-order.component";
import { AcceptancePdfComponent } from "./components/acceptance-pdf/acceptance-pdf.component";
import { PipesModule } from "../core/pipes/pipes.module";
import { OrderAcceptanceCommentsComponent } from "./components/order-acceptance-comments/order-acceptance-comments.component";
import { ConfirmationModalModule } from "../shared";
import { InputAutocompleteModule } from "src/app/utility/input-autocomplete/input-autocomplete.module";
import { GalleryModule } from "../utility/gallery/gallery.module";
import { FilePreviewModule } from "../projects/components/image-modal/file-preview/file-preview.module";
import { PdfViewerModule } from "ng2-pdf-viewer";

@NgModule({
  declarations: [
    OrdersComponent,
    NewOrderComponent,
    CartComponent,
    OrderCategoryComponent,
    OrderMaterialsComponent,
    ViewOrderMaterialsComponent,
    OrderComponent,
    ChangeOrderDateComponent,
    OrderAcceptanceCommentsComponent,
    SubCategoryComponent,
    DeliveryOrderComponent,
    AcceptancePdfComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OrdersRoutingModule,
    ConfirmationModalModule,
    MatProgressSpinnerModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    PipesModule,
    GalleryModule,
    FilePreviewModule,
    InputAutocompleteModule,
    PdfViewerModule
  ],
})
export class OrdersModule {}
