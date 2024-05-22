import { AScrollableContainer } from "src/app/canvas-ui/AScrollableContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { Config } from "src/app/moments/project-moments/resource-planning-app/Config";
import { GenericContainer } from "src/app/canvas-ui/GenericContainer";
import { Rectangle } from "src/app/canvas-ui/Rectangle";
import { TextRenderer } from "src/app/canvas-ui/TextRenderer";
import { ProjectUsersTableHead } from "./ProjectUsersTableHead/ProjectUsersTableHead";
import { RowListContainer } from "./RowListContainer";

export class ProjectUsersRowContainer extends AScrollableContainer {
  private bottomOverlay: Rectangle;
  private rowList: RowListContainer;

  constructor(
    x: number,
    y: number,
    width: string | number,
    height: string | number,
    canvas: Canvas,
    parent
  ) {
    super(x, y, width, height, canvas, parent);

    this.setBackgroundColor("#1A1A1A");
    this.setBorder("#1A1A1A", 1);
    this.setup();
  }

  getRowListContainer() {
    return this.rowList;
  }
  getBottomOverlay() {
    return this.bottomOverlay;
  }

  setup() {
    const rowNumberHead = new GenericContainer(
      0,
      Config.topSectionSize - ProjectUsersTableHead.columnHeight,
      this.getWidth(),
      ProjectUsersTableHead.columnHeight,
      this.canvas,
      this.innerContainer
    );
    rowNumberHead.setBackgroundColor("#1A1A1A");
    rowNumberHead.setBorder("#858585", 1);

    const rowColumnText = new TextRenderer("Nr", this.canvas, rowNumberHead);
    rowColumnText.setColor("white");
    rowColumnText.setAlignment("center", "center");
    rowColumnText.updateTextDimensions();

    this.rowList = new RowListContainer(
      0,
      Config.topSectionSize,
      this.getWidth(),
      this.getHeight() - Config.topSectionSize,
      this.canvas,
      this
    );

    this.bottomOverlay = new Rectangle(
      0,
      this.getHeight() - Config.scrollbarSize,
      Config.cellHeight,
      Config.scrollbarSize,
      this.canvas,
      this
    );
    this.bottomOverlay.setBackgroundColor("#1A1A1A");
  }

  refreshDisplay() {
    this.rowList.refreshDisplay();
    this.bottomOverlay.draw();
  }
}
