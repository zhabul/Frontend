import { Canvas } from "src/app/canvas-ui/Canvas";
import { Config } from "src/app/moments/project-moments/resource-planning-app/Config";
import { Line } from "src/app/canvas-ui/Line";
import { AScrollableContainer } from "src/app/canvas-ui/AScrollableContainer";
import { GridContainerHorizontalScrollbar } from "./HorizontalScrollbar/GridContainerHorizontalScrollbar";
import { ProjectSegment } from "./ProjectSegment";
import { GridContainerVerticalScrollbar } from "./VerticalScrollbar/GridContainerVerticalScrollbar";
import { CmpRef } from "../../CmpRef";
import { Rectangle } from "src/app/canvas-ui/Rectangle";
import { BezierCurve } from "src/app/canvas-ui/BezierCurve";
import { GenericContainer } from "src/app/canvas-ui/GenericContainer";
import { AbsenceSegment } from "./AbsenceSegment";

export class GridContainer extends AScrollableContainer {
    private lineConnections: any[] = [];

    constructor(
        x: number,
        y: number,
        width: string | number,
        height: string | number,
        canvas: Canvas,
        parent
    ) {
        super(x, y, width, height, canvas, parent);

        this.setOnMouseWheelHandler((e) => {
            if (e.deltaY !== 0) {
                this.getVerticalScrollbar()
                    .getSlider()
                    .move(e.deltaY / Config.wheelScrollSensitivity);
                CmpRef.cmp.planningApp.projectUsersContainer
                    .getUserTableBodyContainer()
                    .draw();
                CmpRef.cmp.planningApp.projectUsersContainer
                    .getRowNumbersContainer()
                    .draw();
            }

            if (e.deltaX !== 0) {
                this.getHorizontalScrollbar()
                    .getSlider()
                    .move(e.deltaX / Config.wheelScrollSensitivity);
                CmpRef.cmp.planningApp.daysContainer.draw();
                CmpRef.cmp.planningApp.resourcePlanningContainer.draw();
            }

            this.draw();
        });
    }

    getLineConnections() {
        return this.lineConnections;
    }
    addLineConnection(line: Line | BezierCurve) {
        this.lineConnections.push(line);
    }
    removeAllLineConnections() {
        this.lineConnections.length = 0;
    }

    override addHorizontalScrollbar() {
        this.horizontalScrollbar = new GridContainerHorizontalScrollbar(
            Config.scrollbarSize,
            0,
            "100%",
            Config.scrollbarSize,
            this.canvas,
            this
        );
        this.horizontalScrollbar.setYAlignment("bottom");

        this.backgroundLeft = new Rectangle(
            -Config.scrollbarSize,
            0,
            Config.scrollbarSize,
            Config.scrollbarSize,
            this.canvas,
            this.horizontalScrollbar
        );
        this.backgroundLeft.setYAlignment("bottom");
        this.backgroundLeft.setBackgroundColor("#373B40");
        this.arrowLeft = new Rectangle(
            -Config.scrollbarSize,
            0,
            10,
            10,
            this.canvas,
            this.horizontalScrollbar
        );
        this.arrowLeft.setYAlignment("bottom");
        this.arrowLeft.setY(-3);
        this.arrowLeft.addBackgroundImagePattern(
            "scroll-arrow-left",
            "scroll-arrow-left",
            10,
            15,
            "no-repeat"
        );

        this.backgroundRight = new Rectangle(
            Config.scrollbarSize,
            0,
            Config.scrollbarSize,
            Config.scrollbarSize,
            this.canvas,
            this.horizontalScrollbar
        );
        this.backgroundRight.setXAlignment("right");
        this.backgroundRight.setYAlignment("bottom");
        this.backgroundRight.setBackgroundColor("#373B40");
        this.arrowRight = new Rectangle(
            Config.scrollbarSize,
            0,
            10,
            10,
            this.canvas,
            this.horizontalScrollbar
        );
        this.arrowRight.setXAlignment("right");
        this.arrowRight.setYAlignment("bottom");
        this.arrowRight.setY(-3);
        this.arrowRight.addBackgroundImagePattern(
            "scroll-arrow-right",
            "scroll-arrow-right",
            10,
            15,
            "no-repeat"
        );

        this.setupHorizontalScrollbar();
    }

    override addVerticalScrollbar() {
        this.verticalScrollbar = new GridContainerVerticalScrollbar(
            0,
            Config.scrollbarSize,
            Config.scrollbarSize,
            "100%",
            this.canvas,
            this
        );
        this.verticalScrollbar.setXAlignment("right");

        this.backgroundUp = new Rectangle(
            0,
            -Config.scrollbarSize,
            Config.scrollbarSize,
            Config.scrollbarSize,
            this.canvas,
            this.verticalScrollbar
        );
        this.backgroundUp.setBackgroundColor("#373B40");
        this.arrowUp = new Rectangle(
            3,
            -Config.scrollbarSize,
            10,
            10,
            this.canvas,
            this.verticalScrollbar
        );
        this.arrowUp.setHeightOffset(10);
        this.arrowUp.addBackgroundImagePattern(
            "scroll-arrow-up",
            "scroll-arrow-up",
            10,
            6,
            "no-repeat"
        );

        this.backgroundDown = new Rectangle(
            0,
            Config.scrollbarSize,
            Config.scrollbarSize,
            Config.scrollbarSize,
            this.canvas,
            this.verticalScrollbar
        );
        this.backgroundDown.setYAlignment("bottom");
        this.backgroundDown.setBackgroundColor("#373B40");
        this.arrowDown = new Rectangle(
            3,
            Config.scrollbarSize,
            10,
            10,
            this.canvas,
            this.verticalScrollbar
        );
        this.arrowDown.setYAlignment("bottom");
        this.arrowDown.addBackgroundImagePattern(
            "scroll-arrow-down",
            "scroll-arrow-down",
            10,
            6,
            "no-repeat"
        );

        this.setupVerticalScrollbar();
    }

    findProjectSegmentByProjectRefIndex(projectIndex: number): ProjectSegment {
        return this.getInnerContainer()
            .getChildren()
            .find(
                (child) => child.getChildren()[0].getProjectRefIndex() === projectIndex
            )
            .getChildren()[0];
    }

    override draw() {
        this.canvas.getContext().save();

        super.drawShape(this.canvas.getContext());
        this.canvas.getContext().clip();

        this.innerContainer.draw();
        this.lineConnections.forEach((line) => line.draw());
        this.flattenChildsAbs(this.innerContainer).forEach(c => c.draw());

        this.horizontalScrollbar.draw();
        this.backgroundLeft.draw();
        this.arrowLeft.draw();
        this.backgroundRight.draw();
        this.arrowRight.draw();
        this.verticalScrollbar.draw();
        this.backgroundUp.draw();
        this.arrowUp.draw();
        this.backgroundDown.draw();
        this.arrowDown.draw();
        this.overlayGapBox.draw();

        this.canvas.getContext().restore();
    }

    flattenChildsAbs(container: GenericContainer) {
        const fal = container.getChildren().reduce((pv, cv) => {
            pv.push(...cv.getChildren());
            return pv;
        }, []);

        const abs = [];

        fal.forEach(c => {
            if (c instanceof AbsenceSegment) {
                abs.push(c);
            }
        });

        return abs;
    }
}
