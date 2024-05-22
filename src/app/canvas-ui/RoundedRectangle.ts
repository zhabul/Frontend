import { AShape } from "./AShape";
import { Canvas } from "./Canvas";

export class RoundedRectangle extends AShape {
  protected borderRoundness = 0;
  protected topLeftRound = true;
  protected topRightRound = true;
  protected bottomLeftRound = true;
  protected bottomRightRound = true;
  private halfRadians = Math.PI;
  private quarterRadians = Math.PI / 2;

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

  getBorderRoundness() {
    return this.borderRoundness;
  }
  setBorderRoundness(
    borderRoundness: number,
    topLeft: boolean = true,
    topRight: boolean = true,
    bottomLeft: boolean = true,
    bottomRight: boolean = true
  ) {
    this.borderRoundness = borderRoundness;
    this.topLeftRound = topLeft;
    this.topRightRound = topRight;
    this.bottomLeftRound = bottomLeft;
    this.bottomRightRound = bottomRight;

    return this;
  }

  private drawRoundedRectangle(
    x: number,
    y: number,
    width: number,
    height: number,
    roundness: number,
    context: CanvasRenderingContext2D
  ) {
    if (this.topLeftRound) {
      // top left arc
      context.arc(
        roundness + x,
        roundness + y,
        roundness,
        -this.quarterRadians,
        this.halfRadians,
        true
      );
    }

    if (this.bottomLeftRound) {
      // line from top left to bottom left
      context.lineTo(x, y + height - roundness);
      // bottom left arc
      context.arc(
        roundness + x,
        height - roundness + y,
        roundness,
        this.halfRadians,
        this.quarterRadians,
        true
      );
    } else {
      context.lineTo(x, y + height);
    }

    if (this.bottomRightRound) {
      // line from bottom left to bottom right
      context.lineTo(x + width - roundness, y + height);
      // bottom right arc
      context.arc(
        x + width - roundness,
        y + height - roundness,
        roundness,
        this.quarterRadians,
        0,
        true
      );
    } else {
      context.lineTo(x + width, y + height);
    }

    if (this.topRightRound) {
      // line from bottom right to top right
      context.lineTo(x + width, y + roundness);
      // top right arc
      context.arc(
        x + width - roundness,
        y + roundness,
        roundness,
        0,
        -this.quarterRadians,
        true
      );
    } else {
      context.lineTo(x + width, y);
    }

    if (this.topLeftRound) {
      // line from top right to top left
      context.lineTo(x + roundness, y);
    } else context.lineTo(x, y);
  }

  protected drawShape(context: CanvasRenderingContext2D) {
    context.beginPath();

    this.drawRoundedRectangle(
      this.getGlobalX(),
      this.getGlobalY(),
      this.getWidth(),
      this.getHeight(),
      this.borderRoundness,
      context
    );

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
        context.fill();
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
    if(this.getInnerShadow()){
      this.canvas.getContext().shadowBlur = this.getShadowBlur();
      this.canvas.getContext().shadowOffsetX = this.getShadowOffsetX();
      this.canvas.getContext().shadowOffsetY = this.getShadowOffsetY();
      this.canvas.getContext().shadowColor = this.getShadowColor();
    }
    this.drawShape(this.canvas.getContext());
    if(this.getDropShadow()){
      this.canvas.getContext().shadowBlur = this.getShadowBlur();
      this.canvas.getContext().shadowOffsetX = this.getShadowOffsetX();
      this.canvas.getContext().shadowOffsetY = this.getShadowOffsetY();
      this.canvas.getContext().shadowColor = this.getShadowColor();
      this.canvas.getContext().fill();
    }
    this.canvas.getContext().restore();
    this._isRendered = true;
  }
}
