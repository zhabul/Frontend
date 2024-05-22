import { AScrollableContainer } from "src/app/canvas-ui/AScrollableContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { GenericContainer } from "src/app/canvas-ui/GenericContainer";
//import { Rectangle } from "src/app/canvas-ui/Rectangle";
import { CppRef } from "../../../CppRef";
import { HeadColumn } from "./HeadColumn";

export class UsersTableHead extends AScrollableContainer {

  static threeVerticalDotsColumnWidth = 20;
  static columnHeight = 20;
  // private columnHeader: GenericContainer;
  // private addColumnButton: Rectangle;
  // private newColumnAdded: boolean = false;

  constructor(x: number, y: number, width: string | number, height: string | number, canvas: Canvas, parent) {
      super(x, y, width, height, canvas, parent);
      this.setBackgroundColor('#1A1A1A');
      this.setBorder('#1A1A1A', 1);
  }


  updateInnerContainerWidth() {
        const lastColumnIndex = CppRef.cpp.visibleColumns.length - 1;
        this.getInnerContainer().setWidth(CppRef.cpp.visibleColumns[lastColumnIndex].x + CppRef.cpp.visibleColumns[lastColumnIndex].width);
    }

    renderAllHeadColumns() {
        this.renderThreeVerticalDotsColumn();

        CppRef.cpp.visibleColumns = CppRef.cpp.allColumns.filter(c => c.isVisible);
        CppRef.cpp.visibleColumns.forEach((c, i) => {
            this.renderHeadColumn(i);
        });
    }

  private renderHeadColumn(columnIndex: number) {
      const column = CppRef.cpp.visibleColumns[columnIndex];
      if (columnIndex === 0) {
          column.x = UsersTableHead.threeVerticalDotsColumnWidth;
      } else {
          column.x = CppRef.cpp.visibleColumns[columnIndex - 1].x + CppRef.cpp.visibleColumns[columnIndex - 1].width;
      }

      const columnContainer = new HeadColumn (column.x, this.getHeight() - UsersTableHead.columnHeight, column.width, UsersTableHead.columnHeight, this.canvas, this.innerContainer, column);
      columnContainer.setColumnIndex(columnIndex);
      columnContainer.setBackgroundColor('#1A1A1A');
      columnContainer.setBorder('#858585', 1);
  }

  private renderThreeVerticalDotsColumn() {
      const columnContainer = new GenericContainer(0, this.getHeight() - UsersTableHead.columnHeight, UsersTableHead.threeVerticalDotsColumnWidth, UsersTableHead.columnHeight, this.canvas, this.innerContainer);
        columnContainer.setBackgroundColor('#1A1A1A');
        columnContainer.setBorder('#858585', 1);
  }

}
