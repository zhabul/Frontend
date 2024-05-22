import { AScrollableContainerSchedule } from "src/app/canvas-ui/AScrollableContainerSchedule";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { GenericContainer } from "src/app/canvas-ui/GenericContainer";
import { TextRenderer } from "src/app/canvas-ui/TextRenderer";
import { ConfigSc } from "../../Config";
import { CpspRef } from "../../CpspRef";
// import { SelectedMomentsContainer } from "./SelectedMomentsContainer";

export class RowListContainer extends AScrollableContainerSchedule {

    private rowNumber = 1;
    private posH = 0;
    // private firstMomentBoxSelectedPosition = 0;

    constructor(x: number, y: number, width: string|number, height: string|number, canvas: Canvas, parent) {
        super(x, y, width, height, canvas, parent);
        this.posH = 0;
        this.addAllRowNumbers();

    }


  addRowNumber(y: number) {
    const rowNumberContainer = new GenericContainer(0, y, ConfigSc.cellHeight * 2, ConfigSc.cellHeight, this.canvas, this.innerContainer);
    rowNumberContainer.setBackgroundColor('#1A1A1A');
    rowNumberContainer.setBorder('#707070', 1);
    var num = this.rowNumber;

    // rowNumberContainer.setOnMouseHoverHandler((e) => {
    //   if(!CpspRef.cmp.rowNumberSelecting){
    //     this.innerContainer.getChildren().forEach((child) => {
    //       child.setBackgroundColor('#1A1A1A')
    //     })
    //   }
    //   let cond = CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer != undefined &&
    //       CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer != null &&
    //       CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer.getGlobalY() <= e.offsetY &&
    //       e.offsetY <= CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer.getGlobalY() + CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer.getHeight()
    //       if(cond)
    //       document.body.style.cursor = "move"
    //       else {
    //         document.body.style.cursor =  "url('../../../../../../assets/img/canvas-img/arrow-pointer.svg'), auto";
    //         CpspRef.cmp.rowNumberHover = true;
    //         rowNumberContainer.setBackgroundColor("red")

    //         this.innerContainer.getChildren().forEach((row) => row.draw());

    //         CpspRef.cmp.projectSchedulePlanerApp.mainHeader.draw();
    //         CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getRowNumbersContainer().draw();

    //         //this.canvas.resetDrawingContainers()
    //         // this.draw();
    //         // CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.drawSelectedContainer();
    //       }

    // }
    //   );

      rowNumberContainer.setOnMouseHoverHandler((e) => {
        //if(!CpspRef.cmp.rowNumberSelecting){
          // this.innerContainer.getChildren().forEach((child) => {
          //   child.setBackgroundColor('#1A1A1A')
          // })
        //}
        document.body.style.cursor =  "url('../../../../../../assets/img/canvas-img/arrow-pointer.svg'), auto";
        CpspRef.cmp.rowNumberHover = true;

        this.innerContainer.getChildren().forEach((row) =>{
          if(row.getId() == rowNumberContainer.getId()){
            row.setBackgroundColor("red")
          } else {
            row.setBackgroundColor('#1A1A1A')
          }
          row.draw()
        });

        CpspRef.cmp.projectSchedulePlanerApp.mainHeader.draw();
        CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getRowNumbersContainer().draw();
      }
      );



    rowNumberContainer.setOnMouseDownHandler((e) => {
      if((CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.lockedRevision)){
        return;
      }
      CpspRef.cmp.hideColumnValueInput()
      CpspRef.cmp.tapeMomActId = 0;
      CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.highlightedRow = null;
      if (CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.movingLineIndicator)
        this.canvas.removeChildById(CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.movingLineIndicator.getId());

      // if (CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer) {
      //   this.canvas.removeChildById(CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer.getId());
      //   CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.momentTableBodyContainer.getInnerContainer().removeChildById(CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer.getId());
      //   CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer = null;
      //   ConfigSc.boxHeight = 0;
      // }

      CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectedCol = null;

      CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.firstMove = 0;
      CpspRef.cmp.projectSchedulePlanerApp.showHideResourcePlanning.clickOnHide();


      //check if selected is moment or activity
      // var selectedActivityOrMoment = null;
      var j = 0;
      // let x = 0;
      for (let i = 0; i < CpspRef.cmp.selectedProject.activities.length; i++) {
        const activity = CpspRef.cmp.selectedProject.activities[i];

        // ako je selektovani aktivitet
        if (j + 1 == num) {
          // selectedActivityOrMoment = activity;
          CpspRef.cmp.activityIndex = Number(activity.id);
          CpspRef.cmp.planIndex = null;

          // let cond = CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer != undefined &&
          // CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer != null &&
          // CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer.getGlobalY() <= e.offsetY &&
          // e.offsetY <= CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer.getGlobalY() + CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer.getHeight()
          let cond = false
          if(cond){
              CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.moveActivity(e, activity);
          } else {
            // this.firstMomentBoxSelectedPosition = e.offsetY;
            // x = e.layerX;
            CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.createSelectedMomentsContainer(
              e.layerX,
              rowNumberContainer.getY(),
              // Math.floor(e.layerY - CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getMomentTableBodyContainer().getGlobalY() / ConfigSc.cellHeight) * ConfigSc.cellHeight,//ConfigSc.toolboxSize,
              rowNumberContainer
            );
          }

          break;
        }

        //ako je selektovani unutar aktiviteta, pretrazujem njegove momente
        if (j + activity.moments.length + 1 >= num) {
          for (let k = 0; k < activity.moments.length; k++) {
            const moment = activity.moments[k];
            if (j + 1 + k + 1 == num) {
              // selectedActivityOrMoment = moment;
              CpspRef.cmp.activityIndex = Number(activity.id);
              CpspRef.cmp.planIndex = Number(moment.id);
          //     let cond = CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer != undefined &&
          // CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer != null &&
          // CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer.getGlobalY() <= e.offsetY &&
          // e.offsetY <= CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer.getGlobalY() + CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer.getHeight()
              let cond = false
              console.log(cond)
              if(cond){
                CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.moveMoment(e, activity, moment);
              } else {
              // this.firstMomentBoxSelectedPosition = e.offsetY;
              // x = e.layerX;
              CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.createSelectedMomentsContainer(
                e.layerX,
                rowNumberContainer.getY(),
                // Math.floor(e.layerY - CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getMomentTableBodyContainer().getGlobalY() / ConfigSc.cellHeight) * ConfigSc.cellHeight , //ConfigSc.toolboxSize,
                rowNumberContainer
              );
            }
              break;
            }
          }
        }
        j = j + activity.moments.length + 1;
      }

      // rowNumberContainer.addRemoveEventsForMouseDownEvent(() => {
      //   CpspRef.cmp.rowNumberSelecting = false;
      //   if(CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.firstMove != 0){
      //     let selectionBox = CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectionBox;
      //     if (selectionBox) {
      //       const boxHeight = selectionBox.getHeight();
      //       CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.removeChildById(selectionBox.getId());
      //       selectionBox = null;
      //       ConfigSc.boxHeight = 0;
      //       this.canvas.endSelection();

      //       if (boxHeight < 0) this.firstMomentBoxSelectedPosition += boxHeight;
      //       ConfigSc.firstMomentBoxSelectedPositionDelta = this.firstMomentBoxSelectedPosition;
      //       CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer = new SelectedMomentsContainer(
      //         x,
      //         CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectionBox.getY(),
      //         // this.firstMomentBoxSelectedPosition +
      //         //   ConfigSc.deltaMovementBetweenBoxes,
      //         ConfigSc.sideCanvasSize - ConfigSc.sideSectionRightBorderWidth,
      //         boxHeight < 0 ? boxHeight * -1 : boxHeight,
      //         this.canvas,
      //         CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.momentTableBodyContainer.getInnerContainer()
      //       );

      //       if (boxHeight < 0) {
      //         CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer.setY(
      //           CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer.getY() -
      //             (CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer.getSelectedMoments().length - 1) *
      //               ConfigSc.cellHeight
      //         );
      //       }
      //       CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer.draw();
      //       this.canvas.addChild(CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer);
      //     }
      //   }
      //   else{
      //     if(selectedActivityOrMoment.state_number){
      //       CpspRef.cmp.activityIndex = selectedActivityOrMoment.activity_id;
      //       CpspRef.cmp.planIndex = selectedActivityOrMoment.id;
      //     } else {
      //       CpspRef.cmp.activityIndex = selectedActivityOrMoment.id;
      //       CpspRef.cmp.planIndex = null;
      //     }


      //     CpspRef.cmp.changeFontFamilyInputValue = selectedActivityOrMoment.styles.fontFamily;
      //     CpspRef.cmp.changeFontSizeInputValue = selectedActivityOrMoment.styles.fontSize;
      //     CpspRef.cmp.changeBackgroundColorInputValue =
      //       selectedActivityOrMoment.styles.backgroundColor;
      //     CpspRef.cmp.changeTextColorInputValue = selectedActivityOrMoment.styles.color;
      //     CpspRef.cmp.changeBackgroundTapeColorInputValue = selectedActivityOrMoment.tape_color;
      //     CpspRef.cmp.changeFontWeightInputValue =
      //       selectedActivityOrMoment.styles.fontWeight == "bold" ? true : false;
      //     CpspRef.cmp.changeFontStyleInputValue =
      //       selectedActivityOrMoment.styles.fontStyle == "italic" ? true : false;
      //     CpspRef.cmp.changeFontDecorationInputValue =
      //       selectedActivityOrMoment.styles.fontDecoration == "underline" ? true : false;

      //     CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.highlightedRow = num;
      //     CpspRef.cmp.tapeMomActId = null;
      //   }

      //   CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay()
      // });
    });


    const rowNumberText = new TextRenderer(this.rowNumber.toString(), this.canvas, rowNumberContainer);
    rowNumberText.setColor('white');
    rowNumberText.setFontSize(11);
    rowNumberText.setAlignment('center', 'center');
    rowNumberText.updateTextDimensions();
    this.rowNumber++;
    this.posH += ConfigSc.cellHeight;
  }

    addAllRowNumbers() {
        let h = 0;
        this.rowNumber = 1;
        while (h <= this.getHeight() + ConfigSc.cellHeight) {
            this.addRowNumber(h);
            h += ConfigSc.cellHeight;
        }
    }

    getLastRowNumber(){ return this.rowNumber; }

    getLastRowPosition(){ return this.posH; }

    refreshDisplay() {
        this.innerContainer.removeAllChildren();
        this.addAllRowNumbers();
        this.draw();
    }
}
