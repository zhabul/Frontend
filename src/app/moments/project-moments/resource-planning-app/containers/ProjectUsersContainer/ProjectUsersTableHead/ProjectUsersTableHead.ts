import { AScrollableContainer } from "src/app/canvas-ui/AScrollableContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { DropdownMenu } from "src/app/canvas-ui/DropdownMenu";
import { GenericContainer } from "src/app/canvas-ui/GenericContainer";
import history from "src/app/canvas-ui/history/history";
import { Rectangle } from "src/app/canvas-ui/Rectangle";
import { CmpRef } from "../../../CmpRef";
import { Config } from "../../../Config";
import { TableHeadColumn } from "./TableHeadColumn";

export class ProjectUsersTableHead extends AScrollableContainer {
  static threeVerticalDotsColumnWidth = 20;
  static columnHeight = 20;
  private columnHeader: GenericContainer;
  private addColumnButton: Rectangle;
  private newColumnAdded: boolean = false;

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
    this.sortColumns();
    this.renderAllHeadColumns();
    this.renderColumnHeader();
    this.updateInnerContainerWidth();
  }

  updateInnerContainerWidth() {
    const lastColumnIndex = CmpRef.cmp.visibleColumns.length - 1;
    this.getInnerContainer().setWidth(
      CmpRef.cmp.visibleColumns[lastColumnIndex].x +
        CmpRef.cmp.visibleColumns[lastColumnIndex].width
    );
  }

  renderAllHeadColumns() {
    this.renderThreeVerticalDotsColumn();

    CmpRef.cmp.visibleColumns = CmpRef.cmp.allColumns.filter(
      (c) => c.isVisible
    );
    CmpRef.cmp.visibleColumns.forEach((c, i) => {
      this.renderHeadColumn(i);
    });
  }

  private renderHeadColumn(columnIndex: number) {
    const column = CmpRef.cmp.visibleColumns[columnIndex];
    if (columnIndex === 0) {
      column.x = ProjectUsersTableHead.threeVerticalDotsColumnWidth;
    } else {
      column.x =
        CmpRef.cmp.visibleColumns[columnIndex - 1].x +
        CmpRef.cmp.visibleColumns[columnIndex - 1].width;
    }

    const columnContainer = new TableHeadColumn(
      column.x,
      this.getHeight() - ProjectUsersTableHead.columnHeight,
      column.width,
      ProjectUsersTableHead.columnHeight,
      this.canvas,
      this.innerContainer,
      column
    );
    columnContainer.setColumnIndex(columnIndex);
    columnContainer.setBackgroundColor("#1A1A1A");
    columnContainer.setBorder("#858585", 1);
  }

  private renderThreeVerticalDotsColumn() {
    const columnContainer = new GenericContainer(
      0,
      this.getHeight() - ProjectUsersTableHead.columnHeight,
      ProjectUsersTableHead.threeVerticalDotsColumnWidth,
      ProjectUsersTableHead.columnHeight,
      this.canvas,
      this.innerContainer
    );
    columnContainer.setBackgroundColor("#1A1A1A");
    columnContainer.setBorder("#858585", 1);
  }

  private renderColumnHeader() {
    this.columnHeader = new GenericContainer(
      0,
      0,
      "100%",
      this.getHeight() - ProjectUsersTableHead.columnHeight,
      this.canvas,
      this
    );
    if (Config.isInEditMode) {
      this.columnHeader.setOnMouseRightClickHandler((e) => {
        const dropdownMenu = new DropdownMenu(
          e.layerX,
          e.layerY,
          200,
          200,
          this.canvas
        );
        CmpRef.cmp.allColumns.forEach((c, i) => {
          if (c.isVisible) return;
          dropdownMenu.addOption(
            `${CmpRef.cmp.getTranslate().instant("Show")} "${CmpRef.cmp
              .getTranslate()
              .instant(c.textContent)}"`,
            (e) => {
              CmpRef.cmp.allColumns[i].isVisible = true;
              history.addToQueue(
                () => CmpRef.cmp.showResourcePlanningColumn(c.id),
                () => CmpRef.cmp.hideResourcePlanningColumn(c.id)
              );
              this.refreshDisplay();
            }
          );
        });
        dropdownMenu.open();
      });
    }

    this.addColumnButton = new Rectangle(
      0,
      0,
      16,
      16,
      this.canvas,
      this.columnHeader
    );
    this.addColumnButton.setXAlignment("right");
    this.addColumnButton.setYAlignment("center");
    this.addColumnButton.setX(-7);
    this.addColumnButton.addBackgroundImagePattern(
      "add-new",
      "add-new",
      16,
      16,
      "no-repeat",
      0,
      0
    );

    if (Config.isInEditMode) {
      this.addColumnButton.setOnMouseHoverHandler(
        () => (document.body.style.cursor = "pointer")
      );
      this.addColumnButton.setOnClickHandler(async () => {
        const newColumn = {
          id: -Math.round(Math.random() * 10000000), // placeholder id
          x: 0,
          width: 100,
          minWidth: 0,
          key: null,
          sortIndex:
            CmpRef.cmp.allColumns[CmpRef.cmp.allColumns.length - 1].sortIndex +
            1,
          textContent: "Column",
          isVisible: true,
          values: {},
        };
        CmpRef.cmp.allColumns.push(newColumn);
        history.addToQueue(
          async () => {
            const createdColumnId =
              await CmpRef.cmp.addResourcePlanningColumn();
            history.setTempId(newColumn.id, createdColumnId);
            return true;
          },
          () => CmpRef.cmp.removeResourcePlanningColumn(newColumn.id)
        );

        this.newColumnAdded = true;
        this.refreshDisplay();
      });
    }
  }

  findColumnByXPosition(x: number) {
    if (x < 0) return 0;
    const index = CmpRef.cmp.visibleColumns.findIndex((column) => column.x > x);
    if (index === -1) return CmpRef.cmp.visibleColumns.length - 1;
    return index;
  }

  refreshDisplay() {
    this.sortColumns();
    this.innerContainer.removeAllChildren();
    this.renderAllHeadColumns();
    this.updateInnerContainerWidth();
    CmpRef.cmp.planningApp.projectUsersContainer
      .getUserTableBodyContainer()
      .getInnerContainer()
      .setWidth(
        CmpRef.cmp.allColumns[CmpRef.cmp.allColumns.length - 1].x +
          CmpRef.cmp.allColumns[CmpRef.cmp.allColumns.length - 1].width
      );
    CmpRef.cmp.planningApp.projectUsersContainer
      .getUserTableBodyContainer()
      .getHorizontalScrollbar()
      .getSlider()
      .updateSliderSize();

    if (this.newColumnAdded) {
      CmpRef.cmp.planningApp.projectUsersContainer
        .getUserTableBodyContainer()
        .getHorizontalScrollbar()
        .getSlider()
        .move(this.parent.getWidth());
      this.newColumnAdded = false;
    }

    CmpRef.cmp.planningApp.projectUsersContainer
      .getUserTableBodyContainer()
      .getHorizontalScrollbar()
      .draw();
    this.draw();

    CmpRef.cmp.planningApp.projectUsersContainer.refreshDisplay();
  }

  sortColumns() {
    CmpRef.cmp.allColumns.sort((a, b) => {
      if (a.sortIndex < b.sortIndex) return -1;
      if (a.sortIndex > b.sortIndex) return 1;
      return 0;
    });
  }
}
