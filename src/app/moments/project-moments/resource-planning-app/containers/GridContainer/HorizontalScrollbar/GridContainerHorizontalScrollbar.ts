import { Canvas } from "src/app/canvas-ui/Canvas";
import { Config } from "src/app/moments/project-moments/resource-planning-app/Config";
import { HorizontalScrollbar } from "src/app/canvas-ui/scrollbar/HorizontalScrollbar/HorizontalScrollbar";
import { GridContainerHorizontalScrollbarSlider } from "./GridContainerHorizontalScrollbarSlider";
import { Rectangle } from "src/app/canvas-ui/Rectangle";

export class GridContainerHorizontalScrollbar extends HorizontalScrollbar {
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
      (this.slider as GridContainerHorizontalScrollbarSlider).moveXWithClick(
        e.layerX - this.slider.getX() - this.getGlobalX()
      );
    });
  }

  override createSlider() {
    this.slider = new GridContainerHorizontalScrollbarSlider(
      0,
      0,
      this.getWidth(),
      Config.scrollbarSize,
      this.canvas,
      this
    );
  }

  doInitialScroll(currentWeekX: number) {
    (this.slider as GridContainerHorizontalScrollbarSlider).moveXWithClick(
      (currentWeekX - 7 * Config.cellWidth) / this.slider.getMultiplier()
    );
  }

  createArrows() {
    const arrowUp = new Rectangle(
      0,
      0,
      Config.scrollbarSize,
      this.getHeight(),
      this.canvas,
      this
    );
    arrowUp.addBackgroundImagePattern(
      "scroll-arrow-up",
      "scroll-arrow-up",
      Config.scrollbarSize,
      Config.scrollbarSize
    );
    arrowUp.setOnMouseHoverHandler(
      () => (document.body.style.cursor = "pointer")
    );

    const arrowDown = new Rectangle(
      this.getX() - Config.scrollbarSize,
      this.getY() - Config.scrollbarSize,
      this.getWidth(),
      Config.scrollbarSize,
      this.canvas,
      this
    );
    arrowDown.addBackgroundImagePattern(
      "scroll-arrow-down",
      "scroll-arrow-down",
      Config.scrollbarSize,
      Config.scrollbarSize
    );
    arrowDown.setOnMouseHoverHandler(
      () => (document.body.style.cursor = "pointer")
    );
  }
}
