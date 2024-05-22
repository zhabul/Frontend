export interface IOffscreenCanvas {
  setCanvasSize(width: number, height: number): void;
  setCanvasMaxSize(width: number, height: number): void;
  render(
    x: number,
    y: number,
    width: number,
    height: number,
    xOffset: number,
    yOffset: number
  ): void;
  reRender(): void;
  getCanvas(): HTMLCanvasElement;
  drawImage(
    context: CanvasRenderingContext2D,
    sx: number,
    sy: number,
    sWidth: number,
    sHeight: number,
    dx: number,
    dy: number,
    dWidth: number,
    dHeight: number
  ): void;
  addBackgroundImagePattern(
    name: string,
    imageId: string,
    width: number,
    height: number,
    repetition?: string,
    offsetX?: number,
    offsetY?: number,
    order?: number
  ): void;
  removeBackgroundImagePattern(name: string): void;
  destruct(): void;
}
