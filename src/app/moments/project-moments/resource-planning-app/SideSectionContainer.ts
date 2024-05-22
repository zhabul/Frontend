import { AScrollableContainer } from "src/app/canvas-ui/AScrollableContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { Config } from "src/app/moments/project-moments/resource-planning-app/Config";
import { IResizable } from "src/app/canvas-ui/interfaces/IResizable";
import { Rectangle } from "src/app/canvas-ui/Rectangle";
import { CmpRef } from "./CmpRef";

export class SideSectionContainer
  extends AScrollableContainer
  implements IResizable
{
  private minWidth = 300;
  private rightBorder: Rectangle;
  private rightBottomBorder: Rectangle;

  constructor(
    x: number,
    y: number,
    width: string | number,
    height: string | number,
    canvas: Canvas,
    parent
  ) {
    super(x, y, width, height, canvas, parent);
  }

  resize(amountResized: number): void {
    if (this.getWidth() + amountResized < this.minWidth) {
      Config.sideCanvasSize = this.minWidth;
      CmpRef.cmp.planningApp.mainSection.setWidth(
        CmpRef.cmp.planningApp.mainCanvas.getWidth() - this.minWidth
      );
      CmpRef.cmp.planningApp.mainSection.setX(this.minWidth);
      CmpRef.cmp.planningApp.resourcePlanningContainer.setWidth(
        CmpRef.cmp.planningApp.mainSection.getWidth() - Config.scrollbarSize
      );
      this.setWidth(this.minWidth);
      CmpRef.cmp.planningApp.resourcePlanningHeadingsContainer.displayResourcePlanningHeadings();
      return;
    }

    const columns = CmpRef.cmp.visibleColumns;
    const maxWidth =
      columns[columns.length - 1].x +
      columns[columns.length - 1].width +
      Config.cellHeight +
      Config.sideSectionRightBorderWidth;

    if (this.getWidth() + amountResized > maxWidth) {
      Config.sideCanvasSize = maxWidth;
      CmpRef.cmp.planningApp.mainSection.setWidth(
        CmpRef.cmp.planningApp.mainCanvas.getWidth() - maxWidth
      );
      CmpRef.cmp.planningApp.mainSection.setX(maxWidth);
      CmpRef.cmp.planningApp.resourcePlanningContainer.setWidth(
        CmpRef.cmp.planningApp.mainSection.getWidth() - Config.scrollbarSize
      );
      this.setWidth(maxWidth);
      CmpRef.cmp.planningApp.resourcePlanningHeadingsContainer.displayResourcePlanningHeadings();
      return;
    }

    this.setWidth(this.getWidth() + amountResized);
    Config.sideCanvasSize += amountResized;
    CmpRef.cmp.planningApp.mainSection.setWidth(
      CmpRef.cmp.planningApp.mainSection.getWidth() - amountResized
    );
    CmpRef.cmp.planningApp.mainSection.setX(
      CmpRef.cmp.planningApp.mainSection.getX() + amountResized
    );
    CmpRef.cmp.planningApp.resourcePlanningContainer.setWidth(
      CmpRef.cmp.planningApp.mainSection.getWidth() - Config.scrollbarSize
    );
    CmpRef.cmp.planningApp.resourcePlanningHeadingsContainer.displayResourcePlanningHeadings();
  }

  addRightBorder() {
    this.rightBorder = new Rectangle(
      0,
      0,
      Config.sideSectionRightBorderWidth,
      this.getHeight(),
      this.canvas,
      this
    );
    this.rightBorder.setBackgroundColor("#E67314");
    this.rightBorder.setXAlignment("right");
    this.rightBorder.setOnMouseHoverHandler(
      () => (document.body.style.cursor = "col-resize")
    );
    this.rightBorder.setOnMouseDownHandler(() => {
      document.body.style.cursor = "col-resize";
      this.canvas
        .getChildren()
        .forEach((child) => this.canvas.addDrawingContainer(child));
      const slider = CmpRef.cmp.planningApp.projectUsersContainer
        .getUserTableBodyContainer()
        .getHorizontalScrollbar()
        .getSlider();
      const rightSlider = CmpRef.cmp.planningApp.gridContainer
        .getHorizontalScrollbar()
        .getSlider();
      this.canvas.getCanvasElement().onmousemove = (ev) => {
        slider.updateSliderSize();
        rightSlider.updateSliderSize();
        this.resize(ev.movementX);

        CmpRef.cmp.planningApp.resourecesMainSection.setX(
          CmpRef.cmp.planningApp.sideSection.getWidth()
        );
        CmpRef.cmp.planningApp.resourecesMainSection.setWidth(
          CmpRef.cmp.planningApp.gridContainer.getWidth()
        );
        CmpRef.cmp.planningApp.resourecesSideSection.setWidth(
          CmpRef.cmp.planningApp.sideSection.getWidth()
        );
        const newX =
          CmpRef.cmp.planningApp.sideSection.getWidth() * 0.6 -
          CmpRef.cmp.planningApp.showHideResourcePlanning.getWidth();
        CmpRef.cmp.planningApp.showHideResourcePlanning.setX(newX);

        CmpRef.cmp.planningApp.resourcesCanvas.getContext().save();
        CmpRef.cmp.planningApp.resourcesCanvas
          .getContext()
          .clearRect(
            0,
            0,
            CmpRef.cmp.planningApp.resourcesCanvas.getWidth(),
            CmpRef.cmp.planningApp.resourcesCanvas.getHeight()
          );
        CmpRef.cmp.planningApp.resourcesCanvas.getContext().restore();

        CmpRef.cmp.planningApp.resourcesCanvas
          .getChildren()
          .forEach((child) => child.draw());
      };
      this.addRemoveEventsForMouseDownEvent(() => {
        this.canvas.resetDrawingContainers();
        window.localStorage.setItem(
          "resource_planning_side_menu_width",
          this.getWidth().toString()
        );
        document.body.style.cursor = "default";
      });
    });
  }

  addRightScrollBorder() {
    this.rightBottomBorder = new Rectangle(
      0,
      this.getHeight() - Config.scrollbarSize,
      Config.sideSectionRightBorderWidth,
      Config.scrollbarSize,
      this.canvas,
      this
    );
    this.rightBottomBorder.setBackgroundColor("#373B40");
    this.rightBottomBorder.setXAlignment("right");
    this.rightBottomBorder.setOnMouseHoverHandler(
      () => (document.body.style.cursor = "col-resize")
    );
    this.rightBottomBorder.setOnMouseDownHandler(() => {
      document.body.style.cursor = "col-resize";
      this.canvas
        .getChildren()
        .forEach((child) => this.canvas.addDrawingContainer(child));
      const slider = CmpRef.cmp.planningApp.projectUsersContainer
        .getUserTableBodyContainer()
        .getHorizontalScrollbar()
        .getSlider();
      const rightSlider = CmpRef.cmp.planningApp.gridContainer
        .getHorizontalScrollbar()
        .getSlider();
      this.canvas.getCanvasElement().onmousemove = (ev) => {
        slider.updateSliderSize();
        rightSlider.updateSliderSize();
        this.resize(ev.movementX);
      };
      this.addRemoveEventsForMouseDownEvent(() => {
        this.canvas.resetDrawingContainers();
        window.localStorage.setItem(
          "resource_planning_side_menu_width",
          this.getWidth().toString()
        );
        document.body.style.cursor = "default";
      });
    });
  }
}
