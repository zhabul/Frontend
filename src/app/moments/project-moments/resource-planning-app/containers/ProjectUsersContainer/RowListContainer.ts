import { AScrollableContainer } from "src/app/canvas-ui/AScrollableContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { Config } from "src/app/moments/project-moments/resource-planning-app/Config";
import { GenericContainer } from "src/app/canvas-ui/GenericContainer";
import { TextRenderer } from "src/app/canvas-ui/TextRenderer";
import { CmpRef } from "../../CmpRef";

export class RowListContainer extends AScrollableContainer {
  constructor(
    x: number,
    y: number,
    width: string | number,
    height: string | number,
    canvas: Canvas,
    parent
  ) {
    super(x, y, width, height, canvas, parent);
    this.addAllRowNumbers();
  }

  addRowNumber(rowNumber: number, y: number) {
    const rowNumberContainer = new GenericContainer(
      0,
      y,
      Config.cellHeight,
      Config.cellHeight,
      this.canvas,
      this.innerContainer
    );
    rowNumberContainer.setBackgroundColor("#1A1A1A");
    rowNumberContainer.setBorder("#858585", 1);

    const rowNumberText = new TextRenderer(
      rowNumber.toString(),
      this.canvas,
      rowNumberContainer
    );
    rowNumberText.setColor("white");
    rowNumberText.setFontSize(11);
    rowNumberText.setAlignment("center", "center");
    rowNumberText.updateTextDimensions();
  }

  addAllRowNumbers() {
    let rowNumber = 1;
    CmpRef.cmp.allDisplayProjects.forEach((project) => {
      this.addRowNumber(rowNumber, project.y);
      rowNumber++;
      project.users.forEach((user) => {
        this.addRowNumber(rowNumber, project.y + user.y + Config.cellHeight);

        rowNumber++;
      });
    });
  }

  refreshDisplay() {
    this.innerContainer.removeAllChildren();
    this.addAllRowNumbers();
    this.draw();
  }
}
