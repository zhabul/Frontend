import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UniquePipe } from "src/app/unique.pipe";
import { TrimStrTwo } from "src/app/trim-str2.pipe";
import { WeekPipe } from "./week.pipe";
import { TabNamePipe } from "src/app/tabName.pipe";
import { TimeDisplay } from "./timeDisplay.pipe";

@NgModule({
  declarations: [UniquePipe, TrimStrTwo, WeekPipe, TimeDisplay, TabNamePipe],
  imports: [CommonModule],
  exports: [UniquePipe, TimeDisplay, TrimStrTwo, TabNamePipe],
})
export class PipesModule {}
