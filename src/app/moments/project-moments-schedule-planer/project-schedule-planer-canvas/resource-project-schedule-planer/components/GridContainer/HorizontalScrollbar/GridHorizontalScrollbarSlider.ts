import { Canvas } from "src/app/canvas-ui/Canvas";
import { HorizontalScrollbarSlider } from "src/app/canvas-ui/scrollbarSchedule/HorizontalScrollbar/HorizontalScrollbarSlider";

import { CpspRef } from "../../../CpspRef";
import { DaysMonthsContainer } from "../../DaysMonthsContainer";
import { ResourcePlanningContainer } from "../../ResourceMoments/ResourcePlanningContainer";


export class GridHorizontalScrollbarSlider extends HorizontalScrollbarSlider {
    constructor(x: number, y: number, width: string|number, height: string|number, canvas: Canvas, parent) {
        super(x, y, width, height, canvas, parent);
        this.setOnMouseDownHandler((e) => {
            // CpspRef.cmp.projectSchedulePlanerApp.momentsCanvas.setElementPointerEvents('none');
            CpspRef.cmp.projectSchedulePlanerApp.resourcesCanvas.setElementPointerEvents("none");
            this.canvas.addDrawingContainer(CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer);
            this.canvas.addDrawingContainer(this.getParent().getParent());
            if(CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer && CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.isVisible)
            this.canvas.addDrawingContainer(
                CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer
              );
            this.canvas.addDrawingContainer(CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainerRightOverlayBox);
            this.canvas.getCanvasElement().onmousemove = ev => { this.move(this.limitScrollAmount(ev.movementX)); }
            this.addRemoveEventsForMouseDownEvent(() => {
                this.canvas.resetDrawingContainers();
                // CpspRef.cmp.projectSchedulePlanerApp.momentsCanvas.setElementPointerEvents('auto');
                CpspRef.cmp.projectSchedulePlanerApp.resourcesCanvas.setElementPointerEvents("auto");
            });
        });
    }

    override move(x: number) {
        super.move(x);
        CpspRef.cmp.gridSliderX+=x;
        const daysMonthContainer: DaysMonthsContainer = CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer;
        const resourcePlanningContainer: ResourcePlanningContainer =
      CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer;
        const innerContainer = daysMonthContainer.getInnerContainer();

        if (x < 0) {
            if (innerContainer.getFirstChild().getGlobalX() > this.parent.getGlobalX()) {
                daysMonthContainer.setCurrentDisplayMonthIndex(daysMonthContainer.getCurrentDisplayMonthIndex() - 1);
                daysMonthContainer.addDisplayMonthToDaysContainer(daysMonthContainer.getCurrentDisplayMonthIndex());
                innerContainer.moveLastChildToFirst();
                if(CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer && CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.isVisible){
                    resourcePlanningContainer.addResourceWeeksOfMonth(
                        daysMonthContainer.getCurrentDisplayMonthIndex()
                      );
                      resourcePlanningContainer
                        .getResourceListContainer()
                        .moveLastChildToFirst();
                }


            }

            if (innerContainer.getLastChild().getGlobalX() > this.parent.getGlobalX() + this.parent.getWidth()) {
                innerContainer.removeLastChild();
                if(CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer && CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.isVisible)
                resourcePlanningContainer.getResourceListContainer().removeLastChild();

                return;
            }
        }

        if (x > 0) {
            if (innerContainer.getLastChild().getGlobalX() + innerContainer.getLastChild().getWidth() < this.parent.getGlobalX() + this.parent.getWidth()) {
                daysMonthContainer.addDisplayMonthToDaysContainer(daysMonthContainer.getCurrentDisplayMonthIndex() + innerContainer.getChildren().length);
                if(CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer && CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.isVisible)
                resourcePlanningContainer.addResourceWeeksOfMonth(
                    daysMonthContainer.getCurrentDisplayMonthIndex() +
                      innerContainer.getChildren().length -
                      1
                  );

            }

            if (innerContainer.getFirstChild().getGlobalX() + innerContainer.getFirstChild().getWidth() < this.parent.getGlobalX()) {
                daysMonthContainer.setCurrentDisplayMonthIndex(daysMonthContainer.getCurrentDisplayMonthIndex() + 1);
                innerContainer.removeFirstChild();
                if(CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer && CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.isVisible)
                    resourcePlanningContainer.getResourceListContainer().removeFirstChild();

            }
        }
    }

    moveXWithClick(x: number) {

        super.move(x);
        const daysMonthContainer: DaysMonthsContainer = CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer;

        const newMonthIndex = daysMonthContainer.findMonthIndexByXPosition(this.getX() * this.scrollMultiplier);

        daysMonthContainer.getInnerContainer().removeAllChildren();
        daysMonthContainer.setCurrentDisplayMonthIndex(newMonthIndex);
        daysMonthContainer.addAllDisplayMonthsThatFitContainerView();
        //CpspRef.cmp.projectSchedulePlanerApp.gridContainer.draw();
        daysMonthContainer.draw();

        this.parent.getParent().draw();
        CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainerRightOverlayBox.draw();
        CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
        this.updatePositionOfAllConnections();
    }

    override updateSliderPositionIfSliderSpilledOut() {

        if (this.getX() + this.getWidth() > this.parent.getWidth()) {
            this.moveXWithClick(this.parent.getWidth() - this.getWidth() - this.getX());
        }
    }




}
