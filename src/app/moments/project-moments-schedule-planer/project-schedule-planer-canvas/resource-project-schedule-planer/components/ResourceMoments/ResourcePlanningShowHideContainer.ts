import { ARoundedContainer } from "src/app/canvas-ui/ARoundedContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { Rectangle } from "src/app/canvas-ui/Rectangle";
import { TextRenderer } from "src/app/canvas-ui/TextRenderer";
import { CpspRef } from "../../CpspRef";
import { ConfigSc } from "../../Config";

export class ResourcePlanningShowHideContainer extends ARoundedContainer {
  private arrow: Rectangle;
  constructor(
    x: number,
    y: number,
    width: string | number,
    height: string | number,
    canvas: Canvas,
    parent
  ) {
    super(x, y, width, height, canvas, parent);

    this.setBorder("#B8B8B8", 1);
    this.setBackgroundColor("#1A1A1A");
    this.setBorderRoundness(6, true, false, false, false);

    this.displayContent();

    this.setOnClickHandler(() => {
      CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.isVisible =
        !CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.isVisible;
      CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningHeadingsContainer.isVisible =
        !CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningHeadingsContainer.isVisible;
      if (!CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.isVisible) {
        this.arrow.removeBackgroundImagePattern("resources-close");
        this.arrow.addBackgroundImagePattern(
          "resources-open",
          "resources-open",
          8,
          13
        );
        this.hideResource();
        // this.setX(CpspRef.cmp.projectSchedulePlanerApp.momentsCanvas.getWidth() - 40);
        CpspRef.cmp.projectSchedulePlanerApp.resourcesCanvas.setWidth(CpspRef.cmp.projectSchedulePlanerApp.showHideResourcePlanning.getWidth())
        CpspRef.cmp.projectSchedulePlanerApp.resourcesCanvas.setCanvasElementPosition({
          left: 0 ,
          bottom: ConfigSc.scrollbarSize,
          right: 15
        });
        //this.setX(CpspRef.cmp.projectSchedulePlanerApp.resourcesCanvas.getWidth() - 40);
        this.setX(0);
      } else {
        this.arrow.removeBackgroundImagePattern("resources-open");
        this.arrow.addBackgroundImagePattern(
          "resources-close",
          "resources-close",
          8,
          13
        );
        // this.setX(
        //   ConfigSc.sideCanvasSize -
        //     CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningHeadingsContainer.getWidth() -
        //     40 - 357
        // );
        CpspRef.cmp.projectSchedulePlanerApp.resourcesCanvas.setWidth(window.innerWidth - ConfigSc.sidebarSize - ConfigSc.scrollbarSize - (ConfigSc.sideCanvasSize - 243))
        CpspRef.cmp.projectSchedulePlanerApp.resourcesCanvas.setCanvasElementPosition({
          left: ConfigSc.sidebarSize + (ConfigSc.sideCanvasSize - 243) ,
          bottom: ConfigSc.scrollbarSize,
          right: 0
        });
        this.setX(0)

        CpspRef.cmp.projectSchedulePlanerApp.resourcesCanvas
          .getChildren()
          .forEach((child) => child.draw());
        CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();

      }

      this.draw();
    });
  }

  clickOnHide(){

      if (CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.isVisible) {
        CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.isVisible =
        !CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.isVisible;
      CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningHeadingsContainer.isVisible =
        !CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningHeadingsContainer.isVisible;
        this.arrow.removeBackgroundImagePattern("resources-close");
        this.arrow.addBackgroundImagePattern(
          "resources-open",
          "resources-open",
          8,
          13
        );
        this.hideResource();
        // this.setX(CpspRef.cmp.projectSchedulePlanerApp.momentsCanvas.getWidth() - 40);
        CpspRef.cmp.projectSchedulePlanerApp.resourcesCanvas.setWidth(CpspRef.cmp.projectSchedulePlanerApp.showHideResourcePlanning.getWidth())
        CpspRef.cmp.projectSchedulePlanerApp.resourcesCanvas.setCanvasElementPosition({
          left: 0 ,
          bottom: ConfigSc.scrollbarSize,
          right: 15
        });
        this.setX(0);
      }

      this.draw();
  }
// CpspRef.cmp.projectSchedulePlanerApp.momentsCanvas.getWidth(),
//         CpspRef.cmp.projectSchedulePlanerApp.momentsCanvas.getHeight()
  hideResource() {
    this.canvas.getContext().save();
    this.canvas
      .getContext()
      .clearRect(
        0,
        0,
        CpspRef.cmp.projectSchedulePlanerApp.resourcesCanvas.getWidth(),
        CpspRef.cmp.projectSchedulePlanerApp.resourcesCanvas.getHeight()
      );
    this.canvas.getContext().restore();
  }

  displayContent() {
    this.arrow = new Rectangle(15, 15, 10, 14, this.canvas, this);
    this.arrow.addBackgroundImagePattern(
      "resources-close",
      "resources-close",
      8,
      13
    );

    const text = new TextRenderer("RESURS", this.canvas, this); // CpspRef.cmp.getTranslate().instant('Resource').toUpperCase()
    text.setAngleOfRotation(90);
    text.setAlignment("left", "top");
    text.setFontSize(17);
    text.setColor("white");
    text.setX(-15);
    text.setY(40);
    text.updateTextDimensions();
  }
}
