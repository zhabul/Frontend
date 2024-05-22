import { AShape } from "./AShape";
import { Canvas } from "./Canvas";
import { RoundedRectangle } from "./RoundedRectangle";

export abstract class ARoundedContainer extends RoundedRectangle {
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
    if (!this.isVisible) return;
    super.draw();
    this.children.forEach((child) => child.draw());
  }
}
