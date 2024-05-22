import { AContainer } from "src/app/canvas-ui/AContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { GenericContainer } from "src/app/canvas-ui/GenericContainer";
import { Configuration } from "../../Configuration";
import { CppRef } from "../../CppRef";
import { UsersListContainer } from "./UsersListContainer";
//import { UsersRowContainer } from "./UsersRowContainer";
import { UsersTableHead } from "./UsersTableContainer/UsersTableHead";

declare var $;

export class UsersContainer extends AContainer {

  private userTableContainer: GenericContainer;
  private tableHeadContainer: UsersTableHead;
  private userTableBodyContainer: UsersListContainer;
  //private rowNumberContainer: UsersRowContainer;

  constructor(x: number, y: number, width: string | number, height: string | number, canvas: Canvas, parent) {
    super(x, y, width, height, canvas, parent);

    this.createUsersTableContainer();
    this.createUsersTableHeadContainer();
    this.createUserTableBodyContainer();
    this.createRowNumbersContainer();
  }

  private createUsersTableContainer() {
    this.userTableContainer = new GenericContainer(Configuration.cellHeight, 0, '100%', this.getHeight(), this.canvas, this);
    this.userTableContainer.setWidthOffset(Configuration.sideSectionRightBorderWidth);
    this.userTableContainer.setBackgroundColor('#eee');
    this.userTableContainer.setWidthOffset(Configuration.cellHeight);
  }

  private createUsersTableHeadContainer() {
    this.tableHeadContainer = new UsersTableHead(0, 0, '100%', Configuration.topSectionSize, this.canvas, this.userTableContainer);
    this.tableHeadContainer.setWidthOffset(Configuration.sideSectionRightBorderWidth);
  }

  private createRowNumbersContainer() {
    //this.rowNumberContainer = new UsersRowContainer(0, 0, Configuration.cellHeight, this.getHeight(), this.canvas, this);
  }

  private createUserTableBodyContainer() {
    this.userTableBodyContainer = new UsersListContainer(0, Configuration.topSectionSize, '100%', this.userTableContainer.getHeight() - Configuration.topSectionSize, this.canvas, this.userTableContainer);
    this.userTableBodyContainer.setWidthOffset(Configuration.sideSectionRightBorderWidth);
  }

  getUserTableBodyContainer() { return this.userTableBodyContainer; }

  refreshDisplay() {
      CppRef.cpp.projectPlanningApp.sideSection.draw();
      CppRef.cpp.projectPlanningApp.gridPPContainer.draw();
    }


}
