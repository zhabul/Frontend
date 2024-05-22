import { AScrollableContainer } from "src/app/canvas-ui/AScrollableContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { GenericContainer } from "src/app/canvas-ui/GenericContainer";
import { Rectangle } from "src/app/canvas-ui/Rectangle";
import { TextRenderer } from "src/app/canvas-ui/TextRenderer";
import { Configuration } from "../../Configuration";
import { RowListPPContainer } from "./RowListPPContainer";
import { UsersTableHead } from "./UsersTableContainer/UsersTableHead";

export class UsersRowContainer extends AScrollableContainer {

  private bottomOverlay: Rectangle;
  private rowList: RowListPPContainer;

  constructor(x: number, y: number, width: string|number, height: string|number, canvas: Canvas, parent) {
      super(x, y, width, height, canvas, parent);

      this.setBackgroundColor('#1A1A1A');
      this.setBorder('#1A1A1A', 1);
      this.setup();

  }

  setup() {
      const rowNumberHead = new GenericContainer(0, Configuration.topSectionSize - UsersTableHead.columnHeight, this.getWidth(), UsersTableHead.columnHeight, this.canvas, this.innerContainer);
      rowNumberHead.setBackgroundColor('#1A1A1A');
      rowNumberHead.setBorder('#858585', 1);

      const rowColumnText = new TextRenderer('Nr', this.canvas, rowNumberHead);
      rowColumnText.setColor('white');
      rowColumnText.setAlignment('center', 'center');
      rowColumnText.updateTextDimensions();

      this.rowList = new RowListPPContainer(0, Configuration.topSectionSize, this.getWidth(), this.getHeight() - Configuration.topSectionSize, this.canvas, this);

      this.bottomOverlay = new Rectangle(0, this.getHeight() - Configuration.scrollbarSize, Configuration.cellHeight, Configuration.scrollbarSize, this.canvas, this);
      this.bottomOverlay.setBackgroundColor('#1A1A1A');
  }
}
