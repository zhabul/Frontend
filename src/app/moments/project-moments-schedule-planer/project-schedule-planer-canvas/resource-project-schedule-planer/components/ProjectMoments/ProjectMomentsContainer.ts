import { DatePipe } from "@angular/common";
import * as moment from "moment";
import { AContainer } from "src/app/canvas-ui/AContainer";
import { Rectangle } from "src/app/canvas-ui/Rectangle";
import { BezierCurveBridge } from "src/app/canvas-ui/BezierCurveBridge";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { DropdownMenu } from "src/app/canvas-ui/DropdownMenu";
import { GenericContainer } from "src/app/canvas-ui/GenericContainer";
import { Line } from "src/app/canvas-ui/Line";
import { TextRenderer } from "src/app/canvas-ui/TextRenderer";

import { ProjectColumn } from "src/app/moments/project-moments/resource-planning-app/containers/ProjectUsersContainer/ProjectColumn";
// import { ProjectContainer } from "src/app/moments/project-moments/resource-planning-app/containers/ProjectUsersContainer/ProjectContainer";
import * as momentM from "moment";

import { ConfigSc } from "../../Config";
import { CpspRef } from "../../CpspRef";
import { DateSegmentData } from "../../models/DateSegmentData";

import { Moment } from "../../models/Moment";
import { DateSegment } from "../GridContainer/DateSegment";
import { ProjectSegment } from "../GridContainer/ProjectSegment";
import { MomentContainer } from "./MomentContainer";
import { ProjectMomentsListContainer } from "./ProjectMomentsListContainer";
import { ProjectMomentsRowContainer } from "./ProjectMomentsRowContainer";
import { ProjectMomentsTableHead } from "./ProjectMomentsTableHead/ProjectMomentsTableHead";
import { SelectedMomentsContainer } from "./SelectedMomentsContainer";
import { Activity } from "../../models/Activity";
import { Column } from "./ProjectMomentsTableHead/Column";
import { MovingLineIndicator } from "./MovingLineIndicator";
import { SideSectionMomentsContainer } from "../../SideSectionMomentsContainer";
import historySchedulePlaner from "src/app/canvas-ui/history/historySchedulePlaner";
import { ProjectScheduleContainer } from "./ProjectScheduleContainer";

declare const $;

export class ProjectMomentsContainer extends AContainer {
  private tableHeadContainer: ProjectMomentsTableHead;
  private momentTableContainer: GenericContainer;
  private rowNumberContainer: ProjectMomentsRowContainer;
  public momentTableBodyContainer: ProjectMomentsListContainer;
  public selectedMomentsContainer: SelectedMomentsContainer;
  private firstMomentBoxSelectedPosition: number;
  public highlightedRow: number;

  public selectedCol: GenericContainer;

  private currentDisplayProjectIndex = 0;

  public show_activity = [];
  public show_states = [];

  private topY = 0;

  //private project_activity:Project;

  public selectionBox: Rectangle;
  public isClickOnArrow = false;

  // private line_above;
  //private line_bellow;

  public movingLineIndicator;

  public marginLeft = 0;
  public marginTop = 0;
  private selColumn;
  // public calcMoments=false;

  public firstMove;
  private rightColInd;
  private leftColInd;
  private selectedColIndex;

  private activityIndex;
  private planIndex;

  private shadow = document.getElementById("shadow");

  constructor(
    x: number,
    y: number,
    width: string | number,
    height: string | number,
    canvas: Canvas,
    parent
  ) {
    super(x, y, width, height, canvas, parent);
    // this.project_activity = this.deepCopy<Project>(CpspRef.cmp.selectedProject);

    this.createMomentTableContainer();
    this.createMomentTableBodyContainer();
    this.createTableHeadContainer();
    this.createRowNumbersContainer();
    if (
      this.getHeight() <
      this.getNumberOfAllDisplayActivitiesAndMoments() * ConfigSc.cellHeight
    )
      this.updateInnerContainerHeight();

    this.setOnMouseWheelHandler((e) => {
      CpspRef.cmp.projectSchedulePlanerApp.mainHeader.closeDropDowns();
      CpspRef.cmp.projectSchedulePlanerApp.gridContainer
        .getVerticalScrollbar()
        .getSlider()
        .move(e.deltaY / ConfigSc.wheelScrollSensitivity);
      this.parent.draw();
      // if (this.getSelectedUsersContainer()) {
      //     this.selectedUsersContainer.draw();
      // }
      CpspRef.cmp.projectSchedulePlanerApp.gridContainer.draw();
      CpspRef.cmp.projectSchedulePlanerApp.mainHeader.draw();
    });

    this.setOnMouseHoverHandler(() => {
      if(CpspRef.cmp.rowNumberHover && !CpspRef.cmp.rowNumberSelecting){
          this.rowNumberContainer
          .getRowListContainer()
          .getInnerContainer().getChildren().forEach((child) => {
            child.setBackgroundColor('#1A1A1A')
          });
      this.canvas.resetDrawingContainers();
      this.drawSelectedContainer()
        CpspRef.cmp.rowNumberHover = false;
      }
    })
  }

  private createMomentTableContainer() {
    this.momentTableContainer = new GenericContainer(
      ConfigSc.cellHeight * 2,
      0,
      "100%",
      this.getHeight(),
      this.canvas,
      this
    );
    this.momentTableContainer.setWidthOffset(
      ConfigSc.sideSectionRightBorderWidth
    );
    this.momentTableContainer.setBackgroundColor("#eee");
    this.momentTableContainer.setWidthOffset(ConfigSc.cellHeight * 2);
  }

  private createTableHeadContainer() {
    this.tableHeadContainer = new ProjectMomentsTableHead(
      0,
      0,
      "100%",
      ConfigSc.topSectionSize,
      this.canvas,
      this.momentTableContainer
    );
    this.tableHeadContainer.setWidthOffset(
      ConfigSc.sideSectionRightBorderWidth
    );
  }

  private createRowNumbersContainer() {
    this.rowNumberContainer = new ProjectMomentsRowContainer(
      0,
      0,
      ConfigSc.cellHeight * 2,
      this.getHeight() >
      this.getNumberOfAllDisplayActivitiesAndMoments() * ConfigSc.cellHeight
        ? this.getHeight()
        : this.getNumberOfAllDisplayActivitiesAndMoments() *
          ConfigSc.cellHeight,
      this.canvas,
      this
    );
  }

  private createMomentTableBodyContainer() {
    this.momentTableBodyContainer = new ProjectMomentsListContainer(
      0,
      ConfigSc.topSectionSize,
      "100%",
      this.momentTableContainer.getHeight() - ConfigSc.topSectionSize,
      this.canvas,
      this.momentTableContainer
    );
    this.momentTableBodyContainer.setWidthOffset(
      ConfigSc.sideSectionRightBorderWidth
    );
    this.momentTableBodyContainer
      .getInnerContainer()
      .setBackgroundColor("#eee");
  }

  getSelectedMomentsContainer() {
    return this.selectedMomentsContainer;
  }

  getMovingLineIndicator() {
    return this.movingLineIndicator;
  }

  updateInnerContainerHeight() {
    const height =
      this.getNumberOfAllDisplayActivitiesAndMoments() * ConfigSc.cellHeight;
    this.momentTableBodyContainer.getInnerContainer().setHeight(height);
    this.rowNumberContainer
      .getRowListContainer()
      .getInnerContainer()
      .setHeight(height);
    if (this.selectedMomentsContainer) {
      this.selectedMomentsContainer.getInnerContainer().setHeight(height);
    }
  }

  deepCopy<T>(instance: T): T {
    if (instance == null) {
      return instance;
    }

    // handle Dates
    if (instance instanceof Date) {
      return new Date(instance.getTime()) as any;
    }

    // handle Array types
    if (instance instanceof Array) {
      const cloneArr = [] as any[];
      (instance as any[]).forEach((value) => {
        cloneArr.push(value);
      });
      // for nested objects
      return cloneArr.map((value: any) => this.deepCopy<any>(value)) as any;
    }
    // handle objects
    if (instance instanceof Object) {
      const copyInstance = {
        ...(instance as { [key: string]: any }),
      } as { [key: string]: any };
      for (const attr in instance) {
        if ((instance as Object).hasOwnProperty(attr))
          copyInstance[attr] = this.deepCopy<any>(instance[attr]);
      }
      return copyInstance as T;
    }
    // handling primitive data types
    return instance;
  }

  getRowNumbersContainer() {
    return this.rowNumberContainer;
  }

  getNumberOfWorkersNeededForAllProjectsForWeek() {
    let r = 0;
    CpspRef.cmp.copySelectedProject.activities.forEach((activity) => {
      if (activity.number_of_workers != null && activity.moments.length == 0)
        r = r + Math.ceil(activity.number_of_workers);
      activity.moments.forEach((plan) => {
        if (
          plan.number_of_workers != null &&
          plan.percentage_of_realized_plan == null
        )
          r = r + Math.ceil(plan.number_of_workers);
      });
    });
    return r;
  }

  getNumberOfWorkersWorkingForAllProjectsForWeek(week: string) {
    const splitWeek = week.split("-");

    //getting first and last bussines day in a specific week
    const startOfWeek = moment()
      .year(Number(splitWeek[0]))
      .week(Number(splitWeek[1]))
      .day(1)
      .startOf("day");
    const endOfWeek = moment()
      .year(Number(splitWeek[0]))
      .week(Number(splitWeek[1]))
      .day(5)
      .startOf("day");

    let r = 0;

    CpspRef.cmp.copySelectedProject.activities.forEach((activity) => {
      activity.dateSegments.forEach(dateSegment => {
        if (dateSegment.startDate != null) {
          const st_date = moment(dateSegment.startDate).startOf("day");
          const end_date = moment(dateSegment.endDate).startOf("day");

          if (
            st_date.format(ConfigSc.dateWeekFormat) <= week &&
            end_date.format(ConfigSc.dateWeekFormat) >= week
          ) {
            if (
              activity.number_of_workers != null &&
              activity.moments.length == 0
            ) {
              //calculating first and last day of activity in a weekend
              const startActivityInWeek =
                startOfWeek.diff(st_date, "days") <= 0 ? st_date : startOfWeek;
              if (startOfWeek.diff(st_date, "days") < -4) return false; //chech if start of activity falls on weekend for activities
              const endActivityInWeek =
                end_date.diff(endOfWeek, "days") <= 0 ? end_date : endOfWeek;
              const daysOfActivityInWeek =
                endActivityInWeek.diff(startActivityInWeek, "days") + 1;

              //calculating bussines days in a specific activity in one week
              const activityBussinesdays = CpspRef.cmp.getAllDaysOfMoment(
                activity
              );
              r =
                r +
                (activity.time * daysOfActivityInWeek) /
                  (5 * activityBussinesdays * CpspRef.cmp.changeHoursOnProject);
            }
          }
        }
      })
      // if (activity.startDate != null) {
      //   const st_date = moment(activity.startDate).startOf("day");
      //   const end_date = moment(activity.endDate).startOf("day");

      //   if (
      //     st_date.format(ConfigSc.dateWeekFormat) <= week &&
      //     end_date.format(ConfigSc.dateWeekFormat) >= week
      //   ) {
      //     if (
      //       activity.number_of_workers != null &&
      //       activity.moments.length == 0
      //     ) {
      //       //calculating first and last day of activity in a weekend
      //       const startActivityInWeek =
      //         startOfWeek.diff(st_date, "days") <= 0 ? st_date : startOfWeek;
      //       if (startOfWeek.diff(st_date, "days") < -4) return false; //chech if start of activity falls on weekend for activities
      //       const endActivityInWeek =
      //         end_date.diff(endOfWeek, "days") <= 0 ? end_date : endOfWeek;
      //       const daysOfActivityInWeek =
      //         endActivityInWeek.diff(startActivityInWeek, "days") + 1;

      //       //calculating bussines days in a specific activity in one week
      //       const activityBussinesdays = CpspRef.cmp.getBusinessDatesCount(
      //         activity.startDate,
      //         activity.endDate
      //       );
      //       r =
      //         r +
      //         (activity.time * daysOfActivityInWeek) /
      //           (5 * activityBussinesdays * CpspRef.cmp.changeHoursOnProject);
      //     }
      //   }
      // }
      activity.moments.forEach((plan) => {
        plan.dateSegments.forEach(dateSegment => {
          if (dateSegment.startDate != null) {
            const st_date = moment(dateSegment.startDate).startOf("day");
            const end_date = moment(dateSegment.endDate).startOf("day");

            if (
              st_date.format(ConfigSc.dateWeekFormat) <= week &&
              end_date.format(ConfigSc.dateWeekFormat) >= week
            ) {
              if (
                plan.number_of_workers != null &&
                plan.percentage_of_realized_plan == null
              ) {
                //calculating first and last day of moment in a weekend
                const startActivityInWeek =
                  startOfWeek.diff(st_date, "days") <= 0 ? st_date : startOfWeek;
                if (startOfWeek.diff(st_date, "days") < -4) return false; //chech if start of activity falls on weekend for moments
                const endActivityInWeek =
                  end_date.diff(endOfWeek, "days") <= 0 ? end_date : endOfWeek;
                const daysOfActivityInWeek =
                  endActivityInWeek.diff(startActivityInWeek, "days") + 1;
                //calculating bussines days in a specific moment in one week
                const activityBussinesdays = CpspRef.cmp.getAllDaysOfMoment(
                  plan
                );
                r =
                  r +
                  (plan.time * daysOfActivityInWeek) /
                    (5 * activityBussinesdays * CpspRef.cmp.changeHoursOnProject);
              }
            }
          }
        })
        // if (plan.start_date != null) {
        //   const st_date = moment(plan.start_date).startOf("day");
        //   const end_date = moment(plan.end_date).startOf("day");

        //   if (
        //     st_date.format(ConfigSc.dateWeekFormat) <= week &&
        //     end_date.format(ConfigSc.dateWeekFormat) >= week
        //   ) {
        //     if (
        //       plan.number_of_workers != null &&
        //       plan.percentage_of_realized_plan == null
        //     ) {
        //       //calculating first and last day of moment in a weekend
        //       const startActivityInWeek =
        //         startOfWeek.diff(st_date, "days") <= 0 ? st_date : startOfWeek;
        //       if (startOfWeek.diff(st_date, "days") < -4) return false; //chech if start of activity falls on weekend for moments
        //       const endActivityInWeek =
        //         end_date.diff(endOfWeek, "days") <= 0 ? end_date : endOfWeek;
        //       const daysOfActivityInWeek =
        //         endActivityInWeek.diff(startActivityInWeek, "days") + 1;
        //       //calculating bussines days in a specific moment in one week
        //       const activityBussinesdays = CpspRef.cmp.getBusinessDatesCount(
        //         plan.start_date,
        //         plan.end_date
        //       );
        //       r =
        //         r +
        //         (plan.time * daysOfActivityInWeek) /
        //           (5 * activityBussinesdays * CpspRef.cmp.changeHoursOnProject);
        //     }
        //   }
        // }
      });
    });
    // if (r > CpspRef.cmp.maxResource) {
    //   CpspRef.cmp.maxResource = r;
    //   // CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay()
    //   CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer
    //     .getResourceListContainer()
    //     .removeAllChildren();
    //   CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.addAllDisplayResourcesThatFitContainer();
    //   CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.draw();
    // }
    return Math.abs(Math.round(r - 0.01));
  }

  getTableHeadContainer() {
    return this.tableHeadContainer;
  }
  getMomentTableBodyContainer() {
    return this.momentTableBodyContainer;
  }

  addWeekToSelectedWeeksToShowWorkers(week: string) {
    CpspRef.cmp.selectedWeeksToShowWorkers.push(week);
  }
  removeWeekInSelectedWeeksToShowWorkers(week: string) {
    const index = CpspRef.cmp.selectedWeeksToShowWorkers.indexOf(week);
    if (index < 0) return;
    CpspRef.cmp.selectedWeeksToShowWorkers.splice(index, 1);
  }

  getCurrentDisplayProjectIndex() {
    return this.currentDisplayProjectIndex;
  }

  setCurrentDisplayProjectIndex(currentDisplayProjectIndex: number) {
    this.currentDisplayProjectIndex = currentDisplayProjectIndex;
  }

  findProjectIndexByYPosition(y: number) {
    return CpspRef.cmp.project.id; //CpspRef.cmp.allDisplayProjects.findIndex(p => p.y > y);
  }

  addDisplayProjectToProjectUsersContainer(projectIndex: number): boolean {
    if (
      projectIndex < 0 ||
      projectIndex > CpspRef.cmp.selectedProject.activities.length - 1
    ) {
      return false;
    }

    const datepipe = new DatePipe("en-US");
    const activity = CpspRef.cmp.selectedProject.activities[projectIndex];
    const percentageWork = activity.dateSegments[0].currentWorkDate != null ? activity.dateSegments[0].currentWorkDate.split("%") : [];
    const rowNumber = activity.y / ConfigSc.cellHeight + 1;
    const activityContainer = new ProjectScheduleContainer(
      0,
      activity.y,
      "100%",
      activity.moments.length * ConfigSc.cellHeight + ConfigSc.cellHeight,
      this.canvas,
      this.momentTableBodyContainer.getInnerContainer()
    );

    const activityHeaderContainer = new MomentContainer(
      0,
      0,
      "100%",
      ConfigSc.cellHeight,
      this.canvas,
      activityContainer
    );
    if (activity.id > 0) {
      activityHeaderContainer.setBackgroundColor(
        activity.styles.backgroundColor
      );
    } else {
      activityHeaderContainer.setBackgroundColor(activity.styles.backgroundColor); //Use to set background color for negative activityindexes
    }

    const c = new ProjectColumn(
      0,
      0,
      ProjectMomentsTableHead.threeVerticalDotsColumnWidth,
      activityHeaderContainer.getHeight(),
      this.canvas,
      activityHeaderContainer
    );
    c.setBorder("#707070", 1);
    if (activity.id > 0 && ConfigSc.isInEditMode) {
      c.setOnMouseHoverHandler(() => (document.body.style.cursor = "pointer"));
    }

    const cText = new TextRenderer("\u2807", this.canvas, c);
    if (activity.id <= 0) {
      cText.setColor("black");
    }
    cText.setFontSize(17);
    cText.setX(6);
    cText.setY(6);
    cText.updateTextDimensions();

    if (
      ConfigSc.isInEditMode &&
      (CpspRef.cmp.property_index == CpspRef.cmp.revisions.length + 1 || CpspRef.cmp.lockedRevision) &&
      activity.number == ""
    ) {
      c.setOnMouseHoverHandler(() => (document.body.style.cursor = "pointer"));
      c.setOnClickHandler((e) => {
        CpspRef.cmp.hideColumnValueInput();
        this.selectedMomentsContainer = null;
        const dropdownMenu = new DropdownMenu(
          e.layerX,
          e.layerY,
          200,
          200,
          this.canvas
        );

        dropdownMenu.addOption(
          CpspRef.cmp.getTranslate().instant("Delete"),
          (e) => {
            // moment["showInResourcePlanning"] = moment.hasOwnProperty("showInResourcePlanning") ? !moment.showInResourcePlanning : false;

            // history.addToQueue(
            //     () => CpspRef.cmp.setUserCountAsResources(moment.id, project.id, moment.isResponsiblePerson, moment.showInResourcePlanning),
            //     () => CpspRef.cmp.setUserCountAsResources(moment.id, project.id, moment.isResponsiblePerson, !moment.showInResourcePlanning));
            // CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
            // CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();

            CpspRef.cmp.showConfirmationModal(
              CpspRef.cmp.getTranslate().instant("Do you want to delete?"),
              async (response) => {
                if (response.result) {
                  if (CpspRef.cmp.loading) {
                    return;
                  }
                  CpspRef.cmp.setLoadingStatus(true);
                  CpspRef.cmp.deleteSchedulePlan(activity.id, null,false);
                  CpspRef.cmp.setLoadingStatus(false);
                }
              }
            );
          }
        );

        // dropdownMenu.addOption(
        //   CpspRef.cmp.getTranslate().instant("Make new row"),
        //   (e) => {
        //     CpspRef.cmp.fillEmptyRow(1);
        //   }
        // );
        dropdownMenu.addOption(
          CpspRef.cmp.getTranslate().instant("Insert new row above"),
          (e) => {
            CpspRef.cmp.addNewActivityToExistingOne(
              Number(projectIndex),
              true
            ); //forward activity sort_index and true for add row above and false to add row below
          }
        );

        dropdownMenu.addOption(
          CpspRef.cmp.getTranslate().instant("Insert new row below"),
          (e) => {
            CpspRef.cmp.addNewActivityToExistingOne(
              Number(projectIndex),
              false
            );
          }
        );
        dropdownMenu.open();

        dropdownMenu.open();
      });
    }

    CpspRef.cmp.visibleColumns.forEach((column) => {
      const c = new ProjectColumn(
        column.x - ConfigSc.sidebarSize, //-sidebarSize because parent is activityHeader
        0,
        column.width,
        activityHeaderContainer.getHeight(),
        this.canvas,
        activityHeaderContainer
      );
      c.setBorder("#707070", 1);
      let text = "";
      if(ConfigSc.isInEditMode)
        c.setOnClickHandler(()=>CpspRef.cmp.projectSchedulePlanerApp.mainHeader.closeDropDowns())
      if (
        column.key !== "Details" &&
        column.key !== "start_date" &&
        column.key !== "end_date" &&
        column.key !== "days" &&
        column.key !== "hours" &&
        column.key !== "finished" &&
        column.key !== "resource" &&
        column.key !== "plan" &&
        column.key !== "part"
      ) {
        if (
          column.values[CpspRef.cmp.project.id] &&
          column.values[CpspRef.cmp.project.id].activities[activity.id]
        ) {
          text =
            column.values[CpspRef.cmp.project.id].activities[activity.id].value;
        }
        if (
          ConfigSc.isInEditMode &&
          (CpspRef.cmp.property_index == CpspRef.cmp.revisions.length + 1 || !CpspRef.cmp.lockedRevision)
        ) {
          c.setOnClickHandler(() => {
            if (
              (CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.lockedRevision) ||
              activity.description == null
            ) {
              return;
            }

            // CpspRef.cmp.newColumnValueInput.style.display = "block";
            // CpspRef.cmp.newColumnValueInput.style.width = `${c.getWidth()}px`;
            // CpspRef.cmp.newColumnValueInput.style.height = `${c.getHeight()}px`;
            //CpspRef.cmp.newColumnValueInput.value = text;
            CpspRef.cmp.newColumnValueInput.style.top = `${c.getGlobalY()}px`;
            const x = ConfigSc.sidebarSize + c.getGlobalX();
            this.marginLeft = x;
            this.marginTop = c.getGlobalY();
            this.selColumn = null;
            CpspRef.cmp.indexOfVisibleColumn = undefined;
            // CpspRef.cmp.newColumnValueInput.style.left = `${x}px`;
            // CpspRef.cmp.newColumnValueInput.focus();
            //  CpspRef.cmp.columnInput.select();

            CpspRef.cmp.selectedColumnForEditing = column;
            CpspRef.cmp.activityIndex = Number(activity.id);
            CpspRef.cmp.planIndex = 0;
            this.highlightedRow = rowNumber;
            this.showInput(x);
            this.refreshDisplay();
          });
        }
      } else {
        // if(!ConfigSc.isInEditMode)return;
        if (column.key === "Details") {
          const space = activity.number != "" ? " " : "";
          text =
            activity.description != null
              ? activity.number + space + activity.description
              : "";
          // if (activity.moments.length == 0) {
          // c.setOnDoubleClickHandler(() => {

          c.setOnMouseDownHandler((e) => {
            if (
              (CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.lockedRevision) ||
              !ConfigSc.isInEditMode
            ) {
              return;
            }

            CpspRef.cmp.selectedColumns = [];

            // use for consoling out activity id on details click
            CpspRef.cmp.tapeMomActId = null;
            ConfigSc.firstMomentBoxSelectedPositionDelta = activity.y;
            this.firstMomentBoxSelectedPosition = e.offsetY;
            ConfigSc.deltaMovementBetweenBoxes = 0;
            this.firstMove = 0;
            this.selectedMomentsContainer = null;
            CpspRef.cmp.changeFontFamilyInputValue = "Cursive";
            CpspRef.cmp.changeFontSizeInputValue = activity.styles.fontSize;
            CpspRef.cmp.changeFontFamilyInputValue = activity.styles.fontFamily;
            CpspRef.cmp.changeBackgroundColorInputValue =
              activity.styles.backgroundColor;
            CpspRef.cmp.changeTextColorInputValue = activity.styles.color;
            CpspRef.cmp.changeBackgroundTapeColorInputValue =
              activity.tape_color;
            CpspRef.cmp.changeFontWeightInputValue =
              activity.styles.fontWeight == "bold" ? true : false;
            CpspRef.cmp.changeFontStyleInputValue =
              activity.styles.fontStyle == "italic" ? true : false;
            CpspRef.cmp.changeFontDecorationInputValue =
              activity.styles.fontDecoration == "underline" ? true : false;
            //document.body.style.cursor = "crosshair";

            CpspRef.cmp.projectSchedulePlanerApp.mainHeader.closeDropDowns();
            this.selectedColumns(c,column,activity.id,null);
            // this.canvas.getCanvasElement().onmousemove = (e2) => {
            //   if (e2.movementY != 0 && firstMove == 0) {
            //     CpspRef.cmp.activityIndex = activity.id;
            //     CpspRef.cmp.planIndex = null;
            //     //this.createSelectedMomentsContainer(e.offsetX, e.offsetY - ConfigSc.toolboxSize);
            //     this.createSelectedMomentsContainer(
            //       e.layerX,
            //       e.layerY - ConfigSc.toolboxSize
            //     );
            //     firstMove = 1;
            //     this.highlightedRow = null;
            //     this.refreshDisplay();
            //   }
            // };

            c.addRemoveEventsForMouseDownEvent(() => {
              // this.highlightedRow = null;
              if (this.firstMove != 0){
                this.setSelectedColums();
                return;
              }
              this.canvas.getCanvasElement().onmousemove = null;
              if (
                (CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.lockedRevision)
              ) {
                return;
              }
              if (
                this.getMomentTableBodyContainer()
                  .getHorizontalScrollbar()
                  .getSlider()
                  .getX() > 0
              ) {
                const move_x_left = -this.getMomentTableBodyContainer()
                  .getHorizontalScrollbar()
                  .getSlider()
                  .getX();
                this.getMomentTableBodyContainer()
                  .getHorizontalScrollbar()
                  .getSlider()
                  .move(move_x_left);
                this.refreshDisplay();
              }
              // CpspRef.cmp.columnValueInput.style.display = "block";
              // CpspRef.cmp.columnValueInput.style.textAlign = "left";
              // CpspRef.cmp.columnValueInput.style.width = `${c.getWidth()}px`;
              // CpspRef.cmp.columnValueInput.style.height = `${c.getHeight()}px`;
              // CpspRef.cmp.columnValueInput.style.border = "3px solid #F77E04";
              //CpspRef.cmp.columnValueInput.value = text;
              const topY = c.getGlobalY();
              CpspRef.cmp.columnValueInput.style.top = `${topY}px`;
              this.marginLeft = ConfigSc.sidebarSize + c.getGlobalX();
              this.marginTop = topY;
              this.selColumn = null;
              CpspRef.cmp.indexOfVisibleColumn = undefined;
              // const x = ConfigSc.sidebarSize + ProjectMomentsTableHead.threeVerticalDotsColumnWidth;
              // CpspRef.cmp.columnValueInput.style.left = `${x}px`;
              // CpspRef.cmp.columnValueInput.style.pointerEvents = "auto"
              // CpspRef.cmp.deleteDetails = true;
              // //CpspRef.cmp.columnValueInput.focus();
              // //CpspRef.cmp.columnValueInput.select();

              // document.getElementById("columnValueEditInput1").style.display = "block"
              // document.getElementById("columnValueEditInput1").style.textAlign = "left";
              // //document.getElementById("columnValueEditInput1").focus();
              // document.getElementById("selectValue").style.display = "block"
              CpspRef.cmp.inputValue = text;

              CpspRef.cmp.selectedColumnForEditing = column;
              CpspRef.cmp.activityIndex = Number(activity.id);
              CpspRef.cmp.planIndex = null;
              CpspRef.cmp.activityY = activity.y;
              this.highlightedRow = rowNumber;
              this.showInput(this.marginLeft);
              this.refreshDisplay();
            });
          });

          if (
            CpspRef.cmp.copySelectedProject.activities.find(
              (a) => a.id == activity.id
            ).moments.length > 0
          ) {
            const activity_arr = {
              id: activity.id,
              show: "arrow-open",
            };

            if (!this.show_activity.find((e) => e.id == activity.id))
              this.show_activity.push(activity_arr);

            const activity_index_show = this.show_activity.findIndex(
              (obj) => obj.id == activity.id
            );

            const project_arrow = this.addIcon(
              12,
              this.show_activity[activity_index_show].show == "arrow-open"
                ? 10
                : 6,
              this.show_activity[activity_index_show].show == "arrow-open"
                ? 8
                : 8,
              this.show_activity[activity_index_show].show == "arrow-open"
                ? 12
                : 12,
              this.show_activity[activity_index_show].show,
              this.show_activity[activity_index_show].show,
              () => {
              },
              c
            );
            const project_arrow_rec = new GenericContainer(
              5,
              5,
              15,
              15,
              this.canvas,
              c
            );
            project_arrow_rec.setOnMouseHoverHandler(() => (document.body.style.cursor = "pointer"));
            project_arrow_rec.setOnClickHandler(() => {
              CpspRef.cmp.hideColumnValueInput();
              this.isClickOnArrow = true;
              this.selectedMomentsContainer = null;
              this.highlightedRow = null;
              this.filterActivity(activity);
            });
            project_arrow.getBorderColor();
          }
        } else if (column.key === "start_date" && activity.dateSegments.at(0).startDate != null) {
          text = datepipe.transform(activity.dateSegments.at(0).startDate, "yy-MM-dd");
          c.setOnMouseDownHandler(e => {
            this.firstMove = 0;
            this.selectedColumns(c,column,activity.id,null);

            c.addRemoveEventsForMouseDownEvent(e2 =>{
              this.setSelectedColums();
            })
          })
        } else if (column.key == "end_date" && activity.dateSegments.at(-1).endDate != null) {
          c.setOnMouseDownHandler(e => {
            this.firstMove = 0;
            this.selectedColumns(c,column,activity.id,null);

            c.addRemoveEventsForMouseDownEvent(e2 =>{
              this.setSelectedColums();
            })
          })
          text = datepipe.transform(activity.dateSegments.at(-1).endDate, "yy-MM-dd");
        } else if (
          (column.key === "plan" || column.key === "part") &&
          !CpspRef.cmp.project.activities.some(
            (akt) => akt.activity == activity.id
          ) &&
          activity.description != null &&
          activity.description != ""
        ) {
          if (column.key === "plan")
            text = activity.plan != null ? activity.plan : "";
          else text = activity.part != null ? activity.part : "";

          c.setOnMouseDownHandler((e) => {
            if (
              (CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.lockedRevision) || !ConfigSc.isInEditMode ||
              !ConfigSc.isInEditMode
            ) {
              return;
            }

            // use for consoling out activity id on details click
            CpspRef.cmp.tapeMomActId = null;
            ConfigSc.firstMomentBoxSelectedPositionDelta = activity.y;
            this.firstMomentBoxSelectedPosition = e.offsetY;
            ConfigSc.deltaMovementBetweenBoxes = 0;
            this.selectedMomentsContainer = null;
            CpspRef.cmp.changeFontFamilyInputValue = "Cursive";
            CpspRef.cmp.changeFontSizeInputValue = activity.styles.fontSize;
            CpspRef.cmp.changeFontFamilyInputValue = activity.styles.fontFamily;
            CpspRef.cmp.changeBackgroundColorInputValue =
              activity.styles.backgroundColor;
            CpspRef.cmp.changeTextColorInputValue = activity.styles.color;
            CpspRef.cmp.changeBackgroundTapeColorInputValue =
              activity.tape_color;
            CpspRef.cmp.changeFontWeightInputValue =
              activity.styles.fontWeight == "bold" ? true : false;
            CpspRef.cmp.changeFontStyleInputValue =
              activity.styles.fontStyle == "italic" ? true : false;
            CpspRef.cmp.changeFontDecorationInputValue =
              activity.styles.fontDecoration == "underline" ? true : false;
            //document.body.style.cursor = "crosshair";

            CpspRef.cmp.projectSchedulePlanerApp.mainHeader.closeDropDowns();

            this.firstMove = 0;
            this.selectedColumns(c,column,activity.id,null);

            c.addRemoveEventsForMouseDownEvent((e2) => {
              // this.highlightedRow = null;
              if (this.firstMove != 0){
                this.setSelectedColums();
                return;
              }
              this.canvas.getCanvasElement().onmousemove = null;
              if (
                (CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.lockedRevision)
              ) {
                return;
              }
              if (
                this.getMomentTableBodyContainer()
                  .getHorizontalScrollbar()
                  .getSlider()
                  .getX() > 0
              ) {
                const move_x_left = -this.getMomentTableBodyContainer()
                  .getHorizontalScrollbar()
                  .getSlider()
                  .getX();
                this.getMomentTableBodyContainer()
                  .getHorizontalScrollbar()
                  .getSlider()
                  .move(move_x_left);
                this.refreshDisplay();
              }

            CpspRef.cmp.hideColumnValueInput();
            this.selectedMomentsContainer = null;
            // CpspRef.cmp.planInput.style.display = "block";
            // CpspRef.cmp.planInput.style.textAlign = "left";
            // CpspRef.cmp.planInput.style.width = `${c.getWidth()}px`;
            // CpspRef.cmp.planInput.style.height = `${c.getHeight()}px`;
            // CpspRef.cmp.planInput.style.border = "3px solid #F77E04";
            CpspRef.cmp.planInput.value = text.toString();
            CpspRef.cmp.planInput.style.top = `${c.getGlobalY()}px`;

            const x = ConfigSc.sidebarSize + c.getGlobalX();
            this.marginLeft = x;
            this.marginTop = c.getGlobalY();
            this.selColumn = null;
            CpspRef.cmp.indexOfVisibleColumn = undefined;
            // CpspRef.cmp.planInput.style.left = `${x}px`;
            // CpspRef.cmp.planInput.focus();
            // CpspRef.cmp.planInput.select();

            CpspRef.cmp.selectedColumnForEditing = column;
            CpspRef.cmp.activityIndex = Number(activity.id);
            CpspRef.cmp.planIndex = null;
            CpspRef.cmp.activityY = activity.y;

            this.highlightedRow = rowNumber;
            CpspRef.cmp.tapeMomActId = null;
            this.showInput(x);
            this.refreshDisplay()

              // const topY = c.getGlobalY();
              // CpspRef.cmp.columnValueInput.style.top = `${topY}px`;
              // this.marginLeft = ConfigSc.sidebarSize + c.getGlobalX();
              // this.marginTop = c.getGlobalY();
              // this.selColumn = null;
              // CpspRef.cmp.indexOfVisibleColumn = undefined;
              // CpspRef.cmp.inputValue = text;

              // CpspRef.cmp.selectedColumnForEditing = column;
              // CpspRef.cmp.activityIndex = Number(activity.id);
              // CpspRef.cmp.planIndex = null;
              // CpspRef.cmp.activityY = activity.y;
              // this.highlightedRow = rowNumber;
              // this.showInput(this.marginLeft);
              // this.refreshDisplay();
            });
          });
          // c.setOnClickHandler((e) => {
          //   if (
          //     CpspRef.cmp.property_index !=
          //     CpspRef.cmp.revisions.length + 1
          //   ) {
          //     return;
          //   }


          //   CpspRef.cmp.changeFontFamilyInputValue = "Cursive";
          //   CpspRef.cmp.changeFontSizeInputValue = activity.styles.fontSize;
          //   CpspRef.cmp.changeFontFamilyInputValue = activity.styles.fontFamily;
          //   CpspRef.cmp.changeBackgroundColorInputValue =
          //     activity.styles.backgroundColor;
          //   CpspRef.cmp.changeTextColorInputValue = activity.styles.color;
          //   CpspRef.cmp.changeBackgroundTapeColorInputValue =
          //     activity.tape_color;
          //   CpspRef.cmp.changeFontWeightInputValue =
          //     activity.styles.fontWeight == "bold" ? true : false;
          //   CpspRef.cmp.changeFontStyleInputValue =
          //     activity.styles.fontStyle == "italic" ? true : false;
          //   CpspRef.cmp.changeFontDecorationInputValue =
          //     activity.styles.fontDecoration == "underline" ? true : false;

          //   CpspRef.cmp.hideColumnValueInput();
          //   this.selectedMomentsContainer = null;
          //   // CpspRef.cmp.planInput.style.display = "block";
          //   // CpspRef.cmp.planInput.style.textAlign = "left";
          //   // CpspRef.cmp.planInput.style.width = `${c.getWidth()}px`;
          //   // CpspRef.cmp.planInput.style.height = `${c.getHeight()}px`;
          //   // CpspRef.cmp.planInput.style.border = "3px solid #F77E04";
          //   CpspRef.cmp.planInput.value = text.toString();
          //   CpspRef.cmp.planInput.style.top = `${c.getGlobalY()}px`;

          //   const x = ConfigSc.sidebarSize + c.getGlobalX();
          //   this.marginLeft = x;
          //   this.marginTop = c.getGlobalY();
          //   this.selColumn = null;
          //   CpspRef.cmp.indexOfVisibleColumn = undefined;
          //   // CpspRef.cmp.planInput.style.left = `${x}px`;
          //   // CpspRef.cmp.planInput.focus();
          //   // CpspRef.cmp.planInput.select();

          //   CpspRef.cmp.selectedColumnForEditing = column;
          //   CpspRef.cmp.activityIndex = Number(activity.id);
          //   CpspRef.cmp.planIndex = null;
          //   CpspRef.cmp.activityY = activity.y;

          //   this.highlightedRow = rowNumber;
          //   CpspRef.cmp.tapeMomActId = null;
          //   this.showInput(x);
          //   this.refreshDisplay();
          // });
        } else if (
          (column.key === "days" ||
            column.key === "hours" ||
            column.key === "finished" ||
            column.key === "resource") &&
          !CpspRef.cmp.project.activities.some(
            (akt) => akt.activity == activity.id
          ) &&
          activity.description != null && activity.description != ""
          &&
          CpspRef.cmp.copySelectedProject.activities.find(act => act.id == activity.id).moments.length > 0
        ) {
          if (column.key == "days") {
            text = CpspRef.cmp
              .calculateDaysOfChildren(activity.id, 0)
              .toString();
          } else if (column.key == "hours") {
            text =
              CpspRef.cmp.calculateHoursOfChildren(activity.id, 0).toString() +
              " h";
          } else if (column.key === "finished"){
            text =
            CpspRef.cmp
              .calculateWorkedHoursOfChildren(activity.id, 0)
              .toString() + " h";
          }
          c.setOnMouseDownHandler(e => {
            this.firstMove = 0;
            this.selectedColumns(c,column,activity.id,null);

            c.addRemoveEventsForMouseDownEvent(e2 =>{
              this.setSelectedColums();
            })
          })

        }

        //for fake activity who is tape
        else if (
          !CpspRef.cmp.project.activities.some(
            (akt) => akt.activity == activity.id
          ) &&
          activity.moments.length == 0 &&
          activity.description != null &&
          activity.description != ""
        ) {
          if (column.key === "days") {
            let numberDays = 0;
            activity.dateSegments.forEach(dateSegment =>{
              numberDays += CpspRef.cmp.getBusinessDatesCount(
                dateSegment.startDate,
                dateSegment.endDate
              )
            })
            text = String(
              numberDays
            );
            c.setOnMouseDownHandler(e => {
              this.firstMove = 0;
              this.selectedColumns(c,column,activity.id,null);

              c.addRemoveEventsForMouseDownEvent(e2 =>{
                if(this.firstMove != 0){
                  this.setSelectedColums();
                  return;
                }
                this.selectedMomentsContainer = null;
              if (
                (CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.lockedRevision) ||
                !ConfigSc.isInEditMode
              ) {
                return;
              }

              CpspRef.cmp.hideColumnValueInput();

              // CpspRef.cmp.resourceWeekInput.style.display = "block";
              // CpspRef.cmp.resourceWeekInput.style.textAlign = "left";
              // CpspRef.cmp.resourceWeekInput.style.width = `${c.getWidth()}px`;
              // CpspRef.cmp.resourceWeekInput.style.height = `${c.getHeight()}px`;
              // CpspRef.cmp.resourceWeekInput.style.border = "3px solid #F77E04";
              CpspRef.cmp.resourceWeekInput.value = text.toString();
              CpspRef.cmp.resourceWeekInput.style.top = `${c.getGlobalY()}px`;
              const x = ConfigSc.sidebarSize + c.getGlobalX();
              this.marginLeft = x;
              this.marginTop = c.getGlobalY();
              this.selColumn = null;
              CpspRef.cmp.indexOfVisibleColumn = undefined;
              // CpspRef.cmp.resourceWeekInput.style.left = `${x}px`;
              // CpspRef.cmp.resourceWeekInput.focus();
              // CpspRef.cmp.resourceWeekInput.select();

              CpspRef.cmp.selectedColumnForEditing = column;
              CpspRef.cmp.activityIndex = Number(activity.id);
              CpspRef.cmp.planIndex = null;
              CpspRef.cmp.activityY = activity.y;

              this.highlightedRow = rowNumber;
              CpspRef.cmp.tapeMomActId = null;
              this.showInput(x);
              this.refreshDisplay();
              })
            })
          } else if (column.key === "hours") {
            const finish = CpspRef.cmp.getBusinessDatesCount(
              activity.startDate,
              activity.endDate
            );
            if (activity.time != null && activity.time > 0) {
              text = activity.time + " h";
            } else
              text =
                activity.number_of_workers > 0
                  ? activity.number_of_workers *
                      finish *
                      CpspRef.cmp.workingHours +
                    " h"
                  : 0 + " h";
                  c.setOnMouseDownHandler(e => {
                    this.firstMove = 0;
                    this.selectedColumns(c,column,activity.id,null);

                    c.addRemoveEventsForMouseDownEvent(e2 =>{
                      if(this.firstMove != 0){
                        this.setSelectedColums();
                        return;
                      }
                      this.selectedMomentsContainer = null;
                      if (
                        (CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.lockedRevision) ||
                        activity.moments.length > 0 ||
                !ConfigSc.isInEditMode
                      ) {
                        return;
                      }
                      CpspRef.cmp.hideColumnValueInput();
                      // CpspRef.cmp.resourceWeekInput.style.display = "block";
                      // CpspRef.cmp.resourceWeekInput.style.textAlign = "left";
                      // CpspRef.cmp.resourceWeekInput.style.width = `${c.getWidth()}px`;
                      // CpspRef.cmp.resourceWeekInput.style.height = `${c.getHeight()}px`;
                      // CpspRef.cmp.resourceWeekInput.style.border = "3px solid #F77E04";
                      CpspRef.cmp.resourceWeekInput.value = text.toString();
                      CpspRef.cmp.resourceWeekInput.value =
                        activity.time != null ? activity.time.toString() : "0";
                      CpspRef.cmp.resourceWeekInput.style.top = `${c.getGlobalY()}px`;
                      const x = ConfigSc.sidebarSize + c.getGlobalX();
                      this.marginLeft = x;
                      this.marginTop = c.getGlobalY();
                      this.selColumn = null;
                      CpspRef.cmp.indexOfVisibleColumn = undefined;
                      // CpspRef.cmp.resourceWeekInput.style.left = `${x}px`;
                      // CpspRef.cmp.resourceWeekInput.focus();
                      // CpspRef.cmp.resourceWeekInput.select();
                      CpspRef.cmp.selectedColumnForEditing = column;
                      CpspRef.cmp.activityIndex = Number(activity.id);
                      CpspRef.cmp.planIndex = null;
                      CpspRef.cmp.activityY = activity.y;

                      this.highlightedRow = rowNumber;
                      CpspRef.cmp.tapeMomActId = null;
                      this.showInput(x);
                      this.refreshDisplay();
                    })
                  })

          } else if (column.key === "finished") {
            // const finish = activity.dateSegments[0].currentWorkDate != null ? CpspRef.cmp.getBusinessDatesCount(activity.dateSegments[0].startWorkDate,activity.dateSegments[0].currentWorkDate) : 0
            // text = activity.number_of_workers > 0 && activity.dateSegments[0].currentWorkDate != null ? activity.number_of_workers * finish * 8 + " h" : 0 + " h";
            if (
              activity.dateSegments[0].finishedTime != null &&
              activity.dateSegments[0].finishedTime > 0
            ) {
              text = activity.dateSegments[0].finishedTime + " h";
            } else text = 0 + " h";
            c.setOnMouseDownHandler(e => {
              this.firstMove = 0;
              this.selectedColumns(c,column,activity.id,null);

              c.addRemoveEventsForMouseDownEvent(e2 =>{
                if(this.firstMove != 0){
                  this.setSelectedColums();
                  return;
                }
                this.selectedMomentsContainer = null;
              if (
                (CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.lockedRevision) ||
                !ConfigSc.isInEditMode
              ) {
                return;
              }
              CpspRef.cmp.hideColumnValueInput();
              // CpspRef.cmp.resourceWeekInput.style.display = "block";
              // CpspRef.cmp.resourceWeekInput.style.textAlign = "left";
              // CpspRef.cmp.resourceWeekInput.style.width = `${c.getWidth()}px`;
              // CpspRef.cmp.resourceWeekInput.style.height = `${c.getHeight()}px`;
              // CpspRef.cmp.resourceWeekInput.style.border = "3px solid #F77E04";
              CpspRef.cmp.resourceWeekInput.value = text.toString();
              CpspRef.cmp.resourceWeekInput.value =
                activity.dateSegments[0].finishedTime != null
                  ? activity.dateSegments[0].finishedTime.toString()
                  : "0";
              CpspRef.cmp.resourceWeekInput.style.top = `${c.getGlobalY()}px`;
              const x = ConfigSc.sidebarSize + c.getGlobalX();
              this.marginLeft = x;
              this.marginTop = c.getGlobalY();
              this.selColumn = null;
              CpspRef.cmp.indexOfVisibleColumn = undefined;
              // CpspRef.cmp.resourceWeekInput.style.left = `${x}px`;
              // CpspRef.cmp.resourceWeekInput.focus();
              // CpspRef.cmp.resourceWeekInput.select();

              CpspRef.cmp.selectedColumnForEditing = column;
              CpspRef.cmp.activityIndex = Number(activity.id);
              CpspRef.cmp.planIndex = null;
              CpspRef.cmp.activityY = activity.y;

              this.highlightedRow = rowNumber;
              CpspRef.cmp.tapeMomActId = null;
              this.showInput(x);
              this.refreshDisplay();
              })
            })
          } else if (column.key === "resource") {
            if (
              activity.number_of_workers != null &&
              activity.number_of_workers > 0 && CpspRef.cmp.copySelectedProject.activities.find(act => act.id == activity.id).moments.length == 0
            ) {
              text = String(Number(activity.number_of_workers));
            } else {
              text = "";
            }
            c.setOnMouseDownHandler(e => {
              this.firstMove = 0;
              this.selectedColumns(c,column,activity.id,null);

              c.addRemoveEventsForMouseDownEvent(e2 =>{
                if(this.firstMove != 0){
                  this.setSelectedColums();
                  return;
                }

                this.selectedMomentsContainer = null;
                if (
                  (CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.lockedRevision)||
                !ConfigSc.isInEditMode
                ) {
                  return;
                }
                CpspRef.cmp.hideColumnValueInput();
                // CpspRef.cmp.resourceWeekInput.style.display = "block";
                // CpspRef.cmp.resourceWeekInput.style.textAlign = "left";
                // CpspRef.cmp.resourceWeekInput.style.width = `${c.getWidth()}px`;
                // CpspRef.cmp.resourceWeekInput.style.height = `${c.getHeight()}px`;
                // CpspRef.cmp.resourceWeekInput.style.border = "3px solid #F77E04";
                CpspRef.cmp.resourceWeekInput.value = text.toString();
                CpspRef.cmp.resourceWeekInput.style.top = `${c.getGlobalY()}px`;
                const x = ConfigSc.sidebarSize + c.getGlobalX();
                this.marginLeft = x;
                this.marginTop = c.getGlobalY();
                this.selColumn = null;
                CpspRef.cmp.indexOfVisibleColumn = undefined;
                // CpspRef.cmp.resourceWeekInput.style.left = `${x}px`;
                // CpspRef.cmp.resourceWeekInput.focus();
                // CpspRef.cmp.resourceWeekInput.select();

                CpspRef.cmp.selectedColumnForEditing = column;
                CpspRef.cmp.activityIndex = Number(activity.id);
                CpspRef.cmp.planIndex = null;
                CpspRef.cmp.activityY = activity.y;

                this.highlightedRow = rowNumber;
                CpspRef.cmp.tapeMomActId = null;
                this.refreshDisplay();
                this.showInput(x);
              })
            })
          }


        }
      }
      if (
        !CpspRef.cmp.project.activities.some(
          (akt) => akt.activity == activity.id
        ) &&
        activity.moments.length == 0 &&
        (column.key == "start_date" || column.key === "end_date") &&
        ConfigSc.isInEditMode
      ) {
        c.setOnMouseDownHandler(e => {
          this.firstMove = 0;
          this.selectedColumns(c,column,activity.id,null);

          c.addRemoveEventsForMouseDownEvent(e2 =>{
            if(this.firstMove != 0){
              this.setSelectedColums();
              return;
            }
            this.selectedMomentsContainer = null;
            if ((CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.lockedRevision)) {
              return;
            }
            //only for fake activity and activity who is empt
            this.setColumnDoubleClickHandler(c, column, activity.id, null, text);
            this.highlightedRow = rowNumber;
            CpspRef.cmp.tapeMomActId = null;
            this.refreshDisplay();
          })
        })
        // c.setOnClickHandler((e) => {

        // });
      }

      const cText = new TextRenderer(text.toString(), this.canvas, c);
      if (activity.id <= 0) cText.setColor("black");
      cText.setColor(activity.styles.color);
      activity.moments.length > 0
        ? cText.setFontWeight("bold")
        : cText.setFontWeight(activity.styles.fontWeight);
      cText.setFontStyle(activity.styles.fontStyle);
      cText.setFontDecoration(activity.styles.fontDecoration);
      cText.setFontSize(Number(activity.styles.fontSize));
      cText.setFontFamily(activity.styles.fontFamily);
      cText.setAlignment("left", "center");
      if (column.key == "Details") cText.setX(23);
      else cText.setX(6);
      cText.updateTextDimensions();

      cText.setOnMouseHoverHandler(() => {
        if (column.key == "part" || column.key == "plan") {
          // const fullText = new TextRenderer(text.toString(), this.canvas, activityHeaderContainer);
          // fullText.setY(cText.getGlobalY() + ConfigSc.cellHeight);
          // fullText.setHeight(20);
          // fullText.setWidth(cText.getWidth());
          document.getElementById("mainCanvas").title = text.toString();
        } else document.getElementById("mainCanvas").title = "";
      });

      // cText.setOnDoubleClickHandler((e) => {
        if(ConfigSc.isInEditMode)
      cText.setOnMouseDownHandler((e) => {
        if ((CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.lockedRevision)) {
          return;
        }
        CpspRef.cmp.selectedColumns = [];
        this.firstMove = 0;
        CpspRef.cmp.changeFontFamilyInputValue = activity.styles.fontFamily;
        CpspRef.cmp.changeFontSizeInputValue = activity.styles.fontSize;
        CpspRef.cmp.changeBackgroundColorInputValue =
          activity.styles.backgroundColor;
        CpspRef.cmp.changeTextColorInputValue = activity.styles.color;
        CpspRef.cmp.changeBackgroundTapeColorInputValue = activity.tape_color;
        CpspRef.cmp.changeFontWeightInputValue =
          activity.styles.fontWeight == "bold" ? true : false;
        CpspRef.cmp.changeFontStyleInputValue =
          activity.styles.fontStyle == "italic" ? true : false;
        CpspRef.cmp.changeFontDecorationInputValue =
          activity.styles.fontDecoration == "underline" ? true : false;

        if (column.key === "Details") {
          ConfigSc.firstMomentBoxSelectedPositionDelta = activity.y;
          this.firstMomentBoxSelectedPosition = e.offsetY;
          ConfigSc.deltaMovementBetweenBoxes = 0;

          //document.body.style.cursor = "crosshair";
          // this.canvas.getCanvasElement().onmousemove = (e2) => {
          //   if (e2.movementY != 0 && firstMove == 0) {
          //     CpspRef.cmp.activityIndex = activity.id;
          //     CpspRef.cmp.planIndex = null;
          //     //this.createSelectedMomentsContainer(e.offsetX, e.offsetY - ConfigSc.toolboxSize);
          //     this.createSelectedMomentsContainer(
          //       e.layerX,
          //       e.layerY - ConfigSc.toolboxSize
          //     );
          //     firstMove = 1;
          //     this.highlightedRow = null;
          //     this.refreshDisplay();
          //   }
          // };
          this.selectedColumns(c,column,activity.id,null);
        } else {
          this.firstMove = 0;
          this.activityIndex = Number(activity.id);
          this.planIndex = null;
          this.selectedColumns(c,column,activity.id,null);
        }

        cText.addRemoveEventsForMouseDownEvent(() => {
          if ((CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.lockedRevision)) {
            return;
          }
          if (column.key === "Details") {
            if(this.firstMove != 0){
              this.setSelectedColums();
              return;
            }
            this.highlightedRow = rowNumber;
            CpspRef.cmp.tapeMomActId = null;
            this.selectedMomentsContainer = null;
            if (
              this.getMomentTableBodyContainer()
                .getHorizontalScrollbar()
                .getSlider()
                .getX() > 0
            ) {
              const move_x_left = -this.getMomentTableBodyContainer()
                .getHorizontalScrollbar()
                .getSlider()
                .getX();
              this.getMomentTableBodyContainer()
                .getHorizontalScrollbar()
                .getSlider()
                .move(move_x_left);
              this.refreshDisplay();
            }
            this.refreshDisplay();
            // CpspRef.cmp.columnValueInput.style.display = "block";
            // CpspRef.cmp.columnValueInput.style.textAlign = "left";
            // CpspRef.cmp.columnValueInput.style.width = `${c.getWidth()}px`;
            // CpspRef.cmp.columnValueInput.style.height = `${c.getHeight()}px`;
            // CpspRef.cmp.columnValueInput.style.border = "3px solid #F77E04";
            // CpspRef.cmp.columnValueInput.value = text;
            const topY = c.getGlobalY();
            CpspRef.cmp.columnValueInput.style.top = `${topY}px`;
            this.marginLeft = ConfigSc.sidebarSize + c.getGlobalX();
            this.marginTop = topY;
            this.selColumn = null;
            CpspRef.cmp.indexOfVisibleColumn = undefined;
            // const x = ConfigSc.sidebarSize + ProjectMomentsTableHead.threeVerticalDotsColumnWidth;
            // CpspRef.cmp.columnValueInput.style.left = `${x}px`;
            // CpspRef.cmp.columnValueInput.style.pointerEvents = "auto"
            // CpspRef.cmp.deleteDetails = true;
            //CpspRef.cmp.columnValueInput.focus();
            //CpspRef.cmp.columnValueInput.select();

            // document.getElementById("columnValueEditInput1").style.display = "block"
            // document.getElementById("columnValueEditInput1").style.textAlign = "left";
            // //document.getElementById("columnValueEditInput1").style.backgroundColor = activity.styles.backgroundColor;
            // //document.getElementById("columnValueEditInput1").focus();
            // document.getElementById("selectValue").style.display = "block"
            CpspRef.cmp.inputValue = text;

            CpspRef.cmp.selectedColumnForEditing = column;
            CpspRef.cmp.activityIndex = Number(activity.id);
            CpspRef.cmp.planIndex = null;
            CpspRef.cmp.activityY = activity.y;
            this.showInput(this.marginLeft);
          } else if (column.key === "hours"
          ) {
            if(this.firstMove != 0){
              this.setSelectedColums();
              return;
            }
            if(activity.moments.length > 0) return;
            CpspRef.cmp.hideColumnValueInput();
            // CpspRef.cmp.resourceWeekInput.style.display = "block";
            // CpspRef.cmp.resourceWeekInput.style.textAlign = "left";
            // CpspRef.cmp.resourceWeekInput.style.width = `${c.getWidth()}px`;
            // CpspRef.cmp.resourceWeekInput.style.height = `${c.getHeight()}px`;
            // CpspRef.cmp.resourceWeekInput.style.border = "3px solid #F77E04";
            CpspRef.cmp.resourceWeekInput.value =
              activity.time != null ? activity.time.toString() : "0";
            CpspRef.cmp.resourceWeekInput.style.top = `${c.getGlobalY()}px`;
            const x = ConfigSc.sidebarSize + c.getGlobalX();
            this.marginLeft = x;
            this.marginTop = c.getGlobalY();
            this.selColumn = null;
            CpspRef.cmp.indexOfVisibleColumn = undefined;
            // CpspRef.cmp.resourceWeekInput.style.left = `${x}px`;
            // CpspRef.cmp.resourceWeekInput.focus();
            // CpspRef.cmp.resourceWeekInput.select();

            CpspRef.cmp.selectedColumnForEditing = column;
            CpspRef.cmp.activityIndex = Number(activity.id);
            CpspRef.cmp.planIndex = null;
            CpspRef.cmp.activityY = activity.y;
            this.showInput(x);
          } else if (column.key === "days"
          ) {
            if(this.firstMove != 0){
              this.setSelectedColums();
              return;
            }
            if(activity.moments.length > 0) return;
            CpspRef.cmp.hideColumnValueInput();
            // CpspRef.cmp.resourceWeekInput.style.display = "block";
            // CpspRef.cmp.resourceWeekInput.style.textAlign = "left";
            // CpspRef.cmp.resourceWeekInput.style.width = `${c.getWidth()}px`;
            // CpspRef.cmp.resourceWeekInput.style.height = `${c.getHeight()}px`;
            // CpspRef.cmp.resourceWeekInput.style.border = "3px solid #F77E04";

            let numberDays = 0;
            activity.dateSegments.forEach(dateSegment =>{
              numberDays += CpspRef.cmp.getBusinessDatesCount(
                dateSegment.startDate,
                dateSegment.endDate
              )
            })

            CpspRef.cmp.resourceWeekInput.value = numberDays.toString()
            CpspRef.cmp.resourceWeekInput.style.top = `${c.getGlobalY()}px`;
            const x = ConfigSc.sidebarSize + c.getGlobalX();
            this.marginLeft = x;
            this.marginTop = c.getGlobalY();
            this.selColumn = null;
            CpspRef.cmp.indexOfVisibleColumn = undefined;
            // CpspRef.cmp.resourceWeekInput.style.left = `${x}px`;
            // CpspRef.cmp.resourceWeekInput.focus();
            // CpspRef.cmp.resourceWeekInput.select();

            CpspRef.cmp.selectedColumnForEditing = column;
            CpspRef.cmp.activityIndex = Number(activity.id);
            CpspRef.cmp.planIndex = null;
            CpspRef.cmp.activityY = activity.y;
            this.showInput(x);
          } else if (column.key === "resource"
          ) {
            if(this.firstMove != 0){
              this.setSelectedColums();
              return;
            }
            if(activity.moments.length > 0) return;
            CpspRef.cmp.hideColumnValueInput();
            // CpspRef.cmp.resourceWeekInput.style.display = "block";
            // CpspRef.cmp.resourceWeekInput.style.textAlign = "left";
            // CpspRef.cmp.resourceWeekInput.style.width = `${c.getWidth()}px`;
            // CpspRef.cmp.resourceWeekInput.style.height = `${c.getHeight()}px`;
            // CpspRef.cmp.resourceWeekInput.style.border = "3px solid #F77E04";

            CpspRef.cmp.resourceWeekInput.value = activity.number_of_workers != null ? activity.number_of_workers.toString() : "0"
            CpspRef.cmp.resourceWeekInput.style.top = `${c.getGlobalY()}px`;
            const x = ConfigSc.sidebarSize + c.getGlobalX();
            this.marginLeft = x;
            this.marginTop = c.getGlobalY();
            this.selColumn = null;
            CpspRef.cmp.indexOfVisibleColumn = undefined;
            // CpspRef.cmp.resourceWeekInput.style.left = `${x}px`;
            // CpspRef.cmp.resourceWeekInput.focus();
            // CpspRef.cmp.resourceWeekInput.select();

            CpspRef.cmp.selectedColumnForEditing = column;
            CpspRef.cmp.activityIndex = Number(activity.id);
            CpspRef.cmp.planIndex = null;
            CpspRef.cmp.activityY = activity.y;
            this.showInput(x);
          } else if (
            column.key === "finished"
          ) {
            if(this.firstMove != 0){
              this.setSelectedColums();
              return;
            }
            if(activity.moments.length > 0) return;
            CpspRef.cmp.hideColumnValueInput();
            // CpspRef.cmp.resourceWeekInput.style.display = "block";
            // CpspRef.cmp.resourceWeekInput.style.textAlign = "left";
            // CpspRef.cmp.resourceWeekInput.style.width = `${c.getWidth()}px`;
            // CpspRef.cmp.resourceWeekInput.style.height = `${c.getHeight()}px`;
            // CpspRef.cmp.resourceWeekInput.style.border = "3px solid #F77E04";
            CpspRef.cmp.resourceWeekInput.value =
              activity.dateSegments[0].finishedTime != null
                ? activity.dateSegments[0].finishedTime.toString()
                : "0";
            CpspRef.cmp.resourceWeekInput.style.top = `${c.getGlobalY()}px`;
            const x = ConfigSc.sidebarSize + c.getGlobalX();
            this.marginLeft = x;
            this.marginTop = c.getGlobalY();
            this.selColumn = null;
            CpspRef.cmp.indexOfVisibleColumn = undefined;
            // CpspRef.cmp.resourceWeekInput.style.left = `${x}px`;
            // CpspRef.cmp.resourceWeekInput.focus();
            // CpspRef.cmp.resourceWeekInput.select();

            CpspRef.cmp.selectedColumnForEditing = column;
            CpspRef.cmp.activityIndex = Number(activity.id);
            CpspRef.cmp.planIndex = null;
            CpspRef.cmp.activityY = activity.y;
            this.showInput(x);
          } else if (column.key === "plan" || column.key === "part") {
            if(this.firstMove != 0){
              this.setSelectedColums();
              return;
            }
            CpspRef.cmp.hideColumnValueInput();

            // CpspRef.cmp.planInput.style.display = "block";
            // CpspRef.cmp.planInput.style.textAlign = "left";
            // CpspRef.cmp.planInput.style.width = `${c.getWidth()}px`;
            // CpspRef.cmp.planInput.style.height = `${c.getHeight()}px`;
            // CpspRef.cmp.planInput.style.border = "3px solid #F77E04";
            CpspRef.cmp.planInput.value = text.toString();
            CpspRef.cmp.planInput.style.top = `${c.getGlobalY()}px`;
            const x = ConfigSc.sidebarSize + c.getGlobalX();
            this.marginLeft = x;
            this.marginTop = c.getGlobalY();
            this.selColumn = null;
            CpspRef.cmp.indexOfVisibleColumn = undefined;
            // CpspRef.cmp.planInput.style.left = `${x}px`;
            // CpspRef.cmp.planInput.focus();
            // CpspRef.cmp.planInput.select();

            CpspRef.cmp.selectedColumnForEditing = column;
            CpspRef.cmp.activityIndex = Number(activity.id);
            CpspRef.cmp.planIndex = null;
            CpspRef.cmp.activityY = activity.y;

            this.highlightedRow = rowNumber;
            CpspRef.cmp.tapeMomActId = null;
            this.showInput(x);
            this.refreshDisplay();
          } else {
            let columnText = "";
            if (
              column.values[CpspRef.cmp.project.id] &&
              column.values[CpspRef.cmp.project.id].activities[activity.id]
            ) {
              columnText =
                column.values[CpspRef.cmp.project.id].activities[activity.id].value;
            }

            CpspRef.cmp.newColumnValueInput.value = columnText.toString();
            CpspRef.cmp.newColumnValueInput.style.top = `${c.getGlobalY()}px`;
            const x = ConfigSc.sidebarSize + c.getGlobalX();
            this.marginLeft = x;
            this.marginTop = c.getGlobalY();
            this.selColumn = null;
            CpspRef.cmp.indexOfVisibleColumn = undefined;
            // CpspRef.cmp.planInput.style.left = `${x}px`;
            // CpspRef.cmp.planInput.focus();
            // CpspRef.cmp.planInput.select();

            CpspRef.cmp.selectedColumnForEditing = column;
            CpspRef.cmp.activityIndex = Number(activity.id);
            CpspRef.cmp.planIndex = null;
            CpspRef.cmp.activityY = activity.y;

            this.highlightedRow = rowNumber;
            CpspRef.cmp.tapeMomActId = null;
            this.showInput(x);
            this.refreshDisplay();
          }

          //only for fake activity and activity who is empt
          if (
            !CpspRef.cmp.project.activities.some(
              (akt) => akt.activity == activity.id
            ) &&
            activity.moments.length == 0 &&
            (column.key == "start_date" || column.key === "end_date")
          ) {
            if(this.firstMove != 0){
              this.setSelectedColums();
              return;
            }
            if(activity.moments.length > 0) return;
            this.setColumnDoubleClickHandler(
              c,
              column,
              activity.id,
              null,
              text
            );
          }
        });
        this.selectedMomentsContainer = null;
        this.highlightedRow = rowNumber;
        CpspRef.cmp.tapeMomActId = null;
        this.refreshDisplay();
      });
    });

    const momentsContainer = new GenericContainer(
      0,
      ConfigSc.cellHeight,
      "100%",
      activityContainer.getHeight() - ConfigSc.cellHeight,
      this.canvas,
      activityContainer
    );

    momentsContainer.setBackgroundColor("white");

    const activityDateSegmentContainer = new GenericContainer(
      0,
      activity.y,
      CpspRef.cmp.pixelRation >= 1 ?
        CpspRef.cmp.projectSchedulePlanerApp.gridContainer
          .getInnerContainer()
          .getWidth() * CpspRef.cmp.pixelRation :
        CpspRef.cmp.projectSchedulePlanerApp.gridContainer
          .getInnerContainer()
          .getWidth() / CpspRef.cmp.pixelRation,
      activity.moments.length * ConfigSc.cellHeight + ConfigSc.cellHeight,
      CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
      CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer()
    );

    activityDateSegmentContainer.setOnMouseDownHandler((e) => {
      if ((CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.lockedRevision) || !ConfigSc.isInEditMode) {
        return;
      }
      // if(activity.description != null) return;
      // let numberOfRow = Math.floor((e.layerY - ConfigSc.toolboxSize - CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.getHeight() - activity.y) / ConfigSc.cellHeight);
      let numberOfRow = Math.floor((e.layerY-activityDateSegmentContainer.getGlobalY()) / ConfigSc.cellHeight);
      if(numberOfRow == 0 && activity.description != null) return;
      else if(numberOfRow > 0 && activity.moments.at(numberOfRow - 1).name != "") return;
      let new_x = (CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.getFirstChild().getX() * (-1)) +
                    (e.layerX - ConfigSc.sideCanvasSize)

      this.createSelectedMomentsContainerOnGrid(
        new_x,
        numberOfRow * ConfigSc.cellHeight,
        activityDateSegmentContainer,
        activity
      );

    })

    // let condition = false;
    if (
      CpspRef.cmp.copySelectedProject.activities.find(
        (a) => a.id == activity.id
      ).moments.length > 0 ||
      activity.number != ""
    ) {
      const activitySegment = new ProjectSegment(
        activity.x * CpspRef.cmp.pixelRation,
        ConfigSc.cellHeight / 4,
        activity.numberOfDays *
          ConfigSc.cellWidth *
          (activity.percentage_of_realized_activity / 100) * CpspRef.cmp.pixelRation,
        ConfigSc.cellHeight / 4,
        CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
        activityDateSegmentContainer,
        activity.id
      );
      // if (activity.percentage_of_realized_activity == 100) condition = true;

      activitySegment.setBackgroundColor("#77BA6E");
      activitySegment.setBorderRoundness(0);
      activitySegment.setOnClickHandler(() => {});
      const projectIndex = activity.id;
      const momentIndex = 0;
      const dateSegmentIndex = 0;
      const dateSegmentContainer = new DateSegment(
        activity.x * CpspRef.cmp.pixelRation,
        ConfigSc.cellHeight / 4,
        activity.numberOfDays * ConfigSc.cellWidth * CpspRef.cmp.pixelRation,
        ConfigSc.cellHeight - 10,
        CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
        activityDateSegmentContainer,
        { projectIndex, momentIndex, dateSegmentIndex }
      );
      dateSegmentContainer.setBackgroundColor("#77BA6E");
      dateSegmentContainer.setBorderRoundness(0);
      dateSegmentContainer.setHeight(ConfigSc.cellHeight / 4);
      dateSegmentContainer.setWidth(
        CpspRef.cmp.getPercentageOfFinished(projectIndex, momentIndex) *
          ConfigSc.cellWidth * CpspRef.cmp.pixelRation
      );
      const xPos = CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(new Date(activity.dateSegments.at(0).startDate))
      const momentBridge = new BezierCurveBridge(
        (xPos + activity.numberOfDays * ConfigSc.cellWidth) * CpspRef.cmp.pixelRation,
        (3 * ConfigSc.cellHeight) / 4,
        xPos * CpspRef.cmp.pixelRation,
        (3 * ConfigSc.cellHeight) / 4,
        CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
        activityDateSegmentContainer
      );
      momentBridge.setBackgroundColor("black");
    } else if (activity.description != null && activity.description != ""){
      this.drawActivityTape(activity,activityDateSegmentContainer,percentageWork);
    }

    if(CpspRef.cmp.checked){
      const actEndDate = momentM(activity.dateSegments.at(-1).endDate).add(1,"days");
      const nameOfActivity = new ProjectColumn(
        (CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(new Date(actEndDate.format(ConfigSc.dateFormat))) + (ConfigSc.cellWidth / 2)) * CpspRef.cmp.pixelRation ,
        5,
        (this.canvas
          .getContext()
          .measureText(activity.description).width + 5),
        14,
        this.canvas,
        activityDateSegmentContainer
      );
      nameOfActivity.setBackgroundColor("transparent");
      const cText = new TextRenderer(
        activity.description,
        this.canvas,
        nameOfActivity
      );
      cText.setAlignment("left", "center");
      cText.setFontStyle("bold");
    }

    if (
      activity.dateSegments[0].noted != null &&
      activity.dateSegments[0].noted > 0
    ) {


      const copyActivity = CpspRef.cmp.copySelectedProject.activities.find(
        (a) => a.id == activity.id
      );
      const segmentWidth = activity.numberOfDays * ConfigSc.cellWidth * CpspRef.cmp.pixelRation;
      let notePosition = (activity.x + segmentWidth + 4) * CpspRef.cmp.pixelRation;
      let noteText: string;
      let daysMoved: number;

      const noteTextAndPosition = activity.dateSegments[0].noteText.split("%");

      // check if there is date in notetextandposition array
      if (noteTextAndPosition.length == 1) {
        notePosition = (CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(new Date(activity.dateSegments.at(-1).endDate)) + ConfigSc.cellWidth) * CpspRef.cmp.pixelRation;
        noteText = noteTextAndPosition[0] ? noteTextAndPosition[0] : "";
      } else {
        notePosition = CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(new Date(noteTextAndPosition[0])) * CpspRef.cmp.pixelRation;
        noteText = noteTextAndPosition[1];
      }

      const c = new ProjectColumn(
        notePosition + 12 ,
        5,
        (this.canvas
          .getContext()
          .measureText(noteText).width + 5),
        14,
        this.canvas,
        activityDateSegmentContainer
      );
      c.setBackgroundColor("white");

      const iconShape = new Rectangle(
        notePosition,
        c.getY(),
        CpspRef.cmp.pixelRation >= 1 ?
            12 * CpspRef.cmp.pixelRation :
            12 / CpspRef.cmp.pixelRation,
        14,
        this.canvas,
        activityDateSegmentContainer
      );
      iconShape.addBackgroundImagePattern(
        // condition ? "flag-green" : "flag-red",
        // condition ? "flag-green" : "flag-red",
        CpspRef.cmp.notes[activity.dateSegments[0].noted - 1],
        CpspRef.cmp.notes[activity.dateSegments[0].noted - 1],
        12,
        14
      );

      iconShape.setOnMouseDownHandler(() => {
        let movingNote = true;
        let compareMovement = 0;
        CpspRef.cmp.activityIndex = activity.id;
        CpspRef.cmp.planIndex = null;

        window.addEventListener("mousemove", (ev) => {
          if(movingNote){
            notePosition += ev.movementX;
            compareMovement = daysMoved;
            daysMoved = Math.round(((notePosition/CpspRef.cmp.pixelRation) - activity.x) / 15);
            activity.dateSegments[0].noteText = moment(activity.startDate, ConfigSc.dateFormat).add("d", daysMoved).format(ConfigSc.dateFormat) + "%" + noteText;
            if (compareMovement != daysMoved) {
              iconShape.setX(notePosition-4)
              c.setX(notePosition + 12)
              this.canvas.resetDrawingContainers();
            }
          }
        });

        iconShape.addRemoveEventsForMouseDownEvent(() => {
          movingNote = false;
          copyActivity.dateSegments[0].noteText = this.deepCopy(activity.dateSegments[0].noteText);
          document.body.style.cursor = "default"
          CpspRef.cmp.updateNote({ target: { value: noteText } });

          // const s = new GenericContainer(
          //   iconShape.getX() + 100,
          //   iconShape.getY(),
          //   ConfigSc.cellWidth,
          //   ConfigSc.cellHeight,
          //   iconShape.getCanvas(),
          //   iconShape.getParent()
          // )
          // s.setBackgroundColor("red");
          // s.draw();
          const dropdownMenu = new DropdownMenu(
            iconShape.getGlobalX(),
            iconShape.getGlobalY() - ConfigSc.cellHeight,
            50,
            200,
            this.canvas
          );

          dropdownMenu.addOption(
            CpspRef.cmp.getTranslate().instant("Delete"),
            (e) => {
              CpspRef.cmp.selectedMomentsForStyleChange = [];
              // CpspRef.cmp.selectedMomentsForStyleChange.push({
              //   projectId: CpspRef.cmp.selectedProject.id,
              //   activityId: activity.id,
              //   stateType: null,
              //   moment: activity,
              //   planId: null,
              //   y: activity.y,
              // });
              CpspRef.cmp.selectedMomentsForStyleChange.push(activity);

              CpspRef.cmp.showConfirmationModal(
                CpspRef.cmp.getTranslate().instant("Do you want to delete?"),
                async (response) => {
                  if (response.result) {
                    if (CpspRef.cmp.loading) {
                      return;
                    }
                    CpspRef.cmp.setLoadingStatus(true);
                    CpspRef.cmp.addNewNote(0);
                    CpspRef.cmp.setLoadingStatus(false);
                  }
                }
              );

            });

            dropdownMenu.open();
        });
      });

      iconShape.setOnMouseHoverHandler((e) =>(document.body.style.cursor = "move"));


      //c.setBorder("#9d9d9d", 1);
      const cText = new TextRenderer(
        noteText,
        this.canvas,
        c
      );
      cText.setAlignment("left", "center");


      c.setOnClickHandler((e) => {
        this.selectedMomentsContainer = null;
        if ((CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.lockedRevision)) {
          return;
        }
        CpspRef.cmp.hideColumnValueInput();
        CpspRef.cmp.noteInput.style.display = "block";
        CpspRef.cmp.noteInput.style.textAlign = "left";
        CpspRef.cmp.noteInput.style.width = `${c.getWidth()}px`;
        CpspRef.cmp.noteInput.style.height = `${c.getHeight()}px`;
        CpspRef.cmp.noteInput.style.border = "3px solid #F77E04";
        CpspRef.cmp.noteInput.value =
          activity.dateSegments[0].noteText.toString();
        CpspRef.cmp.noteInput.style.top = `${c.getGlobalY()}px`;
        const x = ConfigSc.sidebarSize + c.getGlobalX();
        CpspRef.cmp.noteInput.style.left = `${x}px`;
        CpspRef.cmp.noteInput.focus();
        CpspRef.cmp.noteInput.select();

        CpspRef.cmp.activityIndex = activity.id;
        CpspRef.cmp.planIndex = null;
        CpspRef.cmp.activityY = activity.y;
      });
    }



    if (
      this.highlightedRow === rowNumber //||
      // (activity.id != null && activity.id === CpspRef.cmp.tapeMomActId)
    ) {
      CpspRef.cmp.selectedMomentsForStyleChange = [];
      // CpspRef.cmp.selectedMomentsForStyleChange.push({
      //   projectId: CpspRef.cmp.selectedProject.id,
      //   activityId: activity.id,
      //   stateType: null,
      //   moment: activity,
      //   planId: null,
      //   y: activity.y,
      // });
      CpspRef.cmp.selectedMomentsForStyleChange.push(activity);
      CpspRef.cmp.activityIndex = activity.id;
      CpspRef.cmp.planIndex = null;
      this.setValues();
      this.renderHighlightedLines(activityHeaderContainer);
      this.renderHighlightedLines(activityDateSegmentContainer);
    }

    this.renderProjectMoments(
      activity,
      momentsContainer,
      activity.id,
      activityDateSegmentContainer,
      projectIndex
    );

    return true;
  }

  selectedColumns(c,column,actIndex,planIndex){
    CpspRef.cmp.hideColumnValueInput();
    CpspRef.cmp.hideResourceWeekInput();
    CpspRef.cmp.hidePlanInput();
    CpspRef.cmp.selectedMomentsForStyleChange = [];
    this.selectedColIndex = CpspRef.cmp.visibleColumns.findIndex(col => col.key == column.key)
            let constDiff = c.getGlobalX() - column.x;
            this.canvas.getCanvasElement().onmousemove = (e2) => {
              if ((e2.movementY != 0 || e2.movementX != 0) && this.firstMove == 0) {
                // CpspRef.cmp.activityIndex = activity.id;
                // CpspRef.cmp.planIndex = null;
                //this.createSelectedMomentsContainer(e.offsetX, e.offsetY - ConfigSc.toolboxSize);
                // this.createSelectedMomentsContainer(
                //   e.layerX,
                //   e.layerY - ConfigSc.toolboxSize
                // );

                // this.createSelectedMomentsContainerColumns(c,column);
                CpspRef.cmp.selectedColumns = [];

                let startY = c.getParent().getParent().getParent() == this.momentTableBodyContainer.getInnerContainer() ?
                            c.getParent().getParent().getY() :
                            c.getParent().getParent().getParent().getY() + c.getParent().getY() + ConfigSc.cellHeight;

                this.selectedCol = new GenericContainer(
                  c.getX(),
                  startY,
                  c.getWidth(),
                  c.getHeight(),
                  c.getCanvas(),
                  // c.getParent()
                  this.momentTableBodyContainer.getInnerContainer()
                );

                this.selectedCol.setBorder("red",3)

                this.firstMove = 1;
                this.activityIndex = Number(actIndex);
                this.planIndex = planIndex;
                this.highlightedRow = null;
                this.leftColInd = this.selectedColIndex;
                this.rightColInd = this.selectedColIndex;
                this.refreshDisplay();
                this.selectedCol.draw();
              } else {
                if (this.selectedCol) {
                  if(e2.offsetX > c.getGlobalX() + c.getWidth()){
                    this.rightColInd = CpspRef.cmp.visibleColumns.findIndex(col => e2.offsetX < col.x + constDiff + col.width);
                    this.selectedCol.setX(c.getX());
                    this.selectedCol.setWidth(CpspRef.cmp.visibleColumns.at(this.rightColInd).x + CpspRef.cmp.visibleColumns.at(this.rightColInd).width - CpspRef.cmp.visibleColumns.at(this.selectedColIndex).x)
                    this.canvas.resetDrawingContainers();
                    this.selectedCol.draw()
                    this.leftColInd = -1;
                  } else if(e2.offsetX < c.getGlobalX()) {
                    this.leftColInd = CpspRef.cmp.visibleColumns.findIndex(col => e2.offsetX < col.x + constDiff);
                    if(this.leftColInd > 0){
                      this.selectedCol.setX(c.getX() - (CpspRef.cmp.visibleColumns.at(this.selectedColIndex).x - CpspRef.cmp.visibleColumns.at(this.leftColInd - 1).x));
                      this.selectedCol.setWidth(c.getWidth() + (CpspRef.cmp.visibleColumns.at(this.selectedColIndex).x - CpspRef.cmp.visibleColumns.at(this.leftColInd - 1).x));
                      this.canvas.resetDrawingContainers();
                      this.selectedCol.draw()
                    }

                    this.rightColInd = -1;
                  } else {
                    this.selectedCol.setX(c.getX());
                    this.selectedCol.setWidth(c.getWidth())
                    this.canvas.resetDrawingContainers();
                    this.selectedCol.draw()
                  }

                  if(e2.offsetY > c.getGlobalY() + ConfigSc.cellHeight){
                    // let newHeight = Math.ceil(e2.offsetY / ConfigSc.cellHeight) * ConfigSc.cellHeight - c.getGlobalY() - 3
                    let newHeight = Math.ceil((e2.offsetY - c.getGlobalY())/ConfigSc.cellHeight) * ConfigSc.cellHeight;
                    let startY1 = c.getParent().getParent().getParent() == this.momentTableBodyContainer.getInnerContainer() ?
                            c.getParent().getParent().getY() :
                            c.getParent().getParent().getParent().getY() + c.getParent().getY() + ConfigSc.cellHeight;
                    this.selectedCol.setY(startY1);
                    this.selectedCol.setHeight(newHeight)
                    this.canvas.resetDrawingContainers();
                    this.selectedCol.draw()
                  } else if(e2.offsetY < c.getGlobalY()){
                    // let newHeight = c.getGlobalY() + c.getHeight() - Math.floor(e2.offsetY / ConfigSc.cellHeight) * ConfigSc.cellHeight + 3;
                    let newHeight =   Math.ceil(( c.getGlobalY() + c.getHeight() - e2.offsetY)/ConfigSc.cellHeight) * ConfigSc.cellHeight
                    // e2.offsetY - (e2.offsetY % ConfigSc.cellHeight) - c.getGlobalY() + ConfigSc.cellHeight;
                    let startY2 = c.getParent().getParent().getParent() == this.momentTableBodyContainer.getInnerContainer() ?
                            c.getParent().getParent().getY() :
                            c.getParent().getParent().getParent().getY() + c.getParent().getY() + ConfigSc.cellHeight;
                    this.selectedCol.setY(startY2 - newHeight + ConfigSc.cellHeight);
                    this.selectedCol.setHeight(newHeight)
                    this.canvas.resetDrawingContainers();
                    this.selectedCol.draw()
                  } else {
                    let startY3 = c.getParent().getParent().getParent() == this.momentTableBodyContainer.getInnerContainer() ?
                            c.getParent().getParent().getY() :
                            c.getParent().getParent().getParent().getY() + c.getParent().getY() + ConfigSc.cellHeight;
                    this.selectedCol.setY(startY3);
                    this.selectedCol.setHeight(c.getHeight())
                    this.canvas.resetDrawingContainers();
                    this.selectedCol.draw()
                  }
                }

              }
            };

  }

  setSelectedColums(){
    CpspRef.cmp.selectedMomentsForStyleChange = [];
    if (this.leftColInd == -1){
      while(this.selectedColIndex <= this.rightColInd){
        CpspRef.cmp.selectedColumns.push(CpspRef.cmp.visibleColumns.at(this.selectedColIndex));
        this.selectedColIndex++;
      }
    } else if (this.rightColInd == -1){
      this.leftColInd--;
      while(this.leftColInd <= this.selectedColIndex){
        CpspRef.cmp.selectedColumns.push(CpspRef.cmp.visibleColumns.at(this.leftColInd));
        this.leftColInd++;
      }
    } else {
      CpspRef.cmp.selectedColumns = [];
      CpspRef.cmp.selectedColumns.push(CpspRef.cmp.visibleColumns.at(this.selectedColIndex));
    }
    this.selectedMoments();
  }

  public selectedMoments(){
    let moments = [];
    // let startY = this.selectedCol.getGlobalY() - this.momentTableBodyContainer.getGlobalY();
    if(this.selectedCol == undefined || this.selectedCol == null)
      return moments;
    let numMoments = Math.round(this.selectedCol.getHeight()/ConfigSc.cellHeight);
    let actIndex = CpspRef.cmp.selectedProject.activities.findIndex(activity => activity.id == this.activityIndex);
    let momIndex = CpspRef.cmp.selectedProject.activities.at(actIndex).moments.findIndex(mom => mom.id == this.planIndex)
    // actIndex--;

    // for(actIndex ; actIndex < CpspRef.cmp.selectedProject.activities.length; actIndex++){
    //   if(numMoments == 0) break;
    //   let activity = CpspRef.cmp.selectedProject.activities.at(actIndex);
    //   if(momIndex == -1){
    //     moments.push(activity);
    //     numMoments--;
    //     momIndex++;
    //   }
    //   for(momIndex; momIndex < activity.moments.length; momIndex++){
    //     if(numMoments == 0) break;
    //     // if(activity.moments.at(i).y + activity.y + ConfigSc.cellHeight >= startY){
    //       moments.push(activity.moments.at(momIndex));
    //       numMoments--;
    //     // }
    //   }
    //   momIndex = -1;
    // }

    let startY = this.selectedCol.getY()
    // this.selectedCol.getParent().getParent().getParent().getY() <= -0 ?
    //   this.selectedCol.getParent().getParent().getY() :
    //   this.selectedCol.getParent().getParent().getParent().getY() + this.selectedCol.getParent().getY() + ConfigSc.cellHeight;
    //this.selectedCol.getGlobalY() - this.getMomentTableBodyContainer().getGlobalY();

    for(actIndex = 0 ; actIndex < CpspRef.cmp.selectedProject.activities.length; actIndex++){
      if(numMoments == 0) break;
      let activity = CpspRef.cmp.selectedProject.activities.at(actIndex);
      if(activity.y >= startY){
        moments.push(activity);
        numMoments--;
      }
      // if(moments.length == 0 && activity.moments.length > 0 && activity.y + activity.moments.length * ConfigSc.cellHeight > startY) continue;
      for(momIndex = 0; momIndex < activity.moments.length; momIndex++){
        if(numMoments == 0) break;
        if(activity.moments.at(momIndex).y + activity.y + ConfigSc.cellHeight >= startY){
          moments.push(activity.moments.at(momIndex));
          numMoments--;
        }
      }
    }

    CpspRef.cmp.activityIndex = moments.at(0).activity_id ? moments.at(0).activity_id : moments.at(0).id;
    CpspRef.cmp.planIndex = moments.at(0).activity_id ? moments.at(0).id : null;

    this.selectedMomentsContainer = new SelectedMomentsContainer(
      250,
      startY,
      this.getWidth(),
      this.selectedCol.getHeight(),
      this.getCanvas(),
      this.momentTableBodyContainer.getInnerContainer()
    )

    this.drawSelectedContainer()

    return moments;
  }

  drawActivityTape(activity,activityDateSegmentContainer,percentageWork){
    const lenDateSegments = activity.dateSegments.length;
    let perDays = percentageWork.length > 1 ? percentageWork[1] : percentageWork[0];
    activity.dateSegments.sort((a,b) =>{
      if(a.startDate < b.startDate)
        return -1;
      else if(a.startDate > b.startDate)
        return 1;
      return 0;
    })
    CpspRef.cmp.copySelectedProject.activities.find(act => act.id == activity.id).dateSegments.sort((a,b) =>{
      if(a.startDate < b.startDate)
        return -1;
      else if(a.startDate > b.startDate)
        return 1;
      return 0;
    })
    activity.dateSegments.forEach((dateSegment,dateSegmentIndex )=> {
      const projectIndex = activity.id;
    const momentIndex = -1;
    // const dateSegmentIndex = 0;
    const startTapeX = CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(new Date(dateSegment.startDate)) * CpspRef.cmp.pixelRation;
    const widthTape = (momentM(dateSegment.endDate).diff(momentM(dateSegment.startDate),"days") + 1) * ConfigSc.cellWidth * CpspRef.cmp.pixelRation;
    const dateSegmentContainer = new DateSegment(
      startTapeX,
      ConfigSc.cellHeight / 4,
      widthTape ,
      ConfigSc.cellHeight - 10,
      CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
      activityDateSegmentContainer,
      { projectIndex, momentIndex, dateSegmentIndex }
    );


    dateSegmentContainer.setBackgroundColor(activity.tape_color);
    dateSegmentContainer.setBorder("black", 0.5);
    if(lenDateSegments > 1){
      if(dateSegmentIndex == 0)
        dateSegmentContainer.setBorderRoundness(8,true,false,true,false);
      else if(dateSegmentIndex == lenDateSegments - 1)
        dateSegmentContainer.setBorderRoundness(8,false,true,false,true);
      else
        dateSegmentContainer.setBorderRoundness(0);
    }
    let days =
      moment(
        perDays > dateSegment.endDate ? dateSegment.endDate : perDays,
        // activity.dateSegments[0].currentWorkDate == null
        //   ? dateSegment.endDate
        //   : percentageWork.length == 0 ? activity.dateSegments[0].currentWorkDate : percentageWork[1],
        ConfigSc.dateFormat
      ).diff(dateSegment.startDate, "days") + 1;
      if(days <= 0) return;
    if (activity.dateSegments[0].currentWorkDate == null) days = 0;
    let startGreenLine = CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(new Date(dateSegment.startDate))
    const tape = new Line(
      startGreenLine * CpspRef.cmp.pixelRation,
      (3 * ConfigSc.cellHeight) / 5,
      (startGreenLine + days * ConfigSc.cellWidth) * CpspRef.cmp.pixelRation,
      (3 * ConfigSc.cellHeight) / 5,
      CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
      activityDateSegmentContainer
    );
    tape.setLineThickness(5);
    if (activity.dateSegments[0].currentWorkDate != null) {
      if (
        CpspRef.cmp.getDaysBetweenDates(
          activity.startDate,
          percentageWork.length == 0 ? activity.dateSegments[0].currentWorkDate : percentageWork[1]
        ) ==
          CpspRef.cmp.getDaysBetweenDates(
            activity.startDate,
            activity.endDate
          ) || //na vrijeme zavrseno
        (CpspRef.cmp.getSomeDate(
          CpspRef.cmp.Date,
          percentageWork.length == 0 ? activity.dateSegments[0].currentWorkDate : percentageWork[1],
          "before"
        ) == CpspRef.cmp.Date &&
          CpspRef.cmp.getSomeDate(
            CpspRef.cmp.Date,
            activity.dateSegments[0].startWorkDate,
            "before"
          ) == activity.dateSegments[0].startWorkDate) || //ukoliko jos nije zavrsen zadatak, ali napreduje po planu
        (activity.dateSegments[0].currentWorkDate != null &&
          percentageWork.length == 0 ? activity.dateSegments[0].currentWorkDate >= ConfigSc.currentDate.format(ConfigSc.dateFormat) : percentageWork[1] >=
            ConfigSc.currentDate.format(ConfigSc.dateFormat))
      ) {
        tape.setColor("#00FF33"); //zeleno OK
        tape.setFillColor("#00FF33");
        if(perDays <= dateSegment.endDate){
          tape.setMoveValue((-ConfigSc.cellWidth / 4) * CpspRef.cmp.pixelRation);
          tape.setCircleOnEnd();
        } else {
          tape.setMoveValue(0);
        }

        // condition = true;
      } else {
        tape.setColor("#FF5454");
        tape.setFillColor("#FF5454");
        if(perDays <= dateSegment.endDate){
          tape.setMoveValue((-ConfigSc.cellWidth / 4) * CpspRef.cmp.pixelRation);
          tape.setCircleOnEnd();
        } else {
          tape.setMoveValue(0);
        }
      }
    } else {
      tape.setColor("#FF5454");
      tape.setFillColor("#FF5454");
      tape.setMoveValue(0);
      tape.setCircleOnEnd();
    }

    const currDay = percentageWork.length == 0 ? activity.dateSegments[0].currentWorkDate : percentageWork[1];
    if (
      currDay !=
        ConfigSc.currentDate.format(ConfigSc.dateFormat) &&
      ((currDay >
        ConfigSc.currentDate.format(ConfigSc.dateFormat) &&
        currDay == dateSegment.endDate) ||
        currDay < dateSegment.endDate)
    ) {
      //if(activity.dateSegments[0].currentWorkDate < ConfigSc.currentDate.format(ConfigSc.dateFormat)){
      const x =
        CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
          new Date(currDay)
        ) * CpspRef.cmp.pixelRation;
      let segmentWidth =
        momentM(ConfigSc.currentDate, ConfigSc.dateFormat).diff(
          momentM(
            currDay,
            ConfigSc.dateFormat
          ),
          "days"
        ) + 1;
      segmentWidth = segmentWidth * ConfigSc.cellWidth * CpspRef.cmp.pixelRation;

      //draw red lines
      if( currDay < ConfigSc.currentDate.format(ConfigSc.dateFormat) ||
        ( percentageWork[0] > "0" && currDay > ConfigSc.currentDate.format(ConfigSc.dateFormat))
        ){
        const line = new Line(
          x + ConfigSc.cellWidth,
          0 + (3 * ConfigSc.cellHeight) / 5,
          currDay <
          ConfigSc.currentDate.format(ConfigSc.dateFormat)
            ? x + segmentWidth
            : x + segmentWidth - ConfigSc.cellWidth,
          0,
          CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
          activityDateSegmentContainer
        );
        const line2 = new Line(
          x + ConfigSc.cellWidth,
          0 + (3 * ConfigSc.cellHeight) / 5,
          currDay <
          ConfigSc.currentDate.format(ConfigSc.dateFormat)
            ? x + segmentWidth
            : x + segmentWidth - ConfigSc.cellWidth,
          0 + ConfigSc.cellHeight,
          CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
          activityDateSegmentContainer
        );
        line.setLineThickness(2);
        line.setColor("red"); //zeleno OK
        line.setFillColor("red");
        line.setMoveValue(-ConfigSc.cellWidth / 2);
        line2.setLineThickness(2);
        line2.setColor("red"); //zeleno OK
        line2.setFillColor("red");
        line2.setMoveValue(-ConfigSc.cellWidth / 2);
      }

    }
    //white teapes
    if(percentageWork.length > 2 && CpspRef.cmp.property_index > 1){
      let whiteTapes = CpspRef.cmp.findWhiteTape(activity.id);

      whiteTapes.sort((a, b) => {
        const percentageWork1 = a.dateSegments[0].currentWorkDate != null ? a.dateSegments[0].currentWorkDate.split("%") : [];
        const percentageWork2 = b.dateSegments[0].currentWorkDate != null ? b.dateSegments[0].currentWorkDate.split("%") : [];
        if ( percentageWork1.length <= 2 && percentageWork2.length > 2) {
          return -1;
        }
        if (percentageWork1.length > 2 && percentageWork2.length <= 2) {
          return 1;
        }
        if (percentageWork1.at(2) < percentageWork2.at(2)){
          return -1;
        }
        if (percentageWork1.at(2) > percentageWork2.at(2)){
          return 1;
        }
          return 0;
      })

      for(let i = 0; i < whiteTapes.length; i++){
        let act = whiteTapes.at(i);
        let perWork = act.dateSegments.at(0).currentWorkDate.split("%");

        // const x =
        //   CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
        //     new Date(act.startDate)
        //   ) * CpspRef.cmp.pixelRation;
        // const segment =
        //   momentM(dateSegment.startWorkDate, ConfigSc.dateFormat).diff(
        //     momentM(mom.start_date, ConfigSc.dateFormat),
        //     "days"
        //   ) + 1;
        if(!perWork.at(2) || perWork.at(2) != percentageWork.at(2)){
          let dateSegmentIndex = -1;
          const dateSegmentContainer = new DateSegment(
            act.x * CpspRef.cmp.pixelRation,
            ConfigSc.cellHeight / 4,
            (momentM(act.endDate).diff(momentM(act.startDate),"days") + 1) * ConfigSc.cellWidth * CpspRef.cmp.pixelRation,
            ConfigSc.cellHeight - 10,
            CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
            activityDateSegmentContainer,
            { projectIndex, momentIndex, dateSegmentIndex }
          );
          dateSegmentContainer.setBackgroundColor("white");
          dateSegmentContainer.setBorder("black", 0.5);
          dateSegmentContainer.setBorderRoundness(
            8,
            // true,
            // false,
            // true,
            // false
          );
          if (i > 0){
            const cText = new TextRenderer(
              (i + 1).toString(),
              this.canvas,
              dateSegmentContainer
            );
            cText.setAlignment("center", "center");
          }
        }


      }
    }
    });

    //draw line between tapes
    if(lenDateSegments > 1){
      for(let i = 1; i < lenDateSegments; i++){
        const dateSegment = activity.dateSegments.at(i)
        const startXLine = CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(new Date(activity.dateSegments.at(i - 1).endDate)) * CpspRef.cmp.pixelRation;
        const endXLine = CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(new Date(dateSegment.startDate)) * CpspRef.cmp.pixelRation;
        const line = new Line(
          startXLine + (ConfigSc.cellWidth * CpspRef.cmp.pixelRation),
          (ConfigSc.cellHeight / 4) + (ConfigSc.cellHeight - 10),
          endXLine + (( 3 * ConfigSc.cellWidth / 4) * CpspRef.cmp.pixelRation),
          (ConfigSc.cellHeight / 4) + (ConfigSc.cellHeight - 10),
          CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
          // CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer()
          activityDateSegmentContainer
        );
        line.setLineDash([3, 0.5]);
        line.setLineThickness(1.35)
        line.draw();
      }
    }

  }

  //(projectIndex: number): boolean
  // addDisplayProjectToProjectUsersContainer() {
  //   if (CpspRef.cmp.selectedProject == null) return;

  //   // if (
  //   //       projectIndex < 0 ||
  //   //       projectIndex > CpspRef.cmp.allDisplayProjects.length - 1
  //   //   ) {
  //   //       return false;
  //   //   }
  //   const datepipe = new DatePipe("en-US");

  //   // const needEmptyRow = this.getNumberOfAllDisplayActivitiesAndMoments() < 38 ? 38 - this.getNumberOfAllDisplayActivitiesAndMoments() : 0;  //Math.floor((this.getHeight()- this.getNumberOfAllDisplayActivitiesAndMoments() * ConfigSc.cellHeight)/ConfigSc.cellHeight)-2;

  //   // CpspRef.cmp.rowNumber = needEmptyRow;

  //   // while(needEmptyRow > 0){
  //   //   CpspRef.cmp.fillEmptyRow();
  //   //   needEmptyRow--;
  //   // }
  //   let project = CpspRef.cmp.selectedProject;
  //   //project.activities = [project.activities[0]]
  //   const i = 0;
  //   CpspRef.cmp.numberContainer = 0;

  //   project.activities.forEach(activity => {
  //     //if(CpspRef.cmp.numberContainer * ConfigSc.cellHeight > CpspRef.cmp.projectSchedulePlanerApp.sideSection.getHeight()) return;
  //     activity.y = i * ConfigSc.cellHeight;
  //     const rowNumber = (activity.y / ConfigSc.cellHeight) + 1;
  //     const activityContainerHeight = ConfigSc.cellHeight * activity.moments.length;

  //     const activityContainer = new ProjectScheduleContainer(
  //       0,
  //       i * ConfigSc.cellHeight,
  //       "100%",
  //       activityContainerHeight + ConfigSc.cellHeight,
  //       this.canvas,
  //       this.momentTableBodyContainer.getInnerContainer()
  //     );
  //     activityContainer.setBackgroundColor("orange");

  //     const activityHeaderContainer = new MomentContainer(
  //       0,
  //       0,
  //       "100%",
  //       ConfigSc.cellHeight,
  //       this.canvas,
  //       activityContainer
  //     );
  //     if (activity.id > 0) {
  //       activityHeaderContainer.setBackgroundColor(activity.styles.backgroundColor);
  //     } else {
  //       activityHeaderContainer.setBackgroundColor("Pink");
  //     }

  //   // activityHeaderContainer.setOnMouseDownHandler((e) => {
  //   //   CpspRef.cmp.tapeMomActId = 0;
  //   //   if (this.movingLineIndicator) this.canvas.removeChildById(this.movingLineIndicator.getId());

  //   //   CpspRef.cmp.projectSchedulePlanerApp.showHideResourcePlanning.clickOnHide();
  //   //   CpspRef.cmp.selectedMomentsForStyleChange = [];
  //   //   CpspRef.cmp.selectedMomentsForStyleChange.push({
  //   //     projectId: CpspRef.cmp.selectedProject.id,
  //   //     activityId: activity.id,
  //   //     stateType: null,
  //   //     moment: activity,
  //   //     planId: null,
  //   //     y: activity.y
  //   //   });

  //   //   //selecting multiple rows
  //   //   if (e.shiftKey) {
  //   //     ConfigSc.firstMomentBoxSelectedPositionDelta = activity.y;

  //   //     this.firstMomentBoxSelectedPosition = e.offsetY;
  //   //     ConfigSc.deltaMovementBetweenBoxes = 0;
  //   //     return;
  //   //   }

  //   //   // this.movingLineIndicator = new MovingLineIndicator(
  //   //   //   activityContainer.getX() + ConfigSc.cellHeight * 2,
  //   //   //   activityContainer.getHeight() - ConfigSc.cellHeight,
  //   //   //   "100%",
  //   //   //   ConfigSc.cellHeight * 2,
  //   //   //   this.canvas,
  //   //   //   this.momentTableBodyContainer.getInnerContainer()
  //   //   //   );

  //   //   // this.canvas.addChild(this.movingLineIndicator);

  //   //   // this.canvas.getChildren().forEach(child => {
  //   //   //   if (child instanceof SideSectionMomentsContainer || child instanceof MovingLineIndicator || child instanceof MomentContainer) { }
  //   //   //   this.canvas.addDrawingContainer(child);
  //   //   // });

  //   //   // this.canvas.getCanvasElement().onmousemove = (ev) => {
  //   //   //   if (ev.movementY != 0) {
  //   //   //     this.throttle(() => {
  //   //   //       this.movingLineIndicator.move(ev.movementY);
  //   //   //     }, 100)();
  //   //   //   }
  //   //   // };

  //   //   //     this.selectedMomentsContainer.setOnMouseDownHandler(() => {
  //   //   //       this.movingLineIndicator = new MovingLineIndicator(
  //   //   //         this.selectedMomentsContainer.getX() + ConfigSc.cellHeight * 2,
  //   //   //         this.selectedMomentsContainer.getHeight() - ConfigSc.cellHeight,
  //   //   //         "100%",
  //   //   //         ConfigSc.cellHeight * 2,
  //   //   //         this.canvas,
  //   //   //         this.selectedMomentsContainer
  //   //   //       );

  //   //   //       this.canvas.addChild(this.movingLineIndicator);
  //   //   //       this.canvas.getChildren().forEach((child) => {
  //   //   //           this.canvas.addDrawingContainer(child);
  //   //   //       });

  //   //   //       this.canvas.getCanvasElement().onmousemove = (ev) => {
  //   //   //         if (ev.movementY != 0) {
  //   //   //           this.throttle(() => {
  //   //   //             this.movingLineIndicator.move(ev.movementY);
  //   //   //           }, 100)();
  //   //   //         }
  //   //   //       };

  //   //   //       this.addRemoveEventsForMouseDownEvent((e2) => {
  //   //   //         if (e.screenY === e2.screenY) {
  //   //   //           this.canvas.removeChildById(this.movingLineIndicator.getId());
  //   //   //           this.refreshDisplay();
  //   //   //           this.canvas.resetDrawingContainers();
  //   //   //           return;
  //   //   //         }

  //   //   //         const momentsInBox = this.selectedMomentsContainer.getSelectedMoments();
  //   //   //         if (momentsInBox.length == 0) {
  //   //   //           this.canvas.resetDrawingContainers();
  //   //   //           this.refreshDisplay();
  //   //   //           this.canvas.removeChildById(this.selectedMomentsContainer.getId());
  //   //   //           this.canvas.removeChildById(this.movingLineIndicator.getId());
  //   //   //           return;
  //   //   //         }

  //   //   //         const mY = this.movingLineIndicator.getY();
  //   //   //         const currentProject = CpspRef.cmp.copySelectedProject;

  //   //   //         const maxY = currentProject.activities[currentProject.activities.length - 1].y;
  //   //   //         historySchedulePlaner.addToQueue(
  //   //   //           () => true,
  //   //   //           () => true
  //   //   //         );

  //   //   //         if (this.movingLineIndicator.getY() < 0) {
  //   //   //           momentsInBox.sort((a, b) => {
  //   //   //             return b.userY - a.userY;
  //   //   //           });
  //   //   //         }

  //   //   //         if (momentsInBox.length != 0) {
  //   //   //           this.onDropActivity(momentsInBox, mY);
  //   //   //         }
  //   //   //         momentsInBox.forEach((moment, index) => {
  //   //   //           // currentProject.activities = currentProject.activities.sort(
  //   //   //           //   (a, b) => a.sortIndex - b.sortIndex
  //   //   //           // );
  //   //   //           // const userIndex = currentProject.users.findIndex(
  //   //   //           //   (u) => u.id == user.userId
  //   //   //           // );
  //   //   //           // if (userIndex == -1) {
  //   //   //           //   return;
  //   //   //           // }

  //   //   //           // if (uIndex == -1) {
  //   //   //           //   this.onDropUser(
  //   //   //           //     null,
  //   //   //           //     userIndex,
  //   //   //           //     currentUserProjectIndex,
  //   //   //           //     maxY,
  //   //   //           //     true
  //   //   //           //   );
  //   //   //           // } else {
  //   //   //           //   this.onDropUser(
  //   //   //           //     null,
  //   //   //           //     userIndex,
  //   //   //           //     currentUserProjectIndex,
  //   //   //           //     mY +
  //   //   //           //       currentProject.users[userIndex].y +
  //   //   //           //       ConfigSc.cellHeight *
  //   //   //           //         (mY > 0 ? -index : index - usersInBox.length + 1),
  //   //   //           //     true
  //   //   //           //   );
  //   //   //           // }
  //   //   //         });
  //   //   //         // this.enumerateUnmovedUsers();

  //   //   //         // history.appendToQueueGroup(
  //   //   //         //   () => true,
  //   //   //         //   () => true
  //   //   //         // ); // needs to be here to store state for redo

  //   //   //         this.canvas.resetDrawingContainers();
  //   //   //         this.refreshDisplay();
  //   //   //         this.canvas.removeChildById(this.selectedMomentsContainer.getId());
  //   //   //         this.canvas.removeChildById(this.movingLineIndicator.getId());
  //   //   //       });

  //   //   //     });

  //   //   //     // this.createSelectedMomentsContainer(e.offsetX, e.offsetY);

  //   //   //     // this.throttle(() => { this.movingLineIndicator.move(ev.movementY); }, 100)();
  //   //   //     // activityHeaderContainer.move(ev.movementY);
  //   //   //   }

  //   //   // };

  //   //   this.addRemoveEventsForMouseDownEvent((e2) => {
  //   //     if (e.screenY === e2.screenY) {
  //   //       this.highlightedRow = rowNumber;
  //   //       this.canvas.removeChildById(this.movingLineIndicator.getId());
  //   //       this.canvas.removeChildById(activityHeaderContainer.getId());
  //   //       this.refreshDisplay();
  //   //       this.canvas.resetDrawingContainers();
  //   //     }

  //   //     this.canvas.removeChildById(activityHeaderContainer.getId());

  //   //     if (!this.getMomentTableBodyContainer().isShapeClicked(e2.layerX, e2.layerY)) {
  //   //       activityHeaderContainer.setY(CpspRef.cmp.selectedProject.activities[activity.id].y);
  //   //       this.canvas.resetDrawingContainers();
  //   //       this.refreshDisplay();
  //   //       return;
  //   //     }

  //   //     // this.onDropActivity(activityHeaderContainer, activity, this.movingLineIndicator.getY());

  //   //     this.canvas.removeChildById(this.movingLineIndicator.getId());
  //   //   });

  //   //   this.canvas.resetDrawingContainers();
  //   //   this.refreshDisplay();
  //   // });

  //     const c = new ProjectColumn(
  //       0,
  //       0,
  //       ProjectMomentsTableHead.threeVerticalDotsColumnWidth,
  //       activityHeaderContainer.getHeight(),
  //       this.canvas,
  //       activityHeaderContainer
  //     );
  //     c.setBorder("#707070", 1);

  //     if (activity.id > 0 && ConfigSc.isInEditMode) {
  //       c.setOnMouseHoverHandler(() => document.body.style.cursor = "pointer");
  //       c.setOnClickHandler((e) => {

  //         // const dropdownMenu = new DropdownMenu(e.layerX, e.layerY, 200, 200, this.canvas);
  //         // dropdownMenu.addOption(CpspRef.cmp.getTranslate().instant("Assign Worker"), (e) => {
  //         //     CpspRef.cmp.setDisabledDates(project.startDate, project.endDate);
  //         //     CpspRef.cmp.showAddUserModal(projectIndex);
  //         // });
  //         // dropdownMenu.addOption(CpspRef.cmp.getTranslate().instant(project.countAsResources ? "Stop counting as resources" : "Count as resources"), (e) => {
  //         //     project.countAsResources = !project.countAsResources;
  //         //     history.addToQueue(
  //         //         () => CmpRef.cmp.setProjectCountAsResources(project.id, project.countAsResources),
  //         //         () => CmpRef.cmp.setProjectCountAsResources(project.id, !project.countAsResources));
  //         //     CmpRef.cmp.planningApp.projectUsersContainer.refreshDisplay();
  //         //     CmpRef.cmp.planningApp.resourcePlanningContainer.refreshDisplay();
  //         // });
  //         // dropdownMenu.open();
  //       });
  //     }

  //     const cText = new TextRenderer("\u2807", this.canvas, c);
  //     if (activity.id <= 0) cText.setColor("black");
  //     cText.setFontSize(17);
  //     cText.setX(6);
  //     cText.setY(6);
  //     cText.updateTextDimensions();

  //     if (ConfigSc.isInEditMode && CpspRef.cmp.property_index == CpspRef.cmp.revisions.length + 1 && activity.number == "" ) {
  //       c.setOnMouseHoverHandler(
  //         () => document.body.style.cursor = "pointer");
  //       c.setOnClickHandler((e) => {
  //         CpspRef.cmp.hideColumnValueInput();
  //         const dropdownMenu = new DropdownMenu(
  //           e.layerX,
  //           e.layerY,
  //           200,
  //           200,
  //           this.canvas
  //         );

  //         dropdownMenu.addOption(CpspRef.cmp.getTranslate().instant("Delete"), (e) => {

  //             // moment["showInResourcePlanning"] = moment.hasOwnProperty("showInResourcePlanning") ? !moment.showInResourcePlanning : false;

  //             // history.addToQueue(
  //             //     () => CpspRef.cmp.setUserCountAsResources(moment.id, project.id, moment.isResponsiblePerson, moment.showInResourcePlanning),
  //             //     () => CpspRef.cmp.setUserCountAsResources(moment.id, project.id, moment.isResponsiblePerson, !moment.showInResourcePlanning));
  //             // CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
  //             // CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();

  //             CpspRef.cmp.showConfirmationModal(
  //               CpspRef.cmp.getTranslate().instant("Do you want to delete?"),
  //               async (response) => {
  //                 if (response.result) {
  //                   if (CpspRef.cmp.loading) {
  //                     return;
  //                   }
  //                   CpspRef.cmp.setLoadingStatus(true);
  //                   CpspRef.cmp.deleteSchedulePlan(activity.id, null);
  //                   CpspRef.cmp.setLoadingStatus(false);

  //                 }
  //               }
  //             );
  //         });
  //         dropdownMenu.open();
  //       });
  //     }

  //     CpspRef.cmp.visibleColumns.forEach(column => {
  //       const c = new ProjectColumn(
  //         column.x,
  //         0,
  //         column.width,
  //         activityHeaderContainer.getHeight(),
  //         this.canvas,
  //         activityHeaderContainer
  //       );

  //       c.setBorder("#707070", 1);

  //       let text = "";
  //       if (column.key !== "Details" && column.key !== "start_date" && column.key !== "end_date" && column.key !== "days" && column.key !== "hours" && column.key !== "finished" && column.key !== "resource" && column.key !== "plan" && column.key !== "part") {
  //         if (column.values[CpspRef.cmp.project.id] && column.values[CpspRef.cmp.project.id].activities[activity.id]) text = column.values[CpspRef.cmp.project.id].activities[activity.id].value;
  //         if (ConfigSc.isInEditMode && CpspRef.cmp.property_index == CpspRef.cmp.revisions.length + 1) {
  //          /*c.setOnDoubleClickHandler(() => {

  //             CpspRef.cmp.columnValueInput.style.display = "block";
  //             CpspRef.cmp.columnValueInput.style.width = `${c.getWidth()}px`;
  //             CpspRef.cmp.columnValueInput.style.height = `${c.getHeight()}px`;
  //             CpspRef.cmp.columnValueInput.value = text;
  //             CpspRef.cmp.columnValueInput.style.top = `${c.getGlobalY()}px`;
  //             const x = ConfigSc.sidebarSize + c.getGlobalX() + (c.getWidth() / 2);
  //             CpspRef.cmp.columnValueInput.style.left = `${x}px`;
  //             CpspRef.cmp.columnValueInput.focus();
  //             CpspRef.cmp.columnValueInput.select();

  //             CpspRef.cmp.selectedColumnForEditing = column;

  //           });*/
  //         }
  //       } else {

  //         if (column.key === "Details") {
  //           const space = activity.number != "" ? " " : "";
  //           text = activity.description != null ? activity.number + space + activity.description : "";

  //           // if (activity.moments.length == 0) {
  //             // c.setOnDoubleClickHandler(() => {

  //             c.setOnMouseDownHandler((e) => {
  //               if(CpspRef.cmp.property_index!=CpspRef.cmp.revisions.length+1){
  //                 return;
  //               }
  //               CpspRef.cmp.tapeMomActId = null;
  //               ConfigSc.firstMomentBoxSelectedPositionDelta = activity.y;
  //               this.firstMomentBoxSelectedPosition = e.offsetY;
  //               ConfigSc.deltaMovementBetweenBoxes = 0;

  //               const firstMove = 0;
  //               this.canvas.getCanvasElement().onmousemove = ((e2) => {

  //                 if (e2.movementY != 0 && firstMove == 0) {
  //                   document.body.style.cursor = "crosshair";
  //                   //this.createSelectedMomentsContainer(e.offsetX, e.offsetY - ConfigSc.toolboxSize);
  //                   this.createSelectedMomentsContainer(e.layerX, e.layerY - ConfigSc.toolboxSize);
  //                   firstMove = 1;
  //                   this.highlightedRow = null;
  //                   this.refreshDisplay();
  //                 }

  //               });

  //               c.addRemoveEventsForMouseDownEvent(() => {
  //                 this.highlightedRow = null;
  //                 if (firstMove != 0) return;
  //                 this.canvas.getCanvasElement().onmousemove = null;
  //                 if(CpspRef.cmp.property_index!=CpspRef.cmp.revisions.length+1){
  //                   return;
  //                 }
  //                 CpspRef.cmp.columnValueInput.style.display = "block";
  //                  CpspRef.cmp.columnValueInput.style.textAlign = "left";
  //                  CpspRef.cmp.columnValueInput.style.width = `${c.getWidth()}px`;
  //                  CpspRef.cmp.columnValueInput.style.height = `${c.getHeight()}px`;
  //                  CpspRef.cmp.columnValueInput.style.border = "3px solid #F77E04";
  //                  CpspRef.cmp.columnValueInput.value = text;
  //                 const topY = c.getGlobalY() - ConfigSc.cellHeight/2 + 2.5;
  //                  CpspRef.cmp.columnValueInput.style.top = `${topY}px`;
  //                  const x = ConfigSc.sidebarSize + ProjectMomentsTableHead.threeVerticalDotsColumnWidth;
  //                  CpspRef.cmp.columnValueInput.style.left = `${x}px`;
  //                  //CpspRef.cmp.columnValueInput.focus();
  //                  //CpspRef.cmp.columnValueInput.select();

  //                 document.getElementById("columnValueEditInput1").style.display = "block"
  //                 document.getElementById("columnValueEditInput1").style.textAlign = "left";
  //                 document.getElementById("columnValueEditInput1").focus();
  //                 document.getElementById("selectValue").style.display = "block"
  //                 CpspRef.cmp.inputValue = text;

  //                 CpspRef.cmp.selectedColumnForEditing = column;
  //                 CpspRef.cmp.activityIndex = Number(activity.id);
  //                 CpspRef.cmp.planIndex = null;

  //                 this.highlightedRow = rowNumber;
  //                 this.refreshDisplay();

  //               });

  //             });

  //           // }

  //           if( CpspRef.cmp.copySelectedProject.activities.find(a => a.id == activity.id).moments.length > 0){
  //             const activity_arr={
  //               id:activity.id,
  //               show:"arrow-open"
  //             }

  //             if(!this.show_activity.find(e => e.id==activity.id))
  //                     this.show_activity.push(activity_arr);

  //             const activity_index_show = this.show_activity.findIndex((obj => obj.id == activity.id));

  //             const project_arrow = this.addIcon(
  //               12,
  //               this.show_activity[activity_index_show].show == "arrow-open" ? 10 : 6,
  //               this.show_activity[activity_index_show].show == "arrow-open" ? 8 : 8,
  //               this.show_activity[activity_index_show].show == "arrow-open" ? 12 : 12,
  //               this.show_activity[activity_index_show].show,
  //               this.show_activity[activity_index_show].show,
  //               () => {
  //                 CpspRef.cmp.hideColumnValueInput();
  //                 this.isClickOnArrow=true;
  //                 this.filterActivity(activity);

  //               },
  //               c
  //             );
  //             project_arrow.getBorderColor();
  //           }

  //         }
  //         else if (column.key === "start_date") {
  //           text = datepipe.transform(activity.startDate, "yy-MM-dd");
  //         }
  //         else if (column.key == "end_date") {
  //           text = datepipe.transform(activity.endDate, "yy-MM-dd");
  //         }
  //         else if ( (column.key === "plan" || column.key === "part") && !CpspRef.cmp.project.activities.some( akt => akt.activity == activity.id) && activity.description != null && activity.description != "" ){
  //           if(column.key === "plan")
  //             text = activity.plan != null ? activity.plan : "" ;
  //           else
  //             text = activity.part != null ? activity.part : "";
  //           c.setOnClickHandler((e) => {

  //             if(CpspRef.cmp.property_index!=CpspRef.cmp.revisions.length+1){
  //               return;
  //             }

  //             CpspRef.cmp.hideColumnValueInput();

  //             CpspRef.cmp.planInput.style.display = "block";
  //             CpspRef.cmp.planInput.style.textAlign = "left";
  //             CpspRef.cmp.planInput.style.width = `${c.getWidth()}px`;
  //             CpspRef.cmp.planInput.style.height = `${c.getHeight()}px`;
  //             CpspRef.cmp.planInput.style.border = "3px solid #F77E04";
  //             CpspRef.cmp.planInput.value = text.toString();
  //             CpspRef.cmp.planInput.style.top = `${c.getGlobalY()}px`;
  //             const x = ConfigSc.sidebarSize + c.getGlobalX() + (c.getWidth() / 2);
  //             CpspRef.cmp.planInput.style.left = `${x}px`;
  //             CpspRef.cmp.planInput.focus();
  //             CpspRef.cmp.planInput.select();

  //             CpspRef.cmp.selectedColumnForEditing = column;
  //             CpspRef.cmp.activityIndex = Number(activity.id);
  //             CpspRef.cmp.planIndex = null;

  //             this.highlightedRow = rowNumber;
  //             CpspRef.cmp.tapeMomActId = null;
  //             this.refreshDisplay()
  //           });
  //         }
  //         else if ( (column.key === "days" || column.key === "hours" || column.key === "finished") && !CpspRef.cmp.project.activities.some( akt => akt.activity == activity.id) && activity.moments.length > 0 ){
  //           if(column.key == "days"){
  //             text = CpspRef.cmp.calculateDaysOfChildren(activity.id,0).toString()
  //           }
  //           else if(column.key == "hours"){
  //             text = CpspRef.cmp.calculateHoursOfChildren(activity.id,0).toString() + " h"
  //           }
  //           else
  //             text = CpspRef.cmp.calculateWorkedHoursOfChildren(activity.id,0).toString() + " h"
  //         }

  //         //for fake activity who is tape
  //         else if(!CpspRef.cmp.project.activities.some( akt => akt.activity == activity.id) && activity.moments.length == 0  && activity.description != null && activity.description != ""){
  //           if (column.key === "days"){
  //             text = String(CpspRef.cmp.getBusinessDatesCount(activity.startDate, activity.endDate))
  //             c.setOnClickHandler((e) => {
  //               // CpspRef.cmp.columnValueInput.style.display = "block";
  //               // CpspRef.cmp.columnValueInput.style.textAlign = "left";
  //               // CpspRef.cmp.columnValueInput.style.width = `${c.getWidth()}px`;
  //               // CpspRef.cmp.columnValueInput.style.height = `${c.getHeight()}px`;
  //               // CpspRef.cmp.columnValueInput.style.border = "3px solid #F77E04";
  //               // CpspRef.cmp.columnValueInput.value = text.toString();
  //               // CpspRef.cmp.columnValueInput.style.top = `${c.getGlobalY()}px`;
  //               // const x = ConfigSc.sidebarSize + c.getGlobalX() + (c.getWidth() / 2);
  //               // CpspRef.cmp.columnValueInput.style.left = `${x}px`;
  //               // CpspRef.cmp.columnValueInput.focus();
  //               // CpspRef.cmp.columnValueInput.select();

  //               if(CpspRef.cmp.property_index!=CpspRef.cmp.revisions.length+1){
  //                 return;
  //               }

  //               CpspRef.cmp.hideColumnValueInput();

  //               CpspRef.cmp.resourceWeekInput.style.display = "block";
  //               CpspRef.cmp.resourceWeekInput.style.textAlign = "left";
  //               CpspRef.cmp.resourceWeekInput.style.width = `${c.getWidth()}px`;
  //               CpspRef.cmp.resourceWeekInput.style.height = `${c.getHeight()}px`;
  //               CpspRef.cmp.resourceWeekInput.style.border = "3px solid #F77E04";
  //               CpspRef.cmp.resourceWeekInput.value = text.toString();
  //               CpspRef.cmp.resourceWeekInput.style.top = `${c.getGlobalY()}px`;
  //               const x = ConfigSc.sidebarSize + c.getGlobalX() + (c.getWidth() / 2);
  //               CpspRef.cmp.resourceWeekInput.style.left = `${x}px`;
  //               CpspRef.cmp.resourceWeekInput.focus();
  //               CpspRef.cmp.resourceWeekInput.select();

  //               CpspRef.cmp.selectedColumnForEditing = column;
  //               CpspRef.cmp.activityIndex = Number(activity.id);
  //               CpspRef.cmp.planIndex = null;

  //               this.highlightedRow = rowNumber;
  //               CpspRef.cmp.tapeMomActId = null;
  //               this.refreshDisplay()
  //             });
  //           }
  //           else if (column.key === "hours" ) {
  //             const finish = CpspRef.cmp.getBusinessDatesCount(activity.startDate, activity.endDate)
  //             if(activity.time != null && activity.time > 0){
  //               text = activity.time + " h";
  //             }
  //             else
  //               text = activity.number_of_workers > 0 ? activity.number_of_workers * finish * CpspRef.cmp.workingHours + " h" : 0 + " h";
  //             c.setOnClickHandler((e) => {
  //               if(CpspRef.cmp.property_index!=CpspRef.cmp.revisions.length+1){
  //                 return;
  //               }
  //               CpspRef.cmp.hideColumnValueInput();
  //               CpspRef.cmp.resourceWeekInput.style.display = "block";
  //               CpspRef.cmp.resourceWeekInput.style.textAlign = "left";
  //               CpspRef.cmp.resourceWeekInput.style.width = `${c.getWidth()}px`;
  //               CpspRef.cmp.resourceWeekInput.style.height = `${c.getHeight()}px`;
  //               CpspRef.cmp.resourceWeekInput.style.border = "3px solid #F77E04";
  //               CpspRef.cmp.resourceWeekInput.value = text.toString();
  //               CpspRef.cmp.resourceWeekInput.value = activity.time != null ? activity.time.toString() : "0" ;
  //               CpspRef.cmp.resourceWeekInput.style.top = `${c.getGlobalY()}px`;
  //               const x = ConfigSc.sidebarSize + c.getGlobalX() + (c.getWidth() / 2);
  //               CpspRef.cmp.resourceWeekInput.style.left = `${x}px`;
  //               CpspRef.cmp.resourceWeekInput.focus();
  //               CpspRef.cmp.resourceWeekInput.select();

  //               CpspRef.cmp.selectedColumnForEditing = column;
  //               CpspRef.cmp.activityIndex = Number(activity.id);
  //               CpspRef.cmp.planIndex = null;

  //               this.highlightedRow = rowNumber;
  //               CpspRef.cmp.tapeMomActId = null;
  //               this.refreshDisplay()
  //             });
  //           }
  //           else if (column.key === "finished" ) {
  //             // const finish = activity.dateSegments[0].currentWorkDate != null ? CpspRef.cmp.getBusinessDatesCount(activity.dateSegments[0].startWorkDate,activity.dateSegments[0].currentWorkDate) : 0
  //             // text = activity.number_of_workers > 0 && activity.dateSegments[0].currentWorkDate != null ? activity.number_of_workers * finish * 8 + " h" : 0 + " h";
  //             if(activity.dateSegments[0].finishedTime != null && activity.dateSegments[0].finishedTime > 0){
  //               text = activity.dateSegments[0].finishedTime + " h";
  //             }
  //             else
  //               text =  0 + " h";
  //             c.setOnClickHandler((e) => {
  //               if(CpspRef.cmp.property_index!=CpspRef.cmp.revisions.length+1){
  //                 return;
  //               }
  //               CpspRef.cmp.hideColumnValueInput();
  //               CpspRef.cmp.resourceWeekInput.style.display = "block";
  //               CpspRef.cmp.resourceWeekInput.style.textAlign = "left";
  //               CpspRef.cmp.resourceWeekInput.style.width = `${c.getWidth()}px`;
  //               CpspRef.cmp.resourceWeekInput.style.height = `${c.getHeight()}px`;
  //               CpspRef.cmp.resourceWeekInput.style.border = "3px solid #F77E04";
  //               CpspRef.cmp.resourceWeekInput.value = text.toString();
  //               CpspRef.cmp.resourceWeekInput.value = activity.dateSegments[0].finishedTime != null ? activity.dateSegments[0].finishedTime.toString() : "0" ;
  //               CpspRef.cmp.resourceWeekInput.style.top = `${c.getGlobalY()}px`;
  //               const x = ConfigSc.sidebarSize + c.getGlobalX() + (c.getWidth() / 2);
  //               CpspRef.cmp.resourceWeekInput.style.left = `${x}px`;
  //               CpspRef.cmp.resourceWeekInput.focus();
  //               CpspRef.cmp.resourceWeekInput.select();

  //               CpspRef.cmp.selectedColumnForEditing = column;
  //               CpspRef.cmp.activityIndex = Number(activity.id);
  //               CpspRef.cmp.planIndex = null;

  //               this.highlightedRow = rowNumber;
  //               CpspRef.cmp.tapeMomActId = null;
  //               this.refreshDisplay()
  //             });
  //           }
  //           else if (column.key === "resource" ) {
  //             if(activity.number_of_workers != null && activity.number_of_workers > 0){
  //               text = String(activity.number_of_workers)
  //             }
  //             else {
  //               text = "";
  //             }

  //             c.setOnClickHandler((e)=> {
  //               // CpspRef.cmp.columnValueInput.style.display = "block";
  //               // CpspRef.cmp.columnValueInput.style.textAlign  = "left";
  //               // CpspRef.cmp.columnValueInput.style.width = `${c.getWidth()}px`;
  //               // CpspRef.cmp.columnValueInput.style.height = `${c.getHeight()}px`;
  //               // CpspRef.cmp.columnValueInput.style.border = "3px solid #F77E04";
  //               // CpspRef.cmp.columnValueInput.value = text.toString();
  //               // CpspRef.cmp.columnValueInput.style.top = `${c.getGlobalY()}px`;
  //               // const x = ConfigSc.sidebarSize + c.getGlobalX() + (c.getWidth() / 2);
  //               // CpspRef.cmp.columnValueInput.style.left = `${x}px`;
  //               // CpspRef.cmp.columnValueInput.focus();
  //               // CpspRef.cmp.columnValueInput.select();

  //               // CpspRef.cmp.selectedColumnForEditing = column;
  //               //   CpspRef.cmp.activityIndex = Number(activity.id);
  //               //   CpspRef.cmp.planIndex = null;

  //               if(CpspRef.cmp.property_index!=CpspRef.cmp.revisions.length+1){
  //                 return;
  //               }
  //               CpspRef.cmp.hideColumnValueInput();
  //                 CpspRef.cmp.resourceWeekInput.style.display = "block";
  //                 CpspRef.cmp.resourceWeekInput.style.textAlign  = "left";
  //                 CpspRef.cmp.resourceWeekInput.style.width = `${c.getWidth()}px`;
  //                 CpspRef.cmp.resourceWeekInput.style.height = `${c.getHeight()}px`;
  //                 CpspRef.cmp.resourceWeekInput.style.border = "3px solid #F77E04";
  //                 CpspRef.cmp.resourceWeekInput.value = text.toString();
  //                 CpspRef.cmp.resourceWeekInput.style.top = `${c.getGlobalY()}px`;
  //                 const x = ConfigSc.sidebarSize + c.getGlobalX() + (c.getWidth() / 2);
  //                 CpspRef.cmp.resourceWeekInput.style.left = `${x}px`;
  //                 CpspRef.cmp.resourceWeekInput.focus();
  //                 CpspRef.cmp.resourceWeekInput.select();

  //                 CpspRef.cmp.selectedColumnForEditing = column;
  //                 CpspRef.cmp.activityIndex = Number(activity.id);
  //                 CpspRef.cmp.planIndex = null;

  //                 this.highlightedRow = rowNumber;
  //                 CpspRef.cmp.tapeMomActId = null;
  //                 this.refreshDisplay()

  //           });
  //           }

  //         }

  //       }
  //       if (!CpspRef.cmp.project.activities.some( akt => akt.activity == activity.id) && activity.moments.length == 0 && (column.key == "start_date" || column.key === "end_date") ) {
  //         c.setOnClickHandler((e) =>{
  //           //only for fake activity and activity who is empt
  //           this.setColumnDoubleClickHandler(c, column, activity.id, null, text);
  //           this.highlightedRow = rowNumber;
  //           CpspRef.cmp.tapeMomActId = null;
  //           this.refreshDisplay()
  //         })
  //       }

  //       const cText = new TextRenderer(text.toString(), this.canvas, c);
  //       if (activity.id <= 0) cText.setColor("black");
  //       cText.setColor(activity.styles.color);
  //       activity.moments.length > 0 ? cText.setFontWeight('bold') : cText.setFontWeight(activity.styles.fontWeight);
  //       cText.setFontStyle(activity.styles.fontStyle);
  //       cText.setFontDecoration(activity.styles.fontDecoration);
  //       cText.setFontSize(activity.styles.fontSize);
  //       cText.setFontFamily(activity.styles.fontFamily);
  //       cText.setAlignment("left", "center");
  //       if (column.key == "Details")
  //         cText.setX(23);
  //       else cText.setX(6);
  //       cText.updateTextDimensions();

  //       cText.setOnMouseHoverHandler(() => {
  //         if (column.key == "part" || column.key == "plan") {

  //           // const fullText = new TextRenderer(text.toString(), this.canvas, activityHeaderContainer);
  //           // fullText.setY(cText.getGlobalY() + ConfigSc.cellHeight);
  //           // fullText.setHeight(20);
  //           // fullText.setWidth(cText.getWidth());
  //           document.getElementById("mainCanvas").title = text.toString()

  //         }
  //         else
  //         document.getElementById("mainCanvas").title = ""
  //       });

  //     // cText.setOnDoubleClickHandler((e) => {
  //       cText.setOnMouseDownHandler((e) => {
  //         if(CpspRef.cmp.property_index!=CpspRef.cmp.revisions.length+1){
  //           return;
  //         }
  //         const firstMove = 0;
  //         if (column.key === "Details") {
  //           ConfigSc.firstMomentBoxSelectedPositionDelta = activity.y;
  //           this.firstMomentBoxSelectedPosition = e.offsetY;
  //           ConfigSc.deltaMovementBetweenBoxes = 0;

  //           this.canvas.getCanvasElement().onmousemove = ((e2) => {
  //             if (e2.movementY != 0 && firstMove == 0) {
  //               document.body.style.cursor = "crosshair";
  //               //this.createSelectedMomentsContainer(e.offsetX, e.offsetY - ConfigSc.toolboxSize);
  //               this.createSelectedMomentsContainer(e.layerX, e.layerY - ConfigSc.toolboxSize);
  //               firstMove = 1;
  //               this.highlightedRow = null;
  //               this.refreshDisplay();
  //             }
  //           });
  //         }

  //         cText.addRemoveEventsForMouseDownEvent(() => {
  //           if(CpspRef.cmp.property_index!=CpspRef.cmp.revisions.length+1){
  //             return;
  //           }
  //           if (column.key === "Details") {
  //             this.highlightedRow = rowNumber;
  //             CpspRef.cmp.tapeMomActId = null;

  //             this.refreshDisplay()
  //             CpspRef.cmp.columnValueInput.style.display = "block";
  //             CpspRef.cmp.columnValueInput.style.textAlign = "left";
  //             CpspRef.cmp.columnValueInput.style.width = `${c.getWidth()}px`;
  //             CpspRef.cmp.columnValueInput.style.height = `${c.getHeight()}px`;
  //             CpspRef.cmp.columnValueInput.style.border = "3px solid #F77E04";
  //             CpspRef.cmp.columnValueInput.value = text;
  //             const topY = c.getGlobalY() - ConfigSc.cellHeight/2 + 2.5;
  //             CpspRef.cmp.columnValueInput.style.top = `${topY}px`;
  //             const x = ConfigSc.sidebarSize + ProjectMomentsTableHead.threeVerticalDotsColumnWidth;
  //             CpspRef.cmp.columnValueInput.style.left = `${x}px`;
  //             //CpspRef.cmp.columnValueInput.focus();
  //             //CpspRef.cmp.columnValueInput.select();

  //             document.getElementById("columnValueEditInput1").style.display = "block"
  //             document.getElementById("columnValueEditInput1").style.textAlign = "left";
  //             //document.getElementById("columnValueEditInput1").style.backgroundColor = activity.styles.backgroundColor;
  //             document.getElementById("columnValueEditInput1").focus();
  //             document.getElementById("selectValue").style.display = "block"
  //             CpspRef.cmp.inputValue = text;

  //             CpspRef.cmp.selectedColumnForEditing = column;
  //             CpspRef.cmp.activityIndex = Number(activity.id);
  //             CpspRef.cmp.planIndex = null;
  //           }
  //           else if(column.key === "hours"){
  //             CpspRef.cmp.hideColumnValueInput();
  //             CpspRef.cmp.resourceWeekInput.style.display = "block";
  //               CpspRef.cmp.resourceWeekInput.style.textAlign = "left";
  //               CpspRef.cmp.resourceWeekInput.style.width = `${c.getWidth()}px`;
  //               CpspRef.cmp.resourceWeekInput.style.height = `${c.getHeight()}px`;
  //               CpspRef.cmp.resourceWeekInput.style.border = "3px solid #F77E04";
  //               CpspRef.cmp.resourceWeekInput.value = activity.time != null ? activity.time.toString() : "0" ;
  //               CpspRef.cmp.resourceWeekInput.style.top = `${c.getGlobalY()}px`;
  //               const x = ConfigSc.sidebarSize + c.getGlobalX() + (c.getWidth() / 2);
  //               CpspRef.cmp.resourceWeekInput.style.left = `${x}px`;
  //               CpspRef.cmp.resourceWeekInput.focus();
  //               CpspRef.cmp.resourceWeekInput.select();

  //               CpspRef.cmp.selectedColumnForEditing = column;
  //               CpspRef.cmp.activityIndex = Number(activity.id);
  //               CpspRef.cmp.planIndex = null;
  //           }
  //           else if(column.key === "finished"){
  //             CpspRef.cmp.hideColumnValueInput();
  //             CpspRef.cmp.resourceWeekInput.style.display = "block";
  //               CpspRef.cmp.resourceWeekInput.style.textAlign = "left";
  //               CpspRef.cmp.resourceWeekInput.style.width = `${c.getWidth()}px`;
  //               CpspRef.cmp.resourceWeekInput.style.height = `${c.getHeight()}px`;
  //               CpspRef.cmp.resourceWeekInput.style.border = "3px solid #F77E04";
  //               CpspRef.cmp.resourceWeekInput.value = activity.dateSegments[0].finishedTime != null ? activity.dateSegments[0].finishedTime .toString() : "0" ;
  //               CpspRef.cmp.resourceWeekInput.style.top = `${c.getGlobalY()}px`;
  //               const x = ConfigSc.sidebarSize + c.getGlobalX() + (c.getWidth() / 2);
  //               CpspRef.cmp.resourceWeekInput.style.left = `${x}px`;
  //               CpspRef.cmp.resourceWeekInput.focus();
  //               CpspRef.cmp.resourceWeekInput.select();

  //               CpspRef.cmp.selectedColumnForEditing = column;
  //               CpspRef.cmp.activityIndex = Number(activity.id);
  //               CpspRef.cmp.planIndex = null;
  //           }
  //           else if (column.key === "plan" || column.key === "part"){

  //               CpspRef.cmp.hideColumnValueInput();

  //               CpspRef.cmp.planInput.style.display = "block";
  //               CpspRef.cmp.planInput.style.textAlign = "left";
  //               CpspRef.cmp.planInput.style.width = `${c.getWidth()}px`;
  //               CpspRef.cmp.planInput.style.height = `${c.getHeight()}px`;
  //               CpspRef.cmp.planInput.style.border = "3px solid #F77E04";
  //               CpspRef.cmp.planInput.value = text.toString();
  //               CpspRef.cmp.planInput.style.top = `${c.getGlobalY()}px`;
  //               const x = ConfigSc.sidebarSize + c.getGlobalX() + (c.getWidth() / 2);
  //               CpspRef.cmp.planInput.style.left = `${x}px`;
  //               CpspRef.cmp.planInput.focus();
  //               CpspRef.cmp.planInput.select();

  //               CpspRef.cmp.selectedColumnForEditing = column;
  //               CpspRef.cmp.activityIndex = Number(activity.id);
  //               CpspRef.cmp.planIndex = null;

  //               this.highlightedRow = rowNumber;
  //               CpspRef.cmp.tapeMomActId = null;
  //               this.refreshDisplay()
  //           }

  //           //only for fake activity and activity who is empt
  //           if (!CpspRef.cmp.project.activities.some(akt => akt.activity == activity.id) && activity.moments.length == 0 && (column.key == "start_date" || column.key === "end_date")) {
  //             this.setColumnDoubleClickHandler(c, column, activity.id, null, text);
  //           }
  //         });
  //         this.highlightedRow = rowNumber;
  //         CpspRef.cmp.tapeMomActId = null;
  //         this.refreshDisplay()
  //       });

  //     });

  //     const momentsContainer = new GenericContainer(
  //       0,
  //       ConfigSc.cellHeight,
  //       "100%",
  //       activityContainer.getHeight() - ConfigSc.cellHeight,
  //       this.canvas,
  //       activityContainer
  //     );

  //     momentsContainer.setBackgroundColor("white");

  //     const activityDateSegmentContainer = new GenericContainer(
  //       0,
  //       activity.y,
  //       CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer().getWidth(),
  //       activityContainerHeight + ConfigSc.cellHeight,
  //       CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
  //       CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer()
  //     );
  //     if(CpspRef.cmp.copySelectedProject.activities.find(a => a.id == activity.id).moments.length > 0 || activity.number != ""){
  //       const activitySegment = new ProjectSegment(
  //         activity.x,
  //         ConfigSc.cellHeight / 4,
  //         activity.numberOfDays * ConfigSc.cellWidth * ((activity.percentage_of_realized_activity / 100)),
  //         ConfigSc.cellHeight / 4,
  //         CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
  //         activityDateSegmentContainer,
  //         activity.id
  //       );
  //       activitySegment.setBackgroundColor("#77BA6E");
  //       activitySegment.setBorderRoundness(0);
  //       activitySegment.setOnClickHandler(() => {});
  //       const projectIndex = activity.id;
  //       const momentIndex = 0;
  //       const dateSegmentIndex = 0;
  //       const dateSegmentContainer = new DateSegment(
  //         activity.x,
  //         ConfigSc.cellHeight / 4,
  //         activity.numberOfDays * ConfigSc.cellWidth,
  //         ConfigSc.cellHeight - 10,
  //         CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
  //         activityDateSegmentContainer,
  //         { projectIndex, momentIndex, dateSegmentIndex }
  //       );
  //       dateSegmentContainer.setBackgroundColor("#77BA6E");
  //       dateSegmentContainer.setBorderRoundness(0);
  //       dateSegmentContainer.setHeight(ConfigSc.cellHeight / 4);
  //       dateSegmentContainer.setWidth( CpspRef.cmp.getPercentageOfFinished(projectIndex,momentIndex) * ConfigSc.cellWidth)
  //       const momentBridge = new BezierCurveBridge(
  //         activity.x + activity.numberOfDays * ConfigSc.cellWidth,
  //         (3 * ConfigSc.cellHeight / 4),
  //         activity.x,
  //         (3 * ConfigSc.cellHeight / 4),
  //         CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
  //         activityDateSegmentContainer
  //       );
  //       momentBridge.setBackgroundColor("black");

  //     } else if(activity.description != null && activity.description != ""){
  //       const projectIndex = activity.id;
  //       const momentIndex = -1;
  //       const dateSegmentIndex = 0;
  //       const dateSegmentContainer = new DateSegment(
  //         activity.x,
  //         ConfigSc.cellHeight / 4,
  //         activity.numberOfDays * ConfigSc.cellWidth,
  //         ConfigSc.cellHeight - 10,
  //         CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
  //         activityDateSegmentContainer,
  //         { projectIndex, momentIndex, dateSegmentIndex }
  //       );

  //       dateSegmentContainer.setBackgroundColor(activity.tape_color);
  //       dateSegmentContainer.setBorder("black", 0.5);
  //       const days = moment(activity.dateSegments[0].currentWorkDate == null ? activity.endDate : activity.dateSegments[0].currentWorkDate ,ConfigSc.dateFormat).diff(activity.startDate,'days') + 1;
  //       if(activity.dateSegments[0].currentWorkDate == null)
  //         days=0
  //       const tape = new Line(
  //         activity.x,
  //         3 * ConfigSc.cellHeight / 5,
  //         activity.x + days * ConfigSc.cellWidth,
  //         3 * ConfigSc.cellHeight / 5,
  //         CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
  //         activityDateSegmentContainer
  //       );
  //       tape.setLineThickness(5);
  //         if ( activity.dateSegments[0].currentWorkDate != null) {
  //           if (
  //             CpspRef.cmp.getDaysBetweenDates(activity.startDate, activity.dateSegments[0].currentWorkDate) == CpspRef.cmp.getDaysBetweenDates(activity.startDate, activity.endDate) || //na vrijeme zavrseno
  //             ( CpspRef.cmp.getSomeDate(CpspRef.cmp.Date, activity.dateSegments[0].currentWorkDate, "before") == CpspRef.cmp.Date &&
  //             CpspRef.cmp.getSomeDate(CpspRef.cmp.Date, activity.dateSegments[0].startWorkDate, "before") == activity.dateSegments[0].startWorkDate ) //ukoliko jos nije zavrsen zadatak, ali napreduje po planu
  //             || (activity.dateSegments[0].currentWorkDate != null && activity.dateSegments[0].currentWorkDate >= ConfigSc.currentDate.format(ConfigSc.dateFormat))
  //             ) {
  //             tape.setColor("#00FF33"); //zeleno OK
  //             tape.setFillColor("#00FF33");
  //             tape.setMoveValue(- ConfigSc.cellWidth / 4);
  //             tape.setCircleOnEnd();
  //           }
  //           else {
  //             tape.setColor("#FF5454");
  //             tape.setFillColor("#FF5454");
  //             tape.setMoveValue(- ConfigSc.cellWidth / 4);
  //             tape.setCircleOnEnd();
  //           }

  //         }
  //         else {
  //           tape.setColor("#FF5454");
  //           tape.setFillColor("#FF5454");
  //           tape.setMoveValue(0);
  //           tape.setCircleOnEnd();
  //         }

  //         if( activity.dateSegments[0].currentWorkDate != ConfigSc.currentDate.format(ConfigSc.dateFormat) && ((activity.dateSegments[0].currentWorkDate > ConfigSc.currentDate.format(ConfigSc.dateFormat) && activity.dateSegments[0].currentWorkDate == activity.endDate) || (activity.dateSegments[0].currentWorkDate < activity.endDate) ) ){
  //           //if(activity.dateSegments[0].currentWorkDate < ConfigSc.currentDate.format(ConfigSc.dateFormat)){
  //             const x = CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(new Date(activity.dateSegments[0].currentWorkDate ));
  //             const segmentWidth = momentM( ConfigSc.currentDate ,ConfigSc.dateFormat).
  //                                   diff(momentM(  activity.dateSegments[0].currentWorkDate, ConfigSc.dateFormat), 'days') + 1;
  //             segmentWidth = segmentWidth * ConfigSc.cellWidth;

  //             const line = new Line(
  //               x + ConfigSc.cellWidth,
  //               0 + 3 * ConfigSc.cellHeight / 5,
  //               activity.dateSegments[0].currentWorkDate < ConfigSc.currentDate.format(ConfigSc.dateFormat) ? x + segmentWidth : x + segmentWidth- ConfigSc.cellWidth,
  //               0 ,
  //               CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
  //               activityDateSegmentContainer
  //             );
  //             const line2 = new Line(
  //               x + ConfigSc.cellWidth,
  //               0 + 3 * ConfigSc.cellHeight / 5,
  //               activity.dateSegments[0].currentWorkDate < ConfigSc.currentDate.format(ConfigSc.dateFormat) ? x + segmentWidth : x + segmentWidth- ConfigSc.cellWidth,
  //               0 + ConfigSc.cellHeight,
  //               CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
  //               activityDateSegmentContainer
  //             );
  //             line.setLineThickness(2);
  //             line.setColor("red"); //zeleno OK
  //             line.setFillColor("red");
  //             line.setMoveValue(- ConfigSc.cellWidth / 2);
  //             line2.setLineThickness(2);
  //             line2.setColor("red"); //zeleno OK
  //             line2.setFillColor("red");
  //             line2.setMoveValue(- ConfigSc.cellWidth / 2);

  //         }

  //     }

  //     //if (Object.keys(project.resourceWeeks).length !== 0 || project.id <= 0) projectSegment.displayProjectSegmentWeeks();
  //     if (this.highlightedRow === rowNumber || activity.id === CpspRef.cmp.tapeMomActId) {

  //     CpspRef.cmp.selectedMomentsForStyleChange = [];
  //     CpspRef.cmp.selectedMomentsForStyleChange.push({
  //       projectId: CpspRef.cmp.selectedProject.id,
  //       activityId: activity.id,
  //       stateType: null,
  //       moment: activity,
  //       planId: null,
  //       y: activity.y
  //     });
  //     this.renderHighlightedLines(activityHeaderContainer);
  //     this.renderHighlightedLines(activityDateSegmentContainer);
  //     }

  //     this.renderProjectMoments(activity, momentsContainer, activity.id, activityDateSegmentContainer);

  //     //activity je smjesten u project container, ako ih je vise, potrebno je zapamtiti poziciju na kojoj ce nacrtati sljedeci
  //     i = i + activity.moments.length + 1;
  //     CpspRef.cmp.numberContainer += activity.moments.length + 1;
  //   });
  //   //return true;
  // }

  moveActivity(e, activity: Activity) {
    let checkMovement = { firstMove: true, savePosition: 0 };
    const lineminY = ConfigSc.topSectionSize + ConfigSc.toolboxSize;
    document.onmousemove = (event) => {
      //check is this the first move
      if (checkMovement.firstMove === true) {
        ConfigSc.firstMomentBoxSelectedPositionDelta = activity.y;
        this.firstMomentBoxSelectedPosition = activity.y//e.layerY;
        ConfigSc.deltaMovementBetweenBoxes = 0;

        //disallov sidebar to extend and select element
        this.freezeSidebar();

        // this.selectedMomentsContainer = new SelectedMomentsContainer(
        //   0,
        //   this.firstMomentBoxSelectedPosition +
        //     ConfigSc.deltaMovementBetweenBoxes,
        //   ConfigSc.sideCanvasSize - ConfigSc.sideSectionRightBorderWidth,
        //   activity.moments.length * ConfigSc.cellHeight,
        //   this.canvas,
        //   this.momentTableBodyContainer.getInnerContainer()
        // );

        this.movingLineIndicator = new MovingLineIndicator(
          0 + ConfigSc.cellHeight,
          0,
          "100%",
          ConfigSc.cellHeight * 2,
          this.canvas,
          this.selectedMomentsContainer
        );

        this.canvas.addChild(this.movingLineIndicator);
        this.canvas.getChildren().forEach((child) => {
          if (
            child instanceof SideSectionMomentsContainer ||
            child instanceof MovingLineIndicator ||
            child instanceof MomentContainer
          ) {
          }
          this.canvas.addDrawingContainer(child);
        });

        //set first move to false
        checkMovement.savePosition =
          -this.movingLineIndicator.getGlobalY() +
          lineminY -
          ConfigSc.cellHeight;
        checkMovement.firstMove = false;
      }

      //set movinglineindicator when mouse hovers header
      if (
        event.movementY != 0 &&
        checkMovement.firstMove === false &&
        event.y < lineminY + 1
      ) {
        this.movingLineIndicator.setY(checkMovement.savePosition);
        this.movingLineIndicator.sumY = checkMovement.savePosition;
      }

      //check for movement
      if (
        event.movementY != 0 &&
        checkMovement.firstMove === false &&
        event.y > lineminY + 1
      ) {
        this.throttle(() => {
          this.movingLineIndicator.move(event.movementY);
        }, 100)();
      }
    };

    document.onmouseup = (e2) => {
      if (checkMovement.firstMove === false) {
        document.body.style.cursor = "default";
        if (e.screenY === e2.screenY) {
          this.canvas.removeChildById(this.movingLineIndicator.getId());
          this.highlightedRow = null;
          this.refreshDisplay();
          this.canvas.resetDrawingContainers();
          return;
        }

        const momentsInBox = this.selectedMomentsContainer
          ? this.selectedMomentsContainer.getSelectedMoments()
          : [];


        if (momentsInBox.length == 0) {
          this.canvas.resetDrawingContainers();
          this.refreshDisplay();
          this.canvas.removeChildById(this.selectedMomentsContainer.getId());
          this.canvas.removeChildById(this.movingLineIndicator.getId());
          return;
        }

        // const mY = this.movingLineIndicator.getY();
        // const currentProject = CpspRef.cmp.copySelectedProject;

        // const maxY = currentProject.activities[currentProject.activities.length - 1].y;
        // historySchedulePlaner.addToQueue(
        //     () => true,
        //     () => true
        // );

        if (this.movingLineIndicator.getY() < 0) {
          momentsInBox.sort((a, b) => {
            return b.userY - a.userY;
          });
        }

        // if (momentsInBox.length != 0) {
        //   let newYSelectedContainer =
        //     CpspRef.cmp.selectedProject.activities.find(
        //       (a) => a.id == momentsInBox[0].id
        //     ).y;
        //     for(let i = 0; i < momentsInBox.length; i++){
        //       this.onDropActivity(momentsInBox.at(i), mY);
        //     }
        //   this.selectedMomentsContainer.setY(
        //     this.selectedMomentsContainer.getY() +
        //       (CpspRef.cmp.selectedProject.activities.find(
        //         (a) => a.id == momentsInBox[0].id
        //       ).y -
        //         newYSelectedContainer)
        //   );
        // }
        momentsInBox.forEach((moment, index) => {
          // currentProject.activities = currentProject.activities.sort(
          //   (a, b) => a.sortIndex - b.sortIndex
          // );
          // const userIndex = currentProject.users.findIndex(
          //   (u) => u.id == user.userId
          // );
          // if (userIndex == -1) {
          //   return;
          // }
          // if (uIndex == -1) {
          //   this.onDropUser(
          //     null,
          //     userIndex,
          //     currentUserProjectIndex,
          //     maxY,
          //     true
          //   );
          // } else {
          //   this.onDropUser(
          //     null,
          //     userIndex,
          //     currentUserProjectIndex,
          //     mY +
          //       currentProject.users[userIndex].y +
          //       ConfigSc.cellHeight *
          //         (mY > 0 ? -index : index - usersInBox.length + 1),
          //     true
          //   );
          // }
        });
        // this.enumerateUnmovedUsers();

        // history.appendToQueueGroup(
        //   () => true,
        //   () => true
        // ); // needs to be here to store state for redo

        this.canvas.resetDrawingContainers();
        this.highlightedRow = null;
        this.canvas.removeChildById(this.selectedMomentsContainer.getId());
        this.canvas.removeChildById(this.movingLineIndicator.getId());
        CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.draw()
        CpspRef.cmp.projectSchedulePlanerApp.mainHeader.draw();
        if(momentsInBox.length > 0){
          historySchedulePlaner.addToQueue(
            () => true,
            () => true
          );
        }
        this.refreshDisplay();

      }
      //set sidebar styles to default
      this.unfreezeSidebar();

      //remove on mouseup eventListener
      document.onmousemove = (e) => {};
      document.onmouseup = (e) => {};
    };
  }

  //freeze sidebar when moving row
  freezeSidebar() {
    const sidebarWrapper = document.getElementById("sidebar-wrapper");
    sidebarWrapper.style.userSelect = "none";
    sidebarWrapper.style.width = "70px";
    const hexagons = document.querySelectorAll(
      ".hexagon"
    ) as unknown as HTMLElement[];
    hexagons.forEach((hexagon) => {
      hexagon.classList.remove("hexagon");
      hexagon.style.cursor = "move";
      hexagon.classList.add("hexagon-tidsplan");
    });
  }

  //unfreeze sidebar when row moved
  unfreezeSidebar() {
    const sidebarWrapper = document.getElementById("sidebar-wrapper");
    sidebarWrapper.style.userSelect = "all";
    sidebarWrapper.style.width = null;
    const hexagons = document.querySelectorAll(
      ".hexagon-tidsplan"
    ) as unknown as HTMLElement[];
    hexagons.forEach((hexagon) => {
      hexagon.classList.remove("hexagon-tidsplan");
      hexagon.classList.add("hexagon");
      hexagon.style.cursor = null;
    });
  }

  checkIfSelectedIsActivity(selectedPlans) {
    if (selectedPlans[0].planId == null) return true;
    return false;
  }

  onDropActivity(lineY: number) {

    const indexOfActivityBellow = CpspRef.cmp.selectedProject.activities.findIndex((a) => a.y > lineY);
    let activityToDrop = CpspRef.cmp.selectedProject.activities.at(indexOfActivityBellow - 1);


    let selectedActivityes = this.selectedMomentsContainer.getSelectedMoments();

    let sortIndex = Number(activityToDrop.sort_index) + 0.01;
    for(let i = 0; i < selectedActivityes.length; i++){
      if(selectedActivityes.at(i).state_number) continue;
      let dropedActivity = CpspRef.cmp.copySelectedProject.activities.find((a) => a.id == selectedActivityes.at(i).id)
      dropedActivity.sort_index = sortIndex;
      dropedActivity.changed = true;
      sortIndex += 0.01;

    }

    //sort and calculate y for  copyselectedproject activities by the new sort indexes
    CpspRef.cmp.copySelectedProject.activities.sort(
      (a, b) => Number(a.sort_index) - Number(b.sort_index)
    );
    let activityY = 0;
    let sortIndexActivity = 1;
    CpspRef.cmp.copySelectedProject.activities.forEach((activity) => {
      activity.y = activityY;
      const oldSortIndex = activity.sort_index
      activityY =
        activityY + (activity.moments.length + 1) * ConfigSc.cellHeight;
      activity.sort_index = sortIndexActivity;
      sortIndexActivity++;
      if(oldSortIndex != activity.sort_index)
        activity.changed = true;
    });

    CpspRef.cmp.selectedProject = CpspRef.cmp.deepCopy(CpspRef.cmp.copySelectedProject)
    historySchedulePlaner.addToQueue(
      () => true,
      () => true
      );

    const newY = Number(CpspRef.cmp.copySelectedProject.activities.find((a) => a.id == selectedActivityes.at(0).id).y)

    this.selectedMomentsContainer.setY(newY);
  }

  // onDropActivity(activitySelected, lineY: number) {
  //   // const changes = [];
  //   // const previousValues = [];
  //   let movingActivityOnNewPlace = 0;

  //   let activityY = 0;
  //   // CpspRef.cmp.copySelectedProject.activities.forEach((activity) => {
  //   //     activity.y = activityY;
  //   //     activityY = activityY + (activity.moments.length + 1) * ConfigSc.cellHeight;
  //   // });
  //   let activitySelectedIndex = -1;
  //   const newYPosition = activitySelected.y + lineY;
  //   let newSortIndex = 0;

  //   CpspRef.cmp.selectedProject.activities.forEach((activity, index) => {
  //     // moving up, on first place in table
  //     if (
  //       lineY < -25 &&
  //       newYPosition < activity.y &&
  //       movingActivityOnNewPlace == 0 &&
  //       activitySelectedIndex == -1
  //     ) {
  //       movingActivityOnNewPlace = -1;
  //       newSortIndex = 1;
  //     }

  //     // moving up, elements between new place for activity and selected activity
  //     if (
  //       lineY < -25 &&
  //       movingActivityOnNewPlace == -1 &&
  //       activitySelectedIndex == -1
  //     ) {
  //       // previousValues.push(activity);
  //       activity.changed = true;
  //       activity.sort_index = Number(activity.sort_index) + 1;
  //       CpspRef.cmp.copySelectedProject.activities.at(index).sort_index = activity.sort_index;
  //       CpspRef.cmp.copySelectedProject.activities.at(index).changed = true;
  //       // changes.push(activity);
  //     }

  //     //new position found, set activity below found one
  //     if (
  //       activity.y <= newYPosition &&
  //       newYPosition <
  //         activity.y + (activity.moments.length + 1) * ConfigSc.cellHeight
  //     ) {
  //       if (lineY < -25) {
  //         movingActivityOnNewPlace = -1;
  //         newSortIndex = Number(activity.sort_index) + 1;
  //       } else if (
  //         lineY >
  //         activitySelected.moments.length * ConfigSc.cellHeight
  //       ) {
  //         movingActivityOnNewPlace = 1;
  //         newSortIndex = activity.sort_index;

  //         // previousValues.push(activity);
  //         activity.changed = true;
  //         activity.sort_index = Number(activity.sort_index) - 1;
  //         CpspRef.cmp.copySelectedProject.activities.at(index).sort_index = activity.sort_index;
  //         CpspRef.cmp.copySelectedProject.activities.at(index).changed = true;
  //         // changes.push(activity);
  //       }
  //     }

  //     // moving down, elements between selected activity and new place for selected activity
  //     if (
  //       lineY >
  //         activitySelected.moments.length * ConfigSc.cellHeight &&
  //       activitySelectedIndex != -1 &&
  //       movingActivityOnNewPlace == 0
  //     ) {
  //       // previousValues.push(activity);
  //       activity.changed = true;
  //       activity.sort_index = Number(activity.sort_index) - 1;
  //       CpspRef.cmp.copySelectedProject.activities.at(index).sort_index = activity.sort_index;
  //       CpspRef.cmp.copySelectedProject.activities.at(index).changed = true;
  //       // changes.push(activity);
  //     }

  //     if (activitySelected.id == activity.id) {
  //       activitySelectedIndex = index;
  //     }
  //   });

  //   if (activitySelectedIndex != -1 && newSortIndex != 0) {
  //     // previousValues.push(
  //     //   CpspRef.cmp.selectedProject.activities[activitySelectedIndex]
  //     // );
  //     CpspRef.cmp.selectedProject.activities[activitySelectedIndex].sort_index =
  //       newSortIndex;
  //     CpspRef.cmp.copySelectedProject.activities.at(activitySelectedIndex).sort_index =
  //       newSortIndex;
  //     CpspRef.cmp.copySelectedProject.activities.at(activitySelectedIndex).changed = true;
  //     // changes.push(
  //     //   CpspRef.cmp.selectedProject.activities[activitySelectedIndex]
  //     // );
  //   }

  //   // CpspRef.cmp.changeScheduleActivitiesAddToHistory(previousValues, changes);
  //   // CpspRef.cmp.addListContentToHistory();

  //   //sort and calculate y for  selectedproject activities by the new sort indexes
  //   CpspRef.cmp.selectedProject.activities.sort(
  //     (a, b) => Number(a.sort_index) - Number(b.sort_index)
  //   );
  //   CpspRef.cmp.selectedProject.activities.forEach((activity) => {
  //     activity.y = activityY;
  //     activityY =
  //       activityY + (activity.moments.length + 1) * ConfigSc.cellHeight;
  //   });

  //   //copy selectedproject activities to copyselectedproject activities with saving moments

  //   //if there is a bug, compare selectedproject and copyselected project activities, both arrays must have same ids
  //   // CpspRef.cmp.selectedProject.activities.forEach((activity, i) => {
  //   //   let a = CpspRef.cmp.copySelectedProject.activities.findIndex(
  //   //     (act) => act.id == activity.id
  //   //   );
  //   //   if (i != a) {
  //   //     const saveMoments = this.deepCopy(
  //   //       CpspRef.cmp.copySelectedProject.activities[a].moments
  //   //     );
  //   //     CpspRef.cmp.copySelectedProject.activities[a] = this.deepCopy(
  //   //       CpspRef.cmp.selectedProject.activities[i]
  //   //     );
  //   //     CpspRef.cmp.copySelectedProject.activities[a].moments =
  //   //       this.deepCopy(saveMoments);
  //   //   }
  //   // });

  //   //sort and calculate y for  copyselectedproject activities by the new sort indexes
  //   CpspRef.cmp.copySelectedProject.activities.sort(
  //     (a, b) => Number(a.sort_index) - Number(b.sort_index)
  //   );
  //   CpspRef.cmp.copySelectedProject.activities.forEach((activity) => {
  //     activity.y = activityY;
  //     activityY =
  //       activityY + (activity.moments.length + 1) * ConfigSc.cellHeight;
  //   });
  // }

  filterActivity(activity) {
    const activity_index = this.show_activity.findIndex(
      (obj) => obj.id == activity.id
    );
    if (this.show_activity[activity_index].show == "arrow-open") {
      this.show_activity[activity_index].show = "arrow-close";
    } else {
      this.show_activity[activity_index].show = "arrow-open";
      this.show_states = [];
    }
    //delete activities
    /*CpspRef.cmp.selectedProject.activities[activity_index].moments=CpspRef.cmp.copySelectedProject.activities[activity_index].moments.filter((obj) => {

          return this.show_activity[activity_index].show == "arrow-open" ;

        });*/
    //end of delete activities
    this.refreshDisplay();
  }

  private renderProjectMoments(
    activity: Activity,
    momentsContainer: GenericContainer,
    activityIndex: number,
    activityDateSegmentContainer: GenericContainer,
    activityIn: number
  ) {
    let i = 0;
    const datepipe = new DatePipe("en-US");
    activity.moments.forEach((moment, momentIndex) => {
      // if(activity.y + moment.y > this.momentTableBodyContainer.getHeight())return;
      const rowNumber =
        (activity.y + i * ConfigSc.cellHeight + ConfigSc.cellHeight) /
          ConfigSc.cellHeight +
        1;

      const momentContainer = new MomentContainer(
        0,
        i * ConfigSc.cellHeight,
        "100%",
        ConfigSc.cellHeight,
        this.canvas,
        momentsContainer
      );

      if (activity.id != 0) {
        if (moment.id < 0) {
          momentContainer.setBackgroundColor(moment.styles.backgroundColor); //Use to set background color for negative moment indexes
        } else {
          momentContainer.setBackgroundColor(moment.styles.backgroundColor);
        }
      }
      // const activityGlobalY =
      //   ConfigSc.toolboxSize +
      //   ConfigSc.topSectionSize +
      //   activity.y +
      //   CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer
      //     .getMomentTableBodyContainer()
      //     .getInnerContainer()
      //     .getY();
      if (
        ConfigSc.isInEditMode &&
        (CpspRef.cmp.property_index == CpspRef.cmp.revisions.length + 1 || !CpspRef.cmp.lockedRevision)
      ) {
        momentContainer.setOnMouseDownHandler((e) => {
          if ((CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.lockedRevision)) {
            return;
          }
          CpspRef.cmp.hideColumnValueInput();
          CpspRef.cmp.tapeMomActId = 0;

          // CpspRef.cmp.projectSchedulePlanerApp.showHideResourcePlanning.clickOnHide();
          // if (this.selectedMomentsContainer) {
          //   this.canvas.removeChildById(this.selectedMomentsContainer.getId());
          //   if (this.movingLineIndicator) this.canvas.removeChildById(this.movingLineIndicator.getId());
          //   this.momentTableBodyContainer
          //     .getInnerContainer()
          //     .removeChildById(this.selectedMomentsContainer.getId());
          //   this.selectedMomentsContainer = null;
          //   ConfigSc.boxHeight = 0;
          // }

          // if (activity.id != 0) {
          //   //selecting multiple rows
          //   if (e.shiftKey) {
          //     ConfigSc.firstMomentBoxSelectedPositionDelta = activity.y + ConfigSc.cellHeight + momentContainer.getY();

          //     this.firstMomentBoxSelectedPosition = e.offsetY;
          //     ConfigSc.deltaMovementBetweenBoxes = 0;
          //     return;
          //   }

          //   CpspRef.cmp.changeFontFamilyInputValue = moment.styles.fontFamily;
          //   CpspRef.cmp.changeFontSizeInputValue = moment.styles.fontSize;
          //   CpspRef.cmp.changeBackgroundColorInputValue = moment.styles.backgroundColor;
          //   CpspRef.cmp.changeTextColorInputValue = moment.styles.color;
          //   CpspRef.cmp.changeFontWeightInputValue = moment.styles.fontWeight == "bold" ? true : false;
          //   CpspRef.cmp.changeFontStyleInputValue = moment.styles.fontStyle == "italic" ? true : false;
          //   CpspRef.cmp.changeFontDecorationInputValue = moment.styles.fontDecoration == "underline" ? true : false;
          // }

          // this.movingLineIndicator = new MovingLineIndicator(momentContainer.getX(), momentContainer.getY(), "100%", ConfigSc.cellHeight * 2, this.canvas, momentsContainer);

          const cursorChangeTimeout = setTimeout(() => {
            document.body.style.cursor = "n-resize";
          }, 100);

          // this.canvas.addChild(this.movingLineIndicator);
          this.canvas.addChild(momentContainer);

          this.canvas.getChildren().forEach((child) => {
            if (
              child instanceof SideSectionMomentsContainer ||
              child instanceof MovingLineIndicator ||
              child instanceof MomentContainer
            ) {
            }
            this.canvas.addDrawingContainer(child);
          });

          //enable changing text layout

          // CpspRef.cmp.selectedMomentsForStyleChange = [];
          // CpspRef.cmp.selectedMomentsForStyleChange.push({
          //   projectId: CpspRef.cmp.selectedProject.id,
          //   activityId: activity.id,
          //   stateType: moment.state,
          //   moment: moment,
          //   planId: moment.id,
          //   y: activityGlobalY + i * ConfigSc.cellHeight + ConfigSc.cellHeight,
          //   state_number: moment.state_number,
          //   parent: moment.parent
          // });

          // this.canvas.getCanvasElement().onmousemove = ev => {
          //   if (ev.movementY != 0) {
          //     this.throttle(() => { this.movingLineIndicator.move(ev.movementY); }, 100)();
          //     momentContainer.move(ev.movementY);
          //   }

          // };

          this.addRemoveEventsForMouseDownEvent((e2) => {
            document.body.style.cursor = "default";
            if (e.screenY === e2.screenY) {
              clearTimeout(cursorChangeTimeout);
              this.highlightedRow = rowNumber;
              CpspRef.cmp.tapeMomActId = null;
              this.canvas.removeChildById(this.movingLineIndicator.getId());
              this.canvas.removeChildById(momentContainer.getId());
              this.refreshDisplay();
              this.canvas.resetDrawingContainers();
              return;
            }
            this.canvas.removeChildById(momentContainer.getId());
            this.highlightedRow = null;
            CpspRef.cmp.tapeMomActId = 0;

            if (
              !this.getMomentTableBodyContainer().isShapeClicked(
                e2.layerX,
                e2.layerY
              )
            ) {
              momentContainer.setY(
                CpspRef.cmp.selectedProject.activities[activity.id].moments[
                  moment.id
                ].y
              );
              this.canvas.resetDrawingContainers();
              this.refreshDisplay();
              return;
            }

            // this.onDropMoment(
            //   activity,
            //   moment,
            //   this.movingLineIndicator.getY()
            // );

            //this.enumerateUnmovedUsers();

            this.canvas.resetDrawingContainers();
            this.refreshDisplay();
            this.canvas.removeChildById(this.movingLineIndicator.getId());
          });
        });
      }

      const c = new ProjectColumn(
        0,
        0,
        ProjectMomentsTableHead.threeVerticalDotsColumnWidth,
        momentContainer.getHeight(),
        this.canvas,
        momentContainer
      );
      c.setBorder("#9d9d9d", 1);
      if (
        ConfigSc.isInEditMode &&
        (CpspRef.cmp.property_index == CpspRef.cmp.revisions.length + 1 || !CpspRef.cmp.lockedRevision)
      ) {
        c.setOnMouseHoverHandler(
          () => (document.body.style.cursor = "pointer")
        );
        c.setOnClickHandler((e) => {
          this.selectedMomentsContainer = null;
          CpspRef.cmp.hideColumnValueInput();
          const dropdownMenu = new DropdownMenu(
            e.layerX,
            e.layerY,
            200,
            200,
            this.canvas
          );

          dropdownMenu.addOption(
            CpspRef.cmp.getTranslate().instant("Delete"),
            (e) => {
              // moment["showInResourcePlanning"] = moment.hasOwnProperty("showInResourcePlanning") ? !moment.showInResourcePlanning : false;

              // history.addToQueue(
              //     () => CpspRef.cmp.setUserCountAsResources(moment.id, project.id, moment.isResponsiblePerson, moment.showInResourcePlanning),
              //     () => CpspRef.cmp.setUserCountAsResources(moment.id, project.id, moment.isResponsiblePerson, !moment.showInResourcePlanning));
              // CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
              // CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();

              CpspRef.cmp.showConfirmationModal(
                CpspRef.cmp.getTranslate().instant("Do you want to delete?"),
                async (response) => {
                  if (response.result) {
                    if (CpspRef.cmp.loading) {
                      return;
                    }
                    CpspRef.cmp.setLoadingStatus(true);
                    CpspRef.cmp.deleteSchedulePlan(activity.id, moment.id,false);
                    CpspRef.cmp.setLoadingStatus(false);
                  }
                }
              );
            }
          );



          // dropdownMenu.addOption(
          //   CpspRef.cmp.getTranslate().instant("Make new row"),
          //   (e) => {
          //     CpspRef.cmp.fillEmptyRow(1);
          //   }
          // );
          dropdownMenu.addOption(
            CpspRef.cmp.getTranslate().instant("Insert new row above"),
            (e) => {
              CpspRef.cmp.addNewMomentToExistingOne(
                // +moment.id,
                // +activity.id,
                momentIndex,
                activityIn,
                true
              ); //forward activity sort_index and true for add row above and false to add row below
            }
          );

          dropdownMenu.addOption(
            CpspRef.cmp.getTranslate().instant("Insert new row below"),
            (e) => {
              CpspRef.cmp.addNewMomentToExistingOne(
                // +moment.id,
                // +activity.id,
                momentIndex,
                activityIn,
                false
              );
            }
          );
          dropdownMenu.open();
        });
      }

      const cText = new TextRenderer("\u2807", this.canvas, c);
      cText.setFontSize(17);
      cText.setX(6);
      cText.setY(6);
      cText.updateTextDimensions();

      CpspRef.cmp.visibleColumns.forEach((column) => {
        const c = new ProjectColumn(
          column.x - ConfigSc.sidebarSize,
          0,
          column.width,
          momentContainer.getHeight(),
          this.canvas,
          momentContainer
        );
        c.setBorder("#9d9d9d", 1);

        let text = "";
        const state_arr = {
          id: moment.id,
          state_number: moment.state_number,
          show: "arrow-open",
        };
        if (
          !this.show_states.find(
            (e) => e.id == moment.id && e.state_number == moment.state_number
          )
        ) {
          //check if state is already in show_states array
          const indexOfState = this.show_states.findIndex(
            (s) => s.id == state_arr.id
          );
          if (indexOfState == -1) {
            this.show_states.push(state_arr);
          } else {
            this.show_states[indexOfState].state_number = moment.state_number;
          }
        }
        const state_index_show = this.show_states.findIndex(
          (obj) =>
            obj.id == moment.id && obj.state_number == moment.state_number
        );
        //if (column.key === null) {
        if (
          column.values[CpspRef.cmp.project.id] &&
          column.values[CpspRef.cmp.project.id].activities[
            moment.activity_id
          ] &&
          column.values[CpspRef.cmp.project.id].activities[moment.activity_id]
            .plans[moment.id]
        ) {
          text =
            column.values[CpspRef.cmp.project.id].activities[moment.activity_id]
              .plans[moment.id];
        }

        if (
          ConfigSc.isInEditMode &&
          (CpspRef.cmp.property_index == CpspRef.cmp.revisions.length + 1 || !CpspRef.cmp.lockedRevision)
        ) {
          // c.setOnDoubleClickHandler(() => {
          c.setOnMouseDownHandler(e =>{
            this.firstMove = 0;
            this.selectedColumns(c,column,activity.id,moment.id);
            c.addRemoveEventsForMouseDownEvent(() => {


              CpspRef.cmp.changeFontFamilyInputValue = moment.styles.fontFamily;
              CpspRef.cmp.changeFontSizeInputValue = moment.styles.fontSize;
              CpspRef.cmp.changeBackgroundColorInputValue =
                moment.styles.backgroundColor;
              CpspRef.cmp.changeTextColorInputValue = moment.styles.color;
              CpspRef.cmp.changeBackgroundTapeColorInputValue = moment.tape_color;
              CpspRef.cmp.changeFontWeightInputValue =
                moment.styles.fontWeight == "bold" ? true : false;
              CpspRef.cmp.changeFontStyleInputValue =
                moment.styles.fontStyle == "italic" ? true : false;
              CpspRef.cmp.changeFontDecorationInputValue =
                moment.styles.fontDecoration == "underline" ? true : false;

              if (column.key == null) {
                if (
                  (CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.lockedRevision)
                ) {
                  return;
                }
                // CpspRef.cmp.newColumnValueInput.style.display = "block";
                // CpspRef.cmp.newColumnValueInput.style.width = `${c.getWidth()}px`;
                // CpspRef.cmp.newColumnValueInput.style.height = `${c.getHeight()}px`;
                // CpspRef.cmp.newColumnValueInput.style.border = "3px solid #F77E04";
                //CpspRef.cmp.newColumnValueInput.value = text;
                CpspRef.cmp.newColumnValueInput.style.top = `${c.getGlobalY()}px`;
                const x = ConfigSc.sidebarSize + c.getGlobalX();
                this.marginLeft = x;
                this.marginTop = c.getGlobalY();
                this.selColumn = null;
                CpspRef.cmp.indexOfVisibleColumn = undefined;
                // CpspRef.cmp.newColumnValueInput.style.left = `${x}px`;
                // CpspRef.cmp.newColumnValueInput.focus();
                //  CpspRef.cmp.columnInput.select();

                CpspRef.cmp.selectedColumnForEditing = column;
                CpspRef.cmp.activityIndex = Number(activity.id);
                CpspRef.cmp.planIndex = Number(moment.id);
                this.showInput(x);
              }
              if (
                (column.key === "numberOfDays" ||
                  column.key == "start_date" ||
                  column.key === "end_date")
              ) {
                if (this.firstMove != 0){
                  this.setSelectedColums();
                  return;
                }
                if (moment.percentage_of_realized_plan != null) return;
                this.setColumnDoubleClickHandler(
                  c,
                  column,
                  activity.id,
                  moment.id,
                  text
                );
              } else if (
                column.key !== "Details" &&
                column.key !== "start_date" &&
                column.key !== "end_date"
              ) {
                if (
                  column.key == "resource" ||
                  column.key === "days" ||
                  column.key === "hours" ||
                  column.key === "finished"
                ) {
                  if (this.firstMove != 0){
                    this.setSelectedColums();
                    return;
                  }
                  if (moment.percentage_of_realized_plan != null) return;
                  if (
                    (CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.lockedRevision)
                  ) {
                    return;
                  }
                  CpspRef.cmp.hideColumnValueInput();
                  // CpspRef.cmp.resourceWeekInput.style.display = "block";
                  // CpspRef.cmp.resourceWeekInput.style.textAlign = "left";
                  // CpspRef.cmp.resourceWeekInput.style.width = `${c.getWidth()}px`;
                  // CpspRef.cmp.resourceWeekInput.style.height = `${c.getHeight()}px`;
                  // CpspRef.cmp.resourceWeekInput.style.border = "3px solid #F77E04";
                  if (column.key === "hours" || column.key === "finished")
                    CpspRef.cmp.resourceWeekInput.value =
                      column.key == "hours"
                        ? moment.time != null
                          ? moment.time.toString()
                          : "0"
                        : moment.dateSegments[0].finishedTime != null
                        ? moment.dateSegments[0].finishedTime.toString()
                        : "0";
                  else CpspRef.cmp.resourceWeekInput.value = text.toString();
                  CpspRef.cmp.resourceWeekInput.style.top = `${c.getGlobalY()}px`;
                  const x = ConfigSc.sidebarSize + c.getGlobalX();
                  this.marginLeft = x;
                  this.marginTop = c.getGlobalY();
                  this.selColumn = null;
                  CpspRef.cmp.indexOfVisibleColumn = undefined;
                  // CpspRef.cmp.resourceWeekInput.style.left = `${x}px`;
                  // CpspRef.cmp.resourceWeekInput.focus();
                  // CpspRef.cmp.resourceWeekInput.select();
                  CpspRef.cmp.selectedColumnForEditing = column;
                  this.showInput(x);
                }
                //case for plan i part
                else if (column.key == "plan" || column.key == "part") {
                  //if( moment.percentage_of_realized_plan != null) return;
                  if(this.firstMove != 0){
                    this.setSelectedColums();
                    return;
                  }
                  if (
                    (CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.lockedRevision)
                  ) {
                    return;
                  }
                  CpspRef.cmp.hideColumnValueInput();
                  // CpspRef.cmp.planInput.style.display = "block";
                  // CpspRef.cmp.planInput.style.textAlign = "left";
                  // CpspRef.cmp.planInput.style.width = `${c.getWidth()}px`;
                  // CpspRef.cmp.planInput.style.height = `${c.getHeight()}px`;
                  // CpspRef.cmp.planInput.style.border = "3px solid #F77E04";
                  CpspRef.cmp.planInput.value = text.toString();
                  CpspRef.cmp.planInput.style.top = `${c.getGlobalY()}px`;
                  const x = ConfigSc.sidebarSize + c.getGlobalX();
                  this.marginLeft = x;
                  this.marginTop = c.getGlobalY();
                  this.selColumn = null;
                  CpspRef.cmp.indexOfVisibleColumn = undefined;
                  // CpspRef.cmp.planInput.style.left = `${x}px`;
                  // CpspRef.cmp.planInput.focus();
                  // CpspRef.cmp.planInput.select();
                  CpspRef.cmp.selectedColumnForEditing = column;
                  this.showInput(x);
                }

                CpspRef.cmp.selectedColumnForEditing = column;
                CpspRef.cmp.activityIndex = Number(activity.id);
                CpspRef.cmp.planIndex = Number(moment.id);
              }
              this.highlightedRow = rowNumber;
              CpspRef.cmp.tapeMomActId = null;
              this.selectedMomentsContainer = null;
              this.refreshDisplay();
            });
          })

        }
        //} else {
        if (column.key === "Details") {
          text = moment["name"];




          if(ConfigSc.isInEditMode)
          c.setOnMouseDownHandler((e) => {

            // use for consoling out moment id on details click
            if (
              (CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.lockedRevision)
            ) {
              return;
            }
            CpspRef.cmp.selectedColumns = [];
            CpspRef.cmp.tapeMomActId = null;
            ConfigSc.firstMomentBoxSelectedPositionDelta =
              activity.y + ConfigSc.cellHeight + momentContainer.getY();
            this.firstMomentBoxSelectedPosition = e.offsetY;
            ConfigSc.deltaMovementBetweenBoxes = 0;
            this.selectedMomentsContainer = null;

            CpspRef.cmp.changeFontFamilyInputValue = moment.styles.fontFamily;
            CpspRef.cmp.changeFontSizeInputValue = moment.styles.fontSize;
            CpspRef.cmp.changeBackgroundColorInputValue =
              moment.styles.backgroundColor;
            CpspRef.cmp.changeTextColorInputValue = moment.styles.color;
            CpspRef.cmp.changeBackgroundTapeColorInputValue = moment.tape_color;
            CpspRef.cmp.changeFontWeightInputValue =
              moment.styles.fontWeight == "bold" ? true : false;
            CpspRef.cmp.changeFontStyleInputValue =
              moment.styles.fontStyle == "italic" ? true : false;
            CpspRef.cmp.changeFontDecorationInputValue =
              moment.styles.fontDecoration == "underline" ? true : false;
            this.firstMove = 0;
            //document.body.style.cursor = "crosshair";
            CpspRef.cmp.projectSchedulePlanerApp.mainHeader.closeDropDowns();
            this.selectedColumns(c,column,activity.id,moment.id);

            // this.canvas.getCanvasElement().onmousemove = (ev) => {
            //   if (ev.movementY != 0 && firstMove == 0) {
            //     CpspRef.cmp.activityIndex = activity.id;
            //     CpspRef.cmp.planIndex = moment.id;
            //     //this.createSelectedMomentsContainer(e.offsetX, e.offsetY - ConfigSc.toolboxSize);
            //     this.createSelectedMomentsContainer(
            //       e.layerX,
            //       e.layerY - ConfigSc.toolboxSize
            //     );
            //     firstMove = 1;
            //     this.highlightedRow = null;
            //     this.refreshDisplay();
            //   }
            // };

            c.addRemoveEventsForMouseDownEvent(() => {
              this.highlightedRow = null;
              if (this.firstMove != 0){
                this.setSelectedColums();
                return;
              }
              this.canvas.getCanvasElement().onmousemove = null;
              if (
                (CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.lockedRevision)
              ) {
                return;
              }
              if (
                this.getMomentTableBodyContainer()
                  .getHorizontalScrollbar()
                  .getSlider()
                  .getX() > 0
              ) {
                const move_x_left = -this.getMomentTableBodyContainer()
                  .getHorizontalScrollbar()
                  .getSlider()
                  .getX();
                this.getMomentTableBodyContainer()
                  .getHorizontalScrollbar()
                  .getSlider()
                  .move(move_x_left);
                this.refreshDisplay();
              }
              // CpspRef.cmp.columnValueInput.style.display = "block";
              // CpspRef.cmp.columnValueInput.style.textAlign = "left";
              // CpspRef.cmp.columnValueInput.style.width = `${c.getWidth()}px`;
              // CpspRef.cmp.columnValueInput.style.height = `${c.getHeight()}px`;
              // CpspRef.cmp.columnValueInput.style.border = "3px solid #F77E04";
              // CpspRef.cmp.columnValueInput.value = text;
              const topY = c.getGlobalY();
              CpspRef.cmp.columnValueInput.style.top = `${topY}px`;
              this.marginLeft = ConfigSc.sidebarSize + c.getGlobalX();
              this.marginTop = topY;
              this.selColumn = null;
              CpspRef.cmp.indexOfVisibleColumn = undefined;
              // const x = ConfigSc.sidebarSize + ProjectMomentsTableHead.threeVerticalDotsColumnWidth;
              // CpspRef.cmp.columnValueInput.style.left = `${x}px`;
              // CpspRef.cmp.columnValueInput.style.pointerEvents = "auto"
              // CpspRef.cmp.deleteDetails = true;
              // //CpspRef.cmp.columnValueInput.focus();
              // //CpspRef.cmp.columnValueInput.select();

              // document.getElementById("columnValueEditInput1").style.display = "block"
              // document.getElementById("columnValueEditInput1").style.textAlign = "left";
              // //document.getElementById("columnValueEditInput1").focus();
              // document.getElementById("selectValue").style.display = "block"
              CpspRef.cmp.inputValue = text;
              CpspRef.cmp.selectedColumnForEditing = column;
              CpspRef.cmp.activityIndex = Number(activity.id);
              CpspRef.cmp.planIndex = moment.id;

              this.highlightedRow = rowNumber;
              this.showInput(this.marginLeft);
              this.refreshDisplay();
            });
          });

          if (
            moment.percentage_of_realized_plan != null &&
            moment.dateSegments.at(0).startDate != null &&
            moment.dateSegments.at(-1).endDate != null
          ) {
            //    if (CpspRef.cmp.copySelectedProject.activities.find(a => a.id == moment.activity_id).moments.findIndex(m => m.parent == moment.id) != -1 && moment.start_date != null && moment.end_date != null) {

            const state_arrow = this.addIcon(
              12 + 6 * moment.state_number,
              this.show_states[state_index_show].show == "arrow-open" ? 10 : 6,
              this.show_states[state_index_show].show == "arrow-open" ? 8 : 8,
              this.show_states[state_index_show].show == "arrow-open" ? 12 : 12,
              this.show_states[state_index_show].show,
              this.show_states[state_index_show].show,
              () => {

              },
              c
            );
            const state_arrow_rec = new GenericContainer(
              5 + 6 * moment.state_number,
              5,
              15,
              15,
              this.canvas,
              c
            );
            //if(ConfigSc.isInEditMode){
              state_arrow_rec.setOnMouseHoverHandler(() => (document.body.style.cursor = "pointer"));
            state_arrow_rec.setOnClickHandler(() => {
              CpspRef.cmp.hideColumnValueInput();
                this.isClickOnArrow = true;
                this.selectedMomentsContainer = null;
                this.highlightedRow = null;
                //const activity_index = this.show_activity.findIndex((obj => obj.id == activityIndex));

                const state_index = this.show_states.findIndex(
                  (obj) =>
                    obj.id == moment.id &&
                    obj.state_number == moment.state_number
                );
                if (this.show_states[state_index].show == "arrow-open") {
                  this.show_states[state_index].show = "arrow-close";
                } else {
                  this.show_states[state_index].show = "arrow-open";
                }

                //delete moments

                /*CpspRef.cmp.selectedProject.activities[activity_index].moments=CpspRef.cmp.copySelectedProject.activities[activity_index].moments
                                .filter((obj) => {

                                  const par_hide=true;



                                  const parent_index=CpspRef.cmp.copySelectedProject.activities[activity_index].moments.findIndex((new_obj)=> new_obj.id==obj.parent && new_obj.state_number==obj.state_number-1);
                                  if(parent_index!=-1){
                                    do{
                                      const show_state_parent=this.show_states.findIndex((sh_s)=>sh_s.id==CpspRef.cmp.copySelectedProject.activities[activity_index].moments[parent_index].id)
                                      if(show_state_parent!=-1 && this.show_states[show_state_parent].show=="arrow-close")
                                        par_hide=false;
                                      parent_index=CpspRef.cmp.copySelectedProject.activities[activity_index].moments.findIndex((new_obj)=> new_obj.id==CpspRef.cmp.copySelectedProject.activities[activity_index].moments[parent_index].parent && new_obj.state_number==CpspRef.cmp.copySelectedProject.activities[activity_index].moments[parent_index].state_number-1);
                                    }while(parent_index!=-1);
                                  }

                                  return par_hide;
                                });*/

                // this.calcMoments=true;
                this.refreshDisplay();
                //end of delete moments
            });
            //}

            state_arrow.getHeight();
          }
        } else {
          if (
            column.key == "start_date" ||
            (column.key == "end_date" &&
              moment.start_date != null &&
              moment.end_date != null)
          ) {
            // text = datepipe.transform(moment[column.key], "yy-MM-dd");
            // c.setOnMouseDownHandler(e => {
            //   this.firstMove = 0;
            //   this.selectedColumns(c,column);

            //   c.addRemoveEventsForMouseDownEvent(e2 =>{
            //     this.setSelectedColums();
            //   })
            // })
            text = column.key == "start_date" ? datepipe.transform(moment.dateSegments.at(0).startDate, "yy-MM-dd") :
                                                datepipe.transform(moment.dateSegments.at(-1).endDate, "yy-MM-dd")
          }
          //else if (column.key === "part" && moment.state != "STATE") {
          else if (column.key === "part") {
            // case if we want show parent as part
            // if(moment.part == null){
            //   const mom_parent = CpspRef.cmp.copySelectedProject.activities.find(a => a.id == activity.id).moments.find(m => m.id == moment.parent);
            //   text = mom_parent != undefined ? CpspRef.cmp.copySelectedProject.activities.find(a => a.id == activity.id).moments.find(m => m.id == moment.parent).name : moment.state;
            //   text == "STATE" ? text = "" : text;
            // }
            // else
            text = moment.part;
          }
          //else if (column.key === "plan" && moment.state != "STATE") {
          else if (column.key === "plan") {
            text = moment.plan;
          } else if (
            column.key === "days" &&
            moment.dateSegments[0] &&
            moment.start_date != null &&
            moment.end_date != null
          ) {
            if (moment.percentage_of_realized_plan != null)
              text = CpspRef.cmp
                .calculateDaysOfChildren(activity.id, moment.id)
                .toString();
            else{
              // text = String(
              //   CpspRef.cmp.getBusinessDatesCount(
              //     moment.start_date,
              //     moment.end_date
              //   )
              // );
              let daysOfMoment = 0;
              moment.dateSegments.forEach(dateSegment => {
                daysOfMoment += CpspRef.cmp.getBusinessDatesCount(
                      dateSegment.startDate,
                      dateSegment.endDate
                    )
              })
              text = daysOfMoment.toString();
            }

            //text = String(moment.dateSegments[0].numberOfDays);
          }
          // else if (column.key === "hours" && moment.time != null) {
          //   text = String(moment.time) + " h";
          // }
          else if (
            column.key === "hours" &&
            moment.start_date != null &&
            moment.end_date != null
          ) {
            if (moment.percentage_of_realized_plan != null) {
              const h = CpspRef.cmp.calculateHoursOfChildren(
                activity.id,
                moment.id
              );
              text = h + " h";
            } else {
              // const finish = momentM(moment.end_date, ConfigSc.dateFormat).
              //         diff(momentM(moment.start_date, ConfigSc.dateFormat), 'days') + 1;
              const finish = CpspRef.cmp.getBusinessDatesCount(
                moment.start_date,
                moment.end_date
              );

              if (moment.time != null && moment.time > 0) {
                text = moment.time + " h";
              } else
                text =
                  moment.number_of_workers > 0
                    ? moment.number_of_workers *
                        finish *
                        CpspRef.cmp.workingHours +
                      " h"
                    : 0 + " h";
            }
          } else if (
            column.key === "finished" &&
            moment.start_date != null &&
            moment.end_date != null
          ) {
            if (moment.percentage_of_realized_plan != null) {
              const h = CpspRef.cmp.calculateWorkedHoursOfChildren(
                activity.id,
                moment.id
              );
              text = h + " h";
            } else {
              // const finish = moment.dateSegments[0].currentWorkDate != null ? CpspRef.cmp.getBusinessDatesCount(moment.dateSegments[0].startWorkDate, moment.dateSegments[0].currentWorkDate) : 0
              // text = moment.number_of_workers > 0 && moment.dateSegments[0].currentWorkDate != null ? moment.number_of_workers * finish * 8 + " h" : 0 + " h";
              if (
                moment.dateSegments[0].finishedTime != null &&
                moment.dateSegments[0].finishedTime > 0
              ) {
                text = moment.dateSegments[0].finishedTime + " h";
              } else text = 0 + " h";
            }
          } else if (
            column.key === "resource" &&
            moment.number_of_workers != null &&
            moment.percentage_of_realized_plan == null &&
            moment.start_date != null &&
            moment.end_date != null
          ) {
            text = String(Number(moment.number_of_workers));
          }
        }
        //}

        if (text == null) text = "";
        const cText = new TextRenderer(text.toString(), this.canvas, c);
        cText.setColor(moment.styles.color);
        this.show_states[state_index_show].show == "arrow-open" &&
        this.show_states[state_index_show].id == moment.id &&
        moment.percentage_of_realized_plan != null
          ? cText.setFontWeight("bold")
          : cText.setFontWeight(moment.styles.fontWeight);
        cText.setFontStyle(moment.styles.fontStyle);
        cText.setFontDecoration(moment.styles.fontDecoration);
        cText.setFontSize(Number(moment.styles.fontSize));
        cText.setFontFamily(moment.styles.fontFamily);
        cText.setAlignment("right", "center");
        if (column.key === "Details") cText.setX(23 + 12 * moment.state_number);
        else cText.setX(5);

        cText.updateTextDimensions();
        //const tt =""

        // if (column.key == "part") {
        //   c.getInnerContainer().getCanvas().getCanvasElement().onmousemove = (ev) =>{
        //     if(ev.clientX - ConfigSc.sidebarSize - c.getWidth() <= c.getGlobalX() && c.getGlobalX() <= ev.clientX - ConfigSc.sidebarSize){
        //       tt = ""
        //     }
        //     else if(ev.clientX - ConfigSc.sidebarSize - c.getWidth() <= c.getGlobalX() + c.getWidth() && c.getGlobalX() + c.getWidth() <= ev.clientX - ConfigSc.sidebarSize)
        //       tt = ""
        //     else
        //       document.getElementById("mainCanvas").title = tt
        //   }

        // }

        // cText.setOnDoubleClickHandler((e) => {

        // this.canvas.addDrawingContainer(cText);

        // cText.getCanvas().getCanvasElement().onmouseover = (ev) => {

        // };

        //const writeOneTime = false;
        cText.setOnMouseHoverHandler(() => {
          if (column.key == "part" || column.key == "plan") {
            //this.canvas.getCanvasElement().onmouseover = (() => {
            //if (!writeOneTime) {
            //this.canvas.getContext().font = "15px Calibri";
            //this.canvas.getContext().fillText(text.toString(), cText.getGlobalX(), cText.getGlobalY() + ConfigSc.cellHeight);
            document.getElementById("mainCanvas").title = text.toString();
            //   writeOneTime = true;
            // }
            //});
            // const fullText = new TextRenderer(text.toString(), this.canvas, activityHeaderContainer);
            // fullText.setY(cText.getGlobalY() + ConfigSc.cellHeight);
            // fullText.setHeight(20);
            // fullText.setWidth(cText.getWidth());
          } else document.getElementById("mainCanvas").title = "";
        });

        if(ConfigSc.isInEditMode)
        cText.setOnMouseDownHandler((e) => {
          if ((CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.lockedRevision)) {
            return;
          }
          this.firstMove = 0;
          CpspRef.cmp.changeFontFamilyInputValue = moment.styles.fontFamily;
          CpspRef.cmp.changeFontSizeInputValue = moment.styles.fontSize;
          CpspRef.cmp.changeBackgroundColorInputValue =
            moment.styles.backgroundColor;
          CpspRef.cmp.changeTextColorInputValue = moment.styles.color;
          CpspRef.cmp.changeBackgroundTapeColorInputValue = moment.tape_color;
          CpspRef.cmp.changeFontWeightInputValue =
            moment.styles.fontWeight == "bold" ? true : false;
          CpspRef.cmp.changeFontStyleInputValue =
            moment.styles.fontStyle == "italic" ? true : false;
          CpspRef.cmp.changeFontDecorationInputValue =
            moment.styles.fontDecoration == "underline" ? true : false;
          if (column.key === "Details") {
            ConfigSc.firstMomentBoxSelectedPositionDelta =
              activity.y + ConfigSc.cellHeight + momentContainer.getY();
            this.firstMomentBoxSelectedPosition = e.offsetY;
            ConfigSc.deltaMovementBetweenBoxes = 0;
            //document.body.style.cursor = "crosshair";

            this.selectedColumns(c,column,activity.id,moment.id);
          } else {
            this.firstMove = 0;
            this.selectedColumns(c,column,activity.id,moment.id);
          }

          cText.addRemoveEventsForMouseDownEvent(() => {
            this.highlightedRow = null;
            this.selectedMomentsContainer = null;
            // if (this.firstMove != 0) return;

            if (column.key === "Details") {
              if(this.firstMove != 0){
                this.setSelectedColums();
                return;
              }
              if (
                (CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.lockedRevision)
              ) {
                return;
              }
              if (
                this.getMomentTableBodyContainer()
                  .getHorizontalScrollbar()
                  .getSlider()
                  .getX() > 0
              ) {
                const move_x_left = -this.getMomentTableBodyContainer()
                  .getHorizontalScrollbar()
                  .getSlider()
                  .getX();
                this.getMomentTableBodyContainer()
                  .getHorizontalScrollbar()
                  .getSlider()
                  .move(move_x_left);
                this.refreshDisplay();
              }
              // CpspRef.cmp.columnValueInput.style.display = "block";
              // CpspRef.cmp.columnValueInput.style.textAlign = "left";
              // CpspRef.cmp.columnValueInput.style.width = `${c.getWidth()}px`;
              // CpspRef.cmp.columnValueInput.style.height = `${c.getHeight()}px`;
              // CpspRef.cmp.columnValueInput.style.border = "3px solid #F77E04";
              // CpspRef.cmp.columnValueInput.value = text;
              const topY = c.getGlobalY();
              CpspRef.cmp.columnValueInput.style.top = `${topY}px`;
              this.marginLeft = ConfigSc.sidebarSize + c.getGlobalX();
              this.marginTop = topY;
              this.selColumn = null;
              CpspRef.cmp.indexOfVisibleColumn = undefined;
              // const x = ConfigSc.sidebarSize + ProjectMomentsTableHead.threeVerticalDotsColumnWidth;
              // CpspRef.cmp.columnValueInput.style.left = `${x}px`;
              // CpspRef.cmp.columnValueInput.style.pointerEvents = "auto"
              // CpspRef.cmp.deleteDetails = true;
              //CpspRef.cmp.columnValueInput.focus();
              //CpspRef.cmp.columnValueInput.select();

              // document.getElementById("columnValueEditInput1").style.display = "block";
              // document.getElementById("columnValueEditInput1").style.textAlign = "left";
              // //document.getElementById("columnValueEditInput1").focus();
              // document.getElementById("selectValue").style.display = "block"
              CpspRef.cmp.inputValue = text;

              CpspRef.cmp.selectedColumnForEditing = column;
              CpspRef.cmp.activityIndex = Number(activity.id);
              CpspRef.cmp.planIndex = Number(moment.id);
              this.showInput(this.marginLeft);
            } else if (
              column.key === "days"
            ) {
              if(this.firstMove != 0){
                this.setSelectedColums();
                return;
              }
              if(moment.percentage_of_realized_plan != null) return;
              CpspRef.cmp.hideColumnValueInput();
              // CpspRef.cmp.resourceWeekInput.style.display = "block";
              // CpspRef.cmp.resourceWeekInput.style.textAlign = "left";
              // CpspRef.cmp.resourceWeekInput.style.width = `${c.getWidth()}px`;
              // CpspRef.cmp.resourceWeekInput.style.height = `${c.getHeight()}px`;
              // CpspRef.cmp.resourceWeekInput.style.border = "3px solid #F77E04";
              let daysOfMoment = 0;
              moment.dateSegments.forEach(dateSegment => {
                daysOfMoment += CpspRef.cmp.getBusinessDatesCount(
                      dateSegment.startDate,
                      dateSegment.endDate
                    )
              })
              CpspRef.cmp.resourceWeekInput.value = daysOfMoment.toString();
              CpspRef.cmp.resourceWeekInput.style.top = `${c.getGlobalY()}px`;
              const x = ConfigSc.sidebarSize + c.getGlobalX();
              this.marginLeft = x;
              this.marginTop = c.getGlobalY();
              this.selColumn = null;
              CpspRef.cmp.indexOfVisibleColumn = undefined;
              // CpspRef.cmp.resourceWeekInput.style.left = `${x}px`;
              // CpspRef.cmp.resourceWeekInput.focus();
              // CpspRef.cmp.resourceWeekInput.select();

              CpspRef.cmp.selectedColumnForEditing = column;
              CpspRef.cmp.activityIndex = Number(activity.id);
              CpspRef.cmp.planIndex = Number(moment.id);
              this.showInput(x);
            } else if (
              column.key === "hours"
            ) {
              if(this.firstMove != 0){
                this.setSelectedColums();
                return;
              }
              if(moment.percentage_of_realized_plan != null) return;
              CpspRef.cmp.hideColumnValueInput();
              // CpspRef.cmp.resourceWeekInput.style.display = "block";
              // CpspRef.cmp.resourceWeekInput.style.textAlign = "left";
              // CpspRef.cmp.resourceWeekInput.style.width = `${c.getWidth()}px`;
              // CpspRef.cmp.resourceWeekInput.style.height = `${c.getHeight()}px`;
              // CpspRef.cmp.resourceWeekInput.style.border = "3px solid #F77E04";
              CpspRef.cmp.resourceWeekInput.value =
                moment.time != null ? moment.time.toString() : "0";
              CpspRef.cmp.resourceWeekInput.style.top = `${c.getGlobalY()}px`;
              const x = ConfigSc.sidebarSize + c.getGlobalX();
              this.marginLeft = x;
              this.marginTop = c.getGlobalY();
              this.selColumn = null;
              CpspRef.cmp.indexOfVisibleColumn = undefined;
              // CpspRef.cmp.resourceWeekInput.style.left = `${x}px`;
              // CpspRef.cmp.resourceWeekInput.focus();
              // CpspRef.cmp.resourceWeekInput.select();

              CpspRef.cmp.selectedColumnForEditing = column;
              CpspRef.cmp.activityIndex = Number(activity.id);
              CpspRef.cmp.planIndex = Number(moment.id);
              this.showInput(x);
            } else if (
              column.key === "resource"
            ) {
              if(this.firstMove != 0){
                this.setSelectedColums();
                return;
              }
              if(moment.percentage_of_realized_plan != null) return;
              CpspRef.cmp.hideColumnValueInput();
              // CpspRef.cmp.resourceWeekInput.style.display = "block";
              // CpspRef.cmp.resourceWeekInput.style.textAlign = "left";
              // CpspRef.cmp.resourceWeekInput.style.width = `${c.getWidth()}px`;
              // CpspRef.cmp.resourceWeekInput.style.height = `${c.getHeight()}px`;
              // CpspRef.cmp.resourceWeekInput.style.border = "3px solid #F77E04";
              CpspRef.cmp.resourceWeekInput.value =
                moment.number_of_workers != null ? moment.number_of_workers.toString() : "0";
              CpspRef.cmp.resourceWeekInput.style.top = `${c.getGlobalY()}px`;
              const x = ConfigSc.sidebarSize + c.getGlobalX();
              this.marginLeft = x;
              this.marginTop = c.getGlobalY();
              this.selColumn = null;
              CpspRef.cmp.indexOfVisibleColumn = undefined;
              // CpspRef.cmp.resourceWeekInput.style.left = `${x}px`;
              // CpspRef.cmp.resourceWeekInput.focus();
              // CpspRef.cmp.resourceWeekInput.select();

              CpspRef.cmp.selectedColumnForEditing = column;
              CpspRef.cmp.activityIndex = Number(activity.id);
              CpspRef.cmp.planIndex = Number(moment.id);
              this.showInput(x);
            } else if (
              column.key === "finished"
            ) {
              if(this.firstMove != 0){
                this.setSelectedColums();
                return;
              }
              if(moment.percentage_of_realized_plan != null) return;
              CpspRef.cmp.hideColumnValueInput();
              // CpspRef.cmp.resourceWeekInput.style.display = "block";
              // CpspRef.cmp.resourceWeekInput.style.textAlign = "left";
              // CpspRef.cmp.resourceWeekInput.style.width = `${c.getWidth()}px`;
              // CpspRef.cmp.resourceWeekInput.style.height = `${c.getHeight()}px`;
              // CpspRef.cmp.resourceWeekInput.style.border = "3px solid #F77E04";
              CpspRef.cmp.resourceWeekInput.value =
                moment.dateSegments[0].finishedTime != null
                  ? moment.dateSegments[0].finishedTime.toString()
                  : "0";
              CpspRef.cmp.resourceWeekInput.style.top = `${c.getGlobalY()}px`;
              const x = ConfigSc.sidebarSize + c.getGlobalX();
              this.marginLeft = x;
              this.marginTop = c.getGlobalY();
              this.selColumn = null;
              CpspRef.cmp.indexOfVisibleColumn = undefined;
              // CpspRef.cmp.resourceWeekInput.style.left = `${x}px`;
              // CpspRef.cmp.resourceWeekInput.focus();
              // CpspRef.cmp.resourceWeekInput.select();

              CpspRef.cmp.selectedColumnForEditing = column;
              CpspRef.cmp.activityIndex = Number(activity.id);
              CpspRef.cmp.planIndex = Number(moment.id);
              this.showInput(x);
            } else if (column.key === "plan" || column.key === "part") {
              if(this.firstMove != 0){
                this.setSelectedColums();
                return;
              }
              CpspRef.cmp.hideColumnValueInput();

              // CpspRef.cmp.planInput.style.display = "block";
              // CpspRef.cmp.planInput.style.textAlign = "left";
              // CpspRef.cmp.planInput.style.width = `${c.getWidth()}px`;
              // CpspRef.cmp.planInput.style.height = `${c.getHeight()}px`;
              // CpspRef.cmp.planInput.style.border = "3px solid #F77E04";
              CpspRef.cmp.planInput.value = text.toString();
              CpspRef.cmp.planInput.style.top = `${c.getGlobalY()}px`;
              const x = ConfigSc.sidebarSize + c.getGlobalX();
              this.marginLeft = x;
              this.marginTop = c.getGlobalY();
              this.selColumn = null;
              CpspRef.cmp.indexOfVisibleColumn = undefined;
              // CpspRef.cmp.planInput.style.left = `${x}px`;
              // CpspRef.cmp.planInput.focus();
              // CpspRef.cmp.planInput.select();

              CpspRef.cmp.selectedColumnForEditing = column;
              CpspRef.cmp.activityIndex = Number(activity.id);
              CpspRef.cmp.planIndex = Number(moment.id);
              this.showInput(x);
            }
            if (
              (column.key == "start_date" || column.key === "end_date")
            ) {
              if(this.firstMove != 0){
                this.setSelectedColums();
                return;
              }
              if(moment.percentage_of_realized_plan != null) return;
              CpspRef.cmp.hideColumnValueInput();
              this.selectedMomentsContainer = null;
              this.setColumnDoubleClickHandler(
                c,
                column,
                activity.id,
                moment.id,
                text
              );
            } else {
              if(this.firstMove != 0){
                this.setSelectedColums();
                return;
              }
              CpspRef.cmp.hideColumnValueInput();

              let columnText = "";
              if (
                column.values[CpspRef.cmp.project.id] &&
                column.values[CpspRef.cmp.project.id].activities[activity.id]
              ) {
                columnText =
                  column.values[CpspRef.cmp.project.id].activities[activity.id].value;
              }

              CpspRef.cmp.newColumnValueInput.value = columnText.toString();
              CpspRef.cmp.newColumnValueInput.style.top = `${c.getGlobalY()}px`;
              const x = ConfigSc.sidebarSize + c.getGlobalX();
              this.marginLeft = x;
              this.marginTop = c.getGlobalY();
              this.selColumn = null;
              CpspRef.cmp.indexOfVisibleColumn = undefined;
              // CpspRef.cmp.planInput.style.left = `${x}px`;
              // CpspRef.cmp.planInput.focus();
              // CpspRef.cmp.planInput.select();

              CpspRef.cmp.selectedColumnForEditing = column;
              CpspRef.cmp.activityIndex = Number(activity.id);
              CpspRef.cmp.planIndex = Number(moment.id);
              this.showInput(x);
            }
            this.highlightedRow = rowNumber;
            CpspRef.cmp.tapeMomActId = null;
            this.refreshDisplay();
          });
        });
      });

      if (
        this.highlightedRow === rowNumber //||
        // moment.id === CpspRef.cmp.tapeMomActId
      ) {
        CpspRef.cmp.selectedMomentsForStyleChange = [];
        // CpspRef.cmp.selectedMomentsForStyleChange.push({
        //   projectId: CpspRef.cmp.selectedProject.id,
        //   activityId: activity.id,
        //   stateType: moment.state,
        //   moment: moment,
        //   planId: moment.id,
        //   y: activityGlobalY + i * ConfigSc.cellHeight + ConfigSc.cellHeight,
        //   state_number: moment.state_number,
        //   parent: moment.parent,
        // });
        CpspRef.cmp.selectedMomentsForStyleChange.push(moment);
        CpspRef.cmp.activityIndex = moment.activity_id;
        CpspRef.cmp.planIndex = moment.id;
        this.setValues();
        this.renderHighlightedLines(
          activityDateSegmentContainer,
          i * ConfigSc.cellHeight + ConfigSc.cellHeight
        );
        this.renderHighlightedLines(
          momentsContainer.getParent(),
          i * ConfigSc.cellHeight + ConfigSc.cellHeight,
          i == activity.moments.length - 1
        );
      }
      if (moment.start_date != null)
        this.renderMomentDateSegments(
          moment,
          activityDateSegmentContainer,
          activityIndex,
          moment.id,
          i
        );
      i++;
    });
  }

  findAllChildrenOFMoment(activity, moment) {
    const indexMom = activity.moments.findIndex((m) => m.id == moment.id);
    let numOfChild = 0;
    for (let i = indexMom + 1; i < activity.moments.length; i++) {
      const m = activity.moments[i];
      if (m.state_number <= moment.state_number) break;
      numOfChild++;
    }
    return numOfChild;
  }

  moveMoment(e, activity: Activity, moment: Moment) {
    // let checkMovement = { firstMove: true, savePosition: 0 };
    // const lineminY = ConfigSc.topSectionSize + ConfigSc.toolboxSize;

    this.movingLineIndicator = new MovingLineIndicator(
      0 + ConfigSc.cellHeight,
      0,
      "100%",
      ConfigSc.cellHeight * 2,
      this.canvas,
      this.selectedMomentsContainer
    );

    this.canvas.addChild(this.movingLineIndicator);
                // this.canvas.getChildren().forEach((child) => {
                //     this.canvas.addDrawingContainer(child);
                // });
                this.canvas.addDrawingContainer(this)
                this.canvas.getCanvasElement().onmousemove = (ev) => {
                    if (ev.movementY != 0) {
                        this.throttle(() => {
                            this.movingLineIndicator.move(ev.movementY);
                        }, 100)();
                    }
                };

    // document.onmousemove = (event) => {
    //   if (checkMovement.firstMove === true) {

    //     if(this.selectedMomentsContainer.getSelectedMoments().length > 1){
    //       CpspRef.cmp.toastrMessage(
    //         "info",
    //         CpspRef.cmp
    //           .getTranslate()
    //           .instant("You can move only one moment or whole group/activity!")
    //       );
    //       this.selectedMomentsContainer = null;
    //       document.onmousemove = (e) => {};
    //       return;
    //     }

    //     this.freezeSidebar();

    //     ConfigSc.firstMomentBoxSelectedPositionDelta =
    //       activity.y + ConfigSc.cellHeight + moment.y;

    //     //this.firstMomentBoxSelectedPosition = e.offsetY;
    //     this.firstMomentBoxSelectedPosition = e.layerY;
    //     ConfigSc.deltaMovementBetweenBoxes = 0;
    //     // this.selectedMomentsContainer = new SelectedMomentsContainer(
    //     //   0,
    //     //   this.firstMomentBoxSelectedPosition +
    //     //     ConfigSc.deltaMovementBetweenBoxes,
    //     //   ConfigSc.sideCanvasSize - ConfigSc.sideSectionRightBorderWidth,
    //     //   this.findAllChildrenOFMoment(activity, moment) * ConfigSc.cellHeight,
    //     //   this.canvas,
    //     //   this.momentTableBodyContainer.getInnerContainer()
    //     // );

    //     this.movingLineIndicator = new MovingLineIndicator(
    //       0 + ConfigSc.cellHeight,
    //       0,
    //       "100%",
    //       ConfigSc.cellHeight * 2,
    //       this.canvas,
    //       this.selectedMomentsContainer
    //     );

    //     this.canvas.addChild(this.movingLineIndicator);

    //     this.canvas.getChildren().forEach((child) => {
    //       if (
    //         child instanceof SideSectionMomentsContainer ||
    //         child instanceof MovingLineIndicator ||
    //         child instanceof MomentContainer
    //       ) {
    //       }
    //       this.canvas.addDrawingContainer(child);
    //     });

    //     //set first move on false
    //     checkMovement.firstMove = false;
    //     checkMovement.savePosition =
    //       -this.movingLineIndicator.getGlobalY() +
    //       lineminY -
    //       ConfigSc.cellHeight;
    //   }

    //   //set movinglineindicator when mouse hovers header
    //   if (
    //     event.movementY != 0 &&
    //     checkMovement.firstMove === false &&
    //     event.y < lineminY + 1
    //   ) {
    //     this.movingLineIndicator.setY(checkMovement.savePosition);
    //     this.movingLineIndicator.sumY = checkMovement.savePosition;
    //   }

    //   //check for movement
    //   if (
    //     event.movementY != 0 &&
    //     checkMovement.firstMove === false &&
    //     event.y > lineminY + 1
    //   ) {
    //     this.throttle(() => {
    //       this.movingLineIndicator.move(event.movementY);
    //     }, 100)();
    //   }
    // };

    // document.onmouseup = (e2) => {
    //   if (checkMovement.firstMove === false) {
    //     document.body.style.cursor = "default";
    //     if (e.screenY === e2.screenY) {
    //       // clearTimeout(cursorChangeTimeout);
    //       // this.highlightedRow = rowNumber;
    //       CpspRef.cmp.tapeMomActId = null;
    //       this.canvas.removeChildById(this.movingLineIndicator.getId());
    //       this.refreshDisplay();
    //       this.canvas.resetDrawingContainers();
    //       CpspRef.cmp.projectSchedulePlanerApp.mainHeader.draw();
    //       return;
    //     }
    //     // this.canvas.removeChildById(momentContainer.getId());
    //     this.highlightedRow = null;
    //     CpspRef.cmp.tapeMomActId = 0;

    //     // if (!this.getMomentTableBodyContainer().isShapeClicked(e2.layerX, e2.layerY)) {
    //     //   // momentContainer.setY(CpspRef.cmp.selectedProject.activities[activity.id].moments[moment.id].y);
    //     //   this.canvas.resetDrawingContainers();
    //     //   this.refreshDisplay();
    //     //   return;
    //     // }

    //     //move selectedmoment container after moment move
    //     if (this.movingLineIndicator.getY() < 0) {
    //       this.selectedMomentsContainer.setY(
    //         this.movingLineIndicator.getY() + moment.y + activity.y + 50
    //       );
    //     } else {
    //       const findMomentHeight = activity.moments.filter(
    //         (mom) => mom.parent == moment.id
    //       ).length;
    //       this.selectedMomentsContainer.setY(
    //         this.movingLineIndicator.getY() +
    //           moment.y +
    //           activity.y +
    //           (1 - findMomentHeight) * ConfigSc.cellHeight
    //       );
    //     }

    //     CpspRef.cmp.selectedMomentsForStyleChange = this.selectedMomentsContainer.getSelectedMoments();

    //     CpspRef.cmp.selectedMomentsForStyleChange.forEach(mom => {
    //       this.onDropMoment(
    //         activity,
    //         mom,
    //         this.movingLineIndicator.getY() + moment.y
    //       );
    //     });

    //     historySchedulePlaner.addToQueue(
    //       () => true,
    //       () => true
    //     );

    //     // this.selectedMomentsContainer.setY(test+this.movingLineIndicator.getY());
    //     this.canvas.resetDrawingContainers();
    //     this.highlightedRow = null;
    //     this.canvas.removeChildById(this.selectedMomentsContainer.getId());
    //     this.canvas.removeChildById(this.movingLineIndicator.getId());
    //     CpspRef.cmp.projectSchedulePlanerApp.mainHeader.draw();
    //     CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.draw()
    //     this.refreshDisplay();

    //     //set sidebar styles to default
    //     this.unfreezeSidebar();
    //   }
    //   //remove on mouseup eventListener
    //   document.onmouseup = (e) => {};
    //   document.onmousemove = (e) => {};
    // };
  }

  // moveMoment(e, activity: Activity, moment: Moment) {
  //   let checkMovement = { firstMove: true, savePosition: 0 };
  //   const lineminY = ConfigSc.topSectionSize + ConfigSc.toolboxSize;
  //   document.onmousemove = (event) => {
  //     if (checkMovement.firstMove === true) {

  //       if(this.selectedMomentsContainer.getSelectedMoments().length > 1){
  //         CpspRef.cmp.toastrMessage(
  //           "info",
  //           CpspRef.cmp
  //             .getTranslate()
  //             .instant("You can move only one moment or whole group/activity!")
  //         );
  //         this.selectedMomentsContainer = null;
  //         document.onmousemove = (e) => {};
  //         return;
  //       }

  //       this.freezeSidebar();

  //       ConfigSc.firstMomentBoxSelectedPositionDelta =
  //         activity.y + ConfigSc.cellHeight + moment.y;

  //       //this.firstMomentBoxSelectedPosition = e.offsetY;
  //       this.firstMomentBoxSelectedPosition = e.layerY;
  //       ConfigSc.deltaMovementBetweenBoxes = 0;
  //       // this.selectedMomentsContainer = new SelectedMomentsContainer(
  //       //   0,
  //       //   this.firstMomentBoxSelectedPosition +
  //       //     ConfigSc.deltaMovementBetweenBoxes,
  //       //   ConfigSc.sideCanvasSize - ConfigSc.sideSectionRightBorderWidth,
  //       //   this.findAllChildrenOFMoment(activity, moment) * ConfigSc.cellHeight,
  //       //   this.canvas,
  //       //   this.momentTableBodyContainer.getInnerContainer()
  //       // );

  //       this.movingLineIndicator = new MovingLineIndicator(
  //         0 + ConfigSc.cellHeight,
  //         0,
  //         "100%",
  //         ConfigSc.cellHeight * 2,
  //         this.canvas,
  //         this.selectedMomentsContainer
  //       );

  //       this.canvas.addChild(this.movingLineIndicator);

  //       this.canvas.getChildren().forEach((child) => {
  //         if (
  //           child instanceof SideSectionMomentsContainer ||
  //           child instanceof MovingLineIndicator ||
  //           child instanceof MomentContainer
  //         ) {
  //         }
  //         this.canvas.addDrawingContainer(child);
  //       });

  //       //set first move on false
  //       checkMovement.firstMove = false;
  //       checkMovement.savePosition =
  //         -this.movingLineIndicator.getGlobalY() +
  //         lineminY -
  //         ConfigSc.cellHeight;
  //     }

  //     //set movinglineindicator when mouse hovers header
  //     if (
  //       event.movementY != 0 &&
  //       checkMovement.firstMove === false &&
  //       event.y < lineminY + 1
  //     ) {
  //       this.movingLineIndicator.setY(checkMovement.savePosition);
  //       this.movingLineIndicator.sumY = checkMovement.savePosition;
  //     }

  //     //check for movement
  //     if (
  //       event.movementY != 0 &&
  //       checkMovement.firstMove === false &&
  //       event.y > lineminY + 1
  //     ) {
  //       this.throttle(() => {
  //         this.movingLineIndicator.move(event.movementY);
  //       }, 100)();
  //     }
  //   };

  //   document.onmouseup = (e2) => {
  //     if (checkMovement.firstMove === false) {
  //       document.body.style.cursor = "default";
  //       if (e.screenY === e2.screenY) {
  //         // clearTimeout(cursorChangeTimeout);
  //         // this.highlightedRow = rowNumber;
  //         CpspRef.cmp.tapeMomActId = null;
  //         this.canvas.removeChildById(this.movingLineIndicator.getId());
  //         this.refreshDisplay();
  //         this.canvas.resetDrawingContainers();
  //         CpspRef.cmp.projectSchedulePlanerApp.mainHeader.draw();
  //         return;
  //       }
  //       // this.canvas.removeChildById(momentContainer.getId());
  //       this.highlightedRow = null;
  //       CpspRef.cmp.tapeMomActId = 0;

  //       // if (!this.getMomentTableBodyContainer().isShapeClicked(e2.layerX, e2.layerY)) {
  //       //   // momentContainer.setY(CpspRef.cmp.selectedProject.activities[activity.id].moments[moment.id].y);
  //       //   this.canvas.resetDrawingContainers();
  //       //   this.refreshDisplay();
  //       //   return;
  //       // }

  //       //move selectedmoment container after moment move
  //       if (this.movingLineIndicator.getY() < 0) {
  //         this.selectedMomentsContainer.setY(
  //           this.movingLineIndicator.getY() + moment.y + activity.y + 50
  //         );
  //       } else {
  //         const findMomentHeight = activity.moments.filter(
  //           (mom) => mom.parent == moment.id
  //         ).length;
  //         this.selectedMomentsContainer.setY(
  //           this.movingLineIndicator.getY() +
  //             moment.y +
  //             activity.y +
  //             (1 - findMomentHeight) * ConfigSc.cellHeight
  //         );
  //       }

  //       CpspRef.cmp.selectedMomentsForStyleChange = this.selectedMomentsContainer.getSelectedMoments();

  //       CpspRef.cmp.selectedMomentsForStyleChange.forEach(mom => {
  //         this.onDropMoment(
  //           activity,
  //           mom,
  //           this.movingLineIndicator.getY() + moment.y
  //         );
  //       });

  //       historySchedulePlaner.addToQueue(
  //         () => true,
  //         () => true
  //       );

  //       // this.selectedMomentsContainer.setY(test+this.movingLineIndicator.getY());
  //       this.canvas.resetDrawingContainers();
  //       this.highlightedRow = null;
  //       this.canvas.removeChildById(this.selectedMomentsContainer.getId());
  //       this.canvas.removeChildById(this.movingLineIndicator.getId());
  //       CpspRef.cmp.projectSchedulePlanerApp.mainHeader.draw();
  //       CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.draw()
  //       this.refreshDisplay();

  //       //set sidebar styles to default
  //       this.unfreezeSidebar();
  //     }
  //     //remove on mouseup eventListener
  //     document.onmouseup = (e) => {};
  //     document.onmousemove = (e) => {};
  //   };
  // }

  private onDropMoment(

    lineY: number
  ) {
    const indexOfActivityBellow = CpspRef.cmp.selectedProject.activities.findIndex((a) => a.y > lineY);
    let activityToDrop = CpspRef.cmp.selectedProject.activities.at(indexOfActivityBellow - 1);
    let momentIndex;
    let momentToDrop;
    let mIndex;

    // if(activitySelected.id != activityToDrop.id){

    // }
    momentIndex = activityToDrop.moments.findIndex((m) =>activityToDrop.y + m.y + 25 == lineY)
    let onFirstChild = false;
    if(momentIndex != -1){
      onFirstChild = momentIndex < activityToDrop.moments.length - 2 &&
                    activityToDrop.moments.at(momentIndex).state_number <
                    activityToDrop.moments.at(momentIndex + 1).state_number ?
                      true :
                      false;
      momentToDrop = activityToDrop.moments.at(momentIndex)
      activityToDrop = CpspRef.cmp.copySelectedProject.activities.at(indexOfActivityBellow - 1);
    }
    activityToDrop = CpspRef.cmp.copySelectedProject.activities.at(indexOfActivityBellow - 1);
    let activityToDropDisplay = CpspRef.cmp.selectedProject.activities.at(indexOfActivityBellow - 1);
    let moments = this.selectedMomentsContainer.getSelectedMoments()
    let displayedActivitySelected = CpspRef.cmp.selectedProject.activities.find((a) => a.id == moments.at(0).activity_id)
    let activitySelected = CpspRef.cmp.copySelectedProject.activities.find((a) => a.id == moments.at(0).activity_id)
    let moms: Moment[] = [];
    let momNumbers = 0;

    let withSameStateNumber = 0;
    moments.forEach((m) => {
      if(m.state_number == moments.at(0).state_number)
        withSameStateNumber++;
    })
    withSameStateNumber *= -0.01
    for(let i = 0; i < moments.length; i++){
      let moment = moments.at(i);
      if(moments.some((m) => m.id == moment.parent)) continue;
      mIndex = activitySelected.moments.findIndex((m) => m.id == moment.id);
      const oldStateNumber = moment.state_number;

      if(momentToDrop){
        moment.activity_id = activityToDrop.id
        moment.state_number = onFirstChild ?
                                activityToDropDisplay.moments.at(momentIndex + 1).state_number :
                                momentToDrop.state_number
        moment.group_id = onFirstChild ?
                            activityToDropDisplay.moments.at(momentIndex + 1).group_id :
                            momentToDrop.group_id;
        moment.parent = onFirstChild ?
                            activityToDropDisplay.moments.at(momentIndex + 1).parent :
                            momentToDrop.parent;
        moment.schedule_plan_activity_id = onFirstChild ?
                            activityToDropDisplay.moments.at(momentIndex + 1).schedule_plan_activity_id :
                            momentToDrop.schedule_plan_activity_id;
        moment.sort_index = onFirstChild ?
                              Number(momentToDrop.sort_index) + withSameStateNumber :
                              Number(momentToDrop.sort_index) + (0.01 * (i + 1))
        withSameStateNumber += 0.01;
      }
      //Drop on first position in activity
      else {
        if(activityToDrop.moments.length > 0){
          moment.activity_id = activityToDrop.id
          moment.state_number = activityToDrop.moments.at(0).state_number;
          moment.group_id = activityToDrop.moments.at(0).group_id;
          moment.parent = activityToDrop.moments.at(0).parent;
          moment.schedule_plan_activity_id = activityToDrop.moments.at(0).schedule_plan_activity_id;
          moment.sort_index = Number(activityToDrop.moments.at(0).sort_index) + withSameStateNumber;
          withSameStateNumber += 0.01;
          // momentIndexCopy = 0;
        } else {
          CpspRef.cmp.toastrMessage(
            "info",
            CpspRef.cmp
            .getTranslate()
            .instant("You can only drop inside Activity or Group!")
          );
          // this.canvas.removeChildById(this.selectedMomentsContainer.getId())
          // this.selectedMomentsContainer = null;
          // this.refreshDisplay();
          return;
        }
      }

      moms.push(moment)
      if(displayedActivitySelected.moments.some((m) => m.id == moment.id))
        momNumbers++;
      activitySelected.moments.splice(mIndex,1)
      const diffStateNumber = Number(moment.state_number) - Number(oldStateNumber);
      while(mIndex < activitySelected.moments.length &&
        activitySelected.moments.at(mIndex).state_number > oldStateNumber
        ){
          activitySelected.moments.at(mIndex).state_number = Number(activitySelected.moments.at(mIndex).state_number) + diffStateNumber
          moms.push(activitySelected.moments.at(mIndex))
          if(displayedActivitySelected.moments.some((m) => m.id == activitySelected.moments.at(mIndex).id))
            momNumbers++;
          activitySelected.moments.splice(mIndex,1)
        }
    }


    if(this.selectedMomentsContainer.getY() > lineY){
      this.selectedMomentsContainer.setY(lineY + ConfigSc.cellHeight)
    } else {
      this.selectedMomentsContainer.setY(lineY - ((momNumbers - 1) * ConfigSc.cellHeight))
    }

      activityToDrop.changed = true;
      moms.forEach((m) => {
        m.changed = true;
      })
      let toDropIndex = -1;
      if(momentToDrop)
        toDropIndex = activityToDrop.moments.findIndex((m) => m.id == momentToDrop.id)
      let left = activityToDrop.moments.slice(0,toDropIndex + 1)
      let right = activityToDrop.moments.slice(toDropIndex + 1)
      activityToDrop.moments = left.concat(moms).concat(right)


    let y = 0;
    if(activitySelected.id != activityToDrop.id){

      activitySelected.moments.forEach((m) => {
        m.y = y;
        y += ConfigSc.cellHeight;
      })
    }

    y = 0;
    activityToDrop.moments.forEach((m,index) => {
      m.y = y;
      y += ConfigSc.cellHeight;
      const indexOfBrother = CpspRef.cmp.findBrother(activityToDrop,index)
      indexOfBrother !== -1 ?
        m.sort_index = Number(activityToDrop.moments.at(indexOfBrother).sort_index) + 1
        :
        1;
        m.changed = true;
    })

    y = 0;
    CpspRef.cmp.copySelectedProject.activities.forEach((a) => {
      a.y = y;
      y += a.moments.length * ConfigSc.cellHeight + ConfigSc.cellHeight;
    });

    CpspRef.cmp.selectedProject = CpspRef.cmp.deepCopy(CpspRef.cmp.copySelectedProject)
    historySchedulePlaner.addToQueue(
      () => true,
      () => true
      );

    this.refreshDisplay();
    this.selectedMomentsContainer.draw();
  }
  //prebacivanje momenta na novu lokaciju
  // private onDropMoment(
  //   activitySelected: Activity,
  //   moment: Moment,
  //   lineY: number
  // ) {



  //   // const changes = [];
  //   // const previousValues = [];
  //   // const changesActivity = [];a
  //   // const previousValuesActivity = [];
  //   let momentIndexChanged = 0;
  //   let indexOfMoved = -1;
  //   let numberOfChildren = 0;
  //   let parentHasChildren = 0;
  //   let previousParent = null;
  //   let previousParentIndex = null;
  //   let newParentSet = false;
  //   let newParent = null;
  //   let oldMoment = null;
  //   let getChildren = false; //true if selected moment is found, and stays true while looping through his children
  //   let activityOffSelectedMoment = false;
  //   let countYToSelectedActivity = 0;
  //   let oldStateNumber = moment.state_number;
  //   moment.changed = true;

  //   activitySelected = CpspRef.cmp.deepCopy(
  //     CpspRef.cmp.copySelectedProject.activities.find(
  //       (a) => a.id == activitySelected.id
  //     )
  //   );

  //   //get number of children of selected plan and number of children of his parent
  //   for (let i = 0; i < activitySelected.moments.length; i++) {
  //     if (
  //       indexOfMoved != -1 &&
  //       getChildren &&
  //       activitySelected.moments[i].state_number >
  //         activitySelected.moments[indexOfMoved].state_number
  //     )
  //       numberOfChildren++;
  //     if (moment.parent == activitySelected.moments[i].parent) {
  //       parentHasChildren++;
  //       getChildren = false;
  //     }
  //     //stop counting
  //     if(indexOfMoved != -1 &&
  //       getChildren &&
  //       activitySelected.moments[i].state_number <
  //         activitySelected.moments[indexOfMoved].state_number)
  //     getChildren = false;
  //     if (moment.id == activitySelected.moments[i].id) {
  //       indexOfMoved = i;
  //       getChildren = true;
  //     }
  //     if (moment.parent == activitySelected.moments[i].id) {
  //       previousParent = activitySelected.moments[i];
  //       previousParentIndex = i;
  //     }
  //   }

  //   //for state
  //   if (moment.state_number == 1) {
  //     for (
  //       let i = 0;
  //       i < CpspRef.cmp.copySelectedProject.activities.length;
  //       i++
  //     ) {
  //       if (CpspRef.cmp.selectedProject.activities[i].id == moment.parent) {
  //         previousParent = CpspRef.cmp.selectedProject.activities[i];
  //         previousParentIndex = i;
  //       }
  //     }
  //   }

  //   if (
  //     lineY >= moment.y &&
  //     this.show_states.find((mom) => mom.id == moment.id).show == "arrow-close"
  //   ) {
  //     lineY += numberOfChildren * ConfigSc.cellHeight;
  //   }

  //   let newActivityPlace = 0;
  //   CpspRef.cmp.copySelectedProject.activities.forEach((activity, index) => {
  //     if (lineY >= -25) {
  //       if (activity.id == activitySelected.id) {
  //         activity.changed = true;
  //         //need to move plan inside of his activity
  //         if (lineY < activity.moments.length * ConfigSc.cellHeight) {
  //           for (let i = 0; i < activity.moments.length; i++) {
  //             //placing plan as first child of activity
  //             if (lineY == -25) {
  //               if (momentIndexChanged == 0) {
  //                 //add 1 on all brother sort_index-es
  //                 if (i < indexOfMoved) {
  //                   if (activity.moments[i].parent == previousParent.id) {
  //                     // previousValues.push(activity.moments[i]);
  //                     activity.moments[i].sort_index =
  //                       Number(activity.moments[i].sort_index) + 1;
  //                     // changes.push(activity.moments[i]);
  //                     activity.moments[i].changed = true;
  //                   }
  //                   activity.moments[i].y =
  //                     activity.moments[i].y +
  //                     ConfigSc.cellHeight * (numberOfChildren + 1);
  //                 }

  //                 if (i == indexOfMoved) {
  //                   parentHasChildren--;
  //                   newParent = activity;
  //                   oldMoment = activity.moments[i];

  //                   // activity.moments[indexOfMoved].group_id = CpspRef.cmp.getGroupIdForMoment(activity, newParent, oldMoment);
  //                   activity.moments[i].sort_index = 1;
  //                   // activity.moments[i].group_id = 0;
  //                   activity.moments[i].group_id = activity.moments[0].group_id;
  //                   activity.moments[i].schedule_plan_activity_id =
  //                     moment.schedule_plan_activity_id;
  //                   activity.moments[i].parent = activity.id;
  //                   activity.moments[i].parent_type = "ACTIVITY";
  //                   activity.moments[i].state = "STATE";
  //                   activity.moments[i].state_number = 1;
  //                   activity.moments[i].y = 0;
  //                   activity.moments[i].changed = true;
  //                   CpspRef.cmp.updateParent(activity,activity.moments[i]);
  //                   //ako prethodni roditelj nema vise djece
  //                   if (
  //                     parentHasChildren == 0 &&
  //                     previousParent != null &&
  //                     previousParent.percentage_of_realized_activity ==
  //                       undefined
  //                   ) {
  //                     activity.moments[
  //                       previousParentIndex
  //                     ].percentage_of_realized_plan = null;
  //                     activity.moments[previousParentIndex].state =
  //                       CpspRef.cmp.getPlanById(
  //                         activity.moments[previousParentIndex].parent
  //                       ).name;
  //                     CpspRef.cmp.changeSchedulePlanDetails(
  //                       previousParent,
  //                       activity.moments[previousParentIndex]
  //                     );
  //                   }

  //                   const deltaState =
  //                     activity.moments[i].state_number - oldStateNumber;

  //                   for (let j = 1; j <= numberOfChildren; j++) {
  //                     if (deltaState != 0) {
  //                       // previousValues.push(activity.moments[i + j]);
  //                       activity.moments[i + j].state_number =
  //                         Number(activity.moments[i + j].state_number) +
  //                         deltaState;
  //                       // changes.push(activity.moments[i + j]);
  //                       activity.moments[i + j].changed = true;
  //                     }
  //                     activity.moments[i + j].y =
  //                       activity.moments[i].y + ConfigSc.cellHeight * j;
  //                   }
  //                   momentIndexChanged = 1;
  //                   break;
  //                 }
  //               }
  //             } else {
  //               //after moving selected plan up, need to move all plans between old and new place for selected plan for some places down
  //               if (momentIndexChanged == 1 && indexOfMoved > i) {
  //                 if (
  //                   activity.moments[indexOfMoved].parent ==
  //                   activity.moments[i].parent
  //                 ) {
  //                   // previousValues.push(activity.moments[i]);
  //                   activity.moments[i].sort_index =
  //                     Number(activity.moments[i].sort_index) + 1;
  //                   // changes.push(activity.moments[i]);
  //                   activity.moments[i].changed = true;
  //                 }
  //                 activity.moments[i].y =
  //                   activity.moments[i].y +
  //                   ConfigSc.cellHeight * (numberOfChildren + 1);
  //               }

  //               //place for setting plan
  //               if (activity.moments[i].y == lineY && momentIndexChanged == 0) {
  //                 if (moment.y > activity.moments[i].y) {
  //                   momentIndexChanged = 1; // plan moved up
  //                   activity.moments[indexOfMoved].y =
  //                     lineY + ConfigSc.cellHeight;
  //                 } else {
  //                   momentIndexChanged = -1; //plan moved down
  //                   activity.moments[i].y =
  //                     activity.moments[i].y -
  //                     ConfigSc.cellHeight * (numberOfChildren + 1); //need to move plan above
  //                   if (activity.moments[i].parent == previousParent.id) {
  //                     // previousValues.push(activity.moments[i]);
  //                     activity.moments[i].sort_index =
  //                       Number(activity.moments[i].sort_index) - 1;
  //                     // changes.push(activity.moments[i]);
  //                     activity.moments[i].changed = true;
  //                   }
  //                   activity.moments[indexOfMoved].y = lineY;
  //                 }

  //                 //if plan - new position already has children, selected plan becomes child of new parent
  //                 if (
  //                   activity.moments[i + 1] != undefined &&
  //                   activity.moments[i + 1].parent == activity.moments[i].id
  //                 ) {
  //                   parentHasChildren--;
  //                   newParentSet = true;
  //                   newParent = activity.moments[i];
  //                   oldMoment = activity.moments[indexOfMoved];

  //                   activity.moments[indexOfMoved].group_id =
  //                     CpspRef.cmp.getGroupIdForMoment(
  //                       activity,
  //                       newParent,
  //                       oldMoment
  //                     );
  //                   activity.moments[indexOfMoved].parent =
  //                     activity.moments[i].id;
  //                   activity.moments[indexOfMoved].parent_type =
  //                     activity.moments[i].state != "STATE" &&
  //                     activity.moments[i].state != "ACTIVITY"
  //                       ? "PLAN"
  //                       : activity.moments[i].state;
  //                   activity.moments[indexOfMoved].sort_index = 1;
  //                   activity.moments[indexOfMoved].state_number =
  //                     Number(activity.moments[i].state_number) + 1;
  //                   activity.moments[indexOfMoved].schedule_plan_activity_id =
  //                     activity.moments[i].id;
  //                   activity.moments[indexOfMoved].state =
  //                     activitySelected.moments[indexOfMoved]
  //                       .percentage_of_realized_plan == null
  //                       ? activity.moments[i].name
  //                       : "STATE";

  //                   CpspRef.cmp.updateParent(activity,activity.moments[indexOfMoved]);

  //                   if (
  //                     parentHasChildren == 0 &&
  //                     previousParent != null &&
  //                     previousParent.percentage_of_realized_activity ==
  //                       undefined
  //                   ) {
  //                     activity.moments[
  //                       previousParentIndex
  //                     ].percentage_of_realized_plan = null;
  //                     activity.moments[previousParentIndex].state =
  //                       CpspRef.cmp.getPlanById(
  //                         activity.moments[previousParentIndex].parent
  //                       ).name;
  //                     CpspRef.cmp.changeSchedulePlanDetails(
  //                       previousParent,
  //                       activity.moments[previousParentIndex]
  //                     );
  //                   }
  //                 }

  //                 //plan position does not have children, selected plan becomes his brother
  //                 else {
  //                   //set new sort index
  //                   // previousValues.push(activity.moments[indexOfMoved]);

  //                   activity.moments[indexOfMoved].group_id =
  //                     activity.moments[i].group_id;
  //                   activity.moments[indexOfMoved].parent =
  //                     activity.moments[i].parent;
  //                   activity.moments[indexOfMoved].parent_type =
  //                     activity.moments[i].parent_type;
  //                   activity.moments[indexOfMoved].state_number =
  //                     activity.moments[i].state_number;
  //                   if(i < activity.moments.length - 1 &&
  //                     activity.moments.at(i).state_number == activity.moments.at(i+1).state_number
  //                     ){
  //                       activity.moments[indexOfMoved].sort_index =
  //                       (Number(activity.moments[i].sort_index) + Number(activity.moments[i + 1].sort_index)) /2;
  //                     }
  //                     else
  //                   activity.moments[indexOfMoved].sort_index =
  //                     Number(activity.moments[i].sort_index) + 1;
  //                   activity.moments[indexOfMoved].schedule_plan_activity_id =
  //                     activity.moments[i].id;
  //                   activity.moments[indexOfMoved].state =
  //                     activitySelected.moments[indexOfMoved]
  //                       .percentage_of_realized_plan == null
  //                       ? activity.moments[i].state
  //                       : "STATE";

  //                   // changes.push(activity.moments[indexOfMoved]);
  //                   activity.moments[indexOfMoved].changed = true;
  //                   CpspRef.cmp.updateParent(activity,activity.moments[indexOfMoved]);
  //                   // CpspRef.cmp.updateParent(activity,activity.moments[i]);
  //                 }

  //                 // //plans are same level
  //                 // if (activity.moments[i].parent == previousParent.id) {

  //                 //   //set new sort index
  //                 //   previousValues.push(activity.moments[indexOfMoved]);
  //                 //   activity.moments[indexOfMoved].sort_index = Number(activity.moments[i].sort_index) + 1;
  //                 //   changes.push(activity.moments[indexOfMoved]);

  //                 //   //plans are same level, need to set plan under his brother and his children
  //                 //   //OVDJE UBACITI DIO ZA POMIJERANJE MOMENTA ISPOD DJECE OD BRATA

  //                 // }
  //                 // //plan are not same level, need to connect plan to other parent
  //                 // else {
  //                 //   parentHasChildren--;
  //                 //   newParentSet = true;
  //                 //   newParent = activity.moments[i];
  //                 //   oldMoment = activity.moments[indexOfMoved];

  //                 //   activity.moments[indexOfMoved].group_id = CpspRef.cmp.getGroupIdForMoment(activity, newParent, oldMoment);
  //                 //   activity.moments[indexOfMoved].parent = activity.moments[i].id;
  //                 //   activity.moments[indexOfMoved].parent_type = (activity.moments[i].state != 'STATE' && activity.moments[i].state != 'ACTIVITY') ? 'PLAN' : activity.moments[i].state;
  //                 //   activity.moments[indexOfMoved].sort_index = 1;
  //                 //   activity.moments[indexOfMoved].state_number = Number(activity.moments[i].state_number) + 1;
  //                 //   activity.moments[indexOfMoved].schedule_plan_activity_id = activity.moments[i].id;
  //                 //   activity.moments[indexOfMoved].state = activity.moments[i].name;

  //                 //   // plan now has a child
  //                 //   if (activity.moments[i].percentage_of_realized_plan == null) {
  //                 //     const oldValue = activity.moments[i];
  //                 //     activity.moments[i].percentage_of_realized_plan = 0;
  //                 //     CpspRef.cmp.changeSchedulePlanDetails(oldValue, activity.moments[i]);
  //                 //   }

  //                 //   if (parentHasChildren == 0 && previousParent != null && previousParent.percentage_of_realized_activity == undefined) {
  //                 //     activity.moments[previousParentIndex].percentage_of_realized_plan = null;
  //                 //     CpspRef.cmp.changeSchedulePlanDetails(previousParent, activity.moments[previousParentIndex]);
  //                 //   }

  //                 // }

  //                 const deltaState =
  //                   Number(activity.moments[indexOfMoved].state_number) -
  //                   Number(oldStateNumber);

  //                 //set y and childrens y
  //                 for (let j = 1; j <= numberOfChildren; j++) {
  //                   if (deltaState != 0) {
  //                     // previousValues.push(activity.moments[i + j]);
  //                     activity.moments[indexOfMoved + j].state_number =
  //                       Number(
  //                         activity.moments[indexOfMoved + j].state_number
  //                       ) + deltaState;
  //                     // changes.push(activity.moments[indexOfMoved + j]);
  //                     activity.moments[indexOfMoved + j].changed = true;
  //                   }
  //                   activity.moments[indexOfMoved + j].y =
  //                     activity.moments[indexOfMoved].y +
  //                     ConfigSc.cellHeight * j;
  //                 }
  //               }

  //               //for plans that comes after moved one, before new plan place, and need to be moved up for one place
  //               if (
  //                 indexOfMoved + numberOfChildren < i &&
  //                 momentIndexChanged == 0
  //               ) {
  //                 activity.moments[i].y =
  //                   activity.moments[i].y -
  //                   ConfigSc.cellHeight * (numberOfChildren + 1);
  //                 if (
  //                   activity.moments[i].parent ==
  //                   activity.moments[indexOfMoved].parent
  //                 ) {
  //                   // previousValues.push(activity.moments[i]);
  //                   activity.moments[i].sort_index =
  //                     Number(activity.moments[i].sort_index) - 1;
  //                   // changes.push(activity.moments[i]);
  //                   activity.moments[i].changed = true;
  //                 }
  //               }

  //               //za staru bracu ispod njega, smanjenje sort index-a za 1
  //               if (
  //                 momentIndexChanged != 0 &&
  //                 i > indexOfMoved &&
  //                 previousParent.id == activity.moments[i].parent &&
  //                 newParentSet
  //               ) {
  //                 // previousValues.push(activity.moments[i]);
  //                 activity.moments[i].sort_index =
  //                   Number(activity.moments[i].sort_index) - 1;
  //                 // changes.push(activity.moments[i]);
  //                 activity.moments[i].changed = true;
  //               }

  //               //uvecati sort index nove brace koja su poslije njega za 1
  //               if (
  //                 momentIndexChanged != 0 &&
  //                 i > indexOfMoved + numberOfChildren &&
  //                 newParentSet
  //               ) {
  //                 if (activity.moments[i].parent == newParent.id) {
  //                   // previousValues.push(activity.moments[i]);
  //                   activity.moments[i].sort_index =
  //                     Number(activity.moments[i].sort_index) + 1;
  //                   // changes.push(activity.moments[i]);
  //                   activity.moments[i].changed = true;
  //                 }
  //               }
  //             }
  //           }
  //         }

  //         //need to move plan in NEW activity, below his old activity
  //         //part for setting plans below him, setting y and sort indexes of his old brothers, check if his old parent has more children, delete the group if it not the case
  //         else {
  //           parentHasChildren--;
  //           for (let i = 0; i < activity.moments.length; i++) {
  //             if (indexOfMoved + numberOfChildren < i) {
  //               if (activity.moments[i].parent == previousParent.id) {
  //                 // previousValues.push(activity.moments[i]);
  //                 activity.moments[i].sort_index =
  //                   Number(activity.moments[i].sort_index) - 1;
  //                 // changes.push(activity.moments[i]);
  //                 activity.moments[i].changed = true;
  //               }
  //               activity.moments[i].y =
  //                 activity.moments[i].y -
  //                 ConfigSc.cellHeight * (numberOfChildren + 1);
  //             }

  //             if (parentHasChildren == 0) {
  //               if (activity.moments[i].id == previousParent.id) {
  //                 activity.moments[i].percentage_of_realized_plan = null;
  //                 activity.moments[i].state = CpspRef.cmp.getPlanById(
  //                   activity.moments[i].parent
  //                 ).name;
  //                 CpspRef.cmp.changeSchedulePlanDetails(
  //                   previousParent,
  //                   activity.moments[i]
  //                 );
  //               }
  //             }
  //           }

  //           //remove plan from old activity
  //           activity.moments.splice(indexOfMoved, 1);
  //           CpspRef.cmp.updateParent(activity,activity.moments[indexOfMoved]);
  //           for (let k = 1; k <= numberOfChildren; k++) {
  //             activity.moments.splice(indexOfMoved, 1);
  //           }

  //           activityOffSelectedMoment = true;
  //           newActivityPlace =
  //             activitySelected.moments.length * ConfigSc.cellHeight;
  //         }
  //       } else {
  //         if (activityOffSelectedMoment == true) {
  //           // found NEW activity, now i can set new parent for plan
  //           if (
  //             newActivityPlace <= lineY &&
  //             lineY <
  //               newActivityPlace +
  //                 (activity.moments.length + 1) * ConfigSc.cellHeight
  //           ) {
  //             const positionY = lineY - newActivityPlace - ConfigSc.cellHeight;
  //             const oldLenght = activity.moments.length;

  //             //ukoliko je aktivitet prazan
  //             if (oldLenght == 0) {
  //               // //previousValues.push(activitySelected.moments[indexOfMoved]);

  //               // if (activity.number == "") {
  //               //   activitySelected.moments[indexOfMoved].global_activity_id = 0;
  //               //   activitySelected.moments[indexOfMoved].schedule_plan_activity_id = activity.id;
  //               // }
  //               // else {
  //               //   //potrebo je pozvati onu funkciju koja vraca id od schedule momenta
  //               //   CpspRef.cmp.getScheduleActivity(activity);
  //               //   // activitySelected.moments[indexOfMoved].global_activity_id = scheduleActivityId;
  //               //   // activitySelected.moments[indexOfMoved].schedule_plan_activity_id = scheduleActivityId;
  //               // }
  //               // //changes.push(activitySelected.moments[indexOfMoved]);

  //               oldMoment = activitySelected.moments[indexOfMoved];

  //               const newActivity: Activity = {
  //                 id: activitySelected.moments[indexOfMoved].id,
  //                 number: "",
  //                 description: activitySelected.moments[indexOfMoved].name,
  //                 moments: [],
  //                 startDate: activitySelected.moments[indexOfMoved].start_date,
  //                 endDate: activitySelected.moments[indexOfMoved].end_date,
  //                 startWeekDate:
  //                   activitySelected.moments[indexOfMoved].dateSegments[0]
  //                     .startWeekDate,
  //                 endWeekDate:
  //                   activitySelected.moments[indexOfMoved].dateSegments[0]
  //                     .endWeekDate,
  //                 numberOfDays:
  //                   activitySelected.moments[indexOfMoved].dateSegments[0]
  //                     .numberOfDays,
  //                 y: 0,
  //                 x: CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
  //                   new Date(activitySelected.moments[indexOfMoved].start_date)
  //                 ),
  //                 resourceWeeks:
  //                   activitySelected.moments[indexOfMoved].number_of_workers,
  //                 countAsResources: null,
  //                 styles: activitySelected.moments[indexOfMoved].styles,
  //                 percentage_of_realized_activity:
  //                   activitySelected.moments[indexOfMoved]
  //                     .percentage_of_realized_plan,
  //                 sort_index: Number(activity.sort_index) + 1,
  //                 tape_color: activitySelected.moments[indexOfMoved].tape_color,
  //                 dateSegments:
  //                   activitySelected.moments[indexOfMoved].dateSegments,
  //                 number_of_workers: activitySelected.number_of_workers,
  //                 time: activitySelected.time,
  //                 default_moment_id: activitySelected.default_moment_id,
  //                 plan: activitySelected.plan,
  //                 part: activitySelected.part,
  //                 changed: true,
  //               };

  //               // previousValues.push(oldMoment);

  //               activitySelected.moments[
  //                 indexOfMoved
  //               ].schedule_plan_activity_id = null;
  //               activitySelected.moments[indexOfMoved].global_activity_id =
  //                 null;
  //               activitySelected.moments[indexOfMoved].group_id = null;
  //               activitySelected.moments[indexOfMoved].parent = null;
  //               activitySelected.moments[indexOfMoved].parent_type = null;
  //               activitySelected.moments[indexOfMoved].state_number = 0;
  //               activitySelected.moments[indexOfMoved].sort_index =
  //                 Number(activity.sort_index) + 1;

  //               // changes.push(activitySelected.moments[indexOfMoved]);
  //               activitySelected.moments[indexOfMoved].changed = true;

  //               // activitySelected.moments[indexOfMoved].group_id = CpspRef.cmp.getGroupIdForMoment(activity, activity, oldMoment);
  //               // activitySelected.moments[indexOfMoved].y = 0;
  //               // activitySelected.moments[indexOfMoved].state_number = 1;
  //               // activitySelected.moments[indexOfMoved].sort_index = 1;
  //               // activitySelected.moments[indexOfMoved].activity_id = activity.id
  //               // activitySelected.moments[indexOfMoved].parent = activity.id;
  //               // activitySelected.moments[indexOfMoved].parent_type = "ACTIVITY";
  //               // activitySelected.moments[indexOfMoved].state = "STATE";

  //               // activity.moments.push(activitySelected.moments[indexOfMoved]);

  //               const deltaState = 0 - oldStateNumber;
  //               //for children of selected plan
  //               for (let j = 1; j <= numberOfChildren; j++) {
  //                 // const oldChild = activitySelected.moments[indexOfMoved + j];

  //                 // previousValues.push(activitySelected.moments[indexOfMoved + j]);
  //                 activitySelected.moments[indexOfMoved + j].activity_id =
  //                   activitySelected.moments[indexOfMoved].id;
  //                 activitySelected.moments[
  //                   indexOfMoved + j
  //                 ].global_activity_id = null;
  //                 if (deltaState != 0)
  //                   activitySelected.moments[indexOfMoved + j].state_number =
  //                     Number(
  //                       activitySelected.moments[indexOfMoved + j].state_number
  //                     ) + deltaState;
  //                 if (
  //                   newActivity.id ==
  //                   activitySelected.moments[indexOfMoved + j].parent
  //                 )
  //                   activitySelected.moments[indexOfMoved + j].parent_type =
  //                     "ACTIVITY";
  //                 // changes.push(activitySelected.moments[indexOfMoved + j]);
  //                 activitySelected.moments[indexOfMoved + j].changed = true;

  //                 activitySelected.moments[indexOfMoved + j].y =
  //                   ConfigSc.cellHeight * (j - 1);

  //                 // CpspRef.cmp.changeScheduleGroup(oldChild, activitySelected.moments[indexOfMoved + j]);

  //                 newActivity.moments.push(
  //                   activitySelected.moments[indexOfMoved + j]
  //                 );
  //               }

  //               // // for new brothers below new activity

  //               // for (let k = i + 1; k < CpspRef.cmp.copySelectedProject.activities.length; k++) {
  //               //   const a = CpspRef.cmp.copySelectedProject.activities[k];
  //               //   previousValuesActivity.push(a);
  //               //   a.sort_index = Number(a.sort_index) + 1;
  //               //   changesActivity.push(a);
  //               // }

  //               CpspRef.cmp.copySelectedProject.activities.splice(
  //                 index + 1,
  //                 0,
  //                 newActivity
  //               );
  //             }

  //             //UKOLIKO AKTIVITET IMA DJECU
  //             else {
  //               for (let i = 0; i < oldLenght; i++) {
  //                 if (momentIndexChanged == -1 || (positionY < 0 && i == 0)) {
  //                   //set new sort index for new brothers below him, set new y for all plans below
  //                   if (
  //                     activitySelected.moments[indexOfMoved].parent ==
  //                     activity.moments[i].parent
  //                   ) {
  //                     // previousValues.push(activity.moments[i]);
  //                     activity.moments[i].sort_index =
  //                       Number(activity.moments[i].sort_index) + 1;
  //                     // changes.push(activity.moments[i]);
  //                     activity.moments[i].changed = true;
  //                   }
  //                   activity.moments[i].y =
  //                     activity.moments[i].y +
  //                     ConfigSc.cellHeight * (numberOfChildren + 1);
  //                 }

  //                 if (momentIndexChanged == 0) {
  //                   //POSTAVITI KAO DIJETE AKTIVITETA
  //                   if (positionY < 0) {
  //                     oldMoment = activitySelected.moments[indexOfMoved];

  //                     // previousValues.push(oldMoment);

  //                     if (activity.number == "") {
  //                       activitySelected.moments[
  //                         indexOfMoved
  //                       ].global_activity_id = 0;
  //                       activitySelected.moments[
  //                         indexOfMoved
  //                       ].schedule_plan_activity_id = activity.id;
  //                     } else {
  //                       //potrebo je pozvati onu funkciju koja vraca id od schedule momenta
  //                       CpspRef.cmp.getScheduleActivity(activity);
  //                     }

  //                     activitySelected.moments[indexOfMoved].group_id =
  //                       activity.moments[i].group_id;
  //                     activitySelected.moments[indexOfMoved].y = 0;
  //                     activitySelected.moments[indexOfMoved].state_number = 1;
  //                     activitySelected.moments[indexOfMoved].sort_index = 1;
  //                     activitySelected.moments[indexOfMoved].activity_id =
  //                       activity.id;
  //                     activitySelected.moments[indexOfMoved].parent =
  //                       activity.id;
  //                     activitySelected.moments[indexOfMoved].parent_type =
  //                       "ACTIVITY";
  //                     activitySelected.moments[indexOfMoved].state = "STATE";

  //                     // changes.push(activitySelected.moments[indexOfMoved]);
  //                     activitySelected.moments[indexOfMoved].changed = true;

  //                     activity.moments.push(
  //                       activitySelected.moments[indexOfMoved]
  //                     );

  //                     momentIndexChanged = -1;

  //                     CpspRef.cmp.updateParent(activity,activity.moments.at(-1))

  //                     //only for old first element in row
  //                     if (
  //                       activity.moments[i] != undefined &&
  //                       activitySelected.moments[indexOfMoved].parent ==
  //                         activity.moments[i].parent
  //                     ) {
  //                       // previousValues.push(activity.moments[i]);
  //                       activity.moments[i].sort_index =
  //                         Number(activity.moments[i].sort_index) + 1;
  //                       // changes.push(activity.moments[i]);
  //                       activity.moments[i].changed = true;
  //                     }
  //                   }

  //                   //place for set plan
  //                   if (positionY >= 0 && positionY == activity.moments[i].y) {
  //                     //if plan - new position already has children, selected plan becomes child of new parent
  //                     if (
  //                       activity.moments[i + 1] != undefined &&
  //                       activity.moments[i + 1].parent == activity.moments[i].id
  //                     ) {
  //                       oldMoment = activitySelected.moments[indexOfMoved];

  //                       // previousValues.push(oldMoment);

  //                       activitySelected.moments[indexOfMoved].group_id =
  //                         activity.moments[i + 1].group_id;
  //                       activitySelected.moments[indexOfMoved].y =
  //                         positionY + ConfigSc.cellHeight;
  //                       activitySelected.moments[indexOfMoved].state_number =
  //                         Number(activity.moments[i].state_number) + 1;
  //                       activitySelected.moments[indexOfMoved].sort_index = 1;
  //                       activitySelected.moments[indexOfMoved].activity_id =
  //                         activity.id;
  //                       activitySelected.moments[indexOfMoved].parent =
  //                         activity.moments[i].id;
  //                       activitySelected.moments[indexOfMoved].parent_type =
  //                         activity.moments[i].state != "STATE" &&
  //                         activity.moments[i].state != "ACTIVITY"
  //                           ? "PLAN"
  //                           : activity.moments[i].state;
  //                       activitySelected.moments[
  //                         indexOfMoved
  //                       ].schedule_plan_activity_id = activity.moments[i].id;
  //                       activitySelected.moments[
  //                         indexOfMoved
  //                       ].global_activity_id =
  //                         activity.moments[i].global_activity_id;
  //                       activitySelected.moments[indexOfMoved].state =
  //                         activitySelected.moments[indexOfMoved]
  //                           .percentage_of_realized_plan == null
  //                           ? activity.moments[i].name
  //                           : "STATE";

  //                       // changes.push(activitySelected.moments[indexOfMoved]);
  //                       activitySelected.moments[indexOfMoved].changed = true;

  //                       activity.moments.push(
  //                         activitySelected.moments[indexOfMoved]
  //                       );
  //                       CpspRef.cmp.updateParent(activity,activity.moments.at(-1))
  //                       momentIndexChanged = -1;
  //                     }

  //                     //plan position does not have children, selected plan becomes his brother
  //                     else {
  //                       oldMoment = activitySelected.moments[indexOfMoved];

  //                       // previousValues.push(oldMoment);

  //                       activitySelected.moments[indexOfMoved].group_id =
  //                         activity.moments[i].group_id;
  //                       activitySelected.moments[indexOfMoved].y =
  //                         positionY + ConfigSc.cellHeight;
  //                       activitySelected.moments[indexOfMoved].state_number =
  //                         activity.moments[i].state_number;
  //                       activitySelected.moments[indexOfMoved].sort_index =
  //                         Number(activity.moments[i].sort_index) + 1;
  //                       activitySelected.moments[indexOfMoved].activity_id =
  //                         activity.moments[i].activity_id;
  //                       activitySelected.moments[indexOfMoved].parent =
  //                         activity.moments[i].parent;
  //                       activitySelected.moments[indexOfMoved].parent_type =
  //                         activity.moments[i].parent_type;
  //                       activitySelected.moments[
  //                         indexOfMoved
  //                       ].schedule_plan_activity_id =
  //                         activity.moments[i].schedule_plan_activity_id;
  //                       activitySelected.moments[
  //                         indexOfMoved
  //                       ].global_activity_id =
  //                         activity.moments[i].global_activity_id;
  //                       activitySelected.moments[indexOfMoved].state =
  //                         activitySelected.moments[indexOfMoved]
  //                           .percentage_of_realized_plan == null
  //                           ? activity.moments[i].state
  //                           : "STATE";

  //                       // changes.push(activitySelected.moments[indexOfMoved]);
  //                       activitySelected.moments[indexOfMoved].changed = true;

  //                       activity.moments.push(
  //                         activitySelected.moments[indexOfMoved]
  //                       );
  //                       CpspRef.cmp.updateParent(activity,activity.moments.at(-1))
  //                       momentIndexChanged = -1;
  //                     }
  //                   }

  //                   const deltaState =
  //                     activitySelected.moments[indexOfMoved].state_number -
  //                     oldStateNumber;
  //                   //for children of selected plan
  //                   for (let j = 1; j <= numberOfChildren; j++) {
  //                     // const oldChild = activitySelected.moments[indexOfMoved + j];

  //                     // previousValues.push(activitySelected.moments[indexOfMoved + j]);
  //                     activitySelected.moments[indexOfMoved + j].activity_id =
  //                       activity.id;
  //                     activitySelected.moments[
  //                       indexOfMoved + j
  //                     ].global_activity_id =
  //                       activitySelected.moments[
  //                         indexOfMoved
  //                       ].global_activity_id;
  //                     if (deltaState != 0)
  //                       activitySelected.moments[
  //                         indexOfMoved + j
  //                       ].state_number =
  //                         Number(
  //                           activitySelected.moments[indexOfMoved + j]
  //                             .state_number
  //                         ) + deltaState;
  //                     // changes.push(activitySelected.moments[indexOfMoved + j]);
  //                     activitySelected.moments[indexOfMoved + j].changed = true;

  //                     activitySelected.moments[indexOfMoved + j].y =
  //                       activitySelected.moments[indexOfMoved].y +
  //                       ConfigSc.cellHeight * j;

  //                     // CpspRef.cmp.changeScheduleGroup(oldChild, activitySelected.moments[indexOfMoved + j]);

  //                     activity.moments.push(
  //                       activitySelected.moments[indexOfMoved + j]
  //                     );
  //                   }


  //                 }
  //               }
  //             }
  //           }

  //           if (activityOffSelectedMoment) {
  //             newActivityPlace =
  //               newActivityPlace +
  //               (activity.moments.length + 1) * ConfigSc.cellHeight;
  //           }
  //         }
  //       }
  //     }

  //     //need to set plan in new activity above selected
  //     if (lineY < -25) {
  //       const topYOfSelectedActivity = lineY + 50;
  //       if (activity.id == activitySelected.id && momentIndexChanged == 0) {
  //         activityOffSelectedMoment = true;

  //         // set new values for old brothers
  //         parentHasChildren--;
  //         for (let i = 0; i < activity.moments.length; i++) {
  //           if (indexOfMoved + numberOfChildren < i) {
  //             if (activity.moments[i].parent == previousParent.id) {
  //               // previousValues.push(activity.moments[i]);
  //               activity.moments[i].sort_index =
  //                 Number(activity.moments[i].sort_index) - 1;
  //               // changes.push(activity.moments[i]);
  //               activity.moments[i].changed = true;
  //             }
  //             activity.moments[i].y =
  //               activity.moments[i].y -
  //               ConfigSc.cellHeight * (numberOfChildren + 1);
  //           }

  //           if (parentHasChildren == 0) {
  //             if (activity.moments[i].id == previousParent.id) {
  //               activity.moments[i].percentage_of_realized_plan = null;
  //               activity.moments[i].state = CpspRef.cmp.getPlanById(
  //                 activity.moments[i].parent
  //               ).name;
  //               CpspRef.cmp.changeSchedulePlanDetails(
  //                 previousParent,
  //                 activity.moments[i]
  //               );
  //             }
  //           }
  //         }

  //         const preciseYPosition =
  //           countYToSelectedActivity + topYOfSelectedActivity;
  //         let findNewActivity = 0;

  //         if (findNewActivity == preciseYPosition && momentIndexChanged == 0) {
  //           oldMoment = activitySelected.moments[indexOfMoved];

  //           const newActivity: Activity = {
  //             id: activitySelected.moments[indexOfMoved].id,
  //             number: "",
  //             description: activitySelected.moments[indexOfMoved].name,
  //             moments: [],
  //             startDate: activitySelected.moments[indexOfMoved].start_date,
  //             endDate: activitySelected.moments[indexOfMoved].end_date,
  //             startWeekDate:
  //               activitySelected.moments[indexOfMoved].dateSegments[0]
  //                 .startWeekDate,
  //             endWeekDate:
  //               activitySelected.moments[indexOfMoved].dateSegments[0]
  //                 .endWeekDate,
  //             numberOfDays:
  //               activitySelected.moments[indexOfMoved].dateSegments[0]
  //                 .numberOfDays,
  //             y: 0,
  //             x: CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
  //               new Date(activitySelected.moments[indexOfMoved].start_date)
  //             ),
  //             resourceWeeks:
  //               activitySelected.moments[indexOfMoved].number_of_workers,
  //             countAsResources: null,
  //             styles: activitySelected.moments[indexOfMoved].styles,
  //             percentage_of_realized_activity:
  //               activitySelected.moments[indexOfMoved]
  //                 .percentage_of_realized_plan,
  //             sort_index: 1,
  //             tape_color: activitySelected.moments[indexOfMoved].tape_color,
  //             dateSegments: activitySelected.moments[indexOfMoved].dateSegments,
  //             number_of_workers:
  //               activitySelected.moments[indexOfMoved].number_of_workers,
  //             time: activitySelected.moments[indexOfMoved].time,
  //             default_moment_id:
  //               activitySelected.moments[indexOfMoved].moment_id,
  //             plan: activitySelected.moments[indexOfMoved].plan,
  //             part: activitySelected.moments[indexOfMoved].part,
  //             changed: false,
  //           };

  //           // previousValues.push(oldMoment);

  //           activitySelected.moments[indexOfMoved].schedule_plan_activity_id =
  //             null;
  //           activitySelected.moments[indexOfMoved].global_activity_id = null;
  //           activitySelected.moments[indexOfMoved].group_id = null;
  //           activitySelected.moments[indexOfMoved].parent = null;
  //           activitySelected.moments[indexOfMoved].parent_type = null;
  //           activitySelected.moments[indexOfMoved].state_number = 0;
  //           activitySelected.moments[indexOfMoved].sort_index = 1;

  //           // changes.push(activitySelected.moments[indexOfMoved]);
  //           activitySelected.moments[indexOfMoved].changed = true;

  //           const deltaState = 0 - oldStateNumber;
  //           //for children of selected plan
  //           for (let j = 1; j <= numberOfChildren; j++) {
  //             const oldChild = activitySelected.moments[indexOfMoved + j];

  //             // previousValues.push(activitySelected.moments[indexOfMoved + j]);
  //             activitySelected.moments[indexOfMoved + j].activity_id =
  //               activitySelected.moments[indexOfMoved].id;
  //             activitySelected.moments[indexOfMoved + j].global_activity_id =
  //               null;
  //             if (deltaState != 0)
  //               activitySelected.moments[indexOfMoved + j].state_number =
  //                 Number(
  //                   activitySelected.moments[indexOfMoved + j].state_number
  //                 ) + deltaState;
  //             if (
  //               newActivity.id ==
  //               activitySelected.moments[indexOfMoved + j].parent
  //             )
  //               activitySelected.moments[indexOfMoved + j].parent_type =
  //                 "ACTIVITY";
  //             // changes.push(activitySelected.moments[indexOfMoved + j]);
  //             activitySelected.moments[indexOfMoved + j].changed = true;

  //             activitySelected.moments[indexOfMoved + j].y =
  //               ConfigSc.cellHeight * (j - 1);

  //             CpspRef.cmp.changeScheduleGroup(
  //               oldChild,
  //               activitySelected.moments[indexOfMoved + j]
  //             );

  //             newActivity.moments.push(
  //               activitySelected.moments[indexOfMoved + j]
  //             );
  //           }

  //           // for new brothers below new activity

  //           for (
  //             let k = 0;
  //             k < CpspRef.cmp.copySelectedProject.activities.length;
  //             k++
  //           ) {
  //             const a = CpspRef.cmp.copySelectedProject.activities[k];
  //             // previousValuesActivity.push(a);
  //             a.sort_index = Number(a.sort_index) + 1;
  //             // changesActivity.push(a);
  //             a.changed = true;
  //           }

  //           CpspRef.cmp.copySelectedProject.activities.splice(
  //             0,
  //             0,
  //             newActivity
  //           );

  //           momentIndexChanged = -1;
  //         }

  //         if (momentIndexChanged == 0) {
  //           for (
  //             let i = 0;
  //             i < CpspRef.cmp.copySelectedProject.activities.length;
  //             i++
  //           ) {
  //             // activity found
  //             if (
  //               findNewActivity < preciseYPosition &&
  //               preciseYPosition <=
  //                 findNewActivity +
  //                   (CpspRef.cmp.copySelectedProject.activities[i].moments
  //                     .length +
  //                     1) *
  //                     ConfigSc.cellHeight
  //             ) {
  //               const finalActivityLength =
  //                 CpspRef.cmp.copySelectedProject.activities[i].moments.length;

  //               //activity does not have children
  //               if (finalActivityLength == 0) {
  //                 oldMoment = activitySelected.moments[indexOfMoved];

  //                 const newActivity: Activity = {
  //                   id: activitySelected.moments[indexOfMoved].id,
  //                   number: "",
  //                   description: activitySelected.moments[indexOfMoved].name,
  //                   moments: [],
  //                   startDate:
  //                     activitySelected.moments[indexOfMoved].start_date,
  //                   endDate: activitySelected.moments[indexOfMoved].end_date,
  //                   startWeekDate:
  //                     activitySelected.moments[indexOfMoved].dateSegments[0]
  //                       .startWeekDate,
  //                   endWeekDate:
  //                     activitySelected.moments[indexOfMoved].dateSegments[0]
  //                       .endWeekDate,
  //                   numberOfDays:
  //                     activitySelected.moments[indexOfMoved].dateSegments[0]
  //                       .numberOfDays,
  //                   y: 0,
  //                   x: CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
  //                     new Date(
  //                       activitySelected.moments[indexOfMoved].start_date
  //                     )
  //                   ),
  //                   resourceWeeks:
  //                     activitySelected.moments[indexOfMoved].number_of_workers,
  //                   countAsResources: null,
  //                   styles: activitySelected.moments[indexOfMoved].styles,
  //                   percentage_of_realized_activity:
  //                     activitySelected.moments[indexOfMoved]
  //                       .percentage_of_realized_plan,
  //                   sort_index:
  //                     Number(
  //                       CpspRef.cmp.copySelectedProject.activities[i].sort_index
  //                     ) + 1,
  //                   tape_color:
  //                     activitySelected.moments[indexOfMoved].tape_color,
  //                   dateSegments:
  //                     activitySelected.moments[indexOfMoved].dateSegments,
  //                   number_of_workers:
  //                     activitySelected.moments[indexOfMoved].number_of_workers,
  //                   time: activitySelected.moments[indexOfMoved].time,
  //                   default_moment_id:
  //                     activitySelected.moments[indexOfMoved].moment_id,
  //                   plan: activitySelected.moments[indexOfMoved].plan,
  //                   part: activitySelected.moments[indexOfMoved].part,
  //                   changed: true,
  //                 };

  //                 // previousValues.push(oldMoment);

  //                 activitySelected.moments[
  //                   indexOfMoved
  //                 ].schedule_plan_activity_id = null;
  //                 activitySelected.moments[indexOfMoved].global_activity_id =
  //                   null;
  //                 activitySelected.moments[indexOfMoved].group_id = null;
  //                 activitySelected.moments[indexOfMoved].parent = null;
  //                 activitySelected.moments[indexOfMoved].parent_type = null;
  //                 activitySelected.moments[indexOfMoved].state_number = 0;
  //                 activitySelected.moments[indexOfMoved].sort_index =
  //                   Number(
  //                     CpspRef.cmp.copySelectedProject.activities[i].sort_index
  //                   ) + 1;

  //                 // changes.push(activitySelected.moments[indexOfMoved]);
  //                 activitySelected.moments[indexOfMoved].changed = true;

  //                 const deltaState = 0 - oldStateNumber;
  //                 //for children of selected plan
  //                 for (let j = 1; j <= numberOfChildren; j++) {
  //                   // const oldChild = activitySelected.moments[indexOfMoved + j];

  //                   // previousValues.push(activitySelected.moments[indexOfMoved + j]);
  //                   activitySelected.moments[indexOfMoved + j].activity_id =
  //                     activitySelected.moments[indexOfMoved].id;
  //                   activitySelected.moments[
  //                     indexOfMoved + j
  //                   ].global_activity_id = null;
  //                   if (deltaState != 0)
  //                     activitySelected.moments[indexOfMoved + j].state_number =
  //                       Number(
  //                         activitySelected.moments[indexOfMoved + j]
  //                           .state_number
  //                       ) + deltaState;
  //                   if (
  //                     newActivity.id ==
  //                     activitySelected.moments[indexOfMoved + j].parent
  //                   ) {
  //                     activitySelected.moments[indexOfMoved + j].parent_type =
  //                       "ACTIVITY";
  //                     activitySelected.moments[
  //                       indexOfMoved + j
  //                     ].schedule_plan_activity_id =
  //                       activitySelected.moments[indexOfMoved + j].parent;
  //                   }
  //                   // changes.push(activitySelected.moments[indexOfMoved + j]);
  //                   activitySelected.moments[indexOfMoved + j].changed = true;

  //                   activitySelected.moments[indexOfMoved + j].y =
  //                     ConfigSc.cellHeight * (j - 1);

  //                   // CpspRef.cmp.changeScheduleGroup(oldChild, activitySelected.moments[indexOfMoved + j]);

  //                   newActivity.moments.push(
  //                     activitySelected.moments[indexOfMoved + j]
  //                   );
  //                 }

  //                 // for new brothers below new activity

  //                 for (
  //                   let k = i + 1;
  //                   k < CpspRef.cmp.copySelectedProject.activities.length;
  //                   k++
  //                 ) {
  //                   const a = CpspRef.cmp.copySelectedProject.activities[k];
  //                   // previousValuesActivity.push(a);
  //                   a.sort_index = Number(a.sort_index) + 1;
  //                   // changesActivity.push(a);
  //                   a.changed = true;
  //                 }

  //                 CpspRef.cmp.copySelectedProject.activities.splice(
  //                   i + 1,
  //                   0,
  //                   newActivity
  //                 );

  //                 momentIndexChanged = -1;

  //                 break;

  //                 // // previousValues.push(activitySelected.moments[indexOfMoved]);
  //                 // if (CpspRef.cmp.copySelectedProject.activities[i].number == "") {
  //                 //   activitySelected.moments[indexOfMoved].global_activity_id = 0;
  //                 //   activitySelected.moments[indexOfMoved].schedule_plan_activity_id = CpspRef.cmp.copySelectedProject.activities[i].id;;
  //                 // }
  //                 // else {
  //                 //   CpspRef.cmp.getScheduleActivity(CpspRef.cmp.copySelectedProject.activities[i]);
  //                 //   //activitySelected.moments[indexOfMoved].global_activity_id = scheduleActivityId;
  //                 //   //activitySelected.moments[indexOfMoved].schedule_plan_activity_id = scheduleActivityId;
  //                 // }
  //                 // // changes.push(activitySelected.moments[indexOfMoved]);

  //                 // oldMoment = activitySelected.moments[indexOfMoved];

  //                 // activitySelected.moments[indexOfMoved].group_id = CpspRef.cmp.getGroupIdForMoment(CpspRef.cmp.copySelectedProject.activities[i], CpspRef.cmp.copySelectedProject.activities[i], oldMoment);
  //                 // activitySelected.moments[indexOfMoved].y = 0;
  //                 // activitySelected.moments[indexOfMoved].state_number = 1;
  //                 // activitySelected.moments[indexOfMoved].sort_index = 1;
  //                 // activitySelected.moments[indexOfMoved].activity_id = CpspRef.cmp.copySelectedProject.activities[i].id;
  //                 // activitySelected.moments[indexOfMoved].parent = CpspRef.cmp.copySelectedProject.activities[i].id;
  //                 // activitySelected.moments[indexOfMoved].parent_type = "ACTIVITY";
  //                 // activitySelected.moments[indexOfMoved].state = "STATE";

  //                 // CpspRef.cmp.copySelectedProject.activities[i].moments.push(activitySelected.moments[indexOfMoved]);

  //                 // const deltaState = activitySelected.moments[indexOfMoved].state_number - oldStateNumber;
  //                 // //for children of selected plan
  //                 // for (const j = 1; j <= numberOfChildren; j++) {
  //                 //   previousValues.push(activitySelected.moments[indexOfMoved + j]);
  //                 //   activitySelected.moments[indexOfMoved + j].activity_id = CpspRef.cmp.copySelectedProject.activities[i].id;
  //                 //   activitySelected.moments[indexOfMoved + j].global_activity_id = activitySelected.moments[indexOfMoved].global_activity_id;
  //                 //   if (deltaState != 0)
  //                 //     activitySelected.moments[indexOfMoved + j].state_number = Number(activitySelected.moments[indexOfMoved + j].state_number) + deltaState;
  //                 //   changes.push(activitySelected.moments[indexOfMoved + j]);

  //                 //   activitySelected.moments[indexOfMoved + j].y = activitySelected.moments[indexOfMoved].y + ConfigSc.cellHeight * j;

  //                 //   CpspRef.cmp.copySelectedProject.activities[i].moments.push(activitySelected.moments[indexOfMoved + j]);
  //                 // }
  //                 // break;
  //               }

  //               //activity has children
  //               else {
  //                 CpspRef.cmp.copySelectedProject.activities[i].moments.forEach(
  //                   (plan, index) => {
  //                     if (index < finalActivityLength) {
  //                       if (momentIndexChanged == -1) {
  //                         //set new sort index for new brothers below him, set new y for all plans below
  //                         if (
  //                           activity.moments[indexOfMoved].parent == plan.parent
  //                         ) {
  //                           // previousValues.push(plan);
  //                           plan.sort_index = Number(plan.sort_index) + 1;
  //                           // changes.push(plan);
  //                           plan.changed = true;
  //                         }
  //                         plan.y =
  //                           plan.y +
  //                           ConfigSc.cellHeight * (numberOfChildren + 1);
  //                       }

  //                       if (momentIndexChanged == 0) {
  //                         // new position is first in row
  //                         if (
  //                           index == 0 &&
  //                           findNewActivity + 50 + plan.y > preciseYPosition
  //                         ) {
  //                           oldMoment = activity.moments[indexOfMoved];

  //                           // previousValues.push(oldMoment);

  //                           if (
  //                             CpspRef.cmp.copySelectedProject.activities[i]
  //                               .number == ""
  //                           ) {
  //                             activity.moments[
  //                               indexOfMoved
  //                             ].global_activity_id = 0;
  //                             activity.moments[
  //                               indexOfMoved
  //                             ].schedule_plan_activity_id =
  //                               plan.schedule_plan_activity_id;
  //                           } else {
  //                             //potrebo je pozvati onu funkciju koja vraca id od schedule momenta
  //                             CpspRef.cmp.getScheduleActivity(
  //                               CpspRef.cmp.copySelectedProject.activities[i]
  //                             );
  //                           }

  //                           activity.moments[indexOfMoved].group_id =
  //                             plan.group_id;
  //                           activity.moments[indexOfMoved].y = 0;
  //                           activity.moments[indexOfMoved].state_number = 1;
  //                           activity.moments[indexOfMoved].sort_index = 1;
  //                           activity.moments[indexOfMoved].activity_id =
  //                             CpspRef.cmp.copySelectedProject.activities[i].id;
  //                           activity.moments[indexOfMoved].parent =
  //                             CpspRef.cmp.copySelectedProject.activities[i].id;
  //                           activity.moments[indexOfMoved].parent_type =
  //                             "ACTIVITY";
  //                           activity.moments[indexOfMoved].state = "STATE";

  //                           // changes.push(activity.moments[indexOfMoved]);
  //                           activity.moments[indexOfMoved].changed = true;

  //                           CpspRef.cmp.copySelectedProject.activities[
  //                             i
  //                           ].moments.push(activity.moments[indexOfMoved]);

  //                           //only for previous first element in this row
  //                           if (
  //                             plan != undefined &&
  //                             activity.moments[indexOfMoved].parent ==
  //                               plan.parent
  //                           ) {
  //                             // previousValues.push(plan);
  //                             plan.sort_index = Number(plan.sort_index) + 1;
  //                             // changes.push(plan);
  //                             plan.changed = true;

  //                             plan.y =
  //                               plan.y +
  //                               ConfigSc.cellHeight * (numberOfChildren + 1);
  //                           }

  //                           momentIndexChanged = -1;
  //                         }

  //                         // new parent found
  //                         if (
  //                           findNewActivity + 50 + plan.y ==
  //                           preciseYPosition
  //                         ) {
  //                           //if plan - new position already has children, selected plan becomes child of new parent
  //                           if (
  //                             CpspRef.cmp.copySelectedProject.activities[i]
  //                               .moments[index + 1] != undefined &&
  //                             CpspRef.cmp.copySelectedProject.activities[i]
  //                               .moments[index + 1].parent == plan.id
  //                           ) {
  //                             parentHasChildren--;
  //                             newParentSet = true;
  //                             newParent = plan;
  //                             oldMoment = activity.moments[indexOfMoved];

  //                             // previousValues.push(oldMoment);

  //                             activity.moments[indexOfMoved].group_id =
  //                               CpspRef.cmp.copySelectedProject.activities[
  //                                 i
  //                               ].moments[index + 1].group_id;
  //                             activity.moments[indexOfMoved].y =
  //                               plan.y + ConfigSc.cellHeight;
  //                             activity.moments[indexOfMoved].parent = plan.id;
  //                             activity.moments[indexOfMoved].parent_type =
  //                               plan.state != "STATE" &&
  //                               plan.state != "ACTIVITY"
  //                                 ? "PLAN"
  //                                 : plan.state;
  //                             activity.moments[indexOfMoved].sort_index = 1;
  //                             activity.moments[indexOfMoved].state_number =
  //                               Number(plan.state_number) + 1;
  //                             activity.moments[
  //                               indexOfMoved
  //                             ].schedule_plan_activity_id =
  //                               CpspRef.cmp.copySelectedProject.activities[
  //                                 i
  //                               ].moments[index + 1].schedule_plan_activity_id;
  //                             activity.moments[indexOfMoved].activity_id =
  //                               CpspRef.cmp.copySelectedProject.activities[
  //                                 i
  //                               ].id;
  //                             activity.moments[
  //                               indexOfMoved
  //                             ].global_activity_id =
  //                               CpspRef.cmp.copySelectedProject.activities[
  //                                 i
  //                               ].moments[index + 1].global_activity_id;
  //                             activity.moments[indexOfMoved].state =
  //                               activity.moments[indexOfMoved]
  //                                 .percentage_of_realized_plan == null
  //                                 ? plan.name
  //                                 : "STATE";

  //                             // changes.push(activity.moments[indexOfMoved]);
  //                             activity.moments[indexOfMoved].changed = true;

  //                             CpspRef.cmp.copySelectedProject.activities[
  //                               i
  //                             ].moments.push(activity.moments[indexOfMoved]);
  //                             CpspRef.cmp.updateParent(CpspRef.cmp.copySelectedProject.activities[
  //                               i
  //                             ],CpspRef.cmp.copySelectedProject.activities[
  //                               i
  //                             ].moments.at(-1))
  //                           }

  //                           //plan position does not have children, selected plan becomes his brother
  //                           else {
  //                             // previousValues.push(activity.moments[indexOfMoved]);

  //                             activity.moments[indexOfMoved].group_id =
  //                               plan.group_id;
  //                             activity.moments[indexOfMoved].y =
  //                               plan.y + ConfigSc.cellHeight;
  //                             activity.moments[indexOfMoved].state_number =
  //                               plan.state_number;
  //                             activity.moments[indexOfMoved].sort_index =
  //                               Number(plan.sort_index) + 1;
  //                             activity.moments[indexOfMoved].activity_id =
  //                               CpspRef.cmp.copySelectedProject.activities[
  //                                 i
  //                               ].id;
  //                             activity.moments[indexOfMoved].parent = plan.id;
  //                             activity.moments[indexOfMoved].parent_type =
  //                               plan.state != "STATE" &&
  //                               plan.state != "ACTIVITY"
  //                                 ? "PLAN"
  //                                 : plan.state;
  //                             activity.moments[
  //                               indexOfMoved
  //                             ].schedule_plan_activity_id = plan.id;
  //                             activity.moments[
  //                               indexOfMoved
  //                             ].global_activity_id = plan.global_activity_id;
  //                             activity.moments[indexOfMoved].state =
  //                               activity.moments[indexOfMoved]
  //                                 .percentage_of_realized_plan == null
  //                                 ? plan.state
  //                                 : "STATE";

  //                             // changes.push(activity.moments[indexOfMoved]);
  //                             activity.moments[indexOfMoved].changed = true;

  //                             CpspRef.cmp.copySelectedProject.activities[
  //                               i
  //                             ].moments.push(activity.moments[indexOfMoved]);
  //                             CpspRef.cmp.updateParent(CpspRef.cmp.copySelectedProject.activities[
  //                               i
  //                             ],CpspRef.cmp.copySelectedProject.activities[
  //                               i
  //                             ].moments.at(-1))
  //                           }

  //                           // newParent = plan;
  //                           // oldMoment = activitySelected.moments[indexOfMoved];

  //                           // activitySelected.moments[indexOfMoved].group_id = CpspRef.cmp.getGroupIdForMoment(CpspRef.cmp.copySelectedProject.activities[i], newParent, oldMoment);
  //                           // activitySelected.moments[indexOfMoved].y = plan.y + ConfigSc.cellHeight;
  //                           // activitySelected.moments[indexOfMoved].state_number = Number(plan.state_number) + 1;
  //                           // activitySelected.moments[indexOfMoved].sort_index = 1;
  //                           // activitySelected.moments[indexOfMoved].activity_id = CpspRef.cmp.copySelectedProject.activities[i].id
  //                           // activitySelected.moments[indexOfMoved].parent = plan.id;
  //                           // activitySelected.moments[indexOfMoved].parent_type = (plan.state != 'STATE' && plan.state != 'ACTIVITY') ? 'PLAN' : plan.state;
  //                           // activitySelected.moments[indexOfMoved].schedule_plan_activity_id = plan.id;
  //                           // activitySelected.moments[indexOfMoved].global_activity_id = plan.global_activity_id;
  //                           // activitySelected.moments[indexOfMoved].state = activitySelected.moments[indexOfMoved].percentage_of_realized_plan == null ? plan.name : "STATE";

  //                           // CpspRef.cmp.copySelectedProject.activities[i].moments.push(activitySelected.moments[indexOfMoved]);

  //                           // // parent now has a child
  //                           // if (plan.percentage_of_realized_plan == null) {
  //                           //   plan.percentage_of_realized_plan = 0;
  //                           //   CpspRef.cmp.changeSchedulePlanDetails(newParent, plan);
  //                           // }

  //                           momentIndexChanged = -1;
  //                         }

  //                         //new moment added, set new values for his children
  //                         if (momentIndexChanged == -1) {
  //                           const deltaState =
  //                             activity.moments[indexOfMoved].state_number -
  //                             oldStateNumber;
  //                           //for children of selected plan
  //                           for (let j = 1; j <= numberOfChildren; j++) {
  //                             const oldChild =
  //                               activity.moments[indexOfMoved + j];

  //                             // previousValues.push(activity.moments[indexOfMoved + j]);
  //                             activity.moments[indexOfMoved + j].activity_id =
  //                               CpspRef.cmp.copySelectedProject.activities[
  //                                 i
  //                               ].id;
  //                             activity.moments[
  //                               indexOfMoved + j
  //                             ].global_activity_id =
  //                               activity.moments[
  //                                 indexOfMoved
  //                               ].global_activity_id;
  //                             if (deltaState != 0)
  //                               activity.moments[
  //                                 indexOfMoved + j
  //                               ].state_number =
  //                                 Number(
  //                                   activity.moments[indexOfMoved + j]
  //                                     .state_number
  //                                 ) + deltaState;
  //                             // changes.push(activity.moments[indexOfMoved + j]);
  //                             activity.moments[indexOfMoved + j].changed = true;

  //                             activity.moments[indexOfMoved + j].y =
  //                               activity.moments[indexOfMoved].y +
  //                               ConfigSc.cellHeight * j;

  //                             CpspRef.cmp.changeScheduleGroup(
  //                               oldChild,
  //                               activity.moments[indexOfMoved + j]
  //                             );

  //                             CpspRef.cmp.copySelectedProject.activities[
  //                               i
  //                             ].moments.push(
  //                               activity.moments[indexOfMoved + j]
  //                             );
  //                             CpspRef.cmp.updateParent(CpspRef.cmp.copySelectedProject.activities[
  //                               i
  //                             ],CpspRef.cmp.copySelectedProject.activities[
  //                               i
  //                             ].moments.at(-1))
  //                           }
  //                         }
  //                       }
  //                     }
  //                   }
  //                 );
  //                 break;
  //               }
  //             } else {
  //               findNewActivity =
  //                 findNewActivity +
  //                 (CpspRef.cmp.copySelectedProject.activities[i].moments
  //                   .length +
  //                   1) *
  //                   ConfigSc.cellHeight;
  //             }
  //           }
  //         }
  //         //remove plan from old activity
  //         activity.moments.splice(indexOfMoved, 1);
  //         for (let k = 1; k <= numberOfChildren; k++) {
  //           activity.moments.splice(indexOfMoved, 1);
  //         }
  //       }

  //       if (activityOffSelectedMoment == false) {
  //         countYToSelectedActivity =
  //           countYToSelectedActivity +
  //           (activity.moments.length + 1) * ConfigSc.cellHeight;
  //       }
  //     }
  //   });

  //   // if (previousParent != null && parentHasChildren == 0) {
  //   //     CpspRef.cmp.deleteScheduleGroup(previousParent);
  //   // }

  //   CpspRef.cmp.copySelectedProject.activities.forEach((activity) => {
  //     activity.moments.sort((m1, m2) => m1.y - m2.y);
  //   });

  //   // if (previousValues.length > 0 && changes.length > 0) {
  //   //     CpspRef.cmp.changeSchedulePlansAddToHistory(previousValues, changes);
  //   // }

  //   // if (previousValuesActivity.length > 0 && changesActivity.length > 0) {
  //   //     CpspRef.cmp.changeScheduleActivitiesAddToHistory(previousValuesActivity, changesActivity);
  //   // }

  //   // CpspRef.cmp.addListContentToHistory();

  //   //ondropmoment method doesn't update y coordinates corectly, sortmomentbysortindex function does that
  //   CpspRef.cmp.sortMomentsBySortIndex();

  //   //calcmoments is used to refresh y coordinates in refreshdisplay method when moments order change
  //   // this.calcMoments=true;
  //   CpspRef.cmp.selectedProject.activities = CpspRef.cmp.deepCopy(
  //     CpspRef.cmp.copySelectedProject.activities
  //   );


  // }

  setColumnDoubleClickHandler(
    column: ProjectColumn,
    columnData: Column,
    activityIndex: number,
    planIndex: number,
    text: string,
    next: boolean = false
  ) {
    CpspRef.cmp.activityIndex = Number(activityIndex);
    CpspRef.cmp.planIndex = Number(planIndex);
    if (CpspRef.cmp.planIndex == 0) CpspRef.cmp.planIndex = null;
    CpspRef.cmp.selectedColumnForEditing = columnData;
    let act = CpspRef.cmp.copySelectedProject.activities.find(
      (a) => a.id == CpspRef.cmp.activityIndex
    );
    if (act.description == null) return;

    //when click on column, must set margins
    if (column != null) {
      const x = ConfigSc.sidebarSize + column.getGlobalX();
      this.marginLeft = x;
      this.marginTop = column.getGlobalY();
      this.selColumn = null;
      CpspRef.cmp.indexOfVisibleColumn = undefined;
    }

    switch (columnData.key) {
      case "numberOfDays":
        column.setOnDoubleClickHandler(() => {
          CpspRef.cmp.columnNumberOfDaysInput.style.display = "block";
          CpspRef.cmp.columnNumberOfDaysInput.style.width = `${column.getWidth()}px`;
          CpspRef.cmp.columnNumberOfDaysInput.style.height = `${column.getHeight()}px`;
          CpspRef.cmp.columnNumberOfDaysInput.value = text;
          CpspRef.cmp.columnNumberOfDaysInput.style.top = `${column.getGlobalY()}px`;
          const x =
            ConfigSc.sidebarSize + column.getGlobalX() + column.getWidth() / 2;
          CpspRef.cmp.columnNumberOfDaysInput.style.left = `${x}px`;
          CpspRef.cmp.columnNumberOfDaysInput.focus();
          CpspRef.cmp.columnNumberOfDaysInput.select();
        });
        break;
      case "start_date":
        // CpspRef.cmp.columnStartDateInput.style.marginTop = `${column.getGlobalY() - column.getHeight()/2}px`;
        // CpspRef.cmp.columnStartDateInput.style.marginLeft = `${
        //   ConfigSc.sidebarSize + column.getGlobalX() - column.getWidth()/2
        // }px`;

        if (!next) {
          CpspRef.cmp.columnStartDateInput.style.top =
            column != null ? `${column.getGlobalY()}px` : `${this.marginTop}px`;

          CpspRef.cmp.columnStartDateInput.style.left =
            column != null
              ? `${ConfigSc.sidebarSize + column.getGlobalX()}px`
              : `${this.marginLeft}px`; //`${Number(CpspRef.cmp.resourceWeekInput.style.left.replace("px","")) + CpspRef.cmp.visibleColumns[3].width/2}px`;
        }

        if (text == "") {
          text = ConfigSc.currentDate.format(ConfigSc.dateRevFormat);
        }
        CpspRef.cmp.columnStartDateInput.value = moment(
          text,
          ConfigSc.dateFormat
        ).format(ConfigSc.datepickerFormat);
        CpspRef.cmp.activityIndex = Number(activityIndex);
        CpspRef.cmp.planIndex = Number(planIndex);
        const datepicker = $("#columnStartDateInput") as any;
        datepicker.datepicker("setDate", "20" + text);
        datepicker.datepicker("show");
        CpspRef.cmp.showCal = true;
        break;
      case "end_date":
        // CpspRef.cmp.columnEndDateInput.style.marginTop = `${column.getGlobalY() - column.getHeight()/2}px`;

        // if(CpspRef.cmp.columnStartDateInput.style.marginLeft !="")
        // CpspRef.cmp.columnEndDateInput.style.marginLeft = `${
        //   column.getWidth() - 160
        // }px`;
        // else if(CpspRef.cmp.columnEndDateInput.style.marginLeft =="")
        // CpspRef.cmp.columnEndDateInput.style.marginLeft = `${
        //   ConfigSc.sidebarSize + column.getGlobalX() - column.getWidth()/2 -160
        // }px`;

        if (!next) {
          CpspRef.cmp.columnEndDateInput.style.top =
            column != null ? `${column.getGlobalY()}px` : `${this.marginTop}px`;

          CpspRef.cmp.columnEndDateInput.style.left =
            column != null
              ? `${ConfigSc.sidebarSize + column.getGlobalX()}px`
              : `${this.marginLeft}px`; // `${Number(CpspRef.cmp.columnStartDateInput.style.left.replace("px","")) + CpspRef.cmp.visibleColumns[4].width}px`;
        }
        if (text == "") {
          text = ConfigSc.currentDate.format(ConfigSc.dateRevFormat);
        }
        const datepicker2 = $("#columnEndDateInput") as any;
        if (text != "")
          CpspRef.cmp.columnEndDateInput.value = moment(
            text,
            ConfigSc.dateFormat
          ).format(ConfigSc.datepickerFormat);
        //else
        //CpspRef.cmp.columnEndDateInput.value = ConfigSc.currentDate.format(ConfigSc.datepickerFormat);
        CpspRef.cmp.endDateDatepicker = CpspRef.cmp.columnEndDateInput.value;
        CpspRef.cmp.activityIndex = Number(activityIndex);
        CpspRef.cmp.planIndex = Number(planIndex);

        datepicker2.datepicker("setDate", "20" + text);
        datepicker2.datepicker("show");

        CpspRef.cmp.columnEndDateInput.value = moment(
          text,
          ConfigSc.dateFormat
        ).format(ConfigSc.datepickerFormat);
        CpspRef.cmp.showCal = true;

        break;
      default:
        throw new Error("No column with key: " + columnData.key);
    }
  }

  //obojene trake usera
  private renderMomentDateSegments(
    moment: Moment,
    activityDateSegmentContainer: GenericContainer,
    projectIndex: number,
    momentIndex: number,
    i: number
  ) {
    const lenDateSegments = moment.dateSegments.length;
    const yPosition = i * ConfigSc.cellHeight + ConfigSc.cellHeight;

    moment.dateSegments.forEach((dateSegment, dateSegmentIndex) => {
      if (moment.percentage_of_realized_plan != null && dateSegmentIndex > 0) return;
      let activity = CpspRef.cmp.copySelectedProject.activities
        .find((a) => a.id == projectIndex)

      let mom=activity.moments.find((m) => m.id == momentIndex);

      let x =
        CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
          new Date(dateSegment.startDate)
        ) * CpspRef.cmp.pixelRation;

      dateSegment.numberOfDays =
        momentM(dateSegment.endDate, ConfigSc.dateFormat).diff(
          momentM(dateSegment.startDate, ConfigSc.dateFormat),
          "days"
        ) + 1;

      const percentageWork = moment.dateSegments[0].currentWorkDate != null ? moment.dateSegments[0].currentWorkDate.split("%") : [];
      let perDays = percentageWork.length > 1 ? percentageWork[1] : percentageWork[0];


      if (mom == undefined) {
        mom = CpspRef.cmp.copySelectedProject.activities
          .find((act) => act.y == moment.y - yPosition)
          .moments.find((m) => m.y == moment.y);
      }
      let segmentWidth = dateSegment.numberOfDays * ConfigSc.cellWidth * CpspRef.cmp.pixelRation;
      const dateSegmentContainer = new DateSegment(
        x,
        yPosition + ConfigSc.cellHeight / 4,
        segmentWidth,
        ConfigSc.cellHeight -10,
        CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
        activityDateSegmentContainer,
        { projectIndex, momentIndex, dateSegmentIndex }
      );



      // crni most
      if (moment.percentage_of_realized_plan != null && dateSegmentIndex == 0) {
        dateSegmentContainer.setBackgroundColor("#77BA6E");
        dateSegmentContainer.setBorderRoundness(0);
        dateSegmentContainer.setHeight(ConfigSc.cellHeight / 4);
        dateSegmentContainer.setWidth(
          CpspRef.cmp.getPercentageOfFinished(projectIndex, momentIndex) *
            ConfigSc.cellWidth * CpspRef.cmp.pixelRation
        );
        let momentBridge = new BezierCurveBridge(
          x + segmentWidth,
          yPosition + (3 * ConfigSc.cellHeight) / 4,
          x,
          yPosition + (3 * ConfigSc.cellHeight) / 4,
          CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
          activityDateSegmentContainer
        );
        momentBridge.setBackgroundColor("black");
      } else {
        dateSegmentContainer.setBackgroundColor(moment.tape_color);
        dateSegmentContainer.setBorder("black", 0.5);

        if(lenDateSegments > 1){
          if(dateSegmentIndex == 0)
            dateSegmentContainer.setBorderRoundness(8,true,false,true,false);
          else if(dateSegmentIndex == lenDateSegments - 1)
            dateSegmentContainer.setBorderRoundness(8,false,true,false,true);
          else
            dateSegmentContainer.setBorderRoundness(0);
        }

        if (
          moment.dateSegments.at(0).startWorkDate != null &&
          moment.dateSegments.at(0).currentWorkDate != null
        ) {
          x =
            CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
              new Date(
                dateSegment.startDate
                // CpspRef.cmp.getSomeDate(
                //   dateSegment.startDate,
                //   dateSegment.startWorkDate,
                //   "before"
                // )
              )
            );


          segmentWidth =
            ConfigSc.cellWidth *
            CpspRef.cmp.getDaysBetweenDates(
              // CpspRef.cmp.getSomeDate(
              //   dateSegment.startDate,
              //   dateSegment.startWorkDate,
              //   "before"
              // ),
              dateSegment.startDate,
              perDays > dateSegment.endDate ? dateSegment.endDate : perDays
              // percentageWork.length > 1 ? percentageWork[1] : percentageWork[0]
              // dateSegment.currentWorkDate
            );
          if (segmentWidth < 0)
            segmentWidth =
              ConfigSc.cellWidth *
              CpspRef.cmp.getDaysBetweenDates(
                CpspRef.cmp.getSomeDate(
                  dateSegment.startDate,
                  dateSegment.startWorkDate,
                  "after"
                ),
                dateSegment.endDate
              );
        } else segmentWidth = (ConfigSc.cellWidth / 2);

        if (
          CpspRef.cmp.getSomeDate(
            dateSegment.startDate,
            CpspRef.cmp.Date,
            "before"
          ) == dateSegment.startDate
        ) {
          if(perDays < dateSegment.startDate ||
            (moment.dateSegments.at(0).currentWorkDate == null && dateSegmentIndex > 0))
            return;
          const tape = new Line(
            dateSegment.currentWorkDate != null ? x * CpspRef.cmp.pixelRation : x,
            yPosition + (3 * ConfigSc.cellHeight) / 5,
            dateSegment.currentWorkDate != null ? (x + segmentWidth) * CpspRef.cmp.pixelRation : (x + segmentWidth),
            yPosition + (3 * ConfigSc.cellHeight) / 5,
            CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
            activityDateSegmentContainer
          );
          tape.setLineThickness(5);
          if (
            moment.dateSegments.at(0).currentWorkDate != null
          ) {
              if((percentageWork.length > 0 && percentageWork[1] >= ConfigSc.currentDate.format(ConfigSc.dateFormat)) ||
                (percentageWork.length > 0 && percentageWork[1] == moment.dateSegments.at(-1).endDate))
              {
              tape.setColor("#00FF33"); //zeleno OK
              tape.setFillColor("#00FF33");
              if(perDays <= dateSegment.endDate){
                tape.setMoveValue((-ConfigSc.cellWidth / 4) * CpspRef.cmp.pixelRation);
                tape.setCircleOnEnd();
              } else {
                tape.setMoveValue(0);
              }
            } else {
              tape.setColor("#FF5454");
              tape.setFillColor("#FF5454");
              if(perDays <= dateSegment.endDate){
                tape.setMoveValue((-ConfigSc.cellWidth / 4) * CpspRef.cmp.pixelRation);
                tape.setCircleOnEnd();
              } else {
                tape.setMoveValue(0);
              }
            }
          } else {
            tape.setColor("#FF5454");
            tape.setFillColor("#FF5454");
            tape.setMoveValue(0);
            if(!perDays || perDays <= dateSegment.endDate)
            tape.setCircleOnEnd();
          }
        } else if (moment.dateSegments.at(0).currentWorkDate != null && perDays >= dateSegment.startDate) {
          const tape = new Line(
            x * CpspRef.cmp.pixelRation,
            yPosition + (3 * ConfigSc.cellHeight) / 5,
            (x + segmentWidth) * CpspRef.cmp.pixelRation,
            yPosition + (3 * ConfigSc.cellHeight) / 5,
            CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
            activityDateSegmentContainer
          );
          tape.setLineThickness(5);
          tape.setColor("#00FF33"); //zeleno OK
          tape.setFillColor("#00FF33");
          if(perDays <= dateSegment.endDate){
            tape.setMoveValue((-ConfigSc.cellWidth / 4) * CpspRef.cmp.pixelRation);
            tape.setCircleOnEnd();
          } else {
            tape.setMoveValue(0);
          }
          // tape.setMoveValue((-ConfigSc.cellWidth / 4) * CpspRef.cmp.pixelRation);
          // tape.setCircleOnEnd();
        }

        //check if moment has ben flyta moved
        // if (
        //   dateSegment.startWorkDate != null &&
        //   mom.start_date != dateSegment.startWorkDate
        // ) {
        //   const x =
        //     CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
        //       new Date(mom.start_date)
        //     ) * CpspRef.cmp.pixelRation;
        //   const segment =
        //     momentM(dateSegment.startWorkDate, ConfigSc.dateFormat).diff(
        //       momentM(mom.start_date, ConfigSc.dateFormat),
        //       "days"
        //     ) + 1;
        //   dateSegmentIndex = -1;
        //   if (segment > 0) {
        //     const dateSegmentContainer = new DateSegment(
        //       x,
        //       yPosition + ConfigSc.cellHeight / 4,
        //       (segment * ConfigSc.cellWidth) * CpspRef.cmp.pixelRation,
        //       ConfigSc.cellHeight - 10,
        //       CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
        //       activityDateSegmentContainer,
        //       { projectIndex, momentIndex, dateSegmentIndex }
        //     );
        //     dateSegmentContainer.setBackgroundColor("white");
        //     dateSegmentContainer.setBorder("black", 0.5);
        //     dateSegmentContainer.setBorderRoundness(
        //       8,
        //       true,
        //       false,
        //       true,
        //       false
        //     );
        //   }
        // }


        if(percentageWork.length > 2 && CpspRef.cmp.property_index > 1){
          let whiteTapes = CpspRef.cmp.findWhiteTape(mom.activity_id,mom.id, true);

          whiteTapes.sort((a, b) => {
            const percentageWork1 = a.dateSegments[0].currentWorkDate != null ? a.dateSegments[0].currentWorkDate.split("%") : [];
            const percentageWork2 = b.dateSegments[0].currentWorkDate != null ? b.dateSegments[0].currentWorkDate.split("%") : [];
            if ( percentageWork1.length <= 2 && percentageWork2.length > 2) {
              return -1;
            }
            if (percentageWork1.length > 2 && percentageWork2.length <= 2) {
              return 1;
            }
            if (percentageWork1.at(2) < percentageWork2.at(2)){
              return -1;
            }
            if (percentageWork1.at(2) > percentageWork2.at(2)){
              return 1;
            }
              return 0;
          })

          for(let i = 0; i < whiteTapes.length; i++){
            let act = whiteTapes.at(i);
            let perWork = act.dateSegments.at(0).currentWorkDate.split("%");

            // const x =
            //   CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
            //     new Date(act.startDate)
            //   ) * CpspRef.cmp.pixelRation;
            // const segment =
            //   momentM(dateSegment.startWorkDate, ConfigSc.dateFormat).diff(
            //     momentM(mom.start_date, ConfigSc.dateFormat),
            //     "days"
            //   ) + 1;
            if(!perWork.at(2) || perWork.at(2) != percentageWork.at(2)){
              let dateSegmentIndex = -1;
              let x = CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(new Date(act.start_date));
              const dateSegmentContainer = new DateSegment(
                x * CpspRef.cmp.pixelRation,
                yPosition + ConfigSc.cellHeight / 4,
                (momentM(act.end_date).diff(momentM(act.start_date),"days") + 1) * ConfigSc.cellWidth * CpspRef.cmp.pixelRation,
                ConfigSc.cellHeight - 10,
                CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
                activityDateSegmentContainer,
                { projectIndex, momentIndex, dateSegmentIndex }
              );
              dateSegmentContainer.setBackgroundColor("white");
              dateSegmentContainer.setBorder("black", 0.5);
              dateSegmentContainer.setBorderRoundness(
                8,
                // true,
                // false,
                // true,
                // false
              );
              if (i > 0){
                const cText = new TextRenderer(
                  (i + 1).toString(),
                  this.canvas,
                  dateSegmentContainer
                );
                cText.setAlignment("center", "center");
              }
              // const text = new TextRenderer(i,this.canvas,dateSegmentContainer);
              // text.setAlignment("center","center")
            }


          }
        }

        const currDay = percentageWork.length > 1 ? percentageWork[1] : percentageWork[0];
        //red lines
        if (
          currDay !=
            ConfigSc.currentDate.format(ConfigSc.dateFormat) &&
          ((currDay >
            ConfigSc.currentDate.format(ConfigSc.dateFormat) &&
            currDay == dateSegment.endDate) ||
            currDay < moment.dateSegments.at(-1).endDate)
        ) {
          // if (
          //   currDay !=
          //     ConfigSc.currentDate.format(ConfigSc.dateFormat) &&
          //   ((currDay >
          //     ConfigSc.currentDate.format(ConfigSc.dateFormat) &&
          //     currDay == mom.end_date) ||
          //     currDay < mom.end_date)
          // ) {
          //if(dateSegment.currentWorkDate < ConfigSc.currentDate.format(ConfigSc.dateFormat)){
          const x =
            CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
              new Date(currDay)
            ) * CpspRef.cmp.pixelRation;
          let segmentWidth =
            momentM(ConfigSc.currentDate, ConfigSc.dateFormat).diff(
              momentM(currDay, ConfigSc.dateFormat),
              "days"
            ) + 1;
          segmentWidth = (segmentWidth * ConfigSc.cellWidth) * CpspRef.cmp.pixelRation;
          if(currDay < ConfigSc.currentDate.format(ConfigSc.dateFormat) ||
            ( percentageWork[0] > "0" && currDay > ConfigSc.currentDate.format(ConfigSc.dateFormat))
            ){
            const line = new Line(
              x + (ConfigSc.cellWidth * CpspRef.cmp.pixelRation),
              yPosition + (3 * ConfigSc.cellHeight) / 5,
              currDay <
              ConfigSc.currentDate.format(ConfigSc.dateFormat)
                ? x + segmentWidth
                : x + segmentWidth - (ConfigSc.cellWidth * CpspRef.cmp.pixelRation),
              yPosition,
              CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
              activityDateSegmentContainer
            );
            const line2 = new Line(
              x + (ConfigSc.cellWidth * CpspRef.cmp.pixelRation),
              yPosition + (3 * ConfigSc.cellHeight) / 5,
              currDay <
              ConfigSc.currentDate.format(ConfigSc.dateFormat)
                ? x + segmentWidth
                : x + segmentWidth - (ConfigSc.cellWidth * CpspRef.cmp.pixelRation),
              yPosition + ConfigSc.cellHeight,
              CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
              activityDateSegmentContainer
            );
            line.setLineThickness(2);
            line.setColor("red");
            line.setFillColor("red");
            line.setMoveValue((-ConfigSc.cellWidth / 2) * CpspRef.cmp.pixelRation);
            line2.setLineThickness(2);
            line2.setColor("red");
            line2.setFillColor("red");
            line2.setMoveValue((-ConfigSc.cellWidth / 2) * CpspRef.cmp.pixelRation);
          }
        }
      }
    });

    if(CpspRef.cmp.checked){
      const momEndDate = momentM(moment.dateSegments.at(-1).endDate).add(1,"days");
      const nameOfActivity = new ProjectColumn(
       ( CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(new Date(momEndDate.format(ConfigSc.dateFormat))) + (ConfigSc.cellWidth / 2)) * CpspRef.cmp.pixelRation ,
        yPosition + 5,
        (this.canvas
          .getContext()
          .measureText(moment.name).width + 5),
        14,
        this.canvas,
        activityDateSegmentContainer
      );
      nameOfActivity.setBackgroundColor("transparent");
      const cText = new TextRenderer(
        moment.name,
        this.canvas,
        nameOfActivity
      );
      cText.setAlignment("left", "center");
      cText.setFontStyle("bold");
    }

    if (moment.dateSegments[0].noted != null && moment.dateSegments[0].noted > 0) {
      // const condition =
      //   CpspRef.cmp.getDaysBetweenDates(
      //     dateSegment.startWorkDate,
      //     dateSegment.currentWorkDate
      //   ) ==
      //     CpspRef.cmp.getDaysBetweenDates(
      //       dateSegment.startDate,
      //       dateSegment.endDate
      //     ) ||
      //   dateSegment.currentWorkDate != null
      //   ? dateSegment.currentWorkDate >= CpspRef.cmp.Date
      //   : false;


        let notePosition;// =  (CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(new Date(mom.start_date)) + segmentWidth + 4) * CpspRef.cmp.pixelRation;
        let noteText: string;
        let daysMoved: number;

        const noteTextAndPosition = moment.dateSegments[0].noteText.split("%");


        // check if there is date in notetextandposition array
      if (noteTextAndPosition.length == 1) {

        noteText = noteTextAndPosition[0] ? noteTextAndPosition[0] : "";
        notePosition = (CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(new Date(moment.dateSegments.at(-1).endDate)) + ConfigSc.cellWidth) * CpspRef.cmp.pixelRation;
        } else {

        notePosition = CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(new Date(noteTextAndPosition[0])) * CpspRef.cmp.pixelRation;
        noteText = noteTextAndPosition[1];
      }



      const c = new ProjectColumn(
        notePosition + 12,
        yPosition + 5,
        (this.canvas
          .getContext()
          .measureText(noteText).width + 5),
        14,
        this.canvas,
        activityDateSegmentContainer
      );
      c.setBackgroundColor("white");

      const iconShape = new Rectangle(
        notePosition,
        c.getY(),
        CpspRef.cmp.pixelRation >= 1 ?
          12 * CpspRef.cmp.pixelRation :
          12 / CpspRef.cmp.pixelRation,
        14,
        this.canvas,
        activityDateSegmentContainer
      );
      iconShape.addBackgroundImagePattern(
        // condition ? "flag-green" : "flag-red",
        // condition ? "flag-green" : "flag-red",
        CpspRef.cmp.notes[moment.dateSegments[0].noted - 1],
        CpspRef.cmp.notes[moment.dateSegments[0].noted - 1],
        12,
        14
      );



      //add handlers for moving moment note
      iconShape.setOnMouseDownHandler((event) => {
        let compareMovement = 0;
        let movingNote = true;
        CpspRef.cmp.activityIndex = projectIndex;
        CpspRef.cmp.planIndex = moment.id;
        let daysMovedCom = notePosition;
            window.addEventListener("mousemove", (ev) => {
        if(movingNote){
          notePosition += ev.movementX;
          compareMovement = daysMoved;
          daysMoved = Math.round(((notePosition/CpspRef.cmp.pixelRation) - moment.dateSegments[0].x) / 15);
          // mom.dateSegments[0].noteText = momentM(mom.start_date, ConfigSc.dateFormat).add("d", daysMoved).format(ConfigSc.dateFormat) + "%" + noteText;
          if (compareMovement != daysMoved) {
            iconShape.setX(notePosition-4)
            c.setX(notePosition + 12)
            this.canvas.resetDrawingContainers();
          }
        }
      });



        iconShape.addRemoveEventsForMouseDownEvent(() => {
          daysMovedCom = Math.floor((notePosition-daysMovedCom)/(ConfigSc.cellWidth * CpspRef.cmp.pixelRation))
          moment.dateSegments[0].noteText = momentM(noteTextAndPosition.length == 1 ?
                                                moment.dateSegments.at(-1).endDate :
                                                noteTextAndPosition[0], ConfigSc.dateFormat).add(daysMovedCom,"days").format(ConfigSc.dateFormat) + "%" + noteText;
          movingNote = false;
          CpspRef.cmp.selectedProject.activities = this.deepCopy(CpspRef.cmp.copySelectedProject.activities);
          CpspRef.cmp.updateNote({ target: { value: noteText } })
          document.body.style.cursor = "default";
          // this.refreshDisplay();
          const dropdownMenu = new DropdownMenu(
            iconShape.getGlobalX(),
            iconShape.getGlobalY() - ConfigSc.cellHeight,
            50,
            200,
            this.canvas
          );

          dropdownMenu.addOption(
            CpspRef.cmp.getTranslate().instant("Delete"),
            (e) => {
              CpspRef.cmp.selectedMomentsForStyleChange = [];
              // CpspRef.cmp.selectedMomentsForStyleChange.push({
              //   projectId: CpspRef.cmp.selectedProject.id,
              //   activityId: moment.activity_id,
              //   stateType: moment.state,
              //   moment: moment,
              //   planId: moment.id,
              //   state_number: moment.state_number,
              //   parent: moment.parent,
              // });
              CpspRef.cmp.selectedMomentsForStyleChange.push(moment);

              CpspRef.cmp.showConfirmationModal(
                CpspRef.cmp.getTranslate().instant("Do you want to delete?"),
                async (response) => {
                  if (response.result) {
                    if (CpspRef.cmp.loading) {
                      return;
                    }
                    CpspRef.cmp.setLoadingStatus(true);
                    CpspRef.cmp.addNewNote(0);
                    CpspRef.cmp.setLoadingStatus(false);
                  }
                }
              );

            });

            dropdownMenu.open();
          });
        });

        iconShape.setOnMouseHoverHandler(()=>document.body.style.cursor="move");







      const cText = new TextRenderer(
        noteText,
        this.canvas,
        c
      );
      cText.setAlignment("left", "center");

      c.setOnClickHandler((e) => {
        this.selectedMomentsContainer = null;
        if ((CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.lockedRevision)) {
          return;
        }
        CpspRef.cmp.hideColumnValueInput();
        CpspRef.cmp.noteInput.style.display = "block";
        CpspRef.cmp.noteInput.style.textAlign = "left";
        CpspRef.cmp.noteInput.style.width = `${c.getWidth()}px`;
        CpspRef.cmp.noteInput.style.height = `${c.getHeight()}px`;
        CpspRef.cmp.noteInput.style.border = "3px solid #F77E04";
        CpspRef.cmp.noteInput.value = moment.dateSegments[0].noteText.toString();
        CpspRef.cmp.noteInput.style.top = `${c.getGlobalY()}px`;
        const x = ConfigSc.sidebarSize + c.getGlobalX();
        CpspRef.cmp.noteInput.style.left = `${x}px`;
        CpspRef.cmp.noteInput.focus();
        CpspRef.cmp.noteInput.select();

        CpspRef.cmp.activityIndex = Number(projectIndex);
        CpspRef.cmp.planIndex = Number(momentIndex);
      });
    }

    //draw line between tapes
    if(lenDateSegments > 1){
      const yPosition = i * ConfigSc.cellHeight + ConfigSc.cellHeight;
      for(let i = 1; i < lenDateSegments; i++){
        if (moment.percentage_of_realized_plan != null) break;
        const dateSegment = moment.dateSegments.at(i)
        const startXLine = CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(new Date(moment.dateSegments.at(i - 1).endDate)) * CpspRef.cmp.pixelRation;
        const endXLine = CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(new Date(dateSegment.startDate)) * CpspRef.cmp.pixelRation;
        const line = new Line(
          startXLine + (ConfigSc.cellWidth * CpspRef.cmp.pixelRation),
          yPosition + (ConfigSc.cellHeight / 4) + (ConfigSc.cellHeight - 10),
          endXLine + (( 3 * ConfigSc.cellWidth / 4) * CpspRef.cmp.pixelRation),
          yPosition + (ConfigSc.cellHeight / 4) + (ConfigSc.cellHeight - 10),
          CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
          // CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer()
          activityDateSegmentContainer
        );
        line.setLineDash([3, 0.5]);
        line.setLineThickness(1.35)
        line.draw();
      }
    }
  }

  setAllDisplayProjectsAndMomentsCoordinates(newCopy = true) {
    let y = 0;
    let project = CpspRef.cmp.copySelectedProject;

    project.activities.forEach((activity) => {
      this.setProjectXCoordinate(activity);
      activity.y = y;
      y += ConfigSc.cellHeight;
      let momentY = 0;
      activity.moments.forEach((moment) => {
        moment.y = momentY;
        momentY += ConfigSc.cellHeight;

        moment.dateSegments.forEach((dateSegment) => {
          this.setSegmentCoordinates(dateSegment);
        });
        // moment.absences.forEach((absence) => {
        //   this.setSegmentCoordinates(absence);
        // });
      });
      y += momentY;
    });
    //CpspRef.cmp.copySelectedProject = CpspRef.cmp.deepCopy(CpspRef.cmp.selectedProject);

    let rows = this.getNumberOfAllDisplayActivitiesAndMoments();
    let needs = this.getRowNumbersContainer()
      .getRowListContainer()
      .getLastRowNumber();
    let sort = CpspRef.cmp.copySelectedProject.activities.at(-1).sort_index;
    while (rows < needs) {
      let new_activity: Activity;
      new_activity = {
        id: -rows,
        number: "",
        description: null,
        styles: {
          backgroundColor: "white",
          color: "#000",
          fontDecoration: "normal",
          fontFamily: "Calibri",
          fontSize: 13,
          fontStyle: "normal",
          fontWeight: "normal",
        },
        moments: [],
        startDate: null,
        endDate: null,
        startWeekDate: null,
        endWeekDate: null,
        numberOfDays: 1,
        y: y,
        x: CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
          new Date(ConfigSc.currentDate.format(ConfigSc.dateFormat))
        ),
        resourceWeeks: null,
        countAsResources: false,
        percentage_of_realized_activity: null,
        sort_index: ++sort,
        tape_color: "#B6B1B1",
        dateSegments: [
          {
            id: -rows,
            startDate: null,
            endDate: null,
            startWeekDate: null,
            endWeekDate: null,
            numberOfDays: null,
            x: 0,
            y: 0,
            startWorkDate: null,
            currentWorkDate: null,
            connected: 0,
            connectedToPlan: null,
            noted: null,
            noteText: null,
            finishedTime: null,
          },
        ],
        number_of_workers: 0,
        time: 0,
        default_moment_id: null,
        plan: null,
        part: null,
        changed: false,
      };
      CpspRef.cmp.copySelectedProject.activities.push(new_activity);
      rows++;
      y += ConfigSc.cellHeight;
    }

    // if(newCopy)
    //   CpspRef.cmp.copySelectedProject = CpspRef.cmp.deepCopy(
    //     CpspRef.cmp.selectedProject
    //   );
    // CpspRef.cmp.baseSelectedProject = CpspRef.cmp.deepCopy(
    //   CpspRef.cmp.selectedProject
    // );
  }

  checkIsEqual() {
    let a1 = CpspRef.cmp.selectedProject;
    let a2 = CpspRef.cmp.copySelectedProject;
    if (a1.activities.length != a2.activities.length) return false;
    else {
      a1.activities.forEach((act, ind) => {
        if (act.moments.length != a2.activities[ind].moments.length)
          return false;
        act.moments.forEach((mom, indm) => {
          if (
            JSON.stringify(mom) !=
            JSON.stringify(a2.activities[ind].moments[indm])
          )
            return false;
        });
      });
    }
    return true;
  }

  setSegmentCoordinates(dateSegment: DateSegmentData) {
    const startDate = moment(dateSegment.startDate);

    const startYear = startDate.year();
    const startMonth = startDate.month() + 1;
    const startDay = startDate.date();

    const months =
      CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.getAllDisplayMonths();

    for (let i = 0, n = months.length; i < n; i++) {
      if (months[i].year !== startYear || months[i].month !== startMonth) {
        continue;
      }

      for (let j = 0, m = months[i].days.length; j < m; j++) {
        if (months[i].days[j].day !== startDay) {
          continue;
        }
        dateSegment.x = months[i].x + j * ConfigSc.cellWidth;
        return;
      }
    }

    const diffBetweenStartAndFirstDay = moment(
      `${months[0].year}-${months[0].month}-${months[0].days[0].day}`,
      ConfigSc.dateFormat
    ).diff(dateSegment.startDate, "days");
    dateSegment.x =
      months[0].x - diffBetweenStartAndFirstDay * ConfigSc.cellWidth;
  }

  setProjectXCoordinate(activity: Activity) {
    const startDate = moment(activity.startDate);
    const activityIndex = CpspRef.cmp.copySelectedProject.activities.findIndex(
      (act) => act.id == activity.id
    );
    const startYear = startDate.year();
    const startMonth = startDate.month() + 1;
    const startDay = startDate.date();

    const months =
      CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.getAllDisplayMonths();

    for (let i = 0, n = months.length; i < n; i++) {
      if (months[i].year !== startYear || months[i].month !== startMonth) {
        continue;
      }

      for (let j = 0, m = months[i].days.length; j < m; j++) {
        if (months[i].days[j].day !== startDay) {
          continue;
        }
        activity.x = months[i].x + j * ConfigSc.cellWidth;
        CpspRef.cmp.copySelectedProject.activities[activityIndex].x =
          activity.x;
        return;
      }
    }

    const diffBetweenStartAndFirstDay = moment(
      `${months[0].year}-${months[0].month}-${months[0].days[0].day}`,
      ConfigSc.dateFormat
    ).diff(activity.startDate, "days");
    activity.x = months[0].x - diffBetweenStartAndFirstDay * ConfigSc.cellWidth;
    CpspRef.cmp.copySelectedProject.activities[activityIndex].x = activity.x;
  }

  addAllDisplayProjectsThatFitContainerView() {
    for (
      let i = this.currentDisplayProjectIndex,
        n = this.getLastProjectIndexToFitInContainerView();
      i < n;
      i++
    ) {
      this.addDisplayProjectToProjectUsersContainer(i);
    }
  }
  getLastProjectIndexToFitInContainerView() {
    const activities = CpspRef.cmp.selectedProject.activities;
    if (activities.length < 1) {
      return 0;
    }
    if (activities.length <= this.currentDisplayProjectIndex) {
      this.setCurrentDisplayProjectIndex(0);
    }
    const maxProjectsAndUsersToDisplayThatFitContainer = Math.ceil(
      (this.getHeight() +
        Math.abs(
          this.momentTableBodyContainer.getInnerContainer().getY() +
            activities[this.currentDisplayProjectIndex].y
        )) /
        ConfigSc.cellHeight
    );
    const n = activities.length;

    let projectsAndUsersDisplayed = 0;

    for (let i = this.currentDisplayProjectIndex; i < n; i++) {
      if (
        projectsAndUsersDisplayed >=
        maxProjectsAndUsersToDisplayThatFitContainer
      ) {
        return i;
      }
      projectsAndUsersDisplayed += activities[i].moments.length + 1;
    }
    return n;
  }

  renderDateSegmentConnections() {
    // this.overlappedUsers = [];
    // const gridCon = CpspRef.cmp.projectSchedulePlanerApp.gridContainer;
    // const canvas = CpspRef.cmp.projectSchedulePlanerApp.mainCanvas;
    // const currentDayX = CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.getCurrentDayContainerX();
    // this.findDateSegmentConnections();
    // const halfWidth = ConfigSc.cellWidth / 2;
    //gridCon.removeAllLineConnections();
    // this.lineConnections.forEach((conn) => {
    //   const overlappedConnections: number[] = [];
    //   for (let i = 0; i < conn.length - 1; i++) {
    //     const start = conn[i];
    //     const end = conn[i + 1];
    //     if (start.y === end.y) {
    //       continue;
    //     }
    //     const startXAndWidth = start.x + start.width;
    //     const endXAndWidth = end.x + end.width;
    //     if (
    //       startXAndWidth > currentDayX &&
    //       endXAndWidth > currentDayX &&
    //       startXAndWidth > end.x
    //     ) {
    //       if (
    //         start.absences.some(
    //           (a) =>
    //             a.x <= currentDayX + halfWidth &&
    //             a.x + a.width >= currentDayX + halfWidth
    //         )
    //       ) {
    //         return;
    //       }
    //       if (startXAndWidth > currentDayX) {
    //         overlappedConnections.push(startXAndWidth);
    //       }
    //       if (endXAndWidth > currentDayX) {
    //         overlappedConnections.push(endXAndWidth);
    //       }
    //       this.overlappedUsers.push({
    //         projectId: start.projectId,
    //         userId: start.userId,
    //       });
    //       this.overlappedUsers.push({
    //         projectId: end.projectId,
    //         userId: end.userId,
    //       });
    //     }
    //   }
    //   for (let i = 0; i < conn.length - 1; i++) {
    //     if (conn[i].y === conn[i + 1].y) {
    //       continue;
    //     }
    //     if (
    //       conn[i].x + conn[i].width > currentDayX &&
    //       conn[i + 1].x + conn[i + 1].width > currentDayX &&
    //       conn[i].x + conn[i].width > conn[i + 1].x
    //     ) {
    //       let minX = Math.min.apply(Math, overlappedConnections);
    //       const newMinX = conn[i].absences.find(
    //         (a) => a.x >= currentDayX + ConfigSc.cellWidth / 2 && a.x <= minX
    //       );
    //       if (newMinX !== undefined) {
    //         minX = newMinX.x;
    //       }
    //       const startLine = new Line(
    //         currentDayX + ConfigSc.cellWidth / 2,
    //         conn[i].y,
    //         minX,
    //         conn[i].y,
    //         canvas
    //       );
    //       startLine.setColor("red");
    //       startLine.setCircleOnEnd();
    //       gridCon.addLineConnection(startLine);
    //       const endLine = new Line(
    //         currentDayX + ConfigSc.cellWidth / 2,
    //         conn[i + 1].y,
    //         minX,
    //         conn[i + 1].y,
    //         canvas
    //       );
    //       endLine.setColor("red");
    //       endLine.setCircleOnEnd();
    //       gridCon.addLineConnection(endLine);
    //       continue;
    //     }
    //     const currentXWidth = conn[i].x + conn[i].width;
    //     const x1GDx2 = currentXWidth > conn[i + 1].x;
    //     const y1GDy2 = conn[i].y > conn[i + 1].y;
    //     const halfY = Math.abs(conn[i].y - conn[i + 1].y) * 0.5;
    //     const cX = currentXWidth + 150 * (y1GDy2 ? -1 : 1);
    //     const cY = x1GDx2
    //       ? conn[i].y + halfY * (y1GDy2 ? -1 : 1)
    //       : conn[i].y - halfY * (y1GDy2 ? 1 : -1);
    //     const curve = new BezierCurve(
    //       currentXWidth,
    //       conn[i].y,
    //       cX,
    //       cY,
    //       conn[i + 1].x,
    //       conn[i + 1].y,
    //       canvas
    //     );
    //     gridCon.addLineConnection(curve);
    //   }
    // });
    // gridCon
    //   .getLineConnections()
    //   .forEach((line) => line.setParent(gridCon.getInnerContainer()));
  }

  // findDateSegmentConnections() {
  //   const connections = {};

  //   const project = CpspRef.cmp.selectedProject;
  //   if (project.id <= 0) {
  //     return;
  //   }

  //   project.activities.forEach(activity => {
  //     activity.moments.forEach((moment) => {
  //     if (!connections[moment.id]) {
  //       connections[moment.id] = [];
  //     }

  //     moment.dateSegments.forEach((dateSegment) => {
  //       connections[moment.id].push({
  //         absences: null,
  //         // moment.absences.map((a) => ({
  //         //   x: a.x,
  //         //   width: a.numberOfDays * ConfigSc.cellWidth,
  //         // })),
  //         projectId: project.id,
  //         userId: moment.id,
  //         width: dateSegment.numberOfDays * ConfigSc.cellWidth,
  //         x: dateSegment.x,
  //         y: activity.y + moment.y + ConfigSc.cellHeight * 1.5,
  //       });
  //     });
  //   });
  //   });

  //   for (const key in connections) {
  //     if (connections[key].length <= 1) {
  //       delete connections[key];
  //     } else {
  //       connections[key]
  //         .sort((a, b) => {
  //           if (a.x < b.x) {
  //             return -1;
  //           }
  //           if (a.x > b.x) {
  //             return 1;
  //           }
  //           return 0;
  //         })
  //         .sort((a, b) => a.x - b.x);
  //     }
  //   }

  //   this.lineConnections = Object.values(connections);
  // }

  renderHighlightedLines(
    container: GenericContainer,
    y: number = 0,
    last: boolean = false,
    selected: boolean = false
  ) {
    this.topY = container.getGlobalY() + y;
    if (selected) {
      const line_above1 = new Line(
        // 0,
        CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer().getX() * (-1) - ConfigSc.sideCanvasSize + 20,
        container.getY(),
        CpspRef.cmp.projectSchedulePlanerApp.gridContainer
          .getInnerContainer()
          .getWidth() - 100,
        container.getY(),
        CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
        CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer()
      );

      line_above1.setColor("#F77E04");
      line_above1.setLineThickness(1.5);
      line_above1.draw();
      const line_bellow1 = new Line(
        // 0,
        CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer().getX() * (-1) - ConfigSc.sideCanvasSize + 20,
        container.getY() + container.getHeight(),
        CpspRef.cmp.projectSchedulePlanerApp.gridContainer
          .getInnerContainer()
          .getWidth(),
        container.getY() + container.getHeight(),
        CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
        CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer()
      );
      line_bellow1.setColor("#F77E04");
      line_bellow1.setLineThickness(1.5);
      line_bellow1.draw();
    } else {
      const line_above = new Line(
        0,
        y,
        container.getWidth(),
        y,
        container.getCanvas(),
        container
      );
      line_above.setColor("#F77E04");
      line_above.setLineThickness(1.5);
      const line_bellow = new Line(
        0,
        container instanceof MomentContainer || last
          ? y + ConfigSc.cellHeight - 1.5
          : selected
          ? y + container.getHeight()
          : y + ConfigSc.cellHeight,
        container.getWidth(),
        container instanceof MomentContainer || last
          ? y + ConfigSc.cellHeight - 1.5
          : selected
          ? y + container.getHeight()
          : y + ConfigSc.cellHeight,
        container.getCanvas(),
        container
      );
      line_bellow.setColor("#F77E04");
      line_bellow.setLineThickness(1.5);
    }
  }


  createSelectedMomentsContainer(x: number, y: number,container = null) {
    CpspRef.cmp.hideColumnValueInput();
    CpspRef.cmp.rowNumberSelecting = true;
    document.body.style.cursor = "crosshair";
    if (this.selectedMomentsContainer) {
      this.canvas.removeChildById(this.selectedMomentsContainer.getId());
      if (this.movingLineIndicator) {
        this.canvas.removeChildById(this.movingLineIndicator.getId());
      }
      this.momentTableBodyContainer
        .getInnerContainer()
        .removeChildById(this.selectedMomentsContainer.getId());
      this.selectedMomentsContainer = null;
      ConfigSc.boxHeight = 0;
      ConfigSc.firstMomentBoxSelectedPositionDelta =
        this.firstMomentBoxSelectedPosition - 75;
      this.firstMomentBoxSelectedPosition += 75;
    }
    CpspRef.cmp.selectedMomentsForStyleChange = [];
    this.selectionBox = new Rectangle(
      container == null ? x : container.getX() + 1,
      y,
      container == null ? 0 : container.getWidth(),
      container == null ? 0 : container.getHeight(),
      this.canvas,
      container == null ? this : container.getParent()
      );
    this.selectionBox.setBackgroundColor("rgba(51,143,255,0.3)");
    this.selectionBox.setBorder("#338FFF", 2);
    this.getChildren().forEach((child) =>
      this.canvas.addDrawingContainer(child)
    );

    this.canvas.getCanvasElement().onmousemove = (e2) => {
      this.firstMove = 1;
      document.body.style.cursor = "crosshair";
      if (this.selectionBox) {
        // if (e.offsetX > this.getWidth()) {
        //   this.selectionBox.setWidth(this.getWidth() - x);
        // } else {
        //   this.selectionBox.setWidth(e.offsetX - x);
        // }
        // if (e.offsetY > ConfigSc.toolboxSize + ConfigSc.topSectionSize)
        //   this.selectionBox.setHeight(e.offsetY - y - ConfigSc.toolboxSize);


        if(e2.offsetY > container.getGlobalY() + ConfigSc.cellHeight){
                    // let newHeight = Math.ceil(e2.offsetY / ConfigSc.cellHeight) * ConfigSc.cellHeight - c.getGlobalY() - 3
                    let newHeight = Math.ceil((e2.offsetY - container.getGlobalY())/ConfigSc.cellHeight) * ConfigSc.cellHeight;
                    this.selectionBox.setY(container.getY());
                    this.selectionBox.setHeight(newHeight)
                    this.canvas.resetDrawingContainers();
                    this.selectionBox.draw()
                  } else if(e2.offsetY < container.getGlobalY()){
                    // let newHeight = c.getGlobalY() + c.getHeight() - Math.floor(e2.offsetY / ConfigSc.cellHeight) * ConfigSc.cellHeight + 3;
                    let newHeight =   Math.ceil(( container.getGlobalY() + container.getHeight() - e2.offsetY)/ConfigSc.cellHeight) * ConfigSc.cellHeight
                    // e2.offsetY - (e2.offsetY % ConfigSc.cellHeight) - c.getGlobalY() + ConfigSc.cellHeight;
                    this.selectionBox.setY(container.getY() - newHeight + ConfigSc.cellHeight);
                    this.selectionBox.setHeight(newHeight)
                    this.canvas.resetDrawingContainers();
                    this.selectionBox.draw()
                  } else {
                    this.selectionBox.setY(container.getY());
                    this.selectionBox.setHeight(container.getHeight())
                    this.canvas.resetDrawingContainers();
                    this.selectionBox.draw()
                  }
      }
    };

    this.canvas.getCanvasElement().onmouseup = (e) => {
      document.body.style.cursor = "default";
      if (this.selectionBox) {
        const boxHeight = this.selectionBox.getHeight();
        const y = this.selectionBox.getY();
        x = this.selectionBox.getX();
        // this.canvas.removeChildById(this.selectionBox.getId());
        container.getParent().removeLastChild();
        this.selectionBox = null;
        ConfigSc.boxHeight = 0;
        this.canvas.endSelection();

        if (boxHeight < 0) this.firstMomentBoxSelectedPosition += boxHeight;
        this.selectedMomentsContainer = new SelectedMomentsContainer(
          x,
          y,
          // this.firstMomentBoxSelectedPosition +
          //   ConfigSc.deltaMovementBetweenBoxes,
          ConfigSc.sideCanvasSize - ConfigSc.sideSectionRightBorderWidth,
          boxHeight < 0 ? boxHeight * -1 : boxHeight,
          this.canvas,
          this.momentTableBodyContainer.getInnerContainer()
        );

        if (boxHeight < 0) {
          this.selectedMomentsContainer.setY(
            this.selectedMomentsContainer.getY() -
              (this.selectedMomentsContainer.getSelectedMoments().length - 1) *
                ConfigSc.cellHeight
          );
        }
        // this.selectedMomentsContainer.setBorder("red",3)
        // this.canvas.resetDrawingContainers();
        // this.drawSelectedContainer();
        this.refreshDisplay()
        this.selectedMomentsContainer.draw();
        // this.drawSelectedContainer();
        this.canvas.addChild(this.selectedMomentsContainer);
      }
      this.selectedMomentsContainer.setOnMouseHoverHandler(() => document.body.style.cursor = "move")
      this.selectedMomentsContainer.setOnMouseDownHandler(() => {
        // let activitiesMoved = false;
        if ( this.selectedMomentsContainer &&
          this.checkIfSelectedIsActivity(
            this.selectedMomentsContainer.getSelectedMoments()
          )
        ) {
          let movingLineDirection = false;
          document.body.style.cursor = "move";
          this.movingLineIndicator = new MovingLineIndicator(
            this.selectedMomentsContainer.getX(),
            this.selectedMomentsContainer.getY(),
            "100%",
            ConfigSc.cellHeight * 2,
            this.canvas,
            this.momentTableBodyContainer.getInnerContainer()
          );

          this.canvas.addChild(this.movingLineIndicator);
          this.canvas.getChildren().forEach((child) => {
            this.canvas.addDrawingContainer(child);
          });

          this.canvas.getCanvasElement().onmousemove = (ev) => {
            if (!movingLineDirection && ev.movementY < -1) {
              movingLineDirection = true;
              this.movingLineIndicator.move(
                -this.selectedMomentsContainer.getHeight()
              );
            }
            if (ev.movementY != 0) {
              document.body.style.cursor = "move";
              this.throttle(() => {
                this.movingLineIndicator.move(ev.movementY);
              }, 100)();

              // activitiesMoved = true;
            }
          };
        } else {
          // if (e.shiftKey) {

          ConfigSc.deltaMovementBetweenBoxes =
            Math.floor(
              (e.offsetY -
                this.selectedMomentsContainer.getY() -
                ConfigSc.topSectionSize -
                ConfigSc.toolboxSize) /
                ConfigSc.cellHeight
            ) * ConfigSc.cellHeight;

          ConfigSc.firstMomentBoxSelectedPositionDelta =
            this.selectedMomentsContainer.getY();

          // }
          // this.movingLineIndicator = new MovingLineIndicator(
          //   this.selectedMomentsContainer.getX() + ConfigSc.cellHeight * 2,
          //   this.selectedMomentsContainer.getHeight() - ConfigSc.cellHeight,
          //   "100%",
          //   ConfigSc.cellHeight * 2,
          //   this.canvas,
          //   this.selectedMomentsContainer
          // );

          // this.canvas.addChild(this.movingLineIndicator);
          // this.canvas.getChildren().forEach((child) => {
          //   this.canvas.addDrawingContainer(child);
          // });

          this.canvas.removeChildById(this.selectedMomentsContainer.getId());

          let firstMove = 0;
          this.canvas.getCanvasElement().onmousemove = (ev) => {
            if (ev.movementY != 0 && firstMove == 0) {
              //document.body.style.cursor = "crosshair";
              this.firstMomentBoxSelectedPosition =
                ev.clientY - ConfigSc.toolboxSize;
              ConfigSc.deltaMovementBetweenBoxes = 0;
              //this.createSelectedMomentsContainer(ev.offsetX, ev.offsetY - ConfigSc.toolboxSize);
              this.createSelectedMomentsContainer(
                ev.clientX - ConfigSc.sidebarSize,
                ev.clientY - ConfigSc.toolboxSize
              );
              firstMove = 1;
              this.refreshDisplay();
            }
          };
        }
        this.addRemoveEventsForMouseDownEvent((e2) => {
          document.body.style.cursor = "default";
          CpspRef.cmp.rowNumberHover = false;
          if (e.screenY === e2.screenY) {
            this.canvas.removeChildById(this.movingLineIndicator.getId());
            this.refreshDisplay();
            this.canvas.resetDrawingContainers();
            return;
          }

          let momentsInBox =
            this.selectedMomentsContainer.getSelectedMoments();
          if (momentsInBox.length == 0) {
            this.canvas.resetDrawingContainers();
            this.refreshDisplay();
            this.canvas.removeChildById(this.selectedMomentsContainer.getId());
            if (this.movingLineIndicator)
              this.canvas.removeChildById(this.movingLineIndicator.getId());
            return;
          }

          let allIsMoments = true;
          const mY = this.movingLineIndicator.getY();

          if(momentsInBox.at(0).state_number == undefined){
            this.onDropActivity(mY)
          } else {
            momentsInBox.forEach((m) => {

              if(!m.state_number){
                allIsMoments = false;
              }
            })
            if(allIsMoments){
              this.onDropMoment(mY);

            } else {
              CpspRef.cmp.toastrMessage(
                "info",
                CpspRef.cmp
                .getTranslate()
                .instant("Please slect only moments or group/activity!")
              );
            }
          }



          // if (
          //   activitiesMoved &&
          //   this.movingLineIndicator.getGlobalY() !=
          //     Number(this.selectedMomentsContainer.getGlobalY()) +
          //       Number(this.selectedMomentsContainer.getHeight()) -
          //       ConfigSc.cellHeight
          // ) {
          //   let broj = 0;

          //   momentsInBox.forEach((m) => {
          //     let newYSelectedContainer = 0;
          //     if (m.planId == null) {
          //       if (this.movingLineIndicator.getY() > 0) {
          //         //if(broj == momentsInBox.length - 1)
          //         this.onDropActivity(
          //           [m],
          //           this.movingLineIndicator.getY() //- broj * ConfigSc.cellHeight
          //         );
          //         newYSelectedContainer =
          //           CpspRef.cmp.selectedProject.activities.find(
          //             (a) => a.id == momentsInBox[0].activityId
          //           ).y;
          //         //if(broj == momentsInBox.length - 1)
          //         this.selectedMomentsContainer.setY(newYSelectedContainer);
          //       } else {
          //         if (broj == 0)
          //           newYSelectedContainer =
          //             CpspRef.cmp.selectedProject.activities.find(
          //               (a) => a.id == m.activityId
          //             ).y;
          //         this.onDropActivity([m], this.movingLineIndicator.getY());
          //         if (broj == 0)
          //           this.selectedMomentsContainer.setY(
          //             this.selectedMomentsContainer.getY() +
          //               (CpspRef.cmp.selectedProject.activities.find(
          //                 (a) => a.id == m.activityId
          //               ).y -
          //                 newYSelectedContainer)
          //           );
          //       }
          //     }

          //     broj++;
          //   });
          // }

          // const mY = this.movingLineIndicator.getY();
          // const currentProject = CpspRef.cmp.selectedProject;

          // const maxY = currentProject.[currentProject.users.length - 1].y;
          // historySchedulePlaner.addToQueue(
          //   () => true,
          //   () => true
          // );

          // if (this.movingLineIndicator.getY() < 0) {
          //   usersInBox.sort((a, b) => {
          //     return b.userY - a.userY;
          //   });
          // }
          // usersInBox.forEach((user, index) => {
          //   currentProject.users = currentProject.users.sort(
          //     (a, b) => a.sortIndex - b.sortIndex
          //   );
          //   const userIndex = currentProject.users.findIndex(
          //     (u) => u.id == user.userId
          //   );
          //   if (userIndex == -1) {
          //     return;
          //   }

          // if (uIndex == -1) {
          //   this.onDropUser(
          //     null,
          //     userIndex,
          //     currentUserProjectIndex,
          //     maxY,
          //     true
          //   );
          // } else {
          //   this.onDropUser(
          //     null,
          //     userIndex,
          //     currentUserProjectIndex,
          //     mY +
          //       currentProject.users[userIndex].y +
          //       ConfigSc.cellHeight *
          //         (mY > 0 ? -index : index - usersInBox.length + 1),
          //     true
          //   );
          // }
          // });
          // this.enumerateUnmovedUsers();

          // history.appendToQueueGroup(
          //   () => true,
          //   () => true
          // ); // needs to be here to store state for redo
          this.canvas.removeChildById(this.selectedMomentsContainer.getId());
          if (this.movingLineIndicator)
            this.canvas.removeChildById(this.movingLineIndicator.getId());
          // this.selectedMomentsContainer = null;
          this.canvas.resetDrawingContainers();
          this.refreshDisplay();

        });
      });

      this.canvas.getCanvasElement().onmousemove = null;
      // this.refreshDisplay();
    };
  }

  createSelectedMomentsContainerColumns(c: ProjectColumn, column){
    CpspRef.cmp.hideColumnValueInput();
    document.body.style.cursor = "crosshair";
    if (this.selColumn) {
      this.canvas.removeChildById(this.selColumn.getId());
      if (this.movingLineIndicator) {
        this.canvas.removeChildById(this.movingLineIndicator.getId());
      }
      this.momentTableBodyContainer
        .getInnerContainer()
        .removeChildById(this.selColumn.getId());
      this.selColumn = null;
      ConfigSc.boxHeight = 0;
      ConfigSc.firstMomentBoxSelectedPositionDelta =
        this.firstMomentBoxSelectedPosition - 75;
      this.firstMomentBoxSelectedPosition += 75;
    }

    CpspRef.cmp.selectedMomentsForStyleChange = [];
    let x = c.getX()
    let y = c.getY()
    this.selectionBox = new Rectangle(
      c.getX(),
      c.getY() + ConfigSc.toolboxSize,
      0,
      0,
      this.canvas,
      this
      );
    this.selectionBox.setBackgroundColor("rgba(51,143,255,0.3)");
    this.selectionBox.setBorder("#338FFF", 2);
    this.getChildren().forEach((child) =>
      this.canvas.addDrawingContainer(child)
    );


    // let nowCol = CpspRef.cmp.visibleColumns.findIndex(col => col.key == column.key);

    this.canvas.getCanvasElement().onmousemove = (e) => {
      document.body.style.cursor = "crosshair";
      if (this.selectionBox) {
        if (e.offsetX > this.getWidth()) {
          this.selectionBox.setWidth(this.getWidth() - x);
        } else {
          this.selectionBox.setWidth(e.offsetX - x);
        }
        if (e.offsetY > ConfigSc.toolboxSize + ConfigSc.topSectionSize)
          this.selectionBox.setHeight(e.offsetY - y - ConfigSc.toolboxSize);
      }
    };

    this.canvas.getCanvasElement().onmouseup = (e) => {
      document.body.style.cursor = "default";

      // if (this.selectionBox) {
      //   const boxHeight = this.selectionBox.getHeight();
      //   this.removeChildById(this.selectionBox.getId());
      //   this.selectionBox = null;
      //   ConfigSc.boxHeight = 0;
      //   this.canvas.endSelection();

      //   if (boxHeight < 0) this.firstMomentBoxSelectedPosition += boxHeight;
      //   this.selectedMomentsContainer = new SelectedMomentsContainer(
      //     x,
      //     this.firstMomentBoxSelectedPosition +
      //       ConfigSc.deltaMovementBetweenBoxes,
      //     ConfigSc.sideCanvasSize - ConfigSc.sideSectionRightBorderWidth,
      //     boxHeight < 0 ? boxHeight * -1 : boxHeight,
      //     this.canvas,
      //     this.momentTableBodyContainer.getInnerContainer()
      //   );

      //   if (boxHeight < 0) {
      //     this.selectedMomentsContainer.setY(
      //       this.selectedMomentsContainer.getY() -
      //         (this.selectedMomentsContainer.getSelectedMoments().length - 1) *
      //           ConfigSc.cellHeight
      //     );
      //   }
      //   this.selectedMomentsContainer.draw();
      //   this.canvas.addChild(this.selectedMomentsContainer);
      // }

      this.canvas.getCanvasElement().onmousemove = null;
      this.refreshDisplay();
    }

      this.canvas.getCanvasElement().onmousemove = null;
      this.refreshDisplay();
  }

  createSelectedMomentsContainerOnGrid(x: number, y: number, parent,activity) {
    CpspRef.cmp.hideColumnValueInput();
      this.selectionBox = new Rectangle(
        x,
        y,
        0,
        ConfigSc.cellHeight,
        this.canvas,
        parent
      );
      this.selectionBox.setBackgroundColor("yellow")


      this.canvas.addDrawingContainer(parent.getParent().getParent())

    // this.getChildren().forEach((child) =>
    //   this.canvas.addDrawingContainer(child)
    // );

    this.canvas.getCanvasElement().onmousemove = (e) => {
      document.body.style.cursor = "crosshair";
      this.selectionBox.setWidth(this.selectionBox.getWidth() + e.movementX)
    };

    this.canvas.getCanvasElement().onmouseup = (e) => {
      document.body.style.cursor = "default";
      if (this.selectionBox) {
        this.highlightedRow = (this.selectionBox.getParent().getY() + ConfigSc.cellHeight + y) / ConfigSc.cellHeight
        // const boxHeight = this.selectionBox.getHeight();
        const boxWidth = this.selectionBox.getWidth();
        this.removeChildById(this.selectionBox.getId());
        this.selectionBox = null;
        ConfigSc.boxHeight = 0;
        this.canvas.endSelection();

        const date = momentM(CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findDateByXPosition(x));

        let numberDays = Math.ceil(boxWidth/(ConfigSc.cellWidth * CpspRef.cmp.pixelRation)) - 1;

        while(CpspRef.cmp.isWeekend(date)){
          date.add(1,"days");
          numberDays--;
        }

        if(numberDays < 0){
          this.canvas.getCanvasElement().onmousemove = null;
          this.refreshDisplay();
          return;
        }

        if(y == 0){
          activity.description = CpspRef.cmp.getTranslate().instant("New moment");
          activity.changed = true;
          if (activity.startDate == null) {
            activity.startDate = date.format(ConfigSc.dateFormat);
            activity.dateSegments[0].startDate = date.format(ConfigSc.dateFormat);
            activity.x =
              CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
                new Date(activity.startDate)
              );
          }
          if (activity.endDate == null) {
            date.add(numberDays,"days").format(ConfigSc.dateFormat);
            while(CpspRef.cmp.isWeekend(date)){
              date.add(-1,"days");
              numberDays--;
            }

            activity.endDate = date.format(ConfigSc.dateFormat);
            activity.dateSegments[0].endDate = activity.endDate
            activity.numberOfDays = numberDays + 1;
          }

          let activityCp = CpspRef.cmp.copySelectedProject.activities.find(a => a.id == activity.id);
          activityCp.description = activity.description;
          activityCp.startDate = activity.startDate;
          activityCp.dateSegments[0].startDate = activity.dateSegments[0].startDate;
          activityCp.x = activity.x;
          activityCp.endDate = activity.endDate;
          activityCp.dateSegments[0].endDate = activity.dateSegments[0].endDate;
          activityCp.numberOfDays = activity.numberOfDays;
          activityCp.changed = true;
        } else{
          const indexOfMoment = (y/ConfigSc.cellHeight) - 1;
          activity.moments.at(indexOfMoment).name = CpspRef.cmp.getTranslate().instant("New moment");
          activity.changed = true;
          activity.moments.at(indexOfMoment).changed = true;
          if (activity.moments.at(indexOfMoment).start_date == null) {
            activity.moments.at(indexOfMoment).start_date = date.format(ConfigSc.dateFormat);
            activity.moments.at(indexOfMoment).dateSegments[0].startDate = date.format(ConfigSc.dateFormat);
            // activity.x =
            //   CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
            //     new Date(activity.startDate)
            //   );
          }
          if (activity.moments.at(indexOfMoment).end_date == null) {
            date.add(numberDays,"days").format(ConfigSc.dateFormat);
            while(CpspRef.cmp.isWeekend(date)){
              date.add(-1,"days");
              numberDays--;
            }

            activity.moments.at(indexOfMoment).end_date = date.format(ConfigSc.dateFormat);
            activity.moments.at(indexOfMoment).dateSegments[0].endDate = activity.moments.at(indexOfMoment).end_date;
            activity.moments.at(indexOfMoment).dateSegments[0].numberOfDays = numberDays + 1;
          }

          CpspRef.cmp.updateParent(activity,activity.moments.at(indexOfMoment));


          let activityCp = CpspRef.cmp.copySelectedProject.activities.find(a => a.id == activity.id);
          activityCp.moments.at(indexOfMoment).name = activity.moments.at(indexOfMoment).name;
          activityCp.moments.at(indexOfMoment).start_date = activity.moments.at(indexOfMoment).start_date;
          activityCp.moments.at(indexOfMoment).dateSegments[0].startDate = activity.moments.at(indexOfMoment).dateSegments[0].startDate;
          // activityCp.moments.at(indexOfMoment).x = activity.x;
          activityCp.moments.at(indexOfMoment).end_date = activity.moments.at(indexOfMoment).end_date;
          activityCp.moments.at(indexOfMoment).dateSegments[0].endDate = activity.moments.at(indexOfMoment).end_date;
          activityCp.moments.at(indexOfMoment).dateSegments[0].numberOfDays = activity.moments.at(indexOfMoment).dateSegments[0].numberOfDays;
          activityCp.changed = true;
          activityCp.moments.at(indexOfMoment).changed = true;
          CpspRef.cmp.updateParent(activityCp,activityCp.moments.at(indexOfMoment));
        }



        historySchedulePlaner.addToQueue(
          () => true,
          () => true
        );
      }
      this.canvas.getCanvasElement().onmousemove = null;
      if(CpspRef.cmp.moveTape == undefined)
      this.refreshDisplay();
    };

    // this.canvas.getCanvasElement().onmousemove = null;
    // this.refreshDisplay();
  }

  private throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function () {
      const context = this;
      const args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function () {
          if (Date.now() - lastRan >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }

  tabPress(right: boolean = false, left: boolean = false) {
    CpspRef.cmp.tabPress = true;
    let activity_ind = CpspRef.cmp.selectedProject.activities.findIndex(
      (a) => a.id == CpspRef.cmp.activityIndex
    );
    let activity = CpspRef.cmp.selectedProject.activities[activity_ind];
    if (activity == undefined) return;
    let m: Moment = null;
    let m_ind = activity.moments.findIndex(
      (m) => m.id == CpspRef.cmp.planIndex
    );
    if (CpspRef.cmp.planIndex != null) {
      m = activity.moments[m_ind];
    }
    let sortColumn;
    if (this.selColumn != undefined || this.selColumn != null) {
      sortColumn = CpspRef.cmp.visibleColumns.findIndex(
        (c) => c.id == this.selColumn.id
      );
    } else {
      sortColumn = CpspRef.cmp.visibleColumns.findIndex(
        (c) => c.id == CpspRef.cmp.selectedColumnForEditing.id
      );
    }
    if (sortColumn == 0 && left) return;
    if (
      CpspRef.cmp.selectedColumnForEditing.key == "Details" &&
      m == null &&
      CpspRef.cmp.inputValue == null
    ) {
      this.arrowDownORArrowUPPress(true);
      return;
    }
    sortColumn = left ? sortColumn - 1 : sortColumn + 1;
    let oldIndex = left ? sortColumn + 1 : sortColumn - 1;
    if (sortColumn == CpspRef.cmp.visibleColumns.length && right) {
      return;
    }

    this.selColumn;
    //let needMove = false;
    //hide prevous input
    if (CpspRef.cmp.columnValueInput.style.display == "block") {
      if (this.selColumn != undefined || this.selColumn != null)
        CpspRef.cmp.selectedColumnForEditing = this.selColumn;
      CpspRef.cmp.hideColumnValueInput();
      // this.marginLeft += ConfigSc.cellHeight;
      // this.marginTop += 10;
      //document.getElementById("columnValueEditInput1").blur();
    } else if (CpspRef.cmp.planInput.style.display == "block") {
      if (this.selColumn != undefined || this.selColumn != null)
        CpspRef.cmp.selectedColumnForEditing = this.selColumn;
      CpspRef.cmp.planInput.blur();
    } else if (CpspRef.cmp.resourceWeekInput.style.display == "block") {
      if (this.selColumn != undefined || this.selColumn != null) {
        CpspRef.cmp.selectedColumnForEditing = this.selColumn;
      }
      CpspRef.cmp.resourceWeekInput.blur();
    } else if (CpspRef.cmp.newColumnValueInput.style.display == "block") {
      if (this.selColumn != undefined || this.selColumn != null)
        CpspRef.cmp.selectedColumnForEditing = this.selColumn;
      CpspRef.cmp.newColumnValueInput.blur();
    }
    const datepicker = $("#columnStartDateInput") as any;
    datepicker.datepicker("hide");
    const datepicker2 = $("#columnEndDateInput") as any;
    datepicker2.datepicker("hide");

    while (true) {
      this.selColumn = CpspRef.cmp.visibleColumns[sortColumn];
      if (oldIndex != -1) {
        !left
          ? (this.marginLeft += CpspRef.cmp.visibleColumns[oldIndex].width)
          : (this.marginLeft -= CpspRef.cmp.visibleColumns[sortColumn].width);
      }

      // for column who can use tab
      if (sortColumn < CpspRef.cmp.visibleColumns.length) {
        if (
          this.selColumn.key == "Details" ||
          this.selColumn.key == "part" ||
          this.selColumn.key == "plan" ||
          this.selColumn.key == null
        )
          break;
        else if (
          //for fake activity
          (m_ind == -1 && activity.moments.length == 0) ||
          (m_ind > -1 &&
            activity.moments[m_ind].percentage_of_realized_plan == null)
        )
          break;
        else {
          sortColumn++;
          oldIndex = sortColumn - 1;
        }
      } else {

        if (
          activity.moments.length > 0 &&
          m_ind < activity.moments.length - 1
        ) {
          CpspRef.cmp.planIndex = activity.moments[m_ind + 1].id;
          m_ind++;
          // CpspRef.cmp.selectedColumnForEditing = CpspRef.cmp.visibleColumns.at(0);
        } else {
          if(this.moveToDetails(
            m_ind,
            activity_ind,
            activity,
            true,
            // this.selColumn.key
            CpspRef.cmp.selectedColumnForEditing.key
          )){
            // this.arrowDownORArrowUPPress(false);
            return;
          }
          CpspRef.cmp.activityIndex =
            CpspRef.cmp.selectedProject.activities[activity_ind + 1].id;
          CpspRef.cmp.planIndex = null;
          activity_ind++;
          activity = CpspRef.cmp.selectedProject.activities[activity_ind];

        }
        //CpspRef.cmp.activityIndex = Number(activity.id);
        //CpspRef.cmp.planIndex = null;

        // new row
        this.highlightedRow++; // = rowNumber;
        sortColumn = 0;
        oldIndex = -1;
        this.marginLeft =
          CpspRef.cmp.visibleColumns.at(0).x +
          this.rowNumberContainer.getWidth() - 25;
        this.marginTop += ConfigSc.cellHeight;
      }
    }

    const endSlider = Math.ceil(
      this.getMomentTableBodyContainer()
        .getHorizontalScrollbar()
        .getSlider()
        .getX() +
        this.getMomentTableBodyContainer()
          .getHorizontalScrollbar()
          .getSlider()
          .getWidth()
    );
    const h =
      this.getMomentTableBodyContainer()
        .getHorizontalScrollbar()
        .getSlider()
        .getX() == 0
        ? this.getWidth() + ConfigSc.cellHeight + 15
        : this.getWidth() +
          ConfigSc.cellHeight +
          this.getMomentTableBodyContainer()
            .getHorizontalScrollbar()
            .getSlider()
            .getX();
    //need move scroll right
    if (
      sortColumn < CpspRef.cmp.visibleColumns.length - 1 &&
      this.getMomentTableBodyContainer().getHorizontalScrollbar().getWidth() >
        endSlider &&
      CpspRef.cmp.visibleColumns[sortColumn].x +
        CpspRef.cmp.visibleColumns[sortColumn].width >
        h
    ) {
      const move_x =
        CpspRef.cmp.visibleColumns[CpspRef.cmp.visibleColumns.length - 1].x +
        CpspRef.cmp.visibleColumns[CpspRef.cmp.visibleColumns.length - 1]
          .width -
        (this.getMomentTableBodyContainer()
          .getHorizontalScrollbar()
          .getSlider()
          .getWidth() +
          40);
      //needMove = true;
      this.getMomentTableBodyContainer()
        .getHorizontalScrollbar()
        .getSlider()
        .move(move_x);
      const leftShift = Math.ceil(
        (this.getMomentTableBodyContainer()
          .getHorizontalScrollbar()
          .getSlider()
          .getX() /
          this.getMomentTableBodyContainer()
            .getHorizontalScrollbar()
            .getSlider()
            .getWidth()) *
          (this.getWidth() - 40 - 15)
      );
      this.refreshDisplay();
      this.marginLeft -= leftShift - 3;
    }

    // let needMoveLeft = false;
    // if(sortColumn == 0 &&  this.getMomentTableBodyContainer().getHorizontalScrollbar().getSlider().getX()>0){
    if (
      (left &&
        this.getMomentTableBodyContainer()
          .getHorizontalScrollbar()
          .getSlider()
          .getX() +
          30 +
          this.selColumn.width >
          this.selColumn.x) ||
      (sortColumn == 0 &&
        this.getMomentTableBodyContainer()
          .getHorizontalScrollbar()
          .getSlider()
          .getX() > 0)
    ) {
      // needMoveLeft = true;
      const move_x_left = -this.getMomentTableBodyContainer()
        .getHorizontalScrollbar()
        .getSlider()
        .getX();
      this.getMomentTableBodyContainer()
        .getHorizontalScrollbar()
        .getSlider()
        .move(move_x_left);
      // this.marginLeft = CpspRef.cmp.visibleColumns[1].x + 25 - CpspRef.cmp.visibleColumns[0].width;
      this.marginLeft = CpspRef.cmp.visibleColumns[sortColumn].x + 25;
      this.refreshDisplay();
    }
    // if(sortColumn < CpspRef.cmp.visibleColumns.length && CpspRef.cmp.visibleColumns[sortColumn].x + CpspRef.cmp.visibleColumns[sortColumn].width > Math.ceil(Number(String(this.getMomentTableBodyContainer().getHorizontalScrollbar().getWidth()).replace("px","")) +  this.getMomentTableBodyContainer().getHorizontalScrollbar().getSlider().getX())){

    //     const move_x = CpspRef.cmp.visibleColumns[CpspRef.cmp.visibleColumns.length-1].x + CpspRef.cmp.visibleColumns[CpspRef.cmp.visibleColumns.length-1].width - (this.getMomentTableBodyContainer().getHorizontalScrollbar().getSlider().getWidth() + 40)
    //     //needMove = true;
    //     this.getMomentTableBodyContainer().getHorizontalScrollbar().getSlider().move(move_x)
    //     this.refreshDisplay();
    //   }

    if (this.selColumn.key == "Details") {
      if (left) {
        if (this.selColumn != undefined || this.selColumn != null)
          CpspRef.cmp.selectedColumnForEditing = this.selColumn;
        // this.marginTop -= 10;
        // this.marginLeft -= 25;
      }
      //  else if((m_ind != 0 && needMoveLeft) || (m_ind == 0 && CpspRef.cmp.selectedColumnForEditing.key == null)){
      //   this.marginLeft -= 25;
      // }
      //CpspRef.cmp.columnValueInput.style.top = `${Number(CpspRef.cmp.planInput.style.top.replace("px",""))+ConfigSc.cellHeight/2 + 2.5}px`;
      CpspRef.cmp.columnValueInput.style.top = `${this.marginTop}px`;
      //CpspRef.cmp.inputValue = activity.description;
      //marginLeft of sideSection
      this.marginLeft += 20 + 25;
      this.showInput(this.marginLeft, true);
      // document.getElementById("columnValueEditInput1").focus();
      this.refreshDisplay();
      CpspRef.cmp.columnValueInput.style.display = "block";
      CpspRef.cmp.detailsBlurWithEnter = false;
    } else if (this.selColumn.key == "plan" || this.selColumn.key == "part") {
      if (this.selColumn.key == "part")
        CpspRef.cmp.planInput.value = m == null ? activity.part : m.part;
      else CpspRef.cmp.planInput.value = m == null ? activity.plan : m.plan;

      //CpspRef.cmp.planInput.style.top = `${Number(CpspRef.cmp.columnValueInput.style.top.replace("px",""))+ConfigSc.cellHeight/2 - 2.5}px`;
      //this.marginLeft += CpspRef.cmp.visibleColumns[oldIndex].width;
      CpspRef.cmp.planInput.style.top = `${this.marginTop}px`;
      this.showInput(this.marginLeft, true);
    } else if (this.selColumn.key == "days") {
      CpspRef.cmp.resourceWeekInput.value =
        m == null
          ? CpspRef.cmp
              .getAllDaysOfMoment(activity)
              .toString()
          : CpspRef.cmp
              .getAllDaysOfMoment(m)
              .toString();
      CpspRef.cmp.resourceWeekInput.style.top = `${this.marginTop}px`;
      //CpspRef.cmp.resourceWeekInput.style.left = `${Number(CpspRef.cmp.planInput.style.left.replace("px","")) + CpspRef.cmp.visibleColumns[sortColumn-1].width}px`;
      //this.selColumn = CpspRef.cmp.visibleColumns[sortColumn];
      // this.marginLeft += CpspRef.cmp.visibleColumns[oldIndex].width;
      this.showInput(this.marginLeft, true);
    } else if (this.selColumn.key == "start_date") {
      if (m == null)
        this.setColumnDoubleClickHandler(
          null,
          CpspRef.cmp.visibleColumns[sortColumn],
          activity.id,
          null,
          moment(activity.startDate).format(ConfigSc.dateRevFormat)
        );
      else
        this.setColumnDoubleClickHandler(
          null,
          CpspRef.cmp.visibleColumns[sortColumn],
          activity.id,
          m.id,
          moment(m.start_date).format(ConfigSc.dateRevFormat)
        );
    } else if (this.selColumn.key == "end_date") {
      if (m == null)
        this.setColumnDoubleClickHandler(
          null,
          CpspRef.cmp.visibleColumns[sortColumn],
          activity.id,
          null,
          moment(activity.endDate).format(ConfigSc.dateRevFormat)
        );
      else
        this.setColumnDoubleClickHandler(
          null,
          CpspRef.cmp.visibleColumns[sortColumn],
          activity.id,
          m.id,
          moment(m.end_date).format(ConfigSc.dateRevFormat)
        );
    } else if (this.selColumn.key == "hours") {
      CpspRef.cmp.resourceWeekInput.value =
        m == null
          ? activity.time != null
            ? activity.time.toString()
            : "0"
          : m.time != null
          ? m.time.toString()
          : "0";
      CpspRef.cmp.resourceWeekInput.style.top = `${this.marginTop}px`;
      // this.marginLeft += CpspRef.cmp.visibleColumns[oldIndex].width;
      this.showInput(this.marginLeft, true);
    } else if (
      this.selColumn.key == "resource" ||
      this.selColumn.key == "finished"
    ) {
      if (this.selColumn.key == "resource")
        CpspRef.cmp.resourceWeekInput.value =
          m == null && activity.moments.length == 0
            ? activity.number_of_workers != null
              ? activity.number_of_workers.toString()
              : "0"
            : m.number_of_workers != null
            ? m.number_of_workers.toString()
            : "0";
      else
        CpspRef.cmp.resourceWeekInput.value =
          m == null && activity.moments.length == 0
            ? activity.dateSegments[0].finishedTime != null
              ? activity.dateSegments[0].finishedTime.toString()
              : "0"
            : m.dateSegments[0].finishedTime.toString();
      CpspRef.cmp.resourceWeekInput.style.top = `${this.marginTop}px`;
      // const x = needMove ?
      //     Number(CpspRef.cmp.resourceWeekInput.style.left.replace("px","")) + CpspRef.cmp.visibleColumns[sortColumn-1].width :
      //     Number(CpspRef.cmp.resourceWeekInput.style.left.replace("px","")) + CpspRef.cmp.visibleColumns[sortColumn-1].width;
      // this.marginLeft += CpspRef.cmp.visibleColumns[oldIndex].width;
      this.showInput(this.marginLeft, true);
    } else if (this.selColumn.key == null) {
      CpspRef.cmp.newColumnValueInput.style.top = `${this.marginTop}px`;
      this.showInput(this.marginLeft, true);
      CpspRef.cmp.newColumnValueInput.style.display = "block";
      CpspRef.cmp.newColumnValueInput.focus();
      CpspRef.cmp.newColumnValueInput.select();
      this.refreshDisplay();
    }

    CpspRef.cmp.indexOfVisibleColumn = sortColumn;
    /*if(CpspRef.cmp.selectedColumnForEditing.key == "Details" ){
      if(CpspRef.cmp.columnValueInput.style.display == "block"){
        CpspRef.cmp.hideColumnValueInput()
        //document.getElementById("columnValueEditInput1").blur();
      }
      // CpspRef.cmp.planInput.style.display = "block";
      // CpspRef.cmp.planInput.style.textAlign = "left";
      // CpspRef.cmp.planInput.style.width = `${CpspRef.cmp.visibleColumns[sortColumn].width}px`;
      // CpspRef.cmp.planInput.style.height = `${ConfigSc.cellHeight}px`;
      // CpspRef.cmp.planInput.style.border = "3px solid #F77E04";
      CpspRef.cmp.planInput.value = m == null ? activity.part : m.part;
      CpspRef.cmp.planInput.style.top = `${Number(CpspRef.cmp.columnValueInput.style.top.replace("px",""))+ConfigSc.cellHeight/2 - 2.5}px`;
      // let x=CpspRef.cmp.visibleColumns[sortColumn].x;
      // CpspRef.cmp.planInput.style.left = `${x}px`;
      // CpspRef.cmp.planInput.focus();
      // CpspRef.cmp.planInput.select();
      CpspRef.cmp.selectedColumnForEditing = CpspRef.cmp.visibleColumns[sortColumn];
      this.showInput();
    } else if(CpspRef.cmp.selectedColumnForEditing.key == "part"){
      if(CpspRef.cmp.planInput.style.display == "block"){
        CpspRef.cmp.planInput.blur();
      }
      // CpspRef.cmp.planInput.style.display = "block";
      // CpspRef.cmp.planInput.style.textAlign = "left";
      // CpspRef.cmp.planInput.style.width = `${CpspRef.cmp.visibleColumns[sortColumn].width}px`;
      // CpspRef.cmp.planInput.style.height = `${ConfigSc.cellHeight}px`;
      // CpspRef.cmp.planInput.style.border = "3px solid #F77E04";
      CpspRef.cmp.planInput.value = m == null ? activity.plan : m.plan;
      //CpspRef.cmp.planInput.style.top = ;
      //const x = ConfigSc.sidebarSize + CpspRef.cmp.visibleColumns[sortColumn].x + CpspRef.cmp.visibleColumns[sortColumn].width - this.getMomentTableBodyContainer().getHorizontalScrollbar().getSlider().getX();
      // let x=ConfigSc.sidebarSize+CpspRef.cmp.visibleColumns[sortColumn].x+CpspRef.cmp.visibleColumns[sortColumn].width/2+ConfigSc.appSidePadding;
      // CpspRef.cmp.planInput.style.left = `${x}px`
      // //`${x}px`;
      // CpspRef.cmp.planInput.focus();
      // CpspRef.cmp.planInput.select();
      CpspRef.cmp.selectedColumnForEditing = CpspRef.cmp.visibleColumns[sortColumn];
      this.showInput();
    } else if(CpspRef.cmp.selectedColumnForEditing.key == "plan"){

      //if next input in details
      if((activity.moments.length > 0 && m == null) || (m!= null && m.percentage_of_realized_plan != null)){
        // CpspRef.cmp.columnValueInput.style.display = "block";
        // CpspRef.cmp.columnValueInput.style.textAlign = "left";
        // CpspRef.cmp.columnValueInput.style.width = `${CpspRef.cmp.visibleColumns[0].width}px`;
        // CpspRef.cmp.columnValueInput.style.height = `${ConfigSc.cellHeight}px`;
        // CpspRef.cmp.columnValueInput.style.border = "3px solid #F77E04";
        CpspRef.cmp.columnValueInput.style.top = `${Number(CpspRef.cmp.planInput.style.top.replace("px",""))+ConfigSc.cellHeight/2 + 2.5}px`;
        // const x = ConfigSc.sidebarSize + ProjectMomentsTableHead.threeVerticalDotsColumnWidth;
        // CpspRef.cmp.columnValueInput.style.left = `${x}px`;
        // CpspRef.cmp.columnValueInput.style.pointerEvents = "auto"
        // CpspRef.cmp.deleteDetails = true;
        // //CpspRef.cmp.columnValueInput.focus();
        // //CpspRef.cmp.columnValueInput.select();

        // document.getElementById("columnValueEditInput1").style.display = "block"
        // document.getElementById("columnValueEditInput1").style.textAlign = "left";
        // document.getElementById("columnValueEditInput1").focus();
        // document.getElementById("selectValue").style.display = "block"
        CpspRef.cmp.inputValue = activity.description;

        if(activity.moments.length > 0 && m_ind < activity.moments.length - 1  ){
          CpspRef.cmp.planIndex = activity.moments[m_ind + 1].id;
          CpspRef.cmp.columnValueInput.value = activity.moments[m_ind + 1].name;
          CpspRef.cmp.inputValue = activity.moments[m_ind + 1].name;
        } else {
          CpspRef.cmp.activityIndex = CpspRef.cmp.selectedProject.activities[activity_ind + 1].id;
          CpspRef.cmp.columnValueInput.value = CpspRef.cmp.selectedProject.activities[activity_ind + 1].description;
          CpspRef.cmp.inputValue = CpspRef.cmp.selectedProject.activities[activity_ind + 1].description;
        }
        //CpspRef.cmp.activityIndex = Number(activity.id);
        //CpspRef.cmp.planIndex = null;

        this.highlightedRow++// = rowNumber;
        CpspRef.cmp.selectedColumnForEditing = CpspRef.cmp.visibleColumns[0];
        sortColumn = CpspRef.cmp.visibleColumns.length;
        this.showInput();
        document.getElementById("columnValueEditInput1").focus();
        this.refreshDisplay();
      }
      else{
        // CpspRef.cmp.resourceWeekInput.style.display = "block";
        // CpspRef.cmp.resourceWeekInput.style.textAlign = "left";
        // CpspRef.cmp.resourceWeekInput.style.width = `${CpspRef.cmp.visibleColumns[sortColumn].width}px`;
        // CpspRef.cmp.resourceWeekInput.style.height = `${ConfigSc.cellHeight}px`;
        // CpspRef.cmp.resourceWeekInput.style.border = "3px solid #F77E04";
        CpspRef.cmp.resourceWeekInput.value = m == null ? CpspRef.cmp.getBusinessDatesCount(activity.startDate,activity.endDate).toString() : CpspRef.cmp.getBusinessDatesCount(m.start_date,m.end_date).toString();
        CpspRef.cmp.resourceWeekInput.style.top = `${Number(CpspRef.cmp.planInput.style.top.replace("px",""))}px`;
        //const x = ConfigSc.sidebarSize + CpspRef.cmp.visibleColumns[sortColumn].x + CpspRef.cmp.visibleColumns[sortColumn].width - this.getMomentTableBodyContainer().getHorizontalScrollbar().getSlider().getX();
        CpspRef.cmp.resourceWeekInput.style.left = `${Number(CpspRef.cmp.planInput.style.left.replace("px","")) + CpspRef.cmp.visibleColumns[sortColumn-1].width}px`;
        //`${x}px`;
        // CpspRef.cmp.resourceWeekInput.focus();
        // CpspRef.cmp.resourceWeekInput.select();
        CpspRef.cmp.selectedColumnForEditing = CpspRef.cmp.visibleColumns[sortColumn];
        this.showInput();
      }

    } else if(CpspRef.cmp.selectedColumnForEditing.key == "days"){
      if(CpspRef.cmp.resourceWeekInput.style.display == "block"){
        CpspRef.cmp.resourceWeekInput.blur();
      }
      if(m == null)
        this.setColumnDoubleClickHandler(null, CpspRef.cmp.visibleColumns[sortColumn], activity.id, null, moment(activity.startDate).format(ConfigSc.dateRevFormat));
      else
        this.setColumnDoubleClickHandler(null, CpspRef.cmp.visibleColumns[sortColumn], activity.id, m.id, moment(m.start_date).format(ConfigSc.dateRevFormat));
    } else if(CpspRef.cmp.selectedColumnForEditing.key == "start_date"){
      const datepicker = $("#columnStartDateInput") as any;
      datepicker.datepicker("hide");
      if(m == null)
      this.setColumnDoubleClickHandler(null, CpspRef.cmp.visibleColumns[sortColumn], activity.id, null, moment(activity.endDate).format(ConfigSc.dateRevFormat));
      else
        this.setColumnDoubleClickHandler(null, CpspRef.cmp.visibleColumns[sortColumn], activity.id, m.id, moment(m.end_date).format(ConfigSc.dateRevFormat));
    } else if(CpspRef.cmp.selectedColumnForEditing.key == "end_date"){
      const datepicker = $("#columnEndDateInput") as any;
      datepicker.datepicker("hide");
      // CpspRef.cmp.resourceWeekInput.style.display = "block";
      // CpspRef.cmp.resourceWeekInput.style.textAlign = "left";
      // CpspRef.cmp.resourceWeekInput.style.width = `${CpspRef.cmp.visibleColumns[sortColumn].width}px`;
      // CpspRef.cmp.resourceWeekInput.style.height = `${ConfigSc.cellHeight}px`;
      // CpspRef.cmp.resourceWeekInput.style.border = "3px solid #F77E04";
      CpspRef.cmp.resourceWeekInput.value = m == null ? activity.time != null ? activity.time.toString() : "0" : m.time!= null ? m.time.toString() : "0";
      CpspRef.cmp.resourceWeekInput.style.top = `${Number(CpspRef.cmp.columnEndDateInput.style.top.replace("px",""))}px`;
      //const x = ConfigSc.sidebarSize + CpspRef.cmp.visibleColumns[sortColumn].x + CpspRef.cmp.visibleColumns[sortColumn].width - this.getMomentTableBodyContainer().getHorizontalScrollbar().getSlider().getX();
      //CpspRef.cmp.resourceWeekInput.style.left  = needMove ?
        // `${Number(CpspRef.cmp.columnEndDateInput.style.left.replace("px","")) + CpspRef.cmp.visibleColumns[sortColumn-1].width/2 }px` :
        // `${Number(CpspRef.cmp.columnEndDateInput.style.left.replace("px","")) + CpspRef.cmp.visibleColumns[sortColumn-1].width + CpspRef.cmp.visibleColumns[sortColumn].width/2}px`;
      const x = needMove ?
        Number(CpspRef.cmp.columnEndDateInput.style.left.replace("px",""))  :
        Number(CpspRef.cmp.columnEndDateInput.style.left.replace("px","")) + CpspRef.cmp.visibleColumns[sortColumn-1].width;
      //`${x}px`;
      // CpspRef.cmp.resourceWeekInput.focus();
      // CpspRef.cmp.resourceWeekInput.select();
      CpspRef.cmp.selectedColumnForEditing = CpspRef.cmp.visibleColumns[sortColumn];
        this.showInput(x);
    } else if(CpspRef.cmp.selectedColumnForEditing.key == "hours"){
      if(CpspRef.cmp.resourceWeekInput.style.display == "block"){
        CpspRef.cmp.resourceWeekInput.blur();
      }
      // CpspRef.cmp.resourceWeekInput.style.display = "block";
      // CpspRef.cmp.resourceWeekInput.style.textAlign = "left";
      // CpspRef.cmp.resourceWeekInput.style.width = `${CpspRef.cmp.visibleColumns[sortColumn].width}px`;
      // CpspRef.cmp.resourceWeekInput.style.height = `${ConfigSc.cellHeight}px`;
      // CpspRef.cmp.resourceWeekInput.style.border = "3px solid #F77E04";
      if(ConfigSc.timePlanHeader == "Activity")
        CpspRef.cmp.resourceWeekInput.value = m == null && activity.moments.length == 0 ? activity.number_of_workers != null ? activity.number_of_workers.toString() : "0" : m.number_of_workers != null ? m.number_of_workers.toString() : "0";
      else
        CpspRef.cmp.resourceWeekInput.value = m == null && activity.moments.length == 0 ? activity.dateSegments[0].finishedTime != null ? activity.dateSegments[0].finishedTime.toString() : "0" : m.dateSegments[0].finishedTime.toString();
      CpspRef.cmp.resourceWeekInput.style.top = `${Number(CpspRef.cmp.resourceWeekInput.style.top.replace("px",""))}px`;
      //const x = ConfigSc.sidebarSize + CpspRef.cmp.visibleColumns[sortColumn].x + CpspRef.cmp.visibleColumns[sortColumn].width - this.getMomentTableBodyContainer().getHorizontalScrollbar().getSlider().getX();
      // CpspRef.cmp.resourceWeekInput.style.left = needMove ?
      //     `${Number(CpspRef.cmp.resourceWeekInput.style.left.replace("px","")) + CpspRef.cmp.visibleColumns[sortColumn-1].width}px` :
      //     `${Number(CpspRef.cmp.resourceWeekInput.style.left.replace("px","")) + CpspRef.cmp.visibleColumns[sortColumn-1].width }px`;
      const x = needMove ?
          Number(CpspRef.cmp.resourceWeekInput.style.left.replace("px","")) + CpspRef.cmp.visibleColumns[sortColumn-1].width :
          Number(CpspRef.cmp.resourceWeekInput.style.left.replace("px","")) + CpspRef.cmp.visibleColumns[sortColumn-1].width;
      //`${x}px`;
      // CpspRef.cmp.resourceWeekInput.focus();
      // CpspRef.cmp.resourceWeekInput.select();
      CpspRef.cmp.selectedColumnForEditing = CpspRef.cmp.visibleColumns[sortColumn];
        this.showInput(x);
    } else if(CpspRef.cmp.selectedColumnForEditing.key == "resource" || CpspRef.cmp.selectedColumnForEditing.key == "finished"){
      if(right)return;
      if(this.getMomentTableBodyContainer().getHorizontalScrollbar().getSlider().getX()>0){
        const move_x_left = -this.getMomentTableBodyContainer().getHorizontalScrollbar().getSlider().getX()
        this.getMomentTableBodyContainer().getHorizontalScrollbar().getSlider().move(move_x_left)
        this.refreshDisplay();
      }
      // CpspRef.cmp.columnValueInput.style.display = "block";
      // CpspRef.cmp.columnValueInput.style.textAlign = "left";
      // CpspRef.cmp.columnValueInput.style.width = `${CpspRef.cmp.visibleColumns[0].width}px`;
      // CpspRef.cmp.columnValueInput.style.height = `${ConfigSc.cellHeight}px`;
      // CpspRef.cmp.columnValueInput.style.border = "3px solid #F77E04";
      CpspRef.cmp.columnValueInput.style.top = `${Number(CpspRef.cmp.resourceWeekInput.style.top.replace("px",""))+ConfigSc.cellHeight/2 + 2.5}px`;
      // const x = ConfigSc.sidebarSize + ProjectMomentsTableHead.threeVerticalDotsColumnWidth;
      // CpspRef.cmp.columnValueInput.style.left = `${x}px`;
      // CpspRef.cmp.columnValueInput.style.pointerEvents = "auto"
      // CpspRef.cmp.deleteDetails = true;
      // CpspRef.cmp.columnValueInput.focus();
      // CpspRef.cmp.columnValueInput.select();

      // document.getElementById("columnValueEditInput1").style.display = "block"
      // document.getElementById("columnValueEditInput1").style.textAlign = "left";
      // document.getElementById("columnValueEditInput1").focus();
      // document.getElementById("selectValue").style.display = "block"
      CpspRef.cmp.inputValue = activity.description;

      if(activity.moments.length > 0 && m_ind < activity.moments.length - 1){
        CpspRef.cmp.planIndex = activity.moments[m_ind + 1].id;
        CpspRef.cmp.columnValueInput.value = activity.moments[m_ind + 1].name;
        CpspRef.cmp.inputValue = activity.moments[m_ind + 1].name;
      } else {
        CpspRef.cmp.activityIndex = CpspRef.cmp.selectedProject.activities[activity_ind + 1].id;
        CpspRef.cmp.columnValueInput.value = CpspRef.cmp.selectedProject.activities[activity_ind + 1].description;
        CpspRef.cmp.inputValue = CpspRef.cmp.selectedProject.activities[activity_ind + 1].description;
      }
      //CpspRef.cmp.activityIndex = Number(activity.id);
      //CpspRef.cmp.planIndex = null;

      this.highlightedRow++// = rowNumber;
      CpspRef.cmp.selectedColumnForEditing = CpspRef.cmp.visibleColumns[0];
      this.showInput();
      document.getElementById("columnValueEditInput1").focus();
      this.refreshDisplay();
    }

    //not last column
    if(sortColumn < CpspRef.cmp.visibleColumns.length)
      CpspRef.cmp.selectedColumnForEditing = CpspRef.cmp.visibleColumns[sortColumn];*/
    CpspRef.cmp.tabPress = false;
  }

  arowLeftPress() {
    this.tabPress(false, true);
    /*const activity_ind = CpspRef.cmp.copySelectedProject.activities.findIndex(a => a.id == CpspRef.cmp.activityIndex)
    const activity = CpspRef.cmp.copySelectedProject.activities[activity_ind];
    if(activity == undefined) return;
    let m : Moment = null;
    let m_ind = activity.moments.findIndex(m => m.id == CpspRef.cmp.planIndex) ;
    if(CpspRef.cmp.planIndex != null){
      //m_ind =
      m = activity.moments[m_ind]
    }
    let sortColumn = CpspRef.cmp.visibleColumns.findIndex(c => c.id == CpspRef.cmp.selectedColumnForEditing.id)-1 ;
    //need move scroll left
    //this.getMomentTableBodyContainer().getHorizontalScrollbar().getSlider().getX() + this.getMomentTableBodyContainer().getHorizontalScrollbar().getSlider().getWidth() + 40
    if(sortColumn < CpspRef.cmp.visibleColumns.length && CpspRef.cmp.visibleColumns[sortColumn].x + CpspRef.cmp.visibleColumns[sortColumn].width > Number(String(this.getMomentTableBodyContainer().getHorizontalScrollbar().getWidth()).replace("px","")) +  this.getMomentTableBodyContainer().getHorizontalScrollbar().getSlider().getX()){

      const move_x = CpspRef.cmp.visibleColumns[CpspRef.cmp.visibleColumns.length-1].x + CpspRef.cmp.visibleColumns[CpspRef.cmp.visibleColumns.length-1].width - (this.getMomentTableBodyContainer().getHorizontalScrollbar().getSlider().getWidth() + 40)
      this.getMomentTableBodyContainer().getHorizontalScrollbar().getSlider().move(move_x)
      this.refreshDisplay();
    }

    if(CpspRef.cmp.selectedColumnForEditing.key == "Details" ){
      return;
    } else if(CpspRef.cmp.selectedColumnForEditing.key == "part"){
      // CpspRef.cmp.columnValueInput.style.display = "block";
      // CpspRef.cmp.columnValueInput.style.textAlign = "left";
      // CpspRef.cmp.columnValueInput.style.width = `${CpspRef.cmp.visibleColumns[0].width}px`;
      // CpspRef.cmp.columnValueInput.style.height = `${ConfigSc.cellHeight}px`;
      // CpspRef.cmp.columnValueInput.style.border = "3px solid #F77E04";
      CpspRef.cmp.columnValueInput.style.top = `${Number(CpspRef.cmp.planInput.style.top.replace("px",""))+ConfigSc.cellHeight/2 + 2.5 - ConfigSc.cellHeight}px`;
      // const x = ConfigSc.sidebarSize + ProjectMomentsTableHead.threeVerticalDotsColumnWidth;
      // CpspRef.cmp.columnValueInput.style.left = `${x}px`;
      // CpspRef.cmp.columnValueInput.style.pointerEvents = "auto"
      // CpspRef.cmp.deleteDetails = true;

      // document.getElementById("columnValueEditInput1").style.display = "block"
      // document.getElementById("columnValueEditInput1").style.textAlign = "left";
      // document.getElementById("columnValueEditInput1").focus();
      // document.getElementById("selectValue").style.display = "block"
      CpspRef.cmp.inputValue = activity.description;

      if(m_ind != -1 ){
        CpspRef.cmp.columnValueInput.value = activity.moments[m_ind].name;
        CpspRef.cmp.inputValue = activity.moments[m_ind].name;
      } else {
        CpspRef.cmp.columnValueInput.value = CpspRef.cmp.selectedProject.activities[activity_ind].description;
        CpspRef.cmp.inputValue = CpspRef.cmp.selectedProject.activities[activity_ind].description;
      }
      //CpspRef.cmp.activityIndex = Number(activity.id);
      //CpspRef.cmp.planIndex = null;

      CpspRef.cmp.selectedColumnForEditing = CpspRef.cmp.visibleColumns[0];
      //sortColumn = CpspRef.cmp.visibleColumns.length;
      this.showInput();
      document.getElementById("columnValueEditInput1").focus();
      this.refreshDisplay();
    } else if(CpspRef.cmp.selectedColumnForEditing.key == "plan"){

      if(CpspRef.cmp.columnValueInput.style.display == "block"){
        CpspRef.cmp.hideColumnValueInput()
        //document.getElementById("columnValueEditInput1").blur();
      }
      // CpspRef.cmp.planInput.style.display = "block";
      // CpspRef.cmp.planInput.style.textAlign = "left";
      // CpspRef.cmp.planInput.style.width = `${CpspRef.cmp.visibleColumns[sortColumn-1].width}px`;
      // CpspRef.cmp.planInput.style.height = `${ConfigSc.cellHeight}px`;
      // CpspRef.cmp.planInput.style.border = "3px solid #F77E04";
      CpspRef.cmp.planInput.value = m == null ? activity.part : m.part;
      // let x=ConfigSc.sidebarSize+CpspRef.cmp.visibleColumns[sortColumn-1].x+CpspRef.cmp.visibleColumns[sortColumn-1].width/2+ConfigSc.appSidePadding;
      // CpspRef.cmp.planInput.style.left = `${x}px`
      // CpspRef.cmp.planInput.focus();
      // CpspRef.cmp.planInput.select();
      CpspRef.cmp.selectedColumnForEditing = CpspRef.cmp.visibleColumns[sortColumn];
      this.showInput();

    } else if(CpspRef.cmp.selectedColumnForEditing.key == "days"){
      if(CpspRef.cmp.resourceWeekInput.style.display == "block"){
        CpspRef.cmp.resourceWeekInput.blur();
      }

      // CpspRef.cmp.planInput.style.display = "block";
      // CpspRef.cmp.planInput.style.textAlign = "left";
      // CpspRef.cmp.planInput.style.width = `${CpspRef.cmp.visibleColumns[sortColumn].width}px`;
      // CpspRef.cmp.planInput.style.height = `${ConfigSc.cellHeight}px`;
      // CpspRef.cmp.planInput.style.border = "3px solid #F77E04";
      // CpspRef.cmp.planInput.value = m == null ? activity.plan : m.plan;
      CpspRef.cmp.planInput.style.top = CpspRef.cmp.resourceWeekInput.style.top;
      // CpspRef.cmp.planInput.style.left = `${Number(CpspRef.cmp.resourceWeekInput.style.left.replace("px","")) - CpspRef.cmp.visibleColumns[sortColumn-1].width}px`;
      // CpspRef.cmp.planInput.focus();
      // CpspRef.cmp.planInput.select();
      CpspRef.cmp.selectedColumnForEditing = CpspRef.cmp.visibleColumns[sortColumn];
      this.showInput();
    } else if(CpspRef.cmp.selectedColumnForEditing.key == "start_date"){
      const datepicker = $("#columnStartDateInput") as any;
      datepicker.datepicker("hide");
      // CpspRef.cmp.resourceWeekInput.style.display = "block";
      // CpspRef.cmp.resourceWeekInput.style.textAlign = "left";
      // CpspRef.cmp.resourceWeekInput.style.width = `${CpspRef.cmp.visibleColumns[sortColumn-1].width}px`;
      // CpspRef.cmp.resourceWeekInput.style.height = `${ConfigSc.cellHeight}px`;
      // CpspRef.cmp.resourceWeekInput.style.border = "3px solid #F77E04";
      CpspRef.cmp.resourceWeekInput.value = m == null ? CpspRef.cmp.getBusinessDatesCount(activity.startDate,activity.endDate).toString() : CpspRef.cmp.getBusinessDatesCount(m.start_date,m.end_date).toString();
      CpspRef.cmp.resourceWeekInput.style.top = `${Number(CpspRef.cmp.columnStartDateInput.style.top.replace("px",""))}px`;
      // CpspRef.cmp.resourceWeekInput.style.left = `${Number(CpspRef.cmp.columnStartDateInput.style.left.replace("px","")) - CpspRef.cmp.visibleColumns[sortColumn-1].width/2}px`;
      const x = Number(CpspRef.cmp.columnStartDateInput.style.left.replace("px","")) - CpspRef.cmp.visibleColumns[sortColumn].width;

      // CpspRef.cmp.resourceWeekInput.focus();
      // CpspRef.cmp.resourceWeekInput.select();
      CpspRef.cmp.selectedColumnForEditing = CpspRef.cmp.visibleColumns[sortColumn];
        this.showInput(x);
    } else if(CpspRef.cmp.selectedColumnForEditing.key == "end_date"){
      const datepicker = $("#columnEndDateInput") as any;
      datepicker.datepicker("hide");
      CpspRef.cmp.columnStartDateInput.style.top = `${Number(CpspRef.cmp.columnEndDateInput.style.top.replace("px",""))}px`
      CpspRef.cmp.columnStartDateInput.style.left = `${Number(CpspRef.cmp.columnEndDateInput.style.left.replace("px","")) - CpspRef.cmp.visibleColumns[sortColumn-1].width}px`
      if(m == null){
        this.setColumnDoubleClickHandler(null, CpspRef.cmp.visibleColumns[sortColumn-1], activity.id, null, moment(activity.startDate).format(ConfigSc.dateRevFormat),true);
      }
      else{
        this.setColumnDoubleClickHandler(null, CpspRef.cmp.visibleColumns[sortColumn-1], activity.id, m.id, moment(m.start_date).format(ConfigSc.dateRevFormat),true);
      }
    } else if(CpspRef.cmp.selectedColumnForEditing.key == "hours"){
      if(CpspRef.cmp.resourceWeekInput.style.display == "block"){
        CpspRef.cmp.resourceWeekInput.blur();
      }
      CpspRef.cmp.columnEndDateInput.style.top = `${Number(CpspRef.cmp.resourceWeekInput.style.top.replace("px",""))}px`  ;
      CpspRef.cmp.columnEndDateInput.style.left = `${Number(CpspRef.cmp.resourceWeekInput.style.left.replace("px","")) - CpspRef.cmp.visibleColumns[sortColumn-1].width - CpspRef.cmp.visibleColumns[sortColumn].width/2}px`;
      if(m == null){
        this.setColumnDoubleClickHandler(null, CpspRef.cmp.visibleColumns[sortColumn-1], activity.id, null, moment(activity.endDate).format(ConfigSc.dateRevFormat),true);
      }
      else{
        this.setColumnDoubleClickHandler(null, CpspRef.cmp.visibleColumns[sortColumn-1], activity.id, m.id, moment(m.end_date).format(ConfigSc.dateRevFormat),true);
      }

    } else if(CpspRef.cmp.selectedColumnForEditing.key == "resource" || CpspRef.cmp.selectedColumnForEditing.key == "finished"){
      if(CpspRef.cmp.resourceWeekInput.style.display == "block"){
        CpspRef.cmp.resourceWeekInput.blur();
      }
      // CpspRef.cmp.resourceWeekInput.style.display = "block";
      // CpspRef.cmp.resourceWeekInput.style.textAlign = "left";
      // CpspRef.cmp.resourceWeekInput.style.width = `${CpspRef.cmp.visibleColumns[sortColumn].width}px`;
      // CpspRef.cmp.resourceWeekInput.style.height = `${ConfigSc.cellHeight}px`;
      // CpspRef.cmp.resourceWeekInput.style.border = "3px solid #F77E04";
      CpspRef.cmp.resourceWeekInput.value = m == null ? activity.time != null ? activity.time.toString() : "0" : m.time!= null ? m.time.toString() : "0";
      // CpspRef.cmp.resourceWeekInput.style.left = `${Number(CpspRef.cmp.resourceWeekInput.style.left.replace("px","")) - CpspRef.cmp.visibleColumns[sortColumn-1].width }px`
      const x = Number(CpspRef.cmp.resourceWeekInput.style.left.replace("px","")) - CpspRef.cmp.visibleColumns[sortColumn].width;
      //`${x}px`;
      // CpspRef.cmp.resourceWeekInput.focus();
      // CpspRef.cmp.resourceWeekInput.select();
      CpspRef.cmp.selectedColumnForEditing = CpspRef.cmp.visibleColumns[sortColumn];
      this.showInput(x);
      this.refreshDisplay();
    }
    if(sortColumn > 0)
    CpspRef.cmp.selectedColumnForEditing = CpspRef.cmp.visibleColumns[sortColumn - 1];
    CpspRef.cmp.tabPress = false;*/
  }

  moveToDetails(m_ind, activity_ind, activity, down, column) {
    if (!down) {
      let act_has_tape_above = false;
      for (let k = m_ind - 1; k >= 0; k--) {
        if (activity.moments.at(k).percentage_of_realized_plan == null)
          act_has_tape_above = true;
      }
      if (
        activity.moments.length == 0 &&
        CpspRef.cmp.selectedProject.activities.at(activity_ind - 1)
          .description != null &&
        CpspRef.cmp.selectedProject.activities.at(activity_ind - 1)
          .description != ""
      ) {
        act_has_tape_above = true;
      }

      if (
        !act_has_tape_above &&
        (m_ind != -1 ||
          CpspRef.cmp.selectedProject.activities.at(activity_ind - 1).moments
            .length > 0) &&
        (column == "part" || column == "plan" || column == null)
      )
        act_has_tape_above = true;

      if (!act_has_tape_above) {
        this.selColumn = CpspRef.cmp.visibleColumns.find(
          (c) => c.key == "Details"
        );
        this.marginLeft = this.selColumn.x + this.rowNumberContainer.getWidth();
        // this.marginLeft = ConfigSc.sidebarSize + 20;
        // this.marginTop -= ConfigSc.cellHeight;
        CpspRef.cmp.selectedColumnForEditing = this.selColumn;
        CpspRef.cmp.indexOfVisibleColumn = undefined;
        if (
          this.getMomentTableBodyContainer()
            .getHorizontalScrollbar()
            .getSlider()
            .getX() +
            30 +
            this.selColumn.width >
          this.selColumn.x
        ) {
          // needMoveLeft = true;
          const move_x_left = -this.getMomentTableBodyContainer()
            .getHorizontalScrollbar()
            .getSlider()
            .getX();
          this.getMomentTableBodyContainer()
            .getHorizontalScrollbar()
            .getSlider()
            .move(move_x_left);
          // this.marginLeft = CpspRef.cmp.visibleColumns[1].x + 25 - CpspRef.cmp.visibleColumns[0].width;
          this.marginLeft = this.selColumn.x + 25;
          // this.refreshDisplay();
        }
        this.marginLeft += 20 + 25;
        this.arrowDownORArrowUPPress(false, true);
        return true;
      }
    } else if (
      down &&
      //last moment
      m_ind == activity.moments.length - 1 &&
      //next activity is empty
      (CpspRef.cmp.selectedProject.activities.at(activity_ind + 1)
        .description == null ||
        CpspRef.cmp.selectedProject.activities.at(activity_ind + 1)
          .description == "")
    ) {
      this.selColumn = CpspRef.cmp.visibleColumns.find(
        (c) => c.key == "Details"
      );
      this.marginLeft = this.selColumn.x + this.rowNumberContainer.getWidth();
      // this.marginLeft = ConfigSc.sidebarSize + 20;
      // this.marginTop -= ConfigSc.cellHeight;
      CpspRef.cmp.selectedColumnForEditing = this.selColumn;
      CpspRef.cmp.indexOfVisibleColumn = undefined;
      if (
        this.getMomentTableBodyContainer()
          .getHorizontalScrollbar()
          .getSlider()
          .getX() +
          30 +
          this.selColumn.width >
        this.selColumn.x
      ) {
        // needMoveLeft = true;
        const move_x_left = -this.getMomentTableBodyContainer()
          .getHorizontalScrollbar()
          .getSlider()
          .getX();
        this.getMomentTableBodyContainer()
          .getHorizontalScrollbar()
          .getSlider()
          .move(move_x_left);
        // this.marginLeft = CpspRef.cmp.visibleColumns[1].x + 25 - CpspRef.cmp.visibleColumns[0].width;
        this.marginLeft = this.selColumn.x + 25;
        // this.refreshDisplay();
      }
      this.marginLeft += 20 + 25;
      this.arrowDownORArrowUPPress(true,true);

      // this.selColumn = CpspRef.cmp.visibleColumns.at(-1);
      // this.tabPress()
      return true;
    }
    return false;
  }

  arrowDownORArrowUPPress(down: boolean, toDetails: boolean = false) {
    CpspRef.cmp.hideColorPicker();

    const activity_ind = CpspRef.cmp.selectedProject.activities.findIndex(
      (a) => a.id == CpspRef.cmp.activityIndex
    );
    const activity = CpspRef.cmp.selectedProject.activities[activity_ind];
    if (activity == undefined) return;
    //let m : Moment = null;
    let m_ind = activity.moments.findIndex(
      (m) => m.id == CpspRef.cmp.planIndex
    );
    // if(CpspRef.cmp.planIndex != null){
    //   //m_ind =
    //   m = activity.moments[m_ind]
    // }

    if (this.selColumn != undefined || this.selColumn != null) {
      CpspRef.cmp.selectedColumnForEditing = this.selColumn;
    }

    const moveY =
      CpspRef.cmp.projectSchedulePlanerApp.gridContainer
        .getVerticalScrollbar()
        .getSlider()
        .getHeight() / ConfigSc.cellHeight;
    if(CpspRef.cmp.selectedColumnForEditing){
      if (CpspRef.cmp.selectedColumnForEditing.key == "Details" && (CpspRef.cmp.columnValueInput.style.display == "block" || toDetails)) {
        if (CpspRef.cmp.columnValueInput.style.display == "block") {
          CpspRef.cmp.hideColumnValueInput();
          document.getElementById("columnValueEditInput1").blur();
        }

        //when details blur with enter add 10/25 for margins
        if (CpspRef.cmp.detailsBlurWithEnter) {
          // this.marginTop -= 10;
          // this.marginLeft -= 25;
          CpspRef.cmp.detailsBlurWithEnter = false;
        }

        // CpspRef.cmp.columnValueInput.style.display = "block";

        // CpspRef.cmp.columnValueInput.style.top = down ? `${Number(CpspRef.cmp.columnValueInput.style.top.replace("px",""))+ConfigSc.cellHeight}px` : `${Number(CpspRef.cmp.columnValueInput.style.top.replace("px",""))-ConfigSc.cellHeight}px` ;
        // CpspRef.cmp.columnValueInput.style.pointerEvents = "auto"
        // document.getElementById("columnValueEditInput1").style.display = "block"
        // document.getElementById("columnValueEditInput1").style.textAlign = "left";
        // document.getElementById("columnValueEditInput1").focus();
        // document.getElementById("selectValue").style.display = "block"
        // CpspRef.cmp.deleteDetails = true;
        //CpspRef.cmp.inputValue = activity.description;
        let needMoveY = false;

        if (activity_ind == 0 && m_ind < 0 && !down) {
          CpspRef.cmp.columnValueInput.style.top = `${
            Number(CpspRef.cmp.columnValueInput.style.top.replace("px", "")) +
            ConfigSc.cellHeight
          }px`;
          return;
        } else if (
          !down &&
          Number(CpspRef.cmp.columnValueInput.style.top.replace("px", "")) <
            ConfigSc.toolboxSize + 65
        ) {
          needMoveY = true;
          const actInd = CpspRef.cmp.activityIndex;
          CpspRef.cmp.projectSchedulePlanerApp.gridContainer
            .getVerticalScrollbar()
            .getSlider()
            .move(-moveY);
          CpspRef.cmp.columnValueInput.style.display = "block";
          CpspRef.cmp.activityIndex = actInd;
        }

        if (
          down &&
          Number(CpspRef.cmp.columnValueInput.style.top.replace("px", "")) >
            this.getGlobalY() + this.getHeight() - 60
        ) {
          needMoveY = true;
          CpspRef.cmp.projectSchedulePlanerApp.gridContainer
            .getVerticalScrollbar()
            .getSlider()
            .move(moveY);
          CpspRef.cmp.columnValueInput.style.display = "block";
        }
        this.findBellowOrAbove(
          down,
          activity,
          activity_ind,
          m_ind,
          CpspRef.cmp.selectedColumnForEditing.key
        )
        CpspRef.cmp.columnValueInput.style.top = `${this.marginTop}px`;
        if(CpspRef.cmp.activityIndex == undefined)
        CpspRef.cmp.activityIndex = activity.id;
        this.showInput(this.marginLeft);
        this.setValues();
        // document.getElementById("columnValueEditInput1").focus();
        this.refreshDisplay();
        if (needMoveY) {
          //Number(CpspRef.cmp.planInput.style.top.replace("px",""))- 3*ConfigSc.cellHeight/2
          CpspRef.cmp.columnValueInput.style.top = `${this.topY}px`;
          this.marginTop = this.topY;
        }
      } else if (
        (CpspRef.cmp.selectedColumnForEditing.key == "part" ||
        CpspRef.cmp.selectedColumnForEditing.key == "plan") &&
        CpspRef.cmp.planInput.style.display == "block"
      ) {
        if (CpspRef.cmp.planInput.style.display == "block") {
          CpspRef.cmp.planInput.blur();
        }
        if (
          this.moveToDetails(
            m_ind,
            activity_ind,
            activity,
            down,
            CpspRef.cmp.selectedColumnForEditing.key
          )
        )
          return;
        CpspRef.cmp.planInput.style.display = "block";

        CpspRef.cmp.planInput.style.top = down
          ? `${
              Number(CpspRef.cmp.planInput.style.top.replace("px", "")) +
              ConfigSc.cellHeight
            }px`
          : `${
              Number(CpspRef.cmp.planInput.style.top.replace("px", "")) -
              ConfigSc.cellHeight
            }px`;

        CpspRef.cmp.planInput.focus();
        CpspRef.cmp.planInput.select();
        let needMoveY = false;
        //dont move up
        if (activity_ind == 0 && m_ind < 0 && !down) {
          CpspRef.cmp.planInput.style.top = `${
            Number(CpspRef.cmp.planInput.style.top.replace("px", "")) +
            ConfigSc.cellHeight
          }px`;
          return;
        } else if (
          !down &&
          Number(CpspRef.cmp.planInput.style.top.replace("px", "")) <
            ConfigSc.toolboxSize + 65
        ) {
          needMoveY = true;
          const actInd = CpspRef.cmp.activityIndex;
          CpspRef.cmp.projectSchedulePlanerApp.gridContainer
            .getVerticalScrollbar()
            .getSlider()
            .move(-moveY);
          CpspRef.cmp.planInput.style.display = "block";
          CpspRef.cmp.activityIndex = actInd;
        }

        if (
          down &&
          Number(CpspRef.cmp.planInput.style.top.replace("px", "")) >
            this.getGlobalY() + this.getHeight() - 60
        ) {
          needMoveY = true;
          CpspRef.cmp.projectSchedulePlanerApp.gridContainer
            .getVerticalScrollbar()
            .getSlider()
            .move(moveY);
          CpspRef.cmp.planInput.style.display = "block";
        }
        this.findBellowOrAbove(
          down,
          activity,
          activity_ind,
          m_ind,
          CpspRef.cmp.selectedColumnForEditing.key
        );
        if(CpspRef.cmp.activityIndex == undefined)
        CpspRef.cmp.activityIndex = activity.id;
        this.setValues();
        this.refreshDisplay();
        if (needMoveY) {
          //Number(CpspRef.cmp.planInput.style.top.replace("px",""))- 3*ConfigSc.cellHeight/2
          CpspRef.cmp.planInput.style.top = `${this.topY}px`;
          this.marginTop = this.topY;
        }
      } else if (
        (CpspRef.cmp.selectedColumnForEditing.key == "days" ||
        CpspRef.cmp.selectedColumnForEditing.key == "hours" ||
        CpspRef.cmp.selectedColumnForEditing.key == "resource" ||
        CpspRef.cmp.selectedColumnForEditing.key == "finished") &&
        CpspRef.cmp.resourceWeekInput.style.display == "block"
      ) {
        if (CpspRef.cmp.resourceWeekInput.style.display == "block") {
          CpspRef.cmp.resourceWeekInput.blur();
        }
        if (
          CpspRef.cmp.needNewApp ||
          this.moveToDetails(
            m_ind,
            activity_ind,
            activity,
            down,
            CpspRef.cmp.selectedColumnForEditing.key
          )
        )
          return;
        CpspRef.cmp.resourceWeekInput.style.display = "block";
        let numberMove = Number(
          CpspRef.cmp.resourceWeekInput.style.top.replace("px", "")
        );
        CpspRef.cmp.resourceWeekInput.style.top = down
          ? `${
              Number(CpspRef.cmp.resourceWeekInput.style.top.replace("px", "")) +
              ConfigSc.cellHeight
            }px`
          : `${
              Number(CpspRef.cmp.resourceWeekInput.style.top.replace("px", "")) -
              ConfigSc.cellHeight
            }px`;

        CpspRef.cmp.resourceWeekInput.focus();
        CpspRef.cmp.resourceWeekInput.select();

        let needMoveY = false;
        if (
          down &&
          Number(CpspRef.cmp.resourceWeekInput.style.top.replace("px", "")) >
            this.getGlobalY() + this.getHeight() - 60
        ) {
          needMoveY = true;
          CpspRef.cmp.projectSchedulePlanerApp.gridContainer
            .getVerticalScrollbar()
            .getSlider()
            .move(moveY);
          CpspRef.cmp.resourceWeekInput.style.display = "block";
        }
        this.findNextOrPrevious(
          down,
          activity,
          activity_ind,
          m_ind,
          CpspRef.cmp.selectedColumnForEditing.key
        );
        if (
          !down &&
          Number(CpspRef.cmp.resourceWeekInput.style.top.replace("px", "")) <
            ConfigSc.toolboxSize + 65
        ) {
          needMoveY = true;
          const actInd = CpspRef.cmp.activityIndex;
          numberMove =
            (Number(CpspRef.cmp.resourceWeekInput.style.top.replace("px", "")) -
              numberMove) /
            ConfigSc.cellHeight;
          CpspRef.cmp.projectSchedulePlanerApp.gridContainer
            .getVerticalScrollbar()
            .getSlider()
            .move(numberMove * moveY);
          CpspRef.cmp.resourceWeekInput.style.display = "block";
          CpspRef.cmp.activityIndex = actInd;
        }
        if(CpspRef.cmp.activityIndex == undefined)
        CpspRef.cmp.activityIndex = activity.id;
        this.refreshDisplay();
        CpspRef.cmp.resourceWeekInput.select();
        if (needMoveY) {
          CpspRef.cmp.resourceWeekInput.style.top = `${this.topY}px`;
          this.marginTop = this.topY;
        }
      } else if (CpspRef.cmp.selectedColumnForEditing.key == "start_date") {
        const datepicker = $("#columnStartDateInput") as any;
        datepicker.datepicker("hide");
        if (
          this.moveToDetails(
            m_ind,
            activity_ind,
            activity,
            down,
            CpspRef.cmp.selectedColumnForEditing.key
          )
        )
          return;
        let numberMove = Number(
          CpspRef.cmp.columnStartDateInput.style.top.replace("px", "")
        );
        let needMoveY = false;
        CpspRef.cmp.columnStartDateInput.style.top = down
          ? `${
              Number(
                CpspRef.cmp.columnStartDateInput.style.top.replace("px", "")
              ) + ConfigSc.cellHeight
            }px`
          : `${
              Number(
                CpspRef.cmp.columnStartDateInput.style.top.replace("px", "")
              ) - ConfigSc.cellHeight
            }px`;
        if (
          down &&
          Number(CpspRef.cmp.columnStartDateInput.style.top.replace("px", "")) >
            this.getGlobalY() + this.getHeight() - 60
        ) {
          needMoveY = true;
          CpspRef.cmp.projectSchedulePlanerApp.gridContainer
            .getVerticalScrollbar()
            .getSlider()
            .move(moveY);
          CpspRef.cmp.columnStartDateInput.style.display = "block";
        }
        this.findNextOrPrevious(
          down,
          activity,
          activity_ind,
          m_ind,
          CpspRef.cmp.selectedColumnForEditing.key
        );
        if (
          !down &&
          Number(CpspRef.cmp.columnStartDateInput.style.top.replace("px", "")) <
            ConfigSc.toolboxSize + 65
        ) {
          needMoveY = true;
          const actInd = CpspRef.cmp.activityIndex;
          numberMove =
            (Number(
              CpspRef.cmp.columnStartDateInput.style.top.replace("px", "")
            ) -
              numberMove) /
            ConfigSc.cellHeight;
          CpspRef.cmp.projectSchedulePlanerApp.gridContainer
            .getVerticalScrollbar()
            .getSlider()
            .move(numberMove * moveY);
          CpspRef.cmp.columnStartDateInput.style.display = "block";
          CpspRef.cmp.activityIndex = actInd;
        }
        this.refreshDisplay();
        if (needMoveY) {
          CpspRef.cmp.columnStartDateInput.style.top = `${this.topY}px`;
          this.marginTop = this.topY;
          datepicker.datepicker("show");
        }
      } else if (CpspRef.cmp.selectedColumnForEditing.key == "end_date") {
        const datepicker = $("#columnEndDateInput") as any;
        datepicker.datepicker("hide");
        if (
          this.moveToDetails(
            m_ind,
            activity_ind,
            activity,
            down,
            CpspRef.cmp.selectedColumnForEditing.key
          )
        )
          return;
        CpspRef.cmp.columnEndDateInput.style.top = down
          ? `${
              Number(CpspRef.cmp.columnEndDateInput.style.top.replace("px", "")) +
              ConfigSc.cellHeight
            }px`
          : `${
              Number(CpspRef.cmp.columnEndDateInput.style.top.replace("px", "")) -
              ConfigSc.cellHeight
            }px`;
        this.findNextOrPrevious(
          down,
          activity,
          activity_ind,
          m_ind,
          CpspRef.cmp.selectedColumnForEditing.key
        );
        this.refreshDisplay();
      } else if (CpspRef.cmp.selectedColumnForEditing.key == null &&
        CpspRef.cmp.newColumnValueInput.style.display == "block") {
        if (CpspRef.cmp.newColumnValueInput.style.display == "block") {
          CpspRef.cmp.newColumnValueInput.blur();
        }
        if (
          this.moveToDetails(
            m_ind,
            activity_ind,
            activity,
            down,
            CpspRef.cmp.selectedColumnForEditing.key
          )
        )
          return;

        CpspRef.cmp.newColumnValueInput.style.display = "block";
        //CpspRef.cmp.newColumnValueInput.style.top = `${c.getGlobalY()}px`;

        CpspRef.cmp.newColumnValueInput.style.top = down
          ? `${
              Number(
                CpspRef.cmp.newColumnValueInput.style.top.replace("px", "")
              ) + ConfigSc.cellHeight
            }px`
          : `${
              Number(
                CpspRef.cmp.newColumnValueInput.style.top.replace("px", "")
              ) - ConfigSc.cellHeight
            }px`;

        CpspRef.cmp.newColumnValueInput.focus();
        CpspRef.cmp.newColumnValueInput.select();
        let needMoveY = false;
        //dont move up
        if (activity_ind == 0 && m_ind < 0 && !down) {
          CpspRef.cmp.newColumnValueInput.style.top = `${
            Number(CpspRef.cmp.newColumnValueInput.style.top.replace("px", "")) +
            ConfigSc.cellHeight
          }px`;
          return;
        } else if (
          !down &&
          Number(CpspRef.cmp.newColumnValueInput.style.top.replace("px", "")) <
            ConfigSc.toolboxSize + 65
        ) {
          needMoveY = true;
          CpspRef.cmp.projectSchedulePlanerApp.gridContainer
            .getVerticalScrollbar()
            .getSlider()
            .move(-moveY);
          CpspRef.cmp.newColumnValueInput.style.display = "block";
        }

        if (
          down &&
          Number(CpspRef.cmp.newColumnValueInput.style.top.replace("px", "")) >
            this.getGlobalY() + this.getHeight() - 60
        ) {
          needMoveY = true;
          CpspRef.cmp.projectSchedulePlanerApp.gridContainer
            .getVerticalScrollbar()
            .getSlider()
            .move(moveY);
          CpspRef.cmp.newColumnValueInput.style.display = "block";
        }
        this.findBellowOrAbove(
          down,
          activity,
          activity_ind,
          m_ind,
          CpspRef.cmp.selectedColumnForEditing.key
        );
        if(CpspRef.cmp.activityIndex == undefined)
        CpspRef.cmp.activityIndex = activity.id;
        this.showInput(this.marginLeft);
        this.setValues();
        this.refreshDisplay();
        if (needMoveY) {
          //Number(CpspRef.cmp.newColumnValueInput.style.top.replace("px",""))- 3*ConfigSc.cellHeight/2
          CpspRef.cmp.newColumnValueInput.style.top = `${this.topY}px`;
          this.marginTop = this.topY;
        }
      }
      else{
        if(this.selectedMomentsContainer && this.selectedMomentsContainer != null){
          this.highlightedRow = down ?
                              (this.selectedMomentsContainer.getY() + this.selectedMomentsContainer.getHeight()) / ConfigSc.cellHeight :
                              (this.selectedMomentsContainer.getY() / ConfigSc.cellHeight) + 1;
          this.canvas.removeChildById(this.selectedMomentsContainer.getId());
          this.selectedMomentsContainer = undefined;
        }
        down ? this.highlightedRow++ : this.highlightedRow--;
        CpspRef.cmp.selectedColumnForEditing = undefined;
        this.selColumn = undefined;
        this.refreshDisplay();
      }
    }
    else{
      if(this.selectedMomentsContainer && this.selectedMomentsContainer != null){
        this.highlightedRow = down ?
                            (this.selectedMomentsContainer.getY() + this.selectedMomentsContainer.getHeight()) / ConfigSc.cellHeight  :
                            (this.selectedMomentsContainer.getY() / ConfigSc.cellHeight) + 1;
        this.canvas.removeChildById(this.selectedMomentsContainer.getId());
        this.selectedMomentsContainer = undefined;
      }
      down ? this.highlightedRow++ : this.highlightedRow--;
      CpspRef.cmp.selectedColumnForEditing = undefined;
      this.selColumn = undefined;
      this.refreshDisplay();
    }
  }

  setValues(){

    if(CpspRef.cmp.activityIndex){
      let activity = CpspRef.cmp.copySelectedProject.activities.find((a) => a.id == CpspRef.cmp.activityIndex);
      if(CpspRef.cmp.planIndex){
        let moment = activity.moments.find((m) => m.id == CpspRef.cmp.planIndex)
        CpspRef.cmp.changeFontFamilyInputValue = moment.styles.fontFamily;
        CpspRef.cmp.changeFontSizeInputValue = moment.styles.fontSize;
        CpspRef.cmp.changeBackgroundColorInputValue =
          moment.styles.backgroundColor;
        CpspRef.cmp.changeTextColorInputValue = moment.styles.color;
        CpspRef.cmp.changeBackgroundTapeColorInputValue = moment.tape_color;
        CpspRef.cmp.changeFontWeightInputValue =
          moment.styles.fontWeight == "bold" ? true : false;
        CpspRef.cmp.changeFontStyleInputValue =
          moment.styles.fontStyle == "italic" ? true : false;
        CpspRef.cmp.changeFontDecorationInputValue =
          moment.styles.fontDecoration == "underline" ? true : false;
      } else {
        CpspRef.cmp.changeFontFamilyInputValue = activity.styles.fontFamily;
        CpspRef.cmp.changeFontSizeInputValue = activity.styles.fontSize;
        CpspRef.cmp.changeBackgroundColorInputValue =
          activity.styles.backgroundColor;
        CpspRef.cmp.changeTextColorInputValue = activity.styles.color;
        CpspRef.cmp.changeBackgroundTapeColorInputValue = activity.tape_color;
        CpspRef.cmp.changeFontWeightInputValue =
          activity.styles.fontWeight == "bold" ? true : false;
        CpspRef.cmp.changeFontStyleInputValue =
          activity.styles.fontStyle == "italic" ? true : false;
        CpspRef.cmp.changeFontDecorationInputValue =
          activity.styles.fontDecoration == "underline" ? true : false;
      }
    }
  }

  findBellowOrAbove(down: boolean, activity, activity_ind, m_ind, column) {
    if (down) {
      if (activity.moments.length > 0 && m_ind < activity.moments.length - 1) {
        CpspRef.cmp.planIndex = activity.moments[m_ind + 1].id;
        if (column == "Details") {
          CpspRef.cmp.columnValueInput.value = activity.moments[m_ind + 1].name;
          CpspRef.cmp.inputValue = activity.moments[m_ind + 1].name;
          const inp = document.getElementById(
            "columnValueEditInput1"
          ) as HTMLInputElement;
          inp.value = CpspRef.cmp.inputValue;
        } else if (column == "part") {
          CpspRef.cmp.planInput.value = activity.moments[m_ind + 1].part;
        } else if (column == "plan") {
          CpspRef.cmp.planInput.value = activity.moments[m_ind + 1].plan;
        }
      } else {
        CpspRef.cmp.activityIndex =
          CpspRef.cmp.selectedProject.activities[activity_ind + 1].id;
        CpspRef.cmp.planIndex = null;
        if (column == "Details") {
          CpspRef.cmp.columnValueInput.value =
            CpspRef.cmp.selectedProject.activities[
              activity_ind + 1
            ].description;
          CpspRef.cmp.inputValue =
            CpspRef.cmp.selectedProject.activities[
              activity_ind + 1
            ].description;
          const inp = document.getElementById(
            "columnValueEditInput1"
          ) as HTMLInputElement;
          inp.value = CpspRef.cmp.inputValue;
        } else if (column == "part") {
          CpspRef.cmp.planInput.value =
            CpspRef.cmp.selectedProject.activities[activity_ind + 1].part;
        } else if (column == "plan") {
          CpspRef.cmp.planInput.value =
            CpspRef.cmp.selectedProject.activities[activity_ind + 1].plan;
        }
      }
    } else {
      if (activity.moments.length > 0 && m_ind > 0) {
        CpspRef.cmp.planIndex = activity.moments[m_ind - 1].id;
        if (column == "Details") {
          CpspRef.cmp.columnValueInput.value = activity.moments[m_ind - 1].name;
          CpspRef.cmp.inputValue = activity.moments[m_ind - 1].name;
          const inp = document.getElementById(
            "columnValueEditInput1"
          ) as HTMLInputElement;
          inp.value = CpspRef.cmp.inputValue;
        } else if (column == "part") {
          CpspRef.cmp.planInput.value = activity.moments[m_ind - 1].part;
        } else if (column == "plan") {
          CpspRef.cmp.planInput.value = activity.moments[m_ind - 1].plan;
        }
      } else {
        CpspRef.cmp.planIndex = null;
        CpspRef.cmp.activityIndex =
          CpspRef.cmp.selectedProject.activities[
            m_ind == 0 ? activity_ind : activity_ind - 1
          ].id;
        if (column == "Details") {
          if (
            activity_ind == 0 ||
            (activity_ind >= 1 &&
              CpspRef.cmp.selectedProject.activities[activity_ind - 1].moments
                .length == 0) ||
            m_ind == 0
          ) {
            CpspRef.cmp.columnValueInput.value =
              CpspRef.cmp.selectedProject.activities[
                m_ind == 0 ? activity_ind : activity_ind - 1
              ].description;
            CpspRef.cmp.inputValue =
              CpspRef.cmp.selectedProject.activities[
                m_ind == 0 ? activity_ind : activity_ind - 1
              ].description;
            const inp = document.getElementById(
              "columnValueEditInput1"
            ) as HTMLInputElement;
            inp.value = CpspRef.cmp.inputValue;
          } else {
            CpspRef.cmp.columnValueInput.value =
              CpspRef.cmp.selectedProject.activities[
                m_ind == 0 ? activity_ind : activity_ind - 1
              ].moments.at(-1).name;
            CpspRef.cmp.inputValue =
              CpspRef.cmp.selectedProject.activities[
                m_ind == 0 ? activity_ind : activity_ind - 1
              ].moments.at(-1).name;
            const inp = document.getElementById(
              "columnValueEditInput1"
            ) as HTMLInputElement;
            inp.value = CpspRef.cmp.inputValue;
          }
        } else if (column == "part") {
          CpspRef.cmp.planInput.value =
            CpspRef.cmp.selectedProject.activities[
              m_ind == 0 ? activity_ind : activity_ind - 1
            ].part;
        } else if (column == "plan") {
          CpspRef.cmp.planInput.value =
            CpspRef.cmp.selectedProject.activities[
              m_ind == 0 ? activity_ind : activity_ind - 1
            ].plan;
        }

        if (m_ind == 0) CpspRef.cmp.planIndex = null;
        if (
          activity_ind > 0 &&
          CpspRef.cmp.selectedProject.activities[activity_ind - 1].moments
            .length > 0 &&
          m_ind != 0
        ) {
          CpspRef.cmp.planIndex =
            CpspRef.cmp.selectedProject.activities[activity_ind - 1].moments.at(
              -1
            ).id;
          // if(column == "Details")
          //   CpspRef.cmp.inputValue = CpspRef.cmp.selectedProject.activities[activity_ind -1].moments.at(-1).name;
          if (column == "part")
            CpspRef.cmp.planInput.value =
              CpspRef.cmp.selectedProject.activities[
                activity_ind - 1
              ].moments.at(-1).part;
          if (column == "plan")
            CpspRef.cmp.planInput.value =
              CpspRef.cmp.selectedProject.activities[
                activity_ind - 1
              ].moments.at(-1).plan;
        }
      }
    }

    // CpspRef.cmp.activityIndex = Number(activity.id);
    // CpspRef.cmp.planIndex = null;

    down ? this.highlightedRow++ : this.highlightedRow--;
    down
      ? (this.marginTop += ConfigSc.cellHeight)
      : (this.marginTop -= ConfigSc.cellHeight);
  }

  findNextOrPrevious(down: boolean, activity, activity_ind, m_ind, column) {
    if (down) {
      if (activity.moments.length > 0 && m_ind < activity.moments.length - 1) {
        while (
          activity.moments[m_ind + 1].percentage_of_realized_plan != null
        ) {
          m_ind++;
          this.highlightedRow++;
          this.marginTop += ConfigSc.cellHeight;
          if (
            column == "days" ||
            column == "hours" ||
            column == "resource" ||
            column == "finished"
          )
            CpspRef.cmp.resourceWeekInput.style.top = `${
              Number(
                CpspRef.cmp.resourceWeekInput.style.top.replace("px", "")
              ) + ConfigSc.cellHeight
            }px`;
          else if (column == "start_date")
            CpspRef.cmp.columnStartDateInput.style.top = `${
              Number(
                CpspRef.cmp.columnStartDateInput.style.top.replace("px", "")
              ) + ConfigSc.cellHeight
            }px`;
          else if (column == "end_date")
            CpspRef.cmp.columnEndDateInput.style.top = `${
              Number(
                CpspRef.cmp.columnEndDateInput.style.top.replace("px", "")
              ) + ConfigSc.cellHeight
            }px`;
        }
        CpspRef.cmp.planIndex = activity.moments[m_ind + 1].id;
        if (column == "days") {
          CpspRef.cmp.resourceWeekInput.value = CpspRef.cmp
            .getAllDaysOfMoment(activity.moments.at(m_ind + 1))
            .toString();
        } else if (column == "hours") {
          CpspRef.cmp.resourceWeekInput.value =
            activity.moments[m_ind + 1].time != null
              ? activity.moments[m_ind + 1].time.toString()
              : "0";
        } else if (column == "resource") {
          CpspRef.cmp.resourceWeekInput.value =
            activity.moments[m_ind + 1].number_of_workers != null
              ? activity.moments[m_ind + 1].number_of_workers.toString()
              : "0";
        } else if (column == "finished") {
          CpspRef.cmp.resourceWeekInput.value =
            activity.moments[m_ind + 1].dateSegments[0].finishedTime != null
              ? activity.moments[
                  m_ind + 1
                ].dateSegments[0].finishedTime.toString()
              : "0";
        } else if (column == "start_date") {
          this.setColumnDoubleClickHandler(
            null,
            CpspRef.cmp.visibleColumns.find((c) => c.key == column),
            activity.id,
            CpspRef.cmp.planIndex,
            moment(activity.moments[m_ind + 1].start_date).format(
              ConfigSc.dateRevFormat
            ),
            true
          );
        } else if (column == "end_date") {
          this.setColumnDoubleClickHandler(
            null,
            CpspRef.cmp.visibleColumns.find((c) => c.key == column),
            activity.id,
            CpspRef.cmp.planIndex,
            moment(activity.moments[m_ind + 1].end_date).format(
              ConfigSc.dateRevFormat
            ),
            true
          );
        }
      } else {
        CpspRef.cmp.activityIndex =
          CpspRef.cmp.selectedProject.activities[activity_ind + 1].id;
        CpspRef.cmp.planIndex = null;
        //if activity has children
        if (
          CpspRef.cmp.selectedProject.activities[activity_ind + 1].moments
            .length > 0
        ) {
          this.highlightedRow++;
          this.marginTop += ConfigSc.cellHeight;

          if (
            column == "days" ||
            column == "hours" ||
            column == "resource" ||
            column == "finished"
          )
            CpspRef.cmp.resourceWeekInput.style.top = `${
              Number(
                CpspRef.cmp.resourceWeekInput.style.top.replace("px", "")
              ) + ConfigSc.cellHeight
            }px`;
          else if (column == "start_date")
            CpspRef.cmp.columnStartDateInput.style.top = `${
              Number(
                CpspRef.cmp.columnStartDateInput.style.top.replace("px", "")
              ) + ConfigSc.cellHeight
            }px`;
          else if (column == "end_date")
            CpspRef.cmp.columnEndDateInput.style.top = `${
              Number(
                CpspRef.cmp.columnEndDateInput.style.top.replace("px", "")
              ) + ConfigSc.cellHeight
            }px`;

          m_ind = -1;
          while (
            CpspRef.cmp.selectedProject.activities[activity_ind + 1].moments[
              m_ind + 1
            ].percentage_of_realized_plan != null
          ) {
            m_ind++;
            this.highlightedRow++;
            this.marginTop += ConfigSc.cellHeight;
            if (
              column == "days" ||
              column == "hours" ||
              column == "resource" ||
              column == "finished"
            )
              CpspRef.cmp.resourceWeekInput.style.top = `${
                Number(
                  CpspRef.cmp.resourceWeekInput.style.top.replace("px", "")
                ) + ConfigSc.cellHeight
              }px`;
            else if (column == "start_date")
              CpspRef.cmp.columnStartDateInput.style.top = `${
                Number(
                  CpspRef.cmp.columnStartDateInput.style.top.replace("px", "")
                ) + ConfigSc.cellHeight
              }px`;
            else if (column == "end_date")
              CpspRef.cmp.columnEndDateInput.style.top = `${
                Number(
                  CpspRef.cmp.columnEndDateInput.style.top.replace("px", "")
                ) + ConfigSc.cellHeight
              }px`;
          }
          CpspRef.cmp.planIndex =
            CpspRef.cmp.selectedProject.activities[activity_ind + 1].moments[
              m_ind + 1
            ].id;
          if (column == "days") {
            CpspRef.cmp.resourceWeekInput.value = CpspRef.cmp
              .getAllDaysOfMoment(CpspRef.cmp.selectedProject.activities.at(activity_ind + 1).moments.at(m_ind + 1))
              .toString();
          } else if (column == "hours") {
            CpspRef.cmp.resourceWeekInput.value =
              CpspRef.cmp.selectedProject.activities[activity_ind + 1].moments[
                m_ind + 1
              ].time != null
                ? CpspRef.cmp.selectedProject.activities[
                    activity_ind + 1
                  ].moments[m_ind + 1].time.toString()
                : "0";
          } else if (column == "resource") {
            CpspRef.cmp.resourceWeekInput.value =
              CpspRef.cmp.selectedProject.activities[activity_ind + 1].moments[
                m_ind + 1
              ].number_of_workers != null
                ? CpspRef.cmp.selectedProject.activities[
                    activity_ind + 1
                  ].moments[m_ind + 1].number_of_workers.toString()
                : "0";
          } else if (column == "finished") {
            CpspRef.cmp.resourceWeekInput.value =
              CpspRef.cmp.selectedProject.activities[activity_ind + 1].moments[
                m_ind + 1
              ].dateSegments[0].finishedTime != null
                ? CpspRef.cmp.selectedProject.activities[
                    activity_ind + 1
                  ].moments[m_ind + 1].dateSegments[0].finishedTime.toString()
                : "0";
          } else if (column == "start_date") {
            this.setColumnDoubleClickHandler(
              null,
              CpspRef.cmp.visibleColumns.find((c) => c.key == column),
              CpspRef.cmp.selectedProject.activities[activity_ind + 1].id,
              CpspRef.cmp.planIndex,
              moment(
                CpspRef.cmp.selectedProject.activities[activity_ind + 1]
                  .moments[m_ind + 1].start_date
              ).format(ConfigSc.dateRevFormat),
              true
            );
          } else if (column == "end_date") {
            this.setColumnDoubleClickHandler(
              null,
              CpspRef.cmp.visibleColumns.find((c) => c.key == column),
              CpspRef.cmp.selectedProject.activities[activity_ind + 1].id,
              CpspRef.cmp.planIndex,
              moment(
                CpspRef.cmp.selectedProject.activities[activity_ind + 1]
                  .moments[m_ind + 1].end_date
              ).format(ConfigSc.dateRevFormat),
              true
            );
          }
        }
        //if activity is tape
        else {
          if (column == "days") {
            CpspRef.cmp.resourceWeekInput.value = CpspRef.cmp
              .getAllDaysOfMoment(CpspRef.cmp.selectedProject.activities.at(activity_ind + 1))
              .toString();
          } else if (column == "hours") {
            CpspRef.cmp.resourceWeekInput.value =
              CpspRef.cmp.selectedProject.activities[activity_ind + 1].time !=
              null
                ? CpspRef.cmp.selectedProject.activities[
                    activity_ind + 1
                  ].time.toString()
                : "0";
          } else if (column == "resource") {
            CpspRef.cmp.resourceWeekInput.value =
              CpspRef.cmp.selectedProject.activities[activity_ind + 1]
                .number_of_workers != null
                ? CpspRef.cmp.selectedProject.activities[
                    activity_ind + 1
                  ].number_of_workers.toString()
                : "0";
          } else if (column == "finished") {
            CpspRef.cmp.resourceWeekInput.value =
              CpspRef.cmp.selectedProject.activities[activity_ind + 1]
                .dateSegments[0].finishedTime != null
                ? CpspRef.cmp.selectedProject.activities[
                    activity_ind + 1
                  ].dateSegments[0].finishedTime.toString()
                : "0";
          } else if (column == "start_date") {
            this.setColumnDoubleClickHandler(
              null,
              CpspRef.cmp.visibleColumns.find((c) => c.key == column),
              CpspRef.cmp.selectedProject.activities[activity_ind + 1].id,
              null,
              moment(
                CpspRef.cmp.selectedProject.activities[activity_ind + 1]
                  .startDate
              ).format(ConfigSc.dateRevFormat),
              true
            );
          } else if (column == "end_date") {
            this.setColumnDoubleClickHandler(
              null,
              CpspRef.cmp.visibleColumns.find((c) => c.key == column),
              CpspRef.cmp.selectedProject.activities[activity_ind + 1].id,
              null,
              moment(
                CpspRef.cmp.selectedProject.activities[activity_ind + 1].endDate
              ).format(ConfigSc.dateRevFormat),
              true
            );
          }
        }

        // if(column == "Details"){
        //   CpspRef.cmp.columnValueInput.value = CpspRef.cmp.selectedProject.activities[activity_ind + 1].description;
        //   CpspRef.cmp.inputValue = CpspRef.cmp.selectedProject.activities[activity_ind + 1].description;
        // }
        // else if(column == "part"){
        //   CpspRef.cmp.planInput.value = CpspRef.cmp.selectedProject.activities[activity_ind + 1].part
        // } else if(column == "plan"){
        //   CpspRef.cmp.planInput.value = CpspRef.cmp.selectedProject.activities[activity_ind + 1].plan
        // }
      }
    } else {
      if (activity.moments.length > 0 && m_ind > 0) {
        while (
          m_ind > 0 &&
          activity.moments[m_ind - 1].percentage_of_realized_plan != null
        ) {
          m_ind--;
          this.highlightedRow--;
          this.marginTop -= ConfigSc.cellHeight;

          if (
            column == "days" ||
            column == "hours" ||
            column == "resource" ||
            column == "finished"
          )
            CpspRef.cmp.resourceWeekInput.style.top = `${
              Number(
                CpspRef.cmp.resourceWeekInput.style.top.replace("px", "")
              ) - ConfigSc.cellHeight
            }px`;
          else if (column == "start_date")
            CpspRef.cmp.columnStartDateInput.style.top = `${
              Number(
                CpspRef.cmp.columnStartDateInput.style.top.replace("px", "")
              ) - ConfigSc.cellHeight
            }px`;
          else if (column == "end_date")
            CpspRef.cmp.columnEndDateInput.style.top = `${
              Number(
                CpspRef.cmp.columnEndDateInput.style.top.replace("px", "")
              ) - ConfigSc.cellHeight
            }px`;
        }
        if (m_ind == 0) {
          CpspRef.cmp.activityIndex =
            CpspRef.cmp.selectedProject.activities[activity_ind - 1].id;
          this.highlightedRow--;
          this.marginTop -= ConfigSc.cellHeight;

          if (
            column == "days" ||
            column == "hours" ||
            column == "resource" ||
            column == "finished"
          )
            CpspRef.cmp.resourceWeekInput.style.top = `${
              Number(
                CpspRef.cmp.resourceWeekInput.style.top.replace("px", "")
              ) - ConfigSc.cellHeight
            }px`;
          else if (column == "start_date")
            CpspRef.cmp.columnStartDateInput.style.top = `${
              Number(
                CpspRef.cmp.columnStartDateInput.style.top.replace("px", "")
              ) - ConfigSc.cellHeight
            }px`;
          else if (column == "end_date")
            CpspRef.cmp.columnEndDateInput.style.top = `${
              Number(
                CpspRef.cmp.columnEndDateInput.style.top.replace("px", "")
              ) - ConfigSc.cellHeight
            }px`;

          if (
            CpspRef.cmp.selectedProject.activities[activity_ind - 1].moments
              .length == 0
          ) {
            CpspRef.cmp.planIndex = null;

            if (column == "days") {
              CpspRef.cmp.resourceWeekInput.value = CpspRef.cmp
                .getAllDaysOfMoment(CpspRef.cmp.selectedProject.activities.at(activity_ind - 1))
                .toString();
            } else if (column == "hours") {
              CpspRef.cmp.resourceWeekInput.value =
                CpspRef.cmp.selectedProject.activities[activity_ind - 1].time !=
                null
                  ? CpspRef.cmp.selectedProject.activities[
                      activity_ind - 1
                    ].time.toString()
                  : "0";
            } else if (column == "resource") {
              CpspRef.cmp.resourceWeekInput.value =
                CpspRef.cmp.selectedProject.activities[activity_ind - 1]
                  .number_of_workers != null
                  ? CpspRef.cmp.selectedProject.activities[
                      activity_ind - 1
                    ].number_of_workers.toString()
                  : "0";
            } else if (column == "finished") {
              CpspRef.cmp.resourceWeekInput.value =
                CpspRef.cmp.selectedProject.activities[activity_ind - 1]
                  .dateSegments[0].finishedTime != null
                  ? CpspRef.cmp.selectedProject.activities[
                      activity_ind - 1
                    ].dateSegments[0].finishedTime.toString()
                  : "0";
            } else if (column == "start_date") {
              this.setColumnDoubleClickHandler(
                null,
                CpspRef.cmp.visibleColumns.find((c) => c.key == column),
                CpspRef.cmp.selectedProject.activities[activity_ind - 1].id,
                null,
                moment(
                  CpspRef.cmp.selectedProject.activities[activity_ind - 1]
                    .startDate
                ).format(ConfigSc.dateRevFormat),
                true
              );
            } else if (column == "end_date") {
              this.setColumnDoubleClickHandler(
                null,
                CpspRef.cmp.visibleColumns.find((c) => c.key == column),
                CpspRef.cmp.selectedProject.activities[activity_ind - 1].id,
                null,
                moment(
                  CpspRef.cmp.selectedProject.activities[activity_ind - 1]
                    .endDate
                ).format(ConfigSc.dateRevFormat),
                true
              );
            }
          } else {
            CpspRef.cmp.planIndex =
              CpspRef.cmp.selectedProject.activities[
                activity_ind - 1
              ].moments.at(-1).id;
            this.highlightedRow--;
            this.marginTop -= ConfigSc.cellHeight;

            if (
              column == "days" ||
              column == "hours" ||
              column == "resource" ||
              column == "finished"
            ) {
              CpspRef.cmp.resourceWeekInput.style.top = `${
                Number(
                  CpspRef.cmp.resourceWeekInput.style.top.replace("px", "")
                ) - ConfigSc.cellHeight
              }px`;
            }

            if (column == "days") {
              CpspRef.cmp.resourceWeekInput.value = CpspRef.cmp
                .getAllDaysOfMoment(CpspRef.cmp.selectedProject.activities.at(activity_ind - 1).moments.at(-1))
                .toString();
            } else if (column == "hours") {
              CpspRef.cmp.resourceWeekInput.value =
                CpspRef.cmp.selectedProject.activities[
                  activity_ind - 1
                ].moments.at(-1).time != null
                  ? CpspRef.cmp.selectedProject.activities[
                      activity_ind - 1
                    ].moments
                      .at(-1)
                      .time.toString()
                  : "0";
            } else if (column == "resource") {
              CpspRef.cmp.resourceWeekInput.value =
                CpspRef.cmp.selectedProject.activities[
                  activity_ind - 1
                ].moments.at(-1).number_of_workers != null
                  ? CpspRef.cmp.selectedProject.activities[
                      activity_ind - 1
                    ].moments
                      .at(-1)
                      .number_of_workers.toString()
                  : "0";
            } else if (column == "finished") {
              CpspRef.cmp.resourceWeekInput.value =
                CpspRef.cmp.selectedProject.activities[
                  activity_ind - 1
                ].moments.at(-1).dateSegments[0].finishedTime != null
                  ? CpspRef.cmp.selectedProject.activities[
                      activity_ind - 1
                    ].moments
                      .at(-1)
                      .dateSegments[0].finishedTime.toString()
                  : "0";
            } else if (column == "start_date") {
              CpspRef.cmp.columnStartDateInput.style.top = `${
                Number(
                  CpspRef.cmp.columnStartDateInput.style.top.replace("px", "")
                ) - ConfigSc.cellHeight
              }px`;
              this.setColumnDoubleClickHandler(
                null,
                CpspRef.cmp.visibleColumns.find((c) => c.key == column),
                CpspRef.cmp.selectedProject.activities[activity_ind - 1].id,
                CpspRef.cmp.planIndex,
                moment(
                  CpspRef.cmp.selectedProject.activities[
                    activity_ind - 1
                  ].moments.at(-1).start_date
                ).format(ConfigSc.dateRevFormat),
                true
              );
            } else if (column == "end_date") {
              CpspRef.cmp.columnEndDateInput.style.top = `${
                Number(
                  CpspRef.cmp.columnEndDateInput.style.top.replace("px", "")
                ) - ConfigSc.cellHeight
              }px`;
              this.setColumnDoubleClickHandler(
                null,
                CpspRef.cmp.visibleColumns.find((c) => c.key == column),
                CpspRef.cmp.selectedProject.activities[activity_ind - 1].id,
                CpspRef.cmp.planIndex,
                moment(
                  CpspRef.cmp.selectedProject.activities[
                    activity_ind - 1
                  ].moments.at(-1).end_date
                ).format(ConfigSc.dateRevFormat),
                true
              );
            }
          }
        } else {
          CpspRef.cmp.planIndex = activity.moments[m_ind - 1].id;
          if (column == "days") {
            CpspRef.cmp.resourceWeekInput.value = CpspRef.cmp
              .getAllDaysOfMoment(activity.moments.at(m_ind - 1))
              .toString();
          } else if (column == "hours") {
            CpspRef.cmp.resourceWeekInput.value =
              activity.moments[m_ind - 1].time != null
                ? activity.moments[m_ind - 1].time.toString()
                : "0";
          } else if (column == "resource") {
            CpspRef.cmp.resourceWeekInput.value =
              activity.moments[m_ind - 1].number_of_workers != null
                ? activity.moments[m_ind - 1].number_of_workers.toString()
                : "0";
          } else if (column == "finished") {
            CpspRef.cmp.resourceWeekInput.value =
              activity.moments[m_ind - 1].dateSegments[0].finishedTime != null
                ? activity.moments[
                    m_ind - 1
                  ].dateSegments[0].finishedTime.toString()
                : "0";
          } else if (column == "start_date") {
            this.setColumnDoubleClickHandler(
              null,
              CpspRef.cmp.visibleColumns.find((c) => c.key == column),
              activity.id,
              CpspRef.cmp.planIndex,
              moment(activity.moments[m_ind - 1].start_date).format(
                ConfigSc.dateRevFormat
              ),
              true
            );
          } else if (column == "end_date") {
            this.setColumnDoubleClickHandler(
              null,
              CpspRef.cmp.visibleColumns.find((c) => c.key == column),
              activity.id,
              CpspRef.cmp.planIndex,
              moment(activity.moments[m_ind - 1].end_date).format(
                ConfigSc.dateRevFormat
              ),
              true
            );
          }
        }
      } else {
        //dont move up
        if (activity_ind == 0) {
          if (
            column == "days" ||
            column == "hours" ||
            column == "resource" ||
            column == "finished"
          )
            CpspRef.cmp.resourceWeekInput.style.top = `${
              Number(
                CpspRef.cmp.resourceWeekInput.style.top.replace("px", "")
              ) + ConfigSc.cellHeight
            }px`;
          else if (column == "start_date")
            CpspRef.cmp.columnStartDateInput.style.top = `${
              Number(
                CpspRef.cmp.columnStartDateInput.style.top.replace("px", "")
              ) + ConfigSc.cellHeight
            }px`;
          else if (column == "end_date")
            CpspRef.cmp.columnEndDateInput.style.top = `${
              Number(
                CpspRef.cmp.columnEndDateInput.style.top.replace("px", "")
              ) + ConfigSc.cellHeight
            }px`;
          return;
        }
        CpspRef.cmp.activityIndex =
          CpspRef.cmp.selectedProject.activities[activity_ind - 1].id;
        if (
          activity.moments.length > 0 ||
          CpspRef.cmp.selectedProject.activities[activity_ind - 1].moments
            .length > 0
        ) {
          this.highlightedRow--;
          this.marginTop -= ConfigSc.cellHeight;
          if (
            column == "days" ||
            column == "hours" ||
            column == "resource" ||
            column == "finished"
          )
            CpspRef.cmp.resourceWeekInput.style.top = `${
              Number(
                CpspRef.cmp.resourceWeekInput.style.top.replace("px", "")
              ) - ConfigSc.cellHeight
            }px`;
          else if (column == "start_date")
            CpspRef.cmp.columnStartDateInput.style.top = `${
              Number(
                CpspRef.cmp.columnStartDateInput.style.top.replace("px", "")
              ) - ConfigSc.cellHeight
            }px`;
          else if (column == "end_date")
            CpspRef.cmp.columnEndDateInput.style.top = `${
              Number(
                CpspRef.cmp.columnEndDateInput.style.top.replace("px", "")
              ) - ConfigSc.cellHeight
            }px`;
        }

        if (
          CpspRef.cmp.selectedProject.activities[activity_ind - 1].moments
            .length == 0
        ) {
          CpspRef.cmp.planIndex = null;
          if (column == "days") {
            // this.highlightedRow--
            // CpspRef.cmp.resourceWeekInput.style.top = `${Number(CpspRef.cmp.resourceWeekInput.style.top.replace("px",""))-ConfigSc.cellHeight}px`
            CpspRef.cmp.resourceWeekInput.value = CpspRef.cmp
              .getAllDaysOfMoment(CpspRef.cmp.selectedProject.activities.at(activity_ind - 1))
              .toString();
          } else if (column == "hours") {
            CpspRef.cmp.resourceWeekInput.value =
              CpspRef.cmp.selectedProject.activities[activity_ind - 1].time !=
              null
                ? CpspRef.cmp.selectedProject.activities[
                    activity_ind - 1
                  ].time.toString()
                : "0";
          } else if (column == "resource") {
            CpspRef.cmp.resourceWeekInput.value =
              CpspRef.cmp.selectedProject.activities[activity_ind - 1]
                .number_of_workers != null
                ? CpspRef.cmp.selectedProject.activities[
                    activity_ind - 1
                  ].number_of_workers.toString()
                : "0";
          } else if (column == "finished") {
            CpspRef.cmp.resourceWeekInput.value =
              CpspRef.cmp.selectedProject.activities[activity_ind - 1]
                .dateSegments[0].finishedTime != null
                ? CpspRef.cmp.selectedProject.activities[
                    activity_ind - 1
                  ].dateSegments[0].finishedTime.toString()
                : "0";
          } else if (column == "start_date") {
            this.setColumnDoubleClickHandler(
              null,
              CpspRef.cmp.visibleColumns.find((c) => c.key == column),
              CpspRef.cmp.selectedProject.activities[activity_ind - 1].id,
              null,
              moment(
                CpspRef.cmp.selectedProject.activities[activity_ind - 1]
                  .startDate
              ).format(ConfigSc.dateRevFormat),
              true
            );
          } else if (column == "end_date") {
            this.setColumnDoubleClickHandler(
              null,
              CpspRef.cmp.visibleColumns.find((c) => c.key == column),
              CpspRef.cmp.selectedProject.activities[activity_ind - 1].id,
              null,
              moment(
                CpspRef.cmp.selectedProject.activities[activity_ind - 1].endDate
              ).format(ConfigSc.dateRevFormat),
              true
            );
          }
        } else {
          CpspRef.cmp.planIndex =
            CpspRef.cmp.selectedProject.activities[activity_ind - 1].moments.at(
              -1
            ).id;
          //only when we cnage up from activity tape to last element of previous activity
          if (
            CpspRef.cmp.selectedProject.activities[activity_ind].moments
              .length == 0
          ) {
            this.highlightedRow++;
            this.marginTop += ConfigSc.cellHeight;

            if (
              column == "days" ||
              column == "hours" ||
              column == "resource" ||
              column == "finished"
            ) {
              CpspRef.cmp.resourceWeekInput.style.top = `${
                Number(
                  CpspRef.cmp.resourceWeekInput.style.top.replace("px", "")
                ) + ConfigSc.cellHeight
              }px`;
            } else if (column == "start_date") {
              CpspRef.cmp.columnStartDateInput.style.top = `${
                Number(
                  CpspRef.cmp.columnStartDateInput.style.top.replace("px", "")
                ) + ConfigSc.cellHeight
              }px`;
            } else if (column == "end_date") {
              CpspRef.cmp.columnEndDateInput.style.top = `${
                Number(
                  CpspRef.cmp.columnEndDateInput.style.top.replace("px", "")
                ) + ConfigSc.cellHeight
              }px`;
            }
          }

          if (column == "days") {
            CpspRef.cmp.resourceWeekInput.value = CpspRef.cmp
              .getAllDaysOfMoment(CpspRef.cmp.selectedProject.activities.at(activity_ind - 1).moments.at(-1))
              .toString();
          } else if (column == "hours") {
            CpspRef.cmp.resourceWeekInput.value =
              CpspRef.cmp.selectedProject.activities[
                activity_ind - 1
              ].moments.at(-1).time != null
                ? CpspRef.cmp.selectedProject.activities[
                    activity_ind - 1
                  ].moments
                    .at(-1)
                    .time.toString()
                : "0";
          } else if (column == "resource") {
            CpspRef.cmp.resourceWeekInput.value =
              CpspRef.cmp.selectedProject.activities[
                activity_ind - 1
              ].moments.at(-1).number_of_workers != null
                ? CpspRef.cmp.selectedProject.activities[
                    activity_ind - 1
                  ].moments
                    .at(-1)
                    .number_of_workers.toString()
                : "0";
          } else if (column == "finished") {
            CpspRef.cmp.resourceWeekInput.value =
              CpspRef.cmp.selectedProject.activities[
                activity_ind - 1
              ].moments.at(-1).dateSegments[0].finishedTime != null
                ? CpspRef.cmp.selectedProject.activities[
                    activity_ind - 1
                  ].moments
                    .at(-1)
                    .dateSegments[0].finishedTime.toString()
                : "0";
          } else if (column == "start_date") {
            this.setColumnDoubleClickHandler(
              null,
              CpspRef.cmp.visibleColumns.find((c) => c.key == column),
              CpspRef.cmp.selectedProject.activities[activity_ind - 1].id,
              CpspRef.cmp.planIndex,
              moment(
                CpspRef.cmp.selectedProject.activities[
                  activity_ind - 1
                ].moments.at(-1).start_date
              ).format(ConfigSc.dateRevFormat),
              true
            );
          } else if (column == "end_date") {
            this.setColumnDoubleClickHandler(
              null,
              CpspRef.cmp.visibleColumns.find((c) => c.key == column),
              CpspRef.cmp.selectedProject.activities[activity_ind - 1].id,
              CpspRef.cmp.planIndex,
              moment(
                CpspRef.cmp.selectedProject.activities[
                  activity_ind - 1
                ].moments.at(-1).end_date
              ).format(ConfigSc.dateRevFormat),
              true
            );
          }
        }
      }
    }
    down ? this.highlightedRow++ : this.highlightedRow--;
    down
      ? (this.marginTop += ConfigSc.cellHeight)
      : (this.marginTop -= ConfigSc.cellHeight);
  }

  drawSelectedContainer() {
    //multiselect paint container and draw lines
    if (
      this.selectedMomentsContainer != undefined &&
      this.selectedMomentsContainer != null
    ) {
      this.selectedMomentsContainer.setAlpha(0.05);
      //this.selectedMomentsContainer.draw()
      this.getCanvas().getContext().save();
      this.getCanvas().getContext().globalAlpha = 0.1;
      this.getCanvas().getContext().fillStyle = "#F77E04";
      this.getCanvas()
        .getContext()
        .fillRect(
          this.selectedMomentsContainer.getX() + 20 + ConfigSc.cellHeight * 2,
          // CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer().getX() * (-1) - ConfigSc.sideCanvasSize + 10,
          this.selectedMomentsContainer.getGlobalY(),
          this.getWidth() - this.getRowNumbersContainer().getWidth(),
          this.selectedMomentsContainer.getHeight()
        );
      this.getCanvas().getContext().restore();
      this.renderHighlightedLines(
        this.selectedMomentsContainer,
        0,
        false,
        true
      );
      CpspRef.cmp.projectSchedulePlanerApp.gridContainer
        .getVerticalScrollbar()
        .draw();
      //this.selectedMomentsContainer.draw()
    }
  }

  drawShadowOnRevision() {
    // this.getCanvas().getContext().save();
    //   this.getCanvas().getContext().globalAlpha = 0.1;
    //   this.getCanvas().getContext().fillStyle = "#F77E04";
    //   this.getCanvas()
    //     .getContext()
    //     .fillRect(
    //       this.getGlobalX(),
    //       this.getGlobalY(),
    //       this.getWidth(),// - this.getRowNumbersContainer().getWidth(),
    //       this.getHeight()
    //     );
    //   this.getCanvas().getContext().restore();

      this.shadow.style.pointerEvents = "none";
      this.shadow.style.marginTop = ConfigSc.toolboxSize + "px";
      this.shadow.style.marginLeft = ConfigSc.sidebarSize + "px";
      this.shadow.style.backgroundColor = "#434343";
      this.shadow.style.opacity = "0.1";
      this.shadow.style.width = ConfigSc.sideCanvasSize + "px";
      this.shadow.style.height = CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getHeight() + "px";

      document.getElementById("checkBox").style.pointerEvents = "none";
  }

  // show input field for specific columns,
  // x - value for margin ArrowLeftComponent
  // tab - value for options
  showInput(x: number = 0, tab = false) {
    let column = tab ? this.selColumn : CpspRef.cmp.selectedColumnForEditing;
    switch (column.key) {
      case "Details":
        CpspRef.cmp.columnValueInput.style.display = "block";
        CpspRef.cmp.columnValueInput.style.textAlign = "left";
        CpspRef.cmp.columnValueInput.style.width = `${column.width}px`;
        CpspRef.cmp.columnValueInput.style.height = `${ConfigSc.cellHeight}px`;
        CpspRef.cmp.columnValueInput.style.border = "3px solid #F77E04";
        CpspRef.cmp.columnValueInput.style.left = `${x != 0 ? x : column.x}px`;
        if (CpspRef.cmp.planIndex != null && CpspRef.cmp.planIndex != 0) {
          const text = CpspRef.cmp.copySelectedProject.activities
            .find((a) => a.id == CpspRef.cmp.activityIndex)
            .moments.find((m) => m.id == CpspRef.cmp.planIndex).name;
          CpspRef.cmp.columnValueInput.value = text;
          CpspRef.cmp.inputValue = text;
        } else {
          const text = CpspRef.cmp.copySelectedProject.activities.find(
            (a) => a.id == CpspRef.cmp.activityIndex
          ).description;
          CpspRef.cmp.columnValueInput.value = text;
          CpspRef.cmp.inputValue = text;
        }
        CpspRef.cmp.columnValueInput.style.pointerEvents = "auto";
        CpspRef.cmp.deleteDetails = true;
        //CpspRef.cmp.columnValueInput.focus();
        //CpspRef.cmp.columnValueInput.select();

        document.getElementById("columnValueEditInput1").style.display =
          "block";
        document.getElementById("columnValueEditInput1").style.textAlign =
          "left";
        // document.getElementById("columnValueEditInput1").focus();
        document.getElementById("selectValue").style.display = "block";
        break;
      case "plan":
      case "part":
        CpspRef.cmp.planInput.style.display = "block";
        CpspRef.cmp.planInput.style.textAlign = "left";
        CpspRef.cmp.planInput.style.width = `${column.width}px`;
        CpspRef.cmp.planInput.style.height = `${ConfigSc.cellHeight}px`;
        CpspRef.cmp.planInput.style.border = "3px solid #F77E04";
        CpspRef.cmp.planInput.style.left = `${
          x != 0 ? x : column.x + ConfigSc.cellHeight
        }px`; //+cellHeigth because width of row number
        CpspRef.cmp.planInput.focus();
        CpspRef.cmp.planInput.select();
        break;
      case "resource":
      case "days":
      case "hours":
      case "finished":
        CpspRef.cmp.resourceWeekInput.style.display = "block";
        CpspRef.cmp.resourceWeekInput.style.textAlign = "left";
        CpspRef.cmp.resourceWeekInput.style.width = `${column.width}px`;
        CpspRef.cmp.resourceWeekInput.style.height = `${ConfigSc.cellHeight}px`;
        CpspRef.cmp.resourceWeekInput.style.border = "3px solid #F77E04";
        CpspRef.cmp.resourceWeekInput.style.left = `${
          x != 0 ? x : column.x + ConfigSc.cellHeight
        }px`;
        CpspRef.cmp.resourceWeekInput.focus();
        CpspRef.cmp.resourceWeekInput.select();
        break;
      case null:
        let text = "";
        if (
          (CpspRef.cmp.planIndex == 0 || CpspRef.cmp.planIndex == null) &&
          column.values[CpspRef.cmp.project.id] &&
          column.values[CpspRef.cmp.project.id].activities[
            CpspRef.cmp.activityIndex
          ]
        ) {
          text =
            column.values[CpspRef.cmp.project.id].activities[
              CpspRef.cmp.activityIndex
            ].value;
        } else if (
          CpspRef.cmp.planIndex != 0 &&
          column.values[CpspRef.cmp.project.id] &&
          column.values[CpspRef.cmp.project.id].activities[
            CpspRef.cmp.activityIndex
          ] &&
          column.values[CpspRef.cmp.project.id].activities[
            CpspRef.cmp.activityIndex
          ].plans[CpspRef.cmp.planIndex]
        ) {
          text =
            column.values[CpspRef.cmp.project.id].activities[
              CpspRef.cmp.activityIndex
            ].plans[CpspRef.cmp.planIndex];
        }
        CpspRef.cmp.newColumnValueInput.style.display = "block";
        CpspRef.cmp.newColumnValueInput.style.textAlign = "left";
        CpspRef.cmp.newColumnValueInput.style.width = `${column.width}px`;
        CpspRef.cmp.newColumnValueInput.style.height = `${ConfigSc.cellHeight}px`;
        CpspRef.cmp.newColumnValueInput.style.border = "3px solid #F77E04";
        CpspRef.cmp.newColumnValueInput.value = text;
        CpspRef.cmp.newColumnValueInput.style.left = `${
          x != 0 ? x : column.x + ConfigSc.cellHeight
        }px`;
        CpspRef.cmp.newColumnValueInput.focus();
        CpspRef.cmp.newColumnValueInput.select();
        break;
    }
  }

  refreshDisplay() {
    if(CpspRef.cmp.projectSchedulePlanerApp.mainHeader)
    CpspRef.cmp.projectSchedulePlanerApp.mainHeader.closeDropDowns();
    // if (this.getHeight() < this.getNumberOfAllDisplayActivitiesAndMoments() * ConfigSc.cellHeight)
    // this.updateInnerContainerHeight();//cellHeight
    CpspRef.cmp.showCal = false;
    CpspRef.cmp.moveTape = undefined;
    CpspRef.cmp.splitTape = false;
    // CpspRef.cmp.chainPlus = undefined;
    this.show_activity = this.show_activity.filter((obj) => {
      const has_act = CpspRef.cmp.copySelectedProject.activities.findIndex(
        (akt) => akt.id == obj.id && akt.moments.length > 0
      );
      return has_act != -1;
    });

    let const_emty_row = 0;
    // const len = CpspRef.cmp.copySelectedProject.activities.filter(a => a.moments.length > 0).length;
    // this.show_activity.length == len &&
    if (CpspRef.cmp.searchValue == "") {
      let y = 0;
      // to CpspRef.cmp.selectedProject.activities.length;
      for (let i = 0; i < CpspRef.cmp.selectedProject.activities.length; i++) {
        //filter visible moments for visible activity
        if (
          this.show_activity.findIndex(
            (a) => a.id == CpspRef.cmp.selectedProject.activities[i].id
          ) != -1
        ) {
          CpspRef.cmp.selectedProject.activities[i].moments =
            CpspRef.cmp.copySelectedProject.activities[i].moments.filter(
              (obj) => {
                let par_hide = true;
                let parent_index = CpspRef.cmp.copySelectedProject.activities[
                  i
                ].moments.findIndex(
                  (new_obj) =>
                    new_obj.id == obj.parent &&
                    new_obj.state_number == obj.state_number - 1
                );
                if (parent_index != -1) {
                  do {
                    const show_state_parent = this.show_states.findIndex(
                      (sh_s) =>
                        sh_s.id ==
                        CpspRef.cmp.copySelectedProject.activities[i].moments[
                          parent_index
                        ].id
                    );
                    if (
                      show_state_parent != -1 &&
                      this.show_states[show_state_parent].show == "arrow-close"
                    )
                      par_hide = false;
                    parent_index = CpspRef.cmp.copySelectedProject.activities[
                      i
                    ].moments.findIndex(
                      (new_obj) =>
                        new_obj.id ==
                          CpspRef.cmp.copySelectedProject.activities[i].moments[
                            parent_index
                          ].parent &&
                        new_obj.state_number ==
                          CpspRef.cmp.copySelectedProject.activities[i].moments[
                            parent_index
                          ].state_number -
                            1
                    );
                  } while (parent_index != -1);
                }
                return (
                  par_hide &&
                  this.show_activity.find(
                    (a) =>
                      a.id == CpspRef.cmp.copySelectedProject.activities[i].id
                  ).show == "arrow-open"
                );
              }
            );
          let momY = 0;
          for (
            let j = 0;
            j < CpspRef.cmp.selectedProject.activities[i].moments.length;
            j++
          ) {
            CpspRef.cmp.selectedProject.activities[i].moments[j].y = momY;
            momY += ConfigSc.cellHeight;
          }
        }
        //number of empty row on the end screen
        if (CpspRef.cmp.selectedProject.activities[i].description == null) {
          const_emty_row++;
        } else {
          const_emty_row = 0;
        }
        //update y for activity because some moments is invisible
        CpspRef.cmp.selectedProject.activities[i].y = y;
        y +=
          CpspRef.cmp.selectedProject.activities[i].moments.length *
            ConfigSc.cellHeight +
          ConfigSc.cellHeight;
      }

      //calculate y coordinated for moments only when order of moment changes(set calcmoments to true)
      // if(this.calcMoments){
      //   CpspRef.cmp.sortMomentsBySortIndexSelected()
      //   this.calcMoments=false;
      // }

      this.updateInnerContainerHeight();
    } else {
      CpspRef.cmp.filterUsersFromProject();
    }
    if (const_emty_row != 0 && const_emty_row < 10) {
      CpspRef.cmp.fillEmptyRow(10);
      //this.refreshDisplay();
    }

    let needRows = Math.ceil(this.getHeight() / ConfigSc.cellHeight);
    if (this.getNumberOfAllDisplayActivitiesAndMoments() < needRows) {
      CpspRef.cmp.fillEmptyRow(
        needRows - this.getNumberOfAllDisplayActivitiesAndMoments()
      );
      this.updateInnerContainerHeight();
    }

    CpspRef.cmp.visibleColumns = CpspRef.cmp.allColumns.filter(
      (column) => column.isVisible
    );

    let gridVerticalSlider = null;
    if (
      CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getVerticalScrollbar()
    ) {
      gridVerticalSlider = CpspRef.cmp.projectSchedulePlanerApp.gridContainer
        .getVerticalScrollbar()
        .getSlider();
      gridVerticalSlider.updateSliderSize();
      gridVerticalSlider.move(0);
    }
    this.momentTableBodyContainer.getInnerContainer().removeAllChildren();
    CpspRef.cmp.projectSchedulePlanerApp.gridContainer
      .getInnerContainer()
      .removeAllChildren();
    this.renderDateSegmentConnections();
    this.addAllDisplayProjectsThatFitContainerView();

    //mozda
    //CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer().draw();

    CpspRef.cmp.projectSchedulePlanerApp.gridContainer.removeAllLineConnections();
    CpspRef.cmp.drawConnections();
    this.getRowNumbersContainer().refreshDisplay();

    CpspRef.cmp.projectSchedulePlanerApp.sideSection.draw();
    CpspRef.cmp.projectSchedulePlanerApp.gridContainer.draw();

    if (
      CpspRef.cmp.projectSchedulePlanerApp.mainHeader &&
      gridVerticalSlider != null &&
      gridVerticalSlider.getY() != 0
    ) {
      CpspRef.cmp.projectSchedulePlanerApp.mainHeader.draw();
      CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.draw();
    }
    if(CpspRef.cmp.projectSchedulePlanerApp.mainHeader)
    CpspRef.cmp.projectSchedulePlanerApp.mainHeader.onHeaderChange();
    // if (
    //   CpspRef.cmp.projectSchedulePlanerApp.mainHeader &&
    //   CpspRef.cmp.property_index == CpspRef.cmp.revisions.length + 1
    // ) {
    //   historySchedulePlaner.getNumberOfChanges() > 0 &&
    //   CpspRef.cmp.property_index == CpspRef.cmp.revisions.length + 1
    //     ? CpspRef.cmp.projectSchedulePlanerApp.mainHeader
    //         .getHeaderMenu()
    //         .saveButton.setBorder("#FF8787", 1.5)
    //     : CpspRef.cmp.projectSchedulePlanerApp.mainHeader
    //         .getHeaderMenu()
    //         .saveButton.setBorder("#FCF4EC", 1.5);

    //   historySchedulePlaner.getNumberOfChanges() > 0 &&
    //   CpspRef.cmp.property_index == CpspRef.cmp.revisions.length + 1
    //     ? CpspRef.cmp.projectSchedulePlanerApp.mainHeader
    //         .getHeaderMenu()
    //         .saveButton.getFirstChild()
    //         .setColor("#FF8787")
    //     : CpspRef.cmp.projectSchedulePlanerApp.mainHeader
    //         .getHeaderMenu()
    //         .saveButton.getFirstChild()
    //         .setColor("#FCF4EC");

    //   historySchedulePlaner.getNumberOfChanges() == 0 &&
    //   CpspRef.cmp.property_index == CpspRef.cmp.revisions.length + 1 &&
    //   CpspRef.cmp.copySelectedProject != null
    //     ? CpspRef.cmp.projectSchedulePlanerApp.mainHeader
    //         .getHeaderMenu()
    //         .lockButton.setBorder("#FF8787", 1.5)
    //     : CpspRef.cmp.projectSchedulePlanerApp.mainHeader
    //         .getHeaderMenu()
    //         .lockButton.setBorder("#FCF4EC", 1.5);

    //   historySchedulePlaner.getNumberOfChanges() == 0 &&
    //   CpspRef.cmp.property_index == CpspRef.cmp.revisions.length + 1 &&
    //   CpspRef.cmp.copySelectedProject != null
    //     ? CpspRef.cmp.projectSchedulePlanerApp.mainHeader
    //         .getHeaderMenu()
    //         .lockButton.getFirstChild()
    //         .setColor("#FF8787")
    //     : CpspRef.cmp.projectSchedulePlanerApp.mainHeader
    //         .getHeaderMenu()
    //         .lockButton.getFirstChild()
    //         .setColor("#FCF4EC");

    //   CpspRef.cmp.projectSchedulePlanerApp.mainHeader
    //     .getHeaderMenu()
    //     .saveButton.draw();
    //   CpspRef.cmp.projectSchedulePlanerApp.mainHeader
    //     .getHeaderMenu()
    //     .lockButton.draw();
    // }

    // if(CpspRef.cmp.selectedMomentsForStyleChange.length > 1){

    //   this.getCanvas().getContext().save()
    //   this.getCanvas().getContext().globalAlpha = 0.1;
    //   this.getCanvas().getContext().fillStyle = "#F77E04";
    //   this.getCanvas().getContext().fillRect(
    //     -25,
    //     CpspRef.cmp.selectedMomentsForStyleChange[0].y,
    //     this.getWidth() + 20,
    //     CpspRef.cmp.selectedMomentsForStyleChange.length * ConfigSc.cellHeight
    //   );
    //   this.getCanvas().getContext().restore()
    //   //this.renderHighlightedLines(this.selectedMomentsContainer,0,false,true);
    //   const moveY = CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getVerticalScrollbar().getSlider().getHeight() / (ConfigSc.cellHeight);
    //   const numberMove = Number(CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getVerticalScrollbar().getSlider().getY() / moveY).toFixed(2);
    //   const y = CpspRef.cmp.selectedMomentsForStyleChange[0].y - 122 + Number(numberMove) * ConfigSc.cellHeight
    //   const height = y + CpspRef.cmp.selectedMomentsForStyleChange.length * ConfigSc.cellHeight

    //   const line_above1 = new Line(
    //     0,
    //     y,
    //     CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer().getWidth() ,
    //     y,
    //     CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
    //     CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer()
    //   );
    //   line_above1.setColor("#F77E04");
    //   line_above1.setLineThickness(1.5);
    //   line_above1.draw()
    //   const line_bellow1 = new Line(
    //     0,
    //     height ,
    //     CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer().getWidth(),
    //     height,
    //     CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
    //     CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer()
    //   );
    //   line_bellow1.setColor("#F77E04");
    //   line_bellow1.setLineThickness(1.5);
    //   line_bellow1.draw();
    //   CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getVerticalScrollbar().draw()
    // }

    this.drawSelectedContainer();

    if((CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.lockedRevision))
      this.drawShadowOnRevision();
    else {
      this.shadow.style.height = 0 + "px";
      document.getElementById("checkBox").style.pointerEvents = "auto";
    }
    //for find focus when we need resize grid
    if (CpspRef.cmp.needNewApp) {
      CpspRef.cmp.projectSchedulePlanerApp.gridContainer
        .getVerticalScrollbar()
        .getSlider()
        .move(CpspRef.cmp.gridSliderY);
      CpspRef.cmp.projectSchedulePlanerApp.gridContainer
        .getHorizontalScrollbar()
        .getSlider()
        .move(CpspRef.cmp.gridSliderX);
      CpspRef.cmp.needNewApp = false;
    }
  }

  addIcon(
    x: number,
    y: number,
    width: number,
    height: number,
    iconName: string,
    iconPath: string,
    onClickFn: Function,
    parent
  ) {
    const iconShape = new Rectangle(x, y, width, height, this.canvas, parent);
    iconShape.addBackgroundImagePattern(iconName, iconPath, width, height);
    iconShape.setOnClickHandler(onClickFn);
    iconShape.setOnMouseHoverHandler(
      () => (document.body.style.cursor = "pointer")
    );

    return iconShape;
  }

  getNumberOfAllDisplayActivitiesAndMoments() {
    return CpspRef.cmp.selectedProject.activities.reduce(
      (total, activity) => (total += activity.moments.length + 1),
      0
    );
  }
}
