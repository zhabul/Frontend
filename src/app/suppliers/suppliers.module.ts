import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { createTranslateLoader } from "../createTranslateLoader";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { SuppliersComponent } from "./components/suppliers/suppliers.component";
import { SuppliersRoutingModule } from "./suppliers-routing.module";
import { NewSupplierComponent } from "./components/new-supplier/new-supplier.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SupplierDetailsComponent } from "./components/supplier-details/supplier-details.component";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { AllSupplierInvoicesComponent } from "./components/all-supplier-invoices/all-supplier-invoices.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { DropdownsModule } from "../utility/dropdowns/dropdowns.module";
import { ProjectsModule } from "../projects/projects.module";
import { CommentSectionModule } from "../utility/comment-section/comment-section.module";
import { AddingContactSupplierComponent } from './components/adding-contact-supplier/adding-contact-supplier.component';
import { SvgGlobalModule } from "../utility/svgs/svg-global/svg-global.module";
import { InputsModule } from "../utility/inputs/inputs.module";
import { DragDropModule } from "@angular/cdk/drag-drop";

@NgModule({
    declarations: [
        SuppliersComponent,
        NewSupplierComponent,
        SupplierDetailsComponent,
        AllSupplierInvoicesComponent,
        AddingContactSupplierComponent,

    ],
    imports: [
        CommonModule,
        RouterModule,
        SuppliersRoutingModule,
        NgMultiSelectDropDownModule.forRoot(),
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            },
        }),
        FormsModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        DropdownsModule,
        ProjectsModule,
        CommentSectionModule,
        DropdownsModule,
        SvgGlobalModule,
        InputsModule,
        DragDropModule
    ]
})
export class SuppliersModule {

}
