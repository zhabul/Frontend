import { ConfigSc } from "src/app/moments/project-moments-schedule-planer/project-schedule-planer-canvas/resource-project-schedule-planer/Config";
import { Canvas } from "../Canvas";
import { IMovable } from "../interfaces/IMovable";
import { RoundedRectangle } from "../RoundedRectangle";
import { AScrollbar } from "../scrollbar/AScrollbar";

export abstract class AScrollbarSlider
  extends RoundedRectangle
  implements IMovable
{
  protected scrollbarContainerConnections = [];
  protected scrollMultiplier = 1; // when scrolling needs to be multiplied with this number

  constructor(
    x: number,
    y: number,
    width: string | number,
    height: string | number,
    canvas: Canvas,
    parent: AScrollbar
  ) {
    super(x, y, width, height, canvas, parent);
    this.setOnMouseHoverHandler(() => (document.body.style.cursor = "pointer"));
  }

  protected limitScrollAmount(movementAmount: number) {
    if (movementAmount < -ConfigSc.scrollbarScrollingThreshold)
      return -ConfigSc.scrollbarScrollingThreshold;
    if (movementAmount > ConfigSc.scrollbarScrollingThreshold)
      return ConfigSc.scrollbarScrollingThreshold;
    return movementAmount;
  }

  abstract move(amountMoved: number): void;

  getMultiplier() {
    return this.scrollMultiplier;
  }
  setMultiplier(multiplier: number) {
    this.scrollMultiplier = multiplier;
  }

  abstract addContainerScrollConnection(conn);
  abstract updateSliderSize();
  abstract updateSliderPositionIfSliderSpilledOut();
}
