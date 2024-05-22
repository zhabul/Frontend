import { AShape } from "./AShape";
import { Canvas } from "./Canvas";
import { Rectangle } from "./Rectangle";

export abstract class AContainer extends Rectangle {
  protected children = [];

  constructor(
    x: number,
    y: number,
    width: string | number,
    height: string | number,
    canvas: Canvas,
    parent = null
  ) {
    super(x, y, width, height, canvas, parent);
  }

  getChildren() {
    return this.children;
  }
  addChild(child: AShape) {
    this.children.push(child);
  }

  removeAllChildren() {
    this.children.length = 0;
  }
  removeFirstChild() {
    return this.children.shift();
  }
  removeLastChild() {
    return this.children.pop();
  }
  removeChildById(id: number) {
    const index = this.children.findIndex((child) => child.getId() === id);
    if (index < 0) return;
    this.children.splice(index, 1);
  }

  getFirstChild() {
    return this.children[0];
  }
  getLastChild() {
    return this.children[this.children.length - 1];
  }

  moveLastChildToFirst() {
    this.children.unshift(this.children.pop());
  }

  override draw() {
    if (!this.isVisible || (this._renderOnce && this._isRendered)) return;
    super.draw();
    this.children.forEach((child) => child.draw());
    this._isRendered = true;
  }
}
