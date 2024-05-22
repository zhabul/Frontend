import * as moment from "moment";
import { ARoundedContainer } from "src/app/canvas-ui/ARoundedContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { Config } from "src/app/moments/project-moments/resource-planning-app/Config";
import { IMovable } from "src/app/canvas-ui/interfaces/IMovable";
import { IResizable } from "src/app/canvas-ui/interfaces/IResizable";
import { CmpRef } from "../../CmpRef";
import { AbsenceSegmentDataRef } from "../../models/AbsenceSegmentDataRef";
import history from "src/app/canvas-ui/history/history";
import { AbsenceSegmentData } from "../../models/AbsenceSegmentData";

export class AbsenceSegment
    extends ARoundedContainer
    implements IMovable, IResizable {
    private startingX = 0;
    private startingWidth = 0;
    private absenceSegmentDataRef: AbsenceSegmentDataRef;
    private nextX;
    private beforeX;
    private needSave;

    constructor(
        x: number,
        y: number,
        width: string | number,
        height: string | number,
        canvas: Canvas,
        parent,
        ref: AbsenceSegmentDataRef
    ) {
        super(x, y, width, height, canvas, parent);

        this.absenceSegmentDataRef = ref;

        const user = CmpRef.cmp.allDisplayProjects[this.absenceSegmentDataRef.projectIndex].users[this.absenceSegmentDataRef.userIndex];

        for(let i = this.absenceSegmentDataRef.index + 1; i < user.absences.length; i++){
          if(user.absences[this.absenceSegmentDataRef.index].approved == user.absences[i].approved &&
            user.absences[this.absenceSegmentDataRef.index].type == user.absences[i].type )
            {
              this.nextX = user.absences[i].x;
              break;
            }
        }
        for(let j = this.absenceSegmentDataRef.index - 1; j >= 0; j--){
          if(user.absences[this.absenceSegmentDataRef.index].approved == user.absences[j].approved &&
            user.absences[this.absenceSegmentDataRef.index].type == user.absences[j].type )
            {
              this.beforeX = user.absences[j].x + user.absences[j].numberOfDays * Config.cellWidth;
              break;
            }
        }

        this.setOnMouseHoverHandler((e) => {
            if (!Config.isInEditMode) return;
            document.body.style.cursor = "e-resize";
            // if (
            //     ( e.layerX <= this.getGlobalX() + 5 && this.beforeX == undefined ) ||
            //     ( e.layerX >= this.getGlobalX() + this.getWidth() - 5 && this.nextX == undefined )
            // )
            if (
              e.layerX <= this.getGlobalX() + 5 ||
              e.layerX >= this.getGlobalX() + this.getWidth() - 5
            )
                document.body.style.cursor = "col-resize";
        });

        this.setBorderRoundness(4);
        this.setOnMouseDownHandler((e) => {
            if (!Config.isInEditMode) return;

            if(user.absences.filter((absence) => absence.id == user.absences[this.absenceSegmentDataRef.index].id).length > 1){
              CmpRef.cmp.toastrMessage(
                    "info",
                    CmpRef.cmp
                      .getTranslate()
                      .instant("Can't move a half-answered absence!")
                  );
              return;
            }

            this.needSave = false;
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

    move(x: number): void {
        this.setX(this.getX() + x);
    }

    resize(
        amountResized: number,
        anchor: "left" | "up" | "right" | "down"
    ): void {
        switch (anchor) {
            case "left":
                if(
                  this.beforeX != undefined &&
                  this.getX() + amountResized < this.beforeX
                )
                return;

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
                if(
                  this.nextX != undefined &&
                  this.getX() + this.getWidth() + amountResized > this.nextX
                )
                return;

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

    private mouseMoveHandler(e) { } // used in setMoveAndResizeEvents

    fitAccordingToCellGridSize() {
        const newX = Math.round(this.getX() / Config.cellWidth) * Config.cellWidth;
        const newWidth = Math.max(
            Math.round(this.getWidth() / Config.cellWidth) * Config.cellWidth,
            Config.cellWidth
        );

        this.setWidth(newWidth);
        this.setX(newX);

        if (this.startingWidth === newWidth && this.startingX === newX) return;

        const ref = this.absenceSegmentDataRef;
        const project = CmpRef.cmp.allDisplayProjects[ref.projectIndex];
        const user = project.users[ref.userIndex];
        const absenceSegmentData = user.absences[ref.index];

        if (absenceSegmentData.id < 0) {
            CmpRef.cmp.toastrMessage(
                "error",
                CmpRef.cmp.getTranslate().instant("RPC_Can_not_move_absence")
            );
            CmpRef.cmp.planningApp.projectUsersContainer.refreshDisplay();
            CmpRef.cmp.planningApp.resourcePlanningContainer.refreshDisplay();
            return;
        }

        const previousState: AbsenceSegmentData = JSON.parse(
            JSON.stringify(absenceSegmentData)
        );
        this.updateSegmentAfterMoveOrResize(
            ref,
            { x: newX, width: newWidth },
            previousState
        );

        CmpRef.cmp.allDisplayProjects.forEach((p) => {
            p.users.forEach((u) => {
                u.absences = u.absences.map((absence) => {
                    return absence.id === absenceSegmentData.id
                        ? absenceSegmentData
                        : absence;
                });
            });
        });

        CmpRef.cmp.allDisplayProjectsOriginal.forEach((p) => {
            p.users.forEach((u) => {
                u.absences = u.absences.map((absence) => {
                    return absence.id === absenceSegmentData.id
                        ? absenceSegmentData
                        : absence;
                });
            });
        });

        CmpRef.cmp.allUsers.forEach((u) => {
            u.absences = u.absences.map((absence) => {
                return absence.id === absenceSegmentData.id
                    ? absenceSegmentData
                    : absence;
            });
        });
        if(!this.needSave)
        history.addToQueue(
            () => CmpRef.cmp.updateAbsenceSegment(absenceSegmentData),
            () => CmpRef.cmp.updateAbsenceSegment(previousState),
            {
                type: "absence-change",
                userId: user.id,
                message: `Your absence date has been updated (${absenceSegmentData.type})`,
            }
        );

        CmpRef.cmp.planningApp.projectUsersContainer.refreshDisplay();
        CmpRef.cmp.planningApp.resourcePlanningContainer.refreshDisplay();
    }

    updateSegmentAfterMoveOrResize(
        ref: AbsenceSegmentDataRef,
        data: { x: number; width: number },
        previousState: AbsenceSegmentData
    ) {
        const segmentData =
            CmpRef.cmp.allDisplayProjects[ref.projectIndex].users[ref.userIndex]
                .absences[ref.index];

        const newStartDate = moment(segmentData.startDate, Config.dateFormat);
        newStartDate.add((data.x - segmentData.x) / Config.cellWidth, "days");

        const pomX = segmentData.x;
        const pomDays = segmentData.numberOfDays;
        const pomStartDate = moment(segmentData.startDate, Config.dateFormat);


        segmentData.x = data.x;
        segmentData.numberOfDays = data.width / Config.cellWidth;

        segmentData.startDate = newStartDate.format(Config.dateFormat);
        segmentData.startWeekDate = newStartDate.format(Config.dateWeekFormat);

        const weeks = this.splitDateRangeInWeeks(
            moment(newStartDate),
            moment(newStartDate).add(segmentData.numberOfDays - 1, "days")
        );

        let zeroDay = false;
        if(weeks[0].numberOfDays == 0 || newStartDate.isoWeekday() > 5){
          weeks.shift();
          zeroDay = true;
        }

        const firstWeek = weeks.shift();

        if(firstWeek == undefined){
          this.needSave = true;
          segmentData.x = pomX;
          segmentData.numberOfDays = pomDays;
          segmentData.startDate = pomStartDate.format(Config.dateFormat);
          segmentData.startWeekDate = pomStartDate.format(Config.dateWeekFormat);
          return;
        }

        segmentData.numberOfDays = firstWeek.numberOfDays == 0 ? firstWeek.numberOfDays + 2 : firstWeek.numberOfDays;
        newStartDate.add(segmentData.numberOfDays - 1, "days");
        segmentData.endDate = newStartDate.format(Config.dateFormat);
        segmentData.endWeekDate = newStartDate.format(Config.dateWeekFormat);

        if(segmentData.numberOfDays == pomDays && segmentData.numberOfDays * Config.cellWidth != data.width)
          this.needSave = true;

        if (weeks.length == 0){
          if(zeroDay){
            this.needSave = true;
            segmentData.x = pomX;
            segmentData.numberOfDays = pomDays;
            segmentData.startDate = pomStartDate.format(Config.dateFormat);
            segmentData.startWeekDate = pomStartDate.format(Config.dateWeekFormat);
          }
          return;
        }
        const userId =
            CmpRef.cmp.allDisplayProjects[ref.projectIndex].users[ref.userIndex].id;

        let lastX =
            segmentData.x + (segmentData.numberOfDays + 2) * Config.cellWidth;

        weeks.forEach((week) => {
            const newSegmentData = JSON.parse(JSON.stringify(segmentData));

            newSegmentData.id = -Math.round(Math.random() * 10000000);

            newSegmentData.x = lastX;
            newSegmentData.numberOfDays = week.numberOfDays;

            newSegmentData.startDate = week.startDate.format(Config.dateFormat);
            newSegmentData.startWeekDate = week.startDate.format(
                Config.dateWeekFormat
            );

            week.startDate.add(newSegmentData.numberOfDays - 1, "days");
            newSegmentData.endDate = week.startDate.format(Config.dateFormat);
            newSegmentData.endWeekDate = week.startDate.format(Config.dateWeekFormat);

            const user = CmpRef.cmp.allDisplayProjects.find(p => p.users.some(u => u.id == userId))?.users.find(u => u.id == userId);

            if(user) {
                const a1 = user.absences.some(a => moment(newSegmentData.endDate).isBetween(moment(a.startDate), moment(a.endDate), undefined, '[]'));
                const a2 = user.absences.some(a => moment(newSegmentData.startDate).isBetween(moment(a.startDate), moment(a.endDate), undefined, '[]'));

                const a3 = user.absences.some(a =>
                    moment(a.startDate).isBetween(moment(newSegmentData.startDate), moment(newSegmentData.endDate), undefined, '[]') ||
                    moment(a.endDate).isBetween(moment(newSegmentData.startDate), moment(newSegmentData.endDate), undefined, '[]')
                );

                if(a1 || a2 || a3) {
                    return;
                }
            }

            CmpRef.cmp.allUsers
                .find((u) => u.id == userId)
                .absences.push(newSegmentData);

            CmpRef.cmp.allDisplayProjects.forEach((p) => {
                p.users.forEach((u) => {
                    if (u.absences.some((a) => a.id == segmentData.id)) {
                        u.absences.push(newSegmentData);
                    }
                });
            });

            CmpRef.cmp.allDisplayProjectsOriginal.forEach((p) => {
                p.users.forEach((u) => {
                    if (u.absences.some((a) => a.id == segmentData.id)) {
                        u.absences.push(newSegmentData);
                    }
                });
            });

            lastX =
                newSegmentData.x + (segmentData.numberOfDays + 2) * Config.cellWidth;
            if(!this.needSave)
            history.addToQueue(
                () => CmpRef.cmp.createAbsenceSegment(previousState.id, newSegmentData),
                () => CmpRef.cmp.createAbsenceSegment(previousState.id, newSegmentData)
            );
        });
    }

    splitDateRangeInWeeks(
        startDate: moment.Moment,
        endDate: moment.Moment
    ): any[] {
        const weeks = {};
        let lastKey = null;

        for (let m = startDate; m.diff(endDate, "days") <= 0; m.add(1, "days")) {
            const key = m.format(Config.dateWeekFormat);

            if (lastKey !== null && key !== lastKey) {
                weeks[lastKey].numberOfDays = Math.abs(
                    weeks[lastKey].startDate.diff(moment(m).add(-2, "days"), "days")
                );
            }

            if (!weeks.hasOwnProperty(key)) {
                weeks[key] = {
                    startDate: moment(m),
                    numberOfDays: null,
                };
            }

            lastKey = key;
        }

        while(endDate.isoWeekday() > 5){
          endDate.add(-1,"days");
        }

        weeks[lastKey].numberOfDays = Math.abs(
            weeks[lastKey].startDate.diff(moment(endDate), "days")
        ) + 1;

        return Object.values(weeks);
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

        this.canvas.getContext().save();

        this.drawShape(this.canvas.getContext());
        this.canvas.getContext().clip();
        this.children.forEach((child) => child.draw());

        this.canvas.getContext().restore();
    }
}
