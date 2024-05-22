import { AContainer } from "src/app/canvas-ui/AContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";

export class UnassignedUsersContainer extends AContainer {
  constructor(
    x: number,
    y: number,
    width: string | number,
    height: string | number,
    canvas: Canvas,
    parent
  ) {
    super(x, y, width, height, canvas, parent);
  }
}
