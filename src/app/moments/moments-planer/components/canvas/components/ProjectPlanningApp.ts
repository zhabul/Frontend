import { ProjectPlanningCanvas } from "./ProjectPlanningCanvas";
import { CanvasComponent } from "../canvas.component";
import { Configuration } from "./Configuration";
import { MainHeaderContainer } from "./inner-containers/MainHeaderContainer";
import { SideSectionPPContainer } from "./SideSectionPPContainer";
import { MainSectionPPContainer } from "./MainSectionPPContainer";
import { DaysPPContainer } from "./inner-containers/DaysPPContainer";
import { UsersContainer } from "./inner-containers/UsersContainer/UsersContainer";
import { Rectangle } from "src/app/canvas-ui/Rectangle";
import { GridPPContainer } from "./inner-containers/GridPPContainer/GridPPContainer";

export class ProjectPlanningApp {

  public mainCanvas: ProjectPlanningCanvas;
  public mainHeaderContainer: MainHeaderContainer;

  public sideSection: SideSectionPPContainer;
  public mainSection: MainSectionPPContainer;

  public usersContainer: UsersContainer;
  public daysPPContainer: DaysPPContainer;
  public daysContainerRightOverlayBox: Rectangle;
  public gridPPContainer: GridPPContainer;

  constructor(component: CanvasComponent) {
    this.createAllComponents(component);
  }


  async createAllComponents(component: CanvasComponent) {
    this.mainCanvas = new ProjectPlanningCanvas(Configuration.sidebarSize, 0, window.innerWidth - Configuration.sidebarSize, window.innerHeight, 'mainCanvas');

    this.mainHeaderContainer = new MainHeaderContainer(0, 0, this.mainCanvas.getWidth(), Configuration.toolboxSize, this.mainCanvas, this.mainCanvas);
    //this.mainHeaderContainer.setBackgroundColor('red');

    //left side
    this.sideSection = new SideSectionPPContainer(0, Configuration.toolboxSize, Configuration.sideCanvasSize, this.mainCanvas.getHeight() - Configuration.toolboxSize, this.mainCanvas, this.mainCanvas);
    this.sideSection.setBackgroundColor('orange');

    //right side
    this.mainSection = new MainSectionPPContainer(Configuration.sideCanvasSize, Configuration.toolboxSize, this.mainCanvas.getWidth() - Configuration.sideCanvasSize, this.mainCanvas.getHeight() - Configuration.toolboxSize, this.mainCanvas, this.mainCanvas);
    this.mainSection.setBackgroundColor('gray');

    this.gridPPContainer = new GridPPContainer(0, Configuration.topSectionSize, '100%', this.mainSection.getHeight() - Configuration.topSectionSize, this.mainCanvas, this.mainSection);
    this.gridPPContainer.getInnerContainer().setRenderInOffscreen();
    this.gridPPContainer.setIsMouseWheelable(true);

    this.daysPPContainer = new DaysPPContainer(0, 0, '100%', Configuration.topSectionSize, this.mainCanvas, this.mainSection);
    this.daysPPContainer.setBackgroundColor('orange');
    // this.daysContainerRightOverlayBox = new Rectangle(0, 0, Configuration.scrollbarSize, this.daysPPContainer.getHeight(), this.mainCanvas, this.mainSection);
    // this.daysContainerRightOverlayBox.setXAlignment('right');
    // this.daysContainerRightOverlayBox.setBackgroundColor('#555');

    // const weekendPositions = this.daysPPContainer.getXOffsetPositionsOfWeekends();
    // const weekendOffset = ((weekendPositions[0]/Configuration.cellWidth)+2-7) * Configuration.cellWidth;

    this.usersContainer = new UsersContainer(0, 0, '100%', this.sideSection.getHeight(), this.mainCanvas, this.sideSection);
    this.usersContainer.setIsMouseWheelable(true);

    this.sideSection.addRightBorder();
    //this.sideSection.addRightScrollBorder();

    this.mainCanvas.getChildren().forEach(child => child.draw());
  }


}
