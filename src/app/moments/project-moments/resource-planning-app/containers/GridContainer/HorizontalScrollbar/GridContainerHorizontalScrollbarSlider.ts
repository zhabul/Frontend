import { Canvas } from "src/app/canvas-ui/Canvas";
import { HorizontalScrollbarSlider } from "src/app/canvas-ui/scrollbar/HorizontalScrollbar/HorizontalScrollbarSlider";
import { CmpRef } from "../../../CmpRef";
import { DaysContainer } from "../../DaysContainer";
import { ResourcePlanningContainer } from "../../ResourcePlanningContainer/ResourcePlanningContainer";

export class GridContainerHorizontalScrollbarSlider extends HorizontalScrollbarSlider {
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
      CmpRef.cmp.planningApp.resourcesCanvas.setElementPointerEvents("none");
      this.canvas.addDrawingContainer(CmpRef.cmp.planningApp.daysContainer);
      this.canvas.addDrawingContainer(this.getParent().getParent());
      this.canvas.addDrawingContainer(
        CmpRef.cmp.planningApp.resourcePlanningContainer
      );
      this.canvas.addDrawingContainer(
        CmpRef.cmp.planningApp.daysContainerRightOverlayBox
      );
      this.canvas.getCanvasElement().onmousemove = (ev) => {
        this.move(this.limitScrollAmount(ev.movementX));
      };
      this.addRemoveEventsForMouseDownEvent(() => {
        this.canvas.resetDrawingContainers();
        CmpRef.cmp.planningApp.resourcesCanvas.setElementPointerEvents("auto");
      });
    });
  }

  override move(x: number) {
    super.move(x);

    const daysContainer: DaysContainer = CmpRef.cmp.planningApp.daysContainer;
    const resourcePlanningContainer: ResourcePlanningContainer =
      CmpRef.cmp.planningApp.resourcePlanningContainer;
    const innerContainer = daysContainer.getInnerContainer();

    if (x < 0) {
      if (
        innerContainer.getFirstChild().getGlobalX() > this.parent.getGlobalX()
      ) {
        daysContainer.setCurrentDisplayMonthIndex(
          daysContainer.getCurrentDisplayMonthIndex() - 1
        );
        daysContainer.addDisplayMonthToDaysContainer(
          daysContainer.getCurrentDisplayMonthIndex()
        );
        innerContainer.moveLastChildToFirst();
        resourcePlanningContainer.addResourceWeeksOfMonth(
          daysContainer.getCurrentDisplayMonthIndex()
        );
        resourcePlanningContainer
          .getResourceListContainer()
          .moveLastChildToFirst();
      }

      if (
        innerContainer.getLastChild().getGlobalX() >
        this.parent.getGlobalX() + this.parent.getWidth()
      ) {
        innerContainer.removeLastChild();
        resourcePlanningContainer.getResourceListContainer().removeLastChild();
        return;
      }
    }

    if (x > 0) {
      if (
        innerContainer.getLastChild().getGlobalX() +
          innerContainer.getLastChild().getWidth() <
        this.parent.getGlobalX() + this.parent.getWidth()
      ) {
        daysContainer.addDisplayMonthToDaysContainer(
          daysContainer.getCurrentDisplayMonthIndex() +
            innerContainer.getChildren().length
        );
        resourcePlanningContainer.addResourceWeeksOfMonth(
          daysContainer.getCurrentDisplayMonthIndex() +
            innerContainer.getChildren().length -
            1
        );
      }

      if (
        innerContainer.getFirstChild().getGlobalX() +
          innerContainer.getFirstChild().getWidth() <
        this.parent.getGlobalX()
      ) {
        daysContainer.setCurrentDisplayMonthIndex(
          daysContainer.getCurrentDisplayMonthIndex() + 1
        );
        innerContainer.removeFirstChild();
        resourcePlanningContainer.getResourceListContainer().removeFirstChild();
      }
    }
  }

  moveXWithClick(x: number) {
    super.move(x);

    const daysContainer: DaysContainer = CmpRef.cmp.planningApp.daysContainer;

    const newMonthIndex = daysContainer.findMonthIndexByXPosition(
      this.getX() * this.scrollMultiplier
    );

    daysContainer.getInnerContainer().removeAllChildren();
    daysContainer.setCurrentDisplayMonthIndex(newMonthIndex);
    daysContainer.addAllDisplayMonthsThatFitContainerView();
    CmpRef.cmp.planningApp.resourcePlanningContainer.refreshDisplay();
    //CmpRef.cmp.planningApp.gridContainer.draw();
    daysContainer.draw();

    this.parent.getParent().draw();
    CmpRef.cmp.planningApp.daysContainerRightOverlayBox.draw();

    this.updatePositionOfAllConnections();
  }

  override updateSliderPositionIfSliderSpilledOut() {
    if (this.getX() + this.getWidth() > this.parent.getWidth()) {
      this.moveXWithClick(
        this.parent.getWidth() - this.getWidth() - this.getX()
      );
    }
  }
}
