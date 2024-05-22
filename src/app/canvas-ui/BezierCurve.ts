import { Config } from "../moments/project-moments/resource-planning-app/Config";
import { AEntity } from "./AEntity";
import { Canvas } from "./Canvas";

export class BezierCurve extends AEntity {
  private x2: number;
  private y2: number;

  private cp1x: number;
  private cp1y: number;

  private lineThickness = 1;
  private color = "black";
  private fillColor = "red";

  private isScheduleCurve = false;

  constructor(
    x1: number,
    y1: number,
    cp1x: number,
    cp1y: number,
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
    this.cp1x = cp1x;
    this.cp1y = cp1y;
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

  getGlobalCPX1(): number {
    return this.cp1x + this.parent.getGlobalX();
  }
  getGlobalCPY1(): number {
    return this.cp1y + this.parent.getGlobalY();
  }

  drawCurve(context: CanvasRenderingContext2D) {
    context.strokeStyle = this.color;
    context.fillStyle = this.color;
    context.lineWidth = this.lineThickness;

    context.beginPath();
    context.moveTo(this.getGlobalX() - Config.cellWidth / 2, this.getGlobalY());
    context.quadraticCurveTo(
      this.getGlobalCPX1(),
      this.getGlobalCPY1(),
      this.getGlobalX2() + Config.cellWidth / 2,
      this.getGlobalY2()
    );
    context.stroke();
  }

  drawStartCircle(context: CanvasRenderingContext2D) {
    let radians = Math.PI / 180;
    context.strokeStyle = this.color;
    context.fillStyle = "#32FF00";

    context.beginPath();
    context.arc(
      this.getGlobalX2() + Config.cellWidth / 2,
      this.getGlobalY2(),
      5,
      0 * radians,
      360 * radians
    );
    context.stroke();
    context.fill();
  }

  drawEndCircle(context: CanvasRenderingContext2D) {
    let radians = Math.PI / 180;
    context.strokeStyle = this.color;
    context.fillStyle = this.fillColor;

    context.beginPath();
    context.arc(
      this.getGlobalX() - Config.cellWidth / 2,
      this.getGlobalY(),
      5,
      0 * radians,
      360 * radians
    );
    context.stroke();
    context.fill();
  }

  drawEndArrow(context: CanvasRenderingContext2D) {
    context.strokeStyle = this.color;
    let widthMin = 4 * Config.cellWidth;

    let startX = this.getGlobalX2() + Config.cellWidth / 2;

    let startY =
      this.getGlobalY2() > this.getGlobalY()
        ? this.getGlobalY2() - 4
        : this.getGlobalY2() + 4;

    let endX = this.getGlobalX2() + Config.cellWidth / 2;
    endX += this.getGlobalX2() < this.getGlobalX() ? 3 : -3;
    endX =
      this.getGlobalX2() > this.getGlobalX() &&
      this.getGlobalX2() - this.getGlobalX() < widthMin
        ? this.getGlobalX2() + 3
        : endX;
    endX =
      this.getGlobalX2() < this.getGlobalX() &&
      this.getGlobalX() - this.getGlobalX2() < widthMin
        ? this.getGlobalX2() - 3
        : endX;

    let endY =
      this.getGlobalY2() > this.getGlobalY()
        ? this.getGlobalY2() - 3
        : this.getGlobalY2() + 3;

    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(
      this.getGlobalX2() + Config.cellWidth / 2,
      this.getGlobalY2()
    );
    context.lineTo(endX, endY);
    context.stroke();
  }

  isShapeClicked(x: number, y: number): boolean {
    return false;
  }

  setColor(newColor: string) {
    this.color = newColor;
  }

  setFillColor(newColor: string) {
    this.fillColor = newColor;
  }

  setIsScheduleCurve() {
    this.isScheduleCurve = true;
  }

  setLineThickness(thickness: number) {
    this.lineThickness = thickness;
  }

  drawScheduleStartCircle(context: CanvasRenderingContext2D) {
    let radians = Math.PI / 180;
    context.strokeStyle = this.color;
    context.fillStyle = this.fillColor;
    context.lineWidth = this.lineThickness;

    context.beginPath();
    context.arc(
      this.getGlobalX(),
      this.getGlobalY(),
      2,
      0 * radians,
      360 * radians
    );
    context.stroke();
    context.fill();
  }

  drawScheduleCurve(context: CanvasRenderingContext2D) {
    context.strokeStyle = this.color;
    context.fillStyle = this.color;
    context.lineWidth = this.lineThickness;

    context.beginPath();
    context.moveTo(this.getGlobalX(), this.getGlobalY());
    context.quadraticCurveTo(
      this.getGlobalCPX1(),
      this.getGlobalCPY1(),
      this.getGlobalX2() + Config.cellWidth / 2,
      this.getGlobalY2()
    );
    context.stroke();
  }

  drawScheduleEndArrow(context: CanvasRenderingContext2D) {
    context.strokeStyle = this.color;
    context.lineWidth = this.lineThickness;
    var p0 = {
      x: this.getGlobalX(),
      y: this.getGlobalY()
    }
    var p2 = {
      x: this.getGlobalX2(),
      y: this.getGlobalY2()
    }
    var p1 = {
      x: this.getGlobalCPX1(),
      y: this.getGlobalCPY1()
    }
    //let widthMin = 4 * Config.cellWidth;
    this.bezWithArrowheads(context,p0, p1, p2, undefined, 5, false, true);

    

    // let startX = this.getGlobalX2() + Config.cellWidth;

    // let startY =
    //   this.getGlobalY2() > this.getGlobalY()
    //     ? this.getGlobalY2() - Config.cellHeight / 4
    //     : this.getGlobalY2() + Config.cellHeight / 4;

    // let endX = this.getGlobalX2() + Config.cellWidth / 2;
    // endX += this.getGlobalX2() < this.getGlobalX() ? 5 : -5;
    // endX =
    //   this.getGlobalX2() > this.getGlobalX() &&
    //   this.getGlobalX2() - this.getGlobalX() < widthMin
    //     ? this.getGlobalX2() + 5
    //     : endX;
    // endX =
    //   this.getGlobalX2() < this.getGlobalX() &&
    //   this.getGlobalX() - this.getGlobalX2() < widthMin
    //     ? this.getGlobalX2() - 5
    //     : endX;

    // let endY =
    //   this.getGlobalY2() > this.getGlobalY()
    //     ? this.getGlobalY2() - Config.cellHeight / 4
    //     : this.getGlobalY2() + Config.cellHeight / 4;

    // context.beginPath();
    // context.moveTo(startX, startY);
    // context.lineTo(
    //   this.getGlobalX2() + Config.cellWidth / 2,
    //   this.getGlobalY2()
    // );
    // context.lineTo(endX, endY);
    // context.stroke();
  }

  // draws both cubic and quadratic bezier
 bezWithArrowheads(ctx,p0, p1, p2, p3, arrowLength, hasStartArrow, hasEndArrow) {
  var x, y, norm, ex, ey;
  function pointsToNormalisedVec(p,pp){
      var len;
      norm.y = pp.x - p.x;
      norm.x = -(pp.y - p.y);
      len = Math.sqrt(norm.x * norm.x + norm.y * norm.y);
      norm.x /= len;
      norm.y /= len;
      return norm;
  }
      
  var arrowWidth = arrowLength / 2;
  norm = {};
  // defaults to true for both arrows if arguments not included
  hasStartArrow = hasStartArrow === undefined || hasStartArrow === null ? true : hasStartArrow;
  hasEndArrow = hasEndArrow === undefined || hasEndArrow === null ? true : hasEndArrow;
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  if (p3 === undefined) {
      ctx.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
      ex = p2.x;  // get end point
      ey = p2.y;
      norm = pointsToNormalisedVec(p1,p2);
  } else {
      ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y)
      ex = p3.x; // get end point
      ey = p3.y;
      norm = pointsToNormalisedVec(p2,p3);
  }
  if (hasEndArrow) {
      x = arrowWidth * norm.x + arrowLength * -norm.y;
      y = arrowWidth * norm.y + arrowLength * norm.x;
      ctx.moveTo(ex + x, ey + y);
      ctx.lineTo(ex, ey);
      x = arrowWidth * -norm.x + arrowLength * -norm.y;
      y = arrowWidth * -norm.y + arrowLength * norm.x;
      ctx.lineTo(ex + x, ey + y);
  }
  if (hasStartArrow) {
      norm = pointsToNormalisedVec(p0,p1);
      x = arrowWidth * norm.x - arrowLength * -norm.y;
      y = arrowWidth * norm.y - arrowLength * norm.x;
      ctx.moveTo(p0.x + x, p0.y + y);
      ctx.lineTo(p0.x, p0.y);
      x = arrowWidth * -norm.x - arrowLength * -norm.y;
      y = arrowWidth * -norm.y - arrowLength * norm.x;
      ctx.lineTo(p0.x + x, p0.y + y);
  }

  ctx.stroke();
}


  draw() {
    this.canvas.getContext().save();
    if (!this.isScheduleCurve) {
      this.drawStartCircle(this.canvas.getContext());
      this.drawCurve(this.canvas.getContext());
      this.drawEndCircle(this.canvas.getContext());
      this.drawEndArrow(this.canvas.getContext());
    }
    if (this.isScheduleCurve) {
      this.drawScheduleStartCircle(this.canvas.getContext());
      //this.drawScheduleCurve(this.canvas.getContext());
      this.drawScheduleEndArrow(this.canvas.getContext());
    }
    this.canvas.getContext().restore();
  }
}
