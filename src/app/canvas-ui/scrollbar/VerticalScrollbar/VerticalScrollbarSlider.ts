import { AScrollbarSlider } from "../AScrollbarSlider";
import { Canvas } from "../../Canvas";

export class VerticalScrollbarSlider extends AScrollbarSlider {
  constructor(
    x: number,
    y: number,
    width: string | number,
    height: string | number,
    canvas: Canvas,
    parent
  ) {
    super(x, y, width, height, canvas, parent);

    this.setOnMouseDownHandler((e) => {
      this.canvas.addDrawingContainer(this.parent.getParent());
      this.scrollbarContainerConnections.forEach((conn) =>
        this.canvas.addDrawingContainer(conn.getParent())
      );
      this.canvas.getCanvasElement().onmousemove = (ev) => {
        this.move(this.limitScrollAmount(ev.movementY));
      };
      this.addRemoveEventsForMouseDownEvent(() => {
        this.canvas.resetDrawingContainers();
      });
    });
  }

  move(y: number): void {
    if (y < 0 && this.getY() + y < 0) {
      this.setY(0);
      this.updatePositionOfAllConnections();
      return;
    }

    const pHight = this.parent.getHeight() - 4; // 4 i offset for scroll arrows

    if (y > 0 && this.getY() + this.getHeight() + y > pHight) {
      this.setY(pHight - this.getHeight());
      this.updatePositionOfAllConnections();
      return;
    }

    this.setY(this.getY() + y);

    this.updatePositionOfAllConnections();
  }

  updatePositionOfAllConnections() {
    const newY = -this.getY() * this.scrollMultiplier;
    this.scrollbarContainerConnections.forEach((conn) => conn.setY(newY));
    this.parent.getParent().getInnerContainer().setY(newY);
  }

  updateSliderSize() {
    let maxHeight = this.parent.getHeight();
    this.scrollbarContainerConnections.forEach((c) => {
      if (c.getHeight() > maxHeight) maxHeight = c.getHeight();
    });

    this.setMultiplier(maxHeight / this.parent.getHeight());
    const newSliderHeight =
      (this.parent.getHeight() / maxHeight) * this.parent.getHeight();
    this.setHeight(newSliderHeight);

    this.updateSliderPositionIfSliderSpilledOut();
    this.scrollbarContainerConnections.forEach((c) => c.setHeight(maxHeight));
    this.parent.getParent().getInnerContainer().setHeight(maxHeight);
  }

  updateSliderPositionIfSliderSpilledOut() {
    if (this.getY() + this.getHeight() > this.parent.getHeight()) {
      this.move(this.parent.getHeight() - this.getHeight() - this.getY());
    }
  }

  addContainerScrollConnection(conn) {
    this.scrollbarContainerConnections.push(conn);
    this.updateSliderSize();
  }

  drawInnerSlider(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.strokeStyle = "#82A7E2";
    context.lineWidth = 2;
    context.fillStyle = "#82A7E2";
    context.translate(this.getGlobalX(), this.getGlobalY());
    context.moveTo(this.getWidth() / 2, 0);
    context.lineTo(this.getWidth() / 2, this.getHeight());
    context.stroke();
  }

  override draw() {
    super.draw();
    this.canvas.getContext().save();
    this.drawInnerSlider(this.canvas.getContext());
    this.canvas.getContext().restore();
  }
}
