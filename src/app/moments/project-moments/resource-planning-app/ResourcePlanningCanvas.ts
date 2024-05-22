import { Canvas } from "src/app/canvas-ui/Canvas";
import { Rectangle } from "src/app/canvas-ui/Rectangle";
import { CmpRef } from "./CmpRef";
import { Config } from "./Config";

export class ResourcePlanningCanvas extends Canvas {
  private selectionBorder: Rectangle;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    canvasElementId: string
  ) {
    super(x, y, width, height, canvasElementId);
    this.setInstanceClass(ResourcePlanningCanvas);
  }

  getSelectionBorder() {
    return this.selectionBorder;
  }

  onSelectionEnd(x: number, y: number, width: number, height: number) {
    this.findUsersInsideSelection(x, y, width, height);
  }

  findUsersInsideSelection(
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    const selectedUsers = [];

    CmpRef.cmp.allDisplayProjects.forEach((project) => {
      const projectGlobalY =
        Config.toolboxSize +
        Config.topSectionSize +
        project.y +
        CmpRef.cmp.planningApp.projectUsersContainer
          .getUserTableBodyContainer()
          .getInnerContainer()
          .getY();
      if (
        y + height < projectGlobalY ||
        y >
          projectGlobalY +
            project.users.length * Config.cellHeight +
            Config.cellHeight
      ) {
        return;
      }

      project.users.forEach((user) => {
        if (
          y < projectGlobalY + user.y + Config.cellHeight * 2 &&
          y + height > projectGlobalY + user.y + Config.cellHeight
        ) {
          selectedUsers.push({
            projectId: project.id,
            userId: user.id,
            y: projectGlobalY + user.y + Config.cellHeight,
          });
        }
      });
    });

    if (selectedUsers.length < 1) {
      return;
    }

    const startY = selectedUsers[0].y;
    const endY = selectedUsers[selectedUsers.length - 1].y + Config.cellHeight;

    this.selectionBorder = new Rectangle(
      0,
      startY,
      Config.sideCanvasSize - Config.sideSectionRightBorderWidth,
      endY - startY,
      this,
      this
    );
    this.selectionBorder.setBorder("black", 3);

    CmpRef.cmp.planningApp.sideSection.draw();
    this.selectionBorder.draw();
    CmpRef.cmp.planningApp.showHideResourcePlanning.draw();
    CmpRef.cmp.selectedUsersForStyleChange = selectedUsers;
  }

  startSelection(x: number, y: number) {
    if (this.selectionBorder) {
      this.removeChildById(this.selectionBorder.getId());
    }
    CmpRef.cmp.selectedUsersForStyleChange = [];
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
}
