import { Canvas } from "src/app/canvas-ui/Canvas";
import { VerticalScrollbarSlider } from "src/app/canvas-ui/scrollbar/VerticalScrollbar/VerticalScrollbarSlider";
import { CmpRef } from "../../../CmpRef";
import { ProjectUsersContainer } from "../../ProjectUsersContainer/ProjectUsersContainer";

export class GridContainerVerticalScrollbarSlider extends VerticalScrollbarSlider {
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
      this.canvas.addDrawingContainer(CmpRef.cmp.planningApp.sideSection);
      this.canvas.addDrawingContainer(this.parent.getParent());
      this.canvas.getCanvasElement().onmousemove = (ev) => {
        this.move(this.limitScrollAmount(ev.movementY));
      };
      this.addRemoveEventsForMouseDownEvent(() => {
        this.canvas.resetDrawingContainers();
        CmpRef.cmp.planningApp.resourcesCanvas.setElementPointerEvents("auto");
      });
    });
  }

  override move(y: number) {
    super.move(y);

    const projectUsersContainer: ProjectUsersContainer =
      CmpRef.cmp.planningApp.projectUsersContainer;
    const innerContainer = projectUsersContainer
      .getUserTableBodyContainer()
      .getInnerContainer();

    if (innerContainer.getChildren().length < 1) return;

    if (y < 0) {
      while (
        innerContainer.getFirstChild().getGlobalY() > this.parent.getGlobalY()
      ) {

        projectUsersContainer.setCurrentDisplayProjectIndex(
          projectUsersContainer.getCurrentDisplayProjectIndex() - 1
        );
        projectUsersContainer.addDisplayProjectToProjectUsersContainer(
          projectUsersContainer.getCurrentDisplayProjectIndex()
        );
        innerContainer.moveLastChildToFirst();
        this.parent.getParent().getInnerContainer().moveLastChildToFirst();
      }

      if (
        innerContainer.getLastChild().getGlobalY() >
        this.parent.getGlobalY() + this.parent.getHeight()
      ) {
        innerContainer.removeLastChild();
        this.parent.getParent().getInnerContainer().removeLastChild();
        return;
      }
    }

    if (y > 0) {
      while(
        innerContainer.getLastChild().getGlobalY() +
        innerContainer.getLastChild().getHeight() <
        this.parent.getGlobalY() + this.parent.getHeight()
      ) {
        if(!projectUsersContainer.addDisplayProjectToProjectUsersContainer(
            projectUsersContainer.getCurrentDisplayProjectIndex() +
              innerContainer.getChildren().length
          )) break;
      }

      if (
        innerContainer.getFirstChild().getGlobalY() +
          innerContainer.getFirstChild().getHeight() <
        this.parent.getGlobalY()
      ) {
        projectUsersContainer.setCurrentDisplayProjectIndex(
          projectUsersContainer.getCurrentDisplayProjectIndex() + 1
        );
        innerContainer.removeFirstChild();
        this.parent.getParent().getInnerContainer().removeFirstChild();
      }
    }
  }

  moveYWithClick(y: number) {
    super.move(y);

    const projectUsersContainer: ProjectUsersContainer =
      CmpRef.cmp.planningApp.projectUsersContainer;

    let newProjectIndex = projectUsersContainer.findProjectIndexByYPosition(
      this.getY() * this.scrollMultiplier
    );
    newProjectIndex = newProjectIndex >= 1 ? newProjectIndex - 1 : 0;
    projectUsersContainer
      .getUserTableBodyContainer()
      .getInnerContainer()
      .removeAllChildren();
    this.parent.getParent().getInnerContainer().removeAllChildren();
    projectUsersContainer.setCurrentDisplayProjectIndex(newProjectIndex);
    projectUsersContainer.refreshDisplay();

    CmpRef.cmp.planningApp.sideSection.draw();
    this.parent.getParent().draw();

    //CmpRef.cmp.planningApp.resourcePlanningContainer.draw();
    //CmpRef.cmp.planningApp.showHideResourcePlanning.draw();
  }

  override updateSliderPositionIfSliderSpilledOut() {
    if (this.getY() + this.getHeight() > this.parent.getHeight()) {
      this.moveYWithClick(
        this.parent.getHeight() - this.getHeight() + this.getY()
      );
    }
  }
}
