import { Config } from "src/app/moments/project-moments/resource-planning-app/Config";
import { Rectangle } from "src/app/canvas-ui/Rectangle";
import { ProjectMomentsComponent } from "../project-moments.component";
import { CmpRef } from "./CmpRef";
import { DaysContainer } from "./containers/DaysContainer";
import { GridContainer } from "./containers/GridContainer/GridContainer";
import { GridContainerHorizontalScrollbar } from "./containers/GridContainer/HorizontalScrollbar/GridContainerHorizontalScrollbar";
import { ProjectUsersContainer } from "./containers/ProjectUsersContainer/ProjectUsersContainer";
import { ResourcePlanningContainer } from "./containers/ResourcePlanningContainer/ResourcePlanningContainer";
import { ResourcePlanningHeadingsContainer } from "./containers/ResourcePlanningContainer/ResourcePlanningHeadingsContainer";
import { ToolboxContainer } from "./containers/ToolboxContainer";
import { MainSectionContainer } from "./MainSectionContainer";
import { SideSectionContainer } from "./SideSectionContainer";
import { ResourcePlanningCanvas } from "./ResourcePlanningCanvas";
import { ResourcePlanningShowHideContainer } from "./containers/ResourcePlanningContainer/ResourcePlanningShowHideContainer";
import { ResourceCanvas } from "./ResourceCanvas";
import { OffScreenCanvas } from "src/app/canvas-ui/OffScreenCanvas";
import { IOffscreenCanvas } from "src/app/canvas-ui/interfaces/IOffscreenCanvas";

export class PlanningApp {
  public mainCanvas: ResourcePlanningCanvas;
  public offScreenCanvas: IOffscreenCanvas;

  public resourcesCanvas: ResourceCanvas;
  public resourecesMainSection: MainSectionContainer;
  public resourecesSideSection: MainSectionContainer;

  public sideSection: SideSectionContainer;
  public mainSection: MainSectionContainer;

  public toolboxContainer: ToolboxContainer;
  public projectUsersContainer: ProjectUsersContainer;
  public daysContainer: DaysContainer;
  public gridContainer: GridContainer;
  public resourcePlanningContainer: ResourcePlanningContainer;
  public resourcePlanningHeadingsContainer: ResourcePlanningHeadingsContainer;
  public daysContainerRightOverlayBox: Rectangle;
  public showHideResourcePlanning: ResourcePlanningShowHideContainer;

  constructor(component: ProjectMomentsComponent) {
    this.createAllCanvasesAndComponents(component);
  }

  async createAllCanvasesAndComponents(component: ProjectMomentsComponent) {
    this.mainCanvas = new ResourcePlanningCanvas(
      Config.sidebarSize,
      0,
      window.innerWidth - Config.sidebarSize,
      window.innerHeight,
      "mainCanvas"
    );
    this.mainCanvas.createEvents();
    CmpRef.cmp = component;

    this.sideSection = new SideSectionContainer(
      0,
      Config.toolboxSize,
      Config.sideCanvasSize,
      this.mainCanvas.getHeight() - Config.toolboxSize,
      this.mainCanvas,
      this.mainCanvas
    );
    this.mainSection = new MainSectionContainer(
      Config.sideCanvasSize,
      Config.toolboxSize,
      this.mainCanvas.getWidth() - Config.sideCanvasSize,
      this.mainCanvas.getHeight() - Config.toolboxSize,
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
      Config.topSectionSize,
      "100%",
      this.mainSection.getHeight() - Config.topSectionSize,
      this.mainCanvas,
      this.mainSection
    );
    this.gridContainer.getInnerContainer().setRenderInOffscreen();
    this.gridContainer.setIsMouseWheelable(true);

    this.daysContainer = new DaysContainer(
      0,
      0,
      "100%",
      Config.topSectionSize,
      this.mainCanvas,
      this.mainSection
    );
    this.daysContainerRightOverlayBox = new Rectangle(
      0,
      0,
      Config.scrollbarSize,
      this.daysContainer.getHeight(),
      this.mainCanvas,
      this.mainSection
    );
    this.daysContainerRightOverlayBox.setXAlignment("right");
    this.daysContainerRightOverlayBox.setBackgroundColor("#555");

    const weekendPositions = this.daysContainer.getXOffsetPositionsOfWeekends();
    const weekendOffset =
      (weekendPositions[0] / Config.cellWidth + 2 - 7) * Config.cellWidth;

    await this.offScreenCanvas.addBackgroundImagePattern(
      "grid-cell-week",
      "grid-cell-week",
      Config.cellWidth * 7,
      Config.cellHeight,
      "repeat-x",
      weekendOffset
    );

    this.resourcesCanvas = new ResourceCanvas(
      0,
      0,
      window.innerWidth - Config.sidebarSize - Config.scrollbarSize,
      Config.bottomSectionSize,
      "secondCanvas"
    );
    this.resourcesCanvas.setCanvasElementPosition({
      left: Config.sidebarSize,
      bottom: Config.scrollbarSize,
    });
    this.resourcesCanvas.createMouseDownEvent();

    this.resourecesMainSection = new MainSectionContainer(
      Config.sideCanvasSize,
      0,
      this.gridContainer.getWidth(),
      this.resourcesCanvas.getHeight(),
      this.resourcesCanvas,
      this.resourcesCanvas
    );
    this.resourecesSideSection = new MainSectionContainer(
      0,
      0,
      Config.sideCanvasSize,
      this.resourcesCanvas.getHeight(),
      this.resourcesCanvas,
      this.resourcesCanvas
    );

    this.resourcePlanningContainer = new ResourcePlanningContainer(
      0,
      0,
      "100%",
      Config.bottomSectionSize,
      this.resourcesCanvas,
      this.resourecesMainSection
    );
    this.resourcePlanningContainer.setBackgroundColor("white");
    this.resourcePlanningContainer.setBorder("#858585", 1);

    this.projectUsersContainer = new ProjectUsersContainer(
      0,
      0,
      "100%",
      this.sideSection.getHeight(),
      this.mainCanvas,
      this.sideSection
    );
    this.projectUsersContainer.setIsMouseWheelable(true);
    this.projectUsersContainer
      .getUserTableBodyContainer()
      .getInnerContainer()
      .setBackgroundColor("#eee");
    this.projectUsersContainer.setAllDisplayProjectsAndUsersCoordinates();

    this.gridContainer.addHorizontalScrollbar();
    this.gridContainer.addVerticalScrollbar();

    this.gridContainer
      .getVerticalScrollbar()
      .getSlider()
      .addContainerScrollConnection(
        this.projectUsersContainer
          .getUserTableBodyContainer()
          .getInnerContainer()
      );
    this.gridContainer
      .getVerticalScrollbar()
      .getSlider()
      .addContainerScrollConnection(
        this.projectUsersContainer
          .getRowNumbersContainer()
          .getRowListContainer()
          .getInnerContainer()
      );
    if (this.projectUsersContainer.getSelectedUsersContainer()) {
      this.gridContainer
        .getVerticalScrollbar()
        .getSlider()
        .addContainerScrollConnection(
          this.projectUsersContainer
            .getSelectedUsersContainer()
            .getInnerContainer()
        );
    }
    this.gridContainer
      .getHorizontalScrollbar()
      .getSlider()
      .addContainerScrollConnection(this.daysContainer.getInnerContainer());

    this.projectUsersContainer.refreshDisplay();
    this.projectUsersContainer.renderDateSegmentConnections();
    this.projectUsersContainer
      .getUserTableBodyContainer()
      .addHorizontalScrollbar();
    this.projectUsersContainer
      .getUserTableBodyContainer()
      .getHorizontalScrollbar()
      .getSlider()
      .addContainerScrollConnection(
        this.projectUsersContainer.getTableHeadContainer().getInnerContainer()
      );

    this.toolboxContainer = new ToolboxContainer(
      0,
      0,
      this.mainCanvas.getWidth(),
      Config.toolboxSize,
      this.mainCanvas,
      this.mainCanvas
    );
    this.toolboxContainer.setBackgroundColor("#373B40");

    this.gridContainer
      .getHorizontalScrollbar()
      .getSlider()
      .addContainerScrollConnection(
        this.resourcePlanningContainer.getResourceListContainer()
      );

    await this.gridContainer
      .getInnerContainer()
      .addBackgroundImagePattern(
        `worker-threshold-cell-${Config.currentDate.format(
          Config.dateWeekFormat
        )}`,
        "worker-threshold-cell",
        Config.cellWidth * 7,
        Config.cellHeight,
        "repeat-y",
        this.daysContainer.getCurrentWeekContainerX()
      );

    const publicHolidayXPositions =
      this.daysContainer.getListOfPublicHolidayXPositions();

    for (let i = 0; i < publicHolidayXPositions.length; i++) {
      await this.offScreenCanvas.addBackgroundImagePattern(
        `public-holiday-cell-${i}`,
        "public-holiday-cell",
        Config.cellWidth,
        Config.cellHeight,
        "no-repeat",
        publicHolidayXPositions[i],
        0,
        1
      );
    }

    await this.addPlannedAbsences();

    await this.gridContainer
      .getInnerContainer()
      .addBackgroundImagePattern(
        "current-day-cell",
        "current-day-cell",
        Config.cellWidth,
        Config.cellHeight,
        "repeat-y",
        this.daysContainer.getCurrentDayContainerX(),
        0,
        1
      );

    this.sideSection.addRightBorder();
    this.sideSection.addRightScrollBorder();

    this.resourcePlanningHeadingsContainer =
      new ResourcePlanningHeadingsContainer(
        0,
        0,
        "40%",
        Config.bottomSectionSize,
        this.resourcesCanvas,
        this.resourecesSideSection
      );
    this.resourcePlanningHeadingsContainer.setXAlignment("right");
    this.resourcePlanningHeadingsContainer.setBackgroundColor("white");

    this.showHideResourcePlanning = new ResourcePlanningShowHideContainer(
      Config.sideCanvasSize -
        this.resourcePlanningHeadingsContainer.getWidth() -
        40,
      0,
      40,
      Config.bottomSectionSize,
      this.resourcesCanvas,
      this.resourcesCanvas
    );
    this.showHideResourcePlanning.setBackgroundColor("#201F1F");

    const gridInnerContainer = this.gridContainer.getInnerContainer();
    if(gridInnerContainer.getWidth() > 32767){
      this.offScreenCanvas.setCanvasMaxSize(
        32767,
        Config.cellHeight //gridInnerContainer.getHeight()
      );
    } else {
      this.offScreenCanvas.setCanvasMaxSize(
        gridInnerContainer.getWidth(),
        Config.cellHeight //gridInnerContainer.getHeight()
      );
    }

    this.offScreenCanvas.setCanvasSize(
      this.gridContainer.getWidth(),
      this.gridContainer.getHeight()
    );

    (
      this.gridContainer.getHorizontalScrollbar() as GridContainerHorizontalScrollbar
    ).doInitialScroll(this.daysContainer.getCurrentWeekContainerX());

    this.mainCanvas.getChildren().forEach((child) => child.draw());
    this.resourcesCanvas.getChildren().forEach((child) => child.draw());
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

    CmpRef.cmp.planedAbsences.forEach((absence) => {
      const startDateArray = absence.startDate
        .split("-")
        .map((n) => parseInt(n));
      const endDateArray = absence.endDate.split("-").map((n) => parseInt(n));

      const startDateX = (() => {
        const month = this.daysContainer
          .getAllDisplayMonths()
          .find(
            (ym) =>
              ym.year == startDateArray[0] && ym.month == startDateArray[1]
          );

        if(month == undefined) return undefined;
        return month.x + month.days.find((d) => d.day == startDateArray[2]).x;
      })();

      if(startDateX == undefined) return;

      const endDateX = (() => {
        const month = this.daysContainer
          .getAllDisplayMonths()
          .find(
            (ym) => ym.year == endDateArray[0] && ym.month == endDateArray[1]
          );
        return month.x + month.days.find((d) => d.day == endDateArray[2]).x;
      })();

      const weekends = (() => {
        const set = new Set();

        this.daysContainer
          .getAllDisplayMonths()
          .filter((ym) => {
            return (
              ym.year >= startDateArray[0] &&
              ym.month >= startDateArray[1] &&
              ym.year <= endDateArray[0] &&
              ym.month <= endDateArray[1]
            );
          })
          .forEach((ym) => {
            ym.days.forEach((day) => {
              if (day.isWeekend && day.isPlanedAbsence) {
                set.add(ym.x + day.x);
              }
            });
          });

        return Array.from(set);
      })();

      const plannedVacationDays = (endDateX - startDateX) / Config.cellWidth;

      for (let i = 0; i < plannedVacationDays + 1; i++) {
        this.offScreenCanvas.addBackgroundImagePattern(
          "planned-vacation-day-cell",
          "grid-cell-absence",
          Config.cellWidth,
          Config.cellHeight,
          "no-repeat",
          startDateX + Config.cellWidth * i,
          0,
          2
        );
      }

      weekends.forEach((dayX: number) => {
        this.offScreenCanvas.addBackgroundImagePattern(
          `planned-vacation-wekend-cell`,
          "grid-cell-weekend",
          Config.cellWidth,
          Config.cellHeight,
          "no-repeat",
          dayX,
          0,
          3
        );
      });
    });

    if (rerender) {
      this.offScreenCanvas.reRender();
      this.mainCanvas.getChildren().forEach((child) => child.draw());
    }
  }

  destruct() {
    this.offScreenCanvas.destruct();
    this.mainCanvas.destruct();
  }
}
