import { AScrollbarSlider } from "../AScrollbarSlider";
import { Canvas } from "../../Canvas";
import { CpspRef } from "src/app/moments/project-moments-schedule-planer/project-schedule-planer-canvas/resource-project-schedule-planer/CpspRef";

export class HorizontalScrollbarSlider extends AScrollbarSlider {
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
      CpspRef.cmp.projectSchedulePlanerApp.resourcesCanvas.setElementPointerEvents("none");
      this.canvas.addDrawingContainer(this.parent.getParent());
      this.scrollbarContainerConnections.forEach((conn) =>
        this.canvas.addDrawingContainer(conn.getParent())
      );
      this.canvas.getCanvasElement().onmousemove = (ev) => {
        this.move(this.limitScrollAmount(ev.movementX));
      };
      this.addRemoveEventsForMouseDownEvent(() => {
        this.canvas.resetDrawingContainers();
        CpspRef.cmp.projectSchedulePlanerApp.resourcesCanvas.setElementPointerEvents("auto");
      });
    });
  }

  move(x: number): void {
    if (x < 0 && this.getX() + x < 0) {
      this.setX(0);
      this.updatePositionOfAllConnections();
      return;
    }

    if (x > 0 && this.getX() + this.getWidth() + x > this.parent.getWidth()) {
      this.setX(this.parent.getWidth() - this.getWidth());
      this.updatePositionOfAllConnections();
      return;
    }

    this.setX(this.getX() + x);
    this.updatePositionOfAllConnections();
  }

  updatePositionOfAllConnections() {
    const newX = -this.getX() * this.scrollMultiplier;
    this.scrollbarContainerConnections.forEach((conn) => conn.setX(newX));
    this.parent.getParent().getInnerContainer().setX(newX);
  }

  updateSliderSize() {
    let maxWidth = this.parent.getWidth();
    this.scrollbarContainerConnections.forEach((c) => {
      if (c.getWidth() > maxWidth) maxWidth = c.getWidth();
    });

    this.setMultiplier(maxWidth / this.parent.getWidth());
    const newSliderWidth =
      (this.parent.getWidth() / maxWidth) * this.parent.getWidth();
    this.setWidth(newSliderWidth);

    this.updateSliderPositionIfSliderSpilledOut();
    this.scrollbarContainerConnections.forEach((c) => c.setWidth(maxWidth));
    this.parent.getParent().getInnerContainer().setWidth(maxWidth);
  }

  updateSliderPositionIfSliderSpilledOut() {
    if (this.getX() + this.getWidth() > this.parent.getWidth()) {
      this.move(this.parent.getWidth() - this.getWidth() - this.getX());
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
    context.moveTo(0, this.getHeight() / 2);
    context.lineTo(this.getWidth(), this.getHeight() / 2);
    context.stroke();
  }

  override draw() {
    super.draw();
    this.canvas.getContext().save();
    this.drawInnerSlider(this.canvas.getContext());
    this.canvas.getContext().restore();
  }
}
