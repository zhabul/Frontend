import { AScrollbarSlider } from "./AScrollbarSlider";
import { AShape } from "../AShape";
import { Canvas } from "../Canvas";
import { AContainer } from "../AContainer";
import { Rectangle } from "../Rectangle";

export abstract class AScrollbar extends Rectangle {
  private children = [];

  protected slider: AScrollbarSlider;

  constructor(
    x: number,
    y: number,
    width: string | number,
    height: string | number,
    canvas: Canvas,
    parent: AContainer
  ) {
    super(x, y, width, height, canvas, parent);
  }

  getChildren() {
    return this.children;
  }
  addChild(child: AShape) {
    this.children.push(child);
  }

  getSlider() {
    return this.slider;
  }

  override draw() {
    super.draw();
    this.slider.draw();
  }

  abstract createSlider(): void;
}
