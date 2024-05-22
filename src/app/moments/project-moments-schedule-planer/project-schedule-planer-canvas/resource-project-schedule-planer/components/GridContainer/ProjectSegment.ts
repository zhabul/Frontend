import * as moment from "moment";
import { ARoundedContainer } from "src/app/canvas-ui/ARoundedContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { GenericRoundedContainer } from "src/app/canvas-ui/GenericRoundedContainer";
import { IMovable } from "src/app/canvas-ui/interfaces/IMovable";
import { IResizable } from "src/app/canvas-ui/interfaces/IResizable";
import { TextRenderer } from "src/app/canvas-ui/TextRenderer";
import { ConfigSc } from "../../Config";
import { CpspRef } from "../../CpspRef";
import { Activity } from "../../models/Activity";

export class ProjectSegment extends ARoundedContainer implements IMovable, IResizable {

    private startingX = 0;
    private startingWidth = 0;
    private cursorChangeTimeout;
    private onClickHandler: Function = () => {}

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

      this.setOnMouseHoverHandler((e) => {
          if(!ConfigSc.isInEditMode) return;
          document.body.style.cursor = 'e-resize';
          if ((e.layerX <= this.getGlobalX() + 5) || (e.layerX >= this.getGlobalX() + this.getWidth() - 5)) document.body.style.cursor = 'col-resize';
      });

      this.setBorderRoundness(8);
      if (CpspRef.cmp.project.id > 0 && ConfigSc.isInEditMode) {
        this.setOnMouseDownHandler((e) => {
          this.setMoveAndResizeEvents(e);
          this.canvas.addDrawingContainer(this.parent.getParent().getParent());
          this.canvas.getCanvasElement().onmousemove = ev => { this.mouseMoveHandler(ev); }
          this.addRemoveEventsForMouseDownEvent((e2) => {
            document.body.style.cursor = 'default';
            clearTimeout(this.cursorChangeTimeout);
            if (e.screenX === e2.screenX) return this.onClickHandler(this);
            this.fitAccordingToCellGridSize();
            this.canvas.resetDrawingContainers();
          });
        });
      }
    }

    move(x: number): void { this.setX(this.getX() + x); }

    resize(amountResized: number, anchor: 'left'|'up'|'right'|'down'): void {
        switch (anchor) {
            case 'left':
                if (this.getX() + amountResized > this.getX() + this.getWidth() - ConfigSc.cellWidth) {
                    this.setX(this.getX() + this.getWidth() - ConfigSc.cellWidth);
                    return this.setWidth(ConfigSc.cellWidth);
                }

                this.setWidth(this.getWidth() - amountResized);
                this.move(amountResized);
                break;
            case 'right':
                if (this.getWidth() + amountResized < ConfigSc.cellWidth) {
                    return this.setWidth(ConfigSc.cellWidth);
                }

                this.setWidth(this.getWidth() + amountResized);
                break;
            case 'up':
                throw Error('Not Implemented');
            case 'down':
                throw Error('Not Implemented');
        }
    }

    override setOnClickHandler(handler: Function) { this.onClickHandler = handler; }

    setMoveAndResizeEvents(e) {
      this.startingX = this.getX();
      this.startingWidth = this.getWidth();

      this.cursorChangeTimeout = setTimeout(() => {
          document.body.style.cursor = 'e-resize';
      }, 100);

      this.mouseMoveHandler = (e) => {
          this.move(e.movementX);
      }

      if (e.layerX <= this.getGlobalX() + 5) {
          this.cursorChangeTimeout = setTimeout(() => {
              document.body.style.cursor = 'col-resize';
          }, 100);

          this.mouseMoveHandler = (e) => {
              this.resize(e.movementX, 'left');
          }
      }

      if (e.layerX >= this.getGlobalX() + this.getWidth() - 5) {
          this.cursorChangeTimeout = setTimeout(() => {
              document.body.style.cursor = 'col-resize';
          }, 100);

          this.mouseMoveHandler = (e) => {
              this.resize(e.movementX, 'right');
          }
      }
    }

  displayProjectSegmentWeeks() {
    const activity = CpspRef.cmp.selectedProject.activities[0];

    const date = moment(activity.startDate, ConfigSc.dateFormat);
    let x = 0;
    let week = date.isoWeek().toString().padStart(2, '0');
    let weekYear = date.isoWeekYear();
    let numberOfDays = 0;

    while (date.format(ConfigSc.dateFormat) <= activity.endDate) {
      numberOfDays++;
      date.add(1, 'days');

      if (date.format(ConfigSc.dateFormat) > activity.endDate || week !== date.isoWeek().toString().padStart(2, '0')) {
        const resourceWeek = `${weekYear}-${week}`;
        let resourcesNeeded = activity.resourceWeeks[resourceWeek] ? activity.resourceWeeks[resourceWeek] : 0;
        const width = numberOfDays * ConfigSc.cellWidth;

        const resourceWeekContainer = new GenericRoundedContainer(x, 0, width, this.getHeight(), this.getCanvas(), this);
        resourceWeekContainer.setBackgroundColor('rgba(0, 0, 0, 0.35)');
        resourceWeekContainer.setBorderRoundness(5);

        let numberOfWorkersWorking = 1; // CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getNumberOfWorkersWorkingOnProjectForWeek(project, resourceWeek);

        // if (project.id <= 0) {
        //     resourcesNeeded = numberOfWorkersWorking;
        //     numberOfWorkersWorking = CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getNumberOfWorkersInResourceForWeek(resourceWeek); //CmpRef.cmp.allUsers.length;
        // }

        const resourceWeekText = new TextRenderer(`${resourcesNeeded}/${numberOfWorkersWorking}`, this.getCanvas(), resourceWeekContainer);
        resourceWeekText.setColor('white');
        resourceWeekText.setAlignment('center', 'center');
        resourceWeekText.updateTextDimensions();
        if (activity.id > 0 && ConfigSc.isInEditMode) {
          resourceWeekText.setOnMouseDownHandler(() => {
            this.getCanvas().getCanvasElement().onmouseup = (e2: any) => {
              this.getCanvas().getCanvasElement().onmouseup = null;
              if (!resourceWeekText.isShapeClicked(e2.layerX, e2.layerY)) return;

              CpspRef.cmp.resourceWeekInput.style.display = 'block';
              CpspRef.cmp.resourceWeekInput.style.height = `${ConfigSc.cellHeight - 3}px`;
              CpspRef.cmp.resourceWeekInput.value = resourceWeekText.getTextContent().split('/')[0];
              CpspRef.cmp.resourceWeekInput.style.top = `${resourceWeekContainer.getGlobalY()}px`;
              const x = ConfigSc.sidebarSize + resourceWeekContainer.getGlobalX() + (resourceWeekContainer.getWidth() / 2);
              CpspRef.cmp.resourceWeekInput.style.left = `${x}px`;
              CpspRef.cmp.resourceWeekInput.focus();
              CpspRef.cmp.resourceWeekInput.select();
              CpspRef.cmp.selectedResourceWeekDataForEditing = { activity, resourceWeek, resourceWeekTextShape: resourceWeekText };
            }
          });
        }

        x += width;
        numberOfDays = 0;
      }
      week = date.isoWeek().toString().padStart(2, '0');
      weekYear = date.isoWeekYear();
    }
  }

    private mouseMoveHandler(e) {} // used in setMoveAndResizeEvents

    private fitAccordingToCellGridSize() {
        const newX = Math.round(this.getX() / ConfigSc.cellWidth) * ConfigSc.cellWidth;
        const newWidth = Math.max(Math.round(this.getWidth() / ConfigSc.cellWidth) * ConfigSc.cellWidth, ConfigSc.cellWidth);

        this.setWidth(newWidth);
        this.setX(newX);

        if (this.startingWidth === newWidth && this.startingX === newX) return;

        const projectData = CpspRef.cmp.selectedProject.activities[0];
        // const previousState = JSON.parse(JSON.stringify(projectData));
        this.updateProjectAfterMoveOrResize(projectData, { x: newX, width: newWidth });

        // history.addToQueue(() => CpspRef.cmp.updateProjectSegment(projectData),
        //                   () => CpspRef.cmp.updateProjectSegment(previousState));

        projectData.moments.forEach(moment => {
			//if (!user.isResponsiblePerson) return;
        moment.dateSegments[0].startDate = projectData.startDate;
        moment.dateSegments[0].endDate = projectData.endDate;
        moment.dateSegments[0].startWeekDate = projectData.startWeekDate;
        moment.dateSegments[0].endWeekDate = projectData.endWeekDate;
        moment.dateSegments[0].numberOfDays = projectData.numberOfDays;
        moment.dateSegments[0].x = projectData.x;
		});
    CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
    CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();

  }


  private updateProjectAfterMoveOrResize(project: Activity, data: { x: number; width: number; }) {
    const newStartDate = moment(project.startDate, ConfigSc.dateFormat);
    newStartDate.add((data.x - project.x) / ConfigSc.cellWidth, 'days');

    project.x = data.x;
    project.numberOfDays = data.width / ConfigSc.cellWidth;
    project.startDate = newStartDate.format(ConfigSc.dateFormat);
    project.startWeekDate = newStartDate.format(ConfigSc.dateWeekFormat);
    newStartDate.add(project.numberOfDays - 1, 'days');
    project.endDate = newStartDate.format(ConfigSc.dateFormat);
    project.endWeekDate = newStartDate.format(ConfigSc.dateWeekFormat);
}









}
