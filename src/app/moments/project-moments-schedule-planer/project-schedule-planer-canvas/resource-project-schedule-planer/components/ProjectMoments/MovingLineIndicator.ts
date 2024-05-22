import { AContainer } from "src/app/canvas-ui/AContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { IMovable } from "src/app/canvas-ui/interfaces/IMovable";
import { Line } from "src/app/canvas-ui/Line";

import { ConfigSc } from "../../Config";
import { CpspRef } from "../../CpspRef";

export class MovingLineIndicator extends AContainer implements IMovable {
  private sumY = 0;
  private firstY = 0;
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
    this.firstY = y;
  }

  drawLines() {
    const verticalLine = new Line(
      -ConfigSc.cellWidth,
      ConfigSc.cellHeight * 0.5,
      -ConfigSc.cellWidth,
      ConfigSc.cellHeight * 1.5,
      this.canvas,
      this
    );
    verticalLine.setLineThickness(3);
    verticalLine.setColor("red");

    const horiznotalLine = new Line(
      -21,
      ConfigSc.cellHeight,
      CpspRef.cmp.projectSchedulePlanerApp.mainCanvas.getWidth() -
        ConfigSc.scrollbarSize * 2,
      ConfigSc.cellHeight,
      this.canvas,
      this
    );
    horiznotalLine.setLineThickness(3);
    horiznotalLine.setColor("red");
  }

  move(y: number) {
    this.sumY += y;

    if (this.sumY >= ConfigSc.cellHeight) {
      const newY =
        this.firstY +
        Math.round(this.sumY / ConfigSc.cellHeight) * ConfigSc.cellHeight;
      this.setY(newY);
    } else if (this.sumY <= ConfigSc.cellHeight * -1) {
      const newY =
        this.firstY +
        Math.round(this.sumY / ConfigSc.cellHeight) * ConfigSc.cellHeight;
      if (newY < -ConfigSc.cellHeight) {
        if (ConfigSc.boxHeight > 0) {
          this.setY(newY);
        }
      }
      this.setY(newY);
    }
  }
}
