import { AEntity } from "./AEntity";
import { Canvas } from "./Canvas";

export class TextRenderer extends AEntity {
  private textContent: string;
  private color = "black";
  private fontFamily = "Calibri";
  private fontSize = 13;
  private fontWeight = "normal";
  private fontStyle = "normal";
  private fontDecoration = "normal";
  private offsetX = 0;
  private angle = 0;

  constructor(textContent: string, canvas: Canvas, parent) {
    super(canvas, parent);

    this.textContent = textContent;
  }

  getTextContent() {
    return this.textContent;
  }
  setTextContent(textContent: string) {
    this.textContent = textContent;
  }

  setColor(color: string) {
    this.color = color;
  }

  setFontSize(fontSize: number) {
    this.fontSize = fontSize;
  }

  setFontWeight(fontWeight: string) {
    this.fontWeight = fontWeight;
  }

  setFontStyle(fontStyle: string) {
    this.fontStyle = fontStyle;
  }

  setFontDecoration(fontDecoration: string) {
    this.fontDecoration = fontDecoration;
  }

  setFontFamily(fontFamily: string) {
    this.fontFamily = fontFamily;
  }

  setOffsetX(offsetX: number) {
    this.offsetX = offsetX;
  }

  moveX(x: number) {
    this.setX(this.getX() + x);
  }

  private measureText() {
    this.canvas.getContext().font = `${this.fontStyle} ${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
    return this.canvas.getContext().measureText(this.textContent);
  }

  private getTextWidth(metrics: TextMetrics) {
    return metrics.width;
  }

  private getTextHeight(metrics: TextMetrics) {
    // Google Chrome and Firefox have different implementations
    return metrics.fontBoundingBoxAscent || metrics.actualBoundingBoxAscent;
  }

  updateTextDimensions() {
    const metrics = this.measureText();
    this.setWidth(this.getTextWidth(metrics));
    this.setHeight(this.getTextHeight(metrics));
  }

  setAlignment(
    horizontalAlignment: string = "left",
    verticalAlignment: string = "top"
  ) {
    const metrics = this.measureText();

    switch (horizontalAlignment) {
      case "left":
        this.setX(0 + this.offsetX);
        break;
      case "center":
        this.setX(this.parent.getWidth() / 2 - this.getTextWidth(metrics) / 2);
        break;
      case "right":
        this.setX(
          this.parent.getWidth() - this.getTextWidth(metrics) - this.offsetX
        );
        break;
      default:
        this.setX(0);
    }

    switch (verticalAlignment) {
      case "top":
        this.setY(0);
        break;
      case "center":
        this.setY(
          this.parent.getHeight() / 2 - this.getTextHeight(metrics) / 2
        );
        break;
      case "bottom":
        this.setY(this.parent.getHeight() - this.getTextHeight(metrics));
        break;
      default:
        this.setY(0);
    }
  }

  setAngleOfRotation(angleOfRotation: number) {
    this.angle = angleOfRotation;
  }

  isShapeClicked(x: number, y: number): boolean {
    return (
      x > this.getGlobalX() &&
      y > this.getGlobalY() &&
      x < this.getGlobalX() + this.getWidth() &&
      y < this.getGlobalY() + this.getHeight()
    );
  }

  private drawText(context: CanvasRenderingContext2D) {
    context.font = `${this.fontStyle} ${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
    context.translate(
      this.getGlobalX() + this.parent.getWidth() / 2,
      this.getGlobalY() + this.parent.getWidth() / 2
    );
    context.rotate((this.angle * Math.PI) / 180);
    context.translate(
      -this.getGlobalX() - this.parent.getWidth() / 2,
      -this.getGlobalY() - this.parent.getWidth() / 2
    );
    context.textBaseline = "hanging";
    context.fillStyle = this.color;
    context.fillText(this.textContent, this.getGlobalX(), this.getGlobalY());
    if (this.fontDecoration == "underline") {
      let { width } = context.measureText(this.textContent);
      context.fillRect(
        this.getGlobalX(),
        this.getGlobalY() + this.fontSize,
        width,
        2
      );
    } else if (this.fontDecoration == "crossed") {
      let { width } = context.measureText(this.textContent);
      context.fillRect(
        this.getGlobalX(),
        this.getGlobalY() + (this.fontSize/3),
        width,
        2
      );
    }
  }

  draw() {
    this.canvas.getContext().save();
    this.drawText(this.canvas.getContext());
    this.canvas.getContext().restore();
  }
}
