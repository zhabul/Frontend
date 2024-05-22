import { Canvas } from "src/app/canvas-ui/Canvas";

export class ResourceCanvas extends Canvas {
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    canvasElementId: string
  ) {
    super(x, y, width, height, canvasElementId);
    this.setInstanceClass(ResourceCanvas);
  }

  startSelection(x: number, y: number) {
    return;
  }
  onSelectionEnd(x: number, y: number, width: number, height: number) {
    return;
  }
}
