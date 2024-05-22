import { Canvas } from "src/app/canvas-ui/Canvas";
import { Rectangle } from "src/app/canvas-ui/Rectangle";
import { ConfigSc } from "./Config";
import { CpspRef } from "./CpspRef";

export class ProjectSchaduleCanvas extends Canvas {

  private selectionBorder: Rectangle;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    canvasElementId: string
  ) {
    super(x, y, width, height, canvasElementId);
    this.setInstanceClass(ProjectSchaduleCanvas);
  }

  getSelectionBorder() {
    return this.selectionBorder;
  }

  onSelectionEnd(x: number, y: number, width: number, height: number) {
    this.findMomentsInsideSelection(x, y, width, height);
  }

  findMomentsInsideSelection(
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    const selectedMoments = [];
    const projectGlobalY = ConfigSc.toolboxSize + ConfigSc.topSectionSize;
    var innerY = 0;
    CpspRef.cmp.selectedProject.activities.forEach((activity) => {

      if (
        y + height < projectGlobalY ||
        y >
          projectGlobalY +
            activity.moments.length * ConfigSc.cellHeight +
            ConfigSc.cellHeight
      ) {
        return;
      }

      innerY++;
      activity.moments.forEach((moment) => {
        if (
          y < projectGlobalY + innerY * ConfigSc.cellHeight &&
          y + height > projectGlobalY + innerY * ConfigSc.cellHeight + ConfigSc.cellHeight
        ) {
          selectedMoments.push({
            projectId: CpspRef.cmp.selectedProject.id,
            activityId: activity.id,
            stateType: null,
            planId: null,
            y: projectGlobalY + innerY * ConfigSc.cellHeight,
          });
        }
        innerY++;
      });

    });
    if (selectedMoments.length < 1) {
      return;
    }

    const startY = selectedMoments[0].y;
    const endY = selectedMoments[selectedMoments.length - 1].y + ConfigSc.cellHeight;

    this.selectionBorder = new Rectangle(
      0,
      startY,
      ConfigSc.sideCanvasSize - ConfigSc.sideSectionRightBorderWidth,
      endY - startY,
      this,
      this
    );
    this.selectionBorder.setBorder("black", 10);

    CpspRef.cmp.projectSchedulePlanerApp.sideSection.draw();
    this.selectionBorder.draw();
    //CpspRef.cmp.projectSchedulePlanerApp.draw();
    CpspRef.cmp.selectedMomentsForStyleChange = selectedMoments;
  }

  startSelection(x: number, y: number) {
    if (this.selectionBorder) {
      this.removeChildById(this.selectionBorder.getId());
    }
    CpspRef.cmp.selectedMomentsForStyleChange = [];
    this.selectionBox = new Rectangle(x, y, 100, 100, this, this);
    this.selectionBox.setBackgroundColor("rgba(51,143,255,0.3)");
    this.selectionBox.setBorder("#338FFF", 2);
    this.getChildren().forEach((child) => this.drawingContainers.push(child));

    this.getCanvasElement().onmousemove = (e) => {
      this.selectionBox.setWidth(e.offsetX - x);
      this.selectionBox.setHeight(e.offsetY - y);
    };
    this.selectionBox.addRemoveEventsForMouseDownEvent(() =>
      this.endSelection()
    );
  }

  override removeDrawnContainers() {
    if (
      CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getSelectedMomentsContainer()
    ) {
      CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer
        .getSelectedMomentsContainer()
        .getInnerContainer()
        .removeChildById(
          CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer
            .getSelectedMomentsContainer()
            .getId()
        );
      this.removeChildById(
        CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer
          .getSelectedMomentsContainer()
          .getId()
      );
    }
    // if (CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getMovingLineIndicator()) {
    //   this.removeChildById(
    //     CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer
    //       .getMovingLineIndicator()
    //       .getId()
    //   );
    // }
  }
}
