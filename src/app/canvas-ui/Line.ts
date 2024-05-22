import { Config } from "../moments/project-moments/resource-planning-app/Config";
import { AEntity } from "./AEntity";
import { Canvas } from "./Canvas";

export class Line extends AEntity {
  private x2: number;
  private y2: number;

  private lineThickness = 1;
  private color = "black";
  private fillColor = "red";
  private arrowOnStart = false;
  private arrowOnEnd = false;
  private circleOnEnd = false;
  private moveValue = - Config.cellWidth / 2;
  private lineDash: number[] = [];

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

  setColor(color: string) {
    this.color = color;
  }

  setFillColor(fillColor: string) {
    this.fillColor = fillColor;
  }

  setArrowOnStart() {
    this.arrowOnStart = true;
  }

  setArrowOnEnd() {
    this.arrowOnEnd = true;
  }

  setCircleOnEnd() {
    this.circleOnEnd = true;
  }

  setMoveValue(value: number) {
    this.moveValue = value;
  }

  setLineDash(pattern: any) {
    this.lineDash = pattern;
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

  setLineThickness(thickness: number) {
    this.lineThickness = thickness;
  }

  drawStartArrowHead(context: CanvasRenderingContext2D) {
    context.strokeStyle = "black";
    context.lineWidth = 2;
    context.fillStyle = this.fillColor;
    let radians = Math.atan((this.y2 - this.getY()) / (this.x2 - this.getX()));
    radians += ((this.x2 > this.getX() ? -90 : 90) * Math.PI) / 180;
    this.drawCircleHead(this.getGlobalX(), this.getGlobalY(), radians, context);
  }

  drawEndArrowHead(context: CanvasRenderingContext2D) {
    context.strokeStyle = "black";
    context.lineWidth = 2;
    context.fillStyle = this.fillColor;
    let radians = Math.atan((this.y2 - this.getY()) / (this.x2 - this.getX()));
    radians += ((this.x2 > this.getX() ? 90 : -90) * Math.PI) / 180;
    this.drawArrowHead(
      this.getGlobalX2(),
      this.getGlobalY2(),
      radians,
      context
    );
  }

  drawEndCircle(context: CanvasRenderingContext2D) {
    context.strokeStyle = "black";
    context.lineWidth = 2;
    context.fillStyle = this.fillColor;
    let radians = Math.atan((this.y2 - this.getY()) / (this.x2 - this.getX()));
    radians += ((this.x2 > this.getX() ? 90 : -90) * Math.PI) / 180;
    this.drawCircleHead(
      this.getGlobalX2() + this.moveValue,
      this.getGlobalY2(),
      radians,
      context
    );
  }

  drawArrowHead(
    x: number,
    y: number,
    radians: number,
    context: CanvasRenderingContext2D
  ) {
    context.beginPath();
    context.translate(x, y);
    context.rotate(radians);
    context.moveTo(0, 0);
    context.lineTo(4, 6);
    context.lineTo(-4, 6);
    context.closePath();
    context.fill();
  }

  drawCircleHead(
    x: number,
    y: number,
    radians: number,
    context: CanvasRenderingContext2D
  ) {
    context.beginPath();
    context.arc(x, y, 5, 0 * radians, 360 * radians, false);
    context.stroke();
    context.fill();
  }

  isShapeClicked(x: number, y: number): boolean {
    return (
      Math.sqrt(Math.pow(this.getX() - x, 2) + Math.pow(this.getY() - y, 2)) +
        Math.sqrt(Math.pow(this.x2 - x, 2) + Math.pow(this.y2 - y, 2)) ===
      Math.sqrt(
        Math.pow(this.getX() - this.x2, 2) + Math.pow(this.getY() - this.y2, 2)
      )
    );
  }

  drawLine(context: CanvasRenderingContext2D) {
    context.strokeStyle = this.color;
    context.fillStyle = this.color;
    context.lineWidth = this.lineThickness;

    context.beginPath();
    context.setLineDash(this.lineDash);
    context.moveTo(this.getGlobalX(), this.getGlobalY());
    context.lineTo(this.getGlobalX2() + this.moveValue, this.getGlobalY2());
    context.stroke();

    if (this.arrowOnStart) this.drawStartArrowHead(context);
    if (this.arrowOnEnd) this.drawEndArrowHead(context);
    if (this.circleOnEnd) this.drawEndCircle(context);
  }

  draw() {
    this.canvas.getContext().save();
    this.drawLine(this.canvas.getContext());
    this.canvas.getContext().restore();
  }
}
