import { Canvas } from "src/app/canvas-ui/Canvas";
import { GenericContainer } from "src/app/canvas-ui/GenericContainer";
import { TextRenderer } from "src/app/canvas-ui/TextRenderer";
import { CpspRef } from "../../CpspRef";
import { GenericRoundedContainer } from "src/app/canvas-ui/GenericRoundedContainer";
import { ConfigSc } from "../../Config";
import { Line } from "src/app/canvas-ui/Line";
import { AScrollableContainerSchedule } from "src/app/canvas-ui/AScrollableContainerSchedule";

export class ResourcePlanningContainer extends AScrollableContainerSchedule {
  private resourceListContainer: GenericContainer;

  constructor(
    x: number,
    y: number,
    width: string | number,
    height: string | number,
    canvas: Canvas,
    parent
  ) {
    super(x, y, width, height, canvas, parent);
    this.addResourceListContainer();
  }


  addAllDisplayResourcesThatFitContainer() {
    CpspRef.cmp.calculateResourceWorkers()
    const index =
      CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.getCurrentDisplayMonthIndex();
    for (
      let i = index,
        n =
          CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.getLastMonthIndexToFitInContainerView();
      i <= n;
      i++
    ) {
      this.addResourceWeeksOfMonth(i);
    }
  }

  getResourceListContainer() {
    return this.resourceListContainer;
  }

  addResourceListContainer() {
    this.resourceListContainer = new GenericContainer(
      0,
      0,
      "100%",
      this.getHeight(),
      this.canvas,
      this.innerContainer
    );
    this.resourceListContainer.setBackgroundColor("white");
  }

  addResourceWeeksOfMonth(monthIndex: number) {
    const allDisplayMonths =
      CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.getAllDisplayMonths();

    if (monthIndex < 0 || monthIndex > allDisplayMonths.length - 1) {
      return;
    }
    const displayMonth = allDisplayMonths[monthIndex];

    const resourceMonthContainer = new GenericContainer(
      displayMonth.x * CpspRef.cmp.pixelRation,
      0,
      displayMonth.days.length * ConfigSc.cellWidth * CpspRef.cmp.pixelRation,
      this.resourceListContainer.getHeight(),
      this.canvas,
      this.resourceListContainer
    );


    let numberOfDaysInWeek = 0;
    let weekX = 0;
    for (let i = 0, n = displayMonth.days.length; i < n; i++) {
      numberOfDaysInWeek++;

      if (
        i !== n - 1 &&
        displayMonth.days[i].week === displayMonth.days[i + 1].week
      ) {
        continue;
      }

      let x = 0;
      let additionalWeeks = 0;

      if (numberOfDaysInWeek < 7) {
        additionalWeeks = 7 - numberOfDaysInWeek;
        if (i !== n - 1) {
          x = additionalWeeks * ConfigSc.cellWidth;
        }
      }

      let wI = CpspRef.cmp.resourcesWorkers.findIndex((w) => w.week == `${displayMonth.days[i].weekYear}-${displayMonth.days[i].doubleDigitWeek}`);
      //65
      const numberOfWorkersWorking =
        wI != -1 ?
          Math.round(CpspRef.cmp.resourcesWorkers.at(wI).c) :
          0

        // CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getNumberOfWorkersWorkingForAllProjectsForWeek(
        //   `${displayMonth.days[i].weekYear}-${displayMonth.days[i].doubleDigitWeek}`
        // );

      if(numberOfWorkersWorking > CpspRef.cmp.maxResource)
          CpspRef.cmp.maxResource = numberOfWorkersWorking

      // const numberOfWorkersNeeded =
      //   CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getNumberOfWorkersNeededForAllProjectsForWeek();



      const resourceContainer = new GenericContainer(
        (weekX - x) * CpspRef.cmp.pixelRation ,
        0,
        (numberOfDaysInWeek + additionalWeeks) * ConfigSc.cellWidth * CpspRef.cmp.pixelRation ,
        resourceMonthContainer.getHeight(),
        this.canvas,
        resourceMonthContainer
      );
      resourceContainer.setBackgroundColor("#201F1F");
      resourceContainer.setBorder("#201F1F",1);




      const numberOfWorkersNeededContainer = new GenericRoundedContainer(
        0,
        0 + this.getHeight() / 26,
        resourceContainer.getWidth(),
        (2*this.getHeight() ) / 3  - 1,
        this.canvas,
        resourceContainer
      );
      numberOfWorkersNeededContainer.setBackgroundColor("white");
      numberOfWorkersNeededContainer.setBorder("#201F1F", 1);
      numberOfWorkersNeededContainer.setBorderRoundness(3);



      const newY = numberOfWorkersWorking/(CpspRef.cmp.maxResource*1.1);

      const numberOfWorkersWorkingContainer = new GenericRoundedContainer(
        0+1,
        //numberOfWorkersNeededContainer.getHeight()-numberOfWorkersWorking,
        numberOfWorkersNeededContainer.getHeight()- Math.ceil(numberOfWorkersNeededContainer.getHeight()*newY),
        numberOfWorkersNeededContainer.getWidth()-1,
        //numberOfWorkersWorking,
        Math.ceil(numberOfWorkersNeededContainer.getHeight()*newY),
        this.canvas,
        numberOfWorkersNeededContainer
      );
      numberOfWorkersWorkingContainer.setBackgroundColor("#BFD0E5");
      numberOfWorkersWorkingContainer.setBorderRoundness(3,false,false,true,true);






      const step=10;




      for(let i=0;i<65 - step;i+=step){

        const line_above=new Line(
          4,
          numberOfWorkersNeededContainer.getHeight()-(i+10),
          numberOfWorkersNeededContainer.getWidth()+4,
          numberOfWorkersNeededContainer.getHeight()-(i+10),
          numberOfWorkersNeededContainer.getCanvas(),
          numberOfWorkersNeededContainer
        );
        line_above.setColor("#707070");
        line_above.setLineThickness(0.5);
      }



      const result = numberOfWorkersWorking ;
      let resultAsText = result.toString();
      if (result > 0) {
        resultAsText = `${resultAsText}`;
      }

      const resultsContainer = new GenericRoundedContainer(
        0,
        (this.getHeight()-(this.getHeight() / 5)-6),
        resourceContainer.getWidth()  ,
        this.getHeight() / 5,
        this.canvas,
        resourceContainer
      );
      resultsContainer.setBackgroundColor("white");
      resultsContainer.setBorder("#201F1F", 1);
      resultsContainer.setBorderRoundness(3);

      const resultsText = new TextRenderer(
        resultAsText,
        this.canvas,
        resultsContainer
      );

      resultsText.setAlignment("center", "center");
      resultsText.setFontSize(16);
      resultsText.updateTextDimensions();

      weekX += ConfigSc.cellWidth * numberOfDaysInWeek;
      numberOfDaysInWeek = 0;
    }
  }

  refreshDisplay() {
    // CpspRef.cmp.maxResource = 0;
    // if(!CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.isVisible) return;
    this.getResourceListContainer().removeAllChildren();
    this.addAllDisplayResourcesThatFitContainer();
    this.draw();
    if(CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningHeadingsContainer){
      CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningHeadingsContainer.displayResourcePlanningHeadings()
      CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningHeadingsContainer.draw()
      CpspRef.cmp.projectSchedulePlanerApp.showHideResourcePlanning.draw()
    }

  }
}
