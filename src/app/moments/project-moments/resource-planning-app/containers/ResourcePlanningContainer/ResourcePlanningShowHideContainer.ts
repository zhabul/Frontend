import { ARoundedContainer } from "src/app/canvas-ui/ARoundedContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { Rectangle } from "src/app/canvas-ui/Rectangle";
import { TextRenderer } from "src/app/canvas-ui/TextRenderer";
import { CmpRef } from "../../CmpRef";
import { Config } from "../../Config";

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

    this.setBorder("#858585", 1);
    this.setBorderRoundness(6, true, false, false, false);

    this.displayContent();

    this.setOnClickHandler(() => {
      CmpRef.cmp.planningApp.resourcePlanningContainer.isVisible =
        !CmpRef.cmp.planningApp.resourcePlanningContainer.isVisible;
      CmpRef.cmp.planningApp.resourcePlanningHeadingsContainer.isVisible =
        !CmpRef.cmp.planningApp.resourcePlanningHeadingsContainer.isVisible;
      if (!CmpRef.cmp.planningApp.resourcePlanningContainer.isVisible) {
        this.arrow.removeBackgroundImagePattern("resources-close");
        this.arrow.addBackgroundImagePattern(
          "resources-open",
          "resources-open",
          8,
          13
        );
        this.hideResource();
        this.setX(CmpRef.cmp.planningApp.resourcesCanvas.getWidth() - 40);
      } else {
        this.arrow.removeBackgroundImagePattern("resources-open");
        this.arrow.addBackgroundImagePattern(
          "resources-close",
          "resources-close",
          8,
          13
        );
        this.setX(
          Config.sideCanvasSize -
            CmpRef.cmp.planningApp.resourcePlanningHeadingsContainer.getWidth() -
            40
        );
        CmpRef.cmp.planningApp.resourcesCanvas
          .getChildren()
          .forEach((child) => child.draw());
      }

      this.draw();
    });
  }

  hideResource() {
    this.canvas.getContext().save();
    this.canvas
      .getContext()
      .clearRect(
        0,
        0,
        CmpRef.cmp.planningApp.resourcesCanvas.getWidth(),
        CmpRef.cmp.planningApp.resourcesCanvas.getHeight()
      );
    this.canvas.getContext().restore();
  }

  displayContent() {
    this.arrow = new Rectangle(15, 5, 10, 20, this.canvas, this);
    this.arrow.addBackgroundImagePattern(
      "resources-close",
      "resources-close",
      8,
      13
    );

    const text = new TextRenderer("RESURS", this.canvas, this); // CmpRef.cmp.getTranslate().instant('Resource').toUpperCase()
    text.setAngleOfRotation(90);
    text.setAlignment("left", "top");
    text.setFontSize(14);
    text.setColor("white");
    text.setX(-15);
    text.setY(25);
    text.updateTextDimensions();
  }
}
