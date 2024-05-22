import { Canvas } from "./Canvas";
import { BackgroundImagePattern } from "./models/BackgroundImagePattern";
import { AEntity } from "./AEntity";

export abstract class AShape extends AEntity {
  protected backgroundImagePatterns: BackgroundImagePattern[] = [];

  protected backgroundColor = "rgba(0, 0, 0, 0)";

  protected borderColor: string = "";
  protected borderSize = 0;
  public isVisible = true;

  constructor(
    x: number,
    y: number,
    width: string | number,
    height: string | number,
    canvas: Canvas,
    parent = null
  ) {
    super(canvas, parent);
    this.setX(x);
    this.setY(y);
    this.setWidth(width);
    this.setHeight(height);
  }

  setBackgroundColor(color: string) {
    this.backgroundColor = color;
  }

  removeBackgroundImagePattern(name: string) {
    const index = this.backgroundImagePatterns.findIndex(
      (b) => b.name === name
    );
    if (index < 0) return;
    this.backgroundImagePatterns.splice(index, 1);
  }
  async addBackgroundImagePattern(
    name: string,
    imageId: string,
    width: number,
    height: number,
    repetition: string = "no-repeat",
    offsetX: number = 0,
    offsetY: number = 0,
    order: number = 0
  ) {
    const backgroundImage = document.getElementById(
      imageId
    ) as HTMLImageElement;

    this.backgroundImagePatterns.push({
      image: backgroundImage,
      width,
      height,
      name,
      pattern: this.canvas
        .getContext()
        .createPattern(backgroundImage, repetition),
      offsetX,
      offsetY,
      order,
    });

    this.backgroundImagePatterns = this.backgroundImagePatterns.sort(
      (a: BackgroundImagePattern, b: BackgroundImagePattern) =>
        a.order - b.order
    );
  }

  isShapeClicked(x: number, y: number) {
    return (
      x > this.getGlobalX() &&
      y > this.getGlobalY() &&
      x < this.getGlobalX() + this.getWidth() &&
      y < this.getGlobalY() + this.getHeight()
    );
  }

  updateBackgroundImageOffsetX(name: string, newOffset: number) {
    const index = this.backgroundImagePatterns.findIndex(
      (p) => p.name === name
    );
    this.backgroundImagePatterns[index].offsetX = newOffset;
  }

  setBorder(color: string, size: number) {
    this.borderColor = color;
    this.borderSize = size;
  }
  getBorderColor() {
    return this.borderColor;
  }

  setVisibility() {
    this.isVisible = !this.isVisible;
  }
}
