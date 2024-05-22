import { CpspRef } from "../moments/project-moments-schedule-planer/project-schedule-planer-canvas/resource-project-schedule-planer/CpspRef";
import { CmpRef } from "../moments/project-moments/resource-planning-app/CmpRef";

import { AShape } from "./AShape";
import { Canvas } from "./Canvas";

export class Rectangle extends AShape {
  protected renderInOffscreen: boolean;

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

  setRenderInOffscreen() {
    this.renderInOffscreen = true;
  }

  protected getGridContainerBoundaries(): any {
    if (CmpRef.cmp == undefined) {
      return {
        x: CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getGlobalX(),
        y: CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getGlobalY(),
        width: CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getWidth(),
        height: CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getHeight(),
      };
    }
    return {
      x: CmpRef.cmp.planningApp.gridContainer.getGlobalX(),
      y: CmpRef.cmp.planningApp.gridContainer.getGlobalY(),
      width: CmpRef.cmp.planningApp.gridContainer.getWidth(),
      height: CmpRef.cmp.planningApp.gridContainer.getHeight(),
    };
  }

  protected drawShape(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.rect(
      this.getGlobalX(),
      this.getGlobalY(),
      this.getWidth(),
      this.getHeight()
    );

    if (this.renderInOffscreen) {
      const { x, y, width, height } = this.getGridContainerBoundaries();
      if (CmpRef.cmp == undefined) {
        CpspRef.cmp.projectSchedulePlanerApp.offScreenCanvas.drawImage(
          context,
          Math.abs(this.getX()),
          Math.abs(this.getY()),
          width,
          height,
          x,
          y,
          width,
          height
        );
      }
      else {
        CmpRef.cmp.planningApp.offScreenCanvas.drawImage(
        context,
        Math.abs(this.getX()),
        Math.abs(this.getY()),
        width,
        height,
        x,
        y,
        width,
        height
      );
      }

    }

    if (this.backgroundImagePatterns.length > 0) {
      this.backgroundImagePatterns.forEach((p) => {
        // DOMMatrix array indexes: scaleX, skew, skew, scaleY, translateX, translateY
        const matrix = new DOMMatrixReadOnly([
          p.width / p.image.width,
          0,
          0,
          p.height / p.image.height,
          this.getGlobalX() + p.offsetX,
          this.getGlobalY() + p.offsetY,
        ]);
        p.pattern.setTransform(matrix);
        context.fillStyle = p.pattern;
        context.fillRect(
          this.getGlobalX(),
          this.getGlobalY(),
          this.getWidth(),
          this.getHeight()
        );
      });
    } else {
      context.fillStyle = this.backgroundColor;
      context.fill();
    }

    if (this.borderSize !== 0) {
      context.strokeStyle = this.borderColor;
      context.lineWidth = this.borderSize;
      context.stroke();
    }

    context.closePath();
  }

  draw() {
    if (!this.isVisible || (this._renderOnce && this._isRendered)) return;
    this.canvas.getContext().save();
    this.canvas.getContext().globalAlpha = this.getAlpha();
    this.drawShape(this.canvas.getContext());
    this.canvas.getContext().restore();
    this._isRendered = true;
  }
}
