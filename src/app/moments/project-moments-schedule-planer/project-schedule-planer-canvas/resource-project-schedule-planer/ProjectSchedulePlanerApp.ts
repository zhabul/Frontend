import { IOffscreenCanvas } from "src/app/canvas-ui/interfaces/IOffscreenCanvas";
import { OffScreenCanvas } from "src/app/canvas-ui/OffScreenCanvas";
import { Rectangle } from "src/app/canvas-ui/Rectangle";
import { ProjectSchedulePlanerCanvasComponent } from "../project-schedule-planer-canvas.component";
import { DaysMonthsContainer } from "./components/DaysMonthsContainer";
import { GridContainer } from "./components/GridContainer/GridContainer";
import { GridHorizontalScrollbar } from "./components/GridContainer/HorizontalScrollbar/GridHorizontalScrollbar";
import { Header } from "./components/Header";
import { ProjectMomentsContainer } from "./components/ProjectMoments/ProjectMomentsContainer";
import { ConfigSc } from "./Config";
import { CpspRef } from "./CpspRef";
import { MainSectionMomentContainer } from "./MainSectionMomentsContainer";
// import { MomentsCanvas } from "./MomentsCanvas";
import { ProjectSchaduleCanvas } from "./ProjectSchaduleCanvas";
import { SideSectionMomentsContainer } from "./SideSectionMomentsContainer";
import { ResourceCanvas } from "./ResourceCanvas";
import { ResourcePlanningContainer } from "./components/ResourceMoments/ResourcePlanningContainer";
import { ResourcePlanningHeadingsContainer } from "./components/ResourceMoments/ResourcePlanningHeadingsContainer";
import { ResourcePlanningShowHideContainer } from "./components/ResourceMoments/ResourcePlanningShowHideContainer";
import * as moment from "moment";
declare let $;


export class ProjectSchedulePlanerApp {

    public mainCanvas: ProjectSchaduleCanvas;
    public offScreenCanvas: IOffscreenCanvas;
    public mainHeader: Header;

    public resourcesCanvas: ResourceCanvas;
    public resourecesMainSection: MainSectionMomentContainer;
    public resourecesSideSection: MainSectionMomentContainer;

    // public momentsCanvas: MomentsCanvas;
    // public momentsMainSection: MainSectionMomentContainer;
    // public momentsSideSection: MainSectionMomentContainer;

    public sideSection: SideSectionMomentsContainer;
    public mainSection: MainSectionMomentContainer;

    public projectMomentsContainer: ProjectMomentsContainer;
    public gridContainer: GridContainer;
    public daysMonthsContainer: DaysMonthsContainer;
    public daysMonthsContainerRightOverlayBox: Rectangle;

    //Resources
    public resourcePlanningContainer: ResourcePlanningContainer;
    public resourcePlanningHeadingsContainer: ResourcePlanningHeadingsContainer;
    public showHideResourcePlanning: ResourcePlanningShowHideContainer;

    constructor(component: ProjectSchedulePlanerCanvasComponent,scaleX = 1, scaleY = 1) {
      this.createAllCanvasesAndComponents(component,scaleX, scaleY);
    }

  async createAllCanvasesAndComponents(component: ProjectSchedulePlanerCanvasComponent,scaleX , scaleY,onInit = true ) {
    // this.mainCanvas = new ProjectSchaduleCanvas(
    //   ConfigSc.sidebarSize,
    //   0,
    //   window.innerWidth  < 1920 ? 1920 : scaleX == 1 ? window.innerWidth - ConfigSc.sidebarSize : scaleX,
    //   //4320,
    //   scaleY == 1 ? window.innerHeight : scaleY,
    //   "mainCanvas"
    // );
    if(onInit)
    this.mainCanvas = new ProjectSchaduleCanvas(
      ConfigSc.sidebarSize,
      0,
      scaleX == 1 ? window.innerWidth - ConfigSc.sidebarSize : scaleX,
      scaleY == 1 ? window.innerHeight : scaleY,
      "mainCanvas"
    );
    // scaleX = 0.30
    // if(scaleX != 1 || scaleY != 1)
    //   this.mainCanvas.getContext().scale(scaleX,scaleY)
    this.mainCanvas.createEvents();
    CpspRef.cmp = component;

    const sideCanvasMaxWidth = CpspRef.cmp.visibleColumns.reduce((acumulator, column) => acumulator + column.width, 50);
    if (+ConfigSc.sideCanvasSize > sideCanvasMaxWidth) {
      ConfigSc.sideCanvasSize = sideCanvasMaxWidth;
      window.localStorage.setItem('resource_planning_side_menu_width', `${sideCanvasMaxWidth}`);
    }

    this.sideSection = new SideSectionMomentsContainer(
      20,
      ConfigSc.toolboxSize,
      ConfigSc.sideCanvasSize,
      this.mainCanvas.getHeight() - ConfigSc.toolboxSize,
      this.mainCanvas,
      this.mainCanvas
    );

    //margin right for sideSection
    ConfigSc.sideCanvasSize += 20;

    this.mainSection = new MainSectionMomentContainer(
      ConfigSc.sideCanvasSize,
      ConfigSc.toolboxSize,
      //  (this.mainCanvas.getWidth() *  (Math.round((1/scaleX) * 10) / 10 ) - ConfigSc.sideCanvasSize),
      this.mainCanvas.getWidth() - ConfigSc.sideCanvasSize,
      this.mainCanvas.getHeight() - ConfigSc.toolboxSize,
      this.mainCanvas,
      this.mainCanvas
    );

    this.offScreenCanvas = new OffScreenCanvas(
      0,
      0,
      this.mainCanvas.getWidth(),
      this.mainCanvas.getHeight(),
      "offscreenCanvas"
    );

    this.gridContainer = new GridContainer(
      0,
      ConfigSc.topSectionSize,
      "100%",
      this.mainSection.getHeight() - ConfigSc.topSectionSize,
      this.mainCanvas,
      this.mainSection
    );
    // if(scaleX != 1 || scaleY != 1)
    //   this.gridContainer.getInnerContainer().setWidth("100%")
    // this.gridContainer.getCanvas().getContext().scale(0.5,1)
    // this.gridContainer.getInnerContainer().setWidth("100%")
    this.gridContainer.getInnerContainer().setWidth(this.gridContainer.getInnerContainer().getWidth() * CpspRef.cmp.pixelRation)
    this.gridContainer.getInnerContainer().setRenderInOffscreen();
    this.gridContainer.setIsMouseWheelable(true);

    this.daysMonthsContainer = new DaysMonthsContainer(
      0,
      0,
      "100%",
      ConfigSc.topSectionSize,
      this.mainCanvas,
      this.mainSection
    );
    this.daysMonthsContainer.getInnerContainer().setWidth(this.daysMonthsContainer.getInnerContainer().getWidth() * CpspRef.cmp.pixelRation);
    // this.daysMonthsContainer.getInnerContainer().setWidth("100%")


    this.daysMonthsContainerRightOverlayBox = new Rectangle(
      0,
      0,
      ConfigSc.scrollbarSize,
      this.daysMonthsContainer.getHeight(),
      this.mainCanvas,
      this.mainSection
    );
    this.daysMonthsContainerRightOverlayBox.setXAlignment("right");
    this.daysMonthsContainerRightOverlayBox.setBackgroundColor("#373b40");

    const weekendPositions = this.daysMonthsContainer.getXOffsetPositionsOfWeekends();
    const weekendOffset = ((weekendPositions[0] / ConfigSc.cellWidth) - this.getNumberOfWorkingDays()) * ConfigSc.cellWidth;

    await this.offScreenCanvas
      .addBackgroundImagePattern(
        "grid-cell-week",
        "grid-cell-week",
        ConfigSc.cellWidth * 7 *CpspRef.cmp.pixelRation,
        ConfigSc.cellHeight,
        "repeat-x",
        weekendOffset * CpspRef.cmp.pixelRation
      );

    this.projectMomentsContainer = new ProjectMomentsContainer(
      0,
      0,
      "100%",
      this.sideSection.getHeight(),
      this.mainCanvas,
      this.sideSection
    );
    this.projectMomentsContainer.setIsMouseWheelable(true);
    this.projectMomentsContainer
      .getMomentTableBodyContainer()
      .getInnerContainer()
      .setBackgroundColor("#eee");
    this.projectMomentsContainer.setAllDisplayProjectsAndMomentsCoordinates();

    this.gridContainer.addHorizontalScrollbar();
    this.gridContainer.addVerticalScrollbar();

    this.gridContainer
      .getVerticalScrollbar()
      .getSlider()
      .addContainerScrollConnection(
        this.projectMomentsContainer
          .getMomentTableBodyContainer()
          .getInnerContainer()
      );
    this.gridContainer
      .getVerticalScrollbar()
      .getSlider()
      .addContainerScrollConnection(
        this.projectMomentsContainer
          .getRowNumbersContainer()
          .getRowListContainer()
          .getInnerContainer()
      );

    this.gridContainer
      .getHorizontalScrollbar()
      .getSlider()
      .addContainerScrollConnection(
        this.daysMonthsContainer
          .getInnerContainer()
      );


    this.projectMomentsContainer.refreshDisplay();
    this.projectMomentsContainer.renderDateSegmentConnections();
    this.projectMomentsContainer
      .getMomentTableBodyContainer()
      .addHorizontalScrollbar();
    this.projectMomentsContainer
      .getMomentTableBodyContainer()
      .getHorizontalScrollbar()
      .getSlider()
      .addContainerScrollConnection(
        this.projectMomentsContainer
          .getTableHeadContainer()
          .getInnerContainer()
      );

    this.mainHeader = new Header(
      0,
      0,
      this.mainCanvas.getWidth(),
      ConfigSc.toolboxSize,
      this.mainCanvas,
      this.mainCanvas
    );

    //current week dont visible
    if(moment(CpspRef.cmp.project.StartDate, ConfigSc.dateFormat).diff(ConfigSc.currentDate, "months") <= ConfigSc.numberOfPreviousMonthsToShow)
    await this.gridContainer
      .getInnerContainer()
      .addBackgroundImagePattern(
        `worker-threshold-cell-${ConfigSc.currentDate.format(
          ConfigSc.dateWeekFormat
        )}`,
        "worker-threshold-cell",
        ConfigSc.cellWidth * 7 * CpspRef.cmp.pixelRation,
        ConfigSc.cellHeight,
        "repeat-y",
        this.daysMonthsContainer.getCurrentWeekContainerX() * CpspRef.cmp.pixelRation
      );

    await this.addPlannedAbsences();

    const publicHolidayXPositions = this.daysMonthsContainer.getListOfPublicHolidayXPositions();

    for (let i = 0; i < publicHolidayXPositions.length; i++) {
      await this.offScreenCanvas
        .addBackgroundImagePattern(
          `public-holiday-cell-${i}`,
          "public-holiday-cell",
          ConfigSc.cellWidth * CpspRef.cmp.pixelRation,
          ConfigSc.cellHeight,
          "no-repeat",
          publicHolidayXPositions[i] * CpspRef.cmp.pixelRation,
          0,
          1
        );
    }

    //current day dont visible
    if(moment(this.daysMonthsContainer.findDateByXPosition(0)).format(ConfigSc.dateFormat) <= ConfigSc.currentDate.format(ConfigSc.dateFormat))
    await this.gridContainer
      .getInnerContainer()
      .addBackgroundImagePattern(
        "current-day-cell",
        "current-day-cell",
        ConfigSc.cellWidth * CpspRef.cmp.pixelRation,
        ConfigSc.cellHeight,
        "repeat-y",
        this.daysMonthsContainer.getCurrentDayContainerX() * CpspRef.cmp.pixelRation,
        0,
        1
      );

    this.sideSection.addRightBorder();
    this.sideSection.addRightScrollBorder();

    this.resourcesCanvas = new ResourceCanvas(
      0,
      0,
      window.innerWidth - ConfigSc.sidebarSize - ConfigSc.scrollbarSize,
      ConfigSc.bottomSectionSize,
      "secondCanvas"
    );
    this.resourcesCanvas.setWidth(this.resourcesCanvas.getWidth() - (ConfigSc.sideCanvasSize - 243));
    this.resourcesCanvas.setCanvasElementPosition({
      left: ConfigSc.sidebarSize + (ConfigSc.sideCanvasSize - 243),
      bottom: ConfigSc.scrollbarSize,
    });
    this.resourcesCanvas.createMouseDownEvent();

    this.resourecesMainSection = new MainSectionMomentContainer(
      ConfigSc.sideCanvasSize -(ConfigSc.sideCanvasSize - 243),
      0,
      this.gridContainer.getWidth(),
      this.resourcesCanvas.getHeight(),
      this.resourcesCanvas,
      this.resourcesCanvas
    );
    this.resourecesSideSection = new MainSectionMomentContainer(
      -(ConfigSc.sideCanvasSize - 243),
      0,
      ConfigSc.sideCanvasSize,
      this.resourcesCanvas.getHeight(),
      this.resourcesCanvas,
      this.resourcesCanvas
    );


    this.resourcePlanningContainer = new ResourcePlanningContainer(
      0,
      0,
      "100%",
      ConfigSc.bottomSectionSize,
      this.resourcesCanvas,
      this.resourecesMainSection
    );
    this.resourcePlanningContainer.setBorder("#858585", 1);
    this.resourcePlanningContainer.refreshDisplay();


    this.gridContainer
      .getHorizontalScrollbar()
      .getSlider()
      .addContainerScrollConnection(
        this.resourcePlanningContainer.getResourceListContainer()
      );

    this.resourcePlanningHeadingsContainer =
      new ResourcePlanningHeadingsContainer(
        0,
        0,
        "40%",
        ConfigSc.bottomSectionSize,
        this.resourcesCanvas,
        this.resourecesSideSection
      );
    this.resourcePlanningHeadingsContainer.setXAlignment("right");
    this.resourcePlanningHeadingsContainer.setBackgroundColor("white");

    this.showHideResourcePlanning = new ResourcePlanningShowHideContainer(
      ConfigSc.sideCanvasSize -
      this.resourcePlanningHeadingsContainer.getWidth() -
      40,
      0,
      40,
      ConfigSc.bottomSectionSize,
      this.resourcesCanvas,
      this.resourcesCanvas
    );
    this.showHideResourcePlanning.setBackgroundColor("#201F1F");


    const gridInnerContainer = this.gridContainer.getInnerContainer();

    if(gridInnerContainer.getWidth() > 32767){
      this.offScreenCanvas.setCanvasMaxSize(
        32767,
        ConfigSc.cellHeight//gridInnerContainer.getHeight()
      );
    }
    else{
      this.offScreenCanvas.setCanvasMaxSize(
        gridInnerContainer.getWidth(),
        ConfigSc.cellHeight//gridInnerContainer.getHeight()
      );
    }

    this.offScreenCanvas.setCanvasSize(
      this.gridContainer.getWidth(),
      this.gridContainer.getHeight()
    );

    if(scaleX == 1){
      (this.gridContainer.getHorizontalScrollbar() as GridHorizontalScrollbar)
      .doInitialScroll(this.daysMonthsContainer.getCurrentWeekContainerX() * CpspRef.cmp.pixelRation);
    } else {
      // let numVisible = moment(ConfigSc.latestEndDate).diff(moment(ConfigSc.earlierStartDate),"days")
      // let half = moment(ConfigSc.earlierStartDate).add(numVisible/2,"days").format(ConfigSc.dateFormat);
      (this.gridContainer.getHorizontalScrollbar() as GridHorizontalScrollbar)
      .doInitialScroll(this.daysMonthsContainer.getHalfXOfVisible());
    }

    this.mainCanvas.getChildren().forEach(child => child.draw());
    this.resourcesCanvas.getChildren().forEach((child) => child.draw());
    this.showHideResourcePlanning.clickOnHide();
    this.configElements();

  }

  async addPlannedAbsences(rerender: boolean = false) {
    if (rerender) {
      this.offScreenCanvas.removeBackgroundImagePattern(
        "planned-vacation-day-cell"
      );
      this.offScreenCanvas.removeBackgroundImagePattern(
        "planned-vacation-wekend-cell"
      );
    }

    CpspRef.cmp.planedAbsences.forEach((absence) => {
      const startDateArray = absence.startDate
        .split("-")
        .map(n => parseInt(n));
      const endDateArray = absence.endDate
        .split("-")
        .map(n => parseInt(n));

      const startDateX = (() => {
        const month = this.daysMonthsContainer
          .getAllDisplayMonths()
          .find((ym) => ym.year == startDateArray[0] && ym.month == startDateArray[1]);
        return month != undefined ? month.x + month.days.find(d => d.day == startDateArray[2]).x : null;
      })();

      const endDateX = (() => {
        const month = this.daysMonthsContainer
          .getAllDisplayMonths()
          .find((ym) => ym.year == endDateArray[0] && ym.month == endDateArray[1]);
        return month != undefined ? month.x + month.days.find(d => d.day == endDateArray[2]).x : null;
      })();

      let pbHoliday = [];
      const weekends = (() => {
        const set = new Set();

        this.daysMonthsContainer
          .getAllDisplayMonths()
          .filter((ym) => {
            return ym.year >= startDateArray[0] && ym.month >= startDateArray[1] && ym.year <= endDateArray[0] && ym.month <= endDateArray[1];
          })
          .forEach(ym => {
            ym.days.forEach(day => {
              if (day.isWeekend && day.isPlanedAbsence) {
                set.add(ym.x + day.x);
              } else if(day.isPublicHoliday && day.isPlanedAbsence){
                pbHoliday.push((ym.x + day.x) * CpspRef.cmp.pixelRation);
              }
            });
          });

        return Array.from(set);
      })();

      const plannedVacationDays = (endDateX - startDateX) / ConfigSc.cellWidth;

      for (let i = 0; i < plannedVacationDays + 1; i++) {
        this.offScreenCanvas
          .addBackgroundImagePattern(
            "planned-vacation-day-cell",
            "grid-cell-absence",
            ConfigSc.cellWidth * CpspRef.cmp.pixelRation,
            ConfigSc.cellHeight,
            "no-repeat",
            (startDateX + (ConfigSc.cellWidth * i)) * CpspRef.cmp.pixelRation,
            0,
            2
          );
      }

      weekends.forEach(async (dayX: number) => {
        this.offScreenCanvas.addBackgroundImagePattern(
          "planned-vacation-wekend-cell",
          "grid-cell-weekend",
          ConfigSc.cellWidth * CpspRef.cmp.pixelRation,
          ConfigSc.cellHeight,
          "repeat-y",
          dayX * CpspRef.cmp.pixelRation,
          0,
          3
        );
      });

      pbHoliday.forEach(dayX => {
        this.offScreenCanvas.addBackgroundImagePattern(
          "planned-vacation-wekend-cell",
          "public-holiday-cell",
          ConfigSc.cellWidth * CpspRef.cmp.pixelRation,
          ConfigSc.cellHeight,
          "repeat-y",
          dayX,
          0,
          3
        );
      });
    })

    if (rerender) {
      this.offScreenCanvas.reRender();
      this.mainCanvas.getChildren().forEach(child => child.draw());
    }
  }

  getNumberOfWorkingDays(){
    let counter = 0;

    CpspRef.cmp.workDays.forEach((day) => {
      if(day.type == "1") counter++;
    });

    return counter;
  }

  configElements() {
    if (window.innerWidth >= 1920&&ConfigSc.timePlanHeader == "Activity") {
      CpspRef.cmp.hideEditingRows(false);
    } else {
      CpspRef.cmp.hideEditingRows(true);
    }
    }


  destruct() {
    this.offScreenCanvas.destruct();
    this.mainCanvas.destruct();
  }
}
