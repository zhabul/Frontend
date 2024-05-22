import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ClientResponseFormComponent } from './client-response-form.component';
import { FormsModule } from '@angular/forms';
import { ImageModalSmallModule } from "src/app/projects/components/image-modal-small/image-modal-small.module";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@NgModule({
  declarations: [ ClientResponseFormComponent, ],
  imports: [
    CommonModule,
    FormsModule,
    ImageModalSmallModule,
    MatProgressSpinnerModule
  ],
  exports: [ ClientResponseFormComponent ],
  entryComponents: [],
  providers: [],
  bootstrap: [],  
})
export class ClientResponseFormModule {}
