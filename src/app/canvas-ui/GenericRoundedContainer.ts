import { ARoundedContainer } from "./ARoundedContainer";
import { Canvas } from "./Canvas";

export class GenericRoundedContainer extends ARoundedContainer {
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
