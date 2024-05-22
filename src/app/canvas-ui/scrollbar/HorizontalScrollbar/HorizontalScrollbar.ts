import { Canvas } from "../../Canvas";
import { Config } from "../../../moments/project-moments/resource-planning-app/Config";
import { AScrollbar } from "../AScrollbar";
import { HorizontalScrollbarSlider } from "./HorizontalScrollbarSlider";
import { CmpRef } from "src/app/moments/project-moments/resource-planning-app/CmpRef";

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
      this.slider.move(
        e.layerX - this.slider.getX() - this.getGlobalX() - Config.scrollbarSize
      );
      this.parent.draw();
      CmpRef.cmp.planningApp.resourcePlanningHeadingsContainer.draw();
      CmpRef.cmp.planningApp.showHideResourcePlanning.draw();
    });
    this.createSlider();
  }

  createSlider() {
    this.slider = new HorizontalScrollbarSlider(
      0,
      0,
      this.getWidth(),
      Config.scrollbarSize,
      this.canvas,
      this
    );
  }
}
