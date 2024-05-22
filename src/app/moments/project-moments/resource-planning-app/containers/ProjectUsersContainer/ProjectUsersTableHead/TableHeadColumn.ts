import { AContainer } from "src/app/canvas-ui/AContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { Config } from "src/app/moments/project-moments/resource-planning-app/Config";
import { DropdownMenu } from "src/app/canvas-ui/DropdownMenu";
import history from "src/app/canvas-ui/history/history";
import { IMovable } from "src/app/canvas-ui/interfaces/IMovable";
import { IResizable } from "src/app/canvas-ui/interfaces/IResizable";
import { TextRenderer } from "src/app/canvas-ui/TextRenderer";
import { CmpRef } from "../../../CmpRef";
import { Column } from "./Column";

export class TableHeadColumn
  extends AContainer
  implements IMovable, IResizable
{
  private column: Column;
  private columnIndex: number;
  private mouseAction: "move" | "resize";
  private columnText: TextRenderer;
  private minWidth = 15;

  private leftColumn: TableHeadColumn;

  constructor(
    x: number,
    y: number,
    width: string | number,
    height: string | number,
    canvas: Canvas,
    parent,
    column: Column
  ) {
    super(x, y, width, height, canvas, parent);

    this.column = column;
    this.createColumnText();
    if (Config.isInEditMode) {
      this.setOnMouseHoverHandler((e) => {
        document.body.style.cursor = "e-resize";
        if (
          e.layerX <= this.getGlobalX() + 5 ||
          e.layerX >= this.getGlobalX() + this.getWidth() - 5
        ) {
          document.body.style.cursor = "col-resize";
        }
      });

      this.setOnMouseDownHandler((e) => {
        const startingWidth = this.column.width;
        const children = this.parent.getChildren();
        const index = children.findIndex((child) => child == this);
        children.push(children.splice(index, 1)[0]);
        this.canvas.addDrawingContainer(this.parent.getParent());
        this.setMoveAndResizeEvents(e);
        this.canvas.getCanvasElement().onmousemove = (ev) => {
          this.mouseMoveHandler(ev);
        };

        this.addRemoveEventsForMouseDownEvent(() => {
          this.canvas.resetDrawingContainers();
          document.body.style.cursor = "default";

          children.splice(index, 0, children.pop());

          if (this.mouseAction === "move") {
            const newIndex = this.parent
              .getParent()
              .findColumnByXPosition(this.getX());
            const newColumn = CmpRef.cmp.visibleColumns[newIndex];

            let newSortIndex = 0;
            switch (newIndex) {
              case 0:
                newSortIndex = newColumn.sortIndex - 1;
                break;
              case CmpRef.cmp.visibleColumns.length - 1:
                newSortIndex = newColumn.sortIndex + 1;
                break;
              default:
                newSortIndex =
                  CmpRef.cmp.visibleColumns[newIndex - 1].sortIndex / 2 +
                  newColumn.sortIndex / 2;
            }
            const oldSortIndex = this.column.sortIndex;
            this.column.sortIndex = newSortIndex;
            this.parent.getParent().sortColumns();
            history.addToQueue(
              () =>
                CmpRef.cmp.updateResourcePlanningColumnSortIndex(
                  this.column.id,
                  newSortIndex
                ),
              () =>
                CmpRef.cmp.updateResourcePlanningColumnSortIndex(
                  this.column.id,
                  oldSortIndex
                )
            );
          } else {
            let column = this.column;
            if (this.leftColumn) {
              column = this.leftColumn.getColumn();
            }
            history.addToQueue(
              () =>
                CmpRef.cmp.updateResourcePlanningColumnWidth(
                  column.id,
                  column.width
                ),
              () =>
                CmpRef.cmp.updateResourcePlanningColumnWidth(
                  column.id,
                  startingWidth
                )
            );
          }

          this.parent.getParent().refreshDisplay();
        });
      });

      this.setOnMouseRightClickHandler((e) => {
        const dropdownMenu = new DropdownMenu(
          e.layerX,
          e.layerY,
          200,
          200,
          this.canvas
        );
        /*dropdownMenu.addOption(
          `${CmpRef.cmp.getTranslate().instant("Hide")} "${CmpRef.cmp
            .getTranslate()
            .instant(this.column.textContent)}"`,
          (e) => {
            this.column.isVisible = false;
            history.addToQueue(
              () => CmpRef.cmp.hideResourcePlanningColumn(this.column.id),
              () => CmpRef.cmp.showResourcePlanningColumn(this.column.id)
            );
            this.parent.getParent().refreshDisplay();
          }
        );*/
        if (!this.column.key) {
          dropdownMenu.addOption(
            CmpRef.cmp.getTranslate().instant("Edit"),
            (e) => {
              CmpRef.cmp.columnInput.style.display = "block";
              CmpRef.cmp.columnInput.style.width = `${
                this.column.width + 10
              }px`;
              CmpRef.cmp.columnInput.style.height = `${
                this.columnText.getHeight() + 10
              }px`;
              CmpRef.cmp.columnInput.value = this.columnText.getTextContent();
              CmpRef.cmp.columnInput.style.top = `${
                this.columnText.getGlobalY() - this.columnText.getHeight() / 2
              }px`;
              const x =
                Config.sidebarSize +
                this.columnText.getGlobalX() +
                this.columnText.getWidth() / 2;
              CmpRef.cmp.columnInput.style.left = `${x}px`;
              CmpRef.cmp.columnInput.focus();
              CmpRef.cmp.columnInput.select();
              CmpRef.cmp.selectedTableHeadColumnForEditing = this;
            }
          );
          dropdownMenu.addOption(
            CmpRef.cmp.getTranslate().instant("Remove"),
            (e) => {
              if (
                !confirm(CmpRef.cmp.getTranslate().instant("Are you sure?"))
              ) {
                return;
              }
              CmpRef.cmp.allColumns.splice(this.columnIndex, 1);
              history.addToQueue(
                () => CmpRef.cmp.removeResourcePlanningColumn(this.column.id),
                async () => {
                  const createdColumnId =
                    await CmpRef.cmp.addResourcePlanningColumn();
                  if (this.column.id < 0) {
                    this.column.id = history.getRealId(this.column.id);
                  }
                  const oldColumnId = this.column.id;
                  history.setTempId(this.column.id, createdColumnId);
                  CmpRef.cmp.updateColumnFromPlanning(
                    createdColumnId,
                    this.column.textContent
                  );
                  CmpRef.cmp.updateResourcePlanningColumnValueColumnIdsWithNewColumnId(
                    oldColumnId,
                    createdColumnId
                  );
                  return true;
                }
              );
              this.parent.getParent().refreshDisplay();
            }
          );
        }
        dropdownMenu.open();
      });
    }
  }

  createColumnText() {
    this.columnText = new TextRenderer(
      CmpRef.cmp.getTranslate().instant(this.column.textContent.toString()),
      this.canvas,
      this
    );
    this.columnText.updateTextDimensions();
    this.columnText.setColor("white");
    this.columnText.setAlignment("center", "center");
  }

  getColumn() {
    return this.column;
  }
  setColumnIndex(index: number) {
    this.columnIndex = index;
  }

  move(x: number): void {
    this.setX(this.getX() + x);
  }

  override setX(x: number) {
    super.setX(x);
    if (this.column) {
      this.column.x = x;
    }
  }

  override setWidth(width: number) {
    super.setWidth(width);
    if (this.column) {
      this.column.width = width;
    }
  }

  resize(
    amountResized: number,
    anchor: "left" | "up" | "right" | "down"
  ): void {
    switch (anchor) {
      case "left":
        if (this.leftColumn.getWidth() + amountResized < this.minWidth) {
          this.leftColumn.setWidth(this.minWidth);
          return;
        }

        this.parent.removeAllChildren();
        this.parent.getParent().renderAllHeadColumns();

        this.leftColumn.setWidth(this.leftColumn.getWidth() + amountResized);
        return;
      case "right":
        if (this.getWidth() + amountResized < this.minWidth) {
          this.setWidth(this.minWidth);
          return;
        }

        this.parent.removeAllChildren();
        this.parent.getParent().renderAllHeadColumns();

        this.setWidth(this.getWidth() + amountResized);
        return;
      case "up":
        throw Error("Not Implemented");
      case "down":
        throw Error("Not Implemented");
    }
  }

  setMoveAndResizeEvents(e) {
    document.body.style.cursor = "e-resize";

    this.mouseMoveHandler = (e) => {
      this.mouseAction = "move";
      this.move(e.movementX);
    };

    if (e.layerX <= this.getGlobalX() + 5 && this.columnIndex !== 0) {
      this.mouseAction = "resize";
      document.body.style.cursor = "col-resize";

      this.leftColumn = this.parent.getChildren()[this.columnIndex];
      this.mouseMoveHandler = (e) => {
        this.resize(e.movementX, "left");
      };
    }

    if (e.layerX >= this.getGlobalX() + this.getWidth() - 5) {
      this.mouseAction = "resize";
      document.body.style.cursor = "col-resize";

      this.leftColumn = null;
      this.mouseMoveHandler = (e) => {
        this.resize(e.movementX, "right");
      };
    }
  }

  private mouseMoveHandler(e) {}

  override draw() {
    this.canvas.getContext().save();

    this.drawShape(this.canvas.getContext());
    this.canvas.getContext().clip();
    this.children.forEach((child) => child.draw());

    this.canvas.getContext().restore();
  }
}
