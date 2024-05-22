import { AScrollableContainer } from "src/app/canvas-ui/AScrollableContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { IMovable } from "src/app/canvas-ui/interfaces/IMovable";
import { CmpRef } from "../../CmpRef";
import { Config } from "../../Config";

export class SelectedUsersContainer
  extends AScrollableContainer
  implements IMovable
{
  selectedUsers = [];
  constructor(
    x: number,
    y: number,
    width: string | number,
    height: string | number,
    canvas: Canvas,
    parent
  ) {
    super(x, y, width, height, canvas, parent);
    this.createContainer(x, y, this.getWidth(), this.getHeight());
  }

  move(y: number) {
    this.setY(this.getY() + y);
  }

  getSelectedUsers() {
    return this.selectedUsers;
  }

  createContainer(x: number, y: number, width: number, height: number) {
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
          this.selectedUsers.push({
            projectId: project.id,
            userId: user.id,
            userY: user.y,
            y: projectGlobalY + user.y + Config.cellHeight,
            user: user,
          });
        }
      });
    });
    if (this.selectedUsers.length < 1) {
      return;
    }

    const startY = this.selectedUsers[0].y;
    const endY =
      this.selectedUsers[this.selectedUsers.length - 1].y + Config.cellHeight;
    this.setX(-Config.cellHeight);

    // in case of creating new box on existing one
    let newY =
      Config.firstUserBoxSelectedPositionDelta +
      Config.deltaMovementBetweenBoxes;
    newY = Math.ceil(Math.abs(newY) / Config.cellHeight) * Config.cellHeight;
    this.setY(newY);

    this.setHeight(endY - startY);
    Config.boxHeight = endY - startY;

    CmpRef.cmp.selectedUsersForStyleChange = this.selectedUsers;
    this.setBorder("black", 3);
    this.draw();

    let font = this.selectedUsers[0].user.styles.fontFamily;
    let size = this.selectedUsers[0].user.styles.fontSize;
    let color = this.selectedUsers[0].user.styles.color;
    let backgroundColor = this.selectedUsers[0].user.styles.backgroundColor;
    let decoration = this.selectedUsers[0].user.styles.fontDecoration;
    let weight = this.selectedUsers[0].user.styles.fontWeight;
    let style = this.selectedUsers[0].user.styles.fontStyle;

    this.selectedUsers.forEach((element) => {
      if (font != element.user.styles.fontFamily) {
        font = "";
      }
      if (size != element.user.styles.fontSize) {
        size = "";
      }
      if (color != element.user.styles.color) {
        color = "black";
      }
      if (backgroundColor != element.user.styles.backgroundColor) {
        backgroundColor = "black";
      }
      if (decoration != element.user.styles.fontDecoration) {
        decoration = "normal";
      }
      if (weight != element.user.styles.fontWeight) {
        weight = "normal";
      }
      if (style != element.user.styles.fontStyle) {
        style = "normal";
      }
    });

    CmpRef.cmp.changeFontFamilyInputValue = font;
    CmpRef.cmp.changeFontSizeInputValue = size;
    CmpRef.cmp.changeBackgroundColorInputValue = backgroundColor;
    CmpRef.cmp.changeTextColorInputValue = color;
    CmpRef.cmp.changeFontWeightInputValue = weight == "bold" ? true : false;
    CmpRef.cmp.changeFontStyleInputValue = style == "underline" ? true : false;
    CmpRef.cmp.changeFontDecorationInputValue =
      decoration == "underline" ? true : false;
  }
}
