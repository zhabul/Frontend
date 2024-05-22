import { Canvas } from "src/app/canvas-ui/Canvas";
import { VerticalScrollbarSlider } from "src/app/canvas-ui/scrollbarSchedule/VerticalScrollbar/VerticalScrollbarSlider";

import { CpspRef } from "../../../CpspRef";
import { ProjectMomentsContainer } from "../../ProjectMoments/ProjectMomentsContainer";

export class GridVerticalScrollbarSlider extends VerticalScrollbarSlider {
    constructor(x: number, y: number, width: string|number, height: string|number, canvas: Canvas, parent) {
        super(x, y, width, height, canvas, parent);
        this.setOnMouseDownHandler((e) => {
            // CpspRef.cmp.projectSchedulePlanerApp.momentsCanvas.setElementPointerEvents('none');
            CpspRef.cmp.projectSchedulePlanerApp.resourcesCanvas.setElementPointerEvents("none");
            this.canvas.addDrawingContainer(CpspRef.cmp.projectSchedulePlanerApp.sideSection);
            this.canvas.addDrawingContainer(this.parent.getParent());
            this.canvas.getCanvasElement().onmousemove = ev => { this.move(this.limitScrollAmount(ev.movementY)); }
            this.addRemoveEventsForMouseDownEvent(() => {
                this.canvas.resetDrawingContainers();
                // CpspRef.cmp.projectSchedulePlanerApp.momentsCanvas.setElementPointerEvents('auto');
                CpspRef.cmp.projectSchedulePlanerApp.resourcesCanvas.setElementPointerEvents("auto");
            });
        })
    }

    override move(y: number) {
        super.move(y);

        if(y!= 0){
          //hide inputs
          CpspRef.cmp.hideColumnInput();
          CpspRef.cmp.hideColumnValueInput();
          CpspRef.cmp.hideResourceWeekInput();
          CpspRef.cmp.hidePlanInput();
          CpspRef.cmp.hideNoteInput();
          CpspRef.cmp.activityIndex = undefined;
        }


        const projectMomentsContainer: ProjectMomentsContainer = CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer;
        const innerContainer = projectMomentsContainer.getMomentTableBodyContainer().getInnerContainer();
        if (innerContainer.getChildren().length < 1) return;

        // if (y < 0) {
        //     if (innerContainer.getFirstChild().getGlobalY() > this.parent.getGlobalY()) {
        //         projectMomentsContainer.setCurrentDisplayProjectIndex(projectMomentsContainer.getCurrentDisplayProjectIndex() - 1);
        //         //projectMomentsContainer.addDisplayProjectToProjectUsersContainer();
        //         innerContainer.moveLastChildToFirst();
        //         this.parent.getParent().getInnerContainer().moveLastChildToFirst();
        //     }

        //     if (innerContainer.getLastChild().getGlobalY() > this.parent.getGlobalY() + this.parent.getHeight()) {
        //         innerContainer.removeLastChild();
        //         this.parent.getParent().getInnerContainer().removeLastChild();
        //         return;
        //     }
        // }

        // if (y > 0) {
        //     if (innerContainer.getLastChild().getGlobalY() + innerContainer.getLastChild().getHeight() < this.parent.getGlobalY() + this.parent.getHeight()) {
        //         //projectMomentsContainer.addDisplayProjectToProjectUsersContainer(projectMomentsContainer.getCurrentDisplayProjectIndex() + innerContainer.getChildren().length);
        //     }

        //     if (innerContainer.getFirstChild().getGlobalY() + innerContainer.getFirstChild().getHeight() < this.parent.getGlobalY()) {
        //         projectMomentsContainer.setCurrentDisplayProjectIndex(projectMomentsContainer.getCurrentDisplayProjectIndex() + 1);
        //         innerContainer.removeFirstChild();
        //         this.parent.getParent().getInnerContainer().removeFirstChild();
        //     }
        // }
        if (y < 0) {
            while (
              innerContainer.getFirstChild().getGlobalY() > this.parent.getGlobalY()
            ) {

              projectMomentsContainer.setCurrentDisplayProjectIndex(
                projectMomentsContainer.getCurrentDisplayProjectIndex() - 1
              );
              projectMomentsContainer.addDisplayProjectToProjectUsersContainer(
                projectMomentsContainer.getCurrentDisplayProjectIndex()
              );
              CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.draw();
              CpspRef.cmp.projectSchedulePlanerApp.mainHeader.draw();
              CpspRef.cmp.projectSchedulePlanerApp.sideSection.draw();
              innerContainer.moveLastChildToFirst();
              this.parent.getParent().getInnerContainer().moveLastChildToFirst();
            }

            if (
              innerContainer.getLastChild().getGlobalY() >
              this.parent.getGlobalY() + this.parent.getHeight()
            ) {
              innerContainer.removeLastChild();
              this.parent.getParent().getInnerContainer().removeLastChild();
              return;
            }
          }

          if (y > 0) {
            while(
              innerContainer.getLastChild().getGlobalY() +
              innerContainer.getLastChild().getHeight() <
              this.parent.getGlobalY() + this.parent.getHeight()
            ) {
              if(!projectMomentsContainer.addDisplayProjectToProjectUsersContainer(
                projectMomentsContainer.getCurrentDisplayProjectIndex() +
                    innerContainer.getChildren().length
                )) break;
            }

            if (
              innerContainer.getFirstChild().getGlobalY() +
                innerContainer.getFirstChild().getHeight() <
              this.parent.getGlobalY()
            ) {
                projectMomentsContainer.setCurrentDisplayProjectIndex(
                    projectMomentsContainer.getCurrentDisplayProjectIndex() + 1
              );
              innerContainer.removeFirstChild();
              this.parent.getParent().getInnerContainer().removeFirstChild();
            }
          }

    }

    moveYWithClick(y: number) {
        super.move(y);

        const projectMomentsContainer: ProjectMomentsContainer = CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer;

        let newProjectIndex = projectMomentsContainer.findProjectIndexByYPosition(this.getY() * this.scrollMultiplier);
        newProjectIndex = newProjectIndex >= 1 ? newProjectIndex - 1 : 0;
        projectMomentsContainer.getMomentTableBodyContainer().getInnerContainer().removeAllChildren();
        this.parent.getParent().getInnerContainer().removeAllChildren();
        projectMomentsContainer.setCurrentDisplayProjectIndex(newProjectIndex);
        projectMomentsContainer.refreshDisplay();

        CpspRef.cmp.projectSchedulePlanerApp.sideSection.draw();
        this.parent.getParent().draw();

    }

    override updateSliderPositionIfSliderSpilledOut() {
        if (this.getY() + this.getHeight() > this.parent.getHeight()) {
            this.moveYWithClick(this.parent.getHeight() - this.getHeight() + this.getY());
        }
    }





}





