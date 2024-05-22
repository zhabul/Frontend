import { AScrollableContainer } from "src/app/canvas-ui/AScrollableContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";

export class MainSectionContainer extends AScrollableContainer {
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
