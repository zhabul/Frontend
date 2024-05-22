import { AScrollbar } from "../AScrollbar";
import { Canvas } from "../../Canvas";
import { Config } from "../../../moments/project-moments/resource-planning-app/Config";
import { VerticalScrollbarSlider } from "./VerticalScrollbarSlider";

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
      (Config.scrollbarSize * 0.8) / 2,
      Config.scrollbarSize,
      Config.scrollbarSize * 0.2,
      this.getHeight(),
      this.canvas,
      this
    );
  }
}
