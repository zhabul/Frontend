import { AContainer } from "src/app/canvas-ui/AContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { IMovable } from "src/app/canvas-ui/interfaces/IMovable";
import { Line } from "src/app/canvas-ui/Line";
import { CmpRef } from "../../CmpRef";
import { Config } from "../../Config";

export class MovingLineIndicator extends AContainer implements IMovable {
  private sumY = 0;

  constructor(
    x: number,
    y: number,
    width: string | number,
    height: string | number,
    canvas: Canvas,
    parent
  ) {
    super(x, y, width, height, canvas, parent);
    this.drawLines();
  }

  drawLines() {
    const verticalLine = new Line(
      -Config.cellWidth,
      Config.cellHeight * 0.5,
      -Config.cellWidth,
      Config.cellHeight * 1.5,
      this.canvas,
      this
    );
    verticalLine.setLineThickness(3);
    verticalLine.setColor("red");

    const horiznotalLine = new Line(
      -21,
      Config.cellHeight,
      CmpRef.cmp.planningApp.mainCanvas.getWidth()-Config.scrollbarSize*2,
      Config.cellHeight,
      this.canvas,
      this
    );
    horiznotalLine.setLineThickness(3);
    horiznotalLine.setColor("red");
  }

  move(y: number) {
    this.sumY += y;

    if (this.sumY >= Config.cellHeight) {
      const newY =
        this.getY() +
        Math.round(this.sumY / Config.cellHeight) * Config.cellHeight;

      this.setY(newY);
      this.sumY = 0;
    } else if (this.sumY <= Config.cellHeight * -1) {
      const newY =
        this.getY() +
        Math.round(this.sumY / Config.cellHeight) * Config.cellHeight;
      if (newY < -Config.cellHeight) {
        if (Config.boxHeight > 0) {
          this.setY(newY);
          this.sumY = 0;
        }
      }

      this.setY(newY);
      this.sumY = 0;
    }
  }
}
