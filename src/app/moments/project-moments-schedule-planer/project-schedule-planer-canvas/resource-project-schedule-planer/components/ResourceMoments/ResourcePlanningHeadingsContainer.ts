import { AContainer } from "src/app/canvas-ui/AContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { GenericRoundedContainer } from "src/app/canvas-ui/GenericRoundedContainer";
import { TextRenderer } from "src/app/canvas-ui/TextRenderer";
import { CpspRef } from "../../CpspRef";

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
    resourceContainer.setBackgroundColor("#1A1A1A");
    resourceContainer.setBorder("#B8B8B8", 1);

    const resourceNeedsContainer = new GenericRoundedContainer(
      this.getWidth() / 3,
      0 + this.getHeight() / 26,
      "66%",
      (2*this.getHeight() ) / 3  - 1,
      this.canvas,
      this
    );
    resourceNeedsContainer.setBackgroundColor("white");
    resourceNeedsContainer.setBorder("#201F1F", 2);
    resourceNeedsContainer.setBorderRoundness(3);


    //65
    // const numberOfWorkersNeeded =
    // CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getNumberOfWorkersNeededForAllProjectsForWeek();


    //const step=10;
    var step=(CpspRef.cmp.maxResource*1.1)/7;
    //var step=Math.ceil((CpspRef.cmp.maxResource)/7);

    /*const resourceNeedsText = new TextRenderer(
      CpspRef.cmp.getTranslate().instant(""+10),
      this.canvas,
      resourceNeedsContainer
    );
    resourceNeedsText.setAlignment("right", "center");
    resourceNeedsText.setX(15);
    resourceNeedsText.setY(10);
    resourceNeedsText.updateTextDimensions();*/


    var k=0;

    //for(let i=0;i<65;i+=step){
    for(let i=0;i<Math.ceil(CpspRef.cmp.maxResource*1.1);i+=step){
      const resourceNeedsText = new TextRenderer(
        CpspRef.cmp.getTranslate().instant(""+i.toFixed(0)),
        //CpspRef.cmp.getTranslate().instant(""+i),
        this.canvas,
        resourceNeedsContainer
      );
      resourceNeedsText.setAlignment("right", "top");
      resourceNeedsText.setFontSize(7);
      resourceNeedsText.setX(resourceNeedsContainer.getWidth()-15);
      resourceNeedsText.setY(resourceNeedsContainer.getHeight()-(6+k))
      k+=10;
    }

    /*const resourceNeedsText = new TextRenderer(
      CpspRef.cmp.getTranslate().instant("Resource needs"),
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
      CpspRef.cmp.getTranslate().instant("Available workers"),
      this.canvas,
      availableWorkersContainer
    );
    availableWorkersText.setAlignment("left", "center");
    availableWorkersText.setX(10);
    availableWorkersText.updateTextDimensions();*/






    const resourcesContainer = new GenericRoundedContainer(
      this.getWidth() / 3,
      (this.getHeight()-(this.getHeight() / 5)-6),
      "66%",
      this.getHeight() / 5,
      this.canvas,
      this
    );
    resourcesContainer.setBackgroundColor("white");
    resourcesContainer.setBorder("#201F1F", 2);
    resourcesContainer.setBorderRoundness(3);


    const resourcesText = new TextRenderer(
      CpspRef.cmp.getTranslate().instant("Resources"),
      this.canvas,
      resourcesContainer
    );
    resourcesText.setAlignment("left", "center");
    resourcesText.setX(10);
    resourcesText.setFontSize(16);
    resourcesText.updateTextDimensions();
  }
}
