import { AContainer } from "src/app/canvas-ui/AContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { IMovable } from "src/app/canvas-ui/interfaces/IMovable";

export class MomentContainer extends AContainer implements IMovable {

    public isAnimating: boolean = false;

  constructor(
    x: number,
    y: number,
    width: string | number,
    height: string | number,
    canvas: Canvas,
    parent
  ) {
    super(
      x,
      y,
      width,
      height,
      canvas,
      parent
    );
  }

    move(y: number) { this.setY(this.getY() + y); }

    moveWithAnimation(y: number) {
        if(this.isAnimating) return;
        this.isAnimating = true;
        requestAnimationFrame(() => {
            this.animate(y, y/Math.abs(y) * 10);
        });
    }

    animate(max, increment, current = 0) {
        if(current != 0 && (increment > 0 && current >= max || increment < 0 && current <= max)) {
            this.isAnimating = false;
            this.setY(this.getY() - current + max);
            return;
        }

        if(Math.abs(current + increment) > Math.abs(max)) {
            this.setY(this.getY() - current + max);
            this.isAnimating = false;
            return;
        }

        this.setY(this.getY() + increment);

        requestAnimationFrame(() => {
            this.animate(max, increment, current + increment);
        });
    }
}
