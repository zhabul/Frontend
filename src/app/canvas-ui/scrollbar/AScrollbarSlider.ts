import { Canvas } from "../Canvas";
import { AScrollbar } from "./AScrollbar";
import { IMovable } from "../interfaces/IMovable";
import { Config } from "../../moments/project-moments/resource-planning-app/Config";
import { RoundedRectangle } from "../RoundedRectangle";

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
    if (movementAmount < -Config.scrollbarScrollingThreshold)
      return -Config.scrollbarScrollingThreshold;
    if (movementAmount > Config.scrollbarScrollingThreshold)
      return Config.scrollbarScrollingThreshold;
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
