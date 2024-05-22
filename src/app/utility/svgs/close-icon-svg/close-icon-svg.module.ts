import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CloseIconSvgComponent } from "./close-icon-svg.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@NgModule({
  declarations: [CloseIconSvgComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  exports: [CloseIconSvgComponent],
  entryComponents: [],
  providers: [],
  bootstrap: [],
})
export class CloseIconSvgModule {}
