import * as moment from "moment";
import { ARoundedContainer } from "src/app/canvas-ui/ARoundedContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { Config } from "src/app/moments/project-moments/resource-planning-app/Config";
import { IMovable } from "src/app/canvas-ui/interfaces/IMovable";
import { IResizable } from "src/app/canvas-ui/interfaces/IResizable";
import { CmpRef } from "../../CmpRef";
import { DateSegmentDataRef } from "../../models/DateSegmentDataRef";
import history from "src/app/canvas-ui/history/history";
import { DateSegmentData } from "../../models/DateSegmentData";
import { Project } from "../../models/Project";
import { User } from "../../models/User";

export class DateSegment
  extends ARoundedContainer
  implements IMovable, IResizable
{
  private startingX = 0;
  private startingWidth = 0;
  private dateSegmentDataRef: DateSegmentDataRef;

  constructor(
    x: number,
    y: number,
    width: string | number,
    height: string | number,
    canvas: Canvas,
    parent,
    ref: DateSegmentDataRef
  ) {
    super(x, y, width, height, canvas, parent);
    this.dateSegmentDataRef = ref;

    this.setBorderRoundness(8);

    this.setOnMouseHoverHandler((e) => {
      if (!Config.isInEditMode) return;
      document.body.style.cursor = "e-resize";
      if (
        e.layerX <= this.getGlobalX() + 5 ||
        e.layerX >= this.getGlobalX() + this.getWidth() - 5
      )
        document.body.style.cursor = "col-resize";
    });

    if (
      CmpRef.cmp.allDisplayProjects[ref.projectIndex].id <= 0 ||
      CmpRef.cmp.allDisplayProjects[ref.projectIndex].users[ref.userIndex]
        .isResponsiblePerson
    ) {
      this.setOnMouseHoverHandler((e) => {
        document.body.style.cursor = "not-allowed";
      });
    } else {
      this.setOnMouseDownHandler((e) => {
        
        if (!Config.isInEditMode) return;
        if (CmpRef.cmp.splitDateSegmentOnClick) {
          const splitDateIndex = Math.floor(
            (e.layerX - this.getGlobalX()) / Config.cellWidth
          );
          const ref = this.dateSegmentDataRef;
          const project = CmpRef.cmp.allDisplayProjects[ref.projectIndex];
          const user = project.users[ref.userIndex];
          const dateSegmentData = user.dateSegments[ref.dateSegmentIndex];
          const previousState: DateSegmentData = JSON.parse(
            JSON.stringify(dateSegmentData)
          );
          const dateSegmentCopy: DateSegmentData = JSON.parse(
            JSON.stringify(dateSegmentData)
          );
          const splitOnDate = moment(
            dateSegmentData.startDate,
            Config.dateFormat
          )
            .add(splitDateIndex, "days")
            .format(Config.dateFormat);
          const splitOnDateMoment = moment(splitOnDate, Config.dateFormat);

          if (
            splitOnDate === dateSegmentData.startDate ||
            splitOnDate === dateSegmentData.endDate
          )
            return;

          dateSegmentData.endDate = splitOnDate;
          dateSegmentData.endWeekDate = splitOnDateMoment.format(
            Config.dateWeekFormat
          );
          dateSegmentData.numberOfDays =
            splitOnDateMoment.diff(
              moment(dateSegmentData.startDate, Config.dateFormat),
              "days"
            ) + 1;

          dateSegmentCopy.id = -Math.round(Math.random() * 10000000); // placeholder id
          dateSegmentCopy.startDate = splitOnDateMoment
            .add(1, "days")
            .format(Config.dateFormat);
          dateSegmentCopy.startWeekDate = splitOnDateMoment
            .add(1, "days")
            .format(Config.dateWeekFormat);
          dateSegmentCopy.numberOfDays =
            moment(dateSegmentCopy.endDate, Config.dateFormat).diff(
              moment(dateSegmentCopy.startDate, Config.dateFormat),
              "days"
            ) + 1;
          user.dateSegments.push(dateSegmentCopy);

          history.appendToQueueGroup(
            () => CmpRef.cmp.updateDateSegment(dateSegmentData),
            () => CmpRef.cmp.updateDateSegment(previousState),
            {
              type: "date-change",
              userId: user.id,
              message: `Your work date has been updated on project (${project.name})`,
            }
          );
          history.appendToQueueGroup(
            async () => {
              const createdDateSegmentId =
                await CmpRef.cmp.addDateSegmentToUserFromPlanning(
                  project.id,
                  user.id,
                  dateSegmentCopy.startDate,
                  dateSegmentCopy.endDate
                );
              if (!createdDateSegmentId) return false;
              history.setTempId(dateSegmentCopy.id, createdDateSegmentId);
              return true;
            },
            () =>
              CmpRef.cmp.removeDateSegmentFromResourcePlanning(
                dateSegmentCopy.id
              )
          );

          this.sortDateSegmentsByEndDate(user.dateSegments);

          CmpRef.cmp.planningApp.projectUsersContainer.refreshDisplay();
          CmpRef.cmp.planningApp.resourcePlanningContainer.refreshDisplay();

          return;
        }
        this.canvas.addDrawingContainer(this.parent.getParent().getParent());
        this.setMoveAndResizeEvents(e);
        this.canvas.getCanvasElement().onmousemove = (ev) => {
          this.mouseMoveHandler(ev);
        };
        this.addRemoveEventsForMouseDownEvent(() => {
          this.fitAccordingToCellGridSize();
          this.canvas.resetDrawingContainers();
        });
      });
    }
  }

  private sortDateSegmentsByEndDate(dateSegments: DateSegmentData[]) {
    dateSegments.sort((a, b) => {
      if (a.endDate < b.endDate) return -1;
      if (a.endDate > b.endDate) return 1;
      return 0;
    });
  }

  move(x: number): void {
    this.setX(this.getX() + x);
  }

  resize(
    amountResized: number,
    anchor: "left" | "up" | "right" | "down"
  ): void {
    switch (anchor) {
      case "left":
        if (
          this.getX() + amountResized >
          this.getX() + this.getWidth() - Config.cellWidth
        ) {
          this.setX(this.getX() + this.getWidth() - Config.cellWidth);
          return this.setWidth(Config.cellWidth);
        }

        this.setWidth(this.getWidth() - amountResized);
        this.move(amountResized);
        break;
      case "right":
        if (this.getWidth() + amountResized < Config.cellWidth) {
          return this.setWidth(Config.cellWidth);
        }

        this.setWidth(this.getWidth() + amountResized);
        break;
      case "up":
        throw Error("Not Implemented");
      case "down":
        throw Error("Not Implemented");
    }
  }

  setMoveAndResizeEvents(e) {
    this.startingX = this.getX();
    this.startingWidth = this.getWidth();

    document.body.style.cursor = "e-resize";

    this.mouseMoveHandler = (e) => {
      this.move(e.movementX);
    };

    if (e.layerX <= this.getGlobalX() + 5) {
      document.body.style.cursor = "col-resize";

      this.mouseMoveHandler = (e) => {
        this.resize(e.movementX, "left");
      };
    }

    if (e.layerX >= this.getGlobalX() + this.getWidth() - 5) {
      document.body.style.cursor = "col-resize";

      this.mouseMoveHandler = (e) => {
        this.resize(e.movementX, "right");
      };
    }
  }

  private mouseMoveHandler(e) {} // used in setMoveAndResizeEvents

  private fitAccordingToCellGridSize() {
    const newX = Math.round(this.getX() / Config.cellWidth) * Config.cellWidth;
    const newWidth = Math.max(
      Math.ceil(this.getWidth() / Config.cellWidth) * Config.cellWidth,
      Config.cellWidth
    );

    this.setWidth(newWidth);
    this.setX(newX);

    if (this.startingWidth === newWidth && this.startingX === newX) return;

    const ref = this.dateSegmentDataRef;
    const project = CmpRef.cmp.allDisplayProjects[ref.projectIndex];
    const user = project.users[ref.userIndex];
    const dateSegmentData = user.dateSegments[ref.dateSegmentIndex];
    const previousState: DateSegmentData = JSON.parse(
      JSON.stringify(dateSegmentData)
    );

    const status: any = this.checkIfIsOverProjectOrSubProjectTimeRange(
      project,
      user,
      ref,
      { x: newX, width: newWidth }
    );

    if (!status) {
      CmpRef.cmp.planningApp.projectUsersContainer.refreshDisplay();
      CmpRef.cmp.planningApp.resourcePlanningContainer.refreshDisplay();
      return;
    }

    if (status.length > 0) {
      const removed = status.filter((x) => x.type == "remove");
      if (removed.length > 0) {
        let message =
          CmpRef.cmp
            .getTranslate()
            .instant(
              "This action will remove the user from these subprojects"
            ) + " ";

        removed.forEach((x) => {
          message += x.name;
        });

        CmpRef.cmp.showConfirmationModal(message, (response) => {
          if (response.result) {
            this.updateSegmentAfterMoveOrResize(ref, {
              x: newX,
              width: newWidth,
            });

            history.addToQueue(
              () => CmpRef.cmp.updateDateSegment(dateSegmentData),
              () => CmpRef.cmp.updateDateSegment(previousState),
              {
                type: "date-change",
                userId: user.id,
                message: `Your work date has been updated on project (${project.name})`,
              }
            );
          }
          CmpRef.cmp.planningApp.projectUsersContainer.refreshDisplay();
          CmpRef.cmp.planningApp.resourcePlanningContainer.refreshDisplay();
        });
        return;
      }
    }

    this.updateSegmentAfterMoveOrResize(ref, { x: newX, width: newWidth });

    history.addToQueue(
      () => CmpRef.cmp.updateDateSegment(dateSegmentData),
      () => CmpRef.cmp.updateDateSegment(previousState),
      {
        type: "date-change",
        userId: user.id,
        message: `Your work date has been updated on project (${project.name})`,
      }
    );

    CmpRef.cmp.planningApp.projectUsersContainer.refreshDisplay();
    CmpRef.cmp.planningApp.resourcePlanningContainer.refreshDisplay();
  }

  private checkIfIsOverProjectOrSubProjectTimeRange(
    project: Project,
    user: User,
    ref: DateSegmentDataRef,
    data: { x: number; width: number }
  ) {
    const segmentData = user.dateSegments[ref.dateSegmentIndex];
    const newStartDate = moment(segmentData.startDate, Config.dateFormat);
    newStartDate.add((data.x - segmentData.x) / Config.cellWidth, "days");

    const newEndDate = newStartDate
      .clone()
      .add(data.width / Config.cellWidth - 1, "days");

    if (moment(project.endDate, Config.dateFormat).isBefore(newEndDate)) {
      return false;
    }

    if (
      moment(user.endDateContract, Config.dateFormat).isBefore(newEndDate) ||
      moment(user.startDateContract, Config.dateFormat).isAfter(newEndDate)
    ) {
      CmpRef.cmp.toastrMessage(
        "info",
        CmpRef.cmp
          .getTranslate()
          .instant("RPC_WORKER_DATE", { worker: user.name })
      );
      return false;
    }

    const projectsAffected = [];

    for (let i = 0; i < user.subProjects.length; i++) {
      const subProject = user.subProjects[i];

      if (
        newEndDate.isBefore(moment(subProject.startDate, Config.dateFormat)) || // remove
        (newStartDate.isAfter(moment(subProject.endDate, Config.dateFormat)) &&
          subProject.projectid != project.id) // remove
      ) {
        const projectName = project.subProjects.find(
          (up) => up.projectId == subProject.projectid
        )?.name;
        if(projectName != undefined) {
            projectsAffected.push({
                projectId: subProject.projectid,
                type: "remove",
                name: projectName,
              });
        }
      } else if (
        newEndDate.isBefore(moment(subProject.endDate, Config.dateFormat)) || // shrink from end
        newStartDate.isAfter(moment(subProject.startDate, Config.dateFormat)) // shrink from start
      ) {
        projectsAffected.push({
          projectId: subProject.projectid,
          type: "shrink",
        });
      }
    }

    projectsAffected.forEach((p) => {
      if (p.type == "shrink") {
        const userProject = user["subProjects"].find(
          (up) => up.projectid == p.projectId
        );

        if (userProject) {
          if (
            newEndDate.isBefore(moment(userProject.endDate, Config.dateFormat))
          ) {
            userProject.endDate = newEndDate.format(Config.dateFormat);
          } else if (
            newStartDate.isBefore(
              moment(userProject.startDate, Config.dateFormat)
            )
          ) {
            userProject.startDate = newStartDate.format(Config.dateFormat);
          }
        }
      } else {
        user["subProjects"].splice(
          user["subProjects"].findIndex((up) => up.projectid == p.projectId),
          1
        );
      }
    });

    return projectsAffected;
  }

  private updateSegmentAfterMoveOrResize(
    ref: DateSegmentDataRef,
    data: { x: number; width: number }
  ) {
    const segmentData =
      CmpRef.cmp.allDisplayProjects[ref.projectIndex].users[ref.userIndex]
        .dateSegments[ref.dateSegmentIndex];

    const newStartDate = moment(segmentData.startDate, Config.dateFormat);
    newStartDate.add((data.x - segmentData.x) / Config.cellWidth, "days");

    let overlap = false;

    if (
      typeof CmpRef.cmp.allDisplayProjects[ref.projectIndex].users[
        ref.userIndex
      ].dateSegments[ref.dateSegmentIndex + 1] !== "undefined"
    ) {
      const nextDateSegment =
        CmpRef.cmp.allDisplayProjects[ref.projectIndex].users[ref.userIndex]
          .dateSegments[ref.dateSegmentIndex + 1];
      const newEndDate = newStartDate
        .clone()
        .add(data.width / Config.cellWidth - 1, "days");

      const nextStartDate = moment(
        nextDateSegment.startDate,
        Config.dateFormat
      );
      const nextEndDate = moment(nextDateSegment.endDate, Config.dateFormat);

      if (
        newEndDate.isSameOrAfter(nextStartDate) &&
        newEndDate.isSameOrBefore(nextEndDate)
      ) {
        segmentData.endDate = nextStartDate
          .clone()
          .add(-1, "days")
          .format(Config.dateFormat);
        segmentData.endWeekDate = nextStartDate
          .clone()
          .add(-1, "days")
          .format(Config.dateWeekFormat);

        segmentData.numberOfDays = nextStartDate.diff(newStartDate, "days");
        overlap = true;
      }
    } else if (
      typeof CmpRef.cmp.allDisplayProjects[ref.projectIndex].users[
        ref.userIndex
      ].dateSegments[ref.dateSegmentIndex - 1] !== "undefined"
    ) {
      const previusDateSegment =
        CmpRef.cmp.allDisplayProjects[ref.projectIndex].users[ref.userIndex]
          .dateSegments[ref.dateSegmentIndex - 1];

      const previusStartDate = moment(
        previusDateSegment.startDate,
        Config.dateFormat
      );
      const previusEndDate = moment(
        previusDateSegment.endDate,
        Config.dateFormat
      );

      if (
        newStartDate.isSameOrAfter(previusStartDate) &&
        newStartDate.isSameOrBefore(previusEndDate)
      ) {
        segmentData.startDate = previusEndDate
          .clone()
          .add(1, "days")
          .format(Config.dateFormat);
        segmentData.startWeekDate = previusEndDate
          .clone()
          .add(1, "days")
          .format(Config.dateWeekFormat);

        segmentData.x =
          previusDateSegment.x +
          (previusDateSegment.numberOfDays + 1) * Config.cellWidth;
        segmentData.numberOfDays = moment(
          segmentData.endDate,
          Config.dateFormat
        ).diff(previusEndDate, "days");
        overlap = true;
      }
    }

    if (!overlap) {
      segmentData.x = data.x;
      segmentData.numberOfDays = data.width / Config.cellWidth;
      segmentData.startDate = newStartDate.format(Config.dateFormat);
      segmentData.startWeekDate = newStartDate.format(Config.dateWeekFormat);
      newStartDate.add(segmentData.numberOfDays - 1, "days");
      segmentData.endDate = newStartDate.format(Config.dateFormat);
      segmentData.endWeekDate = newStartDate.format(Config.dateWeekFormat);
    }
  }

  override draw() {
    const gridContainer = CmpRef.cmp.planningApp.gridContainer;
    if (
      this.getGlobalX() + this.getWidth() <= gridContainer.getGlobalX() ||
      this.getGlobalX() >=
        gridContainer.getGlobalX() + gridContainer.getWidth() ||
      this.getGlobalY() + this.getHeight() <= gridContainer.getGlobalY() ||
      this.getGlobalY() >=
        gridContainer.getGlobalY() + gridContainer.getHeight()
    )
      return;
    super.draw();
  }
}
