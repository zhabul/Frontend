import { AContainer } from "src/app/canvas-ui/AContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { IMovable } from "src/app/canvas-ui/interfaces/IMovable";

export class ProjectScheduleContainer extends AContainer implements IMovable {
  constructor(
    x: number,
    y: number,
    width: string | number,
    height: string | number,
    canvas: Canvas,
    parent
  ) {
    super(
      x,
      y,
      width,
      height,
      canvas,
      parent
    );
  }

   move(y: number) { this.setY(this.getY() + y); }
}
