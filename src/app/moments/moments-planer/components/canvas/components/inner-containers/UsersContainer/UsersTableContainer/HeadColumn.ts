import { AContainer } from "src/app/canvas-ui/AContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { IMovable } from "src/app/canvas-ui/interfaces/IMovable";
import { IResizable } from "src/app/canvas-ui/interfaces/IResizable";
//import { TextRenderer } from "src/app/canvas-ui/TextRenderer";
import { Column } from "src/app/moments/project-moments/resource-planning-app/containers/ProjectUsersContainer/ProjectUsersTableHead/Column";
import { UsersTableHead } from "./UsersTableHead";

export class HeadColumn extends AContainer implements IMovable, IResizable {

  // private column: Column;
  public columnIndex: number;
  // private mouseAction: 'move'|'resize';
  // private columnText: TextRenderer;
  private minWidth = 15;

  private leftColumn: UsersTableHead;

  constructor(x: number, y: number, width: string | number, height: string | number, canvas: Canvas, parent, column: Column) {
    super(x, y, width, height, canvas, parent);
  }

  move(x: number): void { this.setX(this.getX() + x); }

  resize(amountResized: number, anchor: 'left'|'up'|'right'|'down'): void {
      switch (anchor) {
          case 'left':
              if (this.leftColumn.getWidth() + amountResized < this.minWidth) {
                  this.leftColumn.setWidth(this.minWidth);
                  return;
              }

              this.parent.removeAllChildren();
              this.parent.getParent().renderAllHeadColumns();

              this.leftColumn.setWidth(this.leftColumn.getWidth() + amountResized);
              return;
          case 'right':
              if (this.getWidth() + amountResized < this.minWidth) {
                  this.setWidth(this.minWidth);
                  return;
              }

              this.parent.removeAllChildren();
              this.parent.getParent().renderAllHeadColumns();

              this.setWidth(this.getWidth() + amountResized);
              return;
          case 'up':
              throw Error('Not Implemented');
          case 'down':
              throw Error('Not Implemented');
      }
  }

  setColumnIndex(index: number) { this.columnIndex = index; }
}
