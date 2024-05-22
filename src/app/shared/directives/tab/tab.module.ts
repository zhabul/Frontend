import { NgModule } from '@angular/core';
import { TabDirective} from './tab.directive';
@NgModule({
  declarations: [
    TabDirective,
  ],
  exports: [
    TabDirective,
  ]
})
export class TabModule { }
