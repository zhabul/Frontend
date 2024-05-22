import { Canvas } from "../../Canvas";
import { AScrollbar } from "../AScrollbar";
import { HorizontalScrollbarSlider } from "./HorizontalScrollbarSlider";
import { ConfigSc } from "src/app/moments/project-moments-schedule-planer/project-schedule-planer-canvas/resource-project-schedule-planer/Config";
import { CpspRef } from "src/app/moments/project-moments-schedule-planer/project-schedule-planer-canvas/resource-project-schedule-planer/CpspRef";

export class HorizontalScrollbar extends AScrollbar {
  constructor(
    x: number,
    y: number,
    width: string | number,
    height: string | number,
    canvas: Canvas,
    parent
  ) {
    super(x, y, width, height, canvas, parent);

    this.setBackgroundColor("#373B40");

    this.setOnClickHandler((e) => {
      this.slider.move(e.layerX - this.slider.getX() - this.getGlobalX() - ConfigSc.scrollbarSize);
      this.parent.draw();
      //CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningHeadingsContainer.draw();
      CpspRef.cmp.projectSchedulePlanerApp.showHideResourcePlanning.draw();
    });
    this.createSlider();
  }

  createSlider() {
    this.slider = new HorizontalScrollbarSlider(
      0,
      0,
      this.getWidth(),
      ConfigSc.scrollbarSize,
      this.canvas,
      this
    );
  }
}
