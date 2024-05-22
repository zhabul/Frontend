import * as moment from "moment";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { Config } from "src/app/moments/project-moments/resource-planning-app/Config";
import { GenericContainer } from "src/app/canvas-ui/GenericContainer";
import { Line } from "src/app/canvas-ui/Line";
import { TextRenderer } from "src/app/canvas-ui/TextRenderer";
import { DateSegmentData } from "../../models/DateSegmentData";
import { Project } from "../../models/Project";
import { User } from "../../models/User";
import { AbsenceSegment } from "../GridContainer/AbsenceSegment";
import { DateSegment } from "../GridContainer/DateSegment";
import { ProjectSegment } from "../GridContainer/ProjectSegment";
import { UserContainer } from "./UserContainer";
import { CmpRef } from "../../CmpRef";
import { ProjectContainer } from "./ProjectContainer";
import { ProjectUsersTableHead } from "./ProjectUsersTableHead/ProjectUsersTableHead";
import { AContainer } from "src/app/canvas-ui/AContainer";
import { ProjectUsersListContainer } from "./ProjecUsersListContainer";
import { ProjectUsersRowContainer } from "./ProjectUsersRowContainer";
import { ProjectColumn } from "./ProjectColumn";
import history from "src/app/canvas-ui/history/history";
import { DropdownMenu } from "src/app/canvas-ui/DropdownMenu";
import { Column } from "./ProjectUsersTableHead/Column";
import { MovingLineIndicator } from "./MovingLineIndicator";
import { SelectedUsersContainer } from "./SelectedUsersContainer";
import { Rectangle } from "src/app/canvas-ui/Rectangle";
import { BezierCurve } from "src/app/canvas-ui/BezierCurve";
declare var $;

export class ProjectUsersContainer extends AContainer {
    private tableHeadContainer: ProjectUsersTableHead;
    private rowNumberContainer: ProjectUsersRowContainer;
    private userTableContainer: GenericContainer;
    private userTableBodyContainer: ProjectUsersListContainer;
    private currentDisplayProjectIndex = 0;
    private lineConnections = [];
    private overlappedUsers = [];

    private movingLineIndicator;

    private highlightedRow: number;
    private selectionBox: Rectangle;
    private selectedUsersContainer: SelectedUsersContainer;
    private firstUserBoxSelectedPosition: number;
    private listOfUnmovedUsers = [];

    constructor(
        x: number,
        y: number,
        width: string | number,
        height: string | number,
        canvas: Canvas,
        parent
    ) {
        super(x, y, width, height, canvas, parent);

        this.createUserTableContainer();
        this.createUserTableBodyContainer();
        this.createTableHeadContainer();
        this.createRowNumbersContainer();
        this.updateInnerContainerHeight();

        this.setOnMouseWheelHandler((e) => {
            CmpRef.cmp.planningApp.gridContainer
                .getVerticalScrollbar()
                .getSlider()
                .move(e.deltaY / Config.wheelScrollSensitivity);
            this.parent.draw();
            if (this.getSelectedUsersContainer()) {
                this.selectedUsersContainer.draw();
            }
            CmpRef.cmp.planningApp.gridContainer.draw();
            CmpRef.cmp.planningApp.toolboxContainer.draw();
        });
    }

    private createTableHeadContainer() {
        this.tableHeadContainer = new ProjectUsersTableHead(
            0,
            0,
            "100%",
            Config.topSectionSize,
            this.canvas,
            this.userTableContainer
        );
        this.tableHeadContainer.setWidthOffset(Config.sideSectionRightBorderWidth);
    }

    private createRowNumbersContainer() {
        this.rowNumberContainer = new ProjectUsersRowContainer(
            0,
            0,
            Config.cellHeight,
            this.getHeight(),
            this.canvas,
            this
        );
    }

    private createUserTableContainer() {
        this.userTableContainer = new GenericContainer(
            Config.cellHeight,
            0,
            "100%",
            this.getHeight(),
            this.canvas,
            this
        );
        this.userTableContainer.setWidthOffset(Config.sideSectionRightBorderWidth);
        this.userTableContainer.setBackgroundColor("#eee");
        this.userTableContainer.setWidthOffset(Config.cellHeight);
    }

    private createUserTableBodyContainer() {
        this.userTableBodyContainer = new ProjectUsersListContainer(
            0,
            Config.topSectionSize,
            "100%",
            this.userTableContainer.getHeight() - Config.topSectionSize,
            this.canvas,
            this.userTableContainer
        );
        this.userTableBodyContainer.setWidthOffset(
            Config.sideSectionRightBorderWidth
        );
    }

    getRowNumbersContainer() {
        return this.rowNumberContainer;
    }
    getTableHeadContainer() {
        return this.tableHeadContainer;
    }
    getUserTableBodyContainer() {
        return this.userTableBodyContainer;
    }
    getSelectedUsersContainer() {
        return this.selectedUsersContainer;
    }
    getMovingLineIndicator() {
        return this.movingLineIndicator;
    }

    updateInnerContainerHeight() {
        const height =
            this.getNumberOfAllDisplayProjectsAndUsers() * Config.cellHeight;
        this.userTableBodyContainer.getInnerContainer().setHeight(height);
        this.rowNumberContainer
            .getRowListContainer()
            .getInnerContainer()
            .setHeight(height);
        if (this.selectedUsersContainer) {
            this.selectedUsersContainer.getInnerContainer().setHeight(height);
        }
    }

    addWeekToSelectedWeeksToShowWorkers(week: string) {
        CmpRef.cmp.selectedWeeksToShowWorkers.push(week);
    }
    removeWeekInSelectedWeeksToShowWorkers(week: string) {
        const index = CmpRef.cmp.selectedWeeksToShowWorkers.indexOf(week);
        if (index < 0) {
            return;
        }
        CmpRef.cmp.selectedWeeksToShowWorkers.splice(index, 1);
    }

    getCurrentDisplayProjectIndex() {
        return this.currentDisplayProjectIndex;
    }
    setCurrentDisplayProjectIndex(currentDisplayProjectIndex: number) {
        this.currentDisplayProjectIndex = currentDisplayProjectIndex;
    }

    addDisplayProjectToProjectUsersContainer(projectIndex: number): boolean {
        if (
            projectIndex < 0 ||
            projectIndex > CmpRef.cmp.allDisplayProjects.length - 1
        ) {
            return false;
        }

        const project = CmpRef.cmp.allDisplayProjects[projectIndex];
        const rowNumber = project.y / Config.cellHeight + 1;

        const projectContainer = new ProjectContainer(
            0,
            project.y,
            "100%",
            project.users.length * Config.cellHeight + Config.cellHeight,
            this.canvas,
            this.userTableBodyContainer.getInnerContainer()
        );

        const projectHeaderContainer = new GenericContainer(
            0,
            0,
            "100%",
            Config.cellHeight,
            this.canvas,
            projectContainer
        );
        if (project.id > 0) {
            projectHeaderContainer.setBackgroundColor("#c2c2c2");
        } else {
            projectHeaderContainer.setBackgroundColor("#111");
        }
        projectHeaderContainer.setOnMouseDownHandler((e) => {
          if(!Config.isInEditMode) return;
            this.addRemoveEventsForMouseDownEvent((e2) => {
                if (e.screenY === e2.screenY) {
                    this.highlightedRow = rowNumber;
                    this.refreshDisplay();
                }
            });
        });

        const c = new ProjectColumn(
            0,
            0,
            ProjectUsersTableHead.threeVerticalDotsColumnWidth,
            projectHeaderContainer.getHeight(),
            this.canvas,
            projectHeaderContainer
        );
        c.setBorder("#9d9d9d", 1);
        if (project.id > 0 && Config.isInEditMode) {
            c.setOnMouseHoverHandler(() => (document.body.style.cursor = "pointer"));
            c.setOnClickHandler((e) => {
                const dropdownMenu = new DropdownMenu(
                    e.layerX,
                    e.layerY,
                    200,
                    200,
                    this.canvas
                );
                dropdownMenu.addOption(
                    CmpRef.cmp.getTranslate().instant("Assign Worker"),
                    (e) => {
                        CmpRef.cmp.setDisabledDates(project.startDate, project.endDate);
                        CmpRef.cmp.showAddUserModal(projectIndex);
                    }
                );
                dropdownMenu.addOption(
                    CmpRef.cmp
                        .getTranslate()
                        .instant(
                            project.countAsResources
                                ? "Stop counting as resources"
                                : "Count as resources"
                        ),
                    (e) => {
                        project.countAsResources = !project.countAsResources;
                        history.addToQueue(
                            () =>
                                CmpRef.cmp.setProjectCountAsResources(
                                    project.id,
                                    project.countAsResources
                                ),
                            () =>
                                CmpRef.cmp.setProjectCountAsResources(
                                    project.id,
                                    !project.countAsResources
                                )
                        );
                        CmpRef.cmp.planningApp.projectUsersContainer.refreshDisplay();
                        CmpRef.cmp.planningApp.resourcePlanningContainer.refreshDisplay();
                    }
                );
                dropdownMenu.open();
            });
        }

        const cText = new TextRenderer("\u2807", this.canvas, c);
        if (project.id <= 0) {
            cText.setColor("white");
        }
        cText.setFontSize(17);
        cText.setX(6);
        cText.setY(6);
        cText.updateTextDimensions();

        CmpRef.cmp.visibleColumns.forEach((column) => {
            const c = new ProjectColumn(
                column.x,
                0,
                column.width,
                projectHeaderContainer.getHeight(),
                this.canvas,
                projectHeaderContainer
            );
            c.setBorder("#9d9d9d", 1);

            let text = "";

            if (column.key === null) {
                if (column.values[project.id]) {
                    text = column.values[project.id].value;
                }
                if (Config.isInEditMode) {
                    c.setOnDoubleClickHandler(() => {
                        CmpRef.cmp.columnValueInput.style.display = "block";
                        CmpRef.cmp.columnValueInput.style.width = `${c.getWidth()}px`;
                        CmpRef.cmp.columnValueInput.style.height = `${c.getHeight()}px`;
                        CmpRef.cmp.columnValueInput.value = text;
                        CmpRef.cmp.columnValueInput.style.top = `${c.getGlobalY()}px`;
                        const x = Config.sidebarSize + c.getGlobalX() + c.getWidth() / 2;
                        CmpRef.cmp.columnValueInput.style.left = `${x}px`;
                        CmpRef.cmp.columnValueInput.focus();
                        CmpRef.cmp.columnValueInput.select();

                        CmpRef.cmp.selectedColumnForEditing = column;
                        CmpRef.cmp.projectIndex = Number(projectIndex);
                        CmpRef.cmp.userIndex = null;
                    });
                }
            } else {
                text = project[column.key];

                if (!project.countAsResources && column.key === "name") {
                    text = `* ${text}`;
                }
            }

            const cText = new TextRenderer(text.toString(), this.canvas, c);
            if (project.id <= 0) {
                cText.setColor("white");
            }
            cText.setFontWeight("bold");
            cText.setAlignment("left", "center");
            cText.setX(5);
            cText.updateTextDimensions();
        });

        if (this.highlightedRow === rowNumber) {
            this.renderHighlightedLines(projectHeaderContainer);
        }

        const usersContainer = new GenericContainer(
            0,
            Config.cellHeight,
            "100%",
            projectContainer.getHeight() - Config.cellHeight,
            this.canvas,
            projectContainer
        );
        usersContainer.setBackgroundColor("white");

        const projectDateSegmentContainer = new GenericContainer(
            0,
            project.y,
            CmpRef.cmp.planningApp.gridContainer.getInnerContainer().getWidth(),
            project.users.length * Config.cellHeight + Config.cellHeight,
            CmpRef.cmp.planningApp.gridContainer.getCanvas(),
            CmpRef.cmp.planningApp.gridContainer.getInnerContainer()
        );

        const projectSegment = new ProjectSegment(
            project.x,
            2,
            project.numberOfDays * Config.cellWidth,
            Config.cellHeight - 5,
            CmpRef.cmp.planningApp.gridContainer.getCanvas(),
            projectDateSegmentContainer,
            projectIndex
        );
        projectSegment.setBackgroundColor(project.color);
        projectSegment.setOnClickHandler(CmpRef.cmp.openAddResourceWeeksModal);

        if (Object.keys(project.resourceWeeks).length !== 0 || project.id <= 0) {
            projectSegment.displayProjectSegmentWeeks();
        }

        if (this.highlightedRow === rowNumber) {
            this.renderHighlightedLines(projectDateSegmentContainer);
        }

        this.renderProjectUsers(
            project,
            usersContainer,
            projectIndex,
            projectDateSegmentContainer
        );

        return true;
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

    private enumerateUnmovedUsers() {
        let usersString = "";
        if (this.listOfUnmovedUsers.length > 0) {
            for (let i = 0; i < this.listOfUnmovedUsers.length; i++) {
                const u = this.listOfUnmovedUsers[i];
                usersString += u;
                if (
                    this.listOfUnmovedUsers.length > 1 &&
                    i < this.listOfUnmovedUsers.length - 1
                ) {
                    usersString += ", ";
                }
            }
            CmpRef.cmp.toastrMessage(
                "info",
                usersString + CmpRef.cmp.getTranslate().instant(" can not move!")
            );
            this.listOfUnmovedUsers = [];
        }
    }

    private renderProjectUsers(
        project: Project,
        usersContainer: GenericContainer,
        projectIndex: number,
        projectDateSegmentContainer: GenericContainer
    ) {
        project.users.forEach((user, userIndex) => {
            const rowNumber =
                (project.y + user.y + Config.cellHeight) / Config.cellHeight + 1;

            const userContainer = new UserContainer(
                0,
                user.y,
                "100%",
                Config.cellHeight,
                this.canvas,
                usersContainer
            );
            if (project.id != 0) userContainer.setBackgroundColor(user.styles.backgroundColor); //changing resource users not allowed resource id = 0
            const projectGlobalY =
                Config.toolboxSize +
                Config.topSectionSize +
                project.y +
                CmpRef.cmp.planningApp.projectUsersContainer
                    .getUserTableBodyContainer()
                    .getInnerContainer()
                    .getY();

            if (Config.isInEditMode) {
                userContainer.setOnMouseDownHandler((e) => {
                    if (this.selectedUsersContainer) {
                        this.canvas.removeChildById(this.selectedUsersContainer.getId());
                        if (this.movingLineIndicator) {
                            this.canvas.removeChildById(this.movingLineIndicator.getId());
                        }
                        this.userTableBodyContainer
                            .getInnerContainer()
                            .removeChildById(this.selectedUsersContainer.getId());
                        this.selectedUsersContainer = null;
                        Config.boxHeight = 0;
                    }
                    if (project.id != 0) { //changing resource users not allowed resource id = 0

                        if (e.shiftKey) {
                            Config.firstUserBoxSelectedPositionDelta =
                                project.y + user.y + Config.cellHeight;
                            this.firstUserBoxSelectedPosition = e.offsetY;
                            Config.deltaMovementBetweenBoxes = 0;
                            return;
                        }

                        CmpRef.cmp.changeFontFamilyInputValue = user.styles.fontFamily;
                        CmpRef.cmp.changeFontSizeInputValue = user.styles.fontSize;
                        CmpRef.cmp.changeBackgroundColorInputValue =
                            user.styles.backgroundColor;
                        CmpRef.cmp.changeTextColorInputValue = user.styles.color;
                        CmpRef.cmp.changeFontWeightInputValue =
                            user.styles.fontWeight == "bold" ? true : false;
                        CmpRef.cmp.changeFontStyleInputValue =
                            user.styles.fontStyle == "italic" ? true : false;
                        CmpRef.cmp.changeFontDecorationInputValue =
                            user.styles.fontDecoration == "underline" ? true : false;
                    }

                    this.movingLineIndicator = new MovingLineIndicator(
                        userContainer.getX(),
                        userContainer.getY(),
                        "100%",
                        Config.cellHeight * 2,
                        this.canvas,
                        usersContainer
                    );

                    const cursorChangeTimeout = setTimeout(() => {
                        document.body.style.cursor = "n-resize";
                    }, 100);

                    this.canvas.addChild(this.movingLineIndicator);
                    this.canvas.addChild(userContainer);
                    this.canvas.getChildren().forEach((child) => {
                        this.canvas.addDrawingContainer(child);
                    });

                    // enable changing text layout
                    CmpRef.cmp.selectedUsersForStyleChange = [];
                    if (project.id != 0) { //changing resource users not allowed resource id = 0
                        CmpRef.cmp.selectedUsersForStyleChange.push({
                            projectId: project.id,
                            userId: user.id,
                            y: projectGlobalY + user.y + Config.cellHeight,
                        });
                    }
                    this.canvas.getCanvasElement().onmousemove = (ev) => {
                        if (ev.movementY != 0) {
                            this.throttle(() => {
                                this.movingLineIndicator.move(ev.movementY);
                            }, 100)();
                            userContainer.move(ev.movementY);
                        }
                    };

                    this.addRemoveEventsForMouseDownEvent((e2) => {
                        document.body.style.cursor = "default";
                        if (e.screenY === e2.screenY) {
                            clearTimeout(cursorChangeTimeout);
                            this.highlightedRow = rowNumber;
                            this.canvas.removeChildById(this.movingLineIndicator.getId());
                            this.canvas.removeChildById(userContainer.getId());
                            this.refreshDisplay();
                            this.canvas.resetDrawingContainers();
                            return;
                        }
                        this.canvas.removeChildById(userContainer.getId());
                        this.highlightedRow = null;

                        if (
                            !this.getUserTableBodyContainer().isShapeClicked(
                                e2.layerX,
                                e2.layerY
                            )
                        ) {
                            userContainer.setY(
                                CmpRef.cmp.allDisplayProjects[projectIndex].users[userIndex].y
                            );
                            this.canvas.resetDrawingContainers();
                            this.refreshDisplay();
                            return;
                        }

                        this.onDropUser(
                            userContainer,
                            userIndex,
                            projectIndex,
                            this.movingLineIndicator.getY()
                        );
                        this.enumerateUnmovedUsers();

                        this.canvas.resetDrawingContainers();
                        this.refreshDisplay();
                        this.canvas.removeChildById(this.movingLineIndicator.getId());
                    });
                });
            }

            const c = new ProjectColumn(
                0,
                0,
                ProjectUsersTableHead.threeVerticalDotsColumnWidth,
                userContainer.getHeight(),
                this.canvas,
                userContainer
            );
            c.setBorder("#9d9d9d", 1);

            if (Config.isInEditMode) {
                c.setOnMouseHoverHandler(
                    () => (document.body.style.cursor = "pointer")
                );
                c.setOnClickHandler((e) => {
                    const dropdownMenu = new DropdownMenu(
                        e.layerX,
                        e.layerY,
                        200,
                        200,
                        this.canvas
                    );
                    dropdownMenu.addOption(
                        CmpRef.cmp
                            .getTranslate()
                            .instant(
                                project.countAsResources
                                    ? "Stop counting as resources"
                                    : "Count as resources"
                            ),
                        (e) => {
                            user["showInResourcePlanning"] = user.hasOwnProperty(
                                "showInResourcePlanning"
                            )
                                ? !user.showInResourcePlanning
                                : false;

                            history.addToQueue(
                                () =>
                                    CmpRef.cmp.setUserCountAsResources(
                                        user.id,
                                        project.id,
                                        user.isResponsiblePerson,
                                        user.showInResourcePlanning
                                    ),
                                () =>
                                    CmpRef.cmp.setUserCountAsResources(
                                        user.id,
                                        project.id,
                                        user.isResponsiblePerson,
                                        !user.showInResourcePlanning
                                    )
                            );

                            CmpRef.cmp.planningApp.projectUsersContainer.refreshDisplay();
                            CmpRef.cmp.planningApp.resourcePlanningContainer.refreshDisplay();
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

            CmpRef.cmp.visibleColumns.forEach((column) => {
                const c = new ProjectColumn(
                    column.x,
                    0,
                    column.width,
                    userContainer.getHeight(),
                    this.canvas,
                    userContainer
                );
                c.setBorder("#9d9d9d", 1);

                let text = "";

                if (column.key === null) {
                    if (
                        column.values[project.id] &&
                        column.values[project.id].users[user.id]
                    ) {
                        text = column.values[project.id].users[user.id];
                    }

                    if (Config.isInEditMode) {
                        c.setOnDoubleClickHandler(() => {
                            CmpRef.cmp.columnValueInput.style.display = "block";
                            CmpRef.cmp.columnValueInput.style.width = `${c.getWidth()}px`;
                            CmpRef.cmp.columnValueInput.style.height = `${c.getHeight()}px`;
                            CmpRef.cmp.columnValueInput.value = text;
                            CmpRef.cmp.columnValueInput.style.top = `${c.getGlobalY()}px`;
                            const x = Config.sidebarSize + c.getGlobalX() + c.getWidth() / 2;
                            CmpRef.cmp.columnValueInput.style.left = `${x}px`;
                            CmpRef.cmp.columnValueInput.focus();
                            CmpRef.cmp.columnValueInput.select();

                            CmpRef.cmp.selectedColumnForEditing = column;
                            CmpRef.cmp.projectIndex = Number(projectIndex);
                            CmpRef.cmp.userIndex = Number(userIndex);
                        });
                    }
                } else {
                    if (user[column.key]) {
                        text = user[column.key];
                    } else {
                        if (column.key === "startDate") {
                            text = user.dateSegments[0].startDate;
                        } else if (column.key === "endDate") {
                            text = user.dateSegments[user.dateSegments.length - 1].endDate;
                        } else {
                            let count = 0;
                            user.dateSegments.forEach(ds => {
                                count += moment(
                                    ds.endDate,
                                    Config.dateFormat
                                ).diff(
                                    moment(ds.startDate, Config.dateFormat),
                                    "days"
                                ) + 1;
                            })
                            text = count.toString();
                        }
                    }

                    if (
                        column.key === "numberOfDays" ||
                        column.key === "startDate" ||
                        column.key === "endDate"
                    ) {
                        this.setColumnDoubleClickHandler(
                            c,
                            column,
                            projectIndex,
                            userIndex,
                            text
                        );
                    }
                }

                const cText = new TextRenderer(text.toString(), this.canvas, c);
                if (
                    this.overlappedUsers.some(
                        (oUser) =>
                            oUser.projectId === project.id && oUser.userId === user.id
                    )
                ) {
                    cText.setColor("red");
                } else if (project.id != 0) {
                    cText.setColor(user.styles.color);
                }
                if (project.id != 0) { //changing resource users not allowed resource id = 0
                    cText.setFontWeight(user.styles.fontWeight);
                    cText.setFontStyle(user.styles.fontStyle);
                    cText.setFontDecoration(user.styles.fontDecoration);
                    cText.setFontSize(user.styles.fontSize);
                    cText.setFontFamily(user.styles.fontFamily);
                }
                cText.setAlignment("right", "center");
                cText.setX(5);
                cText.updateTextDimensions();
            });

            if (this.highlightedRow === rowNumber) {
                this.renderHighlightedLines(
                    projectDateSegmentContainer,
                    user.y + Config.cellHeight
                );
                this.renderHighlightedLines(userContainer);
            }

            this.renderUserDateSegments(
                user,
                projectDateSegmentContainer,
                projectIndex,
                userIndex
            );
            this.renderUserAbsences(
                user,
                projectDateSegmentContainer,
                projectIndex,
                userIndex
            );
        });
    }
    // obojene trake usera
    private renderUserDateSegments(
        user: User,
        projectDateSegmentContainer: GenericContainer,
        projectIndex: number,
        userIndex: number
    ) {
        // if(user.id == 845)
        // console.log(user)

        user.dateSegments.forEach((dateSegment, dateSegmentIndex) => {
          const numberOfDays = moment(dateSegment.endDate).diff(moment(dateSegment.startDate),"days") + 1;
          const dateSegmentContainer = new DateSegment(
            dateSegment.x,
            user.y + Config.cellHeight + 5,
            numberOfDays * Config.cellWidth,
            Config.cellHeight - 10,
            CmpRef.cmp.planningApp.gridContainer.getCanvas(),
            projectDateSegmentContainer,
            { projectIndex, userIndex, dateSegmentIndex }
            );

          dateSegmentContainer.setBackgroundColor(user.colorByRole);
          dateSegmentContainer.setBorder("black", 0.5);

          if (user.isResponsiblePerson) {
            dateSegmentContainer.setBorder("black", 2);
          }
        });

        // user.dateSegments.forEach((dateSegment, dateSegmentIndex) => {
        //   const dsIndex = user.dateSegments.findIndex(
        //     (ds,dsIndex) =>
        //       dateSegment.startDate >= ds.startDate &&
        //       dateSegment.endDate <= ds.endDate &&
        //       dsIndex != dateSegmentIndex
        //       );
        //   // const dsIndex = user.dateSegments.findIndex((ds) => ds.y == dateSegment.y && ds.x <= dateSegment.x && ds.x + ds.numberOfDays * Config.cellWidth >= dateSegment.x + dateSegment.numberOfDays * Config.cellWidth )
        //   // const dsIndex = user.dateSegments.some((ds) => ds.y == dateSegment.y && ds.x < dateSegment.x && ds.x + ds.numberOfDays * Config.cellWidth >= dateSegment.x + dateSegment.numberOfDays * Config.cellWidth )
        //   // if(dsIndex) return;
        //   if(dsIndex == -1){
        //     const dateSegmentContainer = new DateSegment(
        //       dateSegment.x,
        //       user.y + Config.cellHeight + 5,
        //       dateSegment.numberOfDays * Config.cellWidth,
        //       Config.cellHeight - 10,
        //       CmpRef.cmp.planningApp.gridContainer.getCanvas(),
        //       projectDateSegmentContainer,
        //       { projectIndex, userIndex, dateSegmentIndex }
        //     );
        //     dateSegmentContainer.setBackgroundColor(user.colorByRole);
        //     dateSegmentContainer.setBorder("black", 0.5);

        //     if (user.isResponsiblePerson) {
        //         dateSegmentContainer.setBorder("black", 2);
        //     }
        //   }
        //   //case when one user work on more subproject in same intervals
        //   else if(user.dateSegments.some((ds,dsIndex) => ds.startDate === dateSegment.startDate && ds.endDate === dateSegment.endDate && dsIndex !== dateSegmentIndex)){
        //     if(!sameDs.some((sameDss) => sameDss.startDate === dateSegment.startDate && sameDss.endDate === dateSegment.endDate)){
        //       const dateSegmentContainer = new DateSegment(
        //         dateSegment.x,
        //         user.y + Config.cellHeight + 5,
        //         dateSegment.numberOfDays * Config.cellWidth,
        //         Config.cellHeight - 10,
        //         CmpRef.cmp.planningApp.gridContainer.getCanvas(),
        //         projectDateSegmentContainer,
        //         { projectIndex, userIndex, dateSegmentIndex }
        //       );
        //       dateSegmentContainer.setBackgroundColor(user.colorByRole);
        //       dateSegmentContainer.setBorder("black", 0.5);

        //       if (user.isResponsiblePerson) {
        //           dateSegmentContainer.setBorder("black", 2);
        //       }
        //       sameDs.push(dateSegment)
        //     }

        //   }
        // });
    }
    // tekst u malim boxovima, na trakama unutar grida
    private renderUserAbsences(
        user: User,
        projectDateSegmentContainer: GenericContainer,
        projectIndex: number,
        userIndex: number
    ) {
        user.absences.sort((a, b) => {
          if (a.x < b.x) {
              return -1;
          }
          if (a.x > b.x) {
              return 1;
          }
          return 0;
      })
        user.absences.forEach((absenceSegment, index) => {
            const width = absenceSegment.numberOfDays * Config.cellWidth;
            const absenceSegmentContainer = new AbsenceSegment(
                absenceSegment.x,
                user.y + Config.cellHeight + 5,
                width,
                Config.cellHeight - 10,
                CmpRef.cmp.planningApp.gridContainer.getCanvas(),
                projectDateSegmentContainer,
                { projectIndex, userIndex, index }
            );
            const color = absenceSegment.approved ? absenceSegment.color : "black";
            absenceSegmentContainer.setBackgroundColor("#eee");
            absenceSegmentContainer.setBorder(color, 1);

            const numberOfBackgroundLines = absenceSegmentContainer.getWidth();
            const height = absenceSegmentContainer.getHeight();
            const canvas = absenceSegmentContainer.getCanvas();

            for (let i = 0; i < numberOfBackgroundLines; i += 22) {
                const backgroundLine = new Line(
                    i + 5,
                    height,
                    i + 15,
                    0,
                    canvas,
                    absenceSegmentContainer
                );
                backgroundLine.setColor(color);
            }

            const absenceSegmentTextContainer = new GenericContainer(
                0,
                0,
                20,
                Config.cellHeight - 10,
                this.canvas,
                absenceSegmentContainer
            );
            absenceSegmentTextContainer.setBackgroundColor("#eee");
            absenceSegmentTextContainer.setXAlignment("center");
            absenceSegmentTextContainer.setYAlignment("center");

            const absenceSegmentText = new TextRenderer(
                absenceSegment.type,
                CmpRef.cmp.planningApp.gridContainer.getCanvas(),
                absenceSegmentTextContainer
            );
            absenceSegmentText.setFontSize(10);
            absenceSegmentText.updateTextDimensions();

            if (absenceSegmentText.getWidth() > width) {
                absenceSegmentText.setTextContent(
                    absenceSegment.type.substr(
                        0,
                        Math.floor(
                            ((width - Config.cellWidth / 2) / absenceSegmentText.getWidth()) *
                            absenceSegment.type.length
                        )
                    )
                );
                absenceSegmentText.updateTextDimensions();
            }

            absenceSegmentTextContainer.setWidth(absenceSegmentText.getWidth());
            absenceSegmentTextContainer.setHeight(absenceSegmentText.getHeight());

            absenceSegmentText.setAlignment("center", "center");
        });
    }

    private onDropUser(
        userContainer: GenericContainer,
        userIndex: number,
        projectIndex: number,
        lineY: number,
        noHistory: boolean = false
    ) {
        const project = CmpRef.cmp.allDisplayProjects[projectIndex];

        let pIndex = this.findProjectIndexByYPosition(
            project.y + lineY + Config.cellHeight
        );
        if (pIndex === -1) {
            pIndex = CmpRef.cmp.allDisplayProjects.length - 1;
        } else {
            pIndex = pIndex >= 1 ? pIndex - 1 : 0;
        }

        const selectedProject = CmpRef.cmp.allDisplayProjects[pIndex];
        const selectedUser = project.users[userIndex];

        const todayFormatted = Config.currentDate.format(Config.dateFormat);

        if (selectedUser.dateSegments.every((ds) => ds.endDate <= todayFormatted)) {
            this.canvas.resetDrawingContainers();
            if (this.selectedUsersContainer) {
                this.canvas.removeChildById(this.selectedUsersContainer.getId());
            }
            this.canvas.removeChildById(this.movingLineIndicator.getId());
            this.listOfUnmovedUsers.push(selectedUser.name);
            return;
        }

        if (
            projectIndex !== pIndex &&
            CmpRef.cmp.allDisplayProjectsOriginal
                .find((p) => p.id === selectedProject.id)
                .users.some((u) => u.id === selectedUser.id)
        ) {
            userContainer.setY(selectedUser.y);
            CmpRef.cmp.toastrMessage(
                "info",
                CmpRef.cmp
                    .getTranslate()
                    .instant("Project already assigned that worker!")
            );
            this.canvas.resetDrawingContainers();
            return;
        }

        if (!noHistory) {
            history.addToQueue(
                () => {
                    return true;
                },
                () => {
                    return true;
                }
            );
        }

        const movedUser = project.users.splice(userIndex, 1)[0]; // removed from array to get correct new position, added back later in this function
        const oldSortIndex = movedUser.sortIndex;
        const newY = project.y + lineY - selectedProject.y;
        let uIndex = this.findUserIndexFromProjectByYPosition(
            selectedProject,
            newY
        );

        const newUser: User = JSON.parse(JSON.stringify(movedUser));
        if (uIndex === -1) {
            // moved to end
            uIndex = selectedProject.users.length - 1;
            newUser.sortIndex = selectedProject.users[uIndex]
                ? selectedProject.users[uIndex].sortIndex + 1
                : 1;
        } else if (uIndex == 0) {
            newUser.sortIndex = selectedProject.users[uIndex].sortIndex - 1;
        } else {
            newUser.sortIndex =
                selectedProject.users[uIndex].sortIndex / 2 +
                selectedProject.users[uIndex - 1].sortIndex / 2;
        }

        newUser.dateSegments = [];

        let sendData = null;

        if (selectedProject.id !== project.id) {
            sendData = {
                type: "project-move",
                userId: newUser.id,
                message: `You have been moved to work (${project.name} -> ${selectedProject.name})`,
            };

            CmpRef.cmp.allColumns
                .filter((c) => c.key === "")
                .forEach((column) => {
                    if (
                        column.values[project.id] &&
                        column.values[project.id].users[newUser.id]
                    ) {
                        if (!column.values[selectedProject.id]) {
                            column.values[selectedProject.id] = { value: "", users: {} };
                        }
                        column.values[selectedProject.id].users[newUser.id] =
                            column.values[project.id].users[newUser.id];
                        delete column.values[project.id].users[newUser.id];
                    }
                });

            const movedDateSegmentIds: number[] = [];
            const tomorrow = moment().add(1, "days");

            movedUser.dateSegments.forEach((dateSegment) => {
                if (dateSegment.endDate <= todayFormatted) {
                    this.canvas.resetDrawingContainers();
                    this.canvas.removeChildById(this.selectedUsersContainer.getId());
                    this.canvas.removeChildById(this.movingLineIndicator.getId());
                    return;
                } else if (
                    dateSegment.startDate <= todayFormatted &&
                    dateSegment.endDate > todayFormatted
                ) {
                    const newDateSegment: DateSegmentData = JSON.parse(
                        JSON.stringify(dateSegment)
                    );
                    newDateSegment.id = -Math.round(Math.random() * 10000000); // placeholder id
                    newDateSegment.startDate = tomorrow.format(Config.dateFormat);
                    newDateSegment.startWeekDate = tomorrow.format(Config.dateWeekFormat);
                    newDateSegment.numberOfDays =
                        moment(newDateSegment.endDate, Config.dateFormat).diff(
                            tomorrow,
                            "days"
                        ) + 1;
                    if (newDateSegment.numberOfDays > 1) {
                        newDateSegment.numberOfDays++;
                    }

                    newUser.dateSegments.push(newDateSegment);

                    const previousState: DateSegmentData = JSON.parse(
                        JSON.stringify(dateSegment)
                    );

                    dateSegment.endDate = Config.currentDate.format(Config.dateFormat);
                    dateSegment.endWeekDate = Config.currentDate.format(
                        Config.dateWeekFormat
                    );
                    dateSegment.numberOfDays =
                        Config.currentDate.diff(
                            moment(dateSegment.startDate, Config.dateFormat),
                            "days"
                        ) + 1;

                    if (project.id !== 0) {
                        history.appendToQueueGroup(
                            () => CmpRef.cmp.updateDateSegment(dateSegment),
                            () => CmpRef.cmp.updateDateSegment(previousState)
                        );
                    }

                    history.appendToQueueGroup(
                        () =>
                            CmpRef.cmp.addUserToProjectFromPlanning(
                                selectedProject.id,
                                newUser.id,
                                newUser.sortIndex,
                                newUser.isResponsiblePerson
                            ),
                        () =>
                            CmpRef.cmp.unassignUserFromProject(
                                selectedProject.id,
                                newUser.id,
                                newUser.isResponsiblePerson
                            ),
                        {
                            type: "assign",
                            userId: newUser.id,
                            message: `You have been assigned to work on (${selectedProject.name})`,
                        }
                    );

                    if (!newUser.isResponsiblePerson) {
                        history.appendToQueueGroup(
                            async () => {
                                const createdDateSegmentId =
                                    await CmpRef.cmp.addDateSegmentToUserFromPlanning(
                                        selectedProject.id,
                                        newUser.id,
                                        newDateSegment.startDate,
                                        newDateSegment.endDate
                                    );
                                history.setTempId(newDateSegment.id, createdDateSegmentId);
                                return true;
                            },
                            () => true
                        );
                    }
                } else {
                    movedDateSegmentIds.push(dateSegment.id);
                    newUser.dateSegments.push(JSON.parse(JSON.stringify(dateSegment)));
                    history.appendToQueueGroup(
                        () =>
                            CmpRef.cmp.updateResourcePlanningUserSortIndexAndProjectId({
                                id: newUser.id,
                                isResponsiblePerson: newUser.isResponsiblePerson,
                                projectId: selectedProject.id,
                                movedFromProject: project.id,
                                sortIndex: newUser.sortIndex,
                                dateSegmentId: dateSegment.id,
                            }),
                        () =>
                            CmpRef.cmp.updateResourcePlanningUserSortIndexAndProjectId({
                                id: newUser.id,
                                isResponsiblePerson: newUser.isResponsiblePerson,
                                projectId: project.id,
                                movedFromProject: selectedProject.id,
                                sortIndex: oldSortIndex,
                                dateSegmentId: dateSegment.id,
                            }),
                        sendData
                    );
                }
            });

            movedUser.dateSegments = movedUser.dateSegments.filter(
                (dateSegment) => !movedDateSegmentIds.includes(dateSegment.id)
            );
            selectedProject.users.push(newUser);
            movedUser.isMoved = movedUser.dateSegments.every(
                (ds) => ds.startDate > todayFormatted
            );
        } else {
            movedUser.sortIndex = newUser.sortIndex;

            history.appendToQueueGroup(
                () =>
                    CmpRef.cmp.updateResourcePlanningUserSortIndexAndProjectId({
                        id: newUser.id,
                        isResponsiblePerson: newUser.isResponsiblePerson,
                        projectId: selectedProject.id,
                        movedFromProject: project.id,
                        sortIndex: newUser.sortIndex,
                        dateSegmentId: -1,
                    }),
                () =>
                    CmpRef.cmp.updateResourcePlanningUserSortIndexAndProjectId({
                        id: newUser.id,
                        isResponsiblePerson: newUser.isResponsiblePerson,
                        projectId: project.id,
                        movedFromProject: selectedProject.id,
                        sortIndex: oldSortIndex,
                        dateSegmentId: -1,
                    }),
                sendData
            );
        }

        project.users.push(movedUser);

        if (!noHistory) {
            history.appendToQueueGroup(
                () => {
                    return true;
                },
                () => {
                    return true;
                }
            );
        } // needs to be here to store state for redo
    }

    setColumnDoubleClickHandler(
        column: ProjectColumn,
        columnData: Column,
        projectIndex: number,
        userIndex: number,
        text: string
    ) {

        if (!Config.isInEditMode) {
            return;
        }
        switch (columnData.key) {
            case "numberOfDays":
                column.setOnDoubleClickHandler(() => {
                    CmpRef.cmp.columnNumberOfDaysInput.style.display = "block";
                    CmpRef.cmp.columnNumberOfDaysInput.style.width = `${column.getWidth()}px`;
                    CmpRef.cmp.columnNumberOfDaysInput.style.height = `${column.getHeight()}px`;
                    CmpRef.cmp.columnNumberOfDaysInput.value = text;
                    CmpRef.cmp.columnNumberOfDaysInput.style.top = `${column.getGlobalY()}px`;
                    const x =
                        Config.sidebarSize + column.getGlobalX() + column.getWidth() / 2;
                    CmpRef.cmp.columnNumberOfDaysInput.style.left = `${x}px`;
                    CmpRef.cmp.columnNumberOfDaysInput.focus();
                    CmpRef.cmp.columnNumberOfDaysInput.select();

                    CmpRef.cmp.projectIndex = Number(projectIndex);
                    CmpRef.cmp.userIndex = Number(userIndex);
                });
                break;
            case "startDate":
                column.setOnDoubleClickHandler(() => {
                    CmpRef.cmp.columnStartDateInput.style.top = `${column.getGlobalY()}px`;
                    CmpRef.cmp.columnStartDateInput.style.left = `${Config.sidebarSize + column.getGlobalX()
                        }px`;
                    CmpRef.cmp.columnStartDateInput.value = moment(
                        text,
                        Config.dateFormat
                    ).format(Config.datepickerFormat);

                    CmpRef.cmp.projectIndex = Number(projectIndex);
                    CmpRef.cmp.userIndex = Number(userIndex);

                    const datepicker = $("#columnStartDateInput") as any;
                    datepicker.datepicker("setDate", text);
                    datepicker.datepicker("show");
                });
                break;
            case "endDate":
                column.setOnDoubleClickHandler(() => {
                    CmpRef.cmp.columnEndDateInput.style.top = `${column.getGlobalY()}px`;
                    CmpRef.cmp.columnEndDateInput.style.left = `${Config.sidebarSize + column.getGlobalX()
                        }px`;
                    CmpRef.cmp.columnEndDateInput.value = moment(
                        text,
                        Config.dateFormat
                    ).format(Config.datepickerFormat);

                    CmpRef.cmp.projectIndex = Number(projectIndex);
                    CmpRef.cmp.userIndex = Number(userIndex);

                    const datepicker = $("#columnEndDateInput") as any;
                    datepicker.datepicker("setDate", text);
                    datepicker.datepicker("show");
                });
                break;
            default:
                throw new Error("No column with key: " + columnData.key);
        }
    }

    setAllDisplayProjectsAndUsersCoordinates() {
        let y = 0;

        CmpRef.cmp.allDisplayProjects.forEach((project) => {
            this.setProjectXCoordinate(project);
            project.y = y;
            y += Config.cellHeight;

            let userY = 0;
            project.users.forEach((user) => {
                user.y = userY;
                userY += Config.cellHeight;

                user.dateSegments.forEach((dateSegment) => {
                    this.setSegmentCoordinates(dateSegment);
                });
                user.absences.forEach((absence) => {
                    this.setSegmentCoordinates(absence);
                });
            });

            y += userY;
        });
    }

    setSegmentCoordinates(dateSegment: DateSegmentData) {
        const startDate = moment(dateSegment.startDate);

        const startYear = startDate.year();
        const startMonth = startDate.month() + 1;
        const startDay = startDate.date();

        const months = CmpRef.cmp.planningApp.daysContainer.getAllDisplayMonths();

        for (let i = 0, n = months.length; i < n; i++) {
            if (months[i].year !== startYear || months[i].month !== startMonth) {
                continue;
            }

            for (let j = 0, m = months[i].days.length; j < m; j++) {
                if (months[i].days[j].day !== startDay) {
                    continue;
                }
                dateSegment.x = months[i].x + j * Config.cellWidth;
                return;
            }
        }

        const diffBetweenStartAndFirstDay = moment(
            `${months[0].year}-${months[0].month}-${months[0].days[0].day}`,
            Config.dateFormat
        ).diff(dateSegment.startDate, "days");
        dateSegment.x =
            months[0].x - diffBetweenStartAndFirstDay * Config.cellWidth;
    }

    setProjectXCoordinate(project: Project) {
        const startDate = moment(project.startDate);

        const startYear = startDate.year();
        const startMonth = startDate.month() + 1;
        const startDay = startDate.date();

        const months = CmpRef.cmp.planningApp.daysContainer.getAllDisplayMonths();

        for (let i = 0, n = months.length; i < n; i++) {
            if (months[i].year !== startYear || months[i].month !== startMonth) {
                continue;
            }

            for (let j = 0, m = months[i].days.length; j < m; j++) {
                if (months[i].days[j].day !== startDay) {
                    continue;
                }
                project.x = months[i].x + j * Config.cellWidth;
                return;
            }
        }

        const diffBetweenStartAndFirstDay = moment(
            `${months[0].year}-${months[0].month}-${months[0].days[0].day}`,
            Config.dateFormat
        ).diff(project.startDate, "days");
        project.x = months[0].x - diffBetweenStartAndFirstDay * Config.cellWidth;
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
        const projects = CmpRef.cmp.allDisplayProjects;
        if (projects.length < 1) {
            return 0;
        }
        if (projects.length <= this.currentDisplayProjectIndex) {
            this.setCurrentDisplayProjectIndex(0);
        }
        const maxProjectsAndUsersToDisplayThatFitContainer = Math.ceil(
            (this.getHeight() +
                Math.abs(
                    this.userTableBodyContainer.getInnerContainer().getY() +
                    projects[this.currentDisplayProjectIndex].y
                )) /
            Config.cellHeight
        );
        const n = projects.length;

        let projectsAndUsersDisplayed = 0;

        for (let i = this.currentDisplayProjectIndex; i < n; i++) {
            if (
                projectsAndUsersDisplayed >=
                maxProjectsAndUsersToDisplayThatFitContainer
            ) {
                return i;
            }
            projectsAndUsersDisplayed += projects[i].users.length + 1;
        }
        return n;
    }

    addUserToProject(projectIndex: number, user: User) {
        const project = CmpRef.cmp.allDisplayProjects[projectIndex];
        const userCopy: User = JSON.parse(JSON.stringify(user));
        project.users.push(userCopy);

        history.addToQueue(
            () =>
                CmpRef.cmp.addUserToProjectFromPlanning(
                    project.id,
                    user.id,
                    -1,
                    user.isResponsiblePerson
                ),
            () =>
                CmpRef.cmp.unassignUserFromProject(
                    project.id,
                    user.id,
                    user.isResponsiblePerson
                ),
            {
                type: "assign",
                userId: user.id,
                message: `You have been assigned to work on (${project.name})`,
            }
        );

        userCopy.dateSegments.forEach((dateSegment) => {
            this.addDateSegmentToUser(
                projectIndex,
                project.users.length - 1,
                dateSegment
            );
        });
    }

    addDateSegmentToUser(
        projectIndex: number,
        userIndex: number,
        dateSegment: DateSegmentData
    ) {
        const project = CmpRef.cmp.allDisplayProjects[projectIndex];
        const user = project.users[userIndex];
        history.appendToQueueGroup(
            async () => {
                const createdDateSegmentId =
                    await CmpRef.cmp.addDateSegmentToUserFromPlanning(
                        project.id,
                        user.id,
                        dateSegment.startDate,
                        dateSegment.endDate
                    );
                history.setTempId(dateSegment.id, createdDateSegmentId);
                return true;
            },
            () => true
        );
    }

    async addResourceWeeksToProject(
        projectIndex: number,
        resourceWeeksToAdd: number
    ) {
        const project = CmpRef.cmp.allDisplayProjects[projectIndex];
        project.resourceWeeks = {};

        const date = moment(project.startDate, Config.dateFormat);

        while (date.format(Config.dateFormat) <= project.endDate) {
            project.resourceWeeks[
                `${date.isoWeekYear()}-${date.isoWeek().toString().padStart(2, "0")}`
            ] = resourceWeeksToAdd;
            date.add(1, "days");
        }

        history.addToQueue(
            () =>
                CmpRef.cmp.addPlanningResourceWeeksToProject(
                    project.id,
                    project.resourceWeeks
                ),
            () => CmpRef.cmp.removePlanningResourceWeeksToProject(project.id)
        );

        this.refreshDisplay();
        CmpRef.cmp.planningApp.resourcePlanningContainer.refreshDisplay();

        return true;
    }

    getNumberOfAllDisplayProjectsAndUsers() {
        return CmpRef.cmp.allDisplayProjects.reduce(
            (total, project) => (total += project.users.length + 1),
            0
        );
    }

    getNumberOfWorkersNeededForAllProjectsForWeek(week: string) {
        return CmpRef.cmp.allDisplayProjects.reduce((total, project) => {
            if (
                project.countAsResources &&
                project.resourceWeeks[week] &&
                project.startWeekDate <= week &&
                project.endWeekDate >= week
            ) {
                total += project.resourceWeeks[week];
            }
            return total;
        }, 0);
    }

    getNumberOfWorkersWorkingForAllProjectsForWeek(week: string) {
        const numberOfWorkersWorkingSet = new Set();

        for (let i = 0, n = CmpRef.cmp.allDisplayProjects.length; i < n; i++) {
            if (
                !CmpRef.cmp.allDisplayProjects[i].countAsResources ||
                (CmpRef.cmp.allDisplayProjects[i].id != 0 &&
                    typeof CmpRef.cmp.allDisplayProjects[i].resourceWeeks[week] ===
                    "undefined")
            ) {
                continue;
            }

            CmpRef.cmp.allDisplayProjects[i].users.forEach((user) => {
                let numberOfOneDayAbsences = 0;
                for (let j = 0, m = user.absences.length; j < m; j++) {
                    if (
                        user.absences[j].startWeekDate <= week &&
                        user.absences[j].endWeekDate >= week
                    ) {
                        if (user.absences[j].numberOfDays > 1) {
                            const absenceStartDate = moment(
                                user.absences[j].startDate,
                                Config.dateFormat
                            ).day();
                            const absenceEndDate = moment(
                                user.absences[j].endDate,
                                Config.dateFormat
                            ).day();

                            if (user.absences[j].startWeekDate == week) {
                                if (absenceStartDate < 5) {
                                    return;
                                }
                            } else if (user.absences[j].endWeekDate == week) {
                                if (absenceEndDate > 1) {
                                    return;
                                }
                            } else {
                                return;
                            }
                        }

                        numberOfOneDayAbsences++;
                    }
                }

                if (numberOfOneDayAbsences > 1) {
                    return;
                }

                user.dateSegments.forEach((dateSegment) => {
                    if (
                        dateSegment.startWeekDate <= week &&
                        dateSegment.endWeekDate >= week
                    ) {
                        numberOfWorkersWorkingSet.add(user.id);
                    }
                });
            });
        }

        return numberOfWorkersWorkingSet.size;
    }

    getNumberOfWorkersWorkingOnProjectForWeek(project: Project, week: string) {
        const numberOfWorkersWorkingSet = new Set();

        project.users.forEach((user) => {
            let numberOfOneDayAbsences = 0;
            for (let j = 0, m = user.absences.length; j < m; j++) {
                if (
                    user.absences[j].startWeekDate <= week &&
                    user.absences[j].endWeekDate >= week
                ) {
                    if (user.absences[j].numberOfDays > 1) {
                        const absenceStartDate = moment(
                            user.absences[j].startDate,
                            Config.dateFormat
                        ).day();
                        const absenceEndDate = moment(
                            user.absences[j].endDate,
                            Config.dateFormat
                        ).day();

                        if (user.absences[j].startWeekDate == week) {
                            if (absenceStartDate < 5) {
                                return;
                            }
                        } else if (user.absences[j].endWeekDate == week) {
                            if (absenceEndDate > 1) {
                                return;
                            }
                        } else {
                            return;
                        }
                    }

                    numberOfOneDayAbsences++;
                }
            }

            if (numberOfOneDayAbsences > 1) {
                return;
            }

            user.dateSegments.forEach((dateSegment) => {
                if (
                    dateSegment.startWeekDate <= week &&
                    dateSegment.endWeekDate >= week
                ) {
                    const endDateOneDay = !(dateSegment.endWeekDate == week && moment(dateSegment.endDate, Config.dateFormat).isoWeekday() == 1);
                    const startDateFriday = !(dateSegment.startWeekDate == week && moment(dateSegment.startDate, Config.dateFormat).isoWeekday() > 4);

                    if(dateSegment.numberOfDays > 1 && endDateOneDay && startDateFriday) {
                        numberOfWorkersWorkingSet.add(user.id);
                    }
                }
            });
        });

        return numberOfWorkersWorkingSet.size;
    }

    getNumberOfWorkersInResourceForWeek(week: string) {
        let numberOfWorkersWorking = 0;
        CmpRef.cmp.allUsers.forEach((user) => {
            user.dateSegments.forEach((dateSegment) => {
                if (
                    dateSegment.startWeekDate <= week &&
                    dateSegment.endWeekDate >= week
                ) {
                    numberOfWorkersWorking++;
                }
            });
        });

        return numberOfWorkersWorking;
    }

    findProjectIndexByYPosition(y: number) {
        return CmpRef.cmp.allDisplayProjects.findIndex((p) => p.y > y);
    }

    findUserIndexFromProjectByYPosition(project: Project, y: number) {
        return project.users.findIndex((u) => u.y > y);
    }

    filterUsersFromProject() {
        this.updateOriginalDisplayProjectDataWithCurrent();
        CmpRef.cmp.filterUsersFromProject();

        this.setAllDisplayProjectsAndUsersCoordinates();
    }

    renderDateSegmentConnections() {
        this.overlappedUsers = [];
        const gridCon = CmpRef.cmp.planningApp.gridContainer;
        const canvas = CmpRef.cmp.planningApp.mainCanvas;
        const currentDayX =
            CmpRef.cmp.planningApp.daysContainer.getCurrentDayContainerX();
        this.findDateSegmentConnections();
        const halfWidth = Config.cellWidth / 2;
        gridCon.removeAllLineConnections();
        let lineConn = [];
        let redLines = [];
        this.lineConnections.forEach((conn) => {
            const overlappedConnections: number[] = [];
            for (let i = 0; i < conn.length - 1; i++) {
                const start = conn[i];
                for(let j = i + 1; j < conn.length ; j++){
                  const end = conn[j];

                if (start.y === end.y) {
                    continue;
                }

                const startXAndWidth = start.x + start.width;
                const endXAndWidth = end.x + end.width;

                if (
                    startXAndWidth > currentDayX &&
                    endXAndWidth > currentDayX &&
                    startXAndWidth > end.x
                ) {
                    if (
                        start.absences.some(
                            (a) =>
                                a.x <= currentDayX + halfWidth &&
                                a.x + a.width >= currentDayX + halfWidth
                        )
                    ) {
                        return;
                    }
                    if (startXAndWidth > currentDayX && !overlappedConnections.some(overCon => overCon == startXAndWidth)) {
                        overlappedConnections.push(startXAndWidth);
                    }
                    if (endXAndWidth > currentDayX && !overlappedConnections.some(overCon => overCon == endXAndWidth)) {
                        overlappedConnections.push(endXAndWidth);
                    }
                    this.overlappedUsers.push({
                        projectId: start.projectId,
                        userId: start.userId,
                    });
                    this.overlappedUsers.push({
                        projectId: end.projectId,
                        userId: end.userId,
                    });
                }
                }
            }
            for (let i = 0; i < conn.length - 1; i++) {
                const start2 = conn[i];
                for(let j = i + 1; j < conn.length ; j++){
                  const end2 = conn[j]
                if (start2.y === end2.y) {
                    continue;
                }

                if (
                    // start2.x + start2.width > currentDayX &&
                    // end2.x + end2.width > currentDayX &&
                    start2.x + start2.width > end2.x ||
                    (start2.x > end2.x && start2.x < end2.x + end2.width) || (end2.x > start2.x && end2.x < start2.x + start2.width)
                ) {
                    if(start2.x + start2.width >= currentDayX &&
                      end2.x + end2.width > currentDayX &&
                      start2.x + start2.width > end2.x )
                      {

                        // let minX = Math.min.apply(Math, overlappedConnections);

                        /*
                        const newMinX = conn[i].absences.find(
                            (a) => a.x >= currentDayX + Config.cellWidth / 2 && a.x <= minX
                        );

                        if (newMinX !== undefined) {
                            minX = newMinX.x;
                        }*/
                        for(let j = 0; j < overlappedConnections.length; j++){
                          let minX = overlappedConnections[j];
                          if(minX > start2.x + start2.width || minX > end2.x + end2.width)
                            continue;
                          let startX = start2.x >= end2.x ? start2.x : end2.x;
                          if(minX < startX) continue;
                          redLines.push({
                            "starX" : startX,
                            "starY" : end2.y,
                            "endX" : minX,
                            "endY" : end2.y
                          })
                          const startLine = new Line(
                            startX, //currentDayX + Config.cellWidth / 2,
                            start2.y,
                            minX,
                            start2.y,
                            canvas
                          );
                          startLine.setColor("red");
                          startLine.setCircleOnEnd();
                          gridCon.addLineConnection(startLine);

                          const endLine = new Line(
                            startX, //currentDayX + Config.cellWidth / 2,
                            end2.y,
                            minX,
                            end2.y,
                            canvas
                          );
                          endLine.setColor("red");
                          endLine.setCircleOnEnd();

                          gridCon.addLineConnection(endLine);
                        }

                      } else {
                        const starX = start2.x >= end2.x ? start2.x : end2.x;
                        const endX = start2.x + start2.width <= end2.x + end2.width ? start2.x + start2.width : end2.x + end2.width;
                        const startLine = new Line(
                          starX ,
                          start2.y,
                          endX,
                          start2.y,
                          canvas
                      );
                      startLine.setColor("red");
                      startLine.setCircleOnEnd();
                      gridCon.addLineConnection(startLine);
                      const endLine = new Line(
                          starX,
                          end2.y,
                          endX,
                          end2.y,
                          canvas
                      );
                      endLine.setColor("red");
                      endLine.setCircleOnEnd();
                      redLines.push({
                        "starX" : starX,
                        "starY" : end2.y,
                        "endX" : endX,
                        "endY" : end2.y
                      })
                      gridCon.addLineConnection(endLine);
                      }

                    continue;
                }

                // const currentXWidth = start2.x + start2.width;

                // const x1GDx2 = currentXWidth > end2.x;
                // const y1GDy2 = start2.y > end2.y;
                // const halfY = Math.abs(start2.y - end2.y) * 0.5;

                // const cX = currentXWidth + 150 * (y1GDy2 ? -1 : 1);

                // const cY = x1GDx2
                //     ? start2.y + halfY * (y1GDy2 ? -1 : 1)
                //     : start2.y - halfY * (y1GDy2 ? 1 : -1);

                // const lineIndex = lineConn.findIndex(ln => ln.endY == end2.y);

                // if(lineIndex == -1 &&
                //   redLines.findIndex(rd =>
                //     (rd.endX == currentXWidth ) ||
                //     (rd.starX == end2.x )) == -1)
                //     {
                //   if(conn.findIndex(ln => ln.y == start2.y && ln.x != start2.x) == -1 && currentXWidth < end2.x){
                //     lineConn.push({
                //       "currentXWidth" : currentXWidth,
                //       "startY" : start2.y,
                //       "cX" : cX,
                //       "cY" : cY,
                //       "endX" : end2.x,
                //       "endY" : end2.y,
                //       "canvas" : canvas
                //     })
                //   }

                // } else if(lineIndex != -1 && lineConn[lineIndex].currentXWidth < start2.x + start2.width){
                //   lineConn[lineIndex].currentXWidth = currentXWidth;
                //   lineConn[lineIndex].startY = start2.y;
                //   lineConn[lineIndex].cX = cX;
                //   lineConn[lineIndex].cY = cY;
                // }

            }
            }
            for (let i = 0; i < conn.length - 1; i++) {
              const start2 = conn[i];
              for(let j = i + 1; j < conn.length ; j++){
                const end2 = conn[j]
              if (start2.y === end2.y) {
                  continue;
              }
              if (
                  start2.x + start2.width > currentDayX &&
                  end2.x + end2.width > currentDayX &&
                  start2.x + start2.width > end2.x ||
                  (start2.x > end2.x && start2.x < end2.x + end2.width) || (end2.x > start2.x && end2.x < start2.x + start2.width)
              ) {
                  continue;
              }

              const currentXWidth = start2.x + start2.width;

              const x1GDx2 = currentXWidth > end2.x;
              const y1GDy2 = start2.y > end2.y;
              const halfY = Math.abs(start2.y - end2.y) * 0.5;

              const cX = currentXWidth + 150 * (y1GDy2 ? -1 : 1);

              const cY = x1GDx2
                  ? start2.y + halfY * (y1GDy2 ? -1 : 1)
                  : start2.y - halfY * (y1GDy2 ? 1 : -1);

              const lineIndex = lineConn.findIndex(ln => ln.endY == end2.y);

              if(lineIndex == -1 &&
                redLines.findIndex(rd =>
                  (rd.endX == currentXWidth ) ||
                  (rd.starX == end2.x ) && (lineConn[i] && (rd.startY == lineConn[i].startY || rd.startY == lineConn[i].endY) )) == -1)
                  {
                if(//conn.findIndex(ln => ln.y == start2.y && ln.x != start2.x) == -1 &&
                currentXWidth <= end2.x){
                  lineConn.push({
                    "currentXWidth" : currentXWidth,
                    "startY" : start2.y,
                    "cX" : cX,
                    "cY" : cY,
                    "endX" : end2.x,
                    "endY" : end2.y,
                    "canvas" : canvas
                  })
                }

              } else if(lineIndex != -1 && (currentXWidth < lineConn[lineIndex].endX && lineConn[lineIndex].currentXWidth < start2.x + start2.width)){
                lineConn[lineIndex].currentXWidth = currentXWidth;
                lineConn[lineIndex].startY = start2.y;
                lineConn[lineIndex].cX = cX;
                lineConn[lineIndex].cY = cY;
              }

          }
          }
        });
        for(let i = 0; i < lineConn.length; i++){
          if(lineConn[i].currentXWidth <= lineConn[i].endX && (
            redLines.findIndex(rd =>
              (rd.endX == lineConn[i].currentXWidth ) ||
              (rd.starX == lineConn[i].endX ) && ( lineConn[i] && (rd.startY == lineConn[i].startY || rd.startY == lineConn[i].endY ))) == -1)
          ){
            const curve = new BezierCurve(
              lineConn[i].currentXWidth,
              lineConn[i].startY,
              lineConn[i].cX,
              lineConn[i].cY,
              lineConn[i].endX,
              lineConn[i].endY,
              lineConn[i].canvas
            );
            gridCon.addLineConnection(curve);
          }

        }
        gridCon
            .getLineConnections()
            .forEach((line) => line.setParent(gridCon.getInnerContainer()));
    }

    findDateSegmentConnections() {
        const connections = {};

        CmpRef.cmp.allDisplayProjects.forEach((project) => {
            if (project.id <= 0) {
                return;
            }

            project.users.forEach((user) => {
                if (!connections[user.id]) {
                    connections[user.id] = [];
                }

                user.dateSegments.forEach((dateSegment) => {
                    connections[user.id].push({
                        absences: user.absences.map((a) => ({
                            x: a.x,
                            width: a.numberOfDays * Config.cellWidth,
                        })),
                        projectId: project.id,
                        userId: user.id,
                        width: dateSegment.numberOfDays * Config.cellWidth,
                        x: dateSegment.x,
                        y: project.y + user.y + Config.cellHeight * 1.5,
                    });
                });
              });
        });
        for (const key in connections) {
            if (connections[key].length <= 1) {
                delete connections[key];
            } else {
                connections[key]
                    .sort((a, b) => {
                        if (a.x < b.x) {
                            return -1;
                        }
                        if (a.x > b.x) {
                            return 1;
                        }
                        return 0;
                    })
                    .sort((a, b) => a.x - b.x);
            }
        }

        this.lineConnections = Object.values(connections);
    }

    updateOriginalDisplayProjectDataWithCurrent() {
        CmpRef.cmp.allDisplayProjects.forEach((project) => {
            const projectIndex = CmpRef.cmp.allDisplayProjectsOriginal.findIndex(
                (p) => p.id === project.id
            );

            const originalProject =
                CmpRef.cmp.allDisplayProjectsOriginal[projectIndex];

            project.users.forEach((user) => {
                const userIndex = originalProject.users.findIndex(
                    (u) =>
                        u.id === user.id &&
                        u.isResponsiblePerson === user.isResponsiblePerson
                );
                if (userIndex !== -1) {
                    originalProject.users[userIndex] = user;
                } else {
                    originalProject.users.push(user);
                }
            });

            originalProject.users = originalProject.users.filter((originalUser) => {
                return !originalUser.isMoved;
            });

            project.users = originalProject.users;
            CmpRef.cmp.allDisplayProjectsOriginal[projectIndex] = project;
        });

    }

    createSelectedUsersContainer(x: number, y: number) {
        if (this.selectedUsersContainer) {
            this.canvas.removeChildById(this.selectedUsersContainer.getId());
            this.canvas.removeChildById(this.movingLineIndicator.getId());
            this.userTableBodyContainer
                .getInnerContainer()
                .removeChildById(this.selectedUsersContainer.getId());
            this.selectedUsersContainer = null;
            Config.boxHeight = 0;
        }
        CmpRef.cmp.selectedUsersForStyleChange = [];
        this.selectionBox = new Rectangle(x, y, 0, 0, this.canvas, this);
        this.selectionBox.setBackgroundColor("rgba(51,143,255,0.3)");
        this.selectionBox.setBorder("#338FFF", 2);
        this.getChildren().forEach((child) =>
            this.canvas.addDrawingContainer(child)
        );

        this.canvas.getCanvasElement().onmousemove = (e) => {
            if (this.selectionBox) {
                if (e.offsetX > this.getWidth()) {
                    this.selectionBox.setWidth(this.getWidth() - x);
                } else {
                    this.selectionBox.setWidth(e.offsetX - x);
                }
                this.selectionBox.setHeight(e.offsetY - y - Config.toolboxSize);
            }
        };
        this.canvas.getCanvasElement().onmouseup = (e) => {
            if (this.selectionBox) {
                const boxHeight = this.selectionBox.getHeight();
                this.removeChildById(this.selectionBox.getId());
                this.selectionBox = null;
                Config.boxHeight = 0;
                this.canvas.endSelection();
                this.selectedUsersContainer = new SelectedUsersContainer(
                    x,
                    this.firstUserBoxSelectedPosition + Config.deltaMovementBetweenBoxes,
                    Config.sideCanvasSize - Config.sideSectionRightBorderWidth,
                    boxHeight,
                    this.canvas,
                    this.userTableBodyContainer.getInnerContainer()
                );
                this.canvas.addChild(this.selectedUsersContainer);
            }

            this.selectedUsersContainer.setOnMouseDownHandler(() => {
                if (e.shiftKey) {
                    Config.deltaMovementBetweenBoxes =
                        Math.trunc(
                            (e.offsetY -
                                this.selectedUsersContainer.getY() -
                                Config.topSectionSize -
                                Config.toolboxSize -
                                Config.cellHeight) /
                            Config.cellHeight
                        ) * Config.cellHeight;
                }
                this.movingLineIndicator = new MovingLineIndicator(
                    this.selectedUsersContainer.getX() + Config.cellHeight * 2,
                    this.selectedUsersContainer.getHeight() - Config.cellHeight,
                    "100%",
                    Config.cellHeight * 2,
                    this.canvas,
                    this.selectedUsersContainer
                );

                this.canvas.addChild(this.movingLineIndicator);
                this.canvas.getChildren().forEach((child) => {
                    this.canvas.addDrawingContainer(child);
                });

                this.canvas.getCanvasElement().onmousemove = (ev) => {
                    if (ev.movementY != 0) {
                        this.throttle(() => {
                            this.movingLineIndicator.move(ev.movementY);
                        }, 100)();
                    }
                };

                this.addRemoveEventsForMouseDownEvent((e2) => {
                    document.body.style.cursor = "default";
                    if (e.screenY === e2.screenY) {
                        this.canvas.removeChildById(this.movingLineIndicator.getId());
                        this.refreshDisplay();
                        this.canvas.resetDrawingContainers();
                        return;
                    }

                    const usersInBox = this.selectedUsersContainer.getSelectedUsers();
                    if (usersInBox.length == 0) {
                        this.canvas.resetDrawingContainers();
                        this.refreshDisplay();
                        this.canvas.removeChildById(this.selectedUsersContainer.getId());
                        this.canvas.removeChildById(this.movingLineIndicator.getId());
                        return;
                    }

                    const currentUserProjectIndex =
                        CmpRef.cmp.allDisplayProjects.findIndex(
                            (p) => p.id == usersInBox[0].projectId
                        );
                    const mY = this.movingLineIndicator.getY();
                    const currentProject =
                        CmpRef.cmp.allDisplayProjects[currentUserProjectIndex];

                    const uIndex = this.findUserIndexFromProjectByYPosition(
                        currentProject,
                        mY
                    );

                    const maxY = currentProject.users[currentProject.users.length - 1].y;
                    history.addToQueue(
                        () => true,
                        () => true
                    );

                    if (this.movingLineIndicator.getY() < 0) {
                        usersInBox.sort((a, b) => {
                            return b.userY - a.userY;
                        });
                    }
                    usersInBox.forEach((user, index) => {
                        currentProject.users = currentProject.users.sort(
                            (a, b) => a.sortIndex - b.sortIndex
                        );
                        const userIndex = currentProject.users.findIndex(
                            (u) => u.id == user.userId
                        );
                        if (userIndex == -1) {
                            return;
                        }

                        if (uIndex == -1) {
                            this.onDropUser(
                                null,
                                userIndex,
                                currentUserProjectIndex,
                                maxY,
                                true
                            );
                        } else {
                            this.onDropUser(
                                null,
                                userIndex,
                                currentUserProjectIndex,
                                mY +
                                currentProject.users[userIndex].y +
                                Config.cellHeight *
                                (mY > 0 ? -index : index - usersInBox.length + 1),
                                true
                            );
                        }
                    });
                    this.enumerateUnmovedUsers();

                    history.appendToQueueGroup(
                        () => true,
                        () => true
                    ); // needs to be here to store state for redo

                    this.canvas.resetDrawingContainers();
                    this.refreshDisplay();
                    this.canvas.removeChildById(this.selectedUsersContainer.getId());
                    this.canvas.removeChildById(this.movingLineIndicator.getId());
                });
            });
        };
    }

    refreshDisplay() {

        this.filterUsersFromProject();
        this.updateInnerContainerHeight();

        if(this.getNumberOfAllDisplayProjectsAndUsers() * Config.cellHeight < CmpRef.cmp.planningApp.gridContainer.getHeight()){
          CmpRef.cmp.planningApp.gridContainer.getVerticalScrollbar().getSlider().move(-100000);
        }

        const gridVerticalSlider = CmpRef.cmp.planningApp.gridContainer
            .getVerticalScrollbar()
            .getSlider();
        gridVerticalSlider.updateSliderSize();
        gridVerticalSlider.move(0);

        let projectIndex =
            CmpRef.cmp.planningApp.projectUsersContainer.findProjectIndexByYPosition(
                gridVerticalSlider.getY() * gridVerticalSlider.getMultiplier()
            );
        projectIndex = projectIndex >= 1 ? projectIndex - 1 : 0;

        CmpRef.cmp.planningApp.projectUsersContainer.setCurrentDisplayProjectIndex(
            projectIndex
        );

        this.userTableBodyContainer.getInnerContainer().removeAllChildren();
        CmpRef.cmp.planningApp.gridContainer
            .getInnerContainer()
            .removeAllChildren();
        this.renderDateSegmentConnections();
        this.addAllDisplayProjectsThatFitContainerView();
        this.getRowNumbersContainer().refreshDisplay();
        CmpRef.cmp.planningApp.sideSection.draw();
        CmpRef.cmp.planningApp.gridContainer.draw();
    }

    renderHighlightedLines(container: GenericContainer, y: number = 0) {
        new Line(
            0,
            y + 1,
            container.getWidth(),
            y + 1,
            container.getCanvas(),
            container
        );
        new Line(
            0,
            y + Config.cellHeight - 1,
            container.getWidth(),
            y + Config.cellHeight - 1,
            container.getCanvas(),
            container
        );
    }
}
