
import { ConfigSc } from "../moments/project-moments-schedule-planer/project-schedule-planer-canvas/resource-project-schedule-planer/Config";
import { AEntity } from "./AEntity";
import { Canvas } from "./Canvas";

export class BezierCurveBridge extends AEntity {
  private x2: number;
  private y2: number;

  private lineThickness = 0.7;
  private color = "black";
  private fillColor = "black";

  constructor(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    canvas: Canvas,
    parent = null
  ) {
    super(canvas, parent);

    this.setX(x1);
    this.setY(y1);
    this.x2 = x2;
    this.y2 = y2;
  }

  override getGlobalX(): number {
    return this.getX() + this.parent.getGlobalX();
  }
  override getGlobalY(): number {
    return this.getY() + this.parent.getGlobalY();
  }
  getGlobalX2(): number {
    return this.x2 + this.parent.getGlobalX();
  }
  getGlobalY2(): number {
    return this.y2 + this.parent.getGlobalY();
  }

  setBackgroundColor(color: string) {
    this.fillColor = color;
  }

  setBorderColor(color: string) {
    this.color = color;
  }

  drawCurve(context: CanvasRenderingContext2D) {
    context.strokeStyle = this.color;
    context.fillStyle = this.fillColor;
    context.lineWidth = this.lineThickness;

    context.beginPath();
    context.moveTo(this.getGlobalX(), this.getGlobalY());
    context.lineTo(this.getGlobalX(), this.getGlobalY() - 15);
    context.lineTo(this.getGlobalX2(), this.getGlobalY() - 15);
    context.lineTo(this.getGlobalX2(), this.getGlobalY2());
    context.lineTo(this.getGlobalX2() + 2, this.getGlobalY2() - (ConfigSc.cellHeight / 3));
    context.bezierCurveTo(
      this.getGlobalX2(),
      this.getGlobalY() - 15,
      this.getGlobalX(),
      this.getGlobalY() - 15,
      this.getGlobalX() - 2,
      this.getGlobalY() - (ConfigSc.cellHeight / 3)
    );
    context.lineTo(this.getGlobalX(), this.getGlobalY());
    context.fill();
    context.stroke();
  }

  isShapeClicked(x: number, y: number): boolean {
    return false;
  }

  draw() {
    this.canvas.getContext().save();
    this.drawCurve(this.canvas.getContext());
    this.canvas.getContext().restore();
  }
}
