import { Canvas } from "src/app/canvas-ui/Canvas";
import { Rectangle } from "src/app/canvas-ui/Rectangle";
import { HorizontalScrollbar } from "src/app/canvas-ui/scrollbarSchedule/HorizontalScrollbar/HorizontalScrollbar";

import { ConfigSc } from "../../../Config";
import { CpspRef } from "../../../CpspRef";
import { GridHorizontalScrollbarSlider } from "./GridHorizontalScrollbarSlider";

export class GridHorizontalScrollbar extends HorizontalScrollbar {
  constructor(
    x: number,
    y: number,
    width: string | number,
    height: string | number,
    canvas: Canvas,
    parent
  ) {
    super(x, y, width, height, canvas, parent);

    this.setOnClickHandler((e) => {
      (this.slider as GridHorizontalScrollbarSlider).moveXWithClick(e.layerX - this.slider.getX() - this.getGlobalX());
      //CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningHeadingsContainer.draw();
      CpspRef.cmp.projectSchedulePlanerApp.showHideResourcePlanning.draw();
    });
  }

  override createSlider() {
    this.slider = new GridHorizontalScrollbarSlider(
      0,
      0,
      this.getWidth() * CpspRef.cmp.pixelRation,
      ConfigSc.scrollbarSize,
      this.canvas,
      this
    );
  }

  doInitialScroll(currentWeekX: number) {
    (this.slider as GridHorizontalScrollbarSlider).moveXWithClick((currentWeekX - 7 * ConfigSc.cellWidth) / this.slider.getMultiplier());
  }

  createArrows() {
    const arrowUp = new Rectangle(
      0,
      0,
      ConfigSc.scrollbarSize,
      this.getHeight(),
      this.canvas,
      this
    );
    arrowUp.addBackgroundImagePattern(
      "scroll-arrow-up",
      "scroll-arrow-up",
      ConfigSc.scrollbarSize,
      ConfigSc.scrollbarSize
    );

    arrowUp.setOnMouseHoverHandler(() => document.body.style.cursor = "pointer");

    const arrowDown = new Rectangle(
      this.getX() - ConfigSc.scrollbarSize,
      this.getY() - ConfigSc.scrollbarSize,
      this.getWidth(),
      ConfigSc.scrollbarSize,
      this.canvas,
      this
    );
    arrowDown.addBackgroundImagePattern(
      "scroll-arrow-down",
      "scroll-arrow-down",
      ConfigSc.scrollbarSize,
      ConfigSc.scrollbarSize
    );

    arrowDown.setOnMouseHoverHandler(() => document.body.style.cursor = "pointer");
  }
}
