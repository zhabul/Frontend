import { Canvas } from "src/app/canvas-ui/Canvas";
import { DropdownMenu } from "src/app/canvas-ui/DropdownMenu";
import { GenericContainer } from "src/app/canvas-ui/GenericContainer";
import { Rectangle } from "src/app/canvas-ui/Rectangle";
import historySchedulePlaner from 'src/app/canvas-ui/history/historySchedulePlaner';

import { ConfigSc } from "../../../Config";
import { CpspRef } from "../../../CpspRef";
import { ProjectMomentsTableHeadColumn } from "./ProjectMomentsTableHeadColumn";
import { AScrollableContainerSchedule } from "src/app/canvas-ui/AScrollableContainerSchedule";

export class ProjectMomentsTableHead extends AScrollableContainerSchedule {
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
    this.setBackgroundColor('#1A1A1A');
    this.setBorder('#1A1A1A', 1);
    this.sortColumns();
    this.renderAllHeadColumns();
    this.renderColumnHeader();
    this.updateInnerContainerWidth();
  }

  updateInnerContainerWidth() {
    const lastColumnIndex = CpspRef.cmp.visibleColumns.length - 1;
    this.getInnerContainer().setWidth(
      CpspRef.cmp.visibleColumns[lastColumnIndex].x +
      CpspRef.cmp.visibleColumns[lastColumnIndex].width - ConfigSc.sidebarSize
    );
  }

  renderAllHeadColumns() {
    this.renderThreeVerticalDotsColumn();

    CpspRef.cmp.visibleColumns = CpspRef.cmp.allColumns.filter(c => c.isVisible);
    CpspRef.cmp.visibleColumns.forEach((c, i) => {
        this.renderHeadColumn(i);
    });
  }

  private renderThreeVerticalDotsColumn() {
    const columnContainer = new GenericContainer(
      0,
      this.getHeight() - ProjectMomentsTableHead.columnHeight,
      ProjectMomentsTableHead.threeVerticalDotsColumnWidth,
      ProjectMomentsTableHead.columnHeight,
      this.canvas,
      this.innerContainer
    );
    columnContainer.setBackgroundColor('#1A1A1A');
    columnContainer.setBorder('#858585', 1);
  }

  private renderHeadColumn(columnIndex: number) {
    const column = CpspRef.cmp.visibleColumns[columnIndex];
    if (columnIndex === 0) {
        column.x = ProjectMomentsTableHead.threeVerticalDotsColumnWidth + ConfigSc.sidebarSize;
    } else {
        column.x = CpspRef.cmp.visibleColumns[columnIndex - 1].x + CpspRef.cmp.visibleColumns[columnIndex - 1].width;
    }

    const columnContainer = new ProjectMomentsTableHeadColumn(
      column.x - ConfigSc.sidebarSize,
      this.getHeight() - ProjectMomentsTableHead.columnHeight,
      column.width,
      ProjectMomentsTableHead.columnHeight,
      this.canvas,
      this.innerContainer,
      column
    );
    columnContainer.setColumnIndex(columnIndex);
    columnContainer.setBackgroundColor('#1A1A1A');
    columnContainer.setBorder('#858585', 1);
  }

  private renderColumnHeader() {
    this.columnHeader = new GenericContainer(0, 0, '100%', this.getHeight() - ProjectMomentsTableHead.columnHeight, this.canvas, this);
    if(ConfigSc.isInEditMode) {
      this.columnHeader.setOnMouseRightClickHandler((e) => {
          const dropdownMenu = new DropdownMenu(e.layerX, e.layerY, 200, 200, this.canvas);
          // CpspRef.cmp.allColumns.forEach((c, i) => {
          //     if (c.isVisible) return;
          //     dropdownMenu.addOption(`${CpspRef.cmp.getTranslate().instant('Show')} "${CpspRef.cmp.getTranslate().instant(c.textContent)}"`, (e) => {
          //         CpspRef.cmp.allColumns[i].isVisible = true;
          //         history.addToQueue(() => CpspRef.cmp.showResourcePlanningColumn(c.id), () => CpspRef.cmp.hideResourcePlanningColumn(c.id));
          //         this.refreshDisplay();
          //     });
          // });
          dropdownMenu.open();
      });
    }

    this.addColumnButton = new Rectangle(0, 0, 16, 16, this.canvas, this.columnHeader);
    this.addColumnButton.setXAlignment('right');
    this.addColumnButton.setYAlignment('center');
    this.addColumnButton.setX(-7);
    this.addColumnButton.addBackgroundImagePattern('add-new', 'add-new', 16, 16, 'no-repeat', 0, 0);

    if(ConfigSc.isInEditMode) {
        this.addColumnButton.setOnMouseHoverHandler(() => document.body.style.cursor = 'pointer');
        this.addColumnButton.setOnClickHandler(async () => {
            const newColumn = {
                id: -Math.round(Math.random() * 10000000), // placeholder id
                x: 0,
                width: 100,
                minWidth: 0,
                key: null,
                sortIndex: CpspRef.cmp.allColumns[CpspRef.cmp.allColumns.length - 1].sortIndex + 1,
                textContent: CpspRef.cmp
                .getTranslate()
                .instant("Column"),
                isVisible: true,
                values: {}
            };
            CpspRef.cmp.allColumns.push(newColumn);
            historySchedulePlaner.addToQueue(async () => {
                 const createdColumnId = await CpspRef.cmp.addScheduleColumn();
                 historySchedulePlaner.setTempId(newColumn.id, createdColumnId);
                 return true;
             }, () => CpspRef.cmp.removeScheduleColumn(newColumn.id));

            this.newColumnAdded = true;
            this.refreshDisplay();
        });
    }
  }

  sortColumns() {
    CpspRef.cmp.allColumns.sort((a, b) => {
      if (a.sortIndex < b.sortIndex) return -1;
      if (a.sortIndex > b.sortIndex) return 1;
      return 0;
    });
  }

  findColumnByXPosition(x: number, left) {
    if (x < 0) return 0;
    let index
    if(!left){
      index = CpspRef.cmp.visibleColumns.findIndex((column) => column.x > x);
      if (index === -1) return CpspRef.cmp.visibleColumns.length - 1;
    } else {
      let copyVColumns = CpspRef.cmp.deepCopy(CpspRef.cmp.visibleColumns)
      copyVColumns.sort((a, b) => {
        if (a.x < b.x) return -1;
        if (a.x > b.x) return 1;
        return 0;
      });
      index = copyVColumns.findIndex((column) => column.x == x);
      if (index === -1) return 0;
    }

    return index;
  }

  refreshDisplay() {
    this.sortColumns();
    this.innerContainer.removeAllChildren();
    this.renderAllHeadColumns();
    this.updateInnerContainerWidth();

    CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer
      .getMomentTableBodyContainer()
      .getInnerContainer()
      .setWidth(
        CpspRef.cmp.allColumns[CpspRef.cmp.allColumns.length - 1].x +
          CpspRef.cmp.allColumns[CpspRef.cmp.allColumns.length - 1].width - ConfigSc.sidebarSize
      );
    CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer
      .getMomentTableBodyContainer()
      .getHorizontalScrollbar()
      .getSlider()
      .updateSliderSize();

    if (this.newColumnAdded) {
      CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer
        .getMomentTableBodyContainer()
        .getHorizontalScrollbar()
        .getSlider()
        .move(this.parent.getWidth());
      this.newColumnAdded = false;
    }

    CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer
      .getMomentTableBodyContainer()
      .getHorizontalScrollbar()
      .draw();
    this.draw();
    CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
    if(CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer)
    CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();

  }


}
