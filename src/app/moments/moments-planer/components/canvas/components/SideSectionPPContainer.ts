import { AScrollableContainer } from "src/app/canvas-ui/AScrollableContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { IResizable } from "src/app/canvas-ui/interfaces/IResizable";
import { Rectangle } from "src/app/canvas-ui/Rectangle";
import { CmpRef } from "src/app/moments/project-moments/resource-planning-app/CmpRef";
import { Configuration } from "./Configuration";
import { CppRef } from "./CppRef";

export class SideSectionPPContainer extends AScrollableContainer implements IResizable {

  private minWidth = 300;
  private rightBorder: Rectangle;

  constructor(x: number, y: number, width: string | number, height: string | number, canvas: Canvas, parent) {
    super(x, y, width, height, canvas, parent);
  }

  resize(amountResized: number) {
    if (this.getWidth() + amountResized < this.minWidth) {
            Configuration.sideCanvasSize = this.minWidth;
            CmpRef.cmp.planningApp.mainSection.setWidth(CppRef.cpp.projectPlanningApp.mainCanvas.getWidth() - this.minWidth);
            CppRef.cpp.projectPlanningApp.mainSection.setX(this.minWidth);
            CmpRef.cmp.planningApp.resourcePlanningContainer.setWidth(CppRef.cpp.projectPlanningApp.mainSection.getWidth() - Configuration.scrollbarSize);
            this.setWidth(this.minWidth);
            CmpRef.cmp.planningApp.resourcePlanningHeadingsContainer.displayResourcePlanningHeadings();
            return;
        }

        const columns = CmpRef.cmp.visibleColumns;
        const maxWidth = columns[columns.length - 1].x + columns[columns.length - 1].width + Configuration.cellHeight + Configuration.sideSectionRightBorderWidth;

        if (this.getWidth() + amountResized > maxWidth) {
            Configuration.sideCanvasSize = maxWidth;
            CppRef.cpp.projectPlanningApp.mainSection.setWidth(CppRef.cpp.projectPlanningApp.mainCanvas.getWidth() - maxWidth);
            CppRef.cpp.projectPlanningApp.mainSection.setX(maxWidth);
            CmpRef.cmp.planningApp.resourcePlanningContainer.setWidth(CppRef.cpp.projectPlanningApp.mainSection.getWidth() - Configuration.scrollbarSize);
            this.setWidth(maxWidth);
            CmpRef.cmp.planningApp.resourcePlanningHeadingsContainer.displayResourcePlanningHeadings();
            return;
        }

        this.setWidth(this.getWidth() + amountResized);
        Configuration.sideCanvasSize += amountResized;
        CppRef.cpp.projectPlanningApp.mainSection.setWidth(CppRef.cpp.projectPlanningApp.mainSection.getWidth() - amountResized);
        CppRef.cpp.projectPlanningApp.mainSection.setX(CppRef.cpp.projectPlanningApp.mainSection.getX() + amountResized);
        CmpRef.cmp.planningApp.resourcePlanningContainer.setWidth(CppRef.cpp.projectPlanningApp.mainSection.getWidth() - Configuration.scrollbarSize);
        CmpRef.cmp.planningApp.resourcePlanningHeadingsContainer.displayResourcePlanningHeadings();
  }

  addRightBorder() {
        this.rightBorder = new Rectangle(0, 0, Configuration.sideSectionRightBorderWidth, this.getHeight(), this.canvas, this);
        this.rightBorder.setBackgroundColor('#E67314');
        this.rightBorder.setXAlignment('right');
        this.rightBorder.setOnMouseHoverHandler(() => document.body.style.cursor = 'col-resize');
        this.rightBorder.setOnMouseDownHandler(() => {
            document.body.style.cursor = 'col-resize';
            this.canvas.getChildren().forEach(child => this.canvas.addDrawingContainer(child));
            const slider = CppRef.cpp.projectPlanningApp.usersContainer.getUserTableBodyContainer().getHorizontalScrollbar().getSlider();
            const rightSlider = CppRef.cpp.projectPlanningApp.gridPPContainer.getHorizontalScrollbar().getSlider();
            this.canvas.getCanvasElement().onmousemove = ev => {
                slider.updateSliderSize();
                rightSlider.updateSliderSize();
                this.resize(ev.movementX);

                CmpRef.cmp.planningApp.resourecesMainSection.setX(CppRef.cpp.projectPlanningApp.sideSection.getWidth());
                CmpRef.cmp.planningApp.resourecesMainSection.setWidth(CppRef.cpp.projectPlanningApp.gridPPContainer.getWidth());
                CmpRef.cmp.planningApp.resourecesSideSection.setWidth(CppRef.cpp.projectPlanningApp.sideSection.getWidth());
                const newX = CppRef.cpp.projectPlanningApp.sideSection.getWidth() * 0.6 - CmpRef.cmp.planningApp.showHideResourcePlanning.getWidth();
                CmpRef.cmp.planningApp.showHideResourcePlanning.setX(newX);

                CmpRef.cmp.planningApp.resourcesCanvas.getContext().save();
                CmpRef.cmp.planningApp.resourcesCanvas.getContext().clearRect(0, 0, CmpRef.cmp.planningApp.resourcesCanvas.getWidth(), CmpRef.cmp.planningApp.resourcesCanvas.getHeight());
                CmpRef.cmp.planningApp.resourcesCanvas.getContext().restore();

                CmpRef.cmp.planningApp.resourcesCanvas.getChildren().forEach(child => child.draw());
            }
            this.addRemoveEventsForMouseDownEvent(() => {
                this.canvas.resetDrawingContainers();
                window.localStorage.setItem('resource_planning_side_menu_width', this.getWidth().toString());
                document.body.style.cursor = 'default';
            });
        });
    }
}
