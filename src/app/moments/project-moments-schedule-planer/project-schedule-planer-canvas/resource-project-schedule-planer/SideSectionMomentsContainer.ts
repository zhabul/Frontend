import { AScrollableContainer } from "src/app/canvas-ui/AScrollableContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { IResizable } from "src/app/canvas-ui/interfaces/IResizable";
import { Rectangle } from "src/app/canvas-ui/Rectangle";
import { ConfigSc } from "./Config";
import { CpspRef } from "./CpspRef";

export class SideSectionMomentsContainer extends AScrollableContainer implements IResizable {
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
        ConfigSc.sideCanvasSize = this.minWidth;
        CpspRef.cmp.projectSchedulePlanerApp.mainSection.setWidth(CpspRef.cmp.projectSchedulePlanerApp.mainCanvas.getWidth() - this.minWidth - 20);
        CpspRef.cmp.projectSchedulePlanerApp.mainSection.setX(this.minWidth);
        CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.setWidth(
          CpspRef.cmp.projectSchedulePlanerApp.mainSection.getWidth() - ConfigSc.scrollbarSize
        );
        this.setWidth(this.minWidth);
        CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningHeadingsContainer.displayResourcePlanningHeadings();
        return;
    }

      const columns = CpspRef.cmp.visibleColumns;
      const maxWidth = columns.at(-1).x + columns.at(-1).width - 10;
    // const maxWidth = columns[columns.length - 1].x + columns[columns.length - 1].width -12*ConfigSc.sideSectionRightBorderWidth;

    if (this.getWidth() + amountResized > maxWidth) {
        ConfigSc.sideCanvasSize = maxWidth;
        CpspRef.cmp.projectSchedulePlanerApp.mainSection.setWidth(CpspRef.cmp.projectSchedulePlanerApp.mainCanvas.getWidth() - maxWidth - 20);
        CpspRef.cmp.projectSchedulePlanerApp.mainSection.setX(maxWidth);
        CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.setWidth(CpspRef.cmp.projectSchedulePlanerApp.mainSection.getWidth() - ConfigSc.scrollbarSize);
        this.setWidth(maxWidth);
        CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningHeadingsContainer.displayResourcePlanningHeadings();
        return;
    }

    this.setWidth(this.getWidth() + amountResized);
    ConfigSc.sideCanvasSize += amountResized;

    //if resize sideSection on revision update shadow
    let shadow = document.getElementsByClassName("cdk-overlay-backdrop cdk-overlay-dark-backdrop cdk-overlay-backdrop-showing")[0] as HTMLElement;

    if(shadow)
      shadow.style.width = ConfigSc.sideCanvasSize+"px"

    CpspRef.cmp.projectSchedulePlanerApp.mainSection.setWidth(CpspRef.cmp.projectSchedulePlanerApp.mainSection.getWidth() - amountResized);
    CpspRef.cmp.projectSchedulePlanerApp.mainSection.setX(CpspRef.cmp.projectSchedulePlanerApp.mainSection.getX() + amountResized);
    CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.setWidth(CpspRef.cmp.projectSchedulePlanerApp.mainSection.getWidth() - ConfigSc.scrollbarSize);
    CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningHeadingsContainer.displayResourcePlanningHeadings();
  }

  addRightBorder() {
    this.rightBorder = new Rectangle(0, 0, ConfigSc.sideSectionRightBorderWidth, this.getHeight(), this.canvas, this);
    this.rightBorder.setBackgroundColor('#E67314');
    this.rightBorder.setXAlignment('right');
    this.rightBorder.setOnMouseHoverHandler(
      () => document.body.style.cursor = 'col-resize'
    );
    this.rightBorder.setOnMouseDownHandler(() => {
      document.body.style.cursor = 'col-resize';
      this.canvas.getChildren().forEach(child => this.canvas.addDrawingContainer(child));
      const slider = CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getMomentTableBodyContainer().getHorizontalScrollbar().getSlider();
      const rightSlider = CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getHorizontalScrollbar().getSlider();
      this.canvas.getCanvasElement().onmousemove = ev => {
          slider.updateSliderSize();
          rightSlider.updateSliderSize();
          this.resize(ev.movementX);

          CpspRef.cmp.projectSchedulePlanerApp.mainSection.setX(CpspRef.cmp.projectSchedulePlanerApp.sideSection.getWidth() + 20);
          CpspRef.cmp.projectSchedulePlanerApp.mainSection.setWidth(CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getWidth());
          //CpspRef.cmp.projectSchedulePlanerApp.mainSection.setWidth(CpspRef.cmp.projectSchedulePlanerApp.sideSection.getWidth());
          CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getHorizontalScrollbar().getSlider().updateSliderPositionIfSliderSpilledOut();
          CpspRef.cmp.projectSchedulePlanerApp.mainCanvas.getContext().save();
          CpspRef.cmp.projectSchedulePlanerApp.mainCanvas.getContext().clearRect(0, 0, CpspRef.cmp.projectSchedulePlanerApp.mainCanvas.getWidth(), CpspRef.cmp.projectSchedulePlanerApp.mainCanvas.getHeight());
          CpspRef.cmp.projectSchedulePlanerApp.mainCanvas.getContext().restore();

          CpspRef.cmp.projectSchedulePlanerApp.mainCanvas.getChildren().forEach(child => child.draw());


          if (CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.isVisible){
            CpspRef.cmp.projectSchedulePlanerApp.showHideResourcePlanning.clickOnHide()
          }



          // CpspRef.cmp.projectSchedulePlanerApp.resourcesCanvas.setWidth(CpspRef.cmp.projectSchedulePlanerApp.showHideResourcePlanning.getWidth())
          // CpspRef.cmp.projectSchedulePlanerApp.resourcesCanvas.setCanvasElementPosition({
          //   left: 0 ,
          //   bottom: ConfigSc.scrollbarSize,
          //   right: 15
          // });
          // this.setX(0);

          CpspRef.cmp.projectSchedulePlanerApp.resourcesCanvas.getContext().save();
          CpspRef.cmp.projectSchedulePlanerApp.resourcesCanvas
            .getContext()
            .clearRect(
              0,
              0,
              CpspRef.cmp.projectSchedulePlanerApp.resourcesCanvas.getWidth(),
              CpspRef.cmp.projectSchedulePlanerApp.resourcesCanvas.getHeight()
            );
          CpspRef.cmp.projectSchedulePlanerApp.resourcesCanvas.getContext().restore();

          CpspRef.cmp.projectSchedulePlanerApp.resourcesCanvas
            .getChildren()
            .forEach((child) => child.draw());

      }



      this.addRemoveEventsForMouseDownEvent(() => {
          this.canvas.resetDrawingContainers();
          window.localStorage.setItem('resource_planning_side_menu_width', this.getWidth().toString());
          document.body.style.cursor = 'default';
      });
    });
  }

  addRightScrollBorder() {
    this.rightBottomBorder = new Rectangle(
      0,
      this.getHeight() - ConfigSc.scrollbarSize,
      ConfigSc.sideSectionRightBorderWidth,
      ConfigSc.scrollbarSize,
      this.canvas,
      this
    );
    this.rightBottomBorder.setBackgroundColor("#373B40");
    this.rightBottomBorder.setXAlignment("right");
    this.rightBottomBorder.setOnMouseHoverHandler(
      () => {document.body.style.cursor = "col-resize";}
    );
    this.rightBottomBorder.setOnMouseDownHandler(() => {
      document.body.style.cursor = "col-resize";
      this.canvas
        .getChildren()
        .forEach((child) => this.canvas.addDrawingContainer(child));
      const slider = CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer
        .getMomentTableBodyContainer()
        .getHorizontalScrollbar()
        .getSlider();
      const rightSlider = CpspRef.cmp.projectSchedulePlanerApp.gridContainer
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
