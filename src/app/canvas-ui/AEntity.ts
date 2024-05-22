import { Canvas } from "./Canvas";

export abstract class AEntity {
  static idIndex = 1;
  protected id: number;
  private x = 0;
  private y = 0;
  private xAlignment = "left";
  private yAlignment = "top";
  private width = "0px";
  private widthOffset = 0;
  private height = "0px";
  private heightOffset = 0;
  private innerShadow = false;
  private dropShadow = false;

  private shadowBlur = 0;
  private shadowOffsetX = 0;
  private shadowOffsetY = 0;
  protected shadowColor = "rgba(0, 0, 0, 0)";
  private alpha = 1;

  protected canvas: Canvas;
  protected parent;

  public _renderOnce = false;
  public _isRendered = false;

  protected isMouseWheelable = false;

  protected onMouseDownHandler: Function = (e) => {
    if (this.parent && this.parent.onMouseDownHandler)
      this.parent.onMouseDownHandler(e);
  };
  protected onMouseRightClickHandler: Function = (e) => {
    if (this.parent && this.parent.onMouseRightClickHandler)
      this.parent.onMouseRightClickHandler(e);
  };
  protected onDoubleClickHandler: Function = (e) => {
    if (this.parent && this.parent.onDoubleClickHandler)
      this.parent.onDoubleClickHandler(e);
  };
  protected onMouseWheelHandler: Function = (e) => {};
  protected onMouseHoverHandler: Function = (e) => {
    document.body.style.cursor = "default";
    if (this.parent && this.parent.onMouseHoverHandler)
      this.parent.onMouseHoverHandler(e);
  };

  constructor(canvas: Canvas, parent = null) {
    this.id = AEntity.idIndex;
    AEntity.idIndex++;

    this.canvas = canvas;
    if (parent !== null) {
      this.parent = parent;
      parent.addChild(this);
    }
  }

  getId() {
    return this.id;
  }

  getGlobalX(): number {
    return this.getX() + this.parent.getGlobalX();
  }
  getGlobalY(): number {
    return this.getY() + this.parent.getGlobalY();
  }

  getX() {
    if (this.xAlignment === "left") {
      return this.x;
    } else if (this.xAlignment === "center") {
      return this.parent.getWidth() / 2 - this.getWidth() / 2 + this.x;
    } else if (this.xAlignment === "right") {
      return this.parent.getWidth() - this.getWidth() + this.x;
    }
  }
  setX(x: number) {
    this.x = x;
  }
  setXAlignment(alignment: "right" | "center") {
    this.xAlignment = alignment;
  }

  getY() {
    if (this.yAlignment === "top") {
      return this.y;
    } else if (this.yAlignment === "center") {
      return this.parent.getHeight() / 2 - this.getHeight() / 2 + this.y;
    } else if (this.yAlignment === "bottom") {
      return this.parent.getHeight() - this.getHeight() + this.y;
    }
  }
  setY(y: number) {
    this.y = y;
  }
  setYAlignment(alignment: "bottom" | "center") {
    this.yAlignment = alignment;
  }

  moveY(move: number) {
    this.y += move;
  }


  getWidth() {
    return this.width.substr(-1) === "%"
      ? this.parent.getWidth() * (parseFloat(this.width) / 100) -
          this.widthOffset
      : parseFloat(this.width);
  }
  setWidth(width: string | number) {
    this.width = typeof width === "number" ? `${width}px` : width;
  }
  setWidthOffset(widthOffset: number) {
    this.widthOffset = widthOffset;
  }

  getHeight() {
    return this.height.substr(-1) === "%"
      ? this.parent.getHeight() * (parseFloat(this.height) / 100) -
          this.heightOffset
      : parseFloat(this.height);
  }
  setHeight(height: string | number) {
    this.height = typeof height === "number" ? `${height}px` : height;
  }
  setHeightOffset(heightOffset: number) {
    this.heightOffset = heightOffset;
  }

  getParent() {
    return this.parent;
  }
  setParent(parent) {
    this.parent = parent;
  }

  getCanvas() {
    return this.canvas;
  }

  setShadowBlur(blur){
    this.shadowBlur = blur;
  }

  getShadowBlur(){
    return this.shadowBlur;
  }

  setShadowOffsetX(offsetX){
    this.shadowOffsetX = offsetX;
  }

  getShadowOffsetX(){
    return this.shadowOffsetX;
  }

  setShadowOffsetY(offsetY){
    this.shadowOffsetY = offsetY;
  }

  getShadowOffsetY(){
    return this.shadowOffsetY;
  }

  setShadowColor(color){
    this.shadowColor = color;
  }

  getShadowColor(){
    return this.shadowColor;
  }

  setInnerShadow(inner){
    this.innerShadow = inner;
  }

  getInnerShadow(){
    return this.innerShadow;
  }

  setDropShadow(drop){
    this.dropShadow = drop;
  }

  getDropShadow(){
    return this.dropShadow;
  }

  setAlpha(alpha){
    this.alpha = alpha;
  }

  getAlpha(){
    return this.alpha;
  }

  getIsMouseWheelable() {
    return this.isMouseWheelable;
  }
  setIsMouseWheelable(isMouseWheelable: boolean) {
    this.isMouseWheelable = isMouseWheelable;
    if (
      this.parent &&
      this.parent.constructor !== this.canvas.getInstanceClass()
    )
      this.parent.setIsMouseWheelable(isMouseWheelable);
  }

  setOnMouseDownHandler(handler: Function) {
    this.onMouseDownHandler = handler;
  }

  setOnClickHandler(handler: Function) {
    
    this.onMouseDownHandler = (e) => {
      this.canvas.getCanvasElement().onmouseup = (e2: any) => {
        if (this.isShapeClicked(e2.layerX, e2.layerY)) {
          this.canvas.getCanvasElement().onmouseup = null;
          handler(e2);
        }
      };
    };
  }

  setOnMouseRightClickHandler(handler: Function) {
    this.onMouseRightClickHandler = handler;
  }

  setOnDoubleClickHandler(handler: Function) {
    this.onDoubleClickHandler = handler;
  }

  setOnMouseHoverHandler(handler: Function) {
    this.onMouseHoverHandler = handler;
  }

  onMouseWheel(e) {
    this.onMouseWheelHandler(e);
  }
  setOnMouseWheelHandler(handler: Function) {
    this.onMouseWheelHandler = handler;
  }

  addRemoveEventsForMouseDownEvent(
    onMouseMoveEndFunction: Function = () => {}
  ) {
    const canvas = this.canvas.getCanvasElement();
    canvas.onmouseup = (e) => {
      onMouseMoveEndFunction(e);
      canvas.onmousemove = null;
      canvas.onmouseleave = null;
      canvas.onmouseup = null;
      canvas.onmouseover = null;
      canvas.onmouseout = null;
    };
    canvas.onmouseleave = (e) => {
      onMouseMoveEndFunction(e);
      canvas.onmousemove = null;
      canvas.onmouseup = null;
      canvas.onmouseleave = null;
      canvas.onmouseover = null;
      canvas.onmouseout = null;
    };
    canvas.onmouseover = (e) => {
      onMouseMoveEndFunction(e);
      canvas.onmousemove = null;
      canvas.onmouseup = null;
      canvas.onmouseleave = null;
      canvas.onmouseover = null;
      canvas.onmouseout = null;
    };
    canvas.onmouseout = (e) => {
      onMouseMoveEndFunction(e);
      canvas.onmousemove = null;
      canvas.onmouseup = null;
      canvas.onmouseleave = null;
      canvas.onmouseover = null;
      canvas.onmouseout = null;
    };
  }

  setRenderOnce(value: boolean) {
    this._renderOnce = value;
  }

  abstract isShapeClicked(x: number, y: number): boolean;
  abstract draw(): void;
}
