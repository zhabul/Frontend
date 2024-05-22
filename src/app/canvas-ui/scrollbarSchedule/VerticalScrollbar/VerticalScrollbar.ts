
import { Canvas } from "../../Canvas";
import { VerticalScrollbarSlider } from "./VerticalScrollbarSlider";
import { AScrollbar } from "../AScrollbar";
import { ConfigSc } from "src/app/moments/project-moments-schedule-planer/project-schedule-planer-canvas/resource-project-schedule-planer/Config";


export class VerticalScrollbar extends AScrollbar {
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
      this.slider.move(e.layerY - this.slider.getY() - this.getGlobalY());
      this.parent.draw();
    });
    this.createSlider();
  }

  createSlider() {
    this.slider = new VerticalScrollbarSlider(
      (ConfigSc.scrollbarSize * 0.8) / 2,
      ConfigSc.scrollbarSize,
      ConfigSc.scrollbarSize * 0.2,
      this.getHeight(),
      this.canvas,
      this
    );
  }
}
