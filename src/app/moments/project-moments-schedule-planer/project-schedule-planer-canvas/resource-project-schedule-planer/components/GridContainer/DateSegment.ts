import * as moment from "moment";
import { ARoundedContainer } from "src/app/canvas-ui/ARoundedContainer";
import { BezierCurveBridge } from "src/app/canvas-ui/BezierCurveBridge";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { GenericContainer } from "src/app/canvas-ui/GenericContainer";
import historySchedulePlaner from "src/app/canvas-ui/history/historySchedulePlaner";
import { IMovable } from "src/app/canvas-ui/interfaces/IMovable";
import { IResizable } from "src/app/canvas-ui/interfaces/IResizable";
import { Line } from "src/app/canvas-ui/Line";
import { Rectangle } from "src/app/canvas-ui/Rectangle";
import { RoundedRectangle } from "src/app/canvas-ui/RoundedRectangle";
import { ConfigSc } from "../../Config";
import { CpspRef } from "../../CpspRef";
import { DateSegmentDataRef } from "../../models/DateSegmentDataRef";
import { GenericRoundedContainer } from "src/app/canvas-ui/GenericRoundedContainer";
import { BackgroundImagePattern } from "src/app/canvas-ui/models/BackgroundImagePattern";

declare const $;

export class DateSegment
  extends ARoundedContainer
  implements IMovable, IResizable
{
  private startingX = 0;
  private startingWidth = 0;
  private dateSegmentDataRef: DateSegmentDataRef;
  private curveBridge: BezierCurveBridge;

  private resizeTape = false;
  private days;
  // private moveTape;
  private createNewChain = false;
  // private visibleChain = false;

  private previousTape;
  private newTape;
  private movedTape = false;

  // private chainPlus = null;
  private circle = null;
  private line = null;
  private m = null;
  private a = null;
  private startSplitX;

  private backgroundImagePattern = [];

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
      if (
        !ConfigSc.isInEditMode ||
        (CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.lockedRevision) ||
        this.dateSegmentDataRef.momentIndex == 0
      )
        return;
      // white tapes
      if(ref.dateSegmentIndex == -1)
        return;
      const activity_index =
        CpspRef.cmp.copySelectedProject.activities.findIndex(
          (obj) => obj.id == this.dateSegmentDataRef.projectIndex
        );
      const m_index = CpspRef.cmp.copySelectedProject.activities[
        activity_index
      ].moments.findIndex(
        (obj) => obj.id == this.dateSegmentDataRef.momentIndex
      );
      const end_day_x =
        this.getGlobalX() + this.getWidth() - ConfigSc.cellWidth;
      if (
        (m_index == -1 &&
          CpspRef.cmp.copySelectedProject.activities[activity_index].moments
            .length == 0 &&
          e.layerX >= end_day_x &&
          e.layerX <= end_day_x + ConfigSc.cellWidth) ||
        (m_index != -1 &&
          e.layerX >= end_day_x &&
          e.layerX <= end_day_x + ConfigSc.cellWidth &&
          CpspRef.cmp.copySelectedProject.activities[activity_index].moments[
            m_index
          ].percentage_of_realized_plan == null &&
          this.dateSegmentDataRef.dateSegmentIndex != -1)
      )
        document.body.style.cursor = "col-resize";
      else if (
        (m_index == -1 &&
          CpspRef.cmp.copySelectedProject.activities[activity_index].moments
            .length == 0 &&
          e.layerX >= this.getGlobalX() &&
          e.layerX <= this.getGlobalX() + ConfigSc.cellWidth) ||
        (m_index != -1 &&
          e.layerX >= this.getGlobalX() &&
          e.layerX <= this.getGlobalX() + ConfigSc.cellWidth &&
          CpspRef.cmp.copySelectedProject.activities[activity_index].moments[
            m_index
          ].percentage_of_realized_plan == null &&
          this.dateSegmentDataRef.dateSegmentIndex != -1)
      )
        document.body.style.cursor = "col-resize";
      else if (
        m_index != -1 &&
        CpspRef.cmp.copySelectedProject.activities[activity_index].moments[
          m_index
        ].percentage_of_realized_plan == null
      )
        document.body.style.cursor = "e-resize";
    });
    const activity_index = CpspRef.cmp.copySelectedProject.activities.findIndex(
      (obj) => obj.id == this.dateSegmentDataRef.projectIndex
    );
    this.a = CpspRef.cmp.copySelectedProject.activities[activity_index];
    const m_index = CpspRef.cmp.copySelectedProject.activities[
      activity_index
    ].moments.findIndex((obj) => obj.id == this.dateSegmentDataRef.momentIndex);
    this.m = CpspRef.cmp.copySelectedProject.activities[activity_index].moments[m_index];
    this.setOnMouseDownHandler((e) => {
      CpspRef.cmp.projectSchedulePlanerApp.mainHeader.closeDropDowns()
      if (
        !ConfigSc.isInEditMode ||
        (CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.lockedRevision)
      )
        return;
      // white tapes
      if(ref.dateSegmentIndex == -1)
        return;

      CpspRef.cmp.selectedMomentsForStyleChange = [];
      CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer =
        null;
      CpspRef.cmp.hideColumnValueInput();
      CpspRef.cmp.hideNoteInput();
      CpspRef.cmp.hideResourceWeekInput();
      CpspRef.cmp.hidePlanInput();
      let rowN =
        CpspRef.cmp.selectedProject.activities[activity_index].y /
          ConfigSc.cellHeight +
        1;
      if (m_index != -1) {
        rowN += m_index + 1;
        let moment =
          CpspRef.cmp.copySelectedProject.activities[activity_index].moments[
            m_index
          ];
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
        let activity =
          CpspRef.cmp.copySelectedProject.activities[activity_index];
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

      //CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.renderHighlightedLines(this.get)
      //CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getCanvas().resetDrawingContainers();
      const end_day_x =
        this.getGlobalX() + this.getWidth() - ConfigSc.cellWidth;
      CpspRef.cmp.tapeId = this.id;
      // if(CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.highlightedRow != undefined ){
      //   CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.highlightedRow = rowN;
      //   CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
      // }

      this.startingX = e.layerX;
      if(CpspRef.cmp.splitTape){
        const posX = Math.round( (e.layerX - this.getGlobalX() ) / (ConfigSc.cellWidth * CpspRef.cmp.pixelRation) )
        // CpspRef.cmp.splitTapeArrow = this.addIcon(
        //   // posX * ConfigSc.cellWidth * CpspRef.cmp.pixelRation,
        //   0,
        //   0,
        //   ConfigSc.cellWidth * CpspRef.cmp.pixelRation,
        //   ConfigSc.cellHeight,
        //   "arrow-split",
        //   "arrow-split",
        //   () => {},
        //   this
        // );
        // CpspRef.cmp.splitTapeArrow.setYAlignment("center");

        if(CpspRef.cmp.splitTapeArrow)
        this.getCanvas().removeChildById(CpspRef.cmp.splitTapeArrow.getId());
        CpspRef.cmp.splitTapeArrow = undefined;

        const newX = posX * ConfigSc.cellWidth * CpspRef.cmp.pixelRation;

        const leftTape = new GenericRoundedContainer(
          this.getX(),
          this.getY(),
          // 0,
          // 0,
          newX,
          this.getHeight(),
          this.getCanvas(),
          // CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer()
          this.getParent()
          );
        leftTape.setBackgroundColor(this.a ? this.a.tape_color : this.m.tape_color)
        leftTape.setBorderRoundness(8,true,false,true,false);
        leftTape.setBorder("black",0.5)
        leftTape.draw();


        this.setX(this.getX() + newX)
        this.startSplitX = this.getX();
        this.setWidth(this.getWidth() - newX)
        this.setBorderRoundness(8,false,true,false,true)

        this.canvas.addDrawingContainer(this.parent.getParent().getParent());
        this.setMoveAndResizeEvents(e);
        this.canvas.getCanvasElement().onmousemove = (ev) => {
          this.mouseMoveHandler(ev);
        };

        this.addRemoveEventsForMouseDownEvent(() => {
          CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.highlightedRow =
            rowN;
          this.fitAccordingToCellGridSize();
          // this.canvas.resetDrawingContainers();
          this.days = (Math.round(
            (this.getX() - this.startingX) / ConfigSc.cellWidth
          )) / CpspRef.cmp.pixelRation;
          // this.moveTapeF();
          if(this.getX() - this.startSplitX < ConfigSc.cellWidth * CpspRef.cmp.pixelRation){
            this.setX(this.startSplitX + ConfigSc.cellWidth * CpspRef.cmp.pixelRation)
            this.days = 1
          }
          this.splitTape(newX);
          this.days = 0;
        });
      }
      else{
        if (
          (m_index == -1 &&
            CpspRef.cmp.copySelectedProject.activities[activity_index].moments
              .length == 0 &&
            e.layerX >= end_day_x &&
            e.layerX <= end_day_x + ConfigSc.cellWidth) ||
          (m_index != -1 &&
            e.layerX >= end_day_x &&
            e.layerX <= end_day_x + ConfigSc.cellWidth &&
            CpspRef.cmp.copySelectedProject.activities[activity_index].moments[
              m_index
            ].percentage_of_realized_plan == null &&
            this.dateSegmentDataRef.dateSegmentIndex != -1)
        ) {
          CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.highlightedRow =
            rowN;
          // CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer
          //   .getCanvas()
          //   .resetDrawingContainers();
          //   CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer().removeAllChildren();
          // CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.momentTableBodyContainer.getInnerContainer().removeAllChildren();
          // CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.addAllDisplayProjectsThatFitContainerView()
          // CpspRef.cmp.projectSchedulePlanerApp.gridContainer.draw()
          // CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();

          if (CpspRef.cmp.moveTape != undefined) {
            this.removeAllChildren();
            this.canvas.resetDrawingContainers();
          }
          if(CpspRef.cmp.chainPlus != undefined){
            CpspRef.cmp.chainPlus.getParent().removeChildById(CpspRef.cmp.chainPlus.getId())
            this.removeAllChildren();
            this.canvas.resetDrawingContainers();
            CpspRef.cmp.chainPlus = undefined;
          }
          this.drawResizeTapeArrow(activity_index, m_index, true);
          CpspRef.cmp.selectedMomentsForStyleChange = [];
          this.movedTape = false;
          // CpspRef.cmp.selectedMomentsForStyleChange.push({
          //   projectId: CpspRef.cmp.copySelectedProject.id,
          //   activityId:
          //     CpspRef.cmp.copySelectedProject.activities[activity_index].moments[
          //       m_index
          //     ] != undefined
          //       ? CpspRef.cmp.copySelectedProject.activities[activity_index]
          //           .moments[m_index].activity_id
          //       : CpspRef.cmp.copySelectedProject.activities[activity_index].id,
          //   stateType:
          //     CpspRef.cmp.copySelectedProject.activities[activity_index].moments[
          //       m_index
          //     ] != undefined
          //       ? CpspRef.cmp.copySelectedProject.activities[activity_index]
          //           .moments[m_index].state
          //       : null,
          //   planId:
          //     CpspRef.cmp.copySelectedProject.activities[activity_index].moments[
          //       m_index
          //     ] != undefined
          //       ? CpspRef.cmp.copySelectedProject.activities[activity_index]
          //           .moments[m_index].id
          //       : null,
          //   state_number:
          //     CpspRef.cmp.copySelectedProject.activities[activity_index].moments[
          //       m_index
          //     ] != undefined
          //       ? CpspRef.cmp.copySelectedProject.activities[activity_index]
          //           .moments[m_index].state_number
          //       : null,
          //   moment:
          //       CpspRef.cmp.copySelectedProject.activities[activity_index].moments[
          //         m_index
          //       ] != undefined
          //         ? CpspRef.cmp.copySelectedProject.activities[activity_index]
          //             .moments[m_index]
          //         : CpspRef.cmp.copySelectedProject.activities[activity_index],
          // });
          CpspRef.cmp.selectedMomentsForStyleChange.push(
                CpspRef.cmp.copySelectedProject.activities[activity_index].moments[
                  m_index
                ] != undefined
                  ? CpspRef.cmp.copySelectedProject.activities[activity_index]
                      .moments[m_index]
                  : CpspRef.cmp.copySelectedProject.activities[activity_index],
          );
        } else if (
          (m_index == -1 &&
            CpspRef.cmp.copySelectedProject.activities[activity_index].moments
              .length == 0 &&
            e.layerX >= this.getGlobalX() &&
            e.layerX <= this.getGlobalX() + ConfigSc.cellWidth) ||
          (m_index != -1 &&
            e.layerX >= this.getGlobalX() &&
            e.layerX <= this.getGlobalX() + ConfigSc.cellWidth &&
            CpspRef.cmp.copySelectedProject.activities[activity_index].moments[
              m_index
            ].percentage_of_realized_plan == null &&
            this.dateSegmentDataRef.dateSegmentIndex != -1)
        ) {
          CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.highlightedRow =
            rowN;
          // CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer
          //   .getCanvas()
          //   .resetDrawingContainers();
          // CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer().removeAllChildren();
          // CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.momentTableBodyContainer.getInnerContainer().removeAllChildren();
          // CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.addAllDisplayProjectsThatFitContainerView()
          // CpspRef.cmp.projectSchedulePlanerApp.gridContainer.draw()
          if (CpspRef.cmp.moveTape != undefined || CpspRef.cmp.chainPlus != undefined) {
            this.removeAllChildren();
            this.canvas.resetDrawingContainers();
          }
          if(CpspRef.cmp.chainPlus != undefined){
            CpspRef.cmp.chainPlus.getParent().removeChildById(CpspRef.cmp.chainPlus.getId())
            this.removeAllChildren();
            this.canvas.resetDrawingContainers();
            CpspRef.cmp.chainPlus = undefined;
          }
          this.drawResizeTapeArrow(activity_index, m_index, false);
          CpspRef.cmp.selectedMomentsForStyleChange.push(
            CpspRef.cmp.copySelectedProject.activities[activity_index].moments[
              m_index
            ] != undefined
              ? CpspRef.cmp.copySelectedProject.activities[activity_index]
                  .moments[m_index]
              : CpspRef.cmp.copySelectedProject.activities[activity_index],
      );
        } else if (
          (m_index == -1 &&
            CpspRef.cmp.copySelectedProject.activities[activity_index].moments
              .length == 0) ||
          (m_index != -1 &&
            CpspRef.cmp.copySelectedProject.activities[activity_index].moments[
              m_index
            ].percentage_of_realized_plan == null)
        ) {
          this.canvas.addDrawingContainer(this.parent.getParent().getParent());
          this.setMoveAndResizeEvents(e);
          this.canvas.getCanvasElement().onmousemove = (ev) => {
            this.mouseMoveHandler(ev);
          };

          this.addRemoveEventsForMouseDownEvent(() => {
            CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.highlightedRow =
              rowN;
            this.fitAccordingToCellGridSize();
            this.canvas.resetDrawingContainers();
            this.days = (Math.round(
              (this.getX() - this.startingX) / ConfigSc.cellWidth
            )) / CpspRef.cmp.pixelRation;
            this.moveTapeF();
            this.days = 0;

            CpspRef.cmp.activityIndex = this.a.id;
            CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.highlightedRow = (this.a.y / ConfigSc.cellHeight) + 1;
            if(this.m){
              CpspRef.cmp.planIndex = this.m.id;
              CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.highlightedRow = ((this.a.y + this.m.y )/ ConfigSc.cellHeight) + 2;
            }

            // if (this.movedTape) {
            //   const a_ind = CpspRef.cmp.copySelectedProject.activities.findIndex(
            //     (a) => a.id == this.dateSegmentDataRef.projectIndex
            //   );
            //   const a = CpspRef.cmp.copySelectedProject.activities[a_ind];
            //   const m = CpspRef.cmp.copySelectedProject.activities
            //     .find((a) => a.id == this.dateSegmentDataRef.projectIndex)
            //     .moments.find((m) => m.id == this.dateSegmentDataRef.momentIndex);
            //   const changes = [];
            //   const previousState = [];
            //   const changesDate = [];
            //   const previousStateDate = [];

            //   if (m != undefined) {
            //     changes.push({
            //       projectId: CpspRef.cmp.project.id,
            //       planId: m.id,
            //       startDate: m.start_date,
            //       endDate: m.end_date,
            //     });

            //     changesDate.push({
            //       projectId: CpspRef.cmp.project.id,
            //       activityId: a.id,
            //       stateType: m.state,
            //       planId: m.id,
            //       startDate: m.dateSegments[0].startWorkDate,
            //       endDate: m.dateSegments[0].currentWorkDate,
            //     });
            //   } else {
            //     changes.push({
            //       projectId: CpspRef.cmp.project.id,
            //       planId: a.id,
            //       startDate: a.startDate,
            //       endDate: a.endDate,
            //     });
            //     changesDate.push({
            //       projectId: CpspRef.cmp.project.id,
            //       activityId: a.id,
            //       stateType: null,
            //       planId: null,
            //       startDate: a.dateSegments[0].startWorkDate,
            //       endDate: a.dateSegments[0].currentWorkDate,
            //     });
            //   }

            //   CpspRef.cmp.saveMoveTape(
            //     previousState,
            //     changes,
            //     previousStateDate,
            //     changesDate
            //   );
            // }
            if(!this.movedTape) {
              this.dateSegmentDataRef.momentIndex == -1
                ? (CpspRef.cmp.tapeMomActId =
                    this.dateSegmentDataRef.projectIndex)
                : (CpspRef.cmp.tapeMomActId =
                    this.dateSegmentDataRef.momentIndex);
              // CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.highlightedRow =
              //   null;
              CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();

              this.setBorder("black", 3);

              //get x difference between sideSection ending and dateSegment start
              const difference =
                CpspRef.cmp.projectSchedulePlanerApp.sideSection.getX() +
                CpspRef.cmp.projectSchedulePlanerApp.sideSection.getWidth() -
                this.getGlobalX();

              //set dateSegment x and width if sidesection and datesegment overlap
              if (difference > 0) {
                this.setX(this.getX() + difference);
                this.setWidth(this.getWidth() - difference);
                this.setBorderRoundness(8, false, true, false, true);
              }

              this.draw();
            }


            CpspRef.cmp.selectedMomentsForStyleChange = [];
            // CpspRef.cmp.selectedMomentsForStyleChange.push({
            //   projectId: CpspRef.cmp.copySelectedProject.id,
            //   moment:
            //     CpspRef.cmp.copySelectedProject.activities[activity_index]
            //       .moments[m_index] != undefined
            //       ? CpspRef.cmp.copySelectedProject.activities[activity_index]
            //           .moments[m_index]
            //       : CpspRef.cmp.copySelectedProject.activities[activity_index],
            //   activityId:
            //     CpspRef.cmp.copySelectedProject.activities[activity_index]
            //       .moments[m_index] != undefined
            //       ? CpspRef.cmp.copySelectedProject.activities[activity_index]
            //           .moments[m_index].activity_id
            //       : CpspRef.cmp.copySelectedProject.activities[activity_index].id,
            //   stateType:
            //     CpspRef.cmp.copySelectedProject.activities[activity_index]
            //       .moments[m_index] != undefined
            //       ? CpspRef.cmp.copySelectedProject.activities[activity_index]
            //           .moments[m_index].state
            //       : null,
            //   planId:
            //     CpspRef.cmp.copySelectedProject.activities[activity_index]
            //       .moments[m_index] != undefined
            //       ? CpspRef.cmp.copySelectedProject.activities[activity_index]
            //           .moments[m_index].id
            //       : null,
            //   state_number:
            //     CpspRef.cmp.copySelectedProject.activities[activity_index]
            //       .moments[m_index] != undefined
            //       ? CpspRef.cmp.copySelectedProject.activities[activity_index]
            //           .moments[m_index].state_number
            //       : null,
            // });
            CpspRef.cmp.selectedMomentsForStyleChange.push(
                CpspRef.cmp.copySelectedProject.activities[activity_index]
                  .moments[m_index] != undefined
                  ? CpspRef.cmp.copySelectedProject.activities[activity_index]
                      .moments[m_index]
                  : CpspRef.cmp.copySelectedProject.activities[activity_index]);
          });
        }
      }

    });

    if(this.m && this.m.percentage_of_realized_plan == null && this.m.monster && this.m.monster > 0 && this.dateSegmentDataRef.dateSegmentIndex != -1){
      this.addBackgroundImagePatterns(
        CpspRef.cmp.monsters.at(this.m.monster - 1),
        CpspRef.cmp.monsters.at(this.m.monster - 1),
        ConfigSc.cellWidth * CpspRef.cmp.pixelRation,
        this.getHeight(),
        "repeat-x",
        -1
      )
    } else if(this.a.monster && this.a.moments.length == 0 && this.a.monster > 0 && this.dateSegmentDataRef.dateSegmentIndex != -1){
      this.addBackgroundImagePatterns(
        CpspRef.cmp.monsters.at(this.a.monster - 1),
        CpspRef.cmp.monsters.at(this.a.monster - 1),
        ConfigSc.cellWidth * CpspRef.cmp.pixelRation,
        this.getHeight(),
        "repeat-x",
        -1
      )
    }


  }

  // private moveMouseTape(activity_index,m_index){
  //   window.addEventListener("mousedown",(e)=>{
  //     if(this.isShapeClicked(e.x-65,e.y) && this.id==CpspRef.cmp.tapeId){
  //       CpspRef.cmp.selectedMomentsForStyleChange=[];
  //       CpspRef.cmp.moveTapeMouse=true;
  //       this.days=0;
  //       this.last_day_x=e.x-65;
  //       this.moveMouseAndResizeTape(activity_index,m_index)
  //     }
  //   });
  //   window.addEventListener("mouseup",(e)=>{
  //     if(CpspRef.cmp.moveTapeMouse){
  //       CpspRef.cmp.moveTapeMouse=false;
  //       CpspRef.cmp.selectedMomentsForStyleChange=[];
  //     }
  //   });
  // }

  private drawResizeTapeArrow(activity_index: number, m_index: number, right) {
    if(CpspRef.cmp.moveTape == undefined){
      CpspRef.cmp.moveTape = new GenericContainer(
        //const moveTape= new GenericContainer(
        right ? this.getWidth() - ConfigSc.cellWidth : -ConfigSc.cellWidth,
        -ConfigSc.cellHeight / 4,
        ConfigSc.cellWidth * 2,
        ConfigSc.cellHeight,
        this.canvas,
        this
      );
      // const orange_cell = new GenericContainer(
      //   right ? ConfigSc.cellWidth : 0,
      //   0,
      //   ConfigSc.cellWidth,
      //   ConfigSc.cellHeight,
      //   this.canvas,
      //   CpspRef.cmp.moveTape
      // );
      // orange_cell.setBackgroundColor("#F77E04");


      const arrow_move = this.addIcon(
        0,
        0,
        ConfigSc.cellWidth * 2,
        ConfigSc.cellHeight,
        right ? "arrow-move" : "arrow-move-left",
        right ? "arrow-move" : "arrow-move-left",
        () => {},
        CpspRef.cmp.moveTape
      );
      arrow_move.setYAlignment("center");

    } else {
      if(CpspRef.cmp.moveTape.getX() > 0 && !right){
      CpspRef.cmp.moveTape.getFirstChild().removeBackgroundImagePattern("arrow-move");
      CpspRef.cmp.moveTape.getFirstChild().addBackgroundImagePattern(
        "arrow-move-left",
        "arrow-move-left",
        ConfigSc.cellWidth * 2,
        ConfigSc.cellHeight
        );
      } else if(CpspRef.cmp.moveTape.getX() < 0 && right){
        CpspRef.cmp.moveTape.getFirstChild().removeBackgroundImagePattern("arrow-move-left");
        CpspRef.cmp.moveTape.getFirstChild().addBackgroundImagePattern(
          "arrow-move",
          "arrow-move",
          ConfigSc.cellWidth * 2,
          ConfigSc.cellHeight
          );
      }
      CpspRef.cmp.moveTape.setParent(this);
      CpspRef.cmp.moveTape.setX(right ? this.getWidth() - ConfigSc.cellWidth : -ConfigSc.cellWidth);
      CpspRef.cmp.moveTape.setY(-ConfigSc.cellHeight / 4);

      // CpspRef.cmp.moveTape.removeAllChildren();
      // CpspRef.cmp.moveTape.setWidth()
      // CpspRef.cmp.moveTape.
      // CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas().removeChildById(CpspRef.cmp.moveTape.getId())
      CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas().resetDrawingContainers()
    }

    CpspRef.cmp.moveTape.draw();

    //   CpspRef.cmp.moveTape.getCanvas().getCanvasElement().onmousedown = (e) => {
    //     this.resizeTape=true;
    //     this.canvas.addDrawingContainer(this.parent.getParent().getParent());
    //     this.setMoveAndResizeEvents(e);
    //     CpspRef.cmp.moveTape.getCanvas().getCanvasElement().onmousemove = (ev) => {

    //       this.mouseMoveHandler(ev);

    //       // if(Math.round((ev.clientX -65  - this.startingX)/ConfigSc.cellWidth) != this.days){
    //       //   this.days = Math.round((ev.clientX-65 - this.startingX)/ConfigSc.cellWidth);
    //       //   this.startingX = ev.clientX -65
    //       // }
    //       // CpspRef.cmp.moveTape.setX(CpspRef.cmp.moveTape.getX() + this.days * ConfigSc.cellWidth )
    //     };

    //     CpspRef.cmp.moveTape.addRemoveEventsForMouseDownEvent(() => {
    //       //CpspRef.cmp.moveTape.setX(CpspRef.cmp.moveTape.getX() + 100)
    //       this.resizeTape=false;
    //       CpspRef.cmp.moveTape.getParent().removeAllChildren();
    //       this.canvas.removeChildById(CpspRef.cmp.moveTape.getId())
    //       //CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay()
    //       this.canvas.resetDrawingContainers();

    //     })

    //     // CpspRef.cmp.moveTape.addRemoveEventsForMouseDownEvent(() => {

    //     //   this.canvas.resetDrawingContainers();
    //     //   CpspRef.cmp.moveTape.getParent().removeAllChildren()
    //     //   if(this.resizeTape){
    //     //     this.resizeTape=false;
    //     //     if(this.previousTape == undefined)return;
    //     //     //this.getFirstChild().getFirstChild().setVisibility();
    //     //     const activity = CpspRef.cmp.copySelectedProject.activities[activity_index];
    //     //     const m = CpspRef.cmp.copySelectedProject.activities[activity_index].moments[m_index];

    //     //     if(m != undefined){
    //     //           //case if endDate is Sunday or Saturday
    //     //           if(new Date(m.end_date).getDay() == 0 || new Date(m.end_date).getDay() == 6){

    //     //             while(new Date(m.end_date).getDay() == 0 || new Date(m.end_date).getDay() == 6){
    //     //               m.end_date = moment(m.end_date).add(-1,"days").format(ConfigSc.dateFormat)
    //     //             }
    //     //             if(m.dateSegments[0].currentWorkDate > m.end_date)
    //     //               m.dateSegments[0].currentWorkDate = m.end_date;
    //     //             m.dateSegments[0].endDate = m.end_date;
    //     //             m.dateSegments[0].endWeekDate = moment(m.end_date).format(ConfigSc.dateWeekFormat);
    //     //             m.dateSegments[0].numberOfDays = moment(m.end_date).diff(moment(m.dateSegments[0].startDate, ConfigSc.dateFormat), 'days') + 1;
    //     //           }
    //     //       this.newTape = JSON.parse(JSON.stringify(m));
    //     //       //parent check
    //     //       const formattedNewStartDateState =null;
    //     //       const formattedNewEndDateState =null;
    //     //       const parent_index=CpspRef.cmp.copySelectedProject.activities[activity_index].moments.findIndex((obj)=> obj.id==m.parent && obj.state_number==m.state_number-1);

    //     //         if(parent_index!=-1){
    //     //           do{

    //     //           formattedNewStartDateState =CpspRef.cmp.copySelectedProject.activities[activity_index].moments[parent_index].end_date;
    //     //           formattedNewEndDateState =CpspRef.cmp.copySelectedProject.activities[activity_index].moments[parent_index].start_date;

    //     //           const i=parent_index;

    //     //           for(i=i+1;i<CpspRef.cmp.copySelectedProject.activities[activity_index].moments.length;i++){
    //     //             if(CpspRef.cmp.copySelectedProject.activities[activity_index].moments[i].state_number<=CpspRef.cmp.copySelectedProject.activities[activity_index].moments[parent_index].state_number) break;

    //     //             if(
    //     //               CpspRef.cmp.copySelectedProject.activities[activity_index].moments[i].start_date<formattedNewStartDateState
    //     //             ){
    //     //               formattedNewStartDateState=CpspRef.cmp.copySelectedProject.activities[activity_index].moments[i].start_date;
    //     //             }

    //     //             if(
    //     //               CpspRef.cmp.copySelectedProject.activities[activity_index].moments[i].end_date>formattedNewEndDateState
    //     //             ){
    //     //               formattedNewEndDateState=CpspRef.cmp.copySelectedProject.activities[activity_index].moments[i].end_date;
    //     //             }

    //     //           }

    //     //           CpspRef.cmp.copySelectedProject.activities[activity_index].moments[parent_index].start_date=formattedNewStartDateState;
    //     //           CpspRef.cmp.copySelectedProject.activities[activity_index].moments[parent_index].dateSegments[0].startDate = formattedNewStartDateState;
    //     //           //mm.dateSegments[0].startWeekDate = moment(formattedNewStartDateState,ConfigSc.dateWeekFormat);

    //     //           CpspRef.cmp.copySelectedProject.activities[activity_index].moments[parent_index].end_date=formattedNewEndDateState;
    //     //           CpspRef.cmp.copySelectedProject.activities[activity_index].moments[parent_index].dateSegments[0].endDate = formattedNewEndDateState;

    //     //           const newDaysBetween = moment(CpspRef.cmp.copySelectedProject.activities[activity_index].moments[parent_index].dateSegments[0].endDate, ConfigSc.dateFormat)
    //     //               CpspRef.cmp.copySelectedProject.activities[activity_index].moments[parent_index].dateSegments[0].numberOfDays = newDaysBetween.diff(moment(CpspRef.cmp.copySelectedProject.activities[activity_index].moments[parent_index].dateSegments[0].startDate, ConfigSc.dateFormat), 'days') + 1;
    //     //           parent_index=CpspRef.cmp.copySelectedProject.activities[activity_index].moments.findIndex((obj)=> obj.id==CpspRef.cmp.copySelectedProject.activities[activity_index].moments[parent_index].parent && obj.state_number==CpspRef.cmp.selectedProject.activities[activity_index].moments[parent_index].state_number-1);
    //     //           }while(parent_index!=-1);
    //     //         }
    //     //       //end of parent check
    //     //       //check activity end date
    //     //       if(m.end_date>activity.endDate){
    //     //         activity.endDate=m.end_date
    //     //         activity.numberOfDays=moment(activity.endDate,ConfigSc.dateFormat).diff(moment(activity.startDate, ConfigSc.dateFormat), 'days') + 1;
    //     //       }

    //     //       CpspRef.cmp.resizeTape(this.previousTape,this.newTape);
    //     //     }
    //     //     else{
    //     //       //case if endDate is Sunday or Saturday
    //     //       if(new Date(activity.endDate).getDay() == 0 || new Date(activity.endDate).getDay() == 6){
    //     //         while(new Date(activity.endDate).getDay() == 0 || new Date(activity.endDate).getDay() == 6){
    //     //           activity.endDate = moment(activity.endDate).add(-1,"days").format(ConfigSc.dateFormat)
    //     //         }
    //     //         if(activity.dateSegments[0].currentWorkDate > activity.endDate)
    //     //           activity.dateSegments[0].currentWorkDate = activity.endDate;
    //     //         activity.dateSegments[0].endDate = activity.endDate;
    //     //         activity.dateSegments[0].endWeekDate = moment(activity.endDate).format(ConfigSc.dateWeekFormat);
    //     //         activity.numberOfDays = moment(activity.endDate).diff(moment(activity.startDate, ConfigSc.dateFormat), 'days') + 1;
    //     //       }
    //     //       this.newTape = JSON.parse(JSON.stringify(activity));
    //     //       CpspRef.cmp.resizeTapeActivity(this.previousTape,this.newTape);
    //     //     }

    //     //     CpspRef.cmp.selectedProject = CpspRef.cmp.deepCopy(CpspRef.cmp.copySelectedProject);
    //     //     CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();

    //     //   }

    //     // })

    //  // }

    window.addEventListener("mousedown", (e) => {
      // let gl_x;
      // //check orange_cell is exist
      // if (this.getFirstChild() &&
      //   this.getFirstChild().getChildren().length > 0){
      //   gl_x = this.getFirstChild().getFirstChild().getGlobalX();

      // }
      //orange_cell.isShapeClicked(e.x-65,e.y)
      //check if click on orange_cell && orange_cell visibility
      if (
        ((e.x - 65 >= this.getGlobalX() - ConfigSc.cellWidth &&
        e.x - 65 <= this.getGlobalX()) ||
        (e.x - 65 >= this.getGlobalX() + this.getWidth() &&
        e.x - 65 <= this.getGlobalX() + this.getWidth() + ConfigSc.cellWidth)
        ) &&
        // this.getFirstChild().getFirstChild().isVisible &&
        this.id == CpspRef.cmp.tapeId
      ) {
        this.resizeTape = true;
        this.days = 0;
        this.startingX = e.clientX - 65;
        //   this.resizeTape=true;
        //this.last_day_x=orange_cell.getGlobalX()-65;
        this.moveMouseAndResizeTape(CpspRef.cmp.moveTape.getX() >= 0 ? true : false);
      }
      // else if (
      //   this.visibleChain &&
      //   e.x - 65 >= this.CpspRef.cmp.chainPlus.getGlobalX() &&
      //   e.x - 65 <= this.CpspRef.cmp.chainPlus.getGlobalX() + this.CpspRef.cmp.chainPlus.getWidth() &&
      //   // this.getFirstChild().getFirstChild()._renderOnce &&
      //   // CpspRef.cmp.moveTape.getFirstChild()._renderOnce &&
      //   this.id == CpspRef.cmp.tapeId
      // ) {
      //   this.createNewChain = true;

      //   // this.moveMouseAndResizeTape(right);
      // }
    });

    window.addEventListener("mouseup", (e) => {
      if (this.resizeTape) {
        this.resizeTape = false;
        // this.getFirstChild().getFirstChild().setVisibility();
        const activity =
          CpspRef.cmp.copySelectedProject.activities[activity_index];
        const m =
          CpspRef.cmp.copySelectedProject.activities[activity_index].moments[
            m_index
          ];

        if (m != undefined && this.previousTape != undefined) {
          let endDateTape = moment(m.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).endDate)
          //case if endDate is Sunday or Saturday
          // if (
          //   new Date(m.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).endDate).getDay() == 0 ||
          //   new Date(m.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).endDate).getDay() == 6
          // ) {
          //   while (
          //     new Date(m.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).endDate).getDay() == 0 ||
          //     new Date(m.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).endDate).getDay() == 6
          //   ) {
          //     m.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).endDate = moment(m.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).endDate)
          //       .add(-1, "days")
          //       .format(ConfigSc.dateFormat);
          //   }
          //   if (m.dateSegments[0].currentWorkDate > m.end_date)
          //     m.dateSegments[0].currentWorkDate = m.end_date;
          //   m.dateSegments[0].endDate = m.end_date;
          //   m.dateSegments[0].endWeekDate = moment(m.end_date).format(
          //     ConfigSc.dateWeekFormat
          //   );
          //   m.dateSegments[0].numberOfDays =
          //     moment(m.end_date).diff(
          //       moment(m.dateSegments[0].startDate, ConfigSc.dateFormat),
          //       "days"
          //     ) + 1;
          // }

          while(CpspRef.cmp.isWeekend(endDateTape)){
            endDateTape.add(-1, "days");
          }

          let startDateTape = moment(m.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).startDate);

          while(CpspRef.cmp.isWeekend(startDateTape)){
            startDateTape.add(1, "days");
          }

          m.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).startDate  = startDateTape.format(ConfigSc.dateFormat);
          m.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).startWeekDate  = startDateTape.format(ConfigSc.dateWeekFormat);

          m.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).endDate  = endDateTape.format(ConfigSc.dateFormat);
          m.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).endWeekDate  = endDateTape.format(ConfigSc.dateWeekFormat);

          //change numbers of workers when changing datesegment width
          m.number_of_workers =
            Math.ceil(
              (10 * m.time) /
                (CpspRef.cmp.getAllDaysOfMoment(m) *
                  CpspRef.cmp.workingHours)
            ) / 10;

          this.newTape = JSON.parse(JSON.stringify(m));

          CpspRef.cmp.updateParent(activity,m);
          //parent check
          // let formattedNewStartDateState = null;
          // let formattedNewEndDateState = null;
          // let parent_index = CpspRef.cmp.copySelectedProject.activities[
          //   activity_index
          // ].moments.findIndex(
          //   (obj) =>
          //     obj.id == m.parent && obj.state_number == m.state_number - 1
          // );
          // if (parent_index != -1) {
          //   do {
          //     formattedNewStartDateState =
          //       CpspRef.cmp.copySelectedProject.activities[activity_index]
          //         .moments[parent_index].end_date;
          //     formattedNewEndDateState =
          //       CpspRef.cmp.copySelectedProject.activities[activity_index]
          //         .moments[parent_index].start_date;

          //     let i = parent_index;

          //     for (
          //       i = i + 1;
          //       i <
          //       CpspRef.cmp.copySelectedProject.activities[activity_index]
          //         .moments.length;
          //       i++
          //     ) {
          //       if (
          //         CpspRef.cmp.copySelectedProject.activities[activity_index]
          //           .moments[i].state_number <=
          //         CpspRef.cmp.copySelectedProject.activities[activity_index]
          //           .moments[parent_index].state_number
          //       )
          //         break;

          //       if (
          //         CpspRef.cmp.copySelectedProject.activities[activity_index]
          //           .moments[i].start_date < formattedNewStartDateState
          //       ) {
          //         formattedNewStartDateState =
          //           CpspRef.cmp.copySelectedProject.activities[activity_index]
          //             .moments[i].start_date;
          //       }

          //       if (
          //         CpspRef.cmp.copySelectedProject.activities[activity_index]
          //           .moments[i].end_date > formattedNewEndDateState
          //       ) {
          //         formattedNewEndDateState =
          //           CpspRef.cmp.copySelectedProject.activities[activity_index]
          //             .moments[i].end_date;
          //       }
          //     }

          //     CpspRef.cmp.copySelectedProject.activities[
          //       activity_index
          //     ].moments[parent_index].start_date = formattedNewStartDateState;
          //     CpspRef.cmp.copySelectedProject.activities[
          //       activity_index
          //     ].moments[parent_index].dateSegments[0].startDate =
          //       formattedNewStartDateState;
          //     //mm.dateSegments[0].startWeekDate = moment(formattedNewStartDateState,ConfigSc.dateWeekFormat);

          //     CpspRef.cmp.copySelectedProject.activities[
          //       activity_index
          //     ].moments[parent_index].end_date = formattedNewEndDateState;
          //     CpspRef.cmp.copySelectedProject.activities[
          //       activity_index
          //     ].moments[parent_index].dateSegments[0].endDate =
          //       formattedNewEndDateState;

          //     const newDaysBetween = moment(
          //       CpspRef.cmp.copySelectedProject.activities[activity_index]
          //         .moments[parent_index].dateSegments[0].endDate,
          //       ConfigSc.dateFormat
          //     );
          //     CpspRef.cmp.copySelectedProject.activities[
          //       activity_index
          //     ].moments[parent_index].dateSegments[0].numberOfDays =
          //       newDaysBetween.diff(
          //         moment(
          //           CpspRef.cmp.copySelectedProject.activities[activity_index]
          //             .moments[parent_index].dateSegments[0].startDate,
          //           ConfigSc.dateFormat
          //         ),
          //         "days"
          //       ) + 1;
          //     parent_index = CpspRef.cmp.copySelectedProject.activities[
          //       activity_index
          //     ].moments.findIndex(
          //       (obj) =>
          //         obj.id ==
          //           CpspRef.cmp.copySelectedProject.activities[activity_index]
          //             .moments[parent_index].parent &&
          //         obj.state_number ==
          //           CpspRef.cmp.selectedProject.activities[activity_index]
          //             .moments[parent_index].state_number -
          //             1
          //     );
          //   } while (parent_index != -1);
          // }
          // //end of parent check

          // //start date of activity
          // let firstStartDate = null;
          // let lastEndDate = null;
          // if (activity.moments.length > 0) {
          //   firstStartDate = activity.moments[0].start_date;
          //   lastEndDate = activity.moments[0].end_date;
          // }
          // activity.moments.forEach((mom) => {
          //   if (mom.start_date < firstStartDate)
          //     firstStartDate = mom.start_date;
          //   if (mom.end_date > lastEndDate) lastEndDate = mom.end_date;
          // });
          // if (firstStartDate > activity.startDate) {
          //   activity.startDate = firstStartDate;
          //   activity.dateSegments[0].startDate = firstStartDate;
          //   activity.numberOfDays =
          //     moment(activity.endDate, ConfigSc.dateFormat).diff(
          //       moment(activity.startDate, ConfigSc.dateFormat),
          //       "days"
          //     ) + 1;
          //   activity.x =
          //     CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
          //       new Date(firstStartDate)
          //     ) * CpspRef.cmp.pixelRation;
          // }

          // //check activity end date

          // if (m.end_date > activity.endDate) {
          //   activity.endDate = m.end_date;
          //   activity.numberOfDays =
          //     moment(activity.endDate, ConfigSc.dateFormat).diff(
          //       moment(activity.startDate, ConfigSc.dateFormat),
          //       "days"
          //     ) + 1;
          //   activity.dateSegments[0].endDate = m.end_date;
          //   CpspRef.cmp.needNewApp = CpspRef.cmp.changeLatestEndDate(
          //     activity.endDate
          //   );
          // } else {
          //   activity.endDate = lastEndDate;
          //   activity.dateSegments[0].endDate = lastEndDate;
          //   activity.numberOfDays =
          //     moment(activity.endDate, ConfigSc.dateFormat).diff(
          //       moment(activity.startDate, ConfigSc.dateFormat),
          //       "days"
          //     ) + 1;
          // }
          CpspRef.cmp.resizeTape(this.previousTape, this.newTape);
        } else if (this.previousTape != undefined) {
          //case if endDate is Sunday or Saturday
          // if (
          //   new Date(activity.endDate).getDay() == 0 ||
          //   new Date(activity.endDate).getDay() == 6
          // ) {
          //   while (
          //     new Date(activity.endDate).getDay() == 0 ||
          //     new Date(activity.endDate).getDay() == 6
          //   ) {
          //     activity.endDate = moment(activity.endDate)
          //       .add(-1, "days")
          //       .format(ConfigSc.dateFormat);
          //   }
          //   if (activity.dateSegments[0].currentWorkDate > activity.endDate)
          //     activity.dateSegments[0].currentWorkDate = activity.endDate;
          //   activity.dateSegments[0].endDate = activity.endDate;
          //   activity.dateSegments[0].endWeekDate = moment(
          //     activity.endDate
          //   ).format(ConfigSc.dateWeekFormat);
          //   activity.numberOfDays =
          //     moment(activity.endDate).diff(
          //       moment(activity.startDate, ConfigSc.dateFormat),
          //       "days"
          //     ) + 1;
          // }

          let endDateTape = moment(activity.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).endDate)

          while(CpspRef.cmp.isWeekend(endDateTape)){
            endDateTape.add(-1, "days");
          }

          let startDateTape = moment(activity.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).startDate)

          while(CpspRef.cmp.isWeekend(startDateTape)){
            startDateTape.add(1, "days");
          }

          activity.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).startDate = startDateTape.format(ConfigSc.dateFormat);
          activity.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).startWeekDate = startDateTape.format(ConfigSc.dateWeekFormat);

          activity.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).endDate = endDateTape.format(ConfigSc.dateFormat);
          activity.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).endWeekDate = endDateTape.format(ConfigSc.dateWeekFormat);

          activity.number_of_workers =
            Math.ceil(
              (10 * activity.time) /
                (CpspRef.cmp.getAllDaysOfMoment(
                  activity
                ) *
                  CpspRef.cmp.workingHours)
            ) / 10;
          this.newTape = JSON.parse(JSON.stringify(activity));
          CpspRef.cmp.needNewApp = CpspRef.cmp.changeLatestEndDate(
            activity.endDate
          );
          CpspRef.cmp.resizeTapeActivity(this.previousTape, this.newTape);
        }

        CpspRef.cmp.selectedProject = CpspRef.cmp.deepCopy(
          CpspRef.cmp.copySelectedProject
        );
        if (!CpspRef.cmp.needNewApp)
          CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
      } else if (this.createNewChain) {
        this.createNewChain = false;
        let greenChainIcon;
        const momentEnd = CpspRef.cmp.getMomentByPosition(
          this.line.getX(),
          this.line.getY()
        );
        if (momentEnd != null && this.m.dateSegments[0].connected == 0 && momentEnd.id != this.m.id) {
          greenChainIcon = this.addIcon(
            CpspRef.cmp.chainPlus.getX(),
            CpspRef.cmp.chainPlus.getY(),
            16,
            16,
            "chain-icon-create-green",
            "chain-icon-create-green",
            () => {},
            CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer()
          );



          greenChainIcon.draw();
          this.m.dateSegments[0].connected = 1;
          this.m.dateSegments[0].connectedToPlan = momentEnd.id;
          this.m.changed = true;
          CpspRef.cmp.addNewLineConnection(this.m, momentEnd, false);
          CpspRef.cmp.selectedMomentsForStyleChange = [];
          historySchedulePlaner.addToQueue(
            () => true,
            () => true
          );
        }

        if (this.circle != null)
          CpspRef.cmp.projectSchedulePlanerApp.gridContainer
            .getInnerContainer()
            .removeChildById(this.circle.getId());
        if (this.line != null)
          CpspRef.cmp.projectSchedulePlanerApp.gridContainer
            .getInnerContainer()
            .removeChildById(this.line.getId());
        if (CpspRef.cmp.chainPlus != null)
          CpspRef.cmp.projectSchedulePlanerApp.gridContainer
            .getInnerContainer()
            .removeChildById(CpspRef.cmp.chainPlus.getId());
        // CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer().removeChildById(greenCpspRef.cmp.chainPlus.getId());
        CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
      }
    });

    this.addCircleMoveTape(right);
  }

  private addCircleMoveTape(right = true) {
    if (right) {

          // let m = CpspRef.cmp.returnSelectedMoment();
          let m = this.m ? this.m : this.a;
          if (m != null && m.dateSegments[0].connected != 1) {
            if (
              (m != null &&
                m.percentage_of_realized_plan == null &&
                m.start_date != null) ||
              (m != null &&
                m.moments.length == 0 &&
                m.percentage_of_realized_activity == null &&
                m.startDate != null)
            ) {
              var eDate = m.dateSegments.at(-1).endDate;
              // if (m.endDate) eDate = m.endDate;
              if(CpspRef.cmp.chainPlus == undefined){
                CpspRef.cmp.chainPlus = this.addIcon(
                  CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
                    new Date(eDate)
                  ) * CpspRef.cmp.pixelRation,
                  // 0,
                  this.m ? this.a.y + m.y + ConfigSc.cellHeight / 4 + ConfigSc.cellHeight : this.a.y + ConfigSc.cellHeight / 4 ,
                  //0,
                  16,
                  16,
                  "chain-icon-create",
                  "chain-icon-create",
                  () => {},
                  CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer()
                  // CpspRef.cmp.moveTape
                );
                // CpspRef.cmp.chainPlus = this.addIcon(
                //   0,
                //   0 + (3 * ConfigSc.cellHeight) / 10,
                //   13,
                //   13,
                //   "chain-icon-create",
                //   "chain-icon-create",
                //   () => {
                //     // this.createNewChain = true;
                //     // this.m = CpspRef.cmp.returnSelectedMoment();
                //     // this.moveMouseAndResizeTape(right);
                //   },
                //   this
                // );
              } else {
                CpspRef.cmp.chainPlus.setX(CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
                  new Date(eDate)
                ) * CpspRef.cmp.pixelRation)
                CpspRef.cmp.chainPlus.setY(this.m ? this.a.y + m.y + ConfigSc.cellHeight / 4 + ConfigSc.cellHeight : this.a.y + ConfigSc.cellHeight / 4 )
              }

              CpspRef.cmp.chainPlus.draw();
              CpspRef.cmp.chainPlus.setOnMouseDownHandler(() => {

                const circle = new RoundedRectangle(
                  CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
                    new Date(eDate)
                  ) * CpspRef.cmp.pixelRation,
                  this.m ? this.a.y + m.y + ConfigSc.cellHeight / 3 + ConfigSc.cellHeight : this.a.y + ConfigSc.cellHeight / 3,
                  10,
                  10,
                  CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
                  CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer()
                );
                circle.setBackgroundColor("red");
                circle.setBorderRoundness(5);
                circle.setBorder("black", 1);
                circle.draw();
                var line = new Line(
                  CpspRef.cmp.chainPlus.getX() + ConfigSc.cellWidth / 2,
                  CpspRef.cmp.chainPlus.getY() + ConfigSc.cellHeight / 2,
                  CpspRef.cmp.chainPlus.getX() + ConfigSc.cellWidth / 2,
                  CpspRef.cmp.chainPlus.getY() + ConfigSc.cellHeight / 2,
                  CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
                  CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer()
                );
                line.setLineDash([5, 5]);
                line.draw();
                // this.canvas.addDrawingContainer(this.parent.getParent().getParent());
                this.canvas.addDrawingContainer(CpspRef.cmp.chainPlus)
                this.getCanvas().getCanvasElement().onmousemove = (ev) => {
                  if (
                    (Math.abs(
                      ev.offsetX - CpspRef.cmp.chainPlus.getParent().getGlobalX()
                    ) > ConfigSc.cellWidth ||
                      Math.abs(
                        ev.offsetY - CpspRef.cmp.chainPlus.getParent().getGlobalY()
                      ) > ConfigSc.cellHeight) &&
                    ev.offsetX >
                      CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getWidth() &&
                    ev.offsetY >
                      ConfigSc.toolboxSize + ConfigSc.topSectionSize
                  ) {
                    line.setX(
                      ev.offsetX - CpspRef.cmp.chainPlus.getParent().getGlobalX()
                    );
                    line.setY(
                      ev.offsetY - CpspRef.cmp.chainPlus.getParent().getGlobalY()
                    );
                    CpspRef.cmp.chainPlus.setX(
                      ev.offsetX - CpspRef.cmp.chainPlus.getParent().getGlobalX()
                    );
                    CpspRef.cmp.chainPlus.setY(
                      ev.offsetY - CpspRef.cmp.chainPlus.getParent().getGlobalY()
                    );
                    CpspRef.cmp.projectSchedulePlanerApp.gridContainer
                      .getInnerContainer()
                      .removeChildById(line.getId());
                    CpspRef.cmp.projectSchedulePlanerApp.gridContainer
                      .getInnerContainer()
                      .removeChildById(CpspRef.cmp.chainPlus.getId());
                    // CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
                    CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas().resetDrawingContainers();

                    circle.draw();
                    line.draw();
                    CpspRef.cmp.chainPlus.draw();
                  }
                };

                CpspRef.cmp.chainPlus.addRemoveEventsForMouseDownEvent(() => {
                  var greenChainIcon;

                  var momentEnd = CpspRef.cmp.getMomentByPosition(
                    CpspRef.cmp.chainPlus.getX() / CpspRef.cmp.pixelRation,
                    CpspRef.cmp.chainPlus.getY()
                  );
                  if (
                    momentEnd != null &&
                    m.dateSegments[0].connected == 0 &&
                    m.id != momentEnd.id
                  ) {
                    greenChainIcon = this.addIcon(
                      CpspRef.cmp.chainPlus.getX(),
                      CpspRef.cmp.chainPlus.getY(),
                      16,
                      16,
                      "chain-icon-create-green",
                      "chain-icon-create-green",
                      () => {},
                      CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer()
                    );

                    greenChainIcon.draw();
                    m.dateSegments[0].connected = 1;
                    m.dateSegments[0].connectedToPlan = momentEnd.id;
                    m.changed = true;
                    CpspRef.cmp.addNewLineConnection(m, momentEnd,false);

                    CpspRef.cmp.selectedMomentsForStyleChange = [];
                    historySchedulePlaner.addToQueue(
                      () => true,
                      () => true
                    );
                  }

                  CpspRef.cmp.projectSchedulePlanerApp.gridContainer
                    .getInnerContainer()
                    .removeChildById(circle.getId());
                  CpspRef.cmp.projectSchedulePlanerApp.gridContainer
                    .getInnerContainer()
                    .removeChildById(line.getId());
                  // CpspRef.cmp.projectSchedulePlanerApp.gridContainer
                  //   .getInnerContainer()
                  //   .removeChildById(CpspRef.cmp.chainPlus.getId());
                  CpspRef.cmp.chainPlus.getParent().removeChildById(CpspRef.cmp.chainPlus.getId())
                  this.removeAllChildren();
                  this.canvas.resetDrawingContainers();
                  // CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer().removeChildById(greenCpspRef.cmp.chainPlus.getId());
                  CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
                });
              });
            }
          } else {
            // CpspRef.cmp.toastrMessage(
            //   "info",
            //   CpspRef.cmp
            //     .getTranslate()
            //     .instant("Selected moments already connected!")
            // );
          }
      //}

      // this.visibleChain = true;
      // this.CpspRef.cmp.chainPlus = this.addIcon(
      //   0,
      //   0 + (3 * ConfigSc.cellHeight) / 10,
      //   13,
      //   13,
      //   "chain-icon-create",
      //   "chain-icon-create",
      //   () => {
      //     this.createNewChain = true;
      //     this.m = CpspRef.cmp.returnSelectedMoment();
      //     this.moveMouseAndResizeTape(right);
      //   },
      //   CpspRef.cmp.moveTape
      // );
      // this.CpspRef.cmp.chainPlus.draw();
    } else {
      const radians = Math.PI / 180;
      CpspRef.cmp.moveTape.getCanvas().getContext().strokeStyle = "black";
      CpspRef.cmp.moveTape.getCanvas().getContext().lineWidth = 1;
      CpspRef.cmp.moveTape.getCanvas().getContext().fillStyle = "white";
      CpspRef.cmp.moveTape.getCanvas().getContext().beginPath();
      CpspRef.cmp.moveTape
        .getCanvas()
        .getContext()
        .arc(
          this.getGlobalX() + ConfigSc.cellWidth / 2,
          this.getGlobalY() + (3 * ConfigSc.cellHeight) / 10,
          5,
          0 * radians,
          360 * radians,
          false
        );
      CpspRef.cmp.moveTape.getCanvas().getContext().stroke();
      CpspRef.cmp.moveTape.getCanvas().getContext().fill();
    }
  }

  private moveTapeF() {
    if (this.days == 0) return;
    this.movedTape = true;
    const a_ind = CpspRef.cmp.copySelectedProject.activities.findIndex(
      (a) => a.id == this.dateSegmentDataRef.projectIndex
    );
    const a = CpspRef.cmp.copySelectedProject.activities[a_ind];
    const m = CpspRef.cmp.copySelectedProject.activities
      .find((a) => a.id == this.dateSegmentDataRef.projectIndex)
      .moments.find((m) => m.id == this.dateSegmentDataRef.momentIndex);
    if (m != undefined) {
      // CpspRef.cmp.selectedMomentsForStyleChange.push({
      //   "planId" : m.id,
      //   "moment": m,
      //   "state_number" : m.state_number
      // })
      CpspRef.cmp.selectedMomentsForStyleChange.push(m)
      CpspRef.cmp.changeMomentsDate(this.days,true,this.dateSegmentDataRef.dateSegmentIndex);
      return;
    } else {
      // CpspRef.cmp.selectedMomentsForStyleChange.push({
      //   "planId" : null,
      //   "projectId" : CpspRef.cmp.project.id,
      //   "moment" : a,
      //   "activityId" : a.id
      // })
      CpspRef.cmp.selectedMomentsForStyleChange.push(a)
      CpspRef.cmp.changeMomentsDate(this.days,true,this.dateSegmentDataRef.dateSegmentIndex);
      return;
    }
  }


  private splitTape(newX) {
    if (this.days == 0) return;
    this.movedTape = true;
    const a_ind = CpspRef.cmp.copySelectedProject.activities.findIndex(
      (a) => a.id == this.dateSegmentDataRef.projectIndex
    );
    const a = CpspRef.cmp.copySelectedProject.activities[a_ind];
    const m = CpspRef.cmp.copySelectedProject.activities
      .find((a) => a.id == this.dateSegmentDataRef.projectIndex)
      .moments.find((m) => m.id == this.dateSegmentDataRef.momentIndex);
    if (m != undefined) {
      // CpspRef.cmp.selectedMomentsForStyleChange.push({
      //   "planId" : m.id,
      //   "moment": m,
      //   "state_number" : m.state_number
      // })
      CpspRef.cmp.selectedMomentsForStyleChange.push(m)
      CpspRef.cmp.splitTapeF(newX,this.startSplitX,this.getX(),this.getX() + this.getWidth(),this.dateSegmentDataRef.dateSegmentIndex);
      return;

    } else {
      // CpspRef.cmp.selectedMomentsForStyleChange.push({
      //   "planId" : null,
      //   "projectId" : CpspRef.cmp.project.id,
      //   "moment" : a,
      //   "activityId" : a.id
      // })
      CpspRef.cmp.selectedMomentsForStyleChange.push(a)

      CpspRef.cmp.splitTapeF(newX,this.startSplitX,this.getX(),this.getX() + this.getWidth(),this.dateSegmentDataRef.dateSegmentIndex);
      return;
    }
  }

  private moveMouseAndResizeTape(right) {
    //const m=CpspRef.cmp.selectedProject.activities[activity_index].moments[m_index];
    const a_ind = CpspRef.cmp.copySelectedProject.activities.findIndex(
      (a) => a.id == this.dateSegmentDataRef.projectIndex
    );
    const a = CpspRef.cmp.copySelectedProject.activities[a_ind];
    const m = CpspRef.cmp.copySelectedProject.activities
      .find((a) => a.id == this.dateSegmentDataRef.projectIndex)
      .moments.find((m) => m.id == this.dateSegmentDataRef.momentIndex);

    let firstMove = false;
    window.addEventListener("mousemove", (e) => {
      if (this.resizeTape) {
        //if(this.days == 0 )return;
        //if(this.days!=Math.floor((e.clientX- this.last_day_x)/ConfigSc.cellWidth)){

        if (
          Math.round((e.clientX - 65 - this.startingX) / ConfigSc.cellWidth) !=
          this.days
        ) {
          this.days = (Math.round(
            (e.clientX - 65 - this.startingX) / ConfigSc.cellWidth
          )) / CpspRef.cmp.pixelRation;
          this.startingX = e.clientX - 65;
          //CpspRef.cmp.changeMomentsDate(this.days > 1 ? 1 : -1)
          //CpspRef.cmp.moveTapeF();

          const t_move_x =
            CpspRef.cmp.moveTape.getX() + this.days * (ConfigSc.cellWidth*CpspRef.cmp.pixelRation);
          //this.days = Math.round((e.clientX-65 - this.startingX)/ConfigSc.cellWidth);
          //this.days=Math.floor((e.clientX- this.last_day_x)/ConfigSc.cellWidth);
          let newEndDate;
          let newStartDate;
          if (m != undefined) {
            if (right) {
              newEndDate = moment(
                m.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).endDate,
                ConfigSc.dateFormat
              ).add(this.days, "days");
              const formattedNewEndDate = newEndDate.format(
                ConfigSc.dateFormat
              );

              const durationTape =
                newEndDate.diff(
                  moment(m.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).startDate, ConfigSc.dateFormat),
                  "days"
                ) + 1;

              if (durationTape > 0 &&
                (
                  this.dateSegmentDataRef.dateSegmentIndex === this.m.dateSegments.length - 1 ||
                  (
                    this.dateSegmentDataRef.dateSegmentIndex < this.m.dateSegments.length - 1 &&
                    formattedNewEndDate <= this.m.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex + 1).startDate
                  )
                )
                ) {
                this.previousTape = JSON.parse(JSON.stringify(m));
                if (
                  m.end_date == m.dateSegments[0].currentWorkDate &&
                  durationTape < m.dateSegments[0].numberOfDays
                ) {
                  m.dateSegments[0].currentWorkDate = formattedNewEndDate;
                }
                m.dateSegments[0].startWorkDate = m.start_date;
                // m.end_date = formattedNewEndDate;
                m.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).endDate = formattedNewEndDate;

                m.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).endDate = formattedNewEndDate;
                m.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).endWeekDate = newEndDate.format(
                  ConfigSc.dateWeekFormat
                );
                m.dateSegments[0].numberOfDays =
                  newEndDate.diff(
                    moment(m.dateSegments[0].startDate, ConfigSc.dateFormat),
                    "days"
                  ) + 1;
                a.changed = true;
                m.changed = true;

                //CpspRef.cmp.selectedProject.activities[a_ind].moments[m_index]=m;
                //CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
                this.setWidth(this.getWidth() + this.days * (ConfigSc.cellWidth * CpspRef.cmp.pixelRation));
                CpspRef.cmp.moveTape.setX(t_move_x);
                if (CpspRef.cmp.chainPlus != null)
          CpspRef.cmp.projectSchedulePlanerApp.gridContainer
            .getInnerContainer()
            .removeChildById(CpspRef.cmp.chainPlus.getId());
                this.canvas.resetDrawingContainers();
                CpspRef.cmp.moveTape.draw()
                // this.addCircleMoveTape(right);
              }
            } else {
              newStartDate = moment(
                m.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).startDate,
                ConfigSc.dateFormat
              ).add(this.days, "days");
              const formattednewStartDate = newStartDate.format(
                ConfigSc.dateFormat
              );
              const durationTape =
                newStartDate.diff(
                  moment(m.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).endDate, ConfigSc.dateFormat),
                  "days"
                ) + 1;

              if (durationTape < 2 &&
                (
                  this.dateSegmentDataRef.dateSegmentIndex === 0 ||
                  (
                    this.dateSegmentDataRef.dateSegmentIndex > 0 &&
                    formattednewStartDate >= this.m.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex - 1).endDate
                  )
                )
                ) {
                if (formattednewStartDate < a.startDate) {
                  CpspRef.cmp.toastrMessage(
                    "info",
                    CpspRef.cmp
                      .getTranslate()
                      .instant(
                        "You can't move moment to start before activity!"
                      )
                  );
                  return;
                }
                this.previousTape = JSON.parse(JSON.stringify(m));
                if (m.dateSegments[0].startWorkDate != null)
                  m.dateSegments[0].startWorkDate = formattednewStartDate;
                m.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).startDate = formattednewStartDate;

                m.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).startDate = formattednewStartDate;
                m.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).startWeekDate = newStartDate.format(
                  ConfigSc.dateWeekFormat
                );
                m.dateSegments[0].numberOfDays =
                  -1 *
                    newStartDate.diff(
                      moment(m.dateSegments[0].endDate, ConfigSc.dateFormat),
                      "days"
                    ) +
                  1;

                a.changed = true;
                m.changed = true;

                //CpspRef.cmp.selectedProject.activities[a_ind].moments[m_index]=m;
                //CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
                this.setWidth(
                  this.getWidth() + -1 * this.days * (ConfigSc.cellWidth * CpspRef.cmp.pixelRation)
                );
                this.setX(this.getX() + this.days * (ConfigSc.cellWidth * CpspRef.cmp.pixelRation));
                //CpspRef.cmp.moveTape.setX(t_move_x)
                //CpspRef.cmp.moveTape.draw()
                if (CpspRef.cmp.chainPlus != null)
          CpspRef.cmp.projectSchedulePlanerApp.gridContainer
            .getInnerContainer()
            .removeChildById(CpspRef.cmp.chainPlus.getId());
                this.canvas.resetDrawingContainers();
                // this.addCircleMoveTape(right);
              }
            }
          } else {
            if (right) {
              newEndDate = moment(a.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).endDate, ConfigSc.dateFormat).add(
                this.days,
                "days"
              );
              const formattedNewEndDate = newEndDate.format(
                ConfigSc.dateFormat
              );

              const durationTape =
                newEndDate.diff(
                  moment(a.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).startDate, ConfigSc.dateFormat),
                  "days"
                ) + 1;

              if (durationTape > 0 &&
                (
                  this.dateSegmentDataRef.dateSegmentIndex === this.a.dateSegments.length - 1 ||
                  (
                    this.dateSegmentDataRef.dateSegmentIndex < this.a.dateSegments.length - 1 &&
                    formattedNewEndDate <= this.a.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex + 1).startDate
                  )
                )
              ){
                this.previousTape = JSON.parse(JSON.stringify(a));

                if (
                  a.endDate == a.dateSegments[0].currentWorkDate &&
                  durationTape < a.numberOfDays
                ) {
                  a.dateSegments[0].currentWorkDate = formattedNewEndDate;
                  CpspRef.cmp.selectedProject.activities[
                    a_ind
                  ].dateSegments[0].currentWorkDate = formattedNewEndDate;
                }

                a.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).endDate = formattedNewEndDate;
                a.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).endDate = formattedNewEndDate;
                a.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).endWeekDate = newEndDate.format(
                  ConfigSc.dateWeekFormat
                );
                a.numberOfDays =
                  newEndDate.diff(
                    moment(a.startDate, ConfigSc.dateFormat),
                    "days"
                  ) + 1;
                CpspRef.cmp.selectedProject.activities[a_ind].dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).endDate =
                  formattedNewEndDate;
                CpspRef.cmp.selectedProject.activities[a_ind].numberOfDays =
                  newEndDate.diff(
                    moment(a.startDate, ConfigSc.dateFormat),
                    "days"
                  ) + 1;
                  a.changed = true;
                //CpspRef.cmp.copySelectedProject.activities[activity_index].moments[m_index]=m;

                //CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();

                this.setWidth(this.getWidth() + this.days * (ConfigSc.cellWidth * CpspRef.cmp.pixelRation));
                CpspRef.cmp.moveTape.setX(t_move_x);
                if (CpspRef.cmp.chainPlus != null)
          CpspRef.cmp.projectSchedulePlanerApp.gridContainer
            .getInnerContainer()
            .removeChildById(CpspRef.cmp.chainPlus.getId());
                this.canvas.resetDrawingContainers();
                // this.addCircleMoveTape(right);
              }
            } else {
              newStartDate = moment(a.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).startDate, ConfigSc.dateFormat).add(
                this.days,
                "days"
              );
              const formattednewStartDate = newStartDate.format(
                ConfigSc.dateFormat
              );

              const durationTape =
                newStartDate.diff(
                  moment(a.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).endDate, ConfigSc.dateFormat),
                  "days"
                ) + 1;

              if (durationTape < 2 &&
                (
                  this.dateSegmentDataRef.dateSegmentIndex === 0 ||
                  (
                    this.dateSegmentDataRef.dateSegmentIndex > 0 &&
                    formattednewStartDate >= this.a.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex - 1).endDate
                  )
                )
                ) {
                this.previousTape = JSON.parse(JSON.stringify(a));

                if (
                  a.endDate == a.dateSegments[0].currentWorkDate &&
                  durationTape < a.numberOfDays
                ) {
                  a.dateSegments[0].currentWorkDate = formattednewStartDate;
                  CpspRef.cmp.selectedProject.activities[
                    a_ind
                  ].dateSegments[0].currentWorkDate = formattednewStartDate;
                }

                a.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).startDate = formattednewStartDate;
                a.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).startDate = formattednewStartDate;
                a.dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).startWeekDate = newStartDate.format(
                  ConfigSc.dateWeekFormat
                );
                a.numberOfDays =
                  -1 *
                    newStartDate.diff(
                      moment(a.endDate, ConfigSc.dateFormat),
                      "days"
                    ) +
                  1;
                CpspRef.cmp.selectedProject.activities[a_ind].dateSegments.at(this.dateSegmentDataRef.dateSegmentIndex).startDate =
                  formattednewStartDate;
                CpspRef.cmp.selectedProject.activities[a_ind].numberOfDays =
                  -1 *
                    newStartDate.diff(
                      moment(a.endDate, ConfigSc.dateFormat),
                      "days"
                    ) +
                  1;
                a.x += this.days * ConfigSc.cellWidth;
                CpspRef.cmp.selectedProject.activities[a_ind].x +=
                  this.days * ConfigSc.cellWidth;
                a.changed = true;
                //CpspRef.cmp.copySelectedProject.activities[activity_index].moments[m_index]=m;

                //CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
                this.setWidth(
                  this.getWidth() + -1 * this.days * (ConfigSc.cellWidth * CpspRef.cmp.pixelRation)
                );
                this.setX(this.getX() + this.days * (ConfigSc.cellWidth * CpspRef.cmp.pixelRation));
                //CpspRef.cmp.moveTape.setX(t_move_x)
                if (CpspRef.cmp.chainPlus != null)
          CpspRef.cmp.projectSchedulePlanerApp.gridContainer
            .getInnerContainer()
            .removeChildById(CpspRef.cmp.chainPlus.getId());
                this.canvas.resetDrawingContainers();
                // this.addCircleMoveTape(right);
              }
            }
          }
        }
      } else if (this.createNewChain) {
        if (CpspRef.cmp.selectedMomentsForStyleChange.length > 0) {
          if (CpspRef.cmp.selectedMomentsForStyleChange.length == 1) {
            if (
              (this.m != null &&
                this.m.percentage_of_realized_plan == null &&
                this.m.start_date != null) ||
              (this.m != null &&
                this.m.moments.length == 0 &&
                this.m.percentage_of_realized_activity == null &&
                this.m.startDate != null)
            ) {
              let eDate = this.m.end_date;
              if (this.m.endDate) eDate = this.m.endDate;
              if (!firstMove) {
                firstMove = true;
                this.circle = new RoundedRectangle(
                  CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
                    new Date(eDate)
                  ) * CpspRef.cmp.pixelRation,
                  this.m.y + ConfigSc.cellHeight / 3,
                  10,
                  10,
                  CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
                  CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer()
                );
                this.circle.setBackgroundColor("red");
                this.circle.setBorderRoundness(5);
                this.circle.setBorder("black", 1);
                this.circle.draw();

                this.line = new Line(
                  this.circle.getX() + ConfigSc.cellWidth / 2,
                  this.circle.getY() + ConfigSc.cellHeight / 2,
                  this.circle.getX() + ConfigSc.cellWidth / 2,
                  this.circle.getY() + ConfigSc.cellHeight / 2,
                  CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
                  CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer()
                );

                this.line.setLineDash([5, 5]);
                this.line.draw();
              }

              if (
                // (Math.abs(e.offsetX - this.CpspRef.cmp.chainPlus.getParent().getGlobalX()) >
                //   ConfigSc.cellWidth ||
                //   Math.abs(
                //     e.offsetY - this.CpspRef.cmp.chainPlus.getParent().getGlobalY()
                //   ) > ConfigSc.cellHeight) &&
                e.offsetX >
                  CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getWidth() &&
                e.offsetY > ConfigSc.toolboxSize + ConfigSc.topSectionSize
              ) {
                this.line.setX(e.offsetX - this.line.getParent().getGlobalX());
                this.line.setY(e.offsetY - this.line.getParent().getGlobalY());
                CpspRef.cmp.chainPlus.setX(
                  (e.offsetX - CpspRef.cmp.chainPlus.getParent().getGlobalX()) * CpspRef.cmp.pixelRation
                );
                CpspRef.cmp.chainPlus.setY(
                  e.offsetY - CpspRef.cmp.chainPlus.getParent().getGlobalY()
                );

                CpspRef.cmp.projectSchedulePlanerApp.gridContainer
                  .getInnerContainer()
                  .removeChildById(this.line.getId());
                CpspRef.cmp.projectSchedulePlanerApp.gridContainer
                  .getInnerContainer()
                  .removeChildById(CpspRef.cmp.chainPlus.getId());

                CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
                this.circle.draw();
                this.line.draw();
                CpspRef.cmp.chainPlus.draw();
              }
            }
          }
        }
      } else return;

      //}
      // if(CpspRef.cmp.moveTapeMouse){
      //   if(this.days!=Math.floor((e.clientX- this.last_day_x)/ConfigSc.cellWidth)){

      //     const day;
      //     if(Math.floor((e.clientX- this.last_day_x)/ConfigSc.cellWidth)>this.days)
      //       day=1;
      //     else
      //       day=-1;

      //     this.days=Math.floor((e.clientX- this.last_day_x)/ConfigSc.cellWidth);

      //     CpspRef.cmp.selectedMomentsForStyleChange.push({
      //       projectId: CpspRef.cmp.copySelectedProject.id,
      //       activityId: m != undefined ? m.activity_id : a.id,
      //       stateType: m != undefined ? m.state : null,
      //       planId: m != undefined ? m.id : null,
      //       state_number: m != undefined ? m.state_number : null
      //     })

      //     CpspRef.cmp.changeMomentsDate(day);

      //   }
      // }
    });
  }

  // private sortDateSegmentsByEndDate(dateSegments: DateSegmentData[]) {
  //     dateSegments.sort((a, b) => {
  //         if (a.endDate < b.endDate) return -1;
  //         if (a.endDate > b.endDate) return 1;
  //         return 0;
  //     });
  // }

  addCurveBridge(newLine: BezierCurveBridge) {
    this.curveBridge = newLine;
  }

  createCurveBridge() {
    this.curveBridge.draw();
  }

  move(x: number): void {
    if(this.dateSegmentDataRef.dateSegmentIndex == 0 && !CpspRef.cmp.splitTape){
      this.getParent().getChildren().forEach(tapes => {
        //only for tapes
        if(tapes.getY() == this.getY() && tapes.dateSegmentDataRef.dateSegmentIndex != -1){
          tapes.setX(tapes.getX() + x)
        }
      });
    } else {
      //moving left
      if(x < 0){
        let leftTape = this.getParent().getChildren().find(
                                                  (tape) => tape.getY() == this.getY() &&
                                                  tape.dateSegmentDataRef.dateSegmentIndex === this.dateSegmentDataRef.dateSegmentIndex - 1);
        if(leftTape.getX() + leftTape.getWidth() < this.getX() + x)
          this.setX(this.getX() + x);
      } else {
        //check part is last
        if((this.a && this.a.dateSegments.length -1 > this.dateSegmentDataRef.dateSegmentIndex) ||
          (this.m && this.m.dateSegments.length -1 > this.dateSegmentDataRef.dateSegmentIndex)){
            let rightTape = this.getParent().getChildren().find(
                                                    (tape) => tape.getY() == this.getY() &&
                                                    tape.dateSegmentDataRef.dateSegmentIndex === this.dateSegmentDataRef.dateSegmentIndex + 1);
            if(rightTape.getX() > this.getX() + this.getWidth())
              this.setX(this.getX() + x);

        } else {
          this.setX(this.getX() + x);
        }

      }
    }

  }

  resize(
    amountResized: number,
    anchor: "left" | "up" | "right" | "down"
  ): void {
    switch (anchor) {
      case "left":
        if (
          this.getX() + amountResized >
          this.getX() + this.getWidth() - ConfigSc.cellWidth
        ) {
          this.setX(this.getX() + this.getWidth() - ConfigSc.cellWidth);
          return this.setWidth(ConfigSc.cellWidth);
        }
        this.setWidth(this.getWidth() - amountResized);
        this.move(amountResized);
        break;
      case "right":
        if (this.getWidth() + amountResized < ConfigSc.cellWidth) {
          return this.setWidth(ConfigSc.cellWidth);
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
      this.fitAccordingToCellGridSize();
      // this.canvas.resetDrawingContainers();
      //this.draw()
    };

    // if (e.layerX <= this.getGlobalX() + 5) {
    //     document.body.style.cursor = "col-resize";

    //     this.mouseMoveHandler = (e) => {

    //         this.resize(e.movementX, "left");
    //         CpspRef.cmp.moveTape.setX(CpspRef.cmp.moveTape.getX() + e.movementX)
    //     }
    // }

    // if (e.layerX >= this.getGlobalX() + this.getWidth() - 5) {
    //     document.body.style.cursor = "col-resize";

    //     this.mouseMoveHandler = (e) => {
    //         this.resize(e.movementX, "right")
    //         //this.getFirstChild().setX(this.getFirstChild().getX() + e.movementX)
    //         CpspRef.cmp.moveTape.setX(CpspRef.cmp.moveTape.getX() + e.movementX)
    //     }
    // }
  }

  mouseMoveHandler(e) {} // used in setMoveAndResizeEvents

  private fitAccordingToCellGridSize() {
    const newX =
      Math.round(this.getX() / ConfigSc.cellWidth) * ConfigSc.cellWidth;
    const newWidth = Math.max(
      Math.ceil(this.getWidth() / ConfigSc.cellWidth) * ConfigSc.cellWidth,
      ConfigSc.cellWidth
    );
    this.setWidth(newWidth);
    // this.setX(newX);

    if (this.startingWidth === newWidth && this.startingX === newX) return;

    //const ref = this.dateSegmentDataRef;
    //const project = CpspRef.cmp.project;
    //const moment = project.moments[ref.momentIndex];
    //const dateSegmentData = moment.dateSegments[ref.dateSegmentIndex];
    //const previousState: DateSegmentData = JSON.parse(JSON.stringify(dateSegmentData));

    //const status: any = this.checkIfIsOverProjectOrSubProjectTimeRange(project, user, ref, { x: newX, width: newWidth });

    // CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
    // CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
    // return;

    //this.updateSegmentAfterMoveOrResize(ref, { x: newX, width: newWidth });

    // history.addToQueue(() => CpspRef.cmp.updateDateSegment(dateSegmentData),
    //                     () => CpspRef.cmp.updateDateSegment(previousState),
    //                     { type: "date-change", userId: user.id, message: `Your work date has been updated on project (${project.name})` });

    //CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
    //CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
  }

  // private updateSegmentAfterMoveOrResize(ref: DateSegmentDataRef, data: { x: number; width: number; }) {

  //   //if(this.days == 0 ) return;
  //   //this.movedTape = true;
  //   //this.days > 0 ? 1 : -1 sa this.days
  //   const a_ind=CpspRef.cmp.copySelectedProject.activities.findIndex(a => a.id == this.dateSegmentDataRef.projectIndex);
  //   const a=CpspRef.cmp.copySelectedProject.activities[a_ind];
  //   const m=CpspRef.cmp.copySelectedProject.activities.find(a => a.id == this.dateSegmentDataRef.projectIndex).moments.find(m => m.id == this.dateSegmentDataRef.momentIndex);
  //   // const changes = [];
  //   // const previousState = [];
  //   // const changesDate = [];
  //   // const previousStateDate = [];
  //   if(m!=undefined){

  //     const newStartDate = moment(m.dateSegments[0].startDate, ConfigSc.dateFormat).add(1 , 'days');

  //     const formattedNewStartDate = newStartDate.format(ConfigSc.dateFormat);

  //     if(formattedNewStartDate < a.startDate){
  //       CpspRef.cmp.toastrMessage(
  //         "info",
  //         CpspRef.cmp.getTranslate().instant("You can't move moment to start before activity!")
  //       );
  //       return;
  //     }

  //     m.start_date = moment(m.start_date).add(1,"days").format(ConfigSc.dateFormat)
  //     m.dateSegments[0].startDate = moment(m.dateSegments[0].startDate ).add(1,"days").format(ConfigSc.dateFormat)
  //     m.dateSegments[0].startWorkDate != null ? m.dateSegments[0].startWorkDate  = moment(m.dateSegments[0].startWorkDate ).add(1,"days").format(ConfigSc.dateFormat) : null
  //     m.end_date = moment(m.end_date).add(1,"days").format(ConfigSc.dateFormat)
  //     m.dateSegments[0].endDate = moment(m.dateSegments[0].endDate ).add(1,"days").format(ConfigSc.dateFormat)
  //     m.dateSegments[0].currentWorkDate != null ? m.dateSegments[0].currentWorkDate  = moment(m.dateSegments[0].currentWorkDate ).add(1,"days").format(ConfigSc.dateFormat) : null
  //     // changes.push({
  //     //   'id': m.id,
  //     //   'global_activity_id': m.global_activity_id == 0 ? null : m.global_activity_id,
  //     //   'schedule_plan_activity_id': m.schedule_plan_activity_id,
  //     //   'moment_id': m.moment_id,
  //     //   'name': m.name,
  //     //   'plan' : m.plan,
  //     //   'start_date' : m.start_date,
  //     //   'end_date' : m.end_date,
  //     //   'time' : m.time,
  //     //   'number_of_workers' : m.number_of_workers,
  //     //   'group_id' : m.group_id,
  //     //   'state_number': m.state_number,
  //     //   'sort_index': m.sort_index
  //     // });

  //     // changesDate.push({
  //     //   projectId: CpspRef.cmp.project.id,
  //     //   activityId: a.id,
  //     //   stateType: m.state,
  //     //   planId: m.id,
  //     //   startDate:m.dateSegments[0].startWorkDate,
  //     //   endDate:m.dateSegments[0].currentWorkDate
  //     // });

  //     const formattedNewStartDateState =null;
  //     const formattedNewEndDateState =null;

  //     //update all parent date
  //     const parent_index=a.moments.findIndex((obj)=> obj.id==m.parent && obj.state_number==m.state_number-1);

  //     if(parent_index!=-1){
  //       do{

  //       formattedNewStartDateState = moment(a.moments[parent_index].end_date, ConfigSc.dateFormat).add(1 , 'days').format(ConfigSc.dateFormat) ;
  //       formattedNewEndDateState = moment(a.moments[parent_index].start_date, ConfigSc.dateFormat).add(1 , 'days').format(ConfigSc.dateFormat) ;

  //       const i=parent_index;

  //       for(i=i+1;i<a.moments.length;i++){
  //         if(a.moments[i].state_number<=a.moments[parent_index].state_number) break;

  //         if(
  //           a.moments[i].start_date<formattedNewStartDateState
  //         ){
  //           formattedNewStartDateState=a.moments[i].start_date;
  //         }

  //         if(
  //           a.moments[i].end_date>formattedNewEndDateState
  //         ){
  //           formattedNewEndDateState=a.moments[i].end_date;
  //         }

  //       }

  //       a.moments[parent_index].start_date=formattedNewStartDateState;
  //       a.moments[parent_index].dateSegments[0].startDate = formattedNewStartDateState;

  //       a.moments[parent_index].end_date=formattedNewEndDateState;
  //       a.moments[parent_index].dateSegments[0].endDate = formattedNewEndDateState;

  //       const newDaysBetween = moment(a.moments[parent_index].dateSegments[0].endDate, ConfigSc.dateFormat)
  //       a.moments[parent_index].dateSegments[0].numberOfDays = newDaysBetween.diff(moment(a.moments[parent_index].dateSegments[0].startDate, ConfigSc.dateFormat), 'days') + 1;
  //       parent_index=a.moments.findIndex((obj)=> obj.id==a.moments[parent_index].parent && obj.state_number==a.moments[parent_index].state_number-1);

  //     }while(parent_index!=-1);
  //     }

  //     //end of update all parent date

  //     //bitan number of days
  //     if(m.end_date>a.endDate){
  //       a.endDate=m.end_date
  //       a.numberOfDays=moment(a.endDate,ConfigSc.dateFormat).diff(moment(a.startDate, ConfigSc.dateFormat), 'days') + 1;
  //     }

  //   }
  //   else{

  //       const newStartDate = moment(a.startDate, ConfigSc.dateFormat).add(1 , 'days');
  //       const newEndDate = moment(a.endDate, ConfigSc.dateFormat).add(1 , 'days');
  //       const formattedNewStartDate = newStartDate.format(ConfigSc.dateFormat);
  //       const formattedNewEndDate = newEndDate.format(ConfigSc.dateFormat);

  //       a.startDate = formattedNewStartDate;
  //       a.endDate = formattedNewEndDate;
  //       a.x += 1 *  ConfigSc.cellWidth
  //       //a.x += 1 > 0 ? 1*  ConfigSc.cellWidth : -1 * ConfigSc.cellWidth

  //       a.dateSegments[0].startDate = formattedNewStartDate;
  //       a.dateSegments[0].startWeekDate = newStartDate.format(ConfigSc.dateWeekFormat);
  //       a.dateSegments[0].currentWorkDate == null ? null : a.dateSegments[0].currentWorkDate = moment(a.dateSegments[0].currentWorkDate, ConfigSc.dateFormat).add(1, 'days').format(ConfigSc.dateFormat);
  //       a.dateSegments[0].startWorkDate == null ? null : a.dateSegments[0].startWorkDate = moment(a.dateSegments[0].startWorkDate, ConfigSc.dateFormat).add(1, 'days').format(ConfigSc.dateFormat);
  //       a.dateSegments[0].endDate = formattedNewEndDate;
  //       a.dateSegments[0].endWeekDate = newEndDate.format(ConfigSc.dateWeekFormat);
  //       //activity.dateSegments[0].numberOfDays = newEndDate.diff(moment(m.dateSegments[0].startWorkDate == null ? m.dateSegments[0].startDate : m.dateSegments[0].startWorkDate, ConfigSc.dateFormat), 'days') + 1;

  //   }
  //   CpspRef.cmp.selectedProject=CpspRef.cmp.deepCopy(CpspRef.cmp.copySelectedProject);
  //   // CpspRef.cmp.saveMoveTape(previousState,changes,previousStateDate,changesDate)

  //   //CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay()

  //     // const segmentData = CpspRef.cmp.project.moment[ref.momentIndex].dateSegments[0];

  //     // const newStartDate = moment(segmentData.startDate, ConfigSc.dateFormat);
  //     // newStartDate.add((data.x - segmentData.x) / ConfigSc.cellWidth, "days");

  //     // let overlap = false;

  //     // if(typeof CpspRef.cmp.project.moments[ref.momentIndex].dateSegments[0] !== "undefined") {
  //     //     const nextDateSegment = CpspRef.cmp.project.moment[ref.momentIndex].dateSegments[0];
  //     //     const newEndDate = newStartDate.clone().add((data.width / ConfigSc.cellWidth) - 1, "days");

  //     //     const nextStartDate = moment(nextDateSegment.startDate, ConfigSc.dateFormat);
  //     //     const nextEndDate = moment(nextDateSegment.endDate, ConfigSc.dateFormat);

  //     //     if(newEndDate.isSameOrAfter(nextStartDate) && newEndDate.isSameOrBefore(nextEndDate)) {
  //     //         segmentData.endDate = nextStartDate.clone().add(-1, "days").format(ConfigSc.dateFormat);
  //     //         segmentData.endWeekDate = nextStartDate.clone().add(-1, "days").format(ConfigSc.dateWeekFormat);

  //     //         segmentData.numberOfDays = nextStartDate.diff(newStartDate, "days");
  //     //         overlap = true;
  //     //     }
  //     // }
  //     // else if(typeof CpspRef.cmp.project.moment[ref.momentIndex].dateSegments[0] !== "undefined") {
  //     //     const previusDateSegment = CpspRef.cmp.project.moment[ref.momentIndex].dateSegments[0];

  //     //     const previusStartDate = moment(previusDateSegment.startDate, ConfigSc.dateFormat);
  //     //     const previusEndDate = moment(previusDateSegment.endDate, ConfigSc.dateFormat);

  //     //     if(newStartDate.isSameOrAfter(previusStartDate) && newStartDate.isSameOrBefore(previusEndDate)) {
  //     //         segmentData.startDate = previusEndDate.clone().add(1, "days").format(ConfigSc.dateFormat);
  //     //         segmentData.startWeekDate = previusEndDate.clone().add(1, "days").format(ConfigSc.dateWeekFormat);

  //     //         segmentData.x = previusDateSegment.x + ((previusDateSegment.numberOfDays+1) * ConfigSc.cellWidth);
  //     //         segmentData.numberOfDays = moment(segmentData.endDate, ConfigSc.dateFormat).diff(previusEndDate, "days");
  //     //         overlap = true;
  //     //     }
  //     // }

  //     // if(!overlap) {
  //     //     segmentData.x = data.x;
  //     //     segmentData.numberOfDays = data.width / ConfigSc.cellWidth;
  //     //     segmentData.startDate = newStartDate.format(ConfigSc.dateFormat);
  //     //     segmentData.startWeekDate = newStartDate.format(ConfigSc.dateWeekFormat);
  //     //     newStartDate.add(segmentData.numberOfDays - 1, "days");
  //     //     segmentData.endDate = newStartDate.format(ConfigSc.dateFormat);
  //     //     segmentData.endWeekDate = newStartDate.format(ConfigSc.dateWeekFormat);
  //     // }
  // }

  override draw() {
    const gridContainer = CpspRef.cmp.projectSchedulePlanerApp.gridContainer;
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

    if (this.backgroundImagePattern.length > 0) {
      let context = this.getCanvas().getContext();
      context.beginPath();
      this.drawRoundedRectangles(
        this.getGlobalX(),
        this.getGlobalY(),
        this.getWidth(),
        this.getHeight(),
        this.getBorderRoundness(),
        context
      )

      this.backgroundImagePattern.forEach((p) => {
        // DOMMatrix array indexes: scaleX, skew, skew, scaleY, translateX, translateY

        const matrix = new DOMMatrixReadOnly([
          p.width / p.image.width,
          0,
          0,
          p.height / p.image.height,
          this.getGlobalX() + p.offsetX,
          this.getGlobalY() + p.offsetY,
        ]);
        p.pattern.setTransform(matrix);
        context.fillStyle = p.pattern;
        context.fill();
      });
      context.closePath();

    }

  }

  private drawRoundedRectangles(
    x: number,
    y: number,
    width: number,
    height: number,
    roundness: number,
    context: CanvasRenderingContext2D
  ) {
    const halfRadians = Math.PI;
    const quarterRadians = Math.PI / 2;
    if (this.topLeftRound) {
      // top left arc
      context.arc(
        roundness + x,
        roundness + y,
        roundness,
        -quarterRadians,
        halfRadians,
        true
      );
    }

    if (this.bottomLeftRound) {
      // line from top left to bottom left
      context.lineTo(x, y + height - roundness);
      // bottom left arc
      context.arc(
        roundness + x,
        height - roundness + y,
        roundness,
        halfRadians,
        quarterRadians,
        true
      );
    } else {
      context.lineTo(x, y + height);
    }

    if (this.bottomRightRound) {
      // line from bottom left to bottom right
      context.lineTo(x + width - roundness, y + height);
      // bottom right arc
      context.arc(
        x + width - roundness,
        y + height - roundness,
        roundness,
        quarterRadians,
        0,
        true
      );
    } else {
      context.lineTo(x + width, y + height);
    }

    if (this.topRightRound) {
      // line from bottom right to top right
      context.lineTo(x + width, y + roundness);
      // top right arc
      context.arc(
        x + width - roundness,
        y + roundness,
        roundness,
        0,
        -quarterRadians,
        true
      );
    } else {
      context.lineTo(x + width, y);
    }

    if (this.topLeftRound) {
      // line from top right to top left
      context.lineTo(x + roundness, y);
    } else context.lineTo(x, y);
  }

  addBackgroundImagePatterns(
    name: string,
    imageId: string,
    width: number,
    height: number,
    repetition: string = "no-repeat",
    offsetX: number = 0,
    offsetY: number = 0,
    order: number = 0
  ) {
    //clean monster
    if(name == "monster-24"){
      this.backgroundImagePattern = [];
      return;
    }
    const backgroundImage = document.getElementById(
      imageId
    ) as HTMLImageElement;

    this.backgroundImagePattern.push({
      image: backgroundImage,
      width,
      height,
      name,
      pattern: this.canvas
        .getContext()
        .createPattern(backgroundImage, repetition),
      offsetX,
      offsetY,
      order,
    });

    this.backgroundImagePattern = this.backgroundImagePattern.sort(
      (a: BackgroundImagePattern, b: BackgroundImagePattern) =>
        a.order - b.order
    );
  }

  addIcon(
    x: number,
    y: number,
    width: number,
    height: number,
    iconName: string,
    iconPath: string,
    onClickFn: Function,
    parent: any = this
  ) {
    const iconShape = new Rectangle(x, y, width, height, this.canvas, parent);
    iconShape.addBackgroundImagePattern(iconName, iconPath, width, height);
    iconShape.setOnMouseHoverHandler(
      () => (document.body.style.cursor = "pointer")
    );
    iconShape.setOnMouseDownHandler(onClickFn);

    return iconShape;
  }
}
