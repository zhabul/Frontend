import { AContainer } from "src/app/canvas-ui/AContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { GenericRoundedContainer } from "src/app/canvas-ui/GenericRoundedContainer";
import { TextRenderer } from "src/app/canvas-ui/TextRenderer";
import { CmpRef } from "../../CmpRef";

export class ResourcePlanningHeadingsContainer extends AContainer {
  constructor(
    x: number,
    y: number,
    width: string | number,
    height: string | number,
    canvas: Canvas,
    parent
  ) {
    super(x, y, width, height, canvas, parent);

    this.displayResourcePlanningHeadings();
  }

  displayResourcePlanningHeadings() {
    const resourceContainer = new GenericRoundedContainer(
      0,
      0,
      "100%",
      this.getHeight(),
      this.canvas,
      this
    );
    resourceContainer.setBackgroundColor("#201F1F");
    resourceContainer.setBorder("#858585", 1);

    const resourceNeedsContainer = new GenericRoundedContainer(
      this.getWidth() / 3,
      0 + this.getHeight() / 12,
      "66%",
      this.getHeight() / 4,
      this.canvas,
      this
    );
    resourceNeedsContainer.setBackgroundColor("white");
    resourceNeedsContainer.setBorder("#201F1F", 2);
    resourceNeedsContainer.setBorderRoundness(3);

    const resourceNeedsText = new TextRenderer(
      CmpRef.cmp.getTranslate().instant("Resource needs"),
      this.canvas,
      resourceNeedsContainer
    );
    resourceNeedsText.setAlignment("left", "center");
    resourceNeedsText.setX(10);
    resourceNeedsText.updateTextDimensions();

    const availableWorkersContainer = new GenericRoundedContainer(
      this.getWidth() / 3,
      this.getHeight() / 3,
      "66%",
      this.getHeight() / 4,
      this.canvas,
      this
    );
    availableWorkersContainer.setBackgroundColor("white");
    availableWorkersContainer.setBorder("#201F1F", 2);
    availableWorkersContainer.setBorderRoundness(3);

    const availableWorkersText = new TextRenderer(
      CmpRef.cmp.getTranslate().instant("Available workers"),
      this.canvas,
      availableWorkersContainer
    );
    availableWorkersText.setAlignment("left", "center");
    availableWorkersText.setX(10);
    availableWorkersText.updateTextDimensions();

    const differenceContainer = new GenericRoundedContainer(
      this.getWidth() / 3,
      (this.getHeight() / 3) * 2,
      "66%",
      this.getHeight() / 4,
      this.canvas,
      this
    );
    differenceContainer.setBackgroundColor("white");
    differenceContainer.setBorder("#201F1F", 2);
    differenceContainer.setBorderRoundness(3);

    const differenceText = new TextRenderer(
      CmpRef.cmp.getTranslate().instant("Difference"),
      this.canvas,
      differenceContainer
    );
    differenceText.setAlignment("left", "center");
    differenceText.setX(10);
    differenceText.updateTextDimensions();
  }
}
