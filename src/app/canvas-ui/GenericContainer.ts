import { AContainer } from "./AContainer";
import { Canvas } from "./Canvas";

export class GenericContainer extends AContainer {
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
