import { Canvas } from "src/app/canvas-ui/Canvas";
import { Config } from "src/app/moments/project-moments/resource-planning-app/Config";
import { VerticalScrollbar } from "src/app/canvas-ui/scrollbar/VerticalScrollbar/VerticalScrollbar";
import { GridContainerVerticalScrollbarSlider } from "./GridContainerVerticalScrollbarSlider";

export class GridContainerVerticalScrollbar extends VerticalScrollbar {
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
      (this.slider as GridContainerVerticalScrollbarSlider).moveYWithClick(
        e.layerY - this.slider.getY() - this.getGlobalY()
      );
    });
  }

  override createSlider() {
    this.slider = new GridContainerVerticalScrollbarSlider(
      0,
      0,
      Config.scrollbarSize,
      this.getHeight(),
      this.canvas,
      this
    );
  }
}
