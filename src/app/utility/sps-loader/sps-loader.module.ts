import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SpsLoaderComponent } from "./sps-loader.component";

@NgModule({
  declarations: [SpsLoaderComponent],
  imports: [
    CommonModule 
  ],
  exports: [SpsLoaderComponent],
  entryComponents: [],
  providers: [],
  bootstrap: [],  
})
export class SpsLoaderModule {}
