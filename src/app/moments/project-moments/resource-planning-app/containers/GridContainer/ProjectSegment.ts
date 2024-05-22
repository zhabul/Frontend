import * as moment from "moment";
import { ARoundedContainer } from "src/app/canvas-ui/ARoundedContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { Config } from "src/app/moments/project-moments/resource-planning-app/Config";
import { GenericRoundedContainer } from "src/app/canvas-ui/GenericRoundedContainer";
import { IMovable } from "src/app/canvas-ui/interfaces/IMovable";
import { IResizable } from "src/app/canvas-ui/interfaces/IResizable";
import { TextRenderer } from "src/app/canvas-ui/TextRenderer";
import { CmpRef } from "../../CmpRef";
import history from "src/app/canvas-ui/history/history";
import { Project } from "../../models/Project";

export class ProjectSegment
    extends ARoundedContainer
    implements IMovable, IResizable {
    private startingX = 0;
    private startingWidth = 0;
    private projectRefIndex: number;
    private cursorChangeTimeout;
    private onClickHandler: Function = () => { };

    constructor(
        x: number,
        y: number,
        width: string | number,
        height: string | number,
        canvas: Canvas,
        parent,
        projectRefIndex: number
    ) {
        super(x, y, width, height, canvas, parent);

        this.projectRefIndex = projectRefIndex;

        this.setOnMouseHoverHandler((e) => {
            if (!Config.isInEditMode) return;
            document.body.style.cursor = "e-resize";
            if (
                e.layerX <= this.getGlobalX() + 5 ||
                e.layerX >= this.getGlobalX() + this.getWidth() - 5
            )
                document.body.style.cursor = "col-resize";
        });

        this.setBorderRoundness(8);
        if (
            CmpRef.cmp.allDisplayProjects[this.projectRefIndex].id > 0 &&
            Config.isInEditMode
        ) {
            this.setOnMouseDownHandler((e) => {
                this.setMoveAndResizeEvents(e);
                this.canvas.addDrawingContainer(this.parent.getParent().getParent());
                this.canvas.getCanvasElement().onmousemove = (ev) => {
                    this.mouseMoveHandler(ev);
                };
                this.addRemoveEventsForMouseDownEvent((e2) => {
                    document.body.style.cursor = "default";
                    clearTimeout(this.cursorChangeTimeout);
                    if (e.screenX === e2.screenX) return this.onClickHandler(this);
                    this.fitAccordingToCellGridSize();
                    this.canvas.resetDrawingContainers();
                });
            });
        }
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

    override setOnClickHandler(handler: Function) {
        this.onClickHandler = handler;
    }

    getProjectRefIndex() {
        return this.projectRefIndex;
    }

    setMoveAndResizeEvents(e) {
        this.startingX = this.getX();
        this.startingWidth = this.getWidth();

        this.cursorChangeTimeout = setTimeout(() => {
            document.body.style.cursor = "e-resize";
        }, 100);

        this.mouseMoveHandler = (e) => {
            this.move(e.movementX);
        };

        if (e.layerX <= this.getGlobalX() + 5) {
            this.cursorChangeTimeout = setTimeout(() => {
                document.body.style.cursor = "col-resize";
            }, 100);

            this.mouseMoveHandler = (e) => {
                this.resize(e.movementX, "left");
            };
        }

        if (e.layerX >= this.getGlobalX() + this.getWidth() - 5) {
            this.cursorChangeTimeout = setTimeout(() => {
                document.body.style.cursor = "col-resize";
            }, 100);

            this.mouseMoveHandler = (e) => {
                this.resize(e.movementX, "right");
            };
        }
    }

    displayProjectSegmentWeeks() {
        const project = CmpRef.cmp.allDisplayProjects[this.projectRefIndex];

        const date = moment(project.startDate, Config.dateFormat);
        let x = 0;
        let week = date.isoWeek().toString().padStart(2, "0");
        let weekYear = date.isoWeekYear();
        let numberOfDays = 0;

        while (date.format(Config.dateFormat) <= project.endDate) {
            numberOfDays++;
            date.add(1, "days");

            if (
                date.format(Config.dateFormat) > project.endDate ||
                week !== date.isoWeek().toString().padStart(2, "0")
            ) {
                const resourceWeek = `${weekYear}-${week}`;
                let resourcesNeeded = project.resourceWeeks[resourceWeek]
                    ? project.resourceWeeks[resourceWeek]
                    : 0;
                const width = numberOfDays * Config.cellWidth;

                const resourceWeekContainer = new GenericRoundedContainer(
                    x,
                    0,
                    width,
                    this.getHeight(),
                    this.getCanvas(),
                    this
                );
                resourceWeekContainer.setBackgroundColor("rgba(0, 0, 0, 0.35)");
                resourceWeekContainer.setBorderRoundness(5);

                let numberOfWorkersWorking =
                    CmpRef.cmp.planningApp.projectUsersContainer.getNumberOfWorkersWorkingOnProjectForWeek(
                        project,
                        resourceWeek
                    );

                if (project.id <= 0) {
                    resourcesNeeded = numberOfWorkersWorking;
                    numberOfWorkersWorking =
                        CmpRef.cmp.planningApp.projectUsersContainer.getNumberOfWorkersInResourceForWeek(
                            resourceWeek
                        );
                }

                const resourceWeekText = new TextRenderer(
                    `${resourcesNeeded}/${numberOfWorkersWorking}`,
                    this.getCanvas(),
                    resourceWeekContainer
                );
                resourceWeekText.setColor("white");
                resourceWeekText.setAlignment("center", "center");
                resourceWeekText.updateTextDimensions();
                if (project.id > 0 && Config.isInEditMode) {
                    resourceWeekText.setOnMouseDownHandler(() => {
                        this.getCanvas().getCanvasElement().onmouseup = (e2: any) => {
                            this.getCanvas().getCanvasElement().onmouseup = null;
                            if (!resourceWeekText.isShapeClicked(e2.layerX, e2.layerY))
                                return;

                            CmpRef.cmp.resourceWeekInput.style.display = "block";
                            CmpRef.cmp.resourceWeekInput.style.height = `${Config.cellHeight - 3
                                }px`;
                            CmpRef.cmp.resourceWeekInput.value = resourceWeekText
                                .getTextContent()
                                .split("/")[0];
                            CmpRef.cmp.resourceWeekInput.style.top = `${resourceWeekContainer.getGlobalY()}px`;
                            const x =
                                Config.sidebarSize +
                                resourceWeekContainer.getGlobalX() +
                                resourceWeekContainer.getWidth() / 2;
                            CmpRef.cmp.resourceWeekInput.style.left = `${x}px`;
                            CmpRef.cmp.resourceWeekInput.focus();
                            CmpRef.cmp.resourceWeekInput.select();
                            CmpRef.cmp.selectedResourceWeekDataForEditing = {
                                project,
                                resourceWeek,
                                resourceWeekTextShape: resourceWeekText,
                            };
                        };
                    });
                }

                x += width;
                numberOfDays = 0;
            }

            week = date.isoWeek().toString().padStart(2, "0");
            weekYear = date.isoWeekYear();
        }
    }

    private mouseMoveHandler(e) { } // used in setMoveAndResizeEvents

    private fitAccordingToCellGridSize() {
        const newX = Math.round(this.getX() / Config.cellWidth) * Config.cellWidth;
        const newWidth = Math.max(
            Math.round(this.getWidth() / Config.cellWidth) * Config.cellWidth,
            Config.cellWidth
        );

        this.setWidth(newWidth);
        this.setX(newX);

        if (this.startingWidth === newWidth && this.startingX === newX) return;

        const projectData = CmpRef.cmp.allDisplayProjects[this.projectRefIndex];
        const previousState = JSON.parse(JSON.stringify(projectData));
        this.updateProjectAfterMoveOrResize(projectData, {
            x: newX,
            width: newWidth,
        });

        history.addToQueue(
            () => CmpRef.cmp.updateProjectSegment(projectData),
            () => CmpRef.cmp.updateProjectSegment(previousState)
        );

        projectData.users.forEach((user) => {
            if (!user.isResponsiblePerson) return;
            user.dateSegments[0].startDate = projectData.startDate;
            user.dateSegments[0].endDate = projectData.endDate;
            user.dateSegments[0].startWeekDate = projectData.startWeekDate;
            user.dateSegments[0].endWeekDate = projectData.endWeekDate;
            user.dateSegments[0].numberOfDays = projectData.numberOfDays;
            user.dateSegments[0].x = projectData.x;
        });

        CmpRef.cmp.planningApp.projectUsersContainer.refreshDisplay();
        CmpRef.cmp.planningApp.resourcePlanningContainer.refreshDisplay();
    }

    private updateProjectAfterMoveOrResize(
        project: Project,
        data: { x: number; width: number }
    ) {
        const newStartDate = moment(project.startDate, Config.dateFormat);
        newStartDate.add((data.x - project.x) / Config.cellWidth, "days");

        project.x = data.x;
        project.numberOfDays = data.width / Config.cellWidth;
        project.startDate = newStartDate.format(Config.dateFormat);
        project.startWeekDate = newStartDate.format(Config.dateWeekFormat);
        newStartDate.add(project.numberOfDays - 1, "days");
        project.endDate = newStartDate.format(Config.dateFormat);
        project.endWeekDate = newStartDate.format(Config.dateWeekFormat);
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
